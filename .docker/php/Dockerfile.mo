FROM php:7.3-fpm
LABEL maintainer="Pierre LEJEUNE <darkanakin41@gmail.com>"

COPY .ca-certificates/* /usr/local/share/ca-certificates/
RUN update-ca-certificates

RUN docker-php-ext-install opcache

RUN apt-get update -y && apt-get install -y zlib1g-dev libzip-dev && rm -rf /var/lib/apt/lists/* && docker-php-ext-install zip

RUN yes | pecl install xdebug && docker-php-ext-enable xdebug

RUN docker-php-ext-install pdo pdo_mysql

# Addition of PHP-GD
RUN apt-get update -y && apt-get install -y libwebp-dev libjpeg62-turbo-dev libpng-dev libxpm-dev libfreetype6-dev
RUN apt-get update -y && apt-get install -y zlib1g-dev
RUN docker-php-ext-install mbstring
RUN apt-get install -y libzip-dev
RUN docker-php-ext-install zip
RUN docker-php-ext-configure gd --with-gd --with-webp-dir --with-jpeg-dir \
    --with-png-dir --with-zlib-dir --with-xpm-dir --with-freetype-dir \
    --enable-gd-native-ttf
RUN docker-php-ext-install gd

ENV COMPOSER_HOME /composer
ENV PATH /composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1

RUN curl -fsSL -o /tmp/composer-setup.php https://getcomposer.org/installer \
&& curl -fsSL -o /tmp/composer-setup.sig https://composer.github.io/installer.sig \
&& php -r "if (hash('SHA384', file_get_contents('/tmp/composer-setup.php')) !== trim(file_get_contents('/tmp/composer-setup.sig'))) { unlink('/tmp/composer-setup.php'); echo 'Invalid installer' . PHP_EOL; exit(1); }" \
&& php /tmp/composer-setup.php --no-ansi --install-dir=/usr/local/bin --filename=composer --snapshot && rm -rf /tmp/composer-setup.php \
&& apt-get update -y && apt-get install -y git zip unzip && rm -rf /var/lib/apt/lists/* \
&& composer global require hirak/prestissimo


RUN apt-get update -y && apt-get install -y msmtp msmtp-mta && rm -rf /var/lib/apt/lists/* \
&& echo 'sendmail_path = "/usr/sbin/sendmail -t -i"' > /usr/local/etc/php/conf.d/mail.ini

RUN mkdir -p "$COMPOSER_HOME/cache" \
&& mkdir -p "$COMPOSER_HOME/vendor" \
&& chown -R www-data:www-data $COMPOSER_HOME \
&& chown -R www-data:www-data /var/www

# fixuid
ADD fixuid.tar.gz /usr/local/bin
RUN chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid
COPY fixuid.yml /etc/fixuid/config.yml
USER www-data

VOLUME /composer/cache

ENTRYPOINT ["fixuid","-q","docker-php-entrypoint"]
CMD ["php-fpm"]
