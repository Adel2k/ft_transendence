FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/certs/localhost.pem /etc/nginx/certs/localhost.pem
COPY ./nginx/certs/localhost-key.pem /etc/nginx/certs/localhost-key.pem

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
