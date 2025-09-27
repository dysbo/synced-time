export const getTime = (fps: number): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const milliseconds = now.getMilliseconds();
  const frames = Math.floor((milliseconds / 1000) * fps);
  const framesFormatted = String(frames).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}:${framesFormatted}`;
}
