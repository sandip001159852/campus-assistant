<template>
	<view class="page">
		<!-- 顶部欢迎区 -->
		<view class="header">
			<view class="header-left">
				<text class="hello">你好，{{ loginName }}</text>
				<text class="sub">{{ todayText }} · 新的一天加油</text>
			</view>
			<view class="header-right">
				<text class="switch-btn" @click="goAccount">切换账号</text>
				<view class="avatar" @click="goProfile">
					<text class="avatar-text">校</text>
				</view>
			</view>
		</view>

		<!-- 功能宫格入口 -->
		<view class="grid card">
			<view class="grid-item" v-for="item in menuList" :key="item.path" @click="goPage(item)">
				<view class="grid-icon" :style="{ backgroundColor: item.bg }">
					<text class="grid-icon-text">{{ item.icon }}</text>
				</view>
				<text class="grid-name">{{ item.title }}</text>
				<text class="grid-desc">{{ item.desc }}</text>
			</view>
		</view>

		<!-- 快捷信息卡片：主页数据与子页面联动 -->
		<view class="card">
			<view class="card-title">今日概览</view>
			<view class="stat-row">
				<view class="stat-item">
					<text class="stat-num">{{ todayClassCount }}</text>
					<text class="stat-label">今日课程</text>
				</view>
				<view class="stat-item">
					<text class="stat-num">{{ lostCount }}</text>
					<text class="stat-label">失物信息</text>
				</view>
				<view class="stat-item">
					<text class="stat-num">{{ seatCount }}</text>
					<text class="stat-label">座位预约</text>
				</view>
			</view>
		</view>

		<!-- 原生能力演示区 -->
		<view class="card">
			<view class="card-title">手机原生功能演示</view>
			<view class="native-row">
				<button class="btn-primary native-btn" @click="getLocation">📍 定位</button>
				<button class="btn-primary native-btn" @click="vibrate">📳 震动</button>
				<button class="btn-primary native-btn" @click="scanCode">📷 扫码</button>
			</view>
		</view>

		<!-- 校园公告轮播 -->
		<view class="card">
			<view class="card-title">最新公告</view>
			<swiper class="banner" autoplay circular interval="4000" indicator-dots indicator-color="#ffffff" indicator-active-color="#42b883">
				<swiper-item v-for="n in noticeList" :key="n.id" @click="goNoticeDetail(n.id)">
					<view class="banner-item">
						<text class="banner-title">{{ n.title }}</text>
						<text class="banner-date">{{ n.date }}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import { getData } from '@/utils/store.js'

	export default {
		data() {
			return {
				menuList: [
					{ path: '/pages/timetable/timetable', title: '课程表', desc: '本周课程安排', icon: '📚', bg: '#42b883', isTab: true },
					{ path: '/pages/map/map', title: '校园地图', desc: '定位与导航', icon: '🗺️', bg: '#409eff', isTab: true },
					{ path: '/pages/lost/lost', title: '失物招领', desc: '发布与查找', icon: '🔍', bg: '#f0ad4e', isTab: true },
					{ path: '/pages/seat/seat', title: '图书馆座位', desc: '选座与预约', icon: '🪑', bg: '#7c6cf0', isTab: false },
					{ path: '/pages/notice/notice', title: '校园公告', desc: '通知与新闻', icon: '📢', bg: '#ff6b81', isTab: true },
					{ path: '/pages/admin/admin', title: '管理后台', desc: '座位与预约管理', icon: '🛠️', bg: '#5b6b7c', isTab: false }
				],
				noticeList: [
					{ id: 1, title: '2026年秋季学期选课通知', date: '2026-11-01' },
					{ id: 2, title: '图书馆期末考试周延长开放时间', date: '2026-11-02' },
					{ id: 3, title: '校园网络维护通知（本周六）', date: '2026-11-03' }
				],
				todayClassCount: 0,
				lostCount: 0,
				seatCount: 0,
				loginName: '同学'
			}
		},
		computed: {
			todayText() {
				const weekMap = ['日', '一', '二', '三', '四', '五', '六']
				const d = new Date()
				return d.getMonth() + 1 + '月' + d.getDate() + '日 星期' + weekMap[d.getDay()]
			}
		},
		onShow() {
			this.refreshStats()
			// 未登录时先进入学生登录页
			const login = getData('login', null)
			if (!login) {
				uni.navigateTo({ url: '/pages/login/login?mode=student' })
				return
			}
			this.loginName = login.name || '同学'
		},
		methods: {
			refreshStats() {
				// 从本地存储读取其他页面的数据，实现跨页面数据联动
				const timetable = getData('timetable', [])
				const today = new Date().getDay()
				this.todayClassCount = timetable.filter(item => item.day === today).length
				this.lostCount = getData('lost_items', []).length
				// 座位预约数：与座位页 bookings 联动
				this.seatCount = getData('bookings', []).length
			},
			goAccount() {
				uni.navigateTo({
					url: '/pages/account/account'
				})
			},
			goProfile() {
				uni.navigateTo({
					url: '/pages/profile/profile'
				})
			},
			goPage(item) {
				// tabBar 页面用 switchTab，普通页面用 navigateTo
				if (item.isTab) {
					uni.switchTab({
						url: item.path
					})
				} else {
					uni.navigateTo({
						url: item.path + '?from=home'
					})
				}
			},
			goNoticeDetail(id) {
				uni.navigateTo({
					url: '/pages/notice/detail?id=' + id
				})
			},
			// 原生功能：获取定位
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						uni.showModal({
							title: '定位成功',
							content: '经度：' + res.longitude + '\n纬度：' + res.latitude,
							showCancel: false
						})
					},
					fail: (err) => {
						uni.showToast({
							title: '定位失败，请检查权限',
							icon: 'none'
						})
					}
				})
			},
			// 原生功能：震动反馈
			vibrate() {
				uni.vibrateLong({
					success: () => {
						uni.showToast({
							title: '震动已触发',
							icon: 'success'
						})
					}
				})
			},
			// 原生功能：扫码
			scanCode() {
				uni.scanCode({
					success: (res) => {
						uni.showModal({
							title: '扫码结果',
							content: res.result,
							showCancel: false
						})
					},
					fail: () => {
						uni.showToast({
							title: '扫码取消或失败',
							icon: 'none'
						})
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

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 30rpx 10rpx;
	}

	.header-left {
		display: flex;
		flex-direction: column;
	}

	.hello {
		font-size: 40rpx;
		font-weight: bold;
		color: #333333;
	}

	.sub {
		font-size: 24rpx;
		color: #999999;
		margin-top: 8rpx;
	}

	.header-right {
		display: flex;
		align-items: center;
	}

	.switch-btn {
		font-size: 26rpx;
		color: #42b883;
		margin-right: 24rpx;
		padding: 8rpx 20rpx;
		border: 2rpx solid #42b883;
		border-radius: 30rpx;
	}

	.avatar {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #42b883, #2f8f63);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar-text {
		color: #ffffff;
		font-size: 36rpx;
		font-weight: bold;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx 0;
	}

	.grid-item {
		width: 33.33%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24rpx 0;
	}

	.grid-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid-icon-text {
		font-size: 48rpx;
	}

	.grid-name {
		font-size: 28rpx;
		color: #333333;
		margin-top: 12rpx;
		font-weight: 500;
	}

	.grid-desc {
		font-size: 22rpx;
		color: #999999;
		margin-top: 4rpx;
	}

	.card-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 16rpx;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
	}

	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-num {
		font-size: 44rpx;
		font-weight: bold;
		color: #42b883;
	}

	.stat-label {
		font-size: 24rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.native-row {
		display: flex;
		justify-content: space-between;
	}

	.native-btn {
		width: 30%;
		font-size: 26rpx;
	}

	.banner {
		height: 140rpx;
	}

	.banner-item {
		height: 140rpx;
		border-radius: 12rpx;
		background: linear-gradient(135deg, #42b883, #2f8f63);
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 30rpx;
	}

	.banner-title {
		color: #ffffff;
		font-size: 30rpx;
		font-weight: 500;
	}

	.banner-date {
		color: rgba(255, 255, 255, 0.85);
		font-size: 22rpx;
		margin-top: 8rpx;
	}
</style>
