#!/bin/bash
# Stop Nginx so Certbot can use Port 80
docker compose -f /home/ubuntu/ib-middleware/docker-compose.yml stop nginx
# Renew the cert
certbot renew
# Start Nginx back up
docker compose -f /home/ubuntu/ib-middleware/docker-compose.yml start nginx