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
}, d = Object.prototype.hasOwnProperty, f = (e, t) => d.call(e, t), p = Array.isArray, m = (e) => C(e) === "[object Map]", h = (e) => C(e) === "[object Set]", g = (e) => C(e) === "[object Date]", _ = (e) => typeof e == "function", v = (e) => typeof e == "string", y = (e) => typeof e == "symbol", b = (e) => typeof e == "object" && !!e, x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch), S = Object.prototype.toString, C = (e) => S.call(e), w = (e) => C(e).slice(8, -1), ee = (e) => C(e) === "[object Object]", te = (e) => v(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ n(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, D = /-\w/g, O = E((e) => e.replace(D, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, k = E((e) => e.replace(ne, "-$1").toLowerCase()), re = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = E((e) => e ? `on${re(e)}` : ""), A = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, j = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, M, se = () => M ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function N(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = v(r) ? ue(r) : N(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (v(e) || b(e)) return e;
}
var ce = /;(?![^(]*\))/g, P = /:([^]+)/, le = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ue(e) {
	let t = {};
	return e.replace(le, (e) => e.startsWith("/*") ? "" : e).split(ce).forEach((e) => {
		if (e) {
			let n = e.split(P);
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
var fe = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", pe = /* @__PURE__ */ n(fe);
fe + "";
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
var xe = (e) => !!(e && e.__v_isRef === !0), F = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? xe(e) ? F(e.value) : JSON.stringify(e, Se, 2) : String(e), Se = (e, t) => xe(t) ? Se(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ce(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ce(e)) } : y(t) ? Ce(t) : b(t) && !p(t) && !ee(t) ? String(t) : t, Ce = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, we, I = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && we && (we.active ? (this.parent = we, this.index = (we.scopes || (we.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = we;
			try {
				return we = this, e();
			} finally {
				we = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = we, we = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (we === this) we = this.prevScope;
			else {
				let e = we;
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
	return we;
}
var L, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, we && (we.active ? we.effects.push(this) : this.flags &= -2);
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
		let e = L, t = ze;
		L = this, ze = !0;
		try {
			return this.fn();
		} finally {
			R(this), L = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ee.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
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
function R(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Le(r), Re(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Fe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ie(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ie(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === We) || (e.globalVersion = We, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Fe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = L, r = ze;
	L = e, ze = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || A(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		L = n, ze = r, R(e), e.flags &= -3;
	}
}
function Le(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Le(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Re(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ze = !0, Be = [];
function Ve() {
	Be.push(ze), ze = !1;
}
function He() {
	let e = Be.pop();
	ze = e === void 0 || e;
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
		if (!L || !ze || L === this.computed) return;
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
var Je = /* @__PURE__ */ new WeakMap(), z = /* @__PURE__ */ Symbol(""), B = /* @__PURE__ */ Symbol(""), Ye = /* @__PURE__ */ Symbol("");
function Xe(e, t, n) {
	if (ze && L) {
		let t = Je.get(e);
		t || Je.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ke()), r.map = t, r.key = n), r.track();
	}
}
function Ze(e, t, n, r, i, a) {
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
		let i = p(e), a = i && te(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ye || !y(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ye)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(z)), m(e) && s(o.get(B)));
				break;
			case "delete":
				i || (s(o.get(z)), m(e) && s(o.get(B)));
				break;
			case "set": m(e) && s(o.get(z));
		}
	}
	Ne();
}
function Qe(e) {
	let t = /* @__PURE__ */ H(e);
	return t === e || (Xe(t, "iterate", Ye), /* @__PURE__ */ It(e)) ? t : /* @__PURE__ */ Ft(e) ? /* @__PURE__ */ Pt(e) ? t.map((e) => Bt(zt(e))) : t.map(Bt) : t.map(zt);
}
function $e(e) {
	return Xe(e = /* @__PURE__ */ H(e), "iterate", Ye), e;
}
function et(e, t) {
	return /* @__PURE__ */ Ft(e) ? Bt(/* @__PURE__ */ Pt(e) ? zt(t) : t) : zt(t);
}
var tt = {
	__proto__: null,
	[Symbol.iterator]() {
		return nt(this, Symbol.iterator, (e) => et(this, e));
	},
	concat(...e) {
		return Qe(this).concat(...e.map((e) => p(e) ? Qe(e) : e));
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
		return V(this, "includes", e);
	},
	indexOf(...e) {
		return V(this, "indexOf", e);
	},
	join(e) {
		return Qe(this).join(e);
	},
	lastIndexOf(...e) {
		return V(this, "lastIndexOf", e);
	},
	map(e, t) {
		return it(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return ot(this, "pop");
	},
	push(...e) {
		return ot(this, "push", e);
	},
	reduce(e, ...t) {
		return at(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return at(this, "reduceRight", e, t);
	},
	shift() {
		return ot(this, "shift");
	},
	some(e, t) {
		return it(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return ot(this, "splice", e);
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
		return ot(this, "unshift", e);
	},
	values() {
		return nt(this, "values", (e) => et(this, e));
	}
};
function nt(e, t, n) {
	let r = $e(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ It(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var rt = Array.prototype;
function it(e, t, n, r, i, a) {
	let o = $e(e), s = o !== e && !/* @__PURE__ */ It(e), c = o[t];
	if (c !== rt[t]) {
		let t = c.apply(e, a);
		return s ? zt(t) : t;
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
	let i = $e(e), a = i !== e && !/* @__PURE__ */ It(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = et(e, t)), n.call(this, t, et(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? et(e, c) : c;
}
function V(e, t, n) {
	let r = /* @__PURE__ */ H(e);
	Xe(r, "iterate", Ye);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Lt(n[0]) ? (n[0] = /* @__PURE__ */ H(n[0]), r[t](...n)) : i;
}
function ot(e, t, n = []) {
	Ve(), Me();
	let r = (/* @__PURE__ */ H(e))[t].apply(e, n);
	return Ne(), He(), r;
}
var st = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), ct = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function lt(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ H(this);
	return Xe(t, "has", e), t.hasOwnProperty(e);
}
var ut = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ot : Dt : i ? Et : Tt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = p(e);
		if (!r) {
			let e;
			if (a && (e = tt[t])) return e;
			if (t === "hasOwnProperty") return lt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Vt(e) ? e : n);
		if ((y(t) ? ct.has(t) : st(t)) || (r || Xe(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Vt(o)) {
			let e = a && te(t) ? o : o.value;
			return r && b(e) ? /* @__PURE__ */ Mt(e) : e;
		}
		return b(o) ? r ? /* @__PURE__ */ Mt(o) : /* @__PURE__ */ At(o) : o;
	}
}, dt = class extends ut {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = p(e) && te(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Ft(i);
			if (!/* @__PURE__ */ It(n) && !/* @__PURE__ */ Ft(n) && (i = /* @__PURE__ */ H(i), n = /* @__PURE__ */ H(n)), !a && /* @__PURE__ */ Vt(i) && !/* @__PURE__ */ Vt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Vt(e) ? e : r);
		return e === /* @__PURE__ */ H(r) && s && (o ? A(n, i) && Ze(e, "set", t, n, i) : Ze(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = f(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ze(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!y(t) || !ct.has(t)) && Xe(e, "has", t), n;
	}
	ownKeys(e) {
		return Xe(e, "iterate", p(e) ? "length" : z), Reflect.ownKeys(e);
	}
}, ft = class extends ut {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, pt = /* @__PURE__ */ new dt(), mt = /* @__PURE__ */ new ft(), ht = /* @__PURE__ */ new dt(!0), gt = (e) => e, _t = (e) => Reflect.getPrototypeOf(e);
function vt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ H(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? gt : t ? Bt : zt;
		return !t && Xe(a, "iterate", c ? B : z), l(Object.create(u), { next() {
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
function yt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function bt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ H(r), a = /* @__PURE__ */ H(n);
			e || (A(n, a) && Xe(i, "get", n), Xe(i, "get", a));
			let { has: o } = _t(i), s = t ? gt : e ? Bt : zt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Xe(/* @__PURE__ */ H(t), "iterate", z), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ H(n), i = /* @__PURE__ */ H(t);
			return e || (A(t, i) && Xe(r, "has", t), Xe(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ H(a), s = t ? gt : e ? Bt : zt;
			return !e && Xe(o, "iterate", z), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return l(n, e ? {
		add: yt("add"),
		set: yt("set"),
		delete: yt("delete"),
		clear: yt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ H(this), r = _t(n), i = /* @__PURE__ */ H(e), a = !t && !/* @__PURE__ */ It(e) && !/* @__PURE__ */ Ft(e) ? i : e;
			return r.has.call(n, a) || A(e, a) && r.has.call(n, e) || A(i, a) && r.has.call(n, i) || (n.add(a), Ze(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ It(n) && !/* @__PURE__ */ Ft(n) && (n = /* @__PURE__ */ H(n));
			let r = /* @__PURE__ */ H(this), { has: i, get: a } = _t(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ H(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? A(n, s) && Ze(r, "set", e, n, s) : Ze(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ H(this), { has: n, get: r } = _t(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ H(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ze(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ H(this), t = e.size !== 0, n = e.clear();
			return t && Ze(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = vt(r, e, t);
	}), n;
}
function xt(e, t) {
	let n = bt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(f(n, r) && r in t ? n : t, r, i);
}
var St = { get: /* @__PURE__ */ xt(!1, !1) }, Ct = { get: /* @__PURE__ */ xt(!1, !0) }, wt = { get: /* @__PURE__ */ xt(!0, !1) }, Tt = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Dt = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap();
function kt(e) {
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
function At(e) {
	return /* @__PURE__ */ Ft(e) ? e : Nt(e, !1, pt, St, Tt);
}
// @__NO_SIDE_EFFECTS__
function jt(e) {
	return Nt(e, !1, ht, Ct, Et);
}
// @__NO_SIDE_EFFECTS__
function Mt(e) {
	return Nt(e, !0, mt, wt, Dt);
}
function Nt(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = kt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return /* @__PURE__ */ Ft(e) ? /* @__PURE__ */ Pt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ H(t) : e;
}
function Rt(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var zt = (e) => b(e) ? /* @__PURE__ */ At(e) : e, Bt = (e) => b(e) ? /* @__PURE__ */ Mt(e) : e;
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function U(e) {
	return Ht(e, !1);
}
function Ht(e, t) {
	return /* @__PURE__ */ Vt(e) ? e : new Ut(e, t);
}
var Ut = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ H(e), this._value = t ? e : zt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ It(e) || /* @__PURE__ */ Ft(e);
		e = n ? e : /* @__PURE__ */ H(e), A(e, t) && (this._rawValue = e, this._value = n ? e : zt(e), this.dep.trigger());
	}
};
function Wt(e) {
	return /* @__PURE__ */ Vt(e) ? e.value : e;
}
var Gt = {
	get: (e, t, n) => t === "__v_raw" ? e : Wt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Vt(i) && !/* @__PURE__ */ Vt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Kt(e) {
	return /* @__PURE__ */ Pt(e) ? e : new Proxy(e, Gt);
}
var qt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && L !== this) return je(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ie(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Jt(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new qt(r, i, n);
}
var Yt = {}, Xt = /* @__PURE__ */ new WeakMap(), Zt = void 0;
function Qt(e, t = !1, n = Zt) {
	if (n) {
		let t = Xt.get(n);
		t || Xt.set(n, t = []), t.push(e);
	}
}
function $t(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ It(e) || o === !1 || o === 0 ? en(e, 1) : en(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ Vt(e) ? (h = () => e.value, y = /* @__PURE__ */ It(e)) : /* @__PURE__ */ Pt(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Pt(e) || /* @__PURE__ */ It(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Vt(e)) return e.value;
		if (/* @__PURE__ */ Pt(e)) return f(e);
		if (_(e)) return d ? d(e, 2) : e();
	})) : h = _(e) ? t ? d ? () => d(e, 2) : e : () => {
		if (g) {
			Ve();
			try {
				g();
			} finally {
				He();
			}
		}
		let t = Zt;
		Zt = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			Zt = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => en(e(), t);
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
	let C = b ? Array(e.length).fill(Yt) : Yt, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => A(e, C[t])) : A(n, C))) {
					g && g();
					let e = Zt;
					Zt = m;
					try {
						let e = [
							n,
							C === Yt ? void 0 : b && C[0] === Yt ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						Zt = e;
					}
				}
			} else m.run();
		}
	};
	return l && l(w), m = new De(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => Qt(e, !1, m), g = m.onStop = () => {
		let e = Xt.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			Xt.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function en(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Vt(e)) en(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) en(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		en(e, t, n);
	});
	else if (ee(e)) {
		for (let r in e) en(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && en(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function tn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		rn(e, t, n);
	}
}
function nn(e, t, n, r) {
	if (_(e)) {
		let i = tn(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			rn(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(nn(e[a], t, n, r));
		return i;
	}
}
function rn(e, t, n, i = !0) {
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
			Ve(), tn(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	an(e, n, a, i, s);
}
function an(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var on = [], sn = -1, cn = [], ln = null, un = 0, dn = /* @__PURE__ */ Promise.resolve(), fn = null;
function pn(e) {
	let t = fn || dn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function mn(e) {
	let t = sn + 1, n = on.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = on[r], a = bn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function hn(e) {
	if (!(e.flags & 1)) {
		let t = bn(e), n = on[on.length - 1];
		!n || !(e.flags & 2) && t >= bn(n) ? on.push(e) : on.splice(mn(t), 0, e), e.flags |= 1, gn();
	}
}
function gn() {
	fn ||= dn.then(xn);
}
function _n(e) {
	if (!p(e)) ln && e.id === -1 ? ln.splice(un + 1, 0, e) : e.flags & 1 || (cn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) cn.push(e[t]);
	gn();
}
function vn(e, t, n = sn + 1) {
	for (; n < on.length; n++) {
		let t = on[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			on.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function yn(e) {
	if (cn.length) {
		let e = [...new Set(cn)].sort((e, t) => bn(e) - bn(t));
		if (cn.length = 0, ln) {
			for (let t = 0; t < e.length; t++) ln.push(e[t]);
			return;
		}
		for (ln = e, un = 0; un < ln.length; un++) {
			let e = ln[un];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		ln = null, un = 0;
	}
}
var bn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function xn(e) {
	try {
		for (sn = 0; sn < on.length; sn++) {
			let e = on[sn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), tn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; sn < on.length; sn++) {
			let e = on[sn];
			e && (e.flags &= -2);
		}
		sn = -1, on.length = 0, yn(e), fn = null, (on.length || cn.length) && xn(e);
	}
}
var Sn = null, Cn = null;
function wn(e) {
	let t = Sn;
	return Sn = e, Cn = e && e.type.__scopeId || null, t;
}
function Tn(e, t = Sn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Li(-1);
		let i = wn(t), a = Ni.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ni.length; e > a; e--) Fi();
			wn(i), r._d && Li(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function En(e, t) {
	if (Sn === null) return e;
	let n = ga(Sn), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && en(o), i.push({
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
function Dn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ve(), nn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function On(e, t) {
	if (na) {
		let n = na.provides, r = na.parent && na.parent.provides;
		r === n && (n = na.provides = Object.create(r)), n[e] = t;
	}
}
function kn(e, t, n = !1) {
	let r = ra();
	if (r || Br) {
		let i = Br ? Br._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && _(t) ? t.call(r && r.proxy) : t;
	}
}
var An = /* @__PURE__ */ Symbol.for("v-scx"), jn = () => kn(An);
function Mn(e, t, n) {
	return Nn(e, t, n);
}
function Nn(e, t, n = r) {
	let { immediate: i, deep: o, flush: s, once: c } = n, u = l({}, n), d = t && i || !t && s !== "post", f;
	if (la) {
		if (s === "sync") {
			let e = jn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = na;
	u.call = (e, t, n) => nn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		_i(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : hn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = $t(e, t, u);
	return la && (f ? f.push(h) : d && h()), h;
}
function Pn(e, t, n) {
	let r = this.proxy, i = v(e) ? e.includes(".") ? Fn(r, e) : () => r[e] : e.bind(r, r), a;
	_(t) ? a = t : (a = t.handler, n = t);
	let o = oa(this), s = Nn(i, a.bind(r), n);
	return o(), s;
}
function Fn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var In = /* @__PURE__ */ Symbol("_vte"), Ln = (e) => e.__isTeleport, Rn = /* @__PURE__ */ Symbol("_leaveCb");
function zn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ji) {
			t = n;
			break;
		}
	}
	return t;
}
function Bn(e) {
	if (!Xn(e)) return Ln(e.type) && e.children ? zn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && _(n.default)) return n.default();
	}
}
function Vn(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Vn(Ln(n.type) && Bn(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Hn(e, t) {
	return _(e) ? /* @__PURE__ */ l({ name: e.name }, t, { setup: e }) : e;
}
function Un() {
	let e = ra();
	return e ? (e.appContext.config.idPrefix || "v") + "-" + e.ids[0] + e.ids[1]++ : "";
}
function Wn(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Gn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Kn = /* @__PURE__ */ new WeakMap();
function qn(e, t, n, i, a = !1) {
	if (p(e)) {
		e.forEach((e, r) => qn(e, t && (p(t) ? t[r] : t), n, i, a));
		return;
	}
	if (Yn(i) && !a) {
		i.shapeFlag & 512 && i.type.__asyncResolved && i.component.subTree.component && qn(e, t, n, i.component.subTree);
		return;
	}
	let s = i.shapeFlag & 4 ? ga(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ H(g), b = g === r ? o : (e) => !Gn(h, e) && f(y, e), x = (e, t) => !(t && Gn(h, t));
	if (m != null && m !== d) {
		if (Jn(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ Vt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) tn(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ Vt(d);
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
					i(), Kn.delete(e);
				};
				t.id = -1, Kn.set(e, t), _i(t, n);
			} else Jn(e), i();
		}
	}
}
function Jn(e) {
	let t = Kn.get(e);
	t && (t.flags |= 8, Kn.delete(e));
}
se().requestIdleCallback, se().cancelIdleCallback;
var Yn = (e) => !!e.type.__asyncLoader, Xn = (e) => e.type.__isKeepAlive;
function Zn(e, t) {
	$n(e, "a", t);
}
function Qn(e, t) {
	$n(e, "da", t);
}
function $n(e, t, n = na) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (tr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Xn(e.parent.vnode) && er(r, t, n, e), e = e.parent;
	}
}
function er(e, t, n, r) {
	let i = tr(t, e, r, !0);
	cr(() => {
		u(r[t], i);
	}, n);
}
function tr(e, t, n = na, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ve();
			let i = oa(n), a = nn(t, n, e, r);
			return i(), He(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var nr = (e) => (t, n = na) => {
	(!la || e === "sp") && tr(e, (...e) => t(...e), n);
}, rr = nr("bm"), ir = nr("m"), ar = nr("bu"), or = nr("u"), sr = nr("bum"), cr = nr("um"), lr = nr("sp"), ur = nr("rtg"), dr = nr("rtc");
function fr(e, t = na) {
	tr("ec", e, t);
}
var pr = /* @__PURE__ */ Symbol.for("v-ndc");
function mr(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ Pt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ It(e), s = /* @__PURE__ */ Ft(e), e = $e(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Bt(zt(e[n])) : zt(e[n]) : e[n], n, void 0, a && a[n]);
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
function hr(e, t, n, r, i, a) {
	if (n ??= {}, Sn.ce || Sn.parent && Yn(Sn.parent) && Sn.parent.ce) {
		let e = a != null && n.key == null ? l({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), G(), zi(W, null, [Wi("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ni.length;
	G();
	let c;
	try {
		let i = o && gr(o(n)), s = n.key || a || i && i.key;
		c = zi(W, { key: (s && !y(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ni.length; e > s; e--) Fi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function gr(e) {
	return e.some((e) => !Bi(e) || !(e.type === ji || e.type === W && !gr(e.children))) ? e : null;
}
var _r = (e) => e ? ca(e) ? ga(e) : _r(e.parent) : null, vr = /* @__PURE__ */ l(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => _r(e.parent),
	$root: (e) => _r(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Dr(e),
	$forceUpdate: (e) => e.f ||= () => {
		hn(e.update);
	},
	$nextTick: (e) => e.n ||= pn.bind(e.proxy),
	$watch: (e) => Pn.bind(e)
}), yr = (e, t) => e !== r && !e.__isScriptSetup && f(e, t), br = {
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
			else if (yr(i, t)) return s[t] = 1, i[t];
			else if (a !== r && f(a, t)) return s[t] = 2, a[t];
			else if (f(o, t)) return s[t] = 3, o[t];
			else if (n !== r && f(n, t)) return s[t] = 4, n[t];
			else Sr && (s[t] = 0);
		}
		let u = vr[t], d, p;
		if (u) return t === "$attrs" && Xe(e.attrs, "get", ""), u(e);
		if ((d = c.__cssModules) && (d = d[t])) return d;
		if (n !== r && f(n, t)) return s[t] = 4, n[t];
		if (p = l.config.globalProperties, f(p, t)) return p[t];
	},
	set({ _: e }, t, n) {
		let { data: i, setupState: a, ctx: o } = e;
		return yr(a, t) ? (a[t] = n, !0) : i !== r && f(i, t) ? (i[t] = n, !0) : f(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(n[c] || e !== r && c[0] !== "$" && f(e, c) || yr(t, c) || f(o, c) || f(i, c) || f(vr, c) || f(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? f(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function xr(e) {
	return p(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Sr = !0;
function Cr(e) {
	let t = Dr(e), n = e.proxy, r = e.ctx;
	Sr = !1, t.beforeCreate && Tr(t.beforeCreate, e, "bc");
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: T, errorCaptured: E, serverPrefetch: D, expose: O, inheritAttrs: ne, components: k, directives: re, filters: ie } = t;
	if (u && wr(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ At(t));
	}
	if (Sr = !0, o) for (let e in o) {
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
	if (c) for (let e in c) Er(c[e], r, n, e);
	if (l) {
		let e = _(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			On(t, e[t]);
		});
	}
	d && Tr(d, e, "c");
	function A(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (A(rr, f), A(ir, m), A(ar, h), A(or, g), A(Zn, v), A(Qn, y), A(fr, E), A(dr, te), A(ur, T), A(sr, S), A(cr, w), A(lr, D), p(O)) {
		if (O.length) {
			let t = e.exposed ||= {};
			O.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === a && (e.render = ee), ne != null && (e.inheritAttrs = ne), k && (e.components = k), re && (e.directives = re), D && Wn(e);
}
function wr(e, t, n = a) {
	p(e) && (e = Mr(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? kn(r.from || n, r.default, !0) : kn(r.from || n) : kn(r), /* @__PURE__ */ Vt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Tr(e, t, n) {
	nn(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Er(e, t, n, r) {
	let i = r.includes(".") ? Fn(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && Mn(i, n);
	} else if (_(e)) Mn(i, e.bind(n));
	else if (b(e)) {
		if (p(e)) e.forEach((e) => Er(e, t, n, r));
		else {
			let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
			_(r) && Mn(i, r, e);
		}
	}
}
function Dr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Or(c, e, o, !0)), Or(c, t, o)), b(t) && a.set(t, c), c;
}
function Or(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Or(e, a, n, !0), i && i.forEach((t) => Or(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = kr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var kr = {
	data: Ar,
	props: Fr,
	emits: Fr,
	methods: Pr,
	computed: Pr,
	beforeCreate: Nr,
	created: Nr,
	beforeMount: Nr,
	mounted: Nr,
	beforeUpdate: Nr,
	updated: Nr,
	beforeDestroy: Nr,
	beforeUnmount: Nr,
	destroyed: Nr,
	unmounted: Nr,
	activated: Nr,
	deactivated: Nr,
	errorCaptured: Nr,
	serverPrefetch: Nr,
	components: Pr,
	directives: Pr,
	watch: Ir,
	provide: Ar,
	inject: jr
};
function Ar(e, t) {
	return t ? e ? function() {
		return l(_(e) ? e.call(this, this) : e, _(t) ? t.call(this, this) : t);
	} : t : e;
}
function jr(e, t) {
	return Pr(Mr(e), Mr(t));
}
function Mr(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Nr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Pr(e, t) {
	return e ? l(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Fr(e, t) {
	return e ? p(e) && p(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : l(/* @__PURE__ */ Object.create(null), xr(e), xr(t ?? {})) : t;
}
function Ir(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = l(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Nr(e[r], t[r]);
	return n;
}
function Lr() {
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
var Rr = 0;
function zr(e, t) {
	return function(n, r = null) {
		_(n) || (n = l({}, n)), r != null && !b(r) && (r = null);
		let i = Lr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Rr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: va,
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
					let u = c._ceVNode || Wi(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, ga(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (nn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Br;
				Br = c;
				try {
					return e();
				} finally {
					Br = t;
				}
			}
		};
		return c;
	};
}
var Br = null, Vr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${k(t)}Modifiers`];
function Hr(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && Vr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = a.map(j)));
	let c, l = i[c = ie(t)] || i[c = ie(O(t))];
	!l && o && (l = i[c = ie(k(t))]), l && nn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, nn(u, e, 6, a);
	}
}
var Ur = /* @__PURE__ */ new WeakMap();
function Wr(e, t, n = !1) {
	let r = n ? Ur : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (!_(e)) {
		let r = (e) => {
			let n = Wr(e, t, !0);
			n && (s = !0, l(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (b(e) && r.set(e, null), null) : (p(a) ? a.forEach((e) => o[e] = null) : l(o, a), b(e) && r.set(e, o), o);
}
function Gr(e, t) {
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, k(t)) || f(e, t));
}
function Kr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = wn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ji(u.call(t, e, d, f, m, p, h)), y = s;
		} else {
			let e = t;
			v = Ji(e.length > 1 ? e(f, {
				attrs: s,
				slots: o,
				emit: l
			}) : e(f, null)), y = t.props ? s : qr(s);
		}
	} catch (t) {
		Ni.length = 0, rn(t, e, 1), v = Wi(ji);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = Jr(y, a)), b = qi(b, y, !1, !0));
	}
	return n.dirs && (b = qi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Vn(Ln(b.type) && Bn(b) || b, n.transition), v = b, wn(_), v;
}
var qr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || s(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Jr = (e, t) => {
	let n = {};
	for (let r in e) (!c(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Yr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Xr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Zr(o, r, n) && !Gr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Xr(r, o, l) : !!o;
	return !1;
}
function Xr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Zr(t, e, a) && !Gr(n, a)) return !0;
	}
	return !1;
}
function Zr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && b(r) && b(i) ? !ye(r, i) : r !== i;
}
function Qr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var $r = {}, ei = () => Object.create($r), ti = (e) => Object.getPrototypeOf(e) === $r;
function ni(e, t, n, r = !1) {
	let i = {}, a = ei();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ii(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ jt(i) : e.type.props ? i : a, e.attrs = a;
}
function ri(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ H(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Gr(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (f(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = O(o);
						i[t] = ai(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ii(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = k(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ai(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && Ze(e.attrs, "set", "");
}
function ii(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (T(r)) continue;
		let l = t[r], u;
		a && f(a, u = O(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Gr(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ H(n), i = c || r;
		for (let r = 0; r < o.length; r++) {
			let s = o[r];
			n[s] = ai(a, t, s, i[s], e, !f(i, s));
		}
	}
	return s;
}
function ai(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = f(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && _(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = oa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === k(n)) && (r = !0));
	}
	return r;
}
var oi = /* @__PURE__ */ new WeakMap();
function si(e, t, n = !1) {
	let a = n ? oi : t.propsCache, o = a.get(e);
	if (o) return o;
	let s = e.props, c = {}, u = [], d = !1;
	if (!_(e)) {
		let r = (e) => {
			d = !0;
			let [n, r] = si(e, t, !0);
			l(c, n), r && u.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!s && !d) return b(e) && a.set(e, i), i;
	if (p(s)) for (let e = 0; e < s.length; e++) {
		let t = O(s[e]);
		ci(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = O(e);
		if (ci(t)) {
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
function ci(e) {
	return e[0] !== "$" && !T(e);
}
var li = (e) => e === "_" || e === "_ctx" || e === "$stable", ui = (e) => p(e) ? e.map(Ji) : [Ji(e)], di = (e, t, n) => {
	if (t._n) return t;
	let r = Tn((...e) => ui(t(...e)), n);
	return r._c = !1, r;
}, fi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (li(n)) continue;
		let i = e[n];
		if (_(i)) t[n] = di(n, i, r);
		else if (i != null) {
			let e = ui(i);
			t[n] = () => e;
		}
	}
}, pi = (e, t) => {
	let n = ui(t);
	e.slots.default = () => n;
}, mi = (e, t, n) => {
	for (let r in t) (n || !li(r)) && (e[r] = t[r]);
}, hi = (e, t, n) => {
	let r = e.slots = ei();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (mi(r, t, n), n && oe(r, "_", e, !0)) : fi(t, r);
	} else t && pi(e, t);
}, gi = (e, t, n) => {
	let { vnode: i, slots: a } = e, o = !0, s = r;
	if (i.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? o = !1 : mi(a, t, n) : (o = !t.$stable, fi(t, a)), s = t;
	} else t && (pi(e, t), s = { default: 1 });
	if (o) for (let e in a) !li(e) && s[e] == null && delete a[e];
}, _i = ki;
function vi(e) {
	return yi(e);
}
function yi(e, t) {
	let n = se();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Vi(e, t) && (r = me(e), le(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === i && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Ai:
				y(e, t, n, r);
				break;
			case ji:
				b(e, t, n, r);
				break;
			case Mi:
				e ?? x(t, n, r, s);
				break;
			case W:
				k(e, t, n, r, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, a, o, s, c, l) : f & 6 ? re(e, t, n, r, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, a, o, s, c, l, _e);
		}
		d != null && a ? qn(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && qn(e.ref, null, o, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ee(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), D(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, bi(e, a), s, u), _ && Dn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Qi(f, r, e);
		}
		_ && Dn(e, null, r, "beforeMount");
		let v = Si(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && _i(() => {
			try {
				f && Qi(f, r, e), v && g.enter(d), _ && Dn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Oi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Yi(e[l]) : Ji(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && xi(n, !1), (g = h.onVnodeBeforeUpdate) && Qi(g, n, t, e), f && Dn(t, e, n, "beforeUpdate"), n && xi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, n, i, bi(t, a), o) : s || M(e, t, l, null, n, i, bi(t, a), o, !1), u > 0) {
			if (u & 16) ne(l, m, h, n, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], i = m[r], o = h[r];
					(o !== i || r === "value") && c(l, r, i, o, a, n);
				}
			}
			u & 1 && e.children !== t.children && p(l, t.children);
		} else !s && d == null && ne(l, m, h, n, a);
		((g = h.onVnodeUpdated) || f) && _i(() => {
			g && Qi(g, n, t, e), f && Dn(t, e, n, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === W || !Vi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, i, a) => {
		if (t !== n) {
			if (t !== r) for (let r in t) !T(r) && !(r in n) && c(e, r, t[r], null, a, i);
			for (let r in n) {
				if (T(r)) continue;
				let o = n[r], s = t[r];
				o !== s && r !== "value" && c(e, r, s, o, a, i);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, k = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Ci(e, t, !0)) : M(e, t, n, f, i, a, s, c, l);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ie(t, n, r, i, a, o, c) : A(e, t, c);
	}, ie = (e, t, n, r, i, a, o) => {
		let s = e.component = ta(e, r, i);
		if (Xn(e) && (s.ctx.renderer = _e), ua(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, oe, o), !e.el) {
				let r = s.subTree = Wi(ji);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else oe(s, e, t, n, i, a, o);
	}, A = (e, t, n) => {
		let r = t.component = e.component;
		if (Yr(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, j(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, oe = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ti(e);
					if (n) {
						t && (t.el = c.el, j(e, t, o)), n.asyncDep.then(() => {
							_i(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				xi(e, !1), t ? (t.el = c.el, j(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Qi(d, s, t, c), xi(e, !0);
				let f = Kr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), me(p), e, i, a), t.el = f.el, u === null && Qr(e, f.el), r && _i(r, i), (d = t.props && t.props.onVnodeUpdated) && _i(() => Qi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Yn(t);
				if (xi(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && Qi(o, d, t), xi(e, !0), s && ye) {
					let t = () => {
						e.subTree = Kr(e), ye(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Kr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && _i(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					_i(() => Qi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Yn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && _i(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => hn(u), xi(e, !0), l();
	}, j = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ri(e, t.props, r, n), gi(e, t.children, n), Ve(), vn(e), He();
	}, M = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				ce(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				N(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && pe(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? ce(l, d, n, r, i, a, o, s, c) : pe(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, N = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? Yi(t[p]) : Ji(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? pe(e, a, o, !0, !1, f) : E(t, n, r, a, o, s, c, l, f);
	}, ce = (e, t, n, r, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let r = e[u], i = t[u] = l ? Yi(t[u]) : Ji(t[u]);
			if (Vi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let r = e[f], i = t[p] = l ? Yi(t[p]) : Ji(t[p]);
			if (Vi(r, i)) v(r, i, n, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, i = e < d ? t[e].el : r;
				for (; u <= p;) v(null, t[u] = l ? Yi(t[u]) : Ji(t[u]), n, i, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) le(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Yi(t[u]) : Ji(t[u]);
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
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Vi(r, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? le(r, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(r, t[i], n, null, a, o, s, c, l), y++);
			}
			let w = x ? wi(C) : i;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, i = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Di(f) : r;
				C[u] === 0 ? v(null, i, n, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? P(i, n, p, 2) : _--);
			}
		}
	}, P = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			P(e.component.subTree, t, n, r);
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
			for (let e = 0; e < u.length; e++) P(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Mi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Rn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), _i(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Rn];
					a._isLeaving && a[Rn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, le = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), qn(s, null, n, e, !0), He()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Yn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Qi(_, t, e), u & 6) fe(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Dn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, _e, r) : l && !l.hasOnce && (a !== W || d > 0 && d & 64) ? pe(l, t, n, !1, !0) : (a === W && d & 384 || !i && u & 16) && pe(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && _i(() => {
			_ && Qi(_, t, e), h && Dn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === W) {
			de(n, r);
			return;
		}
		if (t === Mi) {
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
		Ei(c), Ei(l), r && ae(r), i.stop(), a ? (a.flags |= 8, le(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, le(o, e, t, n)), s && _i(s, t), _i(() => {
			e.isUnmounted = !0;
		}, t);
	}, pe = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) le(e[o], t, n, r, i);
	}, me = (e) => {
		if (e.shapeFlag & 6) return me(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[In];
		return n ? h(n) : t;
	}, he = !1, ge = (e, t, n) => {
		let r;
		e == null ? t._vnode && (le(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, he ||= (he = !0, vn(r), yn(), !1);
	}, _e = {
		p: v,
		um: le,
		m: P,
		r: ue,
		mt: ie,
		mc: E,
		pc: M,
		pbc: O,
		n: me,
		o: e
	}, ve, ye;
	return t && ([ve, ye] = t(_e)), {
		render: ge,
		hydrate: ve,
		createApp: zr(ge, ve)
	};
}
function bi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function xi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Si(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ci(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (p(r) && p(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Yi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ci(t, a)), a.type === Ai && (a.patchFlag === -1 && (a = i[e] = Yi(a)), a.el = t.el), a.type === ji && !a.el && (a.el = t.el);
	}
}
function wi(e) {
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
function Ti(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ti(t);
}
function Ei(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Di(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Di(t.subTree) : null;
}
var Oi = (e) => e.__isSuspense;
function ki(e, t) {
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : _n(e);
}
var W = /* @__PURE__ */ Symbol.for("v-fgt"), Ai = /* @__PURE__ */ Symbol.for("v-txt"), ji = /* @__PURE__ */ Symbol.for("v-cmt"), Mi = /* @__PURE__ */ Symbol.for("v-stc"), Ni = [], Pi = null;
function G(e = !1) {
	Ni.push(Pi = e ? null : []);
}
function Fi() {
	Ni.pop(), Pi = Ni[Ni.length - 1] || null;
}
var Ii = 1;
function Li(e, t = !1) {
	Ii += e, e < 0 && Pi && t && (Pi.hasOnce = !0);
}
function Ri(e) {
	return e.dynamicChildren = Ii > 0 ? Pi || i : null, Fi(), Ii > 0 && Pi && Pi.push(e), e;
}
function K(e, t, n, r, i, a) {
	return Ri(q(e, t, n, r, i, a, !0));
}
function zi(e, t, n, r, i) {
	return Ri(Wi(e, t, n, r, i, !0));
}
function Bi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Vi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Hi = ({ key: e }) => e ?? null, Ui = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ Vt(e) || _(e) ? {
	i: Sn,
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
		key: t && Hi(t),
		ref: t && Ui(t),
		scopeId: Cn,
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
		ctx: Sn
	};
	return s ? (Xi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Ii > 0 && !o && Pi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Pi.push(c), c;
}
var Wi = Gi;
function Gi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === pr) && (e = ji), Bi(e)) {
		let r = qi(e, t, !0);
		return n && Xi(r, n), Ii > 0 && !a && Pi && (r.shapeFlag & 6 ? Pi[Pi.indexOf(e)] = r : Pi.push(r)), r.patchFlag = -2, r;
	}
	if (_a(e) && (e = e.__vccOpts), t) {
		t = Ki(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = de(e)), b(n) && (/* @__PURE__ */ Lt(n) && !p(n) && (n = l({}, n)), t.style = N(n));
	}
	let o = v(e) ? 1 : Oi(e) ? 128 : Ln(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return q(e, t, n, r, i, o, a, !0);
}
function Ki(e) {
	return e ? /* @__PURE__ */ Lt(e) || ti(e) ? l({}, e) : e : null;
}
function qi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Zi(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Hi(l),
		ref: t && t.ref ? n && a ? p(a) ? a.concat(Ui(t)) : [a, Ui(t)] : Ui(t) : a,
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
		ssContent: e.ssContent && qi(e.ssContent),
		ssFallback: e.ssFallback && qi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Vn(u, c.clone(u)), u;
}
function J(e = " ", t = 0) {
	return Wi(Ai, null, e, t);
}
function Y(e = "", t = !1) {
	return t ? (G(), zi(ji, null, e)) : Wi(ji, null, e);
}
function Ji(e) {
	return e == null || typeof e == "boolean" ? Wi(ji) : p(e) ? Wi(W, null, e.slice()) : Bi(e) ? Yi(e) : Wi(Ai, null, String(e));
}
function Yi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : qi(e);
}
function Xi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (p(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Xi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !ti(t) ? t._ctx = Sn : r === 3 && Sn && (Sn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (_(t)) {
		if (r & 65) {
			Xi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Sn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [J(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Zi(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = de([t.class, r.class]));
		else if (e === "style") t.style = N([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Qi(e, t, n, r = null) {
	nn(e, t, 7, [n, r]);
}
var $i = Lr(), ea = 0;
function ta(e, t, n) {
	let i = e.type, a = (t ? t.appContext : e.appContext) || $i, o = {
		uid: ea++,
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
		scope: new I(!0),
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
		propsOptions: si(i, a),
		emitsOptions: Wr(i, a),
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
	return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = Hr.bind(null, o), e.ce && e.ce(o), o;
}
var na = null, ra = () => na || Sn, ia, aa;
{
	let e = se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ia = t("__VUE_INSTANCE_SETTERS__", (e) => na = e), aa = t("__VUE_SSR_SETTERS__", (e) => la = e);
}
var oa = (e) => {
	let t = na;
	return ia(e), e.scope.on(), () => {
		e.scope.off(), ia(t);
	};
}, sa = () => {
	na && na.scope.off(), ia(null);
};
function ca(e) {
	return e.vnode.shapeFlag & 4;
}
var la = !1;
function ua(e, t = !1, n = !1) {
	t && aa(t);
	let { props: r, children: i } = e.vnode, a = ca(e);
	ni(e, r, a, t), hi(e, i, n || t);
	let o = a ? da(e, t) : void 0;
	return t && aa(!1), o;
}
function da(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, br);
	let { setup: r } = n;
	if (r) {
		Ve();
		let n = e.setupContext = r.length > 1 ? ha(e) : null, i = oa(e), a = tn(r, e, 0, [e.props, n]), o = x(a);
		if (He(), i(), (o || e.sp) && !Yn(e) && Wn(e), o) {
			if (a.then(sa, sa), t) return a.then((n) => {
				aa(!0);
				try {
					fa(e, n, t);
				} finally {
					aa(!1);
				}
			}).catch((t) => {
				rn(t, e, 0);
			});
			e.asyncDep = a;
		} else fa(e, a, t);
	} else pa(e, t);
}
function fa(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Kt(t)), pa(e, n);
}
function pa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || a;
	{
		let t = oa(e);
		Ve();
		try {
			Cr(e);
		} finally {
			He(), t();
		}
	}
}
var ma = { get(e, t) {
	return Xe(e, "get", ""), e[t];
} };
function ha(e) {
	return {
		attrs: new Proxy(e.attrs, ma),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ga(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Kt(Rt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in vr) return vr[n](e);
		},
		has(e, t) {
			return t in e || t in vr;
		}
	}) : e.proxy;
}
function _a(e) {
	return _(e) && "__vccOpts" in e;
}
var X = (e, t) => /* @__PURE__ */ Jt(e, t, la), va = "3.5.43", ya = void 0, ba = typeof window < "u" && window.trustedTypes;
if (ba) try {
	ya = /* @__PURE__ */ ba.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var xa = ya ? (e) => ya.createHTML(e) : (e) => e, Sa = "http://www.w3.org/2000/svg", Ca = "http://www.w3.org/1998/Math/MathML", wa = typeof document < "u" ? document : null, Ta = wa && /* @__PURE__ */ wa.createElement("template"), Ea = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? wa.createElementNS(Sa, e) : t === "mathml" ? wa.createElementNS(Ca, e) : n ? wa.createElement(e, { is: n }) : wa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => wa.createTextNode(e),
	createComment: (e) => wa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => wa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ta.innerHTML = xa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ta.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Da = /* @__PURE__ */ Symbol("_vtc");
function Oa(e, t, n) {
	let r = e[Da];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ka = /* @__PURE__ */ Symbol("_vod"), Aa = /* @__PURE__ */ Symbol("_vsh"), ja = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[ka] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Ma(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Ma(e, !0), r.enter(e)) : r.leave(e, () => {
			Ma(e, !1);
		}) : Ma(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Ma(e, t);
	}
};
function Ma(e, t) {
	e.style.display = t ? e[ka] : "none", e[Aa] = !t;
}
var Na = /* @__PURE__ */ Symbol(""), Pa = /(?:^|;)\s*display\s*:/;
function Fa(e, t, n) {
	let r = e.style, i = v(n), a = !1;
	if (n && !i) {
		if (t) {
			if (v(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? La(r, t, "");
			}
			else for (let e in t) n[e] ?? La(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? La(r, i, "") : Va(e, i, !v(t) && t ? t[i] : void 0, o) || La(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Na];
			e && (n += ";" + e), r.cssText = n, a = Pa.test(n);
		}
	} else t && e.removeAttribute("style");
	ka in e && (e[ka] = a ? r.display : "", e[Aa] && (r.display = "none"));
}
var Ia = /\s*!important$/;
function La(e, t, n) {
	if (p(n)) n.forEach((n) => La(e, t, n));
	else if (n ??= "", t.startsWith("--")) Ia.test(n) ? e.setProperty(t, n.replace(Ia, ""), "important") : e.setProperty(t, n);
	else {
		let r = Ba(e, t);
		Ia.test(n) ? e.setProperty(k(r), n.replace(Ia, ""), "important") : e[r] = n;
	}
}
var Ra = [
	"Webkit",
	"Moz",
	"ms"
], za = {};
function Ba(e, t) {
	let n = za[t];
	if (n) return n;
	let r = O(t);
	if (r !== "filter" && r in e) return za[t] = r;
	r = re(r);
	for (let n = 0; n < Ra.length; n++) {
		let i = Ra[n] + r;
		if (i in e) return za[t] = i;
	}
	return t;
}
function Va(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && v(r) && n === r;
}
var Ha = "http://www.w3.org/1999/xlink";
function Ua(e, t, n, r, i, a = pe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ha, t.slice(6, t.length)) : e.setAttributeNS(Ha, t, n) : n == null || a && !me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
}
function Wa(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? xa(n) : n);
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
function Ga(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ka(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var qa = /* @__PURE__ */ Symbol("_vei");
function Ja(e, t, n, r, i = null) {
	let a = e[qa] || (e[qa] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Za(t);
		r ? Ga(e, n, a[t] = to(r, i), s) : o && (Ka(e, n, o, s), a[t] = void 0);
	}
}
var Ya = /(Once|Passive|Capture)$/, Xa = /^on:?(?:Once|Passive|Capture)$/;
function Za(e) {
	let t, n;
	for (; (n = e.match(Ya)) && !Xa.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : k(e.slice(2)), t];
}
var Qa = 0, $a = /* @__PURE__ */ Promise.resolve(), eo = () => Qa ||= ($a.then(() => Qa = 0), Date.now());
function to(e, t) {
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
				e && nn(e, t, 5, a);
			}
		} else nn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = eo(), n;
}
var no = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, ro = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Oa(e, r, o) : t === "style" ? Fa(e, n, r) : s(t) ? c(t) || Ja(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : io(e, t, r, o)) ? (Wa(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ua(e, t, r, o, a, t !== "value")) : e._isVueCE && (ao(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? Wa(e, O(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ua(e, t, r, o));
};
function io(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && no(t) && _(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return no(t) && v(n) ? !1 : t in e;
}
function ao(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var oo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return p(t) ? (e) => ae(t, e) : t;
};
function so(e) {
	e.target.composing = !0;
}
function co(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var lo = /* @__PURE__ */ Symbol("_assign"), uo = /* @__PURE__ */ Symbol("_initialValue");
function fo(e, t, n) {
	return t && (e = e.trim()), n && (e = j(e)), e;
}
var po = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[uo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[uo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[lo] = oo(i);
		let a = r || i.props && i.props.type === "number";
		Ga(e, t ? "change" : "input", (t) => {
			t.target.composing || e[lo](fo(e.value, n, a));
		}), (n || a) && Ga(e, "change", () => {
			e.value = fo(e.value, n, a);
		}), t || (Ga(e, "compositionstart", so), Ga(e, "compositionend", co), Ga(e, "change", co));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[uo];
		delete e[uo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[lo](fo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[lo] = oo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? j(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, mo = {
	deep: !0,
	created(e, t, n) {
		e[lo] = oo(n), Ga(e, "change", () => {
			let t = e._modelValue, n = yo(e), r = e.checked, i = e[lo];
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
			} else i(bo(e, r));
		});
	},
	mounted: ho,
	beforeUpdate(e, t, n) {
		e[lo] = oo(n), ho(e, t, n);
	}
};
function ho(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (p(t)) i = be(t, r.props.value) > -1;
	else if (h(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ye(t, bo(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var go = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ga(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? j(yo(e)) : yo(e)), r = e.multiple, i = r ? h(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? p(i) ? t.slice() : t : i];
			try {
				e[lo](i);
			} finally {
				pn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[lo] = oo(r);
	},
	mounted(e, { value: t }) {
		vo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[lo] = oo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !_o(t, n[1], n[0])) && vo(e, t);
	}
};
function _o(e, t, n) {
	if (!n || p(e)) return ye(e, t);
	if (h(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function vo(e, t) {
	let n = e.multiple, r = p(t);
	if (!n || r || h(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = yo(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : be(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (ye(yo(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function yo(e) {
	return "_value" in e ? e._value : e.value;
}
function bo(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var xo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], So = {
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
	exact: (e, t) => xo.some((n) => e[`${n}Key`] && !t.includes(n))
}, Co = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = So[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, wo = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, To = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = k(n.key);
		if (t.some((e) => e === r || wo[e] === r)) return e(n);
	}));
}, Eo = /* @__PURE__ */ l({ patchProp: ro }, Ea), Do;
function Oo() {
	return Do ||= vi(Eo);
}
var ko = ((...e) => {
	let t = Oo().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = jo(e);
		if (!r) return;
		let i = t._component;
		!_(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ao(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ao(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function jo(e) {
	return v(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/lib/chat-gateway.ts
function Mo(e) {
	let t = e;
	if (!t || t.protocol !== "chathermes.chat.v2" || t.mode !== "native-retained" || t.admission !== !0 || typeof t.reviewed_source != "string" || !Array.isArray(t.operations) || !t.operations.every((e) => typeof e == "string") || !Array.isArray(t.blockers) || !t.blockers.every((e) => typeof e == "string") || !t.guarantees || t.guarantees.crash_safe_idempotency !== !1 || t.guarantees.lossless_snapshot_replay !== !1 || t.guarantees.offline_turn_lease !== !0 || ![
		"crash_safe_idempotency",
		"lossless_snapshot_replay",
		"offline_turn_lease"
	].every((e) => e in t.guarantees)) throw Error("Unsupported native chat contract");
	return t;
}
async function No(e, t) {
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
				s(Mo(t.result));
			} catch {
				s(void 0, /* @__PURE__ */ Error("Unsupported native chat contract"));
			}
		}, r.onerror = r.onclose = () => s(void 0, /* @__PURE__ */ Error("Native chat probe disconnected")), t?.aborted && c();
	});
}
//#endregion
//#region src/lib/sse.ts
async function* Po(e, t) {
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
var Fo = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, Io = /* @__PURE__ */ new Set(), Lo = /* @__PURE__ */ new Set(), Ro = (e, t) => JSON.stringify([e, t]), zo = "/api/plugins/chathermes";
function Bo(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/(?:messages|chat\/stream)|workspace\/runs\/[A-Za-z0-9_-]+(?:\/(?:stop|events))?|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/chat\/stream)?|v1\/(?:capabilities|models)|v1\/runs(?:\/[A-Za-z0-9_-]+(?:\/(?:stop|events(?:\?last_seq=-?\d+)?|approval|steer))?)?)$/.test(t)) throw Error("Invalid Hermes API path.");
	return zo + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function Vo(e, t, n = {}, r = "application/json") {
	let i = await fetch(Bo(e, t), {
		...n,
		headers: {
			...n.headers || {},
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
async function Ho(e, t, n = {}) {
	let r = await Vo(e, t, n);
	if (!r.ok) throw new Fo(r.status, `Request failed (${r.status})`);
	return r.json();
}
function Uo(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function Wo(e) {
	let t = Uo(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function Go(e) {
	return Wo(Uo(e)?.session ?? e);
}
function Ko(e) {
	let t = Uo(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(Wo),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function qo(e) {
	let t = Uo(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !Uo(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = Uo(t?.pagination);
	return {
		messages: n.map((e) => e.role === "user" && ["model_switch", "personality_switch"].includes(e.display_kind || "") ? {
			...e,
			role: "system"
		} : e),
		pagination: typeof r?.returned == "number" && typeof r.limit == "number" ? {
			returned: r.returned,
			limit: r.limit
		} : void 0
	};
}
var Z = {
	nativeChatCapabilities: No,
	isNative: (e) => Io.has(e),
	profiles: async () => {
		let e = await fetch(zo + "/profiles", {
			credentials: "same-origin",
			cache: "no-store"
		});
		if (!e.ok) throw new Fo(e.status, "Could not load profiles");
		return e.json();
	},
	scheduled: (e, t) => Ho(e, "/scheduled", { signal: t }),
	scheduledRuns: (e, t, n = 0, r) => Ho(e, `/scheduled/runs?job_id=${encodeURIComponent(t)}&offset=${n}`, { signal: r }),
	scheduledOutput: (e, t, n, r) => Ho(e, `/scheduled/output?job_id=${encodeURIComponent(t)}&run_id=${encodeURIComponent(n)}`, { signal: r }),
	projects: (e, t) => Ho(e, "/projects", { signal: t }),
	project: async (e, t, n) => {
		let r = await Ho(e, `/projects/detail?project_id=${encodeURIComponent(t)}`, { signal: n });
		if (r.project?.id !== t || typeof r.project.label != "string") throw Error("Invalid Hermes Project response");
		return r.project;
	},
	projectInstructions: (e, t, n) => Ho(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, { signal: n }),
	saveProjectInstructions: (e, t, n) => Ho(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify(n)
	}),
	projectManage: (e, t, n) => Ho(e, "/projects/manage", {
		method: "POST",
		body: JSON.stringify({
			action: t,
			...n
		})
	}),
	isWorkspace(e, t) {
		return Lo.has(Ro(e, t));
	},
	workspace(e, t) {
		Lo.add(Ro(e, t));
	},
	projectCreate: async (e, t) => {
		let n = Go(await Ho(e, `/projects/session?project_id=${encodeURIComponent(t)}`, {
			method: "POST",
			body: "{}"
		}));
		return Lo.add(Ro(e, n.id)), n;
	},
	projectEvents(e, t, n) {
		let r = new EventSource(zo + "/project-events?profile=" + encodeURIComponent(e || "default") + (n ? "&session=" + encodeURIComponent(n) : ""), { withCredentials: !0 });
		return r.addEventListener("refresh", t), () => r.close();
	},
	models: (e) => Ho(e, "/v1/models"),
	modelOptions: (e) => Ho(e, "/api/model/options"),
	async upload(e, t) {
		let n = await fetch(zo + "/uploads" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "POST",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t)
		});
		if (!n.ok) throw new Fo(n.status, `Upload failed (${n.status})`);
		return n.json();
	},
	capabilities: async (e, t) => {
		let n = await Ho(e, "/v1/capabilities", { signal: t });
		return n.features?.native_chat === !0 ? Io.add(e) : Io.delete(e), n;
	},
	sessions: async (e, t = 0, n) => Ko(await Ho(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => {
		let n = Go(await Ho(e, Io.has(e) ? "/chat/sessions" : "/api/sessions", {
			method: "POST",
			body: "{}",
			signal: t
		}));
		return Io.has(e) && Lo.add(Ro(e, n.id)), n;
	},
	session: async (e, t, n) => {
		let r = Go(await Ho(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n }));
		return (r.cwd || r.source === "desktop") && Lo.add(Ro(e, t)), r;
	},
	rename: async (e, t, n, r) => Go(await Ho(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	async messages(e, t, n) {
		let r = [];
		for (let i = 0;;) {
			let a;
			try {
				a = qo(await Ho(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${i}&order=oldest&inline_images=false`, { signal: n }));
			} catch (r) {
				if (i === 0 && r instanceof Fo && r.status === 404 && Lo.has(Ro(e, t))) return qo(await Ho(e, `/workspace/sessions/${encodeURIComponent(t)}/messages`, { signal: n })).messages;
				throw r;
			}
			if (r.push(...a.messages), !a.pagination || a.pagination.returned < a.pagination.limit || !a.messages.length) return r;
			i += a.messages.length;
		}
	},
	async *stream(e, t, n, r, i, a) {
		let o = await Vo(e, `/${Lo.has(Ro(e, t)) ? "workspace" : "api"}/sessions/${encodeURIComponent(t)}/chat/stream`, {
			method: "POST",
			body: JSON.stringify({
				input: n,
				...i ? {
					model: i,
					...a ? { provider: a } : {},
					require_model_lock: !0
				} : {}
			}),
			signal: r
		}, "text/event-stream");
		if (!o.ok) throw new Fo(o.status, `Send failed (${o.status})`);
		if (!o.body) throw Error("Stream unavailable");
		yield* Po(o.body, r);
	},
	async startRun(e, t, n, r, i, a) {
		let o = await Ho(e, "/v1/runs", {
			method: "POST",
			body: JSON.stringify({
				session_id: t,
				input: typeof n == "string" ? n : [{
					role: "user",
					content: n
				}],
				...r ? {
					model: r,
					...i ? { provider: i } : {},
					require_model_lock: !0
				} : {}
			}),
			...a ? { headers: { "Idempotency-Key": a } } : {}
		});
		if (!/^[A-Za-z0-9_-]+$/.test(o.run_id || "")) throw Error("Invalid Hermes run response");
		return o;
	},
	approve: async (e, t, n, r) => Ho(e, `/v1/runs/${encodeURIComponent(t)}/approval`, {
		method: "POST",
		body: JSON.stringify({
			choice: n,
			...r ? { request_id: r } : {}
		})
	}),
	steer: async (e, t, n) => Ho(e, `/v1/runs/${encodeURIComponent(t)}/steer`, {
		method: "POST",
		body: JSON.stringify({ input: n })
	}),
	runStatus: async (e, t, n) => Ho(e, t.startsWith("workspace-") ? `/workspace/runs/${encodeURIComponent(t.slice(10))}` : `/v1/runs/${encodeURIComponent(t)}`, { signal: n }),
	async *runEvents(e, t, n, r = -1) {
		let i = await Vo(e, t.startsWith("workspace-") ? `/workspace/runs/${encodeURIComponent(t.slice(10))}/events` : `/v1/runs/${encodeURIComponent(t)}/events?last_seq=${r}`, { signal: n }, "text/event-stream");
		if (!i.ok) throw new Fo(i.status, `Run events failed (${i.status})`);
		if (!i.body) throw Error("Stream unavailable");
		for await (let e of Po(i.body, n)) {
			let t = Yo(e);
			yield {
				...e,
				event: typeof t.event == "string" ? t.event : e.event
			};
		}
	},
	stop: async (e, t) => Ho(e, t.startsWith("workspace-") ? `/workspace/runs/${encodeURIComponent(t.slice(10))}/stop` : `/v1/runs/${encodeURIComponent(t)}/stop`, { method: "POST" })
};
function Jo(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
function Yo(e) {
	try {
		let t = JSON.parse(e.data);
		return t && typeof t == "object" ? t : {};
	} catch {
		return {};
	}
}
//#endregion
//#region src/lib/assistant-turn.ts
var Xo = (e) => typeof e == "string" ? e : "", Zo = (e) => typeof e == "string" ? e : e == null ? "" : JSON.stringify(e, null, 2);
function Qo(e, t = !1) {
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
var $o = () => ({
	blocks: [],
	seen: /* @__PURE__ */ new Set(),
	sequence: 0
});
function es(e) {
	for (let t of e.blocks) t.kind !== "text" && (t.complete = !0, t.kind === "thinking" && (t.title = "Thought"), (t.state === "running" || t.state === "pending") && (t.state = "completed"));
}
function ts(e) {
	for (let t of e.blocks) t.kind === "thinking" && (t.complete = !0, t.state = "completed", t.title = "Thought");
}
function ns(e, t) {
	if (t.key && e.seen.has(t.key)) return;
	t.key && e.seen.add(t.key);
	let { type: n, data: r } = t, i = Xo(r.delta) || Xo(r.text) || Xo(r.preview), a = Xo(r.tool_call_id) || Xo(r.tool_id), o = Xo(r.tool_name) || Xo(r.name) || Xo(r.tool), s = () => `block-${++e.sequence}`;
	if (n === "text" || n === "text.snapshot" || n === "text.completed") {
		ts(e);
		let t = n === "text.completed" ? Xo(r.content) : i;
		if (!t) return;
		let a = e.blocks.at(-1);
		if (n === "text.snapshot") {
			let n = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("");
			if (n === t || n.startsWith(t)) return;
			if (t.startsWith(n)) {
				ns(e, {
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
			state: "running"
		}, e.blocks.push(t)), t.content += i;
	} else if (n === "reasoning.completed") ts(e);
	else if (n.startsWith("tool.")) {
		ts(e);
		let t = e.blocks.find((e) => e.kind === "tool" && a && e.id === a);
		if (!t && !a && (t = [...e.blocks].reverse().find((e) => e.kind === "tool" && !e.complete && (!o || e.toolName === o))), t || (t = {
			id: a || s(),
			kind: "tool",
			title: Qo(o),
			toolName: o,
			content: "",
			complete: !1,
			state: "pending",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), n === "tool.started" && t.complete) return;
		n === "tool.started" ? (t.state = "running", t.content = Zo(r.args) || i || t.content) : n === "tool.updated" ? (t.complete || (t.state = "running"), t.output = (t.output || "") + i) : (t.complete = !0, t.state = n === "tool.failed" ? "failed" : "completed", t.title = Qo(t.toolName || o, !0), t.output = Zo(r.output ?? r.result ?? r.error) || t.output || i, t.content = Zo(r.args) || t.content, t.duration = typeof r.duration_s == "number" ? r.duration_s : t.startedAt ? Math.max(0, ((typeof r.ts == "number" ? r.ts * 1e3 : Date.now()) - t.startedAt) / 1e3) : void 0);
	} else {
		if (n === "failed") for (let t of e.blocks) t.kind === "tool" && !t.complete && (t.state = "failed", t.output ||= "The response ended before this tool completed.");
		es(e);
	}
}
function rs(e) {
	let t = $o();
	for (let n of e) if (n.role === "assistant") {
		let e = n.reasoning_content || n.reasoning;
		e && (ns(t, {
			type: "reasoning",
			data: { delta: e }
		}), ts(t));
		let r = Jo(n.content);
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
		for (let e of n.tool_calls || []) ns(t, {
			type: "tool.started",
			data: {
				tool_call_id: e.id,
				tool_name: e.function?.name,
				args: e.function?.arguments,
				persisted: !0
			}
		});
	} else if (n.role === "tool") {
		let e = Jo(n.content), r = !1;
		try {
			let t = JSON.parse(e);
			r = t?.is_error === !0 || t?.success === !1 || !!t?.error || typeof t?.exit_code == "number" && t.exit_code !== 0;
		} catch {}
		ns(t, {
			type: r ? "tool.failed" : "tool.completed",
			data: {
				tool_call_id: n.tool_call_id,
				tool_name: n.tool_name,
				output: e,
				persisted: !0
			}
		});
	}
	return ts(t), t.blocks;
}
function is(e, t, n) {
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
function as(e, t, n) {
	let r = e;
	if (t !== "thinking.delta" && t !== "tool.generating") {
		if (t === "message.interim") n.already_streamed || ns(e, {
			type: "text",
			data: { delta: Xo(n.text) }
		}), r.sealedText = e.blocks.at(-1)?.id;
		else if (t === "message.delta" || t === "message.complete") {
			if (r.sealedText && r.sealedText === e.blocks.at(-1)?.id && Xo(n.text) && e.blocks.push({
				id: `block-${++e.sequence}`,
				kind: "text",
				content: ""
			}), ns(e, {
				type: t === "message.delta" ? "text" : "text.completed",
				data: t === "message.delta" ? { delta: n.text } : { content: n.text }
			}), t === "message.complete") {
				for (let t of e.blocks) t.kind !== "text" && !t.delegated && (t.complete = !0, (t.state === "running" || t.state === "pending") && (t.state = n.status === "complete" ? "completed" : "failed"));
				n.reasoning && !e.blocks.some((e) => e.kind === "thinking") && ns(e, {
					type: "reasoning",
					data: { text: n.reasoning }
				}), ts(e);
			}
		} else if (t === "reasoning.delta" || t === "reasoning.available") {
			if (t === "reasoning.available") {
				let t = [...e.blocks].reverse().find((e) => e.kind === "thinking");
				if (t && t.kind === "thinking") {
					t.content = Xo(n.text), t.complete = !1;
					return;
				}
			}
			ns(e, {
				type: "reasoning",
				data: { delta: n.text }
			});
		} else if (t === "tool.start" || t === "tool.complete" || t === "tool.progress") {
			let r = n.result, i = n.is_error || n.error || r && typeof r == "object" && (r.error || r.success === !1 || typeof r.exit_code == "number" && r.exit_code !== 0);
			ns(e, {
				type: t === "tool.start" ? "tool.started" : t === "tool.progress" ? "tool.updated" : i ? "tool.failed" : "tool.completed",
				data: {
					...n,
					tool_call_id: n.tool_id,
					tool_name: n.name,
					delta: n.text || n.delta || n.preview,
					output: n.result_text ?? n.result
				}
			});
		} else if (t.startsWith("subagent.")) {
			let r = Xo(n.subagent_id) || Xo(n.child_session_id) || (n.delegation_id ? `${n.delegation_id}:${n.task_index}` : "");
			if (!r) return;
			ns(e, {
				type: [
					"subagent.complete",
					"subagent.failed",
					"subagent.cancelled"
				].includes(t) ? t === "subagent.complete" && n.status === "completed" ? "tool.completed" : "tool.failed" : "tool.updated",
				data: {
					tool_call_id: "subagent-" + r,
					tool_name: Xo(n.name) || "Delegated task",
					delta: Xo(n.text),
					output: n.summary ?? n.text ?? n.output_tail
				}
			});
			let i = e.blocks.find((e) => e.id === "subagent-" + r);
			i && i.kind === "tool" && (i.delegated = !0);
		}
	}
}
//#endregion
//#region src/vendor/hermes/json-rpc-channel.ts
var os = (e) => typeof e.id == "string" && typeof e.method == "string" && e.method !== "event", ss = class extends Error {
	code;
	data;
	constructor(e, t) {
		super(e), this.name = "JsonRpcGatewayError", this.code = t?.code, this.data = t?.data;
	}
}, cs = -32601, ls = -32603, us = 4404;
function ds(e, t = "Hermes RPC failed") {
	let n = e && typeof e == "object" ? e : {};
	return new ss(typeof n.message == "string" && n.message ? n.message : t, {
		code: typeof n.code == "number" ? n.code : void 0,
		data: n.data
	});
}
var fs = 12e4, ps = 8;
new TextDecoder();
var ms = (e) => {
	e?.unref?.();
}, hs = class {
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
			requestTimeoutMs: e.requestTimeoutMs ?? fs,
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
			}, n), this.options.unrefTimers && ms(u.timer)), r && (c = () => {
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
					code: us,
					message: e
				} });
			}
		};
		for (let r of this.requestHandlers) {
			let i;
			try {
				i = r(o);
			} catch (r) {
				return o.fail(ls, `server request handler crashed: ${t}`), this.options.onRequestHandlerError?.(r instanceof Error ? r : Error(String(r)), {
					id: e,
					method: t,
					params: n
				}), !1;
			}
			if (i !== !1) return !0;
		}
		return o.fail(cs, `no handler for server request: ${t}`), this.options.onUnhandledRequest?.({
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
		if (this.options.heartbeatLiveness === "any-inbound" && (this.lastLivenessAt = Date.now()), os(t)) {
			let e = t.params && typeof t.params == "object" ? t.params : {};
			return this.deliverRequest(t.id, t.method, e), t;
		}
		if (t.id !== void 0 && t.id !== null) {
			if (typeof t.id == "string" && this.outstandingPings.delete(t.id)) return this.lastLivenessAt = Date.now(), t;
			let e = this.pending.get(t.id);
			return e && (this.lastLivenessAt = Date.now(), this.clearPending(t.id), t.error ? e.reject(ds(t.error)) : (this.deliverOpenRequests(t.result), e.resolve(t.result))), t;
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
			this.outstandingPings.add(t), this.outstandingPings.size > ps && this.outstandingPings.delete(this.outstandingPings.values().next().value);
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
		}, this.options.heartbeatIntervalMs), this.options.unrefTimers && ms(this.heartbeatTimer));
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
}, gs = 300, _s = 15e3, vs = 32;
function ys(e, t = {}) {
	let n = t.baseDelayMs ?? gs, r = t.capMs ?? _s, i = Math.min(r, n * 2 ** Math.min(Math.max(0, Math.trunc(e)), vs));
	return t.jitter === !1 ? i : Math.random() * i;
}
//#endregion
//#region src/lib/native-chat.ts
var bs = class extends Error {
	outcome;
	constructor(e, t = "unknown") {
		super(e), this.outcome = t;
	}
}, xs = class {
	ws;
	channel;
	opening;
	detached = !1;
	holding = !0;
	held = [];
	offset = 0;
	runtime = "";
	reconnect;
	attempts = 0;
	hooks;
	profile;
	stored;
	constructor(e, t, n) {
		this.profile = e, this.stored = t, this.hooks = n, this.channel = new hs({
			requestIdPrefix: "c-",
			heartbeatLiveness: "any-inbound",
			requestTimeoutMs: 95e3,
			onHeartbeatFailure: () => {
				this.ws?.close(), this.disconnected();
			}
		}), this.channel.onRequest((e) => ["approval", "clarify"].includes(e.method) ? (this.requestEntries.set(e.id, {
			id: e.id,
			method: e.method,
			params: e.params
		}), this.holding || this.hooks.requests([...this.requestEntries.values()]), !0) : !1);
	}
	requestEntries = /* @__PURE__ */ new Map();
	async ensure() {
		if (this.detached) throw new bs("Viewer detached");
		if (this.opening) return this.opening;
		if (this.ws?.readyState !== WebSocket.OPEN || this.holding) {
			clearTimeout(this.reconnect), this.opening = this.open();
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
			redirect: "manual"
		});
		if (!e.ok || e.type === "opaqueredirect") throw new bs("Dashboard sign-in required", "rejected");
		let { ticket: t } = await e.json();
		if (typeof t != "string" || !t || t.length > 1024) throw new bs("Invalid dashboard ticket", "rejected");
		if (this.detached) throw new bs("Viewer detached");
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
				r.close(), this.disconnected("Native data unavailable; reconnecting without resending.");
			}
		}, await new Promise((e, t) => {
			let n = setTimeout(() => {
				r.close(), t(new bs("Native viewer connection timed out"));
			}, 1e4);
			r.onopen = () => {
				clearTimeout(n), this.channel.attach({ send: (e) => r.send(e) }), e();
			}, r.onerror = r.onclose = () => {
				clearTimeout(n), t(new bs("Native viewer disconnected"));
			};
		}), r.onclose = r.onerror = () => {
			this.ws === r && this.disconnected();
		}, this.hooks.connection("recovering");
		let i = await this.rpc("chat.attach", { session_id: this.stored });
		if (this.detached || this.ws !== r) throw new bs("Viewer detached");
		this.runtime = i.session_id, this.offset = i.recovery.complete ? i.recovery.start || 0 : i.recovery.through, this.hooks.snapshot(i);
		let a = this.offset;
		for (; a < i.recovery.through;) {
			let e = await this.rpc("chat.replay", {
				offset: a,
				through: i.recovery.through
			});
			if (this.detached || this.ws !== r || e.epoch !== i.recovery.epoch || e.offset <= a) throw new bs("Recovery generation changed");
			for (let t of e.frames) this.apply(t);
			a = e.offset;
		}
		this.holding = !1;
		for (let e of this.held) this.apply(e);
		this.held = [], this.hooks.requests([...this.requestEntries.values()]), this.attempts = 0, this.channel.startHeartbeat(), this.hooks.connection("open"), this.hooks.recovered();
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
		} else e.method === "chat.input" || e.method === "chat.correction" ? this.hooks.input(String(e.params?.text || ""), e.method === "chat.correction", e.params?.admission_id) : e.method === "chat.unsupported" && this.hooks.connection("open", "Unavailable in ChatHermes: " + e.params?.method);
	}
	disconnected(e) {
		if (this.detached) return;
		let t = this.ws;
		this.ws = void 0, t && (t.onclose = t.onerror = null, t.close()), this.channel.detach(new bs("Native viewer disconnected")), this.hooks.connection("closed", e), this.reconnect ||= setTimeout(() => {
			this.reconnect = void 0, this.ensure().catch(() => this.disconnected());
		}, ys(this.attempts++));
	}
	async rpc(e, t = {}) {
		if (!this.channel.connected) throw new bs("Native viewer disconnected; message not submitted", "rejected");
		try {
			return await this.channel.request(e, t);
		} catch (t) {
			throw t instanceof ss ? new bs(t.message, t.data?.outcome || (e === "chat.submit" ? "unknown" : "rejected")) : t;
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
		this.detached = !0, clearTimeout(this.reconnect), this.reconnect = void 0, this.channel.detach(new bs("Viewer detached")), this.ws?.close();
	}
}, Ss = (e, t) => "chathermes.native-outcome:" + JSON.stringify([e, t]);
function Cs(e, t) {
	try {
		let n = Ss(e, t);
		return Object.keys(localStorage).some((e) => (e === n || e.startsWith(n + ":")) && localStorage.getItem(e) === "unknown");
	} catch {
		return !0;
	}
}
function ws(e, t) {
	let n = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
	try {
		localStorage.setItem(Ss(e, t) + ":" + n, "unknown");
	} catch {
		throw Error("Cannot safely record native submission state");
	}
	return n;
}
function Ts(e, t, n) {
	try {
		let r = Ss(e, t);
		if (n) localStorage.removeItem(r + ":" + n);
		else for (let e of Object.keys(localStorage)) (e === r || e.startsWith(r + ":")) && localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/lib/native-session.ts
function Es(e) {
	let t = /* @__PURE__ */ U([]), n = /* @__PURE__ */ U(!1), r = /* @__PURE__ */ U(!1), i = /* @__PURE__ */ U(""), a = /* @__PURE__ */ U(""), o = /* @__PURE__ */ U("closed"), s = /* @__PURE__ */ U([]), c = /* @__PURE__ */ U(!1), l = X(() => {
		let e = s.value[0];
		return e ? {
			...e.params,
			request_id: e.id,
			kind: e.method
		} : void 0;
	}), u, d = 0, f = !1, p = 0, m, h, g = [], _ = "", v = "", y = "", b = !1, x = !1, S = 0, C, w = () => {
		h && m && (h.blocks = m.blocks), t.value = [...t.value];
	};
	function ee(e, r = !1, i) {
		if (b && !r && h && i === _) {
			b = !1, w();
			return;
		}
		r && h && m && (ns(m, {
			type: "reasoning.completed",
			data: {}
		}), g.push({
			user: h,
			turn: m,
			hasCorrections: !0
		})), x = r || !1, h = {
			id: `native-user-${++S}`,
			role: "user",
			content: e
		}, t.value.push(h), m = /* @__PURE__ */ At($o()), h.blocks = m.blocks, n.value = !0, w();
	}
	function te(e) {
		f = !0, p++, C = void 0, m = void 0, h = void 0, b = !1, g = [];
		let r = e.messages.map((e) => ({
			...e,
			id: e.row_id == null ? void 0 : String(e.row_id),
			content: e.role === "tool" ? e.content : e.text || e.content || "",
			tool_name: e.name
		})), a = new Set(e.recovery.base_row_ids || []);
		if (t.value = e.recovery.complete ? r.filter((e) => e.id && a.has(e.id)) : r, n.value = !!(e.running || e.queued), !e.recovery.complete && e.inflight?.user) {
			let r = t.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
			r < 0 || Jo(t.value[r].content) !== e.inflight.user ? ee(e.inflight.user) : (h = t.value[r], m = /* @__PURE__ */ At($o()), is(m, rs(t.value.slice(r + 1)), n.value), h.blocks = m.blocks), e.inflight.assistant && ns(m, {
				type: "text.snapshot",
				data: { text: e.inflight.assistant }
			});
			for (let t of e.inflight.corrections || []) ee(t, !0);
			e.inflight.error && (i.value = e.inflight.error), e.running && (i.value = "Earlier progress is outside retained recovery; saved history is authoritative.");
		}
		n.value = !!(e.running || e.queued);
	}
	async function T() {
		let r = d, a = ++p, o = u;
		if (o && !f) try {
			let i = await Z.messages(v, y);
			if (r !== d || a !== p || f) return;
			if (n.value && h && m) {
				let e = C?.user_row_id, t = e ? i.findIndex((t) => t.id === String(e)) : -1;
				t >= 0 && is(m, rs(i.slice(t + 1)), !0), w();
				return;
			}
			if (h && m && !g.length || g.some((e) => e.hasCorrections)) return w(), !0;
			for (let e of g) {
				let { turn: t, receipt: n } = e, r = n?.user_row_id == null ? -1 : i.findIndex((e) => e.id === String(n.user_row_id)), a = r + 1;
				for (; a < i.length && i[a]?.role !== "user";) a++;
				r >= 0 && is(t, rs(i.slice(r + 1, a)), !1);
				let o = new Set(i.map((e) => e.id)), s = i.find((e) => e.id === String(n?.final_assistant_row_id)), c = [...t.blocks].reverse().find((e) => e.kind === "text")?.content || "";
				if (!(n?.complete && r >= 0 && n.row_ids.every((e) => o.has(String(e))) && s && Jo(s.content).trim() === c.trim())) return w(), !0;
				i[r] = {
					...i[r],
					blocks: t.blocks
				};
			}
			t.value = i;
			let s = await o.rpc("chat.reconciled", { through: o.boundary });
			return r === d && s.settled && e(), !0;
		} catch {
			return r === d && (i.value = "Response ended; saved history could not be reconciled. Refresh history before sending again."), !1;
		}
	}
	async function E(e, t) {
		k(), v = e, y = t, r.value = !0, c.value = Cs(v, y), c.value && (i.value = "Submission outcome unknown. Inspect history and native state before sending again.");
		let l = d;
		u = new xs(v, y, {
			snapshot: (e) => {
				l === d && te(e);
			},
			input: (e, t, n) => {
				l === d && ee(e, t, n);
			},
			event: (e) => {
				if (l !== d) return;
				let t = e.payload || {};
				e.type === "message.start" ? (n.value = !0, a.value = "Working…", C = void 0) : e.type === "thinking.delta" || e.type === "tool.generating" ? a.value = e.type === "tool.generating" ? "Preparing " + String(t.name || "tool") : String(t.text || "Working…") : e.type === "status.update" && (a.value = String(t.text || "")), !m && h && (m = /* @__PURE__ */ At($o()));
				let r = m;
				if (e.type.startsWith("subagent.") || e.type.startsWith("tool.")) {
					let n = e.type.startsWith("subagent.") ? "subagent-" + (t.subagent_id || t.child_session_id || (t.delegation_id ? `${t.delegation_id}:${t.task_index}` : "")) : t.tool_id;
					r = [...g].reverse().find((e) => e.turn.blocks.some((e) => e.id === n))?.turn || m;
				}
				if (r && as(r, e.type, t), e.type === "message.complete") {
					for (let e of g) as(e.turn, "message.complete", { status: t.status });
					C = t.persisted_turn, h && m && g.push({
						user: h,
						turn: m,
						receipt: C,
						hasCorrections: x
					}), n.value = !1, a.value = "", t.status && t.status !== "complete" && (i.value = String(t.error || "Response " + t.status)), f || T();
				} else e.type === "subagent.complete" && !n.value && !f && T();
				w();
			},
			requests: (e) => {
				l === d && (s.value = e);
			},
			connection: (e, t) => {
				l === d && (o.value = e, t && (i.value = t));
			},
			recovered: () => {
				l === d && (f = !1, r.value = !1, n.value || T());
			}
		});
		try {
			await u.ensure();
		} catch (e) {
			l === d && (r.value = !1, i.value = e instanceof Error ? e.message : "Native session unavailable");
		}
	}
	async function D(e, a, s, l) {
		if (!u || n.value || c.value || r.value || o.value !== "open") throw new bs("Native session is not ready. Message not submitted.", "rejected");
		let f = d, p = u, g = ws(v, y);
		c.value = !0, i.value = "", ee(e), h.content = l ?? a, b = !0, _ = g;
		let x = h.id, S = !1;
		try {
			let e = typeof a == "function" ? await a() : a;
			if (f !== d) throw new bs("Viewer detached before submission", "rejected");
			S = !0, await p.rpc("chat.submit", {
				input: e,
				admission_id: g,
				...s
			}), Ts(O(p), p.stored, g), f === d && (c.value = !1);
		} catch (e) {
			throw !S || e instanceof bs && e.outcome === "rejected" ? (Ts(O(p), p.stored, g), f === d && (t.value = t.value.filter((e) => e.id !== x), c.value = !1, b = !1, h?.id === x && (n.value = !1, m = void 0, h = void 0))) : f === d && (i.value = "Submission outcome unknown. Inspect history and native state before sending again."), e;
		}
	}
	let O = (e) => e.profile;
	async function ne() {
		if (!u) return;
		await u.ensure();
		let e = await u.rpc("chat.attach", { session_id: y });
		if (e.running || e.queued) {
			i.value = "Hermes is still working; sending remains locked.";
			return;
		}
		await T() && (Ts(v, y), c.value = !1);
	}
	function k() {
		d++, p++, u?.close(), u = void 0, f = !1, t.value = [], n.value = !1, r.value = !1, o.value = "closed", s.value = [], c.value = !1, i.value = "", a.value = "", m = void 0, h = void 0, g = [];
	}
	return {
		messages: t,
		busy: n,
		loading: r,
		error: i,
		status: a,
		connection: o,
		approval: l,
		uncertain: c,
		attach: E,
		submit: D,
		close: k,
		hydrate: T,
		resolveUncertainty: ne,
		reconnect: () => u?.ensure(),
		stop: () => u?.rpc("chat.stop"),
		steer: (e) => u?.rpc("chat.steer", { text: e }),
		answer: (e, t) => u?.answer(e, t)
	};
}
//#endregion
//#region src/lib/active-runs.ts
var Ds = /* @__PURE__ */ new Map(), Os = (e, t) => "chathermes.run.v1:" + JSON.stringify([e || "default", t]);
function ks(e, t) {
	let n = Os(e, t);
	try {
		return localStorage.getItem(n) || "";
	} catch {
		return Ds.get(n) || "";
	}
}
function As(e, t) {
	let n = Os(e, t), r = "chathermes.run-idempotency.v1:" + JSON.stringify([e || "default", t]);
	try {
		return localStorage.getItem(r) || Ds.get("idem:" + n) || "";
	} catch {
		return Ds.get("idem:" + n) || "";
	}
}
function js(e, t, n) {
	let r = Os(e, t), i = "chathermes.run-idempotency.v1:" + JSON.stringify([e || "default", t]);
	Ds.set("idem:" + r, n);
	try {
		localStorage.setItem(i, n);
	} catch {}
}
function Ms(e, t, n) {
	let r = Os(e, t);
	Ds.set(r, n);
	try {
		localStorage.setItem(r, n);
	} catch {}
}
function Ns(e, t, n) {
	let r = Os(e, t);
	if (ks(e, t) === n) {
		Ds.delete(r), Ds.delete("idem:" + r);
		try {
			localStorage.removeItem(r);
		} catch {}
		try {
			localStorage.removeItem("chathermes.run-idempotency.v1:" + JSON.stringify([e || "default", t]));
		} catch {}
	}
}
//#endregion
//#region src/lib/projects.ts
function Ps(e) {
	return e.path || e.repos.find((e) => e.path)?.path || void 0;
}
function Fs(e) {
	let t = e.repos.flatMap((e) => e.groups.flatMap((e) => e.sessions));
	return [...new Map(t.map((e) => [e.id, e])).values()].sort((e, t) => (t.last_active || 0) - (e.last_active || 0));
}
//#endregion
//#region src/components/ActivityRow.vue?vue&type=script&setup=true&lang.ts
var Is = {
	key: 0,
	class: "active-tool",
	role: "status"
}, Ls = ["open"], Rs = {
	key: 0,
	"aria-hidden": "true"
}, zs = { key: 1 }, Bs = { key: 2 }, Vs = { key: 0 }, Hs = {
	key: 1,
	class: "ml-6 py-1 text-sm",
	role: "status"
}, Us = /* @__PURE__ */ Hn({
	__name: "ActivityRow",
	props: {
		activity: {},
		turnComplete: { type: Boolean }
	},
	setup(e) {
		let t = e, n = X(() => t.activity.kind === "tool" && !t.activity.complete && !t.turnComplete), r = X(() => {
			let e = (t.activity.toolName || "tool").replace(/[_\s]+/g, " ").trim() || "tool";
			return e.charAt(0).toUpperCase() + e.slice(1);
		}), i = /* @__PURE__ */ U(!t.activity.complete);
		Mn(() => [t.activity.complete, t.turnComplete], ([e, t]) => {
			i.value = !e && !t;
		}), Mn(() => t.turnComplete, (e) => {
			e && (i.value = !1);
		});
		function a(e) {
			i.value = e.target.open;
		}
		return (t, o) => n.value ? (G(), K("span", Is, "Using tool: " + F(r.value), 1)) : (G(), K("details", {
			key: 1,
			class: de(["activity", {
				"activity-failed": e.activity.state === "failed",
				"activity-active": !e.activity.complete && !e.turnComplete
			}]),
			open: i.value,
			onToggle: a
		}, [q("summary", null, [
			e.activity.state === "failed" ? (G(), K("span", Rs, "!")) : Y("v-if", !0),
			q("span", { class: de({ "working-shimmer": !e.activity.complete && !e.turnComplete }) }, F(e.activity.title), 3),
			e.activity.state === "failed" ? (G(), K("span", zs, " · Failed")) : Y("v-if", !0),
			e.activity.duration === void 0 ? Y("v-if", !0) : (G(), K("span", Bs, " · " + F(e.activity.duration.toFixed(1)) + "s", 1))
		]), e.activity.content || e.activity.output || e.activity.toolName ? (G(), K("pre", Vs, F([
			e.activity.toolName,
			e.activity.content,
			e.activity.output
		].filter(Boolean).join("\n\n")), 1)) : e.activity.complete ? Y("v-if", !0) : (G(), K("p", Hs, F(e.activity.kind === "thinking" ? "Working…" : e.activity.state === "pending" ? "Waiting…" : "Running…"), 1))], 42, Ls));
	}
}), Ws = {
	class: "turn-work",
	"aria-label": "Turn work"
}, Gs = ["aria-expanded", "aria-controls"], Ks = {
	key: 0,
	class: "working-shimmer-tool"
}, qs = {
	key: 0,
	class: "sr-only",
	role: "status"
}, Js = ["id"], Ys = /* @__PURE__ */ Hn({
	__name: "TurnWork",
	props: {
		activities: {},
		working: { type: Boolean },
		approvalPending: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ U(!1), r = Un(), i = X(() => t.activities.map((e) => t.working ? e : {
			...e,
			complete: !0
		})), a = X(() => {
			if (t.working) for (let e = i.value.length - 1; e >= 0; e--) {
				let t = i.value[e];
				if (t.kind === "tool" && !t.complete) return t;
			}
		}), o = X(() => i.value.filter((e) => e.kind !== "tool" || e.complete)), s = (e) => t.working && !e.complete;
		return Mn(() => t.working, (e) => {
			e || (n.value = !1);
		}), (t, i) => (G(), K("section", Ws, [q("button", {
			type: "button",
			class: "work-summary",
			"aria-expanded": n.value,
			"aria-controls": Wt(r),
			onClick: i[0] ||= (e) => n.value = !n.value
		}, [
			q("span", {
				class: de(["work-chevron", { expanded: n.value }]),
				"aria-hidden": "true"
			}, "›", 2),
			q("span", { class: de({ "working-shimmer": e.working && !e.approvalPending }) }, [J(F(e.approvalPending ? "Waiting for approval" : e.working ? "Working…" : "Worked"), 1), e.working && !e.approvalPending && a.value ? (G(), K("span", Ks, " Using tool: " + F(a.value.toolName), 1)) : Y("v-if", !0)], 2),
			e.approvalPending ? (G(), K("span", qs, "Waiting for approval")) : Y("v-if", !0)
		], 8, Gs), q("div", {
			id: Wt(r),
			class: "work-timeline"
		}, [(G(!0), K(W, null, mr(o.value, (t) => En((G(), K("div", {
			key: t.id,
			class: de({ "current-activity": s(t) })
		}, [Wi(Us, {
			activity: t,
			"turn-complete": !e.working
		}, null, 8, ["activity", "turn-complete"])], 2)), [[ja, n.value || s(t)]])), 128))], 8, Js)]));
	}
}), Xs = {};
function Zs(e) {
	let t = Xs[e];
	if (t) return t;
	t = Xs[e] = [];
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
function Qs(e, t) {
	typeof t != "string" && (t = Qs.defaultChars);
	let n = Zs(t);
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
Qs.defaultChars = ";/?:@&=+$,#", Qs.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var $s = {};
function ec(e) {
	let t = $s[e];
	if (t) return t;
	t = $s[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function tc(e, t, n) {
	typeof t != "string" && (n = t, t = tc.defaultChars), n === void 0 && (n = !0);
	let r = ec(t), i = "";
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
tc.defaultChars = ";/?:@&=+$,-_.!~*'()#", tc.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function nc(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function rc() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var ic = /^([a-z0-9.+-]+:)/i, ac = /:[0-9]*$/, oc = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, sc = [
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
], cc = [
	"/",
	"?",
	"#"
], lc = 255, uc = /^[+a-z0-9A-Z_-]{0,63}$/, dc = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, fc = {
	javascript: !0,
	"javascript:": !0
}, pc = {
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
function mc(e, t) {
	if (e && e instanceof rc) return e;
	let n = new rc();
	return n.parse(e, t), n;
}
rc.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = oc.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = ic.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && fc[o]) && (a = a.substr(2), this.slashes = !0)), !fc[o] && (i || o && !pc[o])) {
		let e = -1;
		for (let t = 0; t < cc.length; t++) r = a.indexOf(cc[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < sc.length; t++) r = a.indexOf(sc[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(uc)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(uc)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(dc);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > lc && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), pc[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, rc.prototype.parseHost = function(e) {
	let t = ac.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region node_modules/mdurl/index.mjs
var hc = /* @__PURE__ */ t({
	decode: () => Qs,
	encode: () => tc,
	format: () => nc,
	parse: () => mc
}), gc = /* @__PURE__ */ t({
	Any: () => _c,
	Cc: () => vc,
	Cf: () => yc,
	P: () => bc,
	S: () => xc,
	Z: () => Sc
}), _c = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, vc = /[\0-\x1F\x7F-\x9F]/, yc = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, bc = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, xc = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, Sc = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, Cc = [
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
function wc(e) {
	return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function Tc(e) {
	return wc(e) ? 65533 : e >= 128 && e <= 159 && Cc[e - 128] || e;
}
function Ec(e) {
	return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(Tc(e));
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/internal/decode-shared.js
var Dc = /* #__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(127), t = 0;
	for (let n = 33; n <= 126; n++) n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
	return e;
})();
function Oc(e, t, n, r, i, a) {
	let o = e.length, s = a * 90, c = 0, l = () => {
		let t = Dc[e.charCodeAt(c++)];
		return t < a ? t : t * 91 - s + Dc[e.charCodeAt(c++)];
	}, u = n - r, d = n + i, f = new Int32Array(d);
	f.fill(-1, r, a), f.fill(-1, a + u, d);
	let p = new Int32Array(d), m = new Int32Array(d);
	function h(t, n) {
		let r = 0, i = n, a = n + t;
		for (; i < a;) {
			let t = Dc[e.charCodeAt(c++)];
			if (t < 89) r += t, f[i++] = r;
			else if (t === 89) {
				let t = Dc[e.charCodeAt(c++)] + 2;
				for (; t--;) f[i++] = ++r;
			} else {
				let t = Dc[e.charCodeAt(c++)];
				r += 89 + (t < 90 ? t * 91 + Dc[e.charCodeAt(c++)] : Dc[e.charCodeAt(c++)] * 8281 + Dc[e.charCodeAt(c++)] * 91 + Dc[e.charCodeAt(c++)]), f[i++] = r;
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
		let t = Dc[e.charCodeAt(c++)];
		t >= a && (t = t * 91 - s + Dc[e.charCodeAt(c++)]);
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
var kc = /* #__PURE__ */ Oc("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61), Ac;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(Ac ||= {});
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/decode.js
var jc;
(function(e) {
	e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(jc ||= {});
var Mc = 32, Nc = 21, Pc = 2097151, Fc = 2047, Ic = 0;
function Lc(e) {
	let t = e >>> Nc;
	return t === Fc ? Ic : t;
}
function Rc(e) {
	return e - jc.ZERO >>> 0 <= 9;
}
function zc(e) {
	return (e | Mc) - jc.LOWER_A >>> 0 <= 5;
}
function Bc(e) {
	return (e | Mc) - jc.LOWER_A >>> 0 <= 25;
}
function Vc(e) {
	return e === jc.EQUALS || Bc(e) || Rc(e);
}
var Hc;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Hc ||= {});
var Uc;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Uc ||= {});
function Wc(e, t, n, r) {
	let i = (t & Ac.BRANCH_LENGTH) >> 7, a = t & Ac.JUMP_TABLE;
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
function Gc(e, t, n) {
	return n === 1 ? String.fromCharCode(e[t] & Ac.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function Kc(e, t, n) {
	let r = t + 1, i = 0, a = r;
	if (r < n && (e.charCodeAt(r) | Mc) === jc.LOWER_X) for (r += 1, a = r; r < n;) {
		let t = e.charCodeAt(r);
		if (Rc(t)) i = i * 16 + (t - jc.ZERO);
		else if (zc(t)) i = i * 16 + ((t | Mc) - jc.LOWER_A + 10);
		else break;
		r += 1;
	}
	else for (; r < n;) {
		let t = e.charCodeAt(r) - jc.ZERO;
		if (t >>> 0 > 9) break;
		i = i * 10 + t, r += 1;
	}
	if (r === a) return 0;
	r < n && e.charCodeAt(r) === jc.SEMI && (r += 1), i > 1114111 && (i = 1114112);
	let o = r - t;
	return o >= Fc && (Ic = o, o = Fc), o << Nc | i;
}
function qc(e, t, n) {
	let r = kc, i = e.indexOf("&");
	if (i < 0) return e;
	let a = e.length, o = 0, s = "", c = r[0], l = c & Ac.JUMP_TABLE, u = (c & Ac.BRANCH_LENGTH) >> 7;
	do {
		let c = i + 1, d = e.charCodeAt(c), f, p;
		if (d === jc.NUM) {
			let n = Kc(e, c, a);
			f = Lc(n), t && f > 0 && e.charCodeAt(c + f - 1) !== jc.SEMI && (f = 0), p = f === 0 ? "" : Ec(n & Pc);
		} else if (Bc(d)) {
			f = 0, p = "";
			let n = d - l, i;
			if (n >>> 0 < u) {
				let e = r[1 + n];
				i = e === 0 ? -1 : u + e & 65535;
			} else i = -1;
			let o = 0, s = 0, m = i < 0 ? 0 : r[i], h = c + 1;
			trie: for (; h < a;) {
				for (; (m & (Ac.VALUE_LENGTH | Ac.FLAG13)) === 0 && (m & Ac.JUMP_TABLE) !== 0;) {
					let t = m & Ac.JUMP_TABLE, n = (m & Ac.BRANCH_LENGTH) >> 7;
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
				if ((m & (Ac.VALUE_LENGTH | Ac.FLAG13)) === Ac.FLAG13) {
					let t = (m & Ac.BRANCH_LENGTH) >> 7;
					if (e.charCodeAt(h) !== (m & Ac.JUMP_TABLE)) break;
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
					if (l === jc.SEMI) {
						f = h - c + 1, p = n === 1 ? String.fromCharCode(m & Ac.VALUE_MASK) : Gc(r, i, n);
						break;
					}
					if (!t && (m & Ac.FLAG13) === 0 && (f = h - c, o = i, s = n), n === 1) break;
				}
				let u = Wc(r, m, i + (n || 1), l);
				if (u < 0) break;
				i = u, m = r[i], h += 1;
			}
			if (p === "") {
				let e = m >>> 14;
				e !== 0 && !t && (m & Ac.FLAG13) === 0 && (f = h - c, o = i, s = e), f > 0 && (p = Gc(r, o, s));
			}
		} else f = 0, p = "";
		f === 0 || n && d !== jc.NUM && e.charCodeAt(c + f - 1) !== jc.SEMI && c + f < a && Vc(e.charCodeAt(c + f)) ? i = c : (o < i && (s += e.slice(o, i)), s += p, i = o = c + f), e.charCodeAt(i) !== jc.AMP && (i = e.indexOf("&", i));
	} while (i >= 0);
	return s + e.slice(o);
}
function Jc(e) {
	return qc(e, !0, !1);
}
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var Yc = class {
	src_Any = _c.source;
	src_Cc = vc.source;
	src_Z = Sc.source;
	src_P = bc.source;
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
}, Xc = {
	validate: (e, t, n) => {
		let r = n.re.get_http_validator();
		r.lastIndex = t;
		let i = r.exec(e);
		return i ? i[0].length : 0;
	},
	normalize: (e, t) => t.normalize(e)
}, Zc = {
	"http:": Xc,
	"https:": Xc,
	"ftp:": Xc,
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
}, Qc = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", $c = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function el() {
	let e = $c.split("|");
	return Qc.split("|").forEach((t) => {
		let n = t.indexOf(":"), r = t.slice(0, n);
		for (let i of t.slice(n + 1)) e.push(r + i);
	}), e;
}
var tl = {
	fuzzyLink: !1,
	fuzzyEmail: !0,
	fuzzyIP: !1,
	"---": !1,
	tlds: el(),
	urlAuth: !1,
	maxLength: 1e4
}, nl = class {
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
}, rl = class {
	__opts__;
	__schemas__;
	re;
	constructor(e = {}) {
		let { rebuilder: t, ...n } = e;
		this.__opts__ = {
			...tl,
			...n
		}, this.__schemas__ = { ...Zc }, this.re = t || new Yc(), this.re.set({
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
			let _ = new nl(e, g.schema, g.index, g.lastIndex);
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
		let r = new nl(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
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
}, il = 2147483647, al = 36, ol = 1, sl = 26, cl = 38, ll = 700, ul = 72, dl = 128, fl = "-", pl = /^xn--/, ml = /[^\0-\x7F]/, hl = /[\x2E\u3002\uFF0E\uFF61]/g, gl = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, _l = 35, vl = Math.floor, yl = String.fromCharCode;
function bl(e) {
	throw RangeError(gl[e]);
}
function xl(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function Sl(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(hl, ".");
	let i = xl(e.split("."), t).join(".");
	return r + i;
}
function Cl(e) {
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
var wl = (e) => String.fromCodePoint(...e), Tl = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : al;
}, El = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, Dl = function(e, t, n) {
	let r = 0;
	for (e = n ? vl(e / ll) : e >> 1, e += vl(e / t); e > 455; r += al) e = vl(e / _l);
	return vl(r + 36 * e / (e + cl));
}, Ol = function(e) {
	let t = [], n = e.length, r = 0, i = dl, a = ul, o = e.lastIndexOf(fl);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && bl("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = al;; i += al) {
			s >= n && bl("invalid-input");
			let o = Tl(e.charCodeAt(s++));
			o >= al && bl("invalid-input"), o > vl((il - r) / t) && bl("overflow"), r += o * t;
			let c = i <= a ? ol : i >= a + sl ? sl : i - a;
			if (o < c) break;
			let l = al - c;
			t > vl(il / l) && bl("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = Dl(r - o, c, o == 0), vl(r / c) > il - i && bl("overflow"), i += vl(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, kl = function(e) {
	let t = [];
	e = Cl(e);
	let n = e.length, r = dl, i = 0, a = ul;
	for (let n of e) n < 128 && t.push(yl(n));
	let o = t.length, s = o;
	for (o && t.push(fl); s < n;) {
		let n = il;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > vl((il - i) / c) && bl("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > il && bl("overflow"), n === r) {
			let e = i;
			for (let n = al;; n += al) {
				let r = n <= a ? ol : n >= a + sl ? sl : n - a;
				if (e < r) break;
				let i = e - r, o = al - r;
				t.push(yl(El(r + i % o, 0))), e = vl(i / o);
			}
			t.push(yl(El(e, 0))), a = Dl(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, Al = {
	version: "2.3.1",
	ucs2: {
		decode: Cl,
		encode: wl
	},
	decode: Ol,
	encode: kl,
	toASCII: function(e) {
		return Sl(e, function(e) {
			return ml.test(e) ? "xn--" + kl(e) : e;
		});
	},
	toUnicode: function(e) {
		return Sl(e, function(e) {
			return pl.test(e) ? Ol(e.slice(4).toLowerCase()) : e;
		});
	}
}, jl = Object.defineProperty, Ml = (e, t) => {
	let n = {};
	for (var r in e) jl(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || jl(n, Symbol.toStringTag, { value: "Module" }), n;
}, Nl = /* @__PURE__ */ Ml({
	arrayReplaceAt: () => Fl,
	asciiTrim: () => ru,
	callable: () => Pl,
	escapeHtml: () => Jl,
	escapeRE: () => Xl,
	fromCodePoint: () => Ll,
	isMdAsciiPunct: () => eu,
	isPunctChar: () => Ql,
	isPunctCharCode: () => $l,
	isSpace: () => Q,
	isValidEntityCode: () => Il,
	isWhiteSpace: () => Zl,
	lib: () => iu,
	normalizeReference: () => tu,
	unescapeAll: () => Ul,
	unescapeMd: () => Hl
});
function Pl(e) {
	let t = function(...n) {
		return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
	};
	return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function Fl(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function Il(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function Ll(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var Rl = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, zl = RegExp(`${Rl.source}|&([a-z#][a-z0-9]{1,31});`, "gi"), Bl = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Vl(e, t) {
	if (t.charCodeAt(0) === 35 && Bl.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return Il(n) ? Ll(n) : e;
	}
	let n = Jc(e);
	return n === e ? e : n;
}
function Hl(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(Rl, "$1");
}
function Ul(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(zl, function(e, t, n) {
		return t || Vl(e, n);
	});
}
var Wl = /[&<>"]/, Gl = /[&<>"]/g, Kl = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function ql(e) {
	return Kl[e];
}
function Jl(e) {
	return Wl.test(e) ? e.replace(Gl, ql) : e;
}
var Yl = /[.?*+^$[\]\\(){}|-]/g;
function Xl(e) {
	return e.replace(Yl, "\\$&");
}
function Q(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function Zl(e) {
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
function Ql(e) {
	return bc.test(e) || xc.test(e);
}
function $l(e) {
	return Ql(Ll(e));
}
function eu(e) {
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
function tu(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function nu(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function ru(e) {
	let t = 0;
	for (; t < e.length && nu(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && nu(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var iu = {
	mdurl: hc,
	ucmicro: gc
};
function au(e, t, n) {
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
function ou(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = Ul(e.slice(t + 1, i)), a.ok = !0, a;
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
	return t === i || o !== 0 ? a : (a.str = Ul(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function su(e, t, n, r) {
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
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += Ul(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += Ul(e.slice(t, a)), o;
}
var cu = /* @__PURE__ */ Ml({
	parseLinkDestination: () => ou,
	parseLinkLabel: () => au,
	parseLinkTitle: () => su
});
function lu(e) {
	"@babel/helpers - typeof";
	return lu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, lu(e);
}
function uu(e, t) {
	if (lu(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (lu(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function du(e) {
	var t = uu(e, "string");
	return lu(t) == "symbol" ? t : t + "";
}
function $(e, t, n) {
	return (t = du(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
var fu = class {
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
}, pu = class {
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
}, mu = {};
mu.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return `<code${i.renderAttrs(a)}>${Jl(a.content)}</code>`;
}, mu.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return `<pre${i.renderAttrs(a)}><code>${Jl(e[t].content)}</code></pre>\n`;
}, mu.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? Ul(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || Jl(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", `${n.langPrefix}${s}`]) : (t[e] = [t[e][0], t[e][1]], t[e][1] += ` ${n.langPrefix}${s}`);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, mu.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, mu.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, mu.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, mu.text = function(e, t) {
	return Jl(e[t].content);
}, mu.html_block = function(e, t) {
	return e[t].content;
}, mu.html_inline = function(e, t) {
	return e[t].content;
};
var hu = class {
	constructor() {
		$(this, "rules", Object.assign({}, mu));
	}
	renderAttrs(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${Jl(e.attrs[t][0])}="${Jl(String(e.attrs[t][1]))}"`;
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
}, gu = class {
	constructor(e, t, n) {
		$(this, "tokens", []), $(this, "inlineMode", !1), $(this, "Token", fu), this.src = e, this.env = n, this.md = t;
	}
}, _u = /\r\n?/g, vu = /\0/g;
function yu(e) {
	let t;
	t = e.src.replace(_u, "\n"), t = t.replace(vu, "�"), e.src = t;
}
function bu(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function xu(e) {
	let t = e.tokens, n = 0;
	for (let e = 0; e < t.length; e++) t[e].type !== "reference_definition" && (e !== n && (t[n] = t[e]), n++);
	t.length !== n && (t.length = n);
}
function Su(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function Cu(e) {
	return /^<a[>\s]/i.test(e);
}
function wu(e) {
	return /^<\/a\s*>/i.test(e);
}
function Tu(e) {
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
			if (n.type === "html_inline" && (Cu(n.content) && a > 0 && a--, wu(n.content) && a++), !(a > 0) && n.type === "text" && e.md.linkify.test(n.content)) {
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
var Eu = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, Du = /\((c|tm|r)\)/i, Ou = /\((c|tm|r)\)/gi, ku = {
	c: "©",
	r: "®",
	tm: "™"
};
function Au(e, t) {
	return ku[t.toLowerCase()];
}
function ju(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(Ou, Au)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function Mu(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && Eu.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function Nu(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (Du.test(e.tokens[t].content) && ju(e.tokens[t].children), Eu.test(e.tokens[t].content) && Mu(e.tokens[t].children));
}
var Pu = /['"]/, Fu = /['"]/g, Iu = "’", Lu = 1e3;
function Ru(e, t, n) {
	for (; e.length > n;) {
		let n = e.pop();
		n.isSingleQuote ? t.single = n.prevSameQuoteIdx : t.double = n.prevSameQuoteIdx;
	}
}
function zu(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function Bu(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function Vu(e, t) {
	let n, r = [], i = {
		single: -1,
		double: -1
	}, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = e[o].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= c); n--);
		if (Ru(r, i, n + 1), s.type !== "text") continue;
		let l = s.content, u = 0, d = l.length;
		OUTER: for (; u < d;) {
			Fu.lastIndex = u;
			let s = Fu.exec(l);
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
			let _ = eu(h) || $l(h), v = eu(g) || $l(g), y = Zl(h), b = Zl(g);
			if (b ? f = !1 : v && (y || _ || (f = !1)), y ? p = !1 : _ && (b || v || (p = !1)), g === 34 && s[0] === "\"" && h >= 48 && h <= 57 && (p = f = !1), f && p && (f = _, p = v), !f && !p) {
				m && zu(a, o, s.index, Iu);
				continue;
			}
			if (p && (n = m ? i.single : i.double, n >= 0 && r[n].level === c)) {
				let e = r[n], c, l;
				m ? (c = t.md.options.quotes[2], l = t.md.options.quotes[3]) : (c = t.md.options.quotes[0], l = t.md.options.quotes[1]), zu(a, o, s.index, l), zu(a, e.tokenIdx, e.contentPos, c), Ru(r, i, n);
				continue OUTER;
			}
			if (f) {
				if (r.length >= Lu) return;
				r.push({
					tokenIdx: o,
					contentPos: s.index,
					isSingleQuote: m,
					level: c,
					prevSameQuoteIdx: m ? i.single : i.double
				}), m ? i.single = r.length - 1 : i.double = r.length - 1;
			} else p && m && zu(a, o, s.index, Iu);
		}
	}
	Object.keys(a).forEach(function(t) {
		let n = Number(t);
		e[n].content = Bu(e[n].content, a[t]);
	});
}
function Hu(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && Pu.test(e.tokens[t].content) && Vu(e.tokens[t].children, e);
}
function Uu(e) {
	let t, n, r = e.length;
	for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
	for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
	t !== n && (e.length = n);
}
function Wu(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text"), i[t].children && Uu(i[t].children);
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var Gu = [
	["normalize", yu],
	["block", bu],
	["strip_references", xu],
	["inline", Su],
	["linkify", Tu],
	["replacements", Nu],
	["smartquotes", Hu],
	["text_join", Wu]
], Ku = class {
	constructor() {
		$(this, "ruler", new pu()), $(this, "State", gu);
		for (let e = 0; e < Gu.length; e++) this.ruler.push(Gu[e][0], Gu[e][1]);
	}
	process(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}
}, qu = class {
	constructor(e, t, n, r) {
		$(this, "bMarks", []), $(this, "eMarks", []), $(this, "tShift", []), $(this, "sCount", []), $(this, "bsCount", []), $(this, "blkIndent", 0), $(this, "line", 0), $(this, "lineMax", 0), $(this, "tight", !1), $(this, "listIndent", -1), $(this, "parentType", "root"), $(this, "level", 0), $(this, "Token", fu), this.src = e, this.md = t, this.env = n, this.tokens = r;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) {
				if (Q(s)) {
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
		let r = new fu(e, t, n);
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
		for (let t = this.src.length; e < t && Q(this.src.charCodeAt(e)); e++);
		return e;
	}
	skipSpacesBack(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!Q(this.src.charCodeAt(--e))) return e + 1;
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
				if (Q(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}
}, Ju = 65536;
function Yu(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function Xu(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function Zu(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !Q(s) || o === 45 && Q(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !Q(t)) return !1;
		a++;
	}
	let c = Yu(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = Yu(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = Xu(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
		if (r || (c = Yu(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = Xu(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > Ju)) break;
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
function Qu(e, t, n) {
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
function $u(e, t, n, r) {
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
function ed(e, t, n, r) {
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
				if (Q(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
function td(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !Q(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function nd(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !Q(e.src.charCodeAt(r)) ? -1 : r;
}
function rd(e, t) {
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
	return i < r && (a = e.src.charCodeAt(i), !Q(a)) ? -1 : i;
}
function id(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function ad(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = rd(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = nd(e, c)) >= 0) d = !1;
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
			if (p = rd(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = nd(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && id(e, h), !0;
}
function od(e, t, n, r) {
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
		} else if (!Q(e)) break;
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
		} else if (!Q(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && Q(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && Q(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = tu(c.slice(1, l));
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
var sd = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), cd = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", ld = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", ud = RegExp(`^(?:${cd}|${ld}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`), dd = RegExp(`^(?:${cd}|${ld})`), fd = [
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
		RegExp(`^</?(${sd.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		!0
	],
	[
		RegExp(`${dd.source}\\s*$`),
		/^$/,
		!1
	]
];
function pd(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < fd.length && !fd[s][0].test(o); s++);
	if (s === fd.length) return !1;
	if (r) return fd[s][2];
	let c = t + 1, l = fd[s][1].test("");
	if (!fd[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), fd[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function md(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !Q(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && Q(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", `h${s}`, 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = ru(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", `h${s}`, -1);
	return d.markup = "########".slice(0, s), !0;
}
function hd(e, t, n) {
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
	let c = ru(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", `h${a}`, 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", `h${a}`, -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function gd(e, t, n) {
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
	let o = ru(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var _d = [
	[
		"table",
		Zu,
		["paragraph", "reference"]
	],
	["code", Qu],
	[
		"fence",
		$u,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		ed,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		td,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		ad,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", od],
	[
		"html_block",
		pd,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		md,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", hd],
	["paragraph", gd]
], vd = class {
	constructor() {
		$(this, "ruler", new pu()), $(this, "State", qu);
		for (let e = 0; e < _d.length; e++) this.ruler.push(_d[e][0], _d[e][1], { alt: (_d[e][2] || []).slice() });
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
}, yd = class {
	constructor(e, t, n, r) {
		$(this, "pos", 0), $(this, "level", 0), $(this, "pending", ""), $(this, "pendingLevel", 0), $(this, "cache", {}), $(this, "backticks", {}), $(this, "backticksScanned", !1), $(this, "linkLevel", 0), $(this, "delimiters", []), $(this, "_prev_delimiters", []), $(this, "Token", fu), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
	}
	pushPending() {
		let e = new fu("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}
	push(e, t, n) {
		this.pending && this.pushPending();
		let r = new fu(e, t, n), i;
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
		let c = eu(i) || $l(i), l = eu(s) || $l(s), u = Zl(i), d = Zl(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}
};
function bd(e) {
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
function xd(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !bd(e.src.charCodeAt(n));) n++;
	return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function Sd(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function Cd(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function wd(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = n - Math.min(10, e.pending.length, n), a = n;
	for (; a > i && Cd(e.src.charCodeAt(a - 1));) a--;
	if (a === n || !Sd(e.src.charCodeAt(a))) return !1;
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
function Td(e, t) {
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
	for (n++; n < i && Q(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var Ed = [];
for (let e = 0; e < 256; e++) Ed.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	Ed[e.charCodeAt(0)] = 1;
});
function Dd(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), Q(i));) n++;
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
		t.content = i < 256 && Ed[i] !== 0 ? a : o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function Od(e) {
	let t = {}, n = 0;
	for (; (n = e.indexOf("`", n)) !== -1;) {
		let r = n;
		for (; e.charCodeAt(++n) === 96;);
		t[n - r] = r;
	}
	return t;
}
function kd(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = e.posMax, i = n + 1;
	for (; i < r && e.src.charCodeAt(i) === 96;) i++;
	let a = e.src.slice(n, i), o = a.length;
	if (e.backticksScanned ||= (e.backticks = Od(e.src), !0), (e.backticks[o] ?? -1) >= i) {
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
function Ad(e, t) {
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
function jd(e, t) {
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
function Md(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	jd(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && jd(e, n);
	}
}
var Nd = {
	tokenize: Ad,
	postProcess: Md
};
function Pd(e, t) {
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
function Fd(e, t) {
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
function Id(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Fd(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && Fd(e, n);
	}
}
var Ld = {
	tokenize: Pd,
	postProcess: Id
};
function Rd(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), Q(n) || n === 10); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), Q(n) || n === 10); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), Q(n) || n === 10); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), r = tu(r), a = e.env.references[r], !a) return e.pos = u, !1;
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
function zd(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), Q(n) || n === 10); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), Q(n) || n === 10); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), Q(n) || n === 10); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), i = tu(i), o = e.env.references[i], !o) return e.pos = d, !1;
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
var Bd = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Vd = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Hd(e, t) {
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
	if (Vd.test(a)) {
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
	if (Bd.test(a)) {
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
function Ud(e) {
	return /^<a[>\s]/i.test(e);
}
function Wd(e) {
	return /^<\/a\s*>/i.test(e);
}
function Gd(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function Kd(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !Gd(i)) return !1;
	let a = e.src.slice(r).match(ud);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], Ud(t.content) && e.linkLevel++, Wd(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var qd = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Jd = /^&([a-z][a-z0-9]{1,31});/i;
function Yd(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(qd);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = Il(t) ? Ll(t) : Ll(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(Jd);
		if (r) {
			let n = Jc(r[0]);
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
function Xd(e) {
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
function Zd(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	Xd(e.delimiters);
	for (let e = 0; e < n; e++) {
		let n = t[e]?.delimiters;
		n && Xd(n);
	}
}
function Qd(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var $d = [
	["text", xd],
	["linkify", wd],
	["newline", Td],
	["escape", Dd],
	["backticks", kd],
	["strikethrough", Nd.tokenize],
	["emphasis", Ld.tokenize],
	["link", Rd],
	["image", zd],
	["autolink", Hd],
	["html_inline", Kd],
	["entity", Yd]
], ef = [
	["balance_pairs", Zd],
	["strikethrough", Nd.postProcess],
	["emphasis", Ld.postProcess],
	["fragments_join", Qd]
], tf = class {
	constructor() {
		$(this, "ruler", new pu()), $(this, "ruler2", new pu()), $(this, "State", yd);
		for (let e = 0; e < $d.length; e++) this.ruler.push($d[e][0], $d[e][1]);
		for (let e = 0; e < ef.length; e++) this.ruler2.push(ef[e][0], ef[e][1]);
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
}, nf = {
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
}, rf = /^(vbscript|javascript|file|data):/, af = /^data:image\/(gif|png|jpeg|webp);/, of = [
	"http:",
	"https:",
	"mailto:"
], sf = class {
	validateLink(e) {
		let t = e.trim().toLowerCase();
		return !rf.test(t) || af.test(t);
	}
	normalizeLink(e) {
		let t = mc(e, !0);
		if (t.hostname && (!t.protocol || of.indexOf(t.protocol) >= 0)) try {
			t.hostname = Al.toASCII(t.hostname);
		} catch {}
		return t.auth &&= tc(t.auth), t.hostname &&= tc(t.hostname), t.pathname &&= tc(t.pathname), t.search &&= tc(t.search), t.hash &&= tc(t.hash), nc(t);
	}
	normalizeLinkText(e) {
		let t = mc(e, !0);
		if (t.hostname && (!t.protocol || of.indexOf(t.protocol) >= 0)) try {
			t.hostname = Al.toUnicode(t.hostname);
		} catch {}
		return Qs(nc(t), Qs.defaultChars + "%");
	}
	constructor(...e) {
		$(this, "inline", new tf()), $(this, "block", new vd()), $(this, "core", new Ku()), $(this, "renderer", new hu()), $(this, "linkify", new rl()), $(this, "utils", Nl), $(this, "helpers", Object.assign({}, cu));
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
			if (t = nf[n], !t) throw Error(`Wrong 'markdown-it' preset "${n}", check name`);
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
$(sf, "Token", fu), $(sf, "Ruler", pu), $(sf, "Renderer", hu), $(sf, "ParserCore", Ku), $(sf, "StateCore", gu), $(sf, "ParserBlock", vd), $(sf, "StateBlock", qu), $(sf, "ParserInline", tf), $(sf, "StateInline", yd);
//#endregion
//#region src/lib/markdown.ts
var cf = new (Pl(sf))({
	html: !1,
	breaks: !0,
	linkify: !0
});
cf.renderer.rules.link_open = (e, t, n, r, i) => (e[t].attrSet("target", "_blank"), e[t].attrSet("rel", "noopener noreferrer"), i.renderToken(e, t, n));
function lf(e) {
	return cf.render(e);
}
//#endregion
//#region src/components/ChatTranscript.vue?vue&type=script&setup=true&lang.ts
var uf = {
	key: 0,
	class: "muted text-sm text-[#a3a3a3]"
}, df = {
	key: 1,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, ff = {
	key: 0,
	class: "grid gap-2 pt-8 text-[#b4b4b4]"
}, pf = {
	key: 0,
	class: "message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]"
}, mf = ["innerHTML"], hf = ["src"], gf = {
	key: 1,
	class: "assistant-turn grid min-w-0 gap-1"
}, _f = {
	key: 0,
	class: "message assistant w-full self-start"
}, vf = ["innerHTML"], yf = ["src"], bf = {
	key: 2,
	class: "assistant-turn"
}, xf = {
	key: 3,
	class: "message assistant w-full self-start"
}, Sf = ["innerHTML"], Cf = /* @__PURE__ */ Hn({
	__name: "ChatTranscript",
	props: {
		profile: {},
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
		followInitially: { type: Boolean }
	},
	emits: ["suggest"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = X(() => n.messages.filter((e) => e.role !== "system")), a = X(() => {
			let e = [], t = 0;
			for (let r = 0; r < i.value.length;) {
				let a = i.value[r];
				if (a.role === "user") {
					t++, e.push({
						message: a,
						key: a.id || `user-${r}`
					});
					let o = r + 1;
					for (; o < i.value.length && i.value[o].role !== "user";) o++;
					let s = o === i.value.length, c = s && (!n.turnUserCount || n.turnUserCount === t) && n.blocks?.length ? n.blocks : a.blocks || rs(i.value.slice(r + 1, o)), l = c.length ? c : s ? n.progress : [], u = s && (n.working ?? l.some((e) => e.kind !== "text" && !e.complete));
					(l.length || u) && e.push({
						blocks: l,
						working: u,
						approvalPending: s && n.approvalPending,
						key: `turn-${a.id || r}`
					}), r = o;
				} else {
					let t = r + 1;
					for (; t < i.value.length && i.value[t].role !== "user";) t++;
					e.push({
						blocks: rs(i.value.slice(r, t)),
						key: `history-${r}`
					}), r = t;
				}
			}
			return e;
		}), o = /* @__PURE__ */ U(), s = /* @__PURE__ */ U(n.followInitially !== !1);
		function c() {
			let e = o.value;
			e && (s.value = e.scrollHeight - e.scrollTop - e.clientHeight < 120);
		}
		async function l() {
			await pn(), s.value && o.value && (o.value.scrollTop = o.value.scrollHeight);
		}
		function u(e) {
			let t = Array.isArray(e) ? e.flatMap((e) => {
				let t = e?.image_url?.url;
				return typeof t == "string" && /^(data:image\/|https?:\/\/)/.test(t) ? [t] : [];
			}) : [];
			return t.length ? t : [...Jo(e).matchAll(/Attached image [^\n]+: [^\n]*\/uploads\/chathermes\/([a-f0-9]{32}\.(?:png|jpe?g|gif|webp))/g)].map((e) => "/api/plugins/chathermes/images/" + e[1] + (n.profile ? "?profile=" + encodeURIComponent(n.profile) : ""));
		}
		function d(e) {
			let t = Jo(e.content);
			return e.role === "user" ? t.replace(/Attached image ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}\.(?:png|jpe?g|gif|webp)/g, "📷 $1").replace(/Attached file ([^\n]+): [^\n]*\/uploads\/chathermes\/[a-f0-9]{32}(?:\.[a-z0-9]{1,12})?/g, "📎 $1").replace(/\[screenshot\]/g, "📷 Attached image") : t;
		}
		return Mn(() => [
			n.messages.length,
			n.draft,
			n.blocks || n.progress
		], async () => {
			let e = o.value, t = s.value;
			await pn(), e && t && s.value && (e.scrollTop = e.scrollHeight);
		}, { deep: !0 }), (t, n) => (G(), K("div", {
			ref_key: "transcript",
			ref: o,
			class: "transcript flex min-h-0 w-full flex-1 flex-col gap-7 overflow-y-auto px-4 py-6 text-white min-[701px]:px-[max(24px,calc((100%-760px)/2))] min-[701px]:py-9",
			role: "log",
			"aria-label": "Conversation",
			"aria-live": "polite",
			onScroll: c,
			onToggleCapture: l
		}, [
			e.loading ? (G(), K("div", uf, "Loading conversation…")) : !i.value.length && !e.draft && !e.thinking ? (G(), K("div", df, [n[4] ||= q("div", { class: "m-auto text-center" }, [q("h2", { class: "text-2xl font-medium" }, "What can I help with?"), q("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, "Ask Hermes a question or continue a conversation.")], -1), e.home ? (G(), K("div", ff, [q("button", {
				class: "flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]",
				onClick: n[0] ||= (e) => r("suggest", "Help me review my latest project changes")
			}, [...n[2] ||= [q("span", { "aria-hidden": "true" }, "⌘", -1), q("span", { class: "truncate" }, "Help me review my latest project changes", -1)]]), q("button", {
				class: "flex items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#303030]",
				onClick: n[1] ||= (e) => r("suggest", "Find the most useful next step for my work")
			}, [...n[3] ||= [q("span", { "aria-hidden": "true" }, "✳", -1), q("span", { class: "truncate" }, "Find the most useful next step for my work", -1)]])])) : Y("v-if", !0)])) : Y("v-if", !0),
			(G(!0), K(W, null, mr(a.value, (e) => (G(), K(W, { key: e.key }, [e.message ? (G(), K("article", pf, [q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: Wt(lf)(d(e.message))
			}, null, 8, mf), (G(!0), K(W, null, mr(u(e.message.content), (e) => (G(), K("img", {
				key: e,
				src: e,
				alt: "Attached image",
				onLoad: l,
				class: "mt-2 max-h-72 max-w-full rounded-xl object-contain"
			}, null, 40, hf))), 128))])) : (G(), K("div", gf, [e.working || e.blocks?.some((e) => e.kind !== "text") ? (G(), zi(Ys, {
				key: 0,
				activities: (e.blocks || []).filter((e) => e.kind !== "text"),
				working: !!e.working,
				"approval-pending": e.approvalPending
			}, null, 8, [
				"activities",
				"working",
				"approval-pending"
			])) : Y("v-if", !0), (G(!0), K(W, null, mr(e.blocks, (e) => (G(), K(W, { key: e.id }, [e.kind === "text" ? (G(), K("article", _f, [q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: Wt(lf)(e.content)
			}, null, 8, vf), (G(!0), K(W, null, mr(e.images, (e) => (G(), K("img", {
				key: e,
				src: e,
				alt: "Attached image",
				onLoad: l,
				class: "mt-2 max-h-72 max-w-full rounded-xl object-contain"
			}, null, 40, yf))), 128))])) : Y("v-if", !0)], 64))), 128))]))], 64))), 128)),
			e.working && !a.value.some((e) => e.working) ? (G(), K("div", bf, [Wi(Ys, {
				activities: e.progress,
				working: !0,
				"approval-pending": e.approvalPending
			}, null, 8, ["activities", "approval-pending"])])) : Y("v-if", !0),
			hr(t.$slots, "request"),
			e.draft && !e.blocks?.length ? (G(), K("article", xf, [q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: Wt(lf)(e.draft)
			}, null, 8, Sf)])) : Y("v-if", !0)
		], 544));
	}
}), wf = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, Tf = { class: "scheduled-heading" }, Ef = { class: "scheduled-heading-content" }, Df = { class: "page-heading" }, Of = ["disabled"], kf = {
	key: 1,
	class: "scheduled-filter"
}, Af = {
	key: 2,
	class: "project-muted"
}, jf = ["disabled"], Mf = {
	key: 4,
	role: "alert",
	class: "project-error"
}, Nf = {
	key: 5,
	role: "status",
	class: "project-muted"
}, Pf = {
	key: 6,
	role: "alert",
	class: "project-error"
}, Ff = {
	key: 1,
	class: "scheduled-content"
}, If = {
	key: 0,
	class: "project-muted"
}, Lf = {
	key: 1,
	class: "scheduled-list",
	"aria-label": "Scheduled jobs"
}, Rf = ["onClick"], zf = {
	key: 2,
	class: "project-muted"
}, Bf = {
	key: 3,
	class: "scheduled-list",
	"aria-label": "Job runs"
}, Vf = ["onClick"], Hf = ["disabled"], Uf = {
	key: 5,
	class: "project-muted"
}, Wf = /* @__PURE__ */ Hn({
	__name: "ScheduledPage",
	props: {
		profile: {},
		chatBusy: { type: Boolean },
		offline: { type: Boolean },
		discussionError: {}
	},
	emits: ["discuss"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ U([]), a = /* @__PURE__ */ U(), o = /* @__PURE__ */ U([]), s = /* @__PURE__ */ U(), c = /* @__PURE__ */ U(), l = /* @__PURE__ */ U("active"), u = /* @__PURE__ */ U(!1), d = /* @__PURE__ */ U(""), f = /* @__PURE__ */ U(!1), p = /* @__PURE__ */ U(0), m, h = X(() => i.value.filter((e) => g(e) === l.value));
		function g(e) {
			return e.state === "completed" || e.state === "error" ? "completed" : e.state === "paused" || e.enabled === !1 ? "paused" : "active";
		}
		function _(e) {
			return e > 0 ? (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString() : "Run date unavailable";
		}
		function v() {
			let e = new URL(location.href);
			e.searchParams.delete("job"), e.searchParams.delete("scheduled_run"), a.value && e.searchParams.set("job", a.value.id), s.value && e.searchParams.set("scheduled_run", s.value.id), history.pushState({}, "", e.pathname + e.search + e.hash);
		}
		async function y(e) {
			m?.abort();
			let t = new AbortController();
			m = t, u.value = !0, d.value = "";
			try {
				await e(t.signal);
			} catch (e) {
				t.signal.aborted || (d.value = e instanceof Fo && e.status === 503 ? "Scheduled history is unavailable in this Hermes version." : "Could not load scheduled history. The job or output may no longer be available.");
			} finally {
				m === t && (u.value = !1);
			}
		}
		async function b() {
			await y(async (e) => {
				let t = await Z.scheduled(n.profile, e);
				e.aborted || (i.value = t.jobs);
			});
		}
		async function x(e, t = !1) {
			a.value = e, s.value = void 0, c.value = void 0, o.value = [], p.value = 0, f.value = !1, t || v(), await S();
		}
		async function S(e = !1) {
			await y(async (t) => {
				let r = await Z.scheduledRuns(n.profile, a.value.id, e ? p.value : 0, t);
				t.aborted || (o.value = e ? [...o.value, ...r.runs.filter((e) => !o.value.some((t) => t.id === e.id))] : r.runs, p.value = r.offset + r.runs.length, f.value = r.has_more);
			});
		}
		async function C(e, t = !1) {
			s.value = e, c.value = void 0, t || v(), await y(async (t) => {
				let r = await Z.scheduledOutput(n.profile, a.value.id, e.id, t);
				t.aborted || (c.value = r, typeof r.started_at == "number" && (s.value = {
					...e,
					started_at: r.started_at
				}));
			});
		}
		function w() {
			m?.abort(), u.value = !1, d.value = "", c.value = void 0, s.value ? s.value = void 0 : a.value = void 0, v();
		}
		function ee() {
			s.value ? C(s.value, !0) : a.value ? S() : b();
		}
		function te() {
			let e = c.value?.output || c.value?.messages.filter((e) => e.role === "assistant").map((e) => Jo(e.content)).filter(Boolean).join("\n\n");
			e && r("discuss", `Discuss this scheduled job run.\n\nJob: ${a.value?.name || a.value?.id}\nRun: ${_(s.value.started_at)}\n\n${e}`);
		}
		return ir(async () => {
			let e = new URLSearchParams(location.search), t = e.get("job"), n = e.get("scheduled_run");
			if (await b(), m?.signal.aborted) return;
			let r = i.value.find((e) => e.id === t);
			if (t && !r) {
				d.value = "This scheduled job is no longer available.";
				return;
			}
			if (r) {
				if (l.value = g(r), await x(r, !0), m?.signal.aborted) return;
				n && await C(o.value.find((e) => e.id === n) || {
					id: n,
					started_at: 0,
					source: "cron"
				}, !0);
			}
		}), cr(() => m?.abort()), (t, n) => (G(), K("section", wf, [q("div", Tf, [q("div", Ef, [
			a.value ? (G(), K("button", {
				key: 0,
				class: "project-back",
				onClick: w
			}, "← " + F(s.value ? a.value.name || a.value.id : "Scheduled"), 1)) : Y("v-if", !0),
			q("div", Df, [q("h2", null, F(a.value?.name || a.value?.id || "Scheduled"), 1), s.value ? Y("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: u.value,
				onClick: ee
			}, "Refresh", 8, Of))]),
			a.value ? (G(), K("p", Af, F(s.value ? _(s.value.started_at) : "Run history · newest first"), 1)) : (G(), K("label", kf, [n[3] ||= J("Show ", -1), En(q("select", {
				"onUpdate:modelValue": n[0] ||= (e) => l.value = e,
				"aria-label": "Job status"
			}, [...n[2] ||= [
				q("option", { value: "active" }, "Active", -1),
				q("option", { value: "paused" }, "Paused", -1),
				q("option", { value: "completed" }, "Completed", -1)
			]], 512), [[go, l.value]])])),
			c.value && (c.value.output || c.value.messages.some((e) => e.role === "assistant" && Wt(Jo)(e.content))) ? (G(), K("button", {
				key: 3,
				class: "project-button",
				disabled: e.chatBusy || e.offline,
				onClick: te
			}, "Open a chat about this run", 8, jf)) : Y("v-if", !0),
			e.discussionError ? (G(), K("p", Mf, F(e.discussionError), 1)) : Y("v-if", !0),
			u.value ? (G(), K("p", Nf, "Loading scheduled history…")) : Y("v-if", !0),
			d.value ? (G(), K("p", Pf, [J(F(d.value) + " ", 1), q("button", {
				class: "underline",
				onClick: ee
			}, "Retry")])) : Y("v-if", !0)
		])]), s.value && c.value && (c.value.output || c.value.messages.length) ? (G(), zi(Cf, {
			key: s.value.id,
			"follow-initially": !1,
			messages: c.value.output ? [{
				role: "assistant",
				content: c.value.output
			}] : c.value.messages,
			draft: "",
			loading: !1,
			progress: []
		}, null, 8, ["messages"])) : (G(), K("div", Ff, [
			!u.value && !d.value && !a.value && !h.value.length ? (G(), K("p", If, "No " + F(l.value) + " scheduled jobs.", 1)) : Y("v-if", !0),
			a.value ? Y("v-if", !0) : (G(), K("nav", Lf, [(G(!0), K(W, null, mr(h.value, (e) => (G(), K("button", {
				key: e.id,
				onClick: (t) => x(e)
			}, [q("span", null, [
				q("strong", null, F(e.name || e.id), 1),
				q("small", null, F(e.prompt || "Scheduled job"), 1),
				q("small", null, F(e.schedule_display), 1)
			]), n[4] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, Rf))), 128))])),
			!u.value && !d.value && a.value && !s.value && !o.value.length ? (G(), K("p", zf, "No runs yet.")) : Y("v-if", !0),
			a.value && !s.value ? (G(), K("nav", Bf, [(G(!0), K(W, null, mr(o.value, (e) => (G(), K("button", {
				key: e.id,
				onClick: (t) => C(e)
			}, [q("span", null, [
				q("strong", null, F(_(e.started_at)), 1),
				q("small", null, F(e.title || "Job run"), 1),
				q("small", null, F(e.end_reason || (e.source === "cron_output" ? "Saved output" : e.ended_at ? "Finished" : "In progress")), 1)
			]), n[5] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, Vf))), 128))])) : Y("v-if", !0),
			a.value && !s.value && f.value ? (G(), K("button", {
				key: 4,
				class: "project-button",
				disabled: u.value,
				onClick: n[1] ||= (e) => S(!0)
			}, "Load older runs", 8, Hf)) : Y("v-if", !0),
			s.value && c.value && !c.value.output && !c.value.messages.length ? (G(), K("p", Uf, "No output was saved for this run.")) : Y("v-if", !0)
		]))]));
	}
}), Gf = {
	class: "projects-page page-content",
	"aria-label": "Projects"
}, Kf = { class: "page-heading" }, qf = ["disabled"], Jf = {
	key: 0,
	class: "project-muted"
}, Yf = { class: "project-actions" }, Xf = ["disabled"], Zf = ["disabled"], Qf = {
	key: 2,
	role: "alert",
	class: "project-error"
}, $f = {
	key: 3,
	role: "status",
	class: "project-muted"
}, ep = {
	key: 4,
	class: "project-muted"
}, tp = {
	class: "project-list",
	"aria-label": "Project list"
}, np = ["aria-label", "onClick"], rp = /* @__PURE__ */ Hn({
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
		let n = e, r = t, i = X(() => n.projects.filter((e) => !e.isNoProject && !!e.archived === n.archived)), a = /* @__PURE__ */ U(!1), o = /* @__PURE__ */ U(""), s = /* @__PURE__ */ U("");
		function c() {
			o.value.trim() && r("manage", "create", {
				name: o.value.trim(),
				...s.value.trim() ? { primary_path: s.value.trim() } : {}
			});
		}
		return (t, n) => (G(), K("section", Gf, [
			q("div", Kf, [n[5] ||= q("h2", null, "Projects", -1), e.archived ? Y("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: n[0] ||= (e) => a.value = !a.value
			}, "New project", 8, qf))]),
			e.archived ? (G(), K("p", Jf, "Archived projects")) : Y("v-if", !0),
			a.value && !e.archived ? (G(), K("form", {
				key: 1,
				class: "project-form",
				onSubmit: Co(c, ["prevent"])
			}, [
				q("label", null, [n[6] ||= J("Project name", -1), En(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					required: "",
					maxlength: "160",
					autofocus: ""
				}, null, 512), [[po, o.value]])]),
				q("label", null, [n[7] ||= J("Folder (optional)", -1), En(q("input", {
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					placeholder: "/path/on/hermes/server"
				}, null, 512), [[po, s.value]])]),
				q("div", Yf, [q("button", {
					class: "project-button",
					disabled: e.busy || e.offline || !o.value.trim()
				}, "Create project", 8, Xf), q("button", {
					type: "button",
					class: "project-button",
					disabled: e.busy,
					onClick: n[3] ||= (e) => a.value = !1
				}, "Cancel", 8, Zf)])
			], 32)) : Y("v-if", !0),
			e.error ? (G(), K("p", Qf, [J(F(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[4] ||= (e) => r("retry")
			}, "Retry Projects")])) : Y("v-if", !0),
			e.loading ? (G(), K("p", $f, "Loading Projects…")) : i.value.length ? Y("v-if", !0) : (G(), K("p", ep, F(e.archived ? "No archived projects." : "No projects yet."), 1)),
			q("nav", tp, [(G(!0), K(W, null, mr(i.value, (e) => (G(), K("button", {
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
				q("span", null, [q("strong", null, F(e.label), 1), q("small", null, F(e.archived ? "Archived" : e.isAuto ? "Discovered workspace" : `${e.sessionCount} ${e.sessionCount === 1 ? "chat" : "chats"}`), 1)]),
				n[9] ||= q("span", { "aria-hidden": "true" }, "›", -1)
			], 8, np))), 128))])
		]));
	}
}), ip = {
	key: 0,
	class: "project-settings"
}, ap = ["disabled"], op = {
	key: 0,
	class: "project-error",
	role: "alert"
}, sp = {
	key: 1,
	class: "project-muted",
	role: "status"
}, cp = ["disabled"], lp = { class: "project-field-row" }, up = ["disabled"], dp = {
	key: 2,
	class: "project-muted"
}, fp = { class: "project-folders" }, pp = { class: "folder-path" }, mp = { key: 0 }, hp = { key: 1 }, gp = { class: "project-actions" }, _p = ["disabled", "onClick"], vp = [
	"disabled",
	"aria-label",
	"onClick"
], yp = ["disabled"], bp = { class: "project-checkbox" }, xp = ["disabled"], Sp = { id: "project-confirm-text" }, Cp = { class: "project-actions" }, wp = ["disabled"], Tp = ["disabled"], Ep = /* @__PURE__ */ Hn({
	__name: "ProjectSettings",
	props: {
		project: {},
		busy: { type: Boolean },
		offline: { type: Boolean },
		error: {}
	},
	emits: ["manage"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ U(n.project.label), a = /* @__PURE__ */ U(n.project.description || ""), o = /* @__PURE__ */ U(n.project.icon || ""), s = /* @__PURE__ */ U(n.project.color || ""), c = /* @__PURE__ */ U(n.project.board_slug || ""), l = /* @__PURE__ */ U(""), u = /* @__PURE__ */ U(""), d = /* @__PURE__ */ U(!0), f = /* @__PURE__ */ U(), p = /* @__PURE__ */ U(), m = /* @__PURE__ */ U();
		Mn(() => n.busy, (e, t) => {
			t && !e && !n.error && _();
		}), Mn(() => n.project.label, (e) => {
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
			}, await pn(), p.value?.focus();
		}
		function _() {
			f.value = void 0, m.value?.focus();
		}
		function v() {
			let e = f.value;
			e && h(e.action, e.fields);
		}
		return (t, n) => e.project.isAuto ? (G(), K("div", ip, [n[12] ||= q("p", { class: "project-muted" }, "Save this discovered workspace as a project to manage its name and folders.", -1), q("button", {
			class: "project-button",
			disabled: e.busy || e.offline,
			onClick: n[0] ||= (t) => r("manage", "create", {
				name: e.project.label,
				primary_path: e.project.path || e.project.repos.find((e) => e.path)?.path || ""
			})
		}, "Save project", 8, ap)])) : e.project.isNoProject ? Y("v-if", !0) : (G(), K("div", {
			key: 1,
			ref_key: "settings",
			ref: m,
			tabindex: "-1",
			class: "project-settings"
		}, [
			e.error ? (G(), K("p", op, F(e.error), 1)) : Y("v-if", !0),
			e.busy ? (G(), K("p", sp, "Saving project…")) : Y("v-if", !0),
			q("form", {
				class: "project-form",
				onSubmit: n[6] ||= Co((e) => h("update", {
					name: i.value.trim(),
					description: a.value,
					icon: o.value,
					color: s.value,
					board_slug: c.value
				}), ["prevent"])
			}, [q("fieldset", { disabled: e.busy || e.offline }, [
				q("label", null, [n[13] ||= J("Project name", -1), En(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					required: "",
					maxlength: "160"
				}, null, 512), [[po, i.value]])]),
				q("label", null, [n[14] ||= J("Description", -1), En(q("textarea", {
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					maxlength: "4096",
					rows: "2"
				}, null, 512), [[po, a.value]])]),
				q("div", lp, [q("label", null, [n[15] ||= J("Icon", -1), En(q("input", {
					"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
					maxlength: "64"
				}, null, 512), [[po, o.value]])]), q("label", null, [n[16] ||= J("Color", -1), En(q("input", {
					"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
					maxlength: "64",
					placeholder: "#94c9a5"
				}, null, 512), [[po, s.value]])])]),
				q("label", null, [n[17] ||= J("Board slug (optional)", -1), En(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					maxlength: "160"
				}, null, 512), [[po, c.value]])]),
				q("button", {
					class: "project-button",
					disabled: !i.value.trim()
				}, "Save changes", 8, up)
			], 8, cp)], 32),
			n[21] ||= q("h3", null, "Folders", -1),
			n[22] ||= q("p", { class: "project-muted" }, "The primary folder is used for new chats. Existing chats keep their workspace.", -1),
			e.project.folders?.length ? Y("v-if", !0) : (G(), K("p", dp, "No folders configured.")),
			q("ul", fp, [(G(!0), K(W, null, mr(e.project.folders, (t) => (G(), K("li", { key: t.path }, [q("span", pp, [
				J(F(t.label || t.path), 1),
				t.label ? (G(), K("small", mp, F(t.path), 1)) : Y("v-if", !0),
				t.is_primary ? (G(), K("small", hp, "Primary folder")) : Y("v-if", !0)
			]), q("div", gp, [t.is_primary ? Y("v-if", !0) : (G(), K("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: (e) => h("set_primary", { path: t.path })
			}, "Make primary", 8, _p)), q("button", {
				class: "project-button",
				disabled: e.busy || e.offline,
				"aria-label": `Remove folder ${t.path}`,
				onClick: (e) => g("remove_folder", { path: t.path }, `Remove ${t.path} from this project? The folder and existing chats will be kept.`)
			}, "Remove", 8, vp)])]))), 128))]),
			q("form", {
				class: "project-form",
				onSubmit: n[10] ||= Co((e) => h("add_folder", {
					path: l.value.trim(),
					label: u.value.trim(),
					is_primary: d.value
				}), ["prevent"])
			}, [q("fieldset", { disabled: e.busy || e.offline }, [
				q("label", null, [n[18] ||= J("Folder path", -1), En(q("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					required: "",
					placeholder: "/path/on/hermes/server",
					maxlength: "4096"
				}, null, 512), [[po, l.value]])]),
				q("label", null, [n[19] ||= J("Folder label (optional)", -1), En(q("input", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					maxlength: "160"
				}, null, 512), [[po, u.value]])]),
				q("label", bp, [En(q("input", {
					"onUpdate:modelValue": n[9] ||= (e) => d.value = e,
					type: "checkbox"
				}, null, 512), [[mo, d.value]]), n[20] ||= J(" Use as primary folder", -1)]),
				q("button", {
					class: "project-button",
					disabled: !l.value.trim()
				}, "Add folder", 8, xp)
			], 8, yp)], 32),
			f.value ? (G(), K("div", {
				key: 3,
				class: "project-confirmation",
				role: "alertdialog",
				"aria-modal": "false",
				"aria-labelledby": "project-confirm-text",
				onKeydown: n[11] ||= To(Co((t) => !e.busy && _(), ["prevent"]), ["esc"])
			}, [q("p", Sp, F(f.value.text), 1), q("div", Cp, [q("button", {
				ref_key: "cancelButton",
				ref: p,
				class: "project-button",
				disabled: e.busy,
				onClick: _
			}, "Cancel", 8, wp), q("button", {
				class: "project-button project-danger",
				disabled: e.busy || e.offline,
				onClick: v
			}, "Confirm removal", 8, Tp)])], 32)) : Y("v-if", !0)
		], 512));
	}
}), Dp = {
	key: 0,
	role: "status"
}, Op = {
	key: 1,
	role: "alert",
	class: "project-error"
}, kp = ["disabled"], Ap = { key: 2 }, jp = { class: "project-muted" }, Mp = ["disabled"], Np = {
	key: 3,
	role: "status",
	class: "project-muted"
}, Pp = ["disabled"], Fp = /* @__PURE__ */ Hn({
	__name: "ProjectInstructions",
	props: {
		profile: {},
		projectId: {},
		offline: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ U(""), r = /* @__PURE__ */ U(""), i = /* @__PURE__ */ U(null), a = /* @__PURE__ */ U(!0), o = /* @__PURE__ */ U(!1), s = /* @__PURE__ */ U(""), c = /* @__PURE__ */ U(!1), l = /* @__PURE__ */ U(!1), u = new AbortController(), d = !0;
		async function f() {
			a.value = !0, s.value = "", c.value = !1;
			try {
				let e = await Z.projectInstructions(t.profile, t.projectId, u.signal);
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
					let e = await Z.saveProjectInstructions(t.profile, t.projectId, {
						content: n.value,
						filename: r.value,
						revision: i.value
					});
					d && (i.value = e.revision, c.value = !0);
				} catch (e) {
					d && (s.value = e instanceof Fo && e.status === 409 ? "Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading." : "Could not save instructions. Your draft is kept; try again.");
				} finally {
					d && (o.value = !1);
				}
			}
		}
		return ir(f), sr(() => {
			d = !1, u.abort();
		}), (t, i) => (G(), K("form", {
			class: "project-form instructions-form",
			onSubmit: Co(p, ["prevent"])
		}, [
			i[3] ||= q("p", { class: "project-muted" }, "Custom instructions guide Hermes when it works in this project.", -1),
			a.value ? (G(), K("p", Dp, "Loading instructions…")) : Y("v-if", !0),
			s.value ? (G(), K("p", Op, [J(F(s.value) + " ", 1), q("button", {
				type: "button",
				class: "underline",
				disabled: a.value || o.value || e.offline,
				onClick: f
			}, "Reload instructions", 8, kp)])) : Y("v-if", !0),
			l.value ? (G(), K("label", Ap, [
				i[2] ||= J("Instructions ", -1),
				q("span", jp, F(r.value), 1),
				En(q("textarea", {
					"onUpdate:modelValue": i[0] ||= (e) => n.value = e,
					rows: "14",
					disabled: a.value || o.value,
					onInput: i[1] ||= (e) => c.value = !1
				}, null, 40, Mp), [[po, n.value]])
			])) : Y("v-if", !0),
			c.value ? (G(), K("p", Np, "Instructions saved.")) : Y("v-if", !0),
			q("button", {
				class: "project-button justify-self-start",
				disabled: !l.value || a.value || o.value || e.offline
			}, F(o.value ? "Saving…" : "Save instructions"), 9, Pp)
		], 32));
	}
}), Ip = "/api/plugins/chathermes", Lp;
function Rp() {
	return typeof window < "u" && window.isSecureContext && typeof navigator < "u" && "serviceWorker" in navigator && "PushManager" in window && typeof Notification < "u";
}
async function zp() {
	if (!Rp()) throw Error("Notifications require a secure browser with Push API support.");
	return Lp ||= navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
		scope: "/chathermes",
		updateViaCache: "none"
	}).catch((e) => {
		throw Lp = void 0, e;
	}), Lp;
}
function Bp(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4));
	return Uint8Array.from(n, (e) => e.charCodeAt(0));
}
async function Vp() {
	let e = await fetch(Ip + "/push/config", { credentials: "same-origin" });
	if (!e.ok) throw Error("Push configuration unavailable");
	return e.json();
}
async function Hp() {
	return (await zp()).pushManager.getSubscription();
}
async function Up() {
	if (!Rp()) return {
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: "Notifications require HTTPS and a supported browser."
	};
	try {
		let [e, t] = await Promise.all([Hp(), Vp()]);
		return {
			supported: !0,
			permission: Notification.permission,
			subscribed: !!e,
			available: t.available,
			error: t.available ? "" : "Push notifications are unavailable on this server."
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
async function Wp(e) {
	if (!Rp()) throw Error("Notifications require HTTPS and a supported browser.");
	let t = await Notification.requestPermission();
	if (t !== "granted") throw Error(t === "denied" ? "Notification permission is blocked in browser settings." : "Notification permission was not granted.");
	let n = await zp(), r = await Vp();
	if (!r.available || !r.vapid_public_key) throw Error("Push notifications are unavailable on this server.");
	let i = await n.pushManager.subscribe({
		userVisibleOnly: !0,
		applicationServerKey: Bp(r.vapid_public_key)
	});
	if (!(await fetch(Ip + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(i.toJSON())
	})).ok) throw Error("Could not save this notification subscription.");
}
async function Gp(e) {
	let t = await Hp();
	if (t) {
		if (!(await fetch(Ip + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "DELETE",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t.toJSON())
		})).ok) throw Error("Could not disable notifications on this device.");
		await t.unsubscribe();
	}
}
async function Kp(e) {
	if (!(await fetch(Ip + "/push/test" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin"
	})).ok) throw Error("Could not send a test notification.");
}
//#endregion
//#region src/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var qp = { class: "session-head mt-4 mb-1 shrink-0 px-2.5 text-xs font-semibold text-[#a3a3a3]" }, Jp = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, Yp = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Xp = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Zp = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
}, Qp = ["aria-current", "onClick"], $p = { class: "truncate" }, em = { class: "text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]" }, tm = ["aria-label", "onClick"], nm = ["disabled"], rm = /* @__PURE__ */ Hn({
	__name: "SessionSidebar",
	props: {
		sessions: {},
		selected: {},
		loading: { type: Boolean },
		error: {},
		hasMore: { type: Boolean },
		busy: { type: Boolean },
		heading: {}
	},
	emits: [
		"select",
		"create",
		"more",
		"retry",
		"rename"
	],
	setup(e, { emit: t }) {
		let n = t, r = /* @__PURE__ */ U(""), i = /* @__PURE__ */ U("");
		function a(e) {
			r.value = e.id, i.value = e.title || "";
		}
		function o() {
			i.value.trim() && n("rename", r.value, i.value.trim()), r.value = "";
		}
		return (t, s) => (G(), K(W, null, [
			q("h2", qp, F(e.heading || "Recents"), 1),
			e.error ? (G(), K("p", Jp, [J(F(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: s[0] ||= (e) => n("retry")
			}, "Retry")])) : Y("v-if", !0),
			e.loading && !e.sessions.length ? (G(), K("p", Yp, "Loading sessions…")) : e.sessions.length ? (G(), K("nav", Zp, [(G(!0), K(W, null, mr(e.sessions, (t) => (G(), K("div", {
				key: t.id,
				class: de(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [r.value === t.id ? (G(), K(W, { key: 0 }, [En(q("input", {
				"onUpdate:modelValue": s[1] ||= (e) => i.value = e,
				"aria-label": "Session title",
				maxlength: "160",
				class: "min-w-0 flex-1 rounded-md border border-[#424242] bg-[#303030] p-2 text-base text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] dark:bg-[#303030] dark:text-white",
				onKeydown: [To(o, ["enter"]), s[2] ||= To((e) => r.value = "", ["esc"])]
			}, null, 544), [[po, i.value]]), q("button", {
				"aria-label": "Save title",
				class: "rounded-md px-2 py-2 text-sm text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				onClick: o
			}, "Save")], 64)) : (G(), K(W, { key: 1 }, [q("button", {
				class: "session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-current": e.selected === t.id ? "page" : void 0,
				onClick: (e) => n("select", t.id)
			}, [q("span", $p, F(t.title || "Untitled session"), 1), q("span", em, F(t.source || "Hermes"), 1)], 8, Qp), q("button", {
				class: "icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
				"aria-label": `Rename ${t.title || "Untitled session"}`,
				onClick: (e) => a(t)
			}, "✎", 8, tm)], 64))], 2))), 128))])) : (G(), K("p", Xp, "No conversations yet.")),
			e.hasMore ? (G(), K("button", {
				key: 4,
				class: "load-more rounded-lg border border-[#424242] px-3 py-2 text-sm text-white hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-55 dark:border-[#424242]",
				disabled: e.loading,
				onClick: s[3] ||= (e) => n("more")
			}, F(e.loading ? "Loading…" : "Load more"), 9, nm)) : Y("v-if", !0)
		], 64));
	}
}), im = {
	key: 0,
	class: "flex flex-wrap gap-2 px-2 pb-2"
}, am = ["src", "alt"], om = { class: "truncate" }, sm = ["aria-label", "onClick"], cm = {
	key: 1,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, lm = {
	key: 2,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, um = { class: "composer-body" }, dm = ["placeholder"], fm = { class: "composer-controls flex items-center gap-3" }, pm = ["aria-expanded", "disabled"], mm = { class: "composer-hint min-w-0 flex-1 px-1 text-[11px] text-[#a3a3a3]" }, hm = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], gm = { class: "truncate" }, _m = [
	"disabled",
	"aria-label",
	"title"
], vm = {
	key: 0,
	viewBox: "0 0 24 24",
	class: "size-5",
	fill: "currentColor",
	"aria-hidden": "true"
}, ym = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "size-5",
	"aria-hidden": "true"
}, bm = ["id", "aria-label"], xm = { class: "flex shrink-0 items-center gap-2 border-b border-[#424242] p-2" }, Sm = { class: "min-w-0 flex-1 truncate" }, Cm = { class: "min-h-0 overflow-y-auto overscroll-contain" }, wm = ["data-provider", "onClick"], Tm = { class: "min-w-0 flex-1 truncate" }, Em = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, Dm = ["data-model", "onClick"], Om = { class: "min-w-0 flex-1 break-all" }, km = {
	key: 0,
	"aria-label": "Selected"
}, Am = {
	key: 0,
	class: "px-3 py-3 text-[#a3a3a3]"
}, jm = {
	key: 4,
	class: "absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
}, Mm = /* @__PURE__ */ Hn({
	__name: "ChatComposer",
	props: {
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
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ U(""), a = /* @__PURE__ */ U(!1), o = /* @__PURE__ */ U([]), s = /* @__PURE__ */ U(""), c = /* @__PURE__ */ U(!1), l = /* @__PURE__ */ U(), u = /* @__PURE__ */ U(), d = /* @__PURE__ */ U(), f = /* @__PURE__ */ U(), p = /* @__PURE__ */ U(!1), m;
		function h() {
			let e = d.value;
			if (!e) return;
			let t = getComputedStyle(e), n = parseFloat(t.paddingTop || "0") + parseFloat(t.paddingBottom || "0");
			e.style.height = "0px";
			let r = e.scrollHeight - n, i = parseFloat(t.lineHeight) || 24, a = Math.max(parseFloat(t.minHeight) || 0, Math.min(r, 8 * i)) + n;
			e.style.height = `${a}px`, e.style.overflowY = r > 8 * i ? "auto" : "hidden";
		}
		function g() {
			p.value = !0, y.value = !1;
		}
		function _(e) {
			(!(e.relatedTarget instanceof Node) || !f.value?.contains(e.relatedTarget)) && (p.value = !1);
		}
		Mn(i, () => h(), { flush: "post" }), ir(() => {
			if (h(), typeof ResizeObserver < "u") {
				let e = -1;
				m = new ResizeObserver((t) => {
					let n = t[0]?.contentRect.width;
					n !== void 0 && n !== e && (e = n, h());
				}), d.value && m.observe(d.value);
			}
		}), sr(() => m?.disconnect()), Mn(() => n.suggestedPrompt, (e) => {
			e && (i.value = e);
		}, { immediate: !0 });
		let v = X(() => (n.models || []).filter((e) => e.parent !== null)), y = /* @__PURE__ */ U(!1), b = /* @__PURE__ */ U(null), x = /* @__PURE__ */ U(), S = /* @__PURE__ */ U(), C = Un(), w = X(() => n.imagesSupported === !1 && o.value.some((e) => e.type.startsWith("image/"))), ee = X(() => n.sending || n.modelsLoading), te = X(() => n.providers?.find((e) => e.slug === b.value)), T = X(() => te.value?.name || "Model routes"), E = X(() => {
			let e = te.value, t = e ? e.models : v.value.map((e) => e.id);
			return [.../* @__PURE__ */ new Set([...(e?.is_current || !n.providers?.length) && n.defaultModel ? [n.defaultModel] : [], ...t])];
		});
		async function D() {
			await pn(), y.value && S.value?.querySelector("button")?.focus();
		}
		function O() {
			y.value && (y.value = !1, x.value?.focus());
		}
		function ne() {
			if (y.value) {
				O();
				return;
			}
			ee.value || (a.value = !1, b.value = null, y.value = !0, D());
		}
		function k(e) {
			b.value = e, D();
		}
		function re() {
			b.value = null, D();
		}
		function ie(e) {
			ee.value || (r("update:provider", b.value || ""), r("update:model", te.value?.is_current && e === n.defaultModel ? "" : e), O());
		}
		function A(e) {
			let t = e.composedPath();
			S.value && !t.includes(S.value) && x.value && !t.includes(x.value) && O();
		}
		function ae(e) {
			if (y.value && (e.key === "Escape" && (e.preventDefault(), O()), e.key === "Tab")) {
				let t = Array.from(S.value?.querySelectorAll("button") || []), n = e.shiftKey ? t.at(-1) : t[0];
				document.activeElement === (e.shiftKey ? t[0] : t.at(-1)) && (e.preventDefault(), n?.focus());
			}
		}
		Mn(ee, (e) => {
			e && O();
		}), Mn(() => n.providers, () => O()), ir(() => {
			document.addEventListener("click", A), document.addEventListener("keydown", ae);
		}), sr(() => {
			document.removeEventListener("click", A), document.removeEventListener("keydown", ae);
		});
		let oe = X(() => n.sending ? !n.stoppable || !!i.value.trim() && (c.value || w.value) : n.disabled || c.value || w.value || !i.value.trim() && !o.value.length);
		function j() {
			if (oe.value) return;
			if (n.sending && i.value.trim()) {
				r("steer", i.value.trim()), i.value = "";
				return;
			}
			if (n.disabled || n.sending || c.value || w.value) return;
			let e = i.value.trim();
			(e || o.value.length) && (r("send", e, [...o.value]), i.value = "", o.value = [], a.value = !1);
		}
		async function M(e) {
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
		async function se(e) {
			let t = e.target;
			c.value = !0, s.value = "", a.value = !1;
			try {
				for (let e of Array.from(t.files || [])) {
					if (e.size > 20971520) throw Error("Each file must be 20 MB or smaller.");
					if (o.value.length >= 5) throw Error("Attach up to five files per message.");
					let t = await new Promise((t, n) => {
						let r = new FileReader();
						r.onload = () => t(String(r.result)), r.onerror = () => n(/* @__PURE__ */ Error("Could not read file.")), r.onabort = () => n(/* @__PURE__ */ Error("File reading was cancelled. Try again.")), r.readAsDataURL(e);
					});
					e.type.startsWith("image/") && (t = await M(t));
					let n = e.type.startsWith("image/") ? t.slice(5, t.indexOf(";")) : e.type || "application/octet-stream";
					o.value.push({
						name: e.name,
						type: n,
						data: t,
						size: e.size
					});
				}
			} catch (e) {
				s.value = e instanceof Error ? e.message : "Could not read file.";
			} finally {
				c.value = !1, t.value = "";
			}
		}
		return (t, n) => (G(), K("form", {
			ref_key: "form",
			ref: f,
			class: de([{ "composer-editing": p.value }, "composer relative mx-auto mb-3 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:mb-6 min-[701px]:w-[calc(100%-48px)]"]),
			onFocusout: _,
			onSubmit: Co(j, ["prevent"])
		}, [
			o.value.length ? (G(), K("div", im, [(G(!0), K(W, null, mr(o.value, (e, t) => (G(), K("div", {
				key: t,
				class: "flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm"
			}, [
				e.type.startsWith("image/") ? (G(), K("img", {
					key: 0,
					src: e.data,
					alt: e.name,
					class: "size-12 rounded-lg object-cover"
				}, null, 8, am)) : Y("v-if", !0),
				q("span", om, F(e.name), 1),
				q("button", {
					type: "button",
					"aria-label": `Remove ${e.name}`,
					onClick: (e) => o.value.splice(t, 1)
				}, "×", 8, sm)
			]))), 128))])) : Y("v-if", !0),
			w.value ? (G(), K("p", cm, "Image sending is unavailable for this native capability. Remove the image to send text or files.")) : Y("v-if", !0),
			s.value ? (G(), K("p", lm, F(s.value), 1)) : Y("v-if", !0),
			q("div", um, [
				n[9] ||= q("label", {
					class: "sr-only",
					for: "prompt"
				}, "Message Hermes", -1),
				En(q("textarea", {
					ref_key: "textarea",
					ref: d,
					id: "prompt",
					"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
					rows: "1",
					maxlength: "65536",
					placeholder: e.projectName ? `Message ${e.projectName}` : "Message Hermes…",
					class: "composer-input min-h-14 w-full resize-none bg-transparent px-2 py-1 text-base leading-6 text-white outline-none placeholder:text-[#b4b4b4]",
					onFocus: g
				}, null, 40, dm), [[po, i.value]]),
				q("input", {
					ref_key: "files",
					ref: l,
					type: "file",
					multiple: "",
					hidden: "",
					"aria-label": "Upload files",
					onChange: se
				}, null, 544),
				q("input", {
					ref_key: "camera",
					ref: u,
					type: "file",
					accept: "image/*",
					capture: "environment",
					hidden: "",
					"aria-label": "Take a photo",
					onChange: se
				}, null, 544),
				q("div", fm, [
					q("button", {
						class: "attach-button grid size-10 shrink-0 place-items-center rounded-full bg-[#424242] text-3xl text-white disabled:opacity-55",
						type: "button",
						"aria-label": "Attachment options",
						"aria-expanded": a.value,
						disabled: e.sending || c.value,
						onClick: n[1] ||= (e) => {
							O(), a.value = !a.value;
						}
					}, "+", 8, pm),
					q("p", mm, F(c.value ? "Reading files…" : e.reason || ""), 1),
					q("button", {
						ref_key: "pill",
						ref: x,
						type: "button",
						class: "model-pill flex min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-2 text-base text-white disabled:opacity-55",
						"aria-label": "Choose model",
						"aria-haspopup": "dialog",
						"aria-expanded": y.value,
						"aria-controls": Wt(C),
						disabled: ee.value,
						onClick: ne
					}, [q("span", gm, F(e.modelsLoading ? "Loading models…" : e.model || e.defaultModel || "Default"), 1), n[6] ||= q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-4 shrink-0",
						"aria-hidden": "true"
					}, [q("path", { d: "m6 9 6 6 6-6" })], -1)], 8, hm),
					q("button", {
						class: "send-button grid size-11 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
						type: "button",
						disabled: oe.value,
						"aria-label": e.sending ? i.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						title: e.sending ? i.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						onClick: n[2] ||= (t) => e.sending ? i.value.trim() ? j() : e.stoppable && r("stop") : j()
					}, [e.sending && !i.value.trim() ? (G(), K("svg", vm, [...n[7] ||= [q("rect", {
						x: "6",
						y: "6",
						width: "12",
						height: "12",
						rx: "2"
					}, null, -1)]])) : (G(), K("svg", ym, [...n[8] ||= [q("path", { d: "M12 19V5m-6 6 6-6 6 6" }, null, -1)]]))], 8, _m)
				])
			]),
			y.value ? (G(), K("div", {
				key: 3,
				id: Wt(C),
				ref_key: "panel",
				ref: S,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": b.value === null ? "Choose provider" : T.value,
				class: "model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl"
			}, [q("div", xm, [
				b.value === null ? Y("v-if", !0) : (G(), K("button", {
					key: 0,
					type: "button",
					"aria-label": "Back to providers",
					class: "picker-back rounded-full p-2 hover:bg-[#424242]",
					onClick: re
				}, [...n[10] ||= [q("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					class: "size-5",
					"aria-hidden": "true"
				}, [q("path", { d: "m15 18-6-6 6-6" })], -1)]])),
				q("h2", Sm, F(b.value === null ? "Choose provider" : T.value), 1),
				q("button", {
					type: "button",
					"aria-label": "Close model picker",
					class: "rounded-full px-3 py-2 hover:bg-[#424242]",
					onClick: O
				}, "×")
			]), q("div", Cm, [b.value === null ? (G(), K(W, { key: 0 }, [(G(!0), K(W, null, mr(e.providers, (e) => (G(), K("button", {
				key: e.slug,
				type: "button",
				class: "provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
				"data-provider": e.slug,
				onClick: (t) => k(e.slug)
			}, [q("span", Tm, F(e.name), 1), e.is_current ? (G(), K("span", Em, "Current")) : Y("v-if", !0)], 8, wm))), 128)), q("button", {
				type: "button",
				class: "provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
				"data-provider": "",
				onClick: n[3] ||= (e) => k("")
			}, "Model routes")], 64)) : (G(), K(W, { key: 1 }, [(G(!0), K(W, null, mr(E.value, (t) => (G(), K("button", {
				key: t,
				type: "button",
				class: "model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
				"data-model": t,
				onClick: (e) => ie(t)
			}, [q("span", Om, F(t), 1), (e.provider || "") === b.value && t === (e.model || e.defaultModel) ? (G(), K("span", km, "✓")) : Y("v-if", !0)], 8, Dm))), 128)), E.value.length ? Y("v-if", !0) : (G(), K("p", Am, "No models available"))], 64))])], 8, bm)) : Y("v-if", !0),
			a.value ? (G(), K("div", jm, [q("button", {
				type: "button",
				class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
				onClick: n[4] ||= (e) => l.value?.click()
			}, "Upload files"), q("button", {
				type: "button",
				class: "rounded-xl px-3 py-3 text-left hover:bg-[#303030]",
				onClick: n[5] ||= (e) => u.value?.click()
			}, "Take a photo")])) : Y("v-if", !0)
		], 34));
	}
}), Nm = { class: "app-shell flex min-h-dvh bg-black font-sans text-white dark:bg-black dark:text-white" }, Pm = { class: "brand mb-3 shrink-0 flex items-center gap-2.5 px-2 text-2xl font-semibold" }, Fm = ["disabled"], Im = ["aria-current"], Lm = ["aria-current"], Rm = { class: "sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, zm = { class: "drawer-account flex min-w-0 items-center gap-2" }, Bm = ["value"], Vm = ["value"], Hm = ["value"], Um = ["aria-expanded"], Wm = { class: "flex items-center justify-between gap-2" }, Gm = {
	class: "push-setting",
	"aria-labelledby": "notifications-heading"
}, Km = ["disabled"], qm = ["disabled"], Jm = {
	key: 1,
	class: "mt-1 text-xs text-[#dcae6e]",
	role: "status"
}, Ym = {
	key: 2,
	class: "mt-1 text-xs"
}, Xm = {
	key: 3,
	class: "mt-1 text-xs"
}, Zm = {
	key: 4,
	class: "mt-1 text-xs"
}, Qm = { class: "main-panel flex h-dvh min-w-0 flex-1 flex-col" }, $m = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, eh = ["aria-expanded"], th = { class: "header-title min-w-0 flex-1 truncate text-base font-medium" }, nh = { class: "topbar-profile sr-only" }, rh = ["aria-expanded"], ih = {
	class: "truncate px-3 py-2 text-xs text-[#a3a3a3]",
	role: "presentation"
}, ah = ["disabled"], oh = ["aria-checked"], sh = ["aria-checked"], ch = ["disabled"], lh = ["disabled"], uh = ["disabled"], dh = ["disabled"], fh = { id: "project-confirmation-text" }, ph = {
	key: 0,
	role: "alert",
	class: "project-error"
}, mh = { class: "project-actions" }, hh = ["disabled"], gh = ["disabled"], _h = {
	key: 1,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white",
	role: "status"
}, vh = {
	key: 2,
	class: "notice px-5 py-3 text-sm text-[#b4b4b4]",
	role: "status"
}, yh = {
	key: 3,
	class: "px-5 py-2 text-sm text-[#b4b4b4]",
	role: "status"
}, bh = {
	key: 4,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, xh = ["aria-label"], Sh = { class: "text-2xl font-semibold" }, Ch = {
	key: 8,
	class: "project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10",
	"aria-label": "Selected Project"
}, wh = { class: "project-home-content" }, Th = {
	key: 0,
	role: "status"
}, Eh = {
	key: 1,
	class: "mb-4 text-[#fecaca]",
	role: "alert"
}, Dh = {
	key: 0,
	class: "project-muted"
}, Oh = { class: "mb-4 break-all text-sm text-[#a3a3a3]" }, kh = {
	key: 1,
	class: "text-sm text-[#b4b4b4]"
}, Ah = {
	class: "project-chat-list",
	"aria-label": "Project chats"
}, jh = ["aria-label", "onClick"], Mh = { class: "project-chat-title" }, Nh = {
	key: 0,
	class: "project-chat-preview"
}, Ph = {
	key: 0,
	class: "notice px-5 py-3 text-sm",
	role: "status"
}, Fh = { key: 0 }, Ih = ["disabled", "onClick"], Lh = ["multiple", "onUpdate:modelValue"], Rh = ["onUpdate:modelValue"], zh = ["onUpdate:modelValue", "aria-label"], Bh = ["disabled"], Vh = { key: 3 }, Hh = {
	key: 10,
	class: "px-5 py-2 text-sm text-[#b4b4b4]",
	role: "status"
}, Uh = /* @__PURE__ */ Hn({
	__name: "App",
	setup(e) {
		let t = /* @__PURE__ */ U(!1), n = /* @__PURE__ */ U(0), r = /* @__PURE__ */ U(""), i = /* @__PURE__ */ U(""), a = /* @__PURE__ */ U(), o = /* @__PURE__ */ U(), s = /* @__PURE__ */ U(!1), c = /* @__PURE__ */ U(!1), l = /* @__PURE__ */ U(!1), u = /* @__PURE__ */ U(!1), d = /* @__PURE__ */ U(""), f = /* @__PURE__ */ U(""), p = /* @__PURE__ */ U([]), m = /* @__PURE__ */ U(), h = /* @__PURE__ */ U(!1), g = /* @__PURE__ */ U(!1), _ = /* @__PURE__ */ U(""), v = /* @__PURE__ */ U(""), y = /* @__PURE__ */ U([]), b = /* @__PURE__ */ U(!1), x = X(() => f.value ? m.value ? Fs(m.value) : [] : O.value.filter((e) => !y.value.includes(e.id))), S, C;
		function w() {
			S?.(), S = void 0, typeof EventSource < "u" && (S = !Z.isNative(E.value) && Z.isWorkspace(E.value, D.value) ? Z.projectEvents(E.value, ee, D.value) : Z.projectEvents(E.value, ee));
		}
		function ee() {
			clearTimeout(C), C = setTimeout(() => {
				gt(), f.value && _t();
			}, 100);
		}
		let te, T, E = /* @__PURE__ */ U(""), D = /* @__PURE__ */ U(""), O = /* @__PURE__ */ U([]), ne = /* @__PURE__ */ U([]), k = /* @__PURE__ */ U({}), re = /* @__PURE__ */ U(0), ie = /* @__PURE__ */ U(!1), A = /* @__PURE__ */ U(!1), ae = /* @__PURE__ */ U(!1), oe = /* @__PURE__ */ U(!1), j = /* @__PURE__ */ U(!1), M = /* @__PURE__ */ U(!navigator.onLine), se = /* @__PURE__ */ U(""), N = /* @__PURE__ */ U(""), ce = /* @__PURE__ */ U(""), P = /* @__PURE__ */ U([]), le = /* @__PURE__ */ U(!1), ue = /* @__PURE__ */ new Map(), fe = /* @__PURE__ */ U(), pe = /* @__PURE__ */ U(0), me = 0;
		function he() {
			return `chathermes-ui-${++me}`;
		}
		let ge = /* @__PURE__ */ U([]), _e = /* @__PURE__ */ U([]), ve = /* @__PURE__ */ U(""), ye = /* @__PURE__ */ U(""), be = /* @__PURE__ */ U(!1), xe = /* @__PURE__ */ U([]), Se = /* @__PURE__ */ U(""), Ce = /* @__PURE__ */ U(!1), we = /* @__PURE__ */ U(!1), I = /* @__PURE__ */ U(""), Te = /* @__PURE__ */ U(!1), L = /* @__PURE__ */ U(""), Ee = /* @__PURE__ */ U(null), De = /* @__PURE__ */ U(null), Oe = /* @__PURE__ */ U(null), ke = /* @__PURE__ */ U(!1), Ae = /* @__PURE__ */ U(null), je = X(() => k.value.features?.native_chat === !0 || Z.isWorkspace(E.value, D.value) || f.value ? k.value.features?.session_chat_streaming === !0 : k.value.endpoints?.runs?.method === "POST" && k.value.endpoints.runs.path === "/v1/runs" && k.value.features?.run_events_sse === !0), Me, Ne, Pe, R = 0, Fe = 0, Ie = 0, Le = 0, Re, ze = /* @__PURE__ */ U(!1), Be = /* @__PURE__ */ U({}), Ve = /* @__PURE__ */ U({}), He = /* @__PURE__ */ U(""), Ue = /* @__PURE__ */ U({
			supported: !1,
			permission: "unsupported",
			subscribed: !1,
			available: !1,
			error: ""
		}), We = /* @__PURE__ */ U(!1), Ge = /* @__PURE__ */ U(""), Ke = /* @__PURE__ */ U(!1), qe = /* @__PURE__ */ U(null), Je = /* @__PURE__ */ U(null);
		Mn([
			le,
			E,
			D,
			f,
			c,
			s,
			t
		], () => {
			Ke.value = !1;
		});
		let z = Es(() => {
			ee(), Dt();
		}), B = X(() => k.value.features?.native_chat === !0 && (!I.value || I.value.startsWith("workspace-"))), Ye = X(() => B.value ? z.messages.value : ne.value), Xe = X(() => B.value ? z.busy.value || z.uncertain.value : oe.value), Ze = X(() => B.value ? z.loading.value : ae.value), Qe = X(() => B.value ? z.error.value : N.value), $e = X(() => B.value ? z.approval.value : ot.value), et = X(() => B.value ? !!z.approval.value : j.value), tt = X(() => B.value ? !!D.value && !["open"].includes(z.connection.value) : at.value), nt = X(() => B.value ? z.uncertain.value : ze.value), rt = X(() => B.value ? z.status.value : He.value), it = X(() => B.value ? z.busy.value : !!I.value), at = /* @__PURE__ */ U(!1), V = /* @__PURE__ */ U(""), ot = /* @__PURE__ */ U(), st = /* @__PURE__ */ U(!1), ct = /* @__PURE__ */ U(!1), lt = -1;
		function ut() {
			let e = new URLSearchParams(location.search);
			return {
				profile: e.get("profile") || "",
				session: e.get("session") || "",
				project: e.get("project") || "",
				view: e.get("view") || "",
				archived: e.get("archived") === "1"
			};
		}
		function dt(e = !1) {
			let n = new URL(location.href);
			n.searchParams.delete("profile"), n.searchParams.delete("session"), n.searchParams.delete("project"), n.searchParams.delete("view"), n.searchParams.delete("archived"), n.searchParams.delete("job"), n.searchParams.delete("scheduled_run"), t.value ? n.searchParams.set("view", "scheduled") : c.value ? (n.searchParams.set("view", "projects"), l.value && n.searchParams.set("archived", "1")) : i.value ? n.searchParams.set("view", "project-" + i.value) : s.value && n.searchParams.set("view", "project"), !t.value && f.value && n.searchParams.set("project", f.value), E.value && n.searchParams.set("profile", E.value), !t.value && D.value && n.searchParams.set("session", D.value), history[e ? "replaceState" : "pushState"]({}, "", n.pathname + n.search + n.hash);
		}
		function ft(e = !1) {
			i.value = "", a.value = void 0, r.value = "", t.value = !0, n.value++, c.value = !1, s.value = !1, le.value = !1, e || dt();
		}
		async function pt(e) {
			if (M.value || be.value) return;
			let n = E.value, i = Fe;
			be.value = !0, r.value = "";
			try {
				let r = await Z.create(n);
				if (i !== Fe || n !== E.value || !t.value) return;
				T?.abort(), f.value = "", m.value = void 0, O.value = [r, ...O.value.filter((e) => e.id !== r.id)], await jt(r.id), i === Fe && n === E.value && D.value === r.id && (L.value = e);
			} catch {
				i === Fe && n === E.value && (r.value = "Could not open a chat. Please try again.");
			} finally {
				i === Fe && (be.value = !1);
			}
		}
		function mt() {
			z.close(), ue.clear(), fe.value = void 0, R++, Ie++, Le++, Re?.abort(), I.value = "", at.value = !1, ct.value = !1, ze.value = !1, V.value = "", He.value = "", ot.value = void 0, lt = -1, we.value = !1, Ne?.abort(), Pe?.abort(), ae.value = !1, oe.value = !1, j.value = !1;
		}
		function ht() {
			mt(), Me?.abort(), A.value = !1;
		}
		async function gt() {
			te?.abort();
			let e = new AbortController();
			te = e;
			let t = E.value;
			h.value = !b.value, _.value = "";
			try {
				let n = await Z.projects(t, e.signal);
				if (e !== te || t !== E.value) return;
				if (!Array.isArray(n.projects) || n.projects.some((e) => !e || typeof e.id != "string" || typeof e.label != "string")) throw Error("Invalid Hermes Projects response");
				p.value = n.projects, y.value = n.scoped_session_ids || [], b.value = !0;
			} catch {
				e === te && !e.signal.aborted && (_.value = "Could not load Projects.");
			} finally {
				e === te && (h.value = !1);
			}
		}
		async function _t() {
			T?.abort();
			let e = new AbortController();
			T = e;
			let t = E.value, n = f.value;
			if (n) {
				g.value = !m.value, v.value = "";
				try {
					let r = await Z.project(t, n, e.signal);
					e === T && !e.signal.aborted && t === E.value && n === f.value && (m.value = r);
				} catch (t) {
					e === T && !e.signal.aborted && (v.value = t instanceof Fo && t.status === 404 ? "Project no longer exists. Return to Other chats." : "Could not load this Project. Retry or return to Other chats.");
				} finally {
					e === T && (g.value = !1);
				}
			}
		}
		async function vt(e, n = !1) {
			i.value = "", a.value = void 0, t.value = !1, T?.abort(), c.value = !1, d.value = "", f.value = e, s.value = !!e, m.value = void 0, v.value = "", le.value = !1, n || dt(), await _t();
		}
		function yt(e = !1, n = !1) {
			i.value = "", a.value = void 0, t.value = !1, T?.abort(), g.value = !1, c.value = !0, s.value = !1, l.value = e, le.value = !1, d.value = "", n || dt(), gt();
		}
		async function bt(e) {
			T?.abort(), f.value = "", m.value = void 0, c.value = !1, await jt(e);
		}
		async function xt() {
			return i.value = "", a.value = void 0, t.value = !1, T?.abort(), f.value = "", m.value = void 0, s.value = !1, c.value = !1, await Mt();
		}
		function St(e, t = !1) {
			m.value && !m.value.isNoProject && (i.value = e, s.value = !0, d.value = "", sn(!1), t || dt());
		}
		async function Ct(e) {
			a.value = e, sn(!1), await pn(), o.value?.focus();
		}
		function wt() {
			a.value = void 0, Oe.value?.focus();
		}
		async function Tt() {
			let e = a.value;
			e && (await Et(e, { id: f.value }), d.value || (a.value = void 0));
		}
		async function Et(e, t) {
			if (u.value || M.value) return;
			let n = E.value, r = Fe, i = f.value;
			u.value = !0, d.value = "";
			try {
				let a = await Z.projectManage(n, e, t);
				if (r !== Fe || n !== E.value) return;
				e === "create" && a.project?.id ? await vt(a.project.id) : i === f.value && !c.value && (e === "delete" ? (f.value = "", m.value = void 0, yt(l.value)) : e === "archive" ? (f.value = "", m.value = void 0, yt(t.restore !== !0)) : await _t()), r === Fe && (await gt(), await Dt());
			} catch {
				r === Fe && n === E.value && (d.value = "Could not save the project. Check its fields and try again.");
			} finally {
				r === Fe && (u.value = !1);
			}
		}
		async function Dt(e = !1) {
			Me?.abort();
			let t = new AbortController();
			Me = t;
			let n = E.value;
			A.value = !0, se.value = "";
			try {
				let r = await Z.sessions(n, e ? re.value : 0, t.signal);
				if (t !== Me || n !== E.value) return;
				let i = r.sessions;
				O.value = e ? [...O.value, ...i.filter((e) => !O.value.some((t) => t.id === e.id))] : i, re.value = typeof r.offset == "number" && typeof r.limit == "number" ? r.offset + r.limit : e ? re.value + i.length : i.length, ie.value = r.has_more ?? (typeof r.total == "number" ? re.value < r.total : i.length === 30);
			} catch (e) {
				t === Me && !t.signal.aborted && (se.value = e instanceof Error ? e.message : "Could not load sessions");
			} finally {
				t === Me && (A.value = !1, Me = void 0);
			}
		}
		function Ot(e) {
			if (fe.value && e.filter((e) => e.role === "user").length <= pe.value) return [...e.map((e) => e.id && ue.has(e.id) ? {
				...e,
				content: ue.get(e.id)
			} : e), fe.value];
			if (fe.value) {
				let t = e.filter((e) => e.role === "user")[pe.value];
				t?.id && ue.set(t.id, fe.value.content);
			}
			return fe.value = void 0, e.map((e) => e.id && ue.has(e.id) ? {
				...e,
				content: ue.get(e.id)
			} : e);
		}
		async function kt() {
			if (!D.value) return !1;
			if (B.value) return await z.hydrate(), !0;
			Le++, Re?.abort(), Ne?.abort();
			let e = new AbortController();
			Ne = e;
			let t = R, n = E.value, r = D.value;
			ae.value = !0, N.value = "";
			try {
				let i = await Z.messages(n, r, e.signal);
				if (t === R && e === Ne) {
					Ft(i);
					let e = Ot(i), t = e.reduce((e, t, n) => t.role === "user" ? n : e, -1);
					return ne.value = I.value && !Vt.includes(V.value) && t >= 0 ? e.slice(0, t + 1) : e, !0;
				}
			} catch (n) {
				t === R && e === Ne && !e.signal.aborted && (N.value = n instanceof Error ? n.message : "Could not load messages");
			} finally {
				e === Ne && (ae.value = !1, Ne = void 0);
			}
			return !1;
		}
		async function At(e, n = !1) {
			if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
				se.value = "Invalid profile name";
				return;
			}
			t.value = !1, L.value = "", be.value = !1, i.value = "", a.value = void 0, b.value = !1, S?.(), S = void 0, clearTimeout(C), y.value = [], ht(), te?.abort(), T?.abort(), f.value = "", s.value = !1, c.value = !1, l.value = !1, u.value = !1, d.value = "", m.value = void 0, p.value = [], v.value = "", _.value = "", g.value = !1, E.value = e, D.value = "", O.value = [], ne.value = [], k.value = {}, _e.value = [], xe.value = [], Se.value = "", ve.value = "", ye.value = "", Ce.value = !0, ce.value = "", P.value = [], se.value = "", N.value = "", re.value = 0, ie.value = !1, le.value = !1, n || dt();
			let r = ++Fe;
			w(), gt(), Dt(), Promise.allSettled([Z.models(e), Z.modelOptions(e)]).then(([e, t]) => {
				r === Fe && (e.status === "fulfilled" && (_e.value = e.value.data || [], ye.value = e.value.default_model || ""), t.status === "fulfilled" && Array.isArray(t.value.providers) && (xe.value = t.value.providers.filter((e) => e.models.length || e.is_current), Se.value = xe.value.find((e) => e.is_current)?.slug || t.value.provider || "", ye.value = t.value.model || ye.value), Ce.value = !1);
			});
			try {
				let t = await Z.capabilities(e);
				r === Fe && E.value === e && (k.value = t);
			} catch {
				r === Fe && E.value === e && (k.value = {});
			}
		}
		async function jt(e, n = !1) {
			t.value = !1, (Z.isNative(E.value) || f.value || O.value.find((t) => t.id === e)?.cwd || O.value.find((t) => t.id === e)?.source === "desktop") && Z.workspace(E.value, e), i.value = "", a.value = void 0, s.value = !1, c.value = !1, L.value = "", mt(), D.value = e, ne.value = [], ce.value = "", P.value = [], N.value = "", le.value = !1, n || dt();
			let r = R, o = E.value;
			if (!f.value && !Z.isWorkspace(o, e)) {
				try {
					await Z.session(o, e);
				} catch {}
				if (r !== R || o !== E.value) return;
			}
			w();
			let l = ks(o, e);
			if (Z.isNative(o) && (!l || l.startsWith("workspace-"))) {
				await z.attach(o, e);
				return;
			}
			l && (I.value = l), await kt(), r === R && o === E.value && l && (I.value = l, oe.value = !0, Gt(r, o, e, l, !0));
		}
		async function Mt() {
			if (M.value || be.value || f.value && m.value?.archived) return;
			let e = E.value, t = f.value, n = D.value, r = R;
			be.value = !0;
			try {
				t && !Se.value && (Se.value = xe.value.find((e) => e.is_current)?.slug || "", ve.value = "");
				let i = t ? await Z.projectCreate(e, t) : await Z.create(e);
				if (r !== R || E.value !== e || D.value !== n || f.value !== t) return;
				O.value = [i, ...O.value.filter((e) => e.id !== i.id)];
				let a = jt(i.id), o = R;
				return ee(), await a, o !== R || E.value !== e || D.value !== i.id ? void 0 : i.id;
			} catch (n) {
				if (r === R && E.value === e && f.value === t) {
					let e = n instanceof Error ? n.message : "Could not create session";
					t ? v.value = e : se.value = e;
				}
			} finally {
				be.value = !1;
			}
		}
		async function Nt(e) {
			let t = R, n = E.value, r = await Mt();
			r && t + 1 === R && n === E.value && D.value === r && (L.value = e);
		}
		async function Pt(e, t) {
			let n = E.value, r = R;
			try {
				if (await Z.rename(n, e, t), r !== R || n !== E.value) return;
				let i = O.value.find((t) => t.id === e);
				i && (i.title = t), ee();
			} catch (e) {
				r === R && n === E.value && (se.value = e instanceof Error ? e.message : "Could not rename session");
			}
		}
		function Ft(e) {
			if (!P.value.length || e.filter((e) => e.role === "user").length <= pe.value) return;
			let t = e.reduce((e, t, n) => t.role === "user" ? n : e, -1), n = P.value.filter((e) => e.kind === "tool");
			e.slice(t + 1).filter((e) => e.role === "tool").forEach((e, t) => {
				let r = Jo(e.content);
				n[t] && r && (n[t].output = r);
			});
		}
		function It() {
			P.value.forEach((e) => {
				e.complete = !0;
			}), we.value = !1;
		}
		function Lt(e, t, n) {
			let r = [...P.value].reverse().find((r) => !r.complete && r.kind === e && (n ? r.id === n : r.title === t));
			if (r) return r;
			let i = {
				id: n || he(),
				kind: e,
				title: t,
				content: "",
				complete: !1
			};
			return P.value.push(i), P.value[P.value.length - 1];
		}
		function H(e) {
			let t = Yo(e);
			if (typeof t.run_id == "string" && I.value && t.run_id !== I.value) return;
			let n = typeof t.seq == "number" ? t.seq : e.id === void 0 ? void 0 : Number(e.id);
			if (n !== void 0 && Number.isSafeInteger(n) && n >= 0) {
				if (n <= lt) return;
				lt = n;
			}
			!I.value && typeof t.run_id == "string" && (I.value = t.run_id, Ms(E.value, D.value, t.run_id)), [
				"message.delta",
				"message.interim",
				"assistant.delta",
				"tool.started",
				"reasoning.available",
				"run.steered"
			].includes(e.event) && !j.value && (V.value = "running");
			let r = typeof t.delta == "string" ? t.delta : typeof t.text == "string" ? t.text : "", i = typeof t.tool_call_id == "string" ? t.tool_call_id : void 0, a = typeof t.tool_name == "string" ? t.tool_name : typeof t.tool == "string" ? t.tool : P.value.find((e) => e.kind === "tool" && i && e.id === i)?.toolName || "Tool call";
			if (e.event === "assistant.delta" || e.event === "message.delta") It(), ce.value += r;
			else if (e.event === "assistant.snapshot") ce.value = typeof t.text == "string" ? t.text : "";
			else if (e.event === "status.update") He.value = String(t.text || "");
			else if (e.event === "native.notice") N.value = String(t.text || "Native recovery is bounded.");
			else if (e.event === "assistant.completed" && typeof t.content == "string") It(), ce.value = t.content;
			else if (["assistant.commentary", "message.interim"].includes(e.event) && !t.already_streamed && typeof t.text == "string") ce.value += t.text + "\n\n";
			else if (e.event === "tool.started") {
				P.value.filter((e) => e.kind === "thinking").forEach((e) => {
					e.complete = !0;
				}), we.value = !1;
				let e = [...P.value].reverse().find((e) => e.kind === "tool" && !e.complete && e.state === "running" && e.toolName === a && (!i || e.id === i)), n = e || Lt("tool", Qo(a), i || he());
				n.toolName = a, n.state = "running";
				let r = t.args ? JSON.stringify(t.args, null, 2) : typeof t.preview == "string" ? t.preview : "";
				n.content = e ? [r, n.content].filter(Boolean).join("\n\n") : r;
			} else if ([
				"thinking.delta",
				"reasoning.delta",
				"reasoning.available",
				"tool.progress",
				"tool.delta"
			].includes(e.event)) {
				let n = e.event.startsWith("thinking") || e.event.startsWith("reasoning") || a === "_thinking", o = (n ? P.value.find((e) => e.kind === "thinking" && !e.complete && !e.content) : void 0) || (n ? void 0 : [...P.value].reverse().find((e) => e.kind === "tool" && !e.complete && e.toolName === a)) || Lt(n ? "thinking" : "tool", n ? "Thinking…" : Qo(a), i);
				n || (o.toolName = a, o.state = "running"), o.content += r || (typeof t.preview == "string" ? t.preview : ""), we.value = n;
			} else if (e.event === "tool.completed" || e.event === "tool.failed") {
				let n = [...P.value].reverse().find((e) => e.kind === "tool" && !e.complete && (i && e.id === i || e.toolName === a || e.title === a));
				if (n) {
					let r = e.event === "tool.failed" || t.is_error === !0 || t.error === !0 || typeof t.error == "string" && !!t.error;
					n.complete = !0, n.state = r ? "failed" : "completed", n.title = Qo(n.toolName || a, !0);
					let i = t.output ?? t.result ?? (typeof t.error == "string" ? t.error : t.preview);
					i !== void 0 && (n.output = typeof i == "string" ? i : JSON.stringify(i, null, 2)), typeof t.duration_s == "number" && (n.duration = t.duration_s);
				}
			} else if (e.event === "approval.request") It(), j.value = !0, ot.value = t, V.value = "waiting_for_approval";
			else if (e.event === "approval.responded") j.value = !1, ot.value = void 0, V.value = "running";
			else if (e.event === "replay.truncated") N.value = "Some earlier run events expired. Saved history will be restored when the run finishes.";
			else if ([
				"run.completed",
				"run.failed",
				"run.cancelled",
				"run.interrupted",
				"error"
			].includes(e.event)) return ee(), It(), j.value = !1, ot.value = void 0, V.value = e.event.slice(4), typeof t.output == "string" && (ce.value = t.output), e.event !== "run.completed" && (N.value = `Run ${V.value}. Check conversation history before retrying.`), "completed";
		}
		function Rt() {
			return "turn-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
		}
		async function zt(e, n) {
			if (t.value || Xe.value || be.value || et.value || M.value || !je.value || Ce.value || (s.value || !D.value) && !await Mt()) return;
			let r = R, i = E.value, a = [{
				type: "text",
				text: e
			}, ...n.map((e) => e.type.startsWith("image/") ? {
				type: "image_url",
				image_url: { url: e.data }
			} : {
				type: "text",
				text: "📎 " + e.name
			})];
			try {
				await z.submit(e, async () => {
					let t = [{
						type: "text",
						text: e || "Please examine the attached files."
					}];
					for (let e of n) {
						let n = await Z.upload(i, e);
						if (r !== R) throw Error("Session changed before submission");
						t.push({
							type: "text",
							text: `Attached ${e.type.startsWith("image/") ? "image" : "file"} ${e.name.replace(/[\r\n]/g, " ")}: ${n.path}`
						}), e.type.startsWith("image/") && t.push({
							type: "image_url",
							image_url: { url: e.data }
						});
					}
					return n.length ? t : e;
				}, {
					model: ve.value || ye.value,
					provider: Se.value || void 0
				}, a);
			} catch (t) {
				r === R && !z.uncertain.value && (z.error.value = t instanceof Error ? t.message : "Message not submitted", L.value = e);
			}
		}
		async function Bt(e, n = []) {
			if (B.value) {
				await zt(e, n);
				return;
			}
			if (t.value || oe.value || be.value || j.value || M.value || !je.value || Ce.value || (s.value || !D.value) && !await Mt() || oe.value || j.value) return;
			Le++, Re?.abort(), oe.value = !0, we.value = !0, I.value = "", lt = -1, V.value = "", He.value = "", ot.value = void 0, at.value = !1, N.value = "", ce.value = "", P.value = [], Lt("thinking", "Thinking…"), pe.value = ne.value.filter((e) => e.role === "user").length, fe.value = {
				id: "pending-" + he(),
				role: "user",
				content: [{
					type: "text",
					text: e
				}, ...n.map((e) => e.type.startsWith("image/") ? {
					type: "image_url",
					image_url: { url: e.data }
				} : {
					type: "text",
					text: "📎 " + e.name
				})]
			}, ne.value.push(fe.value), Pe = new AbortController();
			let r = R, i = ++Ie, a = E.value, o = D.value, c = !1;
			try {
				let t = [{
					type: "text",
					text: e || "Please examine the attached files."
				}];
				for (let e of n) if (e.type.startsWith("image/")) t.push({
					type: "image_url",
					image_url: { url: e.data }
				});
				else {
					let n = await Z.upload(a, e);
					if (r !== R) return;
					t.push({
						type: "text",
						text: `Attached file ${e.name}: ${n.path}`
					});
				}
				if (!Z.isWorkspace(a, o)) {
					let i = As(a, o) || Rt();
					js(a, o, i);
					let s = () => Z.startRun(a, o, n.length ? t : e, ve.value || ye.value, Se.value, i), c;
					try {
						c = await s();
					} catch (e) {
						if (e instanceof Fo && e.status < 500) throw e;
						c = await s();
					}
					if (Ms(a, o, c.run_id), r !== R) return;
					I.value = c.run_id, await Gt(r, a, o, c.run_id, !1);
					return;
				}
				for await (let s of Z.stream(a, o, n.length ? t : e, Pe.signal, ve.value || ye.value, Se.value)) {
					if (r !== R || i !== Ie) return;
					if (H(s) === "completed") {
						c = !0;
						break;
					}
				}
				if (r !== R || i !== Ie) return;
				if (!c && I.value) {
					await Gt(r, a, o, I.value, !1);
					return;
				}
				if (!c) throw Error("Stream ended without a run ID. Check session history before retrying.");
				await Ht(r, a, o, I.value);
			} catch (e) {
				if (r === R) {
					if (e instanceof Fo && e.status >= 500) try {
						await kt();
					} catch {}
					N.value = e instanceof Error ? e.message : "Send failed. Check session history before retrying.";
				}
			} finally {
				r === R && !I.value && (oe.value = !1, It());
			}
		}
		let Vt = [
			"completed",
			"failed",
			"cancelled",
			"interrupted",
			"stopped"
		];
		async function Ht(e, t, n, r) {
			if (e === R) {
				if (It(), j.value = !1, ot.value = void 0, !await kt()) throw at.value = !0, Error("Run ended, but history could not be loaded. Retry loading history before starting another turn.");
				e === R && (ce.value = "", lt = -1, Ns(t, n, r), I.value = "", oe.value = !1, at.value = !1, ct.value = !1, Z.isNative(t) && await z.attach(t, n), Dt());
			}
		}
		function Ut(e) {
			return new Promise((t) => {
				let n = () => {
					clearTimeout(r), e.removeEventListener("abort", n), t();
				}, r = setTimeout(n, 1e3);
				e.addEventListener("abort", n, { once: !0 }), e.aborted && n();
			});
		}
		async function Gt(e, t, n, r, i) {
			if (e !== R || ct.value) return;
			Pe?.abort();
			let a = new AbortController();
			Pe = a;
			let o = ++Ie;
			for (oe.value = !0, at.value = i; e === R && o === Ie && !a.signal.aborted;) {
				try {
					let s = await Z.runStatus(t, r, a.signal);
					if (e !== R || a.signal.aborted || o !== Ie) return;
					let c = s.status || s.run?.status || "";
					if (V.value = c, Vt.includes(c)) {
						typeof s.output == "string" && (ce.value = s.output), c !== "completed" && (N.value = `Run ${c}.`), await Ht(e, t, n, r);
						return;
					}
					if (j.value = c === "waiting_for_approval", ot.value = s.approval, i) {
						let e = ne.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
						e >= 0 && (ne.value = ne.value.slice(0, e + 1)), ce.value = "", P.value = [], lt = -1, i = !1;
					}
					at.value = !1;
					let l = !1;
					for await (let n of Z.runEvents(t, r, a.signal, lt)) {
						if (e !== R || o !== Ie || a.signal.aborted) return;
						if (H(n) === "completed") {
							l = !0;
							break;
						}
					}
					if (l) {
						await Ht(e, t, n, r);
						return;
					}
					at.value = !0;
				} catch (i) {
					if (e !== R || a.signal.aborted || o !== Ie) return;
					if (at.value = !0, i instanceof Fo && i.status === 403) {
						N.value = "Hermes denied access to this run. Check the selected profile and permissions.";
						return;
					}
					if (i instanceof Fo && i.status === 404) try {
						let i = await Z.runStatus(t, r, a.signal);
						if (e !== R || a.signal.aborted || o !== Ie) return;
						let s = i.status || i.run?.status || "";
						if (V.value = s, Vt.includes(s)) {
							await Ht(e, t, n, r);
							return;
						}
						for (ct.value = !0, at.value = !1, N.value = "The live stream expired, so new progress cannot reconnect. Hermes is still working; you can refresh session history at any time."; e === R && o === Ie && !a.signal.aborted;) {
							if (await Ut(a.signal), e !== R || o !== Ie || a.signal.aborted) return;
							let i = await Z.runStatus(t, r, a.signal);
							if (e !== R || o !== Ie || a.signal.aborted) return;
							let s = i.status || i.run?.status || "";
							if (V.value = s, j.value = s === "waiting_for_approval", ot.value = i.approval, Vt.includes(s)) {
								typeof i.output == "string" && (ce.value = i.output), s !== "completed" && (N.value = `Run ${s}.`), await Ht(e, t, n, r);
								return;
							}
						}
						return;
					} catch (i) {
						if (e !== R || a.signal.aborted || o !== Ie) return;
						if (i instanceof Fo && i.status === 403) {
							N.value = "Hermes denied access to this run. Check the selected profile and permissions.";
							return;
						}
						if (i instanceof Fo && i.status === 404) {
							ze.value = !0, N.value = "Run state is unavailable. Refresh history and verify the turn in Hermes before starting another.";
							return;
						}
						for (N.value = "Could not verify run status. Retrying status checks; the event stream cannot be reattached.", ct.value = !0, at.value = !1; e === R && o === Ie && !a.signal.aborted;) {
							if (await Ut(a.signal), e !== R || o !== Ie || a.signal.aborted) return;
							let i;
							try {
								i = await Z.runStatus(t, r, a.signal);
							} catch (e) {
								if (e instanceof Fo && (e.status === 403 || e.status === 404)) {
									e.status === 404 ? (ze.value = !0, N.value = "Run state is unavailable. Refresh history and verify the turn in Hermes before starting another.") : N.value = "Hermes denied access to this run. Check the selected profile and permissions.";
									return;
								}
								continue;
							}
							if (e !== R || o !== Ie || a.signal.aborted) return;
							let s = i.status || i.run?.status || "";
							if (V.value = s, j.value = s === "waiting_for_approval", ot.value = i.approval, Vt.includes(s)) {
								typeof i.output == "string" && (ce.value = i.output), s !== "completed" && (N.value = `Run ${s}.`), await Ht(e, t, n, r);
								return;
							}
						}
						return;
					}
				}
				await Ut(a.signal);
			}
		}
		async function Kt() {
			if (B.value) {
				try {
					await z.stop();
				} catch {
					z.error.value = "Could not stop the response.";
				}
				return;
			}
			let e = E.value, t = I.value, n = R;
			if (t && !st.value) {
				st.value = !0;
				try {
					await Z.stop(e, t), n === R && t === I.value && (V.value = "stopping");
				} catch {
					n === R && (N.value = "Could not stop the run. Retry.");
				} finally {
					st.value = !1;
				}
			}
		}
		async function qt(e) {
			if (B.value) {
				let t = z.approval.value?.request_id;
				if (typeof t == "string") try {
					await z.answer(t, { choice: e });
				} catch {
					z.error.value = "Approval could not be settled.";
				}
				return;
			}
			let t = E.value, n = I.value, r = R, i = ot.value?.request_id;
			if (n && !st.value) {
				st.value = !0;
				try {
					await Z.approve(t, n, e, typeof i == "string" ? i : void 0), r === R && (j.value = !1, ot.value = void 0, V.value = "running");
				} catch {
					r === R && (N.value = "Could not resolve approval. Refresh run state and retry.");
				} finally {
					st.value = !1;
				}
			}
		}
		async function Jt() {
			if (B.value) {
				let e = z.approval.value?.request_id, t = Object.fromEntries(Object.entries(Be.value).map(([e, t]) => [e, Array.isArray(t) ? t.join(", ") : t]));
				if (Object.assign(t, Ve.value), typeof e == "string") try {
					await z.answer(e, { answers: t }), Be.value = {}, Ve.value = {};
				} catch {
					z.error.value = "Clarification could not be settled.";
				}
				return;
			}
		}
		async function Yt(e) {
			if (B.value) {
				try {
					await z.steer(e);
				} catch {
					z.error.value = "Response did not accept guidance.";
				}
				return;
			}
			let t = E.value, n = I.value, r = R;
			if (e.trim() && !st.value && n) {
				st.value = !0;
				try {
					await Z.steer(t, n, e.trim());
				} catch {
					r === R && (N.value = "Run did not accept guidance. Refresh run state and retry.");
				} finally {
					st.value = !1;
				}
			}
		}
		async function Xt() {
			if (document.visibilityState !== "visible") return;
			if (B.value) {
				D.value && z.reconnect();
				return;
			}
			if (ee(), I.value && !ct.value) {
				Gt(R, E.value, D.value, I.value, !1);
				return;
			}
			if (!D.value) return;
			if (ct.value && I.value) {
				try {
					if (!await kt()) throw Error("history");
					N.value = "Session history refreshed. Live progress cannot reconnect; another turn will be available after this run finishes.";
				} catch {
					N.value = "Could not refresh session history. Retry history; the current run is still locked.";
				}
				return;
			}
			Re?.abort();
			let e = new AbortController();
			Re = e;
			let t = R, n = ++Le, r = E.value, i = D.value, a = Ne;
			try {
				let o = await Z.messages(r, i, e.signal);
				t === R && n === Le && !e.signal.aborted && !a && (Ft(o), ne.value = Ot(o));
			} catch {} finally {
				Re === e && (Re = void 0);
			}
		}
		async function Zt() {
			if (B.value) {
				await z.resolveUncertainty();
				return;
			}
			let e = R, t = E.value, n = D.value, r = I.value;
			if (!ze.value) return;
			let i = V.value;
			if (V.value = "stopped", !await kt() || e !== R) {
				e === R && (V.value = i);
				return;
			}
			lt = -1, Ns(t, n, r), Pe?.abort(), I.value = "", oe.value = !1, ze.value = !1, at.value = !1, ct.value = !1, j.value = !1, ce.value = "", P.value = [];
		}
		function Qt() {
			location.href = "/";
		}
		function $t() {
			M.value = !navigator.onLine, M.value || (ee(), Dt(), Xt());
		}
		function en() {
			let e = ut(), t = At(e.profile, !0), n = R;
			t.then(() => {
				n === R && E.value === e.profile && (e.view === "scheduled" ? ft(!0) : e.view === "projects" ? yt(e.archived, !0) : e.project ? vt(e.project, !0).then(() => {
					n === R && (e.view === "project-edit" || e.view === "project-instructions" ? St(e.view === "project-edit" ? "edit" : "instructions", !0) : e.session && e.view !== "project" && jt(e.session, !0));
				}) : e.session && jt(e.session, !0));
			});
		}
		function tn() {
			Ke.value = !1, le.value = !1, Ee.value?.focus();
		}
		async function nn() {
			le.value = !0, await pn(), De.value?.focus();
		}
		function rn(e = !1) {
			Ke.value = !1, e && qe.value?.focus();
		}
		async function an() {
			if (Ke.value) {
				rn(!0);
				return;
			}
			Ke.value = !0, await pn(), Je.value?.focus();
		}
		function on(e) {
			Ke.value && e.target instanceof Node && !Je.value?.contains(e.target) && !qe.value?.contains(e.target) && rn();
		}
		function sn(e = !0) {
			ke.value && (ke.value = !1, e && Oe.value?.focus());
		}
		function cn(e) {
			ke.value && Ae.value && !e.composedPath().includes(Ae.value) && sn(!1);
		}
		function ln(e) {
			e.key === "Escape" && (Ke.value ? (e.preventDefault(), rn(!0)) : le.value ? tn() : sn());
		}
		async function un() {
			Ue.value = await Up();
		}
		async function dn() {
			if (!We.value) {
				We.value = !0, Ge.value = "";
				try {
					Ue.value.subscribed ? await Gp(E.value) : await Wp(E.value), await un();
				} catch (e) {
					Ge.value = e instanceof Error ? e.message : "Could not update notifications.", await un();
				} finally {
					We.value = !1;
				}
			}
		}
		async function fn() {
			if (!We.value) {
				We.value = !0, Ge.value = "";
				try {
					await Kp(E.value), Ge.value = "Test notification scheduled.";
				} catch {
					Ge.value = "Could not send a test notification.";
				} finally {
					We.value = !1;
				}
			}
		}
		function mn(e) {
			if (e.data?.type === "chathermes.route.query") {
				e.ports[0]?.postMessage({
					type: "chathermes.route",
					url: document.visibilityState === "visible" && document.hasFocus() ? location.href : ""
				});
				return;
			}
			if (e.data?.type !== "chathermes.navigate" || typeof e.data.url != "string") return;
			let t = new URL(e.data.url, location.origin);
			t.origin === location.origin && t.pathname === "/chathermes" && (history.pushState({}, "", t.pathname + t.search), en());
		}
		return ir(async () => {
			Z.profiles().then((e) => {
				ge.value = e.profiles || [];
			}).catch(() => {
				se.value = "Could not load profiles";
			}), un(), "serviceWorker" in navigator && navigator.serviceWorker.addEventListener("message", mn), Te.value = !!Ee.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", Xt), addEventListener("online", $t), addEventListener("offline", $t), addEventListener("popstate", en), addEventListener("keydown", ln), document.addEventListener("pointerdown", on), document.addEventListener("click", cn);
			let e = ut(), t = At(e.profile, !0), n = R;
			await t, n === R && E.value === e.profile && (e.view === "scheduled" ? ft(!0) : e.view === "projects" ? yt(e.archived, !0) : e.project ? vt(e.project, !0).then(() => {
				n === R && (e.view === "project-edit" || e.view === "project-instructions" ? St(e.view === "project-edit" ? "edit" : "instructions", !0) : e.session && e.view !== "project" && jt(e.session, !0));
			}) : e.session && jt(e.session, !0));
		}), cr(() => {
			Fe++, S?.(), clearTimeout(C), document.removeEventListener("visibilitychange", Xt), "serviceWorker" in navigator && navigator.serviceWorker.removeEventListener("message", mn), ht(), te?.abort(), T?.abort(), removeEventListener("online", $t), removeEventListener("offline", $t), removeEventListener("popstate", en), removeEventListener("keydown", ln), document.removeEventListener("pointerdown", on), document.removeEventListener("click", cn);
		}), (e, y) => (G(), K("div", Nm, [
			q("aside", {
				class: de(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white", le.value ? "translate-x-0" : "-translate-x-full"]),
				"aria-label": "Navigation"
			}, [
				q("div", Pm, [
					y[24] ||= q("span", { class: "brand-mark grid size-9 shrink-0 place-items-center text-white" }, "✳", -1),
					y[25] ||= q("span", null, "ChatHermes", -1),
					q("button", {
						ref_key: "closeButton",
						ref: De,
						class: "mobile-close ml-auto px-2 text-2xl leading-none min-[701px]:hidden focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Close navigation",
						onClick: tn
					}, "×", 512)
				]),
				q("button", {
					class: "drawer-chat flex min-h-[44px] shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030] disabled:opacity-55",
					disabled: M.value || be.value,
					onClick: xt
				}, [...y[26] ||= [q("svg", {
					class: "size-6",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [q("path", { d: "M14 4H4v16h16V10M12 12l9-9M16 3h5v5" })], -1), J("New chat", -1)]], 8, Fm),
				q("button", {
					class: "projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": c.value || s.value ? "page" : void 0,
					onClick: y[0] ||= (e) => yt()
				}, [...y[27] ||= [q("svg", {
					class: "size-6",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"aria-hidden": "true"
				}, [q("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1), J("Projects", -1)]], 8, Im),
				q("button", {
					class: "scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": t.value ? "page" : void 0,
					onClick: y[1] ||= (e) => ft()
				}, [...y[28] ||= [q("svg", {
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
				}), q("path", { d: "M7 3v4M17 3v4M3 11h18M8 15h3M8 18h6" })], -1), J("Scheduled", -1)]], 8, Lm),
				Te.value ? (G(), K("button", {
					key: 0,
					class: "drawer-dashboard min-h-[44px] rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					onClick: Qt
				}, "← Hermes Desktop")) : Y("v-if", !0),
				Wi(rm, {
					heading: "Recents",
					sessions: O.value,
					selected: D.value,
					loading: A.value,
					error: se.value,
					"has-more": ie.value,
					busy: M.value || be.value,
					onSelect: bt,
					onCreate: xt,
					onMore: y[2] ||= (e) => Dt(!0),
					onRetry: y[3] ||= (e) => Dt(),
					onRename: Pt
				}, null, 8, [
					"sessions",
					"selected",
					"loading",
					"error",
					"has-more",
					"busy"
				]),
				q("div", Rm, [
					y[33] ||= q("label", { for: "profile-field" }, "Profile", -1),
					q("div", zm, [q("select", {
						id: "profile-field",
						class: "profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white",
						value: E.value,
						onChange: y[4] ||= (e) => At(e.target.value)
					}, [
						y[29] ||= q("option", { value: "" }, "Current profile", -1),
						E.value && !ge.value.some((e) => e.name === E.value) ? (G(), K("option", {
							key: 0,
							value: E.value
						}, F(E.value), 9, Vm)) : Y("v-if", !0),
						(G(!0), K(W, null, mr(ge.value, (e) => (G(), K("option", {
							key: e.name,
							value: e.name
						}, F(e.name), 9, Hm))), 128))
					], 40, Bm), q("button", {
						ref_key: "settingsButton",
						ref: qe,
						class: "drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]",
						"aria-label": "Settings",
						"aria-haspopup": "dialog",
						"aria-controls": "drawer-settings",
						"aria-expanded": Ke.value,
						onClick: an
					}, [...y[30] ||= [q("svg", {
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
					})], -1)]], 8, Um)]),
					q("span", null, [q("span", { class: de(["status-dot mr-2 inline-block size-2 rounded-full", M.value ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), J(F(M.value ? "Offline · read only" : "Connected through dashboard"), 1)]),
					Ke.value ? (G(), K("section", {
						key: 0,
						id: "drawer-settings",
						ref_key: "settingsPanel",
						ref: Je,
						class: "settings-panel absolute bottom-full left-0 right-0 mb-3 max-h-[60dvh] overflow-y-auto rounded-2xl border border-[#424242] bg-black p-3 shadow-xl",
						role: "dialog",
						"aria-label": "Settings",
						tabindex: "-1"
					}, [q("div", Wm, [y[31] ||= q("h2", { class: "text-base font-medium text-white" }, "Settings", -1), q("button", {
						class: "size-11 rounded-lg text-xl text-white hover:bg-[#303030]",
						"aria-label": "Close settings",
						onClick: y[5] ||= (e) => rn(!0)
					}, "×")]), q("div", Gm, [
						y[32] ||= q("h3", {
							id: "notifications-heading",
							class: "text-sm font-medium text-white"
						}, "Notifications", -1),
						q("button", {
							class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
							disabled: We.value || !Ue.value.supported || !Ue.value.subscribed && !Ue.value.available,
							onClick: dn
						}, F(We.value ? "Updating…" : Ue.value.subscribed ? "Disable notifications" : "Enable notifications"), 9, Km),
						Ue.value.subscribed ? (G(), K("button", {
							key: 0,
							class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
							disabled: We.value || !Ue.value.available,
							onClick: fn
						}, "Send test", 8, qm)) : Y("v-if", !0),
						Ue.value.error || Ge.value ? (G(), K("p", Jm, F(Ge.value || Ue.value.error), 1)) : Ue.value.subscribed ? (G(), K("p", Ym, "Notifications enabled on this device.")) : Ue.value.supported ? Ue.value.permission === "denied" ? (G(), K("p", Zm, "Allow notifications in browser settings to enable them.")) : Y("v-if", !0) : (G(), K("p", Xm, "Install ChatHermes on a secure HTTPS origin to enable notifications."))
					])], 512)) : Y("v-if", !0)
				])
			], 2),
			le.value ? (G(), K("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				onClick: tn
			})) : Y("v-if", !0),
			q("main", Qm, [
				q("header", $m, [
					q("button", {
						ref_key: "menuButton",
						ref: Ee,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": le.value,
						onClick: nn
					}, [...y[34] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, eh),
					q("h1", th, F(t.value ? "Scheduled" : c.value ? "Projects" : (f.value ? m.value?.label : O.value.find((e) => e.id === D.value)?.title) || (D.value ? "Conversation" : m.value?.label || "ChatHermes")), 1),
					q("span", nh, F(E.value || "Current profile"), 1),
					q("div", {
						ref_key: "screenMenuWrap",
						ref: Ae,
						class: "screen-menu-wrap relative",
						onKeydown: y[16] ||= To(Co((e) => sn(), ["stop", "prevent"]), ["esc"])
					}, [q("button", {
						ref_key: "screenMenuButton",
						ref: Oe,
						class: "screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]",
						"aria-label": "Screen options",
						"aria-haspopup": "menu",
						"aria-expanded": ke.value,
						"aria-controls": "screen-menu",
						onClick: y[6] ||= (e) => ke.value = !ke.value
					}, "···", 8, rh), ke.value ? (G(), K("div", {
						key: 0,
						id: "screen-menu",
						class: "screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl",
						role: "menu",
						"aria-label": "Screen options",
						onClick: y[15] ||= (e) => sn()
					}, [
						q("span", ih, F(E.value || "Current profile"), 1),
						q("button", {
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: M.value || be.value || s.value && (!m.value || m.value.archived || !m.value.isNoProject && !Wt(Ps)(m.value)),
							onClick: y[7] ||= (e) => {
								s.value ? Mt() : xt(), sn();
							}
						}, "New chat", 8, ah),
						c.value ? (G(), K(W, { key: 0 }, [q("button", {
							role: "menuitemradio",
							"aria-checked": !l.value,
							onClick: y[8] ||= (e) => yt(!1)
						}, "Active projects", 8, oh), q("button", {
							role: "menuitemradio",
							"aria-checked": l.value,
							onClick: y[9] ||= (e) => yt(!0)
						}, "Archived projects", 8, sh)], 64)) : !t.value && m.value && !m.value.isNoProject ? (G(), K(W, { key: 1 }, [
							q("button", {
								role: "menuitem",
								onClick: y[10] ||= (e) => St("edit")
							}, "Edit project"),
							q("button", {
								role: "menuitem",
								disabled: M.value || !Wt(Ps)(m.value),
								onClick: y[11] ||= (e) => St("instructions")
							}, "Edit Instructions", 8, ch),
							m.value.isAuto ? Y("v-if", !0) : (G(), K(W, { key: 0 }, [m.value.archived ? (G(), K("button", {
								key: 0,
								role: "menuitem",
								disabled: u.value || M.value,
								onClick: y[12] ||= (e) => Et("archive", {
									id: f.value,
									restore: !0
								})
							}, "Restore project", 8, lh)) : (G(), K("button", {
								key: 1,
								role: "menuitem",
								disabled: u.value || M.value,
								onClick: y[13] ||= (e) => Ct("archive")
							}, "Archive project", 8, uh)), q("button", {
								class: "project-danger",
								role: "menuitem",
								disabled: u.value || M.value,
								onClick: y[14] ||= (e) => Ct("delete")
							}, "Delete project", 8, dh)], 64))
						], 64)) : Y("v-if", !0)
					])) : Y("v-if", !0)], 544)
				]),
				a.value && m.value ? (G(), K("div", {
					key: 0,
					class: "project-confirmation mx-6",
					role: "alertdialog",
					"aria-labelledby": "project-confirmation-text",
					onKeydown: y[17] ||= To(Co((e) => !u.value && wt(), ["stop", "prevent"]), ["esc"])
				}, [
					q("p", fh, F(a.value === "delete" ? `Delete ${m.value.label}? This permanently removes the project and its folder associations. Files and chats will be kept.` : `Archive ${m.value.label}? You can restore it from Archived projects.`), 1),
					d.value ? (G(), K("p", ph, F(d.value), 1)) : Y("v-if", !0),
					q("div", mh, [q("button", {
						ref_key: "projectConfirmCancel",
						ref: o,
						class: "project-button",
						disabled: u.value,
						onClick: wt
					}, "Cancel", 8, hh), q("button", {
						class: "project-button project-danger",
						disabled: u.value || M.value,
						onClick: Tt
					}, F(a.value === "delete" ? "Delete project permanently" : "Confirm archive"), 9, gh)])
				], 32)) : Y("v-if", !0),
				M.value ? (G(), K("div", _h, "You are offline. Messages cannot be loaded or sent.")) : Y("v-if", !0),
				!t.value && tt.value ? (G(), K("div", vh, F(ct.value ? "Live progress is unavailable; checking run status…" : "Reconnecting to the live response…"), 1)) : Y("v-if", !0),
				!t.value && !I.value && Vt.includes(V.value) ? (G(), K("div", yh, "Run " + F(V.value) + ".", 1)) : Y("v-if", !0),
				!t.value && Qe.value ? (G(), K("div", bh, [
					J(F(Qe.value) + " ", 1),
					D.value ? (G(), K("button", {
						key: 0,
						class: "underline",
						onClick: y[18] ||= (e) => ct.value && I.value ? Xt() : kt()
					}, F(ct.value && I.value ? "Refresh session history" : "Refresh history"), 1)) : Y("v-if", !0),
					y[35] ||= J(),
					nt.value ? (G(), K("button", {
						key: 1,
						class: "ml-3 underline",
						onClick: Zt
					}, "I verified the run ended")) : Y("v-if", !0)
				])) : Y("v-if", !0),
				t.value ? (G(), zi(Wf, {
					key: `${E.value}:${n.value}`,
					profile: E.value,
					"chat-busy": be.value,
					offline: M.value,
					"discussion-error": r.value,
					onDiscuss: pt
				}, null, 8, [
					"profile",
					"chat-busy",
					"offline",
					"discussion-error"
				])) : c.value ? (G(), zi(rp, {
					key: E.value,
					projects: p.value,
					archived: l.value,
					loading: h.value,
					error: _.value || d.value,
					busy: u.value,
					offline: M.value,
					onSelect: vt,
					onRetry: gt,
					onManage: Et
				}, null, 8, [
					"projects",
					"archived",
					"loading",
					"error",
					"busy",
					"offline"
				])) : i.value && m.value ? (G(), K("section", {
					key: 7,
					class: "page-content project-editor",
					"aria-label": i.value === "edit" ? "Edit project" : "Edit Instructions"
				}, [
					q("button", {
						class: "project-back",
						onClick: y[19] ||= (e) => vt(f.value)
					}, "← " + F(m.value.label), 1),
					q("h2", Sh, F(i.value === "edit" ? "Edit project" : "Edit Instructions"), 1),
					i.value === "edit" ? (G(), zi(Ep, {
						key: `${E.value}:${m.value.id}`,
						project: m.value,
						busy: u.value,
						offline: M.value,
						error: d.value,
						onManage: Et
					}, null, 8, [
						"project",
						"busy",
						"offline",
						"error"
					])) : (G(), zi(Fp, {
						key: `${E.value}:${m.value.id}`,
						profile: E.value,
						"project-id": m.value.id,
						offline: M.value
					}, null, 8, [
						"profile",
						"project-id",
						"offline"
					]))
				], 8, xh)) : s.value ? (G(), K("section", Ch, [q("div", wh, [
					q("button", {
						class: "project-back",
						onClick: y[20] ||= (e) => yt(!!m.value?.archived)
					}, "← Projects"),
					g.value ? (G(), K("p", Th, "Loading Project…")) : Y("v-if", !0),
					v.value ? (G(), K("p", Eh, [J(F(v.value) + " ", 1), q("button", {
						class: "underline",
						onClick: _t
					}, "Retry Project")])) : Y("v-if", !0),
					m.value ? (G(), K(W, { key: 2 }, [
						m.value.archived ? (G(), K("p", Dh, "Archived project")) : Y("v-if", !0),
						q("p", Oh, F(Wt(Ps)(m.value) ? "Workspace: " + Wt(Ps)(m.value) : m.value.isNoProject ? "No project workspace" : "No workspace configured"), 1),
						x.value.length ? Y("v-if", !0) : (G(), K("p", kh, "No conversations yet.")),
						q("nav", Ah, [(G(!0), K(W, null, mr(x.value, (e) => (G(), K("button", {
							key: e.id,
							class: "project-chat-row",
							"aria-label": e.title || "Untitled session",
							onClick: (t) => jt(e.id)
						}, [q("span", Mh, F(e.title || "Untitled session"), 1), e.preview?.trim() ? (G(), K("span", Nh, F(e.preview), 1)) : Y("v-if", !0)], 8, jh))), 128))]),
						q("button", {
							class: "project-back mt-5",
							onClick: y[21] ||= (e) => vt("")
						}, "Other chats")
					], 64)) : Y("v-if", !0)
				])])) : (G(), zi(Cf, {
					key: 9,
					profile: E.value,
					messages: Ye.value,
					draft: B.value ? "" : ce.value,
					loading: Ze.value,
					progress: B.value ? [] : P.value,
					thinking: B.value ? Xe.value : we.value,
					working: Xe.value || et.value,
					"approval-pending": et.value,
					"status-label": et.value ? $e.value?.kind === "clarify" ? "Waiting for your answers" : "Waiting for approval" : V.value === "stopping" ? "Stopping…" : rt.value === "Working…" ? "" : rt.value,
					home: !D.value,
					onSuggest: Nt
				}, {
					request: Tn(() => [et.value ? (G(), K("div", Ph, [
						$e.value?.kind === "clarify" ? Y("v-if", !0) : (G(), K("p", Fh, "Approval required" + F($e.value?.command ? ": " + $e.value.command : ""), 1)),
						it.value && (Wt(Z).isNative(E.value) || !I.value.startsWith("workspace-")) && $e.value?.kind !== "clarify" ? (G(!0), K(W, { key: 1 }, mr(Array.isArray($e.value?.choices) ? $e.value.choices : [], (e) => (G(), K("button", {
							key: String(e),
							class: "mr-3 rounded-lg bg-[#303030] px-3 py-2 text-base disabled:opacity-55",
							disabled: st.value,
							onClick: (t) => qt(String(e))
						}, F(e === "once" ? "Allow once" : e === "deny" ? "Deny" : e === "session" ? "Allow for session" : "Always allow"), 9, Ih))), 128)) : Y("v-if", !0),
						$e.value?.kind === "clarify" ? (G(), K("form", {
							key: 2,
							onSubmit: Co(Jt, ["prevent"])
						}, [(G(!0), K(W, null, mr($e.value.questions, (e) => (G(), K("label", {
							key: e.qid,
							class: "block my-3"
						}, [
							J(F(e.question) + " ", 1),
							e.choices?.length ? En((G(), K("select", {
								key: 0,
								multiple: e.multi_select,
								"onUpdate:modelValue": (t) => Be.value[e.qid] = t,
								class: "block rounded-lg bg-[#303030] p-2 text-base"
							}, [y[36] ||= q("option", { value: "" }, "Select an answer", -1), (G(!0), K(W, null, mr(e.choices, (e) => (G(), K("option", { key: e }, F(e), 1))), 128))], 8, Lh)), [[go, Be.value[e.qid]]]) : Y("v-if", !0),
							e.choices?.length ? En((G(), K("input", {
								key: 2,
								"onUpdate:modelValue": (t) => Ve.value[e.qid] = t,
								placeholder: "Or enter your own answer",
								"aria-label": e.question + " — custom answer",
								class: "mt-2 block w-full rounded-lg bg-[#303030] p-2 text-base"
							}, null, 8, zh)), [[po, Ve.value[e.qid]]]) : En((G(), K("input", {
								key: 1,
								"onUpdate:modelValue": (t) => Be.value[e.qid] = t,
								class: "block w-full rounded-lg bg-[#303030] p-2 text-base"
							}, null, 8, Rh)), [[po, Be.value[e.qid]]])
						]))), 128)), q("button", {
							disabled: st.value,
							class: "rounded-lg bg-[#303030] p-2 text-base"
						}, "Submit answers", 8, Bh)], 32)) : !Wt(Z).isNative(E.value) && I.value.startsWith("workspace-") ? (G(), K("p", Vh, "Resolve this workspace approval in Hermes.")) : Y("v-if", !0)
					])) : Y("v-if", !0)]),
					_: 1
				}, 8, [
					"profile",
					"messages",
					"draft",
					"loading",
					"progress",
					"thinking",
					"working",
					"approval-pending",
					"status-label",
					"home"
				])),
				!t.value && it.value && !tt.value && V.value === "stopping" ? (G(), K("div", Hh, "Stopping…")) : Y("v-if", !0),
				(G(), zi(Mm, {
					"project-name": !t.value && !c.value && !m.value?.isNoProject ? m.value?.label : void 0,
					key: JSON.stringify([E.value, D.value]),
					disabled: !!i.value || t.value || c.value || s.value && m.value?.archived || s.value && (!m.value || !m.value.isNoProject && !Wt(Ps)(m.value)) || M.value || be.value || Ce.value || Ze.value || et.value || nt.value || tt.value || !je.value,
					models: !Wt(Z).isNative(E.value) && (f.value || Wt(Z).isWorkspace(E.value, D.value)) ? [] : _e.value,
					providers: xe.value,
					"models-loading": Ce.value,
					provider: Se.value,
					"onUpdate:provider": y[22] ||= (e) => Se.value = e,
					"default-model": ye.value,
					model: ve.value,
					"onUpdate:model": y[23] ||= (e) => ve.value = e,
					sending: Xe.value,
					stoppable: it.value && !st.value,
					"suggested-prompt": L.value,
					reason: t.value ? "Open a chat to discuss a run." : c.value ? "Select a project or start a new chat." : s.value && m.value?.archived ? "Restore this project to start a new chat." : s.value && m.value && !m.value.isNoProject && !Wt(Ps)(m.value) ? "This Project has no workspace." : M.value ? "Offline · sending is unavailable." : et.value ? "Approval is pending in Hermes." : je.value ? void 0 : "Streaming turns are unavailable for this profile.",
					onStop: Kt,
					onSteer: Yt,
					onSend: Bt
				}, null, 8, [
					"project-name",
					"disabled",
					"models",
					"providers",
					"models-loading",
					"provider",
					"default-model",
					"model",
					"sending",
					"stoppable",
					"suggested-prompt",
					"reason"
				]))
			])
		]));
	}
});
//#endregion
//#region src/main.ts
function Wh() {
	return ko(Uh);
}
//#endregion
export { Uh as App, Wh as createChatHermesApp };
