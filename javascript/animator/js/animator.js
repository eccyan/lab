var animator = {
    animate : function (id, url) {
	var target = document.getElementById(id);

	var ajax = function(obj){
	    var url = obj.url || "",
		success = obj.success || function(){},
		error = obj.error || function(){},
		mimeType = obj.mimeType || null,
		xhr = new XMLHttpRequest();
	    xhr.open("GET", url);
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
	    xhr.send(null);
	};

	var animation = {
	    create : function (bytes) {
	    	var GIF = function (bytes) {
		    // Get signature
		    var signature = String.fromCharCode.apply(String, bytes.slice(0, 3));
		    // signature is "GIF"
		    if (signature !== "GIF") {
			throw new Error( "This file type is not supported:" + signature );
		    }

		    // Get version
		    var version = String.fromCharCode.apply(String, bytes.slice(3, 6));

		    // Get logical size
		    var logicalScreenWidth  = bytes[6] | bytes[7] << 8; 
		    var logicalScreenHeight = bytes[8] | bytes[9] << 8;

		    // Get color table settings
		    var globalColorTableFlag = bytes[10] >> 7;
		    var colorResolution = (bytes[10] >> 4 & 0x07) + 1;
		    var sortFlag = bytes[10] >> 3 & 0x01;
		    var sizeOfGlobalColorTable = Math.pow(2, (bytes[10] & 0x07) + 1);

		    var backgroundColorIndex = bytes[11];
		    var pixelAspectRatio = (bytes[12] + 15) / 64;
		    
		    var bytes = bytes;
		    return {
		    	signature : signature,
			version : version,
			logicalScreenWidth : logicalScreenWidth,
			logicalScreenHeight : logicalScreenHeight,
			globalColorTableFlag : globalColorTableFlag,
			colorResolution : colorResolution,
			sortFlag : sortFlag,
			sizeOfGlobalColorTable : sizeOfGlobalColorTable,
		    };
		};

		var gif = GIF(bytes);
	    },
	};

	ajax({
	    url : url,
	    mimeType : 'text/plain; charset=x-user-defined',
	    success : function (xhr) {
		var res = xhr.responseText;   
		var bytes = [];
		for (var i = 0; i < res.length; i++)
		    bytes[i] = res.charCodeAt(i) & 0xff;
		animation.create(bytes);

		var data = String.fromCharCode.apply(String, bytes);
		var img = document.createElement('img');
		img.src = 'data:image/gif;base64,' + base64.encode(data);
		target.appendChild(img);
	    },
	});
    }
};
