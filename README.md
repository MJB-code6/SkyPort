# SkyPort
> Simple setup. Offline-first. Customizable.

### Why SkyPort?  

* Create an offline-first user experience for your web apps.
* Optimize online web performance by reducing network requests.
* Progressive web functionality.

SkyPort is a library designed to make it easier for developers to take full advantage of a powerful progressive web technology—Service Workers. As a proxy server that exists between the client and network, Service Workers have the potential to optimize web apps by reducing network requests, creating an offline-first experience so users can navigate your app even when they are offline, and even improve current online user experience.

#####So what's the problem with Service Workers?

Service Workers are still a new and experimental technology, setup is long and tedious and understanding the Service Worker lifecycle can create a strenuous development experience. SkyPort is a library that simplifies setup, and provides developers flexibility and customization of their offline-first user experience.

# Getting Started

1. Download skyport.js file and include in your app's client folder.
2. Add a script tag to your html files linking to skyport.js.
3. Apply the Skyport methods below.

## skyport.cache(*jsonFile*)

> *Include in a script tag on your homepage, or call from a file that you won’t cache.*

#####Benefits:

 1. Cache both static and dynamic assets with one method.
 2. Reduce network requests, optimize your app's web performance.
 3. Better user experience—users unlikely to notice your app is offline.  
 4. Fallback page automatically served when user is offline and the requested assets not found in the cache.
 5. For static file updates:
  + The version number can be set to a number or a string.
  + Change the version number anytime you change the contents of the cache


*index.html:*  
```javascript
skyport.cache('/assetList.json');
```    

 *assetList.json:*  

 + In this example, the static cache, the dynamic cache and the fallback page are all included in the JSON file—include only what you are using. **For example if you are only static assets, include the version number and the static property with the list of assets you want to store in the static cache.

```javascript
{
  version: 1,
  static: [
    '/index.html',
    '/messages.html',
    '/another-page.html',
    '/style.css',
    '/index.js',
    '/assets/some-image.png',
    '/assets/some-video.mp4'
  ],
  dynamic: [
    '/messages',
    '/dynamicData.html'
  ],
  fallback: '/fallback.html'
}
 ```

## skyport.static(*jsonFile* / *versionNum*, [*files*] )
> *Include in file that you won’t cache, like index.html.*

#####Benefits:
1. For smaller apps that need to cache static files only.
2. Either include the JSON file and only static files will be cached or the files in an array with the version number.
3. Improve web performance by reducing network requests.
4. Optimize user experience as static files appear when user is offline.        

##### Method 1:
 *index.html:*  
```javascript
skyport.static(1, [
  '/index.html',
  '/messages.html',
  '/another-page.html',
  '/style.css',
  '/index.js',
  '/assets/some-image.png',
  '/assets/some-video.mp4'
]);
```    

##### Method 2:
 *index.html:*  
```javascript
skyport.static('/assetList.json');
```            

*assetList.json:*

 + only static files will be cached, the rest is ignored.
 + JSON file should have 'version' and 'static'(array) properties.

```javascript
{
  version: 1,
  static: [
    '/index.html',
    '/messages.html',
    '/another-page.html',
    '/style.css',
    '/index.js',
    '/assets/some-image.png',
    '/assets/some-video.mp4'
  ],
  dynamic: [
    '/messages',
    '/dynamicData.html'
  ],
  fallback: '/fallback.html'
}
 ```

## skyport.dynamic(*jsonFile* / [*files*])

#####Benefits:
1. For smaller apps that need to cache dynamic files only.
2. Either include the JSON file and only dynamic files will be cached or the files in an array.   

##### Method 1:
```javascript
skyport.dynamic(['/messages','/dynamicData.html',]);
```    

##### Method 2:
```javascript
skyport.dynamic('/assetList.json');
```            

*assetList.json:*

 + only dynamic files will be cached, the rest is ignored.
 + JSON file should have 'dynamic'(array) property to work.

```javascript
{
  version: 1,
  static: [
    '/index.html',
    '/messages.html',
    '/another-page.html',
    '/style.css',
    '/index.js',
    '/assets/some-image.png',
    '/assets/some-video.mp4'
  ],
  dynamic: [
    '/messages',
    '/dynamicData.html'
  ],
  fallback: '/fallback.html'
}
 ```

## skyport.direct(*data, callback*)

#####Benefits:

1. Function runs immediately if user is online, or queued if user is offline and synced when user is online again.
2. Convenient for post requests and functions that can only run when user is online.

```javascript
function sendMessage() {
  var msg = $('input').val();
  var user = $('#user-input').val();
  var msgObj = {};
  msgObj.message = msg;
  msgObj.author = user;

  skyport.direct(function() {
    $.ajax({
    type: POST,
        url: '/messages',
    data: msgObj,
    ...
    ...
  	}).then {
    	getNewMessages();
  	};
  });
};
```

## skyport.fallback(*fallback*)

#####Benefits:
1. When user is offline and assets they request are not in cache, custom fallback page will be served.
2. Create a simple fallback page for users to see when your web app is offline.

```javascript
skyport.fallback('/fallbackPage.html');
```  

## skyport.reset()

#####Benefits:
1. During development making resetting the cache easy.
2. Resetting indexedb useful when using *skyport.direct()* method.
3. Easily delete current Service Worker.

```javascript
skyport.reset() // resets caches, Service Worker, indexedb
skyport.reset('cache') // resets static and dynamic caches only
skyport.reset('cache', 'indexedb') // resets caches and indexedb only.
skyport.reset('sw') // deletes current Service Worker
```

---

### License
MIT License (MIT)

Copyright (c) 2016 Team SkyPort ([Brandon](https://github.com/ranmizu), [Masha](https://github.com/Mashadim), [Joe](https://github.com/ZhouxiangHuang))
