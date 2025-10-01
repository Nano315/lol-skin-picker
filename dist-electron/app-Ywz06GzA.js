var Mm = Object.defineProperty;
var yc = (e) => {
  throw TypeError(e);
};
var qm = (e, t, r) => t in e ? Mm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Re = (e, t, r) => qm(e, typeof t != "symbol" ? t + "" : t, r), bc = (e, t, r) => t.has(e) || yc("Cannot " + r);
var ke = (e, t, r) => (bc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Rr = (e, t, r) => t.has(e) ? yc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), jt = (e, t, r, n) => (bc(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import fn, { BrowserWindow as jm, ipcMain as wt, shell as Wm, nativeImage as Hm, Tray as zm, app as ri, Menu as Cd, dialog as wc, screen as $i } from "electron";
import kl, { promises as iu } from "node:fs";
import { EventEmitter as ou } from "node:events";
import Gi from "node:http";
import Gm from "node:https";
import xn from "node:zlib";
import zt, { PassThrough as Ua, pipeline as Un } from "node:stream";
import { Buffer as He } from "node:buffer";
import { types as Ba, deprecate as ns, promisify as Vm } from "node:util";
import { format as Ym } from "node:url";
import { isIP as Xm } from "node:net";
import Mi, { join as Qm } from "node:path";
import Ur from "fs";
import Km from "constants";
import po from "stream";
import au from "util";
import Rd from "assert";
import ve from "path";
import is from "child_process";
import Td from "events";
import mo from "crypto";
import Ad from "tty";
import os from "os";
import si from "url";
import Jm from "string_decoder";
import Pd from "zlib";
import Zm from "http";
const ts = class ts extends ou {
  constructor() {
    super(...arguments);
    Re(this, "status", "disconnected");
    Re(this, "creds", null);
    Re(this, "timer", null);
    Re(this, "rawCache", "");
  }
  start(r = 2e3) {
    this.timer || (this.tick(), this.timer = setInterval(() => this.tick(), r));
  }
  tick() {
    const r = this.readLockfile();
    if (!r) {
      this.toDisconnected();
      return;
    }
    if (r !== this.rawCache) {
      this.rawCache = r;
      const n = this.parse(r);
      if (!n) {
        this.toDisconnected();
        return;
      }
      this.toConnected(n);
    }
  }
  toConnected(r) {
    this.status = "connected", this.creds = r, this.emit("status", "connected", r);
  }
  toDisconnected() {
    this.status !== "disconnected" && (this.status = "disconnected", this.creds = null, this.rawCache = "", this.emit("status", "disconnected"));
  }
  readLockfile() {
    for (const r of ts.FILES)
      try {
        return kl.readFileSync(r, "utf8");
      } catch {
      }
    return null;
  }
  /** ProcessName:PID:Port:Password:Protocol(:Address) */
  parse(r) {
    const n = r.trim().split(":");
    return n.length < 5 ? null : {
      port: n[2].trim(),
      password: n[3].trim(),
      protocol: n[4].trim()
    };
  }
  on(r, n) {
    return super.on(r, n);
  }
  emit(r, n, i) {
    return super.emit(r, n, i);
  }
};
/** chemins possibles du lockfile */
Re(ts, "FILES", [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile"
]);
let Ll = ts;
function eg(e) {
  if (!/^data:/i.test(e))
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  e = e.replace(/\r?\n/g, "");
  const t = e.indexOf(",");
  if (t === -1 || t <= 4)
    throw new TypeError("malformed data: URI");
  const r = e.substring(5, t).split(";");
  let n = "", i = !1;
  const a = r[0] || "text/plain";
  let s = a;
  for (let f = 1; f < r.length; f++)
    r[f] === "base64" ? i = !0 : r[f] && (s += `;${r[f]}`, r[f].indexOf("charset=") === 0 && (n = r[f].substring(8)));
  !r[0] && !n.length && (s += ";charset=US-ASCII", n = "US-ASCII");
  const u = i ? "base64" : "ascii", c = unescape(e.substring(t + 1)), g = Buffer.from(c, u);
  return g.type = a, g.typeFull = s, g.charset = n, g;
}
var Ue = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ma = { exports: {} };
/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */
var _c;
function tg() {
  return _c || (_c = 1, function(e, t) {
    (function(r, n) {
      n(t);
    })(Ue, function(r) {
      function n() {
      }
      function i(o) {
        return typeof o == "object" && o !== null || typeof o == "function";
      }
      const a = n;
      function s(o, l) {
        try {
          Object.defineProperty(o, "name", {
            value: l,
            configurable: !0
          });
        } catch {
        }
      }
      const u = Promise, c = Promise.prototype.then, g = Promise.reject.bind(u);
      function f(o) {
        return new u(o);
      }
      function h(o) {
        return f((l) => l(o));
      }
      function m(o) {
        return g(o);
      }
      function b(o, l, d) {
        return c.call(o, l, d);
      }
      function E(o, l, d) {
        b(b(o, l, d), void 0, a);
      }
      function C(o, l) {
        E(o, l);
      }
      function A(o, l) {
        E(o, void 0, l);
      }
      function I(o, l, d) {
        return b(o, l, d);
      }
      function $(o) {
        b(o, void 0, a);
      }
      let M = (o) => {
        if (typeof queueMicrotask == "function")
          M = queueMicrotask;
        else {
          const l = h(void 0);
          M = (d) => b(l, d);
        }
        return M(o);
      };
      function x(o, l, d) {
        if (typeof o != "function")
          throw new TypeError("Argument is not a function");
        return Function.prototype.apply.call(o, l, d);
      }
      function te(o, l, d) {
        try {
          return h(x(o, l, d));
        } catch (w) {
          return m(w);
        }
      }
      const ae = 16384;
      class Q {
        constructor() {
          this._cursor = 0, this._size = 0, this._front = {
            _elements: [],
            _next: void 0
          }, this._back = this._front, this._cursor = 0, this._size = 0;
        }
        get length() {
          return this._size;
        }
        // For exception safety, this method is structured in order:
        // 1. Read state
        // 2. Calculate required state mutations
        // 3. Perform state mutations
        push(l) {
          const d = this._back;
          let w = d;
          d._elements.length === ae - 1 && (w = {
            _elements: [],
            _next: void 0
          }), d._elements.push(l), w !== d && (this._back = w, d._next = w), ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const l = this._front;
          let d = l;
          const w = this._cursor;
          let v = w + 1;
          const P = l._elements, O = P[w];
          return v === ae && (d = l._next, v = 0), --this._size, this._cursor = v, l !== d && (this._front = d), P[w] = void 0, O;
        }
        // The tricky thing about forEach() is that it can be called
        // re-entrantly. The queue may be mutated inside the callback. It is easy to
        // see that push() within the callback has no negative effects since the end
        // of the queue is checked for on every iteration. If shift() is called
        // repeatedly within the callback then the next iteration may return an
        // element that has been removed. In this case the callback will be called
        // with undefined values until we either "catch up" with elements that still
        // exist or reach the back of the queue.
        forEach(l) {
          let d = this._cursor, w = this._front, v = w._elements;
          for (; (d !== v.length || w._next !== void 0) && !(d === v.length && (w = w._next, v = w._elements, d = 0, v.length === 0)); )
            l(v[d]), ++d;
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const l = this._front, d = this._cursor;
          return l._elements[d];
        }
      }
      const Ne = Symbol("[[AbortSteps]]"), S = Symbol("[[ErrorSteps]]"), re = Symbol("[[CancelSteps]]"), Z = Symbol("[[PullSteps]]"), X = Symbol("[[ReleaseSteps]]");
      function ce(o, l) {
        o._ownerReadableStream = l, l._reader = o, l._state === "readable" ? N(o) : l._state === "closed" ? U(o) : q(o, l._storedError);
      }
      function L(o, l) {
        const d = o._ownerReadableStream;
        return Rt(d, l);
      }
      function D(o) {
        const l = o._ownerReadableStream;
        l._state === "readable" ? V(o, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : ie(o, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), l._readableStreamController[X](), l._reader = void 0, o._ownerReadableStream = void 0;
      }
      function B(o) {
        return new TypeError("Cannot " + o + " a stream using a released reader");
      }
      function N(o) {
        o._closedPromise = f((l, d) => {
          o._closedPromise_resolve = l, o._closedPromise_reject = d;
        });
      }
      function q(o, l) {
        N(o), V(o, l);
      }
      function U(o) {
        N(o), ee(o);
      }
      function V(o, l) {
        o._closedPromise_reject !== void 0 && ($(o._closedPromise), o._closedPromise_reject(l), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0);
      }
      function ie(o, l) {
        q(o, l);
      }
      function ee(o) {
        o._closedPromise_resolve !== void 0 && (o._closedPromise_resolve(void 0), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0);
      }
      const fe = Number.isFinite || function(o) {
        return typeof o == "number" && isFinite(o);
      }, Te = Math.trunc || function(o) {
        return o < 0 ? Math.ceil(o) : Math.floor(o);
      };
      function Y(o) {
        return typeof o == "object" || typeof o == "function";
      }
      function Ce(o, l) {
        if (o !== void 0 && !Y(o))
          throw new TypeError(`${l} is not an object.`);
      }
      function y(o, l) {
        if (typeof o != "function")
          throw new TypeError(`${l} is not a function.`);
      }
      function p(o) {
        return typeof o == "object" && o !== null || typeof o == "function";
      }
      function F(o, l) {
        if (!p(o))
          throw new TypeError(`${l} is not an object.`);
      }
      function T(o, l, d) {
        if (o === void 0)
          throw new TypeError(`Parameter ${l} is required in '${d}'.`);
      }
      function se(o, l, d) {
        if (o === void 0)
          throw new TypeError(`${l} is required in '${d}'.`);
      }
      function pe(o) {
        return Number(o);
      }
      function we(o) {
        return o === 0 ? 0 : o;
      }
      function Oe(o) {
        return we(Te(o));
      }
      function Ae(o, l) {
        const w = Number.MAX_SAFE_INTEGER;
        let v = Number(o);
        if (v = we(v), !fe(v))
          throw new TypeError(`${l} is not a finite number`);
        if (v = Oe(v), v < 0 || v > w)
          throw new TypeError(`${l} is outside the accepted range of 0 to ${w}, inclusive`);
        return !fe(v) || v === 0 ? 0 : v;
      }
      function mt(o, l) {
        if (!Er(o))
          throw new TypeError(`${l} is not a ReadableStream.`);
      }
      function ye(o) {
        return new ct(o);
      }
      function rt(o, l) {
        o._reader._readRequests.push(l);
      }
      function qr(o, l, d) {
        const v = o._reader._readRequests.shift();
        d ? v._closeSteps() : v._chunkSteps(l);
      }
      function Yt(o) {
        return o._reader._readRequests.length;
      }
      function hr(o) {
        const l = o._reader;
        return !(l === void 0 || !Dt(l));
      }
      class ct {
        constructor(l) {
          if (T(l, 1, "ReadableStreamDefaultReader"), mt(l, "First parameter"), Sr(l))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          ce(this, l), this._readRequests = new Q();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return Dt(this) ? this._closedPromise : m(Xt("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(l = void 0) {
          return Dt(this) ? this._ownerReadableStream === void 0 ? m(B("cancel")) : L(this, l) : m(Xt("cancel"));
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!Dt(this))
            return m(Xt("read"));
          if (this._ownerReadableStream === void 0)
            return m(B("read from"));
          let l, d;
          const w = f((P, O) => {
            l = P, d = O;
          });
          return jr(this, {
            _chunkSteps: (P) => l({ value: P, done: !1 }),
            _closeSteps: () => l({ value: void 0, done: !0 }),
            _errorSteps: (P) => d(P)
          }), w;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!Dt(this))
            throw Xt("releaseLock");
          this._ownerReadableStream !== void 0 && Is(this);
        }
      }
      Object.defineProperties(ct.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), s(ct.prototype.cancel, "cancel"), s(ct.prototype.read, "read"), s(ct.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ct.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultReader",
        configurable: !0
      });
      function Dt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readRequests") ? !1 : o instanceof ct;
      }
      function jr(o, l) {
        const d = o._ownerReadableStream;
        d._disturbed = !0, d._state === "closed" ? l._closeSteps() : d._state === "errored" ? l._errorSteps(d._storedError) : d._readableStreamController[Z](l);
      }
      function Is(o) {
        D(o);
        const l = new TypeError("Reader was released");
        To(o, l);
      }
      function To(o, l) {
        const d = o._readRequests;
        o._readRequests = new Q(), d.forEach((w) => {
          w._errorSteps(l);
        });
      }
      function Xt(o) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${o} can only be used on a ReadableStreamDefaultReader`);
      }
      const di = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class hi {
        constructor(l, d) {
          this._ongoingPromise = void 0, this._isFinished = !1, this._reader = l, this._preventCancel = d;
        }
        next() {
          const l = () => this._nextSteps();
          return this._ongoingPromise = this._ongoingPromise ? I(this._ongoingPromise, l, l) : l(), this._ongoingPromise;
        }
        return(l) {
          const d = () => this._returnSteps(l);
          return this._ongoingPromise ? I(this._ongoingPromise, d, d) : d();
        }
        _nextSteps() {
          if (this._isFinished)
            return Promise.resolve({ value: void 0, done: !0 });
          const l = this._reader;
          let d, w;
          const v = f((O, j) => {
            d = O, w = j;
          });
          return jr(l, {
            _chunkSteps: (O) => {
              this._ongoingPromise = void 0, M(() => d({ value: O, done: !1 }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0, this._isFinished = !0, D(l), d({ value: void 0, done: !0 });
            },
            _errorSteps: (O) => {
              this._ongoingPromise = void 0, this._isFinished = !0, D(l), w(O);
            }
          }), v;
        }
        _returnSteps(l) {
          if (this._isFinished)
            return Promise.resolve({ value: l, done: !0 });
          this._isFinished = !0;
          const d = this._reader;
          if (!this._preventCancel) {
            const w = L(d, l);
            return D(d), I(w, () => ({ value: l, done: !0 }));
          }
          return D(d), h({ value: l, done: !0 });
        }
      }
      const ft = {
        next() {
          return pi(this) ? this._asyncIteratorImpl.next() : m(Po("next"));
        },
        return(o) {
          return pi(this) ? this._asyncIteratorImpl.return(o) : m(Po("return"));
        }
      };
      Object.setPrototypeOf(ft, di);
      function Ao(o, l) {
        const d = ye(o), w = new hi(d, l), v = Object.create(ft);
        return v._asyncIteratorImpl = w, v;
      }
      function pi(o) {
        if (!i(o) || !Object.prototype.hasOwnProperty.call(o, "_asyncIteratorImpl"))
          return !1;
        try {
          return o._asyncIteratorImpl instanceof hi;
        } catch {
          return !1;
        }
      }
      function Po(o) {
        return new TypeError(`ReadableStreamAsyncIterator.${o} can only be used on a ReadableSteamAsyncIterator`);
      }
      const mi = Number.isNaN || function(o) {
        return o !== o;
      };
      var pr, gn, yn;
      function Wr(o) {
        return o.slice();
      }
      function Nt(o, l, d, w, v) {
        new Uint8Array(o).set(new Uint8Array(d, w, v), l);
      }
      let gt = (o) => (typeof o.transfer == "function" ? gt = (l) => l.transfer() : typeof structuredClone == "function" ? gt = (l) => structuredClone(l, { transfer: [l] }) : gt = (l) => l, gt(o)), Ft = (o) => (typeof o.detached == "boolean" ? Ft = (l) => l.detached : Ft = (l) => l.byteLength === 0, Ft(o));
      function Io(o, l, d) {
        if (o.slice)
          return o.slice(l, d);
        const w = d - l, v = new ArrayBuffer(w);
        return Nt(v, 0, o, l, w), v;
      }
      function mr(o, l) {
        const d = o[l];
        if (d != null) {
          if (typeof d != "function")
            throw new TypeError(`${String(l)} is not a function`);
          return d;
        }
      }
      function Hr(o) {
        const l = {
          [Symbol.iterator]: () => o.iterator
        }, d = async function* () {
          return yield* l;
        }(), w = d.next;
        return { iterator: d, nextMethod: w, done: !1 };
      }
      const zr = (yn = (pr = Symbol.asyncIterator) !== null && pr !== void 0 ? pr : (gn = Symbol.for) === null || gn === void 0 ? void 0 : gn.call(Symbol, "Symbol.asyncIterator")) !== null && yn !== void 0 ? yn : "@@asyncIterator";
      function bn(o, l = "sync", d) {
        if (d === void 0)
          if (l === "async") {
            if (d = mr(o, zr), d === void 0) {
              const P = mr(o, Symbol.iterator), O = bn(o, "sync", P);
              return Hr(O);
            }
          } else
            d = mr(o, Symbol.iterator);
        if (d === void 0)
          throw new TypeError("The object is not iterable");
        const w = x(d, o, []);
        if (!i(w))
          throw new TypeError("The iterator method must return an object");
        const v = w.next;
        return { iterator: w, nextMethod: v, done: !1 };
      }
      function gi(o) {
        const l = x(o.nextMethod, o.iterator, []);
        if (!i(l))
          throw new TypeError("The iterator.next() method must return an object");
        return l;
      }
      function Gr(o) {
        return !!o.done;
      }
      function $s(o) {
        return o.value;
      }
      function Os(o) {
        return !(typeof o != "number" || mi(o) || o < 0);
      }
      function $o(o) {
        const l = Io(o.buffer, o.byteOffset, o.byteOffset + o.byteLength);
        return new Uint8Array(l);
      }
      function yi(o) {
        const l = o._queue.shift();
        return o._queueTotalSize -= l.size, o._queueTotalSize < 0 && (o._queueTotalSize = 0), l.value;
      }
      function bi(o, l, d) {
        if (!Os(d) || d === 1 / 0)
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        o._queue.push({ value: l, size: d }), o._queueTotalSize += d;
      }
      function Oo(o) {
        return o._queue.peek().value;
      }
      function yt(o) {
        o._queue = new Q(), o._queueTotalSize = 0;
      }
      function kt(o) {
        return o === DataView;
      }
      function Ds(o) {
        return kt(o.constructor);
      }
      function Ns(o) {
        return kt(o) ? 1 : o.BYTES_PER_ELEMENT;
      }
      class Qt {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!dt(this))
            throw Si("view");
          return this._view;
        }
        respond(l) {
          if (!dt(this))
            throw Si("respond");
          if (T(l, 1, "respond"), l = Ae(l, "First parameter"), this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Ft(this._view.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          Sn(this._associatedReadableByteStreamController, l);
        }
        respondWithNewView(l) {
          if (!dt(this))
            throw Si("respondWithNewView");
          if (T(l, 1, "respondWithNewView"), !ArrayBuffer.isView(l))
            throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Ft(l.buffer))
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          vn(this._associatedReadableByteStreamController, l);
        }
      }
      Object.defineProperties(Qt.prototype, {
        respond: { enumerable: !0 },
        respondWithNewView: { enumerable: !0 },
        view: { enumerable: !0 }
      }), s(Qt.prototype.respond, "respond"), s(Qt.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Qt.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBRequest",
        configurable: !0
      });
      class St {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!Kt(this))
            throw Yr("byobRequest");
          return En(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!Kt(this))
            throw Yr("desiredSize");
          return Ei(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!Kt(this))
            throw Yr("close");
          if (this._closeRequested)
            throw new TypeError("The stream has already been closed; do not close it again!");
          const l = this._controlledReadableByteStream._state;
          if (l !== "readable")
            throw new TypeError(`The stream (in ${l} state) is not in the readable state and cannot be closed`);
          Vr(this);
        }
        enqueue(l) {
          if (!Kt(this))
            throw Yr("enqueue");
          if (T(l, 1, "enqueue"), !ArrayBuffer.isView(l))
            throw new TypeError("chunk must be an array buffer view");
          if (l.byteLength === 0)
            throw new TypeError("chunk must have non-zero byteLength");
          if (l.buffer.byteLength === 0)
            throw new TypeError("chunk's buffer must have non-zero byteLength");
          if (this._closeRequested)
            throw new TypeError("stream is closed or draining");
          const d = this._controlledReadableByteStream._state;
          if (d !== "readable")
            throw new TypeError(`The stream (in ${d} state) is not in the readable state and cannot be enqueued to`);
          Zt(this, l);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(l = void 0) {
          if (!Kt(this))
            throw Yr("error");
          nt(this, l);
        }
        /** @internal */
        [re](l) {
          Do(this), yt(this);
          const d = this._cancelAlgorithm(l);
          return _n(this), d;
        }
        /** @internal */
        [Z](l) {
          const d = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            br(this, l);
            return;
          }
          const w = this._autoAllocateChunkSize;
          if (w !== void 0) {
            let v;
            try {
              v = new ArrayBuffer(w);
            } catch (O) {
              l._errorSteps(O);
              return;
            }
            const P = {
              buffer: v,
              bufferByteLength: w,
              byteOffset: 0,
              byteLength: w,
              bytesFilled: 0,
              minimumFill: 1,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(P);
          }
          rt(d, l), Jt(this);
        }
        /** @internal */
        [X]() {
          if (this._pendingPullIntos.length > 0) {
            const l = this._pendingPullIntos.peek();
            l.readerType = "none", this._pendingPullIntos = new Q(), this._pendingPullIntos.push(l);
          }
        }
      }
      Object.defineProperties(St.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        byobRequest: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(St.prototype.close, "close"), s(St.prototype.enqueue, "enqueue"), s(St.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(St.prototype, Symbol.toStringTag, {
        value: "ReadableByteStreamController",
        configurable: !0
      });
      function Kt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledReadableByteStream") ? !1 : o instanceof St;
      }
      function dt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_associatedReadableByteStreamController") ? !1 : o instanceof Qt;
      }
      function Jt(o) {
        if (!xs(o))
          return;
        if (o._pulling) {
          o._pullAgain = !0;
          return;
        }
        o._pulling = !0;
        const d = o._pullAlgorithm();
        E(d, () => (o._pulling = !1, o._pullAgain && (o._pullAgain = !1, Jt(o)), null), (w) => (nt(o, w), null));
      }
      function Do(o) {
        _i(o), o._pendingPullIntos = new Q();
      }
      function wi(o, l) {
        let d = !1;
        o._state === "closed" && (d = !0);
        const w = No(l);
        l.readerType === "default" ? qr(o, w, d) : Ut(o, w, d);
      }
      function No(o) {
        const l = o.bytesFilled, d = o.elementSize;
        return new o.viewConstructor(o.buffer, o.byteOffset, l / d);
      }
      function wn(o, l, d, w) {
        o._queue.push({ buffer: l, byteOffset: d, byteLength: w }), o._queueTotalSize += w;
      }
      function Lt(o, l, d, w) {
        let v;
        try {
          v = Io(l, d, d + w);
        } catch (P) {
          throw nt(o, P), P;
        }
        wn(o, v, 0, w);
      }
      function Fo(o, l) {
        l.bytesFilled > 0 && Lt(o, l.buffer, l.byteOffset, l.bytesFilled), yr(o);
      }
      function ko(o, l) {
        const d = Math.min(o._queueTotalSize, l.byteLength - l.bytesFilled), w = l.bytesFilled + d;
        let v = d, P = !1;
        const O = w % l.elementSize, j = w - O;
        j >= l.minimumFill && (v = j - l.bytesFilled, P = !0);
        const J = o._queue;
        for (; v > 0; ) {
          const z = J.peek(), ne = Math.min(v, z.byteLength), oe = l.byteOffset + l.bytesFilled;
          Nt(l.buffer, oe, z.buffer, z.byteOffset, ne), z.byteLength === ne ? J.shift() : (z.byteOffset += ne, z.byteLength -= ne), o._queueTotalSize -= ne, Lo(o, ne, l), v -= ne;
        }
        return P;
      }
      function Lo(o, l, d) {
        d.bytesFilled += l;
      }
      function xo(o) {
        o._queueTotalSize === 0 && o._closeRequested ? (_n(o), Ii(o._controlledReadableByteStream)) : Jt(o);
      }
      function _i(o) {
        o._byobRequest !== null && (o._byobRequest._associatedReadableByteStreamController = void 0, o._byobRequest._view = null, o._byobRequest = null);
      }
      function gr(o) {
        for (; o._pendingPullIntos.length > 0; ) {
          if (o._queueTotalSize === 0)
            return;
          const l = o._pendingPullIntos.peek();
          ko(o, l) && (yr(o), wi(o._controlledReadableByteStream, l));
        }
      }
      function Fs(o) {
        const l = o._controlledReadableByteStream._reader;
        for (; l._readRequests.length > 0; ) {
          if (o._queueTotalSize === 0)
            return;
          const d = l._readRequests.shift();
          br(o, d);
        }
      }
      function ks(o, l, d, w) {
        const v = o._controlledReadableByteStream, P = l.constructor, O = Ns(P), { byteOffset: j, byteLength: J } = l, z = d * O;
        let ne;
        try {
          ne = gt(l.buffer);
        } catch (me) {
          w._errorSteps(me);
          return;
        }
        const oe = {
          buffer: ne,
          bufferByteLength: ne.byteLength,
          byteOffset: j,
          byteLength: J,
          bytesFilled: 0,
          minimumFill: z,
          elementSize: O,
          viewConstructor: P,
          readerType: "byob"
        };
        if (o._pendingPullIntos.length > 0) {
          o._pendingPullIntos.push(oe), Wo(v, w);
          return;
        }
        if (v._state === "closed") {
          const me = new P(oe.buffer, oe.byteOffset, 0);
          w._closeSteps(me);
          return;
        }
        if (o._queueTotalSize > 0) {
          if (ko(o, oe)) {
            const me = No(oe);
            xo(o), w._chunkSteps(me);
            return;
          }
          if (o._closeRequested) {
            const me = new TypeError("Insufficient bytes to fill elements in the given buffer");
            nt(o, me), w._errorSteps(me);
            return;
          }
        }
        o._pendingPullIntos.push(oe), Wo(v, w), Jt(o);
      }
      function xt(o, l) {
        l.readerType === "none" && yr(o);
        const d = o._controlledReadableByteStream;
        if (vi(d))
          for (; Ho(d) > 0; ) {
            const w = yr(o);
            wi(d, w);
          }
      }
      function Ls(o, l, d) {
        if (Lo(o, l, d), d.readerType === "none") {
          Fo(o, d), gr(o);
          return;
        }
        if (d.bytesFilled < d.minimumFill)
          return;
        yr(o);
        const w = d.bytesFilled % d.elementSize;
        if (w > 0) {
          const v = d.byteOffset + d.bytesFilled;
          Lt(o, d.buffer, v - w, w);
        }
        d.bytesFilled -= w, wi(o._controlledReadableByteStream, d), gr(o);
      }
      function Uo(o, l) {
        const d = o._pendingPullIntos.peek();
        _i(o), o._controlledReadableByteStream._state === "closed" ? xt(o, d) : Ls(o, l, d), Jt(o);
      }
      function yr(o) {
        return o._pendingPullIntos.shift();
      }
      function xs(o) {
        const l = o._controlledReadableByteStream;
        return l._state !== "readable" || o._closeRequested || !o._started ? !1 : !!(hr(l) && Yt(l) > 0 || vi(l) && Ho(l) > 0 || Ei(o) > 0);
      }
      function _n(o) {
        o._pullAlgorithm = void 0, o._cancelAlgorithm = void 0;
      }
      function Vr(o) {
        const l = o._controlledReadableByteStream;
        if (!(o._closeRequested || l._state !== "readable")) {
          if (o._queueTotalSize > 0) {
            o._closeRequested = !0;
            return;
          }
          if (o._pendingPullIntos.length > 0) {
            const d = o._pendingPullIntos.peek();
            if (d.bytesFilled % d.elementSize !== 0) {
              const w = new TypeError("Insufficient bytes to fill elements in the given buffer");
              throw nt(o, w), w;
            }
          }
          _n(o), Ii(l);
        }
      }
      function Zt(o, l) {
        const d = o._controlledReadableByteStream;
        if (o._closeRequested || d._state !== "readable")
          return;
        const { buffer: w, byteOffset: v, byteLength: P } = l;
        if (Ft(w))
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const O = gt(w);
        if (o._pendingPullIntos.length > 0) {
          const j = o._pendingPullIntos.peek();
          if (Ft(j.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          _i(o), j.buffer = gt(j.buffer), j.readerType === "none" && Fo(o, j);
        }
        if (hr(d))
          if (Fs(o), Yt(d) === 0)
            wn(o, O, v, P);
          else {
            o._pendingPullIntos.length > 0 && yr(o);
            const j = new Uint8Array(O, v, P);
            qr(d, j, !1);
          }
        else vi(d) ? (wn(o, O, v, P), gr(o)) : wn(o, O, v, P);
        Jt(o);
      }
      function nt(o, l) {
        const d = o._controlledReadableByteStream;
        d._state === "readable" && (Do(o), yt(o), _n(o), nc(d, l));
      }
      function br(o, l) {
        const d = o._queue.shift();
        o._queueTotalSize -= d.byteLength, xo(o);
        const w = new Uint8Array(d.buffer, d.byteOffset, d.byteLength);
        l._chunkSteps(w);
      }
      function En(o) {
        if (o._byobRequest === null && o._pendingPullIntos.length > 0) {
          const l = o._pendingPullIntos.peek(), d = new Uint8Array(l.buffer, l.byteOffset + l.bytesFilled, l.byteLength - l.bytesFilled), w = Object.create(Qt.prototype);
          Mo(w, o, d), o._byobRequest = w;
        }
        return o._byobRequest;
      }
      function Ei(o) {
        const l = o._controlledReadableByteStream._state;
        return l === "errored" ? null : l === "closed" ? 0 : o._strategyHWM - o._queueTotalSize;
      }
      function Sn(o, l) {
        const d = o._pendingPullIntos.peek();
        if (o._controlledReadableByteStream._state === "closed") {
          if (l !== 0)
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
        } else {
          if (l === 0)
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          if (d.bytesFilled + l > d.byteLength)
            throw new RangeError("bytesWritten out of range");
        }
        d.buffer = gt(d.buffer), Uo(o, l);
      }
      function vn(o, l) {
        const d = o._pendingPullIntos.peek();
        if (o._controlledReadableByteStream._state === "closed") {
          if (l.byteLength !== 0)
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
        } else if (l.byteLength === 0)
          throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
        if (d.byteOffset + d.bytesFilled !== l.byteOffset)
          throw new RangeError("The region specified by view does not match byobRequest");
        if (d.bufferByteLength !== l.buffer.byteLength)
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        if (d.bytesFilled + l.byteLength > d.byteLength)
          throw new RangeError("The region specified by view is larger than byobRequest");
        const v = l.byteLength;
        d.buffer = gt(l.buffer), Uo(o, v);
      }
      function Bo(o, l, d, w, v, P, O) {
        l._controlledReadableByteStream = o, l._pullAgain = !1, l._pulling = !1, l._byobRequest = null, l._queue = l._queueTotalSize = void 0, yt(l), l._closeRequested = !1, l._started = !1, l._strategyHWM = P, l._pullAlgorithm = w, l._cancelAlgorithm = v, l._autoAllocateChunkSize = O, l._pendingPullIntos = new Q(), o._readableStreamController = l;
        const j = d();
        E(h(j), () => (l._started = !0, Jt(l), null), (J) => (nt(l, J), null));
      }
      function Us(o, l, d) {
        const w = Object.create(St.prototype);
        let v, P, O;
        l.start !== void 0 ? v = () => l.start(w) : v = () => {
        }, l.pull !== void 0 ? P = () => l.pull(w) : P = () => h(void 0), l.cancel !== void 0 ? O = (J) => l.cancel(J) : O = () => h(void 0);
        const j = l.autoAllocateChunkSize;
        if (j === 0)
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        Bo(o, w, v, P, O, d, j);
      }
      function Mo(o, l, d) {
        o._associatedReadableByteStreamController = l, o._view = d;
      }
      function Si(o) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${o} can only be used on a ReadableStreamBYOBRequest`);
      }
      function Yr(o) {
        return new TypeError(`ReadableByteStreamController.prototype.${o} can only be used on a ReadableByteStreamController`);
      }
      function qo(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.mode;
        return {
          mode: d === void 0 ? void 0 : Cn(d, `${l} has member 'mode' that`)
        };
      }
      function Cn(o, l) {
        if (o = `${o}`, o !== "byob")
          throw new TypeError(`${l} '${o}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return o;
      }
      function wr(o, l) {
        var d;
        Ce(o, l);
        const w = (d = o == null ? void 0 : o.min) !== null && d !== void 0 ? d : 1;
        return {
          min: Ae(w, `${l} has member 'min' that`)
        };
      }
      function jo(o) {
        return new Bt(o);
      }
      function Wo(o, l) {
        o._reader._readIntoRequests.push(l);
      }
      function Ut(o, l, d) {
        const v = o._reader._readIntoRequests.shift();
        d ? v._closeSteps(l) : v._chunkSteps(l);
      }
      function Ho(o) {
        return o._reader._readIntoRequests.length;
      }
      function vi(o) {
        const l = o._reader;
        return !(l === void 0 || !er(l));
      }
      class Bt {
        constructor(l) {
          if (T(l, 1, "ReadableStreamBYOBReader"), mt(l, "First parameter"), Sr(l))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!Kt(l._readableStreamController))
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          ce(this, l), this._readIntoRequests = new Q();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return er(this) ? this._closedPromise : m(Rn("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(l = void 0) {
          return er(this) ? this._ownerReadableStream === void 0 ? m(B("cancel")) : L(this, l) : m(Rn("cancel"));
        }
        read(l, d = {}) {
          if (!er(this))
            return m(Rn("read"));
          if (!ArrayBuffer.isView(l))
            return m(new TypeError("view must be an array buffer view"));
          if (l.byteLength === 0)
            return m(new TypeError("view must have non-zero byteLength"));
          if (l.buffer.byteLength === 0)
            return m(new TypeError("view's buffer must have non-zero byteLength"));
          if (Ft(l.buffer))
            return m(new TypeError("view's buffer has been detached"));
          let w;
          try {
            w = wr(d, "options");
          } catch (z) {
            return m(z);
          }
          const v = w.min;
          if (v === 0)
            return m(new TypeError("options.min must be greater than 0"));
          if (Ds(l)) {
            if (v > l.byteLength)
              return m(new RangeError("options.min must be less than or equal to view's byteLength"));
          } else if (v > l.length)
            return m(new RangeError("options.min must be less than or equal to view's length"));
          if (this._ownerReadableStream === void 0)
            return m(B("read from"));
          let P, O;
          const j = f((z, ne) => {
            P = z, O = ne;
          });
          return zo(this, l, v, {
            _chunkSteps: (z) => P({ value: z, done: !1 }),
            _closeSteps: (z) => P({ value: z, done: !0 }),
            _errorSteps: (z) => O(z)
          }), j;
        }
        /**
         * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
         * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
         * from now on; otherwise, the reader will appear closed.
         *
         * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
         * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
         * do so will throw a `TypeError` and leave the reader locked to the stream.
         */
        releaseLock() {
          if (!er(this))
            throw Rn("releaseLock");
          this._ownerReadableStream !== void 0 && tr(this);
        }
      }
      Object.defineProperties(Bt.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), s(Bt.prototype.cancel, "cancel"), s(Bt.prototype.read, "read"), s(Bt.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Bt.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBReader",
        configurable: !0
      });
      function er(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readIntoRequests") ? !1 : o instanceof Bt;
      }
      function zo(o, l, d, w) {
        const v = o._ownerReadableStream;
        v._disturbed = !0, v._state === "errored" ? w._errorSteps(v._storedError) : ks(v._readableStreamController, l, d, w);
      }
      function tr(o) {
        D(o);
        const l = new TypeError("Reader was released");
        Ci(o, l);
      }
      function Ci(o, l) {
        const d = o._readIntoRequests;
        o._readIntoRequests = new Q(), d.forEach((w) => {
          w._errorSteps(l);
        });
      }
      function Rn(o) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${o} can only be used on a ReadableStreamBYOBReader`);
      }
      function Mt(o, l) {
        const { highWaterMark: d } = o;
        if (d === void 0)
          return l;
        if (mi(d) || d < 0)
          throw new RangeError("Invalid highWaterMark");
        return d;
      }
      function Tn(o) {
        const { size: l } = o;
        return l || (() => 1);
      }
      function _r(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.highWaterMark, w = o == null ? void 0 : o.size;
        return {
          highWaterMark: d === void 0 ? void 0 : pe(d),
          size: w === void 0 ? void 0 : Bs(w, `${l} has member 'size' that`)
        };
      }
      function Bs(o, l) {
        return y(o, l), (d) => pe(o(d));
      }
      function Go(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.abort, w = o == null ? void 0 : o.close, v = o == null ? void 0 : o.start, P = o == null ? void 0 : o.type, O = o == null ? void 0 : o.write;
        return {
          abort: d === void 0 ? void 0 : Vo(d, o, `${l} has member 'abort' that`),
          close: w === void 0 ? void 0 : Yo(w, o, `${l} has member 'close' that`),
          start: v === void 0 ? void 0 : Xr(v, o, `${l} has member 'start' that`),
          write: O === void 0 ? void 0 : Xo(O, o, `${l} has member 'write' that`),
          type: P
        };
      }
      function Vo(o, l, d) {
        return y(o, d), (w) => te(o, l, [w]);
      }
      function Yo(o, l, d) {
        return y(o, d), () => te(o, l, []);
      }
      function Xr(o, l, d) {
        return y(o, d), (w) => x(o, l, [w]);
      }
      function Xo(o, l, d) {
        return y(o, d), (w, v) => te(o, l, [w, v]);
      }
      function Qo(o, l) {
        if (!K(o))
          throw new TypeError(`${l} is not a WritableStream.`);
      }
      function Ms(o) {
        if (typeof o != "object" || o === null)
          return !1;
        try {
          return typeof o.aborted == "boolean";
        } catch {
          return !1;
        }
      }
      const qs = typeof AbortController == "function";
      function _() {
        if (qs)
          return new AbortController();
      }
      class R {
        constructor(l = {}, d = {}) {
          l === void 0 ? l = null : F(l, "First parameter");
          const w = _r(d, "Second parameter"), v = Go(l, "First parameter");
          if (he(this), v.type !== void 0)
            throw new RangeError("Invalid type is specified");
          const O = Tn(w), j = Mt(w, 1);
          Vp(this, v, j, O);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!K(this))
            throw ta("locked");
          return de(this);
        }
        /**
         * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
         * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
         * mechanism of the underlying sink.
         *
         * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
         * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
         * the stream) if the stream is currently locked.
         */
        abort(l = void 0) {
          return K(this) ? de(this) ? m(new TypeError("Cannot abort a stream that already has a writer")) : Ee(this, l) : m(ta("abort"));
        }
        /**
         * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
         * close behavior. During this time any further attempts to write will fail (without erroring the stream).
         *
         * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
         * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
         * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
         */
        close() {
          return K(this) ? de(this) ? m(new TypeError("Cannot close a stream that already has a writer")) : Fe(this) ? m(new TypeError("Cannot close an already-closing stream")) : Pe(this) : m(ta("close"));
        }
        /**
         * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
         * is locked, no other writer can be acquired until this one is released.
         *
         * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
         * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
         * the same time, which would cause the resulting written data to be unpredictable and probably useless.
         */
        getWriter() {
          if (!K(this))
            throw ta("getWriter");
          return k(this);
        }
      }
      Object.defineProperties(R.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        getWriter: { enumerable: !0 },
        locked: { enumerable: !0 }
      }), s(R.prototype.abort, "abort"), s(R.prototype.close, "close"), s(R.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(R.prototype, Symbol.toStringTag, {
        value: "WritableStream",
        configurable: !0
      });
      function k(o) {
        return new rr(o);
      }
      function W(o, l, d, w, v = 1, P = () => 1) {
        const O = Object.create(R.prototype);
        he(O);
        const j = Object.create(In.prototype);
        return zu(O, j, o, l, d, w, v, P), O;
      }
      function he(o) {
        o._state = "writable", o._storedError = void 0, o._writer = void 0, o._writableStreamController = void 0, o._writeRequests = new Q(), o._inFlightWriteRequest = void 0, o._closeRequest = void 0, o._inFlightCloseRequest = void 0, o._pendingAbortRequest = void 0, o._backpressure = !1;
      }
      function K(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_writableStreamController") ? !1 : o instanceof R;
      }
      function de(o) {
        return o._writer !== void 0;
      }
      function Ee(o, l) {
        var d;
        if (o._state === "closed" || o._state === "errored")
          return h(void 0);
        o._writableStreamController._abortReason = l, (d = o._writableStreamController._abortController) === null || d === void 0 || d.abort(l);
        const w = o._state;
        if (w === "closed" || w === "errored")
          return h(void 0);
        if (o._pendingAbortRequest !== void 0)
          return o._pendingAbortRequest._promise;
        let v = !1;
        w === "erroring" && (v = !0, l = void 0);
        const P = f((O, j) => {
          o._pendingAbortRequest = {
            _promise: void 0,
            _resolve: O,
            _reject: j,
            _reason: l,
            _wasAlreadyErroring: v
          };
        });
        return o._pendingAbortRequest._promise = P, v || Ve(o, l), P;
      }
      function Pe(o) {
        const l = o._state;
        if (l === "closed" || l === "errored")
          return m(new TypeError(`The stream (in ${l} state) is not in the writable state and cannot be closed`));
        const d = f((v, P) => {
          const O = {
            _resolve: v,
            _reject: P
          };
          o._closeRequest = O;
        }), w = o._writer;
        return w !== void 0 && o._backpressure && l === "writable" && Ys(w), Yp(o._writableStreamController), d;
      }
      function _e(o) {
        return f((d, w) => {
          const v = {
            _resolve: d,
            _reject: w
          };
          o._writeRequests.push(v);
        });
      }
      function Me(o, l) {
        if (o._state === "writable") {
          Ve(o, l);
          return;
        }
        Ie(o);
      }
      function Ve(o, l) {
        const d = o._writableStreamController;
        o._state = "erroring", o._storedError = l;
        const w = o._writer;
        w !== void 0 && qu(w, l), !Ko(o) && d._started && Ie(o);
      }
      function Ie(o) {
        o._state = "errored", o._writableStreamController[S]();
        const l = o._storedError;
        if (o._writeRequests.forEach((v) => {
          v._reject(l);
        }), o._writeRequests = new Q(), o._pendingAbortRequest === void 0) {
          Jo(o);
          return;
        }
        const d = o._pendingAbortRequest;
        if (o._pendingAbortRequest = void 0, d._wasAlreadyErroring) {
          d._reject(l), Jo(o);
          return;
        }
        const w = o._writableStreamController[Ne](d._reason);
        E(w, () => (d._resolve(), Jo(o), null), (v) => (d._reject(v), Jo(o), null));
      }
      function it(o) {
        o._inFlightWriteRequest._resolve(void 0), o._inFlightWriteRequest = void 0;
      }
      function ot(o, l) {
        o._inFlightWriteRequest._reject(l), o._inFlightWriteRequest = void 0, Me(o, l);
      }
      function qt(o) {
        o._inFlightCloseRequest._resolve(void 0), o._inFlightCloseRequest = void 0, o._state === "erroring" && (o._storedError = void 0, o._pendingAbortRequest !== void 0 && (o._pendingAbortRequest._resolve(), o._pendingAbortRequest = void 0)), o._state = "closed";
        const d = o._writer;
        d !== void 0 && Xu(d);
      }
      function vt(o, l) {
        o._inFlightCloseRequest._reject(l), o._inFlightCloseRequest = void 0, o._pendingAbortRequest !== void 0 && (o._pendingAbortRequest._reject(l), o._pendingAbortRequest = void 0), Me(o, l);
      }
      function Fe(o) {
        return !(o._closeRequest === void 0 && o._inFlightCloseRequest === void 0);
      }
      function Ko(o) {
        return !(o._inFlightWriteRequest === void 0 && o._inFlightCloseRequest === void 0);
      }
      function An(o) {
        o._inFlightCloseRequest = o._closeRequest, o._closeRequest = void 0;
      }
      function Pn(o) {
        o._inFlightWriteRequest = o._writeRequests.shift();
      }
      function Jo(o) {
        o._closeRequest !== void 0 && (o._closeRequest._reject(o._storedError), o._closeRequest = void 0);
        const l = o._writer;
        l !== void 0 && Gs(l, o._storedError);
      }
      function js(o, l) {
        const d = o._writer;
        d !== void 0 && l !== o._backpressure && (l ? tm(d) : Ys(d)), o._backpressure = l;
      }
      class rr {
        constructor(l) {
          if (T(l, 1, "WritableStreamDefaultWriter"), Qo(l, "First parameter"), de(l))
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = l, l._writer = this;
          const d = l._state;
          if (d === "writable")
            !Fe(l) && l._backpressure ? na(this) : Qu(this), ra(this);
          else if (d === "erroring")
            Vs(this, l._storedError), ra(this);
          else if (d === "closed")
            Qu(this), Zp(this);
          else {
            const w = l._storedError;
            Vs(this, w), Yu(this, w);
          }
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the writer’s lock is released before the stream finishes closing.
         */
        get closed() {
          return Qr(this) ? this._closedPromise : m(Kr("closed"));
        }
        /**
         * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
         * A producer can use this information to determine the right amount of data to write.
         *
         * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
         * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
         * the writer’s lock is released.
         */
        get desiredSize() {
          if (!Qr(this))
            throw Kr("desiredSize");
          if (this._ownerWritableStream === void 0)
            throw Ti("desiredSize");
          return Gp(this);
        }
        /**
         * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
         * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
         * back to zero or below, the getter will return a new promise that stays pending until the next transition.
         *
         * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
         * rejected.
         */
        get ready() {
          return Qr(this) ? this._readyPromise : m(Kr("ready"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        abort(l = void 0) {
          return Qr(this) ? this._ownerWritableStream === void 0 ? m(Ti("abort")) : Wp(this, l) : m(Kr("abort"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!Qr(this))
            return m(Kr("close"));
          const l = this._ownerWritableStream;
          return l === void 0 ? m(Ti("close")) : Fe(l) ? m(new TypeError("Cannot close an already-closing stream")) : Mu(this);
        }
        /**
         * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
         * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
         * now on; otherwise, the writer will appear closed.
         *
         * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
         * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
         * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
         * other producers from writing in an interleaved manner.
         */
        releaseLock() {
          if (!Qr(this))
            throw Kr("releaseLock");
          this._ownerWritableStream !== void 0 && ju(this);
        }
        write(l = void 0) {
          return Qr(this) ? this._ownerWritableStream === void 0 ? m(Ti("write to")) : Wu(this, l) : m(Kr("write"));
        }
      }
      Object.defineProperties(rr.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        write: { enumerable: !0 },
        closed: { enumerable: !0 },
        desiredSize: { enumerable: !0 },
        ready: { enumerable: !0 }
      }), s(rr.prototype.abort, "abort"), s(rr.prototype.close, "close"), s(rr.prototype.releaseLock, "releaseLock"), s(rr.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(rr.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultWriter",
        configurable: !0
      });
      function Qr(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_ownerWritableStream") ? !1 : o instanceof rr;
      }
      function Wp(o, l) {
        const d = o._ownerWritableStream;
        return Ee(d, l);
      }
      function Mu(o) {
        const l = o._ownerWritableStream;
        return Pe(l);
      }
      function Hp(o) {
        const l = o._ownerWritableStream, d = l._state;
        return Fe(l) || d === "closed" ? h(void 0) : d === "errored" ? m(l._storedError) : Mu(o);
      }
      function zp(o, l) {
        o._closedPromiseState === "pending" ? Gs(o, l) : em(o, l);
      }
      function qu(o, l) {
        o._readyPromiseState === "pending" ? Ku(o, l) : rm(o, l);
      }
      function Gp(o) {
        const l = o._ownerWritableStream, d = l._state;
        return d === "errored" || d === "erroring" ? null : d === "closed" ? 0 : Gu(l._writableStreamController);
      }
      function ju(o) {
        const l = o._ownerWritableStream, d = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        qu(o, d), zp(o, d), l._writer = void 0, o._ownerWritableStream = void 0;
      }
      function Wu(o, l) {
        const d = o._ownerWritableStream, w = d._writableStreamController, v = Xp(w, l);
        if (d !== o._ownerWritableStream)
          return m(Ti("write to"));
        const P = d._state;
        if (P === "errored")
          return m(d._storedError);
        if (Fe(d) || P === "closed")
          return m(new TypeError("The stream is closing or closed and cannot be written to"));
        if (P === "erroring")
          return m(d._storedError);
        const O = _e(d);
        return Qp(w, l, v), O;
      }
      const Hu = {};
      class In {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
         *
         * @deprecated
         *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
         *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
         */
        get abortReason() {
          if (!Ws(this))
            throw zs("abortReason");
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!Ws(this))
            throw zs("signal");
          if (this._abortController === void 0)
            throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          return this._abortController.signal;
        }
        /**
         * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
         *
         * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
         * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
         * normal lifecycle of interactions with the underlying sink.
         */
        error(l = void 0) {
          if (!Ws(this))
            throw zs("error");
          this._controlledWritableStream._state === "writable" && Vu(this, l);
        }
        /** @internal */
        [Ne](l) {
          const d = this._abortAlgorithm(l);
          return Zo(this), d;
        }
        /** @internal */
        [S]() {
          yt(this);
        }
      }
      Object.defineProperties(In.prototype, {
        abortReason: { enumerable: !0 },
        signal: { enumerable: !0 },
        error: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(In.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultController",
        configurable: !0
      });
      function Ws(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledWritableStream") ? !1 : o instanceof In;
      }
      function zu(o, l, d, w, v, P, O, j) {
        l._controlledWritableStream = o, o._writableStreamController = l, l._queue = void 0, l._queueTotalSize = void 0, yt(l), l._abortReason = void 0, l._abortController = _(), l._started = !1, l._strategySizeAlgorithm = j, l._strategyHWM = O, l._writeAlgorithm = w, l._closeAlgorithm = v, l._abortAlgorithm = P;
        const J = Hs(l);
        js(o, J);
        const z = d(), ne = h(z);
        E(ne, () => (l._started = !0, ea(l), null), (oe) => (l._started = !0, Me(o, oe), null));
      }
      function Vp(o, l, d, w) {
        const v = Object.create(In.prototype);
        let P, O, j, J;
        l.start !== void 0 ? P = () => l.start(v) : P = () => {
        }, l.write !== void 0 ? O = (z) => l.write(z, v) : O = () => h(void 0), l.close !== void 0 ? j = () => l.close() : j = () => h(void 0), l.abort !== void 0 ? J = (z) => l.abort(z) : J = () => h(void 0), zu(o, v, P, O, j, J, d, w);
      }
      function Zo(o) {
        o._writeAlgorithm = void 0, o._closeAlgorithm = void 0, o._abortAlgorithm = void 0, o._strategySizeAlgorithm = void 0;
      }
      function Yp(o) {
        bi(o, Hu, 0), ea(o);
      }
      function Xp(o, l) {
        try {
          return o._strategySizeAlgorithm(l);
        } catch (d) {
          return Ri(o, d), 1;
        }
      }
      function Gu(o) {
        return o._strategyHWM - o._queueTotalSize;
      }
      function Qp(o, l, d) {
        try {
          bi(o, l, d);
        } catch (v) {
          Ri(o, v);
          return;
        }
        const w = o._controlledWritableStream;
        if (!Fe(w) && w._state === "writable") {
          const v = Hs(o);
          js(w, v);
        }
        ea(o);
      }
      function ea(o) {
        const l = o._controlledWritableStream;
        if (!o._started || l._inFlightWriteRequest !== void 0)
          return;
        if (l._state === "erroring") {
          Ie(l);
          return;
        }
        if (o._queue.length === 0)
          return;
        const w = Oo(o);
        w === Hu ? Kp(o) : Jp(o, w);
      }
      function Ri(o, l) {
        o._controlledWritableStream._state === "writable" && Vu(o, l);
      }
      function Kp(o) {
        const l = o._controlledWritableStream;
        An(l), yi(o);
        const d = o._closeAlgorithm();
        Zo(o), E(d, () => (qt(l), null), (w) => (vt(l, w), null));
      }
      function Jp(o, l) {
        const d = o._controlledWritableStream;
        Pn(d);
        const w = o._writeAlgorithm(l);
        E(w, () => {
          it(d);
          const v = d._state;
          if (yi(o), !Fe(d) && v === "writable") {
            const P = Hs(o);
            js(d, P);
          }
          return ea(o), null;
        }, (v) => (d._state === "writable" && Zo(o), ot(d, v), null));
      }
      function Hs(o) {
        return Gu(o) <= 0;
      }
      function Vu(o, l) {
        const d = o._controlledWritableStream;
        Zo(o), Ve(d, l);
      }
      function ta(o) {
        return new TypeError(`WritableStream.prototype.${o} can only be used on a WritableStream`);
      }
      function zs(o) {
        return new TypeError(`WritableStreamDefaultController.prototype.${o} can only be used on a WritableStreamDefaultController`);
      }
      function Kr(o) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${o} can only be used on a WritableStreamDefaultWriter`);
      }
      function Ti(o) {
        return new TypeError("Cannot " + o + " a stream using a released writer");
      }
      function ra(o) {
        o._closedPromise = f((l, d) => {
          o._closedPromise_resolve = l, o._closedPromise_reject = d, o._closedPromiseState = "pending";
        });
      }
      function Yu(o, l) {
        ra(o), Gs(o, l);
      }
      function Zp(o) {
        ra(o), Xu(o);
      }
      function Gs(o, l) {
        o._closedPromise_reject !== void 0 && ($(o._closedPromise), o._closedPromise_reject(l), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0, o._closedPromiseState = "rejected");
      }
      function em(o, l) {
        Yu(o, l);
      }
      function Xu(o) {
        o._closedPromise_resolve !== void 0 && (o._closedPromise_resolve(void 0), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0, o._closedPromiseState = "resolved");
      }
      function na(o) {
        o._readyPromise = f((l, d) => {
          o._readyPromise_resolve = l, o._readyPromise_reject = d;
        }), o._readyPromiseState = "pending";
      }
      function Vs(o, l) {
        na(o), Ku(o, l);
      }
      function Qu(o) {
        na(o), Ys(o);
      }
      function Ku(o, l) {
        o._readyPromise_reject !== void 0 && ($(o._readyPromise), o._readyPromise_reject(l), o._readyPromise_resolve = void 0, o._readyPromise_reject = void 0, o._readyPromiseState = "rejected");
      }
      function tm(o) {
        na(o);
      }
      function rm(o, l) {
        Vs(o, l);
      }
      function Ys(o) {
        o._readyPromise_resolve !== void 0 && (o._readyPromise_resolve(void 0), o._readyPromise_resolve = void 0, o._readyPromise_reject = void 0, o._readyPromiseState = "fulfilled");
      }
      function nm() {
        if (typeof globalThis < "u")
          return globalThis;
        if (typeof self < "u")
          return self;
        if (typeof Ue < "u")
          return Ue;
      }
      const Xs = nm();
      function im(o) {
        if (!(typeof o == "function" || typeof o == "object") || o.name !== "DOMException")
          return !1;
        try {
          return new o(), !0;
        } catch {
          return !1;
        }
      }
      function om() {
        const o = Xs == null ? void 0 : Xs.DOMException;
        return im(o) ? o : void 0;
      }
      function am() {
        const o = function(d, w) {
          this.message = d || "", this.name = w || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        };
        return s(o, "DOMException"), o.prototype = Object.create(Error.prototype), Object.defineProperty(o.prototype, "constructor", { value: o, writable: !0, configurable: !0 }), o;
      }
      const sm = om() || am();
      function Ju(o, l, d, w, v, P) {
        const O = ye(o), j = k(l);
        o._disturbed = !0;
        let J = !1, z = h(void 0);
        return f((ne, oe) => {
          let me;
          if (P !== void 0) {
            if (me = () => {
              const G = P.reason !== void 0 ? P.reason : new sm("Aborted", "AbortError"), le = [];
              w || le.push(() => l._state === "writable" ? Ee(l, G) : h(void 0)), v || le.push(() => o._state === "readable" ? Rt(o, G) : h(void 0)), at(() => Promise.all(le.map((be) => be())), !0, G);
            }, P.aborted) {
              me();
              return;
            }
            P.addEventListener("abort", me);
          }
          function Tt() {
            return f((G, le) => {
              function be(ht) {
                ht ? G() : b(Nn(), be, le);
              }
              be(!1);
            });
          }
          function Nn() {
            return J ? h(!0) : b(j._readyPromise, () => f((G, le) => {
              jr(O, {
                _chunkSteps: (be) => {
                  z = b(Wu(j, be), void 0, n), G(!1);
                },
                _closeSteps: () => G(!0),
                _errorSteps: le
              });
            }));
          }
          if (ir(o, O._closedPromise, (G) => (w ? bt(!0, G) : at(() => Ee(l, G), !0, G), null)), ir(l, j._closedPromise, (G) => (v ? bt(!0, G) : at(() => Rt(o, G), !0, G), null)), Ye(o, O._closedPromise, () => (d ? bt() : at(() => Hp(j)), null)), Fe(l) || l._state === "closed") {
            const G = new TypeError("the destination writable stream closed before all data could be piped to it");
            v ? bt(!0, G) : at(() => Rt(o, G), !0, G);
          }
          $(Tt());
          function Cr() {
            const G = z;
            return b(z, () => G !== z ? Cr() : void 0);
          }
          function ir(G, le, be) {
            G._state === "errored" ? be(G._storedError) : A(le, be);
          }
          function Ye(G, le, be) {
            G._state === "closed" ? be() : C(le, be);
          }
          function at(G, le, be) {
            if (J)
              return;
            J = !0, l._state === "writable" && !Fe(l) ? C(Cr(), ht) : ht();
            function ht() {
              return E(G(), () => or(le, be), (Fn) => or(!0, Fn)), null;
            }
          }
          function bt(G, le) {
            J || (J = !0, l._state === "writable" && !Fe(l) ? C(Cr(), () => or(G, le)) : or(G, le));
          }
          function or(G, le) {
            return ju(j), D(O), P !== void 0 && P.removeEventListener("abort", me), G ? oe(le) : ne(void 0), null;
          }
        });
      }
      class nr {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!ia(this))
            throw aa("desiredSize");
          return Qs(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!ia(this))
            throw aa("close");
          if (!On(this))
            throw new TypeError("The stream is not in a state that permits close");
          Jr(this);
        }
        enqueue(l = void 0) {
          if (!ia(this))
            throw aa("enqueue");
          if (!On(this))
            throw new TypeError("The stream is not in a state that permits enqueue");
          return $n(this, l);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(l = void 0) {
          if (!ia(this))
            throw aa("error");
          Ct(this, l);
        }
        /** @internal */
        [re](l) {
          yt(this);
          const d = this._cancelAlgorithm(l);
          return oa(this), d;
        }
        /** @internal */
        [Z](l) {
          const d = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const w = yi(this);
            this._closeRequested && this._queue.length === 0 ? (oa(this), Ii(d)) : Ai(this), l._chunkSteps(w);
          } else
            rt(d, l), Ai(this);
        }
        /** @internal */
        [X]() {
        }
      }
      Object.defineProperties(nr.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(nr.prototype.close, "close"), s(nr.prototype.enqueue, "enqueue"), s(nr.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(nr.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultController",
        configurable: !0
      });
      function ia(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledReadableStream") ? !1 : o instanceof nr;
      }
      function Ai(o) {
        if (!Zu(o))
          return;
        if (o._pulling) {
          o._pullAgain = !0;
          return;
        }
        o._pulling = !0;
        const d = o._pullAlgorithm();
        E(d, () => (o._pulling = !1, o._pullAgain && (o._pullAgain = !1, Ai(o)), null), (w) => (Ct(o, w), null));
      }
      function Zu(o) {
        const l = o._controlledReadableStream;
        return !On(o) || !o._started ? !1 : !!(Sr(l) && Yt(l) > 0 || Qs(o) > 0);
      }
      function oa(o) {
        o._pullAlgorithm = void 0, o._cancelAlgorithm = void 0, o._strategySizeAlgorithm = void 0;
      }
      function Jr(o) {
        if (!On(o))
          return;
        const l = o._controlledReadableStream;
        o._closeRequested = !0, o._queue.length === 0 && (oa(o), Ii(l));
      }
      function $n(o, l) {
        if (!On(o))
          return;
        const d = o._controlledReadableStream;
        if (Sr(d) && Yt(d) > 0)
          qr(d, l, !1);
        else {
          let w;
          try {
            w = o._strategySizeAlgorithm(l);
          } catch (v) {
            throw Ct(o, v), v;
          }
          try {
            bi(o, l, w);
          } catch (v) {
            throw Ct(o, v), v;
          }
        }
        Ai(o);
      }
      function Ct(o, l) {
        const d = o._controlledReadableStream;
        d._state === "readable" && (yt(o), oa(o), nc(d, l));
      }
      function Qs(o) {
        const l = o._controlledReadableStream._state;
        return l === "errored" ? null : l === "closed" ? 0 : o._strategyHWM - o._queueTotalSize;
      }
      function lm(o) {
        return !Zu(o);
      }
      function On(o) {
        const l = o._controlledReadableStream._state;
        return !o._closeRequested && l === "readable";
      }
      function ec(o, l, d, w, v, P, O) {
        l._controlledReadableStream = o, l._queue = void 0, l._queueTotalSize = void 0, yt(l), l._started = !1, l._closeRequested = !1, l._pullAgain = !1, l._pulling = !1, l._strategySizeAlgorithm = O, l._strategyHWM = P, l._pullAlgorithm = w, l._cancelAlgorithm = v, o._readableStreamController = l;
        const j = d();
        E(h(j), () => (l._started = !0, Ai(l), null), (J) => (Ct(l, J), null));
      }
      function um(o, l, d, w) {
        const v = Object.create(nr.prototype);
        let P, O, j;
        l.start !== void 0 ? P = () => l.start(v) : P = () => {
        }, l.pull !== void 0 ? O = () => l.pull(v) : O = () => h(void 0), l.cancel !== void 0 ? j = (J) => l.cancel(J) : j = () => h(void 0), ec(o, v, P, O, j, d, w);
      }
      function aa(o) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${o} can only be used on a ReadableStreamDefaultController`);
      }
      function cm(o, l) {
        return Kt(o._readableStreamController) ? dm(o) : fm(o);
      }
      function fm(o, l) {
        const d = ye(o);
        let w = !1, v = !1, P = !1, O = !1, j, J, z, ne, oe;
        const me = f((Ye) => {
          oe = Ye;
        });
        function Tt() {
          return w ? (v = !0, h(void 0)) : (w = !0, jr(d, {
            _chunkSteps: (at) => {
              M(() => {
                v = !1;
                const bt = at, or = at;
                P || $n(z._readableStreamController, bt), O || $n(ne._readableStreamController, or), w = !1, v && Tt();
              });
            },
            _closeSteps: () => {
              w = !1, P || Jr(z._readableStreamController), O || Jr(ne._readableStreamController), (!P || !O) && oe(void 0);
            },
            _errorSteps: () => {
              w = !1;
            }
          }), h(void 0));
        }
        function Nn(Ye) {
          if (P = !0, j = Ye, O) {
            const at = Wr([j, J]), bt = Rt(o, at);
            oe(bt);
          }
          return me;
        }
        function Cr(Ye) {
          if (O = !0, J = Ye, P) {
            const at = Wr([j, J]), bt = Rt(o, at);
            oe(bt);
          }
          return me;
        }
        function ir() {
        }
        return z = Pi(ir, Tt, Nn), ne = Pi(ir, Tt, Cr), A(d._closedPromise, (Ye) => (Ct(z._readableStreamController, Ye), Ct(ne._readableStreamController, Ye), (!P || !O) && oe(void 0), null)), [z, ne];
      }
      function dm(o) {
        let l = ye(o), d = !1, w = !1, v = !1, P = !1, O = !1, j, J, z, ne, oe;
        const me = f((G) => {
          oe = G;
        });
        function Tt(G) {
          A(G._closedPromise, (le) => (G !== l || (nt(z._readableStreamController, le), nt(ne._readableStreamController, le), (!P || !O) && oe(void 0)), null));
        }
        function Nn() {
          er(l) && (D(l), l = ye(o), Tt(l)), jr(l, {
            _chunkSteps: (le) => {
              M(() => {
                w = !1, v = !1;
                const be = le;
                let ht = le;
                if (!P && !O)
                  try {
                    ht = $o(le);
                  } catch (Fn) {
                    nt(z._readableStreamController, Fn), nt(ne._readableStreamController, Fn), oe(Rt(o, Fn));
                    return;
                  }
                P || Zt(z._readableStreamController, be), O || Zt(ne._readableStreamController, ht), d = !1, w ? ir() : v && Ye();
              });
            },
            _closeSteps: () => {
              d = !1, P || Vr(z._readableStreamController), O || Vr(ne._readableStreamController), z._readableStreamController._pendingPullIntos.length > 0 && Sn(z._readableStreamController, 0), ne._readableStreamController._pendingPullIntos.length > 0 && Sn(ne._readableStreamController, 0), (!P || !O) && oe(void 0);
            },
            _errorSteps: () => {
              d = !1;
            }
          });
        }
        function Cr(G, le) {
          Dt(l) && (D(l), l = jo(o), Tt(l));
          const be = le ? ne : z, ht = le ? z : ne;
          zo(l, G, 1, {
            _chunkSteps: (kn) => {
              M(() => {
                w = !1, v = !1;
                const Ln = le ? O : P;
                if (le ? P : O)
                  Ln || vn(be._readableStreamController, kn);
                else {
                  let gc;
                  try {
                    gc = $o(kn);
                  } catch (tl) {
                    nt(be._readableStreamController, tl), nt(ht._readableStreamController, tl), oe(Rt(o, tl));
                    return;
                  }
                  Ln || vn(be._readableStreamController, kn), Zt(ht._readableStreamController, gc);
                }
                d = !1, w ? ir() : v && Ye();
              });
            },
            _closeSteps: (kn) => {
              d = !1;
              const Ln = le ? O : P, pa = le ? P : O;
              Ln || Vr(be._readableStreamController), pa || Vr(ht._readableStreamController), kn !== void 0 && (Ln || vn(be._readableStreamController, kn), !pa && ht._readableStreamController._pendingPullIntos.length > 0 && Sn(ht._readableStreamController, 0)), (!Ln || !pa) && oe(void 0);
            },
            _errorSteps: () => {
              d = !1;
            }
          });
        }
        function ir() {
          if (d)
            return w = !0, h(void 0);
          d = !0;
          const G = En(z._readableStreamController);
          return G === null ? Nn() : Cr(G._view, !1), h(void 0);
        }
        function Ye() {
          if (d)
            return v = !0, h(void 0);
          d = !0;
          const G = En(ne._readableStreamController);
          return G === null ? Nn() : Cr(G._view, !0), h(void 0);
        }
        function at(G) {
          if (P = !0, j = G, O) {
            const le = Wr([j, J]), be = Rt(o, le);
            oe(be);
          }
          return me;
        }
        function bt(G) {
          if (O = !0, J = G, P) {
            const le = Wr([j, J]), be = Rt(o, le);
            oe(be);
          }
          return me;
        }
        function or() {
        }
        return z = rc(or, ir, at), ne = rc(or, Ye, bt), Tt(l), [z, ne];
      }
      function hm(o) {
        return i(o) && typeof o.getReader < "u";
      }
      function pm(o) {
        return hm(o) ? gm(o.getReader()) : mm(o);
      }
      function mm(o) {
        let l;
        const d = bn(o, "async"), w = n;
        function v() {
          let O;
          try {
            O = gi(d);
          } catch (J) {
            return m(J);
          }
          const j = h(O);
          return I(j, (J) => {
            if (!i(J))
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (Gr(J))
              Jr(l._readableStreamController);
            else {
              const ne = $s(J);
              $n(l._readableStreamController, ne);
            }
          });
        }
        function P(O) {
          const j = d.iterator;
          let J;
          try {
            J = mr(j, "return");
          } catch (oe) {
            return m(oe);
          }
          if (J === void 0)
            return h(void 0);
          let z;
          try {
            z = x(J, j, [O]);
          } catch (oe) {
            return m(oe);
          }
          const ne = h(z);
          return I(ne, (oe) => {
            if (!i(oe))
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
          });
        }
        return l = Pi(w, v, P, 0), l;
      }
      function gm(o) {
        let l;
        const d = n;
        function w() {
          let P;
          try {
            P = o.read();
          } catch (O) {
            return m(O);
          }
          return I(P, (O) => {
            if (!i(O))
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            if (O.done)
              Jr(l._readableStreamController);
            else {
              const j = O.value;
              $n(l._readableStreamController, j);
            }
          });
        }
        function v(P) {
          try {
            return h(o.cancel(P));
          } catch (O) {
            return m(O);
          }
        }
        return l = Pi(d, w, v, 0), l;
      }
      function ym(o, l) {
        Ce(o, l);
        const d = o, w = d == null ? void 0 : d.autoAllocateChunkSize, v = d == null ? void 0 : d.cancel, P = d == null ? void 0 : d.pull, O = d == null ? void 0 : d.start, j = d == null ? void 0 : d.type;
        return {
          autoAllocateChunkSize: w === void 0 ? void 0 : Ae(w, `${l} has member 'autoAllocateChunkSize' that`),
          cancel: v === void 0 ? void 0 : bm(v, d, `${l} has member 'cancel' that`),
          pull: P === void 0 ? void 0 : wm(P, d, `${l} has member 'pull' that`),
          start: O === void 0 ? void 0 : _m(O, d, `${l} has member 'start' that`),
          type: j === void 0 ? void 0 : Em(j, `${l} has member 'type' that`)
        };
      }
      function bm(o, l, d) {
        return y(o, d), (w) => te(o, l, [w]);
      }
      function wm(o, l, d) {
        return y(o, d), (w) => te(o, l, [w]);
      }
      function _m(o, l, d) {
        return y(o, d), (w) => x(o, l, [w]);
      }
      function Em(o, l) {
        if (o = `${o}`, o !== "bytes")
          throw new TypeError(`${l} '${o}' is not a valid enumeration value for ReadableStreamType`);
        return o;
      }
      function Sm(o, l) {
        return Ce(o, l), { preventCancel: !!(o == null ? void 0 : o.preventCancel) };
      }
      function tc(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.preventAbort, w = o == null ? void 0 : o.preventCancel, v = o == null ? void 0 : o.preventClose, P = o == null ? void 0 : o.signal;
        return P !== void 0 && vm(P, `${l} has member 'signal' that`), {
          preventAbort: !!d,
          preventCancel: !!w,
          preventClose: !!v,
          signal: P
        };
      }
      function vm(o, l) {
        if (!Ms(o))
          throw new TypeError(`${l} is not an AbortSignal.`);
      }
      function Cm(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.readable;
        se(d, "readable", "ReadableWritablePair"), mt(d, `${l} has member 'readable' that`);
        const w = o == null ? void 0 : o.writable;
        return se(w, "writable", "ReadableWritablePair"), Qo(w, `${l} has member 'writable' that`), { readable: d, writable: w };
      }
      class We {
        constructor(l = {}, d = {}) {
          l === void 0 ? l = null : F(l, "First parameter");
          const w = _r(d, "Second parameter"), v = ym(l, "First parameter");
          if (Ks(this), v.type === "bytes") {
            if (w.size !== void 0)
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            const P = Mt(w, 0);
            Us(this, v, P);
          } else {
            const P = Tn(w), O = Mt(w, 1);
            um(this, v, O, P);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!Er(this))
            throw Zr("locked");
          return Sr(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(l = void 0) {
          return Er(this) ? Sr(this) ? m(new TypeError("Cannot cancel a stream that already has a reader")) : Rt(this, l) : m(Zr("cancel"));
        }
        getReader(l = void 0) {
          if (!Er(this))
            throw Zr("getReader");
          return qo(l, "First parameter").mode === void 0 ? ye(this) : jo(this);
        }
        pipeThrough(l, d = {}) {
          if (!Er(this))
            throw Zr("pipeThrough");
          T(l, 1, "pipeThrough");
          const w = Cm(l, "First parameter"), v = tc(d, "Second parameter");
          if (Sr(this))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (de(w.writable))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const P = Ju(this, w.writable, v.preventClose, v.preventAbort, v.preventCancel, v.signal);
          return $(P), w.readable;
        }
        pipeTo(l, d = {}) {
          if (!Er(this))
            return m(Zr("pipeTo"));
          if (l === void 0)
            return m("Parameter 1 is required in 'pipeTo'.");
          if (!K(l))
            return m(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let w;
          try {
            w = tc(d, "Second parameter");
          } catch (v) {
            return m(v);
          }
          return Sr(this) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : de(l) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Ju(this, l, w.preventClose, w.preventAbort, w.preventCancel, w.signal);
        }
        /**
         * Tees this readable stream, returning a two-element array containing the two resulting branches as
         * new {@link ReadableStream} instances.
         *
         * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
         * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
         * propagated to the stream's underlying source.
         *
         * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
         * this could allow interference between the two branches.
         */
        tee() {
          if (!Er(this))
            throw Zr("tee");
          const l = cm(this);
          return Wr(l);
        }
        values(l = void 0) {
          if (!Er(this))
            throw Zr("values");
          const d = Sm(l, "First parameter");
          return Ao(this, d.preventCancel);
        }
        [zr](l) {
          return this.values(l);
        }
        /**
         * Creates a new ReadableStream wrapping the provided iterable or async iterable.
         *
         * This can be used to adapt various kinds of objects into a readable stream,
         * such as an array, an async generator, or a Node.js readable stream.
         */
        static from(l) {
          return pm(l);
        }
      }
      Object.defineProperties(We, {
        from: { enumerable: !0 }
      }), Object.defineProperties(We.prototype, {
        cancel: { enumerable: !0 },
        getReader: { enumerable: !0 },
        pipeThrough: { enumerable: !0 },
        pipeTo: { enumerable: !0 },
        tee: { enumerable: !0 },
        values: { enumerable: !0 },
        locked: { enumerable: !0 }
      }), s(We.from, "from"), s(We.prototype.cancel, "cancel"), s(We.prototype.getReader, "getReader"), s(We.prototype.pipeThrough, "pipeThrough"), s(We.prototype.pipeTo, "pipeTo"), s(We.prototype.tee, "tee"), s(We.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(We.prototype, Symbol.toStringTag, {
        value: "ReadableStream",
        configurable: !0
      }), Object.defineProperty(We.prototype, zr, {
        value: We.prototype.values,
        writable: !0,
        configurable: !0
      });
      function Pi(o, l, d, w = 1, v = () => 1) {
        const P = Object.create(We.prototype);
        Ks(P);
        const O = Object.create(nr.prototype);
        return ec(P, O, o, l, d, w, v), P;
      }
      function rc(o, l, d) {
        const w = Object.create(We.prototype);
        Ks(w);
        const v = Object.create(St.prototype);
        return Bo(w, v, o, l, d, 0, void 0), w;
      }
      function Ks(o) {
        o._state = "readable", o._reader = void 0, o._storedError = void 0, o._disturbed = !1;
      }
      function Er(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readableStreamController") ? !1 : o instanceof We;
      }
      function Sr(o) {
        return o._reader !== void 0;
      }
      function Rt(o, l) {
        if (o._disturbed = !0, o._state === "closed")
          return h(void 0);
        if (o._state === "errored")
          return m(o._storedError);
        Ii(o);
        const d = o._reader;
        if (d !== void 0 && er(d)) {
          const v = d._readIntoRequests;
          d._readIntoRequests = new Q(), v.forEach((P) => {
            P._closeSteps(void 0);
          });
        }
        const w = o._readableStreamController[re](l);
        return I(w, n);
      }
      function Ii(o) {
        o._state = "closed";
        const l = o._reader;
        if (l !== void 0 && (ee(l), Dt(l))) {
          const d = l._readRequests;
          l._readRequests = new Q(), d.forEach((w) => {
            w._closeSteps();
          });
        }
      }
      function nc(o, l) {
        o._state = "errored", o._storedError = l;
        const d = o._reader;
        d !== void 0 && (V(d, l), Dt(d) ? To(d, l) : Ci(d, l));
      }
      function Zr(o) {
        return new TypeError(`ReadableStream.prototype.${o} can only be used on a ReadableStream`);
      }
      function ic(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.highWaterMark;
        return se(d, "highWaterMark", "QueuingStrategyInit"), {
          highWaterMark: pe(d)
        };
      }
      const oc = (o) => o.byteLength;
      s(oc, "size");
      class sa {
        constructor(l) {
          T(l, 1, "ByteLengthQueuingStrategy"), l = ic(l, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = l.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!sc(this))
            throw ac("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!sc(this))
            throw ac("size");
          return oc;
        }
      }
      Object.defineProperties(sa.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(sa.prototype, Symbol.toStringTag, {
        value: "ByteLengthQueuingStrategy",
        configurable: !0
      });
      function ac(o) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${o} can only be used on a ByteLengthQueuingStrategy`);
      }
      function sc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_byteLengthQueuingStrategyHighWaterMark") ? !1 : o instanceof sa;
      }
      const lc = () => 1;
      s(lc, "size");
      class la {
        constructor(l) {
          T(l, 1, "CountQueuingStrategy"), l = ic(l, "First parameter"), this._countQueuingStrategyHighWaterMark = l.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!cc(this))
            throw uc("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!cc(this))
            throw uc("size");
          return lc;
        }
      }
      Object.defineProperties(la.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(la.prototype, Symbol.toStringTag, {
        value: "CountQueuingStrategy",
        configurable: !0
      });
      function uc(o) {
        return new TypeError(`CountQueuingStrategy.prototype.${o} can only be used on a CountQueuingStrategy`);
      }
      function cc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_countQueuingStrategyHighWaterMark") ? !1 : o instanceof la;
      }
      function Rm(o, l) {
        Ce(o, l);
        const d = o == null ? void 0 : o.cancel, w = o == null ? void 0 : o.flush, v = o == null ? void 0 : o.readableType, P = o == null ? void 0 : o.start, O = o == null ? void 0 : o.transform, j = o == null ? void 0 : o.writableType;
        return {
          cancel: d === void 0 ? void 0 : Im(d, o, `${l} has member 'cancel' that`),
          flush: w === void 0 ? void 0 : Tm(w, o, `${l} has member 'flush' that`),
          readableType: v,
          start: P === void 0 ? void 0 : Am(P, o, `${l} has member 'start' that`),
          transform: O === void 0 ? void 0 : Pm(O, o, `${l} has member 'transform' that`),
          writableType: j
        };
      }
      function Tm(o, l, d) {
        return y(o, d), (w) => te(o, l, [w]);
      }
      function Am(o, l, d) {
        return y(o, d), (w) => x(o, l, [w]);
      }
      function Pm(o, l, d) {
        return y(o, d), (w, v) => te(o, l, [w, v]);
      }
      function Im(o, l, d) {
        return y(o, d), (w) => te(o, l, [w]);
      }
      class ua {
        constructor(l = {}, d = {}, w = {}) {
          l === void 0 && (l = null);
          const v = _r(d, "Second parameter"), P = _r(w, "Third parameter"), O = Rm(l, "First parameter");
          if (O.readableType !== void 0)
            throw new RangeError("Invalid readableType specified");
          if (O.writableType !== void 0)
            throw new RangeError("Invalid writableType specified");
          const j = Mt(P, 0), J = Tn(P), z = Mt(v, 1), ne = Tn(v);
          let oe;
          const me = f((Tt) => {
            oe = Tt;
          });
          $m(this, me, z, ne, j, J), Dm(this, O), O.start !== void 0 ? oe(O.start(this._transformStreamController)) : oe(void 0);
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!fc(this))
            throw mc("readable");
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!fc(this))
            throw mc("writable");
          return this._writable;
        }
      }
      Object.defineProperties(ua.prototype, {
        readable: { enumerable: !0 },
        writable: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ua.prototype, Symbol.toStringTag, {
        value: "TransformStream",
        configurable: !0
      });
      function $m(o, l, d, w, v, P) {
        function O() {
          return l;
        }
        function j(me) {
          return km(o, me);
        }
        function J(me) {
          return Lm(o, me);
        }
        function z() {
          return xm(o);
        }
        o._writable = W(O, j, z, J, d, w);
        function ne() {
          return Um(o);
        }
        function oe(me) {
          return Bm(o, me);
        }
        o._readable = Pi(O, ne, oe, v, P), o._backpressure = void 0, o._backpressureChangePromise = void 0, o._backpressureChangePromise_resolve = void 0, ca(o, !0), o._transformStreamController = void 0;
      }
      function fc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_transformStreamController") ? !1 : o instanceof ua;
      }
      function dc(o, l) {
        Ct(o._readable._readableStreamController, l), Js(o, l);
      }
      function Js(o, l) {
        da(o._transformStreamController), Ri(o._writable._writableStreamController, l), Zs(o);
      }
      function Zs(o) {
        o._backpressure && ca(o, !1);
      }
      function ca(o, l) {
        o._backpressureChangePromise !== void 0 && o._backpressureChangePromise_resolve(), o._backpressureChangePromise = f((d) => {
          o._backpressureChangePromise_resolve = d;
        }), o._backpressure = l;
      }
      class vr {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!fa(this))
            throw ha("desiredSize");
          const l = this._controlledTransformStream._readable._readableStreamController;
          return Qs(l);
        }
        enqueue(l = void 0) {
          if (!fa(this))
            throw ha("enqueue");
          hc(this, l);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(l = void 0) {
          if (!fa(this))
            throw ha("error");
          Nm(this, l);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!fa(this))
            throw ha("terminate");
          Fm(this);
        }
      }
      Object.defineProperties(vr.prototype, {
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        terminate: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(vr.prototype.enqueue, "enqueue"), s(vr.prototype.error, "error"), s(vr.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(vr.prototype, Symbol.toStringTag, {
        value: "TransformStreamDefaultController",
        configurable: !0
      });
      function fa(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledTransformStream") ? !1 : o instanceof vr;
      }
      function Om(o, l, d, w, v) {
        l._controlledTransformStream = o, o._transformStreamController = l, l._transformAlgorithm = d, l._flushAlgorithm = w, l._cancelAlgorithm = v, l._finishPromise = void 0, l._finishPromise_resolve = void 0, l._finishPromise_reject = void 0;
      }
      function Dm(o, l) {
        const d = Object.create(vr.prototype);
        let w, v, P;
        l.transform !== void 0 ? w = (O) => l.transform(O, d) : w = (O) => {
          try {
            return hc(d, O), h(void 0);
          } catch (j) {
            return m(j);
          }
        }, l.flush !== void 0 ? v = () => l.flush(d) : v = () => h(void 0), l.cancel !== void 0 ? P = (O) => l.cancel(O) : P = () => h(void 0), Om(o, d, w, v, P);
      }
      function da(o) {
        o._transformAlgorithm = void 0, o._flushAlgorithm = void 0, o._cancelAlgorithm = void 0;
      }
      function hc(o, l) {
        const d = o._controlledTransformStream, w = d._readable._readableStreamController;
        if (!On(w))
          throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          $n(w, l);
        } catch (P) {
          throw Js(d, P), d._readable._storedError;
        }
        lm(w) !== d._backpressure && ca(d, !0);
      }
      function Nm(o, l) {
        dc(o._controlledTransformStream, l);
      }
      function pc(o, l) {
        const d = o._transformAlgorithm(l);
        return I(d, void 0, (w) => {
          throw dc(o._controlledTransformStream, w), w;
        });
      }
      function Fm(o) {
        const l = o._controlledTransformStream, d = l._readable._readableStreamController;
        Jr(d);
        const w = new TypeError("TransformStream terminated");
        Js(l, w);
      }
      function km(o, l) {
        const d = o._transformStreamController;
        if (o._backpressure) {
          const w = o._backpressureChangePromise;
          return I(w, () => {
            const v = o._writable;
            if (v._state === "erroring")
              throw v._storedError;
            return pc(d, l);
          });
        }
        return pc(d, l);
      }
      function Lm(o, l) {
        const d = o._transformStreamController;
        if (d._finishPromise !== void 0)
          return d._finishPromise;
        const w = o._readable;
        d._finishPromise = f((P, O) => {
          d._finishPromise_resolve = P, d._finishPromise_reject = O;
        });
        const v = d._cancelAlgorithm(l);
        return da(d), E(v, () => (w._state === "errored" ? Dn(d, w._storedError) : (Ct(w._readableStreamController, l), el(d)), null), (P) => (Ct(w._readableStreamController, P), Dn(d, P), null)), d._finishPromise;
      }
      function xm(o) {
        const l = o._transformStreamController;
        if (l._finishPromise !== void 0)
          return l._finishPromise;
        const d = o._readable;
        l._finishPromise = f((v, P) => {
          l._finishPromise_resolve = v, l._finishPromise_reject = P;
        });
        const w = l._flushAlgorithm();
        return da(l), E(w, () => (d._state === "errored" ? Dn(l, d._storedError) : (Jr(d._readableStreamController), el(l)), null), (v) => (Ct(d._readableStreamController, v), Dn(l, v), null)), l._finishPromise;
      }
      function Um(o) {
        return ca(o, !1), o._backpressureChangePromise;
      }
      function Bm(o, l) {
        const d = o._transformStreamController;
        if (d._finishPromise !== void 0)
          return d._finishPromise;
        const w = o._writable;
        d._finishPromise = f((P, O) => {
          d._finishPromise_resolve = P, d._finishPromise_reject = O;
        });
        const v = d._cancelAlgorithm(l);
        return da(d), E(v, () => (w._state === "errored" ? Dn(d, w._storedError) : (Ri(w._writableStreamController, l), Zs(o), el(d)), null), (P) => (Ri(w._writableStreamController, P), Zs(o), Dn(d, P), null)), d._finishPromise;
      }
      function ha(o) {
        return new TypeError(`TransformStreamDefaultController.prototype.${o} can only be used on a TransformStreamDefaultController`);
      }
      function el(o) {
        o._finishPromise_resolve !== void 0 && (o._finishPromise_resolve(), o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0);
      }
      function Dn(o, l) {
        o._finishPromise_reject !== void 0 && ($(o._finishPromise), o._finishPromise_reject(l), o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0);
      }
      function mc(o) {
        return new TypeError(`TransformStream.prototype.${o} can only be used on a TransformStream`);
      }
      r.ByteLengthQueuingStrategy = sa, r.CountQueuingStrategy = la, r.ReadableByteStreamController = St, r.ReadableStream = We, r.ReadableStreamBYOBReader = Bt, r.ReadableStreamBYOBRequest = Qt, r.ReadableStreamDefaultController = nr, r.ReadableStreamDefaultReader = ct, r.TransformStream = ua, r.TransformStreamDefaultController = vr, r.WritableStream = R, r.WritableStreamDefaultController = In, r.WritableStreamDefaultWriter = rr;
    });
  }(ma, ma.exports)), ma.exports;
}
const rg = 65536;
if (!globalThis.ReadableStream)
  try {
    const e = require("node:process"), { emitWarning: t } = e;
    try {
      e.emitWarning = () => {
      }, Object.assign(globalThis, require("node:stream/web")), e.emitWarning = t;
    } catch (r) {
      throw e.emitWarning = t, r;
    }
  } catch {
    Object.assign(globalThis, tg());
  }
try {
  const { Blob: e } = require("buffer");
  e && !e.prototype.stream && (e.prototype.stream = function(r) {
    let n = 0;
    const i = this;
    return new ReadableStream({
      type: "bytes",
      async pull(a) {
        const u = await i.slice(n, Math.min(i.size, n + rg)).arrayBuffer();
        n += u.byteLength, a.enqueue(new Uint8Array(u)), n === i.size && a.close();
      }
    });
  });
} catch {
}
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const Ec = 65536;
async function* rl(e, t = !0) {
  for (const r of e)
    if ("stream" in r)
      yield* (
        /** @type {AsyncIterableIterator<Uint8Array>} */
        r.stream()
      );
    else if (ArrayBuffer.isView(r))
      if (t) {
        let n = r.byteOffset;
        const i = r.byteOffset + r.byteLength;
        for (; n !== i; ) {
          const a = Math.min(i - n, Ec), s = r.buffer.slice(n, n + a);
          n += s.byteLength, yield new Uint8Array(s);
        }
      } else
        yield r;
    else {
      let n = 0, i = (
        /** @type {Blob} */
        r
      );
      for (; n !== i.size; ) {
        const s = await i.slice(n, Math.min(i.size, n + Ec)).arrayBuffer();
        n += s.byteLength, yield new Uint8Array(s);
      }
    }
}
var ur, co, ti, rs, cn;
const Id = (cn = class {
  /**
   * The Blob() constructor returns a new Blob object. The content
   * of the blob consists of the concatenation of the values given
   * in the parameter array.
   *
   * @param {*} blobParts
   * @param {{ type?: string, endings?: string }} [options]
   */
  constructor(t = [], r = {}) {
    /** @type {Array.<(Blob|Uint8Array)>} */
    Rr(this, ur, []);
    Rr(this, co, "");
    Rr(this, ti, 0);
    Rr(this, rs, "transparent");
    if (typeof t != "object" || t === null)
      throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
    if (typeof t[Symbol.iterator] != "function")
      throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
    if (typeof r != "object" && typeof r != "function")
      throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
    r === null && (r = {});
    const n = new TextEncoder();
    for (const a of t) {
      let s;
      ArrayBuffer.isView(a) ? s = new Uint8Array(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength)) : a instanceof ArrayBuffer ? s = new Uint8Array(a.slice(0)) : a instanceof cn ? s = a : s = n.encode(`${a}`), jt(this, ti, ke(this, ti) + (ArrayBuffer.isView(s) ? s.byteLength : s.size)), ke(this, ur).push(s);
    }
    jt(this, rs, `${r.endings === void 0 ? "transparent" : r.endings}`);
    const i = r.type === void 0 ? "" : String(r.type);
    jt(this, co, /^[\x20-\x7E]*$/.test(i) ? i : "");
  }
  /**
   * The Blob interface's size property returns the
   * size of the Blob in bytes.
   */
  get size() {
    return ke(this, ti);
  }
  /**
   * The type property of a Blob object returns the MIME type of the file.
   */
  get type() {
    return ke(this, co);
  }
  /**
   * The text() method in the Blob interface returns a Promise
   * that resolves with a string containing the contents of
   * the blob, interpreted as UTF-8.
   *
   * @return {Promise<string>}
   */
  async text() {
    const t = new TextDecoder();
    let r = "";
    for await (const n of rl(ke(this, ur), !1))
      r += t.decode(n, { stream: !0 });
    return r += t.decode(), r;
  }
  /**
   * The arrayBuffer() method in the Blob interface returns a
   * Promise that resolves with the contents of the blob as
   * binary data contained in an ArrayBuffer.
   *
   * @return {Promise<ArrayBuffer>}
   */
  async arrayBuffer() {
    const t = new Uint8Array(this.size);
    let r = 0;
    for await (const n of rl(ke(this, ur), !1))
      t.set(n, r), r += n.length;
    return t.buffer;
  }
  stream() {
    const t = rl(ke(this, ur), !0);
    return new globalThis.ReadableStream({
      // @ts-ignore
      type: "bytes",
      async pull(r) {
        const n = await t.next();
        n.done ? r.close() : r.enqueue(n.value);
      },
      async cancel() {
        await t.return();
      }
    });
  }
  /**
   * The Blob interface's slice() method creates and returns a
   * new Blob object which contains data from a subset of the
   * blob on which it's called.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @param {string} [type]
   */
  slice(t = 0, r = this.size, n = "") {
    const { size: i } = this;
    let a = t < 0 ? Math.max(i + t, 0) : Math.min(t, i), s = r < 0 ? Math.max(i + r, 0) : Math.min(r, i);
    const u = Math.max(s - a, 0), c = ke(this, ur), g = [];
    let f = 0;
    for (const m of c) {
      if (f >= u)
        break;
      const b = ArrayBuffer.isView(m) ? m.byteLength : m.size;
      if (a && b <= a)
        a -= b, s -= b;
      else {
        let E;
        ArrayBuffer.isView(m) ? (E = m.subarray(a, Math.min(b, s)), f += E.byteLength) : (E = m.slice(a, Math.min(b, s)), f += E.size), s -= b, g.push(E), a = 0;
      }
    }
    const h = new cn([], { type: String(n).toLowerCase() });
    return jt(h, ti, u), jt(h, ur, g), h;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](t) {
    return t && typeof t == "object" && typeof t.constructor == "function" && (typeof t.stream == "function" || typeof t.arrayBuffer == "function") && /^(Blob|File)$/.test(t[Symbol.toStringTag]);
  }
}, ur = new WeakMap(), co = new WeakMap(), ti = new WeakMap(), rs = new WeakMap(), cn);
Object.defineProperties(Id.prototype, {
  size: { enumerable: !0 },
  type: { enumerable: !0 },
  slice: { enumerable: !0 }
});
const Ma = Id;
var fo, ho, Sd;
const ng = (Sd = class extends Ma {
  /**
   * @param {*[]} fileBits
   * @param {string} fileName
   * @param {{lastModified?: number, type?: string}} options
   */
  // @ts-ignore
  constructor(r, n, i = {}) {
    if (arguments.length < 2)
      throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
    super(r, i);
    Rr(this, fo, 0);
    Rr(this, ho, "");
    i === null && (i = {});
    const a = i.lastModified === void 0 ? Date.now() : Number(i.lastModified);
    Number.isNaN(a) || jt(this, fo, a), jt(this, ho, String(n));
  }
  get name() {
    return ke(this, ho);
  }
  get lastModified() {
    return ke(this, fo);
  }
  get [Symbol.toStringTag]() {
    return "File";
  }
  static [Symbol.hasInstance](r) {
    return !!r && r instanceof Ma && /^(File)$/.test(r[Symbol.toStringTag]);
  }
}, fo = new WeakMap(), ho = new WeakMap(), Sd), ig = ng;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: qi, iterator: og, hasInstance: ag } = Symbol, Sc = Math.random, sg = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), vc = (e, t, r) => (e += "", /^(Blob|File)$/.test(t && t[qi]) ? [(r = r !== void 0 ? r + "" : t[qi] == "File" ? t.name : "blob", e), t.name !== r || t[qi] == "blob" ? new ig([t], r, t) : t] : [e, t + ""]), nl = (e, t) => (t ? e : e.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), en = (e, t, r) => {
  if (t.length < r)
    throw new TypeError(`Failed to execute '${e}' on 'FormData': ${r} arguments required, but only ${t.length} present.`);
}, _t, vd;
const xl = (vd = class {
  constructor(...t) {
    Rr(this, _t, []);
    if (t.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [qi]() {
    return "FormData";
  }
  [og]() {
    return this.entries();
  }
  static [ag](t) {
    return t && typeof t == "object" && t[qi] === "FormData" && !sg.some((r) => typeof t[r] != "function");
  }
  append(...t) {
    en("append", arguments, 2), ke(this, _t).push(vc(...t));
  }
  delete(t) {
    en("delete", arguments, 1), t += "", jt(this, _t, ke(this, _t).filter(([r]) => r !== t));
  }
  get(t) {
    en("get", arguments, 1), t += "";
    for (var r = ke(this, _t), n = r.length, i = 0; i < n; i++) if (r[i][0] === t) return r[i][1];
    return null;
  }
  getAll(t, r) {
    return en("getAll", arguments, 1), r = [], t += "", ke(this, _t).forEach((n) => n[0] === t && r.push(n[1])), r;
  }
  has(t) {
    return en("has", arguments, 1), t += "", ke(this, _t).some((r) => r[0] === t);
  }
  forEach(t, r) {
    en("forEach", arguments, 1);
    for (var [n, i] of this) t.call(r, i, n, this);
  }
  set(...t) {
    en("set", arguments, 2);
    var r = [], n = !0;
    t = vc(...t), ke(this, _t).forEach((i) => {
      i[0] === t[0] ? n && (n = !r.push(t)) : r.push(i);
    }), n && r.push(t), jt(this, _t, r);
  }
  *entries() {
    yield* ke(this, _t);
  }
  *keys() {
    for (var [t] of this) yield t;
  }
  *values() {
    for (var [, t] of this) yield t;
  }
}, _t = new WeakMap(), vd);
function lg(e, t = Ma) {
  var r = `${Sc()}${Sc()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), n = [], i = `--${r}\r
Content-Disposition: form-data; name="`;
  return e.forEach((a, s) => typeof a == "string" ? n.push(i + nl(s) + `"\r
\r
${a.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : n.push(i + nl(s) + `"; filename="${nl(a.name, 1)}"\r
Content-Type: ${a.type || "application/octet-stream"}\r
\r
`, a, `\r
`)), n.push(`--${r}--`), new t(n, { type: "multipart/form-data; boundary=" + r });
}
class as extends Error {
  constructor(t, r) {
    super(t), Error.captureStackTrace(this, this.constructor), this.type = r;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
class Ht extends as {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(t, r, n) {
    super(t, r), n && (this.code = this.errno = n.code, this.erroredSysCall = n.syscall);
  }
}
const qa = Symbol.toStringTag, $d = (e) => typeof e == "object" && typeof e.append == "function" && typeof e.delete == "function" && typeof e.get == "function" && typeof e.getAll == "function" && typeof e.has == "function" && typeof e.set == "function" && typeof e.sort == "function" && e[qa] === "URLSearchParams", ja = (e) => e && typeof e == "object" && typeof e.arrayBuffer == "function" && typeof e.type == "string" && typeof e.stream == "function" && typeof e.constructor == "function" && /^(Blob|File)$/.test(e[qa]), ug = (e) => typeof e == "object" && (e[qa] === "AbortSignal" || e[qa] === "EventTarget"), cg = (e, t) => {
  const r = new URL(t).hostname, n = new URL(e).hostname;
  return r === n || r.endsWith(`.${n}`);
}, fg = (e, t) => {
  const r = new URL(t).protocol, n = new URL(e).protocol;
  return r === n;
}, dg = Vm(zt.pipeline), st = Symbol("Body internals");
class Vi {
  constructor(t, {
    size: r = 0
  } = {}) {
    let n = null;
    t === null ? t = null : $d(t) ? t = He.from(t.toString()) : ja(t) || He.isBuffer(t) || (Ba.isAnyArrayBuffer(t) ? t = He.from(t) : ArrayBuffer.isView(t) ? t = He.from(t.buffer, t.byteOffset, t.byteLength) : t instanceof zt || (t instanceof xl ? (t = lg(t), n = t.type.split("=")[1]) : t = He.from(String(t))));
    let i = t;
    He.isBuffer(t) ? i = zt.Readable.from(t) : ja(t) && (i = zt.Readable.from(t.stream())), this[st] = {
      body: t,
      stream: i,
      boundary: n,
      disturbed: !1,
      error: null
    }, this.size = r, t instanceof zt && t.on("error", (a) => {
      const s = a instanceof as ? a : new Ht(`Invalid response body while trying to fetch ${this.url}: ${a.message}`, "system", a);
      this[st].error = s;
    });
  }
  get body() {
    return this[st].stream;
  }
  get bodyUsed() {
    return this[st].disturbed;
  }
  /**
   * Decode response as ArrayBuffer
   *
   * @return  Promise
   */
  async arrayBuffer() {
    const { buffer: t, byteOffset: r, byteLength: n } = await il(this);
    return t.slice(r, r + n);
  }
  async formData() {
    const t = this.headers.get("content-type");
    if (t.startsWith("application/x-www-form-urlencoded")) {
      const n = new xl(), i = new URLSearchParams(await this.text());
      for (const [a, s] of i)
        n.append(a, s);
      return n;
    }
    const { toFormData: r } = await import("./multipart-parser-BXR1iJqj.js");
    return r(this.body, t);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const t = this.headers && this.headers.get("content-type") || this[st].body && this[st].body.type || "", r = await this.arrayBuffer();
    return new Ma([r], {
      type: t
    });
  }
  /**
   * Decode response as json
   *
   * @return  Promise
   */
  async json() {
    const t = await this.text();
    return JSON.parse(t);
  }
  /**
   * Decode response as text
   *
   * @return  Promise
   */
  async text() {
    const t = await il(this);
    return new TextDecoder().decode(t);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return il(this);
  }
}
Vi.prototype.buffer = ns(Vi.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Vi.prototype, {
  body: { enumerable: !0 },
  bodyUsed: { enumerable: !0 },
  arrayBuffer: { enumerable: !0 },
  blob: { enumerable: !0 },
  json: { enumerable: !0 },
  text: { enumerable: !0 },
  data: { get: ns(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function il(e) {
  if (e[st].disturbed)
    throw new TypeError(`body used already for: ${e.url}`);
  if (e[st].disturbed = !0, e[st].error)
    throw e[st].error;
  const { body: t } = e;
  if (t === null)
    return He.alloc(0);
  if (!(t instanceof zt))
    return He.alloc(0);
  const r = [];
  let n = 0;
  try {
    for await (const i of t) {
      if (e.size > 0 && n + i.length > e.size) {
        const a = new Ht(`content size at ${e.url} over limit: ${e.size}`, "max-size");
        throw t.destroy(a), a;
      }
      n += i.length, r.push(i);
    }
  } catch (i) {
    throw i instanceof as ? i : new Ht(`Invalid response body while trying to fetch ${e.url}: ${i.message}`, "system", i);
  }
  if (t.readableEnded === !0 || t._readableState.ended === !0)
    try {
      return r.every((i) => typeof i == "string") ? He.from(r.join("")) : He.concat(r, n);
    } catch (i) {
      throw new Ht(`Could not create Buffer from response body for ${e.url}: ${i.message}`, "system", i);
    }
  else
    throw new Ht(`Premature close of server response while trying to fetch ${e.url}`);
}
const su = (e, t) => {
  let r, n, { body: i } = e[st];
  if (e.bodyUsed)
    throw new Error("cannot clone body after it is used");
  return i instanceof zt && typeof i.getBoundary != "function" && (r = new Ua({ highWaterMark: t }), n = new Ua({ highWaterMark: t }), i.pipe(r), i.pipe(n), e[st].stream = r, i = n), i;
}, hg = ns(
  (e) => e.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
), Od = (e, t) => e === null ? null : typeof e == "string" ? "text/plain;charset=UTF-8" : $d(e) ? "application/x-www-form-urlencoded;charset=UTF-8" : ja(e) ? e.type || null : He.isBuffer(e) || Ba.isAnyArrayBuffer(e) || ArrayBuffer.isView(e) ? null : e instanceof xl ? `multipart/form-data; boundary=${t[st].boundary}` : e && typeof e.getBoundary == "function" ? `multipart/form-data;boundary=${hg(e)}` : e instanceof zt ? null : "text/plain;charset=UTF-8", pg = (e) => {
  const { body: t } = e[st];
  return t === null ? 0 : ja(t) ? t.size : He.isBuffer(t) ? t.length : t && typeof t.getLengthSync == "function" && t.hasKnownLength && t.hasKnownLength() ? t.getLengthSync() : null;
}, mg = async (e, { body: t }) => {
  t === null ? e.end() : await dg(t, e);
}, Da = typeof Gi.validateHeaderName == "function" ? Gi.validateHeaderName : (e) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(e)) {
    const t = new TypeError(`Header name must be a valid HTTP token [${e}]`);
    throw Object.defineProperty(t, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), t;
  }
}, Ul = typeof Gi.validateHeaderValue == "function" ? Gi.validateHeaderValue : (e, t) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(t)) {
    const r = new TypeError(`Invalid character in header content ["${e}"]`);
    throw Object.defineProperty(r, "code", { value: "ERR_INVALID_CHAR" }), r;
  }
};
class cr extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(t) {
    let r = [];
    if (t instanceof cr) {
      const n = t.raw();
      for (const [i, a] of Object.entries(n))
        r.push(...a.map((s) => [i, s]));
    } else if (t != null) if (typeof t == "object" && !Ba.isBoxedPrimitive(t)) {
      const n = t[Symbol.iterator];
      if (n == null)
        r.push(...Object.entries(t));
      else {
        if (typeof n != "function")
          throw new TypeError("Header pairs must be iterable");
        r = [...t].map((i) => {
          if (typeof i != "object" || Ba.isBoxedPrimitive(i))
            throw new TypeError("Each header pair must be an iterable object");
          return [...i];
        }).map((i) => {
          if (i.length !== 2)
            throw new TypeError("Each header pair must be a name/value tuple");
          return [...i];
        });
      }
    } else
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    return r = r.length > 0 ? r.map(([n, i]) => (Da(n), Ul(n, String(i)), [String(n).toLowerCase(), String(i)])) : void 0, super(r), new Proxy(this, {
      get(n, i, a) {
        switch (i) {
          case "append":
          case "set":
            return (s, u) => (Da(s), Ul(s, String(u)), URLSearchParams.prototype[i].call(
              n,
              String(s).toLowerCase(),
              String(u)
            ));
          case "delete":
          case "has":
          case "getAll":
            return (s) => (Da(s), URLSearchParams.prototype[i].call(
              n,
              String(s).toLowerCase()
            ));
          case "keys":
            return () => (n.sort(), new Set(URLSearchParams.prototype.keys.call(n)).keys());
          default:
            return Reflect.get(n, i, a);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(t) {
    const r = this.getAll(t);
    if (r.length === 0)
      return null;
    let n = r.join(", ");
    return /^content-encoding$/i.test(t) && (n = n.toLowerCase()), n;
  }
  forEach(t, r = void 0) {
    for (const n of this.keys())
      Reflect.apply(t, r, [this.get(n), n, this]);
  }
  *values() {
    for (const t of this.keys())
      yield this.get(t);
  }
  /**
   * @type {() => IterableIterator<[string, string]>}
   */
  *entries() {
    for (const t of this.keys())
      yield [t, this.get(t)];
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Node-fetch non-spec method
   * returning all headers and their values as array
   * @returns {Record<string, string[]>}
   */
  raw() {
    return [...this.keys()].reduce((t, r) => (t[r] = this.getAll(r), t), {});
  }
  /**
   * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((t, r) => {
      const n = this.getAll(r);
      return r === "host" ? t[r] = n[0] : t[r] = n.length > 1 ? n : n[0], t;
    }, {});
  }
}
Object.defineProperties(
  cr.prototype,
  ["get", "entries", "forEach", "values"].reduce((e, t) => (e[t] = { enumerable: !0 }, e), {})
);
function gg(e = []) {
  return new cr(
    e.reduce((t, r, n, i) => (n % 2 === 0 && t.push(i.slice(n, n + 2)), t), []).filter(([t, r]) => {
      try {
        return Da(t), Ul(t, String(r)), !0;
      } catch {
        return !1;
      }
    })
  );
}
const yg = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Dd = (e) => yg.has(e), At = Symbol("Response internals");
class pt extends Vi {
  constructor(t = null, r = {}) {
    super(t, r);
    const n = r.status != null ? r.status : 200, i = new cr(r.headers);
    if (t !== null && !i.has("Content-Type")) {
      const a = Od(t, this);
      a && i.append("Content-Type", a);
    }
    this[At] = {
      type: "default",
      url: r.url,
      status: n,
      statusText: r.statusText || "",
      headers: i,
      counter: r.counter,
      highWaterMark: r.highWaterMark
    };
  }
  get type() {
    return this[At].type;
  }
  get url() {
    return this[At].url || "";
  }
  get status() {
    return this[At].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[At].status >= 200 && this[At].status < 300;
  }
  get redirected() {
    return this[At].counter > 0;
  }
  get statusText() {
    return this[At].statusText;
  }
  get headers() {
    return this[At].headers;
  }
  get highWaterMark() {
    return this[At].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new pt(su(this, this.highWaterMark), {
      type: this.type,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size,
      highWaterMark: this.highWaterMark
    });
  }
  /**
   * @param {string} url    The URL that the new response is to originate from.
   * @param {number} status An optional status code for the response (e.g., 302.)
   * @returns {Response}    A Response object.
   */
  static redirect(t, r = 302) {
    if (!Dd(r))
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    return new pt(null, {
      headers: {
        location: new URL(t).toString()
      },
      status: r
    });
  }
  static error() {
    const t = new pt(null, { status: 0, statusText: "" });
    return t[At].type = "error", t;
  }
  static json(t = void 0, r = {}) {
    const n = JSON.stringify(t);
    if (n === void 0)
      throw new TypeError("data is not JSON serializable");
    const i = new cr(r && r.headers);
    return i.has("content-type") || i.set("content-type", "application/json"), new pt(n, {
      ...r,
      headers: i
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(pt.prototype, {
  type: { enumerable: !0 },
  url: { enumerable: !0 },
  status: { enumerable: !0 },
  ok: { enumerable: !0 },
  redirected: { enumerable: !0 },
  statusText: { enumerable: !0 },
  headers: { enumerable: !0 },
  clone: { enumerable: !0 }
});
const bg = (e) => {
  if (e.search)
    return e.search;
  const t = e.href.length - 1, r = e.hash || (e.href[t] === "#" ? "#" : "");
  return e.href[t - r.length] === "?" ? "?" : "";
};
function Cc(e, t = !1) {
  return e == null || (e = new URL(e), /^(about|blob|data):$/.test(e.protocol)) ? "no-referrer" : (e.username = "", e.password = "", e.hash = "", t && (e.pathname = "", e.search = ""), e);
}
const Nd = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]), wg = "strict-origin-when-cross-origin";
function _g(e) {
  if (!Nd.has(e))
    throw new TypeError(`Invalid referrerPolicy: ${e}`);
  return e;
}
function Eg(e) {
  if (/^(http|ws)s:$/.test(e.protocol))
    return !0;
  const t = e.host.replace(/(^\[)|(]$)/g, ""), r = Xm(t);
  return r === 4 && /^127\./.test(t) || r === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(t) ? !0 : e.host === "localhost" || e.host.endsWith(".localhost") ? !1 : e.protocol === "file:";
}
function Bn(e) {
  return /^about:(blank|srcdoc)$/.test(e) || e.protocol === "data:" || /^(blob|filesystem):$/.test(e.protocol) ? !0 : Eg(e);
}
function Sg(e, { referrerURLCallback: t, referrerOriginCallback: r } = {}) {
  if (e.referrer === "no-referrer" || e.referrerPolicy === "")
    return null;
  const n = e.referrerPolicy;
  if (e.referrer === "about:client")
    return "no-referrer";
  const i = e.referrer;
  let a = Cc(i), s = Cc(i, !0);
  a.toString().length > 4096 && (a = s), t && (a = t(a)), r && (s = r(s));
  const u = new URL(e.url);
  switch (n) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return s;
    case "unsafe-url":
      return a;
    case "strict-origin":
      return Bn(a) && !Bn(u) ? "no-referrer" : s.toString();
    case "strict-origin-when-cross-origin":
      return a.origin === u.origin ? a : Bn(a) && !Bn(u) ? "no-referrer" : s;
    case "same-origin":
      return a.origin === u.origin ? a : "no-referrer";
    case "origin-when-cross-origin":
      return a.origin === u.origin ? a : s;
    case "no-referrer-when-downgrade":
      return Bn(a) && !Bn(u) ? "no-referrer" : a;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${n}`);
  }
}
function vg(e) {
  const t = (e.get("referrer-policy") || "").split(/[,\s]+/);
  let r = "";
  for (const n of t)
    n && Nd.has(n) && (r = n);
  return r;
}
const Le = Symbol("Request internals"), Oi = (e) => typeof e == "object" && typeof e[Le] == "object", Cg = ns(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
class Yi extends Vi {
  constructor(t, r = {}) {
    let n;
    if (Oi(t) ? n = new URL(t.url) : (n = new URL(t), t = {}), n.username !== "" || n.password !== "")
      throw new TypeError(`${n} is an url with embedded credentials.`);
    let i = r.method || t.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(i) && (i = i.toUpperCase()), !Oi(r) && "data" in r && Cg(), (r.body != null || Oi(t) && t.body !== null) && (i === "GET" || i === "HEAD"))
      throw new TypeError("Request with GET/HEAD method cannot have body");
    const a = r.body ? r.body : Oi(t) && t.body !== null ? su(t) : null;
    super(a, {
      size: r.size || t.size || 0
    });
    const s = new cr(r.headers || t.headers || {});
    if (a !== null && !s.has("Content-Type")) {
      const g = Od(a, this);
      g && s.set("Content-Type", g);
    }
    let u = Oi(t) ? t.signal : null;
    if ("signal" in r && (u = r.signal), u != null && !ug(u))
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    let c = r.referrer == null ? t.referrer : r.referrer;
    if (c === "")
      c = "no-referrer";
    else if (c) {
      const g = new URL(c);
      c = /^about:(\/\/)?client$/.test(g) ? "client" : g;
    } else
      c = void 0;
    this[Le] = {
      method: i,
      redirect: r.redirect || t.redirect || "follow",
      headers: s,
      parsedURL: n,
      signal: u,
      referrer: c
    }, this.follow = r.follow === void 0 ? t.follow === void 0 ? 20 : t.follow : r.follow, this.compress = r.compress === void 0 ? t.compress === void 0 ? !0 : t.compress : r.compress, this.counter = r.counter || t.counter || 0, this.agent = r.agent || t.agent, this.highWaterMark = r.highWaterMark || t.highWaterMark || 16384, this.insecureHTTPParser = r.insecureHTTPParser || t.insecureHTTPParser || !1, this.referrerPolicy = r.referrerPolicy || t.referrerPolicy || "";
  }
  /** @returns {string} */
  get method() {
    return this[Le].method;
  }
  /** @returns {string} */
  get url() {
    return Ym(this[Le].parsedURL);
  }
  /** @returns {Headers} */
  get headers() {
    return this[Le].headers;
  }
  get redirect() {
    return this[Le].redirect;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return this[Le].signal;
  }
  // https://fetch.spec.whatwg.org/#dom-request-referrer
  get referrer() {
    if (this[Le].referrer === "no-referrer")
      return "";
    if (this[Le].referrer === "client")
      return "about:client";
    if (this[Le].referrer)
      return this[Le].referrer.toString();
  }
  get referrerPolicy() {
    return this[Le].referrerPolicy;
  }
  set referrerPolicy(t) {
    this[Le].referrerPolicy = _g(t);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new Yi(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(Yi.prototype, {
  method: { enumerable: !0 },
  url: { enumerable: !0 },
  headers: { enumerable: !0 },
  redirect: { enumerable: !0 },
  clone: { enumerable: !0 },
  signal: { enumerable: !0 },
  referrer: { enumerable: !0 },
  referrerPolicy: { enumerable: !0 }
});
const Rg = (e) => {
  const { parsedURL: t } = e[Le], r = new cr(e[Le].headers);
  r.has("Accept") || r.set("Accept", "*/*");
  let n = null;
  if (e.body === null && /^(post|put)$/i.test(e.method) && (n = "0"), e.body !== null) {
    const u = pg(e);
    typeof u == "number" && !Number.isNaN(u) && (n = String(u));
  }
  n && r.set("Content-Length", n), e.referrerPolicy === "" && (e.referrerPolicy = wg), e.referrer && e.referrer !== "no-referrer" ? e[Le].referrer = Sg(e) : e[Le].referrer = "no-referrer", e[Le].referrer instanceof URL && r.set("Referer", e.referrer), r.has("User-Agent") || r.set("User-Agent", "node-fetch"), e.compress && !r.has("Accept-Encoding") && r.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: i } = e;
  typeof i == "function" && (i = i(t));
  const a = bg(t), s = {
    // Overwrite search to retain trailing ? (issue #776)
    path: t.pathname + a,
    // The following options are not expressed in the URL
    method: e.method,
    headers: r[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: e.insecureHTTPParser,
    agent: i
  };
  return {
    /** @type {URL} */
    parsedURL: t,
    options: s
  };
};
class Tg extends as {
  constructor(t, r = "aborted") {
    super(t, r);
  }
}
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
if (!globalThis.DOMException)
  try {
    const { MessageChannel: e } = require("worker_threads"), t = new e().port1, r = new ArrayBuffer();
    t.postMessage(r, [r, r]);
  } catch (e) {
    e.constructor.name === "DOMException" && (globalThis.DOMException = e.constructor);
  }
const { stat: HT } = iu, Ag = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function lr(e, t) {
  return new Promise((r, n) => {
    const i = new Yi(e, t), { parsedURL: a, options: s } = Rg(i);
    if (!Ag.has(a.protocol))
      throw new TypeError(`node-fetch cannot load ${e}. URL scheme "${a.protocol.replace(/:$/, "")}" is not supported.`);
    if (a.protocol === "data:") {
      const E = eg(i.url), C = new pt(E, { headers: { "Content-Type": E.typeFull } });
      r(C);
      return;
    }
    const u = (a.protocol === "https:" ? Gm : Gi).request, { signal: c } = i;
    let g = null;
    const f = () => {
      const E = new Tg("The operation was aborted.");
      n(E), i.body && i.body instanceof zt.Readable && i.body.destroy(E), !(!g || !g.body) && g.body.emit("error", E);
    };
    if (c && c.aborted) {
      f();
      return;
    }
    const h = () => {
      f(), b();
    }, m = u(a.toString(), s);
    c && c.addEventListener("abort", h);
    const b = () => {
      m.abort(), c && c.removeEventListener("abort", h);
    };
    m.on("error", (E) => {
      n(new Ht(`request to ${i.url} failed, reason: ${E.message}`, "system", E)), b();
    }), Pg(m, (E) => {
      g && g.body && g.body.destroy(E);
    }), process.version < "v14" && m.on("socket", (E) => {
      let C;
      E.prependListener("end", () => {
        C = E._eventsCount;
      }), E.prependListener("close", (A) => {
        if (g && C < E._eventsCount && !A) {
          const I = new Error("Premature close");
          I.code = "ERR_STREAM_PREMATURE_CLOSE", g.body.emit("error", I);
        }
      });
    }), m.on("response", (E) => {
      m.setTimeout(0);
      const C = gg(E.rawHeaders);
      if (Dd(E.statusCode)) {
        const x = C.get("Location");
        let te = null;
        try {
          te = x === null ? null : new URL(x, i.url);
        } catch {
          if (i.redirect !== "manual") {
            n(new Ht(`uri requested responds with an invalid redirect URL: ${x}`, "invalid-redirect")), b();
            return;
          }
        }
        switch (i.redirect) {
          case "error":
            n(new Ht(`uri requested responds with a redirect, redirect mode is set to error: ${i.url}`, "no-redirect")), b();
            return;
          case "manual":
            break;
          case "follow": {
            if (te === null)
              break;
            if (i.counter >= i.follow) {
              n(new Ht(`maximum redirect reached at: ${i.url}`, "max-redirect")), b();
              return;
            }
            const ae = {
              headers: new cr(i.headers),
              follow: i.follow,
              counter: i.counter + 1,
              agent: i.agent,
              compress: i.compress,
              method: i.method,
              body: su(i),
              signal: i.signal,
              size: i.size,
              referrer: i.referrer,
              referrerPolicy: i.referrerPolicy
            };
            if (!cg(i.url, te) || !fg(i.url, te))
              for (const Ne of ["authorization", "www-authenticate", "cookie", "cookie2"])
                ae.headers.delete(Ne);
            if (E.statusCode !== 303 && i.body && t.body instanceof zt.Readable) {
              n(new Ht("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), b();
              return;
            }
            (E.statusCode === 303 || (E.statusCode === 301 || E.statusCode === 302) && i.method === "POST") && (ae.method = "GET", ae.body = void 0, ae.headers.delete("content-length"));
            const Q = vg(C);
            Q && (ae.referrerPolicy = Q), r(lr(new Yi(te, ae))), b();
            return;
          }
          default:
            return n(new TypeError(`Redirect option '${i.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      c && E.once("end", () => {
        c.removeEventListener("abort", h);
      });
      let A = Un(E, new Ua(), (x) => {
        x && n(x);
      });
      process.version < "v12.10" && E.on("aborted", h);
      const I = {
        url: i.url,
        status: E.statusCode,
        statusText: E.statusMessage,
        headers: C,
        size: i.size,
        counter: i.counter,
        highWaterMark: i.highWaterMark
      }, $ = C.get("Content-Encoding");
      if (!i.compress || i.method === "HEAD" || $ === null || E.statusCode === 204 || E.statusCode === 304) {
        g = new pt(A, I), r(g);
        return;
      }
      const M = {
        flush: xn.Z_SYNC_FLUSH,
        finishFlush: xn.Z_SYNC_FLUSH
      };
      if ($ === "gzip" || $ === "x-gzip") {
        A = Un(A, xn.createGunzip(M), (x) => {
          x && n(x);
        }), g = new pt(A, I), r(g);
        return;
      }
      if ($ === "deflate" || $ === "x-deflate") {
        const x = Un(E, new Ua(), (te) => {
          te && n(te);
        });
        x.once("data", (te) => {
          (te[0] & 15) === 8 ? A = Un(A, xn.createInflate(), (ae) => {
            ae && n(ae);
          }) : A = Un(A, xn.createInflateRaw(), (ae) => {
            ae && n(ae);
          }), g = new pt(A, I), r(g);
        }), x.once("end", () => {
          g || (g = new pt(A, I), r(g));
        });
        return;
      }
      if ($ === "br") {
        A = Un(A, xn.createBrotliDecompress(), (x) => {
          x && n(x);
        }), g = new pt(A, I), r(g);
        return;
      }
      g = new pt(A, I), r(g);
    }), mg(m, i).catch(n);
  });
}
function Pg(e, t) {
  const r = He.from(`0\r
\r
`);
  let n = !1, i = !1, a;
  e.on("response", (s) => {
    const { headers: u } = s;
    n = u["transfer-encoding"] === "chunked" && !u["content-length"];
  }), e.on("socket", (s) => {
    const u = () => {
      if (n && !i) {
        const g = new Error("Premature close");
        g.code = "ERR_STREAM_PREMATURE_CLOSE", t(g);
      }
    }, c = (g) => {
      i = He.compare(g.slice(-5), r) === 0, !i && a && (i = He.compare(a.slice(-3), r.slice(0, 3)) === 0 && He.compare(g.slice(-2), r.slice(3)) === 0), a = g;
    };
    s.prependListener("close", u), s.on("data", c), e.on("close", () => {
      s.removeListener("close", u), s.removeListener("data", c);
    });
  });
}
class Ig extends ou {
  constructor() {
    super(...arguments);
    Re(this, "creds", null);
    Re(this, "timer", null);
    Re(this, "phase", "Unknown");
  }
  setCreds(r) {
    this.creds = r, this.timer || this.start();
  }
  stop() {
    this.timer && clearInterval(this.timer), this.timer = null, this.phase = "Unknown", this.emit("phase", this.phase);
  }
  async poll() {
    if (!this.creds) return;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-gameflow/v1/gameflow-phase`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      const u = (await lr(a, { headers: { Authorization: `Basic ${s}` } }).then(
        (c) => c.text()
      )).replace(/"/g, "");
      u !== this.phase && (this.phase = u, this.emit("phase", u));
    } catch {
      this.phase !== "Unknown" && (this.phase = "Unknown", this.emit("phase", "Unknown"));
    }
  }
  start(r = 2e3) {
    this.timer || (this.poll(), this.timer = setInterval(() => this.poll(), r));
  }
  on(r, n) {
    return super.on(r, n);
  }
  emit(r, n) {
    return super.emit(r, n);
  }
}
const Bl = /* @__PURE__ */ new Map();
async function $g() {
  if (Bl.size) return;
  (await lr("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json").then((r) => r.json())).forEach((r) => Bl.set(r.id, r.alias));
}
function Og(e) {
  return Bl.get(e) ?? "";
}
class Dg extends ou {
  constructor() {
    super(...arguments);
    Re(this, "creds", null);
    Re(this, "summonerId", null);
    Re(this, "poller", null);
    Re(this, "manualPoller", null);
    Re(this, "currentChampion", 0);
    Re(this, "lastAppliedChampion", 0);
    Re(this, "includeDefaultSkin", !0);
    Re(this, "selectedSkinId", 0);
    Re(this, "selectedChromaId", 0);
    Re(this, "profileIconId", 0);
    Re(this, "autoRollEnabled", !0);
    Re(this, "skins", []);
  }
  setCreds(r) {
    this.stop(), this.creds = r, this.summonerId = null, this.lastAppliedChampion = 0;
  }
  start() {
    !this.creds || this.poller || (this.tick(), this.poller = setInterval(() => this.tick(), 1500));
  }
  stop() {
    this.poller && clearInterval(this.poller), this.manualPoller && clearInterval(this.manualPoller), this.poller = null, this.manualPoller = null, this.currentChampion = 0, this.lastAppliedChampion = 0, this.skins.length && (this.skins = [], this.emit("skins", []));
  }
  // Quand on entre en ChampSelect, active un poll rapide sur la sélection
  enableManualFastPoll() {
    this.manualPoller || (this.manualPoller = setInterval(() => this.updateManualSelection(), 500));
  }
  disableManualFastPoll() {
    this.manualPoller && clearInterval(this.manualPoller), this.manualPoller = null;
  }
  getIncludeDefault() {
    return this.includeDefaultSkin;
  }
  toggleIncludeDefault() {
    this.includeDefaultSkin = !this.includeDefaultSkin, this.autoRollEnabled && this.currentChampion && this.rerollSkin();
  }
  getSelection() {
    return {
      championId: this.currentChampion,
      championAlias: Og(this.currentChampion),
      skinId: this.selectedSkinId,
      chromaId: this.selectedChromaId
    };
  }
  getAutoRoll() {
    return this.autoRollEnabled;
  }
  toggleAutoRoll() {
    this.autoRollEnabled = !this.autoRollEnabled, this.autoRollEnabled && this.currentChampion && this.rerollSkin();
  }
  getProfileIcon() {
    return this.profileIconId;
  }
  async rerollSkin() {
    if (!this.skins.length) return;
    const r = this.includeDefaultSkin ? this.skins : this.skins.filter((a) => a.id % 1e3 !== 0) || this.skins, n = r[Math.floor(Math.random() * r.length)], i = n.chromas.length ? n.chromas[Math.floor(Math.random() * n.chromas.length)].id : n.id;
    await this.applySkin(i), this.selectedSkinId = n.id, this.selectedChromaId = i !== n.id ? i : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
  }
  async rerollChroma() {
    const r = this.skins.find((i) => i.id === this.selectedSkinId);
    if (!r || r.chromas.length === 0) return;
    let n = r.chromas[Math.floor(Math.random() * r.chromas.length)];
    if (r.chromas.length > 1)
      for (; n.id === this.selectedChromaId; )
        n = r.chromas[Math.floor(Math.random() * r.chromas.length)];
    await this.applySkin(n.id), this.selectedChromaId = n.id, this.emit("selection", this.getSelection());
  }
  /* ---------- boucle principale ---------- */
  async tick() {
    if (!this.creds) return;
    this.summonerId === null && await this.fetchSummonerId();
    const r = await this.fetchCurrentChampion();
    r ? this.enableManualFastPoll() : this.disableManualFastPoll(), r && r !== this.currentChampion && (this.currentChampion = r, await this.refreshSkinsAndMaybeApply()), await this.updateManualSelection();
  }
  async fetchSummonerId() {
    if (!this.creds) return;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-summoner/v1/current-summoner`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      const u = await lr(a, {
        headers: { Authorization: `Basic ${s}` }
      }).then((c) => c.json());
      this.summonerId = u.summonerId ?? u.accountId ?? u.id ?? null, this.profileIconId = u.profileIconId ?? 0, this.emit("icon", this.profileIconId);
    } catch {
      this.summonerId = null;
    }
  }
  async fetchCurrentChampion() {
    if (!this.creds) return 0;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-champ-select/v1/current-champion`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      return Number(
        await lr(a, {
          headers: { Authorization: `Basic ${s}` }
        }).then((u) => u.text())
      ) || 0;
    } catch {
      return 0;
    }
  }
  emitSkinsIfChanged(r) {
    r.length === this.skins.length && r.every(
      (n, i) => {
        var a, s;
        return n.id === ((a = this.skins[i]) == null ? void 0 : a.id) && n.chromas.length === ((s = this.skins[i]) == null ? void 0 : s.chromas.length);
      }
    ) || (this.skins = r, this.emit("skins", r));
  }
  async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    await $g();
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}`, s = {
      Authorization: `Basic ${Buffer.from(`riot:${i}`).toString(
        "base64"
      )}`
    }, u = await lr(
      `${a}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
      { headers: s }
    ).then((g) => g.json()), c = [];
    for (const g of u.filter(
      (f) => {
        var h;
        return ((h = f.ownership) == null ? void 0 : h.owned) || f.isOwned || f.owned;
      }
    )) {
      let f = [];
      try {
        f = (await lr(
          `${a}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins/${g.id}/chromas`,
          { headers: s }
        ).then((m) => m.status === 404 ? [] : m.json())).filter((m) => {
          var b;
          return ((b = m.ownership) == null ? void 0 : b.owned) || m.isOwned || m.owned;
        }).map((m) => ({ id: m.id, name: m.name || `Chroma ${m.id}` }));
      } catch {
      }
      c.push({ id: g.id, name: g.name, chromas: f });
    }
    if (this.skins = c, this.emitSkinsIfChanged(c), this.autoRollEnabled && this.currentChampion !== this.lastAppliedChampion && c.length) {
      const g = this.includeDefaultSkin ? c : c.filter((m) => m.id % 1e3 !== 0) || c, f = g[Math.floor(Math.random() * g.length)], h = f.chromas.length ? f.chromas[Math.floor(Math.random() * f.chromas.length)].id : f.id;
      await this.applySkin(h), this.selectedSkinId = f.id, this.selectedChromaId = h !== f.id ? h : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
    }
  }
  async applySkin(r) {
    if (!this.creds) return;
    const { protocol: n, port: i, password: a } = this.creds, s = `${n}://127.0.0.1:${i}/lol-champ-select/v1/session/my-selection`, u = Buffer.from(`riot:${a}`).toString("base64");
    try {
      await lr(s, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${u}`
        },
        body: JSON.stringify({ selectedSkinId: r })
      }), this.updateManualSelection();
    } catch {
    }
  }
  async updateManualSelection() {
    if (!this.creds || !this.currentChampion) return;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-champ-select/v1/session/my-selection`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      const c = (await lr(a, {
        headers: { Authorization: `Basic ${s}` }
      }).then((m) => m.json())).selectedSkinId ?? 0;
      if (!c || c === this.selectedChromaId || c === this.selectedSkinId)
        return;
      let g = c, f = 0;
      const h = this.skins.find((m) => m.id === c);
      if (h)
        g = h.id;
      else
        for (const m of this.skins) {
          const b = m.chromas.find((E) => E.id === c);
          if (b) {
            g = m.id, f = b.id;
            break;
          }
        }
      this.selectedSkinId = g, this.selectedChromaId = f, this.emit("selection", this.getSelection());
    } catch {
    }
  }
  on(r, n) {
    return super.on(r, n);
  }
  emit(r, ...n) {
    return super.emit(r, ...n);
  }
}
let ar = null;
function sn() {
  return ar;
}
async function Ng() {
  if (ar = new jm({
    width: 900,
    height: 645,
    resizable: !1,
    maximizable: !1,
    fullscreenable: !1,
    show: !1,
    webPreferences: {
      preload: Mi.join(__dirname, "..", "..", "preload", "index.js"),
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !0
    }
  }), process.env.VITE_DEV_SERVER_URL)
    await ar.loadURL(process.env.VITE_DEV_SERVER_URL);
  else {
    const e = Mi.join(process.cwd(), "dist");
    await ar.loadFile(Mi.join(e, "index.html"));
  }
  return ar.once("ready-to-show", () => ar == null ? void 0 : ar.show()), ar;
}
function Fg(e) {
  wt.handle("get-lcu-status", () => e.status);
}
function kg(e, t) {
  wt.handle("get-gameflow-phase", () => e.phase), e.on("phase", (r) => {
    const n = t();
    n == null || n.webContents.send("gameflow-phase", r);
  });
}
function Lg(e, t) {
  wt.handle("get-owned-skins", () => e.skins), wt.handle("get-include-default", () => e.getIncludeDefault()), wt.handle("toggle-include-default", () => e.toggleIncludeDefault()), wt.handle("get-auto-roll", () => e.getAutoRoll()), wt.handle("toggle-auto-roll", () => e.toggleAutoRoll()), wt.handle("reroll-skin", () => e.rerollSkin()), wt.handle("reroll-chroma", () => e.rerollChroma()), wt.handle("get-selection", () => e.getSelection()), wt.handle("get-summoner-icon", () => e.getProfileIcon()), e.on("skins", (r) => {
    var n;
    return (n = t()) == null ? void 0 : n.webContents.send("owned-skins", r);
  }), e.on("selection", (r) => {
    var n;
    return (n = t()) == null ? void 0 : n.webContents.send("selection", r);
  }), e.on("icon", (r) => {
    var n;
    return (n = t()) == null ? void 0 : n.webContents.send("summoner-icon", r);
  });
}
function xg() {
  wt.handle("open-external", (e, t) => Wm.openExternal(t));
}
function Ug(e) {
  Fg(e.lcu), kg(e.gameflow, e.getWin), Lg(e.skins, e.getWin), xg();
}
var Fd = {}, hn = {}, Je = {};
Je.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, a) => i != null ? n(i) : r(a)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Je.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Tr = Km, Bg = process.cwd, Na = null, Mg = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Na || (Na = Bg.call(process)), Na;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Rc = process.chdir;
  process.chdir = function(e) {
    Na = null, Rc.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Rc);
}
var qg = jg;
function jg(e) {
  Tr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = u(e.stat), e.fstat = u(e.fstat), e.lstat = u(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(f, h, m) {
    m && process.nextTick(m);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(f, h, m, b) {
    b && process.nextTick(b);
  }, e.lchownSync = function() {
  }), Mg === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(f) {
    function h(m, b, E) {
      var C = Date.now(), A = 0;
      f(m, b, function I($) {
        if ($ && ($.code === "EACCES" || $.code === "EPERM" || $.code === "EBUSY") && Date.now() - C < 6e4) {
          setTimeout(function() {
            e.stat(b, function(M, x) {
              M && M.code === "ENOENT" ? f(m, b, I) : E($);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        E && E($);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(h, f), h;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(f) {
    function h(m, b, E, C, A, I) {
      var $;
      if (I && typeof I == "function") {
        var M = 0;
        $ = function(x, te, ae) {
          if (x && x.code === "EAGAIN" && M < 10)
            return M++, f.call(e, m, b, E, C, A, $);
          I.apply(this, arguments);
        };
      }
      return f.call(e, m, b, E, C, A, $);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(h, f), h;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(f) {
    return function(h, m, b, E, C) {
      for (var A = 0; ; )
        try {
          return f.call(e, h, m, b, E, C);
        } catch (I) {
          if (I.code === "EAGAIN" && A < 10) {
            A++;
            continue;
          }
          throw I;
        }
    };
  }(e.readSync);
  function t(f) {
    f.lchmod = function(h, m, b) {
      f.open(
        h,
        Tr.O_WRONLY | Tr.O_SYMLINK,
        m,
        function(E, C) {
          if (E) {
            b && b(E);
            return;
          }
          f.fchmod(C, m, function(A) {
            f.close(C, function(I) {
              b && b(A || I);
            });
          });
        }
      );
    }, f.lchmodSync = function(h, m) {
      var b = f.openSync(h, Tr.O_WRONLY | Tr.O_SYMLINK, m), E = !0, C;
      try {
        C = f.fchmodSync(b, m), E = !1;
      } finally {
        if (E)
          try {
            f.closeSync(b);
          } catch {
          }
        else
          f.closeSync(b);
      }
      return C;
    };
  }
  function r(f) {
    Tr.hasOwnProperty("O_SYMLINK") && f.futimes ? (f.lutimes = function(h, m, b, E) {
      f.open(h, Tr.O_SYMLINK, function(C, A) {
        if (C) {
          E && E(C);
          return;
        }
        f.futimes(A, m, b, function(I) {
          f.close(A, function($) {
            E && E(I || $);
          });
        });
      });
    }, f.lutimesSync = function(h, m, b) {
      var E = f.openSync(h, Tr.O_SYMLINK), C, A = !0;
      try {
        C = f.futimesSync(E, m, b), A = !1;
      } finally {
        if (A)
          try {
            f.closeSync(E);
          } catch {
          }
        else
          f.closeSync(E);
      }
      return C;
    }) : f.futimes && (f.lutimes = function(h, m, b, E) {
      E && process.nextTick(E);
    }, f.lutimesSync = function() {
    });
  }
  function n(f) {
    return f && function(h, m, b) {
      return f.call(e, h, m, function(E) {
        g(E) && (E = null), b && b.apply(this, arguments);
      });
    };
  }
  function i(f) {
    return f && function(h, m) {
      try {
        return f.call(e, h, m);
      } catch (b) {
        if (!g(b)) throw b;
      }
    };
  }
  function a(f) {
    return f && function(h, m, b, E) {
      return f.call(e, h, m, b, function(C) {
        g(C) && (C = null), E && E.apply(this, arguments);
      });
    };
  }
  function s(f) {
    return f && function(h, m, b) {
      try {
        return f.call(e, h, m, b);
      } catch (E) {
        if (!g(E)) throw E;
      }
    };
  }
  function u(f) {
    return f && function(h, m, b) {
      typeof m == "function" && (b = m, m = null);
      function E(C, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), b && b.apply(this, arguments);
      }
      return m ? f.call(e, h, m, E) : f.call(e, h, E);
    };
  }
  function c(f) {
    return f && function(h, m) {
      var b = m ? f.call(e, h, m) : f.call(e, h);
      return b && (b.uid < 0 && (b.uid += 4294967296), b.gid < 0 && (b.gid += 4294967296)), b;
    };
  }
  function g(f) {
    if (!f || f.code === "ENOSYS")
      return !0;
    var h = !process.getuid || process.getuid() !== 0;
    return !!(h && (f.code === "EINVAL" || f.code === "EPERM"));
  }
}
var Tc = po.Stream, Wg = Hg;
function Hg(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Tc.call(this);
    var a = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), u = 0, c = s.length; u < c; u++) {
      var g = s[u];
      this[g] = i[g];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        a._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(f, h) {
      if (f) {
        a.emit("error", f), a.readable = !1;
        return;
      }
      a.fd = h, a.emit("open", h), a._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Tc.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var a = Object.keys(i), s = 0, u = a.length; s < u; s++) {
      var c = a[s];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var zg = Vg, Gg = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Vg(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Gg(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var Se = Ur, Yg = qg, Xg = Wg, Qg = zg, ga = au, qe, Wa;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (qe = Symbol.for("graceful-fs.queue"), Wa = Symbol.for("graceful-fs.previous")) : (qe = "___graceful-fs.queue", Wa = "___graceful-fs.previous");
function Kg() {
}
function kd(e, t) {
  Object.defineProperty(e, qe, {
    get: function() {
      return t;
    }
  });
}
var ln = Kg;
ga.debuglog ? ln = ga.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (ln = function() {
  var e = ga.format.apply(ga, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!Se[qe]) {
  var Jg = Ue[qe] || [];
  kd(Se, Jg), Se.close = function(e) {
    function t(r, n) {
      return e.call(Se, r, function(i) {
        i || Ac(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Wa, {
      value: e
    }), t;
  }(Se.close), Se.closeSync = function(e) {
    function t(r) {
      e.apply(Se, arguments), Ac();
    }
    return Object.defineProperty(t, Wa, {
      value: e
    }), t;
  }(Se.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    ln(Se[qe]), Rd.equal(Se[qe].length, 0);
  });
}
Ue[qe] || kd(Ue, Se[qe]);
var Ze = lu(Qg(Se));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !Se.__patched && (Ze = lu(Se), Se.__patched = !0);
function lu(e) {
  Yg(e), e.gracefulify = lu, e.createReadStream = te, e.createWriteStream = ae;
  var t = e.readFile;
  e.readFile = r;
  function r(S, re, Z) {
    return typeof re == "function" && (Z = re, re = null), X(S, re, Z);
    function X(ce, L, D, B) {
      return t(ce, L, function(N) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Mn([X, [ce, L, D], N, B || Date.now(), Date.now()]) : typeof D == "function" && D.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = null), ce(S, re, Z, X);
    function ce(L, D, B, N, q) {
      return n(L, D, B, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Mn([ce, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = s);
  function s(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = null), ce(S, re, Z, X);
    function ce(L, D, B, N, q) {
      return a(L, D, B, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Mn([ce, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  var u = e.copyFile;
  u && (e.copyFile = c);
  function c(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = 0), ce(S, re, Z, X);
    function ce(L, D, B, N, q) {
      return u(L, D, B, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Mn([ce, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  var g = e.readdir;
  e.readdir = h;
  var f = /^v[0-5]\./;
  function h(S, re, Z) {
    typeof re == "function" && (Z = re, re = null);
    var X = f.test(process.version) ? function(D, B, N, q) {
      return g(D, ce(
        D,
        B,
        N,
        q
      ));
    } : function(D, B, N, q) {
      return g(D, B, ce(
        D,
        B,
        N,
        q
      ));
    };
    return X(S, re, Z);
    function ce(L, D, B, N) {
      return function(q, U) {
        q && (q.code === "EMFILE" || q.code === "ENFILE") ? Mn([
          X,
          [L, D, B],
          q,
          N || Date.now(),
          Date.now()
        ]) : (U && U.sort && U.sort(), typeof B == "function" && B.call(this, q, U));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var m = Xg(e);
    I = m.ReadStream, M = m.WriteStream;
  }
  var b = e.ReadStream;
  b && (I.prototype = Object.create(b.prototype), I.prototype.open = $);
  var E = e.WriteStream;
  E && (M.prototype = Object.create(E.prototype), M.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return I;
    },
    set: function(S) {
      I = S;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return M;
    },
    set: function(S) {
      M = S;
    },
    enumerable: !0,
    configurable: !0
  });
  var C = I;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return C;
    },
    set: function(S) {
      C = S;
    },
    enumerable: !0,
    configurable: !0
  });
  var A = M;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return A;
    },
    set: function(S) {
      A = S;
    },
    enumerable: !0,
    configurable: !0
  });
  function I(S, re) {
    return this instanceof I ? (b.apply(this, arguments), this) : I.apply(Object.create(I.prototype), arguments);
  }
  function $() {
    var S = this;
    Ne(S.path, S.flags, S.mode, function(re, Z) {
      re ? (S.autoClose && S.destroy(), S.emit("error", re)) : (S.fd = Z, S.emit("open", Z), S.read());
    });
  }
  function M(S, re) {
    return this instanceof M ? (E.apply(this, arguments), this) : M.apply(Object.create(M.prototype), arguments);
  }
  function x() {
    var S = this;
    Ne(S.path, S.flags, S.mode, function(re, Z) {
      re ? (S.destroy(), S.emit("error", re)) : (S.fd = Z, S.emit("open", Z));
    });
  }
  function te(S, re) {
    return new e.ReadStream(S, re);
  }
  function ae(S, re) {
    return new e.WriteStream(S, re);
  }
  var Q = e.open;
  e.open = Ne;
  function Ne(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = null), ce(S, re, Z, X);
    function ce(L, D, B, N, q) {
      return Q(L, D, B, function(U, V) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Mn([ce, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  return e;
}
function Mn(e) {
  ln("ENQUEUE", e[0].name, e[1]), Se[qe].push(e), uu();
}
var ya;
function Ac() {
  for (var e = Date.now(), t = 0; t < Se[qe].length; ++t)
    Se[qe][t].length > 2 && (Se[qe][t][3] = e, Se[qe][t][4] = e);
  uu();
}
function uu() {
  if (clearTimeout(ya), ya = void 0, Se[qe].length !== 0) {
    var e = Se[qe].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      ln("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      ln("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var u = Date.now() - a, c = Math.max(a - i, 1), g = Math.min(c * 1.2, 100);
      u >= g ? (ln("RETRY", t.name, r), t.apply(null, r.concat([i]))) : Se[qe].push(e);
    }
    ya === void 0 && (ya = setTimeout(uu, 0));
  }
}
(function(e) {
  const t = Je.fromCallback, r = Ze, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, a) {
    return typeof a == "function" ? r.exists(i, a) : new Promise((s) => r.exists(i, s));
  }, e.read = function(i, a, s, u, c, g) {
    return typeof g == "function" ? r.read(i, a, s, u, c, g) : new Promise((f, h) => {
      r.read(i, a, s, u, c, (m, b, E) => {
        if (m) return h(m);
        f({ bytesRead: b, buffer: E });
      });
    });
  }, e.write = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.write(i, a, ...s) : new Promise((u, c) => {
      r.write(i, a, ...s, (g, f, h) => {
        if (g) return c(g);
        u({ bytesWritten: f, buffer: h });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.writev(i, a, ...s) : new Promise((u, c) => {
      r.writev(i, a, ...s, (g, f, h) => {
        if (g) return c(g);
        u({ bytesWritten: f, buffers: h });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(hn);
var cu = {}, Ld = {};
const Zg = ve;
Ld.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Zg.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const xd = hn, { checkPath: Ud } = Ld, Bd = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
cu.makeDir = async (e, t) => (Ud(e), xd.mkdir(e, {
  mode: Bd(t),
  recursive: !0
}));
cu.makeDirSync = (e, t) => (Ud(e), xd.mkdirSync(e, {
  mode: Bd(t),
  recursive: !0
}));
const ey = Je.fromPromise, { makeDir: ty, makeDirSync: ol } = cu, al = ey(ty);
var Vt = {
  mkdirs: al,
  mkdirsSync: ol,
  // alias
  mkdirp: al,
  mkdirpSync: ol,
  ensureDir: al,
  ensureDirSync: ol
};
const ry = Je.fromPromise, Md = hn;
function ny(e) {
  return Md.access(e).then(() => !0).catch(() => !1);
}
var pn = {
  pathExists: ry(ny),
  pathExistsSync: Md.existsSync
};
const Zn = Ze;
function iy(e, t, r, n) {
  Zn.open(e, "r+", (i, a) => {
    if (i) return n(i);
    Zn.futimes(a, t, r, (s) => {
      Zn.close(a, (u) => {
        n && n(s || u);
      });
    });
  });
}
function oy(e, t, r) {
  const n = Zn.openSync(e, "r+");
  return Zn.futimesSync(n, t, r), Zn.closeSync(n);
}
var qd = {
  utimesMillis: iy,
  utimesMillisSync: oy
};
const ni = hn, xe = ve, ay = au;
function sy(e, t, r) {
  const n = r.dereference ? (i) => ni.stat(i, { bigint: !0 }) : (i) => ni.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function ly(e, t, r) {
  let n;
  const i = r.dereference ? (s) => ni.statSync(s, { bigint: !0 }) : (s) => ni.lstatSync(s, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: a, destStat: null };
    throw s;
  }
  return { srcStat: a, destStat: n };
}
function uy(e, t, r, n, i) {
  ay.callbackify(sy)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: u, destStat: c } = s;
    if (c) {
      if (go(u, c)) {
        const g = xe.basename(e), f = xe.basename(t);
        return r === "move" && g !== f && g.toLowerCase() === f.toLowerCase() ? i(null, { srcStat: u, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (u.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!u.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return u.isDirectory() && fu(e, t) ? i(new Error(ss(e, t, r))) : i(null, { srcStat: u, destStat: c });
  });
}
function cy(e, t, r, n) {
  const { srcStat: i, destStat: a } = ly(e, t, n);
  if (a) {
    if (go(i, a)) {
      const s = xe.basename(e), u = xe.basename(t);
      if (r === "move" && s !== u && s.toLowerCase() === u.toLowerCase())
        return { srcStat: i, destStat: a, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !a.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && a.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && fu(e, t))
    throw new Error(ss(e, t, r));
  return { srcStat: i, destStat: a };
}
function jd(e, t, r, n, i) {
  const a = xe.resolve(xe.dirname(e)), s = xe.resolve(xe.dirname(r));
  if (s === a || s === xe.parse(s).root) return i();
  ni.stat(s, { bigint: !0 }, (u, c) => u ? u.code === "ENOENT" ? i() : i(u) : go(t, c) ? i(new Error(ss(e, r, n))) : jd(e, t, s, n, i));
}
function Wd(e, t, r, n) {
  const i = xe.resolve(xe.dirname(e)), a = xe.resolve(xe.dirname(r));
  if (a === i || a === xe.parse(a).root) return;
  let s;
  try {
    s = ni.statSync(a, { bigint: !0 });
  } catch (u) {
    if (u.code === "ENOENT") return;
    throw u;
  }
  if (go(t, s))
    throw new Error(ss(e, r, n));
  return Wd(e, t, a, n);
}
function go(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function fu(e, t) {
  const r = xe.resolve(e).split(xe.sep).filter((i) => i), n = xe.resolve(t).split(xe.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function ss(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var li = {
  checkPaths: uy,
  checkPathsSync: cy,
  checkParentPaths: jd,
  checkParentPathsSync: Wd,
  isSrcSubdir: fu,
  areIdentical: go
};
const lt = Ze, Xi = ve, fy = Vt.mkdirs, dy = pn.pathExists, hy = qd.utimesMillis, Qi = li;
function py(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Qi.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: u } = a;
    Qi.checkParentPaths(e, s, t, "copy", (c) => c ? n(c) : r.filter ? Hd(Pc, u, e, t, r, n) : Pc(u, e, t, r, n));
  });
}
function Pc(e, t, r, n, i) {
  const a = Xi.dirname(r);
  dy(a, (s, u) => {
    if (s) return i(s);
    if (u) return Ha(e, t, r, n, i);
    fy(a, (c) => c ? i(c) : Ha(e, t, r, n, i));
  });
}
function Hd(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function my(e, t, r, n, i) {
  return n.filter ? Hd(Ha, e, t, r, n, i) : Ha(e, t, r, n, i);
}
function Ha(e, t, r, n, i) {
  (n.dereference ? lt.stat : lt.lstat)(t, (s, u) => s ? i(s) : u.isDirectory() ? Sy(u, e, t, r, n, i) : u.isFile() || u.isCharacterDevice() || u.isBlockDevice() ? gy(u, e, t, r, n, i) : u.isSymbolicLink() ? Ry(e, t, r, n, i) : u.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : u.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function gy(e, t, r, n, i, a) {
  return t ? yy(e, r, n, i, a) : zd(e, r, n, i, a);
}
function yy(e, t, r, n, i) {
  if (n.overwrite)
    lt.unlink(r, (a) => a ? i(a) : zd(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function zd(e, t, r, n, i) {
  lt.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? by(e.mode, t, r, i) : ls(r, e.mode, i));
}
function by(e, t, r, n) {
  return wy(e) ? _y(r, e, (i) => i ? n(i) : Ic(e, t, r, n)) : Ic(e, t, r, n);
}
function wy(e) {
  return (e & 128) === 0;
}
function _y(e, t, r) {
  return ls(e, t | 128, r);
}
function Ic(e, t, r, n) {
  Ey(t, r, (i) => i ? n(i) : ls(r, e, n));
}
function ls(e, t, r) {
  return lt.chmod(e, t, r);
}
function Ey(e, t, r) {
  lt.stat(e, (n, i) => n ? r(n) : hy(t, i.atime, i.mtime, r));
}
function Sy(e, t, r, n, i, a) {
  return t ? Gd(r, n, i, a) : vy(e.mode, r, n, i, a);
}
function vy(e, t, r, n, i) {
  lt.mkdir(r, (a) => {
    if (a) return i(a);
    Gd(t, r, n, (s) => s ? i(s) : ls(r, e, i));
  });
}
function Gd(e, t, r, n) {
  lt.readdir(e, (i, a) => i ? n(i) : Vd(a, e, t, r, n));
}
function Vd(e, t, r, n, i) {
  const a = e.pop();
  return a ? Cy(e, a, t, r, n, i) : i();
}
function Cy(e, t, r, n, i, a) {
  const s = Xi.join(r, t), u = Xi.join(n, t);
  Qi.checkPaths(s, u, "copy", i, (c, g) => {
    if (c) return a(c);
    const { destStat: f } = g;
    my(f, s, u, i, (h) => h ? a(h) : Vd(e, r, n, i, a));
  });
}
function Ry(e, t, r, n, i) {
  lt.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Xi.resolve(process.cwd(), s)), e)
      lt.readlink(r, (u, c) => u ? u.code === "EINVAL" || u.code === "UNKNOWN" ? lt.symlink(s, r, i) : i(u) : (n.dereference && (c = Xi.resolve(process.cwd(), c)), Qi.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Qi.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : Ty(s, r, i)));
    else
      return lt.symlink(s, r, i);
  });
}
function Ty(e, t, r) {
  lt.unlink(t, (n) => n ? r(n) : lt.symlink(e, t, r));
}
var Ay = py;
const ze = Ze, Ki = ve, Py = Vt.mkdirsSync, Iy = qd.utimesMillisSync, Ji = li;
function $y(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Ji.checkPathsSync(e, t, "copy", r);
  return Ji.checkParentPathsSync(e, n, t, "copy"), Oy(i, e, t, r);
}
function Oy(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Ki.dirname(r);
  return ze.existsSync(i) || Py(i), Yd(e, t, r, n);
}
function Dy(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Yd(e, t, r, n);
}
function Yd(e, t, r, n) {
  const a = (n.dereference ? ze.statSync : ze.lstatSync)(t);
  if (a.isDirectory()) return By(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return Ny(a, e, t, r, n);
  if (a.isSymbolicLink()) return jy(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Ny(e, t, r, n, i) {
  return t ? Fy(e, r, n, i) : Xd(e, r, n, i);
}
function Fy(e, t, r, n) {
  if (n.overwrite)
    return ze.unlinkSync(r), Xd(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Xd(e, t, r, n) {
  return ze.copyFileSync(t, r), n.preserveTimestamps && ky(e.mode, t, r), du(r, e.mode);
}
function ky(e, t, r) {
  return Ly(e) && xy(r, e), Uy(t, r);
}
function Ly(e) {
  return (e & 128) === 0;
}
function xy(e, t) {
  return du(e, t | 128);
}
function du(e, t) {
  return ze.chmodSync(e, t);
}
function Uy(e, t) {
  const r = ze.statSync(e);
  return Iy(t, r.atime, r.mtime);
}
function By(e, t, r, n, i) {
  return t ? Qd(r, n, i) : My(e.mode, r, n, i);
}
function My(e, t, r, n) {
  return ze.mkdirSync(r), Qd(t, r, n), du(r, e);
}
function Qd(e, t, r) {
  ze.readdirSync(e).forEach((n) => qy(n, e, t, r));
}
function qy(e, t, r, n) {
  const i = Ki.join(t, e), a = Ki.join(r, e), { destStat: s } = Ji.checkPathsSync(i, a, "copy", n);
  return Dy(s, i, a, n);
}
function jy(e, t, r, n) {
  let i = ze.readlinkSync(t);
  if (n.dereference && (i = Ki.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = ze.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return ze.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = Ki.resolve(process.cwd(), a)), Ji.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (ze.statSync(r).isDirectory() && Ji.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return Wy(i, r);
  } else
    return ze.symlinkSync(i, r);
}
function Wy(e, t) {
  return ze.unlinkSync(t), ze.symlinkSync(e, t);
}
var Hy = $y;
const zy = Je.fromCallback;
var hu = {
  copy: zy(Ay),
  copySync: Hy
};
const $c = Ze, Kd = ve, ge = Rd, Zi = process.platform === "win32";
function Jd(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || $c[r], r = r + "Sync", e[r] = e[r] || $c[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function pu(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ge(e, "rimraf: missing path"), ge.strictEqual(typeof e, "string", "rimraf: path should be a string"), ge.strictEqual(typeof r, "function", "rimraf: callback function required"), ge(t, "rimraf: invalid options argument provided"), ge.strictEqual(typeof t, "object", "rimraf: options should be object"), Jd(t), Oc(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => Oc(e, t, i), s);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function Oc(e, t, r) {
  ge(e), ge(t), ge(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Zi)
      return Dc(e, t, n, r);
    if (i && i.isDirectory())
      return Fa(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Zi ? Dc(e, t, a, r) : Fa(e, t, a, r);
        if (a.code === "EISDIR")
          return Fa(e, t, a, r);
      }
      return r(a);
    });
  });
}
function Dc(e, t, r, n) {
  ge(e), ge(t), ge(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? Fa(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Nc(e, t, r) {
  let n;
  ge(e), ge(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? ka(e, t, r) : t.unlinkSync(e);
}
function Fa(e, t, r, n) {
  ge(e), ge(t), ge(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Gy(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Gy(e, t, r) {
  ge(e), ge(t), ge(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((u) => {
      pu(Kd.join(e, u), t, (c) => {
        if (!s) {
          if (c) return r(s = c);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Zd(e, t) {
  let r;
  t = t || {}, Jd(t), ge(e, "rimraf: missing path"), ge.strictEqual(typeof e, "string", "rimraf: path should be a string"), ge(t, "rimraf: missing options"), ge.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Zi && Nc(e, t, n);
  }
  try {
    r && r.isDirectory() ? ka(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Zi ? Nc(e, t, n) : ka(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    ka(e, t, n);
  }
}
function ka(e, t, r) {
  ge(e), ge(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Vy(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Vy(e, t) {
  if (ge(e), ge(t), t.readdirSync(e).forEach((r) => Zd(Kd.join(e, r), t)), Zi) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var Yy = pu;
pu.sync = Zd;
const za = Ze, Xy = Je.fromCallback, eh = Yy;
function Qy(e, t) {
  if (za.rm) return za.rm(e, { recursive: !0, force: !0 }, t);
  eh(e, t);
}
function Ky(e) {
  if (za.rmSync) return za.rmSync(e, { recursive: !0, force: !0 });
  eh.sync(e);
}
var us = {
  remove: Xy(Qy),
  removeSync: Ky
};
const Jy = Je.fromPromise, th = hn, rh = ve, nh = Vt, ih = us, Fc = Jy(async function(t) {
  let r;
  try {
    r = await th.readdir(t);
  } catch {
    return nh.mkdirs(t);
  }
  return Promise.all(r.map((n) => ih.remove(rh.join(t, n))));
});
function kc(e) {
  let t;
  try {
    t = th.readdirSync(e);
  } catch {
    return nh.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = rh.join(e, r), ih.removeSync(r);
  });
}
var Zy = {
  emptyDirSync: kc,
  emptydirSync: kc,
  emptyDir: Fc,
  emptydir: Fc
};
const e0 = Je.fromCallback, oh = ve, $r = Ze, ah = Vt;
function t0(e, t) {
  function r() {
    $r.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  $r.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = oh.dirname(e);
    $r.stat(a, (s, u) => {
      if (s)
        return s.code === "ENOENT" ? ah.mkdirs(a, (c) => {
          if (c) return t(c);
          r();
        }) : t(s);
      u.isDirectory() ? r() : $r.readdir(a, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function r0(e) {
  let t;
  try {
    t = $r.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = oh.dirname(e);
  try {
    $r.statSync(r).isDirectory() || $r.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") ah.mkdirsSync(r);
    else throw n;
  }
  $r.writeFileSync(e, "");
}
var n0 = {
  createFile: e0(t0),
  createFileSync: r0
};
const i0 = Je.fromCallback, sh = ve, Ir = Ze, lh = Vt, o0 = pn.pathExists, { areIdentical: uh } = li;
function a0(e, t, r) {
  function n(i, a) {
    Ir.link(i, a, (s) => {
      if (s) return r(s);
      r(null);
    });
  }
  Ir.lstat(t, (i, a) => {
    Ir.lstat(e, (s, u) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), r(s);
      if (a && uh(u, a)) return r(null);
      const c = sh.dirname(t);
      o0(c, (g, f) => {
        if (g) return r(g);
        if (f) return n(e, t);
        lh.mkdirs(c, (h) => {
          if (h) return r(h);
          n(e, t);
        });
      });
    });
  });
}
function s0(e, t) {
  let r;
  try {
    r = Ir.lstatSync(t);
  } catch {
  }
  try {
    const a = Ir.lstatSync(e);
    if (r && uh(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = sh.dirname(t);
  return Ir.existsSync(n) || lh.mkdirsSync(n), Ir.linkSync(e, t);
}
var l0 = {
  createLink: i0(a0),
  createLinkSync: s0
};
const Or = ve, ji = Ze, u0 = pn.pathExists;
function c0(e, t, r) {
  if (Or.isAbsolute(e))
    return ji.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Or.dirname(t), i = Or.join(n, e);
    return u0(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : ji.lstat(e, (u) => u ? (u.message = u.message.replace("lstat", "ensureSymlink"), r(u)) : r(null, {
      toCwd: e,
      toDst: Or.relative(n, e)
    })));
  }
}
function f0(e, t) {
  let r;
  if (Or.isAbsolute(e)) {
    if (r = ji.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Or.dirname(t), i = Or.join(n, e);
    if (r = ji.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = ji.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Or.relative(n, e)
    };
  }
}
var d0 = {
  symlinkPaths: c0,
  symlinkPathsSync: f0
};
const ch = Ze;
function h0(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  ch.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function p0(e, t) {
  let r;
  if (t) return t;
  try {
    r = ch.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var m0 = {
  symlinkType: h0,
  symlinkTypeSync: p0
};
const g0 = Je.fromCallback, fh = ve, Pt = hn, dh = Vt, y0 = dh.mkdirs, b0 = dh.mkdirsSync, hh = d0, w0 = hh.symlinkPaths, _0 = hh.symlinkPathsSync, ph = m0, E0 = ph.symlinkType, S0 = ph.symlinkTypeSync, v0 = pn.pathExists, { areIdentical: mh } = li;
function C0(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Pt.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      Pt.stat(e),
      Pt.stat(t)
    ]).then(([s, u]) => {
      if (mh(s, u)) return n(null);
      Lc(e, t, r, n);
    }) : Lc(e, t, r, n);
  });
}
function Lc(e, t, r, n) {
  w0(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, E0(a.toCwd, r, (s, u) => {
      if (s) return n(s);
      const c = fh.dirname(t);
      v0(c, (g, f) => {
        if (g) return n(g);
        if (f) return Pt.symlink(e, t, u, n);
        y0(c, (h) => {
          if (h) return n(h);
          Pt.symlink(e, t, u, n);
        });
      });
    });
  });
}
function R0(e, t, r) {
  let n;
  try {
    n = Pt.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const u = Pt.statSync(e), c = Pt.statSync(t);
    if (mh(u, c)) return;
  }
  const i = _0(e, t);
  e = i.toDst, r = S0(i.toCwd, r);
  const a = fh.dirname(t);
  return Pt.existsSync(a) || b0(a), Pt.symlinkSync(e, t, r);
}
var T0 = {
  createSymlink: g0(C0),
  createSymlinkSync: R0
};
const { createFile: xc, createFileSync: Uc } = n0, { createLink: Bc, createLinkSync: Mc } = l0, { createSymlink: qc, createSymlinkSync: jc } = T0;
var A0 = {
  // file
  createFile: xc,
  createFileSync: Uc,
  ensureFile: xc,
  ensureFileSync: Uc,
  // link
  createLink: Bc,
  createLinkSync: Mc,
  ensureLink: Bc,
  ensureLinkSync: Mc,
  // symlink
  createSymlink: qc,
  createSymlinkSync: jc,
  ensureSymlink: qc,
  ensureSymlinkSync: jc
};
function P0(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function I0(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var mu = { stringify: P0, stripBom: I0 };
let ii;
try {
  ii = Ze;
} catch {
  ii = Ur;
}
const cs = Je, { stringify: gh, stripBom: yh } = mu;
async function $0(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || ii, n = "throws" in t ? t.throws : !0;
  let i = await cs.fromCallback(r.readFile)(e, t);
  i = yh(i);
  let a;
  try {
    a = JSON.parse(i, t ? t.reviver : null);
  } catch (s) {
    if (n)
      throw s.message = `${e}: ${s.message}`, s;
    return null;
  }
  return a;
}
const O0 = cs.fromPromise($0);
function D0(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || ii, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = yh(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function N0(e, t, r = {}) {
  const n = r.fs || ii, i = gh(t, r);
  await cs.fromCallback(n.writeFile)(e, i, r);
}
const F0 = cs.fromPromise(N0);
function k0(e, t, r = {}) {
  const n = r.fs || ii, i = gh(t, r);
  return n.writeFileSync(e, i, r);
}
const L0 = {
  readFile: O0,
  readFileSync: D0,
  writeFile: F0,
  writeFileSync: k0
};
var x0 = L0;
const ba = x0;
var U0 = {
  // jsonfile exports
  readJson: ba.readFile,
  readJsonSync: ba.readFileSync,
  writeJson: ba.writeFile,
  writeJsonSync: ba.writeFileSync
};
const B0 = Je.fromCallback, Wi = Ze, bh = ve, wh = Vt, M0 = pn.pathExists;
function q0(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = bh.dirname(e);
  M0(i, (a, s) => {
    if (a) return n(a);
    if (s) return Wi.writeFile(e, t, r, n);
    wh.mkdirs(i, (u) => {
      if (u) return n(u);
      Wi.writeFile(e, t, r, n);
    });
  });
}
function j0(e, ...t) {
  const r = bh.dirname(e);
  if (Wi.existsSync(r))
    return Wi.writeFileSync(e, ...t);
  wh.mkdirsSync(r), Wi.writeFileSync(e, ...t);
}
var gu = {
  outputFile: B0(q0),
  outputFileSync: j0
};
const { stringify: W0 } = mu, { outputFile: H0 } = gu;
async function z0(e, t, r = {}) {
  const n = W0(t, r);
  await H0(e, n, r);
}
var G0 = z0;
const { stringify: V0 } = mu, { outputFileSync: Y0 } = gu;
function X0(e, t, r) {
  const n = V0(t, r);
  Y0(e, n, r);
}
var Q0 = X0;
const K0 = Je.fromPromise, Ke = U0;
Ke.outputJson = K0(G0);
Ke.outputJsonSync = Q0;
Ke.outputJSON = Ke.outputJson;
Ke.outputJSONSync = Ke.outputJsonSync;
Ke.writeJSON = Ke.writeJson;
Ke.writeJSONSync = Ke.writeJsonSync;
Ke.readJSON = Ke.readJson;
Ke.readJSONSync = Ke.readJsonSync;
var J0 = Ke;
const Z0 = Ze, Ml = ve, eb = hu.copy, _h = us.remove, tb = Vt.mkdirp, rb = pn.pathExists, Wc = li;
function nb(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Wc.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: u, isChangingCase: c = !1 } = s;
    Wc.checkParentPaths(e, u, t, "move", (g) => {
      if (g) return n(g);
      if (ib(t)) return Hc(e, t, i, c, n);
      tb(Ml.dirname(t), (f) => f ? n(f) : Hc(e, t, i, c, n));
    });
  });
}
function ib(e) {
  const t = Ml.dirname(e);
  return Ml.parse(t).root === t;
}
function Hc(e, t, r, n, i) {
  if (n) return sl(e, t, r, i);
  if (r)
    return _h(t, (a) => a ? i(a) : sl(e, t, r, i));
  rb(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : sl(e, t, r, i));
}
function sl(e, t, r, n) {
  Z0.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : ob(e, t, r, n) : n());
}
function ob(e, t, r, n) {
  eb(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : _h(e, n));
}
var ab = nb;
const Eh = Ze, ql = ve, sb = hu.copySync, Sh = us.removeSync, lb = Vt.mkdirpSync, zc = li;
function ub(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = zc.checkPathsSync(e, t, "move", r);
  return zc.checkParentPathsSync(e, i, t, "move"), cb(t) || lb(ql.dirname(t)), fb(e, t, n, a);
}
function cb(e) {
  const t = ql.dirname(e);
  return ql.parse(t).root === t;
}
function fb(e, t, r, n) {
  if (n) return ll(e, t, r);
  if (r)
    return Sh(t), ll(e, t, r);
  if (Eh.existsSync(t)) throw new Error("dest already exists.");
  return ll(e, t, r);
}
function ll(e, t, r) {
  try {
    Eh.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return db(e, t, r);
  }
}
function db(e, t, r) {
  return sb(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Sh(e);
}
var hb = ub;
const pb = Je.fromCallback;
var mb = {
  move: pb(ab),
  moveSync: hb
}, Br = {
  // Export promiseified graceful-fs:
  ...hn,
  // Export extra methods:
  ...hu,
  ...Zy,
  ...A0,
  ...J0,
  ...Vt,
  ...mb,
  ...gu,
  ...pn,
  ...us
}, dr = {}, Nr = {}, Be = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.CancellationError = Fr.CancellationToken = void 0;
const gb = Td;
class yb extends gb.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new jl());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, a) => {
      let s = null;
      if (n = () => {
        try {
          s != null && (s(), s = null);
        } finally {
          a(new jl());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, a, (u) => {
        s = u;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
Fr.CancellationToken = yb;
class jl extends Error {
  constructor() {
    super("cancelled");
  }
}
Fr.CancellationError = jl;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.newError = bb;
function bb(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Qe = {}, Wl = { exports: {} }, wa = { exports: {} }, ul, Gc;
function wb() {
  if (Gc) return ul;
  Gc = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  ul = function(f, h) {
    h = h || {};
    var m = typeof f;
    if (m === "string" && f.length > 0)
      return s(f);
    if (m === "number" && isFinite(f))
      return h.long ? c(f) : u(f);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(f)
    );
  };
  function s(f) {
    if (f = String(f), !(f.length > 100)) {
      var h = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        f
      );
      if (h) {
        var m = parseFloat(h[1]), b = (h[2] || "ms").toLowerCase();
        switch (b) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return m * a;
          case "weeks":
          case "week":
          case "w":
            return m * i;
          case "days":
          case "day":
          case "d":
            return m * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return m * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return m * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return m * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return m;
          default:
            return;
        }
      }
    }
  }
  function u(f) {
    var h = Math.abs(f);
    return h >= n ? Math.round(f / n) + "d" : h >= r ? Math.round(f / r) + "h" : h >= t ? Math.round(f / t) + "m" : h >= e ? Math.round(f / e) + "s" : f + "ms";
  }
  function c(f) {
    var h = Math.abs(f);
    return h >= n ? g(f, h, n, "day") : h >= r ? g(f, h, r, "hour") : h >= t ? g(f, h, t, "minute") : h >= e ? g(f, h, e, "second") : f + " ms";
  }
  function g(f, h, m, b) {
    var E = h >= m * 1.5;
    return Math.round(f / m) + " " + b + (E ? "s" : "");
  }
  return ul;
}
var cl, Vc;
function vh() {
  if (Vc) return cl;
  Vc = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = g, n.disable = u, n.enable = a, n.enabled = c, n.humanize = wb(), n.destroy = f, Object.keys(t).forEach((h) => {
      n[h] = t[h];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(h) {
      let m = 0;
      for (let b = 0; b < h.length; b++)
        m = (m << 5) - m + h.charCodeAt(b), m |= 0;
      return n.colors[Math.abs(m) % n.colors.length];
    }
    n.selectColor = r;
    function n(h) {
      let m, b = null, E, C;
      function A(...I) {
        if (!A.enabled)
          return;
        const $ = A, M = Number(/* @__PURE__ */ new Date()), x = M - (m || M);
        $.diff = x, $.prev = m, $.curr = M, m = M, I[0] = n.coerce(I[0]), typeof I[0] != "string" && I.unshift("%O");
        let te = 0;
        I[0] = I[0].replace(/%([a-zA-Z%])/g, (Q, Ne) => {
          if (Q === "%%")
            return "%";
          te++;
          const S = n.formatters[Ne];
          if (typeof S == "function") {
            const re = I[te];
            Q = S.call($, re), I.splice(te, 1), te--;
          }
          return Q;
        }), n.formatArgs.call($, I), ($.log || n.log).apply($, I);
      }
      return A.namespace = h, A.useColors = n.useColors(), A.color = n.selectColor(h), A.extend = i, A.destroy = n.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => b !== null ? b : (E !== n.namespaces && (E = n.namespaces, C = n.enabled(h)), C),
        set: (I) => {
          b = I;
        }
      }), typeof n.init == "function" && n.init(A), A;
    }
    function i(h, m) {
      const b = n(this.namespace + (typeof m > "u" ? ":" : m) + h);
      return b.log = this.log, b;
    }
    function a(h) {
      n.save(h), n.namespaces = h, n.names = [], n.skips = [];
      const m = (typeof h == "string" ? h : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const b of m)
        b[0] === "-" ? n.skips.push(b.slice(1)) : n.names.push(b);
    }
    function s(h, m) {
      let b = 0, E = 0, C = -1, A = 0;
      for (; b < h.length; )
        if (E < m.length && (m[E] === h[b] || m[E] === "*"))
          m[E] === "*" ? (C = E, A = b, E++) : (b++, E++);
        else if (C !== -1)
          E = C + 1, A++, b = A;
        else
          return !1;
      for (; E < m.length && m[E] === "*"; )
        E++;
      return E === m.length;
    }
    function u() {
      const h = [
        ...n.names,
        ...n.skips.map((m) => "-" + m)
      ].join(",");
      return n.enable(""), h;
    }
    function c(h) {
      for (const m of n.skips)
        if (s(h, m))
          return !1;
      for (const m of n.names)
        if (s(h, m))
          return !0;
      return !1;
    }
    function g(h) {
      return h instanceof Error ? h.stack || h.message : h;
    }
    function f() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return cl = e, cl;
}
var Yc;
function _b() {
  return Yc || (Yc = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = a, t.useColors = r, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const g = "color: " + this.color;
      c.splice(1, 0, g, "color: inherit");
      let f = 0, h = 0;
      c[0].replace(/%[a-zA-Z%]/g, (m) => {
        m !== "%%" && (f++, m === "%c" && (h = f));
      }), c.splice(h, 0, g);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function a() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = vh()(t);
    const { formatters: u } = e.exports;
    u.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (g) {
        return "[UnexpectedJSONParseError]: " + g.message;
      }
    };
  }(wa, wa.exports)), wa.exports;
}
var _a = { exports: {} }, fl, Xc;
function Eb() {
  return Xc || (Xc = 1, fl = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), fl;
}
var dl, Qc;
function Sb() {
  if (Qc) return dl;
  Qc = 1;
  const e = os, t = Ad, r = Eb(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function a(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function s(c, g) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (c && !g && i === void 0)
      return 0;
    const f = i || 0;
    if (n.TERM === "dumb")
      return f;
    if (process.platform === "win32") {
      const h = e.release().split(".");
      return Number(h[0]) >= 10 && Number(h[2]) >= 10586 ? Number(h[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((h) => h in n) || n.CI_NAME === "codeship" ? 1 : f;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const h = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return h >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : f;
  }
  function u(c) {
    const g = s(c, c && c.isTTY);
    return a(g);
  }
  return dl = {
    supportsColor: u,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, dl;
}
var Kc;
function vb() {
  return Kc || (Kc = 1, function(e, t) {
    const r = Ad, n = au;
    t.init = f, t.log = u, t.formatArgs = a, t.save = c, t.load = g, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const m = Sb();
      m && (m.stderr || m).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((m) => /^debug_/i.test(m)).reduce((m, b) => {
      const E = b.substring(6).toLowerCase().replace(/_([a-z])/g, (A, I) => I.toUpperCase());
      let C = process.env[b];
      return /^(yes|on|true|enabled)$/i.test(C) ? C = !0 : /^(no|off|false|disabled)$/i.test(C) ? C = !1 : C === "null" ? C = null : C = Number(C), m[E] = C, m;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(m) {
      const { namespace: b, useColors: E } = this;
      if (E) {
        const C = this.color, A = "\x1B[3" + (C < 8 ? C : "8;5;" + C), I = `  ${A};1m${b} \x1B[0m`;
        m[0] = I + m[0].split(`
`).join(`
` + I), m.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        m[0] = s() + b + " " + m[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function u(...m) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...m) + `
`);
    }
    function c(m) {
      m ? process.env.DEBUG = m : delete process.env.DEBUG;
    }
    function g() {
      return process.env.DEBUG;
    }
    function f(m) {
      m.inspectOpts = {};
      const b = Object.keys(t.inspectOpts);
      for (let E = 0; E < b.length; E++)
        m.inspectOpts[b[E]] = t.inspectOpts[b[E]];
    }
    e.exports = vh()(t);
    const { formatters: h } = e.exports;
    h.o = function(m) {
      return this.inspectOpts.colors = this.useColors, n.inspect(m, this.inspectOpts).split(`
`).map((b) => b.trim()).join(" ");
    }, h.O = function(m) {
      return this.inspectOpts.colors = this.useColors, n.inspect(m, this.inspectOpts);
    };
  }(_a, _a.exports)), _a.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Wl.exports = _b() : Wl.exports = vb();
var Cb = Wl.exports, yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
yo.ProgressCallbackTransform = void 0;
const Rb = po;
class Tb extends Rb.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
yo.ProgressCallbackTransform = Tb;
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.DigestTransform = Qe.HttpExecutor = Qe.HttpError = void 0;
Qe.createHttpError = Hl;
Qe.parseJson = Fb;
Qe.configureRequestOptionsFromUrl = Rh;
Qe.configureRequestUrl = bu;
Qe.safeGetHeader = ei;
Qe.configureRequestOptions = Va;
Qe.safeStringifyJson = Ya;
const Ab = mo, Pb = Cb, Ib = Ur, $b = po, Ch = si, Ob = Fr, Jc = ui, Db = yo, Di = (0, Pb.default)("electron-builder");
function Hl(e, t = null) {
  return new yu(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Ya(e.headers), t);
}
const Nb = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class yu extends Error {
  constructor(t, r = `HTTP error: ${Nb.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Qe.HttpError = yu;
function Fb(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Ga {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Ob.CancellationToken(), n) {
    Va(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      Di(i);
      const { headers: s, ...u } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": a.length,
          ...s
        },
        ...u
      };
    }
    return this.doApiRequest(t, r, (s) => s.end(a));
  }
  doApiRequest(t, r, n, i = 0) {
    return Di.enabled && Di(`Request: ${Ya(t)}`), r.createPromise((a, s, u) => {
      const c = this.createRequest(t, (g) => {
        try {
          this.handleResponse(g, t, r, a, s, i, n);
        } catch (f) {
          s(f);
        }
      });
      this.addErrorAndTimeoutHandlers(c, s, t.timeout), this.addRedirectHandlers(c, t, s, i, (g) => {
        this.doApiRequest(g, r, n, i).then(a).catch(s);
      }), n(c, s), u(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, a) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, a, s, u) {
    var c;
    if (Di.enabled && Di(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Ya(r)}`), t.statusCode === 404) {
      a(Hl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const g = (c = t.statusCode) !== null && c !== void 0 ? c : 0, f = g >= 300 && g < 400, h = ei(t, "location");
    if (f && h != null) {
      if (s > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Ga.prepareRedirectUrlOptions(h, r), n, u, s).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let m = "";
    t.on("error", a), t.on("data", (b) => m += b), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const b = ei(t, "content-type"), E = b != null && (Array.isArray(b) ? b.find((C) => C.includes("json")) != null : b.includes("json"));
          a(Hl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${E ? JSON.stringify(JSON.parse(m)) : m}
          `));
        } else
          i(m.length === 0 ? null : m);
      } catch (b) {
        a(b);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, a) => {
      const s = [], u = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      bu(t, u), Va(u), this.doDownload(u, {
        destination: null,
        options: r,
        onCancel: a,
        callback: (c) => {
          c == null ? n(Buffer.concat(s)) : i(c);
        },
        responseHandler: (c, g) => {
          let f = 0;
          c.on("data", (h) => {
            if (f += h.length, f > 524288e3) {
              g(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(h);
          }), c.on("end", () => {
            g(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (a) => {
      if (a.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${a.statusCode}: ${a.statusMessage}`));
        return;
      }
      a.on("error", r.callback);
      const s = ei(a, "location");
      if (s != null) {
        n < this.maxRedirects ? this.doDownload(Ga.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Lb(r, a) : r.responseHandler(a, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (a) => {
      this.doDownload(a, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = Rh(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new Ch.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof yu && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Qe.HttpExecutor = Ga;
function Rh(e, t) {
  const r = Va(t);
  return bu(new Ch.URL(e), r), r;
}
function bu(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class zl extends $b.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Ab.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Jc.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Jc.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Qe.DigestTransform = zl;
function kb(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function ei(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Lb(e, t) {
  if (!kb(ei(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = ei(t, "content-length");
    s != null && r.push(new Db.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new zl(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new zl(e.options.sha2, "sha256", "hex"));
  const i = (0, Ib.createWriteStream)(e.destination);
  r.push(i);
  let a = t;
  for (const s of r)
    s.on("error", (u) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(u);
    }), a = a.pipe(s);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Va(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Ya(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
fs.MemoLazy = void 0;
class xb {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Th(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
fs.MemoLazy = xb;
function Th(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => Th(e[s], t[s]));
  }
  return e === t;
}
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.githubUrl = Ub;
ds.getS3LikeProviderBaseUrl = Bb;
function Ub(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Bb(e) {
  const t = e.provider;
  if (t === "s3")
    return Mb(e);
  if (t === "spaces")
    return qb(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Mb(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return Ah(t, e.path);
}
function Ah(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function qb(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Ah(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var wu = {};
Object.defineProperty(wu, "__esModule", { value: !0 });
wu.retry = Ph;
const jb = Fr;
async function Ph(e, t, r, n = 0, i = 0, a) {
  var s;
  const u = new jb.CancellationToken();
  try {
    return await e();
  } catch (c) {
    if ((!((s = a == null ? void 0 : a(c)) !== null && s !== void 0) || s) && t > 0 && !u.cancelled)
      return await new Promise((g) => setTimeout(g, r + n * i)), await Ph(e, t - 1, r, n, i + 1, a);
    throw c;
  }
}
var _u = {};
Object.defineProperty(_u, "__esModule", { value: !0 });
_u.parseDn = Wb;
function Wb(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const a = /* @__PURE__ */ new Map();
  for (let s = 0; s <= e.length; s++) {
    if (s === e.length) {
      r !== null && a.set(r, n);
      break;
    }
    const u = e[s];
    if (t) {
      if (u === '"') {
        t = !1;
        continue;
      }
    } else {
      if (u === '"') {
        t = !0;
        continue;
      }
      if (u === "\\") {
        s++;
        const c = parseInt(e.slice(s, s + 2), 16);
        Number.isNaN(c) ? n += e[s] : (s++, n += String.fromCharCode(c));
        continue;
      }
      if (r === null && u === "=") {
        r = n, n = "";
        continue;
      }
      if (u === "," || u === ";" || u === "+") {
        r !== null && a.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (u === " " && !t) {
      if (n.length === 0)
        continue;
      if (s > i) {
        let c = s;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        s = i - 1;
        continue;
      }
    }
    n += u;
  }
  return a;
}
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
oi.nil = oi.UUID = void 0;
const Ih = mo, $h = ui, Hb = "options.name must be either a string or a Buffer", Zc = (0, Ih.randomBytes)(16);
Zc[0] = Zc[0] | 1;
const La = {}, ue = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  La[t] = e, ue[e] = t;
}
class dn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = dn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return zb(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Gb(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (La[t[14] + t[15]] & 240) >> 4,
        variant: ef((La[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: ef((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, $h.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = La[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
oi.UUID = dn;
dn.OID = dn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function ef(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Hi;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Hi || (Hi = {}));
function zb(e, t, r, n, i = Hi.ASCII) {
  const a = (0, Ih.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, $h.newError)(Hb, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const u = a.digest();
  let c;
  switch (i) {
    case Hi.BINARY:
      u[6] = u[6] & 15 | r, u[8] = u[8] & 63 | 128, c = u;
      break;
    case Hi.OBJECT:
      u[6] = u[6] & 15 | r, u[8] = u[8] & 63 | 128, c = new dn(u);
      break;
    default:
      c = ue[u[0]] + ue[u[1]] + ue[u[2]] + ue[u[3]] + "-" + ue[u[4]] + ue[u[5]] + "-" + ue[u[6] & 15 | r] + ue[u[7]] + "-" + ue[u[8] & 63 | 128] + ue[u[9]] + "-" + ue[u[10]] + ue[u[11]] + ue[u[12]] + ue[u[13]] + ue[u[14]] + ue[u[15]];
      break;
  }
  return c;
}
function Gb(e) {
  return ue[e[0]] + ue[e[1]] + ue[e[2]] + ue[e[3]] + "-" + ue[e[4]] + ue[e[5]] + "-" + ue[e[6]] + ue[e[7]] + "-" + ue[e[8]] + ue[e[9]] + "-" + ue[e[10]] + ue[e[11]] + ue[e[12]] + ue[e[13]] + ue[e[14]] + ue[e[15]];
}
oi.nil = new dn("00000000-0000-0000-0000-000000000000");
var bo = {}, Oh = {};
(function(e) {
  (function(t) {
    t.parser = function(y, p) {
      return new n(y, p);
    }, t.SAXParser = n, t.SAXStream = f, t.createStream = g, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(y, p) {
      if (!(this instanceof n))
        return new n(y, p);
      var F = this;
      a(F), F.q = F.c = "", F.bufferCheckPosition = t.MAX_BUFFER_LENGTH, F.opt = p || {}, F.opt.lowercase = F.opt.lowercase || F.opt.lowercasetags, F.looseCase = F.opt.lowercase ? "toLowerCase" : "toUpperCase", F.tags = [], F.closed = F.closedRoot = F.sawRoot = !1, F.tag = F.error = null, F.strict = !!y, F.noscript = !!(y || F.opt.noscript), F.state = S.BEGIN, F.strictEntities = F.opt.strictEntities, F.ENTITIES = F.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), F.attribList = [], F.opt.xmlns && (F.ns = Object.create(C)), F.opt.unquotedAttributeValues === void 0 && (F.opt.unquotedAttributeValues = !y), F.trackPosition = F.opt.position !== !1, F.trackPosition && (F.position = F.line = F.column = 0), Z(F, "onready");
    }
    Object.create || (Object.create = function(y) {
      function p() {
      }
      p.prototype = y;
      var F = new p();
      return F;
    }), Object.keys || (Object.keys = function(y) {
      var p = [];
      for (var F in y) y.hasOwnProperty(F) && p.push(F);
      return p;
    });
    function i(y) {
      for (var p = Math.max(t.MAX_BUFFER_LENGTH, 10), F = 0, T = 0, se = r.length; T < se; T++) {
        var pe = y[r[T]].length;
        if (pe > p)
          switch (r[T]) {
            case "textNode":
              ce(y);
              break;
            case "cdata":
              X(y, "oncdata", y.cdata), y.cdata = "";
              break;
            case "script":
              X(y, "onscript", y.script), y.script = "";
              break;
            default:
              D(y, "Max buffer length exceeded: " + r[T]);
          }
        F = Math.max(F, pe);
      }
      var we = t.MAX_BUFFER_LENGTH - F;
      y.bufferCheckPosition = we + y.position;
    }
    function a(y) {
      for (var p = 0, F = r.length; p < F; p++)
        y[r[p]] = "";
    }
    function s(y) {
      ce(y), y.cdata !== "" && (X(y, "oncdata", y.cdata), y.cdata = ""), y.script !== "" && (X(y, "onscript", y.script), y.script = "");
    }
    n.prototype = {
      end: function() {
        B(this);
      },
      write: Ce,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        s(this);
      }
    };
    var u;
    try {
      u = require("stream").Stream;
    } catch {
      u = function() {
      };
    }
    u || (u = function() {
    });
    var c = t.EVENTS.filter(function(y) {
      return y !== "error" && y !== "end";
    });
    function g(y, p) {
      return new f(y, p);
    }
    function f(y, p) {
      if (!(this instanceof f))
        return new f(y, p);
      u.apply(this), this._parser = new n(y, p), this.writable = !0, this.readable = !0;
      var F = this;
      this._parser.onend = function() {
        F.emit("end");
      }, this._parser.onerror = function(T) {
        F.emit("error", T), F._parser.error = null;
      }, this._decoder = null, c.forEach(function(T) {
        Object.defineProperty(F, "on" + T, {
          get: function() {
            return F._parser["on" + T];
          },
          set: function(se) {
            if (!se)
              return F.removeAllListeners(T), F._parser["on" + T] = se, se;
            F.on(T, se);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    f.prototype = Object.create(u.prototype, {
      constructor: {
        value: f
      }
    }), f.prototype.write = function(y) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(y)) {
        if (!this._decoder) {
          var p = Jm.StringDecoder;
          this._decoder = new p("utf8");
        }
        y = this._decoder.write(y);
      }
      return this._parser.write(y.toString()), this.emit("data", y), !0;
    }, f.prototype.end = function(y) {
      return y && y.length && this.write(y), this._parser.end(), !0;
    }, f.prototype.on = function(y, p) {
      var F = this;
      return !F._parser["on" + y] && c.indexOf(y) !== -1 && (F._parser["on" + y] = function() {
        var T = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        T.splice(0, 0, y), F.emit.apply(F, T);
      }), u.prototype.on.call(F, y, p);
    };
    var h = "[CDATA[", m = "DOCTYPE", b = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", C = { xml: b, xmlns: E }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, I = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, $ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, M = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(y) {
      return y === " " || y === `
` || y === "\r" || y === "	";
    }
    function te(y) {
      return y === '"' || y === "'";
    }
    function ae(y) {
      return y === ">" || x(y);
    }
    function Q(y, p) {
      return y.test(p);
    }
    function Ne(y, p) {
      return !Q(y, p);
    }
    var S = 0;
    t.STATE = {
      BEGIN: S++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: S++,
      // leading whitespace
      TEXT: S++,
      // general stuff
      TEXT_ENTITY: S++,
      // &amp and such.
      OPEN_WAKA: S++,
      // <
      SGML_DECL: S++,
      // <!BLARG
      SGML_DECL_QUOTED: S++,
      // <!BLARG foo "bar
      DOCTYPE: S++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: S++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: S++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: S++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: S++,
      // <!-
      COMMENT: S++,
      // <!--
      COMMENT_ENDING: S++,
      // <!-- blah -
      COMMENT_ENDED: S++,
      // <!-- blah --
      CDATA: S++,
      // <![CDATA[ something
      CDATA_ENDING: S++,
      // ]
      CDATA_ENDING_2: S++,
      // ]]
      PROC_INST: S++,
      // <?hi
      PROC_INST_BODY: S++,
      // <?hi there
      PROC_INST_ENDING: S++,
      // <?hi "there" ?
      OPEN_TAG: S++,
      // <strong
      OPEN_TAG_SLASH: S++,
      // <strong /
      ATTRIB: S++,
      // <a
      ATTRIB_NAME: S++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: S++,
      // <a foo _
      ATTRIB_VALUE: S++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: S++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: S++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: S++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: S++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: S++,
      // <foo bar=&quot
      CLOSE_TAG: S++,
      // </a
      CLOSE_TAG_SAW_WHITE: S++,
      // </a   >
      SCRIPT: S++,
      // <script> ...
      SCRIPT_ENDING: S++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(y) {
      var p = t.ENTITIES[y], F = typeof p == "number" ? String.fromCharCode(p) : p;
      t.ENTITIES[y] = F;
    });
    for (var re in t.STATE)
      t.STATE[t.STATE[re]] = re;
    S = t.STATE;
    function Z(y, p, F) {
      y[p] && y[p](F);
    }
    function X(y, p, F) {
      y.textNode && ce(y), Z(y, p, F);
    }
    function ce(y) {
      y.textNode = L(y.opt, y.textNode), y.textNode && Z(y, "ontext", y.textNode), y.textNode = "";
    }
    function L(y, p) {
      return y.trim && (p = p.trim()), y.normalize && (p = p.replace(/\s+/g, " ")), p;
    }
    function D(y, p) {
      return ce(y), y.trackPosition && (p += `
Line: ` + y.line + `
Column: ` + y.column + `
Char: ` + y.c), p = new Error(p), y.error = p, Z(y, "onerror", p), y;
    }
    function B(y) {
      return y.sawRoot && !y.closedRoot && N(y, "Unclosed root tag"), y.state !== S.BEGIN && y.state !== S.BEGIN_WHITESPACE && y.state !== S.TEXT && D(y, "Unexpected end"), ce(y), y.c = "", y.closed = !0, Z(y, "onend"), n.call(y, y.strict, y.opt), y;
    }
    function N(y, p) {
      if (typeof y != "object" || !(y instanceof n))
        throw new Error("bad call to strictFail");
      y.strict && D(y, p);
    }
    function q(y) {
      y.strict || (y.tagName = y.tagName[y.looseCase]());
      var p = y.tags[y.tags.length - 1] || y, F = y.tag = { name: y.tagName, attributes: {} };
      y.opt.xmlns && (F.ns = p.ns), y.attribList.length = 0, X(y, "onopentagstart", F);
    }
    function U(y, p) {
      var F = y.indexOf(":"), T = F < 0 ? ["", y] : y.split(":"), se = T[0], pe = T[1];
      return p && y === "xmlns" && (se = "xmlns", pe = ""), { prefix: se, local: pe };
    }
    function V(y) {
      if (y.strict || (y.attribName = y.attribName[y.looseCase]()), y.attribList.indexOf(y.attribName) !== -1 || y.tag.attributes.hasOwnProperty(y.attribName)) {
        y.attribName = y.attribValue = "";
        return;
      }
      if (y.opt.xmlns) {
        var p = U(y.attribName, !0), F = p.prefix, T = p.local;
        if (F === "xmlns")
          if (T === "xml" && y.attribValue !== b)
            N(
              y,
              "xml: prefix must be bound to " + b + `
Actual: ` + y.attribValue
            );
          else if (T === "xmlns" && y.attribValue !== E)
            N(
              y,
              "xmlns: prefix must be bound to " + E + `
Actual: ` + y.attribValue
            );
          else {
            var se = y.tag, pe = y.tags[y.tags.length - 1] || y;
            se.ns === pe.ns && (se.ns = Object.create(pe.ns)), se.ns[T] = y.attribValue;
          }
        y.attribList.push([y.attribName, y.attribValue]);
      } else
        y.tag.attributes[y.attribName] = y.attribValue, X(y, "onattribute", {
          name: y.attribName,
          value: y.attribValue
        });
      y.attribName = y.attribValue = "";
    }
    function ie(y, p) {
      if (y.opt.xmlns) {
        var F = y.tag, T = U(y.tagName);
        F.prefix = T.prefix, F.local = T.local, F.uri = F.ns[T.prefix] || "", F.prefix && !F.uri && (N(y, "Unbound namespace prefix: " + JSON.stringify(y.tagName)), F.uri = T.prefix);
        var se = y.tags[y.tags.length - 1] || y;
        F.ns && se.ns !== F.ns && Object.keys(F.ns).forEach(function(ct) {
          X(y, "onopennamespace", {
            prefix: ct,
            uri: F.ns[ct]
          });
        });
        for (var pe = 0, we = y.attribList.length; pe < we; pe++) {
          var Oe = y.attribList[pe], Ae = Oe[0], mt = Oe[1], ye = U(Ae, !0), rt = ye.prefix, qr = ye.local, Yt = rt === "" ? "" : F.ns[rt] || "", hr = {
            name: Ae,
            value: mt,
            prefix: rt,
            local: qr,
            uri: Yt
          };
          rt && rt !== "xmlns" && !Yt && (N(y, "Unbound namespace prefix: " + JSON.stringify(rt)), hr.uri = rt), y.tag.attributes[Ae] = hr, X(y, "onattribute", hr);
        }
        y.attribList.length = 0;
      }
      y.tag.isSelfClosing = !!p, y.sawRoot = !0, y.tags.push(y.tag), X(y, "onopentag", y.tag), p || (!y.noscript && y.tagName.toLowerCase() === "script" ? y.state = S.SCRIPT : y.state = S.TEXT, y.tag = null, y.tagName = ""), y.attribName = y.attribValue = "", y.attribList.length = 0;
    }
    function ee(y) {
      if (!y.tagName) {
        N(y, "Weird empty close tag."), y.textNode += "</>", y.state = S.TEXT;
        return;
      }
      if (y.script) {
        if (y.tagName !== "script") {
          y.script += "</" + y.tagName + ">", y.tagName = "", y.state = S.SCRIPT;
          return;
        }
        X(y, "onscript", y.script), y.script = "";
      }
      var p = y.tags.length, F = y.tagName;
      y.strict || (F = F[y.looseCase]());
      for (var T = F; p--; ) {
        var se = y.tags[p];
        if (se.name !== T)
          N(y, "Unexpected close tag");
        else
          break;
      }
      if (p < 0) {
        N(y, "Unmatched closing tag: " + y.tagName), y.textNode += "</" + y.tagName + ">", y.state = S.TEXT;
        return;
      }
      y.tagName = F;
      for (var pe = y.tags.length; pe-- > p; ) {
        var we = y.tag = y.tags.pop();
        y.tagName = y.tag.name, X(y, "onclosetag", y.tagName);
        var Oe = {};
        for (var Ae in we.ns)
          Oe[Ae] = we.ns[Ae];
        var mt = y.tags[y.tags.length - 1] || y;
        y.opt.xmlns && we.ns !== mt.ns && Object.keys(we.ns).forEach(function(ye) {
          var rt = we.ns[ye];
          X(y, "onclosenamespace", { prefix: ye, uri: rt });
        });
      }
      p === 0 && (y.closedRoot = !0), y.tagName = y.attribValue = y.attribName = "", y.attribList.length = 0, y.state = S.TEXT;
    }
    function fe(y) {
      var p = y.entity, F = p.toLowerCase(), T, se = "";
      return y.ENTITIES[p] ? y.ENTITIES[p] : y.ENTITIES[F] ? y.ENTITIES[F] : (p = F, p.charAt(0) === "#" && (p.charAt(1) === "x" ? (p = p.slice(2), T = parseInt(p, 16), se = T.toString(16)) : (p = p.slice(1), T = parseInt(p, 10), se = T.toString(10))), p = p.replace(/^0+/, ""), isNaN(T) || se.toLowerCase() !== p ? (N(y, "Invalid character entity"), "&" + y.entity + ";") : String.fromCodePoint(T));
    }
    function Te(y, p) {
      p === "<" ? (y.state = S.OPEN_WAKA, y.startTagPosition = y.position) : x(p) || (N(y, "Non-whitespace before first tag."), y.textNode = p, y.state = S.TEXT);
    }
    function Y(y, p) {
      var F = "";
      return p < y.length && (F = y.charAt(p)), F;
    }
    function Ce(y) {
      var p = this;
      if (this.error)
        throw this.error;
      if (p.closed)
        return D(
          p,
          "Cannot write after close. Assign an onready handler."
        );
      if (y === null)
        return B(p);
      typeof y == "object" && (y = y.toString());
      for (var F = 0, T = ""; T = Y(y, F++), p.c = T, !!T; )
        switch (p.trackPosition && (p.position++, T === `
` ? (p.line++, p.column = 0) : p.column++), p.state) {
          case S.BEGIN:
            if (p.state = S.BEGIN_WHITESPACE, T === "\uFEFF")
              continue;
            Te(p, T);
            continue;
          case S.BEGIN_WHITESPACE:
            Te(p, T);
            continue;
          case S.TEXT:
            if (p.sawRoot && !p.closedRoot) {
              for (var se = F - 1; T && T !== "<" && T !== "&"; )
                T = Y(y, F++), T && p.trackPosition && (p.position++, T === `
` ? (p.line++, p.column = 0) : p.column++);
              p.textNode += y.substring(se, F - 1);
            }
            T === "<" && !(p.sawRoot && p.closedRoot && !p.strict) ? (p.state = S.OPEN_WAKA, p.startTagPosition = p.position) : (!x(T) && (!p.sawRoot || p.closedRoot) && N(p, "Text data outside of root node."), T === "&" ? p.state = S.TEXT_ENTITY : p.textNode += T);
            continue;
          case S.SCRIPT:
            T === "<" ? p.state = S.SCRIPT_ENDING : p.script += T;
            continue;
          case S.SCRIPT_ENDING:
            T === "/" ? p.state = S.CLOSE_TAG : (p.script += "<" + T, p.state = S.SCRIPT);
            continue;
          case S.OPEN_WAKA:
            if (T === "!")
              p.state = S.SGML_DECL, p.sgmlDecl = "";
            else if (!x(T)) if (Q(A, T))
              p.state = S.OPEN_TAG, p.tagName = T;
            else if (T === "/")
              p.state = S.CLOSE_TAG, p.tagName = "";
            else if (T === "?")
              p.state = S.PROC_INST, p.procInstName = p.procInstBody = "";
            else {
              if (N(p, "Unencoded <"), p.startTagPosition + 1 < p.position) {
                var pe = p.position - p.startTagPosition;
                T = new Array(pe).join(" ") + T;
              }
              p.textNode += "<" + T, p.state = S.TEXT;
            }
            continue;
          case S.SGML_DECL:
            if (p.sgmlDecl + T === "--") {
              p.state = S.COMMENT, p.comment = "", p.sgmlDecl = "";
              continue;
            }
            p.doctype && p.doctype !== !0 && p.sgmlDecl ? (p.state = S.DOCTYPE_DTD, p.doctype += "<!" + p.sgmlDecl + T, p.sgmlDecl = "") : (p.sgmlDecl + T).toUpperCase() === h ? (X(p, "onopencdata"), p.state = S.CDATA, p.sgmlDecl = "", p.cdata = "") : (p.sgmlDecl + T).toUpperCase() === m ? (p.state = S.DOCTYPE, (p.doctype || p.sawRoot) && N(
              p,
              "Inappropriately located doctype declaration"
            ), p.doctype = "", p.sgmlDecl = "") : T === ">" ? (X(p, "onsgmldeclaration", p.sgmlDecl), p.sgmlDecl = "", p.state = S.TEXT) : (te(T) && (p.state = S.SGML_DECL_QUOTED), p.sgmlDecl += T);
            continue;
          case S.SGML_DECL_QUOTED:
            T === p.q && (p.state = S.SGML_DECL, p.q = ""), p.sgmlDecl += T;
            continue;
          case S.DOCTYPE:
            T === ">" ? (p.state = S.TEXT, X(p, "ondoctype", p.doctype), p.doctype = !0) : (p.doctype += T, T === "[" ? p.state = S.DOCTYPE_DTD : te(T) && (p.state = S.DOCTYPE_QUOTED, p.q = T));
            continue;
          case S.DOCTYPE_QUOTED:
            p.doctype += T, T === p.q && (p.q = "", p.state = S.DOCTYPE);
            continue;
          case S.DOCTYPE_DTD:
            T === "]" ? (p.doctype += T, p.state = S.DOCTYPE) : T === "<" ? (p.state = S.OPEN_WAKA, p.startTagPosition = p.position) : te(T) ? (p.doctype += T, p.state = S.DOCTYPE_DTD_QUOTED, p.q = T) : p.doctype += T;
            continue;
          case S.DOCTYPE_DTD_QUOTED:
            p.doctype += T, T === p.q && (p.state = S.DOCTYPE_DTD, p.q = "");
            continue;
          case S.COMMENT:
            T === "-" ? p.state = S.COMMENT_ENDING : p.comment += T;
            continue;
          case S.COMMENT_ENDING:
            T === "-" ? (p.state = S.COMMENT_ENDED, p.comment = L(p.opt, p.comment), p.comment && X(p, "oncomment", p.comment), p.comment = "") : (p.comment += "-" + T, p.state = S.COMMENT);
            continue;
          case S.COMMENT_ENDED:
            T !== ">" ? (N(p, "Malformed comment"), p.comment += "--" + T, p.state = S.COMMENT) : p.doctype && p.doctype !== !0 ? p.state = S.DOCTYPE_DTD : p.state = S.TEXT;
            continue;
          case S.CDATA:
            T === "]" ? p.state = S.CDATA_ENDING : p.cdata += T;
            continue;
          case S.CDATA_ENDING:
            T === "]" ? p.state = S.CDATA_ENDING_2 : (p.cdata += "]" + T, p.state = S.CDATA);
            continue;
          case S.CDATA_ENDING_2:
            T === ">" ? (p.cdata && X(p, "oncdata", p.cdata), X(p, "onclosecdata"), p.cdata = "", p.state = S.TEXT) : T === "]" ? p.cdata += "]" : (p.cdata += "]]" + T, p.state = S.CDATA);
            continue;
          case S.PROC_INST:
            T === "?" ? p.state = S.PROC_INST_ENDING : x(T) ? p.state = S.PROC_INST_BODY : p.procInstName += T;
            continue;
          case S.PROC_INST_BODY:
            if (!p.procInstBody && x(T))
              continue;
            T === "?" ? p.state = S.PROC_INST_ENDING : p.procInstBody += T;
            continue;
          case S.PROC_INST_ENDING:
            T === ">" ? (X(p, "onprocessinginstruction", {
              name: p.procInstName,
              body: p.procInstBody
            }), p.procInstName = p.procInstBody = "", p.state = S.TEXT) : (p.procInstBody += "?" + T, p.state = S.PROC_INST_BODY);
            continue;
          case S.OPEN_TAG:
            Q(I, T) ? p.tagName += T : (q(p), T === ">" ? ie(p) : T === "/" ? p.state = S.OPEN_TAG_SLASH : (x(T) || N(p, "Invalid character in tag name"), p.state = S.ATTRIB));
            continue;
          case S.OPEN_TAG_SLASH:
            T === ">" ? (ie(p, !0), ee(p)) : (N(p, "Forward-slash in opening tag not followed by >"), p.state = S.ATTRIB);
            continue;
          case S.ATTRIB:
            if (x(T))
              continue;
            T === ">" ? ie(p) : T === "/" ? p.state = S.OPEN_TAG_SLASH : Q(A, T) ? (p.attribName = T, p.attribValue = "", p.state = S.ATTRIB_NAME) : N(p, "Invalid attribute name");
            continue;
          case S.ATTRIB_NAME:
            T === "=" ? p.state = S.ATTRIB_VALUE : T === ">" ? (N(p, "Attribute without value"), p.attribValue = p.attribName, V(p), ie(p)) : x(T) ? p.state = S.ATTRIB_NAME_SAW_WHITE : Q(I, T) ? p.attribName += T : N(p, "Invalid attribute name");
            continue;
          case S.ATTRIB_NAME_SAW_WHITE:
            if (T === "=")
              p.state = S.ATTRIB_VALUE;
            else {
              if (x(T))
                continue;
              N(p, "Attribute without value"), p.tag.attributes[p.attribName] = "", p.attribValue = "", X(p, "onattribute", {
                name: p.attribName,
                value: ""
              }), p.attribName = "", T === ">" ? ie(p) : Q(A, T) ? (p.attribName = T, p.state = S.ATTRIB_NAME) : (N(p, "Invalid attribute name"), p.state = S.ATTRIB);
            }
            continue;
          case S.ATTRIB_VALUE:
            if (x(T))
              continue;
            te(T) ? (p.q = T, p.state = S.ATTRIB_VALUE_QUOTED) : (p.opt.unquotedAttributeValues || D(p, "Unquoted attribute value"), p.state = S.ATTRIB_VALUE_UNQUOTED, p.attribValue = T);
            continue;
          case S.ATTRIB_VALUE_QUOTED:
            if (T !== p.q) {
              T === "&" ? p.state = S.ATTRIB_VALUE_ENTITY_Q : p.attribValue += T;
              continue;
            }
            V(p), p.q = "", p.state = S.ATTRIB_VALUE_CLOSED;
            continue;
          case S.ATTRIB_VALUE_CLOSED:
            x(T) ? p.state = S.ATTRIB : T === ">" ? ie(p) : T === "/" ? p.state = S.OPEN_TAG_SLASH : Q(A, T) ? (N(p, "No whitespace between attributes"), p.attribName = T, p.attribValue = "", p.state = S.ATTRIB_NAME) : N(p, "Invalid attribute name");
            continue;
          case S.ATTRIB_VALUE_UNQUOTED:
            if (!ae(T)) {
              T === "&" ? p.state = S.ATTRIB_VALUE_ENTITY_U : p.attribValue += T;
              continue;
            }
            V(p), T === ">" ? ie(p) : p.state = S.ATTRIB;
            continue;
          case S.CLOSE_TAG:
            if (p.tagName)
              T === ">" ? ee(p) : Q(I, T) ? p.tagName += T : p.script ? (p.script += "</" + p.tagName, p.tagName = "", p.state = S.SCRIPT) : (x(T) || N(p, "Invalid tagname in closing tag"), p.state = S.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(T))
                continue;
              Ne(A, T) ? p.script ? (p.script += "</" + T, p.state = S.SCRIPT) : N(p, "Invalid tagname in closing tag.") : p.tagName = T;
            }
            continue;
          case S.CLOSE_TAG_SAW_WHITE:
            if (x(T))
              continue;
            T === ">" ? ee(p) : N(p, "Invalid characters in closing tag");
            continue;
          case S.TEXT_ENTITY:
          case S.ATTRIB_VALUE_ENTITY_Q:
          case S.ATTRIB_VALUE_ENTITY_U:
            var we, Oe;
            switch (p.state) {
              case S.TEXT_ENTITY:
                we = S.TEXT, Oe = "textNode";
                break;
              case S.ATTRIB_VALUE_ENTITY_Q:
                we = S.ATTRIB_VALUE_QUOTED, Oe = "attribValue";
                break;
              case S.ATTRIB_VALUE_ENTITY_U:
                we = S.ATTRIB_VALUE_UNQUOTED, Oe = "attribValue";
                break;
            }
            if (T === ";") {
              var Ae = fe(p);
              p.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ae) ? (p.entity = "", p.state = we, p.write(Ae)) : (p[Oe] += Ae, p.entity = "", p.state = we);
            } else Q(p.entity.length ? M : $, T) ? p.entity += T : (N(p, "Invalid character in entity name"), p[Oe] += "&" + p.entity + T, p.entity = "", p.state = we);
            continue;
          default:
            throw new Error(p, "Unknown state: " + p.state);
        }
      return p.position >= p.bufferCheckPosition && i(p), p;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var y = String.fromCharCode, p = Math.floor, F = function() {
        var T = 16384, se = [], pe, we, Oe = -1, Ae = arguments.length;
        if (!Ae)
          return "";
        for (var mt = ""; ++Oe < Ae; ) {
          var ye = Number(arguments[Oe]);
          if (!isFinite(ye) || // `NaN`, `+Infinity`, or `-Infinity`
          ye < 0 || // not a valid Unicode code point
          ye > 1114111 || // not a valid Unicode code point
          p(ye) !== ye)
            throw RangeError("Invalid code point: " + ye);
          ye <= 65535 ? se.push(ye) : (ye -= 65536, pe = (ye >> 10) + 55296, we = ye % 1024 + 56320, se.push(pe, we)), (Oe + 1 === Ae || se.length > T) && (mt += y.apply(null, se), se.length = 0);
        }
        return mt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: F,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = F;
    }();
  })(e);
})(Oh);
Object.defineProperty(bo, "__esModule", { value: !0 });
bo.XElement = void 0;
bo.parseXml = Qb;
const Vb = Oh, Ea = ui;
class Dh {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ea.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Xb(t))
      throw (0, Ea.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Ea.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Ea.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (tf(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => tf(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
bo.XElement = Dh;
const Yb = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Xb(e) {
  return Yb.test(e);
}
function tf(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Qb(e) {
  let t = null;
  const r = Vb.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Dh(i.name);
    if (a.attributes = i.attributes, t === null)
      t = a;
    else {
      const s = n[n.length - 1];
      s.elements == null && (s.elements = []), s.elements.push(a);
    }
    n.push(a);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const a = n[n.length - 1];
    a.value = i, a.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = h;
  var t = Fr;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = ui;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Qe;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = fs;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = yo;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = ds;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var u = wu;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return u.retry;
  } });
  var c = _u;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var g = oi;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return g.UUID;
  } });
  var f = bo;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return f.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return f.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function h(m) {
    return m == null ? [] : Array.isArray(m) ? m : [m];
  }
})(Be);
var je = {}, Eu = {}, It = {};
function Nh(e) {
  return typeof e > "u" || e === null;
}
function Kb(e) {
  return typeof e == "object" && e !== null;
}
function Jb(e) {
  return Array.isArray(e) ? e : Nh(e) ? [] : [e];
}
function Zb(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function ew(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function tw(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
It.isNothing = Nh;
It.isObject = Kb;
It.toArray = Jb;
It.repeat = ew;
It.isNegativeZero = tw;
It.extend = Zb;
function Fh(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function eo(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Fh(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
eo.prototype = Object.create(Error.prototype);
eo.prototype.constructor = eo;
eo.prototype.toString = function(t) {
  return this.name + ": " + Fh(this, t);
};
var wo = eo, Ui = It;
function hl(e, t, r, n, i) {
  var a = "", s = "", u = Math.floor(i / 2) - 1;
  return n - t > u && (a = " ... ", t = n - u + a.length), r - n > u && (s = " ...", r = n + u - s.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + a.length
    // relative position
  };
}
function pl(e, t) {
  return Ui.repeat(" ", t - e.length) + e;
}
function rw(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var u = "", c, g, f = Math.min(e.line + t.linesAfter, i.length).toString().length, h = t.maxLength - (t.indent + f + 3);
  for (c = 1; c <= t.linesBefore && !(s - c < 0); c++)
    g = hl(
      e.buffer,
      n[s - c],
      i[s - c],
      e.position - (n[s] - n[s - c]),
      h
    ), u = Ui.repeat(" ", t.indent) + pl((e.line - c + 1).toString(), f) + " | " + g.str + `
` + u;
  for (g = hl(e.buffer, n[s], i[s], e.position, h), u += Ui.repeat(" ", t.indent) + pl((e.line + 1).toString(), f) + " | " + g.str + `
`, u += Ui.repeat("-", t.indent + f + 3 + g.pos) + `^
`, c = 1; c <= t.linesAfter && !(s + c >= i.length); c++)
    g = hl(
      e.buffer,
      n[s + c],
      i[s + c],
      e.position - (n[s] - n[s + c]),
      h
    ), u += Ui.repeat(" ", t.indent) + pl((e.line + c + 1).toString(), f) + " | " + g.str + `
`;
  return u.replace(/\n$/, "");
}
var nw = rw, rf = wo, iw = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], ow = [
  "scalar",
  "sequence",
  "mapping"
];
function aw(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function sw(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (iw.indexOf(r) === -1)
      throw new rf('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = aw(t.styleAliases || null), ow.indexOf(this.kind) === -1)
    throw new rf('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var et = sw, Ni = wo, ml = et;
function nf(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function lw() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function Gl(e) {
  return this.extend(e);
}
Gl.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof ml)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Ni("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof ml))
      throw new Ni("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new Ni("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new Ni("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof ml))
      throw new Ni("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Gl.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = nf(i, "implicit"), i.compiledExplicit = nf(i, "explicit"), i.compiledTypeMap = lw(i.compiledImplicit, i.compiledExplicit), i;
};
var kh = Gl, uw = et, Lh = new uw("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), cw = et, xh = new cw("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), fw = et, Uh = new fw("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), dw = kh, Bh = new dw({
  explicit: [
    Lh,
    xh,
    Uh
  ]
}), hw = et;
function pw(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function mw() {
  return null;
}
function gw(e) {
  return e === null;
}
var Mh = new hw("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: pw,
  construct: mw,
  predicate: gw,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), yw = et;
function bw(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function ww(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function _w(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var qh = new yw("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: bw,
  construct: ww,
  predicate: _w,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), Ew = It, Sw = et;
function vw(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Cw(e) {
  return 48 <= e && e <= 55;
}
function Rw(e) {
  return 48 <= e && e <= 57;
}
function Tw(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!vw(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!Cw(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!Rw(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function Aw(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function Pw(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Ew.isNegativeZero(e);
}
var jh = new Sw("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Tw,
  construct: Aw,
  predicate: Pw,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Wh = It, Iw = et, $w = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Ow(e) {
  return !(e === null || !$w.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function Dw(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Nw = /^[-+]?[0-9]+e/;
function Fw(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Wh.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), Nw.test(r) ? r.replace("e", ".e") : r;
}
function kw(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Wh.isNegativeZero(e));
}
var Hh = new Iw("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Ow,
  construct: Dw,
  predicate: kw,
  represent: Fw,
  defaultStyle: "lowercase"
}), zh = Bh.extend({
  implicit: [
    Mh,
    qh,
    jh,
    Hh
  ]
}), Gh = zh, Lw = et, Vh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Yh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function xw(e) {
  return e === null ? !1 : Vh.exec(e) !== null || Yh.exec(e) !== null;
}
function Uw(e) {
  var t, r, n, i, a, s, u, c = 0, g = null, f, h, m;
  if (t = Vh.exec(e), t === null && (t = Yh.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], u = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (f = +t[10], h = +(t[11] || 0), g = (f * 60 + h) * 6e4, t[9] === "-" && (g = -g)), m = new Date(Date.UTC(r, n, i, a, s, u, c)), g && m.setTime(m.getTime() - g), m;
}
function Bw(e) {
  return e.toISOString();
}
var Xh = new Lw("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: xw,
  construct: Uw,
  instanceOf: Date,
  represent: Bw
}), Mw = et;
function qw(e) {
  return e === "<<" || e === null;
}
var Qh = new Mw("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: qw
}), jw = et, Su = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Ww(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = Su;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Hw(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = Su, s = 0, u = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (u.push(s >> 16 & 255), u.push(s >> 8 & 255), u.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (u.push(s >> 16 & 255), u.push(s >> 8 & 255), u.push(s & 255)) : r === 18 ? (u.push(s >> 10 & 255), u.push(s >> 2 & 255)) : r === 12 && u.push(s >> 4 & 255), new Uint8Array(u);
}
function zw(e) {
  var t = "", r = 0, n, i, a = e.length, s = Su;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function Gw(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Kh = new jw("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Ww,
  construct: Hw,
  predicate: Gw,
  represent: zw
}), Vw = et, Yw = Object.prototype.hasOwnProperty, Xw = Object.prototype.toString;
function Qw(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, u = e;
  for (r = 0, n = u.length; r < n; r += 1) {
    if (i = u[r], s = !1, Xw.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (Yw.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function Kw(e) {
  return e !== null ? e : [];
}
var Jh = new Vw("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Qw,
  construct: Kw
}), Jw = et, Zw = Object.prototype.toString;
function e_(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], Zw.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function t_(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Zh = new Jw("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: e_,
  construct: t_
}), r_ = et, n_ = Object.prototype.hasOwnProperty;
function i_(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (n_.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function o_(e) {
  return e !== null ? e : {};
}
var ep = new r_("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: i_,
  construct: o_
}), vu = Gh.extend({
  implicit: [
    Xh,
    Qh
  ],
  explicit: [
    Kh,
    Jh,
    Zh,
    ep
  ]
}), on = It, tp = wo, a_ = nw, s_ = vu, kr = Object.prototype.hasOwnProperty, Xa = 1, rp = 2, np = 3, Qa = 4, gl = 1, l_ = 2, of = 3, u_ = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, c_ = /[\x85\u2028\u2029]/, f_ = /[,\[\]\{\}]/, ip = /^(?:!|!!|![a-z\-]+!)$/i, op = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function af(e) {
  return Object.prototype.toString.call(e);
}
function Gt(e) {
  return e === 10 || e === 13;
}
function un(e) {
  return e === 9 || e === 32;
}
function ut(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Yn(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function d_(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function h_(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function p_(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function sf(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function m_(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var ap = new Array(256), sp = new Array(256);
for (var qn = 0; qn < 256; qn++)
  ap[qn] = sf(qn) ? 1 : 0, sp[qn] = sf(qn);
function g_(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || s_, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function lp(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = a_(r), new tp(t, r);
}
function H(e, t) {
  throw lp(e, t);
}
function Ka(e, t) {
  e.onWarning && e.onWarning.call(null, lp(e, t));
}
var lf = {
  YAML: function(t, r, n) {
    var i, a, s;
    t.version !== null && H(t, "duplication of %YAML directive"), n.length !== 1 && H(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && H(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), s = parseInt(i[2], 10), a !== 1 && H(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Ka(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && H(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], ip.test(i) || H(t, "ill-formed tag handle (first argument) of the TAG directive"), kr.call(t.tagMap, i) && H(t, 'there is a previously declared suffix for "' + i + '" tag handle'), op.test(a) || H(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      a = decodeURIComponent(a);
    } catch {
      H(t, "tag prefix is malformed: " + a);
    }
    t.tagMap[i] = a;
  }
};
function Dr(e, t, r, n) {
  var i, a, s, u;
  if (t < r) {
    if (u = e.input.slice(t, r), n)
      for (i = 0, a = u.length; i < a; i += 1)
        s = u.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || H(e, "expected valid JSON character");
    else u_.test(u) && H(e, "the stream contains non-printable characters");
    e.result += u;
  }
}
function uf(e, t, r, n) {
  var i, a, s, u;
  for (on.isObject(r) || H(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, u = i.length; s < u; s += 1)
    a = i[s], kr.call(t, a) || (t[a] = r[a], n[a] = !0);
}
function Xn(e, t, r, n, i, a, s, u, c) {
  var g, f;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), g = 0, f = i.length; g < f; g += 1)
      Array.isArray(i[g]) && H(e, "nested arrays are not supported inside keys"), typeof i == "object" && af(i[g]) === "[object Object]" && (i[g] = "[object Object]");
  if (typeof i == "object" && af(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (g = 0, f = a.length; g < f; g += 1)
        uf(e, t, a[g], r);
    else
      uf(e, t, a, r);
  else
    !e.json && !kr.call(r, i) && kr.call(t, i) && (e.line = s || e.line, e.lineStart = u || e.lineStart, e.position = c || e.position, H(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: a
    }) : t[i] = a, delete r[i];
  return t;
}
function Cu(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : H(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function $e(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; un(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Gt(i))
      for (Cu(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Ka(e, "deficient indentation"), n;
}
function hs(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || ut(r)));
}
function Ru(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += on.repeat(`
`, t - 1));
}
function y_(e, t, r) {
  var n, i, a, s, u, c, g, f, h = e.kind, m = e.result, b;
  if (b = e.input.charCodeAt(e.position), ut(b) || Yn(b) || b === 35 || b === 38 || b === 42 || b === 33 || b === 124 || b === 62 || b === 39 || b === 34 || b === 37 || b === 64 || b === 96 || (b === 63 || b === 45) && (i = e.input.charCodeAt(e.position + 1), ut(i) || r && Yn(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, u = !1; b !== 0; ) {
    if (b === 58) {
      if (i = e.input.charCodeAt(e.position + 1), ut(i) || r && Yn(i))
        break;
    } else if (b === 35) {
      if (n = e.input.charCodeAt(e.position - 1), ut(n))
        break;
    } else {
      if (e.position === e.lineStart && hs(e) || r && Yn(b))
        break;
      if (Gt(b))
        if (c = e.line, g = e.lineStart, f = e.lineIndent, $e(e, !1, -1), e.lineIndent >= t) {
          u = !0, b = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = c, e.lineStart = g, e.lineIndent = f;
          break;
        }
    }
    u && (Dr(e, a, s, !1), Ru(e, e.line - c), a = s = e.position, u = !1), un(b) || (s = e.position + 1), b = e.input.charCodeAt(++e.position);
  }
  return Dr(e, a, s, !1), e.result ? !0 : (e.kind = h, e.result = m, !1);
}
function b_(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (Dr(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Gt(r) ? (Dr(e, n, i, !0), Ru(e, $e(e, !1, t)), n = i = e.position) : e.position === e.lineStart && hs(e) ? H(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  H(e, "unexpected end of the stream within a single quoted scalar");
}
function w_(e, t) {
  var r, n, i, a, s, u;
  if (u = e.input.charCodeAt(e.position), u !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (u = e.input.charCodeAt(e.position)) !== 0; ) {
    if (u === 34)
      return Dr(e, r, e.position, !0), e.position++, !0;
    if (u === 92) {
      if (Dr(e, r, e.position, !0), u = e.input.charCodeAt(++e.position), Gt(u))
        $e(e, !1, t);
      else if (u < 256 && ap[u])
        e.result += sp[u], e.position++;
      else if ((s = h_(u)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          u = e.input.charCodeAt(++e.position), (s = d_(u)) >= 0 ? a = (a << 4) + s : H(e, "expected hexadecimal character");
        e.result += m_(a), e.position++;
      } else
        H(e, "unknown escape sequence");
      r = n = e.position;
    } else Gt(u) ? (Dr(e, r, n, !0), Ru(e, $e(e, !1, t)), r = n = e.position) : e.position === e.lineStart && hs(e) ? H(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  H(e, "unexpected end of the stream within a double quoted scalar");
}
function __(e, t) {
  var r = !0, n, i, a, s = e.tag, u, c = e.anchor, g, f, h, m, b, E = /* @__PURE__ */ Object.create(null), C, A, I, $;
  if ($ = e.input.charCodeAt(e.position), $ === 91)
    f = 93, b = !1, u = [];
  else if ($ === 123)
    f = 125, b = !0, u = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), $ = e.input.charCodeAt(++e.position); $ !== 0; ) {
    if ($e(e, !0, t), $ = e.input.charCodeAt(e.position), $ === f)
      return e.position++, e.tag = s, e.anchor = c, e.kind = b ? "mapping" : "sequence", e.result = u, !0;
    r ? $ === 44 && H(e, "expected the node content, but found ','") : H(e, "missed comma between flow collection entries"), A = C = I = null, h = m = !1, $ === 63 && (g = e.input.charCodeAt(e.position + 1), ut(g) && (h = m = !0, e.position++, $e(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, ai(e, t, Xa, !1, !0), A = e.tag, C = e.result, $e(e, !0, t), $ = e.input.charCodeAt(e.position), (m || e.line === n) && $ === 58 && (h = !0, $ = e.input.charCodeAt(++e.position), $e(e, !0, t), ai(e, t, Xa, !1, !0), I = e.result), b ? Xn(e, u, E, A, C, I, n, i, a) : h ? u.push(Xn(e, null, E, A, C, I, n, i, a)) : u.push(C), $e(e, !0, t), $ = e.input.charCodeAt(e.position), $ === 44 ? (r = !0, $ = e.input.charCodeAt(++e.position)) : r = !1;
  }
  H(e, "unexpected end of the stream within a flow collection");
}
function E_(e, t) {
  var r, n, i = gl, a = !1, s = !1, u = t, c = 0, g = !1, f, h;
  if (h = e.input.charCodeAt(e.position), h === 124)
    n = !1;
  else if (h === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; h !== 0; )
    if (h = e.input.charCodeAt(++e.position), h === 43 || h === 45)
      gl === i ? i = h === 43 ? of : l_ : H(e, "repeat of a chomping mode identifier");
    else if ((f = p_(h)) >= 0)
      f === 0 ? H(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? H(e, "repeat of an indentation width identifier") : (u = t + f - 1, s = !0);
    else
      break;
  if (un(h)) {
    do
      h = e.input.charCodeAt(++e.position);
    while (un(h));
    if (h === 35)
      do
        h = e.input.charCodeAt(++e.position);
      while (!Gt(h) && h !== 0);
  }
  for (; h !== 0; ) {
    for (Cu(e), e.lineIndent = 0, h = e.input.charCodeAt(e.position); (!s || e.lineIndent < u) && h === 32; )
      e.lineIndent++, h = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > u && (u = e.lineIndent), Gt(h)) {
      c++;
      continue;
    }
    if (e.lineIndent < u) {
      i === of ? e.result += on.repeat(`
`, a ? 1 + c : c) : i === gl && a && (e.result += `
`);
      break;
    }
    for (n ? un(h) ? (g = !0, e.result += on.repeat(`
`, a ? 1 + c : c)) : g ? (g = !1, e.result += on.repeat(`
`, c + 1)) : c === 0 ? a && (e.result += " ") : e.result += on.repeat(`
`, c) : e.result += on.repeat(`
`, a ? 1 + c : c), a = !0, s = !0, c = 0, r = e.position; !Gt(h) && h !== 0; )
      h = e.input.charCodeAt(++e.position);
    Dr(e, r, e.position, !1);
  }
  return !0;
}
function cf(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, u = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), !(c !== 45 || (s = e.input.charCodeAt(e.position + 1), !ut(s)))); ) {
    if (u = !0, e.position++, $e(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, ai(e, t, np, !1, !0), a.push(e.result), $e(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      H(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return u ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function S_(e, t, r) {
  var n, i, a, s, u, c, g = e.tag, f = e.anchor, h = {}, m = /* @__PURE__ */ Object.create(null), b = null, E = null, C = null, A = !1, I = !1, $;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = h), $ = e.input.charCodeAt(e.position); $ !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, ($ === 63 || $ === 58) && ut(n))
      $ === 63 ? (A && (Xn(e, h, m, b, E, null, s, u, c), b = E = C = null), I = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : H(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, $ = n;
    else {
      if (s = e.line, u = e.lineStart, c = e.position, !ai(e, r, rp, !1, !0))
        break;
      if (e.line === a) {
        for ($ = e.input.charCodeAt(e.position); un($); )
          $ = e.input.charCodeAt(++e.position);
        if ($ === 58)
          $ = e.input.charCodeAt(++e.position), ut($) || H(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (Xn(e, h, m, b, E, null, s, u, c), b = E = C = null), I = !0, A = !1, i = !1, b = e.tag, E = e.result;
        else if (I)
          H(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = g, e.anchor = f, !0;
      } else if (I)
        H(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = g, e.anchor = f, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (A && (s = e.line, u = e.lineStart, c = e.position), ai(e, t, Qa, !0, i) && (A ? E = e.result : C = e.result), A || (Xn(e, h, m, b, E, C, s, u, c), b = E = C = null), $e(e, !0, -1), $ = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && $ !== 0)
      H(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && Xn(e, h, m, b, E, null, s, u, c), I && (e.tag = g, e.anchor = f, e.kind = "mapping", e.result = h), I;
}
function v_(e) {
  var t, r = !1, n = !1, i, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && H(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : H(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !ut(s); )
      s === 33 && (n ? H(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), ip.test(i) || H(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), f_.test(a) && H(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !op.test(a) && H(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    H(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : kr.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : H(e, 'undeclared tag handle "' + i + '"'), !0;
}
function C_(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && H(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !ut(r) && !Yn(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && H(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function R_(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !ut(n) && !Yn(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && H(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), kr.call(e.anchorMap, r) || H(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], $e(e, !0, -1), !0;
}
function ai(e, t, r, n, i) {
  var a, s, u, c = 1, g = !1, f = !1, h, m, b, E, C, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = u = Qa === r || np === r, n && $e(e, !0, -1) && (g = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; v_(e) || C_(e); )
      $e(e, !0, -1) ? (g = !0, u = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : u = !1;
  if (u && (u = g || i), (c === 1 || Qa === r) && (Xa === r || rp === r ? C = t : C = t + 1, A = e.position - e.lineStart, c === 1 ? u && (cf(e, A) || S_(e, A, C)) || __(e, C) ? f = !0 : (s && E_(e, C) || b_(e, C) || w_(e, C) ? f = !0 : R_(e) ? (f = !0, (e.tag !== null || e.anchor !== null) && H(e, "alias node should not have any properties")) : y_(e, C, Xa === r) && (f = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (f = u && cf(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && H(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), h = 0, m = e.implicitTypes.length; h < m; h += 1)
      if (E = e.implicitTypes[h], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (kr.call(e.typeMap[e.kind || "fallback"], e.tag))
      E = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (E = null, b = e.typeMap.multi[e.kind || "fallback"], h = 0, m = b.length; h < m; h += 1)
        if (e.tag.slice(0, b[h].tag.length) === b[h].tag) {
          E = b[h];
          break;
        }
    E || H(e, "unknown tag !<" + e.tag + ">"), e.result !== null && E.kind !== e.kind && H(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + E.kind + '", not "' + e.kind + '"'), E.resolve(e.result, e.tag) ? (e.result = E.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : H(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || f;
}
function T_(e) {
  var t = e.position, r, n, i, a = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && ($e(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (a = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !ut(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && H(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; un(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !Gt(s));
        break;
      }
      if (Gt(s)) break;
      for (r = e.position; s !== 0 && !ut(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && Cu(e), kr.call(lf, n) ? lf[n](e, n, i) : Ka(e, 'unknown document directive "' + n + '"');
  }
  if ($e(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, $e(e, !0, -1)) : a && H(e, "directives end mark is expected"), ai(e, e.lineIndent - 1, Qa, !1, !0), $e(e, !0, -1), e.checkLineBreaks && c_.test(e.input.slice(t, e.position)) && Ka(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && hs(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, $e(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    H(e, "end of the stream or a document separator is expected");
  else
    return;
}
function up(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new g_(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, H(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    T_(r);
  return r.documents;
}
function A_(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = up(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function P_(e, t) {
  var r = up(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new tp("expected a single document in the stream, but found more");
  }
}
Eu.loadAll = A_;
Eu.load = P_;
var cp = {}, ps = It, _o = wo, I_ = vu, fp = Object.prototype.toString, dp = Object.prototype.hasOwnProperty, Tu = 65279, $_ = 9, to = 10, O_ = 13, D_ = 32, N_ = 33, F_ = 34, Vl = 35, k_ = 37, L_ = 38, x_ = 39, U_ = 42, hp = 44, B_ = 45, Ja = 58, M_ = 61, q_ = 62, j_ = 63, W_ = 64, pp = 91, mp = 93, H_ = 96, gp = 123, z_ = 124, yp = 125, Ge = {};
Ge[0] = "\\0";
Ge[7] = "\\a";
Ge[8] = "\\b";
Ge[9] = "\\t";
Ge[10] = "\\n";
Ge[11] = "\\v";
Ge[12] = "\\f";
Ge[13] = "\\r";
Ge[27] = "\\e";
Ge[34] = '\\"';
Ge[92] = "\\\\";
Ge[133] = "\\N";
Ge[160] = "\\_";
Ge[8232] = "\\L";
Ge[8233] = "\\P";
var G_ = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], V_ = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Y_(e, t) {
  var r, n, i, a, s, u, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], u = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), c = e.compiledTypeMap.fallback[s], c && dp.call(c.styleAliases, u) && (u = c.styleAliases[u]), r[s] = u;
  return r;
}
function X_(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new _o("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ps.repeat("0", n - t.length) + t;
}
var Q_ = 1, ro = 2;
function K_(e) {
  this.schema = e.schema || I_, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ps.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Y_(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? ro : Q_, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function ff(e, t) {
  for (var r = ps.repeat(" ", t), n = 0, i = -1, a = "", s, u = e.length; n < u; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = u) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (a += r), a += s;
  return a;
}
function Yl(e, t) {
  return `
` + ps.repeat(" ", e.indent * t);
}
function J_(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Za(e) {
  return e === D_ || e === $_;
}
function no(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Tu || 65536 <= e && e <= 1114111;
}
function df(e) {
  return no(e) && e !== Tu && e !== O_ && e !== to;
}
function hf(e, t, r) {
  var n = df(e), i = n && !Za(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== hp && e !== pp && e !== mp && e !== gp && e !== yp) && e !== Vl && !(t === Ja && !i) || df(t) && !Za(t) && e === Vl || t === Ja && i
  );
}
function Z_(e) {
  return no(e) && e !== Tu && !Za(e) && e !== B_ && e !== j_ && e !== Ja && e !== hp && e !== pp && e !== mp && e !== gp && e !== yp && e !== Vl && e !== L_ && e !== U_ && e !== N_ && e !== z_ && e !== M_ && e !== q_ && e !== x_ && e !== F_ && e !== k_ && e !== W_ && e !== H_;
}
function eE(e) {
  return !Za(e) && e !== Ja;
}
function Bi(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function bp(e) {
  var t = /^\n* /;
  return t.test(e);
}
var wp = 1, Xl = 2, _p = 3, Ep = 4, Vn = 5;
function tE(e, t, r, n, i, a, s, u) {
  var c, g = 0, f = null, h = !1, m = !1, b = n !== -1, E = -1, C = Z_(Bi(e, 0)) && eE(Bi(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; g >= 65536 ? c += 2 : c++) {
      if (g = Bi(e, c), !no(g))
        return Vn;
      C = C && hf(g, f, u), f = g;
    }
  else {
    for (c = 0; c < e.length; g >= 65536 ? c += 2 : c++) {
      if (g = Bi(e, c), g === to)
        h = !0, b && (m = m || // Foldable line = too long, and not more-indented.
        c - E - 1 > n && e[E + 1] !== " ", E = c);
      else if (!no(g))
        return Vn;
      C = C && hf(g, f, u), f = g;
    }
    m = m || b && c - E - 1 > n && e[E + 1] !== " ";
  }
  return !h && !m ? C && !s && !i(e) ? wp : a === ro ? Vn : Xl : r > 9 && bp(e) ? Vn : s ? a === ro ? Vn : Xl : m ? Ep : _p;
}
function rE(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === ro ? '""' : "''";
    if (!e.noCompatMode && (G_.indexOf(t) !== -1 || V_.test(t)))
      return e.quotingType === ro ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), u = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(g) {
      return J_(e, g);
    }
    switch (tE(
      t,
      u,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case wp:
        return t;
      case Xl:
        return "'" + t.replace(/'/g, "''") + "'";
      case _p:
        return "|" + pf(t, e.indent) + mf(ff(t, a));
      case Ep:
        return ">" + pf(t, e.indent) + mf(ff(nE(t, s), a));
      case Vn:
        return '"' + iE(t) + '"';
      default:
        throw new _o("impossible error: invalid scalar style");
    }
  }();
}
function pf(e, t) {
  var r = bp(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), a = i ? "+" : n ? "" : "-";
  return r + a + `
`;
}
function mf(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function nE(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var g = e.indexOf(`
`);
    return g = g !== -1 ? g : e.length, r.lastIndex = g, gf(e.slice(0, g), t);
  }(), i = e[0] === `
` || e[0] === " ", a, s; s = r.exec(e); ) {
    var u = s[1], c = s[2];
    a = c[0] === " ", n += u + (!i && !a && c !== "" ? `
` : "") + gf(c, t), i = a;
  }
  return n;
}
function gf(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, s = 0, u = 0, c = ""; n = r.exec(e); )
    u = n.index, u - i > t && (a = s > i ? s : u, c += `
` + e.slice(i, a), i = a + 1), s = u;
  return c += `
`, e.length - i > t && s > i ? c += e.slice(i, s) + `
` + e.slice(s + 1) : c += e.slice(i), c.slice(1);
}
function iE(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Bi(e, i), n = Ge[r], !n && no(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || X_(r);
  return t;
}
function oE(e, t, r) {
  var n = "", i = e.tag, a, s, u;
  for (a = 0, s = r.length; a < s; a += 1)
    u = r[a], e.replacer && (u = e.replacer.call(r, String(a), u)), (fr(e, t, u, !1, !1) || typeof u > "u" && fr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function yf(e, t, r, n) {
  var i = "", a = e.tag, s, u, c;
  for (s = 0, u = r.length; s < u; s += 1)
    c = r[s], e.replacer && (c = e.replacer.call(r, String(s), c)), (fr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && fr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Yl(e, t)), e.dump && to === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function aE(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, u, c, g, f;
  for (s = 0, u = a.length; s < u; s += 1)
    f = "", n !== "" && (f += ", "), e.condenseFlow && (f += '"'), c = a[s], g = r[c], e.replacer && (g = e.replacer.call(r, c, g)), fr(e, t, c, !1, !1) && (e.dump.length > 1024 && (f += "? "), f += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), fr(e, t, g, !1, !1) && (f += e.dump, n += f));
  e.tag = i, e.dump = "{" + n + "}";
}
function sE(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), u, c, g, f, h, m;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new _o("sortKeys must be a boolean or a function");
  for (u = 0, c = s.length; u < c; u += 1)
    m = "", (!n || i !== "") && (m += Yl(e, t)), g = s[u], f = r[g], e.replacer && (f = e.replacer.call(r, g, f)), fr(e, t + 1, g, !0, !0, !0) && (h = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, h && (e.dump && to === e.dump.charCodeAt(0) ? m += "?" : m += "? "), m += e.dump, h && (m += Yl(e, t)), fr(e, t + 1, f, !0, h) && (e.dump && to === e.dump.charCodeAt(0) ? m += ":" : m += ": ", m += e.dump, i += m));
  e.tag = a, e.dump = i || "{}";
}
function bf(e, t, r) {
  var n, i, a, s, u, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, s = i.length; a < s; a += 1)
    if (u = i[a], (u.instanceOf || u.predicate) && (!u.instanceOf || typeof t == "object" && t instanceof u.instanceOf) && (!u.predicate || u.predicate(t))) {
      if (r ? u.multi && u.representName ? e.tag = u.representName(t) : e.tag = u.tag : e.tag = "?", u.represent) {
        if (c = e.styleMap[u.tag] || u.defaultStyle, fp.call(u.represent) === "[object Function]")
          n = u.represent(t, c);
        else if (dp.call(u.represent, c))
          n = u.represent[c](t, c);
        else
          throw new _o("!<" + u.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function fr(e, t, r, n, i, a, s) {
  e.tag = null, e.dump = r, bf(e, r, !1) || bf(e, r, !0);
  var u = fp.call(e.dump), c = n, g;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var f = u === "[object Object]" || u === "[object Array]", h, m;
  if (f && (h = e.duplicates.indexOf(r), m = h !== -1), (e.tag !== null && e.tag !== "?" || m || e.indent !== 2 && t > 0) && (i = !1), m && e.usedDuplicates[h])
    e.dump = "*ref_" + h;
  else {
    if (f && m && !e.usedDuplicates[h] && (e.usedDuplicates[h] = !0), u === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (sE(e, t, e.dump, i), m && (e.dump = "&ref_" + h + e.dump)) : (aE(e, t, e.dump), m && (e.dump = "&ref_" + h + " " + e.dump));
    else if (u === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? yf(e, t - 1, e.dump, i) : yf(e, t, e.dump, i), m && (e.dump = "&ref_" + h + e.dump)) : (oE(e, t, e.dump), m && (e.dump = "&ref_" + h + " " + e.dump));
    else if (u === "[object String]")
      e.tag !== "?" && rE(e, e.dump, t, a, c);
    else {
      if (u === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new _o("unacceptable kind of an object to dump " + u);
    }
    e.tag !== null && e.tag !== "?" && (g = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? g = "!" + g : g.slice(0, 18) === "tag:yaml.org,2002:" ? g = "!!" + g.slice(18) : g = "!<" + g + ">", e.dump = g + " " + e.dump);
  }
  return !0;
}
function lE(e, t) {
  var r = [], n = [], i, a;
  for (Ql(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function Ql(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        Ql(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        Ql(e[n[i]], t, r);
}
function uE(e, t) {
  t = t || {};
  var r = new K_(t);
  r.noRefs || lE(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), fr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
cp.dump = uE;
var Sp = Eu, cE = cp;
function Au(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
je.Type = et;
je.Schema = kh;
je.FAILSAFE_SCHEMA = Bh;
je.JSON_SCHEMA = zh;
je.CORE_SCHEMA = Gh;
je.DEFAULT_SCHEMA = vu;
je.load = Sp.load;
je.loadAll = Sp.loadAll;
je.dump = cE.dump;
je.YAMLException = wo;
je.types = {
  binary: Kh,
  float: Hh,
  map: Uh,
  null: Mh,
  pairs: Zh,
  set: ep,
  timestamp: Xh,
  bool: qh,
  int: jh,
  merge: Qh,
  omap: Jh,
  seq: xh,
  str: Lh
};
je.safeLoad = Au("safeLoad", "load");
je.safeLoadAll = Au("safeLoadAll", "loadAll");
je.safeDump = Au("safeDump", "dump");
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
ms.Lazy = void 0;
class fE {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
ms.Lazy = fE;
var Kl = { exports: {} };
const dE = "2.0.0", vp = 256, hE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, pE = 16, mE = vp - 6, gE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var gs = {
  MAX_LENGTH: vp,
  MAX_SAFE_COMPONENT_LENGTH: pE,
  MAX_SAFE_BUILD_LENGTH: mE,
  MAX_SAFE_INTEGER: hE,
  RELEASE_TYPES: gE,
  SEMVER_SPEC_VERSION: dE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const yE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ys = yE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = gs, a = ys;
  t = e.exports = {};
  const s = t.re = [], u = t.safeRe = [], c = t.src = [], g = t.safeSrc = [], f = t.t = {};
  let h = 0;
  const m = "[a-zA-Z0-9-]", b = [
    ["\\s", 1],
    ["\\d", i],
    [m, n]
  ], E = (A) => {
    for (const [I, $] of b)
      A = A.split(`${I}*`).join(`${I}{0,${$}}`).split(`${I}+`).join(`${I}{1,${$}}`);
    return A;
  }, C = (A, I, $) => {
    const M = E(I), x = h++;
    a(A, x, I), f[A] = x, c[x] = I, g[x] = M, s[x] = new RegExp(I, $ ? "g" : void 0), u[x] = new RegExp(M, $ ? "g" : void 0);
  };
  C("NUMERICIDENTIFIER", "0|[1-9]\\d*"), C("NUMERICIDENTIFIERLOOSE", "\\d+"), C("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${m}*`), C("MAINVERSION", `(${c[f.NUMERICIDENTIFIER]})\\.(${c[f.NUMERICIDENTIFIER]})\\.(${c[f.NUMERICIDENTIFIER]})`), C("MAINVERSIONLOOSE", `(${c[f.NUMERICIDENTIFIERLOOSE]})\\.(${c[f.NUMERICIDENTIFIERLOOSE]})\\.(${c[f.NUMERICIDENTIFIERLOOSE]})`), C("PRERELEASEIDENTIFIER", `(?:${c[f.NONNUMERICIDENTIFIER]}|${c[f.NUMERICIDENTIFIER]})`), C("PRERELEASEIDENTIFIERLOOSE", `(?:${c[f.NONNUMERICIDENTIFIER]}|${c[f.NUMERICIDENTIFIERLOOSE]})`), C("PRERELEASE", `(?:-(${c[f.PRERELEASEIDENTIFIER]}(?:\\.${c[f.PRERELEASEIDENTIFIER]})*))`), C("PRERELEASELOOSE", `(?:-?(${c[f.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[f.PRERELEASEIDENTIFIERLOOSE]})*))`), C("BUILDIDENTIFIER", `${m}+`), C("BUILD", `(?:\\+(${c[f.BUILDIDENTIFIER]}(?:\\.${c[f.BUILDIDENTIFIER]})*))`), C("FULLPLAIN", `v?${c[f.MAINVERSION]}${c[f.PRERELEASE]}?${c[f.BUILD]}?`), C("FULL", `^${c[f.FULLPLAIN]}$`), C("LOOSEPLAIN", `[v=\\s]*${c[f.MAINVERSIONLOOSE]}${c[f.PRERELEASELOOSE]}?${c[f.BUILD]}?`), C("LOOSE", `^${c[f.LOOSEPLAIN]}$`), C("GTLT", "((?:<|>)?=?)"), C("XRANGEIDENTIFIERLOOSE", `${c[f.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), C("XRANGEIDENTIFIER", `${c[f.NUMERICIDENTIFIER]}|x|X|\\*`), C("XRANGEPLAIN", `[v=\\s]*(${c[f.XRANGEIDENTIFIER]})(?:\\.(${c[f.XRANGEIDENTIFIER]})(?:\\.(${c[f.XRANGEIDENTIFIER]})(?:${c[f.PRERELEASE]})?${c[f.BUILD]}?)?)?`), C("XRANGEPLAINLOOSE", `[v=\\s]*(${c[f.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[f.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[f.XRANGEIDENTIFIERLOOSE]})(?:${c[f.PRERELEASELOOSE]})?${c[f.BUILD]}?)?)?`), C("XRANGE", `^${c[f.GTLT]}\\s*${c[f.XRANGEPLAIN]}$`), C("XRANGELOOSE", `^${c[f.GTLT]}\\s*${c[f.XRANGEPLAINLOOSE]}$`), C("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), C("COERCE", `${c[f.COERCEPLAIN]}(?:$|[^\\d])`), C("COERCEFULL", c[f.COERCEPLAIN] + `(?:${c[f.PRERELEASE]})?(?:${c[f.BUILD]})?(?:$|[^\\d])`), C("COERCERTL", c[f.COERCE], !0), C("COERCERTLFULL", c[f.COERCEFULL], !0), C("LONETILDE", "(?:~>?)"), C("TILDETRIM", `(\\s*)${c[f.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", C("TILDE", `^${c[f.LONETILDE]}${c[f.XRANGEPLAIN]}$`), C("TILDELOOSE", `^${c[f.LONETILDE]}${c[f.XRANGEPLAINLOOSE]}$`), C("LONECARET", "(?:\\^)"), C("CARETTRIM", `(\\s*)${c[f.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", C("CARET", `^${c[f.LONECARET]}${c[f.XRANGEPLAIN]}$`), C("CARETLOOSE", `^${c[f.LONECARET]}${c[f.XRANGEPLAINLOOSE]}$`), C("COMPARATORLOOSE", `^${c[f.GTLT]}\\s*(${c[f.LOOSEPLAIN]})$|^$`), C("COMPARATOR", `^${c[f.GTLT]}\\s*(${c[f.FULLPLAIN]})$|^$`), C("COMPARATORTRIM", `(\\s*)${c[f.GTLT]}\\s*(${c[f.LOOSEPLAIN]}|${c[f.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", C("HYPHENRANGE", `^\\s*(${c[f.XRANGEPLAIN]})\\s+-\\s+(${c[f.XRANGEPLAIN]})\\s*$`), C("HYPHENRANGELOOSE", `^\\s*(${c[f.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[f.XRANGEPLAINLOOSE]})\\s*$`), C("STAR", "(<|>)?=?\\s*\\*"), C("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), C("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Kl, Kl.exports);
var Eo = Kl.exports;
const bE = Object.freeze({ loose: !0 }), wE = Object.freeze({}), _E = (e) => e ? typeof e != "object" ? bE : e : wE;
var Pu = _E;
const wf = /^[0-9]+$/, Cp = (e, t) => {
  const r = wf.test(e), n = wf.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, EE = (e, t) => Cp(t, e);
var Rp = {
  compareIdentifiers: Cp,
  rcompareIdentifiers: EE
};
const Sa = ys, { MAX_LENGTH: _f, MAX_SAFE_INTEGER: va } = gs, { safeRe: Ca, t: Ra } = Eo, SE = Pu, { compareIdentifiers: jn } = Rp;
let vE = class Wt {
  constructor(t, r) {
    if (r = SE(r), t instanceof Wt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > _f)
      throw new TypeError(
        `version is longer than ${_f} characters`
      );
    Sa("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Ca[Ra.LOOSE] : Ca[Ra.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > va || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > va || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > va || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < va)
          return a;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Sa("SemVer.compare", this.version, this.options, t), !(t instanceof Wt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Wt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Wt || (t = new Wt(t, this.options)), jn(this.major, t.major) || jn(this.minor, t.minor) || jn(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof Wt || (t = new Wt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Sa("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return jn(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Wt || (t = new Wt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Sa("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return jn(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Ca[Ra.PRERELEASELOOSE] : Ca[Ra.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let a = [r, i];
          n === !1 && (a = [r]), jn(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var tt = vE;
const Ef = tt, CE = (e, t, r = !1) => {
  if (e instanceof Ef)
    return e;
  try {
    return new Ef(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var ci = CE;
const RE = ci, TE = (e, t) => {
  const r = RE(e, t);
  return r ? r.version : null;
};
var AE = TE;
const PE = ci, IE = (e, t) => {
  const r = PE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var $E = IE;
const Sf = tt, OE = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new Sf(
      e instanceof Sf ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var DE = OE;
const vf = ci, NE = (e, t) => {
  const r = vf(e, null, !0), n = vf(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const a = i > 0, s = a ? r : n, u = a ? n : r, c = !!s.prerelease.length;
  if (!!u.prerelease.length && !c) {
    if (!u.patch && !u.minor)
      return "major";
    if (u.compareMain(s) === 0)
      return u.minor && !u.patch ? "minor" : "patch";
  }
  const f = c ? "pre" : "";
  return r.major !== n.major ? f + "major" : r.minor !== n.minor ? f + "minor" : r.patch !== n.patch ? f + "patch" : "prerelease";
};
var FE = NE;
const kE = tt, LE = (e, t) => new kE(e, t).major;
var xE = LE;
const UE = tt, BE = (e, t) => new UE(e, t).minor;
var ME = BE;
const qE = tt, jE = (e, t) => new qE(e, t).patch;
var WE = jE;
const HE = ci, zE = (e, t) => {
  const r = HE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var GE = zE;
const Cf = tt, VE = (e, t, r) => new Cf(e, r).compare(new Cf(t, r));
var $t = VE;
const YE = $t, XE = (e, t, r) => YE(t, e, r);
var QE = XE;
const KE = $t, JE = (e, t) => KE(e, t, !0);
var ZE = JE;
const Rf = tt, eS = (e, t, r) => {
  const n = new Rf(e, r), i = new Rf(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Iu = eS;
const tS = Iu, rS = (e, t) => e.sort((r, n) => tS(r, n, t));
var nS = rS;
const iS = Iu, oS = (e, t) => e.sort((r, n) => iS(n, r, t));
var aS = oS;
const sS = $t, lS = (e, t, r) => sS(e, t, r) > 0;
var bs = lS;
const uS = $t, cS = (e, t, r) => uS(e, t, r) < 0;
var $u = cS;
const fS = $t, dS = (e, t, r) => fS(e, t, r) === 0;
var Tp = dS;
const hS = $t, pS = (e, t, r) => hS(e, t, r) !== 0;
var Ap = pS;
const mS = $t, gS = (e, t, r) => mS(e, t, r) >= 0;
var Ou = gS;
const yS = $t, bS = (e, t, r) => yS(e, t, r) <= 0;
var Du = bS;
const wS = Tp, _S = Ap, ES = bs, SS = Ou, vS = $u, CS = Du, RS = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return wS(e, r, n);
    case "!=":
      return _S(e, r, n);
    case ">":
      return ES(e, r, n);
    case ">=":
      return SS(e, r, n);
    case "<":
      return vS(e, r, n);
    case "<=":
      return CS(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Pp = RS;
const TS = tt, AS = ci, { safeRe: Ta, t: Aa } = Eo, PS = (e, t) => {
  if (e instanceof TS)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ta[Aa.COERCEFULL] : Ta[Aa.COERCE]);
  else {
    const c = t.includePrerelease ? Ta[Aa.COERCERTLFULL] : Ta[Aa.COERCERTL];
    let g;
    for (; (g = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || g.index + g[0].length !== r.index + r[0].length) && (r = g), c.lastIndex = g.index + g[1].length + g[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return AS(`${n}.${i}.${a}${s}${u}`, t);
};
var IS = PS;
class $S {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var OS = $S, yl, Tf;
function Ot() {
  if (Tf) return yl;
  Tf = 1;
  const e = /\s+/g;
  class t {
    constructor(D, B) {
      if (B = i(B), D instanceof t)
        return D.loose === !!B.loose && D.includePrerelease === !!B.includePrerelease ? D : new t(D.raw, B);
      if (D instanceof a)
        return this.raw = D.value, this.set = [[D]], this.formatted = void 0, this;
      if (this.options = B, this.loose = !!B.loose, this.includePrerelease = !!B.includePrerelease, this.raw = D.trim().replace(e, " "), this.set = this.raw.split("||").map((N) => this.parseRange(N.trim())).filter((N) => N.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const N = this.set[0];
        if (this.set = this.set.filter((q) => !C(q[0])), this.set.length === 0)
          this.set = [N];
        else if (this.set.length > 1) {
          for (const q of this.set)
            if (q.length === 1 && A(q[0])) {
              this.set = [q];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let D = 0; D < this.set.length; D++) {
          D > 0 && (this.formatted += "||");
          const B = this.set[D];
          for (let N = 0; N < B.length; N++)
            N > 0 && (this.formatted += " "), this.formatted += B[N].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(D) {
      const N = ((this.options.includePrerelease && b) | (this.options.loose && E)) + ":" + D, q = n.get(N);
      if (q)
        return q;
      const U = this.options.loose, V = U ? c[g.HYPHENRANGELOOSE] : c[g.HYPHENRANGE];
      D = D.replace(V, X(this.options.includePrerelease)), s("hyphen replace", D), D = D.replace(c[g.COMPARATORTRIM], f), s("comparator trim", D), D = D.replace(c[g.TILDETRIM], h), s("tilde trim", D), D = D.replace(c[g.CARETTRIM], m), s("caret trim", D);
      let ie = D.split(" ").map((Y) => $(Y, this.options)).join(" ").split(/\s+/).map((Y) => Z(Y, this.options));
      U && (ie = ie.filter((Y) => (s("loose invalid filter", Y, this.options), !!Y.match(c[g.COMPARATORLOOSE])))), s("range list", ie);
      const ee = /* @__PURE__ */ new Map(), fe = ie.map((Y) => new a(Y, this.options));
      for (const Y of fe) {
        if (C(Y))
          return [Y];
        ee.set(Y.value, Y);
      }
      ee.size > 1 && ee.has("") && ee.delete("");
      const Te = [...ee.values()];
      return n.set(N, Te), Te;
    }
    intersects(D, B) {
      if (!(D instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((N) => I(N, B) && D.set.some((q) => I(q, B) && N.every((U) => q.every((V) => U.intersects(V, B)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(D) {
      if (!D)
        return !1;
      if (typeof D == "string")
        try {
          D = new u(D, this.options);
        } catch {
          return !1;
        }
      for (let B = 0; B < this.set.length; B++)
        if (ce(this.set[B], D, this.options))
          return !0;
      return !1;
    }
  }
  yl = t;
  const r = OS, n = new r(), i = Pu, a = ws(), s = ys, u = tt, {
    safeRe: c,
    t: g,
    comparatorTrimReplace: f,
    tildeTrimReplace: h,
    caretTrimReplace: m
  } = Eo, { FLAG_INCLUDE_PRERELEASE: b, FLAG_LOOSE: E } = gs, C = (L) => L.value === "<0.0.0-0", A = (L) => L.value === "", I = (L, D) => {
    let B = !0;
    const N = L.slice();
    let q = N.pop();
    for (; B && N.length; )
      B = N.every((U) => q.intersects(U, D)), q = N.pop();
    return B;
  }, $ = (L, D) => (s("comp", L, D), L = ae(L, D), s("caret", L), L = x(L, D), s("tildes", L), L = Ne(L, D), s("xrange", L), L = re(L, D), s("stars", L), L), M = (L) => !L || L.toLowerCase() === "x" || L === "*", x = (L, D) => L.trim().split(/\s+/).map((B) => te(B, D)).join(" "), te = (L, D) => {
    const B = D.loose ? c[g.TILDELOOSE] : c[g.TILDE];
    return L.replace(B, (N, q, U, V, ie) => {
      s("tilde", L, N, q, U, V, ie);
      let ee;
      return M(q) ? ee = "" : M(U) ? ee = `>=${q}.0.0 <${+q + 1}.0.0-0` : M(V) ? ee = `>=${q}.${U}.0 <${q}.${+U + 1}.0-0` : ie ? (s("replaceTilde pr", ie), ee = `>=${q}.${U}.${V}-${ie} <${q}.${+U + 1}.0-0`) : ee = `>=${q}.${U}.${V} <${q}.${+U + 1}.0-0`, s("tilde return", ee), ee;
    });
  }, ae = (L, D) => L.trim().split(/\s+/).map((B) => Q(B, D)).join(" "), Q = (L, D) => {
    s("caret", L, D);
    const B = D.loose ? c[g.CARETLOOSE] : c[g.CARET], N = D.includePrerelease ? "-0" : "";
    return L.replace(B, (q, U, V, ie, ee) => {
      s("caret", L, q, U, V, ie, ee);
      let fe;
      return M(U) ? fe = "" : M(V) ? fe = `>=${U}.0.0${N} <${+U + 1}.0.0-0` : M(ie) ? U === "0" ? fe = `>=${U}.${V}.0${N} <${U}.${+V + 1}.0-0` : fe = `>=${U}.${V}.0${N} <${+U + 1}.0.0-0` : ee ? (s("replaceCaret pr", ee), U === "0" ? V === "0" ? fe = `>=${U}.${V}.${ie}-${ee} <${U}.${V}.${+ie + 1}-0` : fe = `>=${U}.${V}.${ie}-${ee} <${U}.${+V + 1}.0-0` : fe = `>=${U}.${V}.${ie}-${ee} <${+U + 1}.0.0-0`) : (s("no pr"), U === "0" ? V === "0" ? fe = `>=${U}.${V}.${ie}${N} <${U}.${V}.${+ie + 1}-0` : fe = `>=${U}.${V}.${ie}${N} <${U}.${+V + 1}.0-0` : fe = `>=${U}.${V}.${ie} <${+U + 1}.0.0-0`), s("caret return", fe), fe;
    });
  }, Ne = (L, D) => (s("replaceXRanges", L, D), L.split(/\s+/).map((B) => S(B, D)).join(" ")), S = (L, D) => {
    L = L.trim();
    const B = D.loose ? c[g.XRANGELOOSE] : c[g.XRANGE];
    return L.replace(B, (N, q, U, V, ie, ee) => {
      s("xRange", L, N, q, U, V, ie, ee);
      const fe = M(U), Te = fe || M(V), Y = Te || M(ie), Ce = Y;
      return q === "=" && Ce && (q = ""), ee = D.includePrerelease ? "-0" : "", fe ? q === ">" || q === "<" ? N = "<0.0.0-0" : N = "*" : q && Ce ? (Te && (V = 0), ie = 0, q === ">" ? (q = ">=", Te ? (U = +U + 1, V = 0, ie = 0) : (V = +V + 1, ie = 0)) : q === "<=" && (q = "<", Te ? U = +U + 1 : V = +V + 1), q === "<" && (ee = "-0"), N = `${q + U}.${V}.${ie}${ee}`) : Te ? N = `>=${U}.0.0${ee} <${+U + 1}.0.0-0` : Y && (N = `>=${U}.${V}.0${ee} <${U}.${+V + 1}.0-0`), s("xRange return", N), N;
    });
  }, re = (L, D) => (s("replaceStars", L, D), L.trim().replace(c[g.STAR], "")), Z = (L, D) => (s("replaceGTE0", L, D), L.trim().replace(c[D.includePrerelease ? g.GTE0PRE : g.GTE0], "")), X = (L) => (D, B, N, q, U, V, ie, ee, fe, Te, Y, Ce) => (M(N) ? B = "" : M(q) ? B = `>=${N}.0.0${L ? "-0" : ""}` : M(U) ? B = `>=${N}.${q}.0${L ? "-0" : ""}` : V ? B = `>=${B}` : B = `>=${B}${L ? "-0" : ""}`, M(fe) ? ee = "" : M(Te) ? ee = `<${+fe + 1}.0.0-0` : M(Y) ? ee = `<${fe}.${+Te + 1}.0-0` : Ce ? ee = `<=${fe}.${Te}.${Y}-${Ce}` : L ? ee = `<${fe}.${Te}.${+Y + 1}-0` : ee = `<=${ee}`, `${B} ${ee}`.trim()), ce = (L, D, B) => {
    for (let N = 0; N < L.length; N++)
      if (!L[N].test(D))
        return !1;
    if (D.prerelease.length && !B.includePrerelease) {
      for (let N = 0; N < L.length; N++)
        if (s(L[N].semver), L[N].semver !== a.ANY && L[N].semver.prerelease.length > 0) {
          const q = L[N].semver;
          if (q.major === D.major && q.minor === D.minor && q.patch === D.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return yl;
}
var bl, Af;
function ws() {
  if (Af) return bl;
  Af = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(f, h) {
      if (h = r(h), f instanceof t) {
        if (f.loose === !!h.loose)
          return f;
        f = f.value;
      }
      f = f.trim().split(/\s+/).join(" "), s("comparator", f, h), this.options = h, this.loose = !!h.loose, this.parse(f), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(f) {
      const h = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], m = f.match(h);
      if (!m)
        throw new TypeError(`Invalid comparator: ${f}`);
      this.operator = m[1] !== void 0 ? m[1] : "", this.operator === "=" && (this.operator = ""), m[2] ? this.semver = new u(m[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(f) {
      if (s("Comparator.test", f, this.options.loose), this.semver === e || f === e)
        return !0;
      if (typeof f == "string")
        try {
          f = new u(f, this.options);
        } catch {
          return !1;
        }
      return a(f, this.operator, this.semver, this.options);
    }
    intersects(f, h) {
      if (!(f instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(f.value, h).test(this.value) : f.operator === "" ? f.value === "" ? !0 : new c(this.value, h).test(f.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || f.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || f.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && f.operator.startsWith(">") || this.operator.startsWith("<") && f.operator.startsWith("<") || this.semver.version === f.semver.version && this.operator.includes("=") && f.operator.includes("=") || a(this.semver, "<", f.semver, h) && this.operator.startsWith(">") && f.operator.startsWith("<") || a(this.semver, ">", f.semver, h) && this.operator.startsWith("<") && f.operator.startsWith(">")));
    }
  }
  bl = t;
  const r = Pu, { safeRe: n, t: i } = Eo, a = Pp, s = ys, u = tt, c = Ot();
  return bl;
}
const DS = Ot(), NS = (e, t, r) => {
  try {
    t = new DS(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var _s = NS;
const FS = Ot(), kS = (e, t) => new FS(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var LS = kS;
const xS = tt, US = Ot(), BS = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new US(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new xS(n, r));
  }), n;
};
var MS = BS;
const qS = tt, jS = Ot(), WS = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new jS(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new qS(n, r));
  }), n;
};
var HS = WS;
const wl = tt, zS = Ot(), Pf = bs, GS = (e, t) => {
  e = new zS(e, t);
  let r = new wl("0.0.0");
  if (e.test(r) || (r = new wl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((s) => {
      const u = new wl(s.semver.version);
      switch (s.operator) {
        case ">":
          u.prerelease.length === 0 ? u.patch++ : u.prerelease.push(0), u.raw = u.format();
        case "":
        case ">=":
          (!a || Pf(u, a)) && (a = u);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), a && (!r || Pf(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var VS = GS;
const YS = Ot(), XS = (e, t) => {
  try {
    return new YS(e, t).range || "*";
  } catch {
    return null;
  }
};
var QS = XS;
const KS = tt, Ip = ws(), { ANY: JS } = Ip, ZS = Ot(), ev = _s, If = bs, $f = $u, tv = Du, rv = Ou, nv = (e, t, r, n) => {
  e = new KS(e, n), t = new ZS(t, n);
  let i, a, s, u, c;
  switch (r) {
    case ">":
      i = If, a = tv, s = $f, u = ">", c = ">=";
      break;
    case "<":
      i = $f, a = rv, s = If, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (ev(e, t, n))
    return !1;
  for (let g = 0; g < t.set.length; ++g) {
    const f = t.set[g];
    let h = null, m = null;
    if (f.forEach((b) => {
      b.semver === JS && (b = new Ip(">=0.0.0")), h = h || b, m = m || b, i(b.semver, h.semver, n) ? h = b : s(b.semver, m.semver, n) && (m = b);
    }), h.operator === u || h.operator === c || (!m.operator || m.operator === u) && a(e, m.semver))
      return !1;
    if (m.operator === c && s(e, m.semver))
      return !1;
  }
  return !0;
};
var Nu = nv;
const iv = Nu, ov = (e, t, r) => iv(e, t, ">", r);
var av = ov;
const sv = Nu, lv = (e, t, r) => sv(e, t, "<", r);
var uv = lv;
const Of = Ot(), cv = (e, t, r) => (e = new Of(e, r), t = new Of(t, r), e.intersects(t, r));
var fv = cv;
const dv = _s, hv = $t;
var pv = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((f, h) => hv(f, h, r));
  for (const f of s)
    dv(f, t, r) ? (a = f, i || (i = f)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const u = [];
  for (const [f, h] of n)
    f === h ? u.push(f) : !h && f === s[0] ? u.push("*") : h ? f === s[0] ? u.push(`<=${h}`) : u.push(`${f} - ${h}`) : u.push(`>=${f}`);
  const c = u.join(" || "), g = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < g.length ? c : t;
};
const Df = Ot(), Fu = ws(), { ANY: _l } = Fu, Fi = _s, ku = $t, mv = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Df(e, r), t = new Df(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = yv(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, gv = [new Fu(">=0.0.0-0")], Nf = [new Fu(">=0.0.0")], yv = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === _l) {
    if (t.length === 1 && t[0].semver === _l)
      return !0;
    r.includePrerelease ? e = gv : e = Nf;
  }
  if (t.length === 1 && t[0].semver === _l) {
    if (r.includePrerelease)
      return !0;
    t = Nf;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const b of e)
    b.operator === ">" || b.operator === ">=" ? i = Ff(i, b, r) : b.operator === "<" || b.operator === "<=" ? a = kf(a, b, r) : n.add(b.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && a) {
    if (s = ku(i.semver, a.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const b of n) {
    if (i && !Fi(b, String(i), r) || a && !Fi(b, String(a), r))
      return null;
    for (const E of t)
      if (!Fi(b, String(E), r))
        return !1;
    return !0;
  }
  let u, c, g, f, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, m = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const b of t) {
    if (f = f || b.operator === ">" || b.operator === ">=", g = g || b.operator === "<" || b.operator === "<=", i) {
      if (m && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === m.major && b.semver.minor === m.minor && b.semver.patch === m.patch && (m = !1), b.operator === ">" || b.operator === ">=") {
        if (u = Ff(i, b, r), u === b && u !== i)
          return !1;
      } else if (i.operator === ">=" && !Fi(i.semver, String(b), r))
        return !1;
    }
    if (a) {
      if (h && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === h.major && b.semver.minor === h.minor && b.semver.patch === h.patch && (h = !1), b.operator === "<" || b.operator === "<=") {
        if (c = kf(a, b, r), c === b && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Fi(a.semver, String(b), r))
        return !1;
    }
    if (!b.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && g && !a && s !== 0 || a && f && !i && s !== 0 || m || h);
}, Ff = (e, t, r) => {
  if (!e)
    return t;
  const n = ku(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, kf = (e, t, r) => {
  if (!e)
    return t;
  const n = ku(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var bv = mv;
const El = Eo, Lf = gs, wv = tt, xf = Rp, _v = ci, Ev = AE, Sv = $E, vv = DE, Cv = FE, Rv = xE, Tv = ME, Av = WE, Pv = GE, Iv = $t, $v = QE, Ov = ZE, Dv = Iu, Nv = nS, Fv = aS, kv = bs, Lv = $u, xv = Tp, Uv = Ap, Bv = Ou, Mv = Du, qv = Pp, jv = IS, Wv = ws(), Hv = Ot(), zv = _s, Gv = LS, Vv = MS, Yv = HS, Xv = VS, Qv = QS, Kv = Nu, Jv = av, Zv = uv, eC = fv, tC = pv, rC = bv;
var $p = {
  parse: _v,
  valid: Ev,
  clean: Sv,
  inc: vv,
  diff: Cv,
  major: Rv,
  minor: Tv,
  patch: Av,
  prerelease: Pv,
  compare: Iv,
  rcompare: $v,
  compareLoose: Ov,
  compareBuild: Dv,
  sort: Nv,
  rsort: Fv,
  gt: kv,
  lt: Lv,
  eq: xv,
  neq: Uv,
  gte: Bv,
  lte: Mv,
  cmp: qv,
  coerce: jv,
  Comparator: Wv,
  Range: Hv,
  satisfies: zv,
  toComparators: Gv,
  maxSatisfying: Vv,
  minSatisfying: Yv,
  minVersion: Xv,
  validRange: Qv,
  outside: Kv,
  gtr: Jv,
  ltr: Zv,
  intersects: eC,
  simplifyRange: tC,
  subset: rC,
  SemVer: wv,
  re: El.re,
  src: El.src,
  tokens: El.t,
  SEMVER_SPEC_VERSION: Lf.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Lf.RELEASE_TYPES,
  compareIdentifiers: xf.compareIdentifiers,
  rcompareIdentifiers: xf.rcompareIdentifiers
}, So = {}, es = { exports: {} };
es.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, u = "[object Arguments]", c = "[object Array]", g = "[object AsyncFunction]", f = "[object Boolean]", h = "[object Date]", m = "[object Error]", b = "[object Function]", E = "[object GeneratorFunction]", C = "[object Map]", A = "[object Number]", I = "[object Null]", $ = "[object Object]", M = "[object Promise]", x = "[object Proxy]", te = "[object RegExp]", ae = "[object Set]", Q = "[object String]", Ne = "[object Symbol]", S = "[object Undefined]", re = "[object WeakMap]", Z = "[object ArrayBuffer]", X = "[object DataView]", ce = "[object Float32Array]", L = "[object Float64Array]", D = "[object Int8Array]", B = "[object Int16Array]", N = "[object Int32Array]", q = "[object Uint8Array]", U = "[object Uint8ClampedArray]", V = "[object Uint16Array]", ie = "[object Uint32Array]", ee = /[\\^$.*+?()[\]{}|]/g, fe = /^\[object .+?Constructor\]$/, Te = /^(?:0|[1-9]\d*)$/, Y = {};
  Y[ce] = Y[L] = Y[D] = Y[B] = Y[N] = Y[q] = Y[U] = Y[V] = Y[ie] = !0, Y[u] = Y[c] = Y[Z] = Y[f] = Y[X] = Y[h] = Y[m] = Y[b] = Y[C] = Y[A] = Y[$] = Y[te] = Y[ae] = Y[Q] = Y[re] = !1;
  var Ce = typeof Ue == "object" && Ue && Ue.Object === Object && Ue, y = typeof self == "object" && self && self.Object === Object && self, p = Ce || y || Function("return this")(), F = t && !t.nodeType && t, T = F && !0 && e && !e.nodeType && e, se = T && T.exports === F, pe = se && Ce.process, we = function() {
    try {
      return pe && pe.binding && pe.binding("util");
    } catch {
    }
  }(), Oe = we && we.isTypedArray;
  function Ae(_, R) {
    for (var k = -1, W = _ == null ? 0 : _.length, he = 0, K = []; ++k < W; ) {
      var de = _[k];
      R(de, k, _) && (K[he++] = de);
    }
    return K;
  }
  function mt(_, R) {
    for (var k = -1, W = R.length, he = _.length; ++k < W; )
      _[he + k] = R[k];
    return _;
  }
  function ye(_, R) {
    for (var k = -1, W = _ == null ? 0 : _.length; ++k < W; )
      if (R(_[k], k, _))
        return !0;
    return !1;
  }
  function rt(_, R) {
    for (var k = -1, W = Array(_); ++k < _; )
      W[k] = R(k);
    return W;
  }
  function qr(_) {
    return function(R) {
      return _(R);
    };
  }
  function Yt(_, R) {
    return _.has(R);
  }
  function hr(_, R) {
    return _ == null ? void 0 : _[R];
  }
  function ct(_) {
    var R = -1, k = Array(_.size);
    return _.forEach(function(W, he) {
      k[++R] = [he, W];
    }), k;
  }
  function Dt(_, R) {
    return function(k) {
      return _(R(k));
    };
  }
  function jr(_) {
    var R = -1, k = Array(_.size);
    return _.forEach(function(W) {
      k[++R] = W;
    }), k;
  }
  var Is = Array.prototype, To = Function.prototype, Xt = Object.prototype, di = p["__core-js_shared__"], hi = To.toString, ft = Xt.hasOwnProperty, Ao = function() {
    var _ = /[^.]+$/.exec(di && di.keys && di.keys.IE_PROTO || "");
    return _ ? "Symbol(src)_1." + _ : "";
  }(), pi = Xt.toString, Po = RegExp(
    "^" + hi.call(ft).replace(ee, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), mi = se ? p.Buffer : void 0, pr = p.Symbol, gn = p.Uint8Array, yn = Xt.propertyIsEnumerable, Wr = Is.splice, Nt = pr ? pr.toStringTag : void 0, gt = Object.getOwnPropertySymbols, Ft = mi ? mi.isBuffer : void 0, Io = Dt(Object.keys, Object), mr = wr(p, "DataView"), Hr = wr(p, "Map"), zr = wr(p, "Promise"), bn = wr(p, "Set"), gi = wr(p, "WeakMap"), Gr = wr(Object, "create"), $s = tr(mr), Os = tr(Hr), $o = tr(zr), yi = tr(bn), bi = tr(gi), Oo = pr ? pr.prototype : void 0, yt = Oo ? Oo.valueOf : void 0;
  function kt(_) {
    var R = -1, k = _ == null ? 0 : _.length;
    for (this.clear(); ++R < k; ) {
      var W = _[R];
      this.set(W[0], W[1]);
    }
  }
  function Ds() {
    this.__data__ = Gr ? Gr(null) : {}, this.size = 0;
  }
  function Ns(_) {
    var R = this.has(_) && delete this.__data__[_];
    return this.size -= R ? 1 : 0, R;
  }
  function Qt(_) {
    var R = this.__data__;
    if (Gr) {
      var k = R[_];
      return k === n ? void 0 : k;
    }
    return ft.call(R, _) ? R[_] : void 0;
  }
  function St(_) {
    var R = this.__data__;
    return Gr ? R[_] !== void 0 : ft.call(R, _);
  }
  function Kt(_, R) {
    var k = this.__data__;
    return this.size += this.has(_) ? 0 : 1, k[_] = Gr && R === void 0 ? n : R, this;
  }
  kt.prototype.clear = Ds, kt.prototype.delete = Ns, kt.prototype.get = Qt, kt.prototype.has = St, kt.prototype.set = Kt;
  function dt(_) {
    var R = -1, k = _ == null ? 0 : _.length;
    for (this.clear(); ++R < k; ) {
      var W = _[R];
      this.set(W[0], W[1]);
    }
  }
  function Jt() {
    this.__data__ = [], this.size = 0;
  }
  function Do(_) {
    var R = this.__data__, k = Zt(R, _);
    if (k < 0)
      return !1;
    var W = R.length - 1;
    return k == W ? R.pop() : Wr.call(R, k, 1), --this.size, !0;
  }
  function wi(_) {
    var R = this.__data__, k = Zt(R, _);
    return k < 0 ? void 0 : R[k][1];
  }
  function No(_) {
    return Zt(this.__data__, _) > -1;
  }
  function wn(_, R) {
    var k = this.__data__, W = Zt(k, _);
    return W < 0 ? (++this.size, k.push([_, R])) : k[W][1] = R, this;
  }
  dt.prototype.clear = Jt, dt.prototype.delete = Do, dt.prototype.get = wi, dt.prototype.has = No, dt.prototype.set = wn;
  function Lt(_) {
    var R = -1, k = _ == null ? 0 : _.length;
    for (this.clear(); ++R < k; ) {
      var W = _[R];
      this.set(W[0], W[1]);
    }
  }
  function Fo() {
    this.size = 0, this.__data__ = {
      hash: new kt(),
      map: new (Hr || dt)(),
      string: new kt()
    };
  }
  function ko(_) {
    var R = Cn(this, _).delete(_);
    return this.size -= R ? 1 : 0, R;
  }
  function Lo(_) {
    return Cn(this, _).get(_);
  }
  function xo(_) {
    return Cn(this, _).has(_);
  }
  function _i(_, R) {
    var k = Cn(this, _), W = k.size;
    return k.set(_, R), this.size += k.size == W ? 0 : 1, this;
  }
  Lt.prototype.clear = Fo, Lt.prototype.delete = ko, Lt.prototype.get = Lo, Lt.prototype.has = xo, Lt.prototype.set = _i;
  function gr(_) {
    var R = -1, k = _ == null ? 0 : _.length;
    for (this.__data__ = new Lt(); ++R < k; )
      this.add(_[R]);
  }
  function Fs(_) {
    return this.__data__.set(_, n), this;
  }
  function ks(_) {
    return this.__data__.has(_);
  }
  gr.prototype.add = gr.prototype.push = Fs, gr.prototype.has = ks;
  function xt(_) {
    var R = this.__data__ = new dt(_);
    this.size = R.size;
  }
  function Ls() {
    this.__data__ = new dt(), this.size = 0;
  }
  function Uo(_) {
    var R = this.__data__, k = R.delete(_);
    return this.size = R.size, k;
  }
  function yr(_) {
    return this.__data__.get(_);
  }
  function xs(_) {
    return this.__data__.has(_);
  }
  function _n(_, R) {
    var k = this.__data__;
    if (k instanceof dt) {
      var W = k.__data__;
      if (!Hr || W.length < r - 1)
        return W.push([_, R]), this.size = ++k.size, this;
      k = this.__data__ = new Lt(W);
    }
    return k.set(_, R), this.size = k.size, this;
  }
  xt.prototype.clear = Ls, xt.prototype.delete = Uo, xt.prototype.get = yr, xt.prototype.has = xs, xt.prototype.set = _n;
  function Vr(_, R) {
    var k = Mt(_), W = !k && Rn(_), he = !k && !W && _r(_), K = !k && !W && !he && Xo(_), de = k || W || he || K, Ee = de ? rt(_.length, String) : [], Pe = Ee.length;
    for (var _e in _)
      ft.call(_, _e) && !(de && // Safari 9 has enumerable `arguments.length` in strict mode.
      (_e == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      he && (_e == "offset" || _e == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      K && (_e == "buffer" || _e == "byteLength" || _e == "byteOffset") || // Skip index properties.
      Ho(_e, Pe))) && Ee.push(_e);
    return Ee;
  }
  function Zt(_, R) {
    for (var k = _.length; k--; )
      if (Ci(_[k][0], R))
        return k;
    return -1;
  }
  function nt(_, R, k) {
    var W = R(_);
    return Mt(_) ? W : mt(W, k(_));
  }
  function br(_) {
    return _ == null ? _ === void 0 ? S : I : Nt && Nt in Object(_) ? jo(_) : zo(_);
  }
  function En(_) {
    return Xr(_) && br(_) == u;
  }
  function Ei(_, R, k, W, he) {
    return _ === R ? !0 : _ == null || R == null || !Xr(_) && !Xr(R) ? _ !== _ && R !== R : Sn(_, R, k, W, Ei, he);
  }
  function Sn(_, R, k, W, he, K) {
    var de = Mt(_), Ee = Mt(R), Pe = de ? c : Ut(_), _e = Ee ? c : Ut(R);
    Pe = Pe == u ? $ : Pe, _e = _e == u ? $ : _e;
    var Me = Pe == $, Ve = _e == $, Ie = Pe == _e;
    if (Ie && _r(_)) {
      if (!_r(R))
        return !1;
      de = !0, Me = !1;
    }
    if (Ie && !Me)
      return K || (K = new xt()), de || Xo(_) ? Mo(_, R, k, W, he, K) : Si(_, R, Pe, k, W, he, K);
    if (!(k & i)) {
      var it = Me && ft.call(_, "__wrapped__"), ot = Ve && ft.call(R, "__wrapped__");
      if (it || ot) {
        var qt = it ? _.value() : _, vt = ot ? R.value() : R;
        return K || (K = new xt()), he(qt, vt, k, W, K);
      }
    }
    return Ie ? (K || (K = new xt()), Yr(_, R, k, W, he, K)) : !1;
  }
  function vn(_) {
    if (!Yo(_) || Bt(_))
      return !1;
    var R = Go(_) ? Po : fe;
    return R.test(tr(_));
  }
  function Bo(_) {
    return Xr(_) && Vo(_.length) && !!Y[br(_)];
  }
  function Us(_) {
    if (!er(_))
      return Io(_);
    var R = [];
    for (var k in Object(_))
      ft.call(_, k) && k != "constructor" && R.push(k);
    return R;
  }
  function Mo(_, R, k, W, he, K) {
    var de = k & i, Ee = _.length, Pe = R.length;
    if (Ee != Pe && !(de && Pe > Ee))
      return !1;
    var _e = K.get(_);
    if (_e && K.get(R))
      return _e == R;
    var Me = -1, Ve = !0, Ie = k & a ? new gr() : void 0;
    for (K.set(_, R), K.set(R, _); ++Me < Ee; ) {
      var it = _[Me], ot = R[Me];
      if (W)
        var qt = de ? W(ot, it, Me, R, _, K) : W(it, ot, Me, _, R, K);
      if (qt !== void 0) {
        if (qt)
          continue;
        Ve = !1;
        break;
      }
      if (Ie) {
        if (!ye(R, function(vt, Fe) {
          if (!Yt(Ie, Fe) && (it === vt || he(it, vt, k, W, K)))
            return Ie.push(Fe);
        })) {
          Ve = !1;
          break;
        }
      } else if (!(it === ot || he(it, ot, k, W, K))) {
        Ve = !1;
        break;
      }
    }
    return K.delete(_), K.delete(R), Ve;
  }
  function Si(_, R, k, W, he, K, de) {
    switch (k) {
      case X:
        if (_.byteLength != R.byteLength || _.byteOffset != R.byteOffset)
          return !1;
        _ = _.buffer, R = R.buffer;
      case Z:
        return !(_.byteLength != R.byteLength || !K(new gn(_), new gn(R)));
      case f:
      case h:
      case A:
        return Ci(+_, +R);
      case m:
        return _.name == R.name && _.message == R.message;
      case te:
      case Q:
        return _ == R + "";
      case C:
        var Ee = ct;
      case ae:
        var Pe = W & i;
        if (Ee || (Ee = jr), _.size != R.size && !Pe)
          return !1;
        var _e = de.get(_);
        if (_e)
          return _e == R;
        W |= a, de.set(_, R);
        var Me = Mo(Ee(_), Ee(R), W, he, K, de);
        return de.delete(_), Me;
      case Ne:
        if (yt)
          return yt.call(_) == yt.call(R);
    }
    return !1;
  }
  function Yr(_, R, k, W, he, K) {
    var de = k & i, Ee = qo(_), Pe = Ee.length, _e = qo(R), Me = _e.length;
    if (Pe != Me && !de)
      return !1;
    for (var Ve = Pe; Ve--; ) {
      var Ie = Ee[Ve];
      if (!(de ? Ie in R : ft.call(R, Ie)))
        return !1;
    }
    var it = K.get(_);
    if (it && K.get(R))
      return it == R;
    var ot = !0;
    K.set(_, R), K.set(R, _);
    for (var qt = de; ++Ve < Pe; ) {
      Ie = Ee[Ve];
      var vt = _[Ie], Fe = R[Ie];
      if (W)
        var Ko = de ? W(Fe, vt, Ie, R, _, K) : W(vt, Fe, Ie, _, R, K);
      if (!(Ko === void 0 ? vt === Fe || he(vt, Fe, k, W, K) : Ko)) {
        ot = !1;
        break;
      }
      qt || (qt = Ie == "constructor");
    }
    if (ot && !qt) {
      var An = _.constructor, Pn = R.constructor;
      An != Pn && "constructor" in _ && "constructor" in R && !(typeof An == "function" && An instanceof An && typeof Pn == "function" && Pn instanceof Pn) && (ot = !1);
    }
    return K.delete(_), K.delete(R), ot;
  }
  function qo(_) {
    return nt(_, Qo, Wo);
  }
  function Cn(_, R) {
    var k = _.__data__;
    return vi(R) ? k[typeof R == "string" ? "string" : "hash"] : k.map;
  }
  function wr(_, R) {
    var k = hr(_, R);
    return vn(k) ? k : void 0;
  }
  function jo(_) {
    var R = ft.call(_, Nt), k = _[Nt];
    try {
      _[Nt] = void 0;
      var W = !0;
    } catch {
    }
    var he = pi.call(_);
    return W && (R ? _[Nt] = k : delete _[Nt]), he;
  }
  var Wo = gt ? function(_) {
    return _ == null ? [] : (_ = Object(_), Ae(gt(_), function(R) {
      return yn.call(_, R);
    }));
  } : Ms, Ut = br;
  (mr && Ut(new mr(new ArrayBuffer(1))) != X || Hr && Ut(new Hr()) != C || zr && Ut(zr.resolve()) != M || bn && Ut(new bn()) != ae || gi && Ut(new gi()) != re) && (Ut = function(_) {
    var R = br(_), k = R == $ ? _.constructor : void 0, W = k ? tr(k) : "";
    if (W)
      switch (W) {
        case $s:
          return X;
        case Os:
          return C;
        case $o:
          return M;
        case yi:
          return ae;
        case bi:
          return re;
      }
    return R;
  });
  function Ho(_, R) {
    return R = R ?? s, !!R && (typeof _ == "number" || Te.test(_)) && _ > -1 && _ % 1 == 0 && _ < R;
  }
  function vi(_) {
    var R = typeof _;
    return R == "string" || R == "number" || R == "symbol" || R == "boolean" ? _ !== "__proto__" : _ === null;
  }
  function Bt(_) {
    return !!Ao && Ao in _;
  }
  function er(_) {
    var R = _ && _.constructor, k = typeof R == "function" && R.prototype || Xt;
    return _ === k;
  }
  function zo(_) {
    return pi.call(_);
  }
  function tr(_) {
    if (_ != null) {
      try {
        return hi.call(_);
      } catch {
      }
      try {
        return _ + "";
      } catch {
      }
    }
    return "";
  }
  function Ci(_, R) {
    return _ === R || _ !== _ && R !== R;
  }
  var Rn = En(/* @__PURE__ */ function() {
    return arguments;
  }()) ? En : function(_) {
    return Xr(_) && ft.call(_, "callee") && !yn.call(_, "callee");
  }, Mt = Array.isArray;
  function Tn(_) {
    return _ != null && Vo(_.length) && !Go(_);
  }
  var _r = Ft || qs;
  function Bs(_, R) {
    return Ei(_, R);
  }
  function Go(_) {
    if (!Yo(_))
      return !1;
    var R = br(_);
    return R == b || R == E || R == g || R == x;
  }
  function Vo(_) {
    return typeof _ == "number" && _ > -1 && _ % 1 == 0 && _ <= s;
  }
  function Yo(_) {
    var R = typeof _;
    return _ != null && (R == "object" || R == "function");
  }
  function Xr(_) {
    return _ != null && typeof _ == "object";
  }
  var Xo = Oe ? qr(Oe) : Bo;
  function Qo(_) {
    return Tn(_) ? Vr(_) : Us(_);
  }
  function Ms() {
    return [];
  }
  function qs() {
    return !1;
  }
  e.exports = Bs;
})(es, es.exports);
var nC = es.exports;
Object.defineProperty(So, "__esModule", { value: !0 });
So.DownloadedUpdateHelper = void 0;
So.createTempUpdateFile = lC;
const iC = mo, oC = Ur, Uf = nC, rn = Br, zi = ve;
class aC {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return zi.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Uf(this.versionInfo, r) && Uf(this.fileInfo.info, n.info) && await (0, rn.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, rn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, rn.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, rn.pathExists)(n))
      return null;
    let a;
    try {
      a = await (0, rn.readJson)(n);
    } catch (g) {
      let f = "No cached update info available";
      return g.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), f += ` (error on read: ${g.message})`), r.info(f), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const u = zi.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, rn.pathExists)(u))
      return r.info("Cached update file doesn't exist"), null;
    const c = await sC(u);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, u);
  }
  getUpdateInfoFile() {
    return zi.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
So.DownloadedUpdateHelper = aC;
function sC(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, iC.createHash)(t);
    s.on("error", a).setEncoding(r), (0, oC.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function lC(e, t, r) {
  let n = 0, i = zi.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, rn.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = zi.join(t, `${n++}-${e}`);
    }
  return i;
}
var Es = {}, Lu = {};
Object.defineProperty(Lu, "__esModule", { value: !0 });
Lu.getAppCacheDir = cC;
const Sl = ve, uC = os;
function cC() {
  const e = (0, uC.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Sl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Sl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Sl.join(e, ".cache"), t;
}
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.ElectronAppAdapter = void 0;
const Bf = ve, fC = Lu;
class dC {
  constructor(t = fn.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Bf.join(process.resourcesPath, "app-update.yml") : Bf.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, fC.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
Es.ElectronAppAdapter = dC;
var Op = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Be;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return fn.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(a) {
      super(), this.proxyLoginCallback = a, this.cachedSession = null;
    }
    async download(a, s, u) {
      return await u.cancellationToken.createPromise((c, g, f) => {
        const h = {
          headers: u.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(a, h), (0, t.configureRequestOptions)(h), this.doDownload(h, {
          destination: s,
          options: u,
          onCancel: f,
          callback: (m) => {
            m == null ? c(s) : g(m);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(a, s) {
      a.headers && a.headers.Host && (a.host = a.headers.Host, delete a.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const u = fn.net.request({
        ...a,
        session: this.cachedSession
      });
      return u.on("response", s), this.proxyLoginCallback != null && u.on("login", this.proxyLoginCallback), u;
    }
    addRedirectHandlers(a, s, u, c, g) {
      a.on("redirect", (f, h, m) => {
        a.abort(), c > this.maxRedirects ? u(this.createMaxRedirectError()) : g(t.HttpExecutor.prepareRedirectUrlOptions(m, s));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Op);
var vo = {}, Et = {}, hC = "[object Symbol]", Dp = /[\\^$.*+?()[\]{}|]/g, pC = RegExp(Dp.source), mC = typeof Ue == "object" && Ue && Ue.Object === Object && Ue, gC = typeof self == "object" && self && self.Object === Object && self, yC = mC || gC || Function("return this")(), bC = Object.prototype, wC = bC.toString, Mf = yC.Symbol, qf = Mf ? Mf.prototype : void 0, jf = qf ? qf.toString : void 0;
function _C(e) {
  if (typeof e == "string")
    return e;
  if (SC(e))
    return jf ? jf.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function EC(e) {
  return !!e && typeof e == "object";
}
function SC(e) {
  return typeof e == "symbol" || EC(e) && wC.call(e) == hC;
}
function vC(e) {
  return e == null ? "" : _C(e);
}
function CC(e) {
  return e = vC(e), e && pC.test(e) ? e.replace(Dp, "\\$&") : e;
}
var RC = CC;
Object.defineProperty(Et, "__esModule", { value: !0 });
Et.newBaseUrl = AC;
Et.newUrlFromBase = Jl;
Et.getChannelFilename = PC;
Et.blockmapFiles = IC;
const Np = si, TC = RC;
function AC(e) {
  const t = new Np.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Jl(e, t, r = !1) {
  const n = new Np.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function PC(e) {
  return `${e}.yml`;
}
function IC(e, t, r) {
  const n = Jl(`${e.pathname}.blockmap`, e);
  return [Jl(`${e.pathname.replace(new RegExp(TC(r), "g"), t)}.blockmap`, e), n];
}
var De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.Provider = void 0;
De.findFile = DC;
De.parseUpdateInfo = NC;
De.getFileList = Fp;
De.resolveFiles = FC;
const Lr = Be, $C = je, Wf = Et;
class OC {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Lr.configureRequestUrl)(t, n), n;
  }
}
De.Provider = OC;
function DC(e, t, r) {
  if (e.length === 0)
    throw (0, Lr.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function NC(e, t, r) {
  if (e == null)
    throw (0, Lr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, $C.load)(e);
  } catch (i) {
    throw (0, Lr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Fp(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, Lr.newError)(`No files provided: ${(0, Lr.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function FC(e, t, r = (n) => n) {
  const i = Fp(e).map((u) => {
    if (u.sha2 == null && u.sha512 == null)
      throw (0, Lr.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Lr.safeStringifyJson)(u)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Wf.newUrlFromBase)(r(u.url), t),
      info: u
    };
  }), a = e.packages, s = a == null ? null : a[process.arch] || a.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Wf.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(vo, "__esModule", { value: !0 });
vo.GenericProvider = void 0;
const Hf = Be, vl = Et, Cl = De;
class kC extends Cl.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, vl.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, vl.getChannelFilename)(this.channel), r = (0, vl.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Cl.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Hf.HttpError && i.statusCode === 404)
          throw (0, Hf.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((a, s) => {
            try {
              setTimeout(a, 1e3 * n);
            } catch (u) {
              s(u);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Cl.resolveFiles)(t, this.baseUrl);
  }
}
vo.GenericProvider = kC;
var Ss = {}, vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
vs.BitbucketProvider = void 0;
const zf = Be, Rl = Et, Tl = De;
class LC extends Tl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, Rl.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new zf.CancellationToken(), r = (0, Rl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Rl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Tl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, zf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Tl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
vs.BitbucketProvider = LC;
var xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.GitHubProvider = xr.BaseGitHubProvider = void 0;
xr.computeReleaseNotes = Lp;
const sr = Be, Qn = $p, xC = si, Kn = Et, Zl = De, Al = /\/tag\/([^/]+)$/;
class kp extends Zl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Kn.newBaseUrl)((0, sr.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Kn.newBaseUrl)((0, sr.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
xr.BaseGitHubProvider = kp;
class UC extends kp {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const s = new sr.CancellationToken(), u = await this.httpRequest((0, Kn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, sr.parseXml)(u);
    let g = c.element("entry", !1, "No published versions on GitHub"), f = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Qn.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (A === null)
          f = Al.exec(g.element("link").attribute("href"))[1];
        else
          for (const I of c.getElements("entry")) {
            const $ = Al.exec(I.element("link").attribute("href"));
            if ($ === null)
              continue;
            const M = $[1], x = ((n = Qn.prerelease(M)) === null || n === void 0 ? void 0 : n[0]) || null, te = !A || ["alpha", "beta"].includes(A), ae = x !== null && !["alpha", "beta"].includes(String(x));
            if (te && !ae && !(A === "beta" && x === "alpha")) {
              f = M;
              break;
            }
            if (x && x === A) {
              f = M;
              break;
            }
          }
      } else {
        f = await this.getLatestTagName(s);
        for (const A of c.getElements("entry"))
          if (Al.exec(A.element("link").attribute("href"))[1] === f) {
            g = A;
            break;
          }
      }
    } catch (A) {
      throw (0, sr.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${u}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (f == null)
      throw (0, sr.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let h, m = "", b = "";
    const E = async (A) => {
      m = (0, Kn.getChannelFilename)(A), b = (0, Kn.newUrlFromBase)(this.getBaseDownloadPath(String(f), m), this.baseUrl);
      const I = this.createRequestOptions(b);
      try {
        return await this.executor.request(I, s);
      } catch ($) {
        throw $ instanceof sr.HttpError && $.statusCode === 404 ? (0, sr.newError)(`Cannot find ${m} in the latest release artifacts (${b}): ${$.stack || $.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : $;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Qn.prerelease(f)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((a = Qn.prerelease(f)) === null || a === void 0 ? void 0 : a[0]))), h = await E(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        h = await E(this.getDefaultChannelName());
      else
        throw A;
    }
    const C = (0, Zl.parseUpdateInfo)(h, m, b);
    return C.releaseName == null && (C.releaseName = g.elementValueOrEmpty("title")), C.releaseNotes == null && (C.releaseNotes = Lp(this.updater.currentVersion, this.updater.fullChangelog, c, g)), {
      tag: f,
      ...C
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Kn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new xC.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, sr.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Zl.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
xr.GitHubProvider = UC;
function Gf(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Lp(e, t, r, n) {
  if (!t)
    return Gf(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    Qn.lt(e, s) && i.push({
      version: s,
      note: Gf(a)
    });
  }
  return i.sort((a, s) => Qn.rcompare(a.version, s.version));
}
var Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.KeygenProvider = void 0;
const Vf = Be, Pl = Et, Il = De;
class BC extends Il.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Pl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Vf.CancellationToken(), r = (0, Pl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Pl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Il.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Vf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Il.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Cs.KeygenProvider = BC;
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
Rs.PrivateGitHubProvider = void 0;
const Wn = Be, MC = je, qC = ve, Yf = si, Xf = Et, jC = xr, WC = De;
class HC extends jC.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Wn.CancellationToken(), r = (0, Xf.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((u) => u.name === r);
    if (i == null)
      throw (0, Wn.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new Yf.URL(i.url);
    let s;
    try {
      s = (0, MC.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
    } catch (u) {
      throw u instanceof Wn.HttpError && u.statusCode === 404 ? (0, Wn.newError)(`Cannot find ${r} in the latest release artifacts (${a}): ${u.stack || u.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : u;
    }
    return s.assets = n.assets, s;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, Xf.newUrlFromBase)(n, this.baseUrl);
    try {
      const a = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? a.find((s) => s.prerelease) || a[0] : a;
    } catch (a) {
      throw (0, Wn.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, WC.getFileList)(t).map((r) => {
      const n = qC.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, Wn.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Yf.URL(i.url),
        info: r
      };
    });
  }
}
Rs.PrivateGitHubProvider = HC;
Object.defineProperty(Ss, "__esModule", { value: !0 });
Ss.isUrlProbablySupportMultiRangeRequests = xp;
Ss.createClient = XC;
const Pa = Be, zC = vs, Qf = vo, GC = xr, VC = Cs, YC = Rs;
function xp(e) {
  return !e.includes("s3.amazonaws.com");
}
function XC(e, t, r) {
  if (typeof e == "string")
    throw (0, Pa.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new GC.GitHubProvider(i, t, r) : new YC.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new zC.BitbucketProvider(e, t, r);
    case "keygen":
      return new VC.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Qf.GenericProvider({
        provider: "generic",
        url: (0, Pa.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Qf.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && xp(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, Pa.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, Pa.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Ts = {}, Co = {}, fi = {}, mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.OperationKind = void 0;
mn.computeOperations = QC;
var an;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(an || (mn.OperationKind = an = {}));
function QC(e, t, r) {
  const n = Jf(e.files), i = Jf(t.files);
  let a = null;
  const s = t.files[0], u = [], c = s.name, g = n.get(c);
  if (g == null)
    throw new Error(`no file ${c} in old blockmap`);
  const f = i.get(c);
  let h = 0;
  const { checksumToOffset: m, checksumToOldSize: b } = JC(n.get(c), g.offset, r);
  let E = s.offset;
  for (let C = 0; C < f.checksums.length; E += f.sizes[C], C++) {
    const A = f.sizes[C], I = f.checksums[C];
    let $ = m.get(I);
    $ != null && b.get(I) !== A && (r.warn(`Checksum ("${I}") matches, but size differs (old: ${b.get(I)}, new: ${A})`), $ = void 0), $ === void 0 ? (h++, a != null && a.kind === an.DOWNLOAD && a.end === E ? a.end += A : (a = {
      kind: an.DOWNLOAD,
      start: E,
      end: E + A
      // oldBlocks: null,
    }, Kf(a, u, I, C))) : a != null && a.kind === an.COPY && a.end === $ ? a.end += A : (a = {
      kind: an.COPY,
      start: $,
      end: $ + A
      // oldBlocks: [checksum]
    }, Kf(a, u, I, C));
  }
  return h > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${h} changed blocks`), u;
}
const KC = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Kf(e, t, r, n) {
  if (KC && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((s, u) => s < u ? s : u);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${an[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function JC(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let a = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const u = e.checksums[s], c = e.sizes[s], g = i.get(u);
    if (g === void 0)
      n.set(u, a), i.set(u, c);
    else if (r.debug != null) {
      const f = g === c ? "(same size)" : `(size: ${g}, this size: ${c})`;
      r.debug(`${u} duplicated in blockmap ${f}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    a += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Jf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.DataSplitter = void 0;
fi.copyData = Up;
const Ia = Be, ZC = Ur, eR = po, tR = mn, Zf = Buffer.from(`\r
\r
`);
var Ar;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Ar || (Ar = {}));
function Up(e, t, r, n, i) {
  const a = (0, ZC.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  a.on("error", n), a.once("end", i), a.pipe(t, {
    end: !1
  });
}
class rR extends eR.Writable {
  constructor(t, r, n, i, a, s) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = Ar.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Ia.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Ar.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Ar.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Ar.BODY)
          this.readState = Ar.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Ia.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const u = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (u < s)
            await this.copyExistingData(u, s);
          else if (u > s)
            throw (0, Ia.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Ar.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, a = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, a), this.remainingPartDataCount = n - (a - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const a = () => {
        if (t === r) {
          n();
          return;
        }
        const s = this.options.tasks[t];
        if (s.kind !== tR.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Up(s, this.out, this.options.oldFileFd, i, () => {
          t++, a();
        });
      };
      a();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Zf, r);
    if (n !== -1)
      return n + Zf.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Ia.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((a, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), a();
      });
    });
  }
}
fi.DataSplitter = rR;
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
As.executeTasksUsingMultipleRangeRequests = nR;
As.checkIsRangesSupported = tu;
const eu = Be, ed = fi, td = mn;
function nR(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const u = s + 1e3;
    iR(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, u),
      oldFileFd: n
    }, r, () => a(u), i);
  };
  return a;
}
function iR(e, t, r, n, i) {
  let a = "bytes=", s = 0;
  const u = /* @__PURE__ */ new Map(), c = [];
  for (let h = t.start; h < t.end; h++) {
    const m = t.tasks[h];
    m.kind === td.OperationKind.DOWNLOAD && (a += `${m.start}-${m.end - 1}, `, u.set(s, h), s++, c.push(m.end - m.start));
  }
  if (s <= 1) {
    const h = (m) => {
      if (m >= t.end) {
        n();
        return;
      }
      const b = t.tasks[m++];
      if (b.kind === td.OperationKind.COPY)
        (0, ed.copyData)(b, r, t.oldFileFd, i, () => h(m));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${b.start}-${b.end - 1}`;
        const C = e.httpExecutor.createRequest(E, (A) => {
          tu(A, i) && (A.pipe(r, {
            end: !1
          }), A.once("end", () => h(m)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(C, i), C.end();
      }
    };
    h(t.start);
    return;
  }
  const g = e.createRequestOptions();
  g.headers.Range = a.substring(0, a.length - 2);
  const f = e.httpExecutor.createRequest(g, (h) => {
    if (!tu(h, i))
      return;
    const m = (0, eu.safeGetHeader)(h, "content-type"), b = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(m);
    if (b == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const E = new ed.DataSplitter(r, t, u, b[1] || b[2], c, n);
    E.on("error", i), h.pipe(E), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function tu(e, t) {
  if (e.statusCode >= 400)
    return t((0, eu.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, eu.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
Ps.ProgressDifferentialDownloadCallbackTransform = void 0;
const oR = po;
var Jn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Jn || (Jn = {}));
class aR extends oR.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Jn.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Jn.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = Jn.COPY;
  }
  beginRangeDownload() {
    this.operationType = Jn.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ps.ProgressDifferentialDownloadCallbackTransform = aR;
Object.defineProperty(Co, "__esModule", { value: !0 });
Co.DifferentialDownloader = void 0;
const ki = Be, $l = Br, sR = Ur, lR = fi, uR = si, $a = mn, rd = As, cR = Ps;
class fR {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, ki.configureRequestUrl)(this.options.newUrl, t), (0, ki.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, $a.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const c of i) {
      const g = c.end - c.start;
      c.kind === $a.OperationKind.DOWNLOAD ? a += g : s += g;
    }
    const u = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== u)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${u}`);
    return n.info(`Full: ${nd(u)}, To download: ${nd(a)} (${Math.round(a / (u / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, $l.close)(i.descriptor).catch((a) => {
      this.logger.error(`cannot close file "${i.path}": ${a}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((a) => {
      try {
        this.logger.error(`cannot close files: ${a}`);
      } catch (s) {
        try {
          console.error(s);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, $l.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, $l.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, sR.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, u) => {
      const c = [];
      let g;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const I = [];
        let $ = 0;
        for (const x of t)
          x.kind === $a.OperationKind.DOWNLOAD && (I.push(x.end - x.start), $ += x.end - x.start);
        const M = {
          expectedByteCounts: I,
          grandTotal: $
        };
        g = new cR.ProgressDifferentialDownloadCallbackTransform(M, this.options.cancellationToken, this.options.onProgress), c.push(g);
      }
      const f = new ki.DigestTransform(this.blockAwareFileInfo.sha512);
      f.isValidateOnEnd = !1, c.push(f), a.on("finish", () => {
        a.close(() => {
          r.splice(1, 1);
          try {
            f.validate();
          } catch (I) {
            u(I);
            return;
          }
          s(void 0);
        });
      }), c.push(a);
      let h = null;
      for (const I of c)
        I.on("error", u), h == null ? h = I : h = h.pipe(I);
      const m = c[0];
      let b;
      if (this.options.isUseMultipleRangeRequest) {
        b = (0, rd.executeTasksUsingMultipleRangeRequests)(this, t, m, n, u), b(0);
        return;
      }
      let E = 0, C = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", b = (I) => {
        var $, M;
        if (I >= t.length) {
          this.fileMetadataBuffer != null && m.write(this.fileMetadataBuffer), m.end();
          return;
        }
        const x = t[I++];
        if (x.kind === $a.OperationKind.COPY) {
          g && g.beginFileCopy(), (0, lR.copyData)(x, m, n, u, () => b(I));
          return;
        }
        const te = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = te, (M = ($ = this.logger) === null || $ === void 0 ? void 0 : $.debug) === null || M === void 0 || M.call($, `download range: ${te}`), g && g.beginRangeDownload();
        const ae = this.httpExecutor.createRequest(A, (Q) => {
          Q.on("error", u), Q.on("aborted", () => {
            u(new Error("response has been aborted by the server"));
          }), Q.statusCode >= 400 && u((0, ki.createHttpError)(Q)), Q.pipe(m, {
            end: !1
          }), Q.once("end", () => {
            g && g.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => b(I), 1e3)) : b(I);
          });
        });
        ae.on("redirect", (Q, Ne, S) => {
          this.logger.info(`Redirect to ${dR(S)}`), C = S, (0, ki.configureRequestUrl)(new uR.URL(C), A), ae.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(ae, u), ae.end();
      }, b(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let a = 0;
    if (await this.request(i, (s) => {
      s.copy(n, a), a += s.length;
    }), a !== n.length)
      throw new Error(`Received data length ${a} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const a = this.httpExecutor.createRequest(t, (s) => {
        (0, rd.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
Co.DifferentialDownloader = fR;
function nd(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function dR(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.GenericDifferentialDownloader = void 0;
const hR = Co;
class pR extends hR.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Ts.GenericDifferentialDownloader = pR;
var Mr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Be;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(a) {
      this.emitter = a;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(a) {
      n(this.emitter, "login", a);
    }
    progress(a) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, a);
    }
    updateDownloaded(a) {
      n(this.emitter, e.UPDATE_DOWNLOADED, a);
    }
    updateCancelled(a) {
      n(this.emitter, "update-cancelled", a);
    }
  }
  e.UpdaterSignal = r;
  function n(i, a, s) {
    i.on(a, s);
  }
})(Mr);
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.NoOpLogger = Nr.AppUpdater = void 0;
const Xe = Be, mR = mo, gR = os, yR = Td, Hn = Br, bR = je, Ol = ms, tn = ve, nn = $p, id = So, wR = Es, od = Op, _R = vo, Dl = Ss, ER = Pd, SR = Et, vR = Ts, zn = Mr;
class xu extends yR.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Xe.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Xe.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, od.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Bp();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Ol.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new zn.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new Ol.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Ol.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new wR.ElectronAppAdapter(), this.httpExecutor = new od.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, nn.parse)(n);
    if (i == null)
      throw (0, Xe.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = CR(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new _R.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Dl.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Dl.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = xu.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new fn.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, s = Xe.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, nn.parse)(t.version);
    if (r == null)
      throw (0, Xe.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, nn.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, nn.gt)(r, n), s = (0, nn.lt)(r, n);
    return a ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, gR.release)();
    if (r)
      try {
        if ((0, nn.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Dl.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new Xe.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Xe.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Xe.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Xe.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Xe.CancellationError))
        try {
          this.dispatchError(i);
        } catch (a) {
          this._logger.warn(`Cannot dispatch error event: ${a.stack || a}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(zn.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, bR.load)(await (0, Hn.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = tn.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Hn.readFile)(t, "utf-8");
      if (Xe.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Xe.UUID.v5((0, mR.randomBytes)(4096), Xe.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Hn.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = tn.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new id.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(zn.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = ($) => this.emit(zn.DOWNLOAD_PROGRESS, $));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = r.packageInfo;
    function u() {
      const $ = decodeURIComponent(t.fileInfo.url.pathname);
      return $.endsWith(`.${t.fileExtension}`) ? tn.basename($) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), g = c.cacheDirForPendingUpdate;
    await (0, Hn.mkdir)(g, { recursive: !0 });
    const f = u();
    let h = tn.join(g, f);
    const m = s == null ? null : tn.join(g, `package-${a}${tn.extname(s.path) || ".7z"}`), b = async ($) => (await c.setDownloadedFile(h, m, i, r, f, $), await t.done({
      ...i,
      downloadedFile: h
    }), m == null ? [h] : [h, m]), E = this._logger, C = await c.validateDownloadedPath(h, i, r, E);
    if (C != null)
      return h = C, await b(!1);
    const A = async () => (await c.clear().catch(() => {
    }), await (0, Hn.unlink)(h).catch(() => {
    })), I = await (0, id.createTempUpdateFile)(`temp-${f}`, g, E);
    try {
      await t.task(I, n, m, A), await (0, Xe.retry)(() => (0, Hn.rename)(I, h), 60, 500, 0, 0, ($) => $ instanceof Error && /^EBUSY:/.test($.message));
    } catch ($) {
      throw await A(), $ instanceof Xe.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), $;
    }
    return E.info(`New version ${a} has been downloaded to ${h}`), await b(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, SR.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const u = async (f) => {
        const h = await this.httpExecutor.downloadToBuffer(f, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (h == null || h.length === 0)
          throw new Error(`Blockmap "${f.href}" is empty`);
        try {
          return JSON.parse((0, ER.gunzipSync)(h).toString());
        } catch (m) {
          throw new Error(`Cannot parse blockmap "${f.href}", error: ${m}`);
        }
      }, c = {
        newUrl: t.url,
        oldFile: tn.join(this.downloadedUpdateHelper.cacheDir, a),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(zn.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (f) => this.emit(zn.DOWNLOAD_PROGRESS, f));
      const g = await Promise.all(s.map((f) => u(f)));
      return await new vR.GenericDifferentialDownloader(t.info, this.httpExecutor, c).download(g[0], g[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
Nr.AppUpdater = xu;
function CR(e) {
  const t = (0, nn.prerelease)(e);
  return t != null && t.length > 0;
}
class Bp {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
Nr.NoOpLogger = Bp;
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.BaseUpdater = void 0;
const ad = is, RR = Nr;
class TR extends RR.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      fn.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, a = n == null ? null : n.downloadedFileInfo;
    if (i == null || a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: a.isAdminRightsRequired
      });
    } catch (s) {
      return this.dispatchError(s), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, r = `"${t} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [n];
    return /kdesudo/i.test(n) ? (i.push("--comment", r), i.push("-c")) : /gksudo/i.test(n) ? i.push("--message", r) : /pkexec/i.test(n) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, ad.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: a, status: s, stdout: u, stderr: c } = i;
    if (a != null)
      throw this._logger.error(c), a;
    if (s != null && s !== 0)
      throw this._logger.error(c), new Error(`Command ${t} exited with code ${s}`);
    return u.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((a, s) => {
      try {
        const u = { stdio: i, env: n, detached: !0 }, c = (0, ad.spawn)(t, r, u);
        c.on("error", (g) => {
          s(g);
        }), c.unref(), c.pid !== void 0 && a(!0);
      } catch (u) {
        s(u);
      }
    });
  }
}
dr.BaseUpdater = TR;
var io = {}, Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Gn = Br, AR = Co, PR = Pd;
class IR extends AR.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Mp(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await $R(this.options.oldFile), i);
  }
}
Ro.FileWithEmbeddedBlockMapDifferentialDownloader = IR;
function Mp(e) {
  return JSON.parse((0, PR.inflateRawSync)(e).toString());
}
async function $R(e) {
  const t = await (0, Gn.open)(e, "r");
  try {
    const r = (await (0, Gn.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Gn.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Gn.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Gn.close)(t), Mp(i);
  } catch (r) {
    throw await (0, Gn.close)(t), r;
  }
}
Object.defineProperty(io, "__esModule", { value: !0 });
io.AppImageUpdater = void 0;
const sd = Be, ld = is, OR = Br, DR = Ur, Li = ve, NR = dr, FR = Ro, kR = De, ud = Mr;
class LR extends NR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, kR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, sd.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, OR.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, a) {
    try {
      const s = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: a.requestHeaders,
        cancellationToken: a.cancellationToken
      };
      return this.listenerCount(ud.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (u) => this.emit(ud.DOWNLOAD_PROGRESS, u)), await new FR.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, sd.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, DR.unlinkSync)(r);
    let n;
    const i = Li.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Li.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Li.join(Li.dirname(r), Li.basename(a)), (0, ld.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, ld.execFileSync)(n, [], { env: s })), !0;
  }
}
io.AppImageUpdater = LR;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
oo.DebUpdater = void 0;
const xR = dr, UR = De, cd = Mr;
class BR extends xR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, UR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(cd.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(cd.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const a = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
oo.DebUpdater = BR;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.PacmanUpdater = void 0;
const MR = dr, fd = Mr, qR = De;
class jR extends MR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, qR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(fd.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(fd.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const a = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
ao.PacmanUpdater = jR;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
so.RpmUpdater = void 0;
const WR = dr, dd = Mr, HR = De;
class zR extends WR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, HR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(dd.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(dd.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let s;
    return i ? s = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", a] : s = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", a], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${s.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
so.RpmUpdater = zR;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
lo.MacUpdater = void 0;
const hd = Be, Nl = Br, GR = Ur, pd = ve, VR = Zm, YR = Nr, XR = De, md = is, gd = mo;
class QR extends YR.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = fn.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let a = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), a = (0, md.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (h) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${h}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const m = (0, md.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${m}`), s = s || m;
    } catch (h) {
      n.warn(`uname shell command to check for arm64 failed: ${h}`);
    }
    s = s || process.arch === "arm64" || a;
    const u = (h) => {
      var m;
      return h.url.pathname.includes("arm64") || ((m = h.info.url) === null || m === void 0 ? void 0 : m.includes("arm64"));
    };
    s && r.some(u) ? r = r.filter((h) => s === u(h)) : r = r.filter((h) => !u(h));
    const c = (0, XR.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, hd.newError)(`ZIP file not provided: ${(0, hd.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const g = t.updateInfoAndProvider.provider, f = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (h, m) => {
        const b = pd.join(this.downloadedUpdateHelper.cacheDir, f), E = () => (0, Nl.pathExistsSync)(b) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let C = !0;
        E() && (C = await this.differentialDownloadInstaller(c, t, h, g, f)), C && await this.httpExecutor.download(c.url, h, m);
      },
      done: async (h) => {
        if (!t.disableDifferentialDownload)
          try {
            const m = pd.join(this.downloadedUpdateHelper.cacheDir, f);
            await (0, Nl.copyFile)(h.downloadedFile, m);
          } catch (m) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${m.message}`);
          }
        return this.updateDownloaded(c, h);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Nl.stat)(i)).size, s = this._logger, u = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${u})`), this.server = (0, VR.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${u})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${u})`);
    });
    const c = (g) => {
      const f = g.address();
      return typeof f == "string" ? f : `http://127.0.0.1:${f == null ? void 0 : f.port}`;
    };
    return await new Promise((g, f) => {
      const h = (0, gd.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), m = Buffer.from(`autoupdater:${h}`, "ascii"), b = `/${(0, gd.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (E, C) => {
        const A = E.url;
        if (s.info(`${A} requested`), A === "/") {
          if (!E.headers.authorization || E.headers.authorization.indexOf("Basic ") === -1) {
            C.statusCode = 401, C.statusMessage = "Invalid Authentication Credentials", C.end(), s.warn("No authenthication info");
            return;
          }
          const M = E.headers.authorization.split(" ")[1], x = Buffer.from(M, "base64").toString("ascii"), [te, ae] = x.split(":");
          if (te !== "autoupdater" || ae !== h) {
            C.statusCode = 401, C.statusMessage = "Invalid Authentication Credentials", C.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const Q = Buffer.from(`{ "url": "${c(this.server)}${b}" }`);
          C.writeHead(200, { "Content-Type": "application/json", "Content-Length": Q.length }), C.end(Q);
          return;
        }
        if (!A.startsWith(b)) {
          s.warn(`${A} requested, but not supported`), C.writeHead(404), C.end();
          return;
        }
        s.info(`${b} requested by Squirrel.Mac, pipe ${i}`);
        let I = !1;
        C.on("finish", () => {
          I || (this.nativeUpdater.removeListener("error", f), g([]));
        });
        const $ = (0, GR.createReadStream)(i);
        $.on("error", (M) => {
          try {
            C.end();
          } catch (x) {
            s.warn(`cannot end response: ${x}`);
          }
          I = !0, this.nativeUpdater.removeListener("error", f), f(new Error(`Cannot pipe "${i}": ${M}`));
        }), C.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), $.pipe(C);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${u})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${u})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${m.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", f), this.nativeUpdater.checkForUpdates()) : g([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
lo.MacUpdater = QR;
var uo = {}, Uu = {};
Object.defineProperty(Uu, "__esModule", { value: !0 });
Uu.verifySignature = JR;
const yd = Be, qp = is, KR = os, bd = ve;
function JR(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, qp.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, u, c) => {
      var g;
      try {
        if (s != null || c) {
          Fl(r, s, c, i), n(null);
          return;
        }
        const f = ZR(u);
        if (f.Status === 0) {
          try {
            const E = bd.normalize(f.Path), C = bd.normalize(t);
            if (r.info(`LiteralPath: ${E}. Update Path: ${C}`), E !== C) {
              Fl(r, new Error(`LiteralPath of ${E} is different than ${C}`), c, i), n(null);
              return;
            }
          } catch (E) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(g = E.message) !== null && g !== void 0 ? g : E.stack}`);
          }
          const m = (0, yd.parseDn)(f.SignerCertificate.Subject);
          let b = !1;
          for (const E of e) {
            const C = (0, yd.parseDn)(E);
            if (C.size ? b = Array.from(C.keys()).every((I) => C.get(I) === m.get(I)) : E === m.get("CN") && (r.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), b = !0), b) {
              n(null);
              return;
            }
          }
        }
        const h = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(f, (m, b) => m === "RawData" ? void 0 : b, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${h}`), n(h);
      } catch (f) {
        Fl(r, f, null, i), n(null);
        return;
      }
    });
  });
}
function ZR(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Fl(e, t, r, n) {
  if (eT()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, qp.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function eT() {
  const e = KR.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.NsisUpdater = void 0;
const Oa = Be, wd = ve, tT = dr, rT = Ro, _d = Mr, nT = De, iT = Br, oT = Uu, Ed = si;
class aT extends tT.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, oT.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, nT.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, u) => {
        const c = n.packageInfo, g = c != null && s != null;
        if (g && t.disableWebInstaller)
          throw (0, Oa.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !g && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (g || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Oa.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const f = await this.verifySignature(i);
        if (f != null)
          throw await u(), (0, Oa.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${f}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (g && await this.differentialDownloadWebPackage(t, c, s, r))
          try {
            await this.httpExecutor.download(new Ed.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (h) {
            try {
              await (0, iT.unlink)(s);
            } catch {
            }
            throw h;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const a = () => {
      this.spawnLog(wd.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(r, n).catch((s) => {
      const u = s.code;
      this._logger.info(`Cannot run installer: error code: ${u}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), u === "UNKNOWN" || u === "EACCES" ? a() : u === "ENOENT" ? fn.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const a = {
        newUrl: new Ed.URL(r.path),
        oldFile: wd.join(this.downloadedUpdateHelper.cacheDir, Oa.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(_d.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(_d.DOWNLOAD_PROGRESS, s)), await new rT.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
uo.NsisUpdater = aT;
(function(e) {
  var t = Ue && Ue.__createBinding || (Object.create ? function(A, I, $, M) {
    M === void 0 && (M = $);
    var x = Object.getOwnPropertyDescriptor(I, $);
    (!x || ("get" in x ? !I.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return I[$];
    } }), Object.defineProperty(A, M, x);
  } : function(A, I, $, M) {
    M === void 0 && (M = $), A[M] = I[$];
  }), r = Ue && Ue.__exportStar || function(A, I) {
    for (var $ in A) $ !== "default" && !Object.prototype.hasOwnProperty.call(I, $) && t(I, A, $);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Br, i = ve;
  var a = dr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var s = Nr;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var u = De;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return u.Provider;
  } });
  var c = io;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var g = oo;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return g.DebUpdater;
  } });
  var f = ao;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return f.PacmanUpdater;
  } });
  var h = so;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return h.RpmUpdater;
  } });
  var m = lo;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return m.MacUpdater;
  } });
  var b = uo;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return b.NsisUpdater;
  } }), r(Mr, e);
  let E;
  function C() {
    if (process.platform === "win32")
      E = new uo.NsisUpdater();
    else if (process.platform === "darwin")
      E = new lo.MacUpdater();
    else {
      E = new io.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(A))
          return E;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const I = (0, n.readFileSync)(A).toString().trim();
        switch (console.info("Found package-type:", I), I) {
          case "deb":
            E = new oo.DebUpdater();
            break;
          case "rpm":
            E = new so.RpmUpdater();
            break;
          case "pacman":
            E = new ao.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (A) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", A.message);
      }
    }
    return E;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => E || C()
  });
})(Fd);
let xi = null, Pr = !1;
function sT() {
  if (ri.isPackaged) {
    const e = Mi.join(process.resourcesPath, "assets", "icon.ico");
    return kl.existsSync(e) ? e : "";
  } else {
    const e = Mi.join(process.cwd(), "public", "icon.ico");
    return kl.existsSync(e) ? e : "";
  }
}
function Bu(e) {
  const t = sT();
  if (!t) {
    console.warn("[Tray] icon not found; check extraResources and paths");
    return;
  }
  const r = Hm.createFromPath(t);
  xi = new zm(r), xi.setToolTip("LoL Skin Picker");
  const n = () => {
    const s = e();
    s && (s.isVisible() ? s.hide() : (s.show(), s.focus()));
  }, i = () => {
    if (!ri.isPackaged) {
      wc.showMessageBox({
        type: "info",
        message: "Updates unavailable in dev"
      });
      return;
    }
    Pr = !0, Fd.autoUpdater.checkForUpdates().catch((s) => {
      wc.showErrorBox("Update error", (s == null ? void 0 : s.message) ?? String(s)), Pr = !1;
    });
  }, a = () => {
    const s = e(), c = !!s && s.isVisible() ? "Hide App" : "Show App", g = Cd.buildFromTemplate([
      { label: c, click: n },
      { type: "separator" },
      { label: "Check for Updates", click: i },
      { type: "separator" },
      { label: "Quit", role: "quit" }
    ]);
    xi.setContextMenu(g);
  };
  xi.on("click", n), xi.on("double-click", n), a(), Bu.refresh = a;
}
function lT() {
  const { autoUpdater: e } = require("electron-updater");
  e.on("checking-for-update", () => {
    if (Pr) {
      const { dialog: t } = require("electron");
      t.showMessageBox({ message: "Checking for updates…" });
    }
  }), e.on("update-available", (t) => {
    if (Pr) {
      const { dialog: r } = require("electron");
      r.showMessageBox({
        type: "info",
        message: "Update available",
        detail: `Version ${t.version} is being downloaded in the background.`
      });
    }
  }), e.on("update-not-available", () => {
    if (Pr) {
      const { dialog: t, app: r } = require("electron");
      t.showMessageBox({
        type: "info",
        message: "You're up to date",
        detail: `Current version: ${r.getVersion()}`
      }), Pr = !1;
    }
  }), e.on("download-progress", (t) => {
    console.log(`[Updater] ${Math.round(t.percent)} %`);
  }), e.on("update-downloaded", (t) => {
    const { dialog: r } = require("electron");
    Pr ? (Pr = !1, r.showMessageBox({
      type: "question",
      buttons: ["Install and Restart", "Later"],
      defaultId: 0,
      cancelId: 1,
      message: "Update ready",
      detail: `Version ${t.version} has been downloaded.`
    }).then(({ response: n }) => {
      n === 0 && e.quitAndInstall();
    })) : console.log("[Updater] downloaded – will install on quit");
  });
}
const jp = Qm(ri.getPath("userData"), "settings.json");
async function uT() {
  try {
    return JSON.parse(await iu.readFile(jp, "utf-8"));
  } catch {
    return {};
  }
}
async function cT(e) {
  try {
    await iu.writeFile(jp, JSON.stringify(e, null, 2), "utf-8");
  } catch {
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const ru = new Ll(), nu = new Ig(), xa = new Dg();
function fT(e, t, r) {
  const n = e.workArea, i = Math.floor(n.x + (n.width - t) / 2), a = Math.floor(n.y + (n.height - r) / 2);
  return { x: i, y: a };
}
async function dT() {
  const e = await uT(), t = $i.getAllDisplays(), r = 900, n = 645, i = t.find((f) => f.id === e.displayId) ?? $i.getDisplayNearestPoint($i.getCursorScreenPoint()) ?? $i.getPrimaryDisplay(), a = await Ng(), { x: s, y: u } = fT(i, r, n);
  a.setBounds({ x: s, y: u, width: r, height: n }), Cd.setApplicationMenu(null), Bu(sn);
  let c = null;
  const g = () => {
    const f = sn();
    if (!f) return;
    const h = $i.getDisplayMatching(f.getBounds());
    cT({ displayId: h.id }).catch(() => {
    });
  };
  a.on("move", () => {
    c && clearTimeout(c), c = setTimeout(g, 300);
  }), a.on("close", g), a.on("hide", g);
}
function hT() {
  ru.on("status", (e, t) => {
    var r, n, i;
    (r = sn()) == null || r.webContents.send("lcu-status", e), e === "connected" && t ? ((n = sn()) == null || n.show(), nu.setCreds(t), xa.setCreds(t), xa.start()) : (nu.stop(), xa.stop(), (i = sn()) == null || i.hide());
  });
}
ri.whenReady().then(async () => {
  await dT(), Bu(sn), Ug({ lcu: ru, gameflow: nu, skins: xa, getWin: sn }), hT(), lT(), ru.start();
});
ri.on("window-all-closed", () => process.platform !== "darwin" && ri.quit());
export {
  xl as F,
  ig as a
};
