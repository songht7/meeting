<template>
	<view class="content">
		<video class="video" id="MeetVideo" :autoplay="autoplay" :loop="loop" :muted="muted" src="/static/video.mp4">
			<block v-for="(obj,k) in list" :key="k">
				<cover-view class="coverView" :style="{'left':obj.left}">
					<view class="cover-block">
						<img src="../../static/bubble.svg" class="bubble" />
						<view class="cover-name">
							{{obj.name}}
						</view>
					</view>
				</cover-view>
			</block>
		</video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoplay: true,
				loop: true,
				muted: true,
				list: []
			}
		},
		onLoad() {

		},
		onShow() {
			var that = this;
			that.getList();
		},
		computed: {},
		methods: {
			setPosition() {
				let random = Math.floor(Math.random() * (80 - 10) + 10);
				return random + "%";
			},
			getList() {
				var that = this;
				// var _list = that.list;
				// var _left = that.setPosition();
				// let p = {
				// 	"name": _left,
				// 	"left": _left
				// }
				// _list.push(p);
				let si = setInterval(() => {
					var _list = that.list;
					var _left = that.setPosition();
					//console.log(_left);
					let p = {
						"name": _left,
						"left": _left
					}
					_list.push(p);
				}, 2000)
			}
		}
	}
</script>

<style>
	page {
		width: 100%;
		height: 100%;
	}

	.content {
		width: 100%;
		height: 100%;
	}

	#MeetVideo {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.coverView {
		width: 100upx;
		height: 100upx;
		position: absolute;
		overflow: initial;
		bottom: 5%;
		opacity: 0.5;
		animation-name: fadeUpOut;
		animation-duration: 15s;
		animation-timing-function: linear;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		/* animation-play-state: paused; */
	}

	.coverView:before {
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
		animation-direction:alternate;
		opacity: 0;
	}
	.coverView:after {
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
		animation-direction:alternate;
		opacity: 0;
	}

	@keyframes fadeUpOut {
		0% {
			bottom: 5%;
		}

		10% {
			opacity: 0.8;
		}

		30% {
			opacity: 1;
		}

		100% {
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
		position: absolute;
		color: #CCCCCC;
		top: 0;
		line-height: 1;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-content: center;
		align-items: center;
		z-index: 2;
		font-size: 28upx;
	}

	.bubble {
		width: 100%;
		position: relative;
		z-index: 1;
	}
</style>
