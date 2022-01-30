FROM ubuntu:focal AS amx_ubuntu

RUN apt-get update && apt-get -y upgrade

RUN export DEBIAN_FRONTEND=noninteractive
RUN ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
RUN apt-get update && apt-get install -y tzdata
RUN dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
			apt-utils 							\
			libpq-dev 							\
			libexiv2-27							\
			libexiv2-dev						\
			libexpat1								\
			libexpat1-dev						\
			libgd-dev								\
			libgd3									\
      libcurl4                \
			libcurl4-openssl-dev		\
			libpcre3-dev						\
			libpam0g-dev						\
			imagemagick 						\
			graphicsmagick-libmagick-dev-compat \
			libwebp-dev							\
			libidn11 								\
      libxml2 								\
			openssl 								\
      libssl-dev              \
			libtool 								\
			pkg-config 							\
			build-essential 				\
			less										\
#			vim											\
#			zip											\
#			unzip 									\
			curl 										\
#     git                     \
#     python                  \
#     ruby                    \
#     ca-certificates         \
      software-properties-common 	\
      ntp                      \
      # gdb                      \
      && rm -rf /var/lib/apt/lists/*
      
RUN apt-get update \ 
    && add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main" \
    && add-apt-repository "deb http://archive.ubuntu.com/ubuntu xenial multiverse" \
    && apt-get update && apt-get -y install --no-install-recommends \      
			libicu55 								\
			apache2 								\
			libapache2-mod-fastcgi  \
      #			postgresql 				\			
      # 		llvm-objdump			\	
      && rm -rf /var/lib/apt/lists/*


RUN a2enmod headers \
        ssl         \
        cgi         \
        fastcgi     \
        rewrite     \
        proxy       \
        proxy_http


# must have environment variable AMIDIR 
ENV AMIDIR /v8jstest

# AMIDIR/bin needs to be in the PATH
ENV PATH $AMIDIR/bin:$PATH

# v8 setup, includes and lib needed for building src
# ADD v8.tar.gz /opt/
# COPY --from=v8 /v8 /opt/v8

# must also have an actual AMIDIR and correct permissions
RUN mkdir $AMIDIR      && chmod -R 775 $AMIDIR \
 && mkdir $AMIDIR/logs && chmod -R  777 $AMIDIR/logs
 

COPY config/apache/apache2.conf /etc/apache2/apache2.conf
COPY config/apache/v8jstest.conf $AMIDIR/config/apache/
COPY config/dbvars.st $AMIDIR/config/
COPY config/v8jstest.log $AMIDIR/logs/v8jstest.log
RUN chmod 777 $AMIDIR/logs/v8jstest.log
#COPY wait-for-postgres.sh $AMIDIR/

#COPY dockerbuild/docker-entrypoint.sh /usr/local/bin/
#RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# start at $AMIDIR
WORKDIR $AMIDIR

EXPOSE 80

#ENTRYPOINT ["docker-entrypoint.sh"]
#ENTRYPOINT "put your code here" && /bin/bash
#CMD ["/usr/sbin/apache2ctl","-D","FOREGROUND"];