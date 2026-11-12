/* 健康康复 · 训练计划 — Service Worker（离线缓存）
 *
 * 策略：
 *   · 页面导航  → 网络优先，断网时回退缓存（保证总能拿到最新版本）
 *   · 静态资源  → 缓存优先，未命中再请求并写入缓存
 *
 * 想强制所有人更新到新版本：把 VERSION 改一下（如 v2）再推送即可，
 * 旧缓存会在 activate 阶段自动清掉。
 */
const VERSION = "v4";
const CACHE = "rehab-training-" + VERSION;

const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // 只处理同源的 GET 请求
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 页面本身：网络优先
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() =>
          caches
            .match("./index.html")
            .then((cached) => cached || caches.match("./"))
            .then(
              (cached) =>
                cached ||
                new Response("当前离线，且本地没有缓存。请联网后再打开一次。", {
                  status: 503,
                  headers: { "Content-Type": "text/plain; charset=utf-8" },
                })
            )
        )
    );
    return;
  }

  // 其他静态资源：缓存优先
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => Response.error())
    )
  );
});
