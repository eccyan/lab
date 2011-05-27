
var Util = (function () {
    return function () {
        return {
	    stringToBytes : function (str) {
		var bytes = [];
		for (var i = 0; i < str.length; i++) {
		    bytes[i] = str.charCodeAt(i) & 0xff;
		}
		return bytes;
	    },
	    bytesToString : function (bytes) {
		return String.fromCharCode.apply(String, bytes);
	    },
	    encodeBase64 : function (data) {
		var keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
		    padLength  = 3 - (data.length%3),
		    encoded = "";
		
		// padding with 0
		if (padLength < 3) {
		    for (i=0; i<padLength; ++i) {
			data[data.length] = 0;
		    }
		}

		var binary = null;
		for (i=0; i<data.length; i+=3) {
		    binary = (data[i] << 16) | (data[i+1] << 8) | data[i+2];
		    encoded += keys[(binary >>>18) & 0x3f] + keys[ (binary >>>12) & 0x3f] + keys[ (binary >>> 6) & 0x3f] + keys[ binary & 0x3f];
		}

		// replace 0 to '=' 
		if (padLength < 3) {
		    encoded = encoded.substr(0, encoded.length - padLength);
		    for (i=0; i<padLength; ++i) {
			encoded += "=";
		    }
		}
		
		return encoded;
	    },
            ajax : function (obj) {
                var url = obj.url || "",
                    method = obj.method || "GET",
                    data = obj.data || null,
                    success = obj.success || function(){},
                    error = obj.error || function(){},
                    mimeType = obj.mimeType || null,
                    xhr = new XMLHttpRequest();
                xhr.open(method, url);
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4){
                        if(xhr.status == 200){
                        success(xhr);
                        }else{
                        error();
                        }
                    }
                };
                if (mimeType) {
                    xhr.overrideMimeType(mimeType);
                }
                xhr.send(data);
            }
        };
    };
})();
