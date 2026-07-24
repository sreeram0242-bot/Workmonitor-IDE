import { a as __exportAll, i as __esmMin, o as __require, r as __commonJSMin, s as __toCommonJS } from "../_ssr/async-local-storage-C5fJChCT.mjs";
import { t as require_dist } from "./sindresorhus__is.mjs";
import { t as require_source$3 } from "./@szmarczak/http-timer+[...].mjs";
//#region node_modules/ws/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BINARY_TYPES = [
		"nodebuffer",
		"arraybuffer",
		"fragments"
	];
	var hasBlob = typeof Blob !== "undefined";
	if (hasBlob) BINARY_TYPES.push("blob");
	module.exports = {
		BINARY_TYPES,
		CLOSE_TIMEOUT: 3e4,
		EMPTY_BUFFER: Buffer.alloc(0),
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		hasBlob,
		kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
		kListener: Symbol("kListener"),
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		NOOP: () => {}
	};
}));
//#endregion
//#region __vite-optional-peer-dep:bufferutil:ws
var __vite_optional_peer_dep_bufferutil_ws_exports = /* @__PURE__ */ __exportAll({ default: () => __vite_optional_peer_dep_bufferutil_ws_default });
var __vite_optional_peer_dep_bufferutil_ws_default;
var init___vite_optional_peer_dep_bufferutil_ws = __esmMin((() => {
	__vite_optional_peer_dep_bufferutil_ws_default = {};
	throw new Error(`Could not resolve "bufferutil" imported by "ws". Is it installed?`);
}));
//#endregion
//#region node_modules/ws/lib/buffer-util.js
var require_buffer_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EMPTY_BUFFER } = require_constants();
	var FastBuffer = Buffer[Symbol.species];
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return new FastBuffer(target.buffer, target.byteOffset, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		for (let i = 0; i < buffer.length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer(buf) {
		if (buf.length === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer(data) {
		toBuffer.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = new FastBuffer(data);
		else if (ArrayBuffer.isView(data)) buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer.readOnly = false;
		}
		return buf;
	}
	module.exports = {
		concat,
		mask: _mask,
		toArrayBuffer,
		toBuffer,
		unmask: _unmask
	};
	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) try {
		const bufferUtil = (init___vite_optional_peer_dep_bufferutil_ws(), __toCommonJS(__vite_optional_peer_dep_bufferutil_ws_exports));
		module.exports.mask = function(source, mask, output, offset, length) {
			if (length < 48) _mask(source, mask, output, offset, length);
			else bufferUtil.mask(source, mask, output, offset, length);
		};
		module.exports.unmask = function(buffer, mask) {
			if (buffer.length < 32) _unmask(buffer, mask);
			else bufferUtil.unmask(buffer, mask);
		};
	} catch (e) {}
}));
//#endregion
//#region node_modules/ws/lib/limiter.js
var require_limiter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var kDone = Symbol("kDone");
	var kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter;
}));
//#endregion
//#region node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var zlib$1 = __require("zlib");
	var bufferUtil = require_buffer_util();
	var Limiter = require_limiter();
	var { kStatusCode } = require_constants();
	var FastBuffer = Buffer[Symbol.species];
	var TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	var kPerMessageDeflate = Symbol("permessage-deflate");
	var kTotalLength = Symbol("total-length");
	var kCallback = Symbol("callback");
	var kBuffers = Symbol("buffers");
	var kError = Symbol("error");
	var zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [options.isServer=false] Create the instance in either
		*     server or client mode
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed if context takeover is disabled
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		*/
		constructor(options) {
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._maxPayload = this._options.maxPayload | 0;
			this._isServer = !!this._options.isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) zlibLimiter = new Limiter(this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10);
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(/* @__PURE__ */ new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib$1.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib$1.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data);
			});
		}
		/**
		* Compress data.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib$1.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib$1.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib$1.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data);
			});
		}
	};
	module.exports = PerMessageDeflate;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError] = /* @__PURE__ */ new RangeError("Max payload size exceeded");
		this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError][kStatusCode] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		if (this[kError]) {
			this[kCallback](this[kError]);
			return;
		}
		err[kStatusCode] = 1007;
		this[kCallback](err);
	}
}));
//#endregion
//#region __vite-optional-peer-dep:utf-8-validate:ws
var __vite_optional_peer_dep_utf_8_validate_ws_exports = /* @__PURE__ */ __exportAll({ default: () => __vite_optional_peer_dep_utf_8_validate_ws_default });
var __vite_optional_peer_dep_utf_8_validate_ws_default;
var init___vite_optional_peer_dep_utf_8_validate_ws = __esmMin((() => {
	__vite_optional_peer_dep_utf_8_validate_ws_default = {};
	throw new Error(`Could not resolve "utf-8-validate" imported by "ws". Is it installed?`);
}));
//#endregion
//#region node_modules/ws/lib/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUtf8 } = __require("buffer");
	var { hasBlob } = require_constants();
	var tokenChars = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	/**
	* Determines whether a value is a `Blob`.
	*
	* @param {*} value The value to be tested
	* @return {Boolean} `true` if `value` is a `Blob`, else `false`
	* @private
	*/
	function isBlob(value) {
		return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
	}
	module.exports = {
		isBlob,
		isValidStatusCode,
		isValidUTF8: _isValidUTF8,
		tokenChars
	};
	if (isUtf8) module.exports.isValidUTF8 = function(buf) {
		return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	};
	else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
		const isValidUTF8 = (init___vite_optional_peer_dep_utf_8_validate_ws(), __toCommonJS(__vite_optional_peer_dep_utf_8_validate_ws_exports));
		module.exports.isValidUTF8 = function(buf) {
			return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
		};
	} catch (e) {}
}));
//#endregion
//#region node_modules/ws/lib/receiver.js
var require_receiver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Writable: Writable$1 } = __require("stream");
	var PerMessageDeflate = require_permessage_deflate();
	var { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
	var { concat, toArrayBuffer, unmask } = require_buffer_util();
	var { isValidStatusCode, isValidUTF8 } = require_validation();
	var FastBuffer = Buffer[Symbol.species];
	var GET_INFO = 0;
	var GET_PAYLOAD_LENGTH_16 = 1;
	var GET_PAYLOAD_LENGTH_64 = 2;
	var GET_MASK = 3;
	var GET_DATA = 4;
	var INFLATING = 5;
	var DEFER_EVENT = 6;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver = class extends Writable$1 {
		/**
		* Creates a Receiver instance.
		*
		* @param {Object} [options] Options object
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {String} [options.binaryType=nodebuffer] The type for binary data
		* @param {Object} [options.extensions] An object containing the negotiated
		*     extensions
		* @param {Boolean} [options.isServer=false] Specifies whether to operate in
		*     client or server mode
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		*/
		constructor(options = {}) {
			super();
			this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
			this._binaryType = options.binaryType || BINARY_TYPES[0];
			this._extensions = options.extensions || {};
			this._isServer = !!options.isServer;
			this._maxBufferedChunks = options.maxBufferedChunks | 0;
			this._maxFragments = options.maxFragments | 0;
			this._maxPayload = options.maxPayload | 0;
			this._skipUTF8Validation = !!options.skipUTF8Validation;
			this[kWebSocket] = void 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._numFragments = 0;
			this._fragments = [];
			this._errored = false;
			this._loop = false;
			this._state = GET_INFO;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
				cb(this.createError(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				return new FastBuffer(buf.buffer, buf.byteOffset, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						this.getInfo(cb);
						break;
					case GET_PAYLOAD_LENGTH_16:
						this.getPayloadLength16(cb);
						break;
					case GET_PAYLOAD_LENGTH_64:
						this.getPayloadLength64(cb);
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						this.getData(cb);
						break;
					case INFLATING:
					case DEFER_EVENT:
						this._loop = false;
						return;
				}
			while (this._loop);
			if (!this._errored) cb();
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getInfo(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				cb(this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3"));
				return;
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
				cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
				return;
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (!this._fragmented) {
					cb(this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					cb(this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN"));
					return;
				}
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
					cb(this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"));
					return;
				}
			} else {
				cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
				return;
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					cb(this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK"));
					return;
				}
			} else if (this._masked) {
				cb(this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK"));
				return;
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength16(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength64(cb) {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				cb(this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"));
				return;
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			this.haveLength(cb);
		}
		/**
		* Payload length has been read.
		*
		* @param {Function} cb Callback
		* @private
		*/
		haveLength(cb) {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
					return;
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) unmask(data, this._mask);
			}
			if (this._opcode > 7) {
				this.controlMessage(data, cb);
				return;
			}
			if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
				cb(this.createError(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			this.dataMessage(cb);
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			this._extensions[PerMessageDeflate.extensionName].decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
						cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
						return;
					}
					this._fragments.push(buf);
				}
				this.dataMessage(cb);
				if (this._state === GET_INFO) this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @param {Function} cb Callback
		* @private
		*/
		dataMessage(cb) {
			if (!this._fin) {
				this._state = GET_INFO;
				return;
			}
			const messageLength = this._messageLength;
			const fragments = this._fragments;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragmented = 0;
			this._numFragments = 0;
			this._fragments = [];
			if (this._opcode === 2) {
				let data;
				if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
				else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
				else if (this._binaryType === "blob") data = new Blob(fragments);
				else data = fragments;
				if (this._allowSynchronousEvents) {
					this.emit("message", data, true);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", data, true);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			} else {
				const buf = concat(fragments, messageLength);
				if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
					cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
					return;
				}
				if (this._state === INFLATING || this._allowSynchronousEvents) {
					this.emit("message", buf, false);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", buf, false);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			}
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data, cb) {
			if (this._opcode === 8) {
				if (data.length === 0) {
					this._loop = false;
					this.emit("conclude", 1005, EMPTY_BUFFER);
					this.end();
				} else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode(code)) {
						cb(this.createError(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE"));
						return;
					}
					const buf = new FastBuffer(data.buffer, data.byteOffset + 2, data.length - 2);
					if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
						cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
						return;
					}
					this._loop = false;
					this.emit("conclude", code, buf);
					this.end();
				}
				this._state = GET_INFO;
				return;
			}
			if (this._allowSynchronousEvents) {
				this.emit(this._opcode === 9 ? "ping" : "pong", data);
				this._state = GET_INFO;
			} else {
				this._state = DEFER_EVENT;
				setImmediate(() => {
					this.emit(this._opcode === 9 ? "ping" : "pong", data);
					this._state = GET_INFO;
					this.startLoop(cb);
				});
			}
		}
		/**
		* Builds an error object.
		*
		* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
		* @param {String} message The error message
		* @param {Boolean} prefix Specifies whether or not to add a default prefix to
		*     `message`
		* @param {Number} statusCode The status code
		* @param {String} errorCode The exposed error code
		* @return {(Error|RangeError)} The error
		* @private
		*/
		createError(ErrorCtor, message, prefix, statusCode, errorCode) {
			this._loop = false;
			this._errored = true;
			const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
			Error.captureStackTrace(err, this.createError);
			err.code = errorCode;
			err[kStatusCode] = statusCode;
			return err;
		}
	};
	module.exports = Receiver;
}));
//#endregion
//#region node_modules/ws/lib/sender.js
var require_sender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Duplex: Duplex$3 } = __require("stream");
	var { randomFillSync } = __require("crypto");
	var { types: { isUint8Array } } = __require("util");
	var PerMessageDeflate = require_permessage_deflate();
	var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
	var { isBlob, isValidStatusCode } = require_validation();
	var { mask: applyMask, toBuffer } = require_buffer_util();
	var kByteLength = Symbol("kByteLength");
	var maskBuffer = Buffer.alloc(4);
	var RANDOM_POOL_SIZE = 8 * 1024;
	var randomPool;
	var randomPoolPointer = RANDOM_POOL_SIZE;
	var DEFAULT = 0;
	var DEFLATING = 1;
	var GET_BLOB_DATA = 2;
	module.exports = class Sender {
		/**
		* Creates a Sender instance.
		*
		* @param {Duplex} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Function} [generateMask] The function used to generate the masking
		*     key
		*/
		constructor(socket, extensions, generateMask) {
			this._extensions = extensions || {};
			if (generateMask) {
				this._generateMask = generateMask;
				this._maskBuffer = Buffer.alloc(4);
			}
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._queue = [];
			this._state = DEFAULT;
			this.onerror = NOOP;
			this[kWebSocket] = void 0;
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {(Buffer|String)} data The data to frame
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {(Buffer|String)[]} The framed data
		* @public
		*/
		static frame(data, options) {
			let mask;
			let merge = false;
			let offset = 2;
			let skipMasking = false;
			if (options.mask) {
				mask = options.maskBuffer || maskBuffer;
				if (options.generateMask) options.generateMask(mask);
				else {
					if (randomPoolPointer === RANDOM_POOL_SIZE) {
						/* istanbul ignore else  */
						if (randomPool === void 0) randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
						randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
						randomPoolPointer = 0;
					}
					mask[0] = randomPool[randomPoolPointer++];
					mask[1] = randomPool[randomPoolPointer++];
					mask[2] = randomPool[randomPoolPointer++];
					mask[3] = randomPool[randomPoolPointer++];
				}
				skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
				offset = 6;
			}
			let dataLength;
			if (typeof data === "string") if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) dataLength = options[kByteLength];
			else {
				data = Buffer.from(data);
				dataLength = data.length;
			}
			else {
				dataLength = data.length;
				merge = options.mask && options.readOnly && !skipMasking;
			}
			let payloadLength = dataLength;
			if (dataLength >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (dataLength > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(dataLength, 2);
			else if (payloadLength === 127) {
				target[2] = target[3] = 0;
				target.writeUIntBE(dataLength, 4, 6);
			}
			if (!options.mask) return [target, data];
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (skipMasking) return [target, data];
			if (merge) {
				applyMask(data, mask, target, offset, dataLength);
				return [target];
			}
			applyMask(data, mask, data, 0, dataLength);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {(String|Buffer)} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || !data.length) {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				if (typeof data === "string") buf.write(data, 2);
				else if (isUint8Array(data)) buf.set(data, 2);
				else throw new TypeError("Second argument must be a string or a Uint8Array");
			}
			const options = {
				[kByteLength]: buf.length,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 8,
				readOnly: false,
				rsv1: false
			};
			if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				buf,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(buf, options), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 9,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				false,
				options,
				cb
			]);
			else this.getBlobData(data, false, options, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 10,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				false,
				options,
				cb
			]);
			else this.getBlobData(data, false, options, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) rsv1 = byteLength >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			const opts = {
				[kByteLength]: byteLength,
				fin: options.fin,
				generateMask: this._generateMask,
				mask: options.mask,
				maskBuffer: this._maskBuffer,
				opcode,
				readOnly,
				rsv1
			};
			if (isBlob(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.getBlobData(data, this._compress, opts, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.dispatch(data, this._compress, opts, cb);
		}
		/**
		* Gets the contents of a blob as binary data.
		*
		* @param {Blob} blob The blob
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     the data
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		getBlobData(blob, compress, options, cb) {
			this._bufferedBytes += options[kByteLength];
			this._state = GET_BLOB_DATA;
			blob.arrayBuffer().then((arrayBuffer) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while the blob was being read");
					process.nextTick(callCallbacks, this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				const data = toBuffer(arrayBuffer);
				if (!compress) {
					this._state = DEFAULT;
					this.sendFrame(Sender.frame(data, options), cb);
					this.dequeue();
				} else this.dispatch(data, compress, options, cb);
			}).catch((err) => {
				process.nextTick(onError, this, err, cb);
			});
		}
		/**
		* Dispatches a message.
		*
		* @param {(Buffer|String)} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			this._bufferedBytes += options[kByteLength];
			this._state = DEFLATING;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while data was being compressed");
					callCallbacks(this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				this._state = DEFAULT;
				options.readOnly = false;
				this.sendFrame(Sender.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (this._state === DEFAULT && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[3][kByteLength];
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[3][kByteLength];
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {(Buffer | String)[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
	/**
	* Calls queued callbacks with an error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error to call the callbacks with
	* @param {Function} [cb] The first callback
	* @private
	*/
	function callCallbacks(sender, err, cb) {
		if (typeof cb === "function") cb(err);
		for (let i = 0; i < sender._queue.length; i++) {
			const params = sender._queue[i];
			const callback = params[params.length - 1];
			if (typeof callback === "function") callback(err);
		}
	}
	/**
	* Handles a `Sender` error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error
	* @param {Function} [cb] The first pending callback
	* @private
	*/
	function onError(sender, err, cb) {
		callCallbacks(sender, err, cb);
		sender.onerror(err);
	}
}));
//#endregion
//#region node_modules/ws/lib/event-target.js
var require_event_target = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { kForOnEventAttribute, kListener } = require_constants();
	var kCode = Symbol("kCode");
	var kData = Symbol("kData");
	var kError = Symbol("kError");
	var kMessage = Symbol("kMessage");
	var kReason = Symbol("kReason");
	var kTarget = Symbol("kTarget");
	var kType = Symbol("kType");
	var kWasClean = Symbol("kWasClean");
	/**
	* Class representing an event.
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @throws {TypeError} If the `type` argument is not specified
		*/
		constructor(type) {
			this[kTarget] = null;
			this[kType] = type;
		}
		/**
		* @type {*}
		*/
		get target() {
			return this[kTarget];
		}
		/**
		* @type {String}
		*/
		get type() {
			return this[kType];
		}
	};
	Object.defineProperty(Event.prototype, "target", { enumerable: true });
	Object.defineProperty(Event.prototype, "type", { enumerable: true });
	/**
	* Class representing a close event.
	*
	* @extends Event
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {Number} [options.code=0] The status code explaining why the
		*     connection was closed
		* @param {String} [options.reason=''] A human-readable string explaining why
		*     the connection was closed
		* @param {Boolean} [options.wasClean=false] Indicates whether or not the
		*     connection was cleanly closed
		*/
		constructor(type, options = {}) {
			super(type);
			this[kCode] = options.code === void 0 ? 0 : options.code;
			this[kReason] = options.reason === void 0 ? "" : options.reason;
			this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
		}
		/**
		* @type {Number}
		*/
		get code() {
			return this[kCode];
		}
		/**
		* @type {String}
		*/
		get reason() {
			return this[kReason];
		}
		/**
		* @type {Boolean}
		*/
		get wasClean() {
			return this[kWasClean];
		}
	};
	Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
	/**
	* Class representing an error event.
	*
	* @extends Event
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.error=null] The error that generated this event
		* @param {String} [options.message=''] The error message
		*/
		constructor(type, options = {}) {
			super(type);
			this[kError] = options.error === void 0 ? null : options.error;
			this[kMessage] = options.message === void 0 ? "" : options.message;
		}
		/**
		* @type {*}
		*/
		get error() {
			return this[kError];
		}
		/**
		* @type {String}
		*/
		get message() {
			return this[kMessage];
		}
	};
	Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
	/**
	* Class representing a message event.
	*
	* @extends Event
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.data=null] The message content
		*/
		constructor(type, options = {}) {
			super(type);
			this[kData] = options.data === void 0 ? null : options.data;
		}
		/**
		* @type {*}
		*/
		get data() {
			return this[kData];
		}
	};
	Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
	module.exports = {
		CloseEvent,
		ErrorEvent,
		Event,
		EventTarget: {
			/**
			* Register an event listener.
			*
			* @param {String} type A string representing the event type to listen for
			* @param {(Function|Object)} handler The listener to add
			* @param {Object} [options] An options object specifies characteristics about
			*     the event listener
			* @param {Boolean} [options.once=false] A `Boolean` indicating that the
			*     listener should be invoked at most once after being added. If `true`,
			*     the listener would be automatically removed when invoked.
			* @public
			*/
			addEventListener(type, handler, options = {}) {
				for (const listener of this.listeners(type)) if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) return;
				let wrapper;
				if (type === "message") wrapper = function onMessage(data, isBinary) {
					const event = new MessageEvent("message", { data: isBinary ? data : data.toString() });
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "close") wrapper = function onClose(code, message) {
					const event = new CloseEvent("close", {
						code,
						reason: message.toString(),
						wasClean: this._closeFrameReceived && this._closeFrameSent
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "error") wrapper = function onError(error) {
					const event = new ErrorEvent("error", {
						error,
						message: error.message
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "open") wrapper = function onOpen() {
					const event = new Event("open");
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else return;
				wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
				wrapper[kListener] = handler;
				if (options.once) this.once(type, wrapper);
				else this.on(type, wrapper);
			},
			/**
			* Remove an event listener.
			*
			* @param {String} type A string representing the event type to remove
			* @param {(Function|Object)} handler The listener to remove
			* @public
			*/
			removeEventListener(type, handler) {
				for (const listener of this.listeners(type)) if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
					this.removeListener(type, listener);
					break;
				}
			}
		},
		MessageEvent
	};
	/**
	* Call an event listener
	*
	* @param {(Function|Object)} listener The listener to call
	* @param {*} thisArg The value to use as `this`` when calling the listener
	* @param {Event} event The event to pass to the listener
	* @private
	*/
	function callListener(listener, thisArg, event) {
		if (typeof listener === "object" && listener.handleEvent) listener.handleEvent.call(listener, event);
		else listener.call(thisArg, event);
	}
}));
//#endregion
//#region node_modules/ws/lib/extension.js
var require_extension = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { tokenChars } = require_validation();
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse(header) {
		const offers = Object.create(null);
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let code = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			code = header.charCodeAt(i);
			if (extensionName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const name = header.slice(start, end);
				if (code === 44) {
					push(offers, name, params);
					params = Object.create(null);
				} else extensionName = name;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (paramName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				push(params, header.slice(start, end), true);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				start = end = -1;
			} else if (code === 61 && start !== -1 && end === -1) {
				paramName = header.slice(start, i);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (isEscaping) {
				if (tokenChars[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) if (tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 34 && start !== -1) {
				inQuotes = false;
				end = i;
			} else if (code === 92) isEscaping = true;
			else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes || code === 32 || code === 9) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format(extensions) {
		return Object.keys(extensions).map((extension) => {
			let configurations = extensions[extension];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format,
		parse
	};
}));
//#endregion
//#region node_modules/ws/lib/websocket.js
var require_websocket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$4 = __require("events");
	var https$2 = __require("https");
	var http$3 = __require("http");
	var net$2 = __require("net");
	var tls$2 = __require("tls");
	var { randomBytes, createHash: createHash$1 } = __require("crypto");
	var { Duplex: Duplex$2, Readable: Readable$2 } = __require("stream");
	var { URL: URL$1 } = __require("url");
	var PerMessageDeflate = require_permessage_deflate();
	var Receiver = require_receiver();
	var Sender = require_sender();
	var { isBlob } = require_validation();
	var { BINARY_TYPES, CLOSE_TIMEOUT, EMPTY_BUFFER, GUID, kForOnEventAttribute, kListener, kStatusCode, kWebSocket, NOOP } = require_constants();
	var { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
	var { format, parse } = require_extension();
	var { toBuffer } = require_buffer_util();
	var kAborted = Symbol("kAborted");
	var protocolVersions = [8, 13];
	var readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket = class WebSocket extends EventEmitter$4 {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = EMPTY_BUFFER;
			this._closeTimer = null;
			this._errorEmitted = false;
			this._extensions = {};
			this._paused = false;
			this._protocol = "";
			this._readyState = WebSocket.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (protocols === void 0) protocols = [];
				else if (!Array.isArray(protocols)) if (typeof protocols === "object" && protocols !== null) {
					options = protocols;
					protocols = [];
				} else protocols = [protocols];
				initAsClient(this, address, protocols, options);
			} else {
				this._autoPong = options.autoPong;
				this._closeTimeout = options.closeTimeout;
				this._isServer = true;
			}
		}
		/**
		* For historical reasons, the custom "nodebuffer" type is used by the default
		* instead of "blob".
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Boolean}
		*/
		get isPaused() {
			return this._paused;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {
			return null;
		}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Object} options Options object
		* @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message size
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @private
		*/
		setSocket(socket, head, options) {
			const receiver = new Receiver({
				allowSynchronousEvents: options.allowSynchronousEvents,
				binaryType: this.binaryType,
				extensions: this._extensions,
				isServer: this._isServer,
				maxBufferedChunks: options.maxBufferedChunks,
				maxFragments: options.maxFragments,
				maxPayload: options.maxPayload,
				skipUTF8Validation: options.skipUTF8Validation
			});
			const sender = new Sender(socket, this._extensions, options.generateMask);
			this._receiver = receiver;
			this._sender = sender;
			this._socket = socket;
			receiver[kWebSocket] = this;
			sender[kWebSocket] = this;
			socket[kWebSocket] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			sender.onerror = senderOnError;
			if (socket.setTimeout) socket.setTimeout(0);
			if (socket.setNoDelay) socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError);
			this._readyState = WebSocket.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate.extensionName]) this._extensions[PerMessageDeflate.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {(String|Buffer)} [data] The reason why the connection is
		*     closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this.readyState === WebSocket.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._readyState = WebSocket.CLOSING;
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			setCloseTimer(this);
		}
		/**
		* Pause the socket.
		*
		* @public
		*/
		pause() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = true;
			this._socket.pause();
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Resume the socket.
		*
		* @public
		*/
		resume() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = false;
			if (!this._receiver._writableState.needDrain) this._socket.resume();
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this._socket) {
				this._readyState = WebSocket.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"isPaused",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket.prototype, `on${method}`, {
			enumerable: true,
			get() {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) return listener[kListener];
				return null;
			},
			set(handler) {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) {
					this.removeListener(method, listener);
					break;
				}
				if (typeof handler !== "function") return;
				this.addEventListener(method, handler, { [kForOnEventAttribute]: true });
			}
		});
	});
	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {Array} protocols The subprotocols
	* @param {Object} [options] Connection options
	* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	*     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	*     times in the same tick
	* @param {Boolean} [options.autoPong=true] Specifies whether or not to
	*     automatically send a pong in response to a ping
	* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
	*     for the closing handshake to finish after `websocket.close()` is called
	* @param {Function} [options.finishRequest] A function which can be used to
	*     customize the headers of each http request before it is sent
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Function} [options.generateMask] The function used to generate the
	*     masking key
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
	*     buffered data chunks
	* @param {Number} [options.maxFragments=16384] The maximum number of message
	*     fragments
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	*     not to skip UTF-8 validation for text and close messages
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			allowSynchronousEvents: true,
			autoPong: true,
			closeTimeout: CLOSE_TIMEOUT,
			protocolVersion: protocolVersions[1],
			maxBufferedChunks: 256 * 1024,
			maxFragments: 16 * 1024,
			maxPayload: 100 * 1024 * 1024,
			skipUTF8Validation: false,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			timeout: void 0,
			method: "GET",
			host: void 0,
			path: void 0,
			port: void 0
		};
		websocket._autoPong = opts.autoPong;
		websocket._closeTimeout = opts.closeTimeout;
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL$1) parsedUrl = address;
		else try {
			parsedUrl = new URL$1(address);
		} catch {
			throw new SyntaxError(`Invalid URL: ${address}`);
		}
		if (parsedUrl.protocol === "http:") parsedUrl.protocol = "ws:";
		else if (parsedUrl.protocol === "https:") parsedUrl.protocol = "wss:";
		websocket._url = parsedUrl.href;
		const isSecure = parsedUrl.protocol === "wss:";
		const isIpcUrl = parsedUrl.protocol === "ws+unix:";
		let invalidUrlMessage;
		if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) invalidUrlMessage = "The URL's protocol must be one of \"ws:\", \"wss:\", \"http:\", \"https:\", or \"ws+unix:\"";
		else if (isIpcUrl && !parsedUrl.pathname) invalidUrlMessage = "The URL's pathname is empty";
		else if (parsedUrl.hash) invalidUrlMessage = "The URL contains a fragment identifier";
		if (invalidUrlMessage) {
			const err = new SyntaxError(invalidUrlMessage);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const request = isSecure ? https$2.request : http$3.request;
		const protocolSet = /* @__PURE__ */ new Set();
		let perMessageDeflate;
		opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			...opts.headers,
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket"
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate({
				...opts.perMessageDeflate,
				isServer: false,
				maxPayload: opts.maxPayload
			});
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols.length) {
			for (const protocol of protocols) {
				if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
				protocolSet.add(protocol);
			}
			opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
		}
		if (opts.origin) if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
		else opts.headers.Origin = opts.origin;
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isIpcUrl) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		let req;
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalIpc = isIpcUrl;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key, value] of Object.entries(headers)) options.headers[key.toLowerCase()] = value;
			} else if (websocket.listenerCount("redirect") === 0) {
				const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
			req = websocket._req = request(opts);
			if (websocket._redirects) websocket.emit("redirect", websocket.url, req);
		} else req = websocket._req = request(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req[kAborted]) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL$1(location, address);
				} catch (e) {
					emitErrorAndClose(websocket, /* @__PURE__ */ new SyntaxError(`Invalid URL: ${location}`));
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash$1("sha1").update(key + GUID).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			let protError;
			if (serverProt !== void 0) {
				if (!protocolSet.size) protError = "Server sent a subprotocol but none was requested";
				else if (!protocolSet.has(serverProt)) protError = "Server sent an invalid subprotocol";
			} else if (protocolSet.size) protError = "Server sent no subprotocol";
			if (protError) {
				abortHandshake(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					abortHandshake(websocket, socket, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let extensions;
				try {
					extensions = parse(secWebSocketExtensions);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
					abortHandshake(websocket, socket, "Server indicated an extension that was not requested");
					return;
				}
				try {
					perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
			}
			websocket.setSocket(socket, head, {
				allowSynchronousEvents: opts.allowSynchronousEvents,
				generateMask: opts.generateMask,
				maxBufferedChunks: opts.maxBufferedChunks,
				maxFragments: opts.maxFragments,
				maxPayload: opts.maxPayload,
				skipUTF8Validation: opts.skipUTF8Validation
			});
		});
		if (opts.finishRequest) opts.finishRequest(req, websocket);
		else req.end();
	}
	/**
	* Emit the `'error'` and `'close'` events.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket.CLOSING;
		websocket._errorEmitted = true;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net$2.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net$2.isIP(options.host) ? "" : options.host;
		return tls$2.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake(websocket, stream, message) {
		websocket._readyState = WebSocket.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake);
		if (stream.setHeader) {
			stream[kAborted] = true;
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			process.nextTick(emitErrorAndClose, websocket, err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = isBlob(data) ? data.size : toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) {
			const err = /* @__PURE__ */ new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
			process.nextTick(cb, err);
		}
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {Buffer} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		const websocket = this[kWebSocket];
		if (!websocket.isPaused) websocket._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket._socket[kWebSocket] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {Buffer|ArrayBuffer|Buffer[])} data The message
	* @param {Boolean} isBinary Specifies whether the message is binary or not
	* @private
	*/
	function receiverOnMessage(data, isBinary) {
		this[kWebSocket].emit("message", data, isBinary);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket];
		if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The `Sender` error event handler.
	*
	* @param {Error} The error
	* @private
	*/
	function senderOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket.readyState === WebSocket.CLOSED) return;
		if (websocket.readyState === WebSocket.OPEN) {
			websocket._readyState = WebSocket.CLOSING;
			setCloseTimer(websocket);
		}
		this._socket.end();
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* Set a timer to destroy the underlying raw socket of a WebSocket.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @private
	*/
	function setCloseTimer(websocket) {
		websocket._closeTimer = setTimeout(websocket._socket.destroy.bind(websocket._socket), websocket._closeTimeout);
	}
	/**
	* The listener of the socket `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket.CLOSING;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
			const chunk = this.read(this._readableState.length);
			websocket._receiver.write(chunk);
		}
		websocket._receiver.end();
		this[kWebSocket] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the socket `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the socket `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket];
		websocket._readyState = WebSocket.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the socket `'error'` event.
	*
	* @private
	*/
	function socketOnError() {
		const websocket = this[kWebSocket];
		this.removeListener("error", socketOnError);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket.CLOSING;
			this.destroy();
		}
	}
}));
//#endregion
//#region node_modules/ws/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	require_websocket();
	var { Duplex: Duplex$1 } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let terminateOnDestroy = true;
		const duplex = new Duplex$1({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg, isBinary) {
			const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
			if (!duplex.push(data)) ws.pause();
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err) {
				called = true;
				callback(err);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if (ws.isPaused) ws.resume();
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
}));
//#endregion
//#region node_modules/ws/lib/subprotocol.js
var require_subprotocol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { tokenChars } = require_validation();
	/**
	* Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	*
	* @param {String} header The field value of the header
	* @return {Set} The subprotocol names
	* @public
	*/
	function parse(header) {
		const protocols = /* @__PURE__ */ new Set();
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const protocol = header.slice(start, end);
				if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
				protocols.add(protocol);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || end !== -1) throw new SyntaxError("Unexpected end of input");
		const protocol = header.slice(start, i);
		if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
		protocols.add(protocol);
		return protocols;
	}
	module.exports = { parse };
}));
//#endregion
//#region node_modules/ws/lib/websocket-server.js
var require_websocket_server = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$3 = __require("events");
	var http$2 = __require("http");
	var { Duplex } = __require("stream");
	var { createHash } = __require("crypto");
	var extension = require_extension();
	var PerMessageDeflate = require_permessage_deflate();
	var subprotocol = require_subprotocol();
	var WebSocket = require_websocket();
	var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
	var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	var RUNNING = 0;
	var CLOSING = 1;
	var CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter$3 {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Boolean} [options.autoPong=true] Specifies whether or not to
		*     automatically send a pong in response to a ping
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
		*     wait for the closing handshake to finish after `websocket.close()` is
		*     called
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=16384] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
		*     class to use. It must be the `WebSocket` class or class that extends it
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				allowSynchronousEvents: true,
				autoPong: true,
				maxBufferedChunks: 256 * 1024,
				maxFragments: 16 * 1024,
				maxPayload: 100 * 1024 * 1024,
				skipUTF8Validation: false,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				closeTimeout: CLOSE_TIMEOUT,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				WebSocket,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http$2.createServer((req, res) => {
					const body = http$2.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) {
				this.clients = /* @__PURE__ */ new Set();
				this._shouldEmitClose = false;
			}
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Stop the server from accepting new connections and emit the `'close'` event
		* when all existing connections are closed.
		*
		* @param {Function} [cb] A one-time listener for the `'close'` event
		* @public
		*/
		close(cb) {
			if (this._state === CLOSED) {
				if (cb) this.once("close", () => {
					cb(/* @__PURE__ */ new Error("The server is not running"));
				});
				process.nextTick(emitClose, this);
				return;
			}
			if (cb) this.once("close", cb);
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.options.noServer || this.options.server) {
				if (this._server) {
					this._removeListeners();
					this._removeListeners = this._server = null;
				}
				if (this.clients) if (!this.clients.size) process.nextTick(emitClose, this);
				else this._shouldEmitClose = true;
				else process.nextTick(emitClose, this);
			} else {
				const server = this._server;
				this._removeListeners();
				this._removeListeners = this._server = null;
				server.close(() => {
					emitClose(this);
				});
			}
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				if ((index !== -1 ? req.url.slice(0, index) : req.url) !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"];
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			if (req.method !== "GET") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 405, "Invalid HTTP method");
				return;
			}
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Upgrade header");
				return;
			}
			if (key === void 0 || !keyRegex.test(key)) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Key header");
				return;
			}
			if (version !== 13 && version !== 8) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Version header", { "Sec-WebSocket-Version": "13, 8" });
				return;
			}
			if (!this.shouldHandle(req)) {
				abortHandshake(socket, 400);
				return;
			}
			const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
			let protocols = /* @__PURE__ */ new Set();
			if (secWebSocketProtocol !== void 0) try {
				protocols = subprotocol.parse(secWebSocketProtocol);
			} catch (err) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Sec-WebSocket-Protocol header");
				return;
			}
			const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
			const extensions = {};
			if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
				const perMessageDeflate = new PerMessageDeflate({
					...this.options.perMessageDeflate,
					isServer: true,
					maxPayload: this.options.maxPayload
				});
				try {
					const offers = extension.parse(secWebSocketExtensions);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
					return;
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {Object} extensions The accepted extensions
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Set} protocols The subprotocols
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${createHash("sha1").update(key + GUID).digest("base64")}`
			];
			const ws = new this.options.WebSocket(null, void 0, this.options);
			if (protocols.size) {
				const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = extension.format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, {
				allowSynchronousEvents: this.options.allowSynchronousEvents,
				maxBufferedChunks: this.options.maxBufferedChunks,
				maxFragments: this.options.maxFragments,
				maxPayload: this.options.maxPayload,
				skipUTF8Validation: this.options.skipUTF8Validation
			});
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => {
					this.clients.delete(ws);
					if (this._shouldEmitClose && !this.clients.size) process.nextTick(emitClose, this);
				});
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		message = message || http$2.STATUS_CODES[code];
		headers = {
			Connection: "close",
			"Content-Type": "text/html",
			"Content-Length": Buffer.byteLength(message),
			...headers
		};
		socket.once("finish", socket.destroy);
		socket.end(`HTTP/1.1 ${code} ${http$2.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
	}
	/**
	* Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	* one listener for it, otherwise call `abortHandshake()`.
	*
	* @param {WebSocketServer} server The WebSocket server
	* @param {http.IncomingMessage} req The request object
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} message The HTTP response body
	* @param {Object} [headers] The HTTP response headers
	* @private
	*/
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
		if (server.listenerCount("wsClientError")) {
			const err = new Error(message);
			Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
			server.emit("wsClientError", err, socket, req);
		} else abortHandshake(socket, code, message, headers);
	}
}));
//#endregion
//#region node_modules/ws/index.js
var require_ws = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createWebSocketStream = require_stream();
	var extension = require_extension();
	var PerMessageDeflate = require_permessage_deflate();
	var Receiver = require_receiver();
	var Sender = require_sender();
	var subprotocol = require_subprotocol();
	var WebSocket = require_websocket();
	var WebSocketServer = require_websocket_server();
	WebSocket.createWebSocketStream = createWebSocketStream;
	WebSocket.extension = extension;
	WebSocket.PerMessageDeflate = PerMessageDeflate;
	WebSocket.Receiver = Receiver;
	WebSocket.Sender = Sender;
	WebSocket.Server = WebSocketServer;
	WebSocket.subprotocol = subprotocol;
	WebSocket.WebSocket = WebSocket;
	WebSocket.WebSocketServer = WebSocketServer;
	module.exports = WebSocket;
}));
//#endregion
//#region node_modules/p-cancelable/index.js
var require_p_cancelable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var CancelError = class extends Error {
		constructor(reason) {
			super(reason || "Promise was canceled");
			this.name = "CancelError";
		}
		get isCanceled() {
			return true;
		}
	};
	var PCancelable = class PCancelable {
		static fn(userFn) {
			return (...arguments_) => {
				return new PCancelable((resolve, reject, onCancel) => {
					arguments_.push(onCancel);
					userFn(...arguments_).then(resolve, reject);
				});
			};
		}
		constructor(executor) {
			this._cancelHandlers = [];
			this._isPending = true;
			this._isCanceled = false;
			this._rejectOnCancel = true;
			this._promise = new Promise((resolve, reject) => {
				this._reject = reject;
				const onResolve = (value) => {
					if (!this._isCanceled || !onCancel.shouldReject) {
						this._isPending = false;
						resolve(value);
					}
				};
				const onReject = (error) => {
					this._isPending = false;
					reject(error);
				};
				const onCancel = (handler) => {
					if (!this._isPending) throw new Error("The `onCancel` handler was attached after the promise settled.");
					this._cancelHandlers.push(handler);
				};
				Object.defineProperties(onCancel, { shouldReject: {
					get: () => this._rejectOnCancel,
					set: (boolean) => {
						this._rejectOnCancel = boolean;
					}
				} });
				return executor(onResolve, onReject, onCancel);
			});
		}
		then(onFulfilled, onRejected) {
			return this._promise.then(onFulfilled, onRejected);
		}
		catch(onRejected) {
			return this._promise.catch(onRejected);
		}
		finally(onFinally) {
			return this._promise.finally(onFinally);
		}
		cancel(reason) {
			if (!this._isPending || this._isCanceled) return;
			this._isCanceled = true;
			if (this._cancelHandlers.length > 0) try {
				for (const handler of this._cancelHandlers) handler();
			} catch (error) {
				this._reject(error);
				return;
			}
			if (this._rejectOnCancel) this._reject(new CancelError(reason));
		}
		get isCanceled() {
			return this._isCanceled;
		}
	};
	Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);
	module.exports = PCancelable;
	module.exports.CancelError = CancelError;
}));
//#endregion
//#region node_modules/cacheable-lookup/source/index.js
var require_source$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { V4MAPPED, ADDRCONFIG, ALL, promises: { Resolver: AsyncResolver }, lookup: dnsLookup } = __require("dns");
	var { promisify } = __require("util");
	var os = __require("os");
	var kCacheableLookupCreateConnection = Symbol("cacheableLookupCreateConnection");
	var kCacheableLookupInstance = Symbol("cacheableLookupInstance");
	var kExpires = Symbol("expires");
	var supportsALL = typeof ALL === "number";
	var verifyAgent = (agent) => {
		if (!(agent && typeof agent.createConnection === "function")) throw new Error("Expected an Agent instance as the first argument");
	};
	var map4to6 = (entries) => {
		for (const entry of entries) {
			if (entry.family === 6) continue;
			entry.address = `::ffff:${entry.address}`;
			entry.family = 6;
		}
	};
	var getIfaceInfo = () => {
		let has4 = false;
		let has6 = false;
		for (const device of Object.values(os.networkInterfaces())) for (const iface of device) {
			if (iface.internal) continue;
			if (iface.family === "IPv6") has6 = true;
			else has4 = true;
			if (has4 && has6) return {
				has4,
				has6
			};
		}
		return {
			has4,
			has6
		};
	};
	var isIterable = (map) => {
		return Symbol.iterator in map;
	};
	var ttl = { ttl: true };
	var all = { all: true };
	var CacheableLookup = class {
		constructor({ cache = /* @__PURE__ */ new Map(), maxTtl = Infinity, fallbackDuration = 3600, errorTtl = .15, resolver = new AsyncResolver(), lookup = dnsLookup } = {}) {
			this.maxTtl = maxTtl;
			this.errorTtl = errorTtl;
			this._cache = cache;
			this._resolver = resolver;
			this._dnsLookup = promisify(lookup);
			if (this._resolver instanceof AsyncResolver) {
				this._resolve4 = this._resolver.resolve4.bind(this._resolver);
				this._resolve6 = this._resolver.resolve6.bind(this._resolver);
			} else {
				this._resolve4 = promisify(this._resolver.resolve4.bind(this._resolver));
				this._resolve6 = promisify(this._resolver.resolve6.bind(this._resolver));
			}
			this._iface = getIfaceInfo();
			this._pending = {};
			this._nextRemovalTime = false;
			this._hostnamesToFallback = /* @__PURE__ */ new Set();
			if (fallbackDuration < 1) this._fallback = false;
			else {
				this._fallback = true;
				const interval = setInterval(() => {
					this._hostnamesToFallback.clear();
				}, fallbackDuration * 1e3);
				/* istanbul ignore next: There is no `interval.unref()` when running inside an Electron renderer */
				if (interval.unref) interval.unref();
			}
			this.lookup = this.lookup.bind(this);
			this.lookupAsync = this.lookupAsync.bind(this);
		}
		set servers(servers) {
			this.clear();
			this._resolver.setServers(servers);
		}
		get servers() {
			return this._resolver.getServers();
		}
		lookup(hostname, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = {};
			} else if (typeof options === "number") options = { family: options };
			if (!callback) throw new Error("Callback must be a function.");
			this.lookupAsync(hostname, options).then((result) => {
				if (options.all) callback(null, result);
				else callback(null, result.address, result.family, result.expires, result.ttl);
			}, callback);
		}
		async lookupAsync(hostname, options = {}) {
			if (typeof options === "number") options = { family: options };
			let cached = await this.query(hostname);
			if (options.family === 6) {
				const filtered = cached.filter((entry) => entry.family === 6);
				if (options.hints & V4MAPPED) if (supportsALL && options.hints & ALL || filtered.length === 0) map4to6(cached);
				else cached = filtered;
				else cached = filtered;
			} else if (options.family === 4) cached = cached.filter((entry) => entry.family === 4);
			if (options.hints & ADDRCONFIG) {
				const { _iface } = this;
				cached = cached.filter((entry) => entry.family === 6 ? _iface.has6 : _iface.has4);
			}
			if (cached.length === 0) {
				const error = /* @__PURE__ */ new Error(`cacheableLookup ENOTFOUND ${hostname}`);
				error.code = "ENOTFOUND";
				error.hostname = hostname;
				throw error;
			}
			if (options.all) return cached;
			return cached[0];
		}
		async query(hostname) {
			let cached = await this._cache.get(hostname);
			if (!cached) {
				const pending = this._pending[hostname];
				if (pending) cached = await pending;
				else {
					const newPromise = this.queryAndCache(hostname);
					this._pending[hostname] = newPromise;
					try {
						cached = await newPromise;
					} finally {
						delete this._pending[hostname];
					}
				}
			}
			cached = cached.map((entry) => {
				return { ...entry };
			});
			return cached;
		}
		async _resolve(hostname) {
			const wrap = async (promise) => {
				try {
					return await promise;
				} catch (error) {
					if (error.code === "ENODATA" || error.code === "ENOTFOUND") return [];
					throw error;
				}
			};
			const [A, AAAA] = await Promise.all([this._resolve4(hostname, ttl), this._resolve6(hostname, ttl)].map((promise) => wrap(promise)));
			let aTtl = 0;
			let aaaaTtl = 0;
			let cacheTtl = 0;
			const now = Date.now();
			for (const entry of A) {
				entry.family = 4;
				entry.expires = now + entry.ttl * 1e3;
				aTtl = Math.max(aTtl, entry.ttl);
			}
			for (const entry of AAAA) {
				entry.family = 6;
				entry.expires = now + entry.ttl * 1e3;
				aaaaTtl = Math.max(aaaaTtl, entry.ttl);
			}
			if (A.length > 0) if (AAAA.length > 0) cacheTtl = Math.min(aTtl, aaaaTtl);
			else cacheTtl = aTtl;
			else cacheTtl = aaaaTtl;
			return {
				entries: [...A, ...AAAA],
				cacheTtl
			};
		}
		async _lookup(hostname) {
			try {
				return {
					entries: await this._dnsLookup(hostname, { all: true }),
					cacheTtl: 0
				};
			} catch (_) {
				return {
					entries: [],
					cacheTtl: 0
				};
			}
		}
		async _set(hostname, data, cacheTtl) {
			if (this.maxTtl > 0 && cacheTtl > 0) {
				cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1e3;
				data[kExpires] = Date.now() + cacheTtl;
				try {
					await this._cache.set(hostname, data, cacheTtl);
				} catch (error) {
					this.lookupAsync = async () => {
						const cacheError = /* @__PURE__ */ new Error("Cache Error. Please recreate the CacheableLookup instance.");
						cacheError.cause = error;
						throw cacheError;
					};
				}
				if (isIterable(this._cache)) this._tick(cacheTtl);
			}
		}
		async queryAndCache(hostname) {
			if (this._hostnamesToFallback.has(hostname)) return this._dnsLookup(hostname, all);
			let query = await this._resolve(hostname);
			if (query.entries.length === 0 && this._fallback) {
				query = await this._lookup(hostname);
				if (query.entries.length !== 0) this._hostnamesToFallback.add(hostname);
			}
			const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
			await this._set(hostname, query.entries, cacheTtl);
			return query.entries;
		}
		_tick(ms) {
			const nextRemovalTime = this._nextRemovalTime;
			if (!nextRemovalTime || ms < nextRemovalTime) {
				clearTimeout(this._removalTimeout);
				this._nextRemovalTime = ms;
				this._removalTimeout = setTimeout(() => {
					this._nextRemovalTime = false;
					let nextExpiry = Infinity;
					const now = Date.now();
					for (const [hostname, entries] of this._cache) {
						const expires = entries[kExpires];
						if (now >= expires) this._cache.delete(hostname);
						else if (expires < nextExpiry) nextExpiry = expires;
					}
					if (nextExpiry !== Infinity) this._tick(nextExpiry - now);
				}, ms);
				/* istanbul ignore next: There is no `timeout.unref()` when running inside an Electron renderer */
				if (this._removalTimeout.unref) this._removalTimeout.unref();
			}
		}
		install(agent) {
			verifyAgent(agent);
			if (kCacheableLookupCreateConnection in agent) throw new Error("CacheableLookup has been already installed");
			agent[kCacheableLookupCreateConnection] = agent.createConnection;
			agent[kCacheableLookupInstance] = this;
			agent.createConnection = (options, callback) => {
				if (!("lookup" in options)) options.lookup = this.lookup;
				return agent[kCacheableLookupCreateConnection](options, callback);
			};
		}
		uninstall(agent) {
			verifyAgent(agent);
			if (agent[kCacheableLookupCreateConnection]) {
				if (agent[kCacheableLookupInstance] !== this) throw new Error("The agent is not owned by this CacheableLookup instance");
				agent.createConnection = agent[kCacheableLookupCreateConnection];
				delete agent[kCacheableLookupCreateConnection];
				delete agent[kCacheableLookupInstance];
			}
		}
		updateInterfaceInfo() {
			const { _iface } = this;
			this._iface = getIfaceInfo();
			if (_iface.has4 && !this._iface.has4 || _iface.has6 && !this._iface.has6) this._cache.clear();
		}
		clear(hostname) {
			if (hostname) {
				this._cache.delete(hostname);
				return;
			}
			this._cache.clear();
		}
	};
	module.exports = CacheableLookup;
	module.exports.default = CacheableLookup;
}));
//#endregion
//#region node_modules/normalize-url/index.js
var require_normalize_url = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
	var DATA_URL_DEFAULT_CHARSET = "us-ascii";
	var testParameter = (name, filters) => {
		return filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
	};
	var normalizeDataURL = (urlString, { stripHash }) => {
		const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
		if (!match) throw new Error(`Invalid URL: ${urlString}`);
		let { type, data, hash } = match.groups;
		const mediaType = type.split(";");
		hash = stripHash ? "" : hash;
		let isBase64 = false;
		if (mediaType[mediaType.length - 1] === "base64") {
			mediaType.pop();
			isBase64 = true;
		}
		const mimeType = (mediaType.shift() || "").toLowerCase();
		const normalizedMediaType = [...mediaType.map((attribute) => {
			let [key, value = ""] = attribute.split("=").map((string) => string.trim());
			if (key === "charset") {
				value = value.toLowerCase();
				if (value === DATA_URL_DEFAULT_CHARSET) return "";
			}
			return `${key}${value ? `=${value}` : ""}`;
		}).filter(Boolean)];
		if (isBase64) normalizedMediaType.push("base64");
		if (normalizedMediaType.length !== 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) normalizedMediaType.unshift(mimeType);
		return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
	};
	var normalizeUrl = (urlString, options) => {
		options = {
			defaultProtocol: "http:",
			normalizeProtocol: true,
			forceHttp: false,
			forceHttps: false,
			stripAuthentication: true,
			stripHash: false,
			stripTextFragment: true,
			stripWWW: true,
			removeQueryParameters: [/^utm_\w+/i],
			removeTrailingSlash: true,
			removeSingleSlash: true,
			removeDirectoryIndex: false,
			sortQueryParameters: true,
			...options
		};
		urlString = urlString.trim();
		if (/^data:/i.test(urlString)) return normalizeDataURL(urlString, options);
		if (/^view-source:/i.test(urlString)) throw new Error("`view-source:` is not supported as it is a non-standard protocol");
		const hasRelativeProtocol = urlString.startsWith("//");
		if (!(!hasRelativeProtocol && /^\.*\//.test(urlString))) urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
		const urlObj = new URL(urlString);
		if (options.forceHttp && options.forceHttps) throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
		if (options.forceHttp && urlObj.protocol === "https:") urlObj.protocol = "http:";
		if (options.forceHttps && urlObj.protocol === "http:") urlObj.protocol = "https:";
		if (options.stripAuthentication) {
			urlObj.username = "";
			urlObj.password = "";
		}
		if (options.stripHash) urlObj.hash = "";
		else if (options.stripTextFragment) urlObj.hash = urlObj.hash.replace(/#?:~:text.*?$/i, "");
		if (urlObj.pathname) urlObj.pathname = urlObj.pathname.replace(/(?<!\b(?:[a-z][a-z\d+\-.]{1,50}:))\/{2,}/g, "/");
		if (urlObj.pathname) try {
			urlObj.pathname = decodeURI(urlObj.pathname);
		} catch (_) {}
		if (options.removeDirectoryIndex === true) options.removeDirectoryIndex = [/^index\.[a-z]+$/];
		if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
			let pathComponents = urlObj.pathname.split("/");
			const lastComponent = pathComponents[pathComponents.length - 1];
			if (testParameter(lastComponent, options.removeDirectoryIndex)) {
				pathComponents = pathComponents.slice(0, pathComponents.length - 1);
				urlObj.pathname = pathComponents.slice(1).join("/") + "/";
			}
		}
		if (urlObj.hostname) {
			urlObj.hostname = urlObj.hostname.replace(/\.$/, "");
			if (options.stripWWW && /^www\.(?!www\.)(?:[a-z\-\d]{1,63})\.(?:[a-z.\-\d]{2,63})$/.test(urlObj.hostname)) urlObj.hostname = urlObj.hostname.replace(/^www\./, "");
		}
		if (Array.isArray(options.removeQueryParameters)) {
			for (const key of [...urlObj.searchParams.keys()]) if (testParameter(key, options.removeQueryParameters)) urlObj.searchParams.delete(key);
		}
		if (options.removeQueryParameters === true) urlObj.search = "";
		if (options.sortQueryParameters) urlObj.searchParams.sort();
		if (options.removeTrailingSlash) urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
		const oldUrlString = urlString;
		urlString = urlObj.toString();
		if (!options.removeSingleSlash && urlObj.pathname === "/" && !oldUrlString.endsWith("/") && urlObj.hash === "") urlString = urlString.replace(/\/$/, "");
		if ((options.removeTrailingSlash || urlObj.pathname === "/") && urlObj.hash === "" && options.removeSingleSlash) urlString = urlString.replace(/\/$/, "");
		if (hasRelativeProtocol && !options.normalizeProtocol) urlString = urlString.replace(/^http:\/\//, "//");
		if (options.stripProtocol) urlString = urlString.replace(/^(?:https?:)?\/\//, "");
		return urlString;
	};
	module.exports = normalizeUrl;
}));
//#endregion
//#region node_modules/wrappy/wrappy.js
var require_wrappy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = wrappy;
	function wrappy(fn, cb) {
		if (fn && cb) return wrappy(fn)(cb);
		if (typeof fn !== "function") throw new TypeError("need wrapper function");
		Object.keys(fn).forEach(function(k) {
			wrapper[k] = fn[k];
		});
		return wrapper;
		function wrapper() {
			var args = new Array(arguments.length);
			for (var i = 0; i < args.length; i++) args[i] = arguments[i];
			var ret = fn.apply(this, args);
			var cb = args[args.length - 1];
			if (typeof ret === "function" && ret !== cb) Object.keys(cb).forEach(function(k) {
				ret[k] = cb[k];
			});
			return ret;
		}
	}
}));
//#endregion
//#region node_modules/once/once.js
var require_once = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var wrappy = require_wrappy();
	module.exports = wrappy(once);
	module.exports.strict = wrappy(onceStrict);
	once.proto = once(function() {
		Object.defineProperty(Function.prototype, "once", {
			value: function() {
				return once(this);
			},
			configurable: true
		});
		Object.defineProperty(Function.prototype, "onceStrict", {
			value: function() {
				return onceStrict(this);
			},
			configurable: true
		});
	});
	function once(fn) {
		var f = function() {
			if (f.called) return f.value;
			f.called = true;
			return f.value = fn.apply(this, arguments);
		};
		f.called = false;
		return f;
	}
	function onceStrict(fn) {
		var f = function() {
			if (f.called) throw new Error(f.onceError);
			f.called = true;
			return f.value = fn.apply(this, arguments);
		};
		f.onceError = (fn.name || "Function wrapped with `once`") + " shouldn't be called more than once";
		f.called = false;
		return f;
	}
}));
//#endregion
//#region node_modules/end-of-stream/index.js
var require_end_of_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var once = require_once();
	var noop = function() {};
	var qnt = global.Bare ? queueMicrotask : process.nextTick.bind(process);
	var isRequest = function(stream) {
		return stream.setHeader && typeof stream.abort === "function";
	};
	var isChildProcess = function(stream) {
		return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
	};
	var eos = function(stream, opts, callback) {
		if (typeof opts === "function") return eos(stream, null, opts);
		if (!opts) opts = {};
		callback = once(callback || noop);
		var ws = stream._writableState;
		var rs = stream._readableState;
		var readable = opts.readable || opts.readable !== false && stream.readable;
		var writable = opts.writable || opts.writable !== false && stream.writable;
		var cancelled = false;
		var onlegacyfinish = function() {
			if (!stream.writable) onfinish();
		};
		var onfinish = function() {
			writable = false;
			if (!readable) callback.call(stream);
		};
		var onend = function() {
			readable = false;
			if (!writable) callback.call(stream);
		};
		var onexit = function(exitCode) {
			callback.call(stream, exitCode ? /* @__PURE__ */ new Error("exited with error code: " + exitCode) : null);
		};
		var onerror = function(err) {
			callback.call(stream, err);
		};
		var onclose = function() {
			qnt(onclosenexttick);
		};
		var onclosenexttick = function() {
			if (cancelled) return;
			if (readable && !(rs && rs.ended && !rs.destroyed)) return callback.call(stream, /* @__PURE__ */ new Error("premature close"));
			if (writable && !(ws && ws.ended && !ws.destroyed)) return callback.call(stream, /* @__PURE__ */ new Error("premature close"));
		};
		var onrequest = function() {
			stream.req.on("finish", onfinish);
		};
		if (isRequest(stream)) {
			stream.on("complete", onfinish);
			stream.on("abort", onclose);
			if (stream.req) onrequest();
			else stream.on("request", onrequest);
		} else if (writable && !ws) {
			stream.on("end", onlegacyfinish);
			stream.on("close", onlegacyfinish);
		}
		if (isChildProcess(stream)) stream.on("exit", onexit);
		stream.on("end", onend);
		stream.on("finish", onfinish);
		if (opts.error !== false) stream.on("error", onerror);
		stream.on("close", onclose);
		return function() {
			cancelled = true;
			stream.removeListener("complete", onfinish);
			stream.removeListener("abort", onclose);
			stream.removeListener("request", onrequest);
			if (stream.req) stream.req.removeListener("finish", onfinish);
			stream.removeListener("end", onlegacyfinish);
			stream.removeListener("close", onlegacyfinish);
			stream.removeListener("finish", onfinish);
			stream.removeListener("exit", onexit);
			stream.removeListener("end", onend);
			stream.removeListener("error", onerror);
			stream.removeListener("close", onclose);
		};
	};
	module.exports = eos;
}));
//#endregion
//#region node_modules/pump/index.js
var require_pump = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var once = require_once();
	var eos = require_end_of_stream();
	var fs;
	try {
		fs = __require("fs");
	} catch (e) {}
	var noop = function() {};
	var ancient = typeof process === "undefined" ? false : /^v?\.0/.test(process.version);
	var isFn = function(fn) {
		return typeof fn === "function";
	};
	var isFS = function(stream) {
		if (!ancient) return false;
		if (!fs) return false;
		return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close);
	};
	var isRequest = function(stream) {
		return stream.setHeader && isFn(stream.abort);
	};
	var destroyer = function(stream, reading, writing, callback) {
		callback = once(callback);
		var closed = false;
		stream.on("close", function() {
			closed = true;
		});
		eos(stream, {
			readable: reading,
			writable: writing
		}, function(err) {
			if (err) return callback(err);
			closed = true;
			callback();
		});
		var destroyed = false;
		return function(err) {
			if (closed) return;
			if (destroyed) return;
			destroyed = true;
			if (isFS(stream)) return stream.close(noop);
			if (isRequest(stream)) return stream.abort();
			if (isFn(stream.destroy)) return stream.destroy();
			callback(err || /* @__PURE__ */ new Error("stream was destroyed"));
		};
	};
	var call = function(fn) {
		fn();
	};
	var pipe = function(from, to) {
		return from.pipe(to);
	};
	var pump = function() {
		var streams = Array.prototype.slice.call(arguments);
		var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop;
		if (Array.isArray(streams[0])) streams = streams[0];
		if (streams.length < 2) throw new Error("pump requires two streams per minimum");
		var error;
		var destroys = streams.map(function(stream, i) {
			var reading = i < streams.length - 1;
			return destroyer(stream, reading, i > 0, function(err) {
				if (!error) error = err;
				if (err) destroys.forEach(call);
				if (reading) return;
				destroys.forEach(call);
				callback(error);
			});
		});
		return streams.reduce(pipe);
	};
	module.exports = pump;
}));
//#endregion
//#region node_modules/cacheable-request/node_modules/get-stream/buffer-stream.js
var require_buffer_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { PassThrough: PassThroughStream } = __require("stream");
	module.exports = (options) => {
		options = { ...options };
		const { array } = options;
		let { encoding } = options;
		const isBuffer = encoding === "buffer";
		let objectMode = false;
		if (array) objectMode = !(encoding || isBuffer);
		else encoding = encoding || "utf8";
		if (isBuffer) encoding = null;
		const stream = new PassThroughStream({ objectMode });
		if (encoding) stream.setEncoding(encoding);
		let length = 0;
		const chunks = [];
		stream.on("data", (chunk) => {
			chunks.push(chunk);
			if (objectMode) length = chunks.length;
			else length += chunk.length;
		});
		stream.getBufferedValue = () => {
			if (array) return chunks;
			return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
		};
		stream.getBufferedLength = () => length;
		return stream;
	};
}));
//#endregion
//#region node_modules/cacheable-request/node_modules/get-stream/index.js
var require_get_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { constants: BufferConstants } = __require("buffer");
	var pump = require_pump();
	var bufferStream = require_buffer_stream();
	var MaxBufferError = class extends Error {
		constructor() {
			super("maxBuffer exceeded");
			this.name = "MaxBufferError";
		}
	};
	async function getStream(inputStream, options) {
		if (!inputStream) return Promise.reject(/* @__PURE__ */ new Error("Expected a stream"));
		options = {
			maxBuffer: Infinity,
			...options
		};
		const { maxBuffer } = options;
		let stream;
		await new Promise((resolve, reject) => {
			const rejectPromise = (error) => {
				if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) error.bufferedData = stream.getBufferedValue();
				reject(error);
			};
			stream = pump(inputStream, bufferStream(options), (error) => {
				if (error) {
					rejectPromise(error);
					return;
				}
				resolve();
			});
			stream.on("data", () => {
				if (stream.getBufferedLength() > maxBuffer) rejectPromise(new MaxBufferError());
			});
		});
		return stream.getBufferedValue();
	}
	module.exports = getStream;
	module.exports.default = getStream;
	module.exports.buffer = (stream, options) => getStream(stream, {
		...options,
		encoding: "buffer"
	});
	module.exports.array = (stream, options) => getStream(stream, {
		...options,
		array: true
	});
	module.exports.MaxBufferError = MaxBufferError;
}));
//#endregion
//#region node_modules/http-cache-semantics/index.js
var require_http_cache_semantics = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @typedef {Object} HttpRequest
	* @property {Record<string, string>} headers - Request headers
	* @property {string} [method] - HTTP method
	* @property {string} [url] - Request URL
	*/
	/**
	* @typedef {Object} HttpResponse
	* @property {Record<string, string>} headers - Response headers
	* @property {number} [status] - HTTP status code
	*/
	/**
	* Set of default cacheable status codes per RFC 7231 section 6.1.
	* @type {Set<number>}
	*/
	var statusCodeCacheableByDefault = /* @__PURE__ */ new Set([
		200,
		203,
		204,
		206,
		300,
		301,
		308,
		404,
		405,
		410,
		414,
		501
	]);
	/**
	* Set of HTTP status codes that the cache implementation understands.
	* Note: This implementation does not understand partial responses (206).
	* @type {Set<number>}
	*/
	var understoodStatuses = /* @__PURE__ */ new Set([
		200,
		203,
		204,
		300,
		301,
		302,
		303,
		307,
		308,
		404,
		405,
		410,
		414,
		501
	]);
	/**
	* Set of HTTP error status codes.
	* @type {Set<number>}
	*/
	var errorStatusCodes = /* @__PURE__ */ new Set([
		500,
		502,
		503,
		504
	]);
	/**
	* Object representing hop-by-hop headers that should be removed.
	* @type {Record<string, boolean>}
	*/
	var hopByHopHeaders = {
		date: true,
		connection: true,
		"keep-alive": true,
		"proxy-authenticate": true,
		"proxy-authorization": true,
		te: true,
		trailer: true,
		"transfer-encoding": true,
		upgrade: true
	};
	/**
	* Headers that are excluded from revalidation update.
	* @type {Record<string, boolean>}
	*/
	var excludedFromRevalidationUpdate = {
		"content-length": true,
		"content-encoding": true,
		"transfer-encoding": true,
		"content-range": true
	};
	/**
	* Converts a string to a number or returns zero if the conversion fails.
	* @param {string} s - The string to convert.
	* @returns {number} The parsed number or 0.
	*/
	function toNumberOrZero(s) {
		const n = parseInt(s, 10);
		return isFinite(n) ? n : 0;
	}
	/**
	* Determines if the given response is an error response.
	* Implements RFC 5861 behavior.
	* @param {HttpResponse|undefined} response - The HTTP response object.
	* @returns {boolean} true if the response is an error or undefined, false otherwise.
	*/
	function isErrorResponse(response) {
		if (!response) return true;
		return errorStatusCodes.has(response.status);
	}
	/**
	* Parses a Cache-Control header string into an object.
	* @param {string} [header] - The Cache-Control header value.
	* @returns {Record<string, string|boolean>} An object representing Cache-Control directives.
	*/
	function parseCacheControl(header) {
		/** @type {Record<string, string|boolean>} */
		const cc = {};
		if (!header) return cc;
		const parts = header.trim().split(/,/);
		for (const part of parts) {
			const [k, v] = part.split(/=/, 2);
			cc[k.trim()] = v === void 0 ? true : v.trim().replace(/^"|"$/g, "");
		}
		return cc;
	}
	/**
	* Formats a Cache-Control directives object into a header string.
	* @param {Record<string, string|boolean>} cc - The Cache-Control directives.
	* @returns {string|undefined} A formatted Cache-Control header string or undefined if empty.
	*/
	function formatCacheControl(cc) {
		let parts = [];
		for (const k in cc) {
			const v = cc[k];
			parts.push(v === true ? k : k + "=" + v);
		}
		if (!parts.length) return;
		return parts.join(", ");
	}
	module.exports = class CachePolicy {
		/**
		* Creates a new CachePolicy instance.
		* @param {HttpRequest} req - Incoming client request.
		* @param {HttpResponse} res - Received server response.
		* @param {Object} [options={}] - Configuration options.
		* @param {boolean} [options.shared=true] - Is the cache shared (a public proxy)? `false` for personal browser caches.
		* @param {number} [options.cacheHeuristic=0.1] - Fallback heuristic (age fraction) for cache duration.
		* @param {number} [options.immutableMinTimeToLive=86400000] - Minimum TTL for immutable responses in milliseconds.
		* @param {boolean} [options.ignoreCargoCult=false] - Detect nonsense cache headers, and override them.
		* @param {any} [options._fromObject] - Internal parameter for deserialization. Do not use.
		*/
		constructor(req, res, { shared, cacheHeuristic, immutableMinTimeToLive, ignoreCargoCult, _fromObject } = {}) {
			if (_fromObject) {
				this._fromObject(_fromObject);
				return;
			}
			if (!res || !res.headers) throw Error("Response headers missing");
			this._assertRequestHasHeaders(req);
			/** @type {number} Timestamp when the response was received */
			this._responseTime = this.now();
			/** @type {boolean} Indicates if the cache is shared */
			this._isShared = shared !== false;
			/** @type {boolean} Indicates if legacy cargo cult directives should be ignored */
			this._ignoreCargoCult = !!ignoreCargoCult;
			/** @type {number} Heuristic cache fraction */
			this._cacheHeuristic = void 0 !== cacheHeuristic ? cacheHeuristic : .1;
			/** @type {number} Minimum TTL for immutable responses in ms */
			this._immutableMinTtl = void 0 !== immutableMinTimeToLive ? immutableMinTimeToLive : 24 * 3600 * 1e3;
			/** @type {number} HTTP status code */
			this._status = "status" in res ? res.status : 200;
			/** @type {Record<string, string>} Response headers */
			this._resHeaders = res.headers;
			/** @type {Record<string, string|boolean>} Parsed Cache-Control directives from response */
			this._rescc = parseCacheControl(res.headers["cache-control"]);
			/** @type {string} HTTP method (e.g., GET, POST) */
			this._method = "method" in req ? req.method : "GET";
			/** @type {string} Request URL */
			this._url = req.url;
			/** @type {string} Host header from the request */
			this._host = req.headers.host;
			/** @type {boolean} Whether the request does not include an Authorization header */
			this._noAuthorization = !req.headers.authorization;
			/** @type {Record<string, string>|null} Request headers used for Vary matching */
			this._reqHeaders = res.headers.vary ? req.headers : null;
			/** @type {Record<string, string|boolean>} Parsed Cache-Control directives from request */
			this._reqcc = parseCacheControl(req.headers["cache-control"]);
			if (this._ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
				delete this._rescc["pre-check"];
				delete this._rescc["post-check"];
				delete this._rescc["no-cache"];
				delete this._rescc["no-store"];
				delete this._rescc["must-revalidate"];
				this._resHeaders = Object.assign({}, this._resHeaders, { "cache-control": formatCacheControl(this._rescc) });
				delete this._resHeaders.expires;
				delete this._resHeaders.pragma;
			}
			if (res.headers["cache-control"] == null && /no-cache/.test(res.headers.pragma)) this._rescc["no-cache"] = true;
		}
		/**
		* You can monkey-patch it for testing.
		* @returns {number} Current time in milliseconds.
		*/
		now() {
			return Date.now();
		}
		/**
		* Determines if the response is storable in a cache.
		* @returns {boolean} `false` if can never be cached.
		*/
		storable() {
			return !!(!this._reqcc["no-store"] && ("GET" === this._method || "HEAD" === this._method || "POST" === this._method && this._hasExplicitExpiration()) && understoodStatuses.has(this._status) && !this._rescc["no-store"] && (!this._isShared || !this._rescc.private) && (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && (this._resHeaders.expires || this._rescc["max-age"] || this._isShared && this._rescc["s-maxage"] || this._rescc.public || statusCodeCacheableByDefault.has(this._status)));
		}
		/**
		* @returns {boolean} true if expiration is explicitly defined.
		*/
		_hasExplicitExpiration() {
			return !!(this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires);
		}
		/**
		* @param {HttpRequest} req - a request
		* @throws {Error} if the headers are missing.
		*/
		_assertRequestHasHeaders(req) {
			if (!req || !req.headers) throw Error("Request headers missing");
		}
		/**
		* Checks if the request matches the cache and can be satisfied from the cache immediately,
		* without having to make a request to the server.
		*
		* This doesn't support `stale-while-revalidate`. See `evaluateRequest()` for a more complete solution.
		*
		* @param {HttpRequest} req - The new incoming HTTP request.
		* @returns {boolean} `true`` if the cached response used to construct this cache policy satisfies the request without revalidation.
		*/
		satisfiesWithoutRevalidation(req) {
			return !this.evaluateRequest(req).revalidation;
		}
		/**
		* @param {{headers: Record<string, string>, synchronous: boolean}|undefined} revalidation - Revalidation information, if any.
		* @returns {{response: {headers: Record<string, string>}, revalidation: {headers: Record<string, string>, synchronous: boolean}|undefined}} An object with a cached response headers and revalidation info.
		*/
		_evaluateRequestHitResult(revalidation) {
			return {
				response: { headers: this.responseHeaders() },
				revalidation
			};
		}
		/**
		* @param {HttpRequest} request - new incoming
		* @param {boolean} synchronous - whether revalidation must be synchronous (not s-w-r).
		* @returns {{headers: Record<string, string>, synchronous: boolean}} An object with revalidation headers and a synchronous flag.
		*/
		_evaluateRequestRevalidation(request, synchronous) {
			return {
				synchronous,
				headers: this.revalidationHeaders(request)
			};
		}
		/**
		* @param {HttpRequest} request - new incoming
		* @returns {{response: undefined, revalidation: {headers: Record<string, string>, synchronous: boolean}}} An object indicating no cached response and revalidation details.
		*/
		_evaluateRequestMissResult(request) {
			return {
				response: void 0,
				revalidation: this._evaluateRequestRevalidation(request, true)
			};
		}
		/**
		* Checks if the given request matches this cache entry, and how the cache can be used to satisfy it. Returns an object with:
		*
		* ```
		* {
		*     // If defined, you must send a request to the server.
		*     revalidation: {
		*         headers: {}, // HTTP headers to use when sending the revalidation response
		*         // If true, you MUST wait for a response from the server before using the cache
		*         // If false, this is stale-while-revalidate. The cache is stale, but you can use it while you update it asynchronously.
		*         synchronous: bool,
		*     },
		*     // If defined, you can use this cached response.
		*     response: {
		*         headers: {}, // Updated cached HTTP headers you must use when responding to the client
		*     },
		* }
		* ```
		* @param {HttpRequest} req - new incoming HTTP request
		* @returns {{response: {headers: Record<string, string>}|undefined, revalidation: {headers: Record<string, string>, synchronous: boolean}|undefined}} An object containing keys:
		*   - revalidation: { headers: Record<string, string>, synchronous: boolean } Set if you should send this to the origin server
		*   - response: { headers: Record<string, string> } Set if you can respond to the client with these cached headers
		*/
		evaluateRequest(req) {
			this._assertRequestHasHeaders(req);
			if (this._rescc["must-revalidate"]) return this._evaluateRequestMissResult(req);
			if (!this._requestMatches(req, false)) return this._evaluateRequestMissResult(req);
			const requestCC = parseCacheControl(req.headers["cache-control"]);
			if (requestCC["no-cache"] || /no-cache/.test(req.headers.pragma)) return this._evaluateRequestMissResult(req);
			if (requestCC["max-age"] && this.age() > toNumberOrZero(requestCC["max-age"])) return this._evaluateRequestMissResult(req);
			if (requestCC["min-fresh"] && this.maxAge() - this.age() < toNumberOrZero(requestCC["min-fresh"])) return this._evaluateRequestMissResult(req);
			if (this.stale()) {
				if ("max-stale" in requestCC && (true === requestCC["max-stale"] || requestCC["max-stale"] > this.age() - this.maxAge())) return this._evaluateRequestHitResult(void 0);
				if (this.useStaleWhileRevalidate()) return this._evaluateRequestHitResult(this._evaluateRequestRevalidation(req, false));
				return this._evaluateRequestMissResult(req);
			}
			return this._evaluateRequestHitResult(void 0);
		}
		/**
		* @param {HttpRequest} req - check if this is for the same cache entry
		* @param {boolean} allowHeadMethod - allow a HEAD method to match.
		* @returns {boolean} `true` if the request matches.
		*/
		_requestMatches(req, allowHeadMethod) {
			return !!((!this._url || this._url === req.url) && this._host === req.headers.host && (!req.method || this._method === req.method || allowHeadMethod && "HEAD" === req.method) && this._varyMatches(req));
		}
		/**
		* Determines whether storing authenticated responses is allowed.
		* @returns {boolean} `true` if allowed.
		*/
		_allowsStoringAuthenticated() {
			return !!(this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"]);
		}
		/**
		* Checks whether the Vary header in the response matches the new request.
		* @param {HttpRequest} req - incoming HTTP request
		* @returns {boolean} `true` if the vary headers match.
		*/
		_varyMatches(req) {
			if (!this._resHeaders.vary) return true;
			if (this._resHeaders.vary === "*") return false;
			const fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
			for (const name of fields) if (req.headers[name] !== this._reqHeaders[name]) return false;
			return true;
		}
		/**
		* Creates a copy of the given headers without any hop-by-hop headers.
		* @param {Record<string, string>} inHeaders - old headers from the cached response
		* @returns {Record<string, string>} A new headers object without hop-by-hop headers.
		*/
		_copyWithoutHopByHopHeaders(inHeaders) {
			/** @type {Record<string, string>} */
			const headers = {};
			for (const name in inHeaders) {
				if (hopByHopHeaders[name]) continue;
				headers[name] = inHeaders[name];
			}
			if (inHeaders.connection) {
				const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
				for (const name of tokens) delete headers[name];
			}
			if (headers.warning) {
				const warnings = headers.warning.split(/,/).filter((warning) => {
					return !/^\s*1[0-9][0-9]/.test(warning);
				});
				if (!warnings.length) delete headers.warning;
				else headers.warning = warnings.join(",").trim();
			}
			return headers;
		}
		/**
		* Returns the response headers adjusted for serving the cached response.
		* Removes hop-by-hop headers and updates the Age and Date headers.
		* @returns {Record<string, string>} The adjusted response headers.
		*/
		responseHeaders() {
			const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
			const age = this.age();
			if (age > 3600 * 24 && !this._hasExplicitExpiration() && this.maxAge() > 3600 * 24) headers.warning = (headers.warning ? `${headers.warning}, ` : "") + "113 - \"rfc7234 5.5.4\"";
			headers.age = `${Math.round(age)}`;
			headers.date = new Date(this.now()).toUTCString();
			return headers;
		}
		/**
		* Returns the Date header value from the response or the current time if invalid.
		* @returns {number} Timestamp (in milliseconds) representing the Date header or response time.
		*/
		date() {
			const serverDate = Date.parse(this._resHeaders.date);
			if (isFinite(serverDate)) return serverDate;
			return this._responseTime;
		}
		/**
		* Value of the Age header, in seconds, updated for the current time.
		* May be fractional.
		* @returns {number} The age in seconds.
		*/
		age() {
			return this._ageValue() + (this.now() - this._responseTime) / 1e3;
		}
		/**
		* @returns {number} The Age header value as a number.
		*/
		_ageValue() {
			return toNumberOrZero(this._resHeaders.age);
		}
		/**
		* Possibly outdated value of applicable max-age (or heuristic equivalent) in seconds.
		* This counts since response's `Date`.
		*
		* For an up-to-date value, see `timeToLive()`.
		*
		* Returns the maximum age (freshness lifetime) of the response in seconds.
		* @returns {number} The max-age value in seconds.
		*/
		maxAge() {
			if (!this.storable() || this._rescc["no-cache"]) return 0;
			if (this._isShared && this._resHeaders["set-cookie"] && !this._rescc.public && !this._rescc.immutable) return 0;
			if (this._resHeaders.vary === "*") return 0;
			if (this._isShared) {
				if (this._rescc["proxy-revalidate"]) return 0;
				if (this._rescc["s-maxage"]) return toNumberOrZero(this._rescc["s-maxage"]);
			}
			if (this._rescc["max-age"]) return toNumberOrZero(this._rescc["max-age"]);
			const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;
			const serverDate = this.date();
			if (this._resHeaders.expires) {
				const expires = Date.parse(this._resHeaders.expires);
				if (Number.isNaN(expires) || expires < serverDate) return 0;
				return Math.max(defaultMinTtl, (expires - serverDate) / 1e3);
			}
			if (this._resHeaders["last-modified"]) {
				const lastModified = Date.parse(this._resHeaders["last-modified"]);
				if (isFinite(lastModified) && serverDate > lastModified) return Math.max(defaultMinTtl, (serverDate - lastModified) / 1e3 * this._cacheHeuristic);
			}
			return defaultMinTtl;
		}
		/**
		* Remaining time this cache entry may be useful for, in *milliseconds*.
		* You can use this as an expiration time for your cache storage.
		*
		* Prefer this method over `maxAge()`, because it includes other factors like `age` and `stale-while-revalidate`.
		* @returns {number} Time-to-live in milliseconds.
		*/
		timeToLive() {
			const age = this.maxAge() - this.age();
			const staleIfErrorAge = age + toNumberOrZero(this._rescc["stale-if-error"]);
			const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc["stale-while-revalidate"]);
			return Math.round(Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1e3);
		}
		/**
		* If true, this cache entry is past its expiration date.
		* Note that stale cache may be useful sometimes, see `evaluateRequest()`.
		* @returns {boolean} `false` doesn't mean it's fresh nor usable
		*/
		stale() {
			return this.maxAge() <= this.age();
		}
		/**
		* @returns {boolean} `true` if `stale-if-error` condition allows use of a stale response.
		*/
		_useStaleIfError() {
			return this.maxAge() + toNumberOrZero(this._rescc["stale-if-error"]) > this.age();
		}
		/** See `evaluateRequest()` for a more complete solution
		* @returns {boolean} `true` if `stale-while-revalidate` is currently allowed.
		*/
		useStaleWhileRevalidate() {
			const swr = toNumberOrZero(this._rescc["stale-while-revalidate"]);
			return swr > 0 && this.maxAge() + swr > this.age();
		}
		/**
		* Creates a `CachePolicy` instance from a serialized object.
		* @param {Object} obj - The serialized object.
		* @returns {CachePolicy} A new CachePolicy instance.
		*/
		static fromObject(obj) {
			return new this(void 0, void 0, { _fromObject: obj });
		}
		/**
		* @param {any} obj - The serialized object.
		* @throws {Error} If already initialized or if the object is invalid.
		*/
		_fromObject(obj) {
			if (this._responseTime) throw Error("Reinitialized");
			if (!obj || obj.v !== 1) throw Error("Invalid serialization");
			this._responseTime = obj.t;
			this._isShared = obj.sh;
			this._cacheHeuristic = obj.ch;
			this._immutableMinTtl = obj.imm !== void 0 ? obj.imm : 24 * 3600 * 1e3;
			this._ignoreCargoCult = !!obj.icc;
			this._status = obj.st;
			this._resHeaders = obj.resh;
			this._rescc = obj.rescc;
			this._method = obj.m;
			this._url = obj.u;
			this._host = obj.h;
			this._noAuthorization = obj.a;
			this._reqHeaders = obj.reqh;
			this._reqcc = obj.reqcc;
		}
		/**
		* Serializes the `CachePolicy` instance into a JSON-serializable object.
		* @returns {Object} The serialized object.
		*/
		toObject() {
			return {
				v: 1,
				t: this._responseTime,
				sh: this._isShared,
				ch: this._cacheHeuristic,
				imm: this._immutableMinTtl,
				icc: this._ignoreCargoCult,
				st: this._status,
				resh: this._resHeaders,
				rescc: this._rescc,
				m: this._method,
				u: this._url,
				h: this._host,
				a: this._noAuthorization,
				reqh: this._reqHeaders,
				reqcc: this._reqcc
			};
		}
		/**
		* Headers for sending to the origin server to revalidate stale response.
		* Allows server to return 304 to allow reuse of the previous response.
		*
		* Hop by hop headers are always stripped.
		* Revalidation headers may be added or removed, depending on request.
		* @param {HttpRequest} incomingReq - The incoming HTTP request.
		* @returns {Record<string, string>} The headers for the revalidation request.
		*/
		revalidationHeaders(incomingReq) {
			this._assertRequestHasHeaders(incomingReq);
			const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);
			delete headers["if-range"];
			if (!this._requestMatches(incomingReq, true) || !this.storable()) {
				delete headers["if-none-match"];
				delete headers["if-modified-since"];
				return headers;
			}
			if (this._resHeaders.etag) headers["if-none-match"] = headers["if-none-match"] ? `${headers["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.etag;
			if (headers["accept-ranges"] || headers["if-match"] || headers["if-unmodified-since"] || this._method && this._method != "GET") {
				delete headers["if-modified-since"];
				if (headers["if-none-match"]) {
					const etags = headers["if-none-match"].split(/,/).filter((etag) => {
						return !/^\s*W\//.test(etag);
					});
					if (!etags.length) delete headers["if-none-match"];
					else headers["if-none-match"] = etags.join(",").trim();
				}
			} else if (this._resHeaders["last-modified"] && !headers["if-modified-since"]) headers["if-modified-since"] = this._resHeaders["last-modified"];
			return headers;
		}
		/**
		* Creates new CachePolicy with information combined from the previews response,
		* and the new revalidation response.
		*
		* Returns {policy, modified} where modified is a boolean indicating
		* whether the response body has been modified, and old cached body can't be used.
		*
		* @param {HttpRequest} request - The latest HTTP request asking for the cached entry.
		* @param {HttpResponse} response - The latest revalidation HTTP response from the origin server.
		* @returns {{policy: CachePolicy, modified: boolean, matches: boolean}} The updated policy and modification status.
		* @throws {Error} If the response headers are missing.
		*/
		revalidatedPolicy(request, response) {
			this._assertRequestHasHeaders(request);
			if (this._useStaleIfError() && isErrorResponse(response)) return {
				policy: this,
				modified: false,
				matches: true
			};
			if (!response || !response.headers) throw Error("Response headers missing");
			let matches = false;
			if (response.status !== void 0 && response.status != 304) matches = false;
			else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag;
			else if (this._resHeaders.etag && response.headers.etag) matches = this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag.replace(/^\s*W\//, "");
			else if (this._resHeaders["last-modified"]) matches = this._resHeaders["last-modified"] === response.headers["last-modified"];
			else if (!this._resHeaders.etag && !this._resHeaders["last-modified"] && !response.headers.etag && !response.headers["last-modified"]) matches = true;
			const optionsCopy = {
				shared: this._isShared,
				cacheHeuristic: this._cacheHeuristic,
				immutableMinTimeToLive: this._immutableMinTtl,
				ignoreCargoCult: this._ignoreCargoCult
			};
			if (!matches) return {
				policy: new this.constructor(request, response, optionsCopy),
				modified: response.status != 304,
				matches: false
			};
			const headers = {};
			for (const k in this._resHeaders) headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
			const newResponse = Object.assign({}, response, {
				status: this._status,
				method: this._method,
				headers
			});
			return {
				policy: new this.constructor(request, newResponse, optionsCopy),
				modified: false,
				matches: true
			};
		}
	};
}));
//#endregion
//#region node_modules/lowercase-keys/index.js
var require_lowercase_keys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (object) => {
		const result = {};
		for (const [key, value] of Object.entries(object)) result[key.toLowerCase()] = value;
		return result;
	};
}));
//#endregion
//#region node_modules/responselike/src/index.js
var require_src$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Readable$1 = __require("stream").Readable;
	var lowercaseKeys = require_lowercase_keys();
	var Response = class extends Readable$1 {
		constructor(statusCode, headers, body, url) {
			if (typeof statusCode !== "number") throw new TypeError("Argument `statusCode` should be a number");
			if (typeof headers !== "object") throw new TypeError("Argument `headers` should be an object");
			if (!(body instanceof Buffer)) throw new TypeError("Argument `body` should be a buffer");
			if (typeof url !== "string") throw new TypeError("Argument `url` should be a string");
			super();
			this.statusCode = statusCode;
			this.headers = lowercaseKeys(headers);
			this.body = body;
			this.url = url;
		}
		_read() {
			this.push(this.body);
			this.push(null);
		}
	};
	module.exports = Response;
}));
//#endregion
//#region node_modules/mimic-response/index.js
var require_mimic_response$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var knownProps = [
		"destroy",
		"setTimeout",
		"socket",
		"headers",
		"trailers",
		"rawHeaders",
		"statusCode",
		"httpVersion",
		"httpVersionMinor",
		"httpVersionMajor",
		"rawTrailers",
		"statusMessage"
	];
	module.exports = (fromStream, toStream) => {
		const fromProps = new Set(Object.keys(fromStream).concat(knownProps));
		for (const prop of fromProps) {
			if (prop in toStream) continue;
			toStream[prop] = typeof fromStream[prop] === "function" ? fromStream[prop].bind(fromStream) : fromStream[prop];
		}
	};
}));
//#endregion
//#region node_modules/clone-response/src/index.js
var require_src$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var PassThrough$1 = __require("stream").PassThrough;
	var mimicResponse = require_mimic_response$1();
	var cloneResponse = (response) => {
		if (!(response && response.pipe)) throw new TypeError("Parameter `response` must be a response stream.");
		const clone = new PassThrough$1();
		mimicResponse(response, clone);
		return response.pipe(clone);
	};
	module.exports = cloneResponse;
}));
//#endregion
//#region node_modules/json-buffer/index.js
var require_json_buffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.stringify = function stringify(o) {
		if ("undefined" == typeof o) return o;
		if (o && Buffer.isBuffer(o)) return JSON.stringify(":base64:" + o.toString("base64"));
		if (o && o.toJSON) o = o.toJSON();
		if (o && "object" === typeof o) {
			var s = "";
			var array = Array.isArray(o);
			s = array ? "[" : "{";
			var first = true;
			for (var k in o) {
				var ignore = "function" == typeof o[k] || !array && "undefined" === typeof o[k];
				if (Object.hasOwnProperty.call(o, k) && !ignore) {
					if (!first) s += ",";
					first = false;
					if (array) if (o[k] == void 0) s += "null";
					else s += stringify(o[k]);
					else if (o[k] !== void 0) s += stringify(k) + ":" + stringify(o[k]);
				}
			}
			s += array ? "]" : "}";
			return s;
		} else if ("string" === typeof o) return JSON.stringify(/^:/.test(o) ? ":" + o : o);
		else if ("undefined" === typeof o) return "null";
		else return JSON.stringify(o);
	};
	exports.parse = function(s) {
		return JSON.parse(s, function(key, value) {
			if ("string" === typeof value) if (/^:base64:/.test(value)) return Buffer.from(value.substring(8), "base64");
			else return /^:/.test(value) ? value.substring(1) : value;
			return value;
		});
	};
}));
//#endregion
//#region node_modules/keyv/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$2 = __require("events");
	var JSONB = require_json_buffer();
	var loadStore = (options) => {
		const adapters = {
			redis: "@keyv/redis",
			rediss: "@keyv/redis",
			mongodb: "@keyv/mongo",
			mongo: "@keyv/mongo",
			sqlite: "@keyv/sqlite",
			postgresql: "@keyv/postgres",
			postgres: "@keyv/postgres",
			mysql: "@keyv/mysql",
			etcd: "@keyv/etcd",
			offline: "@keyv/offline",
			tiered: "@keyv/tiered"
		};
		if (options.adapter || options.uri) return new (__require(adapters[options.adapter || /^[^:+]*/.exec(options.uri)[0]]))(options);
		return /* @__PURE__ */ new Map();
	};
	var iterableAdapters = [
		"sqlite",
		"postgres",
		"mysql",
		"mongo",
		"redis",
		"tiered"
	];
	var Keyv = class extends EventEmitter$2 {
		constructor(uri, { emitErrors = true, ...options } = {}) {
			super();
			this.opts = {
				namespace: "keyv",
				serialize: JSONB.stringify,
				deserialize: JSONB.parse,
				...typeof uri === "string" ? { uri } : uri,
				...options
			};
			if (!this.opts.store) {
				const adapterOptions = { ...this.opts };
				this.opts.store = loadStore(adapterOptions);
			}
			if (this.opts.compression) {
				const compression = this.opts.compression;
				this.opts.serialize = compression.serialize.bind(compression);
				this.opts.deserialize = compression.deserialize.bind(compression);
			}
			if (typeof this.opts.store.on === "function" && emitErrors) this.opts.store.on("error", (error) => this.emit("error", error));
			this.opts.store.namespace = this.opts.namespace;
			const generateIterator = (iterator) => async function* () {
				for await (const [key, raw] of typeof iterator === "function" ? iterator(this.opts.store.namespace) : iterator) {
					const data = await this.opts.deserialize(raw);
					if (this.opts.store.namespace && !key.includes(this.opts.store.namespace)) continue;
					if (typeof data.expires === "number" && Date.now() > data.expires) {
						this.delete(key);
						continue;
					}
					yield [this._getKeyUnprefix(key), data.value];
				}
			};
			if (typeof this.opts.store[Symbol.iterator] === "function" && this.opts.store instanceof Map) this.iterator = generateIterator(this.opts.store);
			else if (typeof this.opts.store.iterator === "function" && this.opts.store.opts && this._checkIterableAdaptar()) this.iterator = generateIterator(this.opts.store.iterator.bind(this.opts.store));
		}
		_checkIterableAdaptar() {
			return iterableAdapters.includes(this.opts.store.opts.dialect) || iterableAdapters.findIndex((element) => this.opts.store.opts.url.includes(element)) >= 0;
		}
		_getKeyPrefix(key) {
			return `${this.opts.namespace}:${key}`;
		}
		_getKeyPrefixArray(keys) {
			return keys.map((key) => `${this.opts.namespace}:${key}`);
		}
		_getKeyUnprefix(key) {
			return key.split(":").splice(1).join(":");
		}
		get(key, options) {
			const { store } = this.opts;
			const isArray = Array.isArray(key);
			const keyPrefixed = isArray ? this._getKeyPrefixArray(key) : this._getKeyPrefix(key);
			if (isArray && store.getMany === void 0) {
				const promises = [];
				for (const key of keyPrefixed) promises.push(Promise.resolve().then(() => store.get(key)).then((data) => typeof data === "string" ? this.opts.deserialize(data) : this.opts.compression ? this.opts.deserialize(data) : data).then((data) => {
					if (data === void 0 || data === null) return;
					if (typeof data.expires === "number" && Date.now() > data.expires) return this.delete(key).then(() => void 0);
					return options && options.raw ? data : data.value;
				}));
				return Promise.allSettled(promises).then((values) => {
					const data = [];
					for (const value of values) data.push(value.value);
					return data;
				});
			}
			return Promise.resolve().then(() => isArray ? store.getMany(keyPrefixed) : store.get(keyPrefixed)).then((data) => typeof data === "string" ? this.opts.deserialize(data) : this.opts.compression ? this.opts.deserialize(data) : data).then((data) => {
				if (data === void 0 || data === null) return;
				if (isArray) return data.map((row, index) => {
					if (typeof row === "string") row = this.opts.deserialize(row);
					if (row === void 0 || row === null) return;
					if (typeof row.expires === "number" && Date.now() > row.expires) {
						this.delete(key[index]).then(() => void 0);
						return;
					}
					return options && options.raw ? row : row.value;
				});
				if (typeof data.expires === "number" && Date.now() > data.expires) return this.delete(key).then(() => void 0);
				return options && options.raw ? data : data.value;
			});
		}
		set(key, value, ttl) {
			const keyPrefixed = this._getKeyPrefix(key);
			if (typeof ttl === "undefined") ttl = this.opts.ttl;
			if (ttl === 0) ttl = void 0;
			const { store } = this.opts;
			return Promise.resolve().then(() => {
				const expires = typeof ttl === "number" ? Date.now() + ttl : null;
				if (typeof value === "symbol") this.emit("error", "symbol cannot be serialized");
				value = {
					value,
					expires
				};
				return this.opts.serialize(value);
			}).then((value) => store.set(keyPrefixed, value, ttl)).then(() => true);
		}
		delete(key) {
			const { store } = this.opts;
			if (Array.isArray(key)) {
				const keyPrefixed = this._getKeyPrefixArray(key);
				if (store.deleteMany === void 0) {
					const promises = [];
					for (const key of keyPrefixed) promises.push(store.delete(key));
					return Promise.allSettled(promises).then((values) => values.every((x) => x.value === true));
				}
				return Promise.resolve().then(() => store.deleteMany(keyPrefixed));
			}
			const keyPrefixed = this._getKeyPrefix(key);
			return Promise.resolve().then(() => store.delete(keyPrefixed));
		}
		clear() {
			const { store } = this.opts;
			return Promise.resolve().then(() => store.clear());
		}
		has(key) {
			const keyPrefixed = this._getKeyPrefix(key);
			const { store } = this.opts;
			return Promise.resolve().then(async () => {
				if (typeof store.has === "function") return store.has(keyPrefixed);
				return await store.get(keyPrefixed) !== void 0;
			});
		}
		disconnect() {
			const { store } = this.opts;
			if (typeof store.disconnect === "function") return store.disconnect();
		}
	};
	module.exports = Keyv;
}));
//#endregion
//#region node_modules/cacheable-request/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$1 = __require("events");
	var urlLib = __require("url");
	var normalizeUrl = require_normalize_url();
	var getStream = require_get_stream();
	var CachePolicy = require_http_cache_semantics();
	var Response = require_src$3();
	var lowercaseKeys = require_lowercase_keys();
	var cloneResponse = require_src$2();
	var Keyv = require_src$1();
	var CacheableRequest = class CacheableRequest {
		constructor(request, cacheAdapter) {
			if (typeof request !== "function") throw new TypeError("Parameter `request` must be a function");
			this.cache = new Keyv({
				uri: typeof cacheAdapter === "string" && cacheAdapter,
				store: typeof cacheAdapter !== "string" && cacheAdapter,
				namespace: "cacheable-request"
			});
			return this.createCacheableRequest(request);
		}
		createCacheableRequest(request) {
			return (opts, cb) => {
				let url;
				if (typeof opts === "string") {
					url = normalizeUrlObject(urlLib.parse(opts));
					opts = {};
				} else if (opts instanceof urlLib.URL) {
					url = normalizeUrlObject(urlLib.parse(opts.toString()));
					opts = {};
				} else {
					const [pathname, ...searchParts] = (opts.path || "").split("?");
					const search = searchParts.length > 0 ? `?${searchParts.join("?")}` : "";
					url = normalizeUrlObject({
						...opts,
						pathname,
						search
					});
				}
				opts = {
					headers: {},
					method: "GET",
					cache: true,
					strictTtl: false,
					automaticFailover: false,
					...opts,
					...urlObjectToRequestOptions(url)
				};
				opts.headers = lowercaseKeys(opts.headers);
				const ee = new EventEmitter$1();
				const normalizedUrlString = normalizeUrl(urlLib.format(url), {
					stripWWW: false,
					removeTrailingSlash: false,
					stripAuthentication: false
				});
				const key = `${opts.method}:${normalizedUrlString}`;
				let revalidate = false;
				let madeRequest = false;
				const makeRequest = (opts) => {
					madeRequest = true;
					let requestErrored = false;
					let requestErrorCallback;
					const requestErrorPromise = new Promise((resolve) => {
						requestErrorCallback = () => {
							if (!requestErrored) {
								requestErrored = true;
								resolve();
							}
						};
					});
					const handler = (response) => {
						if (revalidate && !opts.forceRefresh) {
							response.status = response.statusCode;
							const revalidatedPolicy = CachePolicy.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts, response);
							if (!revalidatedPolicy.modified) {
								const headers = revalidatedPolicy.policy.responseHeaders();
								response = new Response(revalidate.statusCode, headers, revalidate.body, revalidate.url);
								response.cachePolicy = revalidatedPolicy.policy;
								response.fromCache = true;
							}
						}
						if (!response.fromCache) {
							response.cachePolicy = new CachePolicy(opts, response, opts);
							response.fromCache = false;
						}
						let clonedResponse;
						if (opts.cache && response.cachePolicy.storable()) {
							clonedResponse = cloneResponse(response);
							(async () => {
								try {
									const bodyPromise = getStream.buffer(response);
									await Promise.race([requestErrorPromise, new Promise((resolve) => response.once("end", resolve))]);
									if (requestErrored) return;
									const body = await bodyPromise;
									const value = {
										cachePolicy: response.cachePolicy.toObject(),
										url: response.url,
										statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
										body
									};
									let ttl = opts.strictTtl ? response.cachePolicy.timeToLive() : void 0;
									if (opts.maxTtl) ttl = ttl ? Math.min(ttl, opts.maxTtl) : opts.maxTtl;
									await this.cache.set(key, value, ttl);
								} catch (error) {
									ee.emit("error", new CacheableRequest.CacheError(error));
								}
							})();
						} else if (opts.cache && revalidate) (async () => {
							try {
								await this.cache.delete(key);
							} catch (error) {
								ee.emit("error", new CacheableRequest.CacheError(error));
							}
						})();
						ee.emit("response", clonedResponse || response);
						if (typeof cb === "function") cb(clonedResponse || response);
					};
					try {
						const req = request(opts, handler);
						req.once("error", requestErrorCallback);
						req.once("abort", requestErrorCallback);
						ee.emit("request", req);
					} catch (error) {
						ee.emit("error", new CacheableRequest.RequestError(error));
					}
				};
				(async () => {
					const get = async (opts) => {
						await Promise.resolve();
						const cacheEntry = opts.cache ? await this.cache.get(key) : void 0;
						if (typeof cacheEntry === "undefined") return makeRequest(opts);
						const policy = CachePolicy.fromObject(cacheEntry.cachePolicy);
						if (policy.satisfiesWithoutRevalidation(opts) && !opts.forceRefresh) {
							const headers = policy.responseHeaders();
							const response = new Response(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
							response.cachePolicy = policy;
							response.fromCache = true;
							ee.emit("response", response);
							if (typeof cb === "function") cb(response);
						} else {
							revalidate = cacheEntry;
							opts.headers = policy.revalidationHeaders(opts);
							makeRequest(opts);
						}
					};
					const errorHandler = (error) => ee.emit("error", new CacheableRequest.CacheError(error));
					this.cache.once("error", errorHandler);
					ee.on("response", () => this.cache.removeListener("error", errorHandler));
					try {
						await get(opts);
					} catch (error) {
						if (opts.automaticFailover && !madeRequest) makeRequest(opts);
						ee.emit("error", new CacheableRequest.CacheError(error));
					}
				})();
				return ee;
			};
		}
	};
	function urlObjectToRequestOptions(url) {
		const options = { ...url };
		options.path = `${url.pathname || "/"}${url.search || ""}`;
		delete options.pathname;
		delete options.search;
		return options;
	}
	function normalizeUrlObject(url) {
		return {
			protocol: url.protocol,
			auth: url.auth,
			hostname: url.hostname || url.host || "localhost",
			port: url.port,
			pathname: url.pathname,
			search: url.search
		};
	}
	CacheableRequest.RequestError = class extends Error {
		constructor(error) {
			super(error.message);
			this.name = "RequestError";
			Object.assign(this, error);
		}
	};
	CacheableRequest.CacheError = class extends Error {
		constructor(error) {
			super(error.message);
			this.name = "CacheError";
			Object.assign(this, error);
		}
	};
	module.exports = CacheableRequest;
}));
//#endregion
//#region node_modules/decompress-response/node_modules/mimic-response/index.js
var require_mimic_response = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var knownProperties = [
		"aborted",
		"complete",
		"headers",
		"httpVersion",
		"httpVersionMinor",
		"httpVersionMajor",
		"method",
		"rawHeaders",
		"rawTrailers",
		"setTimeout",
		"socket",
		"statusCode",
		"statusMessage",
		"trailers",
		"url"
	];
	module.exports = (fromStream, toStream) => {
		if (toStream._readableState.autoDestroy) throw new Error("The second stream must have the `autoDestroy` option set to `false`");
		const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));
		const properties = {};
		for (const property of fromProperties) {
			if (property in toStream) continue;
			properties[property] = {
				get() {
					const value = fromStream[property];
					return typeof value === "function" ? value.bind(fromStream) : value;
				},
				set(value) {
					fromStream[property] = value;
				},
				enumerable: true,
				configurable: false
			};
		}
		Object.defineProperties(toStream, properties);
		fromStream.once("aborted", () => {
			toStream.destroy();
			toStream.emit("aborted");
		});
		fromStream.once("close", () => {
			if (fromStream.complete) if (toStream.readable) toStream.once("end", () => {
				toStream.emit("close");
			});
			else toStream.emit("close");
			else toStream.emit("close");
		});
		return toStream;
	};
}));
//#endregion
//#region node_modules/decompress-response/index.js
var require_decompress_response = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Transform, PassThrough } = __require("stream");
	var zlib = __require("zlib");
	var mimicResponse = require_mimic_response();
	module.exports = (response) => {
		const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
		if (![
			"gzip",
			"deflate",
			"br"
		].includes(contentEncoding)) return response;
		const isBrotli = contentEncoding === "br";
		if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
			response.destroy(/* @__PURE__ */ new Error("Brotli is not supported on Node.js < 12"));
			return response;
		}
		let isEmpty = true;
		const checker = new Transform({
			transform(data, _encoding, callback) {
				isEmpty = false;
				callback(null, data);
			},
			flush(callback) {
				callback();
			}
		});
		const finalStream = new PassThrough({
			autoDestroy: false,
			destroy(error, callback) {
				response.destroy();
				callback(error);
			}
		});
		const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
		decompressStream.once("error", (error) => {
			if (isEmpty && !response.readable) {
				finalStream.end();
				return;
			}
			finalStream.destroy(error);
		});
		mimicResponse(response, finalStream);
		response.pipe(checker).pipe(decompressStream).pipe(finalStream);
		return finalStream;
	};
}));
//#endregion
//#region node_modules/quick-lru/index.js
var require_quick_lru = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var QuickLRU = class {
		constructor(options = {}) {
			if (!(options.maxSize && options.maxSize > 0)) throw new TypeError("`maxSize` must be a number greater than 0");
			this.maxSize = options.maxSize;
			this.onEviction = options.onEviction;
			this.cache = /* @__PURE__ */ new Map();
			this.oldCache = /* @__PURE__ */ new Map();
			this._size = 0;
		}
		_set(key, value) {
			this.cache.set(key, value);
			this._size++;
			if (this._size >= this.maxSize) {
				this._size = 0;
				if (typeof this.onEviction === "function") for (const [key, value] of this.oldCache.entries()) this.onEviction(key, value);
				this.oldCache = this.cache;
				this.cache = /* @__PURE__ */ new Map();
			}
		}
		get(key) {
			if (this.cache.has(key)) return this.cache.get(key);
			if (this.oldCache.has(key)) {
				const value = this.oldCache.get(key);
				this.oldCache.delete(key);
				this._set(key, value);
				return value;
			}
		}
		set(key, value) {
			if (this.cache.has(key)) this.cache.set(key, value);
			else this._set(key, value);
			return this;
		}
		has(key) {
			return this.cache.has(key) || this.oldCache.has(key);
		}
		peek(key) {
			if (this.cache.has(key)) return this.cache.get(key);
			if (this.oldCache.has(key)) return this.oldCache.get(key);
		}
		delete(key) {
			const deleted = this.cache.delete(key);
			if (deleted) this._size--;
			return this.oldCache.delete(key) || deleted;
		}
		clear() {
			this.cache.clear();
			this.oldCache.clear();
			this._size = 0;
		}
		*keys() {
			for (const [key] of this) yield key;
		}
		*values() {
			for (const [, value] of this) yield value;
		}
		*[Symbol.iterator]() {
			for (const item of this.cache) yield item;
			for (const item of this.oldCache) {
				const [key] = item;
				if (!this.cache.has(key)) yield item;
			}
		}
		get size() {
			let oldCacheSize = 0;
			for (const key of this.oldCache.keys()) if (!this.cache.has(key)) oldCacheSize++;
			return Math.min(this._size + oldCacheSize, this.maxSize);
		}
	};
	module.exports = QuickLRU;
}));
//#endregion
//#region node_modules/http2-wrapper/source/agent.js
var require_agent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = __require("events");
	var tls$1 = __require("tls");
	var http2$2 = __require("http2");
	var QuickLRU = require_quick_lru();
	var kCurrentStreamsCount = Symbol("currentStreamsCount");
	var kRequest = Symbol("request");
	var kOriginSet = Symbol("cachedOriginSet");
	var kGracefullyClosing = Symbol("gracefullyClosing");
	var nameKeys = [
		"maxDeflateDynamicTableSize",
		"maxSessionMemory",
		"maxHeaderListPairs",
		"maxOutstandingPings",
		"maxReservedRemoteStreams",
		"maxSendHeaderBlockLength",
		"paddingStrategy",
		"localAddress",
		"path",
		"rejectUnauthorized",
		"minDHSize",
		"ca",
		"cert",
		"clientCertEngine",
		"ciphers",
		"key",
		"pfx",
		"servername",
		"minVersion",
		"maxVersion",
		"secureProtocol",
		"crl",
		"honorCipherOrder",
		"ecdhCurve",
		"dhparam",
		"secureOptions",
		"sessionIdContext"
	];
	var getSortedIndex = (array, value, compare) => {
		let low = 0;
		let high = array.length;
		while (low < high) {
			const mid = low + high >>> 1;
			/* istanbul ignore next */
			if (compare(array[mid], value)) low = mid + 1;
			else high = mid;
		}
		return low;
	};
	var compareSessions = (a, b) => {
		return a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
	};
	var closeCoveredSessions = (where, session) => {
		for (const coveredSession of where) if (coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams) gracefullyClose(coveredSession);
	};
	var closeSessionIfCovered = (where, coveredSession) => {
		for (const session of where) if (coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams) gracefullyClose(coveredSession);
	};
	var getSessions = ({ agent, isFree }) => {
		const result = {};
		for (const normalizedOptions in agent.sessions) {
			const filtered = agent.sessions[normalizedOptions].filter((session) => {
				const result = session[Agent.kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;
				return isFree ? result : !result;
			});
			if (filtered.length !== 0) result[normalizedOptions] = filtered;
		}
		return result;
	};
	var gracefullyClose = (session) => {
		session[kGracefullyClosing] = true;
		if (session[kCurrentStreamsCount] === 0) session.close();
	};
	var Agent = class Agent extends EventEmitter {
		constructor({ timeout = 6e4, maxSessions = Infinity, maxFreeSessions = 10, maxCachedTlsSessions = 100 } = {}) {
			super();
			this.sessions = {};
			this.queue = {};
			this.timeout = timeout;
			this.maxSessions = maxSessions;
			this.maxFreeSessions = maxFreeSessions;
			this._freeSessionsCount = 0;
			this._sessionsCount = 0;
			this.settings = { enablePush: false };
			this.tlsSessionCache = new QuickLRU({ maxSize: maxCachedTlsSessions });
		}
		static normalizeOrigin(url, servername) {
			if (typeof url === "string") url = new URL(url);
			if (servername && url.hostname !== servername) url.hostname = servername;
			return url.origin;
		}
		normalizeOptions(options) {
			let normalized = "";
			if (options) {
				for (const key of nameKeys) if (options[key]) normalized += `:${options[key]}`;
			}
			return normalized;
		}
		_tryToCreateNewSession(normalizedOptions, normalizedOrigin) {
			if (!(normalizedOptions in this.queue) || !(normalizedOrigin in this.queue[normalizedOptions])) return;
			const item = this.queue[normalizedOptions][normalizedOrigin];
			if (this._sessionsCount < this.maxSessions && !item.completed) {
				item.completed = true;
				item();
			}
		}
		getSession(origin, options, listeners) {
			return new Promise((resolve, reject) => {
				if (Array.isArray(listeners)) {
					listeners = [...listeners];
					resolve();
				} else listeners = [{
					resolve,
					reject
				}];
				const normalizedOptions = this.normalizeOptions(options);
				const normalizedOrigin = Agent.normalizeOrigin(origin, options && options.servername);
				if (normalizedOrigin === void 0) {
					for (const { reject } of listeners) reject(/* @__PURE__ */ new TypeError("The `origin` argument needs to be a string or an URL object"));
					return;
				}
				if (normalizedOptions in this.sessions) {
					const sessions = this.sessions[normalizedOptions];
					let maxConcurrentStreams = -1;
					let currentStreamsCount = -1;
					let optimalSession;
					for (const session of sessions) {
						const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;
						if (sessionMaxConcurrentStreams < maxConcurrentStreams) break;
						if (session[kOriginSet].includes(normalizedOrigin)) {
							const sessionCurrentStreamsCount = session[kCurrentStreamsCount];
							if (sessionCurrentStreamsCount >= sessionMaxConcurrentStreams || session[kGracefullyClosing] || session.destroyed) continue;
							if (!optimalSession) maxConcurrentStreams = sessionMaxConcurrentStreams;
							if (sessionCurrentStreamsCount > currentStreamsCount) {
								optimalSession = session;
								currentStreamsCount = sessionCurrentStreamsCount;
							}
						}
					}
					if (optimalSession) {
						/* istanbul ignore next: safety check */
						if (listeners.length !== 1) {
							for (const { reject } of listeners) reject(/* @__PURE__ */ new Error(`Expected the length of listeners to be 1, got ${listeners.length}.\nPlease report this to https://github.com/szmarczak/http2-wrapper/`));
							return;
						}
						listeners[0].resolve(optimalSession);
						return;
					}
				}
				if (normalizedOptions in this.queue) {
					if (normalizedOrigin in this.queue[normalizedOptions]) {
						this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);
						this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
						return;
					}
				} else this.queue[normalizedOptions] = {};
				const removeFromQueue = () => {
					if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
						delete this.queue[normalizedOptions][normalizedOrigin];
						if (Object.keys(this.queue[normalizedOptions]).length === 0) delete this.queue[normalizedOptions];
					}
				};
				const entry = () => {
					const name = `${normalizedOrigin}:${normalizedOptions}`;
					let receivedSettings = false;
					try {
						const session = http2$2.connect(origin, {
							createConnection: this.createConnection,
							settings: this.settings,
							session: this.tlsSessionCache.get(name),
							...options
						});
						session[kCurrentStreamsCount] = 0;
						session[kGracefullyClosing] = false;
						const isFree = () => session[kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;
						let wasFree = true;
						session.socket.once("session", (tlsSession) => {
							this.tlsSessionCache.set(name, tlsSession);
						});
						session.once("error", (error) => {
							for (const { reject } of listeners) reject(error);
							this.tlsSessionCache.delete(name);
						});
						session.setTimeout(this.timeout, () => {
							session.destroy();
						});
						session.once("close", () => {
							if (receivedSettings) {
								if (wasFree) this._freeSessionsCount--;
								this._sessionsCount--;
								const where = this.sessions[normalizedOptions];
								where.splice(where.indexOf(session), 1);
								if (where.length === 0) delete this.sessions[normalizedOptions];
							} else {
								const error = /* @__PURE__ */ new Error("Session closed without receiving a SETTINGS frame");
								error.code = "HTTP2WRAPPER_NOSETTINGS";
								for (const { reject } of listeners) reject(error);
								removeFromQueue();
							}
							this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
						});
						const processListeners = () => {
							if (!(normalizedOptions in this.queue) || !isFree()) return;
							for (const origin of session[kOriginSet]) if (origin in this.queue[normalizedOptions]) {
								const { listeners } = this.queue[normalizedOptions][origin];
								while (listeners.length !== 0 && isFree()) listeners.shift().resolve(session);
								const where = this.queue[normalizedOptions];
								if (where[origin].listeners.length === 0) {
									delete where[origin];
									if (Object.keys(where).length === 0) {
										delete this.queue[normalizedOptions];
										break;
									}
								}
								if (!isFree()) break;
							}
						};
						session.on("origin", () => {
							session[kOriginSet] = session.originSet;
							if (!isFree()) return;
							processListeners();
							closeCoveredSessions(this.sessions[normalizedOptions], session);
						});
						session.once("remoteSettings", () => {
							session.ref();
							session.unref();
							this._sessionsCount++;
							if (entry.destroyed) {
								const error = /* @__PURE__ */ new Error("Agent has been destroyed");
								for (const listener of listeners) listener.reject(error);
								session.destroy();
								return;
							}
							session[kOriginSet] = session.originSet;
							{
								const where = this.sessions;
								if (normalizedOptions in where) {
									const sessions = where[normalizedOptions];
									sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
								} else where[normalizedOptions] = [session];
							}
							this._freeSessionsCount += 1;
							receivedSettings = true;
							this.emit("session", session);
							processListeners();
							removeFromQueue();
							if (session[kCurrentStreamsCount] === 0 && this._freeSessionsCount > this.maxFreeSessions) session.close();
							if (listeners.length !== 0) {
								this.getSession(normalizedOrigin, options, listeners);
								listeners.length = 0;
							}
							session.on("remoteSettings", () => {
								processListeners();
								closeCoveredSessions(this.sessions[normalizedOptions], session);
							});
						});
						session[kRequest] = session.request;
						session.request = (headers, streamOptions) => {
							if (session[kGracefullyClosing]) throw new Error("The session is gracefully closing. No new streams are allowed.");
							const stream = session[kRequest](headers, streamOptions);
							session.ref();
							++session[kCurrentStreamsCount];
							if (session[kCurrentStreamsCount] === session.remoteSettings.maxConcurrentStreams) this._freeSessionsCount--;
							stream.once("close", () => {
								wasFree = isFree();
								--session[kCurrentStreamsCount];
								if (!session.destroyed && !session.closed) {
									closeSessionIfCovered(this.sessions[normalizedOptions], session);
									if (isFree() && !session.closed) {
										if (!wasFree) {
											this._freeSessionsCount++;
											wasFree = true;
										}
										const isEmpty = session[kCurrentStreamsCount] === 0;
										if (isEmpty) session.unref();
										if (isEmpty && (this._freeSessionsCount > this.maxFreeSessions || session[kGracefullyClosing])) session.close();
										else {
											closeCoveredSessions(this.sessions[normalizedOptions], session);
											processListeners();
										}
									}
								}
							});
							return stream;
						};
					} catch (error) {
						for (const listener of listeners) listener.reject(error);
						removeFromQueue();
					}
				};
				entry.listeners = listeners;
				entry.completed = false;
				entry.destroyed = false;
				this.queue[normalizedOptions][normalizedOrigin] = entry;
				this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
			});
		}
		request(origin, options, headers, streamOptions) {
			return new Promise((resolve, reject) => {
				this.getSession(origin, options, [{
					reject,
					resolve: (session) => {
						try {
							resolve(session.request(headers, streamOptions));
						} catch (error) {
							reject(error);
						}
					}
				}]);
			});
		}
		createConnection(origin, options) {
			return Agent.connect(origin, options);
		}
		static connect(origin, options) {
			options.ALPNProtocols = ["h2"];
			const port = origin.port || 443;
			const host = origin.hostname || origin.host;
			if (typeof options.servername === "undefined") options.servername = host;
			return tls$1.connect(port, host, options);
		}
		closeFreeSessions() {
			for (const sessions of Object.values(this.sessions)) for (const session of sessions) if (session[kCurrentStreamsCount] === 0) session.close();
		}
		destroy(reason) {
			for (const sessions of Object.values(this.sessions)) for (const session of sessions) session.destroy(reason);
			for (const entriesOfAuthority of Object.values(this.queue)) for (const entry of Object.values(entriesOfAuthority)) entry.destroyed = true;
			this.queue = {};
		}
		get freeSessions() {
			return getSessions({
				agent: this,
				isFree: true
			});
		}
		get busySessions() {
			return getSessions({
				agent: this,
				isFree: false
			});
		}
	};
	Agent.kCurrentStreamsCount = kCurrentStreamsCount;
	Agent.kGracefullyClosing = kGracefullyClosing;
	module.exports = {
		Agent,
		globalAgent: new Agent()
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/incoming-message.js
var require_incoming_message = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Readable } = __require("stream");
	var IncomingMessage = class extends Readable {
		constructor(socket, highWaterMark) {
			super({
				highWaterMark,
				autoDestroy: false
			});
			this.statusCode = null;
			this.statusMessage = "";
			this.httpVersion = "2.0";
			this.httpVersionMajor = 2;
			this.httpVersionMinor = 0;
			this.headers = {};
			this.trailers = {};
			this.req = null;
			this.aborted = false;
			this.complete = false;
			this.upgrade = null;
			this.rawHeaders = [];
			this.rawTrailers = [];
			this.socket = socket;
			this.connection = socket;
			this._dumped = false;
		}
		_destroy(error) {
			this.req._request.destroy(error);
		}
		setTimeout(ms, callback) {
			this.req.setTimeout(ms, callback);
			return this;
		}
		_dump() {
			if (!this._dumped) {
				this._dumped = true;
				this.removeAllListeners("data");
				this.resume();
			}
		}
		_read() {
			if (this.req) this.req._request.resume();
		}
	};
	module.exports = IncomingMessage;
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/url-to-options.js
var require_url_to_options$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/* istanbul ignore file: https://github.com/nodejs/node/blob/a91293d4d9ab403046ab5eb022332e4e3d249bd3/lib/internal/url.js#L1257 */
	module.exports = (url) => {
		const options = {
			protocol: url.protocol,
			hostname: typeof url.hostname === "string" && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
			host: url.host,
			hash: url.hash,
			search: url.search,
			pathname: url.pathname,
			href: url.href,
			path: `${url.pathname || ""}${url.search || ""}`
		};
		if (typeof url.port === "string" && url.port.length !== 0) options.port = Number(url.port);
		if (url.username || url.password) options.auth = `${url.username || ""}:${url.password || ""}`;
		return options;
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/proxy-events.js
var require_proxy_events$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (from, to, events) => {
		for (const event of events) from.on(event, (...args) => to.emit(event, ...args));
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js
var require_is_request_pseudo_header = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (header) => {
		switch (header) {
			case ":method":
			case ":scheme":
			case ":authority":
			case ":path": return true;
			default: return false;
		}
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/* istanbul ignore file: https://github.com/nodejs/node/blob/master/lib/internal/errors.js */
	var makeError = (Base, key, getMessage) => {
		module.exports[key] = class NodeError extends Base {
			constructor(...args) {
				super(typeof getMessage === "string" ? getMessage : getMessage(args));
				this.name = `${super.name} [${key}]`;
				this.code = key;
			}
		};
	};
	makeError(TypeError, "ERR_INVALID_ARG_TYPE", (args) => {
		const type = args[0].includes(".") ? "property" : "argument";
		let valid = args[1];
		const isManyTypes = Array.isArray(valid);
		if (isManyTypes) valid = `${valid.slice(0, -1).join(", ")} or ${valid.slice(-1)}`;
		return `The "${args[0]}" ${type} must be ${isManyTypes ? "one of" : "of"} type ${valid}. Received ${typeof args[2]}`;
	});
	makeError(TypeError, "ERR_INVALID_PROTOCOL", (args) => {
		return `Protocol "${args[0]}" not supported. Expected "${args[1]}"`;
	});
	makeError(Error, "ERR_HTTP_HEADERS_SENT", (args) => {
		return `Cannot ${args[0]} headers after they are sent to the client`;
	});
	makeError(TypeError, "ERR_INVALID_HTTP_TOKEN", (args) => {
		return `${args[0]} must be a valid HTTP token [${args[1]}]`;
	});
	makeError(TypeError, "ERR_HTTP_INVALID_HEADER_VALUE", (args) => {
		return `Invalid value "${args[0]} for header "${args[1]}"`;
	});
	makeError(TypeError, "ERR_INVALID_CHAR", (args) => {
		return `Invalid character in ${args[0]} [${args[1]}]`;
	});
}));
//#endregion
//#region node_modules/http2-wrapper/source/client-request.js
var require_client_request = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var http2$1 = __require("http2");
	var { Writable } = __require("stream");
	var { Agent, globalAgent } = require_agent();
	var IncomingMessage = require_incoming_message();
	var urlToOptions = require_url_to_options$1();
	var proxyEvents = require_proxy_events$1();
	var isRequestPseudoHeader = require_is_request_pseudo_header();
	var { ERR_INVALID_ARG_TYPE, ERR_INVALID_PROTOCOL, ERR_HTTP_HEADERS_SENT, ERR_INVALID_HTTP_TOKEN, ERR_HTTP_INVALID_HEADER_VALUE, ERR_INVALID_CHAR } = require_errors();
	var { HTTP2_HEADER_STATUS, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_METHOD_CONNECT } = http2$1.constants;
	var kHeaders = Symbol("headers");
	var kOrigin = Symbol("origin");
	var kSession = Symbol("session");
	var kOptions = Symbol("options");
	var kFlushedHeaders = Symbol("flushedHeaders");
	var kJobs = Symbol("jobs");
	var isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
	var isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;
	var ClientRequest = class extends Writable {
		constructor(input, options, callback) {
			super({ autoDestroy: false });
			const hasInput = typeof input === "string" || input instanceof URL;
			if (hasInput) input = urlToOptions(input instanceof URL ? input : new URL(input));
			if (typeof options === "function" || options === void 0) {
				callback = options;
				options = hasInput ? input : { ...input };
			} else options = {
				...input,
				...options
			};
			if (options.h2session) this[kSession] = options.h2session;
			else if (options.agent === false) this.agent = new Agent({ maxFreeSessions: 0 });
			else if (typeof options.agent === "undefined" || options.agent === null) if (typeof options.createConnection === "function") {
				this.agent = new Agent({ maxFreeSessions: 0 });
				this.agent.createConnection = options.createConnection;
			} else this.agent = globalAgent;
			else if (typeof options.agent.request === "function") this.agent = options.agent;
			else throw new ERR_INVALID_ARG_TYPE("options.agent", [
				"Agent-like Object",
				"undefined",
				"false"
			], options.agent);
			if (options.protocol && options.protocol !== "https:") throw new ERR_INVALID_PROTOCOL(options.protocol, "https:");
			const port = options.port || options.defaultPort || this.agent && this.agent.defaultPort || 443;
			const host = options.hostname || options.host || "localhost";
			delete options.hostname;
			delete options.host;
			delete options.port;
			const { timeout } = options;
			options.timeout = void 0;
			this[kHeaders] = Object.create(null);
			this[kJobs] = [];
			this.socket = null;
			this.connection = null;
			this.method = options.method || "GET";
			this.path = options.path;
			this.res = null;
			this.aborted = false;
			this.reusedSocket = false;
			if (options.headers) for (const [header, value] of Object.entries(options.headers)) this.setHeader(header, value);
			if (options.auth && !("authorization" in this[kHeaders])) this[kHeaders].authorization = "Basic " + Buffer.from(options.auth).toString("base64");
			options.session = options.tlsSession;
			options.path = options.socketPath;
			this[kOptions] = options;
			if (port === 443) {
				this[kOrigin] = `https://${host}`;
				if (!(":authority" in this[kHeaders])) this[kHeaders][":authority"] = host;
			} else {
				this[kOrigin] = `https://${host}:${port}`;
				if (!(":authority" in this[kHeaders])) this[kHeaders][":authority"] = `${host}:${port}`;
			}
			if (timeout) this.setTimeout(timeout);
			if (callback) this.once("response", callback);
			this[kFlushedHeaders] = false;
		}
		get method() {
			return this[kHeaders][HTTP2_HEADER_METHOD];
		}
		set method(value) {
			if (value) this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
		}
		get path() {
			return this[kHeaders][HTTP2_HEADER_PATH];
		}
		set path(value) {
			if (value) this[kHeaders][HTTP2_HEADER_PATH] = value;
		}
		get _mustNotHaveABody() {
			return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
		}
		_write(chunk, encoding, callback) {
			if (this._mustNotHaveABody) {
				callback(/* @__PURE__ */ new Error("The GET, HEAD and DELETE methods must NOT have a body"));
				/* istanbul ignore next: Node.js 12 throws directly */
				return;
			}
			this.flushHeaders();
			const callWrite = () => this._request.write(chunk, encoding, callback);
			if (this._request) callWrite();
			else this[kJobs].push(callWrite);
		}
		_final(callback) {
			if (this.destroyed) return;
			this.flushHeaders();
			const callEnd = () => {
				if (this._mustNotHaveABody) {
					callback();
					return;
				}
				this._request.end(callback);
			};
			if (this._request) callEnd();
			else this[kJobs].push(callEnd);
		}
		abort() {
			if (this.res && this.res.complete) return;
			if (!this.aborted) process.nextTick(() => this.emit("abort"));
			this.aborted = true;
			this.destroy();
		}
		_destroy(error, callback) {
			if (this.res) this.res._dump();
			if (this._request) this._request.destroy();
			callback(error);
		}
		async flushHeaders() {
			if (this[kFlushedHeaders] || this.destroyed) return;
			this[kFlushedHeaders] = true;
			const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;
			const onStream = (stream) => {
				this._request = stream;
				if (this.destroyed) {
					stream.destroy();
					return;
				}
				if (!isConnectMethod) proxyEvents(stream, this, [
					"timeout",
					"continue",
					"close",
					"error"
				]);
				const waitForEnd = (fn) => {
					return (...args) => {
						if (!this.writable && !this.destroyed) fn(...args);
						else this.once("finish", () => {
							fn(...args);
						});
					};
				};
				stream.once("response", waitForEnd((headers, flags, rawHeaders) => {
					const response = new IncomingMessage(this.socket, stream.readableHighWaterMark);
					this.res = response;
					response.req = this;
					response.statusCode = headers[HTTP2_HEADER_STATUS];
					response.headers = headers;
					response.rawHeaders = rawHeaders;
					response.once("end", () => {
						if (this.aborted) {
							response.aborted = true;
							response.emit("aborted");
						} else {
							response.complete = true;
							response.socket = null;
							response.connection = null;
						}
					});
					if (isConnectMethod) {
						response.upgrade = true;
						if (this.emit("connect", response, stream, Buffer.alloc(0))) this.emit("close");
						else stream.destroy();
					} else {
						stream.on("data", (chunk) => {
							if (!response._dumped && !response.push(chunk)) stream.pause();
						});
						stream.once("end", () => {
							response.push(null);
						});
						if (!this.emit("response", response)) response._dump();
					}
				}));
				stream.once("headers", waitForEnd((headers) => this.emit("information", { statusCode: headers[HTTP2_HEADER_STATUS] })));
				stream.once("trailers", waitForEnd((trailers, flags, rawTrailers) => {
					const { res } = this;
					res.trailers = trailers;
					res.rawTrailers = rawTrailers;
				}));
				const { socket } = stream.session;
				this.socket = socket;
				this.connection = socket;
				for (const job of this[kJobs]) job();
				this.emit("socket", this.socket);
			};
			if (this[kSession]) try {
				onStream(this[kSession].request(this[kHeaders]));
			} catch (error) {
				this.emit("error", error);
			}
			else {
				this.reusedSocket = true;
				try {
					onStream(await this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]));
				} catch (error) {
					this.emit("error", error);
				}
			}
		}
		getHeader(name) {
			if (typeof name !== "string") throw new ERR_INVALID_ARG_TYPE("name", "string", name);
			return this[kHeaders][name.toLowerCase()];
		}
		get headersSent() {
			return this[kFlushedHeaders];
		}
		removeHeader(name) {
			if (typeof name !== "string") throw new ERR_INVALID_ARG_TYPE("name", "string", name);
			if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT("remove");
			delete this[kHeaders][name.toLowerCase()];
		}
		setHeader(name, value) {
			if (this.headersSent) throw new ERR_HTTP_HEADERS_SENT("set");
			if (typeof name !== "string" || !isValidHttpToken.test(name) && !isRequestPseudoHeader(name)) throw new ERR_INVALID_HTTP_TOKEN("Header name", name);
			if (typeof value === "undefined") throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
			if (isInvalidHeaderValue.test(value)) throw new ERR_INVALID_CHAR("header content", name);
			this[kHeaders][name.toLowerCase()] = value;
		}
		setNoDelay() {}
		setSocketKeepAlive() {}
		setTimeout(ms, callback) {
			const applyTimeout = () => this._request.setTimeout(ms, callback);
			if (this._request) applyTimeout();
			else this[kJobs].push(applyTimeout);
			return this;
		}
		get maxHeadersCount() {
			if (!this.destroyed && this._request) return this._request.session.localSettings.maxHeaderListSize;
		}
		set maxHeadersCount(_value) {}
	};
	module.exports = ClientRequest;
}));
//#endregion
//#region node_modules/resolve-alpn/index.js
var require_resolve_alpn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var tls = __require("tls");
	module.exports = (options = {}, connect = tls.connect) => new Promise((resolve, reject) => {
		let timeout = false;
		let socket;
		const callback = async () => {
			await socketPromise;
			socket.off("timeout", onTimeout);
			socket.off("error", reject);
			if (options.resolveSocket) {
				resolve({
					alpnProtocol: socket.alpnProtocol,
					socket,
					timeout
				});
				if (timeout) {
					await Promise.resolve();
					socket.emit("timeout");
				}
			} else {
				socket.destroy();
				resolve({
					alpnProtocol: socket.alpnProtocol,
					timeout
				});
			}
		};
		const onTimeout = async () => {
			timeout = true;
			callback();
		};
		const socketPromise = (async () => {
			try {
				socket = await connect(options, callback);
				socket.on("error", reject);
				socket.once("timeout", onTimeout);
			} catch (error) {
				reject(error);
			}
		})();
	});
}));
//#endregion
//#region node_modules/http2-wrapper/source/utils/calculate-server-name.js
var require_calculate_server_name = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var net$1 = __require("net");
	/* istanbul ignore file: https://github.com/nodejs/node/blob/v13.0.1/lib/_http_agent.js */
	module.exports = (options) => {
		let servername = options.host;
		const hostHeader = options.headers && options.headers.host;
		if (hostHeader) if (hostHeader.startsWith("[")) if (hostHeader.indexOf("]") === -1) servername = hostHeader;
		else servername = hostHeader.slice(1, -1);
		else servername = hostHeader.split(":", 1)[0];
		if (net$1.isIP(servername)) return "";
		return servername;
	};
}));
//#endregion
//#region node_modules/http2-wrapper/source/auto.js
var require_auto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var http$1 = __require("http");
	var https$1 = __require("https");
	var resolveALPN = require_resolve_alpn();
	var QuickLRU = require_quick_lru();
	var Http2ClientRequest = require_client_request();
	var calculateServerName = require_calculate_server_name();
	var urlToOptions = require_url_to_options$1();
	var cache = new QuickLRU({ maxSize: 100 });
	var queue = /* @__PURE__ */ new Map();
	var installSocket = (agent, socket, options) => {
		socket._httpMessage = { shouldKeepAlive: true };
		const onFree = () => {
			agent.emit("free", socket, options);
		};
		socket.on("free", onFree);
		const onClose = () => {
			agent.removeSocket(socket, options);
		};
		socket.on("close", onClose);
		const onRemove = () => {
			agent.removeSocket(socket, options);
			socket.off("close", onClose);
			socket.off("free", onFree);
			socket.off("agentRemove", onRemove);
		};
		socket.on("agentRemove", onRemove);
		agent.emit("free", socket, options);
	};
	var resolveProtocol = async (options) => {
		const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;
		if (!cache.has(name)) {
			if (queue.has(name)) return (await queue.get(name)).alpnProtocol;
			const { path, agent } = options;
			options.path = options.socketPath;
			const resultPromise = resolveALPN(options);
			queue.set(name, resultPromise);
			try {
				const { socket, alpnProtocol } = await resultPromise;
				cache.set(name, alpnProtocol);
				options.path = path;
				if (alpnProtocol === "h2") socket.destroy();
				else {
					const { globalAgent } = https$1;
					const defaultCreateConnection = https$1.Agent.prototype.createConnection;
					if (agent) if (agent.createConnection === defaultCreateConnection) installSocket(agent, socket, options);
					else socket.destroy();
					else if (globalAgent.createConnection === defaultCreateConnection) installSocket(globalAgent, socket, options);
					else socket.destroy();
				}
				queue.delete(name);
				return alpnProtocol;
			} catch (error) {
				queue.delete(name);
				throw error;
			}
		}
		return cache.get(name);
	};
	module.exports = async (input, options, callback) => {
		if (typeof input === "string" || input instanceof URL) input = urlToOptions(new URL(input));
		if (typeof options === "function") {
			callback = options;
			options = void 0;
		}
		options = {
			ALPNProtocols: ["h2", "http/1.1"],
			...input,
			...options,
			resolveSocket: true
		};
		if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
		options.protocol = options.protocol || "https:";
		const isHttps = options.protocol === "https:";
		options.host = options.hostname || options.host || "localhost";
		options.session = options.tlsSession;
		options.servername = options.servername || calculateServerName(options);
		options.port = options.port || (isHttps ? 443 : 80);
		options._defaultAgent = isHttps ? https$1.globalAgent : http$1.globalAgent;
		const agents = options.agent;
		if (agents) {
			if (agents.addRequest) throw new Error("The `options.agent` object can contain only `http`, `https` or `http2` properties");
			options.agent = agents[isHttps ? "https" : "http"];
		}
		if (isHttps) {
			if (await resolveProtocol(options) === "h2") {
				if (agents) options.agent = agents.http2;
				return new Http2ClientRequest(options, callback);
			}
		}
		return http$1.request(options, callback);
	};
	module.exports.protocolCache = cache;
}));
//#endregion
//#region node_modules/http2-wrapper/source/index.js
var require_source$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var http2 = __require("http2");
	var agent = require_agent();
	var ClientRequest = require_client_request();
	var IncomingMessage = require_incoming_message();
	var auto = require_auto();
	var request = (url, options, callback) => {
		return new ClientRequest(url, options, callback);
	};
	var get = (url, options, callback) => {
		const req = new ClientRequest(url, options, callback);
		req.end();
		return req;
	};
	module.exports = {
		...http2,
		ClientRequest,
		IncomingMessage,
		...agent,
		request,
		get,
		auto
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/is-form-data.js
var require_is_form_data = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var is_1 = require_dist();
	exports.default = (body) => is_1.default.nodeStream(body) && is_1.default.function_(body.getBoundary);
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/get-body-size.js
var require_get_body_size = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fs_1$1 = __require("fs");
	var util_1$1 = __require("util");
	var is_1 = require_dist();
	var is_form_data_1 = require_is_form_data();
	var statAsync = util_1$1.promisify(fs_1$1.stat);
	exports.default = async (body, headers) => {
		if (headers && "content-length" in headers) return Number(headers["content-length"]);
		if (!body) return 0;
		if (is_1.default.string(body)) return Buffer.byteLength(body);
		if (is_1.default.buffer(body)) return body.length;
		if (is_form_data_1.default(body)) return util_1$1.promisify(body.getLength.bind(body))();
		if (body instanceof fs_1$1.ReadStream) {
			const { size } = await statAsync(body.path);
			if (size === 0) return;
			return size;
		}
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/proxy-events.js
var require_proxy_events = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function default_1(from, to, events) {
		const fns = {};
		for (const event of events) {
			fns[event] = (...args) => {
				to.emit(event, ...args);
			};
			from.on(event, fns[event]);
		}
		return () => {
			for (const event of events) from.off(event, fns[event]);
		};
	}
	exports.default = default_1;
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/unhandle.js
var require_unhandle = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = () => {
		const handlers = [];
		return {
			once(origin, event, fn) {
				origin.once(event, fn);
				handlers.push({
					origin,
					event,
					fn
				});
			},
			unhandleAll() {
				for (const handler of handlers) {
					const { origin, event, fn } = handler;
					origin.removeListener(event, fn);
				}
				handlers.length = 0;
			}
		};
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/timed-out.js
var require_timed_out = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TimeoutError = void 0;
	var net = __require("net");
	var unhandle_1 = require_unhandle();
	var reentry = Symbol("reentry");
	var noop = () => {};
	var TimeoutError = class extends Error {
		constructor(threshold, event) {
			super(`Timeout awaiting '${event}' for ${threshold}ms`);
			this.event = event;
			this.name = "TimeoutError";
			this.code = "ETIMEDOUT";
		}
	};
	exports.TimeoutError = TimeoutError;
	exports.default = (request, delays, options) => {
		if (reentry in request) return noop;
		request[reentry] = true;
		const cancelers = [];
		const { once, unhandleAll } = unhandle_1.default();
		const addTimeout = (delay, callback, event) => {
			var _a;
			const timeout = setTimeout(callback, delay, delay, event);
			(_a = timeout.unref) === null || _a === void 0 || _a.call(timeout);
			const cancel = () => {
				clearTimeout(timeout);
			};
			cancelers.push(cancel);
			return cancel;
		};
		const { host, hostname } = options;
		const timeoutHandler = (delay, event) => {
			request.destroy(new TimeoutError(delay, event));
		};
		const cancelTimeouts = () => {
			for (const cancel of cancelers) cancel();
			unhandleAll();
		};
		request.once("error", (error) => {
			cancelTimeouts();
			/* istanbul ignore next */
			if (request.listenerCount("error") === 0) throw error;
		});
		request.once("close", cancelTimeouts);
		once(request, "response", (response) => {
			once(response, "end", cancelTimeouts);
		});
		if (typeof delays.request !== "undefined") addTimeout(delays.request, timeoutHandler, "request");
		if (typeof delays.socket !== "undefined") {
			const socketTimeoutHandler = () => {
				timeoutHandler(delays.socket, "socket");
			};
			request.setTimeout(delays.socket, socketTimeoutHandler);
			cancelers.push(() => {
				request.removeListener("timeout", socketTimeoutHandler);
			});
		}
		once(request, "socket", (socket) => {
			var _a;
			const { socketPath } = request;
			/* istanbul ignore next: hard to test */
			if (socket.connecting) {
				const hasPath = Boolean(socketPath !== null && socketPath !== void 0 ? socketPath : net.isIP((_a = hostname !== null && hostname !== void 0 ? hostname : host) !== null && _a !== void 0 ? _a : "") !== 0);
				if (typeof delays.lookup !== "undefined" && !hasPath && typeof socket.address().address === "undefined") {
					const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, "lookup");
					once(socket, "lookup", cancelTimeout);
				}
				if (typeof delays.connect !== "undefined") {
					const timeConnect = () => addTimeout(delays.connect, timeoutHandler, "connect");
					if (hasPath) once(socket, "connect", timeConnect());
					else once(socket, "lookup", (error) => {
						if (error === null) once(socket, "connect", timeConnect());
					});
				}
				if (typeof delays.secureConnect !== "undefined" && options.protocol === "https:") once(socket, "connect", () => {
					const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, "secureConnect");
					once(socket, "secureConnect", cancelTimeout);
				});
			}
			if (typeof delays.send !== "undefined") {
				const timeRequest = () => addTimeout(delays.send, timeoutHandler, "send");
				/* istanbul ignore next: hard to test */
				if (socket.connecting) once(socket, "connect", () => {
					once(request, "upload-complete", timeRequest());
				});
				else once(request, "upload-complete", timeRequest());
			}
		});
		if (typeof delays.response !== "undefined") once(request, "upload-complete", () => {
			const cancelTimeout = addTimeout(delays.response, timeoutHandler, "response");
			once(request, "response", cancelTimeout);
		});
		return cancelTimeouts;
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/url-to-options.js
var require_url_to_options = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var is_1 = require_dist();
	exports.default = (url) => {
		url = url;
		const options = {
			protocol: url.protocol,
			hostname: is_1.default.string(url.hostname) && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
			host: url.host,
			hash: url.hash,
			search: url.search,
			pathname: url.pathname,
			href: url.href,
			path: `${url.pathname || ""}${url.search || ""}`
		};
		if (is_1.default.string(url.port) && url.port.length > 0) options.port = Number(url.port);
		if (url.username || url.password) options.auth = `${url.username || ""}:${url.password || ""}`;
		return options;
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/options-to-url.js
var require_options_to_url = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/* istanbul ignore file: deprecated */
	var url_1$2 = __require("url");
	var keys = [
		"protocol",
		"host",
		"hostname",
		"port",
		"pathname",
		"search"
	];
	exports.default = (origin, options) => {
		var _a, _b;
		if (options.path) {
			if (options.pathname) throw new TypeError("Parameters `path` and `pathname` are mutually exclusive.");
			if (options.search) throw new TypeError("Parameters `path` and `search` are mutually exclusive.");
			if (options.searchParams) throw new TypeError("Parameters `path` and `searchParams` are mutually exclusive.");
		}
		if (options.search && options.searchParams) throw new TypeError("Parameters `search` and `searchParams` are mutually exclusive.");
		if (!origin) {
			if (!options.protocol) throw new TypeError("No URL protocol specified");
			origin = `${options.protocol}//${(_b = (_a = options.hostname) !== null && _a !== void 0 ? _a : options.host) !== null && _b !== void 0 ? _b : ""}`;
		}
		const url = new url_1$2.URL(origin);
		if (options.path) {
			const searchIndex = options.path.indexOf("?");
			if (searchIndex === -1) options.pathname = options.path;
			else {
				options.pathname = options.path.slice(0, searchIndex);
				options.search = options.path.slice(searchIndex + 1);
			}
			delete options.path;
		}
		for (const key of keys) if (options[key]) url[key] = options[key].toString();
		return url;
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/weakable-map.js
var require_weakable_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var WeakableMap = class {
		constructor() {
			this.weakMap = /* @__PURE__ */ new WeakMap();
			this.map = /* @__PURE__ */ new Map();
		}
		set(key, value) {
			if (typeof key === "object") this.weakMap.set(key, value);
			else this.map.set(key, value);
		}
		get(key) {
			if (typeof key === "object") return this.weakMap.get(key);
			return this.map.get(key);
		}
		has(key) {
			if (typeof key === "object") return this.weakMap.has(key);
			return this.map.has(key);
		}
	};
	exports.default = WeakableMap;
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/get-buffer.js
var require_get_buffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var getBuffer = async (stream) => {
		const chunks = [];
		let length = 0;
		for await (const chunk of stream) {
			chunks.push(chunk);
			length += Buffer.byteLength(chunk);
		}
		if (Buffer.isBuffer(chunks[0])) return Buffer.concat(chunks, length);
		return Buffer.from(chunks.join(""));
	};
	exports.default = getBuffer;
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/dns-ip-version.js
var require_dns_ip_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dnsLookupIpVersionToFamily = exports.isDnsLookupIpVersion = void 0;
	var conversionTable = {
		auto: 0,
		ipv4: 4,
		ipv6: 6
	};
	exports.isDnsLookupIpVersion = (value) => {
		return value in conversionTable;
	};
	exports.dnsLookupIpVersionToFamily = (dnsLookupIpVersion) => {
		if (exports.isDnsLookupIpVersion(dnsLookupIpVersion)) return conversionTable[dnsLookupIpVersion];
		throw new Error("Invalid DNS lookup IP version");
	};
}));
//#endregion
//#region node_modules/got/dist/source/core/utils/is-response-ok.js
var require_is_response_ok = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isResponseOk = void 0;
	exports.isResponseOk = (response) => {
		const { statusCode } = response;
		const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
		return statusCode >= 200 && statusCode <= limitStatusCode || statusCode === 304;
	};
}));
//#endregion
//#region node_modules/got/dist/source/utils/deprecation-warning.js
var require_deprecation_warning = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var alreadyWarned = /* @__PURE__ */ new Set();
	exports.default = (message) => {
		if (alreadyWarned.has(message)) return;
		alreadyWarned.add(message);
		process.emitWarning(`Got: ${message}`, { type: "DeprecationWarning" });
	};
}));
//#endregion
//#region node_modules/got/dist/source/as-promise/normalize-arguments.js
var require_normalize_arguments = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var is_1 = require_dist();
	var normalizeArguments = (options, defaults) => {
		if (is_1.default.null_(options.encoding)) throw new TypeError("To get a Buffer, set `options.responseType` to `buffer` instead");
		is_1.assert.any([is_1.default.string, is_1.default.undefined], options.encoding);
		is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.resolveBodyOnly);
		is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.methodRewriting);
		is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.isStream);
		is_1.assert.any([is_1.default.string, is_1.default.undefined], options.responseType);
		if (options.responseType === void 0) options.responseType = "text";
		const { retry } = options;
		if (defaults) options.retry = { ...defaults.retry };
		else options.retry = {
			calculateDelay: (retryObject) => retryObject.computedValue,
			limit: 0,
			methods: [],
			statusCodes: [],
			errorCodes: [],
			maxRetryAfter: void 0
		};
		if (is_1.default.object(retry)) {
			options.retry = {
				...options.retry,
				...retry
			};
			options.retry.methods = [...new Set(options.retry.methods.map((method) => method.toUpperCase()))];
			options.retry.statusCodes = [...new Set(options.retry.statusCodes)];
			options.retry.errorCodes = [...new Set(options.retry.errorCodes)];
		} else if (is_1.default.number(retry)) options.retry.limit = retry;
		if (is_1.default.undefined(options.retry.maxRetryAfter)) options.retry.maxRetryAfter = Math.min(...[options.timeout.request, options.timeout.connect].filter(is_1.default.number));
		if (is_1.default.object(options.pagination)) {
			if (defaults) options.pagination = {
				...defaults.pagination,
				...options.pagination
			};
			const { pagination } = options;
			if (!is_1.default.function_(pagination.transform)) throw new Error("`options.pagination.transform` must be implemented");
			if (!is_1.default.function_(pagination.shouldContinue)) throw new Error("`options.pagination.shouldContinue` must be implemented");
			if (!is_1.default.function_(pagination.filter)) throw new TypeError("`options.pagination.filter` must be implemented");
			if (!is_1.default.function_(pagination.paginate)) throw new Error("`options.pagination.paginate` must be implemented");
		}
		if (options.responseType === "json" && options.headers.accept === void 0) options.headers.accept = "application/json";
		return options;
	};
	exports.default = normalizeArguments;
}));
//#endregion
//#region node_modules/got/dist/source/core/calculate-retry-delay.js
var require_calculate_retry_delay = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.retryAfterStatusCodes = void 0;
	exports.retryAfterStatusCodes = /* @__PURE__ */ new Set([
		413,
		429,
		503
	]);
	var calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter }) => {
		if (attemptCount > retryOptions.limit) return 0;
		const hasMethod = retryOptions.methods.includes(error.options.method);
		const hasErrorCode = retryOptions.errorCodes.includes(error.code);
		const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
		if (!hasMethod || !hasErrorCode && !hasStatusCode) return 0;
		if (error.response) {
			if (retryAfter) {
				if (retryOptions.maxRetryAfter === void 0 || retryAfter > retryOptions.maxRetryAfter) return 0;
				return retryAfter;
			}
			if (error.response.statusCode === 413) return 0;
		}
		const noise = Math.random() * 100;
		return 2 ** (attemptCount - 1) * 1e3 + noise;
	};
	exports.default = calculateRetryDelay;
}));
//#endregion
//#region node_modules/got/dist/source/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UnsupportedProtocolError = exports.ReadError = exports.TimeoutError = exports.UploadError = exports.CacheError = exports.HTTPError = exports.MaxRedirectsError = exports.RequestError = exports.setNonEnumerableProperties = exports.knownHookEvents = exports.withoutBody = exports.kIsNormalizedAlready = void 0;
	var util_1 = __require("util");
	var stream_1 = __require("stream");
	var fs_1 = __require("fs");
	var url_1$1 = __require("url");
	var http = __require("http");
	var http_1 = __require("http");
	var https = __require("https");
	var http_timer_1 = require_source$3();
	var cacheable_lookup_1 = require_source$2();
	var CacheableRequest = require_src();
	var decompressResponse = require_decompress_response();
	var http2wrapper = require_source$1();
	var lowercaseKeys = require_lowercase_keys();
	var is_1 = require_dist();
	var get_body_size_1 = require_get_body_size();
	var is_form_data_1 = require_is_form_data();
	var proxy_events_1 = require_proxy_events();
	var timed_out_1 = require_timed_out();
	var url_to_options_1 = require_url_to_options();
	var options_to_url_1 = require_options_to_url();
	var weakable_map_1 = require_weakable_map();
	var get_buffer_1 = require_get_buffer();
	var dns_ip_version_1 = require_dns_ip_version();
	var is_response_ok_1 = require_is_response_ok();
	var deprecation_warning_1 = require_deprecation_warning();
	var normalize_arguments_1 = require_normalize_arguments();
	var calculate_retry_delay_1 = require_calculate_retry_delay();
	var globalDnsCache;
	var kRequest = Symbol("request");
	var kResponse = Symbol("response");
	var kResponseSize = Symbol("responseSize");
	var kDownloadedSize = Symbol("downloadedSize");
	var kBodySize = Symbol("bodySize");
	var kUploadedSize = Symbol("uploadedSize");
	var kServerResponsesPiped = Symbol("serverResponsesPiped");
	var kUnproxyEvents = Symbol("unproxyEvents");
	var kIsFromCache = Symbol("isFromCache");
	var kCancelTimeouts = Symbol("cancelTimeouts");
	var kStartedReading = Symbol("startedReading");
	var kStopReading = Symbol("stopReading");
	var kTriggerRead = Symbol("triggerRead");
	var kBody = Symbol("body");
	var kJobs = Symbol("jobs");
	var kOriginalResponse = Symbol("originalResponse");
	var kRetryTimeout = Symbol("retryTimeout");
	exports.kIsNormalizedAlready = Symbol("isNormalizedAlready");
	var supportsBrotli = is_1.default.string(process.versions.brotli);
	exports.withoutBody = /* @__PURE__ */ new Set(["GET", "HEAD"]);
	exports.knownHookEvents = [
		"init",
		"beforeRequest",
		"beforeRedirect",
		"beforeError",
		"beforeRetry",
		"afterResponse"
	];
	function validateSearchParameters(searchParameters) {
		for (const key in searchParameters) {
			const value = searchParameters[key];
			if (!is_1.default.string(value) && !is_1.default.number(value) && !is_1.default.boolean(value) && !is_1.default.null_(value) && !is_1.default.undefined(value)) throw new TypeError(`The \`searchParams\` value '${String(value)}' must be a string, number, boolean or null`);
		}
	}
	function isClientRequest(clientRequest) {
		return is_1.default.object(clientRequest) && !("statusCode" in clientRequest);
	}
	var cacheableStore = new weakable_map_1.default();
	var waitForOpenFile = async (file) => new Promise((resolve, reject) => {
		const onError = (error) => {
			reject(error);
		};
		if (!file.pending) resolve();
		file.once("error", onError);
		file.once("ready", () => {
			file.off("error", onError);
			resolve();
		});
	});
	var redirectCodes = /* @__PURE__ */ new Set([
		300,
		301,
		302,
		303,
		304,
		307,
		308
	]);
	var nonEnumerableProperties = [
		"context",
		"body",
		"json",
		"form"
	];
	exports.setNonEnumerableProperties = (sources, to) => {
		const properties = {};
		for (const source of sources) {
			if (!source) continue;
			for (const name of nonEnumerableProperties) {
				if (!(name in source)) continue;
				properties[name] = {
					writable: true,
					configurable: true,
					enumerable: false,
					value: source[name]
				};
			}
		}
		Object.defineProperties(to, properties);
	};
	/**
	An error to be thrown when a request fails.
	Contains a `code` property with error class code, like `ECONNREFUSED`.
	*/
	var RequestError = class extends Error {
		constructor(message, error, self) {
			var _a, _b;
			super(message);
			Error.captureStackTrace(this, this.constructor);
			this.name = "RequestError";
			this.code = (_a = error.code) !== null && _a !== void 0 ? _a : "ERR_GOT_REQUEST_ERROR";
			if (self instanceof Request) {
				Object.defineProperty(this, "request", {
					enumerable: false,
					value: self
				});
				Object.defineProperty(this, "response", {
					enumerable: false,
					value: self[kResponse]
				});
				Object.defineProperty(this, "options", {
					enumerable: false,
					value: self.options
				});
			} else Object.defineProperty(this, "options", {
				enumerable: false,
				value: self
			});
			this.timings = (_b = this.request) === null || _b === void 0 ? void 0 : _b.timings;
			if (is_1.default.string(error.stack) && is_1.default.string(this.stack)) {
				const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
				const thisStackTrace = this.stack.slice(indexOfMessage).split("\n").reverse();
				const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split("\n").reverse();
				while (errorStackTrace.length !== 0 && errorStackTrace[0] === thisStackTrace[0]) thisStackTrace.shift();
				this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join("\n")}${errorStackTrace.reverse().join("\n")}`;
			}
		}
	};
	exports.RequestError = RequestError;
	/**
	An error to be thrown when the server redirects you more than ten times.
	Includes a `response` property.
	*/
	var MaxRedirectsError = class extends RequestError {
		constructor(request) {
			super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
			this.name = "MaxRedirectsError";
			this.code = "ERR_TOO_MANY_REDIRECTS";
		}
	};
	exports.MaxRedirectsError = MaxRedirectsError;
	/**
	An error to be thrown when the server response code is not 2xx nor 3xx if `options.followRedirect` is `true`, but always except for 304.
	Includes a `response` property.
	*/
	var HTTPError = class extends RequestError {
		constructor(response) {
			super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
			this.name = "HTTPError";
			this.code = "ERR_NON_2XX_3XX_RESPONSE";
		}
	};
	exports.HTTPError = HTTPError;
	/**
	An error to be thrown when a cache method fails.
	For example, if the database goes down or there's a filesystem error.
	*/
	var CacheError = class extends RequestError {
		constructor(error, request) {
			super(error.message, error, request);
			this.name = "CacheError";
			this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_CACHE_ACCESS" : this.code;
		}
	};
	exports.CacheError = CacheError;
	/**
	An error to be thrown when the request body is a stream and an error occurs while reading from that stream.
	*/
	var UploadError = class extends RequestError {
		constructor(error, request) {
			super(error.message, error, request);
			this.name = "UploadError";
			this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_UPLOAD" : this.code;
		}
	};
	exports.UploadError = UploadError;
	/**
	An error to be thrown when the request is aborted due to a timeout.
	Includes an `event` and `timings` property.
	*/
	var TimeoutError = class extends RequestError {
		constructor(error, timings, request) {
			super(error.message, error, request);
			this.name = "TimeoutError";
			this.event = error.event;
			this.timings = timings;
		}
	};
	exports.TimeoutError = TimeoutError;
	/**
	An error to be thrown when reading from response stream fails.
	*/
	var ReadError = class extends RequestError {
		constructor(error, request) {
			super(error.message, error, request);
			this.name = "ReadError";
			this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_READING_RESPONSE_STREAM" : this.code;
		}
	};
	exports.ReadError = ReadError;
	/**
	An error to be thrown when given an unsupported protocol.
	*/
	var UnsupportedProtocolError = class extends RequestError {
		constructor(options) {
			super(`Unsupported protocol "${options.url.protocol}"`, {}, options);
			this.name = "UnsupportedProtocolError";
			this.code = "ERR_UNSUPPORTED_PROTOCOL";
		}
	};
	exports.UnsupportedProtocolError = UnsupportedProtocolError;
	var proxiedRequestEvents = [
		"socket",
		"connect",
		"continue",
		"information",
		"upgrade",
		"timeout"
	];
	var Request = class extends stream_1.Duplex {
		constructor(url, options = {}, defaults) {
			super({
				autoDestroy: false,
				highWaterMark: 0
			});
			this[kDownloadedSize] = 0;
			this[kUploadedSize] = 0;
			this.requestInitialized = false;
			this[kServerResponsesPiped] = /* @__PURE__ */ new Set();
			this.redirects = [];
			this[kStopReading] = false;
			this[kTriggerRead] = false;
			this[kJobs] = [];
			this.retryCount = 0;
			this._progressCallbacks = [];
			const unlockWrite = () => this._unlockWrite();
			const lockWrite = () => this._lockWrite();
			this.on("pipe", (source) => {
				source.prependListener("data", unlockWrite);
				source.on("data", lockWrite);
				source.prependListener("end", unlockWrite);
				source.on("end", lockWrite);
			});
			this.on("unpipe", (source) => {
				source.off("data", unlockWrite);
				source.off("data", lockWrite);
				source.off("end", unlockWrite);
				source.off("end", lockWrite);
			});
			this.on("pipe", (source) => {
				if (source instanceof http_1.IncomingMessage) this.options.headers = {
					...source.headers,
					...this.options.headers
				};
			});
			const { json, body, form } = options;
			if (json || body || form) this._lockWrite();
			if (exports.kIsNormalizedAlready in options) this.options = options;
			else try {
				this.options = this.constructor.normalizeArguments(url, options, defaults);
			} catch (error) {
				if (is_1.default.nodeStream(options.body)) options.body.destroy();
				this.destroy(error);
				return;
			}
			(async () => {
				var _a;
				try {
					if (this.options.body instanceof fs_1.ReadStream) await waitForOpenFile(this.options.body);
					const { url: normalizedURL } = this.options;
					if (!normalizedURL) throw new TypeError("Missing `url` property");
					this.requestUrl = normalizedURL.toString();
					decodeURI(this.requestUrl);
					await this._finalizeBody();
					await this._makeRequest();
					if (this.destroyed) {
						(_a = this[kRequest]) === null || _a === void 0 || _a.destroy();
						return;
					}
					for (const job of this[kJobs]) job();
					this[kJobs].length = 0;
					this.requestInitialized = true;
				} catch (error) {
					if (error instanceof RequestError) {
						this._beforeError(error);
						return;
					}
					if (!this.destroyed) this.destroy(error);
				}
			})();
		}
		static normalizeArguments(url, options, defaults) {
			var _a, _b, _c, _d, _e;
			const rawOptions = options;
			if (is_1.default.object(url) && !is_1.default.urlInstance(url)) options = {
				...defaults,
				...url,
				...options
			};
			else {
				if (url && options && options.url !== void 0) throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
				options = {
					...defaults,
					...options
				};
				if (url !== void 0) options.url = url;
				if (is_1.default.urlInstance(options.url)) options.url = new url_1$1.URL(options.url.toString());
			}
			if (options.cache === false) options.cache = void 0;
			if (options.dnsCache === false) options.dnsCache = void 0;
			is_1.assert.any([is_1.default.string, is_1.default.undefined], options.method);
			is_1.assert.any([is_1.default.object, is_1.default.undefined], options.headers);
			is_1.assert.any([
				is_1.default.string,
				is_1.default.urlInstance,
				is_1.default.undefined
			], options.prefixUrl);
			is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cookieJar);
			is_1.assert.any([
				is_1.default.object,
				is_1.default.string,
				is_1.default.undefined
			], options.searchParams);
			is_1.assert.any([
				is_1.default.object,
				is_1.default.string,
				is_1.default.undefined
			], options.cache);
			is_1.assert.any([
				is_1.default.object,
				is_1.default.number,
				is_1.default.undefined
			], options.timeout);
			is_1.assert.any([is_1.default.object, is_1.default.undefined], options.context);
			is_1.assert.any([is_1.default.object, is_1.default.undefined], options.hooks);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.decompress);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.ignoreInvalidCookies);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.followRedirect);
			is_1.assert.any([is_1.default.number, is_1.default.undefined], options.maxRedirects);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.throwHttpErrors);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.http2);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.allowGetBody);
			is_1.assert.any([is_1.default.string, is_1.default.undefined], options.localAddress);
			is_1.assert.any([dns_ip_version_1.isDnsLookupIpVersion, is_1.default.undefined], options.dnsLookupIpVersion);
			is_1.assert.any([is_1.default.object, is_1.default.undefined], options.https);
			is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.rejectUnauthorized);
			if (options.https) {
				is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.https.rejectUnauthorized);
				is_1.assert.any([is_1.default.function_, is_1.default.undefined], options.https.checkServerIdentity);
				is_1.assert.any([
					is_1.default.string,
					is_1.default.object,
					is_1.default.array,
					is_1.default.undefined
				], options.https.certificateAuthority);
				is_1.assert.any([
					is_1.default.string,
					is_1.default.object,
					is_1.default.array,
					is_1.default.undefined
				], options.https.key);
				is_1.assert.any([
					is_1.default.string,
					is_1.default.object,
					is_1.default.array,
					is_1.default.undefined
				], options.https.certificate);
				is_1.assert.any([is_1.default.string, is_1.default.undefined], options.https.passphrase);
				is_1.assert.any([
					is_1.default.string,
					is_1.default.buffer,
					is_1.default.array,
					is_1.default.undefined
				], options.https.pfx);
			}
			is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cacheOptions);
			if (is_1.default.string(options.method)) options.method = options.method.toUpperCase();
			else options.method = "GET";
			if (options.headers === (defaults === null || defaults === void 0 ? void 0 : defaults.headers)) options.headers = { ...options.headers };
			else options.headers = lowercaseKeys({
				...defaults === null || defaults === void 0 ? void 0 : defaults.headers,
				...options.headers
			});
			if ("slashes" in options) throw new TypeError("The legacy `url.Url` has been deprecated. Use `URL` instead.");
			if ("auth" in options) throw new TypeError("Parameter `auth` is deprecated. Use `username` / `password` instead.");
			if ("searchParams" in options) {
				if (options.searchParams && options.searchParams !== (defaults === null || defaults === void 0 ? void 0 : defaults.searchParams)) {
					let searchParameters;
					if (is_1.default.string(options.searchParams) || options.searchParams instanceof url_1$1.URLSearchParams) searchParameters = new url_1$1.URLSearchParams(options.searchParams);
					else {
						validateSearchParameters(options.searchParams);
						searchParameters = new url_1$1.URLSearchParams();
						for (const key in options.searchParams) {
							const value = options.searchParams[key];
							if (value === null) searchParameters.append(key, "");
							else if (value !== void 0) searchParameters.append(key, value);
						}
					}
					(_a = defaults === null || defaults === void 0 ? void 0 : defaults.searchParams) === null || _a === void 0 || _a.forEach((value, key) => {
						if (!searchParameters.has(key)) searchParameters.append(key, value);
					});
					options.searchParams = searchParameters;
				}
			}
			options.username = (_b = options.username) !== null && _b !== void 0 ? _b : "";
			options.password = (_c = options.password) !== null && _c !== void 0 ? _c : "";
			if (is_1.default.undefined(options.prefixUrl)) options.prefixUrl = (_d = defaults === null || defaults === void 0 ? void 0 : defaults.prefixUrl) !== null && _d !== void 0 ? _d : "";
			else {
				options.prefixUrl = options.prefixUrl.toString();
				if (options.prefixUrl !== "" && !options.prefixUrl.endsWith("/")) options.prefixUrl += "/";
			}
			if (is_1.default.string(options.url)) {
				if (options.url.startsWith("/")) throw new Error("`input` must not start with a slash when using `prefixUrl`");
				options.url = options_to_url_1.default(options.prefixUrl + options.url, options);
			} else if (is_1.default.undefined(options.url) && options.prefixUrl !== "" || options.protocol) options.url = options_to_url_1.default(options.prefixUrl, options);
			if (options.url) {
				if ("port" in options) delete options.port;
				let { prefixUrl } = options;
				Object.defineProperty(options, "prefixUrl", {
					set: (value) => {
						const url = options.url;
						if (!url.href.startsWith(value)) throw new Error(`Cannot change \`prefixUrl\` from ${prefixUrl} to ${value}: ${url.href}`);
						options.url = new url_1$1.URL(value + url.href.slice(prefixUrl.length));
						prefixUrl = value;
					},
					get: () => prefixUrl
				});
				let { protocol } = options.url;
				if (protocol === "unix:") {
					protocol = "http:";
					options.url = new url_1$1.URL(`http://unix${options.url.pathname}${options.url.search}`);
				}
				if (options.searchParams) options.url.search = options.searchParams.toString();
				if (protocol !== "http:" && protocol !== "https:") throw new UnsupportedProtocolError(options);
				if (options.username === "") options.username = options.url.username;
				else options.url.username = options.username;
				if (options.password === "") options.password = options.url.password;
				else options.url.password = options.password;
			}
			const { cookieJar } = options;
			if (cookieJar) {
				let { setCookie, getCookieString } = cookieJar;
				is_1.assert.function_(setCookie);
				is_1.assert.function_(getCookieString);
				/* istanbul ignore next: Horrible `tough-cookie` v3 check */
				if (setCookie.length === 4 && getCookieString.length === 0) {
					setCookie = util_1.promisify(setCookie.bind(options.cookieJar));
					getCookieString = util_1.promisify(getCookieString.bind(options.cookieJar));
					options.cookieJar = {
						setCookie,
						getCookieString
					};
				}
			}
			const { cache } = options;
			if (cache) {
				if (!cacheableStore.has(cache)) cacheableStore.set(cache, new CacheableRequest(((requestOptions, handler) => {
					const result = requestOptions[kRequest](requestOptions, handler);
					if (is_1.default.promise(result)) result.once = (event, handler) => {
						if (event === "error") result.catch(handler);
						else if (event === "abort") (async () => {
							try {
								(await result).once("abort", handler);
							} catch (_a) {}
						})();
						else
 /* istanbul ignore next: safety check */
						throw new Error(`Unknown HTTP2 promise event: ${event}`);
						return result;
					};
					return result;
				}), cache));
			}
			options.cacheOptions = { ...options.cacheOptions };
			if (options.dnsCache === true) {
				if (!globalDnsCache) globalDnsCache = new cacheable_lookup_1.default();
				options.dnsCache = globalDnsCache;
			} else if (!is_1.default.undefined(options.dnsCache) && !options.dnsCache.lookup) throw new TypeError(`Parameter \`dnsCache\` must be a CacheableLookup instance or a boolean, got ${is_1.default(options.dnsCache)}`);
			if (is_1.default.number(options.timeout)) options.timeout = { request: options.timeout };
			else if (defaults && options.timeout !== defaults.timeout) options.timeout = {
				...defaults.timeout,
				...options.timeout
			};
			else options.timeout = { ...options.timeout };
			if (!options.context) options.context = {};
			const areHooksDefault = options.hooks === (defaults === null || defaults === void 0 ? void 0 : defaults.hooks);
			options.hooks = { ...options.hooks };
			for (const event of exports.knownHookEvents) if (event in options.hooks) if (is_1.default.array(options.hooks[event])) options.hooks[event] = [...options.hooks[event]];
			else throw new TypeError(`Parameter \`${event}\` must be an Array, got ${is_1.default(options.hooks[event])}`);
			else options.hooks[event] = [];
			if (defaults && !areHooksDefault) {
				for (const event of exports.knownHookEvents) if (defaults.hooks[event].length > 0) options.hooks[event] = [...defaults.hooks[event], ...options.hooks[event]];
			}
			if ("family" in options) deprecation_warning_1.default("\"options.family\" was never documented, please use \"options.dnsLookupIpVersion\"");
			if (defaults === null || defaults === void 0 ? void 0 : defaults.https) options.https = {
				...defaults.https,
				...options.https
			};
			if ("rejectUnauthorized" in options) deprecation_warning_1.default("\"options.rejectUnauthorized\" is now deprecated, please use \"options.https.rejectUnauthorized\"");
			if ("checkServerIdentity" in options) deprecation_warning_1.default("\"options.checkServerIdentity\" was never documented, please use \"options.https.checkServerIdentity\"");
			if ("ca" in options) deprecation_warning_1.default("\"options.ca\" was never documented, please use \"options.https.certificateAuthority\"");
			if ("key" in options) deprecation_warning_1.default("\"options.key\" was never documented, please use \"options.https.key\"");
			if ("cert" in options) deprecation_warning_1.default("\"options.cert\" was never documented, please use \"options.https.certificate\"");
			if ("passphrase" in options) deprecation_warning_1.default("\"options.passphrase\" was never documented, please use \"options.https.passphrase\"");
			if ("pfx" in options) deprecation_warning_1.default("\"options.pfx\" was never documented, please use \"options.https.pfx\"");
			if ("followRedirects" in options) throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
			if (options.agent) {
				for (const key in options.agent) if (key !== "http" && key !== "https" && key !== "http2") throw new TypeError(`Expected the \`options.agent\` properties to be \`http\`, \`https\` or \`http2\`, got \`${key}\``);
			}
			options.maxRedirects = (_e = options.maxRedirects) !== null && _e !== void 0 ? _e : 0;
			exports.setNonEnumerableProperties([defaults, rawOptions], options);
			return normalize_arguments_1.default(options, defaults);
		}
		_lockWrite() {
			const onLockedWrite = () => {
				throw new TypeError("The payload has been already provided");
			};
			this.write = onLockedWrite;
			this.end = onLockedWrite;
		}
		_unlockWrite() {
			this.write = super.write;
			this.end = super.end;
		}
		async _finalizeBody() {
			const { options } = this;
			const { headers } = options;
			const isForm = !is_1.default.undefined(options.form);
			const isJSON = !is_1.default.undefined(options.json);
			const isBody = !is_1.default.undefined(options.body);
			const hasPayload = isForm || isJSON || isBody;
			const cannotHaveBody = exports.withoutBody.has(options.method) && !(options.method === "GET" && options.allowGetBody);
			this._cannotHaveBody = cannotHaveBody;
			if (hasPayload) {
				if (cannotHaveBody) throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
				if ([
					isBody,
					isForm,
					isJSON
				].filter((isTrue) => isTrue).length > 1) throw new TypeError("The `body`, `json` and `form` options are mutually exclusive");
				if (isBody && !(options.body instanceof stream_1.Readable) && !is_1.default.string(options.body) && !is_1.default.buffer(options.body) && !is_form_data_1.default(options.body)) throw new TypeError("The `body` option must be a stream.Readable, string or Buffer");
				if (isForm && !is_1.default.object(options.form)) throw new TypeError("The `form` option must be an Object");
				{
					const noContentType = !is_1.default.string(headers["content-type"]);
					if (isBody) {
						if (is_form_data_1.default(options.body) && noContentType) headers["content-type"] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
						this[kBody] = options.body;
					} else if (isForm) {
						if (noContentType) headers["content-type"] = "application/x-www-form-urlencoded";
						this[kBody] = new url_1$1.URLSearchParams(options.form).toString();
					} else {
						if (noContentType) headers["content-type"] = "application/json";
						this[kBody] = options.stringifyJson(options.json);
					}
					const uploadBodySize = await get_body_size_1.default(this[kBody], options.headers);
					if (is_1.default.undefined(headers["content-length"]) && is_1.default.undefined(headers["transfer-encoding"])) {
						if (!cannotHaveBody && !is_1.default.undefined(uploadBodySize)) headers["content-length"] = String(uploadBodySize);
					}
				}
			} else if (cannotHaveBody) this._lockWrite();
			else this._unlockWrite();
			this[kBodySize] = Number(headers["content-length"]) || void 0;
		}
		async _onResponseBase(response) {
			const { options } = this;
			const { url } = options;
			this[kOriginalResponse] = response;
			if (options.decompress) response = decompressResponse(response);
			const statusCode = response.statusCode;
			const typedResponse = response;
			typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : http.STATUS_CODES[statusCode];
			typedResponse.url = options.url.toString();
			typedResponse.requestUrl = this.requestUrl;
			typedResponse.redirectUrls = this.redirects;
			typedResponse.request = this;
			typedResponse.isFromCache = response.fromCache || false;
			typedResponse.ip = this.ip;
			typedResponse.retryCount = this.retryCount;
			this[kIsFromCache] = typedResponse.isFromCache;
			this[kResponseSize] = Number(response.headers["content-length"]) || void 0;
			this[kResponse] = response;
			response.once("end", () => {
				this[kResponseSize] = this[kDownloadedSize];
				this.emit("downloadProgress", this.downloadProgress);
			});
			response.once("error", (error) => {
				response.destroy();
				this._beforeError(new ReadError(error, this));
			});
			response.once("aborted", () => {
				this._beforeError(new ReadError({
					name: "Error",
					message: "The server aborted pending request",
					code: "ECONNRESET"
				}, this));
			});
			this.emit("downloadProgress", this.downloadProgress);
			const rawCookies = response.headers["set-cookie"];
			if (is_1.default.object(options.cookieJar) && rawCookies) {
				let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
				if (options.ignoreInvalidCookies) promises = promises.map(async (p) => p.catch(() => {}));
				try {
					await Promise.all(promises);
				} catch (error) {
					this._beforeError(error);
					return;
				}
			}
			if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
				response.resume();
				if (this[kRequest]) {
					this[kCancelTimeouts]();
					delete this[kRequest];
					this[kUnproxyEvents]();
				}
				if (statusCode === 303 && options.method !== "GET" && options.method !== "HEAD" || !options.methodRewriting) {
					options.method = "GET";
					if ("body" in options) delete options.body;
					if ("json" in options) delete options.json;
					if ("form" in options) delete options.form;
					this[kBody] = void 0;
					delete options.headers["content-length"];
				}
				if (this.redirects.length >= options.maxRedirects) {
					this._beforeError(new MaxRedirectsError(this));
					return;
				}
				try {
					const redirectBuffer = Buffer.from(response.headers.location, "binary").toString();
					const redirectUrl = new url_1$1.URL(redirectBuffer, url);
					const redirectString = redirectUrl.toString();
					function isUnixSocketURL(url) {
						return url.protocol === "unix:" || url.hostname === "unix";
					}
					if (!isUnixSocketURL(url) && isUnixSocketURL(redirectUrl)) {
						this._beforeError(new RequestError("Cannot redirect to UNIX socket", {}, this));
						return;
					}
					if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
						if ("host" in options.headers) delete options.headers.host;
						if ("cookie" in options.headers) delete options.headers.cookie;
						if ("authorization" in options.headers) delete options.headers.authorization;
						if (options.username || options.password) {
							options.username = "";
							options.password = "";
						}
					} else {
						redirectUrl.username = options.username;
						redirectUrl.password = options.password;
					}
					this.redirects.push(redirectString);
					options.url = redirectUrl;
					for (const hook of options.hooks.beforeRedirect) await hook(options, typedResponse);
					this.emit("redirect", typedResponse, options);
					await this._makeRequest();
				} catch (error) {
					this._beforeError(error);
					return;
				}
				return;
			}
			if (options.isStream && options.throwHttpErrors && !is_response_ok_1.isResponseOk(typedResponse)) {
				this._beforeError(new HTTPError(typedResponse));
				return;
			}
			response.on("readable", () => {
				if (this[kTriggerRead]) this._read();
			});
			this.on("resume", () => {
				response.resume();
			});
			this.on("pause", () => {
				response.pause();
			});
			response.once("end", () => {
				this.push(null);
			});
			this.emit("response", response);
			for (const destination of this[kServerResponsesPiped]) {
				if (destination.headersSent) continue;
				for (const key in response.headers) {
					const isAllowed = options.decompress ? key !== "content-encoding" : true;
					const value = response.headers[key];
					if (isAllowed) destination.setHeader(key, value);
				}
				destination.statusCode = statusCode;
			}
		}
		async _onResponse(response) {
			try {
				await this._onResponseBase(response);
			} catch (error) {
				/* istanbul ignore next: better safe than sorry */
				this._beforeError(error);
			}
		}
		_onRequest(request) {
			const { options } = this;
			const { timeout, url } = options;
			http_timer_1.default(request);
			this[kCancelTimeouts] = timed_out_1.default(request, timeout, url);
			const responseEventName = options.cache ? "cacheableResponse" : "response";
			request.once(responseEventName, (response) => {
				this._onResponse(response);
			});
			request.once("error", (error) => {
				var _a;
				request.destroy();
				(_a = request.res) === null || _a === void 0 || _a.removeAllListeners("end");
				error = error instanceof timed_out_1.TimeoutError ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
				this._beforeError(error);
			});
			this[kUnproxyEvents] = proxy_events_1.default(request, this, proxiedRequestEvents);
			this[kRequest] = request;
			this.emit("uploadProgress", this.uploadProgress);
			const body = this[kBody];
			const currentRequest = this.redirects.length === 0 ? this : request;
			if (is_1.default.nodeStream(body)) {
				body.pipe(currentRequest);
				body.once("error", (error) => {
					this._beforeError(new UploadError(error, this));
				});
			} else {
				this._unlockWrite();
				if (!is_1.default.undefined(body)) {
					this._writeRequest(body, void 0, () => {});
					currentRequest.end();
					this._lockWrite();
				} else if (this._cannotHaveBody || this._noPipe) {
					currentRequest.end();
					this._lockWrite();
				}
			}
			this.emit("request", request);
		}
		async _createCacheableRequest(url, options) {
			return new Promise((resolve, reject) => {
				Object.assign(options, url_to_options_1.default(url));
				delete options.url;
				let request;
				const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
					response._readableState.autoDestroy = false;
					if (request) (await request).emit("cacheableResponse", response);
					resolve(response);
				});
				options.url = url;
				cacheRequest.once("error", reject);
				cacheRequest.once("request", async (requestOrPromise) => {
					request = requestOrPromise;
					resolve(request);
				});
			});
		}
		async _makeRequest() {
			var _a, _b, _c, _d, _e;
			const { options } = this;
			const { headers } = options;
			for (const key in headers) if (is_1.default.undefined(headers[key])) delete headers[key];
			else if (is_1.default.null_(headers[key])) throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
			if (options.decompress && is_1.default.undefined(headers["accept-encoding"])) headers["accept-encoding"] = supportsBrotli ? "gzip, deflate, br" : "gzip, deflate";
			if (options.cookieJar) {
				const cookieString = await options.cookieJar.getCookieString(options.url.toString());
				if (is_1.default.nonEmptyString(cookieString)) options.headers.cookie = cookieString;
			}
			for (const hook of options.hooks.beforeRequest) {
				const result = await hook(options);
				if (!is_1.default.undefined(result)) {
					options.request = () => result;
					break;
				}
			}
			if (options.body && this[kBody] !== options.body) this[kBody] = options.body;
			const { agent, request, timeout, url } = options;
			if (options.dnsCache && !("lookup" in options)) options.lookup = options.dnsCache.lookup;
			if (url.hostname === "unix") {
				const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
				if (matches === null || matches === void 0 ? void 0 : matches.groups) {
					const { socketPath, path } = matches.groups;
					Object.assign(options, {
						socketPath,
						path,
						host: ""
					});
				}
			}
			const isHttps = url.protocol === "https:";
			let fallbackFn;
			if (options.http2) fallbackFn = http2wrapper.auto;
			else fallbackFn = isHttps ? https.request : http.request;
			const realFn = (_a = options.request) !== null && _a !== void 0 ? _a : fallbackFn;
			const fn = options.cache ? this._createCacheableRequest : realFn;
			if (agent && !options.http2) options.agent = agent[isHttps ? "https" : "http"];
			options[kRequest] = realFn;
			delete options.request;
			delete options.timeout;
			const requestOptions = options;
			requestOptions.shared = (_b = options.cacheOptions) === null || _b === void 0 ? void 0 : _b.shared;
			requestOptions.cacheHeuristic = (_c = options.cacheOptions) === null || _c === void 0 ? void 0 : _c.cacheHeuristic;
			requestOptions.immutableMinTimeToLive = (_d = options.cacheOptions) === null || _d === void 0 ? void 0 : _d.immutableMinTimeToLive;
			requestOptions.ignoreCargoCult = (_e = options.cacheOptions) === null || _e === void 0 ? void 0 : _e.ignoreCargoCult;
			if (options.dnsLookupIpVersion !== void 0) try {
				requestOptions.family = dns_ip_version_1.dnsLookupIpVersionToFamily(options.dnsLookupIpVersion);
			} catch (_f) {
				throw new Error("Invalid `dnsLookupIpVersion` option value");
			}
			if (options.https) {
				if ("rejectUnauthorized" in options.https) requestOptions.rejectUnauthorized = options.https.rejectUnauthorized;
				if (options.https.checkServerIdentity) requestOptions.checkServerIdentity = options.https.checkServerIdentity;
				if (options.https.certificateAuthority) requestOptions.ca = options.https.certificateAuthority;
				if (options.https.certificate) requestOptions.cert = options.https.certificate;
				if (options.https.key) requestOptions.key = options.https.key;
				if (options.https.passphrase) requestOptions.passphrase = options.https.passphrase;
				if (options.https.pfx) requestOptions.pfx = options.https.pfx;
			}
			try {
				let requestOrResponse = await fn(url, requestOptions);
				if (is_1.default.undefined(requestOrResponse)) requestOrResponse = fallbackFn(url, requestOptions);
				options.request = request;
				options.timeout = timeout;
				options.agent = agent;
				if (options.https) {
					if ("rejectUnauthorized" in options.https) delete requestOptions.rejectUnauthorized;
					if (options.https.checkServerIdentity) delete requestOptions.checkServerIdentity;
					if (options.https.certificateAuthority) delete requestOptions.ca;
					if (options.https.certificate) delete requestOptions.cert;
					if (options.https.key) delete requestOptions.key;
					if (options.https.passphrase) delete requestOptions.passphrase;
					if (options.https.pfx) delete requestOptions.pfx;
				}
				if (isClientRequest(requestOrResponse)) this._onRequest(requestOrResponse);
				else if (this.writable) {
					this.once("finish", () => {
						this._onResponse(requestOrResponse);
					});
					this._unlockWrite();
					this.end();
					this._lockWrite();
				} else this._onResponse(requestOrResponse);
			} catch (error) {
				if (error instanceof CacheableRequest.CacheError) throw new CacheError(error, this);
				throw new RequestError(error.message, error, this);
			}
		}
		async _error(error) {
			try {
				for (const hook of this.options.hooks.beforeError) error = await hook(error);
			} catch (error_) {
				error = new RequestError(error_.message, error_, this);
			}
			this.destroy(error);
		}
		_beforeError(error) {
			if (this[kStopReading]) return;
			const { options } = this;
			const retryCount = this.retryCount + 1;
			this[kStopReading] = true;
			if (!(error instanceof RequestError)) error = new RequestError(error.message, error, this);
			const typedError = error;
			const { response } = typedError;
			(async () => {
				if (response && !response.body) {
					response.setEncoding(this._readableState.encoding);
					try {
						response.rawBody = await get_buffer_1.default(response);
						response.body = response.rawBody.toString();
					} catch (_a) {}
				}
				if (this.listenerCount("retry") !== 0) {
					let backoff;
					try {
						let retryAfter;
						if (response && "retry-after" in response.headers) {
							retryAfter = Number(response.headers["retry-after"]);
							if (Number.isNaN(retryAfter)) {
								retryAfter = Date.parse(response.headers["retry-after"]) - Date.now();
								if (retryAfter <= 0) retryAfter = 1;
							} else retryAfter *= 1e3;
						}
						backoff = await options.retry.calculateDelay({
							attemptCount: retryCount,
							retryOptions: options.retry,
							error: typedError,
							retryAfter,
							computedValue: calculate_retry_delay_1.default({
								attemptCount: retryCount,
								retryOptions: options.retry,
								error: typedError,
								retryAfter,
								computedValue: 0
							})
						});
					} catch (error_) {
						this._error(new RequestError(error_.message, error_, this));
						return;
					}
					if (backoff) {
						const retry = async () => {
							try {
								for (const hook of this.options.hooks.beforeRetry) await hook(this.options, typedError, retryCount);
							} catch (error_) {
								this._error(new RequestError(error_.message, error, this));
								return;
							}
							if (this.destroyed) return;
							this.destroy();
							this.emit("retry", retryCount, error);
						};
						this[kRetryTimeout] = setTimeout(retry, backoff);
						return;
					}
				}
				this._error(typedError);
			})();
		}
		_read() {
			this[kTriggerRead] = true;
			const response = this[kResponse];
			if (response && !this[kStopReading]) {
				if (response.readableLength) this[kTriggerRead] = false;
				let data;
				while ((data = response.read()) !== null) {
					this[kDownloadedSize] += data.length;
					this[kStartedReading] = true;
					const progress = this.downloadProgress;
					if (progress.percent < 1) this.emit("downloadProgress", progress);
					this.push(data);
				}
			}
		}
		_write(chunk, encoding, callback) {
			const write = () => {
				this._writeRequest(chunk, encoding, callback);
			};
			if (this.requestInitialized) write();
			else this[kJobs].push(write);
		}
		_writeRequest(chunk, encoding, callback) {
			if (this[kRequest].destroyed) return;
			this._progressCallbacks.push(() => {
				this[kUploadedSize] += Buffer.byteLength(chunk, encoding);
				const progress = this.uploadProgress;
				if (progress.percent < 1) this.emit("uploadProgress", progress);
			});
			this[kRequest].write(chunk, encoding, (error) => {
				if (!error && this._progressCallbacks.length > 0) this._progressCallbacks.shift()();
				callback(error);
			});
		}
		_final(callback) {
			const endRequest = () => {
				while (this._progressCallbacks.length !== 0) this._progressCallbacks.shift()();
				if (!(kRequest in this)) {
					callback();
					return;
				}
				if (this[kRequest].destroyed) {
					callback();
					return;
				}
				this[kRequest].end((error) => {
					if (!error) {
						this[kBodySize] = this[kUploadedSize];
						this.emit("uploadProgress", this.uploadProgress);
						this[kRequest].emit("upload-complete");
					}
					callback(error);
				});
			};
			if (this.requestInitialized) endRequest();
			else this[kJobs].push(endRequest);
		}
		_destroy(error, callback) {
			var _a;
			this[kStopReading] = true;
			clearTimeout(this[kRetryTimeout]);
			if (kRequest in this) {
				this[kCancelTimeouts]();
				if (!((_a = this[kResponse]) === null || _a === void 0 ? void 0 : _a.complete)) this[kRequest].destroy();
			}
			if (error !== null && !is_1.default.undefined(error) && !(error instanceof RequestError)) error = new RequestError(error.message, error, this);
			callback(error);
		}
		get _isAboutToError() {
			return this[kStopReading];
		}
		/**
		The remote IP address.
		*/
		get ip() {
			var _a;
			return (_a = this.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress;
		}
		/**
		Indicates whether the request has been aborted or not.
		*/
		get aborted() {
			var _a, _b, _c;
			return ((_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroyed) !== null && _b !== void 0 ? _b : this.destroyed) && !((_c = this[kOriginalResponse]) === null || _c === void 0 ? void 0 : _c.complete);
		}
		get socket() {
			var _a, _b;
			return (_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.socket) !== null && _b !== void 0 ? _b : void 0;
		}
		/**
		Progress event for downloading (receiving a response).
		*/
		get downloadProgress() {
			let percent;
			if (this[kResponseSize]) percent = this[kDownloadedSize] / this[kResponseSize];
			else if (this[kResponseSize] === this[kDownloadedSize]) percent = 1;
			else percent = 0;
			return {
				percent,
				transferred: this[kDownloadedSize],
				total: this[kResponseSize]
			};
		}
		/**
		Progress event for uploading (sending a request).
		*/
		get uploadProgress() {
			let percent;
			if (this[kBodySize]) percent = this[kUploadedSize] / this[kBodySize];
			else if (this[kBodySize] === this[kUploadedSize]) percent = 1;
			else percent = 0;
			return {
				percent,
				transferred: this[kUploadedSize],
				total: this[kBodySize]
			};
		}
		/**
		The object contains the following properties:
		
		- `start` - Time when the request started.
		- `socket` - Time when a socket was assigned to the request.
		- `lookup` - Time when the DNS lookup finished.
		- `connect` - Time when the socket successfully connected.
		- `secureConnect` - Time when the socket securely connected.
		- `upload` - Time when the request finished uploading.
		- `response` - Time when the request fired `response` event.
		- `end` - Time when the response fired `end` event.
		- `error` - Time when the request fired `error` event.
		- `abort` - Time when the request fired `abort` event.
		- `phases`
		- `wait` - `timings.socket - timings.start`
		- `dns` - `timings.lookup - timings.socket`
		- `tcp` - `timings.connect - timings.lookup`
		- `tls` - `timings.secureConnect - timings.connect`
		- `request` - `timings.upload - (timings.secureConnect || timings.connect)`
		- `firstByte` - `timings.response - timings.upload`
		- `download` - `timings.end - timings.response`
		- `total` - `(timings.end || timings.error || timings.abort) - timings.start`
		
		If something has not been measured yet, it will be `undefined`.
		
		__Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
		*/
		get timings() {
			var _a;
			return (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.timings;
		}
		/**
		Whether the response was retrieved from the cache.
		*/
		get isFromCache() {
			return this[kIsFromCache];
		}
		pipe(destination, options) {
			if (this[kStartedReading]) throw new Error("Failed to pipe. The response has been emitted already.");
			if (destination instanceof http_1.ServerResponse) this[kServerResponsesPiped].add(destination);
			return super.pipe(destination, options);
		}
		unpipe(destination) {
			if (destination instanceof http_1.ServerResponse) this[kServerResponsesPiped].delete(destination);
			super.unpipe(destination);
			return this;
		}
	};
	exports.default = Request;
}));
//#endregion
//#region node_modules/got/dist/source/as-promise/types.js
var require_types$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		Object.defineProperty(o, k2, {
			enumerable: true,
			get: function() {
				return m[k];
			}
		});
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$5) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$5, p)) __createBinding(exports$5, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CancelError = exports.ParseError = void 0;
	var core_1 = require_core();
	/**
	An error to be thrown when server response code is 2xx, and parsing body fails.
	Includes a `response` property.
	*/
	var ParseError = class extends core_1.RequestError {
		constructor(error, response) {
			const { options } = response.request;
			super(`${error.message} in "${options.url.toString()}"`, error, response.request);
			this.name = "ParseError";
			this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_BODY_PARSE_FAILURE" : this.code;
		}
	};
	exports.ParseError = ParseError;
	/**
	An error to be thrown when the request is aborted with `.cancel()`.
	*/
	var CancelError = class extends core_1.RequestError {
		constructor(request) {
			super("Promise was canceled", {}, request);
			this.name = "CancelError";
			this.code = "ERR_CANCELED";
		}
		get isCanceled() {
			return true;
		}
	};
	exports.CancelError = CancelError;
	__exportStar(require_core(), exports);
}));
//#endregion
//#region node_modules/got/dist/source/as-promise/parse-body.js
var require_parse_body = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var types_1 = require_types$1();
	var parseBody = (response, responseType, parseJson, encoding) => {
		const { rawBody } = response;
		try {
			if (responseType === "text") return rawBody.toString(encoding);
			if (responseType === "json") return rawBody.length === 0 ? "" : parseJson(rawBody.toString());
			if (responseType === "buffer") return rawBody;
			throw new types_1.ParseError({
				message: `Unknown body type '${responseType}'`,
				name: "Error"
			}, response);
		} catch (error) {
			throw new types_1.ParseError(error, response);
		}
	};
	exports.default = parseBody;
}));
//#endregion
//#region node_modules/got/dist/source/as-promise/index.js
var require_as_promise = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		Object.defineProperty(o, k2, {
			enumerable: true,
			get: function() {
				return m[k];
			}
		});
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$4) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$4, p)) __createBinding(exports$4, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var events_1 = __require("events");
	var is_1 = require_dist();
	var PCancelable = require_p_cancelable();
	var types_1 = require_types$1();
	var parse_body_1 = require_parse_body();
	var core_1 = require_core();
	var proxy_events_1 = require_proxy_events();
	var get_buffer_1 = require_get_buffer();
	var is_response_ok_1 = require_is_response_ok();
	var proxiedRequestEvents = [
		"request",
		"response",
		"redirect",
		"uploadProgress",
		"downloadProgress"
	];
	function asPromise(normalizedOptions) {
		let globalRequest;
		let globalResponse;
		const emitter = new events_1.EventEmitter();
		const promise = new PCancelable((resolve, reject, onCancel) => {
			const makeRequest = (retryCount) => {
				const request = new core_1.default(void 0, normalizedOptions);
				request.retryCount = retryCount;
				request._noPipe = true;
				onCancel(() => request.destroy());
				onCancel.shouldReject = false;
				onCancel(() => reject(new types_1.CancelError(request)));
				globalRequest = request;
				request.once("response", async (response) => {
					var _a;
					response.retryCount = retryCount;
					if (response.request.aborted) return;
					let rawBody;
					try {
						rawBody = await get_buffer_1.default(request);
						response.rawBody = rawBody;
					} catch (_b) {
						return;
					}
					if (request._isAboutToError) return;
					const contentEncoding = ((_a = response.headers["content-encoding"]) !== null && _a !== void 0 ? _a : "").toLowerCase();
					const isCompressed = [
						"gzip",
						"deflate",
						"br"
					].includes(contentEncoding);
					const { options } = request;
					if (isCompressed && !options.decompress) response.body = rawBody;
					else try {
						response.body = parse_body_1.default(response, options.responseType, options.parseJson, options.encoding);
					} catch (error) {
						response.body = rawBody.toString();
						if (is_response_ok_1.isResponseOk(response)) {
							request._beforeError(error);
							return;
						}
					}
					try {
						for (const [index, hook] of options.hooks.afterResponse.entries()) response = await hook(response, async (updatedOptions) => {
							const typedOptions = core_1.default.normalizeArguments(void 0, {
								...updatedOptions,
								retry: { calculateDelay: () => 0 },
								throwHttpErrors: false,
								resolveBodyOnly: false
							}, options);
							typedOptions.hooks.afterResponse = typedOptions.hooks.afterResponse.slice(0, index);
							for (const hook of typedOptions.hooks.beforeRetry) await hook(typedOptions);
							const promise = asPromise(typedOptions);
							onCancel(() => {
								promise.catch(() => {});
								promise.cancel();
							});
							return promise;
						});
					} catch (error) {
						request._beforeError(new types_1.RequestError(error.message, error, request));
						return;
					}
					globalResponse = response;
					if (!is_response_ok_1.isResponseOk(response)) {
						request._beforeError(new types_1.HTTPError(response));
						return;
					}
					request.destroy();
					resolve(request.options.resolveBodyOnly ? response.body : response);
				});
				const onError = (error) => {
					if (promise.isCanceled) return;
					const { options } = request;
					if (error instanceof types_1.HTTPError && !options.throwHttpErrors) {
						const { response } = error;
						resolve(request.options.resolveBodyOnly ? response.body : response);
						return;
					}
					reject(error);
				};
				request.once("error", onError);
				const previousBody = request.options.body;
				request.once("retry", (newRetryCount, error) => {
					var _a, _b;
					if (previousBody === ((_a = error.request) === null || _a === void 0 ? void 0 : _a.options.body) && is_1.default.nodeStream((_b = error.request) === null || _b === void 0 ? void 0 : _b.options.body)) {
						onError(error);
						return;
					}
					makeRequest(newRetryCount);
				});
				proxy_events_1.default(request, emitter, proxiedRequestEvents);
			};
			makeRequest(0);
		});
		promise.on = (event, fn) => {
			emitter.on(event, fn);
			return promise;
		};
		const shortcut = (responseType) => {
			const newPromise = (async () => {
				await promise;
				const { options } = globalResponse.request;
				return parse_body_1.default(globalResponse, responseType, options.parseJson, options.encoding);
			})();
			Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
			return newPromise;
		};
		promise.json = () => {
			const { headers } = globalRequest.options;
			if (!globalRequest.writableFinished && headers.accept === void 0) headers.accept = "application/json";
			return shortcut("json");
		};
		promise.buffer = () => shortcut("buffer");
		promise.text = () => shortcut("text");
		return promise;
	}
	exports.default = asPromise;
	__exportStar(require_types$1(), exports);
}));
//#endregion
//#region node_modules/got/dist/source/as-promise/create-rejection.js
var require_create_rejection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var types_1 = require_types$1();
	function createRejection(error, ...beforeErrorGroups) {
		const promise = (async () => {
			if (error instanceof types_1.RequestError) try {
				for (const hooks of beforeErrorGroups) if (hooks) for (const hook of hooks) error = await hook(error);
			} catch (error_) {
				error = error_;
			}
			throw error;
		})();
		const returnPromise = () => promise;
		promise.json = returnPromise;
		promise.text = returnPromise;
		promise.buffer = returnPromise;
		promise.on = returnPromise;
		return promise;
	}
	exports.default = createRejection;
}));
//#endregion
//#region node_modules/got/dist/source/utils/deep-freeze.js
var require_deep_freeze = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var is_1 = require_dist();
	function deepFreeze(object) {
		for (const value of Object.values(object)) if (is_1.default.plainObject(value) || is_1.default.array(value)) deepFreeze(value);
		return Object.freeze(object);
	}
	exports.default = deepFreeze;
}));
//#endregion
//#region node_modules/got/dist/source/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/got/dist/source/create.js
var require_create = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		Object.defineProperty(o, k2, {
			enumerable: true,
			get: function() {
				return m[k];
			}
		});
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$3) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$3, p)) __createBinding(exports$3, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultHandler = void 0;
	var is_1 = require_dist();
	var as_promise_1 = require_as_promise();
	var create_rejection_1 = require_create_rejection();
	var core_1 = require_core();
	var deep_freeze_1 = require_deep_freeze();
	var errors = {
		RequestError: as_promise_1.RequestError,
		CacheError: as_promise_1.CacheError,
		ReadError: as_promise_1.ReadError,
		HTTPError: as_promise_1.HTTPError,
		MaxRedirectsError: as_promise_1.MaxRedirectsError,
		TimeoutError: as_promise_1.TimeoutError,
		ParseError: as_promise_1.ParseError,
		CancelError: as_promise_1.CancelError,
		UnsupportedProtocolError: as_promise_1.UnsupportedProtocolError,
		UploadError: as_promise_1.UploadError
	};
	var delay = async (ms) => new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
	var { normalizeArguments } = core_1.default;
	var mergeOptions = (...sources) => {
		let mergedOptions;
		for (const source of sources) mergedOptions = normalizeArguments(void 0, source, mergedOptions);
		return mergedOptions;
	};
	var getPromiseOrStream = (options) => options.isStream ? new core_1.default(void 0, options) : as_promise_1.default(options);
	var isGotInstance = (value) => "defaults" in value && "options" in value.defaults;
	var aliases = [
		"get",
		"post",
		"put",
		"patch",
		"head",
		"delete"
	];
	exports.defaultHandler = (options, next) => next(options);
	var callInitHooks = (hooks, options) => {
		if (hooks) for (const hook of hooks) hook(options);
	};
	var create = (defaults) => {
		defaults._rawHandlers = defaults.handlers;
		defaults.handlers = defaults.handlers.map((fn) => ((options, next) => {
			let root;
			const result = fn(options, (newOptions) => {
				root = next(newOptions);
				return root;
			});
			if (result !== root && !options.isStream && root) {
				const typedResult = result;
				const { then: promiseThen, catch: promiseCatch, finally: promiseFianlly } = typedResult;
				Object.setPrototypeOf(typedResult, Object.getPrototypeOf(root));
				Object.defineProperties(typedResult, Object.getOwnPropertyDescriptors(root));
				typedResult.then = promiseThen;
				typedResult.catch = promiseCatch;
				typedResult.finally = promiseFianlly;
			}
			return result;
		}));
		const got = ((url, options = {}, _defaults) => {
			var _a, _b;
			let iteration = 0;
			const iterateHandlers = (newOptions) => {
				return defaults.handlers[iteration++](newOptions, iteration === defaults.handlers.length ? getPromiseOrStream : iterateHandlers);
			};
			if (is_1.default.plainObject(url)) {
				const mergedOptions = {
					...url,
					...options
				};
				core_1.setNonEnumerableProperties([url, options], mergedOptions);
				options = mergedOptions;
				url = void 0;
			}
			try {
				let initHookError;
				try {
					callInitHooks(defaults.options.hooks.init, options);
					callInitHooks((_a = options.hooks) === null || _a === void 0 ? void 0 : _a.init, options);
				} catch (error) {
					initHookError = error;
				}
				const normalizedOptions = normalizeArguments(url, options, _defaults !== null && _defaults !== void 0 ? _defaults : defaults.options);
				normalizedOptions[core_1.kIsNormalizedAlready] = true;
				if (initHookError) throw new as_promise_1.RequestError(initHookError.message, initHookError, normalizedOptions);
				return iterateHandlers(normalizedOptions);
			} catch (error) {
				if (options.isStream) throw error;
				else return create_rejection_1.default(error, defaults.options.hooks.beforeError, (_b = options.hooks) === null || _b === void 0 ? void 0 : _b.beforeError);
			}
		});
		got.extend = (...instancesOrOptions) => {
			const optionsArray = [defaults.options];
			let handlers = [...defaults._rawHandlers];
			let isMutableDefaults;
			for (const value of instancesOrOptions) if (isGotInstance(value)) {
				optionsArray.push(value.defaults.options);
				handlers.push(...value.defaults._rawHandlers);
				isMutableDefaults = value.defaults.mutableDefaults;
			} else {
				optionsArray.push(value);
				if ("handlers" in value) handlers.push(...value.handlers);
				isMutableDefaults = value.mutableDefaults;
			}
			handlers = handlers.filter((handler) => handler !== exports.defaultHandler);
			if (handlers.length === 0) handlers.push(exports.defaultHandler);
			return create({
				options: mergeOptions(...optionsArray),
				handlers,
				mutableDefaults: Boolean(isMutableDefaults)
			});
		};
		const paginateEach = (async function* (url, options) {
			let normalizedOptions = normalizeArguments(url, options, defaults.options);
			normalizedOptions.resolveBodyOnly = false;
			const pagination = normalizedOptions.pagination;
			if (!is_1.default.object(pagination)) throw new TypeError("`options.pagination` must be implemented");
			const all = [];
			let { countLimit } = pagination;
			let numberOfRequests = 0;
			while (numberOfRequests < pagination.requestLimit) {
				if (numberOfRequests !== 0) await delay(pagination.backoff);
				const result = await got(void 0, void 0, normalizedOptions);
				const parsed = await pagination.transform(result);
				const current = [];
				for (const item of parsed) if (pagination.filter(item, all, current)) {
					if (!pagination.shouldContinue(item, all, current)) return;
					yield item;
					if (pagination.stackAllItems) all.push(item);
					current.push(item);
					if (--countLimit <= 0) return;
				}
				const optionsToMerge = pagination.paginate(result, all, current);
				if (optionsToMerge === false) return;
				if (optionsToMerge === result.request.options) normalizedOptions = result.request.options;
				else if (optionsToMerge !== void 0) normalizedOptions = normalizeArguments(void 0, optionsToMerge, normalizedOptions);
				numberOfRequests++;
			}
		});
		got.paginate = paginateEach;
		got.paginate.all = (async (url, options) => {
			const results = [];
			for await (const item of paginateEach(url, options)) results.push(item);
			return results;
		});
		got.paginate.each = paginateEach;
		got.stream = ((url, options) => got(url, {
			...options,
			isStream: true
		}));
		for (const method of aliases) {
			got[method] = ((url, options) => got(url, {
				...options,
				method
			}));
			got.stream[method] = ((url, options) => {
				return got(url, {
					...options,
					method,
					isStream: true
				});
			});
		}
		Object.assign(got, errors);
		Object.defineProperty(got, "defaults", {
			value: defaults.mutableDefaults ? defaults : deep_freeze_1.default(defaults),
			writable: defaults.mutableDefaults,
			configurable: defaults.mutableDefaults,
			enumerable: true
		});
		got.mergeOptions = mergeOptions;
		return got;
	};
	exports.default = create;
	__exportStar(require_types(), exports);
}));
//#endregion
//#region node_modules/got/dist/source/index.js
var require_source = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		Object.defineProperty(o, k2, {
			enumerable: true,
			get: function() {
				return m[k];
			}
		});
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var url_1 = __require("url");
	var create_1 = require_create();
	var defaults = {
		options: {
			method: "GET",
			retry: {
				limit: 2,
				methods: [
					"GET",
					"PUT",
					"HEAD",
					"DELETE",
					"OPTIONS",
					"TRACE"
				],
				statusCodes: [
					408,
					413,
					429,
					500,
					502,
					503,
					504,
					521,
					522,
					524
				],
				errorCodes: [
					"ETIMEDOUT",
					"ECONNRESET",
					"EADDRINUSE",
					"ECONNREFUSED",
					"EPIPE",
					"ENOTFOUND",
					"ENETUNREACH",
					"EAI_AGAIN"
				],
				maxRetryAfter: void 0,
				calculateDelay: ({ computedValue }) => computedValue
			},
			timeout: {},
			headers: { "user-agent": "got (https://github.com/sindresorhus/got)" },
			hooks: {
				init: [],
				beforeRequest: [],
				beforeRedirect: [],
				beforeRetry: [],
				beforeError: [],
				afterResponse: []
			},
			cache: void 0,
			dnsCache: void 0,
			decompress: true,
			throwHttpErrors: true,
			followRedirect: true,
			isStream: false,
			responseType: "text",
			resolveBodyOnly: false,
			maxRedirects: 10,
			prefixUrl: "",
			methodRewriting: true,
			ignoreInvalidCookies: false,
			context: {},
			http2: false,
			allowGetBody: false,
			https: void 0,
			pagination: {
				transform: (response) => {
					if (response.request.options.responseType === "json") return response.body;
					return JSON.parse(response.body);
				},
				paginate: (response) => {
					if (!Reflect.has(response.headers, "link")) return false;
					const items = response.headers.link.split(",");
					let next;
					for (const item of items) {
						const parsed = item.split(";");
						if (parsed[1].includes("next")) {
							next = parsed[0].trimStart().trim();
							next = next.slice(1, -1);
							break;
						}
					}
					if (next) return { url: new url_1.URL(next) };
					return false;
				},
				filter: () => true,
				shouldContinue: () => true,
				countLimit: Infinity,
				backoff: 0,
				requestLimit: 1e4,
				stackAllItems: true
			},
			parseJson: (text) => JSON.parse(text),
			stringifyJson: (object) => JSON.stringify(object),
			cacheOptions: {}
		},
		handlers: [create_1.defaultHandler],
		mutableDefaults: false
	};
	var got = create_1.default(defaults);
	exports.default = got;
	module.exports = got;
	module.exports.default = got;
	module.exports.__esModule = true;
	__exportStar(require_create(), exports);
	__exportStar(require_as_promise(), exports);
}));
//#endregion
//#region node_modules/ably/build/ably-node.js
var require_ably_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*@license Copyright 2015-2022 Ably Real-time Ltd (ably.com)
	
	Ably JavaScript Library v2.26.0
	https://github.com/ably/ably-js
	
	Released under the Apache Licence v2.0*/ (function(g, f) {
		if ("object" == typeof exports && "object" == typeof module) module.exports = f(require_ws(), require_source());
		else if ("function" == typeof define && define.amd) define(["ws", "got"], f);
		else if ("object" == typeof exports) exports["Ably"] = f(require_ws(), require_source());
		else g["Ably"] = f(g["ws"], g["got"]);
	})(exports, (__da, __db) => {
		var exports$1 = {};
		var module$1 = { exports: exports$1 };
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __defProps = Object.defineProperties;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getOwnPropSymbols = Object.getOwnPropertySymbols;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __propIsEnum = Object.prototype.propertyIsEnumerable;
		var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
			enumerable: true,
			configurable: true,
			writable: true,
			value
		}) : obj[key] = value;
		var __spreadValues = (a, b) => {
			for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
			if (__getOwnPropSymbols) {
				for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
			}
			return a;
		};
		var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
		var __objRest = (source, exclude) => {
			var target = {};
			for (var prop in source) if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
			if (source != null && __getOwnPropSymbols) {
				for (var prop of __getOwnPropSymbols(source)) if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
			}
			return target;
		};
		var __commonJS = (cb, mod) => function __require() {
			return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
		};
		var __export = (target, all) => {
			for (var name in all) __defProp(target, name, {
				get: all[name],
				enumerable: true
			});
		};
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") {
				for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: () => from[key],
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		var __await = function(promise, isYieldStar) {
			this[0] = promise;
			this[1] = isYieldStar;
		};
		var __asyncGenerator = (__this, __arguments, generator) => {
			var resume = (k, v, yes, no) => {
				try {
					var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
					Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? {
						done: y.done,
						value: y.value
					} : y, yes, no) : yes({
						value: y,
						done
					})).catch((e) => resume("throw", e, yes, no));
				} catch (e) {
					no(e);
				}
			};
			var method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no));
			var it = {};
			return generator = generator.apply(__this, __arguments), it[Symbol.asyncIterator] = () => it, method("next"), method("throw"), method("return"), it;
		};
		var require_from = __commonJS({ "node_modules/bops/from.js"(exports2, module2) {
			var Buffer2 = __require("buffer").Buffer;
			var version2 = ((process || {}).version || "v0.0.0").slice(1).split(".")[0];
			module2.exports = Number(version2) < 6 ? function from(source, encoding) {
				return new Buffer2(source, encoding);
			} : function from(source, encoding) {
				return Buffer2.from(source, encoding);
			};
		} });
		var require_to = __commonJS({ "node_modules/bops/to.js"(exports2, module2) {
			module2.exports = function(source, encoding) {
				return source.toString(encoding);
			};
		} });
		var require_is = __commonJS({ "node_modules/bops/is.js"(exports2, module2) {
			var Buffer2 = __require("buffer").Buffer;
			module2.exports = function(buffer) {
				return Buffer2.isBuffer(buffer);
			};
		} });
		var require_subarray = __commonJS({ "node_modules/bops/subarray.js"(exports2, module2) {
			module2.exports = function(source, from, to) {
				return arguments.length === 2 ? source.slice(from) : source.slice(from, to);
			};
		} });
		var require_join = __commonJS({ "node_modules/bops/join.js"(exports2, module2) {
			var Buffer2 = __require("buffer").Buffer;
			module2.exports = function(targets, hint) {
				return hint !== void 0 ? Buffer2.concat(targets, hint) : Buffer2.concat(targets);
			};
		} });
		var require_copy = __commonJS({ "node_modules/bops/copy.js"(exports2, module2) {
			module2.exports = copy2;
			function copy2(source, target, target_start, source_start, source_end) {
				return source.copy(target, target_start, source_start, source_end);
			}
		} });
		var require_create = __commonJS({ "node_modules/bops/create.js"(exports2, module2) {
			var Buffer2 = __require("buffer").Buffer;
			var version2 = ((process || {}).version || "v0.0.0").slice(1).split(".")[0];
			module2.exports = Number(version2) < 6 ? function create(size) {
				return new Buffer2(size);
			} : function create(size) {
				return Buffer2.alloc(size);
			};
		} });
		var require_read = __commonJS({ "node_modules/bops/read.js"(exports2, module2) {
			var proto = {};
			var rex = /read.+/;
			var buildFn = function(key2) {
				var code = "return buf." + key2 + "(" + [
					"a",
					"b",
					"c"
				].join(",") + ")";
				return new Function([
					"buf",
					"a",
					"b",
					"c"
				], code);
			};
			module2.exports = proto;
			for (key in Buffer.prototype) if (rex.test(key)) proto[key] = buildFn(key);
			var key;
		} });
		var require_write = __commonJS({ "node_modules/bops/write.js"(exports2, module2) {
			var Buffer2 = __require("buffer").Buffer;
			var proto = {};
			var rex = /write.+/;
			var buildFn = function(key2) {
				var code = "return buf." + key2 + "(" + [
					"a",
					"b",
					"c"
				].join(",") + ")";
				return new Function([
					"buf",
					"a",
					"b",
					"c"
				], code);
			};
			module2.exports = proto;
			for (key in Buffer2.prototype) if (rex.test(key)) proto[key] = buildFn(key);
			var key;
		} });
		var require_bops = __commonJS({ "node_modules/bops/index.js"(exports2, module2) {
			var proto = {};
			module2.exports = proto;
			proto.from = require_from();
			proto.to = require_to();
			proto.is = require_is();
			proto.subarray = require_subarray();
			proto.join = require_join();
			proto.copy = require_copy();
			proto.create = require_create();
			mix(require_read(), proto);
			mix(require_write(), proto);
			function mix(from, into) {
				for (var key in from) into[key] = from[key];
			}
		} });
		var require_msgpack = __commonJS({ "node_modules/@ably/msgpack-js/msgpack.js"(exports2) {
			"use strict";
			var bops = require_bops();
			exports2.encode = function(value, sparse) {
				var size = sizeof(value, sparse);
				if (size == 0) return void 0;
				var buffer = bops.create(size);
				encode2(value, buffer, 0, sparse);
				return buffer;
			};
			exports2.decode = decode2;
			var SH_L_32 = 65536 * 65536;
			var SH_R_32 = 1 / SH_L_32;
			function readInt64BE(buf, offset) {
				offset = offset || 0;
				return buf.readInt32BE(offset + 0) * SH_L_32 + buf.readUInt32BE(offset + 4);
			}
			function readUInt64BE(buf, offset) {
				offset = offset || 0;
				return buf.readUInt32BE(offset + 0) * SH_L_32 + buf.readUInt32BE(offset + 4);
			}
			function writeInt64BE(buf, val, offset) {
				if (val < 0x8000000000000000) {
					buf.writeInt32BE(Math.floor(val * SH_R_32), offset);
					buf.writeInt32BE(val & -1, offset + 4);
				} else {
					buf.writeUInt32BE(2147483647, offset);
					buf.writeUInt32BE(4294967295, offset + 4);
				}
			}
			function writeUInt64BE(buf, val, offset) {
				if (val < 0x10000000000000000) {
					buf.writeUInt32BE(Math.floor(val * SH_R_32), offset);
					buf.writeInt32BE(val & -1, offset + 4);
				} else {
					buf.writeUInt32BE(4294967295, offset);
					buf.writeUInt32BE(4294967295, offset + 4);
				}
			}
			function Decoder(buffer, offset) {
				this.offset = offset || 0;
				this.buffer = buffer;
				this.bufferLength = buffer.length;
			}
			Decoder.prototype.map = function(length) {
				if (length * 2 > this.bufferLength) throw new Error(`malformed messagepack detected: buffer size was ${this.bufferLength}, but referenced a map of length ${length})`);
				var value = {};
				for (var i = 0; i < length; i++) {
					var key = this.parse();
					value[key] = this.parse();
				}
				return value;
			};
			Decoder.prototype.bin = Decoder.prototype.buf = function(length) {
				if (length > this.bufferLength) throw new Error(`malformed messagepack detected: buffer size was ${this.bufferLength}, but referenced a binary of length ${length})`);
				var value = bops.subarray(this.buffer, this.offset, this.offset + length);
				this.offset += length;
				return value;
			};
			Decoder.prototype.str = function(length) {
				if (length > this.bufferLength) throw new Error(`malformed messagepack detected: buffer size was ${this.bufferLength}, but referenced a string of length ${length})`);
				var value = bops.to(bops.subarray(this.buffer, this.offset, this.offset + length));
				this.offset += length;
				return value;
			};
			Decoder.prototype.array = function(length) {
				if (length > this.bufferLength) throw new Error(`malformed messagepack detected: buffer size was ${this.bufferLength}, but referenced an array of length ${length})`);
				var value = new Array(length);
				for (var i = 0; i < length; i++) value[i] = this.parse();
				return value;
			};
			Decoder.prototype.parse = function() {
				var type = this.buffer[this.offset];
				var value, length, extType;
				if (type === void 0) throw new Error("malformed messagepack (referenced offset is outside buffer)");
				if ((type & 128) === 0) {
					this.offset++;
					return type;
				}
				if ((type & 240) === 128) {
					length = type & 15;
					this.offset++;
					return this.map(length);
				}
				if ((type & 240) === 144) {
					length = type & 15;
					this.offset++;
					return this.array(length);
				}
				if ((type & 224) === 160) {
					length = type & 31;
					this.offset++;
					return this.str(length);
				}
				if ((type & 224) === 224) {
					value = bops.readInt8(this.buffer, this.offset);
					this.offset++;
					return value;
				}
				switch (type) {
					case 192:
						this.offset++;
						return null;
					case 194:
						this.offset++;
						return false;
					case 195:
						this.offset++;
						return true;
					case 196:
						length = bops.readUInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return this.bin(length);
					case 197:
						length = bops.readUInt16BE(this.buffer, this.offset + 1);
						this.offset += 3;
						return this.bin(length);
					case 198:
						length = bops.readUInt32BE(this.buffer, this.offset + 1);
						this.offset += 5;
						return this.bin(length);
					case 199:
						length = bops.readUInt8(this.buffer, this.offset + 1);
						extType = bops.readUInt8(this.buffer, this.offset + 2);
						this.offset += 3;
						return [extType, this.bin(length)];
					case 200:
						length = bops.readUInt16BE(this.buffer, this.offset + 1);
						extType = bops.readUInt8(this.buffer, this.offset + 3);
						this.offset += 4;
						return [extType, this.bin(length)];
					case 201:
						length = bops.readUInt32BE(this.buffer, this.offset + 1);
						extType = bops.readUInt8(this.buffer, this.offset + 5);
						this.offset += 6;
						return [extType, this.bin(length)];
					case 202:
						value = bops.readFloatBE(this.buffer, this.offset + 1);
						this.offset += 5;
						return value;
					case 203:
						value = bops.readDoubleBE(this.buffer, this.offset + 1);
						this.offset += 9;
						return value;
					case 204:
						value = this.buffer[this.offset + 1];
						this.offset += 2;
						return value;
					case 205:
						value = bops.readUInt16BE(this.buffer, this.offset + 1);
						this.offset += 3;
						return value;
					case 206:
						value = bops.readUInt32BE(this.buffer, this.offset + 1);
						this.offset += 5;
						return value;
					case 207:
						value = readUInt64BE(this.buffer, this.offset + 1);
						this.offset += 9;
						return value;
					case 208:
						value = bops.readInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return value;
					case 209:
						value = bops.readInt16BE(this.buffer, this.offset + 1);
						this.offset += 3;
						return value;
					case 210:
						value = bops.readInt32BE(this.buffer, this.offset + 1);
						this.offset += 5;
						return value;
					case 211:
						value = readInt64BE(this.buffer, this.offset + 1);
						this.offset += 9;
						return value;
					case 212:
						extType = bops.readUInt8(this.buffer, this.offset + 1);
						value = bops.readUInt8(this.buffer, this.offset + 2);
						this.offset += 3;
						return extType === 0 && value === 0 ? void 0 : [extType, value];
					case 213:
						extType = bops.readUInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return [extType, this.bin(2)];
					case 214:
						extType = bops.readUInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return [extType, this.bin(4)];
					case 215:
						extType = bops.readUInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return [extType, this.bin(8)];
					case 216:
						extType = bops.readUInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return [extType, this.bin(16)];
					case 217:
						length = bops.readUInt8(this.buffer, this.offset + 1);
						this.offset += 2;
						return this.str(length);
					case 218:
						length = bops.readUInt16BE(this.buffer, this.offset + 1);
						this.offset += 3;
						return this.str(length);
					case 219:
						length = bops.readUInt32BE(this.buffer, this.offset + 1);
						this.offset += 5;
						return this.str(length);
					case 220:
						length = bops.readUInt16BE(this.buffer, this.offset + 1);
						this.offset += 3;
						return this.array(length);
					case 221:
						length = bops.readUInt32BE(this.buffer, this.offset + 1);
						this.offset += 5;
						return this.array(length);
					case 222:
						length = bops.readUInt16BE(this.buffer, this.offset + 1);
						this.offset += 3;
						return this.map(length);
					case 223:
						length = bops.readUInt32BE(this.buffer, this.offset + 1);
						this.offset += 5;
						return this.map(length);
				}
				throw new Error("Unknown type 0x" + type.toString(16));
			};
			function decode2(buffer) {
				var decoder = new Decoder(buffer);
				var value = decoder.parse();
				if (decoder.offset !== buffer.length) throw new Error(buffer.length - decoder.offset + " trailing bytes");
				return value;
			}
			function encodeableKeys(value, sparse) {
				return Object.keys(value).filter(function(e) {
					var val = value[e];
					return (!sparse || val !== void 0 && val !== null) && ("function" !== typeof val || !!val.toJSON);
				});
			}
			function encode2(value, buffer, offset, sparse, isMapElement) {
				var type = typeof value;
				var length, size;
				if (type === "string") {
					value = bops.from(value);
					length = value.length;
					if (length < 32) {
						buffer[offset] = length | 160;
						bops.copy(value, buffer, offset + 1);
						return 1 + length;
					}
					if (length < 256) {
						buffer[offset] = 217;
						bops.writeUInt8(buffer, length, offset + 1);
						bops.copy(value, buffer, offset + 2);
						return 2 + length;
					}
					if (length < 65536) {
						buffer[offset] = 218;
						bops.writeUInt16BE(buffer, length, offset + 1);
						bops.copy(value, buffer, offset + 3);
						return 3 + length;
					}
					if (length < 4294967296) {
						buffer[offset] = 219;
						bops.writeUInt32BE(buffer, length, offset + 1);
						bops.copy(value, buffer, offset + 5);
						return 5 + length;
					}
				}
				if (bops.is(value)) {
					length = value.length;
					if (length < 256) {
						buffer[offset] = 196;
						bops.writeUInt8(buffer, length, offset + 1);
						bops.copy(value, buffer, offset + 2);
						return 2 + length;
					}
					if (length < 65536) {
						buffer[offset] = 197;
						bops.writeUInt16BE(buffer, length, offset + 1);
						bops.copy(value, buffer, offset + 3);
						return 3 + length;
					}
					if (length < 4294967296) {
						buffer[offset] = 198;
						bops.writeUInt32BE(buffer, length, offset + 1);
						bops.copy(value, buffer, offset + 5);
						return 5 + length;
					}
				}
				if (type === "number") {
					if (Math.floor(value) !== value) {
						buffer[offset] = 203;
						bops.writeDoubleBE(buffer, value, offset + 1);
						return 9;
					}
					if (value >= 0) {
						if (value < 128) {
							buffer[offset] = value;
							return 1;
						}
						if (value < 256) {
							buffer[offset] = 204;
							buffer[offset + 1] = value;
							return 2;
						}
						if (value < 65536) {
							buffer[offset] = 205;
							bops.writeUInt16BE(buffer, value, offset + 1);
							return 3;
						}
						if (value < 4294967296) {
							buffer[offset] = 206;
							bops.writeUInt32BE(buffer, value, offset + 1);
							return 5;
						}
						if (value < 0x10000000000000000) {
							buffer[offset] = 207;
							writeUInt64BE(buffer, value, offset + 1);
							return 9;
						}
						throw new Error("Number too big 0x" + value.toString(16));
					}
					if (value >= -32) {
						bops.writeInt8(buffer, value, offset);
						return 1;
					}
					if (value >= -128) {
						buffer[offset] = 208;
						bops.writeInt8(buffer, value, offset + 1);
						return 2;
					}
					if (value >= -32768) {
						buffer[offset] = 209;
						bops.writeInt16BE(buffer, value, offset + 1);
						return 3;
					}
					if (value >= -2147483648) {
						buffer[offset] = 210;
						bops.writeInt32BE(buffer, value, offset + 1);
						return 5;
					}
					if (value >= -0x8000000000000000) {
						buffer[offset] = 211;
						writeInt64BE(buffer, value, offset + 1);
						return 9;
					}
					throw new Error("Number too small -0x" + value.toString(16).substr(1));
				}
				if (type === "undefined") {
					if (sparse && isMapElement) return 0;
					buffer[offset] = 212;
					buffer[offset + 1] = 0;
					buffer[offset + 2] = 0;
					return 3;
				}
				if (value === null) {
					if (sparse && isMapElement) return 0;
					buffer[offset] = 192;
					return 1;
				}
				if (type === "boolean") {
					buffer[offset] = value ? 195 : 194;
					return 1;
				}
				if ("function" === typeof value.toJSON) return encode2(value.toJSON(), buffer, offset, sparse);
				if (type === "object") {
					size = 0;
					var isArray = Array.isArray(value);
					if (isArray) length = value.length;
					else {
						var keys = encodeableKeys(value, sparse);
						length = keys.length;
					}
					if (length < 16) {
						buffer[offset] = length | (isArray ? 144 : 128);
						size = 1;
					} else if (length < 65536) {
						buffer[offset] = isArray ? 220 : 222;
						bops.writeUInt16BE(buffer, length, offset + 1);
						size = 3;
					} else if (length < 4294967296) {
						buffer[offset] = isArray ? 221 : 223;
						bops.writeUInt32BE(buffer, length, offset + 1);
						size = 5;
					}
					if (isArray) for (var i = 0; i < length; i++) size += encode2(value[i], buffer, offset + size, sparse);
					else for (var i = 0; i < length; i++) {
						var key = keys[i];
						size += encode2(key, buffer, offset + size);
						size += encode2(value[key], buffer, offset + size, sparse, true);
					}
					return size;
				}
				if (type === "function") return void 0;
				throw new Error("Unknown type " + type);
			}
			function sizeof(value, sparse, isMapElement) {
				var type = typeof value;
				var length, size;
				if (type === "string") {
					length = bops.from(value).length;
					if (length < 32) return 1 + length;
					if (length < 256) return 2 + length;
					if (length < 65536) return 3 + length;
					if (length < 4294967296) return 5 + length;
				}
				if (bops.is(value)) {
					length = value.length;
					if (length < 256) return 2 + length;
					if (length < 65536) return 3 + length;
					if (length < 4294967296) return 5 + length;
				}
				if (type === "number") {
					if (Math.floor(value) !== value) return 9;
					if (value >= 0) {
						if (value < 128) return 1;
						if (value < 256) return 2;
						if (value < 65536) return 3;
						if (value < 4294967296) return 5;
						if (value < 0x10000000000000000) return 9;
						throw new Error("Number too big 0x" + value.toString(16));
					}
					if (value >= -32) return 1;
					if (value >= -128) return 2;
					if (value >= -32768) return 3;
					if (value >= -2147483648) return 5;
					if (value >= -0x8000000000000000) return 9;
					throw new Error("Number too small -0x" + value.toString(16).substr(1));
				}
				if (type === "boolean") return 1;
				if (value === null) return sparse && isMapElement ? 0 : 1;
				if (value === void 0) return sparse && isMapElement ? 0 : 3;
				if ("function" === typeof value.toJSON) return sizeof(value.toJSON(), sparse);
				if (type === "object") {
					size = 0;
					if (Array.isArray(value)) {
						length = value.length;
						for (var i = 0; i < length; i++) size += sizeof(value[i], sparse);
					} else {
						var keys = encodeableKeys(value, sparse);
						length = keys.length;
						for (var i = 0; i < length; i++) {
							var key = keys[i];
							size += sizeof(key) + sizeof(value[key], sparse, true);
						}
					}
					if (length < 16) return 1 + size;
					if (length < 65536) return 3 + size;
					if (length < 4294967296) return 5 + size;
					throw new Error("Array or object too long 0x" + length.toString(16));
				}
				if (type === "function") return 0;
				throw new Error("Unknown type " + type);
			}
		} });
		var Platform = class {};
		var globalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : self;
		function pad(timeSegment, three) {
			return `${timeSegment}`.padStart(three ? 3 : 2, "0");
		}
		function getHandler(logger) {
			return Platform.Config.logTimestamps ? function(msg) {
				const time = new Date(Platform.Config.now());
				logger(pad(time.getHours()) + ":" + pad(time.getMinutes()) + ":" + pad(time.getSeconds()) + "." + pad(time.getMilliseconds(), 1) + " " + msg);
			} : function(msg) {
				logger(msg);
			};
		}
		var getDefaultLoggers = () => {
			var _a2;
			let consoleLogger;
			let errorLogger;
			if (typeof ((_a2 = globalObject == null ? void 0 : globalObject.console) == null ? void 0 : _a2.log) === "function") {
				consoleLogger = function(...args) {
					console.log.apply(console, args);
				};
				errorLogger = console.warn ? function(...args) {
					console.warn.apply(console, args);
				} : consoleLogger;
			} else consoleLogger = errorLogger = function() {};
			return [consoleLogger, errorLogger].map(getHandler);
		};
		var _Logger = class _Logger {
			constructor() {
				this.deprecated = (description, msg) => {
					this.deprecationWarning(`${description} is deprecated and will be removed in a future version. ${msg}`);
				};
				this.shouldLog = (level) => {
					return level <= this.logLevel;
				};
				this.setLog = (level, handler) => {
					if (level !== void 0) this.logLevel = level;
					if (handler !== void 0) this.logHandler = this.logErrorHandler = handler;
				};
				this.logLevel = _Logger.defaultLogLevel;
				this.logHandler = _Logger.defaultLogHandler;
				this.logErrorHandler = _Logger.defaultLogErrorHandler;
			}
			static initLogHandlers() {
				const [logHandler, logErrorHandler] = getDefaultLoggers();
				this.defaultLogHandler = logHandler;
				this.defaultLogErrorHandler = logErrorHandler;
				this.defaultLogger = new _Logger();
			}
			/**
			* Calls to this method are never stripped by the `stripLogs` esbuild plugin. Use it for log statements that you wish to always be included in the modular variant of the SDK.
			*/
			static logActionNoStrip(logger, level, action, message) {
				logger.logAction(level, action, message);
			}
			/**
			* Suffix appended to the silent-failure warning emitted when `ClientOptions.strictMode` is off, so the reader knows the same call will reject with an error in a future major version.
			*
			* The suffix is for log output only. Do not put it into `ErrorInfo.remediation`. The remediation is also surfaced on the error when `ClientOptions.strictMode` is enabled, where the suffix would be misleading.
			*/
			static silentFailureLogSuffix() {
				return " This call currently fails silently because clientOptions.strictMode is not enabled. A future major version will make this call fail with an error. Set clientOptions.strictMode: true to make this call reject with an error now.";
			}
			logAction(level, action, message) {
				if (this.shouldLog(level)) (level === 1 ? this.logErrorHandler : this.logHandler)("Ably: " + action + ": " + message, level);
			}
			renamedClientOption(oldName, newName) {
				this.deprecationWarning(`The \`${oldName}\` client option has been renamed to \`${newName}\`. Please update your code to use \`${newName}\` instead. \`${oldName}\` will be removed in a future version.`);
			}
			renamedMethod(className, oldName, newName) {
				this.deprecationWarning(`\`${className}\`\u2019s \`${oldName}\` method has been renamed to \`${newName}\`. Please update your code to use \`${newName}\` instead. \`${oldName}\` will be removed in a future version.`);
			}
			deprecationWarning(message) {
				if (this.shouldLog(1)) this.logErrorHandler(`Ably: Deprecation warning - ${message}`, 1);
			}
		};
		_Logger.defaultLogLevel = 1;
		_Logger.LOG_NONE = 0;
		_Logger.LOG_ERROR = 1;
		_Logger.LOG_MAJOR = 2;
		_Logger.LOG_MINOR = 3;
		_Logger.LOG_MICRO = 4;
		/**
		* In the modular variant of the SDK, the `stripLogs` esbuild plugin strips out all calls to this method (when invoked as `Logger.logAction(...)`) except when called with level `Logger.LOG_ERROR`. If you wish for a log statement to never be stripped, use the {@link logActionNoStrip} method instead.
		*
		* The aforementioned plugin expects `level` to be an expression of the form `Logger.LOG_*`; that is, you can’t dynamically specify the log level.
		*/
		_Logger.logAction = (logger, level, action, message) => {
			_Logger.logActionNoStrip(logger, level, action, message);
		};
		var logger_default = _Logger;
		var utils_exports = {};
		__export(utils_exports, {
			Format: () => Format,
			allSame: () => allSame,
			allToLowerCase: () => allToLowerCase,
			allToUpperCase: () => allToUpperCase,
			arrChooseN: () => arrChooseN,
			arrDeleteValue: () => arrDeleteValue,
			arrEquals: () => arrEquals,
			arrIntersect: () => arrIntersect,
			arrIntersectOb: () => arrIntersectOb,
			arrPopRandomElement: () => arrPopRandomElement,
			arrWithoutValue: () => arrWithoutValue,
			cheapRandStr: () => cheapRandStr,
			containsValue: () => containsValue,
			copy: () => copy,
			createMissingPluginError: () => createMissingPluginError,
			dataSizeBytes: () => dataSizeBytes,
			decodeBody: () => decodeBody,
			detectV1Callback: () => detectV1Callback,
			encodeBody: () => encodeBody,
			ensureArray: () => ensureArray,
			forInOwnNonNullProperties: () => forInOwnNonNullProperties,
			getBackoffCoefficient: () => getBackoffCoefficient,
			getGlobalObject: () => getGlobalObject,
			getJitterCoefficient: () => getJitterCoefficient,
			getRetryTime: () => getRetryTime,
			inherits: () => inherits,
			inspectBody: () => inspectBody,
			inspectError: () => inspectError,
			intersect: () => intersect,
			isEmpty: () => isEmpty,
			isErrorInfoOrPartialErrorInfo: () => isErrorInfoOrPartialErrorInfo,
			isNil: () => isNil,
			isObject: () => isObject,
			keysArray: () => keysArray,
			listenerToAsyncIterator: () => listenerToAsyncIterator,
			matchDerivedChannel: () => matchDerivedChannel,
			mixin: () => mixin,
			parseQueryString: () => parseQueryString,
			prototypicalClone: () => prototypicalClone,
			randomString: () => randomString,
			shallowClone: () => shallowClone,
			shallowEquals: () => shallowEquals,
			stringifyValues: () => stringifyValues,
			throwMissingPluginError: () => throwMissingPluginError,
			toBase64: () => toBase64,
			toQueryString: () => toQueryString,
			valuesArray: () => valuesArray,
			whenPromiseSettles: () => whenPromiseSettles,
			withTimeoutAsync: () => withTimeoutAsync
		});
		function toString(err) {
			let result = "[" + err.constructor.name;
			if (err.message) result += ": " + err.message;
			if (err.statusCode) result += "; statusCode=" + err.statusCode;
			if (err.code) result += "; code=" + err.code;
			if (err.cause) result += "; cause=" + inspectError(err.cause);
			if (err.remediation) result += "; remediation=" + err.remediation;
			if (err.detail && Object.keys(err.detail).length > 0) result += "; detail=" + JSON.stringify(err.detail);
			if (err.href && !(err.message && err.message.indexOf("help.ably.io") > -1)) result += "; see " + err.href + " ";
			result += "]";
			return result;
		}
		var ErrorInfo = class _ErrorInfo extends Error {
			constructor(messageOrValues, code, statusCode, cause, detail) {
				var __super = (...args) => {
					super(...args);
				};
				if (typeof messageOrValues === "object") {
					const values = messageOrValues;
					if (typeof values.message !== "string" || typeof values.code !== "number" || typeof values.statusCode !== "number" || !isNil(values.detail) && (typeof values.detail !== "object" || Array.isArray(values.detail))) throw new Error("ErrorInfo: invalid values: " + Platform.Config.inspect(values));
					__super(values.message);
					if (typeof Object.setPrototypeOf !== "undefined") Object.setPrototypeOf(this, _ErrorInfo.prototype);
					this.code = values.code;
					this.statusCode = values.statusCode;
					this.detail = values.detail;
					Object.assign(this, values);
				} else {
					__super(messageOrValues);
					if (typeof Object.setPrototypeOf !== "undefined") Object.setPrototypeOf(this, _ErrorInfo.prototype);
					this.code = code;
					this.statusCode = statusCode;
					this.cause = cause;
					this.detail = detail;
				}
			}
			toString() {
				return toString(this);
			}
			static fromValues(values) {
				const result = new _ErrorInfo(values);
				if (result.code && !result.href) result.href = "https://help.ably.io/error/" + result.code;
				return result;
			}
		};
		var PartialErrorInfo = class _PartialErrorInfo extends Error {
			constructor(messageOrValues, code, statusCode, cause, detail) {
				var __super = (...args) => {
					super(...args);
				};
				if (typeof messageOrValues === "object") {
					const values = messageOrValues;
					if (typeof values.message !== "string" || !isNil(values.code) && typeof values.code !== "number" || !isNil(values.statusCode) && typeof values.statusCode !== "number" || !isNil(values.detail) && (typeof values.detail !== "object" || Array.isArray(values.detail))) throw new Error("PartialErrorInfo: invalid values: " + Platform.Config.inspect(values));
					__super(values.message);
					if (typeof Object.setPrototypeOf !== "undefined") Object.setPrototypeOf(this, _PartialErrorInfo.prototype);
					this.code = values.code;
					this.statusCode = values.statusCode;
					this.detail = values.detail;
					Object.assign(this, values);
				} else {
					__super(messageOrValues);
					if (typeof Object.setPrototypeOf !== "undefined") Object.setPrototypeOf(this, _PartialErrorInfo.prototype);
					this.code = code;
					this.statusCode = statusCode;
					this.cause = cause;
					this.detail = detail;
				}
			}
			toString() {
				return toString(this);
			}
			static fromValues(values) {
				const result = new _PartialErrorInfo(values);
				if (result.code && !result.href) result.href = "https://help.ably.io/error/" + result.code;
				return result;
			}
		};
		function randomPosn(arrOrStr) {
			return Math.floor(Math.random() * arrOrStr.length);
		}
		function mixin(target, ...args) {
			for (let i = 0; i < args.length; i++) {
				const source = args[i];
				if (!source) break;
				for (const key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
			}
			return target;
		}
		function copy(src) {
			return mixin({}, src);
		}
		function ensureArray(obj) {
			if (isNil(obj)) return [];
			if (Array.isArray(obj)) return obj;
			return [obj];
		}
		function isObject(ob) {
			return Object.prototype.toString.call(ob) == "[object Object]";
		}
		function isEmpty(ob) {
			for (const prop in ob) return false;
			return true;
		}
		function isNil(arg) {
			return arg == null;
		}
		function shallowClone(ob) {
			const result = /* @__PURE__ */ new Object();
			for (const prop in ob) result[prop] = ob[prop];
			return result;
		}
		function prototypicalClone(ob, ownProperties) {
			class F {}
			F.prototype = ob;
			const result = new F();
			if (ownProperties) mixin(result, ownProperties);
			return result;
		}
		var inherits = function(ctor, superCtor) {
			if (Platform.Config.inherits) {
				Platform.Config.inherits(ctor, superCtor);
				return;
			}
			ctor.super_ = superCtor;
			ctor.prototype = prototypicalClone(superCtor.prototype, { constructor: ctor });
		};
		function containsValue(ob, val) {
			for (const i in ob) if (ob[i] == val) return true;
			return false;
		}
		function intersect(arr, ob) {
			return Array.isArray(ob) ? arrIntersect(arr, ob) : arrIntersectOb(arr, ob);
		}
		function arrIntersect(arr1, arr2) {
			const result = [];
			for (let i = 0; i < arr1.length; i++) {
				const member = arr1[i];
				if (arr2.indexOf(member) != -1) result.push(member);
			}
			return result;
		}
		function arrIntersectOb(arr, ob) {
			const result = [];
			for (let i = 0; i < arr.length; i++) {
				const member = arr[i];
				if (member in ob) result.push(member);
			}
			return result;
		}
		function arrDeleteValue(arr, val) {
			const idx = arr.indexOf(val);
			const res = idx != -1;
			if (res) arr.splice(idx, 1);
			return res;
		}
		function arrWithoutValue(arr, val) {
			const newArr = arr.slice();
			arrDeleteValue(newArr, val);
			return newArr;
		}
		function keysArray(ob, ownOnly) {
			const result = [];
			for (const prop in ob) {
				if (ownOnly && !Object.prototype.hasOwnProperty.call(ob, prop)) continue;
				result.push(prop);
			}
			return result;
		}
		function valuesArray(ob, ownOnly) {
			const result = [];
			for (const prop in ob) {
				if (ownOnly && !Object.prototype.hasOwnProperty.call(ob, prop)) continue;
				result.push(ob[prop]);
			}
			return result;
		}
		function forInOwnNonNullProperties(ob, fn) {
			for (const prop in ob) if (Object.prototype.hasOwnProperty.call(ob, prop) && ob[prop]) fn(prop);
		}
		function allSame(arr, prop) {
			if (arr.length === 0) return true;
			const first = arr[0][prop];
			return arr.every(function(item) {
				return item[prop] === first;
			});
		}
		var Format = /* @__PURE__ */ ((Format2) => {
			Format2["msgpack"] = "msgpack";
			Format2["json"] = "json";
			return Format2;
		})(Format || {});
		function arrPopRandomElement(arr) {
			return arr.splice(randomPosn(arr), 1)[0];
		}
		function toQueryString(params) {
			const parts = [];
			if (params) for (const key in params) parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
			return parts.length ? "?" + parts.join("&") : "";
		}
		function stringifyValues(params) {
			return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]));
		}
		function parseQueryString(query) {
			let match;
			const search = /([^?&=]+)=?([^&]*)/g;
			const result = {};
			while (match = search.exec(query)) result[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
			return result;
		}
		function isErrorInfoOrPartialErrorInfo(err) {
			return typeof err == "object" && err !== null && (err instanceof ErrorInfo || err instanceof PartialErrorInfo);
		}
		function detectV1Callback(args, v2TrailingFnArity) {
			const n = args.length;
			if (typeof args[n - 1] !== "function") return;
			if (n <= v2TrailingFnArity && typeof args[n - 2] !== "function") return;
			throw new ErrorInfo({
				message: "v1 callback signature is no longer supported: v2 methods return a promise.",
				code: 40025,
				statusCode: 400,
				remediation: "Drop the trailing callback and `await` the returned promise. See https://github.com/ably/ably-js/blob/main/docs/migration-guides/v2/lib.md."
			});
		}
		function inspectError(err) {
			var _a2, _b;
			if (err instanceof Error || ((_a2 = err == null ? void 0 : err.constructor) == null ? void 0 : _a2.name) === "ErrorInfo" || ((_b = err == null ? void 0 : err.constructor) == null ? void 0 : _b.name) === "PartialErrorInfo") return err.toString();
			return Platform.Config.inspect(err);
		}
		function inspectBody(body) {
			if (Platform.BufferUtils.isBuffer(body)) return body.toString();
			else if (typeof body === "string") return body;
			else return Platform.Config.inspect(body);
		}
		function dataSizeBytes(data) {
			if (Platform.BufferUtils.isBuffer(data)) return Platform.BufferUtils.byteLength(data);
			if (typeof data === "string") return Platform.Config.stringByteSize(data);
			if (typeof data === "number") return 8;
			if (typeof data === "boolean") return 1;
			throw new Error(`Expected input of Utils.dataSizeBytes to be a string, a number, a boolean or a buffer, but was: ${typeof data}`);
		}
		function cheapRandStr() {
			return String(Math.random()).substr(2);
		}
		var randomString = async (numBytes) => {
			const buffer = await Platform.Config.getRandomArrayBuffer(numBytes);
			return Platform.BufferUtils.base64Encode(buffer);
		};
		function arrChooseN(arr, n) {
			const numItems = Math.min(n, arr.length), mutableArr = arr.slice(), result = [];
			for (let i = 0; i < numItems; i++) result.push(arrPopRandomElement(mutableArr));
			return result;
		}
		function whenPromiseSettles(promise, callback) {
			promise.then((result) => {
				callback?.(null, result);
			}).catch((err) => {
				callback?.(err);
			});
		}
		function decodeBody(body, MsgPack, format) {
			if (format == "msgpack") {
				if (!MsgPack) throwMissingPluginError("MsgPack");
				return MsgPack.decode(body);
			}
			return JSON.parse(String(body));
		}
		function encodeBody(body, MsgPack, format) {
			if (format == "msgpack") {
				if (!MsgPack) throwMissingPluginError("MsgPack");
				return MsgPack.encode(body, true);
			}
			return JSON.stringify(body);
		}
		function allToLowerCase(arr) {
			return arr.map(function(element) {
				return element && element.toLowerCase();
			});
		}
		function allToUpperCase(arr) {
			return arr.map(function(element) {
				return element && element.toUpperCase();
			});
		}
		function getBackoffCoefficient(count) {
			return Math.min((count + 2) / 3, 2);
		}
		function getJitterCoefficient() {
			return 1 - Math.random() * .2;
		}
		function getRetryTime(initialTimeout, retryAttempt) {
			return initialTimeout * getBackoffCoefficient(retryAttempt) * getJitterCoefficient();
		}
		function getGlobalObject() {
			if (typeof global !== "undefined") return global;
			if (typeof window !== "undefined") return window;
			return self;
		}
		function shallowEquals(source, target) {
			return Object.keys(source).every((key) => source[key] === target[key]) && Object.keys(target).every((key) => target[key] === source[key]);
		}
		function matchDerivedChannel(name) {
			const match = name.match(/^(\[([^?]*)(?:(.*))\])?(.+)$/);
			if (!match || !match.length || match.length < 5) throw new ErrorInfo({
				message: "Channel name is empty or could not be parsed",
				code: 40010,
				statusCode: 400,
				remediation: "Pass a non-empty channel name to channels.getDerived(name, { filter: ... }) and put the filter expression in the filter option, not in the name. A channel-params prefix such as \"[?rewind=1]foo\" is allowed. See https://ably.com/docs/channels#derived."
			});
			if (match[2]) throw new ErrorInfo({
				message: `cannot use a derived option with a ${match[2]} channel`,
				code: 40010,
				statusCode: 400,
				remediation: `Use a base channel name instead, without the "${match[2]}" qualifier.`
			});
			return {
				qualifierParam: match[3] || "",
				channelName: match[4]
			};
		}
		function toBase64(str) {
			const bufferUtils = Platform.BufferUtils;
			const textBuffer = bufferUtils.utf8Encode(str);
			return bufferUtils.base64Encode(textBuffer);
		}
		function arrEquals(a, b) {
			return a.length === b.length && a.every(function(val, i) {
				return val === b[i];
			});
		}
		function createMissingPluginError(pluginName) {
			let remediation;
			switch (pluginName) {
				case "Push":
					remediation = "Import Push from \"ably/push\" and pass it in ClientOptions.plugins: { Push }.";
					break;
				case "LiveObjects":
					remediation = "Import { LiveObjects } from \"ably/liveobjects\" and pass it in ClientOptions.plugins: { LiveObjects }.";
					break;
				default:
					remediation = `Import ${pluginName} from "ably/modular" and pass it in ClientOptions.plugins: { ${pluginName} }. See the modular variant reference at https://sdk.ably.com/builds/ably/ably-js/main/typedoc/modules/modular.html.`;
					break;
			}
			return new ErrorInfo({
				message: `${pluginName} plugin not provided`,
				code: 40019,
				statusCode: 400,
				remediation
			});
		}
		function throwMissingPluginError(pluginName) {
			throw createMissingPluginError(pluginName);
		}
		async function withTimeoutAsync(promise, timeout = 5e3, err = "Timeout expired") {
			const e = new ErrorInfo(err, 5e4, 500);
			return Promise.race([promise, new Promise((_resolve, reject) => Platform.Config.setTimeout(() => reject(e), timeout))]);
		}
		function listenerToAsyncIterator(registerListener) {
			return __asyncGenerator(this, null, function* () {
				const eventQueue = [];
				let resolveNext = null;
				const removeListener2 = registerListener((event) => {
					if (resolveNext) {
						const resolve = resolveNext;
						resolveNext = null;
						resolve(event);
					} else eventQueue.push(event);
				});
				try {
					while (true) if (eventQueue.length > 0) yield eventQueue.shift();
					else {
						if (resolveNext) throw new ErrorInfo({
							message: "Concurrent next() calls are not supported",
							code: 4e4,
							statusCode: 400,
							remediation: "Drive the async iterator from a single for-await-of loop."
						});
						yield yield new __await(new Promise((resolve) => {
							resolveNext = resolve;
						}));
					}
				} finally {
					removeListener2();
				}
			});
		}
		var version = "2.26.0";
		var Defaults = {
			ENDPOINT: "main",
			ENVIRONMENT: "",
			REST_HOST: "rest.ably.io",
			REALTIME_HOST: "realtime.ably.io",
			FALLBACK_HOSTS: [
				"main.a.fallback.ably-realtime.com",
				"main.b.fallback.ably-realtime.com",
				"main.c.fallback.ably-realtime.com",
				"main.d.fallback.ably-realtime.com",
				"main.e.fallback.ably-realtime.com"
			],
			PORT: 80,
			TLS_PORT: 443,
			TIMEOUTS: {
				disconnectedRetryTimeout: 15e3,
				suspendedRetryTimeout: 3e4,
				httpRequestTimeout: 1e4,
				httpMaxRetryDuration: 15e3,
				channelRetryTimeout: 15e3,
				fallbackRetryTimeout: 6e5,
				connectionStateTtl: 12e4,
				realtimeRequestTimeout: 1e4,
				recvTimeout: 9e4,
				webSocketConnectTimeout: 1e4,
				webSocketSlowTimeout: 4e3
			},
			httpMaxRetryCount: 3,
			maxMessageSize: 65536,
			version,
			protocolVersion: 6,
			agent: "ably-js/" + version,
			getPort,
			getHttpScheme,
			getPrimaryDomainFromEndpoint,
			getEndpointFallbackHosts,
			getFallbackHosts,
			getHosts,
			checkHost,
			objectifyOptions,
			normaliseOptions,
			defaultGetHeaders,
			defaultPostHeaders
		};
		function getPort(options, tls) {
			return tls || options.tls ? options.tlsPort : options.port;
		}
		function getHttpScheme(options) {
			return options.tls ? "https://" : "http://";
		}
		function isFqdnIpOrLocalhost(endpoint) {
			return endpoint.includes(".") || endpoint.includes("::") || endpoint === "localhost";
		}
		function getPrimaryDomainFromEndpoint(endpoint) {
			if (isFqdnIpOrLocalhost(endpoint)) return endpoint;
			if (endpoint.startsWith("nonprod:")) return `${endpoint.replace("nonprod:", "")}.realtime.ably-nonprod.net`;
			return `${endpoint}.realtime.ably.net`;
		}
		function getEndpointFallbackHosts(endpoint) {
			if (isFqdnIpOrLocalhost(endpoint)) return [];
			if (endpoint.startsWith("nonprod:")) return endpointFallbacks(endpoint.replace("nonprod:", ""), "ably-realtime-nonprod.com");
			return endpointFallbacks(endpoint, "ably-realtime.com");
		}
		function endpointFallbacks(routingPolicyId, domain) {
			return [
				"a",
				"b",
				"c",
				"d",
				"e"
			].map((id) => `${routingPolicyId}.${id}.fallback.${domain}`);
		}
		function getFallbackHosts(options) {
			const fallbackHosts = options.fallbackHosts, httpMaxRetryCount = typeof options.httpMaxRetryCount !== "undefined" ? options.httpMaxRetryCount : Defaults.httpMaxRetryCount;
			return fallbackHosts ? arrChooseN(fallbackHosts, httpMaxRetryCount) : [];
		}
		function getHosts(options) {
			return [options.primaryDomain].concat(getFallbackHosts(options));
		}
		function checkHost(host) {
			if (typeof host !== "string") throw new ErrorInfo({
				message: "host must be a string: was of type " + typeof host,
				code: 4e4,
				statusCode: 400,
				remediation: "Make every entry of `fallbackHosts` a string. If you set `restHost` or `realtimeHost`, pass each as a single string, not an array or object."
			});
			if (!host.length) throw new ErrorInfo({
				message: "host must not be zero-length: an entry of `fallbackHosts` is an empty string",
				code: 4e4,
				statusCode: 400,
				remediation: "Remove any empty-string entry from the `fallbackHosts` array."
			});
		}
		function getTimeouts(options) {
			const timeouts = {};
			for (const prop in Defaults.TIMEOUTS) timeouts[prop] = options[prop] || Defaults.TIMEOUTS[prop];
			return timeouts;
		}
		function getAgentString(options) {
			let agentStr = Defaults.agent;
			if (options.agents) for (var agent2 in options.agents) agentStr += " " + agent2 + "/" + options.agents[agent2];
			return agentStr;
		}
		function objectifyOptions(options, allowKeyOrToken, sourceForErrorMessage, logger, modularPluginsToInclude) {
			if (options === void 0) {
				const msg = allowKeyOrToken ? `${sourceForErrorMessage} must be initialized with either a client options object, an Ably API key, or an Ably Token` : `${sourceForErrorMessage} must be initialized with a client options object`;
				logger_default.logAction(logger, logger_default.LOG_ERROR, `${sourceForErrorMessage}()`, msg);
				throw new Error(msg);
			}
			let optionsObj;
			if (typeof options === "string") if (options.indexOf(":") == -1) {
				if (!allowKeyOrToken) {
					const msg = `${sourceForErrorMessage} cannot be initialized with just an Ably Token; you must provide a client options object with a \`plugins\` property. (Set this Ably Token as the object\u2019s \`token\` property.)`;
					logger_default.logAction(logger, logger_default.LOG_ERROR, `${sourceForErrorMessage}()`, msg);
					throw new Error(msg);
				}
				optionsObj = { token: options };
			} else {
				if (!allowKeyOrToken) {
					const msg = `${sourceForErrorMessage} cannot be initialized with just an Ably API key; you must provide a client options object with a \`plugins\` property. (Set this Ably API key as the object\u2019s \`key\` property.)`;
					logger_default.logAction(logger, logger_default.LOG_ERROR, `${sourceForErrorMessage}()`, msg);
					throw new Error(msg);
				}
				optionsObj = { key: options };
			}
			else optionsObj = options;
			if (modularPluginsToInclude) optionsObj = __spreadProps(__spreadValues({}, optionsObj), { plugins: __spreadValues(__spreadValues({}, modularPluginsToInclude), optionsObj.plugins) });
			return optionsObj;
		}
		function checkIfClientOptionsAreValid(options) {
			if (options.endpoint && (options.environment || options.restHost || options.realtimeHost)) throw new ErrorInfo({
				message: "The `endpoint` option cannot be used in conjunction with the `environment`, `restHost`, or `realtimeHost` options.",
				code: 40106,
				statusCode: 400,
				remediation: "Remove `environment`, `restHost`, and `realtimeHost` from `ClientOptions` and use only `endpoint`, which replaces them."
			});
			if (options.environment && (options.restHost || options.realtimeHost)) throw new ErrorInfo({
				message: "The `environment` option cannot be used in conjunction with the `restHost`, or `realtimeHost` options.",
				code: 40106,
				statusCode: 400,
				remediation: "Remove `environment`, `restHost`, and `realtimeHost` from `ClientOptions` and use only `endpoint`, which replaces them."
			});
		}
		function normaliseOptions(options, MsgPack, logger) {
			const loggerToUse = logger != null ? logger : logger_default.defaultLogger;
			if (options.environment) loggerToUse.deprecated("The `environment` client option", "Use the `endpoint` client option instead.");
			if (options.restHost) loggerToUse.deprecated("The `restHost` client option", "Use the `endpoint` client option instead.");
			if (options.realtimeHost) loggerToUse.deprecated("The `realtimeHost` client option", "Use the `endpoint` client option instead.");
			checkIfClientOptionsAreValid(options);
			if (typeof options.recover === "function" && options.closeOnUnload === true) {
				logger_default.logAction(loggerToUse, logger_default.LOG_ERROR, "Defaults.normaliseOptions", "closeOnUnload was true and a session recovery function was set - these are mutually exclusive, so unsetting the latter");
				options.recover = void 0;
			}
			if (!("closeOnUnload" in options)) options.closeOnUnload = !options.recover;
			if (!("queueMessages" in options)) options.queueMessages = true;
			const endpoint = options.endpoint || Defaults.ENDPOINT;
			if (!options.fallbackHosts && !options.restHost && !options.realtimeHost && !options.port && !options.tlsPort) options.fallbackHosts = getEndpointFallbackHosts(options.environment || endpoint);
			const primaryDomainFromEnvironment = options.environment && `${options.environment}.realtime.ably.net`;
			const primaryDomain = options.restHost || options.realtimeHost || primaryDomainFromEnvironment || getPrimaryDomainFromEndpoint(endpoint);
			(options.fallbackHosts || []).concat(primaryDomain).forEach(checkHost);
			options.port = options.port || Defaults.PORT;
			options.tlsPort = options.tlsPort || Defaults.TLS_PORT;
			if (!("tls" in options)) options.tls = true;
			const timeouts = getTimeouts(options);
			if (MsgPack) if ("useBinaryProtocol" in options) options.useBinaryProtocol = Platform.Config.supportsBinary && options.useBinaryProtocol;
			else options.useBinaryProtocol = Platform.Config.preferBinary;
			else options.useBinaryProtocol = false;
			const headers = {};
			if (options.clientId) headers["X-Ably-ClientId"] = Platform.BufferUtils.base64Encode(Platform.BufferUtils.utf8Encode(options.clientId));
			if (!("idempotentRestPublishing" in options)) options.idempotentRestPublishing = true;
			let connectivityCheckParams = null;
			let connectivityCheckUrl = options.connectivityCheckUrl;
			if (options.connectivityCheckUrl) {
				let [uri, qs] = options.connectivityCheckUrl.split("?");
				connectivityCheckParams = qs ? parseQueryString(qs) : {};
				if (uri.indexOf("://") === -1) uri = "https://" + uri;
				connectivityCheckUrl = uri;
			}
			let wsConnectivityCheckUrl = options.wsConnectivityCheckUrl;
			if (wsConnectivityCheckUrl && wsConnectivityCheckUrl.indexOf("://") === -1) wsConnectivityCheckUrl = "wss://" + wsConnectivityCheckUrl;
			return __spreadProps(__spreadValues({}, options), {
				primaryDomain,
				maxMessageSize: options.maxMessageSize || Defaults.maxMessageSize,
				timeouts,
				connectivityCheckParams,
				connectivityCheckUrl,
				wsConnectivityCheckUrl,
				headers
			});
		}
		function normaliseChannelOptions(Crypto2, logger, options) {
			const channelOptions = options || {};
			if (channelOptions.cipher) {
				if (!Crypto2) throwMissingPluginError("Crypto");
				const cipher = Crypto2.getCipher(channelOptions.cipher, logger);
				channelOptions.cipher = cipher.cipherParams;
				channelOptions.channelCipher = cipher.cipher;
			} else if ("cipher" in channelOptions) {
				channelOptions.cipher = void 0;
				channelOptions.channelCipher = null;
			}
			return channelOptions;
		}
		var contentTypes = {
			json: "application/json",
			xml: "application/xml",
			html: "text/html",
			msgpack: "application/x-msgpack",
			text: "text/plain"
		};
		var defaultHeadersOptions = {
			format: "json",
			protocolVersion: Defaults.protocolVersion
		};
		function defaultGetHeaders(options, { format, protocolVersion = defaultHeadersOptions.protocolVersion } = {}) {
			return {
				accept: contentTypes[format != null ? format : options.useBinaryProtocol ? "msgpack" : "json"],
				"X-Ably-Version": protocolVersion.toString(),
				"Ably-Agent": getAgentString(options)
			};
		}
		function defaultPostHeaders(options, { format, protocolVersion = defaultHeadersOptions.protocolVersion } = {}) {
			const accept = contentTypes[format != null ? format : options.useBinaryProtocol ? "msgpack" : "json"];
			return {
				accept,
				"content-type": accept,
				"X-Ably-Version": protocolVersion.toString(),
				"Ably-Agent": getAgentString(options)
			};
		}
		var defaults_default = Defaults;
		function getDefaults(platformDefaults) {
			return Object.assign(Defaults, platformDefaults);
		}
		var multicaster_default = class _Multicaster {
			constructor(logger, members) {
				this.logger = logger;
				this.members = members || [];
			}
			call(err, result) {
				for (const member of this.members) if (member) try {
					member(err, result);
				} catch (e) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Multicaster multiple callback handler", "Unexpected exception: " + e + "; stack = " + e.stack);
				}
			}
			push(...args) {
				this.members.push(...args);
			}
			createPromise() {
				return new Promise((resolve, reject) => {
					this.push((err, result) => {
						err ? reject(err) : resolve(result);
					});
				});
			}
			resolveAll(result) {
				this.call(null, result);
			}
			rejectAll(err) {
				this.call(err);
			}
			static create(logger, members) {
				const instance = new _Multicaster(logger, members);
				return Object.assign((err, result) => instance.call(err, result), {
					push: (fn) => instance.push(fn),
					createPromise: () => instance.createPromise(),
					resolveAll: (result) => instance.resolveAll(result),
					rejectAll: (err) => instance.rejectAll(err)
				});
			}
		};
		var HttpMethods = /* @__PURE__ */ ((HttpMethods2) => {
			HttpMethods2["Get"] = "get";
			HttpMethods2["Delete"] = "delete";
			HttpMethods2["Post"] = "post";
			HttpMethods2["Put"] = "put";
			HttpMethods2["Patch"] = "patch";
			return HttpMethods2;
		})(HttpMethods || {});
		var HttpMethods_default = HttpMethods;
		var HttpStatusCodes = /* @__PURE__ */ ((HttpStatusCodes2) => {
			HttpStatusCodes2[HttpStatusCodes2["Success"] = 200] = "Success";
			HttpStatusCodes2[HttpStatusCodes2["NoContent"] = 204] = "NoContent";
			HttpStatusCodes2[HttpStatusCodes2["BadRequest"] = 400] = "BadRequest";
			HttpStatusCodes2[HttpStatusCodes2["Unauthorized"] = 401] = "Unauthorized";
			HttpStatusCodes2[HttpStatusCodes2["Forbidden"] = 403] = "Forbidden";
			HttpStatusCodes2[HttpStatusCodes2["RequestTimeout"] = 408] = "RequestTimeout";
			HttpStatusCodes2[HttpStatusCodes2["InternalServerError"] = 500] = "InternalServerError";
			return HttpStatusCodes2;
		})(HttpStatusCodes || {});
		function isSuccessCode(statusCode) {
			return statusCode >= 200 && statusCode < 400;
		}
		var HttpStatusCodes_default = HttpStatusCodes;
		var MAX_TOKEN_LENGTH = Math.pow(2, 17);
		function random() {
			return ("000000" + Math.floor(Math.random() * 0x2386f26fc10000)).slice(-16);
		}
		function isRealtime(client) {
			return !!client.connection;
		}
		function normaliseAuthcallbackError(err) {
			if (!isErrorInfoOrPartialErrorInfo(err)) return new ErrorInfo(inspectError(err), err.code || 40170, err.statusCode || 401);
			if (!err.code) if (err.statusCode === 403) err.code = 40300;
			else {
				err.code = 40170;
				err.statusCode = 401;
			}
			return err;
		}
		var hmac = (text, key) => {
			const bufferUtils = Platform.BufferUtils;
			const textBuffer = bufferUtils.utf8Encode(text);
			const keyBuffer = bufferUtils.utf8Encode(key);
			const digest = bufferUtils.hmacSha256(textBuffer, keyBuffer);
			return bufferUtils.base64Encode(digest);
		};
		function c14n(capability) {
			if (!capability) return "";
			if (typeof capability == "string") capability = JSON.parse(capability);
			const c14nCapability = /* @__PURE__ */ Object.create(null);
			const keys = keysArray(capability, true);
			if (!keys) return "";
			keys.sort();
			for (let i = 0; i < keys.length; i++) c14nCapability[keys[i]] = capability[keys[i]].sort();
			return JSON.stringify(c14nCapability);
		}
		function logAndValidateTokenAuthMethod(authOptions, logger) {
			if (authOptions.authCallback) logger_default.logAction(logger, logger_default.LOG_MINOR, "Auth()", "using token auth with authCallback");
			else if (authOptions.authUrl) logger_default.logAction(logger, logger_default.LOG_MINOR, "Auth()", "using token auth with authUrl");
			else if (authOptions.key) logger_default.logAction(logger, logger_default.LOG_MINOR, "Auth()", "using token auth with client-side signing");
			else if (authOptions.tokenDetails) logger_default.logAction(logger, logger_default.LOG_MINOR, "Auth()", "using token auth with supplied token only");
			else {
				const msg = "authOptions must include valid authentication parameters";
				logger_default.logAction(logger, logger_default.LOG_ERROR, "Auth()", msg);
				throw new ErrorInfo(msg, 40106, 401);
			}
		}
		function basicAuthForced(options) {
			return "useTokenAuth" in options && !options.useTokenAuth;
		}
		function useTokenAuth(options) {
			return options.useTokenAuth || !basicAuthForced(options) && (options.authCallback || options.authUrl || options.token || options.tokenDetails);
		}
		function noWayToRenew(options) {
			return !options.key && !options.authCallback && !options.authUrl;
		}
		var trId = 0;
		function getTokenRequestId() {
			return trId++;
		}
		var Auth = class {
			constructor(client, options) {
				this.authOptions = {};
				this.client = client;
				this.tokenParams = options.defaultTokenParams || {};
				this.currentTokenRequestId = null;
				this.waitingForTokenRequest = null;
				if (useTokenAuth(options)) {
					if (noWayToRenew(options)) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth()", "Warning: library initialized with a token literal without any way to renew the token when it expires (no authUrl, authCallback, or key). See https://help.ably.io/error/40171 for help");
					this._saveTokenOptions(options.defaultTokenParams, options);
					logAndValidateTokenAuthMethod(this.authOptions, this.logger);
				} else {
					if (!options.key) {
						const msg = "No authentication options provided";
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth()", msg);
						throw new ErrorInfo({
							message: msg,
							code: 40106,
							statusCode: 401,
							remediation: "Set one of the following in ClientOptions: key, authUrl, authCallback, token, or tokenDetails. For production use, prefer authUrl or authCallback for client-side (browser, mobile apps), or key for server-side."
						});
					}
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth()", "anonymous, using basic auth");
					this._saveBasicOptions(options);
				}
			}
			get logger() {
				return this.client.logger;
			}
			authorize(...args) {
				detectV1Callback(args, 0);
				return this._authorizeImpl(args[0], args[1]);
			}
			async _authorizeImpl(tokenParams, authOptions) {
				if (authOptions && authOptions.key && this.authOptions.key !== authOptions.key) throw new ErrorInfo({
					message: "authorize called with a key that does not match the existing key being used by the client",
					code: 40102,
					statusCode: 401,
					remediation: "To use a different key, construct a new Ably client with the key as a client option."
				});
				try {
					let tokenDetails = await this._forceNewToken(tokenParams != null ? tokenParams : null, authOptions != null ? authOptions : null);
					if (isRealtime(this.client)) return new Promise((resolve, reject) => {
						this.client.connection.connectionManager.onAuthUpdated(tokenDetails, (err, tokenDetails2) => err ? reject(err) : resolve(tokenDetails2));
					});
					else return tokenDetails;
				} catch (err) {
					if (this.client.connection && err.statusCode === HttpStatusCodes_default.Forbidden) this.client.connection.connectionManager.actOnErrorFromAuthorize(err);
					throw err;
				}
			}
			async _forceNewToken(tokenParams, authOptions) {
				this.tokenDetails = null;
				this._saveTokenOptions(tokenParams, authOptions);
				logAndValidateTokenAuthMethod(this.authOptions, this.logger);
				try {
					return this._ensureValidAuthCredentials(true);
				} finally {
					delete this.tokenParams.timestamp;
					delete this.authOptions.queryTime;
				}
			}
			requestToken(...args) {
				detectV1Callback(args, 0);
				return this._requestTokenImpl(args[0], args[1]);
			}
			async _requestTokenImpl(tokenParams, authOptions) {
				const resolvedAuthOptions = authOptions || this.authOptions;
				const resolvedTokenParams = tokenParams || copy(this.tokenParams);
				let tokenRequestCallback, client = this.client;
				if (resolvedAuthOptions.authCallback) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.requestToken()", "using token auth with authCallback");
					tokenRequestCallback = resolvedAuthOptions.authCallback;
				} else if (resolvedAuthOptions.authUrl) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.requestToken()", "using token auth with authUrl");
					tokenRequestCallback = (params, cb) => {
						const authHeaders = mixin({ accept: "application/json, text/plain" }, resolvedAuthOptions.authHeaders);
						const usePost = resolvedAuthOptions.authMethod && resolvedAuthOptions.authMethod.toLowerCase() === "post";
						let providedQsParams;
						const queryIdx = resolvedAuthOptions.authUrl.indexOf("?");
						if (queryIdx > -1) {
							providedQsParams = parseQueryString(resolvedAuthOptions.authUrl.slice(queryIdx));
							resolvedAuthOptions.authUrl = resolvedAuthOptions.authUrl.slice(0, queryIdx);
							if (!usePost) resolvedAuthOptions.authParams = mixin(providedQsParams, resolvedAuthOptions.authParams);
						}
						const authParams = mixin({}, resolvedAuthOptions.authParams || {}, params);
						const authUrlRequestCallback = (result) => {
							var _a2, _b;
							let body = (_a2 = result.body) != null ? _a2 : null;
							let contentType = null;
							if (result.error) logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Auth.requestToken().tokenRequestCallback", "Received Error: " + inspectError(result.error));
							else {
								const contentTypeHeaderOrHeaders = (_b = result.headers["content-type"]) != null ? _b : null;
								if (Array.isArray(contentTypeHeaderOrHeaders)) contentType = contentTypeHeaderOrHeaders.join(", ");
								else contentType = contentTypeHeaderOrHeaders;
								logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Auth.requestToken().tokenRequestCallback", "Received; content-type: " + contentType + "; body: " + inspectBody(body));
							}
							if (result.error) {
								cb(result.error, null);
								return;
							}
							if (result.unpacked) {
								cb(null, body);
								return;
							}
							if (Platform.BufferUtils.isBuffer(body)) body = body.toString();
							if (!contentType) {
								cb(new ErrorInfo({
									message: "authUrl response is missing a Content-Type header",
									code: 40170,
									statusCode: 401,
									remediation: "Set a Content-Type response header on your authUrl endpoint: application/json for a TokenDetails/TokenRequest object, text/plain for a token string, or application/jwt for a JWT."
								}), null);
								return;
							}
							const json = contentType.indexOf("application/json") > -1, text = contentType.indexOf("text/plain") > -1 || contentType.indexOf("application/jwt") > -1;
							if (!json && !text) {
								cb(new ErrorInfo({
									message: "authUrl responded with unacceptable Content-Type " + contentType + ". Expected one of: text/plain, application/jwt or application/json",
									code: 40170,
									statusCode: 401,
									remediation: "Change your authUrl endpoint to respond with a Content-Type the SDK can parse: application/json (TokenDetails/TokenRequest), text/plain (token string), or application/jwt (JWT)."
								}), null);
								return;
							}
							if (json) {
								if (body.length > MAX_TOKEN_LENGTH) {
									cb(new ErrorInfo({
										message: "authUrl JSON response exceeded the maximum permitted length of 128 KB",
										code: 40170,
										statusCode: 401,
										remediation: "Two things commonly cause this. If your authUrl wraps the Ably token in an envelope with extra fields, return only the token payload (a token string, or a TokenRequest/TokenDetails object). If the token carries a very large capability, narrow it: grant a wildcard resource such as \"*\" or \"namespace:*\" instead of listing every channel."
									}), null);
									return;
								}
								try {
									body = JSON.parse(body);
								} catch (e) {
									cb(new ErrorInfo("Unexpected error processing authURL response; err = " + e.message, 40170, 401), null);
									return;
								}
							}
							cb(null, body, contentType);
						};
						logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Auth.requestToken().tokenRequestCallback", "Requesting token from " + resolvedAuthOptions.authUrl + "; Params: " + JSON.stringify(authParams) + "; method: " + (usePost ? "POST" : "GET"));
						if (usePost) {
							const headers = authHeaders || {};
							headers["content-type"] = "application/x-www-form-urlencoded";
							const body = toQueryString(authParams).slice(1);
							whenPromiseSettles(this.client.http.doUri(HttpMethods_default.Post, resolvedAuthOptions.authUrl, headers, body, providedQsParams), (err, result) => err ? authUrlRequestCallback(err) : authUrlRequestCallback(result));
						} else whenPromiseSettles(this.client.http.doUri(HttpMethods_default.Get, resolvedAuthOptions.authUrl, authHeaders || {}, null, authParams), (err, result) => err ? authUrlRequestCallback(err) : authUrlRequestCallback(result));
					};
				} else if (resolvedAuthOptions.key) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.requestToken()", "using token auth with client-side signing");
					tokenRequestCallback = (params, cb) => {
						whenPromiseSettles(this.createTokenRequest(params, resolvedAuthOptions), (err, result) => cb(err, result != null ? result : null));
					};
				} else {
					const msg = "Need a new token, but authOptions does not include any way to request one (no authUrl, authCallback, or key)";
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth()", "library initialized with a token literal without any way to renew the token when it expires (no authUrl, authCallback, or key). See https://help.ably.io/error/40171 for help");
					throw new ErrorInfo({
						message: msg,
						code: 40171,
						statusCode: 403,
						remediation: "Initialise the client with one of ClientOptions.{ key, authUrl, authCallback } so the SDK can refresh tokens."
					});
				}
				if ("capability" in resolvedTokenParams) resolvedTokenParams.capability = c14n(resolvedTokenParams.capability);
				const tokenRequest = (signedTokenParams, tokenCb) => {
					const path = "/keys/" + signedTokenParams.keyName + "/requestToken", tokenUri = function(host) {
						return client.baseUri(host) + path;
					};
					const requestHeaders = defaults_default.defaultPostHeaders(this.client.options, { format: "json" });
					if (resolvedAuthOptions.requestHeaders) mixin(requestHeaders, resolvedAuthOptions.requestHeaders);
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Auth.requestToken().requestToken", "Sending POST to " + path + "; Token params: " + JSON.stringify(signedTokenParams));
					whenPromiseSettles(this.client.http.do(HttpMethods_default.Post, tokenUri, requestHeaders, JSON.stringify(signedTokenParams), null), (err, result) => err ? tokenCb(err) : tokenCb(result.error, result.body, result.unpacked));
				};
				return new Promise((resolve, reject) => {
					let tokenRequestCallbackTimeoutExpired = false, timeoutLength = this.client.options.timeouts.realtimeRequestTimeout, tokenRequestCallbackTimeout = Platform.Config.setTimeout(() => {
						tokenRequestCallbackTimeoutExpired = true;
						const msg = "Token request via authCallback/authUrl did not complete within the configured timeout (" + timeoutLength / 1e3 + " seconds)";
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", msg);
						reject(new ErrorInfo({
							message: msg,
							code: 40170,
							statusCode: 401,
							remediation: "Add logging to your authCallback/authUrl to find where it stalls, and make sure it always resolves and that authUrl is reachable. If the work legitimately takes longer, raise ClientOptions.realtimeRequestTimeout."
						}));
					}, timeoutLength);
					tokenRequestCallback(resolvedTokenParams, (err, tokenRequestOrDetails, contentType) => {
						if (tokenRequestCallbackTimeoutExpired) return;
						Platform.Config.clearTimeout(tokenRequestCallbackTimeout);
						if (err) {
							logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", "token request signing call returned error; err = " + inspectError(err));
							reject(normaliseAuthcallbackError(err));
							return;
						}
						if (typeof tokenRequestOrDetails === "string") {
							if (tokenRequestOrDetails.length === 0) reject(new ErrorInfo({
								message: "Token string is empty",
								code: 40170,
								statusCode: 401,
								remediation: "Return a non-empty value from your authCallback/authUrl: a token string, a TokenRequest, or a TokenDetails object."
							}));
							else if (tokenRequestOrDetails.length > MAX_TOKEN_LENGTH) reject(new ErrorInfo({
								message: "Token string exceeded max permitted length (was " + tokenRequestOrDetails.length + " bytes)",
								code: 40170,
								statusCode: 401,
								remediation: "Return only the bare signed token string from your authCallback/authUrl, not an envelope, debug output, or a stringified TokenDetails wrapping it, since a token must serialise to under 128 KB. If the token carries a very large capability, narrow it: grant a wildcard resource such as \"*\" or \"namespace:*\" instead of listing every channel."
							}));
							else if (tokenRequestOrDetails === "undefined" || tokenRequestOrDetails === "null") reject(new ErrorInfo({
								message: "Token string was literal null/undefined",
								code: 40170,
								statusCode: 401,
								remediation: "Return the token itself, not \"undefined\"/\"null\". Callbacks that have no value to return should pass an error instead."
							}));
							else if (tokenRequestOrDetails[0] === "{" && !(contentType && contentType.indexOf("application/jwt") > -1)) reject(new ErrorInfo({
								message: "Token was double-encoded",
								code: 40170,
								statusCode: 401,
								remediation: "Return TokenDetails/TokenRequest as a parsed object, or set Content-Type: application/jwt for JWT tokens."
							}));
							else resolve({ token: tokenRequestOrDetails });
							return;
						}
						if (typeof tokenRequestOrDetails !== "object" || tokenRequestOrDetails === null) {
							const msg = "Expected token request callback to call back with a token string or token request/details object, but got a " + typeof tokenRequestOrDetails;
							logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", msg);
							reject(new ErrorInfo({
								message: msg,
								code: 40170,
								statusCode: 401,
								remediation: "If authenticating with an authCallback, update it to callback with (err, tokenStringOrTokenDetailsOrTokenRequest). If authenticating with an authUrl, update the server to respond with a token string or TokenDetails/TokenRequest JSON."
							}));
							return;
						}
						const objectSize = JSON.stringify(tokenRequestOrDetails).length;
						if (objectSize > MAX_TOKEN_LENGTH && !resolvedAuthOptions.suppressMaxLengthCheck) {
							reject(new ErrorInfo({
								message: "Token request/details object exceeded max permitted stringified size (was " + objectSize + " bytes)",
								code: 40170,
								statusCode: 401,
								remediation: "The TokenRequest/TokenDetails object must serialise to under 128 KB. Trim any unused fields, and if it carries a very large capability, narrow it: grant a wildcard resource such as \"*\" or \"namespace:*\" instead of listing every channel."
							}));
							return;
						}
						if ("issued" in tokenRequestOrDetails) {
							resolve(tokenRequestOrDetails);
							return;
						}
						if (!("keyName" in tokenRequestOrDetails)) {
							const msg = "Expected token request callback to call back with a token string, token request object, or token details object. The returned object has neither a keyName nor an issued field.";
							logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", msg);
							reject(new ErrorInfo({
								message: msg,
								code: 40170,
								statusCode: 401,
								remediation: "Return a token string, a TokenRequest (an object with a `keyName` field), or a TokenDetails (an object with an `issued` field) from your authCallback/authUrl."
							}));
							return;
						}
						tokenRequest(tokenRequestOrDetails, (err2, tokenResponse, unpacked) => {
							if (err2) {
								logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", "token request API call returned error; err = " + inspectError(err2));
								reject(normaliseAuthcallbackError(err2));
								return;
							}
							if (!unpacked) tokenResponse = JSON.parse(tokenResponse);
							logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.getToken()", "token received");
							resolve(tokenResponse);
						});
					});
				});
			}
			/**
			* Create and sign a token request based on the given options.
			* NOTE this can only be used when the key value is available locally.
			* Otherwise, signed token requests must be obtained from the key
			* owner (either using the token request callback or url).
			*
			* @param authOptions
			* an object containing the request options:
			* - key:           the key to use. If not specified, a key passed in constructing
			*                  the Rest interface will be used
			*
			* - queryTime      (optional) boolean indicating that the ably system should be
			*                  queried for the current time when none is specified explicitly
			*
			* - requestHeaders (optional, unsupported, for testing only) extra headers to add to the
			*                  requestToken request
			*
			* @param tokenParams
			* an object containing the parameters for the requested token:
			* - ttl:       (optional) the requested life of the token in ms. If none is specified
			*                  a default of 1 hour is provided. The maximum lifetime is 24hours; any request
			*                  exceeding that lifetime will be rejected with an error.
			*
			* - capability:    (optional) the capability to associate with the access token.
			*                  If none is specified, a token will be requested with all of the
			*                  capabilities of the specified key.
			*
			* - clientId:      (optional) a client ID to associate with the token; if not
			*                  specified, a clientId passed in constructing the Rest interface will be used
			*
			* - timestamp:     (optional) the time in ms since the epoch. If none is specified,
			*                  the system will be queried for a time value to use.
			*/
			createTokenRequest(...args) {
				detectV1Callback(args, 0);
				return this._createTokenRequestImpl(args[0], args[1]);
			}
			async _createTokenRequestImpl(tokenParams, authOptions) {
				authOptions = authOptions || this.authOptions;
				tokenParams = tokenParams || copy(this.tokenParams);
				const key = authOptions.key;
				if (!key) throw new ErrorInfo({
					message: "No key specified",
					code: 40101,
					statusCode: 403,
					remediation: "Pass { key } in the authOptions argument, or set ClientOptions.key and omit the authOptions argument. A passed authOptions replaces the stored options rather than merging."
				});
				const keyParts = key.split(":"), keyName = keyParts[0], keySecret = keyParts[1];
				if (!keySecret) throw new ErrorInfo({
					message: "Invalid key specified: the key has no colon-separated secret",
					code: 40101,
					statusCode: 403,
					remediation: "Copy the full \"appId.keyId:secret\" key including the colon and secret from the Ably dashboard. If you have the Ably CLI installed, `ably auth keys list` shows the keys configured on the current app."
				});
				if (tokenParams.clientId === "") throw new ErrorInfo({
					message: "clientId can’t be an empty string",
					code: 40012,
					statusCode: 400,
					remediation: "Pass a non-empty clientId, or omit the field entirely for an anonymous token."
				});
				if ("capability" in tokenParams) tokenParams.capability = c14n(tokenParams.capability);
				const request = mixin({ keyName }, tokenParams), clientId = tokenParams.clientId || "", ttl = tokenParams.ttl || "", capability = tokenParams.capability || "";
				if (!request.timestamp) request.timestamp = await this._getTimestamp(authOptions && authOptions.queryTime);
				const nonce = request.nonce || (request.nonce = random()), timestamp = request.timestamp;
				const signText = request.keyName + "\n" + ttl + "\n" + capability + "\n" + clientId + "\n" + timestamp + "\n" + nonce + "\n";
				request.mac = request.mac || hmac(signText, keySecret);
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.getTokenRequest()", "generated signed request");
				return request;
			}
			/**
			* Get the auth query params to use for a websocket connection,
			* based on the current auth parameters
			*/
			async getAuthParams() {
				if (this.method == "basic") return { key: this.key };
				else {
					let tokenDetails = await this._ensureValidAuthCredentials(false);
					if (!tokenDetails) throw new Error("Auth.getAuthParams(): _ensureValidAuthCredentials returned no error or tokenDetails");
					return { access_token: tokenDetails.token };
				}
			}
			/**
			* Get the authorization header to use for a REST or comet request,
			* based on the current auth parameters
			*/
			async getAuthHeaders() {
				if (this.method == "basic") return { authorization: "Basic " + this.basicKey };
				else {
					const tokenDetails = await this._ensureValidAuthCredentials(false);
					if (!tokenDetails) throw new Error("Auth.getAuthParams(): _ensureValidAuthCredentials returned no error or tokenDetails");
					return { authorization: "Bearer " + toBase64(tokenDetails.token) };
				}
			}
			_saveBasicOptions(authOptions) {
				this.method = "basic";
				this.key = authOptions.key;
				this.basicKey = toBase64(authOptions.key);
				this.authOptions = authOptions || {};
				if ("clientId" in authOptions) this._userSetClientId(authOptions.clientId);
			}
			_saveTokenOptions(tokenParams, authOptions) {
				this.method = "token";
				if (tokenParams) this.tokenParams = tokenParams;
				if (authOptions) {
					if (authOptions.token) authOptions.tokenDetails = typeof authOptions.token === "string" ? { token: authOptions.token } : authOptions.token;
					if (authOptions.tokenDetails) this.tokenDetails = authOptions.tokenDetails;
					if ("clientId" in authOptions) this._userSetClientId(authOptions.clientId);
					this.authOptions = authOptions;
				}
			}
			async _ensureValidAuthCredentials(forceSupersede) {
				const token = this.tokenDetails;
				if (token) {
					if (this._tokenClientIdMismatch(token.clientId)) throw new ErrorInfo({
						message: "Mismatch between clientId in token (" + token.clientId + ") and current clientId (" + this.clientId + ")",
						code: 40102,
						statusCode: 403,
						remediation: "Issue the token with the same clientId as ClientOptions.clientId, or omit ClientOptions.clientId and let the token define it."
					});
					if (!this.client.isTimeOffsetSet() || !token.expires || token.expires >= this.client.getTimestampUsingOffset()) {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.getToken()", "using cached token; expires = " + token.expires);
						return token;
					}
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth.getToken()", "deleting expired token");
					this.tokenDetails = null;
				}
				const promise = (this.waitingForTokenRequest || (this.waitingForTokenRequest = multicaster_default.create(this.logger))).createPromise();
				if (this.currentTokenRequestId !== null && !forceSupersede) return promise;
				const tokenRequestId = this.currentTokenRequestId = getTokenRequestId();
				let tokenResponse, caughtError = null;
				try {
					tokenResponse = await this.requestToken(this.tokenParams, this.authOptions);
				} catch (err) {
					caughtError = err;
				}
				if (this.currentTokenRequestId > tokenRequestId) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Auth._ensureValidAuthCredentials()", "Discarding token request response; overtaken by newer one");
					return promise;
				}
				this.currentTokenRequestId = null;
				const multicaster = this.waitingForTokenRequest;
				this.waitingForTokenRequest = null;
				if (caughtError) {
					multicaster?.rejectAll(caughtError);
					return promise;
				}
				multicaster?.resolveAll(this.tokenDetails = tokenResponse);
				return promise;
			}
			_userSetClientId(clientId) {
				if (!(typeof clientId === "string" || clientId === null)) throw new ErrorInfo({
					message: "clientId must be either a string or null",
					code: 40012,
					statusCode: 400,
					remediation: "Pass a stable string such as a user id to identify the client, or null (or omit it) for an anonymous client. Values like numbers or objects are not accepted."
				});
				else if (clientId === "*") throw new ErrorInfo({
					message: "Can’t use \"*\" as a clientId as that string is reserved. clientId sets a single fixed identity for the client",
					code: 40012,
					statusCode: 400,
					remediation: "Omit clientId and specify the identity per operation instead, for example with presence.enterClient(otherId, data) or by setting clientId on each message you publish. This requires the library to be instantiated with an API key or a token bound to a wildcard clientId. To request a wildcard token, set defaultTokenParams: { clientId: \"*\" } in ClientOptions. A wildcard token lets the client claim any clientId per operation but does not give it an identity of its own."
				});
				else {
					const err = this._uncheckedSetClientId(clientId);
					if (err) throw err;
				}
			}
			_uncheckedSetClientId(clientId) {
				if (this._tokenClientIdMismatch(clientId)) {
					const msg = "Unexpected clientId mismatch: client has " + this.clientId + ", requested " + clientId;
					const err = new ErrorInfo({
						message: msg,
						code: 40102,
						statusCode: 401,
						remediation: "Issue the token with the matching clientId, or omit ClientOptions.clientId and let the token define it."
					});
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth._uncheckedSetClientId()", msg);
					return err;
				} else {
					this.clientId = this.tokenParams.clientId = clientId;
					return null;
				}
			}
			_tokenClientIdMismatch(tokenClientId) {
				return !!(this.clientId && this.clientId !== "*" && tokenClientId && tokenClientId !== "*" && this.clientId !== tokenClientId);
			}
			static isTokenErr(error) {
				return error.code && error.code >= 40140 && error.code < 40150;
			}
			revokeTokens(specifiers, options) {
				return this.client.rest.revokeTokens(specifiers, options);
			}
			/**
			* Same as {@link BaseClient.getTimestamp} but also takes into account {@link Auth.authOptions}
			*/
			async _getTimestamp(queryTime) {
				return this.client.getTimestamp(queryTime || !!this.authOptions.queryTime);
			}
		};
		var auth_default = Auth;
		function paramString(params) {
			const paramPairs = [];
			if (params) for (const needle in params) paramPairs.push(needle + "=" + params[needle]);
			return paramPairs.join("&");
		}
		function appendingParams(uri, params) {
			return uri + (params ? "?" : "") + paramString(params);
		}
		function logResult(result, method, uri, params, logger) {
			if (result.error) logger_default.logActionNoStrip(logger, logger_default.LOG_MICRO, "Http." + method + "()", "Received Error; " + appendingParams(uri, params) + "; Error: " + inspectError(result.error));
			else logger_default.logActionNoStrip(logger, logger_default.LOG_MICRO, "Http." + method + "()", "Received; " + appendingParams(uri, params) + "; Headers: " + paramString(result.headers) + "; StatusCode: " + result.statusCode + "; Body" + (Platform.BufferUtils.isBuffer(result.body) ? " (Base64): " + Platform.BufferUtils.base64Encode(result.body) : ": " + result.body));
		}
		function logRequest(method, uri, body, params, logger) {
			if (logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logActionNoStrip(logger, logger_default.LOG_MICRO, "Http." + method + "()", "Sending; " + appendingParams(uri, params) + "; Body" + (Platform.BufferUtils.isBuffer(body) ? " (Base64): " + Platform.BufferUtils.base64Encode(body) : ": " + body));
		}
		var Http = class {
			constructor(client) {
				this.client = client;
				this.platformHttp = new Platform.Http(client);
				this.checkConnectivity = this.platformHttp.checkConnectivity ? () => this.platformHttp.checkConnectivity() : void 0;
			}
			get logger() {
				var _a2, _b;
				return (_b = (_a2 = this.client) == null ? void 0 : _a2.logger) != null ? _b : logger_default.defaultLogger;
			}
			get supportsAuthHeaders() {
				return this.platformHttp.supportsAuthHeaders;
			}
			get supportsLinkHeaders() {
				return this.platformHttp.supportsLinkHeaders;
			}
			_getHosts(client) {
				const connection = client.connection, connectionHost = connection && connection.connectionManager.host;
				if (connectionHost) return [connectionHost].concat(defaults_default.getFallbackHosts(client.options));
				return defaults_default.getHosts(client.options);
			}
			/**
			* This method will not throw any errors; rather, it will communicate any error by populating the {@link RequestResult.error} property of the returned {@link RequestResult}.
			*/
			async do(method, path, headers, body, params) {
				try {
					const client = this.client;
					if (!client) return { error: new ErrorInfo("http.do called without client", 5e4, 500) };
					const uriFromHost = typeof path === "function" ? path : function(host) {
						return client.baseUri(host) + path;
					};
					const currentFallback = client._currentFallback;
					if (currentFallback) if (currentFallback.validUntil > Platform.Config.now()) {
						const result = await this.doUri(method, uriFromHost(currentFallback.host), headers, body, params);
						if (result.error && this.platformHttp.shouldFallback(result.error)) {
							client._currentFallback = null;
							return this.do(method, path, headers, body, params);
						}
						return result;
					} else client._currentFallback = null;
					const hosts = this._getHosts(client);
					if (hosts.length === 1) return this.doUri(method, uriFromHost(hosts[0]), headers, body, params);
					let tryAHostStartedAt = null;
					const tryAHost = async (candidateHosts, persistOnSuccess) => {
						const host = candidateHosts.shift();
						tryAHostStartedAt = tryAHostStartedAt != null ? tryAHostStartedAt : Platform.Config.now();
						const result = await this.doUri(method, uriFromHost(host), headers, body, params);
						if (result.error && this.platformHttp.shouldFallback(result.error) && candidateHosts.length) {
							if (Platform.Config.now() - tryAHostStartedAt > client.options.timeouts.httpMaxRetryDuration) return { error: new ErrorInfo(`Timeout for trying fallback hosts retries. Total elapsed time exceeded the ${client.options.timeouts.httpMaxRetryDuration}ms limit`, 50003, 500) };
							return tryAHost(candidateHosts, true);
						}
						if (persistOnSuccess) client._currentFallback = {
							host,
							validUntil: Platform.Config.now() + client.options.timeouts.fallbackRetryTimeout
						};
						return result;
					};
					return tryAHost(hosts);
				} catch (err) {
					return { error: new ErrorInfo(`Unexpected error in Http.do: ${inspectError(err)}`, 500, 5e4) };
				}
			}
			/**
			* This method will not throw any errors; rather, it will communicate any error by populating the {@link RequestResult.error} property of the returned {@link RequestResult}.
			*/
			async doUri(method, uri, headers, body, params) {
				try {
					logRequest(method, uri, body, params, this.logger);
					const result = await this.platformHttp.doUri(method, uri, headers, body, params);
					if (this.logger.shouldLog(logger_default.LOG_MICRO)) logResult(result, method, uri, params, this.logger);
					return result;
				} catch (err) {
					return { error: new ErrorInfo(`Unexpected error in Http.doUri: ${inspectError(err)}`, 500, 5e4) };
				}
			}
		};
		function callListener(logger, eventThis, listener, args) {
			try {
				listener.apply(eventThis, args);
			} catch (e) {
				logger_default.logAction(logger, logger_default.LOG_ERROR, "EventEmitter.emit()", "Unexpected listener exception: " + e + "; stack = " + (e && e.stack));
			}
		}
		function removeListener(targetListeners, listener, eventFilter) {
			let listeners;
			let index;
			let eventName;
			for (let targetListenersIndex = 0; targetListenersIndex < targetListeners.length; targetListenersIndex++) {
				listeners = targetListeners[targetListenersIndex];
				if (eventFilter) listeners = listeners[eventFilter];
				if (Array.isArray(listeners)) {
					while ((index = listeners.indexOf(listener)) !== -1) listeners.splice(index, 1);
					if (eventFilter && listeners.length === 0) delete targetListeners[targetListenersIndex][eventFilter];
				} else if (isObject(listeners)) {
					for (eventName in listeners) if (Object.prototype.hasOwnProperty.call(listeners, eventName) && Array.isArray(listeners[eventName])) removeListener([listeners], listener, eventName);
				}
			}
		}
		var EventEmitter = class {
			constructor(logger) {
				this.logger = logger;
				this.any = [];
				this.events = /* @__PURE__ */ Object.create(null);
				this.anyOnce = [];
				this.eventsOnce = /* @__PURE__ */ Object.create(null);
			}
			on(...args) {
				if (args.length === 1) {
					const listener = args[0];
					if (typeof listener === "function") this.any.push(listener);
					else throw new Error("EventListener.on(): Invalid arguments: " + Platform.Config.inspect(args));
				}
				if (args.length === 2) {
					const [event, listener] = args;
					if (typeof listener !== "function") throw new Error("EventListener.on(): Invalid arguments: " + Platform.Config.inspect(args));
					if (isNil(event)) this.any.push(listener);
					else if (Array.isArray(event)) event.forEach((eventName) => {
						this.on(eventName, listener);
					});
					else {
						if (typeof event !== "string") throw new Error("EventListener.on(): Invalid arguments: " + Platform.Config.inspect(args));
						(this.events[event] || (this.events[event] = [])).push(listener);
					}
				}
			}
			off(...args) {
				if (args.length == 0 || isNil(args[0]) && isNil(args[1])) {
					this.any = [];
					this.events = /* @__PURE__ */ Object.create(null);
					this.anyOnce = [];
					this.eventsOnce = /* @__PURE__ */ Object.create(null);
					return;
				}
				const [firstArg, secondArg] = args;
				let listener = null;
				let event = null;
				if (args.length === 1 || !secondArg) if (typeof firstArg === "function") listener = firstArg;
				else event = firstArg;
				else {
					if (typeof secondArg !== "function") throw new Error("EventEmitter.off(): invalid arguments:" + Platform.Config.inspect(args));
					[event, listener] = [firstArg, secondArg];
				}
				if (listener && isNil(event)) {
					removeListener([
						this.any,
						this.events,
						this.anyOnce,
						this.eventsOnce
					], listener);
					return;
				}
				if (Array.isArray(event)) {
					event.forEach((eventName) => {
						this.off(eventName, listener);
					});
					return;
				}
				if (typeof event !== "string") throw new Error("EventEmitter.off(): invalid arguments:" + Platform.Config.inspect(args));
				if (listener) removeListener([this.events, this.eventsOnce], listener, event);
				else {
					delete this.events[event];
					delete this.eventsOnce[event];
				}
			}
			/**
			* Get the array of listeners for a given event; excludes once events
			* @param event (optional) the name of the event, or none for 'any'
			* @return array of events, or null if none
			*/
			listeners(event) {
				if (event) {
					const listeners = this.events[event] || [];
					if (this.eventsOnce[event]) Array.prototype.push.apply(listeners, this.eventsOnce[event]);
					return listeners.length ? listeners : null;
				}
				return this.any.length ? this.any : null;
			}
			/**
			* Emit an event
			* @param event the event name
			* @param args the arguments to pass to the listener
			*/
			emit(event, ...args) {
				const eventThis = { event };
				const listeners = [];
				if (this.anyOnce.length) {
					Array.prototype.push.apply(listeners, this.anyOnce);
					this.anyOnce = [];
				}
				if (this.any.length) Array.prototype.push.apply(listeners, this.any);
				const eventsOnceListeners = this.eventsOnce[event];
				if (eventsOnceListeners) {
					Array.prototype.push.apply(listeners, eventsOnceListeners);
					delete this.eventsOnce[event];
				}
				const eventsListeners = this.events[event];
				if (eventsListeners) Array.prototype.push.apply(listeners, eventsListeners);
				listeners.forEach((listener) => {
					callListener(this.logger, eventThis, listener, args);
				});
			}
			once(...args) {
				const argCount = args.length;
				if (argCount === 0 || argCount === 1 && typeof args[0] !== "function") {
					const event = args[0];
					return new Promise((resolve) => {
						this.once(event, resolve);
					});
				}
				const [firstArg, secondArg] = args;
				if (args.length === 1 && typeof firstArg === "function") this.anyOnce.push(firstArg);
				else if (isNil(firstArg)) {
					if (typeof secondArg !== "function") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
					this.anyOnce.push(secondArg);
				} else if (Array.isArray(firstArg)) {
					const self2 = this;
					const listenerWrapper = function() {
						const innerArgs = Array.prototype.slice.call(arguments);
						firstArg.forEach(function(eventName) {
							self2.off(eventName, listenerWrapper);
						});
						if (typeof secondArg !== "function") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
						secondArg.apply(this, innerArgs);
					};
					firstArg.forEach(function(eventName) {
						self2.on(eventName, listenerWrapper);
					});
				} else {
					if (typeof firstArg !== "string") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
					const listeners = this.eventsOnce[firstArg] || (this.eventsOnce[firstArg] = []);
					if (secondArg) {
						if (typeof secondArg !== "function") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
						listeners.push(secondArg);
					}
				}
			}
			/**
			* Listen for a single occurrence of a state event and fire immediately if currentState matches targetState
			* @param targetState the name of the state event to listen to
			* @param currentState the name of the current state of this object
			*/
			async whenState(targetState, currentState) {
				if (typeof targetState !== "string" || typeof currentState !== "string") throw new Error("whenState requires a valid state String argument");
				if (targetState === currentState) return null;
				else return this.once(targetState);
			}
		};
		var eventemitter_default = EventEmitter;
		var actions = {
			HEARTBEAT: 0,
			ACK: 1,
			NACK: 2,
			CONNECT: 3,
			CONNECTED: 4,
			DISCONNECT: 5,
			DISCONNECTED: 6,
			CLOSE: 7,
			CLOSED: 8,
			ERROR: 9,
			ATTACH: 10,
			ATTACHED: 11,
			DETACH: 12,
			DETACHED: 13,
			PRESENCE: 14,
			MESSAGE: 15,
			SYNC: 16,
			AUTH: 17,
			ACTIVATE: 18,
			OBJECT: 19,
			OBJECT_SYNC: 20,
			ANNOTATION: 21
		};
		var ActionName = [];
		Object.keys(actions).forEach(function(name) {
			ActionName[actions[name]] = name;
		});
		var flags = {
			HAS_PRESENCE: 1,
			HAS_BACKLOG: 2,
			RESUMED: 4,
			TRANSIENT: 16,
			ATTACH_RESUME: 32,
			HAS_OBJECTS: 128,
			PRESENCE: 65536,
			PUBLISH: 1 << 17,
			SUBSCRIBE: 1 << 18,
			PRESENCE_SUBSCRIBE: 1 << 19,
			ANNOTATION_PUBLISH: 1 << 21,
			ANNOTATION_SUBSCRIBE: 1 << 22,
			OBJECT_SUBSCRIBE: 1 << 24,
			OBJECT_PUBLISH: 1 << 25
		};
		var flagNames = Object.keys(flags);
		flags.MODE_ALL = flags.PRESENCE | flags.PUBLISH | flags.SUBSCRIBE | flags.PRESENCE_SUBSCRIBE | flags.ANNOTATION_PUBLISH | flags.ANNOTATION_SUBSCRIBE | flags.OBJECT_SUBSCRIBE | flags.OBJECT_PUBLISH;
		var channelModes = [
			"PRESENCE",
			"PUBLISH",
			"SUBSCRIBE",
			"PRESENCE_SUBSCRIBE",
			"ANNOTATION_PUBLISH",
			"ANNOTATION_SUBSCRIBE",
			"OBJECT_SUBSCRIBE",
			"OBJECT_PUBLISH"
		];
		function normaliseContext(context) {
			if (!context || !context.channelOptions) return {
				channelOptions: context,
				plugins: {},
				baseEncodedPreviousPayload: void 0
			};
			return context;
		}
		function normalizeCipherOptions(Crypto2, logger, options) {
			if (options && options.cipher) {
				if (!Crypto2) throwMissingPluginError("Crypto");
				const cipher = Crypto2.getCipher(options.cipher, logger);
				return {
					cipher: cipher.cipherParams,
					channelCipher: cipher.cipher
				};
			}
			return options != null ? options : {};
		}
		async function encrypt(msg, cipherOptions) {
			const { data, encoding } = await encryptData(msg.data, msg.encoding, cipherOptions);
			msg.data = data;
			msg.encoding = encoding;
			return msg;
		}
		async function encryptData(data, encoding, cipherOptions) {
			let cipher = cipherOptions.channelCipher;
			let dataToEncrypt = data;
			let finalEncoding = encoding ? encoding + "/" : "";
			if (!Platform.BufferUtils.isBuffer(dataToEncrypt)) {
				dataToEncrypt = Platform.BufferUtils.utf8Encode(String(dataToEncrypt));
				finalEncoding = finalEncoding + "utf-8/";
			}
			const ciphertext = await cipher.encrypt(dataToEncrypt);
			finalEncoding = finalEncoding + "cipher+" + cipher.algorithm;
			return {
				data: ciphertext,
				encoding: finalEncoding
			};
		}
		async function encode(msg, options) {
			const { data, encoding } = encodeData(msg.data, msg.encoding);
			msg.data = data;
			msg.encoding = encoding;
			if (options != null && options.cipher) return encrypt(msg, options);
			else return msg;
		}
		function encodeData(data, encoding) {
			if (typeof data == "string" || Platform.BufferUtils.isBuffer(data) || data === null || data === void 0) return {
				data,
				encoding
			};
			if (isObject(data) || Array.isArray(data)) return {
				data: JSON.stringify(data),
				encoding: encoding ? encoding + "/json" : "json"
			};
			throw new ErrorInfo({
				message: "Data type is unsupported",
				code: 40013,
				statusCode: 400,
				remediation: "Message data must be a string, Buffer/ArrayBuffer/TypedArray, plain object, or array. Convert other types (e.g. Date, Map, Set) to one of these before publishing."
			});
		}
		async function decode(message, inputContext) {
			const { data, encoding, error } = await decodeData(message.data, message.encoding, inputContext);
			message.data = data;
			message.encoding = encoding;
			if (error) throw error;
		}
		async function decodeData(data, encoding, inputContext) {
			const context = normaliseContext(inputContext);
			let lastPayload = data;
			let decodedData = data;
			let finalEncoding = encoding;
			let decodingError;
			if (encoding) {
				const xforms = encoding.split("/");
				let lastProcessedEncodingIndex;
				let encodingsToProcess = xforms.length;
				let xform = "";
				try {
					while ((lastProcessedEncodingIndex = encodingsToProcess) > 0) {
						const match = xforms[--encodingsToProcess].match(/([-\w]+)(\+([\w-]+))?/);
						if (!match) break;
						xform = match[1];
						switch (xform) {
							case "base64":
								decodedData = Platform.BufferUtils.base64Decode(String(decodedData));
								if (lastProcessedEncodingIndex == xforms.length) lastPayload = decodedData;
								continue;
							case "utf-8":
								decodedData = Platform.BufferUtils.utf8Decode(decodedData);
								continue;
							case "json":
								decodedData = JSON.parse(decodedData);
								continue;
							case "cipher": if (context.channelOptions != null && context.channelOptions.cipher && context.channelOptions.channelCipher) {
								const xformAlgorithm = match[3], cipher = context.channelOptions.channelCipher;
								if (xformAlgorithm != cipher.algorithm) throw new Error("Unable to decrypt message with given cipher; incompatible cipher params");
								decodedData = await cipher.decrypt(decodedData);
								continue;
							} else throw new Error("Unable to decrypt message; not an encrypted channel");
							case "vcdiff":
								if (!context.plugins || !context.plugins.vcdiff) throw new ErrorInfo({
									message: "Missing Vcdiff decoder (https://github.com/ably-forks/vcdiff-decoder)",
									code: 40019,
									statusCode: 400,
									remediation: "Install @ably/vcdiff-decoder and pass it in ClientOptions.plugins.vcdiff."
								});
								if (typeof Uint8Array === "undefined") throw new ErrorInfo({
									message: "Delta decoding not supported on this browser (need ArrayBuffer & Uint8Array)",
									code: 40020,
									statusCode: 400,
									remediation: "Disable channel deltas (do not set delta in channel params) on environments without typed-array support, or upgrade the JavaScript runtime."
								});
								try {
									let deltaBase = context.baseEncodedPreviousPayload;
									if (typeof deltaBase === "string") deltaBase = Platform.BufferUtils.utf8Encode(deltaBase);
									const deltaBaseBuffer = Platform.BufferUtils.toBuffer(deltaBase);
									decodedData = Platform.BufferUtils.toBuffer(decodedData);
									decodedData = Platform.BufferUtils.arrayBufferViewToBuffer(context.plugins.vcdiff.decode(decodedData, deltaBaseBuffer));
									lastPayload = decodedData;
								} catch (e) {
									throw new ErrorInfo({
										message: "Vcdiff delta decode failed with " + e,
										code: 40018,
										statusCode: 400,
										remediation: "The SDK recovers automatically by re-attaching from the last successfully processed message, and the server re-sends the affected message in full before deltas resume. If this recurs, disable deltas for this channel by removing delta from the channel params."
									});
								}
								continue;
							default: throw new Error("Unknown encoding");
						}
					}
				} catch (e) {
					const err = e;
					decodingError = new ErrorInfo({
						message: `Error processing the ${xform} encoding, decoder returned \u2018${err.message}\u2019`,
						code: err.code || 40013,
						statusCode: 400,
						remediation: err.remediation
					});
				} finally {
					finalEncoding = lastProcessedEncodingIndex <= 0 ? null : xforms.slice(0, lastProcessedEncodingIndex).join("/");
				}
			}
			if (decodingError) return {
				error: decodingError,
				data: decodedData,
				encoding: finalEncoding
			};
			context.baseEncodedPreviousPayload = lastPayload;
			return {
				data: decodedData,
				encoding: finalEncoding
			};
		}
		function wireToJSON(...args) {
			const format = args.length > 0 ? "json" : "msgpack";
			const { data, encoding } = encodeDataForWire(this.data, this.encoding, format);
			return Object.assign({}, this, {
				encoding,
				data
			});
		}
		function encodeDataForWire(data, encoding, format) {
			if (!data || !Platform.BufferUtils.isBuffer(data)) return {
				data,
				encoding
			};
			if (format === "msgpack") return {
				data: Platform.BufferUtils.toBuffer(data),
				encoding
			};
			return {
				data: Platform.BufferUtils.base64Encode(data),
				encoding: encoding ? encoding + "/base64" : "base64"
			};
		}
		var MessageEncoding = {
			encryptData,
			encodeData,
			encodeDataForWire,
			decodeData
		};
		function populateFieldsFromParent(parent) {
			const { id, connectionId, timestamp } = parent;
			let msgs;
			switch (parent.action) {
				case actions.MESSAGE:
					msgs = parent.messages;
					break;
				case actions.PRESENCE:
				case actions.SYNC:
					msgs = parent.presence;
					break;
				case actions.ANNOTATION:
					msgs = parent.annotations;
					break;
				case actions.OBJECT:
				case actions.OBJECT_SYNC:
					msgs = parent.state;
					break;
				default: throw new ErrorInfo("Unexpected action " + parent.action, 4e4, 400);
			}
			for (let i = 0; i < msgs.length; i++) {
				const msg = msgs[i];
				if (!msg.connectionId) msg.connectionId = connectionId;
				if (!msg.timestamp) msg.timestamp = timestamp;
				if (id && !msg.id) msg.id = id + ":" + i;
			}
		}
		function strMsg(m, cls) {
			let result = "[" + cls;
			for (const attr in m) if (attr === "data") {
				if (typeof m.data == "string") result += "; data=" + m.data;
				else if (Platform.BufferUtils.isBuffer(m.data)) result += "; data (buffer)=" + Platform.BufferUtils.base64Encode(m.data);
				else if (typeof m.data !== "undefined") result += "; data (json)=" + JSON.stringify(m.data);
			} else if (attr && (attr === "extras" || attr === "operation")) result += "; " + attr + "=" + JSON.stringify(m[attr]);
			else if (attr === "version") result += "; version=" + JSON.stringify(m[attr]);
			else if (attr === "annotations") result += "; annotations=" + JSON.stringify(m[attr]);
			else if (m[attr] !== void 0) result += "; " + attr + "=" + m[attr];
			result += "]";
			return result;
		}
		var BaseMessage = class {};
		var BaseClient = class {
			constructor(options) {
				/**
				* These exports are for use by UMD plugins; reason being so that constructors and static methods can be accessed by these plugins without needing to import the classes directly and result in the class existing in both the plugin and the core library.
				*/
				this.Platform = Platform;
				this.ErrorInfo = ErrorInfo;
				this.Logger = logger_default;
				this.Defaults = defaults_default;
				this.Utils = utils_exports;
				this.EventEmitter = eventemitter_default;
				this.MessageEncoding = MessageEncoding;
				var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
				this._additionalHTTPRequestImplementations = (_a2 = options.plugins) != null ? _a2 : null;
				this.logger = new logger_default();
				this.logger.setLog(options.logLevel, options.logHandler);
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "BaseClient()", "initialized with clientOptions " + Platform.Config.inspect(options));
				this._MsgPack = (_c = (_b = options.plugins) == null ? void 0 : _b.MsgPack) != null ? _c : null;
				const normalOptions = this.options = defaults_default.normaliseOptions(options, this._MsgPack, this.logger);
				if (normalOptions.key) {
					const keyMatch = normalOptions.key.match(/^([^:\s]+):([^:.\s]+)$/);
					if (!keyMatch) {
						const msg = "invalid key parameter";
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "BaseClient()", msg);
						throw new ErrorInfo({
							message: msg,
							code: 40400,
							statusCode: 404,
							remediation: "ClientOptions.key must be the full \"appId.keyId:secret\" string copied from the Ably dashboard. If you have the Ably CLI installed, `ably auth keys list` shows the keys configured on the current app."
						});
					}
					normalOptions.keyName = keyMatch[1];
					normalOptions.keySecret = keyMatch[2];
				}
				if ("clientId" in normalOptions) {
					if (!(typeof normalOptions.clientId === "string" || normalOptions.clientId === null)) throw new ErrorInfo({
						message: "clientId must be either a string or null",
						code: 40012,
						statusCode: 400,
						remediation: "Pass a stable string such as a user id to identify the client, or null (or omit it) for an anonymous client. Values like numbers or objects are not accepted."
					});
					else if (normalOptions.clientId === "*") throw new ErrorInfo({
						message: "Can’t use \"*\" as a clientId as that string is reserved",
						code: 40012,
						statusCode: 400,
						remediation: "ClientOptions.clientId sets one fixed identity and cannot be \"*\". To let this client act as any clientId, request a wildcard token instead: set defaultTokenParams: { clientId: \"*\" } on the client. The \"*\" belongs in the token request, not in ClientOptions.clientId."
					});
				}
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "BaseClient()", "started; version = " + defaults_default.version);
				this._currentFallback = null;
				this.serverTimeOffset = null;
				this.http = new Http(this);
				this.auth = new auth_default(this, normalOptions);
				this._rest = ((_d = options.plugins) == null ? void 0 : _d.Rest) ? new options.plugins.Rest(this) : null;
				this._Crypto = (_f = (_e = options.plugins) == null ? void 0 : _e.Crypto) != null ? _f : null;
				this.__FilteredSubscriptions = (_h = (_g = options.plugins) == null ? void 0 : _g.MessageInteractions) != null ? _h : null;
				this._Annotations = (_j = (_i = options.plugins) == null ? void 0 : _i.Annotations) != null ? _j : null;
				this._liveObjectsPlugin = (_l = (_k = options.plugins) == null ? void 0 : _k.LiveObjects) != null ? _l : null;
			}
			get rest() {
				if (!this._rest) throwMissingPluginError("Rest");
				return this._rest;
			}
			get _FilteredSubscriptions() {
				if (!this.__FilteredSubscriptions) throwMissingPluginError("MessageInteractions");
				return this.__FilteredSubscriptions;
			}
			get channels() {
				return this.rest.channels;
			}
			get push() {
				return this.rest.push;
			}
			/**
			* The effective platform push config for this client. A config carried by the client's Push
			* plugin (e.g. ReactNativePush, whose storage and token callbacks are supplied per client)
			* takes precedence over the platform-level Platform.Config.push (set statically on web), so
			* multiple clients never share plugin-supplied storage or callbacks.
			*/
			get pushConfig() {
				var _a2, _b, _c;
				return (_c = (_b = (_a2 = this.options.plugins) == null ? void 0 : _a2.Push) == null ? void 0 : _b.pushConfig) != null ? _c : Platform.Config.push;
			}
			/**
			* RSH8
			*
			* @deprecated Use {@link getDevice} instead. `device()` reads the device state from storage
			* synchronously, which is not possible on platforms with asynchronous storage such as React
			* Native. In the next major release `device()` will become asynchronous.
			*/
			device() {
				var _a2, _b;
				if (!((_a2 = this.options.plugins) == null ? void 0 : _a2.Push) || !this.push.LocalDevice) throwMissingPluginError("Push");
				if (!this._device) {
					if ((_b = this.pushConfig) == null ? void 0 : _b.storageIsAsync) throw new ErrorInfo({
						message: "client.device() cannot load the local device synchronously: push storage on this platform is asynchronous",
						code: 4e4,
						statusCode: 400,
						remediation: "Use await client.getDevice() instead. device() is deprecated and will become asynchronous in the next major release."
					});
					this._device = this.push.LocalDevice.load(this);
				}
				return this._device;
			}
			/** RSH8 */
			async getDevice() {
				var _a2, _b;
				if (!((_a2 = this.options.plugins) == null ? void 0 : _a2.Push) || !this.push.LocalDevice) throwMissingPluginError("Push");
				if (!this._device) {
					const devicePromise = (_b = this._devicePromise) != null ? _b : this._devicePromise = this.push.LocalDevice.loadAsync(this);
					try {
						this._device = await devicePromise;
					} catch (err) {
						if (this._devicePromise === devicePromise) this._devicePromise = void 0;
						throw err;
					}
				}
				return this._device;
			}
			baseUri(host) {
				return defaults_default.getHttpScheme(this.options) + host + ":" + defaults_default.getPort(this.options, false);
			}
			async stats(params) {
				return this.rest.stats(params);
			}
			async time(params) {
				return this.rest.time(params);
			}
			async request(method, path, version2, params, body, customHeaders) {
				return this.rest.request(method, path, version2, params, body, customHeaders);
			}
			batchPublish(specOrSpecs) {
				return this.rest.batchPublish(specOrSpecs);
			}
			batchPresence(channels) {
				return this.rest.batchPresence(channels);
			}
			setLog(logOptions) {
				this.logger.setLog(logOptions.level, logOptions.handler);
			}
			/**
			* Get the current time based on the local clock,
			* or if the option queryTime is true, return the server time.
			* The server time offset from the local time is stored so that
			* only one request to the server to get the time is ever needed
			*/
			async getTimestamp(queryTime) {
				if (!this.isTimeOffsetSet() && queryTime) return this.time();
				return this.getTimestampUsingOffset();
			}
			getTimestampUsingOffset() {
				return Platform.Config.now() + (this.serverTimeOffset || 0);
			}
			isTimeOffsetSet() {
				return this.serverTimeOffset !== null;
			}
		};
		BaseClient.Platform = Platform;
		var baseclient_default = BaseClient;
		var devicedetails_default = class _DeviceDetails {
			toJSON() {
				var _a2, _b, _c;
				return {
					id: this.id,
					deviceSecret: this.deviceSecret,
					platform: this.platform,
					formFactor: this.formFactor,
					clientId: this.clientId,
					metadata: this.metadata,
					deviceIdentityToken: this.deviceIdentityToken,
					push: {
						recipient: (_a2 = this.push) == null ? void 0 : _a2.recipient,
						state: (_b = this.push) == null ? void 0 : _b.state,
						error: (_c = this.push) == null ? void 0 : _c.error
					}
				};
			}
			toString() {
				var _a2, _b, _c, _d;
				let result = "[DeviceDetails";
				if (this.id) result += "; id=" + this.id;
				if (this.platform) result += "; platform=" + this.platform;
				if (this.formFactor) result += "; formFactor=" + this.formFactor;
				if (this.clientId) result += "; clientId=" + this.clientId;
				if (this.metadata) result += "; metadata=" + this.metadata;
				if (this.deviceIdentityToken) result += "; deviceIdentityToken=" + JSON.stringify(this.deviceIdentityToken);
				if ((_a2 = this.push) == null ? void 0 : _a2.recipient) result += "; push.recipient=" + JSON.stringify(this.push.recipient);
				if ((_b = this.push) == null ? void 0 : _b.state) result += "; push.state=" + this.push.state;
				if ((_c = this.push) == null ? void 0 : _c.error) result += "; push.error=" + JSON.stringify(this.push.error);
				if ((_d = this.push) == null ? void 0 : _d.metadata) result += "; push.metadata=" + this.push.metadata;
				result += "]";
				return result;
			}
			static toRequestBody(body, MsgPack, format) {
				return encodeBody(body, MsgPack, format);
			}
			static fromResponseBody(body, MsgPack, format) {
				if (format) body = decodeBody(body, MsgPack, format);
				if (Array.isArray(body)) return _DeviceDetails.fromValuesArray(body);
				else return _DeviceDetails.fromValues(body);
			}
			static fromValues(values) {
				values.error = values.error && ErrorInfo.fromValues(values.error);
				return Object.assign(new _DeviceDetails(), values);
			}
			static fromLocalDevice(device) {
				return Object.assign(new _DeviceDetails(), device);
			}
			static fromValuesArray(values) {
				const count = values.length, result = new Array(count);
				for (let i = 0; i < count; i++) result[i] = _DeviceDetails.fromValues(values[i]);
				return result;
			}
		};
		async function withAuthDetails(client, headers, params, opCallback) {
			if (client.http.supportsAuthHeaders) return opCallback(mixin(await client.auth.getAuthHeaders(), headers), params);
			else return opCallback(headers, mixin(await client.auth.getAuthParams(), params));
		}
		function unenvelope(result, MsgPack, format) {
			if (result.err && !result.body) return { err: result.err };
			if (result.statusCode === HttpStatusCodes_default.NoContent) return __spreadProps(__spreadValues({}, result), {
				body: [],
				unpacked: true
			});
			let body = result.body;
			if (!result.unpacked) try {
				body = decodeBody(body, MsgPack, format);
			} catch (e) {
				if (isErrorInfoOrPartialErrorInfo(e)) return { err: e };
				else return { err: new PartialErrorInfo(inspectError(e), null) };
			}
			if (!body) return { err: new PartialErrorInfo("unenvelope(): Response body is missing", null) };
			const { statusCode: wrappedStatusCode, response, headers: wrappedHeaders } = body;
			if (wrappedStatusCode === void 0) return __spreadProps(__spreadValues({}, result), {
				body,
				unpacked: true
			});
			if (wrappedStatusCode < 200 || wrappedStatusCode >= 300) {
				let wrappedErr = response && response.error || result.err;
				if (!wrappedErr) {
					wrappedErr = /* @__PURE__ */ new Error("Error in unenveloping " + body);
					wrappedErr.statusCode = wrappedStatusCode;
				}
				return {
					err: wrappedErr,
					body: response,
					headers: wrappedHeaders,
					unpacked: true,
					statusCode: wrappedStatusCode
				};
			}
			return {
				err: result.err,
				body: response,
				headers: wrappedHeaders,
				unpacked: true,
				statusCode: wrappedStatusCode
			};
		}
		function logResult2(result, method, path, params, logger) {
			if (result.err) logger_default.logAction(logger, logger_default.LOG_MICRO, "Resource." + method + "()", "Received Error; " + appendingParams(path, params) + "; Error: " + inspectError(result.err));
			else logger_default.logAction(logger, logger_default.LOG_MICRO, "Resource." + method + "()", "Received; " + appendingParams(path, params) + "; Headers: " + paramString(result.headers) + "; StatusCode: " + result.statusCode + "; Body: " + (Platform.BufferUtils.isBuffer(result.body) ? " (Base64): " + Platform.BufferUtils.base64Encode(result.body) : ": " + Platform.Config.inspect(result.body)));
		}
		var resource_default = class _Resource {
			static async get(client, path, headers, params, envelope, throwError) {
				return _Resource.do(HttpMethods_default.Get, client, path, null, headers, params, envelope, throwError != null ? throwError : false);
			}
			static async delete(client, path, headers, params, envelope, throwError) {
				return _Resource.do(HttpMethods_default.Delete, client, path, null, headers, params, envelope, throwError);
			}
			static async post(client, path, body, headers, params, envelope, throwError) {
				return _Resource.do(HttpMethods_default.Post, client, path, body, headers, params, envelope, throwError);
			}
			static async patch(client, path, body, headers, params, envelope, throwError) {
				return _Resource.do(HttpMethods_default.Patch, client, path, body, headers, params, envelope, throwError);
			}
			static async put(client, path, body, headers, params, envelope, throwError) {
				return _Resource.do(HttpMethods_default.Put, client, path, body, headers, params, envelope, throwError);
			}
			static async do(method, client, path, body, headers, params, envelope, throwError) {
				if (envelope) (params = params || {})["envelope"] = envelope;
				const logger = client.logger;
				async function doRequest(headers2, params2) {
					var _a2;
					if (logger.shouldLog(logger_default.LOG_MICRO)) {
						let decodedBody = body;
						if (((_a2 = headers2["content-type"]) == null ? void 0 : _a2.indexOf("msgpack")) > 0) try {
							if (!client._MsgPack) throwMissingPluginError("MsgPack");
							decodedBody = client._MsgPack.decode(body);
						} catch (decodeErr) {
							logger_default.logAction(logger, logger_default.LOG_MICRO, "Resource." + method + "()", "Sending MsgPack Decoding Error: " + inspectError(decodeErr));
						}
						logger_default.logAction(logger, logger_default.LOG_MICRO, "Resource." + method + "()", "Sending; " + appendingParams(path, params2) + "; Body: " + decodedBody);
					}
					const httpResult = await client.http.do(method, path, headers2, body, params2);
					if (httpResult.error && auth_default.isTokenErr(httpResult.error)) {
						await client.auth.authorize(null, null);
						return withAuthDetails(client, headers2, params2, doRequest);
					}
					return {
						err: httpResult.error,
						body: httpResult.body,
						headers: httpResult.headers,
						unpacked: httpResult.unpacked,
						statusCode: httpResult.statusCode
					};
				}
				let result = await withAuthDetails(client, headers, params, doRequest);
				if (envelope) result = unenvelope(result, client._MsgPack, envelope);
				if (logger.shouldLog(logger_default.LOG_MICRO)) logResult2(result, method, path, params, logger);
				if (throwError) if (result.err) throw result.err;
				else {
					const response = __spreadValues({}, result);
					delete response.err;
					return response;
				}
				return result;
			}
		};
		function getRelParams(linkUrl) {
			const urlMatch = linkUrl.match(/^\.\/(\w+)\?(.*)$/);
			return urlMatch && urlMatch[2] && parseQueryString(urlMatch[2]);
		}
		function parseRelLinks(linkHeader) {
			if (typeof linkHeader == "string") linkHeader = linkHeader.split(",");
			const relParams = {};
			for (let i = 0; i < linkHeader.length; i++) {
				const linkMatch = linkHeader[i].match(/^\s*<(.+)>;\s*rel="(\w+)"$/);
				if (linkMatch) {
					const params = getRelParams(linkMatch[1]);
					if (params) relParams[linkMatch[2]] = params;
				}
			}
			return relParams;
		}
		function returnErrOnly(err, body, useHPR) {
			return !(useHPR && (body || typeof err.code === "number"));
		}
		var PaginatedResource = class {
			constructor(client, path, headers, envelope, bodyHandler, useHttpPaginatedResponse) {
				this.client = client;
				this.path = path;
				this.headers = headers;
				this.envelope = envelope != null ? envelope : null;
				this.bodyHandler = bodyHandler;
				this.useHttpPaginatedResponse = useHttpPaginatedResponse || false;
			}
			get logger() {
				return this.client.logger;
			}
			async get(params) {
				const result = await resource_default.get(this.client, this.path, this.headers, params, this.envelope, false);
				return this.handlePage(result);
			}
			async delete(params) {
				const result = await resource_default.delete(this.client, this.path, this.headers, params, this.envelope, false);
				return this.handlePage(result);
			}
			async post(params, body) {
				const result = await resource_default.post(this.client, this.path, body, this.headers, params, this.envelope, false);
				return this.handlePage(result);
			}
			async put(params, body) {
				const result = await resource_default.put(this.client, this.path, body, this.headers, params, this.envelope, false);
				return this.handlePage(result);
			}
			async patch(params, body) {
				const result = await resource_default.patch(this.client, this.path, body, this.headers, params, this.envelope, false);
				return this.handlePage(result);
			}
			async handlePage(result) {
				if (result.err && returnErrOnly(result.err, result.body, this.useHttpPaginatedResponse)) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "PaginatedResource.handlePage()", "Unexpected error getting resource: err = " + inspectError(result.err));
					throw result.err;
				}
				let items, linkHeader, relParams;
				try {
					items = result.statusCode == HttpStatusCodes_default.NoContent ? [] : await this.bodyHandler(result.body, result.headers || {}, result.unpacked);
				} catch (e) {
					throw result.err || e;
				}
				if (result.headers && (linkHeader = result.headers["Link"] || result.headers["link"])) relParams = parseRelLinks(linkHeader);
				if (this.useHttpPaginatedResponse) return new HttpPaginatedResponse(this, items, result.headers || {}, result.statusCode, relParams, result.err);
				else return new PaginatedResult(this, items, relParams);
			}
		};
		var PaginatedResult = class {
			constructor(resource, items, relParams) {
				this.resource = resource;
				this.items = items;
				this._relParams = relParams;
			}
			async first() {
				if (this.hasFirst()) return this.get(this._relParams.first);
				throw new ErrorInfo({
					message: "No link to the first page of results",
					code: 40400,
					statusCode: 404,
					remediation: "first() is only available on results from a paginated REST query (such as channel history, presence, or stats), whose response includes a link to the first page. This result has no such link, so there is no first page to return."
				});
			}
			async current() {
				if (this.hasCurrent()) return this.get(this._relParams.current);
				throw new ErrorInfo({
					message: "No link to the current page of results",
					code: 40400,
					statusCode: 404,
					remediation: "current() reloads the current page and is only available on results from a paginated REST query (such as channel history, presence, or stats). This result has no such link. To page through results, use next() with hasNext() or isLast() instead."
				});
			}
			async next() {
				if (this.hasNext()) return this.get(this._relParams.next);
				return null;
			}
			hasFirst() {
				return this._relParams != null && "first" in this._relParams;
			}
			hasCurrent() {
				return this._relParams != null && "current" in this._relParams;
			}
			hasNext() {
				return this._relParams != null && "next" in this._relParams;
			}
			isLast() {
				return !this.hasNext();
			}
			async get(params) {
				const res = this.resource;
				const result = await resource_default.get(res.client, res.path, res.headers, params, res.envelope, false);
				return res.handlePage(result);
			}
		};
		var HttpPaginatedResponse = class extends PaginatedResult {
			constructor(resource, items, headers, statusCode, relParams, err) {
				super(resource, items, relParams);
				this.statusCode = statusCode;
				this.success = statusCode < 300 && statusCode >= 200;
				this.headers = headers;
				this.errorCode = err && err.code;
				this.errorMessage = err && err.message;
				this.errorDetail = err == null ? void 0 : err.detail;
			}
			toJSON() {
				return {
					items: this.items,
					statusCode: this.statusCode,
					success: this.success,
					headers: this.headers,
					errorCode: this.errorCode,
					errorMessage: this.errorMessage,
					errorDetail: this.errorDetail
				};
			}
		};
		var paginatedresource_default = PaginatedResource;
		var _PushChannelSubscription = class _PushChannelSubscription {
			/**
			* Overload toJSON() to intercept JSON.stringify()
			* @return {*}
			*/
			toJSON() {
				return {
					channel: this.channel,
					deviceId: this.deviceId,
					clientId: this.clientId
				};
			}
			toString() {
				let result = "[PushChannelSubscription";
				if (this.channel) result += "; channel=" + this.channel;
				if (this.deviceId) result += "; deviceId=" + this.deviceId;
				if (this.clientId) result += "; clientId=" + this.clientId;
				result += "]";
				return result;
			}
			static fromResponseBody(body, MsgPack, format) {
				if (format) body = decodeBody(body, MsgPack, format);
				if (Array.isArray(body)) return _PushChannelSubscription.fromValuesArray(body);
				else return _PushChannelSubscription.fromValues(body);
			}
			static fromValues(values) {
				return Object.assign(new _PushChannelSubscription(), values);
			}
			static fromValuesArray(values) {
				const count = values.length, result = new Array(count);
				for (let i = 0; i < count; i++) result[i] = _PushChannelSubscription.fromValues(values[i]);
				return result;
			}
		};
		_PushChannelSubscription.toRequestBody = encodeBody;
		var pushchannelsubscription_default = _PushChannelSubscription;
		var PUSH_ACTIVATION_NOT_AVAILABLE_HINT = "Run push.activate() in a browser environment with service worker support, or in React Native using the ably/react-native-push plugin. From a server, use client.push.admin instead. Call client.push.admin.publish(recipient, payload) to send to a device or clientId. Call client.push.admin.deviceRegistrations.save(device) to register a device record.";
		var PUSH_DEACTIVATION_NOT_AVAILABLE_HINT = "Run push.deactivate() in a browser environment with service worker support, or in React Native using the ably/react-native-push plugin. From a server, call client.push.admin.deviceRegistrations.remove(deviceId) to remove a device registration.";
		var PUSH_TOKEN_UPDATE_NOT_AVAILABLE_HINT = "Call push.updateToken() in React Native with the ably/react-native-push plugin configured, passing plugins: { Push: ReactNativePush.create({ storage, requestToken }) } in the client options. From a server, use client.push.admin.deviceRegistrations.save(device) to modify a device registration instead.";
		var Push = class {
			constructor(client) {
				var _a2;
				this.client = client;
				this.admin = new Admin(client);
				const pushPlugin = (_a2 = client.options.plugins) == null ? void 0 : _a2.Push;
				if (client.pushConfig && pushPlugin) {
					this.stateMachine = new pushPlugin.ActivationStateMachine(client);
					this.LocalDevice = pushPlugin.localDeviceFactory(devicedetails_default);
				}
			}
			async activate(registerCallback, updateFailedCallback) {
				var _a2;
				const pushPlugin = (_a2 = this.client.options.plugins) == null ? void 0 : _a2.Push;
				if (!pushPlugin) throw createMissingPluginError("Push");
				const machine = this.stateMachine;
				if (!machine) throw new ErrorInfo({
					message: "This platform is not supported as a target of push notifications: push activation requires a browser environment with service worker support, or a React Native environment with the ably/react-native-push plugin",
					code: 4e4,
					statusCode: 400,
					remediation: PUSH_ACTIVATION_NOT_AVAILABLE_HINT
				});
				if (machine.activatedCallback) throw new ErrorInfo({
					message: "Activation already in progress",
					code: 4e4,
					statusCode: 400,
					remediation: "Await the in-flight push.activate() before calling it again."
				});
				const activated = new Promise((resolve, reject) => {
					machine.activatedCallback = (err) => {
						if (err) {
							reject(err);
							return;
						}
						resolve();
					};
					machine.updateFailedCallback = updateFailedCallback;
				});
				try {
					await this.client.getDevice();
					await machine.ensureInitialized();
				} catch (err) {
					delete machine.activatedCallback;
					delete machine.updateFailedCallback;
					throw err;
				}
				machine.handleEvent(new pushPlugin.CalledActivate(machine, registerCallback));
				await activated;
			}
			async deactivate(deregisterCallback) {
				var _a2;
				const pushPlugin = (_a2 = this.client.options.plugins) == null ? void 0 : _a2.Push;
				if (!pushPlugin) throw createMissingPluginError("Push");
				const machine = this.stateMachine;
				if (!machine) throw new ErrorInfo({
					message: "This platform is not supported as a target of push notifications: push activation requires a browser environment with service worker support, or a React Native environment with the ably/react-native-push plugin",
					code: 4e4,
					statusCode: 400,
					remediation: PUSH_DEACTIVATION_NOT_AVAILABLE_HINT
				});
				if (machine.deactivatedCallback) throw new ErrorInfo({
					message: "Deactivation already in progress",
					code: 4e4,
					statusCode: 400,
					remediation: "Await the in-flight push.deactivate() before calling it again."
				});
				const deactivated = new Promise((resolve, reject) => {
					machine.deactivatedCallback = (err) => {
						if (err) {
							reject(err);
							return;
						}
						resolve();
					};
				});
				try {
					await this.client.getDevice();
					await machine.ensureInitialized();
				} catch (err) {
					delete machine.deactivatedCallback;
					throw err;
				}
				machine.handleEvent(new pushPlugin.CalledDeactivate(machine, deregisterCallback));
				await deactivated;
			}
			async updateToken(token) {
				var _a2;
				if (!((_a2 = this.client.options.plugins) == null ? void 0 : _a2.Push)) throw createMissingPluginError("Push");
				const machine = this.stateMachine;
				if (!machine) throw new ErrorInfo({
					message: "This platform is not supported as a target of push notifications: push token updates require a React Native environment with the ably/react-native-push plugin",
					code: 4e4,
					statusCode: 400,
					remediation: PUSH_TOKEN_UPDATE_NOT_AVAILABLE_HINT
				});
				if (!token || token.transportType !== "fcm" && token.transportType !== "apns" || typeof token.token !== "string" || token.token.length === 0) throw new ErrorInfo({
					message: "push.updateToken() requires a { transportType, token } object with transportType 'fcm' or 'apns' and a non-empty token string",
					code: 4e4,
					statusCode: 400,
					remediation: "Pass the refreshed token in the shape your requestToken callback returns, for example { transportType: 'fcm', token } with the token value delivered by messaging().onTokenRefresh."
				});
				const device = await this.client.getDevice();
				await machine.ensureInitialized();
				if (!device.deviceIdentityToken) throw new ErrorInfo({
					message: "Push token cannot be updated because the device is not activated for push notifications",
					code: 4e4,
					statusCode: 400,
					remediation: "Call client.push.activate() and await its completion before calling push.updateToken(). Wire updateToken() to your platform token refresh listener only after activation has completed."
				});
				device.push.recipient = token.transportType === "apns" ? {
					transportType: "apns",
					deviceToken: token.token
				} : {
					transportType: "fcm",
					registrationToken: token.token
				};
				await device.persist();
				machine.handleEvent(new machine.GotPushDeviceDetails());
			}
		};
		var Admin = class {
			constructor(client) {
				this.client = client;
				this.deviceRegistrations = new DeviceRegistrations(client);
				this.channelSubscriptions = new ChannelSubscriptions(client);
				this.liveActivity = new LiveActivity(client);
			}
			async publish(recipient, payload) {
				const client = this.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(client.options), params = {};
				const body = mixin({ recipient }, payload);
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				const requestBody = encodeBody(body, client._MsgPack, format);
				await resource_default.post(client, "/push/publish", requestBody, headers, params, null, true);
			}
			async createApnsBroadcast(options) {
				const client = this.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(client.options), params = {};
				mixin(headers, client.options.headers);
				const requestBody = encodeBody({ messageStoragePolicy: options.messageStoragePolicy }, client._MsgPack, format);
				const response = await resource_default.post(client, "/push/apnsBroadcastChannels", requestBody, headers, params, null, true);
				return response.unpacked ? response.body : decodeBody(response.body, client._MsgPack, format);
			}
		};
		var LiveActivity = class {
			constructor(client) {
				this.client = client;
			}
			async start(params) {
				const { recipient, apnsBroadcast, apns, headers } = params;
				const hasChannels = Array.isArray(recipient.channels) && recipient.channels.length > 0;
				const hasDeviceId = !!recipient.deviceId;
				if (hasChannels === hasDeviceId) throw new ErrorInfo("LiveActivity.start() requires exactly one of recipient.channels or recipient.deviceId", 4e4, 400);
				const body = { apns };
				if (hasChannels) body.channels = recipient.channels;
				if (hasDeviceId) body.deviceId = recipient.deviceId;
				if (headers) body.headers = headers;
				await this._post(apnsBroadcast, "start", body);
			}
			async update(params) {
				const { apnsBroadcast, apns, headers } = params;
				const body = { apns };
				if (headers) body.headers = headers;
				await this._post(apnsBroadcast, "broadcast", body);
			}
			async end(params) {
				const { apnsBroadcast, apns, headers } = params;
				const body = { apns };
				if (headers) body.headers = headers;
				await this._post(apnsBroadcast, "end", body);
			}
			async _post(apnsBroadcast, action, body) {
				const client = this.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json";
				const requestHeaders = defaults_default.defaultPostHeaders(client.options);
				const params = {};
				mixin(requestHeaders, client.options.headers);
				const requestBody = encodeBody(body, client._MsgPack, format);
				await resource_default.post(client, "/push/apnsBroadcastChannels/" + encodeURIComponent(apnsBroadcast) + "/" + action, requestBody, requestHeaders, params, null, true);
			}
		};
		var DeviceRegistrations = class {
			constructor(client) {
				this.client = client;
			}
			async save(device) {
				const client = this.client;
				const body = devicedetails_default.fromValues(device);
				const format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(client.options), params = {};
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				const requestBody = encodeBody(body, client._MsgPack, format);
				const response = await resource_default.put(client, "/push/deviceRegistrations/" + encodeURIComponent(device.id), requestBody, headers, params, null, true);
				return devicedetails_default.fromResponseBody(response.body, client._MsgPack, response.unpacked ? void 0 : format);
			}
			async get(deviceIdOrDetails) {
				const client = this.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultGetHeaders(client.options), deviceId = deviceIdOrDetails.id || deviceIdOrDetails;
				if (typeof deviceId !== "string" || !deviceId.length) throw new ErrorInfo({
					message: "First argument to DeviceRegistrations#get must be a deviceId string or DeviceDetails",
					code: 4e4,
					statusCode: 400,
					remediation: "Pass either the device id string or a DeviceDetails object with a non-empty .id field. The local device id is available from client.device().id after push.activate() completes. Alternatively pass the .id of a DeviceDetails returned by push.admin.deviceRegistrations.save()."
				});
				mixin(headers, client.options.headers);
				const response = await resource_default.get(client, "/push/deviceRegistrations/" + encodeURIComponent(deviceId), headers, {}, null, true);
				return devicedetails_default.fromResponseBody(response.body, client._MsgPack, response.unpacked ? void 0 : format);
			}
			async list(params) {
				const client = this.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = this.client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, "/push/deviceRegistrations", headers, envelope, async function(body, headers2, unpacked) {
					return devicedetails_default.fromResponseBody(body, client._MsgPack, unpacked ? void 0 : format);
				}).get(params);
			}
			async remove(deviceIdOrDetails) {
				const client = this.client, headers = defaults_default.defaultGetHeaders(client.options), params = {}, deviceId = deviceIdOrDetails.id || deviceIdOrDetails;
				if (typeof deviceId !== "string" || !deviceId.length) throw new ErrorInfo({
					message: "First argument to DeviceRegistrations#remove must be a deviceId string or DeviceDetails",
					code: 4e4,
					statusCode: 400,
					remediation: "Pass either the device id string or the DeviceDetails object (with a non-empty .id field). To deactivate the local device, call client.push.deactivate() instead."
				});
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				await resource_default["delete"](client, "/push/deviceRegistrations/" + encodeURIComponent(deviceId), headers, params, null, true);
			}
			async removeWhere(params) {
				const client = this.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultGetHeaders(client.options, { format });
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				await resource_default["delete"](client, "/push/deviceRegistrations", headers, params, null, true);
			}
		};
		var ChannelSubscriptions = class _ChannelSubscriptions {
			constructor(client) {
				this.remove = _ChannelSubscriptions.prototype.removeWhere;
				this.client = client;
			}
			async save(subscription) {
				const client = this.client;
				const body = pushchannelsubscription_default.fromValues(subscription);
				const format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(client.options), params = {};
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				const requestBody = encodeBody(body, client._MsgPack, format);
				const response = await resource_default.post(client, "/push/channelSubscriptions", requestBody, headers, params, null, true);
				return pushchannelsubscription_default.fromResponseBody(response.body, client._MsgPack, response.unpacked ? void 0 : format);
			}
			async list(params) {
				const client = this.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = this.client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, "/push/channelSubscriptions", headers, envelope, async function(body, headers2, unpacked) {
					return pushchannelsubscription_default.fromResponseBody(body, client._MsgPack, unpacked ? void 0 : format);
				}).get(params);
			}
			async removeWhere(params) {
				const client = this.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultGetHeaders(client.options, { format });
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				await resource_default["delete"](client, "/push/channelSubscriptions", headers, params, null, true);
			}
			async listChannels(params) {
				const client = this.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = this.client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				if (client.options.pushFullWait) mixin(params, { fullWait: "true" });
				return new paginatedresource_default(client, "/push/channels", headers, envelope, async function(body, headers2, unpacked) {
					const parsedBody = !unpacked && format ? decodeBody(body, client._MsgPack, format) : body;
					for (let i = 0; i < parsedBody.length; i++) parsedBody[i] = String(parsedBody[i]);
					return parsedBody;
				}).get(params);
			}
		};
		var push_default = Push;
		var actions2 = [
			"absent",
			"present",
			"enter",
			"leave",
			"update"
		];
		async function fromEncoded(logger, Crypto2, encoded, inputOptions) {
			const options = normalizeCipherOptions(Crypto2, logger, inputOptions != null ? inputOptions : null);
			return WirePresenceMessage.fromValues(encoded).decode(options, logger);
		}
		async function fromEncodedArray(logger, Crypto2, encodedArray, options) {
			return Promise.all(encodedArray.map(function(encoded) {
				return fromEncoded(logger, Crypto2, encoded, options);
			}));
		}
		async function _fromEncoded(encoded, channel) {
			return WirePresenceMessage.fromValues(encoded).decode(channel.channelOptions, channel.logger);
		}
		async function _fromEncodedArray(encodedArray, channel) {
			return Promise.all(encodedArray.map(function(encoded) {
				return _fromEncoded(encoded, channel);
			}));
		}
		var PresenceMessage = class _PresenceMessage extends BaseMessage {
			isSynthesized() {
				if (!this.id || !this.connectionId) return true;
				return this.id.substring(this.connectionId.length, 0) !== this.connectionId;
			}
			parseId() {
				if (!this.id) throw new Error("parseId(): Presence message does not contain an id");
				const parts = this.id.split(":");
				return {
					connectionId: parts[0],
					msgSerial: parseInt(parts[1], 10),
					index: parseInt(parts[2], 10)
				};
			}
			async encode(options) {
				return encode(Object.assign(new WirePresenceMessage(), this, { action: actions2.indexOf(this.action || "present") }), options);
			}
			static fromValues(values) {
				return Object.assign(new _PresenceMessage(), values);
			}
			static fromValuesArray(values) {
				return values.map((v) => _PresenceMessage.fromValues(v));
			}
			static fromData(data) {
				if (data instanceof _PresenceMessage) return data;
				return _PresenceMessage.fromValues({ data });
			}
			toString() {
				return strMsg(this, "PresenceMessage");
			}
		};
		var WirePresenceMessage = class _WirePresenceMessage extends BaseMessage {
			toJSON(...args) {
				return wireToJSON.call(this, ...args);
			}
			static fromValues(values) {
				return Object.assign(new _WirePresenceMessage(), values);
			}
			static fromValuesArray(values) {
				return values.map((v) => _WirePresenceMessage.fromValues(v));
			}
			async decode(channelOptions, logger) {
				const res = Object.assign(new PresenceMessage(), __spreadProps(__spreadValues({}, this), { action: actions2[this.action] }));
				try {
					await decode(res, channelOptions);
				} catch (e) {
					logger_default.logAction(logger, logger_default.LOG_ERROR, "WirePresenceMessage.decode()", inspectError(e));
				}
				return res;
			}
			toString() {
				return strMsg(this, "WirePresenceMessage");
			}
		};
		var presencemessage_default = PresenceMessage;
		var RestPresence = class {
			constructor(channel) {
				this.channel = channel;
			}
			get logger() {
				return this.channel.logger;
			}
			async get(params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestPresence.get()", "channel = " + this.channel.name);
				const client = this.channel.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = this.channel.client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, this.channel.client.rest.presenceMixin.basePath(this), headers, envelope, async (body, headers2, unpacked) => {
					return _fromEncodedArray(unpacked ? body : decodeBody(body, client._MsgPack, format), this.channel);
				}).get(params);
			}
			async history(params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestPresence.history()", "channel = " + this.channel.name);
				return this.channel.client.rest.presenceMixin.history(this, params);
			}
		};
		var restpresence_default = RestPresence;
		var actions3 = [
			"message.create",
			"message.update",
			"message.delete",
			"meta",
			"message.summary",
			"message.append"
		];
		function stringifyAction(action) {
			return actions3[action || 0] || "unknown";
		}
		function getMessageSize(msg) {
			let size = 0;
			if (msg.name) size += msg.name.length;
			if (msg.clientId) size += msg.clientId.length;
			if (msg.extras) size += JSON.stringify(msg.extras).length;
			if (msg.data) size += dataSizeBytes(msg.data);
			return size;
		}
		async function fromEncoded2(logger, Crypto2, encoded, inputOptions) {
			const options = normalizeCipherOptions(Crypto2, logger, inputOptions != null ? inputOptions : null);
			return WireMessage.fromValues(encoded).decode(options, logger);
		}
		async function fromEncodedArray2(logger, Crypto2, encodedArray, options) {
			return Promise.all(encodedArray.map(function(encoded) {
				return fromEncoded2(logger, Crypto2, encoded, options);
			}));
		}
		async function _fromEncoded2(encoded, channel) {
			return WireMessage.fromValues(encoded).decode(channel.channelOptions, channel.logger);
		}
		async function _fromEncodedArray2(encodedArray, channel) {
			return Promise.all(encodedArray.map(function(encoded) {
				return _fromEncoded2(encoded, channel);
			}));
		}
		async function encodeArray(messages, options) {
			return Promise.all(messages.map((message) => message.encode(options)));
		}
		var serialize = encodeBody;
		function getMessagesSize(messages) {
			let msg, total = 0;
			for (let i = 0; i < messages.length; i++) {
				msg = messages[i];
				total += msg.size || (msg.size = getMessageSize(msg));
			}
			return total;
		}
		var Message = class _Message extends BaseMessage {
			expandFields() {
				if (!this.version) this.version = {};
				if (!this.version.serial && this.serial) this.version.serial = this.serial;
				if (!this.version.timestamp && this.timestamp) this.version.timestamp = this.timestamp;
				if (!this.annotations) this.annotations = { summary: {} };
				else if (!this.annotations.summary) this.annotations.summary = {};
				if (this.annotations && this.annotations.summary) {
					for (const [type, summaryEntry] of Object.entries(this.annotations.summary)) if (type.endsWith(":distinct.v1") || type.endsWith(":unique.v1") || type.endsWith(":multiple.v1")) {
						for (const [, entry] of Object.entries(summaryEntry)) if (!entry.clipped) entry.clipped = false;
					} else if (type.endsWith(":flag.v1")) {
						if (!summaryEntry.clipped) summaryEntry.clipped = false;
					}
				}
			}
			async encode(options) {
				return encode(Object.assign(new WireMessage(), this, { action: actions3.indexOf(this.action || "message.create") }), options);
			}
			static fromValues(values) {
				return Object.assign(new _Message(), values);
			}
			static fromValuesArray(values) {
				return values.map((v) => _Message.fromValues(v));
			}
			toString() {
				return strMsg(this, "Message");
			}
		};
		var WireMessage = class _WireMessage extends BaseMessage {
			toJSON(...args) {
				return wireToJSON.call(this, ...args);
			}
			static fromValues(values) {
				return Object.assign(new _WireMessage(), values);
			}
			static fromValuesArray(values) {
				return values.map((v) => _WireMessage.fromValues(v));
			}
			async decodeWithErr(inputContext, logger) {
				const res = Object.assign(new Message(), __spreadProps(__spreadValues({}, this), { action: stringifyAction(this.action) }));
				let err;
				try {
					await decode(res, inputContext);
				} catch (e) {
					logger_default.logAction(logger, logger_default.LOG_ERROR, "WireMessage.decode()", inspectError(e));
					err = e;
				}
				res.expandFields();
				return {
					decoded: res,
					err
				};
			}
			async decode(inputContext, logger) {
				const { decoded } = await this.decodeWithErr(inputContext, logger);
				return decoded;
			}
			toString() {
				return strMsg(this, "WireMessage");
			}
		};
		var message_default = Message;
		var MSG_ID_ENTROPY_BYTES = 9;
		function allEmptyIds(messages) {
			return messages.every(function(message) {
				return !message.id;
			});
		}
		var RestChannel = class {
			constructor(client, name, channelOptions) {
				this._annotations = null;
				var _a2, _b;
				logger_default.logAction(client.logger, logger_default.LOG_MINOR, "RestChannel()", "started; name = " + name);
				this.name = name;
				this.client = client;
				this.presence = new restpresence_default(this);
				this.channelOptions = normaliseChannelOptions((_a2 = client._Crypto) != null ? _a2 : null, this.logger, channelOptions);
				if ((_b = client.options.plugins) == null ? void 0 : _b.Push) this._push = new client.options.plugins.Push.PushChannel(this);
				if (client._Annotations) this._annotations = new client._Annotations.RestAnnotations(this);
				if (client._liveObjectsPlugin) this._object = new client._liveObjectsPlugin.RestObject(this);
			}
			get annotations() {
				if (!this._annotations) throwMissingPluginError("Annotations");
				return this._annotations;
			}
			get push() {
				if (!this._push) throwMissingPluginError("Push");
				return this._push;
			}
			get object() {
				if (!this._object) throwMissingPluginError("LiveObjects");
				return this._object;
			}
			get logger() {
				return this.client.logger;
			}
			setOptions(options) {
				var _a2;
				this.channelOptions = normaliseChannelOptions((_a2 = this.client._Crypto) != null ? _a2 : null, this.logger, options);
			}
			async history(params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestChannel.history()", "channel = " + this.name);
				return this.client.rest.channelMixin.history(this, params != null ? params : null);
			}
			async publish(...args) {
				const first = args[0], second = args[1];
				let messages;
				let params;
				if (typeof first === "string" || first === null) {
					messages = [message_default.fromValues({
						name: first,
						data: second
					})];
					params = args[2];
				} else if (isObject(first)) {
					messages = [message_default.fromValues(first)];
					params = args[1];
				} else if (Array.isArray(first)) {
					messages = message_default.fromValuesArray(first);
					params = args[1];
				} else throw new ErrorInfo({
					message: "publish() expects an event name (string or null), a message object, or an array of message objects as its first argument",
					code: 40013,
					statusCode: 400,
					remediation: "Call publish(name, data) for a single event, or publish(message | message[]) with a Message-shaped object."
				});
				if (!params) params = {};
				const client = this.client, options = client.options, format = options.useBinaryProtocol ? "msgpack" : "json", idempotentRestPublishing = client.options.idempotentRestPublishing, headers = defaults_default.defaultPostHeaders(client.options);
				mixin(headers, options.headers);
				if (idempotentRestPublishing && allEmptyIds(messages)) {
					const msgIdBase = await randomString(MSG_ID_ENTROPY_BYTES);
					messages.forEach(function(message, index) {
						message.id = msgIdBase + ":" + index.toString();
					});
				}
				const wireMessages = await encodeArray(messages, this.channelOptions);
				const size = getMessagesSize(wireMessages), maxMessageSize = options.maxMessageSize;
				if (size > maxMessageSize) throw new ErrorInfo({
					message: `Maximum size of messages that can be published at once exceeded (was ${size} bytes, against a limit of ${maxMessageSize} bytes)`,
					code: 40009,
					statusCode: 400,
					remediation: "Split the publish into multiple calls so each batch is under the limit. If you set ClientOptions.maxMessageSize yourself, raise it. It can only restrict below your account limit, not above it. To lift the account limit, contact Ably support."
				});
				return this._publish(serialize(wireMessages, client._MsgPack, format), headers, params);
			}
			async _publish(requestBody, headers, params) {
				const client = this.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json";
				const { body, unpacked } = await resource_default.post(client, client.rest.channelMixin.basePath(this) + "/messages", requestBody, headers, params, null, true);
				const decoded = (unpacked ? body : decodeBody(body, client._MsgPack, format)) || {};
				delete decoded["channel"];
				delete decoded["messageId"];
				return decoded;
			}
			async status() {
				return this.client.rest.channelMixin.status(this);
			}
			async getMessage(serialOrMessage) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestChannel.getMessage()", "channel = " + this.name);
				return this.client.rest.channelMixin.getMessage(this, serialOrMessage);
			}
			async updateMessage(message, operation, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestChannel.updateMessage()", "channel = " + this.name);
				return this.client.rest.channelMixin.updateDeleteMessage(this, "message.update", message, operation, params);
			}
			async deleteMessage(message, operation, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestChannel.deleteMessage()", "channel = " + this.name);
				return this.client.rest.channelMixin.updateDeleteMessage(this, "message.delete", message, operation, params);
			}
			async appendMessage(message, operation, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestChannel.appendMessage()", "channel = " + this.name);
				return this.client.rest.channelMixin.updateDeleteMessage(this, "message.append", message, operation, params);
			}
			async getMessageVersions(serialOrMessage, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RestChannel.getMessageVersions()", "channel = " + this.name);
				return this.client.rest.channelMixin.getMessageVersions(this, serialOrMessage, params);
			}
		};
		var restchannel_default = RestChannel;
		var stats_default = class _Stats {
			constructor(values) {
				this.entries = values && values.entries || void 0;
				this.schema = values && values.schema || void 0;
				this.appId = values && values.appId || void 0;
				this.inProgress = values && values.inProgress || void 0;
				this.unit = values && values.unit || void 0;
				this.intervalId = values && values.intervalId || void 0;
			}
			static fromValues(values) {
				return new _Stats(values);
			}
		};
		var RestChannelMixin = class {
			static basePath(channel) {
				return "/channels/" + encodeURIComponent(channel.name);
			}
			static history(channel, params) {
				const client = channel.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = channel.client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, this.basePath(channel) + "/messages", headers, envelope, async function(body, headers2, unpacked) {
					return _fromEncodedArray2(unpacked ? body : decodeBody(body, client._MsgPack, format), channel);
				}).get(params);
			}
			static async status(channel) {
				const format = channel.client.options.useBinaryProtocol ? "msgpack" : "json";
				const headers = defaults_default.defaultPostHeaders(channel.client.options);
				return (await resource_default.get(channel.client, this.basePath(channel), headers, {}, format, true)).body;
			}
			static async getMessage(channel, serialOrMessage) {
				const serial = typeof serialOrMessage === "string" ? serialOrMessage : serialOrMessage.serial;
				if (!serial) throw new ErrorInfo({
					message: "This message lacks a serial",
					code: 40003,
					statusCode: 400,
					remediation: "Pass the Message received from a subscribe callback (which carries .serial), or its serial string. Newly constructed Message objects do not have a serial."
				});
				const client = channel.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json";
				const headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				const { body, unpacked } = await resource_default.get(client, this.basePath(channel) + "/messages/" + encodeURIComponent(serial), headers, {}, null, true);
				return _fromEncoded2(unpacked ? body : decodeBody(body, client._MsgPack, format), channel);
			}
			static async updateDeleteMessage(channel, action, message, operation, params) {
				if (!message.serial) throw new ErrorInfo({
					message: "This message lacks a serial",
					code: 40003,
					statusCode: 400,
					remediation: "Pass the Message received from a subscribe callback (which carries .serial), not a freshly constructed object."
				});
				const client = channel.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json";
				const headers = defaults_default.defaultPostHeaders(client.options);
				mixin(headers, client.options.headers);
				const requestMessage = message_default.fromValues(message);
				requestMessage.action = action;
				requestMessage.version = operation;
				const requestBody = serialize(await requestMessage.encode(channel.channelOptions), client._MsgPack, format);
				let method = resource_default.patch;
				const { body, unpacked } = await method(client, this.basePath(channel) + "/messages/" + encodeURIComponent(message.serial), requestBody, headers, params || {}, null, true);
				return (unpacked ? body : decodeBody(body, client._MsgPack, format)) || { versionSerial: null };
			}
			static getMessageVersions(channel, serialOrMessage, params) {
				const serial = typeof serialOrMessage === "string" ? serialOrMessage : serialOrMessage.serial;
				if (!serial) throw new ErrorInfo({
					message: "This message lacks a serial",
					code: 40003,
					statusCode: 400,
					remediation: "Pass the Message received from a subscribe callback (which carries .serial), or its serial string. Newly constructed Message objects do not have a serial."
				});
				const client = channel.client;
				const format = client.options.useBinaryProtocol ? "msgpack" : "json";
				const envelope = channel.client.http.supportsLinkHeaders ? void 0 : format;
				const headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, this.basePath(channel) + "/messages/" + encodeURIComponent(serial) + "/versions", headers, envelope, async (body, headers2, unpacked) => {
					return _fromEncodedArray2(unpacked ? body : decodeBody(body, client._MsgPack, format), channel);
				}).get(params || {});
			}
		};
		var RestPresenceMixin = class {
			static basePath(presence) {
				return RestChannelMixin.basePath(presence.channel) + "/presence";
			}
			static async history(presence, params) {
				const client = presence.channel.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = presence.channel.client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, this.basePath(presence) + "/history", headers, envelope, async (body, headers2, unpacked) => {
					return _fromEncodedArray(unpacked ? body : decodeBody(body, client._MsgPack, format), presence.channel);
				}).get(params);
			}
		};
		var Rest = class {
			constructor(client) {
				this.channelMixin = RestChannelMixin;
				this.presenceMixin = RestPresenceMixin;
				this.Resource = resource_default;
				this.PaginatedResource = paginatedresource_default;
				this.DeviceDetails = devicedetails_default;
				this.PushChannelSubscription = pushchannelsubscription_default;
				this.client = client;
				this.channels = new Channels(this.client);
				this.push = new push_default(this.client);
			}
			async stats(params) {
				const headers = defaults_default.defaultGetHeaders(this.client.options), format = this.client.options.useBinaryProtocol ? "msgpack" : "json", envelope = this.client.http.supportsLinkHeaders ? void 0 : format;
				mixin(headers, this.client.options.headers);
				return new paginatedresource_default(this.client, "/stats", headers, envelope, async (body, _, unpacked) => {
					const statsValues = unpacked ? body : decodeBody(body, this.client._MsgPack, format);
					for (let i = 0; i < statsValues.length; i++) statsValues[i] = stats_default.fromValues(statsValues[i]);
					return statsValues;
				}).get(params);
			}
			async time(params) {
				const headers = defaults_default.defaultGetHeaders(this.client.options, { format: "json" });
				if (this.client.options.headers) mixin(headers, this.client.options.headers);
				const timeUri = (host) => {
					return this.client.baseUri(host) + "/time";
				};
				let { error, body, unpacked } = await this.client.http.do(HttpMethods_default.Get, timeUri, headers, null, params);
				if (error) throw error;
				if (!unpacked) body = JSON.parse(body);
				const time = body[0];
				if (!time) throw new ErrorInfo("Internal error (unexpected result type from GET /time)", 5e4, 500);
				this.client.serverTimeOffset = time - Platform.Config.now();
				return time;
			}
			async request(method, path, version2, params, body, customHeaders) {
				var _a2;
				const [encoder, decoder, format] = (() => {
					if (this.client.options.useBinaryProtocol) {
						if (!this.client._MsgPack) throwMissingPluginError("MsgPack");
						return [
							this.client._MsgPack.encode,
							this.client._MsgPack.decode,
							"msgpack"
						];
					} else return [
						JSON.stringify,
						JSON.parse,
						"json"
					];
				})();
				const envelope = this.client.http.supportsLinkHeaders ? void 0 : format;
				params = params || {};
				const _method = method.toLowerCase();
				const headers = _method == "get" ? defaults_default.defaultGetHeaders(this.client.options, {
					format,
					protocolVersion: version2
				}) : defaults_default.defaultPostHeaders(this.client.options, {
					format,
					protocolVersion: version2
				});
				if (typeof body !== "string") body = (_a2 = encoder(body)) != null ? _a2 : null;
				mixin(headers, this.client.options.headers);
				if (customHeaders) mixin(headers, customHeaders);
				const paginatedResource = new paginatedresource_default(this.client, path, headers, envelope, async function(resbody, headers2, unpacked) {
					return ensureArray(unpacked ? resbody : decoder(resbody));
				}, true);
				if (!Platform.Http.methods.includes(_method)) throw new ErrorInfo({
					message: "Unsupported method " + _method,
					code: 40500,
					statusCode: 405,
					remediation: `Use one of: ${Platform.Http.methods.join(", ")}.`
				});
				if (Platform.Http.methodsWithBody.includes(_method)) return paginatedResource[_method](params, body);
				else return paginatedResource[_method](params);
			}
			async batchPublish(specOrSpecs) {
				let requestBodyDTO;
				let singleSpecMode;
				if (Array.isArray(specOrSpecs)) {
					requestBodyDTO = specOrSpecs;
					singleSpecMode = false;
				} else {
					requestBodyDTO = [specOrSpecs];
					singleSpecMode = true;
				}
				const format = this.client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(this.client.options);
				if (this.client.options.headers) mixin(headers, this.client.options.headers);
				const requestBody = encodeBody(requestBodyDTO, this.client._MsgPack, format);
				const response = await resource_default.post(this.client, "/messages", requestBody, headers, {}, null, true);
				const batchResults = response.unpacked ? response.body : decodeBody(response.body, this.client._MsgPack, format);
				if (singleSpecMode) return batchResults[0];
				else return batchResults;
			}
			async batchPresence(channels) {
				const format = this.client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultGetHeaders(this.client.options);
				if (this.client.options.headers) mixin(headers, this.client.options.headers);
				const channelsParam = channels.join(",");
				const response = await resource_default.get(this.client, "/presence", headers, { channels: channelsParam }, null, true);
				return response.unpacked ? response.body : decodeBody(response.body, this.client._MsgPack, format);
			}
			async revokeTokens(specifiers, options) {
				if (useTokenAuth(this.client.options)) throw new ErrorInfo({
					message: "Cannot revoke tokens when using token auth",
					code: 40162,
					statusCode: 401,
					remediation: "Token revocation must use basic auth, so construct a separate Ably.Rest client with ClientOptions.key (the API key that issued the tokens) just for this call. Revocable tokens must have been enabled on the key in the Ably dashboard before the tokens were issued, otherwise there is nothing to revoke."
				});
				const keyName = this.client.options.keyName;
				let resolvedOptions = options != null ? options : {};
				const requestBodyDTO = __spreadValues({ targets: specifiers.map((specifier) => `${specifier.type}:${specifier.value}`) }, resolvedOptions);
				const format = this.client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(this.client.options);
				if (this.client.options.headers) mixin(headers, this.client.options.headers);
				const requestBody = encodeBody(requestBodyDTO, this.client._MsgPack, format);
				const response = await resource_default.post(this.client, `/keys/${keyName}/revokeTokens`, requestBody, headers, {}, null, true);
				return response.unpacked ? response.body : decodeBody(response.body, this.client._MsgPack, format);
			}
		};
		var Channels = class {
			constructor(client) {
				this.client = client;
				this.all = /* @__PURE__ */ Object.create(null);
			}
			get(name, channelOptions) {
				name = String(name);
				let channel = this.all[name];
				if (!channel) this.all[name] = channel = new restchannel_default(this.client, name, channelOptions);
				else if (channelOptions) channel.setOptions(channelOptions);
				return channel;
			}
			release(name) {
				delete this.all[String(name)];
			}
		};
		var BaseRest = class extends baseclient_default {
			constructor(options) {
				super(defaults_default.objectifyOptions(options, false, "BaseRest", logger_default.defaultLogger, { Rest }));
			}
		};
		var allCommonModularPlugins = { Rest };
		var DefaultMessage = class extends message_default {
			static async fromEncoded(encoded, inputOptions) {
				return fromEncoded2(logger_default.defaultLogger, Platform.Crypto, encoded, inputOptions);
			}
			static async fromEncodedArray(encodedArray, options) {
				return fromEncodedArray2(logger_default.defaultLogger, Platform.Crypto, encodedArray, options);
			}
			static fromValues(values) {
				return message_default.fromValues(values);
			}
		};
		var DefaultPresenceMessage = class extends presencemessage_default {
			static async fromEncoded(encoded, inputOptions) {
				return fromEncoded(logger_default.defaultLogger, Platform.Crypto, encoded, inputOptions);
			}
			static async fromEncodedArray(encodedArray, options) {
				return fromEncodedArray(logger_default.defaultLogger, Platform.Crypto, encodedArray, options);
			}
			static fromValues(values) {
				return presencemessage_default.fromValues(values);
			}
		};
		var actions4 = ["annotation.create", "annotation.delete"];
		async function fromEncoded3(logger, encoded, options) {
			return WireAnnotation.fromValues(encoded).decode(options || {}, logger);
		}
		async function fromEncodedArray3(logger, encodedArray, options) {
			return Promise.all(encodedArray.map(function(encoded) {
				return fromEncoded3(logger, encoded, options);
			}));
		}
		async function _fromEncoded3(encoded, channel) {
			return WireAnnotation.fromValues(encoded).decode(channel.channelOptions, channel.logger);
		}
		async function _fromEncodedArray3(encodedArray, channel) {
			return Promise.all(encodedArray.map(function(encoded) {
				return _fromEncoded3(encoded, channel);
			}));
		}
		var Annotation = class _Annotation extends BaseMessage {
			async encode() {
				return encode(Object.assign(new WireAnnotation(), this, { action: actions4.indexOf(this.action || "annotation.create") }), {});
			}
			static fromValues(values) {
				return Object.assign(new _Annotation(), values);
			}
			static fromValuesArray(values) {
				return values.map((v) => _Annotation.fromValues(v));
			}
			toString() {
				return strMsg(this, "Annotation");
			}
		};
		var WireAnnotation = class _WireAnnotation extends BaseMessage {
			toJSON(...args) {
				return wireToJSON.call(this, ...args);
			}
			static fromValues(values) {
				return Object.assign(new _WireAnnotation(), values);
			}
			static fromValuesArray(values) {
				return values.map((v) => _WireAnnotation.fromValues(v));
			}
			async decode(channelOptions, logger) {
				const res = Object.assign(new Annotation(), __spreadProps(__spreadValues({}, this), { action: actions4[this.action] }));
				try {
					await decode(res, channelOptions);
				} catch (e) {
					logger_default.logAction(logger, logger_default.LOG_ERROR, "WireAnnotation.decode()", inspectError(e));
				}
				return res;
			}
			toString() {
				return strMsg(this, "WireAnnotation");
			}
		};
		var annotation_default = Annotation;
		var DefaultAnnotation = class extends annotation_default {
			static async fromEncoded(encoded, inputOptions) {
				return fromEncoded3(logger_default.defaultLogger, encoded, inputOptions);
			}
			static async fromEncodedArray(encodedArray, options) {
				return fromEncodedArray3(logger_default.defaultLogger, encodedArray, options);
			}
			static fromValues(values) {
				return annotation_default.fromValues(values);
			}
		};
		function serialFromMsgOrSerial(msgOrSerial) {
			let messageSerial;
			switch (typeof msgOrSerial) {
				case "string":
					messageSerial = msgOrSerial;
					break;
				case "object":
					messageSerial = msgOrSerial.serial;
					break;
			}
			if (!messageSerial || typeof messageSerial !== "string") throw new ErrorInfo({
				message: "The message argument of annotations.publish()/delete()/get() must be either a Message (or at least an object with a non-empty string `serial` property) or a message serial (non-empty string)",
				code: 40003,
				statusCode: 400,
				remediation: "Pass the Message received from a subscribe callback (which carries .serial), or its serial string. Newly constructed Message objects do not have a serial."
			});
			return messageSerial;
		}
		function constructValidateAnnotation(msgOrSerial, annotationValues) {
			const messageSerial = serialFromMsgOrSerial(msgOrSerial);
			if (!annotationValues || typeof annotationValues !== "object") throw new ErrorInfo({
				message: "Second argument of annotations.publish() must be an object (the intended annotation to publish)",
				code: 40003,
				statusCode: 400,
				remediation: "Pass an Annotation-shaped object as the second argument, e.g. { type: \"reaction:unique.v1\", name: \"👍\" }."
			});
			const annotation = annotation_default.fromValues(annotationValues);
			annotation.messageSerial = messageSerial;
			if (!annotation.action) annotation.action = "annotation.create";
			return annotation;
		}
		function basePathForSerial(channel, serial) {
			return channel.client.rest.channelMixin.basePath(channel) + "/messages/" + encodeURIComponent(serial) + "/annotations";
		}
		var RestAnnotations = class {
			constructor(channel) {
				this.channel = channel;
			}
			async publish(msgOrSerial, annotationValues) {
				const annotation = constructValidateAnnotation(msgOrSerial, annotationValues);
				const wireAnnotation = await annotation.encode();
				const client = this.channel.client, format = client.options.useBinaryProtocol ? "msgpack" : "json", headers = defaults_default.defaultPostHeaders(client.options), params = {};
				mixin(headers, client.options.headers);
				const requestBody = encodeBody([wireAnnotation], client._MsgPack, format);
				await resource_default.post(client, basePathForSerial(this.channel, annotation.messageSerial), requestBody, headers, params, null, true);
			}
			async delete(msgOrSerial, annotationValues) {
				annotationValues.action = "annotation.delete";
				return this.publish(msgOrSerial, annotationValues);
			}
			async get(msgOrSerial, params) {
				const client = this.channel.client, messageSerial = serialFromMsgOrSerial(msgOrSerial), format = client.options.useBinaryProtocol ? "msgpack" : "json", envelope = client.http.supportsLinkHeaders ? void 0 : format, headers = defaults_default.defaultGetHeaders(client.options);
				mixin(headers, client.options.headers);
				return new paginatedresource_default(client, basePathForSerial(this.channel, messageSerial), headers, envelope, async (body, _, unpacked) => {
					return _fromEncodedArray3(unpacked ? body : decodeBody(body, client._MsgPack, format), this.channel);
				}).get(params);
			}
		};
		var restannotations_default = RestAnnotations;
		var serialize2 = encodeBody;
		function toStringArray(array) {
			const result = [];
			if (array) for (let i = 0; i < array.length; i++) result.push(array[i].toString());
			return "[ " + result.join(", ") + " ]";
		}
		function deserialize(serialized, MsgPack, presenceMessagePlugin, annotationsPlugin, objectsPlugin, format) {
			return fromDeserialized(decodeBody(serialized, MsgPack, format), presenceMessagePlugin, annotationsPlugin, objectsPlugin);
		}
		function fromDeserialized(deserialized, presenceMessagePlugin, annotationsPlugin, objectsPlugin) {
			let error;
			if (deserialized.error) error = ErrorInfo.fromValues(deserialized.error);
			let messages;
			if (deserialized.messages) messages = WireMessage.fromValuesArray(deserialized.messages);
			let presence;
			if (presenceMessagePlugin && deserialized.presence) presence = presenceMessagePlugin.WirePresenceMessage.fromValuesArray(deserialized.presence);
			let annotations;
			if (annotationsPlugin && deserialized.annotations) annotations = annotationsPlugin.WireAnnotation.fromValuesArray(deserialized.annotations);
			let state;
			if (objectsPlugin && deserialized.state) state = objectsPlugin.WireObjectMessage.fromValuesArray(deserialized.state, utils_exports, MessageEncoding);
			return Object.assign(new ProtocolMessage(), __spreadProps(__spreadValues({}, deserialized), {
				presence,
				messages,
				annotations,
				state,
				error
			}));
		}
		function makeFromDeserializedWithDependencies(dependencies) {
			return (deserialized) => {
				var _a2;
				return fromDeserialized(deserialized, {
					PresenceMessage: presencemessage_default,
					WirePresenceMessage
				}, {
					Annotation: annotation_default,
					WireAnnotation,
					RealtimeAnnotations: realtimeannotations_default,
					RestAnnotations: restannotations_default
				}, (_a2 = dependencies == null ? void 0 : dependencies.LiveObjectsPlugin) != null ? _a2 : null);
			};
		}
		function fromValues(values) {
			return Object.assign(new ProtocolMessage(), values);
		}
		function stringify(msg, presenceMessagePlugin, annotationsPlugin, objectsPlugin) {
			let result = "[ProtocolMessage";
			if (msg.action !== void 0) result += "; action=" + ActionName[msg.action] || msg.action;
			const simpleAttributes = [
				"id",
				"channel",
				"channelSerial",
				"connectionId",
				"count",
				"msgSerial",
				"timestamp"
			];
			let attribute;
			for (let attribIndex = 0; attribIndex < simpleAttributes.length; attribIndex++) {
				attribute = simpleAttributes[attribIndex];
				if (msg[attribute] !== void 0) result += "; " + attribute + "=" + msg[attribute];
			}
			if (msg.messages) result += "; messages=" + toStringArray(WireMessage.fromValuesArray(msg.messages));
			if (msg.presence && presenceMessagePlugin) result += "; presence=" + toStringArray(presenceMessagePlugin.WirePresenceMessage.fromValuesArray(msg.presence));
			if (msg.annotations && annotationsPlugin) result += "; annotations=" + toStringArray(annotationsPlugin.WireAnnotation.fromValuesArray(msg.annotations));
			if (msg.state && objectsPlugin) result += "; state=" + toStringArray(objectsPlugin.WireObjectMessage.fromValuesArray(msg.state, utils_exports, MessageEncoding));
			if (msg.error) result += "; error=" + ErrorInfo.fromValues(msg.error).toString();
			if (msg.auth && msg.auth.accessToken) result += "; token=" + msg.auth.accessToken;
			if (msg.flags) result += "; flags=" + flagNames.filter(msg.hasFlag).join(",");
			if (msg.params) {
				let stringifiedParams = "";
				forInOwnNonNullProperties(msg.params, function(prop) {
					if (stringifiedParams.length > 0) stringifiedParams += "; ";
					stringifiedParams += prop + "=" + msg.params[prop];
				});
				if (stringifiedParams.length > 0) result += "; params=[" + stringifiedParams + "]";
			}
			result += "]";
			return result;
		}
		var ProtocolMessage = class {
			constructor() {
				this.hasFlag = (flag) => {
					return (this.flags & flags[flag]) > 0;
				};
			}
			setFlag(flag) {
				return this.flags = this.flags | flags[flag];
			}
			getMode() {
				return (this.flags || 0) & flags.MODE_ALL;
			}
			encodeModesToFlags(modes) {
				modes.forEach((mode) => this.setFlag(mode));
			}
			decodeModesFromFlags() {
				const modes = [];
				channelModes.forEach((mode) => {
					if (this.hasFlag(mode)) modes.push(mode);
				});
				return modes.length > 0 ? modes : void 0;
			}
		};
		var protocolmessage_default = ProtocolMessage;
		var ChannelStateChange = class {
			constructor(previous, current, resumed, hasBacklog, reason) {
				this.previous = previous;
				this.current = current;
				if (current === "attached") {
					this.resumed = resumed;
					this.hasBacklog = hasBacklog;
				}
				if (reason) this.reason = reason;
			}
		};
		var channelstatechange_default = ChannelStateChange;
		function validateChannelOptions(options) {
			if (options && "params" in options && !isObject(options.params)) return new ErrorInfo({
				message: "options.params must be an object",
				code: 4e4,
				statusCode: 400,
				remediation: "Pass an object map of channel params (e.g. { rewind: \"1\" }), not a string or array."
			});
			if (options && "modes" in options) {
				if (!Array.isArray(options.modes)) return new ErrorInfo({
					message: "options.modes must be an array",
					code: 4e4,
					statusCode: 400,
					remediation: "Pass an array of ChannelMode strings, e.g. { modes: [\"publish\", \"subscribe\"] }."
				});
				for (let i = 0; i < options.modes.length; i++) {
					const currentMode = options.modes[i];
					if (!currentMode || typeof currentMode !== "string" || !channelModes.includes(String.prototype.toUpperCase.call(currentMode))) return new ErrorInfo({
						message: "Invalid channel mode: " + currentMode,
						code: 4e4,
						statusCode: 400,
						remediation: `Valid ChannelMode values are: ${channelModes.join(", ").toLowerCase()}. The server grants only the modes the key or token capability permits and silently drops the rest on attach. After attach, channel.modes shows what was granted. If you have the Ably CLI installed, \`ably auth keys list\` shows your key's capabilities.`
					});
				}
			}
		}
		var RealtimeChannel = class _RealtimeChannel extends eventemitter_default {
			constructor(client, name, options) {
				var _a2, _b;
				super(client.logger);
				this._annotations = null;
				this._mode = 0;
				this._silentSubscribeWarned = false;
				this.retryCount = 0;
				this.history = function(...args) {
					detectV1Callback(args, 0);
					return this._historyImpl(args[0]);
				};
				this._historyImpl = async function(params) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.history()", "channel = " + this.name);
					const restMixin = this.client.rest.channelMixin;
					if (params && params.untilAttach) {
						if (this.state !== "attached") throw new ErrorInfo({
							message: "option untilAttach requires the channel to be attached, was: " + this.state,
							code: 4e4,
							statusCode: 400,
							remediation: "Await channel.attach() before calling history({ untilAttach: true })."
						});
						if (!this.properties.attachSerial) throw new ErrorInfo({
							message: "untilAttach was specified and channel is attached, but attachSerial is not defined",
							code: 4e4,
							statusCode: 400,
							remediation: "Detach the channel (await channel.detach()) and re-attach (await channel.attach()) so the SDK records the attachSerial from the new attach, then retry history({ untilAttach: true })."
						});
						delete params.untilAttach;
						params.from_serial = this.properties.attachSerial;
					}
					return restMixin.history(this, params);
				};
				this.whenState = (state) => {
					return eventemitter_default.prototype.whenState.call(this, state, this.state);
				};
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel()", "started; name = " + name);
				this.name = name;
				this.channelOptions = normaliseChannelOptions((_a2 = client._Crypto) != null ? _a2 : null, this.logger, options);
				this.client = client;
				this._presence = client._RealtimePresence ? new client._RealtimePresence.RealtimePresence(this) : null;
				if (client._Annotations) this._annotations = new client._Annotations.RealtimeAnnotations(this);
				this.connectionManager = client.connection.connectionManager;
				this.state = "initialized";
				this.subscriptions = new eventemitter_default(this.logger);
				this.syncChannelSerial = void 0;
				this.properties = {
					attachSerial: void 0,
					channelSerial: void 0
				};
				this.setOptions(options);
				this.errorReason = null;
				this._attachResume = false;
				this._decodingContext = {
					channelOptions: this.channelOptions,
					plugins: client.options.plugins || {},
					baseEncodedPreviousPayload: void 0
				};
				this._lastPayload = {
					messageId: null,
					protocolMessageChannelSerial: null,
					decodeFailureRecoveryInProgress: null
				};
				this._attachedReceived = new eventemitter_default(this.logger);
				this.internalStateChanges = new eventemitter_default(this.logger);
				if ((_b = client.options.plugins) == null ? void 0 : _b.Push) this._push = new client.options.plugins.Push.PushChannel(this);
				if (client._liveObjectsPlugin) this._object = new client._liveObjectsPlugin.RealtimeObject(this);
			}
			get presence() {
				if (!this._presence) throwMissingPluginError("RealtimePresence");
				return this._presence;
			}
			get annotations() {
				if (!this._annotations) throwMissingPluginError("Annotations");
				return this._annotations;
			}
			get push() {
				if (!this._push) throwMissingPluginError("Push");
				return this._push;
			}
			/** @spec RTL27 */
			get object() {
				if (!this._object) throwMissingPluginError("LiveObjects");
				return this._object;
			}
			emit(event, ...args) {
				super.emit(event, ...args);
				this.internalStateChanges.emit(event, ...args);
			}
			invalidStateError() {
				return new ErrorInfo({
					message: "Channel operation failed as channel state is " + this.state,
					code: 90001,
					statusCode: 400,
					cause: this.errorReason || void 0,
					remediation: "Inspect channel.errorReason for the underlying cause. It may be null after a clean detach. From \"failed\" or \"detached\", call channel.attach() to recover. From \"suspended\" the SDK re-attaches automatically, or call channel.attach() to retry now."
				});
			}
			static processListenerArgs(args) {
				args = Array.prototype.slice.call(args);
				if (typeof args[0] === "function") args.unshift(null);
				return args;
			}
			async setOptions(options) {
				var _a2;
				const previousChannelOptions = this.channelOptions;
				const err = validateChannelOptions(options);
				if (err) throw err;
				this.channelOptions = normaliseChannelOptions((_a2 = this.client._Crypto) != null ? _a2 : null, this.logger, options);
				if (this._decodingContext) this._decodingContext.channelOptions = this.channelOptions;
				if (this._shouldReattachToSetOptions(options, previousChannelOptions)) {
					this.attachImpl();
					return new Promise((resolve, reject) => {
						const cleanup = () => {
							this._attachedReceived.off(onAttached);
							this.internalStateChanges.off(onFailure);
						};
						const onAttached = () => {
							cleanup();
							resolve();
						};
						const onFailure = (stateChange) => {
							cleanup();
							reject(stateChange.reason);
						};
						this._attachedReceived.once("attached", onAttached);
						this.internalStateChanges.once(["detached", "failed"], onFailure);
					});
				}
			}
			_shouldReattachToSetOptions(options, prevOptions) {
				if (!(this.state === "attached" || this.state === "attaching")) return false;
				if (options == null ? void 0 : options.params) {
					const requestedParams = omitAgent(options.params);
					const existingParams = omitAgent(prevOptions.params);
					if (Object.keys(requestedParams).length !== Object.keys(existingParams).length) return true;
					if (!shallowEquals(existingParams, requestedParams)) return true;
				}
				if (options == null ? void 0 : options.modes) {
					if (!prevOptions.modes || !arrEquals(options.modes, prevOptions.modes)) return true;
				}
				return false;
			}
			publish(...args) {
				detectV1Callback(args, 0);
				return this._publishImpl(args);
			}
			async _publishImpl(args) {
				const first = args[0], second = args[1];
				let messages;
				let params;
				if (typeof first === "string" || first === null || first === void 0) {
					messages = [message_default.fromValues({
						name: first,
						data: second
					})];
					params = args[2];
				} else if (isObject(first)) {
					messages = [message_default.fromValues(first)];
					params = args[1];
				} else if (Array.isArray(first)) {
					messages = message_default.fromValuesArray(first);
					params = args[1];
				} else throw new ErrorInfo({
					message: "The single-argument form of publish() expects a message object or an array of message objects",
					code: 40013,
					statusCode: 400,
					remediation: "Call publish(name, data) for a single event, or publish(message | message[]) with a Message-shaped object."
				});
				const maxMessageSize = this.client.options.maxMessageSize;
				const wireMessages = await encodeArray(messages, this.channelOptions);
				const size = getMessagesSize(wireMessages);
				if (size > maxMessageSize) throw new ErrorInfo({
					message: `Maximum size of messages that can be published at once exceeded (was ${size} bytes, against a limit of ${maxMessageSize} bytes)`,
					code: 40009,
					statusCode: 400,
					remediation: "Split the publish into multiple calls so each batch is under the limit. If a single message exceeds the limit, reduce its payload size. To lift the account limit, contact Ably support."
				});
				this.throwIfUnpublishableState();
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.publish()", "sending message; channel state is " + this.state + ", message count = " + wireMessages.length);
				const pm = fromValues({
					action: actions.MESSAGE,
					channel: this.name,
					messages: wireMessages,
					params: params ? stringifyValues(params) : void 0
				});
				return this.sendAndAwaitAck(pm);
			}
			throwIfUnpublishableState() {
				if (!this.connectionManager.activeState()) throw this.connectionManager.getError();
				if (this.state === "failed" || this.state === "suspended") throw this.invalidStateError();
			}
			onEvent(messages) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.onEvent()", "received message");
				const subscriptions = this.subscriptions;
				for (let i = 0; i < messages.length; i++) {
					const message = messages[i];
					subscriptions.emit(message.name, message);
				}
			}
			async attach() {
				if (this.state === "attached") return null;
				return new Promise((resolve, reject) => {
					this._attach(false, null, (err, result) => err ? reject(err) : resolve(result));
				});
			}
			_attach(forceReattach, attachReason, callback) {
				if (!callback) callback = (err) => {
					if (err) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "RealtimeChannel._attach()", "Channel attach failed: " + err.toString());
				};
				const connectionManager = this.connectionManager;
				if (!connectionManager.activeState()) {
					callback(connectionManager.getError());
					return;
				}
				if (this.state !== "attaching" || forceReattach) this.requestState("attaching", attachReason);
				this.internalStateChanges.once(function(stateChange) {
					switch (this.event) {
						case "attached":
							callback?.(null, stateChange);
							break;
						case "detached":
						case "suspended":
						case "failed":
							callback?.(stateChange.reason || connectionManager.getError() || new ErrorInfo("Unable to attach; reason unknown; state = " + this.event, 9e4, 500));
							break;
						case "detaching":
							callback?.(new ErrorInfo("Attach request superseded by a subsequent detach request", 9e4, 409));
							break;
					}
				});
			}
			attachImpl() {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.attachImpl()", "sending ATTACH message");
				const attachMsg = fromValues({
					action: actions.ATTACH,
					channel: this.name,
					params: this.channelOptions.params,
					channelSerial: this.properties.channelSerial
				});
				if (this.channelOptions.modes) attachMsg.encodeModesToFlags(allToUpperCase(this.channelOptions.modes));
				if (this._attachResume) attachMsg.setFlag("ATTACH_RESUME");
				if (this._lastPayload.decodeFailureRecoveryInProgress) attachMsg.channelSerial = this._lastPayload.protocolMessageChannelSerial;
				this.send(attachMsg);
			}
			async detach() {
				const connectionManager = this.connectionManager;
				switch (this.state) {
					case "suspended":
						this.notifyState("detached");
						return;
					case "detached": return;
					case "failed": throw new ErrorInfo({
						message: "Unable to detach as channel state is failed",
						code: 90001,
						statusCode: 400,
						remediation: "A failed channel is not attached, so there is nothing to detach. Inspect channel.errorReason for the cause. Call channel.attach() to recover the channel, or channels.release(name) to discard it."
					});
					default:
						if (connectionManager.state.state !== "connected") {
							this.notifyState("detached");
							return;
						}
						this.requestState("detaching");
					case "detaching": return new Promise((resolve, reject) => {
						this.internalStateChanges.once(function(stateChange) {
							switch (this.event) {
								case "detached":
									resolve();
									break;
								case "attached":
								case "suspended":
								case "failed":
									reject(stateChange.reason || connectionManager.getError() || new ErrorInfo("Unable to detach; reason unknown; state = " + this.event, 9e4, 500));
									break;
								case "attaching":
									reject(new ErrorInfo("Detach request superseded by a subsequent attach request", 9e4, 409));
									break;
							}
						});
					});
				}
			}
			detachImpl() {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.detach()", "sending DETACH message");
				const msg = fromValues({
					action: actions.DETACH,
					channel: this.name
				});
				this.send(msg);
			}
			subscribe(...args) {
				detectV1Callback(args, 2);
				return this._subscribeImpl(args);
			}
			async _subscribeImpl(args) {
				const [event, listener] = _RealtimeChannel.processListenerArgs(args);
				if (this.state === "failed") throw ErrorInfo.fromValues(this.invalidStateError());
				if (event && typeof event === "object" && !Array.isArray(event)) this.client._FilteredSubscriptions.subscribeFilter(this, event, listener);
				else this.subscriptions.on(event, listener);
				let stateChange = null;
				if (this.channelOptions.attachOnSubscribe !== false) stateChange = await this.attach();
				if (this.state === "attached" && (this._mode & flags.SUBSCRIBE) === 0) {
					const err = new ErrorInfo({
						message: "The channel was attached without the subscribe mode, so the server will not deliver messages to this listener.",
						code: 90009,
						statusCode: 400,
						remediation: "Include \"subscribe\" in the channel modes: realtime.channels.get(name, { modes: [\"subscribe\", ...] }), or call channel.setOptions({ modes: [...] }) on an existing channel to trigger a reattach. Alternatively, omit modes entirely and ensure your token/API-key capability permits subscribe on this channel. If you have the Ably CLI installed, `ably auth keys list` shows your key's capabilities."
					});
					if (this.client.options.strictMode === true) throw err;
					if (!this._silentSubscribeWarned) {
						logger_default.logActionNoStrip(this.logger, logger_default.LOG_ERROR, "RealtimeChannel.subscribe()", err.message + "; remediation=" + err.remediation + logger_default.silentFailureLogSuffix());
						this._silentSubscribeWarned = true;
					}
				}
				return stateChange;
			}
			unsubscribe(...args) {
				var _a2;
				const [event, listener] = _RealtimeChannel.processListenerArgs(args);
				if (typeof event === "object" && !listener || ((_a2 = this.filteredSubscriptions) == null ? void 0 : _a2.has(listener))) {
					this.client._FilteredSubscriptions.getAndDeleteFilteredSubscriptions(this, event, listener).forEach((l) => this.subscriptions.off(l));
					return;
				}
				this.subscriptions.off(event, listener);
			}
			sync() {
				switch (this.state) {
					case "initialized":
					case "detaching":
					case "detached": throw new PartialErrorInfo({
						message: "Unable to sync to channel; not attached",
						code: 4e4
					});
					default:
				}
				const connectionManager = this.connectionManager;
				if (!connectionManager.activeState()) throw connectionManager.getError();
				const syncMessage = fromValues({
					action: actions.SYNC,
					channel: this.name
				});
				if (this.syncChannelSerial) syncMessage.channelSerial = this.syncChannelSerial;
				connectionManager.send(syncMessage);
			}
			send(msg) {
				this.connectionManager.send(msg);
			}
			async sendAndAwaitAck(msg) {
				return new Promise((resolve, reject) => {
					this.connectionManager.send(msg, this.client.options.queueMessages, (err, publishResponse) => {
						if (err) reject(err);
						else resolve(publishResponse);
					});
				});
			}
			async sendPresence(presence) {
				const msg = fromValues({
					action: actions.PRESENCE,
					channel: this.name,
					presence
				});
				await this.sendAndAwaitAck(msg);
			}
			/**
			* RTL3d: when the connection becomes CONNECTED, presence messages waiting on
			* the connection-wide queue are moved onto this channel's presence queue, so
			* they are only sent once the channel has (re-)attached (RTP5b) rather than
			* flushed immediately. Returns true if the channel will (re-)attach and the
			* messages were re-queued.
			*/
			requeuePresenceFromConnectionQueue(pendingMessage) {
				var _a2;
				if (this._presence && (this.state === "attached" || this.state === "attaching" || this.state === "suspended")) {
					const callback = pendingMessage.callback;
					this._presence.requeuePresenceMessages((_a2 = pendingMessage.message.presence) != null ? _a2 : [], (err) => callback == null ? void 0 : callback(err));
					return true;
				}
				return false;
			}
			async sendState(objectMessages) {
				const msg = fromValues({
					action: actions.OBJECT,
					channel: this.name,
					state: objectMessages
				});
				return this.sendAndAwaitAck(msg);
			}
			async processMessage(message) {
				if (message.action === actions.ATTACHED || message.action === actions.MESSAGE || message.action === actions.PRESENCE || message.action === actions.OBJECT || message.action === actions.ANNOTATION) this.setChannelSerial(message.channelSerial);
				let syncChannelSerial, isSync = false;
				switch (message.action) {
					case actions.ATTACHED: {
						this.properties.attachSerial = message.channelSerial;
						this._mode = message.getMode();
						this._silentSubscribeWarned = false;
						this.params = message.params || {};
						const modesFromFlags = message.decodeModesFromFlags();
						this.modes = modesFromFlags && allToLowerCase(modesFromFlags) || void 0;
						const resumed = message.hasFlag("RESUMED");
						const hasPresence = message.hasFlag("HAS_PRESENCE");
						const hasBacklog = message.hasFlag("HAS_BACKLOG");
						const hasObjects = message.hasFlag("HAS_OBJECTS");
						this._attachedReceived.emit("attached");
						if (this.state === "attached") {
							if (!resumed) {
								if (this._presence) this._presence.onAttached(hasPresence);
							}
							if (this._object) this._object.onAttached(hasObjects);
							const change = new channelstatechange_default(this.state, this.state, resumed, hasBacklog, message.error);
							if (!resumed || this.channelOptions.updateOnAttached) this.emit("update", change);
						} else if (this.state === "detaching") this.checkPendingState();
						else this.notifyState("attached", message.error, resumed, hasPresence, hasBacklog, hasObjects);
						break;
					}
					case actions.DETACHED: {
						const detachErr = message.error ? ErrorInfo.fromValues(message.error) : new ErrorInfo("Channel detached", 90001, 404);
						if (this.state === "detaching") this.notifyState("detached", detachErr);
						else if (this.state === "attaching") this.notifyState("suspended", detachErr);
						else if (this.state === "attached" || this.state === "suspended") this.requestState("attaching", detachErr);
						break;
					}
					case actions.SYNC:
						isSync = true;
						syncChannelSerial = this.syncChannelSerial = message.channelSerial;
						if (!message.presence) break;
					case actions.PRESENCE: {
						if (!message.presence) break;
						populateFieldsFromParent(message);
						const options = this.channelOptions;
						if (this._presence) {
							const presenceMessages = await Promise.all(message.presence.map((wpm) => {
								return wpm.decode(options, this.logger);
							}));
							this._presence.setPresence(presenceMessages, isSync, syncChannelSerial);
						}
						break;
					}
					case actions.OBJECT:
					case actions.OBJECT_SYNC: {
						if (!this._object || !message.state) return;
						populateFieldsFromParent(message);
						const format = this.client.connection.connectionManager.getActiveTransportFormat();
						const objectMessages = message.state.map((om) => om.decode(this.client, format));
						if (message.action === actions.OBJECT) this._object.handleObjectMessages(objectMessages);
						else this._object.handleObjectSyncMessages(objectMessages, message.channelSerial);
						break;
					}
					case actions.MESSAGE: {
						if (this.state !== "attached") {
							logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "RealtimeChannel.processMessage()", "Message \"" + message.id + "\" skipped as this channel \"" + this.name + "\" state is not \"attached\" (state is \"" + this.state + "\").");
							return;
						}
						populateFieldsFromParent(message);
						const encoded = message.messages, firstMessage = encoded[0], lastMessage = encoded[encoded.length - 1];
						if (firstMessage.extras && firstMessage.extras.delta && firstMessage.extras.delta.from !== this._lastPayload.messageId) {
							const msg = "Delta message decode failure - previous message not available for message \"" + message.id + "\" on this channel \"" + this.name + "\".";
							logger_default.logAction(this.logger, logger_default.LOG_ERROR, "RealtimeChannel.processMessage()", msg);
							this._startDecodeFailureRecovery(new ErrorInfo(msg, 40018, 400));
							break;
						}
						let messages = [];
						for (let i = 0; i < encoded.length; i++) {
							const { decoded, err } = await encoded[i].decodeWithErr(this._decodingContext, this.logger);
							messages[i] = decoded;
							if (err) switch (err.code) {
								case 40018:
									this._startDecodeFailureRecovery(err);
									return;
								case 40019:
								case 40021:
									this.notifyState("failed", err);
									return;
								default:
							}
						}
						this._lastPayload.messageId = lastMessage.id;
						this._lastPayload.protocolMessageChannelSerial = message.channelSerial;
						this.onEvent(messages);
						break;
					}
					case actions.ANNOTATION: {
						populateFieldsFromParent(message);
						const options = this.channelOptions;
						if (this._annotations) {
							const annotations = await Promise.all((message.annotations || []).map((wpm) => {
								return wpm.decode(options, this.logger);
							}));
							this._annotations._processIncoming(annotations);
						}
						break;
					}
					case actions.ERROR: {
						const err = message.error;
						if (err && err.code == 80016) this.checkPendingState();
						else this.notifyState("failed", ErrorInfo.fromValues(err));
						break;
					}
					default: logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "RealtimeChannel.processMessage()", "Protocol error: unrecognised message action (" + message.action + ")");
				}
			}
			_startDecodeFailureRecovery(reason) {
				if (!this._lastPayload.decodeFailureRecoveryInProgress) {
					logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "RealtimeChannel.processMessage()", "Starting decode failure recovery process.");
					this._lastPayload.decodeFailureRecoveryInProgress = true;
					this._attach(true, reason, () => {
						this._lastPayload.decodeFailureRecoveryInProgress = false;
					});
				}
			}
			onAttached() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel.onAttached", "activating channel; name = " + this.name);
			}
			notifyState(state, reason, resumed, hasPresence, hasBacklog, hasObjects) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.notifyState", "name = " + this.name + ", current state = " + this.state + ", notifying state " + state);
				this.clearStateTimer();
				if ([
					"detached",
					"suspended",
					"failed"
				].includes(state)) this.properties.channelSerial = null;
				if (state === this.state) return;
				if (this._presence) this._presence.actOnChannelState(state, hasPresence, reason);
				if (this._object) this._object.actOnChannelState(state, hasObjects);
				if (state === "suspended" && this.connectionManager.state.sendEvents) this.startRetryTimer();
				else this.cancelRetryTimer();
				if (reason) this.errorReason = reason;
				const change = new channelstatechange_default(this.state, state, resumed, hasBacklog, reason);
				const action = "Channel state for channel \"" + this.name + "\"";
				const message = state + (reason ? "; reason: " + reason : "");
				if (state === "failed") logger_default.logAction(this.logger, logger_default.LOG_ERROR, action, message);
				else logger_default.logAction(this.logger, logger_default.LOG_MAJOR, action, message);
				if (state !== "attaching" && state !== "suspended") this.retryCount = 0;
				if (state === "attached") this.onAttached();
				if (state === "attached") this._attachResume = true;
				else if (state === "detaching" || state === "failed") this._attachResume = false;
				this.state = state;
				this.emit(state, change);
			}
			requestState(state, reason) {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel.requestState", "name = " + this.name + ", state = " + state);
				this.notifyState(state, reason);
				this.checkPendingState();
			}
			checkPendingState() {
				if (!this.connectionManager.state.sendEvents) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel.checkPendingState", "sendEvents is false; state is " + this.connectionManager.state.state);
					return;
				}
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel.checkPendingState", "name = " + this.name + ", state = " + this.state);
				switch (this.state) {
					case "attaching":
						this.startStateTimerIfNotRunning();
						this.attachImpl();
						break;
					case "detaching":
						this.startStateTimerIfNotRunning();
						this.detachImpl();
						break;
					case "attached":
						this.sync();
						break;
					default: break;
				}
			}
			timeoutPendingState() {
				switch (this.state) {
					case "attaching": {
						const err = new ErrorInfo({
							message: "Channel attach timed out",
							code: 90007,
							statusCode: 408,
							remediation: "The channel is now suspended. The SDK retries the attach automatically while the connection is connected, and you can call channel.attach() to retry immediately. Inspect channel.errorReason if it keeps timing out."
						});
						this.notifyState("suspended", err);
						break;
					}
					case "detaching": {
						const err = new ErrorInfo({
							message: "Channel detach timed out",
							code: 90007,
							statusCode: 408,
							remediation: "The detach timed out and the channel is back in the attached state. Call channel.detach() again to retry. Inspect channel.errorReason if it keeps timing out."
						});
						this.notifyState("attached", err);
						break;
					}
					default:
						this.checkPendingState();
						break;
				}
			}
			startStateTimerIfNotRunning() {
				if (!this.stateTimer) this.stateTimer = Platform.Config.setTimeout(() => {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel.startStateTimerIfNotRunning", "timer expired");
					this.stateTimer = null;
					this.timeoutPendingState();
				}, this.client.options.timeouts.realtimeRequestTimeout);
			}
			clearStateTimer() {
				const stateTimer = this.stateTimer;
				if (stateTimer) {
					Platform.Config.clearTimeout(stateTimer);
					this.stateTimer = null;
				}
			}
			startRetryTimer() {
				if (this.retryTimer) return;
				this.retryCount++;
				const retryDelay = getRetryTime(this.client.options.timeouts.channelRetryTimeout, this.retryCount);
				this.retryTimer = Platform.Config.setTimeout(() => {
					if (this.state === "suspended" && this.connectionManager.state.sendEvents) {
						this.retryTimer = null;
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel retry timer expired", "attempting a new attach");
						this.requestState("attaching");
					}
				}, retryDelay);
			}
			cancelRetryTimer() {
				if (this.retryTimer) {
					Platform.Config.clearTimeout(this.retryTimer);
					this.retryTimer = null;
				}
			}
			getReleaseErr() {
				const s = this.state;
				if (s === "initialized" || s === "detached" || s === "failed") return null;
				return new ErrorInfo({
					message: "Can only release a channel in a state where there is no possibility of further updates from the server being received (initialized, detached, or failed). The current state is " + s,
					code: 90001,
					statusCode: 400,
					remediation: "Call channel.detach() and wait for the channel to reach \"detached\" before calling channels.release(name)."
				});
			}
			setChannelSerial(channelSerial) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.setChannelSerial()", "Updating channel serial; serial = " + channelSerial + "; previous = " + this.properties.channelSerial);
				if (channelSerial) this.properties.channelSerial = channelSerial;
			}
			async status() {
				return this.client.rest.channelMixin.status(this);
			}
			async getMessage(serialOrMessage) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.getMessage()", "channel = " + this.name);
				return this.client.rest.channelMixin.getMessage(this, serialOrMessage);
			}
			async updateMessage(message, operation, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.updateMessage()", "channel = " + this.name);
				return this.sendUpdate(message, "message.update", operation, params);
			}
			async deleteMessage(message, operation, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.deleteMessage()", "channel = " + this.name);
				return this.sendUpdate(message, "message.delete", operation, params);
			}
			async appendMessage(message, operation, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.appendMessage()", "channel = " + this.name);
				return this.sendUpdate(message, "message.append", operation, params);
			}
			async sendUpdate(message, action, operation, params) {
				var _a2;
				if (!message.serial) throw new ErrorInfo({
					message: "This message lacks a serial",
					code: 40003,
					statusCode: 400,
					remediation: "Pass the Message received from a subscribe callback (which carries .serial), not a freshly constructed object."
				});
				this.throwIfUnpublishableState();
				const wireMessage = await message_default.fromValues(__spreadProps(__spreadValues({}, message), {
					action,
					version: operation
				})).encode(this.channelOptions);
				const pm = fromValues({
					action: actions.MESSAGE,
					channel: this.name,
					messages: [wireMessage],
					params: params ? stringifyValues(params) : void 0
				});
				return { versionSerial: (_a2 = (await this.sendAndAwaitAck(pm)).serials[0]) != null ? _a2 : null };
			}
			async getMessageVersions(serialOrMessage, params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeChannel.getMessageVersions()", "channel = " + this.name);
				return this.client.rest.channelMixin.getMessageVersions(this, serialOrMessage, params);
			}
			/**
			* Ensures the channel is attached, attaching if necessary.
			*
			* This method is intended for use by features like Presence or Objects that need to
			* implicitly attach the channel when an operation is called (e.g., `presence.get()` per RTP11b,
			* or `objects.get()`). This guarantees that the corresponding sync sequence will start and
			* that the operation will resolve for callers even if they did not explicitly attach beforehand.
			*/
			async ensureAttached() {
				switch (this.state) {
					case "attached":
					case "suspended": break;
					case "initialized":
					case "detached":
					case "detaching":
					case "attaching":
						await this.attach();
						break;
					default: throw ErrorInfo.fromValues(this.invalidStateError());
				}
			}
		};
		function omitAgent(channelParams) {
			const _a2 = channelParams || {}, { agent: _ } = _a2;
			return __objRest(_a2, ["agent"]);
		}
		var realtimechannel_default = RealtimeChannel;
		var RealtimeAnnotations = class {
			constructor(channel) {
				this.channel = channel;
				this.logger = channel.logger;
				this.subscriptions = new eventemitter_default(this.logger);
			}
			async publish(msgOrSerial, annotationValues) {
				const channelName = this.channel.name;
				const annotation = constructValidateAnnotation(msgOrSerial, annotationValues);
				const wireAnnotation = await annotation.encode();
				this.channel.throwIfUnpublishableState();
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimeAnnotations.publish()", "channelName = " + channelName + ", sending annotation with messageSerial = " + annotation.messageSerial + ", type = " + annotation.type);
				const pm = fromValues({
					action: actions.ANNOTATION,
					channel: channelName,
					annotations: [wireAnnotation]
				});
				await this.channel.sendAndAwaitAck(pm);
			}
			async delete(msgOrSerial, annotationValues) {
				annotationValues.action = "annotation.delete";
				await this.publish(msgOrSerial, annotationValues);
			}
			async subscribe(..._args) {
				const args = realtimechannel_default.processListenerArgs(_args);
				const event = args[0];
				const listener = args[1];
				const channel = this.channel;
				if (channel.state === "failed") throw ErrorInfo.fromValues(channel.invalidStateError());
				this.subscriptions.on(event, listener);
				if (this.channel.channelOptions.attachOnSubscribe !== false) await channel.attach();
				if (this.channel.state === "attached" && (this.channel._mode & flags.ANNOTATION_SUBSCRIBE) === 0) {
					const err = new ErrorInfo({
						message: "You are trying to add an annotation listener, but you haven't requested the annotation_subscribe channel mode in ChannelOptions, so this won't do anything (we only deliver annotations to clients who have explicitly requested them)",
						code: 93001,
						statusCode: 400,
						remediation: "Include \"annotation_subscribe\" in the channel modes: realtime.channels.get(name, { modes: [\"annotation_subscribe\", ...] }), or call channel.setOptions({ modes: [...] }) on an existing channel to trigger a reattach. Calling channels.get(name, { modes }) on an existing channel throws. The server only grants the mode if your key or token has the annotation-subscribe capability. Without it the attach succeeds but the server silently drops the mode and annotations are never delivered. `ably auth keys list` shows your key's capabilities."
					});
					logger_default.logActionNoStrip(this.logger, logger_default.LOG_MAJOR, "RealtimeAnnotations.subscribe()", err.message + "; remediation=" + err.remediation);
					throw err;
				}
			}
			unsubscribe(..._args) {
				const args = realtimechannel_default.processListenerArgs(_args);
				const event = args[0];
				const listener = args[1];
				this.subscriptions.off(event, listener);
			}
			_processIncoming(annotations) {
				for (const annotation of annotations) this.subscriptions.emit(annotation.type || "", annotation);
			}
			async get(msgOrSerial, params) {
				return restannotations_default.prototype.get.call(this, msgOrSerial, params);
			}
		};
		var realtimeannotations_default = RealtimeAnnotations;
		var _DefaultRest = class _DefaultRest extends BaseRest {
			constructor(options) {
				var _a2, _b;
				if (!_DefaultRest._MsgPack) throw new Error("Expected DefaultRest._MsgPack to have been set");
				super(defaults_default.objectifyOptions(options, true, "Rest", logger_default.defaultLogger, __spreadProps(__spreadValues({}, allCommonModularPlugins), {
					Crypto: (_a2 = _DefaultRest.Crypto) != null ? _a2 : void 0,
					MsgPack: (_b = _DefaultRest._MsgPack) != null ? _b : void 0,
					Annotations: {
						Annotation: annotation_default,
						WireAnnotation,
						RealtimeAnnotations: realtimeannotations_default,
						RestAnnotations: restannotations_default
					}
				})));
			}
			static get Crypto() {
				if (this._Crypto === null) throw new Error("Encryption not enabled; use ably.encryption.js instead");
				return this._Crypto;
			}
			static set Crypto(newValue) {
				this._Crypto = newValue;
			}
		};
		_DefaultRest._Crypto = null;
		_DefaultRest.Message = DefaultMessage;
		_DefaultRest.PresenceMessage = DefaultPresenceMessage;
		_DefaultRest.Annotation = DefaultAnnotation;
		_DefaultRest._MsgPack = null;
		_DefaultRest._Http = Http;
		var DefaultRest = _DefaultRest;
		var MessageQueue = class extends eventemitter_default {
			constructor(logger) {
				super(logger);
				this.messages = [];
			}
			count() {
				return this.messages.length;
			}
			push(message) {
				this.messages.push(message);
			}
			shift() {
				return this.messages.shift();
			}
			last() {
				return this.messages[this.messages.length - 1];
			}
			copyAll() {
				return this.messages.slice();
			}
			append(messages) {
				this.messages.push.apply(this.messages, messages);
			}
			prepend(messages) {
				this.messages.unshift.apply(this.messages, messages);
			}
			/**
			* For all messages targeted by the selector, calls their callback and removes them from the queue.
			*
			* @param selector - Describes which messages to target. 'all' means all messages in the queue (regardless of whether they have had a `msgSerial` assigned); `serial` / `count` targets a range of messages described by an `ACK` or `NACK` received from Ably (this assumes that all the messages in the queue have had a `msgSerial` assigned).
			*/
			completeMessages(selector, err, res) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "MessageQueue.completeMessages()", selector == "all" ? "(all)" : "serial = " + selector.serial + "; count = " + selector.count);
				err = err || null;
				const messages = this.messages;
				if (messages.length === 0) throw new Error("MessageQueue.completeMessages(): completeMessages called on any empty MessageQueue");
				let completeMessages = [];
				if (selector === "all") completeMessages = messages.splice(0);
				else {
					const first = messages[0];
					if (first) {
						const startSerial = first.message.msgSerial;
						const endSerial = selector.serial + selector.count;
						if (endSerial > startSerial) completeMessages = messages.splice(0, endSerial - startSerial);
					}
				}
				for (let i = 0; i < completeMessages.length; i++) {
					const message = completeMessages[i];
					const publishResponse = res == null ? void 0 : res[i];
					message.callback(err, publishResponse);
				}
				if (messages.length == 0) this.emit("idle");
			}
			completeAllMessages(err) {
				this.completeMessages("all", err);
			}
			resetSendAttempted() {
				for (let msg of this.messages) msg.sendAttempted = false;
			}
			clear() {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "MessageQueue.clear()", "clearing " + this.messages.length + " messages");
				this.messages = [];
				this.emit("idle");
			}
		};
		var messagequeue_default = MessageQueue;
		var PendingMessage = class {
			constructor(message, callback) {
				this.message = message;
				this.callback = callback;
				this.merged = false;
				const action = message.action;
				this.sendAttempted = false;
				this.ackRequired = typeof action === "number" && [
					actions.MESSAGE,
					actions.PRESENCE,
					actions.ANNOTATION,
					actions.OBJECT
				].includes(action);
			}
		};
		var Protocol = class extends eventemitter_default {
			constructor(transport) {
				super(transport.logger);
				this.transport = transport;
				this.messageQueue = new messagequeue_default(this.logger);
				transport.on("ack", (serial, count, res) => {
					this.onAck(serial, count, res);
				});
				transport.on("nack", (serial, count, err) => {
					this.onNack(serial, count, err);
				});
			}
			onAck(serial, count, res) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Protocol.onAck()", "serial = " + serial + "; count = " + count);
				this.messageQueue.completeMessages({
					serial,
					count
				}, null, res);
			}
			onNack(serial, count, err) {
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Protocol.onNack()", "serial = " + serial + "; count = " + count + "; err = " + inspectError(err));
				if (!err) err = new ErrorInfo("Unable to send message; channel not responding", 50001, 500);
				this.messageQueue.completeMessages({
					serial,
					count
				}, err);
			}
			onceIdle(listener) {
				const messageQueue = this.messageQueue;
				if (messageQueue.count() === 0) {
					listener();
					return;
				}
				messageQueue.once("idle", listener);
			}
			send(pendingMessage) {
				if (pendingMessage.ackRequired) this.messageQueue.push(pendingMessage);
				if (this.logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logActionNoStrip(this.logger, logger_default.LOG_MICRO, "Protocol.send()", "sending msg; " + stringify(pendingMessage.message, this.transport.connectionManager.realtime._RealtimePresence, this.transport.connectionManager.realtime._Annotations, this.transport.connectionManager.realtime._liveObjectsPlugin));
				pendingMessage.sendAttempted = true;
				this.transport.send(pendingMessage.message);
			}
			getTransport() {
				return this.transport;
			}
			getPendingMessages() {
				return this.messageQueue.copyAll();
			}
			clearPendingMessages() {
				return this.messageQueue.clear();
			}
			finish() {
				const transport = this.transport;
				this.onceIdle(function() {
					transport.disconnect();
				});
			}
		};
		var protocol_default = Protocol;
		var ConnectionStateChange = class {
			constructor(previous, current, retryIn, reason) {
				this.previous = previous;
				this.current = current;
				if (retryIn) this.retryIn = retryIn;
				if (reason) this.reason = reason;
			}
		};
		var connectionstatechange_default = ConnectionStateChange;
		var ConnectionErrorCodes = {
			DISCONNECTED: 80003,
			SUSPENDED: 80002,
			FAILED: 8e4,
			CLOSING: 80017,
			CLOSED: 80017,
			UNKNOWN_CONNECTION_ERR: 50002,
			UNKNOWN_CHANNEL_ERR: 50001
		};
		var ConnectionErrors = {
			disconnected: () => ErrorInfo.fromValues({
				statusCode: 400,
				code: ConnectionErrorCodes.DISCONNECTED,
				message: "Connection to server temporarily unavailable"
			}),
			suspended: () => ErrorInfo.fromValues({
				statusCode: 400,
				code: ConnectionErrorCodes.SUSPENDED,
				message: "Connection to server unavailable"
			}),
			failed: () => ErrorInfo.fromValues({
				statusCode: 400,
				code: ConnectionErrorCodes.FAILED,
				message: "Connection failed or disconnected by server"
			}),
			closing: () => ErrorInfo.fromValues({
				statusCode: 400,
				code: ConnectionErrorCodes.CLOSING,
				message: "Connection closing"
			}),
			closed: () => ErrorInfo.fromValues({
				statusCode: 400,
				code: ConnectionErrorCodes.CLOSED,
				message: "Connection closed"
			}),
			unknownConnectionErr: () => ErrorInfo.fromValues({
				statusCode: 500,
				code: ConnectionErrorCodes.UNKNOWN_CONNECTION_ERR,
				message: "Internal connection error"
			}),
			unknownChannelErr: () => ErrorInfo.fromValues({
				statusCode: 500,
				code: ConnectionErrorCodes.UNKNOWN_CONNECTION_ERR,
				message: "Internal channel error"
			})
		};
		function isRetriable(err) {
			if (!err.statusCode || !err.code || err.statusCode >= 500) return true;
			return Object.values(ConnectionErrorCodes).includes(err.code);
		}
		var connectionerrors_default = ConnectionErrors;
		var closeMessage = fromValues({ action: actions.CLOSE });
		var disconnectMessage = fromValues({ action: actions.DISCONNECT });
		var Transport = class extends eventemitter_default {
			constructor(connectionManager, auth, params, forceJsonProtocol) {
				super(connectionManager.logger);
				if (forceJsonProtocol) {
					params.format = void 0;
					params.heartbeats = true;
				}
				this.connectionManager = connectionManager;
				this.auth = auth;
				this.params = params;
				this.timeouts = params.options.timeouts;
				this.format = params.format;
				this.isConnected = false;
				this.isFinished = false;
				this.isDisposed = false;
				this.maxIdleInterval = null;
				this.idleTimer = null;
				this.lastActivity = null;
			}
			connect() {}
			close() {
				if (this.isConnected) this.requestClose();
				this.finish("closed", connectionerrors_default.closed());
			}
			disconnect(err) {
				if (this.isConnected) this.requestDisconnect();
				this.finish("disconnected", err || connectionerrors_default.disconnected());
			}
			fail(err) {
				if (this.isConnected) this.requestDisconnect();
				this.finish("failed", err || connectionerrors_default.failed());
			}
			finish(event, err) {
				var _a2;
				if (this.isFinished) return;
				this.isFinished = true;
				this.isConnected = false;
				this.maxIdleInterval = null;
				Platform.Config.clearTimeout((_a2 = this.idleTimer) != null ? _a2 : void 0);
				this.idleTimer = null;
				this.emit(event, err);
				this.dispose();
			}
			onProtocolMessage(message) {
				if (this.logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logActionNoStrip(this.logger, logger_default.LOG_MICRO, "Transport.onProtocolMessage()", "received on " + this.shortName + ": " + stringify(message, this.connectionManager.realtime._RealtimePresence, this.connectionManager.realtime._Annotations, this.connectionManager.realtime._liveObjectsPlugin) + "; connectionId = " + this.connectionManager.connectionId);
				this.onActivity();
				switch (message.action) {
					case actions.HEARTBEAT:
						logger_default.logActionNoStrip(this.logger, logger_default.LOG_MICRO, "Transport.onProtocolMessage()", this.shortName + " heartbeat; connectionId = " + this.connectionManager.connectionId);
						this.emit("heartbeat", message.id);
						break;
					case actions.CONNECTED:
						this.onConnect(message);
						this.emit("connected", message.error, message.connectionId, message.connectionDetails, message);
						break;
					case actions.CLOSED:
						this.onClose(message);
						break;
					case actions.DISCONNECTED:
						this.onDisconnect(message);
						break;
					case actions.ACK:
						this.emit("ack", message.msgSerial, message.count, message.res);
						break;
					case actions.NACK:
						this.emit("nack", message.msgSerial, message.count, message.error);
						break;
					case actions.SYNC:
						this.connectionManager.onChannelMessage(message, this);
						break;
					case actions.ACTIVATE: break;
					case actions.AUTH:
						whenPromiseSettles(this.auth.authorize(), (err) => {
							if (err) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Transport.onProtocolMessage()", "Ably requested re-authentication, but unable to obtain a new token: " + inspectError(err));
						});
						break;
					case actions.ERROR:
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.onProtocolMessage()", "received error action; connectionId = " + this.connectionManager.connectionId + "; err = " + Platform.Config.inspect(message.error) + (message.channel ? ", channel: " + message.channel : ""));
						if (message.channel === void 0) {
							this.onFatalError(message);
							break;
						}
						this.connectionManager.onChannelMessage(message, this);
						break;
					default: this.connectionManager.onChannelMessage(message, this);
				}
			}
			onConnect(message) {
				this.isConnected = true;
				if (!message.connectionDetails) throw new Error("Transport.onConnect(): Connect message recieved without connectionDetails");
				const maxPromisedIdle = message.connectionDetails.maxIdleInterval;
				if (maxPromisedIdle) {
					this.maxIdleInterval = maxPromisedIdle + this.timeouts.realtimeRequestTimeout;
					this.onActivity();
				}
			}
			onDisconnect(message) {
				const err = message && message.error;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.onDisconnect()", "err = " + inspectError(err));
				this.finish("disconnected", err);
			}
			onFatalError(message) {
				const err = message && message.error;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.onFatalError()", "err = " + inspectError(err));
				this.finish("failed", err);
			}
			onClose(message) {
				const err = message && message.error;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.onClose()", "err = " + inspectError(err));
				this.finish("closed", err);
			}
			requestClose() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.requestClose()", "");
				this.send(closeMessage);
			}
			requestDisconnect() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.requestDisconnect()", "");
				this.send(disconnectMessage);
			}
			ping(id) {
				const msg = { action: actions.HEARTBEAT };
				if (id) msg.id = id;
				this.send(fromValues(msg));
			}
			dispose() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Transport.dispose()", "");
				this.isDisposed = true;
				this.off();
			}
			onActivity() {
				if (!this.maxIdleInterval) return;
				this.lastActivity = this.connectionManager.lastActivity = Platform.Config.now();
				this.setIdleTimer(this.maxIdleInterval + 100);
			}
			setIdleTimer(timeout) {
				if (!this.idleTimer) this.idleTimer = Platform.Config.setTimeout(() => {
					this.onIdleTimerExpire();
				}, timeout);
			}
			onIdleTimerExpire() {
				if (!this.lastActivity || !this.maxIdleInterval) throw new Error("Transport.onIdleTimerExpire(): lastActivity/maxIdleInterval not set");
				this.idleTimer = null;
				const sinceLast = Platform.Config.now() - this.lastActivity;
				const timeRemaining = this.maxIdleInterval - sinceLast;
				if (timeRemaining <= 0) {
					const msg = "No activity seen from realtime in " + sinceLast + "ms; assuming connection has dropped";
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Transport.onIdleTimerExpire()", msg);
					this.disconnect(new ErrorInfo(msg, 80003, 408));
				} else this.setIdleTimer(timeRemaining + 100);
			}
			static tryConnect(transportCtor, connectionManager, auth, transportParams, callback) {
				const transport = new transportCtor(connectionManager, auth, transportParams);
				let transportAttemptTimer;
				const errorCb = function(err) {
					Platform.Config.clearTimeout(transportAttemptTimer);
					callback({
						event: this.event,
						error: err
					});
				};
				const realtimeRequestTimeout = connectionManager.options.timeouts.realtimeRequestTimeout;
				transportAttemptTimer = Platform.Config.setTimeout(() => {
					transport.off([
						"preconnect",
						"disconnected",
						"failed"
					]);
					transport.dispose();
					errorCb.call({ event: "disconnected" }, new ErrorInfo("Timeout waiting for transport to indicate itself viable", 5e4, 500));
				}, realtimeRequestTimeout);
				transport.on(["failed", "disconnected"], errorCb);
				transport.on("preconnect", function() {
					logger_default.logAction(connectionManager.logger, logger_default.LOG_MINOR, "Transport.tryConnect()", "viable transport " + transport);
					Platform.Config.clearTimeout(transportAttemptTimer);
					transport.off(["failed", "disconnected"], errorCb);
					callback(null, transport);
				});
				transport.connect();
				return transport;
			}
			static isAvailable() {
				throw new ErrorInfo("isAvailable not implemented for transport", 5e4, 500);
			}
		};
		var transport_default = Transport;
		var TransportNames;
		((TransportNames2) => {
			TransportNames2.WebSocket = "web_socket";
			TransportNames2.Comet = "comet";
			TransportNames2.XhrPolling = "xhr_polling";
		})(TransportNames || (TransportNames = {}));
		var globalObject2 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : self;
		var haveWebStorage = () => {
			var _a2;
			return typeof Platform.WebStorage !== "undefined" && ((_a2 = Platform.WebStorage) == null ? void 0 : _a2.localSupported);
		};
		var haveSessionStorage = () => {
			var _a2;
			return typeof Platform.WebStorage !== "undefined" && ((_a2 = Platform.WebStorage) == null ? void 0 : _a2.sessionSupported);
		};
		var noop = function() {};
		var transportPreferenceName = "ably-transport-preference";
		function decodeRecoveryKey(recoveryKey) {
			try {
				return JSON.parse(recoveryKey);
			} catch (e) {
				return null;
			}
		}
		var TransportParams = class {
			constructor(options, host, mode, connectionKey) {
				this.options = options;
				this.host = host;
				this.mode = mode;
				this.connectionKey = connectionKey;
				this.format = options.useBinaryProtocol ? "msgpack" : "json";
			}
			getConnectParams(authParams) {
				const params = authParams ? copy(authParams) : {};
				const options = this.options;
				switch (this.mode) {
					case "resume":
						params.resume = this.connectionKey;
						break;
					case "recover": {
						const recoveryContext = decodeRecoveryKey(options.recover);
						if (recoveryContext) params.recover = recoveryContext.connectionKey;
						break;
					}
					default:
				}
				if (options.clientId !== void 0) params.clientId = options.clientId;
				if (options.echoMessages === false) params.echo = "false";
				if (this.format !== void 0) params.format = this.format;
				if (this.stream !== void 0) params.stream = this.stream;
				if (this.heartbeats !== void 0) params.heartbeats = this.heartbeats;
				params.v = defaults_default.protocolVersion;
				params.agent = getAgentString(this.options);
				if (options.transportParams !== void 0) mixin(params, options.transportParams);
				return params;
			}
			toString() {
				let result = "[mode=" + this.mode;
				if (this.host) result += ",host=" + this.host;
				if (this.connectionKey) result += ",connectionKey=" + this.connectionKey;
				if (this.format) result += ",format=" + this.format;
				result += "]";
				return result;
			}
		};
		var connectionmanager_default = class _ConnectionManager extends eventemitter_default {
			constructor(realtime, options) {
				super(realtime.logger);
				this.supportedTransports = {};
				this.disconnectedRetryCount = 0;
				this.pendingChannelMessagesState = {
					isProcessing: false,
					queue: []
				};
				this.realtime = realtime;
				this.initTransports();
				this.options = options;
				const timeouts = options.timeouts;
				const connectingTimeout = timeouts.webSocketConnectTimeout + timeouts.realtimeRequestTimeout;
				this.states = {
					initialized: {
						state: "initialized",
						terminal: false,
						queueEvents: true,
						sendEvents: false,
						failState: "disconnected"
					},
					connecting: {
						state: "connecting",
						terminal: false,
						queueEvents: true,
						sendEvents: false,
						retryDelay: connectingTimeout,
						failState: "disconnected"
					},
					connected: {
						state: "connected",
						terminal: false,
						queueEvents: false,
						sendEvents: true,
						failState: "disconnected"
					},
					disconnected: {
						state: "disconnected",
						terminal: false,
						queueEvents: true,
						sendEvents: false,
						retryDelay: timeouts.disconnectedRetryTimeout,
						failState: "disconnected"
					},
					suspended: {
						state: "suspended",
						terminal: false,
						queueEvents: false,
						sendEvents: false,
						retryDelay: timeouts.suspendedRetryTimeout,
						failState: "suspended"
					},
					closing: {
						state: "closing",
						terminal: false,
						queueEvents: false,
						sendEvents: false,
						retryDelay: timeouts.realtimeRequestTimeout,
						failState: "closed"
					},
					closed: {
						state: "closed",
						terminal: true,
						queueEvents: false,
						sendEvents: false,
						failState: "closed"
					},
					failed: {
						state: "failed",
						terminal: true,
						queueEvents: false,
						sendEvents: false,
						failState: "failed"
					}
				};
				this.state = this.states.initialized;
				this.errorReason = null;
				this.queuedMessages = new messagequeue_default(this.logger);
				this.msgSerial = 0;
				this.connectionDetails = void 0;
				this.connectionId = void 0;
				this.connectionKey = void 0;
				this.connectionStateTtl = timeouts.connectionStateTtl;
				this.maxIdleInterval = null;
				this.transports = intersect(options.transports || defaults_default.defaultTransports, this.supportedTransports);
				this.transportPreference = null;
				if (this.transports.includes(TransportNames.WebSocket)) this.webSocketTransportAvailable = true;
				if (this.transports.includes(TransportNames.XhrPolling)) this.baseTransport = TransportNames.XhrPolling;
				else if (this.transports.includes(TransportNames.Comet)) this.baseTransport = TransportNames.Comet;
				this.domains = defaults_default.getHosts(options);
				this.activeProtocol = null;
				this.host = null;
				this.lastAutoReconnectAttempt = null;
				this.lastActivity = null;
				this.forceFallbackHost = false;
				this.connectCounter = 0;
				this.wsCheckResult = null;
				this.webSocketSlowTimer = null;
				this.webSocketGiveUpTimer = null;
				this.abandonedWebSocket = false;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Realtime.ConnectionManager()", "started");
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Realtime.ConnectionManager()", "requested transports = [" + (options.transports || defaults_default.defaultTransports) + "]");
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Realtime.ConnectionManager()", "available transports = [" + this.transports + "]");
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "Realtime.ConnectionManager()", "http domains = [" + this.domains + "]");
				if (!this.transports.length) {
					const msg = "no requested transports available";
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "realtime.ConnectionManager()", msg);
					throw new Error(msg);
				}
				const addEventListener = Platform.Config.addEventListener;
				if (addEventListener) {
					if (haveSessionStorage() && typeof options.recover === "function") addEventListener("beforeunload", this.persistConnection.bind(this));
					if (options.closeOnUnload === true) addEventListener("beforeunload", () => {
						logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "Realtime.ConnectionManager()", "beforeunload event has triggered the connection to close as closeOnUnload is true");
						this.requestState({ state: "closing" });
					});
					addEventListener("online", () => {
						var _a2;
						if (this.state == this.states.disconnected || this.state == this.states.suspended) {
							logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager caught browser ‘online’ event", "reattempting connection");
							this.requestState({ state: "connecting" });
						} else if (this.state == this.states.connecting) {
							(_a2 = this.pendingTransport) == null || _a2.off();
							this.disconnectAllTransports();
							this.startConnect();
						}
					});
					addEventListener("offline", () => {
						if (this.state == this.states.connected) {
							logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager caught browser ‘offline’ event", "disconnecting active transport");
							this.disconnectAllTransports();
						}
					});
				}
			}
			/*********************
			* transport management
			*********************/
			static supportedTransports(additionalImplementations) {
				const storage = { supportedTransports: {} };
				this.initTransports(additionalImplementations, storage);
				return storage.supportedTransports;
			}
			static initTransports(additionalImplementations, storage) {
				const implementations = __spreadValues(__spreadValues({}, Platform.Transports.bundledImplementations), additionalImplementations);
				[TransportNames.WebSocket, ...Platform.Transports.order].forEach((transportName) => {
					const transport = implementations[transportName];
					if (transport && transport.isAvailable()) storage.supportedTransports[transportName] = transport;
				});
			}
			initTransports() {
				_ConnectionManager.initTransports(this.realtime._additionalTransportImplementations, this);
			}
			createTransportParams(host, mode) {
				return new TransportParams(this.options, host, mode, this.connectionKey);
			}
			getTransportParams(callback) {
				const decideMode = (modeCb) => {
					if (this.connectionKey) {
						modeCb("resume");
						return;
					}
					if (typeof this.options.recover === "string") {
						modeCb("recover");
						return;
					}
					const recoverFn = this.options.recover, lastSessionData = this.getSessionRecoverData(), sessionRecoveryName = this.sessionRecoveryName();
					if (lastSessionData && typeof recoverFn === "function") {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.getTransportParams()", "Calling clientOptions-provided recover function with last session data (recovery scope: " + sessionRecoveryName + ")");
						recoverFn(lastSessionData, (shouldRecover) => {
							if (shouldRecover) {
								this.options.recover = lastSessionData.recoveryKey;
								modeCb("recover");
							} else modeCb("clean");
						});
						return;
					}
					modeCb("clean");
				};
				decideMode((mode) => {
					const transportParams = this.createTransportParams(null, mode);
					if (mode === "recover") {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.getTransportParams()", "Transport recovery mode = recover; recoveryKey = " + this.options.recover);
						const recoveryContext = decodeRecoveryKey(this.options.recover);
						if (recoveryContext) this.msgSerial = recoveryContext.msgSerial;
					} else logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.getTransportParams()", "Transport params = " + transportParams.toString());
					callback(transportParams);
				});
			}
			/**
			* Attempt to connect using a given transport
			* @param transportParams
			* @param candidate, the transport to try
			* @param callback
			*/
			tryATransport(transportParams, candidate, callback) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.tryATransport()", "trying " + candidate);
				this.proposedTransport = transport_default.tryConnect(this.supportedTransports[candidate], this, this.realtime.auth, transportParams, (wrappedErr, transport) => {
					const state = this.state;
					if (state == this.states.closing || state == this.states.closed || state == this.states.failed) {
						if (transport) {
							logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.tryATransport()", "connection " + state.state + " while we were attempting the transport; closing " + transport);
							transport.close();
						}
						callback(true);
						return;
					}
					if (wrappedErr) {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.tryATransport()", "transport " + candidate + " " + wrappedErr.event + ", err: " + wrappedErr.error.toString());
						if (auth_default.isTokenErr(wrappedErr.error) && !(this.errorReason && auth_default.isTokenErr(this.errorReason))) {
							this.errorReason = wrappedErr.error;
							whenPromiseSettles(this.realtime.auth._forceNewToken(null, null), (err) => {
								if (err) {
									this.actOnErrorFromAuthorize(err);
									return;
								}
								this.tryATransport(transportParams, candidate, callback);
							});
						} else if (wrappedErr.event === "failed") {
							this.notifyState({
								state: "failed",
								error: wrappedErr.error
							});
							callback(true);
						} else if (wrappedErr.event === "disconnected") if (!isRetriable(wrappedErr.error)) {
							this.notifyState({
								state: this.states.connecting.failState,
								error: wrappedErr.error
							});
							callback(true);
						} else callback(false);
						return;
					}
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.tryATransport()", "viable transport " + candidate + "; setting pending");
					this.setTransportPending(transport, transportParams);
					callback(null, transport);
				});
			}
			/**
			* Called when a transport is indicated to be viable, and the ConnectionManager
			* expects to activate this transport as soon as it is connected.
			* @param transport
			* @param transportParams
			*/
			setTransportPending(transport, transportParams) {
				const mode = transportParams.mode;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.setTransportPending()", "transport = " + transport + "; mode = " + mode);
				this.pendingTransport = transport;
				this.cancelWebSocketSlowTimer();
				this.cancelWebSocketGiveUpTimer();
				transport.once("connected", (error, connectionId, connectionDetails) => {
					this.activateTransport(error, transport, connectionId, connectionDetails);
					if (mode === "recover" && this.options.recover) {
						delete this.options.recover;
						this.unpersistConnection();
					}
				});
				const self2 = this;
				transport.on([
					"disconnected",
					"closed",
					"failed"
				], function(error) {
					self2.deactivateTransport(transport, this.event, error);
				});
				this.emit("transport.pending", transport);
			}
			/**
			* Called when a transport is connected, and the connectionmanager decides that
			* it will now be the active transport. Returns whether or not it activated
			* the transport (if the connection is closing/closed it will choose not to).
			* @param transport the transport instance
			* @param connectionId the id of the new active connection
			* @param connectionDetails the details of the new active connection
			*/
			activateTransport(error, transport, connectionId, connectionDetails) {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.activateTransport()", "transport = " + transport);
				if (error) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.activateTransport()", "error = " + error);
				if (connectionId) logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.activateTransport()", "connectionId =  " + connectionId);
				if (connectionDetails) logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.activateTransport()", "connectionDetails =  " + JSON.stringify(connectionDetails));
				this.persistTransportPreference(transport);
				const existingState = this.state, connectedState = this.states.connected.state;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.activateTransport()", "current state = " + existingState.state);
				if (existingState.state == this.states.closing.state || existingState.state == this.states.closed.state || existingState.state == this.states.failed.state) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.activateTransport()", "Disconnecting transport and abandoning");
					transport.disconnect();
					return false;
				}
				delete this.pendingTransport;
				if (!transport.isConnected) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.activateTransport()", "Declining to activate transport " + transport + " since it appears to no longer be connected");
					return false;
				}
				const existingActiveProtocol = this.activeProtocol;
				this.activeProtocol = new protocol_default(transport);
				this.host = transport.params.host;
				const connectionKey = connectionDetails.connectionKey;
				if (connectionKey && this.connectionKey != connectionKey) this.setConnection(connectionId, connectionDetails, !!error);
				this.onConnectionDetailsUpdate(connectionDetails, transport);
				Platform.Config.nextTick(() => {
					transport.on("connected", (connectedErr, _connectionId, connectionDetails2) => {
						this.onConnectionDetailsUpdate(connectionDetails2, transport);
						this.emit("update", new connectionstatechange_default(connectedState, connectedState, null, connectedErr));
					});
				});
				if (existingState.state === this.states.connected.state) {
					if (error) {
						this.errorReason = this.realtime.connection.errorReason = error;
						this.emit("update", new connectionstatechange_default(connectedState, connectedState, null, error));
					}
				} else {
					this.notifyState({
						state: "connected",
						error
					});
					this.errorReason = this.realtime.connection.errorReason = error || null;
				}
				this.emit("transport.active", transport);
				if (existingActiveProtocol) {
					if (existingActiveProtocol.messageQueue.count() > 0) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.activateTransport()", "Previous active protocol (for transport " + existingActiveProtocol.transport.shortName + ", new one is " + transport.shortName + ") finishing with " + existingActiveProtocol.messageQueue.count() + " messages still pending");
					if (existingActiveProtocol.transport === transport) {
						const msg = "Assumption violated: activating a transport that was also the transport for the previous active protocol; transport = " + transport.shortName + "; stack = " + (/* @__PURE__ */ new Error()).stack;
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.activateTransport()", msg);
					} else existingActiveProtocol.finish();
				}
				return true;
			}
			/**
			* Called when a transport is no longer the active transport. This can occur
			* in any transport connection state.
			* @param transport
			*/
			deactivateTransport(transport, state, error) {
				const currentProtocol = this.activeProtocol, wasActive = currentProtocol && currentProtocol.getTransport() === transport, wasPending = transport === this.pendingTransport, noTransportsScheduledForActivation = this.noTransportsScheduledForActivation();
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.deactivateTransport()", "transport = " + transport);
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.deactivateTransport()", "state = " + state + (wasActive ? "; was active" : wasPending ? "; was pending" : "") + (noTransportsScheduledForActivation ? "" : "; another transport is scheduled for activation"));
				if (error && error.message) logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.deactivateTransport()", "reason =  " + error.message);
				if (wasActive) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.deactivateTransport()", "Getting, clearing, and requeuing " + this.activeProtocol.messageQueue.count() + " pending messages");
					this.queuePendingMessages(currentProtocol.getPendingMessages());
					currentProtocol.clearPendingMessages();
					this.activeProtocol = this.host = null;
				}
				this.emit("transport.inactive", transport);
				if (wasActive && noTransportsScheduledForActivation || wasActive && state === "failed" || state === "closed" || currentProtocol === null && wasPending) {
					if (state === "disconnected" && error && error.statusCode > 500 && this.domains.length > 1) {
						this.unpersistTransportPreference();
						this.forceFallbackHost = true;
						this.notifyState({
							state,
							error,
							retryImmediately: true
						});
						return;
					}
					const newConnectionState = state === "failed" && auth_default.isTokenErr(error) ? "disconnected" : state;
					this.notifyState({
						state: newConnectionState,
						error
					});
					return;
				}
			}
			noTransportsScheduledForActivation() {
				return !this.pendingTransport || !this.pendingTransport.isConnected;
			}
			setConnection(connectionId, connectionDetails, hasConnectionError) {
				const prevConnId = this.connectionId;
				if (prevConnId && prevConnId !== connectionId || !prevConnId && hasConnectionError) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.setConnection()", "Resetting msgSerial");
					this.msgSerial = 0;
					this.queuedMessages.resetSendAttempted();
				}
				if (this.connectionId !== connectionId) logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.setConnection()", "New connectionId; reattaching any attached channels");
				this.realtime.connection.id = this.connectionId = connectionId;
				this.realtime.connection.key = this.connectionKey = connectionDetails.connectionKey;
			}
			clearConnection() {
				this.realtime.connection.id = this.connectionId = void 0;
				this.realtime.connection.key = this.connectionKey = void 0;
				this.msgSerial = 0;
				this.queuedMessages.resetSendAttempted();
				this.unpersistConnection();
			}
			createRecoveryKey() {
				if (!this.connectionKey) return null;
				return JSON.stringify({
					connectionKey: this.connectionKey,
					msgSerial: this.msgSerial,
					channelSerials: this.realtime.channels.channelSerials()
				});
			}
			checkConnectionStateFreshness() {
				if (!this.lastActivity || !this.connectionId) return;
				const sinceLast = Platform.Config.now() - this.lastActivity;
				if (sinceLast > this.connectionStateTtl + this.maxIdleInterval) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.checkConnectionStateFreshness()", "Last known activity from realtime was " + sinceLast + "ms ago; discarding connection state");
					this.clearConnection();
					this.states.connecting.failState = "suspended";
				}
			}
			/**
			* Called when the connectionmanager wants to persist transport
			* state for later recovery. Only applicable in the browser context.
			*/
			persistConnection() {
				if (haveSessionStorage()) {
					const recoveryKey = this.createRecoveryKey();
					if (recoveryKey) this.setSessionRecoverData({
						recoveryKey,
						disconnectedAt: Platform.Config.now(),
						location: globalObject2.location,
						clientId: this.realtime.auth.clientId
					});
				}
			}
			/**
			* Called when the connectionmanager wants to persist transport
			* state for later recovery. Only applicable in the browser context.
			*/
			unpersistConnection() {
				this.clearSessionRecoverData();
			}
			getActiveTransportFormat() {
				var _a2;
				return (_a2 = this.activeProtocol) == null ? void 0 : _a2.getTransport().format;
			}
			/*********************
			* state management
			*********************/
			getError() {
				if (this.errorReason) {
					const newError = PartialErrorInfo.fromValues(this.errorReason);
					newError.cause = this.errorReason;
					return newError;
				}
				return this.getStateError();
			}
			getStateError() {
				var _a2, _b;
				return (_b = (_a2 = connectionerrors_default)[this.state.state]) == null ? void 0 : _b.call(_a2);
			}
			activeState() {
				return this.state.queueEvents || this.state.sendEvents;
			}
			enactStateChange(stateChange) {
				const action = "Connection state";
				const message = stateChange.current + (stateChange.reason ? "; reason: " + stateChange.reason : "");
				if (stateChange.current === "failed") logger_default.logAction(this.logger, logger_default.LOG_ERROR, action, message);
				else logger_default.logAction(this.logger, logger_default.LOG_MAJOR, action, message);
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.enactStateChange", "setting new state: " + stateChange.current + "; reason = " + (stateChange.reason && stateChange.reason.message));
				const newState = this.state = this.states[stateChange.current];
				if (stateChange.reason) {
					this.errorReason = stateChange.reason;
					this.realtime.connection.errorReason = stateChange.reason;
				}
				if (newState.terminal || newState.state === "suspended") this.clearConnection();
				this.emit("connectionstate", stateChange);
			}
			/****************************************
			* ConnectionManager connection lifecycle
			****************************************/
			startTransitionTimer(transitionState) {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.startTransitionTimer()", "transitionState: " + transitionState.state);
				if (this.transitionTimer) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.startTransitionTimer()", "clearing already-running timer");
					Platform.Config.clearTimeout(this.transitionTimer);
				}
				this.transitionTimer = Platform.Config.setTimeout(() => {
					if (this.transitionTimer) {
						this.transitionTimer = null;
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager " + transitionState.state + " timer expired", "requesting new state: " + transitionState.failState);
						this.notifyState({ state: transitionState.failState });
					}
				}, transitionState.retryDelay);
			}
			cancelTransitionTimer() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.cancelTransitionTimer()", "");
				if (this.transitionTimer) {
					Platform.Config.clearTimeout(this.transitionTimer);
					this.transitionTimer = null;
				}
			}
			startSuspendTimer() {
				if (this.suspendTimer) return;
				this.suspendTimer = Platform.Config.setTimeout(() => {
					if (this.suspendTimer) {
						this.suspendTimer = null;
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager suspend timer expired", "requesting new state: suspended");
						this.states.connecting.failState = "suspended";
						this.notifyState({ state: "suspended" });
					}
				}, this.connectionStateTtl);
			}
			checkSuspendTimer(state) {
				if (state !== "disconnected" && state !== "suspended" && state !== "connecting") this.cancelSuspendTimer();
			}
			cancelSuspendTimer() {
				this.states.connecting.failState = "disconnected";
				if (this.suspendTimer) {
					Platform.Config.clearTimeout(this.suspendTimer);
					this.suspendTimer = null;
				}
			}
			startRetryTimer(interval) {
				this.retryTimer = Platform.Config.setTimeout(() => {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager retry timer expired", "retrying");
					this.retryTimer = null;
					this.requestState({ state: "connecting" });
				}, interval);
			}
			cancelRetryTimer() {
				if (this.retryTimer) {
					Platform.Config.clearTimeout(this.retryTimer);
					this.retryTimer = null;
				}
			}
			startWebSocketSlowTimer() {
				this.webSocketSlowTimer = Platform.Config.setTimeout(() => {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager WebSocket slow timer", "checking connectivity");
					this.checkWsConnectivity().then(() => {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager WebSocket slow timer", "ws connectivity check succeeded");
						this.wsCheckResult = true;
					}).catch(() => {
						logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "ConnectionManager WebSocket slow timer", "ws connectivity check failed");
						this.wsCheckResult = false;
					});
					if (this.realtime.http.checkConnectivity) whenPromiseSettles(this.realtime.http.checkConnectivity(), (err, connectivity) => {
						if (err || !connectivity) {
							logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "ConnectionManager WebSocket slow timer", "http connectivity check failed");
							this.cancelWebSocketGiveUpTimer();
							this.notifyState({
								state: "disconnected",
								error: new ErrorInfo("Unable to connect (network unreachable)", 80003, 404)
							});
						} else logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager WebSocket slow timer", "http connectivity check succeeded");
					});
				}, this.options.timeouts.webSocketSlowTimeout);
			}
			cancelWebSocketSlowTimer() {
				if (this.webSocketSlowTimer) {
					Platform.Config.clearTimeout(this.webSocketSlowTimer);
					this.webSocketSlowTimer = null;
				}
			}
			startWebSocketGiveUpTimer(transportParams) {
				this.webSocketGiveUpTimer = Platform.Config.setTimeout(() => {
					var _a2, _b;
					if (!this.wsCheckResult) {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager WebSocket give up timer", "websocket connection took more than 10s; " + (this.baseTransport ? "trying base transport" : ""));
						if (this.baseTransport) {
							this.abandonedWebSocket = true;
							(_a2 = this.proposedTransport) == null || _a2.dispose();
							(_b = this.pendingTransport) == null || _b.dispose();
							this.connectBase(transportParams, ++this.connectCounter);
						} else logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "ConnectionManager WebSocket give up timer", "websocket connectivity appears to be unavailable but no other transports to try");
					}
				}, this.options.timeouts.webSocketConnectTimeout);
			}
			cancelWebSocketGiveUpTimer() {
				if (this.webSocketGiveUpTimer) {
					Platform.Config.clearTimeout(this.webSocketGiveUpTimer);
					this.webSocketGiveUpTimer = null;
				}
			}
			notifyState(indicated) {
				var _a2, _b;
				const state = indicated.state;
				const retryImmediately = state === "disconnected" && (this.state === this.states.connected || indicated.retryImmediately || this.state === this.states.connecting && indicated.error && auth_default.isTokenErr(indicated.error) && !(this.errorReason && auth_default.isTokenErr(this.errorReason)));
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.notifyState()", "new state: " + state + (retryImmediately ? "; will retry connection immediately" : ""));
				if (state == this.state.state) return;
				this.cancelTransitionTimer();
				this.cancelRetryTimer();
				this.cancelWebSocketSlowTimer();
				this.cancelWebSocketGiveUpTimer();
				this.checkSuspendTimer(indicated.state);
				if (state === "suspended" || state === "connected") this.disconnectedRetryCount = 0;
				if (this.state.terminal) return;
				const newState = this.states[indicated.state];
				let retryDelay = newState.retryDelay;
				if (newState.state === "disconnected") {
					this.disconnectedRetryCount++;
					retryDelay = getRetryTime(newState.retryDelay, this.disconnectedRetryCount);
				}
				const change = new connectionstatechange_default(this.state.state, newState.state, retryDelay, indicated.error || ((_b = (_a2 = connectionerrors_default)[newState.state]) == null ? void 0 : _b.call(_a2)));
				if (retryImmediately) {
					const autoReconnect = () => {
						if (this.state === this.states.disconnected) {
							this.lastAutoReconnectAttempt = Platform.Config.now();
							this.requestState({ state: "connecting" });
						}
					};
					const sinceLast = this.lastAutoReconnectAttempt && Platform.Config.now() - this.lastAutoReconnectAttempt + 1;
					if (sinceLast && sinceLast < 1e3) {
						logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.notifyState()", "Last reconnect attempt was only " + sinceLast + "ms ago, waiting another " + (1e3 - sinceLast) + "ms before trying again");
						Platform.Config.setTimeout(autoReconnect, 1e3 - sinceLast);
					} else Platform.Config.nextTick(autoReconnect);
				} else if (state === "disconnected" || state === "suspended") this.startRetryTimer(retryDelay);
				if (state === "disconnected" && !retryImmediately || state === "suspended" || newState.terminal) Platform.Config.nextTick(() => {
					this.disconnectAllTransports();
				});
				if (state == "connected" && !this.activeProtocol) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.notifyState()", "Broken invariant: attempted to go into connected state, but there is no active protocol");
				this.enactStateChange(change);
				if (this.state.sendEvents) {
					this.queuedPresenceToChannelQueues();
					this.sendQueuedMessages();
				} else if (!this.state.queueEvents) {
					this.realtime.channels.propogateConnectionInterruption(state, change.reason);
					this.failQueuedMessages(change.reason);
				}
			}
			requestState(request) {
				var _a2, _b;
				const state = request.state;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.requestState()", "requested state: " + state + "; current state: " + this.state.state);
				if (state == this.state.state) return;
				this.cancelWebSocketSlowTimer();
				this.cancelWebSocketGiveUpTimer();
				this.cancelTransitionTimer();
				this.cancelRetryTimer();
				this.checkSuspendTimer(state);
				if (state == "connecting" && this.state.state == "connected") return;
				if (state == "closing" && this.state.state == "closed") return;
				const newState = this.states[state], change = new connectionstatechange_default(this.state.state, newState.state, null, request.error || ((_b = (_a2 = connectionerrors_default)[newState.state]) == null ? void 0 : _b.call(_a2)));
				this.enactStateChange(change);
				if (state == "connecting") Platform.Config.nextTick(() => {
					this.startConnect();
				});
				if (state == "closing") this.closeImpl();
			}
			startConnect() {
				if (this.state !== this.states.connecting) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.startConnect()", "Must be in connecting state to connect, but was " + this.state.state);
					return;
				}
				const auth = this.realtime.auth;
				const connectCount = ++this.connectCounter;
				const connect = () => {
					this.checkConnectionStateFreshness();
					this.getTransportParams((transportParams) => {
						if (transportParams.mode === "recover" && transportParams.options.recover) {
							const recoveryContext = decodeRecoveryKey(transportParams.options.recover);
							if (recoveryContext) this.realtime.channels.recoverChannels(recoveryContext.channelSerials);
						}
						if (connectCount !== this.connectCounter) return;
						this.connectImpl(transportParams, connectCount);
					});
				};
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.startConnect()", "starting connection");
				this.startSuspendTimer();
				this.startTransitionTimer(this.states.connecting);
				if (auth.method === "basic") connect();
				else {
					const authCb = (err) => {
						if (connectCount !== this.connectCounter) return;
						if (err) this.actOnErrorFromAuthorize(err);
						else connect();
					};
					if (this.errorReason && auth_default.isTokenErr(this.errorReason)) whenPromiseSettles(auth._forceNewToken(null, null), authCb);
					else whenPromiseSettles(auth._ensureValidAuthCredentials(false), authCb);
				}
			}
			connectImpl(transportParams, connectCount) {
				const state = this.state.state;
				if (state !== this.states.connecting.state) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.connectImpl()", "Must be in connecting state to connect, but was " + state);
					return;
				}
				const transportPreference = this.getTransportPreference();
				if (transportPreference && transportPreference === this.baseTransport && this.webSocketTransportAvailable) this.checkWsConnectivity().then(() => {
					this.unpersistTransportPreference();
					if (this.state === this.states.connecting) {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.connectImpl():", "web socket connectivity available, cancelling connection attempt with " + this.baseTransport);
						this.disconnectAllTransports();
						this.connectWs(transportParams, ++this.connectCounter);
					}
				}).catch(noop);
				if (transportPreference && transportPreference === this.baseTransport || this.baseTransport && !this.webSocketTransportAvailable) this.connectBase(transportParams, connectCount);
				else this.connectWs(transportParams, connectCount);
			}
			connectWs(transportParams, connectCount) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.connectWs()");
				this.wsCheckResult = null;
				this.abandonedWebSocket = false;
				this.startWebSocketSlowTimer();
				this.startWebSocketGiveUpTimer(transportParams);
				this.tryTransportWithFallbacks("web_socket", transportParams, true, connectCount, () => {
					return this.wsCheckResult !== false && !this.abandonedWebSocket;
				});
			}
			connectBase(transportParams, connectCount) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.connectBase()");
				if (this.baseTransport) this.tryTransportWithFallbacks(this.baseTransport, transportParams, false, connectCount, () => true);
				else this.notifyState({
					state: "disconnected",
					error: new ErrorInfo("No transports left to try", 8e4, 404)
				});
			}
			tryTransportWithFallbacks(transportName, transportParams, ws, connectCount, shouldContinue) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.tryTransportWithFallbacks()", transportName);
				const giveUp = (err) => {
					this.notifyState({
						state: this.states.connecting.failState,
						error: err
					});
				};
				const candidateHosts = this.domains.slice();
				const hostAttemptCb = (fatal, transport) => {
					if (connectCount !== this.connectCounter) return;
					if (!shouldContinue()) {
						if (transport) transport.dispose();
						return;
					}
					if (!transport && !fatal) tryFallbackHosts();
				};
				const host = candidateHosts.shift();
				if (!host) {
					giveUp(new ErrorInfo("Unable to connect (no available host)", 80003, 404));
					return;
				}
				transportParams.host = host;
				const tryFallbackHosts = () => {
					if (!candidateHosts.length) {
						giveUp(new ErrorInfo("Unable to connect (and no more fallback hosts to try)", 80003, 404));
						return;
					}
					if (!this.realtime.http.checkConnectivity) {
						giveUp(new PartialErrorInfo("Internal error: Http.checkConnectivity not set", null, 500));
						return;
					}
					whenPromiseSettles(this.realtime.http.checkConnectivity(), (err, connectivity) => {
						if (connectCount !== this.connectCounter) return;
						if (!shouldContinue()) return;
						if (err) {
							giveUp(err);
							return;
						}
						if (!connectivity) {
							giveUp(new ErrorInfo("Unable to connect (network unreachable)", 80003, 404));
							return;
						}
						transportParams.host = arrPopRandomElement(candidateHosts);
						this.tryATransport(transportParams, transportName, hostAttemptCb);
					});
				};
				if (this.forceFallbackHost && candidateHosts.length) {
					this.forceFallbackHost = false;
					tryFallbackHosts();
					return;
				}
				this.tryATransport(transportParams, transportName, hostAttemptCb);
			}
			closeImpl() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.closeImpl()", "closing connection");
				this.cancelSuspendTimer();
				this.startTransitionTimer(this.states.closing);
				if (this.pendingTransport) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.closeImpl()", "Closing pending transport: " + this.pendingTransport);
					this.pendingTransport.close();
				}
				if (this.activeProtocol) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.closeImpl()", "Closing active transport: " + this.activeProtocol.getTransport());
					this.activeProtocol.getTransport().close();
				}
				this.notifyState({ state: "closed" });
			}
			onAuthUpdated(tokenDetails, callback) {
				var _a2;
				switch (this.state.state) {
					case "connected": {
						logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.onAuthUpdated()", "Sending AUTH message on active transport");
						const activeTransport = (_a2 = this.activeProtocol) == null ? void 0 : _a2.getTransport();
						if (activeTransport && activeTransport.onAuthUpdated) activeTransport.onAuthUpdated(tokenDetails);
						const authMsg = fromValues({
							action: actions.AUTH,
							auth: { accessToken: tokenDetails.token }
						});
						this.send(authMsg);
						const successListener = () => {
							this.off(failureListener);
							callback(null, tokenDetails);
						};
						const failureListener = (stateChange) => {
							if (stateChange.current === "failed") {
								this.off(successListener);
								this.off(failureListener);
								callback(stateChange.reason || this.getStateError());
							}
						};
						this.once("connectiondetails", successListener);
						this.on("connectionstate", failureListener);
						break;
					}
					case "connecting":
						logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.onAuthUpdated()", "Aborting current connection attempts in order to start again with the new auth details");
						this.disconnectAllTransports();
					default: {
						logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.onAuthUpdated()", "Connection state is " + this.state.state + "; waiting until either connected or failed");
						const listener = (stateChange) => {
							switch (stateChange.current) {
								case "connected":
									this.off(listener);
									callback(null, tokenDetails);
									break;
								case "failed":
								case "closed":
								case "suspended":
									this.off(listener);
									callback(stateChange.reason || this.getStateError());
									break;
								default: break;
							}
						};
						this.on("connectionstate", listener);
						if (this.state.state === "connecting") this.startConnect();
						else this.requestState({ state: "connecting" });
					}
				}
			}
			disconnectAllTransports() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.disconnectAllTransports()", "Disconnecting all transports");
				this.connectCounter++;
				if (this.pendingTransport) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.disconnectAllTransports()", "Disconnecting pending transport: " + this.pendingTransport);
					this.pendingTransport.disconnect();
				}
				delete this.pendingTransport;
				if (this.proposedTransport) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.disconnectAllTransports()", "Disconnecting proposed transport: " + this.pendingTransport);
					this.proposedTransport.disconnect();
				}
				delete this.pendingTransport;
				if (this.activeProtocol) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.disconnectAllTransports()", "Disconnecting active transport: " + this.activeProtocol.getTransport());
					this.activeProtocol.getTransport().disconnect();
				}
			}
			/******************
			* event queueing
			******************/
			send(msg, queueEvent, callback) {
				callback = callback || noop;
				const state = this.state;
				if (state.sendEvents) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.send()", "sending event");
					this.sendImpl(new PendingMessage(msg, callback));
					return;
				}
				if (!(queueEvent && state.queueEvents)) {
					const err = "rejecting event, queueEvent was " + queueEvent + ", state was " + state.state;
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.send()", err);
					callback(this.errorReason || new ErrorInfo(err, 9e4, 400));
					return;
				}
				if (this.logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.send()", "queueing msg; " + stringify(msg, this.realtime._RealtimePresence, this.realtime._Annotations, this.realtime._liveObjectsPlugin));
				this.queue(msg, callback);
			}
			sendImpl(pendingMessage) {
				const msg = pendingMessage.message;
				if (pendingMessage.ackRequired && !pendingMessage.sendAttempted) msg.msgSerial = this.msgSerial++;
				try {
					this.activeProtocol.send(pendingMessage);
				} catch (e) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.sendImpl()", "Unexpected exception in transport.send(): " + e.stack);
				}
			}
			queue(msg, callback) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.queue()", "queueing event");
				this.queuedMessages.push(new PendingMessage(msg, callback));
			}
			queuedPresenceToChannelQueues() {
				this.queuedMessages.messages = this.queuedMessages.messages.filter((pendingMessage) => {
					if (pendingMessage.message.action !== actions.PRESENCE) return true;
					const channelName = pendingMessage.message.channel;
					const channel = channelName ? this.realtime.channels.all[channelName] : void 0;
					return !(channel && channel.requeuePresenceFromConnectionQueue(pendingMessage));
				});
			}
			sendQueuedMessages() {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.sendQueuedMessages()", "sending " + this.queuedMessages.count() + " queued messages");
				let pendingMessage;
				while (pendingMessage = this.queuedMessages.shift()) this.sendImpl(pendingMessage);
			}
			queuePendingMessages(pendingMessages) {
				if (pendingMessages && pendingMessages.length) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "ConnectionManager.queuePendingMessages()", "queueing " + pendingMessages.length + " pending messages");
					this.queuedMessages.prepend(pendingMessages);
				}
			}
			failQueuedMessages(err) {
				const numQueued = this.queuedMessages.count();
				if (numQueued > 0) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.failQueuedMessages()", "failing " + numQueued + " queued messages, err = " + inspectError(err));
					this.queuedMessages.completeAllMessages(err);
				}
			}
			onChannelMessage(message, transport) {
				this.pendingChannelMessagesState.queue.push({
					message,
					transport
				});
				if (!this.pendingChannelMessagesState.isProcessing) this.processNextPendingChannelMessage();
			}
			processNextPendingChannelMessage() {
				if (this.pendingChannelMessagesState.queue.length > 0) {
					this.pendingChannelMessagesState.isProcessing = true;
					const pendingChannelMessage = this.pendingChannelMessagesState.queue.shift();
					this.processChannelMessage(pendingChannelMessage.message).catch((err) => {
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.processNextPendingChannelMessage() received error ", err);
					}).finally(() => {
						this.pendingChannelMessagesState.isProcessing = false;
						this.processNextPendingChannelMessage();
					});
				}
			}
			async processChannelMessage(message) {
				await this.realtime.channels.processChannelMessage(message);
			}
			async ping() {
				var _a2;
				if (this.state.state !== "connected") throw new ErrorInfo({
					message: "Unable to ping service: not connected",
					code: 4e4,
					statusCode: 400,
					remediation: "Wait for connection.state to be \"connected\" before calling ping(). Use await connection.whenState(\"connected\") or connection.once(\"connected\", …). From the \"closed\" or \"failed\" state, or \"initialized\" with autoConnect disabled, the SDK does not connect automatically, so call connection.connect() first."
				});
				const transport = (_a2 = this.activeProtocol) == null ? void 0 : _a2.getTransport();
				if (!transport) throw this.getStateError();
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.ping()", "transport = " + transport);
				const pingStart = Platform.Config.now();
				const id = cheapRandStr();
				return withTimeoutAsync(new Promise((resolve) => {
					const onHeartbeat = (responseId) => {
						if (responseId === id) {
							transport.off("heartbeat", onHeartbeat);
							resolve(Platform.Config.now() - pingStart);
						}
					};
					transport.on("heartbeat", onHeartbeat);
					transport.ping(id);
				}), this.options.timeouts.realtimeRequestTimeout, "Timeout waiting for heartbeat response");
			}
			abort(error) {
				this.activeProtocol.getTransport().fail(error);
			}
			getTransportPreference() {
				var _a2, _b;
				return this.transportPreference || haveWebStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2, transportPreferenceName));
			}
			persistTransportPreference(transport) {
				var _a2, _b;
				this.transportPreference = transport.shortName;
				if (haveWebStorage()) (_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.set) == null || _b.call(_a2, transportPreferenceName, transport.shortName);
			}
			unpersistTransportPreference() {
				var _a2, _b;
				this.transportPreference = null;
				if (haveWebStorage()) (_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.remove) == null || _b.call(_a2, transportPreferenceName);
			}
			actOnErrorFromAuthorize(err) {
				if (err.code === 40171) this.notifyState({
					state: "failed",
					error: err
				});
				else if (err.code === 40102) this.notifyState({
					state: "failed",
					error: err
				});
				else if (err.statusCode === HttpStatusCodes_default.Forbidden) {
					const msg = "Client configured authentication provider returned 403, failing the connection";
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.actOnErrorFromAuthorize()", msg);
					const wrapped = new ErrorInfo({
						message: msg,
						code: 80019,
						statusCode: 403,
						cause: err,
						remediation: "Inspect cause for the underlying error, then fix your authUrl/authCallback so it does not respond 403 for a valid client."
					});
					this.notifyState({
						state: "failed",
						error: wrapped
					});
				} else {
					const msg = "Client configured authentication provider request failed";
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "ConnectionManager.actOnErrorFromAuthorize", msg);
					const wrapped = new ErrorInfo({
						message: msg,
						code: 80019,
						statusCode: 401,
						cause: err,
						remediation: "Check network connectivity to your authUrl/authCallback endpoint and that it returns a valid token shape. Inspect cause for the underlying error."
					});
					this.notifyState({
						state: this.state.failState,
						error: wrapped
					});
				}
			}
			onConnectionDetailsUpdate(connectionDetails, transport) {
				if (!connectionDetails) return;
				this.connectionDetails = connectionDetails;
				if (connectionDetails.maxMessageSize) this.options.maxMessageSize = connectionDetails.maxMessageSize;
				const clientId = connectionDetails.clientId;
				if (clientId) {
					const err = this.realtime.auth._uncheckedSetClientId(clientId);
					if (err) {
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.onConnectionDetailsUpdate()", err.message);
						transport.fail(err);
						return;
					}
				}
				const connectionStateTtl = connectionDetails.connectionStateTtl;
				if (connectionStateTtl) this.connectionStateTtl = connectionStateTtl;
				this.maxIdleInterval = connectionDetails.maxIdleInterval;
				this.emit("connectiondetails", connectionDetails);
			}
			checkWsConnectivity() {
				const wsConnectivityCheckUrl = this.options.wsConnectivityCheckUrl || defaults_default.wsConnectivityCheckUrl;
				const ws = new Platform.Config.WebSocket(wsConnectivityCheckUrl);
				return new Promise((resolve, reject) => {
					let finished = false;
					ws.onopen = () => {
						if (!finished) {
							finished = true;
							resolve();
							ws.close();
						}
					};
					ws.onclose = ws.onerror = () => {
						if (!finished) {
							finished = true;
							reject();
						}
					};
				});
			}
			sessionRecoveryName() {
				return this.options.recoveryKeyStorageName || "ably-connection-recovery";
			}
			getSessionRecoverData() {
				var _a2, _b;
				return haveSessionStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.getSession) == null ? void 0 : _b.call(_a2, this.sessionRecoveryName()));
			}
			setSessionRecoverData(value) {
				var _a2, _b;
				return haveSessionStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.setSession) == null ? void 0 : _b.call(_a2, this.sessionRecoveryName(), value));
			}
			clearSessionRecoverData() {
				var _a2, _b;
				return haveSessionStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.removeSession) == null ? void 0 : _b.call(_a2, this.sessionRecoveryName()));
			}
		};
		var Connection = class extends eventemitter_default {
			constructor(ably, options) {
				super(ably.logger);
				this.whenState = (state) => {
					return eventemitter_default.prototype.whenState.call(this, state, this.state);
				};
				this.ably = ably;
				this.connectionManager = new connectionmanager_default(ably, options);
				this.state = this.connectionManager.state.state;
				this.key = void 0;
				this.id = void 0;
				this.errorReason = null;
				this.connectionManager.on("connectionstate", (stateChange) => {
					const state = this.state = stateChange.current;
					Platform.Config.nextTick(() => {
						this.emit(state, stateChange);
					});
				});
				this.connectionManager.on("update", (stateChange) => {
					Platform.Config.nextTick(() => {
						this.emit("update", stateChange);
					});
				});
			}
			connect() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Connection.connect()", "");
				this.connectionManager.requestState({ state: "connecting" });
			}
			ping(...args) {
				detectV1Callback(args, 0);
				return this._pingImpl();
			}
			async _pingImpl() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Connection.ping()", "");
				return this.connectionManager.ping();
			}
			close() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Connection.close()", "connectionKey = " + this.key);
				this.connectionManager.requestState({ state: "closing" });
			}
			get recoveryKey() {
				this.logger.deprecationWarning("The `Connection.recoveryKey` attribute has been replaced by the `Connection.createRecoveryKey()` method. Replace your usage of `recoveryKey` with the return value of `createRecoveryKey()`. `recoveryKey` will be removed in a future version.");
				return this.createRecoveryKey();
			}
			createRecoveryKey() {
				return this.connectionManager.createRecoveryKey();
			}
		};
		var connection_default = Connection;
		var _BaseRealtime = class _BaseRealtime extends baseclient_default {
			constructor(options) {
				var _a2, _b;
				super(defaults_default.objectifyOptions(options, false, "BaseRealtime", logger_default.defaultLogger));
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Realtime()", "");
				if (typeof EdgeRuntime === "string") throw new ErrorInfo(`Ably.Realtime instance cannot be used in Vercel Edge runtime. If you are running Vercel Edge functions, please replace your "new Ably.Realtime()" with "new Ably.Rest()" and use Ably Rest API instead of the Realtime API. If you are server-rendering your application in the Vercel Edge runtime, please use the condition "if (typeof EdgeRuntime === 'string')" to prevent instantiating Ably.Realtime instance during SSR in the Vercel Edge runtime.`, 4e4, 400);
				this._additionalTransportImplementations = _BaseRealtime.transportImplementationsFromPlugins(this.options.plugins);
				this._RealtimePresence = (_b = (_a2 = this.options.plugins) == null ? void 0 : _a2.RealtimePresence) != null ? _b : null;
				this.connection = new connection_default(this, this.options);
				this._channels = new Channels2(this);
				if (this.options.autoConnect !== false) this.connect();
			}
			static transportImplementationsFromPlugins(plugins) {
				const transports = {};
				if (plugins == null ? void 0 : plugins.WebSocketTransport) transports[TransportNames.WebSocket] = plugins.WebSocketTransport;
				if (plugins == null ? void 0 : plugins.XHRPolling) transports[TransportNames.XhrPolling] = plugins.XHRPolling;
				return transports;
			}
			get channels() {
				return this._channels;
			}
			get clientId() {
				return this.auth.clientId;
			}
			connect() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Realtime.connect()", "");
				this.connection.connect();
			}
			close() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "Realtime.close()", "");
				this.connection.close();
			}
		};
		_BaseRealtime.EventEmitter = eventemitter_default;
		var BaseRealtime = _BaseRealtime;
		var Channels2 = class extends eventemitter_default {
			constructor(realtime) {
				super(realtime.logger);
				this.realtime = realtime;
				this.all = /* @__PURE__ */ Object.create(null);
				realtime.connection.connectionManager.on("transport.active", () => {
					this.onTransportActive();
				});
			}
			channelSerials() {
				let serials = {};
				for (const name of keysArray(this.all, true)) {
					const channel = this.all[name];
					if (channel.properties.channelSerial) serials[name] = channel.properties.channelSerial;
				}
				return serials;
			}
			recoverChannels(channelSerials) {
				for (const name of keysArray(channelSerials, true)) {
					const channel = this.get(name);
					channel.properties.channelSerial = channelSerials[name];
				}
			}
			async processChannelMessage(msg) {
				const channelName = msg.channel;
				if (channelName === void 0) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Channels.processChannelMessage()", "received event unspecified channel, action = " + msg.action);
					return;
				}
				const channel = this.all[channelName];
				if (!channel) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Channels.processChannelMessage()", "received event for non-existent channel: " + channelName);
					return;
				}
				await channel.processMessage(msg);
			}
			onTransportActive() {
				for (const channelName in this.all) {
					const channel = this.all[channelName];
					if (channel.state === "attaching" || channel.state === "detaching") channel.checkPendingState();
					else if (channel.state === "suspended") channel._attach(false, null);
					else if (channel.state === "attached") channel.requestState("attaching");
				}
			}
			propogateConnectionInterruption(connectionState, reason) {
				const connectionStateToChannelState = {
					closing: "detached",
					closed: "detached",
					failed: "failed",
					suspended: "suspended"
				};
				const fromChannelStates = [
					"attaching",
					"attached",
					"detaching",
					"suspended"
				];
				const toChannelState = connectionStateToChannelState[connectionState];
				for (const channelId in this.all) {
					const channel = this.all[channelId];
					if (fromChannelStates.includes(channel.state)) channel.notifyState(toChannelState, reason);
				}
			}
			get(name, channelOptions) {
				name = String(name);
				let channel = this.all[name];
				if (!channel) channel = this.all[name] = new realtimechannel_default(this.realtime, name, channelOptions);
				else if (channelOptions) {
					if (channel._shouldReattachToSetOptions(channelOptions, channel.channelOptions)) throw new ErrorInfo({
						message: "Channels.get() cannot be used to set channel options that would cause the channel to reattach: channels.get() returns the existing channel instance.",
						code: 4e4,
						statusCode: 400,
						remediation: "To change params or modes on an existing channel, call channel.setOptions(opts) on the channel returned by channels.get(name). setOptions() re-attaches the channel to apply the new options."
					});
					channel.setOptions(channelOptions);
				}
				return channel;
			}
			getDerived(name, deriveOptions, channelOptions) {
				if (deriveOptions.filter) {
					const filter = toBase64(deriveOptions.filter);
					const match = matchDerivedChannel(name);
					name = `[filter=${filter}${match.qualifierParam}]${match.channelName}`;
				}
				return this.get(name, channelOptions);
			}
			release(name) {
				name = String(name);
				logger_default.logAction(this.logger, logger_default.LOG_MAJOR, "Channels.release()", "Releasing references to channel " + name);
				const channel = this.all[name];
				if (!channel) return;
				const s = channel.state;
				if (s === "initialized" || s === "detached" || s === "failed") {
					delete this.all[name];
					return;
				}
				channel.detach().catch((err) => {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Channels.release()", "Error detaching channel " + name + " prior to release: " + inspectError(err));
				}).then(() => {
					delete this.all[name];
				});
			}
		};
		var baserealtime_default = BaseRealtime;
		function newerThan(item, existing) {
			if (item.isSynthesized() || existing.isSynthesized()) return item.timestamp >= existing.timestamp;
			const itemOrderings = item.parseId(), existingOrderings = existing.parseId();
			if (itemOrderings.msgSerial === existingOrderings.msgSerial) return itemOrderings.index > existingOrderings.index;
			else return itemOrderings.msgSerial > existingOrderings.msgSerial;
		}
		var PresenceMap = class extends eventemitter_default {
			constructor(presence, memberKey, newer = newerThan) {
				super(presence.logger);
				this.presence = presence;
				this.map = /* @__PURE__ */ Object.create(null);
				this.syncInProgress = false;
				this.residualMembers = null;
				this.memberKey = memberKey;
				this.newerThan = newer;
			}
			get(key) {
				return this.map[key];
			}
			getClient(clientId) {
				const map = this.map, result = [];
				for (const key in map) {
					const item = map[key];
					if (item.clientId == clientId && item.action != "absent") result.push(item);
				}
				return result;
			}
			list(params) {
				const map = this.map, clientId = params && params.clientId, connectionId = params && params.connectionId, result = [];
				for (const key in map) {
					const item = map[key];
					if (item.action === "absent") continue;
					if (clientId && clientId != item.clientId) continue;
					if (connectionId && connectionId != item.connectionId) continue;
					result.push(item);
				}
				return result;
			}
			put(item) {
				if (item.action === "enter" || item.action === "update") {
					item = presencemessage_default.fromValues(item);
					item.action = "present";
				}
				const map = this.map, key = this.memberKey(item);
				if (this.residualMembers) delete this.residualMembers[key];
				const existingItem = map[key];
				if (existingItem && !this.newerThan(item, existingItem)) return false;
				map[key] = item;
				return true;
			}
			values() {
				const map = this.map, result = [];
				for (const key in map) {
					const item = map[key];
					if (item.action != "absent") result.push(item);
				}
				return result;
			}
			remove(item) {
				const map = this.map, key = this.memberKey(item);
				const existingItem = map[key];
				if (existingItem && !this.newerThan(item, existingItem)) return false;
				if (this.syncInProgress) {
					item = presencemessage_default.fromValues(item);
					item.action = "absent";
					map[key] = item;
				} else delete map[key];
				return !!existingItem;
			}
			startSync() {
				const map = this.map, syncInProgress = this.syncInProgress;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "PresenceMap.startSync()", "channel = " + this.presence.channel.name + "; syncInProgress = " + syncInProgress);
				if (!this.syncInProgress) {
					this.residualMembers = copy(map);
					this.setInProgress(true);
				}
			}
			endSync() {
				const map = this.map, syncInProgress = this.syncInProgress;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "PresenceMap.endSync()", "channel = " + this.presence.channel.name + "; syncInProgress = " + syncInProgress);
				if (syncInProgress) {
					for (const memberKey in map) if (map[memberKey].action === "absent") delete map[memberKey];
					this.presence._synthesizeLeaves(valuesArray(this.residualMembers));
					for (const memberKey in this.residualMembers) delete map[memberKey];
					this.residualMembers = null;
					this.setInProgress(false);
				}
				this.emit("sync");
			}
			async waitSync() {
				const syncInProgress = this.syncInProgress;
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "PresenceMap.waitSync()", "channel = " + this.presence.channel.name + "; syncInProgress = " + syncInProgress);
				if (!syncInProgress) return;
				await this.once("sync");
			}
			clear() {
				this.map = {};
				this.setInProgress(false);
				this.residualMembers = null;
			}
			setInProgress(inProgress) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "PresenceMap.setInProgress()", "inProgress = " + inProgress);
				this.syncInProgress = inProgress;
				this.presence.syncComplete = !inProgress;
			}
		};
		function getClientId(realtimePresence) {
			return realtimePresence.channel.client.auth.clientId;
		}
		function isAnonymousOrWildcard(realtimePresence) {
			const realtime = realtimePresence.channel.client;
			const clientId = realtime.auth.clientId;
			return (!clientId || clientId === "*") && realtime.connection.state === "connected";
		}
		var RealtimePresence = class extends eventemitter_default {
			constructor(channel) {
				super(channel.logger);
				this.channel = channel;
				this.syncComplete = false;
				this.members = new PresenceMap(this, (item) => item.clientId + ":" + item.connectionId);
				this._myMembers = new PresenceMap(this, (item) => item.clientId);
				this.subscriptions = new eventemitter_default(this.logger);
				this.pendingPresence = [];
			}
			enter(...args) {
				detectV1Callback(args, 0);
				return this._enterImpl(args[0]);
			}
			async _enterImpl(data) {
				if (isAnonymousOrWildcard(this)) throw new ErrorInfo({
					message: "clientId must be specified to enter a presence channel",
					code: 40012,
					statusCode: 400,
					remediation: "Set ClientOptions.clientId (or include clientId in the token) before calling presence.enter() again. To enter on behalf of another identity, use presence.enterClient(otherId, data), which requires the library to be instantiated with an API key or a token bound to a wildcard clientId."
				});
				return this._enterOrUpdateClient(void 0, void 0, data, "enter");
			}
			update(...args) {
				detectV1Callback(args, 0);
				return this._updateImpl(args[0]);
			}
			async _updateImpl(data) {
				if (isAnonymousOrWildcard(this)) throw new ErrorInfo({
					message: "clientId must be specified to update presence data",
					code: 40012,
					statusCode: 400,
					remediation: "Set ClientOptions.clientId (or include clientId in the token) before calling presence.update() again. To update on behalf of another identity, use presence.updateClient(otherId, data), which requires the library to be instantiated with an API key or a token bound to a wildcard clientId."
				});
				return this._enterOrUpdateClient(void 0, void 0, data, "update");
			}
			async enterClient(clientId, data) {
				return this._enterOrUpdateClient(void 0, clientId, data, "enter");
			}
			async updateClient(clientId, data) {
				return this._enterOrUpdateClient(void 0, clientId, data, "update");
			}
			async _enterOrUpdateClient(id, clientId, data, action) {
				const channel = this.channel;
				if (!channel.connectionManager.activeState()) throw channel.connectionManager.getError();
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimePresence." + action + "Client()", "channel = " + channel.name + ", id = " + id + ", client = " + (clientId || "(implicit) " + getClientId(this)));
				const presence = presencemessage_default.fromData(data);
				presence.action = action;
				if (id) presence.id = id;
				if (clientId) presence.clientId = clientId;
				const wirePresMsg = await presence.encode(channel.channelOptions);
				switch (channel.state) {
					case "attached": return channel.sendPresence([wirePresMsg]);
					case "initialized":
					case "detached": channel.attach();
					case "attaching": if (channel.client.options.queueMessages) return new Promise((resolve, reject) => {
						this.pendingPresence.push({
							presence: wirePresMsg,
							callback: (err) => err ? reject(err) : resolve()
						});
					});
					default: {
						const err = new PartialErrorInfo("Unable to " + action + " presence channel while in " + channel.state + " state", 90001);
						err.code = 90001;
						throw err;
					}
				}
			}
			leave(...args) {
				detectV1Callback(args, 0);
				return this._leaveImpl(args[0]);
			}
			async _leaveImpl(data) {
				if (isAnonymousOrWildcard(this)) throw new ErrorInfo({
					message: "clientId must have been specified to enter or leave a presence channel",
					code: 40012,
					statusCode: 400,
					remediation: "To leave a member entered on behalf of another identity, call presence.leaveClient(otherId). A client that never had a clientId has no self-entered member to leave. leaveClient requires the library to be instantiated with an API key or a token bound to a wildcard clientId."
				});
				return this.leaveClient(void 0, data);
			}
			async leaveClient(clientId, data) {
				const channel = this.channel;
				if (!channel.connectionManager.activeState()) throw channel.connectionManager.getError();
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimePresence.leaveClient()", "leaving; channel = " + this.channel.name + ", client = " + clientId);
				const presence = presencemessage_default.fromData(data);
				presence.action = "leave";
				if (clientId) presence.clientId = clientId;
				const wirePresMsg = await presence.encode(channel.channelOptions);
				switch (channel.state) {
					case "attached": return channel.sendPresence([wirePresMsg]);
					case "attaching": if (channel.client.options.queueMessages) return new Promise((resolve, reject) => {
						this.pendingPresence.push({
							presence: wirePresMsg,
							callback: (err) => err ? reject(err) : resolve()
						});
					});
					default: throw new PartialErrorInfo({
						message: "Unable to leave presence channel while in " + channel.state + " state",
						code: 90001,
						remediation: "presence.leave() only works while the channel is attached. From \"suspended\" or \"attaching\", await channel.attach() and retry, since your presence membership is restored when the channel re-attaches. From \"initialized\", \"detached\", or \"failed\" there is nothing to leave: either no member was entered, or the SDK already cleared your membership when the channel left the attached state."
					});
				}
			}
			get(...args) {
				detectV1Callback(args, 0);
				return this._getImpl(args[0]);
			}
			async _getImpl(params) {
				const waitForSync = !params || ("waitForSync" in params ? params.waitForSync : true);
				function toMessages(members2) {
					return params ? members2.list(params) : members2.values();
				}
				if (this.channel.state === "suspended") {
					if (waitForSync) throw ErrorInfo.fromValues({
						statusCode: 400,
						code: 91005,
						message: "Presence state is out of sync due to channel being in the SUSPENDED state",
						remediation: "Wait for the channel to reach \"attached\" before calling presence.get(), or pass { waitForSync: false } to read the last known (stale) members."
					});
					return toMessages(this.members);
				}
				await this.channel.ensureAttached();
				if ((this.channel._mode & flags.PRESENCE_SUBSCRIBE) === 0) {
					const err = new ErrorInfo({
						message: "The channel was attached without the presence_subscribe mode, so the server has not delivered any members to this client.",
						code: 91008,
						statusCode: 400,
						remediation: "Include \"presence_subscribe\" in the channel modes: realtime.channels.get(name, { modes: [\"presence_subscribe\", ...] }), or call channel.setOptions({ modes: [...] }) on an existing channel to trigger a reattach. Alternatively, omit modes entirely and ensure your token/API-key capability permits subscribe on this channel. If you have the Ably CLI installed, `ably auth keys list` shows your key's capabilities."
					});
					if (this.channel.client.options.strictMode === true) throw err;
					logger_default.logActionNoStrip(this.logger, logger_default.LOG_ERROR, "RealtimePresence.get()", err.message + "; remediation=" + err.remediation + logger_default.silentFailureLogSuffix());
				}
				const members = this.members;
				if (waitForSync) await members.waitSync();
				return toMessages(this.members);
			}
			history(...args) {
				detectV1Callback(args, 0);
				return this._historyImpl(args[0]);
			}
			async _historyImpl(params) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimePresence.history()", "channel = " + this.name);
				const restMixin = this.channel.client.rest.presenceMixin;
				if (params && params.untilAttach) if (this.channel.state === "attached") {
					delete params.untilAttach;
					params.from_serial = this.channel.properties.attachSerial;
				} else throw new ErrorInfo({
					message: "option untilAttach requires the channel to be attached, was: " + this.channel.state,
					code: 4e4,
					statusCode: 400,
					remediation: "Await channel.attach() before calling presence.history({ untilAttach: true })."
				});
				return restMixin.history(this, params);
			}
			setPresence(presenceSet, isSync, syncChannelSerial) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimePresence.setPresence()", "received presence for " + presenceSet.length + " participants; syncChannelSerial = " + syncChannelSerial);
				let syncCursor, match;
				const members = this.members, myMembers = this._myMembers, broadcastMessages = [], connId = this.channel.connectionManager.connectionId;
				if (isSync) {
					this.members.startSync();
					if (syncChannelSerial && (match = syncChannelSerial.match(/^[\w-]+:(.*)$/))) syncCursor = match[1];
				}
				for (let presence of presenceSet) switch (presence.action) {
					case "leave":
						if (members.remove(presence)) broadcastMessages.push(presence);
						if (presence.connectionId === connId && !presence.isSynthesized()) myMembers.remove(presence);
						break;
					case "enter":
					case "present":
					case "update":
						if (members.put(presence)) broadcastMessages.push(presence);
						if (presence.connectionId === connId) myMembers.put(presence);
						break;
				}
				if (isSync && !syncCursor) {
					members.endSync();
					this.channel.syncChannelSerial = null;
				}
				for (let i = 0; i < broadcastMessages.length; i++) {
					const presence = broadcastMessages[i];
					this.subscriptions.emit(presence.action, presence);
				}
			}
			onAttached(hasPresence) {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimePresence.onAttached()", "channel = " + this.channel.name + ", hasPresence = " + hasPresence);
				if (hasPresence) this.members.startSync();
				else {
					this._synthesizeLeaves(this.members.values());
					this.members.clear();
				}
				this._ensureMyMembersPresent();
				const pendingPresence = this.pendingPresence, pendingPresCount = pendingPresence.length;
				if (pendingPresCount) {
					this.pendingPresence = [];
					const presenceArray = [];
					const multicaster = multicaster_default.create(this.logger);
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimePresence.onAttached", "sending " + pendingPresCount + " queued presence messages");
					for (let i = 0; i < pendingPresCount; i++) {
						const event = pendingPresence[i];
						presenceArray.push(event.presence);
						multicaster.push(event.callback);
					}
					this.channel.sendPresence(presenceArray).then(() => multicaster()).catch((err) => multicaster(err));
				}
			}
			actOnChannelState(state, hasPresence, err) {
				switch (state) {
					case "attached":
						this.onAttached(hasPresence);
						break;
					case "detached":
					case "failed":
						this._clearMyMembers();
						this.members.clear();
					case "suspended":
						this.failPendingPresence(err);
						break;
				}
			}
			failPendingPresence(err) {
				if (this.pendingPresence.length) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "RealtimeChannel.failPendingPresence", "channel; name = " + this.channel.name + ", err = " + inspectError(err));
					for (let i = 0; i < this.pendingPresence.length; i++) try {
						this.pendingPresence[i].callback(err);
					} catch (e) {}
					this.pendingPresence = [];
				}
			}
			/**
			* RTL3d: re-queue presence messages that were moved off the connection-wide
			* queue onto this channel's presence queue, to be sent once the channel next
			* reaches the ATTACHED state (RTP5b).
			*/
			requeuePresenceMessages(presenceMessages, callback) {
				for (const presence of presenceMessages) this.pendingPresence.push({
					presence,
					callback
				});
			}
			_clearMyMembers() {
				this._myMembers.clear();
			}
			_ensureMyMembersPresent() {
				const myMembers = this._myMembers;
				const connId = this.channel.connectionManager.connectionId;
				for (const memberKey in myMembers.map) {
					const entry = myMembers.map[memberKey];
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "RealtimePresence._ensureMyMembersPresent()", "Auto-reentering clientId \"" + entry.clientId + "\" into the presence set");
					const id = entry.connectionId === connId ? entry.id : void 0;
					this._enterOrUpdateClient(id, entry.clientId, entry.data, "enter").catch((err) => {
						const wrappedErr = new ErrorInfo({
							message: "Presence auto re-enter failed",
							code: 91004,
							statusCode: 400,
							cause: err,
							remediation: "Listen for the channel \"update\" event and call presence.enter(...) again once the channel is attached. For a member entered on behalf of another clientId, call presence.enterClient(clientId, data) instead."
						});
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "RealtimePresence._ensureMyMembersPresent()", "Presence auto re-enter failed; reason = " + inspectError(err));
						const change = new channelstatechange_default(this.channel.state, this.channel.state, true, false, wrappedErr);
						this.channel.emit("update", change);
					});
				}
			}
			_synthesizeLeaves(items) {
				const subscriptions = this.subscriptions;
				items.forEach(function(item) {
					const presence = presencemessage_default.fromValues({
						action: "leave",
						connectionId: item.connectionId,
						clientId: item.clientId,
						data: item.data,
						encoding: item.encoding,
						timestamp: Platform.Config.now()
					});
					subscriptions.emit("leave", presence);
				});
			}
			subscribe(..._args) {
				detectV1Callback(_args, 2);
				return this._subscribeImpl(_args);
			}
			async _subscribeImpl(_args) {
				const args = realtimechannel_default.processListenerArgs(_args);
				const event = args[0];
				const listener = args[1];
				const channel = this.channel;
				if (channel.state === "failed") throw ErrorInfo.fromValues(channel.invalidStateError());
				this.subscriptions.on(event, listener);
				if (channel.channelOptions.attachOnSubscribe !== false) await channel.attach();
			}
			unsubscribe(..._args) {
				const args = realtimechannel_default.processListenerArgs(_args);
				const event = args[0];
				const listener = args[1];
				this.subscriptions.off(event, listener);
			}
		};
		var realtimepresence_default = RealtimePresence;
		var shortName = TransportNames.WebSocket;
		function isNodeWebSocket(ws) {
			return !!ws.on;
		}
		var WebSocketTransport = class extends transport_default {
			constructor(connectionManager, auth, params) {
				super(connectionManager, auth, params);
				this.shortName = shortName;
				params.heartbeats = Platform.Config.useProtocolHeartbeats;
				this.wsHost = params.host;
			}
			static isAvailable() {
				return !!Platform.Config.WebSocket;
			}
			createWebSocket(uri, connectParams) {
				this.uri = uri + toQueryString(connectParams);
				return new Platform.Config.WebSocket(this.uri);
			}
			toString() {
				return "WebSocketTransport; uri=" + this.uri;
			}
			connect() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.connect()", "starting");
				transport_default.prototype.connect.call(this);
				const self2 = this, params = this.params, options = params.options;
				const wsUri = (options.tls ? "wss://" : "ws://") + this.wsHost + ":" + defaults_default.getPort(options) + "/";
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.connect()", "uri: " + wsUri);
				whenPromiseSettles(this.auth.getAuthParams(), function(err, authParams) {
					if (self2.isDisposed) return;
					let paramStr = "";
					for (const param in authParams) paramStr += " " + param + ": " + authParams[param] + ";";
					logger_default.logAction(self2.logger, logger_default.LOG_MINOR, "WebSocketTransport.connect()", "authParams:" + paramStr + " err: " + err);
					if (err) {
						self2.disconnect(err);
						return;
					}
					const connectParams = params.getConnectParams(authParams);
					try {
						const wsConnection = self2.wsConnection = self2.createWebSocket(wsUri, connectParams);
						wsConnection.binaryType = Platform.Config.binaryType;
						wsConnection.onopen = function() {
							self2.onWsOpen();
						};
						wsConnection.onclose = function(ev) {
							self2.onWsClose(ev);
						};
						wsConnection.onmessage = function(ev) {
							self2.onWsData(ev.data);
						};
						wsConnection.onerror = function(ev) {
							self2.onWsError(ev);
						};
						if (isNodeWebSocket(wsConnection)) wsConnection.on("ping", function() {
							self2.onActivity();
						});
					} catch (e) {
						logger_default.logAction(self2.logger, logger_default.LOG_ERROR, "WebSocketTransport.connect()", "Unexpected exception creating websocket: err = " + (e.stack || e.message));
						self2.disconnect(e);
					}
				});
			}
			send(message) {
				const wsConnection = this.wsConnection;
				if (!wsConnection) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "WebSocketTransport.send()", "No socket connection");
					return;
				}
				try {
					wsConnection.send(serialize2(message, this.connectionManager.realtime._MsgPack, this.params.format));
				} catch (e) {
					const msg = "Exception from ws connection when trying to send: " + inspectError(e);
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "WebSocketTransport.send()", msg);
					this.finish("disconnected", new ErrorInfo(msg, 5e4, 500));
				}
			}
			onWsData(data) {
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "WebSocketTransport.onWsData()", "data received; length = " + data.length + "; type = " + typeof data);
				try {
					this.onProtocolMessage(deserialize(data, this.connectionManager.realtime._MsgPack, this.connectionManager.realtime._RealtimePresence, this.connectionManager.realtime._Annotations, this.connectionManager.realtime._liveObjectsPlugin, this.format));
				} catch (e) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "WebSocketTransport.onWsData()", "Unexpected exception handing channel message: " + e.stack);
				}
			}
			onWsOpen() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.onWsOpen()", "opened WebSocket");
				this.emit("preconnect");
			}
			onWsClose(ev) {
				let wasClean, code;
				if (typeof ev == "object") {
					code = ev.code;
					wasClean = ev.wasClean || code === 1e3;
				} else {
					code = ev;
					wasClean = code == 1e3;
				}
				delete this.wsConnection;
				if (wasClean) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.onWsClose()", "Cleanly closed WebSocket");
					const err = new ErrorInfo("Websocket closed", 80003, 400);
					this.finish("disconnected", err);
				} else {
					const msg = "Unclean disconnection of WebSocket ; code = " + code, err = new ErrorInfo(msg, 80003, 400);
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.onWsClose()", msg);
					this.finish("disconnected", err);
				}
				this.emit("disposed");
			}
			onWsError(err) {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.onError()", "Error from WebSocket: " + err.message);
				Platform.Config.nextTick(() => {
					this.disconnect(Error(err.message));
				});
			}
			dispose() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "WebSocketTransport.dispose()", "");
				this.isDisposed = true;
				const wsConnection = this.wsConnection;
				if (wsConnection) {
					wsConnection.onmessage = function() {};
					delete this.wsConnection;
					Platform.Config.nextTick(() => {
						logger_default.logAction(this.logger, logger_default.LOG_MICRO, "WebSocketTransport.dispose()", "closing websocket");
						if (!wsConnection) throw new Error("WebSocketTransport.dispose(): wsConnection is not defined");
						wsConnection.close();
					});
				}
			}
		};
		var websockettransport_default = WebSocketTransport;
		var FilteredSubscriptions = class {
			static subscribeFilter(channel, filter, listener) {
				const filteredListener = (m) => {
					var _a2, _b, _c, _d, _e, _f;
					const mapping = {
						name: m.name,
						refTimeserial: (_b = (_a2 = m.extras) == null ? void 0 : _a2.ref) == null ? void 0 : _b.timeserial,
						refType: (_d = (_c = m.extras) == null ? void 0 : _c.ref) == null ? void 0 : _d.type,
						isRef: !!((_f = (_e = m.extras) == null ? void 0 : _e.ref) == null ? void 0 : _f.timeserial),
						clientId: m.clientId
					};
					if (Object.entries(filter).find(([key, value]) => value !== void 0 ? mapping[key] !== value : false)) return;
					listener(m);
				};
				this.addFilteredSubscription(channel, filter, listener, filteredListener);
				channel.subscriptions.on(filteredListener);
			}
			static addFilteredSubscription(channel, filter, realListener, filteredListener) {
				var _a2;
				if (!channel.filteredSubscriptions) channel.filteredSubscriptions = /* @__PURE__ */ new Map();
				if (channel.filteredSubscriptions.has(realListener)) {
					const realListenerMap = channel.filteredSubscriptions.get(realListener);
					realListenerMap.set(filter, ((_a2 = realListenerMap == null ? void 0 : realListenerMap.get(filter)) == null ? void 0 : _a2.concat(filteredListener)) || [filteredListener]);
				} else channel.filteredSubscriptions.set(realListener, /* @__PURE__ */ new Map([[filter, [filteredListener]]]));
			}
			static getAndDeleteFilteredSubscriptions(channel, filter, realListener) {
				if (!channel.filteredSubscriptions) return [];
				if (!realListener && filter) return Array.from(channel.filteredSubscriptions.entries()).map(([key, filterMaps]) => {
					var _a2;
					let listenerMaps = filterMaps.get(filter);
					filterMaps.delete(filter);
					if (filterMaps.size === 0) (_a2 = channel.filteredSubscriptions) == null || _a2.delete(key);
					return listenerMaps;
				}).reduce((prev, cur) => cur ? prev.concat(...cur) : prev, []);
				if (!realListener || !channel.filteredSubscriptions.has(realListener)) return [];
				const realListenerMap = channel.filteredSubscriptions.get(realListener);
				if (!filter) {
					const listeners2 = Array.from(realListenerMap.values()).reduce((prev, cur) => prev.concat(...cur), []);
					channel.filteredSubscriptions.delete(realListener);
					return listeners2;
				}
				let listeners = realListenerMap.get(filter);
				realListenerMap.delete(filter);
				return listeners || [];
			}
		};
		var _DefaultRealtime = class _DefaultRealtime extends baserealtime_default {
			constructor(options) {
				var _a2;
				const MsgPack = _DefaultRealtime._MsgPack;
				if (!MsgPack) throw new Error("Expected DefaultRealtime._MsgPack to have been set");
				super(defaults_default.objectifyOptions(options, true, "Realtime", logger_default.defaultLogger, __spreadProps(__spreadValues({}, allCommonModularPlugins), {
					Crypto: (_a2 = _DefaultRealtime.Crypto) != null ? _a2 : void 0,
					MsgPack,
					RealtimePresence: {
						RealtimePresence: realtimepresence_default,
						PresenceMessage: presencemessage_default,
						WirePresenceMessage
					},
					Annotations: {
						Annotation: annotation_default,
						WireAnnotation,
						RealtimeAnnotations: realtimeannotations_default,
						RestAnnotations: restannotations_default
					},
					WebSocketTransport: websockettransport_default,
					MessageInteractions: FilteredSubscriptions
				})));
			}
			static get Crypto() {
				if (this._Crypto === null) throw new Error("Encryption not enabled; use ably.encryption.js instead");
				return this._Crypto;
			}
			static set Crypto(newValue) {
				this._Crypto = newValue;
			}
		};
		_DefaultRealtime.Utils = utils_exports;
		_DefaultRealtime.ConnectionManager = connectionmanager_default;
		_DefaultRealtime.ProtocolMessage = protocolmessage_default;
		_DefaultRealtime._Crypto = null;
		_DefaultRealtime.Message = DefaultMessage;
		_DefaultRealtime.PresenceMessage = DefaultPresenceMessage;
		_DefaultRealtime.Annotation = DefaultAnnotation;
		_DefaultRealtime._MsgPack = null;
		_DefaultRealtime._Http = Http;
		_DefaultRealtime._PresenceMap = PresenceMap;
		_DefaultRealtime._MessageEncoding = MessageEncoding;
		var DefaultRealtime = _DefaultRealtime;
		var import_crypto = __toESM(__require("crypto"));
		var BufferUtils = class {
			constructor() {
				this.base64CharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				this.hexCharSet = "0123456789abcdef";
			}
			base64Decode(string) {
				return Buffer.from(string, "base64");
			}
			base64Encode(buffer) {
				return this.toBuffer(buffer).toString("base64");
			}
			base64UrlEncode(buffer) {
				return this.toBuffer(buffer).toString("base64url");
			}
			areBuffersEqual(buffer1, buffer2) {
				if (!buffer1 || !buffer2) return false;
				return this.toBuffer(buffer1).compare(this.toBuffer(buffer2)) == 0;
			}
			byteLength(buffer) {
				return buffer.byteLength;
			}
			hexDecode(string) {
				return Buffer.from(string, "hex");
			}
			hexEncode(buffer) {
				return this.toBuffer(buffer).toString("hex");
			}
			isBuffer(buffer) {
				return Buffer.isBuffer(buffer) || buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer);
			}
			toArrayBuffer(buffer) {
				const nodeBuffer = this.toBuffer(buffer);
				return nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength);
			}
			toBuffer(buffer) {
				if (Buffer.isBuffer(buffer)) return buffer;
				if (buffer instanceof ArrayBuffer) return Buffer.from(buffer);
				return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
			}
			arrayBufferViewToBuffer(arrayBufferView) {
				return this.toBuffer(arrayBufferView);
			}
			utf8Decode(buffer) {
				if (!this.isBuffer(buffer)) throw new Error("Expected input of utf8Decode to be a buffer, arraybuffer, or view");
				return this.toBuffer(buffer).toString("utf8");
			}
			utf8Encode(string) {
				return Buffer.from(string, "utf8");
			}
			concat(buffers) {
				return Buffer.concat(buffers.map((x) => this.toBuffer(x)));
			}
			sha256(message) {
				const messageBuffer = this.toBuffer(message);
				return import_crypto.default.createHash("SHA256").update(messageBuffer).digest();
			}
			hmacSha256(message, key) {
				const messageBuffer = this.toBuffer(message);
				const keyBuffer = this.toBuffer(key);
				return import_crypto.default.createHmac("SHA256", keyBuffer).update(messageBuffer).digest();
			}
		};
		var bufferutils_default = new BufferUtils();
		var import_crypto2 = __toESM(__require("crypto"));
		var import_util = __toESM(__require("util"));
		var createCryptoClass = function(bufferUtils) {
			var DEFAULT_ALGORITHM = "aes";
			var DEFAULT_KEYLENGTH = 256;
			var DEFAULT_MODE = "cbc";
			var DEFAULT_BLOCKLENGTH = 16;
			async function generateRandom(bytes) {
				return import_util.default.promisify(import_crypto2.default.randomBytes)(bytes);
			}
			function getPaddedLength(plaintextLength) {
				return plaintextLength + DEFAULT_BLOCKLENGTH & -16;
			}
			function validateCipherParams(params) {
				if (params.algorithm === "aes" && params.mode === "cbc") {
					if (params.keyLength === 128 || params.keyLength === 256) return;
					throw new Error("Unsupported key length " + params.keyLength + " for aes-cbc encryption. Encryption key must be 128 or 256 bits (16 or 32 ASCII characters)");
				}
			}
			function normaliseBase64(string) {
				return string.replace("_", "/").replace("-", "+");
			}
			function filledBuffer(length, value) {
				var result = Buffer.alloc(length);
				result.fill(value);
				return result;
			}
			var pkcs5Padding = [filledBuffer(16, 16)];
			for (var i = 1; i <= 16; i++) pkcs5Padding.push(filledBuffer(i, i));
			class CipherParams {
				constructor(algorithm, keyLength, mode, key) {
					this.algorithm = algorithm;
					this.keyLength = keyLength;
					this.mode = mode;
					this.key = key;
					this.iv = null;
				}
			}
			function isInstCipherParams(params) {
				return !!(params.algorithm && params.key && params.keyLength && params.mode);
			}
			class Crypto2 {
				/**
				* Obtain a complete CipherParams instance from the provided params, filling
				* in any not provided with default values, calculating a keyLength from
				* the supplied key, and validating the result.
				* @param params an object containing at a minimum a `key` key with value the
				* key, as either a binary or a base64-encoded string.
				* May optionally also contain: algorithm (defaults to AES),
				* mode (defaults to 'cbc')
				*/
				static getDefaultParams(params) {
					var key;
					if (!params.key) throw new Error("Crypto.getDefaultParams: a key is required");
					if (typeof params.key === "string") key = bufferUtils.base64Decode(normaliseBase64(params.key));
					else if (params.key instanceof ArrayBuffer) key = Buffer.from(params.key);
					else key = params.key;
					var algorithm = params.algorithm || DEFAULT_ALGORITHM;
					var keyLength = key.length * 8;
					var mode = params.mode || DEFAULT_MODE;
					var cipherParams = new CipherParams(algorithm, keyLength, mode, key);
					if (params.keyLength && params.keyLength !== cipherParams.keyLength) throw new Error("Crypto.getDefaultParams: a keyLength of " + params.keyLength + " was specified, but the key actually has length " + cipherParams.keyLength);
					validateCipherParams(cipherParams);
					return cipherParams;
				}
				/**
				* Generate a random encryption key from the supplied keylength (or the
				* default keyLength if none supplied) as a Buffer
				* @param keyLength (optional) the required keyLength in bits
				*/
				static async generateRandomKey(keyLength) {
					try {
						return generateRandom((keyLength || DEFAULT_KEYLENGTH) / 8);
					} catch (err) {
						throw new ErrorInfo("Failed to generate random key: " + err.message, 500, 5e4);
					}
				}
				/**
				* Internal; get a ChannelCipher instance based on the given cipherParams
				* @param params either a CipherParams instance or some subset of its
				* fields that includes a key
				*/
				static getCipher(params, logger) {
					var _a2;
					var cipherParams = isInstCipherParams(params) ? params : this.getDefaultParams(params);
					return {
						cipherParams,
						cipher: new CBCCipher(cipherParams, (_a2 = params.iv) != null ? _a2 : null, logger)
					};
				}
			}
			Crypto2.CipherParams = CipherParams;
			class CBCCipher {
				constructor(params, iv, logger) {
					this.logger = logger;
					this.encryptCipher = null;
					this.algorithm = params.algorithm + "-" + String(params.keyLength) + "-" + params.mode;
					this.key = params.key;
					this.iv = iv;
				}
				async encrypt(plaintext) {
					logger_default.logAction(this.logger, logger_default.LOG_MICRO, "CBCCipher.encrypt()", "");
					const iv = await this.getIv();
					if (!this.encryptCipher) this.encryptCipher = import_crypto2.default.createCipheriv(this.algorithm, this.key, iv);
					var plaintextBuffer = bufferUtils.toBuffer(plaintext);
					var plaintextLength = plaintextBuffer.length, paddedLength = getPaddedLength(plaintextLength);
					var cipherOut = this.encryptCipher.update(Buffer.concat([plaintextBuffer, pkcs5Padding[paddedLength - plaintextLength]]));
					return Buffer.concat([iv, cipherOut]);
				}
				async decrypt(ciphertext) {
					var decryptCipher = import_crypto2.default.createDecipheriv(this.algorithm, this.key, ciphertext.slice(0, DEFAULT_BLOCKLENGTH)), plaintext = decryptCipher.update(ciphertext.slice(DEFAULT_BLOCKLENGTH)), final = decryptCipher.final();
					if (final && final.length) plaintext = Buffer.concat([plaintext, final]);
					return plaintext;
				}
				async getIv() {
					if (this.iv) {
						var iv = this.iv;
						this.iv = null;
						return iv;
					}
					var randomBlock = await generateRandom(DEFAULT_BLOCKLENGTH);
					if (!this.encryptCipher) return randomBlock;
					else return this.encryptCipher.update(randomBlock);
				}
			}
			return Crypto2;
		};
		var import_got = __toESM(require_source());
		var import_http5 = __toESM(__require("http"));
		var import_https = __toESM(__require("https"));
		var globalAgentPool = [];
		var _a;
		var http_default = (_a = class {
			constructor(client) {
				this.agent = null;
				this.supportsAuthHeaders = true;
				this.supportsLinkHeaders = true;
				this.checkConnectivity = async () => {
					var _a2, _b, _c, _d, _e;
					if ((_a2 = this.client) == null ? void 0 : _a2.options.disableConnectivityCheck) return true;
					const connectivityCheckUrl = ((_b = this.client) == null ? void 0 : _b.options.connectivityCheckUrl) || defaults_default.connectivityCheckUrl;
					const connectivityCheckParams = (_d = (_c = this.client) == null ? void 0 : _c.options.connectivityCheckParams) != null ? _d : null;
					const connectivityUrlIsDefault = !((_e = this.client) == null ? void 0 : _e.options.connectivityCheckUrl);
					const { error, statusCode, body } = await this.doUri(HttpMethods_default.Get, connectivityCheckUrl, null, null, connectivityCheckParams);
					if (!error && !connectivityUrlIsDefault) return isSuccessCode(statusCode);
					return !error && (body == null ? void 0 : body.toString().trim()) === "yes";
				};
				this.client = client != null ? client : null;
			}
			async doUri(method, uri, headers, body, params) {
				var _a2;
				const agentOptions = this.client && this.client.options.restAgentOptions || defaults_default.restAgentOptions;
				const doOptions = {
					headers: headers || void 0,
					responseType: "buffer"
				};
				if (!this.agent) {
					const persistedAgent = (_a2 = globalAgentPool.find((x) => shallowEquals(agentOptions, x.options))) == null ? void 0 : _a2.agents;
					if (persistedAgent) this.agent = persistedAgent;
					else {
						this.agent = {
							http: new import_http5.default.Agent(agentOptions),
							https: new import_https.default.Agent(agentOptions)
						};
						globalAgentPool.push({
							options: agentOptions,
							agents: this.agent
						});
					}
				}
				if (body) doOptions.body = body;
				if (params) doOptions.searchParams = params;
				doOptions.agent = this.agent;
				doOptions.url = uri;
				doOptions.timeout = { request: (this.client && this.client.options.timeouts || defaults_default.TIMEOUTS).httpRequestTimeout };
				doOptions.retry = { limit: 0 };
				try {
					const res = await import_got.default[method](doOptions);
					return this._handler(null, res, res.body);
				} catch (err) {
					if (err instanceof import_got.default.HTTPError) return this._handler(null, err.response, err.response.body);
					return this._handler(err);
				}
			}
			shouldFallback(err) {
				const { code, statusCode } = err;
				return code === "ENETUNREACH" || code === "EHOSTUNREACH" || code === "EHOSTDOWN" || code === "ETIMEDOUT" || code === "ESOCKETTIMEDOUT" || code === "ENOTFOUND" || code === "ECONNRESET" || code === "ECONNREFUSED" || statusCode >= 500 && statusCode <= 504;
			}
			_handler(err, response, body) {
				var _a2;
				if (err) return { error: err };
				const statusCode = response.statusCode, headers = response.headers;
				if (statusCode >= 300) {
					switch (headers["content-type"]) {
						case "application/json":
							body = JSON.parse(body);
							break;
						case "application/x-msgpack":
							if (!((_a2 = this.client) == null ? void 0 : _a2._MsgPack)) return { error: createMissingPluginError("MsgPack") };
							body = this.client._MsgPack.decode(body);
							break;
					}
					return {
						error: body.error ? ErrorInfo.fromValues(body.error) : new ErrorInfo(headers["x-ably-errormessage"] || "Error response received from server: " + statusCode + " body was: " + Platform.Config.inspect(body), Number(headers["x-ably-errorcode"]), statusCode),
						body,
						headers,
						unpacked: true,
						statusCode
					};
				}
				return {
					error: null,
					body,
					headers,
					unpacked: false,
					statusCode
				};
			}
		}, _a.methods = [
			HttpMethods_default.Get,
			HttpMethods_default.Delete,
			HttpMethods_default.Post,
			HttpMethods_default.Put,
			HttpMethods_default.Patch
		], _a.methodsWithoutBody = [HttpMethods_default.Get, HttpMethods_default.Delete], _a.methodsWithBody = [
			HttpMethods_default.Post,
			HttpMethods_default.Put,
			HttpMethods_default.Patch
		], _a);
		var import_crypto3 = __toESM(__require("crypto"));
		var import_ws = __toESM(require_ws());
		var import_util2 = __toESM(__require("util"));
		var config_default = {
			agent: "nodejs/" + process.versions.node,
			logTimestamps: true,
			userAgent: null,
			binaryType: "nodebuffer",
			WebSocket: import_ws.default,
			useProtocolHeartbeats: false,
			supportsBinary: true,
			preferBinary: true,
			nextTick: process.nextTick,
			setTimeout: globalThis.setTimeout,
			clearTimeout: globalThis.clearTimeout,
			now: Date.now,
			inspect: import_util2.default.inspect,
			stringByteSize: Buffer.byteLength,
			inherits: import_util2.default.inherits,
			addEventListener: null,
			getRandomArrayBuffer: async function(byteLength) {
				return import_util2.default.promisify(import_crypto3.default.randomBytes)(byteLength);
			}
		};
		var XHRStates = /* @__PURE__ */ ((XHRStates2) => {
			XHRStates2[XHRStates2["REQ_SEND"] = 0] = "REQ_SEND";
			XHRStates2[XHRStates2["REQ_RECV"] = 1] = "REQ_RECV";
			XHRStates2[XHRStates2["REQ_RECV_POLL"] = 2] = "REQ_RECV_POLL";
			XHRStates2[XHRStates2["REQ_RECV_STREAM"] = 3] = "REQ_RECV_STREAM";
			return XHRStates2;
		})(XHRStates || {});
		var XHRStates_default = XHRStates;
		function shouldBeErrorAction(err) {
			const UNRESOLVABLE_ERROR_CODES = [
				80015,
				80017,
				80030
			];
			if (err.code) {
				if (auth_default.isTokenErr(err)) return false;
				if (UNRESOLVABLE_ERROR_CODES.includes(err.code)) return true;
				return err.code >= 4e4 && err.code < 5e4;
			} else return false;
		}
		function protocolMessageFromRawError(err) {
			if (shouldBeErrorAction(err)) return [fromValues({
				action: actions.ERROR,
				error: err
			})];
			else return [fromValues({
				action: actions.DISCONNECTED,
				error: err
			})];
		}
		var CometTransport = class extends transport_default {
			constructor(connectionManager, auth, params) {
				super(connectionManager, auth, params, true);
				this.onAuthUpdated = (tokenDetails) => {
					this.authParams = { access_token: tokenDetails.token };
				};
				this.stream = "stream" in params ? params.stream : true;
				this.sendRequest = null;
				this.recvRequest = null;
				this.pendingCallback = null;
				this.pendingItems = null;
			}
			connect() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.connect()", "starting");
				transport_default.prototype.connect.call(this);
				const params = this.params;
				const options = params.options;
				const host = params.host || options.primaryDomain;
				const port = defaults_default.getPort(options);
				const cometScheme = options.tls ? "https://" : "http://";
				this.baseUri = cometScheme + host + ":" + port + "/comet/";
				const connectUri = this.baseUri + "connect";
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.connect()", "uri: " + connectUri);
				whenPromiseSettles(this.auth.getAuthParams(), (err, authParams) => {
					if (err) {
						this.disconnect(err);
						return;
					}
					if (this.isDisposed) return;
					this.authParams = authParams;
					const connectParams = this.params.getConnectParams(authParams);
					if ("stream" in connectParams) this.stream = connectParams.stream;
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.connect()", "connectParams:" + toQueryString(connectParams));
					let preconnected = false;
					const connectRequest = this.recvRequest = this.createRequest(connectUri, null, connectParams, null, this.stream ? XHRStates_default.REQ_RECV_STREAM : XHRStates_default.REQ_RECV);
					connectRequest.on("data", (data) => {
						if (!this.recvRequest) return;
						if (!preconnected) {
							preconnected = true;
							this.emit("preconnect");
						}
						this.onData(data);
					});
					connectRequest.on("complete", (err2) => {
						if (!this.recvRequest) err2 = err2 || new ErrorInfo("Request cancelled", 80003, 400);
						this.recvRequest = null;
						if (!preconnected && !err2) {
							preconnected = true;
							this.emit("preconnect");
						}
						this.onActivity();
						if (err2) {
							if (err2.code) this.onData(protocolMessageFromRawError(err2));
							else this.disconnect(err2);
							return;
						}
						Platform.Config.nextTick(() => {
							this.recv();
						});
					});
					connectRequest.exec();
				});
			}
			requestClose() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.requestClose()");
				this._requestCloseOrDisconnect(true);
			}
			requestDisconnect() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.requestDisconnect()");
				this._requestCloseOrDisconnect(false);
			}
			_requestCloseOrDisconnect(closing) {
				const closeOrDisconnectUri = closing ? this.closeUri : this.disconnectUri;
				if (closeOrDisconnectUri) {
					const request = this.createRequest(closeOrDisconnectUri, null, this.authParams, null, XHRStates_default.REQ_SEND);
					request.on("complete", (err) => {
						if (err) {
							logger_default.logAction(this.logger, logger_default.LOG_ERROR, "CometTransport.request" + (closing ? "Close()" : "Disconnect()"), "request returned err = " + inspectError(err));
							this.finish("disconnected", err);
						}
					});
					request.exec();
				}
			}
			dispose() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.dispose()", "");
				if (!this.isDisposed) {
					this.isDisposed = true;
					if (this.recvRequest) {
						logger_default.logAction(this.logger, logger_default.LOG_MINOR, "CometTransport.dispose()", "aborting recv request");
						this.recvRequest.abort();
						this.recvRequest = null;
					}
					this.finish("disconnected", connectionerrors_default.disconnected());
					Platform.Config.nextTick(() => {
						this.emit("disposed");
					});
				}
			}
			onConnect(message) {
				var _a2;
				if (this.isDisposed) return;
				const connectionStr = (_a2 = message.connectionDetails) == null ? void 0 : _a2.connectionKey;
				transport_default.prototype.onConnect.call(this, message);
				const baseConnectionUri = this.baseUri + connectionStr;
				logger_default.logAction(this.logger, logger_default.LOG_MICRO, "CometTransport.onConnect()", "baseUri = " + baseConnectionUri);
				this.sendUri = baseConnectionUri + "/send";
				this.recvUri = baseConnectionUri + "/recv";
				this.closeUri = baseConnectionUri + "/close";
				this.disconnectUri = baseConnectionUri + "/disconnect";
			}
			send(message) {
				if (this.sendRequest) {
					this.pendingItems = this.pendingItems || [];
					this.pendingItems.push(message);
					return;
				}
				const pendingItems = this.pendingItems || [];
				pendingItems.push(message);
				this.pendingItems = null;
				this.sendItems(pendingItems);
			}
			sendAnyPending() {
				const pendingItems = this.pendingItems;
				if (!pendingItems) return;
				this.pendingItems = null;
				this.sendItems(pendingItems);
			}
			sendItems(items) {
				const sendRequest = this.sendRequest = this.createRequest(this.sendUri, null, this.authParams, this.encodeRequest(items), XHRStates_default.REQ_SEND);
				sendRequest.on("complete", (err, data) => {
					if (err) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "CometTransport.sendItems()", "on complete: err = " + inspectError(err));
					this.sendRequest = null;
					if (err) {
						if (err.code) this.onData(protocolMessageFromRawError(err));
						else this.disconnect(err);
						return;
					}
					if (data) this.onData(data);
					if (this.pendingItems) Platform.Config.nextTick(() => {
						if (!this.sendRequest) this.sendAnyPending();
					});
				});
				sendRequest.exec();
			}
			recv() {
				if (this.recvRequest) return;
				if (!this.isConnected) return;
				const recvRequest = this.recvRequest = this.createRequest(this.recvUri, null, this.authParams, null, this.stream ? XHRStates_default.REQ_RECV_STREAM : XHRStates_default.REQ_RECV_POLL);
				recvRequest.on("data", (data) => {
					this.onData(data);
				});
				recvRequest.on("complete", (err) => {
					this.recvRequest = null;
					this.onActivity();
					if (err) {
						if (err.code) this.onData(protocolMessageFromRawError(err));
						else this.disconnect(err);
						return;
					}
					Platform.Config.nextTick(() => {
						this.recv();
					});
				});
				recvRequest.exec();
			}
			onData(responseData) {
				try {
					const items = this.decodeResponse(responseData);
					if (items && items.length) for (let i = 0; i < items.length; i++) this.onProtocolMessage(fromDeserialized(items[i], this.connectionManager.realtime._RealtimePresence, this.connectionManager.realtime._Annotations, this.connectionManager.realtime._liveObjectsPlugin));
				} catch (e) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "CometTransport.onData()", "Unexpected exception handing channel event: " + e.stack);
				}
			}
			encodeRequest(requestItems) {
				return JSON.stringify(requestItems);
			}
			decodeResponse(responseData) {
				if (typeof responseData == "string") return JSON.parse(responseData);
				return responseData;
			}
		};
		var comettransport_default = CometTransport;
		var import_http6 = __toESM(__require("http"));
		var import_https2 = __toESM(__require("https"));
		var import_url = __toESM(__require("url"));
		var import_util3 = __toESM(__require("util"));
		var noop2 = function() {};
		var shortName2 = TransportNames.Comet;
		var NodeCometTransport = class extends comettransport_default {
			constructor(connectionManager, auth, params) {
				super(connectionManager, auth, params);
				this.httpAgent = null;
				this.httpsAgent = null;
				this.pendingRequests = 0;
				this.shortName = shortName2;
			}
			static isAvailable() {
				return true;
			}
			toString() {
				return "NodeCometTransport; uri=" + this.baseUri + "; isConnected=" + this.isConnected + "; format=" + this.format + "; stream=" + this.stream;
			}
			getAgent(tls) {
				var prop = tls ? "httpsAgent" : "httpAgent", agent2 = this[prop];
				if (!agent2) agent2 = this[prop] = new (tls ? import_https2.default : import_http6.default).Agent({ keepAlive: true });
				return agent2;
			}
			dispose() {
				var self2 = this;
				this.onceNoPending(function() {
					if (self2.httpAgent) self2.httpAgent.destroy();
					if (self2.httpsAgent) self2.httpsAgent.destroy();
				});
				comettransport_default.prototype.dispose.call(this);
			}
			request(uri, params, body, requestMode, callback) {
				var req = this.createRequest(uri, params, body, requestMode);
				req.once("complete", callback);
				req.exec();
				return req;
			}
			createRequest(uri, headers, params, body, requestMode) {
				return new Request(uri, headers, params, body, requestMode, this.format, this.timeouts, this);
			}
			addPending() {
				++this.pendingRequests;
			}
			removePending() {
				if (--this.pendingRequests <= 0) this.emit("nopending");
			}
			onceNoPending(listener) {
				if (this.pendingRequests == 0) {
					listener();
					return;
				}
				this.once("nopending", listener);
			}
		};
		var Request = class extends eventemitter_default {
			constructor(uri, headers, params, body, requestMode, format, timeouts, transport) {
				super(transport.logger);
				if (typeof uri == "string") uri = import_url.default.parse(uri);
				var tls = uri.protocol == "https:";
				this.client = tls ? import_https2.default : import_http6.default;
				this.requestMode = requestMode;
				this.timeouts = timeouts;
				this.transport = transport;
				this.requestComplete = false;
				this.req = this.res = null;
				var method = "GET", contentType = format == "msgpack" ? "application/x-msgpack" : "application/json";
				headers = headers ? mixin({}, headers) : {};
				headers["accept"] = contentType;
				if (body) {
					method = "POST";
					if (!Buffer.isBuffer(body)) {
						if (typeof body == "object") body = JSON.stringify(body);
						body = Buffer.from(body);
					}
					this.body = body;
					headers["Content-Length"] = body.length;
					headers["Content-Type"] = contentType;
				}
				var requestOptions = this.requestOptions = {
					hostname: uri.hostname,
					port: uri.port,
					path: uri.path + toQueryString(params),
					method,
					headers
				};
				if (transport) requestOptions.agent = transport.getAgent(tls);
			}
			exec() {
				var timeout = this.requestMode == XHRStates_default.REQ_SEND ? this.timeouts.httpRequestTimeout : this.timeouts.recvTimeout, self2 = this;
				var timer = this.timer = setTimeout(function() {
					self2.abort();
				}, timeout), req = this.req = this.client.request(this.requestOptions);
				req.on("error", this.onReqError = function(err) {
					err = new PartialErrorInfo("Request error: " + err.message, null, 400);
					clearTimeout(timer);
					self2.timer = null;
					self2.complete(err);
				});
				req.on("response", function(res) {
					clearTimeout(timer);
					self2.timer = null;
					var statusCode = res.statusCode;
					if (statusCode == HttpStatusCodes_default.NoContent) {
						res.resume();
						self2.complete();
						return;
					}
					res.on("error", self2.onResError = function(err) {
						err = new PartialErrorInfo("Response error: " + err.message, null, 400);
						self2.complete(err);
					});
					self2.res = res;
					if (self2.requestMode == XHRStates_default.REQ_RECV_STREAM && statusCode < 400) self2.readStream();
					else self2.readFully();
				});
				if (this.transport) this.transport.addPending();
				req.end(this.body);
			}
			readStream() {
				var res = this.res, self2 = this;
				this.chunks = [];
				this.streamComplete = false;
				function onChunk(chunk) {
					try {
						chunk = JSON.parse(chunk);
					} catch (e) {
						var msg = "Malformed response body from server: " + e.message;
						logger_default.logAction(self2.logger, logger_default.LOG_ERROR, "NodeCometTransport.Request.readStream()", msg);
						self2.complete(new PartialErrorInfo(msg, null, 400));
						return;
					}
					self2.emit("data", chunk);
				}
				res.on("data", this.ondata = function(data) {
					var newChunks = String(data).split("\n"), chunks = self2.chunks;
					if (newChunks.length > 1 && chunks.length > 0) {
						chunks.push(newChunks.shift());
						self2.chunks = [];
						onChunk(chunks.join(""));
					}
					var trailingNewChunk = newChunks.pop();
					if (trailingNewChunk.length) self2.chunks.push(trailingNewChunk);
					newChunks.map(onChunk);
				});
				res.on("end", function() {
					self2.streamComplete = true;
					process.nextTick(function() {
						self2.complete();
					});
				});
			}
			readFully() {
				var res = this.res, chunks = [], self2 = this;
				res.on("data", function(chunk) {
					chunks.push(chunk);
				});
				res.on("end", function() {
					process.nextTick(function() {
						var body = Buffer.concat(chunks), statusCode = res.statusCode;
						try {
							body = JSON.parse(String(body));
						} catch (e) {
							var msg = "Malformed response body from server: " + e.message;
							logger_default.logAction(self2.logger, logger_default.LOG_ERROR, "NodeCometTransport.Request.readFully()", msg);
							self2.complete(new PartialErrorInfo(msg, null, 400));
							return;
						}
						if (statusCode < 400 || Array.isArray(body)) {
							self2.complete(null, body);
							return;
						}
						var err = body.error && ErrorInfo.fromValues(body.error);
						if (!err) err = new PartialErrorInfo("Error response received from server: " + statusCode + ", body was: " + import_util3.default.inspect(body), null, statusCode);
						self2.complete(err);
					});
				});
			}
			complete(err, body) {
				if (!this.requestComplete) {
					this.requestComplete = true;
					if (body) this.emit("data", body);
					this.emit("complete", err, body);
					if (err) {
						if (this.ondata && !this.streamComplete) {
							if (this.ondata && this.res) this.res.removeListener("data", this.ondata);
						}
					}
					if (this.transport) this.transport.removePending();
				}
			}
			abort() {
				logger_default.logAction(this.logger, logger_default.LOG_MINOR, "NodeCometTransport.Request.abort()", "");
				var timer = this.timer;
				if (timer) {
					clearTimeout(timer);
					this.timer = null;
				}
				var req = this.req;
				if (req) {
					logger_default.logAction(this.logger, logger_default.LOG_MINOR, "NodeCometTransport.Request.abort()", "aborting request");
					req.removeListener("error", this.onReqError);
					req.on("error", noop2);
					req.abort();
					this.req = null;
				}
				this.complete({
					statusCode: 400,
					code: 80003,
					message: "Cancelled"
				});
			}
		};
		var nodecomettransport_default = NodeCometTransport;
		var transport_default2 = {
			order: [TransportNames.Comet],
			bundledImplementations: {
				[TransportNames.WebSocket]: websockettransport_default,
				[TransportNames.Comet]: nodecomettransport_default
			}
		};
		var defaults_default2 = {
			connectivityCheckUrl: "https://internet-up.ably-realtime.com/is-the-internet-up.txt",
			wsConnectivityCheckUrl: "wss://ws-up.ably-realtime.com",
			defaultTransports: [TransportNames.WebSocket],
			restAgentOptions: {
				maxSockets: 40,
				keepAlive: true
			}
		};
		var msgpack = require_msgpack();
		var Crypto = createCryptoClass(bufferutils_default);
		Platform.Crypto = Crypto;
		Platform.BufferUtils = bufferutils_default;
		Platform.Http = http_default;
		Platform.Config = config_default;
		Platform.Transports = transport_default2;
		Platform.WebStorage = null;
		for (const clientClass of [DefaultRest, DefaultRealtime]) {
			clientClass.Crypto = Crypto;
			clientClass._MsgPack = msgpack;
		}
		logger_default.initLogHandlers();
		Platform.Defaults = getDefaults(defaults_default2);
		if (Platform.Config.agent) Platform.Defaults.agent += " " + Platform.Config.agent;
		module$1.exports = {
			ErrorInfo,
			Rest: DefaultRest,
			Realtime: DefaultRealtime,
			msgpack: null,
			makeProtocolMessageFromDeserialized: makeFromDeserializedWithDependencies
		};
		if (typeof module$1.exports == "object" && typeof exports$1 == "object") {
			var __cp = (to, from, except, desc) => {
				if (from && typeof from === "object" || typeof from === "function") {
					for (let key of Object.getOwnPropertyNames(from)) if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except) Object.defineProperty(to, key, {
						get: () => from[key],
						enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable
					});
				}
				return to;
			};
			module$1.exports = __cp(module$1.exports, exports$1);
		}
		return module$1.exports;
	});
}));
//#endregion
export { require_ably_node as t };
