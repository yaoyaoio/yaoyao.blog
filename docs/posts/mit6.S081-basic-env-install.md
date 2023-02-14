---
title: "MIT 6.S081/Fall 2020 搭建 risc-v 与 xv6 开发调试环境" # 博客标题（必须）
date: "2021-11-8"
---

# MIT 6.S081/Fall 2020 搭建 risc-v 与 xv6 开发调试环境

## 背景

2022-01-19日更新

1. 很多人用 M1 架构编译都出现了错误 然后我同样复现了错误并且找到了解决办法
2. 更详细的描述了不同的安装过程


课程链接：[https://pdos.csail.mit.edu/6.S081/2020/](https://pdos.csail.mit.edu/6.S081/2020/)

## 我的环境：

电脑型号：MacBook Pro (14-inch, 2021)

系统版本：macOS Monterey 12.1

我的笔记本是 arm64(M1芯片) 架构的，但此篇文章适用于 M1 及 Intel。

## 前提(必须安装)：

默认情况下需要安装 brew 后面很多地方都需要用到此工具

```bash
# 安装Brew 如果已经安装了可以下一步
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# 检查是否安装成功
brew -v
# 打印以下内容代表成功
Homebrew 3.3.11-21-gec389a6
Homebrew/homebrew-core (git revision 68defcb5dd3; last commit 2022-01-18)
Homebrew/homebrew-cask (git revision c6cfd6f92b; last commit 2022-01-18)
# 安装基本依赖环境
brew install python3 gawk gnu-sed gmp mpfr libmpc isl zlib expat gsed
brew tap discoteq/discoteq
brew install flock
# Qemu 需要依赖ninja
brew install ninja
```

### 关于 GCC / LLVM + CLANG（可选）

Mac 默认情况下预装的环境是 LLVM+CLANG 而不是 GCC 虽然有 GCC 的命令 但是其实是 CLANG

测试如下 执行 gcc -v:

```bash
gcc -v
Configured with: --prefix=/Library/Developer/CommandLineTools/usr --with-gxx-include-dir=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/c++/4.2.1
Apple clang version 13.0.0 (clang-1300.0.29.30)
Target: arm64-apple-darwin21.2.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

在编译 [riscv-gnu-toolchain](https://github.com/riscv-collab/riscv-gnu-toolchain)  工具链的时候，本机是 GCC 还是 LLVM+CLANG 都不会影响，我亲测都可以编译成功，所以这个地方可以保持默认，如果需要安装GCC 来替换 LLVM + CLANG 可以按照以下步骤操作: 

```bash
# 安装
brew install gcc
# 版本为gcc 11.2.0_3
# 设置环境变量: 
# 把以下内容添加到 ~/.zshrc 或者 ~/.bash_profile  或者 /etc/profile
# 因为我使用的是zsh 所以配置到 ~/.zshrc 里
vim ~/.zshrc
# 增加以下内容 
export GCCPATH=/opt/homebrew/Cellar/gcc/11.2.0_3/
export PATH=$PATH:${GCCPATH//://bin:}/bin
alias gcc='gcc-11'
alias cc='gcc-11'
alias g++='g++-11'
alias c++='c++-11'
# 使环境生效
source ~/.zshrc
# 测试
gcc -v
Using built-in specs.
COLLECT_GCC=gcc-11
COLLECT_LTO_WRAPPER=/opt/homebrew/Cellar/gcc/11.2.0_3/bin/../libexec/gcc/aarch64-apple-darwin21/11/lto-wrapper
Target: aarch64-apple-darwin21
....省略
Thread model: posix
Supported LTO compression algorithms: zlib zstd
gcc version 11.2.0 (Homebrew GCC 11.2.0_3)
```

## 安装 riscv-gnu-toolchain

**以下安装选一个即可 你怎么开心怎么选 我用的是 `2.源码编译安装`**

### 1. 使用 brew 进行安装（可选）

我用了这个步骤安装 会出现一些问题 所以此处需要看运气了。

```bash
brew tap riscv-software-src/riscv
brew install riscv-tools
```

### 2. 源码编译安装（可选）

**克隆源码**

```bash
git clone --recursive https://github.com/riscv/riscv-gnu-toolchain
```

我安装的版本

riscv-gnu-toolchain commit: **f640044a947afb39c78b96fa1ba1db8aa31b1d89** tag: **2022.01.17**

qemu commit: **553032db17440f8de011390e5a1cfddd13751b0b** tag: **v5.2.0**

riscv-binutils commit: **116a737f438d03a1bd6aa706b6ea0b4022f3b7e2(riscv-binutils-2.37)**

riscv-dejagnu commit: **4ea498a8e1fafeb568530d84db1880066478c86b(riscv-dejagnu-1.6)**

riscv-gcc commit: **ca312387ab141060c20c388d83d6fc4b2099af1d(riscv-gcc-10.2.0)**

riscv-gdb commit: **5da071ef0965b8054310d8dde9975037b0467311(fsf-gdb-10.1-with-sim)**

riscv-glibc commit: **9826b03b747b841f5fc6de2054bf1ef3f5c4bdf3** tag: **glibc-2.33**

riscv-newlib commit: **415fdd4279b85eeec9d54775ce13c5c412451e08** tag: **newlib-4.1.0**

源码很大 6.5G左右 所以克隆的时候会很慢 可以先克隆主仓库 分开克隆子仓库

```bash
git clone https://github.com/riscv/riscv-gnu-toolchain
cd riscv-gnu-toolchain
git submodule update --init --recursive
```

百度云中下载我这边上传好的 可以直接下载解压

地址：[源码包](https://pan.baidu.com/s/1iDNpV2_UTWk4OwZx0Bv2YA)   提取码：`nmvw`  包名： `riscv-gnu-toolchain-src-2022-01-17.tar.gz`

**编译安装** 

**(重要)注: 如果你的 Mac 是 arm 架构 M1 系列的芯片 需要改个配置**

修改如下:

```bash
# 进入目录
cd riscv-gnu-toolchain
# 注销配置
# 编辑文件 
vim riscv-gcc/gcc/config.host
# 注销96行 97行
96     #out_host_hook_obj=host-darwin.o
97     #host_xmake_file="${host_xmake_file} x-darwin"
```

编译 耗时较长 慢慢等待吧 目测要1小时左右

```bash
cd riscv-gnu-toolchain
./configure --prefix=/opt/riscv-gnu-toolchain --with-cmodel=medany --enable-multilib
# 因为安到opt目录下所以加了sudo 如果不安装在这个目录下 可以不使用sudo
sudo make
```

如果安装成功 则显示如下: 

![mit-make-gdb-install](https://i.yaoyao.site/blog/mit-make-gdb-install.png)

**配置环境变量**

```bash
# 把以下内容添加到 ~/.zshrc 或者 ~/.bash_profile  或者 /etc/profile
# 因为我使用的是zsh 所以配置到 ~/.zshrc 里
export RISCV_HOME=/opt/riscv-gnu-toolchain
export PATH=${PATH}:${RISCV_HOME}/bin
# 用 source 命令 让环境变量重新加载
source ~/.zshrc 
```

### 3. **直接使用预编译版本**（可选）

**下载**:

**`x86_64(intel)`**

地址：[源码包](https://pan.baidu.com/s/1iDNpV2_UTWk4OwZx0Bv2YA)   提取码：`nmvw`  包名： `riscv-gnu-toolchain-bin-2020.04.01-x86_64-apple-darwin.tar.gz`

**`aarm(m1)`**

地址：[源码包](https://pan.baidu.com/s/1iDNpV2_UTWk4OwZx0Bv2YA)   提取码：`nmvw`  包名： `riscv-gnu-toolchain-bin-2022.01.18-arm64-apple-darwin.tar.gz`

**解压**

```bash

tar xf {上面你下载的包名} -C /opt/
ls /opt/riscv-gnu-toolchain
drwxr-xr-x  33 root  wheel  1056 Jan 19 09:39 bin
drwxr-xr-x   3 root  wheel    96 Jan 19 09:39 include
drwxr-xr-x   8 root  wheel   256 Jan 19 09:39 lib
drwxr-xr-x   3 root  wheel    96 Jan 18 23:54 libexec
drwxr-xr-x   5 root  wheel   160 Jan 18 23:59 riscv64-unknown-elf
drwxr-xr-x   7 root  wheel   224 Jan 19 09:39 share
```

**配置环境变量**

```bash
# 把以下内容添加到 ~/.zshrc 或者 ~/.bash_profile  或者 /etc/profile
# 因为我使用的是zsh 所以配置到 ~/.zshrc 里
export RISCV_HOME=/opt/riscv-gnu-toolchain
export PATH=${PATH}:${RISCV_HOME}/bin
# 用 source 命令 让环境变量重新加载
source ~/.zshrc 
```

### 4. **验证是否安装成功**

```bash
//执行
riscv64-unknown-elf-gcc -v
// 如打印以下内容代表安装成功
riscv64-unknown-elf-gcc -v
Using built-in specs.
COLLECT_GCC=riscv64-unknown-elf-gcc
COLLECT_LTO_WRAPPER=/opt/riscv-gnu-toolchain/libexec/gcc/riscv64-unknown-elf/11.1.0/lto-wrapper
Target: riscv64-unknown-elf
Thread model: single
Supported LTO compression algorithms: zlib
gcc version 11.1.0 (GCC)

```

## 安装 Qemu

qemu 是强大的虚拟机操作系统模拟器，在此课程中，我们使用 qemu 来模拟硬件 ，使 xv6 运行在该模拟器之上。

我安装的 qemu 版本为 `6.2.0`

**以下安装选一个即可 你怎么开心怎么选 我用的是 `1.使用 brew 安装`

### 1. 使用 brew 安装（可选）

```bash
// 本人就使用了这种方式进行安装
brew install qemu
```

### 2. 使用源码安装（可选）

**下载源码并编译安装**

```bash
wget https://download.qemu.org/qemu-6.2.0.tar.xz
tar xf qemu-6.2.0.tar.xz
cd qemu-6.2.0
./configure --prefix=/opt/qemu
make 
make install
```

**配置环境变量**

```bash
# 把以下内容添加到 ~/.zshrc 或者 ~/.bash_profile  或者 /etc/profile
# 因为我使用的是zsh 所以配置到 ~/.zshrc 里
export QEMU_HOME=/opt/qemu
export PATH=${PATH}:${QEMU_HOME}/bin
# 用 source 命令 让环境变量重新加载
source ~/.zshrc 
```

### 3. 验证是否安装成功

```bash
// 执行 如果打印以下内容代表安装成功
qemu-system-riscv64 --version
QEMU emulator version 6.1.0
Copyright (c) 2003-2021 Fabrice Bellard and the QEMU Project developers
```

## 编译及运行 xv6

**克隆**

```bash
git clone https://github.com/mit-pdos/xv6-riscv.git
```

**编译**

```bash
cd xv6-riscv
make

```

**使用 qemu 运行**

```bash
make qemu
```

显示如下代表运行成功

![mit-make-qemu](https://i.yaoyao.site/blog/mit-make-qemu.png)

## 使用 qemu-gdb 对 xv6进行调试

需要2个窗口(终端)

### 窗口1

```bash
cd xv6-riscv
make CPUS=1 qemu-gdb
```

显示如下 这样代表启动成功 qemu-gdb

![mit-make-qemu-gdb](https://i.yaoyao.site/blog/mit-make-qemu-gdb.png)

### 窗口2

```bash
cd xv6-riscv
riscv64-unknown-elf-gdb
```

显示如下 这样代表成功

![mit-riscv-gdb](https://i.yaoyao.site/blog/mit-riscv-gdb.png)

注: `xv6-riscv` 目录下有 `.gdbinit` 配置 有的情况下 `riscv64-unknown-elf-gdb` 会自动加载 如果没有自动加载则需要你手动 `source .gdbinit` 当打印 `0x0000000000001000 in ?? ()` 代表可以调试。

## **FAQ**:

1. ld: symbol(s) not found for architecture arm64
    
    如果出现此问题 一般都是 arm架构 导致的
    
    **官方 issues 反馈的问题：[https://github.com/riscv-software-src/homebrew-riscv/issues/47](https://github.com/riscv-software-src/homebrew-riscv/issues/47)**
    
    解决办法:
    
    ```bash
    # 进入目录
    cd riscv-gnu-toolchain
    # 注销配置
    # 编辑文件 
    vim riscv-gcc/gcc/config.host
    # 注销96行 97行
    96     #out_host_hook_obj=host-darwin.o
    97     #host_xmake_file="${host_xmake_file} x-darwin"
    ```

2.  如果出现此问题 是gdb没有正常加载

    ```bash
    Copyright (C) 2020 Free Software Foundation, Inc.
    License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
    This is free software: you are free to change and redistribute it.
    There is NO WARRANTY, to the extent permitted by law.
    Type "show copying" and "show warranty" for details.
    This GDB was configured as "--host=arm-apple-darwin21.2.0 --target=riscv64-unknown-elf".
    Type "show configuration" for configuration details.
    For bug reporting instructions, please see:
    <https://www.gnu.org/software/gdb/bugs/>.
    Find the GDB manual and other documentation resources online at:
        <http://www.gnu.org/software/gdb/documentation/>.
    
    For help, type "help".
    Type "apropos word" to search for commands related to "word".
    warning: File "/.../xv6-riscv/.gdbinit" auto-loading has been declined by your `auto-load safe-path' set to "$debugdir:$datadir/auto-load".
    To enable execution of this file add
    	add-auto-load-safe-path /.../Documents/code/os/xv6-riscv/.gdbinit
    line to your configuration file "/Users/.../.gdbinit".
    To completely disable this security protection add
    	set auto-load safe-path /
    line to your configuration file "/Users/.../.gdbinit".
    For more information about this security protection see the
    "Auto-loading safe path" section in the GDB manual.  E.g., run from the shell:
    	info "(gdb)Auto-loading safe path"
    (gdb)
    ```

    解决办法:
    
    `xv6-riscv` 目录下有 `.gdbinit` 配置 有的情况下 `riscv64-unknown-elf-gdb` 会自动加载 如果没有自动加载则需要你手动 `source .gdbinit` 当打印 `0x0000000000001000 in ?? ()` 代表可以调试。

## 参考资料:

1. [https://rcore-os.github.io/rCore-Tutorial-Book-v3/chapter0/5setup-devel-env.html#qemu](https://rcore-os.github.io/rCore-Tutorial-Book-v3/chapter0/5setup-devel-env.html#qemu)
2. https://github.com/riscv-software-src/homebrew-riscv
3. https://github.com/riscv-software-src/homebrew-riscv/issues/47
4. https://github.com/riscv-collab/riscv-gnu-toolchain
5. [https://zhayujie.com/mit6828-env.html](https://zhayujie.com/mit6828-env.html)
