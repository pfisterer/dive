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
/* BlobBuilder.js
 * A BlobBuilder implementation.
 * 2011-07-13
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self, unescape */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/BlobBuilder.js/blob/master/BlobBuilder.js */

var BlobBuilder = BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || (function(view) {
"use strict";
var
	  get_class = function(object) {
		return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
	}
	, FakeBlobBuilder = function(){
		this.data = [];
	}
	, FakeBlob = function(data, type, encoding) {
		this.data = data;
		this.size = data.length;
		this.type = type;
		this.encoding = encoding;
	}
	, FBB_proto = FakeBlobBuilder.prototype
	, FB_proto = FakeBlob.prototype
	, FileReaderSync = view.FileReaderSync
	, FileException = function(type) {
		this.code = this[this.name = type];
	}
	, file_ex_codes = (
		  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
		+ "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
	).split(" ")
	, file_ex_code = file_ex_codes.length
	, realURL = view.URL || view.webkitURL || view
	, real_create_object_URL = realURL.createObjectURL
	, real_revoke_object_URL = realURL.revokeObjectURL
	, URL = realURL
	, btoa = view.btoa
	, atob = view.atob
	, can_apply_typed_arrays = false
	, can_apply_typed_arrays_test = function(pass) {
		can_apply_typed_arrays = !pass;
	}

	, ArrayBuffer = view.ArrayBuffer
	, Uint8Array = view.Uint8Array
;
FakeBlobBuilder.fake = FB_proto.fake = true;
while (file_ex_code--) {
	FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
}
try {
	if (Uint8Array) {
		can_apply_typed_arrays_test.apply(0, new Uint8Array(1));
	}
} catch (ex) {}
if (!realURL.createObjectURL) {
	URL = view.URL = {};
}
URL.createObjectURL = function(blob) {
	var
		  type = blob.type
		, data_URI_header
	;
	if (type === null) {
		type = "application/octet-stream";
	}
	if (blob instanceof FakeBlob) {
		data_URI_header = "data:" + type;
		if (blob.encoding === "base64") {
			return data_URI_header + ";base64," + blob.data;
		} else if (blob.encoding === "URI") {
			return data_URI_header + "," + decodeURIComponent(blob.data);
		} if (btoa) {
			return data_URI_header + ";base64," + btoa(blob.data);
		} else {
			return data_URI_header + "," + encodeURIComponent(blob.data);
		}
	} else if (real_create_object_url) {
		return real_create_object_url.call(realURL, blob);
	}
};
URL.revokeObjectURL = function(object_url) {
	if (object_url.substring(0, 5) !== "data:" && real_revoke_object_url) {
		real_revoke_object_url.call(realURL, object_url);
	}
};
FBB_proto.append = function(data/*, endings*/) {
	var bb = this.data;
	// decode data to a binary string
	if (Uint8Array && data instanceof ArrayBuffer) {
		if (can_apply_typed_arrays) {
			bb.push(String.fromCharCode.apply(String, new Uint8Array(data)));
		} else {
			var
				  str = ""
				, buf = new Uint8Array(data)
				, i = 0
				, buf_len = buf.length
			;
			for (; i < buf_len; i++) {
				str += String.fromCharCode(buf[i]);
			}
		}
	} else if (get_class(data) === "Blob" || get_class(data) === "File") {
		if (FileReaderSync) {
			var fr = new FileReaderSync;
			bb.push(fr.readAsBinaryString(data));
		} else {
			// async FileReader won't work as BlobBuilder is sync
			throw new FileException("NOT_READABLE_ERR");
		}
	} else if (data instanceof FakeBlob) {
		if (data.encoding === "base64" && atob) {
			bb.push(atob(data.data));
		} else if (data.encoding === "URI") {
			bb.push(decodeURIComponent(data.data));
		} else if (data.encoding === "raw") {
			bb.push(data.data);
		}
	} else {
		if (typeof data !== "string") {
			data += ""; // convert unsupported types to strings
		}
		// decode UTF-16 to binary string
		bb.push(unescape(encodeURIComponent(data)));
	}
};
FBB_proto.getBlob = function(type) {
	if (!arguments.length) {
		type = null;
	}
	return new FakeBlob(this.data.join(""), type, "raw");
};
FBB_proto.toString = function() {
	return "[object BlobBuilder]";
};
FB_proto.slice = function(start, end, type) {
	var args = arguments.length;
	if (args < 3) {
		type = null;
	}
	return new FakeBlob(
		  this.data.slice(start, args > 1 ? end : this.data.length)
		, type
		, this.encoding
	);
};
FB_proto.toString = function() {
	return "[object Blob]";
};
return FakeBlobBuilder;
}(self));