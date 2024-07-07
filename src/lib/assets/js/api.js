import { socket, io_instances, theme, user, sesh, page_code } from './stores.js';
import * as utils from './utils';

import { API_ENDPOINT, API_KEY, URL } from './vars.js';

export async function checkSesh() {
	try {
		let sesh_val = Number(await getSesh()) || 0;
		if (!utils.isEmptyObj(await getCurrentUser())) {
			if (utils.getTimestamp() < utils.alterTimestamp(`add`, 60, `minutes`, sesh_val)) {
				sesh.set(utils.getTimestamp().toString());
				await setCurrentUser(
					(
						await restPost({
							url: `get`,
							payload: {
								type: `user`,
								id: (await getCurrentUser()).id
							},
							all: true
						})
					).data,
					false
				);
			} else {
				await utils.wait(0.1);
				await logout();
			}
		}
	} catch (e) {
		console.log(e);
	}
}

export async function getSocket() {
	return new Promise((resolve, reject) => {
		try {
			socket.subscribe((socket) => {
				// if (browser) resolve(socket);
				resolve(socket);
			});
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

export async function setSocket(val) {
	try {
		socket.set(val);
	} catch (e) {
		console.log(e);
	}
}

export async function getIoInstances() {
	return new Promise((resolve, reject) => {
		try {
			io_instances.subscribe((io_instances) => {
				// if (browser) resolve(JSON.parse(io_instances));
				resolve(JSON.parse(io_instances));
			});
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

export async function setIoInstances(val) {
	try {
		io_instances.set(JSON.stringify(val));
	} catch (e) {
		console.log(e);
	}
}

export async function getSesh() {
	return new Promise((resolve, reject) => {
		try {
			sesh.subscribe((sesh) => {
				// if (browser) resolve(sesh);
				resolve(sesh);
			});
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

// export async function setSesh(val) {
// 	sesh.set(val);
// }

export async function getPageCode() {
	return new Promise((resolve, reject) => {
		try {
			page_code.subscribe((page_code) => {
				// if (browser) resolve(page_code);
				resolve(page_code);
			});
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

export async function setPageCode(val) {
	try {
		page_code.set(val);
	} catch (e) {
		console.log(e);
	}
}

export async function getCurrentUser() {
	return new Promise((resolve, reject) => {
		try {
			user.subscribe((val) => {
				loadCurrentUser(JSON.parse(val));
				// if (browser) resolve(JSON.parse(val));
				resolve(JSON.parse(val));
			});
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

let loading_user = false;

async function loadCurrentUser(user) {
	try {
		if (!loading_user && !utils.isEmptyObj(user)) {
			loading_user = true;

			// let current_user_data = await get({ id: user.id, type: `user` });
			let current_user_data = await restPost({
				// socket: await getSocket(),
				url: `get`,
				payload: {
					type: `user`,
					id: user.id
				},
				all: true
			});

			if (current_user_data.res === `ok`) {
				let current_user = current_user_data.data;
				setCurrentUser(current_user, false);
			}

			loading_user = false;
		}
	} catch (e) {
		console.log(e);
	}
}

export function setCurrentUser(new_user, reload) {
	try {
		sesh.set(utils.getTimestamp().toString());
		user.set(JSON.stringify(new_user));
	
		if (reload) {
			location.reload();
		}
	} catch (e) {
		console.log(e);
	}
}

export async function logout() {
	try {
		sesh.set(null);
		user.set(null);
		location.reload();
	} catch (e) {
		console.log(e);
	}
}

// ---- routes

export async function restPost(d) {
	try {
		if (!d.skip_intiation_check) {
			let initiated = (
				await bePost({
					url: `init`,
					payload: {}
				})
			).cache;
	
			if (!initiated) {
				location.reload();
				return;
			}
		}
	
		return await bePost(d);
	} catch (e) {
		console.log(e);
		return null;
	}
}

// export async function post(d) {
// 	try {
// 		if (!d.skip_intiation_check) {
// 			let initiated = (
// 				await ioPost({
// 					socket: await getSocket(),
// 					url: `init`,
// 					payload: {}
// 				})
// 			).cache;
	
// 			if (!initiated) {
// 				location.reload();
// 				return;
// 			}
// 		}
	
// 		return await ioPost(d);
// 	} catch (e) {
// 		console.log(e);
// 		return null;
// 	}
// }

// ---- io

async function ioPost(d) {
	return await new Promise((resolve) => {
		try {
			d.socket.emit(
				d.url,
				{
					...d.payload,
				},
				(r) => {
					resolve(d.all ? r : r.data);
				}
			);
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

// ---- mongo

async function beGet(endpoint) {
	return new Promise((resolve, reject) => {
		try {
			let url = `${API_ENDPOINT}${endpoint}`;
	
			fetch(url)
				.then(res => resolve(
					(!res.ok) ? res.json() : null
				));
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

async function bePost(d) {
	try {
		let config = {
			method: `POST`,
			headers: {
				'origin': URL,
				Accept: `application/json`,
				'Content-Type': `application/json`,
				'x_api_key': API_KEY
			}
		};

		config.body = JSON.stringify({
			...(d.payload || {}),
		});

		let res = JSON.parse(await (await fetch(`${API_ENDPOINT}${d.url}`, config)).text());

		return d.all ? res : res.data;
	} catch (e) {
		console.log(e);
		return null;
	}
}