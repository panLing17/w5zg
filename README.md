# 万物直供WEB端

## 初始化

- 安装依赖

  `npm install`

- 启动本地服务默认打开`http//localhost:8088`

  `npm run dev`

- 打包到dist

  `npm run build`

- 打包到dist，然后显示打包分析

   `npm run report`

## 目录结构说明


```bash

├── build                      // 构建相关 
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 一些初始化的css/js文件，img/fonts文件
│   ├── components             // 公用组件
│   ├── directives             // 公用指令
│   ├── mixins                 // mixin
│   ├── filters                // 全局filter
│   ├── routers                // 路由
│   ├── store                  // 全局store管理
│   ├── utils                  // 全局公用方法
│   ├── views                  // view，所有页面模板
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方资源
├── .babelrc                   // babel-loader 配置
├── .editorconfig              // IDE 配置项
├── .eslintignore              // eslint 忽略项
├── .eslintrc.js               // eslint 配置项
├── .gitignore                 // git 忽略项
├── .postcssrc.js              // postcss 配置项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

# build 生成目录

├── dist                        // 源代码
│   ├── css                     // 样式文件
│   ├── fonts                   // 字体文件
│   └── js                      // 脚本文件
├── favicon.ico                 // favicon.ico
└── index.html                  // index.html


```

### 技术栈

> 以下库、框架推荐使用最新版

- Vue.js

- vue-router

- vuex

- Element UI

- axios.js  http请求

- HTML模板，推荐使用 Pug

- JavaScript, 推荐使用 ES2015及以上

