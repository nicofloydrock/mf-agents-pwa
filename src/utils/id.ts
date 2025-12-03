export const createId = () =>
  `id-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
