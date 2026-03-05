const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://videon.click:1883', {
    username: 'devuser',
    password: 'devpass'
});

let liveData = {
    'Total Topics': 0,
    'Active Subscriptions': 0,
    'Clients Connected': 0,
    'Clients Total (Inc. Inactive)': 0
};

client.on('connect', () => {
    console.log('🔗 Connected to Stats Stream...');
    client.subscribe([
        '$SYS/broker/topics/count',
        '$SYS/broker/subscriptions/count',
        '$SYS/broker/clients/connected',
        '$SYS/broker/clients/total'
    ]);
});

client.on('message', (topic, message) => {
    const val = message.toString();

    if (topic.includes('topics/count')) liveData['Total Topics'] = val;
    if (topic.includes('subscriptions/count')) liveData['Active Subscriptions'] = val;
    if (topic.includes('clients/connected')) liveData['Clients Connected'] = val;
    if (topic.includes('clients/total')) liveData['Clients Total (Inc. Inactive)'] = val;

    console.clear();
    console.log(`📈 Real-time Broker Stats for videon.click`);
    console.table(liveData);
});