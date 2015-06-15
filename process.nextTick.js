/** Implements process.nextTick() in a browser environment.
 *  Where other implementations use postMessage, this uses the Image constructor and data URIs, because postMessage spam sucks.
 *  However, if gaining a few fractions of a millisecond in Firefox matter to you, set process.nextTick.enablePostMesage to true.
 */

process.nextTick = (function() {
	var img,
		queue = [],
		noArgs = [],
		pm = !!window.postMessage,
		slice = Array.prototype.slice;
	function tick() {
		var len = queue.length,
			q = queue.splice(0, len),
			i;
		for (i=0; i<len; i+=2) {
			q[i].apply(process, q[i+1]);
		}
	}
	window.addEventListener('message', tick);
	return function nextTick(callback) {
		var args = noArgs;
		if (arguments.length>1) {
			args = slice.call(arguments, 1);
		}
		queue.push(callback, args);
		if (queue.length===2) {
			if (pm && nextTick.enablePostMessage===true) {
				window.postMessage(' ', '*');
			}
			else {
				img = new Image();
				img.onerror = tick;
				img.src = '';
			}
		}
	};
}());
