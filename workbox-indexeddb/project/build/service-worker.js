/*
Copyright 2016 Google Inc.

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
//导入两个本地workbox的js文件
importScripts('workbox-sw.dev.v2.0.0.js');
importScripts('workbox-background-sync.dev.v2.0.0.js');

const workboxSW = new WorkboxSW();
workboxSW.precache([
  {
    "url": "style/main.css",
    "revision": "05e0fbdd9030508cbc287141808d0e89"
  },
  {
    "url": "index.html",
    "revision": "ddd887468fb79854b7ce3419e3ee865a"
  },
  {
    "url": "js/idb-promised.js",
    "revision": "5a8e1636ff2fb9be6b0d281b2f3a592d"
  },
  {
    "url": "js/main.js",
    "revision": "e32db35751f571ff2d4e2c64f00bc7e5"
  },
  {
    "url": "images/profile\\cat.jpg",
    "revision": "69936d25849a358d314f2f82e9fa4578"
  },
  {
    "url": "images/touch\\icon-128x128.png",
    "revision": "c2c8e1400d6126ea32eaac29009733a9"
  },
  {
    "url": "images/touch\\icon-192x192.png",
    "revision": "571f134f59f14a6d298ddd66c015b293"
  },
  {
    "url": "images/touch\\icon-256x256.png",
    "revision": "848055c2f5d42b0c405cff37739261e9"
  },
  {
    "url": "images/touch\\icon-384X384.png",
    "revision": "a1be08eac51e8ff734a337b90ddc1c16"
  },
  {
    "url": "images/touch\\icon-512x512.png",
    "revision": "b3d7c4eaefdd3d30e348a56d8048bf68"
  },
  {
    "url": "manifest.json",
    "revision": "5f4aa3bba528cf6e8f69ba0d627ec0d4"
  },
  {
    "url": "/",
    "revision": "a4ae0be85d8bc269a637914f5b998906"
  }
]);

let bgQueue = new workbox.backgroundSync.QueuePlugin({
    callbacks: {
      replayDidSucceed: async(hash, res) => {
        self.registration.showNotification('Background sync demo', {
          body: 'Events have been updated!'
        });
      }
    }
  });
  
  workboxSW.router.registerRoute('/api/add',
    workboxSW.strategies.networkOnly({plugins: [bgQueue]}), 'POST'
  );

  workboxSW.router.registerRoute('/api/getAll', () => {
    return bgQueue.replayRequests().then(() => {
      return fetch('/api/getAll');
    }).catch(err => {
      return err;
    });
  });
