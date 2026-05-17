import { describe, expect, it } from "vitest";
import { isPublicHttpUrl } from "../../src/webhook-dispatcher.js";

describe("isPublicHttpUrl", () => {
  it.each([
    ["https://my-app.example.com/webhook", true],
    ["http://example.com:8080/path", true],
    ["https://1.2.3.4/x", true],
    ["https://[2001:db8::1]/x", true]
  ])("accepts public URL: %s", (url, expected) => {
    expect(isPublicHttpUrl(url)).toBe(expected);
  });

  it.each([
    ["http://localhost/x", "localhost"],
    ["http://127.0.0.1/x", "loopback"],
    ["http://127.42.0.1/x", "loopback range"],
    ["http://10.0.0.1/x", "RFC 1918"],
    ["http://172.16.0.1/x", "RFC 1918"],
    ["http://172.31.255.255/x", "RFC 1918"],
    ["http://192.168.1.1/x", "RFC 1918"],
    ["http://169.254.169.254/x", "link-local (AWS IMDS)"],
    ["http://0.0.0.0/x", "any"],
    ["http://224.0.0.1/x", "multicast"],
    ["http://my-server.local/x", ".local TLD"],
    ["http://service.internal/x", ".internal TLD"],
    ["ftp://example.com/x", "non-http(s) protocol"],
    ["javascript:alert(1)", "javascript:"],
    ["https://[::1]/x", "IPv6 loopback"],
    ["https://[fe80::1]/x", "IPv6 link-local"],
    ["https://[fd00::1]/x", "IPv6 unique-local"],
    ["https://[::ffff:10.0.0.1]/x", "IPv4-mapped private"]
  ])("rejects %s (%s)", (url) => {
    expect(isPublicHttpUrl(url)).toBe(false);
  });

  it("rejects malformed URL", () => {
    expect(isPublicHttpUrl("not-a-url")).toBe(false);
  });
});
