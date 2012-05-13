/*
 * Copyright (c) 2012, Dennis Pfisterer, University of Luebeck
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 * following conditions are met:
 *
 * 	- Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 * 	  disclaimer.
 * 	- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 * 	  following disclaimer in the documentation and/or other materials provided with the distribution.
 * 	- Neither the name of the University of Luebeck nor the names of its contributors may be used to endorse or promote
 * 	  products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*
CryptoJS v3.0
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(q,i){var f={},l=f.lib={},r=l.Base=function(){function a(){}return{extend:function(d){a.prototype=this;var b=new a;d&&b.mixIn(d);b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),n=l.WordArray=r.extend({init:function(a,d){a=
this.words=a||[];this.sigBytes=d!=i?d:4*a.length},toString:function(a){return(a||s).stringify(this)},concat:function(a){var d=this.words,b=a.words,c=this.sigBytes,a=a.sigBytes;this.clamp();if(c%4)for(var g=0;g<a;g++)d[c+g>>>2]|=(b[g>>>2]>>>24-8*(g%4)&255)<<24-8*((c+g)%4);else d.push.apply(d,b);this.sigBytes+=a;return this},clamp:function(){var a=this.words,d=this.sigBytes;a[d>>>2]&=4294967295<<32-8*(d%4);a.length=q.ceil(d/4)},clone:function(){var a=r.clone.call(this);a.words=this.words.slice(0);return a},
random:function(a){for(var d=[],b=0;b<a;b+=4)d.push(4294967296*q.random()|0);return n.create(d,a)}}),m=f.enc={},s=m.Hex={stringify:function(a){for(var d=a.words,a=a.sigBytes,b=[],c=0;c<a;c++){var g=d[c>>>2]>>>24-8*(c%4)&255;b.push((g>>>4).toString(16));b.push((g&15).toString(16))}return b.join("")},parse:function(a){for(var d=a.length,b=[],c=0;c<d;c+=2)b[c>>>3]|=parseInt(a.substr(c,2),16)<<24-4*(c%8);return n.create(b,d/2)}},o=m.Latin1={stringify:function(a){for(var d=a.words,a=a.sigBytes,b=[],c=
0;c<a;c++)b.push(String.fromCharCode(d[c>>>2]>>>24-8*(c%4)&255));return b.join("")},parse:function(a){for(var d=a.length,b=[],c=0;c<d;c++)b[c>>>2]|=(a.charCodeAt(c)&255)<<24-8*(c%4);return n.create(b,d)}},p=m.Utf8={stringify:function(a){try{return decodeURIComponent(escape(o.stringify(a)))}catch(d){throw Error("Malformed UTF-8 data");}},parse:function(a){return o.parse(unescape(encodeURIComponent(a)))}},e=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=n.create();this._nDataBytes=0},
_append:function(a){"string"==typeof a&&(a=p.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var d=this._data,b=d.words,c=d.sigBytes,g=this.blockSize,k=c/(4*g),k=a?q.ceil(k):q.max((k|0)-this._minBufferSize,0),a=k*g,c=q.min(4*a,c);if(a){for(var j=0;j<a;j+=g)this._doProcessBlock(b,j);j=b.splice(0,a);d.sigBytes-=c}return n.create(j,c)},clone:function(){var a=r.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=e.extend({init:function(){this.reset()},
reset:function(){e.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=e.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(d,b){return a.create(b).finalize(d)}},_createHmacHelper:function(a){return function(d,b){return h.HMAC.create(a,b).finalize(d)}}});var h=f.algo={};return f}(Math);
(function(){var q=CryptoJS,i=q.lib.WordArray;q.enc.Base64={stringify:function(f){var l=f.words,i=f.sigBytes,n=this._map;f.clamp();for(var f=[],m=0;m<i;m+=3)for(var s=(l[m>>>2]>>>24-8*(m%4)&255)<<16|(l[m+1>>>2]>>>24-8*((m+1)%4)&255)<<8|l[m+2>>>2]>>>24-8*((m+2)%4)&255,o=0;4>o&&m+0.75*o<i;o++)f.push(n.charAt(s>>>6*(3-o)&63));if(l=n.charAt(64))for(;f.length%4;)f.push(l);return f.join("")},parse:function(f){var l=f.length,r=this._map,n=r.charAt(64);n&&(n=f.indexOf(n),-1!=n&&(l=n));for(var n=[],m=0,s=0;s<
l;s++)if(s%4){var o=r.indexOf(f.charAt(s-1))<<2*(s%4),p=r.indexOf(f.charAt(s))>>>6-2*(s%4);n[m>>>2]|=(o|p)<<24-8*(m%4);m++}return i.create(n,m)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(q){function i(e,h,a,d,b,c,g){e=e+(h&a|~h&d)+b+g;return(e<<c|e>>>32-c)+h}function f(e,h,a,d,b,c,g){e=e+(h&d|a&~d)+b+g;return(e<<c|e>>>32-c)+h}function l(e,h,a,d,b,c,g){e=e+(h^a^d)+b+g;return(e<<c|e>>>32-c)+h}function r(e,h,a,d,b,c,g){e=e+(a^(h|~d))+b+g;return(e<<c|e>>>32-c)+h}var n=CryptoJS,m=n.lib,s=m.WordArray,m=m.Hasher,o=n.algo,p=[];(function(){for(var e=0;64>e;e++)p[e]=4294967296*q.abs(q.sin(e+1))|0})();o=o.MD5=m.extend({_doReset:function(){this._hash=s.create([1732584193,4023233417,
2562383102,271733878])},_doProcessBlock:function(e,h){for(var a=0;16>a;a++){var d=h+a,b=e[d];e[d]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360}for(var d=this._hash.words,b=d[0],c=d[1],g=d[2],k=d[3],a=0;64>a;a+=4)16>a?(b=i(b,c,g,k,e[h+a],7,p[a]),k=i(k,b,c,g,e[h+a+1],12,p[a+1]),g=i(g,k,b,c,e[h+a+2],17,p[a+2]),c=i(c,g,k,b,e[h+a+3],22,p[a+3])):32>a?(b=f(b,c,g,k,e[h+(a+1)%16],5,p[a]),k=f(k,b,c,g,e[h+(a+6)%16],9,p[a+1]),g=f(g,k,b,c,e[h+(a+11)%16],14,p[a+2]),c=f(c,g,k,b,e[h+a%16],20,p[a+3])):48>a?(b=
l(b,c,g,k,e[h+(3*a+5)%16],4,p[a]),k=l(k,b,c,g,e[h+(3*a+8)%16],11,p[a+1]),g=l(g,k,b,c,e[h+(3*a+11)%16],16,p[a+2]),c=l(c,g,k,b,e[h+(3*a+14)%16],23,p[a+3])):(b=r(b,c,g,k,e[h+3*a%16],6,p[a]),k=r(k,b,c,g,e[h+(3*a+7)%16],10,p[a+1]),g=r(g,k,b,c,e[h+(3*a+14)%16],15,p[a+2]),c=r(c,g,k,b,e[h+(3*a+5)%16],21,p[a+3]));d[0]=d[0]+b|0;d[1]=d[1]+c|0;d[2]=d[2]+g|0;d[3]=d[3]+k|0},_doFinalize:function(){var e=this._data,h=e.words,a=8*this._nDataBytes,d=8*e.sigBytes;h[d>>>5]|=128<<24-d%32;h[(d+64>>>9<<4)+14]=(a<<8|a>>>
24)&16711935|(a<<24|a>>>8)&4278255360;e.sigBytes=4*(h.length+1);this._process();e=this._hash.words;for(h=0;4>h;h++)a=e[h],e[h]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360}});n.MD5=m._createHelper(o);n.HmacMD5=m._createHmacHelper(o)})(Math);
(function(){var q=CryptoJS,i=q.lib,f=i.Base,l=i.WordArray,i=q.algo,r=i.EvpKDF=f.extend({cfg:f.extend({keySize:4,hasher:i.MD5,iterations:1}),init:function(f){this.cfg=this.cfg.extend(f)},compute:function(f,m){for(var i=this.cfg,o=i.hasher.create(),p=l.create(),e=p.words,h=i.keySize,i=i.iterations;e.length<h;){a&&o.update(a);var a=o.update(f).finalize(m);o.reset();for(var d=1;d<i;d++)a=o.finalize(a),o.reset();p.concat(a)}p.sigBytes=4*h;return p}});q.EvpKDF=function(f,l,i){return r.create(i).compute(f,
l)}})();
CryptoJS.lib.Cipher||function(q){var i=CryptoJS,f=i.lib,l=f.Base,r=f.WordArray,n=f.BufferedBlockAlgorithm,m=i.enc.Base64,s=i.algo.EvpKDF,o=f.Cipher=n.extend({cfg:l.extend(),createEncryptor:function(c,a){return this.create(this._ENC_XFORM_MODE,c,a)},createDecryptor:function(c,a){return this.create(this._DEC_XFORM_MODE,c,a)},init:function(c,a,b){this.cfg=this.cfg.extend(b);this._xformMode=c;this._key=a;this.reset()},reset:function(){n.reset.call(this);this._doReset()},process:function(c){this._append(c);return this._process()},
finalize:function(c){c&&this._append(c);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){return function(c){return{encrypt:function(a,k,j){return("string"==typeof k?b:d).encrypt(c,a,k,j)},decrypt:function(a,k,j){return("string"==typeof k?b:d).decrypt(c,a,k,j)}}}}()});f.StreamCipher=o.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var p=i.mode={},e=f.BlockCipherMode=l.extend({createEncryptor:function(c,a){return this.Encryptor.create(c,
a)},createDecryptor:function(c,a){return this.Decryptor.create(c,a)},init:function(c,a){this._cipher=c;this._iv=a}}),p=p.CBC=function(){function c(c,a,g){var b=this._iv;b?this._iv=q:b=this._prevBlock;for(var d=0;d<g;d++)c[a+d]^=b[d]}var a=e.extend();a.Encryptor=a.extend({processBlock:function(a,g){var b=this._cipher,d=b.blockSize;c.call(this,a,g,d);b.encryptBlock(a,g);this._prevBlock=a.slice(g,g+d)}});a.Decryptor=a.extend({processBlock:function(a,g){var b=this._cipher,d=b.blockSize,e=a.slice(g,g+
d);b.decryptBlock(a,g);c.call(this,a,g,d);this._prevBlock=e}});return a}(),h=(i.pad={}).Pkcs7={pad:function(c,a){for(var b=4*a,b=b-c.sigBytes%b,d=b<<24|b<<16|b<<8|b,e=[],h=0;h<b;h+=4)e.push(d);b=r.create(e,b);c.concat(b)},unpad:function(c){c.sigBytes-=c.words[c.sigBytes-1>>>2]&255}};f.BlockCipher=o.extend({cfg:o.cfg.extend({mode:p,padding:h}),reset:function(){o.reset.call(this);var c=this.cfg,a=c.iv,c=c.mode;if(this._xformMode==this._ENC_XFORM_MODE)var b=c.createEncryptor;else b=c.createDecryptor,
this._minBufferSize=1;this._mode=b.call(c,this,a&&a.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var a=f.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),p=(i.format={}).OpenSSL={stringify:function(a){var b=
a.ciphertext,a=a.salt;return(a?r.create([1398893684,1701076831]).concat(a).concat(b):b).toString(m)},parse:function(c){var c=m.parse(c),b=c.words;if(1398893684==b[0]&&1701076831==b[1]){var d=r.create(b.slice(2,4));b.splice(0,4);c.sigBytes-=16}return a.create({ciphertext:c,salt:d})}},d=f.SerializableCipher=l.extend({cfg:l.extend({format:p}),encrypt:function(c,b,d,j){var j=this.cfg.extend(j),e=c.createEncryptor(d,j),b=e.finalize(b),e=e.cfg;return a.create({ciphertext:b,key:d,iv:e.iv,algorithm:c,mode:e.mode,
padding:e.padding,blockSize:c.blockSize,formatter:j.format})},decrypt:function(a,b,d,e){e=this.cfg.extend(e);b=this._parse(b,e.format);return a.createDecryptor(d,e).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),i=(i.kdf={}).OpenSSL={execute:function(c,b,d,e){e||(e=r.random(8));c=s.create({keySize:b+d}).compute(c,e);d=r.create(c.words.slice(b),4*d);c.sigBytes=4*b;return a.create({key:c,iv:d,salt:e})}},b=f.PasswordBasedCipher=d.extend({cfg:d.cfg.extend({kdf:i}),
encrypt:function(a,b,e,j){j=this.cfg.extend(j);e=j.kdf.execute(e,a.keySize,a.ivSize);j.iv=e.iv;a=d.encrypt.call(this,a,b,e.key,j);a.mixIn(e);return a},decrypt:function(a,b,e,j){j=this.cfg.extend(j);b=this._parse(b,j.format);e=j.kdf.execute(e,a.keySize,a.ivSize,b.salt);j.iv=e.iv;return d.decrypt.call(this,a,b,e.key,j)}})}();
(function(){var q=CryptoJS,i=q.lib.BlockCipher,f=q.algo,l=[],r=[],n=[],m=[],s=[],o=[],p=[],e=[],h=[],a=[];(function(){for(var b=[],c=0;256>c;c++)b[c]=128>c?c<<1:c<<1^283;for(var d=0,k=0,c=0;256>c;c++){var j=k^k<<1^k<<2^k<<3^k<<4,j=j>>>8^j&255^99;l[d]=j;r[j]=d;var f=b[d],i=b[f],q=b[i],t=257*b[j]^16843008*j;n[d]=t<<24|t>>>8;m[d]=t<<16|t>>>16;s[d]=t<<8|t>>>24;o[d]=t;t=16843009*q^65537*i^257*f^16843008*d;p[j]=t<<24|t>>>8;e[j]=t<<16|t>>>16;h[j]=t<<8|t>>>24;a[j]=t;d?(d=f^b[b[b[q^f]]],k^=b[b[k]]):d=k=1}})();
var d=[0,1,2,4,8,16,32,64,128,27,54],f=f.AES=i.extend({_doReset:function(){for(var b=this._key,c=b.words,g=b.sigBytes/4,b=4*((this._nRounds=g+6)+1),k=this._keySchedule=[],j=0;j<b;j++)if(j<g)k[j]=c[j];else{var f=k[j-1];j%g?6<g&&4==j%g&&(f=l[f>>>24]<<24|l[f>>>16&255]<<16|l[f>>>8&255]<<8|l[f&255]):(f=f<<8|f>>>24,f=l[f>>>24]<<24|l[f>>>16&255]<<16|l[f>>>8&255]<<8|l[f&255],f^=d[j/g|0]<<24);k[j]=k[j-g]^f}c=this._invKeySchedule=[];for(g=0;g<b;g++)j=b-g,f=g%4?k[j]:k[j-4],c[g]=4>g||4>=j?f:p[l[f>>>24]]^e[l[f>>>
16&255]]^h[l[f>>>8&255]]^a[l[f&255]]},encryptBlock:function(a,c){this._doCryptBlock(a,c,this._keySchedule,n,m,s,o,l)},decryptBlock:function(b,c){var d=b[c+1];b[c+1]=b[c+3];b[c+3]=d;this._doCryptBlock(b,c,this._invKeySchedule,p,e,h,a,r);d=b[c+1];b[c+1]=b[c+3];b[c+3]=d},_doCryptBlock:function(a,c,d,e,f,h,l,i){for(var p=this._nRounds,m=a[c]^d[0],n=a[c+1]^d[1],o=a[c+2]^d[2],q=a[c+3]^d[3],r=4,s=1;s<p;s++)var u=e[m>>>24]^f[n>>>16&255]^h[o>>>8&255]^l[q&255]^d[r++],v=e[n>>>24]^f[o>>>16&255]^h[q>>>8&255]^
l[m&255]^d[r++],w=e[o>>>24]^f[q>>>16&255]^h[m>>>8&255]^l[n&255]^d[r++],q=e[q>>>24]^f[m>>>16&255]^h[n>>>8&255]^l[o&255]^d[r++],m=u,n=v,o=w;u=(i[m>>>24]<<24|i[n>>>16&255]<<16|i[o>>>8&255]<<8|i[q&255])^d[r++];v=(i[n>>>24]<<24|i[o>>>16&255]<<16|i[q>>>8&255]<<8|i[m&255])^d[r++];w=(i[o>>>24]<<24|i[q>>>16&255]<<16|i[m>>>8&255]<<8|i[n&255])^d[r++];q=(i[q>>>24]<<24|i[m>>>16&255]<<16|i[n>>>8&255]<<8|i[o&255])^d[r++];a[c]=u;a[c+1]=v;a[c+2]=w;a[c+3]=q},keySize:8});q.AES=i._createHelper(f)})();
