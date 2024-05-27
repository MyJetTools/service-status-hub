use std::{collections::BTreeMap, sync::Arc};

use flurl::FlUrlResponse;

use serde_derive::{Deserialize, Serialize};

use rust_extensions::{MyTimerTick, StopWatch};

use crate::{
    app_ctx::AppContext, http::controllers::status_controller::models::ServicesStatusResponse,
};

pub struct DataCollector {
    app: Arc<AppContext>,
}

impl DataCollector {
    pub fn new(app: Arc<AppContext>) -> Self {
        Self { app }
    }
}

#[async_trait::async_trait]
impl MyTimerTick for DataCollector {
    async fn tick(&self) {
        let settings_model = self.app.settings_reader.get_settings().await;

        let mut services = ServicesStatusResponse {
            ok: BTreeMap::new(),
            err: BTreeMap::new(),
        };

        for settings in settings_model.services {
            let mut sw = StopWatch::new();
            sw.start();

            let mut fl_url = flurl::FlUrl::new(settings.url.as_str());

            if settings.use_certificate {
                fl_url = fl_url
                    .with_client_certificate(self.app.client_certificate.as_ref().unwrap().clone());
            }

            let result = fl_url.get().await;

            match result {
                Ok(response) => match get_ok_result(response).await {
                    Ok(model) => {
                        sw.pause();

                        for (domain, srvs) in model {
                            if !services.ok.contains_key(domain.as_str()) {
                                services.ok.insert(domain.clone(), BTreeMap::new());
                            }

                            let domain_services = services.ok.get_mut(domain.as_str()).unwrap();

                            for srv in srvs {
                                if !domain_services.contains_key(srv.id.as_str()) {
                                    domain_services.insert(srv.id.clone(), BTreeMap::new());
                                }

                                let by_srv_id = domain_services.get_mut(srv.id.as_str()).unwrap();

                                by_srv_id.insert(settings.env.clone(), srv);
                            }
                        }
                    }
                    Err(err) => {
                        sw.pause();
                        services.err.insert(settings.env, err);
                    }
                },
                Err(err) => {
                    sw.pause();
                    services.err.insert(settings.env, format!("{:?}", err));
                }
            }
        }

        let mut write_access = self.app.response.lock().await;
        *write_access = services;
    }
}

async fn get_ok_result(
    mut result: FlUrlResponse,
) -> Result<BTreeMap<String, Vec<ServiceModel>>, String> {
    if result.get_status_code() != 200 {
        return Err(format!(
            "Http Status code is not 200. It is {}",
            result.get_status_code()
        ));
    }

    let get_body_result = result.get_body_as_slice().await;

    if let Err(err) = get_body_result {
        return Err(format!("Can not get body: {:?}", err));
    }

    let body = get_body_result.unwrap();

    let result = serde_json::from_slice::<ServicesModel>(body);

    if let Err(err) = result {
        return Err(format!(
            "Can not deserialize into api/isalive model: {:?}",
            err
        ));
    }

    Ok(result.unwrap().services)
}

#[derive(Serialize, Deserialize, Debug, Clone, my_http_server::macros::MyHttpObjectStructure)]
pub struct ServiceModel {
    pub id: String,
    pub name: Option<String>,

    pub url: Option<String>,
    pub version: Option<String>,
    pub git_hub_version: Option<String>,
    pub to_release_version: Option<String>,
    #[serde(rename = "lastOk")]
    pub last_ok: Option<i64>,
    #[serde(rename = "lastError")]
    pub last_error: Option<String>,
    #[serde(rename = "lastPingDuration")]
    pub last_ping_duration: Option<String>,
    #[serde(rename = "envInfo")]
    pub env_info: Option<String>,
    pub started: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServicesModel {
    pub services: BTreeMap<String, Vec<ServiceModel>>,
}
