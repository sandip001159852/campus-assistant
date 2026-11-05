<template>
	<view class="page">
		<!-- 返回主页入口（tab 页无原生返回按钮） -->
		<view class="back-bar" @click="goHome">
			<text class="back-arrow">←</text>
			<text class="back-text">返回主页</text>
		</view>
		<!-- 定位工具栏 -->
		<view class="toolbar">
			<button class="btn-primary locate-btn" @click="locate">📍 定位我的位置</button>
			<text class="locate-result" v-if="locationText">{{ locationText }}</text>
		</view>

		<!-- 地图组件：显示校园建筑标点 -->
		<map
			id="campusMap"
			class="map"
			:latitude="center.latitude"
			:longitude="center.longitude"
			:markers="markers"
			:scale="16"
			show-location
			@markertap="onMarkerTap"
		></map>

		<!-- 建筑详情卡：点击标点后显示 -->
		<view class="card" v-if="activeBuilding">
			<view class="card-title">{{ activeBuilding.name }}</view>
			<text class="building-desc">{{ activeBuilding.desc }}</text>
			<view class="btn-row">
				<button class="btn-primary small-btn" @click="navigateToBuilding">🧭 导航前往</button>
				<button class="btn-primary small-btn" @click="shareBuilding">📤 分享</button>
			</view>
		</view>

		<!-- 建筑列表：常用控件 checkbox/radio 示例 -->
		<view class="card">
			<view class="card-title">校园主要建筑</view>
			<radio-group @change="onRadioChange">
				<label class="building-row" v-for="b in buildings" :key="b.id">
					<radio :value="String(b.id)" color="#42b883" />
					<text class="building-name">{{ b.name }}</text>
					<text class="building-distance">{{ b.distance }}</text>
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				center: {
					latitude: 31.2304,
					longitude: 121.4737
				},
				locationText: '',
				activeBuilding: null,
				buildings: [
					{ id: 1, name: '图书馆', latitude: 31.2308, longitude: 121.4732, distance: '约 200m', desc: '开放时间 8:00-22:00，期末周延长至 24:00' },
					{ id: 2, name: '第一教学楼', latitude: 31.2301, longitude: 121.4742, distance: '约 300m', desc: '公共教室与阶梯教室，晚间自习开放' },
					{ id: 3, name: '学生食堂', latitude: 31.2296, longitude: 121.4728, distance: '约 400m', desc: '三层食堂，营业时间 6:30-21:00' },
					{ id: 4, name: '体育馆', latitude: 31.2312, longitude: 121.4740, distance: '约 500m', desc: '室内篮球馆与羽毛球馆，需预约' },
					{ id: 5, name: '校医院', latitude: 31.2299, longitude: 121.4735, distance: '约 350m', desc: '24 小时急诊，电话 021-12345678' }
				]
			}
		},
		computed: {
			markers() {
				return this.buildings.map(b => ({
					id: b.id,
					latitude: b.latitude,
					longitude: b.longitude,
					title: b.name,
					width: 32,
					height: 32,
					callout: {
						content: b.name,
						display: 'ALWAYS',
						fontSize: 12,
						borderRadius: 6,
						padding: 4,
						bgColor: '#42b883',
						color: '#ffffff'
					}
				}))
			}
		},
		methods: {
			// 返回主页（tab 页切换）
			goHome() {
				uni.switchTab({ url: '/pages/index/index' })
			},
			// 原生功能：调用系统定位
			locate() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						this.center = {
							latitude: res.latitude,
							longitude: res.longitude
						}
						this.locationText = '经度 ' + res.longitude.toFixed(4) + '，纬度 ' + res.latitude.toFixed(4)
						uni.showToast({ title: '定位成功', icon: 'success' })
					},
					fail: (err) => {
						console.error('定位失败', err)
						uni.showToast({ title: '定位失败，请检查权限设置', icon: 'none' })
					}
				})
			},
			onMarkerTap(e) {
				const id = e.detail.markerId
				this.activeBuilding = this.buildings.find(b => b.id === id)
			},
			onRadioChange(e) {
				const id = Number(e.detail.value)
				this.activeBuilding = this.buildings.find(b => b.id === id)
				const b = this.activeBuilding
				this.center = { latitude: b.latitude, longitude: b.longitude }
			},
			navigateToBuilding() {
				const b = this.activeBuilding
				if (!b) {
					return
				}
				// #ifdef H5
				// H5 端不支持 uni.openLocation，改用高德地图网页导航（gcj02 坐标）
				const url = 'https://uri.amap.com/navigation?to=' + b.longitude + ',' + b.latitude +
					'&mode=car&coordinate=gaode&callnative=0'
				window.open(url, '_blank')
				// #endif
				// #ifndef H5
				uni.openLocation({
					latitude: b.latitude,
					longitude: b.longitude,
					name: b.name,
					address: b.desc,
					success: () => {
						console.log('打开外部地图成功')
					},
					fail: () => {
						uni.showToast({ title: '打开地图失败，请检查地图应用', icon: 'none' })
					}
				})
				// #endif
			},
			shareBuilding() {
				uni.showActionSheet({
					itemList: ['复制名称', '复制描述'],
					success: (res) => {
						const b = this.activeBuilding
						const content = res.tapIndex === 0 ? b.name : b.desc
						uni.setClipboardData({
							data: content,
							success: () => {
								uni.showToast({ title: '已复制', icon: 'success' })
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.toolbar {
		padding: 20rpx 20rpx 0;
		display: flex;
		align-items: center;
	}

	.locate-btn {
		width: 260rpx;
		font-size: 26rpx;
		margin: 0;
	}

	.locate-result {
		font-size: 24rpx;
		color: #42b883;
		margin-left: 20rpx;
	}

	.map {
		width: 100%;
		height: 560rpx;
		margin-top: 20rpx;
	}

	.building-desc {
		font-size: 26rpx;
		color: #666666;
		display: block;
		margin-bottom: 16rpx;
	}

	.btn-row {
		display: flex;
		justify-content: space-between;
	}

	.small-btn {
		width: 46%;
		font-size: 26rpx;
	}

	.building-row {
		display: flex;
		align-items: center;
		padding: 18rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.building-row:last-child {
		border-bottom: none;
	}

	.building-name {
		flex: 1;
		font-size: 28rpx;
		color: #333333;
		margin-left: 10rpx;
	}

	.building-distance {
		font-size: 24rpx;
		color: #999999;
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
