<template>
	<view class="page">
		<!-- 返回主页入口（tab 页无原生返回按钮） -->
		<view class="back-bar" @click="goHome">
			<text class="back-arrow">←</text>
			<text class="back-text">返回主页</text>
		</view>
		<!-- 发布表单 -->
		<view class="card">
			<view class="card-title">发布失物 / 招领信息</view>
			<view class="form-row">
				<text class="label">类型</text>
				<radio-group class="radio-inline" @change="onTypeChange">
					<label class="radio-label">
						<radio :value="'lost'" :checked="form.type === 'lost'" color="#42b883" /> 寻物
					</label>
					<label class="radio-label">
						<radio :value="'found'" :checked="form.type === 'found'" color="#42b883" /> 招领
					</label>
				</radio-group>
			</view>
			<view class="form-row">
				<text class="label">物品名称</text>
				<input class="input" v-model="form.name" placeholder="如：黑色钱包" />
			</view>
			<view class="form-row">
				<text class="label">详细描述</text>
				<textarea class="textarea" v-model="form.desc" placeholder="描述物品特征、遗失地点等" />
			</view>
			<view class="form-row">
				<text class="label">联系方式</text>
				<input class="input" v-model="form.contact" placeholder="手机号 / 微信" />
			</view>
			<view class="form-row">
				<text class="label">物品图片</text>
				<view class="upload-area" @click="chooseImage">
					<image v-if="form.image" class="upload-preview" :src="form.image" mode="aspectFill" />
					<view v-else class="upload-placeholder">
						<text class="upload-plus">+</text>
						<text class="text-muted">拍照或相册选择</text>
					</view>
				</view>
			</view>
			<button class="btn-primary add-btn" @click="publish">发布信息</button>
		</view>

		<!-- 信息列表 -->
		<view class="card" v-for="item in items" :key="item.id">
			<view class="lost-item">
				<image v-if="item.image" class="lost-img" :src="item.image" mode="aspectFill" />
				<view class="lost-info">
					<view class="lost-head">
						<text class="lost-tag" :class="item.type === 'lost' ? 'tag-lost' : 'tag-found'">
							{{ item.type === 'lost' ? '寻物' : '招领' }}
						</text>
						<text class="lost-name">{{ item.name }}</text>
					</view>
					<text class="lost-desc">{{ item.desc }}</text>
					<text class="lost-meta">联系人：{{ item.contact }} · {{ item.time }}</text>
				</view>
			</view>
		</view>

		<view class="empty" v-if="items.length === 0">
			<text class="text-muted">还没有信息，发布第一条吧</text>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	export default {
		data() {
			return {
				form: {
					type: 'lost',
					name: '',
					desc: '',
					contact: '',
					image: ''
				},
				items: []
			}
		},
		onShow() {
			this.items = getData('lost_items', [])
		},
		methods: {
			// 返回主页（tab 页切换）
			goHome() {
				uni.switchTab({ url: '/pages/index/index' })
			},
			onTypeChange(e) {
				this.form.type = e.detail.value
			},
			// 原生功能：调用相机 / 相册
			chooseImage() {
				uni.chooseImage({
					count: 1,
					sourceType: ['camera', 'album'],
					sizeType: ['compressed'],
					success: (res) => {
						this.form.image = res.tempFilePaths[0]
					},
					fail: () => {
						uni.showToast({ title: '取消选择', icon: 'none' })
					}
				})
			},
			publish() {
				if (!this.form.name.trim()) {
					uni.showToast({ title: '请输入物品名称', icon: 'none' })
					return
				}
				const item = {
					id: Date.now(),
					type: this.form.type,
					name: this.form.name.trim(),
					desc: this.form.desc.trim() || '暂无描述',
					contact: this.form.contact.trim() || '站内联系',
					image: this.form.image,
					time: this.formatTime(new Date())
				}
				this.items.unshift(item)
				setData('lost_items', this.items)
				this.form = { type: 'lost', name: '', desc: '', contact: '', image: '' }
				uni.showToast({ title: '发布成功', icon: 'success' })
			},
			formatTime(d) {
				return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + this.pad(d.getHours()) + ':' + this.pad(d.getMinutes())
			},
			pad(n) {
				return n < 10 ? '0' + n : '' + n
			}
		}
	}
</script>

<style>
	.form-row {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.label {
		width: 160rpx;
		font-size: 28rpx;
		color: #666666;
		padding-top: 12rpx;
	}

	.input {
		flex: 1;
		height: 72rpx;
		background: #f5f6f8;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.textarea {
		flex: 1;
		height: 160rpx;
		background: #f5f6f8;
		border-radius: 12rpx;
		padding: 16rpx 20rpx;
		font-size: 28rpx;
	}

	.radio-inline {
		display: flex;
		padding-top: 12rpx;
	}

	.radio-label {
		margin-right: 40rpx;
		font-size: 28rpx;
	}

	.upload-area {
		flex: 1;
	}

	.upload-preview {
		width: 220rpx;
		height: 220rpx;
		border-radius: 12rpx;
	}

	.upload-placeholder {
		width: 220rpx;
		height: 220rpx;
		border: 2rpx dashed #cccccc;
		border-radius: 12rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #fafafa;
	}

	.upload-plus {
		font-size: 56rpx;
		color: #cccccc;
	}

	.add-btn {
		margin-top: 10rpx;
	}

	.lost-item {
		display: flex;
	}

	.lost-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
	}

	.lost-info {
		flex: 1;
	}

	.lost-head {
		display: flex;
		align-items: center;
	}

	.lost-tag {
		font-size: 22rpx;
		color: #ffffff;
		border-radius: 8rpx;
		padding: 4rpx 14rpx;
		margin-right: 14rpx;
	}

	.tag-lost {
		background: #ff6b81;
	}

	.tag-found {
		background: #42b883;
	}

	.lost-name {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}

	.lost-desc {
		display: block;
		font-size: 26rpx;
		color: #666666;
		margin: 10rpx 0;
	}

	.lost-meta {
		font-size: 22rpx;
		color: #999999;
	}

	.empty {
		text-align: center;
		padding: 80rpx 0;
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
