/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-f09d4406'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "css/admin.css",
    "revision": "0c4b503e7f1747c0f01c66ef1494f9bd"
  }, {
    "url": "css/app.css",
    "revision": "9d68da780b40bde5412ae3a8598f2bae"
  }, {
    "url": "css/select2.css",
    "revision": "5ee81908ecce9304e71eb535ccc98f04"
  }, {
    "url": "fonts/vendor/@fortawesome/fontawesome-free/webfa-brands-400.ttf?b823fc0dbb5a5f0c21bbcc2a268f92aa",
    "revision": "a78ffbbed2d858c61e068e3b756c9988"
  }, {
    "url": "fonts/vendor/@fortawesome/fontawesome-free/webfa-brands-400.woff2?ebb7a127d2d8ee6f183274b7557718ab",
    "revision": "cd2b4095e9ce66cde642c3502a4022d9"
  }, {
    "url": "fonts/vendor/@fortawesome/fontawesome-free/webfa-regular-400.ttf?0d03b1bbd1d62c1e128489eb2d4fb85d",
    "revision": "b1a1bebb63656b34a23982706f712f71"
  }, {
    "url": "fonts/vendor/@fortawesome/fontawesome-free/webfa-regular-400.woff2?0caf4c6cf244a90efcc5bf6d4e5578c1",
    "revision": "e8a1ba418ee6d897d1339ef22e6d8e60"
  }, {
    "url": "fonts/vendor/@fortawesome/fontawesome-free/webfa-solid-900.ttf?e615bbcb258550973c165dfc0d871c96",
    "revision": "738201559a50502aacabdbdb02720910"
  }, {
    "url": "fonts/vendor/@fortawesome/fontawesome-free/webfa-solid-900.woff2?59edf72a325ac2048d6077f64773674f",
    "revision": "55b416a8df21f9f987aa352f10d1343b"
  }], {});

}));
//# sourceMappingURL=service-worker.js.map
