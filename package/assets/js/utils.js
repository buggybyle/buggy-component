import moment from 'moment';
import moment_tz from 'moment-timezone';
import _ from 'lodash-es';

import { FALLBACK_USER_IMAGE } from './vars.js';

export function formatNumber(num) {
	try {
		return _.comma(num);
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export function padNumber(num, length) {
	try {
		// note: prepend num with 0's till length is sufficed --- will return string --- max 100 char length

		let num_string = (num || 0).toString() || ``;

		while (num_string.length < Math.min((length || 0), 100)) {
			num_string = `0${num_string}`;
		}

		return num_string || `0`;
	} catch (e) {
		console.log(e);
		return `0`;
	}
}

// https://stackoverflow.com/a/38340730/8919391
export function removeEmptyArrays(obj) {
	try {
		return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v.length != 0));
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function redirect(url) {
	try {
		window.open(url, `_blank`);
	} catch (e) {
		console.log(e);
	}
}

export function squeezeWebsiteName(url, hasSuffix) {
	try {
		url = url.toLowerCase();
		let searchFor = url.includes(`www.`) ? `www.` : url.includes(`https://`) ? `https://` : `http://`;
	
		let endingIndex = url.indexOf(`.`, url.indexOf(searchFor));
		if (hasSuffix) {
			endingIndex =
				url.indexOf(`/`, url.indexOf(`.`, url.indexOf(searchFor))) !== -1
					? url.indexOf(`/`, url.indexOf(`.`, url.indexOf(searchFor)))
					: url.length;
		}
	
		return url.substring(url.indexOf(searchFor) + searchFor.length, endingIndex);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function sanitiseString (str) {
	try {
		return (str || ``).trim().toLowerCase().replaceAll(` `, ``);
	} catch (e) {
		console.log(e);
	}
}

export function urlifyString(str) {
	try {
		return str.replaceAll(`&`, `[ampersand]`).replaceAll(`#`, `[hash]`);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function unurlifyString(str) {
	try {
		return str.replaceAll(`[ampersand]`, `&`).replaceAll(`[hash]`, `#`);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function objToUrl(obj) {
	try {
		// https://stackoverflow.com/a/38340730/8919391
		// obj = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v.length > 0));
		if (obj === null || obj === undefined) {
			return ``;
		} else {
			obj = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
			return decodeURIComponent(new URLSearchParams(obj).toString());
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function isEmptyObj(obj) {
	try {
		for (let i in obj) return false;
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export function isUrl(val) {
	try {
		let url;
		url = new URL(val);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch (e) {
		return false;
	}
}

export function wait(seconds) {
	return new Promise(function (resolve) {
		try {
			setTimeout(function () {
				resolve();
			}, seconds * 1000);
		} catch (e) {
			console.log(e);
			resolve();
		}
	});
}

// function dec2hex(dec) {
// 	try {
// 		return dec.toString(16).padStart(2, '0');
// 	} catch (e) {
// 		console.log(e);
// 		return null;
// 	}
// }

export function generateId(length) {
	try {
		// https://stackoverflow.com/a/58326357/8919391
		return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getTimestamp() {
	try {
		return moment.utc().unix();
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function convertToTimestamp(input, format) {
	try {
		return moment.utc(input, format).unix();
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function datetimeToTimestamp(d) {
	// new
	try {
		let datetime_timezone = d.datetime_timezone || `UTC`;
		let datetime = d.datetime || ``;
		
		return Number(moment(datetime).tz(datetime_timezone).format(`X`));
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function timestampToDatetime(d) {
	// new
	try {
		let timestamp = d.timestamp || 0;
		let datetime_timezone = d.datetime_timezone || `UTC`;
		let datetime_format = d.datetime_format || `YYYY-MM-DDTHH:mm`;
		
		return moment.tz(moment.unix(timestamp), datetime_timezone).format(datetime_format);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function formatTimestamp(timestamp, format) {
	try {
		return moment.unix(timestamp).utc().format(format);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function formatDatetime(datetime, format, timezone) {
	try {
		// deprecated
		if (!timezone) {
			timezone = `UTC`;
		}
		return moment_tz.utc(datetime).tz(timezone).format(format);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getTimestampDiff(start, end, format) {
	try {
		let diff = moment.duration(moment.unix(end).diff(moment.unix(start)));
	
		switch (format) {
			case `days`:
				return diff.asDays();
			case `hours`:
				return diff.asHours();
			case `minutes`:
				return diff.asMinutes();
			case `seconds`:
			default:
				return diff.asSeconds();
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getDatetimeDiff(start, end, format) {
	try {
		let diff = moment.duration(moment(end).diff(moment(start)));
	
		switch (format) {
			case `days`:
				return diff.asDays();
			case `minutes`:
				return diff.asMinutes();
			case `minutes`:
				return diff.asHours();
			case `seconds`:
			default:
				return diff.asSeconds();
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function alterTimestamp(operation, offset, type, timestamp) {
	try {
		switch (operation) {
			case 'add':
				return moment
					.utc(timestamp, `X`)
					.add(offset || 0, type || `seconds`)
					.unix();
			case 'subtract':
				return moment
					.utc(timestamp, `X`)
					.subtract(offset || 0, type || `seconds`)
					.unix();
			default:
				return timestamp;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getDisplayableTimeElapsed(timestamp) {
	try {
		if (timestamp <= 0) {
			return `n/a`;
		}
	
		let now = getTimestamp();
		let diff_in_seconds = getTimestampDiff(timestamp, now, `seconds`);
		let diff_in_minutes = getTimestampDiff(timestamp, now, `minutes`);
		let diff_in_hours = getTimestampDiff(timestamp, now, `hours`);
		let diff_in_days = getTimestampDiff(timestamp, now, `days`);
	
		if (diff_in_seconds < 60) {
			return `${Math.floor(diff_in_seconds)}s`;
		} else if (diff_in_minutes < 60) {
			return `${Math.floor(diff_in_minutes)}m`;
		} else if (diff_in_hours < 24) {
			return `${Math.floor(diff_in_hours)}h`;
		} else {
			return `${Math.floor(diff_in_days)}d`;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getDisplayableTimeBefore(timestamp) {
	try {
		if (timestamp <= 0) {
			return `n/a`;
		}
		
		let now = getTimestamp();
		let diff_in_seconds = getTimestampDiff(now, timestamp, `seconds`);
		let diff_in_minutes = getTimestampDiff(now, timestamp, `minutes`);
		let diff_in_hours = getTimestampDiff(now, timestamp, `hours`);
		let diff_in_days = getTimestampDiff(now, timestamp, `days`);
	
		if (diff_in_seconds < 60) {
			// return `${Math.floor(diff_in_seconds)}s`;
			return `Now`;
		} else if (diff_in_minutes < 60) {
			return `${Math.floor(diff_in_minutes)}m`;
		} else if (diff_in_hours < 24) {
			return `${Math.floor(diff_in_hours)}h`;
		} else {
			return `${Math.floor(diff_in_days)}d`;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getRandomNumber(min, max) {
	try {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getRandomDefaultBackground() {
	try {
		return `/images/backgrounds/default-${getRandomNumber(1, 4)}.png`;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function isToggled(dom_item) {
	try {
		return dom_item ? [...dom_item.classList].includes(`toggled--`) : false;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export async function toggle(dom_item) {
	try {
		if (dom_item) {
			if (![...dom_item.classList].includes(`toggled--`)) {
				// console.log(`toggling on`);
				dom_item.classList.add(`toggled--`);
				await wait(0.05);
				dom_item.classList.add(`visible--`);
			} else {
				// console.log(`toggling off`);
				dom_item.classList.remove(`visible--`);
				await wait(0.2);
				dom_item.classList.remove(`toggled--`);
			}
			return dom_item;
		}
	} catch (e) {
		console.log(e);
	}
}

// https://stackoverflow.com/a/20285053/8919391
export async function blobToDataUrl(val, type) {
	try {
		let blob = type === `url` ? await (await fetch(val)).blob() : val;
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
		});
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function isValidUrl(str) {
	try {
		new URL(str);
		return true;
	} catch (e) {
		return false;
	}
}

export function scrollHorz(e, target) {
	try {
		target.scrollLeft += e.deltaY * 6;
	} catch (e) {
		console.log(e);
	}
}

export function shuffleArray(arr) {
	try {
		// https://stackoverflow.com/a/46545530/8919391
		return arr
			.map((value) => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	} catch (e) {
		console.log(e);
		return [];
	}
}

export function hasErrors(arr) {
	try {
		if (
			Object.keys(arr)
				.map((key) => arr[key])
				.join(``)
				.trim().length === 0
		) {
			return false;
		} else {
			return true;
		}
	} catch (e) {
		console.log(e);
		return true;
	}
}

export function resetErrors(arr) {
	try {
		for (let key of Object.keys(arr)) {
			arr[key] = ``;
		}
	
		return arr;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export function calcValBeforePercChange(val, perc_change) {
	try {
		let val_before_perc_change = (val / (100 + perc_change)) * 100;
		if (val_before_perc_change === Infinity) {
			val_before_perc_change = val * 2;
		}
		return val_before_perc_change || 0;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function calcPercChange(a, b) {
	try {
		if (a === null || b === null) {
			return 0;
		}
	
		let percent;
		if (b !== 0) {
			if (a !== 0) {
				percent = ((b - a) / a) * 100;
			} else {
				percent = b * 100;
			}
		} else {
			percent = -a * 100;
		}
		return percent;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function round(num, precision) {
	try {
		if (num) {
			if (num >= 0) {
				return Math.abs(parseFloat(num.toString().split('e')[0])).toFixed(precision);
			} else {
				return (Math.abs(parseFloat(num.toString().split('e')[0])) * -1).toFixed(precision);
			}
		} else {
			return `0`;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function shortenString(data) {
	try {
		if (data.string) {
			data.string = data.string.toString();
		}
	
		if (!data.left && !data.right) {
			data.right = true;
		}
	
		if (data.string && data.string.length > data.length) {
			if (data.left) {
				return `...${data.string
					.substring(data.string.length - data.length, data.string.length)
					.trim()}`;
			} else if (data.right) {
				return `${data.string.substring(0, data.length).trim()}...`;
			}
		} else {
			return data.string;
		}
	} catch (e) {
		console.log(e);
		return ``;
	}
}

export function formatUrl(url) {
	try {
		let { hostname } = new URL(url);
		return hostname.replace(`www.`, ``);
	} catch (e) {
		return ``;
	}
}

export function formatAddress(address) {
	try {
		return !isEmptyObj(address)
			? `${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`
			: ``;
	} catch (e) {
		console.log(e);
		return ``;
	}
}

export function isBetween(x, min, max) {
	try {
		return x >= min && x <= max;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function clone(obj) {
	try {
		return obj ? JSON.parse(JSON.stringify(obj)) : null;
	} catch (e) {
		console.log(e);
		return null;
	}
}

// export function clone(obj) {
// 	return Object.assign({}, obj);
// }

export function getTimezones() {
	try {
		let timezones = moment_tz.tz.names().map((t) => {
			let zone = moment_tz.tz(t).format(`z`);
	
			return {
				name: t,
				zone: `${zone.startsWith(`+`) || zone.startsWith(`-`) ? `UTC` : ``}${zone
					.replace(`+0`, `+`)
					.replace(`-0`, `-`)}`
			};
		});
	
		timezones = JSON.parse(JSON.stringify(timezones))
			.filter((t) => t.name.startsWith(`Etc/`))
			.concat(JSON.parse(JSON.stringify(timezones)).filter((t) => !t.name.startsWith(`Etc/`)));
	
		return timezones;
	} catch (e) {
		console.log(e);
		return [];
	}
}

export function getTimezoneZone(id) {
	try {
		let zone = moment_tz.tz(id).format(`z`);
	
		return `${zone.startsWith(`+`) || zone.startsWith(`-`) ? `UTC` : ``}${zone
			.replace(`+0`, `+`)
			.replace(`-0`, `-`)}`;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function timestampToMinute(timestamp) {
	try {
		return Math.ceil((timestamp || getTimestamp()) / 60);
	} catch (e) {
		console.log(e);
		return null;
	}
}

// export function getDatetimeInTimezone(datetime, timezone) {
// 	try {
// 		return moment_tz.utc(datetime).tz(timezone).format();
// 	} catch (e) {
// 		console.log(e);
// 		return null;
// 	}
// }

// export function getTimezoneInDatetime(datetime, timezone) {
// 	try {
// 		return moment_tz.tz(datetime, timezone).toISOString();
// 	} catch (e) {
// 		console.log(e);
// 		return null;
// 	}
// }

export function getIoInstanceStatuses() {
	try {
		return [
			{
				code: `active`,
				colour: `map-green`
			},
			{
				code: `idle`,
				colour: `map-yellow`
			}
		];
	} catch (e) {
		console.log(e);
		return [];
	}
}

export function calcUserAccessLevel(user) {
	try {
		let obj = {
			access_level: 0,
			collections: []
		};
	
		let suave_collections = [
			{
				code: `suaveseals`,
				name: `Suave Seals`,
				amount: 100,
				image_url: `https://creator-hub-prod.s3.us-east-2.amazonaws.com/suaveseals_pfp_1649551224701.png`
			}
		];
	
		if (user && user.collections) {
			for (let collection of user.collections) {
				let matching_suave_collection = suave_collections.find((c) => c.code === collection.code);
	
				if (!isEmptyObj(matching_suave_collection)) {
					obj.collections.push({
						...matching_suave_collection,
						nfts: collection.nfts,
						count: collection.nfts.length
					});
	
					obj.access_level += matching_suave_collection.amount * collection.nfts.length;
				}
			}
		}
	
		return obj;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function scrollToItemInContainer(data) {
	try {
		data.container_div.scrollBy({
			top: data.item_div.offsetTop - data.container_div.scrollTop - 150,
			left: 0,
			behavior: 'smooth'
		});
	} catch (e) {
		console.log(e);
	}
}

export function getStringLength(str) {
	try {
		str = str || ``;
		return _.toArray(str.toString().trim()).length;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export function getImgSrc(file) {
	return new Promise(async (resolve, reject) => {
		try {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.addEventListener(`load`, function () {
				resolve(reader.result);
			});
		} catch (e) {
			console.log(e);
			resolve(null);
		}
	});
}

export async function imgUrlToBase64(img_url) {
	try {
		// ref: https://stackoverflow.com/a/64929732/8919391
		return new Promise(async (resolve, reject) => {
			const reader = new FileReader();
			const img_data = await fetch(img_url);
			const img_blob = await img_data.blob();
			reader.readAsDataURL(img_blob);
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
		});
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getBlockchain(blockchain) {
	try {
		blockchain = blockchain.trim().toLowerCase();

		if (blockchain === `solana` || blockchain.startsWith(`sol`)) {
			return `solana`;
		} else if (blockchain === `arbitrum` || blockchain.startsWith(`arb`)) {
			return `arbitrum`;
		} else if (blockchain === `bitcoin` || blockchain.startsWith(`btc`)) {
			return `bitcoin`;
		} else if (blockchain === `ethereum` || blockchain.startsWith(`eth`)) {
			return `ethereum`;
		} else if (
			blockchain === `polygon` ||
			blockchain === `matic` ||
			blockchain.startsWith(`poly`) ||
			blockchain.startsWith(`matic`)
		) {
			return `polygon`;
		} else if (blockchain === `sui` || blockchain.startsWith(`sui`)) {
			return `sui`;
		} else {
			return null;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getWeightedRandom(d) {
	try {
		let arr = d.arr || [];
		let rarity_prop = d.rarity_prop || ``;
		let value_prop = d.value_prop || ``;
		
		let sum = 0;
		let r = getRandomNumber(0, 100);
		arr = (arr || []).sort((a, b) => b[rarity_prop] - a[rarity_prop]);

		for (let i = 0; i < arr.length; i++) {
			sum += arr[i][rarity_prop];
			if (r <= sum) return (value_prop ? arr[i][value_prop] : arr[i]);
		}

		return value_prop ? arr[0][value_prop] : arr[0];
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function removeAccents(str) {
	try {
		// https://stackoverflow.com/a/37511463/8919391
		return str.normalize(`NFD`).replace(/\p{Diacritic}/gu, ``);
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function getSubstringOccurrenceCount(d) {
	try {
		return (d.string || ``).split(d.substring || ``).length - 1;
	} catch (e) {
		console.log(e);
		return 0;
	}
}

export function compressImage(d) {
	try {
		let image_url = d.image_url || ``;
		let width = d.width || 0;
		let height = d.height || width;
		
		if (image_url === FALLBACK_USER_IMAGE) {
			return image_url;
		}
	
		if (getSubstringOccurrenceCount({
			string: image_url,
			substring: `http`
		}) <= 1) {
			return `https://wsrv.nl/?url=${image_url}&w=${width}&h=${height}`;
		} else {
			return image_url;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

export function copyToClipboard(text) {
	try {
		navigator.clipboard.writeText(text);
	} catch (e) {
		console.log(e);
	}
}