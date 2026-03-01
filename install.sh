#!/bin/bash
# 1. Update and install system dependencies
apt-get update -y
apt-get install -y docker.io git certbot

# 2. Setup 2GB Swap for t3.nano (Required for 512MB RAM)
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile && chmod 600 /swapfile
    mkswap /swapfile && swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "✅ Swap file created."
else
    echo "ℹ️ Swap file already exists."
fi

# 3. Start and Enable Docker
systemctl start docker && systemctl enable docker

# 4. Setup initial Mosquitto password file
# We use $(pwd) because you are already in the repo folder
mkdir -p ./mosquitto/config
touch ./mosquitto/config/password.txt

echo "🔐 Generating initial 'devuser' credentials..."
docker run --rm -v $(pwd)/mosquitto/config/password.txt:/password.txt \
eclipse-mosquitto:2-alpine mosquitto_passwd -b /password.txt devuser devpass

# 5. Launch the containers
echo "🚀 Starting Docker Compose..."
docker compose up -d

echo "------------------------------------------------"
echo "✅ Installation Complete!"
echo "Next step: Run 'sudo certbot certonly --standalone -d videon.click'"
echo "Then: 'sudo docker restart nginx'"