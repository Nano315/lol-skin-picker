var $a = Object.defineProperty;
var Io = (a) => {
  throw TypeError(a);
};
var La = (a, o, n) => o in a ? $a(a, o, { enumerable: !0, configurable: !0, writable: !0, value: n }) : a[o] = n;
var F = (a, o, n) => La(a, typeof o != "symbol" ? o + "" : o, n), Oo = (a, o, n) => o.has(a) || Io("Cannot " + n);
var $ = (a, o, n) => (Oo(a, o, "read from private field"), n ? n.call(a) : o.get(a)), We = (a, o, n) => o.has(a) ? Io("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(a) : o.set(a, n), se = (a, o, n, s) => (Oo(a, o, "write to private field"), s ? s.call(a, n) : o.set(a, n), n);
import { ipcMain as Ie, app as ln, BrowserWindow as Da, Menu as ja, nativeImage as Ma, Tray as Ua } from "electron";
import { dirname as Na, join as tr } from "node:path";
import { format as xa, fileURLToPath as Ha } from "node:url";
import Va, { promises as Qa } from "node:fs";
import { EventEmitter as cn } from "node:events";
import gt from "node:http";
import Ya from "node:https";
import rt from "node:zlib";
import ue, { PassThrough as ir, pipeline as nt } from "node:stream";
import { Buffer as j } from "node:buffer";
import { types as ar, deprecate as hr, promisify as Ga } from "node:util";
import { isIP as Za } from "node:net";
const dr = class dr extends cn {
  constructor() {
    super(...arguments);
    F(this, "status", "disconnected");
    F(this, "creds", null);
    F(this, "timer", null);
    F(this, "rawCache", "");
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
    for (const n of dr.FILES)
      try {
        return Va.readFileSync(n, "utf8");
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
F(dr, "FILES", [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile"
]);
let un = dr;
function Ja(a) {
  if (!/^data:/i.test(a))
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  a = a.replace(/\r?\n/g, "");
  const o = a.indexOf(",");
  if (o === -1 || o <= 4)
    throw new TypeError("malformed data: URI");
  const n = a.substring(5, o).split(";");
  let s = "", u = !1;
  const h = n[0] || "text/plain";
  let c = h;
  for (let w = 1; w < n.length; w++)
    n[w] === "base64" ? u = !0 : n[w] && (c += `;${n[w]}`, n[w].indexOf("charset=") === 0 && (s = n[w].substring(8)));
  !n[0] && !s.length && (c += ";charset=US-ASCII", s = "US-ASCII");
  const S = u ? "base64" : "ascii", T = unescape(a.substring(o + 1)), b = Buffer.from(T, S);
  return b.type = h, b.typeFull = c, b.charset = s, b;
}
var rn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, rr = { exports: {} };
/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */
var zo;
function Ka() {
  return zo || (zo = 1, function(a, o) {
    (function(n, s) {
      s(o);
    })(rn, function(n) {
      function s() {
      }
      function u(e) {
        return typeof e == "object" && e !== null || typeof e == "function";
      }
      const h = s;
      function c(e, t) {
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
      function V(e, t) {
        _(e, t);
      }
      function I(e, t) {
        _(e, void 0, t);
      }
      function O(e, t, r) {
        return k(e, t, r);
      }
      function Q(e) {
        k(e, void 0, h);
      }
      let fe = (e) => {
        if (typeof queueMicrotask == "function")
          fe = queueMicrotask;
        else {
          const t = g(void 0);
          fe = (r) => k(t, r);
        }
        return fe(e);
      };
      function q(e, t, r) {
        if (typeof e != "function")
          throw new TypeError("Argument is not a function");
        return Function.prototype.apply.call(e, t, r);
      }
      function z(e, t, r) {
        try {
          return g(q(e, t, r));
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
          const f = t._elements, d = f[i];
          return l === M && (r = t._next, l = 0), --this._size, this._cursor = l, t !== r && (this._front = r), f[i] = void 0, d;
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
      const Tt = Symbol("[[AbortSteps]]"), pn = Symbol("[[ErrorSteps]]"), pr = Symbol("[[CancelSteps]]"), br = Symbol("[[PullSteps]]"), yr = Symbol("[[ReleaseSteps]]");
      function bn(e, t) {
        e._ownerReadableStream = t, t._reader = e, t._state === "readable" ? _r(e) : t._state === "closed" ? Qo(e) : yn(e, t._storedError);
      }
      function gr(e, t) {
        const r = e._ownerReadableStream;
        return te(r, t);
      }
      function de(e) {
        const t = e._ownerReadableStream;
        t._state === "readable" ? Sr(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : Yo(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t._readableStreamController[yr](), t._reader = void 0, e._ownerReadableStream = void 0;
      }
      function Pt(e) {
        return new TypeError("Cannot " + e + " a stream using a released reader");
      }
      function _r(e) {
        e._closedPromise = w((t, r) => {
          e._closedPromise_resolve = t, e._closedPromise_reject = r;
        });
      }
      function yn(e, t) {
        _r(e), Sr(e, t);
      }
      function Qo(e) {
        _r(e), gn(e);
      }
      function Sr(e, t) {
        e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
      }
      function Yo(e, t) {
        yn(e, t);
      }
      function gn(e) {
        e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
      }
      const _n = Number.isFinite || function(e) {
        return typeof e == "number" && isFinite(e);
      }, Go = Math.trunc || function(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e);
      };
      function Zo(e) {
        return typeof e == "object" || typeof e == "function";
      }
      function ie(e, t) {
        if (e !== void 0 && !Zo(e))
          throw new TypeError(`${t} is not an object.`);
      }
      function Z(e, t) {
        if (typeof e != "function")
          throw new TypeError(`${t} is not a function.`);
      }
      function Jo(e) {
        return typeof e == "object" && e !== null || typeof e == "function";
      }
      function Sn(e, t) {
        if (!Jo(e))
          throw new TypeError(`${t} is not an object.`);
      }
      function ce(e, t, r) {
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
      function wn(e) {
        return e === 0 ? 0 : e;
      }
      function Ko(e) {
        return wn(Go(e));
      }
      function Cr(e, t) {
        const i = Number.MAX_SAFE_INTEGER;
        let l = Number(e);
        if (l = wn(l), !_n(l))
          throw new TypeError(`${t} is not a finite number`);
        if (l = Ko(l), l < 0 || l > i)
          throw new TypeError(`${t} is outside the accepted range of 0 to ${i}, inclusive`);
        return !_n(l) || l === 0 ? 0 : l;
      }
      function Tr(e, t) {
        if (!ve(e))
          throw new TypeError(`${t} is not a ReadableStream.`);
      }
      function xe(e) {
        return new we(e);
      }
      function Rn(e, t) {
        e._reader._readRequests.push(t);
      }
      function Pr(e, t, r) {
        const l = e._reader._readRequests.shift();
        r ? l._closeSteps() : l._chunkSteps(t);
      }
      function Et(e) {
        return e._reader._readRequests.length;
      }
      function Cn(e) {
        const t = e._reader;
        return !(t === void 0 || !Re(t));
      }
      class we {
        constructor(t) {
          if (ce(t, 1, "ReadableStreamDefaultReader"), Tr(t, "First parameter"), ke(t))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          bn(this, t), this._readRequests = new U();
        }
        /**
         * Returns a promise that will be fulfilled when the stream becomes closed,
         * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
         */
        get closed() {
          return Re(this) ? this._closedPromise : m(vt("closed"));
        }
        /**
         * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
         */
        cancel(t = void 0) {
          return Re(this) ? this._ownerReadableStream === void 0 ? m(Pt("cancel")) : gr(this, t) : m(vt("cancel"));
        }
        /**
         * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
         *
         * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
         */
        read() {
          if (!Re(this))
            return m(vt("read"));
          if (this._ownerReadableStream === void 0)
            return m(Pt("read from"));
          let t, r;
          const i = w((f, d) => {
            t = f, r = d;
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
          if (!Re(this))
            throw vt("releaseLock");
          this._ownerReadableStream !== void 0 && Xo(this);
        }
      }
      Object.defineProperties(we.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), c(we.prototype.cancel, "cancel"), c(we.prototype.read, "read"), c(we.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(we.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultReader",
        configurable: !0
      });
      function Re(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readRequests") ? !1 : e instanceof we;
      }
      function at(e, t) {
        const r = e._ownerReadableStream;
        r._disturbed = !0, r._state === "closed" ? t._closeSteps() : r._state === "errored" ? t._errorSteps(r._storedError) : r._readableStreamController[br](t);
      }
      function Xo(e) {
        de(e);
        const t = new TypeError("Reader was released");
        Tn(e, t);
      }
      function Tn(e, t) {
        const r = e._readRequests;
        e._readRequests = new U(), r.forEach((i) => {
          i._errorSteps(t);
        });
      }
      function vt(e) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`);
      }
      const ei = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class Pn {
        constructor(t, r) {
          this._ongoingPromise = void 0, this._isFinished = !1, this._reader = t, this._preventCancel = r;
        }
        next() {
          const t = () => this._nextSteps();
          return this._ongoingPromise = this._ongoingPromise ? O(this._ongoingPromise, t, t) : t(), this._ongoingPromise;
        }
        return(t) {
          const r = () => this._returnSteps(t);
          return this._ongoingPromise ? O(this._ongoingPromise, r, r) : r();
        }
        _nextSteps() {
          if (this._isFinished)
            return Promise.resolve({ value: void 0, done: !0 });
          const t = this._reader;
          let r, i;
          const l = w((d, p) => {
            r = d, i = p;
          });
          return at(t, {
            _chunkSteps: (d) => {
              this._ongoingPromise = void 0, fe(() => r({ value: d, done: !1 }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0, this._isFinished = !0, de(t), r({ value: void 0, done: !0 });
            },
            _errorSteps: (d) => {
              this._ongoingPromise = void 0, this._isFinished = !0, de(t), i(d);
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
            return de(r), O(i, () => ({ value: t, done: !0 }));
          }
          return de(r), g({ value: t, done: !0 });
        }
      }
      const En = {
        next() {
          return vn(this) ? this._asyncIteratorImpl.next() : m(kn("next"));
        },
        return(e) {
          return vn(this) ? this._asyncIteratorImpl.return(e) : m(kn("return"));
        }
      };
      Object.setPrototypeOf(En, ei);
      function ti(e, t) {
        const r = xe(e), i = new Pn(r, t), l = Object.create(En);
        return l._asyncIteratorImpl = i, l;
      }
      function vn(e) {
        if (!u(e) || !Object.prototype.hasOwnProperty.call(e, "_asyncIteratorImpl"))
          return !1;
        try {
          return e._asyncIteratorImpl instanceof Pn;
        } catch {
          return !1;
        }
      }
      function kn(e) {
        return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`);
      }
      const An = Number.isNaN || function(e) {
        return e !== e;
      };
      var Er, vr, kr;
      function st(e) {
        return e.slice();
      }
      function Bn(e, t, r, i, l) {
        new Uint8Array(e).set(new Uint8Array(r, i, l), t);
      }
      let he = (e) => (typeof e.transfer == "function" ? he = (t) => t.transfer() : typeof structuredClone == "function" ? he = (t) => structuredClone(t, { transfer: [t] }) : he = (t) => t, he(e)), Ce = (e) => (typeof e.detached == "boolean" ? Ce = (t) => t.detached : Ce = (t) => t.byteLength === 0, Ce(e));
      function Wn(e, t, r) {
        if (e.slice)
          return e.slice(t, r);
        const i = r - t, l = new ArrayBuffer(i);
        return Bn(l, 0, e, t, i), l;
      }
      function kt(e, t) {
        const r = e[t];
        if (r != null) {
          if (typeof r != "function")
            throw new TypeError(`${String(t)} is not a function`);
          return r;
        }
      }
      function ri(e) {
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
              const f = kt(e, Symbol.iterator), d = qn(e, "sync", f);
              return ri(d);
            }
          } else
            r = kt(e, Symbol.iterator);
        if (r === void 0)
          throw new TypeError("The object is not iterable");
        const i = q(r, e, []);
        if (!u(i))
          throw new TypeError("The iterator method must return an object");
        const l = i.next;
        return { iterator: i, nextMethod: l, done: !1 };
      }
      function ni(e) {
        const t = q(e.nextMethod, e.iterator, []);
        if (!u(t))
          throw new TypeError("The iterator.next() method must return an object");
        return t;
      }
      function oi(e) {
        return !!e.done;
      }
      function ii(e) {
        return e.value;
      }
      function ai(e) {
        return !(typeof e != "number" || An(e) || e < 0);
      }
      function In(e) {
        const t = Wn(e.buffer, e.byteOffset, e.byteOffset + e.byteLength);
        return new Uint8Array(t);
      }
      function Br(e) {
        const t = e._queue.shift();
        return e._queueTotalSize -= t.size, e._queueTotalSize < 0 && (e._queueTotalSize = 0), t.value;
      }
      function Wr(e, t, r) {
        if (!ai(r) || r === 1 / 0)
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        e._queue.push({ value: t, size: r }), e._queueTotalSize += r;
      }
      function si(e) {
        return e._queue.peek().value;
      }
      function Te(e) {
        e._queue = new U(), e._queueTotalSize = 0;
      }
      function On(e) {
        return e === DataView;
      }
      function li(e) {
        return On(e.constructor);
      }
      function ui(e) {
        return On(e) ? 1 : e.BYTES_PER_ELEMENT;
      }
      class Oe {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        /**
         * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
         */
        get view() {
          if (!qr(this))
            throw $r("view");
          return this._view;
        }
        respond(t) {
          if (!qr(this))
            throw $r("respond");
          if (ce(t, 1, "respond"), t = Cr(t, "First parameter"), this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Ce(this._view.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          qt(this._associatedReadableByteStreamController, t);
        }
        respondWithNewView(t) {
          if (!qr(this))
            throw $r("respondWithNewView");
          if (ce(t, 1, "respondWithNewView"), !ArrayBuffer.isView(t))
            throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0)
            throw new TypeError("This BYOB request has been invalidated");
          if (Ce(t.buffer))
            throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          It(this._associatedReadableByteStreamController, t);
        }
      }
      Object.defineProperties(Oe.prototype, {
        respond: { enumerable: !0 },
        respondWithNewView: { enumerable: !0 },
        view: { enumerable: !0 }
      }), c(Oe.prototype.respond, "respond"), c(Oe.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Oe.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBRequest",
        configurable: !0
      });
      class me {
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
          return xn(this);
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
          if (ce(t, 1, "enqueue"), !ArrayBuffer.isView(t))
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
          Wt(this, t);
        }
        /**
         * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
         */
        error(t = void 0) {
          if (!ze(this))
            throw ut("error");
          J(this, t);
        }
        /** @internal */
        [pr](t) {
          zn(this), Te(this);
          const r = this._cancelAlgorithm(t);
          return Bt(this), r;
        }
        /** @internal */
        [br](t) {
          const r = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            Nn(this, t);
            return;
          }
          const i = this._autoAllocateChunkSize;
          if (i !== void 0) {
            let l;
            try {
              l = new ArrayBuffer(i);
            } catch (d) {
              t._errorSteps(d);
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
          Rn(r, t), Fe(this);
        }
        /** @internal */
        [yr]() {
          if (this._pendingPullIntos.length > 0) {
            const t = this._pendingPullIntos.peek();
            t.readerType = "none", this._pendingPullIntos = new U(), this._pendingPullIntos.push(t);
          }
        }
      }
      Object.defineProperties(me.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        byobRequest: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), c(me.prototype.close, "close"), c(me.prototype.enqueue, "enqueue"), c(me.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(me.prototype, Symbol.toStringTag, {
        value: "ReadableByteStreamController",
        configurable: !0
      });
      function ze(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableByteStream") ? !1 : e instanceof me;
      }
      function qr(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_associatedReadableByteStreamController") ? !1 : e instanceof Oe;
      }
      function Fe(e) {
        if (!mi(e))
          return;
        if (e._pulling) {
          e._pullAgain = !0;
          return;
        }
        e._pulling = !0;
        const r = e._pullAlgorithm();
        _(r, () => (e._pulling = !1, e._pullAgain && (e._pullAgain = !1, Fe(e)), null), (i) => (J(e, i), null));
      }
      function zn(e) {
        Or(e), e._pendingPullIntos = new U();
      }
      function Ir(e, t) {
        let r = !1;
        e._state === "closed" && (r = !0);
        const i = Fn(t);
        t.readerType === "default" ? Pr(e, i, r) : Si(e, i, r);
      }
      function Fn(e) {
        const t = e.bytesFilled, r = e.elementSize;
        return new e.viewConstructor(e.buffer, e.byteOffset, t / r);
      }
      function At(e, t, r, i) {
        e._queue.push({ buffer: t, byteOffset: r, byteLength: i }), e._queueTotalSize += i;
      }
      function $n(e, t, r, i) {
        let l;
        try {
          l = Wn(t, r, r + i);
        } catch (f) {
          throw J(e, f), f;
        }
        At(e, l, 0, i);
      }
      function Ln(e, t) {
        t.bytesFilled > 0 && $n(e, t.buffer, t.byteOffset, t.bytesFilled), He(e);
      }
      function Dn(e, t) {
        const r = Math.min(e._queueTotalSize, t.byteLength - t.bytesFilled), i = t.bytesFilled + r;
        let l = r, f = !1;
        const d = i % t.elementSize, p = i - d;
        p >= t.minimumFill && (l = p - t.bytesFilled, f = !0);
        const C = e._queue;
        for (; l > 0; ) {
          const y = C.peek(), P = Math.min(l, y.byteLength), E = t.byteOffset + t.bytesFilled;
          Bn(t.buffer, E, y.buffer, y.byteOffset, P), y.byteLength === P ? C.shift() : (y.byteOffset += P, y.byteLength -= P), e._queueTotalSize -= P, jn(e, P, t), l -= P;
        }
        return f;
      }
      function jn(e, t, r) {
        r.bytesFilled += t;
      }
      function Mn(e) {
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
          Dn(e, t) && (He(e), Ir(e._controlledReadableByteStream, t));
        }
      }
      function fi(e) {
        const t = e._controlledReadableByteStream._reader;
        for (; t._readRequests.length > 0; ) {
          if (e._queueTotalSize === 0)
            return;
          const r = t._readRequests.shift();
          Nn(e, r);
        }
      }
      function di(e, t, r, i) {
        const l = e._controlledReadableByteStream, f = t.constructor, d = ui(f), { byteOffset: p, byteLength: C } = t, y = r * d;
        let P;
        try {
          P = he(t.buffer);
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
          elementSize: d,
          viewConstructor: f,
          readerType: "byob"
        };
        if (e._pendingPullIntos.length > 0) {
          e._pendingPullIntos.push(E), Qn(l, i);
          return;
        }
        if (l._state === "closed") {
          const A = new f(E.buffer, E.byteOffset, 0);
          i._closeSteps(A);
          return;
        }
        if (e._queueTotalSize > 0) {
          if (Dn(e, E)) {
            const A = Fn(E);
            Mn(e), i._chunkSteps(A);
            return;
          }
          if (e._closeRequested) {
            const A = new TypeError("Insufficient bytes to fill elements in the given buffer");
            J(e, A), i._errorSteps(A);
            return;
          }
        }
        e._pendingPullIntos.push(E), Qn(l, i), Fe(e);
      }
      function ci(e, t) {
        t.readerType === "none" && He(e);
        const r = e._controlledReadableByteStream;
        if (Lr(r))
          for (; Yn(r) > 0; ) {
            const i = He(e);
            Ir(r, i);
          }
      }
      function hi(e, t, r) {
        if (jn(e, t, r), r.readerType === "none") {
          Ln(e, r), zr(e);
          return;
        }
        if (r.bytesFilled < r.minimumFill)
          return;
        He(e);
        const i = r.bytesFilled % r.elementSize;
        if (i > 0) {
          const l = r.byteOffset + r.bytesFilled;
          $n(e, r.buffer, l - i, i);
        }
        r.bytesFilled -= i, Ir(e._controlledReadableByteStream, r), zr(e);
      }
      function Un(e, t) {
        const r = e._pendingPullIntos.peek();
        Or(e), e._controlledReadableByteStream._state === "closed" ? ci(e, r) : hi(e, t, r), Fe(e);
      }
      function He(e) {
        return e._pendingPullIntos.shift();
      }
      function mi(e) {
        const t = e._controlledReadableByteStream;
        return t._state !== "readable" || e._closeRequested || !e._started ? !1 : !!(Cn(t) && Et(t) > 0 || Lr(t) && Yn(t) > 0 || xn(e) > 0);
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
              throw J(e, i), i;
            }
          }
          Bt(e), pt(t);
        }
      }
      function Wt(e, t) {
        const r = e._controlledReadableByteStream;
        if (e._closeRequested || r._state !== "readable")
          return;
        const { buffer: i, byteOffset: l, byteLength: f } = t;
        if (Ce(i))
          throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const d = he(i);
        if (e._pendingPullIntos.length > 0) {
          const p = e._pendingPullIntos.peek();
          if (Ce(p.buffer))
            throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          Or(e), p.buffer = he(p.buffer), p.readerType === "none" && Ln(e, p);
        }
        if (Cn(r))
          if (fi(e), Et(r) === 0)
            At(e, d, l, f);
          else {
            e._pendingPullIntos.length > 0 && He(e);
            const p = new Uint8Array(d, l, f);
            Pr(r, p, !1);
          }
        else Lr(r) ? (At(e, d, l, f), zr(e)) : At(e, d, l, f);
        Fe(e);
      }
      function J(e, t) {
        const r = e._controlledReadableByteStream;
        r._state === "readable" && (zn(e), Te(e), Bt(e), _o(r, t));
      }
      function Nn(e, t) {
        const r = e._queue.shift();
        e._queueTotalSize -= r.byteLength, Mn(e);
        const i = new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
        t._chunkSteps(i);
      }
      function Fr(e) {
        if (e._byobRequest === null && e._pendingPullIntos.length > 0) {
          const t = e._pendingPullIntos.peek(), r = new Uint8Array(t.buffer, t.byteOffset + t.bytesFilled, t.byteLength - t.bytesFilled), i = Object.create(Oe.prototype);
          bi(i, e, r), e._byobRequest = i;
        }
        return e._byobRequest;
      }
      function xn(e) {
        const t = e._controlledReadableByteStream._state;
        return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
      }
      function qt(e, t) {
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
        r.buffer = he(r.buffer), Un(e, t);
      }
      function It(e, t) {
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
        r.buffer = he(t.buffer), Un(e, l);
      }
      function Hn(e, t, r, i, l, f, d) {
        t._controlledReadableByteStream = e, t._pullAgain = !1, t._pulling = !1, t._byobRequest = null, t._queue = t._queueTotalSize = void 0, Te(t), t._closeRequested = !1, t._started = !1, t._strategyHWM = f, t._pullAlgorithm = i, t._cancelAlgorithm = l, t._autoAllocateChunkSize = d, t._pendingPullIntos = new U(), e._readableStreamController = t;
        const p = r();
        _(g(p), () => (t._started = !0, Fe(t), null), (C) => (J(t, C), null));
      }
      function pi(e, t, r) {
        const i = Object.create(me.prototype);
        let l, f, d;
        t.start !== void 0 ? l = () => t.start(i) : l = () => {
        }, t.pull !== void 0 ? f = () => t.pull(i) : f = () => g(void 0), t.cancel !== void 0 ? d = (C) => t.cancel(C) : d = () => g(void 0);
        const p = t.autoAllocateChunkSize;
        if (p === 0)
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        Hn(e, i, l, f, d, r, p);
      }
      function bi(e, t, r) {
        e._associatedReadableByteStreamController = t, e._view = r;
      }
      function $r(e) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`);
      }
      function ut(e) {
        return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`);
      }
      function yi(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.mode;
        return {
          mode: r === void 0 ? void 0 : gi(r, `${t} has member 'mode' that`)
        };
      }
      function gi(e, t) {
        if (e = `${e}`, e !== "byob")
          throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return e;
      }
      function _i(e, t) {
        var r;
        ie(e, t);
        const i = (r = e == null ? void 0 : e.min) !== null && r !== void 0 ? r : 1;
        return {
          min: Cr(i, `${t} has member 'min' that`)
        };
      }
      function Vn(e) {
        return new Pe(e);
      }
      function Qn(e, t) {
        e._reader._readIntoRequests.push(t);
      }
      function Si(e, t, r) {
        const l = e._reader._readIntoRequests.shift();
        r ? l._closeSteps(t) : l._chunkSteps(t);
      }
      function Yn(e) {
        return e._reader._readIntoRequests.length;
      }
      function Lr(e) {
        const t = e._reader;
        return !(t === void 0 || !$e(t));
      }
      class Pe {
        constructor(t) {
          if (ce(t, 1, "ReadableStreamBYOBReader"), Tr(t, "First parameter"), ke(t))
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!ze(t._readableStreamController))
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          bn(this, t), this._readIntoRequests = new U();
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
          if (Ce(t.buffer))
            return m(new TypeError("view's buffer has been detached"));
          let i;
          try {
            i = _i(r, "options");
          } catch (y) {
            return m(y);
          }
          const l = i.min;
          if (l === 0)
            return m(new TypeError("options.min must be greater than 0"));
          if (li(t)) {
            if (l > t.byteLength)
              return m(new RangeError("options.min must be less than or equal to view's byteLength"));
          } else if (l > t.length)
            return m(new RangeError("options.min must be less than or equal to view's length"));
          if (this._ownerReadableStream === void 0)
            return m(Pt("read from"));
          let f, d;
          const p = w((y, P) => {
            f = y, d = P;
          });
          return Gn(this, t, l, {
            _chunkSteps: (y) => f({ value: y, done: !1 }),
            _closeSteps: (y) => f({ value: y, done: !0 }),
            _errorSteps: (y) => d(y)
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
          this._ownerReadableStream !== void 0 && wi(this);
        }
      }
      Object.defineProperties(Pe.prototype, {
        cancel: { enumerable: !0 },
        read: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        closed: { enumerable: !0 }
      }), c(Pe.prototype.cancel, "cancel"), c(Pe.prototype.read, "read"), c(Pe.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Pe.prototype, Symbol.toStringTag, {
        value: "ReadableStreamBYOBReader",
        configurable: !0
      });
      function $e(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readIntoRequests") ? !1 : e instanceof Pe;
      }
      function Gn(e, t, r, i) {
        const l = e._ownerReadableStream;
        l._disturbed = !0, l._state === "errored" ? i._errorSteps(l._storedError) : di(l._readableStreamController, t, r, i);
      }
      function wi(e) {
        de(e);
        const t = new TypeError("Reader was released");
        Zn(e, t);
      }
      function Zn(e, t) {
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
        if (An(r) || r < 0)
          throw new RangeError("Invalid highWaterMark");
        return r;
      }
      function zt(e) {
        const { size: t } = e;
        return t || (() => 1);
      }
      function Ft(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.highWaterMark, i = e == null ? void 0 : e.size;
        return {
          highWaterMark: r === void 0 ? void 0 : Rr(r),
          size: i === void 0 ? void 0 : Ri(i, `${t} has member 'size' that`)
        };
      }
      function Ri(e, t) {
        return Z(e, t), (r) => Rr(e(r));
      }
      function Ci(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.abort, i = e == null ? void 0 : e.close, l = e == null ? void 0 : e.start, f = e == null ? void 0 : e.type, d = e == null ? void 0 : e.write;
        return {
          abort: r === void 0 ? void 0 : Ti(r, e, `${t} has member 'abort' that`),
          close: i === void 0 ? void 0 : Pi(i, e, `${t} has member 'close' that`),
          start: l === void 0 ? void 0 : Ei(l, e, `${t} has member 'start' that`),
          write: d === void 0 ? void 0 : vi(d, e, `${t} has member 'write' that`),
          type: f
        };
      }
      function Ti(e, t, r) {
        return Z(e, r), (i) => z(e, t, [i]);
      }
      function Pi(e, t, r) {
        return Z(e, r), () => z(e, t, []);
      }
      function Ei(e, t, r) {
        return Z(e, r), (i) => q(e, t, [i]);
      }
      function vi(e, t, r) {
        return Z(e, r), (i, l) => z(e, t, [i, l]);
      }
      function Jn(e, t) {
        if (!Ve(e))
          throw new TypeError(`${t} is not a WritableStream.`);
      }
      function ki(e) {
        if (typeof e != "object" || e === null)
          return !1;
        try {
          return typeof e.aborted == "boolean";
        } catch {
          return !1;
        }
      }
      const Ai = typeof AbortController == "function";
      function Bi() {
        if (Ai)
          return new AbortController();
      }
      class Ee {
        constructor(t = {}, r = {}) {
          t === void 0 ? t = null : Sn(t, "First parameter");
          const i = Ft(r, "Second parameter"), l = Ci(t, "First parameter");
          if (Xn(this), l.type !== void 0)
            throw new RangeError("Invalid type is specified");
          const d = zt(i), p = ft(i, 1);
          xi(this, l, p, d);
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
          return Ve(this) ? Qe(this) ? m(new TypeError("Cannot close a stream that already has a writer")) : ae(this) ? m(new TypeError("Cannot close an already-closing stream")) : eo(this) : m(Mt("close"));
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
          return Kn(this);
        }
      }
      Object.defineProperties(Ee.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        getWriter: { enumerable: !0 },
        locked: { enumerable: !0 }
      }), c(Ee.prototype.abort, "abort"), c(Ee.prototype.close, "close"), c(Ee.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ee.prototype, Symbol.toStringTag, {
        value: "WritableStream",
        configurable: !0
      });
      function Kn(e) {
        return new pe(e);
      }
      function Wi(e, t, r, i, l = 1, f = () => 1) {
        const d = Object.create(Ee.prototype);
        Xn(d);
        const p = Object.create(Ye.prototype);
        return ao(d, p, e, t, r, i, l, f), d;
      }
      function Xn(e) {
        e._state = "writable", e._storedError = void 0, e._writer = void 0, e._writableStreamController = void 0, e._writeRequests = new U(), e._inFlightWriteRequest = void 0, e._closeRequest = void 0, e._inFlightCloseRequest = void 0, e._pendingAbortRequest = void 0, e._backpressure = !1;
      }
      function Ve(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_writableStreamController") ? !1 : e instanceof Ee;
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
        const f = w((d, p) => {
          e._pendingAbortRequest = {
            _promise: void 0,
            _resolve: d,
            _reject: p,
            _reason: t,
            _wasAlreadyErroring: l
          };
        });
        return e._pendingAbortRequest._promise = f, l || jr(e, t), f;
      }
      function eo(e) {
        const t = e._state;
        if (t === "closed" || t === "errored")
          return m(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));
        const r = w((l, f) => {
          const d = {
            _resolve: l,
            _reject: f
          };
          e._closeRequest = d;
        }), i = e._writer;
        return i !== void 0 && e._backpressure && t === "writable" && Yr(i), Hi(e._writableStreamController), r;
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
        i !== void 0 && ro(i, t), !$i(e) && r._started && Mr(e);
      }
      function Mr(e) {
        e._state = "errored", e._writableStreamController[pn]();
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
      function Ii(e) {
        e._inFlightWriteRequest._resolve(void 0), e._inFlightWriteRequest = void 0;
      }
      function Oi(e, t) {
        e._inFlightWriteRequest._reject(t), e._inFlightWriteRequest = void 0, Dr(e, t);
      }
      function zi(e) {
        e._inFlightCloseRequest._resolve(void 0), e._inFlightCloseRequest = void 0, e._state === "erroring" && (e._storedError = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._resolve(), e._pendingAbortRequest = void 0)), e._state = "closed";
        const r = e._writer;
        r !== void 0 && fo(r);
      }
      function Fi(e, t) {
        e._inFlightCloseRequest._reject(t), e._inFlightCloseRequest = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._reject(t), e._pendingAbortRequest = void 0), Dr(e, t);
      }
      function ae(e) {
        return !(e._closeRequest === void 0 && e._inFlightCloseRequest === void 0);
      }
      function $i(e) {
        return !(e._inFlightWriteRequest === void 0 && e._inFlightCloseRequest === void 0);
      }
      function Li(e) {
        e._inFlightCloseRequest = e._closeRequest, e._closeRequest = void 0;
      }
      function Di(e) {
        e._inFlightWriteRequest = e._writeRequests.shift();
      }
      function Lt(e) {
        e._closeRequest !== void 0 && (e._closeRequest._reject(e._storedError), e._closeRequest = void 0);
        const t = e._writer;
        t !== void 0 && Vr(t, e._storedError);
      }
      function Ur(e, t) {
        const r = e._writer;
        r !== void 0 && t !== e._backpressure && (t ? Ki(r) : Yr(r)), e._backpressure = t;
      }
      class pe {
        constructor(t) {
          if (ce(t, 1, "WritableStreamDefaultWriter"), Jn(t, "First parameter"), Qe(t))
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = t, t._writer = this;
          const r = t._state;
          if (r === "writable")
            !ae(t) && t._backpressure ? Nt(this) : co(this), Ut(this);
          else if (r === "erroring")
            Qr(this, t._storedError), Ut(this);
          else if (r === "closed")
            co(this), Zi(this);
          else {
            const i = t._storedError;
            Qr(this, i), uo(this, i);
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
            throw ct("desiredSize");
          return Ni(this);
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
          return Le(this) ? this._ownerWritableStream === void 0 ? m(ct("abort")) : ji(this, t) : m(De("abort"));
        }
        /**
         * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
         */
        close() {
          if (!Le(this))
            return m(De("close"));
          const t = this._ownerWritableStream;
          return t === void 0 ? m(ct("close")) : ae(t) ? m(new TypeError("Cannot close an already-closing stream")) : to(this);
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
          this._ownerWritableStream !== void 0 && no(this);
        }
        write(t = void 0) {
          return Le(this) ? this._ownerWritableStream === void 0 ? m(ct("write to")) : oo(this, t) : m(De("write"));
        }
      }
      Object.defineProperties(pe.prototype, {
        abort: { enumerable: !0 },
        close: { enumerable: !0 },
        releaseLock: { enumerable: !0 },
        write: { enumerable: !0 },
        closed: { enumerable: !0 },
        desiredSize: { enumerable: !0 },
        ready: { enumerable: !0 }
      }), c(pe.prototype.abort, "abort"), c(pe.prototype.close, "close"), c(pe.prototype.releaseLock, "releaseLock"), c(pe.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, {
        value: "WritableStreamDefaultWriter",
        configurable: !0
      });
      function Le(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_ownerWritableStream") ? !1 : e instanceof pe;
      }
      function ji(e, t) {
        const r = e._ownerWritableStream;
        return $t(r, t);
      }
      function to(e) {
        const t = e._ownerWritableStream;
        return eo(t);
      }
      function Mi(e) {
        const t = e._ownerWritableStream, r = t._state;
        return ae(t) || r === "closed" ? g(void 0) : r === "errored" ? m(t._storedError) : to(e);
      }
      function Ui(e, t) {
        e._closedPromiseState === "pending" ? Vr(e, t) : Ji(e, t);
      }
      function ro(e, t) {
        e._readyPromiseState === "pending" ? ho(e, t) : Xi(e, t);
      }
      function Ni(e) {
        const t = e._ownerWritableStream, r = t._state;
        return r === "errored" || r === "erroring" ? null : r === "closed" ? 0 : so(t._writableStreamController);
      }
      function no(e) {
        const t = e._ownerWritableStream, r = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        ro(e, r), Ui(e, r), t._writer = void 0, e._ownerWritableStream = void 0;
      }
      function oo(e, t) {
        const r = e._ownerWritableStream, i = r._writableStreamController, l = Vi(i, t);
        if (r !== e._ownerWritableStream)
          return m(ct("write to"));
        const f = r._state;
        if (f === "errored")
          return m(r._storedError);
        if (ae(r) || f === "closed")
          return m(new TypeError("The stream is closing or closed and cannot be written to"));
        if (f === "erroring")
          return m(r._storedError);
        const d = qi(r);
        return Qi(i, t, l), d;
      }
      const io = {};
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
          this._controlledWritableStream._state === "writable" && lo(this, t);
        }
        /** @internal */
        [Tt](t) {
          const r = this._abortAlgorithm(t);
          return Dt(this), r;
        }
        /** @internal */
        [pn]() {
          Te(this);
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
      function ao(e, t, r, i, l, f, d, p) {
        t._controlledWritableStream = e, e._writableStreamController = t, t._queue = void 0, t._queueTotalSize = void 0, Te(t), t._abortReason = void 0, t._abortController = Bi(), t._started = !1, t._strategySizeAlgorithm = p, t._strategyHWM = d, t._writeAlgorithm = i, t._closeAlgorithm = l, t._abortAlgorithm = f;
        const C = xr(t);
        Ur(e, C);
        const y = r(), P = g(y);
        _(P, () => (t._started = !0, jt(t), null), (E) => (t._started = !0, Dr(e, E), null));
      }
      function xi(e, t, r, i) {
        const l = Object.create(Ye.prototype);
        let f, d, p, C;
        t.start !== void 0 ? f = () => t.start(l) : f = () => {
        }, t.write !== void 0 ? d = (y) => t.write(y, l) : d = () => g(void 0), t.close !== void 0 ? p = () => t.close() : p = () => g(void 0), t.abort !== void 0 ? C = (y) => t.abort(y) : C = () => g(void 0), ao(e, l, f, d, p, C, r, i);
      }
      function Dt(e) {
        e._writeAlgorithm = void 0, e._closeAlgorithm = void 0, e._abortAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
      }
      function Hi(e) {
        Wr(e, io, 0), jt(e);
      }
      function Vi(e, t) {
        try {
          return e._strategySizeAlgorithm(t);
        } catch (r) {
          return dt(e, r), 1;
        }
      }
      function so(e) {
        return e._strategyHWM - e._queueTotalSize;
      }
      function Qi(e, t, r) {
        try {
          Wr(e, t, r);
        } catch (l) {
          dt(e, l);
          return;
        }
        const i = e._controlledWritableStream;
        if (!ae(i) && i._state === "writable") {
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
        const i = si(e);
        i === io ? Yi(e) : Gi(e, i);
      }
      function dt(e, t) {
        e._controlledWritableStream._state === "writable" && lo(e, t);
      }
      function Yi(e) {
        const t = e._controlledWritableStream;
        Li(t), Br(e);
        const r = e._closeAlgorithm();
        Dt(e), _(r, () => (zi(t), null), (i) => (Fi(t, i), null));
      }
      function Gi(e, t) {
        const r = e._controlledWritableStream;
        Di(r);
        const i = e._writeAlgorithm(t);
        _(i, () => {
          Ii(r);
          const l = r._state;
          if (Br(e), !ae(r) && l === "writable") {
            const f = xr(e);
            Ur(r, f);
          }
          return jt(e), null;
        }, (l) => (r._state === "writable" && Dt(e), Oi(r, l), null));
      }
      function xr(e) {
        return so(e) <= 0;
      }
      function lo(e, t) {
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
      function ct(e) {
        return new TypeError("Cannot " + e + " a stream using a released writer");
      }
      function Ut(e) {
        e._closedPromise = w((t, r) => {
          e._closedPromise_resolve = t, e._closedPromise_reject = r, e._closedPromiseState = "pending";
        });
      }
      function uo(e, t) {
        Ut(e), Vr(e, t);
      }
      function Zi(e) {
        Ut(e), fo(e);
      }
      function Vr(e, t) {
        e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "rejected");
      }
      function Ji(e, t) {
        uo(e, t);
      }
      function fo(e) {
        e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "resolved");
      }
      function Nt(e) {
        e._readyPromise = w((t, r) => {
          e._readyPromise_resolve = t, e._readyPromise_reject = r;
        }), e._readyPromiseState = "pending";
      }
      function Qr(e, t) {
        Nt(e), ho(e, t);
      }
      function co(e) {
        Nt(e), Yr(e);
      }
      function ho(e, t) {
        e._readyPromise_reject !== void 0 && (Q(e._readyPromise), e._readyPromise_reject(t), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "rejected");
      }
      function Ki(e) {
        Nt(e);
      }
      function Xi(e, t) {
        Qr(e, t);
      }
      function Yr(e) {
        e._readyPromise_resolve !== void 0 && (e._readyPromise_resolve(void 0), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "fulfilled");
      }
      function ea() {
        if (typeof globalThis < "u")
          return globalThis;
        if (typeof self < "u")
          return self;
        if (typeof rn < "u")
          return rn;
      }
      const Gr = ea();
      function ta(e) {
        if (!(typeof e == "function" || typeof e == "object") || e.name !== "DOMException")
          return !1;
        try {
          return new e(), !0;
        } catch {
          return !1;
        }
      }
      function ra() {
        const e = Gr == null ? void 0 : Gr.DOMException;
        return ta(e) ? e : void 0;
      }
      function na() {
        const e = function(r, i) {
          this.message = r || "", this.name = i || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        };
        return c(e, "DOMException"), e.prototype = Object.create(Error.prototype), Object.defineProperty(e.prototype, "constructor", { value: e, writable: !0, configurable: !0 }), e;
      }
      const oa = ra() || na();
      function mo(e, t, r, i, l, f) {
        const d = xe(e), p = Kn(t);
        e._disturbed = !0;
        let C = !1, y = g(void 0);
        return w((P, E) => {
          let A;
          if (f !== void 0) {
            if (A = () => {
              const R = f.reason !== void 0 ? f.reason : new oa("Aborted", "AbortError"), v = [];
              i || v.push(() => t._state === "writable" ? $t(t, R) : g(void 0)), l || v.push(() => e._state === "readable" ? te(e, R) : g(void 0)), x(() => Promise.all(v.map((B) => B())), !0, R);
            }, f.aborted) {
              A();
              return;
            }
            f.addEventListener("abort", A);
          }
          function re() {
            return w((R, v) => {
              function B(Y) {
                Y ? R() : k(Ke(), B, v);
              }
              B(!1);
            });
          }
          function Ke() {
            return C ? g(!0) : k(p._readyPromise, () => w((R, v) => {
              at(d, {
                _chunkSteps: (B) => {
                  y = k(oo(p, B), void 0, s), R(!1);
                },
                _closeSteps: () => R(!0),
                _errorSteps: v
              });
            }));
          }
          if (ye(e, d._closedPromise, (R) => (i ? K(!0, R) : x(() => $t(t, R), !0, R), null)), ye(t, p._closedPromise, (R) => (l ? K(!0, R) : x(() => te(e, R), !0, R), null)), N(e, d._closedPromise, () => (r ? K() : x(() => Mi(p)), null)), ae(t) || t._state === "closed") {
            const R = new TypeError("the destination writable stream closed before all data could be piped to it");
            l ? K(!0, R) : x(() => te(e, R), !0, R);
          }
          Q(re());
          function Be() {
            const R = y;
            return k(y, () => R !== y ? Be() : void 0);
          }
          function ye(R, v, B) {
            R._state === "errored" ? B(R._storedError) : I(v, B);
          }
          function N(R, v, B) {
            R._state === "closed" ? B() : V(v, B);
          }
          function x(R, v, B) {
            if (C)
              return;
            C = !0, t._state === "writable" && !ae(t) ? V(Be(), Y) : Y();
            function Y() {
              return _(R(), () => ge(v, B), (Xe) => ge(!0, Xe)), null;
            }
          }
          function K(R, v) {
            C || (C = !0, t._state === "writable" && !ae(t) ? V(Be(), () => ge(R, v)) : ge(R, v));
          }
          function ge(R, v) {
            return no(p), de(d), f !== void 0 && f.removeEventListener("abort", A), R ? E(v) : P(void 0), null;
          }
        });
      }
      class be {
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
          ee(this, t);
        }
        /** @internal */
        [pr](t) {
          Te(this);
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
            Rn(r, t), ht(this);
        }
        /** @internal */
        [yr]() {
        }
      }
      Object.defineProperties(be.prototype, {
        close: { enumerable: !0 },
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), c(be.prototype.close, "close"), c(be.prototype.enqueue, "enqueue"), c(be.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(be.prototype, Symbol.toStringTag, {
        value: "ReadableStreamDefaultController",
        configurable: !0
      });
      function xt(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableStream") ? !1 : e instanceof be;
      }
      function ht(e) {
        if (!po(e))
          return;
        if (e._pulling) {
          e._pullAgain = !0;
          return;
        }
        e._pulling = !0;
        const r = e._pullAlgorithm();
        _(r, () => (e._pulling = !1, e._pullAgain && (e._pullAgain = !1, ht(e)), null), (i) => (ee(e, i), null));
      }
      function po(e) {
        const t = e._controlledReadableStream;
        return !Ze(e) || !e._started ? !1 : !!(ke(t) && Et(t) > 0 || Zr(e) > 0);
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
        if (ke(r) && Et(r) > 0)
          Pr(r, t, !1);
        else {
          let i;
          try {
            i = e._strategySizeAlgorithm(t);
          } catch (l) {
            throw ee(e, l), l;
          }
          try {
            Wr(e, t, i);
          } catch (l) {
            throw ee(e, l), l;
          }
        }
        ht(e);
      }
      function ee(e, t) {
        const r = e._controlledReadableStream;
        r._state === "readable" && (Te(e), Ht(e), _o(r, t));
      }
      function Zr(e) {
        const t = e._controlledReadableStream._state;
        return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
      }
      function ia(e) {
        return !po(e);
      }
      function Ze(e) {
        const t = e._controlledReadableStream._state;
        return !e._closeRequested && t === "readable";
      }
      function bo(e, t, r, i, l, f, d) {
        t._controlledReadableStream = e, t._queue = void 0, t._queueTotalSize = void 0, Te(t), t._started = !1, t._closeRequested = !1, t._pullAgain = !1, t._pulling = !1, t._strategySizeAlgorithm = d, t._strategyHWM = f, t._pullAlgorithm = i, t._cancelAlgorithm = l, e._readableStreamController = t;
        const p = r();
        _(g(p), () => (t._started = !0, ht(t), null), (C) => (ee(t, C), null));
      }
      function aa(e, t, r, i) {
        const l = Object.create(be.prototype);
        let f, d, p;
        t.start !== void 0 ? f = () => t.start(l) : f = () => {
        }, t.pull !== void 0 ? d = () => t.pull(l) : d = () => g(void 0), t.cancel !== void 0 ? p = (C) => t.cancel(C) : p = () => g(void 0), bo(e, l, f, d, p, r, i);
      }
      function Vt(e) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`);
      }
      function sa(e, t) {
        return ze(e._readableStreamController) ? ua(e) : la(e);
      }
      function la(e, t) {
        const r = xe(e);
        let i = !1, l = !1, f = !1, d = !1, p, C, y, P, E;
        const A = w((N) => {
          E = N;
        });
        function re() {
          return i ? (l = !0, g(void 0)) : (i = !0, at(r, {
            _chunkSteps: (x) => {
              fe(() => {
                l = !1;
                const K = x, ge = x;
                f || Ge(y._readableStreamController, K), d || Ge(P._readableStreamController, ge), i = !1, l && re();
              });
            },
            _closeSteps: () => {
              i = !1, f || je(y._readableStreamController), d || je(P._readableStreamController), (!f || !d) && E(void 0);
            },
            _errorSteps: () => {
              i = !1;
            }
          }), g(void 0));
        }
        function Ke(N) {
          if (f = !0, p = N, d) {
            const x = st([p, C]), K = te(e, x);
            E(K);
          }
          return A;
        }
        function Be(N) {
          if (d = !0, C = N, f) {
            const x = st([p, C]), K = te(e, x);
            E(K);
          }
          return A;
        }
        function ye() {
        }
        return y = mt(ye, re, Ke), P = mt(ye, re, Be), I(r._closedPromise, (N) => (ee(y._readableStreamController, N), ee(P._readableStreamController, N), (!f || !d) && E(void 0), null)), [y, P];
      }
      function ua(e) {
        let t = xe(e), r = !1, i = !1, l = !1, f = !1, d = !1, p, C, y, P, E;
        const A = w((R) => {
          E = R;
        });
        function re(R) {
          I(R._closedPromise, (v) => (R !== t || (J(y._readableStreamController, v), J(P._readableStreamController, v), (!f || !d) && E(void 0)), null));
        }
        function Ke() {
          $e(t) && (de(t), t = xe(e), re(t)), at(t, {
            _chunkSteps: (v) => {
              fe(() => {
                i = !1, l = !1;
                const B = v;
                let Y = v;
                if (!f && !d)
                  try {
                    Y = In(v);
                  } catch (Xe) {
                    J(y._readableStreamController, Xe), J(P._readableStreamController, Xe), E(te(e, Xe));
                    return;
                  }
                f || Wt(y._readableStreamController, B), d || Wt(P._readableStreamController, Y), r = !1, i ? ye() : l && N();
              });
            },
            _closeSteps: () => {
              r = !1, f || lt(y._readableStreamController), d || lt(P._readableStreamController), y._readableStreamController._pendingPullIntos.length > 0 && qt(y._readableStreamController, 0), P._readableStreamController._pendingPullIntos.length > 0 && qt(P._readableStreamController, 0), (!f || !d) && E(void 0);
            },
            _errorSteps: () => {
              r = !1;
            }
          });
        }
        function Be(R, v) {
          Re(t) && (de(t), t = Vn(e), re(t));
          const B = v ? P : y, Y = v ? y : P;
          Gn(t, R, 1, {
            _chunkSteps: (et) => {
              fe(() => {
                i = !1, l = !1;
                const tt = v ? d : f;
                if (v ? f : d)
                  tt || It(B._readableStreamController, et);
                else {
                  let qo;
                  try {
                    qo = In(et);
                  } catch (tn) {
                    J(B._readableStreamController, tn), J(Y._readableStreamController, tn), E(te(e, tn));
                    return;
                  }
                  tt || It(B._readableStreamController, et), Wt(Y._readableStreamController, qo);
                }
                r = !1, i ? ye() : l && N();
              });
            },
            _closeSteps: (et) => {
              r = !1;
              const tt = v ? d : f, er = v ? f : d;
              tt || lt(B._readableStreamController), er || lt(Y._readableStreamController), et !== void 0 && (tt || It(B._readableStreamController, et), !er && Y._readableStreamController._pendingPullIntos.length > 0 && qt(Y._readableStreamController, 0)), (!tt || !er) && E(void 0);
            },
            _errorSteps: () => {
              r = !1;
            }
          });
        }
        function ye() {
          if (r)
            return i = !0, g(void 0);
          r = !0;
          const R = Fr(y._readableStreamController);
          return R === null ? Ke() : Be(R._view, !1), g(void 0);
        }
        function N() {
          if (r)
            return l = !0, g(void 0);
          r = !0;
          const R = Fr(P._readableStreamController);
          return R === null ? Ke() : Be(R._view, !0), g(void 0);
        }
        function x(R) {
          if (f = !0, p = R, d) {
            const v = st([p, C]), B = te(e, v);
            E(B);
          }
          return A;
        }
        function K(R) {
          if (d = !0, C = R, f) {
            const v = st([p, C]), B = te(e, v);
            E(B);
          }
          return A;
        }
        function ge() {
        }
        return y = go(ge, ye, x), P = go(ge, N, K), re(t), [y, P];
      }
      function fa(e) {
        return u(e) && typeof e.getReader < "u";
      }
      function da(e) {
        return fa(e) ? ha(e.getReader()) : ca(e);
      }
      function ca(e) {
        let t;
        const r = qn(e, "async"), i = s;
        function l() {
          let d;
          try {
            d = ni(r);
          } catch (C) {
            return m(C);
          }
          const p = g(d);
          return O(p, (C) => {
            if (!u(C))
              throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (oi(C))
              je(t._readableStreamController);
            else {
              const P = ii(C);
              Ge(t._readableStreamController, P);
            }
          });
        }
        function f(d) {
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
            y = q(C, p, [d]);
          } catch (E) {
            return m(E);
          }
          const P = g(y);
          return O(P, (E) => {
            if (!u(E))
              throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
          });
        }
        return t = mt(i, l, f, 0), t;
      }
      function ha(e) {
        let t;
        const r = s;
        function i() {
          let f;
          try {
            f = e.read();
          } catch (d) {
            return m(d);
          }
          return O(f, (d) => {
            if (!u(d))
              throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            if (d.done)
              je(t._readableStreamController);
            else {
              const p = d.value;
              Ge(t._readableStreamController, p);
            }
          });
        }
        function l(f) {
          try {
            return g(e.cancel(f));
          } catch (d) {
            return m(d);
          }
        }
        return t = mt(r, i, l, 0), t;
      }
      function ma(e, t) {
        ie(e, t);
        const r = e, i = r == null ? void 0 : r.autoAllocateChunkSize, l = r == null ? void 0 : r.cancel, f = r == null ? void 0 : r.pull, d = r == null ? void 0 : r.start, p = r == null ? void 0 : r.type;
        return {
          autoAllocateChunkSize: i === void 0 ? void 0 : Cr(i, `${t} has member 'autoAllocateChunkSize' that`),
          cancel: l === void 0 ? void 0 : pa(l, r, `${t} has member 'cancel' that`),
          pull: f === void 0 ? void 0 : ba(f, r, `${t} has member 'pull' that`),
          start: d === void 0 ? void 0 : ya(d, r, `${t} has member 'start' that`),
          type: p === void 0 ? void 0 : ga(p, `${t} has member 'type' that`)
        };
      }
      function pa(e, t, r) {
        return Z(e, r), (i) => z(e, t, [i]);
      }
      function ba(e, t, r) {
        return Z(e, r), (i) => z(e, t, [i]);
      }
      function ya(e, t, r) {
        return Z(e, r), (i) => q(e, t, [i]);
      }
      function ga(e, t) {
        if (e = `${e}`, e !== "bytes")
          throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);
        return e;
      }
      function _a(e, t) {
        return ie(e, t), { preventCancel: !!(e == null ? void 0 : e.preventCancel) };
      }
      function yo(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.preventAbort, i = e == null ? void 0 : e.preventCancel, l = e == null ? void 0 : e.preventClose, f = e == null ? void 0 : e.signal;
        return f !== void 0 && Sa(f, `${t} has member 'signal' that`), {
          preventAbort: !!r,
          preventCancel: !!i,
          preventClose: !!l,
          signal: f
        };
      }
      function Sa(e, t) {
        if (!ki(e))
          throw new TypeError(`${t} is not an AbortSignal.`);
      }
      function wa(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.readable;
        wr(r, "readable", "ReadableWritablePair"), Tr(r, `${t} has member 'readable' that`);
        const i = e == null ? void 0 : e.writable;
        return wr(i, "writable", "ReadableWritablePair"), Jn(i, `${t} has member 'writable' that`), { readable: r, writable: i };
      }
      class D {
        constructor(t = {}, r = {}) {
          t === void 0 ? t = null : Sn(t, "First parameter");
          const i = Ft(r, "Second parameter"), l = ma(t, "First parameter");
          if (Jr(this), l.type === "bytes") {
            if (i.size !== void 0)
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            const f = ft(i, 0);
            pi(this, l, f);
          } else {
            const f = zt(i), d = ft(i, 1);
            aa(this, l, d, f);
          }
        }
        /**
         * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
         */
        get locked() {
          if (!ve(this))
            throw Me("locked");
          return ke(this);
        }
        /**
         * Cancels the stream, signaling a loss of interest in the stream by a consumer.
         *
         * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
         * method, which might or might not use it.
         */
        cancel(t = void 0) {
          return ve(this) ? ke(this) ? m(new TypeError("Cannot cancel a stream that already has a reader")) : te(this, t) : m(Me("cancel"));
        }
        getReader(t = void 0) {
          if (!ve(this))
            throw Me("getReader");
          return yi(t, "First parameter").mode === void 0 ? xe(this) : Vn(this);
        }
        pipeThrough(t, r = {}) {
          if (!ve(this))
            throw Me("pipeThrough");
          ce(t, 1, "pipeThrough");
          const i = wa(t, "First parameter"), l = yo(r, "Second parameter");
          if (ke(this))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (Qe(i.writable))
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const f = mo(this, i.writable, l.preventClose, l.preventAbort, l.preventCancel, l.signal);
          return Q(f), i.readable;
        }
        pipeTo(t, r = {}) {
          if (!ve(this))
            return m(Me("pipeTo"));
          if (t === void 0)
            return m("Parameter 1 is required in 'pipeTo'.");
          if (!Ve(t))
            return m(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let i;
          try {
            i = yo(r, "Second parameter");
          } catch (l) {
            return m(l);
          }
          return ke(this) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Qe(t) ? m(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : mo(this, t, i.preventClose, i.preventAbort, i.preventCancel, i.signal);
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
          if (!ve(this))
            throw Me("tee");
          const t = sa(this);
          return st(t);
        }
        values(t = void 0) {
          if (!ve(this))
            throw Me("values");
          const r = _a(t, "First parameter");
          return ti(this, r.preventCancel);
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
      }), c(D.from, "from"), c(D.prototype.cancel, "cancel"), c(D.prototype.getReader, "getReader"), c(D.prototype.pipeThrough, "pipeThrough"), c(D.prototype.pipeTo, "pipeTo"), c(D.prototype.tee, "tee"), c(D.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(D.prototype, Symbol.toStringTag, {
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
        const d = Object.create(be.prototype);
        return bo(f, d, e, t, r, i, l), f;
      }
      function go(e, t, r) {
        const i = Object.create(D.prototype);
        Jr(i);
        const l = Object.create(me.prototype);
        return Hn(i, l, e, t, r, 0, void 0), i;
      }
      function Jr(e) {
        e._state = "readable", e._reader = void 0, e._storedError = void 0, e._disturbed = !1;
      }
      function ve(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_readableStreamController") ? !1 : e instanceof D;
      }
      function ke(e) {
        return e._reader !== void 0;
      }
      function te(e, t) {
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
        return O(i, s);
      }
      function pt(e) {
        e._state = "closed";
        const t = e._reader;
        if (t !== void 0 && (gn(t), Re(t))) {
          const r = t._readRequests;
          t._readRequests = new U(), r.forEach((i) => {
            i._closeSteps();
          });
        }
      }
      function _o(e, t) {
        e._state = "errored", e._storedError = t;
        const r = e._reader;
        r !== void 0 && (Sr(r, t), Re(r) ? Tn(r, t) : Zn(r, t));
      }
      function Me(e) {
        return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`);
      }
      function So(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.highWaterMark;
        return wr(r, "highWaterMark", "QueuingStrategyInit"), {
          highWaterMark: Rr(r)
        };
      }
      const wo = (e) => e.byteLength;
      c(wo, "size");
      class Qt {
        constructor(t) {
          ce(t, 1, "ByteLengthQueuingStrategy"), t = So(t, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!Co(this))
            throw Ro("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by returning the value of its `byteLength` property.
         */
        get size() {
          if (!Co(this))
            throw Ro("size");
          return wo;
        }
      }
      Object.defineProperties(Qt.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Qt.prototype, Symbol.toStringTag, {
        value: "ByteLengthQueuingStrategy",
        configurable: !0
      });
      function Ro(e) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`);
      }
      function Co(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_byteLengthQueuingStrategyHighWaterMark") ? !1 : e instanceof Qt;
      }
      const To = () => 1;
      c(To, "size");
      class Yt {
        constructor(t) {
          ce(t, 1, "CountQueuingStrategy"), t = So(t, "First parameter"), this._countQueuingStrategyHighWaterMark = t.highWaterMark;
        }
        /**
         * Returns the high water mark provided to the constructor.
         */
        get highWaterMark() {
          if (!Eo(this))
            throw Po("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        /**
         * Measures the size of `chunk` by always returning 1.
         * This ensures that the total queue size is a count of the number of chunks in the queue.
         */
        get size() {
          if (!Eo(this))
            throw Po("size");
          return To;
        }
      }
      Object.defineProperties(Yt.prototype, {
        highWaterMark: { enumerable: !0 },
        size: { enumerable: !0 }
      }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Yt.prototype, Symbol.toStringTag, {
        value: "CountQueuingStrategy",
        configurable: !0
      });
      function Po(e) {
        return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`);
      }
      function Eo(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_countQueuingStrategyHighWaterMark") ? !1 : e instanceof Yt;
      }
      function Ra(e, t) {
        ie(e, t);
        const r = e == null ? void 0 : e.cancel, i = e == null ? void 0 : e.flush, l = e == null ? void 0 : e.readableType, f = e == null ? void 0 : e.start, d = e == null ? void 0 : e.transform, p = e == null ? void 0 : e.writableType;
        return {
          cancel: r === void 0 ? void 0 : Ea(r, e, `${t} has member 'cancel' that`),
          flush: i === void 0 ? void 0 : Ca(i, e, `${t} has member 'flush' that`),
          readableType: l,
          start: f === void 0 ? void 0 : Ta(f, e, `${t} has member 'start' that`),
          transform: d === void 0 ? void 0 : Pa(d, e, `${t} has member 'transform' that`),
          writableType: p
        };
      }
      function Ca(e, t, r) {
        return Z(e, r), (i) => z(e, t, [i]);
      }
      function Ta(e, t, r) {
        return Z(e, r), (i) => q(e, t, [i]);
      }
      function Pa(e, t, r) {
        return Z(e, r), (i, l) => z(e, t, [i, l]);
      }
      function Ea(e, t, r) {
        return Z(e, r), (i) => z(e, t, [i]);
      }
      class Gt {
        constructor(t = {}, r = {}, i = {}) {
          t === void 0 && (t = null);
          const l = Ft(r, "Second parameter"), f = Ft(i, "Third parameter"), d = Ra(t, "First parameter");
          if (d.readableType !== void 0)
            throw new RangeError("Invalid readableType specified");
          if (d.writableType !== void 0)
            throw new RangeError("Invalid writableType specified");
          const p = ft(f, 0), C = zt(f), y = ft(l, 1), P = zt(l);
          let E;
          const A = w((re) => {
            E = re;
          });
          va(this, A, y, P, p, C), Aa(this, d), d.start !== void 0 ? E(d.start(this._transformStreamController)) : E(void 0);
        }
        /**
         * The readable side of the transform stream.
         */
        get readable() {
          if (!vo(this))
            throw Wo("readable");
          return this._readable;
        }
        /**
         * The writable side of the transform stream.
         */
        get writable() {
          if (!vo(this))
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
      function va(e, t, r, i, l, f) {
        function d() {
          return t;
        }
        function p(A) {
          return qa(e, A);
        }
        function C(A) {
          return Ia(e, A);
        }
        function y() {
          return Oa(e);
        }
        e._writable = Wi(d, p, y, C, r, i);
        function P() {
          return za(e);
        }
        function E(A) {
          return Fa(e, A);
        }
        e._readable = mt(d, P, E, l, f), e._backpressure = void 0, e._backpressureChangePromise = void 0, e._backpressureChangePromise_resolve = void 0, Zt(e, !0), e._transformStreamController = void 0;
      }
      function vo(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_transformStreamController") ? !1 : e instanceof Gt;
      }
      function ko(e, t) {
        ee(e._readable._readableStreamController, t), Kr(e, t);
      }
      function Kr(e, t) {
        Kt(e._transformStreamController), dt(e._writable._writableStreamController, t), Xr(e);
      }
      function Xr(e) {
        e._backpressure && Zt(e, !1);
      }
      function Zt(e, t) {
        e._backpressureChangePromise !== void 0 && e._backpressureChangePromise_resolve(), e._backpressureChangePromise = w((r) => {
          e._backpressureChangePromise_resolve = r;
        }), e._backpressure = t;
      }
      class Ae {
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
          Ao(this, t);
        }
        /**
         * Errors both the readable side and the writable side of the controlled transform stream, making all future
         * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
         */
        error(t = void 0) {
          if (!Jt(this))
            throw Xt("error");
          Ba(this, t);
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
      Object.defineProperties(Ae.prototype, {
        enqueue: { enumerable: !0 },
        error: { enumerable: !0 },
        terminate: { enumerable: !0 },
        desiredSize: { enumerable: !0 }
      }), c(Ae.prototype.enqueue, "enqueue"), c(Ae.prototype.error, "error"), c(Ae.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ae.prototype, Symbol.toStringTag, {
        value: "TransformStreamDefaultController",
        configurable: !0
      });
      function Jt(e) {
        return !u(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledTransformStream") ? !1 : e instanceof Ae;
      }
      function ka(e, t, r, i, l) {
        t._controlledTransformStream = e, e._transformStreamController = t, t._transformAlgorithm = r, t._flushAlgorithm = i, t._cancelAlgorithm = l, t._finishPromise = void 0, t._finishPromise_resolve = void 0, t._finishPromise_reject = void 0;
      }
      function Aa(e, t) {
        const r = Object.create(Ae.prototype);
        let i, l, f;
        t.transform !== void 0 ? i = (d) => t.transform(d, r) : i = (d) => {
          try {
            return Ao(r, d), g(void 0);
          } catch (p) {
            return m(p);
          }
        }, t.flush !== void 0 ? l = () => t.flush(r) : l = () => g(void 0), t.cancel !== void 0 ? f = (d) => t.cancel(d) : f = () => g(void 0), ka(e, r, i, l, f);
      }
      function Kt(e) {
        e._transformAlgorithm = void 0, e._flushAlgorithm = void 0, e._cancelAlgorithm = void 0;
      }
      function Ao(e, t) {
        const r = e._controlledTransformStream, i = r._readable._readableStreamController;
        if (!Ze(i))
          throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          Ge(i, t);
        } catch (f) {
          throw Kr(r, f), r._readable._storedError;
        }
        ia(i) !== r._backpressure && Zt(r, !0);
      }
      function Ba(e, t) {
        ko(e._controlledTransformStream, t);
      }
      function Bo(e, t) {
        const r = e._transformAlgorithm(t);
        return O(r, void 0, (i) => {
          throw ko(e._controlledTransformStream, i), i;
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
          return O(i, () => {
            const l = e._writable;
            if (l._state === "erroring")
              throw l._storedError;
            return Bo(r, t);
          });
        }
        return Bo(r, t);
      }
      function Ia(e, t) {
        const r = e._transformStreamController;
        if (r._finishPromise !== void 0)
          return r._finishPromise;
        const i = e._readable;
        r._finishPromise = w((f, d) => {
          r._finishPromise_resolve = f, r._finishPromise_reject = d;
        });
        const l = r._cancelAlgorithm(t);
        return Kt(r), _(l, () => (i._state === "errored" ? Je(r, i._storedError) : (ee(i._readableStreamController, t), en(r)), null), (f) => (ee(i._readableStreamController, f), Je(r, f), null)), r._finishPromise;
      }
      function Oa(e) {
        const t = e._transformStreamController;
        if (t._finishPromise !== void 0)
          return t._finishPromise;
        const r = e._readable;
        t._finishPromise = w((l, f) => {
          t._finishPromise_resolve = l, t._finishPromise_reject = f;
        });
        const i = t._flushAlgorithm();
        return Kt(t), _(i, () => (r._state === "errored" ? Je(t, r._storedError) : (je(r._readableStreamController), en(t)), null), (l) => (ee(r._readableStreamController, l), Je(t, l), null)), t._finishPromise;
      }
      function za(e) {
        return Zt(e, !1), e._backpressureChangePromise;
      }
      function Fa(e, t) {
        const r = e._transformStreamController;
        if (r._finishPromise !== void 0)
          return r._finishPromise;
        const i = e._writable;
        r._finishPromise = w((f, d) => {
          r._finishPromise_resolve = f, r._finishPromise_reject = d;
        });
        const l = r._cancelAlgorithm(t);
        return Kt(r), _(l, () => (i._state === "errored" ? Je(r, i._storedError) : (dt(i._writableStreamController, t), Xr(e), en(r)), null), (f) => (dt(i._writableStreamController, f), Xr(e), Je(r, f), null)), r._finishPromise;
      }
      function Xt(e) {
        return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`);
      }
      function en(e) {
        e._finishPromise_resolve !== void 0 && (e._finishPromise_resolve(), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
      }
      function Je(e, t) {
        e._finishPromise_reject !== void 0 && (Q(e._finishPromise), e._finishPromise_reject(t), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
      }
      function Wo(e) {
        return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`);
      }
      n.ByteLengthQueuingStrategy = Qt, n.CountQueuingStrategy = Yt, n.ReadableByteStreamController = me, n.ReadableStream = D, n.ReadableStreamBYOBReader = Pe, n.ReadableStreamBYOBRequest = Oe, n.ReadableStreamDefaultController = be, n.ReadableStreamDefaultReader = we, n.TransformStream = Gt, n.TransformStreamDefaultController = Ae, n.WritableStream = Ee, n.WritableStreamDefaultController = Ye, n.WritableStreamDefaultWriter = pe;
    });
  }(rr, rr.exports)), rr.exports;
}
const Xa = 65536;
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
    Object.assign(globalThis, Ka());
  }
try {
  const { Blob: a } = require("buffer");
  a && !a.prototype.stream && (a.prototype.stream = function(n) {
    let s = 0;
    const u = this;
    return new ReadableStream({
      type: "bytes",
      async pull(h) {
        const S = await u.slice(s, Math.min(u.size, s + Xa)).arrayBuffer();
        s += S.byteLength, h.enqueue(new Uint8Array(S)), s === u.size && h.close();
      }
    });
  });
} catch {
}
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const Fo = 65536;
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
          const h = Math.min(u - s, Fo), c = n.buffer.slice(s, s + h);
          s += c.byteLength, yield new Uint8Array(c);
        }
      } else
        yield n;
    else {
      let s = 0, u = (
        /** @type {Blob} */
        n
      );
      for (; s !== u.size; ) {
        const c = await u.slice(s, Math.min(u.size, s + Fo)).arrayBuffer();
        s += c.byteLength, yield new Uint8Array(c);
      }
    }
}
var _e, wt, it, cr, Ne;
const Uo = (Ne = class {
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
    We(this, _e, []);
    We(this, wt, "");
    We(this, it, 0);
    We(this, cr, "transparent");
    if (typeof o != "object" || o === null)
      throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
    if (typeof o[Symbol.iterator] != "function")
      throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
    if (typeof n != "object" && typeof n != "function")
      throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
    n === null && (n = {});
    const s = new TextEncoder();
    for (const h of o) {
      let c;
      ArrayBuffer.isView(h) ? c = new Uint8Array(h.buffer.slice(h.byteOffset, h.byteOffset + h.byteLength)) : h instanceof ArrayBuffer ? c = new Uint8Array(h.slice(0)) : h instanceof Ne ? c = h : c = s.encode(`${h}`), se(this, it, $(this, it) + (ArrayBuffer.isView(c) ? c.byteLength : c.size)), $(this, _e).push(c);
    }
    se(this, cr, `${n.endings === void 0 ? "transparent" : n.endings}`);
    const u = n.type === void 0 ? "" : String(n.type);
    se(this, wt, /^[\x20-\x7E]*$/.test(u) ? u : "");
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
    for await (const s of nn($(this, _e), !1))
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
    for await (const s of nn($(this, _e), !1))
      o.set(s, n), n += s.length;
    return o.buffer;
  }
  stream() {
    const o = nn($(this, _e), !0);
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
    let h = o < 0 ? Math.max(u + o, 0) : Math.min(o, u), c = n < 0 ? Math.max(u + n, 0) : Math.min(n, u);
    const S = Math.max(c - h, 0), T = $(this, _e), b = [];
    let w = 0;
    for (const m of T) {
      if (w >= S)
        break;
      const k = ArrayBuffer.isView(m) ? m.byteLength : m.size;
      if (h && k <= h)
        h -= k, c -= k;
      else {
        let _;
        ArrayBuffer.isView(m) ? (_ = m.subarray(h, Math.min(k, c)), w += _.byteLength) : (_ = m.slice(h, Math.min(k, c)), w += _.size), c -= k, b.push(_), h = 0;
      }
    }
    const g = new Ne([], { type: String(s).toLowerCase() });
    return se(g, it, S), se(g, _e, b), g;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](o) {
    return o && typeof o == "object" && typeof o.constructor == "function" && (typeof o.stream == "function" || typeof o.arrayBuffer == "function") && /^(Blob|File)$/.test(o[Symbol.toStringTag]);
  }
}, _e = new WeakMap(), wt = new WeakMap(), it = new WeakMap(), cr = new WeakMap(), Ne);
Object.defineProperties(Uo.prototype, {
  size: { enumerable: !0 },
  type: { enumerable: !0 },
  slice: { enumerable: !0 }
});
const sr = Uo;
var Rt, Ct, jo;
const es = (jo = class extends sr {
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
    We(this, Rt, 0);
    We(this, Ct, "");
    u === null && (u = {});
    const h = u.lastModified === void 0 ? Date.now() : Number(u.lastModified);
    Number.isNaN(h) || se(this, Rt, h), se(this, Ct, String(s));
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
}, Rt = new WeakMap(), Ct = new WeakMap(), jo), ts = es;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: yt, iterator: rs, hasInstance: ns } = Symbol, $o = Math.random, os = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), Lo = (a, o, n) => (a += "", /^(Blob|File)$/.test(o && o[yt]) ? [(n = n !== void 0 ? n + "" : o[yt] == "File" ? o.name : "blob", a), o.name !== n || o[yt] == "blob" ? new ts([o], n, o) : o] : [a, o + ""]), on = (a, o) => (o ? a : a.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), Ue = (a, o, n) => {
  if (o.length < n)
    throw new TypeError(`Failed to execute '${a}' on 'FormData': ${n} arguments required, but only ${o.length} present.`);
}, X, Mo;
const fn = (Mo = class {
  constructor(...o) {
    We(this, X, []);
    if (o.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [yt]() {
    return "FormData";
  }
  [rs]() {
    return this.entries();
  }
  static [ns](o) {
    return o && typeof o == "object" && o[yt] === "FormData" && !os.some((n) => typeof o[n] != "function");
  }
  append(...o) {
    Ue("append", arguments, 2), $(this, X).push(Lo(...o));
  }
  delete(o) {
    Ue("delete", arguments, 1), o += "", se(this, X, $(this, X).filter(([n]) => n !== o));
  }
  get(o) {
    Ue("get", arguments, 1), o += "";
    for (var n = $(this, X), s = n.length, u = 0; u < s; u++) if (n[u][0] === o) return n[u][1];
    return null;
  }
  getAll(o, n) {
    return Ue("getAll", arguments, 1), n = [], o += "", $(this, X).forEach((s) => s[0] === o && n.push(s[1])), n;
  }
  has(o) {
    return Ue("has", arguments, 1), o += "", $(this, X).some((n) => n[0] === o);
  }
  forEach(o, n) {
    Ue("forEach", arguments, 1);
    for (var [s, u] of this) o.call(n, u, s, this);
  }
  set(...o) {
    Ue("set", arguments, 2);
    var n = [], s = !0;
    o = Lo(...o), $(this, X).forEach((u) => {
      u[0] === o[0] ? s && (s = !n.push(o)) : n.push(u);
    }), s && n.push(o), se(this, X, n);
  }
  *entries() {
    yield* $(this, X);
  }
  *keys() {
    for (var [o] of this) yield o;
  }
  *values() {
    for (var [, o] of this) yield o;
  }
}, X = new WeakMap(), Mo);
function is(a, o = sr) {
  var n = `${$o()}${$o()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), s = [], u = `--${n}\r
Content-Disposition: form-data; name="`;
  return a.forEach((h, c) => typeof h == "string" ? s.push(u + on(c) + `"\r
\r
${h.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : s.push(u + on(c) + `"; filename="${on(h.name, 1)}"\r
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
class le extends mr {
  /**
   * @param  {string} message -      Error message for human
   * @param  {string} [type] -        Error type for machine
   * @param  {SystemError} [systemError] - For Node.js system error
   */
  constructor(o, n, s) {
    super(o, n), s && (this.code = this.errno = s.code, this.erroredSysCall = s.syscall);
  }
}
const lr = Symbol.toStringTag, No = (a) => typeof a == "object" && typeof a.append == "function" && typeof a.delete == "function" && typeof a.get == "function" && typeof a.getAll == "function" && typeof a.has == "function" && typeof a.set == "function" && typeof a.sort == "function" && a[lr] === "URLSearchParams", ur = (a) => a && typeof a == "object" && typeof a.arrayBuffer == "function" && typeof a.type == "string" && typeof a.stream == "function" && typeof a.constructor == "function" && /^(Blob|File)$/.test(a[lr]), as = (a) => typeof a == "object" && (a[lr] === "AbortSignal" || a[lr] === "EventTarget"), ss = (a, o) => {
  const n = new URL(o).hostname, s = new URL(a).hostname;
  return n === s || n.endsWith(`.${s}`);
}, ls = (a, o) => {
  const n = new URL(o).protocol, s = new URL(a).protocol;
  return n === s;
}, us = Ga(ue.pipeline), H = Symbol("Body internals");
class _t {
  constructor(o, {
    size: n = 0
  } = {}) {
    let s = null;
    o === null ? o = null : No(o) ? o = j.from(o.toString()) : ur(o) || j.isBuffer(o) || (ar.isAnyArrayBuffer(o) ? o = j.from(o) : ArrayBuffer.isView(o) ? o = j.from(o.buffer, o.byteOffset, o.byteLength) : o instanceof ue || (o instanceof fn ? (o = is(o), s = o.type.split("=")[1]) : o = j.from(String(o))));
    let u = o;
    j.isBuffer(o) ? u = ue.Readable.from(o) : ur(o) && (u = ue.Readable.from(o.stream())), this[H] = {
      body: o,
      stream: u,
      boundary: s,
      disturbed: !1,
      error: null
    }, this.size = n, o instanceof ue && o.on("error", (h) => {
      const c = h instanceof mr ? h : new le(`Invalid response body while trying to fetch ${this.url}: ${h.message}`, "system", h);
      this[H].error = c;
    });
  }
  get body() {
    return this[H].stream;
  }
  get bodyUsed() {
    return this[H].disturbed;
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
      for (const [h, c] of u)
        s.append(h, c);
      return s;
    }
    const { toFormData: n } = await import("./multipart-parser-C_CYMPrr.js");
    return n(this.body, o);
  }
  /**
   * Return raw response as Blob
   *
   * @return Promise
   */
  async blob() {
    const o = this.headers && this.headers.get("content-type") || this[H].body && this[H].body.type || "", n = await this.arrayBuffer();
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
  if (a[H].disturbed)
    throw new TypeError(`body used already for: ${a.url}`);
  if (a[H].disturbed = !0, a[H].error)
    throw a[H].error;
  const { body: o } = a;
  if (o === null)
    return j.alloc(0);
  if (!(o instanceof ue))
    return j.alloc(0);
  const n = [];
  let s = 0;
  try {
    for await (const u of o) {
      if (a.size > 0 && s + u.length > a.size) {
        const h = new le(`content size at ${a.url} over limit: ${a.size}`, "max-size");
        throw o.destroy(h), h;
      }
      s += u.length, n.push(u);
    }
  } catch (u) {
    throw u instanceof mr ? u : new le(`Invalid response body while trying to fetch ${a.url}: ${u.message}`, "system", u);
  }
  if (o.readableEnded === !0 || o._readableState.ended === !0)
    try {
      return n.every((u) => typeof u == "string") ? j.from(n.join("")) : j.concat(n, s);
    } catch (u) {
      throw new le(`Could not create Buffer from response body for ${a.url}: ${u.message}`, "system", u);
    }
  else
    throw new le(`Premature close of server response while trying to fetch ${a.url}`);
}
const hn = (a, o) => {
  let n, s, { body: u } = a[H];
  if (a.bodyUsed)
    throw new Error("cannot clone body after it is used");
  return u instanceof ue && typeof u.getBoundary != "function" && (n = new ir({ highWaterMark: o }), s = new ir({ highWaterMark: o }), u.pipe(n), u.pipe(s), a[H].stream = n, u = s), u;
}, fs = hr(
  (a) => a.getBoundary(),
  "form-data doesn't follow the spec and requires special treatment. Use alternative package",
  "https://github.com/node-fetch/node-fetch/issues/1167"
), xo = (a, o) => a === null ? null : typeof a == "string" ? "text/plain;charset=UTF-8" : No(a) ? "application/x-www-form-urlencoded;charset=UTF-8" : ur(a) ? a.type || null : j.isBuffer(a) || ar.isAnyArrayBuffer(a) || ArrayBuffer.isView(a) ? null : a instanceof fn ? `multipart/form-data; boundary=${o[H].boundary}` : a && typeof a.getBoundary == "function" ? `multipart/form-data;boundary=${fs(a)}` : a instanceof ue ? null : "text/plain;charset=UTF-8", ds = (a) => {
  const { body: o } = a[H];
  return o === null ? 0 : ur(o) ? o.size : j.isBuffer(o) ? o.length : o && typeof o.getLengthSync == "function" && o.hasKnownLength && o.hasKnownLength() ? o.getLengthSync() : null;
}, cs = async (a, { body: o }) => {
  o === null ? a.end() : await us(o, a);
}, or = typeof gt.validateHeaderName == "function" ? gt.validateHeaderName : (a) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(a)) {
    const o = new TypeError(`Header name must be a valid HTTP token [${a}]`);
    throw Object.defineProperty(o, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), o;
  }
}, dn = typeof gt.validateHeaderValue == "function" ? gt.validateHeaderValue : (a, o) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o)) {
    const n = new TypeError(`Invalid character in header content ["${a}"]`);
    throw Object.defineProperty(n, "code", { value: "ERR_INVALID_CHAR" }), n;
  }
};
class Se extends URLSearchParams {
  /**
   * Headers class
   *
   * @constructor
   * @param {HeadersInit} [init] - Response headers
   */
  constructor(o) {
    let n = [];
    if (o instanceof Se) {
      const s = o.raw();
      for (const [u, h] of Object.entries(s))
        n.push(...h.map((c) => [u, c]));
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
    return n = n.length > 0 ? n.map(([s, u]) => (or(s), dn(s, String(u)), [String(s).toLowerCase(), String(u)])) : void 0, super(n), new Proxy(this, {
      get(s, u, h) {
        switch (u) {
          case "append":
          case "set":
            return (c, S) => (or(c), dn(c, String(S)), URLSearchParams.prototype[u].call(
              s,
              String(c).toLowerCase(),
              String(S)
            ));
          case "delete":
          case "has":
          case "getAll":
            return (c) => (or(c), URLSearchParams.prototype[u].call(
              s,
              String(c).toLowerCase()
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
  Se.prototype,
  ["get", "entries", "forEach", "values"].reduce((a, o) => (a[o] = { enumerable: !0 }, a), {})
);
function hs(a = []) {
  return new Se(
    a.reduce((o, n, s, u) => (s % 2 === 0 && o.push(u.slice(s, s + 2)), o), []).filter(([o, n]) => {
      try {
        return or(o), dn(o, String(n)), !0;
      } catch {
        return !1;
      }
    })
  );
}
const ms = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Ho = (a) => ms.has(a), ne = Symbol("Response internals");
class G extends _t {
  constructor(o = null, n = {}) {
    super(o, n);
    const s = n.status != null ? n.status : 200, u = new Se(n.headers);
    if (o !== null && !u.has("Content-Type")) {
      const h = xo(o, this);
      h && u.append("Content-Type", h);
    }
    this[ne] = {
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
    return this[ne].type;
  }
  get url() {
    return this[ne].url || "";
  }
  get status() {
    return this[ne].status;
  }
  /**
   * Convenience property representing if the request ended normally
   */
  get ok() {
    return this[ne].status >= 200 && this[ne].status < 300;
  }
  get redirected() {
    return this[ne].counter > 0;
  }
  get statusText() {
    return this[ne].statusText;
  }
  get headers() {
    return this[ne].headers;
  }
  get highWaterMark() {
    return this[ne].highWaterMark;
  }
  /**
   * Clone this response
   *
   * @return  Response
   */
  clone() {
    return new G(hn(this, this.highWaterMark), {
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
    if (!Ho(n))
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    return new G(null, {
      headers: {
        location: new URL(o).toString()
      },
      status: n
    });
  }
  static error() {
    const o = new G(null, { status: 0, statusText: "" });
    return o[ne].type = "error", o;
  }
  static json(o = void 0, n = {}) {
    const s = JSON.stringify(o);
    if (s === void 0)
      throw new TypeError("data is not JSON serializable");
    const u = new Se(n && n.headers);
    return u.has("content-type") || u.set("content-type", "application/json"), new G(s, {
      ...n,
      headers: u
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
}
Object.defineProperties(G.prototype, {
  type: { enumerable: !0 },
  url: { enumerable: !0 },
  status: { enumerable: !0 },
  ok: { enumerable: !0 },
  redirected: { enumerable: !0 },
  statusText: { enumerable: !0 },
  headers: { enumerable: !0 },
  clone: { enumerable: !0 }
});
const ps = (a) => {
  if (a.search)
    return a.search;
  const o = a.href.length - 1, n = a.hash || (a.href[o] === "#" ? "#" : "");
  return a.href[o - n.length] === "?" ? "?" : "";
};
function Do(a, o = !1) {
  return a == null || (a = new URL(a), /^(about|blob|data):$/.test(a.protocol)) ? "no-referrer" : (a.username = "", a.password = "", a.hash = "", o && (a.pathname = "", a.search = ""), a);
}
const Vo = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]), bs = "strict-origin-when-cross-origin";
function ys(a) {
  if (!Vo.has(a))
    throw new TypeError(`Invalid referrerPolicy: ${a}`);
  return a;
}
function gs(a) {
  if (/^(http|ws)s:$/.test(a.protocol))
    return !0;
  const o = a.host.replace(/(^\[)|(]$)/g, ""), n = Za(o);
  return n === 4 && /^127\./.test(o) || n === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o) ? !0 : a.host === "localhost" || a.host.endsWith(".localhost") ? !1 : a.protocol === "file:";
}
function ot(a) {
  return /^about:(blank|srcdoc)$/.test(a) || a.protocol === "data:" || /^(blob|filesystem):$/.test(a.protocol) ? !0 : gs(a);
}
function _s(a, { referrerURLCallback: o, referrerOriginCallback: n } = {}) {
  if (a.referrer === "no-referrer" || a.referrerPolicy === "")
    return null;
  const s = a.referrerPolicy;
  if (a.referrer === "about:client")
    return "no-referrer";
  const u = a.referrer;
  let h = Do(u), c = Do(u, !0);
  h.toString().length > 4096 && (h = c), o && (h = o(h)), n && (c = n(c));
  const S = new URL(a.url);
  switch (s) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return c;
    case "unsafe-url":
      return h;
    case "strict-origin":
      return ot(h) && !ot(S) ? "no-referrer" : c.toString();
    case "strict-origin-when-cross-origin":
      return h.origin === S.origin ? h : ot(h) && !ot(S) ? "no-referrer" : c;
    case "same-origin":
      return h.origin === S.origin ? h : "no-referrer";
    case "origin-when-cross-origin":
      return h.origin === S.origin ? h : c;
    case "no-referrer-when-downgrade":
      return ot(h) && !ot(S) ? "no-referrer" : h;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${s}`);
  }
}
function Ss(a) {
  const o = (a.get("referrer-policy") || "").split(/[,\s]+/);
  let n = "";
  for (const s of o)
    s && Vo.has(s) && (n = s);
  return n;
}
const L = Symbol("Request internals"), bt = (a) => typeof a == "object" && typeof a[L] == "object", ws = hr(
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
    if (/^(delete|get|head|options|post|put)$/i.test(u) && (u = u.toUpperCase()), !bt(n) && "data" in n && ws(), (n.body != null || bt(o) && o.body !== null) && (u === "GET" || u === "HEAD"))
      throw new TypeError("Request with GET/HEAD method cannot have body");
    const h = n.body ? n.body : bt(o) && o.body !== null ? hn(o) : null;
    super(h, {
      size: n.size || o.size || 0
    });
    const c = new Se(n.headers || o.headers || {});
    if (h !== null && !c.has("Content-Type")) {
      const b = xo(h, this);
      b && c.set("Content-Type", b);
    }
    let S = bt(o) ? o.signal : null;
    if ("signal" in n && (S = n.signal), S != null && !as(S))
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
      headers: c,
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
    return xa(this[L].parsedURL);
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
    this[L].referrerPolicy = ys(o);
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
const Rs = (a) => {
  const { parsedURL: o } = a[L], n = new Se(a[L].headers);
  n.has("Accept") || n.set("Accept", "*/*");
  let s = null;
  if (a.body === null && /^(post|put)$/i.test(a.method) && (s = "0"), a.body !== null) {
    const S = ds(a);
    typeof S == "number" && !Number.isNaN(S) && (s = String(S));
  }
  s && n.set("Content-Length", s), a.referrerPolicy === "" && (a.referrerPolicy = bs), a.referrer && a.referrer !== "no-referrer" ? a[L].referrer = _s(a) : a[L].referrer = "no-referrer", a[L].referrer instanceof URL && n.set("Referer", a.referrer), n.has("User-Agent") || n.set("User-Agent", "node-fetch"), a.compress && !n.has("Accept-Encoding") && n.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: u } = a;
  typeof u == "function" && (u = u(o));
  const h = ps(o), c = {
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
    options: c
  };
};
class Cs extends mr {
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
const { stat: Hs } = Qa, Ts = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function qe(a, o) {
  return new Promise((n, s) => {
    const u = new St(a, o), { parsedURL: h, options: c } = Rs(u);
    if (!Ts.has(h.protocol))
      throw new TypeError(`node-fetch cannot load ${a}. URL scheme "${h.protocol.replace(/:$/, "")}" is not supported.`);
    if (h.protocol === "data:") {
      const _ = Ja(u.url), V = new G(_, { headers: { "Content-Type": _.typeFull } });
      n(V);
      return;
    }
    const S = (h.protocol === "https:" ? Ya : gt).request, { signal: T } = u;
    let b = null;
    const w = () => {
      const _ = new Cs("The operation was aborted.");
      s(_), u.body && u.body instanceof ue.Readable && u.body.destroy(_), !(!b || !b.body) && b.body.emit("error", _);
    };
    if (T && T.aborted) {
      w();
      return;
    }
    const g = () => {
      w(), k();
    }, m = S(h.toString(), c);
    T && T.addEventListener("abort", g);
    const k = () => {
      m.abort(), T && T.removeEventListener("abort", g);
    };
    m.on("error", (_) => {
      s(new le(`request to ${u.url} failed, reason: ${_.message}`, "system", _)), k();
    }), Ps(m, (_) => {
      b && b.body && b.body.destroy(_);
    }), process.version < "v14" && m.on("socket", (_) => {
      let V;
      _.prependListener("end", () => {
        V = _._eventsCount;
      }), _.prependListener("close", (I) => {
        if (b && V < _._eventsCount && !I) {
          const O = new Error("Premature close");
          O.code = "ERR_STREAM_PREMATURE_CLOSE", b.body.emit("error", O);
        }
      });
    }), m.on("response", (_) => {
      m.setTimeout(0);
      const V = hs(_.rawHeaders);
      if (Ho(_.statusCode)) {
        const q = V.get("Location");
        let z = null;
        try {
          z = q === null ? null : new URL(q, u.url);
        } catch {
          if (u.redirect !== "manual") {
            s(new le(`uri requested responds with an invalid redirect URL: ${q}`, "invalid-redirect")), k();
            return;
          }
        }
        switch (u.redirect) {
          case "error":
            s(new le(`uri requested responds with a redirect, redirect mode is set to error: ${u.url}`, "no-redirect")), k();
            return;
          case "manual":
            break;
          case "follow": {
            if (z === null)
              break;
            if (u.counter >= u.follow) {
              s(new le(`maximum redirect reached at: ${u.url}`, "max-redirect")), k();
              return;
            }
            const M = {
              headers: new Se(u.headers),
              follow: u.follow,
              counter: u.counter + 1,
              agent: u.agent,
              compress: u.compress,
              method: u.method,
              body: hn(u),
              signal: u.signal,
              size: u.size,
              referrer: u.referrer,
              referrerPolicy: u.referrerPolicy
            };
            if (!ss(u.url, z) || !ls(u.url, z))
              for (const Tt of ["authorization", "www-authenticate", "cookie", "cookie2"])
                M.headers.delete(Tt);
            if (_.statusCode !== 303 && u.body && o.body instanceof ue.Readable) {
              s(new le("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), k();
              return;
            }
            (_.statusCode === 303 || (_.statusCode === 301 || _.statusCode === 302) && u.method === "POST") && (M.method = "GET", M.body = void 0, M.headers.delete("content-length"));
            const U = Ss(V);
            U && (M.referrerPolicy = U), n(qe(new St(z, M))), k();
            return;
          }
          default:
            return s(new TypeError(`Redirect option '${u.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      T && _.once("end", () => {
        T.removeEventListener("abort", g);
      });
      let I = nt(_, new ir(), (q) => {
        q && s(q);
      });
      process.version < "v12.10" && _.on("aborted", g);
      const O = {
        url: u.url,
        status: _.statusCode,
        statusText: _.statusMessage,
        headers: V,
        size: u.size,
        counter: u.counter,
        highWaterMark: u.highWaterMark
      }, Q = V.get("Content-Encoding");
      if (!u.compress || u.method === "HEAD" || Q === null || _.statusCode === 204 || _.statusCode === 304) {
        b = new G(I, O), n(b);
        return;
      }
      const fe = {
        flush: rt.Z_SYNC_FLUSH,
        finishFlush: rt.Z_SYNC_FLUSH
      };
      if (Q === "gzip" || Q === "x-gzip") {
        I = nt(I, rt.createGunzip(fe), (q) => {
          q && s(q);
        }), b = new G(I, O), n(b);
        return;
      }
      if (Q === "deflate" || Q === "x-deflate") {
        const q = nt(_, new ir(), (z) => {
          z && s(z);
        });
        q.once("data", (z) => {
          (z[0] & 15) === 8 ? I = nt(I, rt.createInflate(), (M) => {
            M && s(M);
          }) : I = nt(I, rt.createInflateRaw(), (M) => {
            M && s(M);
          }), b = new G(I, O), n(b);
        }), q.once("end", () => {
          b || (b = new G(I, O), n(b));
        });
        return;
      }
      if (Q === "br") {
        I = nt(I, rt.createBrotliDecompress(), (q) => {
          q && s(q);
        }), b = new G(I, O), n(b);
        return;
      }
      b = new G(I, O), n(b);
    }), cs(m, u).catch(s);
  });
}
function Ps(a, o) {
  const n = j.from(`0\r
\r
`);
  let s = !1, u = !1, h;
  a.on("response", (c) => {
    const { headers: S } = c;
    s = S["transfer-encoding"] === "chunked" && !S["content-length"];
  }), a.on("socket", (c) => {
    const S = () => {
      if (s && !u) {
        const b = new Error("Premature close");
        b.code = "ERR_STREAM_PREMATURE_CLOSE", o(b);
      }
    }, T = (b) => {
      u = j.compare(b.slice(-5), n) === 0, !u && h && (u = j.compare(h.slice(-3), n.slice(0, 3)) === 0 && j.compare(b.slice(-2), n.slice(3)) === 0), h = b;
    };
    c.prependListener("close", S), c.on("data", T), a.on("close", () => {
      c.removeListener("close", S), c.removeListener("data", T);
    });
  });
}
class Es extends cn {
  constructor() {
    super(...arguments);
    F(this, "creds", null);
    F(this, "timer", null);
    F(this, "phase", "Unknown");
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
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-gameflow/v1/gameflow-phase`, c = Buffer.from(`riot:${u}`).toString("base64");
    try {
      const S = (await qe(h, { headers: { Authorization: `Basic ${c}` } }).then(
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
class vs extends cn {
  constructor() {
    super(...arguments);
    F(this, "creds", null);
    F(this, "summonerId", null);
    F(this, "poller", null);
    F(this, "currentChampion", 0);
    F(this, "lastAppliedChampion", 0);
    F(this, "includeDefaultSkin", !0);
    F(this, "selectedSkinId", 0);
    F(this, "selectedChromaId", 0);
    F(this, "skins", []);
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
    this.includeDefaultSkin = !this.includeDefaultSkin, this.currentChampion && this.rerollSkin();
  }
  getSelection() {
    return { skinId: this.selectedSkinId, chromaId: this.selectedChromaId };
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
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-summoner/v1/current-summoner`, c = Buffer.from(`riot:${u}`).toString("base64");
    try {
      const S = await qe(h, {
        headers: { Authorization: `Basic ${c}` }
      }).then((T) => T.json());
      this.summonerId = S.summonerId ?? S.accountId ?? S.id ?? null;
    } catch {
      this.summonerId = null;
    }
  }
  async fetchCurrentChampion() {
    if (!this.creds) return 0;
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-champ-select/v1/current-champion`, c = Buffer.from(`riot:${u}`).toString("base64");
    try {
      return Number(
        await qe(h, {
          headers: { Authorization: `Basic ${c}` }
        }).then((S) => S.text())
      ) || 0;
    } catch {
      return 0;
    }
  }
  async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}`, c = {
      Authorization: `Basic ${Buffer.from(`riot:${u}`).toString(
        "base64"
      )}`
    }, S = await qe(
      `${h}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
      { headers: c }
    ).then((b) => b.json()), T = [];
    for (const b of S.filter(
      (w) => {
        var g;
        return ((g = w.ownership) == null ? void 0 : g.owned) || w.isOwned || w.owned;
      }
    )) {
      let w = [];
      try {
        w = (await qe(
          `${h}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins/${b.id}/chromas`,
          { headers: c }
        ).then((m) => m.status === 404 ? [] : m.json())).filter((m) => {
          var k;
          return ((k = m.ownership) == null ? void 0 : k.owned) || m.isOwned || m.owned;
        }).map((m) => ({ id: m.id, name: m.name || `Chroma ${m.id}` }));
      } catch {
      }
      T.push({ id: b.id, name: b.name, chromas: w });
    }
    if (this.skins = T, this.emit("skins", T), this.currentChampion !== this.lastAppliedChampion && T.length) {
      const b = this.includeDefaultSkin ? T : T.filter((m) => m.id % 1e3 !== 0) || T, w = b[Math.floor(Math.random() * b.length)], g = w.chromas.length ? w.chromas[Math.floor(Math.random() * w.chromas.length)].id : w.id;
      await this.applySkin(g), this.selectedSkinId = w.id, this.selectedChromaId = g !== w.id ? g : 0, this.emit("selection", this.getSelection()), this.lastAppliedChampion = this.currentChampion;
    }
  }
  async applySkin(n) {
    if (!this.creds) return;
    const { protocol: s, port: u, password: h } = this.creds, c = `${s}://127.0.0.1:${u}/lol-champ-select/v1/session/my-selection`, S = Buffer.from(`riot:${h}`).toString("base64");
    try {
      await qe(c, {
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
    const { protocol: n, port: s, password: u } = this.creds, h = `${n}://127.0.0.1:${s}/lol-champ-select/v1/session/my-selection`, c = Buffer.from(`riot:${u}`).toString("base64");
    try {
      const T = (await qe(h, {
        headers: { Authorization: `Basic ${c}` }
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
  /* ---- EventEmitter typings ---- */
  on(n, s) {
    return super.on(n, s);
  }
  emit(n, ...s) {
    return super.emit(n, ...s);
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const ks = Ha(import.meta.url), nr = Na(ks);
let W = null;
const mn = new un(), fr = new Es(), oe = new vs();
let sn = null;
mn.on("status", (a, o) => {
  W == null || W.webContents.send("lcu-status", a), a === "connected" && o ? (W == null || W.show(), fr.setCreds(o), oe.setCreds(o), oe.start()) : (fr.stop(), oe.stop(), W == null || W.hide());
});
fr.on("phase", (a) => {
  W == null || W.webContents.send("gameflow-phase", a);
});
oe.on(
  "skins",
  (a) => {
    W == null || W.webContents.send("owned-skins", a);
  }
  // ← cast ajouté
);
oe.on(
  "selection",
  (a) => {
    W == null || W.webContents.send("selection", a);
  }
  // idem pour selection
);
function As() {
  W = new Da({
    width: 900,
    height: 563,
    resizable: !1,
    // ← l’utilisateur ne peut plus redimensionner
    maximizable: !1,
    // ← désactive le bouton “plein écran” (Windows / Linux)
    fullscreenable: !1,
    // ← désactive ⌥⌘F sur macOS
    icon: tr(nr, "../public/icon.ico"),
    show: !1,
    webPreferences: {
      preload: tr(nr, "preload.mjs"),
      contextIsolation: !0
    }
  }), ja.setApplicationMenu(null);
  const a = Ma.createFromPath(
    tr(nr, "../public/icon.ico")
  );
  sn = new Ua(a), sn.setToolTip("LoL Skin Picker"), sn.on("double-click", () => W.isVisible() ? W.hide() : W.show()), process.env.VITE_DEV_SERVER_URL ? W.loadURL(process.env.VITE_DEV_SERVER_URL) : W.loadFile(tr(nr, "../renderer/index.html")), mn.start();
}
Ie.handle("get-lcu-status", () => mn.status);
Ie.handle("get-gameflow-phase", () => fr.phase);
Ie.handle("get-owned-skins", () => oe.skins);
Ie.handle("get-include-default", () => oe.getIncludeDefault());
Ie.handle("toggle-include-default", () => oe.toggleIncludeDefault());
Ie.handle("reroll-skin", () => oe.rerollSkin());
Ie.handle("reroll-chroma", () => oe.rerollChroma());
Ie.handle("get-selection", () => oe.getSelection());
ln.whenReady().then(As);
ln.on("window-all-closed", () => process.platform !== "darwin" && ln.quit());
export {
  fn as F,
  ts as a
};
