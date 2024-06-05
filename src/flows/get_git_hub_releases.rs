use std::collections::BTreeMap;

use flurl::FlUrl;
use serde::Deserialize;

use crate::{
    app_ctx::AppContext, http::controllers::status_controller::models::ServicesStatusResponse,
};

pub async fn get_git_hub_releases(app: &AppContext) -> ServicesStatusResponse {
    let mut response: ServicesStatusResponse = {
        let read_access = app.response.lock().await;
        read_access.clone()
    };

    let get_hub_versions_url = app.settings_reader.git_hub_versions_url().await;

    if get_hub_versions_url.is_none() {
        return response;
    }

    let get_hub_versions_url = get_hub_versions_url.unwrap();

    let versions_response = FlUrl::new(get_hub_versions_url.as_str()).get().await;

    if let Err(err) = &versions_response {
        println!(
            "Can not read from {} : Err: {:?}",
            get_hub_versions_url.as_str(),
            err
        );
        return response;
    }

    let mut versions_response = versions_response.unwrap();

    let body_as_slice = versions_response.get_body_as_slice().await;

    if body_as_slice.is_err() {
        return response;
    }

    let body_as_slice = body_as_slice.unwrap();

    let model = serde_json::from_slice::<BTreeMap<String, Vec<GitHubVersionsModel>>>(body_as_slice);

    if model.is_err() {
        return response;
    }

    let model = model.unwrap();

    for (_, items) in model {
        for item in items {
            for values in response.ok.values_mut() {
                if let Some(services) = values.get_mut(item.id.as_str()) {
                    for (_, service) in services {
                        service.git_hub_version = item.git_hub_version.clone();
                        service.to_release_version = item.released_version.clone();
                    }
                }
            }
        }
    }

    response
}

#[derive(Debug, Clone, Deserialize)]
pub struct GitHubVersionsModel {
    pub id: String,
    pub released_version: Option<String>,
    pub git_hub_version: Option<String>,
}
