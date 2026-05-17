import { ValidationError } from "../errors.js";

export function validateDestinationDomain(urlString: string, allowed: string[]): void {
  let url: URL;
  try { url = new URL(urlString); }
  catch { throw new ValidationError(`Invalid destinationUrl: ${urlString}`, { urlString }); }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ValidationError(`destinationUrl must be http(s): ${urlString}`, { protocol: url.protocol });
  }
  const host = url.hostname.toLowerCase();
  const ok = allowed.some(d => host === d.toLowerCase() || host.endsWith(`.${d.toLowerCase()}`));
  if (!ok) {
    throw new ValidationError(`destinationUrl host '${host}' not in brand.allowedDomains`, { host, allowed });
  }
}
