use std::{sync::Arc, time::Duration};

use background::DataCollector;
use rust_extensions::MyTimer;

mod app_ctx;
mod background;
mod http;

mod flows;
mod settings;

#[tokio::main]
async fn main() {
    let settings_reader = crate::settings::SettingsReader::new(".services-status-hub").await;

    let settings_reader = Arc::new(settings_reader);

    let app = app_ctx::AppContext::new(settings_reader).await;

    let app = Arc::new(app);

    let mut http_server = http::start_up::setup_server(&app, 8005);

    http_server.start(app.app_states.clone(), my_logger::LOGGER.clone());

    let mut timer_5s = MyTimer::new(Duration::from_secs(3));

    timer_5s.register_timer("Data Collector", Arc::new(DataCollector::new(app.clone())));

    timer_5s.start(app.app_states.clone(), my_logger::LOGGER.clone());

    app.app_states.wait_until_shutdown().await;
}
