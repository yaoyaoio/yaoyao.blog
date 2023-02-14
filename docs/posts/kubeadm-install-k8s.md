---
title: 使用 kubeadm 在 ubuntu20.04 部署 kubernetes 集群
date: 2022-05-26
---

# 使用 kubeadm 在 ubuntu20.04 部署 kubernetes 集群

## 我的环境

4 台主机如下:

```bash
cat /etc/hosts |grep home
10.211.55.9  home-01 # master
10.211.55.5  home-02 # node
10.211.55.11 home-03 # node
10.211.55.12 home-04 # node
```

操作系统版本:

```bash
# uname -a
Linux home-01 5.13.0-25-generic #26~20.04.1-Ubuntu SMP Sat Jan 8 18:05:46 UTC 2022 aarch64 aarch64 aarch64 GNU/Linux
# cat /etc/os-release
NAME="Ubuntu"
VERSION="20.04.3 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.3 LTS"
VERSION_ID="20.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal
```

## 基础操作

**注 (所有机器都需要执行)**

**修改主机名并把主机信息加到 /etc/hosts 文件中**

```bash
# hostnamectl set-hostname {主机名}
```

**关闭 swap**

```bash
# sudo swapoff -a
```

**加载内核模块**

```bash
# modprobe br_netfilter
```

**修改内核参数 创建文件添加内容**

```bash
# cat << EOF > /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
user.max_user_namespaces=28633
EOF
```

**执行以下命令使配置生效:**

```bash
# sysctl -p /etc/sysctl.d/99-kubernetes-cri.conf
```

**修改 DNS 禁用 systemd-resolved.service**

此处手动管理 /etc/resolv.conf

```bash

```

```bash
# systemctl disable --now systemd-resolved.service
# cat /etc/resolv.conf
nameserver 114.114.114.114
nameserver 8.8.8.8
```

**安装 kubernetes 这里使用阿里云提供的源**

```bash
# apt-get update && apt install vim curl -y
apt-get update && apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
```

**安装容器运行时 Containerd 这里使用阿里云提供的源**

```bash
# // 添加相关源 我在Macbook上使用PD搞的虚拟机 这地方需要改为对应架构的 arch=arm64
# **sudo add-apt-repository "deb [arch=arm64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
# // 卸载 docker
#** sudo apt-get remove docker-ce docker.io docker
# // 安装 containerd
# sudo apt install containerd.io
```

**生成 Containerd 所需要的配置文件**

```bash
# mkdir -p /etc/containerd
# containerd config default > /etc/containerd/config.toml
```

**使用 systemd 作为容器的 cgroup driver**

```bash
# vim /etc/containerd/config.toml
# SystemdCgroup = true
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

配置 **Containerd** 开机启动，并启动 **Containerd**

```bash
systemctl enable containerd --now
```

## 使用 kubelet 初始化集群

### 在 master 上执行

```bash
sudo kubeadm init --pod-network-cidr 172.16.0.0/16  \
--apiserver-advertise-address=10.211.55.9 \
--image-repository registry.cn-hangzhou.aliyuncs.com/google_containers \
--cri-socket /run/containerd/containerd.sock
```

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

初始化成功后会生成节点加入集群的命令 在其他节点上执行该命令

****在 node 上执行****

```bash
kubeadm join 10.211.55.9:6443 --token mldghy.xtf4a0u9bw8ltsvu --discovery-token-ca-cert-hash sha256:2b0f87c543d77e0b8f843db47c95985febe17a19de747b064720097db9b9535c
```

## **部署 Flannel 组件 (Vxlan 模式)**

在 master 上执行

下载配置文件

```bash
# wget https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```

修改配置文件 只修改 Network 和 Backend Type

```bash
data:
  cni-conf.json: |
    {
      "name": "cbr0",
      "cniVersion": "0.3.1",
      "plugins": [
        {
          "type": "flannel",
          "delegate": {
            "hairpinMode": true,
            "isDefaultGateway": true
          }
        },
        {
          "type": "portmap",
          "capabilities": {
            "portMappings": true
          }
        }
      ]
    }
  net-conf.json: |
    {
      "Network": "172.16.0.0/16",
      "Backend": {
        "Type": "vxlan"
      }
    }
---
```

执行

```bash
# kubectl apply -f kube-flannel.yaml
```

## 查看集群状态

```bash
# kubectl get nodes -o wide
NAME      STATUS   ROLES           AGE    VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
home-01   Ready    control-plane   15d    v1.24.0   10.211.55.9    <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
home-02   Ready    <none>          15d    v1.24.0   10.211.55.5    <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
home-03   Ready    <none>          15d    v1.24.0   10.211.55.11   <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
home-04   Ready    <none>          5d6h   v1.24.0   10.211.55.12   <none>        Ubuntu 20.04.3 LTS   5.13.0-25-generic   containerd://1.6.4
```

## 注:

可以在每台机器上让 kubelet 开机启动

```bash
systemctl enable kubelet.service
```

涉及 DNS 问题可以考虑关掉 DNS 管理服务

参考 [https://icloudnative.io/posts/resolvconf-tutorial/](https://icloudnative.io/posts/resolvconf-tutorial/)
