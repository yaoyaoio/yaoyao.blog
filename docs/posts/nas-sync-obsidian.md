---
title: 使用 Remotely Save 和 WebDAV Server 将 Obsidian 数据同步到群晖 NAS
date: 2022-12-01
---
# 使用 Remotely Save 和 WebDAV Server 将 Obsidian 数据同步到群晖 NAS

::: tip  我的环境

群晖 NAS 产品型号：DS1522+

群晖 NAS DSM 版本：DSM 7.1.1-42962 Update 2

Mac 型号：MacBook Pro 14-inch, 2021

Mac 系统：Ventura

Obsidian： Version 1.0.3 (Installer 1.0.0)
:::

## 在群晖 NAS 开启 WebDAV Server

###  安装 WebDAV Server

1. 使用 **管理员** 帐户登录 DSM
2. 打开 **套件中心**
3. 搜索 **WebDAV Server** 并安装

如图所示：

![安装 WebDAV|968](https://i.yaoyao.site/blog/nas-install-webdav.png)

###  配置 WebDAV Server

1. 进入菜单 打开 **WebDAV Server**

如图所示：

![打开 WebDAV|868](https://i.yaoyao.site/blog/nas-open-webdav.png)

2. 修改配置并应用

**如果什么都不改可以直接点击应用 这个地方我修改了端口**

![应用 WebDAV|1076](https://i.yaoyao.site/blog/nas-apply-webdav.png)

### 创建共享目录

控制面板--> 共享文件夹--> 新增--> obsidian

如图所示：
![创建共享目录|1067](https://i.yaoyao.site/blog/nas-share-create-obs.png)

## 在 Obsidian 上安装 Remotely Save

1. 打开 Obsidian
2. 在社区插件市场里搜索 Remotely Save 并安装

如图所示：

![安装|1200](https://i.yaoyao.site/blog/obs-plugin-remotely-install.png)

## 在 Obsidian 上配置 Remotely Save

如图所示：

![配置|1200](https://i.yaoyao.site/blog/obs-plugin-remotely-set.png)

###  配置如下：

选择远程服务：webdav

服务器地址：`http://{你的地址}:{你的端口}/{你共享的文件夹}`

用户名：`{你的用户名}`

密码：`{你的密码}`

## 最后

等一段时间在 DSM 中就能看到已经被同步过来的数据。
