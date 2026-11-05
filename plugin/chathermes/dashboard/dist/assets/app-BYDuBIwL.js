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
function de(e) {
	let t = "";
	if (v(e)) t = e;
	else if (p(e)) for (let n = 0; n < e.length; n++) {
		let r = de(e[n]);
		r && (t += r + " ");
	}
	else if (b(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var fe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", F = /* @__PURE__ */ n(fe);
fe + "";
function I(e) {
	return !!e || e === "";
}
function pe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = _e(e[i], t[i], n);
	return r;
}
function me(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && _e(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function he(e, t, n) {
	let r = m(e), i = m(t);
	if (r || i || (r = h(e), i = h(t), r || i)) return r && i ? me(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !_e(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ge(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function _e(e, t, n) {
	if (e === t) return !0;
	let r = g(e), i = g(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = y(e), i = y(t), r || i ? e === t : (r = p(e), i = p(t), r || i ? r && i ? ge(e, t, n, pe) : !1 : (r = b(e), i = b(t), r || i ? !r || !i ? !1 : ge(e, t, n, he) : String(e) === String(t))));
}
function ve(e, t) {
	return e.findIndex((e) => _e(e, t));
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
var Ee, De = /* @__PURE__ */ new WeakSet(), Oe = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Se && (Se.active ? Se.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, De.has(this) && (De.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Me(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ge(this), Fe(this);
		let e = Ee, t = Ve;
		Ee = this, Ve = !0;
		try {
			return this.fn();
		} finally {
			Ie(this), Ee = e, Ve = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ze(e);
			this.deps = this.depsTail = void 0, Ge(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? De.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Le(this) && this.run();
	}
	get dirty() {
		return Le(this);
	}
}, ke = 0, Ae, je;
function Me(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = je, je = e;
		return;
	}
	e.next = Ae, Ae = e;
}
function Ne() {
	ke++;
}
function Pe() {
	if (--ke > 0) return;
	if (je) {
		let e = je;
		for (je = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ae;) {
		let t = Ae;
		for (Ae = void 0; t;) {
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
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ie(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ze(r), Be(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Le(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Re(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Re(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ke) || (e.globalVersion = Ke, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Le(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = Ee, r = Ve;
	Ee = e, Ve = !0;
	try {
		Fe(e);
		let n = e.fn(e._value);
		(t.version === 0 || N(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		Ee = n, Ve = r, Ie(e), e.flags &= -3;
	}
}
function ze(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ze(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Be(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ve = !0, He = [];
function Ue() {
	He.push(Ve), Ve = !1;
}
function We() {
	let e = He.pop();
	Ve = e === void 0 || e;
}
function Ge(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = Ee;
		Ee = void 0;
		try {
			t();
		} finally {
			Ee = e;
		}
	}
}
var Ke = 0, qe = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Je = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!Ee || !Ve || Ee === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== Ee) t = this.activeLink = new qe(Ee, this), Ee.deps ? (t.prevDep = Ee.depsTail, Ee.depsTail.nextDep = t, Ee.depsTail = t) : Ee.deps = Ee.depsTail = t, Ye(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = Ee.depsTail, t.nextDep = void 0, Ee.depsTail.nextDep = t, Ee.depsTail = t, Ee.deps === t && (Ee.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ke++, this.notify(e);
	}
	notify(e) {
		Ne();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Pe();
		}
	}
};
function Ye(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ye(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Xe = /* @__PURE__ */ new WeakMap(), Ze = /* @__PURE__ */ Symbol(""), Qe = /* @__PURE__ */ Symbol(""), $e = /* @__PURE__ */ Symbol("");
function et(e, t, n) {
	if (Ve && Ee) {
		let t = Xe.get(e);
		t || Xe.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Je()), r.map = t, r.key = n), r.track();
	}
}
function tt(e, t, n, r, i, a) {
	let o = Xe.get(e);
	if (!o) {
		Ke++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ne(), t === "clear") o.forEach(s);
	else {
		let i = p(e), a = i && E(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === $e || !y(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get($e)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Ze)), m(e) && s(o.get(Qe)));
				break;
			case "delete":
				i || (s(o.get(Ze)), m(e) && s(o.get(Qe)));
				break;
			case "set": m(e) && s(o.get(Ze));
		}
	}
	Pe();
}
function nt(e) {
	let t = /* @__PURE__ */ Ut(e);
	return t === e || (et(t, "iterate", $e), /* @__PURE__ */ Vt(e)) ? t : /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e) ? t.map((e) => Kt(Gt(e))) : t.map(Kt) : t.map(Gt);
}
function rt(e) {
	return et(e = /* @__PURE__ */ Ut(e), "iterate", $e), e;
}
function it(e, t) {
	return /* @__PURE__ */ Bt(e) ? Kt(/* @__PURE__ */ zt(e) ? Gt(t) : t) : Gt(t);
}
var at = {
	__proto__: null,
	[Symbol.iterator]() {
		return ot(this, Symbol.iterator, (e) => it(this, e));
	},
	concat(...e) {
		return nt(this).concat(...e.map((e) => p(e) ? nt(e) : e));
	},
	entries() {
		return ot(this, "entries", (e) => (e[1] = it(this, e[1]), e));
	},
	every(e, t) {
		return ct(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ct(this, "filter", e, t, (e) => e.map((e) => it(this, e)), arguments);
	},
	find(e, t) {
		return ct(this, "find", e, t, (e) => it(this, e), arguments);
	},
	findIndex(e, t) {
		return ct(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ct(this, "findLast", e, t, (e) => it(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ct(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ct(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ut(this, "includes", e);
	},
	indexOf(...e) {
		return ut(this, "indexOf", e);
	},
	join(e) {
		return nt(this).join(e);
	},
	lastIndexOf(...e) {
		return ut(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ct(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return dt(this, "pop");
	},
	push(...e) {
		return dt(this, "push", e);
	},
	reduce(e, ...t) {
		return lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return lt(this, "reduceRight", e, t);
	},
	shift() {
		return dt(this, "shift");
	},
	some(e, t) {
		return ct(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return dt(this, "splice", e);
	},
	toReversed() {
		return nt(this).toReversed();
	},
	toSorted(e) {
		return nt(this).toSorted(e);
	},
	toSpliced(...e) {
		return nt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return ot(this, "values", (e) => it(this, e));
	}
};
function ot(e, t, n) {
	let r = rt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Vt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var st = Array.prototype;
function ct(e, t, n, r, i, a) {
	let o = rt(e), s = o !== e && !/* @__PURE__ */ Vt(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? Gt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, it(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function lt(e, t, n, r) {
	let i = rt(e), a = i !== e && !/* @__PURE__ */ Vt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = it(e, t)), n.call(this, t, it(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? it(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ Ut(e);
	et(r, "iterate", $e);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ht(n[0]) ? (n[0] = /* @__PURE__ */ Ut(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	Ue(), Ne();
	let r = (/* @__PURE__ */ Ut(e))[t].apply(e, n);
	return Pe(), We(), r;
}
var ft = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function mt(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ Ut(this);
	return et(t, "has", e), t.hasOwnProperty(e);
}
var ht = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Nt : Mt : i ? jt : At).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = p(e);
		if (!r) {
			let e;
			if (a && (e = at[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ qt(e) ? e : n);
		if ((y(t) ? pt.has(t) : ft(t)) || (r || et(e, "get", t), i)) return o;
		if (/* @__PURE__ */ qt(o)) {
			let e = a && E(t) ? o : o.value;
			return r && b(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return b(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = p(e) && E(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Bt(i);
			if (!/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (i = /* @__PURE__ */ Ut(i), n = /* @__PURE__ */ Ut(n)), !a && /* @__PURE__ */ qt(i) && !/* @__PURE__ */ qt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ qt(e) ? e : r);
		return e === /* @__PURE__ */ Ut(r) && s && (o ? N(n, i) && tt(e, "set", t, n, i) : tt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = f(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && tt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!y(t) || !pt.has(t)) && et(e, "has", t), n;
	}
	ownKeys(e) {
		return et(e, "iterate", p(e) ? "length" : Ze), Reflect.ownKeys(e);
	}
}, _t = class extends ht {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new _t(), bt = /* @__PURE__ */ new gt(!0), xt = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ct(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ Ut(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? xt : t ? Kt : Gt;
		return !t && et(a, "iterate", c ? Qe : Ze), l(Object.create(u), { next() {
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
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ Ut(r), a = /* @__PURE__ */ Ut(n);
			e || (N(n, a) && et(i, "get", n), et(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Kt : Gt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && et(/* @__PURE__ */ Ut(t), "iterate", Ze), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Ut(n), i = /* @__PURE__ */ Ut(t);
			return e || (N(t, i) && et(r, "has", t), et(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Ut(a), s = t ? xt : e ? Kt : Gt;
			return !e && et(o, "iterate", Ze), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return l(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ Ut(this), r = St(n), i = /* @__PURE__ */ Ut(e), a = !t && !/* @__PURE__ */ Vt(e) && !/* @__PURE__ */ Bt(e) ? i : e;
			return r.has.call(n, a) || N(e, a) && r.has.call(n, e) || N(i, a) && r.has.call(n, i) || (n.add(a), tt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (n = /* @__PURE__ */ Ut(n));
			let r = /* @__PURE__ */ Ut(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Ut(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? N(n, s) && tt(r, "set", e, n, s) : tt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Ut(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Ut(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && tt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Ut(this), t = e.size !== 0, n = e.clear();
			return t && tt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ct(r, e, t);
	}), n;
}
function Et(e, t) {
	let n = Tt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(f(n, r) && r in t ? n : t, r, i);
}
var Dt = { get: /* @__PURE__ */ Et(!1, !1) }, Ot = { get: /* @__PURE__ */ Et(!1, !0) }, kt = { get: /* @__PURE__ */ Et(!0, !1) }, At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap();
function Pt(e) {
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
function Ft(e) {
	return /* @__PURE__ */ Bt(e) ? e : Rt(e, !1, vt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Rt(e, !1, bt, Ot, jt);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Rt(e, !0, yt, kt, Mt);
}
function Rt(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Ut(t) : e;
}
function Wt(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && re(e, "__v_skip", !0), e;
}
var Gt = (e) => b(e) ? /* @__PURE__ */ Ft(e) : e, Kt = (e) => b(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return Yt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return Yt(e, !0);
}
function Yt(e, t) {
	return /* @__PURE__ */ qt(e) ? e : new Xt(e, t);
}
var Xt = class {
	constructor(e, t) {
		this.dep = new Je(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Ut(e), this._value = t ? e : Gt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Bt(e);
		e = n ? e : /* @__PURE__ */ Ut(e), N(e, t) && (this._rawValue = e, this._value = n ? e : Gt(e), this.dep.trigger());
	}
};
function z(e) {
	return /* @__PURE__ */ qt(e) ? e.value : e;
}
var Zt = {
	get: (e, t, n) => t === "__v_raw" ? e : z(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ qt(i) && !/* @__PURE__ */ qt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Qt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, Zt);
}
var $t = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Je(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ke - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && Ee !== this) return Me(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Re(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function en(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new $t(r, i, n);
}
var tn = {}, nn = /* @__PURE__ */ new WeakMap(), rn = void 0;
function an(e, t = !1, n = rn) {
	if (n) {
		let t = nn.get(n);
		t || nn.set(n, t = []), t.push(e);
	}
}
function on(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ Vt(e) || o === !1 || o === 0 ? sn(e, 1) : sn(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ qt(e) ? (h = () => e.value, y = /* @__PURE__ */ Vt(e)) : /* @__PURE__ */ zt(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ zt(e) || /* @__PURE__ */ Vt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ qt(e)) return e.value;
		if (/* @__PURE__ */ zt(e)) return f(e);
		if (_(e)) return d ? d(e, 2) : e();
	})) : h = _(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (g) {
			Ue();
			try {
				g();
			} finally {
				We();
			}
		}
		let t = rn;
		rn = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			rn = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => sn(e(), t);
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
	let C = b ? Array(e.length).fill(tn) : tn, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => N(e, C[t])) : N(n, C))) {
					g && g();
					let e = rn;
					rn = m;
					try {
						let e = [
							n,
							C === tn ? void 0 : b && C[0] === tn ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						rn = e;
					}
				}
			} else m.run();
		}
	};
	return l && l(w), m = new Oe(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => an(e, !1, m), g = m.onStop = () => {
		let e = nn.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			nn.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function sn(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ qt(e)) sn(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) sn(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		sn(e, t, n);
	});
	else if (T(e)) {
		for (let r in e) sn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && sn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function cn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		un(e, t, n);
	}
}
function ln(e, t, n, r) {
	if (_(e)) {
		let i = cn(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			un(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(ln(e[a], t, n, r));
		return i;
	}
}
function un(e, t, n, i = !0) {
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
			Ue(), cn(o, null, 10, [
				e,
				i,
				a
			]), We();
			return;
		}
	}
	dn(e, n, a, i, s);
}
function dn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var fn = [], pn = -1, mn = [], hn = null, gn = 0, _n = /* @__PURE__ */ Promise.resolve(), vn = null;
function yn(e) {
	let t = vn || _n;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function bn(e) {
	let t = pn + 1, n = fn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = fn[r], a = En(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function xn(e) {
	if (!(e.flags & 1)) {
		let t = En(e), n = fn[fn.length - 1];
		!n || !(e.flags & 2) && t >= En(n) ? fn.push(e) : fn.splice(bn(t), 0, e), e.flags |= 1, Sn();
	}
}
function Sn() {
	vn ||= _n.then(Dn);
}
function Cn(e) {
	if (!p(e)) hn && e.id === -1 ? hn.splice(gn + 1, 0, e) : e.flags & 1 || (mn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) mn.push(e[t]);
	Sn();
}
function wn(e, t, n = pn + 1) {
	for (; n < fn.length; n++) {
		let t = fn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			fn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Tn(e) {
	if (mn.length) {
		let e = [...new Set(mn)].sort((e, t) => En(e) - En(t));
		if (mn.length = 0, hn) {
			for (let t = 0; t < e.length; t++) hn.push(e[t]);
			return;
		}
		for (hn = e, gn = 0; gn < hn.length; gn++) {
			let e = hn[gn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		hn = null, gn = 0;
	}
}
var En = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Dn(e) {
	try {
		for (pn = 0; pn < fn.length; pn++) {
			let e = fn[pn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), cn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; pn < fn.length; pn++) {
			let e = fn[pn];
			e && (e.flags &= -2);
		}
		pn = -1, fn.length = 0, Tn(e), vn = null, (fn.length || mn.length) && Dn(e);
	}
}
var On = null, kn = null;
function An(e) {
	let t = On;
	return On = e, kn = e && e.type.__scopeId || null, t;
}
function jn(e, t = On, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Vi(-1);
		let i = An(t), a = Li.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Li.length; e > a; e--) zi();
			An(i), r._d && Vi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function B(e, t) {
	if (On === null) return e;
	let n = ba(On), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && sn(o), i.push({
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
		c && (Ue(), ln(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), We());
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
	if (r || Wr) {
		let i = Wr ? Wr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
var Fn = /* @__PURE__ */ Symbol.for("v-scx"), In = () => Pn(Fn);
function Ln(e, t, n) {
	return Rn(e, t, n);
}
function Rn(e, t, n = r) {
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
	u.call = (e, t, n) => ln(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		xi(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : xn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = on(e, t, u);
	return pa && (f ? f.push(h) : d && h()), h;
}
function zn(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? Bn(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = ua(this), s = Rn(i, a.bind(r), n);
	return o(), s;
}
function Bn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Vn = /* @__PURE__ */ Symbol("_vte"), Hn = (e) => e.__isTeleport, Un = /* @__PURE__ */ Symbol("_leaveCb");
function Wn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Fi) {
			t = n;
			break;
		}
	}
	return t;
}
function Gn(e) {
	if (!er(e)) return Hn(e.type) && e.children ? Wn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && _(n.default)) return n.default();
	}
}
function Kn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Kn(Hn(n.type) && Gn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function V(e, t) {
	return _(e) ? /* @__PURE__ */ l({ name: e.name }, t, { setup: e }) : e;
}
function qn() {
	let e = sa();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Jn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Yn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Xn = /* @__PURE__ */ new WeakMap();
function Zn(e, t, n, i, a = !1) {
	if (p(e)) {
		e.forEach((e, r) => Zn(e, t && (p(t) ? t[r] : t), n, i, a));
		return;
	}
	if ($n(i) && !a) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && Zn(e, t, n, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ba(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ Ut(g), b = g === r ? o : (e) => !Yn(h, e) && f(y, e), x = (e, t) => !(t && Yn(h, t));
	if (m != null && m !== d) {
		if (Qn(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ qt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) cn(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ qt(d);
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
					i(), Xn.delete(e);
				};
				t.id = -1, Xn.set(e, t), xi(t, n);
			} else Qn(e), i();
		}
	}
}
function Qn(e) {
	let t = Xn.get(e);
	t && (t.flags |= 8, Xn.delete(e));
}
P().requestIdleCallback, P().cancelIdleCallback;
var $n = (e) => !!e.type.__asyncLoader, er = (e) => e.type.__isKeepAlive;
function tr(e, t) {
	rr(e, "a", t);
}
function nr(e, t) {
	rr(e, "da", t);
}
function rr(e, t, n = oa) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (ar(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) er(e.parent.vnode) && ir(r, t, n, e), e = e.parent;
	}
}
function ir(e, t, n, r) {
	let i = ar(t, e, r, !0);
	fr(() => {
		u(r[t], i);
	}, n);
}
function ar(e, t, n = oa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ue();
			let i = ua(n), a = ln(t, n, e, r);
			return i(), We(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var or = (e) => (t, n = oa) => {
	(!pa || e === "sp") && ar(e, (...e) => t(...e), n);
}, sr = or("bm"), cr = or("m"), lr = or("bu"), ur = or("u"), dr = or("bum"), fr = or("um"), pr = or("sp"), mr = or("rtg"), hr = or("rtc");
function gr(e, t = oa) {
	ar("ec", e, t);
}
var _r = /* @__PURE__ */ Symbol.for("v-ndc");
function H(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Vt(e), s = /* @__PURE__ */ Bt(e), e = rt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Kt(Gt(e[n])) : Gt(e[n]) : e[n], n, void 0, a && a[n]);
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
function vr(e, t) {
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
function yr(e, t, n, r, i, a) {
	if (n ??= {}, On.ce || On.parent && $n(On.parent) && On.parent.ce) {
		let e = a != null && n.key == null ? l({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), W(), K(U, null, [qi("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Li.length;
	W();
	let c;
	try {
		let i = o && br(o(n)), s = n.key || a || i && i.key;
		c = K(U, { key: (s && !y(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Li.length; e > s; e--) zi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function br(e) {
	return e.some((e) => !Ui(e) || !(e.type === Fi || e.type === U && !br(e.children))) ? e : null;
}
var xr = (e) => e ? fa(e) ? ba(e) : xr(e.parent) : null, Sr = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => xr(e.parent),
	$root: (e) => xr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => jr(e),
	$forceUpdate: (e) => e.f ||= () => {
		xn(e.update);
	},
	$nextTick: (e) => e.n ||= yn.bind(e.proxy),
	$watch: (e) => zn.bind(e)
}), Cr = (e, t) => e !== r && !e.__isScriptSetup && f(e, t), wr = {
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
			else if (Cr(i, t)) return s[t] = 1, i[t];
			else if (a !== r && f(a, t)) return s[t] = 2, a[t];
			else if (f(o, t)) return s[t] = 3, o[t];
			else if (n !== r && f(n, t)) return s[t] = 4, n[t];
			else Er && (s[t] = 0);
		}
		let u = Sr[t], d, p;
		if (u) return t === "$attrs" && et(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== r && f(n, t)) return s[t] = 4, n[t];
		if (p = l.config.globalProperties, f(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: i, setupState: a, ctx: o } = e;
		return Cr(a, t) ? (a[t] = n, !0) : i !== r && f(i, t) ? (i[t] = n, !0) : f(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== r && c[0] !== "$" && f(e, c) || Cr(t, c) || f(o, c) || f(i, c) || f(Sr, c) || f(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? f(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Tr(e) {
	return p(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Er = !0;
function Dr(e) {
	let t = jr(e), n = e.proxy, r = e.ctx;
	Er = !1, t.beforeCreate && kr(t.beforeCreate, e, "bc");
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: D, errorCaptured: O, serverPrefetch: k, expose: A, inheritAttrs: ee, components: j, directives: te, filters: M } = t;
	if (u && Or(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Ft(t));
	}
	if (Er = !0, o) for (let e in o) {
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
	if (c) for (let e in c) Ar(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Nn(t, e[t]);
		});
	}
	d && kr(d, e, "c");
	function N(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (N(sr, f), N(cr, m), N(lr, h), N(ur, g), N(tr, v), N(nr, y), N(gr, O), N(hr, E), N(mr, D), N(dr, S), N(fr, w), N(pr, k), p(A)) {
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
	T && e.render === a && (e.render = T), ee != null && (e.inheritAttrs = ee), j && (e.components = j), te && (e.directives = te), k && Jn(e);
}
function Or(e, t, n = a) {
	p(e) && (e = Ir(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? Pn(r.from || n, r.default, !0) : Pn(r.from || n) : Pn(r), /* @__PURE__ */ qt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function kr(e, t, n) {
	ln(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Ar(e, t, n, r) {
	let i = r.includes(".") ? Bn(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && Ln(i, n);
	} else if (_(e)) Ln(i, e.bind(n));
	else if (b(e)) {
		if (p(e)) e.forEach((e) => Ar(e, t, n, r));
		else {
			let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
			_(r) && Ln(i, r, e);
		}
	}
}
function jr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Mr(c, e, o, !0)), Mr(c, t, o)), b(t) && a.set(t, c), c;
}
function Mr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Mr(e, a, n, !0), i && i.forEach((t) => Mr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Nr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Nr = {
	data: Pr,
	props: zr,
	emits: zr,
	methods: Rr,
	computed: Rr,
	beforeCreate: Lr,
	created: Lr,
	beforeMount: Lr,
	mounted: Lr,
	beforeUpdate: Lr,
	updated: Lr,
	beforeDestroy: Lr,
	beforeUnmount: Lr,
	destroyed: Lr,
	unmounted: Lr,
	activated: Lr,
	deactivated: Lr,
	errorCaptured: Lr,
	serverPrefetch: Lr,
	components: Rr,
	directives: Rr,
	watch: Br,
	provide: Pr,
	inject: Fr
};
function Pr(e, t) {
	return t ? e ? function() {
		return l(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
	} : t : e;
}
function Fr(e, t) {
	return Rr(Ir(e), Ir(t));
}
function Ir(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Lr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Rr(e, t) {
	return e ? l(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function zr(e, t) {
	return e ? p(e) && p(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : l(/* @__PURE__ */ Object.create(null), Tr(e), Tr(t ?? {})) : t;
}
function Br(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = l(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Lr(e[r], t[r]);
	return n;
}
function Vr() {
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
var Hr = 0;
function Ur(e, t) {
	return function(n, r = null) {
		_(n) || (n = l({}, n)), r != null && !b(r) && (r = null);
		let i = Vr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Hr++,
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
				s && (ln(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Wr;
				Wr = c;
				try {
					return e();
				} finally {
					Wr = t;
				}
			}
		};
		return c;
	};
}
var Wr = null, Gr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${A(t)}Modifiers`] || e[`${j(t)}Modifiers`];
function Kr(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && Gr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = a.map(ie)));
	let c, l = i[c = M(t)] || i[c = M(A(t))];
	!l && o && (l = i[c = M(j(t))]), l && ln(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, ln(u, e, 6, a);
	}
}
var qr = /* @__PURE__ */ new WeakMap();
function Jr(e, t, n = !1) {
	let r = n ? qr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!_(e)) {
		let r = (e) => {
			let n = Jr(e, t, !0);
			n && (s = !0, l(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (b(e) && r.set(e, null), null) : (p(a) ? a.forEach((e) => o[e] = null) : l(o, a), b(e) && r.set(e, o), o);
}
function Yr(e, t) {
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, j(t)) || f(e, t));
}
function Xr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = An(e), v, y;
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
			}) : e(f, null)), y = t.props ? s : Zr(s);
		}
	} catch (t) {
		Li.length = 0, un(t, e, 1), v = qi(Fi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = Qr(y, a)), b = Xi(b, y, !1, !0));
	}
	return n.dirs && (b = Xi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Kn(Hn(b.type) && Gn(b) || b, n.transition), v = b, An(_), v;
}
var Zr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || s(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Qr = (e, t) => {
	let n = {};
	for (let r in e) (!c(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function $r(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ei(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ti(o, r, n) && !Yr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ei(r, o, l) : !!o;
	return !1;
}
function ei(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ti(t, e, a) && !Yr(n, a)) return !0;
	}
	return !1;
}
function ti(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && b(r) && b(i) ? !_e(r, i) : r !== i;
}
function ni({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ri = {}, ii = () => Object.create(ri), ai = (e) => Object.getPrototypeOf(e) === ri;
function oi(e, t, n, r = !1) {
	let i = {}, a = ii();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ci(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ It(i) : e.type.props ? i : a, e.attrs = a;
}
function si(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Ut(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Yr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (f(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = A(o);
						i[t] = li(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ci(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = j(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = li(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && tt(e.attrs, "set", "");
}
function ci(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (D(r)) continue;
		let l = t[r], u;
		a && f(a, u = A(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Yr(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ Ut(n), i = c || r;
		for (let r = 0; r < o.length; r++) {
			let s = o[r];
			n[s] = li(a, t, s, i[s], e, !f(i, s));
		}
	}
	return s;
}
function li(e, t, n, r, i, a) {
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === j(n)) && (r = !0));
	}
	return r;
}
var ui = /* @__PURE__ */ new WeakMap();
function di(e, t, n = !1) {
	let a = n ? ui : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, c = {}, u = [], d = !1;
	if (!_(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = di(e, t, !0);
			l(c, n), r && u.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return b(e) && a.set(e, i), i;
	if (p(s)) for (let e = 0; e < s.length; e++) {
		let t = A(s[e]);
		fi(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = A(e);
		if (fi(t)) {
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
function fi(e) {
	return e[0] !== "$" && !D(e);
}
var pi = (e) => e === "_" || e === "_ctx" || e === "$stable", mi = (e) => p(e) ? e.map(Qi) : [Qi(e)], hi = (e, t, n) => {
	if (t._n) return t;
	let r = jn((...e) => mi(t(...e)), n);
	return r._c = !1, r;
}, gi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (pi(n)) continue;
		let i = e[n];
		if (_(i)) t[n] = hi(n, i, r);
		else if (i != null) {
			let e = mi(i);
			t[n] = () => e;
		}
	}
}, _i = (e, t) => {
	let n = mi(t);
	e.slots.default = () => n;
}, vi = (e, t, n) => {
	for (let r in t) (n || !pi(r)) && (e[r] = t[r]);
}, yi = (e, t, n) => {
	let r = e.slots = ii();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (vi(r, t, n), n && re(r, "_", e, !0)) : gi(t, r);
	} else t && _i(e, t);
}, bi = (e, t, n) => {
	let { vnode: i, slots: a } = e, o = !0, s = r;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : vi(a, t, n) : (o = !t.$stable, gi(t, a)), s = t;
	} else t && (_i(e, t), s = { default: 1 });
	if (o) for (let e in a) !pi(e) && s[e] == null && delete a[e];
}, xi = Ni;
function Si(e) {
	return Ci(e);
}
function Ci(e, t) {
	let n = P();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Wi(e, t) && (r = I(e), le(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === i && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Pi:
				y(e, t, n, r);
				break;
			case Fi:
				b(e, t, n, r);
				break;
			case Ii:
				e ?? x(t, n, r, s);
				break;
			case U:
				j(e, t, n, r, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, a, o, s, c, l) : f & 6 ? te(e, t, n, r, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, a, o, s, c, l, he);
		}
		d != null && a ? Zn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && Zn(e.ref, null, o, e, !0);
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, wi(e, a), s, u), _ && Mn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !D(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && na(f, r, e);
		}
		_ && Mn(e, null, r, "beforeMount");
		let v = Ei(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && xi(() => {
			try {
				f && na(f, r, e), v && g.enter(d), _ && Mn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, E = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Mi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				E(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? $i(e[l]) : Qi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, k = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && Ti(n, !1), (g = h.onVnodeBeforeUpdate) && na(g, n, t, e), f && Mn(t, e, n, "beforeUpdate"), n && Ti(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? A(e.dynamicChildren, d, l, n, i, wi(t, a), o) : s || ae(e, t, l, null, n, i, wi(t, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && xi(() => {
			g && na(g, n, t, e), f && Mn(t, e, n, "updated");
		}, i);
	}, A = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === U || !Wi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
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
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (A(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Di(e, t, !0)) : ae(e, t, n, f, i, a, s, c, l);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : M(t, n, r, i, a, o, c) : N(e, t, c);
	}, M = (e, t, n, r, i, a, o) => {
		let s = e.component = aa(e, r, i);
		if (er(e) && (s.ctx.renderer = he), ma(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, re, o), !e.el) {
				let r = s.subTree = qi(Fi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else re(s, e, t, n, i, a, o);
	}, N = (e, t, n) => {
		let r = t.component = e.component;
		if ($r(e, t, n)) {
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
					let n = ki(e);
					if (n) {
						t && (t.el = c.el, ie(e, t, o)), n.asyncDep.then(() => {
							xi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Ti(e, !1), t ? (t.el = c.el, ie(e, t, o)) : t = c, n && ne(n), (d = t.props && t.props.onVnodeBeforeUpdate) && na(d, s, t, c), Ti(e, !0);
				let f = Xr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), I(p), e, i, a), t.el = f.el, u === null && ni(e, f.el), r && xi(r, i), (d = t.props && t.props.onVnodeUpdated) && xi(() => na(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = $n(t);
				if (Ti(e, !1), l && ne(l), !m && (o = c && c.onVnodeBeforeMount) && na(o, d, t), Ti(e, !0), s && _e) {
					let t = () => {
						e.subTree = Xr(e), _e(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Xr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && xi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					xi(() => na(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && $n(d.vnode) && d.vnode.shapeFlag & 256) && e.a && xi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Oe(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => xn(u), Ti(e, !0), l();
	}, ie = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, si(e, t.props, r, n), bi(e, t.children, n), Ue(), wn(e), We();
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
		m & 8 ? (u & 16 && F(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : F(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, oe = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? $i(t[p]) : Qi(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? F(e, a, o, !0, !1, f) : O(t, n, r, a, o, s, c, l, f);
	}, se = (e, t, n, r, a, o, s, c, l) => {
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
		} else if (u > p) for (; u <= f;) le(e[u], a, o, !0), u++;
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
					le(r, a, o, !0);
					continue;
				}
				let i;
				if (r.key != null) i = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Wi(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? le(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? Oi(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || ji(f) : r;
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
			c.move(e, t, n, he);
			return;
		}
		if (c === U) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ce(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Ii) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Un] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), xi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Un];
					a._isLeaving && a[Un](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, le = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ue(), Zn(s, null, n, e, !0), We()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !$n(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && na(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Mn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, he, r) : l && !l.hasOnce && (a !== U || d > 0 && d & 64) ? F(l, t, n, !1, !0) : (a === U && d & 384 || !i && u & 16) && F(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && xi(() => {
			_ && na(_, t, e), h && Mn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === U) {
			de(n, r);
			return;
		}
		if (t === Ii) {
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
	}, de = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, fe = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ai(c), Ai(l), r && ne(r), i.stop(), a ? (a.flags |= 8, le(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, le(o, e, t, n)), s && xi(s, t), xi(() => {
			e.isUnmounted = !0;
		}, t);
	}, F = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) le(e[o], t, n, r, i);
	}, I = (e) => {
		if (e.shapeFlag & 6) return I(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Vn];
		return n ? h(n) : t;
	}, pe = !1, me = (e, t, n) => {
		let r;
		e == null ? t._vnode && (le(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, pe ||= (pe = !0, wn(r), Tn(), !1);
	}, he = {
		p: v,
		um: le,
		m: ce,
		r: ue,
		mt: M,
		mc: O,
		pc: ae,
		pbc: A,
		n: I,
		o: e
	}, ge, _e;
	return t && ([ge, _e] = t(he)), {
		render: me,
		hydrate: ge,
		createApp: Ur(me, ge)
	};
}
function wi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ti({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ei(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Di(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (p(r) && p(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = $i(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Di(t, a)), a.type === Pi && (a.patchFlag === -1 && (a = i[e] = $i(a)), a.el = t.el), a.type === Fi && !a.el && (a.el = t.el);
	}
}
function Oi(e) {
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
function ki(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ki(t);
}
function Ai(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ji(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? ji(t.subTree) : null;
}
var Mi = (e) => e.__isSuspense;
function Ni(e, t) {
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : Cn(e);
}
var U = /* @__PURE__ */ Symbol.for("v-fgt"), Pi = /* @__PURE__ */ Symbol.for("v-txt"), Fi = /* @__PURE__ */ Symbol.for("v-cmt"), Ii = /* @__PURE__ */ Symbol.for("v-stc"), Li = [], Ri = null;
function W(e = !1) {
	Li.push(Ri = e ? null : []);
}
function zi() {
	Li.pop(), Ri = Li[Li.length - 1] || null;
}
var Bi = 1;
function Vi(e, t = !1) {
	Bi += e, e < 0 && Ri && t && (Ri.hasOnce = !0);
}
function Hi(e) {
	return e.dynamicChildren = Bi > 0 ? Ri || i : null, zi(), Bi > 0 && Ri && Ri.push(e), e;
}
function G(e, t, n, r, i, a) {
	return Hi(q(e, t, n, r, i, a, !0));
}
function K(e, t, n, r, i) {
	return Hi(qi(e, t, n, r, i, !0));
}
function Ui(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Wi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Gi = ({ key: e }) => e ?? null, Ki = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ qt(e) || _(e) ? {
	i: On,
	r: e,
	k: t,
	f: !!n
} : e);
function q(e, t = null, n = null, r = 0, i = null, a = e === U ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Gi(t),
		ref: t && Ki(t),
		scopeId: kn,
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
		ctx: On
	};
	return s ? (ea(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Bi > 0 && !o && Ri && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ri.push(c), c;
}
var qi = Ji;
function Ji(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === _r) && (e = Fi), Ui(e)) {
		let r = Xi(e, t, !0);
		return n && ea(r, n), Bi > 0 && !a && Ri && (r.shapeFlag & 6 ? Ri[Ri.indexOf(e)] = r : Ri.push(r)), r.patchFlag = -2, r;
	}
	if (xa(e) && (e = e.__vccOpts), t) {
		t = Yi(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = de(e)), b(n) && (/* @__PURE__ */ Ht(n) && !p(n) && (n = l({}, n)), t.style = oe(n));
	}
	let o = v(e) ? 1 : Mi(e) ? 128 : Hn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return q(e, t, n, r, i, o, a, !0);
}
function Yi(e) {
	return e ? /* @__PURE__ */ Ht(e) || ai(e) ? l({}, e) : e : null;
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
		patchFlag: t && e.type !== U ? o === -1 ? 16 : o | 16 : o,
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
	return c && r && Kn(u, c.clone(u)), u;
}
function J(e = " ", t = 0) {
	return qi(Pi, null, e, t);
}
function Zi(e, t) {
	let n = qi(Ii, null, e);
	return n.staticCount = t, n;
}
function Y(e = "", t = !1) {
	return t ? (W(), K(Fi, null, e)) : qi(Fi, null, e);
}
function Qi(e) {
	return e == null || typeof e == "boolean" ? qi(Fi) : p(e) ? qi(U, null, e.slice()) : Ui(e) ? $i(e) : qi(Pi, null, String(e));
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
			!r && !ai(t) ? t._ctx = On : r === 3 && On && (On.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (_(t)) {
		if (r & 65) {
			ea(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: On
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [J(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ta(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = de([t.class, r.class]));
		else if (e === "style") t.style = oe([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function na(e, t, n, r = null) {
	ln(e, t, 7, [n, r]);
}
var ra = Vr(), ia = 0;
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
		propsOptions: di(i, a),
		emitsOptions: Jr(i, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Kr.bind(null, o), e.ce && e.ce(o), o;
}
var oa = null, sa = () => oa || On, ca, la;
{
	let e = P(), t = (t, n) => {
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
	oi(e, r, a, t), yi(e, i, n || t);
	let o = a ? ha(e, t) : void 0;
	return t && la(!1), o;
}
function ha(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, wr);
	let { setup: r } = n;
	if (r) {
		Ue();
		let n = e.setupContext = r.length > 1 ? ya(e) : null, i = ua(e), a = cn(r, e, 0, [e.props, n]), o = x(a);
		if (We(), i(), (o || e.sp) && !$n(e) && Jn(e), o) {
			if (a.then(da, da), t) return a.then((n) => {
				la(!0);
				try {
					ga(e, n, t);
				} finally {
					la(!1);
				}
			}).catch((t) => {
				un(t, e, 0);
			});
			e.asyncDep = a;
		} else ga(e, a, t);
	} else _a(e, t);
}
function ga(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Qt(t)), _a(e, n);
}
function _a(e, t, n) {
	let r = e.type;
	e.render ||= r.render || a;
	{
		let t = ua(e);
		Ue();
		try {
			Dr(e);
		} finally {
			We(), t();
		}
	}
}
var va = { get(e, t) {
	return et(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Qt(Wt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Sr) return Sr[n](e);
		},
		has(e, t) {
			return t in e || t in Sr;
		}
	}) : e.proxy;
}
function xa(e) {
	return _(e) && "__vccOpts" in e;
}
var X = (e, t) => /* @__PURE__ */ en(e, t, pa);
function Sa(e, t, n) {
	try {
		Vi(-1);
		let r = arguments.length;
		return r === 2 ? b(t) && !p(t) ? Ui(t) ? qi(e, null, [t]) : qi(e, t) : qi(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Ui(n) && (n = [n]), qi(e, t, n));
	} finally {
		Vi(1);
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
		Va.test(n) ? e.setProperty(j(r), n.replace(Va, ""), "important") : e[r] = n;
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
	let r = A(t);
	if (r !== "filter" && r in e) return Wa[t] = r;
	r = te(r);
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
function Ja(e, t, n, r, i, a = F(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(qa, t.slice(6, t.length)) : e.setAttributeNS(qa, t, n) : n == null || a && !I(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
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
		r === "boolean" ? n = I(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : j(e.slice(2)), t];
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
				e && ln(e, t, 5, a);
			}
		} else ln(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ao(), n;
}
var so = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, co = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Na(e, r, o) : t === "style" ? Ba(e, n, r) : s(t) ? c(t) || $a(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : lo(e, t, r, o)) ? (Ya(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ja(e, t, r, o, a, t !== "value")) : e._isVueCE && (uo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? Ya(e, A(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ja(e, t, r, o));
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
	let r = A(t);
	return Array.isArray(n) ? n.some((e) => A(e) === r) : Object.keys(n).some((e) => A(e) === r);
}
var fo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => ne(t, e) : t;
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
	return t && (e = e.trim()), n && (e = ie(e)), e;
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
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ie(e.value) : e.value, c = t ?? "";
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
		i = _e(t, To(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var xo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Xa(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ie(wo(e)) : wo(e)), r = e.multiple, i = r ? h(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? p(i) ? t.slice() : t : i];
			try {
				e[ho](i);
			} finally {
				yn(() => {
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
	if (!n || p(e)) return _e(e, t);
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
			} else if (_e(wo(a), t)) {
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
		let r = j(n.key);
		if (t.some((e) => e === r || ko[e] === r)) return e(n);
	}));
}, jo = /* @__PURE__ */ l({ patchProp: co }, ja), Mo;
function No() {
	return Mo ||= Si(jo);
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
		let n = z(e.to);
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
			let n = t[z(e.replace) ? "replace" : "push"](z(e.to)).catch(Ho);
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
var yc = /* @__PURE__ */ V({
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
		let n = /* @__PURE__ */ Ft(_c(e)), { options: r } = Pn(Bs), i = X(() => ({
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
var Cc = (e, t, n) => e ?? t ?? n, wc = /* @__PURE__ */ V({
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
			let e = z(a), { matched: t } = i.value, n;
			for (; (n = t[e]) && !n.components;) e++;
			return e;
		}), s = X(() => i.value.matched[o.value]);
		Nn(zs, X(() => o.value + 1)), Nn(Rs, s), Nn(Hs, i);
		let c = /* @__PURE__ */ R();
		return Ln(() => [
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
	let t = cc(e.routes, e), n = e.parseQuery || Fs, r = e.stringifyQuery || Is, i = e.history, a = Us(), o = Us(), s = Us(), c = /* @__PURE__ */ Jt(bs), l = bs;
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
		}), re(i, i, !0, !1)), (f ? Promise.resolve(f) : E(d, i)).catch((e) => Ps(e) ? Ps(e, js.NAVIGATION_GUARD_REDIRECT) ? e : ne(e) : M(e, d, i)).then((e) => {
			if (e) {
				if (Ps(e, js.NAVIGATION_GUARD_REDIRECT)) return C(Bo({ replace: s }, v(e.to), {
					state: typeof e.to == "object" ? Bo({}, a, e.to.state) : a,
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
		let n, [r, i, s] = Ks(e, t);
		n = Gs(r.reverse(), "beforeRouteLeave", e, t);
		for (let i of r) i.leaveGuards.forEach((r) => {
			n.push(Ws(r, e, t));
		});
		let c = w.bind(null, e, t);
		return n.push(c), se(n).then(() => {
			n = [];
			for (let r of a.list()) n.push(Ws(r, e, t));
			return n.push(c), se(n);
		}).then(() => {
			n = Gs(i, "beforeRouteUpdate", e, t);
			for (let r of i) r.updateGuards.forEach((r) => {
				n.push(Ws(r, e, t));
			});
			return n.push(c), se(n);
		}).then(() => {
			n = [];
			for (let r of s) if (r.beforeEnter) {
				if (Uo(r.beforeEnter)) for (let i of r.beforeEnter) n.push(Ws(i, e, t));
				else n.push(Ws(r.beforeEnter, e, t));
			}
			return n.push(c), se(n);
		}).then(() => (e.matched.forEach((e) => e.enterCallbacks = {}), n = Gs(s, "beforeRouteEnter", e, t, T), n.push(c), se(n))).then(() => {
			n = [];
			for (let r of o.list()) n.push(Ws(r, e, t));
			return n.push(c), se(n);
		}).catch((e) => Ps(e, js.NAVIGATION_CANCELLED) ? e : Promise.reject(e));
	}
	function D(e, t, n) {
		s.list().forEach((r) => T(() => r(e, t, n)));
	}
	function O(e, t, n, r, a) {
		let o = y(e, t);
		if (o) return o;
		let s = t === bs, l = Lo ? history.state : {};
		n && (r || s ? i.replace(e.fullPath, Bo({ scroll: s && l && l.scroll }, a)) : i.push(e.fullPath, a)), c.value = e, re(e, t, n, s), ne();
	}
	let k;
	function A() {
		k ||= i.listen((e, t, n) => {
			if (!oe.listening) return;
			let r = _(e), a = S(r, oe.currentRoute.value);
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
			}).catch(Ho), Promise.reject()) : (n.delta && i.go(-n.delta, !1), M(e, r, o))).then((e) => {
				e ||= O(r, o, !1), e && (n.delta && !Ps(e, js.NAVIGATION_CANCELLED) ? i.go(-n.delta, !1) : n.type === xs.pop && Ps(e, js.NAVIGATION_ABORTED | js.NAVIGATION_DUPLICATED) && i.go(-1, !1)), D(r, o, e);
			}).catch(Ho);
		});
	}
	let ee = Us(), j = Us(), te;
	function M(e, t, n) {
		ne(e);
		let r = j.list();
		return r.length ? r.forEach((r) => r(e, t, n)) : console.error(e), Promise.reject(e);
	}
	function N() {
		return te && c.value !== bs ? Promise.resolve() : new Promise((e, t) => {
			ee.add([e, t]);
		});
	}
	function ne(e) {
		return te || (te = !e, A(), ee.list().forEach(([t, n]) => e ? n(e) : t()), ee.reset()), e;
	}
	function re(t, n, r, i) {
		let { scrollBehavior: a } = e;
		if (!Lo || !a) return Promise.resolve();
		let o = !r && Os(Ts(t.fullPath, 0)) || (i || !r) && history.state && history.state.scroll || null;
		return yn().then(() => a(t, n, o)).then((e) => e && ws(e)).catch((e) => M(e, t, n));
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
			e.component("RouterLink", yc), e.component("RouterView", Ec), e.config.globalProperties.$router = oe, Object.defineProperty(e.config.globalProperties, "$route", {
				enumerable: !0,
				get: () => z(c)
			}), Lo && !ae && c.value === bs && (ae = !0, b(i.location).catch((e) => {}));
			let t = {};
			for (let e in bs) Object.defineProperty(t, e, {
				get: () => c.value[e],
				enumerable: !0
			});
			e.provide(Bs, oe), e.provide(Vs, /* @__PURE__ */ It(t)), e.provide(Hs, c);
			let n = e.unmount;
			P.add(e), e.unmount = function() {
				P.delete(e), P.size < 1 && (l = bs, k && k(), k = null, c.value = bs, ae = !1, te = !1), n();
			};
		}
	};
	function se(e) {
		return e.reduce((e, t) => e.then(() => T(t)), Promise.resolve());
	}
	return oe;
}
function Oc() {
	return Pn(Bs);
}
function kc(e) {
	return Pn(Vs);
}
//#endregion
//#region src/router/links.ts
var Ac = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
function jc(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 4096 && !Array.from(e).some((e) => e.charCodeAt(0) < 32 || e === "?" || e === "#") && !e.split(/[\\/]/).some((e) => e === "." || e === "..");
}
var Mc = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
function Nc(e) {
	return typeof e == "string" ? e : "";
}
function Pc(e) {
	if (typeof e != "string" || !e.startsWith("/") || e.startsWith("//") || /[\\#\r\n]/.test(e)) return "/";
	let t = new URL(e, "https://plugin.invalid");
	return t.pathname === "/settings" || !/^\/(?:chat\/[^/]+|inbox|kanban|artifacts|projects(?:\/[^/]+(?:\/(?:artifacts|settings|instructions))?)?|scheduled(?:\/[^/]+(?:\/[^/]+)?)?)?$/.test(t.pathname) ? "/" : t.pathname + t.search;
}
function Fc(e, t = "", n = "", r = "", i = {}) {
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
function Ic(e, t = window.location.origin) {
	try {
		let n = new URL(e, t);
		if (n.origin === t && n.pathname === "/chathermes" && n.hash.startsWith("#/")) return n.hash.slice(1);
	} catch {}
}
//#endregion
//#region src/router/notification-navigation.ts
var Lc = "chathermes.notificationNavigation", Rc = "/api/plugins/kanban", zc = class extends Error {
	status;
	constructor(e) {
		super(e === 409 ? "Hermes refused this operation in the task’s current state. Refresh and check its dependencies or worker." : `Kanban request failed (${e}).`), this.status = e;
	}
};
function Bc(e, t, n = {}) {
	let r = new URLSearchParams(n);
	if (t !== void 0) {
		if (!t) throw Error("Select a board first.");
		r.set("board", t);
	}
	return Rc + e + (r.size ? "?" + r : "");
}
async function Vc(e, t = {}, n, r) {
	let i = new Headers({ accept: "application/json" });
	t.body && !(t.body instanceof FormData) && i.set("content-type", "application/json");
	let a = await fetch(Bc(e, n, r), {
		...t,
		headers: i,
		credentials: "same-origin",
		redirect: "error",
		cache: "no-store"
	});
	if (!a.ok) throw new zc(a.status);
	return a.json();
}
var Hc = {
	boards: (e) => Vc("/boards", { signal: e }),
	workflow: (e) => Vc("/workflow", { signal: e }),
	board: (e, t, n) => Vc("/board", { signal: n }, e, { include_archived: String(t) }),
	task: (e, t, n) => Vc("/tasks/" + encodeURIComponent(t), { signal: n }, e),
	log: (e, t, n) => Vc(`/tasks/${encodeURIComponent(t)}/log`, { signal: n }, e, { tail: "16384" }),
	write: (e, t, n, r) => Vc(e, {
		method: t,
		...n === void 0 ? {} : { body: JSON.stringify(n) }
	}, r),
	upload: (e, t, n) => {
		let r = new FormData();
		return r.set("file", n), Vc(`/tasks/${encodeURIComponent(t)}/attachments`, {
			method: "POST",
			body: r
		}, e);
	}
};
async function Uc(e, t) {
	let n = window.__HERMES_PLUGIN_SDK__?.buildWsUrl;
	if (!n) throw Error("Dashboard event authentication is unavailable.");
	let r = await n(Rc + "/events", {
		board: e,
		...t === void 0 ? {} : { since: String(t) }
	}), i = new URL(r);
	if (i.host !== location.host || i.protocol !== (location.protocol === "https:" ? "wss:" : "ws:")) throw Error("Invalid dashboard event URL.");
	return i.href;
}
//#endregion
//#region src/features/kanban/context.ts
var Wc = "chathermes.kanban-viewer", Gc = Symbol("kanban");
function Kc() {
	try {
		return localStorage.getItem(Wc) === "true";
	} catch {
		return !1;
	}
}
function qc(e) {
	let t = /* @__PURE__ */ Jt([]), n = /* @__PURE__ */ R(Kc()), r = /* @__PURE__ */ R(!1), i = /* @__PURE__ */ R(!1), a, o = 0;
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
			let e = await Hc.boards(n.signal);
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
				localStorage.setItem(Wc, String(e));
			} catch {}
		}
	}
	function l() {
		document.visibilityState === "visible" && s();
	}
	let u;
	return Ln(e, () => void s()), cr(() => {
		s(), document.addEventListener("visibilitychange", l), window.addEventListener("online", l), u = setInterval(() => {
			document.visibilityState === "visible" && !i.value && s();
		}, 3e4);
	}), fr(() => {
		o++, a?.abort(), clearInterval(u), document.removeEventListener("visibilitychange", l), window.removeEventListener("online", l);
	}), {
		screenActions: t,
		enabled: /* @__PURE__ */ Lt(n),
		available: /* @__PURE__ */ Lt(r),
		checking: /* @__PURE__ */ Lt(i),
		visible: X(() => n.value && r.value && !e.value),
		setEnabled: c,
		check: s,
		unavailable: () => {
			r.value = !1;
		}
	};
}
function Jc(e) {
	let t = qc(e);
	return Nn(Gc, t), t;
}
function Yc() {
	let e = Pn(Gc);
	if (!e) throw Error("kanban context is missing");
	return e;
}
//#endregion
//#region src/vendor/hermes/json-rpc-channel.ts
var Xc = (e) => typeof e.id == "string" && typeof e.method == "string" && e.method !== "event", Zc = class extends Error {
	code;
	data;
	constructor(e, t) {
		super(e), this.name = "JsonRpcGatewayError", this.code = t?.code, this.data = t?.data;
	}
}, Qc = -32601, $c = -32603, el = 4404;
function tl(e, t = "Hermes RPC failed") {
	let n = e && typeof e == "object" ? e : {};
	return new Zc(typeof n.message == "string" && n.message ? n.message : t, {
		code: typeof n.code == "number" ? n.code : void 0,
		data: n.data
	});
}
var nl = 12e4, rl = 8;
new TextDecoder();
var il = (e) => {
	e?.unref?.();
}, al = class {
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
			requestTimeoutMs: e.requestTimeoutMs ?? nl,
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
			}, n), this.options.unrefTimers && il(u.timer)), r && (c = () => {
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
					code: el,
					message: e
				} });
			}
		};
		for (let r of this.requestHandlers) {
			let i;
			try {
				i = r(o);
			} catch (r) {
				return o.fail($c, `server request handler crashed: ${t}`), this.options.onRequestHandlerError?.(r instanceof Error ? r : Error(String(r)), {
					id: e,
					method: t,
					params: n
				}), !1;
			}
			if (i !== !1) return !0;
		}
		return o.fail(Qc, `no handler for server request: ${t}`), this.options.onUnhandledRequest?.({
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
		if (this.options.heartbeatLiveness === "any-inbound" && (this.lastLivenessAt = Date.now()), Xc(t)) {
			let e = t.params && typeof t.params == "object" ? t.params : {};
			return this.deliverRequest(t.id, t.method, e), t;
		}
		if (t.id !== void 0 && t.id !== null) {
			if (typeof t.id == "string" && this.outstandingPings.delete(t.id)) return this.lastLivenessAt = Date.now(), t;
			let e = this.pending.get(t.id);
			return e && (this.lastLivenessAt = Date.now(), this.clearPending(t.id), t.error ? e.reject(tl(t.error)) : (this.deliverOpenRequests(t.result), e.resolve(t.result))), t;
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
			this.outstandingPings.add(t), this.outstandingPings.size > rl && this.outstandingPings.delete(this.outstandingPings.values().next().value);
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
		}, this.options.heartbeatIntervalMs), this.options.unrefTimers && il(this.heartbeatTimer));
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
}, ol = /* @__PURE__ */ new Map(), sl = (e, t) => JSON.stringify([e || "default", t]), cl = {
	snapshot: () => {},
	event: () => {},
	input: () => {},
	requests: () => {},
	connection: () => {},
	recovered: () => {}
}, ll = class e {
	static async create(t, n, r) {
		if (ol.size >= 32) throw new Z("Too many unopened drafts", "rejected");
		let i = new e(t, "", cl), a = () => i.close();
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
			let o = sl(t, a), s = setTimeout(() => {
				ol.get(o)?.viewer === i && ol.delete(o), i.close();
			}, 3e5);
			return ol.set(o, {
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
		this.channel = new al({
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
		let e = ol.get(sl(this.profile, this.stored));
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
		e && ol.get(sl(this.profile, this.stored)) === e && (ol.delete(sl(this.profile, this.stored)), clearTimeout(e.timer), e.viewer.close()), this.hooks.snapshot({
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
			throw t instanceof Zc ? new Z("Hermes could not complete this operation", e === "prompt.submit" ? "unknown" : "rejected") : t;
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
function ul(e) {
	let t = e;
	if (!t || typeof t != "object" || t.protocol !== "hermes.native.bf0203a7" || t.reviewed_source !== "bf0203a794a07aac3ff764972ab9087baa4e4f4e" || t.mode !== "native-gateway" || t.admission !== !0 || !Array.isArray(t.operations) || !t.operations.every((e) => typeof e == "string") || !Array.isArray(t.blockers) || !t.blockers.every((e) => typeof e == "string") || t.guarantees?.crash_safe_idempotency !== !1 || t.guarantees?.lossless_snapshot_replay !== !1 || t.guarantees?.offline_turn_lease !== !0) throw Error("Unsupported native chat contract");
	return t;
}
async function dl(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	t?.throwIfAborted();
	let n = await fetch(`/api/plugins/chathermes/chat/capabilities?profile=${encodeURIComponent(e || "default")}`, {
		credentials: "same-origin",
		cache: "no-store",
		redirect: "manual",
		signal: t
	});
	if (!n.ok || n.type === "opaqueredirect") throw Error("Sign in to the dashboard to inspect native chat support");
	let r = ul(await n.json()), i = await fetch("/api/auth/ws-ticket", {
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
var fl = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, pl = /* @__PURE__ */ new Set(), ml = /* @__PURE__ */ new Set(), hl = (e, t) => JSON.stringify([e, t]), gl = "/api/plugins/chathermes";
function _l(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:inbox(?:\?[^#]*|\/[0-9]+(?:\/read)?|\/read(?:\?[^#]*)?)?|session-tracking(?:\/[A-Za-z0-9_-]+)?|artifacts\?[^#]*|project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions(?:\?prepare=1)?|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/messages|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/project|\/branch)?|v1\/(?:capabilities|models))$/.test(t)) throw Error("Invalid Hermes API path.");
	return gl + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function vl(e, t, n = {}, r = "application/json") {
	let i = new Headers(n.headers);
	i.set("accept", r), n.body && i.set("content-type", "application/json");
	let a = await fetch(_l(e, t), {
		...n,
		headers: i,
		credentials: "same-origin",
		redirect: "manual",
		cache: "no-store"
	});
	if (a.type === "opaqueredirect" || a.status >= 300 && a.status < 400) throw Error("Hermes redirected the request. Sign in to the dashboard and retry.");
	return a;
}
async function yl(e, t, n = {}) {
	let r = await vl(e, t, n);
	if (!r.ok) throw new fl(r.status, `Request failed (${r.status})`);
	return r.json();
}
function bl(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function xl(e) {
	let t = bl(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function Sl(e) {
	return xl(bl(e)?.session ?? e);
}
function Cl(e) {
	let t = bl(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(xl),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function wl(e) {
	let t = bl(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !bl(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = bl(t?.pagination);
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
		transcript: bl(t?.transcript)
	};
}
var Q = {
	inbox: (e, t = {}, n) => {
		let r = new URLSearchParams({
			scope: t.scope || "all",
			unread: String(t.unread || !1),
			limit: String(t.limit || 50)
		});
		return t.cursor && r.set("cursor", t.cursor), yl(t.scope === "profile" ? e : "default", "/inbox?" + r, { signal: n });
	},
	readInbox: (e, t) => yl(e, "/inbox/" + t + "/read", { method: "PUT" }),
	deleteInboxItem: (e, t) => yl(e, "/inbox/" + t, { method: "DELETE" }),
	deleteReadInbox: (e, t) => yl(t === "profile" ? e : "default", "/inbox/read?scope=" + t, { method: "DELETE" }),
	artifacts: (e, t, n, r) => {
		let i = new URLSearchParams({ limit: "50" });
		return t !== void 0 && i.set("project_id", t), n && i.set("cursor", n), yl(e, `/artifacts?${i}`, { signal: r });
	},
	nativeChatCapabilities: dl,
	isNative: (e) => pl.has(e),
	profiles: async () => {
		let e = await fetch(gl + "/profiles", {
			credentials: "same-origin",
			cache: "no-store"
		});
		if (!e.ok) throw new fl(e.status, "Could not load profiles");
		return e.json();
	},
	scheduled: (e, t) => yl(e, "/scheduled", { signal: t }),
	scheduledRuns: (e, t, n = 0, r) => yl(e, `/scheduled/runs?job_id=${encodeURIComponent(t)}&offset=${n}`, { signal: r }),
	scheduledOutput: (e, t, n, r) => yl(e, `/scheduled/output?job_id=${encodeURIComponent(t)}&run_id=${encodeURIComponent(n)}`, { signal: r }),
	projects: (e, t) => yl(e, "/projects", { signal: t }),
	project: async (e, t, n) => {
		let r = await yl(e, `/projects/detail?project_id=${encodeURIComponent(t)}`, { signal: n });
		if (r.project?.id !== t || typeof r.project.label != "string") throw Error("Invalid Hermes Project response");
		return r.project;
	},
	projectInstructions: (e, t, n) => yl(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, { signal: n }),
	saveProjectInstructions: (e, t, n) => yl(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify(n)
	}),
	projectManage: (e, t, n) => yl(e, "/projects/manage", {
		method: "POST",
		body: JSON.stringify({
			action: t,
			...n
		})
	}),
	isWorkspace(e, t) {
		return ml.has(hl(e, t));
	},
	workspace(e, t) {
		ml.add(hl(e, t));
	},
	projectCreate: async (e, t) => {
		let n = await yl(e, `/projects/session?project_id=${encodeURIComponent(t)}&prepare=1`, {
			method: "POST",
			body: "{}"
		}), r = n.native_create ? await ll.create(e, n.native_create) : Sl(n);
		return ml.add(hl(e, r.id)), r;
	},
	projectEvents(e, t) {
		if (e && e !== "default") {
			t();
			let e = setInterval(t, 5e3);
			return () => clearInterval(e);
		}
		let n = new EventSource(gl + "/project-events?profile=" + encodeURIComponent(e || "default"), { withCredentials: !0 });
		return n.addEventListener("refresh", t), () => n.close();
	},
	models: (e) => yl(e, "/v1/models"),
	modelOptions: (e) => yl(e, "/api/model/options"),
	async upload(e, t) {
		let n = await fetch(gl + "/uploads" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "POST",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t)
		});
		if (!n.ok) throw new fl(n.status, `Upload failed (${n.status})`);
		return n.json();
	},
	capabilities: async (e, t) => {
		let n = await yl(e, "/v1/capabilities", { signal: t });
		return n.features?.native_chat === !0 ? pl.add(e) : pl.delete(e), n;
	},
	tracking: (e, t) => yl(e, "/session-tracking", { signal: t }),
	track: (e, t, n) => yl(e, `/session-tracking/${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify({ status: n })
	}),
	sessions: async (e, t = 0, n) => Cl(await yl(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => {
		let n = await yl(e, "/chat/sessions?prepare=1", {
			method: "POST",
			body: "{}",
			signal: t
		}), r = n.native_create ? await ll.create(e, n.native_create, t) : Sl(n);
		return ml.add(hl(e, r.id)), r;
	},
	session: async (e, t, n) => {
		let r = Sl(await yl(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n }));
		return (r.cwd || r.source === "desktop") && ml.add(hl(e, t)), r;
	},
	branch: (e, t, n) => yl(e, `/api/sessions/${encodeURIComponent(t)}/branch`, {
		method: "POST",
		body: JSON.stringify({ response_id: n })
	}),
	rename: async (e, t, n, r) => Sl(await yl(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	archive: (e, t) => yl(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ archived: !0 })
	}),
	deleteSession: (e, t) => yl(e, `/api/sessions/${encodeURIComponent(t)}`, { method: "DELETE" }),
	moveSession: (e, t, n) => yl(e, `/api/sessions/${encodeURIComponent(t)}/project`, {
		method: "POST",
		body: JSON.stringify({ project_id: n })
	}),
	async latestMessages(e, t, n, r = 0, i) {
		let a;
		try {
			a = wl(await yl(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=120&offset=${r}&order=latest&inline_images=false&include_compacted=true&transcript=1${i ? `&revision=${encodeURIComponent(i)}` : ""}`, { signal: n }));
		} catch (r) {
			if (!(r instanceof fl) || r.status !== 404 || !Q.isWorkspace(e, t)) throw r;
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
				s = wl(await yl(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${o}&order=oldest&inline_images=false&include_compacted=true`, { signal: n }));
			} catch (r) {
				if (o === 0 && r instanceof fl && r.status === 404 && ml.has(hl(e, t))) return wl(await yl(e, `/workspace/sessions/${encodeURIComponent(t)}/messages`, { signal: n })).messages;
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
function Tl(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
//#endregion
//#region src/features/projects/utils/projects.ts
function El(e) {
	return e.path || e.repos.find((e) => e.path)?.path || void 0;
}
function Dl(e) {
	let t = e.repos.flatMap((e) => e.groups.flatMap((e) => e.sessions));
	return [...new Map(t.map((e) => [e.id, e])).values()].sort((e, t) => (t.last_active || 0) - (e.last_active || 0));
}
//#endregion
//#region src/features/projects/composables/useProjectWorkspace.ts
function Ol(e) {
	let { profile: t, session: n, sessions: r, offline: i, navigate: a } = e, o = kc(), s = Oc(), c = X(() => o.query.archived === "1"), l = /* @__PURE__ */ R(!1), u = /* @__PURE__ */ R(""), d = /* @__PURE__ */ R(""), f = /* @__PURE__ */ R([]), p = /* @__PURE__ */ R(), m = /* @__PURE__ */ R(!1), h = /* @__PURE__ */ R(!1), g = /* @__PURE__ */ R(""), _ = /* @__PURE__ */ R(""), v = /* @__PURE__ */ R([]), y = /* @__PURE__ */ R(!1), b = X(() => d.value ? p.value ? Dl(p.value) : [] : r.value.filter((e) => !v.value.includes(e.id))), x, S;
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
				e === E && !e.signal.aborted && (_.value = t instanceof fl && t.status === 404 ? "Project no longer exists. Return to Other chats." : "Could not load this Project. Retry or return to Other chats.");
			} finally {
				e === E && (h.value = !1);
			}
		}
	}
	async function ee(e) {
		return a(e ? {
			...Fc("project", t.value, n.value, e),
			params: { projectId: e }
		} : Fc("home", t.value, n.value));
	}
	function j(e = !1) {
		return a(Fc("projects", t.value, n.value, d.value, e ? { archived: "1" } : {}));
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
	return Te(() => {
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
function kl(e) {
	return typeof e == "string" && /^(?:data:image\/|https?:\/\/|\/api\/plugins\/chathermes\/artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+$)/.test(e);
}
//#endregion
//#region node_modules/mdurl/lib/decode.mjs
var Al = {};
function jl(e) {
	let t = Al[e];
	if (t) return t;
	t = Al[e] = [];
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
function Ml(e, t) {
	typeof t != "string" && (t = Ml.defaultChars);
	let n = jl(t);
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
Ml.defaultChars = ";/?:@&=+$,#", Ml.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var Nl = {};
function Pl(e) {
	let t = Nl[e];
	if (t) return t;
	t = Nl[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function Fl(e, t, n) {
	typeof t != "string" && (n = t, t = Fl.defaultChars), n === void 0 && (n = !0);
	let r = Pl(t), i = "";
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
Fl.defaultChars = ";/?:@&=+$,-_.!~*'()#", Fl.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function Il(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function Ll() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var Rl = /^([a-z0-9.+-]+:)/i, zl = /:[0-9]*$/, Bl = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Vl = [
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
], Hl = [
	"/",
	"?",
	"#"
], Ul = 255, Wl = /^[+a-z0-9A-Z_-]{0,63}$/, Gl = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Kl = {
	javascript: !0,
	"javascript:": !0
}, ql = {
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
function Jl(e, t) {
	if (e && e instanceof Ll) return e;
	let n = new Ll();
	return n.parse(e, t), n;
}
Ll.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = Bl.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = Rl.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && Kl[o]) && (a = a.substr(2), this.slashes = !0)), !Kl[o] && (i || o && !ql[o])) {
		let e = -1;
		for (let t = 0; t < Hl.length; t++) r = a.indexOf(Hl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < Vl.length; t++) r = a.indexOf(Vl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(Wl)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(Wl)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(Gl);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > Ul && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), ql[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, Ll.prototype.parseHost = function(e) {
	let t = zl.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region node_modules/mdurl/index.mjs
var Yl = /* @__PURE__ */ t({
	decode: () => Ml,
	encode: () => Fl,
	format: () => Il,
	parse: () => Jl
}), Xl = /* @__PURE__ */ t({
	Any: () => Zl,
	Cc: () => Ql,
	Cf: () => $l,
	P: () => eu,
	S: () => tu,
	Z: () => nu
}), Zl = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Ql = /[\0-\x1F\x7F-\x9F]/, $l = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, eu = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, tu = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, nu = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, ru = [
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
function iu(e) {
	return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function au(e) {
	return iu(e) ? 65533 : e >= 128 && e <= 159 && ru[e - 128] || e;
}
function ou(e) {
	return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(au(e));
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/internal/decode-shared.js
var su = /* #__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(127), t = 0;
	for (let n = 33; n <= 126; n++) n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
	return e;
})();
function cu(e, t, n, r, i, a) {
	let o = e.length, s = a * 90, c = 0, l = () => {
		let t = su[e.charCodeAt(c++)];
		return t < a ? t : t * 91 - s + su[e.charCodeAt(c++)];
	}, u = n - r, d = n + i, f = new Int32Array(d);
	f.fill(-1, r, a), f.fill(-1, a + u, d);
	let p = new Int32Array(d), m = new Int32Array(d);
	function h(t, n) {
		let r = 0, i = n, a = n + t;
		for (; i < a;) {
			let t = su[e.charCodeAt(c++)];
			if (t < 89) r += t, f[i++] = r;
			else if (t === 89) {
				let t = su[e.charCodeAt(c++)] + 2;
				for (; t--;) f[i++] = ++r;
			} else {
				let t = su[e.charCodeAt(c++)];
				r += 89 + (t < 90 ? t * 91 + su[e.charCodeAt(c++)] : su[e.charCodeAt(c++)] * 8281 + su[e.charCodeAt(c++)] * 91 + su[e.charCodeAt(c++)]), f[i++] = r;
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
		let t = su[e.charCodeAt(c++)];
		t >= a && (t = t * 91 - s + su[e.charCodeAt(c++)]);
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
var lu = /* #__PURE__ */ cu("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61), uu;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(uu ||= {});
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/decode.js
var du;
(function(e) {
	e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(du ||= {});
var fu = 32, pu = 21, mu = 2097151, hu = 2047, gu = 0;
function _u(e) {
	let t = e >>> pu;
	return t === hu ? gu : t;
}
function vu(e) {
	return e - du.ZERO >>> 0 <= 9;
}
function yu(e) {
	return (e | fu) - du.LOWER_A >>> 0 <= 5;
}
function bu(e) {
	return (e | fu) - du.LOWER_A >>> 0 <= 25;
}
function xu(e) {
	return e === du.EQUALS || bu(e) || vu(e);
}
var Su;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Su ||= {});
var Cu;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Cu ||= {});
function wu(e, t, n, r) {
	let i = (t & uu.BRANCH_LENGTH) >> 7, a = t & uu.JUMP_TABLE;
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
function Tu(e, t, n) {
	return n === 1 ? String.fromCharCode(e[t] & uu.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function Eu(e, t, n) {
	let r = t + 1, i = 0, a = r;
	if (r < n && (e.charCodeAt(r) | fu) === du.LOWER_X) for (r += 1, a = r; r < n;) {
		let t = e.charCodeAt(r);
		if (vu(t)) i = i * 16 + (t - du.ZERO);
		else if (yu(t)) i = i * 16 + ((t | fu) - du.LOWER_A + 10);
		else break;
		r += 1;
	}
	else for (; r < n;) {
		let t = e.charCodeAt(r) - du.ZERO;
		if (t >>> 0 > 9) break;
		i = i * 10 + t, r += 1;
	}
	if (r === a) return 0;
	r < n && e.charCodeAt(r) === du.SEMI && (r += 1), i > 1114111 && (i = 1114112);
	let o = r - t;
	return o >= hu && (gu = o, o = hu), o << pu | i;
}
function Du(e, t, n) {
	let r = lu, i = e.indexOf("&");
	if (i < 0) return e;
	let a = e.length, o = 0, s = "", c = r[0], l = c & uu.JUMP_TABLE, u = (c & uu.BRANCH_LENGTH) >> 7;
	do {
		let c = i + 1, d = e.charCodeAt(c), f, p;
		if (d === du.NUM) {
			let n = Eu(e, c, a);
			f = _u(n), t && f > 0 && e.charCodeAt(c + f - 1) !== du.SEMI && (f = 0), p = f === 0 ? "" : ou(n & mu);
		} else if (bu(d)) {
			f = 0, p = "";
			let n = d - l, i;
			if (n >>> 0 < u) {
				let e = r[1 + n];
				i = e === 0 ? -1 : u + e & 65535;
			} else i = -1;
			let o = 0, s = 0, m = i < 0 ? 0 : r[i], h = c + 1;
			trie: for (; h < a;) {
				for (; (m & (uu.VALUE_LENGTH | uu.FLAG13)) === 0 && (m & uu.JUMP_TABLE) !== 0;) {
					let t = m & uu.JUMP_TABLE, n = (m & uu.BRANCH_LENGTH) >> 7;
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
				if ((m & (uu.VALUE_LENGTH | uu.FLAG13)) === uu.FLAG13) {
					let t = (m & uu.BRANCH_LENGTH) >> 7;
					if (e.charCodeAt(h) !== (m & uu.JUMP_TABLE)) break;
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
					if (l === du.SEMI) {
						f = h - c + 1, p = n === 1 ? String.fromCharCode(m & uu.VALUE_MASK) : Tu(r, i, n);
						break;
					}
					if (!t && (m & uu.FLAG13) === 0 && (f = h - c, o = i, s = n), n === 1) break;
				}
				let u = wu(r, m, i + (n || 1), l);
				if (u < 0) break;
				i = u, m = r[i], h += 1;
			}
			if (p === "") {
				let e = m >>> 14;
				e !== 0 && !t && (m & uu.FLAG13) === 0 && (f = h - c, o = i, s = e), f > 0 && (p = Tu(r, o, s));
			}
		} else f = 0, p = "";
		f === 0 || n && d !== du.NUM && e.charCodeAt(c + f - 1) !== du.SEMI && c + f < a && xu(e.charCodeAt(c + f)) ? i = c : (o < i && (s += e.slice(o, i)), s += p, i = o = c + f), e.charCodeAt(i) !== du.AMP && (i = e.indexOf("&", i));
	} while (i >= 0);
	return s + e.slice(o);
}
function Ou(e) {
	return Du(e, !0, !1);
}
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var ku = class {
	src_Any = Zl.source;
	src_Cc = Ql.source;
	src_Z = nu.source;
	src_P = eu.source;
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
}, Au = {
	validate: (e, t, n) => {
		let r = n.re.get_http_validator();
		r.lastIndex = t;
		let i = r.exec(e);
		return i ? i[0].length : 0;
	},
	normalize: (e, t) => t.normalize(e)
}, ju = {
	"http:": Au,
	"https:": Au,
	"ftp:": Au,
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
}, Mu = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", Nu = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function Pu() {
	let e = Nu.split("|");
	return Mu.split("|").forEach((t) => {
		let n = t.indexOf(":"), r = t.slice(0, n);
		for (let i of t.slice(n + 1)) e.push(r + i);
	}), e;
}
var Fu = {
	fuzzyLink: !1,
	fuzzyEmail: !0,
	fuzzyIP: !1,
	"---": !1,
	tlds: Pu(),
	urlAuth: !1,
	maxLength: 1e4
}, Iu = class {
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
}, Lu = class {
	__opts__;
	__schemas__;
	re;
	constructor(e = {}) {
		let { rebuilder: t, ...n } = e;
		this.__opts__ = {
			...Fu,
			...n
		}, this.__schemas__ = { ...ju }, this.re = t || new ku(), this.re.set({
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
			let _ = new Iu(e, g.schema, g.index, g.lastIndex);
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
		let r = new Iu(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
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
}, Ru = 2147483647, zu = 36, Bu = 1, Vu = 26, Hu = 38, Uu = 700, Wu = 72, Gu = 128, Ku = "-", qu = /^xn--/, Ju = /[^\0-\x7F]/, Yu = /[\x2E\u3002\uFF0E\uFF61]/g, Xu = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, Zu = 35, Qu = Math.floor, $u = String.fromCharCode;
function ed(e) {
	throw RangeError(Xu[e]);
}
function td(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function nd(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(Yu, ".");
	let i = td(e.split("."), t).join(".");
	return r + i;
}
function rd(e) {
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
var id = (e) => String.fromCodePoint(...e), ad = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : zu;
}, od = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, sd = function(e, t, n) {
	let r = 0;
	for (e = n ? Qu(e / Uu) : e >> 1, e += Qu(e / t); e > 455; r += zu) e = Qu(e / Zu);
	return Qu(r + 36 * e / (e + Hu));
}, cd = function(e) {
	let t = [], n = e.length, r = 0, i = Gu, a = Wu, o = e.lastIndexOf(Ku);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && ed("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = zu;; i += zu) {
			s >= n && ed("invalid-input");
			let o = ad(e.charCodeAt(s++));
			o >= zu && ed("invalid-input"), o > Qu((Ru - r) / t) && ed("overflow"), r += o * t;
			let c = i <= a ? Bu : i >= a + Vu ? Vu : i - a;
			if (o < c) break;
			let l = zu - c;
			t > Qu(Ru / l) && ed("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = sd(r - o, c, o == 0), Qu(r / c) > Ru - i && ed("overflow"), i += Qu(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, ld = function(e) {
	let t = [];
	e = rd(e);
	let n = e.length, r = Gu, i = 0, a = Wu;
	for (let n of e) n < 128 && t.push($u(n));
	let o = t.length, s = o;
	for (o && t.push(Ku); s < n;) {
		let n = Ru;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > Qu((Ru - i) / c) && ed("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > Ru && ed("overflow"), n === r) {
			let e = i;
			for (let n = zu;; n += zu) {
				let r = n <= a ? Bu : n >= a + Vu ? Vu : n - a;
				if (e < r) break;
				let i = e - r, o = zu - r;
				t.push($u(od(r + i % o, 0))), e = Qu(i / o);
			}
			t.push($u(od(e, 0))), a = sd(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, ud = {
	version: "2.3.1",
	ucs2: {
		decode: rd,
		encode: id
	},
	decode: cd,
	encode: ld,
	toASCII: function(e) {
		return nd(e, function(e) {
			return Ju.test(e) ? "xn--" + ld(e) : e;
		});
	},
	toUnicode: function(e) {
		return nd(e, function(e) {
			return qu.test(e) ? cd(e.slice(4).toLowerCase()) : e;
		});
	}
}, dd = Object.defineProperty, fd = (e, t) => {
	let n = {};
	for (var r in e) dd(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || dd(n, Symbol.toStringTag, { value: "Module" }), n;
}, pd = /* @__PURE__ */ fd({
	arrayReplaceAt: () => hd,
	asciiTrim: () => Rd,
	callable: () => md,
	escapeHtml: () => Od,
	escapeRE: () => Ad,
	fromCodePoint: () => _d,
	isMdAsciiPunct: () => Fd,
	isPunctChar: () => Nd,
	isPunctCharCode: () => Pd,
	isSpace: () => jd,
	isValidEntityCode: () => gd,
	isWhiteSpace: () => Md,
	lib: () => zd,
	normalizeReference: () => Id,
	unescapeAll: () => Cd,
	unescapeMd: () => Sd
});
function md(e) {
	let t = function(...n) {
		return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
	};
	return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function hd(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function gd(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function _d(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var vd = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, yd = RegExp(`${vd.source}|&([a-z#][a-z0-9]{1,31});`, "gi"), bd = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function xd(e, t) {
	if (t.charCodeAt(0) === 35 && bd.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return gd(n) ? _d(n) : e;
	}
	let n = Ou(e);
	return n === e ? e : n;
}
function Sd(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(vd, "$1");
}
function Cd(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(yd, function(e, t, n) {
		return t || xd(e, n);
	});
}
var wd = /[&<>"]/, Td = /[&<>"]/g, Ed = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function Dd(e) {
	return Ed[e];
}
function Od(e) {
	return wd.test(e) ? e.replace(Td, Dd) : e;
}
var kd = /[.?*+^$[\]\\(){}|-]/g;
function Ad(e) {
	return e.replace(kd, "\\$&");
}
function jd(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function Md(e) {
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
function Nd(e) {
	return eu.test(e) || tu.test(e);
}
function Pd(e) {
	return Nd(_d(e));
}
function Fd(e) {
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
function Id(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function Ld(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function Rd(e) {
	let t = 0;
	for (; t < e.length && Ld(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && Ld(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var zd = {
	mdurl: Yl,
	ucmicro: Xl
};
function Bd(e, t, n) {
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
function Vd(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = Cd(e.slice(t + 1, i)), a.ok = !0, a;
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
	return t === i || o !== 0 ? a : (a.str = Cd(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function Hd(e, t, n, r) {
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
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += Cd(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += Cd(e.slice(t, a)), o;
}
var Ud = /* @__PURE__ */ fd({
	parseLinkDestination: () => Vd,
	parseLinkLabel: () => Bd,
	parseLinkTitle: () => Hd
});
function Wd(e) {
	"@babel/helpers - typeof";
	return Wd = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, Wd(e);
}
function Gd(e, t) {
	if (Wd(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (Wd(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Kd(e) {
	var t = Gd(e, "string");
	return Wd(t) == "symbol" ? t : t + "";
}
function $(e, t, n) {
	return (t = Kd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
var qd = class {
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
}, Jd = class {
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
}, Yd = {};
Yd.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return `<code${i.renderAttrs(a)}>${Od(a.content)}</code>`;
}, Yd.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return `<pre${i.renderAttrs(a)}><code>${Od(e[t].content)}</code></pre>\n`;
}, Yd.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? Cd(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || Od(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", `${n.langPrefix}${s}`]) : (t[e] = [t[e][0], t[e][1]], t[e][1] += ` ${n.langPrefix}${s}`);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, Yd.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, Yd.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, Yd.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, Yd.text = function(e, t) {
	return Od(e[t].content);
}, Yd.html_block = function(e, t) {
	return e[t].content;
}, Yd.html_inline = function(e, t) {
	return e[t].content;
};
var Xd = class {
	constructor() {
		$(this, "rules", Object.assign({}, Yd));
	}
	renderAttrs(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${Od(e.attrs[t][0])}="${Od(String(e.attrs[t][1]))}"`;
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
}, Zd = class {
	constructor(e, t, n) {
		$(this, "tokens", []), $(this, "inlineMode", !1), $(this, "Token", qd), this.src = e, this.env = n, this.md = t;
	}
}, Qd = /\r\n?/g, $d = /\0/g;
function ef(e) {
	let t;
	t = e.src.replace(Qd, "\n"), t = t.replace($d, "�"), e.src = t;
}
function tf(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function nf(e) {
	let t = e.tokens, n = 0;
	for (let e = 0; e < t.length; e++) t[e].type !== "reference_definition" && (e !== n && (t[n] = t[e]), n++);
	t.length !== n && (t.length = n);
}
function rf(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function af(e) {
	return /^<a[>\s]/i.test(e);
}
function of(e) {
	return /^<\/a\s*>/i.test(e);
}
function sf(e) {
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
			if (n.type === "html_inline" && (af(n.content) && a > 0 && a--, of(n.content) && a++), !(a > 0) && n.type === "text" && e.md.linkify.test(n.content)) {
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
var cf = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, lf = /\((c|tm|r)\)/i, uf = /\((c|tm|r)\)/gi, df = {
	c: "©",
	r: "®",
	tm: "™"
};
function ff(e, t) {
	return df[t.toLowerCase()];
}
function pf(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(uf, ff)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function mf(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && cf.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function hf(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (lf.test(e.tokens[t].content) && pf(e.tokens[t].children), cf.test(e.tokens[t].content) && mf(e.tokens[t].children));
}
var gf = /['"]/, _f = /['"]/g, vf = "’", yf = 1e3;
function bf(e, t, n) {
	for (; e.length > n;) {
		let n = e.pop();
		n.isSingleQuote ? t.single = n.prevSameQuoteIdx : t.double = n.prevSameQuoteIdx;
	}
}
function xf(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function Sf(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function Cf(e, t) {
	let n, r = [], i = {
		single: -1,
		double: -1
	}, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = e[o].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= c); n--);
		if (bf(r, i, n + 1), s.type !== "text") continue;
		let l = s.content, u = 0, d = l.length;
		OUTER: for (; u < d;) {
			_f.lastIndex = u;
			let s = _f.exec(l);
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
			let _ = Fd(h) || Pd(h), v = Fd(g) || Pd(g), y = Md(h), b = Md(g);
			if (b ? f = !1 : v && (y || _ || (f = !1)), y ? p = !1 : _ && (b || v || (p = !1)), g === 34 && s[0] === "\"" && h >= 48 && h <= 57 && (p = f = !1), f && p && (f = _, p = v), !f && !p) {
				m && xf(a, o, s.index, vf);
				continue;
			}
			if (p && (n = m ? i.single : i.double, n >= 0 && r[n].level === c)) {
				let e = r[n], c, l;
				m ? (c = t.md.options.quotes[2], l = t.md.options.quotes[3]) : (c = t.md.options.quotes[0], l = t.md.options.quotes[1]), xf(a, o, s.index, l), xf(a, e.tokenIdx, e.contentPos, c), bf(r, i, n);
				continue OUTER;
			}
			if (f) {
				if (r.length >= yf) return;
				r.push({
					tokenIdx: o,
					contentPos: s.index,
					isSingleQuote: m,
					level: c,
					prevSameQuoteIdx: m ? i.single : i.double
				}), m ? i.single = r.length - 1 : i.double = r.length - 1;
			} else p && m && xf(a, o, s.index, vf);
		}
	}
	Object.keys(a).forEach(function(t) {
		let n = Number(t);
		e[n].content = Sf(e[n].content, a[t]);
	});
}
function wf(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && gf.test(e.tokens[t].content) && Cf(e.tokens[t].children, e);
}
function Tf(e) {
	let t, n, r = e.length;
	for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
	for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
	t !== n && (e.length = n);
}
function Ef(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text"), i[t].children && Tf(i[t].children);
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var Df = [
	["normalize", ef],
	["block", tf],
	["strip_references", nf],
	["inline", rf],
	["linkify", sf],
	["replacements", hf],
	["smartquotes", wf],
	["text_join", Ef]
], Of = class {
	constructor() {
		$(this, "ruler", new Jd()), $(this, "State", Zd);
		for (let e = 0; e < Df.length; e++) this.ruler.push(Df[e][0], Df[e][1]);
	}
	process(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}
}, kf = class {
	constructor(e, t, n, r) {
		$(this, "bMarks", []), $(this, "eMarks", []), $(this, "tShift", []), $(this, "sCount", []), $(this, "bsCount", []), $(this, "blkIndent", 0), $(this, "line", 0), $(this, "lineMax", 0), $(this, "tight", !1), $(this, "listIndent", -1), $(this, "parentType", "root"), $(this, "level", 0), $(this, "Token", qd), this.src = e, this.md = t, this.env = n, this.tokens = r;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) {
				if (jd(s)) {
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
		let r = new qd(e, t, n);
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
		for (let t = this.src.length; e < t && jd(this.src.charCodeAt(e)); e++);
		return e;
	}
	skipSpacesBack(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!jd(this.src.charCodeAt(--e))) return e + 1;
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
				if (jd(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}
}, Af = 65536;
function jf(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function Mf(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Nf(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !jd(s) || o === 45 && jd(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !jd(t)) return !1;
		a++;
	}
	let c = jf(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = jf(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = Mf(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
		if (r || (c = jf(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = Mf(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > Af)) break;
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
function Pf(e, t, n) {
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
function Ff(e, t, n, r) {
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
function If(e, t, n, r) {
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
				if (jd(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
function Lf(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !jd(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function Rf(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !jd(e.src.charCodeAt(r)) ? -1 : r;
}
function zf(e, t) {
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
	return i < r && (a = e.src.charCodeAt(i), !jd(a)) ? -1 : i;
}
function Bf(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Vf(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = zf(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Rf(e, c)) >= 0) d = !1;
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
			if (p = zf(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Rf(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && Bf(e, h), !0;
}
function Hf(e, t, n, r) {
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
		} else if (!jd(e)) break;
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
		} else if (!jd(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && jd(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && jd(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Id(c.slice(1, l));
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
var Uf = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), Wf = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", Gf = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Kf = RegExp(`^(?:${Wf}|${Gf}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`), qf = RegExp(`^(?:${Wf}|${Gf})`), Jf = [
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
		RegExp(`^</?(${Uf.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		!0
	],
	[
		RegExp(`${qf.source}\\s*$`),
		/^$/,
		!1
	]
];
function Yf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < Jf.length && !Jf[s][0].test(o); s++);
	if (s === Jf.length) return !1;
	if (r) return Jf[s][2];
	let c = t + 1, l = Jf[s][1].test("");
	if (!Jf[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), Jf[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function Xf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !jd(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && jd(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", `h${s}`, 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = Rd(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", `h${s}`, -1);
	return d.markup = "########".slice(0, s), !0;
}
function Zf(e, t, n) {
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
	let c = Rd(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", `h${a}`, 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", `h${a}`, -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function Qf(e, t, n) {
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
	let o = Rd(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var $f = [
	[
		"table",
		Nf,
		["paragraph", "reference"]
	],
	["code", Pf],
	[
		"fence",
		Ff,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		If,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		Lf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Vf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", Hf],
	[
		"html_block",
		Yf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Xf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", Zf],
	["paragraph", Qf]
], ep = class {
	constructor() {
		$(this, "ruler", new Jd()), $(this, "State", kf);
		for (let e = 0; e < $f.length; e++) this.ruler.push($f[e][0], $f[e][1], { alt: ($f[e][2] || []).slice() });
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
}, tp = class {
	constructor(e, t, n, r) {
		$(this, "pos", 0), $(this, "level", 0), $(this, "pending", ""), $(this, "pendingLevel", 0), $(this, "cache", {}), $(this, "backticks", {}), $(this, "backticksScanned", !1), $(this, "linkLevel", 0), $(this, "delimiters", []), $(this, "_prev_delimiters", []), $(this, "Token", qd), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
	}
	pushPending() {
		let e = new qd("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}
	push(e, t, n) {
		this.pending && this.pushPending();
		let r = new qd(e, t, n), i;
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
		let c = Fd(i) || Pd(i), l = Fd(s) || Pd(s), u = Md(i), d = Md(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}
};
function np(e) {
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
function rp(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !np(e.src.charCodeAt(n));) n++;
	return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function ip(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function ap(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function op(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = n - Math.min(10, e.pending.length, n), a = n;
	for (; a > i && ap(e.src.charCodeAt(a - 1));) a--;
	if (a === n || !ip(e.src.charCodeAt(a))) return !1;
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
function sp(e, t) {
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
	for (n++; n < i && jd(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var cp = [];
for (let e = 0; e < 256; e++) cp.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	cp[e.charCodeAt(0)] = 1;
});
function lp(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), jd(i));) n++;
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
		t.content = i < 256 && cp[i] !== 0 ? a : o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function up(e) {
	let t = {}, n = 0;
	for (; (n = e.indexOf("`", n)) !== -1;) {
		let r = n;
		for (; e.charCodeAt(++n) === 96;);
		t[n - r] = r;
	}
	return t;
}
function dp(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = e.posMax, i = n + 1;
	for (; i < r && e.src.charCodeAt(i) === 96;) i++;
	let a = e.src.slice(n, i), o = a.length;
	if (e.backticksScanned ||= (e.backticks = up(e.src), !0), (e.backticks[o] ?? -1) >= i) {
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
function fp(e, t) {
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
function pp(e, t) {
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
function mp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	pp(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && pp(e, n);
	}
}
var hp = {
	tokenize: fp,
	postProcess: mp
};
function gp(e, t) {
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
function _p(e, t) {
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
function vp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	_p(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && _p(e, n);
	}
}
var yp = {
	tokenize: gp,
	postProcess: vp
};
function bp(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), jd(n) || n === 10); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), jd(n) || n === 10); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), jd(n) || n === 10); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), r = Id(r), a = e.env.references[r], !a) return e.pos = u, !1;
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
function xp(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), jd(n) || n === 10); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), jd(n) || n === 10); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), jd(n) || n === 10); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), i = Id(i), o = e.env.references[i], !o) return e.pos = d, !1;
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
var Sp = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Cp = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function wp(e, t) {
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
	if (Cp.test(a)) {
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
	if (Sp.test(a)) {
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
function Tp(e) {
	return /^<a[>\s]/i.test(e);
}
function Ep(e) {
	return /^<\/a\s*>/i.test(e);
}
function Dp(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function Op(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !Dp(i)) return !1;
	let a = e.src.slice(r).match(Kf);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], Tp(t.content) && e.linkLevel++, Ep(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var kp = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Ap = /^&([a-z][a-z0-9]{1,31});/i;
function jp(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(kp);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = gd(t) ? _d(t) : _d(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(Ap);
		if (r) {
			let n = Ou(r[0]);
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
function Mp(e) {
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
function Np(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Mp(e.delimiters);
	for (let e = 0; e < n; e++) {
		let n = t[e]?.delimiters;
		n && Mp(n);
	}
}
function Pp(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Fp = [
	["text", rp],
	["linkify", op],
	["newline", sp],
	["escape", lp],
	["backticks", dp],
	["strikethrough", hp.tokenize],
	["emphasis", yp.tokenize],
	["link", bp],
	["image", xp],
	["autolink", wp],
	["html_inline", Op],
	["entity", jp]
], Ip = [
	["balance_pairs", Np],
	["strikethrough", hp.postProcess],
	["emphasis", yp.postProcess],
	["fragments_join", Pp]
], Lp = class {
	constructor() {
		$(this, "ruler", new Jd()), $(this, "ruler2", new Jd()), $(this, "State", tp);
		for (let e = 0; e < Fp.length; e++) this.ruler.push(Fp[e][0], Fp[e][1]);
		for (let e = 0; e < Ip.length; e++) this.ruler2.push(Ip[e][0], Ip[e][1]);
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
}, Rp = {
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
}, zp = /^(vbscript|javascript|file|data):/, Bp = /^data:image\/(gif|png|jpeg|webp);/, Vp = [
	"http:",
	"https:",
	"mailto:"
], Hp = class {
	validateLink(e) {
		let t = e.trim().toLowerCase();
		return !zp.test(t) || Bp.test(t);
	}
	normalizeLink(e) {
		let t = Jl(e, !0);
		if (t.hostname && (!t.protocol || Vp.indexOf(t.protocol) >= 0)) try {
			t.hostname = ud.toASCII(t.hostname);
		} catch {}
		return t.auth &&= Fl(t.auth), t.hostname &&= Fl(t.hostname), t.pathname &&= Fl(t.pathname), t.search &&= Fl(t.search), t.hash &&= Fl(t.hash), Il(t);
	}
	normalizeLinkText(e) {
		let t = Jl(e, !0);
		if (t.hostname && (!t.protocol || Vp.indexOf(t.protocol) >= 0)) try {
			t.hostname = ud.toUnicode(t.hostname);
		} catch {}
		return Ml(Il(t), Ml.defaultChars + "%");
	}
	constructor(...e) {
		$(this, "inline", new Lp()), $(this, "block", new ep()), $(this, "core", new Of()), $(this, "renderer", new Xd()), $(this, "linkify", new Lu()), $(this, "utils", pd), $(this, "helpers", Object.assign({}, Ud));
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
			if (t = Rp[n], !t) throw Error(`Wrong 'markdown-it' preset "${n}", check name`);
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
$(Hp, "Token", qd), $(Hp, "Ruler", Jd), $(Hp, "Renderer", Xd), $(Hp, "ParserCore", Of), $(Hp, "StateCore", Zd), $(Hp, "ParserBlock", ep), $(Hp, "StateBlock", kf), $(Hp, "ParserInline", Lp), $(Hp, "StateInline", tp);
var Up = md(Hp), Wp = {
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
}, Gp = new Set("txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split(" ")), Kp = "png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm".split(" ").sort((e, t) => t.length - e.length).join("|"), qp = `(?:~/|/|[A-Za-z]:[/\\\\])\\S+?(?:[^\\S\\n]+\\S+?)*?\\.(?:${Kp})(?=[\\s\`"'*_,;:)\\]}]|MEDIA:|$)`, Jp = RegExp(`MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${qp}|[^\\s\`"]+)`, "g");
function Yp(e) {
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
var Xp = new Up({ html: !0 });
for (let e of ["image", "link"]) {
	let t = Xp.inline.ruler.__rules__.find((t) => t.name === e).fn;
	Xp.inline.ruler.at(e, (n, r) => {
		let i = n.pos, a = n.tokens.length, o = t(n, r), s = n.tokens.slice(a).find((t) => t.type === (e === "image" ? "image" : "link_open"));
		return !r && s && (s.type === "image" || s.type === "link_open") && (s.meta = {
			deliveryRange: [i, n.pos],
			escapedImage: e === "link" && n.src[i - 1] === "!"
		}), o;
	});
}
function Zp(e, t, n = !1, r = {}) {
	n &&= !/^\s*["'“‘].*["'”’]\s*$/.test(e);
	let i = Xp.parseInline(e, r)[0]?.children || [], a = 0, o = 0;
	for (let r of i) {
		let i = r.type === "image" ? r.attrGet("src") : r.type === "link_open" ? r.attrGet("href") : void 0;
		if (typeof i != "string" || !i.startsWith("MEDIA:") && !(n && r.type === "link_open")) continue;
		let s;
		try {
			if (s = decodeURIComponent(i.startsWith("MEDIA:") ? i.slice(6) : i), !i.startsWith("MEDIA:") && !om(s, !0)) continue;
		} catch {
			continue;
		}
		if (!/^(?:\/(?!\/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)/i.test(s) || s.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) || !r.meta?.deliveryRange || r.meta.escapedImage) continue;
		let [c, l] = r.meta.deliveryRange;
		t(s, void 0, !i.startsWith("MEDIA:")) && i.startsWith("MEDIA:") && (c < o || (e = e.slice(0, c - a) + e.slice(l - a), a += l - c, o = l));
	}
	return e;
}
function Qp(e, t) {
	let n = [], r = 0;
	for (let t of e.matchAll(Jp)) {
		if (e.slice(r, t.index).trim()) return e;
		let i = Yp(t[1]);
		if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(i)) return e;
		n.push(i), r = t.index + t[0].length;
	}
	return !n.length || e.slice(r).trim() ? e : n.every((e) => !!tm(e)) && n.every((e) => t(e)) ? "" : e;
}
function $p(e, t) {
	let n = e.match(/^([A-Za-z][A-Za-z0-9 ()/_-]{0,79}:)[ \t]+(?=MEDIA:)/);
	if (!n) return e;
	let r = [];
	return Qp(e.slice(n[0].length), (e) => !/^(?:\/(?!\/)|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\)/.test(e) || e.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) ? !1 : (r.push(e), !0)) || !r.length ? e : (r.forEach((e) => t(e)), n[1]);
}
function em(e) {
	return e.split(".").at(-1)?.toLowerCase() || "";
}
function tm(e, t) {
	try {
		e.startsWith("#media:") && (e = decodeURIComponent(e.slice(7))), e.startsWith("sandbox:") && (e = e.slice(8)), e.startsWith("file:") && (e = decodeURIComponent(new URL(e).pathname));
	} catch {
		return;
	}
	if (!/^(\/|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(e)) return;
	let n = e.split(/[\\/]/).at(-1)?.split(/[?#]/)[0] || "";
	t = (t && /\.[a-z0-9]{1,12}$/i.test(t) ? t : n) || t || "Attached image";
	let r = em(t);
	return {
		path: e,
		name: t,
		type: Wp[r] || (Gp.has(r) ? "text/plain" : "application/octet-stream")
	};
}
function nm(e) {
	if (e.type.startsWith("image/") && e.type !== "image/svg+xml") return "image";
	if (e.type === "application/pdf") return "pdf";
	if (e.type.startsWith("audio/")) return "audio";
	if (e.type.startsWith("video/")) return "video";
	if (Gp.has(em(e.name))) return "text";
}
function rm(e, t = "", n = !1) {
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
var im = new Up({ html: !0 }), am = im.inline.ruler.__rules__.find((e) => e.name === "backticks").fn;
im.inline.ruler.at("backticks", (e, t) => {
	let n = e.pos, r = e.tokens.length, i = am(e, t), a = e.tokens.at(-1);
	return !t && e.tokens.length > r && a?.type === "code_inline" && (a.meta = { deliveryLines: [e.src.slice(0, n).split("\n").length - 1, e.src.slice(0, e.pos).split("\n").length - 1] }), i;
});
function om(e, t = !1) {
	return /^(?:\/(?!\/)|~\/)/.test(e) && !/[?#\\]/.test(e) && !e.split("").some((e) => e.charCodeAt(0) < 32 || e.charCodeAt(0) === 127) && RegExp(`\\.(?:${Kp})$`, "i").test(e) && (t || /^(?:~\/|\/)(?:[\p{L}\p{N}_.-]+\/)*[\p{L}\p{N}_.-]+$/u.test(e));
}
function sm(e, t = !0) {
	let n = [];
	if (!/MEDIA:|Attached (?:image|file) |\//.test(e)) return {
		text: e,
		files: n
	};
	let r = (e, t, r = !1) => {
		let i = tm(e, t);
		if (!i) return !1;
		r && (i.automatic = !0);
		let a = n.findIndex((e) => e.path === i.path);
		return a < 0 ? n.push(i) : n[a]?.automatic && !r && (n[a] = i), !0;
	}, i = e.split("\n"), a = [...i], o = !1, s = [], c = {}, l = im.parse(e, c), u = /* @__PURE__ */ new Set();
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
			l && r(l[2].trim(), l[1]) ? (o = !0, a[e] = "") : /^@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)\r?$/.test(n) ? s.push(e) : n.startsWith("MEDIA:") ? a[e] = Qp(n, r) : (a[e] = Zp($p(n, r), r, t, c), t && om(n.trim()) && r(n.trim(), void 0, !0));
		}
	}
	if (o) for (let e of s) a[e] = "";
	return {
		text: n.some((e) => !e.automatic) ? a.filter((e, t) => e !== "" || i[t] === "").join("\n").trim() : e,
		files: n
	};
}
function cm(e) {
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
	let a = sm(i);
	return a.text.trim() ? [] : a.files.map((e) => {
		let t = r.mime_type || r.mime;
		typeof t == "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(t) && (e.type = t);
		let n = r.size ?? r.bytes;
		return typeof n == "number" && Number.isSafeInteger(n) && n >= 0 && (e.size = n), e;
	});
}
function lm(e) {
	return sm(e, !1);
}
function um(e) {
	if (e.role !== "user" && e.role !== "assistant") return [];
	let { content: t } = e, n = (e.role === "user" ? lm : sm)(Tl(Array.isArray(t) ? t.filter((e) => e?.type === "text") : t)).files, r = n.filter((e) => nm(e) === "image");
	if (Array.isArray(t)) {
		let e = 0;
		for (let i of t) {
			let t = i?.image_url?.url;
			if (kl(t)) {
				if (r.length) {
					let n = r[e++];
					n && !t.startsWith("/api/plugins/chathermes/artifact-images/") && (n.imageData = t);
				} else {
					let e = tm(t, "Attached image.png");
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
var dm = {
	auto_continue: "Resuming interrupted turn…",
	process_complete: "Background process completed",
	async_delegation_complete: "Delegated work completed",
	model_switch: "Model changed",
	personality_switch: "Personality changed",
	failed_turn: "Response did not complete · verify any actions before resending"
};
function fm(e) {
	return e.display_kind === "compaction" ? "compaction" : e.display_kind === "hidden" ? "hidden" : e.display_kind && Object.hasOwn(dm, e.display_kind) ? "status" : e.role === "system" ? "hidden" : "message";
}
function pm(e) {
	let t = e.display_metadata;
	if (e.display_kind === "model_switch" && t && typeof t == "object") {
		let e = "model" in t && typeof t.model == "string" ? t.model : "";
		if (e) return `Model changed to ${e}`;
	}
	return t && typeof t == "object" && "display_text" in t && typeof t.display_text == "string" ? t.display_text : dm[e.display_kind || ""] || "";
}
function mm(e) {
	return e === "interrupted" ? "Response interrupted" : e === "cancelled" ? "Response cancelled" : e === "error" || e === "failed" ? "Response failed" : "Response completed";
}
//#endregion
//#region src/features/chat/runtime/assistant-turn.ts
var hm = (e) => typeof e == "string" ? e : "", gm = (e) => typeof e == "string" ? e : e == null ? "" : JSON.stringify(e, null, 2);
function _m(e) {
	let t = hm(e.subagent_id) || hm(e.child_session_id);
	if (t) return t;
	let n = hm(e.delegation_id);
	return n && typeof e.task_index == "number" && Number.isSafeInteger(e.task_index) ? `${n}:${e.task_index}` : "";
}
function vm(e) {
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
function ym(e, t = !1) {
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
var bm = () => ({
	blocks: [],
	seen: /* @__PURE__ */ new Set(),
	sequence: 0
});
function xm(e) {
	Sm(e);
	for (let t of e.blocks) t.kind !== "text" && (t.complete = !0, t.kind === "thinking" && (t.title = "Thought"), (!t.state || t.state === "running" || t.state === "pending") && (t.state = t.kind === "tool" ? "unknown" : "completed"));
}
function Sm(e) {
	for (let t of e.blocks) t.kind === "thinking" && (t.complete = !0, t.state = "completed", t.title = "Thought", t.duration === void 0 && t.startedAt !== void 0 && (t.duration = Math.max(0, (Date.now() - t.startedAt) / 1e3)));
}
function Cm(e, t) {
	if (t.key && e.seen.has(t.key)) return;
	t.key && e.seen.add(t.key);
	let { type: n, data: r } = t, i = hm(r.delta) || hm(r.text) || hm(r.preview), a = hm(r.tool_call_id) || hm(r.tool_id), o = hm(r.tool_name) || hm(r.name) || hm(r.tool), s = () => `block-${++e.sequence}`;
	if (n === "text" || n === "text.snapshot" || n === "text.completed") {
		Sm(e);
		let t = n === "text.completed" ? hm(r.content) : i;
		if (!t || n === "text.completed" && [...e.blocks].reverse().find((e) => e.kind === "text")?.content === t) return;
		let a = e.blocks.at(-1);
		if (n === "text.snapshot") {
			let n = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("");
			if (n === t || n.startsWith(t)) return;
			if (t.startsWith(n)) {
				Cm(e, {
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
	} else if (n === "reasoning.completed") Sm(e);
	else if (n.startsWith("tool.")) {
		Sm(e);
		let t = e.blocks.find((e) => e.kind === "tool" && a && e.id === a);
		if (!t && !a && (t = [...e.blocks].reverse().find((e) => e.kind === "tool" && !e.complete && (!o || e.toolName === o))), t || (t = {
			id: a || s(),
			kind: "tool",
			title: ym(o),
			toolName: o,
			content: "",
			complete: !1,
			state: "pending",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), n === "tool.started" && t.complete) return;
		n === "tool.started" ? (t.state = "running", t.content = gm(r.args) || i || t.content) : n === "tool.updated" ? (t.complete || (t.state = "running"), t.output = (t.output || "") + i) : (t.complete = !0, t.state = n === "tool.failed" || vm(r.output ?? r.result) || r.is_error || r.error ? "failed" : "completed", t.title = ym(t.toolName || o, !0), t.output = gm(r.output ?? r.result ?? r.error) || t.output || i, t.content = gm(r.args) || t.content, t.duration = typeof r.duration_s == "number" ? r.duration_s : t.startedAt ? Math.max(0, ((typeof r.ts == "number" ? r.ts * 1e3 : Date.now()) - t.startedAt) / 1e3) : void 0);
	} else {
		if (n === "failed") for (let t of e.blocks) t.kind === "tool" && !t.complete && (t.state = "failed", t.output ||= "The response ended before this tool completed.");
		xm(e);
	}
}
function wm(e) {
	let t = bm();
	for (let n of e) {
		if (n.blocks?.length) {
			t.blocks.push(...n.blocks);
			continue;
		}
		if (fm(n) === "message") {
			if (n.role === "assistant") {
				let e = n.reasoning_content || n.reasoning;
				e && (Cm(t, {
					type: "reasoning",
					data: {
						delta: e,
						persisted: !0
					}
				}), Sm(t));
				let r = Tl(n.content);
				r && t.blocks.push({
					id: `block-${++t.sequence}`,
					kind: "text",
					content: r
				});
				let i = Array.isArray(n.content) ? n.content.flatMap((e) => {
					let t = e?.image_url?.url;
					return kl(t) ? [t] : [];
				}) : [];
				if (i.length) {
					let e = t.blocks.at(-1);
					e?.kind !== "text" && (e = {
						id: `block-${++t.sequence}`,
						kind: "text",
						content: ""
					}, t.blocks.push(e)), e.images = i;
				}
				for (let e of n.tool_calls || []) Cm(t, {
					type: "tool.started",
					data: {
						tool_call_id: e.id,
						tool_name: e.function?.name,
						args: e.function?.arguments,
						persisted: !0
					}
				});
			} else if (n.role === "tool") {
				let e = Tl(n.content), r = !1;
				try {
					let t = JSON.parse(e);
					r = t?.is_error === !0 || t?.success === !1 || !!t?.error || typeof t?.exit_code == "number" && t.exit_code !== 0;
				} catch {}
				Cm(t, {
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
	return Sm(t), t.blocks;
}
function Tm(e, t, n) {
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
function Em(e, t) {
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
function Dm(e, t, n) {
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
			let t = hm(n.text).trim();
			if (!t) return;
			Sm(e);
			let o = i(r.streamText);
			if (!o) {
				let e = i(r.interimText ?? r.finalText);
				e && e.content.replace(/\s+/g, " ").trim() === t.replace(/\s+/g, " ").trim() && (o = e);
			}
			o ??= a(t), o.content = t, r.interimText = o.id, r.streamText = void 0, r.finalText = void 0, r.toolStream = !1;
		} else if (t === "message.delta" || t === "message.complete") {
			let o = hm(n.text);
			if (t === "message.delta" && o) {
				Sm(e);
				let t = i(r.streamText);
				(!t || t !== e.blocks.at(-1)) && (t = a("")), t.content += o, r.streamText = t.id, r.finalText = void 0;
			} else if (t === "message.complete" && o.trim() && (!n.response_reused || !e.blocks.some((e) => e.kind === "text"))) {
				Sm(e);
				let t = o.trim(), s = i(r.streamText), c = e.blocks.reduce((e, t, n) => t.kind === "tool" ? n : e, -1), l = s && e.blocks.indexOf(s) > c ? s : void 0, u = i(r.interimText), d = !!(n.error || n.status && n.status !== "complete"), f = !d && u && u.content.trim() === t && (!l || l.content.trim() === t), p = !d && !l && !r.toolStream && u && u.content.trim() && (n.response_previewed || n.response_transformed || u.content.trim() === t || t.startsWith(u.content.trim()) || u.content.trim().startsWith(t) || Em(u.content.trim(), t)), m;
				if (f || p) m = u, l && l !== u && e.blocks.splice(e.blocks.indexOf(l), 1);
				else {
					let e = i(r.finalText);
					m = l ?? (e?.content.trim() === t ? e : a(""));
				}
				m.content = t, r.finalText = m.id, r.streamText = void 0, r.interimText = void 0, r.toolStream = !1;
			}
			if (t === "message.complete") {
				for (let t of e.blocks) t.kind !== "text" && !t.delegated && (t.complete = !0, (!t.state || t.state === "running" || t.state === "pending") && (t.state = n.status === "cancelled" || n.status === "interrupted" ? "interrupted" : "unknown"));
				n.reasoning && !e.blocks.some((e) => e.kind === "thinking") && Cm(e, {
					type: "reasoning",
					data: { text: n.reasoning }
				}), Sm(e);
			}
		} else if (t === "reasoning.delta" || t === "reasoning.available") {
			if (t === "reasoning.available") {
				let t = i(r.streamText ?? r.finalText)?.content.trim();
				if (t && t.slice(0, 500).trim() === hm(n.text).trim()) return;
				let a = [...e.blocks].reverse().find((e) => e.kind === "thinking");
				if (a && a.kind === "thinking") {
					a.content = hm(n.text);
					return;
				}
			}
			Cm(e, {
				type: "reasoning",
				data: {
					...n,
					delta: n.text
				}
			});
		} else if (t === "tool.start" || t === "tool.complete" || t === "tool.progress") {
			t === "tool.start" && (r.toolStream = !0);
			let i = n.result, a = n.is_error || n.error || vm(i) || vm(n.result_text);
			Cm(e, {
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
			let r = _m(n);
			if (!r) return;
			Cm(e, {
				type: [
					"subagent.complete",
					"subagent.failed",
					"subagent.cancelled"
				].includes(t) ? t === "subagent.complete" && n.status === "completed" ? "tool.completed" : "tool.failed" : "tool.updated",
				data: {
					tool_call_id: "subagent-" + r,
					tool_name: hm(n.name) || "Delegated task",
					delta: hm(n.text),
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
function Om(e) {
	let t = e.messages.map((e) => Object.hasOwn(e, "display_content") ? {
		...e,
		content: e.display_content
	} : e).filter((e) => fm(e) !== "hidden" || !!e.blocks?.length), n = [], r = (e) => [...e].reverse().find((e) => e.role === "assistant" && Tl(e.content).trim())?.id, i = 0;
	for (let a = 0; a < t.length;) {
		let o = t[a];
		if (fm(o) === "compaction") {
			n.push({
				kind: "compaction",
				key: o.id || `compaction-${a}`
			}), a++;
			continue;
		}
		if (o.role === "user" || fm(o) === "status") {
			let s = fm(o);
			if (o.display_kind === "async_delegation_complete") {
				let e = o.id || `delegation-${a}`;
				n.push({
					kind: "turn",
					key: `receipt-${e}`,
					blocks: [{
						id: `receipt-${e}`,
						kind: "tool",
						title: pm(o),
						content: Tl(o.content),
						complete: !0,
						state: "completed"
					}]
				});
			} else s === "status" ? n.push({
				kind: "status",
				text: pm(o),
				content: Tl(o.content),
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
			for (; c < t.length && t[c].role !== "user" && fm(t[c]) === "message";) c++;
			let l = c === t.length, u = l && (!e.turnUserCount || e.turnUserCount === i) && e.blocks?.length ? e.blocks : o.blocks?.length ? o.blocks : wm(t.slice(a + 1, c)), d = u.length ? u : l ? e.progress : [], f = l && (e.working ?? !!((o.blocks || e.blocks?.length || e.progress.length) && d.some((e) => e.kind !== "text" && !e.complete)));
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
			for (; e < t.length && t[e].role !== "user" && fm(t[e]) === "message";) e++;
			n.push({
				kind: "turn",
				blocks: wm(t.slice(a, e)),
				responseId: r(t.slice(a, e)),
				key: o.display_id || o.id ? `history-${o.display_id || o.id}` : `history-${a}`
			}), a = e;
		}
	}
	return n;
}
//#endregion
//#region src/features/chat/utils/saved-response-targets.ts
function km(e) {
	let t = Tl(e.content);
	lm(t).files.length && (t = t.replace(/\n@file:[^\n]+\n\n--- Attached Context ---\n[\s\S]*$/, ""));
	let n = lm(t);
	return JSON.stringify([n.text, n.files.map((e) => e.path).sort()]);
}
function Am(e, t) {
	let n = (e) => Om({
		messages: e,
		progress: []
	}).flatMap((e) => {
		if (e.kind === "user") return [{
			kind: "user",
			text: km(e.message),
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
var jm = (e, t) => "chathermes.native-outcome:" + JSON.stringify([e || "default", t]), Mm = (e, t) => e && e !== "default" ? [jm(e, t)] : [jm("default", t), "chathermes.native-outcome:" + JSON.stringify(["", t])];
function Nm(e, t) {
	try {
		let n = Mm(e, t);
		return Object.keys(localStorage).some((e) => n.some((t) => e === t || e.startsWith(t + ":")) && localStorage.getItem(e) === "unknown");
	} catch {
		return !0;
	}
}
function Pm(e, t) {
	let n = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
	try {
		localStorage.setItem(jm(e, t) + ":" + n, "unknown");
	} catch {
		throw Error("Cannot safely record native submission state");
	}
	return n;
}
function Fm(e, t, n) {
	try {
		for (let r of Mm(e, t)) if (n) localStorage.removeItem(r + ":" + n);
		else for (let e of Object.keys(localStorage)) (e === r || e.startsWith(r + ":")) && localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/features/chat/runtime/persisted-live-turn.ts
function Im(e) {
	let t = e.assistant ?? "", n = e.corrections ?? [], r = e.correction_offsets;
	if (!n.length) return [t];
	let i = Array.from(t);
	return r?.length === n.length && r.every((e, t) => Number.isInteger(e) && e >= 0 && e <= i.length && (!t || e >= r[t - 1])) ? [...r, i.length].map((e, t) => i.slice(t ? r[t - 1] : 0, e).join("")) : [t, ...n.map(() => "")];
}
function Lm(e, t) {
	let n = e.trimStart(), r = t.trim();
	return r ? n.startsWith(r) ? n.slice(r.length) : r.startsWith(n) ? "" : e : e;
}
var Rm = (e) => !!e.tool_calls?.length, zm = (e) => String(e ?? "").split("\n").filter((e) => !/^@(file|folder|url|image|tool|line|terminal|session):(`[^`\n]+`|"[^"\n]+"|'[^'\n]+'|\S+)$/.test(e.trimEnd())).join("\n").trim();
function Bm(e, t) {
	let n;
	for (let r = e.length - 1; r >= 0; r--) {
		let i = e[r];
		if (i.role === "assistant" && !Rm(i) && typeof i.content == "string" && i.content.trim()) break;
		if (i.role !== "user" || i.display_kind === "steer" || zm(i.content) !== zm(t.user) || !i.id) continue;
		let a = [[]], o = [i], s = !0;
		for (let n of e.slice(r + 1)) if (n.role === "user") {
			if (!n.id || zm(n.content) !== zm(t.corrections?.[a.length - 1])) {
				s = !1;
				break;
			}
			o.push(n), a.push([]);
		} else if (n.role === "assistant") {
			if (!Rm(n) || typeof n.content != "string" || n.display_kind === "hidden" || n.content.trim() && !n.id) {
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
function Vm(e, t, n, r) {
	let i = /* @__PURE__ */ R(), a = /* @__PURE__ */ R(null), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(!1), c = !1, l = 0, u = 0;
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
	let _ = /* @__PURE__ */ R(!1), v = /* @__PURE__ */ R(!1), y = /* @__PURE__ */ R(""), b, x = 0, S = !1, C = !1, w;
	async function T(e, t = 0) {
		let n = Math.max(120, t, b?.nextOffset || 0), r = b?.messages.find((e) => e.display_kind !== "compaction"), i = r?.display_id || r?.id, a = (e) => !i || e.some((e) => (e.display_id || e.id) === i), o = L, s = be;
		for (let t = 0;; t++) try {
			let t = await Q.latestMessages(o, s, e), r = JSON.stringify(t.messages);
			for (; t.hasMore && (t.nextOffset < n || !a(t.messages));) {
				let n = await Q.latestMessages(o, s, e, t.nextOffset, t.revision);
				if (t.revision && n.revision !== t.revision) throw new fl(409, "Transcript changed");
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
				if (JSON.stringify(t.messages) !== r) throw new fl(409, "Transcript changed");
			}
			return t;
		} catch (e) {
			if (!(e instanceof fl) || e.status !== 409 || t >= 2) throw e;
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
				await je(n.nextOffset + 120);
				return;
			}
			let r = new AbortController();
			w?.abort(), w = r;
			let i = await Q.latestMessages(L, be, r.signal, n.nextOffset, n.revision);
			if (e !== P || t !== x || b !== n) return;
			if (i.revision !== n.revision) throw new fl(409, "Transcript changed");
			if (i.hasMore && i.nextOffset <= n.nextOffset) throw Error("History pagination did not advance");
			let a = new Set(k.value.map((e) => e.id).filter(Boolean)), o = i.messages.filter((e) => !e.id || !a.has(e.id));
			k.value = [...o, ...k.value], E({
				...i,
				messages: [...i.messages, ...n.messages]
			});
		} catch (n) {
			if (e !== P || t !== x) return;
			n instanceof fl && n.status === 409 ? await je() : y.value = "Could not load earlier messages. Try again.";
		} finally {
			e === P && (v.value = !1);
		}
	}
	let O = /* @__PURE__ */ R({}), k = /* @__PURE__ */ R([]), A = /* @__PURE__ */ R(!1), ee = /* @__PURE__ */ R(!1), j = /* @__PURE__ */ R(""), te = /* @__PURE__ */ R(""), M = /* @__PURE__ */ R("stale"), N = /* @__PURE__ */ R(0), ne = /* @__PURE__ */ R([]), re = /* @__PURE__ */ R(!1), ie = X(() => {
		let e = ne.value[0];
		return e ? {
			...e.params,
			request_id: e.id,
			kind: e.method
		} : void 0;
	}), ae, P = 0, oe = !1, se = !1, ce = 0, le, ue = !1, de = document.visibilityState !== "hidden", fe = navigator.onLine, F, I, pe = [], me = !1, he, ge = !1, _e = "", ve = "", ye = /* @__PURE__ */ new Set(), L = "", be = "", xe = !1, Se = !1, Ce = 0, we, Te = () => {
		I && F && (I.blocks = F.blocks), k.value = [...k.value];
	}, Ee = (e) => {
		P = e, N.value = e;
	};
	function De() {
		se && (se = !1, t?.(L, be));
	}
	function Oe(e) {
		ue && L && be && n?.(L, be, e);
	}
	function ke(e, t = !1, n, r = {}) {
		if (xe && !t && I && (n ? n === _e : !r.display_kind && e === ve)) {
			xe = !1, Te();
			return;
		}
		xe = !1, t && I && F && (Cm(F, {
			type: "reasoning.completed",
			data: {}
		}), pe.push({
			user: I,
			turn: F,
			hasCorrections: !0
		})), Se = t || !1, I = {
			id: `native-user-${++Ce}`,
			role: "user",
			content: e,
			display_kind: r.display_kind,
			display_metadata: r.display_metadata
		}, k.value.push(I), F = /* @__PURE__ */ Ft(bm()), I.blocks = F.blocks, A.value = !0, Te();
	}
	function Ae(e, t) {
		t === P && ue && be && (i.value = {
			profile: L,
			session: be,
			info: e.info,
			generation: t
		}), oe = !0, me = e.messages_omitted === !0, he = e.inflight, ge = !!e.queued, ce++, we = void 0, F = void 0, I = void 0, xe = !1, pe = [];
		let n = e.messages.map((e) => ({
			...e,
			id: e.row_id == null ? void 0 : String(e.row_id),
			content: e.role === "tool" ? e.content : e.text || e.content || "",
			tool_name: e.name
		})), r = new Set(e.recovery.base_row_ids || []), a = e.recovery.complete ? n.filter((e) => e.id && r.has(e.id)) : n, o = new Set(b?.messages.map((e) => e.id));
		if (k.value = b ? [...b.messages, ...a.filter((e) => !o.has(e.id))] : a, A.value = !!(e.running || e.queued), me && e.inflight?.user) {
			let t = Bm(k.value, e.inflight);
			t && (k.value = k.value.slice(0, t.start));
		}
		if (!e.recovery.complete && e.inflight?.user) {
			let t = k.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
			if (me || t < 0 || Tl(k.value[t].content) !== e.inflight.user || (k.value[t].display_kind || void 0) !== (e.inflight.display_kind || void 0)) ke(e.inflight.user, !1, void 0, {
				display_kind: e.inflight.display_kind || void 0,
				display_metadata: e.inflight.display_metadata
			});
			else {
				I = k.value[t], F = /* @__PURE__ */ Ft(bm());
				let e = wm(k.value.slice(t + 1));
				Tm(F, e, A.value), I.blocks = F.blocks;
			}
			let n = Im(e.inflight);
			n[0] && !F.blocks.some((e) => e.kind === "text") && Cm(F, {
				type: "text.snapshot",
				data: { text: n[0] }
			});
			for (let [t, r] of (e.inflight.corrections || []).entries()) ke(r, !0), n[t + 1] && Cm(F, {
				type: "text.snapshot",
				data: { text: n[t + 1] }
			});
			e.inflight.error && (j.value = e.inflight.error), te.value = fm(I) === "status" ? pm(I) : e.running ? "Working…" : mm(e.inflight.status), e.running && !e.inflight.error && (j.value = "Earlier progress is outside retained recovery; saved history is authoritative.");
		}
		A.value = !!(e.running || e.queued);
	}
	async function je(t = 0) {
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
			if (E(o), me && !A.value && I && F && !Se && !pe.some((e) => e.hasCorrections)) {
				let e = u.reduce((e, t, n) => t.role === "user" ? n : e, -1), t = u[e];
				t && (t.display_kind || void 0) === (I.display_kind || void 0) && Object.keys(Am([I], u.slice(e))).length && (Tm(F, wm(u.slice(e + 1)), !1), u[e] = {
					...t,
					display_id: I.display_id || I.id,
					blocks: F.blocks
				}, I = void 0, F = void 0, pe = [], me = !1, j.value === "Earlier progress is outside retained recovery; saved history is authoritative." && (j.value = ""));
			}
			if (A.value || (O.value = Am(k.value, u)), A.value && me && he && I && F && !ge) {
				let e = Bm(u, he), t = [...pe, {
					user: I,
					turn: F,
					hasCorrections: Se
				}];
				if (e && e.intervals.length <= t.length) {
					for (let [n, r] of t.entries()) {
						let t = e.intervals[n] || [], i = e.users[n];
						i && (r.user.display_id ||= r.user.id, r.user.id = i.id, r.user.content = i.content);
						let a = [...r.turn.blocks], o = a.findIndex((e) => e.kind === "text"), s = t.filter((e) => e.role === "assistant").map((e) => Tl(e.content)).filter((e) => e.trim()).join("\n\n"), c = a.flatMap((e, t) => {
							if (t !== o) return [e];
							let n = Lm(e.content, s);
							return n.trim() || e.kind === "text" && e.images?.length ? [{
								...e,
								content: n
							}] : [];
						});
						r.turn.blocks = [], r.turn.native = void 0, Tm(r.turn, wm(t), !0);
						for (let e of c) {
							let t = e.kind === "tool" ? r.turn.blocks.find((t) => t.kind === "tool" && t.id === e.id) : void 0;
							t && e.kind === "tool" ? e.complete && Object.assign(t, e) : r.turn.blocks.push(e);
						}
						r.user.blocks = r.turn.blocks;
					}
					k.value = [...u.slice(0, e.start), ...t.map((e) => e.user)], he = void 0, Te();
					return;
				}
			}
			if (A.value && I && F) {
				let e = we?.user_row_id, t = e ? u.findIndex((t) => t.id === String(e)) : -1;
				t >= 0 && Tm(F, wm(u.slice(t + 1)), !0);
				let n = pe[0]?.user || I, r = k.value.findIndex((e) => e === n || !!(e.id && e.id === n.id));
				if (r >= 0) {
					let e = new Set(k.value.slice(0, r).map((e) => e.id)), t = u.reduce((t, n, r) => e.has(n.id) ? r : t, -1), n = t >= 0 ? u.slice(0, t + 1) : [], i = u.reduce((e, t, n) => t.role === "user" ? n : e, -1), a = u[i];
					me && !ge && !Se && !pe.length && a && (a.display_kind || void 0) === (I.display_kind || void 0) && km(a) === km(I) && (n = u.slice(0, i), Tm(F, wm(u.slice(i + 1)), !0)), k.value = [...n, ...k.value.slice(r)];
				}
				Te();
				return;
			}
			if (I && F && !pe.length || pe.some((e) => e.hasCorrections)) return Te(), !0;
			for (let e of pe) {
				let { turn: t, receipt: n } = e, r = n?.user_row_id == null ? -1 : u.findIndex((e) => e.id === String(n.user_row_id)), i = r + 1;
				for (; i < u.length && u[i]?.role !== "user";) i++;
				r >= 0 && Tm(t, wm(u.slice(r + 1, i)), !1);
				let a = new Set(u.map((e) => e.id)), o = u.find((e) => e.id === String(n?.final_assistant_row_id)), s = [...t.blocks].reverse().find((e) => e.kind === "text")?.content || "";
				if (!(n?.complete && r >= 0 && n.row_ids.every((e) => a.has(String(e))) && o && Tl(o.content).trim() === s.trim())) return Te(), !0;
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
	async function Me(e, t) {
		(!ue || L !== e || be !== t) && (ze(), Ee(P + 1), L = e, be = t, ue = !0, se = !0, re.value = Nm(L, be)), await Fe();
	}
	function Ne() {
		f(), w?.abort(), w = void 0, x++, S = !1, C = !1, v.value = !1, Ee(P + 1), ce++, ae?.close(), ae = void 0, le = void 0, oe = !1, ee.value = !1, M.value = "stale";
	}
	function Pe(e, t) {
		let n = de !== e || fe !== t;
		return de = e, fe = t, !de || !fe ? (!de && fe && ae?.retainWhileHidden && M.value === "ready" || ue && M.value !== "stale" && Ne(), Promise.resolve()) : n ? Fe() : le || Promise.resolve();
	}
	function Fe() {
		if (!ue || !de || !fe || M.value === "ready") return Promise.resolve();
		if (le) return le;
		let e = ++P;
		N.value = e, ce++, oe = !0, ee.value = k.value.length === 0, M.value = "reconnecting";
		let t = [], n = (n) => {
			e === P && (t ? t.push(n) : n());
		}, i = new ll(L, be, {
			snapshot: (r) => {
				t = [], n(() => {
					j.value = re.value ? "Submission outcome unknown. Inspect history and native state before sending again." : "", te.value = "", ne.value = [], Ae(r, e);
				});
			},
			input: (e, t, r, i) => n(() => ke(e, t, r, i)),
			event: (e) => n(() => {
				let t = e.payload || {};
				e.type === "session.usage" && p(e.payload.usage);
				let n = typeof t.text == "string" ? t.text : "";
				(e.type === "session.title" || e.type === "session.info") && typeof t.title == "string" && Oe(t.title), e.type === "message.start" ? (De(), A.value = !0, te.value = I && fm(I) === "status" ? pm(I) : "Working…", we = void 0) : e.type === "thinking.delta" || e.type === "tool.generating" ? te.value = e.type === "tool.generating" ? "Preparing " + (typeof t.name == "string" && t.name ? t.name : "tool") : n || "Working…" : e.type === "status.update" ? te.value = n : e.type === "notice" ? te.value = typeof t.message == "string" ? t.message : "" : e.type === "error" ? j.value = typeof t.message == "string" ? t.message : "Session failed" : e.type === "session.reclaimed" && (f(), h(), c && m(), A.value = !1, te.value = "Session reclaimed"), !F && I && (F = /* @__PURE__ */ Ft(bm()));
				let i = F;
				if (e.type.startsWith("subagent.") || e.type.startsWith("tool.")) {
					let n = e.type.startsWith("subagent.") ? "subagent-" + _m(t) : t.tool_id;
					i = [...pe].reverse().find((e) => e.turn.blocks.some((e) => e.id === n))?.turn || F;
				}
				if (i && Dm(i, e.type, {
					...t,
					persisted: oe
				}), e.type === "message.complete") {
					oe || r?.(L, be), d(), p(e.payload.usage, !1), oe || (h(), c && m()), xe = !1;
					for (let e of pe) Dm(e.turn, "message.complete", { status: t.status });
					we = t.persisted_turn, I && F && !pe.some((e) => e.user === I && e.turn === F) && pe.push({
						user: I,
						turn: F,
						receipt: we,
						hasCorrections: Se
					}), A.value = !1, te.value = mm(t.status), typeof t.status == "string" && t.status && t.status !== "complete" && (j.value = typeof t.error == "string" && t.error ? t.error : "Response " + t.status), oe || je();
				} else e.type === "subagent.complete" && !A.value && !oe && je();
				Te();
			}),
			requests: (e) => n(() => {
				ne.value = e;
			}),
			connection: (t, r) => {
				if (e === P) {
					if (t === "closed") {
						let e = M.value === "ready";
						Ne(), j.value = r || "Session connection lost. Reconnect to restore this session.", te.value = "Disconnected · backend state will be checked on reconnect";
						let t = P;
						e && queueMicrotask(() => {
							P === t && ue && M.value === "stale" && Fe();
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
				oe = !1, ee.value = !1, M.value = "ready", r?.(L, be), h(), c && m(), je();
			}
		});
		ae = i;
		let a = (async () => {
			try {
				if (await i.ensure(), e === P && M.value !== "ready") throw new Z("Native session reconstruction did not become ready");
			} catch {
				e === P && (Ne(), j.value = "Could not reconnect this session. Retry when the dashboard is available.");
			} finally {
				e === P && (le = void 0);
			}
		})();
		return le = a, a;
	}
	async function Ie(e, t, n, r) {
		if (!de || !fe || !ae || A.value || re.value || ee.value || M.value !== "ready") throw new Z("Native session is not ready. Message not submitted.", "rejected");
		let i = P, a = ae, o = Pm(L, be);
		re.value = !0, j.value = "", xe = !1, ke(e), I.content = r ?? t, xe = !0, _e = o, ve = e, ye.add(o);
		let s = I.id, c = !1;
		try {
			let e = typeof t == "function" ? await t() : t;
			if (i !== P || !de || !fe) throw new Z("Viewer detached before submission", "rejected");
			c = !0, await a.rpc("prompt.submit", {
				input: e,
				admission_id: o,
				...n
			}), Fm(Le(a), a.stored, o), i === P && (re.value = !1), ue && L === a.profile && be === a.stored && _e === o && De();
		} catch (e) {
			throw !c || e instanceof Z && e.outcome === "rejected" ? (Fm(Le(a), a.stored, o), ue && L === a.profile && be === a.stored && _e === o && (k.value = k.value.filter((e) => e.id !== s), re.value = Nm(L, be), xe = !1, I?.id === s && (A.value = !1, F = void 0, I = void 0))) : i === P && (j.value = "Submission outcome unknown. Inspect history and native state before sending again."), e;
		} finally {
			ye.delete(o);
		}
	}
	let Le = (e) => e.profile;
	async function Re() {
		if (!ue || (M.value !== "ready" && await Fe(), M.value !== "ready") || ye.has(_e)) return;
		let e = P, t = ae, n = t.boundary;
		try {
			let r = await t.rpc("state");
			if (e !== P || t.boundary !== n || ye.has(_e)) return;
			if (r.running !== !1 || r.queued || r.delegating) {
				j.value = "Hermes is still working; sending remains locked.";
				return;
			}
			A.value = !1, await je() && e === P && t.boundary === n && !A.value && (Fm(L, be), re.value = Nm(L, be), re.value || (j.value = ""));
		} catch {
			e === P && (j.value = "Could not verify native session state; sending remains locked.");
		}
	}
	function ze() {
		Ne(), ue = !1, c = !1, i.value = void 0, se = !1, _e = "", k.value = [], b = void 0, me = !1, he = void 0, _.value = !1, y.value = "", O.value = {}, A.value = !1, ee.value = !1, ne.value = [], re.value = !1, j.value = "", te.value = "", F = void 0, I = void 0, pe = [];
	}
	function Be() {
		if (!ae || M.value !== "ready") throw new Z("Session is read-only until reconnected", "rejected");
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
		attach: Me,
		submit: Ie,
		close: ze,
		hydrate: je,
		resolveUncertainty: Re,
		reconnect: Fe,
		availability: Pe,
		stop: () => Be().rpc("session.interrupt"),
		steer: (e) => Be().rpc("session.steer", { text: e }),
		answer: (e, t) => Be().answer(e, t)
	};
}
//#endregion
//#region src/features/notifications/services/push.ts
var Hm = "/api/plugins/chathermes", Um;
function Wm() {
	return typeof window < "u" && window.isSecureContext && typeof navigator < "u" && "serviceWorker" in navigator && "PushManager" in window && typeof Notification < "u";
}
async function Gm() {
	if (!Wm()) throw Error("Notifications require a secure browser with Push API support.");
	return Um ||= navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
		scope: "/chathermes",
		updateViaCache: "none"
	}).catch((e) => {
		throw Um = void 0, e;
	}), Um;
}
function Km(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4));
	return Uint8Array.from(n, (e) => e.charCodeAt(0));
}
async function qm() {
	let e = await fetch(Hm + "/push/config", { credentials: "same-origin" });
	if (!e.ok) throw Error("Push configuration unavailable");
	return e.json();
}
async function Jm() {
	return (await Gm()).pushManager.getSubscription();
}
async function Ym(e, t) {
	let n = await fetch(Hm + "/push/status" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ endpoint: t.endpoint })
	});
	if (!n.ok) throw Error("Could not load notification status for this profile.");
	return n.json();
}
async function Xm(e = "") {
	if (!Wm()) return {
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: "Notifications require HTTPS and a supported browser."
	};
	try {
		let [t, n] = await Promise.all([Jm(), qm()]), r = t ? await Ym(e, t) : null;
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
async function Zm(e) {
	if (!Wm()) throw Error("Notifications require HTTPS and a supported browser.");
	let t = await Notification.requestPermission();
	if (t !== "granted") throw Error(t === "denied" ? "Notification permission is blocked in browser settings." : "Notification permission was not granted.");
	let n = await Gm(), r = await qm();
	if (!r.available || !r.vapid_public_key) throw Error("Push notifications are unavailable on this server.");
	let i = await n.pushManager.subscribe({
		userVisibleOnly: !0,
		applicationServerKey: Km(r.vapid_public_key)
	});
	if (!(await fetch(Hm + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			endpoint: i.endpoint,
			keys: i.toJSON().keys
		})
	})).ok) throw Error("Could not save this notification subscription.");
}
async function Qm(e) {
	let t = await Jm();
	if (!t) return;
	let n = await Ym(e, t);
	if (n.enabled && n.id && !(await fetch(Hm + "/push/subscriptions/" + encodeURIComponent(n.id) + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "DELETE",
		credentials: "same-origin"
	})).ok) throw Error("Could not disable notifications for this profile.");
}
async function $m(e) {
	if (!(await fetch(Hm + "/push/test" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin"
	})).ok) throw Error("Could not send a test notification.");
}
//#endregion
//#region src/features/notifications/services/push-client.ts
function eh(e, t, n = document.visibilityState) {
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
function th(e, t, n) {
	let r = !0, i = null, a = () => eh(t(), n()), o = () => {
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
var nh = Symbol("live chat");
function rh(e) {
	Nn(nh, e);
}
function ih() {
	let e = Pn(nh);
	if (!e) throw Error("Live chat context is missing");
	return e;
}
var ah = Symbol("conversation focus");
//#endregion
//#region src/features/chat/utils/context-usage.ts
function oh(e) {
	return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : null;
}
function sh(e) {
	let t = oh(e?.context_percent);
	return t !== null && t <= 100 ? t : null;
}
//#endregion
//#region src/features/chat/components/ContextUsagePopover.vue?vue&type=script&setup=true&lang.ts
var ch = {
	role: "dialog",
	"aria-label": "Context usage",
	class: "context-panel rounded-2xl border border-[#424242] bg-[#212121] p-3 text-sm text-white shadow-xl"
}, lh = { class: "flex items-center justify-between gap-3" }, uh = { class: "mt-1 break-all" }, dh = { class: "text-[#b4b4b4]" }, fh = {
	key: 0,
	class: "mt-2 text-[#b4b4b4]"
}, ph = {
	key: 1,
	class: "text-amber-200"
}, mh = {
	key: 2,
	class: "text-[#b4b4b4]"
}, hh = {
	key: 3,
	class: "mt-2 text-[#b4b4b4]",
	role: "status"
}, gh = {
	class: "context-breakdown-bar mt-2 flex h-2 overflow-hidden rounded-full bg-[#424242]",
	"aria-hidden": "true"
}, _h = { class: "mt-2 space-y-1" }, vh = { class: "flex min-w-0 items-center gap-2" }, yh = { class: "shrink-0" }, bh = {
	key: 5,
	class: "mt-2 text-[#b4b4b4]"
}, xh = /* @__PURE__ */ V({
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
		}, r = X(() => (t.breakdown?.categories || []).filter((e) => e && typeof e.label == "string" && oh(e.tokens) !== null).map((e) => ({
			...e,
			color: n[e.id] || "#a3a3a3"
		}))), i = X(() => r.value.reduce((e, t) => e + t.tokens, 0)), a = X(() => sh(t.usage) === null ? t.breakdown : t.usage), o = X(() => sh(a.value)), s = (e) => oh(e)?.toLocaleString() ?? "—", c = X(() => a.value?.context_estimated || ["local_estimate", "provider_usage_plus_estimate"].includes(a.value?.context_source || ""));
		return (t, n) => (W(), G("section", ch, [
			q("div", lh, [n[1] ||= q("strong", null, "Context usage", -1), q("button", {
				type: "button",
				"aria-label": "Close context usage",
				class: "px-2 text-base",
				onClick: n[0] ||= (e) => t.$emit("close")
			}, " × ")]),
			q("p", uh, L(e.usage?.model || e.breakdown?.model || e.model || "Current model"), 1),
			q("p", dh, L(s(a.value?.context_used)) + " / " + L(s(a.value?.context_max)) + " tokens · " + L(o.value === null ? "Unknown" : `${Math.round(o.value)}%`), 1),
			o.value === null ? (W(), G("p", fh, "Context usage unavailable")) : Y("v-if", !0),
			c.value ? (W(), G("p", ph, "Estimated usage")) : Y("v-if", !0),
			z(oh)(e.usage?.compressions) === null ? Y("v-if", !0) : (W(), G("p", mh, L(e.usage?.compressions) + " compressions ", 1)),
			e.loading ? (W(), G("p", hh, "Loading context breakdown…")) : r.value.length ? (W(), G(U, { key: 4 }, [
				n[2] ||= q("p", { class: "mt-3 text-[#b4b4b4]" }, "Estimated breakdown", -1),
				q("div", gh, [(W(!0), G(U, null, H(r.value, (e, t) => (W(), G("span", {
					key: `${e.id}-${t}`,
					style: oe({
						width: i.value > 0 ? `${e.tokens / i.value * 100}%` : "0%",
						backgroundColor: e.color
					})
				}, null, 4))), 128))]),
				q("dl", _h, [(W(!0), G(U, null, H(r.value, (e, t) => (W(), G("div", {
					key: `${e.id}-${t}`,
					class: "flex items-center justify-between gap-3"
				}, [q("dt", vh, [q("span", {
					class: "size-2 shrink-0 rounded-full",
					style: oe({ backgroundColor: e.color }),
					"aria-hidden": "true"
				}, null, 4), J(L(e.label), 1)]), q("dd", yh, L(s(e.tokens)) + " tokens", 1)]))), 128))])
			], 64)) : (W(), G("p", bh, " Context breakdown unavailable until the agent has initialized. "))
		]));
	}
}), Sh = [
	"aria-label",
	"aria-expanded",
	"aria-controls"
], Ch = {
	viewBox: "0 0 30 30",
	class: "absolute inset-0 size-full -rotate-90",
	"aria-hidden": "true"
}, wh = ["stroke-dasharray"], Th = /* @__PURE__ */ V({
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
		let n = e, r = t, i = /* @__PURE__ */ R(), a = /* @__PURE__ */ R(), o = /* @__PURE__ */ R(!1), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(360), l = qn(), u, d, f = X(() => sh(n.usage)), p = X(() => f.value === null ? "text-[#a3a3a3]" : f.value >= 90 ? "text-red-200" : f.value >= 75 ? "text-amber-200" : "text-emerald-200");
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
			h(), n.active && !o.value && (m(), o.value = !0, yn(m));
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
		return Ln(o, (e) => r("open", e), { flush: "sync" }), Ln(() => n.active, (e) => {
			e || g();
		}), cr(() => {
			if (document.addEventListener("click", x), document.addEventListener("keydown", S), window.addEventListener("resize", m), window.addEventListener("scroll", m, !0), window.visualViewport?.addEventListener("resize", m), window.visualViewport?.addEventListener("scroll", m), typeof ResizeObserver < "u") {
				d = new ResizeObserver(m);
				let e = i.value?.closest(".composer");
				e && d.observe(e);
			}
		}), dr(() => {
			g(), d?.disconnect(), document.removeEventListener("click", x), document.removeEventListener("keydown", S), window.removeEventListener("resize", m), window.removeEventListener("scroll", m, !0), window.visualViewport?.removeEventListener("resize", m), window.visualViewport?.removeEventListener("scroll", m);
		}), (t, n) => B((W(), G("div", {
			ref_key: "root",
			ref: i,
			class: "context-control shrink-0",
			onPointerenter: h,
			onPointerleave: y
		}, [q("button", {
			ref_key: "button",
			ref: a,
			type: "button",
			class: de(["context-meter relative grid size-[30px] place-items-center rounded-full p-0 text-[9px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2", p.value]),
			"aria-label": f.value === null ? "Context usage unavailable" : `Context ${Math.round(f.value)} percent used`,
			"aria-haspopup": "dialog",
			"aria-expanded": o.value,
			"aria-controls": z(l),
			onClick: b,
			onPointerenter: v
		}, [(W(), G("svg", Ch, [n[0] ||= q("circle", {
			cx: "15",
			cy: "15",
			r: "13",
			fill: "none",
			stroke: "#525252",
			"stroke-width": "2"
		}, null, -1), f.value === null ? Y("v-if", !0) : (W(), G("circle", {
			key: 0,
			cx: "15",
			cy: "15",
			r: "13",
			fill: "none",
			stroke: "currentColor",
			"stroke-width": "2",
			pathLength: "100",
			"stroke-dasharray": `${f.value} 100`
		}, null, 8, wh))])), q("span", null, L(f.value === null ? "—" : `${Math.round(f.value)}%`), 1)], 42, Sh), o.value ? (W(), K(xh, {
			key: 0,
			id: z(l),
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
		])) : Y("v-if", !0)], 544)), [[Ia, e.visible ?? e.active]]);
	}
}), Eh = [
	"none",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
], Dh = {
	key: 0,
	class: "flex flex-wrap gap-2 px-2 pb-2"
}, Oh = ["src", "alt"], kh = { class: "truncate" }, Ah = [
	"disabled",
	"onClick",
	"aria-label"
], jh = ["aria-label", "onClick"], Mh = {
	key: 1,
	class: "px-2 pb-2 text-sm text-[#d4d4d4]",
	role: "status"
}, Nh = {
	key: 2,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, Ph = {
	key: 3,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, Fh = { class: "composer-body" }, Ih = ["placeholder"], Lh = { class: "composer-controls flex items-center gap-3" }, Rh = ["aria-expanded", "disabled"], zh = { class: "composer-hint min-w-0 flex-1 px-1 text-[11px] text-[#a3a3a3]" }, Bh = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], Vh = { class: "truncate" }, Hh = [
	"type",
	"disabled",
	"aria-label",
	"title"
], Uh = {
	key: 0,
	viewBox: "0 0 24 24",
	class: "size-5",
	fill: "currentColor",
	"aria-hidden": "true"
}, Wh = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "size-5",
	"aria-hidden": "true"
}, Gh = ["id", "aria-label"], Kh = { class: "flex shrink-0 items-center gap-2 border-b border-[#424242] p-2" }, qh = { class: "min-w-0 flex-1 truncate" }, Jh = {
	key: 0,
	class: "flex shrink-0 items-center justify-between gap-3 border-b border-[#424242] px-3 py-2"
}, Yh = ["value", "disabled"], Xh = ["value"], Zh = { class: "min-h-0 overflow-y-auto overscroll-contain" }, Qh = ["data-provider", "onClick"], $h = { class: "min-w-0 flex-1 truncate" }, eg = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, tg = ["data-model", "onClick"], ng = { class: "min-w-0 flex-1 break-all" }, rg = {
	key: 0,
	"aria-label": "Selected"
}, ig = {
	key: 0,
	class: "px-3 py-3 text-[#a3a3a3]"
}, ag = {
	key: 5,
	class: "absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
}, og = /* @__PURE__ */ V({
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
		let r = e, i = n, a = /* @__PURE__ */ R(""), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R([]), l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R(!1), d = /* @__PURE__ */ R(), f = /* @__PURE__ */ R(), p = /* @__PURE__ */ R(), m = /* @__PURE__ */ R(), h = /* @__PURE__ */ R(!1), g = /* @__PURE__ */ R(!1), _;
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
			yn(v);
		}
		function S(e) {
			(!(e.relatedTarget instanceof Node) || !m.value?.contains(e.relatedTarget)) && (h.value = !1);
		}
		Ln(a, () => v(), { flush: "post" }), cr(() => {
			if (v(), typeof ResizeObserver < "u") {
				let e = -1;
				_ = new ResizeObserver((t) => {
					let n = t[0]?.contentRect.width;
					n !== void 0 && n !== e && (e = n, v());
				}), p.value && _.observe(p.value);
			}
		}), dr(() => _?.disconnect()), Ln(() => r.suggestedPrompt, (e) => {
			e && (a.value = e);
		}, { immediate: !0 });
		let C = X(() => (r.models || []).filter((e) => e.parent !== null)), w = /* @__PURE__ */ R(!1), T = /* @__PURE__ */ R(null), E = /* @__PURE__ */ R(""), D = /* @__PURE__ */ R(), O = /* @__PURE__ */ R(), k = qn(), A = X(() => r.imagesSupported === !1 && c.value.some((e) => e.type.startsWith("image/"))), ee = X(() => r.sending || r.modelsLoading), j = /* @__PURE__ */ R(!1);
		function te() {
			j.value = window.innerWidth <= 700 || !!window.matchMedia?.("(hover: none) and (max-height: 500px)").matches;
		}
		te(), cr(() => window.addEventListener("resize", te)), dr(() => window.removeEventListener("resize", te));
		let M = X(() => h.value && j.value), N = X(() => r.providers?.find((e) => e.slug === T.value)), ne = X(() => N.value?.name || "Model routes"), re = X(() => {
			let e = w.value && T.value !== null ? T.value : r.provider || "", t = e ? r.providers?.find((t) => t.slug === e) : void 0, n = w.value ? E.value || r.model || r.defaultModel || "" : r.model || r.defaultModel || "";
			return t?.capabilities?.[n]?.reasoning !== !1;
		}), ie = X(() => {
			let e = N.value, t = e ? e.models : C.value.map((e) => e.id);
			return [.../* @__PURE__ */ new Set([...(e?.is_current || !r.providers?.length) && r.defaultModel ? [r.defaultModel] : [], ...t])];
		});
		async function ae() {
			await yn();
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
		function de(e) {
			if (w.value && (e.key === "Escape" && (e.preventDefault(), P()), e.key === "Tab")) {
				let t = Array.from(O.value?.querySelectorAll("button, select") || []), n = e.shiftKey ? t.at(-1) : t[0];
				document.activeElement === (e.shiftKey ? t[0] : t.at(-1)) && (e.preventDefault(), n?.focus());
			}
		}
		Ln(ee, (e) => {
			e && P();
		}), Ln(() => r.providers, () => P()), cr(() => {
			document.addEventListener("click", ue), document.addEventListener("keydown", de);
		}), dr(() => {
			document.removeEventListener("click", ue), document.removeEventListener("keydown", de);
		});
		let fe = X(() => r.sending ? !r.stoppable || !!a.value.trim() && (u.value || c.value.some((e) => !!e.uploadError) || A.value) : r.disabled || u.value || c.value.some((e) => !!e.uploadError) || A.value || !a.value.trim() && !c.value.length);
		function F(e) {
			e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || g.value || e.isComposing || e.keyCode === 229 || e.defaultPrevented || window.innerWidth <= 700 || (e.preventDefault(), I());
		}
		function I() {
			if (fe.value) return;
			if (r.sending && a.value.trim()) {
				i("steer", a.value.trim()), a.value = "";
				return;
			}
			if (r.disabled || r.sending || u.value || c.value.some((e) => !!e.uploadError) || A.value) return;
			let e = a.value.trim();
			(e || c.value.length) && (i("send", o.value ? `/${o.value}\n${e}` : e, [...c.value]), a.value = "", c.value = [], s.value = !1, o.value = null);
		}
		async function pe(e) {
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
		let me = 0;
		dr(() => {
			me++;
		});
		async function he(e) {
			let t = me;
			try {
				let n = await Q.upload(r.profile || "", e);
				if (t !== me) return;
				e.path = n.path, e.uploadError = void 0;
			} catch {
				t === me && (e.uploadError = "Upload failed. Retry or remove this file.");
			}
		}
		async function ge(e) {
			if (!u.value) {
				u.value = !0;
				try {
					await he(e);
				} finally {
					u.value = !1;
				}
			}
		}
		async function _e(e) {
			if (u.value) return;
			let t = me;
			u.value = !0, l.value = "", s.value = !1;
			try {
				for (let n of e) try {
					if (n.size > 20971520) throw Error("Each file must be 20 MB or smaller.");
					if (c.value.length >= 5) throw Error("Attach up to five files per message.");
					let e = await new Promise((e, t) => {
						let r = new FileReader();
						r.onload = () => e(String(r.result)), r.onerror = () => t(/* @__PURE__ */ Error("Could not read file.")), r.onabort = () => t(/* @__PURE__ */ Error("File reading was cancelled. Try again.")), r.readAsDataURL(n);
					});
					if (n.type.startsWith("image/") && (e = await pe(e)), t !== me) return;
					let r = n.type.startsWith("image/") ? e.slice(5, e.indexOf(";")) : n.type || "application/octet-stream", i = {
						name: n.name,
						type: r,
						data: e,
						size: n.size
					};
					c.value.push(i), await he(i);
				} catch (e) {
					if (t !== me) return;
					l.value = e instanceof Error ? e.message : "Could not read file.";
				}
			} finally {
				t === me && (u.value = !1);
			}
		}
		async function ve(e) {
			let t = e.target;
			await _e(Array.from(t.files || [])), t.value = "";
		}
		return t({
			stageFiles: _e,
			blurInput: () => p.value?.blur()
		}), (t, n) => (W(), G("form", {
			ref_key: "form",
			ref: m,
			onFocusout: S,
			class: "composer relative mx-auto mb-0 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:w-[calc(100%-48px)]",
			onSubmit: Oo(I, ["prevent"])
		}, [
			c.value.length ? (W(), G("div", Dh, [(W(!0), G(U, null, H(c.value, (e, t) => (W(), G("div", {
				key: t,
				class: "flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm"
			}, [
				e.type.startsWith("image/") ? (W(), G("img", {
					key: 0,
					src: e.data,
					alt: e.name,
					class: "size-12 rounded-lg object-cover"
				}, null, 8, Oh)) : Y("v-if", !0),
				q("span", kh, L(e.name), 1),
				e.uploadError ? (W(), G("button", {
					key: 1,
					type: "button",
					class: "text-red-200 underline",
					disabled: u.value,
					onClick: (t) => ge(e),
					"aria-label": `Retry upload ${e.name}`
				}, " Retry upload", 8, Ah)) : Y("v-if", !0),
				q("button", {
					type: "button",
					"aria-label": `Remove ${e.name}`,
					onMousedown: y,
					onClick: (e) => c.value.splice(t, 1)
				}, " × ", 40, jh)
			]))), 128))])) : Y("v-if", !0),
			o.value ? (W(), G("p", Mh, [J(L(o.value === "goal" ? "Goal mode" : "Plan mode") + " · next message ", 1), q("button", {
				type: "button",
				class: "ml-2 underline",
				onClick: n[0] ||= (e) => o.value = null
			}, "Turn off")])) : Y("v-if", !0),
			A.value ? (W(), G("p", Nh, " Image sending is unavailable for this native capability. Remove the image to send text or files. ")) : Y("v-if", !0),
			l.value ? (W(), G("p", Ph, L(l.value), 1)) : Y("v-if", !0),
			q("div", Fh, [
				n[17] ||= q("label", {
					class: "sr-only",
					for: "prompt"
				}, "Message Hermes", -1),
				B(q("textarea", {
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
					onKeydown: F,
					onCompositionstart: n[2] ||= (e) => g.value = !0,
					onCompositionend: n[3] ||= (e) => g.value = !1
				}, null, 40, Ih), [[vo, a.value]]),
				q("input", {
					ref_key: "files",
					ref: d,
					type: "file",
					multiple: "",
					hidden: "",
					"aria-label": "Upload files",
					onChange: ve
				}, null, 544),
				q("input", {
					ref_key: "camera",
					ref: f,
					type: "file",
					accept: "image/*",
					capture: "environment",
					hidden: "",
					"aria-label": "Take a photo",
					onChange: ve
				}, null, 544),
				q("div", Lh, [
					B(q("button", {
						class: "attach-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#424242] p-0 text-white disabled:opacity-55",
						type: "button",
						"aria-label": "Attachment options",
						"aria-expanded": s.value,
						disabled: e.sending || u.value,
						onClick: n[4] ||= (e) => {
							P(), s.value = !s.value;
						}
					}, [...n[13] ||= [q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						class: "size-5",
						"aria-hidden": "true"
					}, [q("path", { d: "M12 5v14M5 12h14" })], -1)]], 8, Rh), [[Ia, !M.value]]),
					q("p", zh, L(u.value ? "Preparing attachments…" : e.reason || ""), 1),
					e.sessionId ? (W(), K(Th, {
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
					])) : Y("v-if", !0),
					B(q("button", {
						ref_key: "pill",
						ref: D,
						type: "button",
						class: "model-pill flex h-[30px] min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-0 text-[16px] text-white disabled:opacity-55",
						"aria-label": "Choose model",
						"aria-haspopup": "dialog",
						"aria-expanded": w.value,
						"aria-controls": z(k),
						disabled: ee.value,
						onClick: oe
					}, [q("span", Vh, L(e.modelsLoading ? "Loading models…" : e.model || e.defaultModel || "Default"), 1), n[14] ||= q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-4 shrink-0",
						"aria-hidden": "true"
					}, [q("path", { d: "m6 9 6 6 6-6" })], -1)], 8, Bh), [[Ia, !M.value]]),
					q("button", {
						class: "send-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#2563eb] p-0 text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
						type: e.sending && !a.value.trim() ? "button" : "submit",
						disabled: fe.value,
						"aria-label": e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						title: e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						onMousedown: y,
						onClick: n[6] ||= (t) => e.sending ? a.value.trim() ? I() : e.stoppable && i("stop") : I()
					}, [e.sending && !a.value.trim() ? (W(), G("svg", Uh, [...n[15] ||= [q("rect", {
						x: "6",
						y: "6",
						width: "12",
						height: "12",
						rx: "2"
					}, null, -1)]])) : (W(), G("svg", Wh, [...n[16] ||= [q("path", { d: "M12 19V5m-6 6 6-6 6 6" }, null, -1)]]))], 40, Hh)
				])
			]),
			w.value ? (W(), G("div", {
				key: 4,
				id: z(k),
				ref_key: "panel",
				ref: O,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": T.value === null ? "Choose provider" : ne.value,
				class: "model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl"
			}, [
				q("div", Kh, [
					T.value === null ? Y("v-if", !0) : (W(), G("button", {
						key: 0,
						type: "button",
						"aria-label": "Back to providers",
						class: "picker-back rounded-full p-2 hover:bg-[#424242]",
						onClick: ce
					}, [...n[18] ||= [q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-5",
						"aria-hidden": "true"
					}, [q("path", { d: "m15 18-6-6 6-6" })], -1)]])),
					q("h2", qh, L(T.value === null ? "Choose provider" : ne.value), 1),
					q("button", {
						type: "button",
						"aria-label": "Close model picker",
						class: "rounded-full px-3 py-2 hover:bg-[#424242]",
						onClick: P
					}, " × ")
				]),
				re.value ? (W(), G("label", Jh, [n[20] ||= q("span", null, "Reasoning effort", -1), q("select", {
					"aria-label": "Reasoning effort",
					class: "min-w-0 rounded-lg bg-[#303030] px-2 py-1 text-base text-white",
					value: e.reasoningEffort || "",
					disabled: ee.value,
					onChange: n[7] ||= (e) => i("update:reasoningEffort", e.target.value)
				}, [n[19] ||= q("option", { value: "" }, "Model default", -1), (W(!0), G(U, null, H(z(Eh), (e) => (W(), G("option", {
					key: e,
					value: e
				}, L(e === "xhigh" ? "XHigh" : e[0].toUpperCase() + e.slice(1)), 9, Xh))), 128))], 40, Yh)])) : Y("v-if", !0),
				q("div", Zh, [T.value === null ? (W(), G(U, { key: 0 }, [(W(!0), G(U, null, H(e.providers, (e) => (W(), G("button", {
					key: e.slug,
					type: "button",
					class: "provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": e.slug,
					onClick: (t) => se(e.slug)
				}, [q("span", $h, L(e.name), 1), e.is_current ? (W(), G("span", eg, "Current")) : Y("v-if", !0)], 8, Qh))), 128)), q("button", {
					type: "button",
					class: "provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": "",
					onClick: n[8] ||= (e) => se("")
				}, " Model routes ")], 64)) : (W(), G(U, { key: 1 }, [(W(!0), G(U, null, H(ie.value, (t) => (W(), G("button", {
					key: t,
					type: "button",
					class: "model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-model": t,
					onClick: (e) => le(t)
				}, [q("span", ng, L(t), 1), (e.provider || "") === T.value && t === (e.model || e.defaultModel) ? (W(), G("span", rg, "✓")) : Y("v-if", !0)], 8, tg))), 128)), ie.value.length ? Y("v-if", !0) : (W(), G("p", ig, "No models available"))], 64))])
			], 8, Gh)) : Y("v-if", !0),
			s.value ? (W(), G("div", ag, [
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[9] ||= (e) => d.value?.click()
				}, " Upload files "),
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					onClick: n[10] ||= (e) => f.value?.click()
				}, " Take a photo "),
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "goal",
					onClick: n[11] ||= (e) => {
						o.value = "goal", s.value = !1;
					}
				}, " Goal mode "),
				q("button", {
					type: "button",
					class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
					"data-mode": "plan",
					onClick: n[12] ||= (e) => {
						o.value = "plan", s.value = !1;
					}
				}, " Plan mode ")
			])) : Y("v-if", !0)
		], 544));
	}
}), sg = { class: "chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden" }, cg = {
	key: 0,
	class: "pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-dashed border-[#a3a3a3] bg-[#212121]/95 text-lg",
	role: "status"
}, lg = { class: "chat-content flex min-h-0 flex-1 flex-col overflow-hidden" }, ug = {
	key: 0,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white",
	role: "status"
}, dg = {
	key: 1,
	class: "notice px-5 py-3 text-sm text-[#b4b4b4]",
	role: "status"
}, fg = {
	key: 2,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, pg = { class: "composer-dock shrink-0" }, mg = /* @__PURE__ */ V({
	__name: "ChatInterface",
	props: {
		showChat: { type: Boolean },
		hideComposer: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R();
		Nn(ah, r);
		let i = !1;
		function a() {
			i = !0, r.value ? r.value.focusLatestMessage() : n.value?.blurInput();
		}
		Ln(r, (e) => {
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
		let c = /* @__PURE__ */ R(0);
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
		cr(() => {
			document.addEventListener("dragenter", u), document.addEventListener("dragover", d), document.addEventListener("dragleave", f), document.addEventListener("drop", p);
		}), dr(() => {
			document.removeEventListener("dragenter", u), document.removeEventListener("dragover", d), document.removeEventListener("dragleave", f), document.removeEventListener("drop", p);
		});
		let { view: m, scope: h, composer: g, actions: _ } = ih(), { profile: v, session: y, offline: b, canStream: x, reasoningEffort: S, models: C, providers: w, modelsLoading: T, model: E, provider: D, defaultModel: O, suggestedPrompt: k } = h, { busy: A, active: ee, reconnect: j, error: te, unavailable: M, connection: N } = m;
		return (t, r) => (W(), G("div", sg, [
			c.value && e.showChat ? (W(), G("div", cg, " Drop files to attach ")) : Y("v-if", !0),
			q("div", lg, [
				z(b) ? (W(), G("div", ug, " You are offline. Messages cannot be loaded or sent. ")) : Y("v-if", !0),
				e.showChat && z(j) ? (W(), G("div", dg, [J(L(z(N) === "reconnecting" ? "Reconnecting…" : "Session is read-only until reconnected.") + " ", 1), z(x) && z(N) === "stale" && !z(b) ? (W(), G("button", {
					key: 0,
					class: "ml-3 underline",
					onClick: r[0] ||= (...e) => z(_).retry && z(_).retry(...e)
				}, " Reconnect ")) : Y("v-if", !0)])) : Y("v-if", !0),
				e.showChat && z(te) ? (W(), G("div", fg, [
					J(L(z(te)) + " ", 1),
					z(y) ? (W(), G("button", {
						key: 0,
						class: "underline",
						onClick: r[1] ||= (...e) => z(_).retry && z(_).retry(...e)
					}, L(z(j) ? "Retry connection" : "Refresh history"), 1)) : Y("v-if", !0),
					z(M) ? (W(), G("button", {
						key: 1,
						class: "ml-3 underline",
						onClick: r[2] ||= (...e) => z(_).resolve && z(_).resolve(...e)
					}, " Resolve uncertain submission ")) : Y("v-if", !0)
				])) : Y("v-if", !0),
				yr(t.$slots, "default")
			]),
			q("div", pg, [B((W(), K(og, {
				ref_key: "picker",
				ref: n,
				profile: z(v),
				"session-id": z(x) && z(y) || void 0,
				"context-usage": z(m).contextUsage.value,
				"context-breakdown": z(m).contextBreakdown.value,
				"context-loading": z(m).contextLoading.value,
				onContextOpen: z(_).setContextOpen,
				"project-name": z(g).projectName,
				key: JSON.stringify([z(v), z(y)]),
				disabled: z(g).disabled,
				models: z(C),
				providers: z(w),
				"models-loading": z(T),
				provider: z(D),
				"onUpdate:provider": z(_).setProvider,
				"default-model": z(O),
				"reasoning-effort": z(S),
				"onUpdate:reasoningEffort": z(_).setReasoningEffort,
				model: z(E),
				"onUpdate:model": z(_).setModel,
				sending: z(A),
				stoppable: z(ee) && !z(j),
				"suggested-prompt": z(k),
				reason: z(g).reason,
				onStop: z(_).stop,
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
			])), [[Ia, !e.hideComposer]])])
		]));
	}
}), hg = [
	"once",
	"session",
	"always",
	"deny"
];
function gg(e) {
	if (!e) return;
	let { id: t, method: n, params: r } = e;
	return n === "approval" && (r.choices === void 0 || Array.isArray(r.choices) && r.choices.every((e) => hg.includes(e))) ? {
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
function _g(e, t) {
	return `Attached ${e.type.startsWith("image/") ? "image" : "file"} ${e.name.replace(/[\r\n]/g, " ")}: ${t}\nMEDIA:"${t}"`;
}
function vg(e, t) {
	let { profile: n, session: r, messages: i, chatLoading: a, chatError: o, canStream: s, projectView: c, composerBlocked: l, selectedProject: u, creating: d, offline: f, models: p, providers: m, modelsLoading: h, model: g, provider: _, defaultModel: v, suggestedPrompt: y } = t, b = /* @__PURE__ */ R(/* @__PURE__ */ new Map()), x = /* @__PURE__ */ R(/* @__PURE__ */ new Map()), S = () => JSON.stringify([n.value || "default", r.value]), C = X(() => {
		let t = e.settings.value;
		return t?.profile === n.value && t.session === r.value && t.generation === e.generationRef.value ? t.info : void 0;
	}), w = X(() => {
		let e = C.value?.reasoning_effort;
		return b.value.get(S()) ?? (Eh.includes(e) ? e : "");
	}), T = X(() => x.value.get(S())?.model ?? (r.value ? C.value?.model || "" : g.value)), E = X(() => x.value.get(S())?.provider ?? (r.value && C.value?.provider || _.value)), D = /* @__PURE__ */ R(!1), O = X(() => D.value || !s.value || N.value || j.value || te.value || ne.value || f.value || !r.value);
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
	let A = s, ee = X(() => A.value ? e.messages.value : i.value), j = X(() => e.busy.value || e.uncertain.value), te = X(() => A.value ? e.loading.value : a.value), M = X(() => A.value ? e.error.value : o.value), N = X(() => !!e.approval.value), ne = X(() => A.value && !!r.value && e.connection.value !== "ready"), re = X(() => e.uncertain.value), ie = X(() => e.busy.value);
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
			text: e.path ? _g(e, e.path) : "📎 " + e.name
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
						text: _g(n, r.path)
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
	let ce = X(() => {
		let t = e.approval.value;
		return t && typeof t.request_id == "string" && typeof t.kind == "string" ? gg({
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
	let de = X(() => ({
		projectName: !l.value && !u.value?.isNoProject ? u.value?.label : void 0,
		disabled: !!(l.value || D.value || c.value && u.value?.archived || c.value && (!u.value || !u.value.isNoProject && !El(u.value)) || f.value || d.value || h.value || te.value || N.value || re.value || ne.value || !s.value),
		reason: l.value ? "Open a chat." : c.value && u.value?.archived ? "Restore this project to start a new chat." : c.value && u.value && !u.value.isNoProject && !El(u.value) ? "This Project has no workspace." : f.value ? "Offline · sending is unavailable." : N.value ? "Approval is pending in Hermes." : s.value ? void 0 : "Streaming turns are unavailable for this profile."
	})), fe = {
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
			contextUsage: X(() => C.value ? e.contextUsage.value : null),
			contextBreakdown: X(() => C.value ? e.contextBreakdown.value : null),
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
			connection: X(() => e.connection.value),
			status: X(() => A.value ? e.status.value : "")
		},
		composer: de,
		actions: fe,
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
var yg = "button:not([data-drawer-swipe]), a, input, textarea, select, label, summary, audio, video, [role=\"button\"], [role=\"link\"], [role=\"slider\"], [role=\"checkbox\"], [role=\"switch\"], [role=\"combobox\"], [role=\"textbox\"], [role=\"menuitem\"], [tabindex]:not([data-chat-message]):not([data-drawer-swipe]), [contenteditable]:not([contenteditable=\"false\"]), .composer, pre, code";
function bg(e, t, n, r) {
	let i = /* @__PURE__ */ R(null), a, o = 0, s = 0, c = 0, l = 0, u = () => window.matchMedia("(max-width: 700px)").matches;
	function d() {
		a = void 0, i.value = null;
	}
	Ln(e, d, { flush: "sync" });
	function f(r) {
		if (d(), !u() || r.touches.length !== 1) return;
		let i = r.touches[0], l = r.target;
		if (!(i.clientX < 30 || !(l instanceof Element) || l.closest(yg)) && (e.value || l.closest("[data-drawer-swipe]"))) {
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
var xg = "chathermes.keep-screen-awake";
function Sg() {
	try {
		return localStorage.getItem(xg) === "true";
	} catch {
		return !1;
	}
}
function Cg() {
	let e = /* @__PURE__ */ R(Sg()), t = /* @__PURE__ */ R(!1), n = !1, r = !0, i = null, a = null, o = 0, s = null;
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
			localStorage.setItem(xg, String(t));
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
	return cr(() => {
		n = !0, t.value = typeof navigator.wakeLock?.request == "function", document.addEventListener("visibilitychange", p), window.addEventListener("pagehide", m), window.addEventListener("pageshow", h), d();
	}), fr(() => {
		n = !1, document.removeEventListener("visibilitychange", p), window.removeEventListener("pagehide", m), window.removeEventListener("pageshow", h), u();
	}), {
		enabled: /* @__PURE__ */ Lt(e),
		available: /* @__PURE__ */ Lt(t),
		setEnabled: f
	};
}
//#endregion
//#region src/features/inbox/context.ts
var wg = Symbol("inbox");
function Tg(e) {
	Nn(wg, e);
}
function Eg() {
	let e = Pn(wg);
	if (!e) throw Error("inbox context is missing");
	return e;
}
//#endregion
//#region src/features/artifacts/context.ts
var Dg = Symbol("artifacts");
function Og(e) {
	Nn(Dg, e);
}
function kg() {
	let e = Pn(Dg);
	if (!e) throw Error("artifacts context is missing");
	return e;
}
//#endregion
//#region src/features/settings/context.ts
var Ag = Symbol("settings");
function jg(e) {
	Nn(Ag, e);
}
function Mg() {
	let e = Pn(Ag);
	if (!e) throw Error("settings context is missing");
	return e;
}
//#endregion
//#region src/features/projects/context.ts
var Ng = Symbol("projects");
function Pg(e) {
	let t = kc(), n = /* @__PURE__ */ R();
	Ln(() => t.fullPath, () => {
		n.value = void 0;
	}), Nn(Ng, {
		...e,
		projectConfirmation: n
	});
}
function Fg() {
	let e = Pn(Ng);
	if (!e) throw Error("projects context is missing");
	return e;
}
//#endregion
//#region src/features/scheduled/composables/useScheduledHistory.ts
var Ig = Symbol("scheduled");
function Lg(e) {
	let t = {
		...e,
		current: /* @__PURE__ */ Jt()
	};
	return Nn(Ig, t), t;
}
function Rg() {
	let e = Pn(Ig);
	if (!e) throw Error("Scheduled context is missing");
	return e;
}
function zg(e) {
	return e.state === "completed" || e.state === "error" ? "completed" : e.state === "paused" || e.enabled === !1 ? "paused" : "active";
}
function Bg(e) {
	return e > 0 ? (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString() : "Run date unavailable";
}
function Vg(e) {
	if (!e) return "Never run";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? "Last run date unavailable" : "Last run: " + t.toLocaleString();
}
function Hg(e) {
	let t = Rg(), n = kc(), r = /* @__PURE__ */ R(!1), i = /* @__PURE__ */ R(""), a = /* @__PURE__ */ R(), o, s = Promise.resolve(), c = "", l = !1, u = () => JSON.stringify([
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
				l.signal.aborted || (i.value = e instanceof fl && e.status === 503 ? "Scheduled history is unavailable in this Hermes version." : "Could not load scheduled history. The job or output may no longer be available.");
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
	return t.current.value = f, Ln([
		() => t.profile.value,
		() => n.params.jobId,
		() => n.params.runId
	], d, { immediate: !0 }), Te(() => {
		l = !0, o?.abort(), t.current.value === f && (t.current.value = void 0);
	}), f;
}
async function Ug(e, t, n) {
	let r = (await Q.scheduled(e, n)).jobs.find((e) => e.id === t);
	if (!r) throw Error("Job unavailable");
	return r;
}
function Wg(e) {
	let t = e?.messages.slice().reverse().find((e) => e.role === "assistant" && Tl(e.content).trim()), n = t ? Tl(t.content) : e?.output;
	return n ? [{
		role: "assistant",
		content: n
	}] : [];
}
//#endregion
//#region src/composables/useApplication.ts
function Gg() {
	let e = Pn(Lc, void 0), t, n = Oc(), r = kc(), i = X(() => r.meta.chat === !0), a = X(() => r.meta.composer === "project"), o = X(() => !i.value && !a.value), s = X(() => r.name === "settings"), c = X(() => r.meta.section === "scheduled"), l = !1, u = !1, d = Promise.resolve(), f = Promise.resolve(), p = "", m;
	async function h(e, t = !1, r = !1) {
		m?.abort(), p = r ? n.resolve(e).fullPath : "", r || (k.value = !1), Tt(!1), await n[t ? "replace" : "push"](e), await f, p = "";
	}
	function g(e, t = {}) {
		return Fc(e, _.value, v.value, De.value, t);
	}
	let _ = /* @__PURE__ */ R(""), v = /* @__PURE__ */ R(""), y = /* @__PURE__ */ R([]), b = /* @__PURE__ */ R([]), x = /* @__PURE__ */ R({}), S = /* @__PURE__ */ R(0), C = /* @__PURE__ */ R(!1), w = /* @__PURE__ */ R(!1), T = /* @__PURE__ */ R(!1), E = /* @__PURE__ */ R(!navigator.onLine), D = /* @__PURE__ */ R(""), O = /* @__PURE__ */ R(""), k = /* @__PURE__ */ R(!1), A = /* @__PURE__ */ R([]), ee = /* @__PURE__ */ R([]), j = /* @__PURE__ */ R(""), te = /* @__PURE__ */ R(""), M = /* @__PURE__ */ R(!1), N = /* @__PURE__ */ R([]), ne = /* @__PURE__ */ R(""), re = /* @__PURE__ */ R(!1), ie = /* @__PURE__ */ R(!1), ae = /* @__PURE__ */ R(""), P = /* @__PURE__ */ R(null), oe = /* @__PURE__ */ R(null), se = /* @__PURE__ */ R(null), ce = /* @__PURE__ */ R(!1), le = /* @__PURE__ */ R(null), ue = X(() => x.value.features?.native_chat === !0), de, fe, F = 0, I = 0, pe = /* @__PURE__ */ R({
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: ""
	}), me = /* @__PURE__ */ R(!1), he = /* @__PURE__ */ R(!1), ge = /* @__PURE__ */ R(""), _e = 0, ve = /* @__PURE__ */ R(null), ye = /* @__PURE__ */ new Set(), L = /* @__PURE__ */ R([]), be = /* @__PURE__ */ R(/* @__PURE__ */ new Set()), xe = 0;
	async function Se(e, t) {
		if (E.value || be.value.has(e) || lt.value) return;
		let n = _.value, r = I, i = L.value.find((t) => t.session_id === e);
		tt(), xe++, be.value.add(e), L.value = [...L.value.filter((t) => t.session_id !== e), {
			session_id: e,
			status: t,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}];
		try {
			let i = await Q.track(n, e, t);
			if (r !== I) return;
			i.session_id !== e && (y.value = y.value.map((t) => t.id === e ? {
				...t,
				id: i.session_id
			} : t)), L.value = [...L.value.filter((t) => t.session_id !== e && t.session_id !== i.session_id), i];
		} catch (t) {
			if (r !== I) return;
			L.value = L.value.filter((t) => t.session_id !== e), i && L.value.push(i), D.value = t instanceof Error ? t.message : "Could not update tracking";
		} finally {
			r === I && (tt(), be.value.delete(e));
		}
	}
	function Ce(e) {
		e === _.value && nt();
	}
	function we(e, t, n) {
		e === _.value && (y.value = y.value.map((e) => e.id === t ? {
			...e,
			title: n
		} : e));
	}
	let { projectBusy: Te, manageError: Ee, projectId: De, projects: Oe, selectedProject: ke, projectsLoading: Ae, projectLoading: je, projectsError: Me, projectError: Ne, projectsLoaded: Pe, visibleSessions: Fe, subscribeProjectEvents: Ie, refreshProjects: Le, loadProjects: Re, loadProject: ze, chooseProject: Be, showProjects: Ve, manageProject: He, resetProjects: Ue, selectProjectScope: We, whenProjectsLoaded: Ge } = Ol({
		profile: _,
		session: v,
		sessions: y,
		offline: E,
		navigate: h,
		loadSessions: nt,
		refreshInbox: zt,
		profileGeneration: () => I
	}), Ke = Vm(() => {
		Le(), nt(), zt();
	}, Ce, we, Vt);
	rh(vg(Ke, {
		profile: _,
		session: v,
		messages: b,
		chatLoading: T,
		chatError: O,
		canStream: ue,
		composerBlocked: o,
		projectView: a,
		selectedProject: ke,
		creating: M,
		offline: E,
		models: ee,
		providers: N,
		modelsLoading: re,
		model: j,
		provider: ne,
		defaultModel: te,
		suggestedPrompt: ae,
		generation: () => F,
		navigation: () => n.currentRoute.value,
		createSession: ot,
		suggest: st,
		retryHistory: rt,
		openBranch: async (e) => {
			await gt(e), Le(), nt();
		}
	}));
	let qe = Cg(), Je = Jc(E), Ye = Lg({
		profile: _,
		offline: E,
		creating: M,
		recentSession: $e
	}), Xe = ue;
	function Ze() {
		Ke.close(), F++, fe?.abort(), T.value = !1;
	}
	function Qe() {
		Ze(), de?.abort(), w.value = !1;
	}
	function $e(e) {
		return gt(e, "");
	}
	async function et() {
		return await ot(!0);
	}
	function tt() {
		de?.abort(), de = void 0, w.value = !1;
	}
	async function nt(e = !1) {
		xe++, de?.abort();
		let t = new AbortController();
		de = t;
		let n = _.value, r = new Map(y.value.map((e) => [e.id, e.title]));
		w.value = !0, D.value = "";
		try {
			let [i, a] = await Promise.all([Q.sessions(n, e ? S.value : 0, t.signal), Q.tracking(n, t.signal).then((e) => ({
				value: e,
				error: ""
			}), () => ({
				value: void 0,
				error: "Could not load session tracking"
			}))]), o = a.value;
			if (t !== de || t.signal.aborted || n !== _.value) return;
			let s = L.value.filter((e) => be.value.has(e.session_id));
			o && (L.value = [...o.tracking.filter((e) => !be.value.has(e.session_id)), ...s]), a.error && (D.value = a.error);
			let c = i.sessions.filter((e) => !ye.has(e.id)).map((e) => {
				let t = y.value.find((t) => t.id === e.id);
				return t && r.has(e.id) && t.title !== r.get(e.id) ? {
					...e,
					title: t.title
				} : e;
			});
			y.value = e ? [...y.value.map((e) => c.find((t) => t.id === e.id) || e), ...c.filter((e) => !y.value.some((t) => t.id === e.id))] : c, y.value = [...new Map(y.value.map((e) => {
				let t = o?.aliases?.[e.id] || e.id;
				return [t, t === e.id ? e : {
					...e,
					id: t
				}];
			})).values()];
			let l = new Map(y.value.map((e) => [e.id, e]));
			for (let e of o?.sessions || []) !l.has(e.id) && !ye.has(e.id) && l.set(e.id, e);
			let u = [...y.value];
			for (let e of l.values()) {
				if (u.some((t) => t.id === e.id)) continue;
				let t = u.findIndex((t) => (t.last_active ?? t.started_at ?? 0) < (e.last_active ?? e.started_at ?? 0));
				u.splice(t < 0 ? u.length : t, 0, e);
			}
			y.value = u, S.value = typeof i.offset == "number" && typeof i.limit == "number" ? i.offset + i.limit : e ? S.value + i.sessions.length : i.sessions.length, C.value = i.has_more ?? (typeof i.total == "number" ? S.value < i.total : i.sessions.length === 30);
		} catch (e) {
			t === de && !t.signal.aborted && (D.value = e instanceof Error ? e.message : "Could not load sessions");
		} finally {
			t === de && (w.value = !1, de = void 0);
		}
	}
	async function rt() {
		if (!v.value) return !1;
		if (Xe.value) return await Ke.hydrate(), !0;
		fe?.abort();
		let e = new AbortController();
		fe = e;
		let t = F;
		T.value = !0, O.value = "";
		try {
			let n = await Q.messages(_.value, v.value, e.signal);
			if (t === F && e === fe) return b.value = n, !0;
		} catch (n) {
			t === F && !e.signal.aborted && (O.value = n instanceof Error ? n.message : "Could not load messages");
		} finally {
			e === fe && (T.value = !1);
		}
		return !1;
	}
	async function it(e) {
		if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
			D.value = "Invalid profile name";
			return;
		}
		ae.value = "", M.value = !1, lt.value = !1, ut++, Qe(), Ue(), _.value = e, v.value = "", y.value = [], L.value = [], be.value = /* @__PURE__ */ new Set(), ye.clear(), b.value = [], x.value = {}, ee.value = [], N.value = [], ne.value = "", j.value = "", te.value = "", re.value = !0, D.value = "", O.value = "", S.value = 0, C.value = !1;
		let t = ++I;
		Ie(), Re(), nt(), Promise.allSettled([Q.models(e), Q.modelOptions(e)]).then(([e, n]) => {
			t === I && (e.status === "fulfilled" && (ee.value = e.value.data || [], te.value = e.value.default_model || ""), n.status === "fulfilled" && Array.isArray(n.value.providers) && (N.value = n.value.providers.filter((e) => e.models.length || e.is_current), ne.value = N.value.find((e) => e.is_current)?.slug || n.value.provider || "", te.value = n.value.model || te.value), re.value = !1);
		});
		try {
			let n = await Q.capabilities(e);
			t === I && _.value === e && (x.value = n);
		} catch {
			t === I && _.value === e && (x.value = {});
		}
	}
	async function at(e) {
		(Q.isNative(_.value) || De.value || y.value.find((t) => t.id === e)?.cwd || y.value.find((t) => t.id === e)?.source === "desktop") && Q.workspace(_.value, e), ae.value = "", Ze(), v.value = e, b.value = [], O.value = "", k.value = !1;
		let t = F, n = _.value;
		if (!De.value && !Q.isWorkspace(n, e)) {
			try {
				await Q.session(n, e);
			} catch {}
			if (t !== F || n !== _.value) return;
		}
		Xe.value ? await Ke.attach(n, e) : await rt();
	}
	async function ot(e = !1) {
		if (E.value || M.value || !e && De.value && ke.value?.archived) return;
		let t = _.value, r = e ? "" : De.value, i = v.value, a = n.currentRoute.value, o = F, s = I, c = m = new AbortController();
		M.value = !0;
		try {
			r && !ne.value && (ne.value = N.value.find((e) => e.is_current)?.slug || "", j.value = "");
			let e = r ? await Q.projectCreate(t, r) : await Q.create(t);
			if (c.signal.aborted || o !== F || _.value !== t || v.value !== i || a !== n.currentRoute.value) return;
			await gt(e.id, r), Le();
			let l = ++xe;
			return Q.tracking(t).then((e) => {
				if (s !== I || l !== xe) return;
				L.value = e.tracking;
				let t = new Map(y.value.map((e) => [e.id, e]));
				for (let n of e.sessions) ye.has(n.id) || t.set(n.id, n);
				y.value = [...t.values()];
			}).catch(() => {
				s === I && (D.value = "Could not load session tracking");
			}), _.value !== t || v.value !== e.id ? void 0 : e.id;
		} catch (e) {
			if (!c.signal.aborted && o === F && a === n.currentRoute.value && _.value === t && De.value === r) {
				let t = e instanceof Error ? e.message : "Could not create session";
				r ? Ne.value = t : D.value = t;
			}
		} finally {
			s === I && (M.value = !1);
		}
	}
	async function st(e) {
		let t = F, n = _.value, r = await ot();
		r && t + 1 === F && n === _.value && v.value === r && (ae.value = e);
	}
	async function ct(e, t) {
		let n = _.value, r = F;
		try {
			if (await Q.rename(n, e, t), r !== F || n !== _.value) return;
			let i = y.value.find((t) => t.id === e);
			i && (i.title = t), Le();
		} catch (e) {
			r === F && n === _.value && (D.value = e instanceof Error ? e.message : "Could not rename session");
		}
	}
	let lt = /* @__PURE__ */ R(!1), ut = 0;
	async function dt(e, t, n = "") {
		if (E.value || lt.value) return;
		let r = _.value, i = F, a = ++ut, o = I;
		lt.value = !0, tt();
		try {
			if (e === "archive" ? await Q.archive(r, t) : e === "delete" ? await Q.deleteSession(r, t) : await Q.moveSession(r, t, n), o !== I || r !== _.value) return;
			tt(), e !== "project" && (ye.add(t), y.value = y.value.filter((e) => e.id !== t)), i === F && v.value === t && (e === "project" ? await h({
				name: "chat",
				params: { sessionId: t },
				query: {
					...r ? { profile: r } : {},
					project: n
				}
			}) : await h({
				name: "home",
				query: r ? { profile: r } : {}
			})), await nt(), Le();
		} catch (e) {
			i === F && r === _.value && (D.value = e instanceof Error ? e.message : "Could not update session");
		} finally {
			a === ut && (lt.value = !1);
		}
	}
	async function ft() {
		await Ke.availability(document.visibilityState === "visible", navigator.onLine), document.visibilityState === "visible" && (Le(), zt());
	}
	function pt() {
		location.href = "/";
	}
	function mt() {
		E.value = !navigator.onLine, Ke.availability(document.visibilityState === "visible", !E.value), E.value || (Le(), nt(), ft());
	}
	function ht(e) {
		if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
			D.value = "Invalid profile name";
			return;
		}
		return h(s.value ? Fc("settings", e, "", "", { return_to: n.resolve(Fc("home", e)).fullPath }) : Fc("home", e), !1, !0);
	}
	function gt(e, t = De.value) {
		return h({
			name: "chat",
			params: { sessionId: e },
			query: {
				..._.value ? { profile: _.value } : {},
				...t ? { project: t } : {}
			}
		});
	}
	async function _t(e) {
		let t = Nc(r.query.profile);
		if ((!u || t !== _.value) && (u = !0, d = it(t), await d, e !== n.currentRoute.value) || (await d, e !== n.currentRoute.value)) return;
		let i = typeof r.params.sessionId == "string" ? r.params.sessionId : Nc(r.query.session), a = typeof r.params.projectId == "string" ? r.params.projectId : Nc(r.query.project), o = () => Oe.value.find((e) => e.sessionIds?.includes(i) || Dl(e).some((e) => e.id === i)), s = a || r.name === "chat" && o()?.id || "";
		if (s !== De.value && We(s), i !== v.value && (i ? await at(i) : (Ze(), v.value = "", b.value = [], ae.value = "")), e === n.currentRoute.value && t === _.value && (i && r.name === "chat" && i === v.value && await Vt(t, i), i && !a && r.name === "chat" && !Pe.value)) {
			if (await Ge(), e !== n.currentRoute.value || t !== _.value || i !== v.value) return;
			let r = o();
			r && r.id !== De.value && (De.value = r.id, ke.value = r, ze());
		}
	}
	Ln(() => r.fullPath, () => {
		if (!r.matched.length) return;
		let e = n.currentRoute.value;
		St.cancel(), r.fullPath !== p && (k.value = !1), Tt(!1), Ee.value = "", l && (f = _t(e));
	}, { flush: "sync" });
	function vt() {
		k.value = !1, P.value?.focus();
	}
	async function yt() {
		k.value = !0, await yn(), oe.value?.focus();
	}
	let bt = /* @__PURE__ */ R(null), xt = /* @__PURE__ */ R(null), St = bg(k, () => bt.value?.getBoundingClientRect().width || Math.min(300, window.innerWidth * .85), () => xt.value?.$el.querySelector("[data-drawer-swipe]") || null, (e) => {
		e !== k.value && (e ? yt() : vt());
	});
	async function Ct() {
		await h(Pc(Nc(r.query.return_to))), await yn(), window.matchMedia?.("(min-width: 701px)").matches ?? !0 ? ve.value?.focus() : P.value?.focus();
	}
	function wt() {
		if (!s.value) return h(g("settings", { return_to: r.fullPath }));
	}
	function Tt(e = !0) {
		ce.value && (ce.value = !1, e && se.value?.focus());
	}
	function Et(e) {
		ce.value && le.value && !e.composedPath().includes(le.value) && Tt(!1);
	}
	function Dt(e) {
		e.key !== "Escape" || e.defaultPrevented || e.target instanceof Element && e.target.closest("dialog[open]") || (k.value ? vt() : s.value ? (e.preventDefault(), Ct()) : Tt());
	}
	async function Ot() {
		let e = _.value, t = ++_e;
		he.value = !0;
		let n = await Xm(e);
		t === _e && e === _.value && (pe.value = n, he.value = !1);
	}
	Ln(_, () => {
		ge.value = "", pe.value = {
			...pe.value,
			subscribed: !1
		}, Ot();
	}, { flush: "sync" });
	async function kt() {
		if (me.value || he.value) return;
		let e = _.value;
		me.value = !0, ge.value = "";
		try {
			pe.value.subscribed ? await Qm(e) : await Zm(e), await Ot();
		} catch (t) {
			e === _.value && (ge.value = t instanceof Error ? t.message : "Could not update notifications."), await Ot();
		} finally {
			me.value = !1;
		}
	}
	async function At() {
		if (me.value || he.value) return;
		let e = _.value;
		me.value = !0, ge.value = "";
		try {
			await $m(e), e === _.value && (ge.value = "Test notification scheduled.");
		} catch {
			e === _.value && (ge.value = "Could not send a test notification.");
		} finally {
			me.value = !1;
		}
	}
	let jt, Mt = X(() => ({
		profile: _.value,
		session: v.value,
		chat: i.value,
		scheduled: c.value && r.params.jobId && r.params.runId ? {
			job: String(r.params.jobId),
			run: String(r.params.runId)
		} : void 0,
		connected: Xe.value && Ke.connection.value === "ready" && !E.value
	}));
	Ln(Mt, () => jt?.publish(), { flush: "post" });
	async function Nt(e) {
		if (e.data?.type !== "chathermes.navigate" || typeof e.data.url != "string") return;
		let t = e.data.url, i = Ic(t), a = e.ports?.[0], o = !1;
		try {
			if (!i) return;
			await h(i);
			let e = n.currentRoute.value, t = n.resolve(i).fullPath, s = () => l && e === n.currentRoute.value && r.fullPath === t;
			if (!a || !s()) return;
			r.name === "chat" ? o = Xe.value ? Ke.connection.value === "ready" && await Ke.hydrate() === !0 : !T.value && !O.value : c.value ? (await yn(), o = await Ye.current.value?.whenLoaded() === !0) : o = !0, await yn(), o &&= s();
		} catch {
			o = !1;
		} finally {
			a && (o && a.postMessage({
				type: "chathermes.navigated",
				url: t
			}), a.close());
		}
	}
	let Pt = /* @__PURE__ */ R(0), Ft = /* @__PURE__ */ R(0), It, Lt, Rt = "";
	async function zt(e = !0) {
		if (document.visibilityState === "hidden") return;
		Lt?.abort();
		let t = Lt = new AbortController();
		try {
			let n = await Q.inbox(_.value, { limit: 1 }, t.signal);
			if (t.signal.aborted) return;
			Pt.value = n.unread, e && Vt(_.value, v.value);
			let r = JSON.stringify([
				n.revision,
				n.unread,
				n.items[0]?.id
			]);
			r !== Rt && (Rt = r, Ft.value++);
		} catch {}
	}
	let Bt = /* @__PURE__ */ new Map();
	async function Vt(e, t) {
		let n = () => l && !!t && e === _.value && t === v.value && r.name === "chat" && !O.value && (!Xe.value || Ke.connection.value === "ready" || !!Ke.approval.value || Ke.requests.value.length > 0);
		if (!n()) return;
		jt?.publish();
		let i = JSON.stringify([e, t]), a = (Bt.get(i) || Promise.resolve()).then(async () => {
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
				i && e === _.value && zt(!1);
			}
		});
		Bt.set(i, a), await a, Bt.get(i) === a && Bt.delete(i);
	}
	async function Ht(e) {
		let t = n.currentRoute.value, r = await Q.session(e.profile, e.session);
		if (t !== n.currentRoute.value) throw Error("Navigation changed");
		if (r.source === "kanban") {
			let i = r.kanban_task;
			if (!i) throw Error("Task unavailable");
			if (await Hc.task(i.board, i.task), !Je.visible.value && (await Je.check(), !Je.available.value)) throw Error("Kanban unavailable");
			if (t !== n.currentRoute.value) throw Error("Navigation changed");
			Je.setEnabled(!0), await h({
				name: "kanban",
				query: {
					profile: e.profile,
					board: i.board,
					task: i.task
				}
			}), Je.visible.value && (await Q.deleteInboxItem(e.profile, e.id), await zt(!1));
			return;
		}
		if (await h({
			name: "chat",
			params: { sessionId: e.session },
			query: { profile: e.profile }
		}), _.value !== e.profile || v.value !== e.session || O.value || Xe.value && Ke.connection.value !== "ready") throw Error("Chat unavailable");
		await Vt(e.profile, e.session);
	}
	return cr(async () => {
		zt(), It = setInterval(() => void zt(), 15e3), "serviceWorker" in navigator && (jt = th(navigator.serviceWorker, () => Mt.value, () => location.href)), Q.profiles().then((e) => {
			A.value = e.profiles || [];
		}).catch(() => {
			D.value = "Could not load profiles";
		}), Ot(), !e && "serviceWorker" in navigator && navigator.serviceWorker.addEventListener("message", Nt), ie.value = !!P.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", ft), addEventListener("online", mt), addEventListener("offline", mt), addEventListener("keydown", Dt), document.addEventListener("click", Et), await n.isReady(), l = !0, f = _t(n.currentRoute.value), e && l && (t = e.connect(Nt)), await f;
	}), fr(() => {
		clearInterval(It), Lt?.abort(), l = !1, t?.(), n.options.history.destroy(), jt?.stop(), jt = void 0, I++, document.removeEventListener("visibilitychange", ft), "serviceWorker" in navigator && navigator.serviceWorker.removeEventListener("message", Nt), Qe(), removeEventListener("online", mt), removeEventListener("offline", mt), removeEventListener("keydown", Dt), document.removeEventListener("click", Et);
	}), Tg({
		profile: _,
		inboxRevision: Ft,
		openInboxItem: Ht,
		refreshInbox: zt
	}), Og({
		profile: _,
		projects: Oe,
		recentSession: $e
	}), jg({
		kanban: Je,
		profile: _,
		profiles: A,
		pushState: pe,
		pushBusy: me,
		pushLoading: he,
		pushMessage: ge,
		wakeLock: qe,
		chooseProfile: ht,
		togglePush: kt,
		testPush: At,
		closeSettings: Ct
	}), Pg({
		profile: _,
		projectId: De,
		selectedProject: ke,
		projects: Oe,
		projectsLoading: Ae,
		projectLoading: je,
		projectsError: Me,
		projectError: Ne,
		manageError: Ee,
		projectBusy: Te,
		offline: E,
		visibleSessions: Fe,
		chooseProject: Be,
		showProjects: Ve,
		loadProject: ze,
		loadProjects: Re,
		recentSession: $e,
		chooseSession: gt,
		manageProject: He,
		createSession: ot,
		creating: M
	}), {
		profile: _,
		session: v,
		sessions: y,
		projects: Oe,
		selectedProject: ke,
		projectId: De,
		offline: E,
		creating: M,
		profiles: A,
		loading: w,
		error: D,
		hasMore: C,
		tracking: L,
		trackingPending: be,
		sessionBusy: lt,
		drawer: k,
		embedded: ie,
		menuButton: P,
		closeButton: oe,
		screenMenuButton: se,
		screenMenuWrap: le,
		screenMenu: ce,
		sidebar: bt,
		chatPlane: xt,
		drawerSwipe: St,
		kanban: Je,
		settingsButton: ve,
		inboxUnread: Pt,
		settingsPage: s,
		projectView: a,
		recentSession: $e,
		chooseProfile: ht,
		createSession: ot,
		trackSession: Se,
		newChat: et,
		loadSessions: nt,
		manageSession: dt,
		rename: ct,
		exitPlugin: pt,
		showSettings: wt,
		openDrawer: yt,
		closeDrawer: vt,
		closeScreenMenu: Tt,
		screenLink: g
	};
}
//#endregion
//#region src/features/sessions/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var Kg = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, qg = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Jg = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Yg = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
}, Xg = ["aria-label"], Zg = { class: "session-head mt-4 mb-1 px-2.5 text-xs font-semibold text-[#a3a3a3]" }, Qg = [
	"aria-label",
	"disabled",
	"onClick"
], $g = ["aria-current", "onClick"], e_ = { class: "truncate" }, t_ = ["title"], n_ = [
	"aria-label",
	"disabled",
	"onClick"
], r_ = ["disabled"], i_ = ["aria-label"], a_ = {
	key: 0,
	class: "grid gap-1"
}, o_ = ["disabled"], s_ = ["value"], c_ = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, l_ = ["disabled"], u_ = {
	key: 2,
	class: "grid gap-3 p-1"
}, d_ = ["disabled"], f_ = /* @__PURE__ */ V({
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
				let n = [...t.sessionIds || [], ...Dl(t).map((e) => e.id)];
				for (let r of n) e.set(r, t.label);
			}
			return e;
		});
		function c(e) {
			let t = s.value.get(e.id);
			return [e.source || "Hermes", t].filter(Boolean).join(" · ");
		}
		let l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R("");
		function d(e) {
			l.value = e.id, u.value = e.title || "";
		}
		function f() {
			u.value.trim() && r("rename", l.value, u.value.trim()), l.value = "";
		}
		let p = /* @__PURE__ */ R(), m = /* @__PURE__ */ R(), h = /* @__PURE__ */ R("menu"), g = /* @__PURE__ */ R(""), _ = /* @__PURE__ */ R({
			left: "0px",
			top: "0px"
		}), v = X(() => (n.projects || []).filter((e) => !e.archived && !e.isNoProject && (e.path || e.repos.some((e) => e.path))));
		async function y(e, t) {
			m.value = e, h.value = "menu";
			let n = t.currentTarget.getBoundingClientRect();
			_.value = {
				left: `${Math.max(12, Math.min(n.right - 208, window.innerWidth - 220))}px`,
				top: `${Math.max(12, Math.min(n.bottom, window.innerHeight - 280))}px`
			}, await yn(), p.value?.showModal();
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
		return (t, n) => (W(), G(U, null, [
			e.error ? (W(), G("p", Kg, [J(L(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[0] ||= (e) => r("retry")
			}, "Retry")])) : Y("v-if", !0),
			e.loading && !e.sessions.length ? (W(), G("p", qg, " Loading sessions… ")) : e.sessions.length ? (W(), G("nav", Yg, [(W(!0), G(U, null, H(a.value, (t) => (W(), G("section", {
				key: t.label,
				"aria-label": t.label
			}, [q("h2", Zg, L(t.label), 1), (W(!0), G(U, null, H(t.sessions, (t) => (W(), G("div", {
				key: t.id,
				class: de(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [l.value === t.id ? (W(), G(U, { key: 0 }, [B(q("input", {
				"onUpdate:modelValue": n[1] ||= (e) => u.value = e,
				"aria-label": "Session title",
				maxlength: "160",
				class: "min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-base text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white",
				onKeydown: [Ao(f, ["enter"]), n[2] ||= Ao((e) => l.value = "", ["esc"])]
			}, null, 544), [[vo, u.value]]), q("button", {
				"aria-label": "Save title",
				class: "rounded-md px-2 py-2 text-sm text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				onClick: f
			}, " Save ")], 64)) : (W(), G(U, { key: 1 }, [
				i.value.get(t.id)?.status === "open" ? (W(), G("button", {
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
				}), q("path", { d: "m8 12 3 3 5-6" })], -1)]], 8, Qg)) : Y("v-if", !0),
				q("button", {
					class: "session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-current": e.selected === t.id ? "page" : void 0,
					onClick: (e) => r("select", t.id)
				}, [q("span", e_, L(t.title || "Untitled session"), 1), q("span", {
					class: "truncate text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]",
					title: c(t)
				}, L(c(t)), 9, t_)], 8, $g),
				q("button", {
					class: "icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-label": `Options for ${t.title || "Untitled session"}`,
					"aria-haspopup": "dialog",
					disabled: e.busy,
					onClick: (e) => y(t, e)
				}, " ⋮ ", 8, n_)
			], 64))], 2))), 128))], 8, Xg))), 128))])) : (W(), G("p", Jg, " No conversations yet. ")),
			e.hasMore ? (W(), G("button", {
				key: 4,
				class: "load-more self-start rounded-md px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55",
				disabled: e.loading,
				onClick: n[3] ||= (e) => r("more")
			}, L(e.loading ? "Loading…" : "Load more"), 9, r_)) : Y("v-if", !0),
			q("dialog", {
				ref_key: "popup",
				ref: p,
				class: "session-popup fixed m-0 w-52 rounded-xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl backdrop:bg-transparent",
				style: oe(_.value),
				"aria-label": h.value === "menu" ? "Session options" : h.value === "project" ? "Add to project" : "Delete conversation",
				onClick: n[7] ||= (e) => e.target === e.currentTarget && b()
			}, [h.value === "menu" ? (W(), G("div", a_, [
				q("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					disabled: e.busy || m.value && e.trackingPending?.has(m.value.id),
					onClick: o
				}, L(m.value && i.value.get(m.value.id)?.status === "open" ? "Mark settled" : "Make active"), 9, o_),
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
			])) : h.value === "project" ? (W(), G("form", {
				key: 1,
				class: "grid gap-3 p-1",
				onSubmit: Oo(C, ["prevent"])
			}, [
				n[10] ||= q("label", { for: "session-project" }, "Add to project", -1),
				B(q("select", {
					id: "session-project",
					"onUpdate:modelValue": n[6] ||= (e) => g.value = e,
					class: "min-w-0 rounded-md bg-[#303030] p-2 text-base"
				}, [n[9] ||= q("option", {
					value: "",
					disabled: ""
				}, "Choose project", -1), (W(!0), G(U, null, H(v.value, (e) => (W(), G("option", {
					key: e.id,
					value: e.id
				}, L(e.label), 9, s_))), 128))], 512), [[xo, g.value]]),
				v.value.length ? Y("v-if", !0) : (W(), G("p", c_, "No projects available.")),
				q("button", {
					class: "rounded-lg bg-[#303030] px-3 py-2 disabled:opacity-55",
					disabled: !g.value || e.busy
				}, " Add ", 8, l_),
				q("button", {
					type: "button",
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					onClick: b
				}, " Cancel ")
			], 32)) : (W(), G("div", u_, [
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
				}, " Delete conversation ", 8, d_)
			]))], 12, i_)
		], 64));
	}
}), p_ = { class: "app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white" }, m_ = { class: "brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold" }, h_ = ["aria-label"], g_ = { class: "sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, __ = { class: "drawer-account flex min-w-0 items-center gap-2" }, v_ = ["value"], y_ = ["value"], b_ = ["value"], x_ = ["disabled"], S_ = ["aria-current"], C_ = { class: "main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden" }, w_ = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, T_ = ["aria-expanded"], E_ = { class: "min-w-0 flex-1" }, D_ = { class: "header-title truncate text-base font-medium" }, O_ = {
	key: 0,
	class: "header-project-subtitle truncate text-xs text-[#a3a3a3]"
}, k_ = { class: "topbar-profile sr-only" }, A_ = ["aria-expanded"], j_ = {
	class: "truncate px-3 py-2 text-xs text-[#a3a3a3]",
	role: "presentation"
}, M_ = ["disabled"], N_ = /* @__PURE__ */ V({
	__name: "App",
	setup(e) {
		let t = kc(), { profile: n, session: r, sessions: i, projects: a, selectedProject: o, projectId: s, offline: c, creating: l, profiles: u, loading: d, error: f, hasMore: p, tracking: m, trackingPending: h, sessionBusy: g, drawer: _, embedded: v, menuButton: y, closeButton: b, screenMenuButton: x, screenMenuWrap: S, screenMenu: C, sidebar: w, chatPlane: T, drawerSwipe: E, kanban: D, settingsButton: O, inboxUnread: k, settingsPage: A, projectView: ee, recentSession: j, chooseProfile: te, createSession: M, trackSession: N, newChat: ne, loadSessions: re, manageSession: ie, rename: ae, exitPlugin: P, showSettings: se, openDrawer: ce, closeDrawer: le, closeScreenMenu: ue, screenLink: fe } = Gg();
		return (e, F) => (W(), G("div", p_, [
			q("aside", {
				ref: (e) => w.value = e,
				class: de(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-0.5 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white", z(_) ? "translate-x-0" : "-translate-x-full"]),
				style: oe(z(E).sidebarStyle.value),
				onTouchstart: F[15] ||= (...e) => z(E).start && z(E).start(...e),
				onTouchmove: F[16] ||= (...e) => z(E).move && z(E).move(...e),
				onTouchend: F[17] ||= (...e) => z(E).end && z(E).end(...e),
				onTouchcancel: F[18] ||= (...e) => z(E).cancel && z(E).cancel(...e),
				onClickCapture: F[19] ||= (...e) => z(E).click && z(E).click(...e),
				"aria-label": "Navigation"
			}, [
				q("div", m_, [
					F[32] ||= q("span", { class: "min-w-0 truncate" }, "ChatHermes", -1),
					z(v) ? (W(), G("button", {
						key: 0,
						class: "drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Return to Hermes Desktop",
						title: "Return to Hermes Desktop",
						onClick: F[0] ||= (...e) => z(P) && z(P)(...e)
					}, [...F[31] ||= [q("svg", {
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
						onClick: F[1] ||= (...e) => z(le) && z(le)(...e)
					}, " × ", 512)
				]),
				qi(z(yc), {
					class: "inbox-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": z(t).name === "inbox" ? "page" : void 0,
					to: z(fe)("inbox"),
					onClick: F[2] ||= (e) => _.value = !1
				}, {
					default: jn(() => [
						F[33] ||= q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "M4 4h16v16H4zM4 13h4l2 3h4l2-3h4" })], -1),
						F[34] ||= J(" Inbox ", -1),
						z(k) ? (W(), G("span", {
							key: 0,
							class: "ml-auto rounded-full bg-[#424242] px-2 text-sm leading-[1.5]",
							"aria-label": `${z(k)} unread notifications`
						}, L(z(k)), 9, h_)) : Y("v-if", !0)
					]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(z(yc), {
					class: "projects-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": z(t).meta.section === "projects" ? "page" : void 0,
					to: z(fe)("projects"),
					onClick: F[3] ||= (e) => _.value = !1
				}, {
					default: jn(() => [...F[35] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1), J("Projects ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(z(yc), {
					class: "scheduled-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": z(t).meta.section === "scheduled" ? "page" : void 0,
					to: z(fe)("scheduled"),
					onClick: F[4] ||= (e) => _.value = !1
				}, {
					default: jn(() => [...F[36] ||= [q("svg", {
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
				qi(z(yc), {
					class: "artifacts-nav flex min-h-[36px] items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": z(t).name === "artifacts" ? "page" : void 0,
					to: z(fe)("artifacts"),
					onClick: F[5] ||= (e) => _.value = !1
				}, {
					default: jn(() => [...F[37] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" })], -1), J("Artifacts ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				z(D).visible.value ? (W(), K(z(yc), {
					key: 0,
					class: "kanban-nav flex min-h-[36px] w-full items-center gap-3 rounded-lg px-3 py-1 text-left text-base hover:bg-[#303030]",
					"aria-current": z(t).name === "kanban" ? "page" : void 0,
					to: z(fe)("kanban"),
					onClick: F[6] ||= (e) => _.value = !1
				}, {
					default: jn(() => [...F[38] ||= [q("svg", {
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
				(W(), K(f_, {
					heading: "Recents",
					sessions: z(i),
					tracking: z(m),
					"tracking-pending": z(h),
					onTrack: z(N),
					selected: z(r),
					loading: z(d),
					error: z(f),
					"has-more": z(p),
					busy: z(c) || z(l) || z(g),
					projects: z(a),
					key: z(n),
					onArchive: F[7] ||= (e) => z(ie)("archive", e),
					onDelete: F[8] ||= (e) => z(ie)("delete", e),
					onProject: F[9] ||= (e, t) => z(ie)("project", e, t),
					onSelect: z(j),
					onCreate: z(ne),
					onMore: F[10] ||= (e) => z(re)(!0),
					onRetry: F[11] ||= (e) => z(re)(),
					onRename: z(ae)
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
				q("div", g_, [
					F[42] ||= q("label", { for: "profile-field" }, "Profile", -1),
					q("div", __, [
						q("select", {
							id: "profile-field",
							class: "profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white",
							value: z(n),
							onChange: F[12] ||= (e) => z(te)(e.target.value)
						}, [
							F[39] ||= q("option", { value: "" }, "Default profile", -1),
							z(n) && !z(u).some((e) => e.name === z(n)) ? (W(), G("option", {
								key: 0,
								value: z(n)
							}, L(z(n)), 9, y_)) : Y("v-if", !0),
							(W(!0), G(U, null, H(z(u), (e) => (W(), G("option", {
								key: e.name,
								value: e.name
							}, L(e.name), 9, b_))), 128))
						], 40, v_),
						q("button", {
							class: "drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55",
							"aria-label": "New chat",
							title: "New chat",
							disabled: z(c) || z(l),
							onClick: F[13] ||= (...e) => z(ne) && z(ne)(...e)
						}, [...F[40] ||= [q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z" })], -1)]], 8, x_),
						q("button", {
							ref: (e) => O.value = e,
							class: "drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]",
							"aria-label": "Settings",
							"aria-current": z(A) ? "page" : void 0,
							onClick: F[14] ||= (e) => z(se)()
						}, [...F[41] ||= [q("svg", {
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
						})], -1)]], 8, S_)
					]),
					q("span", null, [q("span", { class: de(["status-dot mr-2 inline-block size-2 rounded-full", z(c) ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), J(L(z(c) ? "Offline · read only" : "Connected through dashboard"), 1)])
				])
			], 38),
			z(_) || z(E).dragging.value ? (W(), G("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				style: oe(z(E).scrimStyle.value),
				onTouchstart: F[20] ||= (...e) => z(E).start && z(E).start(...e),
				onTouchmove: F[21] ||= (...e) => z(E).move && z(E).move(...e),
				onTouchend: F[22] ||= (...e) => z(E).end && z(E).end(...e),
				onTouchcancel: F[23] ||= (...e) => z(E).cancel && z(E).cancel(...e),
				onClickCapture: F[24] ||= (...e) => z(E).click && z(E).click(...e),
				onClick: F[25] ||= (...e) => z(le) && z(le)(...e)
			}, null, 36)) : Y("v-if", !0),
			q("main", C_, [
				q("header", w_, [
					q("button", {
						ref: (e) => y.value = e,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": z(_),
						onClick: F[26] ||= (...e) => z(ce) && z(ce)(...e)
					}, [...F[43] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, T_),
					q("div", E_, [q("h1", D_, L(z(t).meta.title || z(i).find((e) => e.id === z(r))?.title || (z(r) ? "Conversation" : z(o)?.label || "ChatHermes")), 1), !z(A) && z(s) && z(r) && z(o) ? (W(), G("p", O_, L(z(o).label), 1)) : Y("v-if", !0)]),
					q("span", k_, L(z(n) || "Current profile"), 1),
					z(A) ? Y("v-if", !0) : (W(), G("div", {
						key: 0,
						ref: (e) => S.value = e,
						class: "screen-menu-wrap relative",
						onKeydown: F[30] ||= Ao(Oo((e) => z(ue)(), ["stop", "prevent"]), ["esc"])
					}, [q("button", {
						ref: (e) => x.value = e,
						class: "screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]",
						"aria-label": "Screen options",
						"aria-haspopup": "menu",
						"aria-expanded": z(C),
						"aria-controls": "screen-menu",
						onClick: F[27] ||= (e) => C.value = !z(C)
					}, " ··· ", 8, A_), B(q("div", {
						id: "screen-menu",
						class: "screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl",
						role: "menu",
						"aria-label": "Screen options",
						onClick: F[29] ||= (e) => z(ue)()
					}, [
						q("span", j_, L(z(n) || "Current profile"), 1),
						q("button", {
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: z(c) || z(l) || z(ee) && (!z(o) || z(o).archived || !z(o).isNoProject && !z(El)(z(o))),
							onClick: F[28] ||= (e) => {
								z(ee) ? z(M)() : z(ne)(), z(ue)();
							}
						}, " New chat ", 8, M_),
						qi(z(Ec), { name: "actions" })
					], 512), [[Ia, z(C)]])], 544))
				]),
				qi(z(Ec), { name: "dialogs" }),
				qi(mg, {
					ref: (e) => T.value = e,
					onTouchstart: z(E).start,
					onTouchmove: z(E).move,
					onTouchend: z(E).end,
					onTouchcancel: z(E).cancel,
					onClickCapture: z(E).click,
					"show-chat": z(t).meta.chat === !0,
					"hide-composer": z(t).meta.hideComposer === !0
				}, {
					default: jn(() => [(W(), K(z(Ec), { key: z(n) }))]),
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
				F[44] ||= q("footer", {
					class: "app-footer shrink-0 bg-black",
					"aria-hidden": "true"
				}, null, -1)
			])
		]));
	}
});
//#endregion
//#region src/features/kanban/useBoard.ts
function P_(e, t, n, r) {
	let i = /* @__PURE__ */ R(), a = /* @__PURE__ */ R(), o = /* @__PURE__ */ R(), s = /* @__PURE__ */ R(""), c = /* @__PURE__ */ R(""), l = /* @__PURE__ */ R(!1), u = /* @__PURE__ */ R(document.visibilityState === "visible"), d = () => {
		u.value = document.visibilityState === "visible";
	};
	document.addEventListener("visibilitychange", d), fr(() => document.removeEventListener("visibilitychange", d));
	let f = async () => {};
	return Ln([
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
					let t = await Hc.board(e, n.value, m.signal);
					if (h) return;
					i.value = t, v ??= typeof t.latest_event_id == "number" ? t.latest_event_id : void 0, !y && !x && !b && w(), c.value = "";
				} catch (e) {
					h || (c.value = e instanceof zc ? e.message : "Could not load Kanban. Retry when the dashboard is connected.", e instanceof zc && [
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
					let t = await Uc(e, v);
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
				let [i, c] = await Promise.all([Hc.task(e, t, r.signal), Hc.log(e, t, r.signal)]);
				!h && n === E && s.value === t && (a.value = i, o.value = c);
			} catch (e) {
				!h && n === E && !r.signal.aborted && (c.value = e instanceof zc ? e.message : "Could not load task details.", e instanceof zc && e.status === 404 && (a.value = void 0, o.value = void 0, s.value = ""));
			}
		}
		let k = Ln(s, () => {
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
var F_ = { key: 0 }, I_ = ["value"], L_ = {
	key: 1,
	class: "kanban-inline"
}, R_ = ["value"], z_ = { class: "kanban-toolbar" }, B_ = ["disabled"], V_ = ["disabled"], H_ = /* @__PURE__ */ V({
	__name: "TaskForm",
	props: {
		task: {},
		assignees: {},
		busy: { type: Boolean }
	},
	emits: ["save", "cancel"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R(n.task?.title || ""), a = /* @__PURE__ */ R(n.task?.body || ""), o = /* @__PURE__ */ R(n.task?.priority || 0), s = /* @__PURE__ */ R(n.task?.assignee || ""), c = /* @__PURE__ */ R(n.task?.model_override || ""), l = /* @__PURE__ */ R(n.task?.provider_override || ""), u = /* @__PURE__ */ R(n.task?.reasoning_effort || ""), d = /* @__PURE__ */ R(!1);
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
		return (t, n) => (W(), G("form", {
			class: "kanban-form",
			onSubmit: Oo(f, ["prevent"])
		}, [
			q("label", null, [n[9] ||= J("Title", -1), B(q("input", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				required: "",
				"aria-label": "Task title"
			}, null, 512), [[vo, i.value]])]),
			q("label", null, [n[10] ||= J("Description", -1), B(q("textarea", {
				"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
				rows: "4",
				"aria-label": "Task description"
			}, null, 512), [[vo, a.value]])]),
			q("label", null, [n[11] ||= J("Priority", -1), B(q("input", {
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
			e.task ? Y("v-if", !0) : (W(), G("label", F_, [n[13] ||= J("Assignee", -1), B(q("select", {
				"onUpdate:modelValue": n[3] ||= (e) => s.value = e,
				"aria-label": "Task assignee"
			}, [n[12] ||= q("option", { value: "" }, "Unassigned", -1), (W(!0), G(U, null, H(e.assignees, (e) => (W(), G("option", {
				key: e,
				value: e
			}, L(e), 9, I_))), 128))], 512), [[xo, s.value]])])),
			e.task ? Y("v-if", !0) : (W(), G("label", L_, [B(q("input", {
				"onUpdate:modelValue": n[4] ||= (e) => d.value = e,
				type: "checkbox"
			}, null, 512), [[yo, d.value]]), n[14] ||= J("Start in triage", -1)])),
			q("details", null, [
				n[19] ||= q("summary", null, "Worker overrides", -1),
				n[20] ||= q("p", { class: "kanban-muted" }, " Blank values inherit the assigned profile. Overrides apply to the next worker run. ", -1),
				q("label", null, [n[15] ||= J("Model override", -1), B(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					"aria-label": "Task model override"
				}, null, 512), [[vo, c.value]])]),
				q("label", null, [n[16] ||= J("Provider override", -1), B(q("input", {
					"onUpdate:modelValue": n[6] ||= (e) => l.value = e,
					"aria-label": "Task provider override"
				}, null, 512), [[vo, l.value]])]),
				q("label", null, [n[18] ||= J("Reasoning effort", -1), B(q("select", {
					"onUpdate:modelValue": n[7] ||= (e) => u.value = e,
					"aria-label": "Task reasoning effort"
				}, [n[17] ||= q("option", { value: "" }, "Inherit profile", -1), (W(), G(U, null, H([
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
				}, L(e), 9, R_)), 64))], 512), [[xo, u.value]])])
			]),
			q("div", z_, [q("button", {
				disabled: e.busy || !i.value.trim(),
				type: "submit"
			}, L(e.task ? "Save task" : "Create task"), 9, B_), q("button", {
				type: "button",
				disabled: e.busy,
				onClick: n[8] ||= (e) => r("cancel")
			}, "Cancel", 8, V_)])
		], 32));
	}
}), U_ = {
	class: "kanban-detail",
	"aria-label": "Task details"
}, W_ = { class: "kanban-toolbar" }, G_ = { class: "kanban-muted" }, K_ = { key: 0 }, q_ = { key: 1 }, J_ = {
	key: 2,
	class: "kanban-muted"
}, Y_ = { key: 0 }, X_ = { class: "kanban-prose" }, Z_ = ["disabled"], Q_ = { class: "kanban-toolbar" }, $_ = ["value", "disabled"], ev = ["value"], tv = ["value"], nv = ["disabled"], rv = ["disabled"], iv = ["value"], av = ["disabled"], ov = { key: 5 }, sv = { class: "kanban-prose" }, cv = { class: "kanban-prose" }, lv = { open: "" }, uv = {
	key: 0,
	class: "kanban-muted"
}, dv = ["onClick"], fv = { open: "" }, pv = { class: "kanban-muted" }, mv = { class: "kanban-prose" }, hv = ["disabled"], gv = {
	key: 6,
	open: ""
}, _v = ["href"], vv = { class: "kanban-muted" }, yv = [
	"disabled",
	"aria-label",
	"onClick"
], bv = { class: "kanban-upload" }, xv = ["disabled"], Sv = {
	key: 0,
	class: "kanban-muted"
}, Cv = { class: "kanban-prose" }, wv = {
	key: 0,
	class: "kanban-prose"
}, Tv = {
	key: 0,
	class: "kanban-muted"
}, Ev = {
	key: 0,
	class: "kanban-muted"
}, Dv = ["disabled"], Ov = /* @__PURE__ */ V({
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
		let n = e, r = t, i = /* @__PURE__ */ R();
		cr(() => i.value?.focus());
		let a = /* @__PURE__ */ R(!1), o = /* @__PURE__ */ R(""), s = /* @__PURE__ */ R(n.detail.task.assignee || ""), c = /* @__PURE__ */ R(!1);
		Ln(() => n.detail.task.assignee, (e) => {
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
		return (t, n) => (W(), G("section", U_, [
			q("div", W_, [q("h2", {
				ref_key: "heading",
				ref: i,
				tabindex: "-1",
				class: "min-w-0 flex-1 break-words text-xl"
			}, L(e.detail.task.title), 513), q("button", {
				"aria-label": "Close task details",
				onClick: n[0] ||= (e) => r("close")
			}, "Close")]),
			q("p", G_, L(e.detail.task.id) + " · " + L(e.detail.task.status) + " · Priority " + L(e.detail.task.priority ?? 0), 1),
			e.detail.task.progress ? (W(), G("p", K_, L(e.detail.task.progress.done) + "/" + L(e.detail.task.progress.total) + " subtasks complete ", 1)) : Y("v-if", !0),
			e.detail.task.block_kind ? (W(), G("p", q_, "Block reason: " + L(e.detail.task.block_kind), 1)) : Y("v-if", !0),
			e.detail.task.worker_pid ? (W(), G("p", J_, [J(" Worker " + L(e.detail.task.worker_pid), 1), e.detail.task.last_heartbeat_at ? (W(), G("span", Y_, " · Heartbeat " + L(m(e.detail.task.last_heartbeat_at)), 1)) : Y("v-if", !0)])) : Y("v-if", !0),
			a.value ? (W(), K(H_, {
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
			])) : (W(), G(U, { key: 4 }, [q("p", X_, L(e.detail.task.body || "No description."), 1), q("button", {
				disabled: e.busy,
				onClick: n[2] ||= (e) => a.value = !0
			}, "Edit task", 8, Z_)], 64)),
			q("div", Q_, [
				q("label", null, [n[11] ||= J("Move task", -1), q("select", {
					"aria-label": "Move task",
					value: e.detail.task.status,
					disabled: e.busy || !e.workflow,
					onChange: n[3] ||= (e) => u("", "PATCH", { status: e.target.value })
				}, [q("option", { value: e.detail.task.status }, L(e.detail.task.status), 9, ev), (W(!0), G(U, null, H(e.workflow?.columns.filter((t) => t.drag_target && e.workflow?.manual[e.detail.task.status]?.includes(t.key)), (e) => (W(), G("option", {
					key: e.key,
					value: e.key
				}, L(e.label), 9, tv))), 128))], 40, $_)]),
				e.detail.task.status === "archived" ? Y("v-if", !0) : (W(), G("button", {
					key: 0,
					disabled: e.busy,
					onClick: n[4] ||= (e) => u("", "PATCH", { status: "archived" })
				}, " Archive task ", 8, nv)),
				e.detail.task.status === "running" ? (W(), G("button", {
					key: 1,
					disabled: e.busy,
					onClick: n[5] ||= (e) => u("/reclaim", "POST", {})
				}, " Reclaim worker ", 8, rv)) : Y("v-if", !0)
			]),
			q("form", {
				class: "kanban-toolbar",
				onSubmit: n[7] ||= Oo((e) => u("/reassign", "POST", {
					profile: s.value,
					reclaim_first: !0
				}), ["prevent"])
			}, [
				q("label", null, [n[13] ||= J("Assignee", -1), B(q("select", {
					"onUpdate:modelValue": n[6] ||= (e) => s.value = e,
					"aria-label": "Reassign task"
				}, [n[12] ||= q("option", { value: "" }, "Unassigned", -1), (W(!0), G(U, null, H(Array.from(new Set([...e.assignees, e.detail.task.assignee || ""].filter(Boolean))), (e) => (W(), G("option", {
					key: e,
					value: e
				}, L(e), 9, iv))), 128))], 512), [[xo, s.value]])]),
				q("button", { disabled: e.busy }, "Reassign task", 8, av),
				n[14] ||= q("p", { class: "kanban-muted" }, "Reassigning releases any active worker claim.", -1)
			], 32),
			e.detail.task.latest_summary || e.detail.task.result ? (W(), G("details", ov, [
				n[15] ||= q("summary", null, "Result and latest summary", -1),
				q("p", sv, L(e.detail.task.latest_summary), 1),
				q("p", cv, L(e.detail.task.result), 1)
			])) : Y("v-if", !0),
			q("details", lv, [n[16] ||= q("summary", null, "Dependencies and linked tasks", -1), (W(), G(U, null, H(["parents", "children"], (t) => q("div", { key: t }, [
				q("h3", null, L(t === "parents" ? "Depends on" : "Children"), 1),
				e.detail.links[t].length ? Y("v-if", !0) : (W(), G("p", uv, "None")),
				(W(!0), G(U, null, H(e.detail.links[t], (t) => (W(), G("button", {
					key: t,
					class: "kanban-link",
					onClick: (e) => r("select", t)
				}, L(e.detail.link_tasks?.find((e) => e.id === t)?.title || t) + " · " + L(e.detail.link_tasks?.find((e) => e.id === t)?.status), 9, dv))), 128))
			])), 64))]),
			q("details", fv, [
				q("summary", null, "Comments (" + L(e.detail.comments.length) + ")", 1),
				(W(!0), G(U, null, H(e.detail.comments, (e) => (W(), G("article", {
					key: e.id,
					class: "kanban-comment"
				}, [q("p", pv, L(e.author) + " · " + L(m(e.created_at)), 1), q("p", mv, L(e.body), 1)]))), 128)),
				q("form", {
					class: "kanban-form",
					onSubmit: Oo(f, ["prevent"])
				}, [q("label", null, [n[17] ||= J("Comment", -1), B(q("textarea", {
					"onUpdate:modelValue": n[8] ||= (e) => o.value = e,
					"aria-label": "New task comment",
					required: "",
					rows: "3"
				}, null, 512), [[vo, o.value]])]), q("button", { disabled: e.busy || !o.value.trim() }, "Add comment", 8, hv)], 32)
			]),
			e.detail.attachments == null ? Y("v-if", !0) : (W(), G("details", gv, [
				q("summary", null, "Attachments (" + L(e.detail.attachments.length) + ")", 1),
				(W(!0), G(U, null, H(e.detail.attachments, (t) => (W(), G("div", {
					key: t.id,
					class: "kanban-toolbar"
				}, [
					q("a", {
						class: "kanban-link",
						href: z(Bc)("/attachments/" + encodeURIComponent(t.id), e.board),
						target: "_blank",
						rel: "noopener"
					}, L(t.filename), 9, _v),
					q("span", vv, L(t.size ?? 0) + " bytes", 1),
					q("button", {
						disabled: e.busy,
						"aria-label": "Remove attachment " + t.filename,
						onClick: (e) => r("operation", "/attachments/" + encodeURIComponent(t.id), "DELETE", void 0, !1)
					}, " Remove ", 8, yv)
				]))), 128)),
				q("label", bv, [n[18] ||= J("Attach file", -1), q("input", {
					type: "file",
					"aria-label": "Task attachment",
					disabled: e.busy,
					onChange: p
				}, null, 40, xv)])
			])),
			q("details", null, [
				q("summary", null, "Run history (" + L(e.detail.runs.length) + ")", 1),
				e.detail.runs.length ? Y("v-if", !0) : (W(), G("p", Sv, "No runs yet.")),
				(W(!0), G(U, null, H(e.detail.runs, (e) => (W(), G("article", {
					key: e.id,
					class: "kanban-comment"
				}, [
					q("h3", null, "Run " + L(e.id) + " · " + L(e.profile) + " · " + L(e.outcome || e.status), 1),
					q("p", Cv, L(e.summary), 1),
					e.error ? (W(), G("p", wv, L(e.error), 1)) : Y("v-if", !0)
				]))), 128))
			]),
			q("details", null, [n[19] ||= q("summary", null, "Worker log", -1), e.log?.exists ? (W(), G(U, { key: 1 }, [e.log.truncated ? (W(), G("p", Ev, "Showing the last 16 KiB.")) : Y("v-if", !0), q("pre", null, L(e.log.content), 1)], 64)) : (W(), G("p", Tv, "No worker log yet."))]),
			q("details", null, [q("summary", null, "Activity (" + L(e.detail.events.length) + ")", 1), (W(!0), G(U, null, H(e.detail.events, (e) => (W(), G("p", {
				key: e.id,
				class: "kanban-muted"
			}, L(e.kind) + " · " + L(m(e.created_at)), 1))), 128))]),
			q("details", null, [
				n[20] ||= q("summary", null, "Delete task", -1),
				n[21] ||= q("p", null, "Delete this task permanently?", -1),
				c.value ? (W(), G("button", {
					key: 1,
					disabled: e.busy,
					onClick: n[10] ||= (e) => u("", "DELETE", void 0)
				}, " Confirm delete task ", 8, Dv)) : (W(), G("button", {
					key: 0,
					onClick: n[9] ||= (e) => c.value = !0
				}, "Delete task…"))
			])
		]));
	}
}), kv = {
	key: 0,
	class: "kanban-empty"
}, Av = ["disabled"], jv = { class: "kanban-toolbar" }, Mv = ["value"], Nv = ["disabled", "aria-expanded"], Pv = {
	key: 1,
	role: "alert",
	class: "kanban-error"
}, Fv = {
	key: 2,
	role: "status",
	class: "kanban-muted"
}, Iv = {
	key: 3,
	class: "kanban-muted"
}, Lv = { key: 0 }, Rv = { class: "kanban-toolbar" }, zv = ["disabled"], Bv = ["disabled"], Vv = ["disabled"], Hv = ["disabled"], Uv = {
	key: 5,
	role: "status"
}, Wv = {
	key: 6,
	class: "kanban-empty"
}, Gv = {
	class: "kanban-columns",
	"aria-label": "Board columns"
}, Kv = ["aria-label", "onDrop"], qv = { class: "kanban-muted" }, Jv = {
	key: 0,
	class: "kanban-muted"
}, Yv = [
	"data-task-id",
	"draggable",
	"onDragstart",
	"onClick"
], Xv = { class: "kanban-muted" }, Zv = { key: 0 }, Qv = { key: 1 }, $v = { key: 2 }, ey = {
	key: 3,
	class: "kanban-card-summary"
}, ty = {
	key: 1,
	class: "kanban-detail",
	"aria-label": "Task details"
}, ny = /* @__PURE__ */ V({
	__name: "KanbanPage",
	setup(e) {
		let t = Yc(), n = kc(), r = /* @__PURE__ */ R();
		async function i() {
			let e = w.value;
			w.value = "", await yn(), Array.from(r.value?.querySelectorAll(".kanban-card") || []).find((t) => t.dataset.taskId === e)?.focus();
		}
		let a = /* @__PURE__ */ R([]), o = /* @__PURE__ */ R(""), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(), l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R(""), d = /* @__PURE__ */ R(""), f = /* @__PURE__ */ R(!1), p = /* @__PURE__ */ R(!1), m = /* @__PURE__ */ R(""), h = /* @__PURE__ */ R(""), g = /* @__PURE__ */ R(""), _ = /* @__PURE__ */ R(""), v = /* @__PURE__ */ R(""), y = /* @__PURE__ */ R(!1), b = P_(o, t.visible, s, () => {
			t.check();
		}), { snapshot: x, detail: S, log: C, taskId: w, error: T, loading: E } = b, D = X(() => a.value.find((e) => e.slug === o.value)), O = !1, k = 0;
		fr(() => {
			O = !0, k++, t.screenActions.value = [];
		});
		function A() {
			try {
				return localStorage.getItem("chathermes.kanban-board") || "";
			} catch {
				return "";
			}
		}
		let ee;
		async function j() {
			ee?.abort();
			let e = ee = new AbortController(), r = k;
			try {
				let i = await Hc.boards(e.signal);
				if (O || r !== k || !t.visible.value) return;
				if (a.value = i.boards, !i.boards.some((e) => e.slug === o.value)) {
					let e = typeof n.query.board == "string" ? n.query.board : A();
					o.value = i.boards.find((t) => t.slug === e)?.slug || i.boards.find((e) => e.slug === i.current)?.slug || i.boards[0]?.slug || "";
				}
				l.value = "";
			} catch (n) {
				!O && !e.signal.aborted && r === k && (l.value = n instanceof zc ? n.message : "Could not load boards.", n instanceof zc && [
					401,
					403,
					404,
					503
				].includes(n.status) && t.unavailable());
			}
		}
		Ln(t.visible, (e, t, n) => {
			if (k++, !e) {
				a.value = [], o.value = "", c.value = void 0, p.value = !1, m.value = "", f.value = !1;
				return;
			}
			let r = new AbortController();
			j(), Hc.workflow(r.signal).then((e) => {
				r.signal.aborted || (c.value = e);
			}).catch(() => {});
			let i = setInterval(() => {
				document.visibilityState === "visible" && j();
			}, 8e3);
			n(() => {
				r.abort(), ee?.abort(), clearInterval(i);
			});
		}, { immediate: !0 }), Ln(o, (e) => {
			k++, f.value = !1, p.value = !1, m.value = "", u.value = "", d.value = "", y.value = !1, e === n.query.board && typeof n.query.task == "string" && (w.value = n.query.task);
			try {
				localStorage.setItem("chathermes.kanban-board", e);
			} catch {}
		}), Ln([
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
		}, { immediate: !0 }), Ln([
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
						N();
					}
				},
				{
					label: "New board",
					disabled: f.value,
					run: () => {
						P("create");
					}
				},
				{
					label: "Board settings",
					disabled: f.value || !o.value,
					run: () => {
						P("edit");
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
		async function te() {
			p.value = !0, await yn(), r.value?.querySelector("input[aria-label=\"Task title\"]")?.focus();
		}
		async function M() {
			p.value = !1, await yn(), r.value?.querySelector(".kanban-new-task")?.focus();
		}
		async function N() {
			await Promise.all([j(), b.refresh()]);
		}
		async function ne(e, n, r = !1) {
			if (f.value || !t.visible.value) return;
			let i = k, a = o.value;
			f.value = !0, u.value = "", d.value = "";
			try {
				let t = await e();
				if (r && a && Hc.write("/dispatch", "POST", {}, a).catch(() => {}), O || i !== k) return;
				if (t && typeof t == "object" && "ok" in t && t.ok === !1) {
					u.value = "Hermes could not complete this action. Check the task state in Hermes.";
					return;
				}
				t && typeof t == "object" && "warning" in t && t.warning && (d.value = "Hermes saved the task with a dispatcher warning. Check the Hermes dispatcher if it does not start."), n?.(), await N();
			} catch (e) {
				!O && i === k && (u.value = e instanceof zc ? e.message : "Kanban operation failed. Refresh to inspect the outcome before retrying.", await b.refresh());
			} finally {
				!O && i === k && (f.value = !1);
			}
		}
		function re(e, t, n, r = !0, i) {
			let a = o.value;
			ne(() => Hc.write(e, t, n, a), () => {
				i?.(), t === "DELETE" && e === "/tasks/" + encodeURIComponent(w.value) && (w.value = "");
			}, r);
		}
		async function ie(e) {
			let t = o.value, n = k, r = !1;
			await ne(async () => {
				let n = await Hc.write("/tasks", "POST", e, t);
				return r = !0, n;
			}, void 0, !0), r && !O && n === k && await M();
		}
		function ae(e) {
			let t = o.value, n = w.value;
			ne(() => Hc.upload(t, n, e));
		}
		function P(e) {
			m.value = e, h.value = e === "edit" ? o.value : "", g.value = e === "edit" && D.value?.name || "", _.value = e === "edit" && D.value?.description || "", v.value = e === "edit" && D.value?.default_workdir || "";
		}
		function oe() {
			let e = m.value === "edit", t = {
				name: g.value,
				description: _.value,
				default_workdir: v.value,
				...e ? {} : {
					slug: h.value.trim(),
					switch: !1
				}
			};
			ne(() => Hc.write("/boards" + (e ? "/" + encodeURIComponent(o.value) : ""), e ? "PATCH" : "POST", t), () => {
				m.value = "";
			});
		}
		function se() {
			let e = o.value;
			ne(() => Hc.write("/boards/" + encodeURIComponent(e), "DELETE", void 0), () => {
				y.value = !1;
			});
		}
		function ce(e, t) {
			let n = x.value?.columns.flatMap((e) => e.tasks).find((t) => t.id === e);
			n && c.value?.columns.some((e) => e.key === t && e.drag_target) && c.value.manual[n.status]?.includes(t) && re("/tasks/" + encodeURIComponent(e), "PATCH", { status: t });
		}
		function le(e, t) {
			e.dataTransfer?.setData("application/x-chathermes-task", JSON.stringify({
				board: o.value,
				id: t
			}));
		}
		function ue(e, t) {
			try {
				let n = JSON.parse(e.dataTransfer?.getData("application/x-chathermes-task") || "");
				n.board === o.value && ce(n.id, t);
			} catch {}
		}
		return (e, n) => (W(), G("section", {
			ref_key: "page",
			ref: r,
			class: "kanban-page page-content",
			"aria-label": "Kanban viewer"
		}, [z(t).visible.value ? (W(), G(U, { key: 1 }, [
			q("div", jv, [q("label", null, [n[11] ||= J("Board", -1), B(q("select", {
				"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
				"aria-label": "Kanban board"
			}, [(W(!0), G(U, null, H(a.value, (e) => (W(), G("option", {
				key: e.slug,
				value: e.slug
			}, L(e.name || e.slug), 9, Mv))), 128))], 512), [[xo, o.value]])]), q("button", {
				class: "kanban-new-task",
				disabled: f.value || !o.value || p.value,
				"aria-expanded": p.value,
				onClick: te
			}, " New task ", 8, Nv)]),
			p.value ? (W(), K(H_, {
				key: o.value,
				assignees: z(x)?.assignees || [],
				busy: f.value,
				onSave: ie,
				onCancel: M
			}, null, 8, ["assignees", "busy"])) : Y("v-if", !0),
			l.value || u.value || z(T) ? (W(), G("p", Pv, L(u.value || l.value || z(T)), 1)) : Y("v-if", !0),
			d.value ? (W(), G("p", Fv, L(d.value), 1)) : Y("v-if", !0),
			c.value ? Y("v-if", !0) : (W(), G("p", Iv, " Manual movement is unavailable until the Hermes workflow API responds. ")),
			m.value ? (W(), G("form", {
				key: 4,
				class: "kanban-form kanban-board-editor",
				"aria-label": "Board settings",
				onSubmit: Oo(oe, ["prevent"])
			}, [
				m.value === "create" ? (W(), G("label", Lv, [n[12] ||= J("Board slug", -1), B(q("input", {
					"onUpdate:modelValue": n[2] ||= (e) => h.value = e,
					required: "",
					"aria-label": "Board slug"
				}, null, 512), [[vo, h.value]])])) : Y("v-if", !0),
				q("label", null, [n[13] ||= J("Board name", -1), B(q("input", {
					"onUpdate:modelValue": n[3] ||= (e) => g.value = e,
					"aria-label": "Board name"
				}, null, 512), [[vo, g.value]])]),
				q("label", null, [n[14] ||= J("Description", -1), B(q("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => _.value = e,
					"aria-label": "Board description"
				}, null, 512), [[vo, _.value]])]),
				q("label", null, [n[15] ||= J("Default directory on Hermes", -1), B(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => v.value = e,
					"aria-label": "Board default directory"
				}, null, 512), [[vo, v.value]])]),
				q("div", Rv, [
					q("button", { disabled: f.value }, "Save board", 8, zv),
					q("button", {
						type: "button",
						disabled: f.value,
						onClick: n[6] ||= (e) => m.value = ""
					}, "Cancel", 8, Bv),
					m.value === "edit" && o.value !== "default" && !y.value ? (W(), G("button", {
						key: 0,
						type: "button",
						disabled: f.value,
						onClick: n[7] ||= (e) => y.value = !0
					}, " Archive board…", 8, Vv)) : Y("v-if", !0),
					y.value ? (W(), G("button", {
						key: 1,
						type: "button",
						disabled: f.value,
						onClick: se
					}, " Confirm archive board ", 8, Hv)) : Y("v-if", !0)
				])
			], 32)) : Y("v-if", !0),
			z(E) ? (W(), G("p", Uv, "Loading board…")) : !a.value.length && !l.value ? (W(), G("p", Wv, " No boards available. Create a board to get started. ")) : Y("v-if", !0),
			q("div", { class: de(["kanban-workspace", { "has-detail": z(w) }]) }, [q("div", Gv, [(W(!0), G(U, null, H(z(x)?.columns, (e) => (W(), G("section", {
				key: e.name,
				class: de(["kanban-column", { "kanban-column-empty": !e.tasks.length }]),
				"aria-label": e.name + " tasks",
				onDragover: n[8] ||= Oo(() => {}, ["prevent"]),
				onDrop: Oo((t) => ue(t, e.name), ["prevent"])
			}, [
				q("h2", null, [J(L(c.value?.columns.find((t) => t.key === e.name)?.label || e.name) + " ", 1), q("span", qv, L(e.tasks.length), 1)]),
				e.tasks.length ? Y("v-if", !0) : (W(), G("p", Jv, "No tasks")),
				(W(!0), G(U, null, H(e.tasks, (e) => (W(), G("button", {
					key: e.id,
					class: de(["kanban-card", { selected: z(w) === e.id }]),
					"data-task-id": e.id,
					draggable: !f.value,
					onDragstart: (t) => le(t, e.id),
					onClick: (t) => w.value = e.id
				}, [
					q("strong", null, L(e.title), 1),
					q("span", Xv, L(e.status) + " · " + L(e.assignee || "Unassigned") + " · Priority " + L(e.priority ?? 0), 1),
					e.progress ? (W(), G("span", Zv, L(e.progress.done) + "/" + L(e.progress.total) + " subtasks", 1)) : Y("v-if", !0),
					e.comment_count ? (W(), G("span", Qv, L(e.comment_count) + " comments", 1)) : Y("v-if", !0),
					e.warnings?.count ? (W(), G("span", $v, L(e.warnings.count) + " warnings", 1)) : Y("v-if", !0),
					e.latest_summary ? (W(), G("span", ey, L(e.latest_summary), 1)) : Y("v-if", !0)
				], 42, Yv))), 128))
			], 42, Kv))), 128))]), z(S) ? (W(), K(Ov, {
				key: o.value + ":" + z(S).task.id,
				board: o.value,
				detail: z(S),
				log: z(C),
				workflow: c.value,
				assignees: z(x)?.assignees || [],
				busy: f.value,
				onClose: i,
				onSelect: n[9] ||= (e) => w.value = e,
				onOperation: re,
				onUpload: ae
			}, null, 8, [
				"board",
				"detail",
				"log",
				"workflow",
				"assignees",
				"busy"
			])) : z(w) ? (W(), G("section", ty, [q("button", { onClick: n[10] ||= (e) => w.value = "" }, "Close task details"), q("p", null, L(z(T) ? "Task details are unavailable. Refresh or select another task." : "Loading task…"), 1)])) : Y("v-if", !0)], 2)
		], 64)) : (W(), G("div", kv, [q("p", null, L(z(t).enabled.value ? "Hermes Kanban is unavailable. Your chats remain available." : "Enable Kanban Viewer in global Settings to view boards."), 1), q("button", {
			disabled: z(t).checking.value,
			onClick: n[0] ||= (e) => z(t).check()
		}, " Recheck availability ", 8, Av)]))], 512));
	}
}), ry = [
	"role",
	"aria-checked",
	"disabled",
	"onClick"
], iy = /* @__PURE__ */ V({
	__name: "KanbanActions",
	setup(e) {
		let t = Yc();
		return (e, n) => z(t).visible.value ? (W(!0), G(U, { key: 0 }, H(z(t).screenActions.value, (e) => (W(), G("button", {
			key: e.label,
			role: e.checked === void 0 ? "menuitem" : "menuitemcheckbox",
			"aria-checked": e.checked,
			disabled: e.disabled,
			onClick: (t) => e.run()
		}, L(e.label), 9, ry))), 128)) : Y("v-if", !0);
	}
}), ay = /* @__PURE__ */ V({
	__name: "InboxActions",
	setup(e) {
		let { refreshInbox: t, inboxRevision: n } = Eg();
		return (e, r) => (W(), G("button", {
			role: "menuitem",
			class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
			"data-test": "refresh-inbox",
			"aria-label": "Refresh inbox",
			onClick: r[0] ||= (e) => {
				z(t)(), n.value++;
			}
		}, " Refresh inbox "));
	}
}), oy = { id: "project-confirmation-text" }, sy = {
	key: 0,
	role: "alert",
	class: "project-error"
}, cy = { class: "project-actions" }, ly = ["disabled"], uy = ["disabled"], dy = /* @__PURE__ */ V({
	__name: "ProjectConfirmation",
	setup(e) {
		let { projectConfirmation: t, selectedProject: n, projectBusy: r, offline: i, manageError: a, manageProject: o, projectId: s } = Fg(), c = /* @__PURE__ */ R();
		Ln(t, async () => {
			await yn(), c.value?.focus();
		});
		function l() {
			t.value = void 0, document.querySelector("[aria-label=\"Screen options\"]")?.focus();
		}
		async function u() {
			let e = t.value;
			e && (await o(e, { id: s.value }), a.value || (t.value = void 0));
		}
		return (e, o) => z(t) && z(n) ? (W(), G("div", {
			key: 0,
			class: "project-confirmation mx-6",
			role: "alertdialog",
			"aria-labelledby": "project-confirmation-text",
			onKeydown: o[0] ||= Ao(Oo((e) => !z(r) && l(), ["stop", "prevent"]), ["esc"])
		}, [
			q("p", oy, L(z(t) === "delete" ? `Delete ${z(n).label}? This permanently removes the project and its folder associations. Files and chats will be kept.` : `Archive ${z(n).label}? You can restore it from Archived projects.`), 1),
			z(a) ? (W(), G("p", sy, L(z(a)), 1)) : Y("v-if", !0),
			q("div", cy, [q("button", {
				ref_key: "projectConfirmCancel",
				ref: c,
				class: "project-button",
				disabled: z(r),
				onClick: l
			}, " Cancel", 8, ly), q("button", {
				class: "project-button project-danger",
				disabled: z(r) || z(i),
				onClick: u
			}, L(z(t) === "delete" ? "Delete project permanently" : "Confirm archive"), 9, uy)])
		], 32)) : Y("v-if", !0);
	}
}), fy = ["aria-label"], py = { class: "mx-auto max-w-3xl" }, my = {
	key: 0,
	class: "mb-3 px-2 text-sm text-[#b4b4b4]"
}, hy = {
	key: 1,
	class: "mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm"
}, gy = { class: "flex items-center gap-2" }, _y = { value: "profile" }, vy = {
	key: 2,
	role: "alert",
	class: "mb-4 text-red-200"
}, yy = {
	key: 3,
	role: "status",
	class: "text-[#b4b4b4]"
}, by = {
	key: 4,
	class: "text-[#b4b4b4]"
}, xy = { class: "divide-y divide-[#363636]" }, Sy = ["data-session"], Cy = ["disabled", "onClick"], wy = { class: "min-w-0 truncate font-medium" }, Ty = { class: "line-clamp-1 break-words text-sm text-[#b4b4b4]" }, Ey = { class: "flex items-center gap-2 text-xs text-[#777]" }, Dy = ["datetime"], Oy = [
	"aria-label",
	"disabled",
	"onClick"
], ky = ["disabled"], Ay = /* @__PURE__ */ V({
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
		}), a = /* @__PURE__ */ R([]), o = /* @__PURE__ */ R(null), s = /* @__PURE__ */ R(!1), c = /* @__PURE__ */ R(), l = /* @__PURE__ */ R(), u = /* @__PURE__ */ R(""), d;
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
		return Ln(() => [
			n.profile,
			n.revision,
			i.value,
			n.preview
		], () => void f(), { immediate: !0 }), dr(() => d?.abort()), (t, n) => (W(), G("section", {
			"data-drawer-swipe": "",
			"aria-label": e.preview ? "Recent inbox messages" : "Inbox",
			class: "min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
		}, [q("div", py, [
			e.preview ? (W(), G("h2", my, "Recent messages")) : (W(), G("div", hy, [q("label", gy, [n[3] ||= J("View ", -1), B(q("select", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Inbox view",
				class: "rounded-lg bg-[#303030] px-2 py-1 text-base"
			}, [n[2] ||= q("option", { value: "all" }, "All profiles", -1), q("option", _y, "Profile: " + L(e.profile || "default"), 1)], 512), [[xo, i.value]])])])),
			u.value ? (W(), G("p", vy, L(u.value), 1)) : Y("v-if", !0),
			s.value && !a.value.length ? (W(), G("p", yy, "Loading inbox…")) : a.value.length ? Y("v-if", !0) : (W(), G("p", by, "No unread notifications.")),
			q("ol", xy, [(W(!0), G(U, null, H(a.value, (e) => (W(), G("li", {
				key: e.id,
				"data-session": e.session,
				class: "flex items-center gap-1"
			}, [q("button", {
				"data-drawer-swipe": "",
				class: "inbox-open grid min-w-0 flex-1 gap-1 rounded-lg px-2 py-2 text-left hover:bg-[#292929]",
				disabled: !!c.value || !!l.value,
				onClick: (t) => p(e)
			}, [
				q("p", wy, L(e.title || "Untitled chat"), 1),
				q("p", Ty, L(e.preview), 1),
				q("div", Ey, [q("span", null, L(e.profile), 1), q("time", { datetime: (/* @__PURE__ */ new Date(e.occurred * 1e3)).toISOString() }, L((/* @__PURE__ */ new Date(e.occurred * 1e3)).toLocaleString()), 9, Dy)])
			], 8, Cy), q("button", {
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
			}), q("path", { d: "m8 12 3 3 5-6" })], -1)]], 8, Oy)], 8, Sy))), 128))]),
			o.value ? (W(), G("button", {
				key: 5,
				class: "my-5 min-h-11 rounded-full border border-[#555] px-5",
				disabled: s.value,
				onClick: n[1] ||= (e) => f(!0)
			}, " Load More ", 8, ky)) : Y("v-if", !0)
		])], 8, fy));
	}
}), jy = /* @__PURE__ */ V({
	__name: "HomePage",
	setup(e) {
		let { profile: t, inboxRevision: n, openInboxItem: r, refreshInbox: i } = Eg();
		return (e, a) => (W(), K(Ay, {
			preview: "",
			scope: "all",
			profile: z(t),
			revision: z(n),
			"open-item": z(r),
			onRefresh: z(i)
		}, null, 8, [
			"profile",
			"revision",
			"open-item",
			"onRefresh"
		]));
	}
}), My = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fff}.st1{fill:%23bababa}%3c/style%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st1'%20d='M0%2094V2C0%20.9.9%200%202%200h48c.6%200%201.1.2%201.5.7l20%2022.3c.3.4.5.8.5%201.3V94c0%201.1-.9%202-2%202H2c-1.1%200-2-.9-2-2zm68-68.9L49.1%204H4v88h64V25.1z'/%3e%3cpath%20class='st1'%20d='M48%2026V4c0-1.1.9-2%202-2s2%20.9%202%202v20h16c1.1%200%202%20.9%202%202s-.9%202-2%202H50c-1.1%200-2-.9-2-2z'/%3e%3c/svg%3e", Ny = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2372a536}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2s1.2%204.4%203.2%204.4c1%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm10.7%200c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201L36%2010.1c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.5-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%2372a536'%20stroke='%2372a536'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Py = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm8.7-10.3H32l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3L36%206.4h3.5l-3.9%2014.3h-3.3L28.4%206.4z'%20fill='%23fff'/%3e%3cpath%20d='M14%2054h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58'%20fill='none'%20stroke='%231f7244'%20stroke-width='3'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Fy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2H6.6V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zM24.1%206.1c3.8%200%205.9%203.1%205.9%207.3%200%204.2-2.1%207.5-5.9%207.5s-5.8-3.2-5.8-7.5c0-4.1%202.1-7.3%205.8-7.3zm0%2011.7c1.7%200%202.5-1.8%202.5-4.3s-.8-4.2-2.5-4.2-2.5%201.7-2.5%204.2.8%204.3%202.5%204.3zM38%206.1c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Iy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.4-34.6h3.3c2.9%200%204.7%202.6%204.7%207.1s-1.8%207.2-4.7%207.2H6.4V6.4zm3.3%2011.4c1.3%200%202.1-1.5%202.1-4.3S11%209.3%209.7%209.3H9v8.5h.7zM20%206.1c3%200%204.7%203.1%204.7%207.3%200%204.2-1.7%207.5-4.7%207.5s-4.7-3.2-4.7-7.5c0-4.1%201.7-7.3%204.7-7.3zm0%2011.7c1.4%200%202-1.8%202-4.3s-.6-4.2-2-4.2-2%201.7-2%204.2.6%204.3%202%204.3zM30.7%206.1c1%200%202.1.4%202.9%201.2l-1.1%202.8c-.3-.5-1-.9-1.7-.9-1.7%200-2.6%201.9-2.6%204.2%200%202.3.9%204.4%202.5%204.4.8%200%201.3-.5%201.8-1l1.1%202.8c-.7.7-1.6%201.3-3.2%201.3-3.2%200-5-3.1-5-7.4.1-4.2%202-7.4%205.3-7.4zm5.9%207.5l-2.8-7.2h2.9l.9%202.9c.3.9.4%201.8.4%201.8s.2-.9.5-1.8l.9-2.9h2.9l-2.8%207.2%202.7%207.1h-2.8l-.9-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.4%201.7l-.9%203h-2.8l2.7-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Ly = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.4-34.9c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.1-4.5%202.6-7.6%206.5-7.6zm7.2%2012.4l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1h4.3v2.9h-8.9v-2.2z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", Ry = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23d75b26}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h2.8v5.8H12V6.4h2.8v14.3H12V15H9.2v5.7H6.5V6.4zm12%202.9h-2.7V6.4h8.1v2.9h-2.7v11.4h-2.8V9.3zm6.9-2.9h3.1l1.1%206c.2.9.4%202.4.4%202.4s.2-1.5.4-2.4l1.1-6h3.1l.8%2014.3h-2.6l-.3-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.7%204.1h-2.7l-.7-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.3%206.4h-2.6l.9-14.3zm11.5%200h2.8v11.4h3.7v2.9H37V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2075c-.5%200-1.1-.2-1.5-.6L13.6%2066c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-7%206.9%206.9%206.9c.8.8.8%202.1%200%203-.4.4-.9.6-1.4.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2074.3c-.4.5-.9.7-1.5.7zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3%201.1.4%201.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23d75b26'%20stroke='%23d75b26'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", zy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23307ac6}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm-.3-25.7H9v1.1c0%201.5.4%201.6.7%201.6.5%200%20.7-.3.7-1.6v-7H7.7v-3h6v9.9c0%203.3-2%204.6-4%204.6-2.1%200-4-1.4-4-4.6v-1zM18%2016.7c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%23307ac6'%20stroke='%23307ac6'%20stroke-miterlimit='10'/%3e%3c/svg%3e", By = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}.st1{fill:%23fff}.st2{fill:%23999;stroke:%23999;stroke-width:.5;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st1'%20d='M6%2041h60v49H6V41z'/%3e%3cpath%20class='st2'%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4.4-.2.8-.6%201.2-1%20.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2-.6-.6-1-1.2-1.2-2-.2-.8-.3-2.1-.3-4%200-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202c.2.8.4%202.1.4%204%200%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'/%3e%3cpath%20class='st1'%20d='M5.8%2015.7H8v.9c0%201.9.6%202.1%201.1%202.1.6%200%201.1-.4%201.1-2.1V8.7H7.8V6.5h4.6v10c0%203.2-1.6%204.4-3.3%204.4s-3.3-1.2-3.3-4.4v-.8zm9%201.8c.6.7%201.4%201.2%202.2%201.2%201%200%201.6-.7%201.6-1.8%200-2.6-4.5-2.5-4.5-6.6%200-2.3%201.4-4%203.8-4%201%200%202%20.3%202.8.9L20%209.4c-.5-.4-1.3-.8-2-.8-1.1%200-1.6.8-1.6%201.7%200%202.6%204.5%202.4%204.5%206.5%200%202.2-1.3%204.1-3.7%204.1-1.2%200-2.4-.5-3.3-1.4l.9-2zM27.1%206.2c3.2%200%205.1%203%205.1%207.3s-2%207.4-5.1%207.4c-3.2%200-5.1-3.1-5.1-7.4%200-4.2%202-7.3%205.1-7.3zm0%2012.4c1.8%200%202.9-2%202.9-5.1%200-3-1.1-4.9-2.9-4.9s-2.9%201.9-2.9%204.9c0%203.1%201.1%205.1%202.9%205.1zM34%206.5h2.3l3.3%208c.3.9.6%202.2.6%202.2h.1s-.1-1.3-.1-2.2v-8h2.1v14.2H40l-3.3-8.1c-.3-.9-.6-2.2-.6-2.2H36s.1%201.3.1%202.2v8H34V6.5z'/%3e%3cpath%20class='st2'%20d='M44.1%2067.1c-.7-.3-1.2-.9-1.2-1.6s.5-1.4%201.2-1.6c.3-.1.4-.3.3-.5-.3-.8-.5-1.6-1-2.2-.1-.3-.4-.3-.6-.2s-.5.3-.8.3c-1%200-1.7-.8-1.7-1.7%200-.3.1-.6.3-.8.1-.3%200-.4-.2-.6-.7-.4-1.5-.7-2.2-1-.3-.1-.4.1-.5.3-.3.7-.9%201.2-1.6%201.2s-1.4-.5-1.6-1.2c-.1-.3-.3-.4-.5-.3-.8.3-1.6.5-2.2%201-.3.1-.3.4-.2.6.2.3.3.5.3.8%200%201-.8%201.7-1.7%201.7-.3%200-.6-.1-.8-.3-.3-.1-.4%200-.6.2-.4.7-.7%201.5-1%202.2-.1.3.1.4.3.5.7.3%201.2.9%201.2%201.6s-.5%201.4-1.2%201.6c-.3.1-.4.3-.3.5.3.8.5%201.6%201%202.2.1.3.4.3.6.2.3-.2.5-.3.8-.3%201%200%201.7.8%201.7%201.7%200%20.3-.1.6-.3.8-.1.3%200%20.4.2.6.7.4%201.5.7%202.2%201%20.2%200%20.4-.1.4-.3.3-.7.9-1.2%201.6-1.2s1.4.5%201.6%201.2c.1.3.3.4.5.3.8-.3%201.6-.5%202.2-1%20.3-.1.3-.4.2-.6-.1-.3-.3-.5-.3-.8%200-1%20.8-1.7%201.7-1.7.3%200%20.6.1.8.3.3.1.4%200%20.6-.2.4-.7.7-1.5%201-2.2.2-.1.1-.4-.2-.5zm-8.3%201c-1.5%200-2.7-1.2-2.7-2.7%200-1.5%201.2-2.7%202.7-2.7s2.7%201.2%202.7%202.7c.1%201.5-1.2%202.7-2.7%202.7z'/%3e%3c/svg%3e", Vy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm14.6%200h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2H25v8.5h.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13.5%2076.4V54.6h6.4l6.4%208%206.4-8h6.4v21.8h-6.4V63.9l-6.4%208-6.4-8v12.5h-6.4zm38.4%200l-9.6-10.6h6.4V54.6h6.4v11.2h6.4l-9.6%2010.6z'/%3e%3c/svg%3e", Hy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm8.7%203.6c.4.4%201.1.7%201.7.7.9%200%201.6-.4%201.6-1.6%200-1-.7-1.5-2.3-1.5h-.9l-.7-1.8%202-2.5c.5-.6.9-1%20.9-1s-.4.1-1.1.1h-2.3v-3h7.2V9l-2.6%203.1c2%20.5%203.1%202.1%203.1%204.1%200%202.4-1.4%204.8-4.7%204.8-1.3%200-2.5-.4-3.5-1.3l1.6-2.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", Uy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23f60}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm6.8%201.8l3.7-8.8h4.2v8.1H42v3h-1.2v3.2h-3.2v-3.2h-4.7v-2.3zm4.7-.7v-3.4c0-.8.1-1.3.1-1.3s-.1.6-.3%201.2L36%2014.5h1.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13%2083.1h46V47.9H13v35.2zm8.9-2.7h-5.5v-3.9h5.5v3.9zm16.9%200h-5.5v-3.9h5.5v3.9zm11.3-30.1h5.5v4h-5.5v-4zm0%2026.1h5.5v3.9h-5.5v-3.9zm-8.5-26.1H47v3.9h-5.5v-3.9zm0%2026.1H47v3.9h-5.5l.1-3.9zm-8.4-26.1h5.5v3.9h-5.5v-3.9zm-.8%209.7l7.2%204.1c1.3.8%201.3%202%200%202.8L32.4%2071c-1.3.8-2.4.1-2.4-1.4v-8.3c0-1.4%201.1-2.1%202.4-1.3zm-7.7-9.7h5.4v3.9h-5.4v-3.9zm0%2026.1h5.4v3.9h-5.4v-3.9zm-8.3-26.1h5.5v4h-5.5v-4z'/%3e%3c/svg%3e", Wy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23c11e07}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zm9.1-11.4h7.1v2.9h-3.8v3.1H38v2.9h-3.1v5.4h-3.3V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M33.5%2046.538c-2.3%200-4.1%201.9-4.1%204.1%200%202.8%201.6%206.3%203.2%209.6-1.3%204-2.7%208.3-4.6%2011.9-3.8%201.5-7.2%202.6-9.2%204.3l-.1.1c-.7.8-1.2%201.8-1.2%202.9%200%202.3%201.9%204.1%204.1%204.1%201.1%200%202.2-.4%202.9-1.2%200%200%20.1%200%20.1-.1%201.5-1.8%203.3-5.1%204.9-8%203.6-1.4%207.5-2.9%2011.1-3.8%202.7%202.2%206.6%203.6%209.8%203.6%202.3%200%204.1-1.9%204.1-4.1%200-2.3-1.9-4.1-4.1-4.1-2.6%200-6.3.9-9.1%201.9-2.3-2.2-4.4-4.9-6-7.8%201.1-3.4%202.4-6.7%202.4-9.3-.1-2.3-1.9-4.1-4.2-4.1zm0%202.4c.9%200%201.6.7%201.6%201.6%200%201.2-.7%203.5-1.4%205.9-1-2.4-1.9-4.7-1.9-5.9.1-.8.8-1.6%201.7-1.6zm.7%2014.1c1.2%202%202.7%203.8%204.3%205.4-2.4.7-4.8%201.5-7.2%202.4%201.2-2.5%202.1-5.2%202.9-7.8zm16.2%205.3c.9%200%201.6.7%201.6%201.6%200%20.9-.7%201.6-1.6%201.6-1.9%200-4.5-.8-6.6-2%202.4-.6%205.1-1.2%206.6-1.2zm-24.5%207.3c-1.2%202.1-2.3%204-3.1%205-.3.3-.6.4-1.1.4-.9%200-1.6-.7-1.6-1.6%200-.4.2-.9.4-1.1.9-.8%203-1.7%205.4-2.7z'%20fill='%23c11e07'%20stroke='%23c11e07'%20stroke-width='.75'%20stroke-miterlimit='10'/%3e%3c/svg%3e", Gy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm10-4.1h-3.1V6.4h9.6v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", Ky = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205H9.5v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zm5.7-7h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205h-1.1v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zM27%209.3h-2.8V6.4h8.6v2.9H30v11.4h-3V9.3zm9%204.3l-3.1-7.2h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.1-.9-.3-1.7-.3-1.7s-.2.8-.5%201.7l-1%203H33l3-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", qy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9s-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm10%201.4l-3.6-8.4h3.6l1.1%203.4c.3%201%20.5%202.1.5%202.1h.1s.2-1.1.5-2.1l1.1-3.4h3.6l-3.6%208.4v5.9h-3.3v-5.9z'%20fill='%23fff'/%3e%3cpath%20d='M34.5%2083.4c-4.4-.1-7.2-1.5-7.9-3.8l-.1-.3v-4.5c0-5.2%200-5.3.3-6.1.5-1.5%201.7-2.5%203.5-2.9l.4-.1h5.1c3.7%200%205.2%200%205.4-.1%201.1-.2%201.7-.4%202.3-.9.8-.6%201.4-1.6%201.6-2.6.2-.8.2-.7.2-3.5v-2.5h3.6l.4.1c1.9.6%203.3%202.3%203.9%205.1.2%201.1.2%201.1.2%203.8%200%202.6%200%202.6-.2%203.5-.2.8-.4%201.6-.8%202.3-.7%201.4-1.8%202.4-3.1%202.8-.8.3-.1.2-7.5.3h-6.7v1.2h8.8v4.6c-.1.3-.1.6-.4%201s-.8.9-1.1%201.2c-1.2.8-3%201.3-5.4%201.4h-2.5zm6.1-2.8c.8-.1%201.5-1%201.3-1.8-.1-.7-.6-1.2-1.3-1.3-1.1-.1-2%20.8-1.8%201.8.1.8.8%201.3%201.6%201.3h.2zm-19-6.5c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%23fed142'/%3e%3cpath%20d='M21.6%2074.1c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%233571a3'/%3e%3c/svg%3e", Jy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fea500}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm1.3-24.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8zM16%206.4h3.6l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.7-8.1h3.5l-3.9%2014.3h-3.3L16%206.4zm19.1-.3c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.2-4.5%202.6-7.6%206.5-7.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M27.1%2060.2L18%2079.4l1.7%201.7L31%2069.8c-.4-.9-.3-2%20.5-2.8%201-1%202.5-1%203.5%200s1%202.5%200%203.5c-.7.7-1.9.9-2.8.5L20.9%2082.3l1.7%201.7%2019.2-9.1L46%2063.4%2038.6%2056l-11.5%204.2zm26.3-2.3L44%2048.5c-.8-.8-2-.8-2.8%200L39%2050.7c-.8.8-.8%202%200%202.8l9.4%209.4c.8.8%202%20.8%202.8%200l2.2-2.2c.8-.8.8-2%200-2.8z'/%3e%3c/svg%3e", Yy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234d1b9b}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm10.5-2.9H23l3.6%2014.3h-3.3l-.6-3h-3l-.6%203h-3.3l3.6-14.3zm2.8%208.6l-.6-2.8c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.8h2zm6.9-8.6h4.5c.6%200%201.3.1%201.9.4%201.4.6%202.4%202.1%202.4%204%200%201.7-.8%203.3-2%204%200%200%20.2.2.5.9l2.3%205h-3.6l-2-4.8h-.8v4.8H29V6.4zM33%2013c.9%200%201.6-.7%201.6-1.9%200-.7-.2-1.2-.6-1.5-.3-.2-.6-.3-.9-.3h-.7V13h.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M43.6%2068.3l-7.3-3.4L51%2058l7.3%203.4-7.3%203.5-7.4%203.4zM51%2051.2l-7.3-3.4-7.3%203.4L51%2058.1l7.3-3.4-7.3-3.5zM28.9%2061.4L21.6%2058l-7.3%203.4L29%2068.3l7.3-3.4-7.4-3.5zm0-6.8l7.3-3.4-7.3-3.4-14.7%206.9%207.3%203.4%207.4-3.5zM51%2066.9l-6.6%203-.8.4-.8-.4-6.6-3-6.6%203-.8.4-.8-.4-6.6-3v10.7l14.7%207.7L51%2077.6V66.9z'/%3e%3c/svg%3e", Xy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234065aa}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm9.9%207.4c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M37.9%2055.1v-7.6H33c-.1.3-.2.6-.2%201-.1.2-.1.3-.1.5-.5%202.8-2%204.8-4.5%205.9-.7.3-1.4.4-2.1.3v6.1h3.6c.1%208.6.1%2013.1.1%2013.3v.5c.5%203.8%202.4%206%205.9%206.9%201.4.4%202.9.6%204.5.6%202-.1%203.9-.4%205.8-1v-7.2c-1.1.3-2.1.6-3%20.9-1.7.5-3.2.2-4.4-1-.1-.2-.3-.4-.3-.6-.2-.9-.3-1.9-.3-2.8v-9.6h7.8v-6.1h-7.9v-.1z'/%3e%3c/svg%3e", Zy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm11.5%204.3L17%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1H24l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203h-3.5l3.3-7.1zm12.1-4.3h-3.1V6.4H39v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14.6%2077.2h42.8v6.2H14.6zm0-14.8h42.8v6.2H14.6zm0-15h42.8v6.2H14.6z'/%3e%3c/svg%3e", Qy = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM5.6%206.4h3.1l1.1%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.2-8.9h2.9l1.2%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.1-8.9h3.1l-2.4%2014.3H14l-1.1-7.2c-.1-.9-.2-1.7-.2-1.7h-.1s0%20.8-.1%201.7l-1%207.2H8L5.6%206.4zm18.3%200h3.4l3.4%2014.3h-3.1l-.6-3h-2.9l-.6%203h-3.1l3.5-14.3zm2.6%208.6l-.5-2.9c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.9h1.9zm4.3-8.6h3.4l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.6-8.1h3.3l-3.7%2014.3h-3.2L30.8%206.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", $y = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm9.8-7.2h3.3v11.4h4.3v2.9h-7.6V6.4zm11%2010.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.3-.5-1.3-.9-2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", eb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.6-27.4L5.5%206.4h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9H15l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203H5.6l3-7.1zm8-7.2h3v11.4h3.9v2.9h-6.8V6.4zm9%2010.3c.5.6%201.3%201.2%202.1%201.2s1.2-.6%201.2-1.2c0-2-4.3-2.1-4.3-6.2%200-2.4%201.5-4.3%204.1-4.3%201.1%200%202.2.3%203.1%201l-1.1%202.9c-.4-.4-1.3-.9-1.9-.9-.8%200-1.2.6-1.2%201.2%200%202.1%204.3%202%204.3%206.1%200%202.3-1.3%204.4-4%204.4-1.3%200-2.6-.5-3.6-1.4l1.3-2.8zm10.2-3.1l-3.1-7.2H36l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203h-3.2l3.1-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", tb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm10.3-7.2H23l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6h3.6l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H23l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l1.1-14.3zm15.1%200h3.3v11.4H42v2.9h-7.6V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2076c-.5%200-1.1-.2-1.5-.6L13.6%2067c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-6.9%206.9%206.9%206.9c.8.8.8%202.1%200%203-.5.4-1%20.6-1.5.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2075.4c-.4.4-.9.6-1.5.6zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3s1.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23666'%20stroke='%23666'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", nb = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.9-26.2L5.5%206.5H8l1.5%204.2c.3.9.5%201.9.5%201.9s.2-1%20.5-1.9L12%206.5h2.5l-3.4%208.3v5.9H8.9v-5.9zm8.4-8.3h2.5l3.5%2014.2H21l-.9-3.7h-3.2l-.8%203.7h-2.3l3.5-14.2zm2.4%208.5l-.8-3.8c-.2-.8-.4-2.2-.4-2.2h-.1s-.2%201.4-.4%202.2l-.8%203.8h2.5zm5.2-8.5h2.5l1.8%206.9c.2.9.4%202.2.4%202.2h.1s.2-1.3.4-2.2l1.8-6.9h2.5l.8%2014.2h-2.1l-.4-7.9c-.1-.9%200-2.2%200-2.2h-.1s-.2%201.4-.4%202.3l-1.4%205.4h-2.2l-1.4-5.4c-.2-.8-.4-2.3-.4-2.3h-.1s.1%201.3%200%202.2l-.4%207.9h-2.1l.7-14.2zm12.3%200h2.3v12h4.3v2.2h-6.5V6.5z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14%2048.9h37v4.3H14zm7%209.6h37v4.3H21zm-7%209.6h37v4.3H14zm7%209.6h37V82H21z'/%3e%3c/svg%3e", rb = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm0-22.5l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1H15v2.9H6v-2.2zM18.1%206.4h3.3v14.3h-3.3V6.4zm7%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", ib = { class: "artifact-card my-2 w-full max-w-md overflow-hidden rounded-2xl border border-[#424242] bg-[#292929]" }, ab = ["aria-label"], ob = ["src", "alt"], sb = { class: "flex min-w-0 items-center gap-3 p-3" }, cb = ["src"], lb = { class: "min-w-0 flex-1" }, ub = ["aria-label"], db = {
	key: 1,
	class: "block truncate text-sm font-medium"
}, fb = { class: "block text-xs text-[#b4b4b4]" }, pb = [
	"href",
	"download",
	"aria-label"
], mb = { class: "mb-4 flex items-center gap-3" }, hb = { class: "min-w-0 flex-1 break-words" }, gb = ["href", "download"], _b = {
	key: 0,
	role: "status"
}, vb = {
	key: 1,
	role: "alert",
	class: "text-red-200"
}, yb = {
	key: 2,
	class: "max-h-[70dvh] overflow-auto whitespace-pre-wrap break-words text-sm"
}, bb = ["src", "alt"], xb = ["src", "title"], Sb = ["src"], Cb = ["src"], wb = /* @__PURE__ */ V({
	__name: "ArtifactCard",
	props: {
		file: {},
		profile: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* #__PURE__ */ Object.assign({
			"../../../assets/file-icons/blank.svg": My,
			"../../../assets/file-icons/css.svg": Ny,
			"../../../assets/file-icons/csv.svg": Py,
			"../../../assets/file-icons/doc.svg": Fy,
			"../../../assets/file-icons/docx.svg": Iy,
			"../../../assets/file-icons/gz.svg": Ly,
			"../../../assets/file-icons/html.svg": Ry,
			"../../../assets/file-icons/js.svg": zy,
			"../../../assets/file-icons/json.svg": By,
			"../../../assets/file-icons/md.svg": Vy,
			"../../../assets/file-icons/mp3.svg": Hy,
			"../../../assets/file-icons/mp4.svg": Uy,
			"../../../assets/file-icons/pdf.svg": Wy,
			"../../../assets/file-icons/ppt.svg": Gy,
			"../../../assets/file-icons/pptx.svg": Ky,
			"../../../assets/file-icons/py.svg": qy,
			"../../../assets/file-icons/svg.svg": Jy,
			"../../../assets/file-icons/tar.svg": Yy,
			"../../../assets/file-icons/ts.svg": Xy,
			"../../../assets/file-icons/txt.svg": Zy,
			"../../../assets/file-icons/wav.svg": Qy,
			"../../../assets/file-icons/xls.svg": $y,
			"../../../assets/file-icons/xlsx.svg": eb,
			"../../../assets/file-icons/xml.svg": tb,
			"../../../assets/file-icons/yaml.svg": nb,
			"../../../assets/file-icons/zip.svg": rb
		}), a = X(() => i[`../../../assets/file-icons/${em(n.file.name)}.svg`] || i["../../../assets/file-icons/blank.svg"]), o = X(() => nm(n.file)), s = /* @__PURE__ */ R(), c = /* @__PURE__ */ R(""), l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R(""), d = /* @__PURE__ */ R(!1), f = /* @__PURE__ */ R(!1), p;
		function m() {
			p?.abort(), c.value.startsWith("blob:") && URL.revokeObjectURL(c.value), c.value = "", l.value = "";
		}
		dr(m);
		async function h() {
			m(), u.value = "", s.value?.showModal(), d.value = !0;
			let e = p = new AbortController();
			try {
				let t = rm(n.file, n.profile);
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
		let g = /* @__PURE__ */ R("");
		return Ln([
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
			let a = rm(n.file, n.profile);
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
		}, { immediate: !0 }), (t, n) => (W(), G("div", ib, [
			o.value === "image" && g.value && !f.value ? (W(), G("button", {
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
			}, null, 40, ob)], 8, ab)) : Y("v-if", !0),
			q("div", sb, [
				o.value !== "image" || f.value ? (W(), G("img", {
					key: 0,
					src: a.value,
					alt: "",
					class: "size-10 shrink-0"
				}, null, 8, cb)) : Y("v-if", !0),
				q("div", lb, [o.value ? (W(), G("button", {
					key: 0,
					type: "button",
					class: "block w-full truncate text-left text-sm font-medium hover:underline",
					"aria-label": `Preview ${e.file.name}`,
					onClick: h
				}, L(e.file.name), 9, ub)) : (W(), G("span", db, L(e.file.name), 1)), q("span", fb, [J(L(z(em)(e.file.name).toUpperCase() || "FILE"), 1), e.file.size === void 0 ? Y("v-if", !0) : (W(), G(U, { key: 0 }, [J(" · " + L(e.file.size < 1024 ? `${e.file.size} B` : e.file.size < 1048576 ? `${(e.file.size / 1024).toFixed(1)} KB` : `${(e.file.size / 1048576).toFixed(1)} MB`), 1)], 64))])]),
				q("a", {
					href: z(rm)(e.file, e.profile, !0),
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
				}, [q("path", { d: "M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" })], -1)]], 8, pb)
			]),
			yr(t.$slots, "footer"),
			q("dialog", {
				ref_key: "dialog",
				ref: s,
				class: "artifact-preview fixed m-auto max-h-[90dvh] w-[min(900px,94vw)] overflow-auto rounded-2xl border border-[#424242] bg-[#212121] p-4 text-white backdrop:bg-black/80",
				onClose: m,
				onClick: n[3] ||= (e) => e.target === s.value && s.value?.close()
			}, [q("div", mb, [
				q("h2", hb, L(e.file.name), 1),
				q("a", {
					href: z(rm)(e.file, e.profile, !0),
					download: e.file.name,
					class: "text-sm underline"
				}, "Download", 8, gb),
				q("button", {
					type: "button",
					autofocus: "",
					class: "size-10 rounded-full hover:bg-[#424242]",
					"aria-label": "Close preview",
					onClick: n[2] ||= (e) => s.value?.close()
				}, " ✕ ")
			]), d.value ? (W(), G("p", _b, "Loading preview…")) : u.value ? (W(), G("p", vb, L(u.value), 1)) : o.value === "text" ? (W(), G("pre", yb, L(l.value), 1)) : o.value === "image" && c.value ? (W(), G("img", {
				key: 3,
				src: c.value,
				alt: e.file.name,
				class: "max-h-[70dvh] w-full object-contain"
			}, null, 8, bb)) : o.value === "pdf" && c.value ? (W(), G("iframe", {
				key: 4,
				src: c.value,
				title: e.file.name,
				class: "h-[70dvh] w-full bg-white"
			}, null, 8, xb)) : o.value === "video" && c.value ? (W(), G("video", {
				key: 5,
				src: c.value,
				controls: "",
				class: "max-h-[70dvh] w-full"
			}, null, 8, Sb)) : o.value === "audio" && c.value ? (W(), G("audio", {
				key: 6,
				src: c.value,
				controls: "",
				class: "w-full"
			}, null, 8, Cb)) : Y("v-if", !0)], 544)
		]));
	}
}), Tb = new Up({
	html: !1,
	breaks: !0,
	linkify: !0
});
Tb.renderer.rules.link_open = (e, t, n, r, i) => (e[t].attrSet("target", "_blank"), e[t].attrSet("rel", "noopener noreferrer"), i.renderToken(e, t, n));
function Eb(e) {
	return Tb.render(e);
}
//#endregion
//#region src/features/chat/components/UserMessage.vue?vue&type=script&setup=true&lang.ts
var Db = { class: "message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]" }, Ob = ["innerHTML"], kb = /* @__PURE__ */ V({
	__name: "UserMessage",
	props: {
		message: {},
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (W(), G("article", Db, [q("div", {
			class: "message-content markdown-content break-words text-base leading-7",
			innerHTML: z(Eb)(z(lm)(z(Tl)(e.message.content)).text.replace(/\[screenshot\]/g, "📷 Attached image"))
		}, null, 8, Ob), (W(!0), G(U, null, H(z(um)(e.message), (t) => (W(), K(wb, {
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
function Ab(e) {
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
var jb = (e) => [
	"terminal",
	"execute_code",
	"python"
].includes(e.toolName || "");
function Mb(e) {
	try {
		return JSON.parse(e.content) || {};
	} catch {
		return {};
	}
}
function Nb(e) {
	let t = Mb(e), n = t.command ?? t.code;
	return typeof n == "string" && n.trim().split("\n")[0] || "";
}
function Pb(e, t) {
	if (jb(e)) return `${t ? "Running" : e.state === "completed" ? "Ran" : "Command"} ${Nb(e) || "command"}`;
	let n = (e.toolName || "tool").replace(/_/g, " ");
	return /^(used|using) tool$/i.test(e.title) ? `${t ? "Using" : e.state === "completed" ? "Used" : "Tool:"} ${n}` : e.title || n;
}
var Fb = {
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
function Ib(e) {
	let t = e.toolName || "";
	return jb(e) ? "run" : [
		"read_file",
		"list_files",
		"search_files",
		"file_search",
		"search"
	].includes(t) ? "explore" : ["web_search", "session_search_recall"].includes(t) ? "search" : t === "web_extract" ? "read" : t === "browser_navigate" ? "browse" : t.startsWith("browser_") ? "interact" : t === "vision_analyze" ? "analyze" : "other";
}
function Lb(e, t) {
	let n = Mb(e);
	if (t === "run") return Nb(e);
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
function Rb(e, t) {
	let n = t ? e.find((e) => !e.complete) ?? e.at(-1) : void 0, r = n ? Ib(n) : void 0, i = [];
	for (let t of Object.keys(Fb)) {
		let n = e.filter((e) => Ib(e) === t);
		if (!n.length) continue;
		let a = Fb[t], o = t === r, s = n.every((e) => e.state === "completed"), c = n.reduce((e, n) => {
			let r = Mb(n).urls;
			return e + (t === "read" && Array.isArray(r) && r.length ? r.length : 1);
		}, 0), l = c === 1 && (o || t !== "run") ? Lb(n[0], t) : "", u = o ? a.present : s ? a.past : "";
		i.push([u, l || `${c} ${a.nouns[c === 1 ? 0 : 1]}`].filter(Boolean).join(" "));
	}
	let a = e.filter((e) => e.state === "failed").length;
	return a && i.push(`${a} failed`), i.map((e, t) => t ? e.charAt(0).toLowerCase() + e.slice(1) : e).join(", ");
}
//#endregion
//#region src/components/ActivityRow.vue?vue&type=script&setup=true&lang.ts
var zb = ["open"], Bb = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, Vb = {
	key: 1,
	"aria-hidden": "true"
}, Hb = ["title"], Ub = {
	key: 2,
	class: "activity-meta"
}, Wb = {
	key: 3,
	class: "activity-meta"
}, Gb = {
	key: 4,
	class: "activity-meta"
}, Kb = {
	key: 5,
	class: "activity-meta"
}, qb = {
	key: 6,
	class: "activity-meta"
}, Jb = {
	key: 1,
	class: "ml-6 py-1 text-sm",
	role: "status"
}, Yb = /* @__PURE__ */ V({
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
		].includes(r.value || "")), a = /* @__PURE__ */ R(null), o = X(() => a.value ?? !1), s = /* @__PURE__ */ R(), c = /* @__PURE__ */ R(!0);
		function l() {
			let e = s.value;
			e && (c.value = e.scrollHeight - e.scrollTop - e.clientHeight < 24);
		}
		Ln(() => [
			t.activity.content,
			t.activity.output,
			o.value
		], () => {
			let e = s.value;
			e && n.value && o.value && c.value && (e.scrollTop = e.scrollHeight);
		}, { flush: "post" });
		let u = /* @__PURE__ */ R(Date.now()), d;
		Ln(() => n.value && t.activity.startedAt !== void 0, (e) => {
			d && clearInterval(d), e && (d = setInterval(() => {
				u.value = Date.now();
			}, 1e3));
		}, { immediate: !0 }), dr(() => {
			d && clearInterval(d);
		});
		let f = X(() => t.activity.duration ?? (n.value && t.activity.startedAt !== void 0 ? Math.max(0, (u.value - t.activity.startedAt) / 1e3) : void 0)), p = X(() => t.activity.kind === "thinking" ? n.value ? "Thinking…" : "Thought" : Pb(t.activity, n.value));
		function m(e) {
			let t = e.target.open;
			t !== o.value && (a.value = t);
		}
		return (t, c) => (W(), G("details", {
			class: de(["activity", {
				"activity-failed": i.value,
				"activity-active": n.value,
				"activity-thinking": e.activity.kind === "thinking"
			}]),
			open: o.value,
			onToggle: m
		}, [q("summary", { onClick: c[0] ||= Oo((e) => a.value = !o.value, ["prevent"]) }, [
			z(jb)(e.activity) ? (W(), G("span", Bb, "›_")) : Y("v-if", !0),
			i.value ? (W(), G("span", Vb, "!")) : Y("v-if", !0),
			q("span", {
				class: de(["activity-label", { "working-shimmer": n.value }]),
				title: p.value
			}, L(p.value), 11, Hb),
			r.value === "failed" ? (W(), G("span", Ub, " · Failed")) : r.value === "interrupted" ? (W(), G("span", Wb, " · Interrupted")) : r.value === "unknown" ? (W(), G("span", Gb, " · Result unavailable")) : n.value && e.activity.kind === "tool" ? (W(), G("span", Kb, " · " + L(r.value === "pending" ? "Waiting…" : "Running…"), 1)) : Y("v-if", !0),
			f.value === void 0 ? Y("v-if", !0) : (W(), G("span", qb, " · " + L(f.value.toFixed(1)) + "s", 1)),
			q("span", {
				class: de(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2)
		]), e.activity.content || e.activity.output || e.activity.toolName ? (W(), G("pre", {
			key: 0,
			ref_key: "preview",
			ref: s,
			onScroll: l
		}, L([
			e.activity.toolName,
			e.activity.content,
			e.activity.output
		].filter(Boolean).join("\n\n")), 545)) : n.value ? (W(), G("p", Jb, "Working…")) : Y("v-if", !0)], 42, zb));
	}
}), Xb = {
	class: "turn-work",
	"aria-label": "Assistant activity"
}, Zb = ["aria-expanded", "aria-controls"], Qb = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, $b = ["title"], ex = {
	key: 1,
	class: "sr-only",
	role: "status"
}, tx = ["id"], nx = /* @__PURE__ */ V({
	__name: "TurnWork",
	props: {
		activities: {},
		working: { type: Boolean },
		approvalPending: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(null), r = qn(), i = (e) => !e.complete && (t.working || !!e.delegated), a = X(() => t.activities.filter((e) => !i(e))), o = X(() => n.value ?? !1), s = X(() => t.approvalPending ? "Waiting for approval" : t.activities.length && [
			a.value.some((e) => e.kind === "thinking") ? "Thought" : "",
			Rb(a.value.filter((e) => e.kind === "tool"), !1),
			...["interrupted", "unknown"].flatMap((e) => {
				let t = a.value.filter((t) => e === "unknown" ? t.state === e || !t.complete : t.state === e && t.complete).length;
				return t ? [`${t} ${e === "unknown" ? "results unavailable" : e}`] : [];
			})
		].filter(Boolean).join(", ") || "Working…");
		return (t, a) => (W(), G("section", Xb, [q("button", {
			type: "button",
			class: "work-summary",
			"aria-expanded": o.value,
			"aria-controls": z(r),
			onClick: a[0] ||= (e) => n.value = !o.value
		}, [
			e.activities.some(z(jb)) ? (W(), G("span", Qb, "›_")) : Y("v-if", !0),
			q("span", {
				class: de(["activity-label", { "working-shimmer": e.working && !e.activities.length && !e.approvalPending }]),
				title: s.value
			}, L(s.value), 11, $b),
			q("span", {
				class: de(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2),
			e.approvalPending ? (W(), G("span", ex, "Waiting for approval")) : Y("v-if", !0)
		], 8, Zb), q("div", {
			id: z(r),
			class: "work-timeline"
		}, [(W(!0), G(U, null, H(e.activities, (n) => (W(), G(U, { key: n.id }, [B(q("div", { class: de({ "current-activity": i(n) }) }, [qi(Yb, {
			activity: n,
			"turn-complete": !e.working
		}, null, 8, ["activity", "turn-complete"])], 2), [[Ia, o.value || i(n)]]), yr(t.$slots, "result", { activity: n })], 64))), 128))], 8, tx)]));
	}
}), rx = { class: "message assistant w-full self-start" }, ix = ["innerHTML"], ax = /* @__PURE__ */ V({
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
		let n = e, r = X(() => sm(n.block.content)), i = X(() => {
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
		return (t, n) => (W(), G("article", rx, [
			q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: z(Eb)(r.value.text)
			}, null, 8, ix),
			(W(!0), G(U, null, H(i.value, (t) => (W(), K(wb, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[0] ||= (e) => a("imageLoad")
			}, null, 8, ["file", "profile"]))), 128)),
			(W(!0), G(U, null, H(e.block.images, (t) => (W(), K(wb, {
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
}), ox = { class: "assistant-turn grid min-w-0 gap-1" }, sx = {
	key: 1,
	class: "response-actions flex items-center gap-1 text-[#a3a3a3]"
}, cx = ["disabled"], lx = {
	role: "status",
	class: "text-xs"
}, ux = /* @__PURE__ */ V({
	__name: "AssistantTurn",
	props: {
		entry: {},
		branchDisabled: { type: Boolean },
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad", "branch"],
	setup(e, { emit: t }) {
		let n = e, r = /* @__PURE__ */ R({}), i = X(() => {
			let e = /* @__PURE__ */ new Map(), t = !1;
			for (let r of n.entry.blocks) if (r.kind === "text") for (let n of sm(r.content).files) t ||= !!n.automatic, e.set(n.path, n);
			return t ? [...e.values()].filter((e) => om(e.path, !0)) : [];
		}), a = "";
		Ln(() => JSON.stringify([
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
					let t = await fetch(rm({
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
		let o = X(() => n.entry.blocks.flatMap((e) => e.kind === "text" ? sm(e.content).files.filter((e) => !e.automatic || !!r.value[e.path]).map((e) => r.value[e.path]?.path || e.path) : [])), s = X(() => {
			let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Map();
			for (let i of n.entry.blocks) i.kind === "text" && (t.set(i.id, [...e]), sm(i.content).files.forEach((t) => {
				if (t.automatic && !r.value[t.path]) return;
				e.add(t.path);
				let n = r.value[t.path]?.path;
				n && e.add(n);
			}));
			return t;
		}), c = X(() => Ab(n.entry.blocks)), l = X(() => {
			let e = new Set(o.value), t = /* @__PURE__ */ new Map();
			for (let r of n.entry.blocks) r.kind === "tool" && t.set(r.id, cm(r).filter((t) => !e.has(t.path) && (e.add(t.path), !0)));
			return t;
		}), u = (e) => l.value.get(e.id) || [], d = t, f = /* @__PURE__ */ R(""), p = X(() => n.entry.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("\n\n"));
		async function m() {
			try {
				await navigator.clipboard.writeText(p.value), f.value = "Copied";
			} catch {
				f.value = "Could not copy. Select the response text to copy it.";
			}
		}
		return (t, n) => (W(), G("div", ox, [
			(W(!0), G(U, null, H(c.value, (t) => (W(), G(U, { key: t.id }, [t.kind === "tools" ? (W(), K(nx, {
				key: 0,
				activities: t.activities,
				working: !!e.entry.working,
				"approval-pending": e.entry.approvalPending
			}, {
				result: jn(({ activity: t }) => [(W(!0), G(U, null, H(u(t), (t) => (W(), K(wb, {
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
			])) : (W(), K(ax, {
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
			e.entry.working && !c.value.some((e) => e.kind === "tools") ? (W(), K(nx, {
				key: 0,
				activities: [],
				working: !0,
				"approval-pending": e.entry.approvalPending
			}, null, 8, ["approval-pending"])) : Y("v-if", !0),
			yr(t.$slots, "request"),
			!e.entry.working && p.value.trim() ? (W(), G("div", sx, [
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
				e.entry.responseId ? (W(), G("button", {
					key: 0,
					type: "button",
					"aria-label": "Branch in new chat",
					title: "Branch in new chat",
					disabled: e.branchDisabled,
					class: "flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-white",
					onPointerdown: n[3] ||= Oo(() => {}, ["prevent"]),
					onClick: n[4] ||= (t) => d("branch", e.entry.responseId)
				}, [...n[6] ||= [Zi("<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" class=\"size-4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><circle cx=\"6\" cy=\"5\" r=\"2\"></circle><circle cx=\"6\" cy=\"19\" r=\"2\"></circle><circle cx=\"18\" cy=\"5\" r=\"2\"></circle><path d=\"M6 7v10m0-4h5a7 7 0 0 0 7-6\"></path></svg>", 1)]], 40, cx)) : Y("v-if", !0),
				q("span", lx, L(f.value), 1)
			])) : Y("v-if", !0)
		]));
	}
}), dx = { class: "relative flex min-h-0 w-full flex-1" }, fx = {
	key: 0,
	class: "text-center text-sm text-[#a3a3a3]"
}, px = ["disabled"], mx = {
	key: 0,
	role: "status"
}, hx = {
	key: 1,
	class: "muted text-sm text-[#a3a3a3]"
}, gx = {
	key: 2,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, _x = {
	key: 0,
	"data-compaction": "",
	class: "flex items-center gap-3 text-xs text-[#a3a3a3]",
	role: "separator",
	"aria-label": "Context compacted"
}, vx = {
	key: 2,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, yx = { class: "system-notices" }, bx = { class: "cursor-pointer select-none" }, xx = { class: "mt-2 whitespace-pre-wrap break-words" }, Sx = {
	key: 3,
	class: "assistant-turn",
	"data-chat-message": "",
	tabindex: "-1"
}, Cx = {
	key: 4,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, wx = {
	key: 6,
	class: "message assistant w-full self-start",
	"data-chat-message": "",
	tabindex: "-1"
}, Tx = ["innerHTML"], Ex = /* @__PURE__ */ V({
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
		let r = e, i = n, a = X(() => o.value), o = X(() => Om(r)), s = /* @__PURE__ */ R(), c = /* @__PURE__ */ R(), l = /* @__PURE__ */ R(r.followInitially !== !1), u = /* @__PURE__ */ R(!0), d;
		function f() {
			let e = s.value;
			if (!e || !l.value || document.activeElement !== e && document.activeElement !== d) return;
			let t = c.value?.querySelectorAll("[data-chat-message]"), n = t?.[t.length - 1] || e;
			document.activeElement !== n && n.focus({ preventScroll: !0 }), d = n;
		}
		function p() {
			s.value?.focus({ preventScroll: !0 }), x(), yn(() => {
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
			await yn(), S();
		}
		return cr(() => {
			S(), typeof ResizeObserver < "u" && (h = new ResizeObserver(S), s.value && h.observe(s.value), c.value && h.observe(c.value));
		}), dr(() => h?.disconnect()), Ln(() => [
			r.messages,
			r.hasEarlier,
			r.loadingEarlier
		], () => {
			!l.value && (!_?.element.isConnected || Math.abs((s.value?.scrollTop || 0) - _.scrollTop) > .5) && v();
		}, { flush: "pre" }), Ln(() => r.sessionId, () => {
			_ = void 0, l.value = r.followInitially !== !1, m = !0;
		}), Ln(() => [
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
		}), (t, n) => (W(), G("div", dx, [q("div", {
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
			e.hasEarlier || e.loadingEarlier || e.earlierError ? (W(), G("div", fx, [q("button", {
				type: "button",
				disabled: e.loadingEarlier,
				class: "rounded-full px-4 py-2 hover:bg-[#303030] disabled:opacity-60",
				onClick: y
			}, L(e.loadingEarlier ? "Loading earlier messages…" : "Show earlier messages"), 9, px), e.earlierError ? (W(), G("p", mx, L(e.earlierError), 1)) : Y("v-if", !0)])) : Y("v-if", !0),
			e.loading ? (W(), G("div", hx, "Loading conversation…")) : !a.value.length && !e.draft && !e.thinking ? (W(), G("div", gx, [...n[1] ||= [q("div", { class: "m-auto text-center" }, [q("h2", { class: "text-2xl font-medium" }, "What can I help with?"), q("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, " Ask Hermes a question or continue a conversation. ")], -1)]])) : Y("v-if", !0),
			(W(!0), G(U, null, H(o.value, (r) => (W(), G(U, { key: r.key }, [r.kind === "compaction" ? (W(), G("div", _x, [...n[2] ||= [
				q("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1),
				q("span", null, "Context compacted", -1),
				q("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1)
			]])) : r.kind === "user" ? (W(), K(kb, {
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
			])) : r.kind === "status" ? (W(), G("div", vx, [q("details", yx, [q("summary", bx, L(r.text), 1), q("p", xx, L(r.content), 1)])])) : (W(), K(ux, {
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
			}, vr({ _: 2 }, [r.working ? {
				name: "request",
				fn: jn(() => [yr(t.$slots, "request")]),
				key: "0"
			} : void 0]), 1032, [
				"entry",
				"branch-disabled",
				"profile",
				"session-id"
			]))], 64))), 128)),
			e.working && !o.value.some((e) => e.kind === "turn" && e.working) ? (W(), G("div", Sx, [qi(nx, {
				activities: e.progress,
				working: !0,
				"approval-pending": e.approvalPending
			}, null, 8, ["activities", "approval-pending"])])) : Y("v-if", !0),
			e.statusLabel && !e.working ? (W(), G("div", Cx, L(e.statusLabel), 1)) : Y("v-if", !0),
			o.value.some((e) => e.kind === "turn" && e.working) ? Y("v-if", !0) : yr(t.$slots, "request", {}, void 0, void 0, 5),
			e.draft && !e.blocks?.length ? (W(), G("article", wx, [q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: z(Eb)(e.draft)
			}, null, 8, Tx)])) : Y("v-if", !0)
		], 512)], 544), !u.value && !e.home && !e.loading ? (W(), G("button", {
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
}), Dx = {
	key: 0,
	class: "approval-choices grid grid-cols-1 gap-2 my-3"
}, Ox = ["disabled", "onClick"], kx = /* @__PURE__ */ V({
	__name: "ApprovalRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		active: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(!1);
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
		return (t, i) => (W(), G(U, null, [q("p", null, "Approval required" + L(e.request.params.command ? ": " + e.request.params.command : ""), 1), e.active ? (W(), G("div", Dx, [(W(!0), G(U, null, H(e.request.params.choices, (t) => (W(), G("button", {
			key: t,
			class: de(["w-full rounded-xl bg-[#303030] px-[14px] py-[10px] text-left text-base leading-[1.5] text-white whitespace-normal break-words disabled:opacity-55", t === "deny" ? "text-red-500" : ""]),
			disabled: e.disabled || n.value,
			onMousedown: i[0] ||= Oo(() => {}, ["prevent"]),
			onClick: (e) => r(t)
		}, L(t === "once" ? "Allow once" : t === "deny" ? "Deny" : t === "session" ? "Allow for session" : "Always allow"), 43, Ox))), 128))])) : Y("v-if", !0)], 64));
	}
}), Ax = { class: "clarification-card" }, jx = ["disabled"], Mx = {
	key: 0,
	class: "clarification-choices"
}, Nx = ["aria-pressed", "onClick"], Px = { class: "clarification-other" }, Fx = ["onUpdate:modelValue", "aria-label"], Ix = ["disabled"], Lx = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ V({
	__name: "ClarificationCard",
	props: {
		questions: {},
		disabled: { type: Boolean }
	},
	emits: ["answer"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R({}), a = /* @__PURE__ */ R({});
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
		return (t, n) => (W(), G("div", Ax, [(W(!0), G(U, null, H(e.questions, (t) => (W(), G("form", {
			key: t.qid,
			onSubmit: Oo(c, ["prevent"])
		}, [q("fieldset", { disabled: e.disabled }, [
			q("legend", null, L(t.question), 1),
			t.choices?.length ? (W(), G("div", Mx, [(W(!0), G(U, null, H(t.choices, (e) => (W(), G("button", {
				key: e,
				type: "button",
				"aria-pressed": t.multi_select ? i.value[t.qid]?.includes(e) ?? !1 : void 0,
				onClick: (n) => s(t, e)
			}, L(e), 9, Nx))), 128))])) : Y("v-if", !0),
			q("div", Px, [B(q("input", {
				"onUpdate:modelValue": (e) => a.value[t.qid] = e,
				placeholder: "Other response",
				"aria-label": t.question + " — Other response"
			}, null, 8, Fx), [[vo, a.value[t.qid]]]), q("button", {
				type: "submit",
				disabled: e.disabled || !Object.keys(o()).length
			}, "Send", 8, Ix)])
		], 8, jx)], 32))), 128))]));
	}
}), [["__scopeId", "data-v-4672d460"]]), Rx = /* @__PURE__ */ V({
	__name: "ClarificationRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(!1);
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
		return (t, i) => (W(), K(Lx, {
			questions: e.request.params.questions,
			disabled: e.disabled || n.value,
			onAnswer: r
		}, null, 8, ["questions", "disabled"]));
	}
}), zx = { class: "block my-3" }, Bx = ["aria-label", "disabled"], Vx = ["disabled"], Hx = /* @__PURE__ */ V({
	__name: "SecretRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(""), r = /* @__PURE__ */ R(!1);
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
		return (t, a) => (W(), G(U, null, [q("p", null, L(e.request.params.prompt), 1), q("form", { onSubmit: Oo(i, ["prevent"]) }, [q("label", zx, [J(L(e.request.params.env_var) + " ", 1), B(q("input", {
			"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
			type: "password",
			autocomplete: "off",
			"aria-label": e.request.params.prompt || "Secret",
			disabled: e.disabled || r.value,
			class: "block w-full rounded-lg bg-[#303030] p-2 text-base"
		}, null, 8, Bx), [[vo, n.value]])]), q("button", {
			type: "submit",
			disabled: e.disabled || r.value || !n.value,
			class: "rounded-lg bg-[#303030] p-2 text-base"
		}, " Submit secret ", 8, Vx)], 32)], 64));
	}
}), Ux = { key: 3 }, Wx = /* @__PURE__ */ V({
	__name: "LiveRequest",
	setup(e) {
		let { view: t, scope: n, actions: r } = ih(), { request: i, reconnect: a, active: o } = t, { profile: s, session: c } = n, l = r.answerFor;
		return (e, t) => z(i) ? (W(), G("div", {
			key: JSON.stringify([
				z(s),
				z(c),
				z(i).id
			]),
			class: "notice px-5 py-3 text-sm",
			role: "status"
		}, [z(i).kind === "approval" ? (W(), K(kx, {
			key: 0,
			request: z(i),
			disabled: z(a),
			active: z(o),
			answer: z(l)(z(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"active",
			"answer"
		])) : z(i).kind === "clarify" ? (W(), K(Rx, {
			key: 1,
			request: z(i),
			disabled: z(a),
			answer: z(l)(z(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : z(i).kind === "secret" ? (W(), K(Hx, {
			key: 2,
			request: z(i),
			disabled: z(a),
			answer: z(l)(z(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : (W(), G("p", Ux, "This request cannot be displayed. Open it in Hermes."))])) : Y("v-if", !0);
	}
}), Gx = /* @__PURE__ */ V({
	__name: "ChatConversation",
	setup(e) {
		let { view: t, scope: n, actions: r } = ih(), { profile: i, session: a } = n, { messages: o, loading: s, busy: c, approvalPending: l, status: u } = t, d = /* @__PURE__ */ R(), f = Pn(ah);
		return cr(() => {
			f && (f.value = d.value);
		}), dr(() => {
			f && f.value === d.value && (f.value = void 0);
		}), (e, n) => (W(), K(Ex, {
			ref_key: "transcript",
			ref: d,
			profile: z(i),
			"session-id": z(a),
			"has-earlier": z(t).hasEarlier.value,
			"loading-earlier": z(t).loadingEarlier.value,
			"earlier-error": z(t).earlierError.value,
			onEarlier: z(r).loadEarlier,
			messages: z(o),
			draft: "",
			loading: z(s),
			progress: [],
			thinking: z(c),
			working: z(c) || z(l),
			"approval-pending": z(l),
			home: !z(a),
			"status-label": z(u),
			"branch-disabled": z(t).branchDisabled.value,
			"response-targets": z(t).responseTargets.value,
			onBranch: z(r).branch
		}, {
			request: jn(() => [qi(Wx)]),
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
}), Kx = /* @__PURE__ */ V({
	__name: "ChatPage",
	setup(e) {
		return (e, t) => (W(), K(Gx));
	}
}), qx = /* @__PURE__ */ V({
	__name: "InboxPage",
	setup(e) {
		let { profile: t, inboxRevision: n, openInboxItem: r, refreshInbox: i } = Eg(), a = kc(), o = Oc(), s = X({
			get: () => a.query.scope === "profile" ? "profile" : "all",
			set: (e) => {
				o.replace({ query: {
					...a.query,
					scope: e
				} });
			}
		});
		return (e, a) => (W(), K(Ay, {
			scope: s.value,
			"onUpdate:scope": a[0] ||= (e) => s.value = e,
			profile: z(t),
			revision: z(n),
			"open-item": z(r),
			onRefresh: z(i)
		}, null, 8, [
			"scope",
			"profile",
			"revision",
			"open-item",
			"onRefresh"
		]));
	}
}), Jx = {
	class: "min-h-0 flex-1 overflow-y-auto px-5 py-6",
	"aria-label": "Artifacts"
}, Yx = { class: "mx-auto max-w-[1100px]" }, Xx = { class: "mb-5 flex items-center justify-between" }, Zx = ["disabled"], Qx = {
	key: 0,
	role: "status",
	class: "text-sm text-[#b4b4b4]"
}, $x = {
	key: 1,
	role: "alert",
	class: "mb-4 text-sm text-red-200"
}, eS = {
	key: 2,
	class: "text-sm text-[#b4b4b4]"
}, tS = { class: "grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-4 [&>.artifact-card]:my-0" }, nS = { class: "border-t border-[#424242] px-3 py-2 text-xs text-[#b4b4b4]" }, rS = {
	key: 0,
	class: "mb-1 block truncate"
}, iS = { class: "flex min-w-0 items-center gap-3" }, aS = { class: "shrink-0" }, oS = ["title", "onClick"], sS = ["aria-label", "onClick"], cS = ["disabled"], lS = { key: 0 }, uS = { class: "mb-3 break-words" }, dS = { class: "flex justify-end gap-4" }, fS = ["disabled"], pS = ["disabled"], mS = /* @__PURE__ */ V({
	__name: "ArtifactBrowser",
	props: {
		profile: {},
		sessions: {},
		projects: {},
		project: {}
	},
	emits: ["openSession"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R([]), a = /* @__PURE__ */ R(!1), o = /* @__PURE__ */ R(""), s = /* @__PURE__ */ R(), c = /* @__PURE__ */ R(!1), l = /* @__PURE__ */ R();
		Ln(s, async (e) => {
			await yn(), e ? l.value?.showModal() : l.value?.close();
		});
		let u = /* @__PURE__ */ R(null), d;
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
		return Ln([() => n.profile, () => n.project?.id], () => f(), { immediate: !0 }), dr(() => d?.abort()), (t, n) => (W(), G("section", Jx, [q("div", Yx, [
			q("div", Xx, [n[5] ||= q("h2", { class: "text-xl font-medium" }, "Artifacts", -1), q("button", {
				class: "text-sm underline",
				disabled: a.value,
				onClick: n[0] ||= (e) => f()
			}, "Refresh", 8, Zx)]),
			a.value ? (W(), G("p", Qx, "Loading artifacts…")) : Y("v-if", !0),
			o.value ? (W(), G("p", $x, L(o.value), 1)) : Y("v-if", !0),
			!a.value && !i.value.length ? (W(), G("p", eS, "No artifacts found.")) : Y("v-if", !0),
			q("div", tS, [(W(!0), G(U, null, H(i.value, (t) => (W(), K(wb, {
				key: `${t.sessionId}:${t.path}`,
				file: t,
				profile: e.profile
			}, {
				footer: jn(() => [q("div", nS, [t.projectTitle ? (W(), G("span", rS, L(t.projectTitle), 1)) : Y("v-if", !0), q("div", iS, [
					q("span", aS, L(t.direction === "uploaded" ? "Uploaded" : "Generated"), 1),
					q("button", {
						type: "button",
						class: "min-w-0 flex-1 truncate py-2 text-left underline",
						title: t.sessionTitle,
						onClick: (e) => r("openSession", t.sessionId)
					}, L(t.sessionTitle), 9, oS),
					/^(https?:|data:)|^\/api\/plugins\/chathermes\/artifact-images\//.test(t.path) ? Y("v-if", !0) : (W(), G("button", {
						key: 0,
						type: "button",
						class: "shrink-0 py-2 hover:text-white",
						"aria-label": `Delete ${t.name}`,
						onClick: (e) => s.value = t
					}, " Delete ", 8, sS))
				])])]),
				_: 2
			}, 1032, ["file", "profile"]))), 128))]),
			u.value ? (W(), G("button", {
				key: 3,
				type: "button",
				class: "my-6 rounded-full border border-[#555] px-5 py-2 text-sm",
				disabled: a.value,
				onClick: n[1] ||= (e) => f(!0)
			}, L(a.value ? "Loading…" : "Load More"), 9, cS)) : Y("v-if", !0),
			q("dialog", {
				ref_key: "confirmation",
				ref: l,
				class: "fixed m-auto w-[min(380px,94vw)] rounded-2xl bg-[#303030] p-5 text-white backdrop:bg-black/80",
				"aria-label": "Delete artifact",
				onCancel: n[3] ||= (e) => c.value && e.preventDefault(),
				onClose: n[4] ||= (e) => s.value = void 0
			}, [s.value ? (W(), G("div", lS, [
				q("h3", uS, "Delete " + L(s.value.name) + " from Hermes?", 1),
				n[6] ||= q("p", { class: "mb-5 text-sm text-[#b4b4b4]" }, " This removes the server file. References in conversation history remain. ", -1),
				q("div", dS, [q("button", {
					autofocus: "",
					disabled: c.value,
					onClick: n[2] ||= (e) => s.value = void 0
				}, "Cancel", 8, fS), q("button", {
					disabled: c.value,
					onClick: p
				}, L(c.value ? "Deleting…" : "Delete file"), 9, pS)])
			])) : Y("v-if", !0)], 544)
		])]));
	}
}), hS = /* @__PURE__ */ V({
	__name: "ArtifactsPage",
	setup(e) {
		let { profile: t, projects: n, recentSession: r } = kg();
		return (e, i) => (W(), K(mS, {
			profile: z(t),
			projects: z(n),
			onOpenSession: z(r)
		}, null, 8, [
			"profile",
			"projects",
			"onOpenSession"
		]));
	}
}), gS = {
	class: "projects-page page-content",
	"aria-label": "Projects"
}, _S = { class: "page-heading" }, vS = ["disabled"], yS = {
	key: 0,
	class: "project-muted"
}, bS = { class: "project-actions" }, xS = ["disabled"], SS = ["disabled"], CS = {
	key: 2,
	role: "alert",
	class: "project-error"
}, wS = {
	key: 3,
	role: "status",
	class: "project-muted"
}, TS = {
	key: 4,
	class: "project-muted"
}, ES = {
	class: "project-list",
	"aria-label": "Project list"
}, DS = ["aria-label", "onClick"], OS = /* @__PURE__ */ V({
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
		let n = e, r = t, i = X(() => n.projects.filter((e) => !e.isNoProject && !!e.archived === n.archived)), a = /* @__PURE__ */ R(!1), o = /* @__PURE__ */ R(""), s = /* @__PURE__ */ R("");
		function c() {
			o.value.trim() && r("manage", "create", {
				name: o.value.trim(),
				...s.value.trim() ? { primary_path: s.value.trim() } : {}
			});
		}
		return (t, n) => (W(), G("section", gS, [
			q("div", _S, [n[5] ||= q("h2", null, "Projects", -1), e.archived ? Y("v-if", !0) : (W(), G("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: n[0] ||= (e) => a.value = !a.value
			}, " New project ", 8, vS))]),
			e.archived ? (W(), G("p", yS, "Archived projects")) : Y("v-if", !0),
			a.value && !e.archived ? (W(), G("form", {
				key: 1,
				class: "project-form",
				onSubmit: Oo(c, ["prevent"])
			}, [
				q("label", null, [n[6] ||= J("Project name", -1), B(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					required: "",
					maxlength: "160",
					autofocus: ""
				}, null, 512), [[vo, o.value]])]),
				q("label", null, [n[7] ||= J("Folder (optional)", -1), B(q("input", {
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					placeholder: "/path/on/hermes/server"
				}, null, 512), [[vo, s.value]])]),
				q("div", bS, [q("button", {
					class: "project-button",
					disabled: e.busy || e.offline || !o.value.trim()
				}, " Create project", 8, xS), q("button", {
					type: "button",
					class: "project-button",
					disabled: e.busy,
					onClick: n[3] ||= (e) => a.value = !1
				}, " Cancel ", 8, SS)])
			], 32)) : Y("v-if", !0),
			e.error ? (W(), G("p", CS, [J(L(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[4] ||= (e) => r("retry")
			}, "Retry Projects")])) : Y("v-if", !0),
			e.loading ? (W(), G("p", wS, "Loading Projects…")) : i.value.length ? Y("v-if", !0) : (W(), G("p", TS, L(e.archived ? "No archived projects." : "No projects yet."), 1)),
			q("nav", ES, [(W(!0), G(U, null, H(i.value, (e) => (W(), G("button", {
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
			], 8, DS))), 128))])
		]));
	}
}), kS = /* @__PURE__ */ V({
	__name: "ProjectsPage",
	setup(e) {
		let { projects: t, projectsLoading: n, projectsError: r, manageError: i, projectBusy: a, offline: o, chooseProject: s, loadProjects: c, manageProject: l } = Fg(), u = kc(), d = X(() => u.query.archived === "1");
		return (e, u) => (W(), K(OS, {
			projects: z(t),
			archived: d.value,
			loading: z(n),
			error: z(r) || z(i),
			busy: z(a),
			offline: z(o),
			onSelect: z(s),
			onRetry: z(c),
			onManage: z(l)
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
}), AS = {
	class: "project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10",
	"aria-label": "Selected Project"
}, jS = { class: "project-home-content" }, MS = {
	key: 0,
	role: "status"
}, NS = {
	key: 1,
	class: "mb-4 text-[#fecaca]",
	role: "alert"
}, PS = {
	class: "mb-5 flex gap-5 text-sm",
	"aria-label": "Project view"
}, FS = ["aria-pressed"], IS = ["aria-pressed"], LS = /* @__PURE__ */ V({
	__name: "ProjectLayout",
	setup(e) {
		let { selectedProject: t, projectLoading: n, projectError: r, loadProject: i, showProjects: a } = Fg(), o = kc(), s = Oc();
		return (e, c) => (W(), G("section", AS, [q("div", jS, [
			q("button", {
				class: "project-back",
				onClick: c[0] ||= (e) => z(a)(!!z(t)?.archived)
			}, " ← Projects "),
			z(n) ? (W(), G("p", MS, "Loading Project…")) : Y("v-if", !0),
			z(r) ? (W(), G("p", NS, [J(L(z(r)) + " ", 1), q("button", {
				class: "underline",
				onClick: c[1] ||= (...e) => z(i) && z(i)(...e)
			}, "Retry Project")])) : Y("v-if", !0),
			z(t) ? (W(), G(U, { key: 2 }, [q("nav", PS, [q("button", {
				"aria-pressed": z(o).name === "project",
				onClick: c[2] ||= (e) => z(s).push({
					name: "project",
					params: z(o).params,
					query: z(o).query
				})
			}, " Sessions / Chat ", 8, FS), q("button", {
				"aria-pressed": z(o).name === "project-artifacts",
				onClick: c[3] ||= (e) => z(s).push({
					name: "project-artifacts",
					params: z(o).params,
					query: z(o).query
				})
			}, " Artifacts ", 8, IS)]), yr(e.$slots, "default")], 64)) : Y("v-if", !0)
		])]));
	}
}), RS = {
	key: 0,
	class: "project-muted"
}, zS = { class: "mb-4 break-all text-sm text-[#a3a3a3]" }, BS = {
	key: 1,
	class: "text-sm text-[#b4b4b4]"
}, VS = {
	class: "project-chat-list",
	"aria-label": "Project chats"
}, HS = ["aria-label", "onClick"], US = { class: "project-chat-title" }, WS = {
	key: 0,
	class: "project-chat-preview"
}, GS = /* @__PURE__ */ V({
	__name: "ProjectHomePage",
	setup(e) {
		let { selectedProject: t, visibleSessions: n, chooseSession: r, chooseProject: i } = Fg();
		return (e, a) => (W(), K(LS, null, {
			default: jn(() => [z(t) ? (W(), G(U, { key: 0 }, [
				z(t).archived ? (W(), G("p", RS, "Archived project")) : Y("v-if", !0),
				q("p", zS, L(z(El)(z(t)) ? "Workspace: " + z(El)(z(t)) : z(t).isNoProject ? "No project workspace" : "No workspace configured"), 1),
				z(n).length ? Y("v-if", !0) : (W(), G("p", BS, "No conversations yet.")),
				q("nav", VS, [(W(!0), G(U, null, H(z(n), (e) => (W(), G("button", {
					key: e.id,
					class: "project-chat-row",
					"aria-label": e.title || "Untitled session",
					onClick: (t) => z(r)(e.id)
				}, [q("span", US, L(e.title || "Untitled session"), 1), e.preview?.trim() ? (W(), G("span", WS, L(e.preview), 1)) : Y("v-if", !0)], 8, HS))), 128))]),
				q("button", {
					class: "project-back mt-5",
					onClick: a[0] ||= (e) => z(i)("")
				}, "Other chats")
			], 64)) : Y("v-if", !0)]),
			_: 1
		}));
	}
}), KS = /* @__PURE__ */ V({
	__name: "ProjectArtifactsPage",
	setup(e) {
		let { selectedProject: t, profile: n, visibleSessions: r, recentSession: i } = Fg();
		return (e, a) => (W(), K(LS, null, {
			default: jn(() => [z(t) ? (W(), K(mS, {
				key: 0,
				project: z(t),
				profile: z(n),
				sessions: z(r),
				onOpenSession: z(i)
			}, null, 8, [
				"project",
				"profile",
				"sessions",
				"onOpenSession"
			])) : Y("v-if", !0)]),
			_: 1
		}));
	}
}), qS = {
	key: 0,
	class: "project-settings"
}, JS = ["disabled"], YS = {
	key: 0,
	class: "project-error",
	role: "alert"
}, XS = {
	key: 1,
	class: "project-muted",
	role: "status"
}, ZS = ["disabled"], QS = { class: "project-field-row" }, $S = ["disabled"], eC = {
	key: 2,
	class: "project-muted"
}, tC = { class: "project-folders" }, nC = { class: "folder-path" }, rC = { key: 0 }, iC = { key: 1 }, aC = { class: "project-actions" }, oC = ["disabled", "onClick"], sC = [
	"disabled",
	"aria-label",
	"onClick"
], cC = ["disabled"], lC = { class: "project-checkbox" }, uC = ["disabled"], dC = { id: "project-confirm-text" }, fC = { class: "project-actions" }, pC = ["disabled"], mC = ["disabled"], hC = /* @__PURE__ */ V({
	__name: "ProjectSettings",
	props: {
		project: {},
		busy: { type: Boolean },
		offline: { type: Boolean },
		error: {}
	},
	emits: ["manage"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ R(n.project.label), a = /* @__PURE__ */ R(n.project.description || ""), o = /* @__PURE__ */ R(n.project.icon || ""), s = /* @__PURE__ */ R(n.project.color || ""), c = /* @__PURE__ */ R(n.project.board_slug || ""), l = /* @__PURE__ */ R(""), u = /* @__PURE__ */ R(""), d = /* @__PURE__ */ R(!0), f = /* @__PURE__ */ R(), p = /* @__PURE__ */ R(), m = /* @__PURE__ */ R();
		Ln(() => n.busy, (e, t) => {
			t && !e && !n.error && _();
		}), Ln(() => n.project.label, (e) => {
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
			}, await yn(), p.value?.focus();
		}
		function _() {
			f.value = void 0, m.value?.focus();
		}
		function v() {
			let e = f.value;
			e && h(e.action, e.fields);
		}
		return (t, n) => e.project.isAuto ? (W(), G("div", qS, [n[12] ||= q("p", { class: "project-muted" }, " Save this discovered workspace as a project to manage its name and folders. ", -1), q("button", {
			class: "project-button",
			disabled: e.busy || e.offline,
			onClick: n[0] ||= (t) => r("manage", "create", {
				name: e.project.label,
				primary_path: e.project.path || e.project.repos.find((e) => e.path)?.path || ""
			})
		}, " Save project ", 8, JS)])) : e.project.isNoProject ? Y("v-if", !0) : (W(), G("div", {
			key: 1,
			ref_key: "settings",
			ref: m,
			tabindex: "-1",
			class: "project-settings"
		}, [
			e.error ? (W(), G("p", YS, L(e.error), 1)) : Y("v-if", !0),
			e.busy ? (W(), G("p", XS, "Saving project…")) : Y("v-if", !0),
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
				q("label", null, [n[13] ||= J("Project name", -1), B(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					required: "",
					maxlength: "160"
				}, null, 512), [[vo, i.value]])]),
				q("label", null, [n[14] ||= J("Description", -1), B(q("textarea", {
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					maxlength: "4096",
					rows: "2"
				}, null, 512), [[vo, a.value]])]),
				q("div", QS, [q("label", null, [n[15] ||= J("Icon", -1), B(q("input", {
					"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
					maxlength: "64"
				}, null, 512), [[vo, o.value]])]), q("label", null, [n[16] ||= J("Color", -1), B(q("input", {
					"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
					maxlength: "64",
					placeholder: "#94c9a5"
				}, null, 512), [[vo, s.value]])])]),
				q("label", null, [n[17] ||= J("Board slug (optional)", -1), B(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					maxlength: "160"
				}, null, 512), [[vo, c.value]])]),
				q("button", {
					class: "project-button",
					disabled: !i.value.trim()
				}, "Save changes", 8, $S)
			], 8, ZS)], 32),
			n[21] ||= q("h3", null, "Folders", -1),
			n[22] ||= q("p", { class: "project-muted" }, " The primary folder is used for new chats. Existing chats keep their workspace. ", -1),
			e.project.folders?.length ? Y("v-if", !0) : (W(), G("p", eC, "No folders configured.")),
			q("ul", tC, [(W(!0), G(U, null, H(e.project.folders, (t) => (W(), G("li", { key: t.path }, [q("span", nC, [
				J(L(t.label || t.path), 1),
				t.label ? (W(), G("small", rC, L(t.path), 1)) : Y("v-if", !0),
				t.is_primary ? (W(), G("small", iC, "Primary folder")) : Y("v-if", !0)
			]), q("div", aC, [t.is_primary ? Y("v-if", !0) : (W(), G("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: (e) => h("set_primary", { path: t.path })
			}, " Make primary", 8, oC)), q("button", {
				class: "project-button",
				disabled: e.busy || e.offline,
				"aria-label": `Remove folder ${t.path}`,
				onClick: (e) => g("remove_folder", { path: t.path }, `Remove ${t.path} from this project? The folder and existing chats will be kept.`)
			}, " Remove ", 8, sC)])]))), 128))]),
			q("form", {
				class: "project-form",
				onSubmit: n[10] ||= Oo((e) => h("add_folder", {
					path: l.value.trim(),
					label: u.value.trim(),
					is_primary: d.value
				}), ["prevent"])
			}, [q("fieldset", { disabled: e.busy || e.offline }, [
				q("label", null, [n[18] ||= J("Folder path", -1), B(q("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					required: "",
					placeholder: "/path/on/hermes/server",
					maxlength: "4096"
				}, null, 512), [[vo, l.value]])]),
				q("label", null, [n[19] ||= J("Folder label (optional)", -1), B(q("input", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					maxlength: "160"
				}, null, 512), [[vo, u.value]])]),
				q("label", lC, [B(q("input", {
					"onUpdate:modelValue": n[9] ||= (e) => d.value = e,
					type: "checkbox"
				}, null, 512), [[yo, d.value]]), n[20] ||= J(" Use as primary folder", -1)]),
				q("button", {
					class: "project-button",
					disabled: !l.value.trim()
				}, "Add folder", 8, uC)
			], 8, cC)], 32),
			f.value ? (W(), G("div", {
				key: 3,
				class: "project-confirmation",
				role: "alertdialog",
				"aria-modal": "false",
				"aria-labelledby": "project-confirm-text",
				onKeydown: n[11] ||= Ao(Oo((t) => !e.busy && _(), ["prevent"]), ["esc"])
			}, [q("p", dC, L(f.value.text), 1), q("div", fC, [q("button", {
				ref_key: "cancelButton",
				ref: p,
				class: "project-button",
				disabled: e.busy,
				onClick: _
			}, " Cancel", 8, pC), q("button", {
				class: "project-button project-danger",
				disabled: e.busy || e.offline,
				onClick: v
			}, " Confirm removal ", 8, mC)])], 32)) : Y("v-if", !0)
		], 512));
	}
}), gC = {
	class: "page-content project-editor",
	"aria-label": "Edit project"
}, _C = {
	key: 0,
	role: "status"
}, vC = {
	key: 1,
	role: "alert"
}, yC = /* @__PURE__ */ V({
	__name: "ProjectSettingsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, projectBusy: i, offline: a, manageError: o, manageProject: s, chooseProject: c, projectLoading: l, projectError: u, loadProject: d } = Fg();
		return (e, f) => (W(), G("section", gC, [
			q("button", {
				class: "project-back",
				onClick: f[0] ||= (e) => z(c)(z(n))
			}, " ← " + L(z(r)?.label || "Project"), 1),
			f[2] ||= q("h2", { class: "text-2xl font-semibold" }, "Edit project", -1),
			z(l) ? (W(), G("p", _C, "Loading Project…")) : Y("v-if", !0),
			z(u) ? (W(), G("p", vC, [J(L(z(u)) + " ", 1), q("button", { onClick: f[1] ||= (...e) => z(d) && z(d)(...e) }, "Retry Project")])) : Y("v-if", !0),
			z(r) ? (W(), K(hC, {
				key: JSON.stringify([z(t), z(r).id]),
				project: z(r),
				busy: z(i),
				offline: z(a),
				error: z(o),
				onManage: z(s)
			}, null, 8, [
				"project",
				"busy",
				"offline",
				"error",
				"onManage"
			])) : Y("v-if", !0)
		]));
	}
}), bC = {
	key: 0,
	role: "status"
}, xC = {
	key: 1,
	role: "alert",
	class: "project-error"
}, SC = ["disabled"], CC = { key: 2 }, wC = { class: "project-muted" }, TC = ["disabled"], EC = {
	key: 3,
	role: "status",
	class: "project-muted"
}, DC = ["disabled"], OC = /* @__PURE__ */ V({
	__name: "ProjectInstructions",
	props: {
		profile: {},
		projectId: {},
		offline: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ R(""), r = /* @__PURE__ */ R(""), i = /* @__PURE__ */ R(null), a = /* @__PURE__ */ R(!0), o = /* @__PURE__ */ R(!1), s = /* @__PURE__ */ R(""), c = /* @__PURE__ */ R(!1), l = /* @__PURE__ */ R(!1), u = new AbortController(), d = !0;
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
					d && (s.value = e instanceof fl && e.status === 409 ? "Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading." : "Could not save instructions. Your draft is kept; try again.");
				} finally {
					d && (o.value = !1);
				}
			}
		}
		return cr(f), dr(() => {
			d = !1, u.abort();
		}), (t, i) => (W(), G("form", {
			class: "project-form instructions-form",
			onSubmit: Oo(p, ["prevent"])
		}, [
			i[3] ||= q("p", { class: "project-muted" }, "Custom instructions guide Hermes when it works in this project.", -1),
			a.value ? (W(), G("p", bC, "Loading instructions…")) : Y("v-if", !0),
			s.value ? (W(), G("p", xC, [J(L(s.value) + " ", 1), q("button", {
				type: "button",
				class: "underline",
				disabled: a.value || o.value || e.offline,
				onClick: f
			}, " Reload instructions ", 8, SC)])) : Y("v-if", !0),
			l.value ? (W(), G("label", CC, [
				i[2] ||= J("Instructions ", -1),
				q("span", wC, L(r.value), 1),
				B(q("textarea", {
					"onUpdate:modelValue": i[0] ||= (e) => n.value = e,
					rows: "14",
					disabled: a.value || o.value,
					onInput: i[1] ||= (e) => c.value = !1
				}, null, 40, TC), [[vo, n.value]])
			])) : Y("v-if", !0),
			c.value ? (W(), G("p", EC, "Instructions saved.")) : Y("v-if", !0),
			q("button", {
				class: "project-button justify-self-start",
				disabled: !l.value || a.value || o.value || e.offline
			}, L(o.value ? "Saving…" : "Save instructions"), 9, DC)
		], 32));
	}
}), kC = {
	class: "page-content project-editor",
	"aria-label": "Edit Instructions"
}, AC = {
	key: 0,
	role: "status"
}, jC = {
	key: 1,
	role: "alert"
}, MC = /* @__PURE__ */ V({
	__name: "ProjectInstructionsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, offline: i, chooseProject: a, projectLoading: o, projectError: s, loadProject: c } = Fg();
		return (e, l) => (W(), G("section", kC, [
			q("button", {
				class: "project-back",
				onClick: l[0] ||= (e) => z(a)(z(n))
			}, " ← " + L(z(r)?.label || "Project"), 1),
			l[2] ||= q("h2", { class: "text-2xl font-semibold" }, "Edit Instructions", -1),
			z(o) ? (W(), G("p", AC, "Loading Project…")) : Y("v-if", !0),
			z(s) ? (W(), G("p", jC, [J(L(z(s)) + " ", 1), q("button", { onClick: l[1] ||= (...e) => z(c) && z(c)(...e) }, "Retry Project")])) : Y("v-if", !0),
			z(r) ? (W(), K(OC, {
				key: JSON.stringify([z(t), z(r).id]),
				profile: z(t),
				"project-id": z(r).id,
				offline: z(i)
			}, null, 8, [
				"profile",
				"project-id",
				"offline"
			])) : Y("v-if", !0)
		]));
	}
}), NC = { class: "scheduled-heading" }, PC = { class: "scheduled-heading-content" }, FC = { class: "page-heading" }, IC = {
	key: 0,
	class: "project-muted"
}, LC = {
	key: 1,
	role: "status",
	class: "project-muted"
}, RC = {
	key: 2,
	role: "alert",
	class: "project-error"
}, zC = /* @__PURE__ */ V({
	__name: "ScheduledHeading",
	props: {
		title: {},
		subtitle: {},
		loading: { type: Boolean },
		error: {}
	},
	emits: ["retry"],
	setup(e) {
		return (t, n) => (W(), G("div", NC, [q("div", PC, [
			q("div", FC, [q("h2", null, L(e.title || "Scheduled"), 1)]),
			yr(t.$slots, "default"),
			e.subtitle ? (W(), G("p", IC, L(e.subtitle), 1)) : Y("v-if", !0),
			e.loading ? (W(), G("p", LC, "Loading scheduled history…")) : Y("v-if", !0),
			e.error ? (W(), G("p", RC, [J(L(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[0] ||= (e) => t.$emit("retry")
			}, "Retry")])) : Y("v-if", !0)
		])]));
	}
}), BC = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, VC = { class: "scheduled-filter" }, HC = { class: "scheduled-content" }, UC = {
	key: 0,
	class: "project-muted"
}, WC = {
	class: "scheduled-list",
	"aria-label": "Scheduled jobs"
}, GC = ["onClick"], KC = /* @__PURE__ */ V({
	__name: "ScheduledListPage",
	setup(e) {
		let t = kc(), n = Oc(), r = /* @__PURE__ */ R([]), i = X({
			get: () => ["paused", "completed"].includes(String(t.query.status)) ? String(t.query.status) : "active",
			set: (e) => {
				n.replace({ query: {
					...t.query,
					status: e
				} });
			}
		}), a = X(() => r.value.filter((e) => zg(e) === i.value)), { loading: o, error: s, retry: c } = Hg(async (e, t) => {
			r.value = [];
			let n = await Q.scheduled(t, e);
			if (!Array.isArray(n.jobs)) throw Error("Invalid jobs");
			e.aborted || (r.value = n.jobs);
		});
		return (e, r) => (W(), G("section", BC, [qi(zC, {
			loading: z(o),
			error: z(s),
			onRetry: z(c)
		}, {
			default: jn(() => [q("label", VC, [r[2] ||= J("Show ", -1), B(q("select", {
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
		]), q("div", HC, [!z(o) && !z(s) && !a.value.length ? (W(), G("p", UC, " No " + L(i.value) + " scheduled jobs. ", 1)) : Y("v-if", !0), q("nav", WC, [(W(!0), G(U, null, H(a.value, (e) => (W(), G("button", {
			key: e.id,
			class: "scheduled-job-row",
			onClick: (r) => z(n).push({
				name: "scheduled-job",
				params: { jobId: e.id },
				query: z(t).query
			})
		}, [q("span", null, [
			q("strong", null, L(e.name || e.id), 1),
			q("small", null, L(e.schedule_display || "Scheduled job"), 1),
			q("small", null, L(z(Vg)(e.last_run_at)), 1)
		]), r[3] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, GC))), 128))])])]));
	}
}), qC = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, JC = { class: "scheduled-content" }, YC = {
	key: 0,
	class: "project-muted"
}, XC = {
	class: "scheduled-list",
	"aria-label": "Job runs"
}, ZC = ["onClick"], QC = ["disabled"], $C = /* @__PURE__ */ V({
	__name: "ScheduledJobPage",
	setup(e) {
		let t = kc(), n = Oc(), r = /* @__PURE__ */ R(), i = /* @__PURE__ */ R([]), a = /* @__PURE__ */ R(!1), o = /* @__PURE__ */ R(0), s = !1, { loading: c, error: l, retry: u } = Hg(async (e, t, n) => {
			let c = s;
			if (s = !1, !c) {
				r.value = void 0, i.value = [], o.value = 0, a.value = !1;
				let s = await Ug(t, n, e);
				if (e.aborted) return;
				r.value = s;
			}
			let l = await Q.scheduledRuns(t, n, c ? o.value : 0, e);
			e.aborted || (i.value = c ? [...i.value, ...l.runs.filter((e) => !i.value.some((t) => t.id === e.id))] : l.runs, o.value = l.offset + l.runs.length, a.value = l.has_more);
		});
		function d() {
			s = !0, u();
		}
		return (e, o) => (W(), G("section", qC, [qi(zC, {
			title: r.value?.name || r.value?.id,
			subtitle: "Run history · newest first",
			loading: z(c),
			error: z(l),
			onRetry: z(u)
		}, null, 8, [
			"title",
			"loading",
			"error",
			"onRetry"
		]), q("div", JC, [
			!z(c) && !z(l) && !i.value.length ? (W(), G("p", YC, "No runs yet.")) : Y("v-if", !0),
			q("nav", XC, [(W(!0), G(U, null, H(i.value, (e) => (W(), G("button", {
				key: e.id,
				onClick: (r) => z(n).push({
					name: "scheduled-run",
					params: {
						jobId: z(t).params.jobId,
						runId: e.id
					},
					query: z(t).query
				})
			}, [q("span", null, [
				q("strong", null, L(z(Bg)(e.started_at)), 1),
				q("small", null, L(e.title || "Job run"), 1),
				q("small", null, L(e.end_reason || (e.source === "cron_output" ? "Saved output" : e.ended_at ? "Finished" : "In progress")), 1)
			]), o[0] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, ZC))), 128))]),
			a.value ? (W(), G("button", {
				key: 1,
				class: "project-button",
				disabled: z(c),
				onClick: d
			}, " Load older runs ", 8, QC)) : Y("v-if", !0)
		])]));
	}
}), ew = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, tw = {
	key: 1,
	class: "scheduled-content"
}, nw = {
	key: 0,
	class: "project-muted"
}, rw = /* @__PURE__ */ V({
	__name: "ScheduledRunPage",
	setup(e) {
		let t = kc(), n = /* @__PURE__ */ R(), r = /* @__PURE__ */ R(), i = Hg(async (e, t, a, o) => {
			n.value = void 0, r.value = void 0;
			let s = await Ug(t, a, e);
			if (e.aborted) return;
			n.value = s;
			let c = await Q.scheduledOutput(t, a, o, e);
			e.aborted || (r.value = c, i.sessionId.value = c.session_id);
		}), { loading: a, error: o, retry: s } = i, c = X(() => Wg(r.value));
		return (e, i) => (W(), G("section", ew, [qi(zC, {
			title: n.value?.name || n.value?.id,
			subtitle: r.value ? z(Bg)(r.value.started_at || 0) : void 0,
			loading: z(a),
			error: z(o),
			onRetry: z(s)
		}, null, 8, [
			"title",
			"subtitle",
			"loading",
			"error",
			"onRetry"
		]), c.value.length ? (W(), K(Ex, {
			key: String(z(t).params.runId),
			"follow-initially": !1,
			messages: c.value,
			draft: "",
			loading: !1,
			progress: []
		}, null, 8, ["messages"])) : (W(), G("div", tw, [r.value ? (W(), G("p", nw, "No output was saved for this run.")) : Y("v-if", !0)]))]));
	}
}), iw = {
	class: "settings-page page-content",
	"aria-label": "Settings"
}, aw = { class: "settings-content" }, ow = { class: "settings-heading" }, sw = {
	class: "settings-group",
	"aria-labelledby": "settings-profile-heading"
}, cw = { class: "settings-row" }, lw = ["value"], uw = ["value"], dw = ["value"], fw = {
	class: "settings-group",
	"aria-labelledby": "settings-app-heading"
}, pw = { class: "settings-row settings-notifications" }, mw = { class: "wake-lock-setting" }, hw = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, gw = ["checked"], _w = {
	key: 0,
	class: "mt-1 text-sm"
}, vw = {
	key: 0,
	class: "settings-row settings-notifications"
}, yw = { class: "kanban-setting" }, bw = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, xw = ["checked", "disabled"], Sw = {
	id: "kanban-description",
	role: "status"
}, Cw = ["disabled"], ww = {
	class: "settings-group",
	"aria-labelledby": "settings-notifications-heading"
}, Tw = { class: "settings-row settings-notifications" }, Ew = {
	class: "push-setting",
	"aria-labelledby": "notifications-heading"
}, Dw = {
	id: "notifications-heading",
	class: "text-sm font-medium text-white"
}, Ow = ["disabled"], kw = ["disabled"], Aw = {
	key: 1,
	class: "mt-1 text-sm text-[#dcae6e]",
	role: "status"
}, jw = {
	key: 2,
	class: "mt-1 text-sm"
}, Mw = {
	key: 3,
	class: "mt-1 text-sm",
	role: "status"
}, Nw = {
	key: 4,
	class: "mt-1 text-sm"
}, Pw = {
	key: 5,
	class: "mt-1 text-sm"
}, Fw = {
	key: 6,
	class: "mt-1 text-sm"
}, Iw = /* @__PURE__ */ V({
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
		let n = t, r = /* @__PURE__ */ R();
		return cr(() => r.value?.focus()), (t, i) => (W(), G("section", iw, [q("div", aw, [
			q("div", ow, [q("h2", {
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
			q("div", sw, [q("div", cw, [i[8] ||= Zi("<svg class=\"settings-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><circle cx=\"12\" cy=\"9\" r=\"3\"></circle><path d=\"M6 19c0-6 12-6 12 0\"></path></svg><label for=\"settings-profile\">Active profile</label>", 2), q("select", {
				id: "settings-profile",
				value: e.profile,
				onChange: i[1] ||= (e) => n("profile", e.target.value)
			}, [
				i[7] ||= q("option", { value: "" }, "Default profile", -1),
				e.profile && !e.profiles.some((t) => t.name === e.profile) ? (W(), G("option", {
					key: 0,
					value: e.profile
				}, L(e.profile), 9, uw)) : Y("v-if", !0),
				(W(!0), G(U, null, H(e.profiles, (e) => (W(), G("option", {
					key: e.name,
					value: e.name
				}, L(e.name), 9, dw))), 128))
			], 40, lw)])]),
			i[16] ||= q("h3", {
				id: "settings-app-heading",
				class: "settings-section-title"
			}, "Global settings", -1),
			q("div", fw, [q("div", pw, [i[11] ||= q("svg", {
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
			}), q("path", { d: "M9 17h6" })], -1), q("div", mw, [
				i[10] ||= q("h3", {
					id: "wake-lock-heading",
					class: "text-sm font-medium text-white"
				}, "Keep Screen Awake", -1),
				q("label", hw, [q("input", {
					type: "checkbox",
					"aria-labelledby": "wake-lock-heading",
					checked: e.keepScreenAwake,
					onChange: i[2] ||= (e) => n("toggleWakeLock", e.target.checked)
				}, null, 40, gw), i[9] ||= J(" Prevent the display from sleeping while ChatHermes is visible. ", -1)]),
				e.wakeLockAvailable ? Y("v-if", !0) : (W(), G("p", _w, " Screen wake lock is unavailable in this browser. "))
			])]), e.kanban ? (W(), G("div", vw, [i[13] ||= q("svg", {
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
			}), q("path", { d: "M9 3v18M15 3v18M5 7h2M11 7h2M17 7h2M5 11h2M11 11h2" })], -1), q("div", yw, [
				i[12] ||= q("h3", {
					id: "kanban-heading",
					class: "text-sm font-semibold text-white"
				}, "Kanban Viewer", -1),
				q("label", bw, [q("input", {
					type: "checkbox",
					"aria-labelledby": "kanban-heading",
					"aria-describedby": "kanban-description",
					checked: e.kanban.enabled.value,
					disabled: !e.kanban.available.value || e.kanban.checking.value,
					onChange: i[3] ||= (t) => e.kanban.setEnabled(t.target.checked)
				}, null, 40, xw), q("span", Sw, L(e.kanban.checking.value ? "Checking Hermes Kanban…" : e.kanban.available.value ? "Show the Hermes Kanban board in navigation." : "Hermes Kanban is inactive or its authenticated API is unavailable."), 1)]),
				q("button", {
					class: "min-h-[44px] underline",
					disabled: e.kanban.checking.value,
					onClick: i[4] ||= (t) => e.kanban.check()
				}, " Recheck availability ", 8, Cw)
			])])) : Y("v-if", !0)]),
			i[17] ||= q("h3", {
				id: "settings-notifications-heading",
				class: "settings-section-title"
			}, "Notifications", -1),
			q("div", ww, [q("div", Tw, [i[14] ||= q("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [q("path", { d: "M5 16h14l-2-3V9a5 5 0 0 0-10 0v4l-2 3Z" }), q("path", { d: "M10 19a2 2 0 0 0 4 0" })], -1), q("div", Ew, [
				q("h3", Dw, " Notifications for " + L(e.profile || "default"), 1),
				q("button", {
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.supported || !e.pushState.subscribed && !e.pushState.available,
					onClick: i[5] ||= (e) => n("togglePush")
				}, L(e.pushLoading ? "Loading…" : e.pushBusy ? "Updating…" : e.pushState.subscribed ? "Disable notifications" : "Enable notifications"), 9, Ow),
				e.pushState.subscribed ? (W(), G("button", {
					key: 0,
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.available,
					onClick: i[6] ||= (e) => n("testPush")
				}, " Send test ", 8, kw)) : Y("v-if", !0),
				e.pushState.error || e.pushMessage ? (W(), G("p", Aw, L(e.pushMessage || e.pushState.error), 1)) : e.pushState.subscribed ? (W(), G("p", jw, " Notifications enabled for " + L(e.profile || "default") + " on this device. ", 1)) : e.pushLoading ? (W(), G("p", Mw, " Loading profile notification status… ")) : e.pushState.supported ? e.pushState.permission === "denied" ? (W(), G("p", Pw, " Allow notifications in browser settings to enable them. ")) : (W(), G("p", Fw, " Notifications disabled for " + L(e.profile || "default") + " on this device. ", 1)) : (W(), G("p", Nw, " Install ChatHermes on a secure HTTPS origin to enable notifications. "))
			])])])
		])]));
	}
}), Lw = /* @__PURE__ */ V({
	__name: "SettingsPage",
	setup(e) {
		let { profile: t, profiles: n, pushState: r, pushBusy: i, pushLoading: a, pushMessage: o, wakeLock: s, kanban: c, chooseProfile: l, togglePush: u, testPush: d, closeSettings: f } = Mg();
		return (e, p) => (W(), K(Iw, {
			kanban: z(c),
			profile: z(t),
			profiles: z(n),
			"push-state": z(r),
			"push-busy": z(i),
			"push-loading": z(a),
			"push-message": z(o),
			"keep-screen-awake": z(s).enabled.value,
			"wake-lock-available": z(s).available.value,
			onProfile: z(l),
			onTogglePush: z(u),
			onTestPush: z(d),
			onToggleWakeLock: z(s).setEnabled,
			onClose: z(f)
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
}), Rw = "chathermes";
function zw() {
	let e = [], t = !1, n = !1, r = () => Ic(window.location.href) || "/", i = r(), a = () => window.history.state?.[Rw], o = a()?.position ?? 0, s = a()?.state ?? {}, c = () => {
		let e = new URL(window.location.href);
		return e.pathname + e.search;
	}, l = (e, t, r) => {
		if (n || window.location.pathname !== "/chathermes") return;
		let a = { ...window.history.state };
		r || (typeof a.idx == "number" && a.idx++, typeof a.key == "string" && (a.key = Math.random().toString(36).slice(2, 10)), o++), s = {
			...t,
			position: o
		}, a[Rw] = {
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
var Bw = ["disabled"], Vw = ["disabled"], Hw = ["disabled"], Uw = ["disabled"], Ww = ["disabled"], Gw = /* @__PURE__ */ V({
	__name: "ProjectActions",
	setup(e) {
		let { selectedProject: t, profile: n, projectId: r, projectBusy: i, offline: a, manageProject: o, createSession: s, creating: c, projectConfirmation: l } = Fg(), u = kc(), d = Oc();
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
		return (e, n) => z(t) && !z(t).isNoProject ? (W(), G(U, { key: 0 }, [
			z(t) && !z(t).isNoProject ? (W(), G("button", {
				key: 0,
				class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
				role: "menuitem",
				disabled: z(a) || z(c) || !z(t) || z(t).archived || !z(El)(z(t)),
				onClick: n[0] ||= (e) => z(s)()
			}, " New Project Chat ", 8, Bw)) : Y("v-if", !0),
			q("button", {
				role: "menuitem",
				onClick: n[1] ||= (e) => f("edit")
			}, "Edit project"),
			q("button", {
				role: "menuitem",
				disabled: z(a) || !z(El)(z(t)),
				onClick: n[2] ||= (e) => f("instructions")
			}, " Edit Instructions ", 8, Vw),
			z(t).isAuto ? Y("v-if", !0) : (W(), G(U, { key: 1 }, [z(t).archived ? (W(), G("button", {
				key: 0,
				role: "menuitem",
				disabled: z(i) || z(a),
				onClick: n[3] ||= (e) => z(o)("archive", {
					id: z(r),
					restore: !0
				})
			}, " Restore project ", 8, Hw)) : (W(), G("button", {
				key: 1,
				role: "menuitem",
				disabled: z(i) || z(a),
				onClick: n[4] ||= (e) => p("archive")
			}, " Archive project ", 8, Uw)), q("button", {
				class: "project-danger",
				role: "menuitem",
				disabled: z(i) || z(a),
				onClick: n[5] ||= (e) => p("delete")
			}, " Delete project ", 8, Ww)], 64))
		], 64)) : Y("v-if", !0);
	}
}), Kw = ["aria-checked"], qw = ["aria-checked"], Jw = /* @__PURE__ */ V({
	__name: "ProjectsActions",
	setup(e) {
		let t = kc(), n = X(() => t.query.archived === "1"), { showProjects: r } = Fg();
		return (e, t) => (W(), G(U, null, [q("button", {
			role: "menuitemradio",
			"aria-checked": !n.value,
			onClick: t[0] ||= (e) => z(r)(!1)
		}, " Active projects", 8, Kw), q("button", {
			role: "menuitemradio",
			"aria-checked": n.value,
			onClick: t[1] ||= (e) => z(r)(!0)
		}, " Archived projects ", 8, qw)], 64));
	}
}), Yw = ["disabled"], Xw = ["disabled"], Zw = /* @__PURE__ */ V({
	__name: "ScheduledActions",
	setup(e) {
		let { current: t, offline: n, creating: r, recentSession: i } = Rg();
		return (e, a) => (W(), G(U, null, [q("button", {
			role: "menuitem",
			"data-test": "refresh-scheduled",
			disabled: !z(t) || z(t).loading.value,
			onClick: a[0] ||= (e) => z(t)?.retry()
		}, " Refresh", 8, Yw), z(t)?.sessionId.value ? (W(), G("button", {
			key: 0,
			role: "menuitem",
			"data-test": "resume-scheduled-session",
			disabled: z(n) || z(r) || z(t).loading.value,
			onClick: a[1] ||= (e) => z(i)(z(t).sessionId.value)
		}, " Resume Session ", 8, Xw)) : Y("v-if", !0)], 64));
	}
});
//#endregion
//#region src/router/index.ts
function Qw(e = zw(), t) {
	let n = Dc({
		history: e,
		routes: [
			{
				path: "/",
				name: "home",
				components: { default: jy },
				meta: { chat: !0 }
			},
			{
				path: "/chat/:sessionId",
				name: "chat",
				components: {
					default: Kx,
					actions: Gw,
					dialogs: dy
				},
				meta: { chat: !0 }
			},
			{
				path: "/inbox",
				name: "inbox",
				components: {
					default: qx,
					actions: ay
				},
				meta: { title: "Inbox" }
			},
			{
				path: "/artifacts",
				name: "artifacts",
				components: { default: hS },
				meta: {
					title: "Artifacts",
					hideComposer: !0
				}
			},
			{
				path: "/projects",
				name: "projects",
				components: {
					default: kS,
					actions: Jw
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
					default: GS,
					actions: Gw,
					dialogs: dy
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
					default: KS,
					actions: Gw,
					dialogs: dy
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
					default: yC,
					actions: Gw,
					dialogs: dy
				},
				meta: { section: "projects" }
			},
			{
				path: "/projects/:projectId/instructions",
				name: "project-instructions",
				components: {
					default: MC,
					actions: Gw,
					dialogs: dy
				},
				meta: { section: "projects" }
			},
			{
				path: "/scheduled",
				name: "scheduled",
				components: {
					default: KC,
					actions: Zw
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
					default: $C,
					actions: Zw
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
					default: rw,
					actions: Zw
				},
				meta: {
					title: "Scheduled",
					section: "scheduled"
				}
			},
			{
				path: "/settings",
				name: "settings",
				components: { default: Lw },
				meta: {
					title: "Settings",
					hideComposer: !0
				}
			},
			{
				path: "/kanban",
				name: "kanban",
				components: {
					default: ny,
					actions: iy
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
		let t = Nc(e.query.profile);
		if (e.query.profile && typeof e.query.profile != "string" || t && !Mc.test(t) || Object.entries(e.params).some(([e, t]) => e === "projectId" ? !jc(t) : typeof t != "string" || !Ac.test(t)) || e.query.project && !jc(e.query.project) || [e.query.session].some((e) => e && (typeof e != "string" || !Ac.test(e)))) return { name: "home" };
		if (e.name === "settings" && e.query.return_to && Pc(e.query.return_to) !== e.query.return_to) return {
			name: "settings",
			query: {
				...e.query,
				return_to: "/"
			},
			replace: !0
		};
	});
	let r = t && Ic(t);
	return r && !Ic(window.location.href) && e.replace(r), n;
}
//#endregion
//#region src/main.ts
function $w(e, t) {
	let n = Po(N_).use(Qw(void 0, e));
	return t && n.provide(Lc, t), n;
}
//#endregion
export { N_ as App, $w as createChatHermesApp };
