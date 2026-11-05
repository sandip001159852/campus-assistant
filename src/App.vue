<script>
	export default {
		onLaunch: function() {
			console.log('校园助手 App Launch');
		},
		onShow: function() {
			console.log('校园助手 App Show');
		},
		onHide: function() {
			console.log('校园助手 App Hide');
		}
	}
</script>

<style>
	/* 全局公共样式 */
	page {
		background-color: #f5f6f8;
		font-size: 28rpx;
		color: #333333;
	}

	.card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	}

	.btn-primary {
		background-color: #42b883;
		color: #ffffff;
		border-radius: 12rpx;
		font-size: 28rpx;
	}

	.btn-primary::after {
		border: none;
	}

	.text-muted {
		color: #999999;
		font-size: 24rpx;
	}
</style>
