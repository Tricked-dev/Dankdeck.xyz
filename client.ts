import { type Client, createClient } from "edgedb";

let c: Client;

declare global {
  var cc: Client;
}

if (import.meta.env.DEV) {
  if (globalThis.cc) {
    c = globalThis.cc;
  } else {
    c = createClient();
    globalThis.cc = c;
  }
} else {
  c = createClient();
}
export const client = c;
