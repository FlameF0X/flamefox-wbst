const express = require('express');
const path = require('path');
const si = require('systeminformation'); // Import systeminformation package

const app = express();
const PORT = 3030;
const IP = '192.168.100.2'; //priv ip 192.168.100.2 // pub ip 188.26.6.30

// Serve static files like CSS, JS, and additional HTML from the public directory
app.use(express.static(path.join(__dirname)));

// Serve the main.html file
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'main.html'));
});

// Serve other specific HTML files
app.get('/muffinlm.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'muffinlm.html'));
});

app.get('/stats.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'stats.html'));
});

app.get('/404.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '404.html'));
});

// API endpoint to serve stats data
app.get('/api/stats', async (req, res) => {
    try {
        // Get system stats
        const cpu = await si.currentLoad();
        const memory = await si.mem();

        // Prepare data to send to the client
        const stats = {
            cpu: {
                usage: cpu.currentLoad
            },
            memory: {
                // Convert to GB
                total: (memory.total / 1024 / 1024 / 1024).toFixed(2),
                used: (memory.used / 1024 / 1024 / 1024).toFixed(2),
                free: (memory.free / 1024 / 1024 / 1024).toFixed(2)
            }
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).send('Error fetching stats');
    }
});

// Start the server
app.listen(PORT, IP, () => {
    console.log(`Server running at http://localhost:${PORT} or on network at http://${IP}:${PORT}`);
});
