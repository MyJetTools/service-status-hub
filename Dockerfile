FROM ubuntu:22.04
COPY ./target/release/services-status-hub ./target/release/services-status-hub
COPY ./wwwroot ./wwwroot 
ENTRYPOINT ["./target/release/services-status-hub"]