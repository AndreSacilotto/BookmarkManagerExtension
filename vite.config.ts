import { defineConfig } from "vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import pkg from "./package.json";

const manifest : chrome.runtime.ManifestV3 = {
	manifest_version: 3,
	name: pkg.displayName ?? pkg.name,
	version: pkg.version,
	author: pkg.author,
	description: pkg.description,
	icons: {
		32: "icons/icon_512.png",
		128: "icons/icon_512.png"
	},
	action: {
		default_title: "Bookmark Search",
		default_popup: "src/popup/popup.html",
		default_icon: {
			32: "icons/icon_512.png",
			128: "icons/icon_512.png"
		}
	},
	content_security_policy: {
		extension_pages: "script-src 'self' http://localhost:5173; object-src 'self'"
	},
	permissions: [
		"bookmarks",
		"tabs",
		"favicon"
	]
};

export default defineConfig({
	plugins: [
		webExtension({ 
			manifest, 
			additionalInputs:{
				html: ["src/page/index.html"],
			}
		}),
	],
	resolve: {
		alias: [
			{ find: '@', replacement: path.resolve(__dirname, "src") },
		],
	},
	root: "./",
	publicDir: path.resolve(__dirname, "public"),
	build: {
		outDir: path.resolve(__dirname, "dist"),
		emptyOutDir: true,
		rollupOptions: {
			// input:{
			// 	// popup: path.resolve(__dirname, 'src/popup/popup.html'),
				// 	page: path.resolve(__dirname, 'src/page/index.html'),
			// }
		}
	}
});
