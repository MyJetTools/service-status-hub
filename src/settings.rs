use std::collections::HashMap;

use flurl::{my_ssh::SshCredentialsSettingsModel, FlUrl};
use rust_extensions::ShortString;
use serde_derive::{Deserialize, Serialize};

use crate::app_ctx::AppContext;

#[derive(my_settings_reader::SettingsModel, Serialize, Deserialize, Debug, Clone)]
pub struct SettingsModel {
    #[serde(rename = "Services")]
    pub services: Vec<ServiceSettings>,

    pub git_hub_versions_url: Option<String>,

    #[serde(rename = "CertFileName")]
    pub cert_file_name: Option<String>,
    #[serde(rename = "CertPassword")]
    pub cert_password: Option<String>,

    pub ssh_credentials: Option<HashMap<String, SshCredentialsSettingsModel>>,
}

impl SettingsReader {
    pub async fn git_hub_versions_url(&self) -> Option<ShortString> {
        let read_access = self.settings.read().await;

        let result = read_access.git_hub_versions_url.as_ref()?;
        Some(ShortString::from_str(result).unwrap())
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServiceSettings {
    pub env: String,
    pub url: String,
    #[serde(rename = "UseCertificate")]
    pub use_certificate: Option<bool>,
}

impl ServiceSettings {
    pub fn use_certificate(&self) -> bool {
        self.use_certificate.unwrap_or(false)
    }

    pub async fn get_fl_url(
        &self,
        app: &AppContext,
        ssh_credentials: Option<&HashMap<String, SshCredentialsSettingsModel>>,
    ) -> FlUrl {
        let over_ssh =
            flurl::my_ssh::OverSshConnectionSettings::parse(self.url.as_str(), ssh_credentials)
                .await;

        if let Some(ssh_credentials) = over_ssh.ssh_credentials {
            return flurl::FlUrl::new(over_ssh.remote_resource_string)
                .set_ssh_credentials(ssh_credentials.into())
                .set_ssh_sessions_pool(app.ssh_sessions_pool.clone());
        }

        let mut fl_url = flurl::FlUrl::new(self.url.as_str());
        if self.use_certificate() {
            fl_url =
                fl_url.with_client_certificate(app.client_certificate.as_ref().unwrap().clone());
        }

        fl_url
    }
}
