const mqtt = require('mqtt');

/**
 * ENVIRONMENT CONFIGURATION
 * Local Default: ws://localhost:8080/mqtt (Nginx Proxy)
 * Prod Example:  wss://videon.click/mqtt
 */
const brokerUrl = process.env.MQTT_URL || 'ws://localhost:8080/mqtt';

const options = {
    username: process.env.MQTT_USER || 'devuser',
    password: process.env.MQTT_PASSWORD || 'devpass',
    clientId: 'node_publisher_' + Math.random().toString(16).substring(2, 8),
    connectTimeout: 4000,
    reconnectPeriod: 1000,
};

console.log(`📡 Attempting to connect to: ${brokerUrl}`);
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log(`🚀 Connected to Broker at ${brokerUrl}`);

    // Publish a simulated sensor message every 5 seconds
    setInterval(() => {
        const payload = JSON.stringify({
            temp: (Math.random() * 30).toFixed(2),
            timestamp: new Date().toISOString(),
            client: options.clientId
        });

        client.publish('sensors/temp', payload, { qos: 1 });
        console.log('📤 Published:', payload);
    }, 5000);
});

client.on('error', (err) => {
    console.error('❌ Connection Error:', err.message);
});

client.on('offline', () => {
    console.warn('⚠️ Client is offline. Check your Docker containers or Network.');
});