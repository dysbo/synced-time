// A serverless function to stream real-time time updates with heartbeats.
export default function handler(req, res) {
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const framerate = req.query.fps ? parseInt(req.query.fps, 10) : 60;

  // The main interval for sending time data
  const timeInterval = setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const milliseconds = now.getMilliseconds();
    const frames = Math.floor((milliseconds / 1000) * framerate);
    const framesFormatted = String(frames).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}:${framesFormatted}`;

    res.write(`data: ${timeString}\n\n`);
  }, 1000 / framerate);

  // Keep-alive heartbeat to prevent timeouts on free serverless platforms.
  // We'll send a ping every 20 seconds.
  const heartbeatInterval = setInterval(() => {
    res.write(':ping\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(timeInterval);
    clearInterval(heartbeatInterval);
    res.end();
  });
}
