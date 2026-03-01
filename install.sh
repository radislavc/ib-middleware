#!/bin/bash
apt-get update -y
apt-get install -y docker.io git certbot

# Setup 2GB Swap for t3.nano
fallocate -l 2G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

systemctl start docker && systemctl enable docker

# Replace with your actual GitHub Repo
cd /home/ubuntu
git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO

# Setup initial password file
mkdir -p ./mosquitto/config
touch ./mosquitto/config/password.txt
docker run --rm -v $(pwd)/mosquitto/config/password.txt:/password.txt eclipse-mosquitto:2-alpine mosquitto_passwd -b /password.txt devuser devpass

docker compose up -d