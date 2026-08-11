# 阿里云 ECS 部署说明

本项目建议部署为：

- Next.js `standalone` 产物
- `systemd` 托管 Node 进程
- Nginx 反向代理到 `127.0.0.1:3000`

## 本地打包

```bash
bash scripts/deploy/build-aliyun-package.sh
bash scripts/deploy/verify-package.sh
```

产物位置：

```text
.omx/deploy/portfolio-site-aliyun.tar.gz
```

上传前记录校验值，服务器下载后应得到相同结果：

```bash
sha256sum .omx/deploy/portfolio-site-aliyun.tar.gz
```

## 服务器目录

```text
/opt/portfolio-site/releases/<时间戳>
/opt/portfolio-site/current -> releases/<当前版本>
```

## 上传与发布

上传部署包和安装脚本：

```bash
scp .omx/deploy/portfolio-site-aliyun.tar.gz root@服务器:/root/
scp scripts/deploy/install-aliyun-ecs.sh root@服务器:/root/
```

首次发布和后续更新使用同一条命令：

```bash
sudo DOMAIN="liyilin.xyz www.liyilin.xyz" \
  bash /root/install-aliyun-ecs.sh /root/portfolio-site-aliyun.tar.gz
```

脚本会创建新 release、切换 `current` 软链、重启 systemd，并请求
`127.0.0.1:3000/` 做健康检查。启动失败时自动切回上一个 release；Nginx
配置校验失败时恢复原配置。

## 发布后检查

```bash
systemctl --no-pager --full status portfolio-site
curl -I http://127.0.0.1:3000/
nginx -t
curl -I https://liyilin.xyz/notes
```

## 手动回滚

自动回滚只处理启动失败。若上线后发现业务问题，选择上一个 release：

```bash
ls -1dt /opt/portfolio-site/releases/*
sudo ln -sfn /opt/portfolio-site/releases/<上一个时间戳> /opt/portfolio-site/current
sudo systemctl restart portfolio-site
curl -I http://127.0.0.1:3000/
```

## HTTPS 证书

域名解析到 ECS 且安全组放行 `80`、`443` 后，在服务器执行：

```bash
sudo DOMAINS="liyilin.xyz www.liyilin.xyz" bash /root/setup-aliyun-https.sh
```

如需接收 Let’s Encrypt 续期提醒，可额外提供邮箱：

```bash
sudo DOMAINS="liyilin.xyz www.liyilin.xyz" EMAIL="name@example.com" bash /root/setup-aliyun-https.sh
```
