module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'css/app.css',
		'js/app.js',
		'images/*.{png,jpg,jpeg,svg,gif}',
	],
    swDest: 'public/sw.js',
    maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
