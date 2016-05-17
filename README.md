# SkyPort
> Simple setup. Offline-first. Customizable.

#####Have you ever wanted users to experience your web app even when the internet fails them? 

Introducing Service Workers, an amazing tool that allows your website to function offline, increase your web apps' performance by reducing network requests and allow you to create a customized offline fallback page for your app.

#####So what's the problem with Service Workers?

Setup is long and tedious and understanding the Service Worker lifestyle can be a hassle as the constant need for refreshing and literally having to go to another page for your changes to be seen can create a painfully arduous development experience. 

Utilizing the power of Service Workers, we've created a library that simplifies setup, and provides developers flexibility and customization of their offline-first user experience.

### Why SkyPort offline?  

* Focus more on development and less on inessential configuration.
* Create an offline-first user experience for your web apps.
* Improves web performance by reducing network requests.
* Determine whether to serve files from a cache, server, or fallback page, depending on if user is online or offline.
* Defer functions/requests if user goes offline, only to be successfully synced once they are online again.



## skyport.cache([*files*], *fallback(optional)*)

#####Benefits:
1. Choose what you want to cache
2. Improve your app's performance.
3. Better user experience--users unlikely to notice your app is offline.  
4. (*optional*) Include a fallback page when user is offline. Useful if the asset they are requesting is not available in the cache.
   
        skyport.cache([
          '/index.html',
		  '/messages.html',
		  '/another-page.html',
		  '/style.css',
		  '/index.js',
		  '/assets/some-image.png',
		  '/assets/some-video.mp4'
           ], '/fallback-page.html');

## skyport.sendOrQueue(*fn*)

#####Benefits:

1. Takes a function and runs it immediately if user is online, or queues it if user is offline to be synced whey they are online again.
2. Convenient for post requests and functions that can only run when user is online.
	

        function sendMessage() {
	      var msg = $('input').val();
	      var user = $('#user-input').val();
	      var msgObj = {};
	      msgObj.message = msg;
	      msgObj.author = user;
				
	      skyport.sendOrQueue(function() {
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

## skyport.fallback(*fallback*);

#####Benefits:
1. Easy setup, one line of code.
2. Create a simple fallback page for users to see when your web app is offline.
 
        skyport.fallback('/fallbackPage.html');