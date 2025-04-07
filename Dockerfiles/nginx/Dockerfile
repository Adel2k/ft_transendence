FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./certs/localhost.pem /etc/nginx/certs/localhost.pem
COPY ./certs/localhost-key.pem /etc/nginx/certs/localhost-key.pem

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
