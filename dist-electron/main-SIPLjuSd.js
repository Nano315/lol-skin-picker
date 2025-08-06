var La = Object.defineProperty;
var Oo = (a) => {
  throw TypeError(a);
};
var Da = (a, o, n) => o in a ? La(a, o, { enumerable: !0, configurable: !0, writable: !0, value: n }) : a[o] = n;
var O = (a, o, n) => Da(a, typeof o != "symbol" ? o + "" : o, n), zo = (a, o, n) => o.has(a) || Oo("Cannot " + n);
var $ = (a, o, n) => (zo(a, o, "read from private field"), n ? n.call(a) : o.get(a)), qe = (a, o, n) => o.has(a) ? Oo("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(a) : o.set(a, n), le = (a, o, n, s) => (zo(a, o, "write to private field"), s ? s.call(a, n) : o.set(a, n), n);
import { ipcMain as ie, app as or, BrowserWindow as ja, Menu as Ma, nativeImage as Ua, Tray as Na } from "electron";
import { dirname as xa, join as tr } from "node:path";
import { format as Ha, fileURLToPath as Va } from "node:url";
import Qa, { promises as Ya } from "node:fs";
import { EventEmitter as hn } from "node:events";
import gt from "node:http";
import Ga from "node:https";
import rt from "node:zlib";
import fe, { PassThrough as ir, pipeline as nt } from "node:stream";
import { Buffer as j } from "node:buffer";
import { types as ar, deprecate as hr, promisify as Za } from "node:util";
import { isIP as Ja } from "node:net";
const cr = class cr extends hn {
  constructor() {
    super(...arguments);
    O(this, "status", "disconnected");
    O(this, "creds", null);
    O(this, "timer", null);
    O(this, "rawCache", "");
  }
  /* ---------- API publique ---------- */
  start(n = 2e3) {
    this.timer || (this.tick(), this.timer = setInterval(() => this.tick(), n));
  }
  /* ---------- cœur du watcher ---------- */
  tick() {
    const n = this.readLockfile();
    if (!n) {
      this.toDisconnected();
      return;
    }
    if (n !== this.rawCache) {
      this.rawCache = n;
      const s = this.parse(n);
      if (!s) {
        this.toDisconnected();
        return;
      }
      this.toConnected(s);
    }
  }
  toConnected(n) {
    this.status = "connected", this.creds = n, this.emit("status", "connected", n);
  }
  toDisconnected() {
    this.status !== "disconnected" && (this.status = "disconnected", this.creds = null, this.rawCache = "", this.emit("status", "disconnected"));
  }
  /* ---------- utilitaires ---------- */
  readLockfile() {
    for (const n of cr.FILES)
      try {
        return Qa.readFileSync(n, "utf8");
      } catch {
      }
    return null;
  }
  /** ProcessName:PID:Port:Password:Protocol(:Address) */
  parse(n) {
    const s = n.trim().split(":");
    return s.length < 5 ? null : {
      port: s[2].trim(),
      password: s[3].trim(),
      protocol: s[4].trim()
      // « https »
    };
  }
  /* -------- typings EventEmitter -------- */
  on(n, s) {
    return super.on(n, s);
  }
  emit(n, s, u) {
    return super.emit(n, s, u);
  }
};
// garde le contenu brut pour détecter tout changement
/** chemins possibles du lockfile */
O(cr, "FILES", [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile"
]);
let un = cr;
function Ka(a) {
  if (!/^data:/i.test(a))
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  a = a.replace(/\r?\n/g, "");
  const o = a.indexOf(",");
  if (o === -1 || o <= 4)
    throw new TypeError("malformed data: URI");
  const n = a.substring(5, o).split(";");
  let s = "", u = !1;
  const h = n[0] || "text/plain";
  let d = h;
  for (let w = 1; w < n.length; w++)
    n[w] === "base64" ? u = !0 : n[w] && (d += `;${n[w]}`, n[w].indexOf("charset=") === 0 && (s = n[w].substring(8)));
  !n[0] && !s.length && (d += ";charset=US-ASCII", s = "US-ASCII");
  const S = u ? "base64" : "ascii", T = unescape(a.substring(o + 1)), b = Buffer.from(T, S);
  return b.type = h, b.typeFull = d, b.charset = s, b;
}
var rn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, rr = { exports: {} };
/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */
var Fo;
function Xa() {
  return Fo || (Fo = 1, function(a, o) {
    (function(n, s) {
      s(o);
    })(rn, function(n) {
      function s() {
      }
      function u(e) {
        return typeof e == "object" && e !== null || typeof e == "function";
      }
      const h = s;
      function d(e, t) {
        try {
          Object.defineProperty(e, "name", {
            value: t,
            configurable: !0
          });
        } catch {
        }
      }
      const S = Promise, T = Promise.prototype.then, b = Promise.reject.bind(S);
      function w(e) {
        return new S(e);
      }
      function g(e) {
        return w((t) => t(e));
      }
      function m(e) {
        return b(e);
      }
      function k(e, t, r) {
        return T.call(e, t, r);
      }
      function _(e, t, r) {
        k(k(e, t, r), void 0, h);
      }
      function Q(e, t) {
        _(e, t);
      }
      function q(e, t) {
        _(e, void 0, t);
      }
      function z(e, t, r) {
        return k(e, t, r);
      }
      function Y(e) {
        k(e, void 0, h);
      }
      let ce = (e) => {
        if (typeof queueMicrotask == "function")
          ce = queueMicrotask;
        else {
          const t = g(void 0);
          ce = (r) => k(t, r);
        }
        return ce(e);
      };
      function W(e, t, r) {
        if (typeof e != "function")
          throw new TypeError("Argument is not a function");
        return Function.prototype.apply.call(e, t, r);
      }
      function F(e, t, r) {
        try {
          return g(W(e, t, r));
        } catch (i) {
          return m(i);
        }
      }
      const M = 16384;
      class U {
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
        push(t) {
          const r = this._back;
          let i = r;
          r._elements.length === M - 1 && (i = {
            _elements: [],
            _next: void 0
          }), r._elements.push(t), i !== r && (this._back = i, r._next = i), ++this._size;
        }
        // Like push(), shift() follows the read -> calculate -> mutate pattern for
        // exception safety.
        shift() {
          const t = this._front;
          let r = t;
          const i = this._cursor;
          let l = i + 1;
          const f = t._elements, c = f[i];
          return l === M && (r = t._next, l = 0), --this._size, this._cursor = l, t !== r && (this._front = r), f[i] = void 0, c;
        }
        // The tricky thing about forEach() is that it can be called
        // re-entrantly. The queue may be mutated inside the callback. It is easy to
        // see that push() within the callback has no negative effects since the end
        // of the queue is checked for on every iteration. If shift() is called
        // repeatedly within the callback then the next iteration may return an
        // element that has been removed. In this case the callback will be called
        // with undefined values until we either "catch up" with elements that still
        // exist or reach the back of the queue.
        forEach(t) {
          let r = this._cursor, i = this._front, l = i._elements;
          for (; (r !== l.length || i._next !== void 0) && !(r === l.length && (i = i._next, l = i._elements, r = 0, l.length === 0)); )
            t(l[r]), ++r;
        }
        // Return the element that would be returned if shift() was called now,
        // without modifying the queue.
        peek() {
          const t = this._front, r = this._cursor;
          return t._elements[r];
        }
      }
      const Tt = Symbol("[[AbortSteps]]"), bn = Symbol("[[ErrorSteps]]"), pr = Symbol("[[CancelSteps]]"), br = Symbol("[[PullSteps]]"), yr = Symbol("[[ReleaseSteps]]");
      function yn(e, t) {
        e._ownerReadableStream = t, t._reader = e, t._state === "readable" ? _r(e) : t._state === "closed" ? Yo(e) : gn(e, t._storedError);
      }
      function gr(e, t) {
        const r = e._ownerReadableStream;
        return re(r, t);
      }
      function de(e) {
        const t = e._ownerReadableStream;
        t._state === "readable" ? Sr(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : Go(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t._readableStreamController[yr](), t._reader = void 0, e._ownerReadableStream = void 0;
      }
      function Pt(e) {
        return new TypeError("Cannot " + e + " a stream using a released reader");
      }
      function _r(e) {
        e._closedPromise = w((t, r) => {
          e._closedPromise_resolve = t, e._closedPromise_reject = r;
        });
      }
      function gn(e, t) {
        _r(e), Sr(e, t);
      }
      function Yo(e) {
        _r(e), _n(e);
      }
      function Sr(e, t) {
        e._closedPromise_reject !== void 0 && (Y(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
      }
      function Go(e, t) {
        gn(e, t);
      }
      function _n(e) {
        e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
      }
      const Sn = Number.isFinite || function(e) {
        return typeof e == "number" && isFinite(e);
      }, Zo = Math.trunc || function(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e);
      };
      function Jo(e) {
        return typeof e == "object" || typeof e == "function";
      }
      function ae(e, t) {
        if (e !== void 0 && !Jo(e))
          throw new TypeError(`${t} is not an object.`);
      }
      function J(e, t) {
        if (typeof e != "function")
          throw new TypeError(`${t} is not a function.`);
      }
      function Ko(e) {
        return typeof e == "object" && e !== null || typeof e == "function";
      }
      function wn(e, t) {
        if (!Ko(e))
          throw new TypeError(`${t} is not an object.`);
      }
      function he(e, t, r) {
        if (e === void 0)
          throw new TypeError(`Parameter ${t} is required in '${r}'.`);
      }
      function wr(e, t, r) {
        if (e === void 0)
          throw new TypeError(`${t} is required in '${r}'.`);
      }
      function Rr(e) {
        return Number(e);
      }
      function Rn(e) {
        return e === 0 ? 0 : e;
      }
      function Xo(e) {
        return Rn(Zo(e));
      }
      function Cr(e, t) {
        const i = Number.MAX_SAFE_INTEGER;
        let l = Number(e);
        if (l = Rn(l), !Sn(l))
          throw new TypeError(`${t} is not a finite number`);
        if (l = Xo(l), l < 0 || l > i)
          throw new TypeError(`${t} is outside the accepted range of 0 to ${i}, inclusive`);
        return !Sn(l) || l === 0 ? 0 : l;
      }
      function Tr(e, t) {
        if (!Ae(e))
          throw new TypeError(`${t} is not a ReadableStream.`);
      }
      function xe(e) {
        return new Ce(e);
      }
      function Cn(e, t) {
        e._reader._readRequests.push(t);
      }
      function Pr(e, t, r) {
        const l = e._reader._readRequests.shift();
        r ? l._closeSteps() : l._chunkSteps(t);
      }
      function Et(e) {
        return e._reader._readRequests.length;
      }
      function Tn(e) {
        const t = e._reader;
        return !(t === void 0 || !Te(t));
      }
      class Ce {
        constructor(t) {
          if (he(t, 1, "ReadableStreamDefaultReader"), Tr(t, "First parameter"), Be(t))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          yn(this, t), this._readRequests = new U();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return Te(this) ? this._closedPromise : m(vt("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(t = void 0) {
          return Te(this) ? this._ownerReadableStream === void 0 ? m(Pt("cancel")) : gr(this, t) : m(vt("cancel"));
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!Te(this))
            return m(vt("read"));
          if (this._ownerReadableStream === void 0)
            return m(Pt("read from"));
          let t, r;
          const i = w((f, c) => {
            t = f, r = c;
          });
          return at(this, {
            _chunkSteps: (f) => t({ value: f, done: !1 }),
            _closeSteps: () => t({ value: void 0, done: !0 }),
            _errorSteps: (f) => r(f)
          }), i;
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
          if (!Te(this))
            throw vt("releaseLock");
          this._ownerReadableStream !== void 0 && ei(this);
        }
      }
      Object.defineProperties(Ce.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), d(Ce.prototype.cancel, "cancel"), d(Ce.prototype.read, "read"), d(Ce.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ce.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultReader",
        configurable: !0
      });
      function Te(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readRequests") ? !1 : e instanceof Ce;
      }
      function at(e, t) {
        const r = e._ownerReadableStream;
        r._disturbed = !0, r._state === "closed" ? t._closeSteps() : r._state === "errored" ? t._errorSteps(r._storedError) : r._readableStreamController[br](t);
      }
      function ei(e) {
        de(e);
        const t = new TypeError("Reader was released");
        Pn(e, t);
      }
      function Pn(e, t) {
        const r = e._readRequests;
        e._readRequests = new U(), r.forEach((i) => {
          i._errorSteps(t);
        });
      }
      function vt(e) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`);
      }
      const ti = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class En {
        constructor(t, r) {
          this._ongoingPromise = void 0, this._isFinished = !1, this._reader = t, this._preventCancel = r;
        }
        next() {
          const t = () => this._nextSteps();
          return this._ongoingPromise = this._ongoingPromise ? z(this._ongoingPromise, t, t) : t(), this._ongoingPromise;
        }
        return(t) {
          const r = () => this._returnSteps(t);
          return this._ongoingPromise ? z(this._ongoingPromise, r, r) : r();
        }
        _nextSteps() {
          if (this._isFinished)
            return Promise.resolve({ value: void 0, done: !0 });
          const t = this._reader;
          let r, i;
          const l = w((c, p) => {
            r = c, i = p;
          });
          return at(t, {
            _chunkSteps: (c) => {
              this._ongoingPromise = void 0, ce(() => r({ value: c, done: !1 }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0, this._isFinished = !0, de(t), r({ value: void 0, done: !0 });
            },
            _errorSteps: (c) => {
              this._ongoingPromise = void 0, this._isFinished = !0, de(t), i(c);
            }
          }), l;
        }
        _returnSteps(t) {
          if (this._isFinished)
            return Promise.resolve({ value: t, done: !0 });
          this._isFinished = !0;
          const r = this._reader;
          if (!this._preventCancel) {
            const i = gr(r, t);
            return de(r), z(i, () => ({ value: t, done: !0 }));
          }
          return de(r), g({ value: t, done: !0 });
        }
      }
      const vn = {
        next() {
          return kn(this) ? this._asyncIteratorImpl.next() : m(An("next"));
        },
        return(e) {
          return kn(this) ? this._asyncIteratorImpl.return(e) : m(An("return"));
        }
      };
      Object.setPrototypeOf(vn, ti);
      function ri(e, t) {
        const r = xe(e), i = new En(r, t), l = Object.create(vn);
        return l._asyncIteratorImpl = i, l;
      }
      function kn(e) {
        if (!u(e) || !Object.prototype.hasOwnProperty.call(e, "_asyncIteratorImpl"))
          return !1;
        try {
          return e._asyncIteratorImpl instanceof En;
        } catch {
          return !1;
        }
      }
      function An(e) {
        return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`);
      }
      const Bn = Number.isNaN || function(e) {
        return e !== e;
      };
      var Er, vr, kr;
      function st(e) {
        return e.slice();
      }
      function In(e, t, r, i, l) {
        new Uint8Array(e).set(new Uint8Array(r, i, l), t);
      }
      let me = (e) => (typeof e.transfer == "function" ? me = (t) => t.transfer() : typeof structuredClone == "function" ? me = (t) => structuredClone(t, { transfer: [t] }) : me = (t) => t, me(e)), Pe = (e) => (typeof e.detached == "boolean" ? Pe = (t) => t.detached : Pe = (t) => t.byteLength === 0, Pe(e));
      function Wn(e, t, r) {
        if (e.slice)
          return e.slice(t, r);
        const i = r - t, l = new ArrayBuffer(i);
        return In(l, 0, e, t, i), l;
      }
      function kt(e, t) {
        const r = e[t];
        if (r != null) {
          if (typeof r != "function")
            throw new TypeError(`${String(t)} is not a function`);
          return r;
        }
      }
      function ni(e) {
        const t = {
          [Symbol.iterator]: () => e.iterator
        }, r = async function* () {
          return yield* t;
        }(), i = r.next;
        return { iterator: r, nextMethod: i, done: !1 };
      }
      const Ar = (kr = (Er = Symbol.asyncIterator) !== null && Er !== void 0 ? Er : (vr = Symbol.for) === null || vr === void 0 ? void 0 : vr.call(Symbol, "Symbol.asyncIterator")) !== null && kr !== void 0 ? kr : "@@asyncIterator";
      function qn(e, t = "sync", r) {
        if (r === void 0)
          if (t === "async") {
            if (r = kt(e, Ar), r === void 0) {
              const f = kt(e, Symbol.iterator), c = qn(e, "sync", f);
              return ni(c);
            }
          } else
            r = kt(e, Symbol.iterator);
        if (r === void 0)
          throw new TypeError("The object is not iterable");
        const i = W(r, e, []);
        if (!u(i))
          throw new TypeError("The iterator method must return an object");
        const l = i.next;
        return { iterator: i, nextMethod: l, done: !1 };
      }
      function oi(e) {
        const t = W(e.nextMethod, e.iterator, []);
        if (!u(t))
          throw new TypeError("The iterator.next() method must return an object");
        return t;
      }
      function ii(e) {
        return !!e.done;
      }
      function ai(e) {
        return e.value;
      }
      function si(e) {
        return !(typeof e != "number" || Bn(e) || e < 0);
      }
      function On(e) {
        const t = Wn(e.buffer, e.byteOffset, e.byteOffset + e.byteLength);
        return new Uint8Array(t);
      }
      function Br(e) {
        const t = e._queue.shift();
        return e._queueTotalSize -= t.size, e._queueTotalSize < 0 && (e._queueTotalSize = 0), t.value;
      }
      function Ir(e, t, r) {
        if (!si(r) || r === 1 / 0)
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        e._queue.push({ value: t, size: r }), e._queueTotalSize += r;
      }
      function li(e) {
        return e._queue.peek().value;
      }
      function Ee(e) {
        e._queue = new U(), e._queueTotalSize = 0;
      }
      function zn(e) {
        return e === DataView;
      }
      function ui(e) {
        return zn(e.constructor);
      }
      function fi(e) {
        return zn(e) ? 1 : e.BYTES_PER_ELEMENT;
      }
      class Oe {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!Wr(this))
            throw $r("view");
          return this._view;
        }
        respond(t) {
          if (!Wr(this))
            throw $r("respond");
          if (he(t, 1, "respond"), t = Cr(t, "First parameter"), this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Pe(this._view.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          Wt(this._associatedReadableByteStreamController, t);
        }
        respondWithNewView(t) {
          if (!Wr(this))
            throw $r("respondWithNewView");
          if (he(t, 1, "respondWithNewView"), !ArrayBuffer.isView(t))
            throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Pe(t.buffer))
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          qt(this._associatedReadableByteStreamController, t);
        }
      }
      Object.defineProperties(Oe.prototype, {
        respond: { enumerable: !0 },
        respondWithNewView: { enumerable: !0 },
        view: { enumerable: !0 }
      }), d(Oe.prototype.respond, "respond"), d(Oe.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Oe.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBRequest",
        configurable: !0
      });
      class pe {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the current BYOB pull request, or `null` if there isn't one.
         */
        get byobRequest() {
          if (!ze(this))
            throw ut("byobRequest");
          return Fr(this);
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!ze(this))
            throw ut("desiredSize");
          return Hn(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!ze(this))
            throw ut("close");
          if (this._closeRequested)
            throw new TypeError("The stream has already been closed; do not close it again!");
          const t = this._controlledReadableByteStream._state;
          if (t !== "readable")
            throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be closed`);
          lt(this);
        }
        enqueue(t) {
          if (!ze(this))
            throw ut("enqueue");
          if (he(t, 1, "enqueue"), !ArrayBuffer.isView(t))
            throw new TypeError("chunk must be an array buffer view");
          if (t.byteLength === 0)
            throw new TypeError("chunk must have non-zero byteLength");
          if (t.buffer.byteLength === 0)
            throw new TypeError("chunk's buffer must have non-zero byteLength");
          if (this._closeRequested)
            throw new TypeError("stream is closed or draining");
          const r = this._controlledReadableByteStream._state;
          if (r !== "readable")
            throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);
          It(this, t);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(t = void 0) {
          if (!ze(this))
            throw ut("error");
          K(this, t);
        }
        /** @internal */
        [pr](t) {
          Fn(this), Ee(this);
          const r = this._cancelAlgorithm(t);
          return Bt(this), r;
        }
        /** @internal */
        [br](t) {
          const r = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            xn(this, t);
            return;
          }
          const i = this._autoAllocateChunkSize;
          if (i !== void 0) {
            let l;
            try {
              l = new ArrayBuffer(i);
            } catch (c) {
              t._errorSteps(c);
              return;
            }
            const f = {
              buffer: l,
              bufferByteLength: i,
              byteOffset: 0,
              byteLength: i,
              bytesFilled: 0,
              minimumFill: 1,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(f);
          }
          Cn(r, t), Fe(this);
        }
        /** @internal */
        [yr]() {
          if (this._pendingPullIntos.length > 0) {
            const t = this._pendingPullIntos.peek();
            t.readerType = "none", this._pendingPullIntos = new U(), this._pendingPullIntos.push(t);
          }
        }
      }
      Object.defineProperties(pe.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        byobRequest: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), d(pe.prototype.close, "close"), d(pe.prototype.enqueue, "enqueue"), d(pe.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, {
        value: "ReadableByteStreamController",
        configurable: !0
      });
      function ze(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableByteStream") ? !1 : e instanceof pe;
      }
      function Wr(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_associatedReadableByteStreamController") ? !1 : e instanceof Oe;
      }
      function Fe(e) {
        if (!pi(e))
          return;
        if (e._pulling) {
          e._pullAgain = !0;
          return;
        }
        e._pulling = !0;
        const r = e._pullAlgorithm();
        _(r, () => (e._pulling = !1, e._pullAgain && (e._pullAgain = !1, Fe(e)), null), (i) => (K(e, i), null));
      }
      function Fn(e) {
        Or(e), e._pendingPullIntos = new U();
      }
      function qr(e, t) {
        let r = !1;
        e._state === "closed" && (r = !0);
        const i = $n(t);
        t.readerType === "default" ? Pr(e, i, r) : wi(e, i, r);
      }
      function $n(e) {
        const t = e.bytesFilled, r = e.elementSize;
        return new e.viewConstructor(e.buffer, e.byteOffset, t / r);
      }
      function At(e, t, r, i) {
        e._queue.push({ buffer: t, byteOffset: r, byteLength: i }), e._queueTotalSize += i;
      }
      function Ln(e, t, r, i) {
        let l;
        try {
          l = Wn(t, r, r + i);
        } catch (f) {
          throw K(e, f), f;
        }
        At(e, l, 0, i);
      }
      function Dn(e, t) {
        t.bytesFilled > 0 && Ln(e, t.buffer, t.byteOffset, t.bytesFilled), He(e);
      }
      function jn(e, t) {
        const r = Math.min(e._queueTotalSize, t.byteLength - t.bytesFilled), i = t.bytesFilled + r;
        let l = r, f = !1;
        const c = i % t.elementSize, p = i - c;
        p >= t.minimumFill && (l = p - t.bytesFilled, f = !0);
        const C = e._queue;
        for (; l > 0; ) {
          const y = C.peek(), P = Math.min(l, y.byteLength), E = t.byteOffset + t.bytesFilled;
          In(t.buffer, E, y.buffer, y.byteOffset, P), y.byteLength === P ? C.shift() : (y.byteOffset += P, y.byteLength -= P), e._queueTotalSize -= P, Mn(e, P, t), l -= P;
        }
        return f;
      }
      function Mn(e, t, r) {
        r.bytesFilled += t;
      }
      function Un(e) {
        e._queueTotalSize === 0 && e._closeRequested ? (Bt(e), pt(e._controlledReadableByteStream)) : Fe(e);
      }
      function Or(e) {
        e._byobRequest !== null && (e._byobRequest._associatedReadableByteStreamController = void 0, e._byobRequest._view = null, e._byobRequest = null);
      }
      function zr(e) {
        for (; e._pendingPullIntos.length > 0; ) {
          if (e._queueTotalSize === 0)
            return;
          const t = e._pendingPullIntos.peek();
          jn(e, t) && (He(e), qr(e._controlledReadableByteStream, t));
        }
      }
      function ci(e) {
        const t = e._controlledReadableByteStream._reader;
        for (; t._readRequests.length > 0; ) {
          if (e._queueTotalSize === 0)
            return;
          const r = t._readRequests.shift();
          xn(e, r);
        }
      }
      function di(e, t, r, i) {
        const l = e._controlledReadableByteStream, f = t.constructor, c = fi(f), { byteOffset: p, byteLength: C } = t, y = r * c;
        let P;
        try {
          P = me(t.buffer);
        } catch (A) {
          i._errorSteps(A);
          return;
        }
        const E = {
          buffer: P,
          bufferByteLength: P.byteLength,
          byteOffset: p,
          byteLength: C,
          bytesFilled: 0,
          minimumFill: y,
          elementSize: c,
          viewConstructor: f,
          readerType: "byob"
        };
        if (e._pendingPullIntos.length > 0) {
          e._pendingPullIntos.push(E), Yn(l, i);
          return;
        }
        if (l._state === "closed") {
          const A = new f(E.buffer, E.byteOffset, 0);
          i._closeSteps(A);
          return;
        }
        if (e._queueTotalSize > 0) {
          if (jn(e, E)) {
            const A = $n(E);
            Un(e), i._chunkSteps(A);
            return;
          }
          if (e._closeRequested) {
            const A = new TypeError("Insufficient bytes to fill elements in the given buffer");
            K(e, A), i._errorSteps(A);
            return;
          }
        }
        e._pendingPullIntos.push(E), Yn(l, i), Fe(e);
      }
      function hi(e, t) {
        t.readerType === "none" && He(e);
        const r = e._controlledReadableByteStream;
        if (Lr(r))
          for (; Gn(r) > 0; ) {
            const i = He(e);
            qr(r, i);
          }
      }
      function mi(e, t, r) {
        if (Mn(e, t, r), r.readerType === "none") {
          Dn(e, r), zr(e);
          return;
        }
        if (r.bytesFilled < r.minimumFill)
          return;
        He(e);
        const i = r.bytesFilled % r.elementSize;
        if (i > 0) {
          const l = r.byteOffset + r.bytesFilled;
          Ln(e, r.buffer, l - i, i);
        }
        r.bytesFilled -= i, qr(e._controlledReadableByteStream, r), zr(e);
      }
      function Nn(e, t) {
        const r = e._pendingPullIntos.peek();
        Or(e), e._controlledReadableByteStream._state === "closed" ? hi(e, r) : mi(e, t, r), Fe(e);
      }
      function He(e) {
        return e._pendingPullIntos.shift();
      }
      function pi(e) {
        const t = e._controlledReadableByteStream;
        return t._state !== "readable" || e._closeRequested || !e._started ? !1 : !!(Tn(t) && Et(t) > 0 || Lr(t) && Gn(t) > 0 || Hn(e) > 0);
      }
      function Bt(e) {
        e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0;
      }
      function lt(e) {
        const t = e._controlledReadableByteStream;
        if (!(e._closeRequested || t._state !== "readable")) {
          if (e._queueTotalSize > 0) {
            e._closeRequested = !0;
            return;
          }
          if (e._pendingPullIntos.length > 0) {
            const r = e._pendingPullIntos.peek();
            if (r.bytesFilled % r.elementSize !== 0) {
              const i = new TypeError("Insufficient bytes to fill elements in the given buffer");
              throw K(e, i), i;
            }
          }
          Bt(e), pt(t);
        }
      }
      function It(e, t) {
        const r = e._controlledReadableByteStream;
        if (e._closeRequested || r._state !== "readable")
          return;
        const { buffer: i, byteOffset: l, byteLength: f } = t;
        if (Pe(i))
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const c = me(i);
        if (e._pendingPullIntos.length > 0) {
          const p = e._pendingPullIntos.peek();
          if (Pe(p.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          Or(e), p.buffer = me(p.buffer), p.readerType === "none" && Dn(e, p);
        }
        if (Tn(r))
          if (ci(e), Et(r) === 0)
            At(e, c, l, f);
          else {
            e._pendingPullIntos.length > 0 && He(e);
            const p = new Uint8Array(c, l, f);
            Pr(r, p, !1);
          }
        else Lr(r) ? (At(e, c, l, f), zr(e)) : At(e, c, l, f);
        Fe(e);
      }
      function K(e, t) {
        const r = e._controlledReadableByteStream;
        r._state === "readable" && (Fn(e), Ee(e), Bt(e), So(r, t));
      }
      function xn(e, t) {
        const r = e._queue.shift();
        e._queueTotalSize -= r.byteLength, Un(e);
        const i = new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
        t._chunkSteps(i);
      }
      function Fr(e) {
        if (e._byobRequest === null && e._pendingPullIntos.length > 0) {
          const t = e._pendingPullIntos.peek(), r = new Uint8Array(t.buffer, t.byteOffset + t.bytesFilled, t.byteLength - t.bytesFilled), i = Object.create(Oe.prototype);
          yi(i, e, r), e._byobRequest = i;
        }
        return e._byobRequest;
      }
      function Hn(e) {
        const t = e._controlledReadableByteStream._state;
        return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
      }
      function Wt(e, t) {
        const r = e._pendingPullIntos.peek();
        if (e._controlledReadableByteStream._state === "closed") {
          if (t !== 0)
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
        } else {
          if (t === 0)
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          if (r.bytesFilled + t > r.byteLength)
            throw new RangeError("bytesWritten out of range");
        }
        r.buffer = me(r.buffer), Nn(e, t);
      }
      function qt(e, t) {
        const r = e._pendingPullIntos.peek();
        if (e._controlledReadableByteStream._state === "closed") {
          if (t.byteLength !== 0)
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
        } else if (t.byteLength === 0)
          throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
        if (r.byteOffset + r.bytesFilled !== t.byteOffset)
          throw new RangeError("The region specified by view does not match byobRequest");
        if (r.bufferByteLength !== t.buffer.byteLength)
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        if (r.bytesFilled + t.byteLength > r.byteLength)
          throw new RangeError("The region specified by view is larger than byobRequest");
        const l = t.byteLength;
        r.buffer = me(t.buffer), Nn(e, l);
      }
      function Vn(e, t, r, i, l, f, c) {
        t._controlledReadableByteStream = e, t._pullAgain = !1, t._pulling = !1, t._byobRequest = null, t._queue = t._queueTotalSize = void 0, Ee(t), t._closeRequested = !1, t._started = !1, t._strategyHWM = f, t._pullAlgorithm = i, t._cancelAlgorithm = l, t._autoAllocateChunkSize = c, t._pendingPullIntos = new U(), e._readableStreamController = t;
        const p = r();
        _(g(p), () => (t._started = !0, Fe(t), null), (C) => (K(t, C), null));
      }
      function bi(e, t, r) {
        const i = Object.create(pe.prototype);
        let l, f, c;
        t.start !== void 0 ? l = () => t.start(i) : l = () => {
        }, t.pull !== void 0 ? f = () => t.pull(i) : f = () => g(void 0), t.cancel !== void 0 ? c = (C) => t.cancel(C) : c = () => g(void 0);
        const p = t.autoAllocateChunkSize;
        if (p === 0)
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        Vn(e, i, l, f, c, r, p);
      }
      function yi(e, t, r) {
        e._associatedReadableByteStreamController = t, e._view = r;
      }
      function $r(e) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`);
      }
      function ut(e) {
        return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`);
      }
      function gi(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.mode;
        return {
          mode: r === void 0 ? void 0 : _i(r, `${t} has member 'mode' that`)
        };
      }
      function _i(e, t) {
        if (e = `${e}`, e !== "byob")
          throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return e;
      }
      function Si(e, t) {
        var r;
        ae(e, t);
        const i = (r = e == null ? void 0 : e.min) !== null && r !== void 0 ? r : 1;
        return {
          min: Cr(i, `${t} has member 'min' that`)
        };
      }
      function Qn(e) {
        return new ve(e);
      }
      function Yn(e, t) {
        e._reader._readIntoRequests.push(t);
      }
      function wi(e, t, r) {
        const l = e._reader._readIntoRequests.shift();
        r ? l._closeSteps(t) : l._chunkSteps(t);
      }
      function Gn(e) {
        return e._reader._readIntoRequests.length;
      }
      function Lr(e) {
        const t = e._reader;
        return !(t === void 0 || !$e(t));
      }
      class ve {
        constructor(t) {
          if (he(t, 1, "ReadableStreamBYOBReader"), Tr(t, "First parameter"), Be(t))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!ze(t._readableStreamController))
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          yn(this, t), this._readIntoRequests = new U();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return $e(this) ? this._closedPromise : m(Ot("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(t = void 0) {
          return $e(this) ? this._ownerReadableStream === void 0 ? m(Pt("cancel")) : gr(this, t) : m(Ot("cancel"));
        }
        read(t, r = {}) {
          if (!$e(this))
            return m(Ot("read"));
          if (!ArrayBuffer.isView(t))
            return m(new TypeError("view must be an array buffer view"));
          if (t.byteLength === 0)
            return m(new TypeError("view must have non-zero byteLength"));
          if (t.buffer.byteLength === 0)
            return m(new TypeError("view's buffer must have non-zero byteLength"));
          if (Pe(t.buffer))
            return m(new TypeError("view's buffer has been detached"));
          let i;
          try {
            i = Si(r, "options");
          } catch (y) {
            return m(y);
          }
          const l = i.min;
          if (l === 0)
            return m(new TypeError("options.min must be greater than 0"));
          if (ui(t)) {
            if (l > t.byteLength)
              return m(new RangeError("options.min must be less than or equal to view's byteLength"));
          } else if (l > t.length)
            return m(new RangeError("options.min must be less than or equal to view's length"));
          if (this._ownerReadableStream === void 0)
            return m(Pt("read from"));
          let f, c;
          const p = w((y, P) => {
            f = y, c = P;
          });
          return Zn(this, t, l, {
            _chunkSteps: (y) => f({ value: y, done: !1 }),
            _closeSteps: (y) => f({ value: y, done: !0 }),
            _errorSteps: (y) => c(y)
          }), p;
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
          if (!$e(this))
            throw Ot("releaseLock");
          this._ownerReadableStream !== void 0 && Ri(this);
        }
      }
      Object.defineProperties(ve.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), d(ve.prototype.cancel, "cancel"), d(ve.prototype.read, "read"), d(ve.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ve.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBReader",
        configurable: !0
      });
      function $e(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readIntoRequests") ? !1 : e instanceof ve;
      }
      function Zn(e, t, r, i) {
        const l = e._ownerReadableStream;
        l._disturbed = !0, l._state === "errored" ? i._errorSteps(l._storedError) : di(l._readableStreamController, t, r, i);
      }
      function Ri(e) {
        de(e);
        const t = new TypeError("Reader was released");
        Jn(e, t);
      }
      function Jn(e, t) {
        const r = e._readIntoRequests;
        e._readIntoRequests = new U(), r.forEach((i) => {
          i._errorSteps(t);
        });
      }
      function Ot(e) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`);
      }
      function ft(e, t) {
        const { highWaterMark: r } = e;
        if (r === void 0)
          return t;
        if (Bn(r) || r < 0)
          throw new RangeError("Invalid highWaterMark");
        return r;
      }
      function zt(e) {
        const { size: t } = e;
        return t || (() => 1);
      }
      function Ft(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.highWaterMark, i = e == null ? void 0 : e.size;
        return {
          highWaterMark: r === void 0 ? void 0 : Rr(r),
          size: i === void 0 ? void 0 : Ci(i, `${t} has member 'size' that`)
        };
      }
      function Ci(e, t) {
        return J(e, t), (r) => Rr(e(r));
      }
      function Ti(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.abort, i = e == null ? void 0 : e.close, l = e == null ? void 0 : e.start, f = e == null ? void 0 : e.type, c = e == null ? void 0 : e.write;
        return {
          abort: r === void 0 ? void 0 : Pi(r, e, `${t} has member 'abort' that`),
          close: i === void 0 ? void 0 : Ei(i, e, `${t} has member 'close' that`),
          start: l === void 0 ? void 0 : vi(l, e, `${t} has member 'start' that`),
          write: c === void 0 ? void 0 : ki(c, e, `${t} has member 'write' that`),
          type: f
        };
      }
      function Pi(e, t, r) {
        return J(e, r), (i) => F(e, t, [i]);
      }
      function Ei(e, t, r) {
        return J(e, r), () => F(e, t, []);
      }
      function vi(e, t, r) {
        return J(e, r), (i) => W(e, t, [i]);
      }
      function ki(e, t, r) {
        return J(e, r), (i, l) => F(e, t, [i, l]);
      }
      function Kn(e, t) {
        if (!Ve(e))
          throw new TypeError(`${t} is not a WritableStream.`);
      }
      function Ai(e) {
        if (typeof e != "object" || e === null)
          return !1;
        try {
          return typeof e.aborted == "boolean";
        } catch {
          return !1;
        }
      }
      const Bi = typeof AbortController == "function";
      function Ii() {
        if (Bi)
          return new AbortController();
      }
      class ke {
        constructor(t = {}, r = {}) {
          t === void 0 ? t = null : wn(t, "First parameter");
          const i = Ft(r, "Second parameter"), l = Ti(t, "First parameter");
          if (eo(this), l.type !== void 0)
            throw new RangeError("Invalid type is specified");
          const c = zt(i), p = ft(i, 1);
          Hi(this, l, p, c);
        }
        /**
         * Returns whether or not the writable stream is locked to a writer.
         */
        get locked() {
          if (!Ve(this))
            throw Mt("locked");
          return Qe(this);
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
        abort(t = void 0) {
          return Ve(this) ? Qe(this) ? m(new TypeError("Cannot abort a stream that already has a writer")) : $t(this, t) : m(Mt("abort"));
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
          return Ve(this) ? Qe(this) ? m(new TypeError("Cannot close a stream that already has a writer")) : se(this) ? m(new TypeError("Cannot close an already-closing stream")) : to(this) : m(Mt("close"));
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
          if (!Ve(this))
            throw Mt("getWriter");
          return Xn(this);
        }
      }
      Object.defineProperties(ke.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        getWriter: { enumerable: !0 },
        locked: { enumerable: !0 }
      }), d(ke.prototype.abort, "abort"), d(ke.prototype.close, "close"), d(ke.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ke.prototype, Symbol.toStringTag, {
        value: "WritableStream",
        configurable: !0
      });
      function Xn(e) {
        return new be(e);
      }
      function Wi(e, t, r, i, l = 1, f = () => 1) {
        const c = Object.create(ke.prototype);
        eo(c);
        const p = Object.create(Ye.prototype);
        return so(c, p, e, t, r, i, l, f), c;
      }
      function eo(e) {
        e._state = "writable", e._storedError = void 0, e._writer = void 0, e._writableStreamController = void 0, e._writeRequests = new U(), e._inFlightWriteRequest = void 0, e._closeRequest = void 0, e._inFlightCloseRequest = void 0, e._pendingAbortRequest = void 0, e._backpressure = !1;
      }
      function Ve(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_writableStreamController") ? !1 : e instanceof ke;
      }
      function Qe(e) {
        return e._writer !== void 0;
      }
      function $t(e, t) {
        var r;
        if (e._state === "closed" || e._state === "errored")
          return g(void 0);
        e._writableStreamController._abortReason = t, (r = e._writableStreamController._abortController) === null || r === void 0 || r.abort(t);
        const i = e._state;
        if (i === "closed" || i === "errored")
          return g(void 0);
        if (e._pendingAbortRequest !== void 0)
          return e._pendingAbortRequest._promise;
        let l = !1;
        i === "erroring" && (l = !0, t = void 0);
        const f = w((c, p) => {
          e._pendingAbortRequest = {
            _promise: void 0,
            _resolve: c,
            _reject: p,
            _reason: t,
            _wasAlreadyErroring: l
          };
        });
        return e._pendingAbortRequest._promise = f, l || jr(e, t), f;
      }
      function to(e) {
        const t = e._state;
        if (t === "closed" || t === "errored")
          return m(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));
        const r = w((l, f) => {
          const c = {
            _resolve: l,
            _reject: f
          };
          e._closeRequest = c;
        }), i = e._writer;
        return i !== void 0 && e._backpressure && t === "writable" && Yr(i), Vi(e._writableStreamController), r;
      }
      function qi(e) {
        return w((r, i) => {
          const l = {
            _resolve: r,
            _reject: i
          };
          e._writeRequests.push(l);
        });
      }
      function Dr(e, t) {
        if (e._state === "writable") {
          jr(e, t);
          return;
        }
        Mr(e);
      }
      function jr(e, t) {
        const r = e._writableStreamController;
        e._state = "erroring", e._storedError = t;
        const i = e._writer;
        i !== void 0 && no(i, t), !Li(e) && r._started && Mr(e);
      }
      function Mr(e) {
        e._state = "errored", e._writableStreamController[bn]();
        const t = e._storedError;
        if (e._writeRequests.forEach((l) => {
          l._reject(t);
        }), e._writeRequests = new U(), e._pendingAbortRequest === void 0) {
          Lt(e);
          return;
        }
        const r = e._pendingAbortRequest;
        if (e._pendingAbortRequest = void 0, r._wasAlreadyErroring) {
          r._reject(t), Lt(e);
          return;
        }
        const i = e._writableStreamController[Tt](r._reason);
        _(i, () => (r._resolve(), Lt(e), null), (l) => (r._reject(l), Lt(e), null));
      }
      function Oi(e) {
        e._inFlightWriteRequest._resolve(void 0), e._inFlightWriteRequest = void 0;
      }
      function zi(e, t) {
        e._inFlightWriteRequest._reject(t), e._inFlightWriteRequest = void 0, Dr(e, t);
      }
      function Fi(e) {
        e._inFlightCloseRequest._resolve(void 0), e._inFlightCloseRequest = void 0, e._state === "erroring" && (e._storedError = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._resolve(), e._pendingAbortRequest = void 0)), e._state = "closed";
        const r = e._writer;
        r !== void 0 && co(r);
      }
      function $i(e, t) {
        e._inFlightCloseRequest._reject(t), e._inFlightCloseRequest = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._reject(t), e._pendingAbortRequest = void 0), Dr(e, t);
      }
      function se(e) {
        return !(e._closeRequest === void 0 && e._inFlightCloseRequest === void 0);
      }
      function Li(e) {
        return !(e._inFlightWriteRequest === void 0 && e._inFlightCloseRequest === void 0);
      }
      function Di(e) {
        e._inFlightCloseRequest = e._closeRequest, e._closeRequest = void 0;
      }
      function ji(e) {
        e._inFlightWriteRequest = e._writeRequests.shift();
      }
      function Lt(e) {
        e._closeRequest !== void 0 && (e._closeRequest._reject(e._storedError), e._closeRequest = void 0);
        const t = e._writer;
        t !== void 0 && Vr(t, e._storedError);
      }
      function Ur(e, t) {
        const r = e._writer;
        r !== void 0 && t !== e._backpressure && (t ? Xi(r) : Yr(r)), e._backpressure = t;
      }
      class be {
        constructor(t) {
          if (he(t, 1, "WritableStreamDefaultWriter"), Kn(t, "First parameter"), Qe(t))
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = t, t._writer = this;
          const r = t._state;
          if (r === "writable")
            !se(t) && t._backpressure ? Nt(this) : ho(this), Ut(this);
          else if (r === "erroring")
            Qr(this, t._storedError), Ut(this);
          else if (r === "closed")
            ho(this), Ji(this);
          else {
            const i = t._storedError;
            Qr(this, i), fo(this, i);
          }
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
         * the writer’s lock is released before the stream finishes closing.
         */
        get closed() {
          return Le(this) ? this._closedPromise : m(De("closed"));
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
          if (!Le(this))
            throw De("desiredSize");
          if (this._ownerWritableStream === void 0)
            throw dt("desiredSize");
          return xi(this);
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
          return Le(this) ? this._readyPromise : m(De("ready"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
         */
        abort(t = void 0) {
          return Le(this) ? this._ownerWritableStream === void 0 ? m(dt("abort")) : Mi(this, t) : m(De("abort"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!Le(this))
            return m(De("close"));
          const t = this._ownerWritableStream;
          return t === void 0 ? m(dt("close")) : se(t) ? m(new TypeError("Cannot close an already-closing stream")) : ro(this);
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
          if (!Le(this))
            throw De("releaseLock");
          this._ownerWritableStream !== void 0 && oo(this);
        }
        write(t = void 0) {
          return Le(this) ? this._ownerWritableStream === void 0 ? m(dt("write to")) : io(this, t) : m(De("write"));
        }
      }
      Object.defineProperties(be.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        write: { enumerable: !0 },
        closed: { enumerable: !0 },
        desiredSize: { enumerable: !0 },
        ready: { enumerable: !0 }
      }), d(be.prototype.abort, "abort"), d(be.prototype.close, "close"), d(be.prototype.releaseLock, "releaseLock"), d(be.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(be.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultWriter",
        configurable: !0
      });
      function Le(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_ownerWritableStream") ? !1 : e instanceof be;
      }
      function Mi(e, t) {
        const r = e._ownerWritableStream;
        return $t(r, t);
      }
      function ro(e) {
        const t = e._ownerWritableStream;
        return to(t);
      }
      function Ui(e) {
        const t = e._ownerWritableStream, r = t._state;
        return se(t) || r === "closed" ? g(void 0) : r === "errored" ? m(t._storedError) : ro(e);
      }
      function Ni(e, t) {
        e._closedPromiseState === "pending" ? Vr(e, t) : Ki(e, t);
      }
      function no(e, t) {
        e._readyPromiseState === "pending" ? mo(e, t) : ea(e, t);
      }
      function xi(e) {
        const t = e._ownerWritableStream, r = t._state;
        return r === "errored" || r === "erroring" ? null : r === "closed" ? 0 : lo(t._writableStreamController);
      }
      function oo(e) {
        const t = e._ownerWritableStream, r = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        no(e, r), Ni(e, r), t._writer = void 0, e._ownerWritableStream = void 0;
      }
      function io(e, t) {
        const r = e._ownerWritableStream, i = r._writableStreamController, l = Qi(i, t);
        if (r !== e._ownerWritableStream)
          return m(dt("write to"));
        const f = r._state;
        if (f === "errored")
          return m(r._storedError);
        if (se(r) || f === "closed")
          return m(new TypeError("The stream is closing or closed and cannot be written to"));
        if (f === "erroring")
          return m(r._storedError);
        const c = qi(r);
        return Yi(i, t, l), c;
      }
      const ao = {};
      class Ye {
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
          if (!Nr(this))
            throw Hr("abortReason");
          return this._abortReason;
        }
        /**
         * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
         */
        get signal() {
          if (!Nr(this))
            throw Hr("signal");
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
        error(t = void 0) {
          if (!Nr(this))
            throw Hr("error");
          this._controlledWritableStream._state === "writable" && uo(this, t);
        }
        /** @internal */
        [Tt](t) {
          const r = this._abortAlgorithm(t);
          return Dt(this), r;
        }
        /** @internal */
        [bn]() {
          Ee(this);
        }
      }
      Object.defineProperties(Ye.prototype, {
        abortReason: { enumerable: !0 },
        signal: { enumerable: !0 },
        error: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ye.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultController",
        configurable: !0
      });
      function Nr(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledWritableStream") ? !1 : e instanceof Ye;
      }
      function so(e, t, r, i, l, f, c, p) {
        t._controlledWritableStream = e, e._writableStreamController = t, t._queue = void 0, t._queueTotalSize = void 0, Ee(t), t._abortReason = void 0, t._abortController = Ii(), t._started = !1, t._strategySizeAlgorithm = p, t._strategyHWM = c, t._writeAlgorithm = i, t._closeAlgorithm = l, t._abortAlgorithm = f;
        const C = xr(t);
        Ur(e, C);
        const y = r(), P = g(y);
        _(P, () => (t._started = !0, jt(t), null), (E) => (t._started = !0, Dr(e, E), null));
      }
      function Hi(e, t, r, i) {
        const l = Object.create(Ye.prototype);
        let f, c, p, C;
        t.start !== void 0 ? f = () => t.start(l) : f = () => {
        }, t.write !== void 0 ? c = (y) => t.write(y, l) : c = () => g(void 0), t.close !== void 0 ? p = () => t.close() : p = () => g(void 0), t.abort !== void 0 ? C = (y) => t.abort(y) : C = () => g(void 0), so(e, l, f, c, p, C, r, i);
      }
      function Dt(e) {
        e._writeAlgorithm = void 0, e._closeAlgorithm = void 0, e._abortAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
      }
      function Vi(e) {
        Ir(e, ao, 0), jt(e);
      }
      function Qi(e, t) {
        try {
          return e._strategySizeAlgorithm(t);
        } catch (r) {
          return ct(e, r), 1;
        }
      }
      function lo(e) {
        return e._strategyHWM - e._queueTotalSize;
      }
      function Yi(e, t, r) {
        try {
          Ir(e, t, r);
        } catch (l) {
          ct(e, l);
          return;
        }
        const i = e._controlledWritableStream;
        if (!se(i) && i._state === "writable") {
          const l = xr(e);
          Ur(i, l);
        }
        jt(e);
      }
      function jt(e) {
        const t = e._controlledWritableStream;
        if (!e._started || t._inFlightWriteRequest !== void 0)
          return;
        if (t._state === "erroring") {
          Mr(t);
          return;
        }
        if (e._queue.length === 0)
          return;
        const i = li(e);
        i === ao ? Gi(e) : Zi(e, i);
      }
      function ct(e, t) {
        e._controlledWritableStream._state === "writable" && uo(e, t);
      }
      function Gi(e) {
        const t = e._controlledWritableStream;
        Di(t), Br(e);
        const r = e._closeAlgorithm();
        Dt(e), _(r, () => (Fi(t), null), (i) => ($i(t, i), null));
      }
      function Zi(e, t) {
        const r = e._controlledWritableStream;
        ji(r);
        const i = e._writeAlgorithm(t);
        _(i, () => {
          Oi(r);
          const l = r._state;
          if (Br(e), !se(r) && l === "writable") {
            const f = xr(e);
            Ur(r, f);
          }
          return jt(e), null;
        }, (l) => (r._state === "writable" && Dt(e), zi(r, l), null));
      }
      function xr(e) {
        return lo(e) <= 0;
      }
      function uo(e, t) {
        const r = e._controlledWritableStream;
        Dt(e), jr(r, t);
      }
      function Mt(e) {
        return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`);
      }
      function Hr(e) {
        return new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`);
      }
      function De(e) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`);
      }
      function dt(e) {
        return new TypeError("Cannot " + e + " a stream using a released writer");
      }
      function Ut(e) {
        e._closedPromise = w((t, r) => {
          e._closedPromise_resolve = t, e._closedPromise_reject = r, e._closedPromiseState = "pending";
        });
      }
      function fo(e, t) {
        Ut(e), Vr(e, t);
      }
      function Ji(e) {
        Ut(e), co(e);
      }
      function Vr(e, t) {
        e._closedPromise_reject !== void 0 && (Y(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "rejected");
      }
      function Ki(e, t) {
        fo(e, t);
      }
      function co(e) {
        e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "resolved");
      }
      function Nt(e) {
        e._readyPromise = w((t, r) => {
          e._readyPromise_resolve = t, e._readyPromise_reject = r;
        }), e._readyPromiseState = "pending";
      }
      function Qr(e, t) {
        Nt(e), mo(e, t);
      }
      function ho(e) {
        Nt(e), Yr(e);
      }
      function mo(e, t) {
        e._readyPromise_reject !== void 0 && (Y(e._readyPromise), e._readyPromise_reject(t), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "rejected");
      }
      function Xi(e) {
        Nt(e);
      }
      function ea(e, t) {
        Qr(e, t);
      }
      function Yr(e) {
        e._readyPromise_resolve !== void 0 && (e._readyPromise_resolve(void 0), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "fulfilled");
      }
      function ta() {
        if (typeof globalThis < "u")
          return globalThis;
        if (typeof self < "u")
          return self;
        if (typeof rn < "u")
          return rn;
      }
      const Gr = ta();
      function ra(e) {
        if (!(typeof e == "function" || typeof e == "object") || e.name !== "DOMException")
          return !1;
        try {
          return new e(), !0;
        } catch {
          return !1;
        }
      }
      function na() {
        const e = Gr == null ? void 0 : Gr.DOMException;
        return ra(e) ? e : void 0;
      }
      function oa() {
        const e = function(r, i) {
          this.message = r || "", this.name = i || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        };
        return d(e, "DOMException"), e.prototype = Object.create(Error.prototype), Object.defineProperty(e.prototype, "constructor", { value: e, writable: !0, configurable: !0 }), e;
      }
      const ia = na() || oa();
      function po(e, t, r, i, l, f) {
        const c = xe(e), p = Xn(t);
        e._disturbed = !0;
        let C = !1, y = g(void 0);
        return w((P, E) => {
          let A;
          if (f !== void 0) {
            if (A = () => {
              const R = f.reason !== void 0 ? f.reason : new ia("Aborted", "AbortError"), v = [];
              i || v.push(() => t._state === "writable" ? $t(t, R) : g(void 0)), l || v.push(() => e._state === "readable" ? re(e, R) : g(void 0)), H(() => Promise.all(v.map((I) => I())), !0, R);
            }, f.aborted) {
              A();
              return;
            }
            f.addEventListener("abort", A);
          }
          function ne() {
            return w((R, v) => {
              function I(G) {
                G ? R() : k(Ke(), I, v);
              }
              I(!1);
            });
          }
          function Ke() {
            return C ? g(!0) : k(p._readyPromise, () => w((R, v) => {
              at(c, {
                _chunkSteps: (I) => {
                  y = k(io(p, I), void 0, s), R(!1);
                },
                _closeSteps: () => R(!0),
                _errorSteps: v
              });
            }));
          }
          if (ge(e, c._closedPromise, (R) => (i ? X(!0, R) : H(() => $t(t, R), !0, R), null)), ge(t, p._closedPromise, (R) => (l ? X(!0, R) : H(() => re(e, R), !0, R), null)), N(e, c._closedPromise, () => (r ? X() : H(() => Ui(p)), null)), se(t) || t._state === "closed") {
            const R = new TypeError("the destination writable stream closed before all data could be piped to it");
            l ? X(!0, R) : H(() => re(e, R), !0, R);
          }
          Y(ne());
          function We() {
            const R = y;
            return k(y, () => R !== y ? We() : void 0);
          }
          function ge(R, v, I) {
            R._state === "errored" ? I(R._storedError) : q(v, I);
          }
          function N(R, v, I) {
            R._state === "closed" ? I() : Q(v, I);
          }
          function H(R, v, I) {
            if (C)
              return;
            C = !0, t._state === "writable" && !se(t) ? Q(We(), G) : G();
            function G() {
              return _(R(), () => _e(v, I), (Xe) => _e(!0, Xe)), null;
            }
          }
          function X(R, v) {
            C || (C = !0, t._state === "writable" && !se(t) ? Q(We(), () => _e(R, v)) : _e(R, v));
          }
          function _e(R, v) {
            return oo(p), de(c), f !== void 0 && f.removeEventListener("abort", A), R ? E(v) : P(void 0), null;
          }
        });
      }
      class ye {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
         * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
         */
        get desiredSize() {
          if (!xt(this))
            throw Vt("desiredSize");
          return Zr(this);
        }
        /**
         * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
         * the stream, but once those are read, the stream will become closed.
         */
        close() {
          if (!xt(this))
            throw Vt("close");
          if (!Ze(this))
            throw new TypeError("The stream is not in a state that permits close");
          je(this);
        }
        enqueue(t = void 0) {
          if (!xt(this))
            throw Vt("enqueue");
          if (!Ze(this))
            throw new TypeError("The stream is not in a state that permits enqueue");
          return Ge(this, t);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(t = void 0) {
          if (!xt(this))
            throw Vt("error");
          te(this, t);
        }
        /** @internal */
        [pr](t) {
          Ee(this);
          const r = this._cancelAlgorithm(t);
          return Ht(this), r;
        }
        /** @internal */
        [br](t) {
          const r = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const i = Br(this);
            this._closeRequested && this._queue.length === 0 ? (Ht(this), pt(r)) : ht(this), t._chunkSteps(i);
          } else
            Cn(r, t), ht(this);
        }
        /** @internal */
        [yr]() {
        }
      }
      Object.defineProperties(ye.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), d(ye.prototype.close, "close"), d(ye.prototype.enqueue, "enqueue"), d(ye.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ye.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultController",
        configurable: !0
      });
      function xt(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableStream") ? !1 : e instanceof ye;
      }
      function ht(e) {
        if (!bo(e))
          return;
        if (e._pulling) {
          e._pullAgain = !0;
          return;
        }
        e._pulling = !0;
        const r = e._pullAlgorithm();
        _(r, () => (e._pulling = !1, e._pullAgain && (e._pullAgain = !1, ht(e)), null), (i) => (te(e, i), null));
      }
      function bo(e) {
        const t = e._controlledReadableStream;
        return !Ze(e) || !e._started ? !1 : !!(Be(t) && Et(t) > 0 || Zr(e) > 0);
      }
      function Ht(e) {
        e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
      }
      function je(e) {
        if (!Ze(e))
          return;
        const t = e._controlledReadableStream;
        e._closeRequested = !0, e._queue.length === 0 && (Ht(e), pt(t));
      }
      function Ge(e, t) {
        if (!Ze(e))
          return;
        const r = e._controlledReadableStream;
        if (Be(r) && Et(r) > 0)
          Pr(r, t, !1);
        else {
          let i;
          try {
            i = e._strategySizeAlgorithm(t);
          } catch (l) {
            throw te(e, l), l;
          }
          try {
            Ir(e, t, i);
          } catch (l) {
            throw te(e, l), l;
          }
        }
        ht(e);
      }
      function te(e, t) {
        const r = e._controlledReadableStream;
        r._state === "readable" && (Ee(e), Ht(e), So(r, t));
      }
      function Zr(e) {
        const t = e._controlledReadableStream._state;
        return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
      }
      function aa(e) {
        return !bo(e);
      }
      function Ze(e) {
        const t = e._controlledReadableStream._state;
        return !e._closeRequested && t === "readable";
      }
      function yo(e, t, r, i, l, f, c) {
        t._controlledReadableStream = e, t._queue = void 0, t._queueTotalSize = void 0, Ee(t), t._started = !1, t._closeRequested = !1, t._pullAgain = !1, t._pulling = !1, t._strategySizeAlgorithm = c, t._strategyHWM = f, t._pullAlgorithm = i, t._cancelAlgorithm = l, e._readableStreamController = t;
        const p = r();
        _(g(p), () => (t._started = !0, ht(t), null), (C) => (te(t, C), null));
      }
      function sa(e, t, r, i) {
        const l = Object.create(ye.prototype);
        let f, c, p;
        t.start !== void 0 ? f = () => t.start(l) : f = () => {
        }, t.pull !== void 0 ? c = () => t.pull(l) : c = () => g(void 0), t.cancel !== void 0 ? p = (C) => t.cancel(C) : p = () => g(void 0), yo(e, l, f, c, p, r, i);
      }
      function Vt(e) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`);
      }
      function la(e, t) {
        return ze(e._readableStreamController) ? fa(e) : ua(e);
      }
      function ua(e, t) {
        const r = xe(e);
        let i = !1, l = !1, f = !1, c = !1, p, C, y, P, E;
        const A = w((N) => {
          E = N;
        });
        function ne() {
          return i ? (l = !0, g(void 0)) : (i = !0, at(r, {
            _chunkSteps: (H) => {
              ce(() => {
                l = !1;
                const X = H, _e = H;
                f || Ge(y._readableStreamController, X), c || Ge(P._readableStreamController, _e), i = !1, l && ne();
              });
            },
            _closeSteps: () => {
              i = !1, f || je(y._readableStreamController), c || je(P._readableStreamController), (!f || !c) && E(void 0);
            },
            _errorSteps: () => {
              i = !1;
            }
          }), g(void 0));
        }
        function Ke(N) {
          if (f = !0, p = N, c) {
            const H = st([p, C]), X = re(e, H);
            E(X);
          }
          return A;
        }
        function We(N) {
          if (c = !0, C = N, f) {
            const H = st([p, C]), X = re(e, H);
            E(X);
          }
          return A;
        }
        function ge() {
        }
        return y = mt(ge, ne, Ke), P = mt(ge, ne, We), q(r._closedPromise, (N) => (te(y._readableStreamController, N), te(P._readableStreamController, N), (!f || !c) && E(void 0), null)), [y, P];
      }
      function fa(e) {
        let t = xe(e), r = !1, i = !1, l = !1, f = !1, c = !1, p, C, y, P, E;
        const A = w((R) => {
          E = R;
        });
        function ne(R) {
          q(R._closedPromise, (v) => (R !== t || (K(y._readableStreamController, v), K(P._readableStreamController, v), (!f || !c) && E(void 0)), null));
        }
        function Ke() {
          $e(t) && (de(t), t = xe(e), ne(t)), at(t, {
            _chunkSteps: (v) => {
              ce(() => {
                i = !1, l = !1;
                const I = v;
                let G = v;
                if (!f && !c)
                  try {
                    G = On(v);
                  } catch (Xe) {
                    K(y._readableStreamController, Xe), K(P._readableStreamController, Xe), E(re(e, Xe));
                    return;
                  }
                f || It(y._readableStreamController, I), c || It(P._readableStreamController, G), r = !1, i ? ge() : l && N();
              });
            },
            _closeSteps: () => {
              r = !1, f || lt(y._readableStreamController), c || lt(P._readableStreamController), y._readableStreamController._pendingPullIntos.length > 0 && Wt(y._readableStreamController, 0), P._readableStreamController._pendingPullIntos.length > 0 && Wt(P._readableStreamController, 0), (!f || !c) && E(void 0);
            },
            _errorSteps: () => {
              r = !1;
            }
          });
        }
        function We(R, v) {
          Te(t) && (de(t), t = Qn(e), ne(t));
          const I = v ? P : y, G = v ? y : P;
          Zn(t, R, 1, {
            _chunkSteps: (et) => {
              ce(() => {
                i = !1, l = !1;
                const tt = v ? c : f;
                if (v ? f : c)
                  tt || qt(I._readableStreamController, et);
                else {
                  let qo;
                  try {
                    qo = On(et);
                  } catch (tn) {
                    K(I._readableStreamController, tn), K(G._readableStreamController, tn), E(re(e, tn));
                    return;
                  }
                  tt || qt(I._readableStreamController, et), It(G._readableStreamController, qo);
                }
                r = !1, i ? ge() : l && N();
              });
            },
            _closeSteps: (et) => {
              r = !1;
              const tt = v ? c : f, er = v ? f : c;
              tt || lt(I._readableStreamController), er || lt(G._readableStreamController), et !== void 0 && (tt || qt(I._readableStreamController, et), !er && G._readableStreamController._pendingPullIntos.length > 0 && Wt(G._readableStreamController, 0)), (!tt || !er) && E(void 0);
            },
            _errorSteps: () => {
              r = !1;
            }
          });
        }
        function ge() {
          if (r)
            return i = !0, g(void 0);
          r = !0;
          const R = Fr(y._readableStreamController);
          return R === null ? Ke() : We(R._view, !1), g(void 0);
        }
        function N() {
          if (r)
            return l = !0, g(void 0);
          r = !0;
          const R = Fr(P._readableStreamController);
          return R === null ? Ke() : We(R._view, !0), g(void 0);
        }
        function H(R) {
          if (f = !0, p = R, c) {
            const v = st([p, C]), I = re(e, v);
            E(I);
          }
          return A;
        }
        function X(R) {
          if (c = !0, C = R, f) {
            const v = st([p, C]), I = re(e, v);
            E(I);
          }
          return A;
        }
        function _e() {
        }
        return y = _o(_e, ge, H), P = _o(_e, N, X), ne(t), [y, P];
      }
      function ca(e) {
        return u(e) && typeof e.getReader < "u";
      }
      function da(e) {
        return ca(e) ? ma(e.getReader()) : ha(e);
      }
      function ha(e) {
        let t;
        const r = qn(e, "async"), i = s;
        function l() {
          let c;
          try {
            c = oi(r);
          } catch (C) {
            return m(C);
          }
          const p = g(c);
          return z(p, (C) => {
            if (!u(C))
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (ii(C))
              je(t._readableStreamController);
            else {
              const P = ai(C);
              Ge(t._readableStreamController, P);
            }
          });
        }
        function f(c) {
          const p = r.iterator;
          let C;
          try {
            C = kt(p, "return");
          } catch (E) {
            return m(E);
          }
          if (C === void 0)
            return g(void 0);
          let y;
          try {
            y = W(C, p, [c]);
          } catch (E) {
            return m(E);
          }
          const P = g(y);
          return z(P, (E) => {
            if (!u(E))
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
          });
        }
        return t = mt(i, l, f, 0), t;
      }
      function ma(e) {
        let t;
        const r = s;
        function i() {
          let f;
          try {
            f = e.read();
          } catch (c) {
            return m(c);
          }
          return z(f, (c) => {
            if (!u(c))
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            if (c.done)
              je(t._readableStreamController);
            else {
              const p = c.value;
              Ge(t._readableStreamController, p);
            }
          });
        }
        function l(f) {
          try {
            return g(e.cancel(f));
          } catch (c) {
            return m(c);
          }
        }
        return t = mt(r, i, l, 0), t;
      }
      function pa(e, t) {
        ae(e, t);
        const r = e, i = r == null ? void 0 : r.autoAllocateChunkSize, l = r == null ? void 0 : r.cancel, f = r == null ? void 0 : r.pull, c = r == null ? void 0 : r.start, p = r == null ? void 0 : r.type;
        return {
          autoAllocateChunkSize: i === void 0 ? void 0 : Cr(i, `${t} has member 'autoAllocateChunkSize' that`),
          cancel: l === void 0 ? void 0 : ba(l, r, `${t} has member 'cancel' that`),
          pull: f === void 0 ? void 0 : ya(f, r, `${t} has member 'pull' that`),
          start: c === void 0 ? void 0 : ga(c, r, `${t} has member 'start' that`),
          type: p === void 0 ? void 0 : _a(p, `${t} has member 'type' that`)
        };
      }
      function ba(e, t, r) {
        return J(e, r), (i) => F(e, t, [i]);
      }
      function ya(e, t, r) {
        return J(e, r), (i) => F(e, t, [i]);
      }
      function ga(e, t, r) {
        return J(e, r), (i) => W(e, t, [i]);
      }
      function _a(e, t) {
        if (e = `${e}`, e !== "bytes")
          throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);
        return e;
      }
      function Sa(e, t) {
        return ae(e, t), { preventCancel: !!(e == null ? void 0 : e.preventCancel) };
      }
      function go(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.preventAbort, i = e == null ? void 0 : e.preventCancel, l = e == null ? void 0 : e.preventClose, f = e == null ? void 0 : e.signal;
        return f !== void 0 && wa(f, `${t} has member 'signal' that`), {
          preventAbort: !!r,
          preventCancel: !!i,
          preventClose: !!l,
          signal: f
        };
      }
      function wa(e, t) {
        if (!Ai(e))
          throw new TypeError(`${t} is not an AbortSignal.`);
      }
      function Ra(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.readable;
        wr(r, "readable", "ReadableWritablePair"), Tr(r, `${t} has member 'readable' that`);
        const i = e == null ? void 0 : e.writable;
        return wr(i, "writable", "ReadableWritablePair"), Kn(i, `${t} has member 'writable' that`), { readable: r, writable: i };
      }
      class D {
        constructor(t = {}, r = {}) {
          t === void 0 ? t = null : wn(t, "First parameter");
          const i = Ft(r, "Second parameter"), l = pa(t, "First parameter");
          if (Jr(this), l.type === "bytes") {
            if (i.size !== void 0)
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            const f = ft(i, 0);
            bi(this, l, f);
          } else {
            const f = zt(i), c = ft(i, 1);
            sa(this, l, c, f);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!Ae(this))
            throw Me("locked");
          return Be(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(t = void 0) {
          return Ae(this) ? Be(this) ? m(new TypeError("Cannot cancel a stream that already has a reader")) : re(this, t) : m(Me("cancel"));
        }
        getReader(t = void 0) {
          if (!Ae(this))
            throw Me("getReader");
          return gi(t, "First parameter").mode === void 0 ? xe(this) : Qn(this);
        }
        pipeThrough(t, r = {}) {
          if (!Ae(this))
            throw Me("pipeThrough");
          he(t, 1, "pipeThrough");
          const i = Ra(t, "First parameter"), l = go(r, "Second parameter");
          if (Be(this))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (Qe(i.writable))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const f = po(this, i.writable, l.preventClose, l.preventAbort, l.preventCancel, l.signal);
          return Y(f), i.readable;
        }
        pipeTo(t, r = {}) {
          if (!Ae(this))
            return m(Me("pipeTo"));
          if (t === void 0)
            return m("Parameter 1 is required in 'pipeTo'.");
          if (!Ve(t))
            return m(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let i;
          try {
            i = go(r, "Second parameter");
          } catch (l) {
            return m(l);
          }
          return Be(this) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Qe(t) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : po(this, t, i.preventClose, i.preventAbort, i.preventCancel, i.signal);
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
          if (!Ae(this))
            throw Me("tee");
          const t = la(this);
          return st(t);
        }
        values(t = void 0) {
          if (!Ae(this))
            throw Me("values");
          const r = Sa(t, "First parameter");
          return ri(this, r.preventCancel);
        }
        [Ar](t) {
          return this.values(t);
        }
        /**
         * Creates a new ReadableStream wrapping the provided iterable or async iterable.
         *
         * This can be used to adapt various kinds of objects into a readable stream,
         * such as an array, an async generator, or a Node.js readable stream.
         */
        static from(t) {
          return da(t);
        }
      }
      Object.defineProperties(D, {
        from: { enumerable: !0 }
      }), Object.defineProperties(D.prototype, {
        cancel: { enumerable: !0 },
        getReader: { enumerable: !0 },
        pipeThrough: { enumerable: !0 },
        pipeTo: { enumerable: !0 },
        tee: { enumerable: !0 },
        values: { enumerable: !0 },
        locked: { enumerable: !0 }
      }), d(D.from, "from"), d(D.prototype.cancel, "cancel"), d(D.prototype.getReader, "getReader"), d(D.prototype.pipeThrough, "pipeThrough"), d(D.prototype.pipeTo, "pipeTo"), d(D.prototype.tee, "tee"), d(D.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(D.prototype, Symbol.toStringTag, {
        value: "ReadableStream",
        configurable: !0
      }), Object.defineProperty(D.prototype, Ar, {
        value: D.prototype.values,
        writable: !0,
        configurable: !0
      });
      function mt(e, t, r, i = 1, l = () => 1) {
        const f = Object.create(D.prototype);
        Jr(f);
        const c = Object.create(ye.prototype);
        return yo(f, c, e, t, r, i, l), f;
      }
      function _o(e, t, r) {
        const i = Object.create(D.prototype);
        Jr(i);
        const l = Object.create(pe.prototype);
        return Vn(i, l, e, t, r, 0, void 0), i;
      }
      function Jr(e) {
        e._state = "readable", e._reader = void 0, e._storedError = void 0, e._disturbed = !1;
      }
      function Ae(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readableStreamController") ? !1 : e instanceof D;
      }
      function Be(e) {
        return e._reader !== void 0;
      }
      function re(e, t) {
        if (e._disturbed = !0, e._state === "closed")
          return g(void 0);
        if (e._state === "errored")
          return m(e._storedError);
        pt(e);
        const r = e._reader;
        if (r !== void 0 && $e(r)) {
          const l = r._readIntoRequests;
          r._readIntoRequests = new U(), l.forEach((f) => {
            f._closeSteps(void 0);
          });
        }
        const i = e._readableStreamController[pr](t);
        return z(i, s);
      }
      function pt(e) {
        e._state = "closed";
        const t = e._reader;
        if (t !== void 0 && (_n(t), Te(t))) {
          const r = t._readRequests;
          t._readRequests = new U(), r.forEach((i) => {
            i._closeSteps();
          });
        }
      }
      function So(e, t) {
        e._state = "errored", e._storedError = t;
        const r = e._reader;
        r !== void 0 && (Sr(r, t), Te(r) ? Pn(r, t) : Jn(r, t));
      }
      function Me(e) {
        return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`);
      }
      function wo(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.highWaterMark;
        return wr(r, "highWaterMark", "QueuingStrategyInit"), {
          highWaterMark: Rr(r)
        };
      }
      const Ro = (e) => e.byteLength;
      d(Ro, "size");
      class Qt {
        constructor(t) {
          he(t, 1, "ByteLengthQueuingStrategy"), t = wo(t, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!To(this))
            throw Co("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!To(this))
            throw Co("size");
          return Ro;
        }
      }
      Object.defineProperties(Qt.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Qt.prototype, Symbol.toStringTag, {
        value: "ByteLengthQueuingStrategy",
        configurable: !0
      });
      function Co(e) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`);
      }
      function To(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_byteLengthQueuingStrategyHighWaterMark") ? !1 : e instanceof Qt;
      }
      const Po = () => 1;
      d(Po, "size");
      class Yt {
        constructor(t) {
          he(t, 1, "CountQueuingStrategy"), t = wo(t, "First parameter"), this._countQueuingStrategyHighWaterMark = t.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!vo(this))
            throw Eo("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!vo(this))
            throw Eo("size");
          return Po;
        }
      }
      Object.defineProperties(Yt.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Yt.prototype, Symbol.toStringTag, {
        value: "CountQueuingStrategy",
        configurable: !0
      });
      function Eo(e) {
        return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`);
      }
      function vo(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_countQueuingStrategyHighWaterMark") ? !1 : e instanceof Yt;
      }
      function Ca(e, t) {
        ae(e, t);
        const r = e == null ? void 0 : e.cancel, i = e == null ? void 0 : e.flush, l = e == null ? void 0 : e.readableType, f = e == null ? void 0 : e.start, c = e == null ? void 0 : e.transform, p = e == null ? void 0 : e.writableType;
        return {
          cancel: r === void 0 ? void 0 : va(r, e, `${t} has member 'cancel' that`),
          flush: i === void 0 ? void 0 : Ta(i, e, `${t} has member 'flush' that`),
          readableType: l,
          start: f === void 0 ? void 0 : Pa(f, e, `${t} has member 'start' that`),
          transform: c === void 0 ? void 0 : Ea(c, e, `${t} has member 'transform' that`),
          writableType: p
        };
      }
      function Ta(e, t, r) {
        return J(e, r), (i) => F(e, t, [i]);
      }
      function Pa(e, t, r) {
        return J(e, r), (i) => W(e, t, [i]);
      }
      function Ea(e, t, r) {
        return J(e, r), (i, l) => F(e, t, [i, l]);
      }
      function va(e, t, r) {
        return J(e, r), (i) => F(e, t, [i]);
      }
      class Gt {
        constructor(t = {}, r = {}, i = {}) {
          t === void 0 && (t = null);
          const l = Ft(r, "Second parameter"), f = Ft(i, "Third parameter"), c = Ca(t, "First parameter");
          if (c.readableType !== void 0)
            throw new RangeError("Invalid readableType specified");
          if (c.writableType !== void 0)
            throw new RangeError("Invalid writableType specified");
          const p = ft(f, 0), C = zt(f), y = ft(l, 1), P = zt(l);
          let E;
          const A = w((ne) => {
            E = ne;
          });
          ka(this, A, y, P, p, C), Ba(this, c), c.start !== void 0 ? E(c.start(this._transformStreamController)) : E(void 0);
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!ko(this))
            throw Wo("readable");
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!ko(this))
            throw Wo("writable");
          return this._writable;
        }
      }
      Object.defineProperties(Gt.prototype, {
        readable: { enumerable: !0 },
        writable: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Gt.prototype, Symbol.toStringTag, {
        value: "TransformStream",
        configurable: !0
      });
      function ka(e, t, r, i, l, f) {
        function c() {
          return t;
        }
        function p(A) {
          return qa(e, A);
        }
        function C(A) {
          return Oa(e, A);
        }
        function y() {
          return za(e);
        }
        e._writable = Wi(c, p, y, C, r, i);
        function P() {
          return Fa(e);
        }
        function E(A) {
          return $a(e, A);
        }
        e._readable = mt(c, P, E, l, f), e._backpressure = void 0, e._backpressureChangePromise = void 0, e._backpressureChangePromise_resolve = void 0, Zt(e, !0), e._transformStreamController = void 0;
      }
      function ko(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_transformStreamController") ? !1 : e instanceof Gt;
      }
      function Ao(e, t) {
        te(e._readable._readableStreamController, t), Kr(e, t);
      }
      function Kr(e, t) {
        Kt(e._transformStreamController), ct(e._writable._writableStreamController, t), Xr(e);
      }
      function Xr(e) {
        e._backpressure && Zt(e, !1);
      }
      function Zt(e, t) {
        e._backpressureChangePromise !== void 0 && e._backpressureChangePromise_resolve(), e._backpressureChangePromise = w((r) => {
          e._backpressureChangePromise_resolve = r;
        }), e._backpressure = t;
      }
      class Ie {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
         */
        get desiredSize() {
          if (!Jt(this))
            throw Xt("desiredSize");
          const t = this._controlledTransformStream._readable._readableStreamController;
          return Zr(t);
        }
        enqueue(t = void 0) {
          if (!Jt(this))
            throw Xt("enqueue");
          Bo(this, t);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(t = void 0) {
          if (!Jt(this))
            throw Xt("error");
          Ia(this, t);
        }
        /**
         * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
         * transformer only needs to consume a portion of the chunks written to the writable side.
         */
        terminate() {
          if (!Jt(this))
            throw Xt("terminate");
          Wa(this);
        }
      }
      Object.defineProperties(Ie.prototype, {
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        terminate: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), d(Ie.prototype.enqueue, "enqueue"), d(Ie.prototype.error, "error"), d(Ie.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ie.prototype, Symbol.toStringTag, {
        value: "TransformStreamDefaultController",
        configurable: !0
      });
      function Jt(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledTransformStream") ? !1 : e instanceof Ie;
      }
      function Aa(e, t, r, i, l) {
        t._controlledTransformStream = e, e._transformStreamController = t, t._transformAlgorithm = r, t._flushAlgorithm = i, t._cancelAlgorithm = l, t._finishPromise = void 0, t._finishPromise_resolve = void 0, t._finishPromise_reject = void 0;
      }
      function Ba(e, t) {
        const r = Object.create(Ie.prototype);
        let i, l, f;
        t.transform !== void 0 ? i = (c) => t.transform(c, r) : i = (c) => {
          try {
            return Bo(r, c), g(void 0);
          } catch (p) {
            return m(p);
          }
        }, t.flush !== void 0 ? l = () => t.flush(r) : l = () => g(void 0), t.cancel !== void 0 ? f = (c) => t.cancel(c) : f = () => g(void 0), Aa(e, r, i, l, f);
      }
      function Kt(e) {
        e._transformAlgorithm = void 0, e._flushAlgorithm = void 0, e._cancelAlgorithm = void 0;
      }
      function Bo(e, t) {
        const r = e._controlledTransformStream, i = r._readable._readableStreamController;
        if (!Ze(i))
          throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          Ge(i, t);
        } catch (f) {
          throw Kr(r, f), r._readable._storedError;
        }
        aa(i) !== r._backpressure && Zt(r, !0);
      }
      function Ia(e, t) {
        Ao(e._controlledTransformStream, t);
      }
      function Io(e, t) {
        const r = e._transformAlgorithm(t);
        return z(r, void 0, (i) => {
          throw Ao(e._controlledTransformStream, i), i;
        });
      }
      function Wa(e) {
        const t = e._controlledTransformStream, r = t._readable._readableStreamController;
        je(r);
        const i = new TypeError("TransformStream terminated");
        Kr(t, i);
      }
      function qa(e, t) {
        const r = e._transformStreamController;
        if (e._backpressure) {
          const i = e._backpressureChangePromise;
          return z(i, () => {
            const l = e._writable;
            if (l._state === "erroring")
              throw l._storedError;
            return Io(r, t);
          });
        }
        return Io(r, t);
      }
      function Oa(e, t) {
        const r = e._transformStreamController;
        if (r._finishPromise !== void 0)
          return r._finishPromise;
        const i = e._readable;
        r._finishPromise = w((f, c) => {
          r._finishPromise_resolve = f, r._finishPromise_reject = c;
        });
        const l = r._cancelAlgorithm(t);
        return Kt(r), _(l, () => (i._state === "errored" ? Je(r, i._storedError) : (te(i._readableStreamController, t), en(r)), null), (f) => (te(i._readableStreamController, f), Je(r, f), null)), r._finishPromise;
      }
      function za(e) {
        const t = e._transformStreamController;
        if (t._finishPromise !== void 0)
          return t._finishPromise;
        const r = e._readable;
        t._finishPromise = w((l, f) => {
          t._finishPromise_resolve = l, t._finishPromise_reject = f;
        });
        const i = t._flushAlgorithm();
        return Kt(t), _(i, () => (r._state === "errored" ? Je(t, r._storedError) : (je(r._readableStreamController), en(t)), null), (l) => (te(r._readableStreamController, l), Je(t, l), null)), t._finishPromise;
      }
      function Fa(e) {
        return Zt(e, !1), e._backpressureChangePromise;
      }
      function $a(e, t) {
        const r = e._transformStreamController;
        if (r._finishPromise !== void 0)
          return r._finishPromise;
        const i = e._writable;
        r._finishPromise = w((f, c) => {
          r._finishPromise_resolve = f, r._finishPromise_reject = c;
        });
        const l = r._cancelAlgorithm(t);
        return Kt(r), _(l, () => (i._state === "errored" ? Je(r, i._storedError) : (ct(i._writableStreamController, t), Xr(e), en(r)), null), (f) => (ct(i._writableStreamController, f), Xr(e), Je(r, f), null)), r._finishPromise;
      }
      function Xt(e) {
        return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`);
      }
      function en(e) {
        e._finishPromise_resolve !== void 0 && (e._finishPromise_resolve(), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
      }
      function Je(e, t) {
        e._finishPromise_reject !== void 0 && (Y(e._finishPromise), e._finishPromise_reject(t), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
      }
      function Wo(e) {
        return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`);
      }
      n.ByteLengthQueuingStrategy = Qt, n.CountQueuingStrategy = Yt, n.ReadableByteStreamController = pe, n.ReadableStream = D, n.ReadableStreamBYOBReader = ve, n.ReadableStreamBYOBRequest = Oe, n.ReadableStreamDefaultController = ye, n.ReadableStreamDefaultReader = Ce, n.TransformStream = Gt, n.TransformStreamDefaultController = Ie, n.WritableStream = ke, n.WritableStreamDefaultController = Ye, n.WritableStreamDefaultWriter = be;
    });
  }(rr, rr.exports)), rr.exports;
}
const es = 65536;
if (!globalThis.ReadableStream)
  try {
    const a = require("node:process"), { emitWarning: o } = a;
    try {
      a.emitWarning = () => {
      }, Object.assign(globalThis, require("node:stream/web")), a.emitWarning = o;
    } catch (n) {
      throw a.emitWarning = o, n;
    }
  } catch {
    Object.assign(globalThis, Xa());
  }
try {
  const { Blob: a } = require("buffer");
  a && !a.prototype.stream && (a.prototype.stream = function(n) {
    let s = 0;
    const u = this;
    return new ReadableStream({
      type: "bytes",
      async pull(h) {
        const S = await u.slice(s, Math.min(u.size, s + es)).arrayBuffer();
        s += S.byteLength, h.enqueue(new Uint8Array(S)), s === u.size && h.close();
      }
    });
  });
} catch {
}
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const $o = 65536;
async function* nn(a, o = !0) {
  for (const n of a)
    if ("stream" in n)
      yield* (
        /** @type {AsyncIterableIterator<Uint8Array>} */
        n.stream()
      );
    else if (ArrayBuffer.isView(n))
      if (o) {
        let s = n.byteOffset;
        const u = n.byteOffset + n.byteLength;
        for (; s !== u; ) {
          const h = Math.min(u - s, $o), d = n.buffer.slice(s, s + h);
          s += d.byteLength, yield new Uint8Array(d);
        }
      } else
        yield n;
    else {
      let s = 0, u = (
        /** @type {Blob} */
        n
      );
      for (; s !== u.size; ) {
        const d = await u.slice(s, Math.min(u.size, s + $o)).arrayBuffer();
        s += d.byteLength, yield new Uint8Array(d);
      }
    }
}
var we, wt, it, dr, Ne;
const No = (Ne = class {
  /**
   * The Blob() constructor returns a new Blob object. The content
   * of the blob consists of the concatenation of the values given
   * in the parameter array.
   *
   * @param {*} blobParts
   * @param {{ type?: string, endings?: string }} [options]
   */
  constructor(o = [], n = {}) {
    /** @type {Array.<(Blob|Uint8Array)>} */
    qe(this, we, []);
    qe(this, wt, "");
    qe(this, it, 0);
    qe(this, dr, "transparent");
    if (typeof o != "object" || o === null)
      throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
    if (typeof o[Symbol.iterator] != "function")
      throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
    if (typeof n != "object" && typeof n != "function")
      throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
    n === null && (n = {});
    const s = new TextEncoder();
    for (const h of o) {
      let d;
      ArrayBuffer.isView(h) ? d = new Uint8Array(h.buffer.slice(h.byteOffset, h.byteOffset + h.byteLength)) : h instanceof ArrayBuffer ? d = new Uint8Array(h.slice(0)) : h instanceof Ne ? d = h : d = s.encode(`${h}`), le(this, it, $(this, it) + (ArrayBuffer.isView(d) ? d.byteLength : d.size)), $(this, we).push(d);
    }
    le(this, dr, `${n.endings === void 0 ? "transparent" : n.endings}`);
    const u = n.type === void 0 ? "" : String(n.type);
    le(this, wt, /^[\x20-\x7E]*$/.test(u) ? u : "");
  }
  /**
   * The Blob interface's size property returns the
   * size of the Blob in bytes.
   */
  get size() {
    return $(this, it);
  }
  /**
   * The type property of a Blob object returns the MIME type of the file.
   */
  get type() {
    return $(this, wt);
  }
  /**
   * The text() method in the Blob interface returns a Promise
   * that resolves with a string containing the contents of
   * the blob, interpreted as UTF-8.
   *
   * @return {Promise<string>}
   */
  async text() {
    const o = new TextDecoder();
    let n = "";
    for await (const s of nn($(this, we), !1))
      n += o.decode(s, { stream: !0 });
    return n += o.decode(), n;
  }
  /**
   * The arrayBuffer() method in the Blob interface returns a
   * Promise that resolves with the contents of the blob as
   * binary data contained in an ArrayBuffer.
   *
   * @return {Promise<ArrayBuffer>}
   */
  async arrayBuffer() {
    const o = new Uint8Array(this.size);
    let n = 0;
    for await (const s of nn($(this, we), !1))
      o.set(s, n), n += s.length;
    return o.buffer;
  }
  stream() {
    const o = nn($(this, we), !0);
    return new globalThis.ReadableStream({
      // @ts-ignore
      type: "bytes",
      async pull(n) {
        const s = await o.next();
        s.done ? n.close() : n.enqueue(s.value);
      },
      async cancel() {
        await o.return();
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
  slice(o = 0, n = this.size, s = "") {
    const { size: u } = this;
    let h = o < 0 ? Math.max(u + o, 0) : Math.min(o, u), d = n < 0 ? Math.max(u + n, 0) : Math.min(n, u);
    const S = Math.max(d - h, 0), T = $(this, we), b = [];
    let w = 0;
    for (const m of T) {
      if (w >= S)
        break;
      const k = ArrayBuffer.isView(m) ? m.byteLength : m.size;
      if (h && k <= h)
        h -= k, d -= k;
      else {
        let _;
        ArrayBuffer.isView(m) ? (_ = m.subarray(h, Math.min(k, d)), w += _.byteLength) : (_ = m.slice(h, Math.min(k, d)), w += _.size), d -= k, b.push(_), h = 0;
      }
    }
    const g = new Ne([], { type: String(s).toLowerCase() });
    return le(g, it, S), le(g, we, b), g;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](o) {
    return o && typeof o == "object" && typeof o.constructor == "function" && (typeof o.stream == "function" || typeof o.arrayBuffer == "function") && /^(Blob|File)$/.test(o[Symbol.toStringTag]);
  }
}, we = new WeakMap(), wt = new WeakMap(), it = new WeakMap(), dr = new WeakMap(), Ne);
Object.defineProperties(No.prototype, {
  size: { enumerable: !0 },
  type: { enumerable: !0 },
  slice: { enumerable: !0 }
});
const sr = No;
var Rt, Ct, Mo;
const ts = (Mo = class extends sr {
  /**
   * @param {*[]} fileBits
   * @param {string} fileName
   * @param {{lastModified?: number, type?: string}} options
   */
  // @ts-ignore
  constructor(n, s, u = {}) {
    if (arguments.length < 2)
      throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
    super(n, u);
    qe(this, Rt, 0);
    qe(this, Ct, "");
    u === null && (u = {});
    const h = u.lastModified === void 0 ? Date.now() : Number(u.lastModified);
    Number.isNaN(h) || le(this, Rt, h), le(this, Ct, String(s));
  }
  get name() {
    return $(this, Ct);
  }
  get lastModified() {
    return $(this, Rt);
  }
  get [Symbol.toStringTag]() {
    return "File";
  }
  static [Symbol.hasInstance](n) {
    return !!n && n instanceof sr && /^(File)$/.test(n[Symbol.toStringTag]);
  }
}, Rt = new WeakMap(), Ct = new WeakMap(), Mo), rs = ts;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: yt, iterator: ns, hasInstance: os } = Symbol, Lo = Math.random, is = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), Do = (a, o, n) => (a += "", /^(Blob|File)$/.test(o && o[yt]) ? [(n = n !== void 0 ? n + "" : o[yt] == "File" ? o.name : "blob", a), o.name !== n || o[yt] == "blob" ? new rs([o], n, o) : o] : [a, o + ""]), on = (a, o) => (o ? a : a.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), Ue = (a, o, n) => {
  if (o.length < n)
    throw new TypeError(`Failed to execute '${a}' on 'FormData': ${n} arguments required, but only ${o.length} present.`);
}, ee, Uo;
const fn = (Uo = class {
  constructor(...o) {
    qe(this, ee, []);
    if (o.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [yt]() {
    return "FormData";
  }
  [ns]() {
    return this.entries();
  }
  static [os](o) {
    return o && typeof o == "object" && o[yt] === "FormData" && !is.some((n) => typeof o[n] != "function");
  }
  append(...o) {
    Ue("append", arguments, 2), $(this, ee).push(Do(...o));
  }
  delete(o) {
    Ue("delete", arguments, 1), o += "", le(this, ee, $(this, ee).filter(([n]) => n !== o));
  }
  get(o) {
    Ue("get", arguments, 1), o += "";
    for (var n = $(this, ee), s = n.length, u = 0; u < s; u++) if (n[u][0] === o) return n[u][1];
    return null;
  }
  getAll(o, n) {
    return Ue("getAll", arguments, 1), n = [], o += "", $(this, ee).forEach((s) => s[0] === o && n.push(s[1])), n;
  }
  has(o) {
    return Ue("has", arguments, 1), o += "", $(this, ee).some((n) => n[0] === o);
  }
  forEach(o, n) {
    Ue("forEach", arguments, 1);
    for (var [s, u] of this) o.call(n, u, s, this);
  }
  set(...o) {
    Ue("set", arguments, 2);
    var n = [], s = !0;
    o = Do(...o), $(this, ee).forEach((u) => {
      u[0] === o[0] ? s && (s = !n.push(o)) : n.push(u);
    }), s && n.push(o), le(this, ee, n);
  }
  *entries() {
    yield* $(this, ee);
  }
  *keys() {
    for (var [o] of this) yield o;
  }
  *values() {
    for (var [, o] of this) yield o;
  }
}, ee = new WeakMap(), Uo);
function as(a, o = sr) {
  var n = `${Lo()}${Lo()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), s = [], u = `--${n}\r
Content-Disposition: form-data; name="`;
  return a.forEach((h, d) => typeof h == "string" ? s.push(u + on(d) + `"\r
\r
${h.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : s.push(u + on(d) + `"; filename="${on(h.name, 1)}"\r
Content-Type: ${h.type || "application/octet-stream"}\r
\r
`, h, `\r
`)), s.push(`--${n}--`), new o(s, { type: "multipart/form-data; boundary=" + n });
}
class mr extends Error {
  constructor(o, n) {
    super(o), Error.captureStackTrace(this, this.constructor), this.type = n;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
class ue extends mr {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(o, n, s) {
    super(o, n), s && (this.code = this.errno = s.code, this.erroredSysCall = s.syscall);
  }
}
const lr = Symbol.toStringTag, xo = (a) => typeof a == "object" && typeof a.append == "function" && typeof a.delete == "function" && typeof a.get == "function" && typeof a.getAll == "function" && typeof a.has == "function" && typeof a.set == "function" && typeof a.sort == "function" && a[lr] === "URLSearchParams", ur = (a) => a && typeof a == "object" && typeof a.arrayBuffer == "function" && typeof a.type == "string" && typeof a.stream == "function" && typeof a.constructor == "function" && /^(Blob|File)$/.test(a[lr]), ss = (a) => typeof a == "object" && (a[lr] === "AbortSignal" || a[lr] === "EventTarget"), ls = (a, o) => {
  const n = new URL(o).hostname, s = new URL(a).hostname;
  return n === s || n.endsWith(`.${s}`);
}, us = (a, o) => {
  const n = new URL(o).protocol, s = new URL(a).protocol;
  return n === s;
}, fs = Za(fe.pipeline), V = Symbol("Body internals");
class _t {
  constructor(o, {
    size: n = 0
  } = {}) {
    let s = null;
    o === null ? o = null : xo(o) ? o = j.from(o.toString()) : ur(o) || j.isBuffer(o) || (ar.isAnyArrayBuffer(o) ? o = j.from(o) : ArrayBuffer.isView(o) ? o = j.from(o.buffer, o.byteOffset, o.byteLength) : o instanceof fe || (o instanceof fn ? (o = as(o), s = o.type.split("=")[1]) : o = j.from(String(o))));
    let u = o;
    j.isBuffer(o) ? u = fe.Readable.from(o) : ur(o) && (u = fe.Readable.from(o.stream())), this[V] = {
      body: o,
      stream: u,
      boundary: s,
      disturbed: !1,
      error: null
    }, this.size = n, o instanceof fe && o.on("error", (h) => {
      const d = h instanceof mr ? h : new ue(`Invalid response body while trying to fetch ${this.url}: ${h.message}`, "system", h);
      this[V].error = d;
    });
  }
  get body() {
    return this[V].stream;
  }
  get bodyUsed() {
    return this[V].disturbed;
  }
  /**
   * Decode response as ArrayBuffer
   *
   * @return  Promise
   */
  async arrayBuffer() {
    const { buffer: o, byteOffset: n, byteLength: s } = await an(this);
    return o.slice(n, n + s);
  }
  async formData() {
    const o = this.headers.get("content-type");
    if (o.startsWith("application/x-www-form-urlencoded")) {
      const s = new fn(), u = new URLSearchParams(await this.text());
      for (const [h, d] of u)
        s.append(h, d);
      return s;
    }
    const { toFormData: n } = await import("./multipart-parser-CYwLEmyu.js");
    return n(this.body, o);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const o = this.headers && this.headers.get("content-type") || this[V].body && this[V].body.type || "", n = await this.arrayBuffer();
    return new sr([n], {
      type: o
    });
  }
  /**
   * Decode response as json
   *
   * @return  Promise
   */
  async json() {
    const o = await this.text();
    return JSON.parse(o);
  }
  /**
   * Decode response as text
   *
   * @return  Promise
   */
  async text() {
    const o = await an(this);
    return new TextDecoder().decode(o);
  }
  /**
   * Decode response as buffer (non-spec api)
   *
   * @return  Promise
   */
  buffer() {
    return an(this);
  }
}
_t.prototype.buffer = hr(_t.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(_t.prototype, {
  body: { enumerable: !0 },
  bodyUsed: { enumerable: !0 },
  arrayBuffer: { enumerable: !0 },
  blob: { enumerable: !0 },
  json: { enumerable: !0 },
  text: { enumerable: !0 },
  data: { get: hr(
    () => {
    },
    "data doesn't exist, use json(), text(), arrayBuffer(), or body instead",
    "https://github.com/node-fetch/node-fetch/issues/1000 (response)"
  ) }
});
async function an(a) {
  if (a[V].disturbed)
    throw new TypeError(`body used already for: ${a.url}`);
  if (a[V].disturbed = !0, a[V].error)
    throw a[V].error;
  const { body: o } = a;
  if (o === null)
    return j.alloc(0);
  if (!(o instanceof fe))
    return j.alloc(0);
  const n = [];
  let s = 0;
  try {
    for await (const u of o) {
      if (a.size > 0 && s + u.length > a.size) {
        const h = new ue(`content size at ${a.url} over limit: ${a.size}`, "max-size");
        throw o.destroy(h), h;
      }
      s += u.length, n.push(u);
    }
  } catch (u) {
    throw u instanceof mr ? u : new ue(`Invalid response body while trying to fetch ${a.url}: ${u.message}`, "system", u);
  }
  if (o.readableEnded === !0 || o._readableState.ended === !0)
    try {
      return n.every((u) => typeof u == "string") ? j.from(n.join("")) : j.concat(n, s);
    } catch (u) {
      throw new ue(`Could not create Buffer from response body for ${a.url}: ${u.message}`, "system", u);
    }
  else
    throw new ue(`Premature close of server response while trying to fetch ${a.url}`);
}
const mn = (a, o) => {
  let n, s, { body: u } = a[V];
  if (a.bodyUsed)
    throw new Error("cannot clone body after it is used");
  return u instanceof fe && typeof u.getBoundary != "function" && (n = new ir({ highWaterMark: o }), s = new ir({ highWaterMark: o }), u.pipe(n), u.pipe(s), a[V].stream = n, u = s), u;
}, cs = hr(
  (a) => a.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
), Ho = (a, o) => a === null ? null : typeof a == "string" ? "text/plain;charset=UTF-8" : xo(a) ? "application/x-www-form-urlencoded;charset=UTF-8" : ur(a) ? a.type || null : j.isBuffer(a) || ar.isAnyArrayBuffer(a) || ArrayBuffer.isView(a) ? null : a instanceof fn ? `multipart/form-data; boundary=${o[V].boundary}` : a && typeof a.getBoundary == "function" ? `multipart/form-data;boundary=${cs(a)}` : a instanceof fe ? null : "text/plain;charset=UTF-8", ds = (a) => {
  const { body: o } = a[V];
  return o === null ? 0 : ur(o) ? o.size : j.isBuffer(o) ? o.length : o && typeof o.getLengthSync == "function" && o.hasKnownLength && o.hasKnownLength() ? o.getLengthSync() : null;
}, hs = async (a, { body: o }) => {
  o === null ? a.end() : await fs(o, a);
}, nr = typeof gt.validateHeaderName == "function" ? gt.validateHeaderName : (a) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(a)) {
    const o = new TypeError(`Header name must be a valid HTTP token [${a}]`);
    throw Object.defineProperty(o, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), o;
  }
}, cn = typeof gt.validateHeaderValue == "function" ? gt.validateHeaderValue : (a, o) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o)) {
    const n = new TypeError(`Invalid character in header content ["${a}"]`);
    throw Object.defineProperty(n, "code", { value: "ERR_INVALID_CHAR" }), n;
  }
};
class Re extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(o) {
    let n = [];
    if (o instanceof Re) {
      const s = o.raw();
      for (const [u, h] of Object.entries(s))
        n.push(...h.map((d) => [u, d]));
    } else if (o != null) if (typeof o == "object" && !ar.isBoxedPrimitive(o)) {
      const s = o[Symbol.iterator];
      if (s == null)
        n.push(...Object.entries(o));
      else {
        if (typeof s != "function")
          throw new TypeError("Header pairs must be iterable");
        n = [...o].map((u) => {
          if (typeof u != "object" || ar.isBoxedPrimitive(u))
            throw new TypeError("Each header pair must be an iterable object");
          return [...u];
        }).map((u) => {
          if (u.length !== 2)
            throw new TypeError("Each header pair must be a name/value tuple");
          return [...u];
        });
      }
    } else
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    return n = n.length > 0 ? n.map(([s, u]) => (nr(s), cn(s, String(u)), [String(s).toLowerCase(), String(u)])) : void 0, super(n), new Proxy(this, {
      get(s, u, h) {
        switch (u) {
          case "append":
          case "set":
            return (d, S) => (nr(d), cn(d, String(S)), URLSearchParams.prototype[u].call(
              s,
              String(d).toLowerCase(),
              String(S)
            ));
          case "delete":
          case "has":
          case "getAll":
            return (d) => (nr(d), URLSearchParams.prototype[u].call(
              s,
              String(d).toLowerCase()
            ));
          case "keys":
            return () => (s.sort(), new Set(URLSearchParams.prototype.keys.call(s)).keys());
          default:
            return Reflect.get(s, u, h);
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
  get(o) {
    const n = this.getAll(o);
    if (n.length === 0)
      return null;
    let s = n.join(", ");
    return /^content-encoding$/i.test(o) && (s = s.toLowerCase()), s;
  }
  forEach(o, n = void 0) {
    for (const s of this.keys())
      Reflect.apply(o, n, [this.get(s), s, this]);
  }
  *values() {
    for (const o of this.keys())
      yield this.get(o);
  }
  /**
   * @type {() => IterableIterator<[string, string]>}
   */
  *entries() {
    for (const o of this.keys())
      yield [o, this.get(o)];
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
    return [...this.keys()].reduce((o, n) => (o[n] = this.getAll(n), o), {});
  }
  /**
   * For better console.log(headers) and also to convert Headers into Node.js Request compatible format
   */
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((o, n) => {
      const s = this.getAll(n);
      return n === "host" ? o[n] = s[0] : o[n] = s.length > 1 ? s : s[0], o;
    }, {});
  }
}
Object.defineProperties(
  Re.prototype,
  ["get", "entries", "forEach", "values"].reduce((a, o) => (a[o] = { enumerable: !0 }, a), {})
);
function ms(a = []) {
  return new Re(
    a.reduce((o, n, s, u) => (s % 2 === 0 && o.push(u.slice(s, s + 2)), o), []).filter(([o, n]) => {
      try {
        return nr(o), cn(o, String(n)), !0;
      } catch {
        return !1;
      }
    })
  );
}
const ps = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Vo = (a) => ps.has(a), oe = Symbol("Response internals");
class Z extends _t {
  constructor(o = null, n = {}) {
    super(o, n);
    const s = n.status != null ? n.status : 200, u = new Re(n.headers);
    if (o !== null && !u.has("Content-Type")) {
      const h = Ho(o, this);
      h && u.append("Content-Type", h);
    }
    this[oe] = {
      type: "default",
      url: n.url,
      status: s,
      statusText: n.statusText || "",
      headers: u,
      counter: n.counter,
      highWaterMark: n.highWaterMark
    };
  }
  get type() {
    return this[oe].type;
  }
  get url() {
    return this[oe].url || "";
  }
  get status() {
    return this[oe].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[oe].status >= 200 && this[oe].status < 300;
  }
  get redirected() {
    return this[oe].counter > 0;
  }
  get statusText() {
    return this[oe].statusText;
  }
  get headers() {
    return this[oe].headers;
  }
  get highWaterMark() {
    return this[oe].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new Z(mn(this, this.highWaterMark), {
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
  static redirect(o, n = 302) {
    if (!Vo(n))
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    return new Z(null, {
      headers: {
        location: new URL(o).toString()
      },
      status: n
    });
  }
  static error() {
    const o = new Z(null, { status: 0, statusText: "" });
    return o[oe].type = "error", o;
  }
  static json(o = void 0, n = {}) {
    const s = JSON.stringify(o);
    if (s === void 0)
      throw new TypeError("data is not JSON serializable");
    const u = new Re(n && n.headers);
    return u.has("content-type") || u.set("content-type", "application/json"), new Z(s, {
      ...n,
      headers: u
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(Z.prototype, {
  type: { enumerable: !0 },
  url: { enumerable: !0 },
  status: { enumerable: !0 },
  ok: { enumerable: !0 },
  redirected: { enumerable: !0 },
  statusText: { enumerable: !0 },
  headers: { enumerable: !0 },
  clone: { enumerable: !0 }
});
const bs = (a) => {
  if (a.search)
    return a.search;
  const o = a.href.length - 1, n = a.hash || (a.href[o] === "#" ? "#" : "");
  return a.href[o - n.length] === "?" ? "?" : "";
};
function jo(a, o = !1) {
  return a == null || (a = new URL(a), /^(about|blob|data):$/.test(a.protocol)) ? "no-referrer" : (a.username = "", a.password = "", a.hash = "", o && (a.pathname = "", a.search = ""), a);
}
const Qo = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]), ys = "strict-origin-when-cross-origin";
function gs(a) {
  if (!Qo.has(a))
    throw new TypeError(`Invalid referrerPolicy: ${a}`);
  return a;
}
function _s(a) {
  if (/^(http|ws)s:$/.test(a.protocol))
    return !0;
  const o = a.host.replace(/(^\[)|(]$)/g, ""), n = Ja(o);
  return n === 4 && /^127\./.test(o) || n === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o) ? !0 : a.host === "localhost" || a.host.endsWith(".localhost") ? !1 : a.protocol === "file:";
}
function ot(a) {
  return /^about:(blank|srcdoc)$/.test(a) || a.protocol === "data:" || /^(blob|filesystem):$/.test(a.protocol) ? !0 : _s(a);
}
function Ss(a, { referrerURLCallback: o, referrerOriginCallback: n } = {}) {
  if (a.referrer === "no-referrer" || a.referrerPolicy === "")
    return null;
  const s = a.referrerPolicy;
  if (a.referrer === "about:client")
    return "no-referrer";
  const u = a.referrer;
  let h = jo(u), d = jo(u, !0);
  h.toString().length > 4096 && (h = d), o && (h = o(h)), n && (d = n(d));
  const S = new URL(a.url);
  switch (s) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return d;
    case "unsafe-url":
      return h;
    case "strict-origin":
      return ot(h) && !ot(S) ? "no-referrer" : d.toString();
    case "strict-origin-when-cross-origin":
      return h.origin === S.origin ? h : ot(h) && !ot(S) ? "no-referrer" : d;
    case "same-origin":
      return h.origin === S.origin ? h : "no-referrer";
    case "origin-when-cross-origin":
      return h.origin === S.origin ? h : d;
    case "no-referrer-when-downgrade":
      return ot(h) && !ot(S) ? "no-referrer" : h;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${s}`);
  }
}
function ws(a) {
  const o = (a.get("referrer-policy") || "").split(/[,\s]+/);
  let n = "";
  for (const s of o)
    s && Qo.has(s) && (n = s);
  return n;
}
const L = Symbol("Request internals"), bt = (a) => typeof a == "object" && typeof a[L] == "object", Rs = hr(
  () => {
  },
  ".data is not a valid RequestInit property, use .body instead",
  "https://github.com/node-fetch/node-fetch/issues/1000 (request)"
);
class St extends _t {
  constructor(o, n = {}) {
    let s;
    if (bt(o) ? s = new URL(o.url) : (s = new URL(o), o = {}), s.username !== "" || s.password !== "")
      throw new TypeError(`${s} is an url with embedded credentials.`);
    let u = n.method || o.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(u) && (u = u.toUpperCase()), !bt(n) && "data" in n && Rs(), (n.body != null || bt(o) && o.body !== null) && (u === "GET" || u === "HEAD"))
      throw new TypeError("Request with GET/HEAD method cannot have body");
    const h = n.body ? n.body : bt(o) && o.body !== null ? mn(o) : null;
    super(h, {
      size: n.size || o.size || 0
    });
    const d = new Re(n.headers || o.headers || {});
    if (h !== null && !d.has("Content-Type")) {
      const b = Ho(h, this);
      b && d.set("Content-Type", b);
    }
    let S = bt(o) ? o.signal : null;
    if ("signal" in n && (S = n.signal), S != null && !ss(S))
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    let T = n.referrer == null ? o.referrer : n.referrer;
    if (T === "")
      T = "no-referrer";
    else if (T) {
      const b = new URL(T);
      T = /^about:(\/\/)?client$/.test(b) ? "client" : b;
    } else
      T = void 0;
    this[L] = {
      method: u,
      redirect: n.redirect || o.redirect || "follow",
      headers: d,
      parsedURL: s,
      signal: S,
      referrer: T
    }, this.follow = n.follow === void 0 ? o.follow === void 0 ? 20 : o.follow : n.follow, this.compress = n.compress === void 0 ? o.compress === void 0 ? !0 : o.compress : n.compress, this.counter = n.counter || o.counter || 0, this.agent = n.agent || o.agent, this.highWaterMark = n.highWaterMark || o.highWaterMark || 16384, this.insecureHTTPParser = n.insecureHTTPParser || o.insecureHTTPParser || !1, this.referrerPolicy = n.referrerPolicy || o.referrerPolicy || "";
  }
  /** @returns {string} */
  get method() {
    return this[L].method;
  }
  /** @returns {string} */
  get url() {
    return Ha(this[L].parsedURL);
  }
  /** @returns {Headers} */
  get headers() {
    return this[L].headers;
  }
  get redirect() {
    return this[L].redirect;
  }
  /** @returns {AbortSignal} */
  get signal() {
    return this[L].signal;
  }
  // https://fetch.spec.whatwg.org/#dom-request-referrer
  get referrer() {
    if (this[L].referrer === "no-referrer")
      return "";
    if (this[L].referrer === "client")
      return "about:client";
    if (this[L].referrer)
      return this[L].referrer.toString();
  }
  get referrerPolicy() {
    return this[L].referrerPolicy;
  }
  set referrerPolicy(o) {
    this[L].referrerPolicy = gs(o);
  }
  /**
   * Clone this request
   *
   * @return  Request
   */
  clone() {
    return new St(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
}
Object.defineProperties(St.prototype, {
  method: { enumerable: !0 },
  url: { enumerable: !0 },
  headers: { enumerable: !0 },
  redirect: { enumerable: !0 },
  clone: { enumerable: !0 },
  signal: { enumerable: !0 },
  referrer: { enumerable: !0 },
  referrerPolicy: { enumerable: !0 }
});
const Cs = (a) => {
  const { parsedURL: o } = a[L], n = new Re(a[L].headers);
  n.has("Accept") || n.set("Accept", "*/*");
  let s = null;
  if (a.body === null && /^(post|put)$/i.test(a.method) && (s = "0"), a.body !== null) {
    const S = ds(a);
    typeof S == "number" && !Number.isNaN(S) && (s = String(S));
  }
  s && n.set("Content-Length", s), a.referrerPolicy === "" && (a.referrerPolicy = ys), a.referrer && a.referrer !== "no-referrer" ? a[L].referrer = Ss(a) : a[L].referrer = "no-referrer", a[L].referrer instanceof URL && n.set("Referer", a.referrer), n.has("User-Agent") || n.set("User-Agent", "node-fetch"), a.compress && !n.has("Accept-Encoding") && n.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: u } = a;
  typeof u == "function" && (u = u(o));
  const h = bs(o), d = {
    // Overwrite search to retain trailing ? (issue #776)
    path: o.pathname + h,
    // The following options are not expressed in the URL
    method: a.method,
    headers: n[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: a.insecureHTTPParser,
    agent: u
  };
  return {
    /** @type {URL} */
    parsedURL: o,
    options: d
  };
};
class Ts extends mr {
  constructor(o, n = "aborted") {
    super(o, n);
  }
}
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
if (!globalThis.DOMException)
  try {
    const { MessageChannel: a } = require("worker_threads"), o = new a().port1, n = new ArrayBuffer();
    o.postMessage(n, [n, n]);
  } catch (a) {
    a.constructor.name === "DOMException" && (globalThis.DOMException = a.constructor);
  }
const { stat: Qs } = Ya, Ps = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function Se(a, o) {
  return new Promise((n, s) => {
    const u = new St(a, o), { parsedURL: h, options: d } = Cs(u);
    if (!Ps.has(h.protocol))
      throw new TypeError(`node-fetch cannot load ${a}. URL scheme "${h.protocol.replace(/:$/, "")}" is not supported.`);
    if (h.protocol === "data:") {
      const _ = Ka(u.url), Q = new Z(_, { headers: { "Content-Type": _.typeFull } });
      n(Q);
      return;
    }
    const S = (h.protocol === "https:" ? Ga : gt).request, { signal: T } = u;
    let b = null;
    const w = () => {
      const _ = new Ts("The operation was aborted.");
      s(_), u.body && u.body instanceof fe.Readable && u.body.destroy(_), !(!b || !b.body) && b.body.emit("error", _);
    };
    if (T && T.aborted) {
      w();
      return;
    }
    const g = () => {
      w(), k();
    }, m = S(h.toString(), d);
    T && T.addEventListener("abort", g);
    const k = () => {
      m.abort(), T && T.removeEventListener("abort", g);
    };
    m.on("error", (_) => {
      s(new ue(`request to ${u.url} failed, reason: ${_.message}`, "system", _)), k();
    }), Es(m, (_) => {
      b && b.body && b.body.destroy(_);
    }), process.version < "v14" && m.on("socket", (_) => {
      let Q;
      _.prependListener("end", () => {
        Q = _._eventsCount;
      }), _.prependListener("close", (q) => {
        if (b && Q < _._eventsCount && !q) {
          const z = new Error("Premature close");
          z.code = "ERR_STREAM_PREMATURE_CLOSE", b.body.emit("error", z);
        }
      });
    }), m.on("response", (_) => {
      m.setTimeout(0);
      const Q = ms(_.rawHeaders);
      if (Vo(_.statusCode)) {
        const W = Q.get("Location");
        let F = null;
        try {
          F = W === null ? null : new URL(W, u.url);
        } catch {
          if (u.redirect !== "manual") {
            s(new ue(`uri requested responds with an invalid redirect URL: ${W}`, "invalid-redirect")), k();
            return;
          }
        }
        switch (u.redirect) {
          case "error":
            s(new ue(`uri requested responds with a redirect, redirect mode is set to error: ${u.url}`, "no-redirect")), k();
            return;
          case "manual":
            break;
          case "follow": {
            if (F === null)
              break;
            if (u.counter >= u.follow) {
              s(new ue(`maximum redirect reached at: ${u.url}`, "max-redirect")), k();
              return;
            }
            const M = {
              headers: new Re(u.headers),
              follow: u.follow,
              counter: u.counter + 1,
              agent: u.agent,
              compress: u.compress,
              method: u.method,
              body: mn(u),
              signal: u.signal,
              size: u.size,
              referrer: u.referrer,
              referrerPolicy: u.referrerPolicy
            };
            if (!ls(u.url, F) || !us(u.url, F))
              for (const Tt of ["authorization", "www-authenticate", "cookie", "cookie2"])
                M.headers.delete(Tt);
            if (_.statusCode !== 303 && u.body && o.body instanceof fe.Readable) {
              s(new ue("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), k();
              return;
            }
            (_.statusCode === 303 || (_.statusCode === 301 || _.statusCode === 302) && u.method === "POST") && (M.method = "GET", M.body = void 0, M.headers.delete("content-length"));
            const U = ws(Q);
            U && (M.referrerPolicy = U), n(Se(new St(F, M))), k();
            return;
          }
          default:
            return s(new TypeError(`Redirect option '${u.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      T && _.once("end", () => {
        T.removeEventListener("abort", g);
      });
      let q = nt(_, new ir(), (W) => {
        W && s(W);
      });
      process.version < "v12.10" && _.on("aborted", g);
      const z = {
        url: u.url,
        status: _.statusCode,
        statusText: _.statusMessage,
        headers: Q,
        size: u.size,
        counter: u.counter,
        highWaterMark: u.highWaterMark
      }, Y = Q.get("Content-Encoding");
      if (!u.compress || u.method === "HEAD" || Y === null || _.statusCode === 204 || _.statusCode === 304) {
        b = new Z(q, z), n(b);
        return;
      }
      const ce = {
        flush: rt.Z_SYNC_FLUSH,
        finishFlush: rt.Z_SYNC_FLUSH
      };
      if (Y === "gzip" || Y === "x-gzip") {
        q = nt(q, rt.createGunzip(ce), (W) => {
          W && s(W);
        }), b = new Z(q, z), n(b);
        return;
      }
      if (Y === "deflate" || Y === "x-deflate") {
        const W = nt(_, new ir(), (F) => {
          F && s(F);
        });
        W.once("data", (F) => {
          (F[0] & 15) === 8 ? q = nt(q, rt.createInflate(), (M) => {
            M && s(M);
          }) : q = nt(q, rt.createInflateRaw(), (M) => {
            M && s(M);
          }), b = new Z(q, z), n(b);
        }), W.once("end", () => {
          b || (b = new Z(q, z), n(b));
        });
        return;
      }
      if (Y === "br") {
        q = nt(q, rt.createBrotliDecompress(), (W) => {
          W && s(W);
        }), b = new Z(q, z), n(b);
        return;
      }
      b = new Z(q, z), n(b);
    }), hs(m, u).catch(s);
  });
}
function Es(a, o) {
  const n = j.from(`0\r
\r
`);
  let s = !1, u = !1, h;
  a.on("response", (d) => {
    const { headers: S } = d;
    s = S["transfer-encoding"] === "chunked" && !S["content-length"];
  }), a.on("socket", (d) => {
    const S = () => {
      if (s && !u) {
        const b = new Error("Premature close");
        b.code = "ERR_STREAM_PREMATURE_CLOSE", o(b);
      }
    }, T = (b) => {
      u = j.compare(b.slice(-5), n) === 0, !u && h && (u = j.compare(h.slice(-3), n.slice(0, 3)) === 0 && j.compare(b.slice(-2), n.slice(3)) === 0), h = b;
    };
    d.prependListener("close", S), d.on("data", T), a.on("close", () => {
      d.removeListener("close", S), d.removeListener("data", T);
    });
  });
}
class vs extends hn {
  constructor() {
    super(...arguments);
    O(this, "creds", null);
    O(this, "timer", null);
    O(this, "phase", "Unknown");
  }
  /* -------- API publique -------- */
  setCreds(n) {
    this.creds = n, this.timer || this.start();
  }
  stop() {
    this.timer && clearInterval(this.timer), this.timer = null, this.phase = "Unknown", this.emit("phase", this.phase);
  }
  /* -------- internes -------- */
  async poll() {
    if (!this.creds) return;
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-gameflow/v1/gameflow-phase`, d = Buffer.from(`riot:${u}`).toString("base64");
    try {
      const S = (await Se(h, { headers: { Authorization: `Basic ${d}` } }).then(
        (T) => T.text()
      )).replace(/"/g, "");
      S !== this.phase && (this.phase = S, this.emit("phase", S));
    } catch {
      this.phase !== "Unknown" && (this.phase = "Unknown", this.emit("phase", "Unknown"));
    }
  }
  start(n = 2e3) {
    this.timer || (this.poll(), this.timer = setInterval(() => this.poll(), n));
  }
  /* typing helpers */
  on(n, s) {
    return super.on(n, s);
  }
  emit(n, s) {
    return super.emit(n, s);
  }
}
const dn = /* @__PURE__ */ new Map();
async function ks() {
  if (dn.size) return;
  (await Se("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json").then((n) => n.json())).forEach((n) => dn.set(n.id, n.alias));
}
class As extends hn {
  constructor() {
    super(...arguments);
    O(this, "creds", null);
    O(this, "summonerId", null);
    O(this, "poller", null);
    O(this, "currentChampion", 0);
    O(this, "lastAppliedChampion", 0);
    O(this, "includeDefaultSkin", !0);
    O(this, "selectedSkinId", 0);
    O(this, "selectedChromaId", 0);
    O(this, "profileIconId", 0);
    O(this, "autoRollEnabled", !0);
    O(this, "skins", []);
  }
  /* ---------- gestion des creds ---------- */
  setCreds(n) {
    this.stop(), this.creds = n, this.summonerId = null, this.lastAppliedChampion = 0;
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
      championAlias: dn.get(this.currentChampion) ?? "",
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
    const n = this.includeDefaultSkin ? this.skins : this.skins.filter((h) => h.id % 1e3 !== 0) || this.skins, s = n[Math.floor(Math.random() * n.length)], u = s.chromas.length ? s.chromas[Math.floor(Math.random() * s.chromas.length)].id : s.id;
    await this.applySkin(u), this.selectedSkinId = s.id, this.selectedChromaId = u !== s.id ? u : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
  }
  /** Reroll uniquement le chroma pour le skin courant */
  async rerollChroma() {
    const n = this.skins.find((u) => u.id === this.selectedSkinId);
    if (!n || n.chromas.length === 0) return;
    let s = n.chromas[Math.floor(Math.random() * n.chromas.length)];
    if (n.chromas.length > 1)
      for (; s.id === this.selectedChromaId; )
        s = n.chromas[Math.floor(Math.random() * n.chromas.length)];
    await this.applySkin(s.id), this.selectedChromaId = s.id, this.emit("selection", this.getSelection());
  }
  /* ---------- boucle principale ---------- */
  async tick() {
    if (!this.creds) return;
    this.summonerId === null && await this.fetchSummonerId();
    const n = await this.fetchCurrentChampion();
    n && n !== this.currentChampion && (this.currentChampion = n, await this.refreshSkinsAndMaybeApply()), await this.updateManualSelection();
  }
  /* ---------- helpers ---------- */
  async fetchSummonerId() {
    if (!this.creds) return;
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-summoner/v1/current-summoner`, d = Buffer.from(`riot:${u}`).toString("base64");
    try {
      const S = await Se(h, {
        headers: { Authorization: `Basic ${d}` }
      }).then((T) => T.json());
      this.summonerId = S.summonerId ?? S.accountId ?? S.id ?? null, this.profileIconId = S.profileIconId ?? 0, this.emit("icon", this.profileIconId);
    } catch {
      this.summonerId = null;
    }
  }
  async fetchCurrentChampion() {
    if (!this.creds) return 0;
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-champ-select/v1/current-champion`, d = Buffer.from(`riot:${u}`).toString("base64");
    try {
      return Number(
        await Se(h, {
          headers: { Authorization: `Basic ${d}` }
        }).then((S) => S.text())
      ) || 0;
    } catch {
      return 0;
    }
  }
  async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    await ks();
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}`, d = {
      Authorization: `Basic ${Buffer.from(`riot:${u}`).toString(
        "base64"
      )}`
    }, S = await Se(
      `${h}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
      { headers: d }
    ).then((b) => b.json()), T = [];
    for (const b of S.filter(
      (w) => {
        var g;
        return ((g = w.ownership) == null ? void 0 : g.owned) || w.isOwned || w.owned;
      }
    )) {
      let w = [];
      try {
        w = (await Se(
          `${h}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins/${b.id}/chromas`,
          { headers: d }
        ).then((m) => m.status === 404 ? [] : m.json())).filter((m) => {
          var k;
          return ((k = m.ownership) == null ? void 0 : k.owned) || m.isOwned || m.owned;
        }).map((m) => ({ id: m.id, name: m.name || `Chroma ${m.id}` }));
      } catch {
      }
      T.push({ id: b.id, name: b.name, chromas: w });
    }
    if (this.skins = T, this.emit("skins", T), this.autoRollEnabled && this.currentChampion !== this.lastAppliedChampion && T.length) {
      const b = this.includeDefaultSkin ? T : T.filter((m) => m.id % 1e3 !== 0) || T, w = b[Math.floor(Math.random() * b.length)], g = w.chromas.length ? w.chromas[Math.floor(Math.random() * w.chromas.length)].id : w.id;
      await this.applySkin(g), this.selectedSkinId = w.id, this.selectedChromaId = g !== w.id ? g : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
    }
  }
  async applySkin(n) {
    if (!this.creds) return;
    const { protocol: s, port: u, password: h } = this.creds, d = `${s}://127.0.0.1:${u}/lol-champ-select/v1/session/my-selection`, S = Buffer.from(`riot:${h}`).toString("base64");
    try {
      await Se(d, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${S}`
        },
        body: JSON.stringify({ selectedSkinId: n })
      });
    } catch {
    }
  }
  /** détecte la sélection faite directement dans le client */
  async updateManualSelection() {
    if (!this.creds || !this.currentChampion) return;
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-champ-select/v1/session/my-selection`, d = Buffer.from(`riot:${u}`).toString("base64");
    try {
      const T = (await Se(h, {
        headers: { Authorization: `Basic ${d}` }
      }).then((m) => m.json())).selectedSkinId ?? 0;
      if (!T || T === this.selectedChromaId || T === this.selectedSkinId)
        return;
      let b = T, w = 0;
      const g = this.skins.find((m) => m.id === T);
      if (g)
        b = g.id;
      else
        for (const m of this.skins) {
          const k = m.chromas.find((_) => _.id === T);
          if (k) {
            b = m.id, w = k.id;
            break;
          }
        }
      this.selectedSkinId = b, this.selectedChromaId = w, this.emit("selection", this.getSelection());
    } catch {
    }
  }
  /* implémentation générique — doit accepter TOUS les cas */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  on(n, s) {
    return super.on(n, s);
  }
  /* implémentation générique */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  emit(n, ...s) {
    return super.emit(n, ...s);
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const Bs = Va(import.meta.url), sn = xa(Bs);
let B = null;
const pn = new un(), fr = new vs(), x = new As();
let ln = null;
pn.on("status", (a, o) => {
  B == null || B.webContents.send("lcu-status", a), a === "connected" && o ? (B == null || B.show(), fr.setCreds(o), x.setCreds(o), x.start()) : (fr.stop(), x.stop(), B == null || B.hide());
});
fr.on("phase", (a) => {
  B == null || B.webContents.send("gameflow-phase", a);
});
x.on(
  "skins",
  (a) => {
    B == null || B.webContents.send("owned-skins", a);
  }
  // ← cast ajouté
);
x.on("selection", (a) => B == null ? void 0 : B.webContents.send("selection", a));
x.on("icon", (a) => {
  B == null || B.webContents.send("summoner-icon", a);
});
function Is() {
  const a = (n) => or.isPackaged ? tr(process.resourcesPath, "assets", n) : tr(sn, "..", "public", n);
  B = new ja({
    width: 900,
    height: 645,
    // 563
    resizable: !1,
    // ← l’utilisateur ne peut plus redimensionner
    maximizable: !1,
    // ← désactive le bouton “plein écran” (Windows / Linux)
    fullscreenable: !1,
    // ← désactive ⌥⌘F sur macOS
    icon: a("icon.ico"),
    show: !1,
    webPreferences: {
      preload: tr(sn, "preload.mjs"),
      contextIsolation: !0
    }
  }), Ma.setApplicationMenu(null);
  const o = Ua.createFromPath(a("icon.ico"));
  ln = new Na(o), ln.setToolTip("LoL Skin Picker"), ln.on("double-click", () => B.isVisible() ? B.hide() : B.show()), process.env.VITE_DEV_SERVER_URL ? B.loadURL(process.env.VITE_DEV_SERVER_URL) : B.loadFile(tr(sn, "..", "dist", "index.html")), pn.start();
}
ie.handle("get-lcu-status", () => pn.status);
ie.handle("get-gameflow-phase", () => fr.phase);
ie.handle("get-owned-skins", () => x.skins);
ie.handle("get-include-default", () => x.getIncludeDefault());
ie.handle("toggle-include-default", () => x.toggleIncludeDefault());
ie.handle("reroll-skin", () => x.rerollSkin());
ie.handle("reroll-chroma", () => x.rerollChroma());
ie.handle("get-selection", () => x.getSelection());
ie.handle("get-auto-roll", () => x.getAutoRoll());
ie.handle("toggle-auto-roll", () => x.toggleAutoRoll());
ie.handle("get-summoner-icon", () => x.getProfileIcon());
or.whenReady().then(Is);
or.on("window-all-closed", () => process.platform !== "darwin" && or.quit());
export {
  fn as F,
  rs as a
};
