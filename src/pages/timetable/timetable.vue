<template>
	<view class="page">
		<!-- 返回主页入口（tab 页无原生返回按钮） -->
		<view class="back-bar" @click="goHome">
			<text class="back-arrow">←</text>
			<text class="back-text">返回主页</text>
		</view>
		<!-- 添加/编辑课程表单 -->
		<view class="card">
			<view class="card-title">{{ editingId ? '编辑课程' : '添加课程' }}</view>
			<view class="form-row">
				<text class="label">课程名称</text>
				<input class="input" v-model="form.name" placeholder="请输入课程名称" />
			</view>
			<view class="form-row">
				<text class="label">上课日期</text>
				<picker :range="dayList" :value="form.day" @change="onDayChange">
					<view class="picker-value">{{ dayList[form.day] }}</view>
				</picker>
			</view>
			<view class="form-row">
				<text class="label">节次范围</text>
				<view class="period-range">
					<picker :range="periodList" :value="form.period" @change="onPeriodChange">
						<view class="picker-value">{{ periodList[form.period] }}</view>
					</picker>
					<text class="range-sep">至</text>
					<picker :range="periodList" :value="form.endPeriod" @change="onEndPeriodChange">
						<view class="picker-value">{{ periodList[form.endPeriod] }}</view>
					</picker>
				</view>
			</view>
			<view class="form-row">
				<text class="label">上课地点</text>
				<input class="input" v-model="form.room" placeholder="如：教学楼A101" />
			</view>
			<view class="form-row">
				<text class="label">是否重要</text>
				<switch :checked="form.important" color="#42b883" @change="onSwitchChange" />
			</view>
			<view class="btn-row-form">
				<button class="btn-primary add-btn" @click="saveCourse">{{ editingId ? '保存修改' : '添加课程' }}</button>
				<button class="btn-cancel" v-if="editingId" @click="cancelEdit">取消编辑</button>
			</view>
		</view>

		<!-- 课程表：星期×节次网格 -->
		<scroll-view scroll-x class="tt-scroll" v-if="courses.length > 0">
			<view class="tt-grid">
				<view class="tt-row">
					<view class="tt-cell tt-label">节次</view>
					<view class="tt-cell tt-head" v-for="d in dayList" :key="d">{{ d }}</view>
				</view>
				<view class="tt-row" v-for="(p, pIdx) in periodList" :key="p">
					<view class="tt-cell tt-label">{{ p }}</view>
					<view class="tt-cell tt-slot" v-for="(d, dIdx) in dayList" :key="d">
						<view class="tt-course" :class="{ important: c.important, span: c.endPeriod && c.endPeriod !== c.period }" v-for="c in courseAt(dIdx, pIdx)" :key="c.id" @click="showCourseActions(c)">
							<text class="tt-name">{{ c.name }}</text>
							<text class="tt-room" v-if="c.room && c.room !== '待定'">{{ c.room }}</text>
							<text class="tt-tag" v-if="c.period === pIdx && c.endPeriod && c.endPeriod !== c.period">{{ c.period + 1 }}-{{ c.endPeriod + 1 }}节</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="empty" v-if="courses.length === 0">
			<text class="text-muted">暂无课程，请在上方添加</text>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	export default {
		data() {
			return {
				dayList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
				periodList: ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节', '第8节'],
				form: {
					name: '',
					day: 0,
					period: 0,
					endPeriod: 0,
					room: '',
					important: false
				},
				endTouched: false,
				editingId: null,
				courses: []
			}
		},
		computed: {
			visibleDays() {
				return [0, 1, 2, 3, 4, 5, 6]
			}
		},
		onLoad(options) {
			// 接收主页传递的参数（页面数据传递演示）
			if (options.title) {
				console.log('从主页进入课程表：', options.title)
			}
			this.courses = getData('timetable', [])
		},
		onShow() {
			this.courses = getData('timetable', [])
		},
		methods: {
			// 返回主页（tab 页切换）
			goHome() {
				uni.switchTab({ url: '/pages/index/index' })
			},
			getCourses(day) {
				return this.courses.filter(c => c.day === day).sort((a, b) => a.period - b.period)
			},
			onDayChange(e) {
				this.form.day = Number(e.detail.value)
			},
			onPeriodChange(e) {
				const v = Number(e.detail.value)
				this.form.period = v
				// 结束节次未手动设置时跟随开始节次
				if (!this.endTouched) {
					this.form.endPeriod = v
				}
			},
			onEndPeriodChange(e) {
				const v = Number(e.detail.value)
				this.form.endPeriod = v
				this.endTouched = true
				if (v < this.form.period) {
					uni.showToast({ title: '结束节次不能早于开始节次', icon: 'none' })
				}
			},
			onSwitchChange(e) {
				this.form.important = e.detail.value
			},
			saveCourse() {
				if (!this.form.name.trim()) {
					uni.showToast({ title: '请输入课程名称', icon: 'none' })
					return
				}
				const end = this.endTouched ? this.form.endPeriod : this.form.period
				if (end < this.form.period) {
					uni.showToast({ title: '结束节次不能早于开始节次', icon: 'none' })
					return
				}
				if (this.editingId) {
					const idx = this.courses.findIndex(c => c.id === this.editingId)
					if (idx > -1) {
						this.courses[idx] = {
							...this.courses[idx],
							name: this.form.name.trim(),
							day: this.form.day,
							period: this.form.period,
							endPeriod: end,
							room: this.form.room.trim() || '待定',
							important: this.form.important
						}
					}
					this.editingId = null
					uni.showToast({ title: '修改成功', icon: 'success' })
				} else {
					this.courses.push({
						id: Date.now(),
						name: this.form.name.trim(),
						day: this.form.day,
						period: this.form.period,
						endPeriod: end,
						room: this.form.room.trim() || '待定',
						important: this.form.important
					})
					uni.showToast({ title: '添加成功', icon: 'success' })
				}
				setData('timetable', this.courses)
				this.resetForm()
			},
			startEdit(c) {
				this.editingId = c.id
				this.form.name = c.name
				this.form.day = c.day
				this.form.period = c.period
				this.form.endPeriod = (c.endPeriod && c.endPeriod >= c.period) ? c.endPeriod : c.period
				this.endTouched = !!(c.endPeriod && c.endPeriod !== c.period)
				this.form.room = c.room === '待定' ? '' : c.room
				this.form.important = c.important
				uni.pageScrollTo({ scrollTop: 0, duration: 200 })
			},
			cancelEdit() {
				this.editingId = null
				this.resetForm()
			},
			resetForm() {
				this.form.name = ''
				this.form.day = 0
				this.form.period = 0
				this.form.endPeriod = 0
				this.form.room = ''
				this.form.important = false
				this.endTouched = false
			},
			showCourseActions(c) {
				uni.showActionSheet({
					itemList: ['修改', '删除'],
					success: (res) => {
						if (res.tapIndex === 0) {
							this.startEdit(c)
						} else if (res.tapIndex === 1) {
							this.removeCourse(c.id)
						}
					}
				})
			},
			courseAt(day, period) {
				return this.courses.filter(c => c.day === day && period >= c.period && period <= (c.endPeriod !== undefined ? c.endPeriod : c.period))
			},
			removeCourse(id) {
				this.courses = this.courses.filter(c => c.id !== id)
				setData('timetable', this.courses)
				uni.showToast({ title: '已删除', icon: 'none' })
			}
		}
	}
