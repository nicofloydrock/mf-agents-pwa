export type HostConfig = {
  token: string;
  user?: { id: string; name: string };
  notify?: (message: string, options?: { title?: string; target?: string }) => Promise<void> | void;
};
