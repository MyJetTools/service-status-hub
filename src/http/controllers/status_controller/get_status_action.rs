use std::sync::Arc;

use my_http_server::{HttpContext, HttpFailResult, HttpOkResult, HttpOutput};

use crate::app_ctx::AppContext;

use my_http_server::macros::*;

#[http_route(
    method: "GET",
    route: "/api/status",
    controller: "api",
    description: "Get Services Status",
    summary: "Returns Services Status",
    result:[
        {status_code: 200, description: "Status"},
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
    let response = crate::flows::get_git_hub_releases(&action.app).await;
    return HttpOutput::as_json(response).into_ok_result(true).into();
}
