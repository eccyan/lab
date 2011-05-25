(function ( Animator ) {
var GIF = (function () {
    return function (bytes) {
        // Get signature
        var signature = String.fromCharCode.apply(String, bytes.slice(0, 3));
        // signature is "GIF"
        if (signature !== "GIF") {
            throw new Error( "This file type is not GIF:" + signature );
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
    }
})();
})( Animator );

