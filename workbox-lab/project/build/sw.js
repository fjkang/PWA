/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  //缓存预加载数据
  workbox.precaching.precacheAndRoute([
  {
    "url": "style/main.css",
    "revision": "c7a02441b4914ffdc39eb2eb55148adc"
  },
  {
    "url": "index.html",
    "revision": "f9320309d54f0ce8033c24cf5d76ae20"
  },
  {
    "url": "js/animation.js",
    "revision": "3f8fd475afa44c10b3107178a83bd9ae"
  },
  {
    "url": "images/home/business.jpg",
    "revision": "9c3ec8d2a8a188bab9ddc212a64a0c1e"
  },
  {
    "url": "pages/offline.html",
    "revision": "4a9a5105e6c974c6deec1c8893d00961"
  },
  {
    "url": "pages/404.html",
    "revision": "2f404c2bc9d919f3dcad5c8e570bc1bf"
  }
]);
  //articles页面图片数据
  workbox.routing.registerRoute(
    /(.*)articles(.*)\.(?:png|gif|jpg)/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        })
      ]
    })
  );

  //缓存images里面icon文件夹里面的数据
  workbox.routing.registerRoute(
    //new RegExp('/images/icon/*'),
    /images\/icon\/(.*)/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'icon-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 5
        })
      ]
    })
  );

  //缓存article的html页面
  const articleHandler = workbox.strategies.networkFirst({
    cacheName: 'articles-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  workbox.routing.registerRoute(/(.*)article(.*)\.html/, args => {
    return articleHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('pages/offline.html');
      } else if (response.status === 404) {
        return caches.match('pages/404.html');
      }
      return response;
    });
  });

  //缓存post的html页面
  const postHandler = workbox.strategies.cacheFirst({
    cacheName: 'post-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  workbox.routing.registerRoute(/(.*)pages\/post(.*)\.html/, args => {
    return postHandler.handle(args).then(response => {
      if (response.status === 404) {
        return caches.match('pages/404.html');
      }
      return response;
    })
    //这里要改成捕获异常,然后返回一个离线页面
    .catch(function() {
      return caches.match('pages/offline.html');
    });
  });

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
