const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = {
	webpack(config, { isServer, dev }) {
		if (!isServer && !dev) {
			config.plugins.push(
				new InjectManifest({
					swSrc: "./pages/service-worker.ts",
					swDest: "service-worker.ts",
					exclude: [/\.map$/, /asset-manifest\.json$/],
				})
			);
		}
		return config;
	},
	async headers() {
		return [
			{
				source: "/service-worker.ts",
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
