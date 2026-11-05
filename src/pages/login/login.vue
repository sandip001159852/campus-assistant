<template>
	<view class="page">
		<view class="login-box">
			<view class="logo">
				<text class="logo-text">校园助手</text>
				<text class="logo-sub">Campus Assistant</text>
			</view>

			<!-- 模式切换：学生 / 管理员 -->
			<view class="mode-tabs">
				<view class="mode-tab" :class="{ active: mode === 'student' }" @click="switchMode('student')">学生登录</view>
				<view class="mode-tab" :class="{ active: mode === 'admin' }" @click="switchMode('admin')">管理员登录</view>
			</view>

			<view class="form">
				<view class="form-row">
					<text class="label">{{ mode === 'admin' ? '管理员账号' : '学号' }}</text>
					<input class="input" v-model="form.username" :placeholder="mode === 'admin' ? '请输入管理员账号' : '请输入学号'" />
				</view>
				<view class="form-row">
					<text class="label">密码</text>
					<input class="input" v-model="form.password" password placeholder="请输入密码" />
				</view>
				<button class="btn-primary login-btn" @click="doLogin">登 录</button>
				<view class="tip">
					<text class="tip-text">{{ mode === 'admin' ? '演示账号：admin / 123456' : '演示账号：student / 123456' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getData, setData } from '@/utils/store.js'

	export default {
		data() {
			return {
				mode: 'student',
				form: {
					username: '',
					password: ''
				},
				redirect: ''
			}
		},
		onLoad(options) {
			if (options.mode === 'admin') {
				this.mode = 'admin'
			}
			this.redirect = options.redirect || ''
		},
		methods: {
			switchMode(m) {
				this.mode = m
				this.form.username = ''
				this.form.password = ''
			},
			doLogin() {
				const username = this.form.username.trim()
				const password = this.form.password
				if (!username || !password) {
					uni.showToast({ title: '请输入账号和密码', icon: 'none' })
					return
				}
				if (this.mode === 'admin') {
					if (username === 'admin' && password === '123456') {
						this.finishLogin({ role: 'admin', username, name: '管理员' })
					} else {
						uni.showToast({ title: '管理员账号或密码错误', icon: 'none' })
					}
					return
				}
				// 学生：内置演示账号或本地注册账号
				const users = getData('users', [])
				const found = users.find(u => u.role === 'student' && u.username === username && u.password === password)
				if (username === 'student' && password === '123456') {
					this.finishLogin({ role: 'student', username, name: '同学' })
				} else if (found) {
					this.finishLogin({ role: 'student', username, name: found.name || username })
				} else {
					uni.showToast({ title: '学号或密码错误', icon: 'none' })
				}
			},
			finishLogin(user) {
				setData('login', user)
				uni.showToast({ title: '登录成功', icon: 'success' })
				setTimeout(() => {
					if (this.redirect) {
						uni.reLaunch({ url: this.redirect })
					} else if (user.role === 'admin') {
						uni.reLaunch({ url: '/pages/admin/admin' })
					} else {
						uni.switchTab({ url: '/pages/index/index' })
					}
				}, 600)
			}
		}
	}
</script>

<style>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #42b883 0%, #f5f6f8 40%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		box-sizing: border-box;
	}

	.login-box {
		width: 100%;
		background: #ffffff;
		border-radius: 24rpx;
		padding: 60rpx 40rpx 40rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.08);
	}

	.logo {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.logo-text {
		display: block;
		font-size: 44rpx;
		font-weight: 700;
		color: #333333;
	}

	.logo-sub {
		display: block;
		font-size: 24rpx;
		color: #999999;
		margin-top: 8rpx;
	}

	.mode-tabs {
		display: flex;
		background: #f5f6f8;
		border-radius: 40rpx;
		padding: 6rpx;
		margin-bottom: 40rpx;
	}

	.mode-tab {
		flex: 1;
		text-align: center;
		height: 68rpx;
		line-height: 68rpx;
		font-size: 28rpx;
		color: #666666;
		border-radius: 34rpx;
	}

	.mode-tab.active {
		background: #42b883;
		color: #ffffff;
	}

	.form-row {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.label {
		width: 160rpx;
		font-size: 28rpx;
		color: #666666;
	}

	.input {
		flex: 1;
		height: 80rpx;
		background: #f5f6f8;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.login-btn {
		margin-top: 20rpx;
	}

	.tip {
		margin-top: 20rpx;
		text-align: center;
	}

	.tip-text {
		font-size: 24rpx;
		color: #999999;
	}
</style>
