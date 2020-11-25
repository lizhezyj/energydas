# 数据采集后台管理系统

## 部署说明

### 安装依赖
```
1. npm run pre
该命令为 package.json 中的自定义命令（cnpm install || yarn --registry https://registry.npm.taobao.org || npm install --registry https://registry.npm.taobao.org），用于将下载源注册为国内源
2. yarn install
anzhaung命令，推荐 yarn 安装，npm 安装会有问题
```

### 本地调试\开发模式
```
npm run serve
```

### 修改src/api/config.js内的API地址
```
.env 文件中
VUE_APP_BASE_API 地址

上面开发环境配置地址 "/mess-boot" 是在 Vue.config.js 中 devServer 选项配置的接口代理，根据实际情况进行调整
```

### 编译分法包（仅需分发dist目录）
```
npm run build
```

## 注意 避免服务器打包压力，代码上传时添加了打包后的文件 dist/ 直接部署该目录即可

### 生产环境要求
* nginx
* 配置MIME使站点支持jpg|png|gif|woff|woff2的正常处理
* 如需https支持请配置SSL证书

nginx 配置参考
```
server {
  listen       80;
  server_name  localhost;

  # gzip config
  gzip on;
  gzip_min_length 1k;
  gzip_comp_level 9;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary on;
  gzip_disable "MSIE [1-6]\.";
  
  location / { //根目录配置
    root   /app;
    index  index.html;
    try_files $uri $uri/ /index.html; #解决前端Router(mode: 'history')模式下，刷新路由地址不能找到页面的问题
  }

  location /demo { // 子级目录
    alias  /front/demo;
    index  index.html;
    try_files $uri $uri/ /demo/index.html; 
  }
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}
```


## 开发指南

### 架构说明
* 本系统基于`VueJS`开发，使用`router、vuex、Ant Design Vue`作为核心组件库，为提升系统性能尽可能的使用了Vuex进行数据缓存和组件重用。

### 目录说明
* public：默认index.html索引文件及favicon
* src: 源文件目录

    * assets： 图片资源
    * api： api接口封装、全局配置等
    * components： 组件目录
    * config： 基础路由配置
    * router： 路由初始化
    * mixins： 混用代码
    * store:  vuex全局状态管理
    * utils： 工具包
    * views:  视图目录
    * main.js: 入口文件
    * permission.js: 路由权限控制
