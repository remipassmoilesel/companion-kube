FROM nginx:1.13.9-alpine

RUN mkdir -p /server
RUN mkdir -p /logs

COPY build /server/build
COPY applications /server/front-applications
COPY scripts /server/scripts
COPY templates /server/templates

COPY config.js /server/config.js
COPY package.json /server/package.json

RUN apk update \
      && apk add nodejs

RUN cd /server \
      && npm install --production

RUN mkdir -p /var/log/nginx/
RUN touch /var/log/nginx/error.log

ENTRYPOINT /server/scripts/entrypoint.sh
