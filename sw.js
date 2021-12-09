var cacheStorageKey = 'ep-1.8'
var cacheList=[
  "/",
  'index.html',
  'bg.jpg',
  "logo.png",
  "manifest.json",
  "depend1.js",
  "style.css",
  "av-min.js",
  "favicon.ico",
];
function addcache()
{
	caches.open(cacheStorageKey).then(function(cache) {
		return cache.addAll(cacheList);
    });
	self.skipWaiting();
}
self.addEventListener('install',e =>{
  e.waitUntil(addcache());
})
self.addEventListener('fetch',function(e){
  if (e.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = e.request.url.substring(origin.length + 1);
  //console.log(origin,key);
  if(!e.request.url.startsWith(origin))return;
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response != null){
        return response;
      }
      return fetch(e.request.url);
    })
  );
})
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheNames => {
          return (cacheNames !== cacheStorageKey)
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})