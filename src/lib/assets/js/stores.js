// https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi

import { writable } from 'svelte/store';
import { BROWSER } from 'esm-env';

// ----

export const socket = writable((BROWSER && localStorage.getItem('socket')) || null);
socket.subscribe((val) => {
	if (BROWSER) return (localStorage.socket = val);
});

export const io_instances = writable((BROWSER && localStorage.getItem('io_instances')) || null);
socket.subscribe((val) => {
	if (BROWSER) return (localStorage.io_instances = val);
});

export const page_code = writable((BROWSER && localStorage.getItem('page_code')) || null);
page_code.subscribe((val) => {
	if (BROWSER) return (localStorage.page_code = val);
});

export const sesh = writable((BROWSER && localStorage.getItem('sesh')) || null);
sesh.subscribe((val) => {
	if (BROWSER) return (localStorage.sesh = val);
});

export const user = writable((BROWSER && localStorage.getItem('user')) || null);
user.subscribe((val) => {
	if (BROWSER) return (localStorage.user = val);
});

export const theme = writable((BROWSER && localStorage.getItem('theme')) || `default`);
theme.subscribe((val) => {
	if (BROWSER) return (localStorage.theme = val);
});

export const is_google_processing = writable((BROWSER && localStorage.getItem('is_google_processing')) || false);
is_google_processing.subscribe((val) => {
	if (BROWSER) return (localStorage.is_google_processing = val);
});