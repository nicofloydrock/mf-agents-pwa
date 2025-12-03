export type HostConfig = {
  token: string;
  user?: { id: string; name: string };
  notify?: (message: string) => Promise<void> | void;
};
