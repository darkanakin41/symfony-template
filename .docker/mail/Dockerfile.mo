FROM djfarrelly/maildev
LABEL maintainer="Pierre LEJEUNE <darkanakin41@gmail.com>"
{{#DOCKER_DEVBOX_COPY_CA_CERTIFICATES}}

COPY .ca-certificates/* /usr/local/share/ca-certificates/
RUN apk add --update ca-certificates && update-ca-certificates
{{/DOCKER_DEVBOX_COPY_CA_CERTIFICATES}}
