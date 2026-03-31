import { spawn } from 'child_process';
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Run your C++ Tracker (Ensure it's compiled: g++ cpp_tracker.cpp -o cpp_tracker)
const tracker = spawn('./cpp_tracker');

tracker.stdout.on('data', (data) => {
    try {
        const telemetry = JSON.parse(data.toString());
        io.emit('marketUpdate', telemetry);
        console.log('Pushing Telemetry:', telemetry.spx);
    } catch (e) {
        // Handle non-JSON lines or partial buffers
    }
});

httpServer.listen(3000, () => {
  console.log('Stargate Backend: http://localhost:3000');
});