</script>

<style>
	.form-row {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.label {
		width: 140rpx;
		font-size: 28rpx;
		color: #666666;
		flex-shrink: 0;
	}

	.input {
		flex: 1;
		height: 72rpx;
		background: #f5f6f8;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.picker-value {
		height: 64rpx;
		line-height: 64rpx;
		background: #f5f6f8;
		border-radius: 10rpx;
		padding: 0 16rpx;
		font-size: 26rpx;
		min-width: 140rpx;
		text-align: center;
	}

	.period-range {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.range-sep {
		color: #999999;
		font-size: 26rpx;
		margin: 0 12rpx;
	}

	.btn-row-form {
		display: flex;
		align-items: center;
		margin-top: 16rpx;
	}

	.btn-row-form .add-btn {
		flex: 1;
		margin-top: 0;
	}

	.btn-cancel {
		margin-left: 16rpx;
		padding: 0 32rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: #ffffff;
		color: #999999;
		border: 2rpx solid #dddddd;
		font-size: 28rpx;
	}

	.add-btn {
		margin-top: 10rpx;
	}

	.course-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.course-item:last-child {
		border-bottom: none;
	}

	.course-info {
		flex: 1;
	}

	.course-name {
		font-size: 30rpx;
		color: #333333;
		font-weight: 500;
	}

	.course-name.important {
		color: #ff6b81;
	}

	.course-meta {
		display: block;
		font-size: 24rpx;
		color: #999999;
		margin-top: 6rpx;
	}

	.delete-btn {
		font-size: 26rpx;
		color: #ff4d4f;
		padding: 10rpx 20rpx;
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

	.tt-scroll {
		margin-top: 24rpx;
		white-space: nowrap;
	}

	.tt-grid {
		min-width: 848rpx;
	}

	.tt-row {
		display: flex;
	}

	.tt-cell {
		width: 106rpx;
		min-height: 128rpx;
		box-sizing: border-box;
		flex-shrink: 0;
	}

	.tt-label {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #999999;
	}

	.tt-head {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		font-weight: 600;
		color: #333333;
		padding-bottom: 8rpx;
	}

	.tt-slot {
		margin: 3rpx;
		border: 1rpx solid #eef0f3;
		border-radius: 8rpx;
		background: #fafbfc;
		min-height: 122rpx;
		padding: 4rpx;
		position: relative;
	}

	.tt-course {
		background: #e8f0fe;
		border: 2rpx solid #4a90d9;
		border-radius: 8rpx;
		padding: 10rpx 8rpx;
		margin-bottom: 6rpx;
		min-height: 100rpx;
		box-sizing: border-box;
	}

	.tt-course.important {
		background: #4a90d9;
		border-color: #4a90d9;
	}

	.tt-course.span {
		border-left: 8rpx solid #4a90d9;
	}

	.tt-course.span.important {
		border-left-color: #ffffff;
	}

	.tt-course.important .tt-name,
	.tt-course.important .tt-room,
	.tt-course.important .tt-tag {
		color: #ffffff;
	}

	.tt-name {
		display: block;
		font-size: 22rpx;
		color: #1f3a5f;
		line-height: 1.2;
		word-break: break-all;
	}

	.tt-room {
		display: block;
		font-size: 20rpx;
		color: #4a90d9;
		margin-top: 4rpx;
		word-break: break-all;
	}

	.tt-tag {
		display: block;
		font-size: 18rpx;
		color: #4a90d9;
		margin-top: 4rpx;
		opacity: 0.8;
	}

</style>
