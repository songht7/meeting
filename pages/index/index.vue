<template>
	<view class="user-box">
		<input class="sign" type="text" v-model="name" />
		<view class="sendMsg" @click="sendSocketMessage">
			签到
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: ""
			}
		},
		onLoad() {
			this.$store.dispatch("connectSocket")
		},
		onShow() {},
		onHide() {},
		components: {},
		computed: {},
		methods: {
			sendSocketMessage() {
				var that = this;
				let _data = {
					"msg": that.name
				};
				console.log(_data);
				that.$store.dispatch("sendSocketMessage", _data)
			}
		}
	}
</script>

<style>
	.user-box {
		padding: 20upx;
	}

	.sendMsg {
		font-size: 32upx;
		background: #007AFF;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-content: center;
		align-items: center;
		line-height: 2;
		padding: 10upx;
		border-radius: 10upx;
		margin: 10upx auto;
	}

	.sign {
		line-height: 2;
		font-size: 48upx;
		border: 2upx solid #CCCCCC;
		padding: 10upx 20upx;
		border-radius: 25upx;
	}
</style>
