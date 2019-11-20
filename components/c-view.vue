<template>
	<cover-view :class="['coverView',shine>50?'shine big':'']" :style="{'left':setPosition}">
		<view class="cover-block">
			<img :src="bubble" class="bubble" />
			<view class="cover-name">
				{{list.name}}
			</view>
		</view>
	</cover-view>
</template>

<script>
	export default {
		name: "c-view",
		props: {
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			bubble:{
				type:String,
				default:""
			}
		},
		data() {
			return {

			};
		},
		computed: {
			setPosition() {
				let random = Math.floor(Math.random() * (80 - 10) + 10);
				//console.log("random:", random);
				return random + "%";
			},
			shine() {
				let _shine = Math.floor(Math.random() * (100 - 1) + 1);
				//console.log(_shine);
				return _shine;
			}
		},
	}
</script>

<style>
	.coverView {
		width: 100upx;
		height: 100upx;
		position: absolute;
		overflow: initial;
		bottom: 2%;
		opacity: 0.5;
		animation-name: fadeUpOut;
		animation-duration: 15s;
		animation-timing-function: linear;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		/* animation-play-state: paused; */
	}
	.big{
		width: 115upx;
		height: 115upx;
	}

	.shine:before {
		content: " ";
		width: 0;
		height: 0;
		border-radius: 50%;
		box-shadow: 0 0 6upx 6upx #FFFFFF;
		background: #FFFFFF;
		position: absolute;
		right: -10%;
		top: 30%;

		animation-name: shine;
		animation-duration: 2s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		opacity: 0;
	}

	.shine:after {
		content: " ";
		width: 0;
		height: 0;
		border-radius: 50%;
		box-shadow: 0 0 5upx 5upx #FFFFFF;
		background: #FFFFFF;
		position: absolute;
		left: -5%;
		top: 80%;

		animation-name: shine;
		animation-duration: 3s;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		opacity: 0;
	}

	@keyframes fadeUpOut {
		0% {
			bottom: 2%;
		}

		10% {
			opacity: 0.8;
		}

		30% {
			opacity: 1;
		}

		100% {
			opacity: 1;
			bottom: 120%;
		}
	}

	@keyframes shine {
		from {
			opacity: 0.1;
		}

		to {
			opacity: 1;
		}
	}

	.cover-block {
		width: 100%;
		height: 100%;
		line-height: 0;
		position: relative;
	}

	.cover-name {
		color: #CCCCCC;
		z-index: 2;
		font-size: 28upx;
		position: absolute;
		top: 0;
		line-height: 1;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
	}

	.bubble {
		width: 100%;
		position: relative;
		z-index: 1;
	}
</style>
