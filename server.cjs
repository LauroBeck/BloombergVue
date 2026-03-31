const { spawn } = require('child_process');
const http = require('http');
const io = require('socket.io')(3000);

// Run your C++ Tracker as a background process
const tracker = spawn('./cpp_tracker');

tracker.stdout.on('data', (data) => {
    try {
        const telemetry = JSON.parse(data.toString());
        io.emit('marketUpdate', telemetry);
    } catch (e) {
        console.log('Telemetry Syncing...');
    }
});

console.log('Stargate Engine listening on port 3000');
