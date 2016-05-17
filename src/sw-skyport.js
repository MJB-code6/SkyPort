'use strict';

const CACHE_FIRST = 'precache';
const FALLBACK_CACHE = 'fallback';
var online = true;
var db;
var precacheAssets = precacheAssets || [];

self.addEventListener('install', function(event) {
  return self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
       caches.match(event.request)
         .then(function(response) {
           return online ? fetch(event.request) : response;
         }).catch(function(event){
           return;
         })
    )
  });

self.addEventListener('message', function(event) {

	if (event.data.command === "cache") {
    precacheAssets = precacheAssets.concat(event.data.info);
    caches.open('precache')
      .then(function(cache) {
        return cache.addAll(precacheAssets);
      })
      .catch(function() {
      });
  }

	if(event.data.command === "fallback") {
		caches.open('fallback')
	 		.then(function(cache) {
		 		return cache.add(event.data.info);
	 		})
	}

  if (event.data.command === "online") {
    online = event.data.info;
  }

  if (event.data.command === "createDB") {
    var request = indexedDB.open('DEFERRED', 1);

    request.onupgradeneeded = function(e) {
      db = e.target.result;
      var objectStore = db.createObjectStore("deferredRequests", { keyPath: "domain" });
    };

    request.onsuccess = function(e) {
      db = e.target.result;
      var dRObjectStore = db.transaction("deferredRequests", "readwrite").objectStore("deferredRequests");
      dRObjectStore.add({domain: event.data.info, requests: []});
    };
  }

  if (event.data.command === "queue") {
    var openRequest = indexedDB.open('DEFERRED', 1);

    openRequest.onsuccess = function(e) {
      var db = e.target.result;
      var objectStore = db.transaction(["deferredRequests"], "readwrite").objectStore("deferredRequests");
      var request = objectStore.get(event.data.info.domain);

      request.onsuccess = function(e) {
        // Get the old value that we want to update
        var deferredQueue = request.result["requests"];

        // update the value(s) in the object that you want to change
        deferredQueue.push({
          data: event.data.info.dataObj,
          callback: event.data.info.deferredFunc
        });

        // Put this updated object back into the database.
        var requestUpdate = objectStore.put({domain: event.data.info.domain, requests: deferredQueue});
        requestUpdate.onerror = function(e) {
        };

        requestUpdate.onsuccess = function(e) {
        };
      };
    }
  }

});
