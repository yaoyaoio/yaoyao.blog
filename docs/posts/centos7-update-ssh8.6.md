---
title: Centos7 解决 OpenSSH 漏洞升级方案
date: 2021-08-01
---
# Centos7 解决 OpenSSH 漏洞升级方案

## 背景

1. 通过绿盟安全扫描 Centos7 操作系统，均检测到 OpenSSH 不同程度的中、高风险漏洞；
2. 鉴于官网没有为 Centos7 提供更新 `openssh` 相关的 RPM 安装包；为提高 Centos7 操作系统的安全性，将 Centos7 中的 `OpenSSH` 统一编译升级到指定版本：`OpenSSH 8.6p1`，以此来修复 `OpenSSH` 安全漏洞
3. 因涉及漏洞的生产环境不能上网，只有内网环境，所以需要在单独一台服务器上进行制作 `OpenSSH 8.6p1` RPM 安装包，再把此安装包放到生产服务器上进行安装。另外一个方案就是下载 `OpenSSH 8.6p1` 所需要的依赖包然后在生产环境进行操作，此方案比较麻烦 暂时不考虑使用。

## 我的环境

操作系统：CentOS Linux release 7.8.2003 (Core)

## 开始

**下载** openssh **源码包**

```bash
wget https://openbsd.hk/pub/OpenBSD/OpenSSH/portable/openssh-8.6p1.tar.gz
wget https://src.fedoraproject.org/repo/pkgs/openssh/x11-ssh-askpass-1.2.4.1.tar.gz/8f2e41f3f7eaa8543a2440454637f3c3/x11-ssh-askpass-1.2.4.1.tar.gz
```

**安装 RPM 编译工具及相关依赖包**

```bash
yum install -y rpm-build zlib-devel openssl-devel gcc perl-devel pam-devel
```

**创建 RPM 编译环境**

```bash
cd /root/
mkdir -p rpmbuild/{SOURCES,SPECS,RPMS,SRPMS,BUILD,BUILDROOT}
```

**将** openssh **依赖文件复制到对应环境中**

```bash
// 源码包
cp /root/openssh-8.6p1.tar.gz /root/rpmbuild/SOURCES/
cp /root/x11-ssh-askpass-1.2.4.1.tar.gz /root/rpmbuild/SOURCES/
tar -zxf /root/openssh-8.6p1.tar.gz -C /opt/
// 依赖文件
cp /opt/openssh-8.6p1/contrib/redhat/openssh.spec /root/rpmbuild/SPECS/
// 授权
chown sshd:sshd /root/rpmbuild/SPECS/openssh.spec
```

**定制** `/etc/pam.d/sshd`  **文件**

因为如果使用 openssh 提供的 sshd 会有可能导致安装后登陆不上的问题，所以还继续使用当前的 sshd 文件。

```bash
vim /root/rpmbuild/SOURCES/sshd

# 将以下内容保存到该文件中

#%PAM-1.0
auth       required     pam_sepermit.so
auth       substack     password-auth
auth       include      postlogin
# Used with polkit to reauthorize users in remote sessions
-auth      optional     pam_reauthorize.so prepare
account    required     pam_nologin.so
account    include      password-auth
password   include      password-auth
# pam_selinux.so close should be the first session rule
session    required     pam_selinux.so close
session    required     pam_loginuid.so
# pam_selinux.so open should only be followed by sessions to be executed in the user context
session    required     pam_selinux.so open env_params
session    required     pam_namespace.so
session    optional     pam_keyinit.so force revoke
session    include      password-auth
session    include      postlogin
# Used with polkit to reauthorize users in remote sessions
-session   optional     pam_reauthorize.so prepare
```

**修改** `openssh.spec` **配置**

