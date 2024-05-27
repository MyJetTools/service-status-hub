use rust_extensions::ShortString;
use serde_derive::{Deserialize, Serialize};

#[derive(my_settings_reader::SettingsModel, Serialize, Deserialize, Debug, Clone)]
pub struct SettingsModel {
    #[serde(rename = "Services")]
    pub services: Vec<ServiceSettings>,

    pub git_hub_versions_url: String,

    #[serde(rename = "CertFileName")]
    pub cert_file_name: Option<String>,
    #[serde(rename = "CertPassword")]
    pub cert_password: Option<String>,
}

impl SettingsReader {
    pub async fn git_hub_versions_url(&self) -> ShortString {
        let read_access = self.settings.read().await;
        ShortString::from_str(&read_access.git_hub_versions_url).unwrap()
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServiceSettings {
    pub env: String,
    pub url: String,
    #[serde(rename = "UseCertificate")]
    pub use_certificate: bool,
}
