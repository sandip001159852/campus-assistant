<template>
	<view class="page">
		<view class="admin-header">
			<view>
				<text class="admin-title">管理后台</text>
				<text class="admin-sub">{{ loginName }} · 座位与预约管理</text>
			</view>
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>

		<!-- 座位状态管理 -->
		<view class="card">
			<view class="card-title">座位状态（{{ seats.length }} 个）</view>
			<view class="seat-list">
				<view class="seat-item" v-for="s in seats" :key="s.id">
					<text class="seat-no">{{ s.no }}</text>
					<text class="seat-status" :class="{ occupied: s.occupied }">{{ s.occupied ? '已占用' : '空闲' }}</text>
				</view>
			</view>
			<button class="btn-primary add-btn" @click="resetSeats">重置座位状态</button>
		</view>

		<!-- 预约管理 -->
		<view class="card">
			<view class="card-title">全部预约（{{ bookings.length }} 条）</view>
			<view class="booking-item" v-for="b in bookings" :key="b.id">
				<view class="booking-info">
					<text class="booking-text">{{ b.user }} · {{ b.seatNo }}</text>
					<text class="booking-meta">{{ b.floor }} · {{ b.time }} · {{ b.duration }}小时 · {{ b.date }}</text>
				</view>
				<text class="release-btn" @click="releaseBooking(b.id)">释放</text>
			</view>
			<view class="empty" v-if="bookings.length === 0">
				<text class="text-muted">暂无预约记录</text>
			</view>
			<button class="btn-primary add-btn" @click="clearBookings" v-if="bookings.length > 0">清空全部预约</button>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	const DEFAULT_SEATS = [
		{ id: 1, no: 'A01', occupied: false, selected: false },
		{ id: 2, no: 'A02', occupied: true, selected: false },
		{ id: 3, no: 'A03', occupied: false, selected: false },
		{ id: 4, no: 'B01', occupied: false, selected: false },
		{ id: 5, no: 'B02', occupied: true, selected: false },
		{ id: 6, no: 'B03', occupied: false, selected: false },
		{ id: 7, no: 'C01', occupied: false, selected: false },
		{ id: 8, no: 'C02', occupied: false, selected: false },
		{ id: 9, no: 'C03', occupied: true, selected: false }
	]

	export default {
		data() {
			return {
				loginName: '管理员',
				seats: [],
				bookings: []
			}
		},
		onShow() {
			const login = getData('login', null)
			if (!login || login.role !== 'admin') {
				uni.showModal({
					title: '需要管理员权限',
					content: '请先使用管理员账号登录',
					showCancel: false,
					success: () => {
						uni.navigateTo({ url: '/pages/login/login?mode=admin&redirect=/pages/admin/admin' })
					}
				})
				return
			}
			this.loginName = login.name || '管理员'
			this.seats = getData('seats', DEFAULT_SEATS)
			this.bookings = getData('bookings', [])
		},
		methods: {
			resetSeats() {
				const saved = getData('seats', null)
				const base = (saved && saved.length ? saved : DEFAULT_SEATS).map((s, i) => ({
					id: s.id,
					no: s.no,
					occupied: DEFAULT_SEATS[i] ? DEFAULT_SEATS[i].occupied : false,
					selected: false
				}))
				// 未释放的预约仍然占用对应座位，保证数据一致
				this.seats = base.map(s => {
					s.occupied = s.occupied || this.bookings.some(b => b.seatNo === s.no)
					return s
				})
				setData('seats', this.seats)
				uni.showToast({ title: '座位状态已重置', icon: 'success' })
			},
			releaseBooking(id) {
				const target = this.bookings.find(b => b.id === id)
				this.bookings = this.bookings.filter(b => b.id !== id)
				setData('bookings', this.bookings)
				if (target) {
					this.seats.forEach(s => {
						if (s.no === target.seatNo && !this.bookings.some(b => b.seatNo === s.no)) {
							s.occupied = false
						}
					})
					setData('seats', this.seats)
				}
				uni.showToast({ title: '已释放该预约', icon: 'success' })
			},
			clearBookings() {
				uni.showModal({
					title: '确认清空',
					content: '将删除全部预约记录并释放所有座位，是否继续？',
					success: (res) => {
						if (res.confirm) {
							this.bookings = []
							setData('bookings', this.bookings)
							this.seats = this.seats.map(s => ({ ...s, occupied: false, selected: false }))
							setData('seats', this.seats)
							uni.showToast({ title: '已清空', icon: 'success' })
						}
					}
				})
			},
			logout() {
				setData('login', null)
				uni.reLaunch({ url: '/pages/index/index' })
			}
		}
	}
</script>

<style>
	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 30rpx 10rpx;
	}

	.admin-title {
		display: block;
		font-size: 36rpx;
		font-weight: 700;
		color: #333333;
	}

	.admin-sub {
		display: block;
		font-size: 24rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.logout-btn {
		margin: 0;
		padding: 0 24rpx;
		height: 64rpx;
		line-height: 64rpx;
		font-size: 26rpx;
		border-radius: 32rpx;
		background: #ffffff;
		color: #ff6b81;
		border: 2rpx solid #ff6b81;
	}

	.seat-list {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 16rpx;
	}

	.seat-item {
		width: 30%;
		margin: 0 1.5% 12rpx;
		box-sizing: border-box;
		border: 1rpx solid #eef0f3;
		border-radius: 10rpx;
		padding: 14rpx 0;
		text-align: center;
		background: #fafbfc;
	}

	.seat-no {
		display: block;
		font-size: 26rpx;
		color: #333333;
	}

	.seat-status {
		display: block;
		font-size: 22rpx;
		color: #42b883;
		margin-top: 6rpx;
	}

	.seat-status.occupied {
		color: #ff6b81;
	}

	.booking-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.booking-info {
		flex: 1;
		margin-right: 16rpx;
	}

	.booking-text {
		display: block;
		font-size: 28rpx;
		color: #333333;
	}

	.booking-meta {
		display: block;
		font-size: 24rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.release-btn {
		font-size: 26rpx;
		color: #ff6b81;
		padding: 8rpx 16rpx;
		border: 2rpx solid #ff6b81;
		border-radius: 30rpx;
	}

	.empty {
		text-align: center;
		padding: 40rpx 0;
	}

	.text-muted {
		font-size: 24rpx;
		color: #999999;
	}
</style>
