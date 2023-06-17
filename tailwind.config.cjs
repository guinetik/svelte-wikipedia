/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			container: {
				center: true
			}
		}
	},
	plugins: [require('flowbite/plugin')],
	darkMode: 'media'
};
