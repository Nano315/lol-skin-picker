var Bm = Object.defineProperty;
var bc = (e) => {
  throw TypeError(e);
};
var Mm = (e, t, r) => t in e ? Bm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var $e = (e, t, r) => Mm(e, typeof t != "symbol" ? t + "" : t, r), _c = (e, t, r) => t.has(e) || bc("Cannot " + r);
var Le = (e, t, r) => (_c(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Ar = (e, t, r) => t.has(e) ? bc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ht = (e, t, r, n) => (_c(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import pn, { app as Lr, ipcMain as St, shell as qm, screen as Ni, BrowserWindow as jm, Menu as Cd, nativeImage as Wm, Tray as Hm, dialog as Kn } from "electron";
import { dirname as zm, join as qi } from "node:path";
import { format as Gm, fileURLToPath as Vm } from "node:url";
import Ym, { promises as ou } from "node:fs";
import { EventEmitter as au } from "node:events";
import Xi from "node:http";
import Xm from "node:https";
import Mn from "node:zlib";
import Vt, { PassThrough as Ma, pipeline as qn } from "node:stream";
import { Buffer as ze } from "node:buffer";
import { types as qa, deprecate as as, promisify as Qm } from "node:util";
import { isIP as Km } from "node:net";
import jr from "fs";
import Jm from "constants";
import yo from "stream";
import su from "util";
import Rd from "assert";
import Ce from "path";
import ss from "child_process";
import Td from "events";
import bo from "crypto";
import Ad from "tty";
import ls from "os";
import ci from "url";
import Zm from "string_decoder";
import Pd from "zlib";
import eg from "http";
const is = class is extends au {
  constructor() {
    super(...arguments);
    $e(this, "status", "disconnected");
    $e(this, "creds", null);
    $e(this, "timer", null);
    $e(this, "rawCache", "");
  }
  /* ---------- API publique ---------- */
  start(r = 2e3) {
    this.timer || (this.tick(), this.timer = setInterval(() => this.tick(), r));
  }
  /* ---------- cœur du watcher ---------- */
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
  /* ---------- utilitaires ---------- */
  readLockfile() {
    for (const r of is.FILES)
      try {
        return Ym.readFileSync(r, "utf8");
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
      // « https »
    };
  }
  /* -------- typings EventEmitter -------- */
  on(r, n) {
    return super.on(r, n);
  }
  emit(r, n, i) {
    return super.emit(r, n, i);
  }
};
// garde le contenu brut pour détecter tout changement
/** chemins possibles du lockfile */
$e(is, "FILES", [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile"
]);
let Bl = is;
function tg(e) {
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
var Be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ba = { exports: {} };
/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */
var wc;
function rg() {
  return wc || (wc = 1, function(e, t) {
    (function(r, n) {
      n(t);
    })(Be, function(r) {
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
        } catch (_) {
          return m(_);
        }
      }
      const se = 16384;
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
          let _ = d;
          d._elements.length === se - 1 && (_ = {
            _elements: [],
            _next: void 0
          }), d._elements.push(l), _ !== d && (this._back = _, d._next = _), ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const l = this._front;
          let d = l;
          const _ = this._cursor;
          let v = _ + 1;
          const P = l._elements, O = P[_];
          return v === se && (d = l._next, v = 0), --this._size, this._cursor = v, l !== d && (this._front = d), P[_] = void 0, O;
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
          let d = this._cursor, _ = this._front, v = _._elements;
          for (; (d !== v.length || _._next !== void 0) && !(d === v.length && (_ = _._next, v = _._elements, d = 0, v.length === 0)); )
            l(v[d]), ++d;
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const l = this._front, d = this._cursor;
          return l._elements[d];
        }
      }
      const Fe = Symbol("[[AbortSteps]]"), S = Symbol("[[ErrorSteps]]"), re = Symbol("[[CancelSteps]]"), Z = Symbol("[[PullSteps]]"), X = Symbol("[[ReleaseSteps]]");
      function fe(o, l) {
        o._ownerReadableStream = l, l._reader = o, l._state === "readable" ? N(o) : l._state === "closed" ? U(o) : q(o, l._storedError);
      }
      function L(o, l) {
        const d = o._ownerReadableStream;
        return At(d, l);
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
      const de = Number.isFinite || function(o) {
        return typeof o == "number" && isFinite(o);
      }, Te = Math.trunc || function(o) {
        return o < 0 ? Math.ceil(o) : Math.floor(o);
      };
      function Y(o) {
        return typeof o == "object" || typeof o == "function";
      }
      function Re(o, l) {
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
      function le(o, l, d) {
        if (o === void 0)
          throw new TypeError(`${l} is required in '${d}'.`);
      }
      function me(o) {
        return Number(o);
      }
      function we(o) {
        return o === 0 ? 0 : o;
      }
      function De(o) {
        return we(Te(o));
      }
      function Ae(o, l) {
        const _ = Number.MAX_SAFE_INTEGER;
        let v = Number(o);
        if (v = we(v), !de(v))
          throw new TypeError(`${l} is not a finite number`);
        if (v = De(v), v < 0 || v > _)
          throw new TypeError(`${l} is outside the accepted range of 0 to ${_}, inclusive`);
        return !de(v) || v === 0 ? 0 : v;
      }
      function yt(o, l) {
        if (!vr(o))
          throw new TypeError(`${l} is not a ReadableStream.`);
      }
      function be(o) {
        return new dt(o);
      }
      function it(o, l) {
        o._reader._readRequests.push(l);
      }
      function zr(o, l, d) {
        const v = o._reader._readRequests.shift();
        d ? v._closeSteps() : v._chunkSteps(l);
      }
      function Qt(o) {
        return o._reader._readRequests.length;
      }
      function mr(o) {
        const l = o._reader;
        return !(l === void 0 || !Ft(l));
      }
      class dt {
        constructor(l) {
          if (T(l, 1, "ReadableStreamDefaultReader"), yt(l, "First parameter"), Cr(l))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          fe(this, l), this._readRequests = new Q();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return Ft(this) ? this._closedPromise : m(Kt("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(l = void 0) {
          return Ft(this) ? this._ownerReadableStream === void 0 ? m(B("cancel")) : L(this, l) : m(Kt("cancel"));
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!Ft(this))
            return m(Kt("read"));
          if (this._ownerReadableStream === void 0)
            return m(B("read from"));
          let l, d;
          const _ = f((P, O) => {
            l = P, d = O;
          });
          return Gr(this, {
            _chunkSteps: (P) => l({ value: P, done: !1 }),
            _closeSteps: () => l({ value: void 0, done: !0 }),
            _errorSteps: (P) => d(P)
          }), _;
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
          if (!Ft(this))
            throw Kt("releaseLock");
          this._ownerReadableStream !== void 0 && Ds(this);
        }
      }
      Object.defineProperties(dt.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), s(dt.prototype.cancel, "cancel"), s(dt.prototype.read, "read"), s(dt.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(dt.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultReader",
        configurable: !0
      });
      function Ft(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readRequests") ? !1 : o instanceof dt;
      }
      function Gr(o, l) {
        const d = o._ownerReadableStream;
        d._disturbed = !0, d._state === "closed" ? l._closeSteps() : d._state === "errored" ? l._errorSteps(d._storedError) : d._readableStreamController[Z](l);
      }
      function Ds(o) {
        D(o);
        const l = new TypeError("Reader was released");
        Io(o, l);
      }
      function Io(o, l) {
        const d = o._readRequests;
        o._readRequests = new Q(), d.forEach((_) => {
          _._errorSteps(l);
        });
      }
      function Kt(o) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${o} can only be used on a ReadableStreamDefaultReader`);
      }
      const mi = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class gi {
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
          let d, _;
          const v = f((O, j) => {
            d = O, _ = j;
          });
          return Gr(l, {
            _chunkSteps: (O) => {
              this._ongoingPromise = void 0, M(() => d({ value: O, done: !1 }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0, this._isFinished = !0, D(l), d({ value: void 0, done: !0 });
            },
            _errorSteps: (O) => {
              this._ongoingPromise = void 0, this._isFinished = !0, D(l), _(O);
            }
          }), v;
        }
        _returnSteps(l) {
          if (this._isFinished)
            return Promise.resolve({ value: l, done: !0 });
          this._isFinished = !0;
          const d = this._reader;
          if (!this._preventCancel) {
            const _ = L(d, l);
            return D(d), I(_, () => ({ value: l, done: !0 }));
          }
          return D(d), h({ value: l, done: !0 });
        }
      }
      const ht = {
        next() {
          return yi(this) ? this._asyncIteratorImpl.next() : m(Oo("next"));
        },
        return(o) {
          return yi(this) ? this._asyncIteratorImpl.return(o) : m(Oo("return"));
        }
      };
      Object.setPrototypeOf(ht, mi);
      function $o(o, l) {
        const d = be(o), _ = new gi(d, l), v = Object.create(ht);
        return v._asyncIteratorImpl = _, v;
      }
      function yi(o) {
        if (!i(o) || !Object.prototype.hasOwnProperty.call(o, "_asyncIteratorImpl"))
          return !1;
        try {
          return o._asyncIteratorImpl instanceof gi;
        } catch {
          return !1;
        }
      }
      function Oo(o) {
        return new TypeError(`ReadableStreamAsyncIterator.${o} can only be used on a ReadableSteamAsyncIterator`);
      }
      const bi = Number.isNaN || function(o) {
        return o !== o;
      };
      var gr, _n, wn;
      function Vr(o) {
        return o.slice();
      }
      function kt(o, l, d, _, v) {
        new Uint8Array(o).set(new Uint8Array(d, _, v), l);
      }
      let bt = (o) => (typeof o.transfer == "function" ? bt = (l) => l.transfer() : typeof structuredClone == "function" ? bt = (l) => structuredClone(l, { transfer: [l] }) : bt = (l) => l, bt(o)), Lt = (o) => (typeof o.detached == "boolean" ? Lt = (l) => l.detached : Lt = (l) => l.byteLength === 0, Lt(o));
      function Do(o, l, d) {
        if (o.slice)
          return o.slice(l, d);
        const _ = d - l, v = new ArrayBuffer(_);
        return kt(v, 0, o, l, _), v;
      }
      function yr(o, l) {
        const d = o[l];
        if (d != null) {
          if (typeof d != "function")
            throw new TypeError(`${String(l)} is not a function`);
          return d;
        }
      }
      function Yr(o) {
        const l = {
          [Symbol.iterator]: () => o.iterator
        }, d = async function* () {
          return yield* l;
        }(), _ = d.next;
        return { iterator: d, nextMethod: _, done: !1 };
      }
      const Xr = (wn = (gr = Symbol.asyncIterator) !== null && gr !== void 0 ? gr : (_n = Symbol.for) === null || _n === void 0 ? void 0 : _n.call(Symbol, "Symbol.asyncIterator")) !== null && wn !== void 0 ? wn : "@@asyncIterator";
      function En(o, l = "sync", d) {
        if (d === void 0)
          if (l === "async") {
            if (d = yr(o, Xr), d === void 0) {
              const P = yr(o, Symbol.iterator), O = En(o, "sync", P);
              return Yr(O);
            }
          } else
            d = yr(o, Symbol.iterator);
        if (d === void 0)
          throw new TypeError("The object is not iterable");
        const _ = x(d, o, []);
        if (!i(_))
          throw new TypeError("The iterator method must return an object");
        const v = _.next;
        return { iterator: _, nextMethod: v, done: !1 };
      }
      function _i(o) {
        const l = x(o.nextMethod, o.iterator, []);
        if (!i(l))
          throw new TypeError("The iterator.next() method must return an object");
        return l;
      }
      function Qr(o) {
        return !!o.done;
      }
      function Ns(o) {
        return o.value;
      }
      function Fs(o) {
        return !(typeof o != "number" || bi(o) || o < 0);
      }
      function No(o) {
        const l = Do(o.buffer, o.byteOffset, o.byteOffset + o.byteLength);
        return new Uint8Array(l);
      }
      function wi(o) {
        const l = o._queue.shift();
        return o._queueTotalSize -= l.size, o._queueTotalSize < 0 && (o._queueTotalSize = 0), l.value;
      }
      function Ei(o, l, d) {
        if (!Fs(d) || d === 1 / 0)
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        o._queue.push({ value: l, size: d }), o._queueTotalSize += d;
      }
      function Fo(o) {
        return o._queue.peek().value;
      }
      function _t(o) {
        o._queue = new Q(), o._queueTotalSize = 0;
      }
      function xt(o) {
        return o === DataView;
      }
      function ks(o) {
        return xt(o.constructor);
      }
      function Ls(o) {
        return xt(o) ? 1 : o.BYTES_PER_ELEMENT;
      }
      class Jt {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!pt(this))
            throw Ri("view");
          return this._view;
        }
        respond(l) {
          if (!pt(this))
            throw Ri("respond");
          if (T(l, 1, "respond"), l = Ae(l, "First parameter"), this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Lt(this._view.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          Rn(this._associatedReadableByteStreamController, l);
        }
        respondWithNewView(l) {
          if (!pt(this))
            throw Ri("respondWithNewView");
          if (T(l, 1, "respondWithNewView"), !ArrayBuffer.isView(l))
            throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Lt(l.buffer))
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          Tn(this._associatedReadableByteStreamController, l);
        }
      }
      Object.defineProperties(Jt.prototype, {
        respond: { enumerable: !0 },
        respondWithNewView: { enumerable: !0 },
        view: { enumerable: !0 }
      }), s(Jt.prototype.respond, "respond"), s(Jt.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Jt.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBRequest",
        configurable: !0
      });
      class Ct {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!Zt(this))
            throw Jr("byobRequest");
          return Cn(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!Zt(this))
            throw Jr("desiredSize");
          return Ci(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!Zt(this))
            throw Jr("close");
          if (this._closeRequested)
            throw new TypeError("The stream has already been closed; do not close it again!");
          const l = this._controlledReadableByteStream._state;
          if (l !== "readable")
            throw new TypeError(`The stream (in ${l} state) is not in the readable state and cannot be closed`);
          Kr(this);
        }
        enqueue(l) {
          if (!Zt(this))
            throw Jr("enqueue");
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
          tr(this, l);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(l = void 0) {
          if (!Zt(this))
            throw Jr("error");
          ot(this, l);
        }
        /** @internal */
        [re](l) {
          ko(this), _t(this);
          const d = this._cancelAlgorithm(l);
          return vn(this), d;
        }
        /** @internal */
        [Z](l) {
          const d = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            wr(this, l);
            return;
          }
          const _ = this._autoAllocateChunkSize;
          if (_ !== void 0) {
            let v;
            try {
              v = new ArrayBuffer(_);
            } catch (O) {
              l._errorSteps(O);
              return;
            }
            const P = {
              buffer: v,
              bufferByteLength: _,
              byteOffset: 0,
              byteLength: _,
              bytesFilled: 0,
              minimumFill: 1,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(P);
          }
          it(d, l), er(this);
        }
        /** @internal */
        [X]() {
          if (this._pendingPullIntos.length > 0) {
            const l = this._pendingPullIntos.peek();
            l.readerType = "none", this._pendingPullIntos = new Q(), this._pendingPullIntos.push(l);
          }
        }
      }
      Object.defineProperties(Ct.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        byobRequest: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(Ct.prototype.close, "close"), s(Ct.prototype.enqueue, "enqueue"), s(Ct.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ct.prototype, Symbol.toStringTag, {
        value: "ReadableByteStreamController",
        configurable: !0
      });
      function Zt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledReadableByteStream") ? !1 : o instanceof Ct;
      }
      function pt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_associatedReadableByteStreamController") ? !1 : o instanceof Jt;
      }
      function er(o) {
        if (!Ms(o))
          return;
        if (o._pulling) {
          o._pullAgain = !0;
          return;
        }
        o._pulling = !0;
        const d = o._pullAlgorithm();
        E(d, () => (o._pulling = !1, o._pullAgain && (o._pullAgain = !1, er(o)), null), (_) => (ot(o, _), null));
      }
      function ko(o) {
        vi(o), o._pendingPullIntos = new Q();
      }
      function Si(o, l) {
        let d = !1;
        o._state === "closed" && (d = !0);
        const _ = Lo(l);
        l.readerType === "default" ? zr(o, _, d) : Mt(o, _, d);
      }
      function Lo(o) {
        const l = o.bytesFilled, d = o.elementSize;
        return new o.viewConstructor(o.buffer, o.byteOffset, l / d);
      }
      function Sn(o, l, d, _) {
        o._queue.push({ buffer: l, byteOffset: d, byteLength: _ }), o._queueTotalSize += _;
      }
      function Ut(o, l, d, _) {
        let v;
        try {
          v = Do(l, d, d + _);
        } catch (P) {
          throw ot(o, P), P;
        }
        Sn(o, v, 0, _);
      }
      function xo(o, l) {
        l.bytesFilled > 0 && Ut(o, l.buffer, l.byteOffset, l.bytesFilled), _r(o);
      }
      function Uo(o, l) {
        const d = Math.min(o._queueTotalSize, l.byteLength - l.bytesFilled), _ = l.bytesFilled + d;
        let v = d, P = !1;
        const O = _ % l.elementSize, j = _ - O;
        j >= l.minimumFill && (v = j - l.bytesFilled, P = !0);
        const J = o._queue;
        for (; v > 0; ) {
          const z = J.peek(), ne = Math.min(v, z.byteLength), oe = l.byteOffset + l.bytesFilled;
          kt(l.buffer, oe, z.buffer, z.byteOffset, ne), z.byteLength === ne ? J.shift() : (z.byteOffset += ne, z.byteLength -= ne), o._queueTotalSize -= ne, Bo(o, ne, l), v -= ne;
        }
        return P;
      }
      function Bo(o, l, d) {
        d.bytesFilled += l;
      }
      function Mo(o) {
        o._queueTotalSize === 0 && o._closeRequested ? (vn(o), Di(o._controlledReadableByteStream)) : er(o);
      }
      function vi(o) {
        o._byobRequest !== null && (o._byobRequest._associatedReadableByteStreamController = void 0, o._byobRequest._view = null, o._byobRequest = null);
      }
      function br(o) {
        for (; o._pendingPullIntos.length > 0; ) {
          if (o._queueTotalSize === 0)
            return;
          const l = o._pendingPullIntos.peek();
          Uo(o, l) && (_r(o), Si(o._controlledReadableByteStream, l));
        }
      }
      function xs(o) {
        const l = o._controlledReadableByteStream._reader;
        for (; l._readRequests.length > 0; ) {
          if (o._queueTotalSize === 0)
            return;
          const d = l._readRequests.shift();
          wr(o, d);
        }
      }
      function Us(o, l, d, _) {
        const v = o._controlledReadableByteStream, P = l.constructor, O = Ls(P), { byteOffset: j, byteLength: J } = l, z = d * O;
        let ne;
        try {
          ne = bt(l.buffer);
        } catch (ge) {
          _._errorSteps(ge);
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
          o._pendingPullIntos.push(oe), Go(v, _);
          return;
        }
        if (v._state === "closed") {
          const ge = new P(oe.buffer, oe.byteOffset, 0);
          _._closeSteps(ge);
          return;
        }
        if (o._queueTotalSize > 0) {
          if (Uo(o, oe)) {
            const ge = Lo(oe);
            Mo(o), _._chunkSteps(ge);
            return;
          }
          if (o._closeRequested) {
            const ge = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ot(o, ge), _._errorSteps(ge);
            return;
          }
        }
        o._pendingPullIntos.push(oe), Go(v, _), er(o);
      }
      function Bt(o, l) {
        l.readerType === "none" && _r(o);
        const d = o._controlledReadableByteStream;
        if (Ti(d))
          for (; Vo(d) > 0; ) {
            const _ = _r(o);
            Si(d, _);
          }
      }
      function Bs(o, l, d) {
        if (Bo(o, l, d), d.readerType === "none") {
          xo(o, d), br(o);
          return;
        }
        if (d.bytesFilled < d.minimumFill)
          return;
        _r(o);
        const _ = d.bytesFilled % d.elementSize;
        if (_ > 0) {
          const v = d.byteOffset + d.bytesFilled;
          Ut(o, d.buffer, v - _, _);
        }
        d.bytesFilled -= _, Si(o._controlledReadableByteStream, d), br(o);
      }
      function qo(o, l) {
        const d = o._pendingPullIntos.peek();
        vi(o), o._controlledReadableByteStream._state === "closed" ? Bt(o, d) : Bs(o, l, d), er(o);
      }
      function _r(o) {
        return o._pendingPullIntos.shift();
      }
      function Ms(o) {
        const l = o._controlledReadableByteStream;
        return l._state !== "readable" || o._closeRequested || !o._started ? !1 : !!(mr(l) && Qt(l) > 0 || Ti(l) && Vo(l) > 0 || Ci(o) > 0);
      }
      function vn(o) {
        o._pullAlgorithm = void 0, o._cancelAlgorithm = void 0;
      }
      function Kr(o) {
        const l = o._controlledReadableByteStream;
        if (!(o._closeRequested || l._state !== "readable")) {
          if (o._queueTotalSize > 0) {
            o._closeRequested = !0;
            return;
          }
          if (o._pendingPullIntos.length > 0) {
            const d = o._pendingPullIntos.peek();
            if (d.bytesFilled % d.elementSize !== 0) {
              const _ = new TypeError("Insufficient bytes to fill elements in the given buffer");
              throw ot(o, _), _;
            }
          }
          vn(o), Di(l);
        }
      }
      function tr(o, l) {
        const d = o._controlledReadableByteStream;
        if (o._closeRequested || d._state !== "readable")
          return;
        const { buffer: _, byteOffset: v, byteLength: P } = l;
        if (Lt(_))
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const O = bt(_);
        if (o._pendingPullIntos.length > 0) {
          const j = o._pendingPullIntos.peek();
          if (Lt(j.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          vi(o), j.buffer = bt(j.buffer), j.readerType === "none" && xo(o, j);
        }
        if (mr(d))
          if (xs(o), Qt(d) === 0)
            Sn(o, O, v, P);
          else {
            o._pendingPullIntos.length > 0 && _r(o);
            const j = new Uint8Array(O, v, P);
            zr(d, j, !1);
          }
        else Ti(d) ? (Sn(o, O, v, P), br(o)) : Sn(o, O, v, P);
        er(o);
      }
      function ot(o, l) {
        const d = o._controlledReadableByteStream;
        d._state === "readable" && (ko(o), _t(o), vn(o), ic(d, l));
      }
      function wr(o, l) {
        const d = o._queue.shift();
        o._queueTotalSize -= d.byteLength, Mo(o);
        const _ = new Uint8Array(d.buffer, d.byteOffset, d.byteLength);
        l._chunkSteps(_);
      }
      function Cn(o) {
        if (o._byobRequest === null && o._pendingPullIntos.length > 0) {
          const l = o._pendingPullIntos.peek(), d = new Uint8Array(l.buffer, l.byteOffset + l.bytesFilled, l.byteLength - l.bytesFilled), _ = Object.create(Jt.prototype);
          Wo(_, o, d), o._byobRequest = _;
        }
        return o._byobRequest;
      }
      function Ci(o) {
        const l = o._controlledReadableByteStream._state;
        return l === "errored" ? null : l === "closed" ? 0 : o._strategyHWM - o._queueTotalSize;
      }
      function Rn(o, l) {
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
        d.buffer = bt(d.buffer), qo(o, l);
      }
      function Tn(o, l) {
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
        d.buffer = bt(l.buffer), qo(o, v);
      }
      function jo(o, l, d, _, v, P, O) {
        l._controlledReadableByteStream = o, l._pullAgain = !1, l._pulling = !1, l._byobRequest = null, l._queue = l._queueTotalSize = void 0, _t(l), l._closeRequested = !1, l._started = !1, l._strategyHWM = P, l._pullAlgorithm = _, l._cancelAlgorithm = v, l._autoAllocateChunkSize = O, l._pendingPullIntos = new Q(), o._readableStreamController = l;
        const j = d();
        E(h(j), () => (l._started = !0, er(l), null), (J) => (ot(l, J), null));
      }
      function qs(o, l, d) {
        const _ = Object.create(Ct.prototype);
        let v, P, O;
        l.start !== void 0 ? v = () => l.start(_) : v = () => {
        }, l.pull !== void 0 ? P = () => l.pull(_) : P = () => h(void 0), l.cancel !== void 0 ? O = (J) => l.cancel(J) : O = () => h(void 0);
        const j = l.autoAllocateChunkSize;
        if (j === 0)
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        jo(o, _, v, P, O, d, j);
      }
      function Wo(o, l, d) {
        o._associatedReadableByteStreamController = l, o._view = d;
      }
      function Ri(o) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${o} can only be used on a ReadableStreamBYOBRequest`);
      }
      function Jr(o) {
        return new TypeError(`ReadableByteStreamController.prototype.${o} can only be used on a ReadableByteStreamController`);
      }
      function Ho(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.mode;
        return {
          mode: d === void 0 ? void 0 : An(d, `${l} has member 'mode' that`)
        };
      }
      function An(o, l) {
        if (o = `${o}`, o !== "byob")
          throw new TypeError(`${l} '${o}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return o;
      }
      function Er(o, l) {
        var d;
        Re(o, l);
        const _ = (d = o == null ? void 0 : o.min) !== null && d !== void 0 ? d : 1;
        return {
          min: Ae(_, `${l} has member 'min' that`)
        };
      }
      function zo(o) {
        return new qt(o);
      }
      function Go(o, l) {
        o._reader._readIntoRequests.push(l);
      }
      function Mt(o, l, d) {
        const v = o._reader._readIntoRequests.shift();
        d ? v._closeSteps(l) : v._chunkSteps(l);
      }
      function Vo(o) {
        return o._reader._readIntoRequests.length;
      }
      function Ti(o) {
        const l = o._reader;
        return !(l === void 0 || !rr(l));
      }
      class qt {
        constructor(l) {
          if (T(l, 1, "ReadableStreamBYOBReader"), yt(l, "First parameter"), Cr(l))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!Zt(l._readableStreamController))
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          fe(this, l), this._readIntoRequests = new Q();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return rr(this) ? this._closedPromise : m(Pn("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(l = void 0) {
          return rr(this) ? this._ownerReadableStream === void 0 ? m(B("cancel")) : L(this, l) : m(Pn("cancel"));
        }
        read(l, d = {}) {
          if (!rr(this))
            return m(Pn("read"));
          if (!ArrayBuffer.isView(l))
            return m(new TypeError("view must be an array buffer view"));
          if (l.byteLength === 0)
            return m(new TypeError("view must have non-zero byteLength"));
          if (l.buffer.byteLength === 0)
            return m(new TypeError("view's buffer must have non-zero byteLength"));
          if (Lt(l.buffer))
            return m(new TypeError("view's buffer has been detached"));
          let _;
          try {
            _ = Er(d, "options");
          } catch (z) {
            return m(z);
          }
          const v = _.min;
          if (v === 0)
            return m(new TypeError("options.min must be greater than 0"));
          if (ks(l)) {
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
          return Yo(this, l, v, {
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
          if (!rr(this))
            throw Pn("releaseLock");
          this._ownerReadableStream !== void 0 && nr(this);
        }
      }
      Object.defineProperties(qt.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), s(qt.prototype.cancel, "cancel"), s(qt.prototype.read, "read"), s(qt.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(qt.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBReader",
        configurable: !0
      });
      function rr(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readIntoRequests") ? !1 : o instanceof qt;
      }
      function Yo(o, l, d, _) {
        const v = o._ownerReadableStream;
        v._disturbed = !0, v._state === "errored" ? _._errorSteps(v._storedError) : Us(v._readableStreamController, l, d, _);
      }
      function nr(o) {
        D(o);
        const l = new TypeError("Reader was released");
        Ai(o, l);
      }
      function Ai(o, l) {
        const d = o._readIntoRequests;
        o._readIntoRequests = new Q(), d.forEach((_) => {
          _._errorSteps(l);
        });
      }
      function Pn(o) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${o} can only be used on a ReadableStreamBYOBReader`);
      }
      function jt(o, l) {
        const { highWaterMark: d } = o;
        if (d === void 0)
          return l;
        if (bi(d) || d < 0)
          throw new RangeError("Invalid highWaterMark");
        return d;
      }
      function In(o) {
        const { size: l } = o;
        return l || (() => 1);
      }
      function Sr(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.highWaterMark, _ = o == null ? void 0 : o.size;
        return {
          highWaterMark: d === void 0 ? void 0 : me(d),
          size: _ === void 0 ? void 0 : js(_, `${l} has member 'size' that`)
        };
      }
      function js(o, l) {
        return y(o, l), (d) => me(o(d));
      }
      function Xo(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.abort, _ = o == null ? void 0 : o.close, v = o == null ? void 0 : o.start, P = o == null ? void 0 : o.type, O = o == null ? void 0 : o.write;
        return {
          abort: d === void 0 ? void 0 : Qo(d, o, `${l} has member 'abort' that`),
          close: _ === void 0 ? void 0 : Ko(_, o, `${l} has member 'close' that`),
          start: v === void 0 ? void 0 : Zr(v, o, `${l} has member 'start' that`),
          write: O === void 0 ? void 0 : Jo(O, o, `${l} has member 'write' that`),
          type: P
        };
      }
      function Qo(o, l, d) {
        return y(o, d), (_) => te(o, l, [_]);
      }
      function Ko(o, l, d) {
        return y(o, d), () => te(o, l, []);
      }
      function Zr(o, l, d) {
        return y(o, d), (_) => x(o, l, [_]);
      }
      function Jo(o, l, d) {
        return y(o, d), (_, v) => te(o, l, [_, v]);
      }
      function Zo(o, l) {
        if (!K(o))
          throw new TypeError(`${l} is not a WritableStream.`);
      }
      function Ws(o) {
        if (typeof o != "object" || o === null)
          return !1;
        try {
          return typeof o.aborted == "boolean";
        } catch {
          return !1;
        }
      }
      const Hs = typeof AbortController == "function";
      function w() {
        if (Hs)
          return new AbortController();
      }
      class R {
        constructor(l = {}, d = {}) {
          l === void 0 ? l = null : F(l, "First parameter");
          const _ = Sr(d, "Second parameter"), v = Xo(l, "First parameter");
          if (pe(this), v.type !== void 0)
            throw new RangeError("Invalid type is specified");
          const O = In(_), j = jt(_, 1);
          Gp(this, v, j, O);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!K(this))
            throw ia("locked");
          return he(this);
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
          return K(this) ? he(this) ? m(new TypeError("Cannot abort a stream that already has a writer")) : Se(this, l) : m(ia("abort"));
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
          return K(this) ? he(this) ? m(new TypeError("Cannot close a stream that already has a writer")) : ke(this) ? m(new TypeError("Cannot close an already-closing stream")) : Pe(this) : m(ia("close"));
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
            throw ia("getWriter");
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
        return new ir(o);
      }
      function W(o, l, d, _, v = 1, P = () => 1) {
        const O = Object.create(R.prototype);
        pe(O);
        const j = Object.create(Dn.prototype);
        return Gu(O, j, o, l, d, _, v, P), O;
      }
      function pe(o) {
        o._state = "writable", o._storedError = void 0, o._writer = void 0, o._writableStreamController = void 0, o._writeRequests = new Q(), o._inFlightWriteRequest = void 0, o._closeRequest = void 0, o._inFlightCloseRequest = void 0, o._pendingAbortRequest = void 0, o._backpressure = !1;
      }
      function K(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_writableStreamController") ? !1 : o instanceof R;
      }
      function he(o) {
        return o._writer !== void 0;
      }
      function Se(o, l) {
        var d;
        if (o._state === "closed" || o._state === "errored")
          return h(void 0);
        o._writableStreamController._abortReason = l, (d = o._writableStreamController._abortController) === null || d === void 0 || d.abort(l);
        const _ = o._state;
        if (_ === "closed" || _ === "errored")
          return h(void 0);
        if (o._pendingAbortRequest !== void 0)
          return o._pendingAbortRequest._promise;
        let v = !1;
        _ === "erroring" && (v = !0, l = void 0);
        const P = f((O, j) => {
          o._pendingAbortRequest = {
            _promise: void 0,
            _resolve: O,
            _reject: j,
            _reason: l,
            _wasAlreadyErroring: v
          };
        });
        return o._pendingAbortRequest._promise = P, v || Ye(o, l), P;
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
        }), _ = o._writer;
        return _ !== void 0 && o._backpressure && l === "writable" && Ks(_), Vp(o._writableStreamController), d;
      }
      function Ee(o) {
        return f((d, _) => {
          const v = {
            _resolve: d,
            _reject: _
          };
          o._writeRequests.push(v);
        });
      }
      function qe(o, l) {
        if (o._state === "writable") {
          Ye(o, l);
          return;
        }
        Ie(o);
      }
      function Ye(o, l) {
        const d = o._writableStreamController;
        o._state = "erroring", o._storedError = l;
        const _ = o._writer;
        _ !== void 0 && ju(_, l), !ea(o) && d._started && Ie(o);
      }
      function Ie(o) {
        o._state = "errored", o._writableStreamController[S]();
        const l = o._storedError;
        if (o._writeRequests.forEach((v) => {
          v._reject(l);
        }), o._writeRequests = new Q(), o._pendingAbortRequest === void 0) {
          ta(o);
          return;
        }
        const d = o._pendingAbortRequest;
        if (o._pendingAbortRequest = void 0, d._wasAlreadyErroring) {
          d._reject(l), ta(o);
          return;
        }
        const _ = o._writableStreamController[Fe](d._reason);
        E(_, () => (d._resolve(), ta(o), null), (v) => (d._reject(v), ta(o), null));
      }
      function at(o) {
        o._inFlightWriteRequest._resolve(void 0), o._inFlightWriteRequest = void 0;
      }
      function st(o, l) {
        o._inFlightWriteRequest._reject(l), o._inFlightWriteRequest = void 0, qe(o, l);
      }
      function Wt(o) {
        o._inFlightCloseRequest._resolve(void 0), o._inFlightCloseRequest = void 0, o._state === "erroring" && (o._storedError = void 0, o._pendingAbortRequest !== void 0 && (o._pendingAbortRequest._resolve(), o._pendingAbortRequest = void 0)), o._state = "closed";
        const d = o._writer;
        d !== void 0 && Qu(d);
      }
      function Rt(o, l) {
        o._inFlightCloseRequest._reject(l), o._inFlightCloseRequest = void 0, o._pendingAbortRequest !== void 0 && (o._pendingAbortRequest._reject(l), o._pendingAbortRequest = void 0), qe(o, l);
      }
      function ke(o) {
        return !(o._closeRequest === void 0 && o._inFlightCloseRequest === void 0);
      }
      function ea(o) {
        return !(o._inFlightWriteRequest === void 0 && o._inFlightCloseRequest === void 0);
      }
      function $n(o) {
        o._inFlightCloseRequest = o._closeRequest, o._closeRequest = void 0;
      }
      function On(o) {
        o._inFlightWriteRequest = o._writeRequests.shift();
      }
      function ta(o) {
        o._closeRequest !== void 0 && (o._closeRequest._reject(o._storedError), o._closeRequest = void 0);
        const l = o._writer;
        l !== void 0 && Xs(l, o._storedError);
      }
      function zs(o, l) {
        const d = o._writer;
        d !== void 0 && l !== o._backpressure && (l ? em(d) : Ks(d)), o._backpressure = l;
      }
      class ir {
        constructor(l) {
          if (T(l, 1, "WritableStreamDefaultWriter"), Zo(l, "First parameter"), he(l))
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = l, l._writer = this;
          const d = l._state;
          if (d === "writable")
            !ke(l) && l._backpressure ? aa(this) : Ku(this), oa(this);
          else if (d === "erroring")
            Qs(this, l._storedError), oa(this);
          else if (d === "closed")
            Ku(this), Jp(this);
          else {
            const _ = l._storedError;
            Qs(this, _), Xu(this, _);
          }
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the writer’s lock is released before the stream finishes closing.
         */
        get closed() {
          return en(this) ? this._closedPromise : m(tn("closed"));
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
          if (!en(this))
            throw tn("desiredSize");
          if (this._ownerWritableStream === void 0)
            throw Ii("desiredSize");
          return zp(this);
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
          return en(this) ? this._readyPromise : m(tn("ready"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        abort(l = void 0) {
          return en(this) ? this._ownerWritableStream === void 0 ? m(Ii("abort")) : jp(this, l) : m(tn("abort"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!en(this))
            return m(tn("close"));
          const l = this._ownerWritableStream;
          return l === void 0 ? m(Ii("close")) : ke(l) ? m(new TypeError("Cannot close an already-closing stream")) : qu(this);
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
          if (!en(this))
            throw tn("releaseLock");
          this._ownerWritableStream !== void 0 && Wu(this);
        }
        write(l = void 0) {
          return en(this) ? this._ownerWritableStream === void 0 ? m(Ii("write to")) : Hu(this, l) : m(tn("write"));
        }
      }
      Object.defineProperties(ir.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        write: { enumerable: !0 },
        closed: { enumerable: !0 },
        desiredSize: { enumerable: !0 },
        ready: { enumerable: !0 }
      }), s(ir.prototype.abort, "abort"), s(ir.prototype.close, "close"), s(ir.prototype.releaseLock, "releaseLock"), s(ir.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ir.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultWriter",
        configurable: !0
      });
      function en(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_ownerWritableStream") ? !1 : o instanceof ir;
      }
      function jp(o, l) {
        const d = o._ownerWritableStream;
        return Se(d, l);
      }
      function qu(o) {
        const l = o._ownerWritableStream;
        return Pe(l);
      }
      function Wp(o) {
        const l = o._ownerWritableStream, d = l._state;
        return ke(l) || d === "closed" ? h(void 0) : d === "errored" ? m(l._storedError) : qu(o);
      }
      function Hp(o, l) {
        o._closedPromiseState === "pending" ? Xs(o, l) : Zp(o, l);
      }
      function ju(o, l) {
        o._readyPromiseState === "pending" ? Ju(o, l) : tm(o, l);
      }
      function zp(o) {
        const l = o._ownerWritableStream, d = l._state;
        return d === "errored" || d === "erroring" ? null : d === "closed" ? 0 : Vu(l._writableStreamController);
      }
      function Wu(o) {
        const l = o._ownerWritableStream, d = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        ju(o, d), Hp(o, d), l._writer = void 0, o._ownerWritableStream = void 0;
      }
      function Hu(o, l) {
        const d = o._ownerWritableStream, _ = d._writableStreamController, v = Yp(_, l);
        if (d !== o._ownerWritableStream)
          return m(Ii("write to"));
        const P = d._state;
        if (P === "errored")
          return m(d._storedError);
        if (ke(d) || P === "closed")
          return m(new TypeError("The stream is closing or closed and cannot be written to"));
        if (P === "erroring")
          return m(d._storedError);
        const O = Ee(d);
        return Xp(_, l, v), O;
      }
      const zu = {};
      class Dn {
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
          if (!Gs(this))
            throw Ys("abortReason");
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!Gs(this))
            throw Ys("signal");
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
          if (!Gs(this))
            throw Ys("error");
          this._controlledWritableStream._state === "writable" && Yu(this, l);
        }
        /** @internal */
        [Fe](l) {
          const d = this._abortAlgorithm(l);
          return ra(this), d;
        }
        /** @internal */
        [S]() {
          _t(this);
        }
      }
      Object.defineProperties(Dn.prototype, {
        abortReason: { enumerable: !0 },
        signal: { enumerable: !0 },
        error: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Dn.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultController",
        configurable: !0
      });
      function Gs(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledWritableStream") ? !1 : o instanceof Dn;
      }
      function Gu(o, l, d, _, v, P, O, j) {
        l._controlledWritableStream = o, o._writableStreamController = l, l._queue = void 0, l._queueTotalSize = void 0, _t(l), l._abortReason = void 0, l._abortController = w(), l._started = !1, l._strategySizeAlgorithm = j, l._strategyHWM = O, l._writeAlgorithm = _, l._closeAlgorithm = v, l._abortAlgorithm = P;
        const J = Vs(l);
        zs(o, J);
        const z = d(), ne = h(z);
        E(ne, () => (l._started = !0, na(l), null), (oe) => (l._started = !0, qe(o, oe), null));
      }
      function Gp(o, l, d, _) {
        const v = Object.create(Dn.prototype);
        let P, O, j, J;
        l.start !== void 0 ? P = () => l.start(v) : P = () => {
        }, l.write !== void 0 ? O = (z) => l.write(z, v) : O = () => h(void 0), l.close !== void 0 ? j = () => l.close() : j = () => h(void 0), l.abort !== void 0 ? J = (z) => l.abort(z) : J = () => h(void 0), Gu(o, v, P, O, j, J, d, _);
      }
      function ra(o) {
        o._writeAlgorithm = void 0, o._closeAlgorithm = void 0, o._abortAlgorithm = void 0, o._strategySizeAlgorithm = void 0;
      }
      function Vp(o) {
        Ei(o, zu, 0), na(o);
      }
      function Yp(o, l) {
        try {
          return o._strategySizeAlgorithm(l);
        } catch (d) {
          return Pi(o, d), 1;
        }
      }
      function Vu(o) {
        return o._strategyHWM - o._queueTotalSize;
      }
      function Xp(o, l, d) {
        try {
          Ei(o, l, d);
        } catch (v) {
          Pi(o, v);
          return;
        }
        const _ = o._controlledWritableStream;
        if (!ke(_) && _._state === "writable") {
          const v = Vs(o);
          zs(_, v);
        }
        na(o);
      }
      function na(o) {
        const l = o._controlledWritableStream;
        if (!o._started || l._inFlightWriteRequest !== void 0)
          return;
        if (l._state === "erroring") {
          Ie(l);
          return;
        }
        if (o._queue.length === 0)
          return;
        const _ = Fo(o);
        _ === zu ? Qp(o) : Kp(o, _);
      }
      function Pi(o, l) {
        o._controlledWritableStream._state === "writable" && Yu(o, l);
      }
      function Qp(o) {
        const l = o._controlledWritableStream;
        $n(l), wi(o);
        const d = o._closeAlgorithm();
        ra(o), E(d, () => (Wt(l), null), (_) => (Rt(l, _), null));
      }
      function Kp(o, l) {
        const d = o._controlledWritableStream;
        On(d);
        const _ = o._writeAlgorithm(l);
        E(_, () => {
          at(d);
          const v = d._state;
          if (wi(o), !ke(d) && v === "writable") {
            const P = Vs(o);
            zs(d, P);
          }
          return na(o), null;
        }, (v) => (d._state === "writable" && ra(o), st(d, v), null));
      }
      function Vs(o) {
        return Vu(o) <= 0;
      }
      function Yu(o, l) {
        const d = o._controlledWritableStream;
        ra(o), Ye(d, l);
      }
      function ia(o) {
        return new TypeError(`WritableStream.prototype.${o} can only be used on a WritableStream`);
      }
      function Ys(o) {
        return new TypeError(`WritableStreamDefaultController.prototype.${o} can only be used on a WritableStreamDefaultController`);
      }
      function tn(o) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${o} can only be used on a WritableStreamDefaultWriter`);
      }
      function Ii(o) {
        return new TypeError("Cannot " + o + " a stream using a released writer");
      }
      function oa(o) {
        o._closedPromise = f((l, d) => {
          o._closedPromise_resolve = l, o._closedPromise_reject = d, o._closedPromiseState = "pending";
        });
      }
      function Xu(o, l) {
        oa(o), Xs(o, l);
      }
      function Jp(o) {
        oa(o), Qu(o);
      }
      function Xs(o, l) {
        o._closedPromise_reject !== void 0 && ($(o._closedPromise), o._closedPromise_reject(l), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0, o._closedPromiseState = "rejected");
      }
      function Zp(o, l) {
        Xu(o, l);
      }
      function Qu(o) {
        o._closedPromise_resolve !== void 0 && (o._closedPromise_resolve(void 0), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0, o._closedPromiseState = "resolved");
      }
      function aa(o) {
        o._readyPromise = f((l, d) => {
          o._readyPromise_resolve = l, o._readyPromise_reject = d;
        }), o._readyPromiseState = "pending";
      }
      function Qs(o, l) {
        aa(o), Ju(o, l);
      }
      function Ku(o) {
        aa(o), Ks(o);
      }
      function Ju(o, l) {
        o._readyPromise_reject !== void 0 && ($(o._readyPromise), o._readyPromise_reject(l), o._readyPromise_resolve = void 0, o._readyPromise_reject = void 0, o._readyPromiseState = "rejected");
      }
      function em(o) {
        aa(o);
      }
      function tm(o, l) {
        Qs(o, l);
      }
      function Ks(o) {
        o._readyPromise_resolve !== void 0 && (o._readyPromise_resolve(void 0), o._readyPromise_resolve = void 0, o._readyPromise_reject = void 0, o._readyPromiseState = "fulfilled");
      }
      function rm() {
        if (typeof globalThis < "u")
          return globalThis;
        if (typeof self < "u")
          return self;
        if (typeof Be < "u")
          return Be;
      }
      const Js = rm();
      function nm(o) {
        if (!(typeof o == "function" || typeof o == "object") || o.name !== "DOMException")
          return !1;
        try {
          return new o(), !0;
        } catch {
          return !1;
        }
      }
      function im() {
        const o = Js == null ? void 0 : Js.DOMException;
        return nm(o) ? o : void 0;
      }
      function om() {
        const o = function(d, _) {
          this.message = d || "", this.name = _ || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        };
        return s(o, "DOMException"), o.prototype = Object.create(Error.prototype), Object.defineProperty(o.prototype, "constructor", { value: o, writable: !0, configurable: !0 }), o;
      }
      const am = im() || om();
      function Zu(o, l, d, _, v, P) {
        const O = be(o), j = k(l);
        o._disturbed = !0;
        let J = !1, z = h(void 0);
        return f((ne, oe) => {
          let ge;
          if (P !== void 0) {
            if (ge = () => {
              const G = P.reason !== void 0 ? P.reason : new am("Aborted", "AbortError"), ue = [];
              _ || ue.push(() => l._state === "writable" ? Se(l, G) : h(void 0)), v || ue.push(() => o._state === "readable" ? At(o, G) : h(void 0)), lt(() => Promise.all(ue.map((_e) => _e())), !0, G);
            }, P.aborted) {
              ge();
              return;
            }
            P.addEventListener("abort", ge);
          }
          function Pt() {
            return f((G, ue) => {
              function _e(mt) {
                mt ? G() : b(Ln(), _e, ue);
              }
              _e(!1);
            });
          }
          function Ln() {
            return J ? h(!0) : b(j._readyPromise, () => f((G, ue) => {
              Gr(O, {
                _chunkSteps: (_e) => {
                  z = b(Hu(j, _e), void 0, n), G(!1);
                },
                _closeSteps: () => G(!0),
                _errorSteps: ue
              });
            }));
          }
          if (ar(o, O._closedPromise, (G) => (_ ? wt(!0, G) : lt(() => Se(l, G), !0, G), null)), ar(l, j._closedPromise, (G) => (v ? wt(!0, G) : lt(() => At(o, G), !0, G), null)), Xe(o, O._closedPromise, () => (d ? wt() : lt(() => Wp(j)), null)), ke(l) || l._state === "closed") {
            const G = new TypeError("the destination writable stream closed before all data could be piped to it");
            v ? wt(!0, G) : lt(() => At(o, G), !0, G);
          }
          $(Pt());
          function Tr() {
            const G = z;
            return b(z, () => G !== z ? Tr() : void 0);
          }
          function ar(G, ue, _e) {
            G._state === "errored" ? _e(G._storedError) : A(ue, _e);
          }
          function Xe(G, ue, _e) {
            G._state === "closed" ? _e() : C(ue, _e);
          }
          function lt(G, ue, _e) {
            if (J)
              return;
            J = !0, l._state === "writable" && !ke(l) ? C(Tr(), mt) : mt();
            function mt() {
              return E(G(), () => sr(ue, _e), (xn) => sr(!0, xn)), null;
            }
          }
          function wt(G, ue) {
            J || (J = !0, l._state === "writable" && !ke(l) ? C(Tr(), () => sr(G, ue)) : sr(G, ue));
          }
          function sr(G, ue) {
            return Wu(j), D(O), P !== void 0 && P.removeEventListener("abort", ge), G ? oe(ue) : ne(void 0), null;
          }
        });
      }
      class or {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!sa(this))
            throw ua("desiredSize");
          return Zs(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!sa(this))
            throw ua("close");
          if (!Fn(this))
            throw new TypeError("The stream is not in a state that permits close");
          rn(this);
        }
        enqueue(l = void 0) {
          if (!sa(this))
            throw ua("enqueue");
          if (!Fn(this))
            throw new TypeError("The stream is not in a state that permits enqueue");
          return Nn(this, l);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(l = void 0) {
          if (!sa(this))
            throw ua("error");
          Tt(this, l);
        }
        /** @internal */
        [re](l) {
          _t(this);
          const d = this._cancelAlgorithm(l);
          return la(this), d;
        }
        /** @internal */
        [Z](l) {
          const d = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const _ = wi(this);
            this._closeRequested && this._queue.length === 0 ? (la(this), Di(d)) : $i(this), l._chunkSteps(_);
          } else
            it(d, l), $i(this);
        }
        /** @internal */
        [X]() {
        }
      }
      Object.defineProperties(or.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(or.prototype.close, "close"), s(or.prototype.enqueue, "enqueue"), s(or.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(or.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultController",
        configurable: !0
      });
      function sa(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledReadableStream") ? !1 : o instanceof or;
      }
      function $i(o) {
        if (!ec(o))
          return;
        if (o._pulling) {
          o._pullAgain = !0;
          return;
        }
        o._pulling = !0;
        const d = o._pullAlgorithm();
        E(d, () => (o._pulling = !1, o._pullAgain && (o._pullAgain = !1, $i(o)), null), (_) => (Tt(o, _), null));
      }
      function ec(o) {
        const l = o._controlledReadableStream;
        return !Fn(o) || !o._started ? !1 : !!(Cr(l) && Qt(l) > 0 || Zs(o) > 0);
      }
      function la(o) {
        o._pullAlgorithm = void 0, o._cancelAlgorithm = void 0, o._strategySizeAlgorithm = void 0;
      }
      function rn(o) {
        if (!Fn(o))
          return;
        const l = o._controlledReadableStream;
        o._closeRequested = !0, o._queue.length === 0 && (la(o), Di(l));
      }
      function Nn(o, l) {
        if (!Fn(o))
          return;
        const d = o._controlledReadableStream;
        if (Cr(d) && Qt(d) > 0)
          zr(d, l, !1);
        else {
          let _;
          try {
            _ = o._strategySizeAlgorithm(l);
          } catch (v) {
            throw Tt(o, v), v;
          }
          try {
            Ei(o, l, _);
          } catch (v) {
            throw Tt(o, v), v;
          }
        }
        $i(o);
      }
      function Tt(o, l) {
        const d = o._controlledReadableStream;
        d._state === "readable" && (_t(o), la(o), ic(d, l));
      }
      function Zs(o) {
        const l = o._controlledReadableStream._state;
        return l === "errored" ? null : l === "closed" ? 0 : o._strategyHWM - o._queueTotalSize;
      }
      function sm(o) {
        return !ec(o);
      }
      function Fn(o) {
        const l = o._controlledReadableStream._state;
        return !o._closeRequested && l === "readable";
      }
      function tc(o, l, d, _, v, P, O) {
        l._controlledReadableStream = o, l._queue = void 0, l._queueTotalSize = void 0, _t(l), l._started = !1, l._closeRequested = !1, l._pullAgain = !1, l._pulling = !1, l._strategySizeAlgorithm = O, l._strategyHWM = P, l._pullAlgorithm = _, l._cancelAlgorithm = v, o._readableStreamController = l;
        const j = d();
        E(h(j), () => (l._started = !0, $i(l), null), (J) => (Tt(l, J), null));
      }
      function lm(o, l, d, _) {
        const v = Object.create(or.prototype);
        let P, O, j;
        l.start !== void 0 ? P = () => l.start(v) : P = () => {
        }, l.pull !== void 0 ? O = () => l.pull(v) : O = () => h(void 0), l.cancel !== void 0 ? j = (J) => l.cancel(J) : j = () => h(void 0), tc(o, v, P, O, j, d, _);
      }
      function ua(o) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${o} can only be used on a ReadableStreamDefaultController`);
      }
      function um(o, l) {
        return Zt(o._readableStreamController) ? fm(o) : cm(o);
      }
      function cm(o, l) {
        const d = be(o);
        let _ = !1, v = !1, P = !1, O = !1, j, J, z, ne, oe;
        const ge = f((Xe) => {
          oe = Xe;
        });
        function Pt() {
          return _ ? (v = !0, h(void 0)) : (_ = !0, Gr(d, {
            _chunkSteps: (lt) => {
              M(() => {
                v = !1;
                const wt = lt, sr = lt;
                P || Nn(z._readableStreamController, wt), O || Nn(ne._readableStreamController, sr), _ = !1, v && Pt();
              });
            },
            _closeSteps: () => {
              _ = !1, P || rn(z._readableStreamController), O || rn(ne._readableStreamController), (!P || !O) && oe(void 0);
            },
            _errorSteps: () => {
              _ = !1;
            }
          }), h(void 0));
        }
        function Ln(Xe) {
          if (P = !0, j = Xe, O) {
            const lt = Vr([j, J]), wt = At(o, lt);
            oe(wt);
          }
          return ge;
        }
        function Tr(Xe) {
          if (O = !0, J = Xe, P) {
            const lt = Vr([j, J]), wt = At(o, lt);
            oe(wt);
          }
          return ge;
        }
        function ar() {
        }
        return z = Oi(ar, Pt, Ln), ne = Oi(ar, Pt, Tr), A(d._closedPromise, (Xe) => (Tt(z._readableStreamController, Xe), Tt(ne._readableStreamController, Xe), (!P || !O) && oe(void 0), null)), [z, ne];
      }
      function fm(o) {
        let l = be(o), d = !1, _ = !1, v = !1, P = !1, O = !1, j, J, z, ne, oe;
        const ge = f((G) => {
          oe = G;
        });
        function Pt(G) {
          A(G._closedPromise, (ue) => (G !== l || (ot(z._readableStreamController, ue), ot(ne._readableStreamController, ue), (!P || !O) && oe(void 0)), null));
        }
        function Ln() {
          rr(l) && (D(l), l = be(o), Pt(l)), Gr(l, {
            _chunkSteps: (ue) => {
              M(() => {
                _ = !1, v = !1;
                const _e = ue;
                let mt = ue;
                if (!P && !O)
                  try {
                    mt = No(ue);
                  } catch (xn) {
                    ot(z._readableStreamController, xn), ot(ne._readableStreamController, xn), oe(At(o, xn));
                    return;
                  }
                P || tr(z._readableStreamController, _e), O || tr(ne._readableStreamController, mt), d = !1, _ ? ar() : v && Xe();
              });
            },
            _closeSteps: () => {
              d = !1, P || Kr(z._readableStreamController), O || Kr(ne._readableStreamController), z._readableStreamController._pendingPullIntos.length > 0 && Rn(z._readableStreamController, 0), ne._readableStreamController._pendingPullIntos.length > 0 && Rn(ne._readableStreamController, 0), (!P || !O) && oe(void 0);
            },
            _errorSteps: () => {
              d = !1;
            }
          });
        }
        function Tr(G, ue) {
          Ft(l) && (D(l), l = zo(o), Pt(l));
          const _e = ue ? ne : z, mt = ue ? z : ne;
          Yo(l, G, 1, {
            _chunkSteps: (Un) => {
              M(() => {
                _ = !1, v = !1;
                const Bn = ue ? O : P;
                if (ue ? P : O)
                  Bn || Tn(_e._readableStreamController, Un);
                else {
                  let yc;
                  try {
                    yc = No(Un);
                  } catch (il) {
                    ot(_e._readableStreamController, il), ot(mt._readableStreamController, il), oe(At(o, il));
                    return;
                  }
                  Bn || Tn(_e._readableStreamController, Un), tr(mt._readableStreamController, yc);
                }
                d = !1, _ ? ar() : v && Xe();
              });
            },
            _closeSteps: (Un) => {
              d = !1;
              const Bn = ue ? O : P, ya = ue ? P : O;
              Bn || Kr(_e._readableStreamController), ya || Kr(mt._readableStreamController), Un !== void 0 && (Bn || Tn(_e._readableStreamController, Un), !ya && mt._readableStreamController._pendingPullIntos.length > 0 && Rn(mt._readableStreamController, 0)), (!Bn || !ya) && oe(void 0);
            },
            _errorSteps: () => {
              d = !1;
            }
          });
        }
        function ar() {
          if (d)
            return _ = !0, h(void 0);
          d = !0;
          const G = Cn(z._readableStreamController);
          return G === null ? Ln() : Tr(G._view, !1), h(void 0);
        }
        function Xe() {
          if (d)
            return v = !0, h(void 0);
          d = !0;
          const G = Cn(ne._readableStreamController);
          return G === null ? Ln() : Tr(G._view, !0), h(void 0);
        }
        function lt(G) {
          if (P = !0, j = G, O) {
            const ue = Vr([j, J]), _e = At(o, ue);
            oe(_e);
          }
          return ge;
        }
        function wt(G) {
          if (O = !0, J = G, P) {
            const ue = Vr([j, J]), _e = At(o, ue);
            oe(_e);
          }
          return ge;
        }
        function sr() {
        }
        return z = nc(sr, ar, lt), ne = nc(sr, Xe, wt), Pt(l), [z, ne];
      }
      function dm(o) {
        return i(o) && typeof o.getReader < "u";
      }
      function hm(o) {
        return dm(o) ? mm(o.getReader()) : pm(o);
      }
      function pm(o) {
        let l;
        const d = En(o, "async"), _ = n;
        function v() {
          let O;
          try {
            O = _i(d);
          } catch (J) {
            return m(J);
          }
          const j = h(O);
          return I(j, (J) => {
            if (!i(J))
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (Qr(J))
              rn(l._readableStreamController);
            else {
              const ne = Ns(J);
              Nn(l._readableStreamController, ne);
            }
          });
        }
        function P(O) {
          const j = d.iterator;
          let J;
          try {
            J = yr(j, "return");
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
        return l = Oi(_, v, P, 0), l;
      }
      function mm(o) {
        let l;
        const d = n;
        function _() {
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
              rn(l._readableStreamController);
            else {
              const j = O.value;
              Nn(l._readableStreamController, j);
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
        return l = Oi(d, _, v, 0), l;
      }
      function gm(o, l) {
        Re(o, l);
        const d = o, _ = d == null ? void 0 : d.autoAllocateChunkSize, v = d == null ? void 0 : d.cancel, P = d == null ? void 0 : d.pull, O = d == null ? void 0 : d.start, j = d == null ? void 0 : d.type;
        return {
          autoAllocateChunkSize: _ === void 0 ? void 0 : Ae(_, `${l} has member 'autoAllocateChunkSize' that`),
          cancel: v === void 0 ? void 0 : ym(v, d, `${l} has member 'cancel' that`),
          pull: P === void 0 ? void 0 : bm(P, d, `${l} has member 'pull' that`),
          start: O === void 0 ? void 0 : _m(O, d, `${l} has member 'start' that`),
          type: j === void 0 ? void 0 : wm(j, `${l} has member 'type' that`)
        };
      }
      function ym(o, l, d) {
        return y(o, d), (_) => te(o, l, [_]);
      }
      function bm(o, l, d) {
        return y(o, d), (_) => te(o, l, [_]);
      }
      function _m(o, l, d) {
        return y(o, d), (_) => x(o, l, [_]);
      }
      function wm(o, l) {
        if (o = `${o}`, o !== "bytes")
          throw new TypeError(`${l} '${o}' is not a valid enumeration value for ReadableStreamType`);
        return o;
      }
      function Em(o, l) {
        return Re(o, l), { preventCancel: !!(o == null ? void 0 : o.preventCancel) };
      }
      function rc(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.preventAbort, _ = o == null ? void 0 : o.preventCancel, v = o == null ? void 0 : o.preventClose, P = o == null ? void 0 : o.signal;
        return P !== void 0 && Sm(P, `${l} has member 'signal' that`), {
          preventAbort: !!d,
          preventCancel: !!_,
          preventClose: !!v,
          signal: P
        };
      }
      function Sm(o, l) {
        if (!Ws(o))
          throw new TypeError(`${l} is not an AbortSignal.`);
      }
      function vm(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.readable;
        le(d, "readable", "ReadableWritablePair"), yt(d, `${l} has member 'readable' that`);
        const _ = o == null ? void 0 : o.writable;
        return le(_, "writable", "ReadableWritablePair"), Zo(_, `${l} has member 'writable' that`), { readable: d, writable: _ };
      }
      class He {
        constructor(l = {}, d = {}) {
          l === void 0 ? l = null : F(l, "First parameter");
          const _ = Sr(d, "Second parameter"), v = gm(l, "First parameter");
          if (el(this), v.type === "bytes") {
            if (_.size !== void 0)
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            const P = jt(_, 0);
            qs(this, v, P);
          } else {
            const P = In(_), O = jt(_, 1);
            lm(this, v, O, P);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!vr(this))
            throw nn("locked");
          return Cr(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(l = void 0) {
          return vr(this) ? Cr(this) ? m(new TypeError("Cannot cancel a stream that already has a reader")) : At(this, l) : m(nn("cancel"));
        }
        getReader(l = void 0) {
          if (!vr(this))
            throw nn("getReader");
          return Ho(l, "First parameter").mode === void 0 ? be(this) : zo(this);
        }
        pipeThrough(l, d = {}) {
          if (!vr(this))
            throw nn("pipeThrough");
          T(l, 1, "pipeThrough");
          const _ = vm(l, "First parameter"), v = rc(d, "Second parameter");
          if (Cr(this))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (he(_.writable))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const P = Zu(this, _.writable, v.preventClose, v.preventAbort, v.preventCancel, v.signal);
          return $(P), _.readable;
        }
        pipeTo(l, d = {}) {
          if (!vr(this))
            return m(nn("pipeTo"));
          if (l === void 0)
            return m("Parameter 1 is required in 'pipeTo'.");
          if (!K(l))
            return m(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let _;
          try {
            _ = rc(d, "Second parameter");
          } catch (v) {
            return m(v);
          }
          return Cr(this) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : he(l) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Zu(this, l, _.preventClose, _.preventAbort, _.preventCancel, _.signal);
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
          if (!vr(this))
            throw nn("tee");
          const l = um(this);
          return Vr(l);
        }
        values(l = void 0) {
          if (!vr(this))
            throw nn("values");
          const d = Em(l, "First parameter");
          return $o(this, d.preventCancel);
        }
        [Xr](l) {
          return this.values(l);
        }
        /**
         * Creates a new ReadableStream wrapping the provided iterable or async iterable.
         *
         * This can be used to adapt various kinds of objects into a readable stream,
         * such as an array, an async generator, or a Node.js readable stream.
         */
        static from(l) {
          return hm(l);
        }
      }
      Object.defineProperties(He, {
        from: { enumerable: !0 }
      }), Object.defineProperties(He.prototype, {
        cancel: { enumerable: !0 },
        getReader: { enumerable: !0 },
        pipeThrough: { enumerable: !0 },
        pipeTo: { enumerable: !0 },
        tee: { enumerable: !0 },
        values: { enumerable: !0 },
        locked: { enumerable: !0 }
      }), s(He.from, "from"), s(He.prototype.cancel, "cancel"), s(He.prototype.getReader, "getReader"), s(He.prototype.pipeThrough, "pipeThrough"), s(He.prototype.pipeTo, "pipeTo"), s(He.prototype.tee, "tee"), s(He.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(He.prototype, Symbol.toStringTag, {
        value: "ReadableStream",
        configurable: !0
      }), Object.defineProperty(He.prototype, Xr, {
        value: He.prototype.values,
        writable: !0,
        configurable: !0
      });
      function Oi(o, l, d, _ = 1, v = () => 1) {
        const P = Object.create(He.prototype);
        el(P);
        const O = Object.create(or.prototype);
        return tc(P, O, o, l, d, _, v), P;
      }
      function nc(o, l, d) {
        const _ = Object.create(He.prototype);
        el(_);
        const v = Object.create(Ct.prototype);
        return jo(_, v, o, l, d, 0, void 0), _;
      }
      function el(o) {
        o._state = "readable", o._reader = void 0, o._storedError = void 0, o._disturbed = !1;
      }
      function vr(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readableStreamController") ? !1 : o instanceof He;
      }
      function Cr(o) {
        return o._reader !== void 0;
      }
      function At(o, l) {
        if (o._disturbed = !0, o._state === "closed")
          return h(void 0);
        if (o._state === "errored")
          return m(o._storedError);
        Di(o);
        const d = o._reader;
        if (d !== void 0 && rr(d)) {
          const v = d._readIntoRequests;
          d._readIntoRequests = new Q(), v.forEach((P) => {
            P._closeSteps(void 0);
          });
        }
        const _ = o._readableStreamController[re](l);
        return I(_, n);
      }
      function Di(o) {
        o._state = "closed";
        const l = o._reader;
        if (l !== void 0 && (ee(l), Ft(l))) {
          const d = l._readRequests;
          l._readRequests = new Q(), d.forEach((_) => {
            _._closeSteps();
          });
        }
      }
      function ic(o, l) {
        o._state = "errored", o._storedError = l;
        const d = o._reader;
        d !== void 0 && (V(d, l), Ft(d) ? Io(d, l) : Ai(d, l));
      }
      function nn(o) {
        return new TypeError(`ReadableStream.prototype.${o} can only be used on a ReadableStream`);
      }
      function oc(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.highWaterMark;
        return le(d, "highWaterMark", "QueuingStrategyInit"), {
          highWaterMark: me(d)
        };
      }
      const ac = (o) => o.byteLength;
      s(ac, "size");
      class ca {
        constructor(l) {
          T(l, 1, "ByteLengthQueuingStrategy"), l = oc(l, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = l.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!lc(this))
            throw sc("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!lc(this))
            throw sc("size");
          return ac;
        }
      }
      Object.defineProperties(ca.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ca.prototype, Symbol.toStringTag, {
        value: "ByteLengthQueuingStrategy",
        configurable: !0
      });
      function sc(o) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${o} can only be used on a ByteLengthQueuingStrategy`);
      }
      function lc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_byteLengthQueuingStrategyHighWaterMark") ? !1 : o instanceof ca;
      }
      const uc = () => 1;
      s(uc, "size");
      class fa {
        constructor(l) {
          T(l, 1, "CountQueuingStrategy"), l = oc(l, "First parameter"), this._countQueuingStrategyHighWaterMark = l.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!fc(this))
            throw cc("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!fc(this))
            throw cc("size");
          return uc;
        }
      }
      Object.defineProperties(fa.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(fa.prototype, Symbol.toStringTag, {
        value: "CountQueuingStrategy",
        configurable: !0
      });
      function cc(o) {
        return new TypeError(`CountQueuingStrategy.prototype.${o} can only be used on a CountQueuingStrategy`);
      }
      function fc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_countQueuingStrategyHighWaterMark") ? !1 : o instanceof fa;
      }
      function Cm(o, l) {
        Re(o, l);
        const d = o == null ? void 0 : o.cancel, _ = o == null ? void 0 : o.flush, v = o == null ? void 0 : o.readableType, P = o == null ? void 0 : o.start, O = o == null ? void 0 : o.transform, j = o == null ? void 0 : o.writableType;
        return {
          cancel: d === void 0 ? void 0 : Pm(d, o, `${l} has member 'cancel' that`),
          flush: _ === void 0 ? void 0 : Rm(_, o, `${l} has member 'flush' that`),
          readableType: v,
          start: P === void 0 ? void 0 : Tm(P, o, `${l} has member 'start' that`),
          transform: O === void 0 ? void 0 : Am(O, o, `${l} has member 'transform' that`),
          writableType: j
        };
      }
      function Rm(o, l, d) {
        return y(o, d), (_) => te(o, l, [_]);
      }
      function Tm(o, l, d) {
        return y(o, d), (_) => x(o, l, [_]);
      }
      function Am(o, l, d) {
        return y(o, d), (_, v) => te(o, l, [_, v]);
      }
      function Pm(o, l, d) {
        return y(o, d), (_) => te(o, l, [_]);
      }
      class da {
        constructor(l = {}, d = {}, _ = {}) {
          l === void 0 && (l = null);
          const v = Sr(d, "Second parameter"), P = Sr(_, "Third parameter"), O = Cm(l, "First parameter");
          if (O.readableType !== void 0)
            throw new RangeError("Invalid readableType specified");
          if (O.writableType !== void 0)
            throw new RangeError("Invalid writableType specified");
          const j = jt(P, 0), J = In(P), z = jt(v, 1), ne = In(v);
          let oe;
          const ge = f((Pt) => {
            oe = Pt;
          });
          Im(this, ge, z, ne, j, J), Om(this, O), O.start !== void 0 ? oe(O.start(this._transformStreamController)) : oe(void 0);
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!dc(this))
            throw gc("readable");
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!dc(this))
            throw gc("writable");
          return this._writable;
        }
      }
      Object.defineProperties(da.prototype, {
        readable: { enumerable: !0 },
        writable: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(da.prototype, Symbol.toStringTag, {
        value: "TransformStream",
        configurable: !0
      });
      function Im(o, l, d, _, v, P) {
        function O() {
          return l;
        }
        function j(ge) {
          return Fm(o, ge);
        }
        function J(ge) {
          return km(o, ge);
        }
        function z() {
          return Lm(o);
        }
        o._writable = W(O, j, z, J, d, _);
        function ne() {
          return xm(o);
        }
        function oe(ge) {
          return Um(o, ge);
        }
        o._readable = Oi(O, ne, oe, v, P), o._backpressure = void 0, o._backpressureChangePromise = void 0, o._backpressureChangePromise_resolve = void 0, ha(o, !0), o._transformStreamController = void 0;
      }
      function dc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_transformStreamController") ? !1 : o instanceof da;
      }
      function hc(o, l) {
        Tt(o._readable._readableStreamController, l), tl(o, l);
      }
      function tl(o, l) {
        ma(o._transformStreamController), Pi(o._writable._writableStreamController, l), rl(o);
      }
      function rl(o) {
        o._backpressure && ha(o, !1);
      }
      function ha(o, l) {
        o._backpressureChangePromise !== void 0 && o._backpressureChangePromise_resolve(), o._backpressureChangePromise = f((d) => {
          o._backpressureChangePromise_resolve = d;
        }), o._backpressure = l;
      }
      class Rr {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!pa(this))
            throw ga("desiredSize");
          const l = this._controlledTransformStream._readable._readableStreamController;
          return Zs(l);
        }
        enqueue(l = void 0) {
          if (!pa(this))
            throw ga("enqueue");
          pc(this, l);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(l = void 0) {
          if (!pa(this))
            throw ga("error");
          Dm(this, l);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!pa(this))
            throw ga("terminate");
          Nm(this);
        }
      }
      Object.defineProperties(Rr.prototype, {
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        terminate: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(Rr.prototype.enqueue, "enqueue"), s(Rr.prototype.error, "error"), s(Rr.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Rr.prototype, Symbol.toStringTag, {
        value: "TransformStreamDefaultController",
        configurable: !0
      });
      function pa(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledTransformStream") ? !1 : o instanceof Rr;
      }
      function $m(o, l, d, _, v) {
        l._controlledTransformStream = o, o._transformStreamController = l, l._transformAlgorithm = d, l._flushAlgorithm = _, l._cancelAlgorithm = v, l._finishPromise = void 0, l._finishPromise_resolve = void 0, l._finishPromise_reject = void 0;
      }
      function Om(o, l) {
        const d = Object.create(Rr.prototype);
        let _, v, P;
        l.transform !== void 0 ? _ = (O) => l.transform(O, d) : _ = (O) => {
          try {
            return pc(d, O), h(void 0);
          } catch (j) {
            return m(j);
          }
        }, l.flush !== void 0 ? v = () => l.flush(d) : v = () => h(void 0), l.cancel !== void 0 ? P = (O) => l.cancel(O) : P = () => h(void 0), $m(o, d, _, v, P);
      }
      function ma(o) {
        o._transformAlgorithm = void 0, o._flushAlgorithm = void 0, o._cancelAlgorithm = void 0;
      }
      function pc(o, l) {
        const d = o._controlledTransformStream, _ = d._readable._readableStreamController;
        if (!Fn(_))
          throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          Nn(_, l);
        } catch (P) {
          throw tl(d, P), d._readable._storedError;
        }
        sm(_) !== d._backpressure && ha(d, !0);
      }
      function Dm(o, l) {
        hc(o._controlledTransformStream, l);
      }
      function mc(o, l) {
        const d = o._transformAlgorithm(l);
        return I(d, void 0, (_) => {
          throw hc(o._controlledTransformStream, _), _;
        });
      }
      function Nm(o) {
        const l = o._controlledTransformStream, d = l._readable._readableStreamController;
        rn(d);
        const _ = new TypeError("TransformStream terminated");
        tl(l, _);
      }
      function Fm(o, l) {
        const d = o._transformStreamController;
        if (o._backpressure) {
          const _ = o._backpressureChangePromise;
          return I(_, () => {
            const v = o._writable;
            if (v._state === "erroring")
              throw v._storedError;
            return mc(d, l);
          });
        }
        return mc(d, l);
      }
      function km(o, l) {
        const d = o._transformStreamController;
        if (d._finishPromise !== void 0)
          return d._finishPromise;
        const _ = o._readable;
        d._finishPromise = f((P, O) => {
          d._finishPromise_resolve = P, d._finishPromise_reject = O;
        });
        const v = d._cancelAlgorithm(l);
        return ma(d), E(v, () => (_._state === "errored" ? kn(d, _._storedError) : (Tt(_._readableStreamController, l), nl(d)), null), (P) => (Tt(_._readableStreamController, P), kn(d, P), null)), d._finishPromise;
      }
      function Lm(o) {
        const l = o._transformStreamController;
        if (l._finishPromise !== void 0)
          return l._finishPromise;
        const d = o._readable;
        l._finishPromise = f((v, P) => {
          l._finishPromise_resolve = v, l._finishPromise_reject = P;
        });
        const _ = l._flushAlgorithm();
        return ma(l), E(_, () => (d._state === "errored" ? kn(l, d._storedError) : (rn(d._readableStreamController), nl(l)), null), (v) => (Tt(d._readableStreamController, v), kn(l, v), null)), l._finishPromise;
      }
      function xm(o) {
        return ha(o, !1), o._backpressureChangePromise;
      }
      function Um(o, l) {
        const d = o._transformStreamController;
        if (d._finishPromise !== void 0)
          return d._finishPromise;
        const _ = o._writable;
        d._finishPromise = f((P, O) => {
          d._finishPromise_resolve = P, d._finishPromise_reject = O;
        });
        const v = d._cancelAlgorithm(l);
        return ma(d), E(v, () => (_._state === "errored" ? kn(d, _._storedError) : (Pi(_._writableStreamController, l), rl(o), nl(d)), null), (P) => (Pi(_._writableStreamController, P), rl(o), kn(d, P), null)), d._finishPromise;
      }
      function ga(o) {
        return new TypeError(`TransformStreamDefaultController.prototype.${o} can only be used on a TransformStreamDefaultController`);
      }
      function nl(o) {
        o._finishPromise_resolve !== void 0 && (o._finishPromise_resolve(), o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0);
      }
      function kn(o, l) {
        o._finishPromise_reject !== void 0 && ($(o._finishPromise), o._finishPromise_reject(l), o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0);
      }
      function gc(o) {
        return new TypeError(`TransformStream.prototype.${o} can only be used on a TransformStream`);
      }
      r.ByteLengthQueuingStrategy = ca, r.CountQueuingStrategy = fa, r.ReadableByteStreamController = Ct, r.ReadableStream = He, r.ReadableStreamBYOBReader = qt, r.ReadableStreamBYOBRequest = Jt, r.ReadableStreamDefaultController = or, r.ReadableStreamDefaultReader = dt, r.TransformStream = da, r.TransformStreamDefaultController = Rr, r.WritableStream = R, r.WritableStreamDefaultController = Dn, r.WritableStreamDefaultWriter = ir;
    });
  }(ba, ba.exports)), ba.exports;
}
const ng = 65536;
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
    Object.assign(globalThis, rg());
  }
try {
  const { Blob: e } = require("buffer");
  e && !e.prototype.stream && (e.prototype.stream = function(r) {
    let n = 0;
    const i = this;
    return new ReadableStream({
      type: "bytes",
      async pull(a) {
        const u = await i.slice(n, Math.min(i.size, n + ng)).arrayBuffer();
        n += u.byteLength, a.enqueue(new Uint8Array(u)), n === i.size && a.close();
      }
    });
  });
} catch {
}
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const Ec = 65536;
async function* ol(e, t = !0) {
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
var fr, po, oi, os, hn;
const Id = (hn = class {
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
    Ar(this, fr, []);
    Ar(this, po, "");
    Ar(this, oi, 0);
    Ar(this, os, "transparent");
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
      ArrayBuffer.isView(a) ? s = new Uint8Array(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength)) : a instanceof ArrayBuffer ? s = new Uint8Array(a.slice(0)) : a instanceof hn ? s = a : s = n.encode(`${a}`), Ht(this, oi, Le(this, oi) + (ArrayBuffer.isView(s) ? s.byteLength : s.size)), Le(this, fr).push(s);
    }
    Ht(this, os, `${r.endings === void 0 ? "transparent" : r.endings}`);
    const i = r.type === void 0 ? "" : String(r.type);
    Ht(this, po, /^[\x20-\x7E]*$/.test(i) ? i : "");
  }
  /**
   * The Blob interface's size property returns the
   * size of the Blob in bytes.
   */
  get size() {
    return Le(this, oi);
  }
  /**
   * The type property of a Blob object returns the MIME type of the file.
   */
  get type() {
    return Le(this, po);
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
    for await (const n of ol(Le(this, fr), !1))
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
    for await (const n of ol(Le(this, fr), !1))
      t.set(n, r), r += n.length;
    return t.buffer;
  }
  stream() {
    const t = ol(Le(this, fr), !0);
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
    const u = Math.max(s - a, 0), c = Le(this, fr), g = [];
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
    const h = new hn([], { type: String(n).toLowerCase() });
    return Ht(h, oi, u), Ht(h, fr, g), h;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](t) {
    return t && typeof t == "object" && typeof t.constructor == "function" && (typeof t.stream == "function" || typeof t.arrayBuffer == "function") && /^(Blob|File)$/.test(t[Symbol.toStringTag]);
  }
}, fr = new WeakMap(), po = new WeakMap(), oi = new WeakMap(), os = new WeakMap(), hn);
Object.defineProperties(Id.prototype, {
  size: { enumerable: !0 },
  type: { enumerable: !0 },
  slice: { enumerable: !0 }
});
const ja = Id;
var mo, go, Sd;
const ig = (Sd = class extends ja {
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
    Ar(this, mo, 0);
    Ar(this, go, "");
    i === null && (i = {});
    const a = i.lastModified === void 0 ? Date.now() : Number(i.lastModified);
    Number.isNaN(a) || Ht(this, mo, a), Ht(this, go, String(n));
  }
  get name() {
    return Le(this, go);
  }
  get lastModified() {
    return Le(this, mo);
  }
  get [Symbol.toStringTag]() {
    return "File";
  }
  static [Symbol.hasInstance](r) {
    return !!r && r instanceof ja && /^(File)$/.test(r[Symbol.toStringTag]);
  }
}, mo = new WeakMap(), go = new WeakMap(), Sd), og = ig;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: Hi, iterator: ag, hasInstance: sg } = Symbol, Sc = Math.random, lg = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), vc = (e, t, r) => (e += "", /^(Blob|File)$/.test(t && t[Hi]) ? [(r = r !== void 0 ? r + "" : t[Hi] == "File" ? t.name : "blob", e), t.name !== r || t[Hi] == "blob" ? new og([t], r, t) : t] : [e, t + ""]), al = (e, t) => (t ? e : e.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), on = (e, t, r) => {
  if (t.length < r)
    throw new TypeError(`Failed to execute '${e}' on 'FormData': ${r} arguments required, but only ${t.length} present.`);
}, Et, vd;
const Ml = (vd = class {
  constructor(...t) {
    Ar(this, Et, []);
    if (t.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [Hi]() {
    return "FormData";
  }
  [ag]() {
    return this.entries();
  }
  static [sg](t) {
    return t && typeof t == "object" && t[Hi] === "FormData" && !lg.some((r) => typeof t[r] != "function");
  }
  append(...t) {
    on("append", arguments, 2), Le(this, Et).push(vc(...t));
  }
  delete(t) {
    on("delete", arguments, 1), t += "", Ht(this, Et, Le(this, Et).filter(([r]) => r !== t));
  }
  get(t) {
    on("get", arguments, 1), t += "";
    for (var r = Le(this, Et), n = r.length, i = 0; i < n; i++) if (r[i][0] === t) return r[i][1];
    return null;
  }
  getAll(t, r) {
    return on("getAll", arguments, 1), r = [], t += "", Le(this, Et).forEach((n) => n[0] === t && r.push(n[1])), r;
  }
  has(t) {
    return on("has", arguments, 1), t += "", Le(this, Et).some((r) => r[0] === t);
  }
  forEach(t, r) {
    on("forEach", arguments, 1);
    for (var [n, i] of this) t.call(r, i, n, this);
  }
  set(...t) {
    on("set", arguments, 2);
    var r = [], n = !0;
    t = vc(...t), Le(this, Et).forEach((i) => {
      i[0] === t[0] ? n && (n = !r.push(t)) : r.push(i);
    }), n && r.push(t), Ht(this, Et, r);
  }
  *entries() {
    yield* Le(this, Et);
  }
  *keys() {
    for (var [t] of this) yield t;
  }
  *values() {
    for (var [, t] of this) yield t;
  }
}, Et = new WeakMap(), vd);
function ug(e, t = ja) {
  var r = `${Sc()}${Sc()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), n = [], i = `--${r}\r
Content-Disposition: form-data; name="`;
  return e.forEach((a, s) => typeof a == "string" ? n.push(i + al(s) + `"\r
\r
${a.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : n.push(i + al(s) + `"; filename="${al(a.name, 1)}"\r
Content-Type: ${a.type || "application/octet-stream"}\r
\r
`, a, `\r
`)), n.push(`--${r}--`), new t(n, { type: "multipart/form-data; boundary=" + r });
}
class us extends Error {
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
class Gt extends us {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(t, r, n) {
    super(t, r), n && (this.code = this.errno = n.code, this.erroredSysCall = n.syscall);
  }
}
const Wa = Symbol.toStringTag, $d = (e) => typeof e == "object" && typeof e.append == "function" && typeof e.delete == "function" && typeof e.get == "function" && typeof e.getAll == "function" && typeof e.has == "function" && typeof e.set == "function" && typeof e.sort == "function" && e[Wa] === "URLSearchParams", Ha = (e) => e && typeof e == "object" && typeof e.arrayBuffer == "function" && typeof e.type == "string" && typeof e.stream == "function" && typeof e.constructor == "function" && /^(Blob|File)$/.test(e[Wa]), cg = (e) => typeof e == "object" && (e[Wa] === "AbortSignal" || e[Wa] === "EventTarget"), fg = (e, t) => {
  const r = new URL(t).hostname, n = new URL(e).hostname;
  return r === n || r.endsWith(`.${n}`);
}, dg = (e, t) => {
  const r = new URL(t).protocol, n = new URL(e).protocol;
  return r === n;
}, hg = Qm(Vt.pipeline), ut = Symbol("Body internals");
class Qi {
  constructor(t, {
    size: r = 0
  } = {}) {
    let n = null;
    t === null ? t = null : $d(t) ? t = ze.from(t.toString()) : Ha(t) || ze.isBuffer(t) || (qa.isAnyArrayBuffer(t) ? t = ze.from(t) : ArrayBuffer.isView(t) ? t = ze.from(t.buffer, t.byteOffset, t.byteLength) : t instanceof Vt || (t instanceof Ml ? (t = ug(t), n = t.type.split("=")[1]) : t = ze.from(String(t))));
    let i = t;
    ze.isBuffer(t) ? i = Vt.Readable.from(t) : Ha(t) && (i = Vt.Readable.from(t.stream())), this[ut] = {
      body: t,
      stream: i,
      boundary: n,
      disturbed: !1,
      error: null
    }, this.size = r, t instanceof Vt && t.on("error", (a) => {
      const s = a instanceof us ? a : new Gt(`Invalid response body while trying to fetch ${this.url}: ${a.message}`, "system", a);
      this[ut].error = s;
    });
  }
  get body() {
    return this[ut].stream;
  }
  get bodyUsed() {
    return this[ut].disturbed;
  }
  /**
   * Decode response as ArrayBuffer
   *
   * @return  Promise
   */
  async arrayBuffer() {
    const { buffer: t, byteOffset: r, byteLength: n } = await sl(this);
    return t.slice(r, r + n);
  }
  async formData() {
    const t = this.headers.get("content-type");
    if (t.startsWith("application/x-www-form-urlencoded")) {
      const n = new Ml(), i = new URLSearchParams(await this.text());
      for (const [a, s] of i)
        n.append(a, s);
      return n;
    }
    const { toFormData: r } = await import("./multipart-parser-CMMXm0sB.js");
    return r(this.body, t);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const t = this.headers && this.headers.get("content-type") || this[ut].body && this[ut].body.type || "", r = await this.arrayBuffer();
    return new ja([r], {
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
    const t = await sl(this);
    return new TextDecoder().decode(t);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return sl(this);
  }
}
Qi.prototype.buffer = as(Qi.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Qi.prototype, {
  body: { enumerable: !0 },
  bodyUsed: { enumerable: !0 },
  arrayBuffer: { enumerable: !0 },
  blob: { enumerable: !0 },
  json: { enumerable: !0 },
  text: { enumerable: !0 },
  data: { get: as(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function sl(e) {
  if (e[ut].disturbed)
    throw new TypeError(`body used already for: ${e.url}`);
  if (e[ut].disturbed = !0, e[ut].error)
    throw e[ut].error;
  const { body: t } = e;
  if (t === null)
    return ze.alloc(0);
  if (!(t instanceof Vt))
    return ze.alloc(0);
  const r = [];
  let n = 0;
  try {
    for await (const i of t) {
      if (e.size > 0 && n + i.length > e.size) {
        const a = new Gt(`content size at ${e.url} over limit: ${e.size}`, "max-size");
        throw t.destroy(a), a;
      }
      n += i.length, r.push(i);
    }
  } catch (i) {
    throw i instanceof us ? i : new Gt(`Invalid response body while trying to fetch ${e.url}: ${i.message}`, "system", i);
  }
  if (t.readableEnded === !0 || t._readableState.ended === !0)
    try {
      return r.every((i) => typeof i == "string") ? ze.from(r.join("")) : ze.concat(r, n);
    } catch (i) {
      throw new Gt(`Could not create Buffer from response body for ${e.url}: ${i.message}`, "system", i);
    }
  else
    throw new Gt(`Premature close of server response while trying to fetch ${e.url}`);
}
const lu = (e, t) => {
  let r, n, { body: i } = e[ut];
  if (e.bodyUsed)
    throw new Error("cannot clone body after it is used");
  return i instanceof Vt && typeof i.getBoundary != "function" && (r = new Ma({ highWaterMark: t }), n = new Ma({ highWaterMark: t }), i.pipe(r), i.pipe(n), e[ut].stream = r, i = n), i;
}, pg = as(
  (e) => e.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
), Od = (e, t) => e === null ? null : typeof e == "string" ? "text/plain;charset=UTF-8" : $d(e) ? "application/x-www-form-urlencoded;charset=UTF-8" : Ha(e) ? e.type || null : ze.isBuffer(e) || qa.isAnyArrayBuffer(e) || ArrayBuffer.isView(e) ? null : e instanceof Ml ? `multipart/form-data; boundary=${t[ut].boundary}` : e && typeof e.getBoundary == "function" ? `multipart/form-data;boundary=${pg(e)}` : e instanceof Vt ? null : "text/plain;charset=UTF-8", mg = (e) => {
  const { body: t } = e[ut];
  return t === null ? 0 : Ha(t) ? t.size : ze.isBuffer(t) ? t.length : t && typeof t.getLengthSync == "function" && t.hasKnownLength && t.hasKnownLength() ? t.getLengthSync() : null;
}, gg = async (e, { body: t }) => {
  t === null ? e.end() : await hg(t, e);
}, ka = typeof Xi.validateHeaderName == "function" ? Xi.validateHeaderName : (e) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(e)) {
    const t = new TypeError(`Header name must be a valid HTTP token [${e}]`);
    throw Object.defineProperty(t, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), t;
  }
}, ql = typeof Xi.validateHeaderValue == "function" ? Xi.validateHeaderValue : (e, t) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(t)) {
    const r = new TypeError(`Invalid character in header content ["${e}"]`);
    throw Object.defineProperty(r, "code", { value: "ERR_INVALID_CHAR" }), r;
  }
};
class dr extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(t) {
    let r = [];
    if (t instanceof dr) {
      const n = t.raw();
      for (const [i, a] of Object.entries(n))
        r.push(...a.map((s) => [i, s]));
    } else if (t != null) if (typeof t == "object" && !qa.isBoxedPrimitive(t)) {
      const n = t[Symbol.iterator];
      if (n == null)
        r.push(...Object.entries(t));
      else {
        if (typeof n != "function")
          throw new TypeError("Header pairs must be iterable");
        r = [...t].map((i) => {
          if (typeof i != "object" || qa.isBoxedPrimitive(i))
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
    return r = r.length > 0 ? r.map(([n, i]) => (ka(n), ql(n, String(i)), [String(n).toLowerCase(), String(i)])) : void 0, super(r), new Proxy(this, {
      get(n, i, a) {
        switch (i) {
          case "append":
          case "set":
            return (s, u) => (ka(s), ql(s, String(u)), URLSearchParams.prototype[i].call(
              n,
              String(s).toLowerCase(),
              String(u)
            ));
          case "delete":
          case "has":
          case "getAll":
            return (s) => (ka(s), URLSearchParams.prototype[i].call(
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
  dr.prototype,
  ["get", "entries", "forEach", "values"].reduce((e, t) => (e[t] = { enumerable: !0 }, e), {})
);
function yg(e = []) {
  return new dr(
    e.reduce((t, r, n, i) => (n % 2 === 0 && t.push(i.slice(n, n + 2)), t), []).filter(([t, r]) => {
      try {
        return ka(t), ql(t, String(r)), !0;
      } catch {
        return !1;
      }
    })
  );
}
const bg = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Dd = (e) => bg.has(e), It = Symbol("Response internals");
class gt extends Qi {
  constructor(t = null, r = {}) {
    super(t, r);
    const n = r.status != null ? r.status : 200, i = new dr(r.headers);
    if (t !== null && !i.has("Content-Type")) {
      const a = Od(t, this);
      a && i.append("Content-Type", a);
    }
    this[It] = {
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
    return this[It].type;
  }
  get url() {
    return this[It].url || "";
  }
  get status() {
    return this[It].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[It].status >= 200 && this[It].status < 300;
  }
  get redirected() {
    return this[It].counter > 0;
  }
  get statusText() {
    return this[It].statusText;
  }
  get headers() {
    return this[It].headers;
  }
  get highWaterMark() {
    return this[It].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new gt(lu(this, this.highWaterMark), {
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
    return new gt(null, {
      headers: {
        location: new URL(t).toString()
      },
      status: r
    });
  }
  static error() {
    const t = new gt(null, { status: 0, statusText: "" });
    return t[It].type = "error", t;
  }
  static json(t = void 0, r = {}) {
    const n = JSON.stringify(t);
    if (n === void 0)
      throw new TypeError("data is not JSON serializable");
    const i = new dr(r && r.headers);
    return i.has("content-type") || i.set("content-type", "application/json"), new gt(n, {
      ...r,
      headers: i
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(gt.prototype, {
  type: { enumerable: !0 },
  url: { enumerable: !0 },
  status: { enumerable: !0 },
  ok: { enumerable: !0 },
  redirected: { enumerable: !0 },
  statusText: { enumerable: !0 },
  headers: { enumerable: !0 },
  clone: { enumerable: !0 }
});
const _g = (e) => {
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
function Eg(e) {
  if (!Nd.has(e))
    throw new TypeError(`Invalid referrerPolicy: ${e}`);
  return e;
}
function Sg(e) {
  if (/^(http|ws)s:$/.test(e.protocol))
    return !0;
  const t = e.host.replace(/(^\[)|(]$)/g, ""), r = Km(t);
  return r === 4 && /^127\./.test(t) || r === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(t) ? !0 : e.host === "localhost" || e.host.endsWith(".localhost") ? !1 : e.protocol === "file:";
}
function jn(e) {
  return /^about:(blank|srcdoc)$/.test(e) || e.protocol === "data:" || /^(blob|filesystem):$/.test(e.protocol) ? !0 : Sg(e);
}
function vg(e, { referrerURLCallback: t, referrerOriginCallback: r } = {}) {
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
      return jn(a) && !jn(u) ? "no-referrer" : s.toString();
    case "strict-origin-when-cross-origin":
      return a.origin === u.origin ? a : jn(a) && !jn(u) ? "no-referrer" : s;
    case "same-origin":
      return a.origin === u.origin ? a : "no-referrer";
    case "origin-when-cross-origin":
      return a.origin === u.origin ? a : s;
    case "no-referrer-when-downgrade":
      return jn(a) && !jn(u) ? "no-referrer" : a;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${n}`);
  }
}
function Cg(e) {
  const t = (e.get("referrer-policy") || "").split(/[,\s]+/);
  let r = "";
  for (const n of t)
    n && Nd.has(n) && (r = n);
  return r;
}
const xe = Symbol("Request internals"), Fi = (e) => typeof e == "object" && typeof e[xe] == "object", Rg = as(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
class Ki extends Qi {
  constructor(t, r = {}) {
    let n;
    if (Fi(t) ? n = new URL(t.url) : (n = new URL(t), t = {}), n.username !== "" || n.password !== "")
      throw new TypeError(`${n} is an url with embedded credentials.`);
    let i = r.method || t.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(i) && (i = i.toUpperCase()), !Fi(r) && "data" in r && Rg(), (r.body != null || Fi(t) && t.body !== null) && (i === "GET" || i === "HEAD"))
      throw new TypeError("Request with GET/HEAD method cannot have body");
    const a = r.body ? r.body : Fi(t) && t.body !== null ? lu(t) : null;
    super(a, {
      size: r.size || t.size || 0
    });
    const s = new dr(r.headers || t.headers || {});
    if (a !== null && !s.has("Content-Type")) {
      const g = Od(a, this);
      g && s.set("Content-Type", g);
    }
    let u = Fi(t) ? t.signal : null;
    if ("signal" in r && (u = r.signal), u != null && !cg(u))
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    let c = r.referrer == null ? t.referrer : r.referrer;
    if (c === "")
      c = "no-referrer";
    else if (c) {
      const g = new URL(c);
      c = /^about:(\/\/)?client$/.test(g) ? "client" : g;
    } else
      c = void 0;
    this[xe] = {
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
    return this[xe].method;
  }
  /** @returns {string} */
  get url() {
    return Gm(this[xe].parsedURL);
  }
  /** @returns {Headers} */
  get headers() {
    return this[xe].headers;
  }
  get redirect() {
    return this[xe].redirect;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return this[xe].signal;
  }
  // https://fetch.spec.whatwg.org/#dom-request-referrer
  get referrer() {
    if (this[xe].referrer === "no-referrer")
      return "";
    if (this[xe].referrer === "client")
      return "about:client";
    if (this[xe].referrer)
      return this[xe].referrer.toString();
  }
  get referrerPolicy() {
    return this[xe].referrerPolicy;
  }
  set referrerPolicy(t) {
    this[xe].referrerPolicy = Eg(t);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new Ki(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(Ki.prototype, {
  method: { enumerable: !0 },
  url: { enumerable: !0 },
  headers: { enumerable: !0 },
  redirect: { enumerable: !0 },
  clone: { enumerable: !0 },
  signal: { enumerable: !0 },
  referrer: { enumerable: !0 },
  referrerPolicy: { enumerable: !0 }
});
const Tg = (e) => {
  const { parsedURL: t } = e[xe], r = new dr(e[xe].headers);
  r.has("Accept") || r.set("Accept", "*/*");
  let n = null;
  if (e.body === null && /^(post|put)$/i.test(e.method) && (n = "0"), e.body !== null) {
    const u = mg(e);
    typeof u == "number" && !Number.isNaN(u) && (n = String(u));
  }
  n && r.set("Content-Length", n), e.referrerPolicy === "" && (e.referrerPolicy = wg), e.referrer && e.referrer !== "no-referrer" ? e[xe].referrer = vg(e) : e[xe].referrer = "no-referrer", e[xe].referrer instanceof URL && r.set("Referer", e.referrer), r.has("User-Agent") || r.set("User-Agent", "node-fetch"), e.compress && !r.has("Accept-Encoding") && r.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: i } = e;
  typeof i == "function" && (i = i(t));
  const a = _g(t), s = {
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
class Ag extends us {
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
const { stat: xT } = ou, Pg = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function cr(e, t) {
  return new Promise((r, n) => {
    const i = new Ki(e, t), { parsedURL: a, options: s } = Tg(i);
    if (!Pg.has(a.protocol))
      throw new TypeError(`node-fetch cannot load ${e}. URL scheme "${a.protocol.replace(/:$/, "")}" is not supported.`);
    if (a.protocol === "data:") {
      const E = tg(i.url), C = new gt(E, { headers: { "Content-Type": E.typeFull } });
      r(C);
      return;
    }
    const u = (a.protocol === "https:" ? Xm : Xi).request, { signal: c } = i;
    let g = null;
    const f = () => {
      const E = new Ag("The operation was aborted.");
      n(E), i.body && i.body instanceof Vt.Readable && i.body.destroy(E), !(!g || !g.body) && g.body.emit("error", E);
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
      n(new Gt(`request to ${i.url} failed, reason: ${E.message}`, "system", E)), b();
    }), Ig(m, (E) => {
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
      const C = yg(E.rawHeaders);
      if (Dd(E.statusCode)) {
        const x = C.get("Location");
        let te = null;
        try {
          te = x === null ? null : new URL(x, i.url);
        } catch {
          if (i.redirect !== "manual") {
            n(new Gt(`uri requested responds with an invalid redirect URL: ${x}`, "invalid-redirect")), b();
            return;
          }
        }
        switch (i.redirect) {
          case "error":
            n(new Gt(`uri requested responds with a redirect, redirect mode is set to error: ${i.url}`, "no-redirect")), b();
            return;
          case "manual":
            break;
          case "follow": {
            if (te === null)
              break;
            if (i.counter >= i.follow) {
              n(new Gt(`maximum redirect reached at: ${i.url}`, "max-redirect")), b();
              return;
            }
            const se = {
              headers: new dr(i.headers),
              follow: i.follow,
              counter: i.counter + 1,
              agent: i.agent,
              compress: i.compress,
              method: i.method,
              body: lu(i),
              signal: i.signal,
              size: i.size,
              referrer: i.referrer,
              referrerPolicy: i.referrerPolicy
            };
            if (!fg(i.url, te) || !dg(i.url, te))
              for (const Fe of ["authorization", "www-authenticate", "cookie", "cookie2"])
                se.headers.delete(Fe);
            if (E.statusCode !== 303 && i.body && t.body instanceof Vt.Readable) {
              n(new Gt("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), b();
              return;
            }
            (E.statusCode === 303 || (E.statusCode === 301 || E.statusCode === 302) && i.method === "POST") && (se.method = "GET", se.body = void 0, se.headers.delete("content-length"));
            const Q = Cg(C);
            Q && (se.referrerPolicy = Q), r(cr(new Ki(te, se))), b();
            return;
          }
          default:
            return n(new TypeError(`Redirect option '${i.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      c && E.once("end", () => {
        c.removeEventListener("abort", h);
      });
      let A = qn(E, new Ma(), (x) => {
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
        g = new gt(A, I), r(g);
        return;
      }
      const M = {
        flush: Mn.Z_SYNC_FLUSH,
        finishFlush: Mn.Z_SYNC_FLUSH
      };
      if ($ === "gzip" || $ === "x-gzip") {
        A = qn(A, Mn.createGunzip(M), (x) => {
          x && n(x);
        }), g = new gt(A, I), r(g);
        return;
      }
      if ($ === "deflate" || $ === "x-deflate") {
        const x = qn(E, new Ma(), (te) => {
          te && n(te);
        });
        x.once("data", (te) => {
          (te[0] & 15) === 8 ? A = qn(A, Mn.createInflate(), (se) => {
            se && n(se);
          }) : A = qn(A, Mn.createInflateRaw(), (se) => {
            se && n(se);
          }), g = new gt(A, I), r(g);
        }), x.once("end", () => {
          g || (g = new gt(A, I), r(g));
        });
        return;
      }
      if ($ === "br") {
        A = qn(A, Mn.createBrotliDecompress(), (x) => {
          x && n(x);
        }), g = new gt(A, I), r(g);
        return;
      }
      g = new gt(A, I), r(g);
    }), gg(m, i).catch(n);
  });
}
function Ig(e, t) {
  const r = ze.from(`0\r
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
      i = ze.compare(g.slice(-5), r) === 0, !i && a && (i = ze.compare(a.slice(-3), r.slice(0, 3)) === 0 && ze.compare(g.slice(-2), r.slice(3)) === 0), a = g;
    };
    s.prependListener("close", u), s.on("data", c), e.on("close", () => {
      s.removeListener("close", u), s.removeListener("data", c);
    });
  });
}
class $g extends au {
  constructor() {
    super(...arguments);
    $e(this, "creds", null);
    $e(this, "timer", null);
    $e(this, "phase", "Unknown");
  }
  /* -------- API publique -------- */
  setCreds(r) {
    this.creds = r, this.timer || this.start();
  }
  stop() {
    this.timer && clearInterval(this.timer), this.timer = null, this.phase = "Unknown", this.emit("phase", this.phase);
  }
  /* -------- internes -------- */
  async poll() {
    if (!this.creds) return;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-gameflow/v1/gameflow-phase`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      const u = (await cr(a, { headers: { Authorization: `Basic ${s}` } }).then(
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
  /* typing helpers */
  on(r, n) {
    return super.on(r, n);
  }
  emit(r, n) {
    return super.emit(r, n);
  }
}
const jl = /* @__PURE__ */ new Map();
async function Og() {
  if (jl.size) return;
  (await cr("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json").then((r) => r.json())).forEach((r) => jl.set(r.id, r.alias));
}
class Dg extends au {
  constructor() {
    super(...arguments);
    $e(this, "creds", null);
    $e(this, "summonerId", null);
    $e(this, "poller", null);
    $e(this, "currentChampion", 0);
    $e(this, "lastAppliedChampion", 0);
    $e(this, "includeDefaultSkin", !0);
    $e(this, "selectedSkinId", 0);
    $e(this, "selectedChromaId", 0);
    $e(this, "profileIconId", 0);
    $e(this, "autoRollEnabled", !0);
    $e(this, "skins", []);
  }
  /* ---------- gestion des creds ---------- */
  setCreds(r) {
    this.stop(), this.creds = r, this.summonerId = null, this.lastAppliedChampion = 0;
  }
  start() {
    !this.creds || this.poller || (this.tick(), this.poller = setInterval(() => this.tick(), 2e3));
  }
  stop() {
    this.poller && clearInterval(this.poller), this.poller = null, this.currentChampion = 0, this.lastAppliedChampion = 0, this.skins.length && (this.skins = [], this.emit("skins", []));
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
      championAlias: jl.get(this.currentChampion) ?? "",
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
  /** Reroll manuel (skin + chroma éventuelle) */
  async rerollSkin() {
    if (!this.skins.length) return;
    const r = this.includeDefaultSkin ? this.skins : this.skins.filter((a) => a.id % 1e3 !== 0) || this.skins, n = r[Math.floor(Math.random() * r.length)], i = n.chromas.length ? n.chromas[Math.floor(Math.random() * n.chromas.length)].id : n.id;
    await this.applySkin(i), this.selectedSkinId = n.id, this.selectedChromaId = i !== n.id ? i : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
  }
  /** Reroll uniquement le chroma pour le skin courant */
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
    r && r !== this.currentChampion && (this.currentChampion = r, await this.refreshSkinsAndMaybeApply()), await this.updateManualSelection();
  }
  /* ---------- helpers ---------- */
  async fetchSummonerId() {
    if (!this.creds) return;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-summoner/v1/current-summoner`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      const u = await cr(a, {
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
        await cr(a, {
          headers: { Authorization: `Basic ${s}` }
        }).then((u) => u.text())
      ) || 0;
    } catch {
      return 0;
    }
  }
  async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    await Og();
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}`, s = {
      Authorization: `Basic ${Buffer.from(`riot:${i}`).toString(
        "base64"
      )}`
    }, u = await cr(
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
        f = (await cr(
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
    if (this.skins = c, this.emit("skins", c), this.autoRollEnabled && this.currentChampion !== this.lastAppliedChampion && c.length) {
      const g = this.includeDefaultSkin ? c : c.filter((m) => m.id % 1e3 !== 0) || c, f = g[Math.floor(Math.random() * g.length)], h = f.chromas.length ? f.chromas[Math.floor(Math.random() * f.chromas.length)].id : f.id;
      await this.applySkin(h), this.selectedSkinId = f.id, this.selectedChromaId = h !== f.id ? h : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
    }
  }
  async applySkin(r) {
    if (!this.creds) return;
    const { protocol: n, port: i, password: a } = this.creds, s = `${n}://127.0.0.1:${i}/lol-champ-select/v1/session/my-selection`, u = Buffer.from(`riot:${a}`).toString("base64");
    try {
      await cr(s, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${u}`
        },
        body: JSON.stringify({ selectedSkinId: r })
      });
    } catch {
    }
  }
  /** détecte la sélection faite directement dans le client */
  async updateManualSelection() {
    if (!this.creds || !this.currentChampion) return;
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}/lol-champ-select/v1/session/my-selection`, s = Buffer.from(`riot:${i}`).toString("base64");
    try {
      const c = (await cr(a, {
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
  /* implémentation générique — doit accepter TOUS les cas */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  on(r, n) {
    return super.on(r, n);
  }
  /* implémentation générique */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  emit(r, ...n) {
    return super.emit(r, ...n);
  }
}
var lr = {}, gn = {}, et = {};
et.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, a) => i != null ? n(i) : r(a)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
et.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Pr = Jm, Ng = process.cwd, La = null, Fg = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return La || (La = Ng.call(process)), La;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Rc = process.chdir;
  process.chdir = function(e) {
    La = null, Rc.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Rc);
}
var kg = Lg;
function Lg(e) {
  Pr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = u(e.stat), e.fstat = u(e.fstat), e.lstat = u(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(f, h, m) {
    m && process.nextTick(m);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(f, h, m, b) {
    b && process.nextTick(b);
  }, e.lchownSync = function() {
  }), Fg === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(f) {
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
        $ = function(x, te, se) {
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
        Pr.O_WRONLY | Pr.O_SYMLINK,
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
      var b = f.openSync(h, Pr.O_WRONLY | Pr.O_SYMLINK, m), E = !0, C;
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
    Pr.hasOwnProperty("O_SYMLINK") && f.futimes ? (f.lutimes = function(h, m, b, E) {
      f.open(h, Pr.O_SYMLINK, function(C, A) {
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
      var E = f.openSync(h, Pr.O_SYMLINK), C, A = !0;
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
var Tc = yo.Stream, xg = Ug;
function Ug(e) {
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
var Bg = qg, Mg = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function qg(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Mg(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ve = jr, jg = kg, Wg = xg, Hg = Bg, _a = su, je, za;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (je = Symbol.for("graceful-fs.queue"), za = Symbol.for("graceful-fs.previous")) : (je = "___graceful-fs.queue", za = "___graceful-fs.previous");
function zg() {
}
function Fd(e, t) {
  Object.defineProperty(e, je, {
    get: function() {
      return t;
    }
  });
}
var fn = zg;
_a.debuglog ? fn = _a.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (fn = function() {
  var e = _a.format.apply(_a, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ve[je]) {
  var Gg = Be[je] || [];
  Fd(ve, Gg), ve.close = function(e) {
    function t(r, n) {
      return e.call(ve, r, function(i) {
        i || Ac(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, za, {
      value: e
    }), t;
  }(ve.close), ve.closeSync = function(e) {
    function t(r) {
      e.apply(ve, arguments), Ac();
    }
    return Object.defineProperty(t, za, {
      value: e
    }), t;
  }(ve.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    fn(ve[je]), Rd.equal(ve[je].length, 0);
  });
}
Be[je] || Fd(Be, ve[je]);
var tt = uu(Hg(ve));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ve.__patched && (tt = uu(ve), ve.__patched = !0);
function uu(e) {
  jg(e), e.gracefulify = uu, e.createReadStream = te, e.createWriteStream = se;
  var t = e.readFile;
  e.readFile = r;
  function r(S, re, Z) {
    return typeof re == "function" && (Z = re, re = null), X(S, re, Z);
    function X(fe, L, D, B) {
      return t(fe, L, function(N) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Wn([X, [fe, L, D], N, B || Date.now(), Date.now()]) : typeof D == "function" && D.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = null), fe(S, re, Z, X);
    function fe(L, D, B, N, q) {
      return n(L, D, B, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Wn([fe, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  var a = e.appendFile;
  a && (e.appendFile = s);
  function s(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = null), fe(S, re, Z, X);
    function fe(L, D, B, N, q) {
      return a(L, D, B, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Wn([fe, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  var u = e.copyFile;
  u && (e.copyFile = c);
  function c(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = 0), fe(S, re, Z, X);
    function fe(L, D, B, N, q) {
      return u(L, D, B, function(U) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Wn([fe, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  var g = e.readdir;
  e.readdir = h;
  var f = /^v[0-5]\./;
  function h(S, re, Z) {
    typeof re == "function" && (Z = re, re = null);
    var X = f.test(process.version) ? function(D, B, N, q) {
      return g(D, fe(
        D,
        B,
        N,
        q
      ));
    } : function(D, B, N, q) {
      return g(D, B, fe(
        D,
        B,
        N,
        q
      ));
    };
    return X(S, re, Z);
    function fe(L, D, B, N) {
      return function(q, U) {
        q && (q.code === "EMFILE" || q.code === "ENFILE") ? Wn([
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
    var m = Wg(e);
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
    Fe(S.path, S.flags, S.mode, function(re, Z) {
      re ? (S.autoClose && S.destroy(), S.emit("error", re)) : (S.fd = Z, S.emit("open", Z), S.read());
    });
  }
  function M(S, re) {
    return this instanceof M ? (E.apply(this, arguments), this) : M.apply(Object.create(M.prototype), arguments);
  }
  function x() {
    var S = this;
    Fe(S.path, S.flags, S.mode, function(re, Z) {
      re ? (S.destroy(), S.emit("error", re)) : (S.fd = Z, S.emit("open", Z));
    });
  }
  function te(S, re) {
    return new e.ReadStream(S, re);
  }
  function se(S, re) {
    return new e.WriteStream(S, re);
  }
  var Q = e.open;
  e.open = Fe;
  function Fe(S, re, Z, X) {
    return typeof Z == "function" && (X = Z, Z = null), fe(S, re, Z, X);
    function fe(L, D, B, N, q) {
      return Q(L, D, B, function(U, V) {
        U && (U.code === "EMFILE" || U.code === "ENFILE") ? Wn([fe, [L, D, B, N], U, q || Date.now(), Date.now()]) : typeof N == "function" && N.apply(this, arguments);
      });
    }
  }
  return e;
}
function Wn(e) {
  fn("ENQUEUE", e[0].name, e[1]), ve[je].push(e), cu();
}
var wa;
function Ac() {
  for (var e = Date.now(), t = 0; t < ve[je].length; ++t)
    ve[je][t].length > 2 && (ve[je][t][3] = e, ve[je][t][4] = e);
  cu();
}
function cu() {
  if (clearTimeout(wa), wa = void 0, ve[je].length !== 0) {
    var e = ve[je].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      fn("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      fn("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var u = Date.now() - a, c = Math.max(a - i, 1), g = Math.min(c * 1.2, 100);
      u >= g ? (fn("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ve[je].push(e);
    }
    wa === void 0 && (wa = setTimeout(cu, 0));
  }
}
(function(e) {
  const t = et.fromCallback, r = tt, n = [
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
})(gn);
var fu = {}, kd = {};
const Vg = Ce;
kd.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Vg.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Ld = gn, { checkPath: xd } = kd, Ud = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
fu.makeDir = async (e, t) => (xd(e), Ld.mkdir(e, {
  mode: Ud(t),
  recursive: !0
}));
fu.makeDirSync = (e, t) => (xd(e), Ld.mkdirSync(e, {
  mode: Ud(t),
  recursive: !0
}));
const Yg = et.fromPromise, { makeDir: Xg, makeDirSync: ll } = fu, ul = Yg(Xg);
var Xt = {
  mkdirs: ul,
  mkdirsSync: ll,
  // alias
  mkdirp: ul,
  mkdirpSync: ll,
  ensureDir: ul,
  ensureDirSync: ll
};
const Qg = et.fromPromise, Bd = gn;
function Kg(e) {
  return Bd.access(e).then(() => !0).catch(() => !1);
}
var yn = {
  pathExists: Qg(Kg),
  pathExistsSync: Bd.existsSync
};
const ni = tt;
function Jg(e, t, r, n) {
  ni.open(e, "r+", (i, a) => {
    if (i) return n(i);
    ni.futimes(a, t, r, (s) => {
      ni.close(a, (u) => {
        n && n(s || u);
      });
    });
  });
}
function Zg(e, t, r) {
  const n = ni.openSync(e, "r+");
  return ni.futimesSync(n, t, r), ni.closeSync(n);
}
var Md = {
  utimesMillis: Jg,
  utimesMillisSync: Zg
};
const ai = gn, Ue = Ce, ey = su;
function ty(e, t, r) {
  const n = r.dereference ? (i) => ai.stat(i, { bigint: !0 }) : (i) => ai.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function ry(e, t, r) {
  let n;
  const i = r.dereference ? (s) => ai.statSync(s, { bigint: !0 }) : (s) => ai.lstatSync(s, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: a, destStat: null };
    throw s;
  }
  return { srcStat: a, destStat: n };
}
function ny(e, t, r, n, i) {
  ey.callbackify(ty)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: u, destStat: c } = s;
    if (c) {
      if (_o(u, c)) {
        const g = Ue.basename(e), f = Ue.basename(t);
        return r === "move" && g !== f && g.toLowerCase() === f.toLowerCase() ? i(null, { srcStat: u, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (u.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!u.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return u.isDirectory() && du(e, t) ? i(new Error(cs(e, t, r))) : i(null, { srcStat: u, destStat: c });
  });
}
function iy(e, t, r, n) {
  const { srcStat: i, destStat: a } = ry(e, t, n);
  if (a) {
    if (_o(i, a)) {
      const s = Ue.basename(e), u = Ue.basename(t);
      if (r === "move" && s !== u && s.toLowerCase() === u.toLowerCase())
        return { srcStat: i, destStat: a, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !a.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && a.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && du(e, t))
    throw new Error(cs(e, t, r));
  return { srcStat: i, destStat: a };
}
function qd(e, t, r, n, i) {
  const a = Ue.resolve(Ue.dirname(e)), s = Ue.resolve(Ue.dirname(r));
  if (s === a || s === Ue.parse(s).root) return i();
  ai.stat(s, { bigint: !0 }, (u, c) => u ? u.code === "ENOENT" ? i() : i(u) : _o(t, c) ? i(new Error(cs(e, r, n))) : qd(e, t, s, n, i));
}
function jd(e, t, r, n) {
  const i = Ue.resolve(Ue.dirname(e)), a = Ue.resolve(Ue.dirname(r));
  if (a === i || a === Ue.parse(a).root) return;
  let s;
  try {
    s = ai.statSync(a, { bigint: !0 });
  } catch (u) {
    if (u.code === "ENOENT") return;
    throw u;
  }
  if (_o(t, s))
    throw new Error(cs(e, r, n));
  return jd(e, t, a, n);
}
function _o(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function du(e, t) {
  const r = Ue.resolve(e).split(Ue.sep).filter((i) => i), n = Ue.resolve(t).split(Ue.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function cs(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var fi = {
  checkPaths: ny,
  checkPathsSync: iy,
  checkParentPaths: qd,
  checkParentPathsSync: jd,
  isSrcSubdir: du,
  areIdentical: _o
};
const ct = tt, Ji = Ce, oy = Xt.mkdirs, ay = yn.pathExists, sy = Md.utimesMillis, Zi = fi;
function ly(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Zi.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: u } = a;
    Zi.checkParentPaths(e, s, t, "copy", (c) => c ? n(c) : r.filter ? Wd(Pc, u, e, t, r, n) : Pc(u, e, t, r, n));
  });
}
function Pc(e, t, r, n, i) {
  const a = Ji.dirname(r);
  ay(a, (s, u) => {
    if (s) return i(s);
    if (u) return Ga(e, t, r, n, i);
    oy(a, (c) => c ? i(c) : Ga(e, t, r, n, i));
  });
}
function Wd(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function uy(e, t, r, n, i) {
  return n.filter ? Wd(Ga, e, t, r, n, i) : Ga(e, t, r, n, i);
}
function Ga(e, t, r, n, i) {
  (n.dereference ? ct.stat : ct.lstat)(t, (s, u) => s ? i(s) : u.isDirectory() ? gy(u, e, t, r, n, i) : u.isFile() || u.isCharacterDevice() || u.isBlockDevice() ? cy(u, e, t, r, n, i) : u.isSymbolicLink() ? _y(e, t, r, n, i) : u.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : u.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function cy(e, t, r, n, i, a) {
  return t ? fy(e, r, n, i, a) : Hd(e, r, n, i, a);
}
function fy(e, t, r, n, i) {
  if (n.overwrite)
    ct.unlink(r, (a) => a ? i(a) : Hd(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Hd(e, t, r, n, i) {
  ct.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? dy(e.mode, t, r, i) : fs(r, e.mode, i));
}
function dy(e, t, r, n) {
  return hy(e) ? py(r, e, (i) => i ? n(i) : Ic(e, t, r, n)) : Ic(e, t, r, n);
}
function hy(e) {
  return (e & 128) === 0;
}
function py(e, t, r) {
  return fs(e, t | 128, r);
}
function Ic(e, t, r, n) {
  my(t, r, (i) => i ? n(i) : fs(r, e, n));
}
function fs(e, t, r) {
  return ct.chmod(e, t, r);
}
function my(e, t, r) {
  ct.stat(e, (n, i) => n ? r(n) : sy(t, i.atime, i.mtime, r));
}
function gy(e, t, r, n, i, a) {
  return t ? zd(r, n, i, a) : yy(e.mode, r, n, i, a);
}
function yy(e, t, r, n, i) {
  ct.mkdir(r, (a) => {
    if (a) return i(a);
    zd(t, r, n, (s) => s ? i(s) : fs(r, e, i));
  });
}
function zd(e, t, r, n) {
  ct.readdir(e, (i, a) => i ? n(i) : Gd(a, e, t, r, n));
}
function Gd(e, t, r, n, i) {
  const a = e.pop();
  return a ? by(e, a, t, r, n, i) : i();
}
function by(e, t, r, n, i, a) {
  const s = Ji.join(r, t), u = Ji.join(n, t);
  Zi.checkPaths(s, u, "copy", i, (c, g) => {
    if (c) return a(c);
    const { destStat: f } = g;
    uy(f, s, u, i, (h) => h ? a(h) : Gd(e, r, n, i, a));
  });
}
function _y(e, t, r, n, i) {
  ct.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Ji.resolve(process.cwd(), s)), e)
      ct.readlink(r, (u, c) => u ? u.code === "EINVAL" || u.code === "UNKNOWN" ? ct.symlink(s, r, i) : i(u) : (n.dereference && (c = Ji.resolve(process.cwd(), c)), Zi.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Zi.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : wy(s, r, i)));
    else
      return ct.symlink(s, r, i);
  });
}
function wy(e, t, r) {
  ct.unlink(t, (n) => n ? r(n) : ct.symlink(e, t, r));
}
var Ey = ly;
const Ge = tt, eo = Ce, Sy = Xt.mkdirsSync, vy = Md.utimesMillisSync, to = fi;
function Cy(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = to.checkPathsSync(e, t, "copy", r);
  return to.checkParentPathsSync(e, n, t, "copy"), Ry(i, e, t, r);
}
function Ry(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = eo.dirname(r);
  return Ge.existsSync(i) || Sy(i), Vd(e, t, r, n);
}
function Ty(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Vd(e, t, r, n);
}
function Vd(e, t, r, n) {
  const a = (n.dereference ? Ge.statSync : Ge.lstatSync)(t);
  if (a.isDirectory()) return Ny(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return Ay(a, e, t, r, n);
  if (a.isSymbolicLink()) return Ly(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Ay(e, t, r, n, i) {
  return t ? Py(e, r, n, i) : Yd(e, r, n, i);
}
function Py(e, t, r, n) {
  if (n.overwrite)
    return Ge.unlinkSync(r), Yd(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Yd(e, t, r, n) {
  return Ge.copyFileSync(t, r), n.preserveTimestamps && Iy(e.mode, t, r), hu(r, e.mode);
}
function Iy(e, t, r) {
  return $y(e) && Oy(r, e), Dy(t, r);
}
function $y(e) {
  return (e & 128) === 0;
}
function Oy(e, t) {
  return hu(e, t | 128);
}
function hu(e, t) {
  return Ge.chmodSync(e, t);
}
function Dy(e, t) {
  const r = Ge.statSync(e);
  return vy(t, r.atime, r.mtime);
}
function Ny(e, t, r, n, i) {
  return t ? Xd(r, n, i) : Fy(e.mode, r, n, i);
}
function Fy(e, t, r, n) {
  return Ge.mkdirSync(r), Xd(t, r, n), hu(r, e);
}
function Xd(e, t, r) {
  Ge.readdirSync(e).forEach((n) => ky(n, e, t, r));
}
function ky(e, t, r, n) {
  const i = eo.join(t, e), a = eo.join(r, e), { destStat: s } = to.checkPathsSync(i, a, "copy", n);
  return Ty(s, i, a, n);
}
function Ly(e, t, r, n) {
  let i = Ge.readlinkSync(t);
  if (n.dereference && (i = eo.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ge.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Ge.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = eo.resolve(process.cwd(), a)), to.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ge.statSync(r).isDirectory() && to.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return xy(i, r);
  } else
    return Ge.symlinkSync(i, r);
}
function xy(e, t) {
  return Ge.unlinkSync(t), Ge.symlinkSync(e, t);
}
var Uy = Cy;
const By = et.fromCallback;
var pu = {
  copy: By(Ey),
  copySync: Uy
};
const $c = tt, Qd = Ce, ye = Rd, ro = process.platform === "win32";
function Kd(e) {
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
function mu(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ye(e, "rimraf: missing path"), ye.strictEqual(typeof e, "string", "rimraf: path should be a string"), ye.strictEqual(typeof r, "function", "rimraf: callback function required"), ye(t, "rimraf: invalid options argument provided"), ye.strictEqual(typeof t, "object", "rimraf: options should be object"), Kd(t), Oc(e, t, function i(a) {
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
  ye(e), ye(t), ye(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && ro)
      return Dc(e, t, n, r);
    if (i && i.isDirectory())
      return xa(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return ro ? Dc(e, t, a, r) : xa(e, t, a, r);
        if (a.code === "EISDIR")
          return xa(e, t, a, r);
      }
      return r(a);
    });
  });
}
function Dc(e, t, r, n) {
  ye(e), ye(t), ye(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? xa(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Nc(e, t, r) {
  let n;
  ye(e), ye(t);
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
  n.isDirectory() ? Ua(e, t, r) : t.unlinkSync(e);
}
function xa(e, t, r, n) {
  ye(e), ye(t), ye(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? My(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function My(e, t, r) {
  ye(e), ye(t), ye(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((u) => {
      mu(Qd.join(e, u), t, (c) => {
        if (!s) {
          if (c) return r(s = c);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Jd(e, t) {
  let r;
  t = t || {}, Kd(t), ye(e, "rimraf: missing path"), ye.strictEqual(typeof e, "string", "rimraf: path should be a string"), ye(t, "rimraf: missing options"), ye.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && ro && Nc(e, t, n);
  }
  try {
    r && r.isDirectory() ? Ua(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return ro ? Nc(e, t, n) : Ua(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Ua(e, t, n);
  }
}
function Ua(e, t, r) {
  ye(e), ye(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      qy(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function qy(e, t) {
  if (ye(e), ye(t), t.readdirSync(e).forEach((r) => Jd(Qd.join(e, r), t)), ro) {
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
var jy = mu;
mu.sync = Jd;
const Va = tt, Wy = et.fromCallback, Zd = jy;
function Hy(e, t) {
  if (Va.rm) return Va.rm(e, { recursive: !0, force: !0 }, t);
  Zd(e, t);
}
function zy(e) {
  if (Va.rmSync) return Va.rmSync(e, { recursive: !0, force: !0 });
  Zd.sync(e);
}
var ds = {
  remove: Wy(Hy),
  removeSync: zy
};
const Gy = et.fromPromise, eh = gn, th = Ce, rh = Xt, nh = ds, Fc = Gy(async function(t) {
  let r;
  try {
    r = await eh.readdir(t);
  } catch {
    return rh.mkdirs(t);
  }
  return Promise.all(r.map((n) => nh.remove(th.join(t, n))));
});
function kc(e) {
  let t;
  try {
    t = eh.readdirSync(e);
  } catch {
    return rh.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = th.join(e, r), nh.removeSync(r);
  });
}
var Vy = {
  emptyDirSync: kc,
  emptydirSync: kc,
  emptyDir: Fc,
  emptydir: Fc
};
const Yy = et.fromCallback, ih = Ce, Nr = tt, oh = Xt;
function Xy(e, t) {
  function r() {
    Nr.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Nr.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = ih.dirname(e);
    Nr.stat(a, (s, u) => {
      if (s)
        return s.code === "ENOENT" ? oh.mkdirs(a, (c) => {
          if (c) return t(c);
          r();
        }) : t(s);
      u.isDirectory() ? r() : Nr.readdir(a, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function Qy(e) {
  let t;
  try {
    t = Nr.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = ih.dirname(e);
  try {
    Nr.statSync(r).isDirectory() || Nr.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") oh.mkdirsSync(r);
    else throw n;
  }
  Nr.writeFileSync(e, "");
}
var Ky = {
  createFile: Yy(Xy),
  createFileSync: Qy
};
const Jy = et.fromCallback, ah = Ce, Dr = tt, sh = Xt, Zy = yn.pathExists, { areIdentical: lh } = fi;
function e0(e, t, r) {
  function n(i, a) {
    Dr.link(i, a, (s) => {
      if (s) return r(s);
      r(null);
    });
  }
  Dr.lstat(t, (i, a) => {
    Dr.lstat(e, (s, u) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), r(s);
      if (a && lh(u, a)) return r(null);
      const c = ah.dirname(t);
      Zy(c, (g, f) => {
        if (g) return r(g);
        if (f) return n(e, t);
        sh.mkdirs(c, (h) => {
          if (h) return r(h);
          n(e, t);
        });
      });
    });
  });
}
function t0(e, t) {
  let r;
  try {
    r = Dr.lstatSync(t);
  } catch {
  }
  try {
    const a = Dr.lstatSync(e);
    if (r && lh(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = ah.dirname(t);
  return Dr.existsSync(n) || sh.mkdirsSync(n), Dr.linkSync(e, t);
}
var r0 = {
  createLink: Jy(e0),
  createLinkSync: t0
};
const Fr = Ce, zi = tt, n0 = yn.pathExists;
function i0(e, t, r) {
  if (Fr.isAbsolute(e))
    return zi.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Fr.dirname(t), i = Fr.join(n, e);
    return n0(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : zi.lstat(e, (u) => u ? (u.message = u.message.replace("lstat", "ensureSymlink"), r(u)) : r(null, {
      toCwd: e,
      toDst: Fr.relative(n, e)
    })));
  }
}
function o0(e, t) {
  let r;
  if (Fr.isAbsolute(e)) {
    if (r = zi.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Fr.dirname(t), i = Fr.join(n, e);
    if (r = zi.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = zi.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Fr.relative(n, e)
    };
  }
}
var a0 = {
  symlinkPaths: i0,
  symlinkPathsSync: o0
};
const uh = tt;
function s0(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  uh.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function l0(e, t) {
  let r;
  if (t) return t;
  try {
    r = uh.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var u0 = {
  symlinkType: s0,
  symlinkTypeSync: l0
};
const c0 = et.fromCallback, ch = Ce, $t = gn, fh = Xt, f0 = fh.mkdirs, d0 = fh.mkdirsSync, dh = a0, h0 = dh.symlinkPaths, p0 = dh.symlinkPathsSync, hh = u0, m0 = hh.symlinkType, g0 = hh.symlinkTypeSync, y0 = yn.pathExists, { areIdentical: ph } = fi;
function b0(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, $t.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      $t.stat(e),
      $t.stat(t)
    ]).then(([s, u]) => {
      if (ph(s, u)) return n(null);
      Lc(e, t, r, n);
    }) : Lc(e, t, r, n);
  });
}
function Lc(e, t, r, n) {
  h0(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, m0(a.toCwd, r, (s, u) => {
      if (s) return n(s);
      const c = ch.dirname(t);
      y0(c, (g, f) => {
        if (g) return n(g);
        if (f) return $t.symlink(e, t, u, n);
        f0(c, (h) => {
          if (h) return n(h);
          $t.symlink(e, t, u, n);
        });
      });
    });
  });
}
function _0(e, t, r) {
  let n;
  try {
    n = $t.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const u = $t.statSync(e), c = $t.statSync(t);
    if (ph(u, c)) return;
  }
  const i = p0(e, t);
  e = i.toDst, r = g0(i.toCwd, r);
  const a = ch.dirname(t);
  return $t.existsSync(a) || d0(a), $t.symlinkSync(e, t, r);
}
var w0 = {
  createSymlink: c0(b0),
  createSymlinkSync: _0
};
const { createFile: xc, createFileSync: Uc } = Ky, { createLink: Bc, createLinkSync: Mc } = r0, { createSymlink: qc, createSymlinkSync: jc } = w0;
var E0 = {
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
function S0(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function v0(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var gu = { stringify: S0, stripBom: v0 };
let si;
try {
  si = tt;
} catch {
  si = jr;
}
const hs = et, { stringify: mh, stripBom: gh } = gu;
async function C0(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || si, n = "throws" in t ? t.throws : !0;
  let i = await hs.fromCallback(r.readFile)(e, t);
  i = gh(i);
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
const R0 = hs.fromPromise(C0);
function T0(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || si, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = gh(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function A0(e, t, r = {}) {
  const n = r.fs || si, i = mh(t, r);
  await hs.fromCallback(n.writeFile)(e, i, r);
}
const P0 = hs.fromPromise(A0);
function I0(e, t, r = {}) {
  const n = r.fs || si, i = mh(t, r);
  return n.writeFileSync(e, i, r);
}
const $0 = {
  readFile: R0,
  readFileSync: T0,
  writeFile: P0,
  writeFileSync: I0
};
var O0 = $0;
const Ea = O0;
var D0 = {
  // jsonfile exports
  readJson: Ea.readFile,
  readJsonSync: Ea.readFileSync,
  writeJson: Ea.writeFile,
  writeJsonSync: Ea.writeFileSync
};
const N0 = et.fromCallback, Gi = tt, yh = Ce, bh = Xt, F0 = yn.pathExists;
function k0(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = yh.dirname(e);
  F0(i, (a, s) => {
    if (a) return n(a);
    if (s) return Gi.writeFile(e, t, r, n);
    bh.mkdirs(i, (u) => {
      if (u) return n(u);
      Gi.writeFile(e, t, r, n);
    });
  });
}
function L0(e, ...t) {
  const r = yh.dirname(e);
  if (Gi.existsSync(r))
    return Gi.writeFileSync(e, ...t);
  bh.mkdirsSync(r), Gi.writeFileSync(e, ...t);
}
var yu = {
  outputFile: N0(k0),
  outputFileSync: L0
};
const { stringify: x0 } = gu, { outputFile: U0 } = yu;
async function B0(e, t, r = {}) {
  const n = x0(t, r);
  await U0(e, n, r);
}
var M0 = B0;
const { stringify: q0 } = gu, { outputFileSync: j0 } = yu;
function W0(e, t, r) {
  const n = q0(t, r);
  j0(e, n, r);
}
var H0 = W0;
const z0 = et.fromPromise, Ze = D0;
Ze.outputJson = z0(M0);
Ze.outputJsonSync = H0;
Ze.outputJSON = Ze.outputJson;
Ze.outputJSONSync = Ze.outputJsonSync;
Ze.writeJSON = Ze.writeJson;
Ze.writeJSONSync = Ze.writeJsonSync;
Ze.readJSON = Ze.readJson;
Ze.readJSONSync = Ze.readJsonSync;
var G0 = Ze;
const V0 = tt, Wl = Ce, Y0 = pu.copy, _h = ds.remove, X0 = Xt.mkdirp, Q0 = yn.pathExists, Wc = fi;
function K0(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Wc.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: u, isChangingCase: c = !1 } = s;
    Wc.checkParentPaths(e, u, t, "move", (g) => {
      if (g) return n(g);
      if (J0(t)) return Hc(e, t, i, c, n);
      X0(Wl.dirname(t), (f) => f ? n(f) : Hc(e, t, i, c, n));
    });
  });
}
function J0(e) {
  const t = Wl.dirname(e);
  return Wl.parse(t).root === t;
}
function Hc(e, t, r, n, i) {
  if (n) return cl(e, t, r, i);
  if (r)
    return _h(t, (a) => a ? i(a) : cl(e, t, r, i));
  Q0(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : cl(e, t, r, i));
}
function cl(e, t, r, n) {
  V0.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Z0(e, t, r, n) : n());
}
function Z0(e, t, r, n) {
  Y0(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : _h(e, n));
}
var eb = K0;
const wh = tt, Hl = Ce, tb = pu.copySync, Eh = ds.removeSync, rb = Xt.mkdirpSync, zc = fi;
function nb(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = zc.checkPathsSync(e, t, "move", r);
  return zc.checkParentPathsSync(e, i, t, "move"), ib(t) || rb(Hl.dirname(t)), ob(e, t, n, a);
}
function ib(e) {
  const t = Hl.dirname(e);
  return Hl.parse(t).root === t;
}
function ob(e, t, r, n) {
  if (n) return fl(e, t, r);
  if (r)
    return Eh(t), fl(e, t, r);
  if (wh.existsSync(t)) throw new Error("dest already exists.");
  return fl(e, t, r);
}
function fl(e, t, r) {
  try {
    wh.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return ab(e, t, r);
  }
}
function ab(e, t, r) {
  return tb(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), Eh(e);
}
var sb = nb;
const lb = et.fromCallback;
var ub = {
  move: lb(eb),
  moveSync: sb
}, Wr = {
  // Export promiseified graceful-fs:
  ...gn,
  // Export extra methods:
  ...pu,
  ...Vy,
  ...E0,
  ...G0,
  ...Xt,
  ...ub,
  ...yu,
  ...yn,
  ...ds
}, pr = {}, xr = {}, Me = {}, Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.CancellationError = Ur.CancellationToken = void 0;
const cb = Td;
class fb extends cb.EventEmitter {
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
      return Promise.reject(new zl());
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
          a(new zl());
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
Ur.CancellationToken = fb;
class zl extends Error {
  constructor() {
    super("cancelled");
  }
}
Ur.CancellationError = zl;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.newError = db;
function db(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Ke = {}, Gl = { exports: {} }, Sa = { exports: {} }, dl, Gc;
function hb() {
  if (Gc) return dl;
  Gc = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  dl = function(f, h) {
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
  return dl;
}
var hl, Vc;
function Sh() {
  if (Vc) return hl;
  Vc = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = g, n.disable = u, n.enable = a, n.enabled = c, n.humanize = hb(), n.destroy = f, Object.keys(t).forEach((h) => {
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
        I[0] = I[0].replace(/%([a-zA-Z%])/g, (Q, Fe) => {
          if (Q === "%%")
            return "%";
          te++;
          const S = n.formatters[Fe];
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
  return hl = e, hl;
}
var Yc;
function pb() {
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
    e.exports = Sh()(t);
    const { formatters: u } = e.exports;
    u.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (g) {
        return "[UnexpectedJSONParseError]: " + g.message;
      }
    };
  }(Sa, Sa.exports)), Sa.exports;
}
var va = { exports: {} }, pl, Xc;
function mb() {
  return Xc || (Xc = 1, pl = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), pl;
}
var ml, Qc;
function gb() {
  if (Qc) return ml;
  Qc = 1;
  const e = ls, t = Ad, r = mb(), { env: n } = process;
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
  return ml = {
    supportsColor: u,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, ml;
}
var Kc;
function yb() {
  return Kc || (Kc = 1, function(e, t) {
    const r = Ad, n = su;
    t.init = f, t.log = u, t.formatArgs = a, t.save = c, t.load = g, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const m = gb();
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
    e.exports = Sh()(t);
    const { formatters: h } = e.exports;
    h.o = function(m) {
      return this.inspectOpts.colors = this.useColors, n.inspect(m, this.inspectOpts).split(`
`).map((b) => b.trim()).join(" ");
    }, h.O = function(m) {
      return this.inspectOpts.colors = this.useColors, n.inspect(m, this.inspectOpts);
    };
  }(va, va.exports)), va.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Gl.exports = pb() : Gl.exports = yb();
var bb = Gl.exports, wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.ProgressCallbackTransform = void 0;
const _b = yo;
class wb extends _b.Transform {
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
wo.ProgressCallbackTransform = wb;
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.DigestTransform = Ke.HttpExecutor = Ke.HttpError = void 0;
Ke.createHttpError = Vl;
Ke.parseJson = Pb;
Ke.configureRequestOptionsFromUrl = Ch;
Ke.configureRequestUrl = _u;
Ke.safeGetHeader = ii;
Ke.configureRequestOptions = Xa;
Ke.safeStringifyJson = Qa;
const Eb = bo, Sb = bb, vb = jr, Cb = yo, vh = ci, Rb = Ur, Jc = di, Tb = wo, ki = (0, Sb.default)("electron-builder");
function Vl(e, t = null) {
  return new bu(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Qa(e.headers), t);
}
const Ab = /* @__PURE__ */ new Map([
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
class bu extends Error {
  constructor(t, r = `HTTP error: ${Ab.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ke.HttpError = bu;
function Pb(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Ya {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Rb.CancellationToken(), n) {
    Xa(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      ki(i);
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
    return ki.enabled && ki(`Request: ${Qa(t)}`), r.createPromise((a, s, u) => {
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
    if (ki.enabled && ki(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Qa(r)}`), t.statusCode === 404) {
      a(Vl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const g = (c = t.statusCode) !== null && c !== void 0 ? c : 0, f = g >= 300 && g < 400, h = ii(t, "location");
    if (f && h != null) {
      if (s > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Ya.prepareRedirectUrlOptions(h, r), n, u, s).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let m = "";
    t.on("error", a), t.on("data", (b) => m += b), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const b = ii(t, "content-type"), E = b != null && (Array.isArray(b) ? b.find((C) => C.includes("json")) != null : b.includes("json"));
          a(Vl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

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
      _u(t, u), Xa(u), this.doDownload(u, {
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
      const s = ii(a, "location");
      if (s != null) {
        n < this.maxRedirects ? this.doDownload(Ya.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? $b(r, a) : r.responseHandler(a, r.callback);
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
    const n = Ch(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new vh.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof bu && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ke.HttpExecutor = Ya;
function Ch(e, t) {
  const r = Xa(t);
  return _u(new vh.URL(e), r), r;
}
function _u(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Yl extends Cb.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Eb.createHash)(r);
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
Ke.DigestTransform = Yl;
function Ib(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function ii(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function $b(e, t) {
  if (!Ib(ii(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = ii(t, "content-length");
    s != null && r.push(new Tb.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Yl(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Yl(e.options.sha2, "sha256", "hex"));
  const i = (0, vb.createWriteStream)(e.destination);
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
function Xa(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Qa(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
ps.MemoLazy = void 0;
class Ob {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Rh(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
ps.MemoLazy = Ob;
function Rh(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => Rh(e[s], t[s]));
  }
  return e === t;
}
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
ms.githubUrl = Db;
ms.getS3LikeProviderBaseUrl = Nb;
function Db(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Nb(e) {
  const t = e.provider;
  if (t === "s3")
    return Fb(e);
  if (t === "spaces")
    return kb(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Fb(e) {
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
  return Th(t, e.path);
}
function Th(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function kb(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Th(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var wu = {};
Object.defineProperty(wu, "__esModule", { value: !0 });
wu.retry = Ah;
const Lb = Ur;
async function Ah(e, t, r, n = 0, i = 0, a) {
  var s;
  const u = new Lb.CancellationToken();
  try {
    return await e();
  } catch (c) {
    if ((!((s = a == null ? void 0 : a(c)) !== null && s !== void 0) || s) && t > 0 && !u.cancelled)
      return await new Promise((g) => setTimeout(g, r + n * i)), await Ah(e, t - 1, r, n, i + 1, a);
    throw c;
  }
}
var Eu = {};
Object.defineProperty(Eu, "__esModule", { value: !0 });
Eu.parseDn = xb;
function xb(e) {
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
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.nil = li.UUID = void 0;
const Ph = bo, Ih = di, Ub = "options.name must be either a string or a Buffer", Zc = (0, Ph.randomBytes)(16);
Zc[0] = Zc[0] | 1;
const Ba = {}, ce = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Ba[t] = e, ce[e] = t;
}
class mn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = mn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return Bb(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Mb(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Ba[t[14] + t[15]] & 240) >> 4,
        variant: ef((Ba[t[19] + t[20]] & 224) >> 5),
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
    throw (0, Ih.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Ba[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
li.UUID = mn;
mn.OID = mn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
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
var Vi;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Vi || (Vi = {}));
function Bb(e, t, r, n, i = Vi.ASCII) {
  const a = (0, Ph.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Ih.newError)(Ub, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const u = a.digest();
  let c;
  switch (i) {
    case Vi.BINARY:
      u[6] = u[6] & 15 | r, u[8] = u[8] & 63 | 128, c = u;
      break;
    case Vi.OBJECT:
      u[6] = u[6] & 15 | r, u[8] = u[8] & 63 | 128, c = new mn(u);
      break;
    default:
      c = ce[u[0]] + ce[u[1]] + ce[u[2]] + ce[u[3]] + "-" + ce[u[4]] + ce[u[5]] + "-" + ce[u[6] & 15 | r] + ce[u[7]] + "-" + ce[u[8] & 63 | 128] + ce[u[9]] + "-" + ce[u[10]] + ce[u[11]] + ce[u[12]] + ce[u[13]] + ce[u[14]] + ce[u[15]];
      break;
  }
  return c;
}
function Mb(e) {
  return ce[e[0]] + ce[e[1]] + ce[e[2]] + ce[e[3]] + "-" + ce[e[4]] + ce[e[5]] + "-" + ce[e[6]] + ce[e[7]] + "-" + ce[e[8]] + ce[e[9]] + "-" + ce[e[10]] + ce[e[11]] + ce[e[12]] + ce[e[13]] + ce[e[14]] + ce[e[15]];
}
li.nil = new mn("00000000-0000-0000-0000-000000000000");
var Eo = {}, $h = {};
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
      for (var p = Math.max(t.MAX_BUFFER_LENGTH, 10), F = 0, T = 0, le = r.length; T < le; T++) {
        var me = y[r[T]].length;
        if (me > p)
          switch (r[T]) {
            case "textNode":
              fe(y);
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
        F = Math.max(F, me);
      }
      var we = t.MAX_BUFFER_LENGTH - F;
      y.bufferCheckPosition = we + y.position;
    }
    function a(y) {
      for (var p = 0, F = r.length; p < F; p++)
        y[r[p]] = "";
    }
    function s(y) {
      fe(y), y.cdata !== "" && (X(y, "oncdata", y.cdata), y.cdata = ""), y.script !== "" && (X(y, "onscript", y.script), y.script = "");
    }
    n.prototype = {
      end: function() {
        B(this);
      },
      write: Re,
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
          set: function(le) {
            if (!le)
              return F.removeAllListeners(T), F._parser["on" + T] = le, le;
            F.on(T, le);
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
          var p = Zm.StringDecoder;
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
    function se(y) {
      return y === ">" || x(y);
    }
    function Q(y, p) {
      return y.test(p);
    }
    function Fe(y, p) {
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
      y.textNode && fe(y), Z(y, p, F);
    }
    function fe(y) {
      y.textNode = L(y.opt, y.textNode), y.textNode && Z(y, "ontext", y.textNode), y.textNode = "";
    }
    function L(y, p) {
      return y.trim && (p = p.trim()), y.normalize && (p = p.replace(/\s+/g, " ")), p;
    }
    function D(y, p) {
      return fe(y), y.trackPosition && (p += `
Line: ` + y.line + `
Column: ` + y.column + `
Char: ` + y.c), p = new Error(p), y.error = p, Z(y, "onerror", p), y;
    }
    function B(y) {
      return y.sawRoot && !y.closedRoot && N(y, "Unclosed root tag"), y.state !== S.BEGIN && y.state !== S.BEGIN_WHITESPACE && y.state !== S.TEXT && D(y, "Unexpected end"), fe(y), y.c = "", y.closed = !0, Z(y, "onend"), n.call(y, y.strict, y.opt), y;
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
      var F = y.indexOf(":"), T = F < 0 ? ["", y] : y.split(":"), le = T[0], me = T[1];
      return p && y === "xmlns" && (le = "xmlns", me = ""), { prefix: le, local: me };
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
            var le = y.tag, me = y.tags[y.tags.length - 1] || y;
            le.ns === me.ns && (le.ns = Object.create(me.ns)), le.ns[T] = y.attribValue;
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
        var le = y.tags[y.tags.length - 1] || y;
        F.ns && le.ns !== F.ns && Object.keys(F.ns).forEach(function(dt) {
          X(y, "onopennamespace", {
            prefix: dt,
            uri: F.ns[dt]
          });
        });
        for (var me = 0, we = y.attribList.length; me < we; me++) {
          var De = y.attribList[me], Ae = De[0], yt = De[1], be = U(Ae, !0), it = be.prefix, zr = be.local, Qt = it === "" ? "" : F.ns[it] || "", mr = {
            name: Ae,
            value: yt,
            prefix: it,
            local: zr,
            uri: Qt
          };
          it && it !== "xmlns" && !Qt && (N(y, "Unbound namespace prefix: " + JSON.stringify(it)), mr.uri = it), y.tag.attributes[Ae] = mr, X(y, "onattribute", mr);
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
        var le = y.tags[p];
        if (le.name !== T)
          N(y, "Unexpected close tag");
        else
          break;
      }
      if (p < 0) {
        N(y, "Unmatched closing tag: " + y.tagName), y.textNode += "</" + y.tagName + ">", y.state = S.TEXT;
        return;
      }
      y.tagName = F;
      for (var me = y.tags.length; me-- > p; ) {
        var we = y.tag = y.tags.pop();
        y.tagName = y.tag.name, X(y, "onclosetag", y.tagName);
        var De = {};
        for (var Ae in we.ns)
          De[Ae] = we.ns[Ae];
        var yt = y.tags[y.tags.length - 1] || y;
        y.opt.xmlns && we.ns !== yt.ns && Object.keys(we.ns).forEach(function(be) {
          var it = we.ns[be];
          X(y, "onclosenamespace", { prefix: be, uri: it });
        });
      }
      p === 0 && (y.closedRoot = !0), y.tagName = y.attribValue = y.attribName = "", y.attribList.length = 0, y.state = S.TEXT;
    }
    function de(y) {
      var p = y.entity, F = p.toLowerCase(), T, le = "";
      return y.ENTITIES[p] ? y.ENTITIES[p] : y.ENTITIES[F] ? y.ENTITIES[F] : (p = F, p.charAt(0) === "#" && (p.charAt(1) === "x" ? (p = p.slice(2), T = parseInt(p, 16), le = T.toString(16)) : (p = p.slice(1), T = parseInt(p, 10), le = T.toString(10))), p = p.replace(/^0+/, ""), isNaN(T) || le.toLowerCase() !== p ? (N(y, "Invalid character entity"), "&" + y.entity + ";") : String.fromCodePoint(T));
    }
    function Te(y, p) {
      p === "<" ? (y.state = S.OPEN_WAKA, y.startTagPosition = y.position) : x(p) || (N(y, "Non-whitespace before first tag."), y.textNode = p, y.state = S.TEXT);
    }
    function Y(y, p) {
      var F = "";
      return p < y.length && (F = y.charAt(p)), F;
    }
    function Re(y) {
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
              for (var le = F - 1; T && T !== "<" && T !== "&"; )
                T = Y(y, F++), T && p.trackPosition && (p.position++, T === `
` ? (p.line++, p.column = 0) : p.column++);
              p.textNode += y.substring(le, F - 1);
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
                var me = p.position - p.startTagPosition;
                T = new Array(me).join(" ") + T;
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
            if (!se(T)) {
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
              Fe(A, T) ? p.script ? (p.script += "</" + T, p.state = S.SCRIPT) : N(p, "Invalid tagname in closing tag.") : p.tagName = T;
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
            var we, De;
            switch (p.state) {
              case S.TEXT_ENTITY:
                we = S.TEXT, De = "textNode";
                break;
              case S.ATTRIB_VALUE_ENTITY_Q:
                we = S.ATTRIB_VALUE_QUOTED, De = "attribValue";
                break;
              case S.ATTRIB_VALUE_ENTITY_U:
                we = S.ATTRIB_VALUE_UNQUOTED, De = "attribValue";
                break;
            }
            if (T === ";") {
              var Ae = de(p);
              p.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ae) ? (p.entity = "", p.state = we, p.write(Ae)) : (p[De] += Ae, p.entity = "", p.state = we);
            } else Q(p.entity.length ? M : $, T) ? p.entity += T : (N(p, "Invalid character in entity name"), p[De] += "&" + p.entity + T, p.entity = "", p.state = we);
            continue;
          default:
            throw new Error(p, "Unknown state: " + p.state);
        }
      return p.position >= p.bufferCheckPosition && i(p), p;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var y = String.fromCharCode, p = Math.floor, F = function() {
        var T = 16384, le = [], me, we, De = -1, Ae = arguments.length;
        if (!Ae)
          return "";
        for (var yt = ""; ++De < Ae; ) {
          var be = Number(arguments[De]);
          if (!isFinite(be) || // `NaN`, `+Infinity`, or `-Infinity`
          be < 0 || // not a valid Unicode code point
          be > 1114111 || // not a valid Unicode code point
          p(be) !== be)
            throw RangeError("Invalid code point: " + be);
          be <= 65535 ? le.push(be) : (be -= 65536, me = (be >> 10) + 55296, we = be % 1024 + 56320, le.push(me, we)), (De + 1 === Ae || le.length > T) && (yt += y.apply(null, le), le.length = 0);
        }
        return yt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: F,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = F;
    }();
  })(e);
})($h);
Object.defineProperty(Eo, "__esModule", { value: !0 });
Eo.XElement = void 0;
Eo.parseXml = Hb;
const qb = $h, Ca = di;
class Oh {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Ca.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Wb(t))
      throw (0, Ca.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Ca.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Ca.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
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
Eo.XElement = Oh;
const jb = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Wb(e) {
  return jb.test(e);
}
function tf(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Hb(e) {
  let t = null;
  const r = qb.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Oh(i.name);
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
  var t = Ur;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = di;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Ke;
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
  var i = ps;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = wo;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = ms;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var u = wu;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return u.retry;
  } });
  var c = Eu;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var g = li;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return g.UUID;
  } });
  var f = Eo;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return f.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return f.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function h(m) {
    return m == null ? [] : Array.isArray(m) ? m : [m];
  }
})(Me);
var We = {}, Su = {}, Ot = {};
function Dh(e) {
  return typeof e > "u" || e === null;
}
function zb(e) {
  return typeof e == "object" && e !== null;
}
function Gb(e) {
  return Array.isArray(e) ? e : Dh(e) ? [] : [e];
}
function Vb(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function Yb(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Xb(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ot.isNothing = Dh;
Ot.isObject = zb;
Ot.toArray = Gb;
Ot.repeat = Yb;
Ot.isNegativeZero = Xb;
Ot.extend = Vb;
function Nh(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function no(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Nh(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
no.prototype = Object.create(Error.prototype);
no.prototype.constructor = no;
no.prototype.toString = function(t) {
  return this.name + ": " + Nh(this, t);
};
var So = no, ji = Ot;
function gl(e, t, r, n, i) {
  var a = "", s = "", u = Math.floor(i / 2) - 1;
  return n - t > u && (a = " ... ", t = n - u + a.length), r - n > u && (s = " ...", r = n + u - s.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + a.length
    // relative position
  };
}
function yl(e, t) {
  return ji.repeat(" ", t - e.length) + e;
}
function Qb(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var u = "", c, g, f = Math.min(e.line + t.linesAfter, i.length).toString().length, h = t.maxLength - (t.indent + f + 3);
  for (c = 1; c <= t.linesBefore && !(s - c < 0); c++)
    g = gl(
      e.buffer,
      n[s - c],
      i[s - c],
      e.position - (n[s] - n[s - c]),
      h
    ), u = ji.repeat(" ", t.indent) + yl((e.line - c + 1).toString(), f) + " | " + g.str + `
` + u;
  for (g = gl(e.buffer, n[s], i[s], e.position, h), u += ji.repeat(" ", t.indent) + yl((e.line + 1).toString(), f) + " | " + g.str + `
`, u += ji.repeat("-", t.indent + f + 3 + g.pos) + `^
`, c = 1; c <= t.linesAfter && !(s + c >= i.length); c++)
    g = gl(
      e.buffer,
      n[s + c],
      i[s + c],
      e.position - (n[s] - n[s + c]),
      h
    ), u += ji.repeat(" ", t.indent) + yl((e.line + c + 1).toString(), f) + " | " + g.str + `
`;
  return u.replace(/\n$/, "");
}
var Kb = Qb, rf = So, Jb = [
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
], Zb = [
  "scalar",
  "sequence",
  "mapping"
];
function e_(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function t_(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Jb.indexOf(r) === -1)
      throw new rf('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = e_(t.styleAliases || null), Zb.indexOf(this.kind) === -1)
    throw new rf('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var rt = t_, Li = So, bl = rt;
function nf(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function r_() {
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
function Xl(e) {
  return this.extend(e);
}
Xl.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof bl)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Li("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof bl))
      throw new Li("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new Li("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new Li("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof bl))
      throw new Li("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Xl.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = nf(i, "implicit"), i.compiledExplicit = nf(i, "explicit"), i.compiledTypeMap = r_(i.compiledImplicit, i.compiledExplicit), i;
};
var Fh = Xl, n_ = rt, kh = new n_("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), i_ = rt, Lh = new i_("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), o_ = rt, xh = new o_("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), a_ = Fh, Uh = new a_({
  explicit: [
    kh,
    Lh,
    xh
  ]
}), s_ = rt;
function l_(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function u_() {
  return null;
}
function c_(e) {
  return e === null;
}
var Bh = new s_("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: l_,
  construct: u_,
  predicate: c_,
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
}), f_ = rt;
function d_(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function h_(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function p_(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Mh = new f_("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: d_,
  construct: h_,
  predicate: p_,
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
}), m_ = Ot, g_ = rt;
function y_(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function b_(e) {
  return 48 <= e && e <= 55;
}
function __(e) {
  return 48 <= e && e <= 57;
}
function w_(e) {
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
          if (!y_(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!b_(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!__(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function E_(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function S_(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !m_.isNegativeZero(e);
}
var qh = new g_("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: w_,
  construct: E_,
  predicate: S_,
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
}), jh = Ot, v_ = rt, C_ = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function R_(e) {
  return !(e === null || !C_.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function T_(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var A_ = /^[-+]?[0-9]+e/;
function P_(e, t) {
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
  else if (jh.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), A_.test(r) ? r.replace("e", ".e") : r;
}
function I_(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || jh.isNegativeZero(e));
}
var Wh = new v_("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: R_,
  construct: T_,
  predicate: I_,
  represent: P_,
  defaultStyle: "lowercase"
}), Hh = Uh.extend({
  implicit: [
    Bh,
    Mh,
    qh,
    Wh
  ]
}), zh = Hh, $_ = rt, Gh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Vh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function O_(e) {
  return e === null ? !1 : Gh.exec(e) !== null || Vh.exec(e) !== null;
}
function D_(e) {
  var t, r, n, i, a, s, u, c = 0, g = null, f, h, m;
  if (t = Gh.exec(e), t === null && (t = Vh.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], u = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (f = +t[10], h = +(t[11] || 0), g = (f * 60 + h) * 6e4, t[9] === "-" && (g = -g)), m = new Date(Date.UTC(r, n, i, a, s, u, c)), g && m.setTime(m.getTime() - g), m;
}
function N_(e) {
  return e.toISOString();
}
var Yh = new $_("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: O_,
  construct: D_,
  instanceOf: Date,
  represent: N_
}), F_ = rt;
function k_(e) {
  return e === "<<" || e === null;
}
var Xh = new F_("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: k_
}), L_ = rt, vu = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function x_(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = vu;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function U_(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = vu, s = 0, u = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (u.push(s >> 16 & 255), u.push(s >> 8 & 255), u.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (u.push(s >> 16 & 255), u.push(s >> 8 & 255), u.push(s & 255)) : r === 18 ? (u.push(s >> 10 & 255), u.push(s >> 2 & 255)) : r === 12 && u.push(s >> 4 & 255), new Uint8Array(u);
}
function B_(e) {
  var t = "", r = 0, n, i, a = e.length, s = vu;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function M_(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Qh = new L_("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: x_,
  construct: U_,
  predicate: M_,
  represent: B_
}), q_ = rt, j_ = Object.prototype.hasOwnProperty, W_ = Object.prototype.toString;
function H_(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, u = e;
  for (r = 0, n = u.length; r < n; r += 1) {
    if (i = u[r], s = !1, W_.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (j_.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function z_(e) {
  return e !== null ? e : [];
}
var Kh = new q_("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: H_,
  construct: z_
}), G_ = rt, V_ = Object.prototype.toString;
function Y_(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], V_.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function X_(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Jh = new G_("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: Y_,
  construct: X_
}), Q_ = rt, K_ = Object.prototype.hasOwnProperty;
function J_(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (K_.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Z_(e) {
  return e !== null ? e : {};
}
var Zh = new Q_("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: J_,
  construct: Z_
}), Cu = zh.extend({
  implicit: [
    Yh,
    Xh
  ],
  explicit: [
    Qh,
    Kh,
    Jh,
    Zh
  ]
}), un = Ot, ep = So, ew = Kb, tw = Cu, Br = Object.prototype.hasOwnProperty, Ka = 1, tp = 2, rp = 3, Ja = 4, _l = 1, rw = 2, of = 3, nw = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, iw = /[\x85\u2028\u2029]/, ow = /[,\[\]\{\}]/, np = /^(?:!|!!|![a-z\-]+!)$/i, ip = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function af(e) {
  return Object.prototype.toString.call(e);
}
function Yt(e) {
  return e === 10 || e === 13;
}
function dn(e) {
  return e === 9 || e === 32;
}
function ft(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Jn(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function aw(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function sw(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function lw(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function sf(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function uw(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var op = new Array(256), ap = new Array(256);
for (var Hn = 0; Hn < 256; Hn++)
  op[Hn] = sf(Hn) ? 1 : 0, ap[Hn] = sf(Hn);
function cw(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || tw, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function sp(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = ew(r), new ep(t, r);
}
function H(e, t) {
  throw sp(e, t);
}
function Za(e, t) {
  e.onWarning && e.onWarning.call(null, sp(e, t));
}
var lf = {
  YAML: function(t, r, n) {
    var i, a, s;
    t.version !== null && H(t, "duplication of %YAML directive"), n.length !== 1 && H(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && H(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), s = parseInt(i[2], 10), a !== 1 && H(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Za(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && H(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], np.test(i) || H(t, "ill-formed tag handle (first argument) of the TAG directive"), Br.call(t.tagMap, i) && H(t, 'there is a previously declared suffix for "' + i + '" tag handle'), ip.test(a) || H(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      a = decodeURIComponent(a);
    } catch {
      H(t, "tag prefix is malformed: " + a);
    }
    t.tagMap[i] = a;
  }
};
function kr(e, t, r, n) {
  var i, a, s, u;
  if (t < r) {
    if (u = e.input.slice(t, r), n)
      for (i = 0, a = u.length; i < a; i += 1)
        s = u.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || H(e, "expected valid JSON character");
    else nw.test(u) && H(e, "the stream contains non-printable characters");
    e.result += u;
  }
}
function uf(e, t, r, n) {
  var i, a, s, u;
  for (un.isObject(r) || H(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, u = i.length; s < u; s += 1)
    a = i[s], Br.call(t, a) || (t[a] = r[a], n[a] = !0);
}
function Zn(e, t, r, n, i, a, s, u, c) {
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
    !e.json && !Br.call(r, i) && Br.call(t, i) && (e.line = s || e.line, e.lineStart = u || e.lineStart, e.position = c || e.position, H(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: a
    }) : t[i] = a, delete r[i];
  return t;
}
function Ru(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : H(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Oe(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; dn(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Yt(i))
      for (Ru(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Za(e, "deficient indentation"), n;
}
function gs(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || ft(r)));
}
function Tu(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += un.repeat(`
`, t - 1));
}
function fw(e, t, r) {
  var n, i, a, s, u, c, g, f, h = e.kind, m = e.result, b;
  if (b = e.input.charCodeAt(e.position), ft(b) || Jn(b) || b === 35 || b === 38 || b === 42 || b === 33 || b === 124 || b === 62 || b === 39 || b === 34 || b === 37 || b === 64 || b === 96 || (b === 63 || b === 45) && (i = e.input.charCodeAt(e.position + 1), ft(i) || r && Jn(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, u = !1; b !== 0; ) {
    if (b === 58) {
      if (i = e.input.charCodeAt(e.position + 1), ft(i) || r && Jn(i))
        break;
    } else if (b === 35) {
      if (n = e.input.charCodeAt(e.position - 1), ft(n))
        break;
    } else {
      if (e.position === e.lineStart && gs(e) || r && Jn(b))
        break;
      if (Yt(b))
        if (c = e.line, g = e.lineStart, f = e.lineIndent, Oe(e, !1, -1), e.lineIndent >= t) {
          u = !0, b = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = c, e.lineStart = g, e.lineIndent = f;
          break;
        }
    }
    u && (kr(e, a, s, !1), Tu(e, e.line - c), a = s = e.position, u = !1), dn(b) || (s = e.position + 1), b = e.input.charCodeAt(++e.position);
  }
  return kr(e, a, s, !1), e.result ? !0 : (e.kind = h, e.result = m, !1);
}
function dw(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (kr(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Yt(r) ? (kr(e, n, i, !0), Tu(e, Oe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && gs(e) ? H(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  H(e, "unexpected end of the stream within a single quoted scalar");
}
function hw(e, t) {
  var r, n, i, a, s, u;
  if (u = e.input.charCodeAt(e.position), u !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (u = e.input.charCodeAt(e.position)) !== 0; ) {
    if (u === 34)
      return kr(e, r, e.position, !0), e.position++, !0;
    if (u === 92) {
      if (kr(e, r, e.position, !0), u = e.input.charCodeAt(++e.position), Yt(u))
        Oe(e, !1, t);
      else if (u < 256 && op[u])
        e.result += ap[u], e.position++;
      else if ((s = sw(u)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          u = e.input.charCodeAt(++e.position), (s = aw(u)) >= 0 ? a = (a << 4) + s : H(e, "expected hexadecimal character");
        e.result += uw(a), e.position++;
      } else
        H(e, "unknown escape sequence");
      r = n = e.position;
    } else Yt(u) ? (kr(e, r, n, !0), Tu(e, Oe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && gs(e) ? H(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  H(e, "unexpected end of the stream within a double quoted scalar");
}
function pw(e, t) {
  var r = !0, n, i, a, s = e.tag, u, c = e.anchor, g, f, h, m, b, E = /* @__PURE__ */ Object.create(null), C, A, I, $;
  if ($ = e.input.charCodeAt(e.position), $ === 91)
    f = 93, b = !1, u = [];
  else if ($ === 123)
    f = 125, b = !0, u = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), $ = e.input.charCodeAt(++e.position); $ !== 0; ) {
    if (Oe(e, !0, t), $ = e.input.charCodeAt(e.position), $ === f)
      return e.position++, e.tag = s, e.anchor = c, e.kind = b ? "mapping" : "sequence", e.result = u, !0;
    r ? $ === 44 && H(e, "expected the node content, but found ','") : H(e, "missed comma between flow collection entries"), A = C = I = null, h = m = !1, $ === 63 && (g = e.input.charCodeAt(e.position + 1), ft(g) && (h = m = !0, e.position++, Oe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, ui(e, t, Ka, !1, !0), A = e.tag, C = e.result, Oe(e, !0, t), $ = e.input.charCodeAt(e.position), (m || e.line === n) && $ === 58 && (h = !0, $ = e.input.charCodeAt(++e.position), Oe(e, !0, t), ui(e, t, Ka, !1, !0), I = e.result), b ? Zn(e, u, E, A, C, I, n, i, a) : h ? u.push(Zn(e, null, E, A, C, I, n, i, a)) : u.push(C), Oe(e, !0, t), $ = e.input.charCodeAt(e.position), $ === 44 ? (r = !0, $ = e.input.charCodeAt(++e.position)) : r = !1;
  }
  H(e, "unexpected end of the stream within a flow collection");
}
function mw(e, t) {
  var r, n, i = _l, a = !1, s = !1, u = t, c = 0, g = !1, f, h;
  if (h = e.input.charCodeAt(e.position), h === 124)
    n = !1;
  else if (h === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; h !== 0; )
    if (h = e.input.charCodeAt(++e.position), h === 43 || h === 45)
      _l === i ? i = h === 43 ? of : rw : H(e, "repeat of a chomping mode identifier");
    else if ((f = lw(h)) >= 0)
      f === 0 ? H(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? H(e, "repeat of an indentation width identifier") : (u = t + f - 1, s = !0);
    else
      break;
  if (dn(h)) {
    do
      h = e.input.charCodeAt(++e.position);
    while (dn(h));
    if (h === 35)
      do
        h = e.input.charCodeAt(++e.position);
      while (!Yt(h) && h !== 0);
  }
  for (; h !== 0; ) {
    for (Ru(e), e.lineIndent = 0, h = e.input.charCodeAt(e.position); (!s || e.lineIndent < u) && h === 32; )
      e.lineIndent++, h = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > u && (u = e.lineIndent), Yt(h)) {
      c++;
      continue;
    }
    if (e.lineIndent < u) {
      i === of ? e.result += un.repeat(`
`, a ? 1 + c : c) : i === _l && a && (e.result += `
`);
      break;
    }
    for (n ? dn(h) ? (g = !0, e.result += un.repeat(`
`, a ? 1 + c : c)) : g ? (g = !1, e.result += un.repeat(`
`, c + 1)) : c === 0 ? a && (e.result += " ") : e.result += un.repeat(`
`, c) : e.result += un.repeat(`
`, a ? 1 + c : c), a = !0, s = !0, c = 0, r = e.position; !Yt(h) && h !== 0; )
      h = e.input.charCodeAt(++e.position);
    kr(e, r, e.position, !1);
  }
  return !0;
}
function cf(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, u = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), !(c !== 45 || (s = e.input.charCodeAt(e.position + 1), !ft(s)))); ) {
    if (u = !0, e.position++, Oe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, ui(e, t, rp, !1, !0), a.push(e.result), Oe(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      H(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return u ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function gw(e, t, r) {
  var n, i, a, s, u, c, g = e.tag, f = e.anchor, h = {}, m = /* @__PURE__ */ Object.create(null), b = null, E = null, C = null, A = !1, I = !1, $;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = h), $ = e.input.charCodeAt(e.position); $ !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, ($ === 63 || $ === 58) && ft(n))
      $ === 63 ? (A && (Zn(e, h, m, b, E, null, s, u, c), b = E = C = null), I = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : H(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, $ = n;
    else {
      if (s = e.line, u = e.lineStart, c = e.position, !ui(e, r, tp, !1, !0))
        break;
      if (e.line === a) {
        for ($ = e.input.charCodeAt(e.position); dn($); )
          $ = e.input.charCodeAt(++e.position);
        if ($ === 58)
          $ = e.input.charCodeAt(++e.position), ft($) || H(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (Zn(e, h, m, b, E, null, s, u, c), b = E = C = null), I = !0, A = !1, i = !1, b = e.tag, E = e.result;
        else if (I)
          H(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = g, e.anchor = f, !0;
      } else if (I)
        H(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = g, e.anchor = f, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (A && (s = e.line, u = e.lineStart, c = e.position), ui(e, t, Ja, !0, i) && (A ? E = e.result : C = e.result), A || (Zn(e, h, m, b, E, C, s, u, c), b = E = C = null), Oe(e, !0, -1), $ = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && $ !== 0)
      H(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && Zn(e, h, m, b, E, null, s, u, c), I && (e.tag = g, e.anchor = f, e.kind = "mapping", e.result = h), I;
}
function yw(e) {
  var t, r = !1, n = !1, i, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && H(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : H(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !ft(s); )
      s === 33 && (n ? H(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), np.test(i) || H(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), ow.test(a) && H(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !ip.test(a) && H(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    H(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : Br.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : H(e, 'undeclared tag handle "' + i + '"'), !0;
}
function bw(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && H(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !ft(r) && !Jn(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && H(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function _w(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !ft(n) && !Jn(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && H(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Br.call(e.anchorMap, r) || H(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Oe(e, !0, -1), !0;
}
function ui(e, t, r, n, i) {
  var a, s, u, c = 1, g = !1, f = !1, h, m, b, E, C, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = u = Ja === r || rp === r, n && Oe(e, !0, -1) && (g = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; yw(e) || bw(e); )
      Oe(e, !0, -1) ? (g = !0, u = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : u = !1;
  if (u && (u = g || i), (c === 1 || Ja === r) && (Ka === r || tp === r ? C = t : C = t + 1, A = e.position - e.lineStart, c === 1 ? u && (cf(e, A) || gw(e, A, C)) || pw(e, C) ? f = !0 : (s && mw(e, C) || dw(e, C) || hw(e, C) ? f = !0 : _w(e) ? (f = !0, (e.tag !== null || e.anchor !== null) && H(e, "alias node should not have any properties")) : fw(e, C, Ka === r) && (f = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (f = u && cf(e, A))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && H(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), h = 0, m = e.implicitTypes.length; h < m; h += 1)
      if (E = e.implicitTypes[h], E.resolve(e.result)) {
        e.result = E.construct(e.result), e.tag = E.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Br.call(e.typeMap[e.kind || "fallback"], e.tag))
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
function ww(e) {
  var t = e.position, r, n, i, a = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (Oe(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (a = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !ft(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && H(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; dn(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !Yt(s));
        break;
      }
      if (Yt(s)) break;
      for (r = e.position; s !== 0 && !ft(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    s !== 0 && Ru(e), Br.call(lf, n) ? lf[n](e, n, i) : Za(e, 'unknown document directive "' + n + '"');
  }
  if (Oe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Oe(e, !0, -1)) : a && H(e, "directives end mark is expected"), ui(e, e.lineIndent - 1, Ja, !1, !0), Oe(e, !0, -1), e.checkLineBreaks && iw.test(e.input.slice(t, e.position)) && Za(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && gs(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Oe(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    H(e, "end of the stream or a document separator is expected");
  else
    return;
}
function lp(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new cw(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, H(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    ww(r);
  return r.documents;
}
function Ew(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = lp(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function Sw(e, t) {
  var r = lp(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new ep("expected a single document in the stream, but found more");
  }
}
Su.loadAll = Ew;
Su.load = Sw;
var up = {}, ys = Ot, vo = So, vw = Cu, cp = Object.prototype.toString, fp = Object.prototype.hasOwnProperty, Au = 65279, Cw = 9, io = 10, Rw = 13, Tw = 32, Aw = 33, Pw = 34, Ql = 35, Iw = 37, $w = 38, Ow = 39, Dw = 42, dp = 44, Nw = 45, es = 58, Fw = 61, kw = 62, Lw = 63, xw = 64, hp = 91, pp = 93, Uw = 96, mp = 123, Bw = 124, gp = 125, Ve = {};
Ve[0] = "\\0";
Ve[7] = "\\a";
Ve[8] = "\\b";
Ve[9] = "\\t";
Ve[10] = "\\n";
Ve[11] = "\\v";
Ve[12] = "\\f";
Ve[13] = "\\r";
Ve[27] = "\\e";
Ve[34] = '\\"';
Ve[92] = "\\\\";
Ve[133] = "\\N";
Ve[160] = "\\_";
Ve[8232] = "\\L";
Ve[8233] = "\\P";
var Mw = [
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
], qw = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function jw(e, t) {
  var r, n, i, a, s, u, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], u = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), c = e.compiledTypeMap.fallback[s], c && fp.call(c.styleAliases, u) && (u = c.styleAliases[u]), r[s] = u;
  return r;
}
function Ww(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new vo("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ys.repeat("0", n - t.length) + t;
}
var Hw = 1, oo = 2;
function zw(e) {
  this.schema = e.schema || vw, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ys.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = jw(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? oo : Hw, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function ff(e, t) {
  for (var r = ys.repeat(" ", t), n = 0, i = -1, a = "", s, u = e.length; n < u; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = u) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (a += r), a += s;
  return a;
}
function Kl(e, t) {
  return `
` + ys.repeat(" ", e.indent * t);
}
function Gw(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function ts(e) {
  return e === Tw || e === Cw;
}
function ao(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Au || 65536 <= e && e <= 1114111;
}
function df(e) {
  return ao(e) && e !== Au && e !== Rw && e !== io;
}
function hf(e, t, r) {
  var n = df(e), i = n && !ts(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== dp && e !== hp && e !== pp && e !== mp && e !== gp) && e !== Ql && !(t === es && !i) || df(t) && !ts(t) && e === Ql || t === es && i
  );
}
function Vw(e) {
  return ao(e) && e !== Au && !ts(e) && e !== Nw && e !== Lw && e !== es && e !== dp && e !== hp && e !== pp && e !== mp && e !== gp && e !== Ql && e !== $w && e !== Dw && e !== Aw && e !== Bw && e !== Fw && e !== kw && e !== Ow && e !== Pw && e !== Iw && e !== xw && e !== Uw;
}
function Yw(e) {
  return !ts(e) && e !== es;
}
function Wi(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function yp(e) {
  var t = /^\n* /;
  return t.test(e);
}
var bp = 1, Jl = 2, _p = 3, wp = 4, Qn = 5;
function Xw(e, t, r, n, i, a, s, u) {
  var c, g = 0, f = null, h = !1, m = !1, b = n !== -1, E = -1, C = Vw(Wi(e, 0)) && Yw(Wi(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; g >= 65536 ? c += 2 : c++) {
      if (g = Wi(e, c), !ao(g))
        return Qn;
      C = C && hf(g, f, u), f = g;
    }
  else {
    for (c = 0; c < e.length; g >= 65536 ? c += 2 : c++) {
      if (g = Wi(e, c), g === io)
        h = !0, b && (m = m || // Foldable line = too long, and not more-indented.
        c - E - 1 > n && e[E + 1] !== " ", E = c);
      else if (!ao(g))
        return Qn;
      C = C && hf(g, f, u), f = g;
    }
    m = m || b && c - E - 1 > n && e[E + 1] !== " ";
  }
  return !h && !m ? C && !s && !i(e) ? bp : a === oo ? Qn : Jl : r > 9 && yp(e) ? Qn : s ? a === oo ? Qn : Jl : m ? wp : _p;
}
function Qw(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === oo ? '""' : "''";
    if (!e.noCompatMode && (Mw.indexOf(t) !== -1 || qw.test(t)))
      return e.quotingType === oo ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), u = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(g) {
      return Gw(e, g);
    }
    switch (Xw(
      t,
      u,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case bp:
        return t;
      case Jl:
        return "'" + t.replace(/'/g, "''") + "'";
      case _p:
        return "|" + pf(t, e.indent) + mf(ff(t, a));
      case wp:
        return ">" + pf(t, e.indent) + mf(ff(Kw(t, s), a));
      case Qn:
        return '"' + Jw(t) + '"';
      default:
        throw new vo("impossible error: invalid scalar style");
    }
  }();
}
function pf(e, t) {
  var r = yp(e) ? String(t) : "", n = e[e.length - 1] === `
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
function Kw(e, t) {
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
function Jw(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Wi(e, i), n = Ve[r], !n && ao(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || Ww(r);
  return t;
}
function Zw(e, t, r) {
  var n = "", i = e.tag, a, s, u;
  for (a = 0, s = r.length; a < s; a += 1)
    u = r[a], e.replacer && (u = e.replacer.call(r, String(a), u)), (hr(e, t, u, !1, !1) || typeof u > "u" && hr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function yf(e, t, r, n) {
  var i = "", a = e.tag, s, u, c;
  for (s = 0, u = r.length; s < u; s += 1)
    c = r[s], e.replacer && (c = e.replacer.call(r, String(s), c)), (hr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && hr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Kl(e, t)), e.dump && io === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function eE(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, u, c, g, f;
  for (s = 0, u = a.length; s < u; s += 1)
    f = "", n !== "" && (f += ", "), e.condenseFlow && (f += '"'), c = a[s], g = r[c], e.replacer && (g = e.replacer.call(r, c, g)), hr(e, t, c, !1, !1) && (e.dump.length > 1024 && (f += "? "), f += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), hr(e, t, g, !1, !1) && (f += e.dump, n += f));
  e.tag = i, e.dump = "{" + n + "}";
}
function tE(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), u, c, g, f, h, m;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new vo("sortKeys must be a boolean or a function");
  for (u = 0, c = s.length; u < c; u += 1)
    m = "", (!n || i !== "") && (m += Kl(e, t)), g = s[u], f = r[g], e.replacer && (f = e.replacer.call(r, g, f)), hr(e, t + 1, g, !0, !0, !0) && (h = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, h && (e.dump && io === e.dump.charCodeAt(0) ? m += "?" : m += "? "), m += e.dump, h && (m += Kl(e, t)), hr(e, t + 1, f, !0, h) && (e.dump && io === e.dump.charCodeAt(0) ? m += ":" : m += ": ", m += e.dump, i += m));
  e.tag = a, e.dump = i || "{}";
}
function bf(e, t, r) {
  var n, i, a, s, u, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, s = i.length; a < s; a += 1)
    if (u = i[a], (u.instanceOf || u.predicate) && (!u.instanceOf || typeof t == "object" && t instanceof u.instanceOf) && (!u.predicate || u.predicate(t))) {
      if (r ? u.multi && u.representName ? e.tag = u.representName(t) : e.tag = u.tag : e.tag = "?", u.represent) {
        if (c = e.styleMap[u.tag] || u.defaultStyle, cp.call(u.represent) === "[object Function]")
          n = u.represent(t, c);
        else if (fp.call(u.represent, c))
          n = u.represent[c](t, c);
        else
          throw new vo("!<" + u.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function hr(e, t, r, n, i, a, s) {
  e.tag = null, e.dump = r, bf(e, r, !1) || bf(e, r, !0);
  var u = cp.call(e.dump), c = n, g;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var f = u === "[object Object]" || u === "[object Array]", h, m;
  if (f && (h = e.duplicates.indexOf(r), m = h !== -1), (e.tag !== null && e.tag !== "?" || m || e.indent !== 2 && t > 0) && (i = !1), m && e.usedDuplicates[h])
    e.dump = "*ref_" + h;
  else {
    if (f && m && !e.usedDuplicates[h] && (e.usedDuplicates[h] = !0), u === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (tE(e, t, e.dump, i), m && (e.dump = "&ref_" + h + e.dump)) : (eE(e, t, e.dump), m && (e.dump = "&ref_" + h + " " + e.dump));
    else if (u === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? yf(e, t - 1, e.dump, i) : yf(e, t, e.dump, i), m && (e.dump = "&ref_" + h + e.dump)) : (Zw(e, t, e.dump), m && (e.dump = "&ref_" + h + " " + e.dump));
    else if (u === "[object String]")
      e.tag !== "?" && Qw(e, e.dump, t, a, c);
    else {
      if (u === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new vo("unacceptable kind of an object to dump " + u);
    }
    e.tag !== null && e.tag !== "?" && (g = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? g = "!" + g : g.slice(0, 18) === "tag:yaml.org,2002:" ? g = "!!" + g.slice(18) : g = "!<" + g + ">", e.dump = g + " " + e.dump);
  }
  return !0;
}
function rE(e, t) {
  var r = [], n = [], i, a;
  for (Zl(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function Zl(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        Zl(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        Zl(e[n[i]], t, r);
}
function nE(e, t) {
  t = t || {};
  var r = new zw(t);
  r.noRefs || rE(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), hr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
up.dump = nE;
var Ep = Su, iE = up;
function Pu(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
We.Type = rt;
We.Schema = Fh;
We.FAILSAFE_SCHEMA = Uh;
We.JSON_SCHEMA = Hh;
We.CORE_SCHEMA = zh;
We.DEFAULT_SCHEMA = Cu;
We.load = Ep.load;
We.loadAll = Ep.loadAll;
We.dump = iE.dump;
We.YAMLException = So;
We.types = {
  binary: Qh,
  float: Wh,
  map: xh,
  null: Bh,
  pairs: Jh,
  set: Zh,
  timestamp: Yh,
  bool: Mh,
  int: qh,
  merge: Xh,
  omap: Kh,
  seq: Lh,
  str: kh
};
We.safeLoad = Pu("safeLoad", "load");
We.safeLoadAll = Pu("safeLoadAll", "loadAll");
We.safeDump = Pu("safeDump", "dump");
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
bs.Lazy = void 0;
class oE {
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
bs.Lazy = oE;
var eu = { exports: {} };
const aE = "2.0.0", Sp = 256, sE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, lE = 16, uE = Sp - 6, cE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var _s = {
  MAX_LENGTH: Sp,
  MAX_SAFE_COMPONENT_LENGTH: lE,
  MAX_SAFE_BUILD_LENGTH: uE,
  MAX_SAFE_INTEGER: sE,
  RELEASE_TYPES: cE,
  SEMVER_SPEC_VERSION: aE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const fE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ws = fE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = _s, a = ws;
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
})(eu, eu.exports);
var Co = eu.exports;
const dE = Object.freeze({ loose: !0 }), hE = Object.freeze({}), pE = (e) => e ? typeof e != "object" ? dE : e : hE;
var Iu = pE;
const _f = /^[0-9]+$/, vp = (e, t) => {
  const r = _f.test(e), n = _f.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, mE = (e, t) => vp(t, e);
var Cp = {
  compareIdentifiers: vp,
  rcompareIdentifiers: mE
};
const Ra = ws, { MAX_LENGTH: wf, MAX_SAFE_INTEGER: Ta } = _s, { safeRe: Aa, t: Pa } = Co, gE = Iu, { compareIdentifiers: zn } = Cp;
let yE = class zt {
  constructor(t, r) {
    if (r = gE(r), t instanceof zt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > wf)
      throw new TypeError(
        `version is longer than ${wf} characters`
      );
    Ra("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Aa[Pa.LOOSE] : Aa[Pa.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ta || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ta || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ta || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < Ta)
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
    if (Ra("SemVer.compare", this.version, this.options, t), !(t instanceof zt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new zt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof zt || (t = new zt(t, this.options)), zn(this.major, t.major) || zn(this.minor, t.minor) || zn(this.patch, t.patch);
  }
  comparePre(t) {
    if (t instanceof zt || (t = new zt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (Ra("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return zn(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof zt || (t = new zt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (Ra("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return zn(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Aa[Pa.PRERELEASELOOSE] : Aa[Pa.PRERELEASE]);
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
          n === !1 && (a = [r]), zn(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var nt = yE;
const Ef = nt, bE = (e, t, r = !1) => {
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
var hi = bE;
const _E = hi, wE = (e, t) => {
  const r = _E(e, t);
  return r ? r.version : null;
};
var EE = wE;
const SE = hi, vE = (e, t) => {
  const r = SE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var CE = vE;
const Sf = nt, RE = (e, t, r, n, i) => {
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
var TE = RE;
const vf = hi, AE = (e, t) => {
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
var PE = AE;
const IE = nt, $E = (e, t) => new IE(e, t).major;
var OE = $E;
const DE = nt, NE = (e, t) => new DE(e, t).minor;
var FE = NE;
const kE = nt, LE = (e, t) => new kE(e, t).patch;
var xE = LE;
const UE = hi, BE = (e, t) => {
  const r = UE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var ME = BE;
const Cf = nt, qE = (e, t, r) => new Cf(e, r).compare(new Cf(t, r));
var Dt = qE;
const jE = Dt, WE = (e, t, r) => jE(t, e, r);
var HE = WE;
const zE = Dt, GE = (e, t) => zE(e, t, !0);
var VE = GE;
const Rf = nt, YE = (e, t, r) => {
  const n = new Rf(e, r), i = new Rf(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var $u = YE;
const XE = $u, QE = (e, t) => e.sort((r, n) => XE(r, n, t));
var KE = QE;
const JE = $u, ZE = (e, t) => e.sort((r, n) => JE(n, r, t));
var eS = ZE;
const tS = Dt, rS = (e, t, r) => tS(e, t, r) > 0;
var Es = rS;
const nS = Dt, iS = (e, t, r) => nS(e, t, r) < 0;
var Ou = iS;
const oS = Dt, aS = (e, t, r) => oS(e, t, r) === 0;
var Rp = aS;
const sS = Dt, lS = (e, t, r) => sS(e, t, r) !== 0;
var Tp = lS;
const uS = Dt, cS = (e, t, r) => uS(e, t, r) >= 0;
var Du = cS;
const fS = Dt, dS = (e, t, r) => fS(e, t, r) <= 0;
var Nu = dS;
const hS = Rp, pS = Tp, mS = Es, gS = Du, yS = Ou, bS = Nu, _S = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return hS(e, r, n);
    case "!=":
      return pS(e, r, n);
    case ">":
      return mS(e, r, n);
    case ">=":
      return gS(e, r, n);
    case "<":
      return yS(e, r, n);
    case "<=":
      return bS(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Ap = _S;
const wS = nt, ES = hi, { safeRe: Ia, t: $a } = Co, SS = (e, t) => {
  if (e instanceof wS)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ia[$a.COERCEFULL] : Ia[$a.COERCE]);
  else {
    const c = t.includePrerelease ? Ia[$a.COERCERTLFULL] : Ia[$a.COERCERTL];
    let g;
    for (; (g = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || g.index + g[0].length !== r.index + r[0].length) && (r = g), c.lastIndex = g.index + g[1].length + g[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ES(`${n}.${i}.${a}${s}${u}`, t);
};
var vS = SS;
class CS {
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
var RS = CS, wl, Tf;
function Nt() {
  if (Tf) return wl;
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
      const ee = /* @__PURE__ */ new Map(), de = ie.map((Y) => new a(Y, this.options));
      for (const Y of de) {
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
        if (fe(this.set[B], D, this.options))
          return !0;
      return !1;
    }
  }
  wl = t;
  const r = RS, n = new r(), i = Iu, a = Ss(), s = ws, u = nt, {
    safeRe: c,
    t: g,
    comparatorTrimReplace: f,
    tildeTrimReplace: h,
    caretTrimReplace: m
  } = Co, { FLAG_INCLUDE_PRERELEASE: b, FLAG_LOOSE: E } = _s, C = (L) => L.value === "<0.0.0-0", A = (L) => L.value === "", I = (L, D) => {
    let B = !0;
    const N = L.slice();
    let q = N.pop();
    for (; B && N.length; )
      B = N.every((U) => q.intersects(U, D)), q = N.pop();
    return B;
  }, $ = (L, D) => (s("comp", L, D), L = se(L, D), s("caret", L), L = x(L, D), s("tildes", L), L = Fe(L, D), s("xrange", L), L = re(L, D), s("stars", L), L), M = (L) => !L || L.toLowerCase() === "x" || L === "*", x = (L, D) => L.trim().split(/\s+/).map((B) => te(B, D)).join(" "), te = (L, D) => {
    const B = D.loose ? c[g.TILDELOOSE] : c[g.TILDE];
    return L.replace(B, (N, q, U, V, ie) => {
      s("tilde", L, N, q, U, V, ie);
      let ee;
      return M(q) ? ee = "" : M(U) ? ee = `>=${q}.0.0 <${+q + 1}.0.0-0` : M(V) ? ee = `>=${q}.${U}.0 <${q}.${+U + 1}.0-0` : ie ? (s("replaceTilde pr", ie), ee = `>=${q}.${U}.${V}-${ie} <${q}.${+U + 1}.0-0`) : ee = `>=${q}.${U}.${V} <${q}.${+U + 1}.0-0`, s("tilde return", ee), ee;
    });
  }, se = (L, D) => L.trim().split(/\s+/).map((B) => Q(B, D)).join(" "), Q = (L, D) => {
    s("caret", L, D);
    const B = D.loose ? c[g.CARETLOOSE] : c[g.CARET], N = D.includePrerelease ? "-0" : "";
    return L.replace(B, (q, U, V, ie, ee) => {
      s("caret", L, q, U, V, ie, ee);
      let de;
      return M(U) ? de = "" : M(V) ? de = `>=${U}.0.0${N} <${+U + 1}.0.0-0` : M(ie) ? U === "0" ? de = `>=${U}.${V}.0${N} <${U}.${+V + 1}.0-0` : de = `>=${U}.${V}.0${N} <${+U + 1}.0.0-0` : ee ? (s("replaceCaret pr", ee), U === "0" ? V === "0" ? de = `>=${U}.${V}.${ie}-${ee} <${U}.${V}.${+ie + 1}-0` : de = `>=${U}.${V}.${ie}-${ee} <${U}.${+V + 1}.0-0` : de = `>=${U}.${V}.${ie}-${ee} <${+U + 1}.0.0-0`) : (s("no pr"), U === "0" ? V === "0" ? de = `>=${U}.${V}.${ie}${N} <${U}.${V}.${+ie + 1}-0` : de = `>=${U}.${V}.${ie}${N} <${U}.${+V + 1}.0-0` : de = `>=${U}.${V}.${ie} <${+U + 1}.0.0-0`), s("caret return", de), de;
    });
  }, Fe = (L, D) => (s("replaceXRanges", L, D), L.split(/\s+/).map((B) => S(B, D)).join(" ")), S = (L, D) => {
    L = L.trim();
    const B = D.loose ? c[g.XRANGELOOSE] : c[g.XRANGE];
    return L.replace(B, (N, q, U, V, ie, ee) => {
      s("xRange", L, N, q, U, V, ie, ee);
      const de = M(U), Te = de || M(V), Y = Te || M(ie), Re = Y;
      return q === "=" && Re && (q = ""), ee = D.includePrerelease ? "-0" : "", de ? q === ">" || q === "<" ? N = "<0.0.0-0" : N = "*" : q && Re ? (Te && (V = 0), ie = 0, q === ">" ? (q = ">=", Te ? (U = +U + 1, V = 0, ie = 0) : (V = +V + 1, ie = 0)) : q === "<=" && (q = "<", Te ? U = +U + 1 : V = +V + 1), q === "<" && (ee = "-0"), N = `${q + U}.${V}.${ie}${ee}`) : Te ? N = `>=${U}.0.0${ee} <${+U + 1}.0.0-0` : Y && (N = `>=${U}.${V}.0${ee} <${U}.${+V + 1}.0-0`), s("xRange return", N), N;
    });
  }, re = (L, D) => (s("replaceStars", L, D), L.trim().replace(c[g.STAR], "")), Z = (L, D) => (s("replaceGTE0", L, D), L.trim().replace(c[D.includePrerelease ? g.GTE0PRE : g.GTE0], "")), X = (L) => (D, B, N, q, U, V, ie, ee, de, Te, Y, Re) => (M(N) ? B = "" : M(q) ? B = `>=${N}.0.0${L ? "-0" : ""}` : M(U) ? B = `>=${N}.${q}.0${L ? "-0" : ""}` : V ? B = `>=${B}` : B = `>=${B}${L ? "-0" : ""}`, M(de) ? ee = "" : M(Te) ? ee = `<${+de + 1}.0.0-0` : M(Y) ? ee = `<${de}.${+Te + 1}.0-0` : Re ? ee = `<=${de}.${Te}.${Y}-${Re}` : L ? ee = `<${de}.${Te}.${+Y + 1}-0` : ee = `<=${ee}`, `${B} ${ee}`.trim()), fe = (L, D, B) => {
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
  return wl;
}
var El, Af;
function Ss() {
  if (Af) return El;
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
  El = t;
  const r = Iu, { safeRe: n, t: i } = Co, a = Ap, s = ws, u = nt, c = Nt();
  return El;
}
const TS = Nt(), AS = (e, t, r) => {
  try {
    t = new TS(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var vs = AS;
const PS = Nt(), IS = (e, t) => new PS(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var $S = IS;
const OS = nt, DS = Nt(), NS = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new DS(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new OS(n, r));
  }), n;
};
var FS = NS;
const kS = nt, LS = Nt(), xS = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new LS(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new kS(n, r));
  }), n;
};
var US = xS;
const Sl = nt, BS = Nt(), Pf = Es, MS = (e, t) => {
  e = new BS(e, t);
  let r = new Sl("0.0.0");
  if (e.test(r) || (r = new Sl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((s) => {
      const u = new Sl(s.semver.version);
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
var qS = MS;
const jS = Nt(), WS = (e, t) => {
  try {
    return new jS(e, t).range || "*";
  } catch {
    return null;
  }
};
var HS = WS;
const zS = nt, Pp = Ss(), { ANY: GS } = Pp, VS = Nt(), YS = vs, If = Es, $f = Ou, XS = Nu, QS = Du, KS = (e, t, r, n) => {
  e = new zS(e, n), t = new VS(t, n);
  let i, a, s, u, c;
  switch (r) {
    case ">":
      i = If, a = XS, s = $f, u = ">", c = ">=";
      break;
    case "<":
      i = $f, a = QS, s = If, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (YS(e, t, n))
    return !1;
  for (let g = 0; g < t.set.length; ++g) {
    const f = t.set[g];
    let h = null, m = null;
    if (f.forEach((b) => {
      b.semver === GS && (b = new Pp(">=0.0.0")), h = h || b, m = m || b, i(b.semver, h.semver, n) ? h = b : s(b.semver, m.semver, n) && (m = b);
    }), h.operator === u || h.operator === c || (!m.operator || m.operator === u) && a(e, m.semver))
      return !1;
    if (m.operator === c && s(e, m.semver))
      return !1;
  }
  return !0;
};
var Fu = KS;
const JS = Fu, ZS = (e, t, r) => JS(e, t, ">", r);
var ev = ZS;
const tv = Fu, rv = (e, t, r) => tv(e, t, "<", r);
var nv = rv;
const Of = Nt(), iv = (e, t, r) => (e = new Of(e, r), t = new Of(t, r), e.intersects(t, r));
var ov = iv;
const av = vs, sv = Dt;
var lv = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((f, h) => sv(f, h, r));
  for (const f of s)
    av(f, t, r) ? (a = f, i || (i = f)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const u = [];
  for (const [f, h] of n)
    f === h ? u.push(f) : !h && f === s[0] ? u.push("*") : h ? f === s[0] ? u.push(`<=${h}`) : u.push(`${f} - ${h}`) : u.push(`>=${f}`);
  const c = u.join(" || "), g = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < g.length ? c : t;
};
const Df = Nt(), ku = Ss(), { ANY: vl } = ku, xi = vs, Lu = Dt, uv = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Df(e, r), t = new Df(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = fv(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, cv = [new ku(">=0.0.0-0")], Nf = [new ku(">=0.0.0")], fv = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === vl) {
    if (t.length === 1 && t[0].semver === vl)
      return !0;
    r.includePrerelease ? e = cv : e = Nf;
  }
  if (t.length === 1 && t[0].semver === vl) {
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
    if (s = Lu(i.semver, a.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const b of n) {
    if (i && !xi(b, String(i), r) || a && !xi(b, String(a), r))
      return null;
    for (const E of t)
      if (!xi(b, String(E), r))
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
      } else if (i.operator === ">=" && !xi(i.semver, String(b), r))
        return !1;
    }
    if (a) {
      if (h && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === h.major && b.semver.minor === h.minor && b.semver.patch === h.patch && (h = !1), b.operator === "<" || b.operator === "<=") {
        if (c = kf(a, b, r), c === b && c !== a)
          return !1;
      } else if (a.operator === "<=" && !xi(a.semver, String(b), r))
        return !1;
    }
    if (!b.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && g && !a && s !== 0 || a && f && !i && s !== 0 || m || h);
}, Ff = (e, t, r) => {
  if (!e)
    return t;
  const n = Lu(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, kf = (e, t, r) => {
  if (!e)
    return t;
  const n = Lu(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var dv = uv;
const Cl = Co, Lf = _s, hv = nt, xf = Cp, pv = hi, mv = EE, gv = CE, yv = TE, bv = PE, _v = OE, wv = FE, Ev = xE, Sv = ME, vv = Dt, Cv = HE, Rv = VE, Tv = $u, Av = KE, Pv = eS, Iv = Es, $v = Ou, Ov = Rp, Dv = Tp, Nv = Du, Fv = Nu, kv = Ap, Lv = vS, xv = Ss(), Uv = Nt(), Bv = vs, Mv = $S, qv = FS, jv = US, Wv = qS, Hv = HS, zv = Fu, Gv = ev, Vv = nv, Yv = ov, Xv = lv, Qv = dv;
var Ip = {
  parse: pv,
  valid: mv,
  clean: gv,
  inc: yv,
  diff: bv,
  major: _v,
  minor: wv,
  patch: Ev,
  prerelease: Sv,
  compare: vv,
  rcompare: Cv,
  compareLoose: Rv,
  compareBuild: Tv,
  sort: Av,
  rsort: Pv,
  gt: Iv,
  lt: $v,
  eq: Ov,
  neq: Dv,
  gte: Nv,
  lte: Fv,
  cmp: kv,
  coerce: Lv,
  Comparator: xv,
  Range: Uv,
  satisfies: Bv,
  toComparators: Mv,
  maxSatisfying: qv,
  minSatisfying: jv,
  minVersion: Wv,
  validRange: Hv,
  outside: zv,
  gtr: Gv,
  ltr: Vv,
  intersects: Yv,
  simplifyRange: Xv,
  subset: Qv,
  SemVer: hv,
  re: Cl.re,
  src: Cl.src,
  tokens: Cl.t,
  SEMVER_SPEC_VERSION: Lf.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Lf.RELEASE_TYPES,
  compareIdentifiers: xf.compareIdentifiers,
  rcompareIdentifiers: xf.rcompareIdentifiers
}, Ro = {}, rs = { exports: {} };
rs.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, u = "[object Arguments]", c = "[object Array]", g = "[object AsyncFunction]", f = "[object Boolean]", h = "[object Date]", m = "[object Error]", b = "[object Function]", E = "[object GeneratorFunction]", C = "[object Map]", A = "[object Number]", I = "[object Null]", $ = "[object Object]", M = "[object Promise]", x = "[object Proxy]", te = "[object RegExp]", se = "[object Set]", Q = "[object String]", Fe = "[object Symbol]", S = "[object Undefined]", re = "[object WeakMap]", Z = "[object ArrayBuffer]", X = "[object DataView]", fe = "[object Float32Array]", L = "[object Float64Array]", D = "[object Int8Array]", B = "[object Int16Array]", N = "[object Int32Array]", q = "[object Uint8Array]", U = "[object Uint8ClampedArray]", V = "[object Uint16Array]", ie = "[object Uint32Array]", ee = /[\\^$.*+?()[\]{}|]/g, de = /^\[object .+?Constructor\]$/, Te = /^(?:0|[1-9]\d*)$/, Y = {};
  Y[fe] = Y[L] = Y[D] = Y[B] = Y[N] = Y[q] = Y[U] = Y[V] = Y[ie] = !0, Y[u] = Y[c] = Y[Z] = Y[f] = Y[X] = Y[h] = Y[m] = Y[b] = Y[C] = Y[A] = Y[$] = Y[te] = Y[se] = Y[Q] = Y[re] = !1;
  var Re = typeof Be == "object" && Be && Be.Object === Object && Be, y = typeof self == "object" && self && self.Object === Object && self, p = Re || y || Function("return this")(), F = t && !t.nodeType && t, T = F && !0 && e && !e.nodeType && e, le = T && T.exports === F, me = le && Re.process, we = function() {
    try {
      return me && me.binding && me.binding("util");
    } catch {
    }
  }(), De = we && we.isTypedArray;
  function Ae(w, R) {
    for (var k = -1, W = w == null ? 0 : w.length, pe = 0, K = []; ++k < W; ) {
      var he = w[k];
      R(he, k, w) && (K[pe++] = he);
    }
    return K;
  }
  function yt(w, R) {
    for (var k = -1, W = R.length, pe = w.length; ++k < W; )
      w[pe + k] = R[k];
    return w;
  }
  function be(w, R) {
    for (var k = -1, W = w == null ? 0 : w.length; ++k < W; )
      if (R(w[k], k, w))
        return !0;
    return !1;
  }
  function it(w, R) {
    for (var k = -1, W = Array(w); ++k < w; )
      W[k] = R(k);
    return W;
  }
  function zr(w) {
    return function(R) {
      return w(R);
    };
  }
  function Qt(w, R) {
    return w.has(R);
  }
  function mr(w, R) {
    return w == null ? void 0 : w[R];
  }
  function dt(w) {
    var R = -1, k = Array(w.size);
    return w.forEach(function(W, pe) {
      k[++R] = [pe, W];
    }), k;
  }
  function Ft(w, R) {
    return function(k) {
      return w(R(k));
    };
  }
  function Gr(w) {
    var R = -1, k = Array(w.size);
    return w.forEach(function(W) {
      k[++R] = W;
    }), k;
  }
  var Ds = Array.prototype, Io = Function.prototype, Kt = Object.prototype, mi = p["__core-js_shared__"], gi = Io.toString, ht = Kt.hasOwnProperty, $o = function() {
    var w = /[^.]+$/.exec(mi && mi.keys && mi.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), yi = Kt.toString, Oo = RegExp(
    "^" + gi.call(ht).replace(ee, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), bi = le ? p.Buffer : void 0, gr = p.Symbol, _n = p.Uint8Array, wn = Kt.propertyIsEnumerable, Vr = Ds.splice, kt = gr ? gr.toStringTag : void 0, bt = Object.getOwnPropertySymbols, Lt = bi ? bi.isBuffer : void 0, Do = Ft(Object.keys, Object), yr = Er(p, "DataView"), Yr = Er(p, "Map"), Xr = Er(p, "Promise"), En = Er(p, "Set"), _i = Er(p, "WeakMap"), Qr = Er(Object, "create"), Ns = nr(yr), Fs = nr(Yr), No = nr(Xr), wi = nr(En), Ei = nr(_i), Fo = gr ? gr.prototype : void 0, _t = Fo ? Fo.valueOf : void 0;
  function xt(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.clear(); ++R < k; ) {
      var W = w[R];
      this.set(W[0], W[1]);
    }
  }
  function ks() {
    this.__data__ = Qr ? Qr(null) : {}, this.size = 0;
  }
  function Ls(w) {
    var R = this.has(w) && delete this.__data__[w];
    return this.size -= R ? 1 : 0, R;
  }
  function Jt(w) {
    var R = this.__data__;
    if (Qr) {
      var k = R[w];
      return k === n ? void 0 : k;
    }
    return ht.call(R, w) ? R[w] : void 0;
  }
  function Ct(w) {
    var R = this.__data__;
    return Qr ? R[w] !== void 0 : ht.call(R, w);
  }
  function Zt(w, R) {
    var k = this.__data__;
    return this.size += this.has(w) ? 0 : 1, k[w] = Qr && R === void 0 ? n : R, this;
  }
  xt.prototype.clear = ks, xt.prototype.delete = Ls, xt.prototype.get = Jt, xt.prototype.has = Ct, xt.prototype.set = Zt;
  function pt(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.clear(); ++R < k; ) {
      var W = w[R];
      this.set(W[0], W[1]);
    }
  }
  function er() {
    this.__data__ = [], this.size = 0;
  }
  function ko(w) {
    var R = this.__data__, k = tr(R, w);
    if (k < 0)
      return !1;
    var W = R.length - 1;
    return k == W ? R.pop() : Vr.call(R, k, 1), --this.size, !0;
  }
  function Si(w) {
    var R = this.__data__, k = tr(R, w);
    return k < 0 ? void 0 : R[k][1];
  }
  function Lo(w) {
    return tr(this.__data__, w) > -1;
  }
  function Sn(w, R) {
    var k = this.__data__, W = tr(k, w);
    return W < 0 ? (++this.size, k.push([w, R])) : k[W][1] = R, this;
  }
  pt.prototype.clear = er, pt.prototype.delete = ko, pt.prototype.get = Si, pt.prototype.has = Lo, pt.prototype.set = Sn;
  function Ut(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.clear(); ++R < k; ) {
      var W = w[R];
      this.set(W[0], W[1]);
    }
  }
  function xo() {
    this.size = 0, this.__data__ = {
      hash: new xt(),
      map: new (Yr || pt)(),
      string: new xt()
    };
  }
  function Uo(w) {
    var R = An(this, w).delete(w);
    return this.size -= R ? 1 : 0, R;
  }
  function Bo(w) {
    return An(this, w).get(w);
  }
  function Mo(w) {
    return An(this, w).has(w);
  }
  function vi(w, R) {
    var k = An(this, w), W = k.size;
    return k.set(w, R), this.size += k.size == W ? 0 : 1, this;
  }
  Ut.prototype.clear = xo, Ut.prototype.delete = Uo, Ut.prototype.get = Bo, Ut.prototype.has = Mo, Ut.prototype.set = vi;
  function br(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.__data__ = new Ut(); ++R < k; )
      this.add(w[R]);
  }
  function xs(w) {
    return this.__data__.set(w, n), this;
  }
  function Us(w) {
    return this.__data__.has(w);
  }
  br.prototype.add = br.prototype.push = xs, br.prototype.has = Us;
  function Bt(w) {
    var R = this.__data__ = new pt(w);
    this.size = R.size;
  }
  function Bs() {
    this.__data__ = new pt(), this.size = 0;
  }
  function qo(w) {
    var R = this.__data__, k = R.delete(w);
    return this.size = R.size, k;
  }
  function _r(w) {
    return this.__data__.get(w);
  }
  function Ms(w) {
    return this.__data__.has(w);
  }
  function vn(w, R) {
    var k = this.__data__;
    if (k instanceof pt) {
      var W = k.__data__;
      if (!Yr || W.length < r - 1)
        return W.push([w, R]), this.size = ++k.size, this;
      k = this.__data__ = new Ut(W);
    }
    return k.set(w, R), this.size = k.size, this;
  }
  Bt.prototype.clear = Bs, Bt.prototype.delete = qo, Bt.prototype.get = _r, Bt.prototype.has = Ms, Bt.prototype.set = vn;
  function Kr(w, R) {
    var k = jt(w), W = !k && Pn(w), pe = !k && !W && Sr(w), K = !k && !W && !pe && Jo(w), he = k || W || pe || K, Se = he ? it(w.length, String) : [], Pe = Se.length;
    for (var Ee in w)
      ht.call(w, Ee) && !(he && // Safari 9 has enumerable `arguments.length` in strict mode.
      (Ee == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      pe && (Ee == "offset" || Ee == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      K && (Ee == "buffer" || Ee == "byteLength" || Ee == "byteOffset") || // Skip index properties.
      Vo(Ee, Pe))) && Se.push(Ee);
    return Se;
  }
  function tr(w, R) {
    for (var k = w.length; k--; )
      if (Ai(w[k][0], R))
        return k;
    return -1;
  }
  function ot(w, R, k) {
    var W = R(w);
    return jt(w) ? W : yt(W, k(w));
  }
  function wr(w) {
    return w == null ? w === void 0 ? S : I : kt && kt in Object(w) ? zo(w) : Yo(w);
  }
  function Cn(w) {
    return Zr(w) && wr(w) == u;
  }
  function Ci(w, R, k, W, pe) {
    return w === R ? !0 : w == null || R == null || !Zr(w) && !Zr(R) ? w !== w && R !== R : Rn(w, R, k, W, Ci, pe);
  }
  function Rn(w, R, k, W, pe, K) {
    var he = jt(w), Se = jt(R), Pe = he ? c : Mt(w), Ee = Se ? c : Mt(R);
    Pe = Pe == u ? $ : Pe, Ee = Ee == u ? $ : Ee;
    var qe = Pe == $, Ye = Ee == $, Ie = Pe == Ee;
    if (Ie && Sr(w)) {
      if (!Sr(R))
        return !1;
      he = !0, qe = !1;
    }
    if (Ie && !qe)
      return K || (K = new Bt()), he || Jo(w) ? Wo(w, R, k, W, pe, K) : Ri(w, R, Pe, k, W, pe, K);
    if (!(k & i)) {
      var at = qe && ht.call(w, "__wrapped__"), st = Ye && ht.call(R, "__wrapped__");
      if (at || st) {
        var Wt = at ? w.value() : w, Rt = st ? R.value() : R;
        return K || (K = new Bt()), pe(Wt, Rt, k, W, K);
      }
    }
    return Ie ? (K || (K = new Bt()), Jr(w, R, k, W, pe, K)) : !1;
  }
  function Tn(w) {
    if (!Ko(w) || qt(w))
      return !1;
    var R = Xo(w) ? Oo : de;
    return R.test(nr(w));
  }
  function jo(w) {
    return Zr(w) && Qo(w.length) && !!Y[wr(w)];
  }
  function qs(w) {
    if (!rr(w))
      return Do(w);
    var R = [];
    for (var k in Object(w))
      ht.call(w, k) && k != "constructor" && R.push(k);
    return R;
  }
  function Wo(w, R, k, W, pe, K) {
    var he = k & i, Se = w.length, Pe = R.length;
    if (Se != Pe && !(he && Pe > Se))
      return !1;
    var Ee = K.get(w);
    if (Ee && K.get(R))
      return Ee == R;
    var qe = -1, Ye = !0, Ie = k & a ? new br() : void 0;
    for (K.set(w, R), K.set(R, w); ++qe < Se; ) {
      var at = w[qe], st = R[qe];
      if (W)
        var Wt = he ? W(st, at, qe, R, w, K) : W(at, st, qe, w, R, K);
      if (Wt !== void 0) {
        if (Wt)
          continue;
        Ye = !1;
        break;
      }
      if (Ie) {
        if (!be(R, function(Rt, ke) {
          if (!Qt(Ie, ke) && (at === Rt || pe(at, Rt, k, W, K)))
            return Ie.push(ke);
        })) {
          Ye = !1;
          break;
        }
      } else if (!(at === st || pe(at, st, k, W, K))) {
        Ye = !1;
        break;
      }
    }
    return K.delete(w), K.delete(R), Ye;
  }
  function Ri(w, R, k, W, pe, K, he) {
    switch (k) {
      case X:
        if (w.byteLength != R.byteLength || w.byteOffset != R.byteOffset)
          return !1;
        w = w.buffer, R = R.buffer;
      case Z:
        return !(w.byteLength != R.byteLength || !K(new _n(w), new _n(R)));
      case f:
      case h:
      case A:
        return Ai(+w, +R);
      case m:
        return w.name == R.name && w.message == R.message;
      case te:
      case Q:
        return w == R + "";
      case C:
        var Se = dt;
      case se:
        var Pe = W & i;
        if (Se || (Se = Gr), w.size != R.size && !Pe)
          return !1;
        var Ee = he.get(w);
        if (Ee)
          return Ee == R;
        W |= a, he.set(w, R);
        var qe = Wo(Se(w), Se(R), W, pe, K, he);
        return he.delete(w), qe;
      case Fe:
        if (_t)
          return _t.call(w) == _t.call(R);
    }
    return !1;
  }
  function Jr(w, R, k, W, pe, K) {
    var he = k & i, Se = Ho(w), Pe = Se.length, Ee = Ho(R), qe = Ee.length;
    if (Pe != qe && !he)
      return !1;
    for (var Ye = Pe; Ye--; ) {
      var Ie = Se[Ye];
      if (!(he ? Ie in R : ht.call(R, Ie)))
        return !1;
    }
    var at = K.get(w);
    if (at && K.get(R))
      return at == R;
    var st = !0;
    K.set(w, R), K.set(R, w);
    for (var Wt = he; ++Ye < Pe; ) {
      Ie = Se[Ye];
      var Rt = w[Ie], ke = R[Ie];
      if (W)
        var ea = he ? W(ke, Rt, Ie, R, w, K) : W(Rt, ke, Ie, w, R, K);
      if (!(ea === void 0 ? Rt === ke || pe(Rt, ke, k, W, K) : ea)) {
        st = !1;
        break;
      }
      Wt || (Wt = Ie == "constructor");
    }
    if (st && !Wt) {
      var $n = w.constructor, On = R.constructor;
      $n != On && "constructor" in w && "constructor" in R && !(typeof $n == "function" && $n instanceof $n && typeof On == "function" && On instanceof On) && (st = !1);
    }
    return K.delete(w), K.delete(R), st;
  }
  function Ho(w) {
    return ot(w, Zo, Go);
  }
  function An(w, R) {
    var k = w.__data__;
    return Ti(R) ? k[typeof R == "string" ? "string" : "hash"] : k.map;
  }
  function Er(w, R) {
    var k = mr(w, R);
    return Tn(k) ? k : void 0;
  }
  function zo(w) {
    var R = ht.call(w, kt), k = w[kt];
    try {
      w[kt] = void 0;
      var W = !0;
    } catch {
    }
    var pe = yi.call(w);
    return W && (R ? w[kt] = k : delete w[kt]), pe;
  }
  var Go = bt ? function(w) {
    return w == null ? [] : (w = Object(w), Ae(bt(w), function(R) {
      return wn.call(w, R);
    }));
  } : Ws, Mt = wr;
  (yr && Mt(new yr(new ArrayBuffer(1))) != X || Yr && Mt(new Yr()) != C || Xr && Mt(Xr.resolve()) != M || En && Mt(new En()) != se || _i && Mt(new _i()) != re) && (Mt = function(w) {
    var R = wr(w), k = R == $ ? w.constructor : void 0, W = k ? nr(k) : "";
    if (W)
      switch (W) {
        case Ns:
          return X;
        case Fs:
          return C;
        case No:
          return M;
        case wi:
          return se;
        case Ei:
          return re;
      }
    return R;
  });
  function Vo(w, R) {
    return R = R ?? s, !!R && (typeof w == "number" || Te.test(w)) && w > -1 && w % 1 == 0 && w < R;
  }
  function Ti(w) {
    var R = typeof w;
    return R == "string" || R == "number" || R == "symbol" || R == "boolean" ? w !== "__proto__" : w === null;
  }
  function qt(w) {
    return !!$o && $o in w;
  }
  function rr(w) {
    var R = w && w.constructor, k = typeof R == "function" && R.prototype || Kt;
    return w === k;
  }
  function Yo(w) {
    return yi.call(w);
  }
  function nr(w) {
    if (w != null) {
      try {
        return gi.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function Ai(w, R) {
    return w === R || w !== w && R !== R;
  }
  var Pn = Cn(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Cn : function(w) {
    return Zr(w) && ht.call(w, "callee") && !wn.call(w, "callee");
  }, jt = Array.isArray;
  function In(w) {
    return w != null && Qo(w.length) && !Xo(w);
  }
  var Sr = Lt || Hs;
  function js(w, R) {
    return Ci(w, R);
  }
  function Xo(w) {
    if (!Ko(w))
      return !1;
    var R = wr(w);
    return R == b || R == E || R == g || R == x;
  }
  function Qo(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function Ko(w) {
    var R = typeof w;
    return w != null && (R == "object" || R == "function");
  }
  function Zr(w) {
    return w != null && typeof w == "object";
  }
  var Jo = De ? zr(De) : jo;
  function Zo(w) {
    return In(w) ? Kr(w) : qs(w);
  }
  function Ws() {
    return [];
  }
  function Hs() {
    return !1;
  }
  e.exports = js;
})(rs, rs.exports);
var Kv = rs.exports;
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.DownloadedUpdateHelper = void 0;
Ro.createTempUpdateFile = rC;
const Jv = bo, Zv = jr, Uf = Kv, sn = Wr, Yi = Ce;
class eC {
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
    return Yi.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Uf(this.versionInfo, r) && Uf(this.fileInfo.info, n.info) && await (0, sn.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, sn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, sn.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, sn.pathExists)(n))
      return null;
    let a;
    try {
      a = await (0, sn.readJson)(n);
    } catch (g) {
      let f = "No cached update info available";
      return g.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), f += ` (error on read: ${g.message})`), r.info(f), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const u = Yi.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, sn.pathExists)(u))
      return r.info("Cached update file doesn't exist"), null;
    const c = await tC(u);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, u);
  }
  getUpdateInfoFile() {
    return Yi.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Ro.DownloadedUpdateHelper = eC;
function tC(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, Jv.createHash)(t);
    s.on("error", a).setEncoding(r), (0, Zv.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function rC(e, t, r) {
  let n = 0, i = Yi.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, sn.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = Yi.join(t, `${n++}-${e}`);
    }
  return i;
}
var Cs = {}, xu = {};
Object.defineProperty(xu, "__esModule", { value: !0 });
xu.getAppCacheDir = iC;
const Rl = Ce, nC = ls;
function iC() {
  const e = (0, nC.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Rl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Rl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Rl.join(e, ".cache"), t;
}
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.ElectronAppAdapter = void 0;
const Bf = Ce, oC = xu;
class aC {
  constructor(t = pn.app) {
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
    return (0, oC.getAppCacheDir)();
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
Cs.ElectronAppAdapter = aC;
var $p = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Me;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return pn.session.fromPartition(e.NET_SESSION_NAME, {
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
      const u = pn.net.request({
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
})($p);
var To = {}, vt = {}, sC = "[object Symbol]", Op = /[\\^$.*+?()[\]{}|]/g, lC = RegExp(Op.source), uC = typeof Be == "object" && Be && Be.Object === Object && Be, cC = typeof self == "object" && self && self.Object === Object && self, fC = uC || cC || Function("return this")(), dC = Object.prototype, hC = dC.toString, Mf = fC.Symbol, qf = Mf ? Mf.prototype : void 0, jf = qf ? qf.toString : void 0;
function pC(e) {
  if (typeof e == "string")
    return e;
  if (gC(e))
    return jf ? jf.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function mC(e) {
  return !!e && typeof e == "object";
}
function gC(e) {
  return typeof e == "symbol" || mC(e) && hC.call(e) == sC;
}
function yC(e) {
  return e == null ? "" : pC(e);
}
function bC(e) {
  return e = yC(e), e && lC.test(e) ? e.replace(Op, "\\$&") : e;
}
var _C = bC;
Object.defineProperty(vt, "__esModule", { value: !0 });
vt.newBaseUrl = EC;
vt.newUrlFromBase = tu;
vt.getChannelFilename = SC;
vt.blockmapFiles = vC;
const Dp = ci, wC = _C;
function EC(e) {
  const t = new Dp.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function tu(e, t, r = !1) {
  const n = new Dp.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function SC(e) {
  return `${e}.yml`;
}
function vC(e, t, r) {
  const n = tu(`${e.pathname}.blockmap`, e);
  return [tu(`${e.pathname.replace(new RegExp(wC(r), "g"), t)}.blockmap`, e), n];
}
var Ne = {};
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.Provider = void 0;
Ne.findFile = TC;
Ne.parseUpdateInfo = AC;
Ne.getFileList = Np;
Ne.resolveFiles = PC;
const Mr = Me, CC = We, Wf = vt;
class RC {
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, Mr.configureRequestUrl)(t, n), n;
  }
}
Ne.Provider = RC;
function TC(e, t, r) {
  if (e.length === 0)
    throw (0, Mr.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function AC(e, t, r) {
  if (e == null)
    throw (0, Mr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, CC.load)(e);
  } catch (i) {
    throw (0, Mr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Np(e) {
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
  throw (0, Mr.newError)(`No files provided: ${(0, Mr.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function PC(e, t, r = (n) => n) {
  const i = Np(e).map((u) => {
    if (u.sha2 == null && u.sha512 == null)
      throw (0, Mr.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Mr.safeStringifyJson)(u)}`, "ERR_UPDATER_NO_CHECKSUM");
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
Object.defineProperty(To, "__esModule", { value: !0 });
To.GenericProvider = void 0;
const Hf = Me, Tl = vt, Al = Ne;
class IC extends Al.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Tl.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Tl.getChannelFilename)(this.channel), r = (0, Tl.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Al.parseUpdateInfo)(await this.httpRequest(r), t, r);
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
    return (0, Al.resolveFiles)(t, this.baseUrl);
  }
}
To.GenericProvider = IC;
var Rs = {}, Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.BitbucketProvider = void 0;
const zf = Me, Pl = vt, Il = Ne;
class $C extends Il.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, Pl.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new zf.CancellationToken(), r = (0, Pl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Pl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Il.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, zf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Il.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Ts.BitbucketProvider = $C;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.GitHubProvider = qr.BaseGitHubProvider = void 0;
qr.computeReleaseNotes = kp;
const ur = Me, ei = Ip, OC = ci, ti = vt, ru = Ne, $l = /\/tag\/([^/]+)$/;
class Fp extends ru.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, ti.newBaseUrl)((0, ur.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, ti.newBaseUrl)((0, ur.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
qr.BaseGitHubProvider = Fp;
class DC extends Fp {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const s = new ur.CancellationToken(), u = await this.httpRequest((0, ti.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, ur.parseXml)(u);
    let g = c.element("entry", !1, "No published versions on GitHub"), f = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = ei.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (A === null)
          f = $l.exec(g.element("link").attribute("href"))[1];
        else
          for (const I of c.getElements("entry")) {
            const $ = $l.exec(I.element("link").attribute("href"));
            if ($ === null)
              continue;
            const M = $[1], x = ((n = ei.prerelease(M)) === null || n === void 0 ? void 0 : n[0]) || null, te = !A || ["alpha", "beta"].includes(A), se = x !== null && !["alpha", "beta"].includes(String(x));
            if (te && !se && !(A === "beta" && x === "alpha")) {
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
          if ($l.exec(A.element("link").attribute("href"))[1] === f) {
            g = A;
            break;
          }
      }
    } catch (A) {
      throw (0, ur.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${u}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (f == null)
      throw (0, ur.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let h, m = "", b = "";
    const E = async (A) => {
      m = (0, ti.getChannelFilename)(A), b = (0, ti.newUrlFromBase)(this.getBaseDownloadPath(String(f), m), this.baseUrl);
      const I = this.createRequestOptions(b);
      try {
        return await this.executor.request(I, s);
      } catch ($) {
        throw $ instanceof ur.HttpError && $.statusCode === 404 ? (0, ur.newError)(`Cannot find ${m} in the latest release artifacts (${b}): ${$.stack || $.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : $;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = ei.prerelease(f)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((a = ei.prerelease(f)) === null || a === void 0 ? void 0 : a[0]))), h = await E(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        h = await E(this.getDefaultChannelName());
      else
        throw A;
    }
    const C = (0, ru.parseUpdateInfo)(h, m, b);
    return C.releaseName == null && (C.releaseName = g.elementValueOrEmpty("title")), C.releaseNotes == null && (C.releaseNotes = kp(this.updater.currentVersion, this.updater.fullChangelog, c, g)), {
      tag: f,
      ...C
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, ti.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new OC.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, ur.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, ru.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
qr.GitHubProvider = DC;
function Gf(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function kp(e, t, r, n) {
  if (!t)
    return Gf(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    ei.lt(e, s) && i.push({
      version: s,
      note: Gf(a)
    });
  }
  return i.sort((a, s) => ei.rcompare(a.version, s.version));
}
var As = {};
Object.defineProperty(As, "__esModule", { value: !0 });
As.KeygenProvider = void 0;
const Vf = Me, Ol = vt, Dl = Ne;
class NC extends Dl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Ol.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Vf.CancellationToken(), r = (0, Ol.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Ol.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Dl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Vf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Dl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
As.KeygenProvider = NC;
var Ps = {};
Object.defineProperty(Ps, "__esModule", { value: !0 });
Ps.PrivateGitHubProvider = void 0;
const Gn = Me, FC = We, kC = Ce, Yf = ci, Xf = vt, LC = qr, xC = Ne;
class UC extends LC.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Gn.CancellationToken(), r = (0, Xf.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((u) => u.name === r);
    if (i == null)
      throw (0, Gn.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new Yf.URL(i.url);
    let s;
    try {
      s = (0, FC.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
    } catch (u) {
      throw u instanceof Gn.HttpError && u.statusCode === 404 ? (0, Gn.newError)(`Cannot find ${r} in the latest release artifacts (${a}): ${u.stack || u.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : u;
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
      throw (0, Gn.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${a.stack || a.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, xC.getFileList)(t).map((r) => {
      const n = kC.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, Gn.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Yf.URL(i.url),
        info: r
      };
    });
  }
}
Ps.PrivateGitHubProvider = UC;
Object.defineProperty(Rs, "__esModule", { value: !0 });
Rs.isUrlProbablySupportMultiRangeRequests = Lp;
Rs.createClient = WC;
const Oa = Me, BC = Ts, Qf = To, MC = qr, qC = As, jC = Ps;
function Lp(e) {
  return !e.includes("s3.amazonaws.com");
}
function WC(e, t, r) {
  if (typeof e == "string")
    throw (0, Oa.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new MC.GitHubProvider(i, t, r) : new jC.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new BC.BitbucketProvider(e, t, r);
    case "keygen":
      return new qC.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Qf.GenericProvider({
        provider: "generic",
        url: (0, Oa.getS3LikeProviderBaseUrl)(e),
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
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Lp(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, Oa.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, Oa.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Is = {}, Ao = {}, pi = {}, bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
bn.OperationKind = void 0;
bn.computeOperations = HC;
var cn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(cn || (bn.OperationKind = cn = {}));
function HC(e, t, r) {
  const n = Jf(e.files), i = Jf(t.files);
  let a = null;
  const s = t.files[0], u = [], c = s.name, g = n.get(c);
  if (g == null)
    throw new Error(`no file ${c} in old blockmap`);
  const f = i.get(c);
  let h = 0;
  const { checksumToOffset: m, checksumToOldSize: b } = GC(n.get(c), g.offset, r);
  let E = s.offset;
  for (let C = 0; C < f.checksums.length; E += f.sizes[C], C++) {
    const A = f.sizes[C], I = f.checksums[C];
    let $ = m.get(I);
    $ != null && b.get(I) !== A && (r.warn(`Checksum ("${I}") matches, but size differs (old: ${b.get(I)}, new: ${A})`), $ = void 0), $ === void 0 ? (h++, a != null && a.kind === cn.DOWNLOAD && a.end === E ? a.end += A : (a = {
      kind: cn.DOWNLOAD,
      start: E,
      end: E + A
      // oldBlocks: null,
    }, Kf(a, u, I, C))) : a != null && a.kind === cn.COPY && a.end === $ ? a.end += A : (a = {
      kind: cn.COPY,
      start: $,
      end: $ + A
      // oldBlocks: [checksum]
    }, Kf(a, u, I, C));
  }
  return h > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${h} changed blocks`), u;
}
const zC = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Kf(e, t, r, n) {
  if (zC && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((s, u) => s < u ? s : u);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${cn[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function GC(e, t, r) {
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
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.DataSplitter = void 0;
pi.copyData = xp;
const Da = Me, VC = jr, YC = yo, XC = bn, Zf = Buffer.from(`\r
\r
`);
var $r;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})($r || ($r = {}));
function xp(e, t, r, n, i) {
  const a = (0, VC.createReadStream)("", {
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
class QC extends YC.Writable {
  constructor(t, r, n, i, a, s) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = $r.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Da.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === $r.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = $r.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === $r.BODY)
          this.readState = $r.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Da.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const u = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (u < s)
            await this.copyExistingData(u, s);
          else if (u > s)
            throw (0, Da.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = $r.HEADER;
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
        if (s.kind !== XC.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        xp(s, this.out, this.options.oldFileFd, i, () => {
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
      throw (0, Da.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
pi.DataSplitter = QC;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
$s.executeTasksUsingMultipleRangeRequests = KC;
$s.checkIsRangesSupported = iu;
const nu = Me, ed = pi, td = bn;
function KC(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const u = s + 1e3;
    JC(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, u),
      oldFileFd: n
    }, r, () => a(u), i);
  };
  return a;
}
function JC(e, t, r, n, i) {
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
          iu(A, i) && (A.pipe(r, {
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
    if (!iu(h, i))
      return;
    const m = (0, nu.safeGetHeader)(h, "content-type"), b = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(m);
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
function iu(e, t) {
  if (e.statusCode >= 400)
    return t((0, nu.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, nu.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.ProgressDifferentialDownloadCallbackTransform = void 0;
const ZC = yo;
var ri;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(ri || (ri = {}));
class eR extends ZC.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = ri.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == ri.COPY) {
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
    this.operationType = ri.COPY;
  }
  beginRangeDownload() {
    this.operationType = ri.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Os.ProgressDifferentialDownloadCallbackTransform = eR;
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.DifferentialDownloader = void 0;
const Ui = Me, Nl = Wr, tR = jr, rR = pi, nR = ci, Na = bn, rd = $s, iR = Os;
class oR {
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
    return (0, Ui.configureRequestUrl)(this.options.newUrl, t), (0, Ui.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Na.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const c of i) {
      const g = c.end - c.start;
      c.kind === Na.OperationKind.DOWNLOAD ? a += g : s += g;
    }
    const u = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== u)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${u}`);
    return n.info(`Full: ${nd(u)}, To download: ${nd(a)} (${Math.round(a / (u / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Nl.close)(i.descriptor).catch((a) => {
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
    const n = await (0, Nl.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Nl.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, tR.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, u) => {
      const c = [];
      let g;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const I = [];
        let $ = 0;
        for (const x of t)
          x.kind === Na.OperationKind.DOWNLOAD && (I.push(x.end - x.start), $ += x.end - x.start);
        const M = {
          expectedByteCounts: I,
          grandTotal: $
        };
        g = new iR.ProgressDifferentialDownloadCallbackTransform(M, this.options.cancellationToken, this.options.onProgress), c.push(g);
      }
      const f = new Ui.DigestTransform(this.blockAwareFileInfo.sha512);
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
        if (x.kind === Na.OperationKind.COPY) {
          g && g.beginFileCopy(), (0, rR.copyData)(x, m, n, u, () => b(I));
          return;
        }
        const te = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = te, (M = ($ = this.logger) === null || $ === void 0 ? void 0 : $.debug) === null || M === void 0 || M.call($, `download range: ${te}`), g && g.beginRangeDownload();
        const se = this.httpExecutor.createRequest(A, (Q) => {
          Q.on("error", u), Q.on("aborted", () => {
            u(new Error("response has been aborted by the server"));
          }), Q.statusCode >= 400 && u((0, Ui.createHttpError)(Q)), Q.pipe(m, {
            end: !1
          }), Q.once("end", () => {
            g && g.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => b(I), 1e3)) : b(I);
          });
        });
        se.on("redirect", (Q, Fe, S) => {
          this.logger.info(`Redirect to ${aR(S)}`), C = S, (0, Ui.configureRequestUrl)(new nR.URL(C), A), se.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(se, u), se.end();
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
Ao.DifferentialDownloader = oR;
function nd(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function aR(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Is, "__esModule", { value: !0 });
Is.GenericDifferentialDownloader = void 0;
const sR = Ao;
class lR extends sR.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Is.GenericDifferentialDownloader = lR;
var Hr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Me;
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
})(Hr);
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.NoOpLogger = xr.AppUpdater = void 0;
const Qe = Me, uR = bo, cR = ls, fR = Td, Vn = Wr, dR = We, Fl = bs, an = Ce, ln = Ip, id = Ro, hR = Cs, od = $p, pR = To, kl = Rs, mR = Pd, gR = vt, yR = Is, Yn = Hr;
class Uu extends fR.EventEmitter {
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
        throw (0, Qe.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Qe.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    this._logger = t ?? new Up();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Fl.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Yn.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new Fl.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Fl.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new hR.ElectronAppAdapter(), this.httpExecutor = new od.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, ln.parse)(n);
    if (i == null)
      throw (0, Qe.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = bR(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new pR.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, kl.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, kl.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Uu.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new pn.Notification(n).show();
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
    const i = await this.stagingUserIdPromise.value, s = Qe.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, ln.parse)(t.version);
    if (r == null)
      throw (0, Qe.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, ln.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, ln.gt)(r, n), s = (0, ln.lt)(r, n);
    return a ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, cR.release)();
    if (r)
      try {
        if ((0, ln.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, kl.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new Qe.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Qe.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Qe.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Qe.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Qe.CancellationError))
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
    this.emit(Yn.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, dR.load)(await (0, Vn.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = an.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Vn.readFile)(t, "utf-8");
      if (Qe.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Qe.UUID.v5((0, uR.randomBytes)(4096), Qe.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Vn.outputFile)(t, r);
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
      const i = an.join(this.app.baseCachePath, r || this.app.name);
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
    this.listenerCount(Yn.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = ($) => this.emit(Yn.DOWNLOAD_PROGRESS, $));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = r.packageInfo;
    function u() {
      const $ = decodeURIComponent(t.fileInfo.url.pathname);
      return $.endsWith(`.${t.fileExtension}`) ? an.basename($) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), g = c.cacheDirForPendingUpdate;
    await (0, Vn.mkdir)(g, { recursive: !0 });
    const f = u();
    let h = an.join(g, f);
    const m = s == null ? null : an.join(g, `package-${a}${an.extname(s.path) || ".7z"}`), b = async ($) => (await c.setDownloadedFile(h, m, i, r, f, $), await t.done({
      ...i,
      downloadedFile: h
    }), m == null ? [h] : [h, m]), E = this._logger, C = await c.validateDownloadedPath(h, i, r, E);
    if (C != null)
      return h = C, await b(!1);
    const A = async () => (await c.clear().catch(() => {
    }), await (0, Vn.unlink)(h).catch(() => {
    })), I = await (0, id.createTempUpdateFile)(`temp-${f}`, g, E);
    try {
      await t.task(I, n, m, A), await (0, Qe.retry)(() => (0, Vn.rename)(I, h), 60, 500, 0, 0, ($) => $ instanceof Error && /^EBUSY:/.test($.message));
    } catch ($) {
      throw await A(), $ instanceof Qe.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), $;
    }
    return E.info(`New version ${a} has been downloaded to ${h}`), await b(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, gR.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const u = async (f) => {
        const h = await this.httpExecutor.downloadToBuffer(f, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (h == null || h.length === 0)
          throw new Error(`Blockmap "${f.href}" is empty`);
        try {
          return JSON.parse((0, mR.gunzipSync)(h).toString());
        } catch (m) {
          throw new Error(`Cannot parse blockmap "${f.href}", error: ${m}`);
        }
      }, c = {
        newUrl: t.url,
        oldFile: an.join(this.downloadedUpdateHelper.cacheDir, a),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Yn.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (f) => this.emit(Yn.DOWNLOAD_PROGRESS, f));
      const g = await Promise.all(s.map((f) => u(f)));
      return await new yR.GenericDifferentialDownloader(t.info, this.httpExecutor, c).download(g[0], g[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
xr.AppUpdater = Uu;
function bR(e) {
  const t = (0, ln.prerelease)(e);
  return t != null && t.length > 0;
}
class Up {
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
xr.NoOpLogger = Up;
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.BaseUpdater = void 0;
const ad = ss, _R = xr;
class wR extends _R.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      pn.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
pr.BaseUpdater = wR;
var so = {}, Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
Po.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Xn = Wr, ER = Ao, SR = Pd;
class vR extends ER.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Bp(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await CR(this.options.oldFile), i);
  }
}
Po.FileWithEmbeddedBlockMapDifferentialDownloader = vR;
function Bp(e) {
  return JSON.parse((0, SR.inflateRawSync)(e).toString());
}
async function CR(e) {
  const t = await (0, Xn.open)(e, "r");
  try {
    const r = (await (0, Xn.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Xn.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Xn.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Xn.close)(t), Bp(i);
  } catch (r) {
    throw await (0, Xn.close)(t), r;
  }
}
Object.defineProperty(so, "__esModule", { value: !0 });
so.AppImageUpdater = void 0;
const sd = Me, ld = ss, RR = Wr, TR = jr, Bi = Ce, AR = pr, PR = Po, IR = Ne, ud = Hr;
class $R extends AR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, IR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, sd.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, RR.chmod)(i, 493);
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
      return this.listenerCount(ud.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (u) => this.emit(ud.DOWNLOAD_PROGRESS, u)), await new PR.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, sd.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, TR.unlinkSync)(r);
    let n;
    const i = Bi.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Bi.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Bi.join(Bi.dirname(r), Bi.basename(a)), (0, ld.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, ld.execFileSync)(n, [], { env: s })), !0;
  }
}
so.AppImageUpdater = $R;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
lo.DebUpdater = void 0;
const OR = pr, DR = Ne, cd = Hr;
class NR extends OR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, DR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
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
lo.DebUpdater = NR;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.PacmanUpdater = void 0;
const FR = pr, fd = Hr, kR = Ne;
class LR extends FR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, kR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
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
uo.PacmanUpdater = LR;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
co.RpmUpdater = void 0;
const xR = pr, dd = Hr, UR = Ne;
class BR extends xR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, UR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
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
co.RpmUpdater = BR;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.MacUpdater = void 0;
const hd = Me, Ll = Wr, MR = jr, pd = Ce, qR = eg, jR = xr, WR = Ne, md = ss, gd = bo;
class HR extends jR.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = pn.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
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
    const c = (0, WR.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, hd.newError)(`ZIP file not provided: ${(0, hd.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const g = t.updateInfoAndProvider.provider, f = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (h, m) => {
        const b = pd.join(this.downloadedUpdateHelper.cacheDir, f), E = () => (0, Ll.pathExistsSync)(b) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let C = !0;
        E() && (C = await this.differentialDownloadInstaller(c, t, h, g, f)), C && await this.httpExecutor.download(c.url, h, m);
      },
      done: async (h) => {
        if (!t.disableDifferentialDownload)
          try {
            const m = pd.join(this.downloadedUpdateHelper.cacheDir, f);
            await (0, Ll.copyFile)(h.downloadedFile, m);
          } catch (m) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${m.message}`);
          }
        return this.updateDownloaded(c, h);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ll.stat)(i)).size, s = this._logger, u = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${u})`), this.server = (0, qR.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${u})`), this.server.on("close", () => {
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
          const M = E.headers.authorization.split(" ")[1], x = Buffer.from(M, "base64").toString("ascii"), [te, se] = x.split(":");
          if (te !== "autoupdater" || se !== h) {
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
        const $ = (0, MR.createReadStream)(i);
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
fo.MacUpdater = HR;
var ho = {}, Bu = {};
Object.defineProperty(Bu, "__esModule", { value: !0 });
Bu.verifySignature = GR;
const yd = Me, Mp = ss, zR = ls, bd = Ce;
function GR(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, Mp.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, u, c) => {
      var g;
      try {
        if (s != null || c) {
          xl(r, s, c, i), n(null);
          return;
        }
        const f = VR(u);
        if (f.Status === 0) {
          try {
            const E = bd.normalize(f.Path), C = bd.normalize(t);
            if (r.info(`LiteralPath: ${E}. Update Path: ${C}`), E !== C) {
              xl(r, new Error(`LiteralPath of ${E} is different than ${C}`), c, i), n(null);
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
        xl(r, f, null, i), n(null);
        return;
      }
    });
  });
}
function VR(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function xl(e, t, r, n) {
  if (YR()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Mp.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function YR() {
  const e = zR.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ho, "__esModule", { value: !0 });
ho.NsisUpdater = void 0;
const Fa = Me, _d = Ce, XR = pr, QR = Po, wd = Hr, KR = Ne, JR = Wr, ZR = Bu, Ed = ci;
class eT extends XR.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, ZR.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, KR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, u) => {
        const c = n.packageInfo, g = c != null && s != null;
        if (g && t.disableWebInstaller)
          throw (0, Fa.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !g && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (g || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Fa.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const f = await this.verifySignature(i);
        if (f != null)
          throw await u(), (0, Fa.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${f}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (g && await this.differentialDownloadWebPackage(t, c, s, r))
          try {
            await this.httpExecutor.download(new Ed.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (h) {
            try {
              await (0, JR.unlink)(s);
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
      this.spawnLog(_d.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(r, n).catch((s) => {
      const u = s.code;
      this._logger.info(`Cannot run installer: error code: ${u}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), u === "UNKNOWN" || u === "EACCES" ? a() : u === "ENOENT" ? pn.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const a = {
        newUrl: new Ed.URL(r.path),
        oldFile: _d.join(this.downloadedUpdateHelper.cacheDir, Fa.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(wd.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(wd.DOWNLOAD_PROGRESS, s)), await new QR.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
ho.NsisUpdater = eT;
(function(e) {
  var t = Be && Be.__createBinding || (Object.create ? function(A, I, $, M) {
    M === void 0 && (M = $);
    var x = Object.getOwnPropertyDescriptor(I, $);
    (!x || ("get" in x ? !I.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return I[$];
    } }), Object.defineProperty(A, M, x);
  } : function(A, I, $, M) {
    M === void 0 && (M = $), A[M] = I[$];
  }), r = Be && Be.__exportStar || function(A, I) {
    for (var $ in A) $ !== "default" && !Object.prototype.hasOwnProperty.call(I, $) && t(I, A, $);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Wr, i = Ce;
  var a = pr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var s = xr;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var u = Ne;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return u.Provider;
  } });
  var c = so;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var g = lo;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return g.DebUpdater;
  } });
  var f = uo;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return f.PacmanUpdater;
  } });
  var h = co;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return h.RpmUpdater;
  } });
  var m = fo;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return m.MacUpdater;
  } });
  var b = ho;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return b.NsisUpdater;
  } }), r(Hr, e);
  let E;
  function C() {
    if (process.platform === "win32")
      E = new ho.NsisUpdater();
    else if (process.platform === "darwin")
      E = new fo.MacUpdater();
    else {
      E = new so.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(A))
          return E;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const I = (0, n.readFileSync)(A).toString().trim();
        switch (console.info("Found package-type:", I), I) {
          case "deb":
            E = new lo.DebUpdater();
            break;
          case "rpm":
            E = new co.RpmUpdater();
            break;
          case "pacman":
            E = new uo.PacmanUpdater();
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
})(lr);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const tT = Vm(import.meta.url), Ul = zm(tT);
let ae = null;
const Mu = new Bl(), ns = new $g(), Je = new Dg();
let Mi = null, Or = !1;
const qp = qi(Lr.getPath("userData"), "settings.json");
async function rT() {
  try {
    const e = await ou.readFile(qp, "utf-8");
    return JSON.parse(e);
  } catch {
    return {};
  }
}
async function nT(e) {
  try {
    await ou.writeFile(qp, JSON.stringify(e, null, 2), "utf-8");
  } catch {
  }
}
function iT(e, t, r) {
  const n = e.workArea, i = Math.floor(n.x + (n.width - t) / 2), a = Math.floor(n.y + (n.height - r) / 2);
  return { x: i, y: a };
}
Mu.on("status", (e, t) => {
  ae == null || ae.webContents.send("lcu-status", e), e === "connected" && t ? (ae == null || ae.show(), ns.setCreds(t), Je.setCreds(t), Je.start()) : (ns.stop(), Je.stop(), ae == null || ae.hide());
});
ns.on("phase", (e) => {
  ae == null || ae.webContents.send("gameflow-phase", e);
});
Je.on(
  "skins",
  (e) => {
    ae == null || ae.webContents.send("owned-skins", e);
  }
  // ← cast ajouté
);
Je.on("selection", (e) => ae == null ? void 0 : ae.webContents.send("selection", e));
Je.on("icon", (e) => {
  ae == null || ae.webContents.send("summoner-icon", e);
});
function Ir(e) {
  const t = Wm.createFromPath(e("icon.ico"));
  Mi = new Hm(t), Mi.setToolTip("LoL Skin Picker");
  const r = () => {
    ae && (ae.isVisible() ? ae.hide() : (ae.show(), ae.focus()));
  }, n = () => {
    if (!Lr.isPackaged) {
      Kn.showMessageBox({
        type: "info",
        message: "Updates unavailable in dev",
        detail: "Auto-update checks are disabled while running in development."
      });
      return;
    }
    Or = !0, lr.autoUpdater.checkForUpdates().catch((a) => {
      Kn.showErrorBox("Update error", (a == null ? void 0 : a.message) ?? String(a)), Or = !1;
    });
  }, i = () => {
    const s = !!ae && ae.isVisible() ? "Hide App" : "Show App", u = Cd.buildFromTemplate([
      { label: s, click: r },
      { type: "separator" },
      { label: "Check for Updates", click: n },
      { type: "separator" },
      { label: "Quit", role: "quit" }
    ]);
    Mi.setContextMenu(u);
  };
  Mi.on("click", r), Mi.on("double-click", r), i(), Ir.refresh = i;
}
async function oT() {
  const e = (f) => Lr.isPackaged ? qi(process.resourcesPath, f) : qi(Ul, "..", "public", f), t = await rT(), r = Ni.getAllDisplays(), n = 900, i = 645, a = r.find((f) => f.id === t.displayId) ?? Ni.getDisplayNearestPoint(Ni.getCursorScreenPoint()) ?? Ni.getPrimaryDisplay(), { x: s, y: u } = iT(a, n, i);
  ae = new jm({
    x: s,
    // <— on force la position centrée sur l’écran choisi
    y: u,
    width: n,
    height: i,
    resizable: !1,
    maximizable: !1,
    fullscreenable: !1,
    icon: e("icon.ico"),
    show: !1,
    webPreferences: {
      preload: qi(Ul, "preload.mjs"),
      contextIsolation: !0
    }
  }), Cd.setApplicationMenu(null), Ir(e), ae.on("show", () => {
    var f;
    return (f = Ir.refresh) == null ? void 0 : f.call(Ir);
  }), ae.on("hide", () => {
    var f;
    return (f = Ir.refresh) == null ? void 0 : f.call(Ir);
  }), process.env.VITE_DEV_SERVER_URL ? await ae.loadURL(process.env.VITE_DEV_SERVER_URL) : await ae.loadFile(qi(Ul, "..", "dist", "index.html"));
  let c = null;
  const g = () => {
    if (!ae) return;
    const f = Ni.getDisplayMatching(ae.getBounds());
    nT({ displayId: f.id }).catch(() => {
    });
  };
  ae.on("move", () => {
    c && clearTimeout(c), c = setTimeout(g, 300);
  }), ae.on("close", g), ae.on("hide", g), Mu.start();
}
function aT() {
  Lr.isPackaged && (lr.autoUpdater.on("checking-for-update", () => {
    Or && Kn.showMessageBox({ message: "Checking for updates…" });
  }), lr.autoUpdater.on("update-available", (e) => {
    Or && Kn.showMessageBox({
      type: "info",
      message: "Update available",
      detail: `Version ${e.version} is being downloaded in the background.`
    });
  }), lr.autoUpdater.on("update-not-available", () => {
    Or && (Kn.showMessageBox({
      type: "info",
      message: "You're up to date",
      detail: `Current version: ${Lr.getVersion()}`
    }), Or = !1);
  }), lr.autoUpdater.on("download-progress", (e) => {
    console.log(`[Updater] ${Math.round(e.percent)} %`);
  }), lr.autoUpdater.on("update-downloaded", (e) => {
    Or ? (Or = !1, Kn.showMessageBox({
      type: "question",
      buttons: ["Install and Restart", "Later"],
      defaultId: 0,
      cancelId: 1,
      message: "Update ready",
      detail: `Version ${e.version} has been downloaded.`
    }).then(({ response: t }) => {
      t === 0 && lr.autoUpdater.quitAndInstall();
    })) : console.log("[Updater] downloaded – will install on quit");
  }), lr.autoUpdater.checkForUpdatesAndNotify());
}
St.handle("get-lcu-status", () => Mu.status);
St.handle("get-gameflow-phase", () => ns.phase);
St.handle("get-owned-skins", () => Je.skins);
St.handle("get-include-default", () => Je.getIncludeDefault());
St.handle("toggle-include-default", () => Je.toggleIncludeDefault());
St.handle("reroll-skin", () => Je.rerollSkin());
St.handle("reroll-chroma", () => Je.rerollChroma());
St.handle("get-selection", () => Je.getSelection());
St.handle("get-auto-roll", () => Je.getAutoRoll());
St.handle("toggle-auto-roll", () => Je.toggleAutoRoll());
St.handle("get-summoner-icon", () => Je.getProfileIcon());
St.handle("open-external", (e, t) => qm.openExternal(t));
Lr.whenReady().then(() => {
  oT(), aT();
});
Lr.on("window-all-closed", () => process.platform !== "darwin" && Lr.quit());
export {
  Ml as F,
  og as a
};
