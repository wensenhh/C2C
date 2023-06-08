import service from '../../utils/request.js'
 
/**
 * 授权登录
 * @param {*} data 
 */
export function Login(data) {
	return service({
		url: '/api/user/login',
		method: 'post',
		data
	})
}

/**
 * 我的收款方式
 * @param {*} data 
 */
export function myPayList(data) {
	return service({
		url: '/api/ctwoc/myshoukuan',
		method: 'post',
		data
	})
}

/**
 * 上传图片接口-提交付款截图/申诉/反诉用到
 * @param {*} data 
 */
export function uploadimg(data) {
	return service({
		url: '/index/ajax/upload',
		method: 'post',
		data
	})
}

/**
 * 添加收款方式
 * @param {*} data 
 */
export function addpayfun(data) {
	return service({
		url: '/api/ctwoc/addshoukuan',
		method: 'post',
		data
	})
}

/**
 * 收款详情
 * @param {*} data 
 */
export function mypayinfo(data) {
	return service({
		url: '/api/ctwoc/shoukuaninfo',
		method: 'post',
		data
	})
}

/**
 * 编辑收款方式
 * @param {*} data 
 */
export function editpayfun(data) {
	return service({
		url: '/api/ctwoc/editshoukuan',
		method: 'post',
		data
	})
}

/**
 * 删除收款方式
 * @param {*} data 
 */
export function delmypay(data) {
	return service({
		url: '/api/ctwoc/delshoukuan',
		method: 'post',
		data
	})
}

/**
 * 发送验证码
 * @param {*} data 
 */
export function sendsmscode(data) {
	return service({
		url: '/api/sms/send',
		method: 'post',
		data
	})
}

/**
 * 修改/绑定手机号
 * @param {*} data 
 */
export function changemobile(data) {
	return service({
		url: '/api/user/changemobile',
		method: 'post',
		data
	})
}

/**
 * 获取待匹配的买单/卖单列表
 * @param {*} data 
 */
export function buyselllist(data) {
	return service({
		url: '/api/ctwoc/buyselllist',
		method: 'post',
		data
	})
}

/**
 * 获取平台规则
 * @param {*} data 
 */
export function mainrules(data) {
	return service({
		url: '/api/ctwoc/getrule',
		method: 'get',
		data
	})
}

/**
 * 匹配买单
 * @param {*} data 
 */
export function matebuyorder(data) {
	return service({
		url: '/api/ctwoc/pipeibuy',
		method: 'post',
		data
	})
}

/**
 * 匹配卖单
 * @param {*} data 
 */
export function matesellorder(data) {
	return service({
		url: '/api/ctwoc/pipeisell',
		method: 'post',
		data
	})
}

/**
 * 发布买单/卖单
 * @param {*} data 
 */
export function issuebuysell(data) {
	return service({
		url: '/api/ctwoc/buyselladd',
		method: 'post',
		data
	})
}

/**
 * 撤销订单
 * @param {*} data 
 */
export function chexiaoorder(data) {
	return service({
		url: '/api/ctwoc/chexiao',
		method: 'post',
		data
	})
}

/**
 * 获取订单列表
 * @param {*} data 
 */
export function orderList(data) {
	return service({
		url: '/api/ctwoc/myorder',
		method: 'post',
		data
	})
}

/**
 * 获取资金明细
 * @param {*} data 
 */
export function moneylog(data) {
	return service({
		url: '/api/ctwoc/moneylog',
		method: 'post',
		data
	})
}

/**
 * 充值
 * @param {*} data 
 */
export function userrechage(data) {
	return service({
		url: '/api/ctwoc/addrechange_order',
		method: 'post',
		data
	})
}

/**
 * 提现
 * @param {*} data 
 */
export function usertixian(data) {
	return service({
		url: '/api/ctwoc/tixian',
		method: 'post',
		data
	})
}

/**
 * 订单详情
 * @param {*} data 
 */
export function myorderinfo(data) {
	return service({
		url: '/api/ctwoc/buysellinfo',
		method: 'post',
		data
	})
}

/**
 * 买家上传凭证
 * @param {*} data 
 */
export function fukuanup(data) {
	return service({
		url: '/api/ctwoc/fukuan',
		method: 'post',
		data
	})
}

/**
 * 卖家确认收款
 * @param {*} data 
 */
export function sellshoukuan(data) {
	return service({
		url: '/api/ctwoc/sellqueren',
		method: 'post',
		data
	})
}

/**
 * 提交申诉
 * @param {*} data 
 */
export function subappeal(data) {
	return service({
		url: '/api/ctwoc/shensu',
		method: 'post',
		data
	})
}

