FROM nginx:1.21-alpine
SHELL ["/bin/ash", "-oeux", "pipefail", "-c"]

ENV TZ=UTC

RUN apk update && \
  apk add --update --no-cache --virtual=.build-dependencies g++

# nginx config file
COPY ./infra/docker/nginx/*.conf /etc/nginx/conf.d/

WORKDIR /work/backend

EXPOSE 8080