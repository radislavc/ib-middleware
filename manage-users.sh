#!/bin/bash

# Configuration
PASS_FILE="./mosquitto/config/password.txt"
CONTAINER_NAME="mosquitto"

echo "🔐 MQTT User Management Tool for videon.click"
echo "----------------------------------------------"

# 1. Get input
read -p "Enter Username: " USERNAME
read -s -p "Enter Password: " PASSWORD
echo ""

# 2. Check if file exists to determine the flag
if [ ! -f "$PASS_FILE" ]; then
    mkdir -p ./mosquitto/config
    touch "$PASS_FILE"
    FLAG="-c" # Create new file
    echo "🆕 Creating new password file..."
else
    FLAG="-b" # Batch mode (update/append)
    echo "🔄 Updating existing password file..."
fi

# 3. Generate the hash using Docker
docker run --rm \
  -v $(pwd)/mosquitto/config:/mosquitto/config \
  eclipse-mosquitto:2-alpine \
  mosquitto_passwd $FLAG /mosquitto/config/password.txt "$USERNAME" "$PASSWORD"

# 4. Check if successful and restart container
if [ $? -eq 0 ]; then
    echo "✅ Success! User '$USERNAME' added."
    echo "🔄 Restarting MQTT container to apply changes..."
    docker restart $CONTAINER_NAME
    echo "🚀 Done! Your new credentials are live."
else
    echo "❌ Error: Failed to generate password hash."
    exit 1
fi