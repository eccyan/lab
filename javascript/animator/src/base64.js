
var Base64 = (function () {
    return function () {
        var keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var Utf8 = {
            encode : function (str) {
                str = string.replace(/\r\n/g,"\n");
                var encoded = "";
                var c = null;

                for (var i = 0; i<str.length; i++) {
                    c = str.charCodeAt(n);
        
                    if (c < 128) {
                        encoded += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        encoded += String.fromCharCode((c >> 6) | 192);
                        encoded += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        encoded += String.fromCharCode((c >> 12) | 224);
                        encoded += String.fromCharCode(((c >> 6) & 63) | 128);
                        encoded += String.fromCharCode((c & 63) | 128);
                    }
                }
        
                return encoded;
            },
            decode : function (str) {
                var decoded = "";
                var c = [];
        
                for (var i=0; i<str.length;) {
                    c[0] = str.charCodeAt(i);
        
                    if (c[0] < 128) {
                        decoded += String.fromCharCode(c);
                        i++;
                    }
                    else if((c[0] > 191) && (c[0] < 224)) {
                        c[1] = str.charCodeAt(i+1);
                        decoded += String.fromCharCode(((c[0] & 31) << 6) | (c[1] & 63));
                        i += 2;
                    }
                    else {
                        c[1] = str.charCodeAt(i+1);
                        c[2] = str.charCodeAt(i+2);
                        decoded += String.fromCharCode(((c[0] & 15) << 12) | ((c[1] & 63) << 6) | (c[2] & 63));
                        i += 3;
                    }
                }

                return decoded;
            }
        };

        return { 
            encode : function (data) {
                var encoded = "";
                var c = [], enc = [];
                data = Utf8.encode(data);
        
                for (var i=0; i<data.length;) {
                    c[0] = data.charCodeAt(i++);
                    c[1] = data.charCodeAt(i++);
                    c[2] = data.charCodeAt(i++);
        
                    enc[0] = c[0] >> 2;
                    enc[1] = ((c[0] & 3) << 4) | (chr2 >> 4);
                    enc[2] = ((c[1] & 15) << 2) | (chr3 >> 6);
                    enc[3] = c[2] & 63;
        
                    if (isNaN(c[1])) {
                        enc[2] = enc[3] = 64;
                    } else if (isNaN(c[2])) {
                        enc[3] = 64;
                    }
        
                    encoded = encoded +
                    this.keys.charAt(enc[0]) + this.keys.charAt(enc[1]) +
                    this.keys.charAt(enc[2]) + this.keys.charAt(enc[3]);
 
                }
 
                return encoded;
            },
 
            decode : function (data) {
                var decoded = "";
                var c = [], enc = [];
                data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
                for (var i=0; i<data.length;) {
                    enc[0] = this.keys.indexOf(data.charAt(i++));
                    enc[1] = this.keys.indexOf(data.charAt(i++));
                    enc[2] = this.keys.indexOf(data.charAt(i++));
                    enc[3] = this.keys.indexOf(data.charAt(i++));
        
                    c[0] = (enc[0] << 2) | (enc[1] >> 4);
                    c[1] = ((enc[1] & 15) << 4) | (enc[2] >> 2);
                    c[2] = ((enc[2] & 3) << 6) | enc[3];
        
                    decoded = decoded + String.fromCharCode(c[0]);
                    if (enc[2] != 64) {
                        decoded = decoded + String.fromCharCode(c[1]);
                    } 
                    if (enc[3] != 64) {
                        decoded = decoded + String.fromCharCode(c[2]);
                    }
                }
        
                decoded = Utf8.decode(decoded);
        
                return decoded;
        
            }
        };
    };
})();
