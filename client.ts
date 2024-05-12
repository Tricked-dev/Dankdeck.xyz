import { type Client, createClient } from "edgedb";

let c: Client;

declare global {
  var client: Client;
}

if (import.meta.env.DEV) {
  if (globalThis.client) {
    c = globalThis.client;
  } else {
    c = createClient();
    globalThis.client = c;
  }
} else {
  c = createClient();
}
export const client = c;
