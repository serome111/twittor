//imports
importScripts('js/sw-utils.js');

const cache_estatico = 'statico-v2';//lo que creamos
const cache_dinamico = 'dinamico-v1';//cambia constantemente
const cache_inmutable = 'inmutable-v1';//librerias que nunca modificamos



const app_shell = [
	'/',
	'css/style.css',
	'css/animate.css',
	'img/favicon.ico',
	'img/avatars/hulk.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/spiderman.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/wolverine.jpg',
	'js/app.js'
	
];


const app_shell_inmutable = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js'
];



self.addEventListener('install', e =>{
const cacheStatico = caches.open(cache_estatico).then(cache =>
	cache.addAll(app_shell));
const cacheInmutable = caches.open(cache_inmutable).then(cache =>
	cache.addAll(app_shell_inmutable));

e.waitUntil(Promise.all([cacheStatico, cacheInmutable]));
});
//EL ACTIVATE LO USAMOS PARA ELIMINAR LAS VERSIONES ANTIGUAS DEL CACHE
self.addEventListener('activate',e =>{
	const eliminar = caches.keys().then(keys=>{
		keys.forEach(key =>{
			if(key !== cache_estatico && key.includes('statico')) {
				return caches.delete(key);
			}
		});
	});

	e.waitUntil(eliminar);
});



self.addEventListener('fetch',e=>{

	const respuesta = caches.match(e.request).then(res =>{
		if (res) {
			return res;
		}else{
			return fetch(e.request).then(newres =>{
				return actualizaCacheDinamico(cache_dinamico,e.request,newres);
			});
		console.log(e.request.url);//mostrar que mierdas falta que no agregue
		}
	});


e.respondWith(respuesta);


});












