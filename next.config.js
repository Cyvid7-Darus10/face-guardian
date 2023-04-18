const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
	webpack(config, { isServer, dev }) {
		if (!isServer && !dev) {
			config.plugins.push(
				new InjectManifest({
					swSrc: "./sw/service-worker.js", // Update this path to point to the compiled file
					swDest: "service-worker.js",
					exclude: [/\.map$/, /asset-manifest\.json$/],
				})
			);
		}
		return config;
	},
	async headers() {
		return [
			{
				source: "/service-worker.js",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=0, must-revalidate",
					},
				],
			},
		];
	},
};
