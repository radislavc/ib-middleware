const mqtt = require('mqtt');
const { spawn } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// --- Configuration ---
const BROKER_URL = 'mqtt://videon.click:1883';
const TOPIC = 'commands/video';
const SAVE_PATH = path.join(__dirname, 'video_cache.mp4');
const AUTH = { username: 'devuser', password: 'devpass' };

let mpvProcess = null;

// --- Video Player Logic ---
function playVideo(filePath) {
    // Kill existing player if running
    if (mpvProcess) {
        console.log('🛑 Stopping current video...');
        mpvProcess.kill();
    }

    console.log('🎬 Starting playback:', filePath);

    // Launch mpv in fullscreen, no onscreen controller, and loop
    // We use --vo=gpu for RPi4 hardware acceleration on Ubuntu
    mpvProcess = spawn('mpv', [
        '--fs',
        '--no-osc',
        '--no-osd-bar',
        '--loop',
        '--vo=gpu',
        '--hwdec=mmal',
        filePath
    ], {
        env: { ...process.env, DISPLAY: ':0' } // Ensures it finds the HDMI output
    });

    mpvProcess.on('error', (err) => console.error('❌ MPV Error:', err));
}

// --- Download Logic ---
async function downloadVideo(url) {
    console.log('📥 Downloading new video...');
    const writer = fs.createWriteStream(SAVE_PATH);
    const response = await axios({ url, method: 'GET', responseType: 'stream' });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// --- MQTT Connection ---
const client = mqtt.connect(BROKER_URL, AUTH);

client.on('connect', () => {
    console.log('✅ Connected to videon.click');
    client.subscribe(TOPIC);
    console.log(`📡 Waiting for commands on: ${TOPIC}`);
});

client.on('message', async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        if (data.url) {
            console.log('🔗 New URL received:', data.url);
            await downloadVideo(data.url);
            console.log('✅ Download finished.');
            playVideo(SAVE_PATH);
        }
    } catch (err) {
        console.error('❌ Failed to process message:', err.message);
    }
});