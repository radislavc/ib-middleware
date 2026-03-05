const mqtt = require('mqtt');
const fs = require('fs');

// Connect using the Docker service name 'mqtt'
const client = mqtt.connect('mqtt://mqtt:1883', {
    username: 'devuser',
    password: 'devpass'
});

const filePath = '/var/www/html/traffic.json';
const MAX_MESSAGES = 20;
let trafficBuffer = [];

client.on('connect', () => {
    client.subscribe('#');
});

client.on('message', (topic, message) => {
    const entry = {
        topic,
        payload: message.toString(),
        time: new Date().toISOString()
    };
    trafficBuffer.unshift(entry);
    if (trafficBuffer.length > MAX_MESSAGES) trafficBuffer.pop();

    try {
        fs.writeFileSync(filePath, JSON.stringify(trafficBuffer));
    } catch (err) {
        console.error("Write error:", err);
    }
});