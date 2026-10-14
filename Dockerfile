FROM docker.io/library/nginx:1.28-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY *.html robots.txt sitemap.xml COPYING /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets
COPY fonts /usr/share/nginx/html/fonts
COPY files /usr/share/nginx/html/files

RUN mkdir -p /tmp/nginx \
 && chown -R 101:101 /usr/share/nginx/html /tmp/nginx /var/cache/nginx /var/run \
 && chmod -R a+rX /usr/share/nginx/html

USER 101
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
