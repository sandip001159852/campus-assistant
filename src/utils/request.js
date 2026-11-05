/**
 * 网络请求封装：统一基于 uni.request
 * 满足"网络请求"知识点要求；服务端接口就绪后即可直接使用
 */

const BASE_URL = ''

/**
 * 发起请求
 * @param {Object} options { url, method, data, success, fail, complete }
 */
export function request(options) {
	const {
		url,
		method = 'GET',
		data = {},
		header = {},
		success,
		fail,
		complete
	} = options

	uni.request({
		url: BASE_URL + url,
		method,
		data,
		header: {
			'Content-Type': 'application/json',
			...header
		},
		success: (res) => {
			if (res.statusCode >= 200 && res.statusCode < 300) {
				success && success(res.data)
			} else {
				fail && fail({ code: res.statusCode, msg: '请求失败：' + res.statusCode })
			}
		},
		fail: (err) => {
			fail && fail(err)
		},
		complete
	})
}

export default {
	request
}
