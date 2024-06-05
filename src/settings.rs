use rust_extensions::ShortString;
use serde_derive::{Deserialize, Serialize};

#[derive(my_settings_reader::SettingsModel, Serialize, Deserialize, Debug, Clone)]
pub struct SettingsModel {
    #[serde(rename = "Services")]
    pub services: Vec<ServiceSettings>,

    pub git_hub_versions_url: Option<String>,

    #[serde(rename = "CertFileName")]
    pub cert_file_name: Option<String>,
    #[serde(rename = "CertPassword")]
    pub cert_password: Option<String>,
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
}
