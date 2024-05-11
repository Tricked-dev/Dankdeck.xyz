// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { createClient } from 'edgedb';

let c;

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
