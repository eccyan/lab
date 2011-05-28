
var Gif = (function () {
    return function (bytes) {
        var Header = (function () {
            return function (bytes) {
                var signature = bytes.slice(0, 3),
                    version = bytes.slice(3, 6),
                    width = bytes.slice(6, 7),
                    height = bytes.slice(8, 9),
                    packedFields = bytes[10],
                    backgroundColorIndex = bytes[11],
                    pixelAspectRatio = bytes[12],
                    containsGlobalColorTable = (bytes[10] >> 7) == 1,
                    globalColorTableLength = containsGlobalColorTable ? Math.pow(2, (bytes[10]&0x07)+1)*3 : 0,
		    size = 13 + globalColorTableLength,
                    globalColorTable = containsGlobalColorTable ? bytes.slice(13, globalColorTableLength) : [];
                
                return {
		    getSize : function () {
			return size;
		    },
                    getData : function () {
                        return [].concat(
                            signature,
                            version,
                            width,
                            height,
                            packedFields,
                            backgroundColorIndex,
                            pixelAspectRatio,
                            globalColorTable
                        );
                    }
                };
            };
        })();

        var ImageBlock = (function () {
            return function (bytes) {
                var separator = bytes.slice(0, 1),
                    left = bytes.slice(1, 3),
                    right = bytes.slice(3, 5),
                    width = bytes.slice(5, 7),
                    height = bytes.slice(7, 9),
                    packedFields = bytes.slice(9, 10),
                    containsLocalColorTable = (bytes[9] >> 7) == 1,
                    localColorTableLength = containsLocalColorTable ? Math.pow(2,(bytes[9]&0x07)+1)*3 : 0,
                    localColorTable = containsLocalColorTable ? bytes.slice(10, localColorTableLength) : [],
                    lzwMinimumCodeSide = bytes.slice(10+localColorTableLength, 1),
                    datas = [],
                    terminator = [0],
		    size = null;

		for (var i=0, length=10+localColorTableLength+1, terminated = false; !terminated; ++i) {
		    var dataSize = bytes.slice(length, length+1) >>> 0,
			data = bytes.slice(length+1, (length+1)+dataSize);

		    if (dataSize > 0) {
			datas[i] = [].concat([dataSize], data);
		    } else {
			terminated = true;
		    }

		    length += dataSize+1;
		    size = length;
		}

                return {
		    getSize : function () {
			return size;
		    },
                    getData : function () {
                        var catenated = [];
                        for (var i=0; i<images.length; ++i) {
                             [].push.apply(catenated, datas[i]);
                        }

                        return [].concat(
                            separator,
                            left,
                            right,
                            width,
                            height,
                            packedFields,
                            localColorTable,
                            lzwMinimumCodeSide,
                            catenated,
                            terminator
                        );
                    }
                };
            };
        })();

        var ExtensionBlock = (function () {
            return function (bytes) {
                var signature = bytes.slice(0, 1),
                    label = bytes.slice(1, 2),
                    datas = [],
                    terminator = [0],
		    size = null;

		for (var i=0, length=2, terminated = false; !terminated; ++i) {
		    var dataSize = bytes.slice(length, length+1) >>> 0,
			data = bytes.slice(length+1, (length+1)+dataSize);

		    if (dataSize > 0) {
			datas[i] = [].concat([dataSize], data);
		    } else {
			terminated = true;
		    }

		    length += dataSize+1;
		    size = length;
		}

                return {
		    getSize : function () {
			return size;
		    },
                    getData : function () {
                        var catenated = [];
                        for (var i=0; i<images.length; ++i) {
                             [].push.apply(catenated, datas[i]);
                        }

                        return [].concat(
                            signature,
                            label,
                            size,
                            catenated,
                            terminator
                        );
                    }
                };
            };
        })();

	var Blocks = (function () {
	    return function (bytes) {
		var data = [];
		var factory = { 
		    0x2c : function () { return new ImageBlock(bytes); },
		    0x21 : function () { return new ExtensionBlock(bytes); }
		};

		for (var i=0, length=0; length<bytes.length; ++i) {
		    data[i] = factory[bytes[length]]();
		    length += data[i].getSize();
		}
		return {
		    getSize : function() {
			return data.length;
		    },
		    get : function(index) {
			return data[index];
		    },
		    set : function(index, block) {
			data[index] = block;
		    }
		};
	    };
	})();

	var header = new Header(bytes),
	    blocks = new Blocks( bytes.slice(header.getSize()) );

        return {
            header : header,
	    blocks : blocks,
	    getData : function () {
		var data = [];
		[].push.apply(data, header.getData());
		for (var i=0; i<blocks.getSize(); ++i) {
		    [].push.apply(data, blocks.get(i).getData());
		}
	    }
        };
    };
})();
