import { createRouter, createWebHashHistory } from 'vue-router'
import { storeToRefs } from "pinia"
import { useAddrStore } from '../store/user'

//路由数组
const routes = [
    {
        path: "/",
        redirect: '/deal'
    }, {
        path: "/deal",
        name: "交易",
        component: () => import('../pages/deal/deal.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/my",
        name: "我的",
        component: () => import('../pages/my/my.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/rechage",
        name: "充值",
        component: () => import('../pages/rechage/rechage.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/payway",
        name: "收款方式",
        component: () => import('../pages/payway/payway.vue')
    }, {
        path: "/addpay",
        name: "添加收款方式",
        component: () => import('../pages/payway/addpay.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/addpayinfo",
        name: "收款方式详情",
        component: () => import('../pages/payway/addpayinfo.vue')
    }, {
        path: "/contactway",
        name: "绑定联系方式",
        component: () => import('../pages/contactway/contactway.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/issue",
        name: "发布交易",
        component: () => import('../pages/deal/issue.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/orderlist",
        name: "订单列表",
        component: () => import('../pages/deal/orderlist.vue'),
        meta: {
            keepAlive: true
        }
    }, {
        path: "/orderinfo",
        name: "订单详情",
        component: () => import('../pages/deal/orderinfo.vue'),
    }, {
        path: "/subappeal",
        name: "发起申诉",
        component: () => import('../pages/my/subappeal.vue'),
    }, {
        path: "/appealinfo",
        name: "申诉详情",
        component: () => import('../pages/my/appealinfo.vue'),
    }
    
]

//路由对象
const router = createRouter({
    history: createWebHashHistory(),// process.env.BASE_URL
    routes //上面的路由数组
})

router.beforeEach((to, from, next) => {
    // 1. 每个条件执行后都要跟上 next() 或 使用路由跳转 api 否则页面就会停留一动不动
    // 2. 要合理的搭配条件语句，避免出现路由死循环。
    // const token = cookies.get('token')
    // if (to.meta.auth) {
    //     if (!token) {
    //         return router.replace({
    //             path: '/home'
    //         })
    //     }
    //     next()
    // } else {
    //     next()
    // }
    to.meta.keepAlive = true;
    const store = useAddrStore();
    let { showtabbar } = storeToRefs(store)
    const taburl = ['/', '/deal', '/my']
    const nowshowtab = taburl.includes(to.path)
    if (showtabbar.value !== nowshowtab) {
        store.changetab(nowshowtab)
    }
    next()
})

//导出路由对象，在main.js中引用
export default router