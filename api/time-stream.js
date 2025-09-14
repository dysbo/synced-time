// A serverless function to stream real-time time updates via Server-Sent Events.
export default function handler(req, res) {
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Get the desired frame rate from the query parameter, defaulting to 60 FPS
  const framerate = req.query.fps ? parseInt(req.query.fps, 10) : 60;

  // Function to send a single time event
  const sendTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Calculate frames based on the server's time
    const milliseconds = now.getMilliseconds();
    const frames = Math.floor((milliseconds / 1000) * framerate);
    const framesFormatted = String(frames).padStart(2, '0');
    
    // Format the time string
    const timeString = `${hours}:${minutes}:${seconds}:${framesFormatted}`;

    // Send the data to the client
    res.write(`data: ${timeString}\n\n`);
  };

  // Set the interval to send time updates at the requested frame rate
  const timer = setInterval(sendTime, 1000 / framerate);

  // Clean up the interval when the client closes the connection
  req.on('close', () => {
    clearInterval(timer);
    res.end();
  });
}
