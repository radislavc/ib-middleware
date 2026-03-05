const mqtt = require('mqtt');

/**
 * ENVIRONMENT CONFIGURATION
 * Local Default: mqtt://localhost:1883 (Direct to Mosquitto)
 * Prod Example:  mqtt://videon.click:1883
 */
const brokerUrl = process.env.MQTT_URL || 'mqtt://localhost:1883';

const options = {
    username: process.env.MQTT_USER || 'devuser',
    password: process.env.MQTT_PASSWORD || 'devpass',
    clientId: 'node_subscriber_' + Math.random().toString(16).substring(2, 8)
};

console.log(`📡 Attempting to connect to: ${brokerUrl}`);
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log(`✅ Connected to Broker via TCP at ${brokerUrl}`);

    const topic = 'sensors/temp';
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`📩 Subscribed to topic: ${topic}`);
        }
    });
});

client.on('message', (topic, message) => {
    // Format the output for readability
    console.log(`-----------------------------------`);
    console.log(`Topic: ${topic}`);
    console.log(`Data:  ${message.toString()}`);
});

client.on('error', (err) => {
    console.error('❌ Connection error:', err.message);
});