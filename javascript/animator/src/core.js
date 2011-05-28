
// Animator class
var Animator = (function () { 
    return function (id, url) {
	var util = new Util(),
	    element = document.getElementById(id),
	    bytes = [],
	    images = [];

	return {
	    animate : function () {
		if (arguments.length === 0) {
		    util.ajax({
			url : url,
			mimeType : 'text/plain; charset=x-user-defined',
			success : function (xhr) {
			    var bytes = util.stringToBytes(xhr.responseText);
			    var image = new Gif(bytes);
			    var imgElement = document.createElement('img');
			    imgElement.src = 'data:image/gif;base64,'+util.encodeBase64(bytes);
			    element.appendChild(imgElement);
			}
		    });
		}
	    }
	};
    };
})();

