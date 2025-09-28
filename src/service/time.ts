export const getTime = (date: Date, fps: number): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = date.getMilliseconds();
  const frames = Math.floor((milliseconds / 1000) * fps);
  const framesFormatted = String(frames).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}:${framesFormatted}`;
}
