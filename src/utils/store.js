/**
 * 本地存储封装：统一使用 uni.setStorageSync / getStorageSync
 * 数据在 App 重启后仍然保留，满足"数据本地存储"要求
 */

const PREFIX = 'campus_'

/**
 * 读取 JSON 数据
 * @param {string} key 存储键
 * @param {*} def 默认值
 */
export function getData(key, def = null) {
	try {
		const raw = uni.getStorageSync(PREFIX + key)
		if (raw === '' || raw === null || raw === undefined) {
			return def
		}
		return typeof raw === 'string' ? JSON.parse(raw) : raw
	} catch (e) {
		console.error('getData 失败', key, e)
		return def
	}
}

/**
 * 写入 JSON 数据
 * @param {string} key 存储键
 * @param {*} value 任意可序列化值
 */
export function setData(key, value) {
	try {
		uni.setStorageSync(PREFIX + key, JSON.stringify(value))
		return true
	} catch (e) {
		console.error('setData 失败', key, e)
		return false
	}
}

/**
 * 删除数据
 * @param {string} key 存储键
 */
export function removeData(key) {
	try {
		uni.removeStorageSync(PREFIX + key)
		return true
	} catch (e) {
		console.error('removeData 失败', key, e)
		return false
	}
}

export default {
	getData,
	setData,
	removeData
}
