use serde_derive::{Deserialize, Serialize};

#[derive(my_settings_reader::SettingsModel, Serialize, Deserialize, Debug, Clone)]
pub struct SettingsModel {
    #[serde(rename = "Services")]
    pub services: Vec<ServiceSettings>,
    #[serde(rename = "CertFileName")]
    pub cert_file_name: Option<String>,
    #[serde(rename = "CertPassword")]
    pub cert_password: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServiceSettings {
    pub env: String,
    pub url: String,
    #[serde(rename = "UseCertificate")]
    pub use_certificate: bool,
}
