//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, D = /-\w/g, O = E((e) => e.replace(D, (e) => e.slice(1).toUpperCase())), ee = /\B([A-Z])/g, k = E((e) => e.replace(ee, "-$1").toLowerCase()), te = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), A = E((e) => e ? `on${te(e)}` : ""), j = (e, t) => !Object.is(e, t), ne = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, M = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, re = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ie, ae = () => ie ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function oe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ue(r) : oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var se = /;(?![^(]*\))/g, ce = /:([^]+)/, le = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ue(e) {
	let t = {};
	return e.replace(le, (e) => e.startsWith("/*") ? "" : e).split(se).forEach((e) => {
		if (e) {
			let n = e.split(ce);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function N(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = N(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var de = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", fe = /* @__PURE__ */ e(de);
de + "";
function pe(e) {
	return !!e || e === "";
}
function me(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ve(e[i], t[i], n);
	return r;
}
function he(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ve(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function ge(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? he(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ve(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function _e(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function ve(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? _e(e, t, n, me) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : _e(e, t, n, ge) : String(e) === String(t))));
}
var ye = (e) => !!(e && e.__v_isRef === !0), P = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? ye(e) ? P(e.value) : JSON.stringify(e, be, 2) : String(e), be = (e, t) => ye(t) ? be(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[xe(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => xe(e)) } : _(t) ? xe(t) : v(t) && !d(t) && !C(t) ? String(t) : t, xe = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, F, Se = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && F && (F.active ? (this.parent = F, this.index = (F.scopes || (F.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = F;
			try {
				return F = this, e();
			} finally {
				F = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = F, F = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (F === this) F = this.prevScope;
			else {
				let e = F;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Ce() {
	return F;
}
var I, we = /* @__PURE__ */ new WeakSet(), Te = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, F && (F.active ? F.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, we.has(this) && (we.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ke(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, He(this), Me(this);
		let e = I, t = Re;
		I = this, Re = !0;
		try {
			return this.fn();
		} finally {
			Ne(this), I = e, Re = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Ie(e);
			this.deps = this.depsTail = void 0, He(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? we.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Pe(this) && this.run();
	}
	get dirty() {
		return Pe(this);
	}
}, Ee = 0, De, Oe;
function ke(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Oe, Oe = e;
		return;
	}
	e.next = De, De = e;
}
function Ae() {
	Ee++;
}
function je() {
	if (--Ee > 0) return;
	if (Oe) {
		let e = Oe;
		for (Oe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; De;) {
		let t = De;
		for (De = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Me(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ne(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Ie(r), Le(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Fe(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Fe(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ue) || (e.globalVersion = Ue, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Pe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = I, r = Re;
	I = e, Re = !0;
	try {
		Me(e);
		let n = e.fn(e._value);
		(t.version === 0 || j(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		I = n, Re = r, Ne(e), e.flags &= -3;
	}
}
function Ie(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Ie(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Le(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Re = !0, ze = [];
function Be() {
	ze.push(Re), Re = !1;
}
function Ve() {
	let e = ze.pop();
	Re = e === void 0 || e;
}
function He(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = I;
		I = void 0;
		try {
			t();
		} finally {
			I = e;
		}
	}
}
var Ue = 0, We = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ge = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!I || !Re || I === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== I) t = this.activeLink = new We(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, Ke(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ue++, this.notify(e);
	}
	notify(e) {
		Ae();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			je();
		}
	}
};
function Ke(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ke(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var qe = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ Symbol(""), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol("");
function L(e, t, n) {
	if (Re && I) {
		let t = qe.get(e);
		t || qe.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ge()), r.map = t, r.key = n), r.track();
	}
}
function Ze(e, t, n, r, i, a) {
	let o = qe.get(e);
	if (!o) {
		Ue++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ae(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Xe || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Xe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Je)), f(e) && s(o.get(Ye)));
				break;
			case "delete":
				i || (s(o.get(Je)), f(e) && s(o.get(Ye)));
				break;
			case "set": f(e) && s(o.get(Je));
		}
	}
	je();
}
function Qe(e) {
	let t = /* @__PURE__ */ z(e);
	return t === e || (L(t, "iterate", Xe), /* @__PURE__ */ R(e)) ? t : /* @__PURE__ */ It(e) ? /* @__PURE__ */ Ft(e) ? t.map((e) => zt(B(e))) : t.map(zt) : t.map(B);
}
function $e(e) {
	return L(e = /* @__PURE__ */ z(e), "iterate", Xe), e;
}
function et(e, t) {
	return /* @__PURE__ */ It(e) ? zt(/* @__PURE__ */ Ft(e) ? B(t) : t) : B(t);
}
var tt = {
	__proto__: null,
	[Symbol.iterator]() {
		return nt(this, Symbol.iterator, (e) => et(this, e));
	},
	concat(...e) {
		return Qe(this).concat(...e.map((e) => d(e) ? Qe(e) : e));
	},
	entries() {
		return nt(this, "entries", (e) => (e[1] = et(this, e[1]), e));
	},
	every(e, t) {
		return it(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return it(this, "filter", e, t, (e) => e.map((e) => et(this, e)), arguments);
	},
	find(e, t) {
		return it(this, "find", e, t, (e) => et(this, e), arguments);
	},
	findIndex(e, t) {
		return it(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return it(this, "findLast", e, t, (e) => et(this, e), arguments);
	},
	findLastIndex(e, t) {
		return it(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return it(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ot(this, "includes", e);
	},
	indexOf(...e) {
		return ot(this, "indexOf", e);
	},
	join(e) {
		return Qe(this).join(e);
	},
	lastIndexOf(...e) {
		return ot(this, "lastIndexOf", e);
	},
	map(e, t) {
		return it(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return st(this, "pop");
	},
	push(...e) {
		return st(this, "push", e);
	},
	reduce(e, ...t) {
		return at(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return at(this, "reduceRight", e, t);
	},
	shift() {
		return st(this, "shift");
	},
	some(e, t) {
		return it(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return st(this, "splice", e);
	},
	toReversed() {
		return Qe(this).toReversed();
	},
	toSorted(e) {
		return Qe(this).toSorted(e);
	},
	toSpliced(...e) {
		return Qe(this).toSpliced(...e);
	},
	unshift(...e) {
		return st(this, "unshift", e);
	},
	values() {
		return nt(this, "values", (e) => et(this, e));
	}
};
function nt(e, t, n) {
	let r = $e(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ R(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var rt = Array.prototype;
function it(e, t, n, r, i, a) {
	let o = $e(e), s = o !== e && !/* @__PURE__ */ R(e), c = o[t];
	if (c !== rt[t]) {
		let t = c.apply(e, a);
		return s ? B(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, et(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function at(e, t, n, r) {
	let i = $e(e), a = i !== e && !/* @__PURE__ */ R(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = et(e, t)), n.call(this, t, et(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? et(e, c) : c;
}
function ot(e, t, n) {
	let r = /* @__PURE__ */ z(e);
	L(r, "iterate", Xe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Lt(n[0]) ? (n[0] = /* @__PURE__ */ z(n[0]), r[t](...n)) : i;
}
function st(e, t, n = []) {
	Be(), Ae();
	let r = (/* @__PURE__ */ z(e))[t].apply(e, n);
	return je(), Ve(), r;
}
var ct = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), lt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function ut(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ z(this);
	return L(t, "has", e), t.hasOwnProperty(e);
}
var dt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? kt : Ot : i ? Dt : Et).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = tt[t])) return e;
			if (t === "hasOwnProperty") return ut;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ V(e) ? e : n);
		if ((_(t) ? lt.has(t) : ct(t)) || (r || L(e, "get", t), i)) return o;
		if (/* @__PURE__ */ V(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Nt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Nt(o) : /* @__PURE__ */ jt(o) : o;
	}
}, ft = class extends dt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ It(i);
			if (!/* @__PURE__ */ R(n) && !/* @__PURE__ */ It(n) && (i = /* @__PURE__ */ z(i), n = /* @__PURE__ */ z(n)), !a && /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ V(e) ? e : r);
		return e === /* @__PURE__ */ z(r) && s && (o ? j(n, i) && Ze(e, "set", t, n, i) : Ze(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ze(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !lt.has(t)) && L(e, "has", t), n;
	}
	ownKeys(e) {
		return L(e, "iterate", d(e) ? "length" : Je), Reflect.ownKeys(e);
	}
}, pt = class extends dt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, mt = /* @__PURE__ */ new ft(), ht = /* @__PURE__ */ new pt(), gt = /* @__PURE__ */ new ft(!0), _t = (e) => e, vt = (e) => Reflect.getPrototypeOf(e);
function yt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ z(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? _t : t ? zt : B;
		return !t && L(a, "iterate", l ? Ye : Je), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function bt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function xt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ z(r), a = /* @__PURE__ */ z(n);
			e || (j(n, a) && L(i, "get", n), L(i, "get", a));
			let { has: o } = vt(i), s = t ? _t : e ? zt : B;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && L(/* @__PURE__ */ z(t), "iterate", Je), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ z(n), i = /* @__PURE__ */ z(t);
			return e || (j(t, i) && L(r, "has", t), L(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ z(a), s = t ? _t : e ? zt : B;
			return !e && L(o, "iterate", Je), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: bt("add"),
		set: bt("set"),
		delete: bt("delete"),
		clear: bt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ z(this), r = vt(n), i = /* @__PURE__ */ z(e), a = !t && !/* @__PURE__ */ R(e) && !/* @__PURE__ */ It(e) ? i : e;
			return r.has.call(n, a) || j(e, a) && r.has.call(n, e) || j(i, a) && r.has.call(n, i) || (n.add(a), Ze(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ R(n) && !/* @__PURE__ */ It(n) && (n = /* @__PURE__ */ z(n));
			let r = /* @__PURE__ */ z(this), { has: i, get: a } = vt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ z(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? j(n, s) && Ze(r, "set", e, n, s) : Ze(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ z(this), { has: n, get: r } = vt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ z(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ze(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ z(this), t = e.size !== 0, n = e.clear();
			return t && Ze(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = yt(r, e, t);
	}), n;
}
function St(e, t) {
	let n = xt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var Ct = { get: /* @__PURE__ */ St(!1, !1) }, wt = { get: /* @__PURE__ */ St(!1, !0) }, Tt = { get: /* @__PURE__ */ St(!0, !1) }, Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap();
function At(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return /* @__PURE__ */ It(e) ? e : Pt(e, !1, mt, Ct, Et);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return Pt(e, !1, gt, wt, Dt);
}
// @__NO_SIDE_EFFECTS__
function Nt(e) {
	return Pt(e, !0, ht, Tt, Ot);
}
function Pt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = At(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return /* @__PURE__ */ It(e) ? /* @__PURE__ */ Ft(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ z(t) : e;
}
function Rt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && M(e, "__v_skip", !0), e;
}
var B = (e) => v(e) ? /* @__PURE__ */ jt(e) : e, zt = (e) => v(e) ? /* @__PURE__ */ Nt(e) : e;
// @__NO_SIDE_EFFECTS__
function V(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	return Bt(e, !1);
}
function Bt(e, t) {
	return /* @__PURE__ */ V(e) ? e : new Vt(e, t);
}
var Vt = class {
	constructor(e, t) {
		this.dep = new Ge(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ z(e), this._value = t ? e : B(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ R(e) || /* @__PURE__ */ It(e);
		e = n ? e : /* @__PURE__ */ z(e), j(e, t) && (this._rawValue = e, this._value = n ? e : B(e), this.dep.trigger());
	}
};
function Ht(e) {
	return /* @__PURE__ */ V(e) ? e.value : e;
}
var Ut = {
	get: (e, t, n) => t === "__v_raw" ? e : Ht(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ V(i) && !/* @__PURE__ */ V(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Wt(e) {
	return /* @__PURE__ */ Ft(e) ? e : new Proxy(e, Ut);
}
var Gt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ge(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ue - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && I !== this) return ke(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Fe(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Kt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Gt(r, i, n);
}
var qt = {}, Jt = /* @__PURE__ */ new WeakMap(), Yt = void 0;
function Xt(e, t = !1, n = Yt) {
	if (n) {
		let t = Jt.get(n);
		t || Jt.set(n, t = []), t.push(e);
	}
}
function Zt(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ R(e) || o === !1 || o === 0 ? Qt(e, 1) : Qt(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ V(e) ? (g = () => e.value, y = /* @__PURE__ */ R(e)) : /* @__PURE__ */ Ft(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Ft(e) || /* @__PURE__ */ R(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ V(e)) return e.value;
		if (/* @__PURE__ */ Ft(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Be();
			try {
				_();
			} finally {
				Ve();
			}
		}
		let t = Yt;
		Yt = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			Yt = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => Qt(e(), t);
	}
	let x = Ce(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(qt) : qt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => j(e, C[t])) : j(t, C))) {
					_ && _();
					let e = Yt;
					Yt = m;
					try {
						let e = [
							t,
							C === qt ? void 0 : b && C[0] === qt ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						Yt = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new Te(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => Xt(e, !1, m), _ = m.onStop = () => {
		let e = Jt.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			Jt.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function Qt(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ V(e)) Qt(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) Qt(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		Qt(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) Qt(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Qt(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function $t(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		tn(e, t, n);
	}
}
function en(e, t, n, r) {
	if (h(e)) {
		let i = $t(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			tn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(en(e[a], t, n, r));
		return i;
	}
}
function tn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			Be(), $t(o, null, 10, [
				e,
				i,
				a
			]), Ve();
			return;
		}
	}
	nn(e, r, a, i, s);
}
function nn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var U = [], rn = -1, an = [], on = null, sn = 0, cn = /* @__PURE__ */ Promise.resolve(), ln = null;
function un(e) {
	let t = ln || cn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function dn(e) {
	let t = rn + 1, n = U.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = U[r], a = _n(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function fn(e) {
	if (!(e.flags & 1)) {
		let t = _n(e), n = U[U.length - 1];
		!n || !(e.flags & 2) && t >= _n(n) ? U.push(e) : U.splice(dn(t), 0, e), e.flags |= 1, pn();
	}
}
function pn() {
	ln ||= cn.then(vn);
}
function mn(e) {
	if (!d(e)) on && e.id === -1 ? on.splice(sn + 1, 0, e) : e.flags & 1 || (an.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) an.push(e[t]);
	pn();
}
function hn(e, t, n = rn + 1) {
	for (; n < U.length; n++) {
		let t = U[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			U.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function gn(e) {
	if (an.length) {
		let e = [...new Set(an)].sort((e, t) => _n(e) - _n(t));
		if (an.length = 0, on) {
			for (let t = 0; t < e.length; t++) on.push(e[t]);
			return;
		}
		for (on = e, sn = 0; sn < on.length; sn++) {
			let e = on[sn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		on = null, sn = 0;
	}
}
var _n = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function vn(e) {
	try {
		for (rn = 0; rn < U.length; rn++) {
			let e = U[rn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), $t(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; rn < U.length; rn++) {
			let e = U[rn];
			e && (e.flags &= -2);
		}
		rn = -1, U.length = 0, gn(e), ln = null, (U.length || an.length) && vn(e);
	}
}
var W = null, yn = null;
function bn(e) {
	let t = W;
	return W = e, yn = e && e.type.__scopeId || null, t;
}
function xn(e, t = W, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Di(-1);
		let i = bn(t), a = wi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = wi.length; e > a; e--) Ti();
			bn(i), r._d && Di(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Sn(e, n) {
	if (W === null) return e;
	let r = oa(W), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && Qt(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Cn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Be(), en(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ve());
	}
}
function wn(e, t) {
	if ($) {
		let n = $.provides, r = $.parent && $.parent.provides;
		r === n && (n = $.provides = Object.create(r)), n[e] = t;
	}
}
function Tn(e, t, n = !1) {
	let r = qi();
	if (r || Mr) {
		let i = Mr ? Mr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var En = /* @__PURE__ */ Symbol.for("v-scx"), Dn = () => Tn(En);
function On(e, t, n) {
	return kn(e, t, n);
}
function kn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if ($i) {
		if (c === "sync") {
			let e = Dn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $;
	u.call = (e, t, n) => en(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		K(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : fn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = Zt(e, n, u);
	return $i && (f ? f.push(h) : d && h()), h;
}
function An(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? jn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Xi(this), s = kn(i, a.bind(r), n);
	return o(), s;
}
function jn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Mn = /* @__PURE__ */ Symbol("_vte"), Nn = (e) => e.__isTeleport, Pn = /* @__PURE__ */ Symbol("_leaveCb");
function Fn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Si) {
			t = n;
			break;
		}
	}
	return t;
}
function In(e) {
	if (!Gn(e)) return Nn(e.type) && e.children ? Fn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function Ln(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Ln(Nn(n.type) && In(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Rn(e, t) {
	return h(e) ? /* @__PURE__ */ s({ name: e.name }, t, { setup: e }) : e;
}
function zn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Bn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Vn = /* @__PURE__ */ new WeakMap();
function Hn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Hn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Wn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Hn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? oa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ z(v), b = v === t ? i : (e) => !Bn(_, e) && u(y, e), x = (e, t) => !(t && Bn(_, t));
	if (m != null && m !== p) {
		if (Un(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ V(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) $t(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ V(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Vn.delete(e);
				};
				t.id = -1, Vn.set(e, t), K(t, r);
			} else Un(e), i();
		}
	}
}
function Un(e) {
	let t = Vn.get(e);
	t && (t.flags |= 8, Vn.delete(e));
}
ae().requestIdleCallback, ae().cancelIdleCallback;
var Wn = (e) => !!e.type.__asyncLoader, Gn = (e) => e.type.__isKeepAlive;
function Kn(e, t) {
	Jn(e, "a", t);
}
function qn(e, t) {
	Jn(e, "da", t);
}
function Jn(e, t, n = $) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Xn(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Gn(e.parent.vnode) && Yn(r, t, n, e), e = e.parent;
	}
}
function Yn(e, t, n, r) {
	let i = Xn(t, e, r, !0);
	rr(() => {
		c(r[t], i);
	}, n);
}
function Xn(e, t, n = $, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Be();
			let i = Xi(n), a = en(t, n, e, r);
			return i(), Ve(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Zn = (e) => (t, n = $) => {
	(!$i || e === "sp") && Xn(e, (...e) => t(...e), n);
}, Qn = Zn("bm"), $n = Zn("m"), er = Zn("bu"), tr = Zn("u"), nr = Zn("bum"), rr = Zn("um"), ir = Zn("sp"), ar = Zn("rtg"), or = Zn("rtc");
function sr(e, t = $) {
	Xn("ec", e, t);
}
var cr = /* @__PURE__ */ Symbol.for("v-ndc");
function lr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Ft(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ R(e), s = /* @__PURE__ */ It(e), e = $e(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? zt(B(e[n])) : B(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (v(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
var ur = (e) => e ? Qi(e) ? oa(e) : ur(e.parent) : null, dr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ur(e.parent),
	$root: (e) => ur(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => br(e),
	$forceUpdate: (e) => e.f ||= () => {
		fn(e.update);
	},
	$nextTick: (e) => e.n ||= un.bind(e.proxy),
	$watch: (e) => An.bind(e)
}), fr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), pr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (fr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else hr && (s[n] = 0);
		}
		let d = dr[n], f, p;
		if (d) return n === "$attrs" && L(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return fr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || fr(n, c) || u(o, c) || u(i, c) || u(dr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function mr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var hr = !0;
function gr(e) {
	let t = br(e), n = e.proxy, i = e.ctx;
	hr = !1, t.beforeCreate && vr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: ee, expose: k, inheritAttrs: te, components: A, directives: j, filters: ne } = t;
	if (u && _r(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ jt(t));
	}
	if (hr = !0, o) for (let e in o) {
		let t = o[e], a = ca({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) yr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			wn(t, e[t]);
		});
	}
	f && vr(f, e, "c");
	function M(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (M(Qn, p), M($n, m), M(er, g), M(tr, _), M(Kn, y), M(qn, b), M(sr, O), M(or, E), M(ar, D), M(nr, S), M(rr, w), M(ir, ee), d(k)) {
		if (k.length) {
			let t = e.exposed ||= {};
			k.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === r && (e.render = T), te != null && (e.inheritAttrs = te), A && (e.components = A), j && (e.directives = j), ee && zn(e);
}
function _r(e, t, n = r) {
	d(e) && (e = Tr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? Tn(r.from || n, r.default, !0) : Tn(r.from || n) : Tn(r), /* @__PURE__ */ V(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function vr(e, t, n) {
	en(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function yr(e, t, n, r) {
	let i = r.includes(".") ? jn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && On(i, n);
	} else if (h(e)) On(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => yr(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && On(i, r, e);
		}
	}
}
function br(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => xr(c, e, o, !0)), xr(c, t, o)), v(t) && a.set(t, c), c;
}
function xr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && xr(e, a, n, !0), i && i.forEach((t) => xr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Sr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Sr = {
	data: Cr,
	props: Dr,
	emits: Dr,
	methods: Er,
	computed: Er,
	beforeCreate: G,
	created: G,
	beforeMount: G,
	mounted: G,
	beforeUpdate: G,
	updated: G,
	beforeDestroy: G,
	beforeUnmount: G,
	destroyed: G,
	unmounted: G,
	activated: G,
	deactivated: G,
	errorCaptured: G,
	serverPrefetch: G,
	components: Er,
	directives: Er,
	watch: Or,
	provide: Cr,
	inject: wr
};
function Cr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function wr(e, t) {
	return Er(Tr(e), Tr(t));
}
function Tr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function G(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Er(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Dr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), mr(e), mr(t ?? {})) : t;
}
function Or(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = G(e[r], t[r]);
	return n;
}
function kr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Ar = 0;
function jr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = kr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Ar++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: la,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || Pi(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, oa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (en(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Mr;
				Mr = l;
				try {
					return e();
				} finally {
					Mr = t;
				}
			}
		};
		return l;
	};
}
var Mr = null, Nr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${k(t)}Modifiers`];
function Pr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Nr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(re)));
	let c, l = i[c = A(n)] || i[c = A(O(n))];
	!l && o && (l = i[c = A(k(n))]), l && en(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, en(u, e, 6, a);
	}
}
var Fr = /* @__PURE__ */ new WeakMap();
function Ir(e, t, n = !1) {
	let r = n ? Fr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Ir(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Lr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, k(t)) || u(e, t));
}
function Rr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = bn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = zi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = zi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : zr(c);
		}
	} catch (t) {
		wi.length = 0, tn(t, e, 1), v = Pi(Si);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Br(y, a)), b = Li(b, y, !1, !0));
	}
	return n.dirs && (b = Li(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Ln(Nn(b.type) && In(b) || b, n.transition), v = b, bn(_), v;
}
var zr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Br = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Vr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Hr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ur(o, r, n) && !Lr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Hr(r, o, l) : !!o;
	return !1;
}
function Hr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Ur(t, e, a) && !Lr(n, a)) return !0;
	}
	return !1;
}
function Ur(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !ve(r, i) : r !== i;
}
function Wr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Gr = {}, Kr = () => Object.create(Gr), qr = (e) => Object.getPrototypeOf(e) === Gr;
function Jr(e, t, n, r = !1) {
	let i = {}, a = Kr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Xr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Mt(i) : e.type.props ? i : a, e.attrs = a;
}
function Yr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ z(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Lr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = O(o);
						i[t] = Zr(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Xr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = k(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Zr(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && Ze(e.attrs, "set", "");
}
function Xr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = O(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Lr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ z(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Zr(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Zr(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Xi(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === k(n)) && (r = !0));
	}
	return r;
}
var Qr = /* @__PURE__ */ new WeakMap();
function $r(e, r, i = !1) {
	let a = i ? Qr : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = $r(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = O(c[e]);
		ei(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = O(e);
		if (ei(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function ei(e) {
	return e[0] !== "$" && !T(e);
}
var ti = (e) => e === "_" || e === "_ctx" || e === "$stable", ni = (e) => d(e) ? e.map(zi) : [zi(e)], ri = (e, t, n) => {
	if (t._n) return t;
	let r = xn((...e) => ni(t(...e)), n);
	return r._c = !1, r;
}, ii = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ti(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = ri(n, i, r);
		else if (i != null) {
			let e = ni(i);
			t[n] = () => e;
		}
	}
}, ai = (e, t) => {
	let n = ni(t);
	e.slots.default = () => n;
}, oi = (e, t, n) => {
	for (let r in t) (n || !ti(r)) && (e[r] = t[r]);
}, si = (e, t, n) => {
	let r = e.slots = Kr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (oi(r, t, n), n && M(r, "_", e, !0)) : ii(t, r);
	} else t && ai(e, t);
}, ci = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : oi(a, n, r) : (o = !n.$stable, ii(n, a)), s = n;
	} else n && (ai(e, n), s = { default: 1 });
	if (o) for (let e in a) !ti(e) && s[e] == null && delete a[e];
}, K = bi;
function li(e) {
	return ui(e);
}
function ui(e, i) {
	let a = ae();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ji(e, t) && (i = he(e), N(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case xi:
				y(e, t, r, i);
				break;
			case Si:
				b(e, t, r, i);
				break;
			case Ci:
				e ?? x(t, r, i, s);
				break;
			case q:
				A(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? j(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, ve);
		}
		d != null && a ? Hn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Hn(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) E(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ee(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, di(e, a), s, u), _ && Cn(e, null, r, "created"), D(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Ui(f, r, e);
		}
		_ && Cn(e, null, r, "beforeMount");
		let v = pi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && K(() => {
			try {
				f && Ui(f, r, e), v && g.enter(d), _ && Cn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, D = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || yi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				D(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Bi(e[l]) : zi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ee = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && fi(r, !1), (g = h.onVnodeBeforeUpdate) && Ui(g, r, n, e), f && Cn(n, e, r, "beforeUpdate"), r && fi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? k(e.dynamicChildren, d, l, r, i, di(n, a), o) : s || se(e, n, l, null, r, i, di(n, a), o, !1), u > 0) {
			if (u & 16) te(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && te(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && K(() => {
			g && Ui(g, r, n, e), f && Cn(n, e, r, "updated");
		}, i);
	}, k = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === q || !ji(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, te = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, A = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (k(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && mi(e, t, !0)) : se(e, t, n, f, i, a, s, c, l);
	}, j = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : M(t, n, r, i, a, o, c) : re(e, t, c);
	}, M = (e, t, n, r, i, a, o) => {
		let s = e.component = Ki(e, r, i);
		if (Gn(e) && (s.ctx.renderer = ve), ea(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = Pi(Si);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, re = (e, t, n) => {
		let r = t.component = e.component;
		if (Vr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = gi(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							K(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				fi(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && ne(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ui(d, s, t, c), fi(e, !0);
				let f = Rr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), he(p), e, i, a), t.el = f.el, u === null && Wr(e, f.el), r && K(r, i), (d = t.props && t.props.onVnodeUpdated) && K(() => Ui(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Wn(t);
				if (fi(e, !1), l && ne(l), !m && (o = c && c.onVnodeBeforeMount) && Ui(o, d, t), fi(e, !0), s && P) {
					let t = () => {
						e.subTree = Rr(e), P(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Rr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && K(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					K(() => Ui(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Wn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && K(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Te(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => fn(u), fi(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Yr(e, t.props, r, n), ci(e, t.children, n), Be(), hn(e), Ve();
	}, se = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				le(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && me(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : me(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, ce = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? Bi(t[p]) : zi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? me(e, a, o, !0, !1, f) : O(t, r, i, a, o, s, c, l, f);
	}, le = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Bi(t[u]) : zi(t[u]);
			if (ji(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Bi(t[p]) : zi(t[p]);
			if (ji(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Bi(t[u]) : zi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) N(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Bi(t[u]) : zi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					N(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ji(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? N(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? hi(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || vi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ue(n, r, p, 2) : _--);
			}
		}
	}, ue = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ue(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, ve);
			return;
		}
		if (c === q) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Ci) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Pn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), K(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Pn];
					a._isLeaving && a[Pn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, N = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Be(), Hn(s, null, n, e, !0), Ve()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Wn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ui(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Cn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== q || d > 0 && d & 64) ? me(l, t, n, !1, !0) : (a === q && d & 384 || !i && u & 16) && me(c, t, n), r && de(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && K(() => {
			_ && Ui(_, t, e), h && Cn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, de = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === q) {
			fe(n, r);
			return;
		}
		if (t === Ci) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, fe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, pe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		_i(c), _i(l), r && ne(r), i.stop(), a ? (a.flags |= 8, N(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, N(o, e, t, n)), s && K(s, t), K(() => {
			e.isUnmounted = !0;
		}, t);
	}, me = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) N(e[o], t, n, r, i);
	}, he = (e) => {
		if (e.shapeFlag & 6) return he(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Mn];
		return n ? h(n) : t;
	}, ge = !1, _e = (e, t, n) => {
		let r;
		e == null ? t._vnode && (N(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, ge ||= (ge = !0, hn(r), gn(), !1);
	}, ve = {
		p: v,
		um: N,
		m: ue,
		r: de,
		mt: M,
		mc: O,
		pc: se,
		pbc: k,
		n: he,
		o: e
	}, ye, P;
	return i && ([ye, P] = i(ve)), {
		render: _e,
		hydrate: ye,
		createApp: jr(_e, ye)
	};
}
function di({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function fi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function pi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function mi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Bi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && mi(t, a)), a.type === xi && (a.patchFlag === -1 && (a = i[e] = Bi(a)), a.el = t.el), a.type === Si && !a.el && (a.el = t.el);
	}
}
function hi(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function gi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : gi(t);
}
function _i(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function vi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? vi(t.subTree) : null;
}
var yi = (e) => e.__isSuspense;
function bi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : mn(e);
}
var q = /* @__PURE__ */ Symbol.for("v-fgt"), xi = /* @__PURE__ */ Symbol.for("v-txt"), Si = /* @__PURE__ */ Symbol.for("v-cmt"), Ci = /* @__PURE__ */ Symbol.for("v-stc"), wi = [], J = null;
function Y(e = !1) {
	wi.push(J = e ? null : []);
}
function Ti() {
	wi.pop(), J = wi[wi.length - 1] || null;
}
var Ei = 1;
function Di(e, t = !1) {
	Ei += e, e < 0 && J && t && (J.hasOnce = !0);
}
function Oi(e) {
	return e.dynamicChildren = Ei > 0 ? J || n : null, Ti(), Ei > 0 && J && J.push(e), e;
}
function X(e, t, n, r, i, a) {
	return Oi(Z(e, t, n, r, i, a, !0));
}
function ki(e, t, n, r, i) {
	return Oi(Pi(e, t, n, r, i, !0));
}
function Ai(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ji(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Mi = ({ key: e }) => e ?? null, Ni = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ V(e) || h(e) ? {
	i: W,
	r: e,
	k: t,
	f: !!n
} : e);
function Z(e, t = null, n = null, r = 0, i = null, a = e === q ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Mi(t),
		ref: t && Ni(t),
		scopeId: yn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: W
	};
	return s ? (Vi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Ei > 0 && !o && J && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && J.push(c), c;
}
var Pi = Fi;
function Fi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === cr) && (e = Si), Ai(e)) {
		let r = Li(e, t, !0);
		return n && Vi(r, n), Ei > 0 && !a && J && (r.shapeFlag & 6 ? J[J.indexOf(e)] = r : J.push(r)), r.patchFlag = -2, r;
	}
	if (sa(e) && (e = e.__vccOpts), t) {
		t = Ii(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = N(e)), v(n) && (/* @__PURE__ */ Lt(n) && !d(n) && (n = s({}, n)), t.style = oe(n));
	}
	let o = g(e) ? 1 : yi(e) ? 128 : Nn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Z(e, t, n, r, i, o, a, !0);
}
function Ii(e) {
	return e ? /* @__PURE__ */ Lt(e) || qr(e) ? s({}, e) : e : null;
}
function Li(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Hi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Mi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Ni(t)) : [a, Ni(t)] : Ni(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== q ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Li(e.ssContent),
		ssFallback: e.ssFallback && Li(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Ln(u, c.clone(u)), u;
}
function Ri(e = " ", t = 0) {
	return Pi(xi, null, e, t);
}
function Q(e = "", t = !1) {
	return t ? (Y(), ki(Si, null, e)) : Pi(Si, null, e);
}
function zi(e) {
	return e == null || typeof e == "boolean" ? Pi(Si) : d(e) ? Pi(q, null, e.slice()) : Ai(e) ? Bi(e) : Pi(xi, null, String(e));
}
function Bi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Li(e);
}
function Vi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Vi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !qr(t) ? t._ctx = W : r === 3 && W && (W.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			Vi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: W
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ri(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Hi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = N([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ui(e, t, n, r = null) {
	en(e, t, 7, [n, r]);
}
var Wi = kr(), Gi = 0;
function Ki(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Wi, o = {
		uid: Gi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Se(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: $r(i, a),
		emitsOptions: Ir(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Pr.bind(null, o), e.ce && e.ce(o), o;
}
var $ = null, qi = () => $ || W, Ji, Yi;
{
	let e = ae(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ji = t("__VUE_INSTANCE_SETTERS__", (e) => $ = e), Yi = t("__VUE_SSR_SETTERS__", (e) => $i = e);
}
var Xi = (e) => {
	let t = $;
	return Ji(e), e.scope.on(), () => {
		e.scope.off(), Ji(t);
	};
}, Zi = () => {
	$ && $.scope.off(), Ji(null);
};
function Qi(e) {
	return e.vnode.shapeFlag & 4;
}
var $i = !1;
function ea(e, t = !1, n = !1) {
	t && Yi(t);
	let { props: r, children: i } = e.vnode, a = Qi(e);
	Jr(e, r, a, t), si(e, i, n || t);
	let o = a ? ta(e, t) : void 0;
	return t && Yi(!1), o;
}
function ta(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, pr);
	let { setup: r } = n;
	if (r) {
		Be();
		let n = e.setupContext = r.length > 1 ? aa(e) : null, i = Xi(e), a = $t(r, e, 0, [e.props, n]), o = y(a);
		if (Ve(), i(), (o || e.sp) && !Wn(e) && zn(e), o) {
			if (a.then(Zi, Zi), t) return a.then((n) => {
				Yi(!0);
				try {
					na(e, n, t);
				} finally {
					Yi(!1);
				}
			}).catch((t) => {
				tn(t, e, 0);
			});
			e.asyncDep = a;
		} else na(e, a, t);
	} else ra(e, t);
}
function na(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Wt(t)), ra(e, n);
}
function ra(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = Xi(e);
		Be();
		try {
			gr(e);
		} finally {
			Ve(), t();
		}
	}
}
var ia = { get(e, t) {
	return L(e, "get", ""), e[t];
} };
function aa(e) {
	return {
		attrs: new Proxy(e.attrs, ia),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function oa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Wt(Rt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in dr) return dr[n](e);
		},
		has(e, t) {
			return t in e || t in dr;
		}
	}) : e.proxy;
}
function sa(e) {
	return h(e) && "__vccOpts" in e;
}
var ca = (e, t) => /* @__PURE__ */ Kt(e, t, $i), la = "3.5.43", ua = void 0, da = typeof window < "u" && window.trustedTypes;
if (da) try {
	ua = /* @__PURE__ */ da.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var fa = ua ? (e) => ua.createHTML(e) : (e) => e, pa = "http://www.w3.org/2000/svg", ma = "http://www.w3.org/1998/Math/MathML", ha = typeof document < "u" ? document : null, ga = ha && /* @__PURE__ */ ha.createElement("template"), _a = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ha.createElementNS(pa, e) : t === "mathml" ? ha.createElementNS(ma, e) : n ? ha.createElement(e, { is: n }) : ha.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ha.createTextNode(e),
	createComment: (e) => ha.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ha.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			ga.innerHTML = fa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ga.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, va = /* @__PURE__ */ Symbol("_vtc");
function ya(e, t, n) {
	let r = e[va];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ba = /* @__PURE__ */ Symbol("_vod"), xa = /* @__PURE__ */ Symbol("_vsh"), Sa = /* @__PURE__ */ Symbol(""), Ca = /(?:^|;)\s*display\s*:/;
function wa(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ea(r, t, "");
			}
			else for (let e in t) n[e] ?? Ea(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ea(r, i, "") : Aa(e, i, !g(t) && t ? t[i] : void 0, o) || Ea(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Sa];
			e && (n += ";" + e), r.cssText = n, a = Ca.test(n);
		}
	} else t && e.removeAttribute("style");
	ba in e && (e[ba] = a ? r.display : "", e[xa] && (r.display = "none"));
}
var Ta = /\s*!important$/;
function Ea(e, t, n) {
	if (d(n)) n.forEach((n) => Ea(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ta.test(n) ? e.setProperty(t, n.replace(Ta, ""), "important") : e.setProperty(t, n);
	else {
		let r = ka(e, t);
		Ta.test(n) ? e.setProperty(k(r), n.replace(Ta, ""), "important") : e[r] = n;
	}
}
var Da = [
	"Webkit",
	"Moz",
	"ms"
], Oa = {};
function ka(e, t) {
	let n = Oa[t];
	if (n) return n;
	let r = O(t);
	if (r !== "filter" && r in e) return Oa[t] = r;
	r = te(r);
	for (let n = 0; n < Da.length; n++) {
		let i = Da[n] + r;
		if (i in e) return Oa[t] = i;
	}
	return t;
}
function Aa(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var ja = "http://www.w3.org/1999/xlink";
function Ma(e, t, n, r, i, a = fe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ja, t.slice(6, t.length)) : e.setAttributeNS(ja, t, n) : n == null || a && !pe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Na(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? fa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = pe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Pa(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Fa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ia = /* @__PURE__ */ Symbol("_vei");
function La(e, t, n, r, i = null) {
	let a = e[Ia] || (e[Ia] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ba(t);
		r ? Pa(e, n, a[t] = Wa(r, i), s) : o && (Fa(e, n, o, s), a[t] = void 0);
	}
}
var Ra = /(Once|Passive|Capture)$/, za = /^on:?(?:Once|Passive|Capture)$/;
function Ba(e) {
	let t, n;
	for (; (n = e.match(Ra)) && !za.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : k(e.slice(2)), t];
}
var Va = 0, Ha = /* @__PURE__ */ Promise.resolve(), Ua = () => Va ||= (Ha.then(() => Va = 0), Date.now());
function Wa(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && en(e, t, 5, a);
			}
		} else en(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ua(), n;
}
var Ga = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ka = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? ya(e, r, c) : t === "style" ? wa(e, n, r) : a(t) ? o(t) || La(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : qa(e, t, r, c)) ? (Na(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ma(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ja(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Na(e, O(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ma(e, t, r, c));
};
function qa(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Ga(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Ga(t) && g(n) ? !1 : t in e;
}
function Ja(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var Ya = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ne(t, e) : t;
};
function Xa(e) {
	e.target.composing = !0;
}
function Za(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Qa = /* @__PURE__ */ Symbol("_assign"), $a = /* @__PURE__ */ Symbol("_initialValue");
function eo(e, t, n) {
	return t && (e = e.trim()), n && (e = re(e)), e;
}
var to = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[$a] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[$a] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Qa] = Ya(i);
		let a = r || i.props && i.props.type === "number";
		Pa(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Qa](eo(e.value, n, a));
		}), (n || a) && Pa(e, "change", () => {
			e.value = eo(e.value, n, a);
		}), t || (Pa(e, "compositionstart", Xa), Pa(e, "compositionend", Za), Pa(e, "change", Za));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[$a];
		delete e[$a], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Qa](eo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Qa] = Ya(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? re(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, no = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ro = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => no.some((n) => e[`${n}Key`] && !t.includes(n))
}, io = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ro[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ao = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, oo = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = k(n.key);
		if (t.some((e) => e === r || ao[e] === r)) return e(n);
	}));
}, so = /* @__PURE__ */ s({ patchProp: Ka }, _a), co;
function lo() {
	return co ||= li(so);
}
var uo = ((...e) => {
	let t = lo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = po(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, fo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function fo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function po(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/lib/sse.ts
async function* mo(e, t) {
	let n = e.getReader(), r = new TextDecoder(), i = "", a = "message", o = [], s;
	function c() {
		if (!o.length) return;
		let e = {
			event: a,
			data: o.join("\n"),
			id: s
		};
		return a = "message", o = [], s = void 0, e;
	}
	let l = () => {
		n.cancel().catch(() => {});
	};
	t?.addEventListener("abort", l, { once: !0 });
	try {
		for (;;) {
			if (t?.aborted) throw new DOMException("Aborted", "AbortError");
			let e = await n.read();
			if (t?.aborted) throw new DOMException("Aborted", "AbortError");
			i += r.decode(e.value, { stream: !e.done });
			let l;
			for (; (l = i.indexOf("\n")) >= 0;) {
				let e = i.slice(0, l);
				if (i = i.slice(l + 1), e.endsWith("\r") && (e = e.slice(0, -1)), !e) {
					let e = c();
					e && (yield e);
					continue;
				}
				if (e.startsWith(":")) continue;
				let t = e.indexOf(":"), n = t < 0 ? e : e.slice(0, t), r = t < 0 ? "" : e.slice(t + 1);
				r.startsWith(" ") && (r = r.slice(1)), n === "event" ? a = r : n === "data" ? o.push(r) : n === "id" && (s = r);
			}
			if (e.done) {
				if (i) {
					let e = i.replace(/\r$/, "");
					e.startsWith("data:") && o.push(e.slice(5).replace(/^ /, ""));
				}
				let e = c();
				e && (yield e);
				break;
			}
		}
	} finally {
		t?.removeEventListener("abort", l), await n.cancel().catch(() => {}), n.releaseLock();
	}
}
//#endregion
//#region src/lib/hermes-api.ts
var ho = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, go = "/api/plugins/chathermes";
function _o(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/chat\/stream)?|v1\/capabilities|v1\/runs\/[A-Za-z0-9_-]+(?:\/(?:stop|events))?)$/.test(t)) throw Error("Invalid Hermes API path.");
	return go + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function vo(e, t, n = {}, r = "application/json") {
	let i = await fetch(_o(e, t), {
		...n,
		headers: {
			accept: r,
			...n.body ? { "content-type": "application/json" } : {}
		},
		credentials: "same-origin",
		redirect: "manual",
		cache: "no-store"
	});
	if (i.type === "opaqueredirect" || i.status >= 300 && i.status < 400) throw Error("Hermes redirected the request. Sign in to the dashboard and retry.");
	return i;
}
async function yo(e, t, n = {}) {
	let r = await vo(e, t, n);
	if (!r.ok) throw new ho(r.status, `Request failed (${r.status})`);
	return r.json();
}
function bo(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function xo(e) {
	let t = bo(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function So(e) {
	return xo(bo(e)?.session ?? e);
}
function Co(e) {
	let t = bo(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(xo),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function wo(e) {
	let t = bo(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !bo(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = bo(t?.pagination);
	return {
		messages: n,
		pagination: typeof r?.returned == "number" && typeof r.limit == "number" ? {
			returned: r.returned,
			limit: r.limit
		} : void 0
	};
}
var To = {
	capabilities: (e, t) => yo(e, "/v1/capabilities", { signal: t }),
	sessions: async (e, t = 0, n) => Co(await yo(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => So(await yo(e, "/api/sessions", {
		method: "POST",
		body: "{}",
		signal: t
	})),
	session: async (e, t, n) => So(await yo(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n })),
	rename: async (e, t, n, r) => So(await yo(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	async messages(e, t, n) {
		let r = [];
		for (let i = 0;;) {
			let a = wo(await yo(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${i}&order=oldest&inline_images=false`, { signal: n }));
			if (r.push(...a.messages), !a.pagination || a.pagination.returned < a.pagination.limit || !a.messages.length) return r;
			i += a.messages.length;
		}
	},
	async *stream(e, t, n, r) {
		let i = await vo(e, `/api/sessions/${encodeURIComponent(t)}/chat/stream`, {
			method: "POST",
			body: JSON.stringify({ input: n }),
			signal: r
		}, "text/event-stream");
		if (!i.ok) throw new ho(i.status, `Send failed (${i.status})`);
		if (!i.body) throw Error("Stream unavailable");
		yield* mo(i.body, r);
	},
	runStatus: (e, t, n) => yo(e, `/v1/runs/${encodeURIComponent(t)}`, { signal: n }),
	async *runEvents(e, t, n) {
		let r = await vo(e, `/v1/runs/${encodeURIComponent(t)}/events`, { signal: n }, "text/event-stream");
		if (!r.ok) throw new ho(r.status, `Run events failed (${r.status})`);
		if (!r.body) throw Error("Stream unavailable");
		yield* mo(r.body, n);
	},
	stop: (e, t) => yo(e, `/v1/runs/${encodeURIComponent(t)}/stop`, { method: "POST" })
};
function Eo(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
function Do(e) {
	try {
		let t = JSON.parse(e.data);
		return t && typeof t == "object" ? t : {};
	} catch {
		return {};
	}
}
//#endregion
//#region src/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var Oo = { class: "session-head flex flex-col-reverse items-stretch gap-6" }, ko = ["disabled"], Ao = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, jo = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Mo = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, No = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 gap-1 overflow-y-auto"
}, Po = ["aria-current", "onClick"], Fo = { class: "truncate" }, Io = { class: "text-xs text-[#a3a3a3] dark:text-[#a3a3a3]" }, Lo = ["aria-label", "onClick"], Ro = ["disabled"], zo = /* @__PURE__ */ Rn({
	__name: "SessionSidebar",
	props: {
		sessions: {},
		selected: {},
		loading: { type: Boolean },
		error: {},
		hasMore: { type: Boolean },
		busy: { type: Boolean }
	},
	emits: [
		"select",
		"create",
		"more",
		"retry",
		"rename"
	],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ H(""), i = /* @__PURE__ */ H("");
		function a(e) {
			r.value = e.id, i.value = e.title || "";
		}
		function o() {
			i.value.trim() && n("rename", r.value, i.value.trim()), r.value = "";
		}
		return (t, s) => (Y(), X(q, null, [
			Z("div", Oo, [s[5] ||= Z("h2", { class: "text-xs font-semibold text-[#a3a3a3] dark:text-[#a3a3a3]" }, "Recents", -1), Z("button", {
				class: "primary small rounded-xl text-left bg-[#303030] px-3 py-3 text-base font-medium text-[#f4f4f4] hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55 dark:bg-[#303030] dark:hover:bg-[#424242]",
				disabled: e.busy,
				onClick: s[0] ||= (e) => n("create")
			}, "New chat", 8, ko)]),
			e.error ? (Y(), X("p", Ao, [Ri(P(e.error) + " ", 1), Z("button", {
				class: "underline",
				onClick: s[1] ||= (e) => n("retry")
			}, "Retry")])) : Q("v-if", !0),
			e.loading && !e.sessions.length ? (Y(), X("p", jo, "Loading sessions…")) : e.sessions.length ? (Y(), X("nav", No, [(Y(!0), X(q, null, lr(e.sessions, (t) => (Y(), X("div", {
				key: t.id,
				class: N(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [r.value === t.id ? (Y(), X(q, { key: 0 }, [Sn(Z("input", {
				"onUpdate:modelValue": s[2] ||= (e) => i.value = e,
				"aria-label": "Session title",
				maxlength: "160",
				class: "min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-sm text-[#f4f4f4] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white",
				onKeydown: [oo(o, ["enter"]), s[3] ||= oo((e) => r.value = "", ["esc"])]
			}, null, 544), [[to, i.value]]), Z("button", {
				"aria-label": "Save title",
				class: "rounded-md px-2 py-2 text-sm text-[#f4f4f4] hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				onClick: o
			}, "Save")], 64)) : (Y(), X(q, { key: 1 }, [Z("button", {
				class: "session-select grid min-w-0 flex-1 gap-0.5 px-2.5 py-2.5 text-left text-[#f4f4f4] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-current": e.selected === t.id ? "page" : void 0,
				onClick: (e) => n("select", t.id)
			}, [Z("span", Fo, P(t.title || "Untitled session"), 1), Z("small", Io, P(t.source || "Hermes"), 1)], 8, Po), Z("button", {
				class: "icon-button rounded-md px-2 py-1 text-xl text-[#f4f4f4] hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-label": `Rename ${t.title || "Untitled session"}`,
				onClick: (e) => a(t)
			}, "✎", 8, Lo)], 64))], 2))), 128))])) : (Y(), X("p", Mo, "No conversations yet.")),
			e.hasMore ? (Y(), X("button", {
				key: 4,
				class: "load-more rounded-lg border border-[#424242] px-3 py-2 text-sm text-[#f4f4f4] hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-55 dark:border-[#424242]",
				disabled: e.loading,
				onClick: s[4] ||= (e) => n("more")
			}, P(e.loading ? "Loading…" : "Load more"), 9, Ro)) : Q("v-if", !0)
		], 64));
	}
}), Bo = {
	class: "transcript flex min-h-0 w-full flex-1 flex-col gap-7 overflow-y-auto px-4 py-6 text-[#f4f4f4] min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9",
	role: "log",
	"aria-label": "Conversation",
	"aria-live": "polite"
}, Vo = {
	key: 0,
	class: "muted text-sm text-[#a3a3a3]"
}, Ho = {
	key: 1,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, Uo = {
	key: 0,
	class: "grid gap-2 pt-8 text-[#b4b4b4]"
}, Wo = { class: "message-content whitespace-pre-wrap break-words text-base leading-7" }, Go = {
	key: 2,
	class: "thinking-chip flex w-fit items-center gap-3 rounded-full bg-[#303030] px-4 py-2 text-sm text-[#e5e5e5]",
	role: "status"
}, Ko = {
	key: 3,
	class: "message assistant w-full self-start"
}, qo = { class: "message-content whitespace-pre-wrap break-words text-base leading-7" }, Jo = /* @__PURE__ */ Rn({
	__name: "ChatTranscript",
	props: {
		messages: {},
		draft: {},
		loading: { type: Boolean },
		progress: {},
		thinking: { type: Boolean },
		home: { type: Boolean }
	},
	emits: ["suggest"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = ca(() => n.messages.filter((e) => e.role !== "system"));
		return (t, n) => (Y(), X("div", Bo, [
			e.loading ? (Y(), X("div", Vo, "Loading conversation…")) : !i.value.length && !e.draft && !e.thinking ? (Y(), X("div", Ho, [n[4] ||= Z("div", { class: "m-auto text-center" }, [Z("h2", { class: "text-2xl font-medium" }, "What can I help with?"), Z("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, "Ask Hermes a question or continue a conversation.")], -1), e.home ? (Y(), X("div", Uo, [Z("button", {
				class: "flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]",
				onClick: n[0] ||= (e) => r("suggest", "Help me review my latest project changes")
			}, [...n[2] ||= [Z("span", { "aria-hidden": "true" }, "⌘", -1), Z("span", { class: "truncate" }, "Help me review my latest project changes", -1)]]), Z("button", {
				class: "flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]",
				onClick: n[1] ||= (e) => r("suggest", "Find the most useful next step for my work")
			}, [...n[3] ||= [Z("span", { "aria-hidden": "true" }, "✳", -1), Z("span", { class: "truncate" }, "Find the most useful next step for my work", -1)]])])) : Q("v-if", !0)])) : Q("v-if", !0),
			(Y(!0), X(q, null, lr(i.value, (e, t) => (Y(), X("article", {
				key: e.id || t,
				class: N(["message max-w-full", [e.role, e.role === "user" ? "self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]" : e.role === "tool" ? "border-l-2 border-[#525252] pl-3 text-sm text-[#a3a3a3]" : "w-full self-start"]])
			}, [Z("div", Wo, P(Ht(Eo)(e.content) || "[Non-text content]"), 1)], 2))), 128)),
			e.thinking ? (Y(), X("div", Go, [...n[5] ||= [Z("span", {
				class: "thinking-dot size-2 rounded-full bg-white",
				"aria-hidden": "true"
			}, null, -1), Ri("Hermes is thinking…", -1)]])) : Q("v-if", !0),
			(Y(!0), X(q, null, lr(e.progress, (e, t) => (Y(), X("div", {
				key: t,
				class: "tool-progress border-l-2 border-[#525252] px-3 py-1 text-[13px] text-[#a3a3a3]"
			}, P(e), 1))), 128)),
			e.draft ? (Y(), X("article", Ko, [Z("div", qo, P(e.draft), 1)])) : Q("v-if", !0)
		]));
	}
}), Yo = ["disabled"], Xo = { class: "flex items-center gap-3" }, Zo = ["aria-expanded", "disabled"], Qo = { class: "composer-hint flex-1 px-1 text-[11px] text-[#a3a3a3]" }, $o = [
	"disabled",
	"aria-label",
	"title"
], es = {
	key: 0,
	class: "absolute bottom-full left-0 mb-2 max-w-[280px] rounded-2xl border border-[#424242] bg-[#212121] p-4 text-sm text-[#b4b4b4]",
	role: "status"
}, ts = /* @__PURE__ */ Rn({
	__name: "ChatComposer",
	props: {
		disabled: { type: Boolean },
		sending: { type: Boolean },
		reason: {},
		suggestedPrompt: {}
	},
	emits: ["send"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ H(""), a = /* @__PURE__ */ H(!1);
		On(() => n.suggestedPrompt, (e) => {
			e && (i.value = e);
		}, { immediate: !0 });
		function o() {
			let e = i.value.trim();
			e && (r("send", e), i.value = "");
		}
		function s(e) {
			e.key === "Enter" && !e.shiftKey && !e.isComposing && (e.preventDefault(), o());
		}
		return (t, n) => (Y(), X("form", {
			class: "composer relative mx-auto mb-3 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:mb-6 min-[701px]:w-[calc(100%-48px)]",
			onSubmit: io(o, ["prevent"])
		}, [
			n[5] ||= Z("label", {
				class: "sr-only",
				for: "prompt"
			}, "Message Hermes", -1),
			Sn(Z("textarea", {
				id: "prompt",
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				rows: "2",
				placeholder: "Message Hermes…",
				disabled: e.disabled || e.sending,
				class: "max-h-[35vh] min-h-14 w-full resize-y bg-transparent px-2 py-1 text-base leading-relaxed text-[#f4f4f4] outline-none placeholder:text-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55",
				onKeydown: s
			}, null, 40, Yo), [[to, i.value]]),
			Z("div", Xo, [
				Z("button", {
					class: "grid size-10 shrink-0 place-items-center rounded-full bg-[#424242] text-3xl text-white disabled:opacity-55",
					type: "button",
					"aria-label": "Attachment options",
					"aria-expanded": a.value,
					disabled: e.disabled || e.sending,
					onClick: n[1] ||= (e) => a.value = !a.value
				}, "+", 8, Zo),
				Z("p", Qo, P(e.reason || "Enter to send · Shift+Enter for a new line"), 1),
				Z("button", {
					class: "send-button grid size-11 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
					type: "submit",
					disabled: e.disabled || e.sending || !i.value.trim(),
					"aria-label": e.sending ? "Working…" : "Send message",
					title: e.sending ? "Working…" : "Send message"
				}, [...n[3] ||= [Z("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
					class: "size-5",
					"aria-hidden": "true"
				}, [Z("path", { d: "M12 19V5m-6 6 6-6 6 6" })], -1)]], 8, $o)
			]),
			a.value ? (Y(), X("div", es, [n[4] ||= Ri("Attachments are not available through session chat yet.", -1), Z("button", {
				type: "button",
				class: "mt-3 block text-white underline",
				onClick: n[2] ||= (e) => a.value = !1
			}, "Close")])) : Q("v-if", !0)
		], 32));
	}
}), ns = { class: "app-shell flex min-h-dvh bg-[#212121] font-sans text-[#f4f4f4] dark:bg-[#212121] dark:text-[#f4f4f4]" }, rs = { class: "brand flex items-center gap-2.5 px-2 text-2xl font-semibold" }, is = { class: "sidebar-foot mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, as = ["value"], os = { class: "main-panel flex h-dvh min-w-0 flex-1 flex-col" }, ss = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, cs = ["aria-expanded"], ls = { class: "min-w-0 flex-1 truncate text-base font-medium" }, us = { class: "topbar-profile max-w-[30%] truncate rounded-full bg-[#303030] px-3 py-1.5 text-xs text-[#b4b4b4]" }, ds = {
	key: 0,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]",
	role: "status"
}, fs = {
	key: 1,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-[#e5e5e5] dark:bg-[#303030] dark:text-[#e5e5e5]",
	role: "status"
}, ps = ["disabled"], ms = {
	key: 2,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, hs = /* @__PURE__ */ Rn({
	__name: "App",
	setup(e) {
		let t = /* @__PURE__ */ H(""), n = /* @__PURE__ */ H(""), r = /* @__PURE__ */ H([]), i = /* @__PURE__ */ H([]), a = /* @__PURE__ */ H({}), o = /* @__PURE__ */ H(0), s = /* @__PURE__ */ H(!1), c = /* @__PURE__ */ H(!1), l = /* @__PURE__ */ H(!1), u = /* @__PURE__ */ H(!1), d = /* @__PURE__ */ H(!1), f = /* @__PURE__ */ H(!navigator.onLine), p = /* @__PURE__ */ H(""), m = /* @__PURE__ */ H(""), h = /* @__PURE__ */ H(""), g = /* @__PURE__ */ H([]), _ = /* @__PURE__ */ H(!1), v = /* @__PURE__ */ H(!1), y = /* @__PURE__ */ H(""), b = /* @__PURE__ */ H(!1), x = /* @__PURE__ */ H(""), S = /* @__PURE__ */ H(null), C = /* @__PURE__ */ H(null), w = ca(() => a.value.features?.session_chat_streaming === !0 && a.value.endpoints?.session_chat_stream?.method === "POST" && a.value.endpoints.session_chat_stream.path === "/api/sessions/{session_id}/chat/stream"), T, E, D, O = 0, ee = 0, k = 0, te = 0, A, j, ne = !1;
		function M() {
			let e = new URLSearchParams(location.search);
			return {
				profile: e.get("profile") || "",
				session: e.get("session") || ""
			};
		}
		function re(e = !1) {
			let r = new URL(location.href);
			r.searchParams.delete("profile"), r.searchParams.delete("session"), t.value && r.searchParams.set("profile", t.value), n.value && r.searchParams.set("session", n.value), history[e ? "replaceState" : "pushState"]({}, "", r.pathname + r.search + r.hash);
		}
		function ie() {
			O++, k++, A?.abort(), j?.abort(), y.value = "", v.value = !1, E?.abort(), D?.abort(), l.value = !1, u.value = !1, d.value = !1;
		}
		function ae() {
			ie(), T?.abort(), c.value = !1;
		}
		async function oe(e = !1) {
			T?.abort();
			let n = new AbortController();
			T = n;
			let i = t.value;
			c.value = !0, p.value = "";
			try {
				let a = await To.sessions(i, e ? o.value : 0, n.signal);
				if (n !== T || i !== t.value) return;
				let c = a.sessions;
				r.value = e ? [...r.value, ...c.filter((e) => !r.value.some((t) => t.id === e.id))] : c, o.value = typeof a.offset == "number" && typeof a.limit == "number" ? a.offset + a.limit : e ? o.value + c.length : c.length, s.value = a.has_more ?? (typeof a.total == "number" ? o.value < a.total : c.length === 30);
			} catch (e) {
				n === T && !n.signal.aborted && (p.value = e instanceof Error ? e.message : "Could not load sessions");
			} finally {
				n === T && (c.value = !1, T = void 0);
			}
		}
		async function se() {
			if (!n.value) return !1;
			te++, A?.abort(), E?.abort();
			let e = new AbortController();
			E = e;
			let r = O, a = t.value, o = n.value;
			l.value = !0, m.value = "";
			try {
				let t = await To.messages(a, o, e.signal);
				if (r === O && e === E) return i.value = t, !0;
			} catch (t) {
				r === O && e === E && !e.signal.aborted && (m.value = t instanceof Error ? t.message : "Could not load messages");
			} finally {
				e === E && (l.value = !1, E = void 0);
			}
			return !1;
		}
		async function ce(e, c = !1) {
			if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
				p.value = "Invalid profile name";
				return;
			}
			ae(), t.value = e, n.value = "", r.value = [], i.value = [], a.value = {}, h.value = "", g.value = [], p.value = "", m.value = "", o.value = 0, s.value = !1, _.value = !1, c || re();
			let l = ++ee;
			oe();
			try {
				let n = await To.capabilities(e);
				l === ee && t.value === e && (a.value = n);
			} catch {
				l === ee && t.value === e && (a.value = {});
			}
		}
		function le(e, t = !1) {
			x.value = "", ie(), n.value = e, i.value = [], h.value = "", g.value = [], m.value = "", _.value = !1, t || re(), se(), S.value?.focus();
		}
		async function ue() {
			if (f.value) return;
			let e = t.value, r = n.value, i = O;
			try {
				let a = await To.create(e);
				return i !== O || t.value !== e || n.value !== r || (await oe(), i !== O || t.value !== e || n.value !== r) ? void 0 : (le(a.id), a.id);
			} catch (a) {
				i === O && t.value === e && n.value === r && (p.value = a instanceof Error ? a.message : "Could not create session");
			}
		}
		async function de(e) {
			let r = O, i = t.value, a = await ue();
			a && r + 1 === O && i === t.value && n.value === a && (x.value = e);
		}
		async function fe(e, n) {
			let i = t.value, a = O;
			try {
				if (await To.rename(i, e, n), a !== O || i !== t.value) return;
				let o = r.value.find((t) => t.id === e);
				o && (o.title = n);
			} catch (e) {
				a === O && i === t.value && (p.value = e instanceof Error ? e.message : "Could not rename session");
			}
		}
		function pe(e) {
			let t = Do(e);
			if (!y.value && typeof t.run_id == "string" && (y.value = t.run_id), (e.event === "assistant.delta" || e.event === "tool.started") && (v.value = !1), (e.event === "run.failed" || e.event === "run.cancelled" || e.event === "error") && (y.value = ""), e.event === "assistant.delta") h.value += typeof t.delta == "string" ? t.delta : typeof t.text == "string" ? t.text : "";
			else if (e.event === "tool.started") g.value.push(`Using ${typeof t.tool_name == "string" ? t.tool_name : typeof t.tool == "string" ? t.tool : "tool"}…`);
			else if (e.event === "tool.completed") g.value.push("Tool completed.");
			else if (e.event === "tool.failed") g.value.push("A tool failed.");
			else if (e.event === "approval.request") return d.value = !0, D?.abort(), "approval";
			else if (e.event === "run.completed") return y.value = "", "completed";
			else if (e.event === "run.failed" || e.event === "run.cancelled") throw Error(`Turn ${e.event.slice(4)}. Check session history before retrying.`);
			else if (e.event === "error") throw Error("Turn failed. Check session history before retrying.");
		}
		async function me(e) {
			if (!n.value || u.value || d.value || f.value || !w.value) return;
			u.value = !0, v.value = !0, y.value = "", m.value = "", h.value = "", g.value = [], D = new AbortController();
			let r = O, i = ++k, a = t.value, o = n.value, s = !1;
			try {
				for await (let t of To.stream(a, o, e, D.signal)) {
					if (r !== O) return;
					if (i !== k) continue;
					let e = pe(t);
					if (e === "completed" && (s = !0), e === "approval") break;
				}
				if (r !== O || i !== k || d.value) return;
				if (s && (y.value = ""), !s) throw Error("Stream ended without confirmation. Check session history before retrying.");
				if (!await se()) throw Error("Turn completed, but history could not be loaded. Refresh history before sending again.");
				h.value = "", g.value = [], await oe();
			} catch (e) {
				r === O && i === k && !d.value && (m.value = e instanceof Error ? e.message : "Send failed. Check session history before retrying.");
			} finally {
				r === O && i === k && (u.value = !1, v.value = !1);
			}
		}
		async function he(e, t, n, r) {
			if (e !== O || r.signal.aborted) return !1;
			let a = ++te, o = E;
			try {
				let s = await To.messages(t, n, r.signal);
				if (e === O && a === te && !r.signal.aborted && !o) return i.value = s, !0;
			} catch {}
			return !1;
		}
		async function ge() {
			if (document.visibilityState !== "visible" || !n.value || ne) return;
			A?.abort();
			let e = new AbortController();
			A = e;
			let r = O, i = t.value, a = n.value, o = y.value;
			ne = !0;
			let s;
			try {
				if (await he(r, i, a, e), r !== O || e.signal.aborted || !o || y.value !== o || d.value) return;
				let t = await To.runStatus(i, o, e.signal);
				if (r !== O || e.signal.aborted || y.value !== o) return;
				let n = typeof t.status == "string" ? t.status : typeof t.run?.status == "string" ? t.run.status : "";
				if (s = ++k, [
					"completed",
					"failed",
					"cancelled",
					"interrupted",
					"stopped"
				].includes(n)) {
					D?.abort(), y.value = "";
					return;
				}
				j = D, D = e, u.value = !0, v.value = !0, h.value = "", g.value = [], m.value = "";
				for await (let t of To.runEvents(i, o, e.signal)) {
					if (r !== O || s !== k) return;
					let e = pe(t);
					if (e === "completed" || e === "approval") break;
				}
			} catch (e) {
				r === O && e instanceof ho && e.status === 404 && (s = ++k, D?.abort(), y.value = "");
			} finally {
				r === O && s === k && (y.value || (j?.abort(), j = void 0), y.value = "", u.value = !1, v.value = !1, await he(r, i, a, e) && r === O && !e.signal.aborted && (h.value = "", g.value = [], m.value = "")), ne = !1, A === e && (A = void 0);
			}
		}
		function _e() {
			location.href = "/";
		}
		async function ve() {
			await se();
		}
		function ye() {
			f.value = !navigator.onLine;
		}
		function be() {
			let e = M(), n = ce(e.profile, !0), r = O;
			n.then(() => {
				r === O && t.value === e.profile && e.session && le(e.session, !0);
			});
		}
		function xe() {
			_.value = !1, S.value?.focus();
		}
		async function F() {
			_.value = !0, await un(), C.value?.focus();
		}
		function Se(e) {
			e.key === "Escape" && _.value && xe();
		}
		return $n(async () => {
			b.value = !!S.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", ge), addEventListener("online", ye), addEventListener("offline", ye), addEventListener("popstate", be), addEventListener("keydown", Se);
			let e = M(), n = ce(e.profile, !0), r = O;
			await n, r === O && t.value === e.profile && e.session && le(e.session, !0);
		}), rr(() => {
			document.removeEventListener("visibilitychange", ge), ae(), removeEventListener("online", ye), removeEventListener("offline", ye), removeEventListener("popstate", be), removeEventListener("keydown", Se);
		}), (e, a) => (Y(), X("div", ns, [
			Z("aside", {
				class: N(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-5 bg-[#171717] px-[18px] py-6 text-[#f4f4f4] shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-[#171717] dark:text-[#f4f4f4]", _.value ? "translate-x-0" : "-translate-x-full"]),
				"aria-label": "Navigation"
			}, [
				Z("div", rs, [
					a[3] ||= Z("span", { class: "brand-mark grid size-9 shrink-0 place-items-center text-white" }, "✳", -1),
					a[4] ||= Z("span", null, "ChatHermes", -1),
					Z("button", {
						ref_key: "closeButton",
						ref: C,
						class: "mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Close navigation",
						onClick: xe
					}, "×", 512)
				]),
				Pi(zo, {
					sessions: r.value,
					selected: n.value,
					loading: c.value,
					error: p.value,
					"has-more": s.value,
					busy: f.value,
					onSelect: le,
					onCreate: ue,
					onMore: a[0] ||= (e) => oe(!0),
					onRetry: a[1] ||= (e) => oe(),
					onRename: fe
				}, null, 8, [
					"sessions",
					"selected",
					"loading",
					"error",
					"has-more",
					"busy"
				]),
				Z("div", is, [
					a[5] ||= Z("label", { for: "profile-field" }, "Profile (blank uses current)", -1),
					Z("input", {
						id: "profile-field",
						class: "profile-field w-full rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-sm text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						value: t.value,
						placeholder: "Current profile",
						onChange: a[2] ||= (e) => ce(e.target.value.trim())
					}, null, 40, as),
					Z("span", null, [Z("span", { class: N(["status-dot mr-2 inline-block size-2 rounded-full", f.value ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), Ri(P(f.value ? "Offline · read only" : "Connected through dashboard"), 1)])
				])
			], 2),
			_.value ? (Y(), X("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				onClick: xe
			})) : Q("v-if", !0),
			Z("main", os, [
				Z("header", ss, [
					Z("button", {
						ref_key: "menuButton",
						ref: S,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": _.value,
						onClick: F
					}, [...a[6] ||= [Z("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [Z("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, cs),
					Z("h1", ls, P(r.value.find((e) => e.id === n.value)?.title || (n.value ? "Conversation" : "ChatHermes")), 1),
					Z("span", us, P(t.value || "Current profile"), 1),
					a[7] ||= Z("span", {
						class: "grid size-8 shrink-0 place-items-center text-2xl",
						"aria-label": "ChatHermes logo"
					}, "✳", -1),
					b.value ? (Y(), X("button", {
						key: 0,
						class: "shrink-0 rounded-lg px-2 py-2 text-xs hover:bg-[#303030]",
						onClick: _e
					}, "← Back to dashboard")) : Q("v-if", !0)
				]),
				f.value ? (Y(), X("div", ds, "You are offline. Messages cannot be loaded or sent.")) : Q("v-if", !0),
				d.value ? (Y(), X("div", fs, [a[8] ||= Ri("Approval is pending. Resolve the request in Hermes, then reload this conversation here to inspect history. Sending stays locked until you leave this conversation or reload the page; confirm the previous turn finished before sending again. ", -1), Z("button", {
					class: "underline disabled:opacity-55",
					disabled: l.value,
					onClick: ve
				}, "Reload conversation", 8, ps)])) : Q("v-if", !0),
				m.value ? (Y(), X("div", ms, [Ri(P(m.value) + " ", 1), n.value ? (Y(), X("button", {
					key: 0,
					class: "underline",
					onClick: se
				}, "Refresh history")) : Q("v-if", !0)])) : Q("v-if", !0),
				Pi(Jo, {
					messages: i.value,
					draft: h.value,
					loading: l.value,
					progress: g.value,
					thinking: v.value,
					home: !n.value,
					onSuggest: de
				}, null, 8, [
					"messages",
					"draft",
					"loading",
					"progress",
					"thinking",
					"home"
				]),
				(Y(), ki(ts, {
					key: JSON.stringify([t.value, n.value]),
					disabled: !n.value || f.value || l.value || d.value || !w.value,
					sending: u.value,
					"suggested-prompt": x.value,
					reason: n.value ? f.value ? "Offline · sending is unavailable." : d.value ? "Approval is pending in Hermes." : w.value ? void 0 : "Streaming turns are unavailable for this profile." : "Select or create a conversation to begin.",
					onSend: me
				}, null, 8, [
					"disabled",
					"sending",
					"suggested-prompt",
					"reason"
				]))
			])
		]));
	}
});
//#endregion
//#region src/main.ts
function gs() {
	return uo(hs);
}
//#endregion
export { hs as App, gs as createChatHermesApp };
