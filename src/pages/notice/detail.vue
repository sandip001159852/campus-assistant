<template>
	<view class="page">
		<view class="card" v-if="notice">
			<view class="detail-head">
				<text class="detail-title">{{ notice.title }}</text>
				<text class="detail-tag" v-if="notice.important">重要</text>
			</view>
			<text class="detail-date">{{ notice.date }} · 校务公开</text>
			<view class="detail-line"></view>
			<text class="detail-body">{{ notice.body }}</text>
			<view class="detail-actions">
				<button class="btn-primary small-btn" @click="back">返回列表</button>
				<button class="btn-primary small-btn" @click="collect">收藏</button>
			</view>
		</view>

		<view class="empty" v-else>
			<text class="text-muted">公告不存在或已被删除</text>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	export default {
		data() {
			return {
				notice: null,
				noticeMap: {
					1: { title: '2026年秋季学期选课通知', date: '2026-11-01', important: true, body: '本学期选修课与通识课选课将于本周五 9:00 开始，持续至下周三 17:00。请同学们提前登录教务系统规划课程，逾期将不再补选。选课开放期间系统压力较大，建议错峰操作。' },
					2: { title: '图书馆期末考试周延长开放时间', date: '2026-11-02', important: true, body: '期末考试周（11月10日至11月22日）图书馆开放时间延长至 24:00，自习区增加照明与插座。晚间 22:00 后仅开放二楼自习区，请同学们合理安排学习时间并保持安静。' },
					3: { title: '校园网络维护通知（本周六）', date: '2026-11-03', important: false, body: '本周六凌晨 1:00-5:00 校园网核心设备升级，期间校园网络将短暂中断，宿舍区网络预计受影响 30 分钟。请提前保存重要资料，避免数据丢失。' },
					4: { title: '秋季运动会报名开启', date: '2026-11-03', important: false, body: '2026 年秋季运动会报名通道开启，比赛项目包括田径、篮球、羽毛球、乒乓球等。报名截止日期为本月 15 日，欢迎同学们踊跃参加。' },
					5: { title: '校园卡一卡通系统升级', date: '2026-10-28', important: false, body: '新一卡通系统已上线，支持手机 NFC 刷卡与线上充值功能。旧卡余额将在升级完成后自动迁移，如有异常请到校园卡服务中心处理。' }
				}
			}
		},
		onLoad(options) {
			// 接收列表页传递的参数：公告 id
			const id = Number(options.id)
			this.notice = this.noticeMap[id] || null
			if (this.notice) {
				uni.setNavigationBarTitle({
					title: this.notice.title
				})
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			collect() {
				const favorites = getData('favorites', [])
				if (favorites.includes(this.notice.id)) {
					uni.showToast({ title: '已收藏过', icon: 'none' })
					return
				}
				favorites.push(this.notice.id)
				setData('favorites', favorites)
				uni.showToast({ title: '收藏成功', icon: 'success' })
			}
		}
	}
</script>

<style>
	.detail-head {
		display: flex;
		align-items: center;
	}

	.detail-title {
		flex: 1;
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}

	.detail-tag {
		font-size: 20rpx;
		color: #ffffff;
		background: #ff6b81;
		border-radius: 8rpx;
		padding: 4rpx 12rpx;
	}

	.detail-date {
		display: block;
		font-size: 24rpx;
		color: #999999;
		margin-top: 16rpx;
	}

	.detail-line {
		height: 2rpx;
		background: #f0f0f0;
		margin: 24rpx 0;
	}

	.detail-body {
		font-size: 28rpx;
		line-height: 1.8;
		color: #444444;
	}

	.detail-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.small-btn {
		width: 46%;
		font-size: 26rpx;
	}

	.empty {
		text-align: center;
		padding: 100rpx 0;
	}
</style>
