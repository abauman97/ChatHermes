//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
};
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function n(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var r = {}, i = [], a = () => {}, o = () => !1, s = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), c = (e) => e.startsWith("onUpdate:"), l = Object.assign, u = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, d = Object.prototype.hasOwnProperty, f = (e, t) => d.call(e, t), p = Array.isArray, m = (e) => C(e) === "[object Map]", h = (e) => C(e) === "[object Set]", g = (e) => C(e) === "[object Date]", _ = (e) => typeof e == "function", v = (e) => typeof e == "string", y = (e) => typeof e == "symbol", b = (e) => typeof e == "object" && !!e, x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch), S = Object.prototype.toString, C = (e) => S.call(e), w = (e) => C(e).slice(8, -1), T = (e) => C(e) === "[object Object]", E = (e) => v(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, D = /* @__PURE__ */ n(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), O = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, k = /-\w/g, A = O((e) => e.replace(k, (e) => e.slice(1).toUpperCase())), ee = /\B([A-Z])/g, te = O((e) => e.replace(ee, "-$1").toLowerCase()), ne = O((e) => e.charAt(0).toUpperCase() + e.slice(1)), j = O((e) => e ? `on${ne(e)}` : ""), M = (e, t) => !Object.is(e, t), re = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ie = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ae = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, oe, se = () => oe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function ce(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = v(r) ? fe(r) : ce(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (v(e) || b(e)) return e;
}
var le = /;(?![^(]*\))/g, ue = /:([^]+)/, de = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function fe(e) {
	let t = {};
	return e.replace(de, (e) => e.startsWith("/*") ? "" : e).split(le).forEach((e) => {
		if (e) {
			let n = e.split(ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function pe(e) {
	let t = "";
	if (v(e)) t = e;
	else if (p(e)) for (let n = 0; n < e.length; n++) {
		let r = pe(e[n]);
		r && (t += r + " ");
	}
	else if (b(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var N = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", P = /* @__PURE__ */ n(N);
N + "";
function me(e) {
	return !!e || e === "";
}
function he(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ye(e[i], t[i], n);
	return r;
}
function ge(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ye(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function _e(e, t, n) {
	let r = m(e), i = m(t);
	if (r || i || (r = h(e), i = h(t), r || i)) return r && i ? ge(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ye(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ve(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function ye(e, t, n) {
	if (e === t) return !0;
	let r = g(e), i = g(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = y(e), i = y(t), r || i ? e === t : (r = p(e), i = p(t), r || i ? r && i ? ve(e, t, n, he) : !1 : (r = b(e), i = b(t), r || i ? !r || !i ? !1 : ve(e, t, n, _e) : String(e) === String(t))));
}
function be(e, t) {
	return e.findIndex((e) => ye(e, t));
}
var xe = (e) => !!(e && e.__v_isRef === !0), F = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? xe(e) ? F(e.value) : JSON.stringify(e, Se, 2) : String(e), Se = (e, t) => xe(t) ? Se(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ce(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ce(e)) } : y(t) ? Ce(t) : b(t) && !p(t) && !T(t) ? String(t) : t, Ce = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, I, we = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && I && (I.active ? (this.parent = I, this.index = (I.scopes || (I.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = I;
			try {
				return I = this, e();
			} finally {
				I = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = I, I = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (I === this) I = this.prevScope;
			else {
				let e = I;
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
function Te() {
	return I;
}
var L, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, I && (I.active ? I.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ee.has(this) && (Ee.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || je(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Pe(this);
		let e = L, t = Be;
		L = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), L = e, Be = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Re(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ee.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ie(this) && this.run();
	}
	get dirty() {
		return Ie(this);
	}
}, Oe = 0, ke, Ae;
function je(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Ae, Ae = e;
		return;
	}
	e.next = ke, ke = e;
}
function Me() {
	Oe++;
}
function Ne() {
	if (--Oe > 0) return;
	if (Ae) {
		let e = Ae;
		for (Ae = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ke;) {
		let t = ke;
		for (ke = void 0; t;) {
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
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Fe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Re(r), ze(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ie(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Le(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Le(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ie(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = Be;
	L = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || M(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, Be = r, Fe(e), e.flags &= -3;
	}
}
function Re(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Re(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ze(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Be = !0, Ve = [];
function R() {
	Ve.push(Be), Be = !1;
}
function He() {
	let e = Ve.pop();
	Be = e === void 0 || e;
}
function Ue(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = L;
		L = void 0;
		try {
			t();
		} finally {
			L = e;
		}
	}
}
var We = 0, Ge = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ke = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!L || !Be || L === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== L) t = this.activeLink = new Ge(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		Me();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ne();
		}
	}
};
function qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Je = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ Symbol(""), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol("");
function Qe(e, t, n) {
	if (Be && L) {
		let t = Je.get(e);
		t || Je.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ke()), r.map = t, r.key = n), r.track();
	}
}
function $e(e, t, n, r, i, a) {
	let o = Je.get(e);
	if (!o) {
		We++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Me(), t === "clear") o.forEach(s);
	else {
		let i = p(e), a = i && E(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ze || !y(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ze)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ye)), m(e) && s(o.get(Xe)));
				break;
			case "delete":
				i || (s(o.get(Ye)), m(e) && s(o.get(Xe)));
				break;
			case "set": m(e) && s(o.get(Ye));
		}
	}
	Ne();
}
function et(e) {
	let t = /* @__PURE__ */ B(e);
	return t === e || (Qe(t, "iterate", Ze), /* @__PURE__ */ Rt(e)) ? t : /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e) ? t.map((e) => Ht(Vt(e))) : t.map(Ht) : t.map(Vt);
}
function tt(e) {
	return Qe(e = /* @__PURE__ */ B(e), "iterate", Ze), e;
}
function nt(e, t) {
	return /* @__PURE__ */ Lt(e) ? Ht(/* @__PURE__ */ It(e) ? Vt(t) : t) : Vt(t);
}
var rt = {
	__proto__: null,
	[Symbol.iterator]() {
		return it(this, Symbol.iterator, (e) => nt(this, e));
	},
	concat(...e) {
		return et(this).concat(...e.map((e) => p(e) ? et(e) : e));
	},
	entries() {
		return it(this, "entries", (e) => (e[1] = nt(this, e[1]), e));
	},
	every(e, t) {
		return ot(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ot(this, "filter", e, t, (e) => e.map((e) => nt(this, e)), arguments);
	},
	find(e, t) {
		return ot(this, "find", e, t, (e) => nt(this, e), arguments);
	},
	findIndex(e, t) {
		return ot(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ot(this, "findLast", e, t, (e) => nt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ot(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ot(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ct(this, "includes", e);
	},
	indexOf(...e) {
		return ct(this, "indexOf", e);
	},
	join(e) {
		return et(this).join(e);
	},
	lastIndexOf(...e) {
		return ct(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ot(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return lt(this, "pop");
	},
	push(...e) {
		return lt(this, "push", e);
	},
	reduce(e, ...t) {
		return st(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return st(this, "reduceRight", e, t);
	},
	shift() {
		return lt(this, "shift");
	},
	some(e, t) {
		return ot(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return lt(this, "splice", e);
	},
	toReversed() {
		return et(this).toReversed();
	},
	toSorted(e) {
		return et(this).toSorted(e);
	},
	toSpliced(...e) {
		return et(this).toSpliced(...e);
	},
	unshift(...e) {
		return lt(this, "unshift", e);
	},
	values() {
		return it(this, "values", (e) => nt(this, e));
	}
};
function it(e, t, n) {
	let r = tt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Rt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var at = Array.prototype;
function ot(e, t, n, r, i, a) {
	let o = tt(e), s = o !== e && !/* @__PURE__ */ Rt(e), c = o[t];
	if (c !== at[t]) {
		let t = c.apply(e, a);
		return s ? Vt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, nt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function st(e, t, n, r) {
	let i = tt(e), a = i !== e && !/* @__PURE__ */ Rt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = nt(e, t)), n.call(this, t, nt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? nt(e, c) : c;
}
function ct(e, t, n) {
	let r = /* @__PURE__ */ B(e);
	Qe(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ zt(n[0]) ? (n[0] = /* @__PURE__ */ B(n[0]), r[t](...n)) : i;
}
function lt(e, t, n = []) {
	R(), Me();
	let r = (/* @__PURE__ */ B(e))[t].apply(e, n);
	return Ne(), He(), r;
}
var ut = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), dt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function ft(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ B(this);
	return Qe(t, "has", e), t.hasOwnProperty(e);
}
var pt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? jt : At : i ? kt : Ot).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = p(e);
		if (!r) {
			let e;
			if (a && (e = rt[t])) return e;
			if (t === "hasOwnProperty") return ft;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Ut(e) ? e : n);
		if ((y(t) ? dt.has(t) : ut(t)) || (r || Qe(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Ut(o)) {
			let e = a && E(t) ? o : o.value;
			return r && b(e) ? /* @__PURE__ */ Ft(e) : e;
		}
		return b(o) ? r ? /* @__PURE__ */ Ft(o) : /* @__PURE__ */ Nt(o) : o;
	}
}, mt = class extends pt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = p(e) && E(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Lt(i);
			if (!/* @__PURE__ */ Rt(n) && !/* @__PURE__ */ Lt(n) && (i = /* @__PURE__ */ B(i), n = /* @__PURE__ */ B(n)), !a && /* @__PURE__ */ Ut(i) && !/* @__PURE__ */ Ut(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Ut(e) ? e : r);
		return e === /* @__PURE__ */ B(r) && s && (o ? M(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = f(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && $e(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!y(t) || !dt.has(t)) && Qe(e, "has", t), n;
	}
	ownKeys(e) {
		return Qe(e, "iterate", p(e) ? "length" : Ye), Reflect.ownKeys(e);
	}
}, ht = class extends pt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, gt = /* @__PURE__ */ new mt(), _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new mt(!0), yt = (e) => e, bt = (e) => Reflect.getPrototypeOf(e);
function xt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ B(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? yt : t ? Ht : Vt;
		return !t && Qe(a, "iterate", c ? Xe : Ye), l(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function St(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ct(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ B(r), a = /* @__PURE__ */ B(n);
			e || (M(n, a) && Qe(i, "get", n), Qe(i, "get", a));
			let { has: o } = bt(i), s = t ? yt : e ? Ht : Vt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Qe(/* @__PURE__ */ B(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ B(n), i = /* @__PURE__ */ B(t);
			return e || (M(t, i) && Qe(r, "has", t), Qe(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ B(a), s = t ? yt : e ? Ht : Vt;
			return !e && Qe(o, "iterate", Ye), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return l(n, e ? {
		add: St("add"),
		set: St("set"),
		delete: St("delete"),
		clear: St("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ B(this), r = bt(n), i = /* @__PURE__ */ B(e), a = !t && !/* @__PURE__ */ Rt(e) && !/* @__PURE__ */ Lt(e) ? i : e;
			return r.has.call(n, a) || M(e, a) && r.has.call(n, e) || M(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Rt(n) && !/* @__PURE__ */ Lt(n) && (n = /* @__PURE__ */ B(n));
			let r = /* @__PURE__ */ B(this), { has: i, get: a } = bt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ B(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? M(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ B(this), { has: n, get: r } = bt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ B(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && $e(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ B(this), t = e.size !== 0, n = e.clear();
			return t && $e(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = xt(r, e, t);
	}), n;
}
function wt(e, t) {
	let n = Ct(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(f(n, r) && r in t ? n : t, r, i);
}
var Tt = { get: /* @__PURE__ */ wt(!1, !1) }, Et = { get: /* @__PURE__ */ wt(!1, !0) }, Dt = { get: /* @__PURE__ */ wt(!0, !1) }, Ot = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap();
function Mt(e) {
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
function Nt(e) {
	return /* @__PURE__ */ Lt(e) ? e : z(e, !1, gt, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return z(e, !1, vt, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return z(e, !0, _t, Dt, At);
}
function z(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Mt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return /* @__PURE__ */ Lt(e) ? /* @__PURE__ */ It(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ B(t) : e;
}
function Bt(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && ie(e, "__v_skip", !0), e;
}
var Vt = (e) => b(e) ? /* @__PURE__ */ Nt(e) : e, Ht = (e) => b(e) ? /* @__PURE__ */ Ft(e) : e;
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function V(e) {
	return Gt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return Gt(e, !0);
}
function Gt(e, t) {
	return /* @__PURE__ */ Ut(e) ? e : new Kt(e, t);
}
var Kt = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ B(e), this._value = t ? e : Vt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Rt(e) || /* @__PURE__ */ Lt(e);
		e = n ? e : /* @__PURE__ */ B(e), M(e, t) && (this._rawValue = e, this._value = n ? e : Vt(e), this.dep.trigger());
	}
};
function H(e) {
	return /* @__PURE__ */ Ut(e) ? e.value : e;
}
var qt = {
	get: (e, t, n) => t === "__v_raw" ? e : H(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Ut(i) && !/* @__PURE__ */ Ut(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Jt(e) {
	return /* @__PURE__ */ It(e) ? e : new Proxy(e, qt);
}
var Yt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return je(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Le(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Xt(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new Yt(r, i, n);
}
var Zt = {}, Qt = /* @__PURE__ */ new WeakMap(), $t = void 0;
function en(e, t = !1, n = $t) {
	if (n) {
		let t = Qt.get(n);
		t || Qt.set(n, t = []), t.push(e);
	}
}
function tn(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ Rt(e) || o === !1 || o === 0 ? nn(e, 1) : nn(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ Ut(e) ? (h = () => e.value, y = /* @__PURE__ */ Rt(e)) : /* @__PURE__ */ It(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ It(e) || /* @__PURE__ */ Rt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Ut(e)) return e.value;
		if (/* @__PURE__ */ It(e)) return f(e);
		if (_(e)) return d ? d(e, 2) : e();
	})) : h = _(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (g) {
			R();
			try {
				g();
			} finally {
				He();
			}
		}
		let t = $t;
		$t = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			$t = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => nn(e(), t);
	}
	let x = Te(), S = () => {
		m.stop(), x && x.active && u(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(Zt) : Zt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => M(e, C[t])) : M(n, C))) {
					g && g();
					let e = $t;
					$t = m;
					try {
						let e = [
							n,
							C === Zt ? void 0 : b && C[0] === Zt ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						$t = e;
					}
				}
			} else m.run();
		}
	};
	return l && l(w), m = new De(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => en(e, !1, m), g = m.onStop = () => {
		let e = Qt.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			Qt.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function nn(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Ut(e)) nn(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) nn(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		nn(e, t, n);
	});
	else if (T(e)) {
		for (let r in e) nn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && nn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function rn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		on(e, t, n);
	}
}
function an(e, t, n, r) {
	if (_(e)) {
		let i = rn(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			on(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(an(e[a], t, n, r));
		return i;
	}
}
function on(e, t, n, i = !0) {
	let a = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = t && t.appContext.config || r;
	if (t) {
		let r = t.parent, i = t.proxy, a = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, a) === !1) return;
			}
			r = r.parent;
		}
		if (o) {
			R(), rn(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	sn(e, n, a, i, s);
}
function sn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var cn = [], ln = -1, un = [], dn = null, fn = 0, pn = /* @__PURE__ */ Promise.resolve(), mn = null;
function hn(e) {
	let t = mn || pn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function gn(e) {
	let t = ln + 1, n = cn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = cn[r], a = Sn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function _n(e) {
	if (!(e.flags & 1)) {
		let t = Sn(e), n = cn[cn.length - 1];
		!n || !(e.flags & 2) && t >= Sn(n) ? cn.push(e) : cn.splice(gn(t), 0, e), e.flags |= 1, vn();
	}
}
function vn() {
	mn ||= pn.then(Cn);
}
function yn(e) {
	if (!p(e)) dn && e.id === -1 ? dn.splice(fn + 1, 0, e) : e.flags & 1 || (un.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) un.push(e[t]);
	vn();
}
function bn(e, t, n = ln + 1) {
	for (; n < cn.length; n++) {
		let t = cn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			cn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function xn(e) {
	if (un.length) {
		let e = [...new Set(un)].sort((e, t) => Sn(e) - Sn(t));
		if (un.length = 0, dn) {
			for (let t = 0; t < e.length; t++) dn.push(e[t]);
			return;
		}
		for (dn = e, fn = 0; fn < dn.length; fn++) {
			let e = dn[fn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		dn = null, fn = 0;
	}
}
var Sn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Cn(e) {
	try {
		for (ln = 0; ln < cn.length; ln++) {
			let e = cn[ln];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), rn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; ln < cn.length; ln++) {
			let e = cn[ln];
			e && (e.flags &= -2);
		}
		ln = -1, cn.length = 0, xn(e), mn = null, (cn.length || un.length) && Cn(e);
	}
}
var wn = null, Tn = null;
function En(e) {
	let t = wn;
	return wn = e, Tn = e && e.type.__scopeId || null, t;
}
function Dn(e, t = wn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Ui(-1);
		let i = En(t), a = zi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = zi.length; e > a; e--) Vi();
			En(i), r._d && Ui(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function On(e, t) {
	if (wn === null) return e;
	let n = Sa(wn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && nn(o), i.push({
			dir: a,
			instance: n,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function kn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (R(), an(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function An(e, t) {
	if (ca) {
		let n = ca.provides, r = ca.parent && ca.parent.provides;
		r === n && (n = ca.provides = Object.create(r)), n[e] = t;
	}
}
function jn(e, t, n = !1) {
	let r = la();
	if (r || Kr) {
		let i = Kr ? Kr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
var Mn = /* @__PURE__ */ Symbol.for("v-scx"), Nn = () => jn(Mn);
function Pn(e, t, n) {
	return Fn(e, t, n);
}
function Fn(e, t, n = r) {
	let { immediate: i, deep: o, flush: s, once: c } = n, u = l({}, n), d = t && i || !t && s !== "post", f;
	if (ha) {
		if (s === "sync") {
			let e = Nn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = ca;
	u.call = (e, t, n) => an(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		Ci(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : _n(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = tn(e, t, u);
	return ha && (f ? f.push(h) : d && h()), h;
}
function In(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? Ln(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = fa(this), s = Fn(i, a.bind(r), n);
	return o(), s;
}
function Ln(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Rn = /* @__PURE__ */ Symbol("_vte"), zn = (e) => e.__isTeleport, Bn = /* @__PURE__ */ Symbol("_leaveCb");
function Vn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Li) {
			t = n;
			break;
		}
	}
	return t;
}
function Hn(e) {
	if (!Zn(e)) return zn(e.type) && e.children ? Vn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && _(n.default)) return n.default();
	}
}
function Un(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Un(zn(n.type) && Hn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function U(e, t) {
	return _(e) ? /* @__PURE__ */ l({ name: e.name }, t, { setup: e }) : e;
}
function Wn() {
	let e = la();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Gn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Kn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var qn = /* @__PURE__ */ new WeakMap();
function Jn(e, t, n, i, a = !1) {
	if (p(e)) {
		e.forEach((e, r) => Jn(e, t && (p(t) ? t[r] : t), n, i, a));
		return;
	}
	if (Xn(i) && !a) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Jn(e, t, n, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? Sa(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ B(g), b = g === r ? o : (e) => !Kn(h, e) && f(y, e), x = (e, t) => !(t && Kn(h, t));
	if (m != null && m !== d) {
		if (Yn(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ Ut(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) rn(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ Ut(d);
		if (t || r) {
			let i = () => {
				if (e.f) {
					let n = t ? b(d) ? g[d] : h[d] : x(d) || !e.k ? d.value : h[e.k];
					if (a) p(n) && u(n, s);
					else if (p(n)) n.includes(s) || n.push(s);
					else if (t) h[d] = [s], b(d) && (g[d] = h[d]);
					else {
						let t = [s];
						x(d, e.k) && (d.value = t), e.k && (h[e.k] = t);
					}
				} else t ? (h[d] = c, b(d) && (g[d] = c)) : r && (x(d, e.k) && (d.value = c), e.k && (h[e.k] = c));
			};
			if (c) {
				let t = () => {
					i(), qn.delete(e);
				};
				t.id = -1, qn.set(e, t), Ci(t, n);
			} else Yn(e), i();
		}
	}
}
function Yn(e) {
	let t = qn.get(e);
	t && (t.flags |= 8, qn.delete(e));
}
se().requestIdleCallback, se().cancelIdleCallback;
var Xn = (e) => !!e.type.__asyncLoader, Zn = (e) => e.type.__isKeepAlive;
function Qn(e, t) {
	er(e, "a", t);
}
function $n(e, t) {
	er(e, "da", t);
}
function er(e, t, n = ca) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (nr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Zn(e.parent.vnode) && tr(r, t, n, e), e = e.parent;
	}
}
function tr(e, t, n, r) {
	let i = nr(t, e, r, !0);
	lr(() => {
		u(r[t], i);
	}, n);
}
function nr(e, t, n = ca, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			R();
			let i = fa(n), a = an(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var rr = (e) => (t, n = ca) => {
	(!ha || e === "sp") && nr(e, (...e) => t(...e), n);
}, ir = rr("bm"), ar = rr("m"), or = rr("bu"), sr = rr("u"), cr = rr("bum"), lr = rr("um"), ur = rr("sp"), dr = rr("rtg"), fr = rr("rtc");
function pr(e, t = ca) {
	nr("ec", e, t);
}
var mr = "components", hr = /* @__PURE__ */ Symbol.for("v-ndc");
function gr(e) {
	return v(e) ? _r(mr, e, !1) || e : e || hr;
}
function _r(e, t, n = !0, r = !1) {
	let i = wn || ca;
	if (i) {
		let n = i.type;
		if (e === mr) {
			let e = Ca(n, !1);
			if (e && (e === t || e === A(t) || e === ne(A(t)))) return n;
		}
		let a = vr(i[e] || n[e], t) || vr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function vr(e, t) {
	return e && (e[t] || e[A(t)] || e[ne(A(t))]);
}
function yr(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ It(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Rt(e), s = /* @__PURE__ */ Lt(e), e = tt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Ht(Vt(e[n])) : Vt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (b(e)) {
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
function br(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (p(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function xr(e, t, n, r, i, a) {
	if (n ??= {}, wn.ce || wn.parent && Xn(wn.parent) && wn.parent.ce) {
		let e = a != null && n.key == null ? l({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), G(), q(W, null, [Yi("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = zi.length;
	G();
	let c;
	try {
		let i = o && Sr(o(n)), s = n.key || a || i && i.key;
		c = q(W, { key: (s && !y(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = zi.length; e > s; e--) Vi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Sr(e) {
	return e.some((e) => !Gi(e) || !(e.type === Li || e.type === W && !Sr(e.children))) ? e : null;
}
var Cr = (e) => e ? ma(e) ? Sa(e) : Cr(e.parent) : null, wr = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Cr(e.parent),
	$root: (e) => Cr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Nr(e),
	$forceUpdate: (e) => e.f ||= () => {
		_n(e.update);
	},
	$nextTick: (e) => e.n ||= hn.bind(e.proxy),
	$watch: (e) => In.bind(e)
}), Tr = (e, t) => e !== r && !e.__isScriptSetup && f(e, t), Er = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (t[0] !== "$") {
			let e = s[t];
			if (e !== void 0) switch (e) {
				case 1: return i[t];
				case 2: return a[t];
				case 4: return n[t];
				case 3: return o[t];
			}
			else if (Tr(i, t)) return s[t] = 1, i[t];
			else if (a !== r && f(a, t)) return s[t] = 2, a[t];
			else if (f(o, t)) return s[t] = 3, o[t];
			else if (n !== r && f(n, t)) return s[t] = 4, n[t];
			else Or && (s[t] = 0);
		}
		let u = wr[t], d, p;
		if (u) return t === "$attrs" && Qe(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== r && f(n, t)) return s[t] = 4, n[t];
		if (p = l.config.globalProperties, f(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: i, setupState: a, ctx: o } = e;
		return Tr(a, t) ? (a[t] = n, !0) : i !== r && f(i, t) ? (i[t] = n, !0) : f(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== r && c[0] !== "$" && f(e, c) || Tr(t, c) || f(o, c) || f(i, c) || f(wr, c) || f(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? f(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Dr(e) {
	return p(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Or = !0;
function kr(e) {
	let t = Nr(e), n = e.proxy, r = e.ctx;
	Or = !1, t.beforeCreate && jr(t.beforeCreate, e, "bc");
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: A, inheritAttrs: ee, components: te, directives: ne, filters: j } = t;
	if (u && Ar(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Nt(t));
	}
	if (Or = !0, o) for (let e in o) {
		let t = o[e], i = Z({
			get: _(t) ? t.bind(n, n) : _(t.get) ? t.get.bind(n, n) : a,
			set: !_(t) && _(t.set) ? t.set.bind(n) : a
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (c) for (let e in c) Mr(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			An(t, e[t]);
		});
	}
	d && jr(d, e, "c");
	function M(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (M(ir, f), M(ar, m), M(or, h), M(sr, g), M(Qn, v), M($n, y), M(pr, O), M(fr, E), M(dr, D), M(cr, S), M(lr, w), M(ur, k), p(A)) {
		if (A.length) {
			let t = e.exposed ||= {};
			A.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	T && e.render === a && (e.render = T), ee != null && (e.inheritAttrs = ee), te && (e.components = te), ne && (e.directives = ne), k && Gn(e);
}
function Ar(e, t, n = a) {
	p(e) && (e = Rr(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? jn(r.from || n, r.default, !0) : jn(r.from || n) : jn(r), /* @__PURE__ */ Ut(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function jr(e, t, n) {
	an(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Mr(e, t, n, r) {
	let i = r.includes(".") ? Ln(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && Pn(i, n);
	} else if (_(e)) Pn(i, e.bind(n));
	else if (b(e)) {
		if (p(e)) e.forEach((e) => Mr(e, t, n, r));
		else {
			let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
			_(r) && Pn(i, r, e);
		}
	}
}
function Nr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Pr(c, e, o, !0)), Pr(c, t, o)), b(t) && a.set(t, c), c;
}
function Pr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Pr(e, a, n, !0), i && i.forEach((t) => Pr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Fr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Fr = {
	data: Ir,
	props: Vr,
	emits: Vr,
	methods: Br,
	computed: Br,
	beforeCreate: zr,
	created: zr,
	beforeMount: zr,
	mounted: zr,
	beforeUpdate: zr,
	updated: zr,
	beforeDestroy: zr,
	beforeUnmount: zr,
	destroyed: zr,
	unmounted: zr,
	activated: zr,
	deactivated: zr,
	errorCaptured: zr,
	serverPrefetch: zr,
	components: Br,
	directives: Br,
	watch: Hr,
	provide: Ir,
	inject: Lr
};
function Ir(e, t) {
	return t ? e ? function() {
		return l(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
	} : t : e;
}
function Lr(e, t) {
	return Br(Rr(e), Rr(t));
}
function Rr(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function zr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Br(e, t) {
	return e ? l(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Vr(e, t) {
	return e ? p(e) && p(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : l(/* @__PURE__ */ Object.create(null), Dr(e), Dr(t ?? {})) : t;
}
function Hr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = l(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = zr(e[r], t[r]);
	return n;
}
function Ur() {
	return {
		app: null,
		config: {
			isNativeTag: o,
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
var Wr = 0;
function Gr(e, t) {
	return function(n, r = null) {
		_(n) || (n = l({}, n)), r != null && !b(r) && (r = null);
		let i = Ur(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Wr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ea,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && _(e.install) ? (a.add(e), e.install(c, ...t)) : _(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || Yi(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Sa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (an(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Kr;
				Kr = c;
				try {
					return e();
				} finally {
					Kr = t;
				}
			}
		};
		return c;
	};
}
var Kr = null, qr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${A(t)}Modifiers`] || e[`${te(t)}Modifiers`];
function Jr(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && qr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = a.map(ae)));
	let c, l = i[c = j(t)] || i[c = j(A(t))];
	!l && o && (l = i[c = j(te(t))]), l && an(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, an(u, e, 6, a);
	}
}
var Yr = /* @__PURE__ */ new WeakMap();
function Xr(e, t, n = !1) {
	let r = n ? Yr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!_(e)) {
		let r = (e) => {
			let n = Xr(e, t, !0);
			n && (s = !0, l(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (b(e) && r.set(e, null), null) : (p(a) ? a.forEach((e) => o[e] = null) : l(o, a), b(e) && r.set(e, o), o);
}
function Zr(e, t) {
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, te(t)) || f(e, t));
}
function Qr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = En(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = ea(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = ea(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? s : $r(s);
		}
	} catch (t) {
		zi.length = 0, on(t, e, 1), v = Yi(Li);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = ei(y, a)), b = Qi(b, y, !1, !0));
	}
	return n.dirs && (b = Qi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Un(zn(b.type) && Hn(b) || b, n.transition), v = b, En(_), v;
}
var $r = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || s(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ei = (e, t) => {
	let n = {};
	for (let r in e) (!c(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function ti(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ni(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ri(o, r, n) && !Zr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ni(r, o, l) : !!o;
	return !1;
}
function ni(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ri(t, e, a) && !Zr(n, a)) return !0;
	}
	return !1;
}
function ri(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && b(r) && b(i) ? !ye(r, i) : r !== i;
}
function ii({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ai = {}, oi = () => Object.create(ai), si = (e) => Object.getPrototypeOf(e) === ai;
function ci(e, t, n, r = !1) {
	let i = {}, a = oi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ui(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Pt(i) : e.type.props ? i : a, e.attrs = a;
}
function li(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ B(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Zr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (f(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = A(o);
						i[t] = di(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ui(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = te(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = di(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function ui(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (D(r)) continue;
		let l = t[r], u;
		a && f(a, u = A(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Zr(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ B(n), i = c || r;
		for (let r = 0; r < o.length; r++) {
			let s = o[r];
			n[s] = di(a, t, s, i[s], e, !f(i, s));
		}
	}
	return s;
}
function di(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = f(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && _(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = fa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === te(n)) && (r = !0));
	}
	return r;
}
var fi = /* @__PURE__ */ new WeakMap();
function pi(e, t, n = !1) {
	let a = n ? fi : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, c = {}, u = [], d = !1;
	if (!_(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = pi(e, t, !0);
			l(c, n), r && u.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return b(e) && a.set(e, i), i;
	if (p(s)) for (let e = 0; e < s.length; e++) {
		let t = A(s[e]);
		mi(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = A(e);
		if (mi(t)) {
			let n = s[e], r = c[t] = p(n) || _(n) ? { type: n } : l({}, n), i = r.type, a = !1, o = !0;
			if (p(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = _(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = _(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || f(r, "default")) && u.push(t);
		}
	}
	let m = [c, u];
	return b(e) && a.set(e, m), m;
}
function mi(e) {
	return e[0] !== "$" && !D(e);
}
var hi = (e) => e === "_" || e === "_ctx" || e === "$stable", gi = (e) => p(e) ? e.map(ea) : [ea(e)], _i = (e, t, n) => {
	if (t._n) return t;
	let r = Dn((...e) => gi(t(...e)), n);
	return r._c = !1, r;
}, vi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (hi(n)) continue;
		let i = e[n];
		if (_(i)) t[n] = _i(n, i, r);
		else if (i != null) {
			let e = gi(i);
			t[n] = () => e;
		}
	}
}, yi = (e, t) => {
	let n = gi(t);
	e.slots.default = () => n;
}, bi = (e, t, n) => {
	for (let r in t) (n || !hi(r)) && (e[r] = t[r]);
}, xi = (e, t, n) => {
	let r = e.slots = oi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (bi(r, t, n), n && ie(r, "_", e, !0)) : vi(t, r);
	} else t && yi(e, t);
}, Si = (e, t, n) => {
	let { vnode: i, slots: a } = e, o = !0, s = r;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : bi(a, t, n) : (o = !t.$stable, vi(t, a)), s = t;
	} else t && (yi(e, t), s = { default: 1 });
	if (o) for (let e in a) !hi(e) && s[e] == null && delete a[e];
}, Ci = Fi;
function wi(e) {
	return Ti(e);
}
function Ti(e, t) {
	let n = se();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ki(e, t) && (r = me(e), de(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === i && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Ii:
				y(e, t, n, r);
				break;
			case Li:
				b(e, t, n, r);
				break;
			case Ri:
				e ?? x(t, n, r, s);
				break;
			case W:
				te(e, t, n, r, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, a, o, s, c, l) : f & 6 ? ne(e, t, n, r, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, a, o, s, c, l, _e);
		}
		d != null && a ? Jn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Jn(e.ref, null, o, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, Ei(e, a), s, u), _ && kn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !D(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && ia(f, r, e);
		}
		_ && kn(e, null, r, "beforeMount");
		let v = Oi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && Ci(() => {
			try {
				f && ia(f, r, e), v && g.enter(d), _ && kn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Pi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ta(e[l]) : ea(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && Di(n, !1), (g = h.onVnodeBeforeUpdate) && ia(g, n, t, e), f && kn(t, e, n, "beforeUpdate"), n && Di(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, n, i, Ei(t, a), o) : s || oe(e, t, l, null, n, i, Ei(t, a), o, !1), u > 0) {
			if (u & 16) ee(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && ee(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && Ci(() => {
			g && ia(g, n, t, e), f && kn(t, e, n, "updated");
		}, i);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === W || !Ki(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ee = (e, t, n, i, a) => {
		if (t !== n) {
			if (t !== r) for (let r in t) !D(r) && !(r in n) && c(e, r, t[r], null, a, i);
			for (let r in n) {
				if (D(r)) continue;
				let o = n[r], s = t[r];
				o !== s && r !== "value" && c(e, r, s, o, a, i);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, te = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && ki(e, t, !0)) : oe(e, t, n, f, i, a, s, c, l);
	}, ne = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : j(t, n, r, i, a, o, c) : M(e, t, c);
	}, j = (e, t, n, r, i, a, o) => {
		let s = e.component = sa(e, r, i);
		if (Zn(e) && (s.ctx.renderer = _e), ga(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = Yi(Li);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, M = (e, t, n) => {
		let r = t.component = e.component;
		if (ti(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, ae(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ie = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ji(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							Ci(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Di(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && ia(d, s, t, c), Di(e, !0);
				let f = Qr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), me(p), e, i, a), t.el = f.el, u === null && ii(e, f.el), r && Ci(r, i), (d = t.props && t.props.onVnodeUpdated) && Ci(() => ia(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Xn(t);
				if (Di(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && ia(o, d, t), Di(e, !0), s && ye) {
					let t = () => {
						e.subTree = Qr(e), ye(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Qr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Ci(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Ci(() => ia(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Xn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Ci(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => _n(u), Di(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, li(e, t.props, r, n), Si(e, t.children, n), R(), bn(e), He();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
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
		m & 8 ? (u & 16 && P(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : P(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, ce = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? ta(t[p]) : ea(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? P(e, a, o, !0, !1, f) : O(t, n, r, a, o, s, c, l, f);
	}, le = (e, t, n, r, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? ta(t[u]) : ea(t[u]);
			if (Ki(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? ta(t[p]) : ea(t[p]);
			if (Ki(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, i = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? ta(t[u]) : ea(t[u]), n, i, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) de(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? ta(t[u]) : ea(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					de(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ki(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? de(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Ai(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ni(f) : r;
				C[u] === 0 ? v(null, i, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ue(i, n, p, 2) : _--);
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
			c.move(e, t, n, _e);
			return;
		}
		if (c === W) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ue(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Ri) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Bn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), Ci(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Bn];
					a._isLeaving && a[Bn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (R(), Jn(s, null, n, e, !0), He()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Xn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ia(_, t, e), u & 6) N(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && kn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== W || d > 0 && d & 64) ? P(l, t, n, !1, !0) : (a === W && d & 384 || !i && u & 16) && P(c, t, n), r && fe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Ci(() => {
			_ && ia(_, t, e), h && kn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, fe = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === W) {
			pe(n, r);
			return;
		}
		if (t === Ri) {
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
	}, pe = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, N = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Mi(c), Mi(l), r && re(r), i.stop(), a ? (a.flags |= 8, de(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, de(o, e, t, n)), s && Ci(s, t), Ci(() => {
			e.isUnmounted = !0;
		}, t);
	}, P = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, me = (e) => {
		if (e.shapeFlag & 6) return me(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Rn];
		return n ? h(n) : t;
	}, he = !1, ge = (e, t, n) => {
		let r;
		e == null ? t._vnode && (de(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, he ||= (he = !0, bn(r), xn(), !1);
	}, _e = {
		p: v,
		um: de,
		m: ue,
		r: fe,
		mt: j,
		mc: O,
		pc: oe,
		pbc: A,
		n: me,
		o: e
	}, ve, ye;
	return t && ([ve, ye] = t(_e)), {
		render: ge,
		hydrate: ve,
		createApp: Gr(ge, ve)
	};
}
function Ei({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Di({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Oi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ki(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (p(r) && p(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ta(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && ki(t, a)), a.type === Ii && (a.patchFlag === -1 && (a = i[e] = ta(a)), a.el = t.el), a.type === Li && !a.el && (a.el = t.el);
	}
}
function Ai(e) {
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
function ji(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ji(t);
}
function Mi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ni(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ni(t.subTree) : null;
}
var Pi = (e) => e.__isSuspense;
function Fi(e, t) {
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : yn(e);
}
var W = /* @__PURE__ */ Symbol.for("v-fgt"), Ii = /* @__PURE__ */ Symbol.for("v-txt"), Li = /* @__PURE__ */ Symbol.for("v-cmt"), Ri = /* @__PURE__ */ Symbol.for("v-stc"), zi = [], Bi = null;
function G(e = !1) {
	zi.push(Bi = e ? null : []);
}
function Vi() {
	zi.pop(), Bi = zi[zi.length - 1] || null;
}
var Hi = 1;
function Ui(e, t = !1) {
	Hi += e, e < 0 && Bi && t && (Bi.hasOnce = !0);
}
function Wi(e) {
	return e.dynamicChildren = Hi > 0 ? Bi || i : null, Vi(), Hi > 0 && Bi && Bi.push(e), e;
}
function K(e, t, n, r, i, a) {
	return Wi(J(e, t, n, r, i, a, !0));
}
function q(e, t, n, r, i) {
	return Wi(Yi(e, t, n, r, i, !0));
}
function Gi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ki(e, t) {
	return e.type === t.type && e.key === t.key;
}
var qi = ({ key: e }) => e ?? null, Ji = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ Ut(e) || _(e) ? {
	i: wn,
	r: e,
	k: t,
	f: !!n
} : e);
function J(e, t = null, n = null, r = 0, i = null, a = e === W ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && qi(t),
		ref: t && Ji(t),
		scopeId: Tn,
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
		ctx: wn
	};
	return s ? (na(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Hi > 0 && !o && Bi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Bi.push(c), c;
}
var Yi = Xi;
function Xi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === hr) && (e = Li), Gi(e)) {
		let r = Qi(e, t, !0);
		return n && na(r, n), Hi > 0 && !a && Bi && (r.shapeFlag & 6 ? Bi[Bi.indexOf(e)] = r : Bi.push(r)), r.patchFlag = -2, r;
	}
	if (wa(e) && (e = e.__vccOpts), t) {
		t = Zi(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = pe(e)), b(n) && (/* @__PURE__ */ zt(n) && !p(n) && (n = l({}, n)), t.style = ce(n));
	}
	let o = v(e) ? 1 : Pi(e) ? 128 : zn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return J(e, t, n, r, i, o, a, !0);
}
function Zi(e) {
	return e ? /* @__PURE__ */ zt(e) || si(e) ? l({}, e) : e : null;
}
function Qi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ra(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && qi(l),
		ref: t && t.ref ? n && a ? p(a) ? a.concat(Ji(t)) : [a, Ji(t)] : Ji(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== W ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Qi(e.ssContent),
		ssFallback: e.ssFallback && Qi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Un(u, c.clone(u)), u;
}
function Y(e = " ", t = 0) {
	return Yi(Ii, null, e, t);
}
function $i(e, t) {
	let n = Yi(Ri, null, e);
	return n.staticCount = t, n;
}
function X(e = "", t = !1) {
	return t ? (G(), q(Li, null, e)) : Yi(Li, null, e);
}
function ea(e) {
	return e == null || typeof e == "boolean" ? Yi(Li) : p(e) ? Yi(W, null, e.slice()) : Gi(e) ? ta(e) : Yi(Ii, null, String(e));
}
function ta(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Qi(e);
}
function na(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (p(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), na(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !si(t) ? t._ctx = wn : r === 3 && wn && (wn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (_(t)) {
		if (r & 65) {
			na(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: wn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Y(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ra(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = pe([t.class, r.class]));
		else if (e === "style") t.style = ce([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ia(e, t, n, r = null) {
	an(e, t, 7, [n, r]);
}
var aa = Ur(), oa = 0;
function sa(e, t, n) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || aa, o = {
		uid: oa++,
		vnode: e,
		type: i,
		parent: t,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new we(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(a.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: pi(i, a),
		emitsOptions: Xr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: r,
		inheritAttrs: i.inheritAttrs,
		ctx: r,
		data: r,
		props: r,
		attrs: r,
		slots: r,
		refs: r,
		setupState: r,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Jr.bind(null, o), e.ce && e.ce(o), o;
}
var ca = null, la = () => ca || wn, ua, da;
{
	let e = se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ua = t("__VUE_INSTANCE_SETTERS__", (e) => ca = e), da = t("__VUE_SSR_SETTERS__", (e) => ha = e);
}
var fa = (e) => {
	let t = ca;
	return ua(e), e.scope.on(), () => {
		e.scope.off(), ua(t);
	};
}, pa = () => {
	ca && ca.scope.off(), ua(null);
};
function ma(e) {
	return e.vnode.shapeFlag & 4;
}
var ha = !1;
function ga(e, t = !1, n = !1) {
	t && da(t);
	let { props: r, children: i } = e.vnode, a = ma(e);
	ci(e, r, a, t), xi(e, i, n || t);
	let o = a ? _a(e, t) : void 0;
	return t && da(!1), o;
}
function _a(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Er);
	let { setup: r } = n;
	if (r) {
		R();
		let n = e.setupContext = r.length > 1 ? xa(e) : null, i = fa(e), a = rn(r, e, 0, [e.props, n]), o = x(a);
		if (He(), i(), (o || e.sp) && !Xn(e) && Gn(e), o) {
			if (a.then(pa, pa), t) return a.then((n) => {
				da(!0);
				try {
					va(e, n, t);
				} finally {
					da(!1);
				}
			}).catch((t) => {
				on(t, e, 0);
			});
			e.asyncDep = a;
		} else va(e, a, t);
	} else ya(e, t);
}
function va(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Jt(t)), ya(e, n);
}
function ya(e, t, n) {
	let r = e.type;
	e.render ||= r.render || a;
	{
		let t = fa(e);
		R();
		try {
			kr(e);
		} finally {
			He(), t();
		}
	}
}
var ba = { get(e, t) {
	return Qe(e, "get", ""), e[t];
} };
function xa(e) {
	return {
		attrs: new Proxy(e.attrs, ba),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Sa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Jt(Bt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in wr) return wr[n](e);
		},
		has(e, t) {
			return t in e || t in wr;
		}
	}) : e.proxy;
}
function Ca(e, t = !0) {
	return _(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function wa(e) {
	return _(e) && "__vccOpts" in e;
}
var Z = (e, t) => /* @__PURE__ */ Xt(e, t, ha);
function Ta(e, t, n) {
	try {
		Ui(-1);
		let r = arguments.length;
		return r === 2 ? b(t) && !p(t) ? Gi(t) ? Yi(e, null, [t]) : Yi(e, t) : Yi(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Gi(n) && (n = [n]), Yi(e, t, n));
	} finally {
		Ui(1);
	}
}
var Ea = "3.5.43", Da = void 0, Oa = typeof window < "u" && window.trustedTypes;
if (Oa) try {
	Da = /* @__PURE__ */ Oa.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var ka = Da ? (e) => Da.createHTML(e) : (e) => e, Aa = "http://www.w3.org/2000/svg", ja = "http://www.w3.org/1998/Math/MathML", Ma = typeof document < "u" ? document : null, Na = Ma && /* @__PURE__ */ Ma.createElement("template"), Pa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ma.createElementNS(Aa, e) : t === "mathml" ? Ma.createElementNS(ja, e) : n ? Ma.createElement(e, { is: n }) : Ma.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ma.createTextNode(e),
	createComment: (e) => Ma.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ma.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Na.innerHTML = ka(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Na.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Fa = /* @__PURE__ */ Symbol("_vtc");
function Ia(e, t, n) {
	let r = e[Fa];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var La = /* @__PURE__ */ Symbol("_vod"), Ra = /* @__PURE__ */ Symbol("_vsh"), za = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[La] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Ba(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Ba(e, !0), r.enter(e)) : r.leave(e, () => {
			Ba(e, !1);
		}) : Ba(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Ba(e, t);
	}
};
function Ba(e, t) {
	e.style.display = t ? e[La] : "none", e[Ra] = !t;
}
var Va = /* @__PURE__ */ Symbol(""), Ha = /(?:^|;)\s*display\s*:/;
function Ua(e, t, n) {
	let r = e.style, i = v(n), a = !1;
	if (n && !i) {
		if (t) {
			if (v(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ga(r, t, "");
			}
			else for (let e in t) n[e] ?? Ga(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ga(r, i, "") : Ya(e, i, !v(t) && t ? t[i] : void 0, o) || Ga(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Va];
			e && (n += ";" + e), r.cssText = n, a = Ha.test(n);
		}
	} else t && e.removeAttribute("style");
	La in e && (e[La] = a ? r.display : "", e[Ra] && (r.display = "none"));
}
var Wa = /\s*!important$/;
function Ga(e, t, n) {
	if (p(n)) n.forEach((n) => Ga(e, t, n));
	else if (n ??= "", t.startsWith("--")) Wa.test(n) ? e.setProperty(t, n.replace(Wa, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ja(e, t);
		Wa.test(n) ? e.setProperty(te(r), n.replace(Wa, ""), "important") : e[r] = n;
	}
}
var Ka = [
	"Webkit",
	"Moz",
	"ms"
], qa = {};
function Ja(e, t) {
	let n = qa[t];
	if (n) return n;
	let r = A(t);
	if (r !== "filter" && r in e) return qa[t] = r;
	r = ne(r);
	for (let n = 0; n < Ka.length; n++) {
		let i = Ka[n] + r;
		if (i in e) return qa[t] = i;
	}
	return t;
}
function Ya(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && v(r) && n === r;
}
var Xa = "http://www.w3.org/1999/xlink";
function Za(e, t, n, r, i, a = P(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Xa, t.slice(6, t.length)) : e.setAttributeNS(Xa, t, n) : n == null || a && !me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
}
function Qa(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? ka(n) : n);
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
		r === "boolean" ? n = me(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function $a(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function eo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var to = /* @__PURE__ */ Symbol("_vei");
function no(e, t, n, r, i = null) {
	let a = e[to] || (e[to] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ao(t);
		r ? $a(e, n, a[t] = lo(r, i), s) : o && (eo(e, n, o, s), a[t] = void 0);
	}
}
var ro = /(Once|Passive|Capture)$/, io = /^on:?(?:Once|Passive|Capture)$/;
function ao(e) {
	let t, n;
	for (; (n = e.match(ro)) && !io.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : te(e.slice(2)), t];
}
var oo = 0, so = /* @__PURE__ */ Promise.resolve(), co = () => oo ||= (so.then(() => oo = 0), Date.now());
function lo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (p(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && an(e, t, 5, a);
			}
		} else an(r, t, 5, [e]);
	};
	return n.value = e, n.attached = co(), n;
}
var uo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, fo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Ia(e, r, o) : t === "style" ? Ua(e, n, r) : s(t) ? c(t) || no(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : po(e, t, r, o)) ? (Qa(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Za(e, t, r, o, a, t !== "value")) : e._isVueCE && (mo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? Qa(e, A(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Za(e, t, r, o));
};
function po(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && uo(t) && _(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return uo(t) && v(n) ? !1 : t in e;
}
function mo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = A(t);
	return Array.isArray(n) ? n.some((e) => A(e) === r) : Object.keys(n).some((e) => A(e) === r);
}
var ho = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => re(t, e) : t;
};
function go(e) {
	e.target.composing = !0;
}
function _o(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var vo = /* @__PURE__ */ Symbol("_assign"), yo = /* @__PURE__ */ Symbol("_initialValue");
function bo(e, t, n) {
	return t && (e = e.trim()), n && (e = ae(e)), e;
}
var xo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[yo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[yo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[vo] = ho(i);
		let a = r || i.props && i.props.type === "number";
		$a(e, t ? "change" : "input", (t) => {
			t.target.composing || e[vo](bo(e.value, n, a));
		}), (n || a) && $a(e, "change", () => {
			e.value = bo(e.value, n, a);
		}), t || ($a(e, "compositionstart", go), $a(e, "compositionend", _o), $a(e, "change", _o));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[yo];
		delete e[yo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[vo](bo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[vo] = ho(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ae(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, So = {
	deep: !0,
	created(e, t, n) {
		e[vo] = ho(n), $a(e, "change", () => {
			let t = e._modelValue, n = Do(e), r = e.checked, i = e[vo];
			if (p(t)) {
				let e = be(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (h(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Oo(e, r));
		});
	},
	mounted: Co,
	beforeUpdate(e, t, n) {
		e[vo] = ho(n), Co(e, t, n);
	}
};
function Co(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (p(t)) i = be(t, r.props.value) > -1;
	else if (h(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ye(t, Oo(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var wo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, $a(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ae(Do(e)) : Do(e)), r = e.multiple, i = r ? h(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? p(i) ? t.slice() : t : i];
			try {
				e[vo](i);
			} finally {
				hn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[vo] = ho(r);
	},
	mounted(e, { value: t }) {
		Eo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[vo] = ho(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !To(t, n[1], n[0])) && Eo(e, t);
	}
};
function To(e, t, n) {
	if (!n || p(e)) return ye(e, t);
	if (h(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Eo(e, t) {
	let n = e.multiple, r = p(t);
	if (!n || r || h(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Do(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : be(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (ye(Do(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Do(e) {
	return "_value" in e ? e._value : e.value;
}
function Oo(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ko = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Ao = {
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
	exact: (e, t) => ko.some((n) => e[`${n}Key`] && !t.includes(n))
}, jo = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Ao[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Mo = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, No = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = te(n.key);
		if (t.some((e) => e === r || Mo[e] === r)) return e(n);
	}));
}, Po = /* @__PURE__ */ l({ patchProp: fo }, Pa), Fo;
function Io() {
	return Fo ||= wi(Po);
}
var Lo = ((...e) => {
	let t = Io().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = zo(e);
		if (!r) return;
		let i = t._component;
		!_(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ro(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ro(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function zo(e) {
	return v(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/services/chat-gateway.ts
function Bo(e) {
	let t = e;
	if (!t || t.protocol !== "chathermes.chat.v2" || t.mode !== "native-retained" || t.admission !== !0 || typeof t.reviewed_source != "string" || !Array.isArray(t.operations) || !t.operations.every((e) => typeof e == "string") || !Array.isArray(t.blockers) || !t.blockers.every((e) => typeof e == "string") || !t.guarantees || t.guarantees.crash_safe_idempotency !== !1 || t.guarantees.lossless_snapshot_replay !== !1 || t.guarantees.offline_turn_lease !== !0 || ![
		"crash_safe_idempotency",
		"lossless_snapshot_replay",
		"offline_turn_lease"
	].every((e) => e in t.guarantees)) throw Error("Unsupported native chat contract");
	return t;
}
async function Vo(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	t?.throwIfAborted();
	let n = await fetch("/api/auth/ws-ticket", {
		method: "POST",
		credentials: "same-origin",
		cache: "no-store",
		redirect: "manual",
		signal: t
	});
	if (!n.ok || n.type === "opaqueredirect") throw Error("Sign in to the dashboard to inspect native chat support");
	let r = await n.json(), i = r && typeof r == "object" && "ticket" in r ? r.ticket : void 0;
	if (typeof i != "string" || !i || i.length > 1024) throw Error("Invalid dashboard ticket response");
	t?.throwIfAborted();
	let a = new URL("/api/plugins/chathermes/chat/ws", location.href);
	return a.protocol = location.protocol === "https:" ? "wss:" : "ws:", e && a.searchParams.set("profile", e), new Promise((e, n) => {
		let r = new WebSocket(a, ["hermes-gateway-v1", `hermes-gateway-ticket.${i}`]), o = !1, s = (i, a) => {
			if (!o) {
				o = !0, clearTimeout(l), t?.removeEventListener("abort", c), r.onopen = r.onmessage = r.onerror = r.onclose = null;
				try {
					r.close();
				} catch {}
				a ? n(a) : e(i);
			}
		}, c = () => s(void 0, /* @__PURE__ */ Error("Native chat probe cancelled")), l = setTimeout(() => s(void 0, /* @__PURE__ */ Error("Native chat probe timed out")), 1e4);
		t?.addEventListener("abort", c, { once: !0 }), r.onopen = () => r.send(JSON.stringify({
			jsonrpc: "2.0",
			id: "capabilities",
			method: "chat.capabilities",
			params: {}
		})), r.onmessage = (e) => {
			try {
				if (typeof e.data != "string" || e.data.length > 8192) throw Error("Invalid native chat frame");
				let t = JSON.parse(e.data);
				if (t.jsonrpc !== "2.0" || Array.isArray(t)) throw Error("Invalid native chat frame");
				if (t.id !== "capabilities" || "method" in t) return;
				if ("error" in t) throw Error("Native chat probe rejected");
				s(Bo(t.result));
			} catch {
				s(void 0, /* @__PURE__ */ Error("Unsupported native chat contract"));
			}
		}, r.onerror = r.onclose = () => s(void 0, /* @__PURE__ */ Error("Native chat probe disconnected")), t?.aborted && c();
	});
}
//#endregion
//#region src/services/hermes-api.ts
var Ho = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, Uo = /* @__PURE__ */ new Set(), Wo = /* @__PURE__ */ new Set(), Go = (e, t) => JSON.stringify([e, t]), Ko = "/api/plugins/chathermes";
function qo(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/messages|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/project)?|v1\/(?:capabilities|models))$/.test(t)) throw Error("Invalid Hermes API path.");
	return Ko + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function Jo(e, t, n = {}, r = "application/json") {
	let i = new Headers(n.headers);
	i.set("accept", r), n.body && i.set("content-type", "application/json");
	let a = await fetch(qo(e, t), {
		...n,
		headers: i,
		credentials: "same-origin",
		redirect: "manual",
		cache: "no-store"
	});
	if (a.type === "opaqueredirect" || a.status >= 300 && a.status < 400) throw Error("Hermes redirected the request. Sign in to the dashboard and retry.");
	return a;
}
async function Yo(e, t, n = {}) {
	let r = await Jo(e, t, n);
	if (!r.ok) throw new Ho(r.status, `Request failed (${r.status})`);
	return r.json();
}
function Xo(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function Zo(e) {
	let t = Xo(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function Qo(e) {
	return Zo(Xo(e)?.session ?? e);
}
function $o(e) {
	let t = Xo(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(Zo),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function es(e) {
	let t = Xo(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !Xo(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = Xo(t?.pagination);
	return {
		messages: n,
		pagination: typeof r?.returned == "number" && typeof r.limit == "number" ? {
			returned: r.returned,
			limit: r.limit
		} : void 0
	};
}
var Q = {
	nativeChatCapabilities: Vo,
	isNative: (e) => Uo.has(e),
	profiles: async () => {
		let e = await fetch(Ko + "/profiles", {
			credentials: "same-origin",
			cache: "no-store"
		});
		if (!e.ok) throw new Ho(e.status, "Could not load profiles");
		return e.json();
	},
	scheduled: (e, t) => Yo(e, "/scheduled", { signal: t }),
	scheduledRuns: (e, t, n = 0, r) => Yo(e, `/scheduled/runs?job_id=${encodeURIComponent(t)}&offset=${n}`, { signal: r }),
	scheduledOutput: (e, t, n, r) => Yo(e, `/scheduled/output?job_id=${encodeURIComponent(t)}&run_id=${encodeURIComponent(n)}`, { signal: r }),
	projects: (e, t) => Yo(e, "/projects", { signal: t }),
	project: async (e, t, n) => {
		let r = await Yo(e, `/projects/detail?project_id=${encodeURIComponent(t)}`, { signal: n });
		if (r.project?.id !== t || typeof r.project.label != "string") throw Error("Invalid Hermes Project response");
		return r.project;
	},
	projectInstructions: (e, t, n) => Yo(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, { signal: n }),
	saveProjectInstructions: (e, t, n) => Yo(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify(n)
	}),
	projectManage: (e, t, n) => Yo(e, "/projects/manage", {
		method: "POST",
		body: JSON.stringify({
			action: t,
			...n
		})
	}),
	isWorkspace(e, t) {
		return Wo.has(Go(e, t));
	},
	workspace(e, t) {
		Wo.add(Go(e, t));
	},
	projectCreate: async (e, t) => {
		let n = Qo(await Yo(e, `/projects/session?project_id=${encodeURIComponent(t)}`, {
			method: "POST",
			body: "{}"
		}));
		return Wo.add(Go(e, n.id)), n;
	},
	projectEvents(e, t) {
		let n = new EventSource(Ko + "/project-events?profile=" + encodeURIComponent(e || "default"), { withCredentials: !0 });
		return n.addEventListener("refresh", t), () => n.close();
	},
	models: (e) => Yo(e, "/v1/models"),
	modelOptions: (e) => Yo(e, "/api/model/options"),
	async upload(e, t) {
		let n = await fetch(Ko + "/uploads" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "POST",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t)
		});
		if (!n.ok) throw new Ho(n.status, `Upload failed (${n.status})`);
		return n.json();
	},
	capabilities: async (e, t) => {
		let n = await Yo(e, "/v1/capabilities", { signal: t });
		return n.features?.native_chat === !0 ? Uo.add(e) : Uo.delete(e), n;
	},
	sessions: async (e, t = 0, n) => $o(await Yo(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => {
		let n = Qo(await Yo(e, "/chat/sessions", {
			method: "POST",
			body: "{}",
			signal: t
		}));
		return Wo.add(Go(e, n.id)), n;
	},
	session: async (e, t, n) => {
		let r = Qo(await Yo(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n }));
		return (r.cwd || r.source === "desktop") && Wo.add(Go(e, t)), r;
	},
	rename: async (e, t, n, r) => Qo(await Yo(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	archive: (e, t) => Yo(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ archived: !0 })
	}),
	deleteSession: (e, t) => Yo(e, `/api/sessions/${encodeURIComponent(t)}`, { method: "DELETE" }),
	moveSession: (e, t, n) => Yo(e, `/api/sessions/${encodeURIComponent(t)}/project`, {
		method: "POST",
		body: JSON.stringify({ project_id: n })
	}),
	async messages(e, t, n) {
		let r = [];
		for (let i = 0;;) {
			let a;
			try {
				a = es(await Yo(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${i}&order=oldest&inline_images=false`, { signal: n }));
			} catch (r) {
				if (i === 0 && r instanceof Ho && r.status === 404 && Wo.has(Go(e, t))) return es(await Yo(e, `/workspace/sessions/${encodeURIComponent(t)}/messages`, { signal: n })).messages;
				throw r;
			}
			if (r.push(...a.messages), !a.pagination || a.pagination.returned < a.pagination.limit || !a.messages.length) return r;
			i += a.messages.length;
		}
	}
};
function ts(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
//#endregion
//#region src/vendor/hermes/json-rpc-channel.ts
var ns = (e) => typeof e.id == "string" && typeof e.method == "string" && e.method !== "event", rs = class extends Error {
	code;
	data;
	constructor(e, t) {
		super(e), this.name = "JsonRpcGatewayError", this.code = t?.code, this.data = t?.data;
	}
}, is = -32601, as = -32603, os = 4404;
function ss(e, t = "Hermes RPC failed") {
	let n = e && typeof e == "object" ? e : {};
	return new rs(typeof n.message == "string" && n.message ? n.message : t, {
		code: typeof n.code == "number" ? n.code : void 0,
		data: n.data
	});
}
var cs = 12e4, ls = 8;
new TextDecoder();
var us = (e) => {
	e?.unref?.();
}, ds = class {
	nextId = 0;
	pending = /* @__PURE__ */ new Map();
	transport = null;
	heartbeatTimer = null;
	heartbeatSequence = 0;
	outstandingPings = /* @__PURE__ */ new Set();
	lastLivenessAt = 0;
	backendCountsDeclines = !1;
	requestHandlers = [];
	options;
	constructor(e = {}) {
		this.options = {
			createRequestId: e.createRequestId ?? ((t) => `${e.requestIdPrefix ?? "r"}${t}`),
			heartbeatDeadlineMs: e.heartbeatDeadlineMs ?? 45e3,
			heartbeatIntervalMs: e.heartbeatIntervalMs ?? 15e3,
			heartbeatLiveness: e.heartbeatLiveness ?? "response",
			onEvent: e.onEvent,
			onHeartbeatFailure: e.onHeartbeatFailure,
			onRequestHandlerError: e.onRequestHandlerError,
			onUnhandledRequest: e.onUnhandledRequest,
			requestIdPrefix: e.requestIdPrefix ?? "r",
			requestTimeoutMs: e.requestTimeoutMs ?? cs,
			unrefTimers: e.unrefTimers ?? !1
		};
	}
	get defaultRequestTimeoutMs() {
		return this.options.requestTimeoutMs;
	}
	get connected() {
		return this.transport !== null;
	}
	attach(e) {
		this.stopHeartbeat(), this.transport = e, this.lastLivenessAt = Date.now(), this.backendCountsDeclines = !1;
	}
	detach(e) {
		this.stopHeartbeat(), this.transport = null, this.rejectAllPending(e);
	}
	owns(e) {
		return this.transport === e;
	}
	request(e, t = {}, n = this.options.requestTimeoutMs, r, i = () => /* @__PURE__ */ Error("gateway not connected")) {
		let a = this.transport;
		if (!a) return Promise.reject(i());
		if (r?.aborted) return Promise.reject(new DOMException("Aborted", "AbortError"));
		let o = this.options.createRequestId(++this.nextId);
		return new Promise((i, s) => {
			let c, l = () => {
				c && r && r.removeEventListener("abort", c);
			}, u = {
				resolve: (e) => {
					l(), i(e);
				},
				reject: (e) => {
					l(), s(e);
				}
			};
			n > 0 && (u.timer = setTimeout(() => {
				if (this.pending.delete(o)) {
					l();
					let t = Math.round(n / 1e3);
					s(/* @__PURE__ */ Error(`request timed out after ${t}s: ${e}`));
				}
			}, n), this.options.unrefTimers && us(u.timer)), r && (c = () => {
				this.clearPending(o), l(), s(new DOMException("Aborted", "AbortError"));
			}, r.addEventListener("abort", c, { once: !0 })), this.pending.set(o, u);
			try {
				a.send(JSON.stringify({
					jsonrpc: "2.0",
					id: o,
					method: e,
					params: t
				}));
			} catch (e) {
				this.clearPending(o), l(), s(e instanceof Error ? e : Error(String(e)));
			}
		});
	}
	onRequest(e) {
		return this.requestHandlers.push(e), () => {
			let t = this.requestHandlers.indexOf(e);
			t >= 0 && this.requestHandlers.splice(t, 1);
		};
	}
	deliverRequest(e, t, n, r = !1) {
		let i = !1, a = (t) => {
			if (!i) {
				i = !0;
				try {
					this.transport?.send(JSON.stringify({
						jsonrpc: "2.0",
						id: e,
						...t
					}));
				} catch {}
			}
		}, o = {
			id: e,
			method: t,
			params: n,
			replayed: r,
			respond: (e) => a({ result: e }),
			fail: (e, t) => a({ error: {
				code: e,
				message: t
			} }),
			decline: (e) => {
				this.backendCountsDeclines && a({ error: {
					code: os,
					message: e
				} });
			}
		};
		for (let r of this.requestHandlers) {
			let i;
			try {
				i = r(o);
			} catch (r) {
				return o.fail(as, `server request handler crashed: ${t}`), this.options.onRequestHandlerError?.(r instanceof Error ? r : Error(String(r)), {
					id: e,
					method: t,
					params: n
				}), !1;
			}
			if (i !== !1) return !0;
		}
		return o.fail(is, `no handler for server request: ${t}`), this.options.onUnhandledRequest?.({
			id: e,
			method: t,
			params: n
		}), !1;
	}
	deliverOpenRequests(e) {
		let t = e?.open_requests;
		if (Array.isArray(t)) {
			for (let e of t) if (typeof e?.id == "string" && typeof e.method == "string") {
				let t = e.params && typeof e.params == "object" ? e.params : {};
				this.deliverRequest(e.id, e.method, t, !0);
			}
		}
	}
	handleFrame(e) {
		let t;
		try {
			t = JSON.parse(e);
		} catch {
			return null;
		}
		if (!t || typeof t != "object") return null;
		if (this.options.heartbeatLiveness === "any-inbound" && (this.lastLivenessAt = Date.now()), ns(t)) {
			let e = t.params && typeof t.params == "object" ? t.params : {};
			return this.deliverRequest(t.id, t.method, e), t;
		}
		if (t.id !== void 0 && t.id !== null) {
			if (typeof t.id == "string" && this.outstandingPings.delete(t.id)) return this.lastLivenessAt = Date.now(), t;
			let e = this.pending.get(t.id);
			return e && (this.lastLivenessAt = Date.now(), this.clearPending(t.id), t.error ? e.reject(ss(t.error)) : (this.deliverOpenRequests(t.result), e.resolve(t.result))), t;
		}
		return t.method === "event" && t.params && typeof t.params.type == "string" && (t.params.type === "gateway.ready" && this.advertiseCapabilities(), this.options.onEvent?.(t.params)), t;
	}
	advertiseCapabilities() {
		let e = this.transport;
		this.request("client.capabilities", { server_requests: !0 }).then((t) => {
			this.transport === e && (this.backendCountsDeclines = t?.declines_not_shown === !0);
		}).catch(() => void 0);
	}
	startHeartbeat() {
		this.stopHeartbeat(), this.lastLivenessAt = Date.now();
		let e = this.transport;
		!e || this.options.heartbeatIntervalMs <= 0 || this.options.heartbeatDeadlineMs <= 0 || (this.heartbeatTimer = setInterval(() => {
			if (this.transport !== e) return;
			if (Date.now() - this.lastLivenessAt >= this.options.heartbeatDeadlineMs) {
				this.failHeartbeat(/* @__PURE__ */ Error("WebSocket heartbeat acknowledgement timed out"));
				return;
			}
			let t = `heartbeat-${++this.heartbeatSequence}`;
			this.outstandingPings.add(t), this.outstandingPings.size > ls && this.outstandingPings.delete(this.outstandingPings.values().next().value);
			try {
				e.send(JSON.stringify({
					jsonrpc: "2.0",
					id: t,
					method: "gateway.ping",
					params: {}
				}));
			} catch (e) {
				this.failHeartbeat(e instanceof Error ? e : Error(String(e)));
			}
		}, this.options.heartbeatIntervalMs), this.options.unrefTimers && us(this.heartbeatTimer));
	}
	stopHeartbeat() {
		this.outstandingPings.clear(), this.heartbeatTimer !== null && (clearInterval(this.heartbeatTimer), this.heartbeatTimer = null);
	}
	failHeartbeat(e) {
		this.stopHeartbeat(), this.options.onHeartbeatFailure?.(e);
	}
	clearPending(e) {
		let t = this.pending.get(e);
		t?.timer && clearTimeout(t.timer), this.pending.delete(e);
	}
	rejectAllPending(e) {
		for (let [t, n] of this.pending) n.timer && clearTimeout(n.timer), this.pending.delete(t), n.reject(e);
	}
}, fs = class extends Error {
	outcome;
	constructor(e, t = "unknown") {
		super(e), this.outcome = t;
	}
}, ps = class {
	ws;
	channel;
	opening;
	detached = !1;
	holding = !0;
	held = [];
	offset = 0;
	runtime = "";
	draftInputSeen = !1;
	failed = !1;
	abort = new AbortController();
	cancelOpening;
	hooks;
	profile;
	stored;
	constructor(e, t, n) {
		this.profile = e, this.stored = t, this.hooks = n, this.channel = new ds({
			requestIdPrefix: "c-",
			heartbeatLiveness: "any-inbound",
			requestTimeoutMs: 95e3,
			onHeartbeatFailure: () => {
				this.ws?.close(), this.disconnected();
			}
		}), this.channel.onRequest((e) => [
			"approval",
			"clarify",
			"secret"
		].includes(e.method) ? (this.requestEntries.set(e.id, {
			id: e.id,
			method: e.method,
			params: e.params
		}), this.holding || this.hooks.requests([...this.requestEntries.values()]), !0) : !1);
	}
	requestEntries = /* @__PURE__ */ new Map();
	async ensure() {
		if (this.detached) throw new fs("Viewer detached");
		if (this.opening) return this.opening;
		if (this.ws?.readyState !== WebSocket.OPEN || this.holding) {
			if (this.failed) throw new fs("Native viewer disconnected");
			this.opening = this.open();
			try {
				await this.opening;
			} catch (e) {
				throw this.ws?.close(), this.disconnected(), e;
			} finally {
				this.opening = void 0;
			}
		}
	}
	async open() {
		this.hooks.connection("connecting");
		let e = await fetch("/api/auth/ws-ticket", {
			method: "POST",
			credentials: "same-origin",
			cache: "no-store",
			redirect: "manual",
			signal: this.abort.signal
		});
		if (!e.ok || e.type === "opaqueredirect") throw new fs("Dashboard sign-in required", "rejected");
		let { ticket: t } = await e.json();
		if (typeof t != "string" || !t || t.length > 1024) throw new fs("Invalid dashboard ticket", "rejected");
		if (this.detached) throw new fs("Viewer detached");
		let n = new URL("/api/plugins/chathermes/chat/ws", location.href);
		n.protocol = location.protocol === "https:" ? "wss:" : "ws:", this.profile && n.searchParams.set("profile", this.profile), this.holding = !0, this.held = [], this.requestEntries.clear();
		let r = this.ws = new WebSocket(n, ["hermes-gateway-v1", "hermes-gateway-ticket." + t]);
		r.onmessage = (e) => {
			if (!(this.ws !== r || this.detached)) try {
				if (typeof e.data != "string" || e.data.length > 30408704) throw Error();
				let t = JSON.parse(e.data);
				if (t.jsonrpc !== "2.0" || Array.isArray(t)) throw Error();
				if (this.channel.handleFrame(e.data), t.method && !("id" in t) && t.method !== "chat.ready") {
					if (this.holding) {
						if (this.held.length >= 2048) throw Error();
						this.held.push(t);
					} else this.apply(t);
				}
			} catch {
				r.close(), this.disconnected("Native data unavailable. Reconnect to restore this session.");
			}
		}, await new Promise((e, t) => {
			let n = setTimeout(() => {
				r.close(), t(new fs("Native viewer connection timed out"));
			}, 1e4);
			this.cancelOpening = () => {
				clearTimeout(n), t(new fs("Viewer detached"));
			}, r.onopen = () => {
				if (clearTimeout(n), this.detached || this.ws !== r) {
					t(new fs("Viewer detached"));
					return;
				}
				this.channel.attach({ send: (e) => r.send(e) }), e();
			}, r.onerror = r.onclose = () => {
				clearTimeout(n), t(new fs("Native viewer disconnected"));
			};
		}), this.cancelOpening = void 0, r.onclose = r.onerror = () => {
			this.ws === r && this.disconnected();
		}, this.hooks.connection("recovering");
		let i = await this.rpc("chat.attach", { session_id: this.stored });
		if (this.detached || this.ws !== r) throw new fs("Viewer detached");
		if (typeof i.session_id != "string" || !i.session_id || !Array.isArray(i.messages) || !i.recovery || typeof i.recovery.epoch != "string" || typeof i.recovery.complete != "boolean" || !Number.isSafeInteger(i.recovery.through) || i.recovery.through < 0 || i.recovery.start !== void 0 && (!Number.isSafeInteger(i.recovery.start) || i.recovery.start < 0 || i.recovery.start > i.recovery.through) || i.recovery.complete && !Array.isArray(i.recovery.base_row_ids)) throw new fs("Invalid native recovery snapshot");
		this.runtime = i.session_id, this.draftInputSeen = i.messages.some((e) => e.role === "user"), this.offset = i.recovery.complete ? i.recovery.start || 0 : i.recovery.through, this.hooks.snapshot(i);
		let a = this.offset;
		for (; a < i.recovery.through;) {
			let e = await this.rpc("chat.replay", {
				offset: a,
				through: i.recovery.through
			});
			if (this.detached || this.ws !== r || e.epoch !== i.recovery.epoch || !Array.isArray(e.frames) || !Number.isSafeInteger(e.offset) || e.offset <= a || e.offset > i.recovery.through) throw new fs("Recovery generation changed");
			if (e.frames.length !== e.offset - a || e.frames.some((e, t) => e.chat_offset !== a + t + 1)) throw new fs("Invalid native replay boundary");
			for (let t of e.frames) this.apply(t);
			a = e.offset;
		}
		if (this.detached || this.ws !== r || !this.channel.connected) throw new fs("Native viewer disconnected");
		this.holding = !1;
		for (let e of this.held) this.apply(e);
		this.held = [], this.hooks.requests([...this.requestEntries.values()]), this.channel.startHeartbeat(), this.hooks.connection("open"), this.hooks.recovered();
	}
	apply(e) {
		if (typeof e.chat_offset == "number") {
			if (e.chat_offset <= this.offset) return;
			this.offset = e.chat_offset;
		}
		if (e.method === "event") {
			let t = e.params;
			if (t.session_id !== this.runtime) return;
			t.type === "request.cancel" && (this.requestEntries.delete(String(t.payload?.id || t.payload?.request_id || "")), this.hooks.requests([...this.requestEntries.values()])), this.hooks.event(t);
		} else e.method === "chat.input" || e.method === "chat.correction" ? (e.method === "chat.input" && !this.draftInputSeen && (this.draftInputSeen = !0, this.hooks.created?.()), this.hooks.input(String(e.params?.text || ""), e.method === "chat.correction", e.params?.admission_id, {
			display_kind: e.params?.display_kind,
			display_metadata: e.params?.display_metadata
		})) : e.method === "chat.unsupported" && this.hooks.connection("open", "Unavailable in ChatHermes: " + e.params?.method);
	}
	disconnected(e) {
		if (this.detached || this.failed) return;
		this.failed = !0;
		let t = this.ws;
		this.ws = void 0, t && (t.onclose = t.onerror = null, t.close()), this.channel.detach(new fs("Native viewer disconnected")), this.hooks.connection("closed", e);
	}
	async rpc(e, t = {}) {
		if (!this.channel.connected) throw new fs("Native viewer disconnected; message not submitted", "rejected");
		try {
			return await this.channel.request(e, t);
		} catch (t) {
			throw t instanceof rs ? new fs(t.message, t.data?.outcome || (e === "chat.submit" ? "unknown" : "rejected")) : t;
		}
	}
	async answer(e, t) {
		await this.rpc("chat.answer", {
			request_id: e,
			result: t
		}), this.requestEntries.delete(e), this.hooks.requests([...this.requestEntries.values()]);
	}
	get boundary() {
		return this.offset;
	}
	close() {
		this.detached = !0, this.abort.abort(), this.cancelOpening?.(), this.cancelOpening = void 0, this.channel.detach(new fs("Viewer detached"));
		let e = this.ws;
		this.ws = void 0, e && (e.onopen = e.onmessage = e.onclose = e.onerror = null, e.close()), this.held = [];
	}
}, ms = {
	auto_continue: "Resuming interrupted turn…",
	process_complete: "Background process completed",
	async_delegation_complete: "Delegated work completed",
	model_switch: "Model changed",
	personality_switch: "Personality changed",
	failed_turn: "Response did not complete · verify any actions before resending"
};
function hs(e) {
	return e.display_kind === "hidden" ? "hidden" : e.display_kind && Object.hasOwn(ms, e.display_kind) ? "status" : e.role === "system" ? "hidden" : "message";
}
function gs(e) {
	let t = e.display_metadata;
	if (e.display_kind === "model_switch" && t && typeof t == "object") {
		let e = "model" in t && typeof t.model == "string" ? t.model : "";
		if (e) return `Model changed to ${e}`;
	}
	return t && typeof t == "object" && "display_text" in t && typeof t.display_text == "string" ? t.display_text : ms[e.display_kind || ""] || "";
}
function _s(e) {
	return e === "interrupted" ? "Response interrupted" : e === "cancelled" ? "Response cancelled" : e === "error" || e === "failed" ? "Response failed" : "Response completed";
}
//#endregion
//#region src/features/chat/runtime/assistant-turn.ts
var vs = (e) => typeof e == "string" ? e : "", ys = (e) => typeof e == "string" ? e : e == null ? "" : JSON.stringify(e, null, 2);
function bs(e) {
	let t = vs(e.subagent_id) || vs(e.child_session_id);
	if (t) return t;
	let n = vs(e.delegation_id);
	return n && typeof e.task_index == "number" && Number.isSafeInteger(e.task_index) ? `${n}:${e.task_index}` : "";
}
function xs(e) {
	let t = e;
	if (typeof t == "string") try {
		t = JSON.parse(t);
	} catch {
		return !1;
	}
	if (!t || typeof t != "object") return !1;
	let n = t;
	return !!(n.is_error || n.error || n.success === !1 || typeof n.exit_code == "number" && n.exit_code !== 0);
}
function Ss(e, t = !1) {
	let n = {
		file_search: ["Searching files", "Searched files"],
		terminal: ["Running command", "Ran command"],
		search: ["Searching files", "Searched files"],
		read_file: ["Reading file", "Read file"],
		write_file: ["Updating file", "Updated file"],
		web_search: ["Searching the web", "Searched the web"],
		web_extract: ["Reading web page", "Read web page"],
		python: ["Executing Python", "Executed Python"],
		browser: ["Using browser", "Used browser"]
	}, r = Object.keys(n).find((t) => e === t || e.startsWith(t + "_"));
	return r ? n[r][+!!t] : t ? "Used tool" : "Using tool";
}
var Cs = () => ({
	blocks: [],
	seen: /* @__PURE__ */ new Set(),
	sequence: 0
});
function ws(e) {
	Ts(e);
	for (let t of e.blocks) t.kind !== "text" && (t.complete = !0, t.kind === "thinking" && (t.title = "Thought"), (!t.state || t.state === "running" || t.state === "pending") && (t.state = t.kind === "tool" ? "unknown" : "completed"));
}
function Ts(e) {
	for (let t of e.blocks) t.kind === "thinking" && (t.complete = !0, t.state = "completed", t.title = "Thought", t.duration === void 0 && t.startedAt !== void 0 && (t.duration = Math.max(0, (Date.now() - t.startedAt) / 1e3)));
}
function Es(e, t) {
	if (t.key && e.seen.has(t.key)) return;
	t.key && e.seen.add(t.key);
	let { type: n, data: r } = t, i = vs(r.delta) || vs(r.text) || vs(r.preview), a = vs(r.tool_call_id) || vs(r.tool_id), o = vs(r.tool_name) || vs(r.name) || vs(r.tool), s = () => `block-${++e.sequence}`;
	if (n === "text" || n === "text.snapshot" || n === "text.completed") {
		Ts(e);
		let t = n === "text.completed" ? vs(r.content) : i;
		if (!t || n === "text.completed" && [...e.blocks].reverse().find((e) => e.kind === "text")?.content === t) return;
		let a = e.blocks.at(-1);
		if (n === "text.snapshot") {
			let n = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("");
			if (n === t || n.startsWith(t)) return;
			if (t.startsWith(n)) {
				Es(e, {
					type: "text",
					data: { delta: t.slice(n.length) }
				});
				return;
			}
			if (a?.kind === "text") {
				a.content = t;
				return;
			}
		}
		a?.kind !== "text" && (a = {
			id: s(),
			kind: "text",
			content: ""
		}, e.blocks.push(a)), a.content = n === "text.completed" ? t : a.content + t;
	} else if (n === "reasoning" || n === "status") {
		let t = e.blocks.at(-1);
		(t?.kind !== "thinking" || t.complete) && (t = {
			id: s(),
			kind: "thinking",
			title: n === "status" ? "Working…" : "Thinking…",
			content: "",
			complete: !1,
			state: "running",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), t.content += i;
	} else if (n === "reasoning.completed") Ts(e);
	else if (n.startsWith("tool.")) {
		Ts(e);
		let t = e.blocks.find((e) => e.kind === "tool" && a && e.id === a);
		if (!t && !a && (t = [...e.blocks].reverse().find((e) => e.kind === "tool" && !e.complete && (!o || e.toolName === o))), t || (t = {
			id: a || s(),
			kind: "tool",
			title: Ss(o),
			toolName: o,
			content: "",
			complete: !1,
			state: "pending",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), n === "tool.started" && t.complete) return;
		n === "tool.started" ? (t.state = "running", t.content = ys(r.args) || i || t.content) : n === "tool.updated" ? (t.complete || (t.state = "running"), t.output = (t.output || "") + i) : (t.complete = !0, t.state = n === "tool.failed" || xs(r.output ?? r.result) || r.is_error || r.error ? "failed" : "completed", t.title = Ss(t.toolName || o, !0), t.output = ys(r.output ?? r.result ?? r.error) || t.output || i, t.content = ys(r.args) || t.content, t.duration = typeof r.duration_s == "number" ? r.duration_s : t.startedAt ? Math.max(0, ((typeof r.ts == "number" ? r.ts * 1e3 : Date.now()) - t.startedAt) / 1e3) : void 0);
	} else {
		if (n === "failed") for (let t of e.blocks) t.kind === "tool" && !t.complete && (t.state = "failed", t.output ||= "The response ended before this tool completed.");
		ws(e);
	}
}
function Ds(e) {
	let t = Cs();
	for (let n of e) {
		if (n.blocks) {
			t.blocks.push(...n.blocks);
			continue;
		}
		if (hs(n) === "message") {
			if (n.role === "assistant") {
				let e = n.reasoning_content || n.reasoning;
				e && (Es(t, {
					type: "reasoning",
					data: {
						delta: e,
						persisted: !0
					}
				}), Ts(t));
				let r = ts(n.content);
				r && t.blocks.push({
					id: `block-${++t.sequence}`,
					kind: "text",
					content: r
				});
				let i = Array.isArray(n.content) ? n.content.flatMap((e) => {
					let t = e?.image_url?.url;
					return typeof t == "string" && /^(data:image\/|https?:\/\/)/.test(t) ? [t] : [];
				}) : [];
				if (i.length) {
					let e = t.blocks.at(-1);
					e?.kind !== "text" && (e = {
						id: `block-${++t.sequence}`,
						kind: "text",
						content: ""
					}, t.blocks.push(e)), e.images = i;
				}
				for (let e of n.tool_calls || []) Es(t, {
					type: "tool.started",
					data: {
						tool_call_id: e.id,
						tool_name: e.function?.name,
						args: e.function?.arguments,
						persisted: !0
					}
				});
			} else if (n.role === "tool") {
				let e = ts(n.content), r = !1;
				try {
					let t = JSON.parse(e);
					r = t?.is_error === !0 || t?.success === !1 || !!t?.error || typeof t?.exit_code == "number" && t.exit_code !== 0;
				} catch {}
				Es(t, {
					type: r ? "tool.failed" : "tool.completed",
					data: {
						tool_call_id: n.tool_call_id,
						tool_name: n.tool_name,
						output: e,
						persisted: !0
					}
				});
			}
		}
	}
	return Ts(t), t.blocks;
}
function Os(e, t, n) {
	let r = [...e.blocks], i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = 0;
	for (let [e, n] of t.entries()) {
		if (n.kind !== "tool") continue;
		let t = r.findIndex((e, t) => t >= o && e.kind === "tool" && (n.id === e.id || n.id.startsWith("block-") || e.id.startsWith("block-")));
		t >= 0 && (a.set(e, t), o = t + 1);
	}
	let s = 0;
	for (let [e, o] of t.entries()) {
		let c = [...a].reverse().find(([t]) => t < e)?.[1], l = [...a].find(([t]) => t > e)?.[1], u = o.kind === "tool" ? a.get(e) ?? -1 : r.findIndex((e, i) => i >= Math.max(s, (c ?? -1) + 1) && i < (l ?? r.length) && e.kind === o.kind && (o.content.startsWith(e.content) || e.content.startsWith(o.content) || !n && o === t.at(-1) && e === r.at(-1) && o.kind === "text"));
		u >= 0 && (i.set(o, r[u]), s = u + 1);
	}
	for (let [n, r] of t.entries()) {
		let a = i.get(r);
		if (a) r.kind === "tool" && a.kind === "tool" ? r.complete && (a.output = r.output, a.complete = !0, a.state = r.state, a.title = r.title) : r.kind === "text" && a.kind === "text" ? (a.content.startsWith(r.content) || (a.content = r.content), r.images && (a.images = r.images)) : r.content.startsWith(a.content) && (a.content = r.content);
		else {
			let a = t.slice(n + 1).map((e) => i.get(e)).find(Boolean), o = a ? e.blocks.indexOf(a) : e.blocks.length, s = r.id.startsWith("block-") ? `block-${++e.sequence}` : r.id;
			e.blocks.splice(o, 0, {
				...r,
				id: s
			});
		}
	}
}
function ks(e, t) {
	let n = Math.max(e.length, t.length);
	if (n < 160) return !1;
	let r = Math.max(1, Math.min(32, Math.floor(n * .02)));
	if (Math.abs(e.length - t.length) > r) return !1;
	let [i, a] = e.length < t.length ? [e, t] : [t, e], o = Array.from({ length: i.length + 1 }, (e, t) => t <= r ? t : Infinity), s = Array.from({ length: i.length + 1 }, () => Infinity);
	for (let e = 1; e <= a.length; e += 1) {
		let t = Math.max(1, e - r), n = Math.min(i.length, e + r);
		s.fill(Infinity, t, n + 1), s[t - 1] = t === 1 ? e : Infinity;
		let c = Infinity;
		for (let r = t; r <= n; r += 1) s[r] = Math.min(o[r] + 1, s[r - 1] + 1, o[r - 1] + Number(a[e - 1] !== i[r - 1])), c = Math.min(c, s[r]);
		if (c > r) return !1;
		let l = s;
		s = o, o = l;
	}
	return o[i.length] <= r;
}
function As(e, t, n) {
	let r = e.native ??= {
		boundary: 0,
		toolStream: !1,
		streamText: e.blocks.at(-1)?.kind === "text" ? e.blocks.at(-1)?.id : void 0
	}, i = (t) => e.blocks.find((e, n) => n >= r.boundary && e.kind === "text" && e.id === t), a = (t) => {
		let n = {
			id: `block-${++e.sequence}`,
			kind: "text",
			content: t
		};
		return e.blocks.push(n), n;
	};
	if (t === "message.start") {
		e.native = {
			boundary: e.blocks.length,
			toolStream: !1
		};
		return;
	}
	if (t !== "thinking.delta" && t !== "tool.generating") {
		if (t === "message.interim") {
			let t = vs(n.text).trim();
			if (!t) return;
			Ts(e);
			let o = i(r.streamText);
			if (!o) {
				let e = i(r.interimText ?? r.finalText);
				e && e.content.replace(/\s+/g, " ").trim() === t.replace(/\s+/g, " ").trim() && (o = e);
			}
			o ??= a(t), o.content = t, r.interimText = o.id, r.streamText = void 0, r.finalText = void 0, r.toolStream = !1;
		} else if (t === "message.delta" || t === "message.complete") {
			let o = vs(n.text);
			if (t === "message.delta" && o) {
				Ts(e);
				let t = i(r.streamText);
				(!t || t !== e.blocks.at(-1)) && (t = a("")), t.content += o, r.streamText = t.id, r.finalText = void 0;
			} else if (t === "message.complete" && o.trim() && (!n.response_reused || !e.blocks.some((e) => e.kind === "text"))) {
				Ts(e);
				let t = o.trim(), s = i(r.streamText), c = e.blocks.reduce((e, t, n) => t.kind === "tool" ? n : e, -1), l = s && e.blocks.indexOf(s) > c ? s : void 0, u = i(r.interimText), d = !!(n.error || n.status && n.status !== "complete"), f = !d && u && u.content.trim() === t && (!l || l.content.trim() === t), p = !d && !l && !r.toolStream && u && u.content.trim() && (n.response_previewed || n.response_transformed || u.content.trim() === t || t.startsWith(u.content.trim()) || u.content.trim().startsWith(t) || ks(u.content.trim(), t)), m;
				if (f || p) m = u, l && l !== u && e.blocks.splice(e.blocks.indexOf(l), 1);
				else {
					let e = i(r.finalText);
					m = l ?? (e?.content.trim() === t ? e : a(""));
				}
				m.content = t, r.finalText = m.id, r.streamText = void 0, r.interimText = void 0, r.toolStream = !1;
			}
			if (t === "message.complete") {
				for (let t of e.blocks) t.kind !== "text" && !t.delegated && (t.complete = !0, (!t.state || t.state === "running" || t.state === "pending") && (t.state = n.status === "cancelled" || n.status === "interrupted" ? "interrupted" : "unknown"));
				n.reasoning && !e.blocks.some((e) => e.kind === "thinking") && Es(e, {
					type: "reasoning",
					data: { text: n.reasoning }
				}), Ts(e);
			}
		} else if (t === "reasoning.delta" || t === "reasoning.available") {
			if (t === "reasoning.available") {
				let t = [...e.blocks].reverse().find((e) => e.kind === "thinking");
				if (t && t.kind === "thinking") {
					t.content = vs(n.text);
					return;
				}
			}
			Es(e, {
				type: "reasoning",
				data: {
					...n,
					delta: n.text
				}
			});
		} else if (t === "tool.start" || t === "tool.complete" || t === "tool.progress") {
			t === "tool.start" && (r.toolStream = !0);
			let i = n.result, a = n.is_error || n.error || xs(i) || xs(n.result_text);
			Es(e, {
				type: t === "tool.start" ? "tool.started" : t === "tool.progress" ? "tool.updated" : a ? "tool.failed" : "tool.completed",
				data: {
					...n,
					tool_call_id: n.tool_id,
					tool_name: n.name,
					delta: n.text || n.delta || n.preview,
					output: n.result_text ?? n.result
				}
			});
		} else if (t.startsWith("subagent.")) {
			let r = bs(n);
			if (!r) return;
			Es(e, {
				type: [
					"subagent.complete",
					"subagent.failed",
					"subagent.cancelled"
				].includes(t) ? t === "subagent.complete" && n.status === "completed" ? "tool.completed" : "tool.failed" : "tool.updated",
				data: {
					tool_call_id: "subagent-" + r,
					tool_name: vs(n.name) || "Delegated task",
					delta: vs(n.text),
					output: n.summary ?? n.text ?? n.output_tail
				}
			});
			let i = e.blocks.find((e) => e.id === "subagent-" + r);
			i && i.kind === "tool" && (i.delegated = !0);
		}
	}
}
//#endregion
//#region src/features/chat/runtime/native-admission.ts
var js = (e, t) => "chathermes.native-outcome:" + JSON.stringify([e, t]);
function Ms(e, t) {
	try {
		let n = js(e, t);
		return Object.keys(localStorage).some((e) => (e === n || e.startsWith(n + ":")) && localStorage.getItem(e) === "unknown");
	} catch {
		return !0;
	}
}
function Ns(e, t) {
	let n = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
	try {
		localStorage.setItem(js(e, t) + ":" + n, "unknown");
	} catch {
		throw Error("Cannot safely record native submission state");
	}
	return n;
}
function Ps(e, t, n) {
	try {
		let r = js(e, t);
		if (n) localStorage.removeItem(r + ":" + n);
		else for (let e of Object.keys(localStorage)) (e === r || e.startsWith(r + ":")) && localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/features/chat/runtime/native-session.ts
function Fs(e, t, n) {
	let r = /* @__PURE__ */ V([]), i = /* @__PURE__ */ V(!1), a = /* @__PURE__ */ V(!1), o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V(""), c = /* @__PURE__ */ V("stale"), l = /* @__PURE__ */ V([]), u = /* @__PURE__ */ V(!1), d = Z(() => {
		let e = l.value[0];
		return e ? {
			...e.params,
			request_id: e.id,
			kind: e.method
		} : void 0;
	}), f, p = 0, m = !1, h = 0, g, _ = !1, v = document.visibilityState !== "hidden", y = navigator.onLine, b, x, S = [], C = "", w = /* @__PURE__ */ new Set(), T = "", E = "", D = !1, O = !1, k = 0, A, ee = () => {
		x && b && (x.blocks = b.blocks), r.value = [...r.value];
	};
	function te(e, t = !1, n, a = {}) {
		if (D && !t && x && n === C) {
			D = !1, ee();
			return;
		}
		t && x && b && (Es(b, {
			type: "reasoning.completed",
			data: {}
		}), S.push({
			user: x,
			turn: b,
			hasCorrections: !0
		})), O = t || !1, x = {
			id: `native-user-${++k}`,
			role: "user",
			content: e,
			display_kind: a.display_kind,
			display_metadata: a.display_metadata
		}, r.value.push(x), b = /* @__PURE__ */ Nt(Cs()), x.blocks = b.blocks, i.value = !0, ee();
	}
	function ne(e) {
		m = !0, h++, A = void 0, b = void 0, x = void 0, D = !1, S = [];
		let t = e.messages.map((e) => ({
			...e,
			id: e.row_id == null ? void 0 : String(e.row_id),
			content: e.role === "tool" ? e.content : e.text || e.content || "",
			tool_name: e.name
		})), n = new Set(e.recovery.base_row_ids || []);
		if (r.value = e.recovery.complete ? t.filter((e) => e.id && n.has(e.id)) : t, i.value = !!(e.running || e.queued), !e.recovery.complete && e.inflight?.user) {
			let t = r.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
			if (t < 0 || ts(r.value[t].content) !== e.inflight.user || r.value[t].display_kind !== (e.inflight.display_kind || void 0)) te(e.inflight.user, !1, void 0, {
				display_kind: e.inflight.display_kind || void 0,
				display_metadata: e.inflight.display_metadata
			});
			else {
				x = r.value[t], b = /* @__PURE__ */ Nt(Cs());
				let e = Ds(r.value.slice(t + 1));
				Os(b, e, i.value), x.blocks = b.blocks;
			}
			e.inflight.assistant && !b.blocks.some((e) => e.kind === "text") && Es(b, {
				type: "text.snapshot",
				data: { text: e.inflight.assistant }
			});
			for (let t of e.inflight.corrections || []) te(t, !0);
			e.inflight.error && (o.value = e.inflight.error), s.value = hs(x) === "status" ? gs(x) : e.running ? "Working…" : _s(e.inflight.status), e.running && !e.inflight.error && (o.value = "Earlier progress is outside retained recovery; saved history is authoritative.");
		}
		i.value = !!(e.running || e.queued);
	}
	async function j() {
		let t = p, n = ++h, a = f;
		if (a && !m && c.value === "ready") try {
			let o = await Q.messages(T, E);
			if (t !== p || n !== h || m) return;
			let s = o.length ? await a.rpc("chat.history").catch(() => null) : { messages: [] }, c = new Map((s?.messages || []).filter((e) => e.id).map((e) => [e.id, e])), l = o.map((e) => {
				let t = c.get(e.id);
				return t ? {
					...e,
					display_kind: t.display_kind ?? e.display_kind,
					display_metadata: t.display_metadata ?? e.display_metadata
				} : e;
			});
			if (t !== p || n !== h || m) return;
			if (i.value && x && b) {
				let e = A?.user_row_id, t = e ? l.findIndex((t) => t.id === String(e)) : -1;
				t >= 0 && Os(b, Ds(l.slice(t + 1)), !0), ee();
				return;
			}
			if (x && b && !S.length || S.some((e) => e.hasCorrections)) return ee(), !0;
			for (let e of S) {
				let { turn: t, receipt: n } = e, r = n?.user_row_id == null ? -1 : l.findIndex((e) => e.id === String(n.user_row_id)), i = r + 1;
				for (; i < l.length && l[i]?.role !== "user";) i++;
				r >= 0 && Os(t, Ds(l.slice(r + 1, i)), !1);
				let a = new Set(l.map((e) => e.id)), o = l.find((e) => e.id === String(n?.final_assistant_row_id)), s = [...t.blocks].reverse().find((e) => e.kind === "text")?.content || "";
				if (!(n?.complete && r >= 0 && n.row_ids.every((e) => a.has(String(e))) && o && ts(o.content).trim() === s.trim())) return ee(), !0;
				l[r] = {
					...l[r],
					blocks: t.blocks
				};
			}
			r.value = l;
			let u = await a.rpc("chat.reconciled", { through: a.boundary });
			return t === p && u.settled && e(), !0;
		} catch {
			return t === p && (o.value = "Response ended; saved history could not be reconciled. Refresh history before sending again."), !1;
		}
	}
	async function M(e, t) {
		(!_ || T !== e || E !== t) && (le(), T = e, E = t, _ = !0, u.value = Ms(T, E)), await ae();
	}
	function re() {
		p++, h++, f?.close(), f = void 0, g = void 0, m = !1, a.value = !1, c.value = "stale";
	}
	function ie(e, t) {
		let n = v !== e || y !== t;
		return v = e, y = t, !v || !y ? (_ && c.value !== "stale" && re(), Promise.resolve()) : n ? ae() : g || Promise.resolve();
	}
	function ae() {
		if (!_ || !v || !y || c.value === "ready") return Promise.resolve();
		if (g) return g;
		let e = ++p;
		h++, m = !0, a.value = r.value.length === 0, c.value = "reconnecting";
		let d = [], C = (t) => {
			e === p && (d ? d.push(t) : t());
		}, w = new ps(T, E, {
			snapshot: (e) => {
				d = [], C(() => {
					o.value = u.value ? "Submission outcome unknown. Inspect history and native state before sending again." : "", s.value = "", l.value = [], ne(e);
				});
			},
			input: (e, t, n, r) => C(() => te(e, t, n, r)),
			event: (e) => C(() => {
				let t = e.payload || {}, r = typeof t.text == "string" ? t.text : "";
				(e.type === "session.title" || e.type === "session.info") && typeof t.title == "string" && n?.(T, E, t.title), e.type === "message.start" ? (i.value = !0, s.value = x && hs(x) === "status" ? gs(x) : "Working…", A = void 0) : e.type === "thinking.delta" || e.type === "tool.generating" ? s.value = e.type === "tool.generating" ? "Preparing " + (typeof t.name == "string" && t.name ? t.name : "tool") : r || "Working…" : e.type === "status.update" ? s.value = r : e.type === "notice" ? s.value = typeof t.message == "string" ? t.message : "" : e.type === "error" ? o.value = typeof t.message == "string" ? t.message : "Session failed" : e.type === "session.reclaimed" && (i.value = !1, s.value = "Session reclaimed"), !b && x && (b = /* @__PURE__ */ Nt(Cs()));
				let a = b;
				if (e.type.startsWith("subagent.") || e.type.startsWith("tool.")) {
					let n = e.type.startsWith("subagent.") ? "subagent-" + bs(t) : t.tool_id;
					a = [...S].reverse().find((e) => e.turn.blocks.some((e) => e.id === n))?.turn || b;
				}
				if (a && As(a, e.type, {
					...t,
					persisted: m
				}), e.type === "message.complete") {
					for (let e of S) As(e.turn, "message.complete", { status: t.status });
					A = t.persisted_turn, x && b && !S.some((e) => e.user === x && e.turn === b) && S.push({
						user: x,
						turn: b,
						receipt: A,
						hasCorrections: O
					}), i.value = !1, s.value = _s(t.status), typeof t.status == "string" && t.status && t.status !== "complete" && (o.value = typeof t.error == "string" && t.error ? t.error : "Response " + t.status), m || j();
				} else e.type === "subagent.complete" && !i.value && !m && j();
				ee();
			}),
			requests: (e) => C(() => {
				l.value = e;
			}),
			created: () => t?.(T, E),
			connection: (t, n) => {
				if (e === p) {
					if (t === "closed") {
						let e = c.value === "ready";
						re(), o.value = n || "Session connection lost. Reconnect to restore this session.", s.value = "Disconnected · backend state will be checked on reconnect";
						let t = p;
						e && queueMicrotask(() => {
							p === t && _ && c.value === "stale" && ae();
						});
					} else n && C(() => {
						o.value = n;
					});
				}
			},
			recovered: () => {
				if (e !== p) return;
				let t = d || [];
				d = void 0;
				for (let e of t) e();
				m = !1, a.value = !1, c.value = "ready", i.value || j();
			}
		});
		f = w;
		let D = (async () => {
			try {
				if (await w.ensure(), e === p && c.value !== "ready") throw new fs("Native session reconstruction did not become ready");
			} catch {
				e === p && (re(), o.value = "Could not reconnect this session. Retry when the dashboard is available.");
			} finally {
				e === p && (g = void 0);
			}
		})();
		return g = D, D;
	}
	async function oe(e, t, n, s) {
		if (!f || i.value || u.value || a.value || c.value !== "ready") throw new fs("Native session is not ready. Message not submitted.", "rejected");
		let l = p, d = f, m = Ns(T, E);
		u.value = !0, o.value = "", te(e), x.content = s ?? t, D = !0, C = m, w.add(m);
		let h = x.id, g = !1;
		try {
			let e = typeof t == "function" ? await t() : t;
			if (l !== p) throw new fs("Viewer detached before submission", "rejected");
			g = !0, await d.rpc("chat.submit", {
				input: e,
				admission_id: m,
				...n
			}), Ps(se(d), d.stored, m), l === p && (u.value = !1);
		} catch (e) {
			throw !g || e instanceof fs && e.outcome === "rejected" ? (Ps(se(d), d.stored, m), _ && T === d.profile && E === d.stored && C === m && (r.value = r.value.filter((e) => e.id !== h), u.value = Ms(T, E), D = !1, x?.id === h && (i.value = !1, b = void 0, x = void 0))) : l === p && (o.value = "Submission outcome unknown. Inspect history and native state before sending again."), e;
		} finally {
			w.delete(m);
		}
	}
	let se = (e) => e.profile;
	async function ce() {
		if (!_ || (c.value !== "ready" && await ae(), c.value !== "ready") || w.has(C)) return;
		let e = p, t = f, n = t.boundary;
		try {
			let r = await t.rpc("chat.state");
			if (e !== p || t.boundary !== n || w.has(C)) return;
			if (r.running !== !1 || r.queued || r.delegating) {
				o.value = "Hermes is still working; sending remains locked.";
				return;
			}
			i.value = !1, await j() && e === p && t.boundary === n && !i.value && (Ps(T, E), u.value = Ms(T, E), u.value || (o.value = ""));
		} catch {
			e === p && (o.value = "Could not verify native session state; sending remains locked.");
		}
	}
	function le() {
		re(), _ = !1, C = "", r.value = [], i.value = !1, a.value = !1, l.value = [], u.value = !1, o.value = "", s.value = "", b = void 0, x = void 0, S = [];
	}
	function ue() {
		if (!f || c.value !== "ready") throw new fs("Session is read-only until reconnected", "rejected");
		return f;
	}
	return {
		messages: r,
		busy: i,
		loading: a,
		error: o,
		status: s,
		connection: c,
		approval: d,
		requests: l,
		uncertain: u,
		attach: M,
		submit: oe,
		close: le,
		hydrate: j,
		resolveUncertainty: ce,
		reconnect: ae,
		availability: ie,
		stop: () => ue().rpc("chat.stop"),
		steer: (e) => ue().rpc("chat.steer", { text: e }),
		answer: (e, t) => ue().answer(e, t)
	};
}
//#endregion
//#region src/features/projects/utils/projects.ts
function Is(e) {
	return e.path || e.repos.find((e) => e.path)?.path || void 0;
}
function Ls(e) {
	let t = e.repos.flatMap((e) => e.groups.flatMap((e) => e.sessions));
	return [...new Map(t.map((e) => [e.id, e])).values()].sort((e, t) => (t.last_active || 0) - (e.last_active || 0));
}
//#endregion
//#region src/features/notifications/services/push.ts
var Rs = "/api/plugins/chathermes", zs;
function Bs() {
	return typeof window < "u" && window.isSecureContext && typeof navigator < "u" && "serviceWorker" in navigator && "PushManager" in window && typeof Notification < "u";
}
async function Vs() {
	if (!Bs()) throw Error("Notifications require a secure browser with Push API support.");
	return zs ||= navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
		scope: "/chathermes",
		updateViaCache: "none"
	}).catch((e) => {
		throw zs = void 0, e;
	}), zs;
}
function Hs(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4));
	return Uint8Array.from(n, (e) => e.charCodeAt(0));
}
async function Us() {
	let e = await fetch(Rs + "/push/config", { credentials: "same-origin" });
	if (!e.ok) throw Error("Push configuration unavailable");
	return e.json();
}
async function Ws() {
	return (await Vs()).pushManager.getSubscription();
}
async function Gs(e, t) {
	let n = await fetch(Rs + "/push/status" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ endpoint: t.endpoint })
	});
	if (!n.ok) throw Error("Could not load notification status for this profile.");
	return n.json();
}
async function Ks(e = "") {
	if (!Bs()) return {
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: "Notifications require HTTPS and a supported browser."
	};
	try {
		let [t, n] = await Promise.all([Ws(), Us()]), r = t ? await Gs(e, t) : null;
		return {
			supported: !0,
			permission: Notification.permission,
			subscribed: r?.enabled === !0,
			available: n.available,
			error: n.available ? "" : "Push notifications are unavailable on this server."
		};
	} catch {
		return {
			supported: !0,
			permission: Notification.permission,
			subscribed: !1,
			available: !1,
			error: "Push notifications are unavailable on this server."
		};
	}
}
async function qs(e) {
	if (!Bs()) throw Error("Notifications require HTTPS and a supported browser.");
	let t = await Notification.requestPermission();
	if (t !== "granted") throw Error(t === "denied" ? "Notification permission is blocked in browser settings." : "Notification permission was not granted.");
	let n = await Vs(), r = await Us();
	if (!r.available || !r.vapid_public_key) throw Error("Push notifications are unavailable on this server.");
	let i = await n.pushManager.subscribe({
		userVisibleOnly: !0,
		applicationServerKey: Hs(r.vapid_public_key)
	});
	if (!(await fetch(Rs + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			endpoint: i.endpoint,
			keys: i.toJSON().keys
		})
	})).ok) throw Error("Could not save this notification subscription.");
}
async function Js(e) {
	let t = await Ws();
	if (!t) return;
	let n = await Gs(e, t);
	if (n.enabled && n.id && !(await fetch(Rs + "/push/subscriptions/" + encodeURIComponent(n.id) + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "DELETE",
		credentials: "same-origin"
	})).ok) throw Error("Could not disable notifications for this profile.");
}
async function Ys(e) {
	if (!(await fetch(Rs + "/push/test" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin"
	})).ok) throw Error("Could not send a test notification.");
}
//#endregion
//#region src/features/notifications/services/push-client.ts
function Xs(e, t, n = document.visibilityState) {
	return {
		type: "chathermes.session",
		url: t,
		visible: n === "visible",
		profile: e.profile || "default",
		session: e.chat ? e.session : "",
		...e.scheduled ? {
			scheduled: !0,
			job: e.scheduled.job,
			run: e.scheduled.run
		} : {},
		connected: e.chat && !!e.session && e.connected
	};
}
function Zs(e, t, n) {
	let r = !0, i = null, a = () => Xs(t(), n()), o = () => {
		r && (e.controller || i)?.postMessage(a());
	}, s = (e) => {
		r && e.data?.type === "chathermes.session.query" && e.ports[0]?.postMessage(a());
	};
	return e.addEventListener("message", s), e.addEventListener("controllerchange", o), document.addEventListener("visibilitychange", o), e.ready.then((e) => {
		i = e.active, o();
	}).catch(() => {}), o(), {
		publish: o,
		stop: () => {
			r = !1, (e.controller || i)?.postMessage({
				...a(),
				session: "",
				connected: !1,
				visible: !1
			}), e.removeEventListener("message", s), e.removeEventListener("controllerchange", o), document.removeEventListener("visibilitychange", o);
		}
	};
}
//#endregion
//#region src/features/sessions/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var Qs = { class: "session-head mt-4 mb-1 shrink-0 px-2.5 text-xs font-semibold text-[#a3a3a3]" }, $s = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, ec = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, tc = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, nc = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
}, rc = ["aria-current", "onClick"], ic = { class: "truncate" }, ac = ["title"], oc = [
	"aria-label",
	"disabled",
	"onClick"
], sc = ["disabled"], cc = ["aria-label"], lc = {
	key: 0,
	class: "grid gap-1"
}, uc = ["value"], dc = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, fc = ["disabled"], pc = {
	key: 2,
	class: "grid gap-3 p-1"
}, mc = ["disabled"], hc = /* @__PURE__ */ U({
	__name: "SessionSidebar",
	props: {
		sessions: {},
		selected: {},
		loading: { type: Boolean },
		error: {},
		hasMore: { type: Boolean },
		busy: { type: Boolean },
		heading: {},
		projects: {}
	},
	emits: [
		"select",
		"create",
		"more",
		"retry",
		"rename",
		"archive",
		"delete",
		"project"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Z(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.projects || []) {
				if (t.isNoProject) continue;
				let n = [...t.sessionIds || [], ...Ls(t).map((e) => e.id)];
				for (let r of n) e.set(r, t.label);
			}
			return e;
		});
		function a(e) {
			let t = i.value.get(e.id);
			return [e.source || "Hermes", t].filter(Boolean).join(" · ");
		}
		let o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V("");
		function c(e) {
			o.value = e.id, s.value = e.title || "";
		}
		function l() {
			s.value.trim() && r("rename", o.value, s.value.trim()), o.value = "";
		}
		let u = /* @__PURE__ */ V(), d = /* @__PURE__ */ V(), f = /* @__PURE__ */ V("menu"), p = /* @__PURE__ */ V(""), m = /* @__PURE__ */ V({
			left: "0px",
			top: "0px"
		}), h = Z(() => (n.projects || []).filter((e) => !e.archived && !e.isNoProject && (e.path || e.repos.some((e) => e.path))));
		async function g(e, t) {
			d.value = e, f.value = "menu";
			let n = t.currentTarget.getBoundingClientRect();
			m.value = {
				left: `${Math.max(12, Math.min(n.right - 208, window.innerWidth - 220))}px`,
				top: `${Math.max(12, Math.min(n.bottom, window.innerHeight - 240))}px`
			}, await hn(), u.value?.showModal();
		}
		function _() {
			u.value?.close();
		}
		function v() {
			d.value && c(d.value), _();
		}
		function y() {
			d.value && r("archive", d.value.id), _();
		}
		function b() {
			d.value && p.value && r("project", d.value.id, p.value), _();
		}
		function x() {
			d.value && r("delete", d.value.id), _();
		}
		return (t, n) => (G(), K(W, null, [
			J("h2", Qs, F(e.heading || "Recents"), 1),
			e.error ? (G(), K("p", $s, [Y(F(e.error) + " ", 1), J("button", {
				class: "underline",
				onClick: n[0] ||= (e) => r("retry")
			}, "Retry")])) : X("v-if", !0),
			e.loading && !e.sessions.length ? (G(), K("p", ec, " Loading sessions… ")) : e.sessions.length ? (G(), K("nav", nc, [(G(!0), K(W, null, yr(e.sessions, (t) => (G(), K("div", {
				key: t.id,
				class: pe(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [o.value === t.id ? (G(), K(W, { key: 0 }, [On(J("input", {
				"onUpdate:modelValue": n[1] ||= (e) => s.value = e,
				"aria-label": "Session title",
				maxlength: "160",
				class: "min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-base text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white",
				onKeydown: [No(l, ["enter"]), n[2] ||= No((e) => o.value = "", ["esc"])]
			}, null, 544), [[xo, s.value]]), J("button", {
				"aria-label": "Save title",
				class: "rounded-md px-2 py-2 text-sm text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				onClick: l
			}, " Save ")], 64)) : (G(), K(W, { key: 1 }, [J("button", {
				class: "session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-current": e.selected === t.id ? "page" : void 0,
				onClick: (e) => r("select", t.id)
			}, [J("span", ic, F(t.title || "Untitled session"), 1), J("span", {
				class: "truncate text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]",
				title: a(t)
			}, F(a(t)), 9, ac)], 8, rc), J("button", {
				class: "icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-label": `Options for ${t.title || "Untitled session"}`,
				"aria-haspopup": "dialog",
				disabled: e.busy,
				onClick: (e) => g(t, e)
			}, " ⋮ ", 8, oc)], 64))], 2))), 128))])) : (G(), K("p", tc, " No conversations yet. ")),
			e.hasMore ? (G(), K("button", {
				key: 4,
				class: "load-more self-start rounded-md px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55",
				disabled: e.loading,
				onClick: n[3] ||= (e) => r("more")
			}, F(e.loading ? "Loading…" : "Load more"), 9, sc)) : X("v-if", !0),
			J("dialog", {
				ref_key: "popup",
				ref: u,
				class: "session-popup fixed m-0 w-52 rounded-xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl backdrop:bg-transparent",
				style: ce(m.value),
				"aria-label": f.value === "menu" ? "Session options" : f.value === "project" ? "Add to project" : "Delete conversation",
				onClick: n[7] ||= (e) => e.target === e.currentTarget && _()
			}, [f.value === "menu" ? (G(), K("div", lc, [
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: v
				}, " Rename "),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: n[4] ||= (e) => {
						f.value = "project", p.value = "";
					}
				}, " Add to project "),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: y
				}, " Archive "),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left text-[#fecaca] hover:bg-[#303030]",
					onClick: n[5] ||= (e) => f.value = "delete"
				}, " Delete ")
			])) : f.value === "project" ? (G(), K("form", {
				key: 1,
				class: "grid gap-3 p-1",
				onSubmit: jo(b, ["prevent"])
			}, [
				n[9] ||= J("label", { for: "session-project" }, "Add to project", -1),
				On(J("select", {
					id: "session-project",
					"onUpdate:modelValue": n[6] ||= (e) => p.value = e,
					class: "min-w-0 rounded-md bg-[#303030] p-2 text-base"
				}, [n[8] ||= J("option", {
					value: "",
					disabled: ""
				}, "Choose project", -1), (G(!0), K(W, null, yr(h.value, (e) => (G(), K("option", {
					key: e.id,
					value: e.id
				}, F(e.label), 9, uc))), 128))], 512), [[wo, p.value]]),
				h.value.length ? X("v-if", !0) : (G(), K("p", dc, "No projects available.")),
				J("button", {
					class: "rounded-lg bg-[#303030] px-3 py-2 disabled:opacity-55",
					disabled: !p.value || e.busy
				}, " Add ", 8, fc),
				J("button", {
					type: "button",
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					onClick: _
				}, " Cancel ")
			], 32)) : (G(), K("div", pc, [
				n[10] ||= J("p", null, "Delete this conversation? This cannot be undone.", -1),
				J("button", {
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					autofocus: "",
					onClick: _
				}, " Cancel "),
				J("button", {
					class: "rounded-lg bg-[#402b2b] px-3 py-2 text-[#fecaca]",
					disabled: e.busy,
					onClick: x
				}, " Delete conversation ", 8, mc)
			]))], 12, cc)
		], 64));
	}
}), gc = Symbol("live chat");
function _c(e) {
	An(gc, e);
}
function vc() {
	let e = jn(gc);
	if (!e) throw Error("Live chat context is missing");
	return e;
}
//#endregion
//#region src/features/chat/utils/transcript-entries.ts
function yc(e) {
	let t = e.messages.filter((e) => hs(e) !== "hidden" || !!e.blocks?.length), n = [], r = 0;
	for (let i = 0; i < t.length;) {
		let a = t[i];
		if (a.role === "user" || hs(a) === "status") {
			let o = hs(a);
			if (a.display_kind === "async_delegation_complete") {
				let e = a.id || `delegation-${i}`;
				n.push({
					kind: "turn",
					key: `receipt-${e}`,
					blocks: [{
						id: `receipt-${e}`,
						kind: "tool",
						title: gs(a),
						content: ts(a.content),
						complete: !0,
						state: "completed"
					}]
				});
			} else o === "status" ? n.push({
				kind: "status",
				text: gs(a),
				content: ts(a.content),
				key: a.id || `status-${i}`
			}) : o === "message" && (r++, n.push({
				kind: "user",
				message: a,
				key: a.id || `user-${i}`
			}));
			if (o === "status" && !a.blocks?.length) {
				i++;
				continue;
			}
			let s = i + 1;
			for (; s < t.length && t[s].role !== "user" && hs(t[s]) !== "status";) s++;
			let c = s === t.length, l = c && (!e.turnUserCount || e.turnUserCount === r) && e.blocks?.length ? e.blocks : a.blocks || Ds(t.slice(i + 1, s)), u = l.length ? l : c ? e.progress : [], d = c && (e.working ?? !!((a.blocks || e.blocks?.length || e.progress.length) && u.some((e) => e.kind !== "text" && !e.complete)));
			(u.length || d) && n.push({
				kind: "turn",
				blocks: u,
				working: d,
				approvalPending: c && e.approvalPending,
				key: `turn-${a.id || i}`
			}), i = s;
		} else {
			let e = i + 1;
			for (; e < t.length && t[e].role !== "user" && hs(t[e]) !== "status";) e++;
			n.push({
				kind: "turn",
				blocks: Ds(t.slice(i, e)),
				key: `history-${i}`
			}), i = e;
		}
	}
	return n;
}
//#endregion
//#region src/assets/file-icons/blank.svg?url
var bc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fff}.st1{fill:%23bababa}%3c/style%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st1'%20d='M0%2094V2C0%20.9.9%200%202%200h48c.6%200%201.1.2%201.5.7l20%2022.3c.3.4.5.8.5%201.3V94c0%201.1-.9%202-2%202H2c-1.1%200-2-.9-2-2zm68-68.9L49.1%204H4v88h64V25.1z'/%3e%3cpath%20class='st1'%20d='M48%2026V4c0-1.1.9-2%202-2s2%20.9%202%202v20h16c1.1%200%202%20.9%202%202s-.9%202-2%202H50c-1.1%200-2-.9-2-2z'/%3e%3c/svg%3e", xc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2372a536}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2s1.2%204.4%203.2%204.4c1%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm10.7%200c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201L36%2010.1c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.5-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%2372a536'%20stroke='%2372a536'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Sc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm8.7-10.3H32l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3L36%206.4h3.5l-3.9%2014.3h-3.3L28.4%206.4z'%20fill='%23fff'/%3e%3cpath%20d='M14%2054h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58'%20fill='none'%20stroke='%231f7244'%20stroke-width='3'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Cc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2H6.6V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zM24.1%206.1c3.8%200%205.9%203.1%205.9%207.3%200%204.2-2.1%207.5-5.9%207.5s-5.8-3.2-5.8-7.5c0-4.1%202.1-7.3%205.8-7.3zm0%2011.7c1.7%200%202.5-1.8%202.5-4.3s-.8-4.2-2.5-4.2-2.5%201.7-2.5%204.2.8%204.3%202.5%204.3zM38%206.1c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", wc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.4-34.6h3.3c2.9%200%204.7%202.6%204.7%207.1s-1.8%207.2-4.7%207.2H6.4V6.4zm3.3%2011.4c1.3%200%202.1-1.5%202.1-4.3S11%209.3%209.7%209.3H9v8.5h.7zM20%206.1c3%200%204.7%203.1%204.7%207.3%200%204.2-1.7%207.5-4.7%207.5s-4.7-3.2-4.7-7.5c0-4.1%201.7-7.3%204.7-7.3zm0%2011.7c1.4%200%202-1.8%202-4.3s-.6-4.2-2-4.2-2%201.7-2%204.2.6%204.3%202%204.3zM30.7%206.1c1%200%202.1.4%202.9%201.2l-1.1%202.8c-.3-.5-1-.9-1.7-.9-1.7%200-2.6%201.9-2.6%204.2%200%202.3.9%204.4%202.5%204.4.8%200%201.3-.5%201.8-1l1.1%202.8c-.7.7-1.6%201.3-3.2%201.3-3.2%200-5-3.1-5-7.4.1-4.2%202-7.4%205.3-7.4zm5.9%207.5l-2.8-7.2h2.9l.9%202.9c.3.9.4%201.8.4%201.8s.2-.9.5-1.8l.9-2.9h2.9l-2.8%207.2%202.7%207.1h-2.8l-.9-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.4%201.7l-.9%203h-2.8l2.7-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Tc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.4-34.9c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.1-4.5%202.6-7.6%206.5-7.6zm7.2%2012.4l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1h4.3v2.9h-8.9v-2.2z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", Ec = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23d75b26}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h2.8v5.8H12V6.4h2.8v14.3H12V15H9.2v5.7H6.5V6.4zm12%202.9h-2.7V6.4h8.1v2.9h-2.7v11.4h-2.8V9.3zm6.9-2.9h3.1l1.1%206c.2.9.4%202.4.4%202.4s.2-1.5.4-2.4l1.1-6h3.1l.8%2014.3h-2.6l-.3-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.7%204.1h-2.7l-.7-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.3%206.4h-2.6l.9-14.3zm11.5%200h2.8v11.4h3.7v2.9H37V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2075c-.5%200-1.1-.2-1.5-.6L13.6%2066c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-7%206.9%206.9%206.9c.8.8.8%202.1%200%203-.4.4-.9.6-1.4.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2074.3c-.4.5-.9.7-1.5.7zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3%201.1.4%201.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23d75b26'%20stroke='%23d75b26'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Dc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23307ac6}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm-.3-25.7H9v1.1c0%201.5.4%201.6.7%201.6.5%200%20.7-.3.7-1.6v-7H7.7v-3h6v9.9c0%203.3-2%204.6-4%204.6-2.1%200-4-1.4-4-4.6v-1zM18%2016.7c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%23307ac6'%20stroke='%23307ac6'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Oc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}.st1{fill:%23fff}.st2{fill:%23999;stroke:%23999;stroke-width:.5;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st1'%20d='M6%2041h60v49H6V41z'/%3e%3cpath%20class='st2'%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4.4-.2.8-.6%201.2-1%20.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2-.6-.6-1-1.2-1.2-2-.2-.8-.3-2.1-.3-4%200-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202c.2.8.4%202.1.4%204%200%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'/%3e%3cpath%20class='st1'%20d='M5.8%2015.7H8v.9c0%201.9.6%202.1%201.1%202.1.6%200%201.1-.4%201.1-2.1V8.7H7.8V6.5h4.6v10c0%203.2-1.6%204.4-3.3%204.4s-3.3-1.2-3.3-4.4v-.8zm9%201.8c.6.7%201.4%201.2%202.2%201.2%201%200%201.6-.7%201.6-1.8%200-2.6-4.5-2.5-4.5-6.6%200-2.3%201.4-4%203.8-4%201%200%202%20.3%202.8.9L20%209.4c-.5-.4-1.3-.8-2-.8-1.1%200-1.6.8-1.6%201.7%200%202.6%204.5%202.4%204.5%206.5%200%202.2-1.3%204.1-3.7%204.1-1.2%200-2.4-.5-3.3-1.4l.9-2zM27.1%206.2c3.2%200%205.1%203%205.1%207.3s-2%207.4-5.1%207.4c-3.2%200-5.1-3.1-5.1-7.4%200-4.2%202-7.3%205.1-7.3zm0%2012.4c1.8%200%202.9-2%202.9-5.1%200-3-1.1-4.9-2.9-4.9s-2.9%201.9-2.9%204.9c0%203.1%201.1%205.1%202.9%205.1zM34%206.5h2.3l3.3%208c.3.9.6%202.2.6%202.2h.1s-.1-1.3-.1-2.2v-8h2.1v14.2H40l-3.3-8.1c-.3-.9-.6-2.2-.6-2.2H36s.1%201.3.1%202.2v8H34V6.5z'/%3e%3cpath%20class='st2'%20d='M44.1%2067.1c-.7-.3-1.2-.9-1.2-1.6s.5-1.4%201.2-1.6c.3-.1.4-.3.3-.5-.3-.8-.5-1.6-1-2.2-.1-.3-.4-.3-.6-.2s-.5.3-.8.3c-1%200-1.7-.8-1.7-1.7%200-.3.1-.6.3-.8.1-.3%200-.4-.2-.6-.7-.4-1.5-.7-2.2-1-.3-.1-.4.1-.5.3-.3.7-.9%201.2-1.6%201.2s-1.4-.5-1.6-1.2c-.1-.3-.3-.4-.5-.3-.8.3-1.6.5-2.2%201-.3.1-.3.4-.2.6.2.3.3.5.3.8%200%201-.8%201.7-1.7%201.7-.3%200-.6-.1-.8-.3-.3-.1-.4%200-.6.2-.4.7-.7%201.5-1%202.2-.1.3.1.4.3.5.7.3%201.2.9%201.2%201.6s-.5%201.4-1.2%201.6c-.3.1-.4.3-.3.5.3.8.5%201.6%201%202.2.1.3.4.3.6.2.3-.2.5-.3.8-.3%201%200%201.7.8%201.7%201.7%200%20.3-.1.6-.3.8-.1.3%200%20.4.2.6.7.4%201.5.7%202.2%201%20.2%200%20.4-.1.4-.3.3-.7.9-1.2%201.6-1.2s1.4.5%201.6%201.2c.1.3.3.4.5.3.8-.3%201.6-.5%202.2-1%20.3-.1.3-.4.2-.6-.1-.3-.3-.5-.3-.8%200-1%20.8-1.7%201.7-1.7.3%200%20.6.1.8.3.3.1.4%200%20.6-.2.4-.7.7-1.5%201-2.2.2-.1.1-.4-.2-.5zm-8.3%201c-1.5%200-2.7-1.2-2.7-2.7%200-1.5%201.2-2.7%202.7-2.7s2.7%201.2%202.7%202.7c.1%201.5-1.2%202.7-2.7%202.7z'/%3e%3c/svg%3e", kc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm14.6%200h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2H25v8.5h.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13.5%2076.4V54.6h6.4l6.4%208%206.4-8h6.4v21.8h-6.4V63.9l-6.4%208-6.4-8v12.5h-6.4zm38.4%200l-9.6-10.6h6.4V54.6h6.4v11.2h6.4l-9.6%2010.6z'/%3e%3c/svg%3e", Ac = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm8.7%203.6c.4.4%201.1.7%201.7.7.9%200%201.6-.4%201.6-1.6%200-1-.7-1.5-2.3-1.5h-.9l-.7-1.8%202-2.5c.5-.6.9-1%20.9-1s-.4.1-1.1.1h-2.3v-3h7.2V9l-2.6%203.1c2%20.5%203.1%202.1%203.1%204.1%200%202.4-1.4%204.8-4.7%204.8-1.3%200-2.5-.4-3.5-1.3l1.6-2.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", jc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23f60}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm6.8%201.8l3.7-8.8h4.2v8.1H42v3h-1.2v3.2h-3.2v-3.2h-4.7v-2.3zm4.7-.7v-3.4c0-.8.1-1.3.1-1.3s-.1.6-.3%201.2L36%2014.5h1.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13%2083.1h46V47.9H13v35.2zm8.9-2.7h-5.5v-3.9h5.5v3.9zm16.9%200h-5.5v-3.9h5.5v3.9zm11.3-30.1h5.5v4h-5.5v-4zm0%2026.1h5.5v3.9h-5.5v-3.9zm-8.5-26.1H47v3.9h-5.5v-3.9zm0%2026.1H47v3.9h-5.5l.1-3.9zm-8.4-26.1h5.5v3.9h-5.5v-3.9zm-.8%209.7l7.2%204.1c1.3.8%201.3%202%200%202.8L32.4%2071c-1.3.8-2.4.1-2.4-1.4v-8.3c0-1.4%201.1-2.1%202.4-1.3zm-7.7-9.7h5.4v3.9h-5.4v-3.9zm0%2026.1h5.4v3.9h-5.4v-3.9zm-8.3-26.1h5.5v4h-5.5v-4z'/%3e%3c/svg%3e", Mc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23c11e07}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zm9.1-11.4h7.1v2.9h-3.8v3.1H38v2.9h-3.1v5.4h-3.3V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M33.5%2046.538c-2.3%200-4.1%201.9-4.1%204.1%200%202.8%201.6%206.3%203.2%209.6-1.3%204-2.7%208.3-4.6%2011.9-3.8%201.5-7.2%202.6-9.2%204.3l-.1.1c-.7.8-1.2%201.8-1.2%202.9%200%202.3%201.9%204.1%204.1%204.1%201.1%200%202.2-.4%202.9-1.2%200%200%20.1%200%20.1-.1%201.5-1.8%203.3-5.1%204.9-8%203.6-1.4%207.5-2.9%2011.1-3.8%202.7%202.2%206.6%203.6%209.8%203.6%202.3%200%204.1-1.9%204.1-4.1%200-2.3-1.9-4.1-4.1-4.1-2.6%200-6.3.9-9.1%201.9-2.3-2.2-4.4-4.9-6-7.8%201.1-3.4%202.4-6.7%202.4-9.3-.1-2.3-1.9-4.1-4.2-4.1zm0%202.4c.9%200%201.6.7%201.6%201.6%200%201.2-.7%203.5-1.4%205.9-1-2.4-1.9-4.7-1.9-5.9.1-.8.8-1.6%201.7-1.6zm.7%2014.1c1.2%202%202.7%203.8%204.3%205.4-2.4.7-4.8%201.5-7.2%202.4%201.2-2.5%202.1-5.2%202.9-7.8zm16.2%205.3c.9%200%201.6.7%201.6%201.6%200%20.9-.7%201.6-1.6%201.6-1.9%200-4.5-.8-6.6-2%202.4-.6%205.1-1.2%206.6-1.2zm-24.5%207.3c-1.2%202.1-2.3%204-3.1%205-.3.3-.6.4-1.1.4-.9%200-1.6-.7-1.6-1.6%200-.4.2-.9.4-1.1.9-.8%203-1.7%205.4-2.7z'%20fill='%23c11e07'%20stroke='%23c11e07'%20stroke-width='.75'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Nc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm10-4.1h-3.1V6.4h9.6v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", Pc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205H9.5v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zm5.7-7h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205h-1.1v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zM27%209.3h-2.8V6.4h8.6v2.9H30v11.4h-3V9.3zm9%204.3l-3.1-7.2h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.1-.9-.3-1.7-.3-1.7s-.2.8-.5%201.7l-1%203H33l3-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", Fc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9s-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm10%201.4l-3.6-8.4h3.6l1.1%203.4c.3%201%20.5%202.1.5%202.1h.1s.2-1.1.5-2.1l1.1-3.4h3.6l-3.6%208.4v5.9h-3.3v-5.9z'%20fill='%23fff'/%3e%3cpath%20d='M34.5%2083.4c-4.4-.1-7.2-1.5-7.9-3.8l-.1-.3v-4.5c0-5.2%200-5.3.3-6.1.5-1.5%201.7-2.5%203.5-2.9l.4-.1h5.1c3.7%200%205.2%200%205.4-.1%201.1-.2%201.7-.4%202.3-.9.8-.6%201.4-1.6%201.6-2.6.2-.8.2-.7.2-3.5v-2.5h3.6l.4.1c1.9.6%203.3%202.3%203.9%205.1.2%201.1.2%201.1.2%203.8%200%202.6%200%202.6-.2%203.5-.2.8-.4%201.6-.8%202.3-.7%201.4-1.8%202.4-3.1%202.8-.8.3-.1.2-7.5.3h-6.7v1.2h8.8v4.6c-.1.3-.1.6-.4%201s-.8.9-1.1%201.2c-1.2.8-3%201.3-5.4%201.4h-2.5zm6.1-2.8c.8-.1%201.5-1%201.3-1.8-.1-.7-.6-1.2-1.3-1.3-1.1-.1-2%20.8-1.8%201.8.1.8.8%201.3%201.6%201.3h.2zm-19-6.5c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%23fed142'/%3e%3cpath%20d='M21.6%2074.1c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%233571a3'/%3e%3c/svg%3e", Ic = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fea500}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm1.3-24.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8zM16%206.4h3.6l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.7-8.1h3.5l-3.9%2014.3h-3.3L16%206.4zm19.1-.3c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.2-4.5%202.6-7.6%206.5-7.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M27.1%2060.2L18%2079.4l1.7%201.7L31%2069.8c-.4-.9-.3-2%20.5-2.8%201-1%202.5-1%203.5%200s1%202.5%200%203.5c-.7.7-1.9.9-2.8.5L20.9%2082.3l1.7%201.7%2019.2-9.1L46%2063.4%2038.6%2056l-11.5%204.2zm26.3-2.3L44%2048.5c-.8-.8-2-.8-2.8%200L39%2050.7c-.8.8-.8%202%200%202.8l9.4%209.4c.8.8%202%20.8%202.8%200l2.2-2.2c.8-.8.8-2%200-2.8z'/%3e%3c/svg%3e", Lc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234d1b9b}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm10.5-2.9H23l3.6%2014.3h-3.3l-.6-3h-3l-.6%203h-3.3l3.6-14.3zm2.8%208.6l-.6-2.8c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.8h2zm6.9-8.6h4.5c.6%200%201.3.1%201.9.4%201.4.6%202.4%202.1%202.4%204%200%201.7-.8%203.3-2%204%200%200%20.2.2.5.9l2.3%205h-3.6l-2-4.8h-.8v4.8H29V6.4zM33%2013c.9%200%201.6-.7%201.6-1.9%200-.7-.2-1.2-.6-1.5-.3-.2-.6-.3-.9-.3h-.7V13h.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M43.6%2068.3l-7.3-3.4L51%2058l7.3%203.4-7.3%203.5-7.4%203.4zM51%2051.2l-7.3-3.4-7.3%203.4L51%2058.1l7.3-3.4-7.3-3.5zM28.9%2061.4L21.6%2058l-7.3%203.4L29%2068.3l7.3-3.4-7.4-3.5zm0-6.8l7.3-3.4-7.3-3.4-14.7%206.9%207.3%203.4%207.4-3.5zM51%2066.9l-6.6%203-.8.4-.8-.4-6.6-3-6.6%203-.8.4-.8-.4-6.6-3v10.7l14.7%207.7L51%2077.6V66.9z'/%3e%3c/svg%3e", Rc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234065aa}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm9.9%207.4c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M37.9%2055.1v-7.6H33c-.1.3-.2.6-.2%201-.1.2-.1.3-.1.5-.5%202.8-2%204.8-4.5%205.9-.7.3-1.4.4-2.1.3v6.1h3.6c.1%208.6.1%2013.1.1%2013.3v.5c.5%203.8%202.4%206%205.9%206.9%201.4.4%202.9.6%204.5.6%202-.1%203.9-.4%205.8-1v-7.2c-1.1.3-2.1.6-3%20.9-1.7.5-3.2.2-4.4-1-.1-.2-.3-.4-.3-.6-.2-.9-.3-1.9-.3-2.8v-9.6h7.8v-6.1h-7.9v-.1z'/%3e%3c/svg%3e", zc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm11.5%204.3L17%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1H24l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203h-3.5l3.3-7.1zm12.1-4.3h-3.1V6.4H39v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14.6%2077.2h42.8v6.2H14.6zm0-14.8h42.8v6.2H14.6zm0-15h42.8v6.2H14.6z'/%3e%3c/svg%3e", Bc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM5.6%206.4h3.1l1.1%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.2-8.9h2.9l1.2%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.1-8.9h3.1l-2.4%2014.3H14l-1.1-7.2c-.1-.9-.2-1.7-.2-1.7h-.1s0%20.8-.1%201.7l-1%207.2H8L5.6%206.4zm18.3%200h3.4l3.4%2014.3h-3.1l-.6-3h-2.9l-.6%203h-3.1l3.5-14.3zm2.6%208.6l-.5-2.9c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.9h1.9zm4.3-8.6h3.4l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.6-8.1h3.3l-3.7%2014.3h-3.2L30.8%206.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", Vc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm9.8-7.2h3.3v11.4h4.3v2.9h-7.6V6.4zm11%2010.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.3-.5-1.3-.9-2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", Hc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.6-27.4L5.5%206.4h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9H15l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203H5.6l3-7.1zm8-7.2h3v11.4h3.9v2.9h-6.8V6.4zm9%2010.3c.5.6%201.3%201.2%202.1%201.2s1.2-.6%201.2-1.2c0-2-4.3-2.1-4.3-6.2%200-2.4%201.5-4.3%204.1-4.3%201.1%200%202.2.3%203.1%201l-1.1%202.9c-.4-.4-1.3-.9-1.9-.9-.8%200-1.2.6-1.2%201.2%200%202.1%204.3%202%204.3%206.1%200%202.3-1.3%204.4-4%204.4-1.3%200-2.6-.5-3.6-1.4l1.3-2.8zm10.2-3.1l-3.1-7.2H36l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203h-3.2l3.1-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", Uc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm10.3-7.2H23l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6h3.6l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H23l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l1.1-14.3zm15.1%200h3.3v11.4H42v2.9h-7.6V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2076c-.5%200-1.1-.2-1.5-.6L13.6%2067c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-6.9%206.9%206.9%206.9c.8.8.8%202.1%200%203-.5.4-1%20.6-1.5.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2075.4c-.4.4-.9.6-1.5.6zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3s1.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23666'%20stroke='%23666'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Wc = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.9-26.2L5.5%206.5H8l1.5%204.2c.3.9.5%201.9.5%201.9s.2-1%20.5-1.9L12%206.5h2.5l-3.4%208.3v5.9H8.9v-5.9zm8.4-8.3h2.5l3.5%2014.2H21l-.9-3.7h-3.2l-.8%203.7h-2.3l3.5-14.2zm2.4%208.5l-.8-3.8c-.2-.8-.4-2.2-.4-2.2h-.1s-.2%201.4-.4%202.2l-.8%203.8h2.5zm5.2-8.5h2.5l1.8%206.9c.2.9.4%202.2.4%202.2h.1s.2-1.3.4-2.2l1.8-6.9h2.5l.8%2014.2h-2.1l-.4-7.9c-.1-.9%200-2.2%200-2.2h-.1s-.2%201.4-.4%202.3l-1.4%205.4h-2.2l-1.4-5.4c-.2-.8-.4-2.3-.4-2.3h-.1s.1%201.3%200%202.2l-.4%207.9h-2.1l.7-14.2zm12.3%200h2.3v12h4.3v2.2h-6.5V6.5z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14%2048.9h37v4.3H14zm7%209.6h37v4.3H21zm-7%209.6h37v4.3H14zm7%209.6h37V82H21z'/%3e%3c/svg%3e", Gc = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm0-22.5l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1H15v2.9H6v-2.2zM18.1%206.4h3.3v14.3h-3.3V6.4zm7%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", Kc = {};
function qc(e) {
	let t = Kc[e];
	if (t) return t;
	t = Kc[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		t.push(n);
	}
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		t[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
	}
	return t;
}
function Jc(e, t) {
	typeof t != "string" && (t = Jc.defaultChars);
	let n = qc(t);
	return e.replace(/(%[a-f0-9]{2})+/gi, function(e) {
		let t = "";
		for (let r = 0, i = e.length; r < i; r += 3) {
			let a = parseInt(e.slice(r + 1, r + 3), 16);
			if (a < 128) {
				t += n[a];
				continue;
			}
			if ((a & 224) == 192 && r + 3 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16);
				if ((n & 192) == 128) {
					let e = a << 6 & 1984 | n & 63;
					t += e < 128 ? "��" : String.fromCharCode(e), r += 3;
					continue;
				}
			}
			if ((a & 240) == 224 && r + 6 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16);
				if ((n & 192) == 128 && (i & 192) == 128) {
					let e = a << 12 & 61440 | n << 6 & 4032 | i & 63;
					t += e < 2048 || e >= 55296 && e <= 57343 ? "���" : String.fromCharCode(e), r += 6;
					continue;
				}
			}
			if ((a & 248) == 240 && r + 9 < i) {
				let n = parseInt(e.slice(r + 4, r + 6), 16), i = parseInt(e.slice(r + 7, r + 9), 16), o = parseInt(e.slice(r + 10, r + 12), 16);
				if ((n & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
					let e = a << 18 & 1835008 | n << 12 & 258048 | i << 6 & 4032 | o & 63;
					e < 65536 || e > 1114111 ? t += "����" : (e -= 65536, t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023))), r += 9;
					continue;
				}
			}
			t += "�";
		}
		return t;
	});
}
Jc.defaultChars = ";/?:@&=+$,#", Jc.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var Yc = {};
function Xc(e) {
	let t = Yc[e];
	if (t) return t;
	t = Yc[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function Zc(e, t, n) {
	typeof t != "string" && (n = t, t = Zc.defaultChars), n === void 0 && (n = !0);
	let r = Xc(t), i = "";
	for (let t = 0, a = e.length; t < a; t++) {
		let o = e.charCodeAt(t);
		if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
			i += e.slice(t, t + 3), t += 2;
			continue;
		}
		if (o < 128) {
			i += r[o];
			continue;
		}
		if (o >= 55296 && o <= 57343) {
			if (o >= 55296 && o <= 56319 && t + 1 < a) {
				let n = e.charCodeAt(t + 1);
				if (n >= 56320 && n <= 57343) {
					i += encodeURIComponent(e[t] + e[t + 1]), t++;
					continue;
				}
			}
			i += "%EF%BF%BD";
			continue;
		}
		i += encodeURIComponent(e[t]);
	}
	return i;
}
Zc.defaultChars = ";/?:@&=+$,-_.!~*'()#", Zc.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function Qc(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function $c() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var el = /^([a-z0-9.+-]+:)/i, tl = /:[0-9]*$/, nl = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, rl = [
	"%",
	"/",
	"?",
	";",
	"#",
	"'",
	"{",
	"}",
	"|",
	"\\",
	"^",
	"`",
	"<",
	">",
	"\"",
	"`",
	" ",
	"\r",
	"\n",
	"	"
], il = [
	"/",
	"?",
	"#"
], al = 255, ol = /^[+a-z0-9A-Z_-]{0,63}$/, sl = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, cl = {
	javascript: !0,
	"javascript:": !0
}, ll = {
	http: !0,
	https: !0,
	ftp: !0,
	gopher: !0,
	file: !0,
	"http:": !0,
	"https:": !0,
	"ftp:": !0,
	"gopher:": !0,
	"file:": !0
};
function ul(e, t) {
	if (e && e instanceof $c) return e;
	let n = new $c();
	return n.parse(e, t), n;
}
$c.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = nl.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = el.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && cl[o]) && (a = a.substr(2), this.slashes = !0)), !cl[o] && (i || o && !ll[o])) {
		let e = -1;
		for (let t = 0; t < il.length; t++) r = a.indexOf(il[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < rl.length; t++) r = a.indexOf(rl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(ol)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(ol)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(sl);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > al && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), ll[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, $c.prototype.parseHost = function(e) {
	let t = tl.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region node_modules/mdurl/index.mjs
var dl = /* @__PURE__ */ t({
	decode: () => Jc,
	encode: () => Zc,
	format: () => Qc,
	parse: () => ul
}), fl = /* @__PURE__ */ t({
	Any: () => pl,
	Cc: () => ml,
	Cf: () => hl,
	P: () => gl,
	S: () => _l,
	Z: () => vl
}), pl = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, ml = /[\0-\x1F\x7F-\x9F]/, hl = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, gl = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, _l = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, vl = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, yl = [
	8364,
	0,
	8218,
	402,
	8222,
	8230,
	8224,
	8225,
	710,
	8240,
	352,
	8249,
	338,
	0,
	381,
	0,
	0,
	8216,
	8217,
	8220,
	8221,
	8226,
	8211,
	8212,
	732,
	8482,
	353,
	8250,
	339,
	0,
	382,
	376
];
function bl(e) {
	return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function xl(e) {
	return bl(e) ? 65533 : e >= 128 && e <= 159 && yl[e - 128] || e;
}
function Sl(e) {
	return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(xl(e));
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/internal/decode-shared.js
var Cl = /* #__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(127), t = 0;
	for (let n = 33; n <= 126; n++) n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
	return e;
})();
function wl(e, t, n, r, i, a) {
	let o = e.length, s = a * 90, c = 0, l = () => {
		let t = Cl[e.charCodeAt(c++)];
		return t < a ? t : t * 91 - s + Cl[e.charCodeAt(c++)];
	}, u = n - r, d = n + i, f = new Int32Array(d);
	f.fill(-1, r, a), f.fill(-1, a + u, d);
	let p = new Int32Array(d), m = new Int32Array(d);
	function h(t, n) {
		let r = 0, i = n, a = n + t;
		for (; i < a;) {
			let t = Cl[e.charCodeAt(c++)];
			if (t < 89) r += t, f[i++] = r;
			else if (t === 89) {
				let t = Cl[e.charCodeAt(c++)] + 2;
				for (; t--;) f[i++] = ++r;
			} else {
				let t = Cl[e.charCodeAt(c++)];
				r += 89 + (t < 90 ? t * 91 + Cl[e.charCodeAt(c++)] : Cl[e.charCodeAt(c++)] * 8281 + Cl[e.charCodeAt(c++)] * 91 + Cl[e.charCodeAt(c++)]), f[i++] = r;
			}
		}
	}
	h(r, 0), h(u, a);
	let g = new Int32Array(i * 2), _ = 0, v = 0;
	function y(e, t) {
		for (let n = 0; n < e; n++) {
			let e = t + n, r = l(), i = l();
			g[v * 2] = r, g[v * 2 + 1] = i, v += 1, p[e] = _;
			let a = (f[r] < 0 ? m[r] : 1) + (f[i] < 0 ? m[i] : 1);
			m[e] = a, _ += a;
		}
	}
	y(i - a + r, a + u), y(a - r, r);
	let b = new Uint16Array(_), x = 0;
	for (let e = 0; e < v; e++) for (let t = 0; t < 2; t++) {
		let n = g[e * 2 + t], r = f[n];
		if (r < 0) {
			let e = p[n], t = e + m[n];
			for (; e < t;) b[x++] = b[e++];
		} else b[x++] = r;
	}
	let S = new Uint16Array(t), C = 0;
	for (; c < o;) {
		let t = Cl[e.charCodeAt(c++)];
		t >= a && (t = t * 91 - s + Cl[e.charCodeAt(c++)]);
		let n = f[t];
		if (n < 0) {
			let e = p[t], n = e + m[t];
			for (; e < n;) S[C++] = b[e++];
		} else S[C++] = n;
	}
	return S;
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/generated/decode-data-html.js
var Tl = /* #__PURE__ */ wl("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61), El;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(El ||= {});
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/decode.js
var Dl;
(function(e) {
	e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(Dl ||= {});
var Ol = 32, kl = 21, Al = 2097151, jl = 2047, Ml = 0;
function Nl(e) {
	let t = e >>> kl;
	return t === jl ? Ml : t;
}
function Pl(e) {
	return e - Dl.ZERO >>> 0 <= 9;
}
function Fl(e) {
	return (e | Ol) - Dl.LOWER_A >>> 0 <= 5;
}
function Il(e) {
	return (e | Ol) - Dl.LOWER_A >>> 0 <= 25;
}
function Ll(e) {
	return e === Dl.EQUALS || Il(e) || Pl(e);
}
var Rl;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Rl ||= {});
var zl;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(zl ||= {});
function Bl(e, t, n, r) {
	let i = (t & El.BRANCH_LENGTH) >> 7, a = t & El.JUMP_TABLE;
	if (a) {
		if (i === 0) return r === a ? n : -1;
		let t = r - a;
		if (t >>> 0 >= i) return -1;
		let o = e[n + t];
		return o === 0 ? -1 : n + i + o - 1 & 65535;
	}
	if (i === 0) return -1;
	let o = i + 1 >> 1, s = n + o + i;
	for (let t = 0; t < i; t++) {
		let i = e[n + (t >> 1)] >> ((t & 1) << 3) & 255;
		if (i === r) return s + e[n + o + t] & 65535;
		if (i > r) return -1;
	}
	return -1;
}
function Vl(e, t, n) {
	return n === 1 ? String.fromCharCode(e[t] & El.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function Hl(e, t, n) {
	let r = t + 1, i = 0, a = r;
	if (r < n && (e.charCodeAt(r) | Ol) === Dl.LOWER_X) for (r += 1, a = r; r < n;) {
		let t = e.charCodeAt(r);
		if (Pl(t)) i = i * 16 + (t - Dl.ZERO);
		else if (Fl(t)) i = i * 16 + ((t | Ol) - Dl.LOWER_A + 10);
		else break;
		r += 1;
	}
	else for (; r < n;) {
		let t = e.charCodeAt(r) - Dl.ZERO;
		if (t >>> 0 > 9) break;
		i = i * 10 + t, r += 1;
	}
	if (r === a) return 0;
	r < n && e.charCodeAt(r) === Dl.SEMI && (r += 1), i > 1114111 && (i = 1114112);
	let o = r - t;
	return o >= jl && (Ml = o, o = jl), o << kl | i;
}
function Ul(e, t, n) {
	let r = Tl, i = e.indexOf("&");
	if (i < 0) return e;
	let a = e.length, o = 0, s = "", c = r[0], l = c & El.JUMP_TABLE, u = (c & El.BRANCH_LENGTH) >> 7;
	do {
		let c = i + 1, d = e.charCodeAt(c), f, p;
		if (d === Dl.NUM) {
			let n = Hl(e, c, a);
			f = Nl(n), t && f > 0 && e.charCodeAt(c + f - 1) !== Dl.SEMI && (f = 0), p = f === 0 ? "" : Sl(n & Al);
		} else if (Il(d)) {
			f = 0, p = "";
			let n = d - l, i;
			if (n >>> 0 < u) {
				let e = r[1 + n];
				i = e === 0 ? -1 : u + e & 65535;
			} else i = -1;
			let o = 0, s = 0, m = i < 0 ? 0 : r[i], h = c + 1;
			trie: for (; h < a;) {
				for (; (m & (El.VALUE_LENGTH | El.FLAG13)) === 0 && (m & El.JUMP_TABLE) !== 0;) {
					let t = m & El.JUMP_TABLE, n = (m & El.BRANCH_LENGTH) >> 7;
					if (n === 0) {
						if (e.charCodeAt(h) !== t) break trie;
						i += 1;
					} else {
						let a = e.charCodeAt(h) - t;
						if (a >>> 0 >= n) break trie;
						let o = r[i + 1 + a];
						if (o === 0) break trie;
						i = i + n + o & 65535;
					}
					if (m = r[i], h += 1, h >= a) break trie;
				}
				if ((m & (El.VALUE_LENGTH | El.FLAG13)) === El.FLAG13) {
					let t = (m & El.BRANCH_LENGTH) >> 7;
					if (e.charCodeAt(h) !== (m & El.JUMP_TABLE)) break;
					h += 1;
					let n = t - 1, a = i + 1, o = 0;
					for (; o + 1 < n; o += 2) {
						let t = r[a];
						if (e.charCodeAt(h) !== (t & 255) || (h += 1, e.charCodeAt(h) !== (t >> 8 & 255))) break trie;
						h += 1, a += 1;
					}
					if (o < n) {
						if (e.charCodeAt(h) !== (r[a] & 255)) break;
						h += 1;
					}
					i += 1 + (t >> 1), m = r[i];
					continue;
				}
				let n = m >>> 14, l = e.charCodeAt(h);
				if (n !== 0) {
					if (l === Dl.SEMI) {
						f = h - c + 1, p = n === 1 ? String.fromCharCode(m & El.VALUE_MASK) : Vl(r, i, n);
						break;
					}
					if (!t && (m & El.FLAG13) === 0 && (f = h - c, o = i, s = n), n === 1) break;
				}
				let u = Bl(r, m, i + (n || 1), l);
				if (u < 0) break;
				i = u, m = r[i], h += 1;
			}
			if (p === "") {
				let e = m >>> 14;
				e !== 0 && !t && (m & El.FLAG13) === 0 && (f = h - c, o = i, s = e), f > 0 && (p = Vl(r, o, s));
			}
		} else f = 0, p = "";
		f === 0 || n && d !== Dl.NUM && e.charCodeAt(c + f - 1) !== Dl.SEMI && c + f < a && Ll(e.charCodeAt(c + f)) ? i = c : (o < i && (s += e.slice(o, i)), s += p, i = o = c + f), e.charCodeAt(i) !== Dl.AMP && (i = e.indexOf("&", i));
	} while (i >= 0);
	return s + e.slice(o);
}
function Wl(e) {
	return Ul(e, !0, !1);
}
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var Gl = class {
	src_Any = pl.source;
	src_Cc = ml.source;
	src_Z = vl.source;
	src_P = gl.source;
	src_ZPCc = [
		this.src_Z,
		this.src_P,
		this.src_Cc
	].join("|");
	src_ZCc = [this.src_Z, this.src_Cc].join("|");
	cache = {};
	opts = {
		maxLength: 1e4,
		urlAuth: !1,
		schema_names: []
	};
	constructor(e = {}) {
		this.opts = {
			...this.opts,
			...e
		};
	}
	set(e = {}) {
		return this.opts = {
			...this.opts,
			...e
		}, this.cache = {}, this;
	}
	escapeRE(e) {
		return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	}
	nestedPairRE(e, t, n = 4) {
		let r = this.escapeRE(e), i = this.escapeRE(t), a = `(?:(?!${this.src_ZCc}|${r}|${i}).)`, o = `${r}${a}{0,1000}${i}`;
		for (let e = 2; e <= n; e++) o = `${r}(?:${a}|${o}){0,1000}${i}`;
		return o;
	}
	get_text_separators() {
		return this.cache.text_separators ??= /[><\uff5c]/;
	}
	get_pseudo_letter() {
		return this.cache.src_pseudo_letter ??= RegExp(`(?:(?!${this.get_text_separators().source}|${this.src_ZPCc})${this.src_Any})`);
	}
	get_ipv4_addr() {
		return this.cache.src_ip4 ??= /* @__PURE__ */ RegExp("(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])[.]){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])");
	}
	get_ipv6_addr() {
		let e = "[0-9A-Fa-f]{1,4}", t = `(?:(?:${e}:${e})|${this.get_ipv4_addr().source})`;
		return this.cache.src_ip6_addr ??= RegExp(`(?:(?:${e}:){6}${t}|::(?:${e}:){5}${t}|(?:${e})?::(?:${e}:){4}${t}|(?:(?:${e}:){0,1}${e})?::(?:${e}:){3}${t}|(?:(?:${e}:){0,2}${e})?::(?:${e}:){2}${t}|(?:(?:${e}:){0,3}${e})?::${e}:${t}|(?:(?:${e}:){0,4}${e})?::${t}|(?:(?:${e}:){0,5}${e})?::${e}|(?:(?:${e}:){0,6}${e})?::)`);
	}
	get_ipv6_url_host() {
		return this.cache.src_ip6_host ??= RegExp(`\\[${this.get_ipv6_addr().source}\\]`);
	}
	get_ipv6_mail_host() {
		return this.cache.src_ipv6_mail_host ??= RegExp(`\\[IPv6:${this.get_ipv6_addr().source}\\]`);
	}
	get_auth() {
		return this.cache.src_auth ??= RegExp(`(?:(?:(?!${this.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`);
	}
	get_port() {
		return this.cache.src_port ??= /* @__PURE__ */ RegExp("(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?");
	}
	get_host_terminator() {
		return this.cache.src_host_terminator ??= RegExp(`(?=$|${this.get_text_separators().source}|${this.src_ZPCc})(?!${this.opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${this.src_ZPCc}))`);
	}
	get_path_terminator() {
		return this.cache.src_path_terminator ??= RegExp(`${this.src_ZPCc}|${this.get_text_separators().source}`);
	}
	get_path() {
		return this.cache.src_path ??= RegExp(`(?:[/?#](?:${this.nestedPairRE("[", "]")}|${this.nestedPairRE("(", ")")}|${this.nestedPairRE("{", "}")}|\\"(?:(?!${this.src_ZCc}|["]).){1,100}\\"|\\'(?:(?!${this.src_ZCc}|[']).){1,100}\\'|\\'(?=${this.get_pseudo_letter().source}|[-])|\\.{2,20}[:]?[a-zA-Z0-9%/&]|\\.(?!${this.src_ZCc}|[.]|$)|` + (this.opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-{0,19})|" : "\\-{1,20}|") + `,(?!${this.src_ZCc}|$)|;(?!${this.src_ZCc}|$)|\\!{1,20}(?!${this.src_ZCc}|[!]|$)|\\?(?!${this.src_ZCc}|[?]|$)|` + this.get_path_extra().source + `[\\\\/:%@#&=_~*]|(?!${this.get_path_terminator().source}).){1,${this.opts.maxLength}}|\\/)?`);
	}
	get_mail_name() {
		return this.cache.src_mail_name ??= /* @__PURE__ */ RegExp("[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9](?:[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9]|[.](?=[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9])){0,63}");
	}
	get_xn() {
		return this.cache.src_xn ??= /* @__PURE__ */ RegExp("xn--[a-z0-9\\-]{1,59}");
	}
	get_tld() {
		if (this.cache.tld) return this.cache.tld;
		let e = [...new Set(this.opts.tlds || [])].sort().reverse().join("|");
		return this.cache.tld = RegExp(`${e || "$#none#$"}|${this.get_xn().source}`), this.cache.tld;
	}
	get_domain_root() {
		return this.cache.src_domain_root ??= RegExp("(?:" + this.get_xn().source + `|${this.get_pseudo_letter().source}{1,63})`);
	}
	get_domain() {
		return this.cache.src_domain ??= RegExp("(?:" + this.get_xn().source + `|(?:${this.get_pseudo_letter().source})|(?:${this.get_pseudo_letter().source}(?:-|${this.get_pseudo_letter().source}){0,61}${this.get_pseudo_letter().source}))`);
	}
	get_url_host_port() {
		return this.cache.url_host_port ??= RegExp("(?:" + this.get_ipv6_url_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,10}${this.get_domain().source}))` + this.get_port().source + this.get_host_terminator().source);
	}
	get_fuzzy_url_host_port() {
		return this.cache.fuzzy_url_host_port ??= RegExp("(?:" + (this.opts.fuzzyIP ? this.get_ipv4_addr().source + "|" : "") + `(?:(?:(?:${this.get_domain().source})\\.){1,10}(?:${this.get_tld().source})))` + this.get_host_terminator().source);
	}
	get_mail_host() {
		return this.cache.src_mail_host ??= RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,4}${this.get_domain().source}))` + this.get_host_terminator().source);
	}
	get_fuzzy_mail_host() {
		return this.cache.src_fuzzy_mail_host ??= RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})[.]){1,4}${this.get_domain_root().source}))` + this.get_host_terminator().source);
	}
	get_path_extra() {
		return this.cache.src_path_extra ??= /* @__PURE__ */ RegExp("");
	}
	get_fuzzy_mail_host_search() {
		return this.cache.mail_fuzzy_host_search ??= RegExp(`@${this.get_fuzzy_mail_host().source}`, "ig");
	}
	get_fuzzy_link_search() {
		return this.cache.link_fuzzy_search ??= RegExp(`(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${this.src_ZPCc}))(?:(?![$+<=>^\`|\uff5c])${this.get_fuzzy_url_host_port().source}${this.get_path().source})`, "ig");
	}
	get_http_validator() {
		return this.cache.http_validator ??= RegExp("\\/\\/" + (this.opts.urlAuth ? this.get_auth().source : "") + this.get_url_host_port().source + this.get_path().source, "iy");
	}
	get_relative_proto_validator() {
		return this.cache.relative_proto_validator ??= RegExp((this.opts.urlAuth ? this.get_auth().source : "") + `(?:localhost|${this.get_ipv6_url_host().source}|(?:(?:${this.get_domain().source})[.]){1,10}${this.get_domain_root().source})` + this.get_port().source + this.get_host_terminator().source + this.get_path().source, "iy");
	}
	get_mail_name_validator() {
		return this.cache.mail_name_validator ??= RegExp(`(?:^|${this.get_text_separators().source}|"|\\(|${this.src_ZCc})(${this.get_mail_name().source})$`);
	}
	get_mailto_validator() {
		return this.cache.mailto_validator ??= RegExp(`${this.get_mail_name().source}@${this.get_mail_host().source}`, "iy");
	}
	get_schema_names() {
		return this.cache.schema_names ??= new RegExp((this.opts.schema_names || []).map((e) => this.escapeRE(e)).join("|"));
	}
	get_schema_search() {
		return this.cache.schema_search ??= RegExp(`(^|(?!_)(?:[><\uff5c]|${this.src_ZPCc}))(${this.get_schema_names().source})`, "ig");
	}
	get_schema_at_start() {
		return this.cache.schema_at_start ??= RegExp(`^${this.get_schema_search().source}`, "i");
	}
}, Kl = {
	validate: (e, t, n) => {
		let r = n.re.get_http_validator();
		r.lastIndex = t;
		let i = r.exec(e);
		return i ? i[0].length : 0;
	},
	normalize: (e, t) => t.normalize(e)
}, ql = {
	"http:": Kl,
	"https:": Kl,
	"ftp:": Kl,
	"//": {
		validate: function(e, t, n) {
			let r = n.re.get_relative_proto_validator();
			r.lastIndex = t;
			let i = r.exec(e);
			return i ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : i[0].length : 0;
		},
		normalize: (e, t) => t.normalize(e)
	},
	"mailto:": {
		validate: function(e, t, n) {
			let r = n.re.get_mailto_validator();
			r.lastIndex = t;
			let i = r.exec(e);
			return i ? i[0].length : 0;
		},
		normalize: (e, t) => t.normalize(e)
	}
}, Jl = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", Yl = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function Xl() {
	let e = Yl.split("|");
	return Jl.split("|").forEach((t) => {
		let n = t.indexOf(":"), r = t.slice(0, n);
		for (let i of t.slice(n + 1)) e.push(r + i);
	}), e;
}
var Zl = {
	fuzzyLink: !1,
	fuzzyEmail: !0,
	fuzzyIP: !1,
	"---": !1,
	tlds: Xl(),
	urlAuth: !1,
	maxLength: 1e4
}, Ql = class {
	schema;
	index;
	lastIndex;
	raw;
	text;
	url;
	constructor(e, t, n, r) {
		let i = e.slice(n, r);
		this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = i, this.text = i, this.url = i;
	}
}, $l = class {
	__opts__;
	__schemas__;
	re;
	constructor(e = {}) {
		let { rebuilder: t, ...n } = e;
		this.__opts__ = {
			...Zl,
			...n
		}, this.__schemas__ = { ...ql }, this.re = t || new Gl(), this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		});
	}
	add(e, t = null) {
		if (!t) delete this.__schemas__[e];
		else {
			let n = {
				normalize: (e, t) => t.normalize(e),
				...t
			};
			this.__schemas__[e] = n;
		}
		return this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		}), this;
	}
	set(e = {}) {
		return this.__opts__ = {
			...this.__opts__,
			...e
		}, this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		}), this;
	}
	test(e) {
		if (!e.length) return !1;
		let t, n;
		for (n = this.re.get_schema_search(), n.lastIndex = 0; (t = n.exec(e)) !== null;) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
		if (this.__opts__.fuzzyLink && this.__schemas__["http:"] && (n = this.re.get_fuzzy_link_search(), n.lastIndex = 0, n.exec(e) !== null)) return !0;
		if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"] && e.indexOf("@") >= 0) {
			let n = this.re.get_fuzzy_mail_host_search(), r = this.re.get_mail_name_validator();
			for (n.lastIndex = 0; (t = n.exec(e)) !== null;) {
				let n = e.slice(Math.max(0, t.index - 65), t.index);
				if (r.test(n)) return !0;
			}
		}
		return !1;
	}
	testSchemaAt(e, t, n) {
		return this.__schemas__[t.toLowerCase()] ? this.__schemas__[t.toLowerCase()].validate(e.slice(0, n + this.__opts__.maxLength), n, this) : 0;
	}
	match(e) {
		let t = [], n = this.re.get_schema_search(), r, i, a, o, s, c, l = !1, u = !1, d = !1, f = 0;
		if (!e.length) return null;
		for (n.lastIndex = 0, this.__opts__.fuzzyLink && this.__schemas__["http:"] && (r = this.re.get_fuzzy_link_search(), r.lastIndex = 0), this.__opts__.fuzzyEmail && this.__schemas__["mailto:"] && (i = this.re.get_fuzzy_mail_host_search(), i.lastIndex = 0, a = this.re.get_mail_name_validator());;) {
			let p = Math.max(f - 1, 0);
			if (i && a && !d && (!s || s.index < f)) for (i.lastIndex < p && (i.lastIndex = p);;) {
				let t = i.exec(e);
				if (!t) {
					d = !0, s = void 0;
					break;
				}
				let n = a.exec(e.slice(Math.max(0, t.index - 65), t.index));
				if (n) {
					if (s = {
						schema: "mailto:",
						index: t.index - n[1].length,
						lastIndex: t.index + t[0].length
					}, s.index >= f) break;
					i.lastIndex < p && (i.lastIndex = p);
				}
			}
			if (r && !u && (!o || o.index < f)) for (r.lastIndex < p && (r.lastIndex = p);;) {
				let t = r.exec(e);
				if (!t) {
					u = !0, o = void 0;
					break;
				}
				if (o = {
					schema: "",
					index: t.index + t[1].length,
					lastIndex: t.index + t[0].length
				}, o.index >= f) break;
				r.lastIndex < p && (r.lastIndex = p);
			}
			let m = s;
			(!m || o && (o.index < m.index || o.index === m.index && o.lastIndex > m.lastIndex)) && (m = o);
			let h;
			if (!l) for (;;) {
				if (!c) {
					n.lastIndex < p && (n.lastIndex = p);
					let t = n.exec(e);
					if (!t) {
						l = !0;
						break;
					}
					c = {
						schema: t[2],
						index: t.index + t[1].length,
						lastIndex: t.index + t[0].length
					};
				}
				if (c.index < f) {
					c = void 0;
					continue;
				}
				if (m && c.index > m.index) break;
				let t = c;
				c = void 0;
				let r = this.testSchemaAt(e, t.schema, t.lastIndex);
				if (r) {
					h = {
						schema: t.schema,
						index: t.index,
						lastIndex: t.lastIndex + r
					};
					break;
				}
			}
			let g = h;
			if ((!g || s && (s.index < g.index || s.index === g.index && s.lastIndex > g.lastIndex)) && (g = s), (!g || o && (o.index < g.index || o.index === g.index && o.lastIndex > g.lastIndex)) && (g = o), !g) break;
			g === s ? s = void 0 : g === o && (o = void 0);
			let _ = new Ql(e, g.schema, g.index, g.lastIndex);
			_.schema ? this.__schemas__[_.schema].normalize(_, this) : this.normalize(_), t.push(_), f = g.lastIndex;
		}
		return t.length ? t : null;
	}
	matchAtStart(e) {
		if (!e.length) return null;
		let t = this.re.get_schema_at_start().exec(e);
		if (!t) return null;
		let n = this.testSchemaAt(e, t[2], t[0].length);
		if (!n) return null;
		let r = new Ql(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
		return this.__schemas__[r.schema].normalize(r, this), r;
	}
	tlds(e, t = !1) {
		return e = Array.isArray(e) ? e : [e], t ? this.__opts__.tlds = this.__opts__.tlds.concat(e) : this.__opts__.tlds = e, this.re.set({
			...this.__opts__,
			schema_names: Object.keys(this.__schemas__)
		}), this;
	}
	normalize(e) {
		e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
	}
}, eu = 2147483647, tu = 36, nu = 1, ru = 26, iu = 38, au = 700, ou = 72, su = 128, cu = "-", lu = /^xn--/, uu = /[^\0-\x7F]/, du = /[\x2E\u3002\uFF0E\uFF61]/g, fu = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, pu = 35, mu = Math.floor, hu = String.fromCharCode;
function gu(e) {
	throw RangeError(fu[e]);
}
function _u(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function vu(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(du, ".");
	let i = _u(e.split("."), t).join(".");
	return r + i;
}
function yu(e) {
	let t = [], n = 0, r = e.length;
	for (; n < r;) {
		let i = e.charCodeAt(n++);
		if (i >= 55296 && i <= 56319 && n < r) {
			let r = e.charCodeAt(n++);
			(r & 64512) == 56320 ? t.push(((i & 1023) << 10) + (r & 1023) + 65536) : (t.push(i), n--);
		} else t.push(i);
	}
	return t;
}
var bu = (e) => String.fromCodePoint(...e), xu = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : tu;
}, Su = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, Cu = function(e, t, n) {
	let r = 0;
	for (e = n ? mu(e / au) : e >> 1, e += mu(e / t); e > 455; r += tu) e = mu(e / pu);
	return mu(r + 36 * e / (e + iu));
}, wu = function(e) {
	let t = [], n = e.length, r = 0, i = su, a = ou, o = e.lastIndexOf(cu);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && gu("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = tu;; i += tu) {
			s >= n && gu("invalid-input");
			let o = xu(e.charCodeAt(s++));
			o >= tu && gu("invalid-input"), o > mu((eu - r) / t) && gu("overflow"), r += o * t;
			let c = i <= a ? nu : i >= a + ru ? ru : i - a;
			if (o < c) break;
			let l = tu - c;
			t > mu(eu / l) && gu("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = Cu(r - o, c, o == 0), mu(r / c) > eu - i && gu("overflow"), i += mu(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, Tu = function(e) {
	let t = [];
	e = yu(e);
	let n = e.length, r = su, i = 0, a = ou;
	for (let n of e) n < 128 && t.push(hu(n));
	let o = t.length, s = o;
	for (o && t.push(cu); s < n;) {
		let n = eu;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > mu((eu - i) / c) && gu("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > eu && gu("overflow"), n === r) {
			let e = i;
			for (let n = tu;; n += tu) {
				let r = n <= a ? nu : n >= a + ru ? ru : n - a;
				if (e < r) break;
				let i = e - r, o = tu - r;
				t.push(hu(Su(r + i % o, 0))), e = mu(i / o);
			}
			t.push(hu(Su(e, 0))), a = Cu(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, Eu = {
	version: "2.3.1",
	ucs2: {
		decode: yu,
		encode: bu
	},
	decode: wu,
	encode: Tu,
	toASCII: function(e) {
		return vu(e, function(e) {
			return uu.test(e) ? "xn--" + Tu(e) : e;
		});
	},
	toUnicode: function(e) {
		return vu(e, function(e) {
			return lu.test(e) ? wu(e.slice(4).toLowerCase()) : e;
		});
	}
}, Du = Object.defineProperty, Ou = (e, t) => {
	let n = {};
	for (var r in e) Du(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || Du(n, Symbol.toStringTag, { value: "Module" }), n;
}, ku = /* @__PURE__ */ Ou({
	arrayReplaceAt: () => ju,
	asciiTrim: () => ed,
	callable: () => Au,
	escapeHtml: () => Wu,
	escapeRE: () => Ku,
	fromCodePoint: () => Nu,
	isMdAsciiPunct: () => Zu,
	isPunctChar: () => Yu,
	isPunctCharCode: () => Xu,
	isSpace: () => qu,
	isValidEntityCode: () => Mu,
	isWhiteSpace: () => Ju,
	lib: () => td,
	normalizeReference: () => Qu,
	unescapeAll: () => zu,
	unescapeMd: () => Ru
});
function Au(e) {
	let t = function(...n) {
		return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
	};
	return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function ju(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function Mu(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function Nu(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var Pu = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, Fu = RegExp(`${Pu.source}|&([a-z#][a-z0-9]{1,31});`, "gi"), Iu = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Lu(e, t) {
	if (t.charCodeAt(0) === 35 && Iu.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return Mu(n) ? Nu(n) : e;
	}
	let n = Wl(e);
	return n === e ? e : n;
}
function Ru(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(Pu, "$1");
}
function zu(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(Fu, function(e, t, n) {
		return t || Lu(e, n);
	});
}
var Bu = /[&<>"]/, Vu = /[&<>"]/g, Hu = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Uu(e) {
	return Hu[e];
}
function Wu(e) {
	return Bu.test(e) ? e.replace(Vu, Uu) : e;
}
var Gu = /[.?*+^$[\]\\(){}|-]/g;
function Ku(e) {
	return e.replace(Gu, "\\$&");
}
function qu(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function Ju(e) {
	if (e >= 8192 && e <= 8202) return !0;
	switch (e) {
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 32:
		case 160:
		case 5760:
		case 8239:
		case 8287:
		case 12288: return !0;
	}
	return !1;
}
function Yu(e) {
	return gl.test(e) || _l.test(e);
}
function Xu(e) {
	return Yu(Nu(e));
}
function Zu(e) {
	switch (e) {
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
		case 45:
		case 46:
		case 47:
		case 58:
		case 59:
		case 60:
		case 61:
		case 62:
		case 63:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 124:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function Qu(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function $u(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function ed(e) {
	let t = 0;
	for (; t < e.length && $u(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && $u(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var td = {
	mdurl: dl,
	ucmicro: fl
};
function nd(e, t, n) {
	let r, i, a, o, s = e.posMax, c = e.pos;
	for (e.pos = t + 1, r = 1; e.pos < s;) {
		if (a = e.src.charCodeAt(e.pos), a === 93 && (r--, r === 0)) {
			i = !0;
			break;
		}
		if (o = e.pos, e.md.inline.skipToken(e), a === 91) {
			if (o === e.pos - 1) r++;
			else if (n) return e.pos = c, -1;
		}
	}
	let l = -1;
	return i && (l = e.pos), e.pos = c, l;
}
function rd(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = zu(e.slice(t + 1, i)), a.ok = !0, a;
			if (r === 92 && i + 1 < n) {
				i += 2;
				continue;
			}
			i++;
		}
		return a;
	}
	let o = 0;
	for (; i < n && (r = e.charCodeAt(i), !(r === 32 || r < 32 || r === 127));) {
		if (r === 92 && i + 1 < n) {
			if (e.charCodeAt(i + 1) === 32) {
				i++;
				continue;
			}
			i += 2;
			continue;
		}
		if (r === 40 && (o++, o > 32)) return a;
		if (r === 41) {
			if (o === 0) break;
			o--;
		}
		i++;
	}
	return t === i || o !== 0 ? a : (a.str = zu(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function id(e, t, n, r) {
	let i, a = t, o = {
		ok: !1,
		can_continue: !1,
		pos: 0,
		str: "",
		marker: 0
	};
	if (r) o.str = r.str, o.marker = r.marker;
	else {
		if (a >= n) return o;
		let r = e.charCodeAt(a);
		if (r !== 34 && r !== 39 && r !== 40) return o;
		t++, a++, r === 40 && (r = 41), o.marker = r;
	}
	for (; a < n;) {
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += zu(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += zu(e.slice(t, a)), o;
}
var ad = /* @__PURE__ */ Ou({
	parseLinkDestination: () => rd,
	parseLinkLabel: () => nd,
	parseLinkTitle: () => id
});
function od(e) {
	"@babel/helpers - typeof";
	return od = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, od(e);
}
function sd(e, t) {
	if (od(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (od(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function cd(e) {
	var t = sd(e, "string");
	return od(t) == "symbol" ? t : t + "";
}
function $(e, t, n) {
	return (t = cd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
var ld = class {
	constructor(e, t, n) {
		$(this, "map", null), $(this, "level", 0), $(this, "children", null), $(this, "content", ""), $(this, "markup", ""), $(this, "info", ""), $(this, "block", !1), $(this, "hidden", !1), this.type = e, this.tag = t, this.attrs = null, this.nesting = n, this.meta = null;
	}
	attrIndex(e) {
		if (!this.attrs) return -1;
		let t = this.attrs;
		for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
		return -1;
	}
	attrPush(e) {
		this.attrs ? this.attrs.push(e) : this.attrs = [e];
	}
	attrSet(e, t) {
		let n = this.attrIndex(e), r = [e, t];
		n < 0 ? this.attrPush(r) : this.attrs[n] = r;
	}
	attrGet(e) {
		let t = this.attrIndex(e), n = null;
		return t >= 0 && (n = this.attrs[t][1]), n;
	}
	attrJoin(e, t) {
		let n = this.attrIndex(e);
		n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = `${this.attrs[n][1]} ${t}`;
	}
}, ud = class {
	constructor() {
		$(this, "__rules__", []), $(this, "__cache__", null);
	}
	__find__(e) {
		for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
		return -1;
	}
	__compile__() {
		let e = /* @__PURE__ */ new Set();
		this.__rules__.forEach((t) => {
			t.enabled && t.alt.forEach((t) => {
				t && e.add(t);
			});
		}), this.__cache__ = Object.create(null), this.__cache__[""] = [], this.__rules__.forEach((e) => {
			e.enabled && this.__cache__[""].push(e.fn);
		}), e.forEach((e) => {
			this.__cache__[e] = [], this.__rules__.forEach((t) => {
				t.enabled && t.alt.indexOf(e) >= 0 && this.__cache__[e].push(t.fn);
			});
		});
	}
	at(e, t, n = {}) {
		let r = this.__find__(e);
		if (r === -1) throw Error(`Parser rule not found: ${e}`);
		this.__rules__[r].fn = t, this.__rules__[r].alt = n.alt || [], this.__cache__ = null;
	}
	before(e, t, n, r = {}) {
		let i = this.__find__(e);
		if (i === -1) throw Error(`Parser rule not found: ${e}`);
		this.__rules__.splice(i, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: r.alt || []
		}), this.__cache__ = null;
	}
	after(e, t, n, r = {}) {
		let i = this.__find__(e);
		if (i === -1) throw Error(`Parser rule not found: ${e}`);
		this.__rules__.splice(i + 1, 0, {
			name: t,
			enabled: !0,
			fn: n,
			alt: r.alt || []
		}), this.__cache__ = null;
	}
	push(e, t, n = {}) {
		this.__rules__.push({
			name: e,
			enabled: !0,
			fn: t,
			alt: n.alt || []
		}), this.__cache__ = null;
	}
	enable(e, t = !1) {
		Array.isArray(e) || (e = [e]);
		let n = [];
		return e.forEach((e) => {
			let r = this.__find__(e);
			if (r < 0) {
				if (t) return;
				throw Error(`Rules manager: invalid rule name ${e}`);
			}
			this.__rules__[r].enabled = !0, n.push(e);
		}), this.__cache__ = null, n;
	}
	enableOnly(e, t = !1) {
		Array.isArray(e) || (e = [e]), this.__rules__.forEach((e) => {
			e.enabled = !1;
		}), this.enable(e, t);
	}
	disable(e, t = !1) {
		Array.isArray(e) || (e = [e]);
		let n = [];
		return e.forEach((e) => {
			let r = this.__find__(e);
			if (r < 0) {
				if (t) return;
				throw Error(`Rules manager: invalid rule name ${e}`);
			}
			this.__rules__[r].enabled = !1, n.push(e);
		}), this.__cache__ = null, n;
	}
	getRules(e) {
		return this.__cache__ || this.__compile__(), this.__cache__[e] || [];
	}
}, dd = {};
dd.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return `<code${i.renderAttrs(a)}>${Wu(a.content)}</code>`;
}, dd.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return `<pre${i.renderAttrs(a)}><code>${Wu(e[t].content)}</code></pre>\n`;
}, dd.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? zu(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || Wu(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", `${n.langPrefix}${s}`]) : (t[e] = [t[e][0], t[e][1]], t[e][1] += ` ${n.langPrefix}${s}`);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, dd.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, dd.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, dd.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, dd.text = function(e, t) {
	return Wu(e[t].content);
}, dd.html_block = function(e, t) {
	return e[t].content;
}, dd.html_inline = function(e, t) {
	return e[t].content;
};
var fd = class {
	constructor() {
		$(this, "rules", Object.assign({}, dd));
	}
	renderAttrs(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${Wu(e.attrs[t][0])}="${Wu(String(e.attrs[t][1]))}"`;
		return r;
	}
	renderToken(e, t, n) {
		let r = e[t], i = "";
		if (r.hidden) return "";
		let a = t - 1;
		for (; a >= 0 && e[a].hidden && e[a].nesting === 0;) a--;
		r.block && r.nesting !== -1 && a >= 0 && e[a].hidden && e[a].nesting === -1 && (i += "\n"), i += (r.nesting === -1 ? "</" : "<") + r.tag, i += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (i += " /");
		let o = !1;
		if (r.block && (o = !0, r.nesting === 1)) {
			let n = t + 1;
			for (; n < e.length && e[n].hidden && e[n].nesting === 0;) n++;
			if (n < e.length) {
				let t = e[n];
				(t.type === "inline" || t.hidden || t.nesting === -1 && t.tag === r.tag) && (o = !1);
			}
		}
		return i += o ? ">\n" : ">", i;
	}
	renderInline(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
		}
		return r;
	}
	renderInlineAsText(e, t, n) {
		let r = "";
		for (let i = 0, a = e.length; i < a; i++) switch (e[i].type) {
			case "text":
			case "code_inline":
				r += e[i].content;
				break;
			case "image":
				r += this.renderInlineAsText(e[i].children, t, n);
				break;
			case "html_inline":
			case "html_block":
				r += e[i].content;
				break;
			case "softbreak":
			case "hardbreak": r += "\n";
		}
		return r;
	}
	render(e, t, n) {
		let r = "", i = this.rules;
		for (let a = 0, o = e.length; a < o; a++) {
			let o = e[a].type;
			o === "inline" ? r += this.renderInline(e[a].children, t, n) : i[o] === void 0 ? r += this.renderToken(e, a, t) : r += i[o](e, a, t, n, this);
		}
		return r;
	}
}, pd = class {
	constructor(e, t, n) {
		$(this, "tokens", []), $(this, "inlineMode", !1), $(this, "Token", ld), this.src = e, this.env = n, this.md = t;
	}
}, md = /\r\n?/g, hd = /\0/g;
function gd(e) {
	let t;
	t = e.src.replace(md, "\n"), t = t.replace(hd, "�"), e.src = t;
}
function _d(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function vd(e) {
	let t = e.tokens, n = 0;
	for (let e = 0; e < t.length; e++) t[e].type !== "reference_definition" && (e !== n && (t[n] = t[e]), n++);
	t.length !== n && (t.length = n);
}
function yd(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function bd(e) {
	return /^<a[>\s]/i.test(e);
}
function xd(e) {
	return /^<\/a\s*>/i.test(e);
}
function Sd(e) {
	let t = e.tokens;
	if (e.md.options.linkify) for (let n = 0, r = t.length; n < r; n++) {
		if (t[n].type !== "inline" || !e.md.linkify.test(t[n].content)) continue;
		let r = t[n].children, i = [], a = 0;
		for (let t = r.length - 1; t >= 0; t--) {
			let n = r[t];
			if (n.type === "link_close") {
				for (t--; r[t].level !== n.level && r[t].type !== "link_open";) t--;
				continue;
			}
			if (n.type === "html_inline" && (bd(n.content) && a > 0 && a--, xd(n.content) && a++), !(a > 0) && n.type === "text" && e.md.linkify.test(n.content)) {
				let a = n.content, o = e.md.linkify.match(a), s = [], c = n.level, l = 0;
				o.length > 0 && o[0].index === 0 && t > 0 && r[t - 1].type === "text_special" && (o = o.slice(1));
				for (let t = 0; t < o.length; t++) {
					let n = o[t].url, r = e.md.normalizeLink(n);
					if (!e.md.validateLink(r)) continue;
					let i = o[t].text;
					i = o[t].schema ? o[t].schema === "mailto:" && !/^mailto:/i.test(i) ? e.md.normalizeLinkText(`mailto:${i}`).replace(/^mailto:/, "") : e.md.normalizeLinkText(i) : e.md.normalizeLinkText(`http://${i}`).replace(/^http:\/\//, "");
					let u = o[t].index;
					if (u > l) {
						let t = new e.Token("text", "", 0);
						t.content = a.slice(l, u), t.level = c, s.push(t);
					}
					let d = new e.Token("link_open", "a", 1);
					d.attrs = [["href", r]], d.level = c++, d.markup = "linkify", d.info = "auto", s.push(d);
					let f = new e.Token("text", "", 0);
					f.content = i, f.level = c, s.push(f);
					let p = new e.Token("link_close", "a", -1);
					p.level = --c, p.markup = "linkify", p.info = "auto", s.push(p), l = o[t].lastIndex;
				}
				if (l < a.length) {
					let t = new e.Token("text", "", 0);
					t.content = a.slice(l), t.level = c, s.push(t);
				}
				i.push({
					index: t,
					nodes: s
				});
			}
		}
		if (i.length > 0) {
			let e = r.length;
			for (let t of i) e += t.nodes.length - 1;
			let a = Array(e), o = 0, s = 0;
			i.reverse();
			for (let e = 0; e < r.length; e++) {
				let t = i[o];
				if (t?.index === e) {
					for (let e of t.nodes) a[s++] = e;
					o++;
				} else a[s++] = r[e];
			}
			t[n].children = a;
		}
	}
}
var Cd = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, wd = /\((c|tm|r)\)/i, Td = /\((c|tm|r)\)/gi, Ed = {
	c: "©",
	r: "®",
	tm: "™"
};
function Dd(e, t) {
	return Ed[t.toLowerCase()];
}
function Od(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(Td, Dd)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function kd(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && Cd.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function Ad(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (wd.test(e.tokens[t].content) && Od(e.tokens[t].children), Cd.test(e.tokens[t].content) && kd(e.tokens[t].children));
}
var jd = /['"]/, Md = /['"]/g, Nd = "’", Pd = 1e3;
function Fd(e, t, n) {
	for (; e.length > n;) {
		let n = e.pop();
		n.isSingleQuote ? t.single = n.prevSameQuoteIdx : t.double = n.prevSameQuoteIdx;
	}
}
function Id(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function Ld(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function Rd(e, t) {
	let n, r = [], i = {
		single: -1,
		double: -1
	}, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = e[o].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= c); n--);
		if (Fd(r, i, n + 1), s.type !== "text") continue;
		let l = s.content, u = 0, d = l.length;
		OUTER: for (; u < d;) {
			Md.lastIndex = u;
			let s = Md.exec(l);
			if (!s) break;
			let f = !0, p = !0;
			u = s.index + 1;
			let m = s[0] === "'", h = 32;
			if (s.index - 1 >= 0) h = l.charCodeAt(s.index - 1);
			else for (n = o - 1; n >= 0 && e[n].type !== "softbreak" && e[n].type !== "hardbreak"; n--) if (e[n].content) {
				h = e[n].content.charCodeAt(e[n].content.length - 1);
				break;
			}
			let g = 32;
			if (u < d) g = l.charCodeAt(u);
			else for (n = o + 1; n < e.length && e[n].type !== "softbreak" && e[n].type !== "hardbreak"; n++) if (e[n].content) {
				g = e[n].content.charCodeAt(0);
				break;
			}
			let _ = Zu(h) || Xu(h), v = Zu(g) || Xu(g), y = Ju(h), b = Ju(g);
			if (b ? f = !1 : v && (y || _ || (f = !1)), y ? p = !1 : _ && (b || v || (p = !1)), g === 34 && s[0] === "\"" && h >= 48 && h <= 57 && (p = f = !1), f && p && (f = _, p = v), !f && !p) {
				m && Id(a, o, s.index, Nd);
				continue;
			}
			if (p && (n = m ? i.single : i.double, n >= 0 && r[n].level === c)) {
				let e = r[n], c, l;
				m ? (c = t.md.options.quotes[2], l = t.md.options.quotes[3]) : (c = t.md.options.quotes[0], l = t.md.options.quotes[1]), Id(a, o, s.index, l), Id(a, e.tokenIdx, e.contentPos, c), Fd(r, i, n);
				continue OUTER;
			}
			if (f) {
				if (r.length >= Pd) return;
				r.push({
					tokenIdx: o,
					contentPos: s.index,
					isSingleQuote: m,
					level: c,
					prevSameQuoteIdx: m ? i.single : i.double
				}), m ? i.single = r.length - 1 : i.double = r.length - 1;
			} else p && m && Id(a, o, s.index, Nd);
		}
	}
	Object.keys(a).forEach(function(t) {
		let n = Number(t);
		e[n].content = Ld(e[n].content, a[t]);
	});
}
function zd(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && jd.test(e.tokens[t].content) && Rd(e.tokens[t].children, e);
}
function Bd(e) {
	let t, n, r = e.length;
	for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
	for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
	t !== n && (e.length = n);
}
function Vd(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text"), i[t].children && Bd(i[t].children);
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var Hd = [
	["normalize", gd],
	["block", _d],
	["strip_references", vd],
	["inline", yd],
	["linkify", Sd],
	["replacements", Ad],
	["smartquotes", zd],
	["text_join", Vd]
], Ud = class {
	constructor() {
		$(this, "ruler", new ud()), $(this, "State", pd);
		for (let e = 0; e < Hd.length; e++) this.ruler.push(Hd[e][0], Hd[e][1]);
	}
	process(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}
}, Wd = class {
	constructor(e, t, n, r) {
		$(this, "bMarks", []), $(this, "eMarks", []), $(this, "tShift", []), $(this, "sCount", []), $(this, "bsCount", []), $(this, "blkIndent", 0), $(this, "line", 0), $(this, "lineMax", 0), $(this, "tight", !1), $(this, "listIndent", -1), $(this, "parentType", "root"), $(this, "level", 0), $(this, "Token", ld), this.src = e, this.md = t, this.env = n, this.tokens = r;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) {
				if (qu(s)) {
					n++, s === 9 ? r += 4 - r % 4 : r++;
					continue;
				}
				o = !0;
			}
			(s === 10 || t === a - 1) && (s !== 10 && t++, this.bMarks.push(e), this.eMarks.push(t), this.tShift.push(n), this.sCount.push(r), this.bsCount.push(0), o = !1, n = 0, r = 0, e = t + 1);
		}
		this.bMarks.push(i.length), this.eMarks.push(i.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
	}
	push(e, t, n) {
		let r = new ld(e, t, n);
		return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
	}
	isEmpty(e) {
		return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
	}
	skipEmptyLines(e) {
		for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
		return e;
	}
	skipSpaces(e) {
		for (let t = this.src.length; e < t && qu(this.src.charCodeAt(e)); e++);
		return e;
	}
	skipSpacesBack(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!qu(this.src.charCodeAt(--e))) return e + 1;
		return e;
	}
	skipChars(e, t) {
		for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
		return e;
	}
	skipCharsBack(e, t, n) {
		if (e <= n) return e;
		for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
		return e;
	}
	getLines(e, t, n, r) {
		if (e >= t) return "";
		let i = Array(t - e);
		for (let a = 0, o = e; o < t; o++, a++) {
			let e = 0, s = this.bMarks[o], c = s, l;
			for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
				let t = this.src.charCodeAt(c);
				if (qu(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}
}, Gd = 65536;
function Kd(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function qd(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Jd(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !qu(s) || o === 45 && qu(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !qu(t)) return !1;
		a++;
	}
	let c = Kd(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = Kd(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = qd(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
	let d = l.length;
	if (d === 0 || d !== u.length) return !1;
	if (r) return !0;
	let f = e.parentType;
	e.parentType = "table";
	let p = e.md.block.ruler.getRules("blockquote"), m = e.push("table_open", "table", 1), h = [t, 0];
	m.map = h;
	let g = e.push("thead_open", "thead", 1);
	g.map = [t, t + 1];
	let _ = e.push("tr_open", "tr", 1);
	_.map = [t, t + 1];
	for (let t = 0; t < l.length; t++) {
		let n = e.push("th_open", "th", 1);
		u[t] && (n.attrs = [["style", `text-align:${u[t]}`]]);
		let r = e.push("inline", "", 0);
		r.content = l[t].trim(), r.children = [], e.push("th_close", "th", -1);
	}
	e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
	let v, y = 0;
	for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
		let r = !1;
		for (let t = 0, a = p.length; t < a; t++) if (p[t](e, i, n, !0)) {
			r = !0;
			break;
		}
		if (r || (c = Kd(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = qd(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > Gd)) break;
		if (i === t + 2) {
			let n = e.push("tbody_open", "tbody", 1);
			n.map = v = [t + 2, 0];
		}
		let a = e.push("tr_open", "tr", 1);
		a.map = [i, i + 1];
		for (let t = 0; t < d; t++) {
			let n = e.push("td_open", "td", 1);
			u[t] && (n.attrs = [["style", `text-align:${u[t]}`]]);
			let r = e.push("inline", "", 0);
			r.content = l[t] ? l[t].trim() : "", r.children = [], e.push("td_close", "td", -1);
		}
		e.push("tr_close", "tr", -1);
	}
	return v && (e.push("tbody_close", "tbody", -1), v[1] = i), e.push("table_close", "table", -1), h[1] = i, e.parentType = f, e.line = i, !0;
}
function Yd(e, t, n) {
	if (e.sCount[t] - e.blkIndent < 4) return !1;
	let r = t + 1, i = r;
	for (; r < n;) {
		if (e.isEmpty(r)) {
			r++;
			continue;
		}
		if (e.sCount[r] - e.blkIndent >= 4) {
			r++, i = r;
			continue;
		}
		break;
	}
	e.line = i;
	let a = e.push("code_block", "code", 0);
	return a.content = e.getLines(t, i, 4 + e.blkIndent, !1) + "\n", a.map = [t, e.line], !0;
}
function Xd(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 126 && o !== 96) return !1;
	let s = i;
	i = e.skipChars(i, o);
	let c = i - s;
	if (c < 3) return !1;
	let l = e.src.slice(s, i), u = e.src.slice(i, a);
	if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
	if (r) return !0;
	let d = t, f = !1;
	for (; d++, !(d >= n || (i = s = e.bMarks[d] + e.tShift[d], a = e.eMarks[d], i < a && e.sCount[d] < e.blkIndent));) if (e.src.charCodeAt(i) === o && !(e.sCount[d] - e.blkIndent >= 4) && (i = e.skipChars(i, o), !(i - s < c) && (i = e.skipSpaces(i), !(i < a)))) {
		f = !0;
		break;
	}
	c = e.sCount[t], e.line = d + +!!f;
	let p = e.push("fence", "code", 0);
	return p.info = u, p.content = e.getLines(t + 1, d, c, !0), p.markup = l, p.map = [t, e.line], !0;
}
function Zd(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = e.lineMax;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
	if (r) return !0;
	let s = [], c = [], l = [], u = [], d = e.md.block.ruler.getRules("blockquote"), f = e.parentType;
	e.parentType = "blockquote";
	let p = !1, m;
	for (m = t; m < n; m++) {
		let t = e.sCount[m] < e.blkIndent;
		if (i = e.bMarks[m] + e.tShift[m], a = e.eMarks[m], i >= a) break;
		if (e.src.charCodeAt(i++) === 62 && !t) {
			let t = e.sCount[m] + 1, n, r;
			e.src.charCodeAt(i) === 32 ? (i++, t++, r = !1, n = !0) : e.src.charCodeAt(i) === 9 ? (n = !0, (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, r = !1) : r = !0) : n = !1;
			let o = t;
			for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
				let t = e.src.charCodeAt(i);
				if (qu(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
				else break;
				i++;
			}
			p = i >= a, c.push(e.bsCount[m]), e.bsCount[m] = e.sCount[m] + 1 + +!!n, l.push(e.sCount[m]), e.sCount[m] = o - t, u.push(e.tShift[m]), e.tShift[m] = i - e.bMarks[m];
			continue;
		}
		if (p) break;
		let r = !1;
		for (let t = 0, i = d.length; t < i; t++) if (d[t](e, m, n, !0)) {
			r = !0;
			break;
		}
		if (r) {
			e.lineMax = m, e.blkIndent !== 0 && (s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] -= e.blkIndent);
			break;
		}
		s.push(e.bMarks[m]), c.push(e.bsCount[m]), u.push(e.tShift[m]), l.push(e.sCount[m]), e.sCount[m] = -1;
	}
	let h = e.blkIndent;
	e.blkIndent = 0;
	let g = e.push("blockquote_open", "blockquote", 1);
	g.markup = ">";
	let _ = [t, 0];
	g.map = _, e.md.block.tokenize(e, t, m);
	let v = e.push("blockquote_close", "blockquote", -1);
	v.markup = ">", e.lineMax = o, e.parentType = f, _[1] = e.line;
	for (let n = 0; n < u.length; n++) e.bMarks[n + t] = s[n], e.tShift[n + t] = u[n], e.sCount[n + t] = l[n], e.bsCount[n + t] = c[n];
	return e.blkIndent = h, !0;
}
function Qd(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !qu(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function $d(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !qu(e.src.charCodeAt(r)) ? -1 : r;
}
function ef(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t], i = n;
	if (i + 1 >= r) return -1;
	let a = e.src.charCodeAt(i++);
	if (a < 48 || a > 57) return -1;
	for (;;) {
		if (i >= r) return -1;
		if (a = e.src.charCodeAt(i++), a >= 48 && a <= 57) {
			if (i - n >= 10) return -1;
			continue;
		}
		if (a === 41 || a === 46) break;
		return -1;
	}
	return i < r && (a = e.src.charCodeAt(i), !qu(a)) ? -1 : i;
}
function tf(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function nf(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = ef(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = $d(e, c)) >= 0) d = !1;
	else return !1;
	if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
	if (r) return !0;
	let m = e.src.charCodeAt(p - 1), h = e.tokens.length;
	d ? (s = e.push("ordered_list_open", "ol", 1), f !== 1 && (s.attrs = [["start", f]])) : s = e.push("bullet_list_open", "ul", 1);
	let g = [c, 0];
	s.map = g, s.markup = String.fromCharCode(m);
	let _ = !1, v = e.md.block.ruler.getRules("list"), y = e.parentType;
	for (e.parentType = "list"; c < n;) {
		a = p, i = e.eMarks[c];
		let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]), r = t;
		for (; a < i;) {
			let t = e.src.charCodeAt(a);
			if (t === 9) r += 4 - (r + e.bsCount[c]) % 4;
			else if (t === 32) r++;
			else break;
			a++;
		}
		let u = a, f;
		f = u >= i ? 1 : r - t, f > 4 && (f = 1);
		let h = t + f;
		s = e.push("list_item_open", "li", 1), s.markup = String.fromCharCode(m);
		let g = [c, 0];
		s.map = g, d && (s.info = e.src.slice(o, p - 1));
		let y = e.tight, b = e.tShift[c], x = e.sCount[c], S = e.listIndent;
		if (e.listIndent = e.blkIndent, e.blkIndent = h, e.tight = !0, e.tShift[c] = u - e.bMarks[c], e.sCount[c] = r, u >= i && e.isEmpty(c + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, c, n), (!e.tight || _) && (l = !1), _ = e.line - c > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[c] = b, e.sCount[c] = x, e.tight = y, s = e.push("list_item_close", "li", -1), s.markup = String.fromCharCode(m), c = e.line, g[1] = c, c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4) break;
		let C = !1;
		for (let t = 0, r = v.length; t < r; t++) if (v[t](e, c, n, !0)) {
			C = !0;
			break;
		}
		if (C) break;
		if (d) {
			if (p = ef(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = $d(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && tf(e, h), !0;
}
function rf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t], o = t + 1;
	if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
	function s(t) {
		let n = e.lineMax;
		if (t >= n || e.isEmpty(t)) return null;
		let r = !1;
		if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
			let r = e.md.block.ruler.getRules("reference"), i = e.parentType;
			e.parentType = "reference";
			let a = !1;
			for (let i = 0, o = r.length; i < o; i++) if (r[i](e, t, n, !0)) {
				a = !0;
				break;
			}
			if (e.parentType = i, a) return null;
		}
		let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
		return e.src.slice(i, a + 1);
	}
	let c = e.src.slice(i, a + 1);
	a = c.length;
	let l = -1;
	for (i = 1; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 91) return !1;
		if (e === 93) {
			l = i;
			break;
		}
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		}
	}
	if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
	for (i = l + 2; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!qu(e)) break;
	}
	let u = e.md.helpers.parseLinkDestination(c, i, a);
	if (!u.ok) return !1;
	let d = e.md.normalizeLink(u.str);
	if (!e.md.validateLink(d)) return !1;
	i = u.pos;
	let f = i, p = o, m = i;
	for (; i < a; i++) {
		let e = c.charCodeAt(i);
		if (e === 10) {
			let e = s(o);
			e !== null && (c += e, a = c.length, o++);
		} else if (!qu(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && qu(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && qu(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Qu(c.slice(1, l));
	if (!_) return !1;
	/* istanbul ignore if */
	if (r) return !0;
	e.env.references === void 0 && (e.env.references = {}), e.env.references[_] === void 0 && (e.env.references[_] = {
		title: g,
		href: d
	});
	let v = e.push("reference_definition", "", 0);
	v.map = [t, o], v.hidden = !0;
	let y = Object.create(null);
	return y.label = _, v.meta = y, e.line = o, !0;
}
var af = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), of = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", sf = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", cf = RegExp(`^(?:${of}|${sf}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`), lf = RegExp(`^(?:${of}|${sf})`), uf = [
	[
		/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
		/<\/(script|pre|style|textarea)>/i,
		!0
	],
	[
		/^<!--/,
		/-->/,
		!0
	],
	[
		/^<\?/,
		/\?>/,
		!0
	],
	[
		/^<![A-Za-z]/,
		/>/,
		!0
	],
	[
		/^<!\[CDATA\[/,
		/\]\]>/,
		!0
	],
	[
		RegExp(`^</?(${af.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		!0
	],
	[
		RegExp(`${lf.source}\\s*$`),
		/^$/,
		!1
	]
];
function df(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < uf.length && !uf[s][0].test(o); s++);
	if (s === uf.length) return !1;
	if (r) return uf[s][2];
	let c = t + 1, l = uf[s][1].test("");
	if (!uf[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), uf[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function ff(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !qu(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && qu(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", `h${s}`, 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = ed(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", `h${s}`, -1);
	return d.markup = "########".slice(0, s), !0;
}
function pf(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph");
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let i = e.parentType;
	e.parentType = "paragraph";
	let a = 0, o, s = t + 1;
	for (; s < n && !e.isEmpty(s); s++) {
		if (e.sCount[s] - e.blkIndent > 3) continue;
		if (e.sCount[s] >= e.blkIndent) {
			let t = e.bMarks[s] + e.tShift[s], n = e.eMarks[s];
			if (t < n && (o = e.src.charCodeAt(t), (o === 45 || o === 61) && (t = e.skipChars(t, o), t = e.skipSpaces(t), t >= n))) {
				a = o === 61 ? 1 : 2;
				break;
			}
		}
		if (e.sCount[s] < 0) continue;
		let t = !1;
		for (let i = 0, a = r.length; i < a; i++) if (r[i](e, s, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	if (!a) return e.parentType = i, !1;
	let c = ed(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", `h${a}`, 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", `h${a}`, -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function mf(e, t, n) {
	let r = e.md.block.ruler.getRules("paragraph"), i = e.parentType, a = t + 1;
	for (e.parentType = "paragraph"; a < n && !e.isEmpty(a); a++) {
		if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
		let t = !1;
		for (let i = 0, o = r.length; i < o; i++) if (r[i](e, a, n, !0)) {
			t = !0;
			break;
		}
		if (t) break;
	}
	let o = ed(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var hf = [
	[
		"table",
		Jd,
		["paragraph", "reference"]
	],
	["code", Yd],
	[
		"fence",
		Xd,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		Zd,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		Qd,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		nf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", rf],
	[
		"html_block",
		df,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		ff,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", pf],
	["paragraph", mf]
], gf = class {
	constructor() {
		$(this, "ruler", new ud()), $(this, "State", Wd);
		for (let e = 0; e < hf.length; e++) this.ruler.push(hf[e][0], hf[e][1], { alt: (hf[e][2] || []).slice() });
	}
	tokenize(e, t, n) {
		let r = this.ruler.getRules(""), i = r.length, a = e.md.options.maxNesting, o = t, s = !1;
		for (; o < n && (e.line = o = e.skipEmptyLines(o), !(o >= n || e.sCount[o] < e.blkIndent));) {
			if (e.level >= a) {
				e.line = n;
				break;
			}
			let t = e.line, c = !1;
			for (let a = 0; a < i; a++) if (c = r[a](e, o, n, !1), c) {
				if (t >= e.line) throw Error("block rule didn't increment state.line");
				break;
			}
			if (!c) throw Error("none of the block rules matched");
			e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), o = e.line, o < n && e.isEmpty(o) && (s = !0, o++, e.line = o);
		}
	}
	parse(e, t, n, r) {
		if (!e) return;
		let i = new this.State(e, t, n, r);
		this.tokenize(i, i.line, i.lineMax);
	}
}, _f = class {
	constructor(e, t, n, r) {
		$(this, "pos", 0), $(this, "level", 0), $(this, "pending", ""), $(this, "pendingLevel", 0), $(this, "cache", {}), $(this, "backticks", {}), $(this, "backticksScanned", !1), $(this, "linkLevel", 0), $(this, "delimiters", []), $(this, "_prev_delimiters", []), $(this, "Token", ld), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
	}
	pushPending() {
		let e = new ld("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}
	push(e, t, n) {
		this.pending && this.pushPending();
		let r = new ld(e, t, n), i;
		return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], i = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(i), r;
	}
	scanDelims(e, t) {
		let n = this.posMax, r = this.src.charCodeAt(e), i;
		if (e === 0) i = 32;
		else if (e === 1) i = this.src.charCodeAt(0), (i & 63488) == 55296 && (i = 65533);
		else if (i = this.src.charCodeAt(e - 1), (i & 64512) == 56320) {
			let t = this.src.charCodeAt(e - 2);
			i = (t & 64512) == 55296 ? 65536 + (t - 55296 << 10) + (i - 56320) : 65533;
		} else (i & 64512) == 55296 && (i = 65533);
		let a = e;
		for (; a < n && this.src.charCodeAt(a) === r;) a++;
		let o = a - e, s = a < n ? this.src.charCodeAt(a) : 32;
		if ((s & 64512) == 55296) {
			let e = this.src.charCodeAt(a + 1);
			s = (e & 64512) == 56320 ? 65536 + (s - 55296 << 10) + (e - 56320) : 65533;
		} else (s & 64512) == 56320 && (s = 65533);
		let c = Zu(i) || Xu(i), l = Zu(s) || Xu(s), u = Ju(i), d = Ju(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}
};
function vf(e) {
	switch (e) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126: return !0;
		default: return !1;
	}
}
function yf(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !vf(e.src.charCodeAt(n));) n++;
	return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function bf(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function xf(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function Sf(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = n - Math.min(10, e.pending.length, n), a = n;
	for (; a > i && xf(e.src.charCodeAt(a - 1));) a--;
	if (a === n || !bf(e.src.charCodeAt(a))) return !1;
	let o = n - a, s = e.md.linkify.matchAtStart(e.src.slice(a));
	if (!s) return !1;
	let c = s.url;
	if (c.length <= o) return !1;
	let l = c.length;
	for (; l > 0 && c.charCodeAt(l - 1) === 42;) l--;
	l !== c.length && (c = c.slice(0, l));
	let u = e.md.normalizeLink(c);
	if (!e.md.validateLink(u)) return !1;
	if (!t) {
		e.pending = e.pending.slice(0, -o);
		let t = e.push("link_open", "a", 1);
		t.attrs = [["href", u]], t.markup = "linkify", t.info = "auto";
		let n = e.push("text", "", 0);
		n.content = e.md.normalizeLinkText(c);
		let r = e.push("link_close", "a", -1);
		r.markup = "linkify", r.info = "auto";
	}
	return e.pos += c.length - o, !0;
}
function Cf(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 10) return !1;
	let r = e.pending.length - 1, i = e.posMax;
	if (!t) {
		if (r >= 0 && e.pending.charCodeAt(r) === 32) {
			if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
				let t = r - 1;
				for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
				e.pending = e.pending.slice(0, t), e.push("hardbreak", "br", 0);
			} else e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
		} else e.push("softbreak", "br", 0);
	}
	for (n++; n < i && qu(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var wf = [];
for (let e = 0; e < 256; e++) wf.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	wf[e.charCodeAt(0)] = 1;
});
function Tf(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), qu(i));) n++;
		return e.pos = n, !0;
	}
	if (i === 32) {
		if (!t) {
			let t = e.push("text_special", "", 0);
			t.content = "\\", t.markup = "\\", t.info = "escape";
		}
		return e.pos = n, !0;
	}
	let a = e.src[n];
	if (i >= 55296 && i <= 56319 && n + 1 < r) {
		let t = e.src.charCodeAt(n + 1);
		t >= 56320 && t <= 57343 && (a += e.src[n + 1], n++);
	}
	let o = "\\" + a;
	if (!t) {
		let t = e.push("text_special", "", 0);
		t.content = i < 256 && wf[i] !== 0 ? a : o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function Ef(e) {
	let t = {}, n = 0;
	for (; (n = e.indexOf("`", n)) !== -1;) {
		let r = n;
		for (; e.charCodeAt(++n) === 96;);
		t[n - r] = r;
	}
	return t;
}
function Df(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = e.posMax, i = n + 1;
	for (; i < r && e.src.charCodeAt(i) === 96;) i++;
	let a = e.src.slice(n, i), o = a.length;
	if (e.backticksScanned ||= (e.backticks = Ef(e.src), !0), (e.backticks[o] ?? -1) >= i) {
		let n = i, s;
		for (; (s = e.src.indexOf("`", n)) !== -1 && s < r;) {
			for (n = s + 1; e.src.charCodeAt(n) === 96;) n++;
			if (n > r) break;
			if (n - s === o) {
				if (!t) {
					let t = e.push("code_inline", "code", 0);
					t.markup = a;
					let n = e.src.slice(i, s).replace(/\n/g, " ");
					n.startsWith(" ") && n.endsWith(" ") && /[^ ]/.test(n) && (n = n.slice(1, -1)), t.content = n;
				}
				return e.pos = n, !0;
			}
		}
	}
	return t || (e.pending += a), e.pos = i, !0;
}
function Of(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 126) return !1;
	let i = e.scanDelims(e.pos, !0), a = i.length, o = String.fromCharCode(r);
	if (a < 2) return !1;
	let s;
	a % 2 && (s = e.push("text", "", 0), s.content = o, a--);
	for (let t = 0; t < a; t += 2) s = e.push("text", "", 0), s.content = o + o, e.delimiters.push({
		marker: r,
		length: 0,
		token: e.tokens.length - 1,
		end: -1,
		open: i.can_open,
		close: i.can_close
	});
	return e.pos += i.length, !0;
}
function kf(e, t) {
	let n, r = [], i = t.length;
	for (let a = 0; a < i; a++) {
		let i = t[a];
		if (i.marker !== 126 || i.end === -1) continue;
		let o = t[i.end];
		n = e.tokens[i.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[o.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[o.token - 1].type === "text" && e.tokens[o.token - 1].content === "~" && r.push(o.token - 1);
	}
	for (; r.length;) {
		let t = r.pop(), i = t + 1;
		for (; i < e.tokens.length && e.tokens[i].type === "s_close";) i++;
		i--, t !== i && (n = e.tokens[i], e.tokens[i] = e.tokens[t], e.tokens[t] = n);
	}
}
function Af(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	kf(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && kf(e, n);
	}
}
var jf = {
	tokenize: Of,
	postProcess: Af
};
function Mf(e, t) {
	let n = e.pos, r = e.src.charCodeAt(n);
	if (t || r !== 95 && r !== 42) return !1;
	let i = e.scanDelims(e.pos, r === 42);
	for (let t = 0; t < i.length; t++) {
		let t = e.push("text", "", 0);
		t.content = String.fromCharCode(r), e.delimiters.push({
			marker: r,
			length: i.length,
			token: e.tokens.length - 1,
			end: -1,
			open: i.can_open,
			close: i.can_close
		});
	}
	return e.pos += i.length, !0;
}
function Nf(e, t) {
	let n = t.length;
	for (let r = n - 1; r >= 0; r--) {
		let n = t[r];
		if (n.marker !== 95 && n.marker !== 42 || n.end === -1) continue;
		let i = t[n.end], a = r > 0 && t[r - 1].end === n.end + 1 && t[r - 1].marker === n.marker && t[r - 1].token === n.token - 1 && t[n.end + 1].token === i.token + 1, o = String.fromCharCode(n.marker), s = e.tokens[n.token];
		s.type = a ? "strong_open" : "em_open", s.tag = a ? "strong" : "em", s.nesting = 1, s.markup = a ? o + o : o, s.content = "";
		let c = e.tokens[i.token];
		c.type = a ? "strong_close" : "em_close", c.tag = a ? "strong" : "em", c.nesting = -1, c.markup = a ? o + o : o, c.content = "", a && (e.tokens[t[r - 1].token].content = "", e.tokens[t[n.end + 1].token].content = "", r--);
	}
}
function Pf(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Nf(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && Nf(e, n);
	}
}
var Ff = {
	tokenize: Mf,
	postProcess: Pf
};
function If(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), qu(n) || n === 10); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), qu(n) || n === 10); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), qu(n) || n === 10); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), r = Qu(r), a = e.env.references[r], !a) return e.pos = u, !1;
		o = a.href, s = a.title;
	}
	if (!t) {
		e.pos = f, e.posMax = p;
		let t = e.push("link_open", "a", 1), n = [["href", o]];
		if (t.attrs = n, s && n.push(["title", s]), r) {
			let e = Object.create(null);
			e.label = r, t.meta = e;
		}
		e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
	}
	return e.pos = m, e.posMax = d, !0;
}
function Lf(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), qu(n) || n === 10); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), qu(n) || n === 10); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), qu(n) || n === 10); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), i = Qu(i), o = e.env.references[i], !o) return e.pos = d, !1;
		u = o.href, c = o.title;
	}
	if (!t) {
		r = e.src.slice(p, m);
		let t = [];
		e.md.inline.parse(r, e.md, e.env, t);
		let n = e.push("image", "img", 0), a = [["src", u], ["alt", ""]];
		if (n.attrs = a, n.children = t, n.content = r, c && a.push(["title", c]), i) {
			let e = Object.create(null);
			e.label = i, n.meta = e;
		}
	}
	return e.pos = a, e.posMax = f, !0;
}
var Rf = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, zf = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Bf(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 60) return !1;
	let r = e.pos, i = e.posMax;
	for (;;) {
		if (++n >= i) return !1;
		let t = e.src.charCodeAt(n);
		if (t === 60) return !1;
		if (t === 62) break;
	}
	let a = e.src.slice(r + 1, n);
	if (zf.test(a)) {
		let n = e.md.normalizeLink(a);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	if (Rf.test(a)) {
		let n = e.md.normalizeLink(`mailto:${a}`);
		if (!e.md.validateLink(n)) return !1;
		if (!t) {
			let t = e.push("link_open", "a", 1);
			t.attrs = [["href", n]], t.markup = "autolink", t.info = "auto";
			let r = e.push("text", "", 0);
			r.content = e.md.normalizeLinkText(a);
			let i = e.push("link_close", "a", -1);
			i.markup = "autolink", i.info = "auto";
		}
		return e.pos += a.length + 2, !0;
	}
	return !1;
}
function Vf(e) {
	return /^<a[>\s]/i.test(e);
}
function Hf(e) {
	return /^<\/a\s*>/i.test(e);
}
function Uf(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function Wf(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !Uf(i)) return !1;
	let a = e.src.slice(r).match(cf);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], Vf(t.content) && e.linkLevel++, Hf(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var Gf = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Kf = /^&([a-z][a-z0-9]{1,31});/i;
function qf(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(Gf);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = Mu(t) ? Nu(t) : Nu(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(Kf);
		if (r) {
			let n = Wl(r[0]);
			if (n !== r[0]) {
				if (!t) {
					let t = e.push("text_special", "", 0);
					t.content = n, t.markup = r[0], t.info = "entity";
				}
				return e.pos += r[0].length, !0;
			}
		}
	}
	return !1;
}
function Jf(e) {
	let t = {}, n = e.length;
	if (!n) return;
	let r = 0, i = -2, a = [];
	for (let o = 0; o < n; o++) {
		let n = e[o];
		if (a.push(0), (e[r].marker !== n.marker || i !== n.token - 1) && (r = o), i = n.token, n.length = n.length || 0, !n.close) continue;
		t.hasOwnProperty(n.marker) || (t[n.marker] = [
			-1,
			-1,
			-1,
			-1,
			-1,
			-1
		]);
		let s = t[n.marker][(n.open ? 3 : 0) + n.length % 3], c = r - a[r] - 1, l = c;
		for (; c > s; c -= a[c] + 1) {
			let t = e[c];
			if (t.marker === n.marker && t.open && t.end < 0) {
				let r = !1;
				if ((t.close || n.open) && (t.length + n.length) % 3 == 0 && (t.length % 3 != 0 || n.length % 3 != 0) && (r = !0), !r) {
					let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
					a[o] = o - c + r, a[c] = r, n.open = !1, t.end = o, t.close = !1, l = -1, i = -2;
					break;
				}
			}
		}
		l !== -1 && (t[n.marker][(n.open ? 3 : 0) + (n.length || 0) % 3] = l);
	}
}
function Yf(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Jf(e.delimiters);
	for (let e = 0; e < n; e++) {
		let n = t[e]?.delimiters;
		n && Jf(n);
	}
}
function Xf(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Zf = [
	["text", yf],
	["linkify", Sf],
	["newline", Cf],
	["escape", Tf],
	["backticks", Df],
	["strikethrough", jf.tokenize],
	["emphasis", Ff.tokenize],
	["link", If],
	["image", Lf],
	["autolink", Bf],
	["html_inline", Wf],
	["entity", qf]
], Qf = [
	["balance_pairs", Yf],
	["strikethrough", jf.postProcess],
	["emphasis", Ff.postProcess],
	["fragments_join", Xf]
], $f = class {
	constructor() {
		$(this, "ruler", new ud()), $(this, "ruler2", new ud()), $(this, "State", _f);
		for (let e = 0; e < Zf.length; e++) this.ruler.push(Zf[e][0], Zf[e][1]);
		for (let e = 0; e < Qf.length; e++) this.ruler2.push(Qf[e][0], Qf[e][1]);
	}
	skipToken(e) {
		let t = e.pos, n = this.ruler.getRules(""), r = n.length, i = e.md.options.maxNesting, a = e.cache;
		if (a[t] !== void 0) {
			e.pos = a[t];
			return;
		}
		let o = !1;
		if (e.level < i) {
			for (let i = 0; i < r; i++) if (e.level++, o = n[i](e, !0), e.level--, o) {
				if (t >= e.pos) throw Error("inline rule didn't increment state.pos");
				break;
			}
		} else e.pos = e.posMax;
		o || e.pos++, a[t] = e.pos;
	}
	tokenize(e) {
		let t = this.ruler.getRules(""), n = t.length, r = e.posMax, i = e.md.options.maxNesting;
		for (; e.pos < r;) {
			let a = e.pos, o = !1;
			if (e.level < i) {
				for (let r = 0; r < n; r++) if (o = t[r](e, !1), o) {
					if (a >= e.pos) throw Error("inline rule didn't increment state.pos");
					break;
				}
			}
			if (o) {
				if (e.pos >= r) break;
				continue;
			}
			e.pending += e.src[e.pos++];
		}
		e.pending && e.pushPending();
	}
	parse(e, t, n, r) {
		let i = new this.State(e, t, n, r);
		this.tokenize(i);
		let a = this.ruler2.getRules(""), o = a.length;
		for (let e = 0; e < o; e++) a[e](i);
	}
}, ep = {
	default: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 100
		},
		components: {
			core: {},
			block: {},
			inline: {}
		}
	},
	zero: {
		options: {
			html: !1,
			xhtmlOut: !1,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"strip_references",
				"inline",
				"text_join"
			] },
			block: { rules: ["paragraph"] },
			inline: {
				rules: ["text"],
				rules2: ["balance_pairs", "fragments_join"]
			}
		}
	},
	commonmark: {
		options: {
			html: !0,
			xhtmlOut: !0,
			breaks: !1,
			langPrefix: "language-",
			linkify: !1,
			typographer: !1,
			quotes: "“”‘’",
			highlight: null,
			maxNesting: 20
		},
		components: {
			core: { rules: [
				"normalize",
				"block",
				"strip_references",
				"inline",
				"text_join"
			] },
			block: { rules: [
				"blockquote",
				"code",
				"fence",
				"heading",
				"hr",
				"html_block",
				"lheading",
				"list",
				"reference",
				"paragraph"
			] },
			inline: {
				rules: [
					"autolink",
					"backticks",
					"emphasis",
					"entity",
					"escape",
					"html_inline",
					"image",
					"link",
					"newline",
					"text"
				],
				rules2: [
					"balance_pairs",
					"emphasis",
					"fragments_join"
				]
			}
		}
	}
}, tp = /^(vbscript|javascript|file|data):/, np = /^data:image\/(gif|png|jpeg|webp);/, rp = [
	"http:",
	"https:",
	"mailto:"
], ip = class {
	validateLink(e) {
		let t = e.trim().toLowerCase();
		return !tp.test(t) || np.test(t);
	}
	normalizeLink(e) {
		let t = ul(e, !0);
		if (t.hostname && (!t.protocol || rp.indexOf(t.protocol) >= 0)) try {
			t.hostname = Eu.toASCII(t.hostname);
		} catch {}
		return t.auth &&= Zc(t.auth), t.hostname &&= Zc(t.hostname), t.pathname &&= Zc(t.pathname), t.search &&= Zc(t.search), t.hash &&= Zc(t.hash), Qc(t);
	}
	normalizeLinkText(e) {
		let t = ul(e, !0);
		if (t.hostname && (!t.protocol || rp.indexOf(t.protocol) >= 0)) try {
			t.hostname = Eu.toUnicode(t.hostname);
		} catch {}
		return Jc(Qc(t), Jc.defaultChars + "%");
	}
	constructor(...e) {
		$(this, "inline", new $f()), $(this, "block", new gf()), $(this, "core", new Ud()), $(this, "renderer", new fd()), $(this, "linkify", new $l()), $(this, "utils", ku), $(this, "helpers", Object.assign({}, ad));
		let [t, n] = e;
		typeof t == "string" ? (this.configure(t), n && this.set(n)) : (this.configure("default"), this.set(t || {}));
	}
	set(e) {
		return Object.assign(this.options, e), this;
	}
	configure(e) {
		let t;
		if (typeof e == "string") {
			let n = e;
			if (t = ep[n], !t) throw Error(`Wrong 'markdown-it' preset "${n}", check name`);
		} else t = e;
		if (!t) throw Error("Wrong `markdown-it` preset, can't be empty");
		t.options && (this.options = { ...t.options });
		let n = t.components;
		if (n) {
			[
				"core",
				"block",
				"inline"
			].forEach((e) => {
				let t = n[e]?.rules;
				t && this[e].ruler.enableOnly(t);
			});
			let e = n.inline?.rules2;
			e && this.inline.ruler2.enableOnly(e);
		}
		return this;
	}
	enable(e, t = !1) {
		let n = [];
		Array.isArray(e) || (e = [e]), [
			"core",
			"block",
			"inline"
		].forEach((t) => {
			n = n.concat(this[t].ruler.enable(e, !0));
		}), n = n.concat(this.inline.ruler2.enable(e, !0));
		let r = e.filter((e) => n.indexOf(e) < 0);
		if (r.length && !t) throw Error(`MarkdownIt. Failed to enable unknown rule(s): ${r}`);
		return this;
	}
	disable(e, t = !1) {
		let n = [];
		Array.isArray(e) || (e = [e]), [
			"core",
			"block",
			"inline"
		].forEach((t) => {
			n = n.concat(this[t].ruler.disable(e, !0));
		}), n = n.concat(this.inline.ruler2.disable(e, !0));
		let r = e.filter((e) => n.indexOf(e) < 0);
		if (r.length && !t) throw Error(`MarkdownIt. Failed to disable unknown rule(s): ${r}`);
		return this;
	}
	use(e, ...t) {
		return e.apply(e, [this, ...t]), this;
	}
	parse(e, t) {
		if (typeof e != "string") throw Error("Input data should be a String");
		let n = new this.core.State(e, this, t);
		return this.core.process(n), n.tokens;
	}
	render(e, t = {}) {
		return this.renderer.render(this.parse(e, t), this.options, t);
	}
	parseInline(e, t) {
		let n = new this.core.State(e, this, t);
		return n.inlineMode = !0, this.core.process(n), n.tokens;
	}
	renderInline(e, t = {}) {
		return this.renderer.render(this.parseInline(e, t), this.options, t);
	}
};
$(ip, "Token", ld), $(ip, "Ruler", ud), $(ip, "Renderer", fd), $(ip, "ParserCore", Ud), $(ip, "StateCore", pd), $(ip, "ParserBlock", gf), $(ip, "StateBlock", Wd), $(ip, "ParserInline", $f), $(ip, "StateInline", _f);
var ap = Au(ip), op = {
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	bmp: "image/bmp",
	svg: "image/svg+xml",
	pdf: "application/pdf",
	mp4: "video/mp4",
	webm: "video/webm",
	mp3: "audio/mpeg",
	wav: "audio/wav",
	ogg: "audio/ogg",
	html: "text/html",
	htm: "text/html"
}, sp = new Set("txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split(" ")), cp = `(?:~/|/|[A-Za-z]:[/\\\\])\\S+?(?:[^\\S\\n]+\\S+?)*?\\.(?:${"png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm".split(" ").sort((e, t) => t.length - e.length).join("|")})(?=[\\s\`"'*_,;:)\\]}]|MEDIA:|$)`, lp = RegExp(`MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${cp}|[^\\s\`"]+)`, "g");
function up(e) {
	e = e.trim();
	let t = e[0];
	if (t && t === e.at(-1) && [
		"\"",
		"'",
		"`"
	].includes(t)) e = e.slice(1, -1);
	else {
		for (e = e.replace(/[`"]$/, ""); /[.,;:!?]$/.test(e) && /[/\\]|\.[^.]/.test(e.slice(0, -1));) e = e.slice(0, -1);
		e = e.replace(/[`"'*_]{1,3}$/, "");
	}
	return /[/\\]|\.[^.]/.test(e) ? e : "";
}
function dp(e, t) {
	let n = [], r = 0;
	for (let t of e.matchAll(lp)) {
		if (e.slice(r, t.index).trim()) return e;
		let i = up(t[1]);
		if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(i)) return e;
		n.push(i), r = t.index + t[0].length;
	}
	return !n.length || e.slice(r).trim() ? e : n.every((e) => !!pp(e)) && n.every(t) ? "" : e;
}
function fp(e) {
	return e.split(".").at(-1)?.toLowerCase() || "";
}
function pp(e, t) {
	try {
		e.startsWith("#media:") && (e = decodeURIComponent(e.slice(7))), e.startsWith("sandbox:") && (e = e.slice(8)), e.startsWith("file:") && (e = decodeURIComponent(new URL(e).pathname));
	} catch {
		return;
	}
	if (!/^(\/|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(e)) return;
	let n = e.split(/[\\/]/).at(-1)?.split(/[?#]/)[0] || "";
	t = (t && /\.[a-z0-9]{1,12}$/i.test(t) ? t : n) || t || "Attached image";
	let r = fp(t);
	return {
		path: e,
		name: t,
		type: op[r] || (sp.has(r) ? "text/plain" : "application/octet-stream")
	};
}
function mp(e) {
	if (e.type.startsWith("image/") && e.type !== "image/svg+xml") return "image";
	if (e.type === "application/pdf") return "pdf";
	if (e.type.startsWith("audio/")) return "audio";
	if (e.type.startsWith("video/")) return "video";
	if (sp.has(fp(e.name))) return "text";
}
function hp(e, t = "", n = !1) {
	if (/^(https?:\/\/|data:image\/)/.test(e.path)) return e.path;
	let r = new URLSearchParams({
		path: e.path,
		profile: t || "default"
	});
	return e.sessionId && r.set("session_id", e.sessionId), n && r.set("name", e.name), `/api/plugins/chathermes/files/${n ? "download" : "preview"}?${r}`;
}
var gp = new ap({ html: !0 });
function _p(e) {
	let t = [], n = (e, n) => {
		let r = pp(e, n);
		return r ? (t.some((e) => e.path === r.path) || t.push(r), !0) : !1;
	}, r = e.split("\n"), i = [...r], a = !1, o = [], s = gp.parse(e, {}), c = /* @__PURE__ */ new Set();
	for (let e of s) if (e.map && ([
		"fence",
		"code_block",
		"blockquote_open",
		"bullet_list_open",
		"ordered_list_open"
	].includes(e.type) || e.children?.some((e) => e.type === "code_inline" && /untrusted_tool_result/i.test(e.content)))) for (let t = e.map[0]; t < e.map[1]; t++) c.add(t);
	let l = /* @__PURE__ */ new Set(), u = 0;
	for (let [e, t] of r.entries()) if (u && l.add(e), !c.has(e) && /^\s*<\/?untrusted_tool_result\b/i.test(t)) for (let n of t.matchAll(/<(\/?)untrusted_tool_result\b[^>]*(?:>|$)/gi)) l.add(e), u = n[1] ? Math.max(0, u - 1) : u + 1;
	for (let [e, t] of s.entries()) if (t.type === "paragraph_open" && t.level === 0 && t.map && !s[e + 1]?.children?.some((e) => e.type === "code_inline" && /MEDIA:|Attached (?:image|file) /.test(e.content))) for (let e = t.map[0]; e < t.map[1]; e++) {
		if (l.has(e)) continue;
		let t = i[e], r = t.match(/^Attached (?:image|file) ([^\n]+?): ([^\n]+?)\r?$/);
		r && n(r[2].trim(), r[1]) ? (a = !0, i[e] = "") : /^@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)\r?$/.test(t) ? o.push(e) : t.startsWith("MEDIA:") && (i[e] = dp(t, n));
	}
	if (a) for (let e of o) i[e] = "";
	return {
		text: t.length ? i.filter((e, t) => e !== "" || r[t] === "").join("\n").trim() : e,
		files: t
	};
}
function vp(e) {
	if (e.kind !== "tool" || !e.complete || e.state === "failed") return [];
	let t;
	try {
		t = JSON.parse(e.output || "");
	} catch {
		return [];
	}
	if (!t || typeof t != "object" || Array.isArray(t)) return [];
	let n = t;
	if (n.is_error || n.error || n.success === !1 || typeof n.exit_code == "number" && n.exit_code !== 0) return [];
	let r = n._multimodal === !0 && n.meta && typeof n.meta == "object" && !Array.isArray(n.meta) ? n.meta : n;
	if (typeof r.media_tag != "string") return [];
	let i = r.media_tag.replace(/^\[\[audio_as_voice\]\]\r?\n/, "");
	if (i.split("\n").some((e) => e && !e.startsWith("MEDIA:"))) return [];
	let a = _p(i);
	return a.text.trim() ? [] : a.files.map((e) => {
		let t = r.mime_type || r.mime;
		typeof t == "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(t) && (e.type = t);
		let n = r.size ?? r.bytes;
		return typeof n == "number" && Number.isSafeInteger(n) && n >= 0 && (e.size = n), e;
	});
}
function yp(e) {
	let t = [];
	return {
		text: e.replace(/^Attached (?:image|file) ([^\n]+?): ([^\n]+)(?:\n|$)/gm, (e, n, r) => {
			let i = pp(r.trim(), n);
			return i ? (t.push(i), "") : e;
		}).replace(/(?:^|\n)@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)(?=\n|$)/g, (e) => t.length ? "" : e).trim(),
		files: t
	};
}
function bp(e) {
	if (e.role !== "user" && e.role !== "assistant") return [];
	let t = (e.role === "user" ? yp : _p)(ts(e.content)).files, n = t.some((e) => mp(e) === "image");
	if (Array.isArray(e.content)) {
		let r = 0;
		for (let i of e.content) {
			let e = i?.image_url?.url;
			if (typeof e == "string" && /^(data:image\/|https?:\/\/)/.test(e)) {
				if (n) {
					let n = t.filter((e) => mp(e) === "image")[r++];
					n && (n.imageData = e);
				} else {
					let n = pp(e, "Attached image.png");
					n && t.push(n);
				}
			}
		}
	}
	return t.map((t) => ({
		...t,
		messageId: e.id,
		createdAt: e.created_at,
		direction: e.role === "user" ? "uploaded" : "generated"
	}));
}
async function xp(e, t, n) {
	let r = [], i = 0;
	for (let a of t) {
		if (n.aborted) break;
		try {
			let t = await Q.messages(e, a.id, n);
			for (let e of t) r.push(...bp(e).map((e) => ({
				...e,
				sessionId: a.id,
				sessionTitle: a.title || "Untitled session"
			})));
			for (let e of Ds(t)) r.push(...vp(e).map((t) => ({
				...t,
				direction: "generated",
				sessionId: a.id,
				sessionTitle: a.title || "Untitled session",
				messageId: e.id,
				createdAt: a.updated_at || a.created_at
			})));
		} catch {
			n.aborted || i++;
		}
	}
	return {
		files: r.filter((e, t) => r.findIndex((t) => t.sessionId === e.sessionId && t.path === e.path) === t).sort((e, t) => (t.createdAt || "").localeCompare(e.createdAt || "")),
		failures: i
	};
}
//#endregion
//#region src/features/artifacts/components/ArtifactCard.vue?vue&type=script&setup=true&lang.ts
var Sp = { class: "artifact-card my-2 w-full max-w-md overflow-hidden rounded-2xl border border-[#424242] bg-[#292929]" }, Cp = ["aria-label"], wp = ["src", "alt"], Tp = { class: "flex min-w-0 items-center gap-3 p-3" }, Ep = ["src"], Dp = { class: "min-w-0 flex-1" }, Op = ["aria-label"], kp = {
	key: 1,
	class: "block truncate text-sm font-medium"
}, Ap = { class: "block text-xs text-[#b4b4b4]" }, jp = [
	"href",
	"download",
	"aria-label"
], Mp = { class: "mb-4 flex items-center gap-3" }, Np = { class: "min-w-0 flex-1 break-words" }, Pp = ["href", "download"], Fp = {
	key: 0,
	role: "status"
}, Ip = {
	key: 1,
	role: "alert",
	class: "text-red-200"
}, Lp = {
	key: 2,
	class: "max-h-[70dvh] overflow-auto whitespace-pre-wrap break-words text-sm"
}, Rp = ["src", "alt"], zp = ["src", "title"], Bp = ["src"], Vp = ["src"], Hp = /* @__PURE__ */ U({
	__name: "ArtifactCard",
	props: {
		file: {},
		profile: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* #__PURE__ */ Object.assign({
			"../../../assets/file-icons/blank.svg": bc,
			"../../../assets/file-icons/css.svg": xc,
			"../../../assets/file-icons/csv.svg": Sc,
			"../../../assets/file-icons/doc.svg": Cc,
			"../../../assets/file-icons/docx.svg": wc,
			"../../../assets/file-icons/gz.svg": Tc,
			"../../../assets/file-icons/html.svg": Ec,
			"../../../assets/file-icons/js.svg": Dc,
			"../../../assets/file-icons/json.svg": Oc,
			"../../../assets/file-icons/md.svg": kc,
			"../../../assets/file-icons/mp3.svg": Ac,
			"../../../assets/file-icons/mp4.svg": jc,
			"../../../assets/file-icons/pdf.svg": Mc,
			"../../../assets/file-icons/ppt.svg": Nc,
			"../../../assets/file-icons/pptx.svg": Pc,
			"../../../assets/file-icons/py.svg": Fc,
			"../../../assets/file-icons/svg.svg": Ic,
			"../../../assets/file-icons/tar.svg": Lc,
			"../../../assets/file-icons/ts.svg": Rc,
			"../../../assets/file-icons/txt.svg": zc,
			"../../../assets/file-icons/wav.svg": Bc,
			"../../../assets/file-icons/xls.svg": Vc,
			"../../../assets/file-icons/xlsx.svg": Hc,
			"../../../assets/file-icons/xml.svg": Uc,
			"../../../assets/file-icons/yaml.svg": Wc,
			"../../../assets/file-icons/zip.svg": Gc
		}), a = Z(() => i[`../../../assets/file-icons/${fp(n.file.name)}.svg`] || i["../../../assets/file-icons/blank.svg"]), o = Z(() => mp(n.file)), s = /* @__PURE__ */ V(), c = /* @__PURE__ */ V(""), l = /* @__PURE__ */ V(""), u = /* @__PURE__ */ V(""), d = /* @__PURE__ */ V(!1), f = /* @__PURE__ */ V(!1), p;
		function m() {
			p?.abort(), c.value.startsWith("blob:") && URL.revokeObjectURL(c.value), c.value = "", l.value = "";
		}
		cr(m);
		async function h() {
			m(), u.value = "", s.value?.showModal(), d.value = !0;
			let e = p = new AbortController();
			try {
				let t = hp(n.file, n.profile);
				if (o.value === "image" && /^https?:\/\//.test(t)) {
					c.value = t;
					return;
				}
				if (t.startsWith("/api/plugins/")) {
					let n = await fetch(t, {
						credentials: "same-origin",
						signal: e.signal,
						redirect: "error"
					});
					if (!n.ok) throw Error(`Preview unavailable (${n.status}). You can try downloading the file.`);
					let r = await n.json();
					if (typeof r.dataUrl != "string" || !r.dataUrl.startsWith("data:")) throw Error("Preview unavailable.");
					t = r.dataUrl;
				}
				let r = await fetch(t, { signal: e.signal });
				if (!r.ok) throw Error("Preview unavailable.");
				let i = await r.blob();
				if (e.signal.aborted) return;
				if (o.value === "text") l.value = await i.text();
				else if (o.value === "pdf") {
					if (!(await i.slice(0, 5).text()).startsWith("%PDF-")) throw Error("Preview unavailable. You can download the file instead.");
					c.value = URL.createObjectURL(new Blob([i], { type: "application/pdf" }));
				} else c.value = URL.createObjectURL(i);
			} catch (t) {
				e.signal.aborted || (u.value = t instanceof Error ? t.message : "Preview unavailable.");
			} finally {
				p === e && (d.value = !1);
			}
		}
		let g = /* @__PURE__ */ V("");
		return Pn([
			() => n.file.path,
			() => n.file.imageData,
			() => n.profile,
			() => n.file.sessionId
		], async (e, t, r) => {
			if (g.value = "", f.value = !1, o.value !== "image") return;
			if (n.file.imageData) {
				g.value = n.file.imageData;
				return;
			}
			let i = new AbortController();
			r(() => i.abort());
			let a = hp(n.file, n.profile);
			if (!a.startsWith("/api/plugins/")) {
				g.value = a;
				return;
			}
			try {
				let e = await fetch(a, {
					credentials: "same-origin",
					signal: i.signal,
					redirect: "error"
				});
				if (!e.ok) throw Error();
				let t = await e.json();
				!i.signal.aborted && /^data:image\/(?:png|jpeg|gif|webp|bmp);base64,/.test(t.dataUrl) ? g.value = t.dataUrl : i.signal.aborted || (f.value = !0);
			} catch {
				i.signal.aborted || (f.value = !0);
			}
		}, { immediate: !0 }), (t, n) => (G(), K("div", Sp, [
			o.value === "image" && g.value && !f.value ? (G(), K("button", {
				key: 0,
				type: "button",
				class: "block w-full",
				"aria-label": `Preview ${e.file.name}`,
				onClick: h
			}, [J("img", {
				src: g.value,
				alt: e.file.name,
				class: "max-h-72 w-full object-contain",
				onLoad: n[0] ||= (e) => r("imageLoad"),
				onError: n[1] ||= (e) => f.value = !0
			}, null, 40, wp)], 8, Cp)) : X("v-if", !0),
			J("div", Tp, [
				o.value !== "image" || f.value ? (G(), K("img", {
					key: 0,
					src: a.value,
					alt: "",
					class: "size-10 shrink-0"
				}, null, 8, Ep)) : X("v-if", !0),
				J("div", Dp, [o.value ? (G(), K("button", {
					key: 0,
					type: "button",
					class: "block w-full truncate text-left text-sm font-medium hover:underline",
					"aria-label": `Preview ${e.file.name}`,
					onClick: h
				}, F(e.file.name), 9, Op)) : (G(), K("span", kp, F(e.file.name), 1)), J("span", Ap, [Y(F(H(fp)(e.file.name).toUpperCase() || "FILE"), 1), e.file.size === void 0 ? X("v-if", !0) : (G(), K(W, { key: 0 }, [Y(" · " + F(e.file.size < 1024 ? `${e.file.size} B` : e.file.size < 1048576 ? `${(e.file.size / 1024).toFixed(1)} KB` : `${(e.file.size / 1048576).toFixed(1)} MB`), 1)], 64))])]),
				J("a", {
					href: H(hp)(e.file, e.profile, !0),
					download: e.file.name,
					"aria-label": `Download ${e.file.name}`,
					class: "grid size-10 shrink-0 place-items-center rounded-xl hover:bg-[#424242]"
				}, [...n[4] ||= [J("svg", {
					viewBox: "0 0 24 24",
					class: "size-5",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [J("path", { d: "M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" })], -1)]], 8, jp)
			]),
			xr(t.$slots, "footer"),
			J("dialog", {
				ref_key: "dialog",
				ref: s,
				class: "artifact-preview fixed m-auto max-h-[90dvh] w-[min(900px,94vw)] overflow-auto rounded-2xl border border-[#424242] bg-[#212121] p-4 text-white backdrop:bg-black/80",
				onClose: m,
				onClick: n[3] ||= (e) => e.target === s.value && s.value?.close()
			}, [J("div", Mp, [
				J("h2", Np, F(e.file.name), 1),
				J("a", {
					href: H(hp)(e.file, e.profile, !0),
					download: e.file.name,
					class: "text-sm underline"
				}, "Download", 8, Pp),
				J("button", {
					type: "button",
					autofocus: "",
					class: "size-10 rounded-full hover:bg-[#424242]",
					"aria-label": "Close preview",
					onClick: n[2] ||= (e) => s.value?.close()
				}, " ✕ ")
			]), d.value ? (G(), K("p", Fp, "Loading preview…")) : u.value ? (G(), K("p", Ip, F(u.value), 1)) : o.value === "text" ? (G(), K("pre", Lp, F(l.value), 1)) : o.value === "image" && c.value ? (G(), K("img", {
				key: 3,
				src: c.value,
				alt: e.file.name,
				class: "max-h-[70dvh] w-full object-contain"
			}, null, 8, Rp)) : o.value === "pdf" && c.value ? (G(), K("iframe", {
				key: 4,
				src: c.value,
				title: e.file.name,
				class: "h-[70dvh] w-full bg-white"
			}, null, 8, zp)) : o.value === "video" && c.value ? (G(), K("video", {
				key: 5,
				src: c.value,
				controls: "",
				class: "max-h-[70dvh] w-full"
			}, null, 8, Bp)) : o.value === "audio" && c.value ? (G(), K("audio", {
				key: 6,
				src: c.value,
				controls: "",
				class: "w-full"
			}, null, 8, Vp)) : X("v-if", !0)], 544)
		]));
	}
}), Up = new ap({
	html: !1,
	breaks: !0,
	linkify: !0
});
Up.renderer.rules.link_open = (e, t, n, r, i) => (e[t].attrSet("target", "_blank"), e[t].attrSet("rel", "noopener noreferrer"), i.renderToken(e, t, n));
function Wp(e) {
	return Up.render(e);
}
//#endregion
//#region src/features/chat/components/UserMessage.vue?vue&type=script&setup=true&lang.ts
var Gp = { class: "message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]" }, Kp = ["innerHTML"], qp = /* @__PURE__ */ U({
	__name: "UserMessage",
	props: {
		message: {},
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (G(), K("article", Gp, [J("div", {
			class: "message-content markdown-content break-words text-base leading-7",
			innerHTML: H(Wp)(H(yp)(H(ts)(e.message.content)).text.replace(/\[screenshot\]/g, "📷 Attached image"))
		}, null, 8, Kp), (G(!0), K(W, null, yr(H(bp)(e.message), (t) => (G(), q(Hp, {
			key: t.path,
			file: {
				...t,
				sessionId: e.sessionId
			},
			profile: e.profile,
			onImageLoad: r[0] ||= (e) => n("imageLoad")
		}, null, 8, ["file", "profile"]))), 128))]));
	}
});
//#endregion
//#region src/features/chat/utils/activity-runs.ts
function Jp(e) {
	return !!e.delegated || [
		"clarify",
		"setup_choose",
		"image_generate",
		"manage_catalog",
		"manage_connections",
		"start_chat"
	].includes(e.toolName || "");
}
function Yp(e) {
	let t = [];
	for (let n of e) {
		if ((n.kind === "text" || n.kind === "thinking") && !n.content.trim()) continue;
		let e = t.at(-1);
		n.kind === "tool" && !Jp(n) ? e?.kind === "tools" ? e.activities.push(n) : t.push({
			id: n.id,
			kind: "tools",
			activities: [n]
		}) : t.push({
			id: n.id,
			kind: "block",
			block: n
		});
	}
	return t;
}
//#endregion
//#region src/features/chat/utils/activity-labels.ts
var Xp = (e) => [
	"terminal",
	"execute_code",
	"python"
].includes(e.toolName || "");
function Zp(e) {
	try {
		return JSON.parse(e.content) || {};
	} catch {
		return {};
	}
}
function Qp(e) {
	let t = Zp(e), n = t.command ?? t.code;
	return typeof n == "string" && n.trim().split("\n")[0] || "";
}
function $p(e, t) {
	if (Xp(e)) return `${t ? "Running" : e.state === "completed" ? "Ran" : "Command"} ${Qp(e) || "command"}`;
	let n = (e.toolName || "tool").replace(/_/g, " ");
	return /^(used|using) tool$/i.test(e.title) ? `${t ? "Using" : e.state === "completed" ? "Used" : "Tool:"} ${n}` : e.title || n;
}
var em = {
	explore: {
		past: "Explored",
		present: "Exploring",
		nouns: ["file", "files"]
	},
	search: {
		past: "Searched",
		present: "Searching",
		nouns: ["query", "queries"]
	},
	read: {
		past: "Read",
		present: "Reading",
		nouns: ["page", "pages"]
	},
	browse: {
		past: "Opened",
		present: "Opening",
		nouns: ["page", "pages"]
	},
	interact: {
		past: "Performed",
		present: "Performing",
		nouns: ["browser action", "browser actions"]
	},
	analyze: {
		past: "Analyzed",
		present: "Analyzing",
		nouns: ["image", "images"]
	},
	run: {
		past: "Ran",
		present: "Running",
		nouns: ["command", "commands"]
	},
	other: {
		past: "Used",
		present: "Using",
		nouns: ["tool", "tools"]
	}
};
function tm(e) {
	let t = e.toolName || "";
	return Xp(e) ? "run" : [
		"read_file",
		"list_files",
		"search_files",
		"file_search",
		"search"
	].includes(t) ? "explore" : ["web_search", "session_search_recall"].includes(t) ? "search" : t === "web_extract" ? "read" : t === "browser_navigate" ? "browse" : t.startsWith("browser_") ? "interact" : t === "vision_analyze" ? "analyze" : "other";
}
function nm(e, t) {
	let n = Zp(e);
	if (t === "run") return Qp(e);
	if (t === "other" || t === "interact") return "";
	if (t === "search") {
		let e = n.query ?? n.search_term;
		return typeof e == "string" ? `“${e.slice(0, 48)}”` : "";
	}
	if (t === "read" || t === "browse") {
		let e = Array.isArray(n.urls) ? n.urls[0] : n.url;
		try {
			return typeof e == "string" ? new URL(e).hostname : "";
		} catch {
			return "";
		}
	}
	let r = n.path ?? n.file ?? n.filepath;
	return typeof r == "string" && r.split(/[\\/]/).at(-1) || "";
}
function rm(e, t) {
	let n = t ? e.find((e) => !e.complete) ?? e.at(-1) : void 0, r = n ? tm(n) : void 0, i = [];
	for (let t of Object.keys(em)) {
		let n = e.filter((e) => tm(e) === t);
		if (!n.length) continue;
		let a = em[t], o = t === r, s = n.every((e) => e.state === "completed"), c = n.reduce((e, n) => {
			let r = Zp(n).urls;
			return e + (t === "read" && Array.isArray(r) && r.length ? r.length : 1);
		}, 0), l = c === 1 && (o || t !== "run") ? nm(n[0], t) : "", u = o ? a.present : s ? a.past : "";
		i.push([u, l || `${c} ${a.nouns[c === 1 ? 0 : 1]}`].filter(Boolean).join(" "));
	}
	let a = e.filter((e) => e.state === "failed").length;
	return a && i.push(`${a} failed`), i.map((e, t) => t ? e.charAt(0).toLowerCase() + e.slice(1) : e).join(", ");
}
//#endregion
//#region src/components/ActivityRow.vue?vue&type=script&setup=true&lang.ts
var im = ["open"], am = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, om = {
	key: 1,
	"aria-hidden": "true"
}, sm = ["title"], cm = {
	key: 2,
	class: "activity-meta"
}, lm = {
	key: 3,
	class: "activity-meta"
}, um = {
	key: 4,
	class: "activity-meta"
}, dm = {
	key: 5,
	class: "activity-meta"
}, fm = {
	key: 6,
	class: "activity-meta"
}, pm = {
	key: 1,
	class: "ml-6 py-1 text-sm",
	role: "status"
}, mm = /* @__PURE__ */ U({
	__name: "ActivityRow",
	props: {
		activity: {},
		turnComplete: { type: Boolean }
	},
	setup(e) {
		let t = e, n = Z(() => !t.activity.complete && (!t.turnComplete || !!t.activity.delegated)), r = Z(() => !n.value && (!t.activity.state || ["pending", "running"].includes(t.activity.state)) ? t.activity.kind === "tool" ? "unknown" : "completed" : t.activity.state), i = Z(() => [
			"failed",
			"interrupted",
			"unknown"
		].includes(r.value || "")), a = /* @__PURE__ */ V(null), o = Z(() => a.value ?? (t.activity.kind === "thinking" && (i.value || n.value))), s = /* @__PURE__ */ V(), c = /* @__PURE__ */ V(!0);
		function l() {
			let e = s.value;
			e && (c.value = e.scrollHeight - e.scrollTop - e.clientHeight < 24);
		}
		Pn(() => [
			t.activity.content,
			t.activity.output,
			o.value
		], () => {
			let e = s.value;
			e && n.value && o.value && c.value && (e.scrollTop = e.scrollHeight);
		}, { flush: "post" });
		let u = /* @__PURE__ */ V(Date.now()), d;
		Pn(() => n.value && t.activity.startedAt !== void 0, (e) => {
			d && clearInterval(d), e && (d = setInterval(() => {
				u.value = Date.now();
			}, 1e3));
		}, { immediate: !0 }), cr(() => {
			d && clearInterval(d);
		});
		let f = Z(() => t.activity.duration ?? (n.value && t.activity.startedAt !== void 0 ? Math.max(0, (u.value - t.activity.startedAt) / 1e3) : void 0)), p = Z(() => t.activity.kind === "thinking" ? n.value ? "Thinking…" : "Thought" : $p(t.activity, n.value));
		function m(e) {
			let t = e.target.open;
			t !== o.value && (a.value = t);
		}
		return (t, c) => (G(), K("details", {
			class: pe(["activity", {
				"activity-failed": i.value,
				"activity-active": n.value,
				"activity-thinking": e.activity.kind === "thinking"
			}]),
			open: o.value,
			onToggle: m
		}, [J("summary", { onClick: c[0] ||= jo((e) => a.value = !o.value, ["prevent"]) }, [
			H(Xp)(e.activity) ? (G(), K("span", am, "›_")) : X("v-if", !0),
			i.value ? (G(), K("span", om, "!")) : X("v-if", !0),
			J("span", {
				class: pe(["activity-label", { "working-shimmer": n.value }]),
				title: p.value
			}, F(p.value), 11, sm),
			r.value === "failed" ? (G(), K("span", cm, " · Failed")) : r.value === "interrupted" ? (G(), K("span", lm, " · Interrupted")) : r.value === "unknown" ? (G(), K("span", um, " · Result unavailable")) : n.value && e.activity.kind === "tool" ? (G(), K("span", dm, " · " + F(r.value === "pending" ? "Waiting…" : "Running…"), 1)) : X("v-if", !0),
			f.value === void 0 ? X("v-if", !0) : (G(), K("span", fm, " · " + F(f.value.toFixed(1)) + "s", 1)),
			J("span", {
				class: pe(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2)
		]), e.activity.content || e.activity.output || e.activity.toolName ? (G(), K("pre", {
			key: 0,
			ref_key: "preview",
			ref: s,
			onScroll: l
		}, F([
			e.activity.toolName,
			e.activity.content,
			e.activity.output
		].filter(Boolean).join("\n\n")), 545)) : n.value ? (G(), K("p", pm, "Working…")) : X("v-if", !0)], 42, im));
	}
}), hm = {
	class: "turn-work",
	"aria-label": "Tool activity"
}, gm = ["aria-expanded", "aria-controls"], _m = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, vm = ["title"], ym = {
	key: 1,
	class: "sr-only",
	role: "status"
}, bm = ["id"], xm = /* @__PURE__ */ U({
	__name: "TurnWork",
	props: {
		activities: {},
		working: { type: Boolean },
		approvalPending: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(null), r = Wn(), i = (e) => t.working && !e.complete, a = Z(() => t.activities.filter((e) => !i(e))), o = Z(() => t.activities.length > 1 && a.value.length > 0), s = Z(() => n.value ?? !1), c = (e) => ["interrupted", "unknown"].includes(e.state || "") || !t.working && !e.complete, l = Z(() => t.approvalPending ? "Waiting for approval" : t.activities.length ? rm(a.value, !1) : "Working…");
		return (t, a) => (G(), K("section", hm, [o.value || !e.activities.length ? (G(), K("button", {
			key: 0,
			type: "button",
			class: "work-summary",
			"aria-expanded": s.value,
			"aria-controls": H(r),
			onClick: a[0] ||= (e) => n.value = !s.value
		}, [
			e.activities.some(H(Xp)) ? (G(), K("span", _m, "›_")) : X("v-if", !0),
			J("span", {
				class: pe(["activity-label", { "working-shimmer": e.working && !e.activities.length && !e.approvalPending }]),
				title: l.value
			}, F(l.value), 11, vm),
			J("span", {
				class: pe(["work-chevron", { expanded: s.value }]),
				"aria-hidden": "true"
			}, "›", 2),
			e.approvalPending ? (G(), K("span", ym, "Waiting for approval")) : X("v-if", !0)
		], 8, gm)) : X("v-if", !0), J("div", {
			id: H(r),
			class: pe(["work-timeline", { "work-timeline-single": !o.value }])
		}, [(G(!0), K(W, null, yr(e.activities, (n) => (G(), K(W, { key: n.id }, [On(J("div", { class: pe({ "current-activity": i(n) }) }, [Yi(mm, {
			activity: n,
			"turn-complete": !e.working
		}, null, 8, ["activity", "turn-complete"])], 2), [[za, !o.value || s.value || i(n) || c(n)]]), xr(t.$slots, "result", { activity: n })], 64))), 128))], 10, bm)]));
	}
}), Sm = { class: "message assistant w-full self-start" }, Cm = ["innerHTML"], wm = /* @__PURE__ */ U({
	__name: "AssistantTextBlock",
	props: {
		block: {},
		profile: {},
		sessionId: {},
		excludedPaths: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = Z(() => _p(n.block.content)), i = t;
		return (t, n) => (G(), K("article", Sm, [
			J("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: H(Wp)(r.value.text)
			}, null, 8, Cm),
			(G(!0), K(W, null, yr(r.value.files.filter((t) => !e.excludedPaths?.includes(t.path)), (t) => (G(), q(Hp, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[0] ||= (e) => i("imageLoad")
			}, null, 8, ["file", "profile"]))), 128)),
			(G(!0), K(W, null, yr(e.block.images, (t) => (G(), q(Hp, {
				key: t,
				file: {
					path: t,
					name: "Attached image.png",
					type: "image/png",
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[1] ||= (e) => i("imageLoad")
			}, null, 8, ["file", "profile"]))), 128))
		]));
	}
}), Tm = { class: "assistant-turn grid min-w-0 gap-1" }, Em = /* @__PURE__ */ U({
	__name: "AssistantTurn",
	props: {
		entry: {},
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = Z(() => n.entry.blocks.flatMap((e) => e.kind === "text" ? _p(e.content).files.map((e) => e.path) : [])), i = Z(() => Yp(n.entry.blocks)), a = Z(() => {
			let e = new Set(r.value), t = /* @__PURE__ */ new Map();
			for (let r of n.entry.blocks) r.kind === "tool" && t.set(r.id, vp(r).filter((t) => !e.has(t.path) && (e.add(t.path), !0)));
			return t;
		}), o = (e) => a.value.get(e.id) || [], s = t;
		return (t, n) => (G(), K("div", Tm, [
			(G(!0), K(W, null, yr(i.value, (t) => (G(), K(W, { key: t.id }, [t.kind === "tools" ? (G(), q(xm, {
				key: 0,
				activities: t.activities,
				working: !!e.entry.working
			}, {
				result: Dn(({ activity: t }) => [(G(!0), K(W, null, yr(o(t), (t) => (G(), q(Hp, {
					key: t.path,
					file: {
						...t,
						sessionId: e.sessionId
					},
					profile: e.profile,
					onImageLoad: n[0] ||= (e) => s("imageLoad")
				}, null, 8, ["file", "profile"]))), 128))]),
				_: 1
			}, 8, ["activities", "working"])) : (G(), K(W, { key: 1 }, [t.block.kind === "text" ? (G(), q(wm, {
				key: 0,
				block: t.block,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: n[1] ||= (e) => s("imageLoad")
			}, null, 8, [
				"block",
				"profile",
				"session-id"
			])) : (G(), K(W, { key: 1 }, [t.block.kind !== "thinking" || t.block.content.trim() ? (G(), q(mm, {
				key: 0,
				activity: t.block,
				"turn-complete": !e.entry.working
			}, null, 8, ["activity", "turn-complete"])) : X("v-if", !0), (G(!0), K(W, null, yr(o(t.block), (t) => (G(), q(Hp, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[2] ||= (e) => s("imageLoad")
			}, null, 8, ["file", "profile"]))), 128))], 64))], 64))], 64))), 128)),
			e.entry.working && (!e.entry.blocks.length || e.entry.approvalPending) ? (G(), q(xm, {
				key: 0,
				activities: [],
				working: !0,
				"approval-pending": e.entry.approvalPending
			}, null, 8, ["approval-pending"])) : X("v-if", !0),
			xr(t.$slots, "request")
		]));
	}
}), Dm = { class: "relative flex min-h-0 w-full flex-1" }, Om = {
	key: 0,
	class: "muted text-sm text-[#a3a3a3]"
}, km = {
	key: 1,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, Am = {
	key: 1,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, jm = { class: "system-notices" }, Mm = { class: "cursor-pointer select-none" }, Nm = { class: "mt-2 whitespace-pre-wrap break-words" }, Pm = {
	key: 2,
	class: "assistant-turn",
	"data-chat-message": "",
	tabindex: "-1"
}, Fm = {
	key: 3,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, Im = {
	key: 5,
	class: "message assistant w-full self-start",
	"data-chat-message": "",
	tabindex: "-1"
}, Lm = ["innerHTML"], Rm = /* @__PURE__ */ U({
	__name: "ChatTranscript",
	props: {
		profile: {},
		sessionId: {},
		messages: {},
		draft: {},
		loading: { type: Boolean },
		progress: {},
		blocks: {},
		turnUserCount: {},
		thinking: { type: Boolean },
		working: { type: Boolean },
		approvalPending: { type: Boolean },
		statusLabel: {},
		home: { type: Boolean },
		followInitially: {
			type: Boolean,
			default: !0
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = Z(() => i.value), i = Z(() => yc(n)), a = /* @__PURE__ */ V(), o = /* @__PURE__ */ V(), s = /* @__PURE__ */ V(n.followInitially !== !1), c = /* @__PURE__ */ V(!0), l;
		function u() {
			let e = a.value;
			if (!e || !s.value || document.activeElement !== e && document.activeElement !== l) return;
			let t = o.value?.querySelectorAll("[data-chat-message]"), n = t?.[t.length - 1] || e;
			document.activeElement !== n && n.focus({ preventScroll: !0 }), l = n;
		}
		function d() {
			a.value?.focus({ preventScroll: !0 }), g(), hn(() => {
				_();
			});
		}
		t({ focusLatestMessage: d });
		let f = !n.messages.length && n.followInitially !== !1, p;
		function m() {
			let e = a.value;
			c.value = !e || e.scrollHeight - e.scrollTop - e.clientHeight <= 2;
		}
		function h() {
			m(), f || (s.value = c.value);
		}
		function g() {
			let e = a.value;
			e && (e.scrollTop = e.scrollHeight, s.value = !0, m());
		}
		function _() {
			s.value ? (g(), u()) : m();
		}
		async function v() {
			await hn(), _();
		}
		return ar(() => {
			_(), typeof ResizeObserver < "u" && (p = new ResizeObserver(_), a.value && p.observe(a.value), o.value && p.observe(o.value));
		}), cr(() => p?.disconnect()), Pn(() => [
			n.loading,
			n.messages,
			n.draft,
			n.blocks || n.progress,
			n.working,
			n.thinking,
			n.approvalPending
		], () => {
			!n.messages.length && !n.draft && !n.working && (f = n.followInitially !== !1), !n.loading && (f && n.messages.length && (s.value = !0, f = !1), _());
		}, {
			deep: !0,
			flush: "post"
		}), (t, n) => (G(), K("div", Dm, [J("div", {
			ref_key: "transcript",
			ref: a,
			class: "transcript flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 py-6 text-white min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9",
			tabindex: "-1",
			role: "log",
			"aria-label": "Conversation",
			"aria-live": "polite",
			onScroll: h,
			onToggleCapture: v
		}, [J("div", {
			ref_key: "content",
			ref: o,
			class: "flex min-h-full shrink-0 flex-col gap-7"
		}, [
			e.loading ? (G(), K("div", Om, "Loading conversation…")) : !r.value.length && !e.draft && !e.thinking ? (G(), K("div", km, [...n[0] ||= [J("div", { class: "m-auto text-center" }, [J("h2", { class: "text-2xl font-medium" }, "What can I help with?"), J("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, " Ask Hermes a question or continue a conversation. ")], -1)]])) : X("v-if", !0),
			(G(!0), K(W, null, yr(i.value, (n) => (G(), K(W, { key: n.key }, [n.kind === "user" ? (G(), q(qp, {
				key: 0,
				"data-chat-message": "",
				tabindex: "-1",
				message: n.message,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: v
			}, null, 8, [
				"message",
				"profile",
				"session-id"
			])) : n.kind === "status" ? (G(), K("div", Am, [J("details", jm, [J("summary", Mm, F(n.text), 1), J("p", Nm, F(n.content), 1)])])) : (G(), q(Em, {
				key: 2,
				"data-chat-message": "",
				tabindex: "-1",
				entry: n,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: v
			}, br({ _: 2 }, [n.working ? {
				name: "request",
				fn: Dn(() => [xr(t.$slots, "request")]),
				key: "0"
			} : void 0]), 1032, [
				"entry",
				"profile",
				"session-id"
			]))], 64))), 128)),
			e.working && !i.value.some((e) => e.kind === "turn" && e.working) ? (G(), K("div", Pm, [Yi(xm, {
				activities: e.progress,
				working: !0,
				"approval-pending": e.approvalPending
			}, null, 8, ["activities", "approval-pending"])])) : X("v-if", !0),
			e.statusLabel && !e.working ? (G(), K("div", Fm, F(e.statusLabel), 1)) : X("v-if", !0),
			i.value.some((e) => e.kind === "turn" && e.working) ? X("v-if", !0) : xr(t.$slots, "request", {}, void 0, void 0, 4),
			e.draft && !e.blocks?.length ? (G(), K("article", Im, [J("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: H(Wp)(e.draft)
			}, null, 8, Lm)])) : X("v-if", !0)
		], 512)], 544), !c.value && !e.home && !e.loading ? (G(), K("button", {
			key: 0,
			type: "button",
			class: "absolute bottom-5 left-1/2 z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#424242] bg-[#303030] text-white shadow-xl hover:bg-[#424242] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
			"aria-label": "Scroll to latest message",
			title: "Scroll to latest message",
			onClick: g
		}, [...n[1] ||= [J("svg", {
			"aria-hidden": "true",
			viewBox: "0 0 24 24",
			class: "size-5",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2"
		}, [J("path", { d: "M12 5v14m-7-7 7 7 7-7" })], -1)]])) : X("v-if", !0)]));
	}
}), zm = {
	key: 0,
	class: "flex flex-wrap gap-2 px-2 pb-2"
}, Bm = ["src", "alt"], Vm = { class: "truncate" }, Hm = [
	"disabled",
	"onClick",
	"aria-label"
], Um = ["aria-label", "onClick"], Wm = {
	key: 1,
	class: "px-2 pb-2 text-sm text-[#d4d4d4]",
	role: "status"
}, Gm = {
	key: 2,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, Km = {
	key: 3,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, qm = { class: "composer-body" }, Jm = ["placeholder"], Ym = { class: "composer-controls flex items-center gap-3" }, Xm = ["aria-expanded", "disabled"], Zm = { class: "composer-hint min-w-0 flex-1 px-1 text-[11px] text-[#a3a3a3]" }, Qm = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], $m = { class: "truncate" }, eh = [
	"disabled",
	"aria-label",
	"title"
], th = {
	key: 0,
	viewBox: "0 0 24 24",
	class: "size-5",
	fill: "currentColor",
	"aria-hidden": "true"
}, nh = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "size-5",
	"aria-hidden": "true"
}, rh = ["id", "aria-label"], ih = { class: "flex shrink-0 items-center gap-2 border-b border-[#424242] p-2" }, ah = { class: "min-w-0 flex-1 truncate" }, oh = { class: "min-h-0 overflow-y-auto overscroll-contain" }, sh = ["data-provider", "onClick"], ch = { class: "min-w-0 flex-1 truncate" }, lh = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, uh = ["data-model", "onClick"], dh = { class: "min-w-0 flex-1 break-all" }, fh = {
	key: 0,
	"aria-label": "Selected"
}, ph = {
	key: 0,
	class: "px-3 py-3 text-[#a3a3a3]"
}, mh = {
	key: 5,
	class: "absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
}, hh = /* @__PURE__ */ U({
	__name: "ChatComposer",
	props: {
		profile: {},
		disabled: { type: Boolean },
		sending: { type: Boolean },
		projectName: {},
		stoppable: { type: Boolean },
		imagesSupported: {
			type: Boolean,
			default: !0
		},
		reason: {},
		suggestedPrompt: {},
		models: {},
		model: {},
		defaultModel: {},
		providers: {},
		provider: {},
		modelsLoading: { type: Boolean }
	},
	emits: [
		"stop",
		"steer",
		"send",
		"update:model",
		"update:provider"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = /* @__PURE__ */ V(""), o = /* @__PURE__ */ V(null), s = /* @__PURE__ */ V(!1), c = /* @__PURE__ */ V([]), l = /* @__PURE__ */ V(""), u = /* @__PURE__ */ V(!1), d = /* @__PURE__ */ V(), f = /* @__PURE__ */ V(), p = /* @__PURE__ */ V(), m = /* @__PURE__ */ V(), h = /* @__PURE__ */ V(!1), g;
		function _() {
			let e = p.value;
			if (!e) return;
			let t = getComputedStyle(e), n = parseFloat(t.paddingTop || "0") + parseFloat(t.paddingBottom || "0");
			e.style.height = "0px";
			let r = e.scrollHeight - n, i = parseFloat(t.lineHeight) || 24, a = Math.max(parseFloat(t.minHeight) || 0, Math.min(r, 8 * i)) + n;
			e.style.height = `${a}px`;
		}
		function v(e) {
			e.button === 0 && document.activeElement === p.value && e.preventDefault();
		}
		function y() {
			h.value = !0, C.value = !1, b();
		}
		function b() {
			hn(_);
		}
		function x(e) {
			(!(e.relatedTarget instanceof Node) || !m.value?.contains(e.relatedTarget)) && (h.value = !1);
		}
		Pn(a, () => _(), { flush: "post" }), ar(() => {
			if (_(), typeof ResizeObserver < "u") {
				let e = -1;
				g = new ResizeObserver((t) => {
					let n = t[0]?.contentRect.width;
					n !== void 0 && n !== e && (e = n, _());
				}), p.value && g.observe(p.value);
			}
		}), cr(() => g?.disconnect()), Pn(() => r.suggestedPrompt, (e) => {
			e && (a.value = e);
		}, { immediate: !0 });
		let S = Z(() => (r.models || []).filter((e) => e.parent !== null)), C = /* @__PURE__ */ V(!1), w = /* @__PURE__ */ V(null), T = /* @__PURE__ */ V(), E = /* @__PURE__ */ V(), D = Wn(), O = Z(() => r.imagesSupported === !1 && c.value.some((e) => e.type.startsWith("image/"))), k = Z(() => r.sending || r.modelsLoading), A = Z(() => r.providers?.find((e) => e.slug === w.value)), ee = Z(() => A.value?.name || "Model routes"), te = Z(() => {
			let e = A.value, t = e ? e.models : S.value.map((e) => e.id);
			return [.../* @__PURE__ */ new Set([...(e?.is_current || !r.providers?.length) && r.defaultModel ? [r.defaultModel] : [], ...t])];
		});
		async function ne() {
			await hn(), C.value && E.value?.querySelector("button")?.focus();
		}
		function j() {
			C.value && (C.value = !1, T.value?.focus());
		}
		function M() {
			if (C.value) {
				j();
				return;
			}
			k.value || (s.value = !1, w.value = null, C.value = !0, ne());
		}
		function re(e) {
			w.value = e, ne();
		}
		function ie() {
			w.value = null, ne();
		}
		function ae(e) {
			k.value || (i("update:provider", w.value || ""), i("update:model", A.value?.is_current && e === r.defaultModel ? "" : e), j());
		}
		function oe(e) {
			let t = e.composedPath();
			E.value && !t.includes(E.value) && T.value && !t.includes(T.value) && j();
		}
		function se(e) {
			if (C.value && (e.key === "Escape" && (e.preventDefault(), j()), e.key === "Tab")) {
				let t = Array.from(E.value?.querySelectorAll("button") || []), n = e.shiftKey ? t.at(-1) : t[0];
				document.activeElement === (e.shiftKey ? t[0] : t.at(-1)) && (e.preventDefault(), n?.focus());
			}
		}
		Pn(k, (e) => {
			e && j();
		}), Pn(() => r.providers, () => j()), ar(() => {
			document.addEventListener("click", oe), document.addEventListener("keydown", se);
		}), cr(() => {
			document.removeEventListener("click", oe), document.removeEventListener("keydown", se);
		});
		let ce = Z(() => r.sending ? !r.stoppable || !!a.value.trim() && (u.value || c.value.some((e) => !!e.uploadError) || O.value) : r.disabled || u.value || c.value.some((e) => !!e.uploadError) || O.value || !a.value.trim() && !c.value.length);
		function le() {
			if (ce.value) return;
			if (r.sending && a.value.trim()) {
				i("steer", a.value.trim()), a.value = "";
				return;
			}
			if (r.disabled || r.sending || u.value || c.value.some((e) => !!e.uploadError) || O.value) return;
			let e = a.value.trim();
			(e || c.value.length) && (i("send", o.value ? `/${o.value}\n${e}` : e, [...c.value]), a.value = "", c.value = [], s.value = !1, o.value = null);
		}
		async function ue(e) {
			if (e.length <= 1398104) return e;
			let t = new Image();
			await new Promise((n, r) => {
				t.onload = () => n(), t.onerror = () => r(/* @__PURE__ */ Error("Could not open this image. Try a JPEG or PNG.")), t.src = e;
			});
			let n = 2048;
			for (; n >= 512;) {
				let e = Math.min(1, n / Math.max(t.naturalWidth, t.naturalHeight)), r = document.createElement("canvas");
				r.width = Math.max(1, Math.round(t.naturalWidth * e)), r.height = Math.max(1, Math.round(t.naturalHeight * e));
				let i = r.getContext("2d");
				if (!i) throw Error("Could not prepare this photo.");
				i.fillStyle = "#fff", i.fillRect(0, 0, r.width, r.height), i.drawImage(t, 0, 0, r.width, r.height);
				let a = r.toDataURL("image/jpeg", .8);
				if (a.length <= 1398104) return a;
				n /= 2;
			}
			throw Error("This image is too large to send.");
		}
		let de = 0;
		cr(() => {
			de++;
		});
		async function fe(e) {
			let t = de;
			try {
				let n = await Q.upload(r.profile || "", e);
				if (t !== de) return;
				e.path = n.path, e.uploadError = void 0;
			} catch {
				t === de && (e.uploadError = "Upload failed. Retry or remove this file.");
			}
		}
		async function pe(e) {
			if (!u.value) {
				u.value = !0;
				try {
					await fe(e);
				} finally {
					u.value = !1;
				}
			}
		}
		async function N(e) {
			if (u.value) return;
			let t = de;
			u.value = !0, l.value = "", s.value = !1;
			try {
				for (let n of e) try {
					if (n.size > 20971520) throw Error("Each file must be 20 MB or smaller.");
					if (c.value.length >= 5) throw Error("Attach up to five files per message.");
					let e = await new Promise((e, t) => {
						let r = new FileReader();
						r.onload = () => e(String(r.result)), r.onerror = () => t(/* @__PURE__ */ Error("Could not read file.")), r.onabort = () => t(/* @__PURE__ */ Error("File reading was cancelled. Try again.")), r.readAsDataURL(n);
					});
					if (n.type.startsWith("image/") && (e = await ue(e)), t !== de) return;
					let r = n.type.startsWith("image/") ? e.slice(5, e.indexOf(";")) : n.type || "application/octet-stream", i = {
						name: n.name,
						type: r,
						data: e,
						size: n.size
					};
					c.value.push(i), await fe(i);
				} catch (e) {
					if (t !== de) return;
					l.value = e instanceof Error ? e.message : "Could not read file.";
				}
			} finally {
				t === de && (u.value = !1);
			}
		}
		async function P(e) {
			let t = e.target;
			await N(Array.from(t.files || [])), t.value = "";
		}
		return t({
			stageFiles: N,
			blurInput: () => p.value?.blur()
		}), (t, n) => (G(), K("form", {
			ref_key: "form",
			ref: m,
			onFocusout: x,
			class: "composer relative mx-auto mb-0 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:w-[calc(100%-48px)]",
			onSubmit: jo(le, ["prevent"])
		}, [
			c.value.length ? (G(), K("div", zm, [(G(!0), K(W, null, yr(c.value, (e, t) => (G(), K("div", {
				key: t,
				class: "flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm"
			}, [
				e.type.startsWith("image/") ? (G(), K("img", {
					key: 0,
					src: e.data,
					alt: e.name,
					class: "size-12 rounded-lg object-cover"
				}, null, 8, Bm)) : X("v-if", !0),
				J("span", Vm, F(e.name), 1),
				e.uploadError ? (G(), K("button", {
					key: 1,
					type: "button",
					class: "text-red-200 underline",
					disabled: u.value,
					onClick: (t) => pe(e),
					"aria-label": `Retry upload ${e.name}`
				}, " Retry upload", 8, Hm)) : X("v-if", !0),
				J("button", {
					type: "button",
					"aria-label": `Remove ${e.name}`,
					onClick: (e) => c.value.splice(t, 1)
				}, " × ", 8, Um)
			]))), 128))])) : X("v-if", !0),
			o.value ? (G(), K("p", Wm, [Y(F(o.value === "goal" ? "Goal mode" : "Plan mode") + " · next message ", 1), J("button", {
				type: "button",
				class: "ml-2 underline",
				onClick: n[0] ||= (e) => o.value = null
			}, "Turn off")])) : X("v-if", !0),
			O.value ? (G(), K("p", Gm, " Image sending is unavailable for this native capability. Remove the image to send text or files. ")) : X("v-if", !0),
			l.value ? (G(), K("p", Km, F(l.value), 1)) : X("v-if", !0),
			J("div", qm, [
				n[13] ||= J("label", {
					class: "sr-only",
					for: "prompt"
				}, "Message Hermes", -1),
				On(J("textarea", {
					ref_key: "textarea",
					ref: p,
					id: "prompt",
					"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
					rows: "1",
					maxlength: "65536",
					placeholder: e.projectName ? `Message ${e.projectName}` : "Message Hermes…",
					class: "composer-input min-h-14 w-full resize-none bg-transparent px-2 py-1 text-base leading-6 text-white outline-none placeholder:text-[#b4b4b4]",
					onFocus: y,
					onBlur: b
				}, null, 40, Jm), [[xo, a.value]]),
				J("input", {
					ref_key: "files",
					ref: d,
					type: "file",
					multiple: "",
					hidden: "",
					"aria-label": "Upload files",
					onChange: P
				}, null, 544),
				J("input", {
					ref_key: "camera",
					ref: f,
					type: "file",
					accept: "image/*",
					capture: "environment",
					hidden: "",
					"aria-label": "Take a photo",
					onChange: P
				}, null, 544),
				J("div", Ym, [
					On(J("button", {
						class: "attach-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#424242] p-0 text-white disabled:opacity-55",
						type: "button",
						"aria-label": "Attachment options",
						"aria-expanded": s.value,
						disabled: e.sending || u.value,
						onClick: n[2] ||= (e) => {
							j(), s.value = !s.value;
						}
					}, [...n[9] ||= [J("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						class: "size-5",
						"aria-hidden": "true"
					}, [J("path", { d: "M12 5v14M5 12h14" })], -1)]], 8, Xm), [[za, !h.value]]),
					J("p", Zm, F(u.value ? "Preparing attachments…" : e.reason || ""), 1),
					J("button", {
						ref_key: "pill",
						ref: T,
						type: "button",
						class: "model-pill flex h-[30px] min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-0 text-[16px] text-white disabled:opacity-55",
						"aria-label": "Choose model",
						"aria-haspopup": "dialog",
						"aria-expanded": C.value,
						"aria-controls": H(D),
						disabled: k.value,
						onClick: M
					}, [J("span", $m, F(e.modelsLoading ? "Loading models…" : e.model || e.defaultModel || "Default"), 1), n[10] ||= J("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-4 shrink-0",
						"aria-hidden": "true"
					}, [J("path", { d: "m6 9 6 6 6-6" })], -1)], 8, Qm),
					J("button", {
						class: "send-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#2563eb] p-0 text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
						type: "button",
						disabled: ce.value,
						"aria-label": e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						title: e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						onPointerdown: v,
						onClick: n[3] ||= (t) => e.sending ? a.value.trim() ? le() : e.stoppable && i("stop") : le()
					}, [e.sending && !a.value.trim() ? (G(), K("svg", th, [...n[11] ||= [J("rect", {
						x: "6",
						y: "6",
						width: "12",
						height: "12",
						rx: "2"
					}, null, -1)]])) : (G(), K("svg", nh, [...n[12] ||= [J("path", { d: "M12 19V5m-6 6 6-6 6 6" }, null, -1)]]))], 40, eh)
				])
			]),
			C.value ? (G(), K("div", {
				key: 4,
				id: H(D),
				ref_key: "panel",
				ref: E,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": w.value === null ? "Choose provider" : ee.value,
				class: "model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl"
			}, [J("div", ih, [
				w.value === null ? X("v-if", !0) : (G(), K("button", {
					key: 0,
					type: "button",
					"aria-label": "Back to providers",
					class: "picker-back rounded-full p-2 hover:bg-[#424242]",
					onClick: ie
				}, [...n[14] ||= [J("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					class: "size-5",
					"aria-hidden": "true"
				}, [J("path", { d: "m15 18-6-6 6-6" })], -1)]])),
				J("h2", ah, F(w.value === null ? "Choose provider" : ee.value), 1),
				J("button", {
					type: "button",
					"aria-label": "Close model picker",
					class: "rounded-full px-3 py-2 hover:bg-[#424242]",
					onClick: j
				}, " × ")
			]), J("div", oh, [w.value === null ? (G(), K(W, { key: 0 }, [(G(!0), K(W, null, yr(e.providers, (e) => (G(), K("button", {
				key: e.slug,
				type: "button",
				class: "provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
				"data-provider": e.slug,
				onClick: (t) => re(e.slug)
			}, [J("span", ch, F(e.name), 1), e.is_current ? (G(), K("span", lh, "Current")) : X("v-if", !0)], 8, sh))), 128)), J("button", {
				type: "button",
				class: "provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
				"data-provider": "",
				onClick: n[4] ||= (e) => re("")
			}, " Model routes ")], 64)) : (G(), K(W, { key: 1 }, [(G(!0), K(W, null, yr(te.value, (t) => (G(), K("button", {
				key: t,
				type: "button",
				class: "model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
				"data-model": t,
				onClick: (e) => ae(t)
			}, [J("span", dh, F(t), 1), (e.provider || "") === w.value && t === (e.model || e.defaultModel) ? (G(), K("span", fh, "✓")) : X("v-if", !0)], 8, uh))), 128)), te.value.length ? X("v-if", !0) : (G(), K("p", ph, "No models available"))], 64))])], 8, rh)) : X("v-if", !0),
			s.value ? (G(), K("div", mh, [
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[5] ||= (e) => d.value?.click()
				}, " Upload files "),
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[6] ||= (e) => f.value?.click()
				}, " Take a photo "),
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "goal",
					onClick: n[7] ||= (e) => {
						o.value = "goal", s.value = !1;
					}
				}, " Goal mode "),
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "plan",
					onClick: n[8] ||= (e) => {
						o.value = "plan", s.value = !1;
					}
				}, " Plan mode ")
			])) : X("v-if", !0)
		], 544));
	}
}), gh = {
	key: 0,
	class: "approval-choices grid grid-cols-1 gap-2 my-3"
}, _h = ["disabled", "onClick"], vh = /* @__PURE__ */ U({
	__name: "ApprovalRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		active: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(!1);
		async function r(e) {
			if (!(n.value || t.disabled)) {
				n.value = !0;
				try {
					await t.answer({ choice: e });
				} finally {
					n.value = !1;
				}
			}
		}
		return (t, i) => (G(), K(W, null, [J("p", null, "Approval required" + F(e.request.params.command ? ": " + e.request.params.command : ""), 1), e.active ? (G(), K("div", gh, [(G(!0), K(W, null, yr(e.request.params.choices, (t) => (G(), K("button", {
			key: t,
			class: pe(["w-full rounded-xl bg-[#303030] px-[14px] py-[10px] text-left text-base leading-[1.5] text-white whitespace-normal break-words disabled:opacity-55", t === "deny" ? "text-red-500" : ""]),
			disabled: e.disabled || n.value,
			onMousedown: i[0] ||= jo(() => {}, ["prevent"]),
			onClick: (e) => r(t)
		}, F(t === "once" ? "Allow once" : t === "deny" ? "Deny" : t === "session" ? "Allow for session" : "Always allow"), 43, _h))), 128))])) : X("v-if", !0)], 64));
	}
}), yh = { class: "clarification-card" }, bh = ["disabled"], xh = {
	key: 0,
	class: "clarification-choices"
}, Sh = ["aria-pressed", "onClick"], Ch = { class: "clarification-other" }, wh = ["onUpdate:modelValue", "aria-label"], Th = ["disabled"], Eh = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ U({
	__name: "ClarificationCard",
	props: {
		questions: {},
		disabled: { type: Boolean }
	},
	emits: ["answer"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ V({}), a = /* @__PURE__ */ V({});
		function o() {
			let e = {};
			for (let t of n.questions) {
				let n = i.value[t.qid], r = a.value[t.qid];
				r?.trim() ? e[t.qid] = r : Array.isArray(n) && n.length ? e[t.qid] = n.join(", ") : typeof n == "string" && (e[t.qid] = n);
			}
			return e;
		}
		function s(e, t) {
			if (!n.disabled) {
				if (e.multi_select) {
					let n = i.value[e.qid], r = Array.isArray(n) ? n : [];
					i.value[e.qid] = r.includes(t) ? r.filter((e) => e !== t) : [...r, t];
				} else i.value[e.qid] = t, delete a.value[e.qid], r("answer", o());
			}
		}
		function c() {
			!n.disabled && Object.keys(o()).length && r("answer", o());
		}
		return (t, n) => (G(), K("div", yh, [(G(!0), K(W, null, yr(e.questions, (t) => (G(), K("form", {
			key: t.qid,
			onSubmit: jo(c, ["prevent"])
		}, [J("fieldset", { disabled: e.disabled }, [
			J("legend", null, F(t.question), 1),
			t.choices?.length ? (G(), K("div", xh, [(G(!0), K(W, null, yr(t.choices, (e) => (G(), K("button", {
				key: e,
				type: "button",
				"aria-pressed": t.multi_select ? i.value[t.qid]?.includes(e) ?? !1 : void 0,
				onClick: (n) => s(t, e)
			}, F(e), 9, Sh))), 128))])) : X("v-if", !0),
			J("div", Ch, [On(J("input", {
				"onUpdate:modelValue": (e) => a.value[t.qid] = e,
				placeholder: "Other response",
				"aria-label": t.question + " — Other response"
			}, null, 8, wh), [[xo, a.value[t.qid]]]), J("button", {
				type: "submit",
				disabled: e.disabled || !Object.keys(o()).length
			}, "Send", 8, Th)])
		], 8, bh)], 32))), 128))]));
	}
}), [["__scopeId", "data-v-4672d460"]]), Dh = /* @__PURE__ */ U({
	__name: "ClarificationRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(!1);
		async function r(e) {
			if (!(n.value || t.disabled)) {
				n.value = !0;
				try {
					await t.answer({ answers: e });
				} finally {
					n.value = !1;
				}
			}
		}
		return (t, i) => (G(), q(Eh, {
			questions: e.request.params.questions,
			disabled: e.disabled || n.value,
			onAnswer: r
		}, null, 8, ["questions", "disabled"]));
	}
}), Oh = { class: "block my-3" }, kh = ["aria-label", "disabled"], Ah = ["disabled"], jh = /* @__PURE__ */ U({
	__name: "SecretRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(""), r = /* @__PURE__ */ V(!1);
		async function i() {
			if (!n.value || r.value || t.disabled) return;
			let e = n.value;
			n.value = "", r.value = !0;
			try {
				await t.answer({ value: e });
			} finally {
				r.value = !1;
			}
		}
		return (t, a) => (G(), K(W, null, [J("p", null, F(e.request.params.prompt), 1), J("form", { onSubmit: jo(i, ["prevent"]) }, [J("label", Oh, [Y(F(e.request.params.env_var) + " ", 1), On(J("input", {
			"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
			type: "password",
			autocomplete: "off",
			"aria-label": e.request.params.prompt || "Secret",
			disabled: e.disabled || r.value,
			class: "block w-full rounded-lg bg-[#303030] p-2 text-base"
		}, null, 8, kh), [[xo, n.value]])]), J("button", {
			type: "submit",
			disabled: e.disabled || r.value || !n.value,
			class: "rounded-lg bg-[#303030] p-2 text-base"
		}, " Submit secret ", 8, Ah)], 32)], 64));
	}
}), Mh = { key: 3 }, Nh = /* @__PURE__ */ U({
	__name: "LiveRequest",
	setup(e) {
		let { view: t, scope: n, actions: r } = vc(), { request: i, reconnect: a, active: o } = t, { profile: s, session: c } = n, l = r.answerFor;
		return (e, t) => H(i) ? (G(), K("div", {
			key: JSON.stringify([
				H(s),
				H(c),
				H(i).id
			]),
			class: "notice px-5 py-3 text-sm",
			role: "status"
		}, [H(i).kind === "approval" ? (G(), q(vh, {
			key: 0,
			request: H(i),
			disabled: H(a),
			active: H(o),
			answer: H(l)(H(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"active",
			"answer"
		])) : H(i).kind === "clarify" ? (G(), q(Dh, {
			key: 1,
			request: H(i),
			disabled: H(a),
			answer: H(l)(H(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : H(i).kind === "secret" ? (G(), q(jh, {
			key: 2,
			request: H(i),
			disabled: H(a),
			answer: H(l)(H(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : (G(), K("p", Mh, "This request cannot be displayed. Open it in Hermes."))])) : X("v-if", !0);
	}
}), Ph = { class: "chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden" }, Fh = {
	key: 0,
	class: "pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-dashed border-[#a3a3a3] bg-[#212121]/95 text-lg",
	role: "status"
}, Ih = { class: "chat-content flex min-h-0 flex-1 flex-col overflow-hidden" }, Lh = {
	key: 0,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white",
	role: "status"
}, Rh = {
	key: 1,
	class: "notice px-5 py-3 text-sm text-[#b4b4b4]",
	role: "status"
}, zh = {
	key: 2,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, Bh = { class: "composer-dock shrink-0" }, Vh = /* @__PURE__ */ U({
	__name: "ChatInterface",
	props: {
		showPage: { type: Boolean },
		hideComposer: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(), r = /* @__PURE__ */ V(), i = !1;
		function a() {
			r.value ? r.value.focusLatestMessage() : (n.value?.blurInput(), i = !0);
		}
		Pn(r, (e) => {
			e && i && (i = !1, document.activeElement === document.body && e.focusLatestMessage());
		}, { flush: "post" });
		async function o(e, t) {
			a();
			try {
				await _.send(e, t);
			} finally {
				i = !1;
			}
		}
		async function s(e) {
			a(), await _.steer(e);
		}
		let c = /* @__PURE__ */ V(0);
		function l(e) {
			return !t.showPage && !!e.dataTransfer?.types.includes("Files") && e.composedPath().some((e) => e instanceof HTMLElement && e.classList.contains("app-shell"));
		}
		function u(e) {
			l(e) && (e.preventDefault(), c.value++);
		}
		function d(e) {
			l(e) && e.preventDefault();
		}
		function f() {
			c.value = Math.max(0, c.value - 1);
		}
		function p(e) {
			c.value = 0, l(e) && e.dataTransfer?.files.length && (e.preventDefault(), n.value?.stageFiles(Array.from(e.dataTransfer.files)));
		}
		ar(() => {
			document.addEventListener("dragenter", u), document.addEventListener("dragover", d), document.addEventListener("dragleave", f), document.addEventListener("drop", p);
		}), cr(() => {
			document.removeEventListener("dragenter", u), document.removeEventListener("dragover", d), document.removeEventListener("dragleave", f), document.removeEventListener("drop", p);
		});
		let { view: m, scope: h, composer: g, actions: _ } = vc(), { profile: v, session: y, settingsPage: b, scheduledPage: x, offline: S, canStream: C, models: w, providers: T, modelsLoading: E, model: D, provider: O, defaultModel: k, suggestedPrompt: A } = h, { messages: ee, loading: te, busy: ne, approvalPending: j, active: M, reconnect: re, error: ie, unavailable: ae, connection: oe, status: se } = m;
		return (t, i) => (G(), K("div", Ph, [
			c.value && !e.showPage ? (G(), K("div", Fh, " Drop files to attach ")) : X("v-if", !0),
			J("div", Ih, [
				H(S) ? (G(), K("div", Lh, " You are offline. Messages cannot be loaded or sent. ")) : X("v-if", !0),
				!H(b) && !H(x) && H(re) ? (G(), K("div", Rh, [Y(F(H(oe) === "reconnecting" ? "Reconnecting…" : "Session is read-only until reconnected.") + " ", 1), H(C) && H(oe) === "stale" && !H(S) ? (G(), K("button", {
					key: 0,
					class: "ml-3 underline",
					onClick: i[0] ||= (...e) => H(_).retry && H(_).retry(...e)
				}, " Reconnect ")) : X("v-if", !0)])) : X("v-if", !0),
				!H(b) && !H(x) && H(ie) ? (G(), K("div", zh, [
					Y(F(H(ie)) + " ", 1),
					H(y) ? (G(), K("button", {
						key: 0,
						class: "underline",
						onClick: i[1] ||= (...e) => H(_).retry && H(_).retry(...e)
					}, F(H(re) ? "Retry connection" : "Refresh history"), 1)) : X("v-if", !0),
					H(ae) ? (G(), K("button", {
						key: 1,
						class: "ml-3 underline",
						onClick: i[2] ||= (...e) => H(_).resolve && H(_).resolve(...e)
					}, " Resolve uncertain submission ")) : X("v-if", !0)
				])) : X("v-if", !0),
				e.showPage ? xr(t.$slots, "page", {}, void 0, void 0, 3) : (G(), q(Rm, {
					key: 4,
					ref_key: "transcript",
					ref: r,
					profile: H(v),
					"session-id": H(y),
					messages: H(ee),
					draft: "",
					loading: H(te),
					progress: [],
					thinking: H(ne),
					working: H(ne) || H(j),
					"approval-pending": H(j),
					home: !H(y),
					"status-label": H(se)
				}, {
					request: Dn(() => [Yi(Nh)]),
					_: 1
				}, 8, [
					"profile",
					"session-id",
					"messages",
					"loading",
					"thinking",
					"working",
					"approval-pending",
					"home",
					"status-label"
				]))
			]),
			J("div", Bh, [On((G(), q(hh, {
				ref_key: "picker",
				ref: n,
				profile: H(v),
				"project-name": H(g).projectName,
				key: JSON.stringify([H(v), H(y)]),
				disabled: H(g).disabled,
				models: H(w),
				providers: H(T),
				"models-loading": H(E),
				provider: H(O),
				"onUpdate:provider": H(_).setProvider,
				"default-model": H(k),
				model: H(D),
				"onUpdate:model": H(_).setModel,
				sending: H(ne),
				stoppable: H(M) && !H(re),
				"suggested-prompt": H(A),
				reason: H(g).reason,
				onStop: H(_).stop,
				onSteer: s,
				onSend: o
			}, null, 8, [
				"profile",
				"project-name",
				"disabled",
				"models",
				"providers",
				"models-loading",
				"provider",
				"onUpdate:provider",
				"default-model",
				"model",
				"onUpdate:model",
				"sending",
				"stoppable",
				"suggested-prompt",
				"reason",
				"onStop"
			])), [[za, !H(b) && !e.hideComposer]])])
		]));
	}
}), Hh = [
	"once",
	"session",
	"always",
	"deny"
];
function Uh(e) {
	if (!e) return;
	let { id: t, method: n, params: r } = e;
	return n === "approval" && (r.choices === void 0 || Array.isArray(r.choices) && r.choices.every((e) => Hh.includes(e))) ? {
		kind: "approval",
		id: t,
		params: {
			choices: r.choices || [],
			command: typeof r.command == "string" ? r.command : void 0
		}
	} : n === "clarify" && Array.isArray(r.questions) && r.questions.every((e) => e && typeof e.qid == "string" && typeof e.question == "string" && (e.choices == null || Array.isArray(e.choices) && e.choices.every((e) => typeof e == "string")) && (e.multi_select === void 0 || typeof e.multi_select == "boolean")) ? {
		kind: "clarify",
		id: t,
		params: { questions: r.questions }
	} : n === "secret" && typeof r.prompt == "string" && typeof r.env_var == "string" ? {
		kind: "secret",
		id: t,
		params: {
			prompt: r.prompt,
			env_var: r.env_var
		}
	} : {
		kind: "unsupported",
		id: t
	};
}
//#endregion
//#region src/features/chat/composables/useChatController.ts
function Wh(e, t) {
	let { profile: n, session: r, messages: i, chatLoading: a, chatError: o, canStream: s, scheduledPage: c, projectView: l, projectsPage: u, projectPage: d, settingsPage: f, selectedProject: p, creating: m, offline: h, models: g, providers: _, modelsLoading: v, model: y, provider: b, defaultModel: x, suggestedPrompt: S } = t, C = s, w = Z(() => C.value ? e.messages.value : i.value), T = Z(() => e.busy.value || e.uncertain.value), E = Z(() => C.value ? e.loading.value : a.value), D = Z(() => C.value ? e.error.value : o.value), O = Z(() => !!e.approval.value), k = Z(() => C.value && !!r.value && e.connection.value !== "ready"), A = Z(() => e.uncertain.value), ee = Z(() => e.busy.value);
	async function te(i, a) {
		if (c.value || T.value || m.value || O.value || h.value || !s.value || v.value || (l.value || !r.value) && !await t.createSession()) return;
		let o = t.generation(), u = n.value, d = [{
			type: "text",
			text: i
		}, ...a.flatMap((e) => [{
			type: "text",
			text: e.path ? `Attached ${e.type.startsWith("image/") ? "image" : "file"} ${e.name.replace(/[\r\n]/g, " ")}: ${e.path}` : "📎 " + e.name
		}, ...e.type.startsWith("image/") ? [{
			type: "image_url",
			image_url: { url: e.data }
		}] : []])];
		try {
			await e.submit(i, async () => {
				let e = [{
					type: "text",
					text: i || "Please examine the attached files."
				}];
				for (let n of a) {
					let r = n.path ? { path: n.path } : await Q.upload(u, n);
					if (o !== t.generation()) throw Error("Session changed before submission");
					e.push({
						type: "text",
						text: `Attached ${n.type.startsWith("image/") ? "image" : "file"} ${n.name.replace(/[\r\n]/g, " ")}: ${r.path}`
					}), n.type.startsWith("image/") && e.push({
						type: "image_url",
						image_url: { url: n.data }
					});
				}
				return a.length ? e : i;
			}, {
				model: y.value || x.value,
				provider: b.value || void 0
			}, d);
		} catch (n) {
			o === t.generation() && !e.uncertain.value && (e.error.value = n instanceof Error ? n.message : "Message not submitted", S.value = i);
		}
	}
	async function ne(e, t = []) {
		C.value && await te(e, t);
	}
	async function j() {
		if (C.value) {
			try {
				await e.stop();
			} catch {
				e.error.value = "Could not stop the response.";
			}
			return;
		}
	}
	async function M(t) {
		if (C.value) {
			try {
				await e.steer(t);
			} catch {
				e.error.value = "Response did not accept guidance.";
			}
			return;
		}
	}
	let re = Z(() => {
		let t = e.approval.value;
		return t && typeof t.request_id == "string" && typeof t.kind == "string" ? Uh({
			id: t.request_id,
			method: t.kind,
			params: t
		}) : void 0;
	});
	function ie(e, n) {
		return n === t.generation() && re.value?.id === e;
	}
	async function ae(t, n, r) {
		if (C.value && !k.value && ie(t, r)) try {
			await e.answer(t, { ...n });
		} catch {
			ie(t, r) && (e.error.value = re.value?.kind === "clarify" ? "Clarification could not be settled." : re.value?.kind === "secret" ? "Secret request could not be settled." : "Approval could not be settled.");
		}
	}
	let oe = Z(() => ({
		projectName: !c.value && !u.value && !p.value?.isNoProject ? p.value?.label : void 0,
		disabled: !!(d.value || c.value || u.value || l.value && p.value?.archived || l.value && (!p.value || !p.value.isNoProject && !Is(p.value)) || h.value || m.value || v.value || E.value || O.value || A.value || k.value || !s.value),
		reason: c.value ? "Open a chat to discuss a run." : u.value ? "Select a project or start a new chat." : l.value && p.value?.archived ? "Restore this project to start a new chat." : l.value && p.value && !p.value.isNoProject && !Is(p.value) ? "This Project has no workspace." : h.value ? "Offline · sending is unavailable." : O.value ? "Approval is pending in Hermes." : s.value ? void 0 : "Streaming turns are unavailable for this profile."
	})), se = {
		send: ne,
		stop: j,
		steer: M,
		answerFor: (e) => {
			let n = t.generation();
			return (t) => ae(e, t, n);
		},
		suggest: t.suggest,
		retry: () => k.value ? e.reconnect() : t.retryHistory(),
		resolve: () => e.resolveUncertainty(),
		setModel: (e) => {
			y.value = e;
		},
		setProvider: (e) => {
			b.value = e;
		}
	};
	return {
		view: {
			messages: w,
			busy: T,
			loading: E,
			error: D,
			approvalPending: O,
			reconnect: k,
			unavailable: A,
			active: ee,
			request: re,
			connection: Z(() => e.connection.value),
			status: Z(() => C.value ? e.status.value : "")
		},
		composer: oe,
		actions: se,
		scope: {
			profile: n,
			session: r,
			settingsPage: f,
			scheduledPage: c,
			offline: h,
			canStream: s,
			models: g,
			providers: _,
			modelsLoading: v,
			model: Z(() => y.value),
			provider: Z(() => b.value),
			defaultModel: x,
			suggestedPrompt: Z(() => S.value)
		}
	};
}
//#endregion
//#region src/composables/useDrawerSwipe.ts
var Gh = "button, a, input, textarea, select, label, summary, audio, video, [role=\"button\"], [role=\"link\"], [role=\"slider\"], [role=\"checkbox\"], [role=\"switch\"], [role=\"combobox\"], [role=\"textbox\"], [role=\"menuitem\"], [tabindex]:not([data-chat-message]):not(.transcript), [contenteditable]:not([contenteditable=\"false\"]), .composer, pre, code";
function Kh(e, t, n, r) {
	let i = /* @__PURE__ */ V(null), a, o = 0, s = 0, c = 0, l = 0, u = () => window.matchMedia("(max-width: 700px)").matches;
	function d() {
		a = void 0, i.value = null;
	}
	Pn(e, d, { flush: "sync" });
	function f(r) {
		if (d(), !u() || r.touches.length !== 1) return;
		let i = r.touches[0], l = r.target;
		if (!(i.clientX < 30 || !(l instanceof Element) || l.closest(Gh)) && (e.value || l.closest(".transcript"))) {
			if (l.closest(".scrim")) {
				let e = n()?.getBoundingClientRect();
				if (!e || i.clientY < e.top || i.clientY > e.bottom) return;
			}
			a = {
				id: i.identifier,
				x: i.clientX,
				y: i.clientY,
				open: e.value,
				width: t(),
				locked: !1
			}, o = i.clientX, s = r.timeStamp, c = 0;
		}
	}
	function p(e) {
		if (!a) return;
		if (!u() || e.touches.length !== 1) return d();
		let t = Array.from(e.touches).find((e) => e.identifier === a.id);
		if (!t) return d();
		let n = t.clientX - a.x, r = t.clientY - a.y;
		if (!a.locked) {
			if (Math.max(Math.abs(n), Math.abs(r)) < 10) return;
			if (Math.abs(n) <= Math.abs(r) * 1.25 || (a.open ? n >= 0 : n <= 0)) return d();
			a.locked = !0;
		}
		if (!e.cancelable) return d();
		e.preventDefault(), i.value = Math.max(0, Math.min(a.width, (a.open ? a.width : 0) + n));
		let l = e.timeStamp - s;
		l > 0 && (c = (t.clientX - o) / l), o = t.clientX, s = e.timeStamp;
	}
	function m(e) {
		if (!a) return;
		if (!u() || !a.locked || i.value === null || !Array.from(e.changedTouches).find((e) => e.identifier === a.id)) return d();
		let t = a.open ? a.width - i.value : i.value, n = e.timeStamp - s <= 100 ? c : 0, o = a.open ? -1 : 1, f = n * o >= .5 || n * o > -.5 && t >= a.width * .35 ? !a.open : a.open;
		l = Date.now() + 400, d(), r(f);
	}
	function h(e) {
		Date.now() >= l || (e.preventDefault(), e.stopPropagation());
	}
	return {
		start: f,
		move: p,
		end: m,
		cancel: d,
		click: h,
		dragging: Z(() => i.value !== null),
		sidebarStyle: Z(() => i.value === null ? void 0 : {
			translate: `${i.value - t()}px 0`,
			transition: "none"
		}),
		scrimStyle: Z(() => i.value === null ? void 0 : { opacity: i.value / t() })
	};
}
//#endregion
//#region src/features/settings/composables/useWakeLock.ts
var qh = "chathermes.keep-screen-awake";
function Jh() {
	try {
		return localStorage.getItem(qh) === "true";
	} catch {
		return !1;
	}
}
function Yh() {
	let e = /* @__PURE__ */ V(Jh()), t = /* @__PURE__ */ V(!1), n = !1, r = !0, i = null, a = null, o = 0, s = null;
	function c() {
		return n && r && e.value && document.visibilityState === "visible";
	}
	async function l(e) {
		try {
			e.released || await e.release();
		} catch {}
	}
	function u() {
		o++, s = null;
		let e = i;
		i = null, e && (a && e.removeEventListener("release", a), a = null, l(e));
	}
	async function d() {
		if (!c() || !t.value || i || s !== null) return;
		let e = ++o;
		s = e;
		try {
			let t = await navigator.wakeLock.request("screen");
			if (e !== o || !c()) {
				await l(t);
				return;
			}
			if (t.released) return;
			i = t, a = () => {
				i === t && (a && t.removeEventListener("release", a), a = null, i = null, c() && (o++, d()));
			}, t.addEventListener("release", a);
		} catch {} finally {
			s === e && (s = null);
		}
	}
	function f(t) {
		e.value = t;
		try {
			localStorage.setItem(qh, String(t));
		} catch {}
		t ? d() : u();
	}
	function p() {
		c() ? d() : u();
	}
	function m() {
		r = !1, u();
	}
	function h() {
		r = !0, p();
	}
	return ar(() => {
		n = !0, t.value = typeof navigator.wakeLock?.request == "function", document.addEventListener("visibilitychange", p), window.addEventListener("pagehide", m), window.addEventListener("pageshow", h), d();
	}), lr(() => {
		n = !1, document.removeEventListener("visibilitychange", p), window.removeEventListener("pagehide", m), window.removeEventListener("pageshow", h), u();
	}), {
		enabled: /* @__PURE__ */ Ft(e),
		available: /* @__PURE__ */ Ft(t),
		setEnabled: f
	};
}
//#endregion
//#region node_modules/vue-router/dist/devtools-BLCumUwL.mjs
var Xh = typeof document < "u";
function Zh(e) {
	return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Qh(e) {
	return e.__esModule || e[Symbol.toStringTag] === "Module" || e.default && Zh(e.default);
}
var $h = Object.assign;
function eg(e, t) {
	let n = {};
	for (let r in t) {
		let i = t[r];
		n[r] = ng(i) ? i.map(e) : e(i);
	}
	return n;
}
var tg = () => {}, ng = Array.isArray;
function rg(e, t) {
	let n = {};
	for (let r in e) n[r] = r in t ? t[r] : e[r];
	return n;
}
var ig = /#/g, ag = /&/g, og = /\//g, sg = /=/g, cg = /\?/g, lg = /\+/g, ug = /%5B/g, dg = /%5D/g, fg = /%5E/g, pg = /%60/g, mg = /%7B/g, hg = /%7C/g, gg = /%7D/g, _g = /%20/g;
function vg(e) {
	return e == null ? "" : encodeURI("" + e).replace(hg, "|").replace(ug, "[").replace(dg, "]");
}
function yg(e) {
	return vg(e).replace(mg, "{").replace(gg, "}").replace(fg, "^");
}
function bg(e) {
	return vg(e).replace(lg, "%2B").replace(_g, "+").replace(ig, "%23").replace(ag, "%26").replace(pg, "`").replace(mg, "{").replace(gg, "}").replace(fg, "^");
}
function xg(e) {
	return bg(e).replace(sg, "%3D");
}
function Sg(e) {
	return vg(e).replace(ig, "%23").replace(cg, "%3F");
}
function Cg(e) {
	return Sg(e).replace(og, "%2F");
}
function wg(e) {
	if (e == null) return null;
	try {
		return decodeURIComponent("" + e);
	} catch {}
	return "" + e;
}
function Tg(e, t, n = "/") {
	let r, i = {}, a = "", o = "", s = t.indexOf("#"), c = t.indexOf("?");
	return c = s >= 0 && c > s ? -1 : c, c >= 0 && (r = t.slice(0, c), a = t.slice(c, s > 0 ? s : t.length), i = e(a.slice(1))), s >= 0 && (r ||= t.slice(0, s), o = t.slice(s, t.length)), r = Mg(r ?? t, n), {
		fullPath: r + a + o,
		path: r,
		query: i,
		hash: wg(o)
	};
}
function Eg(e, t) {
	let n = t.query ? e(t.query) : "";
	return t.path + (n && "?") + n + (t.hash || "");
}
function Dg(e, t, n) {
	let r = t.matched.length - 1, i = n.matched.length - 1;
	return r > -1 && r === i && Og(t.matched[r], n.matched[i]) && kg(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function Og(e, t) {
	return (e.aliasOf || e) === (t.aliasOf || t);
}
function kg(e, t) {
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let n in e) if (!Ag(e[n], t[n])) return !1;
	return !0;
}
function Ag(e, t) {
	return ng(e) ? jg(e, t) : ng(t) ? jg(t, e) : e === t;
}
function jg(e, t) {
	return ng(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e.length === 1 && e[0] === t;
}
function Mg(e, t) {
	if (e.startsWith("/")) return e;
	if (!e) return t;
	let n = t.split("/"), r = e.split("/"), i = r[r.length - 1];
	(i === ".." || i === ".") && r.push("");
	let a = n.length - 1, o, s;
	for (o = 0; o < r.length; o++) if (s = r[o], s !== ".") {
		if (s === "..") a > 1 && a--;
		else break;
	}
	return n.slice(0, a).join("/") + "/" + r.slice(o).join("/");
}
var Ng = {
	path: "/",
	name: void 0,
	params: {},
	query: {},
	hash: "",
	fullPath: "/",
	matched: [],
	meta: {},
	redirectedFrom: void 0
}, Pg = /* @__PURE__ */ function(e) {
	return e.pop = "pop", e.push = "push", e;
}({});
function Fg(e, t) {
	let n = document.documentElement.getBoundingClientRect(), r = e.getBoundingClientRect();
	return {
		behavior: t.behavior,
		left: r.left - n.left - (t.left || 0),
		top: r.top - n.top - (t.top || 0)
	};
}
var Ig = () => ({
	left: window.scrollX,
	top: window.scrollY
});
function Lg(e) {
	let t;
	if ("el" in e) {
		let n = e.el, r = typeof n == "string" && n.startsWith("#"), i = typeof n == "string" ? r ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
		if (!i) return;
		t = Fg(i, e);
	} else t = e;
	"scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left == null ? window.scrollX : t.left, t.top == null ? window.scrollY : t.top);
}
function Rg(e, t) {
	return (history.state ? history.state.position - t : -1) + e;
}
var zg = /* @__PURE__ */ new Map();
function Bg(e, t) {
	zg.set(e, t);
}
function Vg(e) {
	let t = zg.get(e);
	return zg.delete(e), t;
}
function Hg(e) {
	return typeof e == "string" || e && typeof e == "object";
}
function Ug(e) {
	return typeof e == "string" || typeof e == "symbol";
}
var Wg = /* @__PURE__ */ function(e) {
	return e[e.MATCHER_NOT_FOUND = 1] = "MATCHER_NOT_FOUND", e[e.NAVIGATION_GUARD_REDIRECT = 2] = "NAVIGATION_GUARD_REDIRECT", e[e.NAVIGATION_ABORTED = 4] = "NAVIGATION_ABORTED", e[e.NAVIGATION_CANCELLED = 8] = "NAVIGATION_CANCELLED", e[e.NAVIGATION_DUPLICATED = 16] = "NAVIGATION_DUPLICATED", e;
}({}), Gg = Symbol("");
Wg.MATCHER_NOT_FOUND, Wg.NAVIGATION_GUARD_REDIRECT, Wg.NAVIGATION_ABORTED, Wg.NAVIGATION_CANCELLED, Wg.NAVIGATION_DUPLICATED;
function Kg(e, t) {
	return $h(/* @__PURE__ */ Error(), {
		type: e,
		[Gg]: !0
	}, t);
}
function qg(e, t) {
	return e instanceof Error && Gg in e && (t == null || !!(e.type & t));
}
function Jg(e) {
	let t = {};
	if (e === "" || e === "?") return t;
	let n = (e[0] === "?" ? e.slice(1) : e).split("&");
	for (let e = 0; e < n.length; ++e) {
		let r = n[e].replace(lg, " "), i = r.indexOf("="), a = wg(i < 0 ? r : r.slice(0, i)), o = i < 0 ? null : wg(r.slice(i + 1));
		if (a in t) {
			let e = t[a];
			ng(e) || (e = t[a] = [e]), e.push(o);
		} else t[a] = o;
	}
	return t;
}
function Yg(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (n = xg(n), r == null) {
			r !== void 0 && (t += (t.length ? "&" : "") + n);
			continue;
		}
		(ng(r) ? r.map((e) => e && bg(e)) : [r && bg(r)]).forEach((e) => {
			e !== void 0 && (t += (t.length ? "&" : "") + n, e != null && (t += "=" + e));
		});
	}
	return t;
}
function Xg(e) {
	let t = {};
	for (let n in e) {
		let r = e[n];
		r !== void 0 && (t[n] = ng(r) ? r.map((e) => e == null ? null : "" + e) : r == null ? r : "" + r);
	}
	return t;
}
var Zg = Symbol(""), Qg = Symbol(""), $g = Symbol(""), e_ = Symbol(""), t_ = Symbol("");
function n_() {
	let e = [];
	function t(t) {
		return e.push(t), () => {
			let n = e.indexOf(t);
			n > -1 && e.splice(n, 1);
		};
	}
	function n() {
		e = [];
	}
	return {
		add: t,
		list: () => e.slice(),
		reset: n
	};
}
function r_(e, t, n, r, i, a = (e) => e()) {
	let o = r && (r.enterCallbacks[i] = r.enterCallbacks[i] || []);
	return () => new Promise((s, c) => {
		let l = (e) => {
			e === !1 ? c(Kg(Wg.NAVIGATION_ABORTED, {
				from: n,
				to: t
			})) : e instanceof Error ? c(e) : Hg(e) ? c(Kg(Wg.NAVIGATION_GUARD_REDIRECT, {
				from: t,
				to: e
			})) : (o && r.enterCallbacks[i] === o && typeof e == "function" && o.push(e), s());
		}, u = a(() => e.call(r && r.instances[i], t, n, l)), d = Promise.resolve(u);
		e.length < 3 && (d = d.then(l)), d.catch((e) => c(e));
	});
}
function i_(e, t, n, r, i = (e) => e()) {
	let a = [];
	for (let o of e) for (let e in o.components) {
		let s = o.components[e];
		if (t === "beforeRouteEnter" || o.instances[e]) {
			if (Zh(s)) {
				let c = (s.__vccOpts || s)[t];
				c && a.push(r_(c, n, r, o, e, i));
			} else {
				let c = s();
				a.push(() => c.then((a) => {
					if (!a) throw Error(`Couldn't resolve component "${e}" at "${o.path}"`);
					let s = Qh(a) ? a.default : a;
					o.mods[e] = a, o.components[e] = s;
					let c = (s.__vccOpts || s)[t];
					return c && r_(c, n, r, o, e, i)();
				}));
			}
		}
	}
	return a;
}
function a_(e, t) {
	let n = [], r = [], i = [], a = Math.max(t.matched.length, e.matched.length);
	for (let o = 0; o < a; o++) {
		let a = t.matched[o];
		a && (e.matched.find((e) => Og(e, a)) ? r.push(a) : n.push(a));
		let s = e.matched[o];
		s && (t.matched.find((e) => Og(e, s)) || i.push(s));
	}
	return [
		n,
		r,
		i
	];
}
//#endregion
//#region node_modules/vue-router/dist/vue-router.mjs
var o_ = /* @__PURE__ */ function(e) {
	return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.Group = 2] = "Group", e;
}({}), s_ = /* @__PURE__ */ function(e) {
	return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.ParamRegExp = 2] = "ParamRegExp", e[e.ParamRegExpEnd = 3] = "ParamRegExpEnd", e[e.EscapeNext = 4] = "EscapeNext", e;
}(s_ || {}), c_ = {
	type: o_.Static,
	value: ""
}, l_ = /[a-zA-Z0-9_]/;
function u_(e) {
	if (!e) return [[]];
	if (e === "/") return [[c_]];
	if (!e.startsWith("/")) throw Error(`Invalid path "${e}"`);
	function t(e) {
		throw Error(`ERR (${n})/"${l}": ${e}`);
	}
	let n = s_.Static, r = n, i = [], a;
	function o() {
		a && i.push(a), a = [];
	}
	let s = 0, c, l = "", u = "";
	function d() {
		l &&= (n === s_.Static ? a.push({
			type: o_.Static,
			value: l
		}) : n === s_.Param || n === s_.ParamRegExp || n === s_.ParamRegExpEnd ? (a.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`), a.push({
			type: o_.Param,
			value: l,
			regexp: u,
			repeatable: c === "*" || c === "+",
			optional: c === "*" || c === "?"
		})) : t("Invalid state to consume buffer"), "");
	}
	function f() {
		l += c;
	}
	for (; s < e.length;) {
		if (c = e[s++], c === "\\" && n !== s_.ParamRegExp) {
			r = n, n = s_.EscapeNext;
			continue;
		}
		switch (n) {
			case s_.Static:
				c === "/" ? (l && d(), o()) : c === ":" ? (d(), n = s_.Param) : f();
				break;
			case s_.EscapeNext:
				f(), n = r;
				break;
			case s_.Param:
				c === "(" ? n = s_.ParamRegExp : l_.test(c) ? f() : (d(), n = s_.Static, c !== "*" && c !== "?" && c !== "+" && s--);
				break;
			case s_.ParamRegExp:
				c === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + c : n = s_.ParamRegExpEnd : u += c;
				break;
			case s_.ParamRegExpEnd:
				d(), n = s_.Static, c !== "*" && c !== "?" && c !== "+" && s--, u = "";
				break;
			default: t("Unknown state");
		}
	}
	return n === s_.ParamRegExp && t(`Unfinished custom RegExp for param "${l}"`), d(), o(), i;
}
var d_ = "[^/]+?", f_ = {
	sensitive: !1,
	strict: !1,
	start: !0,
	end: !0
}, p_ = /* @__PURE__ */ function(e) {
	return e[e._multiplier = 10] = "_multiplier", e[e.Root = 90] = "Root", e[e.Segment = 40] = "Segment", e[e.SubSegment = 30] = "SubSegment", e[e.Static = 40] = "Static", e[e.Dynamic = 20] = "Dynamic", e[e.BonusCustomRegExp = 10] = "BonusCustomRegExp", e[e.BonusWildcard = -50] = "BonusWildcard", e[e.BonusRepeatable = -20] = "BonusRepeatable", e[e.BonusOptional = -8] = "BonusOptional", e[e.BonusStrict = .7000000000000001] = "BonusStrict", e[e.BonusCaseSensitive = .25] = "BonusCaseSensitive", e;
}(p_ || {}), m_ = /[.+*?^${}()[\]/\\]/g;
function h_(e, t) {
	let n = $h({}, f_, t), r = [], i = n.start ? "^" : "", a = [];
	for (let t of e) {
		let e = t.length ? [] : [p_.Root];
		n.strict && !t.length && (i += "/");
		for (let r = 0; r < t.length; r++) {
			let o = t[r], s = p_.Segment + (n.sensitive ? p_.BonusCaseSensitive : 0);
			if (o.type === o_.Static) r || (i += "/"), i += o.value.replace(m_, "\\$&"), s += p_.Static;
			else if (o.type === o_.Param) {
				let { value: e, repeatable: n, optional: c, regexp: l } = o;
				a.push({
					name: e,
					repeatable: n,
					optional: c
				});
				let u = l || d_;
				if (u !== d_) {
					s += p_.BonusCustomRegExp;
					try {
						`${u}`;
					} catch (t) {
						throw Error(`Invalid custom RegExp for param "${e}" (${u}): ` + t.message);
					}
				}
				let d = n ? `((?:${u})(?:/(?:${u}))*)` : `(${u})`;
				r || (d = c && t.length < 2 ? `(?:/${d})` : "/" + d), c && (d += "?"), i += d, s += p_.Dynamic, c && (s += p_.BonusOptional), n && (s += p_.BonusRepeatable), u === ".*" && (s += p_.BonusWildcard);
			}
			e.push(s);
		}
		r.push(e);
	}
	if (n.strict && n.end) {
		let e = r.length - 1;
		r[e][r[e].length - 1] += p_.BonusStrict;
	}
	n.strict || (i += "/?"), n.end ? i += "$" : n.strict && !i.endsWith("/") && (i += "(?:/|$)");
	let o = new RegExp(i, n.sensitive ? "" : "i");
	function s(e) {
		let t = e.match(o), n = {};
		if (!t) return null;
		for (let e = 1; e < t.length; e++) {
			let r = t[e] || "", i = a[e - 1];
			n[i.name] = r && i.repeatable ? r.split("/") : r;
		}
		return n;
	}
	function c(t) {
		let n = "", r = !1;
		for (let i of e) {
			(!r || !n.endsWith("/")) && (n += "/"), r = !1;
			for (let e of i) if (e.type === o_.Static) n += e.value;
			else if (e.type === o_.Param) {
				let { value: a, repeatable: o, optional: s } = e, c = a in t ? t[a] : "";
				if (ng(c) && !o) throw Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);
				let l = ng(c) ? c.join("/") : c;
				if (!l) {
					if (s) i.length < 2 && (n.endsWith("/") ? n = n.slice(0, -1) : r = !0);
					else throw Error(`Missing required param "${a}"`);
				}
				n += l;
			}
		}
		return n || "/";
	}
	return {
		re: o,
		score: r,
		keys: a,
		parse: s,
		stringify: c
	};
}
function g_(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length;) {
		let r = t[n] - e[n];
		if (r) return r;
		n++;
	}
	return e.length < t.length ? e.length === 1 && e[0] === p_.Static + p_.Segment ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === p_.Static + p_.Segment ? 1 : -1 : 0;
}
function __(e, t) {
	let n = 0, r = e.score, i = t.score;
	for (; n < r.length && n < i.length;) {
		let e = g_(r[n], i[n]);
		if (e) return e;
		n++;
	}
	if (Math.abs(i.length - r.length) === 1) {
		if (v_(r)) return 1;
		if (v_(i)) return -1;
	}
	return i.length - r.length;
}
function v_(e) {
	let t = e[e.length - 1];
	return e.length > 0 && t[t.length - 1] < 0;
}
var y_ = {
	strict: !1,
	end: !0,
	sensitive: !1
};
function b_(e, t, n) {
	let r = $h(h_(u_(e.path), n), {
		record: e,
		parent: t,
		children: [],
		alias: []
	});
	return t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r), r;
}
function x_(e, t) {
	let n = [], r = /* @__PURE__ */ new Map();
	t = rg(y_, t);
	function i(e) {
		return r.get(e);
	}
	function a(e, n, r) {
		let i = !r, s = C_(e);
		s.aliasOf = r && r.record;
		let l = rg(t, e), u = [s];
		if ("alias" in e) {
			let t = typeof e.alias == "string" ? [e.alias] : e.alias;
			for (let e of t) u.push(C_($h({}, s, {
				components: r ? r.record.components : s.components,
				path: e,
				aliasOf: r ? r.record : s
			})));
		}
		let d, f;
		for (let t of u) {
			let { path: u } = t;
			if (n && u[0] !== "/") {
				let e = n.record.path, r = e[e.length - 1] === "/" ? "" : "/";
				t.path = n.record.path + (u && r + u);
			}
			if (d = b_(t, n, l), r ? r.alias.push(d) : (f ||= d, f !== d && f.alias.push(d), i && e.name && !T_(d) && o(e.name)), k_(d) && c(d), s.children) {
				let e = s.children;
				for (let t = 0; t < e.length; t++) a(e[t], d, r && r.children[t]);
			}
			r ||= d;
		}
		return f ? () => {
			o(f);
		} : tg;
	}
	function o(e) {
		if (Ug(e)) {
			let t = r.get(e);
			t && (r.delete(e), n.splice(n.indexOf(t), 1), t.children.forEach(o), t.alias.forEach(o));
		} else {
			let t = n.indexOf(e);
			t > -1 && (n.splice(t, 1), e.record.name && r.delete(e.record.name), e.children.forEach(o), e.alias.forEach(o));
		}
	}
	function s() {
		return n;
	}
	function c(e) {
		let t = D_(e, n);
		n.splice(t, 0, e), e.record.name && !T_(e) && r.set(e.record.name, e);
	}
	function l(e, t) {
		let i, a = {}, o, s;
		if ("name" in e && e.name) {
			if (i = r.get(e.name), !i) throw Kg(Wg.MATCHER_NOT_FOUND, { location: e });
			s = i.record.name, a = $h(S_(t.params, i.keys.filter((e) => !e.optional).concat(i.parent ? i.parent.keys.filter((e) => e.optional) : []).map((e) => e.name)), e.params && S_(e.params, i.keys.map((e) => e.name))), o = i.stringify(a);
		} else if (e.path != null) o = e.path, i = n.find((e) => e.re.test(o)), i && (a = i.parse(o), s = i.record.name);
		else {
			if (i = t.name ? r.get(t.name) : n.find((e) => e.re.test(t.path)), !i) throw Kg(Wg.MATCHER_NOT_FOUND, {
				location: e,
				currentLocation: t
			});
			s = i.record.name, a = $h({}, t.params, e.params), o = i.stringify(a);
		}
		let c = [], l = i;
		for (; l;) c.unshift(l.record), l = l.parent;
		return {
			name: s,
			path: o,
			params: a,
			matched: c,
			meta: E_(c)
		};
	}
	e.forEach((e) => a(e));
	function u() {
		n.length = 0, r.clear();
	}
	return {
		addRoute: a,
		resolve: l,
		removeRoute: o,
		clearRoutes: u,
		getRoutes: s,
		getRecordMatcher: i
	};
}
function S_(e, t) {
	let n = {};
	for (let r of t) r in e && (n[r] = e[r]);
	return n;
}
function C_(e) {
	let t = {
		path: e.path,
		redirect: e.redirect,
		name: e.name,
		meta: e.meta || {},
		aliasOf: e.aliasOf,
		beforeEnter: e.beforeEnter,
		props: w_(e),
		children: e.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: "components" in e ? e.components || null : e.component && { default: e.component }
	};
	return Object.defineProperty(t, "mods", { value: {} }), t;
}
function w_(e) {
	let t = {}, n = e.props || !1;
	if ("component" in e) t.default = n;
	else for (let r in e.components) t[r] = typeof n == "object" ? n[r] : n;
	return t;
}
function T_(e) {
	for (; e;) {
		if (e.record.aliasOf) return !0;
		e = e.parent;
	}
	return !1;
}
function E_(e) {
	return e.reduce((e, t) => $h(e, t.meta), {});
}
function D_(e, t) {
	let n = 0, r = t.length;
	for (; n !== r;) {
		let i = n + r >> 1;
		__(e, t[i]) < 0 ? r = i : n = i + 1;
	}
	let i = O_(e);
	return i && (r = t.lastIndexOf(i, r - 1)), r;
}
function O_(e) {
	let t = e;
	for (; t = t.parent;) if (k_(t) && __(e, t) === 0) return t;
}
function k_({ record: e }) {
	return !!(e.name || e.components && Object.keys(e.components).length || e.redirect);
}
function A_(e) {
	let t = jn($g), n = jn(e_), r = Z(() => {
		let n = H(e.to);
		return t.resolve(n);
	}), i = Z(() => {
		let { matched: e } = r.value, { length: t } = e, i = e[t - 1], a = n.matched;
		if (!i || !a.length) return -1;
		let o = a.findIndex(Og.bind(null, i));
		if (o > -1) return o;
		let s = F_(e[t - 2]);
		return t > 1 && F_(i) === s && a[a.length - 1].path !== s ? a.findIndex(Og.bind(null, e[t - 2])) : o;
	}), a = Z(() => i.value > -1 && P_(n.params, r.value.params)), o = Z(() => i.value > -1 && i.value === n.matched.length - 1 && kg(n.params, r.value.params));
	function s(n = {}) {
		if (N_(n)) {
			let n = t[H(e.replace) ? "replace" : "push"](H(e.to)).catch(tg);
			return e.viewTransition && typeof document < "u" && "startViewTransition" in document && document.startViewTransition(() => n), n;
		}
		return Promise.resolve();
	}
	return {
		route: r,
		href: Z(() => r.value.href),
		isActive: a,
		isExactActive: o,
		navigate: s
	};
}
function j_(e) {
	return e.length === 1 ? e[0] : e;
}
var M_ = /* @__PURE__ */ U({
	name: "RouterLink",
	compatConfig: { MODE: 3 },
	props: {
		to: {
			type: [String, Object],
			required: !0
		},
		replace: Boolean,
		activeClass: String,
		exactActiveClass: String,
		custom: Boolean,
		ariaCurrentValue: {
			type: String,
			default: "page"
		},
		viewTransition: Boolean
	},
	useLink: A_,
	setup(e, { slots: t }) {
		let n = /* @__PURE__ */ Nt(A_(e)), { options: r } = jn($g), i = Z(() => ({
			[I_(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive,
			[I_(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
		}));
		return () => {
			let r = t.default && j_(t.default(n));
			return e.custom ? r : Ta("a", {
				"aria-current": n.isExactActive ? e.ariaCurrentValue : null,
				href: n.href,
				onClick: n.navigate,
				class: i.value
			}, r);
		};
	}
});
function N_(e) {
	if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && (e.button === void 0 || e.button === 0)) {
		if (e.currentTarget && e.currentTarget.getAttribute) {
			let t = e.currentTarget.getAttribute("target");
			if (/\b_blank\b/i.test(t)) return;
		}
		return e.preventDefault && e.preventDefault(), !0;
	}
}
function P_(e, t) {
	for (let n in t) {
		let r = t[n], i = e[n];
		if (typeof r == "string") {
			if (r !== i) return !1;
		} else if (!ng(i) || i.length !== r.length || r.some((e, t) => e !== i[t])) return !1;
	}
	return !0;
}
function F_(e) {
	return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
var I_ = (e, t, n) => e ?? t ?? n, L_ = /* @__PURE__ */ U({
	name: "RouterView",
	inheritAttrs: !1,
	props: {
		name: {
			type: String,
			default: "default"
		},
		route: Object
	},
	compatConfig: { MODE: 3 },
	setup(e, { attrs: t, slots: n }) {
		let r = jn(t_), i = Z(() => e.route || r.value), a = jn(Qg, 0), o = Z(() => {
			let e = H(a), { matched: t } = i.value, n;
			for (; (n = t[e]) && !n.components;) e++;
			return e;
		}), s = Z(() => i.value.matched[o.value]);
		An(Qg, Z(() => o.value + 1)), An(Zg, s), An(t_, i);
		let c = /* @__PURE__ */ V();
		return Pn(() => [
			c.value,
			s.value,
			e.name
		], ([e, t, n], [r, i, a]) => {
			t && (t.instances[n] = e, i && i !== t && e && e === r && (t.leaveGuards.size || (t.leaveGuards = i.leaveGuards), t.updateGuards.size || (t.updateGuards = i.updateGuards))), e && t && (!i || !Og(t, i) || !r) && (t.enterCallbacks[n] || []).forEach((t) => t(e));
		}, { flush: "post" }), () => {
			let r = i.value, a = e.name, o = s.value, l = o && o.components[a];
			if (!l) return R_(n.default, {
				Component: l,
				route: r
			});
			let u = o.props[a], d = Ta(l, $h({}, u ? u === !0 ? r.params : typeof u == "function" ? u(r) : u : null, t, {
				onVnodeUnmounted: (e) => {
					e.component.isUnmounted && (o.instances[a] = null);
				},
				ref: c
			}));
			return R_(n.default, {
				Component: d,
				route: r
			}) || d;
		};
	}
});
function R_(e, t) {
	if (!e) return null;
	let n = e(t);
	return n.length === 1 ? n[0] : n;
}
var z_ = L_;
function B_(e) {
	let t = x_(e.routes, e), n = e.parseQuery || Jg, r = e.stringifyQuery || Yg, i = e.history, a = n_(), o = n_(), s = n_(), c = /* @__PURE__ */ Wt(Ng), l = Ng;
	Xh && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
	let u = eg.bind(null, (e) => "" + e), d = eg.bind(null, Cg), f = eg.bind(null, wg);
	function p(e, n) {
		let r, i;
		return Ug(e) ? (r = t.getRecordMatcher(e), i = n) : i = e, t.addRoute(i, r);
	}
	function m(e) {
		let n = t.getRecordMatcher(e);
		n && t.removeRoute(n);
	}
	function h() {
		return t.getRoutes().map((e) => e.record);
	}
	function g(e) {
		return !!t.getRecordMatcher(e);
	}
	function _(e, a) {
		if (a = $h({}, a || c.value), typeof e == "string") {
			let r = Tg(n, e, a.path), o = t.resolve({ path: r.path }, a), s = i.createHref(r.fullPath);
			return $h(r, o, {
				params: f(o.params),
				hash: wg(r.hash),
				redirectedFrom: void 0,
				href: s
			});
		}
		let o;
		if (e.path != null) o = $h({}, e, { path: Tg(n, e.path, a.path).path });
		else {
			let t = $h({}, e.params);
			for (let e in t) t[e] ?? delete t[e];
			o = $h({}, e, { params: d(t) }), a.params = d(a.params);
		}
		let s = t.resolve(o, a), l = e.hash || "";
		s.params = u(f(s.params));
		let p = Eg(r, $h({}, e, {
			hash: yg(l),
			path: s.path
		})), m = i.createHref(p);
		return $h({
			fullPath: p,
			hash: l,
			query: r === Yg ? Xg(e.query) : e.query || {}
		}, s, {
			redirectedFrom: void 0,
			href: m
		});
	}
	function v(e) {
		return typeof e == "string" ? Tg(n, e, c.value.path) : $h({}, e);
	}
	function y(e, t) {
		if (l !== e) return Kg(Wg.NAVIGATION_CANCELLED, {
			from: t,
			to: e
		});
	}
	function b(e) {
		return C(e);
	}
	function x(e) {
		return b($h(v(e), { replace: !0 }));
	}
	function S(e, t) {
		let n = e.matched[e.matched.length - 1];
		if (n && n.redirect) {
			let { redirect: r } = n, i = typeof r == "function" ? r(e, t) : r;
			return typeof i == "string" && (i = i.includes("?") || i.includes("#") ? i = v(i) : { path: i }, i.params = {}), $h({
				query: e.query,
				hash: e.hash,
				params: i.path == null ? e.params : {}
			}, i);
		}
	}
	function C(e, t) {
		let n = l = _(e), i = c.value, a = e.state, o = e.force, s = e.replace === !0, u = S(n, i);
		if (u) return C($h(v(u), {
			state: typeof u == "object" ? $h({}, a, u.state) : a,
			force: o,
			replace: s
		}), t || n);
		let d = n;
		d.redirectedFrom = t;
		let f;
		return !o && Dg(r, i, n) && (f = Kg(Wg.NAVIGATION_DUPLICATED, {
			to: d,
			from: i
		}), ie(i, i, !0, !1)), (f ? Promise.resolve(f) : E(d, i)).catch((e) => qg(e) ? qg(e, Wg.NAVIGATION_GUARD_REDIRECT) ? e : re(e) : j(e, d, i)).then((e) => {
			if (e) {
				if (qg(e, Wg.NAVIGATION_GUARD_REDIRECT)) return C($h({ replace: s }, v(e.to), {
					state: typeof e.to == "object" ? $h({}, a, e.to.state) : a,
					force: o
				}), t || d);
			} else e = O(d, i, !0, s, a);
			return D(d, i, e), e;
		});
	}
	function w(e, t) {
		let n = y(e, t);
		return n ? Promise.reject(n) : Promise.resolve();
	}
	function T(e) {
		let t = se.values().next().value;
		return t && typeof t.runWithContext == "function" ? t.runWithContext(e) : e();
	}
	function E(e, t) {
		let n, [r, i, s] = a_(e, t);
		n = i_(r.reverse(), "beforeRouteLeave", e, t);
		for (let i of r) i.leaveGuards.forEach((r) => {
			n.push(r_(r, e, t));
		});
		let c = w.bind(null, e, t);
		return n.push(c), le(n).then(() => {
			n = [];
			for (let r of a.list()) n.push(r_(r, e, t));
			return n.push(c), le(n);
		}).then(() => {
			n = i_(i, "beforeRouteUpdate", e, t);
			for (let r of i) r.updateGuards.forEach((r) => {
				n.push(r_(r, e, t));
			});
			return n.push(c), le(n);
		}).then(() => {
			n = [];
			for (let r of s) if (r.beforeEnter) {
				if (ng(r.beforeEnter)) for (let i of r.beforeEnter) n.push(r_(i, e, t));
				else n.push(r_(r.beforeEnter, e, t));
			}
			return n.push(c), le(n);
		}).then(() => (e.matched.forEach((e) => e.enterCallbacks = {}), n = i_(s, "beforeRouteEnter", e, t, T), n.push(c), le(n))).then(() => {
			n = [];
			for (let r of o.list()) n.push(r_(r, e, t));
			return n.push(c), le(n);
		}).catch((e) => qg(e, Wg.NAVIGATION_CANCELLED) ? e : Promise.reject(e));
	}
	function D(e, t, n) {
		s.list().forEach((r) => T(() => r(e, t, n)));
	}
	function O(e, t, n, r, a) {
		let o = y(e, t);
		if (o) return o;
		let s = t === Ng, l = Xh ? history.state : {};
		n && (r || s ? i.replace(e.fullPath, $h({ scroll: s && l && l.scroll }, a)) : i.push(e.fullPath, a)), c.value = e, ie(e, t, n, s), re();
	}
	let k;
	function A() {
		k ||= i.listen((e, t, n) => {
			if (!ce.listening) return;
			let r = _(e), a = S(r, ce.currentRoute.value);
			if (a) {
				C($h(a, {
					replace: !0,
					force: !0
				}), r).catch(tg);
				return;
			}
			l = r;
			let o = c.value;
			Xh && Bg(Rg(o.fullPath, n.delta), Ig()), E(r, o).catch((e) => qg(e, Wg.NAVIGATION_ABORTED | Wg.NAVIGATION_CANCELLED) ? e : qg(e, Wg.NAVIGATION_GUARD_REDIRECT) ? (C($h(v(e.to), { force: !0 }), r).then((e) => {
				qg(e, Wg.NAVIGATION_ABORTED | Wg.NAVIGATION_DUPLICATED) && !n.delta && n.type === Pg.pop && i.go(-1, !1);
			}).catch(tg), Promise.reject()) : (n.delta && i.go(-n.delta, !1), j(e, r, o))).then((e) => {
				e ||= O(r, o, !1), e && (n.delta && !qg(e, Wg.NAVIGATION_CANCELLED) ? i.go(-n.delta, !1) : n.type === Pg.pop && qg(e, Wg.NAVIGATION_ABORTED | Wg.NAVIGATION_DUPLICATED) && i.go(-1, !1)), D(r, o, e);
			}).catch(tg);
		});
	}
	let ee = n_(), te = n_(), ne;
	function j(e, t, n) {
		re(e);
		let r = te.list();
		return r.length ? r.forEach((r) => r(e, t, n)) : console.error(e), Promise.reject(e);
	}
	function M() {
		return ne && c.value !== Ng ? Promise.resolve() : new Promise((e, t) => {
			ee.add([e, t]);
		});
	}
	function re(e) {
		return ne || (ne = !e, A(), ee.list().forEach(([t, n]) => e ? n(e) : t()), ee.reset()), e;
	}
	function ie(t, n, r, i) {
		let { scrollBehavior: a } = e;
		if (!Xh || !a) return Promise.resolve();
		let o = !r && Vg(Rg(t.fullPath, 0)) || (i || !r) && history.state && history.state.scroll || null;
		return hn().then(() => a(t, n, o)).then((e) => e && Lg(e)).catch((e) => j(e, t, n));
	}
	let ae = (e) => i.go(e), oe, se = /* @__PURE__ */ new Set(), ce = {
		currentRoute: c,
		listening: !0,
		addRoute: p,
		removeRoute: m,
		clearRoutes: t.clearRoutes,
		hasRoute: g,
		getRoutes: h,
		resolve: _,
		options: e,
		push: b,
		replace: x,
		go: ae,
		back: () => ae(-1),
		forward: () => ae(1),
		beforeEach: a.add,
		beforeResolve: o.add,
		afterEach: s.add,
		onError: te.add,
		isReady: M,
		install(e) {
			e.component("RouterLink", M_), e.component("RouterView", z_), e.config.globalProperties.$router = ce, Object.defineProperty(e.config.globalProperties, "$route", {
				enumerable: !0,
				get: () => H(c)
			}), Xh && !oe && c.value === Ng && (oe = !0, b(i.location).catch((e) => {}));
			let t = {};
			for (let e in Ng) Object.defineProperty(t, e, {
				get: () => c.value[e],
				enumerable: !0
			});
			e.provide($g, ce), e.provide(e_, /* @__PURE__ */ Pt(t)), e.provide(t_, c);
			let n = e.unmount;
			se.add(e), e.unmount = function() {
				se.delete(e), se.size < 1 && (l = Ng, k && k(), k = null, c.value = Ng, oe = !1, ne = !1), n();
			};
		}
	};
	function le(e) {
		return e.reduce((e, t) => e.then(() => T(t)), Promise.resolve());
	}
	return ce;
}
function V_() {
	return jn($g);
}
function H_(e) {
	return jn(e_);
}
//#endregion
//#region src/router/links.ts
var U_ = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
function W_(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 4096 && !Array.from(e).some((e) => e.charCodeAt(0) < 32 || e === "?" || e === "#") && !e.split(/[\\/]/).some((e) => e === "." || e === "..");
}
var G_ = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
function K_(e) {
	return typeof e == "string" ? e : "";
}
function q_(e) {
	if (typeof e != "string" || !e.startsWith("/") || e.startsWith("//") || /[\\#\r\n]/.test(e)) return "/";
	let t = new URL(e, "https://plugin.invalid");
	return t.pathname === "/settings" || !/^\/(?:chat\/[^/]+|artifacts|projects(?:\/[^/]+(?:\/(?:artifacts|settings|instructions))?)?|scheduled(?:\/[^/]+(?:\/[^/]+)?)?)?$/.test(t.pathname) ? "/" : t.pathname + t.search;
}
function J_(e, t = "", n = "", r = "", i = {}) {
	return {
		name: e,
		query: {
			...t ? { profile: t } : {},
			...n ? { session: n } : {},
			...r ? { project: r } : {},
			...i
		}
	};
}
function Y_(e, t = window.location.origin) {
	try {
		let n = new URL(e, t);
		if (n.origin === t && n.pathname === "/chathermes" && n.hash.startsWith("#/")) return n.hash.slice(1);
	} catch {}
}
//#endregion
//#region src/App.vue?vue&type=script&setup=true&lang.ts
var X_ = { class: "app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white" }, Z_ = { class: "brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold" }, Q_ = { class: "sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, $_ = { class: "drawer-account flex min-w-0 items-center gap-2" }, ev = ["value"], tv = ["value"], nv = ["value"], rv = ["disabled"], iv = ["aria-current"], av = { class: "main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden" }, ov = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, sv = ["aria-expanded"], cv = { class: "min-w-0 flex-1" }, lv = { class: "header-title truncate text-base font-medium" }, uv = {
	key: 0,
	class: "header-project-subtitle truncate text-xs text-[#a3a3a3]"
}, dv = { class: "topbar-profile sr-only" }, fv = ["aria-expanded"], pv = {
	class: "truncate px-3 py-2 text-xs text-[#a3a3a3]",
	role: "presentation"
}, mv = ["disabled"], hv = ["disabled"], gv = ["disabled"], _v = ["disabled"], vv = ["aria-checked"], yv = ["aria-checked"], bv = ["disabled"], xv = ["disabled"], Sv = ["disabled"], Cv = ["disabled"], wv = { id: "project-confirmation-text" }, Tv = {
	key: 0,
	role: "alert",
	class: "project-error"
}, Ev = { class: "project-actions" }, Dv = ["disabled"], Ov = ["disabled"], kv = /* @__PURE__ */ U({
	__name: "App",
	setup(e) {
		let t = V_(), n = H_(), r = Z(() => String(n.name || "home")), i = Z(() => r.value === "artifacts"), a = Z(() => r.value === "project-artifacts"), o = Z(() => r.value.startsWith("scheduled")), s = Z(() => r.value === "projects"), c = Z(() => [
			"project",
			"project-artifacts",
			"project-settings",
			"project-instructions"
		].includes(r.value)), l = Z(() => r.value === "project-settings" ? "edit" : r.value === "project-instructions" ? "instructions" : ""), u = Z(() => n.query.archived === "1"), d = Z(() => r.value === "settings"), f = 0, p = !1, m = !1, h = Promise.resolve(), g = Promise.resolve(), _ = "";
		async function v(e, n = !1, r = !1) {
			_ = r ? t.resolve(e).fullPath : "", r || (I.value = !1), Rt(!1), f++, await t[n ? "replace" : "push"](e), await g, _ = "";
		}
		function y(e, t = {}) {
			return J_(e, N.value, P.value, O.value, t);
		}
		let b = /* @__PURE__ */ V(null), x = /* @__PURE__ */ V("");
		async function S(e) {
			if (xe.value || De.value) return;
			let t = N.value, n = R, r = f;
			De.value = !0, x.value = "";
			try {
				let i = await Q.create(t);
				if (Ye(t, i), n !== R || t !== N.value || r !== f || !o.value) return;
				await At(i.id, ""), n === R && t === N.value && P.value === i.id && (Me.value = e);
			} catch {
				n === R && t === N.value && (x.value = "Could not open a chat. Please try again.");
			} finally {
				n === R && (De.value = !1);
			}
		}
		function C(e) {
			b.value = e;
		}
		let w = /* @__PURE__ */ V(), T = /* @__PURE__ */ V(), E = /* @__PURE__ */ V(!1), D = /* @__PURE__ */ V(""), O = /* @__PURE__ */ V(""), k = /* @__PURE__ */ V([]), A = /* @__PURE__ */ V(), ee = /* @__PURE__ */ V(!1), te = /* @__PURE__ */ V(!1), ne = /* @__PURE__ */ V(""), j = /* @__PURE__ */ V(""), M = /* @__PURE__ */ V([]), re = /* @__PURE__ */ V(!1), ie = Z(() => (c.value || !!P.value) && !s.value && !o.value && !!O.value && !!A.value && !A.value.isNoProject), ae = Z(() => O.value ? A.value ? Ls(A.value) : [] : me.value.filter((e) => !M.value.includes(e.id))), oe, se;
		function le() {
			oe?.(), oe = void 0, typeof EventSource < "u" && (oe = Q.projectEvents(N.value, ue));
		}
		function ue() {
			clearTimeout(se), se = setTimeout(() => {
				it(), O.value && ot();
			}, 100);
		}
		let de, fe, N = /* @__PURE__ */ V(""), P = /* @__PURE__ */ V(""), me = /* @__PURE__ */ V([]), he = /* @__PURE__ */ V([]), ge = /* @__PURE__ */ V({}), _e = /* @__PURE__ */ V(0), ve = /* @__PURE__ */ V(!1), ye = /* @__PURE__ */ V(!1), be = /* @__PURE__ */ V(!1), xe = /* @__PURE__ */ V(!navigator.onLine), Se = /* @__PURE__ */ V(""), Ce = /* @__PURE__ */ V(""), I = /* @__PURE__ */ V(!1), we = /* @__PURE__ */ V([]), Te = /* @__PURE__ */ V([]), L = /* @__PURE__ */ V(""), Ee = /* @__PURE__ */ V(""), De = /* @__PURE__ */ V(!1), Oe = /* @__PURE__ */ V([]), ke = /* @__PURE__ */ V(""), Ae = /* @__PURE__ */ V(!1), je = /* @__PURE__ */ V(!1), Me = /* @__PURE__ */ V(""), Ne = /* @__PURE__ */ V(null), Pe = /* @__PURE__ */ V(null), Fe = /* @__PURE__ */ V(null), Ie = /* @__PURE__ */ V(!1), Le = /* @__PURE__ */ V(null), Re = Z(() => ge.value.features?.native_chat === !0), ze, Be, Ve = 0, R = 0, He = /* @__PURE__ */ V({
			supported: !1,
			permission: "unsupported",
			subscribed: !1,
			available: !1,
			error: ""
		}), Ue = /* @__PURE__ */ V(!1), We = /* @__PURE__ */ V(!1), Ge = /* @__PURE__ */ V(""), Ke = 0, qe = /* @__PURE__ */ V(null), Je = /* @__PURE__ */ new Map();
		function Ye(e, t) {
			let n = Je.get(e);
			n || Je.set(e, n = /* @__PURE__ */ new Map());
			let r = typeof t == "string" ? { id: t } : t, i = {
				...n.get(r.id),
				...r
			};
			n.set(i.id, i), e === N.value && (me.value = [i, ...me.value.filter((e) => e.id !== i.id)]);
		}
		function Xe(e, t, n) {
			let r = Je.get(e)?.get(t);
			r && (r.title = n, e === N.value && (me.value = [r, ...me.value.filter((e) => e.id !== t)]));
		}
		let Ze = Fs(() => {
			ue(), gt();
		}, Ye, Xe);
		_c(Wh(Ze, {
			profile: N,
			session: P,
			messages: he,
			chatLoading: be,
			chatError: Ce,
			canStream: Re,
			scheduledPage: o,
			projectView: c,
			projectsPage: s,
			projectPage: l,
			settingsPage: d,
			selectedProject: A,
			creating: De,
			offline: xe,
			models: Te,
			providers: Oe,
			modelsLoading: Ae,
			model: L,
			provider: ke,
			defaultModel: Ee,
			suggestedPrompt: Me,
			generation: () => Ve,
			createSession: bt,
			suggest: xt,
			retryHistory: _t
		}));
		let Qe = Yh(), $e = Re;
		function et(e) {
			return v({
				...y(e ? "project-artifacts" : "project"),
				params: { projectId: O.value }
			});
		}
		function tt() {
			Ze.close(), Ve++, Be?.abort(), be.value = !1;
		}
		function nt() {
			tt(), ze?.abort(), ye.value = !1;
		}
		let rt = Promise.resolve();
		function it() {
			return rt = at(), rt;
		}
		async function at() {
			de?.abort();
			let e = new AbortController();
			de = e;
			let t = N.value;
			ee.value = !re.value, ne.value = "";
			try {
				let n = await Q.projects(t, e.signal);
				if (e !== de || t !== N.value) return;
				if (!Array.isArray(n.projects) || n.projects.some((e) => !e || typeof e.id != "string" || typeof e.label != "string")) throw Error("Invalid Hermes Projects response");
				k.value = n.projects, M.value = n.scoped_session_ids || [], re.value = !0;
			} catch {
				e === de && !e.signal.aborted && (ne.value = "Could not load Projects.");
			} finally {
				e === de && (ee.value = !1);
			}
		}
		async function ot() {
			fe?.abort();
			let e = new AbortController();
			fe = e;
			let t = N.value, n = O.value;
			if (n) {
				te.value = !A.value, j.value = "";
				try {
					let r = await Q.project(t, n, e.signal);
					e === fe && !e.signal.aborted && t === N.value && n === O.value && (A.value = r);
				} catch (t) {
					e === fe && !e.signal.aborted && (j.value = t instanceof Ho && t.status === 404 ? "Project no longer exists. Return to Other chats." : "Could not load this Project. Retry or return to Other chats.");
				} finally {
					e === fe && (te.value = !1);
				}
			}
		}
		async function st(e) {
			return v(e ? {
				...y("project", { project: e }),
				params: { projectId: e }
			} : J_("home", N.value, P.value));
		}
		function ct(e = !1) {
			return v(y("projects", e ? { archived: "1" } : {}));
		}
		async function lt(e) {
			let t = ++f, n = N.value;
			if (re.value || await it(), t !== f || n !== N.value) return;
			let r = k.value.find((t) => t.sessionIds?.includes(e) || Ls(t).some((t) => t.id === e));
			return v({
				name: "chat",
				params: { sessionId: e },
				query: {
					...n ? { profile: n } : {},
					...r ? { project: r.id } : {}
				}
			});
		}
		async function ut() {
			return await bt(!0);
		}
		function dt(e) {
			if (A.value && !A.value.isNoProject) return v({
				...y(e === "edit" ? "project-settings" : "project-instructions"),
				params: { projectId: O.value }
			});
		}
		async function ft(e) {
			w.value = e, Rt(!1), await hn(), T.value?.focus();
		}
		function pt() {
			w.value = void 0, Fe.value?.focus();
		}
		async function mt() {
			let e = w.value;
			e && (await ht(e, { id: O.value }), D.value || (w.value = void 0));
		}
		async function ht(e, t) {
			if (E.value || xe.value) return;
			let n = N.value, r = R, i = O.value, a = f;
			E.value = !0, D.value = "";
			try {
				let o = await Q.projectManage(n, e, t);
				if (r !== R || n !== N.value || a !== f) return;
				e === "create" && o.project?.id ? await st(o.project.id) : i === O.value && !s.value && (e === "delete" ? (O.value = "", A.value = void 0, ct(u.value)) : e === "archive" ? (O.value = "", A.value = void 0, ct(t.restore !== !0)) : await ot()), r === R && (await it(), await gt());
			} catch {
				r === R && n === N.value && (D.value = "Could not save the project. Check its fields and try again.");
			} finally {
				r === R && (E.value = !1);
			}
		}
		async function gt(e = !1) {
			ze?.abort();
			let t = new AbortController();
			ze = t;
			let n = N.value;
			ye.value = !0, Se.value = "";
			try {
				let r = await Q.sessions(n, e ? _e.value : 0, t.signal);
				if (t !== ze || n !== N.value) return;
				let i = r.sessions, a = Je.get(n);
				for (let e of i) a?.delete(e.id);
				let o = [...a?.values() || []].reverse();
				me.value = e ? [...me.value.map((e) => i.find((t) => t.id === e.id) || e), ...i.filter((e) => !me.value.some((t) => t.id === e.id))] : [...o, ...i], _e.value = typeof r.offset == "number" && typeof r.limit == "number" ? r.offset + r.limit : e ? _e.value + i.length : i.length, ve.value = r.has_more ?? (typeof r.total == "number" ? _e.value < r.total : i.length === 30);
			} catch (e) {
				t === ze && !t.signal.aborted && (Se.value = e instanceof Error ? e.message : "Could not load sessions");
			} finally {
				t === ze && (ye.value = !1, ze = void 0);
			}
		}
		async function _t() {
			if (!P.value) return !1;
			if ($e.value) return await Ze.hydrate(), !0;
			Be?.abort();
			let e = new AbortController();
			Be = e;
			let t = Ve;
			be.value = !0, Ce.value = "";
			try {
				let n = await Q.messages(N.value, P.value, e.signal);
				if (t === Ve && e === Be) return he.value = n, !0;
			} catch (n) {
				t === Ve && !e.signal.aborted && (Ce.value = n instanceof Error ? n.message : "Could not load messages");
			} finally {
				e === Be && (be.value = !1);
			}
			return !1;
		}
		async function vt(e) {
			if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
				Se.value = "Invalid profile name";
				return;
			}
			Me.value = "", De.value = !1, Ct.value = !1, wt++, w.value = void 0, re.value = !1, oe?.(), oe = void 0, clearTimeout(se), M.value = [], nt(), de?.abort(), fe?.abort(), O.value = "", E.value = !1, D.value = "", A.value = void 0, k.value = [], j.value = "", ne.value = "", te.value = !1, N.value = e, P.value = "", me.value = [], he.value = [], ge.value = {}, Te.value = [], Oe.value = [], ke.value = "", L.value = "", Ee.value = "", Ae.value = !0, Se.value = "", Ce.value = "", _e.value = 0, ve.value = !1;
			let t = ++R;
			le(), it(), gt(), Promise.allSettled([Q.models(e), Q.modelOptions(e)]).then(([e, n]) => {
				t === R && (e.status === "fulfilled" && (Te.value = e.value.data || [], Ee.value = e.value.default_model || ""), n.status === "fulfilled" && Array.isArray(n.value.providers) && (Oe.value = n.value.providers.filter((e) => e.models.length || e.is_current), ke.value = Oe.value.find((e) => e.is_current)?.slug || n.value.provider || "", Ee.value = n.value.model || Ee.value), Ae.value = !1);
			});
			try {
				let n = await Q.capabilities(e);
				t === R && N.value === e && (ge.value = n);
			} catch {
				t === R && N.value === e && (ge.value = {});
			}
		}
		async function yt(e) {
			(Q.isNative(N.value) || O.value || me.value.find((t) => t.id === e)?.cwd || me.value.find((t) => t.id === e)?.source === "desktop") && Q.workspace(N.value, e), w.value = void 0, Me.value = "", tt(), P.value = e, he.value = [], Ce.value = "", I.value = !1;
			let t = Ve, n = N.value;
			if (!O.value && !Q.isWorkspace(n, e)) {
				try {
					await Q.session(n, e);
				} catch {}
				if (t !== Ve || n !== N.value) return;
			}
			$e.value ? await Ze.attach(n, e) : await _t();
		}
		async function bt(e = !1) {
			if (xe.value || De.value || !e && O.value && A.value?.archived) return;
			let t = N.value, n = e ? "" : O.value, r = P.value, i = f, a = Ve, o = R;
			De.value = !0;
			try {
				n && !ke.value && (ke.value = Oe.value.find((e) => e.is_current)?.slug || "", L.value = "");
				let e = n ? await Q.projectCreate(t, n) : await Q.create(t);
				return a !== Ve || N.value !== t || P.value !== r || i !== f || (await At(e.id, n), ue(), N.value !== t || P.value !== e.id) ? void 0 : e.id;
			} catch (e) {
				if (a === Ve && i === f && N.value === t && O.value === n) {
					let t = e instanceof Error ? e.message : "Could not create session";
					n ? j.value = t : Se.value = t;
				}
			} finally {
				o === R && (De.value = !1);
			}
		}
		async function xt(e) {
			let t = Ve, n = N.value, r = await bt();
			r && t + 1 === Ve && n === N.value && P.value === r && (Me.value = e);
		}
		async function St(e, t) {
			let n = N.value, r = Ve;
			try {
				if (await Q.rename(n, e, t), r !== Ve || n !== N.value) return;
				let i = me.value.find((t) => t.id === e);
				i && (i.title = t), ue();
			} catch (e) {
				r === Ve && n === N.value && (Se.value = e instanceof Error ? e.message : "Could not rename session");
			}
		}
		let Ct = /* @__PURE__ */ V(!1), wt = 0;
		async function Tt(e, t, n = "") {
			if (xe.value || Ct.value) return;
			let r = N.value, i = Ve, a = ++wt;
			Ct.value = !0;
			try {
				if (e === "archive" ? await Q.archive(r, t) : e === "delete" ? await Q.deleteSession(r, t) : await Q.moveSession(r, t, n), e !== "project" && Je.get(r)?.delete(t), i !== Ve || r !== N.value) return;
				P.value === t && (e === "project" ? await v({
					name: "chat",
					params: { sessionId: t },
					query: {
						...r ? { profile: r } : {},
						project: n
					}
				}) : await v({
					name: "home",
					query: r ? { profile: r } : {}
				})), await gt(), ue();
			} catch (e) {
				i === Ve && r === N.value && (Se.value = e instanceof Error ? e.message : "Could not update session");
			} finally {
				a === wt && (Ct.value = !1);
			}
		}
		async function Et() {
			await Ze.availability(document.visibilityState === "visible", navigator.onLine), document.visibilityState === "visible" && ue();
		}
		function Dt() {
			location.href = "/";
		}
		function Ot() {
			xe.value = !navigator.onLine, Ze.availability(document.visibilityState === "visible", !xe.value), xe.value || (ue(), gt(), Et());
		}
		function kt(e) {
			if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
				Se.value = "Invalid profile name";
				return;
			}
			return v(d.value ? J_("settings", e, "", "", { return_to: t.resolve(J_("home", e)).fullPath }) : J_("home", e), !1, !0);
		}
		function At(e, t = O.value) {
			return v({
				name: "chat",
				params: { sessionId: e },
				query: {
					...N.value ? { profile: N.value } : {},
					...t ? { project: t } : {}
				}
			});
		}
		async function jt(e) {
			let t = K_(n.query.profile);
			if ((!m || t !== N.value) && (m = !0, h = vt(t), await h, e !== f) || (await h, e !== f)) return;
			let i = typeof n.params.sessionId == "string" ? n.params.sessionId : K_(n.query.session), a = typeof n.params.projectId == "string" ? n.params.projectId : K_(n.query.project), o = () => k.value.find((e) => e.sessionIds?.includes(i) || Ls(e).some((e) => e.id === i)), s = a || r.value === "chat" && o()?.id || "";
			if (s !== O.value && (fe?.abort(), O.value = s, A.value = void 0, j.value = "", te.value = !1, s && ot()), i !== P.value && (i ? await yt(i) : (tt(), P.value = "", he.value = [], Me.value = "")), i && !a && r.value === "chat" && !re.value) {
				if (await rt, e !== f || t !== N.value || i !== P.value) return;
				let n = o();
				n && n.id !== O.value && (O.value = n.id, A.value = n, ot());
			}
		}
		Pn(() => n.fullPath, () => {
			if (!n.matched.length) return;
			let e = ++f;
			z.cancel(), n.fullPath !== _ && (I.value = !1), Rt(!1), w.value = void 0, D.value = "", p && (g = jt(e));
		}, { flush: "sync" });
		function Mt() {
			I.value = !1, Ne.value?.focus();
		}
		async function Nt() {
			I.value = !0, await hn(), Pe.value?.focus();
		}
		let Pt = /* @__PURE__ */ V(null), Ft = /* @__PURE__ */ V(null), z = Kh(I, () => Pt.value?.getBoundingClientRect().width || Math.min(300, window.innerWidth * .85), () => Ft.value?.$el.querySelector(".transcript") || null, (e) => {
			e !== I.value && (e ? Nt() : Mt());
		});
		async function It() {
			await v(q_(K_(n.query.return_to))), await hn(), window.matchMedia?.("(min-width: 701px)").matches ?? !0 ? qe.value?.focus() : Ne.value?.focus();
		}
		function Lt() {
			if (!d.value) return v(y("settings", { return_to: n.fullPath }));
		}
		function Rt(e = !0) {
			Ie.value && (Ie.value = !1, e && Fe.value?.focus());
		}
		function zt(e) {
			Ie.value && Le.value && !e.composedPath().includes(Le.value) && Rt(!1);
		}
		function B(e) {
			e.key === "Escape" && (I.value ? Mt() : d.value ? (e.preventDefault(), It()) : Rt());
		}
		async function Bt() {
			let e = N.value, t = ++Ke;
			We.value = !0;
			let n = await Ks(e);
			t === Ke && e === N.value && (He.value = n, We.value = !1);
		}
		Pn(N, () => {
			Ge.value = "", He.value = {
				...He.value,
				subscribed: !1
			}, Bt();
		}, { flush: "sync" });
		async function Vt() {
			if (Ue.value || We.value) return;
			let e = N.value;
			Ue.value = !0, Ge.value = "";
			try {
				He.value.subscribed ? await Js(e) : await qs(e), await Bt();
			} catch (t) {
				e === N.value && (Ge.value = t instanceof Error ? t.message : "Could not update notifications."), await Bt();
			} finally {
				Ue.value = !1;
			}
		}
		async function Ht() {
			if (Ue.value || We.value) return;
			let e = N.value;
			Ue.value = !0, Ge.value = "";
			try {
				await Ys(e), e === N.value && (Ge.value = "Test notification scheduled.");
			} catch {
				e === N.value && (Ge.value = "Could not send a test notification.");
			} finally {
				Ue.value = !1;
			}
		}
		let Ut, Wt = Z(() => ({
			profile: N.value,
			session: P.value,
			chat: !d.value && !o.value && !i.value && !s.value && !c.value && !l.value,
			scheduled: o.value && n.params.jobId && n.params.runId ? {
				job: String(n.params.jobId),
				run: String(n.params.runId)
			} : void 0,
			connected: $e.value && Ze.connection.value === "ready" && !xe.value
		}));
		Pn(Wt, () => Ut?.publish(), { flush: "post" });
		function Gt(e) {
			if (e.data?.type !== "chathermes.navigate" || typeof e.data.url != "string") return;
			let t = Y_(e.data.url);
			t && v(t);
		}
		let Kt = Z(() => d.value ? {
			profile: N.value,
			profiles: we.value,
			pushState: He.value,
			pushBusy: Ue.value,
			pushLoading: We.value,
			pushMessage: Ge.value,
			keepScreenAwake: Qe.enabled.value,
			wakeLockAvailable: Qe.available.value,
			onProfile: kt,
			onTogglePush: Vt,
			onTestPush: Ht,
			onToggleWakeLock: Qe.setEnabled,
			onClose: It
		} : i.value ? {
			profile: N.value,
			projects: k.value,
			onOpenSession: lt
		} : o.value ? {
			profile: N.value,
			chatBusy: De.value,
			offline: xe.value,
			discussionError: x.value,
			onDiscuss: S,
			onOpenSession: lt
		} : s.value ? {
			projects: k.value,
			archived: u.value,
			loading: ee.value,
			error: ne.value || D.value,
			busy: E.value,
			offline: xe.value,
			onSelect: st,
			onRetry: it,
			onManage: ht
		} : c.value ? {
			profile: N.value,
			projectId: O.value,
			selectedProject: A.value,
			projectPage: l.value,
			projectArtifacts: a.value,
			projectLoading: te.value,
			projectError: j.value,
			manageError: D.value,
			projectBusy: E.value,
			offline: xe.value,
			visibleSessions: ae.value,
			chooseProject: st,
			showProjects: ct,
			showProjectArtifacts: et,
			loadProject: ot,
			recentSession: lt,
			chooseSession: At,
			manageProject: ht
		} : {});
		return ar(async () => {
			"serviceWorker" in navigator && (Ut = Zs(navigator.serviceWorker, () => Wt.value, () => location.href)), Q.profiles().then((e) => {
				we.value = e.profiles || [];
			}).catch(() => {
				Se.value = "Could not load profiles";
			}), Bt(), "serviceWorker" in navigator && navigator.serviceWorker.addEventListener("message", Gt), je.value = !!Ne.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", Et), addEventListener("online", Ot), addEventListener("offline", Ot), addEventListener("keydown", B), document.addEventListener("click", zt), await t.isReady(), p = !0, g = jt(++f), await g;
		}), lr(() => {
			p = !1, f++, t.options.history.destroy(), Ut?.stop(), Ut = void 0, R++, oe?.(), clearTimeout(se), document.removeEventListener("visibilitychange", Et), "serviceWorker" in navigator && navigator.serviceWorker.removeEventListener("message", Gt), nt(), de?.abort(), fe?.abort(), removeEventListener("online", Ot), removeEventListener("offline", Ot), removeEventListener("keydown", B), document.removeEventListener("click", zt);
		}), (e, t) => (G(), K("div", X_, [
			J("aside", {
				ref_key: "sidebar",
				ref: Pt,
				class: pe(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white", I.value ? "translate-x-0" : "-translate-x-full"]),
				style: ce(H(z).sidebarStyle.value),
				onTouchstart: t[10] ||= (...e) => H(z).start && H(z).start(...e),
				onTouchmove: t[11] ||= (...e) => H(z).move && H(z).move(...e),
				onTouchend: t[12] ||= (...e) => H(z).end && H(z).end(...e),
				onTouchcancel: t[13] ||= (...e) => H(z).cancel && H(z).cancel(...e),
				onClickCapture: t[14] ||= (...e) => H(z).click && H(z).click(...e),
				"aria-label": "Navigation"
			}, [
				J("div", Z_, [
					t[36] ||= J("span", { class: "min-w-0 truncate" }, "ChatHermes", -1),
					je.value ? (G(), K("button", {
						key: 0,
						class: "drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Return to Hermes Desktop",
						title: "Return to Hermes Desktop",
						onClick: Dt
					}, [...t[35] ||= [J("svg", {
						class: "size-5",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M10 5 3 12l7 7M3 12h12a6 6 0 0 0 6-6V3" })], -1)]])) : X("v-if", !0),
					J("button", {
						ref_key: "closeButton",
						ref: Pe,
						class: "mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Close navigation",
						onClick: Mt
					}, " × ", 512)
				]),
				Yi(H(M_), {
					class: "projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": s.value || c.value ? "page" : void 0,
					to: y("projects"),
					onClick: t[0] ||= (e) => I.value = !1
				}, {
					default: Dn(() => [...t[37] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1), Y("Projects ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				Yi(H(M_), {
					class: "scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": o.value ? "page" : void 0,
					to: y("scheduled"),
					onClick: t[1] ||= (e) => I.value = !1
				}, {
					default: Dn(() => [...t[38] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("rect", {
						x: "3",
						y: "5",
						width: "18",
						height: "16",
						rx: "2"
					}), J("path", { d: "M7 3v4M17 3v4M3 11h18M8 15h3M8 18h6" })], -1), Y("Scheduled ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				Yi(H(M_), {
					class: "artifacts-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": i.value ? "page" : void 0,
					to: y("artifacts"),
					onClick: t[2] ||= (e) => I.value = !1
				}, {
					default: Dn(() => [...t[39] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" })], -1), Y("Artifacts ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				(G(), q(hc, {
					heading: "Recents",
					sessions: me.value,
					selected: P.value,
					loading: ye.value,
					error: Se.value,
					"has-more": ve.value,
					busy: xe.value || De.value || Ct.value,
					projects: k.value,
					key: N.value,
					onArchive: t[3] ||= (e) => Tt("archive", e),
					onDelete: t[4] ||= (e) => Tt("delete", e),
					onProject: t[5] ||= (e, t) => Tt("project", e, t),
					onSelect: lt,
					onCreate: ut,
					onMore: t[6] ||= (e) => gt(!0),
					onRetry: t[7] ||= (e) => gt(),
					onRename: St
				}, null, 8, [
					"sessions",
					"selected",
					"loading",
					"error",
					"has-more",
					"busy",
					"projects"
				])),
				J("div", Q_, [
					t[43] ||= J("label", { for: "profile-field" }, "Profile", -1),
					J("div", $_, [
						J("select", {
							id: "profile-field",
							class: "profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white",
							value: N.value,
							onChange: t[8] ||= (e) => kt(e.target.value)
						}, [
							t[40] ||= J("option", { value: "" }, "Default profile", -1),
							N.value && !we.value.some((e) => e.name === N.value) ? (G(), K("option", {
								key: 0,
								value: N.value
							}, F(N.value), 9, tv)) : X("v-if", !0),
							(G(!0), K(W, null, yr(we.value, (e) => (G(), K("option", {
								key: e.name,
								value: e.name
							}, F(e.name), 9, nv))), 128))
						], 40, ev),
						J("button", {
							class: "drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55",
							"aria-label": "New chat",
							title: "New chat",
							disabled: xe.value || De.value,
							onClick: ut
						}, [...t[41] ||= [J("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [J("path", { d: "M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z" })], -1)]], 8, rv),
						J("button", {
							ref_key: "settingsButton",
							ref: qe,
							class: "drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]",
							"aria-label": "Settings",
							"aria-current": d.value ? "page" : void 0,
							onClick: t[9] ||= (e) => Lt()
						}, [...t[42] ||= [J("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [J("path", { d: "m9 3-.6 2.5-2 .9L4 5.7l-2 3.5 1.8 1.8v2L2 14.8l2 3.5 2.4-.7 2 .9L9 21h6l.6-2.5 2-.9 2.4.7 2-3.5-1.8-1.8v-2L22 9.2l-2-3.5-2.4.7-2-.9L15 3Z" }), J("circle", {
							cx: "12",
							cy: "12",
							r: "3"
						})], -1)]], 8, iv)
					]),
					J("span", null, [J("span", { class: pe(["status-dot mr-2 inline-block size-2 rounded-full", xe.value ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), Y(F(xe.value ? "Offline · read only" : "Connected through dashboard"), 1)])
				])
			], 38),
			I.value || H(z).dragging.value ? (G(), K("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				style: ce(H(z).scrimStyle.value),
				onTouchstart: t[15] ||= (...e) => H(z).start && H(z).start(...e),
				onTouchmove: t[16] ||= (...e) => H(z).move && H(z).move(...e),
				onTouchend: t[17] ||= (...e) => H(z).end && H(z).end(...e),
				onTouchcancel: t[18] ||= (...e) => H(z).cancel && H(z).cancel(...e),
				onClickCapture: t[19] ||= (...e) => H(z).click && H(z).click(...e),
				onClick: Mt
			}, null, 36)) : X("v-if", !0),
			J("main", av, [
				J("header", ov, [
					J("button", {
						ref_key: "menuButton",
						ref: Ne,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": I.value,
						onClick: Nt
					}, [...t[44] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, sv),
					J("div", cv, [J("h1", lv, F(d.value ? "Settings" : i.value ? "Artifacts" : o.value ? "Scheduled" : s.value ? "Projects" : me.value.find((e) => e.id === P.value)?.title || (P.value ? "Conversation" : A.value?.label || "ChatHermes")), 1), !d.value && O.value && P.value && A.value ? (G(), K("p", uv, F(A.value.label), 1)) : X("v-if", !0)]),
					J("span", dv, F(N.value || "Current profile"), 1),
					d.value ? X("v-if", !0) : (G(), K("div", {
						key: 0,
						ref_key: "screenMenuWrap",
						ref: Le,
						class: "screen-menu-wrap relative",
						onKeydown: t[33] ||= No(jo((e) => Rt(), ["stop", "prevent"]), ["esc"])
					}, [J("button", {
						ref_key: "screenMenuButton",
						ref: Fe,
						class: "screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]",
						"aria-label": "Screen options",
						"aria-haspopup": "menu",
						"aria-expanded": Ie.value,
						"aria-controls": "screen-menu",
						onClick: t[20] ||= (e) => Ie.value = !Ie.value
					}, " ··· ", 8, fv), Ie.value ? (G(), K("div", {
						key: 0,
						id: "screen-menu",
						class: "screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl",
						role: "menu",
						"aria-label": "Screen options",
						onClick: t[32] ||= (e) => Rt()
					}, [
						J("span", pv, F(N.value || "Current profile"), 1),
						J("button", {
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: xe.value || De.value || c.value && (!A.value || A.value.archived || !A.value.isNoProject && !H(Is)(A.value)),
							onClick: t[21] ||= (e) => {
								c.value ? bt() : ut(), Rt();
							}
						}, " New chat ", 8, mv),
						ie.value ? (G(), K("button", {
							key: 0,
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: xe.value || De.value || !A.value || A.value.archived || !H(Is)(A.value),
							onClick: t[22] ||= (e) => {
								bt(), Rt();
							}
						}, " New Project Chat ", 8, hv)) : X("v-if", !0),
						o.value ? (G(), K(W, { key: 1 }, [J("button", {
							role: "menuitem",
							"data-test": "refresh-scheduled",
							disabled: !b.value || b.value.loading,
							onClick: t[23] ||= (e) => b.value?.retry()
						}, " Refresh ", 8, gv), b.value?.sessionId ? (G(), K("button", {
							key: 0,
							role: "menuitem",
							"data-test": "resume-scheduled-session",
							disabled: xe.value || De.value || b.value.loading,
							onClick: t[24] ||= (e) => lt(b.value.sessionId)
						}, " Resume Session ", 8, _v)) : X("v-if", !0)], 64)) : s.value ? (G(), K(W, { key: 2 }, [J("button", {
							role: "menuitemradio",
							"aria-checked": !u.value,
							onClick: t[25] ||= (e) => ct(!1)
						}, " Active projects ", 8, vv), J("button", {
							role: "menuitemradio",
							"aria-checked": u.value,
							onClick: t[26] ||= (e) => ct(!0)
						}, " Archived projects ", 8, yv)], 64)) : !o.value && A.value && !A.value.isNoProject ? (G(), K(W, { key: 3 }, [
							J("button", {
								role: "menuitem",
								onClick: t[27] ||= (e) => dt("edit")
							}, "Edit project"),
							J("button", {
								role: "menuitem",
								disabled: xe.value || !H(Is)(A.value),
								onClick: t[28] ||= (e) => dt("instructions")
							}, " Edit Instructions ", 8, bv),
							A.value.isAuto ? X("v-if", !0) : (G(), K(W, { key: 0 }, [A.value.archived ? (G(), K("button", {
								key: 0,
								role: "menuitem",
								disabled: E.value || xe.value,
								onClick: t[29] ||= (e) => ht("archive", {
									id: O.value,
									restore: !0
								})
							}, " Restore project ", 8, xv)) : (G(), K("button", {
								key: 1,
								role: "menuitem",
								disabled: E.value || xe.value,
								onClick: t[30] ||= (e) => ft("archive")
							}, " Archive project ", 8, Sv)), J("button", {
								class: "project-danger",
								role: "menuitem",
								disabled: E.value || xe.value,
								onClick: t[31] ||= (e) => ft("delete")
							}, " Delete project ", 8, Cv)], 64))
						], 64)) : X("v-if", !0)
					])) : X("v-if", !0)], 544))
				]),
				w.value && A.value ? (G(), K("div", {
					key: 0,
					class: "project-confirmation mx-6",
					role: "alertdialog",
					"aria-labelledby": "project-confirmation-text",
					onKeydown: t[34] ||= No(jo((e) => !E.value && pt(), ["stop", "prevent"]), ["esc"])
				}, [
					J("p", wv, F(w.value === "delete" ? `Delete ${A.value.label}? This permanently removes the project and its folder associations. Files and chats will be kept.` : `Archive ${A.value.label}? You can restore it from Archived projects.`), 1),
					D.value ? (G(), K("p", Tv, F(D.value), 1)) : X("v-if", !0),
					J("div", Ev, [J("button", {
						ref_key: "projectConfirmCancel",
						ref: T,
						class: "project-button",
						disabled: E.value,
						onClick: pt
					}, " Cancel", 8, Dv), J("button", {
						class: "project-button project-danger",
						disabled: E.value || xe.value,
						onClick: mt
					}, F(w.value === "delete" ? "Delete project permanently" : "Confirm archive"), 9, Ov)])
				], 32)) : X("v-if", !0),
				Yi(Vh, {
					ref_key: "chatPlane",
					ref: Ft,
					onTouchstart: H(z).start,
					onTouchmove: H(z).move,
					onTouchend: H(z).end,
					onTouchcancel: H(z).cancel,
					onClickCapture: H(z).click,
					"show-page": d.value || o.value || i.value || s.value || !!l.value || c.value,
					"hide-composer": i.value || c.value && a.value
				}, {
					page: Dn(() => [Yi(H(z_), null, {
						default: Dn(({ Component: e }) => [(G(), q(gr(e), ra({
							ref: o.value ? C : void 0,
							key: N.value
						}, Kt.value), null, 16))]),
						_: 1
					})]),
					_: 1
				}, 8, [
					"onTouchstart",
					"onTouchmove",
					"onTouchend",
					"onTouchcancel",
					"onClickCapture",
					"show-page",
					"hide-composer"
				]),
				t[45] ||= J("footer", {
					class: "app-footer shrink-0 bg-black",
					"aria-hidden": "true"
				}, null, -1)
			])
		]));
	}
}), Av = "chathermes";
function jv() {
	let e = [], t = !1, n = !1, r = () => Y_(window.location.href) || "/", i = r(), a = () => window.history.state?.[Av], o = a()?.position ?? 0, s = a()?.state ?? {}, c = () => {
		let e = new URL(window.location.href);
		return e.pathname + e.search;
	}, l = (e, t, r) => {
		if (n || window.location.pathname !== "/chathermes") return;
		let a = { ...window.history.state };
		r || (typeof a.idx == "number" && a.idx++, typeof a.key == "string" && (a.key = Math.random().toString(36).slice(2, 10)), o++), s = {
			...t,
			position: o
		}, a[Av] = {
			current: e,
			position: o,
			state: s
		}, window.history[r ? "replaceState" : "pushState"](a, "", c() + "#" + e), i = e;
	}, u = () => {
		if (n || window.location.pathname !== "/chathermes") return;
		let c = i, u = r(), d = a(), f = d ? d.position - o : 0;
		if (i = u, o = d?.position ?? o, s = d?.state ?? {}, t) {
			t = !1;
			return;
		}
		u !== c && ((!d || !window.location.hash.startsWith("#/")) && l(u, {}, !0), e.slice().forEach((e) => e(u, c, {
			delta: f,
			type: "pop",
			direction: f > 0 ? "forward" : f < 0 ? "back" : "unknown"
		})));
	};
	return window.addEventListener("popstate", u), window.addEventListener("hashchange", u), {
		base: "/chathermes#",
		get location() {
			return i;
		},
		get state() {
			return s;
		},
		createHref: (e) => c() + "#" + e,
		push: (e, t = {}) => l(e, t, !1),
		replace: (e, t = {}) => l(e, t, !0),
		go: (e, n = !0) => {
			t = !n, window.history.go(e);
		},
		listen: (t) => (e.push(t), () => {
			e = e.filter((e) => e !== t);
		}),
		destroy: () => {
			n || (n = !0, e = [], window.removeEventListener("popstate", u), window.removeEventListener("hashchange", u));
		}
	};
}
//#endregion
//#region src/features/artifacts/components/ArtifactsPage.vue?vue&type=script&setup=true&lang.ts
var Mv = {
	class: "min-h-0 flex-1 overflow-y-auto px-5 py-6",
	"aria-label": "Artifacts"
}, Nv = { class: "mx-auto max-w-[1100px]" }, Pv = { class: "mb-5 flex items-center justify-between" }, Fv = ["disabled"], Iv = {
	key: 0,
	role: "status",
	class: "text-sm text-[#b4b4b4]"
}, Lv = {
	key: 1,
	role: "alert",
	class: "mb-4 text-sm text-red-200"
}, Rv = {
	key: 2,
	class: "text-sm text-[#b4b4b4]"
}, zv = { class: "grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),20rem))] items-start gap-4 [&>.artifact-card]:my-0" }, Bv = { class: "border-t border-[#424242] px-3 py-2 text-xs text-[#b4b4b4]" }, Vv = {
	key: 0,
	class: "mb-1 block truncate"
}, Hv = { class: "flex min-w-0 items-center gap-3" }, Uv = { class: "shrink-0" }, Wv = ["title", "onClick"], Gv = ["aria-label", "onClick"], Kv = { key: 0 }, qv = { class: "mb-3 break-words" }, Jv = { class: "flex justify-end gap-4" }, Yv = ["disabled"], Xv = ["disabled"], Zv = /* @__PURE__ */ U({
	__name: "ArtifactsPage",
	props: {
		profile: {},
		sessions: {},
		projects: {},
		project: {}
	},
	emits: ["openSession"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ V([]), a = /* @__PURE__ */ V(!1), o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V(), c = /* @__PURE__ */ V(!1), l = /* @__PURE__ */ V();
		Pn(s, async (e) => {
			await hn(), e ? l.value?.showModal() : l.value?.close();
		});
		let u;
		async function d() {
			u?.abort();
			let e = u = new AbortController();
			a.value = !0, i.value = [], o.value = "", s.value = void 0;
			try {
				let t = n.sessions ? [...n.sessions] : [];
				if (!n.sessions) for (let r = 0;;) {
					let i = await Q.sessions(n.profile, r, e.signal);
					if (t.push(...i.sessions), r += i.sessions.length, !i.sessions.length || i.has_more === !1 || i.has_more === void 0 && i.sessions.length < (i.limit || 30)) break;
				}
				let r = await xp(n.profile, t, e.signal);
				if (e.signal.aborted) return;
				i.value = r.files.map((e) => {
					let t = n.project || n.projects?.find((t) => t.sessionIds?.includes(e.sessionId) || Ls(t).some((t) => t.id === e.sessionId));
					return {
						...e,
						projectId: t?.id,
						projectTitle: t && !t.isNoProject ? t.label : void 0
					};
				}), r.failures && (o.value = `${r.failures} conversations could not be loaded. Retry to see their artifacts.`);
			} catch {
				e.signal.aborted || (o.value = "Could not load artifacts.");
			} finally {
				u === e && (a.value = !1);
			}
		}
		async function f() {
			let e = s.value;
			if (!e?.sessionId || c.value) return;
			let t = u;
			c.value = !0;
			try {
				let r = new URLSearchParams({
					path: e.path,
					session_id: e.sessionId,
					profile: n.profile || "default"
				});
				if (!(await fetch(`/api/plugins/chathermes/files?${r}`, {
					method: "DELETE",
					credentials: "same-origin",
					redirect: "error"
				})).ok) throw Error();
				if (t !== u) return;
				i.value = i.value.filter((t) => t.path !== e.path), s.value = void 0;
			} catch {
				t === u && (o.value = "Hermes could not delete this file. It may be outside the managed files area or deletion may be unsupported.");
			} finally {
				c.value = !1;
			}
		}
		return Pn(() => [n.profile, n.sessions], d, { immediate: !0 }), cr(() => u?.abort()), (t, n) => (G(), K("section", Mv, [J("div", Nv, [
			J("div", Pv, [n[3] ||= J("h2", { class: "text-xl font-medium" }, "Artifacts", -1), J("button", {
				class: "text-sm underline",
				disabled: a.value,
				onClick: d
			}, "Refresh", 8, Fv)]),
			a.value ? (G(), K("p", Iv, " Loading conversation artifacts… ")) : X("v-if", !0),
			o.value ? (G(), K("p", Lv, F(o.value), 1)) : X("v-if", !0),
			!a.value && !i.value.length ? (G(), K("p", Rv, "No artifacts found.")) : X("v-if", !0),
			J("div", zv, [(G(!0), K(W, null, yr(i.value, (t) => (G(), q(Hp, {
				key: `${t.sessionId}:${t.path}`,
				file: t,
				profile: e.profile
			}, {
				footer: Dn(() => [J("div", Bv, [t.projectTitle ? (G(), K("span", Vv, F(t.projectTitle), 1)) : X("v-if", !0), J("div", Hv, [
					J("span", Uv, F(t.direction === "uploaded" ? "Uploaded" : "Generated"), 1),
					J("button", {
						type: "button",
						class: "min-w-0 flex-1 truncate py-2 text-left underline",
						title: t.sessionTitle,
						onClick: (e) => r("openSession", t.sessionId)
					}, F(t.sessionTitle), 9, Wv),
					/^(https?:|data:)/.test(t.path) ? X("v-if", !0) : (G(), K("button", {
						key: 0,
						type: "button",
						class: "shrink-0 py-2 hover:text-white",
						"aria-label": `Delete ${t.name}`,
						onClick: (e) => s.value = t
					}, " Delete ", 8, Gv))
				])])]),
				_: 2
			}, 1032, ["file", "profile"]))), 128))]),
			J("dialog", {
				ref_key: "confirmation",
				ref: l,
				class: "fixed m-auto w-[min(380px,94vw)] rounded-2xl bg-[#303030] p-5 text-white backdrop:bg-black/80",
				"aria-label": "Delete artifact",
				onCancel: n[1] ||= (e) => c.value && e.preventDefault(),
				onClose: n[2] ||= (e) => s.value = void 0
			}, [s.value ? (G(), K("div", Kv, [
				J("h3", qv, "Delete " + F(s.value.name) + " from Hermes?", 1),
				n[4] ||= J("p", { class: "mb-5 text-sm text-[#b4b4b4]" }, " This removes the server file. References in conversation history remain. ", -1),
				J("div", Jv, [J("button", {
					autofocus: "",
					disabled: c.value,
					onClick: n[0] ||= (e) => s.value = void 0
				}, "Cancel", 8, Yv), J("button", {
					disabled: c.value,
					onClick: f
				}, F(c.value ? "Deleting…" : "Delete file"), 9, Xv)])
			])) : X("v-if", !0)], 544)
		])]));
	}
}), Qv = {
	class: "projects-page page-content",
	"aria-label": "Projects"
}, $v = { class: "page-heading" }, ey = ["disabled"], ty = {
	key: 0,
	class: "project-muted"
}, ny = { class: "project-actions" }, ry = ["disabled"], iy = ["disabled"], ay = {
	key: 2,
	role: "alert",
	class: "project-error"
}, oy = {
	key: 3,
	role: "status",
	class: "project-muted"
}, sy = {
	key: 4,
	class: "project-muted"
}, cy = {
	class: "project-list",
	"aria-label": "Project list"
}, ly = ["aria-label", "onClick"], uy = /* @__PURE__ */ U({
	__name: "ProjectsPage",
	props: {
		projects: {},
		archived: { type: Boolean },
		loading: { type: Boolean },
		error: {},
		busy: { type: Boolean },
		offline: { type: Boolean }
	},
	emits: [
		"select",
		"retry",
		"manage"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Z(() => n.projects.filter((e) => !e.isNoProject && !!e.archived === n.archived)), a = /* @__PURE__ */ V(!1), o = /* @__PURE__ */ V(""), s = /* @__PURE__ */ V("");
		function c() {
			o.value.trim() && r("manage", "create", {
				name: o.value.trim(),
				...s.value.trim() ? { primary_path: s.value.trim() } : {}
			});
		}
		return (t, n) => (G(), K("section", Qv, [
			J("div", $v, [n[5] ||= J("h2", null, "Projects", -1), e.archived ? X("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: n[0] ||= (e) => a.value = !a.value
			}, " New project ", 8, ey))]),
			e.archived ? (G(), K("p", ty, "Archived projects")) : X("v-if", !0),
			a.value && !e.archived ? (G(), K("form", {
				key: 1,
				class: "project-form",
				onSubmit: jo(c, ["prevent"])
			}, [
				J("label", null, [n[6] ||= Y("Project name", -1), On(J("input", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					required: "",
					maxlength: "160",
					autofocus: ""
				}, null, 512), [[xo, o.value]])]),
				J("label", null, [n[7] ||= Y("Folder (optional)", -1), On(J("input", {
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					placeholder: "/path/on/hermes/server"
				}, null, 512), [[xo, s.value]])]),
				J("div", ny, [J("button", {
					class: "project-button",
					disabled: e.busy || e.offline || !o.value.trim()
				}, " Create project", 8, ry), J("button", {
					type: "button",
					class: "project-button",
					disabled: e.busy,
					onClick: n[3] ||= (e) => a.value = !1
				}, " Cancel ", 8, iy)])
			], 32)) : X("v-if", !0),
			e.error ? (G(), K("p", ay, [Y(F(e.error) + " ", 1), J("button", {
				class: "underline",
				onClick: n[4] ||= (e) => r("retry")
			}, "Retry Projects")])) : X("v-if", !0),
			e.loading ? (G(), K("p", oy, "Loading Projects…")) : i.value.length ? X("v-if", !0) : (G(), K("p", sy, F(e.archived ? "No archived projects." : "No projects yet."), 1)),
			J("nav", cy, [(G(!0), K(W, null, yr(i.value, (e) => (G(), K("button", {
				key: e.id,
				"aria-label": e.label,
				onClick: (t) => r("select", e.id)
			}, [
				n[8] ||= J("svg", {
					width: "24",
					height: "24",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [J("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1),
				J("span", null, [J("strong", null, F(e.label), 1), J("small", null, F(e.archived ? "Archived" : e.isAuto ? "Discovered workspace" : `${e.sessionCount} ${e.sessionCount === 1 ? "chat" : "chats"}`), 1)]),
				n[9] ||= J("span", { "aria-hidden": "true" }, "›", -1)
			], 8, ly))), 128))])
		]));
	}
}), dy = {
	key: 0,
	class: "project-settings"
}, fy = ["disabled"], py = {
	key: 0,
	class: "project-error",
	role: "alert"
}, my = {
	key: 1,
	class: "project-muted",
	role: "status"
}, hy = ["disabled"], gy = { class: "project-field-row" }, _y = ["disabled"], vy = {
	key: 2,
	class: "project-muted"
}, yy = { class: "project-folders" }, by = { class: "folder-path" }, xy = { key: 0 }, Sy = { key: 1 }, Cy = { class: "project-actions" }, wy = ["disabled", "onClick"], Ty = [
	"disabled",
	"aria-label",
	"onClick"
], Ey = ["disabled"], Dy = { class: "project-checkbox" }, Oy = ["disabled"], ky = { id: "project-confirm-text" }, Ay = { class: "project-actions" }, jy = ["disabled"], My = ["disabled"], Ny = /* @__PURE__ */ U({
	__name: "ProjectSettings",
	props: {
		project: {},
		busy: { type: Boolean },
		offline: { type: Boolean },
		error: {}
	},
	emits: ["manage"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ V(n.project.label), a = /* @__PURE__ */ V(n.project.description || ""), o = /* @__PURE__ */ V(n.project.icon || ""), s = /* @__PURE__ */ V(n.project.color || ""), c = /* @__PURE__ */ V(n.project.board_slug || ""), l = /* @__PURE__ */ V(""), u = /* @__PURE__ */ V(""), d = /* @__PURE__ */ V(!0), f = /* @__PURE__ */ V(), p = /* @__PURE__ */ V(), m = /* @__PURE__ */ V();
		Pn(() => n.busy, (e, t) => {
			t && !e && !n.error && _();
		}), Pn(() => n.project.label, (e) => {
			i.value = e;
		});
		function h(e, t = {}) {
			r("manage", e, {
				id: n.project.id,
				...t
			});
		}
		async function g(e, t, n) {
			f.value = {
				action: e,
				fields: t,
				text: n
			}, await hn(), p.value?.focus();
		}
		function _() {
			f.value = void 0, m.value?.focus();
		}
		function v() {
			let e = f.value;
			e && h(e.action, e.fields);
		}
		return (t, n) => e.project.isAuto ? (G(), K("div", dy, [n[12] ||= J("p", { class: "project-muted" }, " Save this discovered workspace as a project to manage its name and folders. ", -1), J("button", {
			class: "project-button",
			disabled: e.busy || e.offline,
			onClick: n[0] ||= (t) => r("manage", "create", {
				name: e.project.label,
				primary_path: e.project.path || e.project.repos.find((e) => e.path)?.path || ""
			})
		}, " Save project ", 8, fy)])) : e.project.isNoProject ? X("v-if", !0) : (G(), K("div", {
			key: 1,
			ref_key: "settings",
			ref: m,
			tabindex: "-1",
			class: "project-settings"
		}, [
			e.error ? (G(), K("p", py, F(e.error), 1)) : X("v-if", !0),
			e.busy ? (G(), K("p", my, "Saving project…")) : X("v-if", !0),
			J("form", {
				class: "project-form",
				onSubmit: n[6] ||= jo((e) => h("update", {
					name: i.value.trim(),
					description: a.value,
					icon: o.value,
					color: s.value,
					board_slug: c.value
				}), ["prevent"])
			}, [J("fieldset", { disabled: e.busy || e.offline }, [
				J("label", null, [n[13] ||= Y("Project name", -1), On(J("input", {
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					required: "",
					maxlength: "160"
				}, null, 512), [[xo, i.value]])]),
				J("label", null, [n[14] ||= Y("Description", -1), On(J("textarea", {
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					maxlength: "4096",
					rows: "2"
				}, null, 512), [[xo, a.value]])]),
				J("div", gy, [J("label", null, [n[15] ||= Y("Icon", -1), On(J("input", {
					"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
					maxlength: "64"
				}, null, 512), [[xo, o.value]])]), J("label", null, [n[16] ||= Y("Color", -1), On(J("input", {
					"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
					maxlength: "64",
					placeholder: "#94c9a5"
				}, null, 512), [[xo, s.value]])])]),
				J("label", null, [n[17] ||= Y("Board slug (optional)", -1), On(J("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					maxlength: "160"
				}, null, 512), [[xo, c.value]])]),
				J("button", {
					class: "project-button",
					disabled: !i.value.trim()
				}, "Save changes", 8, _y)
			], 8, hy)], 32),
			n[21] ||= J("h3", null, "Folders", -1),
			n[22] ||= J("p", { class: "project-muted" }, " The primary folder is used for new chats. Existing chats keep their workspace. ", -1),
			e.project.folders?.length ? X("v-if", !0) : (G(), K("p", vy, "No folders configured.")),
			J("ul", yy, [(G(!0), K(W, null, yr(e.project.folders, (t) => (G(), K("li", { key: t.path }, [J("span", by, [
				Y(F(t.label || t.path), 1),
				t.label ? (G(), K("small", xy, F(t.path), 1)) : X("v-if", !0),
				t.is_primary ? (G(), K("small", Sy, "Primary folder")) : X("v-if", !0)
			]), J("div", Cy, [t.is_primary ? X("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: (e) => h("set_primary", { path: t.path })
			}, " Make primary", 8, wy)), J("button", {
				class: "project-button",
				disabled: e.busy || e.offline,
				"aria-label": `Remove folder ${t.path}`,
				onClick: (e) => g("remove_folder", { path: t.path }, `Remove ${t.path} from this project? The folder and existing chats will be kept.`)
			}, " Remove ", 8, Ty)])]))), 128))]),
			J("form", {
				class: "project-form",
				onSubmit: n[10] ||= jo((e) => h("add_folder", {
					path: l.value.trim(),
					label: u.value.trim(),
					is_primary: d.value
				}), ["prevent"])
			}, [J("fieldset", { disabled: e.busy || e.offline }, [
				J("label", null, [n[18] ||= Y("Folder path", -1), On(J("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					required: "",
					placeholder: "/path/on/hermes/server",
					maxlength: "4096"
				}, null, 512), [[xo, l.value]])]),
				J("label", null, [n[19] ||= Y("Folder label (optional)", -1), On(J("input", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					maxlength: "160"
				}, null, 512), [[xo, u.value]])]),
				J("label", Dy, [On(J("input", {
					"onUpdate:modelValue": n[9] ||= (e) => d.value = e,
					type: "checkbox"
				}, null, 512), [[So, d.value]]), n[20] ||= Y(" Use as primary folder", -1)]),
				J("button", {
					class: "project-button",
					disabled: !l.value.trim()
				}, "Add folder", 8, Oy)
			], 8, Ey)], 32),
			f.value ? (G(), K("div", {
				key: 3,
				class: "project-confirmation",
				role: "alertdialog",
				"aria-modal": "false",
				"aria-labelledby": "project-confirm-text",
				onKeydown: n[11] ||= No(jo((t) => !e.busy && _(), ["prevent"]), ["esc"])
			}, [J("p", ky, F(f.value.text), 1), J("div", Ay, [J("button", {
				ref_key: "cancelButton",
				ref: p,
				class: "project-button",
				disabled: e.busy,
				onClick: _
			}, " Cancel", 8, jy), J("button", {
				class: "project-button project-danger",
				disabled: e.busy || e.offline,
				onClick: v
			}, " Confirm removal ", 8, My)])], 32)) : X("v-if", !0)
		], 512));
	}
}), Py = {
	key: 0,
	role: "status"
}, Fy = {
	key: 1,
	role: "alert",
	class: "project-error"
}, Iy = ["disabled"], Ly = { key: 2 }, Ry = { class: "project-muted" }, zy = ["disabled"], By = {
	key: 3,
	role: "status",
	class: "project-muted"
}, Vy = ["disabled"], Hy = /* @__PURE__ */ U({
	__name: "ProjectInstructions",
	props: {
		profile: {},
		projectId: {},
		offline: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ V(""), r = /* @__PURE__ */ V(""), i = /* @__PURE__ */ V(null), a = /* @__PURE__ */ V(!0), o = /* @__PURE__ */ V(!1), s = /* @__PURE__ */ V(""), c = /* @__PURE__ */ V(!1), l = /* @__PURE__ */ V(!1), u = new AbortController(), d = !0;
		async function f() {
			a.value = !0, s.value = "", c.value = !1;
			try {
				let e = await Q.projectInstructions(t.profile, t.projectId, u.signal);
				if (!d) return;
				n.value = e.content, r.value = e.filename, i.value = e.revision, l.value = !0;
			} catch {
				d && (s.value = "Could not load the workspace instructions.");
			} finally {
				d && (a.value = !1);
			}
		}
		async function p() {
			if (!(!l.value || a.value || o.value || t.offline)) {
				o.value = !0, s.value = "", c.value = !1;
				try {
					let e = await Q.saveProjectInstructions(t.profile, t.projectId, {
						content: n.value,
						filename: r.value,
						revision: i.value
					});
					d && (i.value = e.revision, c.value = !0);
				} catch (e) {
					d && (s.value = e instanceof Ho && e.status === 409 ? "Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading." : "Could not save instructions. Your draft is kept; try again.");
				} finally {
					d && (o.value = !1);
				}
			}
		}
		return ar(f), cr(() => {
			d = !1, u.abort();
		}), (t, i) => (G(), K("form", {
			class: "project-form instructions-form",
			onSubmit: jo(p, ["prevent"])
		}, [
			i[3] ||= J("p", { class: "project-muted" }, "Custom instructions guide Hermes when it works in this project.", -1),
			a.value ? (G(), K("p", Py, "Loading instructions…")) : X("v-if", !0),
			s.value ? (G(), K("p", Fy, [Y(F(s.value) + " ", 1), J("button", {
				type: "button",
				class: "underline",
				disabled: a.value || o.value || e.offline,
				onClick: f
			}, " Reload instructions ", 8, Iy)])) : X("v-if", !0),
			l.value ? (G(), K("label", Ly, [
				i[2] ||= Y("Instructions ", -1),
				J("span", Ry, F(r.value), 1),
				On(J("textarea", {
					"onUpdate:modelValue": i[0] ||= (e) => n.value = e,
					rows: "14",
					disabled: a.value || o.value,
					onInput: i[1] ||= (e) => c.value = !1
				}, null, 40, zy), [[xo, n.value]])
			])) : X("v-if", !0),
			c.value ? (G(), K("p", By, "Instructions saved.")) : X("v-if", !0),
			J("button", {
				class: "project-button justify-self-start",
				disabled: !l.value || a.value || o.value || e.offline
			}, F(o.value ? "Saving…" : "Save instructions"), 9, Vy)
		], 32));
	}
}), Uy = ["aria-label"], Wy = { class: "text-2xl font-semibold" }, Gy = {
	key: 1,
	class: "project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10",
	"aria-label": "Selected Project"
}, Ky = { class: "project-home-content" }, qy = {
	key: 0,
	role: "status"
}, Jy = {
	key: 1,
	class: "mb-4 text-[#fecaca]",
	role: "alert"
}, Yy = {
	class: "mb-5 flex gap-5 text-sm",
	"aria-label": "Project view"
}, Xy = ["aria-pressed"], Zy = ["aria-pressed"], Qy = {
	key: 0,
	class: "project-muted"
}, $y = { class: "mb-4 break-all text-sm text-[#a3a3a3]" }, eb = {
	key: 1,
	class: "text-sm text-[#b4b4b4]"
}, tb = {
	class: "project-chat-list",
	"aria-label": "Project chats"
}, nb = ["aria-label", "onClick"], rb = { class: "project-chat-title" }, ib = {
	key: 0,
	class: "project-chat-preview"
}, ab = /* @__PURE__ */ U({
	__name: "ProjectRoute",
	props: {
		profile: {},
		projectId: {},
		selectedProject: {},
		projectPage: {},
		projectArtifacts: { type: Boolean },
		projectLoading: { type: Boolean },
		projectError: {},
		manageError: {},
		projectBusy: { type: Boolean },
		offline: { type: Boolean },
		visibleSessions: {},
		chooseProject: { type: Function },
		showProjects: { type: Function },
		showProjectArtifacts: { type: Function },
		loadProject: { type: Function },
		recentSession: { type: Function },
		chooseSession: { type: Function },
		manageProject: { type: Function }
	},
	setup(e) {
		return (t, n) => e.projectPage && e.selectedProject ? (G(), K("section", {
			key: 0,
			class: "page-content project-editor",
			"aria-label": e.projectPage === "edit" ? "Edit project" : "Edit Instructions"
		}, [
			J("button", {
				class: "project-back",
				onClick: n[0] ||= (t) => e.chooseProject(e.projectId)
			}, " ← " + F(e.selectedProject.label), 1),
			J("h2", Wy, F(e.projectPage === "edit" ? "Edit project" : "Edit Instructions"), 1),
			e.projectPage === "edit" ? (G(), q(Ny, {
				key: `${e.profile}:${e.selectedProject.id}`,
				project: e.selectedProject,
				busy: e.projectBusy,
				offline: e.offline,
				error: e.manageError,
				onManage: e.manageProject
			}, null, 8, [
				"project",
				"busy",
				"offline",
				"error",
				"onManage"
			])) : (G(), q(Hy, {
				key: `${e.profile}:${e.selectedProject.id}`,
				profile: e.profile,
				"project-id": e.selectedProject.id,
				offline: e.offline
			}, null, 8, [
				"profile",
				"project-id",
				"offline"
			]))
		], 8, Uy)) : (G(), K("section", Gy, [J("div", Ky, [
			J("button", {
				class: "project-back",
				onClick: n[1] ||= (t) => e.showProjects(!!e.selectedProject?.archived)
			}, " ← Projects "),
			e.projectLoading ? (G(), K("p", qy, "Loading Project…")) : X("v-if", !0),
			e.projectError ? (G(), K("p", Jy, [Y(F(e.projectError) + " ", 1), J("button", {
				class: "underline",
				onClick: n[2] ||= (...t) => e.loadProject && e.loadProject(...t)
			}, "Retry Project")])) : X("v-if", !0),
			e.selectedProject ? (G(), K(W, { key: 2 }, [J("nav", Yy, [J("button", {
				"aria-pressed": !e.projectArtifacts,
				onClick: n[3] ||= (t) => e.showProjectArtifacts(!1)
			}, " Sessions / Chat", 8, Xy), J("button", {
				"aria-pressed": e.projectArtifacts,
				onClick: n[4] ||= (t) => e.showProjectArtifacts(!0)
			}, " Artifacts ", 8, Zy)]), e.projectArtifacts ? (G(), q(Zv, {
				key: 0,
				project: e.selectedProject,
				profile: e.profile,
				sessions: e.visibleSessions,
				onOpenSession: e.recentSession
			}, null, 8, [
				"project",
				"profile",
				"sessions",
				"onOpenSession"
			])) : (G(), K(W, { key: 1 }, [
				e.selectedProject.archived ? (G(), K("p", Qy, "Archived project")) : X("v-if", !0),
				J("p", $y, F(H(Is)(e.selectedProject) ? "Workspace: " + H(Is)(e.selectedProject) : e.selectedProject.isNoProject ? "No project workspace" : "No workspace configured"), 1),
				e.visibleSessions.length ? X("v-if", !0) : (G(), K("p", eb, "No conversations yet.")),
				J("nav", tb, [(G(!0), K(W, null, yr(e.visibleSessions, (t) => (G(), K("button", {
					key: t.id,
					class: "project-chat-row",
					"aria-label": t.title || "Untitled session",
					onClick: (n) => e.chooseSession(t.id)
				}, [J("span", rb, F(t.title || "Untitled session"), 1), t.preview?.trim() ? (G(), K("span", ib, F(t.preview), 1)) : X("v-if", !0)], 8, nb))), 128))]),
				J("button", {
					class: "project-back mt-5",
					onClick: n[5] ||= (t) => e.chooseProject("")
				}, "Other chats")
			], 64))], 64)) : X("v-if", !0)
		])]));
	}
}), ob = {
	class: "settings-page page-content",
	"aria-label": "Settings"
}, sb = { class: "settings-content" }, cb = { class: "settings-heading" }, lb = {
	class: "settings-group",
	"aria-labelledby": "settings-profile-heading"
}, ub = { class: "settings-row" }, db = ["value"], fb = ["value"], pb = ["value"], mb = {
	class: "settings-group",
	"aria-labelledby": "settings-app-heading"
}, hb = { class: "settings-row settings-notifications" }, gb = { class: "wake-lock-setting" }, _b = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, vb = ["checked"], yb = {
	key: 0,
	class: "mt-1 text-sm"
}, bb = {
	class: "settings-group",
	"aria-labelledby": "settings-notifications-heading"
}, xb = { class: "settings-row settings-notifications" }, Sb = {
	class: "push-setting",
	"aria-labelledby": "notifications-heading"
}, Cb = {
	id: "notifications-heading",
	class: "text-sm font-medium text-white"
}, wb = ["disabled"], Tb = ["disabled"], Eb = {
	key: 1,
	class: "mt-1 text-sm text-[#dcae6e]",
	role: "status"
}, Db = {
	key: 2,
	class: "mt-1 text-sm"
}, Ob = {
	key: 3,
	class: "mt-1 text-sm",
	role: "status"
}, kb = {
	key: 4,
	class: "mt-1 text-sm"
}, Ab = {
	key: 5,
	class: "mt-1 text-sm"
}, jb = {
	key: 6,
	class: "mt-1 text-sm"
}, Mb = /* @__PURE__ */ U({
	__name: "SettingsPage",
	props: {
		profile: {},
		profiles: {},
		pushState: {},
		pushBusy: { type: Boolean },
		pushLoading: { type: Boolean },
		pushMessage: {},
		keepScreenAwake: { type: Boolean },
		wakeLockAvailable: { type: Boolean }
	},
	emits: [
		"profile",
		"togglePush",
		"testPush",
		"toggleWakeLock",
		"close"
	],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ V();
		return ar(() => r.value?.focus()), (t, i) => (G(), K("section", ob, [J("div", sb, [
			J("div", cb, [J("h2", {
				ref_key: "heading",
				ref: r,
				tabindex: "-1",
				class: "text-2xl font-semibold"
			}, "Settings", 512), J("button", {
				class: "settings-close",
				"aria-label": "Close settings",
				onClick: i[0] ||= (e) => n("close")
			}, "×")]),
			i[11] ||= J("h3", {
				id: "settings-profile-heading",
				class: "settings-section-title"
			}, "Profile", -1),
			J("div", lb, [J("div", ub, [i[6] ||= $i("<svg class=\"settings-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><circle cx=\"12\" cy=\"9\" r=\"3\"></circle><path d=\"M6 19c0-6 12-6 12 0\"></path></svg><label for=\"settings-profile\">Active profile</label>", 2), J("select", {
				id: "settings-profile",
				value: e.profile,
				onChange: i[1] ||= (e) => n("profile", e.target.value)
			}, [
				i[5] ||= J("option", { value: "" }, "Default profile", -1),
				e.profile && !e.profiles.some((t) => t.name === e.profile) ? (G(), K("option", {
					key: 0,
					value: e.profile
				}, F(e.profile), 9, fb)) : X("v-if", !0),
				(G(!0), K(W, null, yr(e.profiles, (e) => (G(), K("option", {
					key: e.name,
					value: e.name
				}, F(e.name), 9, pb))), 128))
			], 40, db)])]),
			i[12] ||= J("h3", {
				id: "settings-app-heading",
				class: "settings-section-title"
			}, "Global settings", -1),
			J("div", mb, [J("div", hb, [i[9] ||= J("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [J("rect", {
				x: "5",
				y: "3",
				width: "14",
				height: "18",
				rx: "2"
			}), J("path", { d: "M9 17h6" })], -1), J("div", gb, [
				i[8] ||= J("h3", {
					id: "wake-lock-heading",
					class: "text-sm font-medium text-white"
				}, "Keep Screen Awake", -1),
				J("label", _b, [J("input", {
					type: "checkbox",
					"aria-labelledby": "wake-lock-heading",
					checked: e.keepScreenAwake,
					onChange: i[2] ||= (e) => n("toggleWakeLock", e.target.checked)
				}, null, 40, vb), i[7] ||= Y(" Prevent the display from sleeping while ChatHermes is visible. ", -1)]),
				e.wakeLockAvailable ? X("v-if", !0) : (G(), K("p", yb, " Screen wake lock is unavailable in this browser. "))
			])])]),
			i[13] ||= J("h3", {
				id: "settings-notifications-heading",
				class: "settings-section-title"
			}, "Notifications", -1),
			J("div", bb, [J("div", xb, [i[10] ||= J("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [J("path", { d: "M5 16h14l-2-3V9a5 5 0 0 0-10 0v4l-2 3Z" }), J("path", { d: "M10 19a2 2 0 0 0 4 0" })], -1), J("div", Sb, [
				J("h3", Cb, " Notifications for " + F(e.profile || "default"), 1),
				J("button", {
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.supported || !e.pushState.subscribed && !e.pushState.available,
					onClick: i[3] ||= (e) => n("togglePush")
				}, F(e.pushLoading ? "Loading…" : e.pushBusy ? "Updating…" : e.pushState.subscribed ? "Disable notifications" : "Enable notifications"), 9, wb),
				e.pushState.subscribed ? (G(), K("button", {
					key: 0,
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.available,
					onClick: i[4] ||= (e) => n("testPush")
				}, " Send test ", 8, Tb)) : X("v-if", !0),
				e.pushState.error || e.pushMessage ? (G(), K("p", Eb, F(e.pushMessage || e.pushState.error), 1)) : e.pushState.subscribed ? (G(), K("p", Db, " Notifications enabled for " + F(e.profile || "default") + " on this device. ", 1)) : e.pushLoading ? (G(), K("p", Ob, " Loading profile notification status… ")) : e.pushState.supported ? e.pushState.permission === "denied" ? (G(), K("p", Ab, " Allow notifications in browser settings to enable them. ")) : (G(), K("p", jb, " Notifications disabled for " + F(e.profile || "default") + " on this device. ", 1)) : (G(), K("p", kb, " Install ChatHermes on a secure HTTPS origin to enable notifications. "))
			])])])
		])]));
	}
}), Nb = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, Pb = { class: "scheduled-heading" }, Fb = { class: "scheduled-heading-content" }, Ib = { class: "page-heading" }, Lb = {
	key: 0,
	class: "scheduled-filter"
}, Rb = {
	key: 1,
	class: "project-muted"
}, zb = {
	key: 2,
	role: "status",
	class: "project-muted"
}, Bb = {
	key: 3,
	role: "alert",
	class: "project-error"
}, Vb = {
	key: 1,
	class: "scheduled-content"
}, Hb = {
	key: 0,
	class: "project-muted"
}, Ub = {
	key: 1,
	class: "scheduled-list",
	"aria-label": "Scheduled jobs"
}, Wb = ["onClick"], Gb = {
	key: 2,
	class: "project-muted"
}, Kb = {
	key: 3,
	class: "scheduled-list",
	"aria-label": "Job runs"
}, qb = ["onClick"], Jb = ["disabled"], Yb = {
	key: 5,
	class: "project-muted"
}, Xb = /* @__PURE__ */ U({
	__name: "ScheduledPage",
	props: {
		profile: {},
		chatBusy: { type: Boolean },
		offline: { type: Boolean }
	},
	setup(e, { expose: t }) {
		let n = e, r = H_(), i = V_(), a = 0, o = /* @__PURE__ */ V([]), s = /* @__PURE__ */ V(), c = /* @__PURE__ */ V([]), l = /* @__PURE__ */ V(), u = /* @__PURE__ */ V(), d = /* @__PURE__ */ V("active"), f = /* @__PURE__ */ V(!1), p = /* @__PURE__ */ V(""), m = /* @__PURE__ */ V(!1), h = /* @__PURE__ */ V(0), g, _ = Z(() => o.value.filter((e) => y(e) === d.value)), v = Z(() => {
			let e = ts(u.value?.messages.slice().reverse().find((e) => e.role === "assistant" && ts(e.content))?.content) || u.value?.output;
			return e ? [{
				role: "assistant",
				content: e
			}] : [];
		});
		function y(e) {
			return e.state === "completed" || e.state === "error" ? "completed" : e.state === "paused" || e.enabled === !1 ? "paused" : "active";
		}
		function b(e) {
			return e > 0 ? (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString() : "Run date unavailable";
		}
		function x(e) {
			if (!e) return "Never run";
			let t = new Date(e);
			return Number.isNaN(t.getTime()) ? "Last run date unavailable" : `Last run: ${t.toLocaleString()}`;
		}
		function S(e, t) {
			return i.push({
				name: t ? "scheduled-run" : e ? "scheduled-job" : "scheduled",
				params: {
					...e ? { jobId: e } : {},
					...t ? { runId: t } : {}
				},
				query: r.query
			});
		}
		async function C(e) {
			g?.abort();
			let t = new AbortController();
			g = t, f.value = !0, p.value = "";
			try {
				await e(t.signal);
			} catch (e) {
				t.signal.aborted || (p.value = e instanceof Ho && e.status === 503 ? "Scheduled history is unavailable in this Hermes version." : "Could not load scheduled history. The job or output may no longer be available.");
			} finally {
				g === t && (f.value = !1);
			}
		}
		async function w() {
			await C(async (e) => {
				let t = await Q.scheduled(n.profile, e);
				if (!Array.isArray(t.jobs)) throw Error("Invalid scheduled jobs response");
				e.aborted || (o.value = t.jobs);
			});
		}
		async function T(e, t = !1) {
			if (!t) return S(e.id);
			s.value = e, l.value = void 0, u.value = void 0, c.value = [], h.value = 0, m.value = !1, await E();
		}
		async function E(e = !1) {
			await C(async (t) => {
				let r = await Q.scheduledRuns(n.profile, s.value.id, e ? h.value : 0, t);
				t.aborted || (c.value = e ? [...c.value, ...r.runs.filter((e) => !c.value.some((t) => t.id === e.id))] : r.runs, h.value = r.offset + r.runs.length, m.value = r.has_more);
			});
		}
		async function D(e, t = !1) {
			if (!t) return S(s.value.id, e.id);
			l.value = e, u.value = void 0, await C(async (t) => {
				let r = await Q.scheduledOutput(n.profile, s.value.id, e.id, t);
				t.aborted || (u.value = r, typeof r.started_at == "number" && (l.value = {
					...e,
					started_at: r.started_at
				}));
			});
		}
		function O() {
			l.value ? D(l.value, !0) : s.value ? E() : w();
		}
		t({
			retry: O,
			loading: f,
			sessionId: Z(() => u.value?.session_id)
		});
		let k;
		ar(async () => {
			await i.isReady(), !A && (k = Pn(() => [
				n.profile,
				r.params.jobId,
				r.params.runId
			], async () => {
				let e = ++a, t = String(r.params.jobId || ""), n = String(r.params.runId || "");
				if (s.value = void 0, l.value = void 0, u.value = void 0, await w(), e !== a || g?.signal.aborted) return;
				let i = o.value.find((e) => e.id === t);
				if (t && !i) {
					p.value = "This scheduled job is no longer available.";
					return;
				}
				if (i) {
					if (d.value = y(i), await T(i, !0), e !== a || g?.signal.aborted) return;
					n && await D(c.value.find((e) => e.id === n) || {
						id: n,
						started_at: 0,
						source: "cron"
					}, !0);
				}
			}, { immediate: !0 }));
		});
		let A = !1;
		return lr(() => {
			A = !0, k?.(), a++, g?.abort();
		}), (e, t) => (G(), K("section", Nb, [J("div", Pb, [J("div", Fb, [
			J("div", Ib, [J("h2", null, F(s.value?.name || s.value?.id || "Scheduled"), 1)]),
			s.value ? (G(), K("p", Rb, F(l.value ? b(l.value.started_at) : "Run history · newest first"), 1)) : (G(), K("label", Lb, [t[3] ||= Y("Show ", -1), On(J("select", {
				"onUpdate:modelValue": t[0] ||= (e) => d.value = e,
				"aria-label": "Job status"
			}, [...t[2] ||= [
				J("option", { value: "active" }, "Active", -1),
				J("option", { value: "paused" }, "Paused", -1),
				J("option", { value: "completed" }, "Completed", -1)
			]], 512), [[wo, d.value]])])),
			f.value ? (G(), K("p", zb, "Loading scheduled history…")) : X("v-if", !0),
			p.value ? (G(), K("p", Bb, [Y(F(p.value) + " ", 1), J("button", {
				class: "underline",
				onClick: O
			}, "Retry")])) : X("v-if", !0)
		])]), l.value && v.value.length ? (G(), q(Rm, {
			key: l.value.id,
			"follow-initially": !1,
			messages: v.value,
			draft: "",
			loading: !1,
			progress: []
		}, null, 8, ["messages"])) : (G(), K("div", Vb, [
			!f.value && !p.value && !s.value && !_.value.length ? (G(), K("p", Hb, " No " + F(d.value) + " scheduled jobs. ", 1)) : X("v-if", !0),
			s.value ? X("v-if", !0) : (G(), K("nav", Ub, [(G(!0), K(W, null, yr(_.value, (e) => (G(), K("button", {
				key: e.id,
				class: "scheduled-job-row",
				onClick: (t) => T(e)
			}, [J("span", null, [
				J("strong", null, F(e.name || e.id), 1),
				J("small", null, F(e.schedule_display || "Scheduled job"), 1),
				J("small", null, F(x(e.last_run_at)), 1)
			]), t[4] ||= J("span", { "aria-hidden": "true" }, "›", -1)], 8, Wb))), 128))])),
			!f.value && !p.value && s.value && !l.value && !c.value.length ? (G(), K("p", Gb, " No runs yet. ")) : X("v-if", !0),
			s.value && !l.value ? (G(), K("nav", Kb, [(G(!0), K(W, null, yr(c.value, (e) => (G(), K("button", {
				key: e.id,
				onClick: (t) => D(e)
			}, [J("span", null, [
				J("strong", null, F(b(e.started_at)), 1),
				J("small", null, F(e.title || "Job run"), 1),
				J("small", null, F(e.end_reason || (e.source === "cron_output" ? "Saved output" : e.ended_at ? "Finished" : "In progress")), 1)
			]), t[5] ||= J("span", { "aria-hidden": "true" }, "›", -1)], 8, qb))), 128))])) : X("v-if", !0),
			s.value && !l.value && m.value ? (G(), K("button", {
				key: 4,
				class: "project-button",
				disabled: f.value,
				onClick: t[1] ||= (e) => E(!0)
			}, " Load older runs ", 8, Jb)) : X("v-if", !0),
			l.value && u.value && !v.value.length ? (G(), K("p", Yb, " No output was saved for this run. ")) : X("v-if", !0)
		]))]));
	}
}), Zb = /* @__PURE__ */ U({ render: () => null });
function Qb(e = jv(), t) {
	let n = B_({
		history: e,
		routes: [
			{
				path: "/",
				name: "home",
				component: Zb
			},
			{
				path: "/chat/:sessionId",
				name: "chat",
				component: Zb
			},
			{
				path: "/artifacts",
				name: "artifacts",
				component: Zv
			},
			{
				path: "/projects",
				name: "projects",
				component: uy
			},
			{
				path: "/projects/:projectId",
				name: "project",
				component: ab
			},
			{
				path: "/projects/:projectId/artifacts",
				name: "project-artifacts",
				component: ab
			},
			{
				path: "/projects/:projectId/settings",
				name: "project-settings",
				component: ab
			},
			{
				path: "/projects/:projectId/instructions",
				name: "project-instructions",
				component: ab
			},
			{
				path: "/scheduled",
				name: "scheduled",
				component: Xb
			},
			{
				path: "/scheduled/:jobId",
				name: "scheduled-job",
				component: Xb
			},
			{
				path: "/scheduled/:jobId/:runId",
				name: "scheduled-run",
				component: Xb
			},
			{
				path: "/settings",
				name: "settings",
				component: Mb
			},
			{
				path: "/:pathMatch(.*)*",
				redirect: "/"
			}
		]
	});
	n.beforeEach((e) => {
		let t = K_(e.query.profile);
		if (e.query.profile && typeof e.query.profile != "string" || t && !G_.test(t) || Object.entries(e.params).some(([e, t]) => e === "projectId" ? !W_(t) : typeof t != "string" || !U_.test(t)) || e.query.project && !W_(e.query.project) || [e.query.session].some((e) => e && (typeof e != "string" || !U_.test(e)))) return { name: "home" };
		if (e.name === "settings" && e.query.return_to && q_(e.query.return_to) !== e.query.return_to) return {
			name: "settings",
			query: {
				...e.query,
				return_to: "/"
			},
			replace: !0
		};
	});
	let r = t && Y_(t);
	return r && e.replace(r), n;
}
//#endregion
//#region src/main.ts
function $b(e) {
	return Lo(kv).use(Qb(void 0, e));
}
//#endregion
export { kv as App, $b as createChatHermesApp };
