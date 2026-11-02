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
}, k = /-\w/g, A = O((e) => e.replace(k, (e) => e.slice(1).toUpperCase())), ee = /\B([A-Z])/g, j = O((e) => e.replace(ee, "-$1").toLowerCase()), te = O((e) => e.charAt(0).toUpperCase() + e.slice(1)), M = O((e) => e ? `on${te(e)}` : ""), N = (e, t) => !Object.is(e, t), ne = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, re = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ie = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ae, P = () => ae ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function oe(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = v(r) ? ue(r) : oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (v(e) || b(e)) return e;
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
function F(e) {
	let t = "";
	if (v(e)) t = e;
	else if (p(e)) for (let n = 0; n < e.length; n++) {
		let r = F(e[n]);
		r && (t += r + " ");
	}
	else if (b(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var de = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", I = /* @__PURE__ */ n(de);
de + "";
function L(e) {
	return !!e || e === "";
}
function fe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ge(e[i], t[i], n);
	return r;
}
function pe(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ge(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function me(e, t, n) {
	let r = m(e), i = m(t);
	if (r || i || (r = h(e), i = h(t), r || i)) return r && i ? pe(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ge(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function he(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function ge(e, t, n) {
	if (e === t) return !0;
	let r = g(e), i = g(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = y(e), i = y(t), r || i ? e === t : (r = p(e), i = p(t), r || i ? r && i ? he(e, t, n, fe) : !1 : (r = b(e), i = b(t), r || i ? !r || !i ? !1 : he(e, t, n, me) : String(e) === String(t))));
}
function _e(e, t) {
	return e.findIndex((e) => ge(e, t));
}
var ve = (e) => !!(e && e.__v_isRef === !0), R = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? ve(e) ? R(e.value) : JSON.stringify(e, ye, 2) : String(e), ye = (e, t) => ve(t) ? ye(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[be(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => be(e)) } : y(t) ? be(t) : b(t) && !p(t) && !T(t) ? String(t) : t, be = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, xe, Se = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && xe && (xe.active ? (this.parent = xe, this.index = (xe.scopes || (xe.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = xe;
			try {
				return xe = this, e();
			} finally {
				xe = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = xe, xe = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (xe === this) xe = this.prevScope;
			else {
				let e = xe;
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
	return xe;
}
function we(e, t = !1) {
	xe && xe.cleanups.push(e);
}
var Te, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, xe && (xe.active ? xe.effects.push(this) : this.flags &= -2);
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
		let e = Te, t = Be;
		Te = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), Te = e, Be = t, this.flags &= -3;
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
	let t = e.dep, n = Te, r = Be;
	Te = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || N(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Te = n, Be = r, Fe(e), e.flags &= -3;
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
		let e = Te;
		Te = void 0;
		try {
			t();
		} finally {
			Te = e;
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
		if (!Te || !Be || Te === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Te) t = this.activeLink = new Ke(Te, this), Te.deps ? (t.prevDep = Te.depsTail, Te.depsTail.nextDep = t, Te.depsTail = t) : Te.deps = Te.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Te.depsTail, t.nextDep = void 0, Te.depsTail.nextDep = t, Te.depsTail = t, Te.deps === t && (Te.deps = e);
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
	if (Be && Te) {
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
		return e === /* @__PURE__ */ Ht(r) && s && (o ? N(n, i) && et(e, "set", t, n, i) : et(e, "add", t, n)), s;
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
			e || (N(n, a) && $e(i, "get", n), $e(i, "get", a));
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
			return e || (N(t, i) && $e(r, "has", t), $e(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
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
			return r.has.call(n, a) || N(e, a) && r.has.call(n, e) || N(i, a) && r.has.call(n, i) || (n.add(a), et(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Bt(n) && !/* @__PURE__ */ zt(n) && (n = /* @__PURE__ */ Ht(n));
			let r = /* @__PURE__ */ Ht(this), { has: i, get: a } = xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Ht(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? N(n, s) && et(r, "set", e, n, s) : et(r, "add", e, n), this;
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
	return !f(e, "__v_skip") && Object.isExtensible(e) && re(e, "__v_skip", !0), e;
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
		e = n ? e : /* @__PURE__ */ Ht(e), N(e, t) && (this._rawValue = e, this._value = n ? e : Wt(e), this.dep.trigger());
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
		if (this.flags |= 16, !(this.flags & 8) && Te !== this) return je(this, !0), !0;
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
	let x = Ce(), S = () => {
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
				if (e || o || y || (b ? n.some((e, t) => N(e, C[t])) : N(n, C))) {
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
function V(e, t) {
	if (Dn === null) return e;
	let n = ya(Dn), i = e.dirs ||= [];
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
function jn(e, t, n, r) {
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
function Mn(e, t) {
	if (aa) {
		let n = aa.provides, r = aa.parent && aa.parent.provides;
		r === n && (n = aa.provides = Object.create(r)), n[e] = t;
	}
}
function Nn(e, t, n = !1) {
	let r = oa();
	if (r || Ur) {
		let i = Ur ? Ur._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
var Pn = /* @__PURE__ */ Symbol.for("v-scx"), Fn = () => Nn(Pn);
function In(e, t, n) {
	return Ln(e, t, n);
}
function Ln(e, t, n = r) {
	let { immediate: i, deep: o, flush: s, once: c } = n, u = l({}, n), d = t && i || !t && s !== "post", f;
	if (fa) {
		if (s === "sync") {
			let e = Fn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = aa;
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
	return fa && (f ? f.push(h) : d && h()), h;
}
function Rn(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? zn(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = la(this), s = Ln(i, a.bind(r), n);
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
	let e = oa();
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
	let s = i.shapeFlag & 4 ? ya(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ Ht(g), b = g === r ? o : (e) => !Jn(h, e) && f(y, e), x = (e, t) => !(t && Jn(h, t));
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
P().requestIdleCallback, P().cancelIdleCallback;
var Qn = (e) => !!e.type.__asyncLoader, $n = (e) => e.type.__isKeepAlive;
function er(e, t) {
	nr(e, "a", t);
}
function tr(e, t) {
	nr(e, "da", t);
}
function nr(e, t, n = aa) {
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
function ir(e, t, n = aa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			He();
			let i = la(n), a = cn(t, n, e, r);
			return i(), Ue(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ar = (e) => (t, n = aa) => {
	(!fa || e === "sp") && ir(e, (...e) => t(...e), n);
}, or = ar("bm"), sr = ar("m"), cr = ar("bu"), lr = ar("u"), ur = ar("bum"), dr = ar("um"), fr = ar("sp"), pr = ar("rtg"), mr = ar("rtc");
function hr(e, t = aa) {
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
		return t !== "default" && (e.name = t), G(), q(W, null, [Ki("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ii.length;
	G();
	let c;
	try {
		let i = o && yr(o(n)), s = n.key || a || i && i.key;
		c = q(W, { key: (s && !y(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ii.length; e > s; e--) Ri();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function yr(e) {
	return e.some((e) => !Hi(e) || !(e.type === Pi || e.type === W && !yr(e.children))) ? e : null;
}
var br = (e) => e ? da(e) ? ya(e) : br(e.parent) : null, xr = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
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
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: A, inheritAttrs: ee, components: j, directives: te, filters: M } = t;
	if (u && Dr(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Pt(t));
	}
	if (Tr = !0, o) for (let e in o) {
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
	if (c) for (let e in c) kr(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Mn(t, e[t]);
		});
	}
	d && Or(d, e, "c");
	function N(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (N(or, f), N(sr, m), N(cr, h), N(lr, g), N(er, v), N(tr, y), N(hr, O), N(mr, E), N(pr, D), N(ur, S), N(dr, w), N(fr, k), p(A)) {
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
	T && e.render === a && (e.render = T), ee != null && (e.inheritAttrs = ee), j && (e.components = j), te && (e.directives = te), k && qn(e);
}
function Dr(e, t, n = a) {
	p(e) && (e = Fr(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? Nn(r.from || n, r.default, !0) : Nn(r.from || n) : Nn(r), /* @__PURE__ */ Kt(i) ? Object.defineProperty(t, n, {
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
		_(n) && In(i, n);
	} else if (_(e)) In(i, e.bind(n));
	else if (b(e)) {
		if (p(e)) e.forEach((e) => kr(e, t, n, r));
		else {
			let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
			_(r) && In(i, r, e);
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
			version: Sa,
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
					let u = c._ceVNode || Ki(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, ya(u.component);
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
var Ur = null, Wr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${A(t)}Modifiers`] || e[`${j(t)}Modifiers`];
function Gr(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && Wr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = a.map(ie)));
	let c, l = i[c = M(t)] || i[c = M(A(t))];
	!l && o && (l = i[c = M(j(t))]), l && cn(l, e, 6, a);
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
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, j(t)) || f(e, t));
}
function Yr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = kn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Zi(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = Zi(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? s : Xr(s);
		}
	} catch (t) {
		Ii.length = 0, ln(t, e, 1), v = Ki(Pi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = Zr(y, a)), b = Yi(b, y, !1, !0));
	}
	return n.dirs && (b = Yi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Gn(Vn(b.type) && Wn(b) || b, n.transition), v = b, kn(_), v;
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
	return n === "style" && b(r) && b(i) ? !ge(r, i) : r !== i;
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
						let t = A(o);
						i[t] = ci(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		si(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = j(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ci(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && et(e.attrs, "set", "");
}
function si(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (D(r)) continue;
		let l = t[r], u;
		a && f(a, u = A(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Jr(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
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
					let o = la(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === j(n)) && (r = !0));
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
		let t = A(s[e]);
		di(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = A(e);
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
	return e[0] !== "$" && !D(e);
}
var fi = (e) => e === "_" || e === "_ctx" || e === "$stable", pi = (e) => p(e) ? e.map(Zi) : [Zi(e)], mi = (e, t, n) => {
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
		e ? (_i(r, t, n), n && re(r, "_", e, !0)) : hi(t, r);
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
	let n = P();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ui(e, t) && (r = L(e), le(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === i && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
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
				j(e, t, n, r, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, a, o, s, c, l) : f & 6 ? te(e, t, n, r, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, a, o, s, c, l, me);
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
				n && n._beginPatch(), k(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, Ci(e, a), s, u), _ && jn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !D(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && ta(f, r, e);
		}
		_ && jn(e, null, r, "beforeMount");
		let v = Ti(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && bi(() => {
			try {
				f && ta(f, r, e), v && g.enter(d), _ && jn(e, null, r, "mounted");
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
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Qi(e[l]) : Zi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && wi(n, !1), (g = h.onVnodeBeforeUpdate) && ta(g, n, t, e), f && jn(t, e, n, "beforeUpdate"), n && wi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, n, i, Ci(t, a), o) : s || ae(e, t, l, null, n, i, Ci(t, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && bi(() => {
			g && ta(g, n, t, e), f && jn(t, e, n, "updated");
		}, i);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === W || !Ui(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
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
	}, j = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Ei(e, t, !0)) : ae(e, t, n, f, i, a, s, c, l);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : M(t, n, r, i, a, o, c) : N(e, t, c);
	}, M = (e, t, n, r, i, a, o) => {
		let s = e.component = ia(e, r, i);
		if ($n(e) && (s.ctx.renderer = me), pa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, re, o), !e.el) {
				let r = s.subTree = Ki(Pi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else re(s, e, t, n, i, a, o);
	}, N = (e, t, n) => {
		let r = t.component = e.component;
		if (Qr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, ie(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, re = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Oi(e);
					if (n) {
						t && (t.el = c.el, ie(e, t, o)), n.asyncDep.then(() => {
							bi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				wi(e, !1), t ? (t.el = c.el, ie(e, t, o)) : t = c, n && ne(n), (d = t.props && t.props.onVnodeBeforeUpdate) && ta(d, s, t, c), wi(e, !0);
				let f = Yr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), L(p), e, i, a), t.el = f.el, u === null && ti(e, f.el), r && bi(r, i), (d = t.props && t.props.onVnodeUpdated) && bi(() => ta(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Qn(t);
				if (wi(e, !1), l && ne(l), !m && (o = c && c.onVnodeBeforeMount) && ta(o, d, t), wi(e, !0), s && ge) {
					let t = () => {
						e.subTree = Yr(e), ge(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Yr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && bi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					bi(() => ta(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && bi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => bn(u), wi(e, !0), l();
	}, ie = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, oi(e, t.props, r, n), yi(e, t.children, n), He(), Cn(e), Ue();
	}, ae = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				oe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && I(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : I(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, oe = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Qi(t[p]) : Zi(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? I(e, a, o, !0, !1, f) : O(t, n, r, a, o, s, c, l, f);
	}, se = (e, t, n, r, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? Qi(t[u]) : Zi(t[u]);
			if (Ui(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? Qi(t[p]) : Zi(t[p]);
			if (Ui(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, i = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? Qi(t[u]) : Zi(t[u]), n, i, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) le(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Qi(t[u]) : Zi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let r = e[u];
				if (y >= b) {
					le(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Ui(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? le(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Di(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ai(f) : r;
				C[u] === 0 ? v(null, i, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ce(i, n, p, 2) : _--);
			}
		}
	}, ce = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ce(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, me);
			return;
		}
		if (c === W) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, r);
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
	}, le = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), Xn(s, null, n, e, !0), Ue()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ta(_, t, e), u & 6) de(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && jn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, me, r) : l && !l.hasOnce && (a !== W || d > 0 && d & 64) ? I(l, t, n, !1, !0) : (a === W && d & 384 || !i && u & 16) && I(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && bi(() => {
			_ && ta(_, t, e), h && jn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === W) {
			F(n, r);
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
	}, F = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, de = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ki(c), ki(l), r && ne(r), i.stop(), a ? (a.flags |= 8, le(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, le(o, e, t, n)), s && bi(s, t), bi(() => {
			e.isUnmounted = !0;
		}, t);
	}, I = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) le(e[o], t, n, r, i);
	}, L = (e) => {
		if (e.shapeFlag & 6) return L(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Bn];
		return n ? h(n) : t;
	}, fe = !1, pe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (le(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, fe ||= (fe = !0, Cn(r), wn(), !1);
	}, me = {
		p: v,
		um: le,
		m: ce,
		r: ue,
		mt: M,
		mc: O,
		pc: ae,
		pbc: A,
		n: L,
		o: e
	}, he, ge;
	return t && ([he, ge] = t(me)), {
		render: pe,
		hydrate: he,
		createApp: Hr(pe, he)
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
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Qi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ei(t, a)), a.type === Ni && (a.patchFlag === -1 && (a = i[e] = Qi(a)), a.el = t.el), a.type === Pi && !a.el && (a.el = t.el);
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
	return Vi(J(e, t, n, r, i, a, !0));
}
function q(e, t, n, r, i) {
	return Vi(Ki(e, t, n, r, i, !0));
}
function Hi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ui(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Wi = ({ key: e }) => e ?? null, Gi = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ Kt(e) || _(e) ? {
	i: Dn,
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
		key: t && Wi(t),
		ref: t && Gi(t),
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
	return s ? ($i(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), zi > 0 && !o && Li && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Li.push(c), c;
}
var Ki = qi;
function qi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === gr) && (e = Pi), Hi(e)) {
		let r = Yi(e, t, !0);
		return n && $i(r, n), zi > 0 && !a && Li && (r.shapeFlag & 6 ? Li[Li.indexOf(e)] = r : Li.push(r)), r.patchFlag = -2, r;
	}
	if (ba(e) && (e = e.__vccOpts), t) {
		t = Ji(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = F(e)), b(n) && (/* @__PURE__ */ Vt(n) && !p(n) && (n = l({}, n)), t.style = oe(n));
	}
	let o = v(e) ? 1 : ji(e) ? 128 : Vn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return J(e, t, n, r, i, o, a, !0);
}
function Ji(e) {
	return e ? /* @__PURE__ */ Vt(e) || ii(e) ? l({}, e) : e : null;
}
function Yi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ea(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Wi(l),
		ref: t && t.ref ? n && a ? p(a) ? a.concat(Gi(t)) : [a, Gi(t)] : Gi(t) : a,
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
		ssContent: e.ssContent && Yi(e.ssContent),
		ssFallback: e.ssFallback && Yi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Gn(u, c.clone(u)), u;
}
function Y(e = " ", t = 0) {
	return Ki(Ni, null, e, t);
}
function Xi(e, t) {
	let n = Ki(Fi, null, e);
	return n.staticCount = t, n;
}
function X(e = "", t = !1) {
	return t ? (G(), q(Pi, null, e)) : Ki(Pi, null, e);
}
function Zi(e) {
	return e == null || typeof e == "boolean" ? Ki(Pi) : p(e) ? Ki(W, null, e.slice()) : Hi(e) ? Qi(e) : Ki(Ni, null, String(e));
}
function Qi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Yi(e);
}
function $i(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (p(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), $i(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ii(t) ? t._ctx = Dn : r === 3 && Dn && (Dn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (_(t)) {
		if (r & 65) {
			$i(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Dn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Y(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ea(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = F([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ta(e, t, n, r = null) {
	cn(e, t, 7, [n, r]);
}
var na = Br(), ra = 0;
function ia(e, t, n) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || na, o = {
		uid: ra++,
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
		scope: new Se(!0),
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
var aa = null, oa = () => aa || Dn, sa, ca;
{
	let e = P(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	sa = t("__VUE_INSTANCE_SETTERS__", (e) => aa = e), ca = t("__VUE_SSR_SETTERS__", (e) => fa = e);
}
var la = (e) => {
	let t = aa;
	return sa(e), e.scope.on(), () => {
		e.scope.off(), sa(t);
	};
}, ua = () => {
	aa && aa.scope.off(), sa(null);
};
function da(e) {
	return e.vnode.shapeFlag & 4;
}
var fa = !1;
function pa(e, t = !1, n = !1) {
	t && ca(t);
	let { props: r, children: i } = e.vnode, a = da(e);
	ai(e, r, a, t), vi(e, i, n || t);
	let o = a ? ma(e, t) : void 0;
	return t && ca(!1), o;
}
function ma(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Cr);
	let { setup: r } = n;
	if (r) {
		He();
		let n = e.setupContext = r.length > 1 ? va(e) : null, i = la(e), a = sn(r, e, 0, [e.props, n]), o = x(a);
		if (Ue(), i(), (o || e.sp) && !Qn(e) && qn(e), o) {
			if (a.then(ua, ua), t) return a.then((n) => {
				ca(!0);
				try {
					ha(e, n, t);
				} finally {
					ca(!1);
				}
			}).catch((t) => {
				ln(t, e, 0);
			});
			e.asyncDep = a;
		} else ha(e, a, t);
	} else ga(e, t);
}
function ha(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Zt(t)), ga(e, n);
}
function ga(e, t, n) {
	let r = e.type;
	e.render ||= r.render || a;
	{
		let t = la(e);
		He();
		try {
			Er(e);
		} finally {
			Ue(), t();
		}
	}
}
var _a = { get(e, t) {
	return $e(e, "get", ""), e[t];
} };
function va(e) {
	return {
		attrs: new Proxy(e.attrs, _a),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ya(e) {
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
function ba(e) {
	return _(e) && "__vccOpts" in e;
}
var Z = (e, t) => /* @__PURE__ */ $t(e, t, fa);
function xa(e, t, n) {
	try {
		Bi(-1);
		let r = arguments.length;
		return r === 2 ? b(t) && !p(t) ? Hi(t) ? Ki(e, null, [t]) : Ki(e, t) : Ki(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Hi(n) && (n = [n]), Ki(e, t, n));
	} finally {
		Bi(1);
	}
}
var Sa = "3.5.43", Ca = void 0, wa = typeof window < "u" && window.trustedTypes;
if (wa) try {
	Ca = /* @__PURE__ */ wa.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ta = Ca ? (e) => Ca.createHTML(e) : (e) => e, Ea = "http://www.w3.org/2000/svg", Da = "http://www.w3.org/1998/Math/MathML", Oa = typeof document < "u" ? document : null, ka = Oa && /* @__PURE__ */ Oa.createElement("template"), Aa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Oa.createElementNS(Ea, e) : t === "mathml" ? Oa.createElementNS(Da, e) : n ? Oa.createElement(e, { is: n }) : Oa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Oa.createTextNode(e),
	createComment: (e) => Oa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Oa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			ka.innerHTML = Ta(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = ka.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, ja = /* @__PURE__ */ Symbol("_vtc");
function Ma(e, t, n) {
	let r = e[ja];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Na = /* @__PURE__ */ Symbol("_vod"), Pa = /* @__PURE__ */ Symbol("_vsh"), Fa = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Na] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Ia(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Ia(e, !0), r.enter(e)) : r.leave(e, () => {
			Ia(e, !1);
		}) : Ia(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Ia(e, t);
	}
};
function Ia(e, t) {
	e.style.display = t ? e[Na] : "none", e[Pa] = !t;
}
var La = /* @__PURE__ */ Symbol(""), Ra = /(?:^|;)\s*display\s*:/;
function za(e, t, n) {
	let r = e.style, i = v(n), a = !1;
	if (n && !i) {
		if (t) {
			if (v(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Va(r, t, "");
			}
			else for (let e in t) n[e] ?? Va(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Va(r, i, "") : Ga(e, i, !v(t) && t ? t[i] : void 0, o) || Va(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[La];
			e && (n += ";" + e), r.cssText = n, a = Ra.test(n);
		}
	} else t && e.removeAttribute("style");
	Na in e && (e[Na] = a ? r.display : "", e[Pa] && (r.display = "none"));
}
var Ba = /\s*!important$/;
function Va(e, t, n) {
	if (p(n)) n.forEach((n) => Va(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ba.test(n) ? e.setProperty(t, n.replace(Ba, ""), "important") : e.setProperty(t, n);
	else {
		let r = Wa(e, t);
		Ba.test(n) ? e.setProperty(j(r), n.replace(Ba, ""), "important") : e[r] = n;
	}
}
var Ha = [
	"Webkit",
	"Moz",
	"ms"
], Ua = {};
function Wa(e, t) {
	let n = Ua[t];
	if (n) return n;
	let r = A(t);
	if (r !== "filter" && r in e) return Ua[t] = r;
	r = te(r);
	for (let n = 0; n < Ha.length; n++) {
		let i = Ha[n] + r;
		if (i in e) return Ua[t] = i;
	}
	return t;
}
function Ga(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && v(r) && n === r;
}
var Ka = "http://www.w3.org/1999/xlink";
function qa(e, t, n, r, i, a = I(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ka, t.slice(6, t.length)) : e.setAttributeNS(Ka, t, n) : n == null || a && !L(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
}
function Ja(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ta(n) : n);
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
		r === "boolean" ? n = L(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ya(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Xa(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Za = /* @__PURE__ */ Symbol("_vei");
function Qa(e, t, n, r, i = null) {
	let a = e[Za] || (e[Za] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = to(t);
		r ? Ya(e, n, a[t] = ao(r, i), s) : o && (Xa(e, n, o, s), a[t] = void 0);
	}
}
var $a = /(Once|Passive|Capture)$/, eo = /^on:?(?:Once|Passive|Capture)$/;
function to(e) {
	let t, n;
	for (; (n = e.match($a)) && !eo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : j(e.slice(2)), t];
}
var no = 0, ro = /* @__PURE__ */ Promise.resolve(), io = () => no ||= (ro.then(() => no = 0), Date.now());
function ao(e, t) {
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
	return n.value = e, n.attached = io(), n;
}
var oo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, so = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Ma(e, r, o) : t === "style" ? za(e, n, r) : s(t) ? c(t) || Qa(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : co(e, t, r, o)) ? (Ja(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && qa(e, t, r, o, a, t !== "value")) : e._isVueCE && (lo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? Ja(e, A(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), qa(e, t, r, o));
};
function co(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && oo(t) && _(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return oo(t) && v(n) ? !1 : t in e;
}
function lo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = A(t);
	return Array.isArray(n) ? n.some((e) => A(e) === r) : Object.keys(n).some((e) => A(e) === r);
}
var uo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => ne(t, e) : t;
};
function fo(e) {
	e.target.composing = !0;
}
function po(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var mo = /* @__PURE__ */ Symbol("_assign"), ho = /* @__PURE__ */ Symbol("_initialValue");
function go(e, t, n) {
	return t && (e = e.trim()), n && (e = ie(e)), e;
}
var _o = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[ho] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[ho] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[mo] = uo(i);
		let a = r || i.props && i.props.type === "number";
		Ya(e, t ? "change" : "input", (t) => {
			t.target.composing || e[mo](go(e.value, n, a));
		}), (n || a) && Ya(e, "change", () => {
			e.value = go(e.value, n, a);
		}), t || (Ya(e, "compositionstart", fo), Ya(e, "compositionend", po), Ya(e, "change", po));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[ho];
		delete e[ho], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[mo](go(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[mo] = uo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ie(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, vo = {
	deep: !0,
	created(e, t, n) {
		e[mo] = uo(n), Ya(e, "change", () => {
			let t = e._modelValue, n = Co(e), r = e.checked, i = e[mo];
			if (p(t)) {
				let e = _e(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (h(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(wo(e, r));
		});
	},
	mounted: yo,
	beforeUpdate(e, t, n) {
		e[mo] = uo(n), yo(e, t, n);
	}
};
function yo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (p(t)) i = _e(t, r.props.value) > -1;
	else if (h(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ge(t, wo(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var bo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ya(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ie(Co(e)) : Co(e)), r = e.multiple, i = r ? h(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? p(i) ? t.slice() : t : i];
			try {
				e[mo](i);
			} finally {
				vn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[mo] = uo(r);
	},
	mounted(e, { value: t }) {
		So(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[mo] = uo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !xo(t, n[1], n[0])) && So(e, t);
	}
};
function xo(e, t, n) {
	if (!n || p(e)) return ge(e, t);
	if (h(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function So(e, t) {
	let n = e.multiple, r = p(t);
	if (!n || r || h(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Co(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : _e(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (ge(Co(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Co(e) {
	return "_value" in e ? e._value : e.value;
}
function wo(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var To = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Eo = {
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
	exact: (e, t) => To.some((n) => e[`${n}Key`] && !t.includes(n))
}, Do = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Eo[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Oo = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, ko = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = j(n.key);
		if (t.some((e) => e === r || Oo[e] === r)) return e(n);
	}));
}, Ao = /* @__PURE__ */ l({ patchProp: so }, Aa), jo;
function Mo() {
	return jo ||= xi(Ao);
}
var No = ((...e) => {
	let t = Mo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Fo(e);
		if (!r) return;
		let i = t._component;
		!_(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Po(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Po(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Fo(e) {
	return v(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/vue-router/dist/devtools-BLCumUwL.mjs
var Io = typeof document < "u";
function Lo(e) {
	return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Ro(e) {
	return e.__esModule || e[Symbol.toStringTag] === "Module" || e.default && Lo(e.default);
}
var zo = Object.assign;
function Bo(e, t) {
	let n = {};
	for (let r in t) {
		let i = t[r];
		n[r] = Ho(i) ? i.map(e) : e(i);
	}
	return n;
}
var Vo = () => {}, Ho = Array.isArray;
function Uo(e, t) {
	let n = {};
	for (let r in e) n[r] = r in t ? t[r] : e[r];
	return n;
}
var Wo = /#/g, Go = /&/g, Ko = /\//g, qo = /=/g, Jo = /\?/g, Yo = /\+/g, Xo = /%5B/g, Zo = /%5D/g, Qo = /%5E/g, $o = /%60/g, es = /%7B/g, ts = /%7C/g, ns = /%7D/g, rs = /%20/g;
function is(e) {
	return e == null ? "" : encodeURI("" + e).replace(ts, "|").replace(Xo, "[").replace(Zo, "]");
}
function as(e) {
	return is(e).replace(es, "{").replace(ns, "}").replace(Qo, "^");
}
function os(e) {
	return is(e).replace(Yo, "%2B").replace(rs, "+").replace(Wo, "%23").replace(Go, "%26").replace($o, "`").replace(es, "{").replace(ns, "}").replace(Qo, "^");
}
function ss(e) {
	return os(e).replace(qo, "%3D");
}
function cs(e) {
	return is(e).replace(Wo, "%23").replace(Jo, "%3F");
}
function ls(e) {
	return cs(e).replace(Ko, "%2F");
}
function us(e) {
	if (e == null) return null;
	try {
		return decodeURIComponent("" + e);
	} catch {}
	return "" + e;
}
function ds(e, t, n = "/") {
	let r, i = {}, a = "", o = "", s = t.indexOf("#"), c = t.indexOf("?");
	return c = s >= 0 && c > s ? -1 : c, c >= 0 && (r = t.slice(0, c), a = t.slice(c, s > 0 ? s : t.length), i = e(a.slice(1))), s >= 0 && (r ||= t.slice(0, s), o = t.slice(s, t.length)), r = vs(r ?? t, n), {
		fullPath: r + a + o,
		path: r,
		query: i,
		hash: us(o)
	};
}
function fs(e, t) {
	let n = t.query ? e(t.query) : "";
	return t.path + (n && "?") + n + (t.hash || "");
}
function ps(e, t, n) {
	let r = t.matched.length - 1, i = n.matched.length - 1;
	return r > -1 && r === i && ms(t.matched[r], n.matched[i]) && hs(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function ms(e, t) {
	return (e.aliasOf || e) === (t.aliasOf || t);
}
function hs(e, t) {
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let n in e) if (!gs(e[n], t[n])) return !1;
	return !0;
}
function gs(e, t) {
	return Ho(e) ? _s(e, t) : Ho(t) ? _s(t, e) : e === t;
}
function _s(e, t) {
	return Ho(t) ? e.length === t.length && e.every((e, n) => e === t[n]) : e.length === 1 && e[0] === t;
}
function vs(e, t) {
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
var ys = {
	path: "/",
	name: void 0,
	params: {},
	query: {},
	hash: "",
	fullPath: "/",
	matched: [],
	meta: {},
	redirectedFrom: void 0
}, bs = /* @__PURE__ */ function(e) {
	return e.pop = "pop", e.push = "push", e;
}({});
function xs(e, t) {
	let n = document.documentElement.getBoundingClientRect(), r = e.getBoundingClientRect();
	return {
		behavior: t.behavior,
		left: r.left - n.left - (t.left || 0),
		top: r.top - n.top - (t.top || 0)
	};
}
var Ss = () => ({
	left: window.scrollX,
	top: window.scrollY
});
function Cs(e) {
	let t;
	if ("el" in e) {
		let n = e.el, r = typeof n == "string" && n.startsWith("#"), i = typeof n == "string" ? r ? document.getElementById(n.slice(1)) : document.querySelector(n) : n;
		if (!i) return;
		t = xs(i, e);
	} else t = e;
	"scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left == null ? window.scrollX : t.left, t.top == null ? window.scrollY : t.top);
}
function ws(e, t) {
	return (history.state ? history.state.position - t : -1) + e;
}
var Ts = /* @__PURE__ */ new Map();
function Es(e, t) {
	Ts.set(e, t);
}
function Ds(e) {
	let t = Ts.get(e);
	return Ts.delete(e), t;
}
function Os(e) {
	return typeof e == "string" || e && typeof e == "object";
}
function ks(e) {
	return typeof e == "string" || typeof e == "symbol";
}
var As = /* @__PURE__ */ function(e) {
	return e[e.MATCHER_NOT_FOUND = 1] = "MATCHER_NOT_FOUND", e[e.NAVIGATION_GUARD_REDIRECT = 2] = "NAVIGATION_GUARD_REDIRECT", e[e.NAVIGATION_ABORTED = 4] = "NAVIGATION_ABORTED", e[e.NAVIGATION_CANCELLED = 8] = "NAVIGATION_CANCELLED", e[e.NAVIGATION_DUPLICATED = 16] = "NAVIGATION_DUPLICATED", e;
}({}), js = Symbol("");
As.MATCHER_NOT_FOUND, As.NAVIGATION_GUARD_REDIRECT, As.NAVIGATION_ABORTED, As.NAVIGATION_CANCELLED, As.NAVIGATION_DUPLICATED;
function Ms(e, t) {
	return zo(/* @__PURE__ */ Error(), {
		type: e,
		[js]: !0
	}, t);
}
function Ns(e, t) {
	return e instanceof Error && js in e && (t == null || !!(e.type & t));
}
function Ps(e) {
	let t = {};
	if (e === "" || e === "?") return t;
	let n = (e[0] === "?" ? e.slice(1) : e).split("&");
	for (let e = 0; e < n.length; ++e) {
		let r = n[e].replace(Yo, " "), i = r.indexOf("="), a = us(i < 0 ? r : r.slice(0, i)), o = i < 0 ? null : us(r.slice(i + 1));
		if (a in t) {
			let e = t[a];
			Ho(e) || (e = t[a] = [e]), e.push(o);
		} else t[a] = o;
	}
	return t;
}
function Fs(e) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		if (n = ss(n), r == null) {
			r !== void 0 && (t += (t.length ? "&" : "") + n);
			continue;
		}
		(Ho(r) ? r.map((e) => e && os(e)) : [r && os(r)]).forEach((e) => {
			e !== void 0 && (t += (t.length ? "&" : "") + n, e != null && (t += "=" + e));
		});
	}
	return t;
}
function Is(e) {
	let t = {};
	for (let n in e) {
		let r = e[n];
		r !== void 0 && (t[n] = Ho(r) ? r.map((e) => e == null ? null : "" + e) : r == null ? r : "" + r);
	}
	return t;
}
var Ls = Symbol(""), Rs = Symbol(""), zs = Symbol(""), Bs = Symbol(""), Vs = Symbol("");
function Hs() {
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
function Us(e, t, n, r, i, a = (e) => e()) {
	let o = r && (r.enterCallbacks[i] = r.enterCallbacks[i] || []);
	return () => new Promise((s, c) => {
		let l = (e) => {
			e === !1 ? c(Ms(As.NAVIGATION_ABORTED, {
				from: n,
				to: t
			})) : e instanceof Error ? c(e) : Os(e) ? c(Ms(As.NAVIGATION_GUARD_REDIRECT, {
				from: t,
				to: e
			})) : (o && r.enterCallbacks[i] === o && typeof e == "function" && o.push(e), s());
		}, u = a(() => e.call(r && r.instances[i], t, n, l)), d = Promise.resolve(u);
		e.length < 3 && (d = d.then(l)), d.catch((e) => c(e));
	});
}
function Ws(e, t, n, r, i = (e) => e()) {
	let a = [];
	for (let o of e) for (let e in o.components) {
		let s = o.components[e];
		if (t === "beforeRouteEnter" || o.instances[e]) {
			if (Lo(s)) {
				let c = (s.__vccOpts || s)[t];
				c && a.push(Us(c, n, r, o, e, i));
			} else {
				let c = s();
				a.push(() => c.then((a) => {
					if (!a) throw Error(`Couldn't resolve component "${e}" at "${o.path}"`);
					let s = Ro(a) ? a.default : a;
					o.mods[e] = a, o.components[e] = s;
					let c = (s.__vccOpts || s)[t];
					return c && Us(c, n, r, o, e, i)();
				}));
			}
		}
	}
	return a;
}
function Gs(e, t) {
	let n = [], r = [], i = [], a = Math.max(t.matched.length, e.matched.length);
	for (let o = 0; o < a; o++) {
		let a = t.matched[o];
		a && (e.matched.find((e) => ms(e, a)) ? r.push(a) : n.push(a));
		let s = e.matched[o];
		s && (t.matched.find((e) => ms(e, s)) || i.push(s));
	}
	return [
		n,
		r,
		i
	];
}
//#endregion
//#region node_modules/vue-router/dist/vue-router.mjs
var Ks = /* @__PURE__ */ function(e) {
	return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.Group = 2] = "Group", e;
}({}), qs = /* @__PURE__ */ function(e) {
	return e[e.Static = 0] = "Static", e[e.Param = 1] = "Param", e[e.ParamRegExp = 2] = "ParamRegExp", e[e.ParamRegExpEnd = 3] = "ParamRegExpEnd", e[e.EscapeNext = 4] = "EscapeNext", e;
}(qs || {}), Js = {
	type: Ks.Static,
	value: ""
}, Ys = /[a-zA-Z0-9_]/;
function Xs(e) {
	if (!e) return [[]];
	if (e === "/") return [[Js]];
	if (!e.startsWith("/")) throw Error(`Invalid path "${e}"`);
	function t(e) {
		throw Error(`ERR (${n})/"${l}": ${e}`);
	}
	let n = qs.Static, r = n, i = [], a;
	function o() {
		a && i.push(a), a = [];
	}
	let s = 0, c, l = "", u = "";
	function d() {
		l &&= (n === qs.Static ? a.push({
			type: Ks.Static,
			value: l
		}) : n === qs.Param || n === qs.ParamRegExp || n === qs.ParamRegExpEnd ? (a.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`), a.push({
			type: Ks.Param,
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
		if (c = e[s++], c === "\\" && n !== qs.ParamRegExp) {
			r = n, n = qs.EscapeNext;
			continue;
		}
		switch (n) {
			case qs.Static:
				c === "/" ? (l && d(), o()) : c === ":" ? (d(), n = qs.Param) : f();
				break;
			case qs.EscapeNext:
				f(), n = r;
				break;
			case qs.Param:
				c === "(" ? n = qs.ParamRegExp : Ys.test(c) ? f() : (d(), n = qs.Static, c !== "*" && c !== "?" && c !== "+" && s--);
				break;
			case qs.ParamRegExp:
				c === ")" ? u[u.length - 1] == "\\" ? u = u.slice(0, -1) + c : n = qs.ParamRegExpEnd : u += c;
				break;
			case qs.ParamRegExpEnd:
				d(), n = qs.Static, c !== "*" && c !== "?" && c !== "+" && s--, u = "";
				break;
			default: t("Unknown state");
		}
	}
	return n === qs.ParamRegExp && t(`Unfinished custom RegExp for param "${l}"`), d(), o(), i;
}
var Zs = "[^/]+?", Qs = {
	sensitive: !1,
	strict: !1,
	start: !0,
	end: !0
}, $s = /* @__PURE__ */ function(e) {
	return e[e._multiplier = 10] = "_multiplier", e[e.Root = 90] = "Root", e[e.Segment = 40] = "Segment", e[e.SubSegment = 30] = "SubSegment", e[e.Static = 40] = "Static", e[e.Dynamic = 20] = "Dynamic", e[e.BonusCustomRegExp = 10] = "BonusCustomRegExp", e[e.BonusWildcard = -50] = "BonusWildcard", e[e.BonusRepeatable = -20] = "BonusRepeatable", e[e.BonusOptional = -8] = "BonusOptional", e[e.BonusStrict = .7000000000000001] = "BonusStrict", e[e.BonusCaseSensitive = .25] = "BonusCaseSensitive", e;
}($s || {}), ec = /[.+*?^${}()[\]/\\]/g;
function tc(e, t) {
	let n = zo({}, Qs, t), r = [], i = n.start ? "^" : "", a = [];
	for (let t of e) {
		let e = t.length ? [] : [$s.Root];
		n.strict && !t.length && (i += "/");
		for (let r = 0; r < t.length; r++) {
			let o = t[r], s = $s.Segment + (n.sensitive ? $s.BonusCaseSensitive : 0);
			if (o.type === Ks.Static) r || (i += "/"), i += o.value.replace(ec, "\\$&"), s += $s.Static;
			else if (o.type === Ks.Param) {
				let { value: e, repeatable: n, optional: c, regexp: l } = o;
				a.push({
					name: e,
					repeatable: n,
					optional: c
				});
				let u = l || Zs;
				if (u !== Zs) {
					s += $s.BonusCustomRegExp;
					try {
						`${u}`;
					} catch (t) {
						throw Error(`Invalid custom RegExp for param "${e}" (${u}): ` + t.message);
					}
				}
				let d = n ? `((?:${u})(?:/(?:${u}))*)` : `(${u})`;
				r || (d = c && t.length < 2 ? `(?:/${d})` : "/" + d), c && (d += "?"), i += d, s += $s.Dynamic, c && (s += $s.BonusOptional), n && (s += $s.BonusRepeatable), u === ".*" && (s += $s.BonusWildcard);
			}
			e.push(s);
		}
		r.push(e);
	}
	if (n.strict && n.end) {
		let e = r.length - 1;
		r[e][r[e].length - 1] += $s.BonusStrict;
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
			for (let e of i) if (e.type === Ks.Static) n += e.value;
			else if (e.type === Ks.Param) {
				let { value: a, repeatable: o, optional: s } = e, c = a in t ? t[a] : "";
				if (Ho(c) && !o) throw Error(`Provided param "${a}" is an array but it is not repeatable (* or + modifiers)`);
				let l = Ho(c) ? c.join("/") : c;
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
function nc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length;) {
		let r = t[n] - e[n];
		if (r) return r;
		n++;
	}
	return e.length < t.length ? e.length === 1 && e[0] === $s.Static + $s.Segment ? -1 : 1 : e.length > t.length ? t.length === 1 && t[0] === $s.Static + $s.Segment ? 1 : -1 : 0;
}
function rc(e, t) {
	let n = 0, r = e.score, i = t.score;
	for (; n < r.length && n < i.length;) {
		let e = nc(r[n], i[n]);
		if (e) return e;
		n++;
	}
	if (Math.abs(i.length - r.length) === 1) {
		if (ic(r)) return 1;
		if (ic(i)) return -1;
	}
	return i.length - r.length;
}
function ic(e) {
	let t = e[e.length - 1];
	return e.length > 0 && t[t.length - 1] < 0;
}
var ac = {
	strict: !1,
	end: !0,
	sensitive: !1
};
function oc(e, t, n) {
	let r = zo(tc(Xs(e.path), n), {
		record: e,
		parent: t,
		children: [],
		alias: []
	});
	return t && !r.record.aliasOf == !t.record.aliasOf && t.children.push(r), r;
}
function sc(e, t) {
	let n = [], r = /* @__PURE__ */ new Map();
	t = Uo(ac, t);
	function i(e) {
		return r.get(e);
	}
	function a(e, n, r) {
		let i = !r, s = lc(e);
		s.aliasOf = r && r.record;
		let l = Uo(t, e), u = [s];
		if ("alias" in e) {
			let t = typeof e.alias == "string" ? [e.alias] : e.alias;
			for (let e of t) u.push(lc(zo({}, s, {
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
			if (d = oc(t, n, l), r ? r.alias.push(d) : (f ||= d, f !== d && f.alias.push(d), i && e.name && !dc(d) && o(e.name)), hc(d) && c(d), s.children) {
				let e = s.children;
				for (let t = 0; t < e.length; t++) a(e[t], d, r && r.children[t]);
			}
			r ||= d;
		}
		return f ? () => {
			o(f);
		} : Vo;
	}
	function o(e) {
		if (ks(e)) {
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
		let t = pc(e, n);
		n.splice(t, 0, e), e.record.name && !dc(e) && r.set(e.record.name, e);
	}
	function l(e, t) {
		let i, a = {}, o, s;
		if ("name" in e && e.name) {
			if (i = r.get(e.name), !i) throw Ms(As.MATCHER_NOT_FOUND, { location: e });
			s = i.record.name, a = zo(cc(t.params, i.keys.filter((e) => !e.optional).concat(i.parent ? i.parent.keys.filter((e) => e.optional) : []).map((e) => e.name)), e.params && cc(e.params, i.keys.map((e) => e.name))), o = i.stringify(a);
		} else if (e.path != null) o = e.path, i = n.find((e) => e.re.test(o)), i && (a = i.parse(o), s = i.record.name);
		else {
			if (i = t.name ? r.get(t.name) : n.find((e) => e.re.test(t.path)), !i) throw Ms(As.MATCHER_NOT_FOUND, {
				location: e,
				currentLocation: t
			});
			s = i.record.name, a = zo({}, t.params, e.params), o = i.stringify(a);
		}
		let c = [], l = i;
		for (; l;) c.unshift(l.record), l = l.parent;
		return {
			name: s,
			path: o,
			params: a,
			matched: c,
			meta: fc(c)
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
function cc(e, t) {
	let n = {};
	for (let r of t) r in e && (n[r] = e[r]);
	return n;
}
function lc(e) {
	let t = {
		path: e.path,
		redirect: e.redirect,
		name: e.name,
		meta: e.meta || {},
		aliasOf: e.aliasOf,
		beforeEnter: e.beforeEnter,
		props: uc(e),
		children: e.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: "components" in e ? e.components || null : e.component && { default: e.component }
	};
	return Object.defineProperty(t, "mods", { value: {} }), t;
}
function uc(e) {
	let t = {}, n = e.props || !1;
	if ("component" in e) t.default = n;
	else for (let r in e.components) t[r] = typeof n == "object" ? n[r] : n;
	return t;
}
function dc(e) {
	for (; e;) {
		if (e.record.aliasOf) return !0;
		e = e.parent;
	}
	return !1;
}
function fc(e) {
	return e.reduce((e, t) => zo(e, t.meta), {});
}
function pc(e, t) {
	let n = 0, r = t.length;
	for (; n !== r;) {
		let i = n + r >> 1;
		rc(e, t[i]) < 0 ? r = i : n = i + 1;
	}
	let i = mc(e);
	return i && (r = t.lastIndexOf(i, r - 1)), r;
}
function mc(e) {
	let t = e;
	for (; t = t.parent;) if (hc(t) && rc(e, t) === 0) return t;
}
function hc({ record: e }) {
	return !!(e.name || e.components && Object.keys(e.components).length || e.redirect);
}
function gc(e) {
	let t = Nn(zs), n = Nn(Bs), r = Z(() => {
		let n = B(e.to);
		return t.resolve(n);
	}), i = Z(() => {
		let { matched: e } = r.value, { length: t } = e, i = e[t - 1], a = n.matched;
		if (!i || !a.length) return -1;
		let o = a.findIndex(ms.bind(null, i));
		if (o > -1) return o;
		let s = xc(e[t - 2]);
		return t > 1 && xc(i) === s && a[a.length - 1].path !== s ? a.findIndex(ms.bind(null, e[t - 2])) : o;
	}), a = Z(() => i.value > -1 && bc(n.params, r.value.params)), o = Z(() => i.value > -1 && i.value === n.matched.length - 1 && hs(n.params, r.value.params));
	function s(n = {}) {
		if (yc(n)) {
			let n = t[B(e.replace) ? "replace" : "push"](B(e.to)).catch(Vo);
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
function _c(e) {
	return e.length === 1 ? e[0] : e;
}
var vc = /* @__PURE__ */ H({
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
	useLink: gc,
	setup(e, { slots: t }) {
		let n = /* @__PURE__ */ Pt(gc(e)), { options: r } = Nn(zs), i = Z(() => ({
			[Sc(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive,
			[Sc(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive
		}));
		return () => {
			let r = t.default && _c(t.default(n));
			return e.custom ? r : xa("a", {
				"aria-current": n.isExactActive ? e.ariaCurrentValue : null,
				href: n.href,
				onClick: n.navigate,
				class: i.value
			}, r);
		};
	}
});
function yc(e) {
	if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && (e.button === void 0 || e.button === 0)) {
		if (e.currentTarget && e.currentTarget.getAttribute) {
			let t = e.currentTarget.getAttribute("target");
			if (/\b_blank\b/i.test(t)) return;
		}
		return e.preventDefault && e.preventDefault(), !0;
	}
}
function bc(e, t) {
	for (let n in t) {
		let r = t[n], i = e[n];
		if (typeof r == "string") {
			if (r !== i) return !1;
		} else if (!Ho(i) || i.length !== r.length || r.some((e, t) => e !== i[t])) return !1;
	}
	return !0;
}
function xc(e) {
	return e ? e.aliasOf ? e.aliasOf.path : e.path : "";
}
var Sc = (e, t, n) => e ?? t ?? n, Cc = /* @__PURE__ */ H({
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
		let r = Nn(Vs), i = Z(() => e.route || r.value), a = Nn(Rs, 0), o = Z(() => {
			let e = B(a), { matched: t } = i.value, n;
			for (; (n = t[e]) && !n.components;) e++;
			return e;
		}), s = Z(() => i.value.matched[o.value]);
		Mn(Rs, Z(() => o.value + 1)), Mn(Ls, s), Mn(Vs, i);
		let c = /* @__PURE__ */ z();
		return In(() => [
			c.value,
			s.value,
			e.name
		], ([e, t, n], [r, i, a]) => {
			t && (t.instances[n] = e, i && i !== t && e && e === r && (t.leaveGuards.size || (t.leaveGuards = i.leaveGuards), t.updateGuards.size || (t.updateGuards = i.updateGuards))), e && t && (!i || !ms(t, i) || !r) && (t.enterCallbacks[n] || []).forEach((t) => t(e));
		}, { flush: "post" }), () => {
			let r = i.value, a = e.name, o = s.value, l = o && o.components[a];
			if (!l) return wc(n.default, {
				Component: l,
				route: r
			});
			let u = o.props[a], d = xa(l, zo({}, u ? u === !0 ? r.params : typeof u == "function" ? u(r) : u : null, t, {
				onVnodeUnmounted: (e) => {
					e.component.isUnmounted && (o.instances[a] = null);
				},
				ref: c
			}));
			return wc(n.default, {
				Component: d,
				route: r
			}) || d;
		};
	}
});
function wc(e, t) {
	if (!e) return null;
	let n = e(t);
	return n.length === 1 ? n[0] : n;
}
var Tc = Cc;
function Ec(e) {
	let t = sc(e.routes, e), n = e.parseQuery || Ps, r = e.stringifyQuery || Fs, i = e.history, a = Hs(), o = Hs(), s = Hs(), c = /* @__PURE__ */ qt(ys), l = ys;
	Io && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
	let u = Bo.bind(null, (e) => "" + e), d = Bo.bind(null, ls), f = Bo.bind(null, us);
	function p(e, n) {
		let r, i;
		return ks(e) ? (r = t.getRecordMatcher(e), i = n) : i = e, t.addRoute(i, r);
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
		if (a = zo({}, a || c.value), typeof e == "string") {
			let r = ds(n, e, a.path), o = t.resolve({ path: r.path }, a), s = i.createHref(r.fullPath);
			return zo(r, o, {
				params: f(o.params),
				hash: us(r.hash),
				redirectedFrom: void 0,
				href: s
			});
		}
		let o;
		if (e.path != null) o = zo({}, e, { path: ds(n, e.path, a.path).path });
		else {
			let t = zo({}, e.params);
			for (let e in t) t[e] ?? delete t[e];
			o = zo({}, e, { params: d(t) }), a.params = d(a.params);
		}
		let s = t.resolve(o, a), l = e.hash || "";
		s.params = u(f(s.params));
		let p = fs(r, zo({}, e, {
			hash: as(l),
			path: s.path
		})), m = i.createHref(p);
		return zo({
			fullPath: p,
			hash: l,
			query: r === Fs ? Is(e.query) : e.query || {}
		}, s, {
			redirectedFrom: void 0,
			href: m
		});
	}
	function v(e) {
		return typeof e == "string" ? ds(n, e, c.value.path) : zo({}, e);
	}
	function y(e, t) {
		if (l !== e) return Ms(As.NAVIGATION_CANCELLED, {
			from: t,
			to: e
		});
	}
	function b(e) {
		return C(e);
	}
	function x(e) {
		return b(zo(v(e), { replace: !0 }));
	}
	function S(e, t) {
		let n = e.matched[e.matched.length - 1];
		if (n && n.redirect) {
			let { redirect: r } = n, i = typeof r == "function" ? r(e, t) : r;
			return typeof i == "string" && (i = i.includes("?") || i.includes("#") ? i = v(i) : { path: i }, i.params = {}), zo({
				query: e.query,
				hash: e.hash,
				params: i.path == null ? e.params : {}
			}, i);
		}
	}
	function C(e, t) {
		let n = l = _(e), i = c.value, a = e.state, o = e.force, s = e.replace === !0, u = S(n, i);
		if (u) return C(zo(v(u), {
			state: typeof u == "object" ? zo({}, a, u.state) : a,
			force: o,
			replace: s
		}), t || n);
		let d = n;
		d.redirectedFrom = t;
		let f;
		return !o && ps(r, i, n) && (f = Ms(As.NAVIGATION_DUPLICATED, {
			to: d,
			from: i
		}), re(i, i, !0, !1)), (f ? Promise.resolve(f) : E(d, i)).catch((e) => Ns(e) ? Ns(e, As.NAVIGATION_GUARD_REDIRECT) ? e : ne(e) : M(e, d, i)).then((e) => {
			if (e) {
				if (Ns(e, As.NAVIGATION_GUARD_REDIRECT)) return C(zo({ replace: s }, v(e.to), {
					state: typeof e.to == "object" ? zo({}, a, e.to.state) : a,
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
		let t = P.values().next().value;
		return t && typeof t.runWithContext == "function" ? t.runWithContext(e) : e();
	}
	function E(e, t) {
		let n, [r, i, s] = Gs(e, t);
		n = Ws(r.reverse(), "beforeRouteLeave", e, t);
		for (let i of r) i.leaveGuards.forEach((r) => {
			n.push(Us(r, e, t));
		});
		let c = w.bind(null, e, t);
		return n.push(c), se(n).then(() => {
			n = [];
			for (let r of a.list()) n.push(Us(r, e, t));
			return n.push(c), se(n);
		}).then(() => {
			n = Ws(i, "beforeRouteUpdate", e, t);
			for (let r of i) r.updateGuards.forEach((r) => {
				n.push(Us(r, e, t));
			});
			return n.push(c), se(n);
		}).then(() => {
			n = [];
			for (let r of s) if (r.beforeEnter) {
				if (Ho(r.beforeEnter)) for (let i of r.beforeEnter) n.push(Us(i, e, t));
				else n.push(Us(r.beforeEnter, e, t));
			}
			return n.push(c), se(n);
		}).then(() => (e.matched.forEach((e) => e.enterCallbacks = {}), n = Ws(s, "beforeRouteEnter", e, t, T), n.push(c), se(n))).then(() => {
			n = [];
			for (let r of o.list()) n.push(Us(r, e, t));
			return n.push(c), se(n);
		}).catch((e) => Ns(e, As.NAVIGATION_CANCELLED) ? e : Promise.reject(e));
	}
	function D(e, t, n) {
		s.list().forEach((r) => T(() => r(e, t, n)));
	}
	function O(e, t, n, r, a) {
		let o = y(e, t);
		if (o) return o;
		let s = t === ys, l = Io ? history.state : {};
		n && (r || s ? i.replace(e.fullPath, zo({ scroll: s && l && l.scroll }, a)) : i.push(e.fullPath, a)), c.value = e, re(e, t, n, s), ne();
	}
	let k;
	function A() {
		k ||= i.listen((e, t, n) => {
			if (!oe.listening) return;
			let r = _(e), a = S(r, oe.currentRoute.value);
			if (a) {
				C(zo(a, {
					replace: !0,
					force: !0
				}), r).catch(Vo);
				return;
			}
			l = r;
			let o = c.value;
			Io && Es(ws(o.fullPath, n.delta), Ss()), E(r, o).catch((e) => Ns(e, As.NAVIGATION_ABORTED | As.NAVIGATION_CANCELLED) ? e : Ns(e, As.NAVIGATION_GUARD_REDIRECT) ? (C(zo(v(e.to), { force: !0 }), r).then((e) => {
				Ns(e, As.NAVIGATION_ABORTED | As.NAVIGATION_DUPLICATED) && !n.delta && n.type === bs.pop && i.go(-1, !1);
			}).catch(Vo), Promise.reject()) : (n.delta && i.go(-n.delta, !1), M(e, r, o))).then((e) => {
				e ||= O(r, o, !1), e && (n.delta && !Ns(e, As.NAVIGATION_CANCELLED) ? i.go(-n.delta, !1) : n.type === bs.pop && Ns(e, As.NAVIGATION_ABORTED | As.NAVIGATION_DUPLICATED) && i.go(-1, !1)), D(r, o, e);
			}).catch(Vo);
		});
	}
	let ee = Hs(), j = Hs(), te;
	function M(e, t, n) {
		ne(e);
		let r = j.list();
		return r.length ? r.forEach((r) => r(e, t, n)) : console.error(e), Promise.reject(e);
	}
	function N() {
		return te && c.value !== ys ? Promise.resolve() : new Promise((e, t) => {
			ee.add([e, t]);
		});
	}
	function ne(e) {
		return te || (te = !e, A(), ee.list().forEach(([t, n]) => e ? n(e) : t()), ee.reset()), e;
	}
	function re(t, n, r, i) {
		let { scrollBehavior: a } = e;
		if (!Io || !a) return Promise.resolve();
		let o = !r && Ds(ws(t.fullPath, 0)) || (i || !r) && history.state && history.state.scroll || null;
		return vn().then(() => a(t, n, o)).then((e) => e && Cs(e)).catch((e) => M(e, t, n));
	}
	let ie = (e) => i.go(e), ae, P = /* @__PURE__ */ new Set(), oe = {
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
		go: ie,
		back: () => ie(-1),
		forward: () => ie(1),
		beforeEach: a.add,
		beforeResolve: o.add,
		afterEach: s.add,
		onError: j.add,
		isReady: N,
		install(e) {
			e.component("RouterLink", vc), e.component("RouterView", Tc), e.config.globalProperties.$router = oe, Object.defineProperty(e.config.globalProperties, "$route", {
				enumerable: !0,
				get: () => B(c)
			}), Io && !ae && c.value === ys && (ae = !0, b(i.location).catch((e) => {}));
			let t = {};
			for (let e in ys) Object.defineProperty(t, e, {
				get: () => c.value[e],
				enumerable: !0
			});
			e.provide(zs, oe), e.provide(Bs, /* @__PURE__ */ Ft(t)), e.provide(Vs, c);
			let n = e.unmount;
			P.add(e), e.unmount = function() {
				P.delete(e), P.size < 1 && (l = ys, k && k(), k = null, c.value = ys, ae = !1, te = !1), n();
			};
		}
	};
	function se(e) {
		return e.reduce((e, t) => e.then(() => T(t)), Promise.resolve());
	}
	return oe;
}
function Dc() {
	return Nn(zs);
}
function Oc(e) {
	return Nn(Bs);
}
//#endregion
//#region src/features/kanban/api.ts
var kc = "/api/plugins/kanban", Ac = class extends Error {
	status;
	constructor(e) {
		super(e === 409 ? "Hermes refused this operation in the task’s current state. Refresh and check its dependencies or worker." : `Kanban request failed (${e}).`), this.status = e;
	}
};
function jc(e, t, n = {}) {
	let r = new URLSearchParams(n);
	if (t !== void 0) {
		if (!t) throw Error("Select a board first.");
		r.set("board", t);
	}
	return kc + e + (r.size ? "?" + r : "");
}
async function Mc(e, t = {}, n, r) {
	let i = new Headers({ accept: "application/json" });
	t.body && !(t.body instanceof FormData) && i.set("content-type", "application/json");
	let a = await fetch(jc(e, n, r), {
		...t,
		headers: i,
		credentials: "same-origin",
		redirect: "error",
		cache: "no-store"
	});
	if (!a.ok) throw new Ac(a.status);
	return a.json();
}
var Nc = {
	boards: (e) => Mc("/boards", { signal: e }),
	workflow: (e) => Mc("/workflow", { signal: e }),
	board: (e, t, n) => Mc("/board", { signal: n }, e, { include_archived: String(t) }),
	task: (e, t, n) => Mc("/tasks/" + encodeURIComponent(t), { signal: n }, e),
	log: (e, t, n) => Mc(`/tasks/${encodeURIComponent(t)}/log`, { signal: n }, e, { tail: "16384" }),
	write: (e, t, n, r) => Mc(e, {
		method: t,
		...n === void 0 ? {} : { body: JSON.stringify(n) }
	}, r),
	upload: (e, t, n) => {
		let r = new FormData();
		return r.set("file", n), Mc(`/tasks/${encodeURIComponent(t)}/attachments`, {
			method: "POST",
			body: r
		}, e);
	}
};
async function Pc(e, t) {
	let n = window.__HERMES_PLUGIN_SDK__?.buildWsUrl;
	if (!n) throw Error("Dashboard event authentication is unavailable.");
	let r = await n(kc + "/events", {
		board: e,
		...t === void 0 ? {} : { since: String(t) }
	}), i = new URL(r);
	if (i.host !== location.host || i.protocol !== (location.protocol === "https:" ? "wss:" : "ws:")) throw Error("Invalid dashboard event URL.");
	return i.href;
}
//#endregion
//#region src/features/kanban/context.ts
var Fc = "chathermes.kanban-viewer", Ic = Symbol("kanban");
function Lc() {
	try {
		return localStorage.getItem(Fc) === "true";
	} catch {
		return !1;
	}
}
function Rc(e) {
	let t = /* @__PURE__ */ qt([]), n = /* @__PURE__ */ z(Lc()), r = /* @__PURE__ */ z(!1), i = /* @__PURE__ */ z(!1), a, o = 0;
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
			let e = await Nc.boards(n.signal);
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
				localStorage.setItem(Fc, String(e));
			} catch {}
		}
	}
	function l() {
		document.visibilityState === "visible" && s();
	}
	let u;
	return In(e, () => void s()), sr(() => {
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
		visible: Z(() => n.value && r.value && !e.value),
		setEnabled: c,
		check: s,
		unavailable: () => {
			r.value = !1;
		}
	};
}
function zc(e) {
	let t = Rc(e);
	return Mn(Ic, t), t;
}
function Bc() {
	let e = Nn(Ic);
	if (!e) throw Error("kanban context is missing");
	return e;
}
//#endregion
//#region src/vendor/hermes/json-rpc-channel.ts
var Vc = (e) => typeof e.id == "string" && typeof e.method == "string" && e.method !== "event", Hc = class extends Error {
	code;
	data;
	constructor(e, t) {
		super(e), this.name = "JsonRpcGatewayError", this.code = t?.code, this.data = t?.data;
	}
}, Uc = -32601, Wc = -32603, Gc = 4404;
function Kc(e, t = "Hermes RPC failed") {
	let n = e && typeof e == "object" ? e : {};
	return new Hc(typeof n.message == "string" && n.message ? n.message : t, {
		code: typeof n.code == "number" ? n.code : void 0,
		data: n.data
	});
}
var qc = 12e4, Jc = 8;
new TextDecoder();
var Yc = (e) => {
	e?.unref?.();
}, Xc = class {
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
			requestTimeoutMs: e.requestTimeoutMs ?? qc,
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
			}, n), this.options.unrefTimers && Yc(u.timer)), r && (c = () => {
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
					code: Gc,
					message: e
				} });
			}
		};
		for (let r of this.requestHandlers) {
			let i;
			try {
				i = r(o);
			} catch (r) {
				return o.fail(Wc, `server request handler crashed: ${t}`), this.options.onRequestHandlerError?.(r instanceof Error ? r : Error(String(r)), {
					id: e,
					method: t,
					params: n
				}), !1;
			}
			if (i !== !1) return !0;
		}
		return o.fail(Uc, `no handler for server request: ${t}`), this.options.onUnhandledRequest?.({
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
		if (this.options.heartbeatLiveness === "any-inbound" && (this.lastLivenessAt = Date.now()), Vc(t)) {
			let e = t.params && typeof t.params == "object" ? t.params : {};
			return this.deliverRequest(t.id, t.method, e), t;
		}
		if (t.id !== void 0 && t.id !== null) {
			if (typeof t.id == "string" && this.outstandingPings.delete(t.id)) return this.lastLivenessAt = Date.now(), t;
			let e = this.pending.get(t.id);
			return e && (this.lastLivenessAt = Date.now(), this.clearPending(t.id), t.error ? e.reject(Kc(t.error)) : (this.deliverOpenRequests(t.result), e.resolve(t.result))), t;
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
			this.outstandingPings.add(t), this.outstandingPings.size > Jc && this.outstandingPings.delete(this.outstandingPings.values().next().value);
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
		}, this.options.heartbeatIntervalMs), this.options.unrefTimers && Yc(this.heartbeatTimer));
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
}, Zc = class extends Error {
	outcome;
	constructor(e, t = "unknown") {
		super(e), this.outcome = t;
	}
}, Qc = /* @__PURE__ */ new Map(), $c = (e, t) => JSON.stringify([e || "default", t]), el = {
	snapshot: () => {},
	event: () => {},
	input: () => {},
	requests: () => {},
	connection: () => {},
	recovered: () => {}
}, tl = class e {
	static async create(t, n, r) {
		if (Qc.size >= 32) throw new Zc("Too many unopened drafts", "rejected");
		let i = new e(t, "", el), a = () => i.close();
		r?.addEventListener("abort", a, { once: !0 });
		try {
			r?.throwIfAborted(), await i.ensure();
			let e = await i.call("session.create", n);
			r?.throwIfAborted();
			let a = e.stored_session_id;
			if (typeof a != "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(a)) throw new Zc("Invalid native draft receipt");
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
			})).ok) throw new Zc("Could not persist native draft", "rejected");
			let o = $c(t, a), s = setTimeout(() => {
				Qc.get(o)?.viewer === i && Qc.delete(o), i.close();
			}, 3e5);
			return Qc.set(o, {
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
		if (this.profile = e, this.stored = t, this.hooks = n, e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw new Zc("Invalid profile", "rejected");
		this.channel = new Xc({
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
		return this.detached || this.failed ? Promise.reject(new Zc("Viewer detached")) : this.opening ? this.opening : this.channel.connected && !this.holding ? Promise.resolve() : (this.opening = this.open().catch((e) => {
			throw this.disconnected(), e;
		}), this.opening);
	}
	async open() {
		this.hooks.connection("connecting");
		let e = Qc.get($c(this.profile, this.stored));
		if (this.stored && !e) {
			let e = await fetch(`/api/plugins/chathermes/chat/sessions/${encodeURIComponent(this.stored)}/membership?profile=${encodeURIComponent(this.profile || "default")}`, {
				credentials: "same-origin",
				cache: "no-store",
				redirect: "manual",
				signal: this.abort.signal
			});
			if (!e.ok || e.type === "opaqueredirect") throw new Zc("Session unavailable in this profile", "rejected");
		}
		let t = await fetch("/api/auth/ws-ticket", {
			method: "POST",
			credentials: "same-origin",
			cache: "no-store",
			redirect: "manual",
			signal: this.abort.signal
		});
		if (!t.ok || t.type === "opaqueredirect") throw new Zc("Dashboard sign-in required", "rejected");
		let { ticket: n } = await t.json();
		if (typeof n != "string" || !n || n.length > 1024) throw new Zc("Invalid dashboard ticket", "rejected");
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
				t(new Zc("Native connection timed out"));
			}, 1e4);
			this.cancelOpening = () => {
				clearTimeout(n), t(new Zc("Viewer detached"));
			}, i.onopen = () => {
				if (clearTimeout(n), this.detached || this.ws !== i) {
					t(new Zc("Viewer detached"));
					return;
				}
				this.channel.attach({ send: (e) => i.send(e) }), e();
			}, i.onerror = i.onclose = () => {
				clearTimeout(n), t(new Zc("Native gateway disconnected"));
			};
		}), this.cancelOpening = void 0, i.onerror = i.onclose = () => this.disconnected(), !this.stored) {
			await this.call("gateway.ping"), this.holding = !1, this.channel.startHeartbeat();
			return;
		}
		this.hooks.connection("recovering");
		let a = await this.call("session.resume", {
			session_id: this.stored,
			source: "desktop",
			omit_messages: !0
		});
		if (this.assertLive(), !a || typeof a.session_id != "string" || !Array.isArray(a.messages)) throw new Zc("Invalid native snapshot");
		if ("revision" in a || "execution_generation" in a) throw new Zc("Unsupported native contract", "rejected");
		if (this.runtime = a.session_id, a.running || a.queued) {
			this.requests.clear();
			let e = await this.call("session.activate", {
				session_id: this.runtime,
				omit_messages: !0
			});
			if (this.assertLive(), e.session_id !== this.runtime || !Array.isArray(e.messages)) throw new Zc("Invalid native recovery confirmation");
			!e.running && !e.queued && (a = e, this.held = this.held.filter((e, t) => t >= this.snapshotBoundary || e.type === "request.cancel"));
		}
		e && Qc.get($c(this.profile, this.stored)) === e && (Qc.delete($c(this.profile, this.stored)), clearTimeout(e.timer), e.viewer.close()), this.hooks.snapshot({
			...a,
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
		if (this.detached || this.failed) throw new Zc("Viewer detached", "rejected");
	}
	async call(e, t = {}) {
		if (this.assertLive(), !this.channel.connected) throw new Zc("Native gateway disconnected", "rejected");
		try {
			let n = {
				...t,
				profile: this.profile || "default"
			};
			return await this.channel.request(e, n);
		} catch (t) {
			throw t instanceof Hc ? new Zc("Hermes could not complete this operation", e === "prompt.submit" ? "unknown" : "rejected") : t;
		}
	}
	async rpc(e, t = {}) {
		if (this.assertLive(), !this.channel.connected) throw new Zc("Native gateway disconnected; message not submitted", "rejected");
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
		} else throw new Zc("Unsupported native operation", "rejected");
		return r;
	}
	usage() {
		return this.call("session.usage", { session_id: this.runtime });
	}
	contextBreakdown() {
		return this.call("session.context_breakdown", { session_id: this.runtime });
	}
	async submit(e) {
		if (this.preparing) throw new Zc("Submission already in progress", "rejected");
		this.preparing = !0, this.preparationCancelled = !1;
		let t = () => {
			if (this.assertLive(), this.preparationCancelled) throw new Zc("Message cancelled before submission", "rejected");
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
			if (!r.ok || r.type === "opaqueredirect") throw new Zc("Could not prepare this message; nothing submitted", "rejected");
			let i = await r.json();
			t();
			let a = await this.call("session.activate", {
				session_id: this.runtime,
				omit_messages: !0
			});
			if (a.running || a.queued) throw new Zc("This session is busy", "rejected");
			let o = i.input, s = [];
			for (let e of i.files || []) {
				t();
				let n = await this.call("file.attach", {
					session_id: this.runtime,
					...e
				});
				if (!n.attached || typeof n.ref_text != "string") throw new Zc("Could not stage this file", "rejected");
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
				if (n.confirm_required || n.deferred) throw new Zc("Selected runtime model unavailable", "rejected");
				let r = await this.call("session.activate", {
					session_id: this.runtime,
					omit_messages: !0
				});
				if (r.info.model !== i.model || i.provider && r.info.provider !== i.provider) throw new Zc("Selected runtime model was not applied", "rejected");
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
				if (e.deferred || e.confirm_required || n.value !== i.reasoning_effort) throw new Zc("Selected reasoning effort was not applied", "rejected");
			}
			t();
			let c = await fetch("/api/auth/ws-ticket", {
				method: "POST",
				credentials: "same-origin",
				redirect: "manual",
				signal: this.abort.signal
			});
			if (!c.ok) throw new Zc("Could not retain execution", "rejected");
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
			if (!u.ok || (await u.json()).session_id !== this.runtime) throw new Zc("Could not retain execution; nothing submitted", "rejected");
			return t(), n = !0, await this.call("prompt.submit", {
				session_id: this.runtime,
				text: o
			});
		} catch (e) {
			throw new Zc(n ? "Native submission outcome unknown. Inspect history before sending again." : e instanceof Zc ? e.message : "Message preparation failed", n ? "unknown" : "rejected");
		} finally {
			this.preparing = !1;
		}
	}
	async answer(e, t) {
		this.assertLive();
		let n = this.requests.get(e);
		if (!this.channel.connected || !n) throw new Zc("Request is no longer open", "rejected");
		n.respond(t), this.requests.delete(e), this.publishRequests();
	}
	get boundary() {
		return this.sequence;
	}
	disconnected(e) {
		this.detached || this.failed || (this.failed = !0, this.dispose(), this.hooks.connection("closed", e));
	}
	dispose() {
		this.abort.abort(), this.cancelOpening?.(), this.cancelOpening = void 0, this.channel.detach(new Zc("Viewer detached")), this.ws &&= (this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null, this.ws.close(), void 0), this.requests.clear();
	}
	close() {
		this.detached = !0, this.dispose();
	}
};
//#endregion
//#region src/services/chat-gateway.ts
function nl(e) {
	let t = e;
	if (!t || typeof t != "object" || t.protocol !== "hermes.native.bf0203a7" || t.reviewed_source !== "bf0203a794a07aac3ff764972ab9087baa4e4f4e" || t.mode !== "native-gateway" || t.admission !== !0 || !Array.isArray(t.operations) || !t.operations.every((e) => typeof e == "string") || !Array.isArray(t.blockers) || !t.blockers.every((e) => typeof e == "string") || t.guarantees?.crash_safe_idempotency !== !1 || t.guarantees?.lossless_snapshot_replay !== !1 || t.guarantees?.offline_turn_lease !== !0) throw Error("Unsupported native chat contract");
	return t;
}
async function rl(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	t?.throwIfAborted();
	let n = await fetch(`/api/plugins/chathermes/chat/capabilities?profile=${encodeURIComponent(e || "default")}`, {
		credentials: "same-origin",
		cache: "no-store",
		redirect: "manual",
		signal: t
	});
	if (!n.ok || n.type === "opaqueredirect") throw Error("Sign in to the dashboard to inspect native chat support");
	let r = nl(await n.json()), i = await fetch("/api/auth/ws-ticket", {
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
var il = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, al = /* @__PURE__ */ new Set(), ol = /* @__PURE__ */ new Set(), sl = (e, t) => JSON.stringify([e, t]), cl = "/api/plugins/chathermes";
function ll(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:inbox(?:\?[^#]*|\/[0-9]+(?:\/read)?|\/read(?:\?[^#]*)?)?|session-tracking(?:\/[A-Za-z0-9_-]+)?|artifacts\?[^#]*|project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions(?:\?prepare=1)?|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/messages|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/project|\/branch)?|v1\/(?:capabilities|models))$/.test(t)) throw Error("Invalid Hermes API path.");
	return cl + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function ul(e, t, n = {}, r = "application/json") {
	let i = new Headers(n.headers);
	i.set("accept", r), n.body && i.set("content-type", "application/json");
	let a = await fetch(ll(e, t), {
		...n,
		headers: i,
		credentials: "same-origin",
		redirect: "manual",
		cache: "no-store"
	});
	if (a.type === "opaqueredirect" || a.status >= 300 && a.status < 400) throw Error("Hermes redirected the request. Sign in to the dashboard and retry.");
	return a;
}
async function dl(e, t, n = {}) {
	let r = await ul(e, t, n);
	if (!r.ok) throw new il(r.status, `Request failed (${r.status})`);
	return r.json();
}
function fl(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function pl(e) {
	let t = fl(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function ml(e) {
	return pl(fl(e)?.session ?? e);
}
function hl(e) {
	let t = fl(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(pl),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function gl(e) {
	let t = fl(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !fl(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = fl(t?.pagination);
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
		transcript: fl(t?.transcript)
	};
}
var Q = {
	inbox: (e, t = {}, n) => {
		let r = new URLSearchParams({
			scope: t.scope || "all",
			unread: String(t.unread || !1),
			limit: String(t.limit || 50)
		});
		return t.cursor && r.set("cursor", t.cursor), dl(e, "/inbox?" + r, { signal: n });
	},
	readInbox: (e, t) => dl(e, "/inbox/" + t + "/read", { method: "PUT" }),
	deleteInboxItem: (e, t) => dl(e, "/inbox/" + t, { method: "DELETE" }),
	deleteReadInbox: (e, t) => dl(e, "/inbox/read?scope=" + t, { method: "DELETE" }),
	artifacts: (e, t, n, r) => {
		let i = new URLSearchParams({ limit: "50" });
		return t !== void 0 && i.set("project_id", t), n && i.set("cursor", n), dl(e, `/artifacts?${i}`, { signal: r });
	},
	nativeChatCapabilities: rl,
	isNative: (e) => al.has(e),
	profiles: async () => {
		let e = await fetch(cl + "/profiles", {
			credentials: "same-origin",
			cache: "no-store"
		});
		if (!e.ok) throw new il(e.status, "Could not load profiles");
		return e.json();
	},
	scheduled: (e, t) => dl(e, "/scheduled", { signal: t }),
	scheduledRuns: (e, t, n = 0, r) => dl(e, `/scheduled/runs?job_id=${encodeURIComponent(t)}&offset=${n}`, { signal: r }),
	scheduledOutput: (e, t, n, r) => dl(e, `/scheduled/output?job_id=${encodeURIComponent(t)}&run_id=${encodeURIComponent(n)}`, { signal: r }),
	projects: (e, t) => dl(e, "/projects", { signal: t }),
	project: async (e, t, n) => {
		let r = await dl(e, `/projects/detail?project_id=${encodeURIComponent(t)}`, { signal: n });
		if (r.project?.id !== t || typeof r.project.label != "string") throw Error("Invalid Hermes Project response");
		return r.project;
	},
	projectInstructions: (e, t, n) => dl(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, { signal: n }),
	saveProjectInstructions: (e, t, n) => dl(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify(n)
	}),
	projectManage: (e, t, n) => dl(e, "/projects/manage", {
		method: "POST",
		body: JSON.stringify({
			action: t,
			...n
		})
	}),
	isWorkspace(e, t) {
		return ol.has(sl(e, t));
	},
	workspace(e, t) {
		ol.add(sl(e, t));
	},
	projectCreate: async (e, t) => {
		let n = await dl(e, `/projects/session?project_id=${encodeURIComponent(t)}&prepare=1`, {
			method: "POST",
			body: "{}"
		}), r = n.native_create ? await tl.create(e, n.native_create) : ml(n);
		return ol.add(sl(e, r.id)), r;
	},
	projectEvents(e, t) {
		let n = new EventSource(cl + "/project-events?profile=" + encodeURIComponent(e || "default"), { withCredentials: !0 });
		return n.addEventListener("refresh", t), () => n.close();
	},
	models: (e) => dl(e, "/v1/models"),
	modelOptions: (e) => dl(e, "/api/model/options"),
	async upload(e, t) {
		let n = await fetch(cl + "/uploads" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "POST",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t)
		});
		if (!n.ok) throw new il(n.status, `Upload failed (${n.status})`);
		return n.json();
	},
	capabilities: async (e, t) => {
		let n = await dl(e, "/v1/capabilities", { signal: t });
		return n.features?.native_chat === !0 ? al.add(e) : al.delete(e), n;
	},
	tracking: (e, t) => dl(e, "/session-tracking", { signal: t }),
	track: (e, t, n) => dl(e, `/session-tracking/${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify({ status: n })
	}),
	sessions: async (e, t = 0, n) => hl(await dl(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => {
		let n = await dl(e, "/chat/sessions?prepare=1", {
			method: "POST",
			body: "{}",
			signal: t
		}), r = n.native_create ? await tl.create(e, n.native_create, t) : ml(n);
		return ol.add(sl(e, r.id)), r;
	},
	session: async (e, t, n) => {
		let r = ml(await dl(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n }));
		return (r.cwd || r.source === "desktop") && ol.add(sl(e, t)), r;
	},
	branch: (e, t, n) => dl(e, `/api/sessions/${encodeURIComponent(t)}/branch`, {
		method: "POST",
		body: JSON.stringify({ response_id: n })
	}),
	rename: async (e, t, n, r) => ml(await dl(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	archive: (e, t) => dl(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ archived: !0 })
	}),
	deleteSession: (e, t) => dl(e, `/api/sessions/${encodeURIComponent(t)}`, { method: "DELETE" }),
	moveSession: (e, t, n) => dl(e, `/api/sessions/${encodeURIComponent(t)}/project`, {
		method: "POST",
		body: JSON.stringify({ project_id: n })
	}),
	async latestMessages(e, t, n, r = 0, i) {
		let a;
		try {
			a = gl(await dl(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=120&offset=${r}&order=latest&inline_images=false&include_compacted=true&transcript=1${i ? `&revision=${encodeURIComponent(i)}` : ""}`, { signal: n }));
		} catch (r) {
			if (!(r instanceof il) || r.status !== 404 || !Q.isWorkspace(e, t)) throw r;
			return {
				messages: await Q.messages(e, t, n),
				nextOffset: 0,
				hasMore: !1
			};
		}
		return a.pagination && a.pagination.order !== "latest" ? {
			messages: await Q.messages(e, t, n),
			nextOffset: 0,
			hasMore: !1
		} : {
			messages: a.messages,
			nextOffset: a.transcript?.next_offset ?? r + a.messages.length,
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
				s = gl(await dl(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${o}&order=oldest&inline_images=false&include_compacted=true`, { signal: n }));
			} catch (r) {
				if (o === 0 && r instanceof il && r.status === 404 && ol.has(sl(e, t))) return gl(await dl(e, `/workspace/sessions/${encodeURIComponent(t)}/messages`, { signal: n })).messages;
				throw r;
			}
			let c = JSON.stringify(s.messages);
			if (o && c === i || (i = c, r.push(...s.messages.filter((e) => !e.id || !a.has(e.id) && (a.add(e.id), !0))), !s.pagination || s.pagination.returned < s.pagination.limit || !s.messages.length)) return r;
			o += s.messages.length;
		}
	}
};
function _l(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
//#endregion
//#region src/features/projects/utils/projects.ts
function vl(e) {
	return e.path || e.repos.find((e) => e.path)?.path || void 0;
}
function yl(e) {
	let t = e.repos.flatMap((e) => e.groups.flatMap((e) => e.sessions));
	return [...new Map(t.map((e) => [e.id, e])).values()].sort((e, t) => (t.last_active || 0) - (e.last_active || 0));
}
//#endregion
//#region src/router/links.ts
var bl = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
function xl(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 4096 && !Array.from(e).some((e) => e.charCodeAt(0) < 32 || e === "?" || e === "#") && !e.split(/[\\/]/).some((e) => e === "." || e === "..");
}
var Sl = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
function Cl(e) {
	return typeof e == "string" ? e : "";
}
function wl(e) {
	if (typeof e != "string" || !e.startsWith("/") || e.startsWith("//") || /[\\#\r\n]/.test(e)) return "/";
	let t = new URL(e, "https://plugin.invalid");
	return t.pathname === "/settings" || !/^\/(?:chat\/[^/]+|inbox|kanban|artifacts|projects(?:\/[^/]+(?:\/(?:artifacts|settings|instructions))?)?|scheduled(?:\/[^/]+(?:\/[^/]+)?)?)?$/.test(t.pathname) ? "/" : t.pathname + t.search;
}
function Tl(e, t = "", n = "", r = "", i = {}) {
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
function El(e, t = window.location.origin) {
	try {
		let n = new URL(e, t);
		if (n.origin === t && n.pathname === "/chathermes" && n.hash.startsWith("#/")) return n.hash.slice(1);
	} catch {}
}
//#endregion
//#region src/features/projects/composables/useProjectWorkspace.ts
function Dl(e) {
	let { profile: t, session: n, sessions: r, offline: i, navigate: a } = e, o = Oc(), s = Dc(), c = Z(() => o.query.archived === "1"), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(""), f = /* @__PURE__ */ z([]), p = /* @__PURE__ */ z(), m = /* @__PURE__ */ z(!1), h = /* @__PURE__ */ z(!1), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z(""), v = /* @__PURE__ */ z([]), y = /* @__PURE__ */ z(!1), b = Z(() => d.value ? p.value ? yl(p.value) : [] : r.value.filter((e) => !v.value.includes(e.id))), x, S;
	function C() {
		x?.(), x = void 0, typeof EventSource < "u" && (x = Q.projectEvents(t.value, () => {
			w(), e.refreshInbox();
		}));
	}
	function w() {
		clearTimeout(S), S = setTimeout(() => {
			O(), d.value && A();
		}, 100);
	}
	let T, E, D = Promise.resolve();
	function O() {
		return D = k(), D;
	}
	async function k() {
		T?.abort();
		let e = new AbortController();
		T = e;
		let n = t.value;
		m.value = !y.value, g.value = "";
		try {
			let r = await Q.projects(n, e.signal);
			if (e !== T || e.signal.aborted || n !== t.value) return;
			if (!Array.isArray(r.projects) || r.projects.some((e) => !e || typeof e.id != "string" || typeof e.label != "string")) throw Error("Invalid Hermes Projects response");
			f.value = r.projects, v.value = r.scoped_session_ids || [], y.value = !0;
		} catch {
			e === T && !e.signal.aborted && (g.value = "Could not load Projects.");
		} finally {
			e === T && (m.value = !1);
		}
	}
	async function A() {
		E?.abort();
		let e = new AbortController();
		E = e;
		let n = t.value, r = d.value;
		if (r) {
			h.value = !p.value, _.value = "";
			try {
				let i = await Q.project(n, r, e.signal);
				e === E && !e.signal.aborted && n === t.value && r === d.value && (p.value = i);
			} catch (t) {
				e === E && !e.signal.aborted && (_.value = t instanceof il && t.status === 404 ? "Project no longer exists. Return to Other chats." : "Could not load this Project. Retry or return to Other chats.");
			} finally {
				e === E && (h.value = !1);
			}
		}
	}
	async function ee(e) {
		return a(e ? {
			...Tl("project", t.value, n.value, e),
			params: { projectId: e }
		} : Tl("home", t.value, n.value));
	}
	function j(e = !1) {
		return a(Tl("projects", t.value, n.value, d.value, e ? { archived: "1" } : {}));
	}
	async function te(n, r) {
		if (l.value || i.value) return;
		let a = t.value, f = e.profileGeneration(), m = d.value, h = s.currentRoute.value;
		l.value = !0, u.value = "";
		try {
			let i = await Q.projectManage(a, n, r);
			if (f !== e.profileGeneration() || a !== t.value || h !== s.currentRoute.value) return;
			n === "create" && i.project?.id ? await ee(i.project.id) : m === d.value && o.name !== "projects" && (n === "delete" ? (d.value = "", p.value = void 0, j(c.value)) : n === "archive" ? (d.value = "", p.value = void 0, j(r.restore !== !0)) : await A()), f === e.profileGeneration() && (await O(), await e.loadSessions());
		} catch {
			f === e.profileGeneration() && a === t.value && h === s.currentRoute.value && (u.value = "Could not save the project. Check its fields and try again.");
		} finally {
			f === e.profileGeneration() && (l.value = !1);
		}
	}
	function M() {
		T?.abort(), E?.abort(), x?.(), x = void 0, clearTimeout(S), y.value = !1, v.value = [], d.value = "", l.value = !1, u.value = "", p.value = void 0, f.value = [], _.value = "", g.value = "", h.value = !1;
	}
	function N(e) {
		E?.abort(), d.value = e, p.value = void 0, _.value = "", h.value = !1, e && A();
	}
	return we(() => {
		x?.(), clearTimeout(S), T?.abort(), E?.abort();
	}), {
		projectBusy: l,
		manageError: u,
		projectId: d,
		projects: f,
		selectedProject: p,
		projectsLoading: m,
		projectLoading: h,
		projectsError: g,
		projectError: _,
		projectsLoaded: y,
		visibleSessions: b,
		subscribeProjectEvents: C,
		refreshProjects: w,
		loadProjects: O,
		loadProject: A,
		chooseProject: ee,
		showProjects: j,
		manageProject: te,
		resetProjects: M,
		selectProjectScope: N,
		whenProjectsLoaded: () => D
	};
}
//#endregion
//#region src/utils/message-image.ts
function Ol(e) {
	return typeof e == "string" && /^(?:data:image\/|https?:\/\/|\/api\/plugins\/chathermes\/artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+$)/.test(e);
}
//#endregion
//#region node_modules/mdurl/lib/decode.mjs
var kl = {};
function Al(e) {
	let t = kl[e];
	if (t) return t;
	t = kl[e] = [];
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
function jl(e, t) {
	typeof t != "string" && (t = jl.defaultChars);
	let n = Al(t);
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
jl.defaultChars = ";/?:@&=+$,#", jl.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var Ml = {};
function Nl(e) {
	let t = Ml[e];
	if (t) return t;
	t = Ml[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function Pl(e, t, n) {
	typeof t != "string" && (n = t, t = Pl.defaultChars), n === void 0 && (n = !0);
	let r = Nl(t), i = "";
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
Pl.defaultChars = ";/?:@&=+$,-_.!~*'()#", Pl.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function Fl(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function Il() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var Ll = /^([a-z0-9.+-]+:)/i, Rl = /:[0-9]*$/, zl = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Bl = [
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
], Vl = [
	"/",
	"?",
	"#"
], Hl = 255, Ul = /^[+a-z0-9A-Z_-]{0,63}$/, Wl = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Gl = {
	javascript: !0,
	"javascript:": !0
}, Kl = {
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
function ql(e, t) {
	if (e && e instanceof Il) return e;
	let n = new Il();
	return n.parse(e, t), n;
}
Il.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = zl.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = Ll.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && Gl[o]) && (a = a.substr(2), this.slashes = !0)), !Gl[o] && (i || o && !Kl[o])) {
		let e = -1;
		for (let t = 0; t < Vl.length; t++) r = a.indexOf(Vl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < Bl.length; t++) r = a.indexOf(Bl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(Ul)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(Ul)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(Wl);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > Hl && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), Kl[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, Il.prototype.parseHost = function(e) {
	let t = Rl.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region node_modules/mdurl/index.mjs
var Jl = /* @__PURE__ */ t({
	decode: () => jl,
	encode: () => Pl,
	format: () => Fl,
	parse: () => ql
}), Yl = /* @__PURE__ */ t({
	Any: () => Xl,
	Cc: () => Zl,
	Cf: () => Ql,
	P: () => $l,
	S: () => eu,
	Z: () => tu
}), Xl = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Zl = /[\0-\x1F\x7F-\x9F]/, Ql = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, $l = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, eu = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, tu = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, nu = [
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
function ru(e) {
	return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function iu(e) {
	return ru(e) ? 65533 : e >= 128 && e <= 159 && nu[e - 128] || e;
}
function au(e) {
	return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(iu(e));
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/internal/decode-shared.js
var ou = /* #__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(127), t = 0;
	for (let n = 33; n <= 126; n++) n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
	return e;
})();
function su(e, t, n, r, i, a) {
	let o = e.length, s = a * 90, c = 0, l = () => {
		let t = ou[e.charCodeAt(c++)];
		return t < a ? t : t * 91 - s + ou[e.charCodeAt(c++)];
	}, u = n - r, d = n + i, f = new Int32Array(d);
	f.fill(-1, r, a), f.fill(-1, a + u, d);
	let p = new Int32Array(d), m = new Int32Array(d);
	function h(t, n) {
		let r = 0, i = n, a = n + t;
		for (; i < a;) {
			let t = ou[e.charCodeAt(c++)];
			if (t < 89) r += t, f[i++] = r;
			else if (t === 89) {
				let t = ou[e.charCodeAt(c++)] + 2;
				for (; t--;) f[i++] = ++r;
			} else {
				let t = ou[e.charCodeAt(c++)];
				r += 89 + (t < 90 ? t * 91 + ou[e.charCodeAt(c++)] : ou[e.charCodeAt(c++)] * 8281 + ou[e.charCodeAt(c++)] * 91 + ou[e.charCodeAt(c++)]), f[i++] = r;
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
		let t = ou[e.charCodeAt(c++)];
		t >= a && (t = t * 91 - s + ou[e.charCodeAt(c++)]);
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
var cu = /* #__PURE__ */ su("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61), lu;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(lu ||= {});
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/decode.js
var uu;
(function(e) {
	e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(uu ||= {});
var du = 32, fu = 21, pu = 2097151, mu = 2047, hu = 0;
function gu(e) {
	let t = e >>> fu;
	return t === mu ? hu : t;
}
function _u(e) {
	return e - uu.ZERO >>> 0 <= 9;
}
function vu(e) {
	return (e | du) - uu.LOWER_A >>> 0 <= 5;
}
function yu(e) {
	return (e | du) - uu.LOWER_A >>> 0 <= 25;
}
function bu(e) {
	return e === uu.EQUALS || yu(e) || _u(e);
}
var xu;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(xu ||= {});
var Su;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Su ||= {});
function Cu(e, t, n, r) {
	let i = (t & lu.BRANCH_LENGTH) >> 7, a = t & lu.JUMP_TABLE;
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
function wu(e, t, n) {
	return n === 1 ? String.fromCharCode(e[t] & lu.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function Tu(e, t, n) {
	let r = t + 1, i = 0, a = r;
	if (r < n && (e.charCodeAt(r) | du) === uu.LOWER_X) for (r += 1, a = r; r < n;) {
		let t = e.charCodeAt(r);
		if (_u(t)) i = i * 16 + (t - uu.ZERO);
		else if (vu(t)) i = i * 16 + ((t | du) - uu.LOWER_A + 10);
		else break;
		r += 1;
	}
	else for (; r < n;) {
		let t = e.charCodeAt(r) - uu.ZERO;
		if (t >>> 0 > 9) break;
		i = i * 10 + t, r += 1;
	}
	if (r === a) return 0;
	r < n && e.charCodeAt(r) === uu.SEMI && (r += 1), i > 1114111 && (i = 1114112);
	let o = r - t;
	return o >= mu && (hu = o, o = mu), o << fu | i;
}
function Eu(e, t, n) {
	let r = cu, i = e.indexOf("&");
	if (i < 0) return e;
	let a = e.length, o = 0, s = "", c = r[0], l = c & lu.JUMP_TABLE, u = (c & lu.BRANCH_LENGTH) >> 7;
	do {
		let c = i + 1, d = e.charCodeAt(c), f, p;
		if (d === uu.NUM) {
			let n = Tu(e, c, a);
			f = gu(n), t && f > 0 && e.charCodeAt(c + f - 1) !== uu.SEMI && (f = 0), p = f === 0 ? "" : au(n & pu);
		} else if (yu(d)) {
			f = 0, p = "";
			let n = d - l, i;
			if (n >>> 0 < u) {
				let e = r[1 + n];
				i = e === 0 ? -1 : u + e & 65535;
			} else i = -1;
			let o = 0, s = 0, m = i < 0 ? 0 : r[i], h = c + 1;
			trie: for (; h < a;) {
				for (; (m & (lu.VALUE_LENGTH | lu.FLAG13)) === 0 && (m & lu.JUMP_TABLE) !== 0;) {
					let t = m & lu.JUMP_TABLE, n = (m & lu.BRANCH_LENGTH) >> 7;
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
				if ((m & (lu.VALUE_LENGTH | lu.FLAG13)) === lu.FLAG13) {
					let t = (m & lu.BRANCH_LENGTH) >> 7;
					if (e.charCodeAt(h) !== (m & lu.JUMP_TABLE)) break;
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
					if (l === uu.SEMI) {
						f = h - c + 1, p = n === 1 ? String.fromCharCode(m & lu.VALUE_MASK) : wu(r, i, n);
						break;
					}
					if (!t && (m & lu.FLAG13) === 0 && (f = h - c, o = i, s = n), n === 1) break;
				}
				let u = Cu(r, m, i + (n || 1), l);
				if (u < 0) break;
				i = u, m = r[i], h += 1;
			}
			if (p === "") {
				let e = m >>> 14;
				e !== 0 && !t && (m & lu.FLAG13) === 0 && (f = h - c, o = i, s = e), f > 0 && (p = wu(r, o, s));
			}
		} else f = 0, p = "";
		f === 0 || n && d !== uu.NUM && e.charCodeAt(c + f - 1) !== uu.SEMI && c + f < a && bu(e.charCodeAt(c + f)) ? i = c : (o < i && (s += e.slice(o, i)), s += p, i = o = c + f), e.charCodeAt(i) !== uu.AMP && (i = e.indexOf("&", i));
	} while (i >= 0);
	return s + e.slice(o);
}
function Du(e) {
	return Eu(e, !0, !1);
}
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var Ou = class {
	src_Any = Xl.source;
	src_Cc = Zl.source;
	src_Z = tu.source;
	src_P = $l.source;
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
}, ku = {
	validate: (e, t, n) => {
		let r = n.re.get_http_validator();
		r.lastIndex = t;
		let i = r.exec(e);
		return i ? i[0].length : 0;
	},
	normalize: (e, t) => t.normalize(e)
}, Au = {
	"http:": ku,
	"https:": ku,
	"ftp:": ku,
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
}, ju = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", Mu = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function Nu() {
	let e = Mu.split("|");
	return ju.split("|").forEach((t) => {
		let n = t.indexOf(":"), r = t.slice(0, n);
		for (let i of t.slice(n + 1)) e.push(r + i);
	}), e;
}
var Pu = {
	fuzzyLink: !1,
	fuzzyEmail: !0,
	fuzzyIP: !1,
	"---": !1,
	tlds: Nu(),
	urlAuth: !1,
	maxLength: 1e4
}, Fu = class {
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
}, Iu = class {
	__opts__;
	__schemas__;
	re;
	constructor(e = {}) {
		let { rebuilder: t, ...n } = e;
		this.__opts__ = {
			...Pu,
			...n
		}, this.__schemas__ = { ...Au }, this.re = t || new Ou(), this.re.set({
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
			let _ = new Fu(e, g.schema, g.index, g.lastIndex);
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
		let r = new Fu(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
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
}, Lu = 2147483647, Ru = 36, zu = 1, Bu = 26, Vu = 38, Hu = 700, Uu = 72, Wu = 128, Gu = "-", Ku = /^xn--/, qu = /[^\0-\x7F]/, Ju = /[\x2E\u3002\uFF0E\uFF61]/g, Yu = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, Xu = 35, Zu = Math.floor, Qu = String.fromCharCode;
function $u(e) {
	throw RangeError(Yu[e]);
}
function ed(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function td(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(Ju, ".");
	let i = ed(e.split("."), t).join(".");
	return r + i;
}
function nd(e) {
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
var rd = (e) => String.fromCodePoint(...e), id = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : Ru;
}, ad = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, od = function(e, t, n) {
	let r = 0;
	for (e = n ? Zu(e / Hu) : e >> 1, e += Zu(e / t); e > 455; r += Ru) e = Zu(e / Xu);
	return Zu(r + 36 * e / (e + Vu));
}, sd = function(e) {
	let t = [], n = e.length, r = 0, i = Wu, a = Uu, o = e.lastIndexOf(Gu);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && $u("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = Ru;; i += Ru) {
			s >= n && $u("invalid-input");
			let o = id(e.charCodeAt(s++));
			o >= Ru && $u("invalid-input"), o > Zu((Lu - r) / t) && $u("overflow"), r += o * t;
			let c = i <= a ? zu : i >= a + Bu ? Bu : i - a;
			if (o < c) break;
			let l = Ru - c;
			t > Zu(Lu / l) && $u("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = od(r - o, c, o == 0), Zu(r / c) > Lu - i && $u("overflow"), i += Zu(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, cd = function(e) {
	let t = [];
	e = nd(e);
	let n = e.length, r = Wu, i = 0, a = Uu;
	for (let n of e) n < 128 && t.push(Qu(n));
	let o = t.length, s = o;
	for (o && t.push(Gu); s < n;) {
		let n = Lu;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > Zu((Lu - i) / c) && $u("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > Lu && $u("overflow"), n === r) {
			let e = i;
			for (let n = Ru;; n += Ru) {
				let r = n <= a ? zu : n >= a + Bu ? Bu : n - a;
				if (e < r) break;
				let i = e - r, o = Ru - r;
				t.push(Qu(ad(r + i % o, 0))), e = Zu(i / o);
			}
			t.push(Qu(ad(e, 0))), a = od(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, ld = {
	version: "2.3.1",
	ucs2: {
		decode: nd,
		encode: rd
	},
	decode: sd,
	encode: cd,
	toASCII: function(e) {
		return td(e, function(e) {
			return qu.test(e) ? "xn--" + cd(e) : e;
		});
	},
	toUnicode: function(e) {
		return td(e, function(e) {
			return Ku.test(e) ? sd(e.slice(4).toLowerCase()) : e;
		});
	}
}, ud = Object.defineProperty, dd = (e, t) => {
	let n = {};
	for (var r in e) ud(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || ud(n, Symbol.toStringTag, { value: "Module" }), n;
}, fd = /* @__PURE__ */ dd({
	arrayReplaceAt: () => md,
	asciiTrim: () => Ld,
	callable: () => pd,
	escapeHtml: () => Dd,
	escapeRE: () => kd,
	fromCodePoint: () => gd,
	isMdAsciiPunct: () => Pd,
	isPunctChar: () => Md,
	isPunctCharCode: () => Nd,
	isSpace: () => Ad,
	isValidEntityCode: () => hd,
	isWhiteSpace: () => jd,
	lib: () => Rd,
	normalizeReference: () => Fd,
	unescapeAll: () => Sd,
	unescapeMd: () => xd
});
function pd(e) {
	let t = function(...n) {
		return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
	};
	return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function md(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function hd(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function gd(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var _d = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, vd = RegExp(`${_d.source}|&([a-z#][a-z0-9]{1,31});`, "gi"), yd = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function bd(e, t) {
	if (t.charCodeAt(0) === 35 && yd.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return hd(n) ? gd(n) : e;
	}
	let n = Du(e);
	return n === e ? e : n;
}
function xd(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(_d, "$1");
}
function Sd(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(vd, function(e, t, n) {
		return t || bd(e, n);
	});
}
var Cd = /[&<>"]/, wd = /[&<>"]/g, Td = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Ed(e) {
	return Td[e];
}
function Dd(e) {
	return Cd.test(e) ? e.replace(wd, Ed) : e;
}
var Od = /[.?*+^$[\]\\(){}|-]/g;
function kd(e) {
	return e.replace(Od, "\\$&");
}
function Ad(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function jd(e) {
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
function Md(e) {
	return $l.test(e) || eu.test(e);
}
function Nd(e) {
	return Md(gd(e));
}
function Pd(e) {
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
function Fd(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function Id(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function Ld(e) {
	let t = 0;
	for (; t < e.length && Id(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && Id(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var Rd = {
	mdurl: Jl,
	ucmicro: Yl
};
function zd(e, t, n) {
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
function Bd(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = Sd(e.slice(t + 1, i)), a.ok = !0, a;
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
	return t === i || o !== 0 ? a : (a.str = Sd(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function Vd(e, t, n, r) {
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
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += Sd(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += Sd(e.slice(t, a)), o;
}
var Hd = /* @__PURE__ */ dd({
	parseLinkDestination: () => Bd,
	parseLinkLabel: () => zd,
	parseLinkTitle: () => Vd
});
function Ud(e) {
	"@babel/helpers - typeof";
	return Ud = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Ud(e);
}
function Wd(e, t) {
	if (Ud(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (Ud(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Gd(e) {
	var t = Wd(e, "string");
	return Ud(t) == "symbol" ? t : t + "";
}
function $(e, t, n) {
	return (t = Gd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
var Kd = class {
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
}, qd = class {
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
}, Jd = {};
Jd.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return `<code${i.renderAttrs(a)}>${Dd(a.content)}</code>`;
}, Jd.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return `<pre${i.renderAttrs(a)}><code>${Dd(e[t].content)}</code></pre>\n`;
}, Jd.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? Sd(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || Dd(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", `${n.langPrefix}${s}`]) : (t[e] = [t[e][0], t[e][1]], t[e][1] += ` ${n.langPrefix}${s}`);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, Jd.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, Jd.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, Jd.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, Jd.text = function(e, t) {
	return Dd(e[t].content);
}, Jd.html_block = function(e, t) {
	return e[t].content;
}, Jd.html_inline = function(e, t) {
	return e[t].content;
};
var Yd = class {
	constructor() {
		$(this, "rules", Object.assign({}, Jd));
	}
	renderAttrs(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${Dd(e.attrs[t][0])}="${Dd(String(e.attrs[t][1]))}"`;
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
}, Xd = class {
	constructor(e, t, n) {
		$(this, "tokens", []), $(this, "inlineMode", !1), $(this, "Token", Kd), this.src = e, this.env = n, this.md = t;
	}
}, Zd = /\r\n?/g, Qd = /\0/g;
function $d(e) {
	let t;
	t = e.src.replace(Zd, "\n"), t = t.replace(Qd, "�"), e.src = t;
}
function ef(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function tf(e) {
	let t = e.tokens, n = 0;
	for (let e = 0; e < t.length; e++) t[e].type !== "reference_definition" && (e !== n && (t[n] = t[e]), n++);
	t.length !== n && (t.length = n);
}
function nf(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function rf(e) {
	return /^<a[>\s]/i.test(e);
}
function af(e) {
	return /^<\/a\s*>/i.test(e);
}
function of(e) {
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
			if (n.type === "html_inline" && (rf(n.content) && a > 0 && a--, af(n.content) && a++), !(a > 0) && n.type === "text" && e.md.linkify.test(n.content)) {
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
var sf = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, cf = /\((c|tm|r)\)/i, lf = /\((c|tm|r)\)/gi, uf = {
	c: "©",
	r: "®",
	tm: "™"
};
function df(e, t) {
	return uf[t.toLowerCase()];
}
function ff(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(lf, df)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function pf(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && sf.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function mf(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (cf.test(e.tokens[t].content) && ff(e.tokens[t].children), sf.test(e.tokens[t].content) && pf(e.tokens[t].children));
}
var hf = /['"]/, gf = /['"]/g, _f = "’", vf = 1e3;
function yf(e, t, n) {
	for (; e.length > n;) {
		let n = e.pop();
		n.isSingleQuote ? t.single = n.prevSameQuoteIdx : t.double = n.prevSameQuoteIdx;
	}
}
function bf(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function xf(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function Sf(e, t) {
	let n, r = [], i = {
		single: -1,
		double: -1
	}, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = e[o].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= c); n--);
		if (yf(r, i, n + 1), s.type !== "text") continue;
		let l = s.content, u = 0, d = l.length;
		OUTER: for (; u < d;) {
			gf.lastIndex = u;
			let s = gf.exec(l);
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
			let _ = Pd(h) || Nd(h), v = Pd(g) || Nd(g), y = jd(h), b = jd(g);
			if (b ? f = !1 : v && (y || _ || (f = !1)), y ? p = !1 : _ && (b || v || (p = !1)), g === 34 && s[0] === "\"" && h >= 48 && h <= 57 && (p = f = !1), f && p && (f = _, p = v), !f && !p) {
				m && bf(a, o, s.index, _f);
				continue;
			}
			if (p && (n = m ? i.single : i.double, n >= 0 && r[n].level === c)) {
				let e = r[n], c, l;
				m ? (c = t.md.options.quotes[2], l = t.md.options.quotes[3]) : (c = t.md.options.quotes[0], l = t.md.options.quotes[1]), bf(a, o, s.index, l), bf(a, e.tokenIdx, e.contentPos, c), yf(r, i, n);
				continue OUTER;
			}
			if (f) {
				if (r.length >= vf) return;
				r.push({
					tokenIdx: o,
					contentPos: s.index,
					isSingleQuote: m,
					level: c,
					prevSameQuoteIdx: m ? i.single : i.double
				}), m ? i.single = r.length - 1 : i.double = r.length - 1;
			} else p && m && bf(a, o, s.index, _f);
		}
	}
	Object.keys(a).forEach(function(t) {
		let n = Number(t);
		e[n].content = xf(e[n].content, a[t]);
	});
}
function Cf(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && hf.test(e.tokens[t].content) && Sf(e.tokens[t].children, e);
}
function wf(e) {
	let t, n, r = e.length;
	for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
	for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
	t !== n && (e.length = n);
}
function Tf(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text"), i[t].children && wf(i[t].children);
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var Ef = [
	["normalize", $d],
	["block", ef],
	["strip_references", tf],
	["inline", nf],
	["linkify", of],
	["replacements", mf],
	["smartquotes", Cf],
	["text_join", Tf]
], Df = class {
	constructor() {
		$(this, "ruler", new qd()), $(this, "State", Xd);
		for (let e = 0; e < Ef.length; e++) this.ruler.push(Ef[e][0], Ef[e][1]);
	}
	process(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}
}, Of = class {
	constructor(e, t, n, r) {
		$(this, "bMarks", []), $(this, "eMarks", []), $(this, "tShift", []), $(this, "sCount", []), $(this, "bsCount", []), $(this, "blkIndent", 0), $(this, "line", 0), $(this, "lineMax", 0), $(this, "tight", !1), $(this, "listIndent", -1), $(this, "parentType", "root"), $(this, "level", 0), $(this, "Token", Kd), this.src = e, this.md = t, this.env = n, this.tokens = r;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) {
				if (Ad(s)) {
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
		let r = new Kd(e, t, n);
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
		for (let t = this.src.length; e < t && Ad(this.src.charCodeAt(e)); e++);
		return e;
	}
	skipSpacesBack(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!Ad(this.src.charCodeAt(--e))) return e + 1;
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
				if (Ad(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}
}, kf = 65536;
function Af(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function jf(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Mf(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !Ad(s) || o === 45 && Ad(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !Ad(t)) return !1;
		a++;
	}
	let c = Af(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = Af(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = jf(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
		if (r || (c = Af(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = jf(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > kf)) break;
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
function Nf(e, t, n) {
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
function Pf(e, t, n, r) {
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
function Ff(e, t, n, r) {
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
				if (Ad(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
function If(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !Ad(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function Lf(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !Ad(e.src.charCodeAt(r)) ? -1 : r;
}
function Rf(e, t) {
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
	return i < r && (a = e.src.charCodeAt(i), !Ad(a)) ? -1 : i;
}
function zf(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Bf(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = Rf(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Lf(e, c)) >= 0) d = !1;
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
			if (p = Rf(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Lf(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && zf(e, h), !0;
}
function Vf(e, t, n, r) {
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
		} else if (!Ad(e)) break;
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
		} else if (!Ad(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && Ad(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && Ad(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Fd(c.slice(1, l));
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
var Hf = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), Uf = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", Wf = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Gf = RegExp(`^(?:${Uf}|${Wf}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`), Kf = RegExp(`^(?:${Uf}|${Wf})`), qf = [
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
		RegExp(`^</?(${Hf.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		!0
	],
	[
		RegExp(`${Kf.source}\\s*$`),
		/^$/,
		!1
	]
];
function Jf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < qf.length && !qf[s][0].test(o); s++);
	if (s === qf.length) return !1;
	if (r) return qf[s][2];
	let c = t + 1, l = qf[s][1].test("");
	if (!qf[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), qf[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function Yf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !Ad(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && Ad(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", `h${s}`, 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = Ld(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", `h${s}`, -1);
	return d.markup = "########".slice(0, s), !0;
}
function Xf(e, t, n) {
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
	let c = Ld(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", `h${a}`, 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", `h${a}`, -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function Zf(e, t, n) {
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
	let o = Ld(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var Qf = [
	[
		"table",
		Mf,
		["paragraph", "reference"]
	],
	["code", Nf],
	[
		"fence",
		Pf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		Ff,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		If,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Bf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", Vf],
	[
		"html_block",
		Jf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Yf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", Xf],
	["paragraph", Zf]
], $f = class {
	constructor() {
		$(this, "ruler", new qd()), $(this, "State", Of);
		for (let e = 0; e < Qf.length; e++) this.ruler.push(Qf[e][0], Qf[e][1], { alt: (Qf[e][2] || []).slice() });
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
}, ep = class {
	constructor(e, t, n, r) {
		$(this, "pos", 0), $(this, "level", 0), $(this, "pending", ""), $(this, "pendingLevel", 0), $(this, "cache", {}), $(this, "backticks", {}), $(this, "backticksScanned", !1), $(this, "linkLevel", 0), $(this, "delimiters", []), $(this, "_prev_delimiters", []), $(this, "Token", Kd), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
	}
	pushPending() {
		let e = new Kd("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}
	push(e, t, n) {
		this.pending && this.pushPending();
		let r = new Kd(e, t, n), i;
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
		let c = Pd(i) || Nd(i), l = Pd(s) || Nd(s), u = jd(i), d = jd(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}
};
function tp(e) {
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
function np(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !tp(e.src.charCodeAt(n));) n++;
	return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function rp(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function ip(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function ap(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = n - Math.min(10, e.pending.length, n), a = n;
	for (; a > i && ip(e.src.charCodeAt(a - 1));) a--;
	if (a === n || !rp(e.src.charCodeAt(a))) return !1;
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
function op(e, t) {
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
	for (n++; n < i && Ad(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var sp = [];
for (let e = 0; e < 256; e++) sp.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	sp[e.charCodeAt(0)] = 1;
});
function cp(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), Ad(i));) n++;
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
		t.content = i < 256 && sp[i] !== 0 ? a : o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function lp(e) {
	let t = {}, n = 0;
	for (; (n = e.indexOf("`", n)) !== -1;) {
		let r = n;
		for (; e.charCodeAt(++n) === 96;);
		t[n - r] = r;
	}
	return t;
}
function up(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = e.posMax, i = n + 1;
	for (; i < r && e.src.charCodeAt(i) === 96;) i++;
	let a = e.src.slice(n, i), o = a.length;
	if (e.backticksScanned ||= (e.backticks = lp(e.src), !0), (e.backticks[o] ?? -1) >= i) {
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
function dp(e, t) {
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
function fp(e, t) {
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
function pp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	fp(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && fp(e, n);
	}
}
var mp = {
	tokenize: dp,
	postProcess: pp
};
function hp(e, t) {
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
function gp(e, t) {
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
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), Ad(n) || n === 10); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), Ad(n) || n === 10); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), Ad(n) || n === 10); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), r = Fd(r), a = e.env.references[r], !a) return e.pos = u, !1;
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
function bp(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), Ad(n) || n === 10); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), Ad(n) || n === 10); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), Ad(n) || n === 10); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), i = Fd(i), o = e.env.references[i], !o) return e.pos = d, !1;
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
var xp = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Sp = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Cp(e, t) {
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
	if (Sp.test(a)) {
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
	if (xp.test(a)) {
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
function wp(e) {
	return /^<a[>\s]/i.test(e);
}
function Tp(e) {
	return /^<\/a\s*>/i.test(e);
}
function Ep(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function Dp(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !Ep(i)) return !1;
	let a = e.src.slice(r).match(Gf);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], wp(t.content) && e.linkLevel++, Tp(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var Op = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, kp = /^&([a-z][a-z0-9]{1,31});/i;
function Ap(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(Op);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = hd(t) ? gd(t) : gd(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(kp);
		if (r) {
			let n = Du(r[0]);
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
function jp(e) {
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
function Mp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	jp(e.delimiters);
	for (let e = 0; e < n; e++) {
		let n = t[e]?.delimiters;
		n && jp(n);
	}
}
function Np(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Pp = [
	["text", np],
	["linkify", ap],
	["newline", op],
	["escape", cp],
	["backticks", up],
	["strikethrough", mp.tokenize],
	["emphasis", vp.tokenize],
	["link", yp],
	["image", bp],
	["autolink", Cp],
	["html_inline", Dp],
	["entity", Ap]
], Fp = [
	["balance_pairs", Mp],
	["strikethrough", mp.postProcess],
	["emphasis", vp.postProcess],
	["fragments_join", Np]
], Ip = class {
	constructor() {
		$(this, "ruler", new qd()), $(this, "ruler2", new qd()), $(this, "State", ep);
		for (let e = 0; e < Pp.length; e++) this.ruler.push(Pp[e][0], Pp[e][1]);
		for (let e = 0; e < Fp.length; e++) this.ruler2.push(Fp[e][0], Fp[e][1]);
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
}, Lp = {
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
}, Rp = /^(vbscript|javascript|file|data):/, zp = /^data:image\/(gif|png|jpeg|webp);/, Bp = [
	"http:",
	"https:",
	"mailto:"
], Vp = class {
	validateLink(e) {
		let t = e.trim().toLowerCase();
		return !Rp.test(t) || zp.test(t);
	}
	normalizeLink(e) {
		let t = ql(e, !0);
		if (t.hostname && (!t.protocol || Bp.indexOf(t.protocol) >= 0)) try {
			t.hostname = ld.toASCII(t.hostname);
		} catch {}
		return t.auth &&= Pl(t.auth), t.hostname &&= Pl(t.hostname), t.pathname &&= Pl(t.pathname), t.search &&= Pl(t.search), t.hash &&= Pl(t.hash), Fl(t);
	}
	normalizeLinkText(e) {
		let t = ql(e, !0);
		if (t.hostname && (!t.protocol || Bp.indexOf(t.protocol) >= 0)) try {
			t.hostname = ld.toUnicode(t.hostname);
		} catch {}
		return jl(Fl(t), jl.defaultChars + "%");
	}
	constructor(...e) {
		$(this, "inline", new Ip()), $(this, "block", new $f()), $(this, "core", new Df()), $(this, "renderer", new Yd()), $(this, "linkify", new Iu()), $(this, "utils", fd), $(this, "helpers", Object.assign({}, Hd));
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
			if (t = Lp[n], !t) throw Error(`Wrong 'markdown-it' preset "${n}", check name`);
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
$(Vp, "Token", Kd), $(Vp, "Ruler", qd), $(Vp, "Renderer", Yd), $(Vp, "ParserCore", Df), $(Vp, "StateCore", Xd), $(Vp, "ParserBlock", $f), $(Vp, "StateBlock", Of), $(Vp, "ParserInline", Ip), $(Vp, "StateInline", ep);
var Hp = pd(Vp), Up = {
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
}, Wp = new Set("txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split(" ")), Gp = `(?:~/|/|[A-Za-z]:[/\\\\])\\S+?(?:[^\\S\\n]+\\S+?)*?\\.(?:${"png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm".split(" ").sort((e, t) => t.length - e.length).join("|")})(?=[\\s\`"'*_,;:)\\]}]|MEDIA:|$)`, Kp = RegExp(`MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${Gp}|[^\\s\`"]+)`, "g");
function qp(e) {
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
var Jp = new Hp({ html: !0 });
for (let e of ["image", "link"]) {
	let t = Jp.inline.ruler.__rules__.find((t) => t.name === e).fn;
	Jp.inline.ruler.at(e, (n, r) => {
		let i = n.pos, a = n.tokens.length, o = t(n, r), s = n.tokens.slice(a).find((t) => t.type === (e === "image" ? "image" : "link_open"));
		return !r && s && (s.type === "image" || s.type === "link_open") && (s.meta = {
			deliveryRange: [i, n.pos],
			escapedImage: e === "link" && n.src[i - 1] === "!"
		}), o;
	});
}
function Yp(e, t) {
	let n = Jp.parseInline(e, {})[0]?.children || [], r = 0, i = 0;
	for (let a of n) {
		let n = a.type === "image" ? a.attrGet("src") : a.type === "link_open" ? a.attrGet("href") : void 0;
		if (typeof n != "string" || !n.startsWith("MEDIA:")) continue;
		let o;
		try {
			o = decodeURIComponent(n.slice(6));
		} catch {
			continue;
		}
		if (!/^(?:\/(?!\/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)/i.test(o) || o.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) || !a.meta?.deliveryRange || a.meta.escapedImage) continue;
		let [s, c] = a.meta.deliveryRange;
		t(o) && (s < i || (e = e.slice(0, s - r) + e.slice(c - r), r += c - s, i = c));
	}
	return e;
}
function Xp(e, t) {
	let n = [], r = 0;
	for (let t of e.matchAll(Kp)) {
		if (e.slice(r, t.index).trim()) return e;
		let i = qp(t[1]);
		if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(i)) return e;
		n.push(i), r = t.index + t[0].length;
	}
	return !n.length || e.slice(r).trim() ? e : n.every((e) => !!$p(e)) && n.every(t) ? "" : e;
}
function Zp(e, t) {
	let n = e.match(/^([A-Za-z][A-Za-z0-9 ()/_-]{0,79}:)[ \t]+(?=MEDIA:)/);
	if (!n) return e;
	let r = [];
	return Xp(e.slice(n[0].length), (e) => !/^(?:\/(?!\/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)/.test(e) || e.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) ? !1 : (r.push(e), !0)) || !r.length ? e : (r.forEach(t), n[1]);
}
function Qp(e) {
	return e.split(".").at(-1)?.toLowerCase() || "";
}
function $p(e, t) {
	try {
		e.startsWith("#media:") && (e = decodeURIComponent(e.slice(7))), e.startsWith("sandbox:") && (e = e.slice(8)), e.startsWith("file:") && (e = decodeURIComponent(new URL(e).pathname));
	} catch {
		return;
	}
	if (!/^(\/|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(e)) return;
	let n = e.split(/[\\/]/).at(-1)?.split(/[?#]/)[0] || "";
	t = (t && /\.[a-z0-9]{1,12}$/i.test(t) ? t : n) || t || "Attached image";
	let r = Qp(t);
	return {
		path: e,
		name: t,
		type: Up[r] || (Wp.has(r) ? "text/plain" : "application/octet-stream")
	};
}
function em(e) {
	if (e.type.startsWith("image/") && e.type !== "image/svg+xml") return "image";
	if (e.type === "application/pdf") return "pdf";
	if (e.type.startsWith("audio/")) return "audio";
	if (e.type.startsWith("video/")) return "video";
	if (Wp.has(Qp(e.name))) return "text";
}
function tm(e, t = "", n = !1) {
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
var nm = new Hp({ html: !0 }), rm = nm.inline.ruler.__rules__.find((e) => e.name === "backticks").fn;
nm.inline.ruler.at("backticks", (e, t) => {
	let n = e.pos, r = e.tokens.length, i = rm(e, t), a = e.tokens.at(-1);
	return !t && e.tokens.length > r && a?.type === "code_inline" && (a.meta = { deliveryLines: [e.src.slice(0, n).split("\n").length - 1, e.src.slice(0, e.pos).split("\n").length - 1] }), i;
});
function im(e) {
	let t = [];
	if (!/MEDIA:|Attached (?:image|file) /.test(e)) return {
		text: e,
		files: t
	};
	let n = (e, n) => {
		let r = $p(e, n);
		return r ? (t.some((e) => e.path === r.path) || t.push(r), !0) : !1;
	}, r = e.split("\n"), i = [...r], a = !1, o = [], s = nm.parse(e, {}), c = /* @__PURE__ */ new Set();
	for (let e of s) if (e.map && ([
		"fence",
		"code_block",
		"blockquote_open",
		"bullet_list_open",
		"ordered_list_open"
	].includes(e.type) || e.children?.some((e) => e.type === "code_inline" && /untrusted_tool_result/i.test(e.content)))) for (let t = e.map[0]; t < e.map[1]; t++) c.add(t);
	let l = /* @__PURE__ */ new Set(), u = 0;
	for (let [e, t] of r.entries()) if (u && l.add(e), !c.has(e) && /^\s*<\/?untrusted_tool_result\b/i.test(t)) for (let n of t.matchAll(/<(\/?)untrusted_tool_result\b[^>]*(?:>|$)/gi)) l.add(e), u = n[1] ? Math.max(0, u - 1) : u + 1;
	for (let [e, t] of s.entries()) {
		if (t.type !== "paragraph_open" || t.level !== 0 || !t.map) continue;
		let r = /* @__PURE__ */ new Set();
		for (let n of s[e + 1]?.children || []) {
			if (n.type !== "code_inline" || !/MEDIA:|Attached (?:image|file) /.test(n.content)) continue;
			let e = n.meta?.deliveryLines;
			if (!e) continue;
			let [i, a] = e;
			for (let e = i; e <= a; e++) r.add(t.map[0] + e);
		}
		for (let e = t.map[0]; e < t.map[1]; e++) {
			if (l.has(e) || r.has(e)) continue;
			let t = i[e], s = t.match(/^Attached (?:image|file) ([^\n]+?): ([^\n]+?)\r?$/);
			s && n(s[2].trim(), s[1]) ? (a = !0, i[e] = "") : /^@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)\r?$/.test(t) ? o.push(e) : t.startsWith("MEDIA:") ? i[e] = Xp(t, n) : i[e] = Yp(Zp(t, n), n);
		}
	}
	if (a) for (let e of o) i[e] = "";
	return {
		text: t.length ? i.filter((e, t) => e !== "" || r[t] === "").join("\n").trim() : e,
		files: t
	};
}
function am(e) {
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
	let a = im(i);
	return a.text.trim() ? [] : a.files.map((e) => {
		let t = r.mime_type || r.mime;
		typeof t == "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(t) && (e.type = t);
		let n = r.size ?? r.bytes;
		return typeof n == "number" && Number.isSafeInteger(n) && n >= 0 && (e.size = n), e;
	});
}
function om(e) {
	return im(e);
}
function sm(e) {
	if (e.role !== "user" && e.role !== "assistant") return [];
	let { content: t } = e, n = (e.role === "user" ? om : im)(_l(t)).files, r = n.filter((e) => em(e) === "image");
	if (Array.isArray(t)) {
		let e = 0;
		for (let i of t) {
			let t = i?.image_url?.url;
			if (Ol(t)) {
				if (r.length) {
					let n = r[e++];
					n && !t.startsWith("/api/plugins/chathermes/artifact-images/") && (n.imageData = t);
				} else {
					let e = $p(t, "Attached image.png");
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
var cm = {
	auto_continue: "Resuming interrupted turn…",
	process_complete: "Background process completed",
	async_delegation_complete: "Delegated work completed",
	model_switch: "Model changed",
	personality_switch: "Personality changed",
	failed_turn: "Response did not complete · verify any actions before resending"
};
function lm(e) {
	return e.display_kind === "compaction" ? "compaction" : e.display_kind === "hidden" ? "hidden" : e.display_kind && Object.hasOwn(cm, e.display_kind) ? "status" : e.role === "system" ? "hidden" : "message";
}
function um(e) {
	let t = e.display_metadata;
	if (e.display_kind === "model_switch" && t && typeof t == "object") {
		let e = "model" in t && typeof t.model == "string" ? t.model : "";
		if (e) return `Model changed to ${e}`;
	}
	return t && typeof t == "object" && "display_text" in t && typeof t.display_text == "string" ? t.display_text : cm[e.display_kind || ""] || "";
}
function dm(e) {
	return e === "interrupted" ? "Response interrupted" : e === "cancelled" ? "Response cancelled" : e === "error" || e === "failed" ? "Response failed" : "Response completed";
}
//#endregion
//#region src/features/chat/runtime/assistant-turn.ts
var fm = (e) => typeof e == "string" ? e : "", pm = (e) => typeof e == "string" ? e : e == null ? "" : JSON.stringify(e, null, 2);
function mm(e) {
	let t = fm(e.subagent_id) || fm(e.child_session_id);
	if (t) return t;
	let n = fm(e.delegation_id);
	return n && typeof e.task_index == "number" && Number.isSafeInteger(e.task_index) ? `${n}:${e.task_index}` : "";
}
function hm(e) {
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
function gm(e, t = !1) {
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
var _m = () => ({
	blocks: [],
	seen: /* @__PURE__ */ new Set(),
	sequence: 0
});
function vm(e) {
	ym(e);
	for (let t of e.blocks) t.kind !== "text" && (t.complete = !0, t.kind === "thinking" && (t.title = "Thought"), (!t.state || t.state === "running" || t.state === "pending") && (t.state = t.kind === "tool" ? "unknown" : "completed"));
}
function ym(e) {
	for (let t of e.blocks) t.kind === "thinking" && (t.complete = !0, t.state = "completed", t.title = "Thought", t.duration === void 0 && t.startedAt !== void 0 && (t.duration = Math.max(0, (Date.now() - t.startedAt) / 1e3)));
}
function bm(e, t) {
	if (t.key && e.seen.has(t.key)) return;
	t.key && e.seen.add(t.key);
	let { type: n, data: r } = t, i = fm(r.delta) || fm(r.text) || fm(r.preview), a = fm(r.tool_call_id) || fm(r.tool_id), o = fm(r.tool_name) || fm(r.name) || fm(r.tool), s = () => `block-${++e.sequence}`;
	if (n === "text" || n === "text.snapshot" || n === "text.completed") {
		ym(e);
		let t = n === "text.completed" ? fm(r.content) : i;
		if (!t || n === "text.completed" && [...e.blocks].reverse().find((e) => e.kind === "text")?.content === t) return;
		let a = e.blocks.at(-1);
		if (n === "text.snapshot") {
			let n = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("");
			if (n === t || n.startsWith(t)) return;
			if (t.startsWith(n)) {
				bm(e, {
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
	} else if (n === "reasoning.completed") ym(e);
	else if (n.startsWith("tool.")) {
		ym(e);
		let t = e.blocks.find((e) => e.kind === "tool" && a && e.id === a);
		if (!t && !a && (t = [...e.blocks].reverse().find((e) => e.kind === "tool" && !e.complete && (!o || e.toolName === o))), t || (t = {
			id: a || s(),
			kind: "tool",
			title: gm(o),
			toolName: o,
			content: "",
			complete: !1,
			state: "pending",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), n === "tool.started" && t.complete) return;
		n === "tool.started" ? (t.state = "running", t.content = pm(r.args) || i || t.content) : n === "tool.updated" ? (t.complete || (t.state = "running"), t.output = (t.output || "") + i) : (t.complete = !0, t.state = n === "tool.failed" || hm(r.output ?? r.result) || r.is_error || r.error ? "failed" : "completed", t.title = gm(t.toolName || o, !0), t.output = pm(r.output ?? r.result ?? r.error) || t.output || i, t.content = pm(r.args) || t.content, t.duration = typeof r.duration_s == "number" ? r.duration_s : t.startedAt ? Math.max(0, ((typeof r.ts == "number" ? r.ts * 1e3 : Date.now()) - t.startedAt) / 1e3) : void 0);
	} else {
		if (n === "failed") for (let t of e.blocks) t.kind === "tool" && !t.complete && (t.state = "failed", t.output ||= "The response ended before this tool completed.");
		vm(e);
	}
}
function xm(e) {
	let t = _m();
	for (let n of e) {
		if (n.blocks) {
			t.blocks.push(...n.blocks);
			continue;
		}
		if (lm(n) === "message") {
			if (n.role === "assistant") {
				let e = n.reasoning_content || n.reasoning;
				e && (bm(t, {
					type: "reasoning",
					data: {
						delta: e,
						persisted: !0
					}
				}), ym(t));
				let r = _l(n.content);
				r && t.blocks.push({
					id: `block-${++t.sequence}`,
					kind: "text",
					content: r
				});
				let i = Array.isArray(n.content) ? n.content.flatMap((e) => {
					let t = e?.image_url?.url;
					return Ol(t) ? [t] : [];
				}) : [];
				if (i.length) {
					let e = t.blocks.at(-1);
					e?.kind !== "text" && (e = {
						id: `block-${++t.sequence}`,
						kind: "text",
						content: ""
					}, t.blocks.push(e)), e.images = i;
				}
				for (let e of n.tool_calls || []) bm(t, {
					type: "tool.started",
					data: {
						tool_call_id: e.id,
						tool_name: e.function?.name,
						args: e.function?.arguments,
						persisted: !0
					}
				});
			} else if (n.role === "tool") {
				let e = _l(n.content), r = !1;
				try {
					let t = JSON.parse(e);
					r = t?.is_error === !0 || t?.success === !1 || !!t?.error || typeof t?.exit_code == "number" && t.exit_code !== 0;
				} catch {}
				bm(t, {
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
	return ym(t), t.blocks;
}
function Sm(e, t, n) {
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
function Cm(e, t) {
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
function wm(e, t, n) {
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
			let t = fm(n.text).trim();
			if (!t) return;
			ym(e);
			let o = i(r.streamText);
			if (!o) {
				let e = i(r.interimText ?? r.finalText);
				e && e.content.replace(/\s+/g, " ").trim() === t.replace(/\s+/g, " ").trim() && (o = e);
			}
			o ??= a(t), o.content = t, r.interimText = o.id, r.streamText = void 0, r.finalText = void 0, r.toolStream = !1;
		} else if (t === "message.delta" || t === "message.complete") {
			let o = fm(n.text);
			if (t === "message.delta" && o) {
				ym(e);
				let t = i(r.streamText);
				(!t || t !== e.blocks.at(-1)) && (t = a("")), t.content += o, r.streamText = t.id, r.finalText = void 0;
			} else if (t === "message.complete" && o.trim() && (!n.response_reused || !e.blocks.some((e) => e.kind === "text"))) {
				ym(e);
				let t = o.trim(), s = i(r.streamText), c = e.blocks.reduce((e, t, n) => t.kind === "tool" ? n : e, -1), l = s && e.blocks.indexOf(s) > c ? s : void 0, u = i(r.interimText), d = !!(n.error || n.status && n.status !== "complete"), f = !d && u && u.content.trim() === t && (!l || l.content.trim() === t), p = !d && !l && !r.toolStream && u && u.content.trim() && (n.response_previewed || n.response_transformed || u.content.trim() === t || t.startsWith(u.content.trim()) || u.content.trim().startsWith(t) || Cm(u.content.trim(), t)), m;
				if (f || p) m = u, l && l !== u && e.blocks.splice(e.blocks.indexOf(l), 1);
				else {
					let e = i(r.finalText);
					m = l ?? (e?.content.trim() === t ? e : a(""));
				}
				m.content = t, r.finalText = m.id, r.streamText = void 0, r.interimText = void 0, r.toolStream = !1;
			}
			if (t === "message.complete") {
				for (let t of e.blocks) t.kind !== "text" && !t.delegated && (t.complete = !0, (!t.state || t.state === "running" || t.state === "pending") && (t.state = n.status === "cancelled" || n.status === "interrupted" ? "interrupted" : "unknown"));
				n.reasoning && !e.blocks.some((e) => e.kind === "thinking") && bm(e, {
					type: "reasoning",
					data: { text: n.reasoning }
				}), ym(e);
			}
		} else if (t === "reasoning.delta" || t === "reasoning.available") {
			if (t === "reasoning.available") {
				let t = i(r.streamText ?? r.finalText)?.content.trim();
				if (t && t.slice(0, 500).trim() === fm(n.text).trim()) return;
				let a = [...e.blocks].reverse().find((e) => e.kind === "thinking");
				if (a && a.kind === "thinking") {
					a.content = fm(n.text);
					return;
				}
			}
			bm(e, {
				type: "reasoning",
				data: {
					...n,
					delta: n.text
				}
			});
		} else if (t === "tool.start" || t === "tool.complete" || t === "tool.progress") {
			t === "tool.start" && (r.toolStream = !0);
			let i = n.result, a = n.is_error || n.error || hm(i) || hm(n.result_text);
			bm(e, {
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
			let r = mm(n);
			if (!r) return;
			bm(e, {
				type: [
					"subagent.complete",
					"subagent.failed",
					"subagent.cancelled"
				].includes(t) ? t === "subagent.complete" && n.status === "completed" ? "tool.completed" : "tool.failed" : "tool.updated",
				data: {
					tool_call_id: "subagent-" + r,
					tool_name: fm(n.name) || "Delegated task",
					delta: fm(n.text),
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
function Tm(e) {
	let t = e.messages.map((e) => Object.hasOwn(e, "display_content") ? {
		...e,
		content: e.display_content
	} : e).filter((e) => lm(e) !== "hidden" || !!e.blocks?.length), n = [], r = (e) => [...e].reverse().find((e) => e.role === "assistant" && _l(e.content).trim())?.id, i = 0;
	for (let a = 0; a < t.length;) {
		let o = t[a];
		if (lm(o) === "compaction") {
			n.push({
				kind: "compaction",
				key: o.id || `compaction-${a}`
			}), a++;
			continue;
		}
		if (o.role === "user" || lm(o) === "status") {
			let s = lm(o);
			if (o.display_kind === "async_delegation_complete") {
				let e = o.id || `delegation-${a}`;
				n.push({
					kind: "turn",
					key: `receipt-${e}`,
					blocks: [{
						id: `receipt-${e}`,
						kind: "tool",
						title: um(o),
						content: _l(o.content),
						complete: !0,
						state: "completed"
					}]
				});
			} else s === "status" ? n.push({
				kind: "status",
				text: um(o),
				content: _l(o.content),
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
			for (; c < t.length && t[c].role !== "user" && lm(t[c]) === "message";) c++;
			let l = c === t.length, u = l && (!e.turnUserCount || e.turnUserCount === i) && e.blocks?.length ? e.blocks : o.blocks || xm(t.slice(a + 1, c)), d = u.length ? u : l ? e.progress : [], f = l && (e.working ?? !!((o.blocks || e.blocks?.length || e.progress.length) && d.some((e) => e.kind !== "text" && !e.complete)));
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
			for (; e < t.length && t[e].role !== "user" && lm(t[e]) === "message";) e++;
			n.push({
				kind: "turn",
				blocks: xm(t.slice(a, e)),
				responseId: r(t.slice(a, e)),
				key: o.display_id || o.id ? `history-${o.display_id || o.id}` : `history-${a}`
			}), a = e;
		}
	}
	return n;
}
//#endregion
//#region src/features/chat/utils/saved-response-targets.ts
function Em(e) {
	let t = _l(e.content);
	om(t).files.length && (t = t.replace(/\n@file:[^\n]+\n\n--- Attached Context ---\n[\s\S]*$/, ""));
	let n = om(t);
	return JSON.stringify([n.text, n.files.map((e) => e.path).sort()]);
}
function Dm(e, t) {
	let n = (e) => Tm({
		messages: e,
		progress: []
	}).flatMap((e) => {
		if (e.kind === "user") return [{
			kind: "user",
			text: Em(e.message),
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
var Om = (e, t) => "chathermes.native-outcome:" + JSON.stringify([e || "default", t]), km = (e, t) => e && e !== "default" ? [Om(e, t)] : [Om("default", t), "chathermes.native-outcome:" + JSON.stringify(["", t])];
function Am(e, t) {
	try {
		let n = km(e, t);
		return Object.keys(localStorage).some((e) => n.some((t) => e === t || e.startsWith(t + ":")) && localStorage.getItem(e) === "unknown");
	} catch {
		return !0;
	}
}
function jm(e, t) {
	let n = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
	try {
		localStorage.setItem(Om(e, t) + ":" + n, "unknown");
	} catch {
		throw Error("Cannot safely record native submission state");
	}
	return n;
}
function Mm(e, t, n) {
	try {
		for (let r of km(e, t)) if (n) localStorage.removeItem(r + ":" + n);
		else for (let e of Object.keys(localStorage)) (e === r || e.startsWith(r + ":")) && localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/features/chat/runtime/native-session.ts
function Nm(e, t, n, r) {
	let i = /* @__PURE__ */ z(), a = /* @__PURE__ */ z(null), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(!1), c = !1, l = 0, u = 0;
	function d() {
		u++, o.value = null, s.value = !1;
	}
	function f() {
		l++, a.value = null, d();
	}
	function p(e, t = !0) {
		let n = a.value;
		l++, a.value = e || null, n && e && (typeof e.compressions == "number" && e.compressions !== n.compressions || typeof e.context_used == "number" && typeof n.context_used == "number" && e.context_used < n.context_used || e.model !== n.model || e.context_max !== n.context_max) && (d(), c && t && m());
	}
	async function m() {
		let e = P, t = ae, n = ++u;
		if (c && t && M.value === "ready") {
			s.value = !0;
			try {
				let r = await t.contextBreakdown();
				e === P && n === u && t === ae && c && (o.value = r);
			} catch {
				e === P && n === u && (o.value = null);
			} finally {
				e === P && n === u && (s.value = !1);
			}
		}
	}
	async function h() {
		let e = P, t = ae, n = ++l;
		if (ue && t && M.value === "ready") try {
			let r = await t.usage();
			e === P && n === l && t === ae && p(r);
		} catch {
			e === P && n === l && (a.value = null);
		}
	}
	function g(e) {
		c = e, d(), e && m();
	}
	let _ = /* @__PURE__ */ z(!1), v = /* @__PURE__ */ z(!1), y = /* @__PURE__ */ z(""), b, x = 0, S = !1, C = !1, w;
	async function T(e, t = 0) {
		let n = Math.max(120, t, b?.nextOffset || 0), r = b?.messages.find((e) => e.display_kind !== "compaction"), i = r?.display_id || r?.id, a = (e) => !i || e.some((e) => (e.display_id || e.id) === i), o = ve, s = R;
		for (let t = 0;; t++) try {
			let t = await Q.latestMessages(o, s, e), r = JSON.stringify(t.messages);
			for (; t.hasMore && (t.nextOffset < n || !a(t.messages));) {
				let n = await Q.latestMessages(o, s, e, t.nextOffset, t.revision);
				if (t.revision && n.revision !== t.revision) throw new il(409, "Transcript changed");
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
				if (JSON.stringify(t.messages) !== r) throw new il(409, "Transcript changed");
			}
			return t;
		} catch (e) {
			if (!(e instanceof il) || e.status !== 409 || t >= 2) throw e;
		}
	}
	function E(e) {
		b = e, _.value = e.hasMore, y.value = "", x++;
	}
	async function D() {
		if (!b?.hasMore || v.value || ee.value || oe) return;
		if (S) {
			C = !0;
			return;
		}
		let e = P, t = x, n = b;
		v.value = !0, y.value = "";
		try {
			if (!n.revision) {
				await ke(n.nextOffset + 120);
				return;
			}
			let r = new AbortController();
			w?.abort(), w = r;
			let i = await Q.latestMessages(ve, R, r.signal, n.nextOffset, n.revision);
			if (e !== P || t !== x || b !== n) return;
			if (i.revision !== n.revision) throw new il(409, "Transcript changed");
			let a = new Set(k.value.map((e) => e.id).filter(Boolean)), o = i.messages.filter((e) => !e.id || !a.has(e.id));
			k.value = [...o, ...k.value], E({
				...i,
				messages: [...i.messages, ...n.messages]
			});
		} catch (n) {
			if (e !== P || t !== x) return;
			n instanceof il && n.status === 409 ? await ke() : y.value = "Could not load earlier messages. Try again.";
		} finally {
			e === P && (v.value = !1);
		}
	}
	let O = /* @__PURE__ */ z({}), k = /* @__PURE__ */ z([]), A = /* @__PURE__ */ z(!1), ee = /* @__PURE__ */ z(!1), j = /* @__PURE__ */ z(""), te = /* @__PURE__ */ z(""), M = /* @__PURE__ */ z("stale"), N = /* @__PURE__ */ z(0), ne = /* @__PURE__ */ z([]), re = /* @__PURE__ */ z(!1), ie = Z(() => {
		let e = ne.value[0];
		return e ? {
			...e.params,
			request_id: e.id,
			kind: e.method
		} : void 0;
	}), ae, P = 0, oe = !1, se = !1, ce = 0, le, ue = !1, F = document.visibilityState !== "hidden", de = navigator.onLine, I, L, fe = [], pe = !1, me = !1, he = "", ge = "", _e = /* @__PURE__ */ new Set(), ve = "", R = "", ye = !1, be = !1, xe = 0, Se, Ce = () => {
		L && I && (L.blocks = I.blocks), k.value = [...k.value];
	}, we = (e) => {
		P = e, N.value = e;
	};
	function Te() {
		se && (se = !1, t?.(ve, R));
	}
	function Ee(e) {
		ue && ve && R && n?.(ve, R, e);
	}
	function De(e, t = !1, n, r = {}) {
		if (ye && !t && L && (n ? n === he : !r.display_kind && e === ge)) {
			ye = !1, Ce();
			return;
		}
		ye = !1, t && L && I && (bm(I, {
			type: "reasoning.completed",
			data: {}
		}), fe.push({
			user: L,
			turn: I,
			hasCorrections: !0
		})), be = t || !1, L = {
			id: `native-user-${++xe}`,
			role: "user",
			content: e,
			display_kind: r.display_kind,
			display_metadata: r.display_metadata
		}, k.value.push(L), I = /* @__PURE__ */ Pt(_m()), L.blocks = I.blocks, A.value = !0, Ce();
	}
	function Oe(e, t) {
		t === P && ue && R && (i.value = {
			profile: ve,
			session: R,
			info: e.info,
			generation: t
		}), oe = !0, pe = e.messages_omitted === !0, me = !!e.queued, ce++, Se = void 0, I = void 0, L = void 0, ye = !1, fe = [];
		let n = e.messages.map((e) => ({
			...e,
			id: e.row_id == null ? void 0 : String(e.row_id),
			content: e.role === "tool" ? e.content : e.text || e.content || "",
			tool_name: e.name
		})), r = new Set(e.recovery.base_row_ids || []), a = e.recovery.complete ? n.filter((e) => e.id && r.has(e.id)) : n, o = new Set(b?.messages.map((e) => e.id));
		if (k.value = b ? [...b.messages, ...a.filter((e) => !o.has(e.id))] : a, A.value = !!(e.running || e.queued), !e.recovery.complete && e.inflight?.user) {
			let t = k.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
			if (t < 0 || _l(k.value[t].content) !== e.inflight.user || (k.value[t].display_kind || void 0) !== (e.inflight.display_kind || void 0)) De(e.inflight.user, !1, void 0, {
				display_kind: e.inflight.display_kind || void 0,
				display_metadata: e.inflight.display_metadata
			});
			else {
				L = k.value[t], I = /* @__PURE__ */ Pt(_m());
				let e = xm(k.value.slice(t + 1));
				Sm(I, e, A.value), L.blocks = I.blocks;
			}
			e.inflight.assistant && !I.blocks.some((e) => e.kind === "text") && bm(I, {
				type: "text.snapshot",
				data: { text: e.inflight.assistant }
			});
			for (let t of e.inflight.corrections || []) De(t, !0);
			e.inflight.error && (j.value = e.inflight.error), te.value = lm(L) === "status" ? um(L) : e.running ? "Working…" : dm(e.inflight.status), e.running && !e.inflight.error && (j.value = "Earlier progress is outside retained recovery; saved history is authoritative.");
		}
		A.value = !!(e.running || e.queued);
	}
	async function ke(t = 0) {
		let n = P, r = ++ce, i = ae;
		if (!i || oe || M.value !== "ready") return;
		x++, S = !0;
		let a = new AbortController();
		w?.abort(), w = a;
		try {
			let o = await T(a.signal, t), s = o.messages;
			if (n !== P || r !== ce || oe) return;
			let c = s.length && !o.projected ? await i.rpc("history").catch(() => null) : { messages: [] }, l = new Map((c?.messages || []).filter((e) => e.id).map((e) => [e.id, e])), u = s.map((e) => {
				let t = l.get(e.id);
				return t ? {
					...e,
					display_kind: t.display_kind ?? e.display_kind,
					display_metadata: t.display_metadata ?? e.display_metadata
				} : e;
			});
			if (n !== P || r !== ce || oe) return;
			if (E(o), pe && !A.value && L && I && !be && !fe.some((e) => e.hasCorrections)) {
				let e = u.reduce((e, t, n) => t.role === "user" ? n : e, -1), t = u[e];
				t && (t.display_kind || void 0) === (L.display_kind || void 0) && Object.keys(Dm([L], u.slice(e))).length && (Sm(I, xm(u.slice(e + 1)), !1), u[e] = {
					...t,
					display_id: L.display_id || L.id,
					blocks: I.blocks
				}, L = void 0, I = void 0, fe = [], pe = !1, j.value === "Earlier progress is outside retained recovery; saved history is authoritative." && (j.value = ""));
			}
			if (A.value || (O.value = Dm(k.value, u)), A.value && L && I) {
				let e = Se?.user_row_id, t = e ? u.findIndex((t) => t.id === String(e)) : -1;
				t >= 0 && Sm(I, xm(u.slice(t + 1)), !0);
				let n = fe[0]?.user || L, r = k.value.findIndex((e) => e === n || !!(e.id && e.id === n.id));
				if (r >= 0) {
					let e = new Set(k.value.slice(0, r).map((e) => e.id)), t = u.reduce((t, n, r) => e.has(n.id) ? r : t, -1), n = t >= 0 ? u.slice(0, t + 1) : [], i = u.reduce((e, t, n) => t.role === "user" ? n : e, -1), a = u[i];
					pe && !me && !be && !fe.length && a && (a.display_kind || void 0) === (L.display_kind || void 0) && Em(a) === Em(L) && (n = u.slice(0, i), Sm(I, xm(u.slice(i + 1)), !0)), k.value = [...n, ...k.value.slice(r)];
				}
				Ce();
				return;
			}
			if (L && I && !fe.length || fe.some((e) => e.hasCorrections)) return Ce(), !0;
			for (let e of fe) {
				let { turn: t, receipt: n } = e, r = n?.user_row_id == null ? -1 : u.findIndex((e) => e.id === String(n.user_row_id)), i = r + 1;
				for (; i < u.length && u[i]?.role !== "user";) i++;
				r >= 0 && Sm(t, xm(u.slice(r + 1, i)), !1);
				let a = new Set(u.map((e) => e.id)), o = u.find((e) => e.id === String(n?.final_assistant_row_id)), s = [...t.blocks].reverse().find((e) => e.kind === "text")?.content || "";
				if (!(n?.complete && r >= 0 && n.row_ids.every((e) => a.has(String(e))) && o && _l(o.content).trim() === s.trim())) return Ce(), !0;
				u[r] = {
					...u[r],
					display_id: e.user.display_id || e.user.id,
					blocks: t.blocks
				};
			}
			k.value = u;
			let d = await i.rpc("reconciled", { through: i.boundary });
			return n === P && d.settled && e(), !0;
		} catch {
			return n === P && r === ce && (j.value = "Response ended; saved history could not be reconciled. Refresh history before sending again."), !1;
		} finally {
			n === P && r === ce && (S = !1, ee.value = !1, C && (C = !1, D()));
		}
	}
	async function Ae(e, t) {
		(!ue || ve !== e || R !== t) && (Le(), we(P + 1), ve = e, R = t, ue = !0, se = !0, re.value = Am(ve, R)), await Ne();
	}
	function je() {
		f(), w?.abort(), w = void 0, x++, S = !1, C = !1, v.value = !1, we(P + 1), ce++, ae?.close(), ae = void 0, le = void 0, oe = !1, ee.value = !1, M.value = "stale";
	}
	function Me(e, t) {
		let n = F !== e || de !== t;
		return F = e, de = t, !F || !de ? (!F && de && ae?.retainWhileHidden && M.value === "ready" || ue && M.value !== "stale" && je(), Promise.resolve()) : n ? Ne() : le || Promise.resolve();
	}
	function Ne() {
		if (!ue || !F || !de || M.value === "ready") return Promise.resolve();
		if (le) return le;
		let e = ++P;
		N.value = e, ce++, oe = !0, ee.value = k.value.length === 0, M.value = "reconnecting";
		let t = [], n = (n) => {
			e === P && (t ? t.push(n) : n());
		}, i = new tl(ve, R, {
			snapshot: (r) => {
				t = [], n(() => {
					j.value = re.value ? "Submission outcome unknown. Inspect history and native state before sending again." : "", te.value = "", ne.value = [], Oe(r, e);
				});
			},
			input: (e, t, r, i) => n(() => De(e, t, r, i)),
			event: (e) => n(() => {
				let t = e.payload || {};
				e.type === "session.usage" && p(e.payload.usage);
				let n = typeof t.text == "string" ? t.text : "";
				(e.type === "session.title" || e.type === "session.info") && typeof t.title == "string" && Ee(t.title), e.type === "message.start" ? (Te(), A.value = !0, te.value = L && lm(L) === "status" ? um(L) : "Working…", Se = void 0) : e.type === "thinking.delta" || e.type === "tool.generating" ? te.value = e.type === "tool.generating" ? "Preparing " + (typeof t.name == "string" && t.name ? t.name : "tool") : n || "Working…" : e.type === "status.update" ? te.value = n : e.type === "notice" ? te.value = typeof t.message == "string" ? t.message : "" : e.type === "error" ? j.value = typeof t.message == "string" ? t.message : "Session failed" : e.type === "session.reclaimed" && (f(), h(), c && m(), A.value = !1, te.value = "Session reclaimed"), !I && L && (I = /* @__PURE__ */ Pt(_m()));
				let i = I;
				if (e.type.startsWith("subagent.") || e.type.startsWith("tool.")) {
					let n = e.type.startsWith("subagent.") ? "subagent-" + mm(t) : t.tool_id;
					i = [...fe].reverse().find((e) => e.turn.blocks.some((e) => e.id === n))?.turn || I;
				}
				if (i && wm(i, e.type, {
					...t,
					persisted: oe
				}), e.type === "message.complete") {
					oe || r?.(ve, R), d(), p(e.payload.usage, !1), oe || (h(), c && m()), ye = !1;
					for (let e of fe) wm(e.turn, "message.complete", { status: t.status });
					Se = t.persisted_turn, L && I && !fe.some((e) => e.user === L && e.turn === I) && fe.push({
						user: L,
						turn: I,
						receipt: Se,
						hasCorrections: be
					}), A.value = !1, te.value = dm(t.status), typeof t.status == "string" && t.status && t.status !== "complete" && (j.value = typeof t.error == "string" && t.error ? t.error : "Response " + t.status), oe || ke();
				} else e.type === "subagent.complete" && !A.value && !oe && ke();
				Ce();
			}),
			requests: (e) => n(() => {
				ne.value = e;
			}),
			connection: (t, r) => {
				if (e === P) {
					if (t === "closed") {
						let e = M.value === "ready";
						je(), j.value = r || "Session connection lost. Reconnect to restore this session.", te.value = "Disconnected · backend state will be checked on reconnect";
						let t = P;
						e && queueMicrotask(() => {
							P === t && ue && M.value === "stale" && Ne();
						});
					} else r && n(() => {
						j.value = r;
					});
				}
			},
			recovered: () => {
				if (e !== P) return;
				let n = t || [];
				t = void 0;
				for (let e of n) e();
				oe = !1, ee.value = !1, M.value = "ready", r?.(ve, R), h(), c && m(), ke();
			}
		});
		ae = i;
		let a = (async () => {
			try {
				if (await i.ensure(), e === P && M.value !== "ready") throw new Zc("Native session reconstruction did not become ready");
			} catch {
				e === P && (je(), j.value = "Could not reconnect this session. Retry when the dashboard is available.");
			} finally {
				e === P && (le = void 0);
			}
		})();
		return le = a, a;
	}
	async function Pe(e, t, n, r) {
		if (!F || !de || !ae || A.value || re.value || ee.value || M.value !== "ready") throw new Zc("Native session is not ready. Message not submitted.", "rejected");
		let i = P, a = ae, o = jm(ve, R);
		re.value = !0, j.value = "", ye = !1, De(e), L.content = r ?? t, ye = !0, he = o, ge = e, _e.add(o);
		let s = L.id, c = !1;
		try {
			let e = typeof t == "function" ? await t() : t;
			if (i !== P || !F || !de) throw new Zc("Viewer detached before submission", "rejected");
			c = !0, await a.rpc("prompt.submit", {
				input: e,
				admission_id: o,
				...n
			}), Mm(Fe(a), a.stored, o), i === P && (re.value = !1), ue && ve === a.profile && R === a.stored && he === o && Te();
		} catch (e) {
			throw !c || e instanceof Zc && e.outcome === "rejected" ? (Mm(Fe(a), a.stored, o), ue && ve === a.profile && R === a.stored && he === o && (k.value = k.value.filter((e) => e.id !== s), re.value = Am(ve, R), ye = !1, L?.id === s && (A.value = !1, I = void 0, L = void 0))) : i === P && (j.value = "Submission outcome unknown. Inspect history and native state before sending again."), e;
		} finally {
			_e.delete(o);
		}
	}
	let Fe = (e) => e.profile;
	async function Ie() {
		if (!ue || (M.value !== "ready" && await Ne(), M.value !== "ready") || _e.has(he)) return;
		let e = P, t = ae, n = t.boundary;
		try {
			let r = await t.rpc("state");
			if (e !== P || t.boundary !== n || _e.has(he)) return;
			if (r.running !== !1 || r.queued || r.delegating) {
				j.value = "Hermes is still working; sending remains locked.";
				return;
			}
			A.value = !1, await ke() && e === P && t.boundary === n && !A.value && (Mm(ve, R), re.value = Am(ve, R), re.value || (j.value = ""));
		} catch {
			e === P && (j.value = "Could not verify native session state; sending remains locked.");
		}
	}
	function Le() {
		je(), ue = !1, c = !1, i.value = void 0, se = !1, he = "", k.value = [], b = void 0, pe = !1, _.value = !1, y.value = "", O.value = {}, A.value = !1, ee.value = !1, ne.value = [], re.value = !1, j.value = "", te.value = "", I = void 0, L = void 0, fe = [];
	}
	function Re() {
		if (!ae || M.value !== "ready") throw new Zc("Session is read-only until reconnected", "rejected");
		return ae;
	}
	return {
		hasEarlier: _,
		loadingEarlier: v,
		earlierError: y,
		loadEarlier: D,
		contextUsage: a,
		contextBreakdown: o,
		contextLoading: s,
		setContextOpen: g,
		refreshContext: h,
		generationRef: N,
		settings: i,
		messages: k,
		responseTargets: O,
		busy: A,
		loading: ee,
		error: j,
		status: te,
		connection: M,
		approval: ie,
		requests: ne,
		uncertain: re,
		attach: Ae,
		submit: Pe,
		close: Le,
		hydrate: ke,
		resolveUncertainty: Ie,
		reconnect: Ne,
		availability: Me,
		stop: () => Re().rpc("session.interrupt"),
		steer: (e) => Re().rpc("session.steer", { text: e }),
		answer: (e, t) => Re().answer(e, t)
	};
}
//#endregion
//#region src/features/notifications/services/push.ts
var Pm = "/api/plugins/chathermes", Fm;
function Im() {
	return typeof window < "u" && window.isSecureContext && typeof navigator < "u" && "serviceWorker" in navigator && "PushManager" in window && typeof Notification < "u";
}
async function Lm() {
	if (!Im()) throw Error("Notifications require a secure browser with Push API support.");
	return Fm ||= navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
		scope: "/chathermes",
		updateViaCache: "none"
	}).catch((e) => {
		throw Fm = void 0, e;
	}), Fm;
}
function Rm(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4));
	return Uint8Array.from(n, (e) => e.charCodeAt(0));
}
async function zm() {
	let e = await fetch(Pm + "/push/config", { credentials: "same-origin" });
	if (!e.ok) throw Error("Push configuration unavailable");
	return e.json();
}
async function Bm() {
	return (await Lm()).pushManager.getSubscription();
}
async function Vm(e, t) {
	let n = await fetch(Pm + "/push/status" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ endpoint: t.endpoint })
	});
	if (!n.ok) throw Error("Could not load notification status for this profile.");
	return n.json();
}
async function Hm(e = "") {
	if (!Im()) return {
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: "Notifications require HTTPS and a supported browser."
	};
	try {
		let [t, n] = await Promise.all([Bm(), zm()]), r = t ? await Vm(e, t) : null;
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
async function Um(e) {
	if (!Im()) throw Error("Notifications require HTTPS and a supported browser.");
	let t = await Notification.requestPermission();
	if (t !== "granted") throw Error(t === "denied" ? "Notification permission is blocked in browser settings." : "Notification permission was not granted.");
	let n = await Lm(), r = await zm();
	if (!r.available || !r.vapid_public_key) throw Error("Push notifications are unavailable on this server.");
	let i = await n.pushManager.subscribe({
		userVisibleOnly: !0,
		applicationServerKey: Rm(r.vapid_public_key)
	});
	if (!(await fetch(Pm + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			endpoint: i.endpoint,
			keys: i.toJSON().keys
		})
	})).ok) throw Error("Could not save this notification subscription.");
}
async function Wm(e) {
	let t = await Bm();
	if (!t) return;
	let n = await Vm(e, t);
	if (n.enabled && n.id && !(await fetch(Pm + "/push/subscriptions/" + encodeURIComponent(n.id) + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "DELETE",
		credentials: "same-origin"
	})).ok) throw Error("Could not disable notifications for this profile.");
}
async function Gm(e) {
	if (!(await fetch(Pm + "/push/test" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin"
	})).ok) throw Error("Could not send a test notification.");
}
//#endregion
//#region src/features/notifications/services/push-client.ts
function Km(e, t, n = document.visibilityState) {
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
function qm(e, t, n) {
	let r = !0, i = null, a = () => Km(t(), n()), o = () => {
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
var Jm = Symbol("live chat");
function Ym(e) {
	Mn(Jm, e);
}
function Xm() {
	let e = Nn(Jm);
	if (!e) throw Error("Live chat context is missing");
	return e;
}
var Zm = Symbol("conversation focus");
//#endregion
//#region src/features/chat/utils/context-usage.ts
function Qm(e) {
	return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : null;
}
function $m(e) {
	let t = Qm(e?.context_percent);
	return t !== null && t <= 100 ? t : null;
}
//#endregion
//#region src/features/chat/components/ContextUsagePopover.vue?vue&type=script&setup=true&lang.ts
var eh = {
	role: "dialog",
	"aria-label": "Context usage",
	class: "context-panel rounded-2xl border border-[#424242] bg-[#212121] p-3 text-sm text-white shadow-xl"
}, th = { class: "flex items-center justify-between gap-3" }, nh = { class: "mt-1 break-all" }, rh = { class: "text-[#b4b4b4]" }, ih = {
	key: 0,
	class: "mt-2 text-[#b4b4b4]"
}, ah = {
	key: 1,
	class: "text-amber-200"
}, oh = {
	key: 2,
	class: "text-[#b4b4b4]"
}, sh = {
	key: 3,
	class: "mt-2 text-[#b4b4b4]",
	role: "status"
}, ch = {
	class: "context-breakdown-bar mt-2 flex h-2 overflow-hidden rounded-full bg-[#424242]",
	"aria-hidden": "true"
}, lh = { class: "mt-2 space-y-1" }, uh = { class: "flex min-w-0 items-center gap-2" }, dh = { class: "shrink-0" }, fh = {
	key: 5,
	class: "mt-2 text-[#b4b4b4]"
}, ph = /* @__PURE__ */ H({
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
		}, r = Z(() => (t.breakdown?.categories || []).filter((e) => e && typeof e.label == "string" && Qm(e.tokens) !== null).map((e) => ({
			...e,
			color: n[e.id] || "#a3a3a3"
		}))), i = Z(() => r.value.reduce((e, t) => e + t.tokens, 0)), a = Z(() => $m(t.usage) === null ? t.breakdown : t.usage), o = Z(() => $m(a.value)), s = (e) => Qm(e)?.toLocaleString() ?? "—", c = Z(() => a.value?.context_estimated || ["local_estimate", "provider_usage_plus_estimate"].includes(a.value?.context_source || ""));
		return (t, n) => (G(), K("section", eh, [
			J("div", th, [n[1] ||= J("strong", null, "Context usage", -1), J("button", {
				type: "button",
				"aria-label": "Close context usage",
				class: "px-2 text-base",
				onClick: n[0] ||= (e) => t.$emit("close")
			}, " × ")]),
			J("p", nh, R(e.usage?.model || e.breakdown?.model || e.model || "Current model"), 1),
			J("p", rh, R(s(a.value?.context_used)) + " / " + R(s(a.value?.context_max)) + " tokens · " + R(o.value === null ? "Unknown" : `${Math.round(o.value)}%`), 1),
			o.value === null ? (G(), K("p", ih, "Context usage unavailable")) : X("v-if", !0),
			c.value ? (G(), K("p", ah, "Estimated usage")) : X("v-if", !0),
			B(Qm)(e.usage?.compressions) === null ? X("v-if", !0) : (G(), K("p", oh, R(e.usage?.compressions) + " compressions ", 1)),
			e.loading ? (G(), K("p", sh, "Loading context breakdown…")) : r.value.length ? (G(), K(W, { key: 4 }, [
				n[2] ||= J("p", { class: "mt-3 text-[#b4b4b4]" }, "Estimated breakdown", -1),
				J("div", ch, [(G(!0), K(W, null, U(r.value, (e, t) => (G(), K("span", {
					key: `${e.id}-${t}`,
					style: oe({
						width: i.value > 0 ? `${e.tokens / i.value * 100}%` : "0%",
						backgroundColor: e.color
					})
				}, null, 4))), 128))]),
				J("dl", lh, [(G(!0), K(W, null, U(r.value, (e, t) => (G(), K("div", {
					key: `${e.id}-${t}`,
					class: "flex items-center justify-between gap-3"
				}, [J("dt", uh, [J("span", {
					class: "size-2 shrink-0 rounded-full",
					style: oe({ backgroundColor: e.color }),
					"aria-hidden": "true"
				}, null, 4), Y(R(e.label), 1)]), J("dd", dh, R(s(e.tokens)) + " tokens", 1)]))), 128))])
			], 64)) : (G(), K("p", fh, " Context breakdown unavailable until the agent has initialized. "))
		]));
	}
}), mh = [
	"aria-label",
	"aria-expanded",
	"aria-controls"
], hh = {
	viewBox: "0 0 30 30",
	class: "absolute inset-0 size-full -rotate-90",
	"aria-hidden": "true"
}, gh = ["stroke-dasharray"], _h = /* @__PURE__ */ H({
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
		let n = e, r = t, i = /* @__PURE__ */ z(), a = /* @__PURE__ */ z(), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(360), l = Kn(), u, d, f = Z(() => $m(n.usage)), p = Z(() => f.value === null ? "text-[#a3a3a3]" : f.value >= 90 ? "text-red-200" : f.value >= 75 ? "text-amber-200" : "text-emerald-200");
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
		return In(o, (e) => r("open", e), { flush: "sync" }), In(() => n.active, (e) => {
			e || g();
		}), sr(() => {
			if (document.addEventListener("click", x), document.addEventListener("keydown", S), window.addEventListener("resize", m), window.addEventListener("scroll", m, !0), window.visualViewport?.addEventListener("resize", m), window.visualViewport?.addEventListener("scroll", m), typeof ResizeObserver < "u") {
				d = new ResizeObserver(m);
				let e = i.value?.closest(".composer");
				e && d.observe(e);
			}
		}), ur(() => {
			g(), d?.disconnect(), document.removeEventListener("click", x), document.removeEventListener("keydown", S), window.removeEventListener("resize", m), window.removeEventListener("scroll", m, !0), window.visualViewport?.removeEventListener("resize", m), window.visualViewport?.removeEventListener("scroll", m);
		}), (t, n) => V((G(), K("div", {
			ref_key: "root",
			ref: i,
			class: "context-control shrink-0",
			onPointerenter: h,
			onPointerleave: y
		}, [J("button", {
			ref_key: "button",
			ref: a,
			type: "button",
			class: F(["context-meter relative grid size-[30px] place-items-center rounded-full p-0 text-[9px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2", p.value]),
			"aria-label": f.value === null ? "Context usage unavailable" : `Context ${Math.round(f.value)} percent used`,
			"aria-haspopup": "dialog",
			"aria-expanded": o.value,
			"aria-controls": B(l),
			onClick: b,
			onPointerenter: v
		}, [(G(), K("svg", hh, [n[0] ||= J("circle", {
			cx: "15",
			cy: "15",
			r: "13",
			fill: "none",
			stroke: "#525252",
			"stroke-width": "2"
		}, null, -1), f.value === null ? X("v-if", !0) : (G(), K("circle", {
			key: 0,
			cx: "15",
			cy: "15",
			r: "13",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			pathLength: "100",
			"stroke-dasharray": `${f.value} 100`
		}, null, 8, gh))])), J("span", null, R(f.value === null ? "—" : `${Math.round(f.value)}%`), 1)], 42, mh), o.value ? (G(), q(ph, {
			key: 0,
			id: B(l),
			class: "absolute bottom-full right-0 z-30 mb-2 w-full max-w-[340px] overflow-y-auto overscroll-contain",
			style: oe({ maxHeight: `${c.value}px` }),
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
		])) : X("v-if", !0)], 544)), [[Fa, e.visible ?? e.active]]);
	}
}), vh = [
	"none",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
], yh = {
	key: 0,
	class: "flex flex-wrap gap-2 px-2 pb-2"
}, bh = ["src", "alt"], xh = { class: "truncate" }, Sh = [
	"disabled",
	"onClick",
	"aria-label"
], Ch = ["aria-label", "onClick"], wh = {
	key: 1,
	class: "px-2 pb-2 text-sm text-[#d4d4d4]",
	role: "status"
}, Th = {
	key: 2,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, Eh = {
	key: 3,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, Dh = { class: "composer-body" }, Oh = ["placeholder"], kh = { class: "composer-controls flex items-center gap-3" }, Ah = ["aria-expanded", "disabled"], jh = { class: "composer-hint min-w-0 flex-1 px-1 text-[11px] text-[#a3a3a3]" }, Mh = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], Nh = { class: "truncate" }, Ph = [
	"type",
	"disabled",
	"aria-label",
	"title"
], Fh = {
	key: 0,
	viewBox: "0 0 24 24",
	class: "size-5",
	fill: "currentColor",
	"aria-hidden": "true"
}, Ih = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "size-5",
	"aria-hidden": "true"
}, Lh = ["id", "aria-label"], Rh = { class: "flex shrink-0 items-center gap-2 border-b border-[#424242] p-2" }, zh = { class: "min-w-0 flex-1 truncate" }, Bh = {
	key: 0,
	class: "flex shrink-0 items-center justify-between gap-3 border-b border-[#424242] px-3 py-2"
}, Vh = ["value", "disabled"], Hh = ["value"], Uh = { class: "min-h-0 overflow-y-auto overscroll-contain" }, Wh = ["data-provider", "onClick"], Gh = { class: "min-w-0 flex-1 truncate" }, Kh = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, qh = ["data-model", "onClick"], Jh = { class: "min-w-0 flex-1 break-all" }, Yh = {
	key: 0,
	"aria-label": "Selected"
}, Xh = {
	key: 0,
	class: "px-3 py-3 text-[#a3a3a3]"
}, Zh = {
	key: 5,
	class: "absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
}, Qh = /* @__PURE__ */ H({
	__name: "ChatComposer",
	props: {
		profile: {},
		sessionId: {},
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
		let r = e, i = n, a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z([]), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(!1), d = /* @__PURE__ */ z(), f = /* @__PURE__ */ z(), p = /* @__PURE__ */ z(), m = /* @__PURE__ */ z(), h = /* @__PURE__ */ z(!1), g = /* @__PURE__ */ z(!1), _;
		function v() {
			let e = p.value;
			if (!e) return;
			let t = getComputedStyle(e), n = parseFloat(t.paddingTop || "0") + parseFloat(t.paddingBottom || "0");
			e.style.height = "0px";
			let r = e.scrollHeight - n, i = parseFloat(t.lineHeight) || 24, a = Math.max(parseFloat(t.minHeight) || 0, Math.min(r, 8 * i)) + n;
			e.style.height = `${a}px`;
		}
		function y(e) {
			e.button === 0 && document.activeElement === p.value && e.preventDefault();
		}
		function b() {
			h.value = !0, w.value = !1, s.value = !1, x();
		}
		function x() {
			vn(v);
		}
		function S(e) {
			(!(e.relatedTarget instanceof Node) || !m.value?.contains(e.relatedTarget)) && (h.value = !1);
		}
		In(a, () => v(), { flush: "post" }), sr(() => {
			if (v(), typeof ResizeObserver < "u") {
				let e = -1;
				_ = new ResizeObserver((t) => {
					let n = t[0]?.contentRect.width;
					n !== void 0 && n !== e && (e = n, v());
				}), p.value && _.observe(p.value);
			}
		}), ur(() => _?.disconnect()), In(() => r.suggestedPrompt, (e) => {
			e && (a.value = e);
		}, { immediate: !0 });
		let C = Z(() => (r.models || []).filter((e) => e.parent !== null)), w = /* @__PURE__ */ z(!1), T = /* @__PURE__ */ z(null), E = /* @__PURE__ */ z(""), D = /* @__PURE__ */ z(), O = /* @__PURE__ */ z(), k = Kn(), A = Z(() => r.imagesSupported === !1 && c.value.some((e) => e.type.startsWith("image/"))), ee = Z(() => r.sending || r.modelsLoading), j = /* @__PURE__ */ z(!1);
		function te() {
			j.value = window.innerWidth <= 700 || !!window.matchMedia?.("(hover: none) and (max-height: 500px)").matches;
		}
		te(), sr(() => window.addEventListener("resize", te)), ur(() => window.removeEventListener("resize", te));
		let M = Z(() => h.value && j.value), N = Z(() => r.providers?.find((e) => e.slug === T.value)), ne = Z(() => N.value?.name || "Model routes"), re = Z(() => {
			let e = w.value && T.value !== null ? T.value : r.provider || "", t = e ? r.providers?.find((t) => t.slug === e) : void 0, n = w.value ? E.value || r.model || r.defaultModel || "" : r.model || r.defaultModel || "";
			return t?.capabilities?.[n]?.reasoning !== !1;
		}), ie = Z(() => {
			let e = N.value, t = e ? e.models : C.value.map((e) => e.id);
			return [.../* @__PURE__ */ new Set([...(e?.is_current || !r.providers?.length) && r.defaultModel ? [r.defaultModel] : [], ...t])];
		});
		async function ae() {
			await vn();
		}
		function P() {
			w.value && (w.value = !1, D.value?.focus());
		}
		function oe() {
			if (w.value) {
				P();
				return;
			}
			ee.value || (s.value = !1, T.value = null, E.value = r.model || r.defaultModel || "", w.value = !0, ae());
		}
		function se(e) {
			T.value = e;
			let t = r.providers?.find((t) => t.slug === e);
			E.value = e === (r.provider || "") ? r.model || r.defaultModel || "" : t?.models[0] || "", ae();
		}
		function ce() {
			T.value = null, E.value = r.model || r.defaultModel || "", ae();
		}
		function le(e) {
			ee.value || (E.value = e, i("update:provider", T.value || ""), i("update:model", N.value?.is_current && e === r.defaultModel ? "" : e), P());
		}
		function ue(e) {
			let t = e.composedPath();
			O.value && !t.includes(O.value) && D.value && !t.includes(D.value) && P();
		}
		function F(e) {
			if (w.value && (e.key === "Escape" && (e.preventDefault(), P()), e.key === "Tab")) {
				let t = Array.from(O.value?.querySelectorAll("button, select") || []), n = e.shiftKey ? t.at(-1) : t[0];
				document.activeElement === (e.shiftKey ? t[0] : t.at(-1)) && (e.preventDefault(), n?.focus());
			}
		}
		In(ee, (e) => {
			e && P();
		}), In(() => r.providers, () => P()), sr(() => {
			document.addEventListener("click", ue), document.addEventListener("keydown", F);
		}), ur(() => {
			document.removeEventListener("click", ue), document.removeEventListener("keydown", F);
		});
		let de = Z(() => r.sending ? !r.stoppable || !!a.value.trim() && (u.value || c.value.some((e) => !!e.uploadError) || A.value) : r.disabled || u.value || c.value.some((e) => !!e.uploadError) || A.value || !a.value.trim() && !c.value.length);
		function I(e) {
			e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || g.value || e.isComposing || e.keyCode === 229 || e.defaultPrevented || window.innerWidth <= 700 || (e.preventDefault(), L());
		}
		function L() {
			if (de.value) return;
			if (r.sending && a.value.trim()) {
				i("steer", a.value.trim()), a.value = "";
				return;
			}
			if (r.disabled || r.sending || u.value || c.value.some((e) => !!e.uploadError) || A.value) return;
			let e = a.value.trim();
			(e || c.value.length) && (i("send", o.value ? `/${o.value}\n${e}` : e, [...c.value]), a.value = "", c.value = [], s.value = !1, o.value = null);
		}
		async function fe(e) {
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
		let pe = 0;
		ur(() => {
			pe++;
		});
		async function me(e) {
			let t = pe;
			try {
				let n = await Q.upload(r.profile || "", e);
				if (t !== pe) return;
				e.path = n.path, e.uploadError = void 0;
			} catch {
				t === pe && (e.uploadError = "Upload failed. Retry or remove this file.");
			}
		}
		async function he(e) {
			if (!u.value) {
				u.value = !0;
				try {
					await me(e);
				} finally {
					u.value = !1;
				}
			}
		}
		async function ge(e) {
			if (u.value) return;
			let t = pe;
			u.value = !0, l.value = "", s.value = !1;
			try {
				for (let n of e) try {
					if (n.size > 20971520) throw Error("Each file must be 20 MB or smaller.");
					if (c.value.length >= 5) throw Error("Attach up to five files per message.");
					let e = await new Promise((e, t) => {
						let r = new FileReader();
						r.onload = () => e(String(r.result)), r.onerror = () => t(/* @__PURE__ */ Error("Could not read file.")), r.onabort = () => t(/* @__PURE__ */ Error("File reading was cancelled. Try again.")), r.readAsDataURL(n);
					});
					if (n.type.startsWith("image/") && (e = await fe(e)), t !== pe) return;
					let r = n.type.startsWith("image/") ? e.slice(5, e.indexOf(";")) : n.type || "application/octet-stream", i = {
						name: n.name,
						type: r,
						data: e,
						size: n.size
					};
					c.value.push(i), await me(i);
				} catch (e) {
					if (t !== pe) return;
					l.value = e instanceof Error ? e.message : "Could not read file.";
				}
			} finally {
				t === pe && (u.value = !1);
			}
		}
		async function _e(e) {
			let t = e.target;
			await ge(Array.from(t.files || [])), t.value = "";
		}
		return t({
			stageFiles: ge,
			blurInput: () => p.value?.blur()
		}), (t, n) => (G(), K("form", {
			ref_key: "form",
			ref: m,
			onFocusout: S,
			class: "composer relative mx-auto mb-0 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:w-[calc(100%-48px)]",
			onSubmit: Do(L, ["prevent"])
		}, [
			c.value.length ? (G(), K("div", yh, [(G(!0), K(W, null, U(c.value, (e, t) => (G(), K("div", {
				key: t,
				class: "flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm"
			}, [
				e.type.startsWith("image/") ? (G(), K("img", {
					key: 0,
					src: e.data,
					alt: e.name,
					class: "size-12 rounded-lg object-cover"
				}, null, 8, bh)) : X("v-if", !0),
				J("span", xh, R(e.name), 1),
				e.uploadError ? (G(), K("button", {
					key: 1,
					type: "button",
					class: "text-red-200 underline",
					disabled: u.value,
					onClick: (t) => he(e),
					"aria-label": `Retry upload ${e.name}`
				}, " Retry upload", 8, Sh)) : X("v-if", !0),
				J("button", {
					type: "button",
					"aria-label": `Remove ${e.name}`,
					onMousedown: y,
					onClick: (e) => c.value.splice(t, 1)
				}, " × ", 40, Ch)
			]))), 128))])) : X("v-if", !0),
			o.value ? (G(), K("p", wh, [Y(R(o.value === "goal" ? "Goal mode" : "Plan mode") + " · next message ", 1), J("button", {
				type: "button",
				class: "ml-2 underline",
				onClick: n[0] ||= (e) => o.value = null
			}, "Turn off")])) : X("v-if", !0),
			A.value ? (G(), K("p", Th, " Image sending is unavailable for this native capability. Remove the image to send text or files. ")) : X("v-if", !0),
			l.value ? (G(), K("p", Eh, R(l.value), 1)) : X("v-if", !0),
			J("div", Dh, [
				n[17] ||= J("label", {
					class: "sr-only",
					for: "prompt"
				}, "Message Hermes", -1),
				V(J("textarea", {
					ref_key: "textarea",
					ref: p,
					id: "prompt",
					"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
					rows: "1",
					maxlength: "65536",
					placeholder: e.projectName ? `Message ${e.projectName}` : "Message Hermes…",
					class: "composer-input min-h-14 w-full resize-none bg-transparent px-2 py-1 text-base leading-6 text-white outline-none placeholder:text-[#b4b4b4]",
					onFocus: b,
					onBlur: x,
					onKeydown: I,
					onCompositionstart: n[2] ||= (e) => g.value = !0,
					onCompositionend: n[3] ||= (e) => g.value = !1
				}, null, 40, Oh), [[_o, a.value]]),
				J("input", {
					ref_key: "files",
					ref: d,
					type: "file",
					multiple: "",
					hidden: "",
					"aria-label": "Upload files",
					onChange: _e
				}, null, 544),
				J("input", {
					ref_key: "camera",
					ref: f,
					type: "file",
					accept: "image/*",
					capture: "environment",
					hidden: "",
					"aria-label": "Take a photo",
					onChange: _e
				}, null, 544),
				J("div", kh, [
					V(J("button", {
						class: "attach-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#424242] p-0 text-white disabled:opacity-55",
						type: "button",
						"aria-label": "Attachment options",
						"aria-expanded": s.value,
						disabled: e.sending || u.value,
						onClick: n[4] ||= (e) => {
							P(), s.value = !s.value;
						}
					}, [...n[13] ||= [J("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						class: "size-5",
						"aria-hidden": "true"
					}, [J("path", { d: "M12 5v14M5 12h14" })], -1)]], 8, Ah), [[Fa, !M.value]]),
					J("p", jh, R(u.value ? "Preparing attachments…" : e.reason || ""), 1),
					e.sessionId ? (G(), q(_h, {
						key: e.sessionId,
						visible: !M.value && !w.value && !s.value,
						active: !h.value && !w.value && !s.value,
						usage: e.contextUsage ?? null,
						breakdown: e.contextBreakdown ?? null,
						loading: e.contextLoading ?? !1,
						model: e.model || e.defaultModel,
						onOpen: n[5] ||= (e) => i("context-open", e)
					}, null, 8, [
						"visible",
						"active",
						"usage",
						"breakdown",
						"loading",
						"model"
					])) : X("v-if", !0),
					V(J("button", {
						ref_key: "pill",
						ref: D,
						type: "button",
						class: "model-pill flex h-[30px] min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-0 text-[16px] text-white disabled:opacity-55",
						"aria-label": "Choose model",
						"aria-haspopup": "dialog",
						"aria-expanded": w.value,
						"aria-controls": B(k),
						disabled: ee.value,
						onClick: oe
					}, [J("span", Nh, R(e.modelsLoading ? "Loading models…" : e.model || e.defaultModel || "Default"), 1), n[14] ||= J("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-4 shrink-0",
						"aria-hidden": "true"
					}, [J("path", { d: "m6 9 6 6 6-6" })], -1)], 8, Mh), [[Fa, !M.value]]),
					J("button", {
						class: "send-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#2563eb] p-0 text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
						type: e.sending && !a.value.trim() ? "button" : "submit",
						disabled: de.value,
						"aria-label": e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						title: e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						onMousedown: y,
						onClick: n[6] ||= (t) => e.sending ? a.value.trim() ? L() : e.stoppable && i("stop") : L()
					}, [e.sending && !a.value.trim() ? (G(), K("svg", Fh, [...n[15] ||= [J("rect", {
						x: "6",
						y: "6",
						width: "12",
						height: "12",
						rx: "2"
					}, null, -1)]])) : (G(), K("svg", Ih, [...n[16] ||= [J("path", { d: "M12 19V5m-6 6 6-6 6 6" }, null, -1)]]))], 40, Ph)
				])
			]),
			w.value ? (G(), K("div", {
				key: 4,
				id: B(k),
				ref_key: "panel",
				ref: O,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": T.value === null ? "Choose provider" : ne.value,
				class: "model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl"
			}, [
				J("div", Rh, [
					T.value === null ? X("v-if", !0) : (G(), K("button", {
						key: 0,
						type: "button",
						"aria-label": "Back to providers",
						class: "picker-back rounded-full p-2 hover:bg-[#424242]",
						onClick: ce
					}, [...n[18] ||= [J("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-5",
						"aria-hidden": "true"
					}, [J("path", { d: "m15 18-6-6 6-6" })], -1)]])),
					J("h2", zh, R(T.value === null ? "Choose provider" : ne.value), 1),
					J("button", {
						type: "button",
						"aria-label": "Close model picker",
						class: "rounded-full px-3 py-2 hover:bg-[#424242]",
						onClick: P
					}, " × ")
				]),
				re.value ? (G(), K("label", Bh, [n[20] ||= J("span", null, "Reasoning effort", -1), J("select", {
					"aria-label": "Reasoning effort",
					class: "min-w-0 rounded-lg bg-[#303030] px-2 py-1 text-base text-white",
					value: e.reasoningEffort || "",
					disabled: ee.value,
					onChange: n[7] ||= (e) => i("update:reasoningEffort", e.target.value)
				}, [n[19] ||= J("option", { value: "" }, "Model default", -1), (G(!0), K(W, null, U(B(vh), (e) => (G(), K("option", {
					key: e,
					value: e
				}, R(e === "xhigh" ? "XHigh" : e[0].toUpperCase() + e.slice(1)), 9, Hh))), 128))], 40, Vh)])) : X("v-if", !0),
				J("div", Uh, [T.value === null ? (G(), K(W, { key: 0 }, [(G(!0), K(W, null, U(e.providers, (e) => (G(), K("button", {
					key: e.slug,
					type: "button",
					class: "provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": e.slug,
					onClick: (t) => se(e.slug)
				}, [J("span", Gh, R(e.name), 1), e.is_current ? (G(), K("span", Kh, "Current")) : X("v-if", !0)], 8, Wh))), 128)), J("button", {
					type: "button",
					class: "provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": "",
					onClick: n[8] ||= (e) => se("")
				}, " Model routes ")], 64)) : (G(), K(W, { key: 1 }, [(G(!0), K(W, null, U(ie.value, (t) => (G(), K("button", {
					key: t,
					type: "button",
					class: "model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-model": t,
					onClick: (e) => le(t)
				}, [J("span", Jh, R(t), 1), (e.provider || "") === T.value && t === (e.model || e.defaultModel) ? (G(), K("span", Yh, "✓")) : X("v-if", !0)], 8, qh))), 128)), ie.value.length ? X("v-if", !0) : (G(), K("p", Xh, "No models available"))], 64))])
			], 8, Lh)) : X("v-if", !0),
			s.value ? (G(), K("div", Zh, [
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[9] ||= (e) => d.value?.click()
				}, " Upload files "),
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[10] ||= (e) => f.value?.click()
				}, " Take a photo "),
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "goal",
					onClick: n[11] ||= (e) => {
						o.value = "goal", s.value = !1;
					}
				}, " Goal mode "),
				J("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "plan",
					onClick: n[12] ||= (e) => {
						o.value = "plan", s.value = !1;
					}
				}, " Plan mode ")
			])) : X("v-if", !0)
		], 544));
	}
}), $h = { class: "chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden" }, eg = {
	key: 0,
	class: "pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-dashed border-[#a3a3a3] bg-[#212121]/95 text-lg",
	role: "status"
}, tg = { class: "chat-content flex min-h-0 flex-1 flex-col overflow-hidden" }, ng = {
	key: 0,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white",
	role: "status"
}, rg = {
	key: 1,
	class: "notice px-5 py-3 text-sm text-[#b4b4b4]",
	role: "status"
}, ig = {
	key: 2,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, ag = { class: "composer-dock shrink-0" }, og = /* @__PURE__ */ H({
	__name: "ChatInterface",
	props: {
		showChat: { type: Boolean },
		hideComposer: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(), r = /* @__PURE__ */ z();
		Mn(Zm, r);
		let i = !1;
		function a() {
			i = !0, r.value ? r.value.focusLatestMessage() : n.value?.blurInput();
		}
		In(r, (e) => {
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
		let { view: m, scope: h, composer: g, actions: _ } = Xm(), { profile: v, session: y, offline: b, canStream: x, reasoningEffort: S, models: C, providers: w, modelsLoading: T, model: E, provider: D, defaultModel: O, suggestedPrompt: k } = h, { busy: A, active: ee, reconnect: j, error: te, unavailable: M, connection: N } = m;
		return (t, r) => (G(), K("div", $h, [
			c.value && e.showChat ? (G(), K("div", eg, " Drop files to attach ")) : X("v-if", !0),
			J("div", tg, [
				B(b) ? (G(), K("div", ng, " You are offline. Messages cannot be loaded or sent. ")) : X("v-if", !0),
				e.showChat && B(j) ? (G(), K("div", rg, [Y(R(B(N) === "reconnecting" ? "Reconnecting…" : "Session is read-only until reconnected.") + " ", 1), B(x) && B(N) === "stale" && !B(b) ? (G(), K("button", {
					key: 0,
					class: "ml-3 underline",
					onClick: r[0] ||= (...e) => B(_).retry && B(_).retry(...e)
				}, " Reconnect ")) : X("v-if", !0)])) : X("v-if", !0),
				e.showChat && B(te) ? (G(), K("div", ig, [
					Y(R(B(te)) + " ", 1),
					B(y) ? (G(), K("button", {
						key: 0,
						class: "underline",
						onClick: r[1] ||= (...e) => B(_).retry && B(_).retry(...e)
					}, R(B(j) ? "Retry connection" : "Refresh history"), 1)) : X("v-if", !0),
					B(M) ? (G(), K("button", {
						key: 1,
						class: "ml-3 underline",
						onClick: r[2] ||= (...e) => B(_).resolve && B(_).resolve(...e)
					}, " Resolve uncertain submission ")) : X("v-if", !0)
				])) : X("v-if", !0),
				vr(t.$slots, "default")
			]),
			J("div", ag, [V((G(), q(Qh, {
				ref_key: "picker",
				ref: n,
				profile: B(v),
				"session-id": B(x) && B(y) || void 0,
				"context-usage": B(m).contextUsage.value,
				"context-breakdown": B(m).contextBreakdown.value,
				"context-loading": B(m).contextLoading.value,
				onContextOpen: B(_).setContextOpen,
				"project-name": B(g).projectName,
				key: JSON.stringify([B(v), B(y)]),
				disabled: B(g).disabled,
				models: B(C),
				providers: B(w),
				"models-loading": B(T),
				provider: B(D),
				"onUpdate:provider": B(_).setProvider,
				"default-model": B(O),
				"reasoning-effort": B(S),
				"onUpdate:reasoningEffort": B(_).setReasoningEffort,
				model: B(E),
				"onUpdate:model": B(_).setModel,
				sending: B(A),
				stoppable: B(ee) && !B(j),
				"suggested-prompt": B(k),
				reason: B(g).reason,
				onStop: B(_).stop,
				onSteer: s,
				onSend: o
			}, null, 8, [
				"profile",
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
			])), [[Fa, !e.hideComposer]])])
		]));
	}
}), sg = [
	"once",
	"session",
	"always",
	"deny"
];
function cg(e) {
	if (!e) return;
	let { id: t, method: n, params: r } = e;
	return n === "approval" && (r.choices === void 0 || Array.isArray(r.choices) && r.choices.every((e) => sg.includes(e))) ? {
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
function lg(e, t) {
	return `Attached ${e.type.startsWith("image/") ? "image" : "file"} ${e.name.replace(/[\r\n]/g, " ")}: ${t}\nMEDIA:"${t}"`;
}
function ug(e, t) {
	let { profile: n, session: r, messages: i, chatLoading: a, chatError: o, canStream: s, projectView: c, composerBlocked: l, selectedProject: u, creating: d, offline: f, models: p, providers: m, modelsLoading: h, model: g, provider: _, defaultModel: v, suggestedPrompt: y } = t, b = /* @__PURE__ */ z(/* @__PURE__ */ new Map()), x = /* @__PURE__ */ z(/* @__PURE__ */ new Map()), S = () => JSON.stringify([n.value || "default", r.value]), C = Z(() => {
		let t = e.settings.value;
		return t?.profile === n.value && t.session === r.value && t.generation === e.generationRef.value ? t.info : void 0;
	}), w = Z(() => {
		let e = C.value?.reasoning_effort;
		return b.value.get(S()) ?? (vh.includes(e) ? e : "");
	}), T = Z(() => x.value.get(S())?.model ?? (r.value ? C.value?.model || "" : g.value)), E = Z(() => x.value.get(S())?.provider ?? (r.value && C.value?.provider || _.value)), D = /* @__PURE__ */ z(!1), O = Z(() => D.value || !s.value || N.value || j.value || te.value || ne.value || f.value || !r.value);
	async function k(i) {
		if (O.value) return;
		let a = t.generation(), o = t.navigation(), s = n.value, c = r.value;
		D.value = !0;
		try {
			let e = await Q.branch(s, c, i);
			a === t.generation() && o === t.navigation() && s === n.value && c === r.value && await t.openBranch(e.id);
		} catch {
			a === t.generation() && o === t.navigation() && (e.error.value = "Could not branch this response. Refresh history and try again.");
		} finally {
			D.value = !1;
		}
	}
	let A = s, ee = Z(() => A.value ? e.messages.value : i.value), j = Z(() => e.busy.value || e.uncertain.value), te = Z(() => A.value ? e.loading.value : a.value), M = Z(() => A.value ? e.error.value : o.value), N = Z(() => !!e.approval.value), ne = Z(() => A.value && !!r.value && e.connection.value !== "ready"), re = Z(() => e.uncertain.value), ie = Z(() => e.busy.value);
	async function ae(i, a) {
		if (l.value || D.value || j.value || d.value || N.value || f.value || !s.value || h.value) return;
		let o = S(), u = w.value, p = n.value, m = T.value, g = E.value;
		if (c.value || !r.value) {
			let e = await t.createSession();
			if (!e || n.value !== p || r.value !== e) return;
			x.value.set(S(), {
				model: m,
				provider: g
			}), o !== S() && x.value.delete(o), u && (b.value.set(S(), u), o !== S() && b.value.delete(o));
		}
		let _ = t.generation(), C = n.value, O = [{
			type: "text",
			text: i
		}, ...a.flatMap((e) => [{
			type: "text",
			text: e.path ? lg(e, e.path) : "📎 " + e.name
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
					let r = n.path ? { path: n.path } : await Q.upload(C, n);
					if (_ !== t.generation()) throw Error("Session changed before submission");
					e.push({
						type: "text",
						text: lg(n, r.path)
					}), n.type.startsWith("image/") && e.push({
						type: "image_url",
						image_url: { url: n.data }
					});
				}
				return a.length ? e : i;
			}, {
				model: T.value || v.value,
				provider: E.value || void 0,
				...u ? { reasoning_effort: u } : {}
			}, O);
		} catch (n) {
			_ === t.generation() && !e.uncertain.value && (e.error.value = n instanceof Error ? n.message : "Message not submitted", y.value = i);
		}
	}
	async function P(e, t = []) {
		A.value && await ae(e, t);
	}
	async function oe() {
		let n = t.generation();
		if (A.value) {
			try {
				await e.stop();
			} catch {
				n === t.generation() && (e.error.value = "Could not stop the response.");
			}
			return;
		}
	}
	async function se(n) {
		let r = t.generation();
		if (A.value) {
			try {
				await e.steer(n);
			} catch {
				r === t.generation() && (e.error.value = "Response did not accept guidance.");
			}
			return;
		}
	}
	let ce = Z(() => {
		let t = e.approval.value;
		return t && typeof t.request_id == "string" && typeof t.kind == "string" ? cg({
			id: t.request_id,
			method: t.kind,
			params: t
		}) : void 0;
	});
	function le(e, n) {
		return n === t.generation() && ce.value?.id === e;
	}
	async function ue(t, n, r) {
		if (A.value && !ne.value && le(t, r)) try {
			await e.answer(t, { ...n });
		} catch {
			le(t, r) && (e.error.value = ce.value?.kind === "clarify" ? "Clarification could not be settled." : ce.value?.kind === "secret" ? "Secret request could not be settled." : "Approval could not be settled.");
		}
	}
	let F = Z(() => ({
		projectName: !l.value && !u.value?.isNoProject ? u.value?.label : void 0,
		disabled: !!(l.value || D.value || c.value && u.value?.archived || c.value && (!u.value || !u.value.isNoProject && !vl(u.value)) || f.value || d.value || h.value || te.value || N.value || re.value || ne.value || !s.value),
		reason: l.value ? "Open a chat." : c.value && u.value?.archived ? "Restore this project to start a new chat." : c.value && u.value && !u.value.isNoProject && !vl(u.value) ? "This Project has no workspace." : f.value ? "Offline · sending is unavailable." : N.value ? "Approval is pending in Hermes." : s.value ? void 0 : "Streaming turns are unavailable for this profile."
	})), de = {
		loadEarlier: () => e.loadEarlier(),
		branch: k,
		send: P,
		stop: oe,
		steer: se,
		answerFor: (e) => {
			let n = t.generation();
			return (t) => ue(e, t, n);
		},
		suggest: t.suggest,
		setContextOpen: (t) => e.setContextOpen(t),
		retry: () => ne.value ? e.reconnect() : t.retryHistory(),
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
			hasEarlier: e.hasEarlier,
			loadingEarlier: e.loadingEarlier,
			earlierError: e.earlierError,
			contextUsage: Z(() => C.value ? e.contextUsage.value : null),
			contextBreakdown: Z(() => C.value ? e.contextBreakdown.value : null),
			contextLoading: e.contextLoading,
			messages: ee,
			branchDisabled: O,
			responseTargets: e.responseTargets,
			busy: j,
			loading: te,
			error: M,
			approvalPending: N,
			reconnect: ne,
			unavailable: re,
			active: ie,
			request: ce,
			connection: Z(() => e.connection.value),
			status: Z(() => A.value ? e.status.value : "")
		},
		composer: F,
		actions: de,
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
			suggestedPrompt: Z(() => y.value)
		}
	};
}
//#endregion
//#region src/composables/useDrawerSwipe.ts
var dg = "button, a, input, textarea, select, label, summary, audio, video, [role=\"button\"], [role=\"link\"], [role=\"slider\"], [role=\"checkbox\"], [role=\"switch\"], [role=\"combobox\"], [role=\"textbox\"], [role=\"menuitem\"], [tabindex]:not([data-chat-message]):not(.transcript), [contenteditable]:not([contenteditable=\"false\"]), .composer, pre, code";
function fg(e, t, n, r) {
	let i = /* @__PURE__ */ z(null), a, o = 0, s = 0, c = 0, l = 0, u = () => window.matchMedia("(max-width: 700px)").matches;
	function d() {
		a = void 0, i.value = null;
	}
	In(e, d, { flush: "sync" });
	function f(r) {
		if (d(), !u() || r.touches.length !== 1) return;
		let i = r.touches[0], l = r.target;
		if (!(i.clientX < 30 || !(l instanceof Element) || l.closest(dg)) && (e.value || l.closest(".transcript"))) {
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
var pg = "chathermes.keep-screen-awake";
function mg() {
	try {
		return localStorage.getItem(pg) === "true";
	} catch {
		return !1;
	}
}
function hg() {
	let e = /* @__PURE__ */ z(mg()), t = /* @__PURE__ */ z(!1), n = !1, r = !0, i = null, a = null, o = 0, s = null;
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
			localStorage.setItem(pg, String(t));
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
var gg = Symbol("inbox");
function _g(e) {
	Mn(gg, e);
}
function vg() {
	let e = Nn(gg);
	if (!e) throw Error("inbox context is missing");
	return e;
}
//#endregion
//#region src/features/artifacts/context.ts
var yg = Symbol("artifacts");
function bg(e) {
	Mn(yg, e);
}
function xg() {
	let e = Nn(yg);
	if (!e) throw Error("artifacts context is missing");
	return e;
}
//#endregion
//#region src/features/settings/context.ts
var Sg = Symbol("settings");
function Cg(e) {
	Mn(Sg, e);
}
function wg() {
	let e = Nn(Sg);
	if (!e) throw Error("settings context is missing");
	return e;
}
//#endregion
//#region src/features/projects/context.ts
var Tg = Symbol("projects");
function Eg(e) {
	let t = Oc(), n = /* @__PURE__ */ z();
	In(() => t.fullPath, () => {
		n.value = void 0;
	}), Mn(Tg, {
		...e,
		projectConfirmation: n
	});
}
function Dg() {
	let e = Nn(Tg);
	if (!e) throw Error("projects context is missing");
	return e;
}
//#endregion
//#region src/features/scheduled/composables/useScheduledHistory.ts
var Og = Symbol("scheduled");
function kg(e) {
	let t = {
		...e,
		current: /* @__PURE__ */ qt()
	};
	return Mn(Og, t), t;
}
function Ag() {
	let e = Nn(Og);
	if (!e) throw Error("Scheduled context is missing");
	return e;
}
function jg(e) {
	return e.state === "completed" || e.state === "error" ? "completed" : e.state === "paused" || e.enabled === !1 ? "paused" : "active";
}
function Mg(e) {
	return e > 0 ? (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString() : "Run date unavailable";
}
function Ng(e) {
	if (!e) return "Never run";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? "Last run date unavailable" : "Last run: " + t.toLocaleString();
}
function Pg(e) {
	let t = Ag(), n = Oc(), r = /* @__PURE__ */ z(!1), i = /* @__PURE__ */ z(""), a = /* @__PURE__ */ z(), o, s = Promise.resolve(), c = "", l = !1, u = () => JSON.stringify([
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
				l.signal.aborted || (i.value = e instanceof il && e.status === 503 ? "Scheduled history is unavailable in this Hermes version." : "Could not load scheduled history. The job or output may no longer be available.");
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
	return t.current.value = f, In([
		() => t.profile.value,
		() => n.params.jobId,
		() => n.params.runId
	], d, { immediate: !0 }), we(() => {
		l = !0, o?.abort(), t.current.value === f && (t.current.value = void 0);
	}), f;
}
async function Fg(e, t, n) {
	let r = (await Q.scheduled(e, n)).jobs.find((e) => e.id === t);
	if (!r) throw Error("Job unavailable");
	return r;
}
function Ig(e) {
	let t = _l(e?.messages.slice().reverse().find((e) => e.role === "assistant" && _l(e.content))?.content) || e?.output;
	return t ? [{
		role: "assistant",
		content: t
	}] : [];
}
//#endregion
//#region src/composables/useApplication.ts
function Lg() {
	let e = Dc(), t = Oc(), n = Z(() => t.meta.chat === !0), r = Z(() => t.meta.composer === "project"), i = Z(() => !n.value && !r.value), a = Z(() => t.name === "settings"), o = Z(() => t.meta.section === "scheduled"), s = !1, c = !1, l = Promise.resolve(), u = Promise.resolve(), d = "", f;
	async function p(t, n = !1, r = !1) {
		f?.abort(), d = r ? e.resolve(t).fullPath : "", r || (D.value = !1), St(!1), await e[n ? "replace" : "push"](t), await u, d = "";
	}
	function m(e, t = {}) {
		return Tl(e, h.value, g.value, we.value, t);
	}
	let h = /* @__PURE__ */ z(""), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z([]), v = /* @__PURE__ */ z([]), y = /* @__PURE__ */ z({}), b = /* @__PURE__ */ z(0), x = /* @__PURE__ */ z(!1), S = /* @__PURE__ */ z(!1), C = /* @__PURE__ */ z(!1), w = /* @__PURE__ */ z(!navigator.onLine), T = /* @__PURE__ */ z(""), E = /* @__PURE__ */ z(""), D = /* @__PURE__ */ z(!1), O = /* @__PURE__ */ z([]), k = /* @__PURE__ */ z([]), A = /* @__PURE__ */ z(""), ee = /* @__PURE__ */ z(""), j = /* @__PURE__ */ z(!1), te = /* @__PURE__ */ z([]), M = /* @__PURE__ */ z(""), N = /* @__PURE__ */ z(!1), ne = /* @__PURE__ */ z(!1), re = /* @__PURE__ */ z(""), ie = /* @__PURE__ */ z(null), ae = /* @__PURE__ */ z(null), P = /* @__PURE__ */ z(null), oe = /* @__PURE__ */ z(!1), se = /* @__PURE__ */ z(null), ce = Z(() => y.value.features?.native_chat === !0), le, ue, F = 0, de = 0, I = /* @__PURE__ */ z({
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: ""
	}), L = /* @__PURE__ */ z(!1), fe = /* @__PURE__ */ z(!1), pe = /* @__PURE__ */ z(""), me = 0, he = /* @__PURE__ */ z(null), ge = /* @__PURE__ */ new Set(), _e = /* @__PURE__ */ z([]), ve = /* @__PURE__ */ z(/* @__PURE__ */ new Set()), R = 0;
	async function ye(e, t) {
		if (w.value || ve.value.has(e) || ot.value) return;
		let n = h.value, r = de, i = _e.value.find((t) => t.session_id === e);
		Qe(), R++, ve.value.add(e), _e.value = [..._e.value.filter((t) => t.session_id !== e), {
			session_id: e,
			status: t,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}];
		try {
			let i = await Q.track(n, e, t);
			if (r !== de) return;
			i.session_id !== e && (_.value = _.value.map((t) => t.id === e ? {
				...t,
				id: i.session_id
			} : t)), _e.value = [..._e.value.filter((t) => t.session_id !== e && t.session_id !== i.session_id), i];
		} catch (t) {
			if (r !== de) return;
			_e.value = _e.value.filter((t) => t.session_id !== e), i && _e.value.push(i), T.value = t instanceof Error ? t.message : "Could not update tracking";
		} finally {
			r === de && (Qe(), ve.value.delete(e));
		}
	}
	function be(e) {
		e === h.value && $e();
	}
	function xe(e, t, n) {
		e === h.value && (_.value = _.value.map((e) => e.id === t ? {
			...e,
			title: n
		} : e));
	}
	let { projectBusy: Se, manageError: Ce, projectId: we, projects: Te, selectedProject: Ee, projectsLoading: De, projectLoading: Oe, projectsError: ke, projectError: Ae, projectsLoaded: je, visibleSessions: Me, subscribeProjectEvents: Ne, refreshProjects: Pe, loadProjects: Fe, loadProject: Ie, chooseProject: Le, showProjects: Re, manageProject: ze, resetProjects: Be, selectProjectScope: Ve, whenProjectsLoaded: He } = Dl({
		profile: h,
		session: g,
		sessions: _,
		offline: w,
		navigate: p,
		loadSessions: $e,
		refreshInbox: It,
		profileGeneration: () => de
	}), Ue = Nm(() => {
		Pe(), $e(), It();
	}, be, xe, Rt);
	Ym(ug(Ue, {
		profile: h,
		session: g,
		messages: v,
		chatLoading: C,
		chatError: E,
		canStream: ce,
		composerBlocked: i,
		projectView: r,
		selectedProject: Ee,
		creating: j,
		offline: w,
		models: k,
		providers: te,
		modelsLoading: N,
		model: A,
		provider: M,
		defaultModel: ee,
		suggestedPrompt: re,
		generation: () => F,
		navigation: () => e.currentRoute.value,
		createSession: rt,
		suggest: it,
		retryHistory: et,
		openBranch: async (e) => {
			await pt(e), Pe(), $e();
		}
	}));
	let We = hg(), Ge = zc(w), Ke = kg({
		profile: h,
		offline: w,
		creating: j,
		recentSession: Xe
	}), qe = ce;
	function Je() {
		Ue.close(), F++, ue?.abort(), C.value = !1;
	}
	function Ye() {
		Je(), le?.abort(), S.value = !1;
	}
	function Xe(e) {
		return pt(e, "");
	}
	async function Ze() {
		return await rt(!0);
	}
	function Qe() {
		le?.abort(), le = void 0, S.value = !1;
	}
	async function $e(e = !1) {
		R++, le?.abort();
		let t = new AbortController();
		le = t;
		let n = h.value, r = new Map(_.value.map((e) => [e.id, e.title]));
		S.value = !0, T.value = "";
		try {
			let [i, a] = await Promise.all([Q.sessions(n, e ? b.value : 0, t.signal), Q.tracking(n, t.signal).then((e) => ({
				value: e,
				error: ""
			}), () => ({
				value: void 0,
				error: "Could not load session tracking"
			}))]), o = a.value;
			if (t !== le || t.signal.aborted || n !== h.value) return;
			let s = _e.value.filter((e) => ve.value.has(e.session_id));
			o && (_e.value = [...o.tracking.filter((e) => !ve.value.has(e.session_id)), ...s]), a.error && (T.value = a.error);
			let c = i.sessions.filter((e) => !ge.has(e.id)).map((e) => {
				let t = _.value.find((t) => t.id === e.id);
				return t && r.has(e.id) && t.title !== r.get(e.id) ? {
					...e,
					title: t.title
				} : e;
			});
			_.value = e ? [..._.value.map((e) => c.find((t) => t.id === e.id) || e), ...c.filter((e) => !_.value.some((t) => t.id === e.id))] : c, _.value = [...new Map(_.value.map((e) => {
				let t = o?.aliases?.[e.id] || e.id;
				return [t, t === e.id ? e : {
					...e,
					id: t
				}];
			})).values()];
			let l = new Map(_.value.map((e) => [e.id, e]));
			for (let e of o?.sessions || []) !l.has(e.id) && !ge.has(e.id) && l.set(e.id, e);
			let u = [..._.value];
			for (let e of l.values()) {
				if (u.some((t) => t.id === e.id)) continue;
				let t = u.findIndex((t) => (t.last_active ?? t.started_at ?? 0) < (e.last_active ?? e.started_at ?? 0));
				u.splice(t < 0 ? u.length : t, 0, e);
			}
			_.value = u, b.value = typeof i.offset == "number" && typeof i.limit == "number" ? i.offset + i.limit : e ? b.value + i.sessions.length : i.sessions.length, x.value = i.has_more ?? (typeof i.total == "number" ? b.value < i.total : i.sessions.length === 30);
		} catch (e) {
			t === le && !t.signal.aborted && (T.value = e instanceof Error ? e.message : "Could not load sessions");
		} finally {
			t === le && (S.value = !1, le = void 0);
		}
	}
	async function et() {
		if (!g.value) return !1;
		if (qe.value) return await Ue.hydrate(), !0;
		ue?.abort();
		let e = new AbortController();
		ue = e;
		let t = F;
		C.value = !0, E.value = "";
		try {
			let n = await Q.messages(h.value, g.value, e.signal);
			if (t === F && e === ue) return v.value = n, !0;
		} catch (n) {
			t === F && !e.signal.aborted && (E.value = n instanceof Error ? n.message : "Could not load messages");
		} finally {
			e === ue && (C.value = !1);
		}
		return !1;
	}
	async function tt(e) {
		if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
			T.value = "Invalid profile name";
			return;
		}
		re.value = "", j.value = !1, ot.value = !1, st++, Ye(), Be(), h.value = e, g.value = "", _.value = [], _e.value = [], ve.value = /* @__PURE__ */ new Set(), ge.clear(), v.value = [], y.value = {}, k.value = [], te.value = [], M.value = "", A.value = "", ee.value = "", N.value = !0, T.value = "", E.value = "", b.value = 0, x.value = !1;
		let t = ++de;
		Ne(), Fe(), $e(), Promise.allSettled([Q.models(e), Q.modelOptions(e)]).then(([e, n]) => {
			t === de && (e.status === "fulfilled" && (k.value = e.value.data || [], ee.value = e.value.default_model || ""), n.status === "fulfilled" && Array.isArray(n.value.providers) && (te.value = n.value.providers.filter((e) => e.models.length || e.is_current), M.value = te.value.find((e) => e.is_current)?.slug || n.value.provider || "", ee.value = n.value.model || ee.value), N.value = !1);
		});
		try {
			let n = await Q.capabilities(e);
			t === de && h.value === e && (y.value = n);
		} catch {
			t === de && h.value === e && (y.value = {});
		}
	}
	async function nt(e) {
		(Q.isNative(h.value) || we.value || _.value.find((t) => t.id === e)?.cwd || _.value.find((t) => t.id === e)?.source === "desktop") && Q.workspace(h.value, e), re.value = "", Je(), g.value = e, v.value = [], E.value = "", D.value = !1;
		let t = F, n = h.value;
		if (!we.value && !Q.isWorkspace(n, e)) {
			try {
				await Q.session(n, e);
			} catch {}
			if (t !== F || n !== h.value) return;
		}
		qe.value ? await Ue.attach(n, e) : await et();
	}
	async function rt(t = !1) {
		if (w.value || j.value || !t && we.value && Ee.value?.archived) return;
		let n = h.value, r = t ? "" : we.value, i = g.value, a = e.currentRoute.value, o = F, s = de, c = f = new AbortController();
		j.value = !0;
		try {
			r && !M.value && (M.value = te.value.find((e) => e.is_current)?.slug || "", A.value = "");
			let t = r ? await Q.projectCreate(n, r) : await Q.create(n);
			if (c.signal.aborted || o !== F || h.value !== n || g.value !== i || a !== e.currentRoute.value) return;
			await pt(t.id, r), Pe();
			let l = ++R;
			return Q.tracking(n).then((e) => {
				if (s !== de || l !== R) return;
				_e.value = e.tracking;
				let t = new Map(_.value.map((e) => [e.id, e]));
				for (let n of e.sessions) ge.has(n.id) || t.set(n.id, n);
				_.value = [...t.values()];
			}).catch(() => {
				s === de && (T.value = "Could not load session tracking");
			}), h.value !== n || g.value !== t.id ? void 0 : t.id;
		} catch (t) {
			if (!c.signal.aborted && o === F && a === e.currentRoute.value && h.value === n && we.value === r) {
				let e = t instanceof Error ? t.message : "Could not create session";
				r ? Ae.value = e : T.value = e;
			}
		} finally {
			s === de && (j.value = !1);
		}
	}
	async function it(e) {
		let t = F, n = h.value, r = await rt();
		r && t + 1 === F && n === h.value && g.value === r && (re.value = e);
	}
	async function at(e, t) {
		let n = h.value, r = F;
		try {
			if (await Q.rename(n, e, t), r !== F || n !== h.value) return;
			let i = _.value.find((t) => t.id === e);
			i && (i.title = t), Pe();
		} catch (e) {
			r === F && n === h.value && (T.value = e instanceof Error ? e.message : "Could not rename session");
		}
	}
	let ot = /* @__PURE__ */ z(!1), st = 0;
	async function ct(e, t, n = "") {
		if (w.value || ot.value) return;
		let r = h.value, i = F, a = ++st, o = de;
		ot.value = !0, Qe();
		try {
			if (e === "archive" ? await Q.archive(r, t) : e === "delete" ? await Q.deleteSession(r, t) : await Q.moveSession(r, t, n), o !== de || r !== h.value) return;
			Qe(), e !== "project" && (ge.add(t), _.value = _.value.filter((e) => e.id !== t)), i === F && g.value === t && (e === "project" ? await p({
				name: "chat",
				params: { sessionId: t },
				query: {
					...r ? { profile: r } : {},
					project: n
				}
			}) : await p({
				name: "home",
				query: r ? { profile: r } : {}
			})), await $e(), Pe();
		} catch (e) {
			i === F && r === h.value && (T.value = e instanceof Error ? e.message : "Could not update session");
		} finally {
			a === st && (ot.value = !1);
		}
	}
	async function lt() {
		await Ue.availability(document.visibilityState === "visible", navigator.onLine), document.visibilityState === "visible" && (Pe(), It());
	}
	function ut() {
		location.href = "/";
	}
	function dt() {
		w.value = !navigator.onLine, Ue.availability(document.visibilityState === "visible", !w.value), w.value || (Pe(), $e(), lt());
	}
	function ft(t) {
		if (t && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(t)) {
			T.value = "Invalid profile name";
			return;
		}
		return p(a.value ? Tl("settings", t, "", "", { return_to: e.resolve(Tl("home", t)).fullPath }) : Tl("home", t), !1, !0);
	}
	function pt(e, t = we.value) {
		return p({
			name: "chat",
			params: { sessionId: e },
			query: {
				...h.value ? { profile: h.value } : {},
				...t ? { project: t } : {}
			}
		});
	}
	async function mt(n) {
		let r = Cl(t.query.profile);
		if ((!c || r !== h.value) && (c = !0, l = tt(r), await l, n !== e.currentRoute.value) || (await l, n !== e.currentRoute.value)) return;
		let i = typeof t.params.sessionId == "string" ? t.params.sessionId : Cl(t.query.session), a = typeof t.params.projectId == "string" ? t.params.projectId : Cl(t.query.project), o = () => Te.value.find((e) => e.sessionIds?.includes(i) || yl(e).some((e) => e.id === i)), s = a || t.name === "chat" && o()?.id || "";
		if (s !== we.value && Ve(s), i !== g.value && (i ? await nt(i) : (Je(), g.value = "", v.value = [], re.value = "")), n === e.currentRoute.value && r === h.value && (i && t.name === "chat" && i === g.value && await Rt(r, i), i && !a && t.name === "chat" && !je.value)) {
			if (await He(), n !== e.currentRoute.value || r !== h.value || i !== g.value) return;
			let t = o();
			t && t.id !== we.value && (we.value = t.id, Ee.value = t, Ie());
		}
	}
	In(() => t.fullPath, () => {
		if (!t.matched.length) return;
		let n = e.currentRoute.value;
		yt.cancel(), t.fullPath !== d && (D.value = !1), St(!1), Ce.value = "", s && (u = mt(n));
	}, { flush: "sync" });
	function ht() {
		D.value = !1, ie.value?.focus();
	}
	async function gt() {
		D.value = !0, await vn(), ae.value?.focus();
	}
	let _t = /* @__PURE__ */ z(null), vt = /* @__PURE__ */ z(null), yt = fg(D, () => _t.value?.getBoundingClientRect().width || Math.min(300, window.innerWidth * .85), () => vt.value?.$el.querySelector(".transcript") || null, (e) => {
		e !== D.value && (e ? gt() : ht());
	});
	async function bt() {
		await p(wl(Cl(t.query.return_to))), await vn(), window.matchMedia?.("(min-width: 701px)").matches ?? !0 ? he.value?.focus() : ie.value?.focus();
	}
	function xt() {
		if (!a.value) return p(m("settings", { return_to: t.fullPath }));
	}
	function St(e = !0) {
		oe.value && (oe.value = !1, e && P.value?.focus());
	}
	function Ct(e) {
		oe.value && se.value && !e.composedPath().includes(se.value) && St(!1);
	}
	function wt(e) {
		e.key !== "Escape" || e.defaultPrevented || e.target instanceof Element && e.target.closest("dialog[open]") || (D.value ? ht() : a.value ? (e.preventDefault(), bt()) : St());
	}
	async function Tt() {
		let e = h.value, t = ++me;
		fe.value = !0;
		let n = await Hm(e);
		t === me && e === h.value && (I.value = n, fe.value = !1);
	}
	In(h, () => {
		pe.value = "", I.value = {
			...I.value,
			subscribed: !1
		}, Tt();
	}, { flush: "sync" });
	async function Et() {
		if (L.value || fe.value) return;
		let e = h.value;
		L.value = !0, pe.value = "";
		try {
			I.value.subscribed ? await Wm(e) : await Um(e), await Tt();
		} catch (t) {
			e === h.value && (pe.value = t instanceof Error ? t.message : "Could not update notifications."), await Tt();
		} finally {
			L.value = !1;
		}
	}
	async function Dt() {
		if (L.value || fe.value) return;
		let e = h.value;
		L.value = !0, pe.value = "";
		try {
			await Gm(e), e === h.value && (pe.value = "Test notification scheduled.");
		} catch {
			e === h.value && (pe.value = "Could not send a test notification.");
		} finally {
			L.value = !1;
		}
	}
	let Ot, kt = Z(() => ({
		profile: h.value,
		session: g.value,
		chat: n.value,
		scheduled: o.value && t.params.jobId && t.params.runId ? {
			job: String(t.params.jobId),
			run: String(t.params.runId)
		} : void 0,
		connected: qe.value && Ue.connection.value === "ready" && !w.value
	}));
	In(kt, () => Ot?.publish(), { flush: "post" });
	async function At(n) {
		if (n.data?.type !== "chathermes.navigate" || typeof n.data.url != "string") return;
		let r = n.data.url, i = El(r), a = n.ports?.[0], c = !1;
		try {
			if (!i) return;
			await p(i);
			let n = e.currentRoute.value, r = e.resolve(i).fullPath, l = () => s && n === e.currentRoute.value && t.fullPath === r;
			if (!a || !l()) return;
			t.name === "chat" ? c = qe.value ? Ue.connection.value === "ready" && await Ue.hydrate() === !0 : !C.value && !E.value : o.value ? (await vn(), c = await Ke.current.value?.whenLoaded() === !0) : c = !0, await vn(), c &&= l();
		} catch {
			c = !1;
		} finally {
			a && (c && a.postMessage({
				type: "chathermes.navigated",
				url: r
			}), a.close());
		}
	}
	let jt = /* @__PURE__ */ z(0), Mt = /* @__PURE__ */ z(0), Nt, Pt, Ft = "";
	async function It(e = !0) {
		if (document.visibilityState === "hidden") return;
		Pt?.abort();
		let t = Pt = new AbortController();
		try {
			let n = await Q.inbox(h.value, { limit: 1 }, t.signal);
			if (t.signal.aborted) return;
			jt.value = n.unread, e && Rt(h.value, g.value);
			let r = JSON.stringify([
				n.revision,
				n.unread,
				n.items[0]?.id
			]);
			r !== Ft && (Ft = r, Mt.value++);
		} catch {}
	}
	let Lt = /* @__PURE__ */ new Map();
	async function Rt(e, n) {
		let r = () => s && !!n && e === h.value && n === g.value && t.name === "chat" && !E.value && (!qe.value || Ue.connection.value === "ready" || !!Ue.approval.value || Ue.requests.value.length > 0);
		if (!r()) return;
		Ot?.publish();
		let i = JSON.stringify([e, n]), a = (Lt.get(i) || Promise.resolve()).then(async () => {
			let t, i = !1;
			try {
				do {
					if (!r()) return;
					let a = await Q.inbox(e, {
						scope: "profile",
						limit: 100,
						cursor: t
					});
					if (!r()) return;
					let o = a.items.filter((t) => t.profile === (e || "default") && t.session === n);
					await Promise.all(o.map((t) => Q.deleteInboxItem(e, t.id))), i ||= o.length > 0, t = a.nextCursor || void 0;
				} while (t);
			} catch {} finally {
				i && e === h.value && It(!1);
			}
		});
		Lt.set(i, a), await a, Lt.get(i) === a && Lt.delete(i);
	}
	async function zt(t) {
		let n = e.currentRoute.value;
		if (await Q.session(t.profile, t.session), n !== e.currentRoute.value) throw Error("Navigation changed");
		if (await p({
			name: "chat",
			params: { sessionId: t.session },
			query: { profile: t.profile }
		}), h.value !== t.profile || g.value !== t.session || E.value || qe.value && Ue.connection.value !== "ready") throw Error("Chat unavailable");
		await Rt(t.profile, t.session);
	}
	return sr(async () => {
		It(), Nt = setInterval(() => void It(), 15e3), "serviceWorker" in navigator && (Ot = qm(navigator.serviceWorker, () => kt.value, () => location.href)), Q.profiles().then((e) => {
			O.value = e.profiles || [];
		}).catch(() => {
			T.value = "Could not load profiles";
		}), Tt(), "serviceWorker" in navigator && navigator.serviceWorker.addEventListener("message", At), ne.value = !!ie.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", lt), addEventListener("online", dt), addEventListener("offline", dt), addEventListener("keydown", wt), document.addEventListener("click", Ct), await e.isReady(), s = !0, u = mt(e.currentRoute.value), await u;
	}), dr(() => {
		clearInterval(Nt), Pt?.abort(), s = !1, e.options.history.destroy(), Ot?.stop(), Ot = void 0, de++, document.removeEventListener("visibilitychange", lt), "serviceWorker" in navigator && navigator.serviceWorker.removeEventListener("message", At), Ye(), removeEventListener("online", dt), removeEventListener("offline", dt), removeEventListener("keydown", wt), document.removeEventListener("click", Ct);
	}), _g({
		profile: h,
		inboxRevision: Mt,
		openInboxItem: zt,
		refreshInbox: It
	}), bg({
		profile: h,
		projects: Te,
		recentSession: Xe
	}), Cg({
		kanban: Ge,
		profile: h,
		profiles: O,
		pushState: I,
		pushBusy: L,
		pushLoading: fe,
		pushMessage: pe,
		wakeLock: We,
		chooseProfile: ft,
		togglePush: Et,
		testPush: Dt,
		closeSettings: bt
	}), Eg({
		profile: h,
		projectId: we,
		selectedProject: Ee,
		projects: Te,
		projectsLoading: De,
		projectLoading: Oe,
		projectsError: ke,
		projectError: Ae,
		manageError: Ce,
		projectBusy: Se,
		offline: w,
		visibleSessions: Me,
		chooseProject: Le,
		showProjects: Re,
		loadProject: Ie,
		loadProjects: Fe,
		recentSession: Xe,
		chooseSession: pt,
		manageProject: ze,
		createSession: rt,
		creating: j
	}), {
		profile: h,
		session: g,
		sessions: _,
		projects: Te,
		selectedProject: Ee,
		projectId: we,
		offline: w,
		creating: j,
		profiles: O,
		loading: S,
		error: T,
		hasMore: x,
		tracking: _e,
		trackingPending: ve,
		sessionBusy: ot,
		drawer: D,
		embedded: ne,
		menuButton: ie,
		closeButton: ae,
		screenMenuButton: P,
		screenMenuWrap: se,
		screenMenu: oe,
		sidebar: _t,
		chatPlane: vt,
		drawerSwipe: yt,
		kanban: Ge,
		settingsButton: he,
		inboxUnread: jt,
		settingsPage: a,
		projectView: r,
		recentSession: Xe,
		chooseProfile: ft,
		createSession: rt,
		trackSession: ye,
		newChat: Ze,
		loadSessions: $e,
		manageSession: ct,
		rename: at,
		exitPlugin: ut,
		showSettings: xt,
		openDrawer: gt,
		closeDrawer: ht,
		closeScreenMenu: St,
		screenLink: m
	};
}
//#endregion
//#region src/features/sessions/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var Rg = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, zg = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Bg = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Vg = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
}, Hg = ["aria-label"], Ug = { class: "session-head mt-4 mb-1 px-2.5 text-xs font-semibold text-[#a3a3a3]" }, Wg = [
	"aria-label",
	"disabled",
	"onClick"
], Gg = ["aria-current", "onClick"], Kg = { class: "truncate" }, qg = ["title"], Jg = [
	"aria-label",
	"disabled",
	"onClick"
], Yg = ["disabled"], Xg = ["aria-label"], Zg = {
	key: 0,
	class: "grid gap-1"
}, Qg = ["disabled"], $g = ["value"], e_ = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, t_ = ["disabled"], n_ = {
	key: 2,
	class: "grid gap-3 p-1"
}, r_ = ["disabled"], i_ = /* @__PURE__ */ H({
	__name: "SessionSidebar",
	props: {
		sessions: {},
		tracking: {},
		trackingPending: {},
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
		let n = e, r = t, i = Z(() => new Map((n.tracking || []).map((e) => [e.session_id, e]))), a = Z(() => {
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
		let s = Z(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.projects || []) {
				if (t.isNoProject) continue;
				let n = [...t.sessionIds || [], ...yl(t).map((e) => e.id)];
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
		}), v = Z(() => (n.projects || []).filter((e) => !e.archived && !e.isNoProject && (e.path || e.repos.some((e) => e.path))));
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
			e.error ? (G(), K("p", Rg, [Y(R(e.error) + " ", 1), J("button", {
				class: "underline",
				onClick: n[0] ||= (e) => r("retry")
			}, "Retry")])) : X("v-if", !0),
			e.loading && !e.sessions.length ? (G(), K("p", zg, " Loading sessions… ")) : e.sessions.length ? (G(), K("nav", Vg, [(G(!0), K(W, null, U(a.value, (t) => (G(), K("section", {
				key: t.label,
				"aria-label": t.label
			}, [J("h2", Ug, R(t.label), 1), (G(!0), K(W, null, U(t.sessions, (t) => (G(), K("div", {
				key: t.id,
				class: F(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [l.value === t.id ? (G(), K(W, { key: 0 }, [V(J("input", {
				"onUpdate:modelValue": n[1] ||= (e) => u.value = e,
				"aria-label": "Session title",
				maxlength: "160",
				class: "min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-base text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white",
				onKeydown: [ko(f, ["enter"]), n[2] ||= ko((e) => l.value = "", ["esc"])]
			}, null, 544), [[_o, u.value]]), J("button", {
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
				}, [...n[8] ||= [J("svg", {
					class: "size-5",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [J("circle", {
					cx: "12",
					cy: "12",
					r: "9"
				}), J("path", { d: "m8 12 3 3 5-6" })], -1)]], 8, Wg)) : X("v-if", !0),
				J("button", {
					class: "session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-current": e.selected === t.id ? "page" : void 0,
					onClick: (e) => r("select", t.id)
				}, [J("span", Kg, R(t.title || "Untitled session"), 1), J("span", {
					class: "truncate text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]",
					title: c(t)
				}, R(c(t)), 9, qg)], 8, Gg),
				J("button", {
					class: "icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-label": `Options for ${t.title || "Untitled session"}`,
					"aria-haspopup": "dialog",
					disabled: e.busy,
					onClick: (e) => y(t, e)
				}, " ⋮ ", 8, Jg)
			], 64))], 2))), 128))], 8, Hg))), 128))])) : (G(), K("p", Bg, " No conversations yet. ")),
			e.hasMore ? (G(), K("button", {
				key: 4,
				class: "load-more self-start rounded-md px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55",
				disabled: e.loading,
				onClick: n[3] ||= (e) => r("more")
			}, R(e.loading ? "Loading…" : "Load more"), 9, Yg)) : X("v-if", !0),
			J("dialog", {
				ref_key: "popup",
				ref: p,
				class: "session-popup fixed m-0 w-52 rounded-xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl backdrop:bg-transparent",
				style: oe(_.value),
				"aria-label": h.value === "menu" ? "Session options" : h.value === "project" ? "Add to project" : "Delete conversation",
				onClick: n[7] ||= (e) => e.target === e.currentTarget && b()
			}, [h.value === "menu" ? (G(), K("div", Zg, [
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					disabled: e.busy || m.value && e.trackingPending?.has(m.value.id),
					onClick: o
				}, R(m.value && i.value.get(m.value.id)?.status === "open" ? "Mark settled" : "Make active"), 9, Qg),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: x
				}, " Rename "),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: n[4] ||= (e) => {
						h.value = "project", g.value = "";
					}
				}, " Add to project "),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					onClick: S
				}, " Archive "),
				J("button", {
					class: "rounded-lg px-3 py-2 text-left text-[#fecaca] hover:bg-[#303030]",
					onClick: n[5] ||= (e) => h.value = "delete"
				}, " Delete ")
			])) : h.value === "project" ? (G(), K("form", {
				key: 1,
				class: "grid gap-3 p-1",
				onSubmit: Do(C, ["prevent"])
			}, [
				n[10] ||= J("label", { for: "session-project" }, "Add to project", -1),
				V(J("select", {
					id: "session-project",
					"onUpdate:modelValue": n[6] ||= (e) => g.value = e,
					class: "min-w-0 rounded-md bg-[#303030] p-2 text-base"
				}, [n[9] ||= J("option", {
					value: "",
					disabled: ""
				}, "Choose project", -1), (G(!0), K(W, null, U(v.value, (e) => (G(), K("option", {
					key: e.id,
					value: e.id
				}, R(e.label), 9, $g))), 128))], 512), [[bo, g.value]]),
				v.value.length ? X("v-if", !0) : (G(), K("p", e_, "No projects available.")),
				J("button", {
					class: "rounded-lg bg-[#303030] px-3 py-2 disabled:opacity-55",
					disabled: !g.value || e.busy
				}, " Add ", 8, t_),
				J("button", {
					type: "button",
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					onClick: b
				}, " Cancel ")
			], 32)) : (G(), K("div", n_, [
				n[11] ||= J("p", null, "Delete this conversation? This cannot be undone.", -1),
				J("button", {
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					autofocus: "",
					onClick: b
				}, " Cancel "),
				J("button", {
					class: "rounded-lg bg-[#402b2b] px-3 py-2 text-[#fecaca]",
					disabled: e.busy,
					onClick: w
				}, " Delete conversation ", 8, r_)
			]))], 12, Xg)
		], 64));
	}
}), a_ = { class: "app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white" }, o_ = { class: "brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold" }, s_ = ["aria-label"], c_ = { class: "sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, l_ = { class: "drawer-account flex min-w-0 items-center gap-2" }, u_ = ["value"], d_ = ["value"], f_ = ["value"], p_ = ["disabled"], m_ = ["aria-current"], h_ = { class: "main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden" }, g_ = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, __ = ["aria-expanded"], v_ = { class: "min-w-0 flex-1" }, y_ = { class: "header-title truncate text-base font-medium" }, b_ = {
	key: 0,
	class: "header-project-subtitle truncate text-xs text-[#a3a3a3]"
}, x_ = { class: "topbar-profile sr-only" }, S_ = ["aria-expanded"], C_ = {
	class: "truncate px-3 py-2 text-xs text-[#a3a3a3]",
	role: "presentation"
}, w_ = ["disabled"], T_ = /* @__PURE__ */ H({
	__name: "App",
	setup(e) {
		let t = Oc(), { profile: n, session: r, sessions: i, projects: a, selectedProject: o, projectId: s, offline: c, creating: l, profiles: u, loading: d, error: f, hasMore: p, tracking: m, trackingPending: h, sessionBusy: g, drawer: _, embedded: v, menuButton: y, closeButton: b, screenMenuButton: x, screenMenuWrap: S, screenMenu: C, sidebar: w, chatPlane: T, drawerSwipe: E, kanban: D, settingsButton: O, inboxUnread: k, settingsPage: A, projectView: ee, recentSession: j, chooseProfile: te, createSession: M, trackSession: N, newChat: ne, loadSessions: re, manageSession: ie, rename: ae, exitPlugin: P, showSettings: se, openDrawer: ce, closeDrawer: le, closeScreenMenu: ue, screenLink: de } = Lg();
		return (e, I) => (G(), K("div", a_, [
			J("aside", {
				ref: (e) => w.value = e,
				class: F(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white", B(_) ? "translate-x-0" : "-translate-x-full"]),
				style: oe(B(E).sidebarStyle.value),
				onTouchstart: I[15] ||= (...e) => B(E).start && B(E).start(...e),
				onTouchmove: I[16] ||= (...e) => B(E).move && B(E).move(...e),
				onTouchend: I[17] ||= (...e) => B(E).end && B(E).end(...e),
				onTouchcancel: I[18] ||= (...e) => B(E).cancel && B(E).cancel(...e),
				onClickCapture: I[19] ||= (...e) => B(E).click && B(E).click(...e),
				"aria-label": "Navigation"
			}, [
				J("div", o_, [
					I[32] ||= J("span", { class: "min-w-0 truncate" }, "ChatHermes", -1),
					B(v) ? (G(), K("button", {
						key: 0,
						class: "drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Return to Hermes Desktop",
						title: "Return to Hermes Desktop",
						onClick: I[0] ||= (...e) => B(P) && B(P)(...e)
					}, [...I[31] ||= [J("svg", {
						class: "size-5",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M10 5 3 12l7 7M3 12h12a6 6 0 0 0 6-6V3" })], -1)]])) : X("v-if", !0),
					J("button", {
						ref: (e) => b.value = e,
						class: "mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Close navigation",
						onClick: I[1] ||= (...e) => B(le) && B(le)(...e)
					}, " × ", 512)
				]),
				Ki(B(vc), {
					class: "inbox-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).name === "inbox" ? "page" : void 0,
					to: B(de)("inbox"),
					onClick: I[2] ||= (e) => _.value = !1
				}, {
					default: An(() => [
						I[33] ||= J("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [J("path", { d: "M4 4h16v16H4zM4 13h4l2 3h4l2-3h4" })], -1),
						I[34] ||= Y(" Inbox ", -1),
						B(k) ? (G(), K("span", {
							key: 0,
							class: "ml-auto rounded-full bg-[#424242] px-2 text-sm leading-[1.5]",
							"aria-label": `${B(k)} unread notifications`
						}, R(B(k)), 9, s_)) : X("v-if", !0)
					]),
					_: 1
				}, 8, ["aria-current", "to"]),
				Ki(B(vc), {
					class: "projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).meta.section === "projects" ? "page" : void 0,
					to: B(de)("projects"),
					onClick: I[3] ||= (e) => _.value = !1
				}, {
					default: An(() => [...I[35] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1), Y("Projects ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				Ki(B(vc), {
					class: "scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).meta.section === "scheduled" ? "page" : void 0,
					to: B(de)("scheduled"),
					onClick: I[4] ||= (e) => _.value = !1
				}, {
					default: An(() => [...I[36] ||= [J("svg", {
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
				Ki(B(vc), {
					class: "artifacts-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": B(t).name === "artifacts" ? "page" : void 0,
					to: B(de)("artifacts"),
					onClick: I[5] ||= (e) => _.value = !1
				}, {
					default: An(() => [...I[37] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" })], -1), Y("Artifacts ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				B(D).visible.value ? (G(), q(B(vc), {
					key: 0,
					class: "kanban-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-base hover:bg-[#303030]",
					"aria-current": B(t).name === "kanban" ? "page" : void 0,
					to: B(de)("kanban"),
					onClick: I[6] ||= (e) => _.value = !1
				}, {
					default: An(() => [...I[38] ||= [Y("Kanban", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"])) : X("v-if", !0),
				(G(), q(i_, {
					heading: "Recents",
					sessions: B(i),
					tracking: B(m),
					"tracking-pending": B(h),
					onTrack: B(N),
					selected: B(r),
					loading: B(d),
					error: B(f),
					"has-more": B(p),
					busy: B(c) || B(l) || B(g),
					projects: B(a),
					key: B(n),
					onArchive: I[7] ||= (e) => B(ie)("archive", e),
					onDelete: I[8] ||= (e) => B(ie)("delete", e),
					onProject: I[9] ||= (e, t) => B(ie)("project", e, t),
					onSelect: B(j),
					onCreate: B(ne),
					onMore: I[10] ||= (e) => B(re)(!0),
					onRetry: I[11] ||= (e) => B(re)(),
					onRename: B(ae)
				}, null, 8, [
					"sessions",
					"tracking",
					"tracking-pending",
					"onTrack",
					"selected",
					"loading",
					"error",
					"has-more",
					"busy",
					"projects",
					"onSelect",
					"onCreate",
					"onRename"
				])),
				J("div", c_, [
					I[42] ||= J("label", { for: "profile-field" }, "Profile", -1),
					J("div", l_, [
						J("select", {
							id: "profile-field",
							class: "profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white",
							value: B(n),
							onChange: I[12] ||= (e) => B(te)(e.target.value)
						}, [
							I[39] ||= J("option", { value: "" }, "Default profile", -1),
							B(n) && !B(u).some((e) => e.name === B(n)) ? (G(), K("option", {
								key: 0,
								value: B(n)
							}, R(B(n)), 9, d_)) : X("v-if", !0),
							(G(!0), K(W, null, U(B(u), (e) => (G(), K("option", {
								key: e.name,
								value: e.name
							}, R(e.name), 9, f_))), 128))
						], 40, u_),
						J("button", {
							class: "drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55",
							"aria-label": "New chat",
							title: "New chat",
							disabled: B(c) || B(l),
							onClick: I[13] ||= (...e) => B(ne) && B(ne)(...e)
						}, [...I[40] ||= [J("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [J("path", { d: "M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z" })], -1)]], 8, p_),
						J("button", {
							ref: (e) => O.value = e,
							class: "drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]",
							"aria-label": "Settings",
							"aria-current": B(A) ? "page" : void 0,
							onClick: I[14] ||= (e) => B(se)()
						}, [...I[41] ||= [J("svg", {
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
						})], -1)]], 8, m_)
					]),
					J("span", null, [J("span", { class: F(["status-dot mr-2 inline-block size-2 rounded-full", B(c) ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), Y(R(B(c) ? "Offline · read only" : "Connected through dashboard"), 1)])
				])
			], 38),
			B(_) || B(E).dragging.value ? (G(), K("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				style: oe(B(E).scrimStyle.value),
				onTouchstart: I[20] ||= (...e) => B(E).start && B(E).start(...e),
				onTouchmove: I[21] ||= (...e) => B(E).move && B(E).move(...e),
				onTouchend: I[22] ||= (...e) => B(E).end && B(E).end(...e),
				onTouchcancel: I[23] ||= (...e) => B(E).cancel && B(E).cancel(...e),
				onClickCapture: I[24] ||= (...e) => B(E).click && B(E).click(...e),
				onClick: I[25] ||= (...e) => B(le) && B(le)(...e)
			}, null, 36)) : X("v-if", !0),
			J("main", h_, [
				J("header", g_, [
					J("button", {
						ref: (e) => y.value = e,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": B(_),
						onClick: I[26] ||= (...e) => B(ce) && B(ce)(...e)
					}, [...I[43] ||= [J("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [J("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, __),
					J("div", v_, [J("h1", y_, R(B(t).meta.title || B(i).find((e) => e.id === B(r))?.title || (B(r) ? "Conversation" : B(o)?.label || "ChatHermes")), 1), !B(A) && B(s) && B(r) && B(o) ? (G(), K("p", b_, R(B(o).label), 1)) : X("v-if", !0)]),
					J("span", x_, R(B(n) || "Current profile"), 1),
					B(A) ? X("v-if", !0) : (G(), K("div", {
						key: 0,
						ref: (e) => S.value = e,
						class: "screen-menu-wrap relative",
						onKeydown: I[30] ||= ko(Do((e) => B(ue)(), ["stop", "prevent"]), ["esc"])
					}, [J("button", {
						ref: (e) => x.value = e,
						class: "screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]",
						"aria-label": "Screen options",
						"aria-haspopup": "menu",
						"aria-expanded": B(C),
						"aria-controls": "screen-menu",
						onClick: I[27] ||= (e) => C.value = !B(C)
					}, " ··· ", 8, S_), V(J("div", {
						id: "screen-menu",
						class: "screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl",
						role: "menu",
						"aria-label": "Screen options",
						onClick: I[29] ||= (e) => B(ue)()
					}, [
						J("span", C_, R(B(n) || "Current profile"), 1),
						J("button", {
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: B(c) || B(l) || B(ee) && (!B(o) || B(o).archived || !B(o).isNoProject && !B(vl)(B(o))),
							onClick: I[28] ||= (e) => {
								B(ee) ? B(M)() : B(ne)(), B(ue)();
							}
						}, " New chat ", 8, w_),
						Ki(B(Tc), { name: "actions" })
					], 512), [[Fa, B(C)]])], 544))
				]),
				Ki(B(Tc), { name: "dialogs" }),
				Ki(og, {
					ref: (e) => T.value = e,
					onTouchstart: B(E).start,
					onTouchmove: B(E).move,
					onTouchend: B(E).end,
					onTouchcancel: B(E).cancel,
					onClickCapture: B(E).click,
					"show-chat": B(t).meta.chat === !0,
					"hide-composer": B(t).meta.hideComposer === !0
				}, {
					default: An(() => [(G(), q(B(Tc), { key: B(n) }))]),
					_: 1
				}, 8, [
					"onTouchstart",
					"onTouchmove",
					"onTouchend",
					"onTouchcancel",
					"onClickCapture",
					"show-chat",
					"hide-composer"
				]),
				I[44] ||= J("footer", {
					class: "app-footer shrink-0 bg-black",
					"aria-hidden": "true"
				}, null, -1)
			])
		]));
	}
});
//#endregion
//#region src/features/kanban/useBoard.ts
function E_(e, t, n, r) {
	let i = /* @__PURE__ */ z(), a = /* @__PURE__ */ z(), o = /* @__PURE__ */ z(), s = /* @__PURE__ */ z(""), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(!1), u = /* @__PURE__ */ z(document.visibilityState === "visible"), d = () => {
		u.value = document.visibilityState === "visible";
	};
	document.addEventListener("visibilitychange", d), dr(() => document.removeEventListener("visibilitychange", d));
	let f = async () => {};
	return In([
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
					let t = await Nc.board(e, n.value, m.signal);
					if (h) return;
					i.value = t, v ??= typeof t.latest_event_id == "number" ? t.latest_event_id : void 0, !y && !x && !b && w(), c.value = "";
				} catch (e) {
					h || (c.value = e instanceof Ac ? e.message : "Could not load Kanban. Retry when the dashboard is connected.", e instanceof Ac && [
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
					let t = await Pc(e, v);
					if (h) return;
					let n = y = new WebSocket(t);
					n.onopen = () => {
						S = 1e3, C(), O();
					}, n.onmessage = (e) => {
						if (!(h || y !== n)) try {
							let t = JSON.parse(e.data);
							typeof t.cursor == "number" && Number.isSafeInteger(t.cursor) && (v = Math.max(v ?? 0, t.cursor)), Array.isArray(t.events) && t.events.length && (C(), O());
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
		let E = 0, D;
		async function O() {
			let t = s.value, n = ++E;
			if (D?.abort(), !t || h) return;
			let r = D = new AbortController();
			try {
				let [i, c] = await Promise.all([Nc.task(e, t, r.signal), Nc.log(e, t, r.signal)]);
				!h && n === E && s.value === t && (a.value = i, o.value = c);
			} catch (e) {
				!h && n === E && !r.signal.aborted && (c.value = e instanceof Ac ? e.message : "Could not load task details.", e instanceof Ac && e.status === 404 && (a.value = void 0, o.value = void 0, s.value = ""));
			}
		}
		let k = In(s, () => {
			a.value = void 0, o.value = void 0, O();
		});
		f = async () => {
			await Promise.all([C(), O()]);
		};
		let A = setInterval(() => void f(), 8e3);
		C(), O(), p(() => {
			h = !0, m.abort(), D?.abort(), k(), clearInterval(A), clearTimeout(x), y?.close();
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
var D_ = { key: 0 }, O_ = { key: 1 }, k_ = ["value"], A_ = {
	key: 2,
	class: "kanban-inline"
}, j_ = ["value"], M_ = { class: "kanban-toolbar" }, N_ = ["disabled"], P_ = ["disabled"], F_ = /* @__PURE__ */ H({
	__name: "TaskForm",
	props: {
		task: {},
		creationStatus: {},
		assignees: {},
		busy: { type: Boolean }
	},
	emits: ["save", "cancel"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ z(n.task?.title || ""), a = /* @__PURE__ */ z(n.task?.body || ""), o = /* @__PURE__ */ z(n.task?.priority || 0), s = /* @__PURE__ */ z(n.task?.assignee || ""), c = /* @__PURE__ */ z(n.task?.model_override || ""), l = /* @__PURE__ */ z(n.task?.provider_override || ""), u = /* @__PURE__ */ z(n.task?.reasoning_effort || ""), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z("");
		function p() {
			i.value.trim() && (n.creationStatus !== "done" || f.value.trim()) && r("save", {
				title: i.value.trim(),
				body: a.value,
				priority: o.value,
				...n.creationStatus === "done" ? { summary: f.value.trim() } : {},
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
			onSubmit: Do(p, ["prevent"])
		}, [
			J("label", null, [n[10] ||= Y("Title", -1), V(J("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				required: "",
				"aria-label": "Task title"
			}, null, 512), [[_o, i.value]])]),
			J("label", null, [n[11] ||= Y("Description", -1), V(J("textarea", {
				"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
				rows: "4",
				"aria-label": "Task description"
			}, null, 512), [[_o, a.value]])]),
			e.creationStatus === "done" ? (G(), K("label", D_, [n[12] ||= Y("Completion summary", -1), V(J("textarea", {
				"onUpdate:modelValue": n[2] ||= (e) => f.value = e,
				required: "",
				"aria-label": "Task completion summary"
			}, null, 512), [[_o, f.value]])])) : X("v-if", !0),
			J("label", null, [n[13] ||= Y("Priority", -1), V(J("input", {
				"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
				type: "number",
				step: "1",
				"aria-label": "Task priority"
			}, null, 512), [[
				_o,
				o.value,
				void 0,
				{ number: !0 }
			]])]),
			e.task ? X("v-if", !0) : (G(), K("label", O_, [n[15] ||= Y("Assignee", -1), V(J("select", {
				"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
				"aria-label": "Task assignee"
			}, [n[14] ||= J("option", { value: "" }, "Unassigned", -1), (G(!0), K(W, null, U(e.assignees, (e) => (G(), K("option", {
				key: e,
				value: e
			}, R(e), 9, k_))), 128))], 512), [[bo, s.value]])])),
			!e.task && !e.creationStatus ? (G(), K("label", A_, [V(J("input", {
				"onUpdate:modelValue": n[5] ||= (e) => d.value = e,
				type: "checkbox"
			}, null, 512), [[vo, d.value]]), n[16] ||= Y("Start in triage", -1)])) : X("v-if", !0),
			J("details", null, [
				n[21] ||= J("summary", null, "Worker overrides", -1),
				n[22] ||= J("p", { class: "kanban-muted" }, " Blank values inherit the assigned profile. Overrides apply to the next worker run. ", -1),
				J("label", null, [n[17] ||= Y("Model override", -1), V(J("input", {
					"onUpdate:modelValue": n[6] ||= (e) => c.value = e,
					"aria-label": "Task model override"
				}, null, 512), [[_o, c.value]])]),
				J("label", null, [n[18] ||= Y("Provider override", -1), V(J("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					"aria-label": "Task provider override"
				}, null, 512), [[_o, l.value]])]),
				J("label", null, [n[20] ||= Y("Reasoning effort", -1), V(J("select", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					"aria-label": "Task reasoning effort"
				}, [n[19] ||= J("option", { value: "" }, "Inherit profile", -1), (G(), K(W, null, U([
					"none",
					"minimal",
					"low",
					"medium",
					"high",
					"xhigh",
					"max",
					"ultra"
				], (e) => J("option", {
					key: e,
					value: e
				}, R(e), 9, j_)), 64))], 512), [[bo, u.value]])])
			]),
			J("div", M_, [J("button", {
				disabled: e.busy || !i.value.trim(),
				type: "submit"
			}, R(e.task ? "Save task" : "Create task"), 9, N_), J("button", {
				type: "button",
				disabled: e.busy,
				onClick: n[9] ||= (e) => r("cancel")
			}, "Cancel", 8, P_)])
		], 32));
	}
}), I_ = {
	class: "kanban-detail",
	"aria-label": "Task details"
}, L_ = { class: "kanban-toolbar" }, R_ = { class: "kanban-muted" }, z_ = { key: 0 }, B_ = { key: 1 }, V_ = {
	key: 2,
	class: "kanban-muted"
}, H_ = { key: 0 }, U_ = { class: "kanban-prose" }, W_ = ["disabled"], G_ = { class: "kanban-toolbar" }, K_ = ["value", "disabled"], q_ = ["value"], J_ = ["value"], Y_ = ["disabled"], X_ = ["disabled"], Z_ = ["value"], Q_ = ["disabled"], $_ = { key: 5 }, ev = { class: "kanban-prose" }, tv = { class: "kanban-prose" }, nv = { open: "" }, rv = {
	key: 0,
	class: "kanban-muted"
}, iv = ["onClick"], av = { open: "" }, ov = { class: "kanban-muted" }, sv = { class: "kanban-prose" }, cv = ["disabled"], lv = {
	key: 6,
	open: ""
}, uv = ["href"], dv = { class: "kanban-muted" }, fv = [
	"disabled",
	"aria-label",
	"onClick"
], pv = { class: "kanban-upload" }, mv = ["disabled"], hv = {
	key: 0,
	class: "kanban-muted"
}, gv = { class: "kanban-prose" }, _v = {
	key: 0,
	class: "kanban-prose"
}, vv = {
	key: 0,
	class: "kanban-muted"
}, yv = {
	key: 0,
	class: "kanban-muted"
}, bv = ["disabled"], xv = /* @__PURE__ */ H({
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
		In(() => n.detail.task.assignee, (e) => {
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
		return (t, n) => (G(), K("section", I_, [
			J("div", L_, [J("h2", {
				ref_key: "heading",
				ref: i,
				tabindex: "-1",
				class: "min-w-0 flex-1 break-words text-xl"
			}, R(e.detail.task.title), 513), J("button", {
				"aria-label": "Close task details",
				onClick: n[0] ||= (e) => r("close")
			}, "Close")]),
			J("p", R_, R(e.detail.task.id) + " · " + R(e.detail.task.status) + " · Priority " + R(e.detail.task.priority ?? 0), 1),
			e.detail.task.progress ? (G(), K("p", z_, R(e.detail.task.progress.done) + "/" + R(e.detail.task.progress.total) + " subtasks complete ", 1)) : X("v-if", !0),
			e.detail.task.block_kind ? (G(), K("p", B_, "Block reason: " + R(e.detail.task.block_kind), 1)) : X("v-if", !0),
			e.detail.task.worker_pid ? (G(), K("p", V_, [Y(" Worker " + R(e.detail.task.worker_pid), 1), e.detail.task.last_heartbeat_at ? (G(), K("span", H_, " · Heartbeat " + R(m(e.detail.task.last_heartbeat_at)), 1)) : X("v-if", !0)])) : X("v-if", !0),
			a.value ? (G(), q(F_, {
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
			])) : (G(), K(W, { key: 4 }, [J("p", U_, R(e.detail.task.body || "No description."), 1), J("button", {
				disabled: e.busy,
				onClick: n[2] ||= (e) => a.value = !0
			}, "Edit task", 8, W_)], 64)),
			J("div", G_, [
				J("label", null, [n[11] ||= Y("Move task", -1), J("select", {
					"aria-label": "Move task",
					value: e.detail.task.status,
					disabled: e.busy || !e.workflow,
					onChange: n[3] ||= (e) => u("", "PATCH", { status: e.target.value })
				}, [J("option", { value: e.detail.task.status }, R(e.detail.task.status), 9, q_), (G(!0), K(W, null, U(e.workflow?.columns.filter((t) => t.drag_target && e.workflow?.manual[e.detail.task.status]?.includes(t.key)), (e) => (G(), K("option", {
					key: e.key,
					value: e.key
				}, R(e.label), 9, J_))), 128))], 40, K_)]),
				e.detail.task.status === "archived" ? X("v-if", !0) : (G(), K("button", {
					key: 0,
					disabled: e.busy,
					onClick: n[4] ||= (e) => u("", "PATCH", { status: "archived" })
				}, " Archive task ", 8, Y_)),
				e.detail.task.status === "running" ? (G(), K("button", {
					key: 1,
					disabled: e.busy,
					onClick: n[5] ||= (e) => u("/reclaim", "POST", {})
				}, " Reclaim worker ", 8, X_)) : X("v-if", !0)
			]),
			J("form", {
				class: "kanban-toolbar",
				onSubmit: n[7] ||= Do((e) => u("/reassign", "POST", {
					profile: s.value,
					reclaim_first: !0
				}), ["prevent"])
			}, [
				J("label", null, [n[13] ||= Y("Assignee", -1), V(J("select", {
					"onUpdate:modelValue": n[6] ||= (e) => s.value = e,
					"aria-label": "Reassign task"
				}, [n[12] ||= J("option", { value: "" }, "Unassigned", -1), (G(!0), K(W, null, U(Array.from(new Set([...e.assignees, e.detail.task.assignee || ""].filter(Boolean))), (e) => (G(), K("option", {
					key: e,
					value: e
				}, R(e), 9, Z_))), 128))], 512), [[bo, s.value]])]),
				J("button", { disabled: e.busy }, "Reassign task", 8, Q_),
				n[14] ||= J("p", { class: "kanban-muted" }, "Reassigning releases any active worker claim.", -1)
			], 32),
			e.detail.task.latest_summary || e.detail.task.result ? (G(), K("details", $_, [
				n[15] ||= J("summary", null, "Result and latest summary", -1),
				J("p", ev, R(e.detail.task.latest_summary), 1),
				J("p", tv, R(e.detail.task.result), 1)
			])) : X("v-if", !0),
			J("details", nv, [n[16] ||= J("summary", null, "Dependencies and linked tasks", -1), (G(), K(W, null, U(["parents", "children"], (t) => J("div", { key: t }, [
				J("h3", null, R(t === "parents" ? "Depends on" : "Children"), 1),
				e.detail.links[t].length ? X("v-if", !0) : (G(), K("p", rv, "None")),
				(G(!0), K(W, null, U(e.detail.links[t], (t) => (G(), K("button", {
					key: t,
					class: "kanban-link",
					onClick: (e) => r("select", t)
				}, R(e.detail.link_tasks?.find((e) => e.id === t)?.title || t) + " · " + R(e.detail.link_tasks?.find((e) => e.id === t)?.status), 9, iv))), 128))
			])), 64))]),
			J("details", av, [
				J("summary", null, "Comments (" + R(e.detail.comments.length) + ")", 1),
				(G(!0), K(W, null, U(e.detail.comments, (e) => (G(), K("article", {
					key: e.id,
					class: "kanban-comment"
				}, [J("p", ov, R(e.author) + " · " + R(m(e.created_at)), 1), J("p", sv, R(e.body), 1)]))), 128)),
				J("form", {
					class: "kanban-form",
					onSubmit: Do(f, ["prevent"])
				}, [J("label", null, [n[17] ||= Y("Comment", -1), V(J("textarea", {
					"onUpdate:modelValue": n[8] ||= (e) => o.value = e,
					"aria-label": "New task comment",
					required: "",
					rows: "3"
				}, null, 512), [[_o, o.value]])]), J("button", { disabled: e.busy || !o.value.trim() }, "Add comment", 8, cv)], 32)
			]),
			e.detail.attachments == null ? X("v-if", !0) : (G(), K("details", lv, [
				J("summary", null, "Attachments (" + R(e.detail.attachments.length) + ")", 1),
				(G(!0), K(W, null, U(e.detail.attachments, (t) => (G(), K("div", {
					key: t.id,
					class: "kanban-toolbar"
				}, [
					J("a", {
						class: "kanban-link",
						href: B(jc)("/attachments/" + encodeURIComponent(t.id), e.board),
						target: "_blank",
						rel: "noopener"
					}, R(t.filename), 9, uv),
					J("span", dv, R(t.size ?? 0) + " bytes", 1),
					J("button", {
						disabled: e.busy,
						"aria-label": "Remove attachment " + t.filename,
						onClick: (e) => r("operation", "/attachments/" + encodeURIComponent(t.id), "DELETE", void 0, !1)
					}, " Remove ", 8, fv)
				]))), 128)),
				J("label", pv, [n[18] ||= Y("Attach file", -1), J("input", {
					type: "file",
					"aria-label": "Task attachment",
					disabled: e.busy,
					onChange: p
				}, null, 40, mv)])
			])),
			J("details", null, [
				J("summary", null, "Run history (" + R(e.detail.runs.length) + ")", 1),
				e.detail.runs.length ? X("v-if", !0) : (G(), K("p", hv, "No runs yet.")),
				(G(!0), K(W, null, U(e.detail.runs, (e) => (G(), K("article", {
					key: e.id,
					class: "kanban-comment"
				}, [
					J("h3", null, "Run " + R(e.id) + " · " + R(e.profile) + " · " + R(e.outcome || e.status), 1),
					J("p", gv, R(e.summary), 1),
					e.error ? (G(), K("p", _v, R(e.error), 1)) : X("v-if", !0)
				]))), 128))
			]),
			J("details", null, [n[19] ||= J("summary", null, "Worker log", -1), e.log?.exists ? (G(), K(W, { key: 1 }, [e.log.truncated ? (G(), K("p", yv, "Showing the last 16 KiB.")) : X("v-if", !0), J("pre", null, R(e.log.content), 1)], 64)) : (G(), K("p", vv, "No worker log yet."))]),
			J("details", null, [J("summary", null, "Activity (" + R(e.detail.events.length) + ")", 1), (G(!0), K(W, null, U(e.detail.events, (e) => (G(), K("p", {
				key: e.id,
				class: "kanban-muted"
			}, R(e.kind) + " · " + R(m(e.created_at)), 1))), 128))]),
			J("details", null, [
				n[20] ||= J("summary", null, "Delete task", -1),
				n[21] ||= J("p", null, "Delete this task permanently?", -1),
				c.value ? (G(), K("button", {
					key: 1,
					disabled: e.busy,
					onClick: n[10] ||= (e) => u("", "DELETE", void 0)
				}, " Confirm delete task ", 8, bv)) : (G(), K("button", {
					key: 0,
					onClick: n[9] ||= (e) => c.value = !0
				}, "Delete task…"))
			])
		]));
	}
}), Sv = {
	key: 0,
	class: "kanban-empty"
}, Cv = ["disabled"], wv = { class: "kanban-toolbar" }, Tv = ["value"], Ev = {
	key: 0,
	role: "alert",
	class: "kanban-error"
}, Dv = {
	key: 1,
	role: "status",
	class: "kanban-muted"
}, Ov = {
	key: 2,
	class: "kanban-muted"
}, kv = { key: 0 }, Av = { class: "kanban-toolbar" }, jv = ["disabled"], Mv = ["disabled"], Nv = ["disabled"], Pv = ["disabled"], Fv = {
	key: 4,
	role: "status"
}, Iv = {
	key: 5,
	class: "kanban-empty"
}, Lv = {
	class: "kanban-columns",
	"aria-label": "Board columns"
}, Rv = ["aria-label", "onDrop"], zv = { class: "kanban-muted" }, Bv = [
	"data-status",
	"disabled",
	"title",
	"aria-expanded",
	"onClick"
], Vv = {
	key: 1,
	class: "kanban-muted"
}, Hv = [
	"data-task-id",
	"draggable",
	"onDragstart",
	"onClick"
], Uv = { class: "kanban-muted" }, Wv = { key: 0 }, Gv = { key: 1 }, Kv = { key: 2 }, qv = {
	key: 3,
	class: "kanban-card-summary"
}, Jv = {
	key: 1,
	class: "kanban-detail",
	"aria-label": "Task details"
}, Yv = /* @__PURE__ */ H({
	__name: "KanbanPage",
	setup(e) {
		let t = Bc(), n = /* @__PURE__ */ z();
		async function r() {
			let e = C.value;
			C.value = "", await vn(), Array.from(n.value?.querySelectorAll(".kanban-card") || []).find((t) => t.dataset.taskId === e)?.focus();
		}
		let i = /* @__PURE__ */ z([]), a = /* @__PURE__ */ z(""), o = /* @__PURE__ */ z(!1), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z(""), p = /* @__PURE__ */ z(""), m = /* @__PURE__ */ z(""), h = /* @__PURE__ */ z(""), g = /* @__PURE__ */ z(""), _ = /* @__PURE__ */ z(""), v = /* @__PURE__ */ z(!1), y = E_(a, t.visible, o, () => {
			t.check();
		}), { snapshot: b, detail: x, log: S, taskId: C, error: w, loading: T } = y, E = Z(() => i.value.find((e) => e.slug === a.value)), D = !1, O = 0;
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
		let A;
		async function ee() {
			A?.abort();
			let e = A = new AbortController(), n = O;
			try {
				let r = await Nc.boards(e.signal);
				if (D || n !== O || !t.visible.value) return;
				if (i.value = r.boards, !r.boards.some((e) => e.slug === a.value)) {
					let e = k();
					a.value = r.boards.find((t) => t.slug === e)?.slug || r.boards.find((e) => e.slug === r.current)?.slug || r.boards[0]?.slug || "";
				}
				c.value = "";
			} catch (r) {
				!D && !e.signal.aborted && n === O && (c.value = r instanceof Ac ? r.message : "Could not load boards.", r instanceof Ac && [
					401,
					403,
					404,
					503
				].includes(r.status) && t.unavailable());
			}
		}
		In(t.visible, (e, t, n) => {
			if (O++, !e) {
				i.value = [], a.value = "", s.value = void 0, f.value = "", p.value = "", d.value = !1;
				return;
			}
			let r = new AbortController();
			ee(), Nc.workflow(r.signal).then((e) => {
				r.signal.aborted || (s.value = e);
			}).catch(() => {});
			let o = setInterval(() => {
				document.visibilityState === "visible" && ee();
			}, 8e3);
			n(() => {
				r.abort(), A?.abort(), clearInterval(o);
			});
		}, { immediate: !0 }), In(a, (e) => {
			O++, d.value = !1, f.value = "", p.value = "", l.value = "", u.value = "", v.value = !1;
			try {
				localStorage.setItem("chathermes.kanban-board", e);
			} catch {}
		}), In([
			d,
			a,
			o,
			t.visible
		], () => {
			t.screenActions.value = t.visible.value ? [
				{
					label: "Refresh",
					disabled: d.value,
					run: () => {
						N();
					}
				},
				{
					label: "New board",
					disabled: d.value,
					run: () => {
						P("create");
					}
				},
				{
					label: "Board settings",
					disabled: d.value || !a.value,
					run: () => {
						P("edit");
					}
				},
				{
					label: "Show archived tasks",
					checked: o.value,
					run: () => {
						o.value = !o.value;
					}
				}
			] : [];
		}, { immediate: !0 });
		function j(e) {
			return e === "archived" || !!s.value?.columns.find((t) => t.key === e)?.drag_target;
		}
		async function te(e) {
			f.value = e, await vn(), n.value?.querySelector(".kanban-column input[aria-label=\"Task title\"]")?.focus();
		}
		async function M() {
			let e = f.value;
			f.value = "", await vn(), Array.from(n.value?.querySelectorAll(".kanban-new-task") || []).find((t) => t.dataset.status === e)?.focus();
		}
		async function N() {
			await Promise.all([ee(), y.refresh()]);
		}
		async function ne(e, n, r = !1) {
			if (d.value || !t.visible.value) return;
			let i = O, o = a.value;
			d.value = !0, l.value = "", u.value = "";
			try {
				let t = await e();
				if (r && o && Nc.write("/dispatch", "POST", {}, o).catch(() => {}), D || i !== O) return;
				if (t && typeof t == "object" && "ok" in t && t.ok === !1) {
					l.value = "Hermes could not complete this action. Check the task state in Hermes.";
					return;
				}
				t && typeof t == "object" && "warning" in t && t.warning && (u.value = "Hermes saved the task with a dispatcher warning. Check the Hermes dispatcher if it does not start."), n?.(), await N();
			} catch (e) {
				!D && i === O && (l.value = e instanceof Ac ? e.message : "Kanban operation failed. Refresh to inspect the outcome before retrying.", await y.refresh());
			} finally {
				!D && i === O && (d.value = !1);
			}
		}
		function re(e, t, n, r = !0, i) {
			let o = a.value;
			ne(() => Nc.write(e, t, n, o), () => {
				i?.(), t === "DELETE" && e === "/tasks/" + encodeURIComponent(C.value) && (C.value = "");
			}, r);
		}
		async function ie(e) {
			let t = a.value, n = f.value, r = O, { summary: i, ...o } = e, s = !1;
			await ne(async () => {
				let e = await Nc.write("/tasks", "POST", {
					...o,
					triage: n === "triage"
				}, t);
				if (s = !0, e.task.status !== n && (await Nc.write("/tasks/" + encodeURIComponent(e.task.id), "PATCH", {
					status: n,
					...n === "done" ? { summary: i } : {}
				}, t)).ok === !1) throw Error("Task created but its lane transition was refused.");
				return e;
			}, void 0, !0), s && !D && r === O && await M();
		}
		function ae(e) {
			let t = a.value, n = C.value;
			ne(() => Nc.upload(t, n, e));
		}
		function P(e) {
			p.value = e, m.value = e === "edit" ? a.value : "", h.value = e === "edit" && E.value?.name || "", g.value = e === "edit" && E.value?.description || "", _.value = e === "edit" && E.value?.default_workdir || "";
		}
		function oe() {
			let e = p.value === "edit", t = {
				name: h.value,
				description: g.value,
				default_workdir: _.value,
				...e ? {} : {
					slug: m.value.trim(),
					switch: !1
				}
			};
			ne(() => Nc.write("/boards" + (e ? "/" + encodeURIComponent(a.value) : ""), e ? "PATCH" : "POST", t), () => {
				p.value = "";
			});
		}
		function se() {
			let e = a.value;
			ne(() => Nc.write("/boards/" + encodeURIComponent(e), "DELETE", void 0), () => {
				v.value = !1;
			});
		}
		function ce(e, t) {
			let n = b.value?.columns.flatMap((e) => e.tasks).find((t) => t.id === e);
			n && s.value?.columns.some((e) => e.key === t && e.drag_target) && s.value.manual[n.status]?.includes(t) && re("/tasks/" + encodeURIComponent(e), "PATCH", { status: t });
		}
		function le(e, t) {
			e.dataTransfer?.setData("application/x-chathermes-task", JSON.stringify({
				board: a.value,
				id: t
			}));
		}
		function ue(e, t) {
			try {
				let n = JSON.parse(e.dataTransfer?.getData("application/x-chathermes-task") || "");
				n.board === a.value && ce(n.id, t);
			} catch {}
		}
		return (e, o) => (G(), K("section", {
			ref_key: "page",
			ref: n,
			class: "kanban-page page-content",
			"aria-label": "Kanban viewer"
		}, [B(t).visible.value ? (G(), K(W, { key: 1 }, [
			J("div", wv, [J("label", null, [o[11] ||= Y("Board", -1), V(J("select", {
				"onUpdate:modelValue": o[1] ||= (e) => a.value = e,
				"aria-label": "Kanban board"
			}, [(G(!0), K(W, null, U(i.value, (e) => (G(), K("option", {
				key: e.slug,
				value: e.slug
			}, R(e.name || e.slug), 9, Tv))), 128))], 512), [[bo, a.value]])])]),
			c.value || l.value || B(w) ? (G(), K("p", Ev, R(l.value || c.value || B(w)), 1)) : X("v-if", !0),
			u.value ? (G(), K("p", Dv, R(u.value), 1)) : X("v-if", !0),
			s.value ? X("v-if", !0) : (G(), K("p", Ov, " Manual movement is unavailable until the Hermes workflow API responds. ")),
			p.value ? (G(), K("form", {
				key: 3,
				class: "kanban-form kanban-board-editor",
				"aria-label": "Board settings",
				onSubmit: Do(oe, ["prevent"])
			}, [
				p.value === "create" ? (G(), K("label", kv, [o[12] ||= Y("Board slug", -1), V(J("input", {
					"onUpdate:modelValue": o[2] ||= (e) => m.value = e,
					required: "",
					"aria-label": "Board slug"
				}, null, 512), [[_o, m.value]])])) : X("v-if", !0),
				J("label", null, [o[13] ||= Y("Board name", -1), V(J("input", {
					"onUpdate:modelValue": o[3] ||= (e) => h.value = e,
					"aria-label": "Board name"
				}, null, 512), [[_o, h.value]])]),
				J("label", null, [o[14] ||= Y("Description", -1), V(J("textarea", {
					"onUpdate:modelValue": o[4] ||= (e) => g.value = e,
					"aria-label": "Board description"
				}, null, 512), [[_o, g.value]])]),
				J("label", null, [o[15] ||= Y("Default directory on Hermes", -1), V(J("input", {
					"onUpdate:modelValue": o[5] ||= (e) => _.value = e,
					"aria-label": "Board default directory"
				}, null, 512), [[_o, _.value]])]),
				J("div", Av, [
					J("button", { disabled: d.value }, "Save board", 8, jv),
					J("button", {
						type: "button",
						disabled: d.value,
						onClick: o[6] ||= (e) => p.value = ""
					}, "Cancel", 8, Mv),
					p.value === "edit" && a.value !== "default" && !v.value ? (G(), K("button", {
						key: 0,
						type: "button",
						disabled: d.value,
						onClick: o[7] ||= (e) => v.value = !0
					}, " Archive board…", 8, Nv)) : X("v-if", !0),
					v.value ? (G(), K("button", {
						key: 1,
						type: "button",
						disabled: d.value,
						onClick: se
					}, " Confirm archive board ", 8, Pv)) : X("v-if", !0)
				])
			], 32)) : X("v-if", !0),
			B(T) ? (G(), K("p", Fv, "Loading board…")) : !i.value.length && !c.value ? (G(), K("p", Iv, " No boards available. Create a board to get started. ")) : X("v-if", !0),
			J("div", { class: F(["kanban-workspace", { "has-detail": B(C) }]) }, [J("div", Lv, [(G(!0), K(W, null, U(B(b)?.columns, (e) => (G(), K("section", {
				key: e.name,
				class: F(["kanban-column", { "kanban-column-empty": !e.tasks.length }]),
				"aria-label": e.name + " tasks",
				onDragover: o[8] ||= Do(() => {}, ["prevent"]),
				onDrop: Do((t) => ue(t, e.name), ["prevent"])
			}, [
				J("h2", null, [Y(R(s.value?.columns.find((t) => t.key === e.name)?.label || e.name) + " ", 1), J("span", zv, R(e.tasks.length), 1)]),
				J("button", {
					class: "kanban-new-task",
					"data-status": e.name,
					disabled: d.value || !a.value || !j(e.name),
					title: j(e.name) ? void 0 : "Hermes controls entry into this lane.",
					"aria-expanded": f.value === e.name,
					onClick: (t) => te(e.name)
				}, " New task ", 8, Bv),
				f.value === e.name ? (G(), q(F_, {
					key: a.value + ":" + e.name,
					assignees: B(b)?.assignees || [],
					busy: d.value,
					"creation-status": e.name,
					onSave: ie,
					onCancel: M
				}, null, 8, [
					"assignees",
					"busy",
					"creation-status"
				])) : X("v-if", !0),
				e.tasks.length ? X("v-if", !0) : (G(), K("p", Vv, "No tasks")),
				(G(!0), K(W, null, U(e.tasks, (e) => (G(), K("button", {
					key: e.id,
					class: F(["kanban-card", { selected: B(C) === e.id }]),
					"data-task-id": e.id,
					draggable: !d.value,
					onDragstart: (t) => le(t, e.id),
					onClick: (t) => C.value = e.id
				}, [
					J("strong", null, R(e.title), 1),
					J("span", Uv, R(e.status) + " · " + R(e.assignee || "Unassigned") + " · Priority " + R(e.priority ?? 0), 1),
					e.progress ? (G(), K("span", Wv, R(e.progress.done) + "/" + R(e.progress.total) + " subtasks", 1)) : X("v-if", !0),
					e.comment_count ? (G(), K("span", Gv, R(e.comment_count) + " comments", 1)) : X("v-if", !0),
					e.warnings?.count ? (G(), K("span", Kv, R(e.warnings.count) + " warnings", 1)) : X("v-if", !0),
					e.latest_summary ? (G(), K("span", qv, R(e.latest_summary), 1)) : X("v-if", !0)
				], 42, Hv))), 128))
			], 42, Rv))), 128))]), B(x) ? (G(), q(xv, {
				key: a.value + ":" + B(x).task.id,
				board: a.value,
				detail: B(x),
				log: B(S),
				workflow: s.value,
				assignees: B(b)?.assignees || [],
				busy: d.value,
				onClose: r,
				onSelect: o[9] ||= (e) => C.value = e,
				onOperation: re,
				onUpload: ae
			}, null, 8, [
				"board",
				"detail",
				"log",
				"workflow",
				"assignees",
				"busy"
			])) : B(C) ? (G(), K("section", Jv, [J("button", { onClick: o[10] ||= (e) => C.value = "" }, "Close task details"), J("p", null, R(B(w) ? "Task details are unavailable. Refresh or select another task." : "Loading task…"), 1)])) : X("v-if", !0)], 2)
		], 64)) : (G(), K("div", Sv, [J("p", null, R(B(t).enabled.value ? "Hermes Kanban is unavailable. Your chats remain available." : "Enable Kanban Viewer in global Settings to view boards."), 1), J("button", {
			disabled: B(t).checking.value,
			onClick: o[0] ||= (e) => B(t).check()
		}, " Recheck availability ", 8, Cv)]))], 512));
	}
}), Xv = [
	"role",
	"aria-checked",
	"disabled",
	"onClick"
], Zv = /* @__PURE__ */ H({
	__name: "KanbanActions",
	setup(e) {
		let t = Bc();
		return (e, n) => B(t).visible.value ? (G(!0), K(W, { key: 0 }, U(B(t).screenActions.value, (e) => (G(), K("button", {
			key: e.label,
			role: e.checked === void 0 ? "menuitem" : "menuitemcheckbox",
			"aria-checked": e.checked,
			disabled: e.disabled,
			onClick: (t) => e.run()
		}, R(e.label), 9, Xv))), 128)) : X("v-if", !0);
	}
}), Qv = /* @__PURE__ */ H({
	__name: "InboxActions",
	setup(e) {
		let { refreshInbox: t, inboxRevision: n } = vg();
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
}), $v = { id: "project-confirmation-text" }, ey = {
	key: 0,
	role: "alert",
	class: "project-error"
}, ty = { class: "project-actions" }, ny = ["disabled"], ry = ["disabled"], iy = /* @__PURE__ */ H({
	__name: "ProjectConfirmation",
	setup(e) {
		let { projectConfirmation: t, selectedProject: n, projectBusy: r, offline: i, manageError: a, manageProject: o, projectId: s } = Dg(), c = /* @__PURE__ */ z();
		In(t, async () => {
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
			onKeydown: o[0] ||= ko(Do((e) => !B(r) && l(), ["stop", "prevent"]), ["esc"])
		}, [
			J("p", $v, R(B(t) === "delete" ? `Delete ${B(n).label}? This permanently removes the project and its folder associations. Files and chats will be kept.` : `Archive ${B(n).label}? You can restore it from Archived projects.`), 1),
			B(a) ? (G(), K("p", ey, R(B(a)), 1)) : X("v-if", !0),
			J("div", ty, [J("button", {
				ref_key: "projectConfirmCancel",
				ref: c,
				class: "project-button",
				disabled: B(r),
				onClick: l
			}, " Cancel", 8, ny), J("button", {
				class: "project-button project-danger",
				disabled: B(r) || B(i),
				onClick: u
			}, R(B(t) === "delete" ? "Delete project permanently" : "Confirm archive"), 9, ry)])
		], 32)) : X("v-if", !0);
	}
}), ay = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fff}.st1{fill:%23bababa}%3c/style%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st1'%20d='M0%2094V2C0%20.9.9%200%202%200h48c.6%200%201.1.2%201.5.7l20%2022.3c.3.4.5.8.5%201.3V94c0%201.1-.9%202-2%202H2c-1.1%200-2-.9-2-2zm68-68.9L49.1%204H4v88h64V25.1z'/%3e%3cpath%20class='st1'%20d='M48%2026V4c0-1.1.9-2%202-2s2%20.9%202%202v20h16c1.1%200%202%20.9%202%202s-.9%202-2%202H50c-1.1%200-2-.9-2-2z'/%3e%3c/svg%3e", oy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2372a536}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2s1.2%204.4%203.2%204.4c1%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm10.7%200c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201L36%2010.1c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.5-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%2372a536'%20stroke='%2372a536'%20stroke-miterlimit='10'/%3e%3c/svg%3e", sy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm8.7-10.3H32l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3L36%206.4h3.5l-3.9%2014.3h-3.3L28.4%206.4z'%20fill='%23fff'/%3e%3cpath%20d='M14%2054h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58'%20fill='none'%20stroke='%231f7244'%20stroke-width='3'%20stroke-miterlimit='10'/%3e%3c/svg%3e", cy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2H6.6V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zM24.1%206.1c3.8%200%205.9%203.1%205.9%207.3%200%204.2-2.1%207.5-5.9%207.5s-5.8-3.2-5.8-7.5c0-4.1%202.1-7.3%205.8-7.3zm0%2011.7c1.7%200%202.5-1.8%202.5-4.3s-.8-4.2-2.5-4.2-2.5%201.7-2.5%204.2.8%204.3%202.5%204.3zM38%206.1c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", ly = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.4-34.6h3.3c2.9%200%204.7%202.6%204.7%207.1s-1.8%207.2-4.7%207.2H6.4V6.4zm3.3%2011.4c1.3%200%202.1-1.5%202.1-4.3S11%209.3%209.7%209.3H9v8.5h.7zM20%206.1c3%200%204.7%203.1%204.7%207.3%200%204.2-1.7%207.5-4.7%207.5s-4.7-3.2-4.7-7.5c0-4.1%201.7-7.3%204.7-7.3zm0%2011.7c1.4%200%202-1.8%202-4.3s-.6-4.2-2-4.2-2%201.7-2%204.2.6%204.3%202%204.3zM30.7%206.1c1%200%202.1.4%202.9%201.2l-1.1%202.8c-.3-.5-1-.9-1.7-.9-1.7%200-2.6%201.9-2.6%204.2%200%202.3.9%204.4%202.5%204.4.8%200%201.3-.5%201.8-1l1.1%202.8c-.7.7-1.6%201.3-3.2%201.3-3.2%200-5-3.1-5-7.4.1-4.2%202-7.4%205.3-7.4zm5.9%207.5l-2.8-7.2h2.9l.9%202.9c.3.9.4%201.8.4%201.8s.2-.9.5-1.8l.9-2.9h2.9l-2.8%207.2%202.7%207.1h-2.8l-.9-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.4%201.7l-.9%203h-2.8l2.7-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", uy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.4-34.9c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.1-4.5%202.6-7.6%206.5-7.6zm7.2%2012.4l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1h4.3v2.9h-8.9v-2.2z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", dy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23d75b26}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h2.8v5.8H12V6.4h2.8v14.3H12V15H9.2v5.7H6.5V6.4zm12%202.9h-2.7V6.4h8.1v2.9h-2.7v11.4h-2.8V9.3zm6.9-2.9h3.1l1.1%206c.2.9.4%202.4.4%202.4s.2-1.5.4-2.4l1.1-6h3.1l.8%2014.3h-2.6l-.3-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.7%204.1h-2.7l-.7-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.3%206.4h-2.6l.9-14.3zm11.5%200h2.8v11.4h3.7v2.9H37V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2075c-.5%200-1.1-.2-1.5-.6L13.6%2066c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-7%206.9%206.9%206.9c.8.8.8%202.1%200%203-.4.4-.9.6-1.4.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2074.3c-.4.5-.9.7-1.5.7zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3%201.1.4%201.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23d75b26'%20stroke='%23d75b26'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", fy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23307ac6}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm-.3-25.7H9v1.1c0%201.5.4%201.6.7%201.6.5%200%20.7-.3.7-1.6v-7H7.7v-3h6v9.9c0%203.3-2%204.6-4%204.6-2.1%200-4-1.4-4-4.6v-1zM18%2016.7c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%23307ac6'%20stroke='%23307ac6'%20stroke-miterlimit='10'/%3e%3c/svg%3e", py = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}.st1{fill:%23fff}.st2{fill:%23999;stroke:%23999;stroke-width:.5;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st1'%20d='M6%2041h60v49H6V41z'/%3e%3cpath%20class='st2'%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4.4-.2.8-.6%201.2-1%20.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2-.6-.6-1-1.2-1.2-2-.2-.8-.3-2.1-.3-4%200-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202c.2.8.4%202.1.4%204%200%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'/%3e%3cpath%20class='st1'%20d='M5.8%2015.7H8v.9c0%201.9.6%202.1%201.1%202.1.6%200%201.1-.4%201.1-2.1V8.7H7.8V6.5h4.6v10c0%203.2-1.6%204.4-3.3%204.4s-3.3-1.2-3.3-4.4v-.8zm9%201.8c.6.7%201.4%201.2%202.2%201.2%201%200%201.6-.7%201.6-1.8%200-2.6-4.5-2.5-4.5-6.6%200-2.3%201.4-4%203.8-4%201%200%202%20.3%202.8.9L20%209.4c-.5-.4-1.3-.8-2-.8-1.1%200-1.6.8-1.6%201.7%200%202.6%204.5%202.4%204.5%206.5%200%202.2-1.3%204.1-3.7%204.1-1.2%200-2.4-.5-3.3-1.4l.9-2zM27.1%206.2c3.2%200%205.1%203%205.1%207.3s-2%207.4-5.1%207.4c-3.2%200-5.1-3.1-5.1-7.4%200-4.2%202-7.3%205.1-7.3zm0%2012.4c1.8%200%202.9-2%202.9-5.1%200-3-1.1-4.9-2.9-4.9s-2.9%201.9-2.9%204.9c0%203.1%201.1%205.1%202.9%205.1zM34%206.5h2.3l3.3%208c.3.9.6%202.2.6%202.2h.1s-.1-1.3-.1-2.2v-8h2.1v14.2H40l-3.3-8.1c-.3-.9-.6-2.2-.6-2.2H36s.1%201.3.1%202.2v8H34V6.5z'/%3e%3cpath%20class='st2'%20d='M44.1%2067.1c-.7-.3-1.2-.9-1.2-1.6s.5-1.4%201.2-1.6c.3-.1.4-.3.3-.5-.3-.8-.5-1.6-1-2.2-.1-.3-.4-.3-.6-.2s-.5.3-.8.3c-1%200-1.7-.8-1.7-1.7%200-.3.1-.6.3-.8.1-.3%200-.4-.2-.6-.7-.4-1.5-.7-2.2-1-.3-.1-.4.1-.5.3-.3.7-.9%201.2-1.6%201.2s-1.4-.5-1.6-1.2c-.1-.3-.3-.4-.5-.3-.8.3-1.6.5-2.2%201-.3.1-.3.4-.2.6.2.3.3.5.3.8%200%201-.8%201.7-1.7%201.7-.3%200-.6-.1-.8-.3-.3-.1-.4%200-.6.2-.4.7-.7%201.5-1%202.2-.1.3.1.4.3.5.7.3%201.2.9%201.2%201.6s-.5%201.4-1.2%201.6c-.3.1-.4.3-.3.5.3.8.5%201.6%201%202.2.1.3.4.3.6.2.3-.2.5-.3.8-.3%201%200%201.7.8%201.7%201.7%200%20.3-.1.6-.3.8-.1.3%200%20.4.2.6.7.4%201.5.7%202.2%201%20.2%200%20.4-.1.4-.3.3-.7.9-1.2%201.6-1.2s1.4.5%201.6%201.2c.1.3.3.4.5.3.8-.3%201.6-.5%202.2-1%20.3-.1.3-.4.2-.6-.1-.3-.3-.5-.3-.8%200-1%20.8-1.7%201.7-1.7.3%200%20.6.1.8.3.3.1.4%200%20.6-.2.4-.7.7-1.5%201-2.2.2-.1.1-.4-.2-.5zm-8.3%201c-1.5%200-2.7-1.2-2.7-2.7%200-1.5%201.2-2.7%202.7-2.7s2.7%201.2%202.7%202.7c.1%201.5-1.2%202.7-2.7%202.7z'/%3e%3c/svg%3e", my = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm14.6%200h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2H25v8.5h.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13.5%2076.4V54.6h6.4l6.4%208%206.4-8h6.4v21.8h-6.4V63.9l-6.4%208-6.4-8v12.5h-6.4zm38.4%200l-9.6-10.6h6.4V54.6h6.4v11.2h6.4l-9.6%2010.6z'/%3e%3c/svg%3e", hy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm8.7%203.6c.4.4%201.1.7%201.7.7.9%200%201.6-.4%201.6-1.6%200-1-.7-1.5-2.3-1.5h-.9l-.7-1.8%202-2.5c.5-.6.9-1%20.9-1s-.4.1-1.1.1h-2.3v-3h7.2V9l-2.6%203.1c2%20.5%203.1%202.1%203.1%204.1%200%202.4-1.4%204.8-4.7%204.8-1.3%200-2.5-.4-3.5-1.3l1.6-2.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", gy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23f60}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm6.8%201.8l3.7-8.8h4.2v8.1H42v3h-1.2v3.2h-3.2v-3.2h-4.7v-2.3zm4.7-.7v-3.4c0-.8.1-1.3.1-1.3s-.1.6-.3%201.2L36%2014.5h1.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13%2083.1h46V47.9H13v35.2zm8.9-2.7h-5.5v-3.9h5.5v3.9zm16.9%200h-5.5v-3.9h5.5v3.9zm11.3-30.1h5.5v4h-5.5v-4zm0%2026.1h5.5v3.9h-5.5v-3.9zm-8.5-26.1H47v3.9h-5.5v-3.9zm0%2026.1H47v3.9h-5.5l.1-3.9zm-8.4-26.1h5.5v3.9h-5.5v-3.9zm-.8%209.7l7.2%204.1c1.3.8%201.3%202%200%202.8L32.4%2071c-1.3.8-2.4.1-2.4-1.4v-8.3c0-1.4%201.1-2.1%202.4-1.3zm-7.7-9.7h5.4v3.9h-5.4v-3.9zm0%2026.1h5.4v3.9h-5.4v-3.9zm-8.3-26.1h5.5v4h-5.5v-4z'/%3e%3c/svg%3e", _y = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23c11e07}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zm9.1-11.4h7.1v2.9h-3.8v3.1H38v2.9h-3.1v5.4h-3.3V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M33.5%2046.538c-2.3%200-4.1%201.9-4.1%204.1%200%202.8%201.6%206.3%203.2%209.6-1.3%204-2.7%208.3-4.6%2011.9-3.8%201.5-7.2%202.6-9.2%204.3l-.1.1c-.7.8-1.2%201.8-1.2%202.9%200%202.3%201.9%204.1%204.1%204.1%201.1%200%202.2-.4%202.9-1.2%200%200%20.1%200%20.1-.1%201.5-1.8%203.3-5.1%204.9-8%203.6-1.4%207.5-2.9%2011.1-3.8%202.7%202.2%206.6%203.6%209.8%203.6%202.3%200%204.1-1.9%204.1-4.1%200-2.3-1.9-4.1-4.1-4.1-2.6%200-6.3.9-9.1%201.9-2.3-2.2-4.4-4.9-6-7.8%201.1-3.4%202.4-6.7%202.4-9.3-.1-2.3-1.9-4.1-4.2-4.1zm0%202.4c.9%200%201.6.7%201.6%201.6%200%201.2-.7%203.5-1.4%205.9-1-2.4-1.9-4.7-1.9-5.9.1-.8.8-1.6%201.7-1.6zm.7%2014.1c1.2%202%202.7%203.8%204.3%205.4-2.4.7-4.8%201.5-7.2%202.4%201.2-2.5%202.1-5.2%202.9-7.8zm16.2%205.3c.9%200%201.6.7%201.6%201.6%200%20.9-.7%201.6-1.6%201.6-1.9%200-4.5-.8-6.6-2%202.4-.6%205.1-1.2%206.6-1.2zm-24.5%207.3c-1.2%202.1-2.3%204-3.1%205-.3.3-.6.4-1.1.4-.9%200-1.6-.7-1.6-1.6%200-.4.2-.9.4-1.1.9-.8%203-1.7%205.4-2.7z'%20fill='%23c11e07'%20stroke='%23c11e07'%20stroke-width='.75'%20stroke-miterlimit='10'/%3e%3c/svg%3e", vy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm10-4.1h-3.1V6.4h9.6v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", yy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205H9.5v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zm5.7-7h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205h-1.1v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zM27%209.3h-2.8V6.4h8.6v2.9H30v11.4h-3V9.3zm9%204.3l-3.1-7.2h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.1-.9-.3-1.7-.3-1.7s-.2.8-.5%201.7l-1%203H33l3-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", by = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9s-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm10%201.4l-3.6-8.4h3.6l1.1%203.4c.3%201%20.5%202.1.5%202.1h.1s.2-1.1.5-2.1l1.1-3.4h3.6l-3.6%208.4v5.9h-3.3v-5.9z'%20fill='%23fff'/%3e%3cpath%20d='M34.5%2083.4c-4.4-.1-7.2-1.5-7.9-3.8l-.1-.3v-4.5c0-5.2%200-5.3.3-6.1.5-1.5%201.7-2.5%203.5-2.9l.4-.1h5.1c3.7%200%205.2%200%205.4-.1%201.1-.2%201.7-.4%202.3-.9.8-.6%201.4-1.6%201.6-2.6.2-.8.2-.7.2-3.5v-2.5h3.6l.4.1c1.9.6%203.3%202.3%203.9%205.1.2%201.1.2%201.1.2%203.8%200%202.6%200%202.6-.2%203.5-.2.8-.4%201.6-.8%202.3-.7%201.4-1.8%202.4-3.1%202.8-.8.3-.1.2-7.5.3h-6.7v1.2h8.8v4.6c-.1.3-.1.6-.4%201s-.8.9-1.1%201.2c-1.2.8-3%201.3-5.4%201.4h-2.5zm6.1-2.8c.8-.1%201.5-1%201.3-1.8-.1-.7-.6-1.2-1.3-1.3-1.1-.1-2%20.8-1.8%201.8.1.8.8%201.3%201.6%201.3h.2zm-19-6.5c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%23fed142'/%3e%3cpath%20d='M21.6%2074.1c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%233571a3'/%3e%3c/svg%3e", xy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fea500}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm1.3-24.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8zM16%206.4h3.6l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.7-8.1h3.5l-3.9%2014.3h-3.3L16%206.4zm19.1-.3c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.2-4.5%202.6-7.6%206.5-7.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M27.1%2060.2L18%2079.4l1.7%201.7L31%2069.8c-.4-.9-.3-2%20.5-2.8%201-1%202.5-1%203.5%200s1%202.5%200%203.5c-.7.7-1.9.9-2.8.5L20.9%2082.3l1.7%201.7%2019.2-9.1L46%2063.4%2038.6%2056l-11.5%204.2zm26.3-2.3L44%2048.5c-.8-.8-2-.8-2.8%200L39%2050.7c-.8.8-.8%202%200%202.8l9.4%209.4c.8.8%202%20.8%202.8%200l2.2-2.2c.8-.8.8-2%200-2.8z'/%3e%3c/svg%3e", Sy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234d1b9b}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm10.5-2.9H23l3.6%2014.3h-3.3l-.6-3h-3l-.6%203h-3.3l3.6-14.3zm2.8%208.6l-.6-2.8c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.8h2zm6.9-8.6h4.5c.6%200%201.3.1%201.9.4%201.4.6%202.4%202.1%202.4%204%200%201.7-.8%203.3-2%204%200%200%20.2.2.5.9l2.3%205h-3.6l-2-4.8h-.8v4.8H29V6.4zM33%2013c.9%200%201.6-.7%201.6-1.9%200-.7-.2-1.2-.6-1.5-.3-.2-.6-.3-.9-.3h-.7V13h.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M43.6%2068.3l-7.3-3.4L51%2058l7.3%203.4-7.3%203.5-7.4%203.4zM51%2051.2l-7.3-3.4-7.3%203.4L51%2058.1l7.3-3.4-7.3-3.5zM28.9%2061.4L21.6%2058l-7.3%203.4L29%2068.3l7.3-3.4-7.4-3.5zm0-6.8l7.3-3.4-7.3-3.4-14.7%206.9%207.3%203.4%207.4-3.5zM51%2066.9l-6.6%203-.8.4-.8-.4-6.6-3-6.6%203-.8.4-.8-.4-6.6-3v10.7l14.7%207.7L51%2077.6V66.9z'/%3e%3c/svg%3e", Cy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234065aa}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm9.9%207.4c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M37.9%2055.1v-7.6H33c-.1.3-.2.6-.2%201-.1.2-.1.3-.1.5-.5%202.8-2%204.8-4.5%205.9-.7.3-1.4.4-2.1.3v6.1h3.6c.1%208.6.1%2013.1.1%2013.3v.5c.5%203.8%202.4%206%205.9%206.9%201.4.4%202.9.6%204.5.6%202-.1%203.9-.4%205.8-1v-7.2c-1.1.3-2.1.6-3%20.9-1.7.5-3.2.2-4.4-1-.1-.2-.3-.4-.3-.6-.2-.9-.3-1.9-.3-2.8v-9.6h7.8v-6.1h-7.9v-.1z'/%3e%3c/svg%3e", wy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm11.5%204.3L17%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1H24l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203h-3.5l3.3-7.1zm12.1-4.3h-3.1V6.4H39v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14.6%2077.2h42.8v6.2H14.6zm0-14.8h42.8v6.2H14.6zm0-15h42.8v6.2H14.6z'/%3e%3c/svg%3e", Ty = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM5.6%206.4h3.1l1.1%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.2-8.9h2.9l1.2%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.1-8.9h3.1l-2.4%2014.3H14l-1.1-7.2c-.1-.9-.2-1.7-.2-1.7h-.1s0%20.8-.1%201.7l-1%207.2H8L5.6%206.4zm18.3%200h3.4l3.4%2014.3h-3.1l-.6-3h-2.9l-.6%203h-3.1l3.5-14.3zm2.6%208.6l-.5-2.9c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.9h1.9zm4.3-8.6h3.4l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.6-8.1h3.3l-3.7%2014.3h-3.2L30.8%206.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", Ey = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm9.8-7.2h3.3v11.4h4.3v2.9h-7.6V6.4zm11%2010.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.3-.5-1.3-.9-2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", Dy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.6-27.4L5.5%206.4h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9H15l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203H5.6l3-7.1zm8-7.2h3v11.4h3.9v2.9h-6.8V6.4zm9%2010.3c.5.6%201.3%201.2%202.1%201.2s1.2-.6%201.2-1.2c0-2-4.3-2.1-4.3-6.2%200-2.4%201.5-4.3%204.1-4.3%201.1%200%202.2.3%203.1%201l-1.1%202.9c-.4-.4-1.3-.9-1.9-.9-.8%200-1.2.6-1.2%201.2%200%202.1%204.3%202%204.3%206.1%200%202.3-1.3%204.4-4%204.4-1.3%200-2.6-.5-3.6-1.4l1.3-2.8zm10.2-3.1l-3.1-7.2H36l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203h-3.2l3.1-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", Oy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm10.3-7.2H23l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6h3.6l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H23l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l1.1-14.3zm15.1%200h3.3v11.4H42v2.9h-7.6V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2076c-.5%200-1.1-.2-1.5-.6L13.6%2067c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-6.9%206.9%206.9%206.9c.8.8.8%202.1%200%203-.5.4-1%20.6-1.5.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2075.4c-.4.4-.9.6-1.5.6zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3s1.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23666'%20stroke='%23666'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", ky = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.9-26.2L5.5%206.5H8l1.5%204.2c.3.9.5%201.9.5%201.9s.2-1%20.5-1.9L12%206.5h2.5l-3.4%208.3v5.9H8.9v-5.9zm8.4-8.3h2.5l3.5%2014.2H21l-.9-3.7h-3.2l-.8%203.7h-2.3l3.5-14.2zm2.4%208.5l-.8-3.8c-.2-.8-.4-2.2-.4-2.2h-.1s-.2%201.4-.4%202.2l-.8%203.8h2.5zm5.2-8.5h2.5l1.8%206.9c.2.9.4%202.2.4%202.2h.1s.2-1.3.4-2.2l1.8-6.9h2.5l.8%2014.2h-2.1l-.4-7.9c-.1-.9%200-2.2%200-2.2h-.1s-.2%201.4-.4%202.3l-1.4%205.4h-2.2l-1.4-5.4c-.2-.8-.4-2.3-.4-2.3h-.1s.1%201.3%200%202.2l-.4%207.9h-2.1l.7-14.2zm12.3%200h2.3v12h4.3v2.2h-6.5V6.5z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14%2048.9h37v4.3H14zm7%209.6h37v4.3H21zm-7%209.6h37v4.3H14zm7%209.6h37V82H21z'/%3e%3c/svg%3e", Ay = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm0-22.5l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1H15v2.9H6v-2.2zM18.1%206.4h3.3v14.3h-3.3V6.4zm7%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", jy = { class: "artifact-card my-2 w-full max-w-md overflow-hidden rounded-2xl border border-[#424242] bg-[#292929]" }, My = ["aria-label"], Ny = ["src", "alt"], Py = { class: "flex min-w-0 items-center gap-3 p-3" }, Fy = ["src"], Iy = { class: "min-w-0 flex-1" }, Ly = ["aria-label"], Ry = {
	key: 1,
	class: "block truncate text-sm font-medium"
}, zy = { class: "block text-xs text-[#b4b4b4]" }, By = [
	"href",
	"download",
	"aria-label"
], Vy = { class: "mb-4 flex items-center gap-3" }, Hy = { class: "min-w-0 flex-1 break-words" }, Uy = ["href", "download"], Wy = {
	key: 0,
	role: "status"
}, Gy = {
	key: 1,
	role: "alert",
	class: "text-red-200"
}, Ky = {
	key: 2,
	class: "max-h-[70dvh] overflow-auto whitespace-pre-wrap break-words text-sm"
}, qy = ["src", "alt"], Jy = ["src", "title"], Yy = ["src"], Xy = ["src"], Zy = /* @__PURE__ */ H({
	__name: "ArtifactCard",
	props: {
		file: {},
		profile: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* #__PURE__ */ Object.assign({
			"../../../assets/file-icons/blank.svg": ay,
			"../../../assets/file-icons/css.svg": oy,
			"../../../assets/file-icons/csv.svg": sy,
			"../../../assets/file-icons/doc.svg": cy,
			"../../../assets/file-icons/docx.svg": ly,
			"../../../assets/file-icons/gz.svg": uy,
			"../../../assets/file-icons/html.svg": dy,
			"../../../assets/file-icons/js.svg": fy,
			"../../../assets/file-icons/json.svg": py,
			"../../../assets/file-icons/md.svg": my,
			"../../../assets/file-icons/mp3.svg": hy,
			"../../../assets/file-icons/mp4.svg": gy,
			"../../../assets/file-icons/pdf.svg": _y,
			"../../../assets/file-icons/ppt.svg": vy,
			"../../../assets/file-icons/pptx.svg": yy,
			"../../../assets/file-icons/py.svg": by,
			"../../../assets/file-icons/svg.svg": xy,
			"../../../assets/file-icons/tar.svg": Sy,
			"../../../assets/file-icons/ts.svg": Cy,
			"../../../assets/file-icons/txt.svg": wy,
			"../../../assets/file-icons/wav.svg": Ty,
			"../../../assets/file-icons/xls.svg": Ey,
			"../../../assets/file-icons/xlsx.svg": Dy,
			"../../../assets/file-icons/xml.svg": Oy,
			"../../../assets/file-icons/yaml.svg": ky,
			"../../../assets/file-icons/zip.svg": Ay
		}), a = Z(() => i[`../../../assets/file-icons/${Qp(n.file.name)}.svg`] || i["../../../assets/file-icons/blank.svg"]), o = Z(() => em(n.file)), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(""), l = /* @__PURE__ */ z(""), u = /* @__PURE__ */ z(""), d = /* @__PURE__ */ z(!1), f = /* @__PURE__ */ z(!1), p;
		function m() {
			p?.abort(), c.value.startsWith("blob:") && URL.revokeObjectURL(c.value), c.value = "", l.value = "";
		}
		ur(m);
		async function h() {
			m(), u.value = "", s.value?.showModal(), d.value = !0;
			let e = p = new AbortController();
			try {
				let t = tm(n.file, n.profile);
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
		return In([
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
			let a = tm(n.file, n.profile);
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
		}, { immediate: !0 }), (t, n) => (G(), K("div", jy, [
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
			}, null, 40, Ny)], 8, My)) : X("v-if", !0),
			J("div", Py, [
				o.value !== "image" || f.value ? (G(), K("img", {
					key: 0,
					src: a.value,
					alt: "",
					class: "size-10 shrink-0"
				}, null, 8, Fy)) : X("v-if", !0),
				J("div", Iy, [o.value ? (G(), K("button", {
					key: 0,
					type: "button",
					class: "block w-full truncate text-left text-sm font-medium hover:underline",
					"aria-label": `Preview ${e.file.name}`,
					onClick: h
				}, R(e.file.name), 9, Ly)) : (G(), K("span", Ry, R(e.file.name), 1)), J("span", zy, [Y(R(B(Qp)(e.file.name).toUpperCase() || "FILE"), 1), e.file.size === void 0 ? X("v-if", !0) : (G(), K(W, { key: 0 }, [Y(" · " + R(e.file.size < 1024 ? `${e.file.size} B` : e.file.size < 1048576 ? `${(e.file.size / 1024).toFixed(1)} KB` : `${(e.file.size / 1048576).toFixed(1)} MB`), 1)], 64))])]),
				J("a", {
					href: B(tm)(e.file, e.profile, !0),
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
				}, [J("path", { d: "M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" })], -1)]], 8, By)
			]),
			vr(t.$slots, "footer"),
			J("dialog", {
				ref_key: "dialog",
				ref: s,
				class: "artifact-preview fixed m-auto max-h-[90dvh] w-[min(900px,94vw)] overflow-auto rounded-2xl border border-[#424242] bg-[#212121] p-4 text-white backdrop:bg-black/80",
				onClose: m,
				onClick: n[3] ||= (e) => e.target === s.value && s.value?.close()
			}, [J("div", Vy, [
				J("h2", Hy, R(e.file.name), 1),
				J("a", {
					href: B(tm)(e.file, e.profile, !0),
					download: e.file.name,
					class: "text-sm underline"
				}, "Download", 8, Uy),
				J("button", {
					type: "button",
					autofocus: "",
					class: "size-10 rounded-full hover:bg-[#424242]",
					"aria-label": "Close preview",
					onClick: n[2] ||= (e) => s.value?.close()
				}, " ✕ ")
			]), d.value ? (G(), K("p", Wy, "Loading preview…")) : u.value ? (G(), K("p", Gy, R(u.value), 1)) : o.value === "text" ? (G(), K("pre", Ky, R(l.value), 1)) : o.value === "image" && c.value ? (G(), K("img", {
				key: 3,
				src: c.value,
				alt: e.file.name,
				class: "max-h-[70dvh] w-full object-contain"
			}, null, 8, qy)) : o.value === "pdf" && c.value ? (G(), K("iframe", {
				key: 4,
				src: c.value,
				title: e.file.name,
				class: "h-[70dvh] w-full bg-white"
			}, null, 8, Jy)) : o.value === "video" && c.value ? (G(), K("video", {
				key: 5,
				src: c.value,
				controls: "",
				class: "max-h-[70dvh] w-full"
			}, null, 8, Yy)) : o.value === "audio" && c.value ? (G(), K("audio", {
				key: 6,
				src: c.value,
				controls: "",
				class: "w-full"
			}, null, 8, Xy)) : X("v-if", !0)], 544)
		]));
	}
}), Qy = new Hp({
	html: !1,
	breaks: !0,
	linkify: !0
});
Qy.renderer.rules.link_open = (e, t, n, r, i) => (e[t].attrSet("target", "_blank"), e[t].attrSet("rel", "noopener noreferrer"), i.renderToken(e, t, n));
function $y(e) {
	return Qy.render(e);
}
//#endregion
//#region src/features/chat/components/UserMessage.vue?vue&type=script&setup=true&lang.ts
var eb = { class: "message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]" }, tb = ["innerHTML"], nb = /* @__PURE__ */ H({
	__name: "UserMessage",
	props: {
		message: {},
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (G(), K("article", eb, [J("div", {
			class: "message-content markdown-content break-words text-base leading-7",
			innerHTML: B($y)(B(om)(B(_l)(e.message.content)).text.replace(/\[screenshot\]/g, "📷 Attached image"))
		}, null, 8, tb), (G(!0), K(W, null, U(B(sm)(e.message), (t) => (G(), q(Zy, {
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
function rb(e) {
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
var ib = (e) => [
	"terminal",
	"execute_code",
	"python"
].includes(e.toolName || "");
function ab(e) {
	try {
		return JSON.parse(e.content) || {};
	} catch {
		return {};
	}
}
function ob(e) {
	let t = ab(e), n = t.command ?? t.code;
	return typeof n == "string" && n.trim().split("\n")[0] || "";
}
function sb(e, t) {
	if (ib(e)) return `${t ? "Running" : e.state === "completed" ? "Ran" : "Command"} ${ob(e) || "command"}`;
	let n = (e.toolName || "tool").replace(/_/g, " ");
	return /^(used|using) tool$/i.test(e.title) ? `${t ? "Using" : e.state === "completed" ? "Used" : "Tool:"} ${n}` : e.title || n;
}
var cb = {
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
function lb(e) {
	let t = e.toolName || "";
	return ib(e) ? "run" : [
		"read_file",
		"list_files",
		"search_files",
		"file_search",
		"search"
	].includes(t) ? "explore" : ["web_search", "session_search_recall"].includes(t) ? "search" : t === "web_extract" ? "read" : t === "browser_navigate" ? "browse" : t.startsWith("browser_") ? "interact" : t === "vision_analyze" ? "analyze" : "other";
}
function ub(e, t) {
	let n = ab(e);
	if (t === "run") return ob(e);
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
function db(e, t) {
	let n = t ? e.find((e) => !e.complete) ?? e.at(-1) : void 0, r = n ? lb(n) : void 0, i = [];
	for (let t of Object.keys(cb)) {
		let n = e.filter((e) => lb(e) === t);
		if (!n.length) continue;
		let a = cb[t], o = t === r, s = n.every((e) => e.state === "completed"), c = n.reduce((e, n) => {
			let r = ab(n).urls;
			return e + (t === "read" && Array.isArray(r) && r.length ? r.length : 1);
		}, 0), l = c === 1 && (o || t !== "run") ? ub(n[0], t) : "", u = o ? a.present : s ? a.past : "";
		i.push([u, l || `${c} ${a.nouns[c === 1 ? 0 : 1]}`].filter(Boolean).join(" "));
	}
	let a = e.filter((e) => e.state === "failed").length;
	return a && i.push(`${a} failed`), i.map((e, t) => t ? e.charAt(0).toLowerCase() + e.slice(1) : e).join(", ");
}
//#endregion
//#region src/components/ActivityRow.vue?vue&type=script&setup=true&lang.ts
var fb = ["open"], pb = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, mb = {
	key: 1,
	"aria-hidden": "true"
}, hb = ["title"], gb = {
	key: 2,
	class: "activity-meta"
}, _b = {
	key: 3,
	class: "activity-meta"
}, vb = {
	key: 4,
	class: "activity-meta"
}, yb = {
	key: 5,
	class: "activity-meta"
}, bb = {
	key: 6,
	class: "activity-meta"
}, xb = {
	key: 1,
	class: "ml-6 py-1 text-sm",
	role: "status"
}, Sb = /* @__PURE__ */ H({
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
		].includes(r.value || "")), a = /* @__PURE__ */ z(null), o = Z(() => a.value ?? (t.activity.kind === "thinking" && (n.value || i.value))), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(!0);
		function l() {
			let e = s.value;
			e && (c.value = e.scrollHeight - e.scrollTop - e.clientHeight < 24);
		}
		In(() => [
			t.activity.content,
			t.activity.output,
			o.value
		], () => {
			let e = s.value;
			e && n.value && o.value && c.value && (e.scrollTop = e.scrollHeight);
		}, { flush: "post" });
		let u = /* @__PURE__ */ z(Date.now()), d;
		In(() => n.value && t.activity.startedAt !== void 0, (e) => {
			d && clearInterval(d), e && (d = setInterval(() => {
				u.value = Date.now();
			}, 1e3));
		}, { immediate: !0 }), ur(() => {
			d && clearInterval(d);
		});
		let f = Z(() => t.activity.duration ?? (n.value && t.activity.startedAt !== void 0 ? Math.max(0, (u.value - t.activity.startedAt) / 1e3) : void 0)), p = Z(() => t.activity.kind === "thinking" ? n.value ? "Thinking…" : "Thought" : sb(t.activity, n.value));
		function m(e) {
			let t = e.target.open;
			t !== o.value && (a.value = t);
		}
		return (t, c) => (G(), K("details", {
			class: F(["activity", {
				"activity-failed": i.value,
				"activity-active": n.value,
				"activity-thinking": e.activity.kind === "thinking"
			}]),
			open: o.value,
			onToggle: m
		}, [J("summary", { onClick: c[0] ||= Do((e) => a.value = !o.value, ["prevent"]) }, [
			B(ib)(e.activity) ? (G(), K("span", pb, "›_")) : X("v-if", !0),
			i.value ? (G(), K("span", mb, "!")) : X("v-if", !0),
			J("span", {
				class: F(["activity-label", { "working-shimmer": n.value }]),
				title: p.value
			}, R(p.value), 11, hb),
			r.value === "failed" ? (G(), K("span", gb, " · Failed")) : r.value === "interrupted" ? (G(), K("span", _b, " · Interrupted")) : r.value === "unknown" ? (G(), K("span", vb, " · Result unavailable")) : n.value && e.activity.kind === "tool" ? (G(), K("span", yb, " · " + R(r.value === "pending" ? "Waiting…" : "Running…"), 1)) : X("v-if", !0),
			f.value === void 0 ? X("v-if", !0) : (G(), K("span", bb, " · " + R(f.value.toFixed(1)) + "s", 1)),
			J("span", {
				class: F(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2)
		]), e.activity.content || e.activity.output || e.activity.toolName ? (G(), K("pre", {
			key: 0,
			ref_key: "preview",
			ref: s,
			onScroll: l
		}, R([
			e.activity.toolName,
			e.activity.content,
			e.activity.output
		].filter(Boolean).join("\n\n")), 545)) : n.value ? (G(), K("p", xb, "Working…")) : X("v-if", !0)], 42, fb));
	}
}), Cb = {
	class: "turn-work",
	"aria-label": "Assistant activity"
}, wb = ["aria-expanded", "aria-controls"], Tb = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, Eb = ["title"], Db = {
	key: 1,
	class: "sr-only",
	role: "status"
}, Ob = ["id"], kb = /* @__PURE__ */ H({
	__name: "TurnWork",
	props: {
		activities: {},
		working: { type: Boolean },
		approvalPending: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ z(null), r = Kn(), i = (e) => !e.complete && (t.working || !!e.delegated), a = Z(() => t.activities.filter((e) => !i(e))), o = Z(() => n.value ?? !1), s = Z(() => t.approvalPending ? "Waiting for approval" : t.activities.length && [
			a.value.some((e) => e.kind === "thinking") ? "Thought" : "",
			db(a.value.filter((e) => e.kind === "tool"), !1),
			...["interrupted", "unknown"].flatMap((e) => {
				let t = a.value.filter((t) => e === "unknown" ? t.state === e || !t.complete : t.state === e && t.complete).length;
				return t ? [`${t} ${e === "unknown" ? "results unavailable" : e}`] : [];
			})
		].filter(Boolean).join(", ") || "Working…");
		return (t, a) => (G(), K("section", Cb, [J("button", {
			type: "button",
			class: "work-summary",
			"aria-expanded": o.value,
			"aria-controls": B(r),
			onClick: a[0] ||= (e) => n.value = !o.value
		}, [
			e.activities.some(B(ib)) ? (G(), K("span", Tb, "›_")) : X("v-if", !0),
			J("span", {
				class: F(["activity-label", { "working-shimmer": e.working && !e.activities.length && !e.approvalPending }]),
				title: s.value
			}, R(s.value), 11, Eb),
			J("span", {
				class: F(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2),
			e.approvalPending ? (G(), K("span", Db, "Waiting for approval")) : X("v-if", !0)
		], 8, wb), J("div", {
			id: B(r),
			class: "work-timeline"
		}, [(G(!0), K(W, null, U(e.activities, (n) => (G(), K(W, { key: n.id }, [V(J("div", { class: F({ "current-activity": i(n) }) }, [Ki(Sb, {
			activity: n,
			"turn-complete": !e.working
		}, null, 8, ["activity", "turn-complete"])], 2), [[Fa, o.value || i(n)]]), vr(t.$slots, "result", { activity: n })], 64))), 128))], 8, Ob)]));
	}
}), Ab = { class: "message assistant w-full self-start" }, jb = ["innerHTML"], Mb = /* @__PURE__ */ H({
	__name: "AssistantTextBlock",
	props: {
		block: {},
		profile: {},
		sessionId: {},
		excludedPaths: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = Z(() => im(n.block.content)), i = t;
		return (t, n) => (G(), K("article", Ab, [
			J("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: B($y)(r.value.text)
			}, null, 8, jb),
			(G(!0), K(W, null, U(r.value.files.filter((t) => !e.excludedPaths?.includes(t.path)), (t) => (G(), q(Zy, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[0] ||= (e) => i("imageLoad")
			}, null, 8, ["file", "profile"]))), 128)),
			(G(!0), K(W, null, U(e.block.images, (t) => (G(), q(Zy, {
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
}), Nb = { class: "assistant-turn grid min-w-0 gap-1" }, Pb = {
	key: 1,
	class: "response-actions flex items-center gap-1 text-[#a3a3a3]"
}, Fb = ["disabled"], Ib = {
	role: "status",
	class: "text-xs"
}, Lb = /* @__PURE__ */ H({
	__name: "AssistantTurn",
	props: {
		entry: {},
		branchDisabled: { type: Boolean },
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad", "branch"],
	setup(e, { emit: t }) {
		let n = e, r = Z(() => n.entry.blocks.flatMap((e) => e.kind === "text" ? im(e.content).files.map((e) => e.path) : [])), i = Z(() => rb(n.entry.blocks)), a = Z(() => {
			let e = new Set(r.value), t = /* @__PURE__ */ new Map();
			for (let r of n.entry.blocks) r.kind === "tool" && t.set(r.id, am(r).filter((t) => !e.has(t.path) && (e.add(t.path), !0)));
			return t;
		}), o = (e) => a.value.get(e.id) || [], s = t, c = /* @__PURE__ */ z(""), l = Z(() => n.entry.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("\n\n"));
		async function u() {
			try {
				await navigator.clipboard.writeText(l.value), c.value = "Copied";
			} catch {
				c.value = "Could not copy. Select the response text to copy it.";
			}
		}
		return (t, n) => (G(), K("div", Nb, [
			(G(!0), K(W, null, U(i.value, (t) => (G(), K(W, { key: t.id }, [t.kind === "tools" ? (G(), q(kb, {
				key: 0,
				activities: t.activities,
				working: !!e.entry.working,
				"approval-pending": e.entry.approvalPending
			}, {
				result: An(({ activity: t }) => [(G(!0), K(W, null, U(o(t), (t) => (G(), q(Zy, {
					key: t.path,
					file: {
						...t,
						sessionId: e.sessionId
					},
					profile: e.profile,
					onImageLoad: n[0] ||= (e) => s("imageLoad")
				}, null, 8, ["file", "profile"]))), 128))]),
				_: 1
			}, 8, [
				"activities",
				"working",
				"approval-pending"
			])) : (G(), q(Mb, {
				key: 1,
				block: t.block,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: n[1] ||= (e) => s("imageLoad")
			}, null, 8, [
				"block",
				"profile",
				"session-id"
			]))], 64))), 128)),
			e.entry.working && !i.value.some((e) => e.kind === "tools") ? (G(), q(kb, {
				key: 0,
				activities: [],
				working: !0,
				"approval-pending": e.entry.approvalPending
			}, null, 8, ["approval-pending"])) : X("v-if", !0),
			vr(t.$slots, "request"),
			!e.entry.working && l.value.trim() ? (G(), K("div", Pb, [
				J("button", {
					type: "button",
					"aria-label": "Copy response",
					title: "Copy response",
					class: "flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-white",
					onPointerdown: n[2] ||= Do(() => {}, ["prevent"]),
					onClick: u
				}, [...n[5] ||= [J("svg", {
					"aria-hidden": "true",
					viewBox: "0 0 24 24",
					class: "size-4",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.6"
				}, [J("rect", {
					x: "8",
					y: "8",
					width: "12",
					height: "13",
					rx: "2"
				}), J("path", { d: "M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" })], -1)]], 32),
				e.entry.responseId ? (G(), K("button", {
					key: 0,
					type: "button",
					"aria-label": "Branch in new chat",
					title: "Branch in new chat",
					disabled: e.branchDisabled,
					class: "flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-white",
					onPointerdown: n[3] ||= Do(() => {}, ["prevent"]),
					onClick: n[4] ||= (t) => s("branch", e.entry.responseId)
				}, [...n[6] ||= [Xi("<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" class=\"size-4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><circle cx=\"6\" cy=\"5\" r=\"2\"></circle><circle cx=\"6\" cy=\"19\" r=\"2\"></circle><circle cx=\"18\" cy=\"5\" r=\"2\"></circle><path d=\"M6 7v10m0-4h5a7 7 0 0 0 7-6\"></path></svg>", 1)]], 40, Fb)) : X("v-if", !0),
				J("span", Ib, R(c.value), 1)
			])) : X("v-if", !0)
		]));
	}
}), Rb = { class: "relative flex min-h-0 w-full flex-1" }, zb = {
	key: 0,
	class: "text-center text-sm text-[#a3a3a3]"
}, Bb = ["disabled"], Vb = {
	key: 0,
	role: "status"
}, Hb = {
	key: 1,
	class: "muted text-sm text-[#a3a3a3]"
}, Ub = {
	key: 2,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, Wb = {
	key: 0,
	"data-compaction": "",
	class: "flex items-center gap-3 text-xs text-[#a3a3a3]",
	role: "separator",
	"aria-label": "Context compacted"
}, Gb = {
	key: 2,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, Kb = { class: "system-notices" }, qb = { class: "cursor-pointer select-none" }, Jb = { class: "mt-2 whitespace-pre-wrap break-words" }, Yb = {
	key: 3,
	class: "assistant-turn",
	"data-chat-message": "",
	tabindex: "-1"
}, Xb = {
	key: 4,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, Zb = {
	key: 6,
	class: "message assistant w-full self-start",
	"data-chat-message": "",
	tabindex: "-1"
}, Qb = ["innerHTML"], $b = /* @__PURE__ */ H({
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
		let r = e, i = n, a = Z(() => o.value), o = Z(() => Tm(r)), s = /* @__PURE__ */ z(), c = /* @__PURE__ */ z(), l = /* @__PURE__ */ z(r.followInitially !== !1), u = /* @__PURE__ */ z(!0), d;
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
		}), ur(() => h?.disconnect()), In(() => [
			r.messages,
			r.hasEarlier,
			r.loadingEarlier
		], () => {
			!l.value && (!_?.element.isConnected || Math.abs((s.value?.scrollTop || 0) - _.scrollTop) > .5) && v();
		}, { flush: "pre" }), In(() => r.sessionId, () => {
			_ = void 0, l.value = r.followInitially !== !1, m = !0;
		}), In(() => [
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
		}), (t, n) => (G(), K("div", Rb, [J("div", {
			ref_key: "transcript",
			ref: s,
			style: { "overflow-anchor": "none" },
			class: "transcript flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-4 py-6 text-white min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9",
			tabindex: "-1",
			role: "log",
			"aria-label": "Conversation",
			"aria-live": "polite",
			onScroll: b,
			onToggleCapture: C
		}, [J("div", {
			ref_key: "content",
			ref: c,
			class: "flex min-h-full shrink-0 flex-col gap-7"
		}, [
			e.hasEarlier || e.loadingEarlier || e.earlierError ? (G(), K("div", zb, [J("button", {
				type: "button",
				disabled: e.loadingEarlier,
				class: "rounded-full px-4 py-2 hover:bg-[#303030] disabled:opacity-60",
				onClick: y
			}, R(e.loadingEarlier ? "Loading earlier messages…" : "Show earlier messages"), 9, Bb), e.earlierError ? (G(), K("p", Vb, R(e.earlierError), 1)) : X("v-if", !0)])) : X("v-if", !0),
			e.loading ? (G(), K("div", Hb, "Loading conversation…")) : !a.value.length && !e.draft && !e.thinking ? (G(), K("div", Ub, [...n[1] ||= [J("div", { class: "m-auto text-center" }, [J("h2", { class: "text-2xl font-medium" }, "What can I help with?"), J("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, " Ask Hermes a question or continue a conversation. ")], -1)]])) : X("v-if", !0),
			(G(!0), K(W, null, U(o.value, (r) => (G(), K(W, { key: r.key }, [r.kind === "compaction" ? (G(), K("div", Wb, [...n[2] ||= [
				J("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1),
				J("span", null, "Context compacted", -1),
				J("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1)
			]])) : r.kind === "user" ? (G(), q(nb, {
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
			])) : r.kind === "status" ? (G(), K("div", Gb, [J("details", Kb, [J("summary", qb, R(r.text), 1), J("p", Jb, R(r.content), 1)])])) : (G(), q(Lb, {
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
			e.working && !o.value.some((e) => e.kind === "turn" && e.working) ? (G(), K("div", Yb, [Ki(kb, {
				activities: e.progress,
				working: !0,
				"approval-pending": e.approvalPending
			}, null, 8, ["activities", "approval-pending"])])) : X("v-if", !0),
			e.statusLabel && !e.working ? (G(), K("div", Xb, R(e.statusLabel), 1)) : X("v-if", !0),
			o.value.some((e) => e.kind === "turn" && e.working) ? X("v-if", !0) : vr(t.$slots, "request", {}, void 0, void 0, 5),
			e.draft && !e.blocks?.length ? (G(), K("article", Zb, [J("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: B($y)(e.draft)
			}, null, 8, Qb)])) : X("v-if", !0)
		], 512)], 544), !u.value && !e.home && !e.loading ? (G(), K("button", {
			key: 0,
			type: "button",
			class: "absolute bottom-5 left-1/2 z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#424242] bg-[#303030] text-white shadow-xl hover:bg-[#424242] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
			"aria-label": "Scroll to latest message",
			title: "Scroll to latest message",
			onClick: x
		}, [...n[3] ||= [J("svg", {
			"aria-hidden": "true",
			viewBox: "0 0 24 24",
			class: "size-5",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2"
		}, [J("path", { d: "M12 5v14m-7-7 7 7 7-7" })], -1)]])) : X("v-if", !0)]));
	}
}), ex = {
	key: 0,
	class: "approval-choices grid grid-cols-1 gap-2 my-3"
}, tx = ["disabled", "onClick"], nx = /* @__PURE__ */ H({
	__name: "ApprovalRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		active: { type: Boolean },
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
		return (t, i) => (G(), K(W, null, [J("p", null, "Approval required" + R(e.request.params.command ? ": " + e.request.params.command : ""), 1), e.active ? (G(), K("div", ex, [(G(!0), K(W, null, U(e.request.params.choices, (t) => (G(), K("button", {
			key: t,
			class: F(["w-full rounded-xl bg-[#303030] px-[14px] py-[10px] text-left text-base leading-[1.5] text-white whitespace-normal break-words disabled:opacity-55", t === "deny" ? "text-red-500" : ""]),
			disabled: e.disabled || n.value,
			onMousedown: i[0] ||= Do(() => {}, ["prevent"]),
			onClick: (e) => r(t)
		}, R(t === "once" ? "Allow once" : t === "deny" ? "Deny" : t === "session" ? "Allow for session" : "Always allow"), 43, tx))), 128))])) : X("v-if", !0)], 64));
	}
}), rx = { class: "clarification-card" }, ix = ["disabled"], ax = {
	key: 0,
	class: "clarification-choices"
}, ox = ["aria-pressed", "onClick"], sx = { class: "clarification-other" }, cx = ["onUpdate:modelValue", "aria-label"], lx = ["disabled"], ux = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ H({
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
		return (t, n) => (G(), K("div", rx, [(G(!0), K(W, null, U(e.questions, (t) => (G(), K("form", {
			key: t.qid,
			onSubmit: Do(c, ["prevent"])
		}, [J("fieldset", { disabled: e.disabled }, [
			J("legend", null, R(t.question), 1),
			t.choices?.length ? (G(), K("div", ax, [(G(!0), K(W, null, U(t.choices, (e) => (G(), K("button", {
				key: e,
				type: "button",
				"aria-pressed": t.multi_select ? i.value[t.qid]?.includes(e) ?? !1 : void 0,
				onClick: (n) => s(t, e)
			}, R(e), 9, ox))), 128))])) : X("v-if", !0),
			J("div", sx, [V(J("input", {
				"onUpdate:modelValue": (e) => a.value[t.qid] = e,
				placeholder: "Other response",
				"aria-label": t.question + " — Other response"
			}, null, 8, cx), [[_o, a.value[t.qid]]]), J("button", {
				type: "submit",
				disabled: e.disabled || !Object.keys(o()).length
			}, "Send", 8, lx)])
		], 8, ix)], 32))), 128))]));
	}
}), [["__scopeId", "data-v-4672d460"]]), dx = /* @__PURE__ */ H({
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
		return (t, i) => (G(), q(ux, {
			questions: e.request.params.questions,
			disabled: e.disabled || n.value,
			onAnswer: r
		}, null, 8, ["questions", "disabled"]));
	}
}), fx = { class: "block my-3" }, px = ["aria-label", "disabled"], mx = ["disabled"], hx = /* @__PURE__ */ H({
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
		return (t, a) => (G(), K(W, null, [J("p", null, R(e.request.params.prompt), 1), J("form", { onSubmit: Do(i, ["prevent"]) }, [J("label", fx, [Y(R(e.request.params.env_var) + " ", 1), V(J("input", {
			"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
			type: "password",
			autocomplete: "off",
			"aria-label": e.request.params.prompt || "Secret",
			disabled: e.disabled || r.value,
			class: "block w-full rounded-lg bg-[#303030] p-2 text-base"
		}, null, 8, px), [[_o, n.value]])]), J("button", {
			type: "submit",
			disabled: e.disabled || r.value || !n.value,
			class: "rounded-lg bg-[#303030] p-2 text-base"
		}, " Submit secret ", 8, mx)], 32)], 64));
	}
}), gx = { key: 3 }, _x = /* @__PURE__ */ H({
	__name: "LiveRequest",
	setup(e) {
		let { view: t, scope: n, actions: r } = Xm(), { request: i, reconnect: a, active: o } = t, { profile: s, session: c } = n, l = r.answerFor;
		return (e, t) => B(i) ? (G(), K("div", {
			key: JSON.stringify([
				B(s),
				B(c),
				B(i).id
			]),
			class: "notice px-5 py-3 text-sm",
			role: "status"
		}, [B(i).kind === "approval" ? (G(), q(nx, {
			key: 0,
			request: B(i),
			disabled: B(a),
			active: B(o),
			answer: B(l)(B(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"active",
			"answer"
		])) : B(i).kind === "clarify" ? (G(), q(dx, {
			key: 1,
			request: B(i),
			disabled: B(a),
			answer: B(l)(B(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : B(i).kind === "secret" ? (G(), q(hx, {
			key: 2,
			request: B(i),
			disabled: B(a),
			answer: B(l)(B(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : (G(), K("p", gx, "This request cannot be displayed. Open it in Hermes."))])) : X("v-if", !0);
	}
}), vx = /* @__PURE__ */ H({
	__name: "ChatConversation",
	setup(e) {
		let { view: t, scope: n, actions: r } = Xm(), { profile: i, session: a } = n, { messages: o, loading: s, busy: c, approvalPending: l, status: u } = t, d = /* @__PURE__ */ z(), f = Nn(Zm);
		return sr(() => {
			f && (f.value = d.value);
		}), ur(() => {
			f && f.value === d.value && (f.value = void 0);
		}), (e, n) => (G(), q($b, {
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
			request: An(() => [Ki(_x)]),
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
}), yx = /* @__PURE__ */ H({
	__name: "HomePage",
	setup(e) {
		return (e, t) => (G(), q(vx));
	}
}), bx = /* @__PURE__ */ H({
	__name: "ChatPage",
	setup(e) {
		return (e, t) => (G(), q(vx));
	}
}), xx = {
	"aria-label": "Inbox",
	class: "min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
}, Sx = { class: "mx-auto max-w-3xl" }, Cx = { class: "mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm" }, wx = { class: "flex items-center gap-2" }, Tx = { value: "profile" }, Ex = {
	key: 0,
	role: "alert",
	class: "mb-4 text-red-200"
}, Dx = {
	key: 1,
	role: "status",
	class: "text-[#b4b4b4]"
}, Ox = {
	key: 2,
	class: "text-[#b4b4b4]"
}, kx = { class: "divide-y divide-[#363636]" }, Ax = ["data-session"], jx = ["disabled", "onClick"], Mx = { class: "min-w-0 truncate font-medium" }, Nx = { class: "line-clamp-1 break-words text-sm text-[#b4b4b4]" }, Px = { class: "flex items-center gap-2 text-xs text-[#777]" }, Fx = ["datetime"], Ix = ["disabled"], Lx = /* @__PURE__ */ H({
	__name: "InboxList",
	props: {
		profile: {},
		revision: {},
		scope: {},
		openItem: { type: Function }
	},
	emits: ["update:scope"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Z({
			get: () => n.scope,
			set: (e) => r("update:scope", e)
		}), a = /* @__PURE__ */ z([]), o = /* @__PURE__ */ z(null), s = /* @__PURE__ */ z(!1), c = /* @__PURE__ */ z(), l = /* @__PURE__ */ z(""), u;
		async function d(e = !1) {
			u?.abort();
			let t = u = new AbortController();
			s.value = !0, l.value = "";
			try {
				let r = await Q.inbox(n.profile, {
					scope: i.value,
					unread: !0,
					cursor: e && o.value || void 0
				}, t.signal);
				if (t.signal.aborted) return;
				let s = e ? [...a.value, ...r.items] : r.items;
				a.value = s.filter((e, t) => s.findIndex((t) => t.id === e.id) === t), o.value = r.nextCursor;
			} catch {
				t.signal.aborted || (l.value = "Could not load inbox. Try refreshing.");
			} finally {
				u === t && (s.value = !1);
			}
		}
		async function f(e) {
			if (!c.value) {
				c.value = e.id, l.value = "";
				try {
					await n.openItem(e);
				} catch {
					l.value = "Could not open this chat. The notification remains unread.";
				} finally {
					c.value = void 0;
				}
			}
		}
		return In(() => [
			n.profile,
			n.revision,
			i.value
		], () => void d(), { immediate: !0 }), ur(() => u?.abort()), (t, n) => (G(), K("section", xx, [J("div", Sx, [
			J("div", Cx, [J("label", wx, [n[3] ||= Y("View ", -1), V(J("select", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Inbox view",
				class: "rounded-lg bg-[#303030] px-2 py-1 text-sm"
			}, [n[2] ||= J("option", { value: "all" }, "All profiles", -1), J("option", Tx, "Profile: " + R(e.profile || "default"), 1)], 512), [[bo, i.value]])])]),
			l.value ? (G(), K("p", Ex, R(l.value), 1)) : X("v-if", !0),
			s.value && !a.value.length ? (G(), K("p", Dx, "Loading inbox…")) : a.value.length ? X("v-if", !0) : (G(), K("p", Ox, "No unread notifications.")),
			J("ol", kx, [(G(!0), K(W, null, U(a.value, (e) => (G(), K("li", {
				key: e.id,
				"data-session": e.session
			}, [J("button", {
				class: "grid w-full gap-1 rounded-lg px-2 py-2 text-left hover:bg-[#292929]",
				disabled: !!c.value,
				onClick: (t) => f(e)
			}, [
				J("p", Mx, R(e.title || "Untitled chat"), 1),
				J("p", Nx, R(e.preview), 1),
				J("div", Px, [J("span", null, R(e.profile), 1), J("time", { datetime: (/* @__PURE__ */ new Date(e.occurred * 1e3)).toISOString() }, R((/* @__PURE__ */ new Date(e.occurred * 1e3)).toLocaleString()), 9, Fx)])
			], 8, jx)], 8, Ax))), 128))]),
			o.value ? (G(), K("button", {
				key: 3,
				class: "my-5 min-h-11 rounded-full border border-[#555] px-5",
				disabled: s.value,
				onClick: n[1] ||= (e) => d(!0)
			}, " Load More ", 8, Ix)) : X("v-if", !0)
		])]));
	}
}), Rx = /* @__PURE__ */ H({
	__name: "InboxPage",
	setup(e) {
		let { profile: t, inboxRevision: n, openInboxItem: r, refreshInbox: i } = vg(), a = Oc(), o = Dc(), s = Z({
			get: () => a.query.scope === "profile" ? "profile" : "all",
			set: (e) => {
				o.replace({ query: {
					...a.query,
					scope: e
				} });
			}
		});
		return (e, a) => (G(), q(Lx, {
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
}), zx = {
	class: "min-h-0 flex-1 overflow-y-auto px-5 py-6",
	"aria-label": "Artifacts"
}, Bx = { class: "mx-auto max-w-[1100px]" }, Vx = { class: "mb-5 flex items-center justify-between" }, Hx = ["disabled"], Ux = {
	key: 0,
	role: "status",
	class: "text-sm text-[#b4b4b4]"
}, Wx = {
	key: 1,
	role: "alert",
	class: "mb-4 text-sm text-red-200"
}, Gx = {
	key: 2,
	class: "text-sm text-[#b4b4b4]"
}, Kx = { class: "grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-4 [&>.artifact-card]:my-0" }, qx = { class: "border-t border-[#424242] px-3 py-2 text-xs text-[#b4b4b4]" }, Jx = {
	key: 0,
	class: "mb-1 block truncate"
}, Yx = { class: "flex min-w-0 items-center gap-3" }, Xx = { class: "shrink-0" }, Zx = ["title", "onClick"], Qx = ["aria-label", "onClick"], $x = ["disabled"], eS = { key: 0 }, tS = { class: "mb-3 break-words" }, nS = { class: "flex justify-end gap-4" }, rS = ["disabled"], iS = ["disabled"], aS = /* @__PURE__ */ H({
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
		In(s, async (e) => {
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
		return In([() => n.profile, () => n.project?.id], () => f(), { immediate: !0 }), ur(() => d?.abort()), (t, n) => (G(), K("section", zx, [J("div", Bx, [
			J("div", Vx, [n[5] ||= J("h2", { class: "text-xl font-medium" }, "Artifacts", -1), J("button", {
				class: "text-sm underline",
				disabled: a.value,
				onClick: n[0] ||= (e) => f()
			}, "Refresh", 8, Hx)]),
			a.value ? (G(), K("p", Ux, "Loading artifacts…")) : X("v-if", !0),
			o.value ? (G(), K("p", Wx, R(o.value), 1)) : X("v-if", !0),
			!a.value && !i.value.length ? (G(), K("p", Gx, "No artifacts found.")) : X("v-if", !0),
			J("div", Kx, [(G(!0), K(W, null, U(i.value, (t) => (G(), q(Zy, {
				key: `${t.sessionId}:${t.path}`,
				file: t,
				profile: e.profile
			}, {
				footer: An(() => [J("div", qx, [t.projectTitle ? (G(), K("span", Jx, R(t.projectTitle), 1)) : X("v-if", !0), J("div", Yx, [
					J("span", Xx, R(t.direction === "uploaded" ? "Uploaded" : "Generated"), 1),
					J("button", {
						type: "button",
						class: "min-w-0 flex-1 truncate py-2 text-left underline",
						title: t.sessionTitle,
						onClick: (e) => r("openSession", t.sessionId)
					}, R(t.sessionTitle), 9, Zx),
					/^(https?:|data:)|^\/api\/plugins\/chathermes\/artifact-images\//.test(t.path) ? X("v-if", !0) : (G(), K("button", {
						key: 0,
						type: "button",
						class: "shrink-0 py-2 hover:text-white",
						"aria-label": `Delete ${t.name}`,
						onClick: (e) => s.value = t
					}, " Delete ", 8, Qx))
				])])]),
				_: 2
			}, 1032, ["file", "profile"]))), 128))]),
			u.value ? (G(), K("button", {
				key: 3,
				type: "button",
				class: "my-6 rounded-full border border-[#555] px-5 py-2 text-sm",
				disabled: a.value,
				onClick: n[1] ||= (e) => f(!0)
			}, R(a.value ? "Loading…" : "Load More"), 9, $x)) : X("v-if", !0),
			J("dialog", {
				ref_key: "confirmation",
				ref: l,
				class: "fixed m-auto w-[min(380px,94vw)] rounded-2xl bg-[#303030] p-5 text-white backdrop:bg-black/80",
				"aria-label": "Delete artifact",
				onCancel: n[3] ||= (e) => c.value && e.preventDefault(),
				onClose: n[4] ||= (e) => s.value = void 0
			}, [s.value ? (G(), K("div", eS, [
				J("h3", tS, "Delete " + R(s.value.name) + " from Hermes?", 1),
				n[6] ||= J("p", { class: "mb-5 text-sm text-[#b4b4b4]" }, " This removes the server file. References in conversation history remain. ", -1),
				J("div", nS, [J("button", {
					autofocus: "",
					disabled: c.value,
					onClick: n[2] ||= (e) => s.value = void 0
				}, "Cancel", 8, rS), J("button", {
					disabled: c.value,
					onClick: p
				}, R(c.value ? "Deleting…" : "Delete file"), 9, iS)])
			])) : X("v-if", !0)], 544)
		])]));
	}
}), oS = /* @__PURE__ */ H({
	__name: "ArtifactsPage",
	setup(e) {
		let { profile: t, projects: n, recentSession: r } = xg();
		return (e, i) => (G(), q(aS, {
			profile: B(t),
			projects: B(n),
			onOpenSession: B(r)
		}, null, 8, [
			"profile",
			"projects",
			"onOpenSession"
		]));
	}
}), sS = {
	class: "projects-page page-content",
	"aria-label": "Projects"
}, cS = { class: "page-heading" }, lS = ["disabled"], uS = {
	key: 0,
	class: "project-muted"
}, dS = { class: "project-actions" }, fS = ["disabled"], pS = ["disabled"], mS = {
	key: 2,
	role: "alert",
	class: "project-error"
}, hS = {
	key: 3,
	role: "status",
	class: "project-muted"
}, gS = {
	key: 4,
	class: "project-muted"
}, _S = {
	class: "project-list",
	"aria-label": "Project list"
}, vS = ["aria-label", "onClick"], yS = /* @__PURE__ */ H({
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
		let n = e, r = t, i = Z(() => n.projects.filter((e) => !e.isNoProject && !!e.archived === n.archived)), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(""), s = /* @__PURE__ */ z("");
		function c() {
			o.value.trim() && r("manage", "create", {
				name: o.value.trim(),
				...s.value.trim() ? { primary_path: s.value.trim() } : {}
			});
		}
		return (t, n) => (G(), K("section", sS, [
			J("div", cS, [n[5] ||= J("h2", null, "Projects", -1), e.archived ? X("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: n[0] ||= (e) => a.value = !a.value
			}, " New project ", 8, lS))]),
			e.archived ? (G(), K("p", uS, "Archived projects")) : X("v-if", !0),
			a.value && !e.archived ? (G(), K("form", {
				key: 1,
				class: "project-form",
				onSubmit: Do(c, ["prevent"])
			}, [
				J("label", null, [n[6] ||= Y("Project name", -1), V(J("input", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					required: "",
					maxlength: "160",
					autofocus: ""
				}, null, 512), [[_o, o.value]])]),
				J("label", null, [n[7] ||= Y("Folder (optional)", -1), V(J("input", {
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					placeholder: "/path/on/hermes/server"
				}, null, 512), [[_o, s.value]])]),
				J("div", dS, [J("button", {
					class: "project-button",
					disabled: e.busy || e.offline || !o.value.trim()
				}, " Create project", 8, fS), J("button", {
					type: "button",
					class: "project-button",
					disabled: e.busy,
					onClick: n[3] ||= (e) => a.value = !1
				}, " Cancel ", 8, pS)])
			], 32)) : X("v-if", !0),
			e.error ? (G(), K("p", mS, [Y(R(e.error) + " ", 1), J("button", {
				class: "underline",
				onClick: n[4] ||= (e) => r("retry")
			}, "Retry Projects")])) : X("v-if", !0),
			e.loading ? (G(), K("p", hS, "Loading Projects…")) : i.value.length ? X("v-if", !0) : (G(), K("p", gS, R(e.archived ? "No archived projects." : "No projects yet."), 1)),
			J("nav", _S, [(G(!0), K(W, null, U(i.value, (e) => (G(), K("button", {
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
				J("span", null, [J("strong", null, R(e.label), 1), J("small", null, R(e.archived ? "Archived" : e.isAuto ? "Discovered workspace" : `${e.sessionCount} ${e.sessionCount === 1 ? "chat" : "chats"}`), 1)]),
				n[9] ||= J("span", { "aria-hidden": "true" }, "›", -1)
			], 8, vS))), 128))])
		]));
	}
}), bS = /* @__PURE__ */ H({
	__name: "ProjectsPage",
	setup(e) {
		let { projects: t, projectsLoading: n, projectsError: r, manageError: i, projectBusy: a, offline: o, chooseProject: s, loadProjects: c, manageProject: l } = Dg(), u = Oc(), d = Z(() => u.query.archived === "1");
		return (e, u) => (G(), q(yS, {
			projects: B(t),
			archived: d.value,
			loading: B(n),
			error: B(r) || B(i),
			busy: B(a),
			offline: B(o),
			onSelect: B(s),
			onRetry: B(c),
			onManage: B(l)
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
}), xS = {
	class: "project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10",
	"aria-label": "Selected Project"
}, SS = { class: "project-home-content" }, CS = {
	key: 0,
	role: "status"
}, wS = {
	key: 1,
	class: "mb-4 text-[#fecaca]",
	role: "alert"
}, TS = {
	class: "mb-5 flex gap-5 text-sm",
	"aria-label": "Project view"
}, ES = ["aria-pressed"], DS = ["aria-pressed"], OS = /* @__PURE__ */ H({
	__name: "ProjectLayout",
	setup(e) {
		let { selectedProject: t, projectLoading: n, projectError: r, loadProject: i, showProjects: a } = Dg(), o = Oc(), s = Dc();
		return (e, c) => (G(), K("section", xS, [J("div", SS, [
			J("button", {
				class: "project-back",
				onClick: c[0] ||= (e) => B(a)(!!B(t)?.archived)
			}, " ← Projects "),
			B(n) ? (G(), K("p", CS, "Loading Project…")) : X("v-if", !0),
			B(r) ? (G(), K("p", wS, [Y(R(B(r)) + " ", 1), J("button", {
				class: "underline",
				onClick: c[1] ||= (...e) => B(i) && B(i)(...e)
			}, "Retry Project")])) : X("v-if", !0),
			B(t) ? (G(), K(W, { key: 2 }, [J("nav", TS, [J("button", {
				"aria-pressed": B(o).name === "project",
				onClick: c[2] ||= (e) => B(s).push({
					name: "project",
					params: B(o).params,
					query: B(o).query
				})
			}, " Sessions / Chat ", 8, ES), J("button", {
				"aria-pressed": B(o).name === "project-artifacts",
				onClick: c[3] ||= (e) => B(s).push({
					name: "project-artifacts",
					params: B(o).params,
					query: B(o).query
				})
			}, " Artifacts ", 8, DS)]), vr(e.$slots, "default")], 64)) : X("v-if", !0)
		])]));
	}
}), kS = {
	key: 0,
	class: "project-muted"
}, AS = { class: "mb-4 break-all text-sm text-[#a3a3a3]" }, jS = {
	key: 1,
	class: "text-sm text-[#b4b4b4]"
}, MS = {
	class: "project-chat-list",
	"aria-label": "Project chats"
}, NS = ["aria-label", "onClick"], PS = { class: "project-chat-title" }, FS = {
	key: 0,
	class: "project-chat-preview"
}, IS = /* @__PURE__ */ H({
	__name: "ProjectHomePage",
	setup(e) {
		let { selectedProject: t, visibleSessions: n, chooseSession: r, chooseProject: i } = Dg();
		return (e, a) => (G(), q(OS, null, {
			default: An(() => [B(t) ? (G(), K(W, { key: 0 }, [
				B(t).archived ? (G(), K("p", kS, "Archived project")) : X("v-if", !0),
				J("p", AS, R(B(vl)(B(t)) ? "Workspace: " + B(vl)(B(t)) : B(t).isNoProject ? "No project workspace" : "No workspace configured"), 1),
				B(n).length ? X("v-if", !0) : (G(), K("p", jS, "No conversations yet.")),
				J("nav", MS, [(G(!0), K(W, null, U(B(n), (e) => (G(), K("button", {
					key: e.id,
					class: "project-chat-row",
					"aria-label": e.title || "Untitled session",
					onClick: (t) => B(r)(e.id)
				}, [J("span", PS, R(e.title || "Untitled session"), 1), e.preview?.trim() ? (G(), K("span", FS, R(e.preview), 1)) : X("v-if", !0)], 8, NS))), 128))]),
				J("button", {
					class: "project-back mt-5",
					onClick: a[0] ||= (e) => B(i)("")
				}, "Other chats")
			], 64)) : X("v-if", !0)]),
			_: 1
		}));
	}
}), LS = /* @__PURE__ */ H({
	__name: "ProjectArtifactsPage",
	setup(e) {
		let { selectedProject: t, profile: n, visibleSessions: r, recentSession: i } = Dg();
		return (e, a) => (G(), q(OS, null, {
			default: An(() => [B(t) ? (G(), q(aS, {
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
			])) : X("v-if", !0)]),
			_: 1
		}));
	}
}), RS = {
	key: 0,
	class: "project-settings"
}, zS = ["disabled"], BS = {
	key: 0,
	class: "project-error",
	role: "alert"
}, VS = {
	key: 1,
	class: "project-muted",
	role: "status"
}, HS = ["disabled"], US = { class: "project-field-row" }, WS = ["disabled"], GS = {
	key: 2,
	class: "project-muted"
}, KS = { class: "project-folders" }, qS = { class: "folder-path" }, JS = { key: 0 }, YS = { key: 1 }, XS = { class: "project-actions" }, ZS = ["disabled", "onClick"], QS = [
	"disabled",
	"aria-label",
	"onClick"
], $S = ["disabled"], eC = { class: "project-checkbox" }, tC = ["disabled"], nC = { id: "project-confirm-text" }, rC = { class: "project-actions" }, iC = ["disabled"], aC = ["disabled"], oC = /* @__PURE__ */ H({
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
		In(() => n.busy, (e, t) => {
			t && !e && !n.error && _();
		}), In(() => n.project.label, (e) => {
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
		return (t, n) => e.project.isAuto ? (G(), K("div", RS, [n[12] ||= J("p", { class: "project-muted" }, " Save this discovered workspace as a project to manage its name and folders. ", -1), J("button", {
			class: "project-button",
			disabled: e.busy || e.offline,
			onClick: n[0] ||= (t) => r("manage", "create", {
				name: e.project.label,
				primary_path: e.project.path || e.project.repos.find((e) => e.path)?.path || ""
			})
		}, " Save project ", 8, zS)])) : e.project.isNoProject ? X("v-if", !0) : (G(), K("div", {
			key: 1,
			ref_key: "settings",
			ref: m,
			tabindex: "-1",
			class: "project-settings"
		}, [
			e.error ? (G(), K("p", BS, R(e.error), 1)) : X("v-if", !0),
			e.busy ? (G(), K("p", VS, "Saving project…")) : X("v-if", !0),
			J("form", {
				class: "project-form",
				onSubmit: n[6] ||= Do((e) => h("update", {
					name: i.value.trim(),
					description: a.value,
					icon: o.value,
					color: s.value,
					board_slug: c.value
				}), ["prevent"])
			}, [J("fieldset", { disabled: e.busy || e.offline }, [
				J("label", null, [n[13] ||= Y("Project name", -1), V(J("input", {
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					required: "",
					maxlength: "160"
				}, null, 512), [[_o, i.value]])]),
				J("label", null, [n[14] ||= Y("Description", -1), V(J("textarea", {
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					maxlength: "4096",
					rows: "2"
				}, null, 512), [[_o, a.value]])]),
				J("div", US, [J("label", null, [n[15] ||= Y("Icon", -1), V(J("input", {
					"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
					maxlength: "64"
				}, null, 512), [[_o, o.value]])]), J("label", null, [n[16] ||= Y("Color", -1), V(J("input", {
					"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
					maxlength: "64",
					placeholder: "#94c9a5"
				}, null, 512), [[_o, s.value]])])]),
				J("label", null, [n[17] ||= Y("Board slug (optional)", -1), V(J("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					maxlength: "160"
				}, null, 512), [[_o, c.value]])]),
				J("button", {
					class: "project-button",
					disabled: !i.value.trim()
				}, "Save changes", 8, WS)
			], 8, HS)], 32),
			n[21] ||= J("h3", null, "Folders", -1),
			n[22] ||= J("p", { class: "project-muted" }, " The primary folder is used for new chats. Existing chats keep their workspace. ", -1),
			e.project.folders?.length ? X("v-if", !0) : (G(), K("p", GS, "No folders configured.")),
			J("ul", KS, [(G(!0), K(W, null, U(e.project.folders, (t) => (G(), K("li", { key: t.path }, [J("span", qS, [
				Y(R(t.label || t.path), 1),
				t.label ? (G(), K("small", JS, R(t.path), 1)) : X("v-if", !0),
				t.is_primary ? (G(), K("small", YS, "Primary folder")) : X("v-if", !0)
			]), J("div", XS, [t.is_primary ? X("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: (e) => h("set_primary", { path: t.path })
			}, " Make primary", 8, ZS)), J("button", {
				class: "project-button",
				disabled: e.busy || e.offline,
				"aria-label": `Remove folder ${t.path}`,
				onClick: (e) => g("remove_folder", { path: t.path }, `Remove ${t.path} from this project? The folder and existing chats will be kept.`)
			}, " Remove ", 8, QS)])]))), 128))]),
			J("form", {
				class: "project-form",
				onSubmit: n[10] ||= Do((e) => h("add_folder", {
					path: l.value.trim(),
					label: u.value.trim(),
					is_primary: d.value
				}), ["prevent"])
			}, [J("fieldset", { disabled: e.busy || e.offline }, [
				J("label", null, [n[18] ||= Y("Folder path", -1), V(J("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					required: "",
					placeholder: "/path/on/hermes/server",
					maxlength: "4096"
				}, null, 512), [[_o, l.value]])]),
				J("label", null, [n[19] ||= Y("Folder label (optional)", -1), V(J("input", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					maxlength: "160"
				}, null, 512), [[_o, u.value]])]),
				J("label", eC, [V(J("input", {
					"onUpdate:modelValue": n[9] ||= (e) => d.value = e,
					type: "checkbox"
				}, null, 512), [[vo, d.value]]), n[20] ||= Y(" Use as primary folder", -1)]),
				J("button", {
					class: "project-button",
					disabled: !l.value.trim()
				}, "Add folder", 8, tC)
			], 8, $S)], 32),
			f.value ? (G(), K("div", {
				key: 3,
				class: "project-confirmation",
				role: "alertdialog",
				"aria-modal": "false",
				"aria-labelledby": "project-confirm-text",
				onKeydown: n[11] ||= ko(Do((t) => !e.busy && _(), ["prevent"]), ["esc"])
			}, [J("p", nC, R(f.value.text), 1), J("div", rC, [J("button", {
				ref_key: "cancelButton",
				ref: p,
				class: "project-button",
				disabled: e.busy,
				onClick: _
			}, " Cancel", 8, iC), J("button", {
				class: "project-button project-danger",
				disabled: e.busy || e.offline,
				onClick: v
			}, " Confirm removal ", 8, aC)])], 32)) : X("v-if", !0)
		], 512));
	}
}), sC = {
	class: "page-content project-editor",
	"aria-label": "Edit project"
}, cC = {
	key: 0,
	role: "status"
}, lC = {
	key: 1,
	role: "alert"
}, uC = /* @__PURE__ */ H({
	__name: "ProjectSettingsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, projectBusy: i, offline: a, manageError: o, manageProject: s, chooseProject: c, projectLoading: l, projectError: u, loadProject: d } = Dg();
		return (e, f) => (G(), K("section", sC, [
			J("button", {
				class: "project-back",
				onClick: f[0] ||= (e) => B(c)(B(n))
			}, " ← " + R(B(r)?.label || "Project"), 1),
			f[2] ||= J("h2", { class: "text-2xl font-semibold" }, "Edit project", -1),
			B(l) ? (G(), K("p", cC, "Loading Project…")) : X("v-if", !0),
			B(u) ? (G(), K("p", lC, [Y(R(B(u)) + " ", 1), J("button", { onClick: f[1] ||= (...e) => B(d) && B(d)(...e) }, "Retry Project")])) : X("v-if", !0),
			B(r) ? (G(), q(oC, {
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
			])) : X("v-if", !0)
		]));
	}
}), dC = {
	key: 0,
	role: "status"
}, fC = {
	key: 1,
	role: "alert",
	class: "project-error"
}, pC = ["disabled"], mC = { key: 2 }, hC = { class: "project-muted" }, gC = ["disabled"], _C = {
	key: 3,
	role: "status",
	class: "project-muted"
}, vC = ["disabled"], yC = /* @__PURE__ */ H({
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
					d && (s.value = e instanceof il && e.status === 409 ? "Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading." : "Could not save instructions. Your draft is kept; try again.");
				} finally {
					d && (o.value = !1);
				}
			}
		}
		return sr(f), ur(() => {
			d = !1, u.abort();
		}), (t, i) => (G(), K("form", {
			class: "project-form instructions-form",
			onSubmit: Do(p, ["prevent"])
		}, [
			i[3] ||= J("p", { class: "project-muted" }, "Custom instructions guide Hermes when it works in this project.", -1),
			a.value ? (G(), K("p", dC, "Loading instructions…")) : X("v-if", !0),
			s.value ? (G(), K("p", fC, [Y(R(s.value) + " ", 1), J("button", {
				type: "button",
				class: "underline",
				disabled: a.value || o.value || e.offline,
				onClick: f
			}, " Reload instructions ", 8, pC)])) : X("v-if", !0),
			l.value ? (G(), K("label", mC, [
				i[2] ||= Y("Instructions ", -1),
				J("span", hC, R(r.value), 1),
				V(J("textarea", {
					"onUpdate:modelValue": i[0] ||= (e) => n.value = e,
					rows: "14",
					disabled: a.value || o.value,
					onInput: i[1] ||= (e) => c.value = !1
				}, null, 40, gC), [[_o, n.value]])
			])) : X("v-if", !0),
			c.value ? (G(), K("p", _C, "Instructions saved.")) : X("v-if", !0),
			J("button", {
				class: "project-button justify-self-start",
				disabled: !l.value || a.value || o.value || e.offline
			}, R(o.value ? "Saving…" : "Save instructions"), 9, vC)
		], 32));
	}
}), bC = {
	class: "page-content project-editor",
	"aria-label": "Edit Instructions"
}, xC = {
	key: 0,
	role: "status"
}, SC = {
	key: 1,
	role: "alert"
}, CC = /* @__PURE__ */ H({
	__name: "ProjectInstructionsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, offline: i, chooseProject: a, projectLoading: o, projectError: s, loadProject: c } = Dg();
		return (e, l) => (G(), K("section", bC, [
			J("button", {
				class: "project-back",
				onClick: l[0] ||= (e) => B(a)(B(n))
			}, " ← " + R(B(r)?.label || "Project"), 1),
			l[2] ||= J("h2", { class: "text-2xl font-semibold" }, "Edit Instructions", -1),
			B(o) ? (G(), K("p", xC, "Loading Project…")) : X("v-if", !0),
			B(s) ? (G(), K("p", SC, [Y(R(B(s)) + " ", 1), J("button", { onClick: l[1] ||= (...e) => B(c) && B(c)(...e) }, "Retry Project")])) : X("v-if", !0),
			B(r) ? (G(), q(yC, {
				key: JSON.stringify([B(t), B(r).id]),
				profile: B(t),
				"project-id": B(r).id,
				offline: B(i)
			}, null, 8, [
				"profile",
				"project-id",
				"offline"
			])) : X("v-if", !0)
		]));
	}
}), wC = { class: "scheduled-heading" }, TC = { class: "scheduled-heading-content" }, EC = { class: "page-heading" }, DC = {
	key: 0,
	class: "project-muted"
}, OC = {
	key: 1,
	role: "status",
	class: "project-muted"
}, kC = {
	key: 2,
	role: "alert",
	class: "project-error"
}, AC = /* @__PURE__ */ H({
	__name: "ScheduledHeading",
	props: {
		title: {},
		subtitle: {},
		loading: { type: Boolean },
		error: {}
	},
	emits: ["retry"],
	setup(e) {
		return (t, n) => (G(), K("div", wC, [J("div", TC, [
			J("div", EC, [J("h2", null, R(e.title || "Scheduled"), 1)]),
			vr(t.$slots, "default"),
			e.subtitle ? (G(), K("p", DC, R(e.subtitle), 1)) : X("v-if", !0),
			e.loading ? (G(), K("p", OC, "Loading scheduled history…")) : X("v-if", !0),
			e.error ? (G(), K("p", kC, [Y(R(e.error) + " ", 1), J("button", {
				class: "underline",
				onClick: n[0] ||= (e) => t.$emit("retry")
			}, "Retry")])) : X("v-if", !0)
		])]));
	}
}), jC = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, MC = { class: "scheduled-filter" }, NC = { class: "scheduled-content" }, PC = {
	key: 0,
	class: "project-muted"
}, FC = {
	class: "scheduled-list",
	"aria-label": "Scheduled jobs"
}, IC = ["onClick"], LC = /* @__PURE__ */ H({
	__name: "ScheduledListPage",
	setup(e) {
		let t = Oc(), n = Dc(), r = /* @__PURE__ */ z([]), i = Z({
			get: () => ["paused", "completed"].includes(String(t.query.status)) ? String(t.query.status) : "active",
			set: (e) => {
				n.replace({ query: {
					...t.query,
					status: e
				} });
			}
		}), a = Z(() => r.value.filter((e) => jg(e) === i.value)), { loading: o, error: s, retry: c } = Pg(async (e, t) => {
			r.value = [];
			let n = await Q.scheduled(t, e);
			if (!Array.isArray(n.jobs)) throw Error("Invalid jobs");
			e.aborted || (r.value = n.jobs);
		});
		return (e, r) => (G(), K("section", jC, [Ki(AC, {
			loading: B(o),
			error: B(s),
			onRetry: B(c)
		}, {
			default: An(() => [J("label", MC, [r[2] ||= Y("Show ", -1), V(J("select", {
				"onUpdate:modelValue": r[0] ||= (e) => i.value = e,
				"aria-label": "Job status"
			}, [...r[1] ||= [
				J("option", { value: "active" }, "Active", -1),
				J("option", { value: "paused" }, "Paused", -1),
				J("option", { value: "completed" }, "Completed", -1)
			]], 512), [[bo, i.value]])])]),
			_: 1
		}, 8, [
			"loading",
			"error",
			"onRetry"
		]), J("div", NC, [!B(o) && !B(s) && !a.value.length ? (G(), K("p", PC, " No " + R(i.value) + " scheduled jobs. ", 1)) : X("v-if", !0), J("nav", FC, [(G(!0), K(W, null, U(a.value, (e) => (G(), K("button", {
			key: e.id,
			class: "scheduled-job-row",
			onClick: (r) => B(n).push({
				name: "scheduled-job",
				params: { jobId: e.id },
				query: B(t).query
			})
		}, [J("span", null, [
			J("strong", null, R(e.name || e.id), 1),
			J("small", null, R(e.schedule_display || "Scheduled job"), 1),
			J("small", null, R(B(Ng)(e.last_run_at)), 1)
		]), r[3] ||= J("span", { "aria-hidden": "true" }, "›", -1)], 8, IC))), 128))])])]));
	}
}), RC = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, zC = { class: "scheduled-content" }, BC = {
	key: 0,
	class: "project-muted"
}, VC = {
	class: "scheduled-list",
	"aria-label": "Job runs"
}, HC = ["onClick"], UC = ["disabled"], WC = /* @__PURE__ */ H({
	__name: "ScheduledJobPage",
	setup(e) {
		let t = Oc(), n = Dc(), r = /* @__PURE__ */ z(), i = /* @__PURE__ */ z([]), a = /* @__PURE__ */ z(!1), o = /* @__PURE__ */ z(0), s = !1, { loading: c, error: l, retry: u } = Pg(async (e, t, n) => {
			let c = s;
			if (s = !1, !c) {
				r.value = void 0, i.value = [], o.value = 0, a.value = !1;
				let s = await Fg(t, n, e);
				if (e.aborted) return;
				r.value = s;
			}
			let l = await Q.scheduledRuns(t, n, c ? o.value : 0, e);
			e.aborted || (i.value = c ? [...i.value, ...l.runs.filter((e) => !i.value.some((t) => t.id === e.id))] : l.runs, o.value = l.offset + l.runs.length, a.value = l.has_more);
		});
		function d() {
			s = !0, u();
		}
		return (e, o) => (G(), K("section", RC, [Ki(AC, {
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
		]), J("div", zC, [
			!B(c) && !B(l) && !i.value.length ? (G(), K("p", BC, "No runs yet.")) : X("v-if", !0),
			J("nav", VC, [(G(!0), K(W, null, U(i.value, (e) => (G(), K("button", {
				key: e.id,
				onClick: (r) => B(n).push({
					name: "scheduled-run",
					params: {
						jobId: B(t).params.jobId,
						runId: e.id
					},
					query: B(t).query
				})
			}, [J("span", null, [
				J("strong", null, R(B(Mg)(e.started_at)), 1),
				J("small", null, R(e.title || "Job run"), 1),
				J("small", null, R(e.end_reason || (e.source === "cron_output" ? "Saved output" : e.ended_at ? "Finished" : "In progress")), 1)
			]), o[0] ||= J("span", { "aria-hidden": "true" }, "›", -1)], 8, HC))), 128))]),
			a.value ? (G(), K("button", {
				key: 1,
				class: "project-button",
				disabled: B(c),
				onClick: d
			}, " Load older runs ", 8, UC)) : X("v-if", !0)
		])]));
	}
}), GC = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, KC = {
	key: 1,
	class: "scheduled-content"
}, qC = {
	key: 0,
	class: "project-muted"
}, JC = /* @__PURE__ */ H({
	__name: "ScheduledRunPage",
	setup(e) {
		let t = Oc(), n = /* @__PURE__ */ z(), r = /* @__PURE__ */ z(), i = Pg(async (e, t, a, o) => {
			n.value = void 0, r.value = void 0;
			let s = await Fg(t, a, e);
			if (e.aborted) return;
			n.value = s;
			let c = await Q.scheduledOutput(t, a, o, e);
			e.aborted || (r.value = c, i.sessionId.value = c.session_id);
		}), { loading: a, error: o, retry: s } = i, c = Z(() => Ig(r.value));
		return (e, i) => (G(), K("section", GC, [Ki(AC, {
			title: n.value?.name || n.value?.id,
			subtitle: r.value ? B(Mg)(r.value.started_at || 0) : void 0,
			loading: B(a),
			error: B(o),
			onRetry: B(s)
		}, null, 8, [
			"title",
			"subtitle",
			"loading",
			"error",
			"onRetry"
		]), c.value.length ? (G(), q($b, {
			key: String(B(t).params.runId),
			"follow-initially": !1,
			messages: c.value,
			draft: "",
			loading: !1,
			progress: []
		}, null, 8, ["messages"])) : (G(), K("div", KC, [r.value ? (G(), K("p", qC, "No output was saved for this run.")) : X("v-if", !0)]))]));
	}
}), YC = {
	class: "settings-page page-content",
	"aria-label": "Settings"
}, XC = { class: "settings-content" }, ZC = { class: "settings-heading" }, QC = {
	class: "settings-group",
	"aria-labelledby": "settings-profile-heading"
}, $C = { class: "settings-row" }, ew = ["value"], tw = ["value"], nw = ["value"], rw = {
	class: "settings-group",
	"aria-labelledby": "settings-app-heading"
}, iw = { class: "settings-row settings-notifications" }, aw = { class: "wake-lock-setting" }, ow = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, sw = ["checked"], cw = {
	key: 0,
	class: "mt-1 text-sm"
}, lw = {
	key: 0,
	class: "settings-row settings-notifications"
}, uw = { class: "flex min-h-[44px] items-center gap-3 text-base" }, dw = ["checked", "disabled"], fw = {
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, pw = ["disabled"], mw = {
	class: "settings-group",
	"aria-labelledby": "settings-notifications-heading"
}, hw = { class: "settings-row settings-notifications" }, gw = {
	class: "push-setting",
	"aria-labelledby": "notifications-heading"
}, _w = {
	id: "notifications-heading",
	class: "text-sm font-medium text-white"
}, vw = ["disabled"], yw = ["disabled"], bw = {
	key: 1,
	class: "mt-1 text-sm text-[#dcae6e]",
	role: "status"
}, xw = {
	key: 2,
	class: "mt-1 text-sm"
}, Sw = {
	key: 3,
	class: "mt-1 text-sm",
	role: "status"
}, Cw = {
	key: 4,
	class: "mt-1 text-sm"
}, ww = {
	key: 5,
	class: "mt-1 text-sm"
}, Tw = {
	key: 6,
	class: "mt-1 text-sm"
}, Ew = /* @__PURE__ */ H({
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
		return sr(() => r.value?.focus()), (t, i) => (G(), K("section", YC, [J("div", XC, [
			J("div", ZC, [J("h2", {
				ref_key: "heading",
				ref: r,
				tabindex: "-1",
				class: "text-2xl font-semibold"
			}, "Settings", 512), J("button", {
				class: "settings-close",
				"aria-label": "Close settings",
				onClick: i[0] ||= (e) => n("close")
			}, "×")]),
			i[14] ||= J("h3", {
				id: "settings-profile-heading",
				class: "settings-section-title"
			}, "Profile", -1),
			J("div", QC, [J("div", $C, [i[8] ||= Xi("<svg class=\"settings-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><circle cx=\"12\" cy=\"9\" r=\"3\"></circle><path d=\"M6 19c0-6 12-6 12 0\"></path></svg><label for=\"settings-profile\">Active profile</label>", 2), J("select", {
				id: "settings-profile",
				value: e.profile,
				onChange: i[1] ||= (e) => n("profile", e.target.value)
			}, [
				i[7] ||= J("option", { value: "" }, "Default profile", -1),
				e.profile && !e.profiles.some((t) => t.name === e.profile) ? (G(), K("option", {
					key: 0,
					value: e.profile
				}, R(e.profile), 9, tw)) : X("v-if", !0),
				(G(!0), K(W, null, U(e.profiles, (e) => (G(), K("option", {
					key: e.name,
					value: e.name
				}, R(e.name), 9, nw))), 128))
			], 40, ew)])]),
			i[15] ||= J("h3", {
				id: "settings-app-heading",
				class: "settings-section-title"
			}, "Global settings", -1),
			J("div", rw, [J("div", iw, [i[11] ||= J("svg", {
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
			}), J("path", { d: "M9 17h6" })], -1), J("div", aw, [
				i[10] ||= J("h3", {
					id: "wake-lock-heading",
					class: "text-sm font-medium text-white"
				}, "Keep Screen Awake", -1),
				J("label", ow, [J("input", {
					type: "checkbox",
					"aria-labelledby": "wake-lock-heading",
					checked: e.keepScreenAwake,
					onChange: i[2] ||= (e) => n("toggleWakeLock", e.target.checked)
				}, null, 40, sw), i[9] ||= Y(" Prevent the display from sleeping while ChatHermes is visible. ", -1)]),
				e.wakeLockAvailable ? X("v-if", !0) : (G(), K("p", cw, " Screen wake lock is unavailable in this browser. "))
			])]), e.kanban ? (G(), K("div", lw, [J("div", null, [
				J("label", uw, [J("input", {
					type: "checkbox",
					"aria-label": "Kanban Viewer",
					checked: e.kanban.enabled.value,
					disabled: !e.kanban.available.value || e.kanban.checking.value,
					onChange: i[3] ||= (t) => e.kanban.setEnabled(t.target.checked)
				}, null, 40, dw), i[12] ||= Y(" Kanban Viewer ", -1)]),
				J("p", fw, R(e.kanban.checking.value ? "Checking Hermes Kanban…" : e.kanban.available.value ? "Show the Hermes Kanban board in navigation." : "Hermes Kanban is inactive or its authenticated API is unavailable."), 1),
				J("button", {
					class: "min-h-[44px] underline",
					disabled: e.kanban.checking.value,
					onClick: i[4] ||= (t) => e.kanban.check()
				}, " Recheck availability ", 8, pw)
			])])) : X("v-if", !0)]),
			i[16] ||= J("h3", {
				id: "settings-notifications-heading",
				class: "settings-section-title"
			}, "Notifications", -1),
			J("div", mw, [J("div", hw, [i[13] ||= J("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [J("path", { d: "M5 16h14l-2-3V9a5 5 0 0 0-10 0v4l-2 3Z" }), J("path", { d: "M10 19a2 2 0 0 0 4 0" })], -1), J("div", gw, [
				J("h3", _w, " Notifications for " + R(e.profile || "default"), 1),
				J("button", {
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.supported || !e.pushState.subscribed && !e.pushState.available,
					onClick: i[5] ||= (e) => n("togglePush")
				}, R(e.pushLoading ? "Loading…" : e.pushBusy ? "Updating…" : e.pushState.subscribed ? "Disable notifications" : "Enable notifications"), 9, vw),
				e.pushState.subscribed ? (G(), K("button", {
					key: 0,
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.available,
					onClick: i[6] ||= (e) => n("testPush")
				}, " Send test ", 8, yw)) : X("v-if", !0),
				e.pushState.error || e.pushMessage ? (G(), K("p", bw, R(e.pushMessage || e.pushState.error), 1)) : e.pushState.subscribed ? (G(), K("p", xw, " Notifications enabled for " + R(e.profile || "default") + " on this device. ", 1)) : e.pushLoading ? (G(), K("p", Sw, " Loading profile notification status… ")) : e.pushState.supported ? e.pushState.permission === "denied" ? (G(), K("p", ww, " Allow notifications in browser settings to enable them. ")) : (G(), K("p", Tw, " Notifications disabled for " + R(e.profile || "default") + " on this device. ", 1)) : (G(), K("p", Cw, " Install ChatHermes on a secure HTTPS origin to enable notifications. "))
			])])])
		])]));
	}
}), Dw = /* @__PURE__ */ H({
	__name: "SettingsPage",
	setup(e) {
		let { profile: t, profiles: n, pushState: r, pushBusy: i, pushLoading: a, pushMessage: o, wakeLock: s, kanban: c, chooseProfile: l, togglePush: u, testPush: d, closeSettings: f } = wg();
		return (e, p) => (G(), q(Ew, {
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
}), Ow = "chathermes";
function kw() {
	let e = [], t = !1, n = !1, r = () => El(window.location.href) || "/", i = r(), a = () => window.history.state?.[Ow], o = a()?.position ?? 0, s = a()?.state ?? {}, c = () => {
		let e = new URL(window.location.href);
		return e.pathname + e.search;
	}, l = (e, t, r) => {
		if (n || window.location.pathname !== "/chathermes") return;
		let a = { ...window.history.state };
		r || (typeof a.idx == "number" && a.idx++, typeof a.key == "string" && (a.key = Math.random().toString(36).slice(2, 10)), o++), s = {
			...t,
			position: o
		}, a[Ow] = {
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
var Aw = ["disabled"], jw = ["disabled"], Mw = ["disabled"], Nw = ["disabled"], Pw = ["disabled"], Fw = /* @__PURE__ */ H({
	__name: "ProjectActions",
	setup(e) {
		let { selectedProject: t, profile: n, projectId: r, projectBusy: i, offline: a, manageProject: o, createSession: s, creating: c, projectConfirmation: l } = Dg(), u = Oc(), d = Dc();
		function f(e) {
			return d.push({
				name: e === "edit" ? "project-settings" : "project-instructions",
				params: { projectId: r.value },
				query: {
					...u.query,
					...n.value ? { profile: n.value } : {}
				}
			});
		}
		function p(e) {
			l.value = e;
		}
		return (e, n) => B(t) && !B(t).isNoProject ? (G(), K(W, { key: 0 }, [
			B(t) && !B(t).isNoProject ? (G(), K("button", {
				key: 0,
				class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
				role: "menuitem",
				disabled: B(a) || B(c) || !B(t) || B(t).archived || !B(vl)(B(t)),
				onClick: n[0] ||= (e) => B(s)()
			}, " New Project Chat ", 8, Aw)) : X("v-if", !0),
			J("button", {
				role: "menuitem",
				onClick: n[1] ||= (e) => f("edit")
			}, "Edit project"),
			J("button", {
				role: "menuitem",
				disabled: B(a) || !B(vl)(B(t)),
				onClick: n[2] ||= (e) => f("instructions")
			}, " Edit Instructions ", 8, jw),
			B(t).isAuto ? X("v-if", !0) : (G(), K(W, { key: 1 }, [B(t).archived ? (G(), K("button", {
				key: 0,
				role: "menuitem",
				disabled: B(i) || B(a),
				onClick: n[3] ||= (e) => B(o)("archive", {
					id: B(r),
					restore: !0
				})
			}, " Restore project ", 8, Mw)) : (G(), K("button", {
				key: 1,
				role: "menuitem",
				disabled: B(i) || B(a),
				onClick: n[4] ||= (e) => p("archive")
			}, " Archive project ", 8, Nw)), J("button", {
				class: "project-danger",
				role: "menuitem",
				disabled: B(i) || B(a),
				onClick: n[5] ||= (e) => p("delete")
			}, " Delete project ", 8, Pw)], 64))
		], 64)) : X("v-if", !0);
	}
}), Iw = ["aria-checked"], Lw = ["aria-checked"], Rw = /* @__PURE__ */ H({
	__name: "ProjectsActions",
	setup(e) {
		let t = Oc(), n = Z(() => t.query.archived === "1"), { showProjects: r } = Dg();
		return (e, t) => (G(), K(W, null, [J("button", {
			role: "menuitemradio",
			"aria-checked": !n.value,
			onClick: t[0] ||= (e) => B(r)(!1)
		}, " Active projects", 8, Iw), J("button", {
			role: "menuitemradio",
			"aria-checked": n.value,
			onClick: t[1] ||= (e) => B(r)(!0)
		}, " Archived projects ", 8, Lw)], 64));
	}
}), zw = ["disabled"], Bw = ["disabled"], Vw = /* @__PURE__ */ H({
	__name: "ScheduledActions",
	setup(e) {
		let { current: t, offline: n, creating: r, recentSession: i } = Ag();
		return (e, a) => (G(), K(W, null, [J("button", {
			role: "menuitem",
			"data-test": "refresh-scheduled",
			disabled: !B(t) || B(t).loading.value,
			onClick: a[0] ||= (e) => B(t)?.retry()
		}, " Refresh", 8, zw), B(t)?.sessionId.value ? (G(), K("button", {
			key: 0,
			role: "menuitem",
			"data-test": "resume-scheduled-session",
			disabled: B(n) || B(r) || B(t).loading.value,
			onClick: a[1] ||= (e) => B(i)(B(t).sessionId.value)
		}, " Resume Session ", 8, Bw)) : X("v-if", !0)], 64));
	}
});
//#endregion
//#region src/router/index.ts
function Hw(e = kw(), t) {
	let n = Ec({
		history: e,
		routes: [
			{
				path: "/",
				name: "home",
				components: { default: yx },
				meta: { chat: !0 }
			},
			{
				path: "/chat/:sessionId",
				name: "chat",
				components: {
					default: bx,
					actions: Fw,
					dialogs: iy
				},
				meta: { chat: !0 }
			},
			{
				path: "/inbox",
				name: "inbox",
				components: {
					default: Rx,
					actions: Qv
				},
				meta: { title: "Inbox" }
			},
			{
				path: "/artifacts",
				name: "artifacts",
				components: { default: oS },
				meta: {
					title: "Artifacts",
					hideComposer: !0
				}
			},
			{
				path: "/projects",
				name: "projects",
				components: {
					default: bS,
					actions: Rw
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
					default: IS,
					actions: Fw,
					dialogs: iy
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
					default: LS,
					actions: Fw,
					dialogs: iy
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
					default: uC,
					actions: Fw,
					dialogs: iy
				},
				meta: { section: "projects" }
			},
			{
				path: "/projects/:projectId/instructions",
				name: "project-instructions",
				components: {
					default: CC,
					actions: Fw,
					dialogs: iy
				},
				meta: { section: "projects" }
			},
			{
				path: "/scheduled",
				name: "scheduled",
				components: {
					default: LC,
					actions: Vw
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
					default: WC,
					actions: Vw
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
					default: JC,
					actions: Vw
				},
				meta: {
					title: "Scheduled",
					section: "scheduled"
				}
			},
			{
				path: "/settings",
				name: "settings",
				components: { default: Dw },
				meta: {
					title: "Settings",
					hideComposer: !0
				}
			},
			{
				path: "/kanban",
				name: "kanban",
				components: {
					default: Yv,
					actions: Zv
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
		let t = Cl(e.query.profile);
		if (e.query.profile && typeof e.query.profile != "string" || t && !Sl.test(t) || Object.entries(e.params).some(([e, t]) => e === "projectId" ? !xl(t) : typeof t != "string" || !bl.test(t)) || e.query.project && !xl(e.query.project) || [e.query.session].some((e) => e && (typeof e != "string" || !bl.test(e)))) return { name: "home" };
		if (e.name === "settings" && e.query.return_to && wl(e.query.return_to) !== e.query.return_to) return {
			name: "settings",
			query: {
				...e.query,
				return_to: "/"
			},
			replace: !0
		};
	});
	let r = t && El(t);
	return r && e.replace(r), n;
}
//#endregion
//#region src/main.ts
function Uw(e) {
	return No(T_).use(Hw(void 0, e));
}
//#endregion
export { T_ as App, Uw as createChatHermesApp };
