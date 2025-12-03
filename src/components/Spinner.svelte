<script>
	/**
	 * Size of the spinner
	 * @type {'sm' | 'md' | 'lg'}
	 */
	export let size = 'md';
	
	/**
	 * Whether to use absolute positioning (legacy) or inline
	 * @type {boolean}
	 */
	export let absolute = false;

	// Size mappings
	const sizes = {
		sm: { box: 75, blue: 41, green: 30, red: 22, white: 15, logo: 10 },
		md: { box: 150, blue: 82.5, green: 60, red: 45, white: 30, logo: 20 },
		lg: { box: 200, blue: 110, green: 80, red: 60, white: 40, logo: 28 }
	};
	
	$: dims = sizes[size] || sizes.md;
</script>

<div 
	class="spinner-box"
	class:absolute={absolute}
	class:positioned={absolute}
	style="width: {dims.box}px; height: {dims.box}px;"
>
    <div class="blue-orbit leo" style="width: {dims.blue}px; height: {dims.blue}px;" />
    <div class="green-orbit leo" style="width: {dims.green}px; height: {dims.green}px;" />
    <div class="red-orbit leo" style="width: {dims.red}px; height: {dims.red}px;" />
    <div class="white-orbit w1 leo" style="width: {dims.white}px; height: {dims.white}px;" />
    <div class="white-orbit w2 leo" style="width: {dims.white}px; height: {dims.white}px;" />
    <div class="white-orbit w3 leo" style="width: {dims.white}px; height: {dims.white}px;" />
    <img
        alt="logo"
        width={dims.logo}
        height={dims.logo}
        src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/155px-Wikipedia-logo-v2.svg.png"
    />
</div>

<style>
	/* PROUDLY jacked 
		from https://codepen.io/AlexWarnes/pen/jXYYKL
	 */
	/* KEYFRAMES */

	@keyframes spin3D {
		from {
			transform: rotate3d(0.5, 0.5, 0.5, 360deg);
		}
		to {
			transform: rotate3d(0deg);
		}
	}

	.spinner-box {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: transparent;
	}
	
	.spinner-box.positioned {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.leo {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	.blue-orbit {
		border: 1px solid #91daffa5;
		animation: spin3D 3s linear 0.2s infinite;
	}

	.green-orbit {
		border: 1px solid #91ffbfa5;
		animation: spin3D 2s linear 0s infinite;
	}

	.red-orbit {
		border: 1px solid #ffca91a5;
		animation: spin3D 1s linear 0s infinite;
	}

	.white-orbit {
		border: 2px solid #ffffff;
		animation: spin3D 1s linear 0s infinite;
	}

	.w1 {
		transform: rotate3D(1, 0, 0, 180deg);
	}

	.w2 {
		transform: rotate3D(0, 1, 0, 180deg);
	}

	.w3 {
		transform: rotate3D(1, 1, 1, 180deg);
	}
</style>
