// import localforage from "localforage";

importScripts('localforage.min.js');

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/dzeditor/image/')) {
        const uniqueName = url.pathname.split('/dzeditor/image/')[1];
        event.respondWith(
            localforage.getItem(uniqueName).then(dataURI => {
                const blob = dataURItoBlob(dataURI);
                return new Response(blob);
            }).catch(error => {
                console.error('Error fetching from IndexedDB:', error);
                return new Response('Error fetching data', {status: 500});
            })
        );
    }
});

self.addEventListener('install', function(event) {
    // Service worker installation
    self.skipWaiting(); // Forces the waiting service worker to become the active service worker
});

self.addEventListener('activate', function(event) {
    // Service worker activation
    clients.claim(); // Makes the service worker take control of the page immediately
});
