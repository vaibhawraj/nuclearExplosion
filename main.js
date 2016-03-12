/*
 *	Name : main.js
 *  Description : Main Entry point for javascript
 */
 var elem = document.getElementById('chain_container');
 function resize() {
 	elem.style.height = (window.innerHeight - 2) + 'px';
 	elem.style.width = (window.innerWidth - 2) + 'px';
 }
 resize();
 window.addEventListener('resize',resize);

 var GameOption = {
 	elemId : '#chain_container',
 	n : 10
 }; 
 Chain.init(GameOption)