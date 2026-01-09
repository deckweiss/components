import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import type { AddOnType } from "./types";

export function openAddOn(t: AddOnType, tid: string, hash: string = "") {
	if (browser) {
		const url = new URL(location.href);
		url.searchParams.set("t", t);
		url.searchParams.set("tid", tid);

		if (hash) {
			url.hash = hash;
		}
		const path = url.href.substring(url.origin.length);
		goto(path);
	}
}

export function closeAddOn() {
	if (browser) {
		const url = new URL(location.href);
		url.searchParams.delete("t");
		url.searchParams.delete("tid");
		url.searchParams.delete("ui");
		url.hash = "";
		goto(url.href);
	}
}
