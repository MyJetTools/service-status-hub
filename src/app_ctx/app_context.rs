use flurl::{my_ssh::SshSessionsPool, my_tls::ClientCertificate};
use rust_extensions::AppStates;
use tokio::sync::Mutex;

use crate::http::controllers::status_controller::models::ServicesStatusResponse;

use std::{collections::BTreeMap, sync::Arc};

pub const APP_VERSION: &'static str = env!("CARGO_PKG_VERSION");

pub struct AppContext {
    pub settings_reader: Arc<crate::settings::SettingsReader>,
    pub app_states: Arc<AppStates>,
    pub process_id: String,
    pub client_certificate: Option<ClientCertificate>,
    pub response: Mutex<ServicesStatusResponse>,
    pub ssh_sessions_pool: Arc<SshSessionsPool>,
}

impl AppContext {
    pub async fn new(settings_reader: Arc<crate::settings::SettingsReader>) -> AppContext {
        let settings = settings_reader.get_settings().await;

        let client_certificate = if let Some(cert_file_name) = &settings.cert_file_name {
            if let Some(cert_password) = &settings.cert_password {
                Some(
                    ClientCertificate::load_pks12_from_file(cert_file_name, cert_password)
                        .await
                        .unwrap(),
                )
            } else {
                panic!("CertPassword is not set");
            }
        } else {
            None
        };

        AppContext {
            app_states: Arc::new(AppStates::create_initialized()),

            settings_reader,
            process_id: uuid::Uuid::new_v4().to_string(),
            client_certificate,
            ssh_sessions_pool: Arc::new(SshSessionsPool::new()),
            response: Mutex::new(ServicesStatusResponse {
                ok: BTreeMap::new(),
                err: BTreeMap::new(),
            }),
        }
    }
}
