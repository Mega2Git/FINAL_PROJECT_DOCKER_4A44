FROM --platform=amd64 mysql:9.1.0

# Accept environment variables as build arguments
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD

# Set these build arguments as runtime environment variables
ENV MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
ENV MYSQL_DATABASE=$MYSQL_DATABASE
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD

# Expose the MySQL port
EXPOSE 3306

COPY ./init.sql /docker-entrypoint-initdb.d/

# Start the MySQL service
CMD ["mysqld"]
