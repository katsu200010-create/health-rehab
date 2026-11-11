# 健康康复 · 训练计划

一个纯前端、单文件的个人康复训练计划工具：每日动作安排、组间计时与语音提示、训练记录、动作库。**不需要服务器、不需要数据库、不联网也能用**，所有数据都保存在你自己浏览器的 `localStorage` 里。

直接打开也能用，但把它放到 GitHub Pages 上之后，可以在手机上「添加到主屏幕」，像 App 一样打开，并且断网也能用。

---

## 文件说明

| 文件 | 作用 |
| --- | --- |
| `index.html` | 整个应用。样式、脚本、动作库、训练计划全部内联在这一个文件里 |
| `manifest.webmanifest` | PWA 清单，让浏览器支持「安装到桌面 / 主屏幕」 |
| `icon.svg` | 应用图标（矢量，任意尺寸清晰） |
| `sw.js` | Service Worker，负责离线缓存 |
| `.nojekyll` | 告诉 GitHub Pages 不要用 Jekyll 处理，避免文件被忽略 |
| `README.md` | 本文件 |

---

## 部署到 GitHub Pages

### 方式一：网页操作（不用装任何工具）

1. 在 GitHub 上新建一个仓库，例如 `rehab-training`。**可见性选 Public**（私有仓库想用 Pages 需要付费账号）。
2. 把本目录下的所有文件上传：仓库页 → `Add file` → `Upload files` → 拖进去 → `Commit changes`。
   ⚠️ 必须保证 `index.html` 在**仓库根目录**，不要多套一层文件夹。
3. 进入仓库 `Settings` → 左侧 `Pages`。
4. `Build and deployment` 里，`Source` 选 **Deploy from a branch**，`Branch` 选 **main**、目录选 **/ (root)**，点 `Save`。
5. 等 1–2 分钟，页面顶部会出现地址，形如：

   ```
   https://<你的用户名>.github.io/rehab-training/
   ```

   打开这个地址就是你的训练计划页。

### 方式二：命令行（本目录已经 `git init` 过，直接接远程）

```bash
# 在 GitHub 上先建好空仓库，然后把下面的地址换成你自己的
git remote add origin https://github.com/<你的用户名>/rehab-training.git
git branch -M main
git push -u origin main
```

推送完成后，同样去 `Settings → Pages` 选 `main` / `/ (root)` 即可。

> 首次推送如果提示要密码，GitHub 早已不接受账号密码，请用 **Personal Access Token**（Settings → Developer settings → Tokens）当作密码，或者用 `gh auth login`。

---

## 在手机上使用

**iOS（Safari）**：打开 Pages 地址 → 分享按钮 → 「添加到主屏幕」。
**Android（Chrome）**：打开地址 → 右上角菜单 → 「安装应用 / 添加到主屏幕」。

装上之后是全屏无地址栏的独立窗口，断网也能打开（首次打开需要联网，之后由 `sw.js` 缓存）。

⚠️ 两个必须知道的限制：

1. **数据不跟着账号走。** `localStorage` 绑定在「域名 + 浏览器」上。换手机、换浏览器、换仓库名（域名变了），数据都是空的。要迁移请用应用内「数据设置 → 备份数据」导出 JSON，在新设备上用「恢复数据」导入。
2. **iOS 主屏幕版和 Safari 里的数据是两份。** 如果你先在 Safari 里用了一阵，再「添加到主屏幕」，主屏幕版会是空数据。建议**一开始就决定好从哪儿用**，或者先备份再恢复。

---

## 数据与隐私

- 所有训练记录、身体不适记录、自定义计划都只写在本机浏览器的 `localStorage`，键名 `healthAppV4`。
- 页面没有任何 `fetch` / `XMLHttpRequest` 上报，没有第三方脚本、字体、统计代码。仓库里也不含任何个人数据。
- 但仓库本身是公开的：**训练计划内容（哪些动作、几天练什么）会随源码公开**。如果不希望别人看到这份计划，把仓库设为 Private（Pages 需付费）或只在本地使用文件。

清理浏览器缓存 / 使用隐私模式会导致数据丢失，建议定期「备份数据」。

---

## 如何更新

```bash
# 替换 index.html 后
git add .
git commit -m "更新训练计划"
git push
```

GitHub Pages 会在 1 分钟左右生效。如果改了页面却看到旧内容：

- 先强制刷新（电脑 `Ctrl/Cmd + Shift + R`）；
- 还不行就把 `sw.js` 顶部的 `VERSION` 从 `"v1"` 改成 `"v2"`，一起推送 —— 这会清掉旧缓存并重新拉取。

---

## 本地预览（可选）

Service Worker 只在 `https://` 或 `localhost` 下生效，直接双击 `index.html`（`file://`）时它会被自动跳过，其它功能照常。想在本地测完整效果，起一个静态服务器：

```bash
python -m http.server 8080
# 然后打开 http://localhost:8080
```

---

## 兼容性

- iOS Safari 15+、Android Chrome 90+、桌面 Chrome / Edge / Safari 均可。
- 提示音用 Web Audio 现场合成，语音播报用系统自带 TTS，因此**设备没装中文语音包时只有音效、没有语音**。
- iPhone 的静音拨片开着时，网页声音可能被静音，练之前留意一下。
