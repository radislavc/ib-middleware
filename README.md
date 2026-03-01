# 🚀 Videon.click MQTT Infrastructure

A lightweight, Dockerized MQTT broker (Mosquitto) with an Nginx reverse proxy, optimized for **AWS EC2 t3.nano** (512MB RAM) running **Ubuntu 24.04**.

## 🏗️ Architecture
- **Mosquitto (Alpine):** MQTT Broker supporting raw TCP (1883) and Websockets (9001).
- **Nginx (Alpine):** Handles SSL termination and proxies WSS traffic to Mosquitto.
- **Domain:** `videon.click`

---

## 📂 Repository Structure
```text
.
├── docker-compose.yml       # Container orchestration & resource limits
├── mosquitto/
│   └── config/
│       └── mosquitto.conf   # Broker listeners & auth rules
└── nginx/
    └── nginx.conf           # SSL & Websocket proxy configuration

```

## 🛠️ Deployment Steps
1. Update AWS Security Group
Your EC2 instance must have these inbound rules:

SSH (22): Your IP (for management).

HTTP (80): 0.0.0.0/0 (for Let's Encrypt verification).

HTTPS (443): 0.0.0.0/0 (for Secure Websockets).

MQTT (1883): 0.0.0.0/0 (Optional: for raw TCP devices).

2. Launch EC2 with User Data
During the "Launch Instance" process on AWS:

Choose t3.nano and Ubuntu 24.04.

Go to Advanced Details > User Data.

Paste the provided deployment script (found in this repo or chat).
This script automates Docker installation, clones this repo, and sets up a 2GB Swap file.

3. Generate SSL Certificate
Once the instance is running and your domain videon.click points to the EC2 IP, SSH into the box and run:

```bash
sudo certbot certonly --standalone -d videon.click
sudo docker restart nginx
```
## 🚀 Operations & Management

### 1. Starting the Server
To start all services in the background (detached mode):
```bash
docker compose up -d
```

## 🔌 Connection Details

Use the following settings to connect your clients to the broker. Note that **Web/Mobile apps** must use the encrypted Websocket path via Nginx, while **IoT Hardware** (like ESP32 or Arduino) can connect directly to the Mosquitto port.

| Client Type | Protocol | Connection URL | Port |
| :--- | :--- | :--- | :--- |
| **Web / Mobile Apps** | `wss` (Secure Websockets) | `wss://videon.click/mqtt` | 443 |
| **IoT Hardware** | `mqtt` (Raw TCP) | `mqtt://videon.click` | 1883 |

---

### 👤 User Management
To add or update MQTT users without manually dealing with hashes, use the provided helper script:

1. **Run the script:**
   ```bash
   ./manage-users.sh

### 🔑 Authentication
All connections require the following credentials (unless changed in `password.txt`):
- **Username:** `devuser`
- **Password:** `devpass`