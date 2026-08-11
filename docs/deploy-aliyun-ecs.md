# 阿里云 ECS 部署说明

本项目建议部署为：

- Next.js `standalone` 产物
- `systemd` 托管 Node 进程
- Nginx 反向代理到 `127.0.0.1:3000`

## 本地打包

```bash
bash scripts/deploy/build-aliyun-package.sh
```

产物位置：

```text
.omx/deploy/portfolio-site-aliyun.tar.gz
```

## 服务器目录建议

```text
/opt/portfolio-site/current
```

## 手动上传与启动示例

把压缩包上传到服务器后执行：

```bash
sudo mkdir -p /opt/portfolio-site/current
sudo tar -xzf portfolio-site-aliyun.tar.gz -C /opt/portfolio-site/current
cd /opt/portfolio-site/current
HOSTNAME=127.0.0.1 PORT=3000 ./start.sh
```

## systemd 服务示例

```ini
[Unit]
Description=Portfolio Site
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/portfolio-site/current
Environment=NODE_ENV=production
Environment=HOSTNAME=127.0.0.1
Environment=PORT=3000
ExecStart=/opt/portfolio-site/current/start.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## Nginx 反代示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
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
