use std::sync::Arc;

use my_http_server::{HttpContext, HttpFailResult, HttpOkResult, HttpOutput};

use crate::app_ctx::AppContext;

use my_http_server::macros::*;

use super::models::ServicesStatusResponse;

#[http_route(
    method: "GET",
    route: "/api/status",
    controller: "api",
    description: "Get Services Status",
    summary: "Returns Services Status",
    result:[
        {status_code: 200, description: "Rows", model: "ServicesStatusResponse"},
    ]
)]
pub struct GetStatusAction {
    app: Arc<AppContext>,
}

impl GetStatusAction {
    pub fn new(app: Arc<AppContext>) -> Self {
        Self { app }
    }
}
async fn handle_request(
    action: &GetStatusAction,
    _ctx: &HttpContext,
) -> Result<HttpOkResult, HttpFailResult> {
    let response: ServicesStatusResponse = {
        let read_access = action.app.response.lock().await;
        read_access.clone()
    };

    return HttpOutput::as_json(response).into_ok_result(true).into();
}
