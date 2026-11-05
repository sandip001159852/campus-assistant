<template>
	<view class="page">
		<!-- 返回主页入口（tab 页无原生返回按钮） -->
		<view class="back-bar" @click="goHome">
			<text class="back-arrow">←</text>
			<text class="back-text">返回主页</text>
		</view>
		<!-- 搜索框：常用控件 input 示例 -->
		<view class="search-wrap">
			<input class="search-input" v-model="keyword" placeholder="搜索公告关键词" @input="onSearch" />
		</view>

		<!-- 公告列表：点击跳转详情 -->
		<view class="card notice-card" v-for="n in filteredList" :key="n.id" @click="goDetail(n.id)">
			<view class="notice-head">
				<text class="notice-title">{{ n.title }}</text>
				<text class="notice-tag" v-if="n.important">重要</text>
			</view>
			<text class="notice-summary">{{ n.summary }}</text>
			<view class="notice-foot">
				<text class="notice-date">{{ n.date }}</text>
				<text class="notice-more">查看详情 ›</text>
			</view>
		</view>

		<view class="empty" v-if="filteredList.length === 0">
			<text class="text-muted">暂无匹配公告</text>
		</view>

		<!-- 数据来源切换：网络请求加分演示 -->
		<view class="card source-card">
			<view class="card-title">数据源说明</view>
			<text class="source-text">当前展示本地内置公告数据。项目已封装 uni.request 网络请求，配置服务端接口后即可拉取远端数据。</text>
			<button class="btn-primary add-btn" @click="fetchRemote">尝试远程加载</button>
		</view>
	</view>
</template>

<script>
	import { request } from '@/utils/request.js'

	export default {
		data() {
			return {
				keyword: '',
				noticeList: [
					{ id: 1, title: '2026年秋季学期选课通知', summary: '本学期选修课与通识课选课将于本周五开始，请同学们提前规划课程。', date: '2026-11-01', important: true },
					{ id: 2, title: '图书馆期末考试周延长开放时间', summary: '期末考试周图书馆开放时间延长至 24:00，自习区增加照明与插座。', date: '2026-11-02', important: true },
					{ id: 3, title: '校园网络维护通知（本周六）', summary: '本周六凌晨 1:00-5:00 校园网核心设备升级，期间网络将短暂中断。', date: '2026-11-03', important: false },
					{ id: 4, title: '秋季运动会报名开启', summary: '2026 年秋季运动会报名通道开启，截止日期为本月 15 日。', date: '2026-11-03', important: false },
					{ id: 5, title: '校园卡一卡通系统升级', summary: '新一卡通系统上线，支持手机 NFC 刷卡与线上充值功能。', date: '2026-10-28', important: false }
				]
			}
		},
		computed: {
			filteredList() {
				if (!this.keyword) return this.noticeList
				return this.noticeList.filter(n => n.title.indexOf(this.keyword) > -1 || n.summary.indexOf(this.keyword) > -1)
			}
		},
		methods: {
			// 返回主页（tab 页切换）
			goHome() {
				uni.switchTab({ url: '/pages/index/index' })
			},
			onSearch() {
				// 双向绑定已处理，保留方法供扩展
			},
			goDetail(id) {
				// 页面传参：携带公告 id 跳转详情页
				uni.navigateTo({
					url: '/pages/notice/detail?id=' + id
				})
			},
			fetchRemote() {
				// 网络请求演示：调用封装好的 request
				request({
					url: 'https://example.com/api/notices',
					method: 'GET',
					success: (data) => {
						uni.showToast({ title: '远程数据获取成功', icon: 'success' })
					},
					fail: (err) => {
						uni.showToast({ title: '示例接口不可达，仅演示请求封装', icon: 'none' })
					}
				})
			}
		}
	}
</script>

<style>
	.search-wrap {
		padding: 20rpx 20rpx 0;
	}

	.search-input {
		height: 76rpx;
		background: #ffffff;
		border-radius: 38rpx;
		padding: 0 32rpx;
		font-size: 28rpx;
	}

	.notice-head {
		display: flex;
		align-items: center;
	}

	.notice-title {
		flex: 1;
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}

	.notice-tag {
		font-size: 20rpx;
		color: #ffffff;
		background: #ff6b81;
		border-radius: 8rpx;
		padding: 4rpx 12rpx;
	}

	.notice-summary {
		display: block;
		font-size: 26rpx;
		color: #666666;
		margin: 12rpx 0;
	}

	.notice-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.notice-date {
		font-size: 22rpx;
		color: #999999;
	}

	.notice-more {
		font-size: 24rpx;
		color: #42b883;
	}

	.source-text {
		font-size: 24rpx;
		color: #666666;
		display: block;
		margin-bottom: 16rpx;
	}

	.empty {
		text-align: center;
		padding: 60rpx 0;
	}
	.back-bar {
		display: flex;
		align-items: center;
		padding: 16rpx 0 8rpx;
	}

	.back-arrow {
		font-size: 32rpx;
		color: #42b883;
		line-height: 1;
		margin-right: 10rpx;
	}

	.back-text {
		font-size: 28rpx;
		color: #42b883;
	}

</style>
