健康康复 PWA 部署包

文件：
- index.html：健康康复 App 主程序
- manifest.json：PWA 配置
- sw.js：Service Worker，用于离线缓存 App 程序
- icon-192.svg / icon-512.svg：主屏幕图标

数据隐私：
- 训练记录、体重、睡眠、身体问题等继续使用浏览器 localStorage 保存。
- 本 Service Worker 不包含上传数据的代码。
- Service Worker 只缓存 App 程序文件。
- 因此部署服务器只提供网页程序，不负责保存个人健康记录。

重要：
- 必须通过 HTTPS 网站访问，才能在 iPhone Safari 中注册 Service Worker 并使用“添加到主屏幕”。
- 不要直接从 iPhone“文件”App 打开 index.html。
- 部署后请用 Safari 打开网址，再通过“分享 → 添加到主屏幕”安装。
- 如需跨设备迁移数据，使用 App 内的“备份数据 / 恢复数据”功能。
