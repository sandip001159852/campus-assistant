<template>
	<view class="page">
		<!-- 顶部个人卡片 -->
		<view class="profile-header">
			<view class="user-info">
				<view class="avatar-lg">
					<text class="avatar-lg-text">校</text>
				</view>
				<view class="user-text">
					<text class="user-name">{{ loginName }}</text>
					<view class="user-role-row">
						<text class="user-role" :class="{ admin: isAdmin }">{{ isAdmin ? '管理员' : '学生' }}</text>
						<text class="user-account">{{ username }}</text>
					</view>
				</view>
			</view>
			<view class="status-line" @click="editStatus">
				<text class="status-text">{{ status || '＋ 添加状态' }}</text>
			</view>
		</view>

		<!-- 功能宫格 -->
		<view class="grid card">
			<view class="grid-item" v-for="item in funcList" :key="item.id" @click="goFunc(item)">
				<view class="grid-icon" :style="{ backgroundColor: item.bg }">
					<text class="grid-icon-text">{{ item.icon }}</text>
				</view>
				<text class="grid-name">{{ item.name }}</text>
			</view>
		</view>

		<!-- 常用操作 -->
		<view class="card list-card">
			<view class="list-item" @click="switchAccount">
				<text class="list-icon">🔄</text>
				<text class="list-text">切换账号</text>
				<text class="list-arrow">›</text>
			</view>
			<view class="list-item" @click="logout">
				<text class="list-icon">🚪</text>
				<text class="list-text">退出登录</text>
				<text class="list-arrow">›</text>
			</view>
			<view class="list-item" @click="showAbout">
				<text class="list-icon">ℹ️</text>
				<text class="list-text">关于校园助手</text>
				<text class="list-arrow">›</text>
			</view>
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
				isAdmin: false,
				status: '',
				funcList: [
					{ id: 'scan', name: '扫一扫', icon: '📷', bg: '#42b883' },
					{ id: 'timetable', name: '我的课程', icon: '📚', bg: '#409eff' },
					{ id: 'seat', name: '我的预约', icon: '🪑', bg: '#7c6cf0' },
					{ id: 'lost', name: '我的发布', icon: '🔍', bg: '#f0ad4e' }
				]
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
			this.status = getData('profile_status', '')
		},
		methods: {
			goFunc(item) {
				if (item.id === 'scan') {
					uni.scanCode({
						success: (res) => {
							uni.showModal({
								title: '扫码结果',
								content: res.result,
								showCancel: false
							})
						},
						fail: () => {
							uni.showToast({ title: '扫码取消或失败', icon: 'none' })
						}
					})
					return
				}
				if (item.id === 'timetable') {
					uni.switchTab({ url: '/pages/timetable/timetable' })
				} else if (item.id === 'seat') {
					uni.navigateTo({ url: '/pages/seat/seat?from=profile' })
				} else if (item.id === 'lost') {
					uni.switchTab({ url: '/pages/lost/lost' })
				}
			},
			editStatus() {
				uni.showModal({
					title: '添加状态',
					content: this.status || '',
					editable: true,
					placeholderText: '此刻的心情或状态…',
					success: (res) => {
						if (res.confirm) {
							const val = (res.content || '').trim()
							this.status = val
							setData('profile_status', val)
							uni.showToast({ title: '状态已更新', icon: 'success' })
						}
					},
					fail: () => {
						uni.showToast({ title: '当前端不支持弹窗编辑', icon: 'none' })
					}
				})
			},
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
			},
			showAbout() {
				uni.showModal({
					title: '校园助手 v1.0',
					content: '基于 UniApp 开发，支持 H5 / App / 小程序多端运行',
					showCancel: false
				})
			}
		}
	}
</script>

<style>
	.page {
		padding-bottom: 40rpx;
	}

	.profile-header {
		background: linear-gradient(135deg, #42b883, #2f8f63);
		border-radius: 0 0 40rpx 40rpx;
		padding: 50rpx 30rpx 30rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar-lg {
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
		border: 4rpx solid rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 26rpx;
	}

	.avatar-lg-text {
		font-size: 56rpx;
		color: #ffffff;
		font-weight: bold;
	}

	.user-text {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.user-name {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.user-role-row {
		display: flex;
		align-items: center;
		margin-top: 12rpx;
	}

	.user-role {
		font-size: 22rpx;
		color: #ffffff;
		background: rgba(255, 255, 255, 0.22);
		padding: 4rpx 18rpx;
		border-radius: 20rpx;
		margin-right: 14rpx;
	}

	.user-role.admin {
		background: rgba(255, 214, 102, 0.35);
		color: #fff3c4;
	}

	.user-account {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	.status-line {
		margin-top: 30rpx;
		background: rgba(255, 255, 255, 0.18);
		border-radius: 30rpx;
		padding: 18rpx 24rpx;
	}

	.status-text {
		font-size: 26rpx;
		color: #ffffff;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;
	}

	.grid-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24rpx 0;
	}

	.grid-icon {
		width: 92rpx;
		height: 92rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid-icon-text {
		font-size: 44rpx;
	}

	.grid-name {
		font-size: 26rpx;
		color: #333333;
		margin-top: 12rpx;
		font-weight: 500;
	}

	.list-card {
		padding: 8rpx 30rpx;
	}

	.list-item {
		display: flex;
		align-items: center;
		padding: 26rpx 0;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.list-icon {
		font-size: 32rpx;
		margin-right: 20rpx;
	}

	.list-text {
		flex: 1;
		font-size: 30rpx;
		color: #333333;
	}

	.list-arrow {
		font-size: 34rpx;
		color: #cccccc;
	}
</style>
