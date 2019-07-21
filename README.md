# koa2-nextjs开发github

## 介绍
koa2+nextjs开发github仓库

## 项目启动

### 1、克隆项目

```
git clone https://gitee.com/wuliaodexuanze/koa2nextjskaifa.git
```

### 2、安装插件

```
npm install
```

### 启动项目

1、开发模式

```
npm run dev
```

2、生产模式

```
npm start
```

## 服务端启动要求

### nginx配置

> 省略

### redis安装
1、更新源来安装最新的包

```
sudo yum install epel-release
suod yum update
```
2、安装 redis

```
sudo yum install redis
```

3、后台启动 redis

```
sudo systemctl start redis
```

4、开机启动 redis

```
sudo systemctl enable redis
```

## 说明

> 1、`ecosytem.config.js` 是pm2启动时的配置文件

> 2、`npm run analyze:browser` 打包文件结构展示，用于分析