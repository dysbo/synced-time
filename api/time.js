export default async (req, res) => {
  const apiUrl = 'https://worldtimeapi.org/api/timezone/America/New_York';
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Set a cache control header to let the browser cache the response for a short time
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch time from World Time API' });
  }
};
