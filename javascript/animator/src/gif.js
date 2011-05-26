
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
                    globalColorTableLength = containsGlobalColorTable ? (Math.pow(2,(bytes[10]&0x07)+1)-1)*3 : 0,
                    globalColorTable = containsGlobalColorTable ? bytes.slice(13, globalColorTableLength) : [];
                
                return {
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
                    // TODO: implement accesser for editing header
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
                    localColorTableLength = containsLocalColorTable ? (Math.pow(2,(bytes[9]&0x07)+1)-1)*3 : 0,
                    localColorTable = containsLocalColorTable ? bytes.slice(10, localColorTableLength) : [],
                    lzwMinimumCodeSide = bytes.slice(10+localColorTableLength, 1),
                    images = [],
                    terminator = [0];

                return {
                    getData : function () {
                        var catenated = [];
                        for (var i=0; i<images.length; ++i) {
                             catenated = [].push.apply(catenated, images[i]);
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
                    size = bytes.slice(2, 3),
                    data = size > 0 ? bytes.slice(3, size-1) : [],
                    terminator = size > 0 ? [0] : [];

                return {
                    getData : function () {
                        return [].concat(
                            signature,
                            label,
                            size,
                            data,
                            terminator
                        );
                    }
                };
            };
        })();

        return {
            header : new Header(bytes)
        };
    };
})();
