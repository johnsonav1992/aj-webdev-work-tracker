export const formatStatusLabel = (status: string) =>
  status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : status;
