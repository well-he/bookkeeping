# Attendance-Manger
- ---
> 写一些整体的设计思路，以及解决方式
> 
> tips:封装的原因都是要针对一些原生的方法或者api进行封装，为了更好的使用以及统一的管理

## 路由跳转的三种方式
- router-link
- Composition API
  - `useRouer`
- JS跳转（传统跳转）
  - `this.$router.push('/welcome');`

## 环境配置
根据环境的不同，需要创建不同的文件
- ---
- 开发环境下，创建一个`.env.dev`的文件
- 生产环境下，创建一个`.env.prod`的文件
- ---

根据不同的环境获取不同的配置，在config/index.js

官方建议：如果需要自定义变量的话，自定义变量需要以`VITE_`开头，这样更安全


## mock.js设置



## axios二次封装
- ---
### 自定义拦截器
- 请求拦截
  + 判断authoizration
- 响应拦截
  + 通过返回的code来判断
- 还需要将常见的几种restful请求方法挂载到requese对象
- ---
### 
``` js
/**
 * 请求核心函数
 * @param {*} options 请求配置
 */
function request(options) {
  options.method = options.method || 'get';
    if (options.method.toLowerCase() === 'get') {
      options.params = options.data; //axios的get和post不同，这里将二者相同
    }
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi; //防止生产环境的api为mockapi
    } else {
      service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
    }
    return service(options);
}
```

## 封装storage 
> 项目多了要添加一个命名空间（一个对象，storage变量都存入这个对象里），不然重名的会相互覆盖
- 存储token
- vuex + storage 存储数据

这是接口
``` ts
interface storage {
    setItem(key: string, val: any): void;
    getItem(key: string): object;
    getStorage(): object;
    clearItem(key: string): void;
    clearAll(): void;
}
```


