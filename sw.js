var cacheStorageKey = 'ep-1.1'
var cacheList=[
  "/",
  'index.html',
  'bg.jpg',
  "logo.png",
  "manifest.json",
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
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response != null){
        return response
      }
      return fetch(e.request.url)
    })
  )
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