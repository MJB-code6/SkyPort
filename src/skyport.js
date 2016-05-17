(function() {
  //  Service Workers are not (yet) supported by all browsers
  if (!navigator.serviceWorker) return;

  //  A reference to our database in indexedDB
  var db;

  var serviceWorker = navigator.serviceWorker.controller;

  //  Register the service worker once on load
  if (!serviceWorker) {
    navigator.serviceWorker.register('/sw-skyport.js', {
      scope: '.'
    }).then(function(registration) {
      serviceWorker = registration.active || registration.waiting || registration.installing;

      //  This file should be included in the cache for offline use
      skyport.cache(['/skyport.js']);

      //  Tell the service worker to create storage in indexedDB
      sendToSW({command: 'createDB', info: window.location.origin});
    });
  }

  //  Make useful functions available on the window object
  window.skyport =  window.skyport || {

    //  Use this function to add assets to cache for offline use
    cache: function(assetArray, fallback) {
      sendToSW({
        command: 'cache',
        info: assetArray
      });

      if (fallback) {
        sendToSW({
          command: 'fallback',
          info: fallback
        });
      }
    },

    //  Use this function to add a default page if a resource is not cached
    fallback: function(fallback) {
    	sendToSW({
        command: 'fallback',
        info: fallback
      });
    },

    //
    sendOrQueue: function(dataObj, deferredFunc) {
      if (navigator.onLine) return deferredFunc(dataObj);
      if (typeof(deferredFunc) !== "function") return;
      sendToSW({
        command: 'queue',
        info: {
          domain: window.location.origin,
          dataObj: JSON.stringify(dataObj),
          deferredFunc: '(' + deferredFunc.toString() + ')'
        }
      });
    }
  };

  window.addEventListener('online', function(event) {
    sendToSW({command: "online", info: true});
    emptyQueue();
  });

  window.addEventListener('offline', function(event) {
    sendToSW({command: "online", info: false});
  });

  window.addEventListener('load', function(event) {
  });

  function emptyQueue() {
    var openRequest = indexedDB.open('DEFERRED', 1);

    openRequest.onsuccess = function(e) {
      var db = e.target.result;
      var objectStore = db.transaction(["deferredRequests"], "readwrite").objectStore("deferredRequests");
      var request = objectStore.get(window.location.origin);

      request.onerror = function(event) {
      };

      request.onsuccess = function(event) {
        var deferredQueue = request.result["requests"];

        while(navigator.onLine && deferredQueue.length) {
          var nextRequest = deferredQueue.shift();
          var deferredFunc = eval(nextRequest.callback);
          if (typeof(deferredFunc) === "function") deferredFunc(JSON.parse(nextRequest.data));
          var requestUpdate = objectStore.put({domain: window.location.origin, requests: deferredQueue});
           requestUpdate.onerror = function(event) {
           };
           requestUpdate.onsuccess = function(event) {
           };
        }
      }

    };
  }

  function sendToSW(messageObj) {
    if (!serviceWorker) {
      navigator.serviceWorker.oncontrollerchange = function() {
        serviceWorker = navigator.serviceWorker.controller;
        serviceWorker.postMessage(messageObj);
      }
    } else {
      serviceWorker.postMessage(messageObj);
    }
  }
})();
