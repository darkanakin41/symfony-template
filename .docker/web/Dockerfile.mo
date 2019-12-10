FROM nginx:stable
LABEL maintainer="Pierre LEJEUNE <darkanakin41@gmail.com>"
{{#DOCKER_DEVBOX_COPY_CA_CERTIFICATES}}

COPY .ca-certificates/* /usr/local/share/ca-certificates/
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/* \
&& update-ca-certificates
{{/DOCKER_DEVBOX_COPY_CA_CERTIFICATES}}
