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
}, d = Object.prototype.hasOwnProperty, f = (e, t) => d.call(e, t), p = Array.isArray, m = (e) => C(e) === "[object Map]", h = (e) => C(e) === "[object Set]", g = (e) => C(e) === "[object Date]", _ = (e) => typeof e == "function", v = (e) => typeof e == "string", y = (e) => typeof e == "symbol", b = (e) => typeof e == "object" && !!e, x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch), S = Object.prototype.toString, C = (e) => S.call(e), w = (e) => C(e).slice(8, -1), T = (e) => C(e) === "[object Object]", E = (e) => v(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ n(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), D = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, O = /-\w/g, k = D((e) => e.replace(O, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, A = D((e) => e.replace(te, "-$1").toLowerCase()), ne = D((e) => e.charAt(0).toUpperCase() + e.slice(1)), j = D((e) => e ? `on${ne(e)}` : ""), M = (e, t) => !Object.is(e, t), re = (e, ...t) => {
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
			let r = e[n], i = v(r) ? N(r) : ce(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (v(e) || b(e)) return e;
}
var le = /;(?![^(]*\))/g, ue = /:([^]+)/, de = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function N(e) {
	let t = {};
	return e.replace(de, (e) => e.startsWith("/*") ? "" : e).split(le).forEach((e) => {
		if (e) {
			let n = e.split(ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function fe(e) {
	let t = "";
	if (v(e)) t = e;
	else if (p(e)) for (let n = 0; n < e.length; n++) {
		let r = fe(e[n]);
		r && (t += r + " ");
	}
	else if (b(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var pe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", me = /* @__PURE__ */ n(pe);
pe + "";
function he(e) {
	return !!e || e === "";
}
function ge(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = I(e[i], t[i], n);
	return r;
}
function P(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && I(t, r[a], n)) {
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
	if (r || i || (r = h(e), i = h(t), r || i)) return r && i ? P(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !I(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function F(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function I(e, t, n) {
	if (e === t) return !0;
	let r = g(e), i = g(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = y(e), i = y(t), r || i ? e === t : (r = p(e), i = p(t), r || i ? r && i ? F(e, t, n, ge) : !1 : (r = b(e), i = b(t), r || i ? !r || !i ? !1 : F(e, t, n, _e) : String(e) === String(t))));
}
function ve(e, t) {
	return e.findIndex((e) => I(e, t));
}
var ye = (e) => !!(e && e.__v_isRef === !0), L = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? ye(e) ? L(e.value) : JSON.stringify(e, be, 2) : String(e), be = (e, t) => ye(t) ? be(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[xe(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => xe(e)) } : y(t) ? xe(t) : b(t) && !p(t) && !T(t) ? String(t) : t, xe = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, Se, Ce = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Se && (Se.active ? (this.parent = Se, this.index = (Se.scopes || (Se.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Se;
			try {
				return Se = this, e();
			} finally {
				Se = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Se, Se = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Se === this) Se = this.prevScope;
			else {
				let e = Se;
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
function we() {
	return Se;
}
function Te(e, t = !1) {
	Se && Se.cleanups.push(e);
}
var R, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Se && (Se.active ? Se.effects.push(this) : this.flags &= -2);
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
		this.flags |= 2, We(this), Pe(this);
		let e = R, t = Be;
		R = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), R = e, Be = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Re(e);
			this.deps = this.depsTail = void 0, We(this), this.onStop && this.onStop(), this.flags &= -2;
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
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ge) || (e.globalVersion = Ge, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ie(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = R, r = Be;
	R = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || M(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		R = n, Be = r, Fe(e), e.flags &= -3;
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
function He() {
	Ve.push(Be), Be = !1;
}
function Ue() {
	let e = Ve.pop();
	Be = e === void 0 || e;
}
function We(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = R;
		R = void 0;
		try {
			t();
		} finally {
			R = e;
		}
	}
}
var Ge = 0, Ke = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!R || !Be || R === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== R) t = this.activeLink = new Ke(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ge++, this.notify(e);
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
function Je(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Je(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ye = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol(""), Qe = /* @__PURE__ */ Symbol("");
function $e(e, t, n) {
	if (Be && R) {
		let t = Ye.get(e);
		t || Ye.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new qe()), r.map = t, r.key = n), r.track();
	}
}
function et(e, t, n, r, i, a) {
	let o = Ye.get(e);
	if (!o) {
		Ge++;
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
				(n === "length" || n === Qe || !y(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Qe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Xe)), m(e) && s(o.get(Ze)));
				break;
			case "delete":
				i || (s(o.get(Xe)), m(e) && s(o.get(Ze)));
				break;
			case "set": m(e) && s(o.get(Xe));
		}
	}
	Ne();
}
function tt(e) {
	let t = /* @__PURE__ */ Ht(e);
	return t === e || ($e(t, "iterate", Qe), /* @__PURE__ */ Bt(e)) ? t : /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e) ? t.map((e) => Gt(Wt(e))) : t.map(Gt) : t.map(Wt);
}
function nt(e) {
	return $e(e = /* @__PURE__ */ Ht(e), "iterate", Qe), e;
}
function rt(e, t) {
	return /* @__PURE__ */ zt(e) ? Gt(/* @__PURE__ */ Rt(e) ? Wt(t) : t) : Wt(t);
}
var it = {
	__proto__: null,
	[Symbol.iterator]() {
		return at(this, Symbol.iterator, (e) => rt(this, e));
	},
	concat(...e) {
		return tt(this).concat(...e.map((e) => p(e) ? tt(e) : e));
	},
	entries() {
		return at(this, "entries", (e) => (e[1] = rt(this, e[1]), e));
	},
	every(e, t) {
		return st(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return st(this, "filter", e, t, (e) => e.map((e) => rt(this, e)), arguments);
	},
	find(e, t) {
		return st(this, "find", e, t, (e) => rt(this, e), arguments);
	},
	findIndex(e, t) {
		return st(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return st(this, "findLast", e, t, (e) => rt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return st(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return st(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return lt(this, "includes", e);
	},
	indexOf(...e) {
		return lt(this, "indexOf", e);
	},
	join(e) {
		return tt(this).join(e);
	},
	lastIndexOf(...e) {
		return lt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return st(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ut(this, "pop");
	},
	push(...e) {
		return ut(this, "push", e);
	},
	reduce(e, ...t) {
		return ct(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return ct(this, "reduceRight", e, t);
	},
	shift() {
		return ut(this, "shift");
	},
	some(e, t) {
		return st(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ut(this, "splice", e);
	},
	toReversed() {
		return tt(this).toReversed();
	},
	toSorted(e) {
		return tt(this).toSorted(e);
	},
	toSpliced(...e) {
		return tt(this).toSpliced(...e);
	},
	unshift(...e) {
		return ut(this, "unshift", e);
	},
	values() {
		return at(this, "values", (e) => rt(this, e));
	}
};
function at(e, t, n) {
	let r = nt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Bt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ot = Array.prototype;
function st(e, t, n, r, i, a) {
	let o = nt(e), s = o !== e && !/* @__PURE__ */ Bt(e), c = o[t];
	if (c !== ot[t]) {
		let t = c.apply(e, a);
		return s ? Wt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, rt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function ct(e, t, n, r) {
	let i = nt(e), a = i !== e && !/* @__PURE__ */ Bt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = rt(e, t)), n.call(this, t, rt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? rt(e, c) : c;
}
function lt(e, t, n) {
	let r = /* @__PURE__ */ Ht(e);
	$e(r, "iterate", Qe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Vt(n[0]) ? (n[0] = /* @__PURE__ */ Ht(n[0]), r[t](...n)) : i;
}
function ut(e, t, n = []) {
	He(), Me();
	let r = (/* @__PURE__ */ Ht(e))[t].apply(e, n);
	return Ne(), Ue(), r;
}
var dt = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function pt(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ Ht(this);
	return $e(t, "has", e), t.hasOwnProperty(e);
}
var mt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Mt : jt : i ? At : kt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = p(e);
		if (!r) {
			let e;
			if (a && (e = it[t])) return e;
			if (t === "hasOwnProperty") return pt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Kt(e) ? e : n);
		if ((y(t) ? ft.has(t) : dt(t)) || (r || $e(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Kt(o)) {
			let e = a && E(t) ? o : o.value;
			return r && b(e) ? /* @__PURE__ */ It(e) : e;
		}
		return b(o) ? r ? /* @__PURE__ */ It(o) : /* @__PURE__ */ Pt(o) : o;
	}
}, ht = class extends mt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = p(e) && E(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ zt(i);
			if (!/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (i = /* @__PURE__ */ Ht(i), n = /* @__PURE__ */ Ht(n)), !a && /* @__PURE__ */ Kt(i) && !/* @__PURE__ */ Kt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Kt(e) ? e : r);
		return e === /* @__PURE__ */ Ht(r) && s && (o ? M(n, i) && et(e, "set", t, n, i) : et(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = f(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && et(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!y(t) || !ft.has(t)) && $e(e, "has", t), n;
	}
	ownKeys(e) {
		return $e(e, "iterate", p(e) ? "length" : Xe), Reflect.ownKeys(e);
	}
}, gt = class extends mt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, _t = /* @__PURE__ */ new ht(), vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new ht(!0), bt = (e) => e, xt = (e) => Reflect.getPrototypeOf(e);
function St(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ Ht(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? bt : t ? Gt : Wt;
		return !t && $e(a, "iterate", c ? Ze : Xe), l(Object.create(u), { next() {
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
function Ct(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ Ht(r), a = /* @__PURE__ */ Ht(n);
			e || (M(n, a) && $e(i, "get", n), $e(i, "get", a));
			let { has: o } = xt(i), s = t ? bt : e ? Gt : Wt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && $e(/* @__PURE__ */ Ht(t), "iterate", Xe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Ht(n), i = /* @__PURE__ */ Ht(t);
			return e || (M(t, i) && $e(r, "has", t), $e(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Ht(a), s = t ? bt : e ? Gt : Wt;
			return !e && $e(o, "iterate", Xe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return l(n, e ? {
		add: Ct("add"),
		set: Ct("set"),
		delete: Ct("delete"),
		clear: Ct("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ Ht(this), r = xt(n), i = /* @__PURE__ */ Ht(e), a = !t && !/* @__PURE__ */ Bt(e) && !/* @__PURE__ */ zt(e) ? i : e;
			return r.has.call(n, a) || M(e, a) && r.has.call(n, e) || M(i, a) && r.has.call(n, i) || (n.add(a), et(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (n = /* @__PURE__ */ Ht(n));
			let r = /* @__PURE__ */ Ht(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Ht(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? M(n, s) && et(r, "set", e, n, s) : et(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Ht(this), { has: n, get: r } = xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Ht(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && et(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Ht(this), t = e.size !== 0, n = e.clear();
			return t && et(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = St(r, e, t);
	}), n;
}
function Tt(e, t) {
	let n = wt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(f(n, r) && r in t ? n : t, r, i);
}
var Et = { get: /* @__PURE__ */ Tt(!1, !1) }, Dt = { get: /* @__PURE__ */ Tt(!1, !0) }, Ot = { get: /* @__PURE__ */ Tt(!0, !1) }, kt = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap();
function Nt(e) {
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
function Pt(e) {
	return /* @__PURE__ */ zt(e) ? e : Lt(e, !1, _t, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return Lt(e, !1, yt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Lt(e, !0, vt, Ot, jt);
}
function Lt(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Nt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return /* @__PURE__ */ zt(e) ? /* @__PURE__ */ Rt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Ht(t) : e;
}
function Ut(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && ie(e, "__v_skip", !0), e;
}
var Wt = (e) => b(e) ? /* @__PURE__ */ Pt(e) : e, Gt = (e) => b(e) ? /* @__PURE__ */ It(e) : e;
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function z(e) {
	return Jt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return Jt(e, !0);
}
function Jt(e, t) {
	return /* @__PURE__ */ Kt(e) ? e : new Yt(e, t);
}
var Yt = class {
	constructor(e, t) {
		this.dep = new qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Ht(e), this._value = t ? e : Wt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Bt(e) || /* @__PURE__ */ zt(e);
		e = n ? e : /* @__PURE__ */ Ht(e), M(e, t) && (this._rawValue = e, this._value = n ? e : Wt(e), this.dep.trigger());
	}
};
function B(e) {
	return /* @__PURE__ */ Kt(e) ? e.value : e;
}
var Xt = {
	get: (e, t, n) => t === "__v_raw" ? e : B(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Kt(i) && !/* @__PURE__ */ Kt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Zt(e) {
	return /* @__PURE__ */ Rt(e) ? e : new Proxy(e, Xt);
}
var Qt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ge - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && R !== this) return je(this, !0), !0;
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
function $t(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new Qt(r, i, n);
}
var en = {}, tn = /* @__PURE__ */ new WeakMap(), nn = void 0;
function rn(e, t = !1, n = nn) {
	if (n) {
		let t = tn.get(n);
		t || tn.set(n, t = []), t.push(e);
	}
}
function an(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ Bt(e) || o === !1 || o === 0 ? on(e, 1) : on(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ Kt(e) ? (h = () => e.value, y = /* @__PURE__ */ Bt(e)) : /* @__PURE__ */ Rt(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Rt(e) || /* @__PURE__ */ Bt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Kt(e)) return e.value;
		if (/* @__PURE__ */ Rt(e)) return f(e);
		if (_(e)) return d ? d(e, 2) : e();
	})) : h = _(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (g) {
			He();
			try {
				g();
			} finally {
				Ue();
			}
		}
		let t = nn;
		nn = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			nn = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => on(e(), t);
	}
	let x = we(), S = () => {
		m.stop(), x && x.active && u(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(en) : en, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => M(e, C[t])) : M(n, C))) {
					g && g();
					let e = nn;
					nn = m;
					try {
						let e = [
							n,
							C === en ? void 0 : b && C[0] === en ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						nn = e;
					}
				}
			} else m.run();
		}
	};
	return l && l(w), m = new De(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => rn(e, !1, m), g = m.onStop = () => {
		let e = tn.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			tn.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function on(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Kt(e)) on(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) on(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		on(e, t, n);
	});
	else if (T(e)) {
		for (let r in e) on(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && on(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function sn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		ln(e, t, n);
	}
}
function cn(e, t, n, r) {
	if (_(e)) {
		let i = sn(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			ln(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(cn(e[a], t, n, r));
		return i;
	}
}
function ln(e, t, n, i = !0) {
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
			He(), sn(o, null, 10, [
				e,
				i,
				a
			]), Ue();
			return;
		}
	}
	un(e, n, a, i, s);
}
function un(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var dn = [], fn = -1, pn = [], mn = null, hn = 0, gn = /* @__PURE__ */ Promise.resolve(), _n = null;
function vn(e) {
	let t = _n || gn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function yn(e) {
	let t = fn + 1, n = dn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = dn[r], a = Tn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function bn(e) {
	if (!(e.flags & 1)) {
		let t = Tn(e), n = dn[dn.length - 1];
		!n || !(e.flags & 2) && t >= Tn(n) ? dn.push(e) : dn.splice(yn(t), 0, e), e.flags |= 1, xn();
	}
}
function xn() {
	_n ||= gn.then(En);
}
function Sn(e) {
	if (!p(e)) mn && e.id === -1 ? mn.splice(hn + 1, 0, e) : e.flags & 1 || (pn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) pn.push(e[t]);
	xn();
}
function Cn(e, t, n = fn + 1) {
	for (; n < dn.length; n++) {
		let t = dn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			dn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function wn(e) {
	if (pn.length) {
		let e = [...new Set(pn)].sort((e, t) => Tn(e) - Tn(t));
		if (pn.length = 0, mn) {
			for (let t = 0; t < e.length; t++) mn.push(e[t]);
			return;
		}
		for (mn = e, hn = 0; hn < mn.length; hn++) {
			let e = mn[hn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		mn = null, hn = 0;
	}
}
var Tn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function En(e) {
	try {
		for (fn = 0; fn < dn.length; fn++) {
			let e = dn[fn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), sn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; fn < dn.length; fn++) {
			let e = dn[fn];
			e && (e.flags &= -2);
		}
		fn = -1, dn.length = 0, wn(e), _n = null, (dn.length || pn.length) && En(e);
	}
}
var Dn = null, On = null;
function kn(e) {
	let t = Dn;
	return Dn = e, On = e && e.type.__scopeId || null, t;
}
function An(e, t = Dn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Bi(-1);
		let i = kn(t), a = Ii.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ii.length; e > a; e--) Ri();
			kn(i), r._d && Bi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function jn(e, t) {
	if (Dn === null) return e;
	let n = ba(Dn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && on(o), i.push({
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
function Mn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (He(), cn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ue());
	}
}
function Nn(e, t) {
	if (oa) {
		let n = oa.provides, r = oa.parent && oa.parent.provides;
		r === n && (n = oa.provides = Object.create(r)), n[e] = t;
	}
}
function Pn(e, t, n = !1) {
	let r = sa();
	if (r || Ur) {
		let i = Ur ? Ur._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
var Fn = /* @__PURE__ */ Symbol.for("v-scx"), In = () => Pn(Fn);
function V(e, t, n) {
	return Ln(e, t, n);
}
function Ln(e, t, n = r) {
	let { immediate: i, deep: o, flush: s, once: c } = n, u = l({}, n), d = t && i || !t && s !== "post", f;
	if (pa) {
		if (s === "sync") {
			let e = In();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = oa;
	u.call = (e, t, n) => cn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		bi(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : bn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = an(e, t, u);
	return pa && (f ? f.push(h) : d && h()), h;
}
function Rn(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? zn(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = ua(this), s = Ln(i, a.bind(r), n);
	return o(), s;
}
function zn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Bn = /* @__PURE__ */ Symbol("_vte"), Vn = (e) => e.__isTeleport, Hn = /* @__PURE__ */ Symbol("_leaveCb");
function Un(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Pi) {
			t = n;
			break;
		}
	}
	return t;
}
function Wn(e) {
	if (!$n(e)) return Vn(e.type) && e.children ? Un(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && _(n.default)) return n.default();
	}
}
function Gn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Gn(Vn(n.type) && Wn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function H(e, t) {
	return _(e) ? /* @__PURE__ */ l({ name: e.name }, t, { setup: e }) : e;
}
function Kn() {
	let e = sa();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function qn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Jn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Yn = /* @__PURE__ */ new WeakMap();
function Xn(e, t, n, i, a = !1) {
	if (p(e)) {
		e.forEach((e, r) => Xn(e, t && (p(t) ? t[r] : t), n, i, a));
		return;
	}
	if (Qn(i) && !a) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Xn(e, t, n, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ba(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ Ht(g), b = g === r ? o : (e) => !Jn(h, e) && f(y, e), x = (e, t) => !(t && Jn(h, t));
	if (m != null && m !== d) {
		if (Zn(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ Kt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) sn(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ Kt(d);
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
					i(), Yn.delete(e);
				};
				t.id = -1, Yn.set(e, t), bi(t, n);
			} else Zn(e), i();
		}
	}
}
function Zn(e) {
	let t = Yn.get(e);
	t && (t.flags |= 8, Yn.delete(e));
}
se().requestIdleCallback, se().cancelIdleCallback;
var Qn = (e) => !!e.type.__asyncLoader, $n = (e) => e.type.__isKeepAlive;
function er(e, t) {
	nr(e, "a", t);
}
function tr(e, t) {
	nr(e, "da", t);
}
function nr(e, t, n = oa) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (ir(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) $n(e.parent.vnode) && rr(r, t, n, e), e = e.parent;
	}
}
function rr(e, t, n, r) {
	let i = ir(t, e, r, !0);
	dr(() => {
		u(r[t], i);
	}, n);
}
function ir(e, t, n = oa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			He();
			let i = ua(n), a = cn(t, n, e, r);
			return i(), Ue(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ar = (e) => (t, n = oa) => {
	(!pa || e === "sp") && ir(e, (...e) => t(...e), n);
}, or = ar("bm"), sr = ar("m"), cr = ar("bu"), lr = ar("u"), ur = ar("bum"), dr = ar("um"), fr = ar("sp"), pr = ar("rtg"), mr = ar("rtc");
function hr(e, t = oa) {
	ir("ec", e, t);
}
var gr = /* @__PURE__ */ Symbol.for("v-ndc");
function U(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ Rt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Bt(e), s = /* @__PURE__ */ zt(e), e = nt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Gt(Wt(e[n])) : Wt(e[n]) : e[n], n, void 0, a && a[n]);
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
function _r(e, t) {
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
function vr(e, t, n, r, i, a) {
	if (n ??= {}, Dn.ce || Dn.parent && Qn(Dn.parent) && Dn.parent.ce) {
		let e = a != null && n.key == null ? l({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), G(), Hi(W, null, [qi("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ii.length;
	G();
	let c;
	try {
		let i = o && yr(o(n)), s = n.key || a || i && i.key;
		c = Hi(W, { key: (s && !y(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ii.length; e > s; e--) Ri();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function yr(e) {
	return e.some((e) => !Ui(e) || !(e.type === Pi || e.type === W && !yr(e.children))) ? e : null;
}
var br = (e) => e ? fa(e) ? ba(e) : br(e.parent) : null, xr = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => br(e.parent),
	$root: (e) => br(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Ar(e),
	$forceUpdate: (e) => e.f ||= () => {
		bn(e.update);
	},
	$nextTick: (e) => e.n ||= vn.bind(e.proxy),
	$watch: (e) => Rn.bind(e)
}), Sr = (e, t) => e !== r && !e.__isScriptSetup && f(e, t), Cr = {
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
			else if (Sr(i, t)) return s[t] = 1, i[t];
			else if (a !== r && f(a, t)) return s[t] = 2, a[t];
			else if (f(o, t)) return s[t] = 3, o[t];
			else if (n !== r && f(n, t)) return s[t] = 4, n[t];
			else Tr && (s[t] = 0);
		}
		let u = xr[t], d, p;
		if (u) return t === "$attrs" && $e(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== r && f(n, t)) return s[t] = 4, n[t];
		if (p = l.config.globalProperties, f(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: i, setupState: a, ctx: o } = e;
		return Sr(a, t) ? (a[t] = n, !0) : i !== r && f(i, t) ? (i[t] = n, !0) : f(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== r && c[0] !== "$" && f(e, c) || Sr(t, c) || f(o, c) || f(i, c) || f(xr, c) || f(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? f(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function wr(e) {
	return p(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Tr = !0;
function Er(e) {
	let t = Ar(e), n = e.proxy, r = e.ctx;
	Tr = !1, t.beforeCreate && Or(t.beforeCreate, e, "bc");
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: ee, errorCaptured: D, serverPrefetch: O, expose: k, inheritAttrs: te, components: A, directives: ne, filters: j } = t;
	if (u && Dr(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Pt(t));
	}
	if (Tr = !0, o) for (let e in o) {
		let t = o[e], i = X({
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
	if (c) for (let e in c) kr(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Nn(t, e[t]);
		});
	}
	d && Or(d, e, "c");
	function M(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (M(or, f), M(sr, m), M(cr, h), M(lr, g), M(er, v), M(tr, y), M(hr, D), M(mr, E), M(pr, ee), M(ur, S), M(dr, w), M(fr, O), p(k)) {
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
	T && e.render === a && (e.render = T), te != null && (e.inheritAttrs = te), A && (e.components = A), ne && (e.directives = ne), O && qn(e);
}
function Dr(e, t, n = a) {
	p(e) && (e = Fr(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? Pn(r.from || n, r.default, !0) : Pn(r.from || n) : Pn(r), /* @__PURE__ */ Kt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Or(e, t, n) {
	cn(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function kr(e, t, n, r) {
	let i = r.includes(".") ? zn(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && V(i, n);
	} else if (_(e)) V(i, e.bind(n));
	else if (b(e)) {
		if (p(e)) e.forEach((e) => kr(e, t, n, r));
		else {
			let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
			_(r) && V(i, r, e);
		}
	}
}
function Ar(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => jr(c, e, o, !0)), jr(c, t, o)), b(t) && a.set(t, c), c;
}
function jr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && jr(e, a, n, !0), i && i.forEach((t) => jr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Mr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Mr = {
	data: Nr,
	props: Rr,
	emits: Rr,
	methods: Lr,
	computed: Lr,
	beforeCreate: Ir,
	created: Ir,
	beforeMount: Ir,
	mounted: Ir,
	beforeUpdate: Ir,
	updated: Ir,
	beforeDestroy: Ir,
	beforeUnmount: Ir,
	destroyed: Ir,
	unmounted: Ir,
	activated: Ir,
	deactivated: Ir,
	errorCaptured: Ir,
	serverPrefetch: Ir,
	components: Lr,
	directives: Lr,
	watch: zr,
	provide: Nr,
	inject: Pr
};
function Nr(e, t) {
	return t ? e ? function() {
		return l(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
	} : t : e;
}
function Pr(e, t) {
	return Lr(Fr(e), Fr(t));
}
function Fr(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Ir(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Lr(e, t) {
	return e ? l(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Rr(e, t) {
	return e ? p(e) && p(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : l(/* @__PURE__ */ Object.create(null), wr(e), wr(t ?? {})) : t;
}
function zr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = l(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Ir(e[r], t[r]);
	return n;
}
function Br() {
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
var Vr = 0;
function Hr(e, t) {
	return function(n, r = null) {
		_(n) || (n = l({}, n)), r != null && !b(r) && (r = null);
		let i = Br(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Vr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ca,
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
					let u = c._ceVNode || qi(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, ba(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (cn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Ur;
				Ur = c;
				try {
					return e();
				} finally {
					Ur = t;
				}
			}
		};
		return c;
	};
}
var Ur = null, Wr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${k(t)}Modifiers`] || e[`${A(t)}Modifiers`];
function Gr(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && Wr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = a.map(ae)));
	let c, l = i[c = j(t)] || i[c = j(k(t))];
	!l && o && (l = i[c = j(A(t))]), l && cn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, cn(u, e, 6, a);
	}
}
var Kr = /* @__PURE__ */ new WeakMap();
function qr(e, t, n = !1) {
	let r = n ? Kr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!_(e)) {
		let r = (e) => {
			let n = qr(e, t, !0);
			n && (s = !0, l(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (b(e) && r.set(e, null), null) : (p(a) ? a.forEach((e) => o[e] = null) : l(o, a), b(e) && r.set(e, o), o);
}
function Jr(e, t) {
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, A(t)) || f(e, t));
}
function Yr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = kn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Qi(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = Qi(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? s : Xr(s);
		}
	} catch (t) {
		Ii.length = 0, ln(t, e, 1), v = qi(Pi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = Zr(y, a)), b = Xi(b, y, !1, !0));
	}
	return n.dirs && (b = Xi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Gn(Vn(b.type) && Wn(b) || b, n.transition), v = b, kn(_), v;
}
var Xr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || s(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Zr = (e, t) => {
	let n = {};
	for (let r in e) (!c(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Qr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? $r(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ei(o, r, n) && !Jr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || $r(r, o, l) : !!o;
	return !1;
}
function $r(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ei(t, e, a) && !Jr(n, a)) return !0;
	}
	return !1;
}
function ei(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && b(r) && b(i) ? !I(r, i) : r !== i;
}
function ti({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ni = {}, ri = () => Object.create(ni), ii = (e) => Object.getPrototypeOf(e) === ni;
function ai(e, t, n, r = !1) {
	let i = {}, a = ri();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), si(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Ft(i) : e.type.props ? i : a, e.attrs = a;
}
function oi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Ht(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Jr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (f(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = k(o);
						i[t] = ci(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		si(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = A(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ci(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && et(e.attrs, "set", "");
}
function si(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (ee(r)) continue;
		let l = t[r], u;
		a && f(a, u = k(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Jr(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ Ht(n), i = c || r;
		for (let r = 0; r < o.length; r++) {
			let s = o[r];
			n[s] = ci(a, t, s, i[s], e, !f(i, s));
		}
	}
	return s;
}
function ci(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = f(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && _(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ua(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === A(n)) && (r = !0));
	}
	return r;
}
var li = /* @__PURE__ */ new WeakMap();
function ui(e, t, n = !1) {
	let a = n ? li : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, c = {}, u = [], d = !1;
	if (!_(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = ui(e, t, !0);
			l(c, n), r && u.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return b(e) && a.set(e, i), i;
	if (p(s)) for (let e = 0; e < s.length; e++) {
		let t = k(s[e]);
		di(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = k(e);
		if (di(t)) {
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
function di(e) {
	return e[0] !== "$" && !ee(e);
}
var fi = (e) => e === "_" || e === "_ctx" || e === "$stable", pi = (e) => p(e) ? e.map(Qi) : [Qi(e)], mi = (e, t, n) => {
	if (t._n) return t;
	let r = An((...e) => pi(t(...e)), n);
	return r._c = !1, r;
}, hi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (fi(n)) continue;
		let i = e[n];
		if (_(i)) t[n] = mi(n, i, r);
		else if (i != null) {
			let e = pi(i);
			t[n] = () => e;
		}
	}
}, gi = (e, t) => {
	let n = pi(t);
	e.slots.default = () => n;
}, _i = (e, t, n) => {
	for (let r in t) (n || !fi(r)) && (e[r] = t[r]);
}, vi = (e, t, n) => {
	let r = e.slots = ri();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (_i(r, t, n), n && ie(r, "_", e, !0)) : hi(t, r);
	} else t && gi(e, t);
}, yi = (e, t, n) => {
	let { vnode: i, slots: a } = e, o = !0, s = r;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : _i(a, t, n) : (o = !t.$stable, hi(t, a)), s = t;
	} else t && (gi(e, t), s = { default: 1 });
	if (o) for (let e in a) !fi(e) && s[e] == null && delete a[e];
}, bi = Mi;
function xi(e) {
	return Si(e);
}
function Si(e, t) {
	let n = se();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Wi(e, t) && (r = he(e), de(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === i && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Ni:
				y(e, t, n, r);
				break;
			case Pi:
				b(e, t, n, r);
				break;
			case Fi:
				e ?? x(t, n, r, s);
				break;
			case W:
				A(e, t, n, r, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, a, o, s, c, l) : f & 6 ? ne(e, t, n, r, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, a, o, s, c, l, _e);
		}
		d != null && a ? Xn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Xn(e.ref, null, o, e, !0);
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
				n && n._beginPatch(), O(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && D(e.children, d, null, r, i, Ci(e, a), s, u), _ && Mn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && na(f, r, e);
		}
		_ && Mn(e, null, r, "beforeMount");
		let v = Ti(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && bi(() => {
			try {
				f && na(f, r, e), v && g.enter(d), _ && Mn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || ji(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, D = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? $i(e[l]) : Qi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, O = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && wi(n, !1), (g = h.onVnodeBeforeUpdate) && na(g, n, t, e), f && Mn(t, e, n, "beforeUpdate"), n && wi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? k(e.dynamicChildren, d, l, n, i, Ci(t, a), o) : s || oe(e, t, l, null, n, i, Ci(t, a), o, !1), u > 0) {
			if (u & 16) te(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && te(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && bi(() => {
			g && na(g, n, t, e), f && Mn(t, e, n, "updated");
		}, i);
	}, k = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === W || !Wi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, te = (e, t, n, i, a) => {
		if (t !== n) {
			if (t !== r) for (let r in t) !ee(r) && !(r in n) && c(e, r, t[r], null, a, i);
			for (let r in n) {
				if (ee(r)) continue;
				let o = n[r], s = t[r];
				o !== s && r !== "value" && c(e, r, s, o, a, i);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, A = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), D(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (k(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Ei(e, t, !0)) : oe(e, t, n, f, i, a, s, c, l);
	}, ne = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : j(t, n, r, i, a, o, c) : M(e, t, c);
	}, j = (e, t, n, r, i, a, o) => {
		let s = e.component = aa(e, r, i);
		if ($n(e) && (s.ctx.renderer = _e), ma(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = qi(Pi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, M = (e, t, n) => {
		let r = t.component = e.component;
		if (Qr(e, t, n)) {
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
					let n = Oi(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							bi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				wi(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && na(d, s, t, c), wi(e, !0);
				let f = Yr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), he(p), e, i, a), t.el = f.el, u === null && ti(e, f.el), r && bi(r, i), (d = t.props && t.props.onVnodeUpdated) && bi(() => na(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Qn(t);
				if (wi(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && na(o, d, t), wi(e, !0), s && I) {
					let t = () => {
						e.subTree = Yr(e), I(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Yr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && bi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					bi(() => na(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && bi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => bn(u), wi(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, oi(e, t.props, r, n), yi(e, t.children, n), He(), Cn(e), Ue();
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
		m & 8 ? (u & 16 && me(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? le(l, d, n, r, i, a, o, s, c) : me(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && D(d, n, r, i, a, o, s, c));
	}, ce = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? $i(t[p]) : Qi(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? me(e, a, o, !0, !1, f) : D(t, n, r, a, o, s, c, l, f);
	}, le = (e, t, n, r, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? $i(t[u]) : Qi(t[u]);
			if (Wi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? $i(t[p]) : Qi(t[p]);
			if (Wi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, i = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? $i(t[u]) : Qi(t[u]), n, i, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) de(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? $i(t[u]) : Qi(t[u]);
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
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Wi(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? de(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Di(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ai(f) : r;
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
		if (c === Fi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Hn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), bi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Hn];
					a._isLeaving && a[Hn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, de = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), Xn(s, null, n, e, !0), Ue()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && na(_, t, e), u & 6) pe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Mn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== W || d > 0 && d & 64) ? me(l, t, n, !1, !0) : (a === W && d & 384 || !i && u & 16) && me(c, t, n), r && N(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && bi(() => {
			_ && na(_, t, e), h && Mn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, N = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === W) {
			fe(n, r);
			return;
		}
		if (t === Fi) {
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
		ki(c), ki(l), r && re(r), i.stop(), a ? (a.flags |= 8, de(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, de(o, e, t, n)), s && bi(s, t), bi(() => {
			e.isUnmounted = !0;
		}, t);
	}, me = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) de(e[o], t, n, r, i);
	}, he = (e) => {
		if (e.shapeFlag & 6) return he(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Bn];
		return n ? h(n) : t;
	}, ge = !1, P = (e, t, n) => {
		let r;
		e == null ? t._vnode && (de(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, ge ||= (ge = !0, Cn(r), wn(), !1);
	}, _e = {
		p: v,
		um: de,
		m: ue,
		r: N,
		mt: j,
		mc: D,
		pc: oe,
		pbc: k,
		n: he,
		o: e
	}, F, I;
	return t && ([F, I] = t(_e)), {
		render: P,
		hydrate: F,
		createApp: Hr(P, F)
	};
}
function Ci({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function wi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ti(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ei(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (p(r) && p(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = $i(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ei(t, a)), a.type === Ni && (a.patchFlag === -1 && (a = i[e] = $i(a)), a.el = t.el), a.type === Pi && !a.el && (a.el = t.el);
	}
}
function Di(e) {
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
function Oi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Oi(t);
}
function ki(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ai(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ai(t.subTree) : null;
}
var ji = (e) => e.__isSuspense;
function Mi(e, t) {
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : Sn(e);
}
var W = /* @__PURE__ */ Symbol.for("v-fgt"), Ni = /* @__PURE__ */ Symbol.for("v-txt"), Pi = /* @__PURE__ */ Symbol.for("v-cmt"), Fi = /* @__PURE__ */ Symbol.for("v-stc"), Ii = [], Li = null;
function G(e = !1) {
	Ii.push(Li = e ? null : []);
}
function Ri() {
	Ii.pop(), Li = Ii[Ii.length - 1] || null;
}
var zi = 1;
function Bi(e, t = !1) {
	zi += e, e < 0 && Li && t && (Li.hasOnce = !0);
}
function Vi(e) {
	return e.dynamicChildren = zi > 0 ? Li || i : null, Ri(), zi > 0 && Li && Li.push(e), e;
}
function K(e, t, n, r, i, a) {
	return Vi(q(e, t, n, r, i, a, !0));
}
function Hi(e, t, n, r, i) {
	return Vi(qi(e, t, n, r, i, !0));
}
function Ui(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Wi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Gi = ({ key: e }) => e ?? null, Ki = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ Kt(e) || _(e) ? {
	i: Dn,
	r: e,
	k: t,
	f: !!n
} : e);
function q(e, t = null, n = null, r = 0, i = null, a = e === W ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Gi(t),
		ref: t && Ki(t),
		scopeId: On,
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
		ctx: Dn
	};
	return s ? (ea(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), zi > 0 && !o && Li && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Li.push(c), c;
}
var qi = Ji;
function Ji(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === gr) && (e = Pi), Ui(e)) {
		let r = Xi(e, t, !0);
		return n && ea(r, n), zi > 0 && !a && Li && (r.shapeFlag & 6 ? Li[Li.indexOf(e)] = r : Li.push(r)), r.patchFlag = -2, r;
	}
	if (xa(e) && (e = e.__vccOpts), t) {
		t = Yi(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = fe(e)), b(n) && (/* @__PURE__ */ Vt(n) && !p(n) && (n = l({}, n)), t.style = ce(n));
	}
	let o = v(e) ? 1 : ji(e) ? 128 : Vn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return q(e, t, n, r, i, o, a, !0);
}
function Yi(e) {
	return e ? /* @__PURE__ */ Vt(e) || ii(e) ? l({}, e) : e : null;
}
function Xi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ta(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Gi(l),
		ref: t && t.ref ? n && a ? p(a) ? a.concat(Ki(t)) : [a, Ki(t)] : Ki(t) : a,
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
		ssContent: e.ssContent && Xi(e.ssContent),
		ssFallback: e.ssFallback && Xi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Gn(u, c.clone(u)), u;
}
function J(e = " ", t = 0) {
	return qi(Ni, null, e, t);
}
function Zi(e, t) {
	let n = qi(Fi, null, e);
	return n.staticCount = t, n;
}
function Y(e = "", t = !1) {
	return t ? (G(), Hi(Pi, null, e)) : qi(Pi, null, e);
}
function Qi(e) {
	return e == null || typeof e == "boolean" ? qi(Pi) : p(e) ? qi(W, null, e.slice()) : Ui(e) ? $i(e) : qi(Ni, null, String(e));
}
function $i(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Xi(e);
}
function ea(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (p(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ea(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ii(t) ? t._ctx = Dn : r === 3 && Dn && (Dn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (_(t)) {
		if (r & 65) {
			ea(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Dn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [J(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ta(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = fe([t.class, r.class]));
		else if (e === "style") t.style = ce([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function na(e, t, n, r = null) {
	cn(e, t, 7, [n, r]);
}
var ra = Br(), ia = 0;
function aa(e, t, n) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || ra, o = {
		uid: ia++,
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
		scope: new Ce(!0),
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
		propsOptions: ui(i, a),
		emitsOptions: qr(i, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Gr.bind(null, o), e.ce && e.ce(o), o;
}
var oa = null, sa = () => oa || Dn, ca, la;
{
	let e = se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ca = t("__VUE_INSTANCE_SETTERS__", (e) => oa = e), la = t("__VUE_SSR_SETTERS__", (e) => pa = e);
}
var ua = (e) => {
	let t = oa;
	return ca(e), e.scope.on(), () => {
		e.scope.off(), ca(t);
	};
}, da = () => {
	oa && oa.scope.off(), ca(null);
};
function fa(e) {
	return e.vnode.shapeFlag & 4;
}
var pa = !1;
function ma(e, t = !1, n = !1) {
	t && la(t);
	let { props: r, children: i } = e.vnode, a = fa(e);
	ai(e, r, a, t), vi(e, i, n || t);
	let o = a ? ha(e, t) : void 0;
	return t && la(!1), o;
}
function ha(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Cr);
	let { setup: r } = n;
	if (r) {
		He();
		let n = e.setupContext = r.length > 1 ? ya(e) : null, i = ua(e), a = sn(r, e, 0, [e.props, n]), o = x(a);
		if (Ue(), i(), (o || e.sp) && !Qn(e) && qn(e), o) {
			if (a.then(da, da), t) return a.then((n) => {
				la(!0);
				try {
					ga(e, n, t);
				} finally {
					la(!1);
				}
			}).catch((t) => {
				ln(t, e, 0);
			});
			e.asyncDep = a;
		} else ga(e, a, t);
	} else _a(e, t);
}
function ga(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Zt(t)), _a(e, n);
}
function _a(e, t, n) {
	let r = e.type;
	e.render ||= r.render || a;
	{
		let t = ua(e);
		He();
		try {
			Er(e);
		} finally {
			Ue(), t();
		}
	}
}
var va = { get(e, t) {
	return $e(e, "get", ""), e[t];
} };
function ya(e) {
	return {
		attrs: new Proxy(e.attrs, va),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ba(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Zt(Ut(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in xr) return xr[n](e);
		},
		has(e, t) {
			return t in e || t in xr;
		}
	}) : e.proxy;
}
function xa(e) {
	return _(e) && "__vccOpts" in e;
}
var X = (e, t) => /* @__PURE__ */ $t(e, t, pa);
function Sa(e, t, n) {
	try {
		Bi(-1);
		let r = arguments.length;
		return r === 2 ? b(t) && !p(t) ? Ui(t) ? qi(e, null, [t]) : qi(e, t) : qi(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ui(n) && (n = [n]), qi(e, t, n));
	} finally {
		Bi(1);
	}
}
var Ca = "3.5.43", wa = void 0, Ta = typeof window < "u" && window.trustedTypes;
if (Ta) try {
	wa = /* @__PURE__ */ Ta.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ea = wa ? (e) => wa.createHTML(e) : (e) => e, Da = "http://www.w3.org/2000/svg", Oa = "http://www.w3.org/1998/Math/MathML", ka = typeof document < "u" ? document : null, Aa = ka && /* @__PURE__ */ ka.createElement("template"), ja = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ka.createElementNS(Da, e) : t === "mathml" ? ka.createElementNS(Oa, e) : n ? ka.createElement(e, { is: n }) : ka.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ka.createTextNode(e),
	createComment: (e) => ka.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ka.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Aa.innerHTML = Ea(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Aa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ma = /* @__PURE__ */ Symbol("_vtc");
function Na(e, t, n) {
	let r = e[Ma];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Pa = /* @__PURE__ */ Symbol("_vod"), Fa = /* @__PURE__ */ Symbol("_vsh"), Ia = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Pa] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : La(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), La(e, !0), r.enter(e)) : r.leave(e, () => {
			La(e, !1);
		}) : La(e, t));
	},
	beforeUnmount(e, { value: t }) {
		La(e, t);
	}
};
function La(e, t) {
	e.style.display = t ? e[Pa] : "none", e[Fa] = !t;
}
var Ra = /* @__PURE__ */ Symbol(""), za = /(?:^|;)\s*display\s*:/;
function Ba(e, t, n) {
	let r = e.style, i = v(n), a = !1;
	if (n && !i) {
		if (t) {
			if (v(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ha(r, t, "");
			}
			else for (let e in t) n[e] ?? Ha(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ha(r, i, "") : Ka(e, i, !v(t) && t ? t[i] : void 0, o) || Ha(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Ra];
			e && (n += ";" + e), r.cssText = n, a = za.test(n);
		}
	} else t && e.removeAttribute("style");
	Pa in e && (e[Pa] = a ? r.display : "", e[Fa] && (r.display = "none"));
}
var Va = /\s*!important$/;
function Ha(e, t, n) {
	if (p(n)) n.forEach((n) => Ha(e, t, n));
	else if (n ??= "", t.startsWith("--")) Va.test(n) ? e.setProperty(t, n.replace(Va, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ga(e, t);
		Va.test(n) ? e.setProperty(A(r), n.replace(Va, ""), "important") : e[r] = n;
	}
}
var Ua = [
	"Webkit",
	"Moz",
	"ms"
], Wa = {};
function Ga(e, t) {
	let n = Wa[t];
	if (n) return n;
	let r = k(t);
	if (r !== "filter" && r in e) return Wa[t] = r;
	r = ne(r);
	for (let n = 0; n < Ua.length; n++) {
		let i = Ua[n] + r;
		if (i in e) return Wa[t] = i;
	}
	return t;
}
function Ka(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && v(r) && n === r;
}
var qa = "http://www.w3.org/1999/xlink";
function Ja(e, t, n, r, i, a = me(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(qa, t.slice(6, t.length)) : e.setAttributeNS(qa, t, n) : n == null || a && !he(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
}
function Ya(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ea(n) : n);
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
		r === "boolean" ? n = he(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Xa(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Za(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Qa = /* @__PURE__ */ Symbol("_vei");
function $a(e, t, n, r, i = null) {
	let a = e[Qa] || (e[Qa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = no(t);
		r ? Xa(e, n, a[t] = oo(r, i), s) : o && (Za(e, n, o, s), a[t] = void 0);
	}
}
var eo = /(Once|Passive|Capture)$/, to = /^on:?(?:Once|Passive|Capture)$/;
function no(e) {
	let t, n;
	for (; (n = e.match(eo)) && !to.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : A(e.slice(2)), t];
}
var ro = 0, io = /* @__PURE__ */ Promise.resolve(), ao = () => ro ||= (io.then(() => ro = 0), Date.now());
function oo(e, t) {
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
				e && cn(e, t, 5, a);
			}
		} else cn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ao(), n;
}
var so = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, co = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Na(e, r, o) : t === "style" ? Ba(e, n, r) : s(t) ? c(t) || $a(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : lo(e, t, r, o)) ? (Ya(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ja(e, t, r, o, a, t !== "value")) : e._isVueCE && (uo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? Ya(e, k(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ja(e, t, r, o));
};
function lo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && so(t) && _(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return so(t) && v(n) ? !1 : t in e;
}
function uo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = k(t);
	return Array.isArray(n) ? n.some((e) => k(e) === r) : Object.keys(n).some((e) => k(e) === r);
}
var fo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => re(t, e) : t;
};
function po(e) {
	e.target.composing = !0;
}
function mo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ho = /* @__PURE__ */ Symbol("_assign"), go = /* @__PURE__ */ Symbol("_initialValue");
function _o(e, t, n) {
	return t && (e = e.trim()), n && (e = ae(e)), e;
}
var vo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[go] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[go] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ho] = fo(i);
		let a = r || i.props && i.props.type === "number";
		Xa(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ho](_o(e.value, n, a));
		}), (n || a) && Xa(e, "change", () => {
			e.value = _o(e.value, n, a);
		}), t || (Xa(e, "compositionstart", po), Xa(e, "compositionend", mo), Xa(e, "change", mo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[go];
		delete e[go], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ho](_o(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ho] = fo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ae(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, yo = {
	deep: !0,
	created(e, t, n) {
		e[ho] = fo(n), Xa(e, "change", () => {
			let t = e._modelValue, n = wo(e), r = e.checked, i = e[ho];
			if (p(t)) {
				let e = ve(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (h(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(To(e, r));
		});
	},
	mounted: bo,
	beforeUpdate(e, t, n) {
		e[ho] = fo(n), bo(e, t, n);
	}
};
function bo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (p(t)) i = ve(t, r.props.value) > -1;
	else if (h(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = I(t, To(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var xo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Xa(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ae(wo(e)) : wo(e)), r = e.multiple, i = r ? h(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? p(i) ? t.slice() : t : i];
			try {
				e[ho](i);
			} finally {
				vn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[ho] = fo(r);
	},
	mounted(e, { value: t }) {
		Co(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ho] = fo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !So(t, n[1], n[0])) && Co(e, t);
	}
};
function So(e, t, n) {
	if (!n || p(e)) return I(e, t);
	if (h(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Co(e, t) {
	let n = e.multiple, r = p(t);
	if (!n || r || h(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = wo(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ve(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (I(wo(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function wo(e) {
	return "_value" in e ? e._value : e.value;
}
function To(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Eo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Do = {
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
	exact: (e, t) => Eo.some((n) => e[`${n}Key`] && !t.includes(n))
}, Oo = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Do[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ko = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Ao = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = A(n.key);
		if (t.some((e) => e === r || ko[e] === r)) return e(n);
	}));
}, jo = /* @__PURE__ */ l({ patchProp: co }, ja), Mo;
function No() {
	return Mo ||= xi(jo);
}
var Po = ((...e) => {
	let t = No().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Io(e);
		if (!r) return;
		let i = t._component;
		!_(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Fo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Fo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Io(e) {
	return v(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/vue-router/dist/devtools-BLCumUwL.mjs
var Lo = typeof document < "u";
function Ro(e) {
	return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function zo(e) {
	return e.__esModule || e[Symbol.toStringTag] === "Module" || e.default && Ro(e.default);
}
var Bo = Object.assign;
function Vo(e, t) {
	let n = {};
	for (let r in t) {
		let i = t[r];
		n[r] = Uo(i) ? i.map(e) : e(i);
	}
	return n;
}
var Ho = () => {}, Uo = Array.isArray;
function Wo(e, t) {
	let n = {};
	for (let r in e) n[r] = r in t ? t[r] : e[r];
	return n;
}
var Go = /#/g, Ko = /&/g, qo = /\//g, Jo = /=/g, Yo = /\?/g, Xo = /\+/g, Zo = /%5B/g, Qo = /%5D/g, $o = /%5E/g, es = /%60/g, ts = /%7B/g, ns = /%7C/g, rs = /%7D/g, is = /%20/g;
function as(e) {
	return e == null ? "" : encodeURI("" + e).replace(ns, "|").replace(Zo, "[").replace(Qo, "]");
}
function os(e) {
	return as(e).replace(ts, "{").replace(rs, "}").replace($o, "^");
}
function ss(e) {
	return as(e).replace(Xo, "%2B").replace(is, "+").replace(Go, "%23").replace(Ko, "%26").replace(es, "`").replace(ts, "{").replace(rs, "}").replace($o, "^");
}
function cs(e) {
	return ss(e).replace(Jo, "%3D");
}
function ls(e) {
	return as(e).replace(Go, "%23").replace(Yo, "%3F");
}
function us(e) {
	return ls(e).replace(qo, "%2F");
}
function ds(e) {
	if (e == null) return null;
	try {
		return decodeURIComponent("" + e);
	} catch {}
	return "" + e;
}
function fs(e, t, n = "/") {
	let r, i = {}, a = "", o = "", s = t.indexOf("#"), c = t.indexOf("?");
	return c = s >= 0 && c > s ? -1 : c, c >= 0 && (r = t.slice(0, c), a = t.slice(c, s > 0 ? s : t.length), i = e(a.slice(1))), s >= 0 && (r ||= t.slice(0, s), o = t.slice(s, t.length)), r = ys(r ?? t, n), {
		fullPath: r + a + o,
		path: r,
		query: i,
		hash: ds(o)
	};
}
function ps(e, t) {
	let n = t.query ? e(t.query) : "";
	return t.path + (n && "?") + n + (t.hash || "");
}
function ms(e, t, n) {
	let r = t.matched.length - 1, i = n.matched.length - 1;
	return r > -1 && r === i && hs(t.matched[r], n.matched[i]) && gs(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function hs(e, t) {
	return (e.aliasOf || e) === (t.aliasOf || t);
}
function gs(e, t) {
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let n in e) if (!_s(e[n], t[n])) return !1;
	return !0;
}
function _s(e, t) {
	return Uo(e) ? vs(e, t) : Uo(t) ? vs(t, e) : e === t;
}
function vs(e, t) {
	return Uo(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e.length === 1 && e[0] === t;
}
function ys(e, t) {
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
var bs = {
	path: "/",
	name: void 0,
	params: {},
	query: {},
	hash: "",
	fullPath: "/",
	matched: [],
	meta: {},
	redirectedFrom: void 0
}, xs = /* @__PURE__ */ function(e) {
	return e.pop = "pop", e.push = "push", e;
}({});
function Ss(e, t) {
	let n = document.documentElement.getBoundingClientRect(), r = e.getBoundingClientRect();
	return {
		behavior: t.behavior,
		left: r.left - n.left - (t.left || 0),
		top: r.top - n.top - (t.top || 0)
	};
}
var Cs = () => ({
	left: window.scrollX,
	top: window.scrollY
});
function ws(e) {
	let t;
	if ("el" in e) {
		let n = e.el, r = typeof n == "string" && n.startsWith("#"), i = typeof n == "string" ? r ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
		if (!i) return;
		t = Ss(i, e);
	} else t = e;
	"scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left == null ? window.scrollX : t.left, t.top == null ? window.scrollY : t.top);
}
function Ts(e, t) {
	return (history.state ? history.state.position - t : -1) + e;
}
var Es = /* @__PURE__ */ new Map();
function Ds(e, t) {
	Es.set(e, t);
}
function Os(e) {
	let t = Es.get(e);
	return Es.delete(e), t;
}
function ks(e) {
	return typeof e == "string" || e && typeof e == "object";
}
function As(e) {
	return typeof e == "string" || typeof e == "symbol";
}
var js = /* @__PURE__ */ function(e) {
	return e[e.MATCHER_NOT_FOUND = 1] = "MATCHER_NOT_FOUND", e[e.NAVIGATION_GUARD_REDIRECT = 2] = "NAVIGATION_GUARD_REDIRECT", e[e.NAVIGATION_ABORTED = 4] = "NAVIGATION_ABORTED", e[e.NAVIGATION_CANCELLED = 8] = "NAVIGATION_CANCELLED", e[e.NAVIGATION_DUPLICATED = 16] = "NAVIGATION_DUPLICATED", e;
}({}), Ms = Symbol("");
js.MATCHER_NOT_FOUND, js.NAVIGATION_GUARD_REDIRECT, js.NAVIGATION_ABORTED, js.NAVIGATION_CANCELLED, js.NAVIGATION_DUPLICATED;
function Ns(e, t) {
	return Bo(/* @__PURE__ */ Error(), {
		type: e,
		[Ms]: !0
	}, t);
}
function Ps(e, t) {
	return e instanceof Error && Ms in e && (t == null || !!(e.type & t));
}
function Fs(e) {
	let t = {};
	if (e === "" || e === "?") return t;
	let n = (e[0] === "?" ? e.slice(1) : e).split("&");
	for (let e = 0; e < n.length; ++e) {
		let r = n[e].replace(Xo, " "), i = r.indexOf("="), a = ds(i < 0 ? r : r.slice(0, i)), o = i < 0 ? null : ds(r.slice(i + 1));
		if (a in t) {
			let e = t[a];
			Uo(e) || (e = t[a] = [e]), e.push(o);
		} else t[a] = o;
	}
	return t;
}
function Is(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (n = cs(n), r == null) {
			r !== void 0 && (t += (t.length ? "&" : "") + n);
			continue;
		}
		(Uo(r) ? r.map((e) => e && ss(e)) : [r && ss(r)]).forEach((e) => {
			e !== void 0 && (t += (t.length ? "&" : "") + n, e != null && (t += "=" + e));
		});
	}
	return t;
}
function Ls(e) {
	let t = {};
	for (let n in e) {
		let r = e[n];
		r !== void 0 && (t[n] = Uo(r) ? r.map((e) => e == null ? null : "" + e) : r == null ? r : "" + r);
	}
	return t;
}
var Rs = Symbol(""), zs = Symbol(""), Bs = Symbol(""), Vs = Symbol(""), Hs = Symbol("");
function Us() {
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
function Ws(e, t, n, r, i, a = (e) => e()) {
	let o = r && (r.enterCallbacks[i] = r.enterCallbacks[i] || []);
	return () => new Promise((s, c) => {
		let l = (e) => {
			e === !1 ? c(Ns(js.NAVIGATION_ABORTED, {
				from: n,
				to: t
			})) : e instanceof Error ? c(e) : ks(e) ? c(Ns(js.NAVIGATION_GUARD_REDIRECT, {
				from: t,
				to: e
			})) : (o && r.enterCallbacks[i] === o && typeof e == "function" && o.push(e), s());
		}, u = a(() => e.call(r && r.instances[i], t, n, l)), d = Promise.resolve(u);
		e.length < 3 && (d = d.then(l)), d.catch((e) => c(e));
	});
}
function Gs(e, t, n, r, i = (e) => e()) {
	let a = [];
	for (let o of e) for (let e in o.components) {
		let s = o.components[e];
		if (t === "beforeRouteEnter" || o.instances[e]) {
			if (Ro(s)) {
				let c = (s.__vccOpts || s)[t];
				c && a.push(Ws(c, n, r, o, e, i));
			} else {
				let c = s();
				a.push(() => c.then((a) => {
					if (!a) throw Error(`Couldn't resolve component "${e}" at "${o.path}"`);
					let s = zo(a) ? a.default : a;
					o.mods[e] = a, o.components[e] = s;
					let c = (s.__vccOpts || s)[t];
					return c && Ws(c, n, r, o, e, i)();
				}));
			}
		}
	}
	return a;
}
function Ks(e, t) {
	let n = [], r = [], i = [], a = Math.max(t.matched.length, e.matched.length);
	for (let o = 0; o < a; o++) {
		let a = t.matched[o];
		a && (e.matched.find((e) => hs(e, a)) ? r.push(a) : n.push(a));
		let s = e.matched[o];
		s && (t.matched.find((e) => hs(e, s)) || i.push(s));
	}
	return [
		n,
		r,
		i
	];
}
//#endregion
//#region node_modules/vue-router/dist/vue-router.mjs
var qs = /* @__PURE__ */ function(e) {
	return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.Group = 2] = "Group", e;
}({}), Js = /* @__PURE__ */ function(e) {
	return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.ParamRegExp = 2] = "ParamRegExp", e[e.ParamRegExpEnd = 3] = "ParamRegExpEnd", e[e.EscapeNext = 4] = "EscapeNext", e;
}(Js || {}), Ys = {
	type: qs.Static,
	value: ""
}, Xs = /[a-zA-Z0-9_]/;
function Zs(e) {
	if (!e) return [[]];
	if (e === "/") return [[Ys]];
	if (!e.startsWith("/")) throw Error(`Invalid path "${e}"`);
	function t(e) {
		throw Error(`ERR (${n})/"${l}": ${e}`);
	}
	let n = Js.Static, r = n, i = [], a;
	function o() {
		a && i.push(a), a = [];
	}
	let s = 0, c, l = "", u = "";
	function d() {
		l &&= (n === Js.Static ? a.push({
			type: qs.Static,
			value: l
		}) : n === Js.Param || n === Js.ParamRegExp || n === Js.ParamRegExpEnd ? (a.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`), a.push({
			type: qs.Param,
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
		if (c = e[s++], c === "\\" && n !== Js.ParamRegExp) {
			r = n, n = Js.EscapeNext;
			continue;
		}
		switch (n) {
			case Js.Static:
				c === "/" ? (l && d(), o()) : c === ":" ? (d(), n = Js.Param) : f();
				break;
			case Js.EscapeNext:
				f(), n = r;
				break;
			case Js.Param:
				c === "(" ? n = Js.ParamRegExp : Xs.test(c) ? f() : (d(), n = Js.Static, c !== "*" && c !== "?" && c !== "+" && s--);
				break;
			case Js.ParamRegExp:
				c === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + c : n = Js.ParamRegExpEnd : u += c;
				break;
			case Js.ParamRegExpEnd:
				d(), n = Js.Static, c !== "*" && c !== "?" && c !== "+" && s--, u = "";
				break;
			default: t("Unknown state");
		}
	}
	return n === Js.ParamRegExp && t(`Unfinished custom RegExp for param "${l}"`), d(), o(), i;
}
var Qs = "[^/]+?", $s = {
	sensitive: !1,
	strict: !1,
	start: !0,
	end: !0
}, ec = /* @__PURE__ */ function(e) {
	return e[e._multiplier = 10] = "_multiplier", e[e.Root = 90] = "Root", e[e.Segment = 40] = "Segment", e[e.SubSegment = 30] = "SubSegment", e[e.Static = 40] = "Static", e[e.Dynamic = 20] = "Dynamic", e[e.BonusCustomRegExp = 10] = "BonusCustomRegExp", e[e.BonusWildcard = -50] = "BonusWildcard", e[e.BonusRepeatable = -20] = "BonusRepeatable", e[e.BonusOptional = -8] = "BonusOptional", e[e.BonusStrict = .7000000000000001] = "BonusStrict", e[e.BonusCaseSensitive = .25] = "BonusCaseSensitive", e;
}(ec || {}), tc = /[.+*?^${}()[\]/\\]/g;
function nc(e, t) {
	let n = Bo({}, $s, t), r = [], i = n.start ? "^" : "", a = [];
	for (let t of e) {
		let e = t.length ? [] : [ec.Root];
		n.strict && !t.length && (i += "/");
		for (let r = 0; r < t.length; r++) {
			let o = t[r], s = ec.Segment + (n.sensitive ? ec.BonusCaseSensitive : 0);
			if (o.type === qs.Static) r || (i += "/"), i += o.value.replace(tc, "\\$&"), s += ec.Static;
			else if (o.type === qs.Param) {
				let { value: e, repeatable: n, optional: c, regexp: l } = o;
				a.push({
					name: e,
					repeatable: n,
					optional: c
				});
				let u = l || Qs;
				if (u !== Qs) {
					s += ec.BonusCustomRegExp;
					try {
						`${u}`;
					} catch (t) {
						throw Error(`Invalid custom RegExp for param "${e}" (${u}): ` + t.message);
					}
				}
				let d = n ? `((?:${u})(?:/(?:${u}))*)` : `(${u})`;
				r || (d = c && t.length < 2 ? `(?:/${d})` : "/" + d), c && (d += "?"), i += d, s += ec.Dynamic, c && (s += ec.BonusOptional), n && (s += ec.BonusRepeatable), u === ".*" && (s += ec.BonusWildcard);
			}
			e.push(s);
		}
		r.push(e);
	}
	if (n.strict && n.end) {
		let e = r.length - 1;
		r[e][r[e].length - 1] += ec.BonusStrict;
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
			for (let e of i) if (e.type === qs.Static) n += e.value;
			else if (e.type === qs.Param) {
				let { value: a, repeatable: o, optional: s } = e, c = a in t ? t[a] : "";
				if (Uo(c) && !o) throw Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);
				let l = Uo(c) ? c.join("/") : c;
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
function rc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length;) {
		let r = t[n] - e[n];
		if (r) return r;
		n++;
	}
	return e.length < t.length ? e.length === 1 && e[0] === ec.Static + ec.Segment ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === ec.Static + ec.Segment ? 1 : -1 : 0;
}
function ic(e, t) {
	let n = 0, r = e.score, i = t.score;
	for (; n < r.length && n < i.length;) {
		let e = rc(r[n], i[n]);
		if (e) return e;
		n++;
	}
	if (Math.abs(i.length - r.length) === 1) {
		if (ac(r)) return 1;
		if (ac(i)) return -1;
	}
	return i.length - r.length;
}
function ac(e) {
	let t = e[e.length - 1];
	return e.length > 0 && t[t.length - 1] < 0;
}
var oc = {
	strict: !1,
	end: !0,
	sensitive: !1
};
function sc(e, t, n) {
	let r = Bo(nc(Zs(e.path), n), {
		record: e,
		parent: t,
		children: [],
		alias: []
	});
	return t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r), r;
}
function cc(e, t) {
	let n = [], r = /* @__PURE__ */ new Map();
	t = Wo(oc, t);
	function i(e) {
		return r.get(e);
	}
	function a(e, n, r) {
		let i = !r, s = uc(e);
		s.aliasOf = r && r.record;
		let l = Wo(t, e), u = [s];
		if ("alias" in e) {
			let t = typeof e.alias == "string" ? [e.alias] : e.alias;
			for (let e of t) u.push(uc(Bo({}, s, {
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
			if (d = sc(t, n, l), r ? r.alias.push(d) : (f ||= d, f !== d && f.alias.push(d), i && e.name && !fc(d) && o(e.name)), gc(d) && c(d), s.children) {
				let e = s.children;
				for (let t = 0; t < e.length; t++) a(e[t], d, r && r.children[t]);
			}
			r ||= d;
		}
		return f ? () => {
			o(f);
		} : Ho;
	}
	function o(e) {
		if (As(e)) {
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
		let t = mc(e, n);
		n.splice(t, 0, e), e.record.name && !fc(e) && r.set(e.record.name, e);
	}
	function l(e, t) {
		let i, a = {}, o, s;
		if ("name" in e && e.name) {
			if (i = r.get(e.name), !i) throw Ns(js.MATCHER_NOT_FOUND, { location: e });
			s = i.record.name, a = Bo(lc(t.params, i.keys.filter((e) => !e.optional).concat(i.parent ? i.parent.keys.filter((e) => e.optional) : []).map((e) => e.name)), e.params && lc(e.params, i.keys.map((e) => e.name))), o = i.stringify(a);
		} else if (e.path != null) o = e.path, i = n.find((e) => e.re.test(o)), i && (a = i.parse(o), s = i.record.name);
		else {
			if (i = t.name ? r.get(t.name) : n.find((e) => e.re.test(t.path)), !i) throw Ns(js.MATCHER_NOT_FOUND, {
				location: e,
				currentLocation: t
			});
			s = i.record.name, a = Bo({}, t.params, e.params), o = i.stringify(a);
		}
		let c = [], l = i;
		for (; l;) c.unshift(l.record), l = l.parent;
		return {
			name: s,
			path: o,
			params: a,
			matched: c,
			meta: pc(c)
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
function lc(e, t) {
	let n = {};
	for (let r of t) r in e && (n[r] = e[r]);
	return n;
}
function uc(e) {
	let t = {
		path: e.path,
		redirect: e.redirect,
		name: e.name,
		meta: e.meta || {},
		aliasOf: e.aliasOf,
		beforeEnter: e.beforeEnter,
		props: dc(e),
		children: e.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: "components" in e ? e.components || null : e.component && { default: e.component }
	};
	return Object.defineProperty(t, "mods", { value: {} }), t;
}
function dc(e) {
	let t = {}, n = e.props || !1;
	if ("component" in e) t.default = n;
	else for (let r in e.components) t[r] = typeof n == "object" ? n[r] : n;
	return t;
}
function fc(e) {
	for (; e;) {
		if (e.record.aliasOf) return !0;
		e = e.parent;
	}
	return !1;
}
function pc(e) {
	return e.reduce((e, t) => Bo(e, t.meta), {});
}
function mc(e, t) {
	let n = 0, r = t.length;
	for (; n !== r;) {
		let i = n + r >> 1;
		ic(e, t[i]) < 0 ? r = i : n = i + 1;
	}
	let i = hc(e);
	return i && (r = t.lastIndexOf(i, r - 1)), r;
}
function hc(e) {
	let t = e;
	for (; t = t.parent;) if (gc(t) && ic(e, t) === 0) return t;
}
function gc({ record: e }) {
	return !!(e.name || e.components && Object.keys(e.components).length || e.redirect);
}
function _c(e) {
	let t = Pn(Bs), n = Pn(Vs), r = X(() => {
		let n = B(e.to);
		return t.resolve(n);
	}), i = X(() => {
		let { matched: e } = r.value, { length: t } = e, i = e[t - 1], a = n.matched;
		if (!i || !a.length) return -1;
		let o = a.findIndex(hs.bind(null, i));
		if (o > -1) return o;
		let s = Sc(e[t - 2]);
		return t > 1 && Sc(i) === s && a[a.length - 1].path !== s ? a.findIndex(hs.bind(null, e[t - 2])) : o;
	}), a = X(() => i.value > -1 && xc(n.params, r.value.params)), o = X(() => i.value > -1 && i.value === n.matched.length - 1 && gs(n.params, r.value.params));
	function s(n = {}) {
		if (bc(n)) {
			let n = t[B(e.replace) ? "replace" : "push"](B(e.to)).catch(Ho);
			return e.viewTransition && typeof document < "u" && "startViewTransition" in document && document.startViewTransition(() => n), n;
		}
		return Promise.resolve();
	}
	return {
		route: r,
		href: X(() => r.value.href),
		isActive: a,
		isExactActive: o,
		navigate: s
	};
}
function vc(e) {
	return e.length === 1 ? e[0] : e;
}
var yc = /* @__PURE__ */ H({
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
	useLink: _c,
	setup(e, { slots: t }) {
		let n = /* @__PURE__ */ Pt(_c(e)), { options: r } = Pn(Bs), i = X(() => ({
			[Cc(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive,
			[Cc(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
		}));
		return () => {
			let r = t.default && vc(t.default(n));
			return e.custom ? r : Sa("a", {
				"aria-current": n.isExactActive ? e.ariaCurrentValue : null,
				href: n.href,
				onClick: n.navigate,
				class: i.value
			}, r);
		};
	}
});
function bc(e) {
	if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && (e.button === void 0 || e.button === 0)) {
		if (e.currentTarget && e.currentTarget.getAttribute) {
			let t = e.currentTarget.getAttribute("target");
			if (/\b_blank\b/i.test(t)) return;
		}
		return e.preventDefault && e.preventDefault(), !0;
	}
}
function xc(e, t) {
	for (let n in t) {
		let r = t[n], i = e[n];
		if (typeof r == "string") {
			if (r !== i) return !1;
		} else if (!Uo(i) || i.length !== r.length || r.some((e, t) => e !== i[t])) return !1;
	}
	return !0;
}
function Sc(e) {
	return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
var Cc = (e, t, n) => e ?? t ?? n, wc = /* @__PURE__ */ H({
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
		let r = Pn(Hs), i = X(() => e.route || r.value), a = Pn(zs, 0), o = X(() => {
			let e = B(a), { matched: t } = i.value, n;
			for (; (n = t[e]) && !n.components;) e++;
			return e;
		}), s = X(() => i.value.matched[o.value]);
		Nn(zs, X(() => o.value + 1)), Nn(Rs, s), Nn(Hs, i);
		let c = /* @__PURE__ */ z();
		return V(() => [
			c.value,
			s.value,
			e.name
		], ([e, t, n], [r, i, a]) => {
			t && (t.instances[n] = e, i && i !== t && e && e === r && (t.leaveGuards.size || (t.leaveGuards = i.leaveGuards), t.updateGuards.size || (t.updateGuards = i.updateGuards))), e && t && (!i || !hs(t, i) || !r) && (t.enterCallbacks[n] || []).forEach((t) => t(e));
		}, { flush: "post" }), () => {
			let r = i.value, a = e.name, o = s.value, l = o && o.components[a];
			if (!l) return Tc(n.default, {
				Component: l,
				route: r
			});
			let u = o.props[a], d = Sa(l, Bo({}, u ? u === !0 ? r.params : typeof u == "function" ? u(r) : u : null, t, {
				onVnodeUnmounted: (e) => {
					e.component.isUnmounted && (o.instances[a] = null);
				},
				ref: c
			}));
			return Tc(n.default, {
				Component: d,
				route: r
			}) || d;
		};
	}
});
function Tc(e, t) {
	if (!e) return null;
	let n = e(t);
	return n.length === 1 ? n[0] : n;
}
var Ec = wc;
function Dc(e) {
	let t = cc(e.routes, e), n = e.parseQuery || Fs, r = e.stringifyQuery || Is, i = e.history, a = Us(), o = Us(), s = Us(), c = /* @__PURE__ */ qt(bs), l = bs;
	Lo && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
	let u = Vo.bind(null, (e) => "" + e), d = Vo.bind(null, us), f = Vo.bind(null, ds);
	function p(e, n) {
		let r, i;
		return As(e) ? (r = t.getRecordMatcher(e), i = n) : i = e, t.addRoute(i, r);
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
		if (a = Bo({}, a || c.value), typeof e == "string") {
			let r = fs(n, e, a.path), o = t.resolve({ path: r.path }, a), s = i.createHref(r.fullPath);
			return Bo(r, o, {
				params: f(o.params),
				hash: ds(r.hash),
				redirectedFrom: void 0,
				href: s
			});
		}
		let o;
		if (e.path != null) o = Bo({}, e, { path: fs(n, e.path, a.path).path });
		else {
			let t = Bo({}, e.params);
			for (let e in t) t[e] ?? delete t[e];
			o = Bo({}, e, { params: d(t) }), a.params = d(a.params);
		}
		let s = t.resolve(o, a), l = e.hash || "";
		s.params = u(f(s.params));
		let p = ps(r, Bo({}, e, {
			hash: os(l),
			path: s.path
		})), m = i.createHref(p);
		return Bo({
			fullPath: p,
			hash: l,
			query: r === Is ? Ls(e.query) : e.query || {}
		}, s, {
			redirectedFrom: void 0,
			href: m
		});
	}
	function v(e) {
		return typeof e == "string" ? fs(n, e, c.value.path) : Bo({}, e);
	}
	function y(e, t) {
		if (l !== e) return Ns(js.NAVIGATION_CANCELLED, {
			from: t,
			to: e
		});
	}
	function b(e) {
		return C(e);
	}
	function x(e) {
		return b(Bo(v(e), { replace: !0 }));
	}
	function S(e, t) {
		let n = e.matched[e.matched.length - 1];
		if (n && n.redirect) {
			let { redirect: r } = n, i = typeof r == "function" ? r(e, t) : r;
			return typeof i == "string" && (i = i.includes("?") || i.includes("#") ? i = v(i) : { path: i }, i.params = {}), Bo({
				query: e.query,
				hash: e.hash,
				params: i.path == null ? e.params : {}
			}, i);
		}
	}
	function C(e, t) {
		let n = l = _(e), i = c.value, a = e.state, o = e.force, s = e.replace === !0, u = S(n, i);
		if (u) return C(Bo(v(u), {
			state: typeof u == "object" ? Bo({}, a, u.state) : a,
			force: o,
			replace: s
		}), t || n);
		let d = n;
		d.redirectedFrom = t;
		let f;
		return !o && ms(r, i, n) && (f = Ns(js.NAVIGATION_DUPLICATED, {
			to: d,
			from: i
		}), ie(i, i, !0, !1)), (f ? Promise.resolve(f) : E(d, i)).catch((e) => Ps(e) ? Ps(e, js.NAVIGATION_GUARD_REDIRECT) ? e : re(e) : j(e, d, i)).then((e) => {
			if (e) {
				if (Ps(e, js.NAVIGATION_GUARD_REDIRECT)) return C(Bo({ replace: s }, v(e.to), {
					state: typeof e.to == "object" ? Bo({}, a, e.to.state) : a,
					force: o
				}), t || d);
			} else e = D(d, i, !0, s, a);
			return ee(d, i, e), e;
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
		let n, [r, i, s] = Ks(e, t);
		n = Gs(r.reverse(), "beforeRouteLeave", e, t);
		for (let i of r) i.leaveGuards.forEach((r) => {
			n.push(Ws(r, e, t));
		});
		let c = w.bind(null, e, t);
		return n.push(c), le(n).then(() => {
			n = [];
			for (let r of a.list()) n.push(Ws(r, e, t));
			return n.push(c), le(n);
		}).then(() => {
			n = Gs(i, "beforeRouteUpdate", e, t);
			for (let r of i) r.updateGuards.forEach((r) => {
				n.push(Ws(r, e, t));
			});
			return n.push(c), le(n);
		}).then(() => {
			n = [];
			for (let r of s) if (r.beforeEnter) {
				if (Uo(r.beforeEnter)) for (let i of r.beforeEnter) n.push(Ws(i, e, t));
				else n.push(Ws(r.beforeEnter, e, t));
			}
			return n.push(c), le(n);
		}).then(() => (e.matched.forEach((e) => e.enterCallbacks = {}), n = Gs(s, "beforeRouteEnter", e, t, T), n.push(c), le(n))).then(() => {
			n = [];
			for (let r of o.list()) n.push(Ws(r, e, t));
			return n.push(c), le(n);
		}).catch((e) => Ps(e, js.NAVIGATION_CANCELLED) ? e : Promise.reject(e));
	}
	function ee(e, t, n) {
		s.list().forEach((r) => T(() => r(e, t, n)));
	}
	function D(e, t, n, r, a) {
		let o = y(e, t);
		if (o) return o;
		let s = t === bs, l = Lo ? history.state : {};
		n && (r || s ? i.replace(e.fullPath, Bo({ scroll: s && l && l.scroll }, a)) : i.push(e.fullPath, a)), c.value = e, ie(e, t, n, s), re();
	}
	let O;
	function k() {
		O ||= i.listen((e, t, n) => {
			if (!ce.listening) return;
			let r = _(e), a = S(r, ce.currentRoute.value);
			if (a) {
				C(Bo(a, {
					replace: !0,
					force: !0
				}), r).catch(Ho);
				return;
			}
			l = r;
			let o = c.value;
			Lo && Ds(Ts(o.fullPath, n.delta), Cs()), E(r, o).catch((e) => Ps(e, js.NAVIGATION_ABORTED | js.NAVIGATION_CANCELLED) ? e : Ps(e, js.NAVIGATION_GUARD_REDIRECT) ? (C(Bo(v(e.to), { force: !0 }), r).then((e) => {
				Ps(e, js.NAVIGATION_ABORTED | js.NAVIGATION_DUPLICATED) && !n.delta && n.type === xs.pop && i.go(-1, !1);
			}).catch(Ho), Promise.reject()) : (n.delta && i.go(-n.delta, !1), j(e, r, o))).then((e) => {
				e ||= D(r, o, !1), e && (n.delta && !Ps(e, js.NAVIGATION_CANCELLED) ? i.go(-n.delta, !1) : n.type === xs.pop && Ps(e, js.NAVIGATION_ABORTED | js.NAVIGATION_DUPLICATED) && i.go(-1, !1)), ee(r, o, e);
			}).catch(Ho);
		});
	}
	let te = Us(), A = Us(), ne;
	function j(e, t, n) {
		re(e);
		let r = A.list();
		return r.length ? r.forEach((r) => r(e, t, n)) : console.error(e), Promise.reject(e);
	}
	function M() {
		return ne && c.value !== bs ? Promise.resolve() : new Promise((e, t) => {
			te.add([e, t]);
		});
	}
	function re(e) {
		return ne || (ne = !e, k(), te.list().forEach(([t, n]) => e ? n(e) : t()), te.reset()), e;
	}
	function ie(t, n, r, i) {
		let { scrollBehavior: a } = e;
		if (!Lo || !a) return Promise.resolve();
		let o = !r && Os(Ts(t.fullPath, 0)) || (i || !r) && history.state && history.state.scroll || null;
		return vn().then(() => a(t, n, o)).then((e) => e && ws(e)).catch((e) => j(e, t, n));
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
		onError: A.add,
		isReady: M,
		install(e) {
			e.component("RouterLink", yc), e.component("RouterView", Ec), e.config.globalProperties.$router = ce, Object.defineProperty(e.config.globalProperties, "$route", {
				enumerable: !0,
				get: () => B(c)
			}), Lo && !oe && c.value === bs && (oe = !0, b(i.location).catch((e) => {}));
			let t = {};
			for (let e in bs) Object.defineProperty(t, e, {
				get: () => c.value[e],
				enumerable: !0
			});
			e.provide(Bs, ce), e.provide(Vs, /* @__PURE__ */ Ft(t)), e.provide(Hs, c);
			let n = e.unmount;
			se.add(e), e.unmount = function() {
				se.delete(e), se.size < 1 && (l = bs, O && O(), O = null, c.value = bs, oe = !1, ne = !1), n();
			};
		}
	};
	function le(e) {
		return e.reduce((e, t) => e.then(() => T(t)), Promise.resolve());
	}
	return ce;
}
function Oc() {
	return Pn(Bs);
}
function kc(e) {
	return Pn(Vs);
}
//#endregion
//#region src/composables/usePageHeader.ts
var Ac = Symbol("page header");
function jc() {
	let e = Oc(), t = /* @__PURE__ */ qt();
	return Nn(Ac, (n) => {
		let r = {
			record: e.currentRoute.value.matched.at(-1),
			context: X(n)
		};
		return t.value = r, () => {
			t.value === r && (t.value = void 0);
		};
	}), X(() => {
		let n = e.currentRoute.value, r = t.value;
		return r?.record && n.matched.includes(r.record) ? r.context.value : { title: typeof n.meta.title == "string" ? n.meta.title : "ChatHermes" };
	});
}
function Mc(e) {
	let t = Pn(Ac);
	if (!t) throw Error("page header context is missing");
	Te(t(e));
}
//#endregion
//#region src/router/links.ts
var Nc = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
function Pc(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 4096 && !Array.from(e).some((e) => e.charCodeAt(0) < 32 || e === "?" || e === "#") && !e.split(/[\\/]/).some((e) => e === "." || e === "..");
}
var Fc = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
function Ic(e) {
	return typeof e == "string" ? e : "";
}
function Lc(e) {
	if (typeof e != "string" || !e.startsWith("/") || e.startsWith("//") || /[\\#\r\n]/.test(e)) return "/";
	let t = new URL(e, "https://plugin.invalid");
	return t.pathname === "/settings" || !/^\/(?:chat\/[^/]+|inbox|kanban|artifacts|projects(?:\/[^/]+(?:\/(?:artifacts|settings|instructions))?)?|scheduled(?:\/[^/]+(?:\/[^/]+)?)?)?$/.test(t.pathname) ? "/" : t.pathname + t.search;
}
function Rc(e, t = "", n = {}) {
	return {
		name: e,
		query: {
			...t ? { profile: t } : {},
			...n
		}
	};
}
function zc(e, t = window.location.origin) {
	try {
		let n = new URL(e, t);
		if (n.origin === t && n.pathname === "/chathermes" && n.hash.startsWith("#/")) return n.hash.slice(1);
	} catch {}
}
//#endregion
//#region src/router/notification-navigation.ts
var Bc = "chathermes.notificationNavigation", Vc = "/api/plugins/kanban", Hc = class extends Error {
	status;
	constructor(e) {
		super(e === 409 ? "Hermes refused this operation in the task’s current state. Refresh and check its dependencies or worker." : `Kanban request failed (${e}).`), this.status = e;
	}
};
function Uc(e, t, n = {}) {
	let r = new URLSearchParams(n);
	if (t !== void 0) {
		if (!t) throw Error("Select a board first.");
		r.set("board", t);
	}
	return Vc + e + (r.size ? "?" + r : "");
}
async function Wc(e, t = {}, n, r) {
	let i = new Headers({ accept: "application/json" });
	t.body && !(t.body instanceof FormData) && i.set("content-type", "application/json");
	let a = await fetch(Uc(e, n, r), {
		...t,
		headers: i,
		credentials: "same-origin",
		redirect: "error",
		cache: "no-store"
	});
	if (!a.ok) throw new Hc(a.status);
	return a.json();
}
var Gc = {
	boards: (e) => Wc("/boards", { signal: e }),
	workflow: (e) => Wc("/workflow", { signal: e }),
	board: (e, t, n) => Wc("/board", { signal: n }, e, { include_archived: String(t) }),
	task: (e, t, n) => Wc("/tasks/" + encodeURIComponent(t), { signal: n }, e),
	log: (e, t, n) => Wc(`/tasks/${encodeURIComponent(t)}/log`, { signal: n }, e, { tail: "16384" }),
	write: (e, t, n, r) => Wc(e, {
		method: t,
		...n === void 0 ? {} : { body: JSON.stringify(n) }
	}, r),
	upload: (e, t, n) => {
		let r = new FormData();
		return r.set("file", n), Wc(`/tasks/${encodeURIComponent(t)}/attachments`, {
			method: "POST",
			body: r
		}, e);
	}
};
async function Kc(e, t) {
	let n = window.__HERMES_PLUGIN_SDK__?.buildWsUrl;
	if (!n) throw Error("Dashboard event authentication is unavailable.");
	let r = await n(Vc + "/events", {
		board: e,
		...t === void 0 ? {} : { since: String(t) }
	}), i = new URL(r);
	if (i.host !== location.host || i.protocol !== (location.protocol === "https:" ? "wss:" : "ws:")) throw Error("Invalid dashboard event URL.");
	return i.href;
}
//#endregion
//#region src/features/kanban/context.ts
var qc = "chathermes.kanban-viewer", Jc = Symbol("kanban");
function Yc() {
	try {
		return localStorage.getItem(qc) === "true";
	} catch {
		return !1;
	}
}
function Xc(e) {
	let t = /* @__PURE__ */ qt([]), n = /* @__PURE__ */ z(Yc()), r = /* @__PURE__ */ z(!1), i = /* @__PURE__ */ z(!1), a, o = 0;
	async function s() {
		let t = ++o;
		a?.abort();
		let n = a = new AbortController();
		if (e.value) {
			r.value = !1, i.value = !1;
			return;
		}
		i.value = !0;
		let s = setTimeout(() => n.abort(), 1e4);
		try {
			let e = await Gc.boards(n.signal);
			t === o && (r.value = Array.isArray(e.boards) && typeof e.current == "string" && e.boards.every((e) => typeof e.slug == "string" && !!e.slug));
		} catch {
			t === o && (r.value = !1);
		} finally {
			clearTimeout(s), t === o && (i.value = !1);
		}
	}
	function c(e) {
		if (!e || r.value && !i.value) {
			n.value = e;
			try {
				localStorage.setItem(qc, String(e));
			} catch {}
		}
	}
	function l() {
		document.visibilityState === "visible" && s();
	}
	let u;
	return V(e, () => void s()), sr(() => {
		s(), document.addEventListener("visibilitychange", l), window.addEventListener("online", l), u = setInterval(() => {
			document.visibilityState === "visible" && !i.value && s();
		}, 3e4);
	}), dr(() => {
		o++, a?.abort(), clearInterval(u), document.removeEventListener("visibilitychange", l), window.removeEventListener("online", l);
	}), {
		screenActions: t,
		enabled: /* @__PURE__ */ It(n),
		available: /* @__PURE__ */ It(r),
		checking: /* @__PURE__ */ It(i),
		visible: X(() => n.value && r.value && !e.value),
		setEnabled: c,
		check: s,
		unavailable: () => {
			r.value = !1;
		}
	};
}
function Zc(e) {
	let t = Xc(e);
	return Nn(Jc, t), t;
}
function Qc() {
	let e = Pn(Jc);
	if (!e) throw Error("kanban context is missing");
	return e;
}
//#endregion
//#region src/vendor/hermes/json-rpc-channel.ts
var $c = (e) => typeof e.id == "string" && typeof e.method == "string" && e.method !== "event", el = class extends Error {
	code;
	data;
	constructor(e, t) {
		super(e), this.name = "JsonRpcGatewayError", this.code = t?.code, this.data = t?.data;
	}
}, tl = -32601, nl = -32603, rl = 4404;
function il(e, t = "Hermes RPC failed") {
	let n = e && typeof e == "object" ? e : {};
	return new el(typeof n.message == "string" && n.message ? n.message : t, {
		code: typeof n.code == "number" ? n.code : void 0,
		data: n.data
	});
}
var al = 12e4, ol = 8;
new TextDecoder();
var sl = (e) => {
	e?.unref?.();
}, cl = class {
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
			requestTimeoutMs: e.requestTimeoutMs ?? al,
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
			}, n), this.options.unrefTimers && sl(u.timer)), r && (c = () => {
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
					code: rl,
					message: e
				} });
			}
		};
		for (let r of this.requestHandlers) {
			let i;
			try {
				i = r(o);
			} catch (r) {
				return o.fail(nl, `server request handler crashed: ${t}`), this.options.onRequestHandlerError?.(r instanceof Error ? r : Error(String(r)), {
					id: e,
					method: t,
					params: n
				}), !1;
			}
			if (i !== !1) return !0;
		}
		return o.fail(tl, `no handler for server request: ${t}`), this.options.onUnhandledRequest?.({
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
		if (this.options.heartbeatLiveness === "any-inbound" && (this.lastLivenessAt = Date.now()), $c(t)) {
			let e = t.params && typeof t.params == "object" ? t.params : {};
			return this.deliverRequest(t.id, t.method, e), t;
		}
		if (t.id !== void 0 && t.id !== null) {
			if (typeof t.id == "string" && this.outstandingPings.delete(t.id)) return this.lastLivenessAt = Date.now(), t;
			let e = this.pending.get(t.id);
			return e && (this.lastLivenessAt = Date.now(), this.clearPending(t.id), t.error ? e.reject(il(t.error)) : (this.deliverOpenRequests(t.result), e.resolve(t.result))), t;
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
			this.outstandingPings.add(t), this.outstandingPings.size > ol && this.outstandingPings.delete(this.outstandingPings.values().next().value);
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
		}, this.options.heartbeatIntervalMs), this.options.unrefTimers && sl(this.heartbeatTimer));
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
}, Z = class extends Error {
	outcome;
	constructor(e, t = "unknown") {
		super(e), this.outcome = t;
	}
}, ll = /* @__PURE__ */ new Map(), ul = (e, t) => JSON.stringify([e || "default", t]), dl = {
	snapshot: () => {},
	event: () => {},
	input: () => {},
	requests: () => {},
	connection: () => {},
	recovered: () => {}
}, fl = class e {
	static async discover(t, n, r = {}) {
		let i = new e(t, "", dl);
		try {
			return await i.ensure(), await i.call(n, r);
		} finally {
			i.close();
		}
	}
	static async create(t, n, r) {
		if (ll.size >= 32) throw new Z("Too many unopened drafts", "rejected");
		let i = new e(t, "", dl), a = () => i.close();
		r?.addEventListener("abort", a, { once: !0 });
		try {
			r?.throwIfAborted(), await i.ensure();
			let e = await i.call("session.create", n);
			r?.throwIfAborted();
			let a = e.stored_session_id;
			if (typeof a != "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(a)) throw new Z("Invalid native draft receipt");
			if (!(await fetch(`/api/plugins/chathermes/api/sessions?profile=${encodeURIComponent(t || "default")}`, {
				method: "POST",
				credentials: "same-origin",
				redirect: "manual",
				signal: r,
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					id: a,
					source: "desktop"
				})
			})).ok) throw new Z("Could not persist native draft", "rejected");
			let o = ul(t, a), s = setTimeout(() => {
				ll.get(o)?.viewer === i && ll.delete(o), i.close();
			}, 3e5);
			return ll.set(o, {
				viewer: i,
				timer: s
			}), {
				id: a,
				source: "desktop",
				cwd: e.info?.cwd
			};
		} catch (e) {
			throw i.close(), e;
		} finally {
			r?.removeEventListener("abort", a);
		}
	}
	ws;
	channel;
	abort = new AbortController();
	opening;
	cancelOpening;
	detached = !1;
	failed = !1;
	holding = !0;
	snapshotReceived = !1;
	snapshotBoundary = 0;
	held = [];
	runtime = "";
	sequence = 0;
	requests = /* @__PURE__ */ new Map();
	retainWhileHidden = !0;
	preparing = !1;
	preparationCancelled = !1;
	profile;
	stored;
	hooks;
	constructor(e, t, n) {
		if (this.profile = e, this.stored = t, this.hooks = n, e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw new Z("Invalid profile", "rejected");
		this.channel = new cl({
			requestIdPrefix: "native-",
			heartbeatLiveness: "any-inbound",
			requestTimeoutMs: 95e3,
			onHeartbeatFailure: () => this.disconnected()
		}), this.channel.onRequest((e) => [
			"approval",
			"clarify",
			"secret"
		].includes(e.method) ? this.runtime && e.params.session_id !== this.runtime || e.params.profile && e.params.profile !== (this.profile || "default") ? (e.decline?.("This viewer does not show that session"), !0) : (this.requests.set(e.id, e), this.holding || this.publishRequests(), !0) : !1);
	}
	publishRequests() {
		this.hooks.requests([...this.requests.values()].map(({ id: e, method: t, params: n }) => ({
			id: e,
			method: t,
			params: n
		})));
	}
	ensure() {
		return this.detached || this.failed ? Promise.reject(new Z("Viewer detached")) : this.opening ? this.opening : this.channel.connected && !this.holding ? Promise.resolve() : (this.opening = this.open().catch((e) => {
			throw this.disconnected(), e;
		}), this.opening);
	}
	async open() {
		this.hooks.connection("connecting");
		let e = ll.get(ul(this.profile, this.stored));
		if (this.stored && !e) {
			let e = await fetch(`/api/plugins/chathermes/chat/sessions/${encodeURIComponent(this.stored)}/membership?profile=${encodeURIComponent(this.profile || "default")}`, {
				credentials: "same-origin",
				cache: "no-store",
				redirect: "manual",
				signal: this.abort.signal
			});
			if (!e.ok || e.type === "opaqueredirect") throw new Z("Session unavailable in this profile", "rejected");
		}
		let t = await fetch("/api/auth/ws-ticket", {
			method: "POST",
			credentials: "same-origin",
			cache: "no-store",
			redirect: "manual",
			signal: this.abort.signal
		});
		if (!t.ok || t.type === "opaqueredirect") throw new Z("Dashboard sign-in required", "rejected");
		let { ticket: n } = await t.json();
		if (typeof n != "string" || !n || n.length > 1024) throw new Z("Invalid dashboard ticket", "rejected");
		this.assertLive();
		let r = new URL("/api/ws", location.href);
		r.protocol = location.protocol === "https:" ? "wss:" : "ws:";
		let i = this.ws = new WebSocket(r, ["hermes-gateway-v1", `hermes-gateway-ticket.${n}`]);
		if (i.onmessage = (e) => {
			if (!(this.ws !== i || this.detached)) try {
				if (typeof e.data != "string" || e.data.length > 30408704) throw Error();
				for (let t of e.data.split("\n").filter(Boolean)) {
					let e = JSON.parse(t);
					if (!e || e.jsonrpc !== "2.0" || Array.isArray(e)) throw Error();
					if (e.result?.session_id && Array.isArray(e.result.messages) && (this.snapshotReceived = !0, this.snapshotBoundary = this.held.length), e.method === "event" && e.params?.type === "gateway.ready" && e.params.payload?.session_authority === !0) throw Error("Unsupported native contract");
					if (this.channel.handleFrame(t), e.method === "event") {
						if (!this.holding) this.event(e.params);
						else if (this.snapshotReceived) {
							if (this.held.length >= 2048) throw Error();
							this.held.push(e.params);
						}
					}
				}
			} catch {
				this.disconnected("Native data unavailable. Reconnect to restore this session.");
			}
		}, await new Promise((e, t) => {
			let n = setTimeout(() => {
				t(new Z("Native connection timed out"));
			}, 1e4);
			this.cancelOpening = () => {
				clearTimeout(n), t(new Z("Viewer detached"));
			}, i.onopen = () => {
				if (clearTimeout(n), this.detached || this.ws !== i) {
					t(new Z("Viewer detached"));
					return;
				}
				this.channel.attach({ send: (e) => i.send(e) }), e();
			}, i.onerror = i.onclose = () => {
				clearTimeout(n), t(new Z("Native gateway disconnected"));
			};
		}), this.cancelOpening = void 0, i.onerror = i.onclose = () => this.disconnected(), !this.stored) {
			await this.call("gateway.ping"), this.holding = !1, this.channel.startHeartbeat();
			return;
		}
		this.hooks.connection("recovering");
		let a = await this.call("session.resume", {
			session_id: this.stored,
			source: "desktop",
			cols: 96,
			defer_history: !0,
			omit_messages: !0
		});
		if (this.assertLive(), !a || typeof a.session_id != "string" || !Array.isArray(a.messages)) throw new Z("Invalid native snapshot");
		if ("revision" in a || "execution_generation" in a) throw new Z("Unsupported native contract", "rejected");
		if (this.runtime = a.session_id, a.running || a.queued) {
			this.requests.clear();
			let e = await this.call("session.activate", {
				session_id: this.runtime,
				omit_messages: !0
			});
			if (this.assertLive(), e.session_id !== this.runtime || !Array.isArray(e.messages)) throw new Z("Invalid native recovery confirmation");
			!e.running && !e.queued && (a = e, this.held = this.held.filter((e, t) => t >= this.snapshotBoundary || e.type === "request.cancel"));
		}
		e && ll.get(ul(this.profile, this.stored)) === e && (ll.delete(ul(this.profile, this.stored)), clearTimeout(e.timer), e.viewer.close()), this.hooks.snapshot({
			...a,
			messages_omitted: a.messages_omitted ?? a.hydrating === !0,
			recovery: {
				epoch: "native-snapshot",
				through: 0,
				base_row_ids: null,
				complete: !1
			}
		}), this.holding = !1;
		for (let e of this.held) this.event(e);
		this.held = [], this.publishRequests(), this.channel.startHeartbeat(), this.hooks.connection("open"), this.hooks.recovered();
	}
	event(e) {
		if (!(e.session_id !== this.runtime || e.profile && e.profile !== (this.profile || "default"))) {
			if (this.sequence++, e.type === "request.cancel") {
				let t = e.payload;
				this.requests.delete(String(t?.id || t?.request_id || "")), this.publishRequests();
			}
			this.hooks.event(e);
		}
	}
	assertLive() {
		if (this.detached || this.failed) throw new Z("Viewer detached", "rejected");
	}
	async call(e, t = {}) {
		if (this.assertLive(), !this.channel.connected) throw new Z("Native gateway disconnected", "rejected");
		try {
			let n = {
				...t,
				profile: this.profile || "default"
			};
			return await this.channel.request(e, n);
		} catch (t) {
			throw t instanceof el ? new Z("Hermes could not complete this operation", e === "prompt.submit" || [
				"slash.exec",
				"command.dispatch",
				"session.compress",
				"session.title",
				"config.set"
			].includes(e) && ![
				-32601,
				4001,
				4004,
				4009,
				4064
			].includes(t.code ?? 0) ? "unknown" : "rejected") : t;
		}
	}
	async rpc(e, t = {}) {
		if (this.assertLive(), !this.channel.connected) throw new Z("Native gateway disconnected; message not submitted", "rejected");
		let n = { session_id: this.runtime }, r;
		if (e === "prompt.submit") r = await this.submit(t);
		else if (e === "session.interrupt") this.preparing && (this.preparationCancelled = !0), r = await this.call("session.interrupt", n);
		else if (e === "session.steer") r = await this.call("session.steer", {
			...n,
			text: t.text
		}), r?.status !== "rejected" && this.hooks.input(String(t.text), !0);
		else if ([
			"state",
			"history",
			"reconciled"
		].includes(e)) {
			let i = await this.call("session.activate", {
				...n,
				...e === "history" ? {} : { omit_messages: !0 }
			});
			r = e === "reconciled" ? { settled: !i.running && !i.queued && t.through === this.sequence } : e === "history" ? { messages: i.messages.map((e) => ({
				...e,
				id: e.row_id == null ? void 0 : String(e.row_id),
				content: e.role === "tool" ? e.content : e.text || e.content || ""
			})) } : {
				running: !!i.running,
				queued: !!i.queued,
				delegating: !1
			};
		} else throw new Z("Unsupported native operation", "rejected");
		return r;
	}
	usage() {
		return this.call("session.usage", { session_id: this.runtime });
	}
	contextBreakdown() {
		return this.call("session.context_breakdown", { session_id: this.runtime });
	}
	command(e, t = {}) {
		if (![
			"commands.catalog",
			"complete.slash",
			"command.dispatch",
			"slash.exec",
			"session.compress",
			"session.title",
			"config.get",
			"config.set"
		].includes(e)) throw new Z("Unsupported command operation", "rejected");
		return this.call(e, {
			...t,
			session_id: this.runtime
		});
	}
	async submit(e) {
		if (this.preparing) throw new Z("Submission already in progress", "rejected");
		this.preparing = !0, this.preparationCancelled = !1;
		let t = () => {
			if (this.assertLive(), this.preparationCancelled) throw new Z("Message cancelled before submission", "rejected");
		}, n = !1;
		try {
			let r = await fetch(`/api/plugins/chathermes/chat/prepare?profile=${encodeURIComponent(this.profile || "default")}`, {
				method: "POST",
				credentials: "same-origin",
				cache: "no-store",
				redirect: "manual",
				signal: this.abort.signal,
				headers: { "content-type": "application/json" },
				body: JSON.stringify(e)
			});
			if (!r.ok || r.type === "opaqueredirect") throw new Z("Could not prepare this message; nothing submitted", "rejected");
			let i = await r.json();
			t();
			let a = await this.call("session.activate", {
				session_id: this.runtime,
				omit_messages: !0
			});
			if (a.running || a.queued) throw new Z("This session is busy", "rejected");
			let o = i.input, s = [];
			for (let e of i.files || []) {
				t();
				let n = await this.call("file.attach", {
					session_id: this.runtime,
					...e
				});
				if (!n.attached || typeof n.ref_text != "string") throw new Z("Could not stage this file", "rejected");
				s.push(n.ref_text);
			}
			if (s.length && (o = Array.isArray(o) ? [...o, {
				type: "text",
				text: "\n" + s.join("\n")
			}] : o + "\n" + s.join("\n")), i.model) {
				t(), await this.call("approval.pending", { session_id: this.runtime }), t();
				let e = i.model + " --session" + (i.provider ? " --provider " + i.provider : ""), n = await this.call("config.set", {
					session_id: this.runtime,
					key: "model",
					value: e,
					scope: "session"
				});
				if (n.confirm_required || n.deferred) throw new Z("Selected runtime model unavailable", "rejected");
				let r = await this.call("session.activate", {
					session_id: this.runtime,
					omit_messages: !0
				});
				if (r.info.model !== i.model || i.provider && r.info.provider !== i.provider) throw new Z("Selected runtime model was not applied", "rejected");
			}
			if (i.reasoning_effort !== void 0) {
				t();
				let e = await this.call("config.set", {
					session_id: this.runtime,
					key: "reasoning",
					value: i.reasoning_effort,
					scope: "session"
				});
				t();
				let n = await this.call("config.get", {
					session_id: this.runtime,
					key: "reasoning"
				});
				if (e.deferred || e.confirm_required || n.value !== i.reasoning_effort) throw new Z("Selected reasoning effort was not applied", "rejected");
			}
			t();
			let c = await fetch("/api/auth/ws-ticket", {
				method: "POST",
				credentials: "same-origin",
				redirect: "manual",
				signal: this.abort.signal
			});
			if (!c.ok) throw new Z("Could not retain execution", "rejected");
			let { ticket: l } = await c.json();
			t();
			let u = await fetch(`/api/plugins/chathermes/chat/retain?profile=${encodeURIComponent(this.profile || "default")}`, {
				method: "POST",
				credentials: "same-origin",
				redirect: "manual",
				signal: this.abort.signal,
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					session_id: this.stored,
					ticket: l
				})
			});
			if (!u.ok || (await u.json()).session_id !== this.runtime) throw new Z("Could not retain execution; nothing submitted", "rejected");
			return t(), n = !0, await this.call("prompt.submit", {
				session_id: this.runtime,
				text: o
			});
		} catch (e) {
			throw new Z(n ? "Native submission outcome unknown. Inspect history before sending again." : e instanceof Z ? e.message : "Message preparation failed", n ? "unknown" : "rejected");
		} finally {
			this.preparing = !1;
		}
	}
	async answer(e, t) {
		this.assertLive();
		let n = this.requests.get(e);
		if (!this.channel.connected || !n) throw new Z("Request is no longer open", "rejected");
		n.respond(t), this.requests.delete(e), this.publishRequests();
	}
	get boundary() {
		return this.sequence;
	}
	disconnected(e) {
		this.detached || this.failed || (this.failed = !0, this.dispose(), this.hooks.connection("closed", e));
	}
	dispose() {
		this.abort.abort(), this.cancelOpening?.(), this.cancelOpening = void 0, this.channel.detach(new Z("Viewer detached")), this.ws &&= (this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null, this.ws.close(), void 0), this.requests.clear();
	}
	close() {
		this.detached = !0, this.dispose();
	}
};
//#endregion
//#region src/services/chat-gateway.ts
function pl(e) {
	let t = e;
	if (!t || typeof t != "object" || t.protocol !== "hermes.native.2bd378ed" || t.reviewed_source !== "2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19" || t.mode !== "native-gateway" || t.admission !== !0 || !Array.isArray(t.operations) || !t.operations.every((e) => typeof e == "string") || !Array.isArray(t.blockers) || !t.blockers.every((e) => typeof e == "string") || t.guarantees?.crash_safe_idempotency !== !1 || t.guarantees?.lossless_snapshot_replay !== !1 || t.guarantees?.offline_turn_lease !== !0) throw Error("Unsupported native chat contract");
	return t;
}
async function ml(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	t?.throwIfAborted();
	let n = await fetch(`/api/plugins/chathermes/chat/capabilities?profile=${encodeURIComponent(e || "default")}`, {
		credentials: "same-origin",
		cache: "no-store",
		redirect: "manual",
		signal: t
	});
	if (!n.ok || n.type === "opaqueredirect") throw Error("Sign in to the dashboard to inspect native chat support");
	let r = pl(await n.json()), i = await fetch("/api/auth/ws-ticket", {
		method: "POST",
		credentials: "same-origin",
		cache: "no-store",
		redirect: "manual",
		signal: t
	});
	if (!i.ok || i.type === "opaqueredirect") throw Error("Sign in to the dashboard to inspect native chat support");
	let a = await i.json(), o = a && typeof a == "object" && "ticket" in a ? a.ticket : void 0;
	if (typeof o != "string" || !o || o.length > 1024) throw Error("Invalid dashboard ticket response");
	t?.throwIfAborted();
	let s = new URL("/api/ws", location.href);
	return s.protocol = location.protocol === "https:" ? "wss:" : "ws:", new Promise((n, i) => {
		let a = new WebSocket(s, ["hermes-gateway-v1", `hermes-gateway-ticket.${o}`]), c = !1, l = (e, r) => {
			if (!c) {
				c = !0, clearTimeout(d), t?.removeEventListener("abort", u), a.onopen = a.onmessage = a.onerror = a.onclose = null;
				try {
					a.close();
				} catch {}
				r ? i(r) : n(e);
			}
		}, u = () => l(void 0, /* @__PURE__ */ Error("Native chat probe cancelled")), d = setTimeout(() => l(void 0, /* @__PURE__ */ Error("Native chat probe timed out")), 1e4);
		t?.addEventListener("abort", u, { once: !0 }), a.onopen = () => a.send(JSON.stringify({
			jsonrpc: "2.0",
			id: "capabilities",
			method: "gateway.ping",
			params: { profile: e || "default" }
		})), a.onmessage = (e) => {
			try {
				if (typeof e.data != "string" || e.data.length > 8192) throw Error();
				let t = JSON.parse(e.data);
				if (t.jsonrpc !== "2.0" || Array.isArray(t) || t.method === "event" && t.params?.type === "gateway.ready" && t.params.payload?.session_authority === !0) throw Error();
				if (t.id !== "capabilities" || "method" in t) return;
				if ("error" in t || t.result?.ok !== !0) throw Error();
				l(r);
			} catch {
				l(void 0, /* @__PURE__ */ Error("Unsupported native chat contract"));
			}
		}, a.onerror = a.onclose = () => l(void 0, /* @__PURE__ */ Error("Native chat probe disconnected")), t?.aborted && u();
	});
}
//#endregion
//#region src/services/hermes-api.ts
var hl = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, gl = /* @__PURE__ */ new Set(), _l = /* @__PURE__ */ new Set(), vl = (e, t) => JSON.stringify([e, t]), yl = "/api/plugins/chathermes";
function bl(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:session-activity\/[A-Za-z0-9_-]+|inbox(?:\?[^#]*|\/[0-9]+(?:\/read)?|\/read(?:\?[^#]*)?)?|session-tracking(?:\/[A-Za-z0-9_-]+)?|artifacts\?[^#]*|project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions(?:\?prepare=1)?|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/messages|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/project|\/branch)?|v1\/(?:capabilities|models))$/.test(t)) throw Error("Invalid Hermes API path.");
	return yl + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function xl(e, t, n = {}, r = "application/json") {
	let i = new Headers(n.headers);
	i.set("accept", r), n.body && i.set("content-type", "application/json");
	let a = await fetch(bl(e, t), {
		...n,
		headers: i,
		credentials: "same-origin",
		redirect: "manual",
		cache: "no-store"
	});
	if (a.type === "opaqueredirect" || a.status >= 300 && a.status < 400) throw Error("Hermes redirected the request. Sign in to the dashboard and retry.");
	return a;
}
async function Sl(e, t, n = {}) {
	let r = await xl(e, t, n);
	if (!r.ok) throw new hl(r.status, `Request failed (${r.status})`);
	return r.json();
}
function Cl(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function wl(e) {
	let t = Cl(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function Tl(e) {
	return wl(Cl(e)?.session ?? e);
}
function El(e) {
	let t = Cl(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(wl),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function Dl(e) {
	let t = Cl(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !Cl(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = Cl(t?.pagination);
	return {
		messages: n.map((e) => ({
			...e,
			...Object.hasOwn(e, "display_content") ? { content: e.display_content } : {},
			id: e.id == null ? void 0 : String(e.id)
		})),
		pagination: typeof r?.returned == "number" && typeof r.limit == "number" ? {
			returned: r.returned,
			limit: r.limit,
			order: typeof r.order == "string" ? r.order : void 0
		} : void 0,
		transcript: Cl(t?.transcript)
	};
}
var Q = {
	sessionActivity: (e, t) => Sl("", "/session-activity/" + encodeURIComponent(e || "default"), { signal: t }),
	inbox: (e, t = {}, n) => {
		let r = new URLSearchParams({
			scope: t.scope || "all",
			unread: String(t.unread || !1),
			limit: String(t.limit || 50)
		});
		return t.cursor && r.set("cursor", t.cursor), Sl(t.scope === "profile" ? e : "default", "/inbox?" + r, { signal: n });
	},
	readInbox: (e, t) => Sl(e, "/inbox/" + t + "/read", { method: "PUT" }),
	deleteInboxItem: (e, t) => Sl(e, "/inbox/" + t, { method: "DELETE" }),
	deleteReadInbox: (e, t) => Sl(t === "profile" ? e : "default", "/inbox/read?scope=" + t, { method: "DELETE" }),
	artifacts: (e, t, n, r) => {
		let i = new URLSearchParams({ limit: "50" });
		return t !== void 0 && i.set("project_id", t), n && i.set("cursor", n), Sl(e, `/artifacts?${i}`, { signal: r });
	},
	nativeChatCapabilities: ml,
	isNative: (e) => gl.has(e),
	profiles: async () => {
		let e = await fetch(yl + "/profiles", {
			credentials: "same-origin",
			cache: "no-store"
		});
		if (!e.ok) throw new hl(e.status, "Could not load profiles");
		return e.json();
	},
	scheduled: (e, t) => Sl(e, "/scheduled", { signal: t }),
	scheduledRuns: (e, t, n = 0, r) => Sl(e, `/scheduled/runs?job_id=${encodeURIComponent(t)}&offset=${n}`, { signal: r }),
	scheduledOutput: (e, t, n, r) => Sl(e, `/scheduled/output?job_id=${encodeURIComponent(t)}&run_id=${encodeURIComponent(n)}`, { signal: r }),
	projects: (e, t) => Sl(e, "/projects", { signal: t }),
	project: async (e, t, n) => {
		let r = await Sl(e, `/projects/detail?project_id=${encodeURIComponent(t)}`, { signal: n });
		if (r.project?.id !== t || typeof r.project.label != "string") throw Error("Invalid Hermes Project response");
		return r.project;
	},
	projectInstructions: (e, t, n) => Sl(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, { signal: n }),
	saveProjectInstructions: (e, t, n) => Sl(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify(n)
	}),
	projectManage: (e, t, n) => Sl(e, "/projects/manage", {
		method: "POST",
		body: JSON.stringify({
			action: t,
			...n
		})
	}),
	isWorkspace(e, t) {
		return _l.has(vl(e, t));
	},
	workspace(e, t) {
		_l.add(vl(e, t));
	},
	projectCreate: async (e, t, n) => {
		let r = await Sl(e, `/projects/session?project_id=${encodeURIComponent(t)}&prepare=1`, {
			method: "POST",
			body: "{}",
			signal: n
		}), i = r.native_create ? await fl.create(e, r.native_create, n) : Tl(r);
		return _l.add(vl(e, i.id)), i;
	},
	projectEvents(e, t) {
		if (e && e !== "default") {
			t();
			let e = setInterval(t, 5e3);
			return () => clearInterval(e);
		}
		let n = new EventSource(yl + "/project-events?profile=" + encodeURIComponent(e || "default"), { withCredentials: !0 });
		return n.addEventListener("refresh", t), () => n.close();
	},
	models: (e) => Sl(e, "/v1/models"),
	modelOptions: (e) => Sl(e, "/api/model/options"),
	async upload(e, t) {
		let n = await fetch(yl + "/uploads" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "POST",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t)
		});
		if (!n.ok) throw new hl(n.status, `Upload failed (${n.status})`);
		return n.json();
	},
	capabilities: async (e, t) => {
		let n = await Sl(e, "/v1/capabilities", { signal: t });
		return n.features?.native_chat === !0 ? gl.add(e) : gl.delete(e), n;
	},
	tracking: (e, t) => Sl(e, "/session-tracking", { signal: t }),
	track: (e, t, n) => Sl(e, `/session-tracking/${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify({ status: n })
	}),
	sessions: async (e, t = 0, n) => El(await Sl(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => {
		let n = await Sl(e, "/chat/sessions?prepare=1", {
			method: "POST",
			body: "{}",
			signal: t
		}), r = n.native_create ? await fl.create(e, n.native_create, t) : Tl(n);
		return _l.add(vl(e, r.id)), r;
	},
	session: async (e, t, n) => {
		let r = Tl(await Sl(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n }));
		return (r.cwd || r.source === "desktop") && _l.add(vl(e, t)), r;
	},
	branch: (e, t, n) => Sl(e, `/api/sessions/${encodeURIComponent(t)}/branch`, {
		method: "POST",
		body: JSON.stringify({ response_id: n })
	}),
	rename: async (e, t, n, r) => Tl(await Sl(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	archive: (e, t) => Sl(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ archived: !0 })
	}),
	deleteSession: (e, t) => Sl(e, `/api/sessions/${encodeURIComponent(t)}`, { method: "DELETE" }),
	moveSession: (e, t, n) => Sl(e, `/api/sessions/${encodeURIComponent(t)}/project`, {
		method: "POST",
		body: JSON.stringify({ project_id: n })
	}),
	async latestMessages(e, t, n, r = 0, i) {
		let a;
		try {
			a = Dl(await Sl(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=120&offset=${r}&order=latest&inline_images=false&include_compacted=true&transcript=1${i ? `&revision=${encodeURIComponent(i)}` : ""}`, { signal: n }));
		} catch (r) {
			if (!(r instanceof hl) || r.status !== 404 || !Q.isWorkspace(e, t)) throw r;
			return {
				messages: await Q.messages(e, t, n),
				nextOffset: 0,
				hasMore: !1
			};
		}
		if (a.pagination?.order !== "latest") return {
			messages: !a.pagination || a.messages.length < a.pagination.limit ? a.messages : await Q.messages(e, t, n),
			nextOffset: 0,
			hasMore: !1
		};
		if (a.transcript?.has_more && a.transcript.next_offset <= r) throw Error("History pagination did not advance");
		return {
			messages: a.messages,
			nextOffset: a.transcript?.next_offset ?? r + (a.pagination?.returned ?? a.messages.length),
			hasMore: a.transcript?.has_more ?? !!(a.pagination && a.pagination.returned >= a.pagination.limit && a.messages.length),
			revision: a.transcript?.revision,
			projected: !!a.transcript
		};
	},
	async messages(e, t, n) {
		let r = [], i = "", a = /* @__PURE__ */ new Set();
		for (let o = 0;;) {
			let s;
			try {
				s = Dl(await Sl(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${o}&order=oldest&inline_images=false&include_compacted=true`, { signal: n }));
			} catch (r) {
				if (o === 0 && r instanceof hl && r.status === 404 && _l.has(vl(e, t))) return Dl(await Sl(e, `/workspace/sessions/${encodeURIComponent(t)}/messages`, { signal: n })).messages;
				throw r;
			}
			let c = JSON.stringify(s.messages);
			if (o && c === i) throw Error("History pagination repeated a page");
			if (i = c, r.push(...s.messages.filter((e) => !e.id || !a.has(e.id) && (a.add(e.id), !0))), !s.pagination || s.pagination.returned < s.pagination.limit || !s.messages.length) return r;
			if (s.pagination.returned <= 0) throw Error("History pagination did not advance");
			o += s.pagination.returned;
		}
	}
};
function Ol(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
//#endregion
//#region src/features/projects/utils/projects.ts
function kl(e) {
	return e.path || e.repos.find((e) => e.path)?.path || void 0;
}
function Al(e) {
	let t = e.repos.flatMap((e) => e.groups.flatMap((e) => e.sessions));
	return [...new Map(t.map((e) => [e.id, e])).values()].sort((e, t) => (t.last_active || 0) - (e.last_active || 0));
}
//#endregion
//#region src/features/projects/composables/useProjectWorkspace.ts
function jl(e) {
	let { profile: t, sessions: n, offline: r, navigate: i } = e, a = kc(), o = Oc(), s = X(() => a.query.archived === "1"), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z([]), f = /* @__PURE__ */ z(), p = /* @__PURE__ */ z(!1), m = /* @__PURE__ */ z(!1), h = /* @__PURE__ */ z(""), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z([]), v = /* @__PURE__ */ z(!1), y = X(() => u.value ? f.value ? Al(f.value) : [] : n.value.filter((e) => !_.value.includes(e.id))), b, x;
	function S() {
		b?.(), b = void 0, typeof EventSource < "u" && (b = Q.projectEvents(t.value, () => {
			e.refreshActivity?.(), C(), e.refreshInbox();
		}));
	}
	function C() {
		clearTimeout(x), x = setTimeout(() => {
			E(), u.value && ee();
		}, 100);
	}
	let w, T;
	async function E() {
		w?.abort();
		let e = new AbortController();
		w = e;
		let n = t.value;
		p.value = !v.value, h.value = "";
		try {
			let r = await Q.projects(n, e.signal);
			if (e !== w || e.signal.aborted || n !== t.value) return;
			if (!Array.isArray(r.projects) || r.projects.some((e) => !e || typeof e.id != "string" || typeof e.label != "string")) throw Error("Invalid Hermes Projects response");
			d.value = r.projects, _.value = r.scoped_session_ids || [], v.value = !0;
		} catch {
			e === w && !e.signal.aborted && (h.value = "Could not load Projects.");
		} finally {
			e === w && (p.value = !1);
		}
	}
	async function ee() {
		T?.abort();
		let e = new AbortController();
		T = e;
		let n = t.value, r = u.value;
		if (r) {
			m.value = !f.value, g.value = "";
			try {
				let i = await Q.project(n, r, e.signal);
				e === T && !e.signal.aborted && n === t.value && r === u.value && (f.value = i);
			} catch (t) {
				e === T && !e.signal.aborted && (g.value = t instanceof hl && t.status === 404 ? "Project no longer exists. Return to Other chats." : "Could not load this Project. Retry or return to Other chats.");
			} finally {
				e === T && (m.value = !1);
			}
		}
	}
	async function D(e) {
		return i(e ? {
			...Rc("project", t.value),
			params: { projectId: e }
		} : Rc("home", t.value));
	}
	function O(e = !1) {
		return i(Rc("projects", t.value, e ? { archived: "1" } : {}));
	}
	async function k(n, i) {
		if (c.value || r.value) return;
		let d = t.value, p = e.profileGeneration(), m = u.value, h = o.currentRoute.value;
		c.value = !0, l.value = "";
		try {
			let r = await Q.projectManage(d, n, i);
			if (p !== e.profileGeneration() || d !== t.value || h !== o.currentRoute.value) return;
			n === "create" && r.project?.id ? await D(r.project.id) : m === u.value && a.name !== "projects" && (n === "delete" ? (u.value = "", f.value = void 0, O(s.value)) : n === "archive" ? (u.value = "", f.value = void 0, O(i.restore !== !0)) : await ee()), p === e.profileGeneration() && (await E(), await e.loadSessions());
		} catch {
			p === e.profileGeneration() && d === t.value && h === o.currentRoute.value && (l.value = "Could not save the project. Check its fields and try again.");
		} finally {
			p === e.profileGeneration() && (c.value = !1);
		}
	}
	function te() {
		w?.abort(), T?.abort(), b?.(), b = void 0, clearTimeout(x), v.value = !1, _.value = [], u.value = "", c.value = !1, l.value = "", f.value = void 0, d.value = [], g.value = "", h.value = "", m.value = !1;
	}
	function A(e) {
		T?.abort(), u.value = e, f.value = void 0, g.value = "", m.value = !1, e && ee();
	}
	return Te(() => {
		b?.(), clearTimeout(x), w?.abort(), T?.abort();
	}), {
		projectBusy: c,
		manageError: l,
		projectId: u,
		projects: d,
		selectedProject: f,
		projectsLoading: p,
		projectLoading: m,
		projectsError: h,
		projectError: g,
		projectsLoaded: v,
		visibleSessions: y,
		subscribeProjectEvents: S,
		refreshProjects: C,
		loadProjects: E,
		loadProject: ee,
		chooseProject: D,
		showProjects: O,
		manageProject: k,
		resetProjects: te,
		selectProjectScope: A
	};
}
//#endregion
//#region src/utils/message-image.ts
function Ml(e) {
	return typeof e == "string" && /^(?:data:image\/|https?:\/\/|\/api\/plugins\/chathermes\/artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+$)/.test(e);
}
//#endregion
//#region node_modules/mdurl/lib/decode.mjs
var Nl = {};
function Pl(e) {
	let t = Nl[e];
	if (t) return t;
	t = Nl[e] = [];
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
function Fl(e, t) {
	typeof t != "string" && (t = Fl.defaultChars);
	let n = Pl(t);
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
Fl.defaultChars = ";/?:@&=+$,#", Fl.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var Il = {};
function Ll(e) {
	let t = Il[e];
	if (t) return t;
	t = Il[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function Rl(e, t, n) {
	typeof t != "string" && (n = t, t = Rl.defaultChars), n === void 0 && (n = !0);
	let r = Ll(t), i = "";
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
Rl.defaultChars = ";/?:@&=+$,-_.!~*'()#", Rl.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function zl(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function Bl() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var Vl = /^([a-z0-9.+-]+:)/i, Hl = /:[0-9]*$/, Ul = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Wl = [
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
], Gl = [
	"/",
	"?",
	"#"
], Kl = 255, ql = /^[+a-z0-9A-Z_-]{0,63}$/, Jl = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Yl = {
	javascript: !0,
	"javascript:": !0
}, Xl = {
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
function Zl(e, t) {
	if (e && e instanceof Bl) return e;
	let n = new Bl();
	return n.parse(e, t), n;
}
Bl.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = Ul.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = Vl.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && Yl[o]) && (a = a.substr(2), this.slashes = !0)), !Yl[o] && (i || o && !Xl[o])) {
		let e = -1;
		for (let t = 0; t < Gl.length; t++) r = a.indexOf(Gl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < Wl.length; t++) r = a.indexOf(Wl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(ql)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(ql)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(Jl);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > Kl && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), Xl[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, Bl.prototype.parseHost = function(e) {
	let t = Hl.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region node_modules/mdurl/index.mjs
var Ql = /* @__PURE__ */ t({
	decode: () => Fl,
	encode: () => Rl,
	format: () => zl,
	parse: () => Zl
}), $l = /* @__PURE__ */ t({
	Any: () => eu,
	Cc: () => tu,
	Cf: () => nu,
	P: () => ru,
	S: () => iu,
	Z: () => au
}), eu = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, tu = /[\0-\x1F\x7F-\x9F]/, nu = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, ru = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, iu = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, au = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, ou = [
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
function su(e) {
	return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function cu(e) {
	return su(e) ? 65533 : e >= 128 && e <= 159 && ou[e - 128] || e;
}
function lu(e) {
	return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(cu(e));
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/internal/decode-shared.js
var uu = /* #__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(127), t = 0;
	for (let n = 33; n <= 126; n++) n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
	return e;
})();
function du(e, t, n, r, i, a) {
	let o = e.length, s = a * 90, c = 0, l = () => {
		let t = uu[e.charCodeAt(c++)];
		return t < a ? t : t * 91 - s + uu[e.charCodeAt(c++)];
	}, u = n - r, d = n + i, f = new Int32Array(d);
	f.fill(-1, r, a), f.fill(-1, a + u, d);
	let p = new Int32Array(d), m = new Int32Array(d);
	function h(t, n) {
		let r = 0, i = n, a = n + t;
		for (; i < a;) {
			let t = uu[e.charCodeAt(c++)];
			if (t < 89) r += t, f[i++] = r;
			else if (t === 89) {
				let t = uu[e.charCodeAt(c++)] + 2;
				for (; t--;) f[i++] = ++r;
			} else {
				let t = uu[e.charCodeAt(c++)];
				r += 89 + (t < 90 ? t * 91 + uu[e.charCodeAt(c++)] : uu[e.charCodeAt(c++)] * 8281 + uu[e.charCodeAt(c++)] * 91 + uu[e.charCodeAt(c++)]), f[i++] = r;
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
		let t = uu[e.charCodeAt(c++)];
		t >= a && (t = t * 91 - s + uu[e.charCodeAt(c++)]);
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
var fu = /* #__PURE__ */ du("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61), pu;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(pu ||= {});
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/decode.js
var mu;
(function(e) {
	e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(mu ||= {});
var hu = 32, gu = 21, _u = 2097151, vu = 2047, yu = 0;
function bu(e) {
	let t = e >>> gu;
	return t === vu ? yu : t;
}
function xu(e) {
	return e - mu.ZERO >>> 0 <= 9;
}
function Su(e) {
	return (e | hu) - mu.LOWER_A >>> 0 <= 5;
}
function Cu(e) {
	return (e | hu) - mu.LOWER_A >>> 0 <= 25;
}
function wu(e) {
	return e === mu.EQUALS || Cu(e) || xu(e);
}
var Tu;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Tu ||= {});
var Eu;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Eu ||= {});
function Du(e, t, n, r) {
	let i = (t & pu.BRANCH_LENGTH) >> 7, a = t & pu.JUMP_TABLE;
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
function Ou(e, t, n) {
	return n === 1 ? String.fromCharCode(e[t] & pu.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function ku(e, t, n) {
	let r = t + 1, i = 0, a = r;
	if (r < n && (e.charCodeAt(r) | hu) === mu.LOWER_X) for (r += 1, a = r; r < n;) {
		let t = e.charCodeAt(r);
		if (xu(t)) i = i * 16 + (t - mu.ZERO);
		else if (Su(t)) i = i * 16 + ((t | hu) - mu.LOWER_A + 10);
		else break;
		r += 1;
	}
	else for (; r < n;) {
		let t = e.charCodeAt(r) - mu.ZERO;
		if (t >>> 0 > 9) break;
		i = i * 10 + t, r += 1;
	}
	if (r === a) return 0;
	r < n && e.charCodeAt(r) === mu.SEMI && (r += 1), i > 1114111 && (i = 1114112);
	let o = r - t;
	return o >= vu && (yu = o, o = vu), o << gu | i;
}
function Au(e, t, n) {
	let r = fu, i = e.indexOf("&");
	if (i < 0) return e;
	let a = e.length, o = 0, s = "", c = r[0], l = c & pu.JUMP_TABLE, u = (c & pu.BRANCH_LENGTH) >> 7;
	do {
		let c = i + 1, d = e.charCodeAt(c), f, p;
		if (d === mu.NUM) {
			let n = ku(e, c, a);
			f = bu(n), t && f > 0 && e.charCodeAt(c + f - 1) !== mu.SEMI && (f = 0), p = f === 0 ? "" : lu(n & _u);
		} else if (Cu(d)) {
			f = 0, p = "";
			let n = d - l, i;
			if (n >>> 0 < u) {
				let e = r[1 + n];
				i = e === 0 ? -1 : u + e & 65535;
			} else i = -1;
			let o = 0, s = 0, m = i < 0 ? 0 : r[i], h = c + 1;
			trie: for (; h < a;) {
				for (; (m & (pu.VALUE_LENGTH | pu.FLAG13)) === 0 && (m & pu.JUMP_TABLE) !== 0;) {
					let t = m & pu.JUMP_TABLE, n = (m & pu.BRANCH_LENGTH) >> 7;
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
				if ((m & (pu.VALUE_LENGTH | pu.FLAG13)) === pu.FLAG13) {
					let t = (m & pu.BRANCH_LENGTH) >> 7;
					if (e.charCodeAt(h) !== (m & pu.JUMP_TABLE)) break;
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
					if (l === mu.SEMI) {
						f = h - c + 1, p = n === 1 ? String.fromCharCode(m & pu.VALUE_MASK) : Ou(r, i, n);
						break;
					}
					if (!t && (m & pu.FLAG13) === 0 && (f = h - c, o = i, s = n), n === 1) break;
				}
				let u = Du(r, m, i + (n || 1), l);
				if (u < 0) break;
				i = u, m = r[i], h += 1;
			}
			if (p === "") {
				let e = m >>> 14;
				e !== 0 && !t && (m & pu.FLAG13) === 0 && (f = h - c, o = i, s = e), f > 0 && (p = Ou(r, o, s));
			}
		} else f = 0, p = "";
		f === 0 || n && d !== mu.NUM && e.charCodeAt(c + f - 1) !== mu.SEMI && c + f < a && wu(e.charCodeAt(c + f)) ? i = c : (o < i && (s += e.slice(o, i)), s += p, i = o = c + f), e.charCodeAt(i) !== mu.AMP && (i = e.indexOf("&", i));
	} while (i >= 0);
	return s + e.slice(o);
}
function ju(e) {
	return Au(e, !0, !1);
}
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var Mu = class {
	src_Any = eu.source;
	src_Cc = tu.source;
	src_Z = au.source;
	src_P = ru.source;
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
}, Nu = {
	validate: (e, t, n) => {
		let r = n.re.get_http_validator();
		r.lastIndex = t;
		let i = r.exec(e);
		return i ? i[0].length : 0;
	},
	normalize: (e, t) => t.normalize(e)
}, Pu = {
	"http:": Nu,
	"https:": Nu,
	"ftp:": Nu,
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
}, Fu = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", Iu = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function Lu() {
	let e = Iu.split("|");
	return Fu.split("|").forEach((t) => {
		let n = t.indexOf(":"), r = t.slice(0, n);
		for (let i of t.slice(n + 1)) e.push(r + i);
	}), e;
}
var Ru = {
	fuzzyLink: !1,
	fuzzyEmail: !0,
	fuzzyIP: !1,
	"---": !1,
	tlds: Lu(),
	urlAuth: !1,
	maxLength: 1e4
}, zu = class {
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
}, Bu = class {
	__opts__;
	__schemas__;
	re;
	constructor(e = {}) {
		let { rebuilder: t, ...n } = e;
		this.__opts__ = {
			...Ru,
			...n
		}, this.__schemas__ = { ...Pu }, this.re = t || new Mu(), this.re.set({
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
			let _ = new zu(e, g.schema, g.index, g.lastIndex);
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
		let r = new zu(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
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
}, Vu = 2147483647, Hu = 36, Uu = 1, Wu = 26, Gu = 38, Ku = 700, qu = 72, Ju = 128, Yu = "-", Xu = /^xn--/, Zu = /[^\0-\x7F]/, Qu = /[\x2E\u3002\uFF0E\uFF61]/g, $u = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, ed = 35, td = Math.floor, nd = String.fromCharCode;
function rd(e) {
	throw RangeError($u[e]);
}
function id(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function ad(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(Qu, ".");
	let i = id(e.split("."), t).join(".");
	return r + i;
}
function od(e) {
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
var sd = (e) => String.fromCodePoint(...e), cd = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : Hu;
}, ld = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, ud = function(e, t, n) {
	let r = 0;
	for (e = n ? td(e / Ku) : e >> 1, e += td(e / t); e > 455; r += Hu) e = td(e / ed);
	return td(r + 36 * e / (e + Gu));
}, dd = function(e) {
	let t = [], n = e.length, r = 0, i = Ju, a = qu, o = e.lastIndexOf(Yu);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && rd("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = Hu;; i += Hu) {
			s >= n && rd("invalid-input");
			let o = cd(e.charCodeAt(s++));
			o >= Hu && rd("invalid-input"), o > td((Vu - r) / t) && rd("overflow"), r += o * t;
			let c = i <= a ? Uu : i >= a + Wu ? Wu : i - a;
			if (o < c) break;
			let l = Hu - c;
			t > td(Vu / l) && rd("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = ud(r - o, c, o == 0), td(r / c) > Vu - i && rd("overflow"), i += td(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, fd = function(e) {
	let t = [];
	e = od(e);
	let n = e.length, r = Ju, i = 0, a = qu;
	for (let n of e) n < 128 && t.push(nd(n));
	let o = t.length, s = o;
	for (o && t.push(Yu); s < n;) {
		let n = Vu;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > td((Vu - i) / c) && rd("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > Vu && rd("overflow"), n === r) {
			let e = i;
			for (let n = Hu;; n += Hu) {
				let r = n <= a ? Uu : n >= a + Wu ? Wu : n - a;
				if (e < r) break;
				let i = e - r, o = Hu - r;
				t.push(nd(ld(r + i % o, 0))), e = td(i / o);
			}
			t.push(nd(ld(e, 0))), a = ud(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, pd = {
	version: "2.3.1",
	ucs2: {
		decode: od,
		encode: sd
	},
	decode: dd,
	encode: fd,
	toASCII: function(e) {
		return ad(e, function(e) {
			return Zu.test(e) ? "xn--" + fd(e) : e;
		});
	},
	toUnicode: function(e) {
		return ad(e, function(e) {
			return Xu.test(e) ? dd(e.slice(4).toLowerCase()) : e;
		});
	}
}, md = Object.defineProperty, hd = (e, t) => {
	let n = {};
	for (var r in e) md(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || md(n, Symbol.toStringTag, { value: "Module" }), n;
}, gd = /* @__PURE__ */ hd({
	arrayReplaceAt: () => vd,
	asciiTrim: () => Vd,
	callable: () => _d,
	escapeHtml: () => jd,
	escapeRE: () => Nd,
	fromCodePoint: () => bd,
	isMdAsciiPunct: () => Rd,
	isPunctChar: () => Id,
	isPunctCharCode: () => Ld,
	isSpace: () => Pd,
	isValidEntityCode: () => yd,
	isWhiteSpace: () => Fd,
	lib: () => Hd,
	normalizeReference: () => zd,
	unescapeAll: () => Ed,
	unescapeMd: () => Td
});
function _d(e) {
	let t = function(...n) {
		return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
	};
	return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function vd(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function yd(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function bd(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var xd = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, Sd = RegExp(`${xd.source}|&([a-z#][a-z0-9]{1,31});`, "gi"), Cd = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function wd(e, t) {
	if (t.charCodeAt(0) === 35 && Cd.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return yd(n) ? bd(n) : e;
	}
	let n = ju(e);
	return n === e ? e : n;
}
function Td(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(xd, "$1");
}
function Ed(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(Sd, function(e, t, n) {
		return t || wd(e, n);
	});
}
var Dd = /[&<>"]/, Od = /[&<>"]/g, kd = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Ad(e) {
	return kd[e];
}
function jd(e) {
	return Dd.test(e) ? e.replace(Od, Ad) : e;
}
var Md = /[.?*+^$[\]\\(){}|-]/g;
function Nd(e) {
	return e.replace(Md, "\\$&");
}
function Pd(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function Fd(e) {
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
function Id(e) {
	return ru.test(e) || iu.test(e);
}
function Ld(e) {
	return Id(bd(e));
}
function Rd(e) {
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
function zd(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function Bd(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function Vd(e) {
	let t = 0;
	for (; t < e.length && Bd(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && Bd(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var Hd = {
	mdurl: Ql,
	ucmicro: $l
};
function Ud(e, t, n) {
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
function Wd(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = Ed(e.slice(t + 1, i)), a.ok = !0, a;
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
	return t === i || o !== 0 ? a : (a.str = Ed(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function Gd(e, t, n, r) {
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
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += Ed(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += Ed(e.slice(t, a)), o;
}
var Kd = /* @__PURE__ */ hd({
	parseLinkDestination: () => Wd,
	parseLinkLabel: () => Ud,
	parseLinkTitle: () => Gd
});
function qd(e) {
	"@babel/helpers - typeof";
	return qd = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, qd(e);
}
function Jd(e, t) {
	if (qd(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (qd(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Yd(e) {
	var t = Jd(e, "string");
	return qd(t) == "symbol" ? t : t + "";
}
function $(e, t, n) {
	return (t = Yd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
var Xd = class {
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
}, Zd = class {
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
}, Qd = {};
Qd.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return `<code${i.renderAttrs(a)}>${jd(a.content)}</code>`;
}, Qd.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return `<pre${i.renderAttrs(a)}><code>${jd(e[t].content)}</code></pre>\n`;
}, Qd.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? Ed(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || jd(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", `${n.langPrefix}${s}`]) : (t[e] = [t[e][0], t[e][1]], t[e][1] += ` ${n.langPrefix}${s}`);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, Qd.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, Qd.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, Qd.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, Qd.text = function(e, t) {
	return jd(e[t].content);
}, Qd.html_block = function(e, t) {
	return e[t].content;
}, Qd.html_inline = function(e, t) {
	return e[t].content;
};
var $d = class {
	constructor() {
		$(this, "rules", Object.assign({}, Qd));
	}
	renderAttrs(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${jd(e.attrs[t][0])}="${jd(String(e.attrs[t][1]))}"`;
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
}, ef = class {
	constructor(e, t, n) {
		$(this, "tokens", []), $(this, "inlineMode", !1), $(this, "Token", Xd), this.src = e, this.env = n, this.md = t;
	}
}, tf = /\r\n?/g, nf = /\0/g;
function rf(e) {
	let t;
	t = e.src.replace(tf, "\n"), t = t.replace(nf, "�"), e.src = t;
}
function af(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function of(e) {
	let t = e.tokens, n = 0;
	for (let e = 0; e < t.length; e++) t[e].type !== "reference_definition" && (e !== n && (t[n] = t[e]), n++);
	t.length !== n && (t.length = n);
}
function sf(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function cf(e) {
	return /^<a[>\s]/i.test(e);
}
function lf(e) {
	return /^<\/a\s*>/i.test(e);
}
function uf(e) {
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
			if (n.type === "html_inline" && (cf(n.content) && a > 0 && a--, lf(n.content) && a++), !(a > 0) && n.type === "text" && e.md.linkify.test(n.content)) {
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
var df = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, ff = /\((c|tm|r)\)/i, pf = /\((c|tm|r)\)/gi, mf = {
	c: "©",
	r: "®",
	tm: "™"
};
function hf(e, t) {
	return mf[t.toLowerCase()];
}
function gf(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(pf, hf)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function _f(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && df.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function vf(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (ff.test(e.tokens[t].content) && gf(e.tokens[t].children), df.test(e.tokens[t].content) && _f(e.tokens[t].children));
}
var yf = /['"]/, bf = /['"]/g, xf = "’", Sf = 1e3;
function Cf(e, t, n) {
	for (; e.length > n;) {
		let n = e.pop();
		n.isSingleQuote ? t.single = n.prevSameQuoteIdx : t.double = n.prevSameQuoteIdx;
	}
}
function wf(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function Tf(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function Ef(e, t) {
	let n, r = [], i = {
		single: -1,
		double: -1
	}, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = e[o].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= c); n--);
		if (Cf(r, i, n + 1), s.type !== "text") continue;
		let l = s.content, u = 0, d = l.length;
		OUTER: for (; u < d;) {
			bf.lastIndex = u;
			let s = bf.exec(l);
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
			let _ = Rd(h) || Ld(h), v = Rd(g) || Ld(g), y = Fd(h), b = Fd(g);
			if (b ? f = !1 : v && (y || _ || (f = !1)), y ? p = !1 : _ && (b || v || (p = !1)), g === 34 && s[0] === "\"" && h >= 48 && h <= 57 && (p = f = !1), f && p && (f = _, p = v), !f && !p) {
				m && wf(a, o, s.index, xf);
				continue;
			}
			if (p && (n = m ? i.single : i.double, n >= 0 && r[n].level === c)) {
				let e = r[n], c, l;
				m ? (c = t.md.options.quotes[2], l = t.md.options.quotes[3]) : (c = t.md.options.quotes[0], l = t.md.options.quotes[1]), wf(a, o, s.index, l), wf(a, e.tokenIdx, e.contentPos, c), Cf(r, i, n);
				continue OUTER;
			}
			if (f) {
				if (r.length >= Sf) return;
				r.push({
					tokenIdx: o,
					contentPos: s.index,
					isSingleQuote: m,
					level: c,
					prevSameQuoteIdx: m ? i.single : i.double
				}), m ? i.single = r.length - 1 : i.double = r.length - 1;
			} else p && m && wf(a, o, s.index, xf);
		}
	}
	Object.keys(a).forEach(function(t) {
		let n = Number(t);
		e[n].content = Tf(e[n].content, a[t]);
	});
}
function Df(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && yf.test(e.tokens[t].content) && Ef(e.tokens[t].children, e);
}
function Of(e) {
	let t, n, r = e.length;
	for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
	for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
	t !== n && (e.length = n);
}
function kf(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text"), i[t].children && Of(i[t].children);
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var Af = [
	["normalize", rf],
	["block", af],
	["strip_references", of],
	["inline", sf],
	["linkify", uf],
	["replacements", vf],
	["smartquotes", Df],
	["text_join", kf]
], jf = class {
	constructor() {
		$(this, "ruler", new Zd()), $(this, "State", ef);
		for (let e = 0; e < Af.length; e++) this.ruler.push(Af[e][0], Af[e][1]);
	}
	process(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}
}, Mf = class {
	constructor(e, t, n, r) {
		$(this, "bMarks", []), $(this, "eMarks", []), $(this, "tShift", []), $(this, "sCount", []), $(this, "bsCount", []), $(this, "blkIndent", 0), $(this, "line", 0), $(this, "lineMax", 0), $(this, "tight", !1), $(this, "listIndent", -1), $(this, "parentType", "root"), $(this, "level", 0), $(this, "Token", Xd), this.src = e, this.md = t, this.env = n, this.tokens = r;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) {
				if (Pd(s)) {
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
		let r = new Xd(e, t, n);
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
		for (let t = this.src.length; e < t && Pd(this.src.charCodeAt(e)); e++);
		return e;
	}
	skipSpacesBack(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!Pd(this.src.charCodeAt(--e))) return e + 1;
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
				if (Pd(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}
}, Nf = 65536;
function Pf(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function Ff(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function If(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !Pd(s) || o === 45 && Pd(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !Pd(t)) return !1;
		a++;
	}
	let c = Pf(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = Pf(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = Ff(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
		if (r || (c = Pf(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = Ff(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > Nf)) break;
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
function Lf(e, t, n) {
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
function Rf(e, t, n, r) {
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
function zf(e, t, n, r) {
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
				if (Pd(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
function Bf(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !Pd(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function Vf(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !Pd(e.src.charCodeAt(r)) ? -1 : r;
}
function Hf(e, t) {
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
	return i < r && (a = e.src.charCodeAt(i), !Pd(a)) ? -1 : i;
}
function Uf(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Wf(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = Hf(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Vf(e, c)) >= 0) d = !1;
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
			if (p = Hf(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Vf(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && Uf(e, h), !0;
}
function Gf(e, t, n, r) {
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
		} else if (!Pd(e)) break;
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
		} else if (!Pd(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && Pd(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && Pd(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = zd(c.slice(1, l));
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
var Kf = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), qf = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", Jf = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Yf = RegExp(`^(?:${qf}|${Jf}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`), Xf = RegExp(`^(?:${qf}|${Jf})`), Zf = [
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
		RegExp(`^</?(${Kf.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		!0
	],
	[
		RegExp(`${Xf.source}\\s*$`),
		/^$/,
		!1
	]
];
function Qf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < Zf.length && !Zf[s][0].test(o); s++);
	if (s === Zf.length) return !1;
	if (r) return Zf[s][2];
	let c = t + 1, l = Zf[s][1].test("");
	if (!Zf[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), Zf[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function $f(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !Pd(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && Pd(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", `h${s}`, 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = Vd(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", `h${s}`, -1);
	return d.markup = "########".slice(0, s), !0;
}
function ep(e, t, n) {
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
	let c = Vd(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", `h${a}`, 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", `h${a}`, -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function tp(e, t, n) {
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
	let o = Vd(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var np = [
	[
		"table",
		If,
		["paragraph", "reference"]
	],
	["code", Lf],
	[
		"fence",
		Rf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		zf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		Bf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Wf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", Gf],
	[
		"html_block",
		Qf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		$f,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", ep],
	["paragraph", tp]
], rp = class {
	constructor() {
		$(this, "ruler", new Zd()), $(this, "State", Mf);
		for (let e = 0; e < np.length; e++) this.ruler.push(np[e][0], np[e][1], { alt: (np[e][2] || []).slice() });
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
}, ip = class {
	constructor(e, t, n, r) {
		$(this, "pos", 0), $(this, "level", 0), $(this, "pending", ""), $(this, "pendingLevel", 0), $(this, "cache", {}), $(this, "backticks", {}), $(this, "backticksScanned", !1), $(this, "linkLevel", 0), $(this, "delimiters", []), $(this, "_prev_delimiters", []), $(this, "Token", Xd), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
	}
	pushPending() {
		let e = new Xd("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}
	push(e, t, n) {
		this.pending && this.pushPending();
		let r = new Xd(e, t, n), i;
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
		let c = Rd(i) || Ld(i), l = Rd(s) || Ld(s), u = Fd(i), d = Fd(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}
};
function ap(e) {
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
function op(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !ap(e.src.charCodeAt(n));) n++;
	return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function sp(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function cp(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function lp(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = n - Math.min(10, e.pending.length, n), a = n;
	for (; a > i && cp(e.src.charCodeAt(a - 1));) a--;
	if (a === n || !sp(e.src.charCodeAt(a))) return !1;
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
function up(e, t) {
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
	for (n++; n < i && Pd(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var dp = [];
for (let e = 0; e < 256; e++) dp.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	dp[e.charCodeAt(0)] = 1;
});
function fp(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), Pd(i));) n++;
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
		t.content = i < 256 && dp[i] !== 0 ? a : o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function pp(e) {
	let t = {}, n = 0;
	for (; (n = e.indexOf("`", n)) !== -1;) {
		let r = n;
		for (; e.charCodeAt(++n) === 96;);
		t[n - r] = r;
	}
	return t;
}
function mp(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = e.posMax, i = n + 1;
	for (; i < r && e.src.charCodeAt(i) === 96;) i++;
	let a = e.src.slice(n, i), o = a.length;
	if (e.backticksScanned ||= (e.backticks = pp(e.src), !0), (e.backticks[o] ?? -1) >= i) {
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
function hp(e, t) {
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
function gp(e, t) {
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
function _p(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	gp(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && gp(e, n);
	}
}
var vp = {
	tokenize: hp,
	postProcess: _p
};
function yp(e, t) {
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
function bp(e, t) {
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
function xp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	bp(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && bp(e, n);
	}
}
var Sp = {
	tokenize: yp,
	postProcess: xp
};
function Cp(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), Pd(n) || n === 10); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), Pd(n) || n === 10); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), Pd(n) || n === 10); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), r = zd(r), a = e.env.references[r], !a) return e.pos = u, !1;
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
function wp(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), Pd(n) || n === 10); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), Pd(n) || n === 10); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), Pd(n) || n === 10); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), i = zd(i), o = e.env.references[i], !o) return e.pos = d, !1;
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
var Tp = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Ep = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Dp(e, t) {
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
	if (Ep.test(a)) {
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
	if (Tp.test(a)) {
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
function Op(e) {
	return /^<a[>\s]/i.test(e);
}
function kp(e) {
	return /^<\/a\s*>/i.test(e);
}
function Ap(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function jp(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !Ap(i)) return !1;
	let a = e.src.slice(r).match(Yf);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], Op(t.content) && e.linkLevel++, kp(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var Mp = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Np = /^&([a-z][a-z0-9]{1,31});/i;
function Pp(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(Mp);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = yd(t) ? bd(t) : bd(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(Np);
		if (r) {
			let n = ju(r[0]);
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
function Fp(e) {
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
function Ip(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Fp(e.delimiters);
	for (let e = 0; e < n; e++) {
		let n = t[e]?.delimiters;
		n && Fp(n);
	}
}
function Lp(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Rp = [
	["text", op],
	["linkify", lp],
	["newline", up],
	["escape", fp],
	["backticks", mp],
	["strikethrough", vp.tokenize],
	["emphasis", Sp.tokenize],
	["link", Cp],
	["image", wp],
	["autolink", Dp],
	["html_inline", jp],
	["entity", Pp]
], zp = [
	["balance_pairs", Ip],
	["strikethrough", vp.postProcess],
	["emphasis", Sp.postProcess],
	["fragments_join", Lp]
], Bp = class {
	constructor() {
		$(this, "ruler", new Zd()), $(this, "ruler2", new Zd()), $(this, "State", ip);
		for (let e = 0; e < Rp.length; e++) this.ruler.push(Rp[e][0], Rp[e][1]);
		for (let e = 0; e < zp.length; e++) this.ruler2.push(zp[e][0], zp[e][1]);
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
}, Vp = {
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
}, Hp = /^(vbscript|javascript|file|data):/, Up = /^data:image\/(gif|png|jpeg|webp);/, Wp = [
	"http:",
	"https:",
	"mailto:"
], Gp = class {
	validateLink(e) {
		let t = e.trim().toLowerCase();
		return !Hp.test(t) || Up.test(t);
	}
	normalizeLink(e) {
		let t = Zl(e, !0);
		if (t.hostname && (!t.protocol || Wp.indexOf(t.protocol) >= 0)) try {
			t.hostname = pd.toASCII(t.hostname);
		} catch {}
		return t.auth &&= Rl(t.auth), t.hostname &&= Rl(t.hostname), t.pathname &&= Rl(t.pathname), t.search &&= Rl(t.search), t.hash &&= Rl(t.hash), zl(t);
	}
	normalizeLinkText(e) {
		let t = Zl(e, !0);
		if (t.hostname && (!t.protocol || Wp.indexOf(t.protocol) >= 0)) try {
			t.hostname = pd.toUnicode(t.hostname);
		} catch {}
		return Fl(zl(t), Fl.defaultChars + "%");
	}
	constructor(...e) {
		$(this, "inline", new Bp()), $(this, "block", new rp()), $(this, "core", new jf()), $(this, "renderer", new $d()), $(this, "linkify", new Bu()), $(this, "utils", gd), $(this, "helpers", Object.assign({}, Kd));
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
			if (t = Vp[n], !t) throw Error(`Wrong 'markdown-it' preset "${n}", check name`);
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
$(Gp, "Token", Xd), $(Gp, "Ruler", Zd), $(Gp, "Renderer", $d), $(Gp, "ParserCore", jf), $(Gp, "StateCore", ef), $(Gp, "ParserBlock", rp), $(Gp, "StateBlock", Mf), $(Gp, "ParserInline", Bp), $(Gp, "StateInline", ip);
var Kp = _d(Gp), qp = {
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
}, Jp = new Set("txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split(" ")), Yp = "png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm".split(" ").sort((e, t) => t.length - e.length).join("|"), Xp = `(?:~/|/|[A-Za-z]:[/\\\\])\\S+?(?:[^\\S\\n]+\\S+?)*?\\.(?:${Yp})(?=[\\s\`"'*_,;:)\\]}]|MEDIA:|$)`, Zp = RegExp(`MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${Xp}|[^\\s\`"]+)`, "g");
function Qp(e) {
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
var $p = new Kp({ html: !0 });
for (let e of ["image", "link"]) {
	let t = $p.inline.ruler.__rules__.find((t) => t.name === e).fn;
	$p.inline.ruler.at(e, (n, r) => {
		let i = n.pos, a = n.tokens.length, o = t(n, r), s = n.tokens.slice(a).find((t) => t.type === (e === "image" ? "image" : "link_open"));
		return !r && s && (s.type === "image" || s.type === "link_open") && (s.meta = {
			deliveryRange: [i, n.pos],
			escapedImage: e === "link" && n.src[i - 1] === "!"
		}), o;
	});
}
function em(e, t, n = !1, r = {}) {
	n &&= !/^\s*["'“‘].*["'”’]\s*$/.test(e);
	let i = $p.parseInline(e, r)[0]?.children || [], a = 0, o = 0;
	for (let r of i) {
		let i = r.type === "image" ? r.attrGet("src") : r.type === "link_open" ? r.attrGet("href") : void 0;
		if (typeof i != "string" || !i.startsWith("MEDIA:") && !(n && r.type === "link_open")) continue;
		let s;
		try {
			if (s = decodeURIComponent(i.startsWith("MEDIA:") ? i.slice(6) : i), !i.startsWith("MEDIA:") && !lm(s, !0)) continue;
		} catch {
			continue;
		}
		if (!/^(?:\/(?!\/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)/i.test(s) || s.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) || !r.meta?.deliveryRange || r.meta.escapedImage) continue;
		let [c, l] = r.meta.deliveryRange;
		t(s, void 0, !i.startsWith("MEDIA:")) && i.startsWith("MEDIA:") && (c < o || (e = e.slice(0, c - a) + e.slice(l - a), a += l - c, o = l));
	}
	return e;
}
function tm(e, t) {
	let n = [], r = 0;
	for (let t of e.matchAll(Zp)) {
		if (e.slice(r, t.index).trim()) return e;
		let i = Qp(t[1]);
		if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(i)) return e;
		n.push(i), r = t.index + t[0].length;
	}
	return !n.length || e.slice(r).trim() ? e : n.every((e) => !!im(e)) && n.every((e) => t(e)) ? "" : e;
}
function nm(e, t) {
	let n = e.match(/^([A-Za-z][A-Za-z0-9 ()/_-]{0,79}:)[ \t]+(?=MEDIA:)/);
	if (!n) return e;
	let r = [];
	return tm(e.slice(n[0].length), (e) => !/^(?:\/(?!\/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)/.test(e) || e.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) ? !1 : (r.push(e), !0)) || !r.length ? e : (r.forEach((e) => t(e)), n[1]);
}
function rm(e) {
	return e.split(".").at(-1)?.toLowerCase() || "";
}
function im(e, t) {
	try {
		e.startsWith("#media:") && (e = decodeURIComponent(e.slice(7))), e.startsWith("sandbox:") && (e = e.slice(8)), e.startsWith("file:") && (e = decodeURIComponent(new URL(e).pathname));
	} catch {
		return;
	}
	if (!/^(\/|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(e)) return;
	let n = e.split(/[\\/]/).at(-1)?.split(/[?#]/)[0] || "";
	t = (t && /\.[a-z0-9]{1,12}$/i.test(t) ? t : n) || t || "Attached image";
	let r = rm(t);
	return {
		path: e,
		name: t,
		type: qp[r] || (Jp.has(r) ? "text/plain" : "application/octet-stream")
	};
}
function am(e) {
	if (e.type.startsWith("image/") && e.type !== "image/svg+xml") return "image";
	if (e.type === "application/pdf") return "pdf";
	if (e.type.startsWith("audio/")) return "audio";
	if (e.type.startsWith("video/")) return "video";
	if (Jp.has(rm(e.name))) return "text";
}
function om(e, t = "", n = !1) {
	if (/^(https?:\/\/|data:image\/)/.test(e.path)) return e.path;
	if (/^\/api\/plugins\/chathermes\/artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+$/.test(e.path)) {
		let r = new URLSearchParams({ profile: t || "default" });
		return n && r.set("download", "true"), `${e.path}?${r}`;
	}
	if (e.path.match(/^\/api\/plugins\/chathermes\/images\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))$/i)) {
		let n = new URLSearchParams();
		return t && n.set("profile", t), `${e.path}${n.size ? `?${n}` : ""}`;
	}
	let r = new URLSearchParams({
		path: e.path,
		profile: t || "default"
	});
	return e.sessionId && r.set("session_id", e.sessionId), n && r.set("name", e.name), `/api/plugins/chathermes/files/${n ? "download" : "preview"}?${r}`;
}
var sm = new Kp({ html: !0 }), cm = sm.inline.ruler.__rules__.find((e) => e.name === "backticks").fn;
sm.inline.ruler.at("backticks", (e, t) => {
	let n = e.pos, r = e.tokens.length, i = cm(e, t), a = e.tokens.at(-1);
	return !t && e.tokens.length > r && a?.type === "code_inline" && (a.meta = { deliveryLines: [e.src.slice(0, n).split("\n").length - 1, e.src.slice(0, e.pos).split("\n").length - 1] }), i;
});
function lm(e, t = !1) {
	return /^(?:\/(?!\/)|~\/)/.test(e) && !/[?#\\]/.test(e) && !e.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) && RegExp(`\\.(?:${Yp})$`, "i").test(e) && (t || /^(?:~\/|\/)(?:[\p{L}\p{N}_.-]+\/)*[\p{L}\p{N}_.-]+$/u.test(e));
}
function um(e, t = !0) {
	let n = [];
	if (!/MEDIA:|Attached (?:image|file) |\//.test(e)) return {
		text: e,
		files: n
	};
	let r = (e, t, r = !1) => {
		let i = im(e, t);
		if (!i) return !1;
		r && (i.automatic = !0);
		let a = n.findIndex((e) => e.path === i.path);
		return a < 0 ? n.push(i) : n[a]?.automatic && !r && (n[a] = i), !0;
	}, i = e.split("\n"), a = [...i], o = !1, s = [], c = {}, l = sm.parse(e, c), u = /* @__PURE__ */ new Set();
	for (let e of l) if (e.map && ([
		"fence",
		"code_block",
		"blockquote_open",
		"bullet_list_open",
		"ordered_list_open"
	].includes(e.type) || e.children?.some((e) => e.type === "code_inline" && /untrusted_tool_result|<\/?(?:think|thinking|reasoning|analysis|pre|code|script|style)\b/i.test(e.content)))) for (let t = e.map[0]; t < e.map[1]; t++) u.add(t);
	let d = /* @__PURE__ */ new Set(), f = 0;
	for (let [e, t] of i.entries()) if (f && d.add(e), !u.has(e) && /<\/?(?:untrusted_tool_result|think|thinking|reasoning|analysis|pre|code|script|style)\b/i.test(t)) for (let n of t.matchAll(/<(\/?)(?:untrusted_tool_result|think|thinking|reasoning|analysis|pre|code|script|style)\b[^>]*(?:>|$)/gi)) d.add(e), f = n[1] ? Math.max(0, f - 1) : f + 1;
	for (let [e, n] of l.entries()) {
		if (n.type !== "paragraph_open" || n.level !== 0 || !n.map) continue;
		let i = /* @__PURE__ */ new Set();
		for (let t of l[e + 1]?.children || []) {
			let e = t.meta?.deliveryLines;
			if (t.type !== "code_inline" || !/MEDIA:|Attached (?:image|file) /.test(t.content) && e?.[0] === e?.[1] || !e) continue;
			let [r, a] = e;
			for (let e = r; e <= a; e++) i.add(n.map[0] + e);
		}
		for (let e = n.map[0]; e < n.map[1]; e++) {
			if (d.has(e) || i.has(e)) continue;
			let n = a[e], l = n.match(/^Attached (?:image|file) ([^\n]+?): ([^\n]+?)\r?$/);
			l && r(l[2].trim(), l[1]) ? (o = !0, a[e] = "") : /^@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)\r?$/.test(n) ? s.push(e) : n.startsWith("MEDIA:") ? a[e] = tm(n, r) : (a[e] = em(nm(n, r), r, t, c), t && lm(n.trim()) && r(n.trim(), void 0, !0));
		}
	}
	if (o) for (let e of s) a[e] = "";
	return {
		text: n.some((e) => !e.automatic) ? a.filter((e, t) => e !== "" || i[t] === "").join("\n").trim() : e,
		files: n
	};
}
function dm(e) {
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
	let a = um(i);
	return a.text.trim() ? [] : a.files.map((e) => {
		let t = r.mime_type || r.mime;
		typeof t == "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(t) && (e.type = t);
		let n = r.size ?? r.bytes;
		return typeof n == "number" && Number.isSafeInteger(n) && n >= 0 && (e.size = n), e;
	});
}
function fm(e) {
	return um(e, !1);
}
function pm(e) {
	if (e.role !== "user" && e.role !== "assistant") return [];
	let { content: t } = e, n = (e.role === "user" ? fm : um)(Ol(Array.isArray(t) ? t.filter((e) => e?.type === "text") : t)).files, r = n.filter((e) => am(e) === "image");
	if (Array.isArray(t)) {
		let e = 0;
		for (let i of t) {
			let t = i?.image_url?.url;
			if (Ml(t)) {
				if (r.length) {
					let n = r[e++];
					n && !t.startsWith("/api/plugins/chathermes/artifact-images/") && (n.imageData = t);
				} else {
					let e = im(t, "Attached image.png");
					e && n.push(e);
				}
			}
		}
	}
	if (e.role === "user" && r.length) for (let e of r) {
		let t = e.path.match(/\/uploads\/chathermes\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))$/i);
		t && (e.path = `/api/plugins/chathermes/images/${t[1]}`);
	}
	return n.map((t) => ({
		...t,
		messageId: e.id,
		createdAt: e.created_at,
		direction: e.role === "user" ? "uploaded" : "generated"
	}));
}
//#endregion
//#region src/features/chat/runtime/gateway-display.ts
var mm = {
	auto_continue: "Resuming interrupted turn…",
	process_complete: "Background process completed",
	async_delegation_complete: "Delegated work completed",
	model_switch: "Model changed",
	personality_switch: "Personality changed",
	failed_turn: "Response did not complete · verify any actions before resending"
};
function hm(e) {
	return e.display_kind === "compaction" ? "compaction" : e.display_kind === "hidden" ? "hidden" : e.display_kind && Object.hasOwn(mm, e.display_kind) ? "status" : e.role === "system" ? "hidden" : "message";
}
function gm(e) {
	let t = e.display_metadata;
	if (e.display_kind === "model_switch" && t && typeof t == "object") {
		let e = "model" in t && typeof t.model == "string" ? t.model : "";
		if (e) return `Model changed to ${e}`;
	}
	return t && typeof t == "object" && "display_text" in t && typeof t.display_text == "string" ? t.display_text : mm[e.display_kind || ""] || "";
}
function _m(e) {
	return e === "interrupted" ? "Response interrupted" : e === "cancelled" ? "Response cancelled" : e === "error" || e === "failed" ? "Response failed" : "Response completed";
}
//#endregion
//#region src/features/chat/runtime/assistant-turn.ts
var vm = (e) => typeof e == "string" ? e : "", ym = (e) => typeof e == "string" ? e : e == null ? "" : JSON.stringify(e, null, 2);
function bm(e) {
	let t = vm(e.subagent_id) || vm(e.child_session_id);
	if (t) return t;
	let n = vm(e.delegation_id);
	return n && typeof e.task_index == "number" && Number.isSafeInteger(e.task_index) ? `${n}:${e.task_index}` : "";
}
function xm(e) {
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
function Sm(e, t = !1) {
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
var Cm = () => ({
	blocks: [],
	seen: /* @__PURE__ */ new Set(),
	sequence: 0
});
function wm(e) {
	Tm(e);
	for (let t of e.blocks) t.kind !== "text" && (t.complete = !0, t.kind === "thinking" && (t.title = "Thought"), (!t.state || t.state === "running" || t.state === "pending") && (t.state = t.kind === "tool" ? "unknown" : "completed"));
}
function Tm(e) {
	for (let t of e.blocks) t.kind === "thinking" && (t.complete = !0, t.state = "completed", t.title = "Thought", t.duration === void 0 && t.startedAt !== void 0 && (t.duration = Math.max(0, (Date.now() - t.startedAt) / 1e3)));
}
function Em(e, t) {
	if (t.key && e.seen.has(t.key)) return;
	t.key && e.seen.add(t.key);
	let { type: n, data: r } = t, i = vm(r.delta) || vm(r.text) || vm(r.preview), a = vm(r.tool_call_id) || vm(r.tool_id), o = vm(r.tool_name) || vm(r.name) || vm(r.tool), s = () => `block-${++e.sequence}`;
	if (n === "text" || n === "text.snapshot" || n === "text.completed") {
		Tm(e);
		let t = n === "text.completed" ? vm(r.content) : i;
		if (!t || n === "text.completed" && [...e.blocks].reverse().find((e) => e.kind === "text")?.content === t) return;
		let a = e.blocks.at(-1);
		if (n === "text.snapshot") {
			let n = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("");
			if (n === t || n.startsWith(t)) return;
			if (t.startsWith(n)) {
				Em(e, {
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
	} else if (n === "reasoning.completed") Tm(e);
	else if (n.startsWith("tool.")) {
		Tm(e);
		let t = e.blocks.find((e) => e.kind === "tool" && a && e.id === a);
		if (!t && !a && (t = [...e.blocks].reverse().find((e) => e.kind === "tool" && !e.complete && (!o || e.toolName === o))), t || (t = {
			id: a || s(),
			kind: "tool",
			title: Sm(o),
			toolName: o,
			content: "",
			complete: !1,
			state: "pending",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), n === "tool.started" && t.complete) return;
		n === "tool.started" ? (t.state = "running", t.content = ym(r.args) || i || t.content) : n === "tool.updated" ? (t.complete || (t.state = "running"), t.output = (t.output || "") + i) : (t.complete = !0, t.state = n === "tool.failed" || xm(r.output ?? r.result) || r.is_error || r.error ? "failed" : "completed", t.title = Sm(t.toolName || o, !0), t.output = ym(r.output ?? r.result ?? r.error) || t.output || i, t.content = ym(r.args) || t.content, t.duration = typeof r.duration_s == "number" ? r.duration_s : t.startedAt ? Math.max(0, ((typeof r.ts == "number" ? r.ts * 1e3 : Date.now()) - t.startedAt) / 1e3) : void 0);
	} else {
		if (n === "failed") for (let t of e.blocks) t.kind === "tool" && !t.complete && (t.state = "failed", t.output ||= "The response ended before this tool completed.");
		wm(e);
	}
}
function Dm(e) {
	let t = Cm();
	for (let n of e) {
		if (n.blocks?.length) {
			t.blocks.push(...n.blocks);
			continue;
		}
		if (hm(n) === "message") {
			if (n.role === "assistant") {
				let e = n.reasoning_content || n.reasoning;
				e && (Em(t, {
					type: "reasoning",
					data: {
						delta: e,
						persisted: !0
					}
				}), Tm(t));
				let r = Ol(n.content);
				r && t.blocks.push({
					id: `block-${++t.sequence}`,
					kind: "text",
					content: r
				});
				let i = Array.isArray(n.content) ? n.content.flatMap((e) => {
					let t = e?.image_url?.url;
					return Ml(t) ? [t] : [];
				}) : [];
				if (i.length) {
					let e = t.blocks.at(-1);
					e?.kind !== "text" && (e = {
						id: `block-${++t.sequence}`,
						kind: "text",
						content: ""
					}, t.blocks.push(e)), e.images = i;
				}
				for (let e of n.tool_calls || []) Em(t, {
					type: "tool.started",
					data: {
						tool_call_id: e.id,
						tool_name: e.function?.name,
						args: e.function?.arguments,
						persisted: !0
					}
				});
			} else if (n.role === "tool") {
				let e = Ol(n.content), r = !1;
				try {
					let t = JSON.parse(e);
					r = t?.is_error === !0 || t?.success === !1 || !!t?.error || typeof t?.exit_code == "number" && t.exit_code !== 0;
				} catch {}
				Em(t, {
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
	return Tm(t), t.blocks;
}
function Om(e, t, n) {
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
function km(e, t) {
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
function Am(e, t, n) {
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
			let t = vm(n.text).trim();
			if (!t) return;
			Tm(e);
			let o = i(r.streamText);
			if (!o) {
				let e = i(r.interimText ?? r.finalText);
				e && e.content.replace(/\s+/g, " ").trim() === t.replace(/\s+/g, " ").trim() && (o = e);
			}
			o ??= a(t), o.content = t, r.interimText = o.id, r.streamText = void 0, r.finalText = void 0, r.toolStream = !1;
		} else if (t === "message.delta" || t === "message.complete") {
			let o = vm(n.text);
			if (t === "message.delta" && o) {
				Tm(e);
				let t = i(r.streamText);
				(!t || t !== e.blocks.at(-1)) && (t = a("")), t.content += o, r.streamText = t.id, r.finalText = void 0;
			} else if (t === "message.complete" && o.trim() && (!n.response_reused || !e.blocks.some((e) => e.kind === "text"))) {
				Tm(e);
				let t = o.trim(), s = i(r.streamText), c = e.blocks.reduce((e, t, n) => t.kind === "tool" ? n : e, -1), l = s && e.blocks.indexOf(s) > c ? s : void 0, u = i(r.interimText), d = !!(n.error || n.status && n.status !== "complete"), f = !d && u && u.content.trim() === t && (!l || l.content.trim() === t), p = !d && !l && !r.toolStream && u && u.content.trim() && (n.response_previewed || n.response_transformed || u.content.trim() === t || t.startsWith(u.content.trim()) || u.content.trim().startsWith(t) || km(u.content.trim(), t)), m;
				if (f || p) m = u, l && l !== u && e.blocks.splice(e.blocks.indexOf(l), 1);
				else {
					let e = i(r.finalText);
					m = l ?? (e?.content.trim() === t ? e : a(""));
				}
				m.content = t, r.finalText = m.id, r.streamText = void 0, r.interimText = void 0, r.toolStream = !1;
			}
			if (t === "message.complete") {
				for (let t of e.blocks) t.kind !== "text" && !t.delegated && (t.complete = !0, (!t.state || t.state === "running" || t.state === "pending") && (t.state = n.status === "cancelled" || n.status === "interrupted" ? "interrupted" : "unknown"));
				n.reasoning && !e.blocks.some((e) => e.kind === "thinking") && Em(e, {
					type: "reasoning",
					data: { text: n.reasoning }
				}), Tm(e);
			}
		} else if (t === "reasoning.delta" || t === "reasoning.available") {
			if (t === "reasoning.available") {
				let t = i(r.streamText ?? r.finalText)?.content.trim();
				if (t && t.slice(0, 500).trim() === vm(n.text).trim()) return;
				let a = [...e.blocks].reverse().find((e) => e.kind === "thinking");
				if (a && a.kind === "thinking") {
					a.content = vm(n.text);
					return;
				}
			}
			Em(e, {
				type: "reasoning",
				data: {
					...n,
					delta: n.text
				}
			});
		} else if (t === "tool.start" || t === "tool.complete" || t === "tool.progress") {
			t === "tool.start" && (r.toolStream = !0);
			let i = n.result, a = n.is_error || n.error || xm(i) || xm(n.result_text);
			Em(e, {
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
			let r = bm(n);
			if (!r) return;
			Em(e, {
				type: [
					"subagent.complete",
					"subagent.failed",
					"subagent.cancelled"
				].includes(t) ? t === "subagent.complete" && n.status === "completed" ? "tool.completed" : "tool.failed" : "tool.updated",
				data: {
					tool_call_id: "subagent-" + r,
					tool_name: vm(n.name) || "Delegated task",
					delta: vm(n.text),
					output: n.summary ?? n.text ?? n.output_tail
				}
			});
			let i = e.blocks.find((e) => e.id === "subagent-" + r);
			i && i.kind === "tool" && (i.delegated = !0);
		}
	}
}
//#endregion
//#region src/features/chat/utils/transcript-entries.ts
function jm(e) {
	let t = e.messages.map((e) => Object.hasOwn(e, "display_content") ? {
		...e,
		content: e.display_content
	} : e).filter((e) => hm(e) !== "hidden" || !!e.blocks?.length), n = [], r = (e) => [...e].reverse().find((e) => e.role === "assistant" && Ol(e.content).trim())?.id, i = 0;
	for (let a = 0; a < t.length;) {
		let o = t[a];
		if (hm(o) === "compaction") {
			n.push({
				kind: "compaction",
				key: o.id || `compaction-${a}`
			}), a++;
			continue;
		}
		if (o.role === "user" || hm(o) === "status") {
			let s = hm(o);
			if (o.display_kind === "async_delegation_complete") {
				let e = o.id || `delegation-${a}`;
				n.push({
					kind: "turn",
					key: `receipt-${e}`,
					blocks: [{
						id: `receipt-${e}`,
						kind: "tool",
						title: gm(o),
						content: Ol(o.content),
						complete: !0,
						state: "completed"
					}]
				});
			} else s === "status" ? n.push({
				kind: "status",
				text: gm(o),
				content: Ol(o.content),
				key: o.id || `status-${a}`
			}) : s === "message" && (i++, n.push({
				kind: "user",
				message: o,
				key: o.display_id || o.id || `user-${a}`
			}));
			if (s === "status" && !o.blocks?.length) {
				a++;
				continue;
			}
			let c = a + 1;
			for (; c < t.length && t[c].role !== "user" && hm(t[c]) === "message";) c++;
			let l = c === t.length, u = l && (!e.turnUserCount || e.turnUserCount === i) && e.blocks?.length ? e.blocks : o.blocks?.length ? o.blocks : Dm(t.slice(a + 1, c)), d = u.length ? u : l ? e.progress : [], f = l && (e.working ?? !!((o.blocks || e.blocks?.length || e.progress.length) && d.some((e) => e.kind !== "text" && !e.complete)));
			(d.length || f) && n.push({
				kind: "turn",
				blocks: d,
				responseId: r(t.slice(a + 1, c)),
				working: f,
				approvalPending: l && e.approvalPending,
				key: `turn-${o.display_id || o.id || a}`
			}), a = c;
		} else {
			let e = a + 1;
			for (; e < t.length && t[e].role !== "user" && hm(t[e]) === "message";) e++;
			n.push({
				kind: "turn",
				blocks: Dm(t.slice(a, e)),
				responseId: r(t.slice(a, e)),
				key: o.display_id || o.id ? `history-${o.display_id || o.id}` : `history-${a}`
			}), a = e;
		}
	}
	return n;
}
//#endregion
//#region src/features/chat/utils/saved-response-targets.ts
function Mm(e) {
	let t = Ol(e.content);
	fm(t).files.length && (t = t.replace(/\n@file:[^\n]+\n\n--- Attached Context ---\n[\s\S]*$/, ""));
	let n = fm(t);
	return JSON.stringify([n.text, n.files.map((e) => e.path).sort()]);
}
function Nm(e, t) {
	let n = (e) => jm({
		messages: e,
		progress: []
	}).flatMap((e) => {
		if (e.kind === "user") return [{
			kind: "user",
			text: Mm(e.message),
			key: e.key,
			id: void 0
		}];
		if (e.kind !== "turn") return [];
		let t = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("\n\n");
		return t.trim() ? [{
			kind: "turn",
			text: t,
			key: e.key,
			id: e.responseId
		}] : [];
	}), r = n(e), i = n(t);
	return r.length !== i.length || r.some((e, t) => e.kind !== i[t].kind || e.text !== i[t].text) ? {} : Object.fromEntries(r.flatMap((e, t) => i[t].id ? [[e.key, i[t].id]] : []));
}
//#endregion
//#region src/features/chat/runtime/native-admission.ts
var Pm = (e, t) => "chathermes.native-outcome:" + JSON.stringify([e || "default", t]), Fm = (e, t) => e && e !== "default" ? [Pm(e, t)] : [Pm("default", t), "chathermes.native-outcome:" + JSON.stringify(["", t])];
function Im(e, t) {
	try {
		let n = Fm(e, t);
		return Object.keys(localStorage).some((e) => n.some((t) => e === t || e.startsWith(t + ":")) && localStorage.getItem(e) === "unknown");
	} catch {
		return !0;
	}
}
function Lm(e, t) {
	let n = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
	try {
		localStorage.setItem(Pm(e, t) + ":" + n, "unknown");
	} catch {
		throw Error("Cannot safely record native submission state");
	}
	return n;
}
function Rm(e, t, n) {
	try {
		for (let r of Fm(e, t)) if (n) localStorage.removeItem(r + ":" + n);
		else for (let e of Object.keys(localStorage)) (e === r || e.startsWith(r + ":")) && localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/features/chat/runtime/persisted-live-turn.ts
function zm(e) {
	let t = e.assistant ?? "", n = e.corrections ?? [], r = e.correction_offsets;
	if (!n.length) return [t];
	let i = Array.from(t);
	return r?.length === n.length && r.every((e, t) => Number.isInteger(e) && e >= 0 && e <= i.length && (!t || e >= r[t - 1])) ? [...r, i.length].map((e, t) => i.slice(t ? r[t - 1] : 0, e).join("")) : [t, ...n.map(() => "")];
}
function Bm(e, t) {
	let n = e.trimStart(), r = t.trim();
	return r ? n.startsWith(r) ? n.slice(r.length) : r.startsWith(n) ? "" : e : e;
}
var Vm = (e) => !!e.tool_calls?.length, Hm = (e) => String(e ?? "").split("\n").filter((e) => !/^@(file|folder|url|image|tool|line|terminal|session):(`[^`\n]+`|"[^"\n]+"|'[^'\n]+'|\S+)$/.test(e.trimEnd())).join("\n").trim();
function Um(e, t) {
	let n;
	for (let r = e.length - 1; r >= 0; r--) {
		let i = e[r];
		if (i.role === "assistant" && !Vm(i) && typeof i.content == "string" && i.content.trim()) break;
		if (i.role !== "user" || i.display_kind === "steer" || Hm(i.content) !== Hm(t.user) || !i.id) continue;
		let a = [[]], o = [i], s = !0;
		for (let n of e.slice(r + 1)) if (n.role === "user") {
			if (!n.id || Hm(n.content) !== Hm(t.corrections?.[a.length - 1])) {
				s = !1;
				break;
			}
			o.push(n), a.push([]);
		} else if (n.role === "assistant") {
			if (!Vm(n) || typeof n.content != "string" || n.display_kind === "hidden" || n.content.trim() && !n.id) {
				s = !1;
				break;
			}
			a.at(-1).push(n);
		} else if (n.role === "tool") a.at(-1).push(n);
		else {
			s = !1;
			break;
		}
		s && (n = {
			start: r,
			intervals: a,
			users: o
		});
	}
	return n;
}
//#endregion
//#region src/features/chat/runtime/native-session.ts
function Wm(e, t, n, r, i) {
	let a = /* @__PURE__ */ z(), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(null), c = /* @__PURE__ */ z(!1), l = !1, u = 0, d = 0;
	function f() {
		d++, s.value = null, c.value = !1;
	}
	function p() {
		u++, o.value = null, f();
	}
	function m(e, t = !0) {
		let n = o.value;
		u++, o.value = e || null, n && e && (typeof e.compressions == "number" && e.compressions !== n.compressions || typeof e.context_used == "number" && typeof n.context_used == "number" && e.context_used < n.context_used || e.model !== n.model || e.context_max !== n.context_max) && (f(), l && t && h());
	}
	async function h() {
		let e = N, t = de, n = ++d;
		if (l && t && oe.value === "ready") {
			c.value = !0;
			try {
				let r = await t.contextBreakdown();
				e === N && n === d && t === de && l && (s.value = r);
			} catch {
				e === N && n === d && (s.value = null);
			} finally {
				e === N && n === d && (c.value = !1);
			}
		}
	}
	async function g() {
		let e = N, t = de, n = ++u;
		if (ge && t && oe.value === "ready") try {
			let r = await t.usage();
			e === N && n === u && t === de && m(r);
		} catch {
			e === N && n === u && (o.value = null);
		}
	}
	function _(e) {
		l = e, f(), e && h();
	}
	let v = /* @__PURE__ */ z(!1), y = /* @__PURE__ */ z(!1), b = /* @__PURE__ */ z(""), x, S = 0, C = !1, w = !1, T, E = "Could not refresh saved history. Try again when the dashboard is available.", ee, D = 0;
	function O() {
		clearTimeout(ee), ee = void 0;
	}
	async function k(e, t = 0) {
		let n = Math.max(120, t, x?.nextOffset || 0), r = x?.messages.find((e) => e.display_kind !== "compaction"), i = r?.display_id || r?.id, a = (e) => !i || e.some((e) => (e.display_id || e.id) === i), o = Te, s = R;
		for (let t = 0;; t++) try {
			let t = await Q.latestMessages(o, s, e), r = JSON.stringify(t.messages);
			for (; t.hasMore && (t.nextOffset < n || !a(t.messages));) {
				let n = await Q.latestMessages(o, s, e, t.nextOffset, t.revision);
				if (t.revision && n.revision !== t.revision) throw new hl(409, "Transcript changed");
				if (n.hasMore && n.nextOffset <= t.nextOffset) throw Error("History pagination did not advance");
				if (!n.hasMore && n.nextOffset === 0) {
					t = n;
					break;
				}
				t = {
					...n,
					messages: [...n.messages, ...t.messages]
				};
			}
			if (!t.revision && t.nextOffset > 120) {
				let t = await Q.latestMessages(o, s, e);
				if (JSON.stringify(t.messages) !== r) throw new hl(409, "Transcript changed");
			}
			return t;
		} catch (e) {
			if (!(e instanceof hl) || e.status !== 409 || t >= 2) throw e;
		}
	}
	function te(e) {
		x = e, v.value = e.hasMore, b.value = "", S++;
	}
	async function A() {
		if (!x?.hasMore || y.value || re.value || fe) return;
		if (C) {
			w = !0;
			return;
		}
		let e = N, t = S, n = x;
		y.value = !0, b.value = "";
		try {
			if (!n.revision) {
				await Ie(n.nextOffset + 120);
				return;
			}
			let r = new AbortController();
			T?.abort(), T = r;
			let i = await Q.latestMessages(Te, R, r.signal, n.nextOffset, n.revision);
			if (e !== N || t !== S || x !== n) return;
			if (i.revision !== n.revision) throw new hl(409, "Transcript changed");
			if (i.hasMore && i.nextOffset <= n.nextOffset) throw Error("History pagination did not advance");
			let a = new Set(j.value.map((e) => e.id).filter(Boolean)), o = i.messages.filter((e) => !e.id || !a.has(e.id));
			j.value = [...o, ...j.value], te({
				...i,
				messages: [...i.messages, ...n.messages]
			});
		} catch (n) {
			if (e !== N || t !== S) return;
			n instanceof hl && n.status === 409 ? await Ie() : b.value = "Could not load earlier messages. Try again.";
		} finally {
			e === N && (y.value = !1);
		}
	}
	let ne = /* @__PURE__ */ z({}), j = /* @__PURE__ */ z([]), M = /* @__PURE__ */ z(!1), re = /* @__PURE__ */ z(!1), ie = /* @__PURE__ */ z(""), ae = /* @__PURE__ */ z(""), oe = /* @__PURE__ */ z("stale"), se = /* @__PURE__ */ z(0), ce = /* @__PURE__ */ z([]), le = /* @__PURE__ */ z(!1), ue = X(() => {
		let e = ce.value[0];
		return e ? {
			...e.params,
			request_id: e.id,
			kind: e.method
		} : void 0;
	}), de, N = 0, fe = !1, pe = !1, me = 0, he, ge = !1, P = document.visibilityState !== "hidden", _e = navigator.onLine, F, I, ve = [], ye = !1, L = !1, be, xe = !1, Se = "", Ce = "", we = /* @__PURE__ */ new Set(), Te = "", R = "", Ee = !1, De = !1, Oe = 0, ke, Ae = () => {
		I && F && (I.blocks = F.blocks), j.value = [...j.value];
	}, je = (e) => {
		N = e, se.value = e;
	};
	function Me() {
		pe && (pe = !1, t?.(Te, R));
	}
	function Ne(e) {
		ge && Te && R && n?.(Te, R, e);
	}
	function Pe(e, t = !1, n, r = {}) {
		if (Ee && !t && I && (n ? n === Se : !r.display_kind && e === Ce)) {
			Ee = !1, Ae();
			return;
		}
		Ee = !1, t && I && F && (Em(F, {
			type: "reasoning.completed",
			data: {}
		}), ve.push({
			user: I,
			turn: F,
			hasCorrections: !0
		})), De = t || !1, I = {
			id: `native-user-${++Oe}`,
			role: "user",
			content: e,
			display_kind: r.display_kind,
			display_metadata: r.display_metadata
		}, j.value.push(I), F = /* @__PURE__ */ Pt(Cm()), I.blocks = F.blocks, M.value = !0, Ae();
	}
	function Fe(e, t) {
		t === N && ge && R && (a.value = {
			profile: Te,
			session: R,
			info: e.info,
			generation: t
		}), fe = !0, ye = e.messages_omitted === !0, L = !e.recovery.complete, be = e.inflight, xe = !!e.queued, me++, ke = void 0, F = void 0, I = void 0, Ee = !1, ve = [];
		let n = e.messages.map((e) => ({
			...e,
			id: e.row_id == null ? void 0 : String(e.row_id),
			content: e.role === "tool" ? e.content : e.text || e.content || "",
			tool_name: e.name
		})), r = new Set(e.recovery.base_row_ids || []), i = e.recovery.complete ? n.filter((e) => e.id && r.has(e.id)) : n, o = new Set(x?.messages.map((e) => e.id));
		if (j.value = x ? [...x.messages, ...i.filter((e) => !o.has(e.id))] : i, M.value = !!(e.running || e.queued), ye && e.inflight?.user) {
			let t = Um(j.value, e.inflight);
			t && (j.value = j.value.slice(0, t.start));
		}
		if (!e.recovery.complete && e.inflight?.user) {
			let t = j.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
			if (ye || t < 0 || Ol(j.value[t].content) !== e.inflight.user || (j.value[t].display_kind || void 0) !== (e.inflight.display_kind || void 0)) Pe(e.inflight.user, !1, void 0, {
				display_kind: e.inflight.display_kind || void 0,
				display_metadata: e.inflight.display_metadata
			});
			else {
				I = j.value[t], F = /* @__PURE__ */ Pt(Cm());
				let e = Dm(j.value.slice(t + 1));
				Om(F, e, M.value), I.blocks = F.blocks;
			}
			let n = zm(e.inflight);
			n[0] && !F.blocks.some((e) => e.kind === "text") && Em(F, {
				type: "text.snapshot",
				data: { text: n[0] }
			});
			for (let [t, r] of (e.inflight.corrections || []).entries()) Pe(r, !0), n[t + 1] && Em(F, {
				type: "text.snapshot",
				data: { text: n[t + 1] }
			});
			e.inflight.error && (ie.value = e.inflight.error), ae.value = hm(I) === "status" ? gm(I) : e.running ? "Working…" : _m(e.inflight.status);
		}
		M.value = !!(e.running || e.queued);
	}
	async function Ie(t = 0) {
		let n = N, r = ++me, i = de;
		if (!i || fe || oe.value !== "ready") return;
		O();
		let a = i.boundary;
		S++, C = !0;
		let o = new AbortController();
		T?.abort(), T = o;
		let s = !1;
		try {
			let s = await k(o.signal, t), c = s.messages;
			if (n !== N || r !== me || fe) return;
			let l = c.length && !s.projected ? await i.rpc("history").catch(() => null) : { messages: [] }, u = new Map((l?.messages || []).filter((e) => e.id).map((e) => [e.id, e])), d = c.map((e) => {
				let t = u.get(e.id);
				return t ? {
					...e,
					display_kind: t.display_kind ?? e.display_kind,
					display_metadata: t.display_metadata ?? e.display_metadata
				} : e;
			});
			if (n !== N || r !== me || fe) return;
			if (te(s), (ye || L) && !M.value && I && F && !De && !ve.some((e) => e.hasCorrections)) {
				let e = d.reduce((e, t, n) => t.role === "user" ? n : e, -1), t = d[e];
				t && (t.display_kind || void 0) === (I.display_kind || void 0) && Object.keys(Nm([I], d.slice(e))).length && (Om(F, Dm(d.slice(e + 1)), !1), d[e] = {
					...t,
					display_id: I.display_id || I.id,
					blocks: F.blocks
				}, I = void 0, F = void 0, ve = [], ye = !1, L = !1);
			}
			if (M.value || (ne.value = Nm(j.value, d)), M.value && ye && be && I && F && !xe) {
				let e = Um(d, be), t = [...ve, {
					user: I,
					turn: F,
					hasCorrections: De
				}];
				if (e && e.intervals.length <= t.length) {
					for (let [n, r] of t.entries()) {
						let t = e.intervals[n] || [], i = e.users[n];
						i && (r.user.display_id ||= r.user.id, r.user.id = i.id, r.user.content = i.content);
						let a = [...r.turn.blocks], o = a.findIndex((e) => e.kind === "text"), s = t.filter((e) => e.role === "assistant").map((e) => Ol(e.content)).filter((e) => e.trim()).join("\n\n"), c = a.flatMap((e, t) => {
							if (t !== o) return [e];
							let n = Bm(e.content, s);
							return n.trim() || e.kind === "text" && e.images?.length ? [{
								...e,
								content: n
							}] : [];
						});
						r.turn.blocks = [], r.turn.native = void 0, Om(r.turn, Dm(t), !0);
						for (let e of c) {
							let t = e.kind === "tool" ? r.turn.blocks.find((t) => t.kind === "tool" && t.id === e.id) : void 0;
							t && e.kind === "tool" ? e.complete && Object.assign(t, e) : r.turn.blocks.push(e);
						}
						r.user.blocks = r.turn.blocks;
					}
					j.value = [...d.slice(0, e.start), ...t.map((e) => e.user)], be = void 0, Ae();
					return;
				}
			}
			if (M.value && I && F) {
				let e = ke?.user_row_id, t = e ? d.findIndex((t) => t.id === String(e)) : -1;
				t >= 0 && Om(F, Dm(d.slice(t + 1)), !0);
				let n = ve[0]?.user || I, r = j.value.findIndex((e) => e === n || !!(e.id && e.id === n.id));
				if (r >= 0) {
					let e = new Set(j.value.slice(0, r).map((e) => e.id)), t = d.reduce((t, n, r) => e.has(n.id) ? r : t, -1), i = t >= 0 ? d.slice(0, t + 1) : [], a = d.findIndex((e) => e.id && e.id === n.id);
					a >= 0 && (i = d.slice(0, a));
					let o = d.reduce((e, t, n) => t.role === "user" ? n : e, -1), s = d[o];
					ye && !xe && !De && !ve.length && s && (s.display_kind || void 0) === (I.display_kind || void 0) && Mm(s) === Mm(I) && (i = d.slice(0, o), Om(F, Dm(d.slice(o + 1)), !0)), j.value = [...i, ...j.value.slice(r)];
				}
				Ae();
				return;
			}
			if (I && F && !ve.length || ve.some((e) => e.hasCorrections)) return Ae(), !0;
			for (let e of ve) {
				let { turn: t, receipt: n } = e, r = n?.user_row_id == null ? -1 : d.findIndex((e) => e.id === String(n.user_row_id)), i = r + 1;
				for (; i < d.length && d[i]?.role !== "user";) i++;
				r >= 0 && Om(t, Dm(d.slice(r + 1, i)), !1);
				let a = new Set(d.map((e) => e.id)), o = d.find((e) => e.id === String(n?.final_assistant_row_id)), s = [...t.blocks].reverse().find((e) => e.kind === "text")?.content || "";
				if (!(n?.complete && r >= 0 && n.row_ids.every((e) => a.has(String(e))) && o && Ol(o.content).trim() === s.trim())) return Ae(), !0;
				d[r] = {
					...d[r],
					display_id: e.user.display_id || e.user.id,
					blocks: t.blocks
				};
			}
			j.value = d;
			let f = await i.rpc("reconciled", { through: a });
			return n === N && r === me && i === de && a === i.boundary && !M.value && f.settled && e(), !0;
		} catch {
			if (s = !0, n === N && r === me && (ie.value ||= E, D < 3)) {
				let e = 1e3 * 2 ** D++;
				ee = setTimeout(() => {
					ee = void 0, n === N && i === de && Ie(t);
				}, e);
			}
			return !1;
		} finally {
			n === N && r === me && (s || (D = 0, ie.value === E && (ie.value = "")), C = !1, re.value = !1, w && (w = !1, A()));
		}
	}
	async function Le(e, t) {
		(!ge || Te !== e || R !== t) && (We(), je(N + 1), Te = e, R = t, ge = !0, pe = !0, le.value = Im(Te, R)), await Be();
	}
	function Re() {
		p(), O(), D = 0, T?.abort(), T = void 0, S++, C = !1, w = !1, y.value = !1, je(N + 1), me++, de?.close(), de = void 0, he = void 0, fe = !1, re.value = !1, oe.value = "stale";
	}
	function ze(e, t) {
		let n = P !== e || _e !== t;
		return P = e, _e = t, !P || !_e ? (!P && _e && de?.retainWhileHidden && oe.value === "ready" || ge && oe.value !== "stale" && Re(), Promise.resolve()) : n ? Be() : he || Promise.resolve();
	}
	function Be() {
		if (!ge || !P || !_e || oe.value === "ready") return Promise.resolve();
		if (he) return he;
		let e = ++N;
		se.value = e, me++, fe = !0, re.value = j.value.length === 0, oe.value = "reconnecting";
		let t = [], n = (n) => {
			e === N && (t ? t.push(n) : n());
		}, a = new fl(Te, R, {
			snapshot: (r) => {
				t = [], n(() => {
					ie.value = le.value ? "Submission outcome unknown. Inspect history and native state before sending again." : "", ae.value = "", ce.value = [], Fe(r, e), r.running && i?.(Te, R, !0);
				});
			},
			input: (e, t, r, i) => n(() => Pe(e, t, r, i)),
			event: (e) => n(() => {
				let t = e.payload || {};
				e.type === "message.start" ? i?.(Te, R, !0) : (e.type === "message.complete" || e.type === "session.reclaimed") && i?.(Te, R, !1), e.type === "session.usage" && m(e.payload.usage);
				let n = typeof t.text == "string" ? t.text : "";
				(e.type === "session.title" || e.type === "session.info") && typeof t.title == "string" && Ne(t.title), e.type === "message.start" ? (Me(), M.value = !0, ae.value = I && hm(I) === "status" ? gm(I) : "Working…", ke = void 0) : e.type === "thinking.delta" || e.type === "tool.generating" ? ae.value = e.type === "tool.generating" ? "Preparing " + (typeof t.name == "string" && t.name ? t.name : "tool") : n || "Working…" : e.type === "status.update" ? ae.value = n : e.type === "notice" ? ae.value = typeof t.message == "string" ? t.message : "" : e.type === "error" ? ie.value = typeof t.message == "string" ? t.message : "Session failed" : e.type === "session.reclaimed" && (p(), g(), l && h(), M.value = !1, ae.value = "Session reclaimed"), !F && I && (F = /* @__PURE__ */ Pt(Cm()));
				let a = F;
				if (e.type.startsWith("subagent.") || e.type.startsWith("tool.")) {
					let n = e.type.startsWith("subagent.") ? "subagent-" + bm(t) : t.tool_id;
					a = [...ve].reverse().find((e) => e.turn.blocks.some((e) => e.id === n))?.turn || F;
				}
				if (a && Am(a, e.type, {
					...t,
					persisted: fe
				}), e.type === "message.complete") {
					fe || r?.(Te, R), f(), m(e.payload.usage, !1), fe || (g(), l && h()), Ee = !1;
					for (let e of ve) Am(e.turn, "message.complete", { status: t.status });
					ke = t.persisted_turn, I && F && !ve.some((e) => e.user === I && e.turn === F) && ve.push({
						user: I,
						turn: F,
						receipt: ke,
						hasCorrections: De
					}), M.value = !1, ae.value = _m(t.status), typeof t.status == "string" && t.status && t.status !== "complete" && (ie.value = typeof t.error == "string" && t.error ? t.error : "Response " + t.status), fe || Ie();
				} else e.type === "subagent.complete" && !M.value && !fe && Ie();
				Ae();
			}),
			requests: (e) => n(() => {
				ce.value = e;
			}),
			connection: (t, r) => {
				if (e === N) {
					if (t === "closed") {
						let e = oe.value === "ready";
						Re(), ie.value = r || "Session connection lost. Reconnect to restore this session.", ae.value = "Disconnected · backend state will be checked on reconnect";
						let t = N;
						e && queueMicrotask(() => {
							N === t && ge && oe.value === "stale" && Be();
						});
					} else r && n(() => {
						ie.value = r;
					});
				}
			},
			recovered: () => {
				if (e !== N) return;
				let n = t || [];
				t = void 0;
				for (let e of n) e();
				fe = !1, re.value = !1, oe.value = "ready", r?.(Te, R), g(), l && h(), Ie();
			}
		});
		de = a;
		let o = (async () => {
			try {
				if (await a.ensure(), e === N && oe.value !== "ready") throw new Z("Native session reconstruction did not become ready");
			} catch {
				e === N && (Re(), ie.value = "Could not reconnect this session. Retry when the dashboard is available.");
			} finally {
				e === N && (he = void 0);
			}
		})();
		return he = o, o;
	}
	async function Ve(e, t, n, r) {
		if (!P || !_e || !de || M.value || le.value || re.value || oe.value !== "ready") throw new Z("Native session is not ready. Message not submitted.", "rejected");
		let i = N, a = de, o = Lm(Te, R);
		le.value = !0, ie.value = "", Ee = !1, Pe(e), I.content = r ?? t, Ee = !0, Se = o, Ce = e, we.add(o);
		let s = I.id, c = !1;
		try {
			let e = typeof t == "function" ? await t() : t;
			if (i !== N || !P || !_e) throw new Z("Viewer detached before submission", "rejected");
			c = !0, await a.rpc("prompt.submit", {
				input: e,
				admission_id: o,
				...n
			}), Rm(He(a), a.stored, o), i === N && (le.value = !1), ge && Te === a.profile && R === a.stored && Se === o && Me();
		} catch (e) {
			throw !c || e instanceof Z && e.outcome === "rejected" ? (Rm(He(a), a.stored, o), ge && Te === a.profile && R === a.stored && Se === o && (j.value = j.value.filter((e) => e.id !== s), le.value = Im(Te, R), Ee = !1, I?.id === s && (M.value = !1, F = void 0, I = void 0))) : i === N && (ie.value = "Submission outcome unknown. Inspect history and native state before sending again."), e;
		} finally {
			we.delete(o);
		}
	}
	let He = (e) => e.profile;
	async function Ue() {
		if (!ge || (oe.value !== "ready" && await Be(), oe.value !== "ready") || we.has(Se)) return;
		let e = N, t = de, n = t.boundary;
		try {
			let r = await t.rpc("state");
			if (e !== N || t.boundary !== n || we.has(Se)) return;
			if (r.running !== !1 || r.queued || r.delegating) {
				ie.value = "Hermes is still working; sending remains locked.";
				return;
			}
			M.value = !1, await Ie() && e === N && t.boundary === n && !M.value && (Rm(Te, R), le.value = Im(Te, R), le.value || (ie.value = ""));
		} catch {
			e === N && (ie.value = "Could not verify native session state; sending remains locked.");
		}
	}
	function We() {
		Re(), ge = !1, l = !1, a.value = void 0, pe = !1, Se = "", j.value = [], x = void 0, ye = !1, L = !1, be = void 0, v.value = !1, b.value = "", ne.value = {}, M.value = !1, re.value = !1, ce.value = [], le.value = !1, ie.value = "", ae.value = "", F = void 0, I = void 0, ve = [];
	}
	function Ge() {
		if (!de || oe.value !== "ready") throw new Z("Session is read-only until reconnected", "rejected");
		return de;
	}
	return {
		hasEarlier: v,
		loadingEarlier: y,
		earlierError: b,
		loadEarlier: A,
		contextUsage: o,
		contextBreakdown: s,
		contextLoading: c,
		setContextOpen: _,
		refreshContext: g,
		generationRef: se,
		settings: a,
		messages: j,
		responseTargets: ne,
		busy: M,
		loading: re,
		error: ie,
		status: ae,
		connection: oe,
		approval: ue,
		requests: ce,
		uncertain: le,
		attach: Le,
		submit: Ve,
		close: We,
		hydrate: Ie,
		resolveUncertainty: Ue,
		reconnect: Be,
		availability: ze,
		stop: () => Ge().rpc("session.interrupt"),
		command: (e, t = {}) => Ge().command(e, t),
		refreshCommand: async () => {
			Re(), await Be(), await Ie(), e();
		},
		steer: (e) => Ge().rpc("session.steer", { text: e }),
		answer: (e, t) => Ge().answer(e, t)
	};
}
//#endregion
//#region src/features/sessions/composables/useSessionActivity.ts
function Gm(e) {
	let t = /* @__PURE__ */ z(/* @__PURE__ */ new Set()), n, r = 0, i = !1, a = !1, o = [], s = /* @__PURE__ */ new Map(), c = 0, l = /* @__PURE__ */ new Map();
	function u(n, r, i) {
		if (a || (n || "default") !== (e.value || "default")) return;
		let s = o.find((e) => e.includes(r)) || [r], u = new Set(t.value);
		c++;
		for (let e of s) l.set(e, c), i ? u.add(e) : u.delete(e);
		t.value = u;
	}
	async function d() {
		if (a || document.visibilityState === "hidden" || !navigator.onLine) return;
		if (n) {
			i = !0;
			return;
		}
		let c = n = new AbortController(), u = setTimeout(() => c.abort(), 1e4), f = r, p = new Map(l);
		try {
			let n = await Q.sessionActivity(e.value, c.signal);
			if (f !== r || c.signal.aborted) return;
			if (!Array.isArray(n.sessions) || n.sessions.some((e) => !e || typeof e.id != "string" || typeof e.session_key != "string" || e.session_keys_complete !== void 0 && typeof e.session_keys_complete != "boolean" || e.session_keys !== void 0 && (!Array.isArray(e.session_keys) || e.session_keys.some((e) => typeof e != "string")) || ![
				"idle",
				"starting",
				"working",
				"waiting",
				"unknown"
			].includes(e.status))) throw Error("Invalid activity snapshot");
			o = n.sessions.map((e) => {
				let t = s.get(e.id) || [], n = e.session_keys_complete === !1 || e.session_keys_complete === void 0 && e.status === "unknown";
				return [.../* @__PURE__ */ new Set([
					e.session_key,
					...e.session_keys || [],
					...n && t.includes(e.session_key) ? t : []
				])];
			}), s = new Map(n.sessions.map((e, t) => [e.id, o[t]]));
			let i = /* @__PURE__ */ new Set();
			for (let [e, r] of n.sessions.entries()) {
				let n = o[e], a = n.filter((e) => l.get(e) !== p.get(e));
				(a.length ? t.value.has(a.sort((e, t) => l.get(t) - l.get(e))[0]) : r.status === "unknown" ? n.some((e) => t.value.has(e)) : r.status === "working" || r.status === "waiting") && n.forEach((e) => i.add(e));
			}
			for (let [e, n] of l) n === p.get(e) || o.some((t) => t.includes(e)) || (t.value.has(e) ? i.add(e) : i.delete(e));
			t.value = i;
		} catch {} finally {
			clearTimeout(u), n === c && (n = void 0, i && (i = !1, d()));
		}
	}
	V(e, () => {
		r++, n?.abort(), n = void 0, i = !1, l.clear(), o = [], s.clear(), t.value = /* @__PURE__ */ new Set(), d();
	}, {
		immediate: !0,
		flush: "sync"
	});
	let f = setInterval(() => void d(), 5e3), p = () => void d();
	return document.addEventListener("visibilitychange", p), window.addEventListener("online", p), window.addEventListener("focus", p), Te(() => {
		a = !0, r++, n?.abort(), n = void 0, i = !1, clearInterval(f), document.removeEventListener("visibilitychange", p), window.removeEventListener("online", p), window.removeEventListener("focus", p);
	}), {
		workingSessions: t,
		event: u,
		refresh: d
	};
}
//#endregion
//#region src/features/notifications/services/push.ts
var Km = "/api/plugins/chathermes", qm;
function Jm() {
	return typeof window < "u" && window.isSecureContext && typeof navigator < "u" && "serviceWorker" in navigator && "PushManager" in window && typeof Notification < "u";
}
async function Ym(e) {
	let t = e.active || e.installing || e.waiting;
	if (!t) throw Error("Notification service worker is unavailable.");
	await new Promise((e, n) => {
		let r = () => {
			(t.state === "activated" || t.state === "redundant") && (t.removeEventListener("statechange", r), t.state === "activated" ? e() : n(/* @__PURE__ */ Error("Notification service worker installation failed.")));
		};
		t.addEventListener("statechange", r), r();
	});
}
async function Xm() {
	if (!Jm()) throw Error("Notifications require a secure browser with Push API support.");
	return Zm();
}
async function Zm() {
	if (!window.isSecureContext || !("serviceWorker" in navigator)) throw Error("Service workers require a secure browser.");
	return qm ||= navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
		scope: "/chathermes",
		updateViaCache: "none"
	}).then(async (e) => (await Ym(e), e)).catch((e) => {
		throw qm = void 0, e;
	}), qm;
}
function Qm(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4));
	return Uint8Array.from(n, (e) => e.charCodeAt(0));
}
async function $m() {
	let e = await fetch(Km + "/push/config", { credentials: "same-origin" });
	if (!e.ok) throw Error("Push configuration unavailable");
	return e.json();
}
async function eh() {
	return (await Xm()).pushManager.getSubscription();
}
async function th(e, t) {
	let n = await fetch(Km + "/push/status" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ endpoint: t.endpoint })
	});
	if (!n.ok) throw Error("Could not load notification status for this profile.");
	return n.json();
}
async function nh(e = "") {
	if (!Jm()) return {
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: "Notifications require HTTPS and a supported browser."
	};
	try {
		let [t, n] = await Promise.all([eh(), $m()]), r = t ? await th(e, t) : null;
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
async function rh(e) {
	if (!Jm()) throw Error("Notifications require HTTPS and a supported browser.");
	let t = await Notification.requestPermission();
	if (t !== "granted") throw Error(t === "denied" ? "Notification permission is blocked in browser settings." : "Notification permission was not granted.");
	let n = await Xm(), r = await $m();
	if (!r.available || !r.vapid_public_key) throw Error("Push notifications are unavailable on this server.");
	let i = await n.pushManager.subscribe({
		userVisibleOnly: !0,
		applicationServerKey: Qm(r.vapid_public_key)
	});
	if (!(await fetch(Km + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			endpoint: i.endpoint,
			keys: i.toJSON().keys
		})
	})).ok) throw Error("Could not save this notification subscription.");
}
async function ih(e) {
	let t = await eh();
	if (!t) return;
	let n = await th(e, t);
	if (n.enabled && n.id && !(await fetch(Km + "/push/subscriptions/" + encodeURIComponent(n.id) + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "DELETE",
		credentials: "same-origin"
	})).ok) throw Error("Could not disable notifications for this profile.");
}
async function ah(e) {
	if (!(await fetch(Km + "/push/test" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin"
	})).ok) throw Error("Could not send a test notification.");
}
//#endregion
//#region src/features/notifications/services/push-client.ts
function oh(e, t, n = document.visibilityState) {
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
function sh(e, t, n) {
	let r = !0, i = null, a = () => oh(t(), n()), o = () => {
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
//#region src/features/chat/context.ts
var ch = Symbol("live chat");
function lh(e) {
	Nn(ch, e);
}
function uh() {
	let e = Pn(ch);
	if (!e) throw Error("Live chat context is missing");
	return e;
}
var dh = Symbol("conversation focus");
//#endregion
//#region src/features/chat/utils/context-usage.ts
function fh(e) {
	return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : null;
}
function ph(e) {
	let t = fh(e?.context_percent);
	return t !== null && t <= 100 ? t : null;
}
//#endregion
//#region src/features/chat/components/ContextUsagePopover.vue?vue&type=script&setup=true&lang.ts
var mh = {
	role: "dialog",
	"aria-label": "Context usage",
	class: "context-panel rounded-2xl border border-[#424242] bg-[#212121] p-3 text-sm text-white shadow-xl"
}, hh = { class: "flex items-center justify-between gap-3" }, gh = { class: "mt-1 break-all" }, _h = { class: "text-[#b4b4b4]" }, vh = {
	key: 0,
	class: "mt-2 text-[#b4b4b4]"
}, yh = {
	key: 1,
	class: "text-amber-200"
}, bh = {
	key: 2,
	class: "text-[#b4b4b4]"
}, xh = {
	key: 3,
	class: "mt-2 text-[#b4b4b4]",
	role: "status"
}, Sh = {
	class: "context-breakdown-bar mt-2 flex h-2 overflow-hidden rounded-full bg-[#424242]",
	"aria-hidden": "true"
}, Ch = { class: "mt-2 space-y-1" }, wh = { class: "flex min-w-0 items-center gap-2" }, Th = { class: "shrink-0" }, Eh = {
	key: 5,
	class: "mt-2 text-[#b4b4b4]"
}, Dh = /* @__PURE__ */ H({
	__name: "ContextUsagePopover",
	props: {
		usage: {},
		breakdown: {},
		loading: { type: Boolean },
		model: {}
	},
	emits: ["close"],
	setup(e) {
		let t = e, n = {
			system_prompt: "#60a5fa",
			tool_definitions: "#a78bfa",
			skills: "#34d399",
			memory: "#fb923c",
			rules: "#fbbf24",
			mcp: "#f472b6",
			subagent_definitions: "#22d3ee",
			conversation: "#818cf8"
		}, r = X(() => (t.breakdown?.categories || []).filter((e) => e && typeof e.label == "string" && fh(e.tokens) !== null).map((e) => ({
			...e,
			color: n[e.id] || "#a3a3a3"
		}))), i = X(() => r.value.reduce((e, t) => e + t.tokens, 0)), a = X(() => ph(t.usage) === null ? t.breakdown : t.usage), o = X(() => ph(a.value)), s = (e) => fh(e)?.toLocaleString() ?? "—", c = X(() => a.value?.context_estimated || ["local_estimate", "provider_usage_plus_estimate"].includes(a.value?.context_source || ""));
		return (t, n) => (G(), K("section", mh, [
			q("div", hh, [n[1] ||= q("strong", null, "Context usage", -1), q("button", {
				type: "button",
				"aria-label": "Close context usage",
				class: "px-2 text-base",
				onClick: n[0] ||= (e) => t.$emit("close")
			}, " × ")]),
			q("p", gh, L(e.usage?.model || e.breakdown?.model || e.model || "Current model"), 1),
			q("p", _h, L(s(a.value?.context_used)) + " / " + L(s(a.value?.context_max)) + " tokens · " + L(o.value === null ? "Unknown" : `${Math.round(o.value)}%`), 1),
			o.value === null ? (G(), K("p", vh, "Context usage unavailable")) : Y("v-if", !0),
			c.value ? (G(), K("p", yh, "Estimated usage")) : Y("v-if", !0),
			B(fh)(e.usage?.compressions) === null ? Y("v-if", !0) : (G(), K("p", bh, L(e.usage?.compressions) + " compressions ", 1)),
			e.loading ? (G(), K("p", xh, "Loading context breakdown…")) : r.value.length ? (G(), K(W, { key: 4 }, [
				n[2] ||= q("p", { class: "mt-3 text-[#b4b4b4]" }, "Estimated breakdown", -1),
				q("div", Sh, [(G(!0), K(W, null, U(r.value, (e, t) => (G(), K("span", {
					key: `${e.id}-${t}`,
					style: ce({
						width: i.value > 0 ? `${e.tokens / i.value * 100}%` : "0%",
						backgroundColor: e.color
					})
				}, null, 4))), 128))]),
				q("dl", Ch, [(G(!0), K(W, null, U(r.value, (e, t) => (G(), K("div", {
					key: `${e.id}-${t}`,
					class: "flex items-center justify-between gap-3"
				}, [q("dt", wh, [q("span", {
					class: "size-2 shrink-0 rounded-full",
					style: ce({ backgroundColor: e.color }),
					"aria-hidden": "true"
				}, null, 4), J(L(e.label), 1)]), q("dd", Th, L(s(e.tokens)) + " tokens", 1)]))), 128))])
			], 64)) : (G(), K("p", Eh, " Context breakdown unavailable until the agent has initialized. "))
		]));
	}
}), Oh = [
	"aria-label",
	"aria-expanded",
	"aria-controls"
], kh = {
	viewBox: "0 0 30 30",
	class: "absolute inset-0 size-full -rotate-90",
	"aria-hidden": "true"
}, Ah = ["stroke-dasharray"], jh = /* @__PURE__ */ H({
	__name: "ContextUsageIndicator",
	props: {
		usage: {},
		breakdown: {},
		loading: { type: Boolean },
		active: { type: Boolean },
		visible: { type: Boolean },
		model: {}
	},
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z(), a = /* @__PURE__ */ z(), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(360), l = Kn(), u, d, f = X(() => ph(n.usage)), p = X(() => f.value === null ? "text-[#a3a3a3]" : f.value >= 90 ? "text-red-200" : f.value >= 75 ? "text-amber-200" : "text-emerald-200");
		function m() {
			let e = i.value?.closest(".composer")?.getBoundingClientRect().top ?? 0, t = Math.max(window.visualViewport?.offsetTop ?? 0, i.value?.closest(".chat-interface")?.getBoundingClientRect().top ?? 0);
			c.value = Math.max(0, Math.min(360, e - t - 16));
		}
		function h() {
			clearTimeout(u);
		}
		function g() {
			h(), s.value = !1, o.value = !1;
		}
		function _() {
			h(), n.active && !o.value && (m(), o.value = !0, vn(m));
		}
		function v(e) {
			e.pointerType === "mouse" && _();
		}
		function y() {
			s.value || (u = setTimeout(g, 150));
		}
		function b() {
			s.value ? g() : (_(), s.value = o.value);
		}
		function x(e) {
			e.composedPath().includes(i.value) || g();
		}
		function S(e) {
			if (e.key !== "Escape" || !o.value) return;
			let t = i.value?.contains(document.activeElement);
			g(), t && a.value?.focus();
		}
		return V(o, (e) => r("open", e), { flush: "sync" }), V(() => n.active, (e) => {
			e || g();
		}), sr(() => {
			if (document.addEventListener("click", x), document.addEventListener("keydown", S), window.addEventListener("resize", m), window.addEventListener("scroll", m, !0), window.visualViewport?.addEventListener("resize", m), window.visualViewport?.addEventListener("scroll", m), typeof ResizeObserver < "u") {
				d = new ResizeObserver(m);
				let e = i.value?.closest(".composer");
				e && d.observe(e);
			}
		}), ur(() => {
			g(), d?.disconnect(), document.removeEventListener("click", x), document.removeEventListener("keydown", S), window.removeEventListener("resize", m), window.removeEventListener("scroll", m, !0), window.visualViewport?.removeEventListener("resize", m), window.visualViewport?.removeEventListener("scroll", m);
		}), (t, n) => jn((G(), K("div", {
			ref_key: "root",
			ref: i,
			class: "context-control shrink-0",
			onPointerenter: h,
			onPointerleave: y
		}, [q("button", {
			ref_key: "button",
			ref: a,
			type: "button",
			class: fe(["context-meter relative grid size-[30px] place-items-center rounded-full p-0 text-[9px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2", p.value]),
			"aria-label": f.value === null ? "Context usage unavailable" : `Context ${Math.round(f.value)} percent used`,
			"aria-haspopup": "dialog",
			"aria-expanded": o.value,
			"aria-controls": B(l),
			onClick: b,
			onPointerenter: v
		}, [(G(), K("svg", kh, [n[0] ||= q("circle", {
			cx: "15",
			cy: "15",
			r: "13",
			fill: "none",
			stroke: "#525252",
			"stroke-width": "2"
		}, null, -1), f.value === null ? Y("v-if", !0) : (G(), K("circle", {
			key: 0,
			cx: "15",
			cy: "15",
			r: "13",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			pathLength: "100",
			"stroke-dasharray": `${f.value} 100`
		}, null, 8, Ah))])), q("span", null, L(f.value === null ? "—" : `${Math.round(f.value)}%`), 1)], 42, Oh), o.value ? (G(), Hi(Dh, {
			key: 0,
			id: B(l),
			class: "absolute bottom-full right-0 z-30 mb-2 w-full max-w-[340px] overflow-y-auto overscroll-contain",
			style: ce({ maxHeight: `${c.value}px` }),
			usage: e.usage,
			breakdown: e.breakdown,
			loading: e.loading,
			model: e.model,
			onClose: g
		}, null, 8, [
			"id",
			"style",
			"usage",
			"breakdown",
			"loading",
			"model"
		])) : Y("v-if", !0)], 544)), [[Ia, e.visible ?? e.active]]);
	}
}), Mh = { class: "absolute bottom-full left-0 z-20 mb-2 max-h-[min(40dvh,320px)] w-full overflow-y-auto overscroll-contain rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl" }, Nh = {
	key: 0,
	role: "status",
	class: "p-2 text-[#b4b4b4]"
}, Ph = {
	key: 1,
	role: "status",
	class: "p-2 text-sm text-[#b4b4b4]"
}, Fh = {
	key: 2,
	role: "status",
	class: "p-2 text-[#b4b4b4]"
}, Ih = ["id"], Lh = {
	key: 0,
	class: "px-3 pt-2 text-xs text-[#a3a3a3]"
}, Rh = [
	"id",
	"aria-selected",
	"onClick"
], zh = { class: "block break-words" }, Bh = { class: "block text-sm text-[#b4b4b4]" }, Vh = /* @__PURE__ */ H({
	__name: "SlashCommandMenu",
	props: {
		id: {},
		items: {},
		selected: {},
		loading: { type: Boolean },
		error: {}
	},
	emits: ["select"],
	setup(e) {
		return (t, n) => (G(), K("div", Mh, [
			e.loading ? (G(), K("p", Nh, "Loading commands…")) : Y("v-if", !0),
			e.error ? (G(), K("p", Ph, L(e.error), 1)) : Y("v-if", !0),
			!e.loading && !e.error && !e.items.length ? (G(), K("p", Fh, " No command suggestions. Escape closes this menu. ")) : Y("v-if", !0),
			q("div", {
				id: e.id,
				role: "listbox",
				"aria-label": "Slash commands"
			}, [(G(!0), K(W, null, U(e.items, (r, i) => (G(), K(W, { key: i }, [r.group !== "Session" && (i === 0 || e.items[i - 1]?.group !== r.group) ? (G(), K("p", Lh, L(r.group), 1)) : Y("v-if", !0), q("button", {
				type: "button",
				role: "option",
				id: `${e.id}-${i}`,
				"aria-selected": e.selected === i,
				tabindex: "-1",
				class: fe(["block w-full rounded-xl px-3 py-2 text-left", e.selected === i ? "bg-[#424242]" : "hover:bg-[#303030]"]),
				onPointerdown: n[0] ||= Oo(() => {}, ["prevent"]),
				onClick: (e) => t.$emit("select", i)
			}, [q("span", zh, L(r.display || r.text), 1), q("span", Bh, L(r.meta), 1)], 42, Rh)], 64))), 128))], 8, Ih)
		]));
	}
}), Hh = /* @__PURE__ */ new Set(/* @__PURE__ */ "approvals.approve.autoprune.blueprint.bundles.busy.codex-runtime.commands.context.cron.curator.debug.deny.diff.egress.fast.footer.goal.heartbeat.help.init.insights.kanban.learn.login.loop.memory.moa.personality.plan.platforms.profile.reasoning.refine.review.skills.status.subgoal.suggestions.title.toolsets.topup.usage.verbose.version.voice.whoami.yolo".split(".")), Uh = [
	"none",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
];
//#endregion
//#region src/features/chat/commands/slash.ts
function Wh(e) {
	let t = e.toLowerCase().split(/\s+/).filter(Boolean), n = t.includes("--global") ? "global" : "session", r = t.filter((e) => !["--global", "--session"].includes(e)).join(" ");
	if (!e.trim()) return {
		scope: n,
		value: "",
		effort: !1
	};
	let i = Uh.includes(r) || ["false", "disabled"].includes(r);
	if (!i && ![
		"show",
		"on",
		"hide",
		"off",
		"full",
		"all",
		"clamp",
		"collapse",
		"short"
	].includes(r)) throw Error("Use /reasoning with an effort level, show, hide, full or clamp; optionally --global or --session.");
	return {
		scope: n,
		value: r,
		effort: i
	};
}
var Gh = (e) => /^\/[^\s/]*(?:\s|$)/.test(e);
function Kh(e) {
	let t = /^\/([^\s/]+)([\s\S]*)$/.exec(e);
	return {
		name: t?.[1]?.toLowerCase() || "",
		arg: t?.[2]?.trim() || ""
	};
}
var qh = /* @__PURE__ */ new Set([
	"help",
	"commands",
	"retry",
	"compress",
	"stop",
	"steer",
	"title"
]);
function Jh(e, t) {
	let n = Yh(e, t);
	return [
		"compress",
		"title",
		"steer"
	].includes(n) ? "text" : n === "reasoning" ? "options" : e.commands?.[`/${n}`]?.argument_mode ?? null;
}
function Yh(e, t) {
	return (e.canon?.[`/${t}`] || `/${t}`).replace(/^\//, "");
}
function Xh(e, t, n = "") {
	let r = `/${t}`, i = e.commands?.[r], a = Hh.has(t) || !!i && !Object.hasOwn(e.plugin_commands || {}, t);
	return qh.has(t) ? "" : a && (!Hh.has(t) || i?.desktop && i.desktop !== "hidden") ? `/${t} requires a client or terminal feature that ChatHermes does not support. Use the existing dashboard controls or Hermes terminal.` : i?.desktop_subcommands && !i.desktop_subcommands.includes(n.split(/\s/)[0] || "") ? `/${t} supports these arguments here: ${i.desktop_subcommands.join(", ")}.` : [
		"usage",
		"suggestions",
		"profile"
	].includes(t) && n || t === "cron" && n && n !== "list" || t === "voice" && n.toLowerCase() === "tts" ? `This /${t} form is unavailable in ChatHermes. Use the Hermes terminal.` : "";
}
function Zh(e, t) {
	return [
		"goal",
		"loop",
		"plan",
		"learn",
		"init",
		"moa",
		"retry"
	].includes(t) || !e.commands?.[`/${t}`] || Object.hasOwn(e.plugin_commands || {}, t) ? "command.dispatch" : "slash.exec";
}
function Qh(e) {
	if (e.type === "send" || e.type === "skill") {
		if (typeof e.message != "string" || !e.message.trim()) throw Error("Hermes returned an empty command prompt.");
		return e.message;
	}
}
//#endregion
//#region src/features/chat/commands/useSlashCompletion.ts
function $h(e, t, n, r) {
	let i = /* @__PURE__ */ z(!1), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z([]), c = /* @__PURE__ */ z(0), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z({}), d = /* @__PURE__ */ z(null), f = X(() => {
		let t = d.value?.text;
		return !t || !(e.value === t || e.value.startsWith(t + " ")) ? 0 : t.length + +(e.value[t.length] === " ");
	}), p = X({
		get: () => e.value.slice(f.value),
		set: (t) => {
			e.value = e.value.slice(0, f.value) + t;
		}
	}), m = `slash-${Kn()}`, h = 0, g, _ = !1, v = 1, y = "", b = 0, x = 0, S = /* @__PURE__ */ z(null), C = X(() => e.value.slice(0, Math.min(S.value ?? e.value.length, e.value.length))), w = X(() => {
		let e = C.value, t = /\s(\/(?:[a-zA-Z][\w-]*)?)$/.exec(e);
		return t ? {
			text: t[1],
			start: e.length - t[1].length,
			inline: !0
		} : Gh(e) && !e.includes("\n") ? {
			text: e,
			start: 0,
			inline: !1
		} : null;
	}), T = X(() => Jh(u.value, Kh(w.value?.text || "").name)), E = X(() => /\s/.test(w.value?.text || "")), ee = X(() => E.value && ["text", "mixed"].includes(T.value || ""));
	function D() {
		S.value = r.value ? r.value.selectionStart + f.value : e.value.length;
	}
	function O() {
		_ = !1, h++, clearTimeout(g), i.value = !1, a.value = !1, s.value = [];
	}
	V(t, () => {
		u.value = {}, d.value = null;
	}), V(e, (e) => {
		d.value && !(e === d.value.text || e.startsWith(`${d.value.text} `)) && (d.value = null);
	}), V([
		e,
		t,
		S
	], () => {
		O();
		let t = n(), r = e.value, f = w.value;
		if (!t || !f) return;
		let p = f.text;
		if (!f.inline && d.value && C.value.length >= d.value.text.length || E.value && T.value === "text") return;
		_ = !0, i.value = !0, a.value = !0, o.value = "", c.value = 0, l.value = !1;
		let m = C.value.length, S = h;
		g = setTimeout(async () => {
			try {
				let e = await t(p);
				if (h !== S) return;
				u.value = e.catalog, y = r, b = m, x = f.start;
				let n = e.replace_from ?? 1;
				if (!Number.isInteger(n) || n < 0 || n > Array.from(p).length) throw Error();
				v = Array.from(p).slice(0, n).join("").length;
				let a = Kh(p);
				s.value = (e.items || []).filter((e) => !f.inline || e.kind === "skill").map((t) => {
					let n = Yh(e.catalog, Kh(t.text.startsWith("/") ? t.text : `/${t.text}`).name), r = e.catalog.categories?.find((e) => e.pairs?.some(([e]) => e?.toLowerCase() === `/${n}`));
					return {
						...t,
						group: v > 1 ? "Arguments" : t.kind === "skill" ? "Skills and bundles" : r?.name || "Commands",
						limitation: v > 1 ? Xh(e.catalog, Yh(e.catalog, a.name), t.text) : Xh(e.catalog, n)
					};
				}), e.catalog.warning && (o.value = "Some command sources are unavailable or have naming conflicts. Hermes may omit affected commands."), e.notice && (o.value = e.notice), E.value && (T.value === "text" || !s.value.length) && !o.value && (i.value = !1);
			} catch {
				h === S && (o.value = "Command discovery unavailable. Ordinary messages still work; slash commands will not be sent as prompts.");
			} finally {
				h === S && (a.value = !1);
			}
		}, 100);
	}), ur(O);
	function k(e) {
		let t = v === 1 && e.text.startsWith("/") ? 0 : v;
		return y.slice(x, x + t) + e.text;
	}
	async function te(t, n, i) {
		S.value = n, e.value = t, await vn(), i || O(), r.value?.focus({ preventScroll: !0 });
		let a = Math.max(0, n - f.value);
		r.value?.setSelectionRange(a, a);
	}
	async function A(t = c.value) {
		let n = s.value[t];
		if (!n || y !== e.value || b !== C.value.length || a.value) return;
		let r = k(n).trimEnd(), i = Kh(r).name, o = Jh(u.value, i), l = x === 0 && !/\s/.test(r) && o !== null, f = e.value.slice(b), p = y.slice(0, x) + r + (/^\s/.test(f) ? "" : " ");
		!l && x === 0 && (d.value = {
			text: r,
			kind: n.kind === "skill" ? "Skill" : "Command"
		}), await te(p + f, p.length, l && o !== "text");
	}
	function ne() {
		if (l.value) return c.value;
		let e = (w.value?.text || "").trimEnd().toLowerCase();
		if (e === "/") return -1;
		let t = s.value.map((e) => k(e).trimEnd().toLowerCase()), n = t.indexOf(e);
		if (n >= 0) return n;
		if (t[c.value]?.startsWith(e)) return c.value;
		let r = t.flatMap((t, n) => t.startsWith(e) ? [n] : []);
		return r.length === 1 ? r[0] : -1;
	}
	function j(t) {
		if (t.shiftKey || t.ctrlKey || t.metaKey || t.altKey) return !1;
		if (d.value && t.key === "Backspace" && r.value?.selectionStart === 0 && r.value.selectionEnd === 0) return t.preventDefault(), M(), !0;
		if (t.key === "Escape" && i.value) return t.preventDefault(), O(), !0;
		if (i.value && ["ArrowDown", "ArrowUp"].includes(t.key) && s.value.length) return t.preventDefault(), l.value = !0, c.value = (c.value + (t.key === "ArrowDown" ? 1 : -1) + s.value.length) % s.value.length, vn(() => document.getElementById(`${m}-${c.value}`)?.scrollIntoView?.({ block: "nearest" })), !0;
		if (i.value && t.key === "Tab" && a.value) return t.preventDefault(), !0;
		let n = t.key === "Tab" || (t.key === "Enter" || t.key === " ") && (!ee.value || t.key === "Enter" && l.value);
		if (i.value && s.value.length && n) {
			let e = t.key === "Tab" ? c.value : ne();
			if (e >= 0) return t.preventDefault(), A(e), !0;
			if (t.key === "Tab") return t.preventDefault(), !0;
		}
		if (_ && !a.value && !s.value.length && E.value && T.value === "options" && [" ", "Tab"].includes(t.key)) {
			t.preventDefault();
			let n = C.value.trimEnd();
			d.value = {
				text: n,
				kind: "Command"
			};
			let r = e.value.slice(C.value.length), i = n + (/^\s/.test(r) ? "" : " ");
			return te(i + r, i.length, !1), !0;
		}
		return i.value && !E.value && !s.value.length && (a.value || o.value) && ["Enter", "Tab"].includes(t.key) ? (t.preventDefault(), !0) : !1;
	}
	async function M() {
		let e = d.value?.text.length;
		d.value = null, O(), await vn(), r.value?.focus({ preventScroll: !0 }), e !== void 0 && r.value?.setSelectionRange(0, e);
	}
	return {
		input: p,
		open: i,
		loading: a,
		error: o,
		items: s,
		selected: c,
		menuId: m,
		directive: d,
		editDirective: M,
		accept: A,
		close: O,
		keydown: j,
		updateCursor: D,
		activeId: X(() => i.value && s.value.length ? `${m}-${c.value}` : void 0)
	};
}
//#endregion
//#region src/features/chat/components/ChatComposer.vue?vue&type=script&setup=true&lang.ts
var eg = {
	key: 1,
	class: "max-h-40 overflow-y-auto"
}, tg = { class: "whitespace-pre-wrap break-words" }, ng = { key: 0 }, rg = ["disabled", "onClick"], ig = {
	key: 2,
	class: "flex flex-wrap gap-2 px-2 pb-2"
}, ag = ["src", "alt"], og = { class: "truncate" }, sg = [
	"disabled",
	"onClick",
	"aria-label"
], cg = ["aria-label", "onClick"], lg = {
	key: 3,
	class: "px-2 pb-2 text-sm text-[#d4d4d4]",
	role: "status"
}, ug = {
	key: 4,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, dg = {
	key: 5,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, fg = ["id", "aria-label"], pg = { class: "composer-body" }, mg = [
	"aria-describedby",
	"aria-expanded",
	"aria-controls",
	"aria-activedescendant",
	"placeholder"
], hg = { class: "composer-hint min-w-0 px-1 text-[11px] text-[#a3a3a3]" }, gg = { class: "composer-controls flex items-center gap-3" }, _g = ["aria-expanded", "disabled"], vg = {
	class: "min-w-0 flex-1",
	"aria-hidden": "true"
}, yg = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], bg = { class: "truncate" }, xg = [
	"type",
	"disabled",
	"aria-label",
	"title"
], Sg = {
	key: 0,
	viewBox: "0 0 24 24",
	class: "size-5",
	fill: "currentColor",
	"aria-hidden": "true"
}, Cg = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "size-5",
	"aria-hidden": "true"
}, wg = ["id", "aria-label"], Tg = { class: "flex shrink-0 items-center gap-2 border-b border-[#424242] p-2" }, Eg = { class: "min-w-0 flex-1 truncate" }, Dg = {
	key: 0,
	class: "flex shrink-0 items-center justify-between gap-3 border-b border-[#424242] px-3 py-2"
}, Og = ["value", "disabled"], kg = ["value"], Ag = { class: "min-h-0 overflow-y-auto overscroll-contain" }, jg = ["data-provider", "onClick"], Mg = { class: "min-w-0 flex-1 truncate" }, Ng = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, Pg = ["data-model", "onClick"], Fg = { class: "min-w-0 flex-1 break-all" }, Ig = {
	key: 0,
	"aria-label": "Selected"
}, Lg = {
	key: 0,
	class: "px-3 py-3 text-[#a3a3a3]"
}, Rg = {
	key: 8,
	class: "absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
}, zg = /* @__PURE__ */ H({
	__name: "ChatComposer",
	props: {
		profile: {},
		sessionId: {},
		slashScope: {},
		completeSlash: {},
		contextUsage: {},
		contextBreakdown: {},
		contextLoading: { type: Boolean },
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
		reasoningEffort: {},
		defaultModel: {},
		providers: {},
		provider: {},
		modelsLoading: { type: Boolean }
	},
	emits: [
		"stop",
		"context-open",
		"steer",
		"send",
		"update:model",
		"update:reasoningEffort",
		"update:provider"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z([]), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z([]), f = X(() => !a.value && !c.value.length && !u.value);
		function p(e) {
			if (!f.value) return;
			let t = d.value.splice(e, 1)[0];
			t && (a.value = t.text, c.value = t.files);
		}
		let m = /* @__PURE__ */ z(), h = /* @__PURE__ */ z(), g = /* @__PURE__ */ z(), _ = /* @__PURE__ */ z(), v = /* @__PURE__ */ z(!1), y = /* @__PURE__ */ z(!1), b = $h(a, () => JSON.stringify([
			r.profile,
			r.sessionId,
			r.slashScope
		]), () => r.completeSlash, g), x = Kn(), S;
		function C() {
			let e = g.value;
			if (!e) return;
			let t = getComputedStyle(e), n = parseFloat(t.paddingTop || "0") + parseFloat(t.paddingBottom || "0");
			e.style.height = "0px";
			let r = e.scrollHeight - n, i = parseFloat(t.lineHeight) || 24, a = Math.max(parseFloat(t.minHeight) || 0, Math.min(r, 8 * i)) + n;
			e.style.height = `${a}px`;
		}
		function w(e) {
			e.button === 0 && document.activeElement === g.value && e.preventDefault();
		}
		function T() {
			v.value = !0, O.value = !1, s.value = !1, E();
		}
		function E() {
			vn(C);
		}
		function ee(e) {
			(!(e.relatedTarget instanceof Node) || !_.value?.contains(e.relatedTarget)) && (v.value = !1);
		}
		V(b.input, () => C(), { flush: "post" }), sr(() => {
			if (C(), typeof ResizeObserver < "u") {
				let e = -1;
				S = new ResizeObserver((t) => {
					let n = t[0]?.contentRect.width;
					n !== void 0 && n !== e && (e = n, C());
				}), g.value && S.observe(g.value);
			}
		}), ur(() => S?.disconnect()), V(() => r.suggestedPrompt, (e) => {
			e && (a.value = e);
		}, { immediate: !0 });
		let D = X(() => (r.models || []).filter((e) => e.parent !== null)), O = /* @__PURE__ */ z(!1), k = /* @__PURE__ */ z(null), te = /* @__PURE__ */ z(""), A = /* @__PURE__ */ z(), ne = /* @__PURE__ */ z(), j = Kn(), M = X(() => r.imagesSupported === !1 && c.value.some((e) => e.type.startsWith("image/"))), re = X(() => r.sending || r.modelsLoading), ie = /* @__PURE__ */ z(!1);
		function ae() {
			ie.value = window.innerWidth <= 700 || !!window.matchMedia?.("(hover: none) and (max-height: 500px)").matches;
		}
		ae(), sr(() => window.addEventListener("resize", ae)), ur(() => window.removeEventListener("resize", ae));
		let oe = X(() => v.value && ie.value), se = X(() => r.providers?.find((e) => e.slug === k.value)), ce = X(() => se.value?.name || "Model routes"), le = X(() => {
			let e = O.value && k.value !== null ? k.value : r.provider || "", t = e ? r.providers?.find((t) => t.slug === e) : void 0, n = O.value ? te.value || r.model || r.defaultModel || "" : r.model || r.defaultModel || "";
			return t?.capabilities?.[n]?.reasoning !== !1;
		}), ue = X(() => {
			let e = se.value, t = e ? e.models : D.value.map((e) => e.id);
			return [.../* @__PURE__ */ new Set([...(e?.is_current || !r.providers?.length) && r.defaultModel ? [r.defaultModel] : [], ...t])];
		});
		async function de() {
			await vn();
		}
		function N() {
			O.value && (O.value = !1, A.value?.focus());
		}
		function fe() {
			if (O.value) {
				N();
				return;
			}
			re.value || (s.value = !1, k.value = null, te.value = r.model || r.defaultModel || "", O.value = !0, de());
		}
		function pe(e) {
			k.value = e;
			let t = r.providers?.find((t) => t.slug === e);
			te.value = e === (r.provider || "") ? r.model || r.defaultModel || "" : t?.models[0] || "", de();
		}
		function me() {
			k.value = null, te.value = r.model || r.defaultModel || "", de();
		}
		function he(e) {
			re.value || (te.value = e, i("update:provider", k.value || ""), i("update:model", se.value?.is_current && e === r.defaultModel ? "" : e), N());
		}
		function ge(e) {
			let t = e.composedPath();
			ne.value && !t.includes(ne.value) && A.value && !t.includes(A.value) && N();
		}
		function P(e) {
			if (O.value && (e.key === "Escape" && (e.preventDefault(), N()), e.key === "Tab")) {
				let t = Array.from(ne.value?.querySelectorAll("button, select") || []), n = e.shiftKey ? t.at(-1) : t[0];
				document.activeElement === (e.shiftKey ? t[0] : t.at(-1)) && (e.preventDefault(), n?.focus());
			}
		}
		V(re, (e) => {
			e && N();
		}), V(() => r.providers, () => N()), sr(() => {
			document.addEventListener("click", ge), document.addEventListener("keydown", P);
		}), ur(() => {
			document.removeEventListener("click", ge), document.removeEventListener("keydown", P);
		});
		let _e = X(() => r.sending ? !r.stoppable || !!a.value.trim() && (u.value || c.value.some((e) => !!e.uploadError) || M.value) : r.disabled || u.value || c.value.some((e) => !!e.uploadError) || M.value || !a.value.trim() && !c.value.length);
		function F(e) {
			y.value || e.isComposing || e.keyCode === 229 || e.defaultPrevented || b.keydown(e) || e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || y.value || e.isComposing || e.keyCode === 229 || e.defaultPrevented || window.innerWidth <= 700 || (e.preventDefault(), I());
		}
		function I() {
			if (_e.value) return;
			if (r.sending && a.value.trim()) {
				if (Gh(a.value.trim())) {
					l.value = "Stop the current response before running a slash command.";
					return;
				}
				i("steer", a.value.trim()), a.value = "";
				return;
			}
			if (r.disabled || r.sending || u.value || c.value.some((e) => !!e.uploadError) || M.value) return;
			let e = a.value.trim();
			(e || c.value.length) && (i("send", o.value ? `/${o.value}\n${e}` : e, [...c.value]), a.value = "", c.value = [], s.value = !1, o.value = null);
		}
		async function ve(e) {
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
		let ye = 0;
		ur(() => {
			ye++;
		});
		async function be(e) {
			let t = ye;
			try {
				let n = await Q.upload(r.profile || "", e);
				if (t !== ye) return;
				e.path = n.path, e.uploadError = void 0;
			} catch {
				t === ye && (e.uploadError = "Upload failed. Retry or remove this file.");
			}
		}
		async function xe(e) {
			if (!u.value) {
				u.value = !0;
				try {
					await be(e);
				} finally {
					u.value = !1;
				}
			}
		}
		async function Se(e) {
			if (u.value) return;
			let t = ye;
			u.value = !0, l.value = "", s.value = !1;
			try {
				for (let n of e) try {
					if (n.size > 20971520) throw Error("Each file must be 20 MB or smaller.");
					if (c.value.length >= 5) throw Error("Attach up to five files per message.");
					let e = await new Promise((e, t) => {
						let r = new FileReader();
						r.onload = () => e(String(r.result)), r.onerror = () => t(/* @__PURE__ */ Error("Could not read file.")), r.onabort = () => t(/* @__PURE__ */ Error("File reading was cancelled. Try again.")), r.readAsDataURL(n);
					});
					if (n.type.startsWith("image/") && (e = await ve(e)), t !== ye) return;
					let r = n.type.startsWith("image/") ? e.slice(5, e.indexOf(";")) : n.type || "application/octet-stream", i = {
						name: n.name,
						type: r,
						data: e,
						size: n.size
					};
					c.value.push(i), await be(i);
				} catch (e) {
					if (t !== ye) return;
					l.value = e instanceof Error ? e.message : "Could not read file.";
				}
			} finally {
				t === ye && (u.value = !1);
			}
		}
		async function Ce(e) {
			let t = e.target;
			await Se(Array.from(t.files || [])), t.value = "";
		}
		return t({
			stageFiles: Se,
			blurInput: () => g.value?.blur(),
			restoreDraft: (e, t) => {
				f.value ? (a.value = e, c.value = t, vn(b.close)) : d.value.push({
					text: e,
					files: t
				});
			}
		}), (t, n) => (G(), K("form", {
			ref_key: "form",
			ref: _,
			onFocusout: ee,
			class: "composer relative mx-auto mb-0 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:w-[calc(100%-48px)]",
			onSubmit: Oo(I, ["prevent"])
		}, [
			B(b).open.value ? (G(), Hi(Vh, {
				key: 0,
				id: B(b).menuId,
				items: B(b).items.value,
				selected: B(b).selected.value,
				loading: B(b).loading.value,
				error: B(b).error.value,
				onSelect: B(b).accept
			}, null, 8, [
				"id",
				"items",
				"selected",
				"loading",
				"error",
				"onSelect"
			])) : Y("v-if", !0),
			d.value.length ? (G(), K("div", eg, [(G(!0), K(W, null, U(d.value, (e, t) => (G(), K("details", {
				key: t,
				class: "px-2 pb-2 text-sm"
			}, [
				q("summary", { onMousedown: w }, "Unsent message", 32),
				q("p", tg, L(e.text), 1),
				(G(!0), K(W, null, U(e.files, (e, t) => (G(), K("p", { key: t }, L(e.name), 1))), 128)),
				f.value ? Y("v-if", !0) : (G(), K("p", ng, "Send or clear the current draft to restore this message.")),
				q("button", {
					type: "button",
					class: "underline disabled:no-underline disabled:opacity-50",
					disabled: !f.value,
					onMousedown: w,
					onClick: (e) => p(t)
				}, " Restore unsent message ", 40, rg)
			]))), 128))])) : Y("v-if", !0),
			c.value.length ? (G(), K("div", ig, [(G(!0), K(W, null, U(c.value, (e, t) => (G(), K("div", {
				key: t,
				class: "flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm"
			}, [
				e.type.startsWith("image/") ? (G(), K("img", {
					key: 0,
					src: e.data,
					alt: e.name,
					class: "size-12 rounded-lg object-cover"
				}, null, 8, ag)) : Y("v-if", !0),
				q("span", og, L(e.name), 1),
				e.uploadError ? (G(), K("button", {
					key: 1,
					type: "button",
					class: "text-red-200 underline",
					disabled: u.value,
					onClick: (t) => xe(e),
					"aria-label": `Retry upload ${e.name}`
				}, " Retry upload", 8, sg)) : Y("v-if", !0),
				q("button", {
					type: "button",
					"aria-label": `Remove ${e.name}`,
					onMousedown: w,
					onClick: (e) => c.value.splice(t, 1)
				}, " × ", 40, cg)
			]))), 128))])) : Y("v-if", !0),
			o.value ? (G(), K("p", lg, [J(L(o.value === "goal" ? "Goal mode" : "Plan mode") + " · next message ", 1), q("button", {
				type: "button",
				class: "ml-2 underline",
				onClick: n[0] ||= (e) => o.value = null
			}, "Turn off")])) : Y("v-if", !0),
			M.value ? (G(), K("p", ug, " Image sending is unavailable for this native capability. Remove the image to send text or files. ")) : Y("v-if", !0),
			l.value ? (G(), K("p", dg, L(l.value), 1)) : Y("v-if", !0),
			B(b).directive.value ? (G(), K("button", {
				key: 6,
				id: B(x),
				type: "button",
				class: "mb-1 max-w-full truncate rounded-lg border border-[#525252] px-2 py-1 text-base text-[#d4d4d4]",
				"aria-label": `Edit ${B(b).directive.value.kind.toLowerCase()} ${B(b).directive.value.text}`,
				onMousedown: w,
				onClick: n[1] ||= (...e) => B(b).editDirective && B(b).editDirective(...e)
			}, L(B(b).directive.value.text), 41, fg)) : Y("v-if", !0),
			q("div", pg, [
				n[21] ||= q("label", {
					class: "sr-only",
					for: "prompt"
				}, "Message Hermes", -1),
				jn(q("textarea", {
					ref_key: "textarea",
					ref: g,
					id: "prompt",
					"onUpdate:modelValue": n[2] ||= (e) => B(b).input.value = e,
					"aria-autocomplete": "list",
					"aria-describedby": B(b).directive.value ? B(x) : void 0,
					"aria-expanded": B(b).open.value,
					"aria-controls": B(b).open.value ? B(b).menuId : void 0,
					"aria-activedescendant": B(b).activeId.value,
					rows: "1",
					maxlength: "65536",
					placeholder: e.projectName ? `Message ${e.projectName}` : "Message Hermes…",
					class: "composer-input min-h-14 w-full resize-none bg-transparent px-2 py-1 text-base leading-6 text-white outline-none placeholder:text-[#b4b4b4]",
					onFocus: T,
					onBlur: E,
					onKeydown: F,
					onInput: n[3] ||= (...e) => B(b).updateCursor && B(b).updateCursor(...e),
					onClick: n[4] ||= (...e) => B(b).updateCursor && B(b).updateCursor(...e),
					onKeyup: n[5] ||= (...e) => B(b).updateCursor && B(b).updateCursor(...e),
					onCompositionstart: n[6] ||= (e) => y.value = !0,
					onCompositionend: n[7] ||= (e) => y.value = !1
				}, null, 40, mg), [[vo, B(b).input.value]]),
				q("input", {
					ref_key: "files",
					ref: m,
					type: "file",
					multiple: "",
					hidden: "",
					"aria-label": "Upload files",
					onChange: Ce
				}, null, 544),
				q("input", {
					ref_key: "camera",
					ref: h,
					type: "file",
					accept: "image/*",
					capture: "environment",
					hidden: "",
					"aria-label": "Take a photo",
					onChange: Ce
				}, null, 544),
				q("p", hg, L(u.value ? "Preparing attachments…" : e.reason || ""), 1),
				q("div", gg, [
					jn(q("button", {
						class: "attach-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#424242] p-0 text-white disabled:opacity-55",
						type: "button",
						"aria-label": "Attachment options",
						"aria-expanded": s.value,
						disabled: e.sending || u.value,
						onClick: n[8] ||= (e) => {
							N(), s.value = !s.value;
						}
					}, [...n[17] ||= [q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						class: "size-5",
						"aria-hidden": "true"
					}, [q("path", { d: "M12 5v14M5 12h14" })], -1)]], 8, _g), [[Ia, !oe.value]]),
					jn(q("span", vg, null, 512), [[Ia, !oe.value]]),
					e.sessionId ? (G(), Hi(jh, {
						key: e.sessionId,
						visible: !oe.value && !O.value && !s.value,
						active: !v.value && !O.value && !s.value,
						usage: e.contextUsage ?? null,
						breakdown: e.contextBreakdown ?? null,
						loading: e.contextLoading ?? !1,
						model: e.model || e.defaultModel,
						onOpen: n[9] ||= (e) => i("context-open", e)
					}, null, 8, [
						"visible",
						"active",
						"usage",
						"breakdown",
						"loading",
						"model"
					])) : Y("v-if", !0),
					jn(q("button", {
						ref_key: "pill",
						ref: A,
						type: "button",
						class: "model-pill flex h-[30px] min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-0 text-[16px] text-white disabled:opacity-55",
						"aria-label": "Choose model",
						"aria-haspopup": "dialog",
						"aria-expanded": O.value,
						"aria-controls": B(j),
						disabled: re.value,
						onClick: fe
					}, [q("span", bg, L(e.modelsLoading ? "Loading models…" : e.model || e.defaultModel || "Default"), 1), n[18] ||= q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-4 shrink-0",
						"aria-hidden": "true"
					}, [q("path", { d: "m6 9 6 6 6-6" })], -1)], 8, yg), [[Ia, !oe.value]]),
					q("button", {
						class: "send-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#2563eb] p-0 text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
						type: e.sending && !a.value.trim() ? "button" : "submit",
						disabled: _e.value,
						"aria-label": e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						title: e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						onMousedown: w,
						onClick: n[10] ||= (t) => e.sending ? a.value.trim() ? I() : e.stoppable && i("stop") : I()
					}, [e.sending && !a.value.trim() ? (G(), K("svg", Sg, [...n[19] ||= [q("rect", {
						x: "6",
						y: "6",
						width: "12",
						height: "12",
						rx: "2"
					}, null, -1)]])) : (G(), K("svg", Cg, [...n[20] ||= [q("path", { d: "M12 19V5m-6 6 6-6 6 6" }, null, -1)]]))], 40, xg)
				])
			]),
			O.value ? (G(), K("div", {
				key: 7,
				id: B(j),
				ref_key: "panel",
				ref: ne,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": k.value === null ? "Choose provider" : ce.value,
				class: "model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl"
			}, [
				q("div", Tg, [
					k.value === null ? Y("v-if", !0) : (G(), K("button", {
						key: 0,
						type: "button",
						"aria-label": "Back to providers",
						class: "picker-back rounded-full p-2 hover:bg-[#424242]",
						onClick: me
					}, [...n[22] ||= [q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-5",
						"aria-hidden": "true"
					}, [q("path", { d: "m15 18-6-6 6-6" })], -1)]])),
					q("h2", Eg, L(k.value === null ? "Choose provider" : ce.value), 1),
					q("button", {
						type: "button",
						"aria-label": "Close model picker",
						class: "rounded-full px-3 py-2 hover:bg-[#424242]",
						onClick: N
					}, " × ")
				]),
				le.value ? (G(), K("label", Dg, [n[24] ||= q("span", null, "Reasoning effort", -1), q("select", {
					"aria-label": "Reasoning effort",
					class: "min-w-0 rounded-lg bg-[#303030] px-2 py-1 text-base text-white",
					value: e.reasoningEffort || "",
					disabled: re.value,
					onChange: n[11] ||= (e) => i("update:reasoningEffort", e.target.value)
				}, [n[23] ||= q("option", { value: "" }, "Model default", -1), (G(!0), K(W, null, U(B(Uh), (e) => (G(), K("option", {
					key: e,
					value: e
				}, L(e === "xhigh" ? "XHigh" : e[0].toUpperCase() + e.slice(1)), 9, kg))), 128))], 40, Og)])) : Y("v-if", !0),
				q("div", Ag, [k.value === null ? (G(), K(W, { key: 0 }, [(G(!0), K(W, null, U(e.providers, (e) => (G(), K("button", {
					key: e.slug,
					type: "button",
					class: "provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": e.slug,
					onClick: (t) => pe(e.slug)
				}, [q("span", Mg, L(e.name), 1), e.is_current ? (G(), K("span", Ng, "Current")) : Y("v-if", !0)], 8, jg))), 128)), q("button", {
					type: "button",
					class: "provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": "",
					onClick: n[12] ||= (e) => pe("")
				}, " Model routes ")], 64)) : (G(), K(W, { key: 1 }, [(G(!0), K(W, null, U(ue.value, (t) => (G(), K("button", {
					key: t,
					type: "button",
					class: "model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-model": t,
					onClick: (e) => he(t)
				}, [q("span", Fg, L(t), 1), (e.provider || "") === k.value && t === (e.model || e.defaultModel) ? (G(), K("span", Ig, "✓")) : Y("v-if", !0)], 8, Pg))), 128)), ue.value.length ? Y("v-if", !0) : (G(), K("p", Lg, "No models available"))], 64))])
			], 8, wg)) : Y("v-if", !0),
			s.value ? (G(), K("div", Rg, [
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[13] ||= (e) => m.value?.click()
				}, " Upload files "),
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[14] ||= (e) => h.value?.click()
				}, " Take a photo "),
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "goal",
					onClick: n[15] ||= (e) => {
						o.value = "goal", s.value = !1;
					}
				}, " Goal mode "),
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "plan",
					onClick: n[16] ||= (e) => {
						o.value = "plan", s.value = !1;
					}
				}, " Plan mode ")
			])) : Y("v-if", !0)
		], 544));
	}
}), Bg = { class: "chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden" }, Vg = {
	key: 0,
	class: "pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-dashed border-[#a3a3a3] bg-[#212121]/95 text-lg",
	role: "status"
}, Hg = { class: "chat-content flex min-h-0 flex-1 flex-col overflow-hidden" }, Ug = {
	key: 0,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white",
	role: "status"
}, Wg = {
	key: 1,
	class: "notice px-5 py-3 text-sm text-[#b4b4b4]",
	role: "status"
}, Gg = {
	key: 2,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, Kg = { class: "composer-dock shrink-0" }, qg = {
	key: 0,
	class: "mx-auto max-h-48 w-[calc(100%-24px)] max-w-[760px] overflow-y-auto px-2 pb-2 text-sm",
	"aria-label": "Command results",
	role: "region"
}, Jg = ["open"], Yg = {
	class: "whitespace-pre-wrap break-words font-sans",
	role: "status"
}, Xg = /* @__PURE__ */ H({
	__name: "ChatInterface",
	props: {
		showChat: { type: Boolean },
		hideComposer: { type: Boolean },
		draftScope: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(), r = /* @__PURE__ */ z();
		Nn(dh, r);
		let i = !1;
		function a() {
			i = !0, r.value ? r.value.focusLatestMessage() : n.value?.blurInput();
		}
		V(r, (e) => {
			e && i && (i = !1, document.activeElement === document.body && e.focusLatestMessage());
		}, { flush: "post" });
		async function o(e, t) {
			let r = n.value;
			a();
			try {
				await _.send(e, t) === !1 && (await vn(), r === n.value && n.value?.restoreDraft(e, t));
			} finally {
				i = !1;
			}
		}
		async function s(e) {
			a();
			try {
				await _.steer(e);
			} finally {
				i = !1;
			}
		}
		let c = /* @__PURE__ */ z(0);
		function l(e) {
			return t.showChat && !!e.dataTransfer?.types.includes("Files") && e.composedPath().some((e) => e instanceof HTMLElement && e.classList.contains("app-shell"));
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
		sr(() => {
			document.addEventListener("dragenter", u), document.addEventListener("dragover", d), document.addEventListener("dragleave", f), document.addEventListener("drop", p);
		}), ur(() => {
			document.removeEventListener("dragenter", u), document.removeEventListener("dragover", d), document.removeEventListener("dragleave", f), document.removeEventListener("drop", p);
		});
		let { view: m, scope: h, composer: g, actions: _ } = uh(), { profile: v, session: y, offline: b, canStream: x, reasoningEffort: S, models: C, providers: w, modelsLoading: T, model: E, provider: ee, defaultModel: D, suggestedPrompt: O } = h, { busy: k, active: te, reconnect: A, error: ne, unavailable: j, connection: M } = m;
		return (t, r) => (G(), K("div", Bg, [
			c.value && e.showChat ? (G(), K("div", Vg, " Drop files to attach ")) : Y("v-if", !0),
			q("div", Hg, [
				B(b) ? (G(), K("div", Ug, " You are offline. Messages cannot be loaded or sent. ")) : Y("v-if", !0),
				e.showChat && B(A) ? (G(), K("div", Wg, [J(L(B(M) === "reconnecting" ? "Reconnecting…" : "Session is read-only until reconnected.") + " ", 1), B(x) && B(M) === "stale" && !B(b) ? (G(), K("button", {
					key: 0,
					class: "ml-3 underline",
					onClick: r[0] ||= (...e) => B(_).retry && B(_).retry(...e)
				}, " Reconnect ")) : Y("v-if", !0)])) : Y("v-if", !0),
				e.showChat && B(ne) ? (G(), K("div", Gg, [
					J(L(B(ne)) + " ", 1),
					B(y) ? (G(), K("button", {
						key: 0,
						class: "underline",
						onClick: r[1] ||= (...e) => B(_).retry && B(_).retry(...e)
					}, L(B(A) ? "Retry connection" : "Refresh history"), 1)) : Y("v-if", !0),
					B(j) ? (G(), K("button", {
						key: 1,
						class: "ml-3 underline",
						onClick: r[2] ||= (...e) => B(_).resolve && B(_).resolve(...e)
					}, " Resolve uncertain submission ")) : Y("v-if", !0)
				])) : Y("v-if", !0),
				vr(t.$slots, "default")
			]),
			q("div", Kg, [B(m).commandResults.value.length ? (G(), K("div", qg, [(G(!0), K(W, null, U(B(m).commandResults.value, (e, t) => (G(), K("details", {
				key: t,
				open: t === B(m).commandResults.value.length - 1
			}, [q("summary", null, L(e.command) + " · temporary result", 1), q("pre", Yg, L(e.output), 1)], 8, Jg))), 128))])) : Y("v-if", !0), jn((G(), Hi(zg, {
				ref_key: "picker",
				ref: n,
				profile: B(v),
				"complete-slash": B(_).completeSlash,
				"slash-scope": JSON.stringify([
					e.draftScope,
					B(g).slashScope,
					B(x),
					B(M),
					B(b)
				]),
				"session-id": B(x) && B(y) || void 0,
				"context-usage": B(m).contextUsage.value,
				"context-breakdown": B(m).contextBreakdown.value,
				"context-loading": B(m).contextLoading.value,
				onContextOpen: B(_).setContextOpen,
				"project-name": B(g).projectName,
				key: JSON.stringify([B(v), e.draftScope]),
				disabled: B(g).disabled || B(m).commandRunning.value,
				models: B(C),
				providers: B(w),
				"models-loading": B(T),
				provider: B(ee),
				"onUpdate:provider": B(_).setProvider,
				"default-model": B(D),
				"reasoning-effort": B(S),
				"onUpdate:reasoningEffort": B(_).setReasoningEffort,
				model: B(E),
				"onUpdate:model": B(_).setModel,
				sending: B(k),
				stoppable: B(te) && !B(A),
				"suggested-prompt": B(O),
				reason: B(g).reason,
				onStop: B(_).stop,
				onSteer: s,
				onSend: o
			}, null, 8, [
				"profile",
				"complete-slash",
				"slash-scope",
				"session-id",
				"context-usage",
				"context-breakdown",
				"context-loading",
				"onContextOpen",
				"project-name",
				"disabled",
				"models",
				"providers",
				"models-loading",
				"provider",
				"onUpdate:provider",
				"default-model",
				"reasoning-effort",
				"onUpdate:reasoningEffort",
				"model",
				"onUpdate:model",
				"sending",
				"stoppable",
				"suggested-prompt",
				"reason",
				"onStop"
			])), [[Ia, !e.hideComposer]])])
		]));
	}
}), Zg = [
	"once",
	"session",
	"always",
	"deny"
];
function Qg(e) {
	if (!e) return;
	let { id: t, method: n, params: r } = e;
	return n === "approval" && (r.choices === void 0 || Array.isArray(r.choices) && r.choices.every((e) => Zg.includes(e))) ? {
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
function $g(e, t) {
	return `Attached ${e.type.startsWith("image/") ? "image" : "file"} ${e.name.replace(/[\r\n]/g, " ")}: ${t}\nMEDIA:"${t}"`;
}
function e_(e, t) {
	let { profile: n, session: r, messages: i, chatLoading: a, chatError: o, canStream: s, projectView: c, composerBlocked: l, selectedProject: u, creating: d, offline: f, models: p, providers: m, modelsLoading: h, model: g, provider: _, defaultModel: v, suggestedPrompt: y } = t, b = /* @__PURE__ */ z(/* @__PURE__ */ new Map()), x = /* @__PURE__ */ z(/* @__PURE__ */ new Map()), S = () => JSON.stringify([n.value || "default", r.value]), C = X(() => {
		let t = e.settings.value;
		return t?.profile === n.value && t.session === r.value && t.generation === e.generationRef.value ? t.info : void 0;
	}), w = X(() => {
		let e = C.value?.reasoning_effort;
		return b.value.get(S()) ?? (Uh.includes(e) ? e : "");
	}), T = X(() => x.value.get(S())?.model ?? (r.value ? C.value?.model || "" : g.value)), E = X(() => x.value.get(S())?.provider ?? (r.value && C.value?.provider || _.value)), ee = /* @__PURE__ */ z(!1), D = X(() => ee.value || !s.value || se.value || ie.value || ae.value || ce.value || f.value || !r.value);
	async function O(i) {
		if (D.value) return;
		let a = t.generation(), o = t.navigation(), s = n.value, c = r.value;
		ee.value = !0;
		try {
			let e = await Q.branch(s, c, i);
			a === t.generation() && o === t.navigation() && s === n.value && c === r.value && await t.openBranch(e.id);
		} catch {
			a === t.generation() && o === t.navigation() && (e.error.value = "Could not branch this response. Refresh history and try again.");
		} finally {
			ee.value = !1;
		}
	}
	let k = s, te = /* @__PURE__ */ z(!1), A = /* @__PURE__ */ z([]), ne = () => JSON.stringify([
		n.value,
		r.value,
		r.value ? void 0 : u.value?.id,
		!r.value && u.value ? kl(u.value) : void 0,
		t.generation()
	]);
	V([ne, t.navigation], () => {
		A.value = [];
	}, { flush: "sync" });
	async function j(t, i = {}) {
		if (f.value || !s.value) throw Error("Command discovery unavailable.");
		if (r.value) {
			if (!C.value) throw new Z("The selected session is not ready for commands.", "rejected");
			return e.command(t, i);
		}
		return fl.discover(n.value, t, i);
	}
	async function M(e) {
		let t = /\s/.test(e) && [
			"skin",
			"personality",
			"tools",
			"handoff"
		].includes(Kh(e).name), [n, i] = await Promise.all([j("commands.catalog"), t ? Promise.resolve({ items: [] }) : j("complete.slash", { text: e })]);
		if (!/\s/.test(e)) {
			let t = new Map((n.pairs || []).map(([e, t]) => [e?.toLowerCase(), t]));
			i.items = (i.items || []).filter((e) => {
				let r = `/${e.text.trim().replace(/^\//, "").toLowerCase()}`;
				return e.kind === "skill" || t.has(r) || !!n.commands?.[r] || !!n.canon?.[r];
			}).map((e) => {
				let r = `/${e.text.trim().replace(/^\//, "").toLowerCase()}`;
				return {
					...e,
					meta: e.kind === "skill" ? t.get(r) ?? e.meta : t.get(`/${Yh(n, r.slice(1))}`) ?? t.get(r) ?? ""
				};
			});
			let r = new Set((i.items || []).map((e) => e.text.trim().replace(/^\//, "").toLowerCase())), a = (n.pairs || []).filter(([t]) => t?.toLowerCase().startsWith(e.toLowerCase()) && !r.has(t.slice(1).toLowerCase()));
			i.items = [...i.items || [], ...a.map(([e, t]) => ({
				text: e,
				display: e,
				meta: t || "",
				kind: n.skills?.[e] ? "skill" : "command"
			}))];
		}
		return {
			catalog: n,
			...i,
			notice: t ? "Argument discovery for this command is unavailable on the pinned gateway because its dynamic provider is not profile-bound. Type arguments explicitly or use Hermes terminal." : !r.value && u.value && !u.value.isNoProject ? "Profile commands are shown. This Hermes version cannot discover project-local skills before a conversation exists; sending resolves the command in the Project workspace." : ""
		};
	}
	let re = X(() => k.value ? e.messages.value : i.value), ie = X(() => e.busy.value || e.uncertain.value), ae = X(() => k.value ? e.loading.value : a.value), oe = X(() => k.value ? e.error.value : o.value), se = X(() => !!e.approval.value), ce = X(() => k.value && !!r.value && e.connection.value !== "ready"), le = X(() => e.uncertain.value), ue = X(() => e.busy.value), de = X(() => !k.value || f.value || ce.value);
	async function N(i, a, o = i, c = !1) {
		if (_e.value.disabled || ee.value || ie.value || d.value || se.value || f.value || !s.value || h.value) return !1;
		let l = S(), u = t.navigation(), p = w.value, m = n.value, g = T.value, _ = E.value;
		if (!r.value) {
			let e = await t.createSession();
			if (!e) return u === t.navigation() && n.value === m ? !1 : void 0;
			if (n.value !== m || r.value !== e) return;
			x.value.set(S(), {
				model: g,
				provider: _
			}), l !== S() && x.value.delete(l), p && (b.value.set(S(), p), l !== S() && b.value.delete(l));
		}
		let y = t.generation(), C = n.value, D = [{
			type: "text",
			text: o
		}, ...a.flatMap((e) => [{
			type: "text",
			text: e.path ? $g(e, e.path) : "📎 " + e.name
		}, ...e.type.startsWith("image/") ? [{
			type: "image_url",
			image_url: { url: e.data }
		}] : []])];
		try {
			return await e.submit(o, async () => {
				let e = [{
					type: "text",
					text: i || "Please examine the attached files."
				}];
				for (let n of a) {
					let r = n.path ? { path: n.path } : await Q.upload(C, n);
					if (y !== t.generation()) throw Error("Session changed before submission");
					e.push({
						type: "text",
						text: $g(n, r.path)
					}), n.type.startsWith("image/") && e.push({
						type: "image_url",
						image_url: { url: n.data }
					});
				}
				return a.length ? e : i;
			}, c ? {} : {
				model: T.value || v.value,
				provider: E.value || void 0,
				...p ? { reasoning_effort: p } : {}
			}, D), !0;
		} catch (n) {
			if (y === t.generation() && !e.uncertain.value) return e.error.value = n instanceof Error ? n.message : "Message not submitted", !1;
		}
	}
	async function fe(i, a = []) {
		if (!k.value || te.value) return !1;
		if (!Gh(i)) return await N(i, a);
		if (_e.value.disabled || ie.value) return !1;
		te.value = !0;
		let o = ne(), s = t.navigation(), c = () => o === ne() && s === t.navigation(), l = (e, t) => {
			c() && (A.value = [...A.value.slice(-9), {
				command: e,
				output: t
			}]);
		}, u = !1;
		try {
			let d = i, f = await j("commands.catalog");
			if (!c()) return;
			for (let p = 0; p < 8; p++) {
				let p = Kh(d), m = Yh(f, p.name), h = p.arg;
				if (!p.name) throw Error("Enter a command name after /.");
				let g = Xh(f, m, h);
				if (g) throw Error(g);
				if (m === "steer") throw Error("Use Guide this run in the composer while a response is active.");
				let _ = m === "reasoning" ? Wh(h) : void 0;
				if (a.length && [
					"compress",
					"retry",
					"stop",
					"steer",
					"title"
				].includes(m)) throw Error("Remove attachments before running this session command.");
				if (a.length && ![
					"plan",
					"learn",
					"init",
					"moa",
					"goal"
				].includes(m) && !f.skills?.[`/${m}`]) throw Error("This command cannot be resolved safely with attachments. Remove them first, or send a normal message.");
				if (m === "help" || m === "commands") return l(i, (f.pairs || []).map(([e, t]) => `${e} — ${t}${Xh(f, Yh(f, e.slice(1))) ? " (client/terminal limitation; type command for details)" : ""}`).join("\n") || "No commands reported by Hermes."), !0;
				if (!r.value) {
					if ([
						"retry",
						"compress",
						"stop",
						"steer",
						"title"
					].includes(m)) throw Error(`/${m} needs an existing conversation.`);
					let e = n.value, i = S(), a = w.value, l = {
						model: T.value,
						provider: E.value
					}, u = await t.createSession();
					if (!u || n.value !== e || r.value !== u) return !1;
					if (o = ne(), s = t.navigation(), x.value.set(S(), l), a && b.value.set(S(), a), i !== S() && (x.value.delete(i), b.value.delete(i)), f = await j("commands.catalog"), !c()) return;
					continue;
				}
				u = !0;
				let v;
				if (_) {
					if (_.value) {
						let t = await e.command("config.set", {
							key: "reasoning",
							value: _.value,
							scope: _.scope
						});
						if (!c()) return;
						if (t.deferred || t.confirm_required) throw Error("Reasoning change was not applied immediately.");
					}
					let t = await e.command("config.get", { key: "reasoning" });
					if (!c()) return;
					if (_.effort) {
						let e = ["false", "disabled"].includes(_.value) ? "none" : _.value;
						if (t.value !== e) throw Error("Reasoning change was not confirmed.");
						b.value.set(S(), e);
					}
					v = { output: `Reasoning effort: ${t.value}${t.display ? `; display: ${t.display}` : ""}.` };
				} else if (m === "compress") {
					let t = await e.command("session.compress", h ? { focus_topic: h } : {});
					v = { output: [
						t.summary?.headline,
						t.summary?.token_line,
						t.summary?.note,
						t.message
					].filter(Boolean).join("\n") || (t.compressed === !1 ? "Context was not compressed." : "Context compression completed.") };
				} else if (m === "stop") await e.stop(), v = { output: "Stop requested." };
				else if (m === "title" && h) v = { output: `Session title: ${(await e.command("session.title", { title: h })).title || h}` };
				else {
					let t = Zh(f, m);
					v = await e.command(t, t === "command.dispatch" ? {
						name: m,
						arg: h
					} : { command: `${m}${h ? ` ${h}` : ""}` });
				}
				if (!c()) return;
				if (v.type === "alias") {
					if (!v.target?.trim()) throw Error("Hermes returned an empty alias.");
					d = `/${v.target.replace(/^\//, "")}${h ? ` ${h}` : ""}`;
					continue;
				}
				let y = Qh(v);
				if (y) {
					if (v.notice && l(i, v.notice), m === "retry" && (await e.refreshCommand(), !c())) return;
					let t = await N(y, a, v.display || i, m === "moa");
					return t === !1 && c() && l(i, "Command resolved, but its prompt was not submitted. Inspect command state before trying again."), t;
				}
				if (v.type === "prefill") v.message && await t.suggest(v.message);
				else if (!v.type || v.type === "exec" || v.type === "plugin") {
					if (a.length) throw Error("This command did not accept attachments; they remain in the unsent draft.");
					l(i, [v.warning, v.output || "Command completed without output."].filter(Boolean).join("\n"));
				} else throw Error("Hermes returned an unsupported command directive.");
				if (c()) try {
					await e.refreshCommand();
				} catch {
					l(i, "Command completed; refresh the conversation to read its updated state.");
				}
				return !0;
			}
			throw Error("Command alias cycle or too many redirects.");
		} catch (e) {
			if (c()) return l(i, e instanceof Z && e.outcome === "rejected" ? "Hermes refused this command or its arguments. This gateway may not support it. The command was not submitted as a prompt." : !u && e instanceof Error ? e.message : "Hermes could not complete this command. Its outcome may be unknown. Inspect session state before trying again; it was not resent."), !1;
		} finally {
			te.value = !1;
		}
	}
	async function pe() {
		let n = t.generation();
		if (k.value) {
			try {
				await e.stop();
			} catch {
				n === t.generation() && (e.error.value = "Could not stop the response.");
			}
			return;
		}
	}
	async function me(n) {
		let r = t.generation();
		if (k.value) {
			try {
				await e.steer(n);
			} catch {
				r === t.generation() && (e.error.value = "Response did not accept guidance.");
			}
			return;
		}
	}
	let he = X(() => {
		let t = e.approval.value;
		return t && typeof t.request_id == "string" && typeof t.kind == "string" ? Qg({
			id: t.request_id,
			method: t.kind,
			params: t
		}) : void 0;
	});
	function ge(e, n) {
		return n === t.generation() && he.value?.id === e;
	}
	async function P(t, n, r) {
		if (!de.value && ge(t, r)) try {
			await e.answer(t, { ...n });
		} catch {
			ge(t, r) && (e.error.value = he.value?.kind === "clarify" ? "Clarification could not be settled." : he.value?.kind === "secret" ? "Secret request could not be settled." : "Approval could not be settled.");
		}
	}
	let _e = X(() => ({
		slashScope: JSON.stringify([u.value?.id, u.value ? kl(u.value) : void 0]),
		projectName: !l.value && !u.value?.isNoProject ? u.value?.label : void 0,
		disabled: !!(l.value || ee.value || c.value && u.value?.archived || c.value && (!u.value || !u.value.isNoProject && !kl(u.value)) || f.value || d.value || h.value || ae.value || se.value || le.value || ce.value || !s.value),
		reason: l.value ? "Open a chat." : c.value && u.value?.archived ? "Restore this project to start a new chat." : c.value && u.value && !u.value.isNoProject && !kl(u.value) ? "This Project has no workspace." : f.value ? "Offline · sending is unavailable." : se.value ? "Approval is pending in Hermes." : s.value ? void 0 : "Streaming turns are unavailable for this profile."
	})), F = {
		completeSlash: M,
		loadEarlier: () => e.loadEarlier(),
		branch: O,
		send: fe,
		stop: pe,
		steer: me,
		answerFor: (e) => {
			let n = t.generation();
			return (t) => P(e, t, n);
		},
		suggest: t.suggest,
		setContextOpen: (t) => e.setContextOpen(t),
		retry: () => ce.value ? e.reconnect() : t.retryHistory(),
		resolve: () => e.resolveUncertainty(),
		setReasoningEffort: (e) => {
			b.value.set(S(), e);
		},
		setModel: (e) => {
			x.value.set(S(), {
				model: e,
				provider: E.value
			});
		},
		setProvider: (e) => {
			x.value.set(S(), {
				model: T.value,
				provider: e
			});
		}
	};
	return {
		view: {
			commandRunning: te,
			commandResults: A,
			hasEarlier: e.hasEarlier,
			loadingEarlier: e.loadingEarlier,
			earlierError: e.earlierError,
			contextUsage: X(() => C.value ? e.contextUsage.value : null),
			contextBreakdown: X(() => C.value ? e.contextBreakdown.value : null),
			contextLoading: e.contextLoading,
			messages: re,
			branchDisabled: D,
			responseTargets: e.responseTargets,
			busy: ie,
			loading: ae,
			error: oe,
			approvalPending: se,
			reconnect: ce,
			unavailable: le,
			active: ue,
			request: he,
			requestDisabled: de,
			connection: X(() => e.connection.value),
			status: X(() => k.value ? e.status.value : "")
		},
		composer: _e,
		actions: F,
		scope: {
			profile: n,
			session: r,
			offline: f,
			canStream: s,
			models: p,
			providers: m,
			modelsLoading: h,
			reasoningEffort: w,
			model: T,
			provider: E,
			defaultModel: v,
			suggestedPrompt: X(() => y.value)
		}
	};
}
//#endregion
//#region src/composables/useDrawerSwipe.ts
var t_ = "button:not([data-drawer-swipe]), a, input, textarea, select, label, summary, audio, video, [role=\"button\"], [role=\"link\"], [role=\"slider\"], [role=\"checkbox\"], [role=\"switch\"], [role=\"combobox\"], [role=\"textbox\"], [role=\"menuitem\"], [tabindex]:not([data-chat-message]):not([data-drawer-swipe]), [contenteditable]:not([contenteditable=\"false\"]), .composer, pre, code";
function n_(e, t, n, r) {
	let i = /* @__PURE__ */ z(null), a, o = 0, s = 0, c = 0, l = 0, u = () => window.matchMedia("(max-width: 700px)").matches;
	function d() {
		a = void 0, i.value = null;
	}
	V(e, d, { flush: "sync" });
	function f(r) {
		if (d(), !u() || r.touches.length !== 1) return;
		let i = r.touches[0], l = r.target;
		if (!(i.clientX < 30 || !(l instanceof Element) || l.closest(t_)) && (e.value || l.closest("[data-drawer-swipe]"))) {
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
		dragging: X(() => i.value !== null),
		sidebarStyle: X(() => i.value === null ? void 0 : {
			translate: `${i.value - t()}px 0`,
			transition: "none"
		}),
		scrimStyle: X(() => i.value === null ? void 0 : { opacity: i.value / t() })
	};
}
//#endregion
//#region src/features/settings/composables/useWakeLock.ts
var r_ = "chathermes.keep-screen-awake";
function i_() {
	try {
		return localStorage.getItem(r_) === "true";
	} catch {
		return !1;
	}
}
function a_() {
	let e = /* @__PURE__ */ z(i_()), t = /* @__PURE__ */ z(!1), n = !1, r = !0, i = null, a = null, o = 0, s = null;
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
			localStorage.setItem(r_, String(t));
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
	return sr(() => {
		n = !0, t.value = typeof navigator.wakeLock?.request == "function", document.addEventListener("visibilitychange", p), window.addEventListener("pagehide", m), window.addEventListener("pageshow", h), d();
	}), dr(() => {
		n = !1, document.removeEventListener("visibilitychange", p), window.removeEventListener("pagehide", m), window.removeEventListener("pageshow", h), u();
	}), {
		enabled: /* @__PURE__ */ It(e),
		available: /* @__PURE__ */ It(t),
		setEnabled: f
	};
}
//#endregion
//#region src/features/inbox/context.ts
var o_ = Symbol("inbox");
function s_(e) {
	Nn(o_, e);
}
function c_() {
	let e = Pn(o_);
	if (!e) throw Error("inbox context is missing");
	return e;
}
//#endregion
//#region src/features/artifacts/context.ts
var l_ = Symbol("artifacts");
function u_(e) {
	Nn(l_, e);
}
function d_() {
	let e = Pn(l_);
	if (!e) throw Error("artifacts context is missing");
	return e;
}
//#endregion
//#region src/features/settings/context.ts
var f_ = Symbol("settings");
function p_(e) {
	Nn(f_, e);
}
function m_() {
	let e = Pn(f_);
	if (!e) throw Error("settings context is missing");
	return e;
}
//#endregion
//#region src/features/projects/context.ts
var h_ = "chathermes.hide-automatic-projects";
function g_() {
	try {
		return localStorage.getItem(h_) !== "false";
	} catch {
		return !0;
	}
}
var __ = Symbol("projects");
function v_(e) {
	let t = kc(), n = /* @__PURE__ */ z(), r = /* @__PURE__ */ z(g_());
	function i() {
		r.value = !r.value;
		try {
			localStorage.setItem(h_, String(r.value));
		} catch {}
	}
	V(() => t.fullPath, () => {
		n.value = void 0;
	}), Nn(__, {
		...e,
		projectConfirmation: n,
		hideAutomaticProjects: /* @__PURE__ */ It(r),
		toggleAutomaticProjects: i
	});
}
function y_() {
	let e = Pn(__);
	if (!e) throw Error("projects context is missing");
	return e;
}
//#endregion
//#region src/features/scheduled/composables/useScheduledHistory.ts
var b_ = Symbol("scheduled");
function x_(e) {
	let t = {
		...e,
		current: /* @__PURE__ */ qt()
	};
	return Nn(b_, t), t;
}
function S_() {
	let e = Pn(b_);
	if (!e) throw Error("Scheduled context is missing");
	return e;
}
function C_(e) {
	return e.state === "completed" || e.state === "error" ? "completed" : e.state === "paused" || e.enabled === !1 ? "paused" : "active";
}
function w_(e) {
	return e > 0 ? (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString() : "Run date unavailable";
}
function T_(e) {
	if (!e) return "Never run";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? "Last run date unavailable" : "Last run: " + t.toLocaleString();
}
function E_(e) {
	let t = S_(), n = kc(), r = /* @__PURE__ */ z(!1), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(), o, s = Promise.resolve(), c = "", l = !1, u = () => JSON.stringify([
		t.profile.value,
		n.params.jobId,
		n.params.runId
	]);
	function d() {
		o?.abort();
		let l = o = new AbortController(), d = u();
		return r.value = !0, i.value = "", c = "", a.value = void 0, s = (async () => {
			try {
				await e(l.signal, t.profile.value, String(n.params.jobId || ""), String(n.params.runId || "")), l.signal.aborted || (c = d);
			} catch (e) {
				l.signal.aborted || (i.value = e instanceof hl && e.status === 503 ? "Scheduled history is unavailable in this Hermes version." : "Could not load scheduled history. The job or output may no longer be available.");
			} finally {
				o === l && (r.value = !1);
			}
		})(), s;
	}
	let f = {
		loading: r,
		error: i,
		sessionId: a,
		retry: d,
		async whenLoaded() {
			let e = u(), t;
			do
				t = s, await t;
			while (t !== s);
			return !l && !i.value && c === e;
		}
	};
	return t.current.value = f, V([
		() => t.profile.value,
		() => n.params.jobId,
		() => n.params.runId
	], d, { immediate: !0 }), Te(() => {
		l = !0, o?.abort(), t.current.value === f && (t.current.value = void 0);
	}), f;
}
async function D_(e, t, n) {
	let r = (await Q.scheduled(e, n)).jobs.find((e) => e.id === t);
	if (!r) throw Error("Job unavailable");
	return r;
}
function O_(e) {
	let t = e?.messages.slice().reverse().find((e) => e.role === "assistant" && Ol(e.content).trim()), n = t ? Ol(t.content) : e?.output;
	return n ? [{
		role: "assistant",
		content: n
	}] : [];
}
//#endregion
//#region src/composables/useApplication.ts
function k_() {
	let e = Pn(Bc, void 0), t, n = Oc(), r = kc(), i = X(() => r.meta.chat === !0), a = X(() => r.meta.composer === "project" || r.name === "home" && !!r.query.project), o = /* @__PURE__ */ z(0), s = X(() => !i.value && !a.value || Ic(r.query.profile) !== y.value || qe.value !== Ae.value), c = X(() => r.name === "settings"), l = X(() => r.meta.section === "scheduled"), u = !1, d = !1, f = Promise.resolve(), p = Promise.resolve(), m = "", h, g;
	async function _(e, t = !1, i = !1, a = !1) {
		let s = a ? {
			from: r.fullPath,
			to: n.resolve(e).fullPath,
			revision: o.value
		} : void 0;
		g = s, h?.abort(), m = i ? n.resolve(e).fullPath : "", i || (A.value = !1), Dt(!1), await n[t ? "replace" : "push"](e), await p, g === s && (g = void 0), m = "";
	}
	function v(e, t = {}) {
		return Rc(e, y.value, t);
	}
	let y = /* @__PURE__ */ z(""), b = X(() => r.name === "chat" ? String(r.params.sessionId) : ""), x = /* @__PURE__ */ z([]), S = /* @__PURE__ */ z([]), C = "", w = /* @__PURE__ */ z({}), T = /* @__PURE__ */ z(0), E = /* @__PURE__ */ z(!1), ee = /* @__PURE__ */ z(!1), D = /* @__PURE__ */ z(!1), O = /* @__PURE__ */ z(!navigator.onLine), k = /* @__PURE__ */ z(""), te = /* @__PURE__ */ z(""), A = /* @__PURE__ */ z(!1), ne = /* @__PURE__ */ z([]), j = /* @__PURE__ */ z([]), M = /* @__PURE__ */ z(""), re = /* @__PURE__ */ z(""), ie = /* @__PURE__ */ z(!1), ae = /* @__PURE__ */ z([]), oe = /* @__PURE__ */ z(""), se = /* @__PURE__ */ z(!1), ce = /* @__PURE__ */ z(!1), le = /* @__PURE__ */ z(""), ue = /* @__PURE__ */ z(null), de = /* @__PURE__ */ z(null), N = /* @__PURE__ */ z(null), fe = /* @__PURE__ */ z(!1), pe = /* @__PURE__ */ z(null), me = X(() => w.value.features?.native_chat === !0), he, ge, P = 0, _e = 0, F = /* @__PURE__ */ z({
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: ""
	}), I = /* @__PURE__ */ z(!1), ve = /* @__PURE__ */ z(!1), ye = /* @__PURE__ */ z(""), L = 0, be = /* @__PURE__ */ z(null), xe = /* @__PURE__ */ new Set(), Se = /* @__PURE__ */ z([]), Ce = /* @__PURE__ */ z(/* @__PURE__ */ new Set()), we = 0;
	async function Te(e, t) {
		if (O.value || Ce.value.has(e) || dt.value) return;
		let n = y.value, r = _e, i = Se.value.find((t) => t.session_id === e);
		rt(), we++, Ce.value.add(e), Se.value = [...Se.value.filter((t) => t.session_id !== e), {
			session_id: e,
			status: t,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}];
		try {
			let i = await Q.track(n, e, t);
			if (r !== _e) return;
			i.session_id !== e && (x.value = x.value.map((t) => t.id === e ? {
				...t,
				id: i.session_id
			} : t)), Se.value = [...Se.value.filter((t) => t.session_id !== e && t.session_id !== i.session_id), i];
		} catch (t) {
			if (r !== _e) return;
			Se.value = Se.value.filter((t) => t.session_id !== e), i && Se.value.push(i), k.value = t instanceof Error ? t.message : "Could not update tracking";
		} finally {
			r === _e && (rt(), Ce.value.delete(e));
		}
	}
	function R(e) {
		e === y.value && it();
	}
	let Ee = Gm(y);
	function De(e, t, n) {
		e === y.value && (x.value = x.value.map((e) => e.id === t ? {
			...e,
			title: n
		} : e));
	}
	let { projectBusy: Oe, manageError: ke, projectId: Ae, projects: je, selectedProject: Me, projectsLoading: Ne, projectLoading: Pe, projectsError: Fe, projectError: Ie, visibleSessions: Le, subscribeProjectEvents: Re, refreshProjects: ze, loadProjects: Be, loadProject: Ve, chooseProject: He, showProjects: Ue, manageProject: We, resetProjects: Ge, selectProjectScope: Ke } = jl({
		profile: y,
		sessions: x,
		offline: O,
		navigate: _,
		loadSessions: it,
		refreshInbox: Ut,
		profileGeneration: () => _e,
		refreshActivity: Ee.refresh
	}), qe = X(() => b.value ? je.value.find((e) => e.sessionIds?.includes(b.value) || Al(e).some((e) => e.id === b.value))?.id || "" : r.name === "home" ? Ic(r.query.project) : typeof r.params.projectId == "string" ? r.params.projectId : ""), Je = Wm(() => {
		ze(), it(), Ut();
	}, R, De, Gt, Ee.event);
	lh({
		...e_(Je, {
			profile: y,
			session: b,
			messages: S,
			chatLoading: D,
			chatError: te,
			canStream: me,
			composerBlocked: s,
			projectView: a,
			selectedProject: Me,
			creating: ie,
			offline: O,
			models: j,
			providers: ae,
			modelsLoading: se,
			model: M,
			provider: oe,
			defaultModel: re,
			suggestedPrompt: le,
			generation: () => P,
			navigation: () => n.currentRoute.value,
			createSession: ct,
			suggest: lt,
			retryHistory: at,
			openBranch: async (e) => {
				await vt(e), ze(), it();
			}
		}),
		sessions: X(() => x.value)
	});
	let Ye = a_(), Xe = Zc(O), Ze = x_({
		profile: y,
		offline: O,
		creating: ie,
		recentSession: tt
	}), Qe = me;
	function $e() {
		Je.close(), P++, ge?.abort(), D.value = !1;
	}
	function et() {
		h?.abort(), $e(), he?.abort(), ee.value = !1;
	}
	function tt(e) {
		return vt(e);
	}
	async function nt(e = "") {
		h?.abort(), $e(), le.value = "", o.value++, await _(Rc("home", y.value, e ? { project: e } : {}));
	}
	function rt() {
		he?.abort(), he = void 0, ee.value = !1;
	}
	async function it(e = !1) {
		we++, he?.abort();
		let t = new AbortController();
		he = t;
		let n = y.value, r = new Map(x.value.map((e) => [e.id, e.title]));
		ee.value = !0, k.value = "";
		try {
			let [i, a] = await Promise.all([Q.sessions(n, e ? T.value : 0, t.signal), Q.tracking(n, t.signal).then((e) => ({
				value: e,
				error: ""
			}), () => ({
				value: void 0,
				error: "Could not load session tracking"
			}))]), o = a.value;
			if (t !== he || t.signal.aborted || n !== y.value) return;
			let s = Se.value.filter((e) => Ce.value.has(e.session_id));
			o && (Se.value = [...o.tracking.filter((e) => !Ce.value.has(e.session_id)), ...s]), a.error && (k.value = a.error);
			let c = i.sessions.filter((e) => !xe.has(e.id)).map((e) => {
				let t = x.value.find((t) => t.id === e.id);
				return t && r.has(e.id) && t.title !== r.get(e.id) ? {
					...e,
					title: t.title
				} : e;
			});
			x.value = e ? [...x.value.map((e) => c.find((t) => t.id === e.id) || e), ...c.filter((e) => !x.value.some((t) => t.id === e.id))] : c, x.value = [...new Map(x.value.map((e) => {
				let t = o?.aliases?.[e.id] || e.id;
				return [t, t === e.id ? e : {
					...e,
					id: t
				}];
			})).values()];
			let l = new Map(x.value.map((e) => [e.id, e]));
			for (let e of o?.sessions || []) !l.has(e.id) && !xe.has(e.id) && l.set(e.id, e);
			let u = [...x.value];
			for (let e of l.values()) {
				if (u.some((t) => t.id === e.id)) continue;
				let t = u.findIndex((t) => (t.last_active ?? t.started_at ?? 0) < (e.last_active ?? e.started_at ?? 0));
				u.splice(t < 0 ? u.length : t, 0, e);
			}
			x.value = u, T.value = typeof i.offset == "number" && typeof i.limit == "number" ? i.offset + i.limit : e ? T.value + i.sessions.length : i.sessions.length, E.value = i.has_more ?? (typeof i.total == "number" ? T.value < i.total : i.sessions.length === 30);
		} catch (e) {
			t === he && !t.signal.aborted && (k.value = e instanceof Error ? e.message : "Could not load sessions");
		} finally {
			t === he && (ee.value = !1, he = void 0);
		}
	}
	async function at() {
		if (!b.value) return !1;
		if (Qe.value) return await Je.hydrate(), !0;
		ge?.abort();
		let e = new AbortController();
		ge = e;
		let t = P;
		D.value = !0, te.value = "";
		try {
			let n = await Q.messages(y.value, b.value, e.signal);
			if (t === P && e === ge) return S.value = n, !0;
		} catch (n) {
			t === P && !e.signal.aborted && (te.value = n instanceof Error ? n.message : "Could not load messages");
		} finally {
			e === ge && (D.value = !1);
		}
		return !1;
	}
	async function ot(e) {
		if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
			k.value = "Invalid profile name";
			return;
		}
		le.value = "", ie.value = !1, dt.value = !1, ft++, et(), Ge(), y.value = e, C = "", x.value = [], Se.value = [], Ce.value = /* @__PURE__ */ new Set(), xe.clear(), S.value = [], w.value = {}, j.value = [], ae.value = [], oe.value = "", M.value = "", re.value = "", se.value = !0, k.value = "", te.value = "", T.value = 0, E.value = !1;
		let t = ++_e;
		Re(), Be(), it(), Promise.allSettled([Q.models(e), Q.modelOptions(e)]).then(([e, n]) => {
			t === _e && (e.status === "fulfilled" && (j.value = e.value.data || [], re.value = e.value.default_model || ""), n.status === "fulfilled" && Array.isArray(n.value.providers) && (ae.value = n.value.providers.filter((e) => e.models.length || e.is_current), oe.value = ae.value.find((e) => e.is_current)?.slug || n.value.provider || "", re.value = n.value.model || re.value), se.value = !1);
		});
		try {
			let n = await Q.capabilities(e);
			t === _e && y.value === e && (w.value = n);
		} catch {
			t === _e && y.value === e && (w.value = {});
		}
	}
	async function st(e) {
		(Q.isNative(y.value) || Ae.value || x.value.find((t) => t.id === e)?.cwd || x.value.find((t) => t.id === e)?.source === "desktop") && Q.workspace(y.value, e), le.value = "", C = e, S.value = [], te.value = "", A.value = !1;
		let t = P, n = y.value;
		if (!Ae.value && !Q.isWorkspace(n, e)) {
			try {
				await Q.session(n, e);
			} catch {}
			if (t !== P || n !== y.value) return;
		}
		Qe.value ? await Je.attach(n, e) : await at();
	}
	async function ct() {
		if (O.value || ie.value || Ae.value && (!Me.value || Me.value.archived)) return;
		let e = y.value, t = Ae.value, r = b.value, i = o.value, a = n.currentRoute.value, s = P, c = _e, l = h = new AbortController();
		ie.value = !0;
		try {
			t && !oe.value && (oe.value = ae.value.find((e) => e.is_current)?.slug || "", M.value = "");
			let u = t ? await Q.projectCreate(e, t, l.signal) : await Q.create(e, l.signal);
			if (l.signal.aborted || s !== P || y.value !== e || b.value !== r || a !== n.currentRoute.value) return;
			await _({
				name: "chat",
				params: { sessionId: u.id },
				query: e ? { profile: e } : {}
			}, !1, !1, !0), ze();
			let d = ++we;
			return Q.tracking(e).then((e) => {
				if (c !== _e || d !== we) return;
				Se.value = e.tracking;
				let t = new Map(x.value.map((e) => [e.id, e]));
				for (let n of e.sessions) xe.has(n.id) || t.set(n.id, n);
				x.value = [...t.values()];
			}).catch(() => {
				c === _e && (k.value = "Could not load session tracking");
			}), y.value !== e || b.value !== u.id || o.value !== i ? void 0 : u.id;
		} catch (r) {
			if (!l.signal.aborted && s === P && a === n.currentRoute.value && y.value === e && Ae.value === t) {
				let e = r instanceof Error ? r.message : "Could not create session";
				Je.error.value = e;
			}
		} finally {
			c === _e && (ie.value = !1);
		}
	}
	async function lt(e) {
		le.value = e;
	}
	async function ut(e, t) {
		let n = y.value, r = P;
		try {
			if (await Q.rename(n, e, t), r !== P || n !== y.value) return;
			let i = x.value.find((t) => t.id === e);
			i && (i.title = t), ze();
		} catch (e) {
			r === P && n === y.value && (k.value = e instanceof Error ? e.message : "Could not rename session");
		}
	}
	let dt = /* @__PURE__ */ z(!1), ft = 0;
	async function pt(e, t, n = "") {
		if (O.value || dt.value) return;
		let r = y.value, i = P, a = ++ft, o = _e;
		dt.value = !0, rt();
		try {
			if (e === "archive" ? await Q.archive(r, t) : e === "delete" ? await Q.deleteSession(r, t) : await Q.moveSession(r, t, n), o !== _e || r !== y.value) return;
			rt(), e !== "project" && (xe.add(t), x.value = x.value.filter((e) => e.id !== t)), i === P && b.value === t && e !== "project" && await _({
				name: "home",
				query: r ? { profile: r } : {}
			}), await it(), ze();
		} catch (e) {
			i === P && r === y.value && (k.value = e instanceof Error ? e.message : "Could not update session");
		} finally {
			a === ft && (dt.value = !1);
		}
	}
	async function mt() {
		await Je.availability(document.visibilityState === "visible", navigator.onLine), document.visibilityState === "visible" && (ze(), Ut());
	}
	function ht() {
		location.href = "/";
	}
	function gt() {
		O.value = !navigator.onLine, Je.availability(document.visibilityState === "visible", !O.value), O.value || (ze(), it(), mt());
	}
	function _t(e) {
		if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
			k.value = "Invalid profile name";
			return;
		}
		return _(c.value ? Rc("settings", e, { return_to: n.resolve(Rc("home", e)).fullPath }) : Rc("home", e), !1, !0);
	}
	function vt(e) {
		return _({
			name: "chat",
			params: { sessionId: e },
			query: y.value ? { profile: y.value } : {}
		});
	}
	async function yt(e) {
		let t = Ic(r.query.profile);
		if ((!d || t !== y.value) && (d = !0, f = ot(t), await f, e !== n.currentRoute.value) || (await f, e !== n.currentRoute.value)) return;
		let i = b.value;
		qe.value !== Ae.value && Ke(qe.value), i !== C && (i ? await st(i) : ($e(), C = "", S.value = [], le.value = "")), e === n.currentRoute.value && t === y.value && i && await Gt(t, i);
	}
	V(qe, (e) => {
		u && Ic(r.query.profile) === y.value && e !== Ae.value && Ke(e);
	}, { flush: "sync" }), V(() => r.fullPath, (e, t) => {
		if (!r.matched.length) return;
		let i = g;
		g = void 0, (!i || i.from !== t || i.to !== e || i.revision !== o.value) && o.value++, h?.abort();
		let a = n.currentRoute.value;
		(b.value !== C || Ic(r.query.profile) !== y.value) && ($e(), C = "", S.value = [], le.value = ""), wt.cancel(), r.fullPath !== m && (A.value = !1), Dt(!1), ke.value = "", u && (p = yt(a));
	}, { flush: "sync" });
	function bt() {
		A.value = !1, ue.value?.focus();
	}
	async function xt() {
		A.value = !0, await vn(), de.value?.focus();
	}
	let St = /* @__PURE__ */ z(null), Ct = /* @__PURE__ */ z(null), wt = n_(A, () => St.value?.getBoundingClientRect().width || Math.min(300, window.innerWidth * .85), () => Ct.value?.$el.querySelector("[data-drawer-swipe]") || null, (e) => {
		e !== A.value && (e ? xt() : bt());
	});
	async function Tt() {
		await _(Lc(Ic(r.query.return_to))), await vn(), window.matchMedia?.("(min-width: 701px)").matches ?? !0 ? be.value?.focus() : ue.value?.focus();
	}
	function Et() {
		if (!c.value) return _(v("settings", { return_to: r.fullPath }));
	}
	function Dt(e = !0) {
		fe.value && (fe.value = !1, e && N.value?.focus());
	}
	function Ot(e) {
		fe.value && pe.value && !e.composedPath().includes(pe.value) && Dt(!1);
	}
	function kt(e) {
		e.key !== "Escape" || e.defaultPrevented || e.target instanceof Element && e.target.closest("dialog[open]") || (A.value ? bt() : c.value ? (e.preventDefault(), Tt()) : Dt());
	}
	async function At() {
		let e = y.value, t = ++L;
		ve.value = !0;
		let n = await nh(e);
		t === L && e === y.value && (F.value = n, ve.value = !1);
	}
	V(y, () => {
		ye.value = "", F.value = {
			...F.value,
			subscribed: !1
		}, At();
	}, { flush: "sync" });
	async function jt() {
		if (I.value || ve.value) return;
		let e = y.value;
		I.value = !0, ye.value = "";
		try {
			F.value.subscribed ? await ih(e) : await rh(e), await At();
		} catch (t) {
			e === y.value && (ye.value = t instanceof Error ? t.message : "Could not update notifications."), await At();
		} finally {
			I.value = !1;
		}
	}
	async function Mt() {
		if (I.value || ve.value) return;
		let e = y.value;
		I.value = !0, ye.value = "";
		try {
			await ah(e), e === y.value && (ye.value = "Test notification scheduled.");
		} catch {
			e === y.value && (ye.value = "Could not send a test notification.");
		} finally {
			I.value = !1;
		}
	}
	let Nt, Pt = X(() => ({
		profile: y.value,
		session: b.value,
		chat: i.value,
		scheduled: l.value && r.params.jobId && r.params.runId ? {
			job: String(r.params.jobId),
			run: String(r.params.runId)
		} : void 0,
		connected: Qe.value && Je.connection.value === "ready" && !O.value
	}));
	V(Pt, () => Nt?.publish(), { flush: "post" });
	async function Ft(e) {
		if (e.data?.type !== "chathermes.navigate" || typeof e.data.url != "string") return;
		let t = e.data.url, i = zc(t), a = e.ports?.[0], o = !1;
		try {
			if (!i) return;
			await _(i);
			let e = n.currentRoute.value, t = n.resolve(i).fullPath, s = () => u && e === n.currentRoute.value && r.fullPath === t;
			if (!a || !s()) return;
			r.name === "chat" ? o = Qe.value ? Je.connection.value === "ready" && await Je.hydrate() === !0 : !D.value && !te.value : l.value ? (await vn(), o = await Ze.current.value?.whenLoaded() === !0) : o = !0, await vn(), o &&= s();
		} catch {
			o = !1;
		} finally {
			a && (o && a.postMessage({
				type: "chathermes.navigated",
				url: t
			}), a.close());
		}
	}
	let It = /* @__PURE__ */ z(0), Lt = /* @__PURE__ */ z(0), Rt = /* @__PURE__ */ z(/* @__PURE__ */ new Map()), zt = X(() => Rt.value.get(y.value || "default") || /* @__PURE__ */ new Set()), Bt, Vt, Ht = "";
	async function Ut(e = !0, t = !1) {
		if (document.visibilityState === "hidden" || t && Vt) return;
		Vt?.abort();
		let n = Vt = new AbortController();
		try {
			let t = y.value, r = await Q.inbox(t, {
				limit: 100,
				unread: !0
			}, n.signal), i = /* @__PURE__ */ new Map(), a = r;
			do {
				if (n.signal.aborted) return;
				for (let e of a.items) {
					if (e.read) continue;
					let t = i.get(e.profile) || /* @__PURE__ */ new Set();
					t.add(e.session), i.set(e.profile, t);
				}
				if (!a.nextCursor) break;
				a = await Q.inbox(t, {
					limit: 100,
					unread: !0,
					cursor: a.nextCursor
				}, n.signal);
			} while (!n.signal.aborted);
			if (n.signal.aborted) return;
			Rt.value = i, It.value = r.unread, e && Gt(y.value, b.value);
			let o = JSON.stringify([
				r.revision,
				r.unread,
				r.items[0]?.id
			]);
			o !== Ht && (Ht = o, Lt.value++);
		} catch {} finally {
			Vt === n && (Vt = void 0);
		}
	}
	let Wt = /* @__PURE__ */ new Map();
	async function Gt(e, t) {
		let n = () => u && !!t && e === y.value && t === b.value && r.name === "chat" && !te.value && (!Qe.value || Je.connection.value === "ready" || !!Je.approval.value || Je.requests.value.length > 0);
		if (!n()) return;
		Nt?.publish();
		let i = JSON.stringify([e, t]), a = (Wt.get(i) || Promise.resolve()).then(async () => {
			let r, i = !1;
			try {
				do {
					if (!n()) return;
					let a = await Q.inbox(e, {
						scope: "profile",
						limit: 100,
						cursor: r
					});
					if (!n()) return;
					let o = a.items.filter((n) => n.profile === (e || "default") && n.session === t);
					await Promise.all(o.map((t) => Q.deleteInboxItem(e, t.id))), i ||= o.length > 0, r = a.nextCursor || void 0;
				} while (r);
			} catch {} finally {
				i && e === y.value && Ut(!1);
			}
		});
		Wt.set(i, a), await a, Wt.get(i) === a && Wt.delete(i);
	}
	async function Kt(e) {
		let t = n.currentRoute.value, r = await Q.session(e.profile, e.session);
		if (t !== n.currentRoute.value) throw Error("Navigation changed");
		if (r.source === "kanban") {
			let i = r.kanban_task;
			if (!i) throw Error("Task unavailable");
			if (await Gc.task(i.board, i.task), !Xe.visible.value && (await Xe.check(), !Xe.available.value)) throw Error("Kanban unavailable");
			if (t !== n.currentRoute.value) throw Error("Navigation changed");
			Xe.setEnabled(!0), await _({
				name: "kanban",
				query: {
					profile: e.profile,
					board: i.board,
					task: i.task
				}
			}), Xe.visible.value && (await Q.deleteInboxItem(e.profile, e.id), await Ut(!1));
			return;
		}
		if (await _({
			name: "chat",
			params: { sessionId: e.session },
			query: { profile: e.profile }
		}), y.value !== e.profile || b.value !== e.session || te.value || Qe.value && Je.connection.value !== "ready") throw Error("Chat unavailable");
		await Gt(e.profile, e.session);
	}
	return sr(async () => {
		Ut(), Bt = setInterval(() => void Ut(!0, !0), 15e3), "serviceWorker" in navigator && (Nt = sh(navigator.serviceWorker, () => Pt.value, () => location.href)), Q.profiles().then((e) => {
			ne.value = e.profiles || [];
		}).catch(() => {
			k.value = "Could not load profiles";
		}), At(), !e && "serviceWorker" in navigator && navigator.serviceWorker.addEventListener("message", Ft), ce.value = !!ue.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", mt), addEventListener("online", gt), addEventListener("offline", gt), addEventListener("keydown", kt), document.addEventListener("click", Ot), await n.isReady(), u = !0, p = yt(n.currentRoute.value), e && u && (t = e.connect(Ft)), await p;
	}), dr(() => {
		clearInterval(Bt), Vt?.abort(), u = !1, t?.(), n.options.history.destroy(), Nt?.stop(), Nt = void 0, _e++, document.removeEventListener("visibilitychange", mt), "serviceWorker" in navigator && navigator.serviceWorker.removeEventListener("message", Ft), et(), removeEventListener("online", gt), removeEventListener("offline", gt), removeEventListener("keydown", kt), document.removeEventListener("click", Ot);
	}), s_({
		profile: y,
		inboxRevision: Lt,
		openInboxItem: Kt,
		refreshInbox: Ut
	}), u_({
		profile: y,
		projects: je,
		recentSession: tt
	}), p_({
		kanban: Xe,
		profile: y,
		profiles: ne,
		pushState: F,
		pushBusy: I,
		pushLoading: ve,
		pushMessage: ye,
		wakeLock: Ye,
		chooseProfile: _t,
		togglePush: jt,
		testPush: Mt,
		closeSettings: Tt
	}), v_({
		profile: y,
		projectId: Ae,
		selectedProject: Me,
		projects: je,
		projectsLoading: Ne,
		projectLoading: Pe,
		projectsError: Fe,
		projectError: Ie,
		manageError: ke,
		projectBusy: Oe,
		offline: O,
		visibleSessions: Le,
		chooseProject: He,
		showProjects: Ue,
		loadProject: Ve,
		loadProjects: Be,
		recentSession: tt,
		chooseSession: vt,
		manageProject: We,
		createSession: async () => {
			await nt(Ae.value);
		},
		creating: ie
	}), {
		profile: y,
		session: b,
		sessions: x,
		projects: je,
		selectedProject: Me,
		projectId: Ae,
		offline: O,
		creating: ie,
		profiles: ne,
		loading: ee,
		error: k,
		hasMore: E,
		tracking: Se,
		trackingPending: Ce,
		sessionBusy: dt,
		drawer: A,
		embedded: ce,
		menuButton: ue,
		closeButton: de,
		screenMenuButton: N,
		screenMenuWrap: pe,
		screenMenu: fe,
		sidebar: St,
		chatPlane: Ct,
		drawerSwipe: wt,
		kanban: Xe,
		settingsButton: be,
		inboxUnread: It,
		unreadSessions: zt,
		workingSessions: Ee.workingSessions,
		settingsPage: c,
		projectView: a,
		recentSession: tt,
		chooseProfile: _t,
		createSession: ct,
		trackSession: Te,
		newChat: nt,
		draftRevision: o,
		loadSessions: it,
		manageSession: pt,
		rename: ut,
		exitPlugin: ht,
		showSettings: Et,
		openDrawer: xt,
		closeDrawer: bt,
		closeScreenMenu: Dt,
		screenLink: v
	};
}
//#endregion
//#region src/features/sessions/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var A_ = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, j_ = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, M_ = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, N_ = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
}, P_ = ["aria-label"], F_ = { class: "session-head mt-4 mb-1 px-2.5 text-xs font-semibold text-[#a3a3a3]" }, I_ = [
	"aria-label",
	"disabled",
	"onClick"
], L_ = ["aria-current", "onClick"], R_ = { class: "flex min-w-0 items-center gap-2" }, z_ = {
	key: 0,
	class: "sr-only"
}, B_ = {
	key: 1,
	class: "sr-only"
}, V_ = {
	key: 2,
	class: "session-unread ml-auto size-2 shrink-0 rounded-full bg-[#2563eb]",
	"aria-hidden": "true"
}, H_ = ["title"], U_ = [
	"aria-label",
	"disabled",
	"onClick"
], W_ = ["disabled"], G_ = ["aria-label"], K_ = {
	key: 0,
	class: "grid gap-1"
}, q_ = ["disabled"], J_ = ["value"], Y_ = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, X_ = ["disabled"], Z_ = {
	key: 2,
	class: "grid gap-3 p-1"
}, Q_ = ["disabled"], $_ = /*@__PURE__*/ H({
	__name: "SessionSidebar",
	props: {
		sessions: {},
		tracking: {},
		trackingPending: {},
		unreadSessions: {},
		workingSessions: {},
		selected: {},
		loading: { type: Boolean },
		error: {},
		hasMore: { type: Boolean },
		busy: { type: Boolean },
		heading: {},
		projects: {}
	},
	emits: [
		"track",
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
		let n = e, r = t, i = X(() => new Map((n.tracking || []).map((e) => [e.session_id, e]))), a = X(() => {
			let e = [...new Map(n.sessions.map((e) => [e.id, e])).values()], t = e.filter((e) => i.value.get(e.id)?.status === "open").sort((e, t) => {
				let n = i.value.get(e.id).updated_at;
				return i.value.get(t.id).updated_at.localeCompare(n) || t.id.localeCompare(e.id);
			});
			return [...t.length ? [{
				label: "Active",
				sessions: t
			}] : [], {
				label: n.heading || "Recents",
				sessions: e.filter((e) => i.value.get(e.id)?.status !== "open")
			}];
		});
		function o() {
			m.value && r("track", m.value.id, i.value.get(m.value.id)?.status === "open" ? "settled" : "open"), b();
		}
		let s = X(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.projects || []) {
				if (t.isNoProject) continue;
				let n = [...t.sessionIds || [], ...Al(t).map((e) => e.id)];
				for (let r of n) e.set(r, t.label);
			}
			return e;
		});
		function c(e) {
			let t = s.value.get(e.id);
			return [e.source || "Hermes", t].filter(Boolean).join(" · ");
		}
		let l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z("");
		function d(e) {
			l.value = e.id, u.value = e.title || "";
		}
		function f() {
			u.value.trim() && r("rename", l.value, u.value.trim()), l.value = "";
		}
		let p = /* @__PURE__ */ z(), m = /* @__PURE__ */ z(), h = /* @__PURE__ */ z("menu"), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z({
			left: "0px",
			top: "0px"
		}), v = X(() => (n.projects || []).filter((e) => !e.archived && !e.isNoProject && (e.path || e.repos.some((e) => e.path))));
		async function y(e, t) {
			m.value = e, h.value = "menu";
			let n = t.currentTarget.getBoundingClientRect();
			_.value = {
				left: `${Math.max(12, Math.min(n.right - 208, window.innerWidth - 220))}px`,
				top: `${Math.max(12, Math.min(n.bottom, window.innerHeight - 280))}px`
			}, await vn(), p.value?.showModal();
		}
		function b() {
			p.value?.close();
		}
		function x() {
			m.value && d(m.value), b();
		}
		function S() {
			m.value && r("archive", m.value.id), b();
		}
		function C() {
			m.value && g.value && r("project", m.value.id, g.value), b();
		}
		function w() {
			m.value && r("delete", m.value.id), b();
		}
		return (t, n) => (G(), K(W, null, [
			e.error ? (G(), K("p", A_, [J(L(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[0] ||= (e) => r("retry")
			}, "Retry")])) : Y("v-if", !0),
			e.loading && !e.sessions.length ? (G(), K("p", j_, " Loading sessions… ")) : e.sessions.length ? (G(), K("nav", N_, [(G(!0), K(W, null, U(a.value, (t) => (G(), K("section", {
				key: t.label,
				"aria-label": t.label
			}, [q("h2", F_, L(t.label), 1), (G(!0), K(W, null, U(t.sessions, (t) => (G(), K("div", {
				key: t.id,
				class: fe(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [l.value === t.id ? (G(), K(W, { key: 0 }, [jn(q("input", {
				"onUpdate:modelValue": n[1] ||= (e) => u.value = e,
				"aria-label": "Session title",
				maxlength: "160",
				class: "min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-base text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white",
				onKeydown: [Ao(f, ["enter"]), n[2] ||= Ao((e) => l.value = "", ["esc"])]
			}, null, 544), [[vo, u.value]]), q("button", {
				"aria-label": "Save title",
				class: "rounded-md px-2 py-2 text-sm text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				onClick: f
			}, " Save ")], 64)) : (G(), K(W, { key: 1 }, [
				i.value.get(t.id)?.status === "open" ? (G(), K("button", {
					key: 0,
					class: "settle-session flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#a3a3a3] hover:bg-[#424242] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-label": `Mark ${t.title || "Untitled session"} settled`,
					title: "Mark settled",
					disabled: e.busy || e.trackingPending?.has(t.id),
					onClick: (e) => r("track", t.id, "settled")
				}, [...n[8] ||= [q("svg", {
					class: "size-5",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [q("circle", {
					cx: "12",
					cy: "12",
					r: "9"
				}), q("path", { d: "m8 12 3 3 5-6" })], -1)]], 8, I_)) : Y("v-if", !0),
				q("button", {
					class: "session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-current": e.selected === t.id ? "page" : void 0,
					onClick: (e) => r("select", t.id)
				}, [q("span", R_, [
					q("span", { class: fe(["session-title truncate", {
						"font-semibold": e.unreadSessions?.has(t.id),
						"session-working": e.workingSessions?.has(t.id)
					}]) }, L(t.title || "Untitled session"), 3),
					e.unreadSessions?.has(t.id) ? (G(), K("span", z_, "Unread")) : Y("v-if", !0),
					e.workingSessions?.has(t.id) ? (G(), K("span", B_, "Working")) : Y("v-if", !0),
					e.unreadSessions?.has(t.id) ? (G(), K("span", V_)) : Y("v-if", !0)
				]), q("span", {
					class: "truncate text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]",
					title: c(t)
				}, L(c(t)), 9, H_)], 8, L_),
				q("button", {
					class: "icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-label": `Options for ${t.title || "Untitled session"}`,
					"aria-haspopup": "dialog",
					disabled: e.busy,
					onClick: (e) => y(t, e)
				}, " ⋮ ", 8, U_)
			], 64))], 2))), 128))], 8, P_))), 128))])) : (G(), K("p", M_, " No conversations yet. ")),
			e.hasMore ? (G(), K("button", {
				key: 4,
				class: "load-more self-start rounded-md px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55",
				disabled: e.loading,
				onClick: n[3] ||= (e) => r("more")
			}, L(e.loading ? "Loading…" : "Load more"), 9, W_)) : Y("v-if", !0),
			q("dialog", {
				ref_key: "popup",
				ref: p,
				class: "session-popup fixed m-0 w-52 rounded-xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl backdrop:bg-transparent",
				style: ce(_.value),
				"aria-label": h.value === "menu" ? "Session options" : h.value === "project" ? "Add to project" : "Delete conversation",
				onClick: n[7] ||= (e) => e.target === e.currentTarget && b()
			}, [h.value === "menu" ? (G(), K("div", K_, [
				q("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					disabled: e.busy || m.value && e.trackingPending?.has(m.value.id),
					onClick: o
				}, L(m.value && i.value.get(m.value.id)?.status === "open" ? "Mark settled" : "Make active"), 9, q_),
				q("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: x
				}, " Rename "),
				q("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: n[4] ||= (e) => {
						h.value = "project", g.value = "";
					}
				}, " Add to project "),
				q("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: S
				}, " Archive "),
				q("button", {
					class: "rounded-lg px-3 py-2 text-left text-[#fecaca] hover:bg-[#303030]",
					onClick: n[5] ||= (e) => h.value = "delete"
				}, " Delete ")
			])) : h.value === "project" ? (G(), K("form", {
				key: 1,
				class: "grid gap-3 p-1",
				onSubmit: Oo(C, ["prevent"])
			}, [
				n[10] ||= q("label", { for: "session-project" }, "Add to project", -1),
				jn(q("select", {
					id: "session-project",
					"onUpdate:modelValue": n[6] ||= (e) => g.value = e,
					class: "min-w-0 rounded-md bg-[#303030] p-2 text-base"
				}, [n[9] ||= q("option", {
					value: "",
					disabled: ""
				}, "Choose project", -1), (G(!0), K(W, null, U(v.value, (e) => (G(), K("option", {
					key: e.id,
					value: e.id
				}, L(e.label), 9, J_))), 128))], 512), [[xo, g.value]]),
				v.value.length ? Y("v-if", !0) : (G(), K("p", Y_, "No projects available.")),
				q("button", {
					class: "rounded-lg bg-[#303030] px-3 py-2 disabled:opacity-55",
					disabled: !g.value || e.busy
				}, " Add ", 8, X_),
				q("button", {
					type: "button",
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					onClick: b
				}, " Cancel ")
			], 32)) : (G(), K("div", Z_, [
				n[11] ||= q("p", null, "Delete this conversation? This cannot be undone.", -1),
				q("button", {
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					autofocus: "",
					onClick: b
				}, " Cancel "),
				q("button", {
					class: "rounded-lg bg-[#402b2b] px-3 py-2 text-[#fecaca]",
					disabled: e.busy,
					onClick: w
				}, " Delete conversation ", 8, Q_)
			]))], 12, G_)
		], 64));
	}
}), ev = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, tv = /*#__PURE__*/ ev($_, [["__scopeId", "data-v-519ff6d0"]]);
//#endregion
//#region src/features/notifications/services/workerUpdates.ts
function nv(e, t, n, r, i = t.controller) {
	let a = null, o = null, s = !1, c = !1, l, u = "", d = /* @__PURE__ */ new Set(), f = (e = !1) => {
		s || n({
			available: !!a,
			busy: !!o,
			error: u
		}, e);
	}, p = () => {
		clearTimeout(l), o = null;
	}, m = () => {
		if (s || c) return;
		if (o?.state === "activated" && t.controller === o) {
			c = !0, p(), r();
			return;
		}
		o?.state === "redundant" && (p(), u = "This update was replaced. Please try again when the next update is ready.");
		let n = e.waiting, l = i && t.controller !== i ? t.controller : null, d = n || l || (i && e.active !== i ? e.active : null) || (a?.state === "activating" || a?.state === "activated" ? a : null), m = !!d && d !== a;
		a = d, a && h(a), f(m);
	};
	function h(e) {
		d.has(e) || (d.add(e), e.addEventListener("statechange", m));
	}
	let g = () => {
		e.installing && h(e.installing), m();
	};
	return e.addEventListener("updatefound", g), t.addEventListener("controllerchange", m), g(), {
		update() {
			if (s || o || c) return;
			m();
			let e = a;
			if (e) {
				o = e, u = "", l = setTimeout(() => {
					p(), u = "The update did not finish. You can keep working and try Update again.", f();
				}, 2e4), f();
				try {
					e.state === "installed" && e.postMessage({ type: "chathermes.update.activate" }), m();
				} catch {
					p(), u = "Could not activate the update. Please try again.", f();
				}
			}
		},
		dispose() {
			s = !0, p(), e.removeEventListener("updatefound", g), t.removeEventListener("controllerchange", m);
			for (let e of d) e.removeEventListener("statechange", m);
		}
	};
}
//#endregion
//#region src/features/notifications/components/WorkerUpdatePrompt.vue?vue&type=script&setup=true&lang.ts
var rv = {
	key: 0,
	class: "fixed top-20 right-4 z-40 max-h-[calc(100dvh-6rem)] max-w-[calc(100%-2rem)] overflow-y-auto"
}, iv = {
	key: 0,
	role: "alert",
	class: "mt-2"
}, av = { class: "mt-4 flex justify-end gap-2" }, ov = ["disabled"], sv = ["disabled"], cv = /* @__PURE__ */ H({
	__name: "WorkerUpdatePrompt",
	setup(e) {
		let t = /* @__PURE__ */ z({
			available: !1,
			busy: !1,
			error: ""
		}), n = /* @__PURE__ */ z(!1), r = !0, i;
		return sr(async () => {
			let e = navigator.serviceWorker?.controller;
			try {
				let a = await Zm();
				if (!r) return;
				i = nv(a, navigator.serviceWorker, (e, r) => {
					t.value = e, r && (n.value = !0), e.available || (n.value = !1);
				}, () => location.reload(), e);
			} catch {}
		}), ur(() => {
			r = !1, i?.dispose();
		}), (e, r) => t.value.available ? (G(), K("div", rv, [n.value ? (G(), K("section", {
			key: 0,
			role: "dialog",
			"aria-modal": "false",
			"aria-labelledby": "worker-update-title",
			"aria-describedby": "worker-update-warning",
			class: "w-80 max-w-full rounded-2xl border border-[#424242] bg-[#212121] p-4 text-base text-white shadow-xl",
			onKeydown: r[2] ||= Ao(Oo((e) => n.value = !1, ["stop"]), ["esc"])
		}, [
			r[4] ||= q("h2", {
				id: "worker-update-title",
				class: "font-medium"
			}, "ChatHermes update available", -1),
			r[5] ||= q("p", {
				id: "worker-update-warning",
				class: "mt-2 text-[#b4b4b4]"
			}, " Update reloads this tab and may interrupt drafts, uploads, or work in progress. Other tabs will not reload automatically. ", -1),
			t.value.error ? (G(), K("p", iv, L(t.value.error), 1)) : Y("v-if", !0),
			q("div", av, [q("button", {
				class: "rounded-xl px-3 py-2 hover:bg-[#424242] disabled:opacity-55",
				disabled: t.value.busy,
				onClick: r[0] ||= (e) => n.value = !1
			}, " Not now ", 8, ov), q("button", {
				class: "rounded-xl bg-white px-3 py-2 text-black disabled:opacity-55",
				disabled: t.value.busy,
				onClick: r[1] ||= (e) => B(i)?.update()
			}, L(t.value.busy ? "Updating…" : "Update"), 9, sv)])
		], 32)) : (G(), K("button", {
			key: 1,
			class: "rounded-xl border border-[#424242] bg-[#212121] px-4 py-2 text-base text-white shadow-xl",
			onClick: r[3] ||= (e) => n.value = !0
		}, " Update available "))])) : Y("v-if", !0);
	}
}), lv = { class: "app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white" }, uv = { class: "brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold" }, dv = ["aria-label"], fv = { class: "sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, pv = { class: "drawer-account flex min-w-0 items-center gap-2" }, mv = ["value"], hv = ["value"], gv = ["value"], _v = ["disabled"], vv = ["aria-current"], yv = { class: "main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden" }, bv = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, xv = ["aria-expanded"], Sv = { class: "min-w-0 flex-1" }, Cv = { class: "header-title truncate text-base font-medium" }, wv = {
	key: 0,
	class: "header-project-subtitle truncate text-xs text-[#a3a3a3]"
}, Tv = { class: "topbar-profile sr-only" }, Ev = ["aria-expanded"], Dv = {
	class: "truncate px-3 py-2 text-xs text-[#a3a3a3]",
	role: "presentation"
}, Ov = ["disabled"], kv = /* @__PURE__ */ H({
	__name: "App",
	setup(e) {
		let t = kc(), n = jc(), { profile: r, session: i, sessions: a, projects: o, selectedProject: s, offline: c, creating: l, profiles: u, loading: d, error: f, hasMore: p, tracking: m, trackingPending: h, sessionBusy: g, drawer: _, embedded: v, menuButton: y, closeButton: b, screenMenuButton: x, screenMenuWrap: S, screenMenu: C, sidebar: w, chatPlane: T, drawerSwipe: E, kanban: ee, settingsButton: D, inboxUnread: O, unreadSessions: k, workingSessions: te, settingsPage: A, projectView: ne, recentSession: j, chooseProfile: M, draftRevision: re, trackSession: ie, newChat: ae, loadSessions: oe, manageSession: se, rename: le, exitPlugin: ue, showSettings: de, openDrawer: N, closeDrawer: pe, closeScreenMenu: me, screenLink: he } = k_(), ge = X(() => {
			let e = t.params.projectId, n = t.meta.section === "projects" && Ic(t.query.profile) === r.value ? s.value?.id === e ? s.value : o.value.find((t) => t.id === e) : void 0, i = t.name === "projects" && t.query.archived === "1" || n?.archived;
			return he("projects", i ? { archived: "1" } : {});
		});
		return (e, P) => (G(), K("div", lv, [
			q("aside", {
				ref: (e) => w.value = e,
				class: fe(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-0.5 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white", B(_) ? "translate-x-0" : "-translate-x-full"]),
				style: ce(B(E).sidebarStyle.value),
				onTouchstart: P[16] ||= (...e) => B(E).start && B(E).start(...e),
				onTouchmove: P[17] ||= (...e) => B(E).move && B(E).move(...e),
				onTouchend: P[18] ||= (...e) => B(E).end && B(E).end(...e),
				onTouchcancel: P[19] ||= (...e) => B(E).cancel && B(E).cancel(...e),
				onClickCapture: P[20] ||= (...e) => B(E).click && B(E).click(...e),
				"aria-label": "Navigation"
			}, [
				q("div", uv, [
					P[33] ||= q("span", { class: "min-w-0 truncate" }, "ChatHermes", -1),
					B(v) ? (G(), K("button", {
						key: 0,
						class: "drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Return to Hermes Desktop",
						title: "Return to Hermes Desktop",
						onClick: P[0] ||= (...e) => B(ue) && B(ue)(...e)
					}, [...P[32] ||= [q("svg", {
						class: "size-5",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M10 5 3 12l7 7M3 12h12a6 6 0 0 0 6-6V3" })], -1)]])) : Y("v-if", !0),
					q("button", {
						ref: (e) => b.value = e,
						class: "mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Close navigation",
						onClick: P[1] ||= (...e) => B(pe) && B(pe)(...e)
					}, " × ", 512)
				]),
				qi(B(yc), {
					class: "inbox-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).name === "inbox" ? "page" : void 0,
					to: B(he)("inbox"),
					onClick: P[2] ||= (e) => _.value = !1
				}, {
					default: An(() => [
						P[34] ||= q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "M4 4h16v16H4zM4 13h4l2 3h4l2-3h4" })], -1),
						P[35] ||= J(" Inbox ", -1),
						B(O) ? (G(), K("span", {
							key: 0,
							class: "ml-auto rounded-full bg-[#424242] px-2 text-sm leading-[1.5]",
							"aria-label": `${B(O)} unread notifications`
						}, L(B(O)), 9, dv)) : Y("v-if", !0)
					]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(B(yc), {
					class: "projects-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).meta.section === "projects" ? "page" : void 0,
					to: ge.value,
					onClick: P[3] ||= (e) => _.value = !1
				}, {
					default: An(() => [...P[36] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1), J("Projects ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(B(yc), {
					class: "scheduled-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).meta.section === "scheduled" ? "page" : void 0,
					to: B(he)("scheduled"),
					onClick: P[4] ||= (e) => _.value = !1
				}, {
					default: An(() => [...P[37] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("rect", {
						x: "3",
						y: "5",
						width: "18",
						height: "16",
						rx: "2"
					}), q("path", { d: "M7 3v4M17 3v4M3 11h18M8 15h3M8 18h6" })], -1), J("Scheduled ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(B(yc), {
					class: "artifacts-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).name === "artifacts" ? "page" : void 0,
					to: B(he)("artifacts"),
					onClick: P[5] ||= (e) => _.value = !1
				}, {
					default: An(() => [...P[38] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" })], -1), J("Artifacts ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				B(ee).visible.value ? (G(), Hi(B(yc), {
					key: 0,
					class: "kanban-nav flex min-h-[36px] w-full items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).name === "kanban" ? "page" : void 0,
					to: B(he)("kanban"),
					onClick: P[6] ||= (e) => _.value = !1
				}, {
					default: An(() => [...P[39] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("rect", {
						x: "3",
						y: "3",
						width: "18",
						height: "18",
						rx: "2"
					}), q("path", { d: "M9 3v18M15 3v18M5 7h2M11 7h2M17 7h2M5 11h2M11 11h2" })], -1), q("span", null, "Kanban", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"])) : Y("v-if", !0),
				(G(), Hi(tv, {
					heading: "Recents",
					sessions: B(a),
					tracking: B(m),
					"tracking-pending": B(h),
					"unread-sessions": B(k),
					"working-sessions": B(te),
					onTrack: B(ie),
					selected: B(i),
					loading: B(d),
					error: B(f),
					"has-more": B(p),
					busy: B(c) || B(l) || B(g),
					projects: B(o),
					key: B(r),
					onArchive: P[7] ||= (e) => B(se)("archive", e),
					onDelete: P[8] ||= (e) => B(se)("delete", e),
					onProject: P[9] ||= (e, t) => B(se)("project", e, t),
					onSelect: B(j),
					onCreate: P[10] ||= (e) => B(ae)(),
					onMore: P[11] ||= (e) => B(oe)(!0),
					onRetry: P[12] ||= (e) => B(oe)(),
					onRename: B(le)
				}, null, 8, [
					"sessions",
					"tracking",
					"tracking-pending",
					"unread-sessions",
					"working-sessions",
					"onTrack",
					"selected",
					"loading",
					"error",
					"has-more",
					"busy",
					"projects",
					"onSelect",
					"onRename"
				])),
				q("div", fv, [
					P[43] ||= q("label", { for: "profile-field" }, "Profile", -1),
					q("div", pv, [
						q("select", {
							id: "profile-field",
							class: "profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white",
							value: B(r),
							onChange: P[13] ||= (e) => B(M)(e.target.value)
						}, [
							P[40] ||= q("option", { value: "" }, "Default profile", -1),
							B(r) && !B(u).some((e) => e.name === B(r)) ? (G(), K("option", {
								key: 0,
								value: B(r)
							}, L(B(r)), 9, hv)) : Y("v-if", !0),
							(G(!0), K(W, null, U(B(u), (e) => (G(), K("option", {
								key: e.name,
								value: e.name
							}, L(e.name), 9, gv))), 128))
						], 40, mv),
						q("button", {
							class: "drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55",
							"aria-label": "New chat",
							title: "New chat",
							disabled: B(c) || B(l),
							onClick: P[14] ||= (e) => B(ae)()
						}, [...P[41] ||= [q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z" })], -1)]], 8, _v),
						q("button", {
							ref: (e) => D.value = e,
							class: "drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]",
							"aria-label": "Settings",
							"aria-current": B(A) ? "page" : void 0,
							onClick: P[15] ||= (e) => B(de)()
						}, [...P[42] ||= [q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "m9 3-.6 2.5-2 .9L4 5.7l-2 3.5 1.8 1.8v2L2 14.8l2 3.5 2.4-.7 2 .9L9 21h6l.6-2.5 2-.9 2.4.7 2-3.5-1.8-1.8v-2L22 9.2l-2-3.5-2.4.7-2-.9L15 3Z" }), q("circle", {
							cx: "12",
							cy: "12",
							r: "3"
						})], -1)]], 8, vv)
					]),
					q("span", null, [q("span", { class: fe(["status-dot mr-2 inline-block size-2 rounded-full", B(c) ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), J(L(B(c) ? "Offline · read only" : "Connected through dashboard"), 1)])
				])
			], 38),
			B(_) || B(E).dragging.value ? (G(), K("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				style: ce(B(E).scrimStyle.value),
				onTouchstart: P[21] ||= (...e) => B(E).start && B(E).start(...e),
				onTouchmove: P[22] ||= (...e) => B(E).move && B(E).move(...e),
				onTouchend: P[23] ||= (...e) => B(E).end && B(E).end(...e),
				onTouchcancel: P[24] ||= (...e) => B(E).cancel && B(E).cancel(...e),
				onClickCapture: P[25] ||= (...e) => B(E).click && B(E).click(...e),
				onClick: P[26] ||= (...e) => B(pe) && B(pe)(...e)
			}, null, 36)) : Y("v-if", !0),
			q("main", yv, [
				q("header", bv, [
					q("button", {
						ref: (e) => y.value = e,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": B(_),
						onClick: P[27] ||= (...e) => B(N) && B(N)(...e)
					}, [...P[44] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, xv),
					q("div", Sv, [q("h1", Cv, L(B(n).title), 1), B(n).subtitle ? (G(), K("p", wv, L(B(n).subtitle), 1)) : Y("v-if", !0)]),
					q("span", Tv, L(B(r) || "Current profile"), 1),
					B(A) ? Y("v-if", !0) : (G(), K("div", {
						key: 0,
						ref: (e) => S.value = e,
						class: "screen-menu-wrap relative",
						onKeydown: P[31] ||= Ao(Oo((e) => B(me)(), ["stop", "prevent"]), ["esc"])
					}, [q("button", {
						ref: (e) => x.value = e,
						class: "screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]",
						"aria-label": "Screen options",
						"aria-haspopup": "menu",
						"aria-expanded": B(C),
						"aria-controls": "screen-menu",
						onClick: P[28] ||= (e) => C.value = !B(C)
					}, " ··· ", 8, Ev), jn(q("div", {
						id: "screen-menu",
						class: "screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl",
						role: "menu",
						"aria-label": "Screen options",
						onClick: P[30] ||= (e) => B(me)()
					}, [
						q("span", Dv, L(B(r) || "Current profile"), 1),
						q("button", {
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: B(c) || B(l) || B(ne) && (!B(s) || B(s).archived || !B(s).isNoProject && !B(kl)(B(s))),
							onClick: P[29] ||= (e) => {
								B(ae)(B(ne) ? B(s)?.id : ""), B(me)();
							}
						}, " New chat ", 8, Ov),
						qi(B(Ec), { name: "actions" })
					], 512), [[Ia, B(C)]])], 544))
				]),
				qi(B(Ec), { name: "dialogs" }),
				qi(cv),
				qi(Xg, {
					ref: (e) => T.value = e,
					onTouchstart: B(E).start,
					onTouchmove: B(E).move,
					onTouchend: B(E).end,
					onTouchcancel: B(E).cancel,
					onClickCapture: B(E).click,
					"show-chat": B(t).meta.chat === !0,
					"draft-scope": String(B(re)),
					"hide-composer": B(t).meta.chat !== !0
				}, {
					default: An(() => [(G(), Hi(B(Ec), { key: B(r) }))]),
					_: 1
				}, 8, [
					"onTouchstart",
					"onTouchmove",
					"onTouchend",
					"onTouchcancel",
					"onClickCapture",
					"show-chat",
					"draft-scope",
					"hide-composer"
				]),
				P[45] ||= q("footer", {
					class: "app-footer shrink-0 bg-black",
					"aria-hidden": "true"
				}, null, -1)
			])
		]));
	}
});
//#endregion
//#region src/features/kanban/useBoard.ts
function Av(e, t, n, r) {
	let i = /* @__PURE__ */ z(), a = /* @__PURE__ */ z(), o = /* @__PURE__ */ z(), s = /* @__PURE__ */ z(""), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(document.visibilityState === "visible"), d = () => {
		u.value = document.visibilityState === "visible";
	};
	document.addEventListener("visibilitychange", d), dr(() => document.removeEventListener("visibilitychange", d));
	let f = async () => {};
	return V([
		e,
		t,
		n,
		u
	], ([e, t, , u], d, p) => {
		if ((!t || e !== d?.[0]) && (i.value = void 0, a.value = void 0, o.value = void 0, s.value = ""), c.value = "", l.value = !1, !t || !e || !u) {
			f = async () => {};
			return;
		}
		let m = new AbortController(), h = !1, g = !1, _ = !1, v, y, b = !1, x, S = 1e3;
		async function C() {
			if (!h) {
				if (g) {
					_ = !0;
					return;
				}
				g = !0, l.value = !i.value;
				try {
					let t = await Gc.board(e, n.value, m.signal);
					if (h) return;
					i.value = t, v ??= typeof t.latest_event_id == "number" ? t.latest_event_id : void 0, !y && !x && !b && w(), c.value = "";
				} catch (e) {
					h || (c.value = e instanceof Hc ? e.message : "Could not load Kanban. Retry when the dashboard is connected.", e instanceof Hc && [
						401,
						403,
						404,
						503
					].includes(e.status) && e.status !== 404 && r());
				} finally {
					g = !1, h || (l.value = !1, _ && (_ = !1, C()));
				}
			}
		}
		async function w() {
			if (!(h || b)) {
				b = !0;
				try {
					let t = await Kc(e, v);
					if (h) return;
					let n = y = new WebSocket(t);
					n.onopen = () => {
						S = 1e3, C(), D();
					}, n.onmessage = (e) => {
						if (!(h || y !== n)) try {
							let t = JSON.parse(e.data);
							typeof t.cursor == "number" && Number.isSafeInteger(t.cursor) && (v = Math.max(v ?? 0, t.cursor)), Array.isArray(t.events) && t.events.length && (C(), D());
						} catch {}
					}, n.onerror = () => n.close(), n.onclose = () => {
						y === n && (y = void 0), T();
					};
				} catch {
					T();
				} finally {
					b = !1;
				}
			}
		}
		function T() {
			h || x || (x = setTimeout(() => {
				x = void 0, w();
			}, S), S = Math.min(S * 2, 3e4));
		}
		let E = 0, ee;
		async function D() {
			let t = s.value, n = ++E;
			if (ee?.abort(), !t || h) return;
			let r = ee = new AbortController();
			try {
				let [i, c] = await Promise.all([Gc.task(e, t, r.signal), Gc.log(e, t, r.signal)]);
				!h && n === E && s.value === t && (a.value = i, o.value = c);
			} catch (e) {
				!h && n === E && !r.signal.aborted && (c.value = e instanceof Hc ? e.message : "Could not load task details.", e instanceof Hc && e.status === 404 && (a.value = void 0, o.value = void 0, s.value = ""));
			}
		}
		let O = V(s, () => {
			a.value = void 0, o.value = void 0, D();
		});
		f = async () => {
			await Promise.all([C(), D()]);
		};
		let k = setInterval(() => void f(), 8e3);
		C(), D(), p(() => {
			h = !0, m.abort(), ee?.abort(), O(), clearInterval(k), clearTimeout(x), y?.close();
		});
	}, {
		immediate: !0,
		flush: "sync"
	}), {
		snapshot: i,
		detail: a,
		log: o,
		taskId: s,
		error: c,
		loading: l,
		refresh: () => f()
	};
}
//#endregion
//#region src/features/kanban/TaskForm.vue?vue&type=script&setup=true&lang.ts
var jv = { key: 0 }, Mv = ["value"], Nv = {
	key: 1,
	class: "kanban-inline"
}, Pv = ["value"], Fv = { class: "kanban-toolbar" }, Iv = ["disabled"], Lv = ["disabled"], Rv = /* @__PURE__ */ H({
	__name: "TaskForm",
	props: {
		task: {},
		assignees: {},
		busy: { type: Boolean }
	},
	emits: ["save", "cancel"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z(n.task?.title || ""), a = /* @__PURE__ */ z(n.task?.body || ""), o = /* @__PURE__ */ z(n.task?.priority || 0), s = /* @__PURE__ */ z(n.task?.assignee || ""), c = /* @__PURE__ */ z(n.task?.model_override || ""), l = /* @__PURE__ */ z(n.task?.provider_override || ""), u = /* @__PURE__ */ z(n.task?.reasoning_effort || ""), d = /* @__PURE__ */ z(!1);
		function f() {
			i.value.trim() && r("save", {
				title: i.value.trim(),
				body: a.value,
				priority: o.value,
				...n.task ? {} : {
					assignee: s.value || null,
					triage: d.value
				},
				...c.value.trim() ? {
					model_override: c.value.trim(),
					provider_override: l.value.trim() || null
				} : n.task ? { clear_model_override: !0 } : {},
				...u.value ? { reasoning_effort: u.value } : n.task ? { clear_reasoning_effort: !0 } : {}
			});
		}
		return (t, n) => (G(), K("form", {
			class: "kanban-form",
			onSubmit: Oo(f, ["prevent"])
		}, [
			q("label", null, [n[9] ||= J("Title", -1), jn(q("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				required: "",
				"aria-label": "Task title"
			}, null, 512), [[vo, i.value]])]),
			q("label", null, [n[10] ||= J("Description", -1), jn(q("textarea", {
				"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
				rows: "4",
				"aria-label": "Task description"
			}, null, 512), [[vo, a.value]])]),
			q("label", null, [n[11] ||= J("Priority", -1), jn(q("input", {
				"onUpdate:modelValue": n[2] ||= (e) => o.value = e,
				type: "number",
				step: "1",
				"aria-label": "Task priority"
			}, null, 512), [[
				vo,
				o.value,
				void 0,
				{ number: !0 }
			]])]),
			e.task ? Y("v-if", !0) : (G(), K("label", jv, [n[13] ||= J("Assignee", -1), jn(q("select", {
				"onUpdate:modelValue": n[3] ||= (e) => s.value = e,
				"aria-label": "Task assignee"
			}, [n[12] ||= q("option", { value: "" }, "Unassigned", -1), (G(!0), K(W, null, U(e.assignees, (e) => (G(), K("option", {
				key: e,
				value: e
			}, L(e), 9, Mv))), 128))], 512), [[xo, s.value]])])),
			e.task ? Y("v-if", !0) : (G(), K("label", Nv, [jn(q("input", {
				"onUpdate:modelValue": n[4] ||= (e) => d.value = e,
				type: "checkbox"
			}, null, 512), [[yo, d.value]]), n[14] ||= J("Start in triage", -1)])),
			q("details", null, [
				n[19] ||= q("summary", null, "Worker overrides", -1),
				n[20] ||= q("p", { class: "kanban-muted" }, " Blank values inherit the assigned profile. Overrides apply to the next worker run. ", -1),
				q("label", null, [n[15] ||= J("Model override", -1), jn(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					"aria-label": "Task model override"
				}, null, 512), [[vo, c.value]])]),
				q("label", null, [n[16] ||= J("Provider override", -1), jn(q("input", {
					"onUpdate:modelValue": n[6] ||= (e) => l.value = e,
					"aria-label": "Task provider override"
				}, null, 512), [[vo, l.value]])]),
				q("label", null, [n[18] ||= J("Reasoning effort", -1), jn(q("select", {
					"onUpdate:modelValue": n[7] ||= (e) => u.value = e,
					"aria-label": "Task reasoning effort"
				}, [n[17] ||= q("option", { value: "" }, "Inherit profile", -1), (G(), K(W, null, U([
					"none",
					"minimal",
					"low",
					"medium",
					"high",
					"xhigh",
					"max",
					"ultra"
				], (e) => q("option", {
					key: e,
					value: e
				}, L(e), 9, Pv)), 64))], 512), [[xo, u.value]])])
			]),
			q("div", Fv, [q("button", {
				disabled: e.busy || !i.value.trim(),
				type: "submit"
			}, L(e.task ? "Save task" : "Create task"), 9, Iv), q("button", {
				type: "button",
				disabled: e.busy,
				onClick: n[8] ||= (e) => r("cancel")
			}, "Cancel", 8, Lv)])
		], 32));
	}
}), zv = {
	class: "kanban-detail",
	"aria-label": "Task details"
}, Bv = { class: "kanban-toolbar" }, Vv = { class: "kanban-muted" }, Hv = { key: 0 }, Uv = { key: 1 }, Wv = {
	key: 2,
	class: "kanban-muted"
}, Gv = { key: 0 }, Kv = { class: "kanban-prose" }, qv = ["disabled"], Jv = { class: "kanban-toolbar" }, Yv = ["value", "disabled"], Xv = ["value"], Zv = ["value"], Qv = ["disabled"], $v = ["disabled"], ey = ["value"], ty = ["disabled"], ny = { key: 5 }, ry = { class: "kanban-prose" }, iy = { class: "kanban-prose" }, ay = { open: "" }, oy = {
	key: 0,
	class: "kanban-muted"
}, sy = ["onClick"], cy = { open: "" }, ly = { class: "kanban-muted" }, uy = { class: "kanban-prose" }, dy = ["disabled"], fy = {
	key: 6,
	open: ""
}, py = ["href"], my = { class: "kanban-muted" }, hy = [
	"disabled",
	"aria-label",
	"onClick"
], gy = { class: "kanban-upload" }, _y = ["disabled"], vy = {
	key: 0,
	class: "kanban-muted"
}, yy = { class: "kanban-prose" }, by = {
	key: 0,
	class: "kanban-prose"
}, xy = {
	key: 0,
	class: "kanban-muted"
}, Sy = {
	key: 0,
	class: "kanban-muted"
}, Cy = ["disabled"], wy = /* @__PURE__ */ H({
	__name: "TaskDetail",
	props: {
		board: {},
		detail: {},
		log: {},
		workflow: {},
		assignees: {},
		busy: { type: Boolean }
	},
	emits: [
		"close",
		"select",
		"operation",
		"upload"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z();
		sr(() => i.value?.focus());
		let a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(n.detail.task.assignee || ""), c = /* @__PURE__ */ z(!1);
		V(() => n.detail.task.assignee, (e) => {
			s.value = e || "";
		});
		let l = () => "/tasks/" + encodeURIComponent(n.detail.task.id);
		function u(e, t, n, i = !0, a) {
			r("operation", l() + e, t, n, i, a);
		}
		function d(e) {
			u("", "PATCH", e, !0, () => {
				a.value = !1;
			});
		}
		function f() {
			let e = o.value;
			e.trim() && u("/comments", "POST", {
				body: e.trim(),
				author: "dashboard"
			}, !1, () => {
				o.value === e && (o.value = "");
			});
		}
		function p(e) {
			let t = e.target, n = t.files?.[0];
			n && r("upload", n), t.value = "";
		}
		function m(e) {
			return (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
		}
		return (t, n) => (G(), K("section", zv, [
			q("div", Bv, [q("h2", {
				ref_key: "heading",
				ref: i,
				tabindex: "-1",
				class: "min-w-0 flex-1 break-words text-xl"
			}, L(e.detail.task.title), 513), q("button", {
				"aria-label": "Close task details",
				onClick: n[0] ||= (e) => r("close")
			}, "Close")]),
			q("p", Vv, L(e.detail.task.id) + " · " + L(e.detail.task.status) + " · Priority " + L(e.detail.task.priority ?? 0), 1),
			e.detail.task.progress ? (G(), K("p", Hv, L(e.detail.task.progress.done) + "/" + L(e.detail.task.progress.total) + " subtasks complete ", 1)) : Y("v-if", !0),
			e.detail.task.block_kind ? (G(), K("p", Uv, "Block reason: " + L(e.detail.task.block_kind), 1)) : Y("v-if", !0),
			e.detail.task.worker_pid ? (G(), K("p", Wv, [J(" Worker " + L(e.detail.task.worker_pid), 1), e.detail.task.last_heartbeat_at ? (G(), K("span", Gv, " · Heartbeat " + L(m(e.detail.task.last_heartbeat_at)), 1)) : Y("v-if", !0)])) : Y("v-if", !0),
			a.value ? (G(), Hi(Rv, {
				key: 3,
				task: e.detail.task,
				assignees: e.assignees,
				busy: e.busy,
				onSave: d,
				onCancel: n[1] ||= (e) => a.value = !1
			}, null, 8, [
				"task",
				"assignees",
				"busy"
			])) : (G(), K(W, { key: 4 }, [q("p", Kv, L(e.detail.task.body || "No description."), 1), q("button", {
				disabled: e.busy,
				onClick: n[2] ||= (e) => a.value = !0
			}, "Edit task", 8, qv)], 64)),
			q("div", Jv, [
				q("label", null, [n[11] ||= J("Move task", -1), q("select", {
					"aria-label": "Move task",
					value: e.detail.task.status,
					disabled: e.busy || !e.workflow,
					onChange: n[3] ||= (e) => u("", "PATCH", { status: e.target.value })
				}, [q("option", { value: e.detail.task.status }, L(e.detail.task.status), 9, Xv), (G(!0), K(W, null, U(e.workflow?.columns.filter((t) => t.drag_target && e.workflow?.manual[e.detail.task.status]?.includes(t.key)), (e) => (G(), K("option", {
					key: e.key,
					value: e.key
				}, L(e.label), 9, Zv))), 128))], 40, Yv)]),
				e.detail.task.status === "archived" ? Y("v-if", !0) : (G(), K("button", {
					key: 0,
					disabled: e.busy,
					onClick: n[4] ||= (e) => u("", "PATCH", { status: "archived" })
				}, " Archive task ", 8, Qv)),
				e.detail.task.status === "running" ? (G(), K("button", {
					key: 1,
					disabled: e.busy,
					onClick: n[5] ||= (e) => u("/reclaim", "POST", {})
				}, " Reclaim worker ", 8, $v)) : Y("v-if", !0)
			]),
			q("form", {
				class: "kanban-toolbar",
				onSubmit: n[7] ||= Oo((e) => u("/reassign", "POST", {
					profile: s.value,
					reclaim_first: !0
				}), ["prevent"])
			}, [
				q("label", null, [n[13] ||= J("Assignee", -1), jn(q("select", {
					"onUpdate:modelValue": n[6] ||= (e) => s.value = e,
					"aria-label": "Reassign task"
				}, [n[12] ||= q("option", { value: "" }, "Unassigned", -1), (G(!0), K(W, null, U(Array.from(new Set([...e.assignees, e.detail.task.assignee || ""].filter(Boolean))), (e) => (G(), K("option", {
					key: e,
					value: e
				}, L(e), 9, ey))), 128))], 512), [[xo, s.value]])]),
				q("button", { disabled: e.busy }, "Reassign task", 8, ty),
				n[14] ||= q("p", { class: "kanban-muted" }, "Reassigning releases any active worker claim.", -1)
			], 32),
			e.detail.task.latest_summary || e.detail.task.result ? (G(), K("details", ny, [
				n[15] ||= q("summary", null, "Result and latest summary", -1),
				q("p", ry, L(e.detail.task.latest_summary), 1),
				q("p", iy, L(e.detail.task.result), 1)
			])) : Y("v-if", !0),
			q("details", ay, [n[16] ||= q("summary", null, "Dependencies and linked tasks", -1), (G(), K(W, null, U(["parents", "children"], (t) => q("div", { key: t }, [
				q("h3", null, L(t === "parents" ? "Depends on" : "Children"), 1),
				e.detail.links[t].length ? Y("v-if", !0) : (G(), K("p", oy, "None")),
				(G(!0), K(W, null, U(e.detail.links[t], (t) => (G(), K("button", {
					key: t,
					class: "kanban-link",
					onClick: (e) => r("select", t)
				}, L(e.detail.link_tasks?.find((e) => e.id === t)?.title || t) + " · " + L(e.detail.link_tasks?.find((e) => e.id === t)?.status), 9, sy))), 128))
			])), 64))]),
			q("details", cy, [
				q("summary", null, "Comments (" + L(e.detail.comments.length) + ")", 1),
				(G(!0), K(W, null, U(e.detail.comments, (e) => (G(), K("article", {
					key: e.id,
					class: "kanban-comment"
				}, [q("p", ly, L(e.author) + " · " + L(m(e.created_at)), 1), q("p", uy, L(e.body), 1)]))), 128)),
				q("form", {
					class: "kanban-form",
					onSubmit: Oo(f, ["prevent"])
				}, [q("label", null, [n[17] ||= J("Comment", -1), jn(q("textarea", {
					"onUpdate:modelValue": n[8] ||= (e) => o.value = e,
					"aria-label": "New task comment",
					required: "",
					rows: "3"
				}, null, 512), [[vo, o.value]])]), q("button", { disabled: e.busy || !o.value.trim() }, "Add comment", 8, dy)], 32)
			]),
			e.detail.attachments == null ? Y("v-if", !0) : (G(), K("details", fy, [
				q("summary", null, "Attachments (" + L(e.detail.attachments.length) + ")", 1),
				(G(!0), K(W, null, U(e.detail.attachments, (t) => (G(), K("div", {
					key: t.id,
					class: "kanban-toolbar"
				}, [
					q("a", {
						class: "kanban-link",
						href: B(Uc)("/attachments/" + encodeURIComponent(t.id), e.board),
						target: "_blank",
						rel: "noopener"
					}, L(t.filename), 9, py),
					q("span", my, L(t.size ?? 0) + " bytes", 1),
					q("button", {
						disabled: e.busy,
						"aria-label": "Remove attachment " + t.filename,
						onClick: (e) => r("operation", "/attachments/" + encodeURIComponent(t.id), "DELETE", void 0, !1)
					}, " Remove ", 8, hy)
				]))), 128)),
				q("label", gy, [n[18] ||= J("Attach file", -1), q("input", {
					type: "file",
					"aria-label": "Task attachment",
					disabled: e.busy,
					onChange: p
				}, null, 40, _y)])
			])),
			q("details", null, [
				q("summary", null, "Run history (" + L(e.detail.runs.length) + ")", 1),
				e.detail.runs.length ? Y("v-if", !0) : (G(), K("p", vy, "No runs yet.")),
				(G(!0), K(W, null, U(e.detail.runs, (e) => (G(), K("article", {
					key: e.id,
					class: "kanban-comment"
				}, [
					q("h3", null, "Run " + L(e.id) + " · " + L(e.profile) + " · " + L(e.outcome || e.status), 1),
					q("p", yy, L(e.summary), 1),
					e.error ? (G(), K("p", by, L(e.error), 1)) : Y("v-if", !0)
				]))), 128))
			]),
			q("details", null, [n[19] ||= q("summary", null, "Worker log", -1), e.log?.exists ? (G(), K(W, { key: 1 }, [e.log.truncated ? (G(), K("p", Sy, "Showing the last 16 KiB.")) : Y("v-if", !0), q("pre", null, L(e.log.content), 1)], 64)) : (G(), K("p", xy, "No worker log yet."))]),
			q("details", null, [q("summary", null, "Activity (" + L(e.detail.events.length) + ")", 1), (G(!0), K(W, null, U(e.detail.events, (e) => (G(), K("p", {
				key: e.id,
				class: "kanban-muted"
			}, L(e.kind) + " · " + L(m(e.created_at)), 1))), 128))]),
			q("details", null, [
				n[20] ||= q("summary", null, "Delete task", -1),
				n[21] ||= q("p", null, "Delete this task permanently?", -1),
				c.value ? (G(), K("button", {
					key: 1,
					disabled: e.busy,
					onClick: n[10] ||= (e) => u("", "DELETE", void 0)
				}, " Confirm delete task ", 8, Cy)) : (G(), K("button", {
					key: 0,
					onClick: n[9] ||= (e) => c.value = !0
				}, "Delete task…"))
			])
		]));
	}
}), Ty = {
	key: 0,
	class: "kanban-empty"
}, Ey = ["disabled"], Dy = { class: "kanban-toolbar" }, Oy = ["value"], ky = ["disabled", "aria-expanded"], Ay = {
	key: 1,
	role: "alert",
	class: "kanban-error"
}, jy = {
	key: 2,
	role: "status",
	class: "kanban-muted"
}, My = {
	key: 3,
	class: "kanban-muted"
}, Ny = { key: 0 }, Py = { class: "kanban-toolbar" }, Fy = ["disabled"], Iy = ["disabled"], Ly = ["disabled"], Ry = ["disabled"], zy = {
	key: 5,
	role: "status"
}, By = {
	key: 6,
	class: "kanban-empty"
}, Vy = {
	class: "kanban-columns",
	"aria-label": "Board columns"
}, Hy = ["aria-label", "onDrop"], Uy = { class: "kanban-muted" }, Wy = {
	key: 0,
	class: "kanban-muted"
}, Gy = [
	"data-task-id",
	"draggable",
	"onDragstart",
	"onClick"
], Ky = { class: "kanban-muted" }, qy = { key: 0 }, Jy = { key: 1 }, Yy = { key: 2 }, Xy = {
	key: 3,
	class: "kanban-card-summary"
}, Zy = {
	key: 1,
	class: "kanban-detail",
	"aria-label": "Task details"
}, Qy = /* @__PURE__ */ H({
	__name: "KanbanPage",
	setup(e) {
		let t = Qc(), n = kc(), r = /* @__PURE__ */ z();
		async function i() {
			let e = w.value;
			w.value = "", await vn(), Array.from(r.value?.querySelectorAll(".kanban-card") || []).find((t) => t.dataset.taskId === e)?.focus();
		}
		let a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(""), f = /* @__PURE__ */ z(!1), p = /* @__PURE__ */ z(!1), m = /* @__PURE__ */ z(""), h = /* @__PURE__ */ z(""), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z(""), v = /* @__PURE__ */ z(""), y = /* @__PURE__ */ z(!1), b = Av(o, t.visible, s, () => {
			t.check();
		}), { snapshot: x, detail: S, log: C, taskId: w, error: T, loading: E } = b, ee = X(() => a.value.find((e) => e.slug === o.value)), D = !1, O = 0;
		dr(() => {
			D = !0, O++, t.screenActions.value = [];
		});
		function k() {
			try {
				return localStorage.getItem("chathermes.kanban-board") || "";
			} catch {
				return "";
			}
		}
		let te;
		async function A() {
			te?.abort();
			let e = te = new AbortController(), r = O;
			try {
				let i = await Gc.boards(e.signal);
				if (D || r !== O || !t.visible.value) return;
				if (a.value = i.boards, !i.boards.some((e) => e.slug === o.value)) {
					let e = typeof n.query.board == "string" ? n.query.board : k();
					o.value = i.boards.find((t) => t.slug === e)?.slug || i.boards.find((e) => e.slug === i.current)?.slug || i.boards[0]?.slug || "";
				}
				l.value = "";
			} catch (n) {
				!D && !e.signal.aborted && r === O && (l.value = n instanceof Hc ? n.message : "Could not load boards.", n instanceof Hc && [
					401,
					403,
					404,
					503
				].includes(n.status) && t.unavailable());
			}
		}
		V(t.visible, (e, t, n) => {
			if (O++, !e) {
				a.value = [], o.value = "", c.value = void 0, p.value = !1, m.value = "", f.value = !1;
				return;
			}
			let r = new AbortController();
			A(), Gc.workflow(r.signal).then((e) => {
				r.signal.aborted || (c.value = e);
			}).catch(() => {});
			let i = setInterval(() => {
				document.visibilityState === "visible" && A();
			}, 8e3);
			n(() => {
				r.abort(), te?.abort(), clearInterval(i);
			});
		}, { immediate: !0 }), V(o, (e) => {
			O++, f.value = !1, p.value = !1, m.value = "", u.value = "", d.value = "", y.value = !1, e === n.query.board && typeof n.query.task == "string" && (w.value = n.query.task);
			try {
				localStorage.setItem("chathermes.kanban-board", e);
			} catch {}
		}), V([
			() => n.query.board,
			() => n.query.task,
			t.visible
		], ([e, t, n]) => {
			if (n && typeof e == "string" && typeof t == "string") {
				if (o.value !== e) {
					a.value.some((t) => t.slug === e) && (o.value = e);
					return;
				}
				w.value = t;
			}
		}, { immediate: !0 }), V([
			f,
			o,
			s,
			t.visible
		], () => {
			t.screenActions.value = t.visible.value ? [
				{
					label: "Refresh",
					disabled: f.value,
					run: () => {
						M();
					}
				},
				{
					label: "New board",
					disabled: f.value,
					run: () => {
						se("create");
					}
				},
				{
					label: "Board settings",
					disabled: f.value || !o.value,
					run: () => {
						se("edit");
					}
				},
				{
					label: "Show archived tasks",
					checked: s.value,
					run: () => {
						s.value = !s.value;
					}
				}
			] : [];
		}, { immediate: !0 });
		async function ne() {
			p.value = !0, await vn(), r.value?.querySelector("input[aria-label=\"Task title\"]")?.focus();
		}
		async function j() {
			p.value = !1, await vn(), r.value?.querySelector(".kanban-new-task")?.focus();
		}
		async function M() {
			await Promise.all([A(), b.refresh()]);
		}
		async function re(e, n, r = !1) {
			if (f.value || !t.visible.value) return;
			let i = O, a = o.value;
			f.value = !0, u.value = "", d.value = "";
			try {
				let t = await e();
				if (r && a && Gc.write("/dispatch", "POST", {}, a).catch(() => {}), D || i !== O) return;
				if (t && typeof t == "object" && "ok" in t && t.ok === !1) {
					u.value = "Hermes could not complete this action. Check the task state in Hermes.";
					return;
				}
				t && typeof t == "object" && "warning" in t && t.warning && (d.value = "Hermes saved the task with a dispatcher warning. Check the Hermes dispatcher if it does not start."), n?.(), await M();
			} catch (e) {
				!D && i === O && (u.value = e instanceof Hc ? e.message : "Kanban operation failed. Refresh to inspect the outcome before retrying.", await b.refresh());
			} finally {
				!D && i === O && (f.value = !1);
			}
		}
		function ie(e, t, n, r = !0, i) {
			let a = o.value;
			re(() => Gc.write(e, t, n, a), () => {
				i?.(), t === "DELETE" && e === "/tasks/" + encodeURIComponent(w.value) && (w.value = "");
			}, r);
		}
		async function ae(e) {
			let t = o.value, n = O, r = !1;
			await re(async () => {
				let n = await Gc.write("/tasks", "POST", e, t);
				return r = !0, n;
			}, void 0, !0), r && !D && n === O && await j();
		}
		function oe(e) {
			let t = o.value, n = w.value;
			re(() => Gc.upload(t, n, e));
		}
		function se(e) {
			m.value = e, h.value = e === "edit" ? o.value : "", g.value = e === "edit" && ee.value?.name || "", _.value = e === "edit" && ee.value?.description || "", v.value = e === "edit" && ee.value?.default_workdir || "";
		}
		function ce() {
			let e = m.value === "edit", t = {
				name: g.value,
				description: _.value,
				default_workdir: v.value,
				...e ? {} : {
					slug: h.value.trim(),
					switch: !1
				}
			};
			re(() => Gc.write("/boards" + (e ? "/" + encodeURIComponent(o.value) : ""), e ? "PATCH" : "POST", t), () => {
				m.value = "";
			});
		}
		function le() {
			let e = o.value;
			re(() => Gc.write("/boards/" + encodeURIComponent(e), "DELETE", void 0), () => {
				y.value = !1;
			});
		}
		function ue(e, t) {
			let n = x.value?.columns.flatMap((e) => e.tasks).find((t) => t.id === e);
			n && c.value?.columns.some((e) => e.key === t && e.drag_target) && c.value.manual[n.status]?.includes(t) && ie("/tasks/" + encodeURIComponent(e), "PATCH", { status: t });
		}
		function de(e, t) {
			e.dataTransfer?.setData("application/x-chathermes-task", JSON.stringify({
				board: o.value,
				id: t
			}));
		}
		function N(e, t) {
			try {
				let n = JSON.parse(e.dataTransfer?.getData("application/x-chathermes-task") || "");
				n.board === o.value && ue(n.id, t);
			} catch {}
		}
		return (e, n) => (G(), K("section", {
			ref_key: "page",
			ref: r,
			class: "kanban-page page-content",
			"aria-label": "Kanban viewer"
		}, [B(t).visible.value ? (G(), K(W, { key: 1 }, [
			q("div", Dy, [q("label", null, [n[11] ||= J("Board", -1), jn(q("select", {
				"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
				"aria-label": "Kanban board"
			}, [(G(!0), K(W, null, U(a.value, (e) => (G(), K("option", {
				key: e.slug,
				value: e.slug
			}, L(e.name || e.slug), 9, Oy))), 128))], 512), [[xo, o.value]])]), q("button", {
				class: "kanban-new-task",
				disabled: f.value || !o.value || p.value,
				"aria-expanded": p.value,
				onClick: ne
			}, " New task ", 8, ky)]),
			p.value ? (G(), Hi(Rv, {
				key: o.value,
				assignees: B(x)?.assignees || [],
				busy: f.value,
				onSave: ae,
				onCancel: j
			}, null, 8, ["assignees", "busy"])) : Y("v-if", !0),
			l.value || u.value || B(T) ? (G(), K("p", Ay, L(u.value || l.value || B(T)), 1)) : Y("v-if", !0),
			d.value ? (G(), K("p", jy, L(d.value), 1)) : Y("v-if", !0),
			c.value ? Y("v-if", !0) : (G(), K("p", My, " Manual movement is unavailable until the Hermes workflow API responds. ")),
			m.value ? (G(), K("form", {
				key: 4,
				class: "kanban-form kanban-board-editor",
				"aria-label": "Board settings",
				onSubmit: Oo(ce, ["prevent"])
			}, [
				m.value === "create" ? (G(), K("label", Ny, [n[12] ||= J("Board slug", -1), jn(q("input", {
					"onUpdate:modelValue": n[2] ||= (e) => h.value = e,
					required: "",
					"aria-label": "Board slug"
				}, null, 512), [[vo, h.value]])])) : Y("v-if", !0),
				q("label", null, [n[13] ||= J("Board name", -1), jn(q("input", {
					"onUpdate:modelValue": n[3] ||= (e) => g.value = e,
					"aria-label": "Board name"
				}, null, 512), [[vo, g.value]])]),
				q("label", null, [n[14] ||= J("Description", -1), jn(q("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => _.value = e,
					"aria-label": "Board description"
				}, null, 512), [[vo, _.value]])]),
				q("label", null, [n[15] ||= J("Default directory on Hermes", -1), jn(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => v.value = e,
					"aria-label": "Board default directory"
				}, null, 512), [[vo, v.value]])]),
				q("div", Py, [
					q("button", { disabled: f.value }, "Save board", 8, Fy),
					q("button", {
						type: "button",
						disabled: f.value,
						onClick: n[6] ||= (e) => m.value = ""
					}, "Cancel", 8, Iy),
					m.value === "edit" && o.value !== "default" && !y.value ? (G(), K("button", {
						key: 0,
						type: "button",
						disabled: f.value,
						onClick: n[7] ||= (e) => y.value = !0
					}, " Archive board…", 8, Ly)) : Y("v-if", !0),
					y.value ? (G(), K("button", {
						key: 1,
						type: "button",
						disabled: f.value,
						onClick: le
					}, " Confirm archive board ", 8, Ry)) : Y("v-if", !0)
				])
			], 32)) : Y("v-if", !0),
			B(E) ? (G(), K("p", zy, "Loading board…")) : !a.value.length && !l.value ? (G(), K("p", By, " No boards available. Create a board to get started. ")) : Y("v-if", !0),
			q("div", { class: fe(["kanban-workspace", { "has-detail": B(w) }]) }, [q("div", Vy, [(G(!0), K(W, null, U(B(x)?.columns, (e) => (G(), K("section", {
				key: e.name,
				class: fe(["kanban-column", { "kanban-column-empty": !e.tasks.length }]),
				"aria-label": e.name + " tasks",
				onDragover: n[8] ||= Oo(() => {}, ["prevent"]),
				onDrop: Oo((t) => N(t, e.name), ["prevent"])
			}, [
				q("h2", null, [J(L(c.value?.columns.find((t) => t.key === e.name)?.label || e.name) + " ", 1), q("span", Uy, L(e.tasks.length), 1)]),
				e.tasks.length ? Y("v-if", !0) : (G(), K("p", Wy, "No tasks")),
				(G(!0), K(W, null, U(e.tasks, (e) => (G(), K("button", {
					key: e.id,
					class: fe(["kanban-card", { selected: B(w) === e.id }]),
					"data-task-id": e.id,
					draggable: !f.value,
					onDragstart: (t) => de(t, e.id),
					onClick: (t) => w.value = e.id
				}, [
					q("strong", null, L(e.title), 1),
					q("span", Ky, L(e.status) + " · " + L(e.assignee || "Unassigned") + " · Priority " + L(e.priority ?? 0), 1),
					e.progress ? (G(), K("span", qy, L(e.progress.done) + "/" + L(e.progress.total) + " subtasks", 1)) : Y("v-if", !0),
					e.comment_count ? (G(), K("span", Jy, L(e.comment_count) + " comments", 1)) : Y("v-if", !0),
					e.warnings?.count ? (G(), K("span", Yy, L(e.warnings.count) + " warnings", 1)) : Y("v-if", !0),
					e.latest_summary ? (G(), K("span", Xy, L(e.latest_summary), 1)) : Y("v-if", !0)
				], 42, Gy))), 128))
			], 42, Hy))), 128))]), B(S) ? (G(), Hi(wy, {
				key: o.value + ":" + B(S).task.id,
				board: o.value,
				detail: B(S),
				log: B(C),
				workflow: c.value,
				assignees: B(x)?.assignees || [],
				busy: f.value,
				onClose: i,
				onSelect: n[9] ||= (e) => w.value = e,
				onOperation: ie,
				onUpload: oe
			}, null, 8, [
				"board",
				"detail",
				"log",
				"workflow",
				"assignees",
				"busy"
			])) : B(w) ? (G(), K("section", Zy, [q("button", { onClick: n[10] ||= (e) => w.value = "" }, "Close task details"), q("p", null, L(B(T) ? "Task details are unavailable. Refresh or select another task." : "Loading task…"), 1)])) : Y("v-if", !0)], 2)
		], 64)) : (G(), K("div", Ty, [q("p", null, L(B(t).enabled.value ? "Hermes Kanban is unavailable. Your chats remain available." : "Enable Kanban Viewer in global Settings to view boards."), 1), q("button", {
			disabled: B(t).checking.value,
			onClick: n[0] ||= (e) => B(t).check()
		}, " Recheck availability ", 8, Ey)]))], 512));
	}
}), $y = [
	"role",
	"aria-checked",
	"disabled",
	"onClick"
], eb = /* @__PURE__ */ H({
	__name: "KanbanActions",
	setup(e) {
		let t = Qc();
		return (e, n) => B(t).visible.value ? (G(!0), K(W, { key: 0 }, U(B(t).screenActions.value, (e) => (G(), K("button", {
			key: e.label,
			role: e.checked === void 0 ? "menuitem" : "menuitemcheckbox",
			"aria-checked": e.checked,
			disabled: e.disabled,
			onClick: (t) => e.run()
		}, L(e.label), 9, $y))), 128)) : Y("v-if", !0);
	}
}), tb = /* @__PURE__ */ H({
	__name: "InboxActions",
	setup(e) {
		let { refreshInbox: t, inboxRevision: n } = c_();
		return (e, r) => (G(), K("button", {
			role: "menuitem",
			class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
			"data-test": "refresh-inbox",
			"aria-label": "Refresh inbox",
			onClick: r[0] ||= (e) => {
				B(t)(), n.value++;
			}
		}, " Refresh inbox "));
	}
}), nb = { id: "project-confirmation-text" }, rb = {
	key: 0,
	role: "alert",
	class: "project-error"
}, ib = { class: "project-actions" }, ab = ["disabled"], ob = ["disabled"], sb = /* @__PURE__ */ H({
	__name: "ProjectConfirmation",
	setup(e) {
		let { projectConfirmation: t, selectedProject: n, projectBusy: r, offline: i, manageError: a, manageProject: o, projectId: s } = y_(), c = /* @__PURE__ */ z();
		V(t, async () => {
			await vn(), c.value?.focus();
		});
		function l() {
			t.value = void 0, document.querySelector("[aria-label=\"Screen options\"]")?.focus();
		}
		async function u() {
			let e = t.value;
			e && (await o(e, { id: s.value }), a.value || (t.value = void 0));
		}
		return (e, o) => B(t) && B(n) ? (G(), K("div", {
			key: 0,
			class: "project-confirmation mx-6",
			role: "alertdialog",
			"aria-labelledby": "project-confirmation-text",
			onKeydown: o[0] ||= Ao(Oo((e) => !B(r) && l(), ["stop", "prevent"]), ["esc"])
		}, [
			q("p", nb, L(B(t) === "delete" ? `Delete ${B(n).label}? This permanently removes the project and its folder associations. Files and chats will be kept.` : `Archive ${B(n).label}? You can restore it from Archived projects.`), 1),
			B(a) ? (G(), K("p", rb, L(B(a)), 1)) : Y("v-if", !0),
			q("div", ib, [q("button", {
				ref_key: "projectConfirmCancel",
				ref: c,
				class: "project-button",
				disabled: B(r),
				onClick: l
			}, " Cancel", 8, ab), q("button", {
				class: "project-button project-danger",
				disabled: B(r) || B(i),
				onClick: u
			}, L(B(t) === "delete" ? "Delete project permanently" : "Confirm archive"), 9, ob)])
		], 32)) : Y("v-if", !0);
	}
}), cb = ["aria-label"], lb = { class: "mx-auto max-w-3xl" }, ub = {
	key: 0,
	class: "mb-3 px-2 text-sm text-[#b4b4b4]"
}, db = {
	key: 1,
	class: "mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm"
}, fb = { class: "flex items-center gap-2" }, pb = { value: "profile" }, mb = {
	key: 2,
	role: "alert",
	class: "mb-4 text-red-200"
}, hb = {
	key: 3,
	role: "status",
	class: "text-[#b4b4b4]"
}, gb = {
	key: 4,
	class: "text-[#b4b4b4]"
}, _b = { class: "divide-y divide-[#363636]" }, vb = ["data-session"], yb = ["disabled", "onClick"], bb = { class: "min-w-0 truncate font-medium" }, xb = { class: "line-clamp-1 break-words text-sm text-[#b4b4b4]" }, Sb = { class: "flex items-center gap-2 text-xs text-[#777]" }, Cb = ["datetime"], wb = [
	"aria-label",
	"disabled",
	"onClick"
], Tb = ["disabled"], Eb = /* @__PURE__ */ H({
	__name: "InboxList",
	props: {
		preview: { type: Boolean },
		profile: {},
		revision: {},
		scope: {},
		openItem: { type: Function }
	},
	emits: ["update:scope", "refresh"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = X({
			get: () => n.scope,
			set: (e) => r("update:scope", e)
		}), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(), l = /* @__PURE__ */ z(), u = /* @__PURE__ */ z(""), d;
		async function f(e = !1) {
			d?.abort();
			let t = d = new AbortController();
			s.value = !0, u.value = "";
			try {
				let r = await Q.inbox(n.profile, {
					scope: i.value,
					unread: !0,
					limit: n.preview ? 5 : void 0,
					cursor: e && o.value || void 0
				}, t.signal);
				if (t.signal.aborted) return;
				let s = e ? [...a.value, ...r.items] : r.items;
				a.value = s.filter((e, t) => s.findIndex((t) => t.id === e.id) === t), n.preview && (a.value = a.value.slice(0, 5)), o.value = n.preview ? null : r.nextCursor;
			} catch {
				t.signal.aborted || (u.value = "Could not load inbox. Try refreshing.");
			} finally {
				d === t && (s.value = !1);
			}
		}
		async function p(e) {
			if (!(c.value || l.value)) {
				c.value = e.id, u.value = "";
				try {
					await n.openItem(e);
				} catch {
					u.value = "Could not open this notification. It remains unread.";
				} finally {
					c.value = void 0;
				}
			}
		}
		async function m(e) {
			if (c.value || l.value) return;
			let t = d;
			l.value = e.id, u.value = "";
			try {
				await Q.deleteInboxItem(e.profile, e.id), d === t && !t?.signal.aborted && (a.value = a.value.filter((t) => t.id !== e.id), n.preview && await f()), r("refresh");
			} catch {
				d === t && !t?.signal.aborted && (u.value = "Could not remove this notification. Try again.");
			} finally {
				l.value = void 0;
			}
		}
		return V(() => [
			n.profile,
			n.revision,
			i.value,
			n.preview
		], () => void f(), { immediate: !0 }), ur(() => d?.abort()), (t, n) => (G(), K("section", {
			"data-drawer-swipe": "",
			"aria-label": e.preview ? "Recent inbox messages" : "Inbox",
			class: "min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
		}, [q("div", lb, [
			e.preview ? (G(), K("h2", ub, "Recent messages")) : (G(), K("div", db, [q("label", fb, [n[3] ||= J("View ", -1), jn(q("select", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Inbox view",
				class: "rounded-lg bg-[#303030] px-2 py-1 text-base"
			}, [n[2] ||= q("option", { value: "all" }, "All profiles", -1), q("option", pb, "Profile: " + L(e.profile || "default"), 1)], 512), [[xo, i.value]])])])),
			u.value ? (G(), K("p", mb, L(u.value), 1)) : Y("v-if", !0),
			s.value && !a.value.length ? (G(), K("p", hb, "Loading inbox…")) : a.value.length ? Y("v-if", !0) : (G(), K("p", gb, "No unread notifications.")),
			q("ol", _b, [(G(!0), K(W, null, U(a.value, (e) => (G(), K("li", {
				key: e.id,
				"data-session": e.session,
				class: "flex items-center gap-1"
			}, [q("button", {
				"data-drawer-swipe": "",
				class: "inbox-open grid min-w-0 flex-1 gap-1 rounded-lg px-2 py-2 text-left hover:bg-[#292929]",
				disabled: !!c.value || !!l.value,
				onClick: (t) => p(e)
			}, [
				q("p", bb, L(e.title || "Untitled chat"), 1),
				q("p", xb, L(e.preview), 1),
				q("div", Sb, [q("span", null, L(e.profile), 1), q("time", { datetime: (/* @__PURE__ */ new Date(e.occurred * 1e3)).toISOString() }, L((/* @__PURE__ */ new Date(e.occurred * 1e3)).toLocaleString()), 9, Cb)])
			], 8, yb), q("button", {
				class: "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[#a3a3a3] hover:bg-[#424242] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-label": `Remove ${e.title || "Untitled chat"} from inbox`,
				title: "Remove from inbox",
				disabled: !!c.value || !!l.value,
				onClick: (t) => m(e)
			}, [...n[4] ||= [q("svg", {
				class: "size-5",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [q("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}), q("path", { d: "m8 12 3 3 5-6" })], -1)]], 8, wb)], 8, vb))), 128))]),
			o.value ? (G(), K("button", {
				key: 5,
				class: "my-5 min-h-11 rounded-full border border-[#555] px-5",
				disabled: s.value,
				onClick: n[1] ||= (e) => f(!0)
			}, " Load More ", 8, Tb)) : Y("v-if", !0)
		])], 8, cb));
	}
}), Db = {
	key: 0,
	class: "min-h-0 flex-1 overflow-y-auto break-words px-5 py-4 text-sm text-[#b4b4b4]"
}, Ob = {
	key: 0,
	role: "alert"
}, kb = {
	key: 1,
	role: "status"
}, Ab = { key: 2 }, jb = /* @__PURE__ */ H({
	__name: "HomePage",
	setup(e) {
		let { profile: t, inboxRevision: n, openInboxItem: r, refreshInbox: i } = c_(), a = kc(), { selectedProject: o, projectError: s, projectLoading: c, loadProject: l } = y_();
		return Mc(() => ({
			title: a.query.project ? "New chat" : "ChatHermes",
			subtitle: o.value?.label
		})), (e, u) => B(a).query.project ? (G(), K("div", Db, [B(s) ? (G(), K("p", Ob, [J(L(B(s)) + " ", 1), q("button", { onClick: u[0] ||= (e) => B(l)() }, "Retry")])) : B(c) ? (G(), K("p", kb, "Loading project…")) : B(o) ? (G(), K("p", Ab, "New chat in " + L(B(o).label), 1)) : Y("v-if", !0)])) : (G(), Hi(Eb, {
			key: 1,
			preview: "",
			scope: "all",
			profile: B(t),
			revision: B(n),
			"open-item": B(r),
			onRefresh: B(i)
		}, null, 8, [
			"profile",
			"revision",
			"open-item",
			"onRefresh"
		]));
	}
}), Mb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fff}.st1{fill:%23bababa}%3c/style%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st1'%20d='M0%2094V2C0%20.9.9%200%202%200h48c.6%200%201.1.2%201.5.7l20%2022.3c.3.4.5.8.5%201.3V94c0%201.1-.9%202-2%202H2c-1.1%200-2-.9-2-2zm68-68.9L49.1%204H4v88h64V25.1z'/%3e%3cpath%20class='st1'%20d='M48%2026V4c0-1.1.9-2%202-2s2%20.9%202%202v20h16c1.1%200%202%20.9%202%202s-.9%202-2%202H50c-1.1%200-2-.9-2-2z'/%3e%3c/svg%3e", Nb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2372a536}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2s1.2%204.4%203.2%204.4c1%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm10.7%200c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201L36%2010.1c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.5-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%2372a536'%20stroke='%2372a536'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Pb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm8.7-10.3H32l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3L36%206.4h3.5l-3.9%2014.3h-3.3L28.4%206.4z'%20fill='%23fff'/%3e%3cpath%20d='M14%2054h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58'%20fill='none'%20stroke='%231f7244'%20stroke-width='3'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Fb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2H6.6V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zM24.1%206.1c3.8%200%205.9%203.1%205.9%207.3%200%204.2-2.1%207.5-5.9%207.5s-5.8-3.2-5.8-7.5c0-4.1%202.1-7.3%205.8-7.3zm0%2011.7c1.7%200%202.5-1.8%202.5-4.3s-.8-4.2-2.5-4.2-2.5%201.7-2.5%204.2.8%204.3%202.5%204.3zM38%206.1c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Ib = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.4-34.6h3.3c2.9%200%204.7%202.6%204.7%207.1s-1.8%207.2-4.7%207.2H6.4V6.4zm3.3%2011.4c1.3%200%202.1-1.5%202.1-4.3S11%209.3%209.7%209.3H9v8.5h.7zM20%206.1c3%200%204.7%203.1%204.7%207.3%200%204.2-1.7%207.5-4.7%207.5s-4.7-3.2-4.7-7.5c0-4.1%201.7-7.3%204.7-7.3zm0%2011.7c1.4%200%202-1.8%202-4.3s-.6-4.2-2-4.2-2%201.7-2%204.2.6%204.3%202%204.3zM30.7%206.1c1%200%202.1.4%202.9%201.2l-1.1%202.8c-.3-.5-1-.9-1.7-.9-1.7%200-2.6%201.9-2.6%204.2%200%202.3.9%204.4%202.5%204.4.8%200%201.3-.5%201.8-1l1.1%202.8c-.7.7-1.6%201.3-3.2%201.3-3.2%200-5-3.1-5-7.4.1-4.2%202-7.4%205.3-7.4zm5.9%207.5l-2.8-7.2h2.9l.9%202.9c.3.9.4%201.8.4%201.8s.2-.9.5-1.8l.9-2.9h2.9l-2.8%207.2%202.7%207.1h-2.8l-.9-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.4%201.7l-.9%203h-2.8l2.7-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Lb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.4-34.9c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.1-4.5%202.6-7.6%206.5-7.6zm7.2%2012.4l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1h4.3v2.9h-8.9v-2.2z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", Rb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23d75b26}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h2.8v5.8H12V6.4h2.8v14.3H12V15H9.2v5.7H6.5V6.4zm12%202.9h-2.7V6.4h8.1v2.9h-2.7v11.4h-2.8V9.3zm6.9-2.9h3.1l1.1%206c.2.9.4%202.4.4%202.4s.2-1.5.4-2.4l1.1-6h3.1l.8%2014.3h-2.6l-.3-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.7%204.1h-2.7l-.7-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.3%206.4h-2.6l.9-14.3zm11.5%200h2.8v11.4h3.7v2.9H37V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2075c-.5%200-1.1-.2-1.5-.6L13.6%2066c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-7%206.9%206.9%206.9c.8.8.8%202.1%200%203-.4.4-.9.6-1.4.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2074.3c-.4.5-.9.7-1.5.7zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3%201.1.4%201.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23d75b26'%20stroke='%23d75b26'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", zb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23307ac6}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm-.3-25.7H9v1.1c0%201.5.4%201.6.7%201.6.5%200%20.7-.3.7-1.6v-7H7.7v-3h6v9.9c0%203.3-2%204.6-4%204.6-2.1%200-4-1.4-4-4.6v-1zM18%2016.7c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%23307ac6'%20stroke='%23307ac6'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Bb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}.st1{fill:%23fff}.st2{fill:%23999;stroke:%23999;stroke-width:.5;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st1'%20d='M6%2041h60v49H6V41z'/%3e%3cpath%20class='st2'%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4.4-.2.8-.6%201.2-1%20.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2-.6-.6-1-1.2-1.2-2-.2-.8-.3-2.1-.3-4%200-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202c.2.8.4%202.1.4%204%200%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'/%3e%3cpath%20class='st1'%20d='M5.8%2015.7H8v.9c0%201.9.6%202.1%201.1%202.1.6%200%201.1-.4%201.1-2.1V8.7H7.8V6.5h4.6v10c0%203.2-1.6%204.4-3.3%204.4s-3.3-1.2-3.3-4.4v-.8zm9%201.8c.6.7%201.4%201.2%202.2%201.2%201%200%201.6-.7%201.6-1.8%200-2.6-4.5-2.5-4.5-6.6%200-2.3%201.4-4%203.8-4%201%200%202%20.3%202.8.9L20%209.4c-.5-.4-1.3-.8-2-.8-1.1%200-1.6.8-1.6%201.7%200%202.6%204.5%202.4%204.5%206.5%200%202.2-1.3%204.1-3.7%204.1-1.2%200-2.4-.5-3.3-1.4l.9-2zM27.1%206.2c3.2%200%205.1%203%205.1%207.3s-2%207.4-5.1%207.4c-3.2%200-5.1-3.1-5.1-7.4%200-4.2%202-7.3%205.1-7.3zm0%2012.4c1.8%200%202.9-2%202.9-5.1%200-3-1.1-4.9-2.9-4.9s-2.9%201.9-2.9%204.9c0%203.1%201.1%205.1%202.9%205.1zM34%206.5h2.3l3.3%208c.3.9.6%202.2.6%202.2h.1s-.1-1.3-.1-2.2v-8h2.1v14.2H40l-3.3-8.1c-.3-.9-.6-2.2-.6-2.2H36s.1%201.3.1%202.2v8H34V6.5z'/%3e%3cpath%20class='st2'%20d='M44.1%2067.1c-.7-.3-1.2-.9-1.2-1.6s.5-1.4%201.2-1.6c.3-.1.4-.3.3-.5-.3-.8-.5-1.6-1-2.2-.1-.3-.4-.3-.6-.2s-.5.3-.8.3c-1%200-1.7-.8-1.7-1.7%200-.3.1-.6.3-.8.1-.3%200-.4-.2-.6-.7-.4-1.5-.7-2.2-1-.3-.1-.4.1-.5.3-.3.7-.9%201.2-1.6%201.2s-1.4-.5-1.6-1.2c-.1-.3-.3-.4-.5-.3-.8.3-1.6.5-2.2%201-.3.1-.3.4-.2.6.2.3.3.5.3.8%200%201-.8%201.7-1.7%201.7-.3%200-.6-.1-.8-.3-.3-.1-.4%200-.6.2-.4.7-.7%201.5-1%202.2-.1.3.1.4.3.5.7.3%201.2.9%201.2%201.6s-.5%201.4-1.2%201.6c-.3.1-.4.3-.3.5.3.8.5%201.6%201%202.2.1.3.4.3.6.2.3-.2.5-.3.8-.3%201%200%201.7.8%201.7%201.7%200%20.3-.1.6-.3.8-.1.3%200%20.4.2.6.7.4%201.5.7%202.2%201%20.2%200%20.4-.1.4-.3.3-.7.9-1.2%201.6-1.2s1.4.5%201.6%201.2c.1.3.3.4.5.3.8-.3%201.6-.5%202.2-1%20.3-.1.3-.4.2-.6-.1-.3-.3-.5-.3-.8%200-1%20.8-1.7%201.7-1.7.3%200%20.6.1.8.3.3.1.4%200%20.6-.2.4-.7.7-1.5%201-2.2.2-.1.1-.4-.2-.5zm-8.3%201c-1.5%200-2.7-1.2-2.7-2.7%200-1.5%201.2-2.7%202.7-2.7s2.7%201.2%202.7%202.7c.1%201.5-1.2%202.7-2.7%202.7z'/%3e%3c/svg%3e", Vb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm14.6%200h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2H25v8.5h.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13.5%2076.4V54.6h6.4l6.4%208%206.4-8h6.4v21.8h-6.4V63.9l-6.4%208-6.4-8v12.5h-6.4zm38.4%200l-9.6-10.6h6.4V54.6h6.4v11.2h6.4l-9.6%2010.6z'/%3e%3c/svg%3e", Hb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm8.7%203.6c.4.4%201.1.7%201.7.7.9%200%201.6-.4%201.6-1.6%200-1-.7-1.5-2.3-1.5h-.9l-.7-1.8%202-2.5c.5-.6.9-1%20.9-1s-.4.1-1.1.1h-2.3v-3h7.2V9l-2.6%203.1c2%20.5%203.1%202.1%203.1%204.1%200%202.4-1.4%204.8-4.7%204.8-1.3%200-2.5-.4-3.5-1.3l1.6-2.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", Ub = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23f60}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm6.8%201.8l3.7-8.8h4.2v8.1H42v3h-1.2v3.2h-3.2v-3.2h-4.7v-2.3zm4.7-.7v-3.4c0-.8.1-1.3.1-1.3s-.1.6-.3%201.2L36%2014.5h1.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13%2083.1h46V47.9H13v35.2zm8.9-2.7h-5.5v-3.9h5.5v3.9zm16.9%200h-5.5v-3.9h5.5v3.9zm11.3-30.1h5.5v4h-5.5v-4zm0%2026.1h5.5v3.9h-5.5v-3.9zm-8.5-26.1H47v3.9h-5.5v-3.9zm0%2026.1H47v3.9h-5.5l.1-3.9zm-8.4-26.1h5.5v3.9h-5.5v-3.9zm-.8%209.7l7.2%204.1c1.3.8%201.3%202%200%202.8L32.4%2071c-1.3.8-2.4.1-2.4-1.4v-8.3c0-1.4%201.1-2.1%202.4-1.3zm-7.7-9.7h5.4v3.9h-5.4v-3.9zm0%2026.1h5.4v3.9h-5.4v-3.9zm-8.3-26.1h5.5v4h-5.5v-4z'/%3e%3c/svg%3e", Wb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23c11e07}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zm9.1-11.4h7.1v2.9h-3.8v3.1H38v2.9h-3.1v5.4h-3.3V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M33.5%2046.538c-2.3%200-4.1%201.9-4.1%204.1%200%202.8%201.6%206.3%203.2%209.6-1.3%204-2.7%208.3-4.6%2011.9-3.8%201.5-7.2%202.6-9.2%204.3l-.1.1c-.7.8-1.2%201.8-1.2%202.9%200%202.3%201.9%204.1%204.1%204.1%201.1%200%202.2-.4%202.9-1.2%200%200%20.1%200%20.1-.1%201.5-1.8%203.3-5.1%204.9-8%203.6-1.4%207.5-2.9%2011.1-3.8%202.7%202.2%206.6%203.6%209.8%203.6%202.3%200%204.1-1.9%204.1-4.1%200-2.3-1.9-4.1-4.1-4.1-2.6%200-6.3.9-9.1%201.9-2.3-2.2-4.4-4.9-6-7.8%201.1-3.4%202.4-6.7%202.4-9.3-.1-2.3-1.9-4.1-4.2-4.1zm0%202.4c.9%200%201.6.7%201.6%201.6%200%201.2-.7%203.5-1.4%205.9-1-2.4-1.9-4.7-1.9-5.9.1-.8.8-1.6%201.7-1.6zm.7%2014.1c1.2%202%202.7%203.8%204.3%205.4-2.4.7-4.8%201.5-7.2%202.4%201.2-2.5%202.1-5.2%202.9-7.8zm16.2%205.3c.9%200%201.6.7%201.6%201.6%200%20.9-.7%201.6-1.6%201.6-1.9%200-4.5-.8-6.6-2%202.4-.6%205.1-1.2%206.6-1.2zm-24.5%207.3c-1.2%202.1-2.3%204-3.1%205-.3.3-.6.4-1.1.4-.9%200-1.6-.7-1.6-1.6%200-.4.2-.9.4-1.1.9-.8%203-1.7%205.4-2.7z'%20fill='%23c11e07'%20stroke='%23c11e07'%20stroke-width='.75'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Gb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm10-4.1h-3.1V6.4h9.6v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", Kb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205H9.5v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zm5.7-7h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205h-1.1v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zM27%209.3h-2.8V6.4h8.6v2.9H30v11.4h-3V9.3zm9%204.3l-3.1-7.2h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.1-.9-.3-1.7-.3-1.7s-.2.8-.5%201.7l-1%203H33l3-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", qb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9s-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm10%201.4l-3.6-8.4h3.6l1.1%203.4c.3%201%20.5%202.1.5%202.1h.1s.2-1.1.5-2.1l1.1-3.4h3.6l-3.6%208.4v5.9h-3.3v-5.9z'%20fill='%23fff'/%3e%3cpath%20d='M34.5%2083.4c-4.4-.1-7.2-1.5-7.9-3.8l-.1-.3v-4.5c0-5.2%200-5.3.3-6.1.5-1.5%201.7-2.5%203.5-2.9l.4-.1h5.1c3.7%200%205.2%200%205.4-.1%201.1-.2%201.7-.4%202.3-.9.8-.6%201.4-1.6%201.6-2.6.2-.8.2-.7.2-3.5v-2.5h3.6l.4.1c1.9.6%203.3%202.3%203.9%205.1.2%201.1.2%201.1.2%203.8%200%202.6%200%202.6-.2%203.5-.2.8-.4%201.6-.8%202.3-.7%201.4-1.8%202.4-3.1%202.8-.8.3-.1.2-7.5.3h-6.7v1.2h8.8v4.6c-.1.3-.1.6-.4%201s-.8.9-1.1%201.2c-1.2.8-3%201.3-5.4%201.4h-2.5zm6.1-2.8c.8-.1%201.5-1%201.3-1.8-.1-.7-.6-1.2-1.3-1.3-1.1-.1-2%20.8-1.8%201.8.1.8.8%201.3%201.6%201.3h.2zm-19-6.5c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%23fed142'/%3e%3cpath%20d='M21.6%2074.1c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%233571a3'/%3e%3c/svg%3e", Jb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fea500}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm1.3-24.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8zM16%206.4h3.6l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.7-8.1h3.5l-3.9%2014.3h-3.3L16%206.4zm19.1-.3c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.2-4.5%202.6-7.6%206.5-7.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M27.1%2060.2L18%2079.4l1.7%201.7L31%2069.8c-.4-.9-.3-2%20.5-2.8%201-1%202.5-1%203.5%200s1%202.5%200%203.5c-.7.7-1.9.9-2.8.5L20.9%2082.3l1.7%201.7%2019.2-9.1L46%2063.4%2038.6%2056l-11.5%204.2zm26.3-2.3L44%2048.5c-.8-.8-2-.8-2.8%200L39%2050.7c-.8.8-.8%202%200%202.8l9.4%209.4c.8.8%202%20.8%202.8%200l2.2-2.2c.8-.8.8-2%200-2.8z'/%3e%3c/svg%3e", Yb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234d1b9b}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm10.5-2.9H23l3.6%2014.3h-3.3l-.6-3h-3l-.6%203h-3.3l3.6-14.3zm2.8%208.6l-.6-2.8c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.8h2zm6.9-8.6h4.5c.6%200%201.3.1%201.9.4%201.4.6%202.4%202.1%202.4%204%200%201.7-.8%203.3-2%204%200%200%20.2.2.5.9l2.3%205h-3.6l-2-4.8h-.8v4.8H29V6.4zM33%2013c.9%200%201.6-.7%201.6-1.9%200-.7-.2-1.2-.6-1.5-.3-.2-.6-.3-.9-.3h-.7V13h.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M43.6%2068.3l-7.3-3.4L51%2058l7.3%203.4-7.3%203.5-7.4%203.4zM51%2051.2l-7.3-3.4-7.3%203.4L51%2058.1l7.3-3.4-7.3-3.5zM28.9%2061.4L21.6%2058l-7.3%203.4L29%2068.3l7.3-3.4-7.4-3.5zm0-6.8l7.3-3.4-7.3-3.4-14.7%206.9%207.3%203.4%207.4-3.5zM51%2066.9l-6.6%203-.8.4-.8-.4-6.6-3-6.6%203-.8.4-.8-.4-6.6-3v10.7l14.7%207.7L51%2077.6V66.9z'/%3e%3c/svg%3e", Xb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234065aa}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm9.9%207.4c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M37.9%2055.1v-7.6H33c-.1.3-.2.6-.2%201-.1.2-.1.3-.1.5-.5%202.8-2%204.8-4.5%205.9-.7.3-1.4.4-2.1.3v6.1h3.6c.1%208.6.1%2013.1.1%2013.3v.5c.5%203.8%202.4%206%205.9%206.9%201.4.4%202.9.6%204.5.6%202-.1%203.9-.4%205.8-1v-7.2c-1.1.3-2.1.6-3%20.9-1.7.5-3.2.2-4.4-1-.1-.2-.3-.4-.3-.6-.2-.9-.3-1.9-.3-2.8v-9.6h7.8v-6.1h-7.9v-.1z'/%3e%3c/svg%3e", Zb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm11.5%204.3L17%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1H24l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203h-3.5l3.3-7.1zm12.1-4.3h-3.1V6.4H39v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14.6%2077.2h42.8v6.2H14.6zm0-14.8h42.8v6.2H14.6zm0-15h42.8v6.2H14.6z'/%3e%3c/svg%3e", Qb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM5.6%206.4h3.1l1.1%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.2-8.9h2.9l1.2%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.1-8.9h3.1l-2.4%2014.3H14l-1.1-7.2c-.1-.9-.2-1.7-.2-1.7h-.1s0%20.8-.1%201.7l-1%207.2H8L5.6%206.4zm18.3%200h3.4l3.4%2014.3h-3.1l-.6-3h-2.9l-.6%203h-3.1l3.5-14.3zm2.6%208.6l-.5-2.9c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.9h1.9zm4.3-8.6h3.4l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.6-8.1h3.3l-3.7%2014.3h-3.2L30.8%206.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", $b = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm9.8-7.2h3.3v11.4h4.3v2.9h-7.6V6.4zm11%2010.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.3-.5-1.3-.9-2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", ex = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.6-27.4L5.5%206.4h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9H15l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203H5.6l3-7.1zm8-7.2h3v11.4h3.9v2.9h-6.8V6.4zm9%2010.3c.5.6%201.3%201.2%202.1%201.2s1.2-.6%201.2-1.2c0-2-4.3-2.1-4.3-6.2%200-2.4%201.5-4.3%204.1-4.3%201.1%200%202.2.3%203.1%201l-1.1%202.9c-.4-.4-1.3-.9-1.9-.9-.8%200-1.2.6-1.2%201.2%200%202.1%204.3%202%204.3%206.1%200%202.3-1.3%204.4-4%204.4-1.3%200-2.6-.5-3.6-1.4l1.3-2.8zm10.2-3.1l-3.1-7.2H36l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203h-3.2l3.1-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", tx = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm10.3-7.2H23l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6h3.6l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H23l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l1.1-14.3zm15.1%200h3.3v11.4H42v2.9h-7.6V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2076c-.5%200-1.1-.2-1.5-.6L13.6%2067c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-6.9%206.9%206.9%206.9c.8.8.8%202.1%200%203-.5.4-1%20.6-1.5.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2075.4c-.4.4-.9.6-1.5.6zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3s1.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23666'%20stroke='%23666'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", nx = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.9-26.2L5.5%206.5H8l1.5%204.2c.3.9.5%201.9.5%201.9s.2-1%20.5-1.9L12%206.5h2.5l-3.4%208.3v5.9H8.9v-5.9zm8.4-8.3h2.5l3.5%2014.2H21l-.9-3.7h-3.2l-.8%203.7h-2.3l3.5-14.2zm2.4%208.5l-.8-3.8c-.2-.8-.4-2.2-.4-2.2h-.1s-.2%201.4-.4%202.2l-.8%203.8h2.5zm5.2-8.5h2.5l1.8%206.9c.2.9.4%202.2.4%202.2h.1s.2-1.3.4-2.2l1.8-6.9h2.5l.8%2014.2h-2.1l-.4-7.9c-.1-.9%200-2.2%200-2.2h-.1s-.2%201.4-.4%202.3l-1.4%205.4h-2.2l-1.4-5.4c-.2-.8-.4-2.3-.4-2.3h-.1s.1%201.3%200%202.2l-.4%207.9h-2.1l.7-14.2zm12.3%200h2.3v12h4.3v2.2h-6.5V6.5z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14%2048.9h37v4.3H14zm7%209.6h37v4.3H21zm-7%209.6h37v4.3H14zm7%209.6h37V82H21z'/%3e%3c/svg%3e", rx = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm0-22.5l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1H15v2.9H6v-2.2zM18.1%206.4h3.3v14.3h-3.3V6.4zm7%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", ix = { class: "artifact-card my-2 w-full max-w-md overflow-hidden rounded-2xl border border-[#424242] bg-[#292929]" }, ax = ["aria-label"], ox = ["src", "alt"], sx = { class: "flex min-w-0 items-center gap-3 p-3" }, cx = ["src"], lx = { class: "min-w-0 flex-1" }, ux = ["aria-label"], dx = {
	key: 1,
	class: "block truncate text-sm font-medium"
}, fx = { class: "block text-xs text-[#b4b4b4]" }, px = [
	"href",
	"download",
	"aria-label"
], mx = { class: "mb-4 flex items-center gap-3" }, hx = { class: "min-w-0 flex-1 break-words" }, gx = ["href", "download"], _x = {
	key: 0,
	role: "status"
}, vx = {
	key: 1,
	role: "alert",
	class: "text-red-200"
}, yx = {
	key: 2,
	class: "max-h-[70dvh] overflow-auto whitespace-pre-wrap break-words text-sm"
}, bx = ["src", "alt"], xx = ["src", "title"], Sx = ["src"], Cx = ["src"], wx = /* @__PURE__ */ H({
	__name: "ArtifactCard",
	props: {
		file: {},
		profile: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* #__PURE__ */ Object.assign({
			"../../../assets/file-icons/blank.svg": Mb,
			"../../../assets/file-icons/css.svg": Nb,
			"../../../assets/file-icons/csv.svg": Pb,
			"../../../assets/file-icons/doc.svg": Fb,
			"../../../assets/file-icons/docx.svg": Ib,
			"../../../assets/file-icons/gz.svg": Lb,
			"../../../assets/file-icons/html.svg": Rb,
			"../../../assets/file-icons/js.svg": zb,
			"../../../assets/file-icons/json.svg": Bb,
			"../../../assets/file-icons/md.svg": Vb,
			"../../../assets/file-icons/mp3.svg": Hb,
			"../../../assets/file-icons/mp4.svg": Ub,
			"../../../assets/file-icons/pdf.svg": Wb,
			"../../../assets/file-icons/ppt.svg": Gb,
			"../../../assets/file-icons/pptx.svg": Kb,
			"../../../assets/file-icons/py.svg": qb,
			"../../../assets/file-icons/svg.svg": Jb,
			"../../../assets/file-icons/tar.svg": Yb,
			"../../../assets/file-icons/ts.svg": Xb,
			"../../../assets/file-icons/txt.svg": Zb,
			"../../../assets/file-icons/wav.svg": Qb,
			"../../../assets/file-icons/xls.svg": $b,
			"../../../assets/file-icons/xlsx.svg": ex,
			"../../../assets/file-icons/xml.svg": tx,
			"../../../assets/file-icons/yaml.svg": nx,
			"../../../assets/file-icons/zip.svg": rx
		}), a = X(() => i[`../../../assets/file-icons/${rm(n.file.name)}.svg`] || i["../../../assets/file-icons/blank.svg"]), o = X(() => am(n.file)), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z(!1), p;
		function m() {
			p?.abort(), c.value.startsWith("blob:") && URL.revokeObjectURL(c.value), c.value = "", l.value = "";
		}
		ur(m);
		async function h() {
			m(), u.value = "", s.value?.showModal(), d.value = !0;
			let e = p = new AbortController();
			try {
				let t = om(n.file, n.profile);
				if (o.value === "image" && /^\/api\/plugins\/chathermes\/(?:images\/[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)|artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+)(?:\?|$)/i.test(t)) {
					c.value = t;
					return;
				}
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
		let g = /* @__PURE__ */ z("");
		return V([
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
			let a = om(n.file, n.profile);
			if (/^\/api\/plugins\/chathermes\/(?:images\/[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)|artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+)(?:\?|$)/i.test(a)) {
				g.value = a;
				return;
			}
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
		}, { immediate: !0 }), (t, n) => (G(), K("div", ix, [
			o.value === "image" && g.value && !f.value ? (G(), K("button", {
				key: 0,
				type: "button",
				class: "block w-full",
				"aria-label": `Preview ${e.file.name}`,
				onClick: h
			}, [q("img", {
				src: g.value,
				alt: e.file.name,
				class: "max-h-72 w-full object-contain",
				onLoad: n[0] ||= (e) => r("imageLoad"),
				onError: n[1] ||= (e) => f.value = !0
			}, null, 40, ox)], 8, ax)) : Y("v-if", !0),
			q("div", sx, [
				o.value !== "image" || f.value ? (G(), K("img", {
					key: 0,
					src: a.value,
					alt: "",
					class: "size-10 shrink-0"
				}, null, 8, cx)) : Y("v-if", !0),
				q("div", lx, [o.value ? (G(), K("button", {
					key: 0,
					type: "button",
					class: "block w-full truncate text-left text-sm font-medium hover:underline",
					"aria-label": `Preview ${e.file.name}`,
					onClick: h
				}, L(e.file.name), 9, ux)) : (G(), K("span", dx, L(e.file.name), 1)), q("span", fx, [J(L(B(rm)(e.file.name).toUpperCase() || "FILE"), 1), e.file.size === void 0 ? Y("v-if", !0) : (G(), K(W, { key: 0 }, [J(" · " + L(e.file.size < 1024 ? `${e.file.size} B` : e.file.size < 1048576 ? `${(e.file.size / 1024).toFixed(1)} KB` : `${(e.file.size / 1048576).toFixed(1)} MB`), 1)], 64))])]),
				q("a", {
					href: B(om)(e.file, e.profile, !0),
					download: e.file.name,
					"aria-label": `Download ${e.file.name}`,
					class: "grid size-10 shrink-0 place-items-center rounded-xl hover:bg-[#424242]"
				}, [...n[4] ||= [q("svg", {
					viewBox: "0 0 24 24",
					class: "size-5",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [q("path", { d: "M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" })], -1)]], 8, px)
			]),
			vr(t.$slots, "footer"),
			q("dialog", {
				ref_key: "dialog",
				ref: s,
				class: "artifact-preview fixed m-auto max-h-[90dvh] w-[min(900px,94vw)] overflow-auto rounded-2xl border border-[#424242] bg-[#212121] p-4 text-white backdrop:bg-black/80",
				onClose: m,
				onClick: n[3] ||= (e) => e.target === s.value && s.value?.close()
			}, [q("div", mx, [
				q("h2", hx, L(e.file.name), 1),
				q("a", {
					href: B(om)(e.file, e.profile, !0),
					download: e.file.name,
					class: "text-sm underline"
				}, "Download", 8, gx),
				q("button", {
					type: "button",
					autofocus: "",
					class: "size-10 rounded-full hover:bg-[#424242]",
					"aria-label": "Close preview",
					onClick: n[2] ||= (e) => s.value?.close()
				}, " ✕ ")
			]), d.value ? (G(), K("p", _x, "Loading preview…")) : u.value ? (G(), K("p", vx, L(u.value), 1)) : o.value === "text" ? (G(), K("pre", yx, L(l.value), 1)) : o.value === "image" && c.value ? (G(), K("img", {
				key: 3,
				src: c.value,
				alt: e.file.name,
				class: "max-h-[70dvh] w-full object-contain"
			}, null, 8, bx)) : o.value === "pdf" && c.value ? (G(), K("iframe", {
				key: 4,
				src: c.value,
				title: e.file.name,
				class: "h-[70dvh] w-full bg-white"
			}, null, 8, xx)) : o.value === "video" && c.value ? (G(), K("video", {
				key: 5,
				src: c.value,
				controls: "",
				class: "max-h-[70dvh] w-full"
			}, null, 8, Sx)) : o.value === "audio" && c.value ? (G(), K("audio", {
				key: 6,
				src: c.value,
				controls: "",
				class: "w-full"
			}, null, 8, Cx)) : Y("v-if", !0)], 544)
		]));
	}
}), Tx = new Kp({
	html: !1,
	breaks: !0,
	linkify: !0
});
Tx.renderer.rules.link_open = (e, t, n, r, i) => (e[t].attrSet("target", "_blank"), e[t].attrSet("rel", "noopener noreferrer"), i.renderToken(e, t, n));
function Ex(e) {
	return Tx.render(e);
}
//#endregion
//#region src/features/chat/components/UserMessage.vue?vue&type=script&setup=true&lang.ts
var Dx = { class: "message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]" }, Ox = ["innerHTML"], kx = /* @__PURE__ */ H({
	__name: "UserMessage",
	props: {
		message: {},
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (G(), K("article", Dx, [q("div", {
			class: "message-content markdown-content break-words text-base leading-7",
			innerHTML: B(Ex)(B(fm)(B(Ol)(e.message.content)).text.replace(/\[screenshot\]/g, "📷 Attached image"))
		}, null, 8, Ox), (G(!0), K(W, null, U(B(pm)(e.message), (t) => (G(), Hi(wx, {
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
function Ax(e) {
	let t = [], n;
	for (let r of e) (r.kind !== "text" && r.kind !== "thinking" || r.content.trim()) && (r.kind === "text" ? t.push({
		id: r.id,
		kind: "block",
		block: r
	}) : (n || (n = {
		id: r.id,
		kind: "tools",
		activities: []
	}, t.push(n)), n.activities.push(r)));
	return t;
}
//#endregion
//#region src/features/chat/utils/activity-labels.ts
var jx = (e) => [
	"terminal",
	"execute_code",
	"python"
].includes(e.toolName || "");
function Mx(e) {
	try {
		return JSON.parse(e.content) || {};
	} catch {
		return {};
	}
}
function Nx(e) {
	let t = Mx(e), n = t.command ?? t.code;
	return typeof n == "string" && n.trim().split("\n")[0] || "";
}
function Px(e, t) {
	if (jx(e)) return `${t ? "Running" : e.state === "completed" ? "Ran" : "Command"} ${Nx(e) || "command"}`;
	let n = (e.toolName || "tool").replace(/_/g, " ");
	return /^(used|using) tool$/i.test(e.title) ? `${t ? "Using" : e.state === "completed" ? "Used" : "Tool:"} ${n}` : e.title || n;
}
var Fx = {
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
function Ix(e) {
	let t = e.toolName || "";
	return jx(e) ? "run" : [
		"read_file",
		"list_files",
		"search_files",
		"file_search",
		"search"
	].includes(t) ? "explore" : ["web_search", "session_search_recall"].includes(t) ? "search" : t === "web_extract" ? "read" : t === "browser_navigate" ? "browse" : t.startsWith("browser_") ? "interact" : t === "vision_analyze" ? "analyze" : "other";
}
function Lx(e, t) {
	let n = Mx(e);
	if (t === "run") return Nx(e);
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
function Rx(e, t) {
	let n = t ? e.find((e) => !e.complete) ?? e.at(-1) : void 0, r = n ? Ix(n) : void 0, i = [];
	for (let t of Object.keys(Fx)) {
		let n = e.filter((e) => Ix(e) === t);
		if (!n.length) continue;
		let a = Fx[t], o = t === r, s = n.every((e) => e.state === "completed"), c = n.reduce((e, n) => {
			let r = Mx(n).urls;
			return e + (t === "read" && Array.isArray(r) && r.length ? r.length : 1);
		}, 0), l = c === 1 && (o || t !== "run") ? Lx(n[0], t) : "", u = o ? a.present : s ? a.past : "";
		i.push([u, l || `${c} ${a.nouns[c === 1 ? 0 : 1]}`].filter(Boolean).join(" "));
	}
	let a = e.filter((e) => e.state === "failed").length;
	return a && i.push(`${a} failed`), i.map((e, t) => t ? e.charAt(0).toLowerCase() + e.slice(1) : e).join(", ");
}
//#endregion
//#region src/components/ActivityRow.vue?vue&type=script&setup=true&lang.ts
var zx = ["open"], Bx = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, Vx = {
	key: 1,
	"aria-hidden": "true"
}, Hx = ["title"], Ux = {
	key: 2,
	class: "activity-meta"
}, Wx = {
	key: 3,
	class: "activity-meta"
}, Gx = {
	key: 4,
	class: "activity-meta"
}, Kx = {
	key: 5,
	class: "activity-meta"
}, qx = {
	key: 6,
	class: "activity-meta"
}, Jx = {
	key: 1,
	class: "ml-6 py-1 text-sm",
	role: "status"
}, Yx = /* @__PURE__ */ H({
	__name: "ActivityRow",
	props: {
		activity: {},
		turnComplete: { type: Boolean }
	},
	setup(e) {
		let t = e, n = X(() => !t.activity.complete && (!t.turnComplete || !!t.activity.delegated)), r = X(() => !n.value && (!t.activity.state || ["pending", "running"].includes(t.activity.state)) ? t.activity.kind === "tool" ? "unknown" : "completed" : t.activity.state), i = X(() => [
			"failed",
			"interrupted",
			"unknown"
		].includes(r.value || "")), a = /* @__PURE__ */ z(null), o = X(() => a.value ?? !1), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(!0);
		function l() {
			let e = s.value;
			e && (c.value = e.scrollHeight - e.scrollTop - e.clientHeight < 24);
		}
		V(() => [
			t.activity.content,
			t.activity.output,
			o.value
		], () => {
			let e = s.value;
			e && n.value && o.value && c.value && (e.scrollTop = e.scrollHeight);
		}, { flush: "post" });
		let u = /* @__PURE__ */ z(Date.now()), d;
		V(() => n.value && t.activity.startedAt !== void 0, (e) => {
			d && clearInterval(d), e && (d = setInterval(() => {
				u.value = Date.now();
			}, 1e3));
		}, { immediate: !0 }), ur(() => {
			d && clearInterval(d);
		});
		let f = X(() => t.activity.duration ?? (n.value && t.activity.startedAt !== void 0 ? Math.max(0, (u.value - t.activity.startedAt) / 1e3) : void 0)), p = X(() => t.activity.kind === "thinking" ? n.value ? "Thinking…" : "Thought" : Px(t.activity, n.value));
		function m(e) {
			let t = e.target.open;
			t !== o.value && (a.value = t);
		}
		return (t, c) => (G(), K("details", {
			class: fe(["activity", {
				"activity-failed": i.value,
				"activity-active": n.value,
				"activity-thinking": e.activity.kind === "thinking"
			}]),
			open: o.value,
			onToggle: m
		}, [q("summary", { onClick: c[0] ||= Oo((e) => a.value = !o.value, ["prevent"]) }, [
			B(jx)(e.activity) ? (G(), K("span", Bx, "›_")) : Y("v-if", !0),
			i.value ? (G(), K("span", Vx, "!")) : Y("v-if", !0),
			q("span", {
				class: fe(["activity-label", { "working-shimmer": n.value }]),
				title: p.value
			}, L(p.value), 11, Hx),
			r.value === "failed" ? (G(), K("span", Ux, " · Failed")) : r.value === "interrupted" ? (G(), K("span", Wx, " · Interrupted")) : r.value === "unknown" ? (G(), K("span", Gx, " · Result unavailable")) : n.value && e.activity.kind === "tool" ? (G(), K("span", Kx, " · " + L(r.value === "pending" ? "Waiting…" : "Running…"), 1)) : Y("v-if", !0),
			f.value === void 0 ? Y("v-if", !0) : (G(), K("span", qx, " · " + L(f.value.toFixed(1)) + "s", 1)),
			q("span", {
				class: fe(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2)
		]), e.activity.content || e.activity.output || e.activity.toolName ? (G(), K("pre", {
			key: 0,
			ref_key: "preview",
			ref: s,
			onScroll: l
		}, L([
			e.activity.toolName,
			e.activity.content,
			e.activity.output
		].filter(Boolean).join("\n\n")), 545)) : n.value ? (G(), K("p", Jx, "Working…")) : Y("v-if", !0)], 42, zx));
	}
}), Xx = {
	class: "turn-work",
	"aria-label": "Assistant activity"
}, Zx = ["aria-expanded", "aria-controls"], Qx = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, $x = ["title"], eS = {
	key: 1,
	class: "sr-only",
	role: "status"
}, tS = ["id"], nS = /* @__PURE__ */ H({
	__name: "TurnWork",
	props: {
		activities: {},
		working: { type: Boolean },
		approvalPending: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(null), r = Kn(), i = (e) => !e.complete && (t.working || !!e.delegated), a = X(() => t.activities.filter((e) => !i(e))), o = X(() => n.value ?? !1), s = X(() => t.approvalPending ? "Waiting for approval" : t.activities.length && [
			a.value.some((e) => e.kind === "thinking") ? "Thought" : "",
			Rx(a.value.filter((e) => e.kind === "tool"), !1),
			...["interrupted", "unknown"].flatMap((e) => {
				let t = a.value.filter((t) => e === "unknown" ? t.state === e || !t.complete : t.state === e && t.complete).length;
				return t ? [`${t} ${e === "unknown" ? "results unavailable" : e}`] : [];
			})
		].filter(Boolean).join(", ") || "Working…");
		return (t, a) => (G(), K("section", Xx, [q("button", {
			type: "button",
			class: "work-summary",
			"aria-expanded": o.value,
			"aria-controls": B(r),
			onClick: a[0] ||= (e) => n.value = !o.value
		}, [
			e.activities.some(B(jx)) ? (G(), K("span", Qx, "›_")) : Y("v-if", !0),
			q("span", {
				class: fe(["activity-label", { "working-shimmer": e.working && !e.activities.length && !e.approvalPending }]),
				title: s.value
			}, L(s.value), 11, $x),
			q("span", {
				class: fe(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2),
			e.approvalPending ? (G(), K("span", eS, "Waiting for approval")) : Y("v-if", !0)
		], 8, Zx), q("div", {
			id: B(r),
			class: "work-timeline"
		}, [(G(!0), K(W, null, U(e.activities, (n) => (G(), K(W, { key: n.id }, [jn(q("div", { class: fe({ "current-activity": i(n) }) }, [qi(Yx, {
			activity: n,
			"turn-complete": !e.working
		}, null, 8, ["activity", "turn-complete"])], 2), [[Ia, o.value || i(n)]]), vr(t.$slots, "result", { activity: n })], 64))), 128))], 8, tS)]));
	}
}), rS = { class: "message assistant w-full self-start" }, iS = ["innerHTML"], aS = /* @__PURE__ */ H({
	__name: "AssistantTextBlock",
	props: {
		block: {},
		profile: {},
		sessionId: {},
		excludedPaths: {},
		validatedFiles: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = X(() => um(n.block.content)), i = X(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of r.value.files) {
				let r = n.validatedFiles?.[t.path], i = t.automatic ? r : r ? {
					...t,
					path: r.path
				} : t;
				i && !e.has(i.path) && !n.excludedPaths?.includes(i.path) && e.set(i.path, i);
			}
			return [...e.values()];
		}), a = t;
		return (t, n) => (G(), K("article", rS, [
			q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: B(Ex)(r.value.text)
			}, null, 8, iS),
			(G(!0), K(W, null, U(i.value, (t) => (G(), Hi(wx, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[0] ||= (e) => a("imageLoad")
			}, null, 8, ["file", "profile"]))), 128)),
			(G(!0), K(W, null, U(e.block.images, (t) => (G(), Hi(wx, {
				key: t,
				file: {
					path: t,
					name: "Attached image.png",
					type: "image/png",
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[1] ||= (e) => a("imageLoad")
			}, null, 8, ["file", "profile"]))), 128))
		]));
	}
}), oS = { class: "assistant-turn grid min-w-0 gap-1" }, sS = {
	key: 1,
	class: "response-actions flex items-center gap-1 text-[#a3a3a3]"
}, cS = ["disabled"], lS = {
	role: "status",
	class: "text-xs"
}, uS = /* @__PURE__ */ H({
	__name: "AssistantTurn",
	props: {
		entry: {},
		branchDisabled: { type: Boolean },
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad", "branch"],
	setup(e, { emit: t }) {
		let n = e, r = /* @__PURE__ */ z({}), i = X(() => {
			let e = /* @__PURE__ */ new Map(), t = !1;
			for (let r of n.entry.blocks) if (r.kind === "text") for (let n of um(r.content).files) t ||= !!n.automatic, e.set(n.path, n);
			return t ? [...e.values()].filter((e) => lm(e.path, !0)) : [];
		}), a = "";
		V(() => JSON.stringify([
			n.profile,
			n.sessionId,
			n.entry.key,
			i.value.map((e) => e.path)
		]), async (e, t, o) => {
			let s = JSON.stringify([
				n.profile,
				n.sessionId,
				n.entry.key
			]), c = s === a ? r.value : {};
			a = s, r.value = Object.fromEntries(i.value.filter((e) => c[e.path]).map((e) => [e.path, c[e.path]]));
			let l = new AbortController();
			o(() => l.abort());
			let u = await Promise.all(i.value.filter((e) => !c[e.path]).map(async (e) => {
				try {
					let t = await fetch(om({
						...e,
						sessionId: n.sessionId
					}, n.profile, !0), {
						method: "HEAD",
						credentials: "same-origin",
						redirect: "error",
						signal: l.signal
					});
					if (!t.ok) return;
					let r = t.headers.get("Content-Location");
					if (!r?.startsWith("/api/plugins/chathermes/files/download?")) return;
					let i = new URLSearchParams(r.split("?")[1]).get("path");
					return i ? [e.path, {
						...e,
						path: i,
						name: i.split("/").at(-1) || e.name,
						type: t.headers.get("Content-Type") || e.type
					}] : void 0;
				} catch {
					return;
				}
			}));
			l.signal.aborted || (r.value = {
				...r.value,
				...Object.fromEntries(u.filter((e) => !!e))
			});
		}, { immediate: !0 });
		let o = X(() => n.entry.blocks.flatMap((e) => e.kind === "text" ? um(e.content).files.filter((e) => !e.automatic || !!r.value[e.path]).map((e) => r.value[e.path]?.path || e.path) : [])), s = X(() => {
			let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Map();
			for (let i of n.entry.blocks) i.kind === "text" && (t.set(i.id, [...e]), um(i.content).files.forEach((t) => {
				if (t.automatic && !r.value[t.path]) return;
				e.add(t.path);
				let n = r.value[t.path]?.path;
				n && e.add(n);
			}));
			return t;
		}), c = X(() => Ax(n.entry.blocks)), l = X(() => {
			let e = new Set(o.value), t = /* @__PURE__ */ new Map();
			for (let r of n.entry.blocks) r.kind === "tool" && t.set(r.id, dm(r).filter((t) => !e.has(t.path) && (e.add(t.path), !0)));
			return t;
		}), u = (e) => l.value.get(e.id) || [], d = t, f = /* @__PURE__ */ z(""), p = X(() => n.entry.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("\n\n"));
		async function m() {
			try {
				await navigator.clipboard.writeText(p.value), f.value = "Copied";
			} catch {
				f.value = "Could not copy. Select the response text to copy it.";
			}
		}
		return (t, n) => (G(), K("div", oS, [
			(G(!0), K(W, null, U(c.value, (t) => (G(), K(W, { key: t.id }, [t.kind === "tools" ? (G(), Hi(nS, {
				key: 0,
				activities: t.activities,
				working: !!e.entry.working,
				"approval-pending": e.entry.approvalPending
			}, {
				result: An(({ activity: t }) => [(G(!0), K(W, null, U(u(t), (t) => (G(), Hi(wx, {
					key: t.path,
					file: {
						...t,
						sessionId: e.sessionId
					},
					profile: e.profile,
					onImageLoad: n[0] ||= (e) => d("imageLoad")
				}, null, 8, ["file", "profile"]))), 128))]),
				_: 1
			}, 8, [
				"activities",
				"working",
				"approval-pending"
			])) : (G(), Hi(aS, {
				key: 1,
				block: t.block,
				"excluded-paths": s.value.get(t.block.id),
				"validated-files": r.value,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: n[1] ||= (e) => d("imageLoad")
			}, null, 8, [
				"block",
				"excluded-paths",
				"validated-files",
				"profile",
				"session-id"
			]))], 64))), 128)),
			e.entry.working && !c.value.some((e) => e.kind === "tools") ? (G(), Hi(nS, {
				key: 0,
				activities: [],
				working: !0,
				"approval-pending": e.entry.approvalPending
			}, null, 8, ["approval-pending"])) : Y("v-if", !0),
			vr(t.$slots, "request"),
			!e.entry.working && p.value.trim() ? (G(), K("div", sS, [
				q("button", {
					type: "button",
					"aria-label": "Copy response",
					title: "Copy response",
					class: "flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-white",
					onPointerdown: n[2] ||= Oo(() => {}, ["prevent"]),
					onClick: m
				}, [...n[5] ||= [q("svg", {
					"aria-hidden": "true",
					viewBox: "0 0 24 24",
					class: "size-4",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.6"
				}, [q("rect", {
					x: "8",
					y: "8",
					width: "12",
					height: "13",
					rx: "2"
				}), q("path", { d: "M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" })], -1)]], 32),
				e.entry.responseId ? (G(), K("button", {
					key: 0,
					type: "button",
					"aria-label": "Branch in new chat",
					title: "Branch in new chat",
					disabled: e.branchDisabled,
					class: "flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-white",
					onPointerdown: n[3] ||= Oo(() => {}, ["prevent"]),
					onClick: n[4] ||= (t) => d("branch", e.entry.responseId)
				}, [...n[6] ||= [Zi("<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" class=\"size-4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><circle cx=\"6\" cy=\"5\" r=\"2\"></circle><circle cx=\"6\" cy=\"19\" r=\"2\"></circle><circle cx=\"18\" cy=\"5\" r=\"2\"></circle><path d=\"M6 7v10m0-4h5a7 7 0 0 0 7-6\"></path></svg>", 1)]], 40, cS)) : Y("v-if", !0),
				q("span", lS, L(f.value), 1)
			])) : Y("v-if", !0)
		]));
	}
}), dS = { class: "relative flex min-h-0 w-full flex-1" }, fS = {
	key: 0,
	class: "text-center text-sm text-[#a3a3a3]"
}, pS = ["disabled"], mS = {
	key: 0,
	role: "status"
}, hS = {
	key: 1,
	class: "muted text-sm text-[#a3a3a3]"
}, gS = {
	key: 2,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, _S = {
	key: 0,
	"data-compaction": "",
	class: "flex items-center gap-3 text-xs text-[#a3a3a3]",
	role: "separator",
	"aria-label": "Context compacted"
}, vS = {
	key: 2,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, yS = { class: "system-notices" }, bS = { class: "cursor-pointer select-none" }, xS = { class: "mt-2 whitespace-pre-wrap break-words" }, SS = {
	key: 3,
	class: "assistant-turn",
	"data-chat-message": "",
	tabindex: "-1"
}, CS = {
	key: 4,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, wS = {
	key: 6,
	class: "message assistant w-full self-start",
	"data-chat-message": "",
	tabindex: "-1"
}, TS = ["innerHTML"], ES = /* @__PURE__ */ H({
	__name: "ChatTranscript",
	props: {
		hasEarlier: { type: Boolean },
		loadingEarlier: { type: Boolean },
		earlierError: {},
		branchDisabled: { type: Boolean },
		responseTargets: {},
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
	emits: ["branch", "earlier"],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = X(() => o.value), o = X(() => jm(r)), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(), l = /* @__PURE__ */ z(r.followInitially !== !1), u = /* @__PURE__ */ z(!0), d;
		function f() {
			let e = s.value;
			if (!e || !l.value || document.activeElement !== e && document.activeElement !== d) return;
			let t = c.value?.querySelectorAll("[data-chat-message]"), n = t?.[t.length - 1] || e;
			document.activeElement !== n && n.focus({ preventScroll: !0 }), d = n;
		}
		function p() {
			s.value?.focus({ preventScroll: !0 }), x(), vn(() => {
				S();
			});
		}
		t({ focusLatestMessage: p });
		let m = !r.messages.length && r.followInitially !== !1, h;
		function g() {
			let e = s.value;
			u.value = !e || e.scrollHeight - e.scrollTop - e.clientHeight <= 2;
		}
		let _;
		function v() {
			let e = s.value;
			if (!e) return;
			let t = e.getBoundingClientRect().top, n = [...e.querySelectorAll("[data-chat-message], [data-compaction]")].find((e) => e.getBoundingClientRect().bottom > t);
			_ = n ? {
				element: n,
				top: n.getBoundingClientRect().top,
				scrollTop: e.scrollTop
			} : void 0;
		}
		function y() {
			!r.loadingEarlier && r.hasEarlier && (l.value = !1, v(), i("earlier"));
		}
		function b() {
			g(), !m && !r.loadingEarlier && (l.value = u.value), v(), s.value && s.value.scrollTop < 160 && !r.earlierError && y();
		}
		function x() {
			let e = s.value;
			e && (e.scrollTop = e.scrollHeight, l.value = !0, g());
		}
		function S() {
			if (l.value) x(), f();
			else {
				if (_?.element.isConnected && s.value) {
					let e = _.element.getBoundingClientRect().top - _.top;
					Math.abs(e) > .5 && (s.value.scrollTop += e);
				}
				g(), v();
			}
		}
		async function C() {
			await vn(), S();
		}
		return sr(() => {
			S(), typeof ResizeObserver < "u" && (h = new ResizeObserver(S), s.value && h.observe(s.value), c.value && h.observe(c.value));
		}), ur(() => h?.disconnect()), V(() => [
			r.messages,
			r.hasEarlier,
			r.loadingEarlier
		], () => {
			!l.value && (!_?.element.isConnected || Math.abs((s.value?.scrollTop || 0) - _.scrollTop) > .5) && v();
		}, { flush: "pre" }), V(() => r.sessionId, () => {
			_ = void 0, l.value = r.followInitially !== !1, m = !0;
		}), V(() => [
			r.loading,
			r.hasEarlier,
			r.loadingEarlier,
			r.messages,
			r.draft,
			r.blocks || r.progress,
			r.working,
			r.thinking,
			r.approvalPending
		], () => {
			!r.messages.length && !r.draft && !r.working && (m = r.followInitially !== !1), !r.loading && (m && r.messages.length && (l.value = !0, m = !1), S());
		}, {
			deep: !0,
			flush: "post"
		}), (t, n) => (G(), K("div", dS, [q("div", {
			ref_key: "transcript",
			ref: s,
			"data-drawer-swipe": "",
			style: { "overflow-anchor": "none" },
			class: "transcript flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 py-6 text-white min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9",
			tabindex: "-1",
			role: "log",
			"aria-label": "Conversation",
			"aria-live": "polite",
			onScroll: b,
			onToggleCapture: C
		}, [q("div", {
			ref_key: "content",
			ref: c,
			class: "flex min-h-full shrink-0 flex-col gap-7"
		}, [
			e.hasEarlier || e.loadingEarlier || e.earlierError ? (G(), K("div", fS, [q("button", {
				type: "button",
				disabled: e.loadingEarlier,
				class: "rounded-full px-4 py-2 hover:bg-[#303030] disabled:opacity-60",
				onClick: y
			}, L(e.loadingEarlier ? "Loading earlier messages…" : "Show earlier messages"), 9, pS), e.earlierError ? (G(), K("p", mS, L(e.earlierError), 1)) : Y("v-if", !0)])) : Y("v-if", !0),
			e.loading ? (G(), K("div", hS, "Loading conversation…")) : !a.value.length && !e.draft && !e.thinking ? (G(), K("div", gS, [...n[1] ||= [q("div", { class: "m-auto text-center" }, [q("h2", { class: "text-2xl font-medium" }, "What can I help with?"), q("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, " Ask Hermes a question or continue a conversation. ")], -1)]])) : Y("v-if", !0),
			(G(!0), K(W, null, U(o.value, (r) => (G(), K(W, { key: r.key }, [r.kind === "compaction" ? (G(), K("div", _S, [...n[2] ||= [
				q("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1),
				q("span", null, "Context compacted", -1),
				q("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1)
			]])) : r.kind === "user" ? (G(), Hi(kx, {
				key: 1,
				"data-chat-message": "",
				tabindex: "-1",
				message: r.message,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: C
			}, null, 8, [
				"message",
				"profile",
				"session-id"
			])) : r.kind === "status" ? (G(), K("div", vS, [q("details", yS, [q("summary", bS, L(r.text), 1), q("p", xS, L(r.content), 1)])])) : (G(), Hi(uS, {
				key: 3,
				"data-chat-message": "",
				tabindex: "-1",
				entry: {
					...r,
					responseId: r.responseId || e.responseTargets?.[r.key]
				},
				"branch-disabled": e.branchDisabled,
				onBranch: n[0] ||= (e) => i("branch", e),
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: C
			}, _r({ _: 2 }, [r.working ? {
				name: "request",
				fn: An(() => [vr(t.$slots, "request")]),
				key: "0"
			} : void 0]), 1032, [
				"entry",
				"branch-disabled",
				"profile",
				"session-id"
			]))], 64))), 128)),
			e.working && !o.value.some((e) => e.kind === "turn" && e.working) ? (G(), K("div", SS, [qi(nS, {
				activities: e.progress,
				working: !0,
				"approval-pending": e.approvalPending
			}, null, 8, ["activities", "approval-pending"])])) : Y("v-if", !0),
			e.statusLabel && !e.working ? (G(), K("div", CS, L(e.statusLabel), 1)) : Y("v-if", !0),
			o.value.some((e) => e.kind === "turn" && e.working) ? Y("v-if", !0) : vr(t.$slots, "request", {}, void 0, void 0, 5),
			e.draft && !e.blocks?.length ? (G(), K("article", wS, [q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: B(Ex)(e.draft)
			}, null, 8, TS)])) : Y("v-if", !0)
		], 512)], 544), !u.value && !e.home && !e.loading ? (G(), K("button", {
			key: 0,
			type: "button",
			class: "absolute bottom-5 left-1/2 z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#424242] bg-[#303030] text-white shadow-xl hover:bg-[#424242] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
			"aria-label": "Scroll to latest message",
			title: "Scroll to latest message",
			onClick: x
		}, [...n[3] ||= [q("svg", {
			"aria-hidden": "true",
			viewBox: "0 0 24 24",
			class: "size-5",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2"
		}, [q("path", { d: "M12 5v14m-7-7 7 7 7-7" })], -1)]])) : Y("v-if", !0)]));
	}
}), DS = { class: "approval-choices grid grid-cols-1 gap-2 my-3" }, OS = ["disabled", "onClick"], kS = /* @__PURE__ */ H({
	__name: "ApprovalRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(!1);
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
		return (t, i) => (G(), K(W, null, [
			q("p", null, "Approval required" + L(e.request.params.command ? ": " + e.request.params.command : ""), 1),
			Y(" The request can outlive its parent turn (for example, a background child). "),
			q("div", DS, [(G(!0), K(W, null, U(e.request.params.choices, (t) => (G(), K("button", {
				key: t,
				class: fe(["w-full rounded-xl bg-[#303030] px-[14px] py-[10px] text-left text-base leading-[1.5] text-white whitespace-normal break-words disabled:opacity-55", t === "deny" ? "text-red-500" : ""]),
				disabled: e.disabled || n.value,
				onMousedown: i[0] ||= Oo(() => {}, ["prevent"]),
				onClick: (e) => r(t)
			}, L(t === "once" ? "Allow once" : t === "deny" ? "Deny" : t === "session" ? "Allow for session" : "Always allow"), 43, OS))), 128))])
		], 64));
	}
}), AS = { class: "clarification-card" }, jS = ["disabled"], MS = {
	key: 0,
	class: "clarification-choices"
}, NS = ["aria-pressed", "onClick"], PS = { class: "clarification-other" }, FS = ["onUpdate:modelValue", "aria-label"], IS = ["disabled"], LS = /*#__PURE__*/ ev(/* @__PURE__ */ H({
	__name: "ClarificationCard",
	props: {
		questions: {},
		disabled: { type: Boolean }
	},
	emits: ["answer"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z({}), a = /* @__PURE__ */ z({});
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
		return (t, n) => (G(), K("div", AS, [(G(!0), K(W, null, U(e.questions, (t) => (G(), K("form", {
			key: t.qid,
			onSubmit: Oo(c, ["prevent"])
		}, [q("fieldset", { disabled: e.disabled }, [
			q("legend", null, L(t.question), 1),
			t.choices?.length ? (G(), K("div", MS, [(G(!0), K(W, null, U(t.choices, (e) => (G(), K("button", {
				key: e,
				type: "button",
				"aria-pressed": t.multi_select ? i.value[t.qid]?.includes(e) ?? !1 : void 0,
				onClick: (n) => s(t, e)
			}, L(e), 9, NS))), 128))])) : Y("v-if", !0),
			q("div", PS, [jn(q("input", {
				"onUpdate:modelValue": (e) => a.value[t.qid] = e,
				placeholder: "Other response",
				"aria-label": t.question + " — Other response"
			}, null, 8, FS), [[vo, a.value[t.qid]]]), q("button", {
				type: "submit",
				disabled: e.disabled || !Object.keys(o()).length
			}, "Send", 8, IS)])
		], 8, jS)], 32))), 128))]));
	}
}), [["__scopeId", "data-v-247de639"]]), RS = /* @__PURE__ */ H({
	__name: "ClarificationRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(!1);
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
		return (t, i) => (G(), Hi(LS, {
			questions: e.request.params.questions,
			disabled: e.disabled || n.value,
			onAnswer: r
		}, null, 8, ["questions", "disabled"]));
	}
}), zS = { class: "block my-3" }, BS = ["aria-label", "disabled"], VS = ["disabled"], HS = /* @__PURE__ */ H({
	__name: "SecretRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(""), r = /* @__PURE__ */ z(!1);
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
		return (t, a) => (G(), K(W, null, [q("p", null, L(e.request.params.prompt), 1), q("form", { onSubmit: Oo(i, ["prevent"]) }, [q("label", zS, [J(L(e.request.params.env_var) + " ", 1), jn(q("input", {
			"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
			type: "password",
			autocomplete: "off",
			"aria-label": e.request.params.prompt || "Secret",
			disabled: e.disabled || r.value,
			class: "block min-w-0 w-full rounded-lg bg-[#303030] p-2 text-base"
		}, null, 8, BS), [[vo, n.value]])]), q("button", {
			type: "submit",
			disabled: e.disabled || r.value || !n.value,
			class: "rounded-lg bg-[#303030] p-2 text-base"
		}, " Submit secret ", 8, VS)], 32)], 64));
	}
}), US = { key: 3 }, WS = /*#__PURE__*/ ev(/* @__PURE__ */ H({
	__name: "LiveRequest",
	setup(e) {
		let { view: t, scope: n, actions: r } = uh(), { request: i, requestDisabled: a } = t, { profile: o, session: s } = n, c = r.answerFor;
		return (e, t) => B(i) ? (G(), K("div", {
			key: JSON.stringify([
				B(o),
				B(s),
				B(i).id
			]),
			class: "live-request notice px-5 py-3 text-sm",
			role: "status"
		}, [B(i).kind === "approval" ? (G(), Hi(kS, {
			key: 0,
			request: B(i),
			disabled: B(a),
			answer: B(c)(B(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : B(i).kind === "clarify" ? (G(), Hi(RS, {
			key: 1,
			request: B(i),
			disabled: B(a),
			answer: B(c)(B(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : B(i).kind === "secret" ? (G(), Hi(HS, {
			key: 2,
			request: B(i),
			disabled: B(a),
			answer: B(c)(B(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : (G(), K("p", US, "This request cannot be displayed. Open it in Hermes."))])) : Y("v-if", !0);
	}
}), [["__scopeId", "data-v-0e055492"]]), GS = /* @__PURE__ */ H({
	__name: "ChatConversation",
	setup(e) {
		let { view: t, scope: n, actions: r } = uh(), { profile: i, session: a } = n, { messages: o, loading: s, busy: c, approvalPending: l, status: u } = t, d = /* @__PURE__ */ z(), f = Pn(dh);
		return sr(() => {
			f && (f.value = d.value);
		}), ur(() => {
			f && f.value === d.value && (f.value = void 0);
		}), (e, n) => (G(), Hi(ES, {
			ref_key: "transcript",
			ref: d,
			profile: B(i),
			"session-id": B(a),
			"has-earlier": B(t).hasEarlier.value,
			"loading-earlier": B(t).loadingEarlier.value,
			"earlier-error": B(t).earlierError.value,
			onEarlier: B(r).loadEarlier,
			messages: B(o),
			draft: "",
			loading: B(s),
			progress: [],
			thinking: B(c),
			working: B(c) || B(l),
			"approval-pending": B(l),
			home: !B(a),
			"status-label": B(u),
			"branch-disabled": B(t).branchDisabled.value,
			"response-targets": B(t).responseTargets.value,
			onBranch: B(r).branch
		}, {
			request: An(() => [qi(WS)]),
			_: 1
		}, 8, [
			"profile",
			"session-id",
			"has-earlier",
			"loading-earlier",
			"earlier-error",
			"onEarlier",
			"messages",
			"loading",
			"thinking",
			"working",
			"approval-pending",
			"home",
			"status-label",
			"branch-disabled",
			"response-targets",
			"onBranch"
		]));
	}
}), KS = /* @__PURE__ */ H({
	__name: "ChatPage",
	setup(e) {
		let { sessions: t, scope: n } = uh(), { projectId: r, selectedProject: i } = y_();
		return Mc(() => ({
			title: t.value.find((e) => e.id === n.session.value)?.title || "Conversation",
			subtitle: r.value ? i.value?.label : void 0
		})), (e, t) => (G(), Hi(GS));
	}
}), qS = /* @__PURE__ */ H({
	__name: "InboxPage",
	setup(e) {
		let { profile: t, inboxRevision: n, openInboxItem: r, refreshInbox: i } = c_(), a = kc(), o = Oc(), s = X({
			get: () => a.query.scope === "profile" ? "profile" : "all",
			set: (e) => {
				o.replace({ query: {
					...a.query,
					scope: e
				} });
			}
		});
		return (e, a) => (G(), Hi(Eb, {
			scope: s.value,
			"onUpdate:scope": a[0] ||= (e) => s.value = e,
			profile: B(t),
			revision: B(n),
			"open-item": B(r),
			onRefresh: B(i)
		}, null, 8, [
			"scope",
			"profile",
			"revision",
			"open-item",
			"onRefresh"
		]));
	}
}), JS = {
	class: "min-h-0 flex-1 overflow-y-auto px-5 py-6",
	"aria-label": "Artifacts"
}, YS = { class: "mx-auto max-w-[1100px]" }, XS = { class: "mb-5 flex items-center justify-between" }, ZS = ["disabled"], QS = {
	key: 0,
	role: "status",
	class: "text-sm text-[#b4b4b4]"
}, $S = {
	key: 1,
	role: "alert",
	class: "mb-4 text-sm text-red-200"
}, eC = {
	key: 2,
	class: "text-sm text-[#b4b4b4]"
}, tC = { class: "grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-4 [&>.artifact-card]:my-0" }, nC = { class: "border-t border-[#424242] px-3 py-2 text-xs text-[#b4b4b4]" }, rC = {
	key: 0,
	class: "mb-1 block truncate"
}, iC = { class: "flex min-w-0 items-center gap-3" }, aC = { class: "shrink-0" }, oC = ["title", "onClick"], sC = ["aria-label", "onClick"], cC = ["disabled"], lC = { key: 0 }, uC = { class: "mb-3 break-words" }, dC = { class: "flex justify-end gap-4" }, fC = ["disabled"], pC = ["disabled"], mC = /* @__PURE__ */ H({
	__name: "ArtifactBrowser",
	props: {
		profile: {},
		sessions: {},
		projects: {},
		project: {}
	},
	emits: ["openSession"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z([]), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z();
		V(s, async (e) => {
			await vn(), e ? l.value?.showModal() : l.value?.close();
		});
		let u = /* @__PURE__ */ z(null), d;
		async function f(e = !1) {
			d?.abort();
			let t = d = new AbortController();
			a.value = !0, e || (i.value = [], u.value = null), o.value = "", s.value = void 0;
			try {
				let r = await Q.artifacts(n.profile, n.project?.id, e && u.value || void 0, t.signal);
				if (t.signal.aborted) return;
				let a = e ? [...i.value, ...r.files] : r.files;
				i.value = a.filter((e, t) => a.findIndex((t) => t.sessionId === e.sessionId && t.path === e.path) === t), u.value = r.nextCursor;
			} catch {
				t.signal.aborted || (o.value = "Could not load artifacts.");
			} finally {
				d === t && (a.value = !1);
			}
		}
		async function p() {
			let e = s.value;
			if (!e?.sessionId || c.value) return;
			let t = d;
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
				if (t !== d) return;
				i.value = i.value.filter((t) => t.path !== e.path), s.value = void 0;
			} catch {
				t === d && (o.value = "Hermes could not delete this file. It may be outside the managed files area or deletion may be unsupported.");
			} finally {
				c.value = !1;
			}
		}
		return V([() => n.profile, () => n.project?.id], () => f(), { immediate: !0 }), ur(() => d?.abort()), (t, n) => (G(), K("section", JS, [q("div", YS, [
			q("div", XS, [n[5] ||= q("h2", { class: "text-xl font-medium" }, "Artifacts", -1), q("button", {
				class: "text-sm underline",
				disabled: a.value,
				onClick: n[0] ||= (e) => f()
			}, "Refresh", 8, ZS)]),
			a.value ? (G(), K("p", QS, "Loading artifacts…")) : Y("v-if", !0),
			o.value ? (G(), K("p", $S, L(o.value), 1)) : Y("v-if", !0),
			!a.value && !i.value.length ? (G(), K("p", eC, "No artifacts found.")) : Y("v-if", !0),
			q("div", tC, [(G(!0), K(W, null, U(i.value, (t) => (G(), Hi(wx, {
				key: `${t.sessionId}:${t.path}`,
				file: t,
				profile: e.profile
			}, {
				footer: An(() => [q("div", nC, [t.projectTitle ? (G(), K("span", rC, L(t.projectTitle), 1)) : Y("v-if", !0), q("div", iC, [
					q("span", aC, L(t.direction === "uploaded" ? "Uploaded" : "Generated"), 1),
					q("button", {
						type: "button",
						class: "min-w-0 flex-1 truncate py-2 text-left underline",
						title: t.sessionTitle,
						onClick: (e) => r("openSession", t.sessionId)
					}, L(t.sessionTitle), 9, oC),
					/^(https?:|data:)|^\/api\/plugins\/chathermes\/artifact-images\//.test(t.path) ? Y("v-if", !0) : (G(), K("button", {
						key: 0,
						type: "button",
						class: "shrink-0 py-2 hover:text-white",
						"aria-label": `Delete ${t.name}`,
						onClick: (e) => s.value = t
					}, " Delete ", 8, sC))
				])])]),
				_: 2
			}, 1032, ["file", "profile"]))), 128))]),
			u.value ? (G(), K("button", {
				key: 3,
				type: "button",
				class: "my-6 rounded-full border border-[#555] px-5 py-2 text-sm",
				disabled: a.value,
				onClick: n[1] ||= (e) => f(!0)
			}, L(a.value ? "Loading…" : "Load More"), 9, cC)) : Y("v-if", !0),
			q("dialog", {
				ref_key: "confirmation",
				ref: l,
				class: "fixed m-auto w-[min(380px,94vw)] rounded-2xl bg-[#303030] p-5 text-white backdrop:bg-black/80",
				"aria-label": "Delete artifact",
				onCancel: n[3] ||= (e) => c.value && e.preventDefault(),
				onClose: n[4] ||= (e) => s.value = void 0
			}, [s.value ? (G(), K("div", lC, [
				q("h3", uC, "Delete " + L(s.value.name) + " from Hermes?", 1),
				n[6] ||= q("p", { class: "mb-5 text-sm text-[#b4b4b4]" }, " This removes the server file. References in conversation history remain. ", -1),
				q("div", dC, [q("button", {
					autofocus: "",
					disabled: c.value,
					onClick: n[2] ||= (e) => s.value = void 0
				}, "Cancel", 8, fC), q("button", {
					disabled: c.value,
					onClick: p
				}, L(c.value ? "Deleting…" : "Delete file"), 9, pC)])
			])) : Y("v-if", !0)], 544)
		])]));
	}
}), hC = /* @__PURE__ */ H({
	__name: "ArtifactsPage",
	setup(e) {
		let { profile: t, projects: n, recentSession: r } = d_();
		return (e, i) => (G(), Hi(mC, {
			profile: B(t),
			projects: B(n),
			onOpenSession: B(r)
		}, null, 8, [
			"profile",
			"projects",
			"onOpenSession"
		]));
	}
}), gC = {
	class: "projects-page page-content",
	"aria-label": "Projects"
}, _C = { class: "page-heading" }, vC = ["disabled"], yC = {
	key: 0,
	class: "project-muted"
}, bC = { class: "project-actions" }, xC = ["disabled"], SC = ["disabled"], CC = {
	key: 2,
	role: "alert",
	class: "project-error"
}, wC = {
	key: 3,
	role: "status",
	class: "project-muted"
}, TC = {
	key: 4,
	class: "project-muted"
}, EC = {
	class: "project-list",
	"aria-label": "Project list"
}, DC = ["aria-label", "onClick"], OC = /* @__PURE__ */ H({
	__name: "ProjectList",
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
		let n = e, r = t, i = X(() => n.projects.filter((e) => !e.isNoProject && !!e.archived === n.archived)), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z("");
		function c() {
			o.value.trim() && r("manage", "create", {
				name: o.value.trim(),
				...s.value.trim() ? { primary_path: s.value.trim() } : {}
			});
		}
		return (t, n) => (G(), K("section", gC, [
			q("div", _C, [n[5] ||= q("h2", null, "Projects", -1), e.archived ? Y("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: n[0] ||= (e) => a.value = !a.value
			}, " New project ", 8, vC))]),
			e.archived ? (G(), K("p", yC, "Archived projects")) : Y("v-if", !0),
			a.value && !e.archived ? (G(), K("form", {
				key: 1,
				class: "project-form",
				onSubmit: Oo(c, ["prevent"])
			}, [
				q("label", null, [n[6] ||= J("Project name", -1), jn(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					required: "",
					maxlength: "160",
					autofocus: ""
				}, null, 512), [[vo, o.value]])]),
				q("label", null, [n[7] ||= J("Folder (optional)", -1), jn(q("input", {
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					placeholder: "/path/on/hermes/server"
				}, null, 512), [[vo, s.value]])]),
				q("div", bC, [q("button", {
					class: "project-button",
					disabled: e.busy || e.offline || !o.value.trim()
				}, " Create project", 8, xC), q("button", {
					type: "button",
					class: "project-button",
					disabled: e.busy,
					onClick: n[3] ||= (e) => a.value = !1
				}, " Cancel ", 8, SC)])
			], 32)) : Y("v-if", !0),
			e.error ? (G(), K("p", CC, [J(L(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[4] ||= (e) => r("retry")
			}, "Retry Projects")])) : Y("v-if", !0),
			e.loading ? (G(), K("p", wC, "Loading Projects…")) : i.value.length ? Y("v-if", !0) : (G(), K("p", TC, L(e.archived ? "No archived projects." : "No projects yet."), 1)),
			q("nav", EC, [(G(!0), K(W, null, U(i.value, (e) => (G(), K("button", {
				key: e.id,
				"aria-label": e.label,
				onClick: (t) => r("select", e.id)
			}, [
				n[8] ||= q("svg", {
					width: "24",
					height: "24",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [q("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1),
				q("span", null, [q("strong", null, L(e.label), 1), q("small", null, L(e.archived ? "Archived" : e.isAuto ? "Discovered workspace" : `${e.sessionCount} ${e.sessionCount === 1 ? "chat" : "chats"}`), 1)]),
				n[9] ||= q("span", { "aria-hidden": "true" }, "›", -1)
			], 8, DC))), 128))])
		]));
	}
}), kC = /* @__PURE__ */ H({
	__name: "ProjectsPage",
	setup(e) {
		let { projects: t, hideAutomaticProjects: n, projectsLoading: r, projectsError: i, manageError: a, projectBusy: o, offline: s, chooseProject: c, loadProjects: l, manageProject: u } = y_(), d = kc(), f = X(() => d.query.archived === "1"), p = X(() => t.value.filter((e) => !n.value || !e.isAuto));
		return (e, t) => (G(), Hi(OC, {
			projects: p.value,
			archived: f.value,
			loading: B(r),
			error: B(i) || B(a),
			busy: B(o),
			offline: B(s),
			onSelect: B(c),
			onRetry: B(l),
			onManage: B(u)
		}, null, 8, [
			"projects",
			"archived",
			"loading",
			"error",
			"busy",
			"offline",
			"onSelect",
			"onRetry",
			"onManage"
		]));
	}
}), AC = {
	class: "project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10",
	"aria-label": "Selected Project"
}, jC = { class: "project-home-content" }, MC = {
	key: 0,
	role: "status"
}, NC = {
	key: 1,
	class: "mb-4 text-[#fecaca]",
	role: "alert"
}, PC = {
	class: "mb-5 flex gap-5 text-sm",
	"aria-label": "Project view"
}, FC = ["aria-pressed"], IC = ["aria-pressed"], LC = /* @__PURE__ */ H({
	__name: "ProjectLayout",
	setup(e) {
		let { selectedProject: t, projectLoading: n, projectError: r, loadProject: i } = y_(), a = kc(), o = Oc();
		return (e, s) => (G(), K("section", AC, [q("div", jC, [
			B(n) ? (G(), K("p", MC, "Loading Project…")) : Y("v-if", !0),
			B(r) ? (G(), K("p", NC, [J(L(B(r)) + " ", 1), q("button", {
				class: "underline",
				onClick: s[0] ||= (...e) => B(i) && B(i)(...e)
			}, "Retry Project")])) : Y("v-if", !0),
			B(t) ? (G(), K(W, { key: 2 }, [q("nav", PC, [q("button", {
				"aria-pressed": B(a).name === "project",
				onClick: s[1] ||= (e) => B(o).push({
					name: "project",
					params: B(a).params,
					query: B(a).query
				})
			}, " Sessions / Chat ", 8, FC), q("button", {
				"aria-pressed": B(a).name === "project-artifacts",
				onClick: s[2] ||= (e) => B(o).push({
					name: "project-artifacts",
					params: B(a).params,
					query: B(a).query
				})
			}, " Artifacts ", 8, IC)]), vr(e.$slots, "default")], 64)) : Y("v-if", !0)
		])]));
	}
}), RC = ["disabled"], zC = {
	key: 0,
	class: "project-muted"
}, BC = { class: "mb-4 break-all text-sm text-[#a3a3a3]" }, VC = {
	key: 1,
	class: "text-sm text-[#b4b4b4]"
}, HC = {
	class: "project-chat-list",
	"aria-label": "Project chats"
}, UC = ["aria-label", "onClick"], WC = { class: "project-chat-title" }, GC = {
	key: 0,
	class: "project-chat-preview"
}, KC = /* @__PURE__ */ H({
	__name: "ProjectHomePage",
	setup(e) {
		let { selectedProject: t, visibleSessions: n, chooseSession: r, chooseProject: i, createSession: a } = y_();
		return Mc(() => ({
			title: "Projects",
			subtitle: t.value?.label
		})), (e, o) => (G(), Hi(LC, null, {
			default: An(() => [B(t) ? (G(), K(W, { key: 0 }, [
				q("button", {
					class: "project-back mb-4",
					disabled: B(t).archived,
					onClick: o[0] ||= (e) => B(a)()
				}, " New chat ", 8, RC),
				B(t).archived ? (G(), K("p", zC, "Archived project")) : Y("v-if", !0),
				q("p", BC, L(B(kl)(B(t)) ? "Workspace: " + B(kl)(B(t)) : B(t).isNoProject ? "No project workspace" : "No workspace configured"), 1),
				B(n).length ? Y("v-if", !0) : (G(), K("p", VC, "No conversations yet.")),
				q("nav", HC, [(G(!0), K(W, null, U(B(n), (e) => (G(), K("button", {
					key: e.id,
					class: "project-chat-row",
					"aria-label": e.title || "Untitled session",
					onClick: (t) => B(r)(e.id)
				}, [q("span", WC, L(e.title || "Untitled session"), 1), e.preview?.trim() ? (G(), K("span", GC, L(e.preview), 1)) : Y("v-if", !0)], 8, UC))), 128))]),
				q("button", {
					class: "project-back mt-5",
					onClick: o[1] ||= (e) => B(i)("")
				}, "Other chats")
			], 64)) : Y("v-if", !0)]),
			_: 1
		}));
	}
}), qC = /* @__PURE__ */ H({
	__name: "ProjectArtifactsPage",
	setup(e) {
		let { selectedProject: t, profile: n, visibleSessions: r, recentSession: i } = y_();
		return Mc(() => ({
			title: "Projects",
			subtitle: t.value?.label
		})), (e, a) => (G(), Hi(LC, null, {
			default: An(() => [B(t) ? (G(), Hi(mC, {
				key: 0,
				project: B(t),
				profile: B(n),
				sessions: B(r),
				onOpenSession: B(i)
			}, null, 8, [
				"project",
				"profile",
				"sessions",
				"onOpenSession"
			])) : Y("v-if", !0)]),
			_: 1
		}));
	}
}), JC = {
	key: 0,
	class: "project-settings"
}, YC = ["disabled"], XC = {
	key: 0,
	class: "project-error",
	role: "alert"
}, ZC = {
	key: 1,
	class: "project-muted",
	role: "status"
}, QC = ["disabled"], $C = { class: "project-field-row" }, ew = ["disabled"], tw = {
	key: 2,
	class: "project-muted"
}, nw = { class: "project-folders" }, rw = { class: "folder-path" }, iw = { key: 0 }, aw = { key: 1 }, ow = { class: "project-actions" }, sw = ["disabled", "onClick"], cw = [
	"disabled",
	"aria-label",
	"onClick"
], lw = ["disabled"], uw = { class: "project-checkbox" }, dw = ["disabled"], fw = { id: "project-confirm-text" }, pw = { class: "project-actions" }, mw = ["disabled"], hw = ["disabled"], gw = /* @__PURE__ */ H({
	__name: "ProjectSettings",
	props: {
		project: {},
		busy: { type: Boolean },
		offline: { type: Boolean },
		error: {}
	},
	emits: ["manage"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z(n.project.label), a = /* @__PURE__ */ z(n.project.description || ""), o = /* @__PURE__ */ z(n.project.icon || ""), s = /* @__PURE__ */ z(n.project.color || ""), c = /* @__PURE__ */ z(n.project.board_slug || ""), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(!0), f = /* @__PURE__ */ z(), p = /* @__PURE__ */ z(), m = /* @__PURE__ */ z();
		V(() => n.busy, (e, t) => {
			t && !e && !n.error && _();
		}), V(() => n.project.label, (e) => {
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
			}, await vn(), p.value?.focus();
		}
		function _() {
			f.value = void 0, m.value?.focus();
		}
		function v() {
			let e = f.value;
			e && h(e.action, e.fields);
		}
		return (t, n) => e.project.isAuto ? (G(), K("div", JC, [n[12] ||= q("p", { class: "project-muted" }, " Save this discovered workspace as a project to manage its name and folders. ", -1), q("button", {
			class: "project-button",
			disabled: e.busy || e.offline,
			onClick: n[0] ||= (t) => r("manage", "create", {
				name: e.project.label,
				primary_path: e.project.path || e.project.repos.find((e) => e.path)?.path || ""
			})
		}, " Save project ", 8, YC)])) : e.project.isNoProject ? Y("v-if", !0) : (G(), K("div", {
			key: 1,
			ref_key: "settings",
			ref: m,
			tabindex: "-1",
			class: "project-settings"
		}, [
			e.error ? (G(), K("p", XC, L(e.error), 1)) : Y("v-if", !0),
			e.busy ? (G(), K("p", ZC, "Saving project…")) : Y("v-if", !0),
			q("form", {
				class: "project-form",
				onSubmit: n[6] ||= Oo((e) => h("update", {
					name: i.value.trim(),
					description: a.value,
					icon: o.value,
					color: s.value,
					board_slug: c.value
				}), ["prevent"])
			}, [q("fieldset", { disabled: e.busy || e.offline }, [
				q("label", null, [n[13] ||= J("Project name", -1), jn(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					required: "",
					maxlength: "160"
				}, null, 512), [[vo, i.value]])]),
				q("label", null, [n[14] ||= J("Description", -1), jn(q("textarea", {
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					maxlength: "4096",
					rows: "2"
				}, null, 512), [[vo, a.value]])]),
				q("div", $C, [q("label", null, [n[15] ||= J("Icon", -1), jn(q("input", {
					"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
					maxlength: "64"
				}, null, 512), [[vo, o.value]])]), q("label", null, [n[16] ||= J("Color", -1), jn(q("input", {
					"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
					maxlength: "64",
					placeholder: "#94c9a5"
				}, null, 512), [[vo, s.value]])])]),
				q("label", null, [n[17] ||= J("Board slug (optional)", -1), jn(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					maxlength: "160"
				}, null, 512), [[vo, c.value]])]),
				q("button", {
					class: "project-button",
					disabled: !i.value.trim()
				}, "Save changes", 8, ew)
			], 8, QC)], 32),
			n[21] ||= q("h3", null, "Folders", -1),
			n[22] ||= q("p", { class: "project-muted" }, " The primary folder is used for new chats. Existing chats keep their workspace. ", -1),
			e.project.folders?.length ? Y("v-if", !0) : (G(), K("p", tw, "No folders configured.")),
			q("ul", nw, [(G(!0), K(W, null, U(e.project.folders, (t) => (G(), K("li", { key: t.path }, [q("span", rw, [
				J(L(t.label || t.path), 1),
				t.label ? (G(), K("small", iw, L(t.path), 1)) : Y("v-if", !0),
				t.is_primary ? (G(), K("small", aw, "Primary folder")) : Y("v-if", !0)
			]), q("div", ow, [t.is_primary ? Y("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: (e) => h("set_primary", { path: t.path })
			}, " Make primary", 8, sw)), q("button", {
				class: "project-button",
				disabled: e.busy || e.offline,
				"aria-label": `Remove folder ${t.path}`,
				onClick: (e) => g("remove_folder", { path: t.path }, `Remove ${t.path} from this project? The folder and existing chats will be kept.`)
			}, " Remove ", 8, cw)])]))), 128))]),
			q("form", {
				class: "project-form",
				onSubmit: n[10] ||= Oo((e) => h("add_folder", {
					path: l.value.trim(),
					label: u.value.trim(),
					is_primary: d.value
				}), ["prevent"])
			}, [q("fieldset", { disabled: e.busy || e.offline }, [
				q("label", null, [n[18] ||= J("Folder path", -1), jn(q("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					required: "",
					placeholder: "/path/on/hermes/server",
					maxlength: "4096"
				}, null, 512), [[vo, l.value]])]),
				q("label", null, [n[19] ||= J("Folder label (optional)", -1), jn(q("input", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					maxlength: "160"
				}, null, 512), [[vo, u.value]])]),
				q("label", uw, [jn(q("input", {
					"onUpdate:modelValue": n[9] ||= (e) => d.value = e,
					type: "checkbox"
				}, null, 512), [[yo, d.value]]), n[20] ||= J(" Use as primary folder", -1)]),
				q("button", {
					class: "project-button",
					disabled: !l.value.trim()
				}, "Add folder", 8, dw)
			], 8, lw)], 32),
			f.value ? (G(), K("div", {
				key: 3,
				class: "project-confirmation",
				role: "alertdialog",
				"aria-modal": "false",
				"aria-labelledby": "project-confirm-text",
				onKeydown: n[11] ||= Ao(Oo((t) => !e.busy && _(), ["prevent"]), ["esc"])
			}, [q("p", fw, L(f.value.text), 1), q("div", pw, [q("button", {
				ref_key: "cancelButton",
				ref: p,
				class: "project-button",
				disabled: e.busy,
				onClick: _
			}, " Cancel", 8, mw), q("button", {
				class: "project-button project-danger",
				disabled: e.busy || e.offline,
				onClick: v
			}, " Confirm removal ", 8, hw)])], 32)) : Y("v-if", !0)
		], 512));
	}
}), _w = {
	class: "page-content project-editor",
	"aria-label": "Edit project"
}, vw = {
	key: 0,
	role: "status"
}, yw = {
	key: 1,
	role: "alert"
}, bw = /* @__PURE__ */ H({
	__name: "ProjectSettingsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, projectBusy: i, offline: a, manageError: o, manageProject: s, chooseProject: c, projectLoading: l, projectError: u, loadProject: d } = y_();
		return Mc(() => ({
			title: "Projects",
			subtitle: r.value?.label
		})), (e, f) => (G(), K("section", _w, [
			q("button", {
				class: "project-back",
				onClick: f[0] ||= (e) => B(c)(B(n))
			}, " ← " + L(B(r)?.label || "Project"), 1),
			f[2] ||= q("h2", { class: "text-2xl font-semibold" }, "Edit project", -1),
			B(l) ? (G(), K("p", vw, "Loading Project…")) : Y("v-if", !0),
			B(u) ? (G(), K("p", yw, [J(L(B(u)) + " ", 1), q("button", { onClick: f[1] ||= (...e) => B(d) && B(d)(...e) }, "Retry Project")])) : Y("v-if", !0),
			B(r) ? (G(), Hi(gw, {
				key: JSON.stringify([B(t), B(r).id]),
				project: B(r),
				busy: B(i),
				offline: B(a),
				error: B(o),
				onManage: B(s)
			}, null, 8, [
				"project",
				"busy",
				"offline",
				"error",
				"onManage"
			])) : Y("v-if", !0)
		]));
	}
}), xw = {
	key: 0,
	role: "status"
}, Sw = {
	key: 1,
	role: "alert",
	class: "project-error"
}, Cw = ["disabled"], ww = { key: 2 }, Tw = { class: "project-muted" }, Ew = ["disabled"], Dw = {
	key: 3,
	role: "status",
	class: "project-muted"
}, Ow = ["disabled"], kw = /* @__PURE__ */ H({
	__name: "ProjectInstructions",
	props: {
		profile: {},
		projectId: {},
		offline: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(""), r = /* @__PURE__ */ z(""), i = /* @__PURE__ */ z(null), a = /* @__PURE__ */ z(!0), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(""), c = /* @__PURE__ */ z(!1), l = /* @__PURE__ */ z(!1), u = new AbortController(), d = !0;
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
					d && (s.value = e instanceof hl && e.status === 409 ? "Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading." : "Could not save instructions. Your draft is kept; try again.");
				} finally {
					d && (o.value = !1);
				}
			}
		}
		return sr(f), ur(() => {
			d = !1, u.abort();
		}), (t, i) => (G(), K("form", {
			class: "project-form instructions-form",
			onSubmit: Oo(p, ["prevent"])
		}, [
			i[3] ||= q("p", { class: "project-muted" }, "Custom instructions guide Hermes when it works in this project.", -1),
			a.value ? (G(), K("p", xw, "Loading instructions…")) : Y("v-if", !0),
			s.value ? (G(), K("p", Sw, [J(L(s.value) + " ", 1), q("button", {
				type: "button",
				class: "underline",
				disabled: a.value || o.value || e.offline,
				onClick: f
			}, " Reload instructions ", 8, Cw)])) : Y("v-if", !0),
			l.value ? (G(), K("label", ww, [
				i[2] ||= J("Instructions ", -1),
				q("span", Tw, L(r.value), 1),
				jn(q("textarea", {
					"onUpdate:modelValue": i[0] ||= (e) => n.value = e,
					rows: "14",
					disabled: a.value || o.value,
					onInput: i[1] ||= (e) => c.value = !1
				}, null, 40, Ew), [[vo, n.value]])
			])) : Y("v-if", !0),
			c.value ? (G(), K("p", Dw, "Instructions saved.")) : Y("v-if", !0),
			q("button", {
				class: "project-button justify-self-start",
				disabled: !l.value || a.value || o.value || e.offline
			}, L(o.value ? "Saving…" : "Save instructions"), 9, Ow)
		], 32));
	}
}), Aw = {
	class: "page-content project-editor",
	"aria-label": "Edit Instructions"
}, jw = {
	key: 0,
	role: "status"
}, Mw = {
	key: 1,
	role: "alert"
}, Nw = /* @__PURE__ */ H({
	__name: "ProjectInstructionsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, offline: i, chooseProject: a, projectLoading: o, projectError: s, loadProject: c } = y_();
		return Mc(() => ({
			title: "Projects",
			subtitle: r.value?.label
		})), (e, l) => (G(), K("section", Aw, [
			q("button", {
				class: "project-back",
				onClick: l[0] ||= (e) => B(a)(B(n))
			}, " ← " + L(B(r)?.label || "Project"), 1),
			l[2] ||= q("h2", { class: "text-2xl font-semibold" }, "Edit Instructions", -1),
			B(o) ? (G(), K("p", jw, "Loading Project…")) : Y("v-if", !0),
			B(s) ? (G(), K("p", Mw, [J(L(B(s)) + " ", 1), q("button", { onClick: l[1] ||= (...e) => B(c) && B(c)(...e) }, "Retry Project")])) : Y("v-if", !0),
			B(r) ? (G(), Hi(kw, {
				key: JSON.stringify([B(t), B(r).id]),
				profile: B(t),
				"project-id": B(r).id,
				offline: B(i)
			}, null, 8, [
				"profile",
				"project-id",
				"offline"
			])) : Y("v-if", !0)
		]));
	}
}), Pw = { class: "scheduled-heading" }, Fw = { class: "scheduled-heading-content" }, Iw = { class: "page-heading" }, Lw = {
	key: 0,
	class: "project-muted"
}, Rw = {
	key: 1,
	role: "status",
	class: "project-muted"
}, zw = {
	key: 2,
	role: "alert",
	class: "project-error"
}, Bw = /* @__PURE__ */ H({
	__name: "ScheduledHeading",
	props: {
		title: {},
		subtitle: {},
		loading: { type: Boolean },
		error: {}
	},
	emits: ["retry"],
	setup(e) {
		return (t, n) => (G(), K("div", Pw, [q("div", Fw, [
			q("div", Iw, [q("h2", null, L(e.title || "Scheduled"), 1)]),
			vr(t.$slots, "default"),
			e.subtitle ? (G(), K("p", Lw, L(e.subtitle), 1)) : Y("v-if", !0),
			e.loading ? (G(), K("p", Rw, "Loading scheduled history…")) : Y("v-if", !0),
			e.error ? (G(), K("p", zw, [J(L(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[0] ||= (e) => t.$emit("retry")
			}, "Retry")])) : Y("v-if", !0)
		])]));
	}
}), Vw = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, Hw = { class: "scheduled-filter" }, Uw = { class: "scheduled-content" }, Ww = {
	key: 0,
	class: "project-muted"
}, Gw = {
	class: "scheduled-list",
	"aria-label": "Scheduled jobs"
}, Kw = ["onClick"], qw = /* @__PURE__ */ H({
	__name: "ScheduledListPage",
	setup(e) {
		let t = kc(), n = Oc(), r = /* @__PURE__ */ z([]), i = X({
			get: () => ["paused", "completed"].includes(String(t.query.status)) ? String(t.query.status) : "active",
			set: (e) => {
				n.replace({ query: {
					...t.query,
					status: e
				} });
			}
		}), a = X(() => r.value.filter((e) => C_(e) === i.value)), { loading: o, error: s, retry: c } = E_(async (e, t) => {
			r.value = [];
			let n = await Q.scheduled(t, e);
			if (!Array.isArray(n.jobs)) throw Error("Invalid jobs");
			e.aborted || (r.value = n.jobs);
		});
		return (e, r) => (G(), K("section", Vw, [qi(Bw, {
			loading: B(o),
			error: B(s),
			onRetry: B(c)
		}, {
			default: An(() => [q("label", Hw, [r[2] ||= J("Show ", -1), jn(q("select", {
				"onUpdate:modelValue": r[0] ||= (e) => i.value = e,
				"aria-label": "Job status"
			}, [...r[1] ||= [
				q("option", { value: "active" }, "Active", -1),
				q("option", { value: "paused" }, "Paused", -1),
				q("option", { value: "completed" }, "Completed", -1)
			]], 512), [[xo, i.value]])])]),
			_: 1
		}, 8, [
			"loading",
			"error",
			"onRetry"
		]), q("div", Uw, [!B(o) && !B(s) && !a.value.length ? (G(), K("p", Ww, " No " + L(i.value) + " scheduled jobs. ", 1)) : Y("v-if", !0), q("nav", Gw, [(G(!0), K(W, null, U(a.value, (e) => (G(), K("button", {
			key: e.id,
			class: "scheduled-job-row",
			onClick: (r) => B(n).push({
				name: "scheduled-job",
				params: { jobId: e.id },
				query: B(t).query
			})
		}, [q("span", null, [
			q("strong", null, L(e.name || e.id), 1),
			q("small", null, L(e.schedule_display || "Scheduled job"), 1),
			q("small", null, L(B(T_)(e.last_run_at)), 1)
		]), r[3] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, Kw))), 128))])])]));
	}
}), Jw = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, Yw = { class: "scheduled-content" }, Xw = {
	key: 0,
	class: "project-muted"
}, Zw = {
	class: "scheduled-list",
	"aria-label": "Job runs"
}, Qw = ["onClick"], $w = ["disabled"], eT = /* @__PURE__ */ H({
	__name: "ScheduledJobPage",
	setup(e) {
		let t = kc(), n = Oc(), r = /* @__PURE__ */ z(), i = /* @__PURE__ */ z([]), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(0), s = !1, { loading: c, error: l, retry: u } = E_(async (e, t, n) => {
			let c = s;
			if (s = !1, !c) {
				r.value = void 0, i.value = [], o.value = 0, a.value = !1;
				let s = await D_(t, n, e);
				if (e.aborted) return;
				r.value = s;
			}
			let l = await Q.scheduledRuns(t, n, c ? o.value : 0, e);
			e.aborted || (i.value = c ? [...i.value, ...l.runs.filter((e) => !i.value.some((t) => t.id === e.id))] : l.runs, o.value = l.offset + l.runs.length, a.value = l.has_more);
		});
		function d() {
			s = !0, u();
		}
		return (e, o) => (G(), K("section", Jw, [qi(Bw, {
			title: r.value?.name || r.value?.id,
			subtitle: "Run history · newest first",
			loading: B(c),
			error: B(l),
			onRetry: B(u)
		}, null, 8, [
			"title",
			"loading",
			"error",
			"onRetry"
		]), q("div", Yw, [
			!B(c) && !B(l) && !i.value.length ? (G(), K("p", Xw, "No runs yet.")) : Y("v-if", !0),
			q("nav", Zw, [(G(!0), K(W, null, U(i.value, (e) => (G(), K("button", {
				key: e.id,
				onClick: (r) => B(n).push({
					name: "scheduled-run",
					params: {
						jobId: B(t).params.jobId,
						runId: e.id
					},
					query: B(t).query
				})
			}, [q("span", null, [
				q("strong", null, L(B(w_)(e.started_at)), 1),
				q("small", null, L(e.title || "Job run"), 1),
				q("small", null, L(e.end_reason || (e.source === "cron_output" ? "Saved output" : e.ended_at ? "Finished" : "In progress")), 1)
			]), o[0] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, Qw))), 128))]),
			a.value ? (G(), K("button", {
				key: 1,
				class: "project-button",
				disabled: B(c),
				onClick: d
			}, " Load older runs ", 8, $w)) : Y("v-if", !0)
		])]));
	}
}), tT = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, nT = {
	key: 1,
	class: "scheduled-content"
}, rT = {
	key: 0,
	class: "project-muted"
}, iT = {
	key: 1,
	class: "project-muted"
}, aT = /* @__PURE__ */ H({
	__name: "ScheduledRunPage",
	setup(e) {
		let t = kc(), n = /* @__PURE__ */ z(), r = /* @__PURE__ */ z(), i = E_(async (e, t, a, o) => {
			n.value = void 0, r.value = void 0;
			let s = await D_(t, a, e);
			if (e.aborted) return;
			n.value = s;
			let c = await Q.scheduledOutput(t, a, o, e);
			e.aborted || (r.value = c, i.sessionId.value = c.session_id);
		}), { loading: a, error: o, retry: s } = i, c = X(() => O_(r.value));
		return (e, i) => (G(), K("section", tT, [qi(Bw, {
			title: n.value?.name || n.value?.id,
			subtitle: r.value ? B(w_)(r.value.started_at || 0) : void 0,
			loading: B(a),
			error: B(o),
			onRetry: B(s)
		}, null, 8, [
			"title",
			"subtitle",
			"loading",
			"error",
			"onRetry"
		]), c.value.length ? (G(), Hi(ES, {
			key: String(B(t).params.runId),
			"follow-initially": !1,
			messages: c.value,
			draft: "",
			loading: !1,
			progress: []
		}, null, 8, ["messages"])) : (G(), K("div", nT, [r.value?.output_status === "unverified" ? (G(), K("p", rT, " Saved output or error diagnostics could not be safely separated from this run's private prompt. Inspect the original archive on the Hermes server. ")) : r.value ? (G(), K("p", iT, "No output was saved for this run.")) : Y("v-if", !0)]))]));
	}
}), oT = {
	class: "settings-page page-content",
	"aria-label": "Settings"
}, sT = { class: "settings-content" }, cT = { class: "settings-heading" }, lT = {
	class: "settings-group",
	"aria-labelledby": "settings-profile-heading"
}, uT = { class: "settings-row" }, dT = ["value"], fT = ["value"], pT = ["value"], mT = {
	class: "settings-group",
	"aria-labelledby": "settings-app-heading"
}, hT = { class: "settings-row settings-notifications" }, gT = { class: "wake-lock-setting" }, _T = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, vT = ["checked"], yT = {
	key: 0,
	class: "mt-1 text-sm"
}, bT = {
	key: 0,
	class: "settings-row settings-notifications"
}, xT = { class: "kanban-setting" }, ST = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, CT = ["checked", "disabled"], wT = {
	id: "kanban-description",
	role: "status"
}, TT = ["disabled"], ET = {
	class: "settings-group",
	"aria-labelledby": "settings-notifications-heading"
}, DT = { class: "settings-row settings-notifications" }, OT = {
	class: "push-setting",
	"aria-labelledby": "notifications-heading"
}, kT = {
	id: "notifications-heading",
	class: "text-sm font-medium text-white"
}, AT = ["disabled"], jT = ["disabled"], MT = {
	key: 1,
	class: "mt-1 text-sm text-[#dcae6e]",
	role: "status"
}, NT = {
	key: 2,
	class: "mt-1 text-sm"
}, PT = {
	key: 3,
	class: "mt-1 text-sm",
	role: "status"
}, FT = {
	key: 4,
	class: "mt-1 text-sm"
}, IT = {
	key: 5,
	class: "mt-1 text-sm"
}, LT = {
	key: 6,
	class: "mt-1 text-sm"
}, RT = /* @__PURE__ */ H({
	__name: "SettingsPanel",
	props: {
		kanban: {},
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
		let n = t, r = /* @__PURE__ */ z();
		return sr(() => r.value?.focus()), (t, i) => (G(), K("section", oT, [q("div", sT, [
			q("div", cT, [q("h2", {
				ref_key: "heading",
				ref: r,
				tabindex: "-1",
				class: "text-2xl font-semibold"
			}, "Settings", 512), q("button", {
				class: "settings-close",
				"aria-label": "Close settings",
				onClick: i[0] ||= (e) => n("close")
			}, "×")]),
			i[15] ||= q("h3", {
				id: "settings-profile-heading",
				class: "settings-section-title"
			}, "Profile", -1),
			q("div", lT, [q("div", uT, [i[8] ||= Zi("<svg class=\"settings-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><circle cx=\"12\" cy=\"9\" r=\"3\"></circle><path d=\"M6 19c0-6 12-6 12 0\"></path></svg><label for=\"settings-profile\">Active profile</label>", 2), q("select", {
				id: "settings-profile",
				value: e.profile,
				onChange: i[1] ||= (e) => n("profile", e.target.value)
			}, [
				i[7] ||= q("option", { value: "" }, "Default profile", -1),
				e.profile && !e.profiles.some((t) => t.name === e.profile) ? (G(), K("option", {
					key: 0,
					value: e.profile
				}, L(e.profile), 9, fT)) : Y("v-if", !0),
				(G(!0), K(W, null, U(e.profiles, (e) => (G(), K("option", {
					key: e.name,
					value: e.name
				}, L(e.name), 9, pT))), 128))
			], 40, dT)])]),
			i[16] ||= q("h3", {
				id: "settings-app-heading",
				class: "settings-section-title"
			}, "Global settings", -1),
			q("div", mT, [q("div", hT, [i[11] ||= q("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [q("rect", {
				x: "5",
				y: "3",
				width: "14",
				height: "18",
				rx: "2"
			}), q("path", { d: "M9 17h6" })], -1), q("div", gT, [
				i[10] ||= q("h3", {
					id: "wake-lock-heading",
					class: "text-sm font-medium text-white"
				}, "Keep Screen Awake", -1),
				q("label", _T, [q("input", {
					type: "checkbox",
					"aria-labelledby": "wake-lock-heading",
					checked: e.keepScreenAwake,
					onChange: i[2] ||= (e) => n("toggleWakeLock", e.target.checked)
				}, null, 40, vT), i[9] ||= J(" Prevent the display from sleeping while ChatHermes is visible. ", -1)]),
				e.wakeLockAvailable ? Y("v-if", !0) : (G(), K("p", yT, " Screen wake lock is unavailable in this browser. "))
			])]), e.kanban ? (G(), K("div", bT, [i[13] ||= q("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [q("rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}), q("path", { d: "M9 3v18M15 3v18M5 7h2M11 7h2M17 7h2M5 11h2M11 11h2" })], -1), q("div", xT, [
				i[12] ||= q("h3", {
					id: "kanban-heading",
					class: "text-sm font-semibold text-white"
				}, "Kanban Viewer", -1),
				q("label", ST, [q("input", {
					type: "checkbox",
					"aria-labelledby": "kanban-heading",
					"aria-describedby": "kanban-description",
					checked: e.kanban.enabled.value,
					disabled: !e.kanban.available.value || e.kanban.checking.value,
					onChange: i[3] ||= (t) => e.kanban.setEnabled(t.target.checked)
				}, null, 40, CT), q("span", wT, L(e.kanban.checking.value ? "Checking Hermes Kanban…" : e.kanban.available.value ? "Show the Hermes Kanban board in navigation." : "Hermes Kanban is inactive or its authenticated API is unavailable."), 1)]),
				q("button", {
					class: "min-h-[44px] underline",
					disabled: e.kanban.checking.value,
					onClick: i[4] ||= (t) => e.kanban.check()
				}, " Recheck availability ", 8, TT)
			])])) : Y("v-if", !0)]),
			i[17] ||= q("h3", {
				id: "settings-notifications-heading",
				class: "settings-section-title"
			}, "Notifications", -1),
			q("div", ET, [q("div", DT, [i[14] ||= q("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [q("path", { d: "M5 16h14l-2-3V9a5 5 0 0 0-10 0v4l-2 3Z" }), q("path", { d: "M10 19a2 2 0 0 0 4 0" })], -1), q("div", OT, [
				q("h3", kT, " Notifications for " + L(e.profile || "default"), 1),
				q("button", {
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.supported || !e.pushState.subscribed && !e.pushState.available,
					onClick: i[5] ||= (e) => n("togglePush")
				}, L(e.pushLoading ? "Loading…" : e.pushBusy ? "Updating…" : e.pushState.subscribed ? "Disable notifications" : "Enable notifications"), 9, AT),
				e.pushState.subscribed ? (G(), K("button", {
					key: 0,
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.available,
					onClick: i[6] ||= (e) => n("testPush")
				}, " Send test ", 8, jT)) : Y("v-if", !0),
				e.pushState.error || e.pushMessage ? (G(), K("p", MT, L(e.pushMessage || e.pushState.error), 1)) : e.pushState.subscribed ? (G(), K("p", NT, " Notifications enabled for " + L(e.profile || "default") + " on this device. ", 1)) : e.pushLoading ? (G(), K("p", PT, " Loading profile notification status… ")) : e.pushState.supported ? e.pushState.permission === "denied" ? (G(), K("p", IT, " Allow notifications in browser settings to enable them. ")) : (G(), K("p", LT, " Notifications disabled for " + L(e.profile || "default") + " on this device. ", 1)) : (G(), K("p", FT, " Install ChatHermes on a secure HTTPS origin to enable notifications. "))
			])])])
		])]));
	}
}), zT = /* @__PURE__ */ H({
	__name: "SettingsPage",
	setup(e) {
		let { profile: t, profiles: n, pushState: r, pushBusy: i, pushLoading: a, pushMessage: o, wakeLock: s, kanban: c, chooseProfile: l, togglePush: u, testPush: d, closeSettings: f } = m_();
		return (e, p) => (G(), Hi(RT, {
			kanban: B(c),
			profile: B(t),
			profiles: B(n),
			"push-state": B(r),
			"push-busy": B(i),
			"push-loading": B(a),
			"push-message": B(o),
			"keep-screen-awake": B(s).enabled.value,
			"wake-lock-available": B(s).available.value,
			onProfile: B(l),
			onTogglePush: B(u),
			onTestPush: B(d),
			onToggleWakeLock: B(s).setEnabled,
			onClose: B(f)
		}, null, 8, [
			"kanban",
			"profile",
			"profiles",
			"push-state",
			"push-busy",
			"push-loading",
			"push-message",
			"keep-screen-awake",
			"wake-lock-available",
			"onProfile",
			"onTogglePush",
			"onTestPush",
			"onToggleWakeLock",
			"onClose"
		]));
	}
}), BT = "chathermes";
function VT() {
	let e = [], t = !1, n = !1, r = () => zc(window.location.href) || "/", i = r(), a = () => window.history.state?.[BT], o = a()?.position ?? 0, s = a()?.state ?? {}, c = () => {
		let e = new URL(window.location.href);
		return e.pathname + e.search;
	}, l = (e, t, r) => {
		if (n || window.location.pathname !== "/chathermes") return;
		let a = { ...window.history.state };
		r || (typeof a.idx == "number" && a.idx++, typeof a.key == "string" && (a.key = Math.random().toString(36).slice(2, 10)), o++), s = {
			...t,
			position: o
		}, a[BT] = {
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
//#region src/features/projects/components/ProjectActions.vue?vue&type=script&setup=true&lang.ts
var HT = ["disabled"], UT = ["disabled"], WT = ["disabled"], GT = ["disabled"], KT = ["disabled"], qT = /* @__PURE__ */ H({
	__name: "ProjectActions",
	setup(e) {
		let { selectedProject: t, profile: n, projectId: r, projectBusy: i, offline: a, manageProject: o, createSession: s, creating: c, projectConfirmation: l } = y_(), u = Oc();
		function d(e) {
			return u.push({
				name: e === "edit" ? "project-settings" : "project-instructions",
				params: { projectId: r.value },
				query: n.value ? { profile: n.value } : {}
			});
		}
		function f(e) {
			l.value = e;
		}
		return (e, n) => B(t) && !B(t).isNoProject ? (G(), K(W, { key: 0 }, [
			B(t) && !B(t).isNoProject ? (G(), K("button", {
				key: 0,
				class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
				role: "menuitem",
				disabled: B(a) || B(c) || !B(t) || B(t).archived || !B(kl)(B(t)),
				onClick: n[0] ||= (e) => B(s)()
			}, " New Project Chat ", 8, HT)) : Y("v-if", !0),
			q("button", {
				role: "menuitem",
				onClick: n[1] ||= (e) => d("edit")
			}, "Edit project"),
			q("button", {
				role: "menuitem",
				disabled: B(a) || !B(kl)(B(t)),
				onClick: n[2] ||= (e) => d("instructions")
			}, " Edit Instructions ", 8, UT),
			B(t).isAuto ? Y("v-if", !0) : (G(), K(W, { key: 1 }, [B(t).archived ? (G(), K("button", {
				key: 0,
				role: "menuitem",
				disabled: B(i) || B(a),
				onClick: n[3] ||= (e) => B(o)("archive", {
					id: B(r),
					restore: !0
				})
			}, " Restore project ", 8, WT)) : (G(), K("button", {
				key: 1,
				role: "menuitem",
				disabled: B(i) || B(a),
				onClick: n[4] ||= (e) => f("archive")
			}, " Archive project ", 8, GT)), q("button", {
				class: "project-danger",
				role: "menuitem",
				disabled: B(i) || B(a),
				onClick: n[5] ||= (e) => f("delete")
			}, " Delete project ", 8, KT)], 64))
		], 64)) : Y("v-if", !0);
	}
}), JT = ["aria-checked"], YT = { "aria-hidden": "true" }, XT = ["aria-checked"], ZT = { "aria-hidden": "true" }, QT = ["aria-checked"], $T = { "aria-hidden": "true" }, eE = /* @__PURE__ */ H({
	__name: "ProjectsActions",
	setup(e) {
		let t = kc(), n = X(() => t.query.archived === "1"), { showProjects: r, hideAutomaticProjects: i, toggleAutomaticProjects: a } = y_();
		return (e, t) => (G(), K(W, null, [
			q("button", {
				class: "projects-filter-action",
				role: "menuitemradio",
				"aria-checked": !n.value,
				onClick: t[0] ||= (e) => B(r)(!1)
			}, [t[3] ||= q("span", null, "Active projects", -1), q("span", YT, L(n.value ? "" : "✓"), 1)], 8, JT),
			q("button", {
				class: "projects-filter-action",
				role: "menuitemradio",
				"aria-checked": n.value,
				onClick: t[1] ||= (e) => B(r)(!0)
			}, [t[4] ||= q("span", null, "Archived projects", -1), q("span", ZT, L(n.value ? "✓" : ""), 1)], 8, XT),
			q("button", {
				class: "projects-filter-action",
				role: "menuitemcheckbox",
				"aria-checked": B(i),
				onClick: t[2] ||= (...e) => B(a) && B(a)(...e)
			}, [t[5] ||= q("span", null, "Hide automatic projects", -1), q("span", $T, L(B(i) ? "✓" : ""), 1)], 8, QT)
		], 64));
	}
}), tE = ["disabled"], nE = ["disabled"], rE = /* @__PURE__ */ H({
	__name: "ScheduledActions",
	setup(e) {
		let { current: t, offline: n, creating: r, recentSession: i } = S_();
		return (e, a) => (G(), K(W, null, [q("button", {
			role: "menuitem",
			"data-test": "refresh-scheduled",
			disabled: !B(t) || B(t).loading.value,
			onClick: a[0] ||= (e) => B(t)?.retry()
		}, " Refresh", 8, tE), B(t)?.sessionId.value ? (G(), K("button", {
			key: 0,
			role: "menuitem",
			"data-test": "resume-scheduled-session",
			disabled: B(n) || B(r) || B(t).loading.value,
			onClick: a[1] ||= (e) => B(i)(B(t).sessionId.value)
		}, " Resume Session ", 8, nE)) : Y("v-if", !0)], 64));
	}
});
//#endregion
//#region src/router/index.ts
function iE(e = VT(), t) {
	let n = Dc({
		history: e,
		routes: [
			{
				path: "/",
				name: "home",
				components: {
					default: jb,
					actions: qT,
					dialogs: sb
				},
				meta: { chat: !0 }
			},
			{
				path: "/chat/:sessionId",
				name: "chat",
				components: {
					default: KS,
					actions: qT,
					dialogs: sb
				},
				meta: { chat: !0 }
			},
			{
				path: "/inbox",
				name: "inbox",
				components: {
					default: qS,
					actions: tb
				},
				meta: { title: "Inbox" }
			},
			{
				path: "/artifacts",
				name: "artifacts",
				components: { default: hC },
				meta: {
					title: "Artifacts",
					hideComposer: !0
				}
			},
			{
				path: "/projects",
				name: "projects",
				components: {
					default: kC,
					actions: eE
				},
				meta: {
					title: "Projects",
					section: "projects"
				}
			},
			{
				path: "/projects/:projectId",
				name: "project",
				components: {
					default: KC,
					actions: qT,
					dialogs: sb
				},
				meta: {
					section: "projects",
					composer: "project"
				}
			},
			{
				path: "/projects/:projectId/artifacts",
				name: "project-artifacts",
				components: {
					default: qC,
					actions: qT,
					dialogs: sb
				},
				meta: {
					section: "projects",
					hideComposer: !0
				}
			},
			{
				path: "/projects/:projectId/settings",
				name: "project-settings",
				components: {
					default: bw,
					actions: qT,
					dialogs: sb
				},
				meta: { section: "projects" }
			},
			{
				path: "/projects/:projectId/instructions",
				name: "project-instructions",
				components: {
					default: Nw,
					actions: qT,
					dialogs: sb
				},
				meta: { section: "projects" }
			},
			{
				path: "/scheduled",
				name: "scheduled",
				components: {
					default: qw,
					actions: rE
				},
				meta: {
					title: "Scheduled",
					section: "scheduled"
				}
			},
			{
				path: "/scheduled/:jobId",
				name: "scheduled-job",
				components: {
					default: eT,
					actions: rE
				},
				meta: {
					title: "Scheduled",
					section: "scheduled"
				}
			},
			{
				path: "/scheduled/:jobId/:runId",
				name: "scheduled-run",
				components: {
					default: aT,
					actions: rE
				},
				meta: {
					title: "Scheduled",
					section: "scheduled"
				}
			},
			{
				path: "/settings",
				name: "settings",
				components: { default: zT },
				meta: {
					title: "Settings",
					hideComposer: !0
				}
			},
			{
				path: "/kanban",
				name: "kanban",
				components: {
					default: Qy,
					actions: eb
				},
				meta: {
					title: "Kanban",
					hideComposer: !0
				}
			},
			{
				path: "/:pathMatch(.*)*",
				redirect: "/"
			}
		]
	});
	n.beforeEach((e) => {
		let t = Ic(e.query.profile);
		if (e.query.profile && typeof e.query.profile != "string" || t && !Fc.test(t) || e.name === "home" && e.query.project !== void 0 && !Pc(e.query.project) || Object.entries(e.params).some(([e, t]) => e === "projectId" ? !Pc(t) : typeof t != "string" || !Nc.test(t))) return { name: "home" };
		if (e.name === "settings" && e.query.return_to && Lc(e.query.return_to) !== e.query.return_to) return {
			name: "settings",
			query: {
				...e.query,
				return_to: "/"
			},
			replace: !0
		};
	});
	let r = t && zc(t);
	return r && !zc(window.location.href) && e.replace(r), n;
}
//#endregion
//#region src/main.ts
function aE(e, t) {
	let n = Po(kv).use(iE(void 0, e));
	return t && n.provide(Bc, t), n;
}
//#endregion
export { kv as App, aE as createChatHermesApp };
