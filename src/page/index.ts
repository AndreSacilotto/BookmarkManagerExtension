//#region MODULES

import browser from "webextension-polyfill";
import * as extension from "@/page/extension";
// import * as util from "./util";

import folderIcon from "/icon_folder.svg";
import linkIcon from "/icon_missing.png";

//#region DOM

const search_bar  = document.getElementById("search-bar") as HTMLDivElement;
const search_bar_area = document.getElementById("search-bar-area") as HTMLInputElement;
const container  = document.getElementById("container") as HTMLDivElement;
const sidebar = document.getElementById("sidebar") as HTMLDivElement;

const splitter = document.getElementById("splitter") as HTMLDivElement;

splitter.ondrag = splitter.ondragend = (ev) => {
	sidebar.style.width = ev.pageX + "px";
}
splitter.ondragstart = (ev) => {
	ev.dataTransfer.effectAllowed = "none";
}

const searchBarChange = () => searchText(search_bar_area.value);
search_bar_area.addEventListener("keyup", searchBarChange);
search_bar_area.addEventListener("change", searchBarChange);

//#endregion

//#region Entry Point
var bookmarksNodes : NodeBookmarkSearchItem[];

async function _main() {
	const c = await extension.getBookmarksFlat(null);
	bookmarksNodes = buildBookmarks(c);
	// console.log(bookmarksNodes);
}
_main();

function Update() {
	_main();
}

//#region Functions

var itemContainer : HTMLDivElement;

function newItemContainer() {
	if (itemContainer)
		container.removeChild(itemContainer);
	itemContainer = document.createElement("div");
	itemContainer.className = "items-container";
	container.appendChild(itemContainer);
}

var lastText = "";
function searchText(str: string) {
	if (!str || str.length == 0)
		return;
	str = str.toLowerCase();
	if (lastText === str)
		return;
	lastText = str;

	newItemContainer();

	bookmarksNodes.forEach(x => {
		const r = x.ref;
		if (r.title.includes(str) || (r.url && r.url.includes(str)))
			itemContainer.appendChild(x.item);
	});
	
	requestAnimationFrame(() => {});
}

class BookmarkItem {
	isFolder: boolean;
	id: string;
	parentId: string;
	index: number;
	title: string;
	url: string;
	iconURL: string;
	constructor(item : browser.Bookmarks.BookmarkTreeNode) {
		/** @type {boolean} */
		this.isFolder = item.url === undefined || Object.hasOwn(item, "children");
		/** @type {string} */
		this.id = item.id;
		/** @type {string|undefined} */
		this.parentId = item.parentId;
		/** @type {number|undefined} */
		this.index = item.index;
		/** @type {string} */
		this.title = item.title;
		/** @type {string|undefined} */
		this.url = item.url;
		this.resetIcon();
	}
	resetIcon() {
		this.iconURL = this.isFolder ? folderIcon : linkIcon;
	}
	setIcon(iconPath: string) {
		this.iconURL = extension.getFaviconUrl(iconPath, 24);
	}
}

class NodeBookmarkSearchItem {
	ref: BookmarkItem;
	item: HTMLDivElement;
	icon: HTMLImageElement;
	title: HTMLDivElement;
	link: HTMLDivElement;
	edit: HTMLDivElement;
	selected: boolean;
	constructor() {
		/** @type {BookmarkItem|null} */
		this.ref = null;

		this.item = document.createElement("div");
		this.item.className = "bookmark-item";
		// this.item.target = "_blank";
		// this.item.rel = "noopener noreferrer";
		this.item.addEventListener("click", () => this.select());
		this.item.addEventListener("dblclick", () => this.openUrl());

		this.icon = this.item.appendChild(document.createElement("img"));
		this.icon.className = "bookmark-item-icon";
		this.icon.alt = "bookmark-icon"

		this.title = this.item.appendChild(document.createElement("div"));
		this.title.className = "bookmark-item-title";

		this.link = this.item.appendChild(document.createElement("div"));
		this.link.className = "bookmark-item-link";

		this.edit = this.item.appendChild(document.createElement("div"));
		this.edit.className = "bookmark-item-edit";

		this.selected = false;
	}
	fill(item: BookmarkItem) {
		this.ref = item;
		this.icon.src = item.iconURL;
		this.title.innerHTML = item.title;
		if (item.url)
			this.link.innerHTML = item.url;
		this.item.classList.add(item.isFolder ? "folder" : "not-folder");
	}
	select(){
		this.selected = !this.selected;
		if(this.selected)
			this.item.classList.add("selected");
		else
			this.item.classList.remove("selected");
		console.log(this.selected);
	}
	openUrl(){
		const url = this.ref.url;
		if(!url)
			return;
		chrome.tabs.create({ url })
	}
}

function buildBookmarks(buffer : browser.Bookmarks.BookmarkTreeNode[]) {
	return buffer.map(el => {
		const item = new BookmarkItem(el);
		// item.setIcon();
		const node = new NodeBookmarkSearchItem();
		node.fill(item);
		return node;
	});
}