```bash
cd /root/rpmbuild/SPECS/

vim openssh.spec

# 找到如下这行 并注销该行 要不在检测的时候会报错
#BuildRequires: openssl-devel < 1.1

# 找到如下这行 并将0改为1

# Do we want to disable building of x11-askpass? (1=yes 0=no)
%global no_x11_askpass 1

# 找到如下这行 并将0改为1

# Do we want to disable building of gnome-askpass? (1=yes 0=no)
%global no_gnome_askpass 1

# 找到如下这行 原配置：
install -m644 contrib/redhat/sshd.pam     $RPM_BUILD_ROOT/etc/pam.d/sshd
# 修改如下：原因是使用自已定制的 sshd 文件
install -m644 $RPM_SOURCE_DIR/sshd $RPM_BUILD_ROOT/etc/pam.d/sshd

# 注 以下操作都是修改配置文件 将命令放进去 并非执行这些命令 这些命令在安装ssh的时候 会根据spec文件进行执行

# 搜索 %pre server
# 在 %pre server 下新增配置 表示安装前执行的操作
# 配置如下：备份当前ssh文件
cp -r /etc/ssh /etc/ssh_bak

# 搜索 %post server
# 在 %post server 下新增配置，表示安装后需要执行的命令
    
# 允许root登录；升级为8.6后默认为不允许root登录
sed -i -e  "s/#PermitRootLogin prohibit-password/PermitRootLogin yes/g"    /etc/ssh/sshd_config
# 允许使用PAM登录认证
sed -i  -e  "s/#UsePAM no/UsePAM yes/g"  /etc/ssh/sshd_config
# 允许使用X11Forwarding图形模块
sed -i -e "s/#X11Forwarding no/X11Forwarding yes/g" /etc/ssh/sshd_config
# 增加认证支持（默认openssh 8.6，默认不支持部分低版本的认证模式），不添加会造成低版本的连接器如：CRT等，客户端连接失败
echo "KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha1" >>/etc/ssh/sshd_config
# 给/etc/init.d/sshd 执行权限
chmod +x /etc/init.d/sshd
# 三个文件 ssh_host_rsa_key、ssh_host_ecdsa_key、ssh_host_ed25519_key 8.6版本缩小了权限，只允许root查看，否者启动sshd服务会报错
chmod 600 /etc/ssh/ssh_host_rsa_key
chmod 600 /etc/ssh/ssh_host_ecdsa_key
chmod 600 /etc/ssh/ssh_host_ed25519_key
```

**编译**

```bash
cd /root/rpmbuild/SPECS/
rpmbuild -ba openssh.spec
```

**查看生成的 RPM 及进行打包**

```bash
cd /root/rpmbuild/RPMS/x86_64/
ls /root/rpmbuild/RPMS/x86_64/
openssh-8.6p1-1.el7.x86_64.rpm          openssh-debuginfo-8.6p1-1.el7.x86_64.rpm
openssh-clients-8.6p1-1.el7.x86_64.rpm  openssh-server-8.6p1-1.el7.x86_64.rpm
// 打包
tar -zcvf openssh-8.6p1_rpm_package.tar.gz *.rpm
```

## 验证

**验证 RPM ( scp 到其他服务器进行测试)**

```bash
ls /root/openssh-8.6p1_rpm_package.tar.gz
tar xf openssh-8.6p1_rpm_package.tar.gz
```

（可选）**保存现有 SSH 配置及相关命令**

```bash
# 配置备份
mkdir /root/ssh_bak_`date +"%Y-%m-%d"`
cp -r /etc/ssh/* /root/ssh_bak_`date +"%Y-%m-%d"`
cp /etc/pam.d/sshd /root/ssh_bak_`date +"%Y-%m-%d"`
# 命令备份
mkdir /root/ssh_bak_`date +"%Y-%m-%d"`/bin/
cp /bin/ssh* /root/ssh_bak_`date +"%Y-%m-%d"`/bin/
cp /usr/sbin/sshd /root/ssh_bak_`date +"%Y-%m-%d"`/bin/
```

**安装 RPM**

```bash
rpm -Uivh openssh-*rpm
```

**查看安装版本**

```bash
查看版本
ssh -V
OpenSSH_8.6p1, OpenSSL 1.0.2k-fips  26 Jan 2017
查看安装情况
rpm -qa |grep openssh
openssh-8.6p1-1.el7.x86_64
openssh-server-8.6p1-1.el7.x86_64
openssh-askpass-8.6p1-1.el7.x86_64
openssh-clients-8.6p1-1.el7.x86_64
```

（可选）**恢复配置**

```bash
cp /root/ssh_bak_`date +"%Y-%m-%d"`/sshd /etc/pam.d/
cp /root/ssh_bak_`date +"%Y-%m-%d"`/sshd_config /etc/ssh/
cat /etc/ssh/sshd_config | grep PermitRootLogin
rm -rf /etc/ssh/ssh_host*key
```

**重启 sshd 服务**

```bash
systemctl restart sshd
```

## 常见问题

**root 用户无法登录**

```bash
cat /etc/ssh/sshd_config | grep PermitRootLogin
正常: PermitRootLogin yes
其他均为不正常 需要改为正常
```

**pam 报错 需要恢复旧 pam 配置文件**

```bash
cp /root/ssh_bak_`date +"%Y-%m-%d"`/sshd /etc/pam.d/
```

**以下配置在/etc/ssh/sshd_config 下必须存在**

```bash
UseDNS no
AddressFamily inet
SyslogFacility AUTHPRIV
PermitRootLogin yes
GSSAPIAuthentication yes
PasswordAuthentication yes
KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha1
```
