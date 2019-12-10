server {
    root /var/www/html/public;
    index index.html index.php;

    location / {
        try_files $uri @rewriteapp;
    }

    location @rewriteapp {
        rewrite ^(.*)$ /index.php/$1 last;
    }

    location ~ ^/index.php(/|$) {
        fastcgi_split_path_info ^(.+?\.php)(|/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_param QUERY_STRING $query_string;
        fastcgi_intercept_errors on;
        fastcgi_pass php.{{COMPOSE_NETWORK_NAME}}:9000;
    }
}
