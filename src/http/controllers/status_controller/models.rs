use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

use crate::background::ServiceModel;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ServicesStatusResponse {
    pub ok: BTreeMap<String, BTreeMap<String, BTreeMap<String, ServiceModel>>>,
    pub err: BTreeMap<String, String>,
}
