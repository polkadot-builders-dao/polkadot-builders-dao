export const shortenAddress = (address: string, keepStart = 6, keepEnd = 6) => {
  return `${address.substring(0, keepStart)}…${address.substring(
    address.length - keepEnd
  )}`;
};
