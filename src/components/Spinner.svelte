<div class="spinner-box absolute left-2/4 top-2/4 -ml-20 -mt-20">
    <div class="blue-orbit leo" />

    <div class="green-orbit leo" />

    <div class="red-orbit leo" />

    <div class="white-orbit w1 leo" />
    <div class="white-orbit w2 leo" />
    <div class="white-orbit w3 leo" />
    <img
        alt="logo"
        width="20"
        height="20"
        src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/155px-Wikipedia-logo-v2.svg.png"
    />
</div>
<style>
	/* PROUDLY jacked 
		from https://codepen.io/AlexWarnes/pen/jXYYKL
	 */
	/* KEYFRAMES */

	@keyframes spin {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(359deg);
		}
	}

	@keyframes spin3D {
		from {
			transform: rotate3d(0.5, 0.5, 0.5, 360deg);
		}
		to {
			transform: rotate3d(0deg);
		}
	}

	@keyframes configure-clockwise {
		0% {
			transform: rotate(0);
		}
		25% {
			transform: rotate(90deg);
		}
		50% {
			transform: rotate(180deg);
		}
		75% {
			transform: rotate(270deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes configure-xclockwise {
		0% {
			transform: rotate(45deg);
		}
		25% {
			transform: rotate(-45deg);
		}
		50% {
			transform: rotate(-135deg);
		}
		75% {
			transform: rotate(-225deg);
		}
		100% {
			transform: rotate(-315deg);
		}
	}

	@keyframes pulse {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0.25;
			transform: scale(0.75);
		}
	}

	.spinner-box {
		width: 150px;
		height: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: transparent;
	}

	.leo {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	.blue-orbit {
		width: 82.5px;
		height: 82.5px;
		border: 1px solid #91daffa5;
		-webkit-animation: spin3D 3s linear 0.2s infinite;
	}

	.green-orbit {
		width: 60px;
		height: 60px;
		border: 1px solid #91ffbfa5;
		-webkit-animation: spin3D 2s linear 0s infinite;
	}

	.red-orbit {
		width: 45px;
		height: 45px;
		border: 1px solid #ffca91a5;
		-webkit-animation: spin3D 1s linear 0s infinite;
	}

	.white-orbit {
		width: 30px;
		height: 30px;
		border: 2px solid #ffffff;
		-webkit-animation: spin3D 1s linear 0s infinite;
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
