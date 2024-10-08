---
layout: post
title:  "Compose DSL"
crawlertitle: "Compose DSL"
subtitle: "docker compose dsl"
ext: ""
date:  2022-12-08
header-style: img
header-img: img/in-post/common-bg.jpg
hidden: false
published: true
header-mask: 0.3
tags: ['SERVER', '原创']
musicUri: 1955571906
musicTitle: Italia e voi（Reset）
musicFrom: Pnan
author: gomyck
openPay: true
---

# 参考示例

```yaml
# 指定 compose 文件的版本
version: "3.1"
  services: # 定义所有的 service 信息, services 下面的第一级别的 key 既是一个 service 的名称
    gomyck:
      # 指定包含构建上下文的路径, 或作为一个对象，该对象具有 context 和指定的 dockerfile 文件以及 args 参数值
      build: ./gomyck     # context: ./gomyck # context: 指定 Dockerfile 文件所在的路径(可以不写)
        context: ./gomyck # context: 指定 Dockerfile 文件所在的路径
        dockerfile: xxx   # dockerfile: 指定 context 指定的目录下面的 Dockerfile 的名称(默认为 Dockerfile)
        args:             # args: Dockerfile 在 build 过程中需要的参数 (等同于 docker container build --build-arg 的作用)
          xxx: 123
        cache_from: xxx   # v3.2中新增的参数, 指定缓存的镜像列表 (等同于 docker container build --cache_from 的作用)
        labels:           # v3.3中新增的参数, 设置镜像的元数据 (等同于 docker container build --labels 的作用)
          - xxx: 123
        shm_size: xxx     # v3.5中新增的参数, 设置容器 /dev/shm 分区的大小 (等同于 docker container build --shm-size 的作用)
      command: echo 123   # 覆盖容器启动后默认执行的命令, 支持 shell 格式和 [] 格式
      container_name: xxx # 指定容器的名称 (等同于 docker run --name 的作用)
      restart: no|always|on-failure|unless-stopped               # 定义容器重启策略(在使用 swarm 部署时将忽略该选项, 在 swarm 使用 restart_policy 代替 restart)
      domainname: example.com
      working_dir: /app
      hostname: my-hostname # 定义容器的主机名
      privileged: true      # 定义容器启动时是否以特权模式运行
      read_only: true       # 定义容器内部应用程序只读 (等同于 docker run --read-only 的作用)
      shm_size: 64M         # 设置容器 /dev/shm 分区的大小
      tty: true             # 定义容器启动时是否以终端模式运行
      stdin_open: true      # 定义容器启动时是否打开 stdin (等同于 docker run --interactive 的作用)
      user: 1001:1001
      depends_on:           # 定义容器启动顺序 (此选项解决了容器之间的依赖关系， 此选项在 v3 版本中 使用 swarm 部署时将忽略该选项)
        - db
        - redis
      dns:                  # 设置 DNS 地址(等同于 docker run --dns 的作用)
        - 8.8.8.8
        - 114.114.114.114
      dns_search:           # 设置 DNS 搜索域(等同于 docker run --dns-search 的作用)
        - dc1.example.com
        - dc2.example.com
      volumes:              # 定义容器和宿主机的卷映射关系, 其和 networks 一样可以位于 services 键的二级键和 compose 顶级键, 如果需要跨服务间使用则在顶级键定义, 在 services 中引用
        - /var/lib/mysql              # 映射容器内的 /var/lib/mysql 到宿主机的一个随机目录中
        - /opt/data:/var/lib/mysql    # 映射容器内的 /var/lib/mysql 到宿主机的 /opt/data
        - ./cache:/tmp/cache          # 映射容器内的 /var/lib/mysql 到宿主机 compose 文件所在的位置
        - ~/configs:/etc/configs/:ro  # 映射容器宿主机的目录到容器中去, 权限只读
        - datavolume:/var/lib/mysql   # datavolume 为 volumes 顶级键定义的目录, 在此处直接调用

        - type: volume                # mount 的类型, 必须是 bind、volume 或 tmpfs
            source: mydata            # 宿主机目录
            target: /data             # 容器目录
            volume:                   # 配置额外的选项, 其 key 必须和 type 的值相同
              nocopy: true            # volume 额外的选项, 在创建卷时禁用从容器复制数据
        - type: bind                  # volume 模式只指定容器路径即可, 宿主机路径随机生成; bind 需要指定容器和数据机的映射路径
            source: ./static
            target: /opt/app/static
            read_only: true           # 设置文件系统为只读文件系统
      entrypoint: /code/entrypoint.sh # 覆盖容器的默认 entrypoint 指令 (等同于 docker run --entrypoint 的作用)
      env_file: # 从指定文件中读取变量设置为容器中的环境变量, 可以是单个值或者一个文件列表, 如果多个文件中的变量重名则后面的变量覆盖前面的变量, environment 的值覆盖 env_file 的值
        - ./common.env
        - ./apps/web.env
        - /opt/runtime_opts.env
      environment: # 设置环境变量， environment 的值可以覆盖 env_file 的值 (等同于 docker run --env 的作用)
        - xxx=true
        - rrr=123
      expose: # 暴露端口, 但是不能和宿主机建立映射关系, 类似于 Dockerfile 的 EXPOSE 指令
        - "80:80"
      extra_hosts: # 添加 host 记录到容器中的 /etc/hosts 中 (等同于 docker run --add-host 的作用)
        - "somehost:162.242.195.82"
        - "otherhost:50.31.209.229"
      healthcheck:  # v2.1 以上版本, 定义容器健康状态检查, 类似于 Dockerfile 的 HEALTHCHECK 指令
        test: ["CMD", "curl", "-f", "http://localhost"]
        interval: 1m30s
        timeout: 10s
        retries: 3
        start_period: 40s
      image: xxx/xxx      # 指定 docker 镜像, 可以是远程仓库镜像、本地镜像
      init: true          # v3.7 中新增的参数, true 或 false 表示是否在容器中运行一个 init, 它接收信号并传递给进程
      isolation: default  # 隔离容器技术, 在 Linux 中仅支持 default 值,  在 Windows 上，可接受的值为default、process和hyperv。
      labels:             # 使用 Docker 标签将元数据添加到容器, 与 Dockerfile 中的 LABELS 类似
        - "com.example.description=Accounting webapp"
        - "com.example.department=Finance"
        - "com.example.label-with-empty-value"
      links:  # 链接到其它服务中的容器, 该选项是 docker 历史遗留的选项, 目前已被用户自定义网络名称空间取代, 最终有可能被废弃 (在使用 swarm 部署时将忽略该选项)
        - redis_1
        # 为 db service 在本 service 里指定别名
        - db:database
      external_links: # 连接不在 docker-compose.yml 中定义的容器或者不在 compose 管理的容器(docker run 启动的容器, 在 v3 版本中使用 swarm 部署时将忽略该选项)
        - redis_1
        - project_db_1:mysql
        - project_db_1:postgresql
      logging:
        driver: json-file
        options:
          max-size: "300M"
          max-file: "3"
      #network_mode: "bridge"
      #network_mode: "host"
      #network_mode: "none"
      #network_mode: "service:[service name]"
      #network_mode: "container:[container name/id]"
      network_mode: bridge          # 指定网络模式 (等同于 docker run --net 的作用, 在使用 swarm 部署时将忽略该选项)
      networks:                     # 将容器加入指定网络 (等同于 docker network connect 的作用), networks 可以位于 compose 文件顶级键和 services 键的二级键
        gomyck:
          aliases:                  # 同一网络上的容器可以使用服务名称或别名连接到其中一个服务的容器
            - xxx
          ipv4_address: 172.111.111.111         # IP V4 格式
          ipv6_address: 2001:3984:3989::10      # IP V6 格式
      pid: 'host'                           # 共享宿主机的 进程空间(PID)
      ports:                                # 建立宿主机和容器之间的端口映射关系, ports 支持两种语法格式
        - "3000"                            # 暴露容器的 3000 端口, 宿主机的端口由 docker 随机映射一个没有被占用的端口
        - "3000-3005"                       # 暴露容器的 3000 到 3005 端口, 宿主机的端口由 docker 随机映射没有被占用的端口
        - "8000:8000"                       # 容器的 8000 端口和宿主机的 8000 端口建立映射关系
        - "9090-9091:8080-8081"
        - "127.0.0.1:8001:8001"             # 指定映射宿主机的指定地址的
        - "127.0.0.1:5000-5010:5000-5010"
        - "6060:6060/udp"                   # 指定协议
        - target: 80                        # 容器端口
          published: 8080                   # 宿主机端口
          protocol: tcp                     # 协议类型
          mode: host                        # host 在每个节点上发布主机端口,  ingress 对于群模式端口进行负载均衡

      ###############不常用的参数###############
      ###############不常用的参数###############
      ###############不常用的参数###############
      ###############不常用的参数###############

      secrets:               # 为每个服务机密授予相应的访问权限
        - my_secret
        - my_other_secret
      security_opt:          # 为每个容器覆盖默认的标签 (在使用 swarm 部署时将忽略该选项)
        - label:user:USER
        - label:role:ROLE
      stop_grace_period: 1s  # 指定在发送了 SIGTERM 信号之后, 容器等待多少秒之后退出(默认 10s)
      stop_signal: SIGUSR1   # 指定停止容器发送的信号 (默认为 SIGTERM 相当于 kill PID; SIGKILL 相当于 kill -9 PID; 在使用 swarm 部署时将忽略该选项)
      sysctls:               # 设置容器中的内核参数 (在使用 swarm 部署时将忽略该选项)
        net.core.somaxconn: 1024
        net.ipv4.tcp_syncookies: 0
      ulimits:               # 设置容器的 limit
        nproc: 65535
        nofile:
          soft: 20000
          hard: 40000
      userns_mode: "host"    # 如果Docker守护程序配置了用户名称空间, 则禁用此服务的用户名称空间 (在使用 swarm 部署时将忽略该选项)
      tmpfs:                 # v2 版本以上, 挂载目录到容器中, 作为容器的临时文件系统(等同于 docker run --tmpfs 的作用, 在使用 swarm 部署时将忽略该选项)
        - /run
        - /tmp
      devices:               #设备映射列表。使用与--devicedocker 客户端创建选项格式相同。
        - "/dev/ttyUSB0:/dev/ttyUSB0"
      cgroup_parent: m-executor-abcd # 为容器指定父 cgroup 组，意味着将继承该组的资源限制。
      credential_spec: xx            # 为托管服务帐户配置凭据规范。此选项仅用于使用 Windows 容器的服务。在credential_spec上的配置列表格式为file://<filename>或registry://<value-name>
      # v3 版本以上, 指定与部署和运行服务相关的配置, deploy 部分是 docker stack 使用的, docker stack 依赖 docker swarm
      deploy:
        # v3.3 版本中新增的功能, 指定服务暴露的方式
        # Docker 为该服务分配了一个虚拟 IP(VIP), 作为客户端的访问服务的地址
        # DNS轮询, Docker 为该服务设置 DNS 条目, 使得服务名称的 DNS 查询返回一个 IP 地址列表, 客户端直接访问其中的一个地址
        endpoint_mode: vip|dnsrr
        labels: xxx  # 指定服务的标签，这些标签仅在服务上设置
        # 指定 deploy 的模式
        # 每个集群节点都只有一个容器
        # 用户可以指定集群中容器的数量(默认)
        mode: global|replicated
        # 指定约束和首选项的位置
        placement:
          constraints:
            - "node.role==manager"
            - "engine.labels.operatingsystem==ubuntu 18.04"
        replicas: 1              # deploy 的 mode 为 replicated 时, 指定容器副本的数量
        resources:             # 资源限制
          limits:                # 设置容器的资源限制
            cpus: "0.5"           # 设置该容器最多只能使用 50% 的 CPU
            memory: 50M           # 设置该容器最多只能使用 50M 的内存空间
          reservations:          # 设置为容器预留的系统资源(随时可用)
            cpus: "0.2"           # 为该容器保留 20% 的 CPU
            memory: 20M           # 为该容器保留 20M 的内存空间
        # 定义容器重启策略, 用于代替 restart 参数
        restart_policy:
          # 定义容器重启策略(接受三个参数) 不尝试重启|只有当容器内部应用程序出现问题才会重启|无论如何都会尝试重启(默认)
          condition: none|on-failure|any
          delay: 5                  # 尝试重启的间隔时间(默认为 0s)
          max_attempts: 3           # 尝试重启次数(默认一直尝试重启)
          window: 10                # 检查重启是否成功之前的等待时间(即如果容器启动了, 隔多少秒之后去检测容器是否正常, 默认 0s)
        update_config:              # 用于配置滚动更新配置
          parallelism: 1            # 一次性更新的容器数量
          delay: 1s                 # 更新一组容器之间的间隔时间
          failure_action: continue|rollback|pause         # 定义更新失败的策略 继续更新 回滚更新 暂停更新(默认)
          monitor: 5s               # 每次更新后的持续时间以监视更新是否失败(单位: ns|us|ms|s|m|h) (默认为0)
          max_failure_ratio: 0.9    # 回滚期间容忍的失败率(默认值为0)
          order: stop-first|start-first # v3.4 版本中新增的参数, 回滚期间的操作顺序 旧任务在启动新任务之前停止(默认) 首先启动新任务, 并且正在运行的任务暂时重叠
        rollback_config:            # v3.7 版本中新增的参数, 用于定义在 update_config 更新失败的回滚策略
          parallelism: 1            # 一次回滚的容器数, 如果设置为0, 则所有容器同时回滚
          delay: 1s                 # 每个组回滚之间的时间间隔(默认为0)
          failure_action: continue|pause # 定义回滚失败的策略  继续回滚  暂停回滚
          monitor: 1s               # 每次回滚任务后的持续时间以监视失败(单位: ns|us|ms|s|m|h) (默认为0)
          max_failure_ratio: 0.9    # 回滚期间容忍的失败率(默认值0)
          order: stop-first|start-first  # 回滚期间的操作顺序  旧任务在启动新任务之前停止(默认) 首先启动新任务, 并且正在运行的任务暂时重叠

networks: # 定义 networks 信息
  gomyck:
    # Docker 默认使用 bridge 连接单个主机上的网络
    # overlay 驱动程序创建一个跨多个节点命名的网络
    # 共享主机网络名称空间(等同于 docker run --net=host)
    # 等同于 docker run --net=none
    driver: bridge|overlay|host|none  # 指定网络模式, 大多数情况下, 它 bridge 于单个主机和 overlay Swarm 上
    driver_opts:  # v3.2以上版本, 传递给驱动程序的参数, 这些参数取决于驱动程序
      foo: "bar"
      baz: 1
    attachable: true       # driver 为 overlay 时使用, 如果设置为 true 则除了服务之外，独立容器也可以附加到该网络; 如果独立容器连接到该网络，则它可以与其他 Docker 守护进程连接到的该网络的服务和独立容器进行通信
    ipam:                  # 自定义 IPAM 配置. 这是一个具有多个属性的对象, 每个属性都是可选的
      driver: default      # IPAM 驱动程序, bridge 或者 default
      config:              # 配置项
        subnet: 172.28.0.0/16    # CIDR格式的子网，表示该网络的网段
    external: true               # 外部网络, 如果设置为 true 则 docker-compose up 不会尝试创建它, 如果它不存在则引发错误
    name: gomyck-network         # v3.5 以上版本, 为此网络设置名称

volumes:
  mydata:                        # 定义在 volume, 可在所有服务中调用
    name: xxxxxxx
    external: true               # 如果设置为true，则指定该卷是在 Compose 之外创建的
    labels:
      - xxx: xxx
    driver_opts:
      type: "nfs"
      o: "addr=10.40.0.199,nolock,soft,rw"
      device: ":/docker/example"
  my_data_volume:
    driver: local
    driver_opts:
      o: bind
      device: /var/lib/data
      type: none
```

## 对于值为时间的可接受的值：
- 时间单位: us, ms, s, m， h
## 对于值为大小的可接受的值：
- 数据单位: b, k, m, g 或者 kb, mb, gb

**可以使用 $VARIABLE 或者 ${VARIABLE} 来置换变量**

```text
${VARIABLE:-default}VARIABLE在环境中未设置或为空时设置为default。

${VARIABLE-default}仅当VARIABLE在环境中未设置时才设置为default。

${VARIABLE:?err}退出并显示一条错误消息，其中包含环境中的errif VARIABLE未设置或为空。

${VARIABLE?err}退出并显示一条错误消息，其中包含errif VARIABLE在环境中未设置。

如果想使用一个不被compose处理的变量，可用使用 $$
```

