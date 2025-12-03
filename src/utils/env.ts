export const resolveApiBase = () => {
  if (import.meta.env.VITE_API_MOCK_URL) return import.meta.env.VITE_API_MOCK_URL;
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5050`;
  }
  return "http://localhost:5050";
};
