---
title: 使用 Time Machine 将 Mac 数据备份到群晖 NAS
date: 2022-12-01
---

# 使用 Time Machine 将 Mac 数据备份到群晖 NAS

::: tip  我的环境
群晖 NAS 产品型号：DS1522+

群晖 NAS DSM 版本：DSM 7.1.1-42962 Update 2

Mac 型号：MacBook Pro 14-inch, 2021

Mac 系统：Ventura
:::

##  在群晖 NAS 上进行配置

### 创建名称为 **Time Machine** 共享文件夹(可以自定义)

1. 使用 **管理员** 帐户登录 DSM
2. 打开 控制面板-> 共享文件夹
3. 点击新增
4. 输入名称 例如 **Time Machine** 根据你的具体情况选择所在位置 (注：不要选择启动回收站和加密选项)

如图所示：

![创建共享文件夹|1104](https://i.yaoyao.site/blog/nas-share-create-timemachine.png)

5. 然后选择下一步
6. 最后一步的时候 需要为你的用户设置可读写权限 然后点击**应用**即可

如图所示：

![配置用户权限](https://i.yaoyao.site/blog/nas-share-timemachine-perm.png)

### 将共享文件夹设置为 Time Machine 的备份目标

1. 使用 **管理员** 帐户登录 DSM
2. 打开 控制面板-> 文件服务

#### 设置 SMB 服务

1. 打开 控制面板-> 文件服务-> SMB
2. 启用 SMB 服务（勾选）
3. 点击右下角**应用**即可

如图所示：

![开启 SMB 服务](https://i.yaoyao.site/blog/nas-smb-start.png)
#### 设置 AFP 服务

1. 打开 控制面板-> 文件服务-> AFP
2. 启用 AFP 服务（勾选）
3. 点击右下角**应用**即可

如图所示：

![开启 AFP 服务](https://i.yaoyao.site/blog/nas-afp-start.png)

#### 高级设置

1. 打开 控制面板-> 文件服务-> 高级设置
2. 启用 Bonjour 服务发现以查找 Synology NAS
3. 启用通过 SMB 进行 Bonjour Time Machine 推送 **或** 启用通过 AFP 进行  Bonjour Time Machine 推送
4. 单击**设置 Time Machine 文件夹**  按钮 选择你刚刚创建好的共享文件夹 然后点击保存&&应用

如图所示：

![配置 Bonjour](https://i.yaoyao.site/blog/nas-bonjour-start.png)

![设置 TM 文件夹](https://i.yaoyao.site/blog/nas-timemachine-set.png)

## 在 Mac 上进行配置

### 设置 Time Machine

1. 在 Mac 上 打开 系统设置

如图所示：
![打开系统应用|526](https://i.yaoyao.site/blog/mac-system-settings.png)

2. 选择通用 ->Time Machine

如图所示：

![打开TM|1000](https://i.yaoyao.site/blog/mac-timemachine-main.png)

3. 选择备份的硬盘

如图所示：

![](https://i.yaoyao.site/blog/mac-timemachine-set.png)
4. 然后根据 Time Machine 规则 即可开始备份

## 最后

建议使用 SMB 协议进行备份
