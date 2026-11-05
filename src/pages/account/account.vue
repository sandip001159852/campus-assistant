<template>
	<view class="page">
		<!-- 当前账号信息 -->
		<view class="card account-card">
			<view class="avatar-lg">
				<text class="avatar-lg-text">校</text>
			</view>
			<text class="account-name">{{ loginName }}</text>
			<text class="account-role" :class="{ admin: isAdmin }">{{ isAdmin ? '管理员' : '学生' }}</text>
			<text class="account-username">账号：{{ username }}</text>
		</view>

		<!-- 账号操作 -->
		<view class="card">
			<view class="card-title">账号操作</view>
			<button class="btn-primary add-btn" @click="switchAccount">切换账号</button>
			<button class="btn-plain" @click="logout">退出登录</button>
			<text class="account-tip">切换后可选择学生或管理员身份重新登录</text>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	export default {
		data() {
			return {
				loginName: '',
				username: '',
				isAdmin: false
			}
		},
		onShow() {
			const login = getData('login', null)
			if (!login) {
				uni.reLaunch({ url: '/pages/index/index' })
				return
			}
			this.loginName = login.name || login.username || '同学'
			this.username = login.username || ''
			this.isAdmin = login.role === 'admin'
		},
		methods: {
			switchAccount() {
				uni.showModal({
					title: '切换账号',
					content: '将退出当前账号并进入登录页，是否继续？',
					success: (res) => {
						if (res.confirm) {
							setData('login', null)
							uni.reLaunch({ url: '/pages/login/login?mode=student' })
						}
					}
				})
			},
			logout() {
				uni.showModal({
					title: '退出登录',
					content: '确定退出当前账号吗？',
					success: (res) => {
						if (res.confirm) {
							setData('login', null)
							uni.reLaunch({ url: '/pages/index/index' })
						}
					}
				})
			}
		}
	}
</script>

<style>
	.account-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 50rpx 30rpx;
	}

	.avatar-lg {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: #42b883;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.avatar-lg-text {
		font-size: 52rpx;
		color: #ffffff;
	}

	.account-name {
		font-size: 36rpx;
		font-weight: 700;
		color: #333333;
	}

	.account-role {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #42b883;
		background: rgba(66, 184, 131, 0.12);
		padding: 4rpx 20rpx;
		border-radius: 24rpx;
	}

	.account-role.admin {
		color: #ff6b81;
		background: rgba(255, 107, 129, 0.12);
	}

	.account-username {
		margin-top: 12rpx;
		font-size: 26rpx;
		color: #999999;
	}

	.btn-plain {
		margin-top: 16rpx;
		background: #ffffff;
		color: #999999;
		border: 2rpx solid #dddddd;
		border-radius: 40rpx;
	}

	.account-tip {
		display: block;
		text-align: center;
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}
</style>
