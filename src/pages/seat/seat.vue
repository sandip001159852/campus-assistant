<template>
	<view class="page">
		<!-- 选座条件 -->
		<view class="card">
			<view class="card-title">预约选座</view>
			<view class="form-row">
				<text class="label">所在楼层</text>
				<picker :range="floorList" :value="form.floor" @change="onFloorChange">
					<view class="picker-value">{{ floorList[form.floor] }}</view>
				</picker>
			</view>
			<view class="form-row">
				<text class="label">预约时段</text>
				<picker :range="timeList" :value="form.time" @change="onTimeChange">
					<view class="picker-value">{{ timeList[form.time] }}</view>
				</picker>
			</view>
			<view class="form-row">
				<text class="label">学习时长</text>
				<view class="slider-wrap">
					<slider :value="form.duration" min="1" max="6" step="1" activeColor="#42b883" @change="onDurationChange" />
					<text class="slider-value">{{ form.duration }} 小时</text>
				</view>
			</view>
			<button class="btn-primary add-btn" @click="bookSeat">立即预约</button>
		</view>

		<!-- 座位状态网格：checkbox 多选示例 -->
		<view class="card">
			<view class="card-title">座位状态（可多选查看）</view>
			<checkbox-group class="seat-grid" @change="onSeatSelect">
				<label class="seat-cell" v-for="s in seats" :key="s.id">
					<checkbox
						:value="String(s.id)"
						:checked="s.selected"
						:disabled="s.occupied"
						color="#42b883"
					/>
					<view class="seat-body" :class="{ occupied: s.occupied }">
						<text class="seat-no">{{ s.no }}</text>
						<text class="seat-status">{{ s.occupied ? '已占用' : '空闲' }}</text>
					</view>
				</label>
			</checkbox-group>
		</view>

		<!-- 我的预约 -->
		<view class="card">
			<view class="card-title">我的预约</view>
			<view class="booking-item" v-for="b in bookings" :key="b.id">
				<view class="booking-info">
					<text class="booking-text">{{ b.floor }} · {{ b.time }} · {{ b.duration }}小时</text>
					<text class="booking-meta">座位 {{ b.seatNo }} · {{ b.date }}</text>
				</view>
				<text class="cancel-btn" @click="cancelBooking(b.id)">取消</text>
			</view>
			<view class="empty" v-if="bookings.length === 0">
				<text class="text-muted">暂无预约记录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	export default {
		data() {
			return {
				floorList: ['一楼大厅', '二楼自习区', '三楼阅览区', '四楼研讨室'],
				timeList: ['08:00-10:00', '10:00-12:00', '13:00-15:00', '15:00-17:00', '18:00-20:00', '20:00-22:00'],
				form: {
					floor: 0,
					time: 0,
					duration: 2
				},
				seats: [],
				bookings: []
			}
		},
		onLoad() {
			this.initSeats()
		},
		onShow() {
			this.initSeats()
		},
		methods: {
			initSeats() {
				const defaults = [
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
				// 优先恢复本地保存的座位状态（含预约占用）
				const saved = getData('seats', null)
				this.seats = saved && saved.length === defaults.length ? saved : defaults
				this.bookings = getData('bookings', [])
				// 以预约记录为准校准占用状态，保证数据一致
				this.seats.forEach(s => {
					s.selected = false
					s.occupied = s.occupied || this.bookings.some(b => b.seatNo === s.no)
				})
				setData('seats', this.seats)
			},
			onFloorChange(e) {
				this.form.floor = Number(e.detail.value)
			},
			onTimeChange(e) {
				this.form.time = Number(e.detail.value)
			},
			onDurationChange(e) {
				this.form.duration = e.detail.value
			},
			onSeatSelect(e) {
				const ids = e.detail.value.map(Number)
				this.seats.forEach(s => {
					s.selected = ids.includes(s.id)
				})
			},
			bookSeat() {
				const selected = this.seats.filter(s => s.selected && !s.occupied)
				if (selected.length === 0) {
					uni.showToast({ title: '请先选择空闲座位', icon: 'none' })
					return
				}
				// 原生功能：预约成功震动反馈
				uni.vibrateShort({
					success: () => {
						console.log('预约成功，震动反馈')
					}
				})
				const login = getData('login', null)
				const booking = {
					id: Date.now(),
					user: login && login.name ? login.name : (login ? login.username : '学生'),
					floor: this.floorList[this.form.floor],
					time: this.timeList[this.form.time],
					duration: this.form.duration,
					seatNo: selected[0].no,
					date: this.formatDate(new Date())
				}
				this.bookings.unshift(booking)
				setData('bookings', this.bookings)
				// 预约成功后将该座位标记为已占用，并清除其他选中状态
				const chosen = selected[0]
				this.seats.forEach(s => {
					s.selected = false
					if (s.id === chosen.id) {
						s.occupied = true
					}
				})
				setData('seats', this.seats)
				uni.showToast({ title: '预约成功', icon: 'success' })
			},
			cancelBooking(id) {
				const target = this.bookings.find(b => b.id === id)
				this.bookings = this.bookings.filter(b => b.id !== id)
				setData('bookings', this.bookings)
				// 取消预约后释放对应座位
				if (target) {
					this.seats.forEach(s => {
						if (s.no === target.seatNo) {
							s.occupied = false
						}
					})
					setData('seats', this.seats)
				}
				uni.showToast({ title: '已取消', icon: 'none' })
			},
			formatDate(d) {
				return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
			}
		}
	}
</script>

<style>
	.form-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.label {
		width: 160rpx;
		font-size: 28rpx;
		color: #666666;
	}

	.picker-value {
		height: 72rpx;
		line-height: 72rpx;
		background: #f5f6f8;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		min-width: 220rpx;
	}

	.slider-wrap {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.slider-wrap slider {
		flex: 1;
	}

	.slider-value {
		font-size: 26rpx;
		color: #42b883;
		width: 100rpx;
		text-align: right;
	}

	.add-btn {
		margin-top: 10rpx;
	}

	.seat-grid {
		display: flex;
		flex-wrap: wrap;
	}

	.seat-cell {
		width: 33.33%;
		display: flex;
		align-items: center;
		padding: 12rpx 0;
	}

	.seat-body {
		width: 120rpx;
		height: 88rpx;
		border-radius: 12rpx;
		background: #e8f8f1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 8rpx;
	}

	.seat-body.occupied {
		background: #ffe9e9;
	}

	.seat-no {
		font-size: 26rpx;
		font-weight: 500;
		color: #333333;
	}

	.seat-status {
		font-size: 20rpx;
		color: #42b883;
	}

	.seat-body.occupied .seat-status {
		color: #ff6b81;
	}

	.booking-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.booking-item:last-child {
		border-bottom: none;
	}

	.booking-info {
		flex: 1;
	}

	.booking-text {
		font-size: 28rpx;
		color: #333333;
	}

	.booking-meta {
		display: block;
		font-size: 24rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.cancel-btn {
		font-size: 26rpx;
		color: #ff4d4f;
		padding: 10rpx 20rpx;
	}

	.empty {
		text-align: center;
		padding: 30rpx 0;
	}
</style>
