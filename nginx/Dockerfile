FROM owasp/modsecurity-crs:3.3-nginx-202308070908

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget git gnupg build-essential \
    libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev \
    libxml2 libxml2-dev libyajl-dev \
    libtool automake apache2-dev \
    libcurl4-openssl-dev pkgconf ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 -b v3/master https://github.com/SpiderLabs/ModSecurity /opt/ModSecurity && \
    cd /opt/ModSecurity && \
    git submodule update --init --recursive && \
    ./build.sh && ./configure && make -j$(nproc) && make install

RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git /opt/ModSecurity-nginx

RUN cd /opt && \
    curl -LO http://nginx.org/download/nginx-1.24.0.tar.gz && \
    tar zxvf nginx-1.24.0.tar.gz && \
    cd nginx-1.24.0 && \
    ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx && \
    make modules && \
    cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules/

COPY ./nginx/main.conf /etc/nginx/modsec/main.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf


# Copy virtual host config
COPY ./nginx/conf.d/ /etc/nginx/conf.d/


RUN rm -rf /docker-entrypoint.d/* /etc/nginx/templates/ /opt/owasp-crs

RUN mkdir -p /etc/nginx/modsec/rules && \
    git clone --depth 1 https://github.com/coreruleset/coreruleset /opt/owasp-crs && \
    cp /opt/owasp-crs/crs-setup.conf.example /etc/nginx/modsec/crs-setup.conf && \
    cp /opt/owasp-crs/rules/*.data /etc/nginx/modsec/rules/ && \
    cp /opt/owasp-crs/rules/*.conf /etc/nginx/modsec/rules/

RUN sed -i '/id:949110/!b;n;s/deny,//' /etc/nginx/modsec/rules/REQUEST-949-BLOCKING-EVALUATION.conf

RUN touch /var/log/nginx/modsec_audit.log && \
    chmod 640 /var/log/nginx/modsec_audit.log && \
    chown www-data:www-data /var/log/nginx/modsec_audit.log

EXPOSE 80 443

ENTRYPOINT []

CMD ["nginx", "-g", "daemon off;"]
