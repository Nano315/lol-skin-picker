var Dm = Object.defineProperty;
var hc = (e) => {
  throw TypeError(e);
};
var Nm = (e, t, r) => t in e ? Dm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Ie = (e, t, r) => Nm(e, typeof t != "symbol" ? t + "" : t, r), pc = (e, t, r) => t.has(e) || hc("Cannot " + r);
var Le = (e, t, r) => (pc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Tr = (e, t, r) => t.has(e) ? hc("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ht = (e, t, r, n) => (pc(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import fn, { ipcMain as It, app as ji, BrowserWindow as Fm, Menu as km, nativeImage as Lm, Tray as xm } from "electron";
import { dirname as Um, join as da } from "node:path";
import { format as Bm, fileURLToPath as Mm } from "node:url";
import qm, { promises as jm } from "node:fs";
import { EventEmitter as tu } from "node:events";
import Wi from "node:http";
import Wm from "node:https";
import xn from "node:zlib";
import Vt, { PassThrough as ka, pipeline as Un } from "node:stream";
import { Buffer as ze } from "node:buffer";
import { types as La, deprecate as ts, promisify as Hm } from "node:util";
import { isIP as zm } from "node:net";
import Ur from "fs";
import Gm from "constants";
import co from "stream";
import ru from "util";
import _d from "assert";
import Ce from "path";
import rs from "child_process";
import wd from "events";
import fo from "crypto";
import Ed from "tty";
import ns from "os";
import ai from "url";
import Vm from "string_decoder";
import Sd from "zlib";
import Ym from "http";
const Za = class Za extends tu {
  constructor() {
    super(...arguments);
    Ie(this, "status", "disconnected");
    Ie(this, "creds", null);
    Ie(this, "timer", null);
    Ie(this, "rawCache", "");
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
    for (const r of Za.FILES)
      try {
        return qm.readFileSync(r, "utf8");
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
Ie(Za, "FILES", [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile"
]);
let kl = Za;
function Xm(e) {
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
  for (let d = 1; d < r.length; d++)
    r[d] === "base64" ? i = !0 : r[d] && (s += `;${r[d]}`, r[d].indexOf("charset=") === 0 && (n = r[d].substring(8)));
  !r[0] && !n.length && (s += ";charset=US-ASCII", n = "US-ASCII");
  const u = i ? "base64" : "ascii", c = unescape(e.substring(t + 1)), g = Buffer.from(c, u);
  return g.type = a, g.typeFull = s, g.charset = n, g;
}
var Be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ha = { exports: {} };
/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */
var mc;
function Qm() {
  return mc || (mc = 1, function(e, t) {
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
      function d(o) {
        return new u(o);
      }
      function h(o) {
        return d((l) => l(o));
      }
      function m(o) {
        return g(o);
      }
      function b(o, l, f) {
        return c.call(o, l, f);
      }
      function E(o, l, f) {
        b(b(o, l, f), void 0, a);
      }
      function C(o, l) {
        E(o, l);
      }
      function A(o, l) {
        E(o, void 0, l);
      }
      function $(o, l, f) {
        return b(o, l, f);
      }
      function I(o) {
        b(o, void 0, a);
      }
      let M = (o) => {
        if (typeof queueMicrotask == "function")
          M = queueMicrotask;
        else {
          const l = h(void 0);
          M = (f) => b(l, f);
        }
        return M(o);
      };
      function x(o, l, f) {
        if (typeof o != "function")
          throw new TypeError("Argument is not a function");
        return Function.prototype.apply.call(o, l, f);
      }
      function te(o, l, f) {
        try {
          return h(x(o, l, f));
        } catch (_) {
          return m(_);
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
          const f = this._back;
          let _ = f;
          f._elements.length === ae - 1 && (_ = {
            _elements: [],
            _next: void 0
          }), f._elements.push(l), _ !== f && (this._back = _, f._next = _), ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const l = this._front;
          let f = l;
          const _ = this._cursor;
          let v = _ + 1;
          const P = l._elements, O = P[_];
          return v === ae && (f = l._next, v = 0), --this._size, this._cursor = v, l !== f && (this._front = f), P[_] = void 0, O;
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
          let f = this._cursor, _ = this._front, v = _._elements;
          for (; (f !== v.length || _._next !== void 0) && !(f === v.length && (_ = _._next, v = _._elements, f = 0, v.length === 0)); )
            l(v[f]), ++f;
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const l = this._front, f = this._cursor;
          return l._elements[f];
        }
      }
      const Fe = Symbol("[[AbortSteps]]"), S = Symbol("[[ErrorSteps]]"), re = Symbol("[[CancelSteps]]"), Z = Symbol("[[PullSteps]]"), X = Symbol("[[ReleaseSteps]]");
      function ce(o, l) {
        o._ownerReadableStream = l, l._reader = o, l._state === "readable" ? N(o) : l._state === "closed" ? U(o) : q(o, l._storedError);
      }
      function L(o, l) {
        const f = o._ownerReadableStream;
        return Tt(f, l);
      }
      function D(o) {
        const l = o._ownerReadableStream;
        l._state === "readable" ? V(o, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : ie(o, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), l._readableStreamController[X](), l._reader = void 0, o._ownerReadableStream = void 0;
      }
      function B(o) {
        return new TypeError("Cannot " + o + " a stream using a released reader");
      }
      function N(o) {
        o._closedPromise = d((l, f) => {
          o._closedPromise_resolve = l, o._closedPromise_reject = f;
        });
      }
      function q(o, l) {
        N(o), V(o, l);
      }
      function U(o) {
        N(o), ee(o);
      }
      function V(o, l) {
        o._closedPromise_reject !== void 0 && (I(o._closedPromise), o._closedPromise_reject(l), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0);
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
      function T(o, l, f) {
        if (o === void 0)
          throw new TypeError(`Parameter ${l} is required in '${f}'.`);
      }
      function se(o, l, f) {
        if (o === void 0)
          throw new TypeError(`${l} is required in '${f}'.`);
      }
      function pe(o) {
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
        if (v = we(v), !fe(v))
          throw new TypeError(`${l} is not a finite number`);
        if (v = De(v), v < 0 || v > _)
          throw new TypeError(`${l} is outside the accepted range of 0 to ${_}, inclusive`);
        return !fe(v) || v === 0 ? 0 : v;
      }
      function yt(o, l) {
        if (!Sr(o))
          throw new TypeError(`${l} is not a ReadableStream.`);
      }
      function be(o) {
        return new dt(o);
      }
      function it(o, l) {
        o._reader._readRequests.push(l);
      }
      function qr(o, l, f) {
        const v = o._reader._readRequests.shift();
        f ? v._closeSteps() : v._chunkSteps(l);
      }
      function Qt(o) {
        return o._reader._readRequests.length;
      }
      function pr(o) {
        const l = o._reader;
        return !(l === void 0 || !Ft(l));
      }
      class dt {
        constructor(l) {
          if (T(l, 1, "ReadableStreamDefaultReader"), yt(l, "First parameter"), vr(l))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          ce(this, l), this._readRequests = new Q();
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
          let l, f;
          const _ = d((P, O) => {
            l = P, f = O;
          });
          return jr(this, {
            _chunkSteps: (P) => l({ value: P, done: !1 }),
            _closeSteps: () => l({ value: void 0, done: !0 }),
            _errorSteps: (P) => f(P)
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
          this._ownerReadableStream !== void 0 && As(this);
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
      function jr(o, l) {
        const f = o._ownerReadableStream;
        f._disturbed = !0, f._state === "closed" ? l._closeSteps() : f._state === "errored" ? l._errorSteps(f._storedError) : f._readableStreamController[Z](l);
      }
      function As(o) {
        D(o);
        const l = new TypeError("Reader was released");
        vo(o, l);
      }
      function vo(o, l) {
        const f = o._readRequests;
        o._readRequests = new Q(), f.forEach((_) => {
          _._errorSteps(l);
        });
      }
      function Kt(o) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${o} can only be used on a ReadableStreamDefaultReader`);
      }
      const fi = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class di {
        constructor(l, f) {
          this._ongoingPromise = void 0, this._isFinished = !1, this._reader = l, this._preventCancel = f;
        }
        next() {
          const l = () => this._nextSteps();
          return this._ongoingPromise = this._ongoingPromise ? $(this._ongoingPromise, l, l) : l(), this._ongoingPromise;
        }
        return(l) {
          const f = () => this._returnSteps(l);
          return this._ongoingPromise ? $(this._ongoingPromise, f, f) : f();
        }
        _nextSteps() {
          if (this._isFinished)
            return Promise.resolve({ value: void 0, done: !0 });
          const l = this._reader;
          let f, _;
          const v = d((O, j) => {
            f = O, _ = j;
          });
          return jr(l, {
            _chunkSteps: (O) => {
              this._ongoingPromise = void 0, M(() => f({ value: O, done: !1 }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0, this._isFinished = !0, D(l), f({ value: void 0, done: !0 });
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
          const f = this._reader;
          if (!this._preventCancel) {
            const _ = L(f, l);
            return D(f), $(_, () => ({ value: l, done: !0 }));
          }
          return D(f), h({ value: l, done: !0 });
        }
      }
      const ht = {
        next() {
          return hi(this) ? this._asyncIteratorImpl.next() : m(Ro("next"));
        },
        return(o) {
          return hi(this) ? this._asyncIteratorImpl.return(o) : m(Ro("return"));
        }
      };
      Object.setPrototypeOf(ht, fi);
      function Co(o, l) {
        const f = be(o), _ = new di(f, l), v = Object.create(ht);
        return v._asyncIteratorImpl = _, v;
      }
      function hi(o) {
        if (!i(o) || !Object.prototype.hasOwnProperty.call(o, "_asyncIteratorImpl"))
          return !1;
        try {
          return o._asyncIteratorImpl instanceof di;
        } catch {
          return !1;
        }
      }
      function Ro(o) {
        return new TypeError(`ReadableStreamAsyncIterator.${o} can only be used on a ReadableSteamAsyncIterator`);
      }
      const pi = Number.isNaN || function(o) {
        return o !== o;
      };
      var mr, gn, yn;
      function Wr(o) {
        return o.slice();
      }
      function kt(o, l, f, _, v) {
        new Uint8Array(o).set(new Uint8Array(f, _, v), l);
      }
      let bt = (o) => (typeof o.transfer == "function" ? bt = (l) => l.transfer() : typeof structuredClone == "function" ? bt = (l) => structuredClone(l, { transfer: [l] }) : bt = (l) => l, bt(o)), Lt = (o) => (typeof o.detached == "boolean" ? Lt = (l) => l.detached : Lt = (l) => l.byteLength === 0, Lt(o));
      function To(o, l, f) {
        if (o.slice)
          return o.slice(l, f);
        const _ = f - l, v = new ArrayBuffer(_);
        return kt(v, 0, o, l, _), v;
      }
      function gr(o, l) {
        const f = o[l];
        if (f != null) {
          if (typeof f != "function")
            throw new TypeError(`${String(l)} is not a function`);
          return f;
        }
      }
      function Hr(o) {
        const l = {
          [Symbol.iterator]: () => o.iterator
        }, f = async function* () {
          return yield* l;
        }(), _ = f.next;
        return { iterator: f, nextMethod: _, done: !1 };
      }
      const zr = (yn = (mr = Symbol.asyncIterator) !== null && mr !== void 0 ? mr : (gn = Symbol.for) === null || gn === void 0 ? void 0 : gn.call(Symbol, "Symbol.asyncIterator")) !== null && yn !== void 0 ? yn : "@@asyncIterator";
      function bn(o, l = "sync", f) {
        if (f === void 0)
          if (l === "async") {
            if (f = gr(o, zr), f === void 0) {
              const P = gr(o, Symbol.iterator), O = bn(o, "sync", P);
              return Hr(O);
            }
          } else
            f = gr(o, Symbol.iterator);
        if (f === void 0)
          throw new TypeError("The object is not iterable");
        const _ = x(f, o, []);
        if (!i(_))
          throw new TypeError("The iterator method must return an object");
        const v = _.next;
        return { iterator: _, nextMethod: v, done: !1 };
      }
      function mi(o) {
        const l = x(o.nextMethod, o.iterator, []);
        if (!i(l))
          throw new TypeError("The iterator.next() method must return an object");
        return l;
      }
      function Gr(o) {
        return !!o.done;
      }
      function Ps(o) {
        return o.value;
      }
      function $s(o) {
        return !(typeof o != "number" || pi(o) || o < 0);
      }
      function Ao(o) {
        const l = To(o.buffer, o.byteOffset, o.byteOffset + o.byteLength);
        return new Uint8Array(l);
      }
      function gi(o) {
        const l = o._queue.shift();
        return o._queueTotalSize -= l.size, o._queueTotalSize < 0 && (o._queueTotalSize = 0), l.value;
      }
      function yi(o, l, f) {
        if (!$s(f) || f === 1 / 0)
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        o._queue.push({ value: l, size: f }), o._queueTotalSize += f;
      }
      function Po(o) {
        return o._queue.peek().value;
      }
      function _t(o) {
        o._queue = new Q(), o._queueTotalSize = 0;
      }
      function xt(o) {
        return o === DataView;
      }
      function Is(o) {
        return xt(o.constructor);
      }
      function Os(o) {
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
            throw Ei("view");
          return this._view;
        }
        respond(l) {
          if (!pt(this))
            throw Ei("respond");
          if (T(l, 1, "respond"), l = Ae(l, "First parameter"), this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Lt(this._view.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          Sn(this._associatedReadableByteStreamController, l);
        }
        respondWithNewView(l) {
          if (!pt(this))
            throw Ei("respondWithNewView");
          if (T(l, 1, "respondWithNewView"), !ArrayBuffer.isView(l))
            throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Lt(l.buffer))
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          vn(this._associatedReadableByteStreamController, l);
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
      class vt {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!Zt(this))
            throw Yr("byobRequest");
          return En(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!Zt(this))
            throw Yr("desiredSize");
          return wi(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!Zt(this))
            throw Yr("close");
          if (this._closeRequested)
            throw new TypeError("The stream has already been closed; do not close it again!");
          const l = this._controlledReadableByteStream._state;
          if (l !== "readable")
            throw new TypeError(`The stream (in ${l} state) is not in the readable state and cannot be closed`);
          Vr(this);
        }
        enqueue(l) {
          if (!Zt(this))
            throw Yr("enqueue");
          if (T(l, 1, "enqueue"), !ArrayBuffer.isView(l))
            throw new TypeError("chunk must be an array buffer view");
          if (l.byteLength === 0)
            throw new TypeError("chunk must have non-zero byteLength");
          if (l.buffer.byteLength === 0)
            throw new TypeError("chunk's buffer must have non-zero byteLength");
          if (this._closeRequested)
            throw new TypeError("stream is closed or draining");
          const f = this._controlledReadableByteStream._state;
          if (f !== "readable")
            throw new TypeError(`The stream (in ${f} state) is not in the readable state and cannot be enqueued to`);
          tr(this, l);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(l = void 0) {
          if (!Zt(this))
            throw Yr("error");
          ot(this, l);
        }
        /** @internal */
        [re](l) {
          $o(this), _t(this);
          const f = this._cancelAlgorithm(l);
          return wn(this), f;
        }
        /** @internal */
        [Z](l) {
          const f = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            _r(this, l);
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
          it(f, l), er(this);
        }
        /** @internal */
        [X]() {
          if (this._pendingPullIntos.length > 0) {
            const l = this._pendingPullIntos.peek();
            l.readerType = "none", this._pendingPullIntos = new Q(), this._pendingPullIntos.push(l);
          }
        }
      }
      Object.defineProperties(vt.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        byobRequest: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(vt.prototype.close, "close"), s(vt.prototype.enqueue, "enqueue"), s(vt.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(vt.prototype, Symbol.toStringTag, {
        value: "ReadableByteStreamController",
        configurable: !0
      });
      function Zt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledReadableByteStream") ? !1 : o instanceof vt;
      }
      function pt(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_associatedReadableByteStreamController") ? !1 : o instanceof Jt;
      }
      function er(o) {
        if (!ks(o))
          return;
        if (o._pulling) {
          o._pullAgain = !0;
          return;
        }
        o._pulling = !0;
        const f = o._pullAlgorithm();
        E(f, () => (o._pulling = !1, o._pullAgain && (o._pullAgain = !1, er(o)), null), (_) => (ot(o, _), null));
      }
      function $o(o) {
        _i(o), o._pendingPullIntos = new Q();
      }
      function bi(o, l) {
        let f = !1;
        o._state === "closed" && (f = !0);
        const _ = Io(l);
        l.readerType === "default" ? qr(o, _, f) : Mt(o, _, f);
      }
      function Io(o) {
        const l = o.bytesFilled, f = o.elementSize;
        return new o.viewConstructor(o.buffer, o.byteOffset, l / f);
      }
      function _n(o, l, f, _) {
        o._queue.push({ buffer: l, byteOffset: f, byteLength: _ }), o._queueTotalSize += _;
      }
      function Ut(o, l, f, _) {
        let v;
        try {
          v = To(l, f, f + _);
        } catch (P) {
          throw ot(o, P), P;
        }
        _n(o, v, 0, _);
      }
      function Oo(o, l) {
        l.bytesFilled > 0 && Ut(o, l.buffer, l.byteOffset, l.bytesFilled), br(o);
      }
      function Do(o, l) {
        const f = Math.min(o._queueTotalSize, l.byteLength - l.bytesFilled), _ = l.bytesFilled + f;
        let v = f, P = !1;
        const O = _ % l.elementSize, j = _ - O;
        j >= l.minimumFill && (v = j - l.bytesFilled, P = !0);
        const J = o._queue;
        for (; v > 0; ) {
          const z = J.peek(), ne = Math.min(v, z.byteLength), oe = l.byteOffset + l.bytesFilled;
          kt(l.buffer, oe, z.buffer, z.byteOffset, ne), z.byteLength === ne ? J.shift() : (z.byteOffset += ne, z.byteLength -= ne), o._queueTotalSize -= ne, No(o, ne, l), v -= ne;
        }
        return P;
      }
      function No(o, l, f) {
        f.bytesFilled += l;
      }
      function Fo(o) {
        o._queueTotalSize === 0 && o._closeRequested ? (wn(o), Pi(o._controlledReadableByteStream)) : er(o);
      }
      function _i(o) {
        o._byobRequest !== null && (o._byobRequest._associatedReadableByteStreamController = void 0, o._byobRequest._view = null, o._byobRequest = null);
      }
      function yr(o) {
        for (; o._pendingPullIntos.length > 0; ) {
          if (o._queueTotalSize === 0)
            return;
          const l = o._pendingPullIntos.peek();
          Do(o, l) && (br(o), bi(o._controlledReadableByteStream, l));
        }
      }
      function Ds(o) {
        const l = o._controlledReadableByteStream._reader;
        for (; l._readRequests.length > 0; ) {
          if (o._queueTotalSize === 0)
            return;
          const f = l._readRequests.shift();
          _r(o, f);
        }
      }
      function Ns(o, l, f, _) {
        const v = o._controlledReadableByteStream, P = l.constructor, O = Os(P), { byteOffset: j, byteLength: J } = l, z = f * O;
        let ne;
        try {
          ne = bt(l.buffer);
        } catch (me) {
          _._errorSteps(me);
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
          o._pendingPullIntos.push(oe), Mo(v, _);
          return;
        }
        if (v._state === "closed") {
          const me = new P(oe.buffer, oe.byteOffset, 0);
          _._closeSteps(me);
          return;
        }
        if (o._queueTotalSize > 0) {
          if (Do(o, oe)) {
            const me = Io(oe);
            Fo(o), _._chunkSteps(me);
            return;
          }
          if (o._closeRequested) {
            const me = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ot(o, me), _._errorSteps(me);
            return;
          }
        }
        o._pendingPullIntos.push(oe), Mo(v, _), er(o);
      }
      function Bt(o, l) {
        l.readerType === "none" && br(o);
        const f = o._controlledReadableByteStream;
        if (Si(f))
          for (; qo(f) > 0; ) {
            const _ = br(o);
            bi(f, _);
          }
      }
      function Fs(o, l, f) {
        if (No(o, l, f), f.readerType === "none") {
          Oo(o, f), yr(o);
          return;
        }
        if (f.bytesFilled < f.minimumFill)
          return;
        br(o);
        const _ = f.bytesFilled % f.elementSize;
        if (_ > 0) {
          const v = f.byteOffset + f.bytesFilled;
          Ut(o, f.buffer, v - _, _);
        }
        f.bytesFilled -= _, bi(o._controlledReadableByteStream, f), yr(o);
      }
      function ko(o, l) {
        const f = o._pendingPullIntos.peek();
        _i(o), o._controlledReadableByteStream._state === "closed" ? Bt(o, f) : Fs(o, l, f), er(o);
      }
      function br(o) {
        return o._pendingPullIntos.shift();
      }
      function ks(o) {
        const l = o._controlledReadableByteStream;
        return l._state !== "readable" || o._closeRequested || !o._started ? !1 : !!(pr(l) && Qt(l) > 0 || Si(l) && qo(l) > 0 || wi(o) > 0);
      }
      function wn(o) {
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
            const f = o._pendingPullIntos.peek();
            if (f.bytesFilled % f.elementSize !== 0) {
              const _ = new TypeError("Insufficient bytes to fill elements in the given buffer");
              throw ot(o, _), _;
            }
          }
          wn(o), Pi(l);
        }
      }
      function tr(o, l) {
        const f = o._controlledReadableByteStream;
        if (o._closeRequested || f._state !== "readable")
          return;
        const { buffer: _, byteOffset: v, byteLength: P } = l;
        if (Lt(_))
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const O = bt(_);
        if (o._pendingPullIntos.length > 0) {
          const j = o._pendingPullIntos.peek();
          if (Lt(j.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          _i(o), j.buffer = bt(j.buffer), j.readerType === "none" && Oo(o, j);
        }
        if (pr(f))
          if (Ds(o), Qt(f) === 0)
            _n(o, O, v, P);
          else {
            o._pendingPullIntos.length > 0 && br(o);
            const j = new Uint8Array(O, v, P);
            qr(f, j, !1);
          }
        else Si(f) ? (_n(o, O, v, P), yr(o)) : _n(o, O, v, P);
        er(o);
      }
      function ot(o, l) {
        const f = o._controlledReadableByteStream;
        f._state === "readable" && ($o(o), _t(o), wn(o), Zu(f, l));
      }
      function _r(o, l) {
        const f = o._queue.shift();
        o._queueTotalSize -= f.byteLength, Fo(o);
        const _ = new Uint8Array(f.buffer, f.byteOffset, f.byteLength);
        l._chunkSteps(_);
      }
      function En(o) {
        if (o._byobRequest === null && o._pendingPullIntos.length > 0) {
          const l = o._pendingPullIntos.peek(), f = new Uint8Array(l.buffer, l.byteOffset + l.bytesFilled, l.byteLength - l.bytesFilled), _ = Object.create(Jt.prototype);
          xo(_, o, f), o._byobRequest = _;
        }
        return o._byobRequest;
      }
      function wi(o) {
        const l = o._controlledReadableByteStream._state;
        return l === "errored" ? null : l === "closed" ? 0 : o._strategyHWM - o._queueTotalSize;
      }
      function Sn(o, l) {
        const f = o._pendingPullIntos.peek();
        if (o._controlledReadableByteStream._state === "closed") {
          if (l !== 0)
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
        } else {
          if (l === 0)
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          if (f.bytesFilled + l > f.byteLength)
            throw new RangeError("bytesWritten out of range");
        }
        f.buffer = bt(f.buffer), ko(o, l);
      }
      function vn(o, l) {
        const f = o._pendingPullIntos.peek();
        if (o._controlledReadableByteStream._state === "closed") {
          if (l.byteLength !== 0)
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
        } else if (l.byteLength === 0)
          throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
        if (f.byteOffset + f.bytesFilled !== l.byteOffset)
          throw new RangeError("The region specified by view does not match byobRequest");
        if (f.bufferByteLength !== l.buffer.byteLength)
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        if (f.bytesFilled + l.byteLength > f.byteLength)
          throw new RangeError("The region specified by view is larger than byobRequest");
        const v = l.byteLength;
        f.buffer = bt(l.buffer), ko(o, v);
      }
      function Lo(o, l, f, _, v, P, O) {
        l._controlledReadableByteStream = o, l._pullAgain = !1, l._pulling = !1, l._byobRequest = null, l._queue = l._queueTotalSize = void 0, _t(l), l._closeRequested = !1, l._started = !1, l._strategyHWM = P, l._pullAlgorithm = _, l._cancelAlgorithm = v, l._autoAllocateChunkSize = O, l._pendingPullIntos = new Q(), o._readableStreamController = l;
        const j = f();
        E(h(j), () => (l._started = !0, er(l), null), (J) => (ot(l, J), null));
      }
      function Ls(o, l, f) {
        const _ = Object.create(vt.prototype);
        let v, P, O;
        l.start !== void 0 ? v = () => l.start(_) : v = () => {
        }, l.pull !== void 0 ? P = () => l.pull(_) : P = () => h(void 0), l.cancel !== void 0 ? O = (J) => l.cancel(J) : O = () => h(void 0);
        const j = l.autoAllocateChunkSize;
        if (j === 0)
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        Lo(o, _, v, P, O, f, j);
      }
      function xo(o, l, f) {
        o._associatedReadableByteStreamController = l, o._view = f;
      }
      function Ei(o) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${o} can only be used on a ReadableStreamBYOBRequest`);
      }
      function Yr(o) {
        return new TypeError(`ReadableByteStreamController.prototype.${o} can only be used on a ReadableByteStreamController`);
      }
      function Uo(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.mode;
        return {
          mode: f === void 0 ? void 0 : Cn(f, `${l} has member 'mode' that`)
        };
      }
      function Cn(o, l) {
        if (o = `${o}`, o !== "byob")
          throw new TypeError(`${l} '${o}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return o;
      }
      function wr(o, l) {
        var f;
        Re(o, l);
        const _ = (f = o == null ? void 0 : o.min) !== null && f !== void 0 ? f : 1;
        return {
          min: Ae(_, `${l} has member 'min' that`)
        };
      }
      function Bo(o) {
        return new qt(o);
      }
      function Mo(o, l) {
        o._reader._readIntoRequests.push(l);
      }
      function Mt(o, l, f) {
        const v = o._reader._readIntoRequests.shift();
        f ? v._closeSteps(l) : v._chunkSteps(l);
      }
      function qo(o) {
        return o._reader._readIntoRequests.length;
      }
      function Si(o) {
        const l = o._reader;
        return !(l === void 0 || !rr(l));
      }
      class qt {
        constructor(l) {
          if (T(l, 1, "ReadableStreamBYOBReader"), yt(l, "First parameter"), vr(l))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!Zt(l._readableStreamController))
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          ce(this, l), this._readIntoRequests = new Q();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return rr(this) ? this._closedPromise : m(Rn("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(l = void 0) {
          return rr(this) ? this._ownerReadableStream === void 0 ? m(B("cancel")) : L(this, l) : m(Rn("cancel"));
        }
        read(l, f = {}) {
          if (!rr(this))
            return m(Rn("read"));
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
            _ = wr(f, "options");
          } catch (z) {
            return m(z);
          }
          const v = _.min;
          if (v === 0)
            return m(new TypeError("options.min must be greater than 0"));
          if (Is(l)) {
            if (v > l.byteLength)
              return m(new RangeError("options.min must be less than or equal to view's byteLength"));
          } else if (v > l.length)
            return m(new RangeError("options.min must be less than or equal to view's length"));
          if (this._ownerReadableStream === void 0)
            return m(B("read from"));
          let P, O;
          const j = d((z, ne) => {
            P = z, O = ne;
          });
          return jo(this, l, v, {
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
            throw Rn("releaseLock");
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
      function jo(o, l, f, _) {
        const v = o._ownerReadableStream;
        v._disturbed = !0, v._state === "errored" ? _._errorSteps(v._storedError) : Ns(v._readableStreamController, l, f, _);
      }
      function nr(o) {
        D(o);
        const l = new TypeError("Reader was released");
        vi(o, l);
      }
      function vi(o, l) {
        const f = o._readIntoRequests;
        o._readIntoRequests = new Q(), f.forEach((_) => {
          _._errorSteps(l);
        });
      }
      function Rn(o) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${o} can only be used on a ReadableStreamBYOBReader`);
      }
      function jt(o, l) {
        const { highWaterMark: f } = o;
        if (f === void 0)
          return l;
        if (pi(f) || f < 0)
          throw new RangeError("Invalid highWaterMark");
        return f;
      }
      function Tn(o) {
        const { size: l } = o;
        return l || (() => 1);
      }
      function Er(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.highWaterMark, _ = o == null ? void 0 : o.size;
        return {
          highWaterMark: f === void 0 ? void 0 : pe(f),
          size: _ === void 0 ? void 0 : xs(_, `${l} has member 'size' that`)
        };
      }
      function xs(o, l) {
        return y(o, l), (f) => pe(o(f));
      }
      function Wo(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.abort, _ = o == null ? void 0 : o.close, v = o == null ? void 0 : o.start, P = o == null ? void 0 : o.type, O = o == null ? void 0 : o.write;
        return {
          abort: f === void 0 ? void 0 : Ho(f, o, `${l} has member 'abort' that`),
          close: _ === void 0 ? void 0 : zo(_, o, `${l} has member 'close' that`),
          start: v === void 0 ? void 0 : Xr(v, o, `${l} has member 'start' that`),
          write: O === void 0 ? void 0 : Go(O, o, `${l} has member 'write' that`),
          type: P
        };
      }
      function Ho(o, l, f) {
        return y(o, f), (_) => te(o, l, [_]);
      }
      function zo(o, l, f) {
        return y(o, f), () => te(o, l, []);
      }
      function Xr(o, l, f) {
        return y(o, f), (_) => x(o, l, [_]);
      }
      function Go(o, l, f) {
        return y(o, f), (_, v) => te(o, l, [_, v]);
      }
      function Vo(o, l) {
        if (!K(o))
          throw new TypeError(`${l} is not a WritableStream.`);
      }
      function Us(o) {
        if (typeof o != "object" || o === null)
          return !1;
        try {
          return typeof o.aborted == "boolean";
        } catch {
          return !1;
        }
      }
      const Bs = typeof AbortController == "function";
      function w() {
        if (Bs)
          return new AbortController();
      }
      class R {
        constructor(l = {}, f = {}) {
          l === void 0 ? l = null : F(l, "First parameter");
          const _ = Er(f, "Second parameter"), v = Wo(l, "First parameter");
          if (he(this), v.type !== void 0)
            throw new RangeError("Invalid type is specified");
          const O = Tn(_), j = jt(_, 1);
          Bp(this, v, j, O);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!K(this))
            throw Jo("locked");
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
          return K(this) ? de(this) ? m(new TypeError("Cannot abort a stream that already has a writer")) : Se(this, l) : m(Jo("abort"));
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
          return K(this) ? de(this) ? m(new TypeError("Cannot close a stream that already has a writer")) : ke(this) ? m(new TypeError("Cannot close an already-closing stream")) : Pe(this) : m(Jo("close"));
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
            throw Jo("getWriter");
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
      function W(o, l, f, _, v = 1, P = () => 1) {
        const O = Object.create(R.prototype);
        he(O);
        const j = Object.create($n.prototype);
        return qu(O, j, o, l, f, _, v, P), O;
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
      function Se(o, l) {
        var f;
        if (o._state === "closed" || o._state === "errored")
          return h(void 0);
        o._writableStreamController._abortReason = l, (f = o._writableStreamController._abortController) === null || f === void 0 || f.abort(l);
        const _ = o._state;
        if (_ === "closed" || _ === "errored")
          return h(void 0);
        if (o._pendingAbortRequest !== void 0)
          return o._pendingAbortRequest._promise;
        let v = !1;
        _ === "erroring" && (v = !0, l = void 0);
        const P = d((O, j) => {
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
        const f = d((v, P) => {
          const O = {
            _resolve: v,
            _reject: P
          };
          o._closeRequest = O;
        }), _ = o._writer;
        return _ !== void 0 && o._backpressure && l === "writable" && Gs(_), Mp(o._writableStreamController), f;
      }
      function Ee(o) {
        return d((f, _) => {
          const v = {
            _resolve: f,
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
        $e(o);
      }
      function Ye(o, l) {
        const f = o._writableStreamController;
        o._state = "erroring", o._storedError = l;
        const _ = o._writer;
        _ !== void 0 && xu(_, l), !Yo(o) && f._started && $e(o);
      }
      function $e(o) {
        o._state = "errored", o._writableStreamController[S]();
        const l = o._storedError;
        if (o._writeRequests.forEach((v) => {
          v._reject(l);
        }), o._writeRequests = new Q(), o._pendingAbortRequest === void 0) {
          Xo(o);
          return;
        }
        const f = o._pendingAbortRequest;
        if (o._pendingAbortRequest = void 0, f._wasAlreadyErroring) {
          f._reject(l), Xo(o);
          return;
        }
        const _ = o._writableStreamController[Fe](f._reason);
        E(_, () => (f._resolve(), Xo(o), null), (v) => (f._reject(v), Xo(o), null));
      }
      function at(o) {
        o._inFlightWriteRequest._resolve(void 0), o._inFlightWriteRequest = void 0;
      }
      function st(o, l) {
        o._inFlightWriteRequest._reject(l), o._inFlightWriteRequest = void 0, qe(o, l);
      }
      function Wt(o) {
        o._inFlightCloseRequest._resolve(void 0), o._inFlightCloseRequest = void 0, o._state === "erroring" && (o._storedError = void 0, o._pendingAbortRequest !== void 0 && (o._pendingAbortRequest._resolve(), o._pendingAbortRequest = void 0)), o._state = "closed";
        const f = o._writer;
        f !== void 0 && zu(f);
      }
      function Ct(o, l) {
        o._inFlightCloseRequest._reject(l), o._inFlightCloseRequest = void 0, o._pendingAbortRequest !== void 0 && (o._pendingAbortRequest._reject(l), o._pendingAbortRequest = void 0), qe(o, l);
      }
      function ke(o) {
        return !(o._closeRequest === void 0 && o._inFlightCloseRequest === void 0);
      }
      function Yo(o) {
        return !(o._inFlightWriteRequest === void 0 && o._inFlightCloseRequest === void 0);
      }
      function An(o) {
        o._inFlightCloseRequest = o._closeRequest, o._closeRequest = void 0;
      }
      function Pn(o) {
        o._inFlightWriteRequest = o._writeRequests.shift();
      }
      function Xo(o) {
        o._closeRequest !== void 0 && (o._closeRequest._reject(o._storedError), o._closeRequest = void 0);
        const l = o._writer;
        l !== void 0 && Hs(l, o._storedError);
      }
      function Ms(o, l) {
        const f = o._writer;
        f !== void 0 && l !== o._backpressure && (l ? Vp(f) : Gs(f)), o._backpressure = l;
      }
      class ir {
        constructor(l) {
          if (T(l, 1, "WritableStreamDefaultWriter"), Vo(l, "First parameter"), de(l))
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = l, l._writer = this;
          const f = l._state;
          if (f === "writable")
            !ke(l) && l._backpressure ? ea(this) : Gu(this), Zo(this);
          else if (f === "erroring")
            zs(this, l._storedError), Zo(this);
          else if (f === "closed")
            Gu(this), zp(this);
          else {
            const _ = l._storedError;
            zs(this, _), Hu(this, _);
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
            throw Ri("desiredSize");
          return Up(this);
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
          return Qr(this) ? this._ownerWritableStream === void 0 ? m(Ri("abort")) : kp(this, l) : m(Kr("abort"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!Qr(this))
            return m(Kr("close"));
          const l = this._ownerWritableStream;
          return l === void 0 ? m(Ri("close")) : ke(l) ? m(new TypeError("Cannot close an already-closing stream")) : Lu(this);
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
          this._ownerWritableStream !== void 0 && Uu(this);
        }
        write(l = void 0) {
          return Qr(this) ? this._ownerWritableStream === void 0 ? m(Ri("write to")) : Bu(this, l) : m(Kr("write"));
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
      function Qr(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_ownerWritableStream") ? !1 : o instanceof ir;
      }
      function kp(o, l) {
        const f = o._ownerWritableStream;
        return Se(f, l);
      }
      function Lu(o) {
        const l = o._ownerWritableStream;
        return Pe(l);
      }
      function Lp(o) {
        const l = o._ownerWritableStream, f = l._state;
        return ke(l) || f === "closed" ? h(void 0) : f === "errored" ? m(l._storedError) : Lu(o);
      }
      function xp(o, l) {
        o._closedPromiseState === "pending" ? Hs(o, l) : Gp(o, l);
      }
      function xu(o, l) {
        o._readyPromiseState === "pending" ? Vu(o, l) : Yp(o, l);
      }
      function Up(o) {
        const l = o._ownerWritableStream, f = l._state;
        return f === "errored" || f === "erroring" ? null : f === "closed" ? 0 : ju(l._writableStreamController);
      }
      function Uu(o) {
        const l = o._ownerWritableStream, f = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        xu(o, f), xp(o, f), l._writer = void 0, o._ownerWritableStream = void 0;
      }
      function Bu(o, l) {
        const f = o._ownerWritableStream, _ = f._writableStreamController, v = qp(_, l);
        if (f !== o._ownerWritableStream)
          return m(Ri("write to"));
        const P = f._state;
        if (P === "errored")
          return m(f._storedError);
        if (ke(f) || P === "closed")
          return m(new TypeError("The stream is closing or closed and cannot be written to"));
        if (P === "erroring")
          return m(f._storedError);
        const O = Ee(f);
        return jp(_, l, v), O;
      }
      const Mu = {};
      class $n {
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
          if (!qs(this))
            throw Ws("abortReason");
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!qs(this))
            throw Ws("signal");
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
          if (!qs(this))
            throw Ws("error");
          this._controlledWritableStream._state === "writable" && Wu(this, l);
        }
        /** @internal */
        [Fe](l) {
          const f = this._abortAlgorithm(l);
          return Qo(this), f;
        }
        /** @internal */
        [S]() {
          _t(this);
        }
      }
      Object.defineProperties($n.prototype, {
        abortReason: { enumerable: !0 },
        signal: { enumerable: !0 },
        error: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty($n.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultController",
        configurable: !0
      });
      function qs(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledWritableStream") ? !1 : o instanceof $n;
      }
      function qu(o, l, f, _, v, P, O, j) {
        l._controlledWritableStream = o, o._writableStreamController = l, l._queue = void 0, l._queueTotalSize = void 0, _t(l), l._abortReason = void 0, l._abortController = w(), l._started = !1, l._strategySizeAlgorithm = j, l._strategyHWM = O, l._writeAlgorithm = _, l._closeAlgorithm = v, l._abortAlgorithm = P;
        const J = js(l);
        Ms(o, J);
        const z = f(), ne = h(z);
        E(ne, () => (l._started = !0, Ko(l), null), (oe) => (l._started = !0, qe(o, oe), null));
      }
      function Bp(o, l, f, _) {
        const v = Object.create($n.prototype);
        let P, O, j, J;
        l.start !== void 0 ? P = () => l.start(v) : P = () => {
        }, l.write !== void 0 ? O = (z) => l.write(z, v) : O = () => h(void 0), l.close !== void 0 ? j = () => l.close() : j = () => h(void 0), l.abort !== void 0 ? J = (z) => l.abort(z) : J = () => h(void 0), qu(o, v, P, O, j, J, f, _);
      }
      function Qo(o) {
        o._writeAlgorithm = void 0, o._closeAlgorithm = void 0, o._abortAlgorithm = void 0, o._strategySizeAlgorithm = void 0;
      }
      function Mp(o) {
        yi(o, Mu, 0), Ko(o);
      }
      function qp(o, l) {
        try {
          return o._strategySizeAlgorithm(l);
        } catch (f) {
          return Ci(o, f), 1;
        }
      }
      function ju(o) {
        return o._strategyHWM - o._queueTotalSize;
      }
      function jp(o, l, f) {
        try {
          yi(o, l, f);
        } catch (v) {
          Ci(o, v);
          return;
        }
        const _ = o._controlledWritableStream;
        if (!ke(_) && _._state === "writable") {
          const v = js(o);
          Ms(_, v);
        }
        Ko(o);
      }
      function Ko(o) {
        const l = o._controlledWritableStream;
        if (!o._started || l._inFlightWriteRequest !== void 0)
          return;
        if (l._state === "erroring") {
          $e(l);
          return;
        }
        if (o._queue.length === 0)
          return;
        const _ = Po(o);
        _ === Mu ? Wp(o) : Hp(o, _);
      }
      function Ci(o, l) {
        o._controlledWritableStream._state === "writable" && Wu(o, l);
      }
      function Wp(o) {
        const l = o._controlledWritableStream;
        An(l), gi(o);
        const f = o._closeAlgorithm();
        Qo(o), E(f, () => (Wt(l), null), (_) => (Ct(l, _), null));
      }
      function Hp(o, l) {
        const f = o._controlledWritableStream;
        Pn(f);
        const _ = o._writeAlgorithm(l);
        E(_, () => {
          at(f);
          const v = f._state;
          if (gi(o), !ke(f) && v === "writable") {
            const P = js(o);
            Ms(f, P);
          }
          return Ko(o), null;
        }, (v) => (f._state === "writable" && Qo(o), st(f, v), null));
      }
      function js(o) {
        return ju(o) <= 0;
      }
      function Wu(o, l) {
        const f = o._controlledWritableStream;
        Qo(o), Ye(f, l);
      }
      function Jo(o) {
        return new TypeError(`WritableStream.prototype.${o} can only be used on a WritableStream`);
      }
      function Ws(o) {
        return new TypeError(`WritableStreamDefaultController.prototype.${o} can only be used on a WritableStreamDefaultController`);
      }
      function Kr(o) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${o} can only be used on a WritableStreamDefaultWriter`);
      }
      function Ri(o) {
        return new TypeError("Cannot " + o + " a stream using a released writer");
      }
      function Zo(o) {
        o._closedPromise = d((l, f) => {
          o._closedPromise_resolve = l, o._closedPromise_reject = f, o._closedPromiseState = "pending";
        });
      }
      function Hu(o, l) {
        Zo(o), Hs(o, l);
      }
      function zp(o) {
        Zo(o), zu(o);
      }
      function Hs(o, l) {
        o._closedPromise_reject !== void 0 && (I(o._closedPromise), o._closedPromise_reject(l), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0, o._closedPromiseState = "rejected");
      }
      function Gp(o, l) {
        Hu(o, l);
      }
      function zu(o) {
        o._closedPromise_resolve !== void 0 && (o._closedPromise_resolve(void 0), o._closedPromise_resolve = void 0, o._closedPromise_reject = void 0, o._closedPromiseState = "resolved");
      }
      function ea(o) {
        o._readyPromise = d((l, f) => {
          o._readyPromise_resolve = l, o._readyPromise_reject = f;
        }), o._readyPromiseState = "pending";
      }
      function zs(o, l) {
        ea(o), Vu(o, l);
      }
      function Gu(o) {
        ea(o), Gs(o);
      }
      function Vu(o, l) {
        o._readyPromise_reject !== void 0 && (I(o._readyPromise), o._readyPromise_reject(l), o._readyPromise_resolve = void 0, o._readyPromise_reject = void 0, o._readyPromiseState = "rejected");
      }
      function Vp(o) {
        ea(o);
      }
      function Yp(o, l) {
        zs(o, l);
      }
      function Gs(o) {
        o._readyPromise_resolve !== void 0 && (o._readyPromise_resolve(void 0), o._readyPromise_resolve = void 0, o._readyPromise_reject = void 0, o._readyPromiseState = "fulfilled");
      }
      function Xp() {
        if (typeof globalThis < "u")
          return globalThis;
        if (typeof self < "u")
          return self;
        if (typeof Be < "u")
          return Be;
      }
      const Vs = Xp();
      function Qp(o) {
        if (!(typeof o == "function" || typeof o == "object") || o.name !== "DOMException")
          return !1;
        try {
          return new o(), !0;
        } catch {
          return !1;
        }
      }
      function Kp() {
        const o = Vs == null ? void 0 : Vs.DOMException;
        return Qp(o) ? o : void 0;
      }
      function Jp() {
        const o = function(f, _) {
          this.message = f || "", this.name = _ || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        };
        return s(o, "DOMException"), o.prototype = Object.create(Error.prototype), Object.defineProperty(o.prototype, "constructor", { value: o, writable: !0, configurable: !0 }), o;
      }
      const Zp = Kp() || Jp();
      function Yu(o, l, f, _, v, P) {
        const O = be(o), j = k(l);
        o._disturbed = !0;
        let J = !1, z = h(void 0);
        return d((ne, oe) => {
          let me;
          if (P !== void 0) {
            if (me = () => {
              const G = P.reason !== void 0 ? P.reason : new Zp("Aborted", "AbortError"), le = [];
              _ || le.push(() => l._state === "writable" ? Se(l, G) : h(void 0)), v || le.push(() => o._state === "readable" ? Tt(o, G) : h(void 0)), lt(() => Promise.all(le.map((_e) => _e())), !0, G);
            }, P.aborted) {
              me();
              return;
            }
            P.addEventListener("abort", me);
          }
          function At() {
            return d((G, le) => {
              function _e(mt) {
                mt ? G() : b(Nn(), _e, le);
              }
              _e(!1);
            });
          }
          function Nn() {
            return J ? h(!0) : b(j._readyPromise, () => d((G, le) => {
              jr(O, {
                _chunkSteps: (_e) => {
                  z = b(Bu(j, _e), void 0, n), G(!1);
                },
                _closeSteps: () => G(!0),
                _errorSteps: le
              });
            }));
          }
          if (ar(o, O._closedPromise, (G) => (_ ? wt(!0, G) : lt(() => Se(l, G), !0, G), null)), ar(l, j._closedPromise, (G) => (v ? wt(!0, G) : lt(() => Tt(o, G), !0, G), null)), Xe(o, O._closedPromise, () => (f ? wt() : lt(() => Lp(j)), null)), ke(l) || l._state === "closed") {
            const G = new TypeError("the destination writable stream closed before all data could be piped to it");
            v ? wt(!0, G) : lt(() => Tt(o, G), !0, G);
          }
          I(At());
          function Rr() {
            const G = z;
            return b(z, () => G !== z ? Rr() : void 0);
          }
          function ar(G, le, _e) {
            G._state === "errored" ? _e(G._storedError) : A(le, _e);
          }
          function Xe(G, le, _e) {
            G._state === "closed" ? _e() : C(le, _e);
          }
          function lt(G, le, _e) {
            if (J)
              return;
            J = !0, l._state === "writable" && !ke(l) ? C(Rr(), mt) : mt();
            function mt() {
              return E(G(), () => sr(le, _e), (Fn) => sr(!0, Fn)), null;
            }
          }
          function wt(G, le) {
            J || (J = !0, l._state === "writable" && !ke(l) ? C(Rr(), () => sr(G, le)) : sr(G, le));
          }
          function sr(G, le) {
            return Uu(j), D(O), P !== void 0 && P.removeEventListener("abort", me), G ? oe(le) : ne(void 0), null;
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
          if (!ta(this))
            throw na("desiredSize");
          return Ys(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!ta(this))
            throw na("close");
          if (!On(this))
            throw new TypeError("The stream is not in a state that permits close");
          Jr(this);
        }
        enqueue(l = void 0) {
          if (!ta(this))
            throw na("enqueue");
          if (!On(this))
            throw new TypeError("The stream is not in a state that permits enqueue");
          return In(this, l);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(l = void 0) {
          if (!ta(this))
            throw na("error");
          Rt(this, l);
        }
        /** @internal */
        [re](l) {
          _t(this);
          const f = this._cancelAlgorithm(l);
          return ra(this), f;
        }
        /** @internal */
        [Z](l) {
          const f = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const _ = gi(this);
            this._closeRequested && this._queue.length === 0 ? (ra(this), Pi(f)) : Ti(this), l._chunkSteps(_);
          } else
            it(f, l), Ti(this);
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
      function ta(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledReadableStream") ? !1 : o instanceof or;
      }
      function Ti(o) {
        if (!Xu(o))
          return;
        if (o._pulling) {
          o._pullAgain = !0;
          return;
        }
        o._pulling = !0;
        const f = o._pullAlgorithm();
        E(f, () => (o._pulling = !1, o._pullAgain && (o._pullAgain = !1, Ti(o)), null), (_) => (Rt(o, _), null));
      }
      function Xu(o) {
        const l = o._controlledReadableStream;
        return !On(o) || !o._started ? !1 : !!(vr(l) && Qt(l) > 0 || Ys(o) > 0);
      }
      function ra(o) {
        o._pullAlgorithm = void 0, o._cancelAlgorithm = void 0, o._strategySizeAlgorithm = void 0;
      }
      function Jr(o) {
        if (!On(o))
          return;
        const l = o._controlledReadableStream;
        o._closeRequested = !0, o._queue.length === 0 && (ra(o), Pi(l));
      }
      function In(o, l) {
        if (!On(o))
          return;
        const f = o._controlledReadableStream;
        if (vr(f) && Qt(f) > 0)
          qr(f, l, !1);
        else {
          let _;
          try {
            _ = o._strategySizeAlgorithm(l);
          } catch (v) {
            throw Rt(o, v), v;
          }
          try {
            yi(o, l, _);
          } catch (v) {
            throw Rt(o, v), v;
          }
        }
        Ti(o);
      }
      function Rt(o, l) {
        const f = o._controlledReadableStream;
        f._state === "readable" && (_t(o), ra(o), Zu(f, l));
      }
      function Ys(o) {
        const l = o._controlledReadableStream._state;
        return l === "errored" ? null : l === "closed" ? 0 : o._strategyHWM - o._queueTotalSize;
      }
      function em(o) {
        return !Xu(o);
      }
      function On(o) {
        const l = o._controlledReadableStream._state;
        return !o._closeRequested && l === "readable";
      }
      function Qu(o, l, f, _, v, P, O) {
        l._controlledReadableStream = o, l._queue = void 0, l._queueTotalSize = void 0, _t(l), l._started = !1, l._closeRequested = !1, l._pullAgain = !1, l._pulling = !1, l._strategySizeAlgorithm = O, l._strategyHWM = P, l._pullAlgorithm = _, l._cancelAlgorithm = v, o._readableStreamController = l;
        const j = f();
        E(h(j), () => (l._started = !0, Ti(l), null), (J) => (Rt(l, J), null));
      }
      function tm(o, l, f, _) {
        const v = Object.create(or.prototype);
        let P, O, j;
        l.start !== void 0 ? P = () => l.start(v) : P = () => {
        }, l.pull !== void 0 ? O = () => l.pull(v) : O = () => h(void 0), l.cancel !== void 0 ? j = (J) => l.cancel(J) : j = () => h(void 0), Qu(o, v, P, O, j, f, _);
      }
      function na(o) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${o} can only be used on a ReadableStreamDefaultController`);
      }
      function rm(o, l) {
        return Zt(o._readableStreamController) ? im(o) : nm(o);
      }
      function nm(o, l) {
        const f = be(o);
        let _ = !1, v = !1, P = !1, O = !1, j, J, z, ne, oe;
        const me = d((Xe) => {
          oe = Xe;
        });
        function At() {
          return _ ? (v = !0, h(void 0)) : (_ = !0, jr(f, {
            _chunkSteps: (lt) => {
              M(() => {
                v = !1;
                const wt = lt, sr = lt;
                P || In(z._readableStreamController, wt), O || In(ne._readableStreamController, sr), _ = !1, v && At();
              });
            },
            _closeSteps: () => {
              _ = !1, P || Jr(z._readableStreamController), O || Jr(ne._readableStreamController), (!P || !O) && oe(void 0);
            },
            _errorSteps: () => {
              _ = !1;
            }
          }), h(void 0));
        }
        function Nn(Xe) {
          if (P = !0, j = Xe, O) {
            const lt = Wr([j, J]), wt = Tt(o, lt);
            oe(wt);
          }
          return me;
        }
        function Rr(Xe) {
          if (O = !0, J = Xe, P) {
            const lt = Wr([j, J]), wt = Tt(o, lt);
            oe(wt);
          }
          return me;
        }
        function ar() {
        }
        return z = Ai(ar, At, Nn), ne = Ai(ar, At, Rr), A(f._closedPromise, (Xe) => (Rt(z._readableStreamController, Xe), Rt(ne._readableStreamController, Xe), (!P || !O) && oe(void 0), null)), [z, ne];
      }
      function im(o) {
        let l = be(o), f = !1, _ = !1, v = !1, P = !1, O = !1, j, J, z, ne, oe;
        const me = d((G) => {
          oe = G;
        });
        function At(G) {
          A(G._closedPromise, (le) => (G !== l || (ot(z._readableStreamController, le), ot(ne._readableStreamController, le), (!P || !O) && oe(void 0)), null));
        }
        function Nn() {
          rr(l) && (D(l), l = be(o), At(l)), jr(l, {
            _chunkSteps: (le) => {
              M(() => {
                _ = !1, v = !1;
                const _e = le;
                let mt = le;
                if (!P && !O)
                  try {
                    mt = Ao(le);
                  } catch (Fn) {
                    ot(z._readableStreamController, Fn), ot(ne._readableStreamController, Fn), oe(Tt(o, Fn));
                    return;
                  }
                P || tr(z._readableStreamController, _e), O || tr(ne._readableStreamController, mt), f = !1, _ ? ar() : v && Xe();
              });
            },
            _closeSteps: () => {
              f = !1, P || Vr(z._readableStreamController), O || Vr(ne._readableStreamController), z._readableStreamController._pendingPullIntos.length > 0 && Sn(z._readableStreamController, 0), ne._readableStreamController._pendingPullIntos.length > 0 && Sn(ne._readableStreamController, 0), (!P || !O) && oe(void 0);
            },
            _errorSteps: () => {
              f = !1;
            }
          });
        }
        function Rr(G, le) {
          Ft(l) && (D(l), l = Bo(o), At(l));
          const _e = le ? ne : z, mt = le ? z : ne;
          jo(l, G, 1, {
            _chunkSteps: (kn) => {
              M(() => {
                _ = !1, v = !1;
                const Ln = le ? O : P;
                if (le ? P : O)
                  Ln || vn(_e._readableStreamController, kn);
                else {
                  let dc;
                  try {
                    dc = Ao(kn);
                  } catch (Zs) {
                    ot(_e._readableStreamController, Zs), ot(mt._readableStreamController, Zs), oe(Tt(o, Zs));
                    return;
                  }
                  Ln || vn(_e._readableStreamController, kn), tr(mt._readableStreamController, dc);
                }
                f = !1, _ ? ar() : v && Xe();
              });
            },
            _closeSteps: (kn) => {
              f = !1;
              const Ln = le ? O : P, fa = le ? P : O;
              Ln || Vr(_e._readableStreamController), fa || Vr(mt._readableStreamController), kn !== void 0 && (Ln || vn(_e._readableStreamController, kn), !fa && mt._readableStreamController._pendingPullIntos.length > 0 && Sn(mt._readableStreamController, 0)), (!Ln || !fa) && oe(void 0);
            },
            _errorSteps: () => {
              f = !1;
            }
          });
        }
        function ar() {
          if (f)
            return _ = !0, h(void 0);
          f = !0;
          const G = En(z._readableStreamController);
          return G === null ? Nn() : Rr(G._view, !1), h(void 0);
        }
        function Xe() {
          if (f)
            return v = !0, h(void 0);
          f = !0;
          const G = En(ne._readableStreamController);
          return G === null ? Nn() : Rr(G._view, !0), h(void 0);
        }
        function lt(G) {
          if (P = !0, j = G, O) {
            const le = Wr([j, J]), _e = Tt(o, le);
            oe(_e);
          }
          return me;
        }
        function wt(G) {
          if (O = !0, J = G, P) {
            const le = Wr([j, J]), _e = Tt(o, le);
            oe(_e);
          }
          return me;
        }
        function sr() {
        }
        return z = Ju(sr, ar, lt), ne = Ju(sr, Xe, wt), At(l), [z, ne];
      }
      function om(o) {
        return i(o) && typeof o.getReader < "u";
      }
      function am(o) {
        return om(o) ? lm(o.getReader()) : sm(o);
      }
      function sm(o) {
        let l;
        const f = bn(o, "async"), _ = n;
        function v() {
          let O;
          try {
            O = mi(f);
          } catch (J) {
            return m(J);
          }
          const j = h(O);
          return $(j, (J) => {
            if (!i(J))
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (Gr(J))
              Jr(l._readableStreamController);
            else {
              const ne = Ps(J);
              In(l._readableStreamController, ne);
            }
          });
        }
        function P(O) {
          const j = f.iterator;
          let J;
          try {
            J = gr(j, "return");
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
          return $(ne, (oe) => {
            if (!i(oe))
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
          });
        }
        return l = Ai(_, v, P, 0), l;
      }
      function lm(o) {
        let l;
        const f = n;
        function _() {
          let P;
          try {
            P = o.read();
          } catch (O) {
            return m(O);
          }
          return $(P, (O) => {
            if (!i(O))
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            if (O.done)
              Jr(l._readableStreamController);
            else {
              const j = O.value;
              In(l._readableStreamController, j);
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
        return l = Ai(f, _, v, 0), l;
      }
      function um(o, l) {
        Re(o, l);
        const f = o, _ = f == null ? void 0 : f.autoAllocateChunkSize, v = f == null ? void 0 : f.cancel, P = f == null ? void 0 : f.pull, O = f == null ? void 0 : f.start, j = f == null ? void 0 : f.type;
        return {
          autoAllocateChunkSize: _ === void 0 ? void 0 : Ae(_, `${l} has member 'autoAllocateChunkSize' that`),
          cancel: v === void 0 ? void 0 : cm(v, f, `${l} has member 'cancel' that`),
          pull: P === void 0 ? void 0 : fm(P, f, `${l} has member 'pull' that`),
          start: O === void 0 ? void 0 : dm(O, f, `${l} has member 'start' that`),
          type: j === void 0 ? void 0 : hm(j, `${l} has member 'type' that`)
        };
      }
      function cm(o, l, f) {
        return y(o, f), (_) => te(o, l, [_]);
      }
      function fm(o, l, f) {
        return y(o, f), (_) => te(o, l, [_]);
      }
      function dm(o, l, f) {
        return y(o, f), (_) => x(o, l, [_]);
      }
      function hm(o, l) {
        if (o = `${o}`, o !== "bytes")
          throw new TypeError(`${l} '${o}' is not a valid enumeration value for ReadableStreamType`);
        return o;
      }
      function pm(o, l) {
        return Re(o, l), { preventCancel: !!(o == null ? void 0 : o.preventCancel) };
      }
      function Ku(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.preventAbort, _ = o == null ? void 0 : o.preventCancel, v = o == null ? void 0 : o.preventClose, P = o == null ? void 0 : o.signal;
        return P !== void 0 && mm(P, `${l} has member 'signal' that`), {
          preventAbort: !!f,
          preventCancel: !!_,
          preventClose: !!v,
          signal: P
        };
      }
      function mm(o, l) {
        if (!Us(o))
          throw new TypeError(`${l} is not an AbortSignal.`);
      }
      function gm(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.readable;
        se(f, "readable", "ReadableWritablePair"), yt(f, `${l} has member 'readable' that`);
        const _ = o == null ? void 0 : o.writable;
        return se(_, "writable", "ReadableWritablePair"), Vo(_, `${l} has member 'writable' that`), { readable: f, writable: _ };
      }
      class He {
        constructor(l = {}, f = {}) {
          l === void 0 ? l = null : F(l, "First parameter");
          const _ = Er(f, "Second parameter"), v = um(l, "First parameter");
          if (Xs(this), v.type === "bytes") {
            if (_.size !== void 0)
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            const P = jt(_, 0);
            Ls(this, v, P);
          } else {
            const P = Tn(_), O = jt(_, 1);
            tm(this, v, O, P);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!Sr(this))
            throw Zr("locked");
          return vr(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(l = void 0) {
          return Sr(this) ? vr(this) ? m(new TypeError("Cannot cancel a stream that already has a reader")) : Tt(this, l) : m(Zr("cancel"));
        }
        getReader(l = void 0) {
          if (!Sr(this))
            throw Zr("getReader");
          return Uo(l, "First parameter").mode === void 0 ? be(this) : Bo(this);
        }
        pipeThrough(l, f = {}) {
          if (!Sr(this))
            throw Zr("pipeThrough");
          T(l, 1, "pipeThrough");
          const _ = gm(l, "First parameter"), v = Ku(f, "Second parameter");
          if (vr(this))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (de(_.writable))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const P = Yu(this, _.writable, v.preventClose, v.preventAbort, v.preventCancel, v.signal);
          return I(P), _.readable;
        }
        pipeTo(l, f = {}) {
          if (!Sr(this))
            return m(Zr("pipeTo"));
          if (l === void 0)
            return m("Parameter 1 is required in 'pipeTo'.");
          if (!K(l))
            return m(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let _;
          try {
            _ = Ku(f, "Second parameter");
          } catch (v) {
            return m(v);
          }
          return vr(this) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : de(l) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Yu(this, l, _.preventClose, _.preventAbort, _.preventCancel, _.signal);
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
          if (!Sr(this))
            throw Zr("tee");
          const l = rm(this);
          return Wr(l);
        }
        values(l = void 0) {
          if (!Sr(this))
            throw Zr("values");
          const f = pm(l, "First parameter");
          return Co(this, f.preventCancel);
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
          return am(l);
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
      }), Object.defineProperty(He.prototype, zr, {
        value: He.prototype.values,
        writable: !0,
        configurable: !0
      });
      function Ai(o, l, f, _ = 1, v = () => 1) {
        const P = Object.create(He.prototype);
        Xs(P);
        const O = Object.create(or.prototype);
        return Qu(P, O, o, l, f, _, v), P;
      }
      function Ju(o, l, f) {
        const _ = Object.create(He.prototype);
        Xs(_);
        const v = Object.create(vt.prototype);
        return Lo(_, v, o, l, f, 0, void 0), _;
      }
      function Xs(o) {
        o._state = "readable", o._reader = void 0, o._storedError = void 0, o._disturbed = !1;
      }
      function Sr(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_readableStreamController") ? !1 : o instanceof He;
      }
      function vr(o) {
        return o._reader !== void 0;
      }
      function Tt(o, l) {
        if (o._disturbed = !0, o._state === "closed")
          return h(void 0);
        if (o._state === "errored")
          return m(o._storedError);
        Pi(o);
        const f = o._reader;
        if (f !== void 0 && rr(f)) {
          const v = f._readIntoRequests;
          f._readIntoRequests = new Q(), v.forEach((P) => {
            P._closeSteps(void 0);
          });
        }
        const _ = o._readableStreamController[re](l);
        return $(_, n);
      }
      function Pi(o) {
        o._state = "closed";
        const l = o._reader;
        if (l !== void 0 && (ee(l), Ft(l))) {
          const f = l._readRequests;
          l._readRequests = new Q(), f.forEach((_) => {
            _._closeSteps();
          });
        }
      }
      function Zu(o, l) {
        o._state = "errored", o._storedError = l;
        const f = o._reader;
        f !== void 0 && (V(f, l), Ft(f) ? vo(f, l) : vi(f, l));
      }
      function Zr(o) {
        return new TypeError(`ReadableStream.prototype.${o} can only be used on a ReadableStream`);
      }
      function ec(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.highWaterMark;
        return se(f, "highWaterMark", "QueuingStrategyInit"), {
          highWaterMark: pe(f)
        };
      }
      const tc = (o) => o.byteLength;
      s(tc, "size");
      class ia {
        constructor(l) {
          T(l, 1, "ByteLengthQueuingStrategy"), l = ec(l, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = l.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!nc(this))
            throw rc("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!nc(this))
            throw rc("size");
          return tc;
        }
      }
      Object.defineProperties(ia.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ia.prototype, Symbol.toStringTag, {
        value: "ByteLengthQueuingStrategy",
        configurable: !0
      });
      function rc(o) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${o} can only be used on a ByteLengthQueuingStrategy`);
      }
      function nc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_byteLengthQueuingStrategyHighWaterMark") ? !1 : o instanceof ia;
      }
      const ic = () => 1;
      s(ic, "size");
      class oa {
        constructor(l) {
          T(l, 1, "CountQueuingStrategy"), l = ec(l, "First parameter"), this._countQueuingStrategyHighWaterMark = l.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!ac(this))
            throw oc("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!ac(this))
            throw oc("size");
          return ic;
        }
      }
      Object.defineProperties(oa.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(oa.prototype, Symbol.toStringTag, {
        value: "CountQueuingStrategy",
        configurable: !0
      });
      function oc(o) {
        return new TypeError(`CountQueuingStrategy.prototype.${o} can only be used on a CountQueuingStrategy`);
      }
      function ac(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_countQueuingStrategyHighWaterMark") ? !1 : o instanceof oa;
      }
      function ym(o, l) {
        Re(o, l);
        const f = o == null ? void 0 : o.cancel, _ = o == null ? void 0 : o.flush, v = o == null ? void 0 : o.readableType, P = o == null ? void 0 : o.start, O = o == null ? void 0 : o.transform, j = o == null ? void 0 : o.writableType;
        return {
          cancel: f === void 0 ? void 0 : Em(f, o, `${l} has member 'cancel' that`),
          flush: _ === void 0 ? void 0 : bm(_, o, `${l} has member 'flush' that`),
          readableType: v,
          start: P === void 0 ? void 0 : _m(P, o, `${l} has member 'start' that`),
          transform: O === void 0 ? void 0 : wm(O, o, `${l} has member 'transform' that`),
          writableType: j
        };
      }
      function bm(o, l, f) {
        return y(o, f), (_) => te(o, l, [_]);
      }
      function _m(o, l, f) {
        return y(o, f), (_) => x(o, l, [_]);
      }
      function wm(o, l, f) {
        return y(o, f), (_, v) => te(o, l, [_, v]);
      }
      function Em(o, l, f) {
        return y(o, f), (_) => te(o, l, [_]);
      }
      class aa {
        constructor(l = {}, f = {}, _ = {}) {
          l === void 0 && (l = null);
          const v = Er(f, "Second parameter"), P = Er(_, "Third parameter"), O = ym(l, "First parameter");
          if (O.readableType !== void 0)
            throw new RangeError("Invalid readableType specified");
          if (O.writableType !== void 0)
            throw new RangeError("Invalid writableType specified");
          const j = jt(P, 0), J = Tn(P), z = jt(v, 1), ne = Tn(v);
          let oe;
          const me = d((At) => {
            oe = At;
          });
          Sm(this, me, z, ne, j, J), Cm(this, O), O.start !== void 0 ? oe(O.start(this._transformStreamController)) : oe(void 0);
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!sc(this))
            throw fc("readable");
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!sc(this))
            throw fc("writable");
          return this._writable;
        }
      }
      Object.defineProperties(aa.prototype, {
        readable: { enumerable: !0 },
        writable: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(aa.prototype, Symbol.toStringTag, {
        value: "TransformStream",
        configurable: !0
      });
      function Sm(o, l, f, _, v, P) {
        function O() {
          return l;
        }
        function j(me) {
          return Am(o, me);
        }
        function J(me) {
          return Pm(o, me);
        }
        function z() {
          return $m(o);
        }
        o._writable = W(O, j, z, J, f, _);
        function ne() {
          return Im(o);
        }
        function oe(me) {
          return Om(o, me);
        }
        o._readable = Ai(O, ne, oe, v, P), o._backpressure = void 0, o._backpressureChangePromise = void 0, o._backpressureChangePromise_resolve = void 0, sa(o, !0), o._transformStreamController = void 0;
      }
      function sc(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_transformStreamController") ? !1 : o instanceof aa;
      }
      function lc(o, l) {
        Rt(o._readable._readableStreamController, l), Qs(o, l);
      }
      function Qs(o, l) {
        ua(o._transformStreamController), Ci(o._writable._writableStreamController, l), Ks(o);
      }
      function Ks(o) {
        o._backpressure && sa(o, !1);
      }
      function sa(o, l) {
        o._backpressureChangePromise !== void 0 && o._backpressureChangePromise_resolve(), o._backpressureChangePromise = d((f) => {
          o._backpressureChangePromise_resolve = f;
        }), o._backpressure = l;
      }
      class Cr {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!la(this))
            throw ca("desiredSize");
          const l = this._controlledTransformStream._readable._readableStreamController;
          return Ys(l);
        }
        enqueue(l = void 0) {
          if (!la(this))
            throw ca("enqueue");
          uc(this, l);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(l = void 0) {
          if (!la(this))
            throw ca("error");
          Rm(this, l);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!la(this))
            throw ca("terminate");
          Tm(this);
        }
      }
      Object.defineProperties(Cr.prototype, {
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        terminate: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), s(Cr.prototype.enqueue, "enqueue"), s(Cr.prototype.error, "error"), s(Cr.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Cr.prototype, Symbol.toStringTag, {
        value: "TransformStreamDefaultController",
        configurable: !0
      });
      function la(o) {
        return !i(o) || !Object.prototype.hasOwnProperty.call(o, "_controlledTransformStream") ? !1 : o instanceof Cr;
      }
      function vm(o, l, f, _, v) {
        l._controlledTransformStream = o, o._transformStreamController = l, l._transformAlgorithm = f, l._flushAlgorithm = _, l._cancelAlgorithm = v, l._finishPromise = void 0, l._finishPromise_resolve = void 0, l._finishPromise_reject = void 0;
      }
      function Cm(o, l) {
        const f = Object.create(Cr.prototype);
        let _, v, P;
        l.transform !== void 0 ? _ = (O) => l.transform(O, f) : _ = (O) => {
          try {
            return uc(f, O), h(void 0);
          } catch (j) {
            return m(j);
          }
        }, l.flush !== void 0 ? v = () => l.flush(f) : v = () => h(void 0), l.cancel !== void 0 ? P = (O) => l.cancel(O) : P = () => h(void 0), vm(o, f, _, v, P);
      }
      function ua(o) {
        o._transformAlgorithm = void 0, o._flushAlgorithm = void 0, o._cancelAlgorithm = void 0;
      }
      function uc(o, l) {
        const f = o._controlledTransformStream, _ = f._readable._readableStreamController;
        if (!On(_))
          throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          In(_, l);
        } catch (P) {
          throw Qs(f, P), f._readable._storedError;
        }
        em(_) !== f._backpressure && sa(f, !0);
      }
      function Rm(o, l) {
        lc(o._controlledTransformStream, l);
      }
      function cc(o, l) {
        const f = o._transformAlgorithm(l);
        return $(f, void 0, (_) => {
          throw lc(o._controlledTransformStream, _), _;
        });
      }
      function Tm(o) {
        const l = o._controlledTransformStream, f = l._readable._readableStreamController;
        Jr(f);
        const _ = new TypeError("TransformStream terminated");
        Qs(l, _);
      }
      function Am(o, l) {
        const f = o._transformStreamController;
        if (o._backpressure) {
          const _ = o._backpressureChangePromise;
          return $(_, () => {
            const v = o._writable;
            if (v._state === "erroring")
              throw v._storedError;
            return cc(f, l);
          });
        }
        return cc(f, l);
      }
      function Pm(o, l) {
        const f = o._transformStreamController;
        if (f._finishPromise !== void 0)
          return f._finishPromise;
        const _ = o._readable;
        f._finishPromise = d((P, O) => {
          f._finishPromise_resolve = P, f._finishPromise_reject = O;
        });
        const v = f._cancelAlgorithm(l);
        return ua(f), E(v, () => (_._state === "errored" ? Dn(f, _._storedError) : (Rt(_._readableStreamController, l), Js(f)), null), (P) => (Rt(_._readableStreamController, P), Dn(f, P), null)), f._finishPromise;
      }
      function $m(o) {
        const l = o._transformStreamController;
        if (l._finishPromise !== void 0)
          return l._finishPromise;
        const f = o._readable;
        l._finishPromise = d((v, P) => {
          l._finishPromise_resolve = v, l._finishPromise_reject = P;
        });
        const _ = l._flushAlgorithm();
        return ua(l), E(_, () => (f._state === "errored" ? Dn(l, f._storedError) : (Jr(f._readableStreamController), Js(l)), null), (v) => (Rt(f._readableStreamController, v), Dn(l, v), null)), l._finishPromise;
      }
      function Im(o) {
        return sa(o, !1), o._backpressureChangePromise;
      }
      function Om(o, l) {
        const f = o._transformStreamController;
        if (f._finishPromise !== void 0)
          return f._finishPromise;
        const _ = o._writable;
        f._finishPromise = d((P, O) => {
          f._finishPromise_resolve = P, f._finishPromise_reject = O;
        });
        const v = f._cancelAlgorithm(l);
        return ua(f), E(v, () => (_._state === "errored" ? Dn(f, _._storedError) : (Ci(_._writableStreamController, l), Ks(o), Js(f)), null), (P) => (Ci(_._writableStreamController, P), Ks(o), Dn(f, P), null)), f._finishPromise;
      }
      function ca(o) {
        return new TypeError(`TransformStreamDefaultController.prototype.${o} can only be used on a TransformStreamDefaultController`);
      }
      function Js(o) {
        o._finishPromise_resolve !== void 0 && (o._finishPromise_resolve(), o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0);
      }
      function Dn(o, l) {
        o._finishPromise_reject !== void 0 && (I(o._finishPromise), o._finishPromise_reject(l), o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0);
      }
      function fc(o) {
        return new TypeError(`TransformStream.prototype.${o} can only be used on a TransformStream`);
      }
      r.ByteLengthQueuingStrategy = ia, r.CountQueuingStrategy = oa, r.ReadableByteStreamController = vt, r.ReadableStream = He, r.ReadableStreamBYOBReader = qt, r.ReadableStreamBYOBRequest = Jt, r.ReadableStreamDefaultController = or, r.ReadableStreamDefaultReader = dt, r.TransformStream = aa, r.TransformStreamDefaultController = Cr, r.WritableStream = R, r.WritableStreamDefaultController = $n, r.WritableStreamDefaultWriter = ir;
    });
  }(ha, ha.exports)), ha.exports;
}
const Km = 65536;
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
    Object.assign(globalThis, Qm());
  }
try {
  const { Blob: e } = require("buffer");
  e && !e.prototype.stream && (e.prototype.stream = function(r) {
    let n = 0;
    const i = this;
    return new ReadableStream({
      type: "bytes",
      async pull(a) {
        const u = await i.slice(n, Math.min(i.size, n + Km)).arrayBuffer();
        n += u.byteLength, a.enqueue(new Uint8Array(u)), n === i.size && a.close();
      }
    });
  });
} catch {
}
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const gc = 65536;
async function* el(e, t = !0) {
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
          const a = Math.min(i - n, gc), s = r.buffer.slice(n, n + a);
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
        const s = await i.slice(n, Math.min(i.size, n + gc)).arrayBuffer();
        n += s.byteLength, yield new Uint8Array(s);
      }
    }
}
var cr, so, ti, es, cn;
const vd = (cn = class {
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
    Tr(this, cr, []);
    Tr(this, so, "");
    Tr(this, ti, 0);
    Tr(this, es, "transparent");
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
      ArrayBuffer.isView(a) ? s = new Uint8Array(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength)) : a instanceof ArrayBuffer ? s = new Uint8Array(a.slice(0)) : a instanceof cn ? s = a : s = n.encode(`${a}`), Ht(this, ti, Le(this, ti) + (ArrayBuffer.isView(s) ? s.byteLength : s.size)), Le(this, cr).push(s);
    }
    Ht(this, es, `${r.endings === void 0 ? "transparent" : r.endings}`);
    const i = r.type === void 0 ? "" : String(r.type);
    Ht(this, so, /^[\x20-\x7E]*$/.test(i) ? i : "");
  }
  /**
   * The Blob interface's size property returns the
   * size of the Blob in bytes.
   */
  get size() {
    return Le(this, ti);
  }
  /**
   * The type property of a Blob object returns the MIME type of the file.
   */
  get type() {
    return Le(this, so);
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
    for await (const n of el(Le(this, cr), !1))
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
    for await (const n of el(Le(this, cr), !1))
      t.set(n, r), r += n.length;
    return t.buffer;
  }
  stream() {
    const t = el(Le(this, cr), !0);
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
    const u = Math.max(s - a, 0), c = Le(this, cr), g = [];
    let d = 0;
    for (const m of c) {
      if (d >= u)
        break;
      const b = ArrayBuffer.isView(m) ? m.byteLength : m.size;
      if (a && b <= a)
        a -= b, s -= b;
      else {
        let E;
        ArrayBuffer.isView(m) ? (E = m.subarray(a, Math.min(b, s)), d += E.byteLength) : (E = m.slice(a, Math.min(b, s)), d += E.size), s -= b, g.push(E), a = 0;
      }
    }
    const h = new cn([], { type: String(n).toLowerCase() });
    return Ht(h, ti, u), Ht(h, cr, g), h;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](t) {
    return t && typeof t == "object" && typeof t.constructor == "function" && (typeof t.stream == "function" || typeof t.arrayBuffer == "function") && /^(Blob|File)$/.test(t[Symbol.toStringTag]);
  }
}, cr = new WeakMap(), so = new WeakMap(), ti = new WeakMap(), es = new WeakMap(), cn);
Object.defineProperties(vd.prototype, {
  size: { enumerable: !0 },
  type: { enumerable: !0 },
  slice: { enumerable: !0 }
});
const xa = vd;
var lo, uo, yd;
const Jm = (yd = class extends xa {
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
    Tr(this, lo, 0);
    Tr(this, uo, "");
    i === null && (i = {});
    const a = i.lastModified === void 0 ? Date.now() : Number(i.lastModified);
    Number.isNaN(a) || Ht(this, lo, a), Ht(this, uo, String(n));
  }
  get name() {
    return Le(this, uo);
  }
  get lastModified() {
    return Le(this, lo);
  }
  get [Symbol.toStringTag]() {
    return "File";
  }
  static [Symbol.hasInstance](r) {
    return !!r && r instanceof xa && /^(File)$/.test(r[Symbol.toStringTag]);
  }
}, lo = new WeakMap(), uo = new WeakMap(), yd), Zm = Jm;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: xi, iterator: eg, hasInstance: tg } = Symbol, yc = Math.random, rg = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), bc = (e, t, r) => (e += "", /^(Blob|File)$/.test(t && t[xi]) ? [(r = r !== void 0 ? r + "" : t[xi] == "File" ? t.name : "blob", e), t.name !== r || t[xi] == "blob" ? new Zm([t], r, t) : t] : [e, t + ""]), tl = (e, t) => (t ? e : e.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), en = (e, t, r) => {
  if (t.length < r)
    throw new TypeError(`Failed to execute '${e}' on 'FormData': ${r} arguments required, but only ${t.length} present.`);
}, Et, bd;
const Ll = (bd = class {
  constructor(...t) {
    Tr(this, Et, []);
    if (t.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [xi]() {
    return "FormData";
  }
  [eg]() {
    return this.entries();
  }
  static [tg](t) {
    return t && typeof t == "object" && t[xi] === "FormData" && !rg.some((r) => typeof t[r] != "function");
  }
  append(...t) {
    en("append", arguments, 2), Le(this, Et).push(bc(...t));
  }
  delete(t) {
    en("delete", arguments, 1), t += "", Ht(this, Et, Le(this, Et).filter(([r]) => r !== t));
  }
  get(t) {
    en("get", arguments, 1), t += "";
    for (var r = Le(this, Et), n = r.length, i = 0; i < n; i++) if (r[i][0] === t) return r[i][1];
    return null;
  }
  getAll(t, r) {
    return en("getAll", arguments, 1), r = [], t += "", Le(this, Et).forEach((n) => n[0] === t && r.push(n[1])), r;
  }
  has(t) {
    return en("has", arguments, 1), t += "", Le(this, Et).some((r) => r[0] === t);
  }
  forEach(t, r) {
    en("forEach", arguments, 1);
    for (var [n, i] of this) t.call(r, i, n, this);
  }
  set(...t) {
    en("set", arguments, 2);
    var r = [], n = !0;
    t = bc(...t), Le(this, Et).forEach((i) => {
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
}, Et = new WeakMap(), bd);
function ng(e, t = xa) {
  var r = `${yc()}${yc()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), n = [], i = `--${r}\r
Content-Disposition: form-data; name="`;
  return e.forEach((a, s) => typeof a == "string" ? n.push(i + tl(s) + `"\r
\r
${a.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : n.push(i + tl(s) + `"; filename="${tl(a.name, 1)}"\r
Content-Type: ${a.type || "application/octet-stream"}\r
\r
`, a, `\r
`)), n.push(`--${r}--`), new t(n, { type: "multipart/form-data; boundary=" + r });
}
class is extends Error {
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
class Gt extends is {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(t, r, n) {
    super(t, r), n && (this.code = this.errno = n.code, this.erroredSysCall = n.syscall);
  }
}
const Ua = Symbol.toStringTag, Cd = (e) => typeof e == "object" && typeof e.append == "function" && typeof e.delete == "function" && typeof e.get == "function" && typeof e.getAll == "function" && typeof e.has == "function" && typeof e.set == "function" && typeof e.sort == "function" && e[Ua] === "URLSearchParams", Ba = (e) => e && typeof e == "object" && typeof e.arrayBuffer == "function" && typeof e.type == "string" && typeof e.stream == "function" && typeof e.constructor == "function" && /^(Blob|File)$/.test(e[Ua]), ig = (e) => typeof e == "object" && (e[Ua] === "AbortSignal" || e[Ua] === "EventTarget"), og = (e, t) => {
  const r = new URL(t).hostname, n = new URL(e).hostname;
  return r === n || r.endsWith(`.${n}`);
}, ag = (e, t) => {
  const r = new URL(t).protocol, n = new URL(e).protocol;
  return r === n;
}, sg = Hm(Vt.pipeline), ut = Symbol("Body internals");
class Hi {
  constructor(t, {
    size: r = 0
  } = {}) {
    let n = null;
    t === null ? t = null : Cd(t) ? t = ze.from(t.toString()) : Ba(t) || ze.isBuffer(t) || (La.isAnyArrayBuffer(t) ? t = ze.from(t) : ArrayBuffer.isView(t) ? t = ze.from(t.buffer, t.byteOffset, t.byteLength) : t instanceof Vt || (t instanceof Ll ? (t = ng(t), n = t.type.split("=")[1]) : t = ze.from(String(t))));
    let i = t;
    ze.isBuffer(t) ? i = Vt.Readable.from(t) : Ba(t) && (i = Vt.Readable.from(t.stream())), this[ut] = {
      body: t,
      stream: i,
      boundary: n,
      disturbed: !1,
      error: null
    }, this.size = r, t instanceof Vt && t.on("error", (a) => {
      const s = a instanceof is ? a : new Gt(`Invalid response body while trying to fetch ${this.url}: ${a.message}`, "system", a);
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
    const { buffer: t, byteOffset: r, byteLength: n } = await rl(this);
    return t.slice(r, r + n);
  }
  async formData() {
    const t = this.headers.get("content-type");
    if (t.startsWith("application/x-www-form-urlencoded")) {
      const n = new Ll(), i = new URLSearchParams(await this.text());
      for (const [a, s] of i)
        n.append(a, s);
      return n;
    }
    const { toFormData: r } = await import("./multipart-parser-C4RZ7j3l.js");
    return r(this.body, t);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const t = this.headers && this.headers.get("content-type") || this[ut].body && this[ut].body.type || "", r = await this.arrayBuffer();
    return new xa([r], {
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
    const t = await rl(this);
    return new TextDecoder().decode(t);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return rl(this);
  }
}
Hi.prototype.buffer = ts(Hi.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Hi.prototype, {
  body: { enumerable: !0 },
  bodyUsed: { enumerable: !0 },
  arrayBuffer: { enumerable: !0 },
  blob: { enumerable: !0 },
  json: { enumerable: !0 },
  text: { enumerable: !0 },
  data: { get: ts(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function rl(e) {
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
    throw i instanceof is ? i : new Gt(`Invalid response body while trying to fetch ${e.url}: ${i.message}`, "system", i);
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
const nu = (e, t) => {
  let r, n, { body: i } = e[ut];
  if (e.bodyUsed)
    throw new Error("cannot clone body after it is used");
  return i instanceof Vt && typeof i.getBoundary != "function" && (r = new ka({ highWaterMark: t }), n = new ka({ highWaterMark: t }), i.pipe(r), i.pipe(n), e[ut].stream = r, i = n), i;
}, lg = ts(
  (e) => e.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
), Rd = (e, t) => e === null ? null : typeof e == "string" ? "text/plain;charset=UTF-8" : Cd(e) ? "application/x-www-form-urlencoded;charset=UTF-8" : Ba(e) ? e.type || null : ze.isBuffer(e) || La.isAnyArrayBuffer(e) || ArrayBuffer.isView(e) ? null : e instanceof Ll ? `multipart/form-data; boundary=${t[ut].boundary}` : e && typeof e.getBoundary == "function" ? `multipart/form-data;boundary=${lg(e)}` : e instanceof Vt ? null : "text/plain;charset=UTF-8", ug = (e) => {
  const { body: t } = e[ut];
  return t === null ? 0 : Ba(t) ? t.size : ze.isBuffer(t) ? t.length : t && typeof t.getLengthSync == "function" && t.hasKnownLength && t.hasKnownLength() ? t.getLengthSync() : null;
}, cg = async (e, { body: t }) => {
  t === null ? e.end() : await sg(t, e);
}, Ia = typeof Wi.validateHeaderName == "function" ? Wi.validateHeaderName : (e) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(e)) {
    const t = new TypeError(`Header name must be a valid HTTP token [${e}]`);
    throw Object.defineProperty(t, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), t;
  }
}, xl = typeof Wi.validateHeaderValue == "function" ? Wi.validateHeaderValue : (e, t) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(t)) {
    const r = new TypeError(`Invalid character in header content ["${e}"]`);
    throw Object.defineProperty(r, "code", { value: "ERR_INVALID_CHAR" }), r;
  }
};
class fr extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(t) {
    let r = [];
    if (t instanceof fr) {
      const n = t.raw();
      for (const [i, a] of Object.entries(n))
        r.push(...a.map((s) => [i, s]));
    } else if (t != null) if (typeof t == "object" && !La.isBoxedPrimitive(t)) {
      const n = t[Symbol.iterator];
      if (n == null)
        r.push(...Object.entries(t));
      else {
        if (typeof n != "function")
          throw new TypeError("Header pairs must be iterable");
        r = [...t].map((i) => {
          if (typeof i != "object" || La.isBoxedPrimitive(i))
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
    return r = r.length > 0 ? r.map(([n, i]) => (Ia(n), xl(n, String(i)), [String(n).toLowerCase(), String(i)])) : void 0, super(r), new Proxy(this, {
      get(n, i, a) {
        switch (i) {
          case "append":
          case "set":
            return (s, u) => (Ia(s), xl(s, String(u)), URLSearchParams.prototype[i].call(
              n,
              String(s).toLowerCase(),
              String(u)
            ));
          case "delete":
          case "has":
          case "getAll":
            return (s) => (Ia(s), URLSearchParams.prototype[i].call(
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
  fr.prototype,
  ["get", "entries", "forEach", "values"].reduce((e, t) => (e[t] = { enumerable: !0 }, e), {})
);
function fg(e = []) {
  return new fr(
    e.reduce((t, r, n, i) => (n % 2 === 0 && t.push(i.slice(n, n + 2)), t), []).filter(([t, r]) => {
      try {
        return Ia(t), xl(t, String(r)), !0;
      } catch {
        return !1;
      }
    })
  );
}
const dg = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Td = (e) => dg.has(e), Pt = Symbol("Response internals");
class gt extends Hi {
  constructor(t = null, r = {}) {
    super(t, r);
    const n = r.status != null ? r.status : 200, i = new fr(r.headers);
    if (t !== null && !i.has("Content-Type")) {
      const a = Rd(t, this);
      a && i.append("Content-Type", a);
    }
    this[Pt] = {
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
    return this[Pt].type;
  }
  get url() {
    return this[Pt].url || "";
  }
  get status() {
    return this[Pt].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[Pt].status >= 200 && this[Pt].status < 300;
  }
  get redirected() {
    return this[Pt].counter > 0;
  }
  get statusText() {
    return this[Pt].statusText;
  }
  get headers() {
    return this[Pt].headers;
  }
  get highWaterMark() {
    return this[Pt].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new gt(nu(this, this.highWaterMark), {
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
    if (!Td(r))
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
    return t[Pt].type = "error", t;
  }
  static json(t = void 0, r = {}) {
    const n = JSON.stringify(t);
    if (n === void 0)
      throw new TypeError("data is not JSON serializable");
    const i = new fr(r && r.headers);
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
const hg = (e) => {
  if (e.search)
    return e.search;
  const t = e.href.length - 1, r = e.hash || (e.href[t] === "#" ? "#" : "");
  return e.href[t - r.length] === "?" ? "?" : "";
};
function _c(e, t = !1) {
  return e == null || (e = new URL(e), /^(about|blob|data):$/.test(e.protocol)) ? "no-referrer" : (e.username = "", e.password = "", e.hash = "", t && (e.pathname = "", e.search = ""), e);
}
const Ad = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]), pg = "strict-origin-when-cross-origin";
function mg(e) {
  if (!Ad.has(e))
    throw new TypeError(`Invalid referrerPolicy: ${e}`);
  return e;
}
function gg(e) {
  if (/^(http|ws)s:$/.test(e.protocol))
    return !0;
  const t = e.host.replace(/(^\[)|(]$)/g, ""), r = zm(t);
  return r === 4 && /^127\./.test(t) || r === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(t) ? !0 : e.host === "localhost" || e.host.endsWith(".localhost") ? !1 : e.protocol === "file:";
}
function Bn(e) {
  return /^about:(blank|srcdoc)$/.test(e) || e.protocol === "data:" || /^(blob|filesystem):$/.test(e.protocol) ? !0 : gg(e);
}
function yg(e, { referrerURLCallback: t, referrerOriginCallback: r } = {}) {
  if (e.referrer === "no-referrer" || e.referrerPolicy === "")
    return null;
  const n = e.referrerPolicy;
  if (e.referrer === "about:client")
    return "no-referrer";
  const i = e.referrer;
  let a = _c(i), s = _c(i, !0);
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
function bg(e) {
  const t = (e.get("referrer-policy") || "").split(/[,\s]+/);
  let r = "";
  for (const n of t)
    n && Ad.has(n) && (r = n);
  return r;
}
const xe = Symbol("Request internals"), $i = (e) => typeof e == "object" && typeof e[xe] == "object", _g = ts(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
class zi extends Hi {
  constructor(t, r = {}) {
    let n;
    if ($i(t) ? n = new URL(t.url) : (n = new URL(t), t = {}), n.username !== "" || n.password !== "")
      throw new TypeError(`${n} is an url with embedded credentials.`);
    let i = r.method || t.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(i) && (i = i.toUpperCase()), !$i(r) && "data" in r && _g(), (r.body != null || $i(t) && t.body !== null) && (i === "GET" || i === "HEAD"))
      throw new TypeError("Request with GET/HEAD method cannot have body");
    const a = r.body ? r.body : $i(t) && t.body !== null ? nu(t) : null;
    super(a, {
      size: r.size || t.size || 0
    });
    const s = new fr(r.headers || t.headers || {});
    if (a !== null && !s.has("Content-Type")) {
      const g = Rd(a, this);
      g && s.set("Content-Type", g);
    }
    let u = $i(t) ? t.signal : null;
    if ("signal" in r && (u = r.signal), u != null && !ig(u))
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
    return Bm(this[xe].parsedURL);
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
    this[xe].referrerPolicy = mg(t);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new zi(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(zi.prototype, {
  method: { enumerable: !0 },
  url: { enumerable: !0 },
  headers: { enumerable: !0 },
  redirect: { enumerable: !0 },
  clone: { enumerable: !0 },
  signal: { enumerable: !0 },
  referrer: { enumerable: !0 },
  referrerPolicy: { enumerable: !0 }
});
const wg = (e) => {
  const { parsedURL: t } = e[xe], r = new fr(e[xe].headers);
  r.has("Accept") || r.set("Accept", "*/*");
  let n = null;
  if (e.body === null && /^(post|put)$/i.test(e.method) && (n = "0"), e.body !== null) {
    const u = ug(e);
    typeof u == "number" && !Number.isNaN(u) && (n = String(u));
  }
  n && r.set("Content-Length", n), e.referrerPolicy === "" && (e.referrerPolicy = pg), e.referrer && e.referrer !== "no-referrer" ? e[xe].referrer = yg(e) : e[xe].referrer = "no-referrer", e[xe].referrer instanceof URL && r.set("Referer", e.referrer), r.has("User-Agent") || r.set("User-Agent", "node-fetch"), e.compress && !r.has("Accept-Encoding") && r.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: i } = e;
  typeof i == "function" && (i = i(t));
  const a = hg(t), s = {
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
class Eg extends is {
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
const { stat: PT } = jm, Sg = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function ur(e, t) {
  return new Promise((r, n) => {
    const i = new zi(e, t), { parsedURL: a, options: s } = wg(i);
    if (!Sg.has(a.protocol))
      throw new TypeError(`node-fetch cannot load ${e}. URL scheme "${a.protocol.replace(/:$/, "")}" is not supported.`);
    if (a.protocol === "data:") {
      const E = Xm(i.url), C = new gt(E, { headers: { "Content-Type": E.typeFull } });
      r(C);
      return;
    }
    const u = (a.protocol === "https:" ? Wm : Wi).request, { signal: c } = i;
    let g = null;
    const d = () => {
      const E = new Eg("The operation was aborted.");
      n(E), i.body && i.body instanceof Vt.Readable && i.body.destroy(E), !(!g || !g.body) && g.body.emit("error", E);
    };
    if (c && c.aborted) {
      d();
      return;
    }
    const h = () => {
      d(), b();
    }, m = u(a.toString(), s);
    c && c.addEventListener("abort", h);
    const b = () => {
      m.abort(), c && c.removeEventListener("abort", h);
    };
    m.on("error", (E) => {
      n(new Gt(`request to ${i.url} failed, reason: ${E.message}`, "system", E)), b();
    }), vg(m, (E) => {
      g && g.body && g.body.destroy(E);
    }), process.version < "v14" && m.on("socket", (E) => {
      let C;
      E.prependListener("end", () => {
        C = E._eventsCount;
      }), E.prependListener("close", (A) => {
        if (g && C < E._eventsCount && !A) {
          const $ = new Error("Premature close");
          $.code = "ERR_STREAM_PREMATURE_CLOSE", g.body.emit("error", $);
        }
      });
    }), m.on("response", (E) => {
      m.setTimeout(0);
      const C = fg(E.rawHeaders);
      if (Td(E.statusCode)) {
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
            const ae = {
              headers: new fr(i.headers),
              follow: i.follow,
              counter: i.counter + 1,
              agent: i.agent,
              compress: i.compress,
              method: i.method,
              body: nu(i),
              signal: i.signal,
              size: i.size,
              referrer: i.referrer,
              referrerPolicy: i.referrerPolicy
            };
            if (!og(i.url, te) || !ag(i.url, te))
              for (const Fe of ["authorization", "www-authenticate", "cookie", "cookie2"])
                ae.headers.delete(Fe);
            if (E.statusCode !== 303 && i.body && t.body instanceof Vt.Readable) {
              n(new Gt("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), b();
              return;
            }
            (E.statusCode === 303 || (E.statusCode === 301 || E.statusCode === 302) && i.method === "POST") && (ae.method = "GET", ae.body = void 0, ae.headers.delete("content-length"));
            const Q = bg(C);
            Q && (ae.referrerPolicy = Q), r(ur(new zi(te, ae))), b();
            return;
          }
          default:
            return n(new TypeError(`Redirect option '${i.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      c && E.once("end", () => {
        c.removeEventListener("abort", h);
      });
      let A = Un(E, new ka(), (x) => {
        x && n(x);
      });
      process.version < "v12.10" && E.on("aborted", h);
      const $ = {
        url: i.url,
        status: E.statusCode,
        statusText: E.statusMessage,
        headers: C,
        size: i.size,
        counter: i.counter,
        highWaterMark: i.highWaterMark
      }, I = C.get("Content-Encoding");
      if (!i.compress || i.method === "HEAD" || I === null || E.statusCode === 204 || E.statusCode === 304) {
        g = new gt(A, $), r(g);
        return;
      }
      const M = {
        flush: xn.Z_SYNC_FLUSH,
        finishFlush: xn.Z_SYNC_FLUSH
      };
      if (I === "gzip" || I === "x-gzip") {
        A = Un(A, xn.createGunzip(M), (x) => {
          x && n(x);
        }), g = new gt(A, $), r(g);
        return;
      }
      if (I === "deflate" || I === "x-deflate") {
        const x = Un(E, new ka(), (te) => {
          te && n(te);
        });
        x.once("data", (te) => {
          (te[0] & 15) === 8 ? A = Un(A, xn.createInflate(), (ae) => {
            ae && n(ae);
          }) : A = Un(A, xn.createInflateRaw(), (ae) => {
            ae && n(ae);
          }), g = new gt(A, $), r(g);
        }), x.once("end", () => {
          g || (g = new gt(A, $), r(g));
        });
        return;
      }
      if (I === "br") {
        A = Un(A, xn.createBrotliDecompress(), (x) => {
          x && n(x);
        }), g = new gt(A, $), r(g);
        return;
      }
      g = new gt(A, $), r(g);
    }), cg(m, i).catch(n);
  });
}
function vg(e, t) {
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
class Cg extends tu {
  constructor() {
    super(...arguments);
    Ie(this, "creds", null);
    Ie(this, "timer", null);
    Ie(this, "phase", "Unknown");
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
      const u = (await ur(a, { headers: { Authorization: `Basic ${s}` } }).then(
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
const Ul = /* @__PURE__ */ new Map();
async function Rg() {
  if (Ul.size) return;
  (await ur("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json").then((r) => r.json())).forEach((r) => Ul.set(r.id, r.alias));
}
class Tg extends tu {
  constructor() {
    super(...arguments);
    Ie(this, "creds", null);
    Ie(this, "summonerId", null);
    Ie(this, "poller", null);
    Ie(this, "currentChampion", 0);
    Ie(this, "lastAppliedChampion", 0);
    Ie(this, "includeDefaultSkin", !0);
    Ie(this, "selectedSkinId", 0);
    Ie(this, "selectedChromaId", 0);
    Ie(this, "profileIconId", 0);
    Ie(this, "autoRollEnabled", !0);
    Ie(this, "skins", []);
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
      championAlias: Ul.get(this.currentChampion) ?? "",
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
      const u = await ur(a, {
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
        await ur(a, {
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
    await Rg();
    const { protocol: r, port: n, password: i } = this.creds, a = `${r}://127.0.0.1:${n}`, s = {
      Authorization: `Basic ${Buffer.from(`riot:${i}`).toString(
        "base64"
      )}`
    }, u = await ur(
      `${a}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
      { headers: s }
    ).then((g) => g.json()), c = [];
    for (const g of u.filter(
      (d) => {
        var h;
        return ((h = d.ownership) == null ? void 0 : h.owned) || d.isOwned || d.owned;
      }
    )) {
      let d = [];
      try {
        d = (await ur(
          `${a}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins/${g.id}/chromas`,
          { headers: s }
        ).then((m) => m.status === 404 ? [] : m.json())).filter((m) => {
          var b;
          return ((b = m.ownership) == null ? void 0 : b.owned) || m.isOwned || m.owned;
        }).map((m) => ({ id: m.id, name: m.name || `Chroma ${m.id}` }));
      } catch {
      }
      c.push({ id: g.id, name: g.name, chromas: d });
    }
    if (this.skins = c, this.emit("skins", c), this.autoRollEnabled && this.currentChampion !== this.lastAppliedChampion && c.length) {
      const g = this.includeDefaultSkin ? c : c.filter((m) => m.id % 1e3 !== 0) || c, d = g[Math.floor(Math.random() * g.length)], h = d.chromas.length ? d.chromas[Math.floor(Math.random() * d.chromas.length)].id : d.id;
      await this.applySkin(h), this.selectedSkinId = d.id, this.selectedChromaId = h !== d.id ? h : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
    }
  }
  async applySkin(r) {
    if (!this.creds) return;
    const { protocol: n, port: i, password: a } = this.creds, s = `${n}://127.0.0.1:${i}/lol-champ-select/v1/session/my-selection`, u = Buffer.from(`riot:${a}`).toString("base64");
    try {
      await ur(s, {
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
      const c = (await ur(a, {
        headers: { Authorization: `Basic ${s}` }
      }).then((m) => m.json())).selectedSkinId ?? 0;
      if (!c || c === this.selectedChromaId || c === this.selectedSkinId)
        return;
      let g = c, d = 0;
      const h = this.skins.find((m) => m.id === c);
      if (h)
        g = h.id;
      else
        for (const m of this.skins) {
          const b = m.chromas.find((E) => E.id === c);
          if (b) {
            g = m.id, d = b.id;
            break;
          }
        }
      this.selectedSkinId = g, this.selectedChromaId = d, this.emit("selection", this.getSelection());
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
var rn = {}, hn = {}, et = {};
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
var Ar = Gm, Ag = process.cwd, Oa = null, Pg = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Oa || (Oa = Ag.call(process)), Oa;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var wc = process.chdir;
  process.chdir = function(e) {
    Oa = null, wc.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, wc);
}
var $g = Ig;
function Ig(e) {
  Ar.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = a(e.chown), e.fchown = a(e.fchown), e.lchown = a(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = u(e.stat), e.fstat = u(e.fstat), e.lstat = u(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(d, h, m) {
    m && process.nextTick(m);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(d, h, m, b) {
    b && process.nextTick(b);
  }, e.lchownSync = function() {
  }), Pg === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(d) {
    function h(m, b, E) {
      var C = Date.now(), A = 0;
      d(m, b, function $(I) {
        if (I && (I.code === "EACCES" || I.code === "EPERM" || I.code === "EBUSY") && Date.now() - C < 6e4) {
          setTimeout(function() {
            e.stat(b, function(M, x) {
              M && M.code === "ENOENT" ? d(m, b, $) : E(I);
            });
          }, A), A < 100 && (A += 10);
          return;
        }
        E && E(I);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(h, d), h;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(d) {
    function h(m, b, E, C, A, $) {
      var I;
      if ($ && typeof $ == "function") {
        var M = 0;
        I = function(x, te, ae) {
          if (x && x.code === "EAGAIN" && M < 10)
            return M++, d.call(e, m, b, E, C, A, I);
          $.apply(this, arguments);
        };
      }
      return d.call(e, m, b, E, C, A, I);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(h, d), h;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(d) {
    return function(h, m, b, E, C) {
      for (var A = 0; ; )
        try {
          return d.call(e, h, m, b, E, C);
        } catch ($) {
          if ($.code === "EAGAIN" && A < 10) {
            A++;
            continue;
          }
          throw $;
        }
    };
  }(e.readSync);
  function t(d) {
    d.lchmod = function(h, m, b) {
      d.open(
        h,
        Ar.O_WRONLY | Ar.O_SYMLINK,
        m,
        function(E, C) {
          if (E) {
            b && b(E);
            return;
          }
          d.fchmod(C, m, function(A) {
            d.close(C, function($) {
              b && b(A || $);
            });
          });
        }
      );
    }, d.lchmodSync = function(h, m) {
      var b = d.openSync(h, Ar.O_WRONLY | Ar.O_SYMLINK, m), E = !0, C;
      try {
        C = d.fchmodSync(b, m), E = !1;
      } finally {
        if (E)
          try {
            d.closeSync(b);
          } catch {
          }
        else
          d.closeSync(b);
      }
      return C;
    };
  }
  function r(d) {
    Ar.hasOwnProperty("O_SYMLINK") && d.futimes ? (d.lutimes = function(h, m, b, E) {
      d.open(h, Ar.O_SYMLINK, function(C, A) {
        if (C) {
          E && E(C);
          return;
        }
        d.futimes(A, m, b, function($) {
          d.close(A, function(I) {
            E && E($ || I);
          });
        });
      });
    }, d.lutimesSync = function(h, m, b) {
      var E = d.openSync(h, Ar.O_SYMLINK), C, A = !0;
      try {
        C = d.futimesSync(E, m, b), A = !1;
      } finally {
        if (A)
          try {
            d.closeSync(E);
          } catch {
          }
        else
          d.closeSync(E);
      }
      return C;
    }) : d.futimes && (d.lutimes = function(h, m, b, E) {
      E && process.nextTick(E);
    }, d.lutimesSync = function() {
    });
  }
  function n(d) {
    return d && function(h, m, b) {
      return d.call(e, h, m, function(E) {
        g(E) && (E = null), b && b.apply(this, arguments);
      });
    };
  }
  function i(d) {
    return d && function(h, m) {
      try {
        return d.call(e, h, m);
      } catch (b) {
        if (!g(b)) throw b;
      }
    };
  }
  function a(d) {
    return d && function(h, m, b, E) {
      return d.call(e, h, m, b, function(C) {
        g(C) && (C = null), E && E.apply(this, arguments);
      });
    };
  }
  function s(d) {
    return d && function(h, m, b) {
      try {
        return d.call(e, h, m, b);
      } catch (E) {
        if (!g(E)) throw E;
      }
    };
  }
  function u(d) {
    return d && function(h, m, b) {
      typeof m == "function" && (b = m, m = null);
      function E(C, A) {
        A && (A.uid < 0 && (A.uid += 4294967296), A.gid < 0 && (A.gid += 4294967296)), b && b.apply(this, arguments);
      }
      return m ? d.call(e, h, m, E) : d.call(e, h, E);
    };
  }
  function c(d) {
    return d && function(h, m) {
      var b = m ? d.call(e, h, m) : d.call(e, h);
      return b && (b.uid < 0 && (b.uid += 4294967296), b.gid < 0 && (b.gid += 4294967296)), b;
    };
  }
  function g(d) {
    if (!d || d.code === "ENOSYS")
      return !0;
    var h = !process.getuid || process.getuid() !== 0;
    return !!(h && (d.code === "EINVAL" || d.code === "EPERM"));
  }
}
var Ec = co.Stream, Og = Dg;
function Dg(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Ec.call(this);
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
    e.open(this.path, this.flags, this.mode, function(d, h) {
      if (d) {
        a.emit("error", d), a.readable = !1;
        return;
      }
      a.fd = h, a.emit("open", h), a._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Ec.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var Ng = kg, Fg = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function kg(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Fg(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ve = Ur, Lg = $g, xg = Og, Ug = Ng, pa = ru, je, Ma;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (je = Symbol.for("graceful-fs.queue"), Ma = Symbol.for("graceful-fs.previous")) : (je = "___graceful-fs.queue", Ma = "___graceful-fs.previous");
function Bg() {
}
function Pd(e, t) {
  Object.defineProperty(e, je, {
    get: function() {
      return t;
    }
  });
}
var ln = Bg;
pa.debuglog ? ln = pa.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (ln = function() {
  var e = pa.format.apply(pa, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ve[je]) {
  var Mg = Be[je] || [];
  Pd(ve, Mg), ve.close = function(e) {
    function t(r, n) {
      return e.call(ve, r, function(i) {
        i || Sc(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Ma, {
      value: e
    }), t;
  }(ve.close), ve.closeSync = function(e) {
    function t(r) {
      e.apply(ve, arguments), Sc();
    }
    return Object.defineProperty(t, Ma, {
      value: e
    }), t;
  }(ve.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    ln(ve[je]), _d.equal(ve[je].length, 0);
  });
}
Be[je] || Pd(Be, ve[je]);
var tt = iu(Ug(ve));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ve.__patched && (tt = iu(ve), ve.__patched = !0);
function iu(e) {
  Lg(e), e.gracefulify = iu, e.createReadStream = te, e.createWriteStream = ae;
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
  var d = /^v[0-5]\./;
  function h(S, re, Z) {
    typeof re == "function" && (Z = re, re = null);
    var X = d.test(process.version) ? function(D, B, N, q) {
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
    var m = xg(e);
    $ = m.ReadStream, M = m.WriteStream;
  }
  var b = e.ReadStream;
  b && ($.prototype = Object.create(b.prototype), $.prototype.open = I);
  var E = e.WriteStream;
  E && (M.prototype = Object.create(E.prototype), M.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return $;
    },
    set: function(S) {
      $ = S;
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
  var C = $;
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
  function $(S, re) {
    return this instanceof $ ? (b.apply(this, arguments), this) : $.apply(Object.create($.prototype), arguments);
  }
  function I() {
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
  function ae(S, re) {
    return new e.WriteStream(S, re);
  }
  var Q = e.open;
  e.open = Fe;
  function Fe(S, re, Z, X) {
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
  ln("ENQUEUE", e[0].name, e[1]), ve[je].push(e), ou();
}
var ma;
function Sc() {
  for (var e = Date.now(), t = 0; t < ve[je].length; ++t)
    ve[je][t].length > 2 && (ve[je][t][3] = e, ve[je][t][4] = e);
  ou();
}
function ou() {
  if (clearTimeout(ma), ma = void 0, ve[je].length !== 0) {
    var e = ve[je].shift(), t = e[0], r = e[1], n = e[2], i = e[3], a = e[4];
    if (i === void 0)
      ln("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      ln("TIMEOUT", t.name, r);
      var s = r.pop();
      typeof s == "function" && s.call(null, n);
    } else {
      var u = Date.now() - a, c = Math.max(a - i, 1), g = Math.min(c * 1.2, 100);
      u >= g ? (ln("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ve[je].push(e);
    }
    ma === void 0 && (ma = setTimeout(ou, 0));
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
    return typeof g == "function" ? r.read(i, a, s, u, c, g) : new Promise((d, h) => {
      r.read(i, a, s, u, c, (m, b, E) => {
        if (m) return h(m);
        d({ bytesRead: b, buffer: E });
      });
    });
  }, e.write = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.write(i, a, ...s) : new Promise((u, c) => {
      r.write(i, a, ...s, (g, d, h) => {
        if (g) return c(g);
        u({ bytesWritten: d, buffer: h });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, a, ...s) {
    return typeof s[s.length - 1] == "function" ? r.writev(i, a, ...s) : new Promise((u, c) => {
      r.writev(i, a, ...s, (g, d, h) => {
        if (g) return c(g);
        u({ bytesWritten: d, buffers: h });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(hn);
var au = {}, $d = {};
const qg = Ce;
$d.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(qg.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Id = hn, { checkPath: Od } = $d, Dd = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
au.makeDir = async (e, t) => (Od(e), Id.mkdir(e, {
  mode: Dd(t),
  recursive: !0
}));
au.makeDirSync = (e, t) => (Od(e), Id.mkdirSync(e, {
  mode: Dd(t),
  recursive: !0
}));
const jg = et.fromPromise, { makeDir: Wg, makeDirSync: nl } = au, il = jg(Wg);
var Xt = {
  mkdirs: il,
  mkdirsSync: nl,
  // alias
  mkdirp: il,
  mkdirpSync: nl,
  ensureDir: il,
  ensureDirSync: nl
};
const Hg = et.fromPromise, Nd = hn;
function zg(e) {
  return Nd.access(e).then(() => !0).catch(() => !1);
}
var pn = {
  pathExists: Hg(zg),
  pathExistsSync: Nd.existsSync
};
const Zn = tt;
function Gg(e, t, r, n) {
  Zn.open(e, "r+", (i, a) => {
    if (i) return n(i);
    Zn.futimes(a, t, r, (s) => {
      Zn.close(a, (u) => {
        n && n(s || u);
      });
    });
  });
}
function Vg(e, t, r) {
  const n = Zn.openSync(e, "r+");
  return Zn.futimesSync(n, t, r), Zn.closeSync(n);
}
var Fd = {
  utimesMillis: Gg,
  utimesMillisSync: Vg
};
const ri = hn, Ue = Ce, Yg = ru;
function Xg(e, t, r) {
  const n = r.dereference ? (i) => ri.stat(i, { bigint: !0 }) : (i) => ri.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, a]) => ({ srcStat: i, destStat: a }));
}
function Qg(e, t, r) {
  let n;
  const i = r.dereference ? (s) => ri.statSync(s, { bigint: !0 }) : (s) => ri.lstatSync(s, { bigint: !0 }), a = i(e);
  try {
    n = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: a, destStat: null };
    throw s;
  }
  return { srcStat: a, destStat: n };
}
function Kg(e, t, r, n, i) {
  Yg.callbackify(Xg)(e, t, n, (a, s) => {
    if (a) return i(a);
    const { srcStat: u, destStat: c } = s;
    if (c) {
      if (ho(u, c)) {
        const g = Ue.basename(e), d = Ue.basename(t);
        return r === "move" && g !== d && g.toLowerCase() === d.toLowerCase() ? i(null, { srcStat: u, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (u.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!u.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return u.isDirectory() && su(e, t) ? i(new Error(os(e, t, r))) : i(null, { srcStat: u, destStat: c });
  });
}
function Jg(e, t, r, n) {
  const { srcStat: i, destStat: a } = Qg(e, t, n);
  if (a) {
    if (ho(i, a)) {
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
  if (i.isDirectory() && su(e, t))
    throw new Error(os(e, t, r));
  return { srcStat: i, destStat: a };
}
function kd(e, t, r, n, i) {
  const a = Ue.resolve(Ue.dirname(e)), s = Ue.resolve(Ue.dirname(r));
  if (s === a || s === Ue.parse(s).root) return i();
  ri.stat(s, { bigint: !0 }, (u, c) => u ? u.code === "ENOENT" ? i() : i(u) : ho(t, c) ? i(new Error(os(e, r, n))) : kd(e, t, s, n, i));
}
function Ld(e, t, r, n) {
  const i = Ue.resolve(Ue.dirname(e)), a = Ue.resolve(Ue.dirname(r));
  if (a === i || a === Ue.parse(a).root) return;
  let s;
  try {
    s = ri.statSync(a, { bigint: !0 });
  } catch (u) {
    if (u.code === "ENOENT") return;
    throw u;
  }
  if (ho(t, s))
    throw new Error(os(e, r, n));
  return Ld(e, t, a, n);
}
function ho(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function su(e, t) {
  const r = Ue.resolve(e).split(Ue.sep).filter((i) => i), n = Ue.resolve(t).split(Ue.sep).filter((i) => i);
  return r.reduce((i, a, s) => i && n[s] === a, !0);
}
function os(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var si = {
  checkPaths: Kg,
  checkPathsSync: Jg,
  checkParentPaths: kd,
  checkParentPathsSync: Ld,
  isSrcSubdir: su,
  areIdentical: ho
};
const ct = tt, Gi = Ce, Zg = Xt.mkdirs, ey = pn.pathExists, ty = Fd.utimesMillis, Vi = si;
function ry(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Vi.checkPaths(e, t, "copy", r, (i, a) => {
    if (i) return n(i);
    const { srcStat: s, destStat: u } = a;
    Vi.checkParentPaths(e, s, t, "copy", (c) => c ? n(c) : r.filter ? xd(vc, u, e, t, r, n) : vc(u, e, t, r, n));
  });
}
function vc(e, t, r, n, i) {
  const a = Gi.dirname(r);
  ey(a, (s, u) => {
    if (s) return i(s);
    if (u) return qa(e, t, r, n, i);
    Zg(a, (c) => c ? i(c) : qa(e, t, r, n, i));
  });
}
function xd(e, t, r, n, i, a) {
  Promise.resolve(i.filter(r, n)).then((s) => s ? e(t, r, n, i, a) : a(), (s) => a(s));
}
function ny(e, t, r, n, i) {
  return n.filter ? xd(qa, e, t, r, n, i) : qa(e, t, r, n, i);
}
function qa(e, t, r, n, i) {
  (n.dereference ? ct.stat : ct.lstat)(t, (s, u) => s ? i(s) : u.isDirectory() ? cy(u, e, t, r, n, i) : u.isFile() || u.isCharacterDevice() || u.isBlockDevice() ? iy(u, e, t, r, n, i) : u.isSymbolicLink() ? hy(e, t, r, n, i) : u.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : u.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function iy(e, t, r, n, i, a) {
  return t ? oy(e, r, n, i, a) : Ud(e, r, n, i, a);
}
function oy(e, t, r, n, i) {
  if (n.overwrite)
    ct.unlink(r, (a) => a ? i(a) : Ud(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function Ud(e, t, r, n, i) {
  ct.copyFile(t, r, (a) => a ? i(a) : n.preserveTimestamps ? ay(e.mode, t, r, i) : as(r, e.mode, i));
}
function ay(e, t, r, n) {
  return sy(e) ? ly(r, e, (i) => i ? n(i) : Cc(e, t, r, n)) : Cc(e, t, r, n);
}
function sy(e) {
  return (e & 128) === 0;
}
function ly(e, t, r) {
  return as(e, t | 128, r);
}
function Cc(e, t, r, n) {
  uy(t, r, (i) => i ? n(i) : as(r, e, n));
}
function as(e, t, r) {
  return ct.chmod(e, t, r);
}
function uy(e, t, r) {
  ct.stat(e, (n, i) => n ? r(n) : ty(t, i.atime, i.mtime, r));
}
function cy(e, t, r, n, i, a) {
  return t ? Bd(r, n, i, a) : fy(e.mode, r, n, i, a);
}
function fy(e, t, r, n, i) {
  ct.mkdir(r, (a) => {
    if (a) return i(a);
    Bd(t, r, n, (s) => s ? i(s) : as(r, e, i));
  });
}
function Bd(e, t, r, n) {
  ct.readdir(e, (i, a) => i ? n(i) : Md(a, e, t, r, n));
}
function Md(e, t, r, n, i) {
  const a = e.pop();
  return a ? dy(e, a, t, r, n, i) : i();
}
function dy(e, t, r, n, i, a) {
  const s = Gi.join(r, t), u = Gi.join(n, t);
  Vi.checkPaths(s, u, "copy", i, (c, g) => {
    if (c) return a(c);
    const { destStat: d } = g;
    ny(d, s, u, i, (h) => h ? a(h) : Md(e, r, n, i, a));
  });
}
function hy(e, t, r, n, i) {
  ct.readlink(t, (a, s) => {
    if (a) return i(a);
    if (n.dereference && (s = Gi.resolve(process.cwd(), s)), e)
      ct.readlink(r, (u, c) => u ? u.code === "EINVAL" || u.code === "UNKNOWN" ? ct.symlink(s, r, i) : i(u) : (n.dereference && (c = Gi.resolve(process.cwd(), c)), Vi.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Vi.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : py(s, r, i)));
    else
      return ct.symlink(s, r, i);
  });
}
function py(e, t, r) {
  ct.unlink(t, (n) => n ? r(n) : ct.symlink(e, t, r));
}
var my = ry;
const Ge = tt, Yi = Ce, gy = Xt.mkdirsSync, yy = Fd.utimesMillisSync, Xi = si;
function by(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Xi.checkPathsSync(e, t, "copy", r);
  return Xi.checkParentPathsSync(e, n, t, "copy"), _y(i, e, t, r);
}
function _y(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Yi.dirname(r);
  return Ge.existsSync(i) || gy(i), qd(e, t, r, n);
}
function wy(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return qd(e, t, r, n);
}
function qd(e, t, r, n) {
  const a = (n.dereference ? Ge.statSync : Ge.lstatSync)(t);
  if (a.isDirectory()) return Ay(a, e, t, r, n);
  if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return Ey(a, e, t, r, n);
  if (a.isSymbolicLink()) return Iy(e, t, r, n);
  throw a.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Ey(e, t, r, n, i) {
  return t ? Sy(e, r, n, i) : jd(e, r, n, i);
}
function Sy(e, t, r, n) {
  if (n.overwrite)
    return Ge.unlinkSync(r), jd(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function jd(e, t, r, n) {
  return Ge.copyFileSync(t, r), n.preserveTimestamps && vy(e.mode, t, r), lu(r, e.mode);
}
function vy(e, t, r) {
  return Cy(e) && Ry(r, e), Ty(t, r);
}
function Cy(e) {
  return (e & 128) === 0;
}
function Ry(e, t) {
  return lu(e, t | 128);
}
function lu(e, t) {
  return Ge.chmodSync(e, t);
}
function Ty(e, t) {
  const r = Ge.statSync(e);
  return yy(t, r.atime, r.mtime);
}
function Ay(e, t, r, n, i) {
  return t ? Wd(r, n, i) : Py(e.mode, r, n, i);
}
function Py(e, t, r, n) {
  return Ge.mkdirSync(r), Wd(t, r, n), lu(r, e);
}
function Wd(e, t, r) {
  Ge.readdirSync(e).forEach((n) => $y(n, e, t, r));
}
function $y(e, t, r, n) {
  const i = Yi.join(t, e), a = Yi.join(r, e), { destStat: s } = Xi.checkPathsSync(i, a, "copy", n);
  return wy(s, i, a, n);
}
function Iy(e, t, r, n) {
  let i = Ge.readlinkSync(t);
  if (n.dereference && (i = Yi.resolve(process.cwd(), i)), e) {
    let a;
    try {
      a = Ge.readlinkSync(r);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Ge.symlinkSync(i, r);
      throw s;
    }
    if (n.dereference && (a = Yi.resolve(process.cwd(), a)), Xi.isSrcSubdir(i, a))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`);
    if (Ge.statSync(r).isDirectory() && Xi.isSrcSubdir(a, i))
      throw new Error(`Cannot overwrite '${a}' with '${i}'.`);
    return Oy(i, r);
  } else
    return Ge.symlinkSync(i, r);
}
function Oy(e, t) {
  return Ge.unlinkSync(t), Ge.symlinkSync(e, t);
}
var Dy = by;
const Ny = et.fromCallback;
var uu = {
  copy: Ny(my),
  copySync: Dy
};
const Rc = tt, Hd = Ce, ye = _d, Qi = process.platform === "win32";
function zd(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Rc[r], r = r + "Sync", e[r] = e[r] || Rc[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function cu(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), ye(e, "rimraf: missing path"), ye.strictEqual(typeof e, "string", "rimraf: path should be a string"), ye.strictEqual(typeof r, "function", "rimraf: callback function required"), ye(t, "rimraf: invalid options argument provided"), ye.strictEqual(typeof t, "object", "rimraf: options should be object"), zd(t), Tc(e, t, function i(a) {
    if (a) {
      if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const s = n * 100;
        return setTimeout(() => Tc(e, t, i), s);
      }
      a.code === "ENOENT" && (a = null);
    }
    r(a);
  });
}
function Tc(e, t, r) {
  ye(e), ye(t), ye(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && Qi)
      return Ac(e, t, n, r);
    if (i && i.isDirectory())
      return Da(e, t, n, r);
    t.unlink(e, (a) => {
      if (a) {
        if (a.code === "ENOENT")
          return r(null);
        if (a.code === "EPERM")
          return Qi ? Ac(e, t, a, r) : Da(e, t, a, r);
        if (a.code === "EISDIR")
          return Da(e, t, a, r);
      }
      return r(a);
    });
  });
}
function Ac(e, t, r, n) {
  ye(e), ye(t), ye(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (a, s) => {
      a ? n(a.code === "ENOENT" ? null : r) : s.isDirectory() ? Da(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Pc(e, t, r) {
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
  n.isDirectory() ? Na(e, t, r) : t.unlinkSync(e);
}
function Da(e, t, r, n) {
  ye(e), ye(t), ye(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Fy(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Fy(e, t, r) {
  ye(e), ye(t), ye(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let a = i.length, s;
    if (a === 0) return t.rmdir(e, r);
    i.forEach((u) => {
      cu(Hd.join(e, u), t, (c) => {
        if (!s) {
          if (c) return r(s = c);
          --a === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function Gd(e, t) {
  let r;
  t = t || {}, zd(t), ye(e, "rimraf: missing path"), ye.strictEqual(typeof e, "string", "rimraf: path should be a string"), ye(t, "rimraf: missing options"), ye.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && Qi && Pc(e, t, n);
  }
  try {
    r && r.isDirectory() ? Na(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return Qi ? Pc(e, t, n) : Na(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Na(e, t, n);
  }
}
function Na(e, t, r) {
  ye(e), ye(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      ky(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function ky(e, t) {
  if (ye(e), ye(t), t.readdirSync(e).forEach((r) => Gd(Hd.join(e, r), t)), Qi) {
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
var Ly = cu;
cu.sync = Gd;
const ja = tt, xy = et.fromCallback, Vd = Ly;
function Uy(e, t) {
  if (ja.rm) return ja.rm(e, { recursive: !0, force: !0 }, t);
  Vd(e, t);
}
function By(e) {
  if (ja.rmSync) return ja.rmSync(e, { recursive: !0, force: !0 });
  Vd.sync(e);
}
var ss = {
  remove: xy(Uy),
  removeSync: By
};
const My = et.fromPromise, Yd = hn, Xd = Ce, Qd = Xt, Kd = ss, $c = My(async function(t) {
  let r;
  try {
    r = await Yd.readdir(t);
  } catch {
    return Qd.mkdirs(t);
  }
  return Promise.all(r.map((n) => Kd.remove(Xd.join(t, n))));
});
function Ic(e) {
  let t;
  try {
    t = Yd.readdirSync(e);
  } catch {
    return Qd.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Xd.join(e, r), Kd.removeSync(r);
  });
}
var qy = {
  emptyDirSync: Ic,
  emptydirSync: Ic,
  emptyDir: $c,
  emptydir: $c
};
const jy = et.fromCallback, Jd = Ce, Ir = tt, Zd = Xt;
function Wy(e, t) {
  function r() {
    Ir.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  Ir.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const a = Jd.dirname(e);
    Ir.stat(a, (s, u) => {
      if (s)
        return s.code === "ENOENT" ? Zd.mkdirs(a, (c) => {
          if (c) return t(c);
          r();
        }) : t(s);
      u.isDirectory() ? r() : Ir.readdir(a, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function Hy(e) {
  let t;
  try {
    t = Ir.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = Jd.dirname(e);
  try {
    Ir.statSync(r).isDirectory() || Ir.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") Zd.mkdirsSync(r);
    else throw n;
  }
  Ir.writeFileSync(e, "");
}
var zy = {
  createFile: jy(Wy),
  createFileSync: Hy
};
const Gy = et.fromCallback, eh = Ce, $r = tt, th = Xt, Vy = pn.pathExists, { areIdentical: rh } = si;
function Yy(e, t, r) {
  function n(i, a) {
    $r.link(i, a, (s) => {
      if (s) return r(s);
      r(null);
    });
  }
  $r.lstat(t, (i, a) => {
    $r.lstat(e, (s, u) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), r(s);
      if (a && rh(u, a)) return r(null);
      const c = eh.dirname(t);
      Vy(c, (g, d) => {
        if (g) return r(g);
        if (d) return n(e, t);
        th.mkdirs(c, (h) => {
          if (h) return r(h);
          n(e, t);
        });
      });
    });
  });
}
function Xy(e, t) {
  let r;
  try {
    r = $r.lstatSync(t);
  } catch {
  }
  try {
    const a = $r.lstatSync(e);
    if (r && rh(a, r)) return;
  } catch (a) {
    throw a.message = a.message.replace("lstat", "ensureLink"), a;
  }
  const n = eh.dirname(t);
  return $r.existsSync(n) || th.mkdirsSync(n), $r.linkSync(e, t);
}
var Qy = {
  createLink: Gy(Yy),
  createLinkSync: Xy
};
const Or = Ce, Ui = tt, Ky = pn.pathExists;
function Jy(e, t, r) {
  if (Or.isAbsolute(e))
    return Ui.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = Or.dirname(t), i = Or.join(n, e);
    return Ky(i, (a, s) => a ? r(a) : s ? r(null, {
      toCwd: i,
      toDst: e
    }) : Ui.lstat(e, (u) => u ? (u.message = u.message.replace("lstat", "ensureSymlink"), r(u)) : r(null, {
      toCwd: e,
      toDst: Or.relative(n, e)
    })));
  }
}
function Zy(e, t) {
  let r;
  if (Or.isAbsolute(e)) {
    if (r = Ui.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = Or.dirname(t), i = Or.join(n, e);
    if (r = Ui.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Ui.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Or.relative(n, e)
    };
  }
}
var e0 = {
  symlinkPaths: Jy,
  symlinkPathsSync: Zy
};
const nh = tt;
function t0(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  nh.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function r0(e, t) {
  let r;
  if (t) return t;
  try {
    r = nh.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var n0 = {
  symlinkType: t0,
  symlinkTypeSync: r0
};
const i0 = et.fromCallback, ih = Ce, $t = hn, oh = Xt, o0 = oh.mkdirs, a0 = oh.mkdirsSync, ah = e0, s0 = ah.symlinkPaths, l0 = ah.symlinkPathsSync, sh = n0, u0 = sh.symlinkType, c0 = sh.symlinkTypeSync, f0 = pn.pathExists, { areIdentical: lh } = si;
function d0(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, $t.lstat(t, (i, a) => {
    !i && a.isSymbolicLink() ? Promise.all([
      $t.stat(e),
      $t.stat(t)
    ]).then(([s, u]) => {
      if (lh(s, u)) return n(null);
      Oc(e, t, r, n);
    }) : Oc(e, t, r, n);
  });
}
function Oc(e, t, r, n) {
  s0(e, t, (i, a) => {
    if (i) return n(i);
    e = a.toDst, u0(a.toCwd, r, (s, u) => {
      if (s) return n(s);
      const c = ih.dirname(t);
      f0(c, (g, d) => {
        if (g) return n(g);
        if (d) return $t.symlink(e, t, u, n);
        o0(c, (h) => {
          if (h) return n(h);
          $t.symlink(e, t, u, n);
        });
      });
    });
  });
}
function h0(e, t, r) {
  let n;
  try {
    n = $t.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const u = $t.statSync(e), c = $t.statSync(t);
    if (lh(u, c)) return;
  }
  const i = l0(e, t);
  e = i.toDst, r = c0(i.toCwd, r);
  const a = ih.dirname(t);
  return $t.existsSync(a) || a0(a), $t.symlinkSync(e, t, r);
}
var p0 = {
  createSymlink: i0(d0),
  createSymlinkSync: h0
};
const { createFile: Dc, createFileSync: Nc } = zy, { createLink: Fc, createLinkSync: kc } = Qy, { createSymlink: Lc, createSymlinkSync: xc } = p0;
var m0 = {
  // file
  createFile: Dc,
  createFileSync: Nc,
  ensureFile: Dc,
  ensureFileSync: Nc,
  // link
  createLink: Fc,
  createLinkSync: kc,
  ensureLink: Fc,
  ensureLinkSync: kc,
  // symlink
  createSymlink: Lc,
  createSymlinkSync: xc,
  ensureSymlink: Lc,
  ensureSymlinkSync: xc
};
function g0(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const a = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + a;
}
function y0(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var fu = { stringify: g0, stripBom: y0 };
let ni;
try {
  ni = tt;
} catch {
  ni = Ur;
}
const ls = et, { stringify: uh, stripBom: ch } = fu;
async function b0(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || ni, n = "throws" in t ? t.throws : !0;
  let i = await ls.fromCallback(r.readFile)(e, t);
  i = ch(i);
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
const _0 = ls.fromPromise(b0);
function w0(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || ni, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = ch(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function E0(e, t, r = {}) {
  const n = r.fs || ni, i = uh(t, r);
  await ls.fromCallback(n.writeFile)(e, i, r);
}
const S0 = ls.fromPromise(E0);
function v0(e, t, r = {}) {
  const n = r.fs || ni, i = uh(t, r);
  return n.writeFileSync(e, i, r);
}
const C0 = {
  readFile: _0,
  readFileSync: w0,
  writeFile: S0,
  writeFileSync: v0
};
var R0 = C0;
const ga = R0;
var T0 = {
  // jsonfile exports
  readJson: ga.readFile,
  readJsonSync: ga.readFileSync,
  writeJson: ga.writeFile,
  writeJsonSync: ga.writeFileSync
};
const A0 = et.fromCallback, Bi = tt, fh = Ce, dh = Xt, P0 = pn.pathExists;
function $0(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = fh.dirname(e);
  P0(i, (a, s) => {
    if (a) return n(a);
    if (s) return Bi.writeFile(e, t, r, n);
    dh.mkdirs(i, (u) => {
      if (u) return n(u);
      Bi.writeFile(e, t, r, n);
    });
  });
}
function I0(e, ...t) {
  const r = fh.dirname(e);
  if (Bi.existsSync(r))
    return Bi.writeFileSync(e, ...t);
  dh.mkdirsSync(r), Bi.writeFileSync(e, ...t);
}
var du = {
  outputFile: A0($0),
  outputFileSync: I0
};
const { stringify: O0 } = fu, { outputFile: D0 } = du;
async function N0(e, t, r = {}) {
  const n = O0(t, r);
  await D0(e, n, r);
}
var F0 = N0;
const { stringify: k0 } = fu, { outputFileSync: L0 } = du;
function x0(e, t, r) {
  const n = k0(t, r);
  L0(e, n, r);
}
var U0 = x0;
const B0 = et.fromPromise, Ze = T0;
Ze.outputJson = B0(F0);
Ze.outputJsonSync = U0;
Ze.outputJSON = Ze.outputJson;
Ze.outputJSONSync = Ze.outputJsonSync;
Ze.writeJSON = Ze.writeJson;
Ze.writeJSONSync = Ze.writeJsonSync;
Ze.readJSON = Ze.readJson;
Ze.readJSONSync = Ze.readJsonSync;
var M0 = Ze;
const q0 = tt, Bl = Ce, j0 = uu.copy, hh = ss.remove, W0 = Xt.mkdirp, H0 = pn.pathExists, Uc = si;
function z0(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Uc.checkPaths(e, t, "move", r, (a, s) => {
    if (a) return n(a);
    const { srcStat: u, isChangingCase: c = !1 } = s;
    Uc.checkParentPaths(e, u, t, "move", (g) => {
      if (g) return n(g);
      if (G0(t)) return Bc(e, t, i, c, n);
      W0(Bl.dirname(t), (d) => d ? n(d) : Bc(e, t, i, c, n));
    });
  });
}
function G0(e) {
  const t = Bl.dirname(e);
  return Bl.parse(t).root === t;
}
function Bc(e, t, r, n, i) {
  if (n) return ol(e, t, r, i);
  if (r)
    return hh(t, (a) => a ? i(a) : ol(e, t, r, i));
  H0(t, (a, s) => a ? i(a) : s ? i(new Error("dest already exists.")) : ol(e, t, r, i));
}
function ol(e, t, r, n) {
  q0.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : V0(e, t, r, n) : n());
}
function V0(e, t, r, n) {
  j0(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (a) => a ? n(a) : hh(e, n));
}
var Y0 = z0;
const ph = tt, Ml = Ce, X0 = uu.copySync, mh = ss.removeSync, Q0 = Xt.mkdirpSync, Mc = si;
function K0(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: a = !1 } = Mc.checkPathsSync(e, t, "move", r);
  return Mc.checkParentPathsSync(e, i, t, "move"), J0(t) || Q0(Ml.dirname(t)), Z0(e, t, n, a);
}
function J0(e) {
  const t = Ml.dirname(e);
  return Ml.parse(t).root === t;
}
function Z0(e, t, r, n) {
  if (n) return al(e, t, r);
  if (r)
    return mh(t), al(e, t, r);
  if (ph.existsSync(t)) throw new Error("dest already exists.");
  return al(e, t, r);
}
function al(e, t, r) {
  try {
    ph.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return eb(e, t, r);
  }
}
function eb(e, t, r) {
  return X0(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), mh(e);
}
var tb = K0;
const rb = et.fromCallback;
var nb = {
  move: rb(Y0),
  moveSync: tb
}, Br = {
  // Export promiseified graceful-fs:
  ...hn,
  // Export extra methods:
  ...uu,
  ...qy,
  ...m0,
  ...M0,
  ...Xt,
  ...nb,
  ...du,
  ...pn,
  ...ss
}, hr = {}, Nr = {}, Me = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.CancellationError = Fr.CancellationToken = void 0;
const ib = wd;
class ob extends ib.EventEmitter {
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
      return Promise.reject(new ql());
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
          a(new ql());
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
Fr.CancellationToken = ob;
class ql extends Error {
  constructor() {
    super("cancelled");
  }
}
Fr.CancellationError = ql;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.newError = ab;
function ab(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Ke = {}, jl = { exports: {} }, ya = { exports: {} }, sl, qc;
function sb() {
  if (qc) return sl;
  qc = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, a = n * 365.25;
  sl = function(d, h) {
    h = h || {};
    var m = typeof d;
    if (m === "string" && d.length > 0)
      return s(d);
    if (m === "number" && isFinite(d))
      return h.long ? c(d) : u(d);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(d)
    );
  };
  function s(d) {
    if (d = String(d), !(d.length > 100)) {
      var h = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        d
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
  function u(d) {
    var h = Math.abs(d);
    return h >= n ? Math.round(d / n) + "d" : h >= r ? Math.round(d / r) + "h" : h >= t ? Math.round(d / t) + "m" : h >= e ? Math.round(d / e) + "s" : d + "ms";
  }
  function c(d) {
    var h = Math.abs(d);
    return h >= n ? g(d, h, n, "day") : h >= r ? g(d, h, r, "hour") : h >= t ? g(d, h, t, "minute") : h >= e ? g(d, h, e, "second") : d + " ms";
  }
  function g(d, h, m, b) {
    var E = h >= m * 1.5;
    return Math.round(d / m) + " " + b + (E ? "s" : "");
  }
  return sl;
}
var ll, jc;
function gh() {
  if (jc) return ll;
  jc = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = g, n.disable = u, n.enable = a, n.enabled = c, n.humanize = sb(), n.destroy = d, Object.keys(t).forEach((h) => {
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
      function A(...$) {
        if (!A.enabled)
          return;
        const I = A, M = Number(/* @__PURE__ */ new Date()), x = M - (m || M);
        I.diff = x, I.prev = m, I.curr = M, m = M, $[0] = n.coerce($[0]), typeof $[0] != "string" && $.unshift("%O");
        let te = 0;
        $[0] = $[0].replace(/%([a-zA-Z%])/g, (Q, Fe) => {
          if (Q === "%%")
            return "%";
          te++;
          const S = n.formatters[Fe];
          if (typeof S == "function") {
            const re = $[te];
            Q = S.call(I, re), $.splice(te, 1), te--;
          }
          return Q;
        }), n.formatArgs.call(I, $), (I.log || n.log).apply(I, $);
      }
      return A.namespace = h, A.useColors = n.useColors(), A.color = n.selectColor(h), A.extend = i, A.destroy = n.destroy, Object.defineProperty(A, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => b !== null ? b : (E !== n.namespaces && (E = n.namespaces, C = n.enabled(h)), C),
        set: ($) => {
          b = $;
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
    function d() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return ll = e, ll;
}
var Wc;
function lb() {
  return Wc || (Wc = 1, function(e, t) {
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
      let d = 0, h = 0;
      c[0].replace(/%[a-zA-Z%]/g, (m) => {
        m !== "%%" && (d++, m === "%c" && (h = d));
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
    e.exports = gh()(t);
    const { formatters: u } = e.exports;
    u.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (g) {
        return "[UnexpectedJSONParseError]: " + g.message;
      }
    };
  }(ya, ya.exports)), ya.exports;
}
var ba = { exports: {} }, ul, Hc;
function ub() {
  return Hc || (Hc = 1, ul = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ul;
}
var cl, zc;
function cb() {
  if (zc) return cl;
  zc = 1;
  const e = ns, t = Ed, r = ub(), { env: n } = process;
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
    const d = i || 0;
    if (n.TERM === "dumb")
      return d;
    if (process.platform === "win32") {
      const h = e.release().split(".");
      return Number(h[0]) >= 10 && Number(h[2]) >= 10586 ? Number(h[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((h) => h in n) || n.CI_NAME === "codeship" ? 1 : d;
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
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : d;
  }
  function u(c) {
    const g = s(c, c && c.isTTY);
    return a(g);
  }
  return cl = {
    supportsColor: u,
    stdout: a(s(!0, t.isatty(1))),
    stderr: a(s(!0, t.isatty(2)))
  }, cl;
}
var Gc;
function fb() {
  return Gc || (Gc = 1, function(e, t) {
    const r = Ed, n = ru;
    t.init = d, t.log = u, t.formatArgs = a, t.save = c, t.load = g, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const m = cb();
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
      const E = b.substring(6).toLowerCase().replace(/_([a-z])/g, (A, $) => $.toUpperCase());
      let C = process.env[b];
      return /^(yes|on|true|enabled)$/i.test(C) ? C = !0 : /^(no|off|false|disabled)$/i.test(C) ? C = !1 : C === "null" ? C = null : C = Number(C), m[E] = C, m;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function a(m) {
      const { namespace: b, useColors: E } = this;
      if (E) {
        const C = this.color, A = "\x1B[3" + (C < 8 ? C : "8;5;" + C), $ = `  ${A};1m${b} \x1B[0m`;
        m[0] = $ + m[0].split(`
`).join(`
` + $), m.push(A + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
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
    function d(m) {
      m.inspectOpts = {};
      const b = Object.keys(t.inspectOpts);
      for (let E = 0; E < b.length; E++)
        m.inspectOpts[b[E]] = t.inspectOpts[b[E]];
    }
    e.exports = gh()(t);
    const { formatters: h } = e.exports;
    h.o = function(m) {
      return this.inspectOpts.colors = this.useColors, n.inspect(m, this.inspectOpts).split(`
`).map((b) => b.trim()).join(" ");
    }, h.O = function(m) {
      return this.inspectOpts.colors = this.useColors, n.inspect(m, this.inspectOpts);
    };
  }(ba, ba.exports)), ba.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? jl.exports = lb() : jl.exports = fb();
var db = jl.exports, po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
po.ProgressCallbackTransform = void 0;
const hb = co;
class pb extends hb.Transform {
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
po.ProgressCallbackTransform = pb;
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.DigestTransform = Ke.HttpExecutor = Ke.HttpError = void 0;
Ke.createHttpError = Wl;
Ke.parseJson = Sb;
Ke.configureRequestOptionsFromUrl = bh;
Ke.configureRequestUrl = pu;
Ke.safeGetHeader = ei;
Ke.configureRequestOptions = Ha;
Ke.safeStringifyJson = za;
const mb = fo, gb = db, yb = Ur, bb = co, yh = ai, _b = Fr, Vc = li, wb = po, Ii = (0, gb.default)("electron-builder");
function Wl(e, t = null) {
  return new hu(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + za(e.headers), t);
}
const Eb = /* @__PURE__ */ new Map([
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
class hu extends Error {
  constructor(t, r = `HTTP error: ${Eb.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Ke.HttpError = hu;
function Sb(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Wa {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new _b.CancellationToken(), n) {
    Ha(t);
    const i = n == null ? void 0 : JSON.stringify(n), a = i ? Buffer.from(i) : void 0;
    if (a != null) {
      Ii(i);
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
    return Ii.enabled && Ii(`Request: ${za(t)}`), r.createPromise((a, s, u) => {
      const c = this.createRequest(t, (g) => {
        try {
          this.handleResponse(g, t, r, a, s, i, n);
        } catch (d) {
          s(d);
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
    if (Ii.enabled && Ii(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${za(r)}`), t.statusCode === 404) {
      a(Wl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const g = (c = t.statusCode) !== null && c !== void 0 ? c : 0, d = g >= 300 && g < 400, h = ei(t, "location");
    if (d && h != null) {
      if (s > this.maxRedirects) {
        a(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Wa.prepareRedirectUrlOptions(h, r), n, u, s).then(i).catch(a);
      return;
    }
    t.setEncoding("utf8");
    let m = "";
    t.on("error", a), t.on("data", (b) => m += b), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const b = ei(t, "content-type"), E = b != null && (Array.isArray(b) ? b.find((C) => C.includes("json")) != null : b.includes("json"));
          a(Wl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

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
      pu(t, u), Ha(u), this.doDownload(u, {
        destination: null,
        options: r,
        onCancel: a,
        callback: (c) => {
          c == null ? n(Buffer.concat(s)) : i(c);
        },
        responseHandler: (c, g) => {
          let d = 0;
          c.on("data", (h) => {
            if (d += h.length, d > 524288e3) {
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
        n < this.maxRedirects ? this.doDownload(Wa.prepareRedirectUrlOptions(s, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Cb(r, a) : r.responseHandler(a, r.callback);
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
    const n = bh(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const a = new yh.URL(t);
      (a.hostname.endsWith(".amazonaws.com") || a.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof hu && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Ke.HttpExecutor = Wa;
function bh(e, t) {
  const r = Ha(t);
  return pu(new yh.URL(e), r), r;
}
function pu(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Hl extends bb.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, mb.createHash)(r);
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
      throw (0, Vc.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Vc.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Ke.DigestTransform = Hl;
function vb(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function ei(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Cb(e, t) {
  if (!vb(ei(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const s = ei(t, "content-length");
    s != null && r.push(new wb.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Hl(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Hl(e.options.sha2, "sha256", "hex"));
  const i = (0, yb.createWriteStream)(e.destination);
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
function Ha(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function za(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.MemoLazy = void 0;
class Rb {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && _h(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
us.MemoLazy = Rb;
function _h(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), a = Object.keys(t);
    return i.length === a.length && i.every((s) => _h(e[s], t[s]));
  }
  return e === t;
}
var cs = {};
Object.defineProperty(cs, "__esModule", { value: !0 });
cs.githubUrl = Tb;
cs.getS3LikeProviderBaseUrl = Ab;
function Tb(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Ab(e) {
  const t = e.provider;
  if (t === "s3")
    return Pb(e);
  if (t === "spaces")
    return $b(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Pb(e) {
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
  return wh(t, e.path);
}
function wh(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function $b(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return wh(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var mu = {};
Object.defineProperty(mu, "__esModule", { value: !0 });
mu.retry = Eh;
const Ib = Fr;
async function Eh(e, t, r, n = 0, i = 0, a) {
  var s;
  const u = new Ib.CancellationToken();
  try {
    return await e();
  } catch (c) {
    if ((!((s = a == null ? void 0 : a(c)) !== null && s !== void 0) || s) && t > 0 && !u.cancelled)
      return await new Promise((g) => setTimeout(g, r + n * i)), await Eh(e, t - 1, r, n, i + 1, a);
    throw c;
  }
}
var gu = {};
Object.defineProperty(gu, "__esModule", { value: !0 });
gu.parseDn = Ob;
function Ob(e) {
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
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
ii.nil = ii.UUID = void 0;
const Sh = fo, vh = li, Db = "options.name must be either a string or a Buffer", Yc = (0, Sh.randomBytes)(16);
Yc[0] = Yc[0] | 1;
const Fa = {}, ue = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Fa[t] = e, ue[e] = t;
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
    return Nb(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Fb(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Fa[t[14] + t[15]] & 240) >> 4,
        variant: Xc((Fa[t[19] + t[20]] & 224) >> 5),
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
        variant: Xc((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, vh.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Fa[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
ii.UUID = dn;
dn.OID = dn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Xc(e) {
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
var Mi;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Mi || (Mi = {}));
function Nb(e, t, r, n, i = Mi.ASCII) {
  const a = (0, Sh.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, vh.newError)(Db, "ERR_INVALID_UUID_NAME");
  a.update(n), a.update(e);
  const u = a.digest();
  let c;
  switch (i) {
    case Mi.BINARY:
      u[6] = u[6] & 15 | r, u[8] = u[8] & 63 | 128, c = u;
      break;
    case Mi.OBJECT:
      u[6] = u[6] & 15 | r, u[8] = u[8] & 63 | 128, c = new dn(u);
      break;
    default:
      c = ue[u[0]] + ue[u[1]] + ue[u[2]] + ue[u[3]] + "-" + ue[u[4]] + ue[u[5]] + "-" + ue[u[6] & 15 | r] + ue[u[7]] + "-" + ue[u[8] & 63 | 128] + ue[u[9]] + "-" + ue[u[10]] + ue[u[11]] + ue[u[12]] + ue[u[13]] + ue[u[14]] + ue[u[15]];
      break;
  }
  return c;
}
function Fb(e) {
  return ue[e[0]] + ue[e[1]] + ue[e[2]] + ue[e[3]] + "-" + ue[e[4]] + ue[e[5]] + "-" + ue[e[6]] + ue[e[7]] + "-" + ue[e[8]] + ue[e[9]] + "-" + ue[e[10]] + ue[e[11]] + ue[e[12]] + ue[e[13]] + ue[e[14]] + ue[e[15]];
}
ii.nil = new dn("00000000-0000-0000-0000-000000000000");
var mo = {}, Ch = {};
(function(e) {
  (function(t) {
    t.parser = function(y, p) {
      return new n(y, p);
    }, t.SAXParser = n, t.SAXStream = d, t.createStream = g, t.MAX_BUFFER_LENGTH = 64 * 1024;
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
      return new d(y, p);
    }
    function d(y, p) {
      if (!(this instanceof d))
        return new d(y, p);
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
    d.prototype = Object.create(u.prototype, {
      constructor: {
        value: d
      }
    }), d.prototype.write = function(y) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(y)) {
        if (!this._decoder) {
          var p = Vm.StringDecoder;
          this._decoder = new p("utf8");
        }
        y = this._decoder.write(y);
      }
      return this._parser.write(y.toString()), this.emit("data", y), !0;
    }, d.prototype.end = function(y) {
      return y && y.length && this.write(y), this._parser.end(), !0;
    }, d.prototype.on = function(y, p) {
      var F = this;
      return !F._parser["on" + y] && c.indexOf(y) !== -1 && (F._parser["on" + y] = function() {
        var T = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        T.splice(0, 0, y), F.emit.apply(F, T);
      }), u.prototype.on.call(F, y, p);
    };
    var h = "[CDATA[", m = "DOCTYPE", b = "http://www.w3.org/XML/1998/namespace", E = "http://www.w3.org/2000/xmlns/", C = { xml: b, xmlns: E }, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, $ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, I = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, M = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
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
        F.ns && se.ns !== F.ns && Object.keys(F.ns).forEach(function(dt) {
          X(y, "onopennamespace", {
            prefix: dt,
            uri: F.ns[dt]
          });
        });
        for (var pe = 0, we = y.attribList.length; pe < we; pe++) {
          var De = y.attribList[pe], Ae = De[0], yt = De[1], be = U(Ae, !0), it = be.prefix, qr = be.local, Qt = it === "" ? "" : F.ns[it] || "", pr = {
            name: Ae,
            value: yt,
            prefix: it,
            local: qr,
            uri: Qt
          };
          it && it !== "xmlns" && !Qt && (N(y, "Unbound namespace prefix: " + JSON.stringify(it)), pr.uri = it), y.tag.attributes[Ae] = pr, X(y, "onattribute", pr);
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
            Q($, T) ? p.tagName += T : (q(p), T === ">" ? ie(p) : T === "/" ? p.state = S.OPEN_TAG_SLASH : (x(T) || N(p, "Invalid character in tag name"), p.state = S.ATTRIB));
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
            T === "=" ? p.state = S.ATTRIB_VALUE : T === ">" ? (N(p, "Attribute without value"), p.attribValue = p.attribName, V(p), ie(p)) : x(T) ? p.state = S.ATTRIB_NAME_SAW_WHITE : Q($, T) ? p.attribName += T : N(p, "Invalid attribute name");
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
              T === ">" ? ee(p) : Q($, T) ? p.tagName += T : p.script ? (p.script += "</" + p.tagName, p.tagName = "", p.state = S.SCRIPT) : (x(T) || N(p, "Invalid tagname in closing tag"), p.state = S.CLOSE_TAG_SAW_WHITE);
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
              var Ae = fe(p);
              p.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ae) ? (p.entity = "", p.state = we, p.write(Ae)) : (p[De] += Ae, p.entity = "", p.state = we);
            } else Q(p.entity.length ? M : I, T) ? p.entity += T : (N(p, "Invalid character in entity name"), p[De] += "&" + p.entity + T, p.entity = "", p.state = we);
            continue;
          default:
            throw new Error(p, "Unknown state: " + p.state);
        }
      return p.position >= p.bufferCheckPosition && i(p), p;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var y = String.fromCharCode, p = Math.floor, F = function() {
        var T = 16384, se = [], pe, we, De = -1, Ae = arguments.length;
        if (!Ae)
          return "";
        for (var yt = ""; ++De < Ae; ) {
          var be = Number(arguments[De]);
          if (!isFinite(be) || // `NaN`, `+Infinity`, or `-Infinity`
          be < 0 || // not a valid Unicode code point
          be > 1114111 || // not a valid Unicode code point
          p(be) !== be)
            throw RangeError("Invalid code point: " + be);
          be <= 65535 ? se.push(be) : (be -= 65536, pe = (be >> 10) + 55296, we = be % 1024 + 56320, se.push(pe, we)), (De + 1 === Ae || se.length > T) && (yt += y.apply(null, se), se.length = 0);
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
})(Ch);
Object.defineProperty(mo, "__esModule", { value: !0 });
mo.XElement = void 0;
mo.parseXml = Ub;
const kb = Ch, _a = li;
class Rh {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, _a.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!xb(t))
      throw (0, _a.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, _a.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, _a.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (Qc(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => Qc(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
mo.XElement = Rh;
const Lb = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function xb(e) {
  return Lb.test(e);
}
function Qc(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Ub(e) {
  let t = null;
  const r = kb.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const a = new Rh(i.name);
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
  var r = li;
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
  var i = us;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var a = po;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return a.ProgressCallbackTransform;
  } });
  var s = cs;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } });
  var u = mu;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return u.retry;
  } });
  var c = gu;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var g = ii;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return g.UUID;
  } });
  var d = mo;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return d.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return d.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function h(m) {
    return m == null ? [] : Array.isArray(m) ? m : [m];
  }
})(Me);
var We = {}, yu = {}, Ot = {};
function Th(e) {
  return typeof e > "u" || e === null;
}
function Bb(e) {
  return typeof e == "object" && e !== null;
}
function Mb(e) {
  return Array.isArray(e) ? e : Th(e) ? [] : [e];
}
function qb(e, t) {
  var r, n, i, a;
  if (t)
    for (a = Object.keys(t), r = 0, n = a.length; r < n; r += 1)
      i = a[r], e[i] = t[i];
  return e;
}
function jb(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Wb(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ot.isNothing = Th;
Ot.isObject = Bb;
Ot.toArray = Mb;
Ot.repeat = jb;
Ot.isNegativeZero = Wb;
Ot.extend = qb;
function Ah(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Ki(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Ah(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Ki.prototype = Object.create(Error.prototype);
Ki.prototype.constructor = Ki;
Ki.prototype.toString = function(t) {
  return this.name + ": " + Ah(this, t);
};
var go = Ki, ki = Ot;
function fl(e, t, r, n, i) {
  var a = "", s = "", u = Math.floor(i / 2) - 1;
  return n - t > u && (a = " ... ", t = n - u + a.length), r - n > u && (s = " ...", r = n + u - s.length), {
    str: a + e.slice(t, r).replace(/\t/g, "→") + s,
    pos: n - t + a.length
    // relative position
  };
}
function dl(e, t) {
  return ki.repeat(" ", t - e.length) + e;
}
function Hb(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], a, s = -1; a = r.exec(e.buffer); )
    i.push(a.index), n.push(a.index + a[0].length), e.position <= a.index && s < 0 && (s = n.length - 2);
  s < 0 && (s = n.length - 1);
  var u = "", c, g, d = Math.min(e.line + t.linesAfter, i.length).toString().length, h = t.maxLength - (t.indent + d + 3);
  for (c = 1; c <= t.linesBefore && !(s - c < 0); c++)
    g = fl(
      e.buffer,
      n[s - c],
      i[s - c],
      e.position - (n[s] - n[s - c]),
      h
    ), u = ki.repeat(" ", t.indent) + dl((e.line - c + 1).toString(), d) + " | " + g.str + `
` + u;
  for (g = fl(e.buffer, n[s], i[s], e.position, h), u += ki.repeat(" ", t.indent) + dl((e.line + 1).toString(), d) + " | " + g.str + `
`, u += ki.repeat("-", t.indent + d + 3 + g.pos) + `^
`, c = 1; c <= t.linesAfter && !(s + c >= i.length); c++)
    g = fl(
      e.buffer,
      n[s + c],
      i[s + c],
      e.position - (n[s] - n[s + c]),
      h
    ), u += ki.repeat(" ", t.indent) + dl((e.line + c + 1).toString(), d) + " | " + g.str + `
`;
  return u.replace(/\n$/, "");
}
var zb = Hb, Kc = go, Gb = [
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
], Vb = [
  "scalar",
  "sequence",
  "mapping"
];
function Yb(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function Xb(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Gb.indexOf(r) === -1)
      throw new Kc('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Yb(t.styleAliases || null), Vb.indexOf(this.kind) === -1)
    throw new Kc('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var rt = Xb, Oi = go, hl = rt;
function Jc(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(a, s) {
      a.tag === n.tag && a.kind === n.kind && a.multi === n.multi && (i = s);
    }), r[i] = n;
  }), r;
}
function Qb() {
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
function zl(e) {
  return this.extend(e);
}
zl.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof hl)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Oi("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(a) {
    if (!(a instanceof hl))
      throw new Oi("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (a.loadKind && a.loadKind !== "scalar")
      throw new Oi("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (a.multi)
      throw new Oi("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(a) {
    if (!(a instanceof hl))
      throw new Oi("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(zl.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Jc(i, "implicit"), i.compiledExplicit = Jc(i, "explicit"), i.compiledTypeMap = Qb(i.compiledImplicit, i.compiledExplicit), i;
};
var Ph = zl, Kb = rt, $h = new Kb("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Jb = rt, Ih = new Jb("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Zb = rt, Oh = new Zb("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), e_ = Ph, Dh = new e_({
  explicit: [
    $h,
    Ih,
    Oh
  ]
}), t_ = rt;
function r_(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function n_() {
  return null;
}
function i_(e) {
  return e === null;
}
var Nh = new t_("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: r_,
  construct: n_,
  predicate: i_,
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
}), o_ = rt;
function a_(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function s_(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function l_(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Fh = new o_("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: a_,
  construct: s_,
  predicate: l_,
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
}), u_ = Ot, c_ = rt;
function f_(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function d_(e) {
  return 48 <= e && e <= 55;
}
function h_(e) {
  return 48 <= e && e <= 57;
}
function p_(e) {
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
          if (!f_(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!d_(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!h_(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function m_(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function g_(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !u_.isNegativeZero(e);
}
var kh = new c_("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: p_,
  construct: m_,
  predicate: g_,
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
}), Lh = Ot, y_ = rt, b_ = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function __(e) {
  return !(e === null || !b_.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function w_(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var E_ = /^[-+]?[0-9]+e/;
function S_(e, t) {
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
  else if (Lh.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), E_.test(r) ? r.replace("e", ".e") : r;
}
function v_(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Lh.isNegativeZero(e));
}
var xh = new y_("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: __,
  construct: w_,
  predicate: v_,
  represent: S_,
  defaultStyle: "lowercase"
}), Uh = Dh.extend({
  implicit: [
    Nh,
    Fh,
    kh,
    xh
  ]
}), Bh = Uh, C_ = rt, Mh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), qh = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function R_(e) {
  return e === null ? !1 : Mh.exec(e) !== null || qh.exec(e) !== null;
}
function T_(e) {
  var t, r, n, i, a, s, u, c = 0, g = null, d, h, m;
  if (t = Mh.exec(e), t === null && (t = qh.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (a = +t[4], s = +t[5], u = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (d = +t[10], h = +(t[11] || 0), g = (d * 60 + h) * 6e4, t[9] === "-" && (g = -g)), m = new Date(Date.UTC(r, n, i, a, s, u, c)), g && m.setTime(m.getTime() - g), m;
}
function A_(e) {
  return e.toISOString();
}
var jh = new C_("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: R_,
  construct: T_,
  instanceOf: Date,
  represent: A_
}), P_ = rt;
function $_(e) {
  return e === "<<" || e === null;
}
var Wh = new P_("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: $_
}), I_ = rt, bu = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function O_(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, a = bu;
  for (r = 0; r < i; r++)
    if (t = a.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function D_(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, a = bu, s = 0, u = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (u.push(s >> 16 & 255), u.push(s >> 8 & 255), u.push(s & 255)), s = s << 6 | a.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (u.push(s >> 16 & 255), u.push(s >> 8 & 255), u.push(s & 255)) : r === 18 ? (u.push(s >> 10 & 255), u.push(s >> 2 & 255)) : r === 12 && u.push(s >> 4 & 255), new Uint8Array(u);
}
function N_(e) {
  var t = "", r = 0, n, i, a = e.length, s = bu;
  for (n = 0; n < a; n++)
    n % 3 === 0 && n && (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]), r = (r << 8) + e[n];
  return i = a % 3, i === 0 ? (t += s[r >> 18 & 63], t += s[r >> 12 & 63], t += s[r >> 6 & 63], t += s[r & 63]) : i === 2 ? (t += s[r >> 10 & 63], t += s[r >> 4 & 63], t += s[r << 2 & 63], t += s[64]) : i === 1 && (t += s[r >> 2 & 63], t += s[r << 4 & 63], t += s[64], t += s[64]), t;
}
function F_(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Hh = new I_("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: O_,
  construct: D_,
  predicate: F_,
  represent: N_
}), k_ = rt, L_ = Object.prototype.hasOwnProperty, x_ = Object.prototype.toString;
function U_(e) {
  if (e === null) return !0;
  var t = [], r, n, i, a, s, u = e;
  for (r = 0, n = u.length; r < n; r += 1) {
    if (i = u[r], s = !1, x_.call(i) !== "[object Object]") return !1;
    for (a in i)
      if (L_.call(i, a))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(a) === -1) t.push(a);
    else return !1;
  }
  return !0;
}
function B_(e) {
  return e !== null ? e : [];
}
var zh = new k_("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: U_,
  construct: B_
}), M_ = rt, q_ = Object.prototype.toString;
function j_(e) {
  if (e === null) return !0;
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1) {
    if (n = s[t], q_.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    a[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function W_(e) {
  if (e === null) return [];
  var t, r, n, i, a, s = e;
  for (a = new Array(s.length), t = 0, r = s.length; t < r; t += 1)
    n = s[t], i = Object.keys(n), a[t] = [i[0], n[i[0]]];
  return a;
}
var Gh = new M_("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: j_,
  construct: W_
}), H_ = rt, z_ = Object.prototype.hasOwnProperty;
function G_(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (z_.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function V_(e) {
  return e !== null ? e : {};
}
var Vh = new H_("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: G_,
  construct: V_
}), _u = Bh.extend({
  implicit: [
    jh,
    Wh
  ],
  explicit: [
    Hh,
    zh,
    Gh,
    Vh
  ]
}), an = Ot, Yh = go, Y_ = zb, X_ = _u, kr = Object.prototype.hasOwnProperty, Ga = 1, Xh = 2, Qh = 3, Va = 4, pl = 1, Q_ = 2, Zc = 3, K_ = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, J_ = /[\x85\u2028\u2029]/, Z_ = /[,\[\]\{\}]/, Kh = /^(?:!|!!|![a-z\-]+!)$/i, Jh = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function ef(e) {
  return Object.prototype.toString.call(e);
}
function Yt(e) {
  return e === 10 || e === 13;
}
function un(e) {
  return e === 9 || e === 32;
}
function ft(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Yn(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function ew(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function tw(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function rw(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function tf(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function nw(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
var Zh = new Array(256), ep = new Array(256);
for (var qn = 0; qn < 256; qn++)
  Zh[qn] = tf(qn) ? 1 : 0, ep[qn] = tf(qn);
function iw(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || X_, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function tp(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Y_(r), new Yh(t, r);
}
function H(e, t) {
  throw tp(e, t);
}
function Ya(e, t) {
  e.onWarning && e.onWarning.call(null, tp(e, t));
}
var rf = {
  YAML: function(t, r, n) {
    var i, a, s;
    t.version !== null && H(t, "duplication of %YAML directive"), n.length !== 1 && H(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && H(t, "ill-formed argument of the YAML directive"), a = parseInt(i[1], 10), s = parseInt(i[2], 10), a !== 1 && H(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Ya(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, a;
    n.length !== 2 && H(t, "TAG directive accepts exactly two arguments"), i = n[0], a = n[1], Kh.test(i) || H(t, "ill-formed tag handle (first argument) of the TAG directive"), kr.call(t.tagMap, i) && H(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Jh.test(a) || H(t, "ill-formed tag prefix (second argument) of the TAG directive");
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
    else K_.test(u) && H(e, "the stream contains non-printable characters");
    e.result += u;
  }
}
function nf(e, t, r, n) {
  var i, a, s, u;
  for (an.isObject(r) || H(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), s = 0, u = i.length; s < u; s += 1)
    a = i[s], kr.call(t, a) || (t[a] = r[a], n[a] = !0);
}
function Xn(e, t, r, n, i, a, s, u, c) {
  var g, d;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), g = 0, d = i.length; g < d; g += 1)
      Array.isArray(i[g]) && H(e, "nested arrays are not supported inside keys"), typeof i == "object" && ef(i[g]) === "[object Object]" && (i[g] = "[object Object]");
  if (typeof i == "object" && ef(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(a))
      for (g = 0, d = a.length; g < d; g += 1)
        nf(e, t, a[g], r);
    else
      nf(e, t, a, r);
  else
    !e.json && !kr.call(r, i) && kr.call(t, i) && (e.line = s || e.line, e.lineStart = u || e.lineStart, e.position = c || e.position, H(e, "duplicated mapping key")), i === "__proto__" ? Object.defineProperty(t, i, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: a
    }) : t[i] = a, delete r[i];
  return t;
}
function wu(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : H(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Oe(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; un(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Yt(i))
      for (wu(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Ya(e, "deficient indentation"), n;
}
function fs(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || ft(r)));
}
function Eu(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += an.repeat(`
`, t - 1));
}
function ow(e, t, r) {
  var n, i, a, s, u, c, g, d, h = e.kind, m = e.result, b;
  if (b = e.input.charCodeAt(e.position), ft(b) || Yn(b) || b === 35 || b === 38 || b === 42 || b === 33 || b === 124 || b === 62 || b === 39 || b === 34 || b === 37 || b === 64 || b === 96 || (b === 63 || b === 45) && (i = e.input.charCodeAt(e.position + 1), ft(i) || r && Yn(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", a = s = e.position, u = !1; b !== 0; ) {
    if (b === 58) {
      if (i = e.input.charCodeAt(e.position + 1), ft(i) || r && Yn(i))
        break;
    } else if (b === 35) {
      if (n = e.input.charCodeAt(e.position - 1), ft(n))
        break;
    } else {
      if (e.position === e.lineStart && fs(e) || r && Yn(b))
        break;
      if (Yt(b))
        if (c = e.line, g = e.lineStart, d = e.lineIndent, Oe(e, !1, -1), e.lineIndent >= t) {
          u = !0, b = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = c, e.lineStart = g, e.lineIndent = d;
          break;
        }
    }
    u && (Dr(e, a, s, !1), Eu(e, e.line - c), a = s = e.position, u = !1), un(b) || (s = e.position + 1), b = e.input.charCodeAt(++e.position);
  }
  return Dr(e, a, s, !1), e.result ? !0 : (e.kind = h, e.result = m, !1);
}
function aw(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (Dr(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Yt(r) ? (Dr(e, n, i, !0), Eu(e, Oe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && fs(e) ? H(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  H(e, "unexpected end of the stream within a single quoted scalar");
}
function sw(e, t) {
  var r, n, i, a, s, u;
  if (u = e.input.charCodeAt(e.position), u !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (u = e.input.charCodeAt(e.position)) !== 0; ) {
    if (u === 34)
      return Dr(e, r, e.position, !0), e.position++, !0;
    if (u === 92) {
      if (Dr(e, r, e.position, !0), u = e.input.charCodeAt(++e.position), Yt(u))
        Oe(e, !1, t);
      else if (u < 256 && Zh[u])
        e.result += ep[u], e.position++;
      else if ((s = tw(u)) > 0) {
        for (i = s, a = 0; i > 0; i--)
          u = e.input.charCodeAt(++e.position), (s = ew(u)) >= 0 ? a = (a << 4) + s : H(e, "expected hexadecimal character");
        e.result += nw(a), e.position++;
      } else
        H(e, "unknown escape sequence");
      r = n = e.position;
    } else Yt(u) ? (Dr(e, r, n, !0), Eu(e, Oe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && fs(e) ? H(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  H(e, "unexpected end of the stream within a double quoted scalar");
}
function lw(e, t) {
  var r = !0, n, i, a, s = e.tag, u, c = e.anchor, g, d, h, m, b, E = /* @__PURE__ */ Object.create(null), C, A, $, I;
  if (I = e.input.charCodeAt(e.position), I === 91)
    d = 93, b = !1, u = [];
  else if (I === 123)
    d = 125, b = !0, u = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), I = e.input.charCodeAt(++e.position); I !== 0; ) {
    if (Oe(e, !0, t), I = e.input.charCodeAt(e.position), I === d)
      return e.position++, e.tag = s, e.anchor = c, e.kind = b ? "mapping" : "sequence", e.result = u, !0;
    r ? I === 44 && H(e, "expected the node content, but found ','") : H(e, "missed comma between flow collection entries"), A = C = $ = null, h = m = !1, I === 63 && (g = e.input.charCodeAt(e.position + 1), ft(g) && (h = m = !0, e.position++, Oe(e, !0, t))), n = e.line, i = e.lineStart, a = e.position, oi(e, t, Ga, !1, !0), A = e.tag, C = e.result, Oe(e, !0, t), I = e.input.charCodeAt(e.position), (m || e.line === n) && I === 58 && (h = !0, I = e.input.charCodeAt(++e.position), Oe(e, !0, t), oi(e, t, Ga, !1, !0), $ = e.result), b ? Xn(e, u, E, A, C, $, n, i, a) : h ? u.push(Xn(e, null, E, A, C, $, n, i, a)) : u.push(C), Oe(e, !0, t), I = e.input.charCodeAt(e.position), I === 44 ? (r = !0, I = e.input.charCodeAt(++e.position)) : r = !1;
  }
  H(e, "unexpected end of the stream within a flow collection");
}
function uw(e, t) {
  var r, n, i = pl, a = !1, s = !1, u = t, c = 0, g = !1, d, h;
  if (h = e.input.charCodeAt(e.position), h === 124)
    n = !1;
  else if (h === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; h !== 0; )
    if (h = e.input.charCodeAt(++e.position), h === 43 || h === 45)
      pl === i ? i = h === 43 ? Zc : Q_ : H(e, "repeat of a chomping mode identifier");
    else if ((d = rw(h)) >= 0)
      d === 0 ? H(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? H(e, "repeat of an indentation width identifier") : (u = t + d - 1, s = !0);
    else
      break;
  if (un(h)) {
    do
      h = e.input.charCodeAt(++e.position);
    while (un(h));
    if (h === 35)
      do
        h = e.input.charCodeAt(++e.position);
      while (!Yt(h) && h !== 0);
  }
  for (; h !== 0; ) {
    for (wu(e), e.lineIndent = 0, h = e.input.charCodeAt(e.position); (!s || e.lineIndent < u) && h === 32; )
      e.lineIndent++, h = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > u && (u = e.lineIndent), Yt(h)) {
      c++;
      continue;
    }
    if (e.lineIndent < u) {
      i === Zc ? e.result += an.repeat(`
`, a ? 1 + c : c) : i === pl && a && (e.result += `
`);
      break;
    }
    for (n ? un(h) ? (g = !0, e.result += an.repeat(`
`, a ? 1 + c : c)) : g ? (g = !1, e.result += an.repeat(`
`, c + 1)) : c === 0 ? a && (e.result += " ") : e.result += an.repeat(`
`, c) : e.result += an.repeat(`
`, a ? 1 + c : c), a = !0, s = !0, c = 0, r = e.position; !Yt(h) && h !== 0; )
      h = e.input.charCodeAt(++e.position);
    Dr(e, r, e.position, !1);
  }
  return !0;
}
function of(e, t) {
  var r, n = e.tag, i = e.anchor, a = [], s, u = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), !(c !== 45 || (s = e.input.charCodeAt(e.position + 1), !ft(s)))); ) {
    if (u = !0, e.position++, Oe(e, !0, -1) && e.lineIndent <= t) {
      a.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, oi(e, t, Qh, !1, !0), a.push(e.result), Oe(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      H(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return u ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function cw(e, t, r) {
  var n, i, a, s, u, c, g = e.tag, d = e.anchor, h = {}, m = /* @__PURE__ */ Object.create(null), b = null, E = null, C = null, A = !1, $ = !1, I;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = h), I = e.input.charCodeAt(e.position); I !== 0; ) {
    if (!A && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), a = e.line, (I === 63 || I === 58) && ft(n))
      I === 63 ? (A && (Xn(e, h, m, b, E, null, s, u, c), b = E = C = null), $ = !0, A = !0, i = !0) : A ? (A = !1, i = !0) : H(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, I = n;
    else {
      if (s = e.line, u = e.lineStart, c = e.position, !oi(e, r, Xh, !1, !0))
        break;
      if (e.line === a) {
        for (I = e.input.charCodeAt(e.position); un(I); )
          I = e.input.charCodeAt(++e.position);
        if (I === 58)
          I = e.input.charCodeAt(++e.position), ft(I) || H(e, "a whitespace character is expected after the key-value separator within a block mapping"), A && (Xn(e, h, m, b, E, null, s, u, c), b = E = C = null), $ = !0, A = !1, i = !1, b = e.tag, E = e.result;
        else if ($)
          H(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = g, e.anchor = d, !0;
      } else if ($)
        H(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = g, e.anchor = d, !0;
    }
    if ((e.line === a || e.lineIndent > t) && (A && (s = e.line, u = e.lineStart, c = e.position), oi(e, t, Va, !0, i) && (A ? E = e.result : C = e.result), A || (Xn(e, h, m, b, E, C, s, u, c), b = E = C = null), Oe(e, !0, -1), I = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && I !== 0)
      H(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return A && Xn(e, h, m, b, E, null, s, u, c), $ && (e.tag = g, e.anchor = d, e.kind = "mapping", e.result = h), $;
}
function fw(e) {
  var t, r = !1, n = !1, i, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && H(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (r = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (n = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : H(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !ft(s); )
      s === 33 && (n ? H(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Kh.test(i) || H(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    a = e.input.slice(t, e.position), Z_.test(a) && H(e, "tag suffix cannot contain flow indicator characters");
  }
  a && !Jh.test(a) && H(e, "tag name cannot contain such characters: " + a);
  try {
    a = decodeURIComponent(a);
  } catch {
    H(e, "tag name is malformed: " + a);
  }
  return r ? e.tag = a : kr.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : H(e, 'undeclared tag handle "' + i + '"'), !0;
}
function dw(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && H(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !ft(r) && !Yn(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && H(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function hw(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !ft(n) && !Yn(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && H(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), kr.call(e.anchorMap, r) || H(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Oe(e, !0, -1), !0;
}
function oi(e, t, r, n, i) {
  var a, s, u, c = 1, g = !1, d = !1, h, m, b, E, C, A;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = s = u = Va === r || Qh === r, n && Oe(e, !0, -1) && (g = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; fw(e) || dw(e); )
      Oe(e, !0, -1) ? (g = !0, u = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : u = !1;
  if (u && (u = g || i), (c === 1 || Va === r) && (Ga === r || Xh === r ? C = t : C = t + 1, A = e.position - e.lineStart, c === 1 ? u && (of(e, A) || cw(e, A, C)) || lw(e, C) ? d = !0 : (s && uw(e, C) || aw(e, C) || sw(e, C) ? d = !0 : hw(e) ? (d = !0, (e.tag !== null || e.anchor !== null) && H(e, "alias node should not have any properties")) : ow(e, C, Ga === r) && (d = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (d = u && of(e, A))), e.tag === null)
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
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || d;
}
function pw(e) {
  var t = e.position, r, n, i, a = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (Oe(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (a = !0, s = e.input.charCodeAt(++e.position), r = e.position; s !== 0 && !ft(s); )
      s = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && H(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; un(s); )
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
    s !== 0 && wu(e), kr.call(rf, n) ? rf[n](e, n, i) : Ya(e, 'unknown document directive "' + n + '"');
  }
  if (Oe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Oe(e, !0, -1)) : a && H(e, "directives end mark is expected"), oi(e, e.lineIndent - 1, Va, !1, !0), Oe(e, !0, -1), e.checkLineBreaks && J_.test(e.input.slice(t, e.position)) && Ya(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && fs(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Oe(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    H(e, "end of the stream or a document separator is expected");
  else
    return;
}
function rp(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new iw(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, H(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    pw(r);
  return r.documents;
}
function mw(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = rp(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, a = n.length; i < a; i += 1)
    t(n[i]);
}
function gw(e, t) {
  var r = rp(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new Yh("expected a single document in the stream, but found more");
  }
}
yu.loadAll = mw;
yu.load = gw;
var np = {}, ds = Ot, yo = go, yw = _u, ip = Object.prototype.toString, op = Object.prototype.hasOwnProperty, Su = 65279, bw = 9, Ji = 10, _w = 13, ww = 32, Ew = 33, Sw = 34, Gl = 35, vw = 37, Cw = 38, Rw = 39, Tw = 42, ap = 44, Aw = 45, Xa = 58, Pw = 61, $w = 62, Iw = 63, Ow = 64, sp = 91, lp = 93, Dw = 96, up = 123, Nw = 124, cp = 125, Ve = {};
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
var Fw = [
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
], kw = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Lw(e, t) {
  var r, n, i, a, s, u, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, a = n.length; i < a; i += 1)
    s = n[i], u = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), c = e.compiledTypeMap.fallback[s], c && op.call(c.styleAliases, u) && (u = c.styleAliases[u]), r[s] = u;
  return r;
}
function xw(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new yo("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ds.repeat("0", n - t.length) + t;
}
var Uw = 1, Zi = 2;
function Bw(e) {
  this.schema = e.schema || yw, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ds.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Lw(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Zi : Uw, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function af(e, t) {
  for (var r = ds.repeat(" ", t), n = 0, i = -1, a = "", s, u = e.length; n < u; )
    i = e.indexOf(`
`, n), i === -1 ? (s = e.slice(n), n = u) : (s = e.slice(n, i + 1), n = i + 1), s.length && s !== `
` && (a += r), a += s;
  return a;
}
function Vl(e, t) {
  return `
` + ds.repeat(" ", e.indent * t);
}
function Mw(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Qa(e) {
  return e === ww || e === bw;
}
function eo(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Su || 65536 <= e && e <= 1114111;
}
function sf(e) {
  return eo(e) && e !== Su && e !== _w && e !== Ji;
}
function lf(e, t, r) {
  var n = sf(e), i = n && !Qa(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== ap && e !== sp && e !== lp && e !== up && e !== cp) && e !== Gl && !(t === Xa && !i) || sf(t) && !Qa(t) && e === Gl || t === Xa && i
  );
}
function qw(e) {
  return eo(e) && e !== Su && !Qa(e) && e !== Aw && e !== Iw && e !== Xa && e !== ap && e !== sp && e !== lp && e !== up && e !== cp && e !== Gl && e !== Cw && e !== Tw && e !== Ew && e !== Nw && e !== Pw && e !== $w && e !== Rw && e !== Sw && e !== vw && e !== Ow && e !== Dw;
}
function jw(e) {
  return !Qa(e) && e !== Xa;
}
function Li(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function fp(e) {
  var t = /^\n* /;
  return t.test(e);
}
var dp = 1, Yl = 2, hp = 3, pp = 4, Vn = 5;
function Ww(e, t, r, n, i, a, s, u) {
  var c, g = 0, d = null, h = !1, m = !1, b = n !== -1, E = -1, C = qw(Li(e, 0)) && jw(Li(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; g >= 65536 ? c += 2 : c++) {
      if (g = Li(e, c), !eo(g))
        return Vn;
      C = C && lf(g, d, u), d = g;
    }
  else {
    for (c = 0; c < e.length; g >= 65536 ? c += 2 : c++) {
      if (g = Li(e, c), g === Ji)
        h = !0, b && (m = m || // Foldable line = too long, and not more-indented.
        c - E - 1 > n && e[E + 1] !== " ", E = c);
      else if (!eo(g))
        return Vn;
      C = C && lf(g, d, u), d = g;
    }
    m = m || b && c - E - 1 > n && e[E + 1] !== " ";
  }
  return !h && !m ? C && !s && !i(e) ? dp : a === Zi ? Vn : Yl : r > 9 && fp(e) ? Vn : s ? a === Zi ? Vn : Yl : m ? pp : hp;
}
function Hw(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Zi ? '""' : "''";
    if (!e.noCompatMode && (Fw.indexOf(t) !== -1 || kw.test(t)))
      return e.quotingType === Zi ? '"' + t + '"' : "'" + t + "'";
    var a = e.indent * Math.max(1, r), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), u = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(g) {
      return Mw(e, g);
    }
    switch (Ww(
      t,
      u,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case dp:
        return t;
      case Yl:
        return "'" + t.replace(/'/g, "''") + "'";
      case hp:
        return "|" + uf(t, e.indent) + cf(af(t, a));
      case pp:
        return ">" + uf(t, e.indent) + cf(af(zw(t, s), a));
      case Vn:
        return '"' + Gw(t) + '"';
      default:
        throw new yo("impossible error: invalid scalar style");
    }
  }();
}
function uf(e, t) {
  var r = fp(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), a = i ? "+" : n ? "" : "-";
  return r + a + `
`;
}
function cf(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function zw(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var g = e.indexOf(`
`);
    return g = g !== -1 ? g : e.length, r.lastIndex = g, ff(e.slice(0, g), t);
  }(), i = e[0] === `
` || e[0] === " ", a, s; s = r.exec(e); ) {
    var u = s[1], c = s[2];
    a = c[0] === " ", n += u + (!i && !a && c !== "" ? `
` : "") + ff(c, t), i = a;
  }
  return n;
}
function ff(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, a, s = 0, u = 0, c = ""; n = r.exec(e); )
    u = n.index, u - i > t && (a = s > i ? s : u, c += `
` + e.slice(i, a), i = a + 1), s = u;
  return c += `
`, e.length - i > t && s > i ? c += e.slice(i, s) + `
` + e.slice(s + 1) : c += e.slice(i), c.slice(1);
}
function Gw(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Li(e, i), n = Ve[r], !n && eo(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || xw(r);
  return t;
}
function Vw(e, t, r) {
  var n = "", i = e.tag, a, s, u;
  for (a = 0, s = r.length; a < s; a += 1)
    u = r[a], e.replacer && (u = e.replacer.call(r, String(a), u)), (dr(e, t, u, !1, !1) || typeof u > "u" && dr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function df(e, t, r, n) {
  var i = "", a = e.tag, s, u, c;
  for (s = 0, u = r.length; s < u; s += 1)
    c = r[s], e.replacer && (c = e.replacer.call(r, String(s), c)), (dr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && dr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Vl(e, t)), e.dump && Ji === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = a, e.dump = i || "[]";
}
function Yw(e, t, r) {
  var n = "", i = e.tag, a = Object.keys(r), s, u, c, g, d;
  for (s = 0, u = a.length; s < u; s += 1)
    d = "", n !== "" && (d += ", "), e.condenseFlow && (d += '"'), c = a[s], g = r[c], e.replacer && (g = e.replacer.call(r, c, g)), dr(e, t, c, !1, !1) && (e.dump.length > 1024 && (d += "? "), d += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), dr(e, t, g, !1, !1) && (d += e.dump, n += d));
  e.tag = i, e.dump = "{" + n + "}";
}
function Xw(e, t, r, n) {
  var i = "", a = e.tag, s = Object.keys(r), u, c, g, d, h, m;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new yo("sortKeys must be a boolean or a function");
  for (u = 0, c = s.length; u < c; u += 1)
    m = "", (!n || i !== "") && (m += Vl(e, t)), g = s[u], d = r[g], e.replacer && (d = e.replacer.call(r, g, d)), dr(e, t + 1, g, !0, !0, !0) && (h = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, h && (e.dump && Ji === e.dump.charCodeAt(0) ? m += "?" : m += "? "), m += e.dump, h && (m += Vl(e, t)), dr(e, t + 1, d, !0, h) && (e.dump && Ji === e.dump.charCodeAt(0) ? m += ":" : m += ": ", m += e.dump, i += m));
  e.tag = a, e.dump = i || "{}";
}
function hf(e, t, r) {
  var n, i, a, s, u, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, a = 0, s = i.length; a < s; a += 1)
    if (u = i[a], (u.instanceOf || u.predicate) && (!u.instanceOf || typeof t == "object" && t instanceof u.instanceOf) && (!u.predicate || u.predicate(t))) {
      if (r ? u.multi && u.representName ? e.tag = u.representName(t) : e.tag = u.tag : e.tag = "?", u.represent) {
        if (c = e.styleMap[u.tag] || u.defaultStyle, ip.call(u.represent) === "[object Function]")
          n = u.represent(t, c);
        else if (op.call(u.represent, c))
          n = u.represent[c](t, c);
        else
          throw new yo("!<" + u.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function dr(e, t, r, n, i, a, s) {
  e.tag = null, e.dump = r, hf(e, r, !1) || hf(e, r, !0);
  var u = ip.call(e.dump), c = n, g;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var d = u === "[object Object]" || u === "[object Array]", h, m;
  if (d && (h = e.duplicates.indexOf(r), m = h !== -1), (e.tag !== null && e.tag !== "?" || m || e.indent !== 2 && t > 0) && (i = !1), m && e.usedDuplicates[h])
    e.dump = "*ref_" + h;
  else {
    if (d && m && !e.usedDuplicates[h] && (e.usedDuplicates[h] = !0), u === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (Xw(e, t, e.dump, i), m && (e.dump = "&ref_" + h + e.dump)) : (Yw(e, t, e.dump), m && (e.dump = "&ref_" + h + " " + e.dump));
    else if (u === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? df(e, t - 1, e.dump, i) : df(e, t, e.dump, i), m && (e.dump = "&ref_" + h + e.dump)) : (Vw(e, t, e.dump), m && (e.dump = "&ref_" + h + " " + e.dump));
    else if (u === "[object String]")
      e.tag !== "?" && Hw(e, e.dump, t, a, c);
    else {
      if (u === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new yo("unacceptable kind of an object to dump " + u);
    }
    e.tag !== null && e.tag !== "?" && (g = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? g = "!" + g : g.slice(0, 18) === "tag:yaml.org,2002:" ? g = "!!" + g.slice(18) : g = "!<" + g + ">", e.dump = g + " " + e.dump);
  }
  return !0;
}
function Qw(e, t) {
  var r = [], n = [], i, a;
  for (Xl(e, r, n), i = 0, a = n.length; i < a; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(a);
}
function Xl(e, t, r) {
  var n, i, a;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, a = e.length; i < a; i += 1)
        Xl(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, a = n.length; i < a; i += 1)
        Xl(e[n[i]], t, r);
}
function Kw(e, t) {
  t = t || {};
  var r = new Bw(t);
  r.noRefs || Qw(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), dr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
np.dump = Kw;
var mp = yu, Jw = np;
function vu(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
We.Type = rt;
We.Schema = Ph;
We.FAILSAFE_SCHEMA = Dh;
We.JSON_SCHEMA = Uh;
We.CORE_SCHEMA = Bh;
We.DEFAULT_SCHEMA = _u;
We.load = mp.load;
We.loadAll = mp.loadAll;
We.dump = Jw.dump;
We.YAMLException = go;
We.types = {
  binary: Hh,
  float: xh,
  map: Oh,
  null: Nh,
  pairs: Gh,
  set: Vh,
  timestamp: jh,
  bool: Fh,
  int: kh,
  merge: Wh,
  omap: zh,
  seq: Ih,
  str: $h
};
We.safeLoad = vu("safeLoad", "load");
We.safeLoadAll = vu("safeLoadAll", "loadAll");
We.safeDump = vu("safeDump", "dump");
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.Lazy = void 0;
class Zw {
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
hs.Lazy = Zw;
var Ql = { exports: {} };
const eE = "2.0.0", gp = 256, tE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, rE = 16, nE = gp - 6, iE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ps = {
  MAX_LENGTH: gp,
  MAX_SAFE_COMPONENT_LENGTH: rE,
  MAX_SAFE_BUILD_LENGTH: nE,
  MAX_SAFE_INTEGER: tE,
  RELEASE_TYPES: iE,
  SEMVER_SPEC_VERSION: eE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const oE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ms = oE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = ps, a = ms;
  t = e.exports = {};
  const s = t.re = [], u = t.safeRe = [], c = t.src = [], g = t.safeSrc = [], d = t.t = {};
  let h = 0;
  const m = "[a-zA-Z0-9-]", b = [
    ["\\s", 1],
    ["\\d", i],
    [m, n]
  ], E = (A) => {
    for (const [$, I] of b)
      A = A.split(`${$}*`).join(`${$}{0,${I}}`).split(`${$}+`).join(`${$}{1,${I}}`);
    return A;
  }, C = (A, $, I) => {
    const M = E($), x = h++;
    a(A, x, $), d[A] = x, c[x] = $, g[x] = M, s[x] = new RegExp($, I ? "g" : void 0), u[x] = new RegExp(M, I ? "g" : void 0);
  };
  C("NUMERICIDENTIFIER", "0|[1-9]\\d*"), C("NUMERICIDENTIFIERLOOSE", "\\d+"), C("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${m}*`), C("MAINVERSION", `(${c[d.NUMERICIDENTIFIER]})\\.(${c[d.NUMERICIDENTIFIER]})\\.(${c[d.NUMERICIDENTIFIER]})`), C("MAINVERSIONLOOSE", `(${c[d.NUMERICIDENTIFIERLOOSE]})\\.(${c[d.NUMERICIDENTIFIERLOOSE]})\\.(${c[d.NUMERICIDENTIFIERLOOSE]})`), C("PRERELEASEIDENTIFIER", `(?:${c[d.NONNUMERICIDENTIFIER]}|${c[d.NUMERICIDENTIFIER]})`), C("PRERELEASEIDENTIFIERLOOSE", `(?:${c[d.NONNUMERICIDENTIFIER]}|${c[d.NUMERICIDENTIFIERLOOSE]})`), C("PRERELEASE", `(?:-(${c[d.PRERELEASEIDENTIFIER]}(?:\\.${c[d.PRERELEASEIDENTIFIER]})*))`), C("PRERELEASELOOSE", `(?:-?(${c[d.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[d.PRERELEASEIDENTIFIERLOOSE]})*))`), C("BUILDIDENTIFIER", `${m}+`), C("BUILD", `(?:\\+(${c[d.BUILDIDENTIFIER]}(?:\\.${c[d.BUILDIDENTIFIER]})*))`), C("FULLPLAIN", `v?${c[d.MAINVERSION]}${c[d.PRERELEASE]}?${c[d.BUILD]}?`), C("FULL", `^${c[d.FULLPLAIN]}$`), C("LOOSEPLAIN", `[v=\\s]*${c[d.MAINVERSIONLOOSE]}${c[d.PRERELEASELOOSE]}?${c[d.BUILD]}?`), C("LOOSE", `^${c[d.LOOSEPLAIN]}$`), C("GTLT", "((?:<|>)?=?)"), C("XRANGEIDENTIFIERLOOSE", `${c[d.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), C("XRANGEIDENTIFIER", `${c[d.NUMERICIDENTIFIER]}|x|X|\\*`), C("XRANGEPLAIN", `[v=\\s]*(${c[d.XRANGEIDENTIFIER]})(?:\\.(${c[d.XRANGEIDENTIFIER]})(?:\\.(${c[d.XRANGEIDENTIFIER]})(?:${c[d.PRERELEASE]})?${c[d.BUILD]}?)?)?`), C("XRANGEPLAINLOOSE", `[v=\\s]*(${c[d.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[d.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[d.XRANGEIDENTIFIERLOOSE]})(?:${c[d.PRERELEASELOOSE]})?${c[d.BUILD]}?)?)?`), C("XRANGE", `^${c[d.GTLT]}\\s*${c[d.XRANGEPLAIN]}$`), C("XRANGELOOSE", `^${c[d.GTLT]}\\s*${c[d.XRANGEPLAINLOOSE]}$`), C("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), C("COERCE", `${c[d.COERCEPLAIN]}(?:$|[^\\d])`), C("COERCEFULL", c[d.COERCEPLAIN] + `(?:${c[d.PRERELEASE]})?(?:${c[d.BUILD]})?(?:$|[^\\d])`), C("COERCERTL", c[d.COERCE], !0), C("COERCERTLFULL", c[d.COERCEFULL], !0), C("LONETILDE", "(?:~>?)"), C("TILDETRIM", `(\\s*)${c[d.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", C("TILDE", `^${c[d.LONETILDE]}${c[d.XRANGEPLAIN]}$`), C("TILDELOOSE", `^${c[d.LONETILDE]}${c[d.XRANGEPLAINLOOSE]}$`), C("LONECARET", "(?:\\^)"), C("CARETTRIM", `(\\s*)${c[d.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", C("CARET", `^${c[d.LONECARET]}${c[d.XRANGEPLAIN]}$`), C("CARETLOOSE", `^${c[d.LONECARET]}${c[d.XRANGEPLAINLOOSE]}$`), C("COMPARATORLOOSE", `^${c[d.GTLT]}\\s*(${c[d.LOOSEPLAIN]})$|^$`), C("COMPARATOR", `^${c[d.GTLT]}\\s*(${c[d.FULLPLAIN]})$|^$`), C("COMPARATORTRIM", `(\\s*)${c[d.GTLT]}\\s*(${c[d.LOOSEPLAIN]}|${c[d.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", C("HYPHENRANGE", `^\\s*(${c[d.XRANGEPLAIN]})\\s+-\\s+(${c[d.XRANGEPLAIN]})\\s*$`), C("HYPHENRANGELOOSE", `^\\s*(${c[d.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[d.XRANGEPLAINLOOSE]})\\s*$`), C("STAR", "(<|>)?=?\\s*\\*"), C("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), C("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Ql, Ql.exports);
var bo = Ql.exports;
const aE = Object.freeze({ loose: !0 }), sE = Object.freeze({}), lE = (e) => e ? typeof e != "object" ? aE : e : sE;
var Cu = lE;
const pf = /^[0-9]+$/, yp = (e, t) => {
  const r = pf.test(e), n = pf.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, uE = (e, t) => yp(t, e);
var bp = {
  compareIdentifiers: yp,
  rcompareIdentifiers: uE
};
const wa = ms, { MAX_LENGTH: mf, MAX_SAFE_INTEGER: Ea } = ps, { safeRe: Sa, t: va } = bo, cE = Cu, { compareIdentifiers: jn } = bp;
let fE = class zt {
  constructor(t, r) {
    if (r = cE(r), t instanceof zt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > mf)
      throw new TypeError(
        `version is longer than ${mf} characters`
      );
    wa("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Sa[va.LOOSE] : Sa[va.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Ea || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Ea || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Ea || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const a = +i;
        if (a >= 0 && a < Ea)
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
    if (wa("SemVer.compare", this.version, this.options, t), !(t instanceof zt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new zt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof zt || (t = new zt(t, this.options)), jn(this.major, t.major) || jn(this.minor, t.minor) || jn(this.patch, t.patch);
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
      if (wa("prerelease compare", r, n, i), n === void 0 && i === void 0)
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
    t instanceof zt || (t = new zt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (wa("build compare", r, n, i), n === void 0 && i === void 0)
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
        const i = `-${r}`.match(this.options.loose ? Sa[va.PRERELEASELOOSE] : Sa[va.PRERELEASE]);
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
var nt = fE;
const gf = nt, dE = (e, t, r = !1) => {
  if (e instanceof gf)
    return e;
  try {
    return new gf(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var ui = dE;
const hE = ui, pE = (e, t) => {
  const r = hE(e, t);
  return r ? r.version : null;
};
var mE = pE;
const gE = ui, yE = (e, t) => {
  const r = gE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var bE = yE;
const yf = nt, _E = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new yf(
      e instanceof yf ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var wE = _E;
const bf = ui, EE = (e, t) => {
  const r = bf(e, null, !0), n = bf(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const a = i > 0, s = a ? r : n, u = a ? n : r, c = !!s.prerelease.length;
  if (!!u.prerelease.length && !c) {
    if (!u.patch && !u.minor)
      return "major";
    if (u.compareMain(s) === 0)
      return u.minor && !u.patch ? "minor" : "patch";
  }
  const d = c ? "pre" : "";
  return r.major !== n.major ? d + "major" : r.minor !== n.minor ? d + "minor" : r.patch !== n.patch ? d + "patch" : "prerelease";
};
var SE = EE;
const vE = nt, CE = (e, t) => new vE(e, t).major;
var RE = CE;
const TE = nt, AE = (e, t) => new TE(e, t).minor;
var PE = AE;
const $E = nt, IE = (e, t) => new $E(e, t).patch;
var OE = IE;
const DE = ui, NE = (e, t) => {
  const r = DE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var FE = NE;
const _f = nt, kE = (e, t, r) => new _f(e, r).compare(new _f(t, r));
var Dt = kE;
const LE = Dt, xE = (e, t, r) => LE(t, e, r);
var UE = xE;
const BE = Dt, ME = (e, t) => BE(e, t, !0);
var qE = ME;
const wf = nt, jE = (e, t, r) => {
  const n = new wf(e, r), i = new wf(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Ru = jE;
const WE = Ru, HE = (e, t) => e.sort((r, n) => WE(r, n, t));
var zE = HE;
const GE = Ru, VE = (e, t) => e.sort((r, n) => GE(n, r, t));
var YE = VE;
const XE = Dt, QE = (e, t, r) => XE(e, t, r) > 0;
var gs = QE;
const KE = Dt, JE = (e, t, r) => KE(e, t, r) < 0;
var Tu = JE;
const ZE = Dt, eS = (e, t, r) => ZE(e, t, r) === 0;
var _p = eS;
const tS = Dt, rS = (e, t, r) => tS(e, t, r) !== 0;
var wp = rS;
const nS = Dt, iS = (e, t, r) => nS(e, t, r) >= 0;
var Au = iS;
const oS = Dt, aS = (e, t, r) => oS(e, t, r) <= 0;
var Pu = aS;
const sS = _p, lS = wp, uS = gs, cS = Au, fS = Tu, dS = Pu, hS = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return sS(e, r, n);
    case "!=":
      return lS(e, r, n);
    case ">":
      return uS(e, r, n);
    case ">=":
      return cS(e, r, n);
    case "<":
      return fS(e, r, n);
    case "<=":
      return dS(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Ep = hS;
const pS = nt, mS = ui, { safeRe: Ca, t: Ra } = bo, gS = (e, t) => {
  if (e instanceof pS)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ca[Ra.COERCEFULL] : Ca[Ra.COERCE]);
  else {
    const c = t.includePrerelease ? Ca[Ra.COERCERTLFULL] : Ca[Ra.COERCERTL];
    let g;
    for (; (g = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || g.index + g[0].length !== r.index + r[0].length) && (r = g), c.lastIndex = g.index + g[1].length + g[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", a = r[4] || "0", s = t.includePrerelease && r[5] ? `-${r[5]}` : "", u = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return mS(`${n}.${i}.${a}${s}${u}`, t);
};
var yS = gS;
class bS {
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
var _S = bS, ml, Ef;
function Nt() {
  if (Ef) return ml;
  Ef = 1;
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
      D = D.replace(V, X(this.options.includePrerelease)), s("hyphen replace", D), D = D.replace(c[g.COMPARATORTRIM], d), s("comparator trim", D), D = D.replace(c[g.TILDETRIM], h), s("tilde trim", D), D = D.replace(c[g.CARETTRIM], m), s("caret trim", D);
      let ie = D.split(" ").map((Y) => I(Y, this.options)).join(" ").split(/\s+/).map((Y) => Z(Y, this.options));
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
      return this.set.some((N) => $(N, B) && D.set.some((q) => $(q, B) && N.every((U) => q.every((V) => U.intersects(V, B)))));
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
  ml = t;
  const r = _S, n = new r(), i = Cu, a = ys(), s = ms, u = nt, {
    safeRe: c,
    t: g,
    comparatorTrimReplace: d,
    tildeTrimReplace: h,
    caretTrimReplace: m
  } = bo, { FLAG_INCLUDE_PRERELEASE: b, FLAG_LOOSE: E } = ps, C = (L) => L.value === "<0.0.0-0", A = (L) => L.value === "", $ = (L, D) => {
    let B = !0;
    const N = L.slice();
    let q = N.pop();
    for (; B && N.length; )
      B = N.every((U) => q.intersects(U, D)), q = N.pop();
    return B;
  }, I = (L, D) => (s("comp", L, D), L = ae(L, D), s("caret", L), L = x(L, D), s("tildes", L), L = Fe(L, D), s("xrange", L), L = re(L, D), s("stars", L), L), M = (L) => !L || L.toLowerCase() === "x" || L === "*", x = (L, D) => L.trim().split(/\s+/).map((B) => te(B, D)).join(" "), te = (L, D) => {
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
  }, Fe = (L, D) => (s("replaceXRanges", L, D), L.split(/\s+/).map((B) => S(B, D)).join(" ")), S = (L, D) => {
    L = L.trim();
    const B = D.loose ? c[g.XRANGELOOSE] : c[g.XRANGE];
    return L.replace(B, (N, q, U, V, ie, ee) => {
      s("xRange", L, N, q, U, V, ie, ee);
      const fe = M(U), Te = fe || M(V), Y = Te || M(ie), Re = Y;
      return q === "=" && Re && (q = ""), ee = D.includePrerelease ? "-0" : "", fe ? q === ">" || q === "<" ? N = "<0.0.0-0" : N = "*" : q && Re ? (Te && (V = 0), ie = 0, q === ">" ? (q = ">=", Te ? (U = +U + 1, V = 0, ie = 0) : (V = +V + 1, ie = 0)) : q === "<=" && (q = "<", Te ? U = +U + 1 : V = +V + 1), q === "<" && (ee = "-0"), N = `${q + U}.${V}.${ie}${ee}`) : Te ? N = `>=${U}.0.0${ee} <${+U + 1}.0.0-0` : Y && (N = `>=${U}.${V}.0${ee} <${U}.${+V + 1}.0-0`), s("xRange return", N), N;
    });
  }, re = (L, D) => (s("replaceStars", L, D), L.trim().replace(c[g.STAR], "")), Z = (L, D) => (s("replaceGTE0", L, D), L.trim().replace(c[D.includePrerelease ? g.GTE0PRE : g.GTE0], "")), X = (L) => (D, B, N, q, U, V, ie, ee, fe, Te, Y, Re) => (M(N) ? B = "" : M(q) ? B = `>=${N}.0.0${L ? "-0" : ""}` : M(U) ? B = `>=${N}.${q}.0${L ? "-0" : ""}` : V ? B = `>=${B}` : B = `>=${B}${L ? "-0" : ""}`, M(fe) ? ee = "" : M(Te) ? ee = `<${+fe + 1}.0.0-0` : M(Y) ? ee = `<${fe}.${+Te + 1}.0-0` : Re ? ee = `<=${fe}.${Te}.${Y}-${Re}` : L ? ee = `<${fe}.${Te}.${+Y + 1}-0` : ee = `<=${ee}`, `${B} ${ee}`.trim()), ce = (L, D, B) => {
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
  return ml;
}
var gl, Sf;
function ys() {
  if (Sf) return gl;
  Sf = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(d, h) {
      if (h = r(h), d instanceof t) {
        if (d.loose === !!h.loose)
          return d;
        d = d.value;
      }
      d = d.trim().split(/\s+/).join(" "), s("comparator", d, h), this.options = h, this.loose = !!h.loose, this.parse(d), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(d) {
      const h = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], m = d.match(h);
      if (!m)
        throw new TypeError(`Invalid comparator: ${d}`);
      this.operator = m[1] !== void 0 ? m[1] : "", this.operator === "=" && (this.operator = ""), m[2] ? this.semver = new u(m[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(d) {
      if (s("Comparator.test", d, this.options.loose), this.semver === e || d === e)
        return !0;
      if (typeof d == "string")
        try {
          d = new u(d, this.options);
        } catch {
          return !1;
        }
      return a(d, this.operator, this.semver, this.options);
    }
    intersects(d, h) {
      if (!(d instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(d.value, h).test(this.value) : d.operator === "" ? d.value === "" ? !0 : new c(this.value, h).test(d.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || d.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || d.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && d.operator.startsWith(">") || this.operator.startsWith("<") && d.operator.startsWith("<") || this.semver.version === d.semver.version && this.operator.includes("=") && d.operator.includes("=") || a(this.semver, "<", d.semver, h) && this.operator.startsWith(">") && d.operator.startsWith("<") || a(this.semver, ">", d.semver, h) && this.operator.startsWith("<") && d.operator.startsWith(">")));
    }
  }
  gl = t;
  const r = Cu, { safeRe: n, t: i } = bo, a = Ep, s = ms, u = nt, c = Nt();
  return gl;
}
const wS = Nt(), ES = (e, t, r) => {
  try {
    t = new wS(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var bs = ES;
const SS = Nt(), vS = (e, t) => new SS(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var CS = vS;
const RS = nt, TS = Nt(), AS = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new TS(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === -1) && (n = s, i = new RS(n, r));
  }), n;
};
var PS = AS;
const $S = nt, IS = Nt(), OS = (e, t, r) => {
  let n = null, i = null, a = null;
  try {
    a = new IS(t, r);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    a.test(s) && (!n || i.compare(s) === 1) && (n = s, i = new $S(n, r));
  }), n;
};
var DS = OS;
const yl = nt, NS = Nt(), vf = gs, FS = (e, t) => {
  e = new NS(e, t);
  let r = new yl("0.0.0");
  if (e.test(r) || (r = new yl("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let a = null;
    i.forEach((s) => {
      const u = new yl(s.semver.version);
      switch (s.operator) {
        case ">":
          u.prerelease.length === 0 ? u.patch++ : u.prerelease.push(0), u.raw = u.format();
        case "":
        case ">=":
          (!a || vf(u, a)) && (a = u);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), a && (!r || vf(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var kS = FS;
const LS = Nt(), xS = (e, t) => {
  try {
    return new LS(e, t).range || "*";
  } catch {
    return null;
  }
};
var US = xS;
const BS = nt, Sp = ys(), { ANY: MS } = Sp, qS = Nt(), jS = bs, Cf = gs, Rf = Tu, WS = Pu, HS = Au, zS = (e, t, r, n) => {
  e = new BS(e, n), t = new qS(t, n);
  let i, a, s, u, c;
  switch (r) {
    case ">":
      i = Cf, a = WS, s = Rf, u = ">", c = ">=";
      break;
    case "<":
      i = Rf, a = HS, s = Cf, u = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (jS(e, t, n))
    return !1;
  for (let g = 0; g < t.set.length; ++g) {
    const d = t.set[g];
    let h = null, m = null;
    if (d.forEach((b) => {
      b.semver === MS && (b = new Sp(">=0.0.0")), h = h || b, m = m || b, i(b.semver, h.semver, n) ? h = b : s(b.semver, m.semver, n) && (m = b);
    }), h.operator === u || h.operator === c || (!m.operator || m.operator === u) && a(e, m.semver))
      return !1;
    if (m.operator === c && s(e, m.semver))
      return !1;
  }
  return !0;
};
var $u = zS;
const GS = $u, VS = (e, t, r) => GS(e, t, ">", r);
var YS = VS;
const XS = $u, QS = (e, t, r) => XS(e, t, "<", r);
var KS = QS;
const Tf = Nt(), JS = (e, t, r) => (e = new Tf(e, r), t = new Tf(t, r), e.intersects(t, r));
var ZS = JS;
const ev = bs, tv = Dt;
var rv = (e, t, r) => {
  const n = [];
  let i = null, a = null;
  const s = e.sort((d, h) => tv(d, h, r));
  for (const d of s)
    ev(d, t, r) ? (a = d, i || (i = d)) : (a && n.push([i, a]), a = null, i = null);
  i && n.push([i, null]);
  const u = [];
  for (const [d, h] of n)
    d === h ? u.push(d) : !h && d === s[0] ? u.push("*") : h ? d === s[0] ? u.push(`<=${h}`) : u.push(`${d} - ${h}`) : u.push(`>=${d}`);
  const c = u.join(" || "), g = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < g.length ? c : t;
};
const Af = Nt(), Iu = ys(), { ANY: bl } = Iu, Di = bs, Ou = Dt, nv = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Af(e, r), t = new Af(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const a of t.set) {
      const s = ov(i, a, r);
      if (n = n || s !== null, s)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, iv = [new Iu(">=0.0.0-0")], Pf = [new Iu(">=0.0.0")], ov = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === bl) {
    if (t.length === 1 && t[0].semver === bl)
      return !0;
    r.includePrerelease ? e = iv : e = Pf;
  }
  if (t.length === 1 && t[0].semver === bl) {
    if (r.includePrerelease)
      return !0;
    t = Pf;
  }
  const n = /* @__PURE__ */ new Set();
  let i, a;
  for (const b of e)
    b.operator === ">" || b.operator === ">=" ? i = $f(i, b, r) : b.operator === "<" || b.operator === "<=" ? a = If(a, b, r) : n.add(b.semver);
  if (n.size > 1)
    return null;
  let s;
  if (i && a) {
    if (s = Ou(i.semver, a.semver, r), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const b of n) {
    if (i && !Di(b, String(i), r) || a && !Di(b, String(a), r))
      return null;
    for (const E of t)
      if (!Di(b, String(E), r))
        return !1;
    return !0;
  }
  let u, c, g, d, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, m = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const b of t) {
    if (d = d || b.operator === ">" || b.operator === ">=", g = g || b.operator === "<" || b.operator === "<=", i) {
      if (m && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === m.major && b.semver.minor === m.minor && b.semver.patch === m.patch && (m = !1), b.operator === ">" || b.operator === ">=") {
        if (u = $f(i, b, r), u === b && u !== i)
          return !1;
      } else if (i.operator === ">=" && !Di(i.semver, String(b), r))
        return !1;
    }
    if (a) {
      if (h && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === h.major && b.semver.minor === h.minor && b.semver.patch === h.patch && (h = !1), b.operator === "<" || b.operator === "<=") {
        if (c = If(a, b, r), c === b && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Di(a.semver, String(b), r))
        return !1;
    }
    if (!b.operator && (a || i) && s !== 0)
      return !1;
  }
  return !(i && g && !a && s !== 0 || a && d && !i && s !== 0 || m || h);
}, $f = (e, t, r) => {
  if (!e)
    return t;
  const n = Ou(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, If = (e, t, r) => {
  if (!e)
    return t;
  const n = Ou(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var av = nv;
const _l = bo, Of = ps, sv = nt, Df = bp, lv = ui, uv = mE, cv = bE, fv = wE, dv = SE, hv = RE, pv = PE, mv = OE, gv = FE, yv = Dt, bv = UE, _v = qE, wv = Ru, Ev = zE, Sv = YE, vv = gs, Cv = Tu, Rv = _p, Tv = wp, Av = Au, Pv = Pu, $v = Ep, Iv = yS, Ov = ys(), Dv = Nt(), Nv = bs, Fv = CS, kv = PS, Lv = DS, xv = kS, Uv = US, Bv = $u, Mv = YS, qv = KS, jv = ZS, Wv = rv, Hv = av;
var vp = {
  parse: lv,
  valid: uv,
  clean: cv,
  inc: fv,
  diff: dv,
  major: hv,
  minor: pv,
  patch: mv,
  prerelease: gv,
  compare: yv,
  rcompare: bv,
  compareLoose: _v,
  compareBuild: wv,
  sort: Ev,
  rsort: Sv,
  gt: vv,
  lt: Cv,
  eq: Rv,
  neq: Tv,
  gte: Av,
  lte: Pv,
  cmp: $v,
  coerce: Iv,
  Comparator: Ov,
  Range: Dv,
  satisfies: Nv,
  toComparators: Fv,
  maxSatisfying: kv,
  minSatisfying: Lv,
  minVersion: xv,
  validRange: Uv,
  outside: Bv,
  gtr: Mv,
  ltr: qv,
  intersects: jv,
  simplifyRange: Wv,
  subset: Hv,
  SemVer: sv,
  re: _l.re,
  src: _l.src,
  tokens: _l.t,
  SEMVER_SPEC_VERSION: Of.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Of.RELEASE_TYPES,
  compareIdentifiers: Df.compareIdentifiers,
  rcompareIdentifiers: Df.rcompareIdentifiers
}, _o = {}, Ka = { exports: {} };
Ka.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, a = 2, s = 9007199254740991, u = "[object Arguments]", c = "[object Array]", g = "[object AsyncFunction]", d = "[object Boolean]", h = "[object Date]", m = "[object Error]", b = "[object Function]", E = "[object GeneratorFunction]", C = "[object Map]", A = "[object Number]", $ = "[object Null]", I = "[object Object]", M = "[object Promise]", x = "[object Proxy]", te = "[object RegExp]", ae = "[object Set]", Q = "[object String]", Fe = "[object Symbol]", S = "[object Undefined]", re = "[object WeakMap]", Z = "[object ArrayBuffer]", X = "[object DataView]", ce = "[object Float32Array]", L = "[object Float64Array]", D = "[object Int8Array]", B = "[object Int16Array]", N = "[object Int32Array]", q = "[object Uint8Array]", U = "[object Uint8ClampedArray]", V = "[object Uint16Array]", ie = "[object Uint32Array]", ee = /[\\^$.*+?()[\]{}|]/g, fe = /^\[object .+?Constructor\]$/, Te = /^(?:0|[1-9]\d*)$/, Y = {};
  Y[ce] = Y[L] = Y[D] = Y[B] = Y[N] = Y[q] = Y[U] = Y[V] = Y[ie] = !0, Y[u] = Y[c] = Y[Z] = Y[d] = Y[X] = Y[h] = Y[m] = Y[b] = Y[C] = Y[A] = Y[I] = Y[te] = Y[ae] = Y[Q] = Y[re] = !1;
  var Re = typeof Be == "object" && Be && Be.Object === Object && Be, y = typeof self == "object" && self && self.Object === Object && self, p = Re || y || Function("return this")(), F = t && !t.nodeType && t, T = F && !0 && e && !e.nodeType && e, se = T && T.exports === F, pe = se && Re.process, we = function() {
    try {
      return pe && pe.binding && pe.binding("util");
    } catch {
    }
  }(), De = we && we.isTypedArray;
  function Ae(w, R) {
    for (var k = -1, W = w == null ? 0 : w.length, he = 0, K = []; ++k < W; ) {
      var de = w[k];
      R(de, k, w) && (K[he++] = de);
    }
    return K;
  }
  function yt(w, R) {
    for (var k = -1, W = R.length, he = w.length; ++k < W; )
      w[he + k] = R[k];
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
  function qr(w) {
    return function(R) {
      return w(R);
    };
  }
  function Qt(w, R) {
    return w.has(R);
  }
  function pr(w, R) {
    return w == null ? void 0 : w[R];
  }
  function dt(w) {
    var R = -1, k = Array(w.size);
    return w.forEach(function(W, he) {
      k[++R] = [he, W];
    }), k;
  }
  function Ft(w, R) {
    return function(k) {
      return w(R(k));
    };
  }
  function jr(w) {
    var R = -1, k = Array(w.size);
    return w.forEach(function(W) {
      k[++R] = W;
    }), k;
  }
  var As = Array.prototype, vo = Function.prototype, Kt = Object.prototype, fi = p["__core-js_shared__"], di = vo.toString, ht = Kt.hasOwnProperty, Co = function() {
    var w = /[^.]+$/.exec(fi && fi.keys && fi.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), hi = Kt.toString, Ro = RegExp(
    "^" + di.call(ht).replace(ee, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), pi = se ? p.Buffer : void 0, mr = p.Symbol, gn = p.Uint8Array, yn = Kt.propertyIsEnumerable, Wr = As.splice, kt = mr ? mr.toStringTag : void 0, bt = Object.getOwnPropertySymbols, Lt = pi ? pi.isBuffer : void 0, To = Ft(Object.keys, Object), gr = wr(p, "DataView"), Hr = wr(p, "Map"), zr = wr(p, "Promise"), bn = wr(p, "Set"), mi = wr(p, "WeakMap"), Gr = wr(Object, "create"), Ps = nr(gr), $s = nr(Hr), Ao = nr(zr), gi = nr(bn), yi = nr(mi), Po = mr ? mr.prototype : void 0, _t = Po ? Po.valueOf : void 0;
  function xt(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.clear(); ++R < k; ) {
      var W = w[R];
      this.set(W[0], W[1]);
    }
  }
  function Is() {
    this.__data__ = Gr ? Gr(null) : {}, this.size = 0;
  }
  function Os(w) {
    var R = this.has(w) && delete this.__data__[w];
    return this.size -= R ? 1 : 0, R;
  }
  function Jt(w) {
    var R = this.__data__;
    if (Gr) {
      var k = R[w];
      return k === n ? void 0 : k;
    }
    return ht.call(R, w) ? R[w] : void 0;
  }
  function vt(w) {
    var R = this.__data__;
    return Gr ? R[w] !== void 0 : ht.call(R, w);
  }
  function Zt(w, R) {
    var k = this.__data__;
    return this.size += this.has(w) ? 0 : 1, k[w] = Gr && R === void 0 ? n : R, this;
  }
  xt.prototype.clear = Is, xt.prototype.delete = Os, xt.prototype.get = Jt, xt.prototype.has = vt, xt.prototype.set = Zt;
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
  function $o(w) {
    var R = this.__data__, k = tr(R, w);
    if (k < 0)
      return !1;
    var W = R.length - 1;
    return k == W ? R.pop() : Wr.call(R, k, 1), --this.size, !0;
  }
  function bi(w) {
    var R = this.__data__, k = tr(R, w);
    return k < 0 ? void 0 : R[k][1];
  }
  function Io(w) {
    return tr(this.__data__, w) > -1;
  }
  function _n(w, R) {
    var k = this.__data__, W = tr(k, w);
    return W < 0 ? (++this.size, k.push([w, R])) : k[W][1] = R, this;
  }
  pt.prototype.clear = er, pt.prototype.delete = $o, pt.prototype.get = bi, pt.prototype.has = Io, pt.prototype.set = _n;
  function Ut(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.clear(); ++R < k; ) {
      var W = w[R];
      this.set(W[0], W[1]);
    }
  }
  function Oo() {
    this.size = 0, this.__data__ = {
      hash: new xt(),
      map: new (Hr || pt)(),
      string: new xt()
    };
  }
  function Do(w) {
    var R = Cn(this, w).delete(w);
    return this.size -= R ? 1 : 0, R;
  }
  function No(w) {
    return Cn(this, w).get(w);
  }
  function Fo(w) {
    return Cn(this, w).has(w);
  }
  function _i(w, R) {
    var k = Cn(this, w), W = k.size;
    return k.set(w, R), this.size += k.size == W ? 0 : 1, this;
  }
  Ut.prototype.clear = Oo, Ut.prototype.delete = Do, Ut.prototype.get = No, Ut.prototype.has = Fo, Ut.prototype.set = _i;
  function yr(w) {
    var R = -1, k = w == null ? 0 : w.length;
    for (this.__data__ = new Ut(); ++R < k; )
      this.add(w[R]);
  }
  function Ds(w) {
    return this.__data__.set(w, n), this;
  }
  function Ns(w) {
    return this.__data__.has(w);
  }
  yr.prototype.add = yr.prototype.push = Ds, yr.prototype.has = Ns;
  function Bt(w) {
    var R = this.__data__ = new pt(w);
    this.size = R.size;
  }
  function Fs() {
    this.__data__ = new pt(), this.size = 0;
  }
  function ko(w) {
    var R = this.__data__, k = R.delete(w);
    return this.size = R.size, k;
  }
  function br(w) {
    return this.__data__.get(w);
  }
  function ks(w) {
    return this.__data__.has(w);
  }
  function wn(w, R) {
    var k = this.__data__;
    if (k instanceof pt) {
      var W = k.__data__;
      if (!Hr || W.length < r - 1)
        return W.push([w, R]), this.size = ++k.size, this;
      k = this.__data__ = new Ut(W);
    }
    return k.set(w, R), this.size = k.size, this;
  }
  Bt.prototype.clear = Fs, Bt.prototype.delete = ko, Bt.prototype.get = br, Bt.prototype.has = ks, Bt.prototype.set = wn;
  function Vr(w, R) {
    var k = jt(w), W = !k && Rn(w), he = !k && !W && Er(w), K = !k && !W && !he && Go(w), de = k || W || he || K, Se = de ? it(w.length, String) : [], Pe = Se.length;
    for (var Ee in w)
      ht.call(w, Ee) && !(de && // Safari 9 has enumerable `arguments.length` in strict mode.
      (Ee == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      he && (Ee == "offset" || Ee == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      K && (Ee == "buffer" || Ee == "byteLength" || Ee == "byteOffset") || // Skip index properties.
      qo(Ee, Pe))) && Se.push(Ee);
    return Se;
  }
  function tr(w, R) {
    for (var k = w.length; k--; )
      if (vi(w[k][0], R))
        return k;
    return -1;
  }
  function ot(w, R, k) {
    var W = R(w);
    return jt(w) ? W : yt(W, k(w));
  }
  function _r(w) {
    return w == null ? w === void 0 ? S : $ : kt && kt in Object(w) ? Bo(w) : jo(w);
  }
  function En(w) {
    return Xr(w) && _r(w) == u;
  }
  function wi(w, R, k, W, he) {
    return w === R ? !0 : w == null || R == null || !Xr(w) && !Xr(R) ? w !== w && R !== R : Sn(w, R, k, W, wi, he);
  }
  function Sn(w, R, k, W, he, K) {
    var de = jt(w), Se = jt(R), Pe = de ? c : Mt(w), Ee = Se ? c : Mt(R);
    Pe = Pe == u ? I : Pe, Ee = Ee == u ? I : Ee;
    var qe = Pe == I, Ye = Ee == I, $e = Pe == Ee;
    if ($e && Er(w)) {
      if (!Er(R))
        return !1;
      de = !0, qe = !1;
    }
    if ($e && !qe)
      return K || (K = new Bt()), de || Go(w) ? xo(w, R, k, W, he, K) : Ei(w, R, Pe, k, W, he, K);
    if (!(k & i)) {
      var at = qe && ht.call(w, "__wrapped__"), st = Ye && ht.call(R, "__wrapped__");
      if (at || st) {
        var Wt = at ? w.value() : w, Ct = st ? R.value() : R;
        return K || (K = new Bt()), he(Wt, Ct, k, W, K);
      }
    }
    return $e ? (K || (K = new Bt()), Yr(w, R, k, W, he, K)) : !1;
  }
  function vn(w) {
    if (!zo(w) || qt(w))
      return !1;
    var R = Wo(w) ? Ro : fe;
    return R.test(nr(w));
  }
  function Lo(w) {
    return Xr(w) && Ho(w.length) && !!Y[_r(w)];
  }
  function Ls(w) {
    if (!rr(w))
      return To(w);
    var R = [];
    for (var k in Object(w))
      ht.call(w, k) && k != "constructor" && R.push(k);
    return R;
  }
  function xo(w, R, k, W, he, K) {
    var de = k & i, Se = w.length, Pe = R.length;
    if (Se != Pe && !(de && Pe > Se))
      return !1;
    var Ee = K.get(w);
    if (Ee && K.get(R))
      return Ee == R;
    var qe = -1, Ye = !0, $e = k & a ? new yr() : void 0;
    for (K.set(w, R), K.set(R, w); ++qe < Se; ) {
      var at = w[qe], st = R[qe];
      if (W)
        var Wt = de ? W(st, at, qe, R, w, K) : W(at, st, qe, w, R, K);
      if (Wt !== void 0) {
        if (Wt)
          continue;
        Ye = !1;
        break;
      }
      if ($e) {
        if (!be(R, function(Ct, ke) {
          if (!Qt($e, ke) && (at === Ct || he(at, Ct, k, W, K)))
            return $e.push(ke);
        })) {
          Ye = !1;
          break;
        }
      } else if (!(at === st || he(at, st, k, W, K))) {
        Ye = !1;
        break;
      }
    }
    return K.delete(w), K.delete(R), Ye;
  }
  function Ei(w, R, k, W, he, K, de) {
    switch (k) {
      case X:
        if (w.byteLength != R.byteLength || w.byteOffset != R.byteOffset)
          return !1;
        w = w.buffer, R = R.buffer;
      case Z:
        return !(w.byteLength != R.byteLength || !K(new gn(w), new gn(R)));
      case d:
      case h:
      case A:
        return vi(+w, +R);
      case m:
        return w.name == R.name && w.message == R.message;
      case te:
      case Q:
        return w == R + "";
      case C:
        var Se = dt;
      case ae:
        var Pe = W & i;
        if (Se || (Se = jr), w.size != R.size && !Pe)
          return !1;
        var Ee = de.get(w);
        if (Ee)
          return Ee == R;
        W |= a, de.set(w, R);
        var qe = xo(Se(w), Se(R), W, he, K, de);
        return de.delete(w), qe;
      case Fe:
        if (_t)
          return _t.call(w) == _t.call(R);
    }
    return !1;
  }
  function Yr(w, R, k, W, he, K) {
    var de = k & i, Se = Uo(w), Pe = Se.length, Ee = Uo(R), qe = Ee.length;
    if (Pe != qe && !de)
      return !1;
    for (var Ye = Pe; Ye--; ) {
      var $e = Se[Ye];
      if (!(de ? $e in R : ht.call(R, $e)))
        return !1;
    }
    var at = K.get(w);
    if (at && K.get(R))
      return at == R;
    var st = !0;
    K.set(w, R), K.set(R, w);
    for (var Wt = de; ++Ye < Pe; ) {
      $e = Se[Ye];
      var Ct = w[$e], ke = R[$e];
      if (W)
        var Yo = de ? W(ke, Ct, $e, R, w, K) : W(Ct, ke, $e, w, R, K);
      if (!(Yo === void 0 ? Ct === ke || he(Ct, ke, k, W, K) : Yo)) {
        st = !1;
        break;
      }
      Wt || (Wt = $e == "constructor");
    }
    if (st && !Wt) {
      var An = w.constructor, Pn = R.constructor;
      An != Pn && "constructor" in w && "constructor" in R && !(typeof An == "function" && An instanceof An && typeof Pn == "function" && Pn instanceof Pn) && (st = !1);
    }
    return K.delete(w), K.delete(R), st;
  }
  function Uo(w) {
    return ot(w, Vo, Mo);
  }
  function Cn(w, R) {
    var k = w.__data__;
    return Si(R) ? k[typeof R == "string" ? "string" : "hash"] : k.map;
  }
  function wr(w, R) {
    var k = pr(w, R);
    return vn(k) ? k : void 0;
  }
  function Bo(w) {
    var R = ht.call(w, kt), k = w[kt];
    try {
      w[kt] = void 0;
      var W = !0;
    } catch {
    }
    var he = hi.call(w);
    return W && (R ? w[kt] = k : delete w[kt]), he;
  }
  var Mo = bt ? function(w) {
    return w == null ? [] : (w = Object(w), Ae(bt(w), function(R) {
      return yn.call(w, R);
    }));
  } : Us, Mt = _r;
  (gr && Mt(new gr(new ArrayBuffer(1))) != X || Hr && Mt(new Hr()) != C || zr && Mt(zr.resolve()) != M || bn && Mt(new bn()) != ae || mi && Mt(new mi()) != re) && (Mt = function(w) {
    var R = _r(w), k = R == I ? w.constructor : void 0, W = k ? nr(k) : "";
    if (W)
      switch (W) {
        case Ps:
          return X;
        case $s:
          return C;
        case Ao:
          return M;
        case gi:
          return ae;
        case yi:
          return re;
      }
    return R;
  });
  function qo(w, R) {
    return R = R ?? s, !!R && (typeof w == "number" || Te.test(w)) && w > -1 && w % 1 == 0 && w < R;
  }
  function Si(w) {
    var R = typeof w;
    return R == "string" || R == "number" || R == "symbol" || R == "boolean" ? w !== "__proto__" : w === null;
  }
  function qt(w) {
    return !!Co && Co in w;
  }
  function rr(w) {
    var R = w && w.constructor, k = typeof R == "function" && R.prototype || Kt;
    return w === k;
  }
  function jo(w) {
    return hi.call(w);
  }
  function nr(w) {
    if (w != null) {
      try {
        return di.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function vi(w, R) {
    return w === R || w !== w && R !== R;
  }
  var Rn = En(/* @__PURE__ */ function() {
    return arguments;
  }()) ? En : function(w) {
    return Xr(w) && ht.call(w, "callee") && !yn.call(w, "callee");
  }, jt = Array.isArray;
  function Tn(w) {
    return w != null && Ho(w.length) && !Wo(w);
  }
  var Er = Lt || Bs;
  function xs(w, R) {
    return wi(w, R);
  }
  function Wo(w) {
    if (!zo(w))
      return !1;
    var R = _r(w);
    return R == b || R == E || R == g || R == x;
  }
  function Ho(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function zo(w) {
    var R = typeof w;
    return w != null && (R == "object" || R == "function");
  }
  function Xr(w) {
    return w != null && typeof w == "object";
  }
  var Go = De ? qr(De) : Lo;
  function Vo(w) {
    return Tn(w) ? Vr(w) : Ls(w);
  }
  function Us() {
    return [];
  }
  function Bs() {
    return !1;
  }
  e.exports = xs;
})(Ka, Ka.exports);
var zv = Ka.exports;
Object.defineProperty(_o, "__esModule", { value: !0 });
_o.DownloadedUpdateHelper = void 0;
_o.createTempUpdateFile = Qv;
const Gv = fo, Vv = Ur, Nf = zv, nn = Br, qi = Ce;
class Yv {
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
    return qi.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Nf(this.versionInfo, r) && Nf(this.fileInfo.info, n.info) && await (0, nn.pathExists)(t) ? t : null;
    const a = await this.getValidCachedUpdateFile(n, i);
    return a === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = a, a);
  }
  async setDownloadedFile(t, r, n, i, a, s) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: a,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, nn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, nn.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, nn.pathExists)(n))
      return null;
    let a;
    try {
      a = await (0, nn.readJson)(n);
    } catch (g) {
      let d = "No cached update info available";
      return g.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), d += ` (error on read: ${g.message})`), r.info(d), null;
    }
    if (!((a == null ? void 0 : a.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== a.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${a.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const u = qi.join(this.cacheDirForPendingUpdate, a.fileName);
    if (!await (0, nn.pathExists)(u))
      return r.info("Cached update file doesn't exist"), null;
    const c = await Xv(u);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = a, u);
  }
  getUpdateInfoFile() {
    return qi.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
_o.DownloadedUpdateHelper = Yv;
function Xv(e, t = "sha512", r = "base64", n) {
  return new Promise((i, a) => {
    const s = (0, Gv.createHash)(t);
    s.on("error", a).setEncoding(r), (0, Vv.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", a).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function Qv(e, t, r) {
  let n = 0, i = qi.join(t, e);
  for (let a = 0; a < 3; a++)
    try {
      return await (0, nn.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${s}`), i = qi.join(t, `${n++}-${e}`);
    }
  return i;
}
var _s = {}, Du = {};
Object.defineProperty(Du, "__esModule", { value: !0 });
Du.getAppCacheDir = Jv;
const wl = Ce, Kv = ns;
function Jv() {
  const e = (0, Kv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || wl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = wl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || wl.join(e, ".cache"), t;
}
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.ElectronAppAdapter = void 0;
const Ff = Ce, Zv = Du;
class eC {
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
    return this.isPackaged ? Ff.join(process.resourcesPath, "app-update.yml") : Ff.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Zv.getAppCacheDir)();
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
_s.ElectronAppAdapter = eC;
var Cp = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Me;
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
      return await u.cancellationToken.createPromise((c, g, d) => {
        const h = {
          headers: u.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(a, h), (0, t.configureRequestOptions)(h), this.doDownload(h, {
          destination: s,
          options: u,
          onCancel: d,
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
      a.on("redirect", (d, h, m) => {
        a.abort(), c > this.maxRedirects ? u(this.createMaxRedirectError()) : g(t.HttpExecutor.prepareRedirectUrlOptions(m, s));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(Cp);
var wo = {}, St = {}, tC = "[object Symbol]", Rp = /[\\^$.*+?()[\]{}|]/g, rC = RegExp(Rp.source), nC = typeof Be == "object" && Be && Be.Object === Object && Be, iC = typeof self == "object" && self && self.Object === Object && self, oC = nC || iC || Function("return this")(), aC = Object.prototype, sC = aC.toString, kf = oC.Symbol, Lf = kf ? kf.prototype : void 0, xf = Lf ? Lf.toString : void 0;
function lC(e) {
  if (typeof e == "string")
    return e;
  if (cC(e))
    return xf ? xf.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function uC(e) {
  return !!e && typeof e == "object";
}
function cC(e) {
  return typeof e == "symbol" || uC(e) && sC.call(e) == tC;
}
function fC(e) {
  return e == null ? "" : lC(e);
}
function dC(e) {
  return e = fC(e), e && rC.test(e) ? e.replace(Rp, "\\$&") : e;
}
var hC = dC;
Object.defineProperty(St, "__esModule", { value: !0 });
St.newBaseUrl = mC;
St.newUrlFromBase = Kl;
St.getChannelFilename = gC;
St.blockmapFiles = yC;
const Tp = ai, pC = hC;
function mC(e) {
  const t = new Tp.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Kl(e, t, r = !1) {
  const n = new Tp.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function gC(e) {
  return `${e}.yml`;
}
function yC(e, t, r) {
  const n = Kl(`${e.pathname}.blockmap`, e);
  return [Kl(`${e.pathname.replace(new RegExp(pC(r), "g"), t)}.blockmap`, e), n];
}
var Ne = {};
Object.defineProperty(Ne, "__esModule", { value: !0 });
Ne.Provider = void 0;
Ne.findFile = wC;
Ne.parseUpdateInfo = EC;
Ne.getFileList = Ap;
Ne.resolveFiles = SC;
const Lr = Me, bC = We, Uf = St;
class _C {
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
Ne.Provider = _C;
function wC(e, t, r) {
  if (e.length === 0)
    throw (0, Lr.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((a) => i.url.pathname.toLowerCase().endsWith(`.${a}`))));
}
function EC(e, t, r) {
  if (e == null)
    throw (0, Lr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, bC.load)(e);
  } catch (i) {
    throw (0, Lr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Ap(e) {
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
function SC(e, t, r = (n) => n) {
  const i = Ap(e).map((u) => {
    if (u.sha2 == null && u.sha512 == null)
      throw (0, Lr.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, Lr.safeStringifyJson)(u)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Uf.newUrlFromBase)(r(u.url), t),
      info: u
    };
  }), a = e.packages, s = a == null ? null : a[process.arch] || a.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, Uf.newUrlFromBase)(r(s.path), t).href
  }), i;
}
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.GenericProvider = void 0;
const Bf = Me, El = St, Sl = Ne;
class vC extends Sl.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, El.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, El.getChannelFilename)(this.channel), r = (0, El.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Sl.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Bf.HttpError && i.statusCode === 404)
          throw (0, Bf.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, Sl.resolveFiles)(t, this.baseUrl);
  }
}
wo.GenericProvider = vC;
var ws = {}, Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.BitbucketProvider = void 0;
const Mf = Me, vl = St, Cl = Ne;
class CC extends Cl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: a } = t;
    this.baseUrl = (0, vl.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Mf.CancellationToken(), r = (0, vl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, vl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Cl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Mf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Cl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Es.BitbucketProvider = CC;
var xr = {};
Object.defineProperty(xr, "__esModule", { value: !0 });
xr.GitHubProvider = xr.BaseGitHubProvider = void 0;
xr.computeReleaseNotes = $p;
const lr = Me, Qn = vp, RC = ai, Kn = St, Jl = Ne, Rl = /\/tag\/([^/]+)$/;
class Pp extends Jl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Kn.newBaseUrl)((0, lr.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Kn.newBaseUrl)((0, lr.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
xr.BaseGitHubProvider = Pp;
class TC extends Pp {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, a;
    const s = new lr.CancellationToken(), u = await this.httpRequest((0, Kn.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, lr.parseXml)(u);
    let g = c.element("entry", !1, "No published versions on GitHub"), d = null;
    try {
      if (this.updater.allowPrerelease) {
        const A = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Qn.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (A === null)
          d = Rl.exec(g.element("link").attribute("href"))[1];
        else
          for (const $ of c.getElements("entry")) {
            const I = Rl.exec($.element("link").attribute("href"));
            if (I === null)
              continue;
            const M = I[1], x = ((n = Qn.prerelease(M)) === null || n === void 0 ? void 0 : n[0]) || null, te = !A || ["alpha", "beta"].includes(A), ae = x !== null && !["alpha", "beta"].includes(String(x));
            if (te && !ae && !(A === "beta" && x === "alpha")) {
              d = M;
              break;
            }
            if (x && x === A) {
              d = M;
              break;
            }
          }
      } else {
        d = await this.getLatestTagName(s);
        for (const A of c.getElements("entry"))
          if (Rl.exec(A.element("link").attribute("href"))[1] === d) {
            g = A;
            break;
          }
      }
    } catch (A) {
      throw (0, lr.newError)(`Cannot parse releases feed: ${A.stack || A.message},
XML:
${u}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (d == null)
      throw (0, lr.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let h, m = "", b = "";
    const E = async (A) => {
      m = (0, Kn.getChannelFilename)(A), b = (0, Kn.newUrlFromBase)(this.getBaseDownloadPath(String(d), m), this.baseUrl);
      const $ = this.createRequestOptions(b);
      try {
        return await this.executor.request($, s);
      } catch (I) {
        throw I instanceof lr.HttpError && I.statusCode === 404 ? (0, lr.newError)(`Cannot find ${m} in the latest release artifacts (${b}): ${I.stack || I.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : I;
      }
    };
    try {
      let A = this.channel;
      this.updater.allowPrerelease && (!((i = Qn.prerelease(d)) === null || i === void 0) && i[0]) && (A = this.getCustomChannelName(String((a = Qn.prerelease(d)) === null || a === void 0 ? void 0 : a[0]))), h = await E(A);
    } catch (A) {
      if (this.updater.allowPrerelease)
        h = await E(this.getDefaultChannelName());
      else
        throw A;
    }
    const C = (0, Jl.parseUpdateInfo)(h, m, b);
    return C.releaseName == null && (C.releaseName = g.elementValueOrEmpty("title")), C.releaseNotes == null && (C.releaseNotes = $p(this.updater.currentVersion, this.updater.fullChangelog, c, g)), {
      tag: d,
      ...C
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Kn.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new RC.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, lr.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Jl.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
xr.GitHubProvider = TC;
function qf(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function $p(e, t, r, n) {
  if (!t)
    return qf(n);
  const i = [];
  for (const a of r.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(a.element("link").attribute("href"))[1];
    Qn.lt(e, s) && i.push({
      version: s,
      note: qf(a)
    });
  }
  return i.sort((a, s) => Qn.rcompare(a.version, s.version));
}
var Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
Ss.KeygenProvider = void 0;
const jf = Me, Tl = St, Al = Ne;
class AC extends Al.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Tl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new jf.CancellationToken(), r = (0, Tl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Tl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Al.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, jf.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Al.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
Ss.KeygenProvider = AC;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
vs.PrivateGitHubProvider = void 0;
const Wn = Me, PC = We, $C = Ce, Wf = ai, Hf = St, IC = xr, OC = Ne;
class DC extends IC.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Wn.CancellationToken(), r = (0, Hf.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((u) => u.name === r);
    if (i == null)
      throw (0, Wn.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const a = new Wf.URL(i.url);
    let s;
    try {
      s = (0, PC.load)(await this.httpRequest(a, this.configureHeaders("application/octet-stream"), t));
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
    const i = (0, Hf.newUrlFromBase)(n, this.baseUrl);
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
    return (0, OC.getFileList)(t).map((r) => {
      const n = $C.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((a) => a != null && a.name === n);
      if (i == null)
        throw (0, Wn.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Wf.URL(i.url),
        info: r
      };
    });
  }
}
vs.PrivateGitHubProvider = DC;
Object.defineProperty(ws, "__esModule", { value: !0 });
ws.isUrlProbablySupportMultiRangeRequests = Ip;
ws.createClient = xC;
const Ta = Me, NC = Es, zf = wo, FC = xr, kC = Ss, LC = vs;
function Ip(e) {
  return !e.includes("s3.amazonaws.com");
}
function xC(e, t, r) {
  if (typeof e == "string")
    throw (0, Ta.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, a = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return a == null ? new FC.GitHubProvider(i, t, r) : new LC.PrivateGitHubProvider(i, t, a, r);
    }
    case "bitbucket":
      return new NC.BitbucketProvider(e, t, r);
    case "keygen":
      return new kC.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new zf.GenericProvider({
        provider: "generic",
        url: (0, Ta.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new zf.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Ip(i.url)
      });
    }
    case "custom": {
      const i = e, a = i.updateProvider;
      if (!a)
        throw (0, Ta.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new a(i, t, r);
    }
    default:
      throw (0, Ta.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Cs = {}, Eo = {}, ci = {}, mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.OperationKind = void 0;
mn.computeOperations = UC;
var sn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(sn || (mn.OperationKind = sn = {}));
function UC(e, t, r) {
  const n = Vf(e.files), i = Vf(t.files);
  let a = null;
  const s = t.files[0], u = [], c = s.name, g = n.get(c);
  if (g == null)
    throw new Error(`no file ${c} in old blockmap`);
  const d = i.get(c);
  let h = 0;
  const { checksumToOffset: m, checksumToOldSize: b } = MC(n.get(c), g.offset, r);
  let E = s.offset;
  for (let C = 0; C < d.checksums.length; E += d.sizes[C], C++) {
    const A = d.sizes[C], $ = d.checksums[C];
    let I = m.get($);
    I != null && b.get($) !== A && (r.warn(`Checksum ("${$}") matches, but size differs (old: ${b.get($)}, new: ${A})`), I = void 0), I === void 0 ? (h++, a != null && a.kind === sn.DOWNLOAD && a.end === E ? a.end += A : (a = {
      kind: sn.DOWNLOAD,
      start: E,
      end: E + A
      // oldBlocks: null,
    }, Gf(a, u, $, C))) : a != null && a.kind === sn.COPY && a.end === I ? a.end += A : (a = {
      kind: sn.COPY,
      start: I,
      end: I + A
      // oldBlocks: [checksum]
    }, Gf(a, u, $, C));
  }
  return h > 0 && r.info(`File${s.name === "file" ? "" : " " + s.name} has ${h} changed blocks`), u;
}
const BC = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Gf(e, t, r, n) {
  if (BC && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const a = [i.start, i.end, e.start, e.end].reduce((s, u) => s < u ? s : u);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${sn[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - a} until ${i.end - a} and ${e.start - a} until ${e.end - a}`);
    }
  }
  t.push(e);
}
function MC(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let a = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const u = e.checksums[s], c = e.sizes[s], g = i.get(u);
    if (g === void 0)
      n.set(u, a), i.set(u, c);
    else if (r.debug != null) {
      const d = g === c ? "(same size)" : `(size: ${g}, this size: ${c})`;
      r.debug(`${u} duplicated in blockmap ${d}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    a += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Vf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.DataSplitter = void 0;
ci.copyData = Op;
const Aa = Me, qC = Ur, jC = co, WC = mn, Yf = Buffer.from(`\r
\r
`);
var Pr;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Pr || (Pr = {}));
function Op(e, t, r, n, i) {
  const a = (0, qC.createReadStream)("", {
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
class HC extends jC.Writable {
  constructor(t, r, n, i, a, s) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = a, this.finishHandler = s, this.partIndex = -1, this.headerListBuffer = null, this.readState = Pr.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Aa.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Pr.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Pr.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Pr.BODY)
          this.readState = Pr.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Aa.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const u = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (u < s)
            await this.copyExistingData(u, s);
          else if (u > s)
            throw (0, Aa.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Pr.HEADER;
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
        if (s.kind !== WC.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Op(s, this.out, this.options.oldFileFd, i, () => {
          t++, a();
        });
      };
      a();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Yf, r);
    if (n !== -1)
      return n + Yf.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Aa.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
ci.DataSplitter = HC;
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
Rs.executeTasksUsingMultipleRangeRequests = zC;
Rs.checkIsRangesSupported = eu;
const Zl = Me, Xf = ci, Qf = mn;
function zC(e, t, r, n, i) {
  const a = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const u = s + 1e3;
    GC(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, u),
      oldFileFd: n
    }, r, () => a(u), i);
  };
  return a;
}
function GC(e, t, r, n, i) {
  let a = "bytes=", s = 0;
  const u = /* @__PURE__ */ new Map(), c = [];
  for (let h = t.start; h < t.end; h++) {
    const m = t.tasks[h];
    m.kind === Qf.OperationKind.DOWNLOAD && (a += `${m.start}-${m.end - 1}, `, u.set(s, h), s++, c.push(m.end - m.start));
  }
  if (s <= 1) {
    const h = (m) => {
      if (m >= t.end) {
        n();
        return;
      }
      const b = t.tasks[m++];
      if (b.kind === Qf.OperationKind.COPY)
        (0, Xf.copyData)(b, r, t.oldFileFd, i, () => h(m));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${b.start}-${b.end - 1}`;
        const C = e.httpExecutor.createRequest(E, (A) => {
          eu(A, i) && (A.pipe(r, {
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
  const d = e.httpExecutor.createRequest(g, (h) => {
    if (!eu(h, i))
      return;
    const m = (0, Zl.safeGetHeader)(h, "content-type"), b = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(m);
    if (b == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const E = new Xf.DataSplitter(r, t, u, b[1] || b[2], c, n);
    E.on("error", i), h.pipe(E), h.on("end", () => {
      setTimeout(() => {
        d.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(d, i), d.end();
}
function eu(e, t) {
  if (e.statusCode >= 400)
    return t((0, Zl.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Zl.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ts = {};
Object.defineProperty(Ts, "__esModule", { value: !0 });
Ts.ProgressDifferentialDownloadCallbackTransform = void 0;
const VC = co;
var Jn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Jn || (Jn = {}));
class YC extends VC.Transform {
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
Ts.ProgressDifferentialDownloadCallbackTransform = YC;
Object.defineProperty(Eo, "__esModule", { value: !0 });
Eo.DifferentialDownloader = void 0;
const Ni = Me, Pl = Br, XC = Ur, QC = ci, KC = ai, Pa = mn, Kf = Rs, JC = Ts;
class ZC {
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
    return (0, Ni.configureRequestUrl)(this.options.newUrl, t), (0, Ni.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Pa.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let a = 0, s = 0;
    for (const c of i) {
      const g = c.end - c.start;
      c.kind === Pa.OperationKind.DOWNLOAD ? a += g : s += g;
    }
    const u = this.blockAwareFileInfo.size;
    if (a + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== u)
      throw new Error(`Internal error, size mismatch: downloadSize: ${a}, copySize: ${s}, newSize: ${u}`);
    return n.info(`Full: ${Jf(u)}, To download: ${Jf(a)} (${Math.round(a / (u / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Pl.close)(i.descriptor).catch((a) => {
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
    const n = await (0, Pl.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Pl.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const a = (0, XC.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, u) => {
      const c = [];
      let g;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const $ = [];
        let I = 0;
        for (const x of t)
          x.kind === Pa.OperationKind.DOWNLOAD && ($.push(x.end - x.start), I += x.end - x.start);
        const M = {
          expectedByteCounts: $,
          grandTotal: I
        };
        g = new JC.ProgressDifferentialDownloadCallbackTransform(M, this.options.cancellationToken, this.options.onProgress), c.push(g);
      }
      const d = new Ni.DigestTransform(this.blockAwareFileInfo.sha512);
      d.isValidateOnEnd = !1, c.push(d), a.on("finish", () => {
        a.close(() => {
          r.splice(1, 1);
          try {
            d.validate();
          } catch ($) {
            u($);
            return;
          }
          s(void 0);
        });
      }), c.push(a);
      let h = null;
      for (const $ of c)
        $.on("error", u), h == null ? h = $ : h = h.pipe($);
      const m = c[0];
      let b;
      if (this.options.isUseMultipleRangeRequest) {
        b = (0, Kf.executeTasksUsingMultipleRangeRequests)(this, t, m, n, u), b(0);
        return;
      }
      let E = 0, C = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const A = this.createRequestOptions();
      A.redirect = "manual", b = ($) => {
        var I, M;
        if ($ >= t.length) {
          this.fileMetadataBuffer != null && m.write(this.fileMetadataBuffer), m.end();
          return;
        }
        const x = t[$++];
        if (x.kind === Pa.OperationKind.COPY) {
          g && g.beginFileCopy(), (0, QC.copyData)(x, m, n, u, () => b($));
          return;
        }
        const te = `bytes=${x.start}-${x.end - 1}`;
        A.headers.range = te, (M = (I = this.logger) === null || I === void 0 ? void 0 : I.debug) === null || M === void 0 || M.call(I, `download range: ${te}`), g && g.beginRangeDownload();
        const ae = this.httpExecutor.createRequest(A, (Q) => {
          Q.on("error", u), Q.on("aborted", () => {
            u(new Error("response has been aborted by the server"));
          }), Q.statusCode >= 400 && u((0, Ni.createHttpError)(Q)), Q.pipe(m, {
            end: !1
          }), Q.once("end", () => {
            g && g.endRangeDownload(), ++E === 100 ? (E = 0, setTimeout(() => b($), 1e3)) : b($);
          });
        });
        ae.on("redirect", (Q, Fe, S) => {
          this.logger.info(`Redirect to ${eR(S)}`), C = S, (0, Ni.configureRequestUrl)(new KC.URL(C), A), ae.followRedirect();
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
        (0, Kf.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", r), s.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(a, i), a.end();
    });
  }
}
Eo.DifferentialDownloader = ZC;
function Jf(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function eR(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.GenericDifferentialDownloader = void 0;
const tR = Eo;
class rR extends tR.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
Cs.GenericDifferentialDownloader = rR;
var Mr = {};
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
})(Mr);
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.NoOpLogger = Nr.AppUpdater = void 0;
const Qe = Me, nR = fo, iR = ns, oR = wd, Hn = Br, aR = We, $l = hs, tn = Ce, on = vp, Zf = _o, sR = _s, ed = Cp, lR = wo, Il = ws, uR = Sd, cR = St, fR = Cs, zn = Mr;
class Nu extends oR.EventEmitter {
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
    return (0, ed.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Dp();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new $l.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new zn.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (a) => this.checkIfUpdateSupported(a), this.clientPromise = null, this.stagingUserIdPromise = new $l.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new $l.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (a) => {
      this._logger.error(`Error: ${a.stack || a.message}`);
    }), r == null ? (this.app = new sR.ElectronAppAdapter(), this.httpExecutor = new ed.ElectronHttpExecutor((a, s) => this.emit("login", a, s))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, on.parse)(n);
    if (i == null)
      throw (0, Qe.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = dR(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new lR.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Il.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Il.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Nu.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
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
    const i = await this.stagingUserIdPromise.value, s = Qe.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${s}, user id: ${i}`), s < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, on.parse)(t.version);
    if (r == null)
      throw (0, Qe.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, on.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const a = (0, on.gt)(r, n), s = (0, on.lt)(r, n);
    return a ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, iR.release)();
    if (r)
      try {
        if ((0, on.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Il.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    this.emit(zn.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, aR.load)(await (0, Hn.readFile)(this._appUpdateConfigPath, "utf-8"));
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
      if (Qe.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Qe.UUID.v5((0, nR.randomBytes)(4096), Qe.UUID.OID);
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
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Zf.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(zn.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (I) => this.emit(zn.DOWNLOAD_PROGRESS, I));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = r.packageInfo;
    function u() {
      const I = decodeURIComponent(t.fileInfo.url.pathname);
      return I.endsWith(`.${t.fileExtension}`) ? tn.basename(I) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), g = c.cacheDirForPendingUpdate;
    await (0, Hn.mkdir)(g, { recursive: !0 });
    const d = u();
    let h = tn.join(g, d);
    const m = s == null ? null : tn.join(g, `package-${a}${tn.extname(s.path) || ".7z"}`), b = async (I) => (await c.setDownloadedFile(h, m, i, r, d, I), await t.done({
      ...i,
      downloadedFile: h
    }), m == null ? [h] : [h, m]), E = this._logger, C = await c.validateDownloadedPath(h, i, r, E);
    if (C != null)
      return h = C, await b(!1);
    const A = async () => (await c.clear().catch(() => {
    }), await (0, Hn.unlink)(h).catch(() => {
    })), $ = await (0, Zf.createTempUpdateFile)(`temp-${d}`, g, E);
    try {
      await t.task($, n, m, A), await (0, Qe.retry)(() => (0, Hn.rename)($, h), 60, 500, 0, 0, (I) => I instanceof Error && /^EBUSY:/.test(I.message));
    } catch (I) {
      throw await A(), I instanceof Qe.CancellationError && (E.info("cancelled"), this.emit("update-cancelled", i)), I;
    }
    return E.info(`New version ${a} has been downloaded to ${h}`), await b(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, a) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = (0, cR.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const u = async (d) => {
        const h = await this.httpExecutor.downloadToBuffer(d, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (h == null || h.length === 0)
          throw new Error(`Blockmap "${d.href}" is empty`);
        try {
          return JSON.parse((0, uR.gunzipSync)(h).toString());
        } catch (m) {
          throw new Error(`Cannot parse blockmap "${d.href}", error: ${m}`);
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
      this.listenerCount(zn.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (d) => this.emit(zn.DOWNLOAD_PROGRESS, d));
      const g = await Promise.all(s.map((d) => u(d)));
      return await new fR.GenericDifferentialDownloader(t.info, this.httpExecutor, c).download(g[0], g[1]), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
Nr.AppUpdater = Nu;
function dR(e) {
  const t = (0, on.prerelease)(e);
  return t != null && t.length > 0;
}
class Dp {
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
Nr.NoOpLogger = Dp;
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.BaseUpdater = void 0;
const td = rs, hR = Nr;
class pR extends hR.AppUpdater {
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
    const i = (0, td.spawnSync)(t, r, {
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
        const u = { stdio: i, env: n, detached: !0 }, c = (0, td.spawn)(t, r, u);
        c.on("error", (g) => {
          s(g);
        }), c.unref(), c.pid !== void 0 && a(!0);
      } catch (u) {
        s(u);
      }
    });
  }
}
hr.BaseUpdater = pR;
var to = {}, So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
So.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Gn = Br, mR = Eo, gR = Sd;
class yR extends mR.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Np(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await bR(this.options.oldFile), i);
  }
}
So.FileWithEmbeddedBlockMapDifferentialDownloader = yR;
function Np(e) {
  return JSON.parse((0, gR.inflateRawSync)(e).toString());
}
async function bR(e) {
  const t = await (0, Gn.open)(e, "r");
  try {
    const r = (await (0, Gn.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Gn.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Gn.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Gn.close)(t), Np(i);
  } catch (r) {
    throw await (0, Gn.close)(t), r;
  }
}
Object.defineProperty(to, "__esModule", { value: !0 });
to.AppImageUpdater = void 0;
const rd = Me, nd = rs, _R = Br, wR = Ur, Fi = Ce, ER = hr, SR = So, vR = Ne, id = Mr;
class CR extends ER.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, vR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, rd.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, s, i, r, t)) && await this.httpExecutor.download(n.url, i, a), await (0, _R.chmod)(i, 493);
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
      return this.listenerCount(id.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (u) => this.emit(id.DOWNLOAD_PROGRESS, u)), await new SR.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, rd.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, wR.unlinkSync)(r);
    let n;
    const i = Fi.basename(r), a = this.installerPath;
    if (a == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    Fi.basename(a) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = Fi.join(Fi.dirname(r), Fi.basename(a)), (0, nd.execFileSync)("mv", ["-f", a, n]), n !== r && this.emit("appimage-filename-updated", n);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, nd.execFileSync)(n, [], { env: s })), !0;
  }
}
to.AppImageUpdater = CR;
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.DebUpdater = void 0;
const RR = hr, TR = Ne, od = Mr;
class AR extends RR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, TR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(od.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(od.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
ro.DebUpdater = AR;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
no.PacmanUpdater = void 0;
const PR = hr, ad = Mr, $R = Ne;
class IR extends PR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, $R.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(ad.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(ad.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
no.PacmanUpdater = IR;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
io.RpmUpdater = void 0;
const OR = hr, sd = Mr, DR = Ne;
class NR extends OR.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, DR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, a) => {
        this.listenerCount(sd.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(sd.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(n.url, i, a);
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
io.RpmUpdater = NR;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
oo.MacUpdater = void 0;
const ld = Me, Ol = Br, FR = Ur, ud = Ce, kR = Ym, LR = Nr, xR = Ne, cd = rs, fd = fo;
class UR extends LR.AppUpdater {
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
      this.debug("Checking for macOS Rosetta environment"), a = (0, cd.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${a})`);
    } catch (h) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${h}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const m = (0, cd.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const c = (0, xR.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, ld.newError)(`ZIP file not provided: ${(0, ld.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const g = t.updateInfoAndProvider.provider, d = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (h, m) => {
        const b = ud.join(this.downloadedUpdateHelper.cacheDir, d), E = () => (0, Ol.pathExistsSync)(b) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let C = !0;
        E() && (C = await this.differentialDownloadInstaller(c, t, h, g, d)), C && await this.httpExecutor.download(c.url, h, m);
      },
      done: async (h) => {
        if (!t.disableDifferentialDownload)
          try {
            const m = ud.join(this.downloadedUpdateHelper.cacheDir, d);
            await (0, Ol.copyFile)(h.downloadedFile, m);
          } catch (m) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${m.message}`);
          }
        return this.updateDownloaded(c, h);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, a = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Ol.stat)(i)).size, s = this._logger, u = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${u})`), this.server = (0, kR.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${u})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${u})`);
    });
    const c = (g) => {
      const d = g.address();
      return typeof d == "string" ? d : `http://127.0.0.1:${d == null ? void 0 : d.port}`;
    };
    return await new Promise((g, d) => {
      const h = (0, fd.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), m = Buffer.from(`autoupdater:${h}`, "ascii"), b = `/${(0, fd.randomBytes)(64).toString("hex")}.zip`;
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
        let $ = !1;
        C.on("finish", () => {
          $ || (this.nativeUpdater.removeListener("error", d), g([]));
        });
        const I = (0, FR.createReadStream)(i);
        I.on("error", (M) => {
          try {
            C.end();
          } catch (x) {
            s.warn(`cannot end response: ${x}`);
          }
          $ = !0, this.nativeUpdater.removeListener("error", d), d(new Error(`Cannot pipe "${i}": ${M}`));
        }), C.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": a
        }), I.pipe(C);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${u})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${u})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${m.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", d), this.nativeUpdater.checkForUpdates()) : g([]);
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
oo.MacUpdater = UR;
var ao = {}, Fu = {};
Object.defineProperty(Fu, "__esModule", { value: !0 });
Fu.verifySignature = MR;
const dd = Me, Fp = rs, BR = ns, hd = Ce;
function MR(e, t, r) {
  return new Promise((n, i) => {
    const a = t.replace(/'/g, "''");
    r.info(`Verifying signature ${a}`), (0, Fp.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${a}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (s, u, c) => {
      var g;
      try {
        if (s != null || c) {
          Dl(r, s, c, i), n(null);
          return;
        }
        const d = qR(u);
        if (d.Status === 0) {
          try {
            const E = hd.normalize(d.Path), C = hd.normalize(t);
            if (r.info(`LiteralPath: ${E}. Update Path: ${C}`), E !== C) {
              Dl(r, new Error(`LiteralPath of ${E} is different than ${C}`), c, i), n(null);
              return;
            }
          } catch (E) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(g = E.message) !== null && g !== void 0 ? g : E.stack}`);
          }
          const m = (0, dd.parseDn)(d.SignerCertificate.Subject);
          let b = !1;
          for (const E of e) {
            const C = (0, dd.parseDn)(E);
            if (C.size ? b = Array.from(C.keys()).every(($) => C.get($) === m.get($)) : E === m.get("CN") && (r.warn(`Signature validated using only CN ${E}. Please add your full Distinguished Name (DN) to publisherNames configuration`), b = !0), b) {
              n(null);
              return;
            }
          }
        }
        const h = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(d, (m, b) => m === "RawData" ? void 0 : b, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${h}`), n(h);
      } catch (d) {
        Dl(r, d, null, i), n(null);
        return;
      }
    });
  });
}
function qR(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Dl(e, t, r, n) {
  if (jR()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Fp.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function jR() {
  const e = BR.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(ao, "__esModule", { value: !0 });
ao.NsisUpdater = void 0;
const $a = Me, pd = Ce, WR = hr, HR = So, md = Mr, zR = Ne, GR = Br, VR = Fu, gd = ai;
class YR extends WR.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, VR.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, zR.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, a, s, u) => {
        const c = n.packageInfo, g = c != null && s != null;
        if (g && t.disableWebInstaller)
          throw (0, $a.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !g && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (g || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, $a.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, a);
        const d = await this.verifySignature(i);
        if (d != null)
          throw await u(), (0, $a.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${d}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (g && await this.differentialDownloadWebPackage(t, c, s, r))
          try {
            await this.httpExecutor.download(new gd.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (h) {
            try {
              await (0, GR.unlink)(s);
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
      this.spawnLog(pd.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((s) => this.dispatchError(s));
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
        newUrl: new gd.URL(r.path),
        oldFile: pd.join(this.downloadedUpdateHelper.cacheDir, $a.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(md.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(md.DOWNLOAD_PROGRESS, s)), await new HR.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, a).download();
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "win32";
    }
    return !1;
  }
}
ao.NsisUpdater = YR;
(function(e) {
  var t = Be && Be.__createBinding || (Object.create ? function(A, $, I, M) {
    M === void 0 && (M = I);
    var x = Object.getOwnPropertyDescriptor($, I);
    (!x || ("get" in x ? !$.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return $[I];
    } }), Object.defineProperty(A, M, x);
  } : function(A, $, I, M) {
    M === void 0 && (M = I), A[M] = $[I];
  }), r = Be && Be.__exportStar || function(A, $) {
    for (var I in A) I !== "default" && !Object.prototype.hasOwnProperty.call($, I) && t($, A, I);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = Br, i = Ce;
  var a = hr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return a.BaseUpdater;
  } });
  var s = Nr;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var u = Ne;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return u.Provider;
  } });
  var c = to;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var g = ro;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return g.DebUpdater;
  } });
  var d = no;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return d.PacmanUpdater;
  } });
  var h = io;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return h.RpmUpdater;
  } });
  var m = oo;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return m.MacUpdater;
  } });
  var b = ao;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return b.NsisUpdater;
  } }), r(Mr, e);
  let E;
  function C() {
    if (process.platform === "win32")
      E = new ao.NsisUpdater();
    else if (process.platform === "darwin")
      E = new oo.MacUpdater();
    else {
      E = new to.AppImageUpdater();
      try {
        const A = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(A))
          return E;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const $ = (0, n.readFileSync)(A).toString().trim();
        switch (console.info("Found package-type:", $), $) {
          case "deb":
            E = new ro.DebUpdater();
            break;
          case "rpm":
            E = new io.RpmUpdater();
            break;
          case "pacman":
            E = new no.PacmanUpdater();
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
})(rn);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const XR = Mm(import.meta.url), Nl = Um(XR);
let ge = null;
const ku = new kl(), Ja = new Cg(), Je = new Tg();
let Fl = null;
ku.on("status", (e, t) => {
  ge == null || ge.webContents.send("lcu-status", e), e === "connected" && t ? (ge == null || ge.show(), Ja.setCreds(t), Je.setCreds(t), Je.start()) : (Ja.stop(), Je.stop(), ge == null || ge.hide());
});
Ja.on("phase", (e) => {
  ge == null || ge.webContents.send("gameflow-phase", e);
});
Je.on(
  "skins",
  (e) => {
    ge == null || ge.webContents.send("owned-skins", e);
  }
  // ← cast ajouté
);
Je.on("selection", (e) => ge == null ? void 0 : ge.webContents.send("selection", e));
Je.on("icon", (e) => {
  ge == null || ge.webContents.send("summoner-icon", e);
});
function QR() {
  const e = (r) => ji.isPackaged ? da(process.resourcesPath, "assets", r) : da(Nl, "..", "public", r);
  ge = new Fm({
    width: 900,
    height: 645,
    // 563
    resizable: !1,
    // ← l’utilisateur ne peut plus redimensionner
    maximizable: !1,
    // ← désactive le bouton “plein écran” (Windows / Linux)
    fullscreenable: !1,
    // ← désactive ⌥⌘F sur macOS
    icon: e("icon.ico"),
    show: !1,
    webPreferences: {
      preload: da(Nl, "preload.mjs"),
      contextIsolation: !0
    }
  }), km.setApplicationMenu(null);
  const t = Lm.createFromPath(e("icon.ico"));
  Fl = new xm(t), Fl.setToolTip("LoL Skin Picker"), Fl.on("double-click", () => ge.isVisible() ? ge.hide() : ge.show()), process.env.VITE_DEV_SERVER_URL ? ge.loadURL(process.env.VITE_DEV_SERVER_URL) : ge.loadFile(da(Nl, "..", "dist", "index.html")), ku.start();
}
function KR() {
  ji.isPackaged && (rn.autoUpdater.on(
    "checking-for-update",
    () => console.log("[Updater] checking…")
  ), rn.autoUpdater.on(
    "update-available",
    (e) => console.log("[Updater] available", e.version)
  ), rn.autoUpdater.on("update-not-available", () => console.log("[Updater] none")), rn.autoUpdater.on(
    "download-progress",
    (e) => console.log(`[Updater] ${Math.round(e.percent)} %`)
  ), rn.autoUpdater.on("update-downloaded", () => {
    console.log("[Updater] downloaded – will install on quit");
  }), rn.autoUpdater.checkForUpdatesAndNotify());
}
It.handle("get-lcu-status", () => ku.status);
It.handle("get-gameflow-phase", () => Ja.phase);
It.handle("get-owned-skins", () => Je.skins);
It.handle("get-include-default", () => Je.getIncludeDefault());
It.handle("toggle-include-default", () => Je.toggleIncludeDefault());
It.handle("reroll-skin", () => Je.rerollSkin());
It.handle("reroll-chroma", () => Je.rerollChroma());
It.handle("get-selection", () => Je.getSelection());
It.handle("get-auto-roll", () => Je.getAutoRoll());
It.handle("toggle-auto-roll", () => Je.toggleAutoRoll());
It.handle("get-summoner-icon", () => Je.getProfileIcon());
ji.whenReady().then(() => {
  QR(), KR();
});
ji.on("window-all-closed", () => process.platform !== "darwin" && ji.quit());
export {
  Ll as F,
  Zm as a
};
