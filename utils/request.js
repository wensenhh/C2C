import axios from 'axios'
import { networkConfig } from '../config/networkConfig'
import { showToast } from 'vant';
import { useAddrStore } from '../src/store/user'
import { storeToRefs } from 'pinia'
let store = null
// create an axios instance
const service = axios.create({
	baseURL: networkConfig.serverUrl,
	// 超时
	timeout: networkConfig.requestTimeout,
	crossDomain: true,
})

// request拦截器,在请求之前做一些处理
service.interceptors.request.use(
	config => {
		store = useAddrStore()
		const { usertoken } = storeToRefs(store)
		if (usertoken.value && usertoken.value !== '') {
			config.headers["token"] = usertoken.value;
		}
		config.headers["Content-Type"] = 'application/x-www-form-urlencoded'
		return config;
	},
	error => {
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

//配置成功后的拦截器
service.interceptors.response.use(async res => {
	if (res.data.code == 1) {
		return res.data
	} else if (res.data.code == 401) {
		await store.changetoken('')
		await store.loginaddr()
	} else {
		showToast(res.data.msg)
		return Promise.reject(res.data.msg);
	}
}, error => {
	console.log(error)
	showToast(`接口${error.config.url}異常~`)
	if (error.response.code) {
		console.log('接口異常')
		switch (error.response.code) {
			case 401:
				break;
			default:
				break;
		}
	}
	return Promise.reject(error)
})

export default service