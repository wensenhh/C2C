import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia'
import { Login } from '../api/app.js'
import { showToast } from 'vant';

// Setup写法
export const useAddrStore = defineStore('addr', {
  persist: {
    enabled: true,//开启数据持久化
    strategies: [
      {
        key: 'USER',//给一个要保存的名称
        storage: localStorage,//sessionStorage / localStorage 存储方式
      }
    ]
  },
  state: () => {
    return {
      address: '',
      usertoken: '',
      parentName: '',
      showtabbar: true,
      userinfo: null,
      userrules: null
    }
  },
  actions: {
    async loginaddr(addr, cb) {
      console.log('执行登录操作=' + addr)
      if (addr && addr !== '') await this.changeaddr(addr)
      // 执行登录操作 if (this.usertoken == '') 
      await this.userLogin()
      let gettokenint = setInterval(() => {
        if (this.usertoken && this.usertoken !== '') {
          clearInterval(gettokenint)
          return cb && cb()
        }
      }, 500);
    },
  
    changeaddr(addr) {
      this.address = addr
    },
  
    changetoken(newtoken) {
      this.usertoken = newtoken
    },
  
    gettoken() {
      return this.usertoken
    },
  
    changeuser(obj) {
      this.userinfo = obj
    },
  
    changetab(boo) {
      this.showtabbar = boo
    },

    changerules(obj) {
      this.userrules = obj
    },
  
    userLogin(){
      Login({
        account: this.address,
        parentName: this.parentName
      }).then(({ data }) => {
        // showToast('登录成功~')
        this.changetoken(data.userinfo.token)
        this.changeuser(data.userinfo)
      })
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAddrStore, import.meta.hot))
}
