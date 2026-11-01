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
}, d = Object.prototype.hasOwnProperty, f = (e, t) => d.call(e, t), p = Array.isArray, m = (e) => C(e) === "[object Map]", h = (e) => C(e) === "[object Set]", g = (e) => C(e) === "[object Date]", _ = (e) => typeof e == "function", v = (e) => typeof e == "string", y = (e) => typeof e == "symbol", b = (e) => typeof e == "object" && !!e, x = (e) => (b(e) || _(e)) && _(e.then) && _(e.catch), S = Object.prototype.toString, C = (e) => S.call(e), w = (e) => C(e).slice(8, -1), T = (e) => C(e) === "[object Object]", E = (e) => v(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ n(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, D = /-\w/g, O = te((e) => e.replace(D, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, k = te((e) => e.replace(ne, "-$1").toLowerCase()), A = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), j = te((e) => e ? `on${A(e)}` : ""), M = (e, t) => !Object.is(e, t), re = (e, ...t) => {
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
}, oe, N = () => oe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function P(e) {
	if (p(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = v(r) ? ue(r) : P(r);
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
var I = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", L = /* @__PURE__ */ n(I);
I + "";
function R(e) {
	return !!e || e === "";
}
function de(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = he(e[i], t[i], n);
	return r;
}
function fe(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && he(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function pe(e, t, n) {
	let r = m(e), i = m(t);
	if (r || i || (r = h(e), i = h(t), r || i)) return r && i ? fe(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !he(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function me(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function he(e, t, n) {
	if (e === t) return !0;
	let r = g(e), i = g(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = y(e), i = y(t), r || i ? e === t : (r = p(e), i = p(t), r || i ? r && i ? me(e, t, n, de) : !1 : (r = b(e), i = b(t), r || i ? !r || !i ? !1 : me(e, t, n, pe) : String(e) === String(t))));
}
function ge(e, t) {
	return e.findIndex((e) => he(e, t));
}
var _e = (e) => !!(e && e.__v_isRef === !0), z = (e) => v(e) ? e : e == null ? "" : p(e) || b(e) && (e.toString === S || !_(e.toString)) ? _e(e) ? z(e.value) : JSON.stringify(e, ve, 2) : String(e), ve = (e, t) => _e(t) ? ve(e, t.value) : m(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[ye(t, r) + " =>"] = n, e), {}) } : h(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => ye(e)) } : y(t) ? ye(t) : b(t) && !p(t) && !T(t) ? String(t) : t, ye = (e, t = "") => y(e) ? `Symbol(${e.description ?? t})` : e, be, xe = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && be && (be.active ? (this.parent = be, this.index = (be.scopes || (be.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = be;
			try {
				return be = this, e();
			} finally {
				be = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = be, be = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (be === this) be = this.prevScope;
			else {
				let e = be;
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
function Se() {
	return be;
}
function Ce(e, t = !1) {
	be && be.cleanups.push(e);
}
var we, Te = /* @__PURE__ */ new WeakSet(), Ee = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, be && (be.active ? be.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Te.has(this) && (Te.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ae(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ue(this), Ne(this);
		let e = we, t = ze;
		we = this, ze = !0;
		try {
			return this.fn();
		} finally {
			Pe(this), we = e, ze = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Le(e);
			this.deps = this.depsTail = void 0, Ue(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Te.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Fe(this) && this.run();
	}
	get dirty() {
		return Fe(this);
	}
}, De = 0, Oe, ke;
function Ae(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = ke, ke = e;
		return;
	}
	e.next = Oe, Oe = e;
}
function je() {
	De++;
}
function Me() {
	if (--De > 0) return;
	if (ke) {
		let e = ke;
		for (ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Oe;) {
		let t = Oe;
		for (Oe = void 0; t;) {
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
function Ne(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pe(e) {
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
	let t = e.dep, n = we, r = ze;
	we = e, ze = !0;
	try {
		Ne(e);
		let n = e.fn(e._value);
		(t.version === 0 || M(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		we = n, ze = r, Pe(e), e.flags &= -3;
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
		let e = we;
		we = void 0;
		try {
			t();
		} finally {
			we = e;
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
		if (!we || !ze || we === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== we) t = this.activeLink = new Ge(we, this), we.deps ? (t.prevDep = we.depsTail, we.depsTail.nextDep = t, we.depsTail = t) : we.deps = we.depsTail = t, qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = we.depsTail, t.nextDep = void 0, we.depsTail.nextDep = t, we.depsTail = t, we.deps === t && (we.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, We++, this.notify(e);
	}
	notify(e) {
		je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Me();
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
	if (ze && we) {
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
	if (je(), t === "clear") o.forEach(s);
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
	Me();
}
function et(e) {
	let t = /* @__PURE__ */ Vt(e);
	return t === e || (Qe(t, "iterate", Ze), /* @__PURE__ */ zt(e)) ? t : /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e) ? t.map((e) => Wt(Ut(e))) : t.map(Wt) : t.map(Ut);
}
function tt(e) {
	return Qe(e = /* @__PURE__ */ Vt(e), "iterate", Ze), e;
}
function nt(e, t) {
	return /* @__PURE__ */ Rt(e) ? Wt(/* @__PURE__ */ Lt(e) ? Ut(t) : t) : Ut(t);
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
	return r !== e && !/* @__PURE__ */ zt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var at = Array.prototype;
function ot(e, t, n, r, i, a) {
	let o = tt(e), s = o !== e && !/* @__PURE__ */ zt(e), c = o[t];
	if (c !== at[t]) {
		let t = c.apply(e, a);
		return s ? Ut(t) : t;
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
	let i = tt(e), a = i !== e && !/* @__PURE__ */ zt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = nt(e, t)), n.call(this, t, nt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? nt(e, c) : c;
}
function ct(e, t, n) {
	let r = /* @__PURE__ */ Vt(e);
	Qe(r, "iterate", Ze);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Bt(n[0]) ? (n[0] = /* @__PURE__ */ Vt(n[0]), r[t](...n)) : i;
}
function lt(e, t, n = []) {
	Ve(), je();
	let r = (/* @__PURE__ */ Vt(e))[t].apply(e, n);
	return Me(), He(), r;
}
var ut = /* @__PURE__ */ n("__proto__,__v_isRef,__isVue"), dt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(y));
function ft(e) {
	y(e) || (e = String(e));
	let t = /* @__PURE__ */ Vt(this);
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
		let o = Reflect.get(e, t, /* @__PURE__ */ Gt(e) ? e : n);
		if ((y(t) ? dt.has(t) : ut(t)) || (r || Qe(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Gt(o)) {
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
			let e = /* @__PURE__ */ Rt(i);
			if (!/* @__PURE__ */ zt(n) && !/* @__PURE__ */ Rt(n) && (i = /* @__PURE__ */ Vt(i), n = /* @__PURE__ */ Vt(n)), !a && /* @__PURE__ */ Gt(i) && !/* @__PURE__ */ Gt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : f(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Gt(e) ? e : r);
		return e === /* @__PURE__ */ Vt(r) && s && (o ? M(n, i) && $e(e, "set", t, n, i) : $e(e, "add", t, n)), s;
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
		let i = this.__v_raw, a = /* @__PURE__ */ Vt(i), o = m(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, u = i[e](...r), d = n ? yt : t ? Wt : Ut;
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
			let r = this.__v_raw, i = /* @__PURE__ */ Vt(r), a = /* @__PURE__ */ Vt(n);
			e || (M(n, a) && Qe(i, "get", n), Qe(i, "get", a));
			let { has: o } = bt(i), s = t ? yt : e ? Wt : Ut;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && Qe(/* @__PURE__ */ Vt(t), "iterate", Ye), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ Vt(n), i = /* @__PURE__ */ Vt(t);
			return e || (M(t, i) && Qe(r, "has", t), Qe(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ Vt(a), s = t ? yt : e ? Wt : Ut;
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
			let n = /* @__PURE__ */ Vt(this), r = bt(n), i = /* @__PURE__ */ Vt(e), a = !t && !/* @__PURE__ */ zt(e) && !/* @__PURE__ */ Rt(e) ? i : e;
			return r.has.call(n, a) || M(e, a) && r.has.call(n, e) || M(i, a) && r.has.call(n, i) || (n.add(a), $e(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ zt(n) && !/* @__PURE__ */ Rt(n) && (n = /* @__PURE__ */ Vt(n));
			let r = /* @__PURE__ */ Vt(this), { has: i, get: a } = bt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ Vt(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? M(n, s) && $e(r, "set", e, n, s) : $e(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ Vt(this), { has: n, get: r } = bt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ Vt(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && $e(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ Vt(this), t = e.size !== 0, n = e.clear();
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
	return /* @__PURE__ */ Rt(e) ? e : It(e, !1, gt, Tt, Ot);
}
// @__NO_SIDE_EFFECTS__
function Pt(e) {
	return It(e, !1, vt, Et, kt);
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return It(e, !0, _t, Dt, At);
}
function It(e, t, n, r, i) {
	if (!b(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Mt(w(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return /* @__PURE__ */ Rt(e) ? /* @__PURE__ */ Lt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ Vt(t) : e;
}
function Ht(e) {
	return !f(e, "__v_skip") && Object.isExtensible(e) && ie(e, "__v_skip", !0), e;
}
var Ut = (e) => b(e) ? /* @__PURE__ */ Nt(e) : e, Wt = (e) => b(e) ? /* @__PURE__ */ Ft(e) : e;
// @__NO_SIDE_EFFECTS__
function Gt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function B(e) {
	return qt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return qt(e, !0);
}
function qt(e, t) {
	return /* @__PURE__ */ Gt(e) ? e : new Jt(e, t);
}
var Jt = class {
	constructor(e, t) {
		this.dep = new Ke(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ Vt(e), this._value = t ? e : Ut(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ zt(e) || /* @__PURE__ */ Rt(e);
		e = n ? e : /* @__PURE__ */ Vt(e), M(e, t) && (this._rawValue = e, this._value = n ? e : Ut(e), this.dep.trigger());
	}
};
function V(e) {
	return /* @__PURE__ */ Gt(e) ? e.value : e;
}
var Yt = {
	get: (e, t, n) => t === "__v_raw" ? e : V(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Gt(i) && !/* @__PURE__ */ Gt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Xt(e) {
	return /* @__PURE__ */ Lt(e) ? e : new Proxy(e, Yt);
}
var Zt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ke(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = We - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && we !== this) return Ae(this, !0), !0;
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
function Qt(e, t, n = !1) {
	let r, i;
	return _(e) ? r = e : (r = e.get, i = e.set), new Zt(r, i, n);
}
var $t = {}, en = /* @__PURE__ */ new WeakMap(), tn = void 0;
function nn(e, t = !1, n = tn) {
	if (n) {
		let t = en.get(n);
		t || en.set(n, t = []), t.push(e);
	}
}
function rn(e, t, n = r) {
	let { immediate: i, deep: o, once: s, scheduler: c, augmentJob: l, call: d } = n, f = (e) => o ? e : /* @__PURE__ */ zt(e) || o === !1 || o === 0 ? an(e, 1) : an(e), m, h, g, v, y = !1, b = !1;
	if (/* @__PURE__ */ Gt(e) ? (h = () => e.value, y = /* @__PURE__ */ zt(e)) : /* @__PURE__ */ Lt(e) ? (h = () => f(e), y = !0) : p(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Lt(e) || /* @__PURE__ */ zt(e)), h = () => e.map((e) => {
		if (/* @__PURE__ */ Gt(e)) return e.value;
		if (/* @__PURE__ */ Lt(e)) return f(e);
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
		let t = tn;
		tn = m;
		try {
			return d ? d(e, 3, [v]) : e(v);
		} finally {
			tn = t;
		}
	} : a, t && o) {
		let e = h, t = o === !0 ? Infinity : o;
		h = () => an(e(), t);
	}
	let x = Se(), S = () => {
		m.stop(), x && x.active && u(x.effects, m);
	};
	if (s && t) {
		let e = t;
		t = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill($t) : $t, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (t) {
				let n = m.run();
				if (e || o || y || (b ? n.some((e, t) => M(e, C[t])) : M(n, C))) {
					g && g();
					let e = tn;
					tn = m;
					try {
						let e = [
							n,
							C === $t ? void 0 : b && C[0] === $t ? [] : C,
							v
						];
						C = n, d ? d(t, 3, e) : t(...e);
					} finally {
						tn = e;
					}
				}
			} else m.run();
		}
	};
	return l && l(w), m = new Ee(h), m.scheduler = c ? () => c(w, !1) : w, v = (e) => nn(e, !1, m), g = m.onStop = () => {
		let e = en.get(m);
		if (e) {
			if (d) d(e, 4);
			else for (let t of e) t();
			en.delete(m);
		}
	}, t ? i ? w(!0) : C = m.run() : c ? c(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function an(e, t = Infinity, n) {
	if (t <= 0 || !b(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Gt(e)) an(e.value, t, n);
	else if (p(e)) for (let r = 0; r < e.length; r++) an(e[r], t, n);
	else if (h(e) || m(e)) e.forEach((e) => {
		an(e, t, n);
	});
	else if (T(e)) {
		for (let r in e) an(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && an(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function on(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		cn(e, t, n);
	}
}
function sn(e, t, n, r) {
	if (_(e)) {
		let i = on(e, t, n, r);
		return i && x(i) && i.catch((e) => {
			cn(e, t, n);
		}), i;
	}
	if (p(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(sn(e[a], t, n, r));
		return i;
	}
}
function cn(e, t, n, i = !0) {
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
			Ve(), on(o, null, 10, [
				e,
				i,
				a
			]), He();
			return;
		}
	}
	ln(e, n, a, i, s);
}
function ln(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var un = [], dn = -1, fn = [], pn = null, mn = 0, hn = /* @__PURE__ */ Promise.resolve(), gn = null;
function _n(e) {
	let t = gn || hn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function vn(e) {
	let t = dn + 1, n = un.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = un[r], a = wn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function yn(e) {
	if (!(e.flags & 1)) {
		let t = wn(e), n = un[un.length - 1];
		!n || !(e.flags & 2) && t >= wn(n) ? un.push(e) : un.splice(vn(t), 0, e), e.flags |= 1, bn();
	}
}
function bn() {
	gn ||= hn.then(Tn);
}
function xn(e) {
	if (!p(e)) pn && e.id === -1 ? pn.splice(mn + 1, 0, e) : e.flags & 1 || (fn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) fn.push(e[t]);
	bn();
}
function Sn(e, t, n = dn + 1) {
	for (; n < un.length; n++) {
		let t = un[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			un.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Cn(e) {
	if (fn.length) {
		let e = [...new Set(fn)].sort((e, t) => wn(e) - wn(t));
		if (fn.length = 0, pn) {
			for (let t = 0; t < e.length; t++) pn.push(e[t]);
			return;
		}
		for (pn = e, mn = 0; mn < pn.length; mn++) {
			let e = pn[mn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		pn = null, mn = 0;
	}
}
var wn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Tn(e) {
	try {
		for (dn = 0; dn < un.length; dn++) {
			let e = un[dn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), on(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; dn < un.length; dn++) {
			let e = un[dn];
			e && (e.flags &= -2);
		}
		dn = -1, un.length = 0, Cn(e), gn = null, (un.length || fn.length) && Tn(e);
	}
}
var En = null, Dn = null;
function On(e) {
	let t = En;
	return En = e, Dn = e && e.type.__scopeId || null, t;
}
function kn(e, t = En, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Vi(-1);
		let i = On(t), a = Li.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Li.length; e > a; e--) zi();
			On(i), r._d && Vi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function An(e, t) {
	if (En === null) return e;
	let n = ba(En), i = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [a, o, s, c = r] = t[e];
		a && (_(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && an(o), i.push({
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
		c && (Ve(), sn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), He());
	}
}
function Mn(e, t) {
	if (oa) {
		let n = oa.provides, r = oa.parent && oa.parent.provides;
		r === n && (n = oa.provides = Object.create(r)), n[e] = t;
	}
}
function Nn(e, t, n = !1) {
	let r = sa();
	if (r || Wr) {
		let i = Wr ? Wr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
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
	if (pa) {
		if (s === "sync") {
			let e = Fn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = a, e.resume = a, e.pause = a, e;
		}
	}
	let p = oa;
	u.call = (e, t, n) => sn(e, p, t, n);
	let m = !1;
	s === "post" ? u.scheduler = (e) => {
		xi(e, p && p.suspense);
	} : s !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : yn(e);
	}), u.augmentJob = (e) => {
		t && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = rn(e, t, u);
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
		for (let n of e) if (n.type !== Fi) {
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
	let s = i.shapeFlag & 4 ? ba(i.component) : i.el, c = a ? null : s, { i: l, r: d } = e, m = t && t.r, h = l.refs === r ? l.refs = {} : l.refs, g = l.setupState, y = /* @__PURE__ */ Vt(g), b = g === r ? o : (e) => !Jn(h, e) && f(y, e), x = (e, t) => !(t && Jn(h, t));
	if (m != null && m !== d) {
		if (Zn(t), v(m)) h[m] = null, b(m) && (g[m] = null);
		else if (/* @__PURE__ */ Gt(m)) {
			let e = t;
			x(m, e.k) && (m.value = null), e.k && (h[e.k] = null);
		}
	}
	if (_(d)) on(d, l, 12, [c, h]);
	else {
		let t = v(d), r = /* @__PURE__ */ Gt(d);
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
				t.id = -1, Yn.set(e, t), xi(t, n);
			} else Zn(e), i();
		}
	}
}
function Zn(e) {
	let t = Yn.get(e);
	t && (t.flags |= 8, Yn.delete(e));
}
N().requestIdleCallback, N().cancelIdleCallback;
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
			Ve();
			let i = ua(n), a = sn(t, n, e, r);
			return i(), He(), a;
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
function _r(e, t, n, r) {
	let i, a = n && n[r], o = p(e);
	if (o || v(e)) {
		let n = o && /* @__PURE__ */ Lt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ zt(e), s = /* @__PURE__ */ Rt(e), e = tt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Wt(Ut(e[n])) : Ut(e[n]) : e[n], n, void 0, a && a[n]);
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
	if (n ??= {}, En.ce || En.parent && Qn(En.parent) && En.parent.ce) {
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
		yn(e.update);
	},
	$nextTick: (e) => e.n ||= _n.bind(e.proxy),
	$watch: (e) => Rn.bind(e)
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
		if (u) return t === "$attrs" && Qe(e.attrs, "get", ""), u(e);
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
	let { data: i, computed: o, methods: s, watch: c, provide: l, inject: u, created: d, beforeMount: f, mounted: m, beforeUpdate: h, updated: g, activated: v, deactivated: y, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: E, renderTriggered: ee, errorCaptured: te, serverPrefetch: D, expose: O, inheritAttrs: ne, components: k, directives: A, filters: j } = t;
	if (u && Or(u, r, null), s) for (let e in s) {
		let t = s[e];
		_(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		b(t) && (e.data = /* @__PURE__ */ Nt(t));
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
			Mn(t, e[t]);
		});
	}
	d && kr(d, e, "c");
	function M(e, t) {
		p(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (M(or, f), M(sr, m), M(cr, h), M(lr, g), M(er, v), M(tr, y), M(hr, te), M(mr, E), M(pr, ee), M(ur, S), M(dr, w), M(fr, D), p(O)) {
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
	T && e.render === a && (e.render = T), ne != null && (e.inheritAttrs = ne), k && (e.components = k), A && (e.directives = A), D && qn(e);
}
function Or(e, t, n = a) {
	p(e) && (e = Ir(e));
	for (let n in e) {
		let r = e[n], i;
		i = b(r) ? "default" in r ? Nn(r.from || n, r.default, !0) : Nn(r.from || n) : Nn(r), /* @__PURE__ */ Gt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function kr(e, t, n) {
	sn(p(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Ar(e, t, n, r) {
	let i = r.includes(".") ? zn(n, r) : () => n[r];
	if (v(e)) {
		let n = t[e];
		_(n) && In(i, n);
	} else if (_(e)) In(i, e.bind(n));
	else if (b(e)) {
		if (p(e)) e.forEach((e) => Ar(e, t, n, r));
		else {
			let r = _(e.handler) ? e.handler.bind(n) : t[e.handler];
			_(r) && In(i, r, e);
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
				s && (sn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
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
var Wr = null, Gr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${k(t)}Modifiers`];
function Kr(e, t, ...n) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || r, a = n, o = t.startsWith("update:"), s = o && Gr(i, t.slice(7));
	s && (s.trim && (a = n.map((e) => v(e) ? e.trim() : e)), s.number && (a = a.map(ae)));
	let c, l = i[c = j(t)] || i[c = j(O(t))];
	!l && o && (l = i[c = j(k(t))]), l && sn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, sn(u, e, 6, a);
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
	return !e || !s(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), f(e, t[0].toLowerCase() + t.slice(1)) || f(e, k(t)) || f(e, t));
}
function Xr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = On(e), v, y;
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
		Li.length = 0, cn(t, e, 1), v = qi(Fi);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(c) && (y = Qr(y, a)), b = Xi(b, y, !1, !0));
	}
	return n.dirs && (b = Xi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Gn(Vn(b.type) && Wn(b) || b, n.transition), v = b, On(_), v;
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
	return n === "style" && b(r) && b(i) ? !he(r, i) : r !== i;
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
	e.props = n ? r ? i : /* @__PURE__ */ Pt(i) : e.type.props ? i : a, e.attrs = a;
}
function si(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ Vt(i), [c] = e.propsOptions, l = !1;
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
						let t = O(o);
						i[t] = li(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		ci(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !f(t, a) && ((r = k(a)) === a || !f(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = li(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !f(t, e)) && (delete a[e], l = !0);
	}
	l && $e(e.attrs, "set", "");
}
function ci(e, t, n, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (t) for (let r in t) {
		if (ee(r)) continue;
		let l = t[r], u;
		a && f(a, u = O(r)) ? !o || !o.includes(u) ? n[u] = l : (c ||= {})[u] = l : Yr(e.emitsOptions, r) || (!(r in i) || l !== i[r]) && (i[r] = l, s = !0);
	}
	if (o) {
		let t = /* @__PURE__ */ Vt(n), i = c || r;
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
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === k(n)) && (r = !0));
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
		let t = O(s[e]);
		fi(t) && (c[t] = r);
	}
	else if (s) for (let e in s) {
		let t = O(e);
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
	return e[0] !== "$" && !ee(e);
}
var pi = (e) => e === "_" || e === "_ctx" || e === "$stable", mi = (e) => p(e) ? e.map(Qi) : [Qi(e)], hi = (e, t, n) => {
	if (t._n) return t;
	let r = kn((...e) => mi(t(...e)), n);
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
		e ? (vi(r, t, n), n && ie(r, "_", e, !0)) : gi(t, r);
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
	let n = N();
	n.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = a, insertStaticContent: _ } = e, v = (e, t, n, r = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Wi(e, t) && (r = R(e), le(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === i && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
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
				k(e, t, n, r, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, n, r, a, o, s, c, l) : f & 6 ? A(e, t, n, r, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, n, r, a, o, s, c, l, pe);
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
				n && n._beginPatch(), D(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && te(e.children, d, null, r, i, wi(e, a), s, u), _ && jn(e, null, r, "created"), E(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && na(f, r, e);
		}
		_ && jn(e, null, r, "beforeMount");
		let v = Ei(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && xi(() => {
			try {
				f && na(f, r, e), v && g.enter(d), _ && jn(e, null, r, "mounted");
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
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? $i(e[l]) : Qi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, D = (e, t, n, i, a, o, s) => {
		let l = t.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = t;
		u |= e.patchFlag & 16;
		let m = e.props || r, h = t.props || r, g;
		if (n && Ti(n, !1), (g = h.onVnodeBeforeUpdate) && na(g, n, t, e), f && jn(t, e, n, "beforeUpdate"), n && Ti(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? O(e.dynamicChildren, d, l, n, i, wi(t, a), o) : s || oe(e, t, l, null, n, i, wi(t, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && xi(() => {
			g && na(g, n, t, e), f && jn(t, e, n, "updated");
		}, i);
	}, O = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === U || !Wi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, i, a) => {
		if (t !== n) {
			if (t !== r) for (let r in t) !ee(r) && !(r in n) && c(e, r, t[r], null, a, i);
			for (let r in n) {
				if (ee(r)) continue;
				let o = n[r], s = t[r];
				o !== s && r !== "value" && c(e, r, s, o, a, i);
			}
			"value" in n && c(e, "value", t.value, n.value, a);
		}
	}, k = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), te(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (O(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Di(e, t, !0)) : oe(e, t, n, f, i, a, s, c, l);
	}, A = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : j(t, n, r, i, a, o, c) : M(e, t, c);
	}, j = (e, t, n, r, i, a, o) => {
		let s = e.component = aa(e, r, i);
		if ($n(e) && (s.ctx.renderer = pe), ma(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ie, o), !e.el) {
				let r = s.subTree = qi(Fi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ie(s, e, t, n, i, a, o);
	}, M = (e, t, n) => {
		let r = t.component = e.component;
		if ($r(e, t, n)) {
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
					let n = ki(e);
					if (n) {
						t && (t.el = c.el, ae(e, t, o)), n.asyncDep.then(() => {
							xi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Ti(e, !1), t ? (t.el = c.el, ae(e, t, o)) : t = c, n && re(n), (d = t.props && t.props.onVnodeBeforeUpdate) && na(d, s, t, c), Ti(e, !0);
				let f = Xr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), R(p), e, i, a), t.el = f.el, u === null && ni(e, f.el), r && xi(r, i), (d = t.props && t.props.onVnodeUpdated) && xi(() => na(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Qn(t);
				if (Ti(e, !1), l && re(l), !m && (o = c && c.onVnodeBeforeMount) && na(o, d, t), Ti(e, !0), s && he) {
					let t = () => {
						e.subTree = Xr(e), he(s, e.subTree, e, i, null);
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
				(t.shapeFlag & 256 || d && Qn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && xi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ee(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => yn(u), Ti(e, !0), l();
	}, ae = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, si(e, t.props, r, n), bi(e, t.children, n), Ve(), Sn(e), He();
	}, oe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				se(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				P(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && L(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? se(l, d, n, r, i, a, o, s, c) : L(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && te(d, n, r, i, a, o, s, c));
	}, P = (e, t, n, r, a, o, s, c, l) => {
		e ||= i, t ||= i;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let r = t[p] = l ? $i(t[p]) : Qi(t[p]);
			v(e[p], r, n, null, a, o, s, c, l);
		}
		u > d ? L(e, a, o, !0, !1, f) : te(t, n, r, a, o, s, c, l, f);
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
			c.move(e, t, n, pe);
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
			if (r === 0) l.persisted && !a[Hn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), xi(() => l.enter(a), i));
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
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ve(), Xn(s, null, n, e, !0), He()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Qn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && na(_, t, e), u & 6) I(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && jn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, pe, r) : l && !l.hasOnce && (a !== U || d > 0 && d & 64) ? L(l, t, n, !1, !0) : (a === U && d & 384 || !i && u & 16) && L(c, t, n), r && ue(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && xi(() => {
			_ && na(_, t, e), h && jn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ue = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === U) {
			F(n, r);
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
	}, F = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, I = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ai(c), Ai(l), r && re(r), i.stop(), a ? (a.flags |= 8, le(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, le(o, e, t, n)), s && xi(s, t), xi(() => {
			e.isUnmounted = !0;
		}, t);
	}, L = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) le(e[o], t, n, r, i);
	}, R = (e) => {
		if (e.shapeFlag & 6) return R(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Bn];
		return n ? h(n) : t;
	}, de = !1, fe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (le(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, de ||= (de = !0, Sn(r), Cn(), !1);
	}, pe = {
		p: v,
		um: le,
		m: ce,
		r: ue,
		mt: j,
		mc: te,
		pc: oe,
		pbc: O,
		n: R,
		o: e
	}, me, he;
	return t && ([me, he] = t(pe)), {
		render: fe,
		hydrate: me,
		createApp: Ur(fe, me)
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
	t && t.pendingBranch ? p(e) ? t.effects.push(...e) : t.effects.push(e) : xn(e);
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
var Gi = ({ key: e }) => e ?? null, Ki = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : v(e) || /* @__PURE__ */ Gt(e) || _(e) ? {
	i: En,
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
		scopeId: Dn,
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
		ctx: En
	};
	return s ? (ea(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= v(n) ? 8 : 16), Bi > 0 && !o && Ri && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ri.push(c), c;
}
var qi = Ji;
function Ji(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === gr) && (e = Fi), Ui(e)) {
		let r = Xi(e, t, !0);
		return n && ea(r, n), Bi > 0 && !a && Ri && (r.shapeFlag & 6 ? Ri[Ri.indexOf(e)] = r : Ri.push(r)), r.patchFlag = -2, r;
	}
	if (xa(e) && (e = e.__vccOpts), t) {
		t = Yi(t);
		let { class: e, style: n } = t;
		e && !v(e) && (t.class = F(e)), b(n) && (/* @__PURE__ */ Bt(n) && !p(n) && (n = l({}, n)), t.style = P(n));
	}
	let o = v(e) ? 1 : Mi(e) ? 128 : Vn(e) ? 64 : b(e) ? 4 : _(e) ? 2 : 0;
	return q(e, t, n, r, i, o, a, !0);
}
function Yi(e) {
	return e ? /* @__PURE__ */ Bt(e) || ai(e) ? l({}, e) : e : null;
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
	return c && r && Gn(u, c.clone(u)), u;
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
			!r && !ai(t) ? t._ctx = En : r === 3 && En && (En.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (_(t)) {
		if (r & 65) {
			ea(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: En
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [J(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ta(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = F([t.class, r.class]));
		else if (e === "style") t.style = P([t.style, r.style]);
		else if (s(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(p(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !c(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function na(e, t, n, r = null) {
	sn(e, t, 7, [n, r]);
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
		scope: new xe(!0),
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
var oa = null, sa = () => oa || En, ca, la;
{
	let e = N(), t = (t, n) => {
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
		Ve();
		let n = e.setupContext = r.length > 1 ? ya(e) : null, i = ua(e), a = on(r, e, 0, [e.props, n]), o = x(a);
		if (He(), i(), (o || e.sp) && !Qn(e) && qn(e), o) {
			if (a.then(da, da), t) return a.then((n) => {
				la(!0);
				try {
					ga(e, n, t);
				} finally {
					la(!1);
				}
			}).catch((t) => {
				cn(t, e, 0);
			});
			e.asyncDep = a;
		} else ga(e, a, t);
	} else _a(e, t);
}
function ga(e, t, n) {
	_(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : b(t) && (e.setupState = Xt(t)), _a(e, n);
}
function _a(e, t, n) {
	let r = e.type;
	e.render ||= r.render || a;
	{
		let t = ua(e);
		Ve();
		try {
			Dr(e);
		} finally {
			He(), t();
		}
	}
}
var va = { get(e, t) {
	return Qe(e, "get", ""), e[t];
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
	return e.exposed ? e.exposeProxy ||= new Proxy(Xt(Ht(e.exposed)), {
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
var X = (e, t) => /* @__PURE__ */ Qt(e, t, pa);
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
		Va.test(n) ? e.setProperty(k(r), n.replace(Va, ""), "important") : e[r] = n;
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
	let r = O(t);
	if (r !== "filter" && r in e) return Wa[t] = r;
	r = A(r);
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
function Ja(e, t, n, r, i, a = L(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(qa, t.slice(6, t.length)) : e.setAttributeNS(qa, t, n) : n == null || a && !R(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : y(n) ? String(n) : n);
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
		r === "boolean" ? n = R(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
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
	return [e[2] === ":" ? e.slice(3) : k(e.slice(2)), t];
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
				e && sn(e, t, 5, a);
			}
		} else sn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ao(), n;
}
var so = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, co = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Na(e, r, o) : t === "style" ? Ba(e, n, r) : s(t) ? c(t) || $a(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : lo(e, t, r, o)) ? (Ya(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ja(e, t, r, o, a, t !== "value")) : e._isVueCE && (uo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !v(r))) ? Ya(e, O(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ja(e, t, r, o));
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
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
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
				let e = ge(t, n), a = e !== -1;
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
	if (p(t)) i = ge(t, r.props.value) > -1;
	else if (h(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = he(t, To(e, !0));
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
				_n(() => {
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
	if (!n || p(e)) return he(e, t);
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
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : ge(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (he(wo(a), t)) {
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
		let r = k(n.key);
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
	let t = Nn(Bs), n = Nn(Vs), r = X(() => {
		let n = V(e.to);
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
			let n = t[V(e.replace) ? "replace" : "push"](V(e.to)).catch(Ho);
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
		let n = /* @__PURE__ */ Nt(_c(e)), { options: r } = Nn(Bs), i = X(() => ({
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
		let r = Nn(Hs), i = X(() => e.route || r.value), a = Nn(zs, 0), o = X(() => {
			let e = V(a), { matched: t } = i.value, n;
			for (; (n = t[e]) && !n.components;) e++;
			return e;
		}), s = X(() => i.value.matched[o.value]);
		Mn(zs, X(() => o.value + 1)), Mn(Rs, s), Mn(Hs, i);
		let c = /* @__PURE__ */ B();
		return In(() => [
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
	let t = cc(e.routes, e), n = e.parseQuery || Fs, r = e.stringifyQuery || Is, i = e.history, a = Us(), o = Us(), s = Us(), c = /* @__PURE__ */ Kt(bs), l = bs;
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
			} else e = te(d, i, !0, s, a);
			return ee(d, i, e), e;
		});
	}
	function w(e, t) {
		let n = y(e, t);
		return n ? Promise.reject(n) : Promise.resolve();
	}
	function T(e) {
		let t = N.values().next().value;
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
	function ee(e, t, n) {
		s.list().forEach((r) => T(() => r(e, t, n)));
	}
	function te(e, t, n, r, a) {
		let o = y(e, t);
		if (o) return o;
		let s = t === bs, l = Lo ? history.state : {};
		n && (r || s ? i.replace(e.fullPath, Bo({ scroll: s && l && l.scroll }, a)) : i.push(e.fullPath, a)), c.value = e, ie(e, t, n, s), re();
	}
	let D;
	function O() {
		D ||= i.listen((e, t, n) => {
			if (!P.listening) return;
			let r = _(e), a = S(r, P.currentRoute.value);
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
				e ||= te(r, o, !1), e && (n.delta && !Ps(e, js.NAVIGATION_CANCELLED) ? i.go(-n.delta, !1) : n.type === xs.pop && Ps(e, js.NAVIGATION_ABORTED | js.NAVIGATION_DUPLICATED) && i.go(-1, !1)), ee(r, o, e);
			}).catch(Ho);
		});
	}
	let ne = Us(), k = Us(), A;
	function j(e, t, n) {
		re(e);
		let r = k.list();
		return r.length ? r.forEach((r) => r(e, t, n)) : console.error(e), Promise.reject(e);
	}
	function M() {
		return A && c.value !== bs ? Promise.resolve() : new Promise((e, t) => {
			ne.add([e, t]);
		});
	}
	function re(e) {
		return A || (A = !e, O(), ne.list().forEach(([t, n]) => e ? n(e) : t()), ne.reset()), e;
	}
	function ie(t, n, r, i) {
		let { scrollBehavior: a } = e;
		if (!Lo || !a) return Promise.resolve();
		let o = !r && Os(Ts(t.fullPath, 0)) || (i || !r) && history.state && history.state.scroll || null;
		return _n().then(() => a(t, n, o)).then((e) => e && ws(e)).catch((e) => j(e, t, n));
	}
	let ae = (e) => i.go(e), oe, N = /* @__PURE__ */ new Set(), P = {
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
		onError: k.add,
		isReady: M,
		install(e) {
			e.component("RouterLink", yc), e.component("RouterView", Ec), e.config.globalProperties.$router = P, Object.defineProperty(e.config.globalProperties, "$route", {
				enumerable: !0,
				get: () => V(c)
			}), Lo && !oe && c.value === bs && (oe = !0, b(i.location).catch((e) => {}));
			let t = {};
			for (let e in bs) Object.defineProperty(t, e, {
				get: () => c.value[e],
				enumerable: !0
			});
			e.provide(Bs, P), e.provide(Vs, /* @__PURE__ */ Pt(t)), e.provide(Hs, c);
			let n = e.unmount;
			N.add(e), e.unmount = function() {
				N.delete(e), N.size < 1 && (l = bs, D && D(), D = null, c.value = bs, oe = !1, A = !1), n();
			};
		}
	};
	function se(e) {
		return e.reduce((e, t) => e.then(() => T(t)), Promise.resolve());
	}
	return P;
}
function Oc() {
	return Nn(Bs);
}
function kc(e) {
	return Nn(Vs);
}
//#endregion
//#region src/vendor/hermes/json-rpc-channel.ts
var Ac = (e) => typeof e.id == "string" && typeof e.method == "string" && e.method !== "event", jc = class extends Error {
	code;
	data;
	constructor(e, t) {
		super(e), this.name = "JsonRpcGatewayError", this.code = t?.code, this.data = t?.data;
	}
}, Mc = -32601, Nc = -32603, Pc = 4404;
function Fc(e, t = "Hermes RPC failed") {
	let n = e && typeof e == "object" ? e : {};
	return new jc(typeof n.message == "string" && n.message ? n.message : t, {
		code: typeof n.code == "number" ? n.code : void 0,
		data: n.data
	});
}
var Ic = 12e4, Lc = 8;
new TextDecoder();
var Rc = (e) => {
	e?.unref?.();
}, zc = class {
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
			requestTimeoutMs: e.requestTimeoutMs ?? Ic,
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
			}, n), this.options.unrefTimers && Rc(u.timer)), r && (c = () => {
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
					code: Pc,
					message: e
				} });
			}
		};
		for (let r of this.requestHandlers) {
			let i;
			try {
				i = r(o);
			} catch (r) {
				return o.fail(Nc, `server request handler crashed: ${t}`), this.options.onRequestHandlerError?.(r instanceof Error ? r : Error(String(r)), {
					id: e,
					method: t,
					params: n
				}), !1;
			}
			if (i !== !1) return !0;
		}
		return o.fail(Mc, `no handler for server request: ${t}`), this.options.onUnhandledRequest?.({
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
		if (this.options.heartbeatLiveness === "any-inbound" && (this.lastLivenessAt = Date.now()), Ac(t)) {
			let e = t.params && typeof t.params == "object" ? t.params : {};
			return this.deliverRequest(t.id, t.method, e), t;
		}
		if (t.id !== void 0 && t.id !== null) {
			if (typeof t.id == "string" && this.outstandingPings.delete(t.id)) return this.lastLivenessAt = Date.now(), t;
			let e = this.pending.get(t.id);
			return e && (this.lastLivenessAt = Date.now(), this.clearPending(t.id), t.error ? e.reject(Fc(t.error)) : (this.deliverOpenRequests(t.result), e.resolve(t.result))), t;
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
			this.outstandingPings.add(t), this.outstandingPings.size > Lc && this.outstandingPings.delete(this.outstandingPings.values().next().value);
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
		}, this.options.heartbeatIntervalMs), this.options.unrefTimers && Rc(this.heartbeatTimer));
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
}, Bc = /* @__PURE__ */ new Map(), Vc = (e, t) => JSON.stringify([e || "default", t]), Hc = {
	snapshot: () => {},
	event: () => {},
	input: () => {},
	requests: () => {},
	connection: () => {},
	recovered: () => {}
}, Uc = class e {
	static async create(t, n, r) {
		if (Bc.size >= 32) throw new Z("Too many unopened drafts", "rejected");
		let i = new e(t, "", Hc), a = () => i.close();
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
			let o = Vc(t, a), s = setTimeout(() => {
				Bc.get(o)?.viewer === i && Bc.delete(o), i.close();
			}, 3e5);
			return Bc.set(o, {
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
		this.channel = new zc({
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
		let e = Bc.get(Vc(this.profile, this.stored));
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
		e && Bc.get(Vc(this.profile, this.stored)) === e && (Bc.delete(Vc(this.profile, this.stored)), clearTimeout(e.timer), e.viewer.close()), this.hooks.snapshot({
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
			throw t instanceof jc ? new Z("Hermes could not complete this operation", e === "prompt.submit" ? "unknown" : "rejected") : t;
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
function Wc(e) {
	let t = e;
	if (!t || typeof t != "object" || t.protocol !== "hermes.native.bf0203a7" || t.reviewed_source !== "bf0203a794a07aac3ff764972ab9087baa4e4f4e" || t.mode !== "native-gateway" || t.admission !== !0 || !Array.isArray(t.operations) || !t.operations.every((e) => typeof e == "string") || !Array.isArray(t.blockers) || !t.blockers.every((e) => typeof e == "string") || t.guarantees?.crash_safe_idempotency !== !1 || t.guarantees?.lossless_snapshot_replay !== !1 || t.guarantees?.offline_turn_lease !== !0) throw Error("Unsupported native chat contract");
	return t;
}
async function Gc(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	t?.throwIfAborted();
	let n = await fetch(`/api/plugins/chathermes/chat/capabilities?profile=${encodeURIComponent(e || "default")}`, {
		credentials: "same-origin",
		cache: "no-store",
		redirect: "manual",
		signal: t
	});
	if (!n.ok || n.type === "opaqueredirect") throw Error("Sign in to the dashboard to inspect native chat support");
	let r = Wc(await n.json()), i = await fetch("/api/auth/ws-ticket", {
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
var Kc = class extends Error {
	status;
	constructor(e, t) {
		super(t), this.status = e;
	}
}, qc = /* @__PURE__ */ new Set(), Jc = /* @__PURE__ */ new Set(), Yc = (e, t) => JSON.stringify([e, t]), Xc = "/api/plugins/chathermes";
function Zc(e, t) {
	if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) throw Error("Invalid profile name");
	if (!/^\/(?:inbox(?:\?[^#]*|\/[0-9]+(?:\/read)?|\/read(?:\?[^#]*)?)?|session-tracking(?:\/[A-Za-z0-9_-]+)?|artifacts\?[^#]*|project-instructions\?project_id=[^&]*(?:&[^#]*)?|chat\/sessions(?:\?prepare=1)?|scheduled(?:\/(?:runs|output)\?[^#]*)?|projects(?:\/(?:manage|detail\?project_id=[^&]*(?:&[^#]*)?|session\?project_id=[^&]*(?:&[^#]*)?|[A-Za-z0-9_-]+(?:\/sessions)?))?|workspace\/sessions\/[A-Za-z0-9_-]+\/messages|api\/model\/options|api\/sessions(?:\?.*)?|api\/sessions\/[A-Za-z0-9_-]+(?:\/messages\?.*|\/project|\/branch)?|v1\/(?:capabilities|models))$/.test(t)) throw Error("Invalid Hermes API path.");
	return Xc + t + (e ? `${t.includes("?") ? "&" : "?"}profile=${encodeURIComponent(e)}` : "");
}
async function Qc(e, t, n = {}, r = "application/json") {
	let i = new Headers(n.headers);
	i.set("accept", r), n.body && i.set("content-type", "application/json");
	let a = await fetch(Zc(e, t), {
		...n,
		headers: i,
		credentials: "same-origin",
		redirect: "manual",
		cache: "no-store"
	});
	if (a.type === "opaqueredirect" || a.status >= 300 && a.status < 400) throw Error("Hermes redirected the request. Sign in to the dashboard and retry.");
	return a;
}
async function $c(e, t, n = {}) {
	let r = await Qc(e, t, n);
	if (!r.ok) throw new Kc(r.status, `Request failed (${r.status})`);
	return r.json();
}
function el(e) {
	return typeof e == "object" && e && !Array.isArray(e) ? e : void 0;
}
function tl(e) {
	let t = el(e);
	if (typeof t?.id != "string" || !t.id) throw Error("Invalid Hermes session response");
	return t;
}
function nl(e) {
	return tl(el(e)?.session ?? e);
}
function rl(e) {
	let t = el(e), n = Array.isArray(e) ? e : t?.data ?? t?.sessions;
	if (!Array.isArray(n)) throw Error("Invalid Hermes sessions response");
	return {
		sessions: n.map(tl),
		limit: typeof t?.limit == "number" ? t.limit : void 0,
		offset: typeof t?.offset == "number" ? t.offset : void 0,
		has_more: typeof t?.has_more == "boolean" ? t.has_more : void 0,
		total: typeof t?.total == "number" ? t.total : void 0
	};
}
function il(e) {
	let t = el(e), n = Array.isArray(e) ? e : t?.data ?? t?.messages;
	if (!Array.isArray(n) || n.some((e) => !el(e) || typeof e.role != "string")) throw Error("Invalid Hermes messages response");
	let r = el(t?.pagination);
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
		transcript: el(t?.transcript)
	};
}
var Q = {
	inbox: (e, t = {}, n) => {
		let r = new URLSearchParams({
			scope: t.scope || "all",
			unread: String(t.unread || !1),
			limit: String(t.limit || 50)
		});
		return t.cursor && r.set("cursor", t.cursor), $c(e, "/inbox?" + r, { signal: n });
	},
	readInbox: (e, t) => $c(e, "/inbox/" + t + "/read", { method: "PUT" }),
	deleteInboxItem: (e, t) => $c(e, "/inbox/" + t, { method: "DELETE" }),
	deleteReadInbox: (e, t) => $c(e, "/inbox/read?scope=" + t, { method: "DELETE" }),
	artifacts: (e, t, n, r) => {
		let i = new URLSearchParams({ limit: "50" });
		return t !== void 0 && i.set("project_id", t), n && i.set("cursor", n), $c(e, `/artifacts?${i}`, { signal: r });
	},
	nativeChatCapabilities: Gc,
	isNative: (e) => qc.has(e),
	profiles: async () => {
		let e = await fetch(Xc + "/profiles", {
			credentials: "same-origin",
			cache: "no-store"
		});
		if (!e.ok) throw new Kc(e.status, "Could not load profiles");
		return e.json();
	},
	scheduled: (e, t) => $c(e, "/scheduled", { signal: t }),
	scheduledRuns: (e, t, n = 0, r) => $c(e, `/scheduled/runs?job_id=${encodeURIComponent(t)}&offset=${n}`, { signal: r }),
	scheduledOutput: (e, t, n, r) => $c(e, `/scheduled/output?job_id=${encodeURIComponent(t)}&run_id=${encodeURIComponent(n)}`, { signal: r }),
	projects: (e, t) => $c(e, "/projects", { signal: t }),
	project: async (e, t, n) => {
		let r = await $c(e, `/projects/detail?project_id=${encodeURIComponent(t)}`, { signal: n });
		if (r.project?.id !== t || typeof r.project.label != "string") throw Error("Invalid Hermes Project response");
		return r.project;
	},
	projectInstructions: (e, t, n) => $c(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, { signal: n }),
	saveProjectInstructions: (e, t, n) => $c(e, `/project-instructions?project_id=${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify(n)
	}),
	projectManage: (e, t, n) => $c(e, "/projects/manage", {
		method: "POST",
		body: JSON.stringify({
			action: t,
			...n
		})
	}),
	isWorkspace(e, t) {
		return Jc.has(Yc(e, t));
	},
	workspace(e, t) {
		Jc.add(Yc(e, t));
	},
	projectCreate: async (e, t) => {
		let n = await $c(e, `/projects/session?project_id=${encodeURIComponent(t)}&prepare=1`, {
			method: "POST",
			body: "{}"
		}), r = n.native_create ? await Uc.create(e, n.native_create) : nl(n);
		return Jc.add(Yc(e, r.id)), r;
	},
	projectEvents(e, t) {
		let n = new EventSource(Xc + "/project-events?profile=" + encodeURIComponent(e || "default"), { withCredentials: !0 });
		return n.addEventListener("refresh", t), () => n.close();
	},
	models: (e) => $c(e, "/v1/models"),
	modelOptions: (e) => $c(e, "/api/model/options"),
	async upload(e, t) {
		let n = await fetch(Xc + "/uploads" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
			method: "POST",
			credentials: "same-origin",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(t)
		});
		if (!n.ok) throw new Kc(n.status, `Upload failed (${n.status})`);
		return n.json();
	},
	capabilities: async (e, t) => {
		let n = await $c(e, "/v1/capabilities", { signal: t });
		return n.features?.native_chat === !0 ? qc.add(e) : qc.delete(e), n;
	},
	tracking: (e, t) => $c(e, "/session-tracking", { signal: t }),
	track: (e, t, n) => $c(e, `/session-tracking/${encodeURIComponent(t)}`, {
		method: "PUT",
		body: JSON.stringify({ status: n })
	}),
	sessions: async (e, t = 0, n) => rl(await $c(e, `/api/sessions?limit=30&offset=${t}`, { signal: n })),
	create: async (e, t) => {
		let n = await $c(e, "/chat/sessions?prepare=1", {
			method: "POST",
			body: "{}",
			signal: t
		}), r = n.native_create ? await Uc.create(e, n.native_create, t) : nl(n);
		return Jc.add(Yc(e, r.id)), r;
	},
	session: async (e, t, n) => {
		let r = nl(await $c(e, `/api/sessions/${encodeURIComponent(t)}`, { signal: n }));
		return (r.cwd || r.source === "desktop") && Jc.add(Yc(e, t)), r;
	},
	branch: (e, t, n) => $c(e, `/api/sessions/${encodeURIComponent(t)}/branch`, {
		method: "POST",
		body: JSON.stringify({ response_id: n })
	}),
	rename: async (e, t, n, r) => nl(await $c(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ title: n }),
		signal: r
	})),
	archive: (e, t) => $c(e, `/api/sessions/${encodeURIComponent(t)}`, {
		method: "PATCH",
		body: JSON.stringify({ archived: !0 })
	}),
	deleteSession: (e, t) => $c(e, `/api/sessions/${encodeURIComponent(t)}`, { method: "DELETE" }),
	moveSession: (e, t, n) => $c(e, `/api/sessions/${encodeURIComponent(t)}/project`, {
		method: "POST",
		body: JSON.stringify({ project_id: n })
	}),
	async latestMessages(e, t, n, r = 0, i) {
		let a;
		try {
			a = il(await $c(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=120&offset=${r}&order=latest&inline_images=false&include_compacted=true&transcript=1${i ? `&revision=${encodeURIComponent(i)}` : ""}`, { signal: n }));
		} catch (r) {
			if (!(r instanceof Kc) || r.status !== 404 || !Q.isWorkspace(e, t)) throw r;
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
				s = il(await $c(e, `/api/sessions/${encodeURIComponent(t)}/messages?limit=500&offset=${o}&order=oldest&inline_images=false&include_compacted=true`, { signal: n }));
			} catch (r) {
				if (o === 0 && r instanceof Kc && r.status === 404 && Jc.has(Yc(e, t))) return il(await $c(e, `/workspace/sessions/${encodeURIComponent(t)}/messages`, { signal: n })).messages;
				throw r;
			}
			let c = JSON.stringify(s.messages);
			if (o && c === i || (i = c, r.push(...s.messages.filter((e) => !e.id || !a.has(e.id) && (a.add(e.id), !0))), !s.pagination || s.pagination.returned < s.pagination.limit || !s.messages.length)) return r;
			o += s.messages.length;
		}
	}
};
function al(e) {
	return typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e && typeof e == "object" && "text" in e && typeof e.text == "string" ? e.text : "").filter(Boolean).join("\n") : "";
}
//#endregion
//#region src/features/projects/utils/projects.ts
function ol(e) {
	return e.path || e.repos.find((e) => e.path)?.path || void 0;
}
function sl(e) {
	let t = e.repos.flatMap((e) => e.groups.flatMap((e) => e.sessions));
	return [...new Map(t.map((e) => [e.id, e])).values()].sort((e, t) => (t.last_active || 0) - (e.last_active || 0));
}
//#endregion
//#region src/router/links.ts
var cl = /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/;
function ll(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 4096 && !Array.from(e).some((e) => e.charCodeAt(0) < 32 || e === "?" || e === "#") && !e.split(/[\\/]/).some((e) => e === "." || e === "..");
}
var ul = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
function dl(e) {
	return typeof e == "string" ? e : "";
}
function fl(e) {
	if (typeof e != "string" || !e.startsWith("/") || e.startsWith("//") || /[\\#\r\n]/.test(e)) return "/";
	let t = new URL(e, "https://plugin.invalid");
	return t.pathname === "/settings" || !/^\/(?:chat\/[^/]+|inbox|artifacts|projects(?:\/[^/]+(?:\/(?:artifacts|settings|instructions))?)?|scheduled(?:\/[^/]+(?:\/[^/]+)?)?)?$/.test(t.pathname) ? "/" : t.pathname + t.search;
}
function pl(e, t = "", n = "", r = "", i = {}) {
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
function ml(e, t = window.location.origin) {
	try {
		let n = new URL(e, t);
		if (n.origin === t && n.pathname === "/chathermes" && n.hash.startsWith("#/")) return n.hash.slice(1);
	} catch {}
}
//#endregion
//#region src/features/projects/composables/useProjectWorkspace.ts
function hl(e) {
	let { profile: t, session: n, sessions: r, offline: i, navigate: a } = e, o = kc(), s = Oc(), c = X(() => o.query.archived === "1"), l = /* @__PURE__ */ B(!1), u = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B(""), f = /* @__PURE__ */ B([]), p = /* @__PURE__ */ B(), m = /* @__PURE__ */ B(!1), h = /* @__PURE__ */ B(!1), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B(""), v = /* @__PURE__ */ B([]), y = /* @__PURE__ */ B(!1), b = X(() => d.value ? p.value ? sl(p.value) : [] : r.value.filter((e) => !v.value.includes(e.id))), x, S;
	function C() {
		x?.(), x = void 0, typeof EventSource < "u" && (x = Q.projectEvents(t.value, () => {
			w(), e.refreshInbox();
		}));
	}
	function w() {
		clearTimeout(S), S = setTimeout(() => {
			te(), d.value && O();
		}, 100);
	}
	let T, E, ee = Promise.resolve();
	function te() {
		return ee = D(), ee;
	}
	async function D() {
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
	async function O() {
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
				e === E && !e.signal.aborted && (_.value = t instanceof Kc && t.status === 404 ? "Project no longer exists. Return to Other chats." : "Could not load this Project. Retry or return to Other chats.");
			} finally {
				e === E && (h.value = !1);
			}
		}
	}
	async function ne(e) {
		return a(e ? {
			...pl("project", t.value, n.value, e),
			params: { projectId: e }
		} : pl("home", t.value, n.value));
	}
	function k(e = !1) {
		return a(pl("projects", t.value, n.value, d.value, e ? { archived: "1" } : {}));
	}
	async function A(n, r) {
		if (l.value || i.value) return;
		let a = t.value, f = e.profileGeneration(), m = d.value, h = s.currentRoute.value;
		l.value = !0, u.value = "";
		try {
			let i = await Q.projectManage(a, n, r);
			if (f !== e.profileGeneration() || a !== t.value || h !== s.currentRoute.value) return;
			n === "create" && i.project?.id ? await ne(i.project.id) : m === d.value && o.name !== "projects" && (n === "delete" ? (d.value = "", p.value = void 0, k(c.value)) : n === "archive" ? (d.value = "", p.value = void 0, k(r.restore !== !0)) : await O()), f === e.profileGeneration() && (await te(), await e.loadSessions());
		} catch {
			f === e.profileGeneration() && a === t.value && h === s.currentRoute.value && (u.value = "Could not save the project. Check its fields and try again.");
		} finally {
			f === e.profileGeneration() && (l.value = !1);
		}
	}
	function j() {
		T?.abort(), E?.abort(), x?.(), x = void 0, clearTimeout(S), y.value = !1, v.value = [], d.value = "", l.value = !1, u.value = "", p.value = void 0, f.value = [], _.value = "", g.value = "", h.value = !1;
	}
	function M(e) {
		E?.abort(), d.value = e, p.value = void 0, _.value = "", h.value = !1, e && O();
	}
	return Ce(() => {
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
		loadProjects: te,
		loadProject: O,
		chooseProject: ne,
		showProjects: k,
		manageProject: A,
		resetProjects: j,
		selectProjectScope: M,
		whenProjectsLoaded: () => ee
	};
}
//#endregion
//#region src/utils/message-image.ts
function gl(e) {
	return typeof e == "string" && /^(?:data:image\/|https?:\/\/|\/api\/plugins\/chathermes\/artifact-images\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/\d+$)/.test(e);
}
//#endregion
//#region node_modules/mdurl/lib/decode.mjs
var _l = {};
function vl(e) {
	let t = _l[e];
	if (t) return t;
	t = _l[e] = [];
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
function yl(e, t) {
	typeof t != "string" && (t = yl.defaultChars);
	let n = vl(t);
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
yl.defaultChars = ";/?:@&=+$,#", yl.componentChars = "";
//#endregion
//#region node_modules/mdurl/lib/encode.mjs
var bl = {};
function xl(e) {
	let t = bl[e];
	if (t) return t;
	t = bl[e] = [];
	for (let e = 0; e < 128; e++) {
		let n = String.fromCharCode(e);
		/^[0-9a-z]$/i.test(n) ? t.push(n) : t.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
	}
	for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
	return t;
}
function Sl(e, t, n) {
	typeof t != "string" && (n = t, t = Sl.defaultChars), n === void 0 && (n = !0);
	let r = xl(t), i = "";
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
Sl.defaultChars = ";/?:@&=+$,-_.!~*'()#", Sl.componentChars = "-_.!~*'()";
//#endregion
//#region node_modules/mdurl/lib/format.mjs
function Cl(e) {
	let t = "";
	return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
//#endregion
//#region node_modules/mdurl/lib/parse.mjs
function wl() {
	this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var Tl = /^([a-z0-9.+-]+:)/i, El = /:[0-9]*$/, Dl = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Ol = [
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
], kl = [
	"/",
	"?",
	"#"
], Al = 255, jl = /^[+a-z0-9A-Z_-]{0,63}$/, Ml = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Nl = {
	javascript: !0,
	"javascript:": !0
}, Pl = {
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
function Fl(e, t) {
	if (e && e instanceof wl) return e;
	let n = new wl();
	return n.parse(e, t), n;
}
wl.prototype.parse = function(e, t) {
	let n, r, i, a = e;
	if (a = a.trim(), !t && e.split("#").length === 1) {
		let e = Dl.exec(a);
		if (e) return this.pathname = e[1], e[2] && (this.search = e[2]), this;
	}
	let o = Tl.exec(a);
	if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, a = a.substr(o.length)), (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = a.substr(0, 2) === "//", i && !(o && Nl[o]) && (a = a.substr(2), this.slashes = !0)), !Nl[o] && (i || o && !Pl[o])) {
		let e = -1;
		for (let t = 0; t < kl.length; t++) r = a.indexOf(kl[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		let t, n;
		n = e === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", e), n !== -1 && (t = a.slice(0, n), a = a.slice(n + 1), this.auth = t), e = -1;
		for (let t = 0; t < Ol.length; t++) r = a.indexOf(Ol[t]), r !== -1 && (e === -1 || r < e) && (e = r);
		e === -1 && (e = a.length), a[e - 1] === ":" && e--;
		let i = a.slice(0, e);
		a = a.slice(e), this.parseHost(i), this.hostname = this.hostname || "";
		let o = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
		if (!o) {
			let e = this.hostname.split(/\./);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n && !n.match(jl)) {
					let r = "";
					for (let e = 0, t = n.length; e < t; e++) n.charCodeAt(e) > 127 ? r += "x" : r += n[e];
					if (!r.match(jl)) {
						let r = e.slice(0, t), i = e.slice(t + 1), o = n.match(Ml);
						o && (r.push(o[1]), i.unshift(o[2])), i.length && (a = i.join(".") + a), this.hostname = r.join(".");
						break;
					}
				}
			}
		}
		this.hostname.length > Al && (this.hostname = ""), o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
	}
	let s = a.indexOf("#");
	s !== -1 && (this.hash = a.substr(s), a = a.slice(0, s));
	let c = a.indexOf("?");
	return c !== -1 && (this.search = a.substr(c), a = a.slice(0, c)), a && (this.pathname = a), Pl[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
}, wl.prototype.parseHost = function(e) {
	let t = El.exec(e);
	t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
//#endregion
//#region node_modules/mdurl/index.mjs
var Il = /* @__PURE__ */ t({
	decode: () => yl,
	encode: () => Sl,
	format: () => Cl,
	parse: () => Fl
}), Ll = /* @__PURE__ */ t({
	Any: () => Rl,
	Cc: () => zl,
	Cf: () => Bl,
	P: () => Vl,
	S: () => Hl,
	Z: () => Ul
}), Rl = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, zl = /[\0-\x1F\x7F-\x9F]/, Bl = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, Vl = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, Hl = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, Ul = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, Wl = [
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
function Gl(e) {
	return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function Kl(e) {
	return Gl(e) ? 65533 : e >= 128 && e <= 159 && Wl[e - 128] || e;
}
function ql(e) {
	return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(Kl(e));
}
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/internal/decode-shared.js
var Jl = /* #__PURE__ */ (() => {
	let e = /* @__PURE__ */ new Uint8Array(127), t = 0;
	for (let n = 33; n <= 126; n++) n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
	return e;
})();
function Yl(e, t, n, r, i, a) {
	let o = e.length, s = a * 90, c = 0, l = () => {
		let t = Jl[e.charCodeAt(c++)];
		return t < a ? t : t * 91 - s + Jl[e.charCodeAt(c++)];
	}, u = n - r, d = n + i, f = new Int32Array(d);
	f.fill(-1, r, a), f.fill(-1, a + u, d);
	let p = new Int32Array(d), m = new Int32Array(d);
	function h(t, n) {
		let r = 0, i = n, a = n + t;
		for (; i < a;) {
			let t = Jl[e.charCodeAt(c++)];
			if (t < 89) r += t, f[i++] = r;
			else if (t === 89) {
				let t = Jl[e.charCodeAt(c++)] + 2;
				for (; t--;) f[i++] = ++r;
			} else {
				let t = Jl[e.charCodeAt(c++)];
				r += 89 + (t < 90 ? t * 91 + Jl[e.charCodeAt(c++)] : Jl[e.charCodeAt(c++)] * 8281 + Jl[e.charCodeAt(c++)] * 91 + Jl[e.charCodeAt(c++)]), f[i++] = r;
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
		let t = Jl[e.charCodeAt(c++)];
		t >= a && (t = t * 91 - s + Jl[e.charCodeAt(c++)]);
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
var Xl = /* #__PURE__ */ Yl("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61), Zl;
(function(e) {
	e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(Zl ||= {});
//#endregion
//#region node_modules/markdown-it/node_modules/entities/dist/decode.js
var Ql;
(function(e) {
	e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(Ql ||= {});
var $l = 32, eu = 21, tu = 2097151, nu = 2047, ru = 0;
function iu(e) {
	let t = e >>> eu;
	return t === nu ? ru : t;
}
function au(e) {
	return e - Ql.ZERO >>> 0 <= 9;
}
function ou(e) {
	return (e | $l) - Ql.LOWER_A >>> 0 <= 5;
}
function su(e) {
	return (e | $l) - Ql.LOWER_A >>> 0 <= 25;
}
function cu(e) {
	return e === Ql.EQUALS || su(e) || au(e);
}
var lu;
(function(e) {
	e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(lu ||= {});
var uu;
(function(e) {
	e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(uu ||= {});
function du(e, t, n, r) {
	let i = (t & Zl.BRANCH_LENGTH) >> 7, a = t & Zl.JUMP_TABLE;
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
function fu(e, t, n) {
	return n === 1 ? String.fromCharCode(e[t] & Zl.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function pu(e, t, n) {
	let r = t + 1, i = 0, a = r;
	if (r < n && (e.charCodeAt(r) | $l) === Ql.LOWER_X) for (r += 1, a = r; r < n;) {
		let t = e.charCodeAt(r);
		if (au(t)) i = i * 16 + (t - Ql.ZERO);
		else if (ou(t)) i = i * 16 + ((t | $l) - Ql.LOWER_A + 10);
		else break;
		r += 1;
	}
	else for (; r < n;) {
		let t = e.charCodeAt(r) - Ql.ZERO;
		if (t >>> 0 > 9) break;
		i = i * 10 + t, r += 1;
	}
	if (r === a) return 0;
	r < n && e.charCodeAt(r) === Ql.SEMI && (r += 1), i > 1114111 && (i = 1114112);
	let o = r - t;
	return o >= nu && (ru = o, o = nu), o << eu | i;
}
function mu(e, t, n) {
	let r = Xl, i = e.indexOf("&");
	if (i < 0) return e;
	let a = e.length, o = 0, s = "", c = r[0], l = c & Zl.JUMP_TABLE, u = (c & Zl.BRANCH_LENGTH) >> 7;
	do {
		let c = i + 1, d = e.charCodeAt(c), f, p;
		if (d === Ql.NUM) {
			let n = pu(e, c, a);
			f = iu(n), t && f > 0 && e.charCodeAt(c + f - 1) !== Ql.SEMI && (f = 0), p = f === 0 ? "" : ql(n & tu);
		} else if (su(d)) {
			f = 0, p = "";
			let n = d - l, i;
			if (n >>> 0 < u) {
				let e = r[1 + n];
				i = e === 0 ? -1 : u + e & 65535;
			} else i = -1;
			let o = 0, s = 0, m = i < 0 ? 0 : r[i], h = c + 1;
			trie: for (; h < a;) {
				for (; (m & (Zl.VALUE_LENGTH | Zl.FLAG13)) === 0 && (m & Zl.JUMP_TABLE) !== 0;) {
					let t = m & Zl.JUMP_TABLE, n = (m & Zl.BRANCH_LENGTH) >> 7;
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
				if ((m & (Zl.VALUE_LENGTH | Zl.FLAG13)) === Zl.FLAG13) {
					let t = (m & Zl.BRANCH_LENGTH) >> 7;
					if (e.charCodeAt(h) !== (m & Zl.JUMP_TABLE)) break;
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
					if (l === Ql.SEMI) {
						f = h - c + 1, p = n === 1 ? String.fromCharCode(m & Zl.VALUE_MASK) : fu(r, i, n);
						break;
					}
					if (!t && (m & Zl.FLAG13) === 0 && (f = h - c, o = i, s = n), n === 1) break;
				}
				let u = du(r, m, i + (n || 1), l);
				if (u < 0) break;
				i = u, m = r[i], h += 1;
			}
			if (p === "") {
				let e = m >>> 14;
				e !== 0 && !t && (m & Zl.FLAG13) === 0 && (f = h - c, o = i, s = e), f > 0 && (p = fu(r, o, s));
			}
		} else f = 0, p = "";
		f === 0 || n && d !== Ql.NUM && e.charCodeAt(c + f - 1) !== Ql.SEMI && c + f < a && cu(e.charCodeAt(c + f)) ? i = c : (o < i && (s += e.slice(o, i)), s += p, i = o = c + f), e.charCodeAt(i) !== Ql.AMP && (i = e.indexOf("&", i));
	} while (i >= 0);
	return s + e.slice(o);
}
function hu(e) {
	return mu(e, !0, !1);
}
//#endregion
//#region node_modules/linkify-it/build/index.mjs
var gu = class {
	src_Any = Rl.source;
	src_Cc = zl.source;
	src_Z = Ul.source;
	src_P = Vl.source;
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
}, _u = {
	validate: (e, t, n) => {
		let r = n.re.get_http_validator();
		r.lastIndex = t;
		let i = r.exec(e);
		return i ? i[0].length : 0;
	},
	normalize: (e, t) => t.normalize(e)
}, vu = {
	"http:": _u,
	"https:": _u,
	"ftp:": _u,
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
}, yu = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", bu = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function xu() {
	let e = bu.split("|");
	return yu.split("|").forEach((t) => {
		let n = t.indexOf(":"), r = t.slice(0, n);
		for (let i of t.slice(n + 1)) e.push(r + i);
	}), e;
}
var Su = {
	fuzzyLink: !1,
	fuzzyEmail: !0,
	fuzzyIP: !1,
	"---": !1,
	tlds: xu(),
	urlAuth: !1,
	maxLength: 1e4
}, Cu = class {
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
}, wu = class {
	__opts__;
	__schemas__;
	re;
	constructor(e = {}) {
		let { rebuilder: t, ...n } = e;
		this.__opts__ = {
			...Su,
			...n
		}, this.__schemas__ = { ...vu }, this.re = t || new gu(), this.re.set({
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
			let _ = new Cu(e, g.schema, g.index, g.lastIndex);
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
		let r = new Cu(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
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
}, Tu = 2147483647, Eu = 36, Du = 1, Ou = 26, ku = 38, Au = 700, ju = 72, Mu = 128, Nu = "-", Pu = /^xn--/, Fu = /[^\0-\x7F]/, Iu = /[\x2E\u3002\uFF0E\uFF61]/g, Lu = {
	overflow: "Overflow: input needs wider integers to process",
	"not-basic": "Illegal input >= 0x80 (not a basic code point)",
	"invalid-input": "Invalid input"
}, Ru = 35, zu = Math.floor, Bu = String.fromCharCode;
function Vu(e) {
	throw RangeError(Lu[e]);
}
function Hu(e, t) {
	let n = [], r = e.length;
	for (; r--;) n[r] = t(e[r]);
	return n;
}
function Uu(e, t) {
	let n = e.split("@"), r = "";
	n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(Iu, ".");
	let i = Hu(e.split("."), t).join(".");
	return r + i;
}
function Wu(e) {
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
var Gu = (e) => String.fromCodePoint(...e), Ku = function(e) {
	return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : Eu;
}, qu = function(e, t) {
	return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, Ju = function(e, t, n) {
	let r = 0;
	for (e = n ? zu(e / Au) : e >> 1, e += zu(e / t); e > 455; r += Eu) e = zu(e / Ru);
	return zu(r + 36 * e / (e + ku));
}, Yu = function(e) {
	let t = [], n = e.length, r = 0, i = Mu, a = ju, o = e.lastIndexOf(Nu);
	o < 0 && (o = 0);
	for (let n = 0; n < o; ++n) e.charCodeAt(n) >= 128 && Vu("not-basic"), t.push(e.charCodeAt(n));
	for (let s = o > 0 ? o + 1 : 0; s < n;) {
		let o = r;
		for (let t = 1, i = Eu;; i += Eu) {
			s >= n && Vu("invalid-input");
			let o = Ku(e.charCodeAt(s++));
			o >= Eu && Vu("invalid-input"), o > zu((Tu - r) / t) && Vu("overflow"), r += o * t;
			let c = i <= a ? Du : i >= a + Ou ? Ou : i - a;
			if (o < c) break;
			let l = Eu - c;
			t > zu(Tu / l) && Vu("overflow"), t *= l;
		}
		let c = t.length + 1;
		a = Ju(r - o, c, o == 0), zu(r / c) > Tu - i && Vu("overflow"), i += zu(r / c), r %= c, t.splice(r++, 0, i);
	}
	return String.fromCodePoint(...t);
}, Xu = function(e) {
	let t = [];
	e = Wu(e);
	let n = e.length, r = Mu, i = 0, a = ju;
	for (let n of e) n < 128 && t.push(Bu(n));
	let o = t.length, s = o;
	for (o && t.push(Nu); s < n;) {
		let n = Tu;
		for (let t of e) t >= r && t < n && (n = t);
		let c = s + 1;
		n - r > zu((Tu - i) / c) && Vu("overflow"), i += (n - r) * c, r = n;
		for (let n of e) if (n < r && ++i > Tu && Vu("overflow"), n === r) {
			let e = i;
			for (let n = Eu;; n += Eu) {
				let r = n <= a ? Du : n >= a + Ou ? Ou : n - a;
				if (e < r) break;
				let i = e - r, o = Eu - r;
				t.push(Bu(qu(r + i % o, 0))), e = zu(i / o);
			}
			t.push(Bu(qu(e, 0))), a = Ju(i, c, s === o), i = 0, ++s;
		}
		++i, ++r;
	}
	return t.join("");
}, Zu = {
	version: "2.3.1",
	ucs2: {
		decode: Wu,
		encode: Gu
	},
	decode: Yu,
	encode: Xu,
	toASCII: function(e) {
		return Uu(e, function(e) {
			return Fu.test(e) ? "xn--" + Xu(e) : e;
		});
	},
	toUnicode: function(e) {
		return Uu(e, function(e) {
			return Pu.test(e) ? Yu(e.slice(4).toLowerCase()) : e;
		});
	}
}, Qu = Object.defineProperty, $u = (e, t) => {
	let n = {};
	for (var r in e) Qu(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || Qu(n, Symbol.toStringTag, { value: "Module" }), n;
}, ed = /* @__PURE__ */ $u({
	arrayReplaceAt: () => nd,
	asciiTrim: () => Td,
	callable: () => td,
	escapeHtml: () => hd,
	escapeRE: () => _d,
	fromCodePoint: () => id,
	isMdAsciiPunct: () => Sd,
	isPunctChar: () => bd,
	isPunctCharCode: () => xd,
	isSpace: () => vd,
	isValidEntityCode: () => rd,
	isWhiteSpace: () => yd,
	lib: () => Ed,
	normalizeReference: () => Cd,
	unescapeAll: () => ud,
	unescapeMd: () => ld
});
function td(e) {
	let t = function(...n) {
		return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
	};
	return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function nd(e, t, n) {
	return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function rd(e) {
	return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function id(e) {
	if (e > 65535) {
		e -= 65536;
		let t = 55296 + (e >> 10), n = 56320 + (e & 1023);
		return String.fromCharCode(t, n);
	}
	return String.fromCharCode(e);
}
var ad = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, od = RegExp(`${ad.source}|&([a-z#][a-z0-9]{1,31});`, "gi"), sd = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function cd(e, t) {
	if (t.charCodeAt(0) === 35 && sd.test(t)) {
		let n = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
		return rd(n) ? id(n) : e;
	}
	let n = hu(e);
	return n === e ? e : n;
}
function ld(e) {
	return e.indexOf("\\") < 0 ? e : e.replace(ad, "$1");
}
function ud(e) {
	return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(od, function(e, t, n) {
		return t || cd(e, n);
	});
}
var dd = /[&<>"]/, fd = /[&<>"]/g, pd = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function md(e) {
	return pd[e];
}
function hd(e) {
	return dd.test(e) ? e.replace(fd, md) : e;
}
var gd = /[.?*+^$[\]\\(){}|-]/g;
function _d(e) {
	return e.replace(gd, "\\$&");
}
function vd(e) {
	switch (e) {
		case 9:
		case 32: return !0;
	}
	return !1;
}
function yd(e) {
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
function bd(e) {
	return Vl.test(e) || Hl.test(e);
}
function xd(e) {
	return bd(id(e));
}
function Sd(e) {
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
function Cd(e) {
	return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function wd(e) {
	return e === 32 || e === 9 || e === 10 || e === 13;
}
function Td(e) {
	let t = 0;
	for (; t < e.length && wd(e.charCodeAt(t)); t++);
	let n = e.length - 1;
	for (; n >= t && wd(e.charCodeAt(n)); n--);
	return e.slice(t, n + 1);
}
var Ed = {
	mdurl: Il,
	ucmicro: Ll
};
function Dd(e, t, n) {
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
function Od(e, t, n) {
	let r, i = t, a = {
		ok: !1,
		pos: 0,
		str: ""
	};
	if (e.charCodeAt(i) === 60) {
		for (i++; i < n;) {
			if (r = e.charCodeAt(i), r === 10 || r === 60) return a;
			if (r === 62) return a.pos = i + 1, a.str = ud(e.slice(t + 1, i)), a.ok = !0, a;
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
	return t === i || o !== 0 ? a : (a.str = ud(e.slice(t, i)), a.pos = i, a.ok = !0, a);
}
function kd(e, t, n, r) {
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
		if (i = e.charCodeAt(a), i === o.marker) return o.pos = a + 1, o.str += ud(e.slice(t, a)), o.ok = !0, o;
		if (i === 40 && o.marker === 41) return o;
		i === 92 && a + 1 < n && a++, a++;
	}
	return o.can_continue = !0, o.str += ud(e.slice(t, a)), o;
}
var Ad = /* @__PURE__ */ $u({
	parseLinkDestination: () => Od,
	parseLinkLabel: () => Dd,
	parseLinkTitle: () => kd
});
function jd(e) {
	"@babel/helpers - typeof";
	return jd = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, jd(e);
}
function Md(e, t) {
	if (jd(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (jd(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Nd(e) {
	var t = Md(e, "string");
	return jd(t) == "symbol" ? t : t + "";
}
function $(e, t, n) {
	return (t = Nd(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
var Pd = class {
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
}, Fd = class {
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
}, Id = {};
Id.code_inline = function(e, t, n, r, i) {
	let a = e[t];
	return `<code${i.renderAttrs(a)}>${hd(a.content)}</code>`;
}, Id.code_block = function(e, t, n, r, i) {
	let a = e[t];
	return `<pre${i.renderAttrs(a)}><code>${hd(e[t].content)}</code></pre>\n`;
}, Id.fence = function(e, t, n, r, i) {
	let a = e[t], o = a.info ? ud(a.info).trim() : "", s = "", c = "";
	if (o) {
		let e = o.split(/(\s+)/g);
		s = e[0], c = e.slice(2).join("");
	}
	let l;
	if (l = n.highlight && n.highlight(a.content, s, c) || hd(a.content), l.indexOf("<pre") === 0) return l + "\n";
	if (o) {
		let e = a.attrIndex("class"), t = a.attrs ? a.attrs.slice() : [];
		e < 0 ? t.push(["class", `${n.langPrefix}${s}`]) : (t[e] = [t[e][0], t[e][1]], t[e][1] += ` ${n.langPrefix}${s}`);
		let r = { attrs: t };
		return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
	}
	return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
}, Id.image = function(e, t, n, r, i) {
	let a = e[t];
	return a.attrs[a.attrIndex("alt")][1] = i.renderInlineAsText(a.children, n, r), i.renderToken(e, t, n);
}, Id.hardbreak = function(e, t, n) {
	return n.xhtmlOut ? "<br />\n" : "<br>\n";
}, Id.softbreak = function(e, t, n) {
	return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
}, Id.text = function(e, t) {
	return hd(e[t].content);
}, Id.html_block = function(e, t) {
	return e[t].content;
}, Id.html_inline = function(e, t) {
	return e[t].content;
};
var Ld = class {
	constructor() {
		$(this, "rules", Object.assign({}, Id));
	}
	renderAttrs(e) {
		let t, n, r;
		if (!e.attrs) return "";
		for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${hd(e.attrs[t][0])}="${hd(String(e.attrs[t][1]))}"`;
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
}, Rd = class {
	constructor(e, t, n) {
		$(this, "tokens", []), $(this, "inlineMode", !1), $(this, "Token", Pd), this.src = e, this.env = n, this.md = t;
	}
}, zd = /\r\n?/g, Bd = /\0/g;
function Vd(e) {
	let t;
	t = e.src.replace(zd, "\n"), t = t.replace(Bd, "�"), e.src = t;
}
function Hd(e) {
	let t;
	e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function Ud(e) {
	let t = e.tokens, n = 0;
	for (let e = 0; e < t.length; e++) t[e].type !== "reference_definition" && (e !== n && (t[n] = t[e]), n++);
	t.length !== n && (t.length = n);
}
function Wd(e) {
	let t = e.tokens;
	for (let n = 0, r = t.length; n < r; n++) {
		let r = t[n];
		r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
	}
}
function Gd(e) {
	return /^<a[>\s]/i.test(e);
}
function Kd(e) {
	return /^<\/a\s*>/i.test(e);
}
function qd(e) {
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
			if (n.type === "html_inline" && (Gd(n.content) && a > 0 && a--, Kd(n.content) && a++), !(a > 0) && n.type === "text" && e.md.linkify.test(n.content)) {
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
var Jd = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, Yd = /\((c|tm|r)\)/i, Xd = /\((c|tm|r)\)/gi, Zd = {
	c: "©",
	r: "®",
	tm: "™"
};
function Qd(e, t) {
	return Zd[t.toLowerCase()];
}
function $d(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && (r.content = r.content.replace(Xd, Qd)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function ef(e) {
	let t = 0;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.type === "text" && !t && Jd.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
	}
}
function tf(e) {
	let t;
	if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && (Yd.test(e.tokens[t].content) && $d(e.tokens[t].children), Jd.test(e.tokens[t].content) && ef(e.tokens[t].children));
}
var nf = /['"]/, rf = /['"]/g, af = "’", of = 1e3;
function sf(e, t, n) {
	for (; e.length > n;) {
		let n = e.pop();
		n.isSingleQuote ? t.single = n.prevSameQuoteIdx : t.double = n.prevSameQuoteIdx;
	}
}
function cf(e, t, n, r) {
	e[t] || (e[t] = []), e[t].push({
		pos: n,
		ch: r
	});
}
function lf(e, t) {
	let n = "", r = 0;
	t.sort((e, t) => e.pos - t.pos);
	for (let i = 0; i < t.length; i++) {
		let a = t[i];
		n += e.slice(r, a.pos) + a.ch, r = a.pos + 1;
	}
	return n + e.slice(r);
}
function uf(e, t) {
	let n, r = [], i = {
		single: -1,
		double: -1
	}, a = {};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = e[o].level;
		for (n = r.length - 1; n >= 0 && !(r[n].level <= c); n--);
		if (sf(r, i, n + 1), s.type !== "text") continue;
		let l = s.content, u = 0, d = l.length;
		OUTER: for (; u < d;) {
			rf.lastIndex = u;
			let s = rf.exec(l);
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
			let _ = Sd(h) || xd(h), v = Sd(g) || xd(g), y = yd(h), b = yd(g);
			if (b ? f = !1 : v && (y || _ || (f = !1)), y ? p = !1 : _ && (b || v || (p = !1)), g === 34 && s[0] === "\"" && h >= 48 && h <= 57 && (p = f = !1), f && p && (f = _, p = v), !f && !p) {
				m && cf(a, o, s.index, af);
				continue;
			}
			if (p && (n = m ? i.single : i.double, n >= 0 && r[n].level === c)) {
				let e = r[n], c, l;
				m ? (c = t.md.options.quotes[2], l = t.md.options.quotes[3]) : (c = t.md.options.quotes[0], l = t.md.options.quotes[1]), cf(a, o, s.index, l), cf(a, e.tokenIdx, e.contentPos, c), sf(r, i, n);
				continue OUTER;
			}
			if (f) {
				if (r.length >= of) return;
				r.push({
					tokenIdx: o,
					contentPos: s.index,
					isSingleQuote: m,
					level: c,
					prevSameQuoteIdx: m ? i.single : i.double
				}), m ? i.single = r.length - 1 : i.double = r.length - 1;
			} else p && m && cf(a, o, s.index, af);
		}
	}
	Object.keys(a).forEach(function(t) {
		let n = Number(t);
		e[n].content = lf(e[n].content, a[t]);
	});
}
function df(e) {
	if (e.md.options.typographer) for (let t = e.tokens.length - 1; t >= 0; t--) e.tokens[t].type === "inline" && nf.test(e.tokens[t].content) && uf(e.tokens[t].children, e);
}
function ff(e) {
	let t, n, r = e.length;
	for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
	for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
	t !== n && (e.length = n);
}
function pf(e) {
	let t, n, r = e.tokens, i = r.length;
	for (let e = 0; e < i; e++) {
		if (r[e].type !== "inline") continue;
		let i = r[e].children, a = i.length;
		for (t = 0; t < a; t++) i[t].type === "text_special" && (i[t].type = "text"), i[t].children && ff(i[t].children);
		for (t = n = 0; t < a; t++) i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
		t !== n && (i.length = n);
	}
}
var mf = [
	["normalize", Vd],
	["block", Hd],
	["strip_references", Ud],
	["inline", Wd],
	["linkify", qd],
	["replacements", tf],
	["smartquotes", df],
	["text_join", pf]
], hf = class {
	constructor() {
		$(this, "ruler", new Fd()), $(this, "State", Rd);
		for (let e = 0; e < mf.length; e++) this.ruler.push(mf[e][0], mf[e][1]);
	}
	process(e) {
		let t = this.ruler.getRules("");
		for (let n = 0, r = t.length; n < r; n++) t[n](e);
	}
}, gf = class {
	constructor(e, t, n, r) {
		$(this, "bMarks", []), $(this, "eMarks", []), $(this, "tShift", []), $(this, "sCount", []), $(this, "bsCount", []), $(this, "blkIndent", 0), $(this, "line", 0), $(this, "lineMax", 0), $(this, "tight", !1), $(this, "listIndent", -1), $(this, "parentType", "root"), $(this, "level", 0), $(this, "Token", Pd), this.src = e, this.md = t, this.env = n, this.tokens = r;
		let i = this.src;
		for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
			let s = i.charCodeAt(t);
			if (!o) {
				if (vd(s)) {
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
		let r = new Pd(e, t, n);
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
		for (let t = this.src.length; e < t && vd(this.src.charCodeAt(e)); e++);
		return e;
	}
	skipSpacesBack(e, t) {
		if (e <= t) return e;
		for (; e > t;) if (!vd(this.src.charCodeAt(--e))) return e + 1;
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
				if (vd(t)) t === 9 ? e += 4 - (e + this.bsCount[o]) % 4 : e++;
				else if (c - s < this.tShift[o]) e++;
				else break;
				c++;
			}
			e > n ? i[a] = Array(e - n + 1).join(" ") + this.src.slice(c, l) : i[a] = this.src.slice(c, l);
		}
		return i.join("");
	}
}, _f = 65536;
function vf(e, t) {
	let n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
	return e.src.slice(n, r);
}
function yf(e) {
	let t = [], n = e.length, r = 0, i = e.charCodeAt(r), a = !1, o = 0, s = "";
	for (; r < n;) i === 124 && (a ? (s += e.substring(o, r - 1), o = r) : (t.push(s + e.substring(o, r)), s = "", o = r + 1)), a = i === 92, r++, i = e.charCodeAt(r);
	return t.push(s + e.substring(o)), t;
}
function bf(e, t, n, r) {
	if (t + 2 > n) return !1;
	let i = t + 1;
	if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[i] + e.tShift[i];
	if (a >= e.eMarks[i]) return !1;
	let o = e.src.charCodeAt(a++);
	if (o !== 124 && o !== 45 && o !== 58 || a >= e.eMarks[i]) return !1;
	let s = e.src.charCodeAt(a++);
	if (s !== 124 && s !== 45 && s !== 58 && !vd(s) || o === 45 && vd(s)) return !1;
	for (; a < e.eMarks[i];) {
		let t = e.src.charCodeAt(a);
		if (t !== 124 && t !== 45 && t !== 58 && !vd(t)) return !1;
		a++;
	}
	let c = vf(e, t + 1), l = c.split("|"), u = [];
	for (let e = 0; e < l.length; e++) {
		let t = l[e].trim();
		if (!t) {
			if (e === 0 || e === l.length - 1) continue;
			return !1;
		}
		if (!/^:?-+:?$/.test(t)) return !1;
		t.charCodeAt(t.length - 1) === 58 ? u.push(t.charCodeAt(0) === 58 ? "center" : "right") : t.charCodeAt(0) === 58 ? u.push("left") : u.push("");
	}
	if (c = vf(e, t).trim(), c.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
	l = yf(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop();
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
		if (r || (c = vf(e, i).trim(), !c) || e.sCount[i] - e.blkIndent >= 4 || (l = yf(c), l.length && l[0] === "" && l.shift(), l.length && l[l.length - 1] === "" && l.pop(), y += d - l.length, y > _f)) break;
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
function xf(e, t, n) {
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
function Sf(e, t, n, r) {
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
function Cf(e, t, n, r) {
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
				if (vd(t)) t === 9 ? o += 4 - (o + e.bsCount[m] + +!!r) % 4 : o++;
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
function wf(e, t, n, r) {
	let i = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let a = e.bMarks[t] + e.tShift[t], o = e.src.charCodeAt(a++);
	if (o !== 42 && o !== 45 && o !== 95) return !1;
	let s = 1;
	for (; a < i;) {
		let t = e.src.charCodeAt(a++);
		if (t !== o && !vd(t)) return !1;
		t === o && s++;
	}
	if (s < 3) return !1;
	if (r) return !0;
	e.line = t + 1;
	let c = e.push("hr", "hr", 0);
	return c.map = [t, e.line], c.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function Tf(e, t) {
	let n = e.eMarks[t], r = e.bMarks[t] + e.tShift[t], i = e.src.charCodeAt(r++);
	return i !== 42 && i !== 45 && i !== 43 || r < n && !vd(e.src.charCodeAt(r)) ? -1 : r;
}
function Ef(e, t) {
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
	return i < r && (a = e.src.charCodeAt(i), !vd(a)) ? -1 : i;
}
function Df(e, t) {
	let n = e.level + 2;
	for (let r = t + 2, i = e.tokens.length - 2; r < i; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Of(e, t, n, r) {
	let i, a, o, s, c = t, l = !0;
	if (e.sCount[c] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent) return !1;
	let u = !1;
	r && e.parentType === "paragraph" && e.sCount[c] >= e.blkIndent && (u = !0);
	let d, f, p;
	if ((p = Ef(e, c)) >= 0) {
		if (d = !0, o = e.bMarks[c] + e.tShift[c], f = Number(e.src.slice(o, p - 1)), u && f !== 1) return !1;
	} else if ((p = Tf(e, c)) >= 0) d = !1;
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
			if (p = Ef(e, c), p < 0) break;
			o = e.bMarks[c] + e.tShift[c];
		} else if (p = Tf(e, c), p < 0) break;
		if (m !== e.src.charCodeAt(p - 1)) break;
	}
	return s = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(m), g[1] = c, e.line = c, e.parentType = y, l && Df(e, h), !0;
}
function kf(e, t, n, r) {
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
		} else if (!vd(e)) break;
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
		} else if (!vd(e)) break;
	}
	let h = e.md.helpers.parseLinkTitle(c, i, a);
	for (; h.can_continue;) {
		let t = s(o);
		if (t === null) break;
		c += t, i = a, a = c.length, o++, h = e.md.helpers.parseLinkTitle(c, i, a, h);
	}
	let g;
	for (i < a && m !== i && h.ok ? (g = h.str, i = h.pos) : (g = "", i = f, o = p); i < a && vd(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10 && g) for (g = "", i = f, o = p; i < a && vd(c.charCodeAt(i));) i++;
	if (i < a && c.charCodeAt(i) !== 10) return !1;
	let _ = Cd(c.slice(1, l));
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
var Af = /* @__PURE__ */ "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split("."), jf = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>", Mf = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Nf = RegExp(`^(?:${jf}|${Mf}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`), Pf = RegExp(`^(?:${jf}|${Mf})`), Ff = [
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
		RegExp(`^</?(${Af.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		!0
	],
	[
		RegExp(`${Pf.source}\\s*$`),
		/^$/,
		!1
	]
];
function If(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
	let o = e.src.slice(i, a), s = 0;
	for (; s < Ff.length && !Ff[s][0].test(o); s++);
	if (s === Ff.length) return !1;
	if (r) return Ff[s][2];
	let c = t + 1, l = Ff[s][1].test("");
	if (!Ff[s][1].test(o)) {
		for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++) if (i = e.bMarks[c] + e.tShift[c], a = e.eMarks[c], o = e.src.slice(i, a), Ff[s][1].test(o)) {
			o.length !== 0 && c++;
			break;
		}
	}
	e.line = c;
	let u = e.push("html_block", "", 0);
	return u.map = [t, c], u.content = e.getLines(t, c, e.blkIndent, !0), !0;
}
function Lf(e, t, n, r) {
	let i = e.bMarks[t] + e.tShift[t], a = e.eMarks[t];
	if (e.sCount[t] - e.blkIndent >= 4) return !1;
	let o = e.src.charCodeAt(i);
	if (o !== 35 || i >= a) return !1;
	let s = 1;
	for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) s++, o = e.src.charCodeAt(++i);
	if (s > 6 || i < a && !vd(o)) return !1;
	if (r) return !0;
	a = e.skipSpacesBack(a, i);
	let c = e.skipCharsBack(a, 35, i);
	c > i && vd(e.src.charCodeAt(c - 1)) && (a = c), e.line = t + 1;
	let l = e.push("heading_open", `h${s}`, 1);
	l.markup = "########".slice(0, s), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = Td(e.src.slice(i, a)), u.map = [t, e.line], u.children = [];
	let d = e.push("heading_close", `h${s}`, -1);
	return d.markup = "########".slice(0, s), !0;
}
function Rf(e, t, n) {
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
	let c = Td(e.getLines(t, s, e.blkIndent, !1));
	e.line = s + 1;
	let l = e.push("heading_open", `h${a}`, 1);
	l.markup = String.fromCharCode(o), l.map = [t, e.line];
	let u = e.push("inline", "", 0);
	u.content = c, u.map = [t, e.line - 1], u.children = [];
	let d = e.push("heading_close", `h${a}`, -1);
	return d.markup = String.fromCharCode(o), e.parentType = i, !0;
}
function zf(e, t, n) {
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
	let o = Td(e.getLines(t, a, e.blkIndent, !1));
	e.line = a;
	let s = e.push("paragraph_open", "p", 1);
	s.map = [t, e.line];
	let c = e.push("inline", "", 0);
	return c.content = o, c.map = [t, e.line], c.children = [], e.push("paragraph_close", "p", -1), e.parentType = i, !0;
}
var Bf = [
	[
		"table",
		bf,
		["paragraph", "reference"]
	],
	["code", xf],
	[
		"fence",
		Sf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		Cf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		wf,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		Of,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", kf],
	[
		"html_block",
		If,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		Lf,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", Rf],
	["paragraph", zf]
], Vf = class {
	constructor() {
		$(this, "ruler", new Fd()), $(this, "State", gf);
		for (let e = 0; e < Bf.length; e++) this.ruler.push(Bf[e][0], Bf[e][1], { alt: (Bf[e][2] || []).slice() });
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
}, Hf = class {
	constructor(e, t, n, r) {
		$(this, "pos", 0), $(this, "level", 0), $(this, "pending", ""), $(this, "pendingLevel", 0), $(this, "cache", {}), $(this, "backticks", {}), $(this, "backticksScanned", !1), $(this, "linkLevel", 0), $(this, "delimiters", []), $(this, "_prev_delimiters", []), $(this, "Token", Pd), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
	}
	pushPending() {
		let e = new Pd("text", "", 0);
		return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
	}
	push(e, t, n) {
		this.pending && this.pushPending();
		let r = new Pd(e, t, n), i;
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
		let c = Sd(i) || xd(i), l = Sd(s) || xd(s), u = yd(i), d = yd(s), f = !d && (!l || u || c), p = !u && (!c || d || l);
		return {
			can_open: f && (t || !p || c),
			can_close: p && (t || !f || l),
			length: o
		};
	}
};
function Uf(e) {
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
function Wf(e, t) {
	let n = e.pos;
	for (; n < e.posMax && !Uf(e.src.charCodeAt(n));) n++;
	return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function Gf(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function Kf(e) {
	return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function qf(e, t) {
	if (!e.md.options.linkify || e.linkLevel > 0) return !1;
	let n = e.pos, r = e.posMax;
	if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
	let i = n - Math.min(10, e.pending.length, n), a = n;
	for (; a > i && Kf(e.src.charCodeAt(a - 1));) a--;
	if (a === n || !Gf(e.src.charCodeAt(a))) return !1;
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
function Jf(e, t) {
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
	for (n++; n < i && vd(e.src.charCodeAt(n));) n++;
	return e.pos = n, !0;
}
var Yf = [];
for (let e = 0; e < 256; e++) Yf.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
	Yf[e.charCodeAt(0)] = 1;
});
function Xf(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
	let i = e.src.charCodeAt(n);
	if (i === 10) {
		for (t || e.push("hardbreak", "br", 0), n++; n < r && (i = e.src.charCodeAt(n), vd(i));) n++;
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
		t.content = i < 256 && Yf[i] !== 0 ? a : o, t.markup = o, t.info = "escape";
	}
	return e.pos = n + 1, !0;
}
function Zf(e) {
	let t = {}, n = 0;
	for (; (n = e.indexOf("`", n)) !== -1;) {
		let r = n;
		for (; e.charCodeAt(++n) === 96;);
		t[n - r] = r;
	}
	return t;
}
function Qf(e, t) {
	let n = e.pos;
	if (e.src.charCodeAt(n) !== 96) return !1;
	let r = e.posMax, i = n + 1;
	for (; i < r && e.src.charCodeAt(i) === 96;) i++;
	let a = e.src.slice(n, i), o = a.length;
	if (e.backticksScanned ||= (e.backticks = Zf(e.src), !0), (e.backticks[o] ?? -1) >= i) {
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
function $f(e, t) {
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
function ep(e, t) {
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
function tp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	ep(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && ep(e, n);
	}
}
var np = {
	tokenize: $f,
	postProcess: tp
};
function rp(e, t) {
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
function ip(e, t) {
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
function ap(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	ip(e, e.delimiters);
	for (let r = 0; r < n; r++) {
		let n = t[r]?.delimiters;
		n && ip(e, n);
	}
}
var op = {
	tokenize: rp,
	postProcess: ap
};
function sp(e, t) {
	let n, r, i, a, o = "", s = "", c = e.pos, l = !0;
	if (e.src.charCodeAt(e.pos) !== 91) return !1;
	let u = e.pos, d = e.posMax, f = e.pos + 1, p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
	if (p < 0) return !1;
	let m = p + 1;
	if (m < d && e.src.charCodeAt(m) === 40) {
		for (l = !1, m++; m < d && (n = e.src.charCodeAt(m), vd(n) || n === 10); m++);
		if (m >= d) return !1;
		if (c = m, i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax), i.ok) {
			for (o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? m = i.pos : o = "", c = m; m < d && (n = e.src.charCodeAt(m), vd(n) || n === 10); m++);
			if (i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax), m < d && c !== m && i.ok) for (s = i.str, m = i.pos; m < d && (n = e.src.charCodeAt(m), vd(n) || n === 10); m++);
		}
		(m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++;
	}
	if (l) {
		if (e.env.references === void 0) return !1;
		if (m < d && e.src.charCodeAt(m) === 91 ? (c = m + 1, m = e.md.helpers.parseLinkLabel(e, m), m >= 0 ? r = e.src.slice(c, m++) : m = p + 1) : m = p + 1, r ||= e.src.slice(f, p), r = Cd(r), a = e.env.references[r], !a) return e.pos = u, !1;
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
function cp(e, t) {
	let n, r, i, a, o, s, c, l, u = "", d = e.pos, f = e.posMax;
	if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
	let p = e.pos + 2, m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
	if (m < 0) return !1;
	if (a = m + 1, a < f && e.src.charCodeAt(a) === 40) {
		for (a++; a < f && (n = e.src.charCodeAt(a), vd(n) || n === 10); a++);
		if (a >= f) return !1;
		for (l = a, s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), s.ok && (u = e.md.normalizeLink(s.str), e.md.validateLink(u) ? a = s.pos : u = ""), l = a; a < f && (n = e.src.charCodeAt(a), vd(n) || n === 10); a++);
		if (s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < f && l !== a && s.ok) for (c = s.str, a = s.pos; a < f && (n = e.src.charCodeAt(a), vd(n) || n === 10); a++);
		else c = "";
		if (a >= f || e.src.charCodeAt(a) !== 41) return e.pos = d, !1;
		a++;
	} else {
		if (e.env.references === void 0) return !1;
		if (a < f && e.src.charCodeAt(a) === 91 ? (l = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(l, a++) : a = m + 1) : a = m + 1, i ||= e.src.slice(p, m), i = Cd(i), o = e.env.references[i], !o) return e.pos = d, !1;
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
var lp = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, up = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function dp(e, t) {
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
	if (up.test(a)) {
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
	if (lp.test(a)) {
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
function fp(e) {
	return /^<a[>\s]/i.test(e);
}
function pp(e) {
	return /^<\/a\s*>/i.test(e);
}
function mp(e) {
	let t = e | 32;
	return t >= 97 && t <= 122;
}
function hp(e, t) {
	if (!e.md.options.html) return !1;
	let n = e.posMax, r = e.pos;
	if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
	let i = e.src.charCodeAt(r + 1);
	if (i !== 33 && i !== 63 && i !== 47 && !mp(i)) return !1;
	let a = e.src.slice(r).match(Nf);
	if (!a) return !1;
	if (!t) {
		let t = e.push("html_inline", "", 0);
		t.content = a[0], fp(t.content) && e.linkLevel++, pp(t.content) && e.linkLevel--;
	}
	return e.pos += a[0].length, !0;
}
var gp = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, _p = /^&([a-z][a-z0-9]{1,31});/i;
function vp(e, t) {
	let n = e.pos, r = e.posMax;
	if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
	if (e.src.charCodeAt(n + 1) === 35) {
		let r = e.src.slice(n).match(gp);
		if (r) {
			if (!t) {
				let t = r[1][0].toLowerCase() === "x" ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10), n = e.push("text_special", "", 0);
				n.content = rd(t) ? id(t) : id(65533), n.markup = r[0], n.info = "entity";
			}
			return e.pos += r[0].length, !0;
		}
	} else {
		let r = e.src.slice(n).match(_p);
		if (r) {
			let n = hu(r[0]);
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
function yp(e) {
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
function bp(e) {
	let t = e.tokens_meta, n = e.tokens_meta.length;
	yp(e.delimiters);
	for (let e = 0; e < n; e++) {
		let n = t[e]?.delimiters;
		n && yp(n);
	}
}
function xp(e) {
	let t, n, r = 0, i = e.tokens, a = e.tokens.length;
	for (t = n = 0; t < a; t++) i[t].nesting < 0 && r--, i[t].level = r, i[t].nesting > 0 && r++, i[t].type === "text" && t + 1 < a && i[t + 1].type === "text" ? i[t + 1].content = i[t].content + i[t + 1].content : (t !== n && (i[n] = i[t]), n++);
	t !== n && (i.length = n);
}
var Sp = [
	["text", Wf],
	["linkify", qf],
	["newline", Jf],
	["escape", Xf],
	["backticks", Qf],
	["strikethrough", np.tokenize],
	["emphasis", op.tokenize],
	["link", sp],
	["image", cp],
	["autolink", dp],
	["html_inline", hp],
	["entity", vp]
], Cp = [
	["balance_pairs", bp],
	["strikethrough", np.postProcess],
	["emphasis", op.postProcess],
	["fragments_join", xp]
], wp = class {
	constructor() {
		$(this, "ruler", new Fd()), $(this, "ruler2", new Fd()), $(this, "State", Hf);
		for (let e = 0; e < Sp.length; e++) this.ruler.push(Sp[e][0], Sp[e][1]);
		for (let e = 0; e < Cp.length; e++) this.ruler2.push(Cp[e][0], Cp[e][1]);
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
}, Tp = {
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
}, Ep = /^(vbscript|javascript|file|data):/, Dp = /^data:image\/(gif|png|jpeg|webp);/, Op = [
	"http:",
	"https:",
	"mailto:"
], kp = class {
	validateLink(e) {
		let t = e.trim().toLowerCase();
		return !Ep.test(t) || Dp.test(t);
	}
	normalizeLink(e) {
		let t = Fl(e, !0);
		if (t.hostname && (!t.protocol || Op.indexOf(t.protocol) >= 0)) try {
			t.hostname = Zu.toASCII(t.hostname);
		} catch {}
		return t.auth &&= Sl(t.auth), t.hostname &&= Sl(t.hostname), t.pathname &&= Sl(t.pathname), t.search &&= Sl(t.search), t.hash &&= Sl(t.hash), Cl(t);
	}
	normalizeLinkText(e) {
		let t = Fl(e, !0);
		if (t.hostname && (!t.protocol || Op.indexOf(t.protocol) >= 0)) try {
			t.hostname = Zu.toUnicode(t.hostname);
		} catch {}
		return yl(Cl(t), yl.defaultChars + "%");
	}
	constructor(...e) {
		$(this, "inline", new wp()), $(this, "block", new Vf()), $(this, "core", new hf()), $(this, "renderer", new Ld()), $(this, "linkify", new wu()), $(this, "utils", ed), $(this, "helpers", Object.assign({}, Ad));
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
			if (t = Tp[n], !t) throw Error(`Wrong 'markdown-it' preset "${n}", check name`);
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
$(kp, "Token", Pd), $(kp, "Ruler", Fd), $(kp, "Renderer", Ld), $(kp, "ParserCore", hf), $(kp, "StateCore", Rd), $(kp, "ParserBlock", Vf), $(kp, "StateBlock", gf), $(kp, "ParserInline", wp), $(kp, "StateInline", Hf);
var Ap = td(kp), jp = {
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
}, Mp = new Set("txt md csv json xml yaml yml py js ts tsx jsx css sh sql toml rs go java c cpp h html htm svg".split(" ")), Np = `(?:~/|/|[A-Za-z]:[/\\\\])\\S+?(?:[^\\S\\n]+\\S+?)*?\\.(?:${"png jpg jpeg gif webp bmp tiff svg mp4 mov avi mkv webm 3gp mp3 m2a wav ogg opus m4a flac pdf docx doc odt rtf txt md epub xlsx xls ods csv tsv json xml yaml yml kmz kml geojson gpx pptx ppt odp key zip tar gz tgz bz2 xz 7z rar apk ipa html htm".split(" ").sort((e, t) => t.length - e.length).join("|")})(?=[\\s\`"'*_,;:)\\]}]|MEDIA:|$)`, Pp = RegExp(`MEDIA:\\s*(\`[^\`\n]+\`|"[^"\n]+"|'[^'\n]+'|${Np}|[^\\s\`"]+)`, "g");
function Fp(e) {
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
var Ip = new Ap({ html: !0 });
for (let e of ["image", "link"]) {
	let t = Ip.inline.ruler.__rules__.find((t) => t.name === e).fn;
	Ip.inline.ruler.at(e, (n, r) => {
		let i = n.pos, a = n.tokens.length, o = t(n, r), s = n.tokens.slice(a).find((t) => t.type === (e === "image" ? "image" : "link_open"));
		return !r && s && (s.type === "image" || s.type === "link_open") && (s.meta = {
			deliveryRange: [i, n.pos],
			escapedImage: e === "link" && n.src[i - 1] === "!"
		}), o;
	});
}
function Lp(e, t) {
	let n = Ip.parseInline(e, {})[0]?.children || [], r = 0, i = 0;
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
function Rp(e, t) {
	let n = [], r = 0;
	for (let t of e.matchAll(Pp)) {
		if (e.slice(r, t.index).trim()) return e;
		let i = Fp(t[1]);
		if (!/^(?:file:|\/|[~.][\\/]|\.\.[\\/]|[a-z]:[\\/]|\\\\|https?:\/\/|data:image\/)/i.test(i)) return e;
		n.push(i), r = t.index + t[0].length;
	}
	return !n.length || e.slice(r).trim() ? e : n.every((e) => !!Bp(e)) && n.every(t) ? "" : e;
}
function zp(e) {
	return e.split(".").at(-1)?.toLowerCase() || "";
}
function Bp(e, t) {
	try {
		e.startsWith("#media:") && (e = decodeURIComponent(e.slice(7))), e.startsWith("sandbox:") && (e = e.slice(8)), e.startsWith("file:") && (e = decodeURIComponent(new URL(e).pathname));
	} catch {
		return;
	}
	if (!/^(\/|[~.][\\/]|\.\.[\\/]|[A-Za-z]:[\\/]|\\\\|data:image\/|https?:\/\/)/.test(e)) return;
	let n = e.split(/[\\/]/).at(-1)?.split(/[?#]/)[0] || "";
	t = (t && /\.[a-z0-9]{1,12}$/i.test(t) ? t : n) || t || "Attached image";
	let r = zp(t);
	return {
		path: e,
		name: t,
		type: jp[r] || (Mp.has(r) ? "text/plain" : "application/octet-stream")
	};
}
function Vp(e) {
	if (e.type.startsWith("image/") && e.type !== "image/svg+xml") return "image";
	if (e.type === "application/pdf") return "pdf";
	if (e.type.startsWith("audio/")) return "audio";
	if (e.type.startsWith("video/")) return "video";
	if (Mp.has(zp(e.name))) return "text";
}
function Hp(e, t = "", n = !1) {
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
var Up = new Ap({ html: !0 }), Wp = Up.inline.ruler.__rules__.find((e) => e.name === "backticks").fn;
Up.inline.ruler.at("backticks", (e, t) => {
	let n = e.pos, r = e.tokens.length, i = Wp(e, t), a = e.tokens.at(-1);
	return !t && e.tokens.length > r && a?.type === "code_inline" && (a.meta = { deliveryLines: [e.src.slice(0, n).split("\n").length - 1, e.src.slice(0, e.pos).split("\n").length - 1] }), i;
});
function Gp(e) {
	let t = [];
	if (!/MEDIA:|Attached (?:image|file) /.test(e)) return {
		text: e,
		files: t
	};
	let n = (e, n) => {
		let r = Bp(e, n);
		return r ? (t.some((e) => e.path === r.path) || t.push(r), !0) : !1;
	}, r = e.split("\n"), i = [...r], a = !1, o = [], s = Up.parse(e, {}), c = /* @__PURE__ */ new Set();
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
			s && n(s[2].trim(), s[1]) ? (a = !0, i[e] = "") : /^@file:(?:"[^"\n]+"|'[^'\n]+'|[^\s<>]+)\r?$/.test(t) ? o.push(e) : t.startsWith("MEDIA:") ? i[e] = Rp(t, n) : i[e] = Lp(t, n);
		}
	}
	if (a) for (let e of o) i[e] = "";
	return {
		text: t.length ? i.filter((e, t) => e !== "" || r[t] === "").join("\n").trim() : e,
		files: t
	};
}
function Kp(e) {
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
	let a = Gp(i);
	return a.text.trim() ? [] : a.files.map((e) => {
		let t = r.mime_type || r.mime;
		typeof t == "string" && /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(t) && (e.type = t);
		let n = r.size ?? r.bytes;
		return typeof n == "number" && Number.isSafeInteger(n) && n >= 0 && (e.size = n), e;
	});
}
function qp(e) {
	return Gp(e);
}
function Jp(e) {
	if (e.role !== "user" && e.role !== "assistant") return [];
	let { content: t } = e, n = (e.role === "user" ? qp : Gp)(al(t)).files, r = n.filter((e) => Vp(e) === "image");
	if (Array.isArray(t)) {
		let e = 0;
		for (let i of t) {
			let t = i?.image_url?.url;
			if (gl(t)) {
				if (r.length) {
					let n = r[e++];
					n && !t.startsWith("/api/plugins/chathermes/artifact-images/") && (n.imageData = t);
				} else {
					let e = Bp(t, "Attached image.png");
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
var Yp = {
	auto_continue: "Resuming interrupted turn…",
	process_complete: "Background process completed",
	async_delegation_complete: "Delegated work completed",
	model_switch: "Model changed",
	personality_switch: "Personality changed",
	failed_turn: "Response did not complete · verify any actions before resending"
};
function Xp(e) {
	return e.display_kind === "compaction" ? "compaction" : e.display_kind === "hidden" ? "hidden" : e.display_kind && Object.hasOwn(Yp, e.display_kind) ? "status" : e.role === "system" ? "hidden" : "message";
}
function Zp(e) {
	let t = e.display_metadata;
	if (e.display_kind === "model_switch" && t && typeof t == "object") {
		let e = "model" in t && typeof t.model == "string" ? t.model : "";
		if (e) return `Model changed to ${e}`;
	}
	return t && typeof t == "object" && "display_text" in t && typeof t.display_text == "string" ? t.display_text : Yp[e.display_kind || ""] || "";
}
function Qp(e) {
	return e === "interrupted" ? "Response interrupted" : e === "cancelled" ? "Response cancelled" : e === "error" || e === "failed" ? "Response failed" : "Response completed";
}
//#endregion
//#region src/features/chat/runtime/assistant-turn.ts
var $p = (e) => typeof e == "string" ? e : "", em = (e) => typeof e == "string" ? e : e == null ? "" : JSON.stringify(e, null, 2);
function tm(e) {
	let t = $p(e.subagent_id) || $p(e.child_session_id);
	if (t) return t;
	let n = $p(e.delegation_id);
	return n && typeof e.task_index == "number" && Number.isSafeInteger(e.task_index) ? `${n}:${e.task_index}` : "";
}
function nm(e) {
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
function rm(e, t = !1) {
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
var im = () => ({
	blocks: [],
	seen: /* @__PURE__ */ new Set(),
	sequence: 0
});
function am(e) {
	om(e);
	for (let t of e.blocks) t.kind !== "text" && (t.complete = !0, t.kind === "thinking" && (t.title = "Thought"), (!t.state || t.state === "running" || t.state === "pending") && (t.state = t.kind === "tool" ? "unknown" : "completed"));
}
function om(e) {
	for (let t of e.blocks) t.kind === "thinking" && (t.complete = !0, t.state = "completed", t.title = "Thought", t.duration === void 0 && t.startedAt !== void 0 && (t.duration = Math.max(0, (Date.now() - t.startedAt) / 1e3)));
}
function sm(e, t) {
	if (t.key && e.seen.has(t.key)) return;
	t.key && e.seen.add(t.key);
	let { type: n, data: r } = t, i = $p(r.delta) || $p(r.text) || $p(r.preview), a = $p(r.tool_call_id) || $p(r.tool_id), o = $p(r.tool_name) || $p(r.name) || $p(r.tool), s = () => `block-${++e.sequence}`;
	if (n === "text" || n === "text.snapshot" || n === "text.completed") {
		om(e);
		let t = n === "text.completed" ? $p(r.content) : i;
		if (!t || n === "text.completed" && [...e.blocks].reverse().find((e) => e.kind === "text")?.content === t) return;
		let a = e.blocks.at(-1);
		if (n === "text.snapshot") {
			let n = e.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("");
			if (n === t || n.startsWith(t)) return;
			if (t.startsWith(n)) {
				sm(e, {
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
	} else if (n === "reasoning.completed") om(e);
	else if (n.startsWith("tool.")) {
		om(e);
		let t = e.blocks.find((e) => e.kind === "tool" && a && e.id === a);
		if (!t && !a && (t = [...e.blocks].reverse().find((e) => e.kind === "tool" && !e.complete && (!o || e.toolName === o))), t || (t = {
			id: a || s(),
			kind: "tool",
			title: rm(o),
			toolName: o,
			content: "",
			complete: !1,
			state: "pending",
			startedAt: r.persisted ? void 0 : typeof r.ts == "number" ? r.ts * 1e3 : Date.now()
		}, e.blocks.push(t)), n === "tool.started" && t.complete) return;
		n === "tool.started" ? (t.state = "running", t.content = em(r.args) || i || t.content) : n === "tool.updated" ? (t.complete || (t.state = "running"), t.output = (t.output || "") + i) : (t.complete = !0, t.state = n === "tool.failed" || nm(r.output ?? r.result) || r.is_error || r.error ? "failed" : "completed", t.title = rm(t.toolName || o, !0), t.output = em(r.output ?? r.result ?? r.error) || t.output || i, t.content = em(r.args) || t.content, t.duration = typeof r.duration_s == "number" ? r.duration_s : t.startedAt ? Math.max(0, ((typeof r.ts == "number" ? r.ts * 1e3 : Date.now()) - t.startedAt) / 1e3) : void 0);
	} else {
		if (n === "failed") for (let t of e.blocks) t.kind === "tool" && !t.complete && (t.state = "failed", t.output ||= "The response ended before this tool completed.");
		am(e);
	}
}
function cm(e) {
	let t = im();
	for (let n of e) {
		if (n.blocks) {
			t.blocks.push(...n.blocks);
			continue;
		}
		if (Xp(n) === "message") {
			if (n.role === "assistant") {
				let e = n.reasoning_content || n.reasoning;
				e && (sm(t, {
					type: "reasoning",
					data: {
						delta: e,
						persisted: !0
					}
				}), om(t));
				let r = al(n.content);
				r && t.blocks.push({
					id: `block-${++t.sequence}`,
					kind: "text",
					content: r
				});
				let i = Array.isArray(n.content) ? n.content.flatMap((e) => {
					let t = e?.image_url?.url;
					return gl(t) ? [t] : [];
				}) : [];
				if (i.length) {
					let e = t.blocks.at(-1);
					e?.kind !== "text" && (e = {
						id: `block-${++t.sequence}`,
						kind: "text",
						content: ""
					}, t.blocks.push(e)), e.images = i;
				}
				for (let e of n.tool_calls || []) sm(t, {
					type: "tool.started",
					data: {
						tool_call_id: e.id,
						tool_name: e.function?.name,
						args: e.function?.arguments,
						persisted: !0
					}
				});
			} else if (n.role === "tool") {
				let e = al(n.content), r = !1;
				try {
					let t = JSON.parse(e);
					r = t?.is_error === !0 || t?.success === !1 || !!t?.error || typeof t?.exit_code == "number" && t.exit_code !== 0;
				} catch {}
				sm(t, {
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
	return om(t), t.blocks;
}
function lm(e, t, n) {
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
function um(e, t) {
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
function dm(e, t, n) {
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
			let t = $p(n.text).trim();
			if (!t) return;
			om(e);
			let o = i(r.streamText);
			if (!o) {
				let e = i(r.interimText ?? r.finalText);
				e && e.content.replace(/\s+/g, " ").trim() === t.replace(/\s+/g, " ").trim() && (o = e);
			}
			o ??= a(t), o.content = t, r.interimText = o.id, r.streamText = void 0, r.finalText = void 0, r.toolStream = !1;
		} else if (t === "message.delta" || t === "message.complete") {
			let o = $p(n.text);
			if (t === "message.delta" && o) {
				om(e);
				let t = i(r.streamText);
				(!t || t !== e.blocks.at(-1)) && (t = a("")), t.content += o, r.streamText = t.id, r.finalText = void 0;
			} else if (t === "message.complete" && o.trim() && (!n.response_reused || !e.blocks.some((e) => e.kind === "text"))) {
				om(e);
				let t = o.trim(), s = i(r.streamText), c = e.blocks.reduce((e, t, n) => t.kind === "tool" ? n : e, -1), l = s && e.blocks.indexOf(s) > c ? s : void 0, u = i(r.interimText), d = !!(n.error || n.status && n.status !== "complete"), f = !d && u && u.content.trim() === t && (!l || l.content.trim() === t), p = !d && !l && !r.toolStream && u && u.content.trim() && (n.response_previewed || n.response_transformed || u.content.trim() === t || t.startsWith(u.content.trim()) || u.content.trim().startsWith(t) || um(u.content.trim(), t)), m;
				if (f || p) m = u, l && l !== u && e.blocks.splice(e.blocks.indexOf(l), 1);
				else {
					let e = i(r.finalText);
					m = l ?? (e?.content.trim() === t ? e : a(""));
				}
				m.content = t, r.finalText = m.id, r.streamText = void 0, r.interimText = void 0, r.toolStream = !1;
			}
			if (t === "message.complete") {
				for (let t of e.blocks) t.kind !== "text" && !t.delegated && (t.complete = !0, (!t.state || t.state === "running" || t.state === "pending") && (t.state = n.status === "cancelled" || n.status === "interrupted" ? "interrupted" : "unknown"));
				n.reasoning && !e.blocks.some((e) => e.kind === "thinking") && sm(e, {
					type: "reasoning",
					data: { text: n.reasoning }
				}), om(e);
			}
		} else if (t === "reasoning.delta" || t === "reasoning.available") {
			if (t === "reasoning.available") {
				let t = i(r.streamText ?? r.finalText)?.content.trim();
				if (t && t.slice(0, 500).trim() === $p(n.text).trim()) return;
				let a = [...e.blocks].reverse().find((e) => e.kind === "thinking");
				if (a && a.kind === "thinking") {
					a.content = $p(n.text);
					return;
				}
			}
			sm(e, {
				type: "reasoning",
				data: {
					...n,
					delta: n.text
				}
			});
		} else if (t === "tool.start" || t === "tool.complete" || t === "tool.progress") {
			t === "tool.start" && (r.toolStream = !0);
			let i = n.result, a = n.is_error || n.error || nm(i) || nm(n.result_text);
			sm(e, {
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
			let r = tm(n);
			if (!r) return;
			sm(e, {
				type: [
					"subagent.complete",
					"subagent.failed",
					"subagent.cancelled"
				].includes(t) ? t === "subagent.complete" && n.status === "completed" ? "tool.completed" : "tool.failed" : "tool.updated",
				data: {
					tool_call_id: "subagent-" + r,
					tool_name: $p(n.name) || "Delegated task",
					delta: $p(n.text),
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
function fm(e) {
	let t = e.messages.map((e) => Object.hasOwn(e, "display_content") ? {
		...e,
		content: e.display_content
	} : e).filter((e) => Xp(e) !== "hidden" || !!e.blocks?.length), n = [], r = (e) => [...e].reverse().find((e) => e.role === "assistant" && al(e.content).trim())?.id, i = 0;
	for (let a = 0; a < t.length;) {
		let o = t[a];
		if (Xp(o) === "compaction") {
			n.push({
				kind: "compaction",
				key: o.id || `compaction-${a}`
			}), a++;
			continue;
		}
		if (o.role === "user" || Xp(o) === "status") {
			let s = Xp(o);
			if (o.display_kind === "async_delegation_complete") {
				let e = o.id || `delegation-${a}`;
				n.push({
					kind: "turn",
					key: `receipt-${e}`,
					blocks: [{
						id: `receipt-${e}`,
						kind: "tool",
						title: Zp(o),
						content: al(o.content),
						complete: !0,
						state: "completed"
					}]
				});
			} else s === "status" ? n.push({
				kind: "status",
				text: Zp(o),
				content: al(o.content),
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
			for (; c < t.length && t[c].role !== "user" && Xp(t[c]) === "message";) c++;
			let l = c === t.length, u = l && (!e.turnUserCount || e.turnUserCount === i) && e.blocks?.length ? e.blocks : o.blocks || cm(t.slice(a + 1, c)), d = u.length ? u : l ? e.progress : [], f = l && (e.working ?? !!((o.blocks || e.blocks?.length || e.progress.length) && d.some((e) => e.kind !== "text" && !e.complete)));
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
			for (; e < t.length && t[e].role !== "user" && Xp(t[e]) === "message";) e++;
			n.push({
				kind: "turn",
				blocks: cm(t.slice(a, e)),
				responseId: r(t.slice(a, e)),
				key: o.display_id || o.id ? `history-${o.display_id || o.id}` : `history-${a}`
			}), a = e;
		}
	}
	return n;
}
//#endregion
//#region src/features/chat/utils/saved-response-targets.ts
function pm(e) {
	let t = al(e.content);
	qp(t).files.length && (t = t.replace(/\n@file:[^\n]+\n\n--- Attached Context ---\n[\s\S]*$/, ""));
	let n = qp(t);
	return JSON.stringify([n.text, n.files.map((e) => e.path).sort()]);
}
function mm(e, t) {
	let n = (e) => fm({
		messages: e,
		progress: []
	}).flatMap((e) => {
		if (e.kind === "user") return [{
			kind: "user",
			text: pm(e.message),
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
var hm = (e, t) => "chathermes.native-outcome:" + JSON.stringify([e || "default", t]), gm = (e, t) => e && e !== "default" ? [hm(e, t)] : [hm("default", t), "chathermes.native-outcome:" + JSON.stringify(["", t])];
function _m(e, t) {
	try {
		let n = gm(e, t);
		return Object.keys(localStorage).some((e) => n.some((t) => e === t || e.startsWith(t + ":")) && localStorage.getItem(e) === "unknown");
	} catch {
		return !0;
	}
}
function vm(e, t) {
	let n = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
	try {
		localStorage.setItem(hm(e, t) + ":" + n, "unknown");
	} catch {
		throw Error("Cannot safely record native submission state");
	}
	return n;
}
function ym(e, t, n) {
	try {
		for (let r of gm(e, t)) if (n) localStorage.removeItem(r + ":" + n);
		else for (let e of Object.keys(localStorage)) (e === r || e.startsWith(r + ":")) && localStorage.removeItem(e);
	} catch {}
}
//#endregion
//#region src/features/chat/runtime/native-session.ts
function bm(e, t, n, r) {
	let i = /* @__PURE__ */ B(), a = /* @__PURE__ */ B(null), o = /* @__PURE__ */ B(null), s = /* @__PURE__ */ B(!1), c = !1, l = 0, u = 0;
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
		let e = N, t = oe, n = ++u;
		if (c && t && j.value === "ready") {
			s.value = !0;
			try {
				let r = await t.contextBreakdown();
				e === N && n === u && t === oe && c && (o.value = r);
			} catch {
				e === N && n === u && (o.value = null);
			} finally {
				e === N && n === u && (s.value = !1);
			}
		}
	}
	async function h() {
		let e = N, t = oe, n = ++l;
		if (ue && t && j.value === "ready") try {
			let r = await t.usage();
			e === N && n === l && t === oe && p(r);
		} catch {
			e === N && n === l && (a.value = null);
		}
	}
	function g(e) {
		c = e, d(), e && m();
	}
	let _ = /* @__PURE__ */ B(!1), v = /* @__PURE__ */ B(!1), y = /* @__PURE__ */ B(""), b, x = 0, S = !1, C = !1, w;
	async function T(e, t = 0) {
		let n = Math.max(120, t, b?.nextOffset || 0), r = b?.messages.find((e) => e.display_kind !== "compaction"), i = r?.display_id || r?.id, a = (e) => !i || e.some((e) => (e.display_id || e.id) === i), o = _e, s = z;
		for (let t = 0;; t++) try {
			let t = await Q.latestMessages(o, s, e), r = JSON.stringify(t.messages);
			for (; t.hasMore && (t.nextOffset < n || !a(t.messages));) {
				let n = await Q.latestMessages(o, s, e, t.nextOffset, t.revision);
				if (t.revision && n.revision !== t.revision) throw new Kc(409, "Transcript changed");
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
				if (JSON.stringify(t.messages) !== r) throw new Kc(409, "Transcript changed");
			}
			return t;
		} catch (e) {
			if (!(e instanceof Kc) || e.status !== 409 || t >= 2) throw e;
		}
	}
	function E(e) {
		b = e, _.value = e.hasMore, y.value = "", x++;
	}
	async function ee() {
		if (!b?.hasMore || v.value || ne.value || P) return;
		if (S) {
			C = !0;
			return;
		}
		let e = N, t = x, n = b;
		v.value = !0, y.value = "";
		try {
			if (!n.revision) {
				await Oe(n.nextOffset + 120);
				return;
			}
			let r = new AbortController();
			w?.abort(), w = r;
			let i = await Q.latestMessages(_e, z, r.signal, n.nextOffset, n.revision);
			if (e !== N || t !== x || b !== n) return;
			if (i.revision !== n.revision) throw new Kc(409, "Transcript changed");
			let a = new Set(D.value.map((e) => e.id).filter(Boolean)), o = i.messages.filter((e) => !e.id || !a.has(e.id));
			D.value = [...o, ...D.value], E({
				...i,
				messages: [...i.messages, ...n.messages]
			});
		} catch (n) {
			if (e !== N || t !== x) return;
			n instanceof Kc && n.status === 409 ? await Oe() : y.value = "Could not load earlier messages. Try again.";
		} finally {
			e === N && (v.value = !1);
		}
	}
	let te = /* @__PURE__ */ B({}), D = /* @__PURE__ */ B([]), O = /* @__PURE__ */ B(!1), ne = /* @__PURE__ */ B(!1), k = /* @__PURE__ */ B(""), A = /* @__PURE__ */ B(""), j = /* @__PURE__ */ B("stale"), M = /* @__PURE__ */ B(0), re = /* @__PURE__ */ B([]), ie = /* @__PURE__ */ B(!1), ae = X(() => {
		let e = re.value[0];
		return e ? {
			...e.params,
			request_id: e.id,
			kind: e.method
		} : void 0;
	}), oe, N = 0, P = !1, se = !1, ce = 0, le, ue = !1, F = document.visibilityState !== "hidden", I = navigator.onLine, L, R, de = [], fe = !1, pe = !1, me = "", he = "", ge = /* @__PURE__ */ new Set(), _e = "", z = "", ve = !1, ye = !1, be = 0, xe, Se = () => {
		R && L && (R.blocks = L.blocks), D.value = [...D.value];
	}, Ce = (e) => {
		N = e, M.value = e;
	};
	function we() {
		se && (se = !1, t?.(_e, z));
	}
	function Te(e) {
		ue && _e && z && n?.(_e, z, e);
	}
	function Ee(e, t = !1, n, r = {}) {
		if (ve && !t && R && (n ? n === me : !r.display_kind && e === he)) {
			ve = !1, Se();
			return;
		}
		ve = !1, t && R && L && (sm(L, {
			type: "reasoning.completed",
			data: {}
		}), de.push({
			user: R,
			turn: L,
			hasCorrections: !0
		})), ye = t || !1, R = {
			id: `native-user-${++be}`,
			role: "user",
			content: e,
			display_kind: r.display_kind,
			display_metadata: r.display_metadata
		}, D.value.push(R), L = /* @__PURE__ */ Nt(im()), R.blocks = L.blocks, O.value = !0, Se();
	}
	function De(e, t) {
		t === N && ue && z && (i.value = {
			profile: _e,
			session: z,
			info: e.info,
			generation: t
		}), P = !0, fe = e.messages_omitted === !0, pe = !!e.queued, ce++, xe = void 0, L = void 0, R = void 0, ve = !1, de = [];
		let n = e.messages.map((e) => ({
			...e,
			id: e.row_id == null ? void 0 : String(e.row_id),
			content: e.role === "tool" ? e.content : e.text || e.content || "",
			tool_name: e.name
		})), r = new Set(e.recovery.base_row_ids || []), a = e.recovery.complete ? n.filter((e) => e.id && r.has(e.id)) : n, o = new Set(b?.messages.map((e) => e.id));
		if (D.value = b ? [...b.messages, ...a.filter((e) => !o.has(e.id))] : a, O.value = !!(e.running || e.queued), !e.recovery.complete && e.inflight?.user) {
			let t = D.value.reduce((e, t, n) => t.role === "user" ? n : e, -1);
			if (t < 0 || al(D.value[t].content) !== e.inflight.user || (D.value[t].display_kind || void 0) !== (e.inflight.display_kind || void 0)) Ee(e.inflight.user, !1, void 0, {
				display_kind: e.inflight.display_kind || void 0,
				display_metadata: e.inflight.display_metadata
			});
			else {
				R = D.value[t], L = /* @__PURE__ */ Nt(im());
				let e = cm(D.value.slice(t + 1));
				lm(L, e, O.value), R.blocks = L.blocks;
			}
			e.inflight.assistant && !L.blocks.some((e) => e.kind === "text") && sm(L, {
				type: "text.snapshot",
				data: { text: e.inflight.assistant }
			});
			for (let t of e.inflight.corrections || []) Ee(t, !0);
			e.inflight.error && (k.value = e.inflight.error), A.value = Xp(R) === "status" ? Zp(R) : e.running ? "Working…" : Qp(e.inflight.status), e.running && !e.inflight.error && (k.value = "Earlier progress is outside retained recovery; saved history is authoritative.");
		}
		O.value = !!(e.running || e.queued);
	}
	async function Oe(t = 0) {
		let n = N, r = ++ce, i = oe;
		if (!i || P || j.value !== "ready") return;
		x++, S = !0;
		let a = new AbortController();
		w?.abort(), w = a;
		try {
			let o = await T(a.signal, t), s = o.messages;
			if (n !== N || r !== ce || P) return;
			let c = s.length && !o.projected ? await i.rpc("history").catch(() => null) : { messages: [] }, l = new Map((c?.messages || []).filter((e) => e.id).map((e) => [e.id, e])), u = s.map((e) => {
				let t = l.get(e.id);
				return t ? {
					...e,
					display_kind: t.display_kind ?? e.display_kind,
					display_metadata: t.display_metadata ?? e.display_metadata
				} : e;
			});
			if (n !== N || r !== ce || P) return;
			if (E(o), fe && !O.value && R && L && !ye && !de.some((e) => e.hasCorrections)) {
				let e = u.reduce((e, t, n) => t.role === "user" ? n : e, -1), t = u[e];
				t && (t.display_kind || void 0) === (R.display_kind || void 0) && Object.keys(mm([R], u.slice(e))).length && (lm(L, cm(u.slice(e + 1)), !1), u[e] = {
					...t,
					display_id: R.display_id || R.id,
					blocks: L.blocks
				}, R = void 0, L = void 0, de = [], fe = !1, k.value === "Earlier progress is outside retained recovery; saved history is authoritative." && (k.value = ""));
			}
			if (O.value || (te.value = mm(D.value, u)), O.value && R && L) {
				let e = xe?.user_row_id, t = e ? u.findIndex((t) => t.id === String(e)) : -1;
				t >= 0 && lm(L, cm(u.slice(t + 1)), !0);
				let n = de[0]?.user || R, r = D.value.findIndex((e) => e === n || !!(e.id && e.id === n.id));
				if (r >= 0) {
					let e = new Set(D.value.slice(0, r).map((e) => e.id)), t = u.reduce((t, n, r) => e.has(n.id) ? r : t, -1), n = t >= 0 ? u.slice(0, t + 1) : [], i = u.reduce((e, t, n) => t.role === "user" ? n : e, -1), a = u[i];
					fe && !pe && !ye && !de.length && a && (a.display_kind || void 0) === (R.display_kind || void 0) && pm(a) === pm(R) && (n = u.slice(0, i), lm(L, cm(u.slice(i + 1)), !0)), D.value = [...n, ...D.value.slice(r)];
				}
				Se();
				return;
			}
			if (R && L && !de.length || de.some((e) => e.hasCorrections)) return Se(), !0;
			for (let e of de) {
				let { turn: t, receipt: n } = e, r = n?.user_row_id == null ? -1 : u.findIndex((e) => e.id === String(n.user_row_id)), i = r + 1;
				for (; i < u.length && u[i]?.role !== "user";) i++;
				r >= 0 && lm(t, cm(u.slice(r + 1, i)), !1);
				let a = new Set(u.map((e) => e.id)), o = u.find((e) => e.id === String(n?.final_assistant_row_id)), s = [...t.blocks].reverse().find((e) => e.kind === "text")?.content || "";
				if (!(n?.complete && r >= 0 && n.row_ids.every((e) => a.has(String(e))) && o && al(o.content).trim() === s.trim())) return Se(), !0;
				u[r] = {
					...u[r],
					display_id: e.user.display_id || e.user.id,
					blocks: t.blocks
				};
			}
			D.value = u;
			let d = await i.rpc("reconciled", { through: i.boundary });
			return n === N && d.settled && e(), !0;
		} catch {
			return n === N && r === ce && (k.value = "Response ended; saved history could not be reconciled. Refresh history before sending again."), !1;
		} finally {
			n === N && r === ce && (S = !1, ne.value = !1, C && (C = !1, ee()));
		}
	}
	async function ke(e, t) {
		(!ue || _e !== e || z !== t) && (Ie(), Ce(N + 1), _e = e, z = t, ue = !0, se = !0, ie.value = _m(_e, z)), await Me();
	}
	function Ae() {
		f(), w?.abort(), w = void 0, x++, S = !1, C = !1, v.value = !1, Ce(N + 1), ce++, oe?.close(), oe = void 0, le = void 0, P = !1, ne.value = !1, j.value = "stale";
	}
	function je(e, t) {
		let n = F !== e || I !== t;
		return F = e, I = t, !F || !I ? (!F && I && oe?.retainWhileHidden && j.value === "ready" || ue && j.value !== "stale" && Ae(), Promise.resolve()) : n ? Me() : le || Promise.resolve();
	}
	function Me() {
		if (!ue || !F || !I || j.value === "ready") return Promise.resolve();
		if (le) return le;
		let e = ++N;
		M.value = e, ce++, P = !0, ne.value = D.value.length === 0, j.value = "reconnecting";
		let t = [], n = (n) => {
			e === N && (t ? t.push(n) : n());
		}, i = new Uc(_e, z, {
			snapshot: (r) => {
				t = [], n(() => {
					k.value = ie.value ? "Submission outcome unknown. Inspect history and native state before sending again." : "", A.value = "", re.value = [], De(r, e);
				});
			},
			input: (e, t, r, i) => n(() => Ee(e, t, r, i)),
			event: (e) => n(() => {
				let t = e.payload || {};
				e.type === "session.usage" && p(e.payload.usage);
				let n = typeof t.text == "string" ? t.text : "";
				(e.type === "session.title" || e.type === "session.info") && typeof t.title == "string" && Te(t.title), e.type === "message.start" ? (we(), O.value = !0, A.value = R && Xp(R) === "status" ? Zp(R) : "Working…", xe = void 0) : e.type === "thinking.delta" || e.type === "tool.generating" ? A.value = e.type === "tool.generating" ? "Preparing " + (typeof t.name == "string" && t.name ? t.name : "tool") : n || "Working…" : e.type === "status.update" ? A.value = n : e.type === "notice" ? A.value = typeof t.message == "string" ? t.message : "" : e.type === "error" ? k.value = typeof t.message == "string" ? t.message : "Session failed" : e.type === "session.reclaimed" && (f(), h(), c && m(), O.value = !1, A.value = "Session reclaimed"), !L && R && (L = /* @__PURE__ */ Nt(im()));
				let i = L;
				if (e.type.startsWith("subagent.") || e.type.startsWith("tool.")) {
					let n = e.type.startsWith("subagent.") ? "subagent-" + tm(t) : t.tool_id;
					i = [...de].reverse().find((e) => e.turn.blocks.some((e) => e.id === n))?.turn || L;
				}
				if (i && dm(i, e.type, {
					...t,
					persisted: P
				}), e.type === "message.complete") {
					P || r?.(_e, z), d(), p(e.payload.usage, !1), P || (h(), c && m()), ve = !1;
					for (let e of de) dm(e.turn, "message.complete", { status: t.status });
					xe = t.persisted_turn, R && L && !de.some((e) => e.user === R && e.turn === L) && de.push({
						user: R,
						turn: L,
						receipt: xe,
						hasCorrections: ye
					}), O.value = !1, A.value = Qp(t.status), typeof t.status == "string" && t.status && t.status !== "complete" && (k.value = typeof t.error == "string" && t.error ? t.error : "Response " + t.status), P || Oe();
				} else e.type === "subagent.complete" && !O.value && !P && Oe();
				Se();
			}),
			requests: (e) => n(() => {
				re.value = e;
			}),
			connection: (t, r) => {
				if (e === N) {
					if (t === "closed") {
						let e = j.value === "ready";
						Ae(), k.value = r || "Session connection lost. Reconnect to restore this session.", A.value = "Disconnected · backend state will be checked on reconnect";
						let t = N;
						e && queueMicrotask(() => {
							N === t && ue && j.value === "stale" && Me();
						});
					} else r && n(() => {
						k.value = r;
					});
				}
			},
			recovered: () => {
				if (e !== N) return;
				let n = t || [];
				t = void 0;
				for (let e of n) e();
				P = !1, ne.value = !1, j.value = "ready", r?.(_e, z), h(), c && m(), Oe();
			}
		});
		oe = i;
		let a = (async () => {
			try {
				if (await i.ensure(), e === N && j.value !== "ready") throw new Z("Native session reconstruction did not become ready");
			} catch {
				e === N && (Ae(), k.value = "Could not reconnect this session. Retry when the dashboard is available.");
			} finally {
				e === N && (le = void 0);
			}
		})();
		return le = a, a;
	}
	async function Ne(e, t, n, r) {
		if (!F || !I || !oe || O.value || ie.value || ne.value || j.value !== "ready") throw new Z("Native session is not ready. Message not submitted.", "rejected");
		let i = N, a = oe, o = vm(_e, z);
		ie.value = !0, k.value = "", ve = !1, Ee(e), R.content = r ?? t, ve = !0, me = o, he = e, ge.add(o);
		let s = R.id, c = !1;
		try {
			let e = typeof t == "function" ? await t() : t;
			if (i !== N || !F || !I) throw new Z("Viewer detached before submission", "rejected");
			c = !0, await a.rpc("prompt.submit", {
				input: e,
				admission_id: o,
				...n
			}), ym(Pe(a), a.stored, o), i === N && (ie.value = !1), ue && _e === a.profile && z === a.stored && me === o && we();
		} catch (e) {
			throw !c || e instanceof Z && e.outcome === "rejected" ? (ym(Pe(a), a.stored, o), ue && _e === a.profile && z === a.stored && me === o && (D.value = D.value.filter((e) => e.id !== s), ie.value = _m(_e, z), ve = !1, R?.id === s && (O.value = !1, L = void 0, R = void 0))) : i === N && (k.value = "Submission outcome unknown. Inspect history and native state before sending again."), e;
		} finally {
			ge.delete(o);
		}
	}
	let Pe = (e) => e.profile;
	async function Fe() {
		if (!ue || (j.value !== "ready" && await Me(), j.value !== "ready") || ge.has(me)) return;
		let e = N, t = oe, n = t.boundary;
		try {
			let r = await t.rpc("state");
			if (e !== N || t.boundary !== n || ge.has(me)) return;
			if (r.running !== !1 || r.queued || r.delegating) {
				k.value = "Hermes is still working; sending remains locked.";
				return;
			}
			O.value = !1, await Oe() && e === N && t.boundary === n && !O.value && (ym(_e, z), ie.value = _m(_e, z), ie.value || (k.value = ""));
		} catch {
			e === N && (k.value = "Could not verify native session state; sending remains locked.");
		}
	}
	function Ie() {
		Ae(), ue = !1, c = !1, i.value = void 0, se = !1, me = "", D.value = [], b = void 0, fe = !1, _.value = !1, y.value = "", te.value = {}, O.value = !1, ne.value = !1, re.value = [], ie.value = !1, k.value = "", A.value = "", L = void 0, R = void 0, de = [];
	}
	function Le() {
		if (!oe || j.value !== "ready") throw new Z("Session is read-only until reconnected", "rejected");
		return oe;
	}
	return {
		hasEarlier: _,
		loadingEarlier: v,
		earlierError: y,
		loadEarlier: ee,
		contextUsage: a,
		contextBreakdown: o,
		contextLoading: s,
		setContextOpen: g,
		refreshContext: h,
		generationRef: M,
		settings: i,
		messages: D,
		responseTargets: te,
		busy: O,
		loading: ne,
		error: k,
		status: A,
		connection: j,
		approval: ae,
		requests: re,
		uncertain: ie,
		attach: ke,
		submit: Ne,
		close: Ie,
		hydrate: Oe,
		resolveUncertainty: Fe,
		reconnect: Me,
		availability: je,
		stop: () => Le().rpc("session.interrupt"),
		steer: (e) => Le().rpc("session.steer", { text: e }),
		answer: (e, t) => Le().answer(e, t)
	};
}
//#endregion
//#region src/features/notifications/services/push.ts
var xm = "/api/plugins/chathermes", Sm;
function Cm() {
	return typeof window < "u" && window.isSecureContext && typeof navigator < "u" && "serviceWorker" in navigator && "PushManager" in window && typeof Notification < "u";
}
async function wm() {
	if (!Cm()) throw Error("Notifications require a secure browser with Push API support.");
	return Sm ||= navigator.serviceWorker.register("/api/plugins/chathermes/push-service-worker.js", {
		scope: "/chathermes",
		updateViaCache: "none"
	}).catch((e) => {
		throw Sm = void 0, e;
	}), Sm;
}
function Tm(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/"), n = atob(t + "=".repeat((4 - t.length % 4) % 4));
	return Uint8Array.from(n, (e) => e.charCodeAt(0));
}
async function Em() {
	let e = await fetch(xm + "/push/config", { credentials: "same-origin" });
	if (!e.ok) throw Error("Push configuration unavailable");
	return e.json();
}
async function Dm() {
	return (await wm()).pushManager.getSubscription();
}
async function Om(e, t) {
	let n = await fetch(xm + "/push/status" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ endpoint: t.endpoint })
	});
	if (!n.ok) throw Error("Could not load notification status for this profile.");
	return n.json();
}
async function km(e = "") {
	if (!Cm()) return {
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: "Notifications require HTTPS and a supported browser."
	};
	try {
		let [t, n] = await Promise.all([Dm(), Em()]), r = t ? await Om(e, t) : null;
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
async function Am(e) {
	if (!Cm()) throw Error("Notifications require HTTPS and a supported browser.");
	let t = await Notification.requestPermission();
	if (t !== "granted") throw Error(t === "denied" ? "Notification permission is blocked in browser settings." : "Notification permission was not granted.");
	let n = await wm(), r = await Em();
	if (!r.available || !r.vapid_public_key) throw Error("Push notifications are unavailable on this server.");
	let i = await n.pushManager.subscribe({
		userVisibleOnly: !0,
		applicationServerKey: Tm(r.vapid_public_key)
	});
	if (!(await fetch(xm + "/push/subscriptions" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			endpoint: i.endpoint,
			keys: i.toJSON().keys
		})
	})).ok) throw Error("Could not save this notification subscription.");
}
async function jm(e) {
	let t = await Dm();
	if (!t) return;
	let n = await Om(e, t);
	if (n.enabled && n.id && !(await fetch(xm + "/push/subscriptions/" + encodeURIComponent(n.id) + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "DELETE",
		credentials: "same-origin"
	})).ok) throw Error("Could not disable notifications for this profile.");
}
async function Mm(e) {
	if (!(await fetch(xm + "/push/test" + (e ? "?profile=" + encodeURIComponent(e) : ""), {
		method: "POST",
		credentials: "same-origin"
	})).ok) throw Error("Could not send a test notification.");
}
//#endregion
//#region src/features/notifications/services/push-client.ts
function Nm(e, t, n = document.visibilityState) {
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
function Pm(e, t, n) {
	let r = !0, i = null, a = () => Nm(t(), n()), o = () => {
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
var Fm = Symbol("live chat");
function Im(e) {
	Mn(Fm, e);
}
function Lm() {
	let e = Nn(Fm);
	if (!e) throw Error("Live chat context is missing");
	return e;
}
var Rm = Symbol("conversation focus");
//#endregion
//#region src/features/chat/utils/context-usage.ts
function zm(e) {
	return typeof e == "number" && Number.isFinite(e) && e >= 0 ? e : null;
}
function Bm(e) {
	let t = zm(e?.context_percent);
	return t !== null && t <= 100 ? t : null;
}
//#endregion
//#region src/features/chat/components/ContextUsagePopover.vue?vue&type=script&setup=true&lang.ts
var Vm = {
	role: "dialog",
	"aria-label": "Context usage",
	class: "context-panel rounded-2xl border border-[#424242] bg-[#212121] p-3 text-sm text-white shadow-xl"
}, Hm = { class: "flex items-center justify-between gap-3" }, Um = { class: "mt-1 break-all" }, Wm = { class: "text-[#b4b4b4]" }, Gm = {
	key: 0,
	class: "mt-2 text-[#b4b4b4]"
}, Km = {
	key: 1,
	class: "text-amber-200"
}, qm = {
	key: 2,
	class: "text-[#b4b4b4]"
}, Jm = {
	key: 3,
	class: "mt-2 text-[#b4b4b4]",
	role: "status"
}, Ym = {
	class: "context-breakdown-bar mt-2 flex h-2 overflow-hidden rounded-full bg-[#424242]",
	"aria-hidden": "true"
}, Xm = { class: "mt-2 space-y-1" }, Zm = { class: "flex min-w-0 items-center gap-2" }, Qm = { class: "shrink-0" }, $m = {
	key: 5,
	class: "mt-2 text-[#b4b4b4]"
}, eh = /* @__PURE__ */ H({
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
		}, r = X(() => (t.breakdown?.categories || []).filter((e) => e && typeof e.label == "string" && zm(e.tokens) !== null).map((e) => ({
			...e,
			color: n[e.id] || "#a3a3a3"
		}))), i = X(() => r.value.reduce((e, t) => e + t.tokens, 0)), a = X(() => Bm(t.usage) === null ? t.breakdown : t.usage), o = X(() => Bm(a.value)), s = (e) => zm(e)?.toLocaleString() ?? "—", c = X(() => a.value?.context_estimated || ["local_estimate", "provider_usage_plus_estimate"].includes(a.value?.context_source || ""));
		return (t, n) => (W(), G("section", Vm, [
			q("div", Hm, [n[1] ||= q("strong", null, "Context usage", -1), q("button", {
				type: "button",
				"aria-label": "Close context usage",
				class: "px-2 text-base",
				onClick: n[0] ||= (e) => t.$emit("close")
			}, " × ")]),
			q("p", Um, z(e.usage?.model || e.breakdown?.model || e.model || "Current model"), 1),
			q("p", Wm, z(s(a.value?.context_used)) + " / " + z(s(a.value?.context_max)) + " tokens · " + z(o.value === null ? "Unknown" : `${Math.round(o.value)}%`), 1),
			o.value === null ? (W(), G("p", Gm, "Context usage unavailable")) : Y("v-if", !0),
			c.value ? (W(), G("p", Km, "Estimated usage")) : Y("v-if", !0),
			V(zm)(e.usage?.compressions) === null ? Y("v-if", !0) : (W(), G("p", qm, z(e.usage?.compressions) + " compressions ", 1)),
			e.loading ? (W(), G("p", Jm, "Loading context breakdown…")) : r.value.length ? (W(), G(U, { key: 4 }, [
				n[2] ||= q("p", { class: "mt-3 text-[#b4b4b4]" }, "Estimated breakdown", -1),
				q("div", Ym, [(W(!0), G(U, null, _r(r.value, (e, t) => (W(), G("span", {
					key: `${e.id}-${t}`,
					style: P({
						width: i.value > 0 ? `${e.tokens / i.value * 100}%` : "0%",
						backgroundColor: e.color
					})
				}, null, 4))), 128))]),
				q("dl", Xm, [(W(!0), G(U, null, _r(r.value, (e, t) => (W(), G("div", {
					key: `${e.id}-${t}`,
					class: "flex items-center justify-between gap-3"
				}, [q("dt", Zm, [q("span", {
					class: "size-2 shrink-0 rounded-full",
					style: P({ backgroundColor: e.color }),
					"aria-hidden": "true"
				}, null, 4), J(z(e.label), 1)]), q("dd", Qm, z(s(e.tokens)) + " tokens", 1)]))), 128))])
			], 64)) : (W(), G("p", $m, " Context breakdown unavailable until the agent has initialized. "))
		]));
	}
}), th = [
	"aria-label",
	"aria-expanded",
	"aria-controls"
], nh = {
	viewBox: "0 0 30 30",
	class: "absolute inset-0 size-full -rotate-90",
	"aria-hidden": "true"
}, rh = ["stroke-dasharray"], ih = /* @__PURE__ */ H({
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
		let n = e, r = t, i = /* @__PURE__ */ B(), a = /* @__PURE__ */ B(), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(360), l = Kn(), u, d, f = X(() => Bm(n.usage)), p = X(() => f.value === null ? "text-[#a3a3a3]" : f.value >= 90 ? "text-red-200" : f.value >= 75 ? "text-amber-200" : "text-emerald-200");
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
			h(), n.active && !o.value && (m(), o.value = !0, _n(m));
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
		}), (t, n) => An((W(), G("div", {
			ref_key: "root",
			ref: i,
			class: "context-control shrink-0",
			onPointerenter: h,
			onPointerleave: y
		}, [q("button", {
			ref_key: "button",
			ref: a,
			type: "button",
			class: F(["context-meter relative grid size-[30px] place-items-center rounded-full p-0 text-[9px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2", p.value]),
			"aria-label": f.value === null ? "Context usage unavailable" : `Context ${Math.round(f.value)} percent used`,
			"aria-haspopup": "dialog",
			"aria-expanded": o.value,
			"aria-controls": V(l),
			onClick: b,
			onPointerenter: v
		}, [(W(), G("svg", nh, [n[0] ||= q("circle", {
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
		}, null, 8, rh))])), q("span", null, z(f.value === null ? "—" : `${Math.round(f.value)}%`), 1)], 42, th), o.value ? (W(), K(eh, {
			key: 0,
			id: V(l),
			class: "absolute bottom-full right-0 z-30 mb-2 w-full max-w-[340px] overflow-y-auto overscroll-contain",
			style: P({ maxHeight: `${c.value}px` }),
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
}), ah = [
	"none",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultra"
], oh = {
	key: 0,
	class: "flex flex-wrap gap-2 px-2 pb-2"
}, sh = ["src", "alt"], ch = { class: "truncate" }, lh = [
	"disabled",
	"onClick",
	"aria-label"
], uh = ["aria-label", "onClick"], dh = {
	key: 1,
	class: "px-2 pb-2 text-sm text-[#d4d4d4]",
	role: "status"
}, fh = {
	key: 2,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, ph = {
	key: 3,
	class: "px-2 text-sm text-red-300",
	role: "alert"
}, mh = { class: "composer-body" }, hh = ["placeholder"], gh = { class: "composer-controls flex items-center gap-3" }, _h = ["aria-expanded", "disabled"], vh = { class: "composer-hint min-w-0 flex-1 px-1 text-[11px] text-[#a3a3a3]" }, yh = [
	"aria-expanded",
	"aria-controls",
	"disabled"
], bh = { class: "truncate" }, xh = [
	"type",
	"disabled",
	"aria-label",
	"title"
], Sh = {
	key: 0,
	viewBox: "0 0 24 24",
	class: "size-5",
	fill: "currentColor",
	"aria-hidden": "true"
}, Ch = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "size-5",
	"aria-hidden": "true"
}, wh = ["id", "aria-label"], Th = { class: "flex shrink-0 items-center gap-2 border-b border-[#424242] p-2" }, Eh = { class: "min-w-0 flex-1 truncate" }, Dh = {
	key: 0,
	class: "flex shrink-0 items-center justify-between gap-3 border-b border-[#424242] px-3 py-2"
}, Oh = ["value", "disabled"], kh = ["value"], Ah = { class: "min-h-0 overflow-y-auto overscroll-contain" }, jh = ["data-provider", "onClick"], Mh = { class: "min-w-0 flex-1 truncate" }, Nh = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, Ph = ["data-model", "onClick"], Fh = { class: "min-w-0 flex-1 break-all" }, Ih = {
	key: 0,
	"aria-label": "Selected"
}, Lh = {
	key: 0,
	class: "px-3 py-3 text-[#a3a3a3]"
}, Rh = {
	key: 5,
	class: "absolute bottom-full left-0 mb-2 grid min-w-48 gap-1 rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base shadow-xl"
}, zh = /* @__PURE__ */ H({
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
		let r = e, i = n, a = /* @__PURE__ */ B(""), o = /* @__PURE__ */ B(null), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B([]), l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B(!1), d = /* @__PURE__ */ B(), f = /* @__PURE__ */ B(), p = /* @__PURE__ */ B(), m = /* @__PURE__ */ B(), h = /* @__PURE__ */ B(!1), g = /* @__PURE__ */ B(!1), _;
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
			_n(v);
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
		let C = X(() => (r.models || []).filter((e) => e.parent !== null)), w = /* @__PURE__ */ B(!1), T = /* @__PURE__ */ B(null), E = /* @__PURE__ */ B(""), ee = /* @__PURE__ */ B(), te = /* @__PURE__ */ B(), D = Kn(), O = X(() => r.imagesSupported === !1 && c.value.some((e) => e.type.startsWith("image/"))), ne = X(() => r.sending || r.modelsLoading), k = /* @__PURE__ */ B(!1);
		function A() {
			k.value = window.innerWidth <= 700 || !!window.matchMedia?.("(hover: none) and (max-height: 500px)").matches;
		}
		A(), sr(() => window.addEventListener("resize", A)), ur(() => window.removeEventListener("resize", A));
		let j = X(() => h.value && k.value), M = X(() => r.providers?.find((e) => e.slug === T.value)), re = X(() => M.value?.name || "Model routes"), ie = X(() => {
			let e = w.value && T.value !== null ? T.value : r.provider || "", t = e ? r.providers?.find((t) => t.slug === e) : void 0, n = w.value ? E.value || r.model || r.defaultModel || "" : r.model || r.defaultModel || "";
			return t?.capabilities?.[n]?.reasoning !== !1;
		}), ae = X(() => {
			let e = M.value, t = e ? e.models : C.value.map((e) => e.id);
			return [.../* @__PURE__ */ new Set([...(e?.is_current || !r.providers?.length) && r.defaultModel ? [r.defaultModel] : [], ...t])];
		});
		async function oe() {
			await _n();
		}
		function N() {
			w.value && (w.value = !1, ee.value?.focus());
		}
		function P() {
			if (w.value) {
				N();
				return;
			}
			ne.value || (s.value = !1, T.value = null, E.value = r.model || r.defaultModel || "", w.value = !0, oe());
		}
		function se(e) {
			T.value = e;
			let t = r.providers?.find((t) => t.slug === e);
			E.value = e === (r.provider || "") ? r.model || r.defaultModel || "" : t?.models[0] || "", oe();
		}
		function ce() {
			T.value = null, E.value = r.model || r.defaultModel || "", oe();
		}
		function le(e) {
			ne.value || (E.value = e, i("update:provider", T.value || ""), i("update:model", M.value?.is_current && e === r.defaultModel ? "" : e), N());
		}
		function ue(e) {
			let t = e.composedPath();
			te.value && !t.includes(te.value) && ee.value && !t.includes(ee.value) && N();
		}
		function F(e) {
			if (w.value && (e.key === "Escape" && (e.preventDefault(), N()), e.key === "Tab")) {
				let t = Array.from(te.value?.querySelectorAll("button, select") || []), n = e.shiftKey ? t.at(-1) : t[0];
				document.activeElement === (e.shiftKey ? t[0] : t.at(-1)) && (e.preventDefault(), n?.focus());
			}
		}
		In(ne, (e) => {
			e && N();
		}), In(() => r.providers, () => N()), sr(() => {
			document.addEventListener("click", ue), document.addEventListener("keydown", F);
		}), ur(() => {
			document.removeEventListener("click", ue), document.removeEventListener("keydown", F);
		});
		let I = X(() => r.sending ? !r.stoppable || !!a.value.trim() && (u.value || c.value.some((e) => !!e.uploadError) || O.value) : r.disabled || u.value || c.value.some((e) => !!e.uploadError) || O.value || !a.value.trim() && !c.value.length);
		function L(e) {
			e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || g.value || e.isComposing || e.keyCode === 229 || e.defaultPrevented || window.innerWidth <= 700 || (e.preventDefault(), R());
		}
		function R() {
			if (I.value) return;
			if (r.sending && a.value.trim()) {
				i("steer", a.value.trim()), a.value = "";
				return;
			}
			if (r.disabled || r.sending || u.value || c.value.some((e) => !!e.uploadError) || O.value) return;
			let e = a.value.trim();
			(e || c.value.length) && (i("send", o.value ? `/${o.value}\n${e}` : e, [...c.value]), a.value = "", c.value = [], s.value = !1, o.value = null);
		}
		async function de(e) {
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
		let fe = 0;
		ur(() => {
			fe++;
		});
		async function pe(e) {
			let t = fe;
			try {
				let n = await Q.upload(r.profile || "", e);
				if (t !== fe) return;
				e.path = n.path, e.uploadError = void 0;
			} catch {
				t === fe && (e.uploadError = "Upload failed. Retry or remove this file.");
			}
		}
		async function me(e) {
			if (!u.value) {
				u.value = !0;
				try {
					await pe(e);
				} finally {
					u.value = !1;
				}
			}
		}
		async function he(e) {
			if (u.value) return;
			let t = fe;
			u.value = !0, l.value = "", s.value = !1;
			try {
				for (let n of e) try {
					if (n.size > 20971520) throw Error("Each file must be 20 MB or smaller.");
					if (c.value.length >= 5) throw Error("Attach up to five files per message.");
					let e = await new Promise((e, t) => {
						let r = new FileReader();
						r.onload = () => e(String(r.result)), r.onerror = () => t(/* @__PURE__ */ Error("Could not read file.")), r.onabort = () => t(/* @__PURE__ */ Error("File reading was cancelled. Try again.")), r.readAsDataURL(n);
					});
					if (n.type.startsWith("image/") && (e = await de(e)), t !== fe) return;
					let r = n.type.startsWith("image/") ? e.slice(5, e.indexOf(";")) : n.type || "application/octet-stream", i = {
						name: n.name,
						type: r,
						data: e,
						size: n.size
					};
					c.value.push(i), await pe(i);
				} catch (e) {
					if (t !== fe) return;
					l.value = e instanceof Error ? e.message : "Could not read file.";
				}
			} finally {
				t === fe && (u.value = !1);
			}
		}
		async function ge(e) {
			let t = e.target;
			await he(Array.from(t.files || [])), t.value = "";
		}
		return t({
			stageFiles: he,
			blurInput: () => p.value?.blur()
		}), (t, n) => (W(), G("form", {
			ref_key: "form",
			ref: m,
			onFocusout: S,
			class: "composer relative mx-auto mb-0 w-[calc(100%-24px)] max-w-[760px] shrink-0 rounded-[28px] border border-[#303030] bg-[#303030] p-3 focus-within:ring-1 focus-within:ring-[#525252] min-[701px]:w-[calc(100%-48px)]",
			onSubmit: Oo(R, ["prevent"])
		}, [
			c.value.length ? (W(), G("div", oh, [(W(!0), G(U, null, _r(c.value, (e, t) => (W(), G("div", {
				key: t,
				class: "flex max-w-full items-center gap-2 rounded-xl bg-[#424242] p-2 text-sm"
			}, [
				e.type.startsWith("image/") ? (W(), G("img", {
					key: 0,
					src: e.data,
					alt: e.name,
					class: "size-12 rounded-lg object-cover"
				}, null, 8, sh)) : Y("v-if", !0),
				q("span", ch, z(e.name), 1),
				e.uploadError ? (W(), G("button", {
					key: 1,
					type: "button",
					class: "text-red-200 underline",
					disabled: u.value,
					onClick: (t) => me(e),
					"aria-label": `Retry upload ${e.name}`
				}, " Retry upload", 8, lh)) : Y("v-if", !0),
				q("button", {
					type: "button",
					"aria-label": `Remove ${e.name}`,
					onMousedown: y,
					onClick: (e) => c.value.splice(t, 1)
				}, " × ", 40, uh)
			]))), 128))])) : Y("v-if", !0),
			o.value ? (W(), G("p", dh, [J(z(o.value === "goal" ? "Goal mode" : "Plan mode") + " · next message ", 1), q("button", {
				type: "button",
				class: "ml-2 underline",
				onClick: n[0] ||= (e) => o.value = null
			}, "Turn off")])) : Y("v-if", !0),
			O.value ? (W(), G("p", fh, " Image sending is unavailable for this native capability. Remove the image to send text or files. ")) : Y("v-if", !0),
			l.value ? (W(), G("p", ph, z(l.value), 1)) : Y("v-if", !0),
			q("div", mh, [
				n[17] ||= q("label", {
					class: "sr-only",
					for: "prompt"
				}, "Message Hermes", -1),
				An(q("textarea", {
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
					onKeydown: L,
					onCompositionstart: n[2] ||= (e) => g.value = !0,
					onCompositionend: n[3] ||= (e) => g.value = !1
				}, null, 40, hh), [[vo, a.value]]),
				q("input", {
					ref_key: "files",
					ref: d,
					type: "file",
					multiple: "",
					hidden: "",
					"aria-label": "Upload files",
					onChange: ge
				}, null, 544),
				q("input", {
					ref_key: "camera",
					ref: f,
					type: "file",
					accept: "image/*",
					capture: "environment",
					hidden: "",
					"aria-label": "Take a photo",
					onChange: ge
				}, null, 544),
				q("div", gh, [
					An(q("button", {
						class: "attach-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#424242] p-0 text-white disabled:opacity-55",
						type: "button",
						"aria-label": "Attachment options",
						"aria-expanded": s.value,
						disabled: e.sending || u.value,
						onClick: n[4] ||= (e) => {
							N(), s.value = !s.value;
						}
					}, [...n[13] ||= [q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round",
						class: "size-5",
						"aria-hidden": "true"
					}, [q("path", { d: "M12 5v14M5 12h14" })], -1)]], 8, _h), [[Ia, !j.value]]),
					q("p", vh, z(u.value ? "Preparing attachments…" : e.reason || ""), 1),
					e.sessionId ? (W(), K(ih, {
						key: e.sessionId,
						visible: !j.value && !w.value && !s.value,
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
					An(q("button", {
						ref_key: "pill",
						ref: ee,
						type: "button",
						class: "model-pill flex h-[30px] min-w-0 max-w-[55%] items-center gap-2 rounded-full bg-[#424242] px-3 py-0 text-[16px] text-white disabled:opacity-55",
						"aria-label": "Choose model",
						"aria-haspopup": "dialog",
						"aria-expanded": w.value,
						"aria-controls": V(D),
						disabled: ne.value,
						onClick: P
					}, [q("span", bh, z(e.modelsLoading ? "Loading models…" : e.model || e.defaultModel || "Default"), 1), n[14] ||= q("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2",
						class: "size-4 shrink-0",
						"aria-hidden": "true"
					}, [q("path", { d: "m6 9 6 6 6-6" })], -1)], 8, yh), [[Ia, !j.value]]),
					q("button", {
						class: "send-button grid size-[30px] shrink-0 place-items-center rounded-full bg-[#2563eb] p-0 text-white transition-colors hover:bg-[#3b82f6] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] disabled:cursor-not-allowed disabled:opacity-55",
						type: e.sending && !a.value.trim() ? "button" : "submit",
						disabled: I.value,
						"aria-label": e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						title: e.sending ? a.value.trim() ? "Guide this run" : "Stop response" : "Send message",
						onMousedown: y,
						onClick: n[6] ||= (t) => e.sending ? a.value.trim() ? R() : e.stoppable && i("stop") : R()
					}, [e.sending && !a.value.trim() ? (W(), G("svg", Sh, [...n[15] ||= [q("rect", {
						x: "6",
						y: "6",
						width: "12",
						height: "12",
						rx: "2"
					}, null, -1)]])) : (W(), G("svg", Ch, [...n[16] ||= [q("path", { d: "M12 19V5m-6 6 6-6 6 6" }, null, -1)]]))], 40, xh)
				])
			]),
			w.value ? (W(), G("div", {
				key: 4,
				id: V(D),
				ref_key: "panel",
				ref: te,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": T.value === null ? "Choose provider" : re.value,
				class: "model-panel absolute bottom-full right-0 z-20 mb-2 flex max-h-[min(60vh,420px)] w-full max-w-sm flex-col rounded-2xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl"
			}, [
				q("div", Th, [
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
					q("h2", Eh, z(T.value === null ? "Choose provider" : re.value), 1),
					q("button", {
						type: "button",
						"aria-label": "Close model picker",
						class: "rounded-full px-3 py-2 hover:bg-[#424242]",
						onClick: N
					}, " × ")
				]),
				ie.value ? (W(), G("label", Dh, [n[20] ||= q("span", null, "Reasoning effort", -1), q("select", {
					"aria-label": "Reasoning effort",
					class: "min-w-0 rounded-lg bg-[#303030] px-2 py-1 text-base text-white",
					value: e.reasoningEffort || "",
					disabled: ne.value,
					onChange: n[7] ||= (e) => i("update:reasoningEffort", e.target.value)
				}, [n[19] ||= q("option", { value: "" }, "Model default", -1), (W(!0), G(U, null, _r(V(ah), (e) => (W(), G("option", {
					key: e,
					value: e
				}, z(e === "xhigh" ? "XHigh" : e[0].toUpperCase() + e.slice(1)), 9, kh))), 128))], 40, Oh)])) : Y("v-if", !0),
				q("div", Ah, [T.value === null ? (W(), G(U, { key: 0 }, [(W(!0), G(U, null, _r(e.providers, (e) => (W(), G("button", {
					key: e.slug,
					type: "button",
					class: "provider-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": e.slug,
					onClick: (t) => se(e.slug)
				}, [q("span", Mh, z(e.name), 1), e.is_current ? (W(), G("span", Nh, "Current")) : Y("v-if", !0)], 8, jh))), 128)), q("button", {
					type: "button",
					class: "provider-option w-full rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-provider": "",
					onClick: n[8] ||= (e) => se("")
				}, " Model routes ")], 64)) : (W(), G(U, { key: 1 }, [(W(!0), G(U, null, _r(ae.value, (t) => (W(), G("button", {
					key: t,
					type: "button",
					class: "model-option flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left hover:bg-[#424242]",
					"data-model": t,
					onClick: (e) => le(t)
				}, [q("span", Fh, z(t), 1), (e.provider || "") === T.value && t === (e.model || e.defaultModel) ? (W(), G("span", Ih, "✓")) : Y("v-if", !0)], 8, Ph))), 128)), ae.value.length ? Y("v-if", !0) : (W(), G("p", Lh, "No models available"))], 64))])
			], 8, wh)) : Y("v-if", !0),
			s.value ? (W(), G("div", Rh, [
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
}), Bh = { class: "chat-interface relative flex min-h-0 flex-1 flex-col overflow-hidden" }, Vh = {
	key: 0,
	class: "pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-3xl border-2 border-dashed border-[#a3a3a3] bg-[#212121]/95 text-lg",
	role: "status"
}, Hh = { class: "chat-content flex min-h-0 flex-1 flex-col overflow-hidden" }, Uh = {
	key: 0,
	class: "notice bg-[#303030] px-5 py-3 text-sm text-white dark:bg-[#303030] dark:text-white",
	role: "status"
}, Wh = {
	key: 1,
	class: "notice px-5 py-3 text-sm text-[#b4b4b4]",
	role: "status"
}, Gh = {
	key: 2,
	class: "notice error bg-[#402b2b] px-5 py-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, Kh = { class: "composer-dock shrink-0" }, qh = /* @__PURE__ */ H({
	__name: "ChatInterface",
	props: {
		showChat: { type: Boolean },
		hideComposer: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(), r = /* @__PURE__ */ B();
		Mn(Rm, r);
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
		let c = /* @__PURE__ */ B(0);
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
		let { view: m, scope: h, composer: g, actions: _ } = Lm(), { profile: v, session: y, offline: b, canStream: x, reasoningEffort: S, models: C, providers: w, modelsLoading: T, model: E, provider: ee, defaultModel: te, suggestedPrompt: D } = h, { busy: O, active: ne, reconnect: k, error: A, unavailable: j, connection: M } = m;
		return (t, r) => (W(), G("div", Bh, [
			c.value && e.showChat ? (W(), G("div", Vh, " Drop files to attach ")) : Y("v-if", !0),
			q("div", Hh, [
				V(b) ? (W(), G("div", Uh, " You are offline. Messages cannot be loaded or sent. ")) : Y("v-if", !0),
				e.showChat && V(k) ? (W(), G("div", Wh, [J(z(V(M) === "reconnecting" ? "Reconnecting…" : "Session is read-only until reconnected.") + " ", 1), V(x) && V(M) === "stale" && !V(b) ? (W(), G("button", {
					key: 0,
					class: "ml-3 underline",
					onClick: r[0] ||= (...e) => V(_).retry && V(_).retry(...e)
				}, " Reconnect ")) : Y("v-if", !0)])) : Y("v-if", !0),
				e.showChat && V(A) ? (W(), G("div", Gh, [
					J(z(V(A)) + " ", 1),
					V(y) ? (W(), G("button", {
						key: 0,
						class: "underline",
						onClick: r[1] ||= (...e) => V(_).retry && V(_).retry(...e)
					}, z(V(k) ? "Retry connection" : "Refresh history"), 1)) : Y("v-if", !0),
					V(j) ? (W(), G("button", {
						key: 1,
						class: "ml-3 underline",
						onClick: r[2] ||= (...e) => V(_).resolve && V(_).resolve(...e)
					}, " Resolve uncertain submission ")) : Y("v-if", !0)
				])) : Y("v-if", !0),
				yr(t.$slots, "default")
			]),
			q("div", Kh, [An((W(), K(zh, {
				ref_key: "picker",
				ref: n,
				profile: V(v),
				"session-id": V(x) && V(y) || void 0,
				"context-usage": V(m).contextUsage.value,
				"context-breakdown": V(m).contextBreakdown.value,
				"context-loading": V(m).contextLoading.value,
				onContextOpen: V(_).setContextOpen,
				"project-name": V(g).projectName,
				key: JSON.stringify([V(v), V(y)]),
				disabled: V(g).disabled,
				models: V(C),
				providers: V(w),
				"models-loading": V(T),
				provider: V(ee),
				"onUpdate:provider": V(_).setProvider,
				"default-model": V(te),
				"reasoning-effort": V(S),
				"onUpdate:reasoningEffort": V(_).setReasoningEffort,
				model: V(E),
				"onUpdate:model": V(_).setModel,
				sending: V(O),
				stoppable: V(ne) && !V(k),
				"suggested-prompt": V(D),
				reason: V(g).reason,
				onStop: V(_).stop,
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
}), Jh = [
	"once",
	"session",
	"always",
	"deny"
];
function Yh(e) {
	if (!e) return;
	let { id: t, method: n, params: r } = e;
	return n === "approval" && (r.choices === void 0 || Array.isArray(r.choices) && r.choices.every((e) => Jh.includes(e))) ? {
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
function Xh(e, t) {
	return `Attached ${e.type.startsWith("image/") ? "image" : "file"} ${e.name.replace(/[\r\n]/g, " ")}: ${t}\nMEDIA:"${t}"`;
}
function Zh(e, t) {
	let { profile: n, session: r, messages: i, chatLoading: a, chatError: o, canStream: s, projectView: c, composerBlocked: l, selectedProject: u, creating: d, offline: f, models: p, providers: m, modelsLoading: h, model: g, provider: _, defaultModel: v, suggestedPrompt: y } = t, b = /* @__PURE__ */ B(/* @__PURE__ */ new Map()), x = /* @__PURE__ */ B(/* @__PURE__ */ new Map()), S = () => JSON.stringify([n.value || "default", r.value]), C = X(() => {
		let t = e.settings.value;
		return t?.profile === n.value && t.session === r.value && t.generation === e.generationRef.value ? t.info : void 0;
	}), w = X(() => {
		let e = C.value?.reasoning_effort;
		return b.value.get(S()) ?? (ah.includes(e) ? e : "");
	}), T = X(() => x.value.get(S())?.model ?? (r.value ? C.value?.model || "" : g.value)), E = X(() => x.value.get(S())?.provider ?? (r.value && C.value?.provider || _.value)), ee = /* @__PURE__ */ B(!1), te = X(() => ee.value || !s.value || M.value || k.value || A.value || re.value || f.value || !r.value);
	async function D(i) {
		if (te.value) return;
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
	let O = s, ne = X(() => O.value ? e.messages.value : i.value), k = X(() => e.busy.value || e.uncertain.value), A = X(() => O.value ? e.loading.value : a.value), j = X(() => O.value ? e.error.value : o.value), M = X(() => !!e.approval.value), re = X(() => O.value && !!r.value && e.connection.value !== "ready"), ie = X(() => e.uncertain.value), ae = X(() => e.busy.value);
	async function oe(i, a) {
		if (l.value || ee.value || k.value || d.value || M.value || f.value || !s.value || h.value) return;
		let o = S(), u = w.value, p = n.value, m = T.value, g = E.value;
		if (c.value || !r.value) {
			let e = await t.createSession();
			if (!e || n.value !== p || r.value !== e) return;
			x.value.set(S(), {
				model: m,
				provider: g
			}), o !== S() && x.value.delete(o), u && (b.value.set(S(), u), o !== S() && b.value.delete(o));
		}
		let _ = t.generation(), C = n.value, te = [{
			type: "text",
			text: i
		}, ...a.flatMap((e) => [{
			type: "text",
			text: e.path ? Xh(e, e.path) : "📎 " + e.name
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
						text: Xh(n, r.path)
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
			}, te);
		} catch (n) {
			_ === t.generation() && !e.uncertain.value && (e.error.value = n instanceof Error ? n.message : "Message not submitted", y.value = i);
		}
	}
	async function N(e, t = []) {
		O.value && await oe(e, t);
	}
	async function P() {
		let n = t.generation();
		if (O.value) {
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
		if (O.value) {
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
		return t && typeof t.request_id == "string" && typeof t.kind == "string" ? Yh({
			id: t.request_id,
			method: t.kind,
			params: t
		}) : void 0;
	});
	function le(e, n) {
		return n === t.generation() && ce.value?.id === e;
	}
	async function ue(t, n, r) {
		if (O.value && !re.value && le(t, r)) try {
			await e.answer(t, { ...n });
		} catch {
			le(t, r) && (e.error.value = ce.value?.kind === "clarify" ? "Clarification could not be settled." : ce.value?.kind === "secret" ? "Secret request could not be settled." : "Approval could not be settled.");
		}
	}
	let F = X(() => ({
		projectName: !l.value && !u.value?.isNoProject ? u.value?.label : void 0,
		disabled: !!(l.value || ee.value || c.value && u.value?.archived || c.value && (!u.value || !u.value.isNoProject && !ol(u.value)) || f.value || d.value || h.value || A.value || M.value || ie.value || re.value || !s.value),
		reason: l.value ? "Open a chat." : c.value && u.value?.archived ? "Restore this project to start a new chat." : c.value && u.value && !u.value.isNoProject && !ol(u.value) ? "This Project has no workspace." : f.value ? "Offline · sending is unavailable." : M.value ? "Approval is pending in Hermes." : s.value ? void 0 : "Streaming turns are unavailable for this profile."
	})), I = {
		loadEarlier: () => e.loadEarlier(),
		branch: D,
		send: N,
		stop: P,
		steer: se,
		answerFor: (e) => {
			let n = t.generation();
			return (t) => ue(e, t, n);
		},
		suggest: t.suggest,
		setContextOpen: (t) => e.setContextOpen(t),
		retry: () => re.value ? e.reconnect() : t.retryHistory(),
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
			messages: ne,
			branchDisabled: te,
			responseTargets: e.responseTargets,
			busy: k,
			loading: A,
			error: j,
			approvalPending: M,
			reconnect: re,
			unavailable: ie,
			active: ae,
			request: ce,
			connection: X(() => e.connection.value),
			status: X(() => O.value ? e.status.value : "")
		},
		composer: F,
		actions: I,
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
var Qh = "button, a, input, textarea, select, label, summary, audio, video, [role=\"button\"], [role=\"link\"], [role=\"slider\"], [role=\"checkbox\"], [role=\"switch\"], [role=\"combobox\"], [role=\"textbox\"], [role=\"menuitem\"], [tabindex]:not([data-chat-message]):not(.transcript), [contenteditable]:not([contenteditable=\"false\"]), .composer, pre, code";
function $h(e, t, n, r) {
	let i = /* @__PURE__ */ B(null), a, o = 0, s = 0, c = 0, l = 0, u = () => window.matchMedia("(max-width: 700px)").matches;
	function d() {
		a = void 0, i.value = null;
	}
	In(e, d, { flush: "sync" });
	function f(r) {
		if (d(), !u() || r.touches.length !== 1) return;
		let i = r.touches[0], l = r.target;
		if (!(i.clientX < 30 || !(l instanceof Element) || l.closest(Qh)) && (e.value || l.closest(".transcript"))) {
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
var eg = "chathermes.keep-screen-awake";
function tg() {
	try {
		return localStorage.getItem(eg) === "true";
	} catch {
		return !1;
	}
}
function ng() {
	let e = /* @__PURE__ */ B(tg()), t = /* @__PURE__ */ B(!1), n = !1, r = !0, i = null, a = null, o = 0, s = null;
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
			localStorage.setItem(eg, String(t));
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
		enabled: /* @__PURE__ */ Ft(e),
		available: /* @__PURE__ */ Ft(t),
		setEnabled: f
	};
}
//#endregion
//#region src/features/inbox/context.ts
var rg = Symbol("inbox");
function ig(e) {
	Mn(rg, e);
}
function ag() {
	let e = Nn(rg);
	if (!e) throw Error("inbox context is missing");
	return e;
}
//#endregion
//#region src/features/artifacts/context.ts
var og = Symbol("artifacts");
function sg(e) {
	Mn(og, e);
}
function cg() {
	let e = Nn(og);
	if (!e) throw Error("artifacts context is missing");
	return e;
}
//#endregion
//#region src/features/settings/context.ts
var lg = Symbol("settings");
function ug(e) {
	Mn(lg, e);
}
function dg() {
	let e = Nn(lg);
	if (!e) throw Error("settings context is missing");
	return e;
}
//#endregion
//#region src/features/projects/context.ts
var fg = Symbol("projects");
function pg(e) {
	let t = kc(), n = /* @__PURE__ */ B();
	In(() => t.fullPath, () => {
		n.value = void 0;
	}), Mn(fg, {
		...e,
		projectConfirmation: n
	});
}
function mg() {
	let e = Nn(fg);
	if (!e) throw Error("projects context is missing");
	return e;
}
//#endregion
//#region src/features/scheduled/composables/useScheduledHistory.ts
var hg = Symbol("scheduled");
function gg(e) {
	let t = {
		...e,
		current: /* @__PURE__ */ Kt()
	};
	return Mn(hg, t), t;
}
function _g() {
	let e = Nn(hg);
	if (!e) throw Error("Scheduled context is missing");
	return e;
}
function vg(e) {
	return e.state === "completed" || e.state === "error" ? "completed" : e.state === "paused" || e.enabled === !1 ? "paused" : "active";
}
function yg(e) {
	return e > 0 ? (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString() : "Run date unavailable";
}
function bg(e) {
	if (!e) return "Never run";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? "Last run date unavailable" : "Last run: " + t.toLocaleString();
}
function xg(e) {
	let t = _g(), n = kc(), r = /* @__PURE__ */ B(!1), i = /* @__PURE__ */ B(""), a = /* @__PURE__ */ B(), o, s = Promise.resolve(), c = "", l = !1, u = () => JSON.stringify([
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
				l.signal.aborted || (i.value = e instanceof Kc && e.status === 503 ? "Scheduled history is unavailable in this Hermes version." : "Could not load scheduled history. The job or output may no longer be available.");
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
	], d, { immediate: !0 }), Ce(() => {
		l = !0, o?.abort(), t.current.value === f && (t.current.value = void 0);
	}), f;
}
async function Sg(e, t, n) {
	let r = (await Q.scheduled(e, n)).jobs.find((e) => e.id === t);
	if (!r) throw Error("Job unavailable");
	return r;
}
function Cg(e) {
	let t = al(e?.messages.slice().reverse().find((e) => e.role === "assistant" && al(e.content))?.content) || e?.output;
	return t ? [{
		role: "assistant",
		content: t
	}] : [];
}
//#endregion
//#region src/composables/useApplication.ts
function wg() {
	let e = Oc(), t = kc(), n = X(() => t.meta.chat === !0), r = X(() => t.meta.composer === "project"), i = X(() => !n.value && !r.value), a = X(() => t.name === "settings"), o = X(() => t.meta.section === "scheduled"), s = !1, c = !1, l = Promise.resolve(), u = Promise.resolve(), d = "", f;
	async function p(t, n = !1, r = !1) {
		f?.abort(), d = r ? e.resolve(t).fullPath : "", r || (ee.value = !1), bt(!1), await e[n ? "replace" : "push"](t), await u, d = "";
	}
	function m(e, t = {}) {
		return pl(e, h.value, g.value, Ce.value, t);
	}
	let h = /* @__PURE__ */ B(""), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B([]), v = /* @__PURE__ */ B([]), y = /* @__PURE__ */ B({}), b = /* @__PURE__ */ B(0), x = /* @__PURE__ */ B(!1), S = /* @__PURE__ */ B(!1), C = /* @__PURE__ */ B(!1), w = /* @__PURE__ */ B(!navigator.onLine), T = /* @__PURE__ */ B(""), E = /* @__PURE__ */ B(""), ee = /* @__PURE__ */ B(!1), te = /* @__PURE__ */ B([]), D = /* @__PURE__ */ B([]), O = /* @__PURE__ */ B(""), ne = /* @__PURE__ */ B(""), k = /* @__PURE__ */ B(!1), A = /* @__PURE__ */ B([]), j = /* @__PURE__ */ B(""), M = /* @__PURE__ */ B(!1), re = /* @__PURE__ */ B(!1), ie = /* @__PURE__ */ B(""), ae = /* @__PURE__ */ B(null), oe = /* @__PURE__ */ B(null), N = /* @__PURE__ */ B(null), P = /* @__PURE__ */ B(!1), se = /* @__PURE__ */ B(null), ce = X(() => y.value.features?.native_chat === !0), le, ue, F = 0, I = 0, L = /* @__PURE__ */ B({
		supported: !1,
		permission: "unsupported",
		subscribed: !1,
		available: !1,
		error: ""
	}), R = /* @__PURE__ */ B(!1), de = /* @__PURE__ */ B(!1), fe = /* @__PURE__ */ B(""), pe = 0, me = /* @__PURE__ */ B(null), he = /* @__PURE__ */ new Set(), ge = /* @__PURE__ */ B([]), _e = /* @__PURE__ */ B(/* @__PURE__ */ new Set()), z = 0;
	async function ve(e, t) {
		if (w.value || _e.value.has(e) || it.value) return;
		let n = h.value, r = I, i = ge.value.find((t) => t.session_id === e);
		Xe(), z++, _e.value.add(e), ge.value = [...ge.value.filter((t) => t.session_id !== e), {
			session_id: e,
			status: t,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}];
		try {
			let i = await Q.track(n, e, t);
			if (r !== I) return;
			i.session_id !== e && (_.value = _.value.map((t) => t.id === e ? {
				...t,
				id: i.session_id
			} : t)), ge.value = [...ge.value.filter((t) => t.session_id !== e && t.session_id !== i.session_id), i];
		} catch (t) {
			if (r !== I) return;
			ge.value = ge.value.filter((t) => t.session_id !== e), i && ge.value.push(i), T.value = t instanceof Error ? t.message : "Could not update tracking";
		} finally {
			r === I && (Xe(), _e.value.delete(e));
		}
	}
	function ye(e) {
		e === h.value && Ze();
	}
	function be(e, t, n) {
		e === h.value && (_.value = _.value.map((e) => e.id === t ? {
			...e,
			title: n
		} : e));
	}
	let { projectBusy: xe, manageError: Se, projectId: Ce, projects: we, selectedProject: Te, projectsLoading: Ee, projectLoading: De, projectsError: Oe, projectError: ke, projectsLoaded: Ae, visibleSessions: je, subscribeProjectEvents: Me, refreshProjects: Ne, loadProjects: Pe, loadProject: Fe, chooseProject: Ie, showProjects: Le, manageProject: Re, resetProjects: ze, selectProjectScope: Be, whenProjectsLoaded: Ve } = hl({
		profile: h,
		session: g,
		sessions: _,
		offline: w,
		navigate: p,
		loadSessions: Ze,
		refreshInbox: Pt,
		profileGeneration: () => I
	}), He = bm(() => {
		Ne(), Ze(), Pt();
	}, ye, be, It);
	Im(Zh(He, {
		profile: h,
		session: g,
		messages: v,
		chatLoading: C,
		chatError: E,
		canStream: ce,
		composerBlocked: i,
		projectView: r,
		selectedProject: Te,
		creating: k,
		offline: w,
		models: D,
		providers: A,
		modelsLoading: M,
		model: O,
		provider: j,
		defaultModel: ne,
		suggestedPrompt: ie,
		generation: () => F,
		navigation: () => e.currentRoute.value,
		createSession: tt,
		suggest: nt,
		retryHistory: Qe,
		openBranch: async (e) => {
			await dt(e), Ne(), Ze();
		}
	}));
	let Ue = ng(), We = gg({
		profile: h,
		offline: w,
		creating: k,
		recentSession: Je
	}), Ge = ce;
	function Ke() {
		He.close(), F++, ue?.abort(), C.value = !1;
	}
	function qe() {
		Ke(), le?.abort(), S.value = !1;
	}
	function Je(e) {
		return dt(e, "");
	}
	async function Ye() {
		return await tt(!0);
	}
	function Xe() {
		le?.abort(), le = void 0, S.value = !1;
	}
	async function Ze(e = !1) {
		z++, le?.abort();
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
			let s = ge.value.filter((e) => _e.value.has(e.session_id));
			o && (ge.value = [...o.tracking.filter((e) => !_e.value.has(e.session_id)), ...s]), a.error && (T.value = a.error);
			let c = i.sessions.filter((e) => !he.has(e.id)).map((e) => {
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
			for (let e of o?.sessions || []) !l.has(e.id) && !he.has(e.id) && l.set(e.id, e);
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
	async function Qe() {
		if (!g.value) return !1;
		if (Ge.value) return await He.hydrate(), !0;
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
	async function $e(e) {
		if (e && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(e)) {
			T.value = "Invalid profile name";
			return;
		}
		ie.value = "", k.value = !1, it.value = !1, at++, qe(), ze(), h.value = e, g.value = "", _.value = [], ge.value = [], _e.value = /* @__PURE__ */ new Set(), he.clear(), v.value = [], y.value = {}, D.value = [], A.value = [], j.value = "", O.value = "", ne.value = "", M.value = !0, T.value = "", E.value = "", b.value = 0, x.value = !1;
		let t = ++I;
		Me(), Pe(), Ze(), Promise.allSettled([Q.models(e), Q.modelOptions(e)]).then(([e, n]) => {
			t === I && (e.status === "fulfilled" && (D.value = e.value.data || [], ne.value = e.value.default_model || ""), n.status === "fulfilled" && Array.isArray(n.value.providers) && (A.value = n.value.providers.filter((e) => e.models.length || e.is_current), j.value = A.value.find((e) => e.is_current)?.slug || n.value.provider || "", ne.value = n.value.model || ne.value), M.value = !1);
		});
		try {
			let n = await Q.capabilities(e);
			t === I && h.value === e && (y.value = n);
		} catch {
			t === I && h.value === e && (y.value = {});
		}
	}
	async function et(e) {
		(Q.isNative(h.value) || Ce.value || _.value.find((t) => t.id === e)?.cwd || _.value.find((t) => t.id === e)?.source === "desktop") && Q.workspace(h.value, e), ie.value = "", Ke(), g.value = e, v.value = [], E.value = "", ee.value = !1;
		let t = F, n = h.value;
		if (!Ce.value && !Q.isWorkspace(n, e)) {
			try {
				await Q.session(n, e);
			} catch {}
			if (t !== F || n !== h.value) return;
		}
		Ge.value ? await He.attach(n, e) : await Qe();
	}
	async function tt(t = !1) {
		if (w.value || k.value || !t && Ce.value && Te.value?.archived) return;
		let n = h.value, r = t ? "" : Ce.value, i = g.value, a = e.currentRoute.value, o = F, s = I, c = f = new AbortController();
		k.value = !0;
		try {
			r && !j.value && (j.value = A.value.find((e) => e.is_current)?.slug || "", O.value = "");
			let t = r ? await Q.projectCreate(n, r) : await Q.create(n);
			if (c.signal.aborted || o !== F || h.value !== n || g.value !== i || a !== e.currentRoute.value) return;
			await dt(t.id, r), Ne();
			let l = ++z;
			return Q.tracking(n).then((e) => {
				if (s !== I || l !== z) return;
				ge.value = e.tracking;
				let t = new Map(_.value.map((e) => [e.id, e]));
				for (let n of e.sessions) he.has(n.id) || t.set(n.id, n);
				_.value = [...t.values()];
			}).catch(() => {
				s === I && (T.value = "Could not load session tracking");
			}), h.value !== n || g.value !== t.id ? void 0 : t.id;
		} catch (t) {
			if (!c.signal.aborted && o === F && a === e.currentRoute.value && h.value === n && Ce.value === r) {
				let e = t instanceof Error ? t.message : "Could not create session";
				r ? ke.value = e : T.value = e;
			}
		} finally {
			s === I && (k.value = !1);
		}
	}
	async function nt(e) {
		let t = F, n = h.value, r = await tt();
		r && t + 1 === F && n === h.value && g.value === r && (ie.value = e);
	}
	async function rt(e, t) {
		let n = h.value, r = F;
		try {
			if (await Q.rename(n, e, t), r !== F || n !== h.value) return;
			let i = _.value.find((t) => t.id === e);
			i && (i.title = t), Ne();
		} catch (e) {
			r === F && n === h.value && (T.value = e instanceof Error ? e.message : "Could not rename session");
		}
	}
	let it = /* @__PURE__ */ B(!1), at = 0;
	async function ot(e, t, n = "") {
		if (w.value || it.value) return;
		let r = h.value, i = F, a = ++at, o = I;
		it.value = !0, Xe();
		try {
			if (e === "archive" ? await Q.archive(r, t) : e === "delete" ? await Q.deleteSession(r, t) : await Q.moveSession(r, t, n), o !== I || r !== h.value) return;
			Xe(), e !== "project" && (he.add(t), _.value = _.value.filter((e) => e.id !== t)), i === F && g.value === t && (e === "project" ? await p({
				name: "chat",
				params: { sessionId: t },
				query: {
					...r ? { profile: r } : {},
					project: n
				}
			}) : await p({
				name: "home",
				query: r ? { profile: r } : {}
			})), await Ze(), Ne();
		} catch (e) {
			i === F && r === h.value && (T.value = e instanceof Error ? e.message : "Could not update session");
		} finally {
			a === at && (it.value = !1);
		}
	}
	async function st() {
		await He.availability(document.visibilityState === "visible", navigator.onLine), document.visibilityState === "visible" && (Ne(), Pt());
	}
	function ct() {
		location.href = "/";
	}
	function lt() {
		w.value = !navigator.onLine, He.availability(document.visibilityState === "visible", !w.value), w.value || (Ne(), Ze(), st());
	}
	function ut(t) {
		if (t && !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(t)) {
			T.value = "Invalid profile name";
			return;
		}
		return p(a.value ? pl("settings", t, "", "", { return_to: e.resolve(pl("home", t)).fullPath }) : pl("home", t), !1, !0);
	}
	function dt(e, t = Ce.value) {
		return p({
			name: "chat",
			params: { sessionId: e },
			query: {
				...h.value ? { profile: h.value } : {},
				...t ? { project: t } : {}
			}
		});
	}
	async function ft(n) {
		let r = dl(t.query.profile);
		if ((!c || r !== h.value) && (c = !0, l = $e(r), await l, n !== e.currentRoute.value) || (await l, n !== e.currentRoute.value)) return;
		let i = typeof t.params.sessionId == "string" ? t.params.sessionId : dl(t.query.session), a = typeof t.params.projectId == "string" ? t.params.projectId : dl(t.query.project), o = () => we.value.find((e) => e.sessionIds?.includes(i) || sl(e).some((e) => e.id === i)), s = a || t.name === "chat" && o()?.id || "";
		if (s !== Ce.value && Be(s), i !== g.value && (i ? await et(i) : (Ke(), g.value = "", v.value = [], ie.value = "")), n === e.currentRoute.value && r === h.value && (i && t.name === "chat" && i === g.value && await It(r, i), i && !a && t.name === "chat" && !Ae.value)) {
			if (await Ve(), n !== e.currentRoute.value || r !== h.value || i !== g.value) return;
			let t = o();
			t && t.id !== Ce.value && (Ce.value = t.id, Te.value = t, Fe());
		}
	}
	In(() => t.fullPath, () => {
		if (!t.matched.length) return;
		let n = e.currentRoute.value;
		_t.cancel(), t.fullPath !== d && (ee.value = !1), bt(!1), Se.value = "", s && (u = ft(n));
	}, { flush: "sync" });
	function pt() {
		ee.value = !1, ae.value?.focus();
	}
	async function mt() {
		ee.value = !0, await _n(), oe.value?.focus();
	}
	let ht = /* @__PURE__ */ B(null), gt = /* @__PURE__ */ B(null), _t = $h(ee, () => ht.value?.getBoundingClientRect().width || Math.min(300, window.innerWidth * .85), () => gt.value?.$el.querySelector(".transcript") || null, (e) => {
		e !== ee.value && (e ? mt() : pt());
	});
	async function vt() {
		await p(fl(dl(t.query.return_to))), await _n(), window.matchMedia?.("(min-width: 701px)").matches ?? !0 ? me.value?.focus() : ae.value?.focus();
	}
	function yt() {
		if (!a.value) return p(m("settings", { return_to: t.fullPath }));
	}
	function bt(e = !0) {
		P.value && (P.value = !1, e && N.value?.focus());
	}
	function xt(e) {
		P.value && se.value && !e.composedPath().includes(se.value) && bt(!1);
	}
	function St(e) {
		e.key !== "Escape" || e.defaultPrevented || e.target instanceof Element && e.target.closest("dialog[open]") || (ee.value ? pt() : a.value ? (e.preventDefault(), vt()) : bt());
	}
	async function Ct() {
		let e = h.value, t = ++pe;
		de.value = !0;
		let n = await km(e);
		t === pe && e === h.value && (L.value = n, de.value = !1);
	}
	In(h, () => {
		fe.value = "", L.value = {
			...L.value,
			subscribed: !1
		}, Ct();
	}, { flush: "sync" });
	async function wt() {
		if (R.value || de.value) return;
		let e = h.value;
		R.value = !0, fe.value = "";
		try {
			L.value.subscribed ? await jm(e) : await Am(e), await Ct();
		} catch (t) {
			e === h.value && (fe.value = t instanceof Error ? t.message : "Could not update notifications."), await Ct();
		} finally {
			R.value = !1;
		}
	}
	async function Tt() {
		if (R.value || de.value) return;
		let e = h.value;
		R.value = !0, fe.value = "";
		try {
			await Mm(e), e === h.value && (fe.value = "Test notification scheduled.");
		} catch {
			e === h.value && (fe.value = "Could not send a test notification.");
		} finally {
			R.value = !1;
		}
	}
	let Et, Dt = X(() => ({
		profile: h.value,
		session: g.value,
		chat: n.value,
		scheduled: o.value && t.params.jobId && t.params.runId ? {
			job: String(t.params.jobId),
			run: String(t.params.runId)
		} : void 0,
		connected: Ge.value && He.connection.value === "ready" && !w.value
	}));
	In(Dt, () => Et?.publish(), { flush: "post" });
	async function Ot(n) {
		if (n.data?.type !== "chathermes.navigate" || typeof n.data.url != "string") return;
		let r = n.data.url, i = ml(r), a = n.ports?.[0], c = !1;
		try {
			if (!i) return;
			await p(i);
			let n = e.currentRoute.value, r = e.resolve(i).fullPath, l = () => s && n === e.currentRoute.value && t.fullPath === r;
			if (!a || !l()) return;
			t.name === "chat" ? c = Ge.value ? He.connection.value === "ready" && await He.hydrate() === !0 : !C.value && !E.value : o.value ? (await _n(), c = await We.current.value?.whenLoaded() === !0) : c = !0, await _n(), c &&= l();
		} catch {
			c = !1;
		} finally {
			a && (c && a.postMessage({
				type: "chathermes.navigated",
				url: r
			}), a.close());
		}
	}
	let kt = /* @__PURE__ */ B(0), At = /* @__PURE__ */ B(0), jt, Mt, Nt = "";
	async function Pt(e = !0) {
		if (document.visibilityState === "hidden") return;
		Mt?.abort();
		let t = Mt = new AbortController();
		try {
			let n = await Q.inbox(h.value, { limit: 1 }, t.signal);
			if (t.signal.aborted) return;
			kt.value = n.unread, e && It(h.value, g.value);
			let r = JSON.stringify([
				n.revision,
				n.unread,
				n.items[0]?.id
			]);
			r !== Nt && (Nt = r, At.value++);
		} catch {}
	}
	let Ft = /* @__PURE__ */ new Map();
	async function It(e, n) {
		let r = () => s && !!n && e === h.value && n === g.value && t.name === "chat" && !E.value && (!Ge.value || He.connection.value === "ready" || !!He.approval.value || He.requests.value.length > 0);
		if (!r()) return;
		Et?.publish();
		let i = JSON.stringify([e, n]), a = (Ft.get(i) || Promise.resolve()).then(async () => {
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
				i && e === h.value && Pt(!1);
			}
		});
		Ft.set(i, a), await a, Ft.get(i) === a && Ft.delete(i);
	}
	async function Lt(t) {
		let n = e.currentRoute.value;
		if (await Q.session(t.profile, t.session), n !== e.currentRoute.value) throw Error("Navigation changed");
		if (await p({
			name: "chat",
			params: { sessionId: t.session },
			query: { profile: t.profile }
		}), h.value !== t.profile || g.value !== t.session || E.value || Ge.value && He.connection.value !== "ready") throw Error("Chat unavailable");
		await It(t.profile, t.session);
	}
	return sr(async () => {
		Pt(), jt = setInterval(() => void Pt(), 15e3), "serviceWorker" in navigator && (Et = Pm(navigator.serviceWorker, () => Dt.value, () => location.href)), Q.profiles().then((e) => {
			te.value = e.profiles || [];
		}).catch(() => {
			T.value = "Could not load profiles";
		}), Ct(), "serviceWorker" in navigator && navigator.serviceWorker.addEventListener("message", Ot), re.value = !!ae.value?.closest(".chathermes-embedded"), document.addEventListener("visibilitychange", st), addEventListener("online", lt), addEventListener("offline", lt), addEventListener("keydown", St), document.addEventListener("click", xt), await e.isReady(), s = !0, u = ft(e.currentRoute.value), await u;
	}), dr(() => {
		clearInterval(jt), Mt?.abort(), s = !1, e.options.history.destroy(), Et?.stop(), Et = void 0, I++, document.removeEventListener("visibilitychange", st), "serviceWorker" in navigator && navigator.serviceWorker.removeEventListener("message", Ot), qe(), removeEventListener("online", lt), removeEventListener("offline", lt), removeEventListener("keydown", St), document.removeEventListener("click", xt);
	}), ig({
		profile: h,
		inboxRevision: At,
		openInboxItem: Lt,
		refreshInbox: Pt
	}), sg({
		profile: h,
		projects: we,
		recentSession: Je
	}), ug({
		profile: h,
		profiles: te,
		pushState: L,
		pushBusy: R,
		pushLoading: de,
		pushMessage: fe,
		wakeLock: Ue,
		chooseProfile: ut,
		togglePush: wt,
		testPush: Tt,
		closeSettings: vt
	}), pg({
		profile: h,
		projectId: Ce,
		selectedProject: Te,
		projects: we,
		projectsLoading: Ee,
		projectLoading: De,
		projectsError: Oe,
		projectError: ke,
		manageError: Se,
		projectBusy: xe,
		offline: w,
		visibleSessions: je,
		chooseProject: Ie,
		showProjects: Le,
		loadProject: Fe,
		loadProjects: Pe,
		recentSession: Je,
		chooseSession: dt,
		manageProject: Re,
		createSession: tt,
		creating: k
	}), {
		profile: h,
		session: g,
		sessions: _,
		projects: we,
		selectedProject: Te,
		projectId: Ce,
		offline: w,
		creating: k,
		profiles: te,
		loading: S,
		error: T,
		hasMore: x,
		tracking: ge,
		trackingPending: _e,
		sessionBusy: it,
		drawer: ee,
		embedded: re,
		menuButton: ae,
		closeButton: oe,
		screenMenuButton: N,
		screenMenuWrap: se,
		screenMenu: P,
		sidebar: ht,
		chatPlane: gt,
		drawerSwipe: _t,
		settingsButton: me,
		inboxUnread: kt,
		settingsPage: a,
		projectView: r,
		recentSession: Je,
		chooseProfile: ut,
		createSession: tt,
		trackSession: ve,
		newChat: Ye,
		loadSessions: Ze,
		manageSession: ot,
		rename: rt,
		exitPlugin: ct,
		showSettings: yt,
		openDrawer: mt,
		closeDrawer: pt,
		closeScreenMenu: bt,
		screenLink: m
	};
}
//#endregion
//#region src/features/sessions/components/SessionSidebar.vue?vue&type=script&setup=true&lang.ts
var Tg = {
	key: 0,
	class: "notice error rounded-lg bg-[#402b2b] p-3 text-sm text-[#fecaca] dark:bg-[#402b2b] dark:text-[#fecaca]",
	role: "alert"
}, Eg = {
	key: 1,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Dg = {
	key: 2,
	class: "muted text-sm leading-relaxed text-[#a3a3a3] dark:text-[#a3a3a3]"
}, Og = {
	key: 3,
	"aria-label": "Sessions",
	class: "session-list grid min-h-0 flex-1 auto-rows-max gap-0.5 overflow-y-auto"
}, kg = ["aria-label"], Ag = { class: "session-head mt-4 mb-1 px-2.5 text-xs font-semibold text-[#a3a3a3]" }, jg = [
	"aria-label",
	"disabled",
	"onClick"
], Mg = ["aria-current", "onClick"], Ng = { class: "truncate" }, Pg = ["title"], Fg = [
	"aria-label",
	"disabled",
	"onClick"
], Ig = ["disabled"], Lg = ["aria-label"], Rg = {
	key: 0,
	class: "grid gap-1"
}, zg = ["disabled"], Bg = ["value"], Vg = {
	key: 0,
	class: "text-sm text-[#a3a3a3]"
}, Hg = ["disabled"], Ug = {
	key: 2,
	class: "grid gap-3 p-1"
}, Wg = ["disabled"], Gg = /* @__PURE__ */ H({
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
				let n = [...t.sessionIds || [], ...sl(t).map((e) => e.id)];
				for (let r of n) e.set(r, t.label);
			}
			return e;
		});
		function c(e) {
			let t = s.value.get(e.id);
			return [e.source || "Hermes", t].filter(Boolean).join(" · ");
		}
		let l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B("");
		function d(e) {
			l.value = e.id, u.value = e.title || "";
		}
		function f() {
			u.value.trim() && r("rename", l.value, u.value.trim()), l.value = "";
		}
		let p = /* @__PURE__ */ B(), m = /* @__PURE__ */ B(), h = /* @__PURE__ */ B("menu"), g = /* @__PURE__ */ B(""), _ = /* @__PURE__ */ B({
			left: "0px",
			top: "0px"
		}), v = X(() => (n.projects || []).filter((e) => !e.archived && !e.isNoProject && (e.path || e.repos.some((e) => e.path))));
		async function y(e, t) {
			m.value = e, h.value = "menu";
			let n = t.currentTarget.getBoundingClientRect();
			_.value = {
				left: `${Math.max(12, Math.min(n.right - 208, window.innerWidth - 220))}px`,
				top: `${Math.max(12, Math.min(n.bottom, window.innerHeight - 280))}px`
			}, await _n(), p.value?.showModal();
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
			e.error ? (W(), G("p", Tg, [J(z(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[0] ||= (e) => r("retry")
			}, "Retry")])) : Y("v-if", !0),
			e.loading && !e.sessions.length ? (W(), G("p", Eg, " Loading sessions… ")) : e.sessions.length ? (W(), G("nav", Og, [(W(!0), G(U, null, _r(a.value, (t) => (W(), G("section", {
				key: t.label,
				"aria-label": t.label
			}, [q("h2", Ag, z(t.label), 1), (W(!0), G(U, null, _r(t.sessions, (t) => (W(), G("div", {
				key: t.id,
				class: F(["session-row flex items-center rounded-lg hover:bg-[#303030] dark:hover:bg-[#303030]", e.selected === t.id ? "active bg-[#303030] dark:bg-[#303030]" : ""])
			}, [l.value === t.id ? (W(), G(U, { key: 0 }, [An(q("input", {
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
				}), q("path", { d: "m8 12 3 3 5-6" })], -1)]], 8, jg)) : Y("v-if", !0),
				q("button", {
					class: "session-select grid min-h-[44px] min-w-0 flex-1 gap-0 px-2.5 py-1.5 text-left text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-current": e.selected === t.id ? "page" : void 0,
					onClick: (e) => r("select", t.id)
				}, [q("span", Ng, z(t.title || "Untitled session"), 1), q("span", {
					class: "truncate text-xs leading-4 text-[#a3a3a3] dark:text-[#a3a3a3]",
					title: c(t)
				}, z(c(t)), 9, Pg)], 8, Mg),
				q("button", {
					class: "icon-button rounded-md px-2 py-1 text-xl text-white hover:bg-[#424242] focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
					"aria-label": `Options for ${t.title || "Untitled session"}`,
					"aria-haspopup": "dialog",
					disabled: e.busy,
					onClick: (e) => y(t, e)
				}, " ⋮ ", 8, Fg)
			], 64))], 2))), 128))], 8, kg))), 128))])) : (W(), G("p", Dg, " No conversations yet. ")),
			e.hasMore ? (W(), G("button", {
				key: 4,
				class: "load-more self-start rounded-md px-2.5 py-1.5 text-xs text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:cursor-not-allowed disabled:opacity-55",
				disabled: e.loading,
				onClick: n[3] ||= (e) => r("more")
			}, z(e.loading ? "Loading…" : "Load more"), 9, Ig)) : Y("v-if", !0),
			q("dialog", {
				ref_key: "popup",
				ref: p,
				class: "session-popup fixed m-0 w-52 rounded-xl border border-[#424242] bg-[#212121] p-2 text-base text-white shadow-xl backdrop:bg-transparent",
				style: P(_.value),
				"aria-label": h.value === "menu" ? "Session options" : h.value === "project" ? "Add to project" : "Delete conversation",
				onClick: n[7] ||= (e) => e.target === e.currentTarget && b()
			}, [h.value === "menu" ? (W(), G("div", Rg, [
				q("button", {
					class: "rounded-lg px-3 py-2 text-left hover:bg-[#303030]",
					disabled: e.busy || m.value && e.trackingPending?.has(m.value.id),
					onClick: o
				}, z(m.value && i.value.get(m.value.id)?.status === "open" ? "Mark settled" : "Make active"), 9, zg),
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
				An(q("select", {
					id: "session-project",
					"onUpdate:modelValue": n[6] ||= (e) => g.value = e,
					class: "min-w-0 rounded-md bg-[#303030] p-2 text-base"
				}, [n[9] ||= q("option", {
					value: "",
					disabled: ""
				}, "Choose project", -1), (W(!0), G(U, null, _r(v.value, (e) => (W(), G("option", {
					key: e.id,
					value: e.id
				}, z(e.label), 9, Bg))), 128))], 512), [[xo, g.value]]),
				v.value.length ? Y("v-if", !0) : (W(), G("p", Vg, "No projects available.")),
				q("button", {
					class: "rounded-lg bg-[#303030] px-3 py-2 disabled:opacity-55",
					disabled: !g.value || e.busy
				}, " Add ", 8, Hg),
				q("button", {
					type: "button",
					class: "rounded-lg px-3 py-2 hover:bg-[#303030]",
					onClick: b
				}, " Cancel ")
			], 32)) : (W(), G("div", Ug, [
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
				}, " Delete conversation ", 8, Wg)
			]))], 12, Lg)
		], 64));
	}
}), Kg = { class: "app-shell flex h-dvh min-h-0 overflow-hidden bg-black font-sans text-white dark:bg-black dark:text-white" }, qg = { class: "brand mb-3 shrink-0 flex items-center gap-2 px-2 text-xl font-semibold" }, Jg = ["aria-label"], Yg = { class: "sidebar-foot relative shrink-0 mt-auto grid gap-2 border-t border-[#303030] px-2 pt-4 text-xs text-[#a3a3a3] dark:border-[#303030] dark:text-[#a3a3a3]" }, Xg = { class: "drawer-account flex min-w-0 items-center gap-2" }, Zg = ["value"], Qg = ["value"], $g = ["value"], e_ = ["disabled"], t_ = ["aria-current"], n_ = { class: "main-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden" }, r_ = { class: "topbar flex h-[68px] shrink-0 items-center gap-3 px-[18px] min-[701px]:px-8" }, i_ = ["aria-expanded"], a_ = { class: "min-w-0 flex-1" }, o_ = { class: "header-title truncate text-base font-medium" }, s_ = {
	key: 0,
	class: "header-project-subtitle truncate text-xs text-[#a3a3a3]"
}, c_ = { class: "topbar-profile sr-only" }, l_ = ["aria-expanded"], u_ = {
	class: "truncate px-3 py-2 text-xs text-[#a3a3a3]",
	role: "presentation"
}, d_ = ["disabled"], f_ = /* @__PURE__ */ H({
	__name: "App",
	setup(e) {
		let t = kc(), { profile: n, session: r, sessions: i, projects: a, selectedProject: o, projectId: s, offline: c, creating: l, profiles: u, loading: d, error: f, hasMore: p, tracking: m, trackingPending: h, sessionBusy: g, drawer: _, embedded: v, menuButton: y, closeButton: b, screenMenuButton: x, screenMenuWrap: S, screenMenu: C, sidebar: w, chatPlane: T, drawerSwipe: E, settingsButton: ee, inboxUnread: te, settingsPage: D, projectView: O, recentSession: ne, chooseProfile: k, createSession: A, trackSession: j, newChat: M, loadSessions: re, manageSession: ie, rename: ae, exitPlugin: oe, showSettings: N, openDrawer: se, closeDrawer: ce, closeScreenMenu: le, screenLink: ue } = wg();
		return (e, I) => (W(), G("div", Kg, [
			q("aside", {
				ref: (e) => w.value = e,
				class: F(["sidebar fixed inset-y-0 h-dvh left-0 z-20 flex w-[min(300px,85vw)] shrink-0 flex-col gap-1 bg-black px-3 py-4 text-white shadow-xl transition-transform duration-200 min-[701px]:static min-[701px]:w-[294px] min-[701px]:translate-x-0 min-[701px]:shadow-none dark:bg-black dark:text-white", V(_) ? "translate-x-0" : "-translate-x-full"]),
				style: P(V(E).sidebarStyle.value),
				onTouchstart: I[14] ||= (...e) => V(E).start && V(E).start(...e),
				onTouchmove: I[15] ||= (...e) => V(E).move && V(E).move(...e),
				onTouchend: I[16] ||= (...e) => V(E).end && V(E).end(...e),
				onTouchcancel: I[17] ||= (...e) => V(E).cancel && V(E).cancel(...e),
				onClickCapture: I[18] ||= (...e) => V(E).click && V(E).click(...e),
				"aria-label": "Navigation"
			}, [
				q("div", qg, [
					I[31] ||= q("span", { class: "min-w-0 truncate" }, "ChatHermes", -1),
					V(v) ? (W(), G("button", {
						key: 0,
						class: "drawer-dashboard grid size-8 shrink-0 place-items-center rounded-lg text-[#a3a3a3] hover:bg-[#303030] hover:text-white focus-visible:outline-3 focus-visible:outline-[#b4b4b4]",
						"aria-label": "Return to Hermes Desktop",
						title: "Return to Hermes Desktop",
						onClick: I[0] ||= (...e) => V(oe) && V(oe)(...e)
					}, [...I[30] ||= [q("svg", {
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
						onClick: I[1] ||= (...e) => V(ce) && V(ce)(...e)
					}, " × ", 512)
				]),
				qi(V(yc), {
					class: "inbox-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": V(t).name === "inbox" ? "page" : void 0,
					to: V(ue)("inbox"),
					onClick: I[2] ||= (e) => _.value = !1
				}, {
					default: kn(() => [
						I[32] ||= q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "M4 4h16v16H4zM4 13h4l2 3h4l2-3h4" })], -1),
						I[33] ||= J(" Inbox ", -1),
						V(te) ? (W(), G("span", {
							key: 0,
							class: "ml-auto rounded-full bg-[#424242] px-2 text-sm leading-[1.5]",
							"aria-label": `${V(te)} unread notifications`
						}, z(V(te)), 9, Jg)) : Y("v-if", !0)
					]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(V(yc), {
					class: "projects-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": V(t).meta.section === "projects" ? "page" : void 0,
					to: V(ue)("projects"),
					onClick: I[3] ||= (e) => _.value = !1
				}, {
					default: kn(() => [...I[34] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11H3Z" })], -1), J("Projects ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				qi(V(yc), {
					class: "scheduled-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": V(t).meta.section === "scheduled" ? "page" : void 0,
					to: V(ue)("scheduled"),
					onClick: I[4] ||= (e) => _.value = !1
				}, {
					default: kn(() => [...I[35] ||= [q("svg", {
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
				qi(V(yc), {
					class: "artifacts-nav flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base hover:bg-[#303030]",
					"aria-current": V(t).name === "artifacts" ? "page" : void 0,
					to: V(ue)("artifacts"),
					onClick: I[5] ||= (e) => _.value = !1
				}, {
					default: kn(() => [...I[36] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M6 3h8l4 4v14H6ZM14 3v5h4M9 12h6M9 16h6" })], -1), J("Artifacts ", -1)]]),
					_: 1
				}, 8, ["aria-current", "to"]),
				(W(), K(Gg, {
					heading: "Recents",
					sessions: V(i),
					tracking: V(m),
					"tracking-pending": V(h),
					onTrack: V(j),
					selected: V(r),
					loading: V(d),
					error: V(f),
					"has-more": V(p),
					busy: V(c) || V(l) || V(g),
					projects: V(a),
					key: V(n),
					onArchive: I[6] ||= (e) => V(ie)("archive", e),
					onDelete: I[7] ||= (e) => V(ie)("delete", e),
					onProject: I[8] ||= (e, t) => V(ie)("project", e, t),
					onSelect: V(ne),
					onCreate: V(M),
					onMore: I[9] ||= (e) => V(re)(!0),
					onRetry: I[10] ||= (e) => V(re)(),
					onRename: V(ae)
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
				q("div", Yg, [
					I[40] ||= q("label", { for: "profile-field" }, "Profile", -1),
					q("div", Xg, [
						q("select", {
							id: "profile-field",
							class: "profile-field min-w-0 flex-1 rounded-md border border-[#424242] bg-[#171717] px-2 py-2 text-base text-white",
							value: V(n),
							onChange: I[11] ||= (e) => V(k)(e.target.value)
						}, [
							I[37] ||= q("option", { value: "" }, "Default profile", -1),
							V(n) && !V(u).some((e) => e.name === V(n)) ? (W(), G("option", {
								key: 0,
								value: V(n)
							}, z(V(n)), 9, Qg)) : Y("v-if", !0),
							(W(!0), G(U, null, _r(V(u), (e) => (W(), G("option", {
								key: e.name,
								value: e.name
							}, z(e.name), 9, $g))), 128))
						], 40, Zg),
						q("button", {
							class: "drawer-chat grid size-11 shrink-0 place-items-center rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus-visible:outline-3 focus-visible:outline-[#b4b4b4] disabled:opacity-55",
							"aria-label": "New chat",
							title: "New chat",
							disabled: V(c) || V(l),
							onClick: I[12] ||= (...e) => V(M) && V(M)(...e)
						}, [...I[38] ||= [q("svg", {
							class: "size-6",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "1.5",
							"aria-hidden": "true"
						}, [q("path", { d: "M13 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l1-5 7-7 5 5-7 7Z" })], -1)]], 8, e_),
						q("button", {
							ref: (e) => ee.value = e,
							class: "drawer-settings grid size-11 shrink-0 place-items-center rounded-lg text-white hover:bg-[#303030]",
							"aria-label": "Settings",
							"aria-current": V(D) ? "page" : void 0,
							onClick: I[13] ||= (e) => V(N)()
						}, [...I[39] ||= [q("svg", {
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
						})], -1)]], 8, t_)
					]),
					q("span", null, [q("span", { class: F(["status-dot mr-2 inline-block size-2 rounded-full", V(c) ? "disconnected bg-[#dcae6e]" : "bg-[#94c9a5]"]) }, null, 2), J(z(V(c) ? "Offline · read only" : "Connected through dashboard"), 1)])
				])
			], 38),
			V(_) || V(E).dragging.value ? (W(), G("div", {
				key: 0,
				class: "scrim fixed inset-0 z-10 bg-black/55 min-[701px]:hidden",
				style: P(V(E).scrimStyle.value),
				onTouchstart: I[19] ||= (...e) => V(E).start && V(E).start(...e),
				onTouchmove: I[20] ||= (...e) => V(E).move && V(E).move(...e),
				onTouchend: I[21] ||= (...e) => V(E).end && V(E).end(...e),
				onTouchcancel: I[22] ||= (...e) => V(E).cancel && V(E).cancel(...e),
				onClickCapture: I[23] ||= (...e) => V(E).click && V(E).click(...e),
				onClick: I[24] ||= (...e) => V(ce) && V(ce)(...e)
			}, null, 36)) : Y("v-if", !0),
			q("main", n_, [
				q("header", r_, [
					q("button", {
						ref: (e) => y.value = e,
						class: "mobile-menu grid size-10 place-items-center rounded-xl min-[701px]:hidden hover:bg-[#303030]",
						"aria-label": "Open navigation",
						"aria-expanded": V(_),
						onClick: I[25] ||= (...e) => V(se) && V(se)(...e)
					}, [...I[41] ||= [q("svg", {
						class: "size-6",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "1.5",
						"aria-hidden": "true"
					}, [q("path", { d: "M3 6h18M3 13h12" })], -1)]], 8, i_),
					q("div", a_, [q("h1", o_, z(V(t).meta.title || V(i).find((e) => e.id === V(r))?.title || (V(r) ? "Conversation" : V(o)?.label || "ChatHermes")), 1), !V(D) && V(s) && V(r) && V(o) ? (W(), G("p", s_, z(V(o).label), 1)) : Y("v-if", !0)]),
					q("span", c_, z(V(n) || "Current profile"), 1),
					V(D) ? Y("v-if", !0) : (W(), G("div", {
						key: 0,
						ref: (e) => S.value = e,
						class: "screen-menu-wrap relative",
						onKeydown: I[29] ||= Ao(Oo((e) => V(le)(), ["stop", "prevent"]), ["esc"])
					}, [q("button", {
						ref: (e) => x.value = e,
						class: "screen-menu-button grid size-10 place-items-center rounded-full text-xl text-[#b4b4b4] hover:bg-[#303030]",
						"aria-label": "Screen options",
						"aria-haspopup": "menu",
						"aria-expanded": V(C),
						"aria-controls": "screen-menu",
						onClick: I[26] ||= (e) => C.value = !V(C)
					}, " ··· ", 8, l_), An(q("div", {
						id: "screen-menu",
						class: "screen-menu absolute right-0 top-12 z-30 grid min-w-48 gap-1 rounded-xl border border-[#424242] bg-[#303030] p-2 shadow-xl",
						role: "menu",
						"aria-label": "Screen options",
						onClick: I[28] ||= (e) => V(le)()
					}, [
						q("span", u_, z(V(n) || "Current profile"), 1),
						q("button", {
							class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
							role: "menuitem",
							disabled: V(c) || V(l) || V(O) && (!V(o) || V(o).archived || !V(o).isNoProject && !V(ol)(V(o))),
							onClick: I[27] ||= (e) => {
								V(O) ? V(A)() : V(M)(), V(le)();
							}
						}, " New chat ", 8, d_),
						qi(V(Ec), { name: "actions" })
					], 512), [[Ia, V(C)]])], 544))
				]),
				qi(V(Ec), { name: "dialogs" }),
				qi(qh, {
					ref: (e) => T.value = e,
					onTouchstart: V(E).start,
					onTouchmove: V(E).move,
					onTouchend: V(E).end,
					onTouchcancel: V(E).cancel,
					onClickCapture: V(E).click,
					"show-chat": V(t).meta.chat === !0,
					"hide-composer": V(t).meta.hideComposer === !0
				}, {
					default: kn(() => [(W(), K(V(Ec), { key: V(n) }))]),
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
				I[42] ||= q("footer", {
					class: "app-footer shrink-0 bg-black",
					"aria-hidden": "true"
				}, null, -1)
			])
		]));
	}
}), p_ = /* @__PURE__ */ H({
	__name: "InboxActions",
	setup(e) {
		let { refreshInbox: t, inboxRevision: n } = ag();
		return (e, r) => (W(), G("button", {
			role: "menuitem",
			class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
			"data-test": "refresh-inbox",
			"aria-label": "Refresh inbox",
			onClick: r[0] ||= (e) => {
				V(t)(), n.value++;
			}
		}, " Refresh inbox "));
	}
}), m_ = { id: "project-confirmation-text" }, h_ = {
	key: 0,
	role: "alert",
	class: "project-error"
}, g_ = { class: "project-actions" }, __ = ["disabled"], v_ = ["disabled"], y_ = /* @__PURE__ */ H({
	__name: "ProjectConfirmation",
	setup(e) {
		let { projectConfirmation: t, selectedProject: n, projectBusy: r, offline: i, manageError: a, manageProject: o, projectId: s } = mg(), c = /* @__PURE__ */ B();
		In(t, async () => {
			await _n(), c.value?.focus();
		});
		function l() {
			t.value = void 0, document.querySelector("[aria-label=\"Screen options\"]")?.focus();
		}
		async function u() {
			let e = t.value;
			e && (await o(e, { id: s.value }), a.value || (t.value = void 0));
		}
		return (e, o) => V(t) && V(n) ? (W(), G("div", {
			key: 0,
			class: "project-confirmation mx-6",
			role: "alertdialog",
			"aria-labelledby": "project-confirmation-text",
			onKeydown: o[0] ||= Ao(Oo((e) => !V(r) && l(), ["stop", "prevent"]), ["esc"])
		}, [
			q("p", m_, z(V(t) === "delete" ? `Delete ${V(n).label}? This permanently removes the project and its folder associations. Files and chats will be kept.` : `Archive ${V(n).label}? You can restore it from Archived projects.`), 1),
			V(a) ? (W(), G("p", h_, z(V(a)), 1)) : Y("v-if", !0),
			q("div", g_, [q("button", {
				ref_key: "projectConfirmCancel",
				ref: c,
				class: "project-button",
				disabled: V(r),
				onClick: l
			}, " Cancel", 8, __), q("button", {
				class: "project-button project-danger",
				disabled: V(r) || V(i),
				onClick: u
			}, z(V(t) === "delete" ? "Delete project permanently" : "Confirm archive"), 9, v_)])
		], 32)) : Y("v-if", !0);
	}
}), b_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fff}.st1{fill:%23bababa}%3c/style%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st1'%20d='M0%2094V2C0%20.9.9%200%202%200h48c.6%200%201.1.2%201.5.7l20%2022.3c.3.4.5.8.5%201.3V94c0%201.1-.9%202-2%202H2c-1.1%200-2-.9-2-2zm68-68.9L49.1%204H4v88h64V25.1z'/%3e%3cpath%20class='st1'%20d='M48%2026V4c0-1.1.9-2%202-2s2%20.9%202%202v20h16c1.1%200%202%20.9%202%202s-.9%202-2%202H50c-1.1%200-2-.9-2-2z'/%3e%3c/svg%3e", x_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2372a536}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2s1.2%204.4%203.2%204.4c1%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm10.7%200c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201L36%2010.1c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.5-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%2372a536'%20stroke='%2372a536'%20stroke-miterlimit='10'/%3e%3c/svg%3e", S_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.5-34.9c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4zm7.2%2010.6c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8zm8.7-10.3H32l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3L36%206.4h3.5l-3.9%2014.3h-3.3L28.4%206.4z'%20fill='%23fff'/%3e%3cpath%20d='M14%2054h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58m-44%205.9h8.5m3.3%200h8.5m3.4%200h8.5m3.3%200H58'%20fill='none'%20stroke='%231f7244'%20stroke-width='3'%20stroke-miterlimit='10'/%3e%3c/svg%3e", C_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2H6.6V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zM24.1%206.1c3.8%200%205.9%203.1%205.9%207.3%200%204.2-2.1%207.5-5.9%207.5s-5.8-3.2-5.8-7.5c0-4.1%202.1-7.3%205.8-7.3zm0%2011.7c1.7%200%202.5-1.8%202.5-4.3s-.8-4.2-2.5-4.2-2.5%201.7-2.5%204.2.8%204.3%202.5%204.3zM38%206.1c1.3%200%202.6.4%203.6%201.2l-1.4%202.8c-.4-.5-1.3-.9-2.1-.9-2.1%200-3.2%201.9-3.2%204.2%200%202.3%201.2%204.4%203.2%204.4%201%200%201.7-.5%202.3-1l1.4%202.8c-.9.7-2%201.3-3.9%201.3-4%200-6.3-3.1-6.3-7.4-.1-4.2%202.3-7.4%206.4-7.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", w_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231a75ce}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.4-34.6h3.3c2.9%200%204.7%202.6%204.7%207.1s-1.8%207.2-4.7%207.2H6.4V6.4zm3.3%2011.4c1.3%200%202.1-1.5%202.1-4.3S11%209.3%209.7%209.3H9v8.5h.7zM20%206.1c3%200%204.7%203.1%204.7%207.3%200%204.2-1.7%207.5-4.7%207.5s-4.7-3.2-4.7-7.5c0-4.1%201.7-7.3%204.7-7.3zm0%2011.7c1.4%200%202-1.8%202-4.3s-.6-4.2-2-4.2-2%201.7-2%204.2.6%204.3%202%204.3zM30.7%206.1c1%200%202.1.4%202.9%201.2l-1.1%202.8c-.3-.5-1-.9-1.7-.9-1.7%200-2.6%201.9-2.6%204.2%200%202.3.9%204.4%202.5%204.4.8%200%201.3-.5%201.8-1l1.1%202.8c-.7.7-1.6%201.3-3.2%201.3-3.2%200-5-3.1-5-7.4.1-4.2%202-7.4%205.3-7.4zm5.9%207.5l-2.8-7.2h2.9l.9%202.9c.3.9.4%201.8.4%201.8s.2-.9.5-1.8l.9-2.9h2.9l-2.8%207.2%202.7%207.1h-2.8l-.9-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.4%201.7l-.9%203h-2.8l2.7-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M19.5%2067.1l-4.8-14.8c-.2-.6-.3-.8-.4-.8-.1-.1-.2-.1-.3-.2l-1.7-.5-.1-2.1h9l.2%202.1-1.7.5v.2c0%20.2.1.6.3%201l1.8%205.7%203.2-9.5%202.4-.1%202.9%209.5%202-5.7c.1-.4.3-.8.3-1v-.1l-1.5-.4-.1-2.2h7l.2%202.1-1.9.6c-.1%200-.2.1-.3.1%200%20.1-.2.2-.3.7l-5.3%2014.7-2.5.2-2.7-9.1-3.2%208.9-2.5.2z'/%3e%3cpath%20d='M42.4%2048.6H60v2.8H42.4zm0%207.4H60v2.8H42.4zm0%207.7H60v2.8H42.4zM13%2071.5h47v2.8H13zm0%207.6h47v2.8H13z'%20fill='%231a75ce'%20stroke='%231a75ce'%20stroke-width='.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", T_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm6.4-34.9c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.1-4.5%202.6-7.6%206.5-7.6zm7.2%2012.4l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1h4.3v2.9h-8.9v-2.2z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", E_ = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23d75b26}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h2.8v5.8H12V6.4h2.8v14.3H12V15H9.2v5.7H6.5V6.4zm12%202.9h-2.7V6.4h8.1v2.9h-2.7v11.4h-2.8V9.3zm6.9-2.9h3.1l1.1%206c.2.9.4%202.4.4%202.4s.2-1.5.4-2.4l1.1-6h3.1l.8%2014.3h-2.6l-.3-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.7%204.1h-2.7l-.7-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.3%206.4h-2.6l.9-14.3zm11.5%200h2.8v11.4h3.7v2.9H37V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2075c-.5%200-1.1-.2-1.5-.6L13.6%2066c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-7%206.9%206.9%206.9c.8.8.8%202.1%200%203-.4.4-.9.6-1.4.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2074.3c-.4.5-.9.7-1.5.7zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3%201.1.4%201.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23d75b26'%20stroke='%23d75b26'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", D_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23307ac6}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm-.3-25.7H9v1.1c0%201.5.4%201.6.7%201.6.5%200%20.7-.3.7-1.6v-7H7.7v-3h6v9.9c0%203.3-2%204.6-4%204.6-2.1%200-4-1.4-4-4.6v-1zM18%2016.7c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4s.8-.6%201.2-1c.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2s-1-1.2-1.2-2-.3-2.1-.3-4c0-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202%20.4%202.1.4%204c0%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'%20fill='%23307ac6'%20stroke='%23307ac6'%20stroke-miterlimit='10'/%3e%3c/svg%3e", O_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}.st1{fill:%23fff}.st2{fill:%23999;stroke:%23999;stroke-width:.5;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20class='st1'%20d='M6%2041h60v49H6V41z'/%3e%3cpath%20class='st2'%20d='M16.4%2067.5v-4.1c.9-.1%201.6-.2%202-.4.4-.2.8-.6%201.2-1%20.4-.5.5-1.1.7-1.9.1-.6.2-1.5.2-2.8%200-2.2.1-3.7.4-4.6.2-.8.6-1.6%201.2-2%20.5-.5%201.4-.9%202.5-1.2.7-.2%201.9-.4%203.5-.4h.9V53c-1.3%200-2.2.1-2.6.3s-.6.4-.9.6c-.2.3-.3.7-.3%201.5s-.1%202-.2%204.1c-.1%201.2-.2%202-.4%202.8-.3.6-.6%201.2-1%201.8-.4.4-1%20.9-1.8%201.4.7.4%201.3.8%201.8%201.3s.8%201.2%201.1%201.9c.3.7.4%201.8.4%203%20.1%201.9.1%203.1.1%203.6%200%20.7.1%201.2.3%201.6.2.4.5.5.9.6.4.2%201.2.3%202.6.3v4.1h-1c-1.6%200-2.9-.1-3.7-.4-.9-.3-1.6-.6-2.2-1.2-.6-.6-1-1.2-1.2-2-.2-.8-.3-2.1-.3-4%200-2-.1-3.5-.3-4.1-.3-.9-.7-1.6-1.2-2-.7-.5-1.5-.7-2.7-.7zm39.1%200c-.9.1-1.6.2-2%20.4-.4.2-.8.6-1.2%201-.4.5-.5%201.1-.7%201.9-.1.6-.2%201.5-.2%202.8%200%202.2-.1%203.7-.4%204.6-.2.9-.6%201.6-1.2%202-.5.5-1.4.9-2.5%201.2-.7.2-1.9.4-3.5.4h-1v-4.1c1.3%200%202.1-.1%202.6-.3s.7-.4.9-.6c.2-.3.3-.7.3-1.5%200-.6.1-2%20.2-4%20.1-1.2.3-2.1.5-2.8.3-.7.6-1.3%201.1-1.9.4-.5%201-.9%201.7-1.3-.9-.6-1.6-1.1-2-1.6-.5-.7-1-1.8-1.2-2.8-.2-.8-.3-2.6-.3-5.2%200-.8-.1-1.4-.3-1.8-.2-.3-.4-.5-.8-.6-.2-.3-1-.3-2.5-.3v-4h1c1.6%200%202.9.1%203.7.4.9.3%201.6.6%202.2%201.2s1%201.2%201.2%202c.2.8.4%202.1.4%204%200%202%20.1%203.4.3%204.1.3.9.7%201.6%201.2%201.9.5.4%201.4.6%202.5.6.1.1%200%204.3%200%204.3z'/%3e%3cpath%20class='st1'%20d='M5.8%2015.7H8v.9c0%201.9.6%202.1%201.1%202.1.6%200%201.1-.4%201.1-2.1V8.7H7.8V6.5h4.6v10c0%203.2-1.6%204.4-3.3%204.4s-3.3-1.2-3.3-4.4v-.8zm9%201.8c.6.7%201.4%201.2%202.2%201.2%201%200%201.6-.7%201.6-1.8%200-2.6-4.5-2.5-4.5-6.6%200-2.3%201.4-4%203.8-4%201%200%202%20.3%202.8.9L20%209.4c-.5-.4-1.3-.8-2-.8-1.1%200-1.6.8-1.6%201.7%200%202.6%204.5%202.4%204.5%206.5%200%202.2-1.3%204.1-3.7%204.1-1.2%200-2.4-.5-3.3-1.4l.9-2zM27.1%206.2c3.2%200%205.1%203%205.1%207.3s-2%207.4-5.1%207.4c-3.2%200-5.1-3.1-5.1-7.4%200-4.2%202-7.3%205.1-7.3zm0%2012.4c1.8%200%202.9-2%202.9-5.1%200-3-1.1-4.9-2.9-4.9s-2.9%201.9-2.9%204.9c0%203.1%201.1%205.1%202.9%205.1zM34%206.5h2.3l3.3%208c.3.9.6%202.2.6%202.2h.1s-.1-1.3-.1-2.2v-8h2.1v14.2H40l-3.3-8.1c-.3-.9-.6-2.2-.6-2.2H36s.1%201.3.1%202.2v8H34V6.5z'/%3e%3cpath%20class='st2'%20d='M44.1%2067.1c-.7-.3-1.2-.9-1.2-1.6s.5-1.4%201.2-1.6c.3-.1.4-.3.3-.5-.3-.8-.5-1.6-1-2.2-.1-.3-.4-.3-.6-.2s-.5.3-.8.3c-1%200-1.7-.8-1.7-1.7%200-.3.1-.6.3-.8.1-.3%200-.4-.2-.6-.7-.4-1.5-.7-2.2-1-.3-.1-.4.1-.5.3-.3.7-.9%201.2-1.6%201.2s-1.4-.5-1.6-1.2c-.1-.3-.3-.4-.5-.3-.8.3-1.6.5-2.2%201-.3.1-.3.4-.2.6.2.3.3.5.3.8%200%201-.8%201.7-1.7%201.7-.3%200-.6-.1-.8-.3-.3-.1-.4%200-.6.2-.4.7-.7%201.5-1%202.2-.1.3.1.4.3.5.7.3%201.2.9%201.2%201.6s-.5%201.4-1.2%201.6c-.3.1-.4.3-.3.5.3.8.5%201.6%201%202.2.1.3.4.3.6.2.3-.2.5-.3.8-.3%201%200%201.7.8%201.7%201.7%200%20.3-.1.6-.3.8-.1.3%200%20.4.2.6.7.4%201.5.7%202.2%201%20.2%200%20.4-.1.4-.3.3-.7.9-1.2%201.6-1.2s1.4.5%201.6%201.2c.1.3.3.4.5.3.8-.3%201.6-.5%202.2-1%20.3-.1.3-.4.2-.6-.1-.3-.3-.5-.3-.8%200-1%20.8-1.7%201.7-1.7.3%200%20.6.1.8.3.3.1.4%200%20.6-.2.4-.7.7-1.5%201-2.2.2-.1.1-.4-.2-.5zm-8.3%201c-1.5%200-2.7-1.2-2.7-2.7%200-1.5%201.2-2.7%202.7-2.7s2.7%201.2%202.7%202.7c.1%201.5-1.2%202.7-2.7%202.7z'/%3e%3c/svg%3e", k_ = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm14.6%200h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2H25v8.5h.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13.5%2076.4V54.6h6.4l6.4%208%206.4-8h6.4v21.8h-6.4V63.9l-6.4%208-6.4-8v12.5h-6.4zm38.4%200l-9.6-10.6h6.4V54.6h6.4v11.2h6.4l-9.6%2010.6z'/%3e%3c/svg%3e", A_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm8.7%203.6c.4.4%201.1.7%201.7.7.9%200%201.6-.4%201.6-1.6%200-1-.7-1.5-2.3-1.5h-.9l-.7-1.8%202-2.5c.5-.6.9-1%20.9-1s-.4.1-1.1.1h-2.3v-3h7.2V9l-2.6%203.1c2%20.5%203.1%202.1%203.1%204.1%200%202.4-1.4%204.8-4.7%204.8-1.3%200-2.5-.4-3.5-1.3l1.6-2.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", j_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23f60}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM7.1%206.4h3.6l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6H18l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H11l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l.9-14.3zm15.1%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm6.8%201.8l3.7-8.8h4.2v8.1H42v3h-1.2v3.2h-3.2v-3.2h-4.7v-2.3zm4.7-.7v-3.4c0-.8.1-1.3.1-1.3s-.1.6-.3%201.2L36%2014.5h1.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M13%2083.1h46V47.9H13v35.2zm8.9-2.7h-5.5v-3.9h5.5v3.9zm16.9%200h-5.5v-3.9h5.5v3.9zm11.3-30.1h5.5v4h-5.5v-4zm0%2026.1h5.5v3.9h-5.5v-3.9zm-8.5-26.1H47v3.9h-5.5v-3.9zm0%2026.1H47v3.9h-5.5l.1-3.9zm-8.4-26.1h5.5v3.9h-5.5v-3.9zm-.8%209.7l7.2%204.1c1.3.8%201.3%202%200%202.8L32.4%2071c-1.3.8-2.4.1-2.4-1.4v-8.3c0-1.4%201.1-2.1%202.4-1.3zm-7.7-9.7h5.4v3.9h-5.4v-3.9zm0%2026.1h5.4v3.9h-5.4v-3.9zm-8.3-26.1h5.5v4h-5.5v-4z'/%3e%3c/svg%3e", M_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23c11e07}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.2c3.7%200%205.9%202.6%205.9%207.1s-2.2%207.2-5.9%207.2h-4.2V6.4zm4.1%2011.4c1.7%200%202.6-1.5%202.6-4.3s-1-4.2-2.6-4.2h-.8v8.5h.8zm9.1-11.4h7.1v2.9h-3.8v3.1H38v2.9h-3.1v5.4h-3.3V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M33.5%2046.538c-2.3%200-4.1%201.9-4.1%204.1%200%202.8%201.6%206.3%203.2%209.6-1.3%204-2.7%208.3-4.6%2011.9-3.8%201.5-7.2%202.6-9.2%204.3l-.1.1c-.7.8-1.2%201.8-1.2%202.9%200%202.3%201.9%204.1%204.1%204.1%201.1%200%202.2-.4%202.9-1.2%200%200%20.1%200%20.1-.1%201.5-1.8%203.3-5.1%204.9-8%203.6-1.4%207.5-2.9%2011.1-3.8%202.7%202.2%206.6%203.6%209.8%203.6%202.3%200%204.1-1.9%204.1-4.1%200-2.3-1.9-4.1-4.1-4.1-2.6%200-6.3.9-9.1%201.9-2.3-2.2-4.4-4.9-6-7.8%201.1-3.4%202.4-6.7%202.4-9.3-.1-2.3-1.9-4.1-4.2-4.1zm0%202.4c.9%200%201.6.7%201.6%201.6%200%201.2-.7%203.5-1.4%205.9-1-2.4-1.9-4.7-1.9-5.9.1-.8.8-1.6%201.7-1.6zm.7%2014.1c1.2%202%202.7%203.8%204.3%205.4-2.4.7-4.8%201.5-7.2%202.4%201.2-2.5%202.1-5.2%202.9-7.8zm16.2%205.3c.9%200%201.6.7%201.6%201.6%200%20.9-.7%201.6-1.6%201.6-1.9%200-4.5-.8-6.6-2%202.4-.6%205.1-1.2%206.6-1.2zm-24.5%207.3c-1.2%202.1-2.3%204-3.1%205-.3.3-.6.4-1.1.4-.9%200-1.6-.7-1.6-1.6%200-.4.2-.9.4-1.1.9-.8%203-1.7%205.4-2.7z'%20fill='%23c11e07'%20stroke='%23c11e07'%20stroke-width='.75'%20stroke-miterlimit='10'/%3e%3c/svg%3e", N_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm7.9-7h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7zm10-4.1h-3.1V6.4h9.6v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", P_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0,.st2{fill:%23f57e00}.st2{stroke:%23f57e00;stroke-miterlimit:10}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm.5-34.6h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205H9.5v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zm5.7-7h4.1c2.4%200%203.9%202%203.9%204.9%200%202.9-1.6%205-3.9%205h-1.1v4.4h-3V6.4zm3.5%207c.9%200%201.5-.9%201.5-2.1s-.6-2-1.4-2h-.6v4.1h.5zM27%209.3h-2.8V6.4h8.6v2.9H30v11.4h-3V9.3zm9%204.3l-3.1-7.2h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.1-.9-.3-1.7-.3-1.7s-.2.8-.5%201.7l-1%203H33l3-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st2'%20d='M53%2047.7H19c-1.7%200-3.1%201.4-3.1%203.1v21.8c0%201.7%201.4%203.1%203.1%203.1h14.2L31.8%2081h-1.6c-.7%200-1.2.5-1.2%201.2s.5%201.2%201.2%201.2h11.5c.7%200%201.2-.5%201.2-1.2s-.5-1.2-1.2-1.2H40l-1.4-5.4H53c1.7%200%203.1-1.4%203.1-3.1V50.8c0-1.7-1.4-3.1-3.1-3.1zm.3%2025.1H18.7V50.6h34.5l.1%2022.2z'/%3e%3cpath%20class='st2'%20d='M27.6%2063.9h2.8v5.6h-2.8zm4.7-1.8h2.8v7.4h-2.8zm4.6-1.9h2.8v9.3h-2.8zm4.6-1.8h2.8v11.1h-2.8zm-.2-4.1L36.4%2057l-3.6-1.2-6.1%203.3.9%201%205.4-2.8%203.6%201.2%205.6-3.1.9%201%202.1-3.5-4.8.3z'/%3e%3c/svg%3e", F_ = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm.6-34.6h4.5c2.6%200%204.4%202%204.4%204.9s-1.7%205-4.4%205H9.9v4.4H6.6V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.6v4.1h.6zm10%201.4l-3.6-8.4h3.6l1.1%203.4c.3%201%20.5%202.1.5%202.1h.1s.2-1.1.5-2.1l1.1-3.4h3.6l-3.6%208.4v5.9h-3.3v-5.9z'%20fill='%23fff'/%3e%3cpath%20d='M34.5%2083.4c-4.4-.1-7.2-1.5-7.9-3.8l-.1-.3v-4.5c0-5.2%200-5.3.3-6.1.5-1.5%201.7-2.5%203.5-2.9l.4-.1h5.1c3.7%200%205.2%200%205.4-.1%201.1-.2%201.7-.4%202.3-.9.8-.6%201.4-1.6%201.6-2.6.2-.8.2-.7.2-3.5v-2.5h3.6l.4.1c1.9.6%203.3%202.3%203.9%205.1.2%201.1.2%201.1.2%203.8%200%202.6%200%202.6-.2%203.5-.2.8-.4%201.6-.8%202.3-.7%201.4-1.8%202.4-3.1%202.8-.8.3-.1.2-7.5.3h-6.7v1.2h8.8v4.6c-.1.3-.1.6-.4%201s-.8.9-1.1%201.2c-1.2.8-3%201.3-5.4%201.4h-2.5zm6.1-2.8c.8-.1%201.5-1%201.3-1.8-.1-.7-.6-1.2-1.3-1.3-1.1-.1-2%20.8-1.8%201.8.1.8.8%201.3%201.6%201.3h.2zm-19-6.5c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%23fed142'/%3e%3cpath%20d='M21.6%2074.1c-1-.2-2-.8-2.7-1.7-1.3-1.6-2-4.4-1.9-7.8.1-2.1.4-3.7%201.1-5.1.8-1.8%202.1-2.7%203.8-3.1.4-.1.4-.1%206.9-.1h6.6c.1%200%20.1-.1.1-.6v-.6h-8.8v-2.3c0-2.5%200-2.5.2-3%20.8-1.6%203-2.6%206.5-2.9.3%200%20.9-.1%201.6-.1%203.9-.1%206.8.6%208.3%202l.5.5c.2.3.5.8.6%201.3l.1.3v4.8c0%204.4%200%204.8-.1%205.1-.1.4-.3%201-.4%201.3-.6%201.1-1.6%201.8-2.9%202.2-.8.2-.5.2-6.1.3-5.6%200-5.3%200-6.1.2-1.6.4-2.7%201.6-3.1%203.3-.2.8-.2.7-.2%203.5v2.6h-1.7c-1.7%200-2.2%200-2.3-.1zM31%2052.7c.6-.3%201.1-1.1.9-1.7s-.6-1.1-1.1-1.3c-.9-.3-1.9.3-2%201.3-.1.8.3%201.6%201.1%201.8.1.1.3.1.6.1.2-.1.2-.1.5-.2z'%20fill='%233571a3'/%3e%3c/svg%3e", I_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23fea500}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm1.3-24.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8zM16%206.4h3.6l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.7-8.1h3.5l-3.9%2014.3h-3.3L16%206.4zm19.1-.3c1.4%200%202.9.4%203.9%201.3l-1.4%202.8c-.6-.6-1.4-.9-2.3-.9-2.2%200-3.2%201.9-3.2%204.2%200%202.6%201.2%204.3%202.9%204.3.6%200%201.3-.2%201.7-.6v-1.7h-1.5v-2.9h4.3v8.1h-2.6v-.9c-.5.7-1.6%201.2-2.7%201.2-2.8%200-5.6-2.7-5.6-7.3.2-4.5%202.6-7.6%206.5-7.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M27.1%2060.2L18%2079.4l1.7%201.7L31%2069.8c-.4-.9-.3-2%20.5-2.8%201-1%202.5-1%203.5%200s1%202.5%200%203.5c-.7.7-1.9.9-2.8.5L20.9%2082.3l1.7%201.7%2019.2-9.1L46%2063.4%2038.6%2056l-11.5%204.2zm26.3-2.3L44%2048.5c-.8-.8-2-.8-2.8%200L39%2050.7c-.8.8-.8%202%200%202.8l9.4%209.4c.8.8%202%20.8%202.8%200l2.2-2.2c.8-.8.8-2%200-2.8z'/%3e%3c/svg%3e", L_ = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234d1b9b}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm10.5-2.9H23l3.6%2014.3h-3.3l-.6-3h-3l-.6%203h-3.3l3.6-14.3zm2.8%208.6l-.6-2.8c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.8h2zm6.9-8.6h4.5c.6%200%201.3.1%201.9.4%201.4.6%202.4%202.1%202.4%204%200%201.7-.8%203.3-2%204%200%200%20.2.2.5.9l2.3%205h-3.6l-2-4.8h-.8v4.8H29V6.4zM33%2013c.9%200%201.6-.7%201.6-1.9%200-.7-.2-1.2-.6-1.5-.3-.2-.6-.3-.9-.3h-.7V13h.6z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M43.6%2068.3l-7.3-3.4L51%2058l7.3%203.4-7.3%203.5-7.4%203.4zM51%2051.2l-7.3-3.4-7.3%203.4L51%2058.1l7.3-3.4-7.3-3.5zM28.9%2061.4L21.6%2058l-7.3%203.4L29%2068.3l7.3-3.4-7.4-3.5zm0-6.8l7.3-3.4-7.3-3.4-14.7%206.9%207.3%203.4%207.4-3.5zM51%2066.9l-6.6%203-.8.4-.8-.4-6.6-3-6.6%203-.8.4-.8-.4-6.6-3v10.7l14.7%207.7L51%2077.6V66.9z'/%3e%3c/svg%3e", R_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%234065aa}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm9.9%207.4c.6.6%201.4%201.2%202.3%201.2s1.3-.6%201.3-1.2c0-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.5-.4-1.4-.9-2.2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.6-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M37.9%2055.1v-7.6H33c-.1.3-.2.6-.2%201-.1.2-.1.3-.1.5-.5%202.8-2%204.8-4.5%205.9-.7.3-1.4.4-2.1.3v6.1h3.6c.1%208.6.1%2013.1.1%2013.3v.5c.5%203.8%202.4%206%205.9%206.9%201.4.4%202.9.6%204.5.6%202-.1%203.9-.4%205.8-1v-7.2c-1.1.3-2.1.6-3%20.9-1.7.5-3.2.2-4.4-1-.1-.2-.3-.4-.3-.6-.2-.9-.3-1.9-.3-2.8v-9.6h7.8v-6.1h-7.9v-.1z'/%3e%3c/svg%3e", z_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM8.9%209.3H5.7V6.4h9.6v2.9h-3.2v11.4H8.9V9.3zm11.5%204.3L17%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1H24l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203h-3.5l3.3-7.1zm12.1-4.3h-3.1V6.4H39v2.9h-3.2v11.4h-3.3V9.3z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14.6%2077.2h42.8v6.2H14.6zm0-14.8h42.8v6.2H14.6zm0-15h42.8v6.2H14.6z'/%3e%3c/svg%3e", B_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23039}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zM5.6%206.4h3.1l1.1%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.2-8.9h2.9l1.2%208.9c.1.7.1%201.6.1%201.6h.1s0-.9.1-1.6l1.1-8.9h3.1l-2.4%2014.3H14l-1.1-7.2c-.1-.9-.2-1.7-.2-1.7h-.1s0%20.8-.1%201.7l-1%207.2H8L5.6%206.4zm18.3%200h3.4l3.4%2014.3h-3.1l-.6-3h-2.9l-.6%203h-3.1l3.5-14.3zm2.6%208.6l-.5-2.9c-.2-.9-.4-2.5-.4-2.5h-.1s-.2%201.5-.4%202.5l-.5%202.9h1.9zm4.3-8.6h3.4l1.6%208.1c.2.9.3%202.3.3%202.3h.1s.2-1.4.3-2.3l1.6-8.1h3.3l-3.7%2014.3h-3.2L30.8%206.4z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M47%2066c-3.1-1.2-6.7.3-8%203.4-1.2%203.1.3%206.7%203.4%208%20.6.3%201.3.4%202%20.4%203.5.1%206.4-2.6%206.4-6V47.9c-.2%200-.3.1-.5.1-6.8%201.9-13.5%203.9-20.3%205.8-.6.2-.6.5-.6%201v16.8c-.5-.2-.7-.3-1.1-.4-2.5-.9-4.7-.4-6.5%201.4-1.8%201.7-2.3%204.3-1.3%206.6%201.3%203.1%204.9%204.6%208%203.4%202.3-1%203.8-3.2%203.8-5.7V61.3c0-.7.2-.9.9-1.1%203.3-.9%206.6-1.9%2010-2.8L48%2056v10.4c-.5-.2-.7-.3-1-.4z'/%3e%3c/svg%3e", V_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm9.8-7.2h3.3v11.4h4.3v2.9h-7.6V6.4zm11%2010.3c.6.6%201.4%201.2%202.3%201.2.9%200%201.3-.6%201.3-1.2%200-2-4.8-2.1-4.8-6.2%200-2.4%201.7-4.3%204.5-4.3%201.2%200%202.4.3%203.4%201l-1.2%202.9c-.3-.5-1.3-.9-2-.9-.9%200-1.3.6-1.3%201.2%200%202.1%204.8%202%204.8%206.1%200%202.3-1.5%204.4-4.4%204.4-1.4%200-2.9-.5-4-1.4l1.4-2.8z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", H_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%231f7244}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.6-27.4L5.5%206.4h3.3l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9H15l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203H5.6l3-7.1zm8-7.2h3v11.4h3.9v2.9h-6.8V6.4zm9%2010.3c.5.6%201.3%201.2%202.1%201.2s1.2-.6%201.2-1.2c0-2-4.3-2.1-4.3-6.2%200-2.4%201.5-4.3%204.1-4.3%201.1%200%202.2.3%203.1%201l-1.1%202.9c-.4-.4-1.3-.9-1.9-.9-.8%200-1.2.6-1.2%201.2%200%202.1%204.3%202%204.3%206.1%200%202.3-1.3%204.4-4%204.4-1.3%200-2.6-.5-3.6-1.4l1.3-2.8zm10.2-3.1l-3.1-7.2H36l1%202.9c.3.9.5%201.8.5%201.8s.2-.9.5-1.8l1-2.9h3.2l-3.1%207.2%203%207.1h-3.2l-1-3c-.3-.9-.5-1.7-.5-1.7s-.2.8-.5%201.7l-1%203h-3.2l3.1-7.1z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M46.8%2049.2H59v8.1H46.8zm0%2012.5H59v8.1H46.8zm0%2012.4H59v8.1H46.8zm-16.5%200h12.2v8.1H30.3zm-16.5%200H26v8.1H13.8zm27.1-4.8l-8-10.1%207.3-9.2H33l-3.8%205-3.5-5h-7.5l7.4%209.4-7.8%209.9h7.3l4.1-5.5%204.1%205.5z'/%3e%3c/svg%3e", U_ = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23666}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6V41zm3-27.4L5.5%206.4h3.6l1.1%202.9.6%201.8s.2-.9.6-1.8l1.2-2.9h3.6l-3.4%207.2%203.3%207.1h-3.5l-1.1-3c-.4-.9-.6-1.7-.6-1.7s-.2.8-.6%201.7l-1.1%203H5.7L9%2013.6zm10.3-7.2H23l1.3%206c.2.9.4%202.4.4%202.4h.1s.2-1.5.4-2.4l1.3-6h3.6l.9%2014.3h-3l-.4-6.4c-.1-1.1%200-2.4%200-2.4h-.1s-.2%201.5-.4%202.4l-.9%204.1H23l-.9-4.1c-.2-.9-.4-2.4-.4-2.4h-.1s.1%201.3%200%202.4l-.4%206.4h-3l1.1-14.3zm15.1%200h3.3v11.4H42v2.9h-7.6V6.4z'%20fill='%23fff'/%3e%3cpath%20d='M23.5%2076c-.5%200-1.1-.2-1.5-.6L13.6%2067c-.8-.8-.8-2.1%200-3l8.4-8.4c.8-.8%202.1-.8%203%200%20.8.8.8%202.1%200%203l-6.9%206.9%206.9%206.9c.8.8.8%202.1%200%203-.5.4-1%20.6-1.5.6zm25%200c-.5%200-1.1-.2-1.5-.6-.8-.8-.8-2.1%200-3l6.9-6.9-6.9-6.9c-.8-.8-.8-2.1%200-3%20.8-.8%202.1-.8%203%200l8.4%208.4c.8.8.8%202.1%200%203L50%2075.4c-.4.4-.9.6-1.5.6zm-16.7%204.1c-.2%200-.4%200-.7-.1-1.1-.4-1.7-1.5-1.3-2.6l8.4-25.1c.4-1.1%201.5-1.7%202.6-1.3s1.7%201.5%201.3%202.6l-8.4%2025.1c-.2.9-1%201.4-1.9%201.4z'%20fill='%23666'%20stroke='%23666'%20stroke-width='1.5'%20stroke-miterlimit='10'/%3e%3c/svg%3e", W_ = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%23999}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm2.9-26.2L5.5%206.5H8l1.5%204.2c.3.9.5%201.9.5%201.9s.2-1%20.5-1.9L12%206.5h2.5l-3.4%208.3v5.9H8.9v-5.9zm8.4-8.3h2.5l3.5%2014.2H21l-.9-3.7h-3.2l-.8%203.7h-2.3l3.5-14.2zm2.4%208.5l-.8-3.8c-.2-.8-.4-2.2-.4-2.2h-.1s-.2%201.4-.4%202.2l-.8%203.8h2.5zm5.2-8.5h2.5l1.8%206.9c.2.9.4%202.2.4%202.2h.1s.2-1.3.4-2.2l1.8-6.9h2.5l.8%2014.2h-2.1l-.4-7.9c-.1-.9%200-2.2%200-2.2h-.1s-.2%201.4-.4%202.3l-1.4%205.4h-2.2l-1.4-5.4c-.2-.8-.4-2.3-.4-2.3h-.1s.1%201.3%200%202.2l-.4%207.9h-2.1l.7-14.2zm12.3%200h2.3v12h4.3v2.2h-6.5V6.5z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M14%2048.9h37v4.3H14zm7%209.6h37v4.3H21zm-7%209.6h37v4.3H14zm7%209.6h37V82H21z'/%3e%3c/svg%3e", G_ = "data:image/svg+xml,%3csvg%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2072%2096'%3e%3cstyle%3e.st0{fill:%2390c}%3c/style%3e%3cpath%20class='st0'%20d='M0%202v92c0%201.1.9%202%202%202h68c1.1%200%202-.9%202-2V28H50c-1.1%200-2-.9-2-2V0H2C.9%200%200%20.9%200%202z'/%3e%3cpath%20class='st0'%20d='M71.9%2024c-.1-.4-.2-.7-.4-1L52%201.2V24h19.9z'/%3e%3cpath%20d='M6%2041h60v49H6zm0-22.5l4.2-7.9c.5-.9.8-1.3.8-1.3s-.3.1-.8.1h-4v-3h8.7v2.2l-4.2%208c-.5.9-.8%201.3-.8%201.3s.3-.1.8-.1H15v2.9H6v-2.2zM18.1%206.4h3.3v14.3h-3.3V6.4zm7%200h4.5c2.6%200%204.4%202%204.4%204.9%200%202.9-1.7%205-4.4%205h-1.2v4.4h-3.3V6.4zm3.9%207c1%200%201.6-.9%201.6-2.1s-.7-2-1.6-2h-.7v4.1h.7z'%20fill='%23fff'/%3e%3cpath%20class='st0'%20d='M51.1%2057.5h-5.7v-5.7l5.7%205.7zm-15.3-5.7v20.7h15.4V58.9H44v-7.1h-8.2zm2.4-5.4h-17v4h6.7l-4.2%203.3v3.5l6.2-4.8v-1.9h21.6v-1.6l-13.3-2.5zm-8.3%208.7l-6.2%204.8v3.5l6.2-4.8v-3.5zm-6.3%2014.4l6.2-4.8v-3.5L23.6%2066v3.5zm6.3%201.4v-3.5l-6.2%204.8V74h-2.5v4H25v2.8h-2.2c-.4-.7-1.1-1.2-2-1.2-1.3%200-2.3%201-2.3%202.3%200%201.3%201%202.3%202.3%202.3.9%200%201.6-.5%202-1.2H25v2.1h3.4V83h2.2c.4.7%201.1%201.2%202%201.2%201.3%200%202.3-1%202.3-2.3%200-1.3-1-2.3-2.3-2.3-.9%200-1.6.5-2%201.2h-2.2V78h9.7l13.3-2.4V74H25.7l4.2-3.1z'/%3e%3c/svg%3e", K_ = { class: "artifact-card my-2 w-full max-w-md overflow-hidden rounded-2xl border border-[#424242] bg-[#292929]" }, q_ = ["aria-label"], J_ = ["src", "alt"], Y_ = { class: "flex min-w-0 items-center gap-3 p-3" }, X_ = ["src"], Z_ = { class: "min-w-0 flex-1" }, Q_ = ["aria-label"], $_ = {
	key: 1,
	class: "block truncate text-sm font-medium"
}, ev = { class: "block text-xs text-[#b4b4b4]" }, tv = [
	"href",
	"download",
	"aria-label"
], nv = { class: "mb-4 flex items-center gap-3" }, rv = { class: "min-w-0 flex-1 break-words" }, iv = ["href", "download"], av = {
	key: 0,
	role: "status"
}, ov = {
	key: 1,
	role: "alert",
	class: "text-red-200"
}, sv = {
	key: 2,
	class: "max-h-[70dvh] overflow-auto whitespace-pre-wrap break-words text-sm"
}, cv = ["src", "alt"], lv = ["src", "title"], uv = ["src"], dv = ["src"], fv = /* @__PURE__ */ H({
	__name: "ArtifactCard",
	props: {
		file: {},
		profile: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* #__PURE__ */ Object.assign({
			"../../../assets/file-icons/blank.svg": b_,
			"../../../assets/file-icons/css.svg": x_,
			"../../../assets/file-icons/csv.svg": S_,
			"../../../assets/file-icons/doc.svg": C_,
			"../../../assets/file-icons/docx.svg": w_,
			"../../../assets/file-icons/gz.svg": T_,
			"../../../assets/file-icons/html.svg": E_,
			"../../../assets/file-icons/js.svg": D_,
			"../../../assets/file-icons/json.svg": O_,
			"../../../assets/file-icons/md.svg": k_,
			"../../../assets/file-icons/mp3.svg": A_,
			"../../../assets/file-icons/mp4.svg": j_,
			"../../../assets/file-icons/pdf.svg": M_,
			"../../../assets/file-icons/ppt.svg": N_,
			"../../../assets/file-icons/pptx.svg": P_,
			"../../../assets/file-icons/py.svg": F_,
			"../../../assets/file-icons/svg.svg": I_,
			"../../../assets/file-icons/tar.svg": L_,
			"../../../assets/file-icons/ts.svg": R_,
			"../../../assets/file-icons/txt.svg": z_,
			"../../../assets/file-icons/wav.svg": B_,
			"../../../assets/file-icons/xls.svg": V_,
			"../../../assets/file-icons/xlsx.svg": H_,
			"../../../assets/file-icons/xml.svg": U_,
			"../../../assets/file-icons/yaml.svg": W_,
			"../../../assets/file-icons/zip.svg": G_
		}), a = X(() => i[`../../../assets/file-icons/${zp(n.file.name)}.svg`] || i["../../../assets/file-icons/blank.svg"]), o = X(() => Vp(n.file)), s = /* @__PURE__ */ B(), c = /* @__PURE__ */ B(""), l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B(!1), f = /* @__PURE__ */ B(!1), p;
		function m() {
			p?.abort(), c.value.startsWith("blob:") && URL.revokeObjectURL(c.value), c.value = "", l.value = "";
		}
		ur(m);
		async function h() {
			m(), u.value = "", s.value?.showModal(), d.value = !0;
			let e = p = new AbortController();
			try {
				let t = Hp(n.file, n.profile);
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
		let g = /* @__PURE__ */ B("");
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
			let a = Hp(n.file, n.profile);
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
		}, { immediate: !0 }), (t, n) => (W(), G("div", K_, [
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
			}, null, 40, J_)], 8, q_)) : Y("v-if", !0),
			q("div", Y_, [
				o.value !== "image" || f.value ? (W(), G("img", {
					key: 0,
					src: a.value,
					alt: "",
					class: "size-10 shrink-0"
				}, null, 8, X_)) : Y("v-if", !0),
				q("div", Z_, [o.value ? (W(), G("button", {
					key: 0,
					type: "button",
					class: "block w-full truncate text-left text-sm font-medium hover:underline",
					"aria-label": `Preview ${e.file.name}`,
					onClick: h
				}, z(e.file.name), 9, Q_)) : (W(), G("span", $_, z(e.file.name), 1)), q("span", ev, [J(z(V(zp)(e.file.name).toUpperCase() || "FILE"), 1), e.file.size === void 0 ? Y("v-if", !0) : (W(), G(U, { key: 0 }, [J(" · " + z(e.file.size < 1024 ? `${e.file.size} B` : e.file.size < 1048576 ? `${(e.file.size / 1024).toFixed(1)} KB` : `${(e.file.size / 1048576).toFixed(1)} MB`), 1)], 64))])]),
				q("a", {
					href: V(Hp)(e.file, e.profile, !0),
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
				}, [q("path", { d: "M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" })], -1)]], 8, tv)
			]),
			yr(t.$slots, "footer"),
			q("dialog", {
				ref_key: "dialog",
				ref: s,
				class: "artifact-preview fixed m-auto max-h-[90dvh] w-[min(900px,94vw)] overflow-auto rounded-2xl border border-[#424242] bg-[#212121] p-4 text-white backdrop:bg-black/80",
				onClose: m,
				onClick: n[3] ||= (e) => e.target === s.value && s.value?.close()
			}, [q("div", nv, [
				q("h2", rv, z(e.file.name), 1),
				q("a", {
					href: V(Hp)(e.file, e.profile, !0),
					download: e.file.name,
					class: "text-sm underline"
				}, "Download", 8, iv),
				q("button", {
					type: "button",
					autofocus: "",
					class: "size-10 rounded-full hover:bg-[#424242]",
					"aria-label": "Close preview",
					onClick: n[2] ||= (e) => s.value?.close()
				}, " ✕ ")
			]), d.value ? (W(), G("p", av, "Loading preview…")) : u.value ? (W(), G("p", ov, z(u.value), 1)) : o.value === "text" ? (W(), G("pre", sv, z(l.value), 1)) : o.value === "image" && c.value ? (W(), G("img", {
				key: 3,
				src: c.value,
				alt: e.file.name,
				class: "max-h-[70dvh] w-full object-contain"
			}, null, 8, cv)) : o.value === "pdf" && c.value ? (W(), G("iframe", {
				key: 4,
				src: c.value,
				title: e.file.name,
				class: "h-[70dvh] w-full bg-white"
			}, null, 8, lv)) : o.value === "video" && c.value ? (W(), G("video", {
				key: 5,
				src: c.value,
				controls: "",
				class: "max-h-[70dvh] w-full"
			}, null, 8, uv)) : o.value === "audio" && c.value ? (W(), G("audio", {
				key: 6,
				src: c.value,
				controls: "",
				class: "w-full"
			}, null, 8, dv)) : Y("v-if", !0)], 544)
		]));
	}
}), pv = new Ap({
	html: !1,
	breaks: !0,
	linkify: !0
});
pv.renderer.rules.link_open = (e, t, n, r, i) => (e[t].attrSet("target", "_blank"), e[t].attrSet("rel", "noopener noreferrer"), i.renderToken(e, t, n));
function mv(e) {
	return pv.render(e);
}
//#endregion
//#region src/features/chat/components/UserMessage.vue?vue&type=script&setup=true&lang.ts
var hv = { class: "message user self-end max-w-[90%] rounded-3xl bg-[#303030] px-5 py-3 min-[701px]:max-w-[85%]" }, gv = ["innerHTML"], _v = /* @__PURE__ */ H({
	__name: "UserMessage",
	props: {
		message: {},
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = t;
		return (t, r) => (W(), G("article", hv, [q("div", {
			class: "message-content markdown-content break-words text-base leading-7",
			innerHTML: V(mv)(V(qp)(V(al)(e.message.content)).text.replace(/\[screenshot\]/g, "📷 Attached image"))
		}, null, 8, gv), (W(!0), G(U, null, _r(V(Jp)(e.message), (t) => (W(), K(fv, {
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
function vv(e) {
	return !!e.delegated || [
		"clarify",
		"setup_choose",
		"image_generate",
		"manage_catalog",
		"manage_connections",
		"start_chat"
	].includes(e.toolName || "");
}
function yv(e) {
	let t = [];
	for (let n of e) {
		if ((n.kind === "text" || n.kind === "thinking") && !n.content.trim()) continue;
		let e = t.at(-1);
		n.kind === "tool" && !vv(n) ? e?.kind === "tools" ? e.activities.push(n) : t.push({
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
var bv = (e) => [
	"terminal",
	"execute_code",
	"python"
].includes(e.toolName || "");
function xv(e) {
	try {
		return JSON.parse(e.content) || {};
	} catch {
		return {};
	}
}
function Sv(e) {
	let t = xv(e), n = t.command ?? t.code;
	return typeof n == "string" && n.trim().split("\n")[0] || "";
}
function Cv(e, t) {
	if (bv(e)) return `${t ? "Running" : e.state === "completed" ? "Ran" : "Command"} ${Sv(e) || "command"}`;
	let n = (e.toolName || "tool").replace(/_/g, " ");
	return /^(used|using) tool$/i.test(e.title) ? `${t ? "Using" : e.state === "completed" ? "Used" : "Tool:"} ${n}` : e.title || n;
}
var wv = {
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
function Tv(e) {
	let t = e.toolName || "";
	return bv(e) ? "run" : [
		"read_file",
		"list_files",
		"search_files",
		"file_search",
		"search"
	].includes(t) ? "explore" : ["web_search", "session_search_recall"].includes(t) ? "search" : t === "web_extract" ? "read" : t === "browser_navigate" ? "browse" : t.startsWith("browser_") ? "interact" : t === "vision_analyze" ? "analyze" : "other";
}
function Ev(e, t) {
	let n = xv(e);
	if (t === "run") return Sv(e);
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
function Dv(e, t) {
	let n = t ? e.find((e) => !e.complete) ?? e.at(-1) : void 0, r = n ? Tv(n) : void 0, i = [];
	for (let t of Object.keys(wv)) {
		let n = e.filter((e) => Tv(e) === t);
		if (!n.length) continue;
		let a = wv[t], o = t === r, s = n.every((e) => e.state === "completed"), c = n.reduce((e, n) => {
			let r = xv(n).urls;
			return e + (t === "read" && Array.isArray(r) && r.length ? r.length : 1);
		}, 0), l = c === 1 && (o || t !== "run") ? Ev(n[0], t) : "", u = o ? a.present : s ? a.past : "";
		i.push([u, l || `${c} ${a.nouns[c === 1 ? 0 : 1]}`].filter(Boolean).join(" "));
	}
	let a = e.filter((e) => e.state === "failed").length;
	return a && i.push(`${a} failed`), i.map((e, t) => t ? e.charAt(0).toLowerCase() + e.slice(1) : e).join(", ");
}
//#endregion
//#region src/components/ActivityRow.vue?vue&type=script&setup=true&lang.ts
var Ov = ["open"], kv = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, Av = {
	key: 1,
	"aria-hidden": "true"
}, jv = ["title"], Mv = {
	key: 2,
	class: "activity-meta"
}, Nv = {
	key: 3,
	class: "activity-meta"
}, Pv = {
	key: 4,
	class: "activity-meta"
}, Fv = {
	key: 5,
	class: "activity-meta"
}, Iv = {
	key: 6,
	class: "activity-meta"
}, Lv = {
	key: 1,
	class: "ml-6 py-1 text-sm",
	role: "status"
}, Rv = /* @__PURE__ */ H({
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
		].includes(r.value || "")), a = /* @__PURE__ */ B(null), o = X(() => a.value ?? (n.value || t.activity.kind === "thinking" && i.value)), s = /* @__PURE__ */ B(), c = /* @__PURE__ */ B(!0);
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
		let u = /* @__PURE__ */ B(Date.now()), d;
		In(() => n.value && t.activity.startedAt !== void 0, (e) => {
			d && clearInterval(d), e && (d = setInterval(() => {
				u.value = Date.now();
			}, 1e3));
		}, { immediate: !0 }), ur(() => {
			d && clearInterval(d);
		});
		let f = X(() => t.activity.duration ?? (n.value && t.activity.startedAt !== void 0 ? Math.max(0, (u.value - t.activity.startedAt) / 1e3) : void 0)), p = X(() => t.activity.kind === "thinking" ? n.value ? "Thinking…" : "Thought" : Cv(t.activity, n.value));
		function m(e) {
			let t = e.target.open;
			t !== o.value && (a.value = t);
		}
		return (t, c) => (W(), G("details", {
			class: F(["activity", {
				"activity-failed": i.value,
				"activity-active": n.value,
				"activity-thinking": e.activity.kind === "thinking"
			}]),
			open: o.value,
			onToggle: m
		}, [q("summary", { onClick: c[0] ||= Oo((e) => a.value = !o.value, ["prevent"]) }, [
			V(bv)(e.activity) ? (W(), G("span", kv, "›_")) : Y("v-if", !0),
			i.value ? (W(), G("span", Av, "!")) : Y("v-if", !0),
			q("span", {
				class: F(["activity-label", { "working-shimmer": n.value }]),
				title: p.value
			}, z(p.value), 11, jv),
			r.value === "failed" ? (W(), G("span", Mv, " · Failed")) : r.value === "interrupted" ? (W(), G("span", Nv, " · Interrupted")) : r.value === "unknown" ? (W(), G("span", Pv, " · Result unavailable")) : n.value && e.activity.kind === "tool" ? (W(), G("span", Fv, " · " + z(r.value === "pending" ? "Waiting…" : "Running…"), 1)) : Y("v-if", !0),
			f.value === void 0 ? Y("v-if", !0) : (W(), G("span", Iv, " · " + z(f.value.toFixed(1)) + "s", 1)),
			q("span", {
				class: F(["work-chevron", { expanded: o.value }]),
				"aria-hidden": "true"
			}, "›", 2)
		]), e.activity.content || e.activity.output || e.activity.toolName ? (W(), G("pre", {
			key: 0,
			ref_key: "preview",
			ref: s,
			onScroll: l
		}, z([
			e.activity.toolName,
			e.activity.content,
			e.activity.output
		].filter(Boolean).join("\n\n")), 545)) : n.value ? (W(), G("p", Lv, "Working…")) : Y("v-if", !0)], 42, Ov));
	}
}), zv = {
	class: "turn-work",
	"aria-label": "Tool activity"
}, Bv = ["aria-expanded", "aria-controls"], Vv = {
	key: 0,
	class: "activity-command-icon",
	"aria-hidden": "true"
}, Hv = ["title"], Uv = {
	key: 1,
	class: "sr-only",
	role: "status"
}, Wv = ["id"], Gv = /* @__PURE__ */ H({
	__name: "TurnWork",
	props: {
		activities: {},
		working: { type: Boolean },
		approvalPending: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(null), r = Kn(), i = (e) => t.working && !e.complete, a = X(() => t.activities.filter((e) => !i(e))), o = X(() => t.activities.length > 1 && a.value.length > 0), s = X(() => n.value ?? !1), c = (e) => ["interrupted", "unknown"].includes(e.state || "") || !t.working && !e.complete, l = X(() => t.approvalPending ? "Waiting for approval" : t.activities.length ? Dv(a.value, !1) : "Working…");
		return (t, a) => (W(), G("section", zv, [o.value || !e.activities.length ? (W(), G("button", {
			key: 0,
			type: "button",
			class: "work-summary",
			"aria-expanded": s.value,
			"aria-controls": V(r),
			onClick: a[0] ||= (e) => n.value = !s.value
		}, [
			e.activities.some(V(bv)) ? (W(), G("span", Vv, "›_")) : Y("v-if", !0),
			q("span", {
				class: F(["activity-label", { "working-shimmer": e.working && !e.activities.length && !e.approvalPending }]),
				title: l.value
			}, z(l.value), 11, Hv),
			q("span", {
				class: F(["work-chevron", { expanded: s.value }]),
				"aria-hidden": "true"
			}, "›", 2),
			e.approvalPending ? (W(), G("span", Uv, "Waiting for approval")) : Y("v-if", !0)
		], 8, Bv)) : Y("v-if", !0), q("div", {
			id: V(r),
			class: F(["work-timeline", { "work-timeline-single": !o.value }])
		}, [(W(!0), G(U, null, _r(e.activities, (n) => (W(), G(U, { key: n.id }, [An(q("div", { class: F({ "current-activity": i(n) }) }, [qi(Rv, {
			activity: n,
			"turn-complete": !e.working
		}, null, 8, ["activity", "turn-complete"])], 2), [[Ia, !o.value || s.value || i(n) || c(n)]]), yr(t.$slots, "result", { activity: n })], 64))), 128))], 10, Wv)]));
	}
}), Kv = { class: "message assistant w-full self-start" }, qv = ["innerHTML"], Jv = /* @__PURE__ */ H({
	__name: "AssistantTextBlock",
	props: {
		block: {},
		profile: {},
		sessionId: {},
		excludedPaths: {}
	},
	emits: ["imageLoad"],
	setup(e, { emit: t }) {
		let n = e, r = X(() => Gp(n.block.content)), i = t;
		return (t, n) => (W(), G("article", Kv, [
			q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: V(mv)(r.value.text)
			}, null, 8, qv),
			(W(!0), G(U, null, _r(r.value.files.filter((t) => !e.excludedPaths?.includes(t.path)), (t) => (W(), K(fv, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[0] ||= (e) => i("imageLoad")
			}, null, 8, ["file", "profile"]))), 128)),
			(W(!0), G(U, null, _r(e.block.images, (t) => (W(), K(fv, {
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
}), Yv = { class: "assistant-turn grid min-w-0 gap-1" }, Xv = {
	key: 1,
	class: "response-actions flex items-center gap-1 text-[#a3a3a3]"
}, Zv = ["disabled"], Qv = {
	role: "status",
	class: "text-xs"
}, $v = /* @__PURE__ */ H({
	__name: "AssistantTurn",
	props: {
		entry: {},
		branchDisabled: { type: Boolean },
		profile: {},
		sessionId: {}
	},
	emits: ["imageLoad", "branch"],
	setup(e, { emit: t }) {
		let n = e, r = X(() => n.entry.blocks.flatMap((e) => e.kind === "text" ? Gp(e.content).files.map((e) => e.path) : [])), i = X(() => yv(n.entry.blocks)), a = X(() => {
			let e = new Set(r.value), t = /* @__PURE__ */ new Map();
			for (let r of n.entry.blocks) r.kind === "tool" && t.set(r.id, Kp(r).filter((t) => !e.has(t.path) && (e.add(t.path), !0)));
			return t;
		}), o = (e) => a.value.get(e.id) || [], s = t, c = /* @__PURE__ */ B(""), l = X(() => n.entry.blocks.filter((e) => e.kind === "text").map((e) => e.content).join("\n\n"));
		async function u() {
			try {
				await navigator.clipboard.writeText(l.value), c.value = "Copied";
			} catch {
				c.value = "Could not copy. Select the response text to copy it.";
			}
		}
		return (t, n) => (W(), G("div", Yv, [
			(W(!0), G(U, null, _r(i.value, (t) => (W(), G(U, { key: t.id }, [t.kind === "tools" ? (W(), K(Gv, {
				key: 0,
				activities: t.activities,
				working: !!e.entry.working
			}, {
				result: kn(({ activity: t }) => [(W(!0), G(U, null, _r(o(t), (t) => (W(), K(fv, {
					key: t.path,
					file: {
						...t,
						sessionId: e.sessionId
					},
					profile: e.profile,
					onImageLoad: n[0] ||= (e) => s("imageLoad")
				}, null, 8, ["file", "profile"]))), 128))]),
				_: 1
			}, 8, ["activities", "working"])) : (W(), G(U, { key: 1 }, [t.block.kind === "text" ? (W(), K(Jv, {
				key: 0,
				block: t.block,
				profile: e.profile,
				"session-id": e.sessionId,
				onImageLoad: n[1] ||= (e) => s("imageLoad")
			}, null, 8, [
				"block",
				"profile",
				"session-id"
			])) : (W(), G(U, { key: 1 }, [t.block.kind !== "thinking" || t.block.content.trim() ? (W(), K(Rv, {
				key: 0,
				activity: t.block,
				"turn-complete": !e.entry.working
			}, null, 8, ["activity", "turn-complete"])) : Y("v-if", !0), (W(!0), G(U, null, _r(o(t.block), (t) => (W(), K(fv, {
				key: t.path,
				file: {
					...t,
					sessionId: e.sessionId
				},
				profile: e.profile,
				onImageLoad: n[2] ||= (e) => s("imageLoad")
			}, null, 8, ["file", "profile"]))), 128))], 64))], 64))], 64))), 128)),
			e.entry.working && (!e.entry.blocks.length || e.entry.approvalPending) ? (W(), K(Gv, {
				key: 0,
				activities: [],
				working: !0,
				"approval-pending": e.entry.approvalPending
			}, null, 8, ["approval-pending"])) : Y("v-if", !0),
			yr(t.$slots, "request"),
			!e.entry.working && l.value.trim() ? (W(), G("div", Xv, [
				q("button", {
					type: "button",
					"aria-label": "Copy response",
					title: "Copy response",
					class: "flex size-9 items-center justify-center rounded-lg hover:bg-[#303030] focus-visible:outline-2 focus-visible:outline-white",
					onPointerdown: n[3] ||= Oo(() => {}, ["prevent"]),
					onClick: u
				}, [...n[6] ||= [q("svg", {
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
					onPointerdown: n[4] ||= Oo(() => {}, ["prevent"]),
					onClick: n[5] ||= (t) => s("branch", e.entry.responseId)
				}, [...n[7] ||= [Zi("<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" class=\"size-4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"><circle cx=\"6\" cy=\"5\" r=\"2\"></circle><circle cx=\"6\" cy=\"19\" r=\"2\"></circle><circle cx=\"18\" cy=\"5\" r=\"2\"></circle><path d=\"M6 7v10m0-4h5a7 7 0 0 0 7-6\"></path></svg>", 1)]], 40, Zv)) : Y("v-if", !0),
				q("span", Qv, z(c.value), 1)
			])) : Y("v-if", !0)
		]));
	}
}), ey = { class: "relative flex min-h-0 w-full flex-1" }, ty = {
	key: 0,
	class: "text-center text-sm text-[#a3a3a3]"
}, ny = ["disabled"], ry = {
	key: 0,
	role: "status"
}, iy = {
	key: 1,
	class: "muted text-sm text-[#a3a3a3]"
}, ay = {
	key: 2,
	class: "empty-state mx-auto flex w-full max-w-[760px] flex-1 flex-col"
}, oy = {
	key: 0,
	"data-compaction": "",
	class: "flex items-center gap-3 text-xs text-[#a3a3a3]",
	role: "separator",
	"aria-label": "Context compacted"
}, sy = {
	key: 2,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, cy = { class: "system-notices" }, ly = { class: "cursor-pointer select-none" }, uy = { class: "mt-2 whitespace-pre-wrap break-words" }, dy = {
	key: 3,
	class: "assistant-turn",
	"data-chat-message": "",
	tabindex: "-1"
}, fy = {
	key: 4,
	class: "text-sm text-[#a3a3a3]",
	role: "status"
}, py = {
	key: 6,
	class: "message assistant w-full self-start",
	"data-chat-message": "",
	tabindex: "-1"
}, my = ["innerHTML"], hy = /* @__PURE__ */ H({
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
		let r = e, i = n, a = X(() => o.value), o = X(() => fm(r)), s = /* @__PURE__ */ B(), c = /* @__PURE__ */ B(), l = /* @__PURE__ */ B(r.followInitially !== !1), u = /* @__PURE__ */ B(!0), d;
		function f() {
			let e = s.value;
			if (!e || !l.value || document.activeElement !== e && document.activeElement !== d) return;
			let t = c.value?.querySelectorAll("[data-chat-message]"), n = t?.[t.length - 1] || e;
			document.activeElement !== n && n.focus({ preventScroll: !0 }), d = n;
		}
		function p() {
			s.value?.focus({ preventScroll: !0 }), x(), _n(() => {
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
			await _n(), S();
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
		}), (t, n) => (W(), G("div", ey, [q("div", {
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
		}, [q("div", {
			ref_key: "content",
			ref: c,
			class: "flex min-h-full shrink-0 flex-col gap-7"
		}, [
			e.hasEarlier || e.loadingEarlier || e.earlierError ? (W(), G("div", ty, [q("button", {
				type: "button",
				disabled: e.loadingEarlier,
				class: "rounded-full px-4 py-2 hover:bg-[#303030] disabled:opacity-60",
				onClick: y
			}, z(e.loadingEarlier ? "Loading earlier messages…" : "Show earlier messages"), 9, ny), e.earlierError ? (W(), G("p", ry, z(e.earlierError), 1)) : Y("v-if", !0)])) : Y("v-if", !0),
			e.loading ? (W(), G("div", iy, "Loading conversation…")) : !a.value.length && !e.draft && !e.thinking ? (W(), G("div", ay, [...n[1] ||= [q("div", { class: "m-auto text-center" }, [q("h2", { class: "text-2xl font-medium" }, "What can I help with?"), q("p", { class: "mt-3 text-sm text-[#a3a3a3]" }, " Ask Hermes a question or continue a conversation. ")], -1)]])) : Y("v-if", !0),
			(W(!0), G(U, null, _r(o.value, (r) => (W(), G(U, { key: r.key }, [r.kind === "compaction" ? (W(), G("div", oy, [...n[2] ||= [
				q("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1),
				q("span", null, "Context compacted", -1),
				q("span", { class: "h-px flex-1 bg-[#383838]" }, null, -1)
			]])) : r.kind === "user" ? (W(), K(_v, {
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
			])) : r.kind === "status" ? (W(), G("div", sy, [q("details", cy, [q("summary", ly, z(r.text), 1), q("p", uy, z(r.content), 1)])])) : (W(), K($v, {
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
				fn: kn(() => [yr(t.$slots, "request")]),
				key: "0"
			} : void 0]), 1032, [
				"entry",
				"branch-disabled",
				"profile",
				"session-id"
			]))], 64))), 128)),
			e.working && !o.value.some((e) => e.kind === "turn" && e.working) ? (W(), G("div", dy, [qi(Gv, {
				activities: e.progress,
				working: !0,
				"approval-pending": e.approvalPending
			}, null, 8, ["activities", "approval-pending"])])) : Y("v-if", !0),
			e.statusLabel && !e.working ? (W(), G("div", fy, z(e.statusLabel), 1)) : Y("v-if", !0),
			o.value.some((e) => e.kind === "turn" && e.working) ? Y("v-if", !0) : yr(t.$slots, "request", {}, void 0, void 0, 5),
			e.draft && !e.blocks?.length ? (W(), G("article", py, [q("div", {
				class: "message-content markdown-content break-words text-base leading-7",
				innerHTML: V(mv)(e.draft)
			}, null, 8, my)])) : Y("v-if", !0)
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
}), gy = {
	key: 0,
	class: "approval-choices grid grid-cols-1 gap-2 my-3"
}, _y = ["disabled", "onClick"], vy = /* @__PURE__ */ H({
	__name: "ApprovalRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		active: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(!1);
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
		return (t, i) => (W(), G(U, null, [q("p", null, "Approval required" + z(e.request.params.command ? ": " + e.request.params.command : ""), 1), e.active ? (W(), G("div", gy, [(W(!0), G(U, null, _r(e.request.params.choices, (t) => (W(), G("button", {
			key: t,
			class: F(["w-full rounded-xl bg-[#303030] px-[14px] py-[10px] text-left text-base leading-[1.5] text-white whitespace-normal break-words disabled:opacity-55", t === "deny" ? "text-red-500" : ""]),
			disabled: e.disabled || n.value,
			onMousedown: i[0] ||= Oo(() => {}, ["prevent"]),
			onClick: (e) => r(t)
		}, z(t === "once" ? "Allow once" : t === "deny" ? "Deny" : t === "session" ? "Allow for session" : "Always allow"), 43, _y))), 128))])) : Y("v-if", !0)], 64));
	}
}), yy = { class: "clarification-card" }, by = ["disabled"], xy = {
	key: 0,
	class: "clarification-choices"
}, Sy = ["aria-pressed", "onClick"], Cy = { class: "clarification-other" }, wy = ["onUpdate:modelValue", "aria-label"], Ty = ["disabled"], Ey = /*#__PURE__*/ ((e, t) => {
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
		let n = e, r = t, i = /* @__PURE__ */ B({}), a = /* @__PURE__ */ B({});
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
		return (t, n) => (W(), G("div", yy, [(W(!0), G(U, null, _r(e.questions, (t) => (W(), G("form", {
			key: t.qid,
			onSubmit: Oo(c, ["prevent"])
		}, [q("fieldset", { disabled: e.disabled }, [
			q("legend", null, z(t.question), 1),
			t.choices?.length ? (W(), G("div", xy, [(W(!0), G(U, null, _r(t.choices, (e) => (W(), G("button", {
				key: e,
				type: "button",
				"aria-pressed": t.multi_select ? i.value[t.qid]?.includes(e) ?? !1 : void 0,
				onClick: (n) => s(t, e)
			}, z(e), 9, Sy))), 128))])) : Y("v-if", !0),
			q("div", Cy, [An(q("input", {
				"onUpdate:modelValue": (e) => a.value[t.qid] = e,
				placeholder: "Other response",
				"aria-label": t.question + " — Other response"
			}, null, 8, wy), [[vo, a.value[t.qid]]]), q("button", {
				type: "submit",
				disabled: e.disabled || !Object.keys(o()).length
			}, "Send", 8, Ty)])
		], 8, by)], 32))), 128))]));
	}
}), [["__scopeId", "data-v-4672d460"]]), Dy = /* @__PURE__ */ H({
	__name: "ClarificationRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(!1);
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
		return (t, i) => (W(), K(Ey, {
			questions: e.request.params.questions,
			disabled: e.disabled || n.value,
			onAnswer: r
		}, null, 8, ["questions", "disabled"]));
	}
}), Oy = { class: "block my-3" }, ky = ["aria-label", "disabled"], Ay = ["disabled"], jy = /* @__PURE__ */ H({
	__name: "SecretRequest",
	props: {
		request: {},
		disabled: { type: Boolean },
		answer: { type: Function }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(!1);
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
		return (t, a) => (W(), G(U, null, [q("p", null, z(e.request.params.prompt), 1), q("form", { onSubmit: Oo(i, ["prevent"]) }, [q("label", Oy, [J(z(e.request.params.env_var) + " ", 1), An(q("input", {
			"onUpdate:modelValue": a[0] ||= (e) => n.value = e,
			type: "password",
			autocomplete: "off",
			"aria-label": e.request.params.prompt || "Secret",
			disabled: e.disabled || r.value,
			class: "block w-full rounded-lg bg-[#303030] p-2 text-base"
		}, null, 8, ky), [[vo, n.value]])]), q("button", {
			type: "submit",
			disabled: e.disabled || r.value || !n.value,
			class: "rounded-lg bg-[#303030] p-2 text-base"
		}, " Submit secret ", 8, Ay)], 32)], 64));
	}
}), My = { key: 3 }, Ny = /* @__PURE__ */ H({
	__name: "LiveRequest",
	setup(e) {
		let { view: t, scope: n, actions: r } = Lm(), { request: i, reconnect: a, active: o } = t, { profile: s, session: c } = n, l = r.answerFor;
		return (e, t) => V(i) ? (W(), G("div", {
			key: JSON.stringify([
				V(s),
				V(c),
				V(i).id
			]),
			class: "notice px-5 py-3 text-sm",
			role: "status"
		}, [V(i).kind === "approval" ? (W(), K(vy, {
			key: 0,
			request: V(i),
			disabled: V(a),
			active: V(o),
			answer: V(l)(V(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"active",
			"answer"
		])) : V(i).kind === "clarify" ? (W(), K(Dy, {
			key: 1,
			request: V(i),
			disabled: V(a),
			answer: V(l)(V(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : V(i).kind === "secret" ? (W(), K(jy, {
			key: 2,
			request: V(i),
			disabled: V(a),
			answer: V(l)(V(i).id)
		}, null, 8, [
			"request",
			"disabled",
			"answer"
		])) : (W(), G("p", My, "This request cannot be displayed. Open it in Hermes."))])) : Y("v-if", !0);
	}
}), Py = /* @__PURE__ */ H({
	__name: "ChatConversation",
	setup(e) {
		let { view: t, scope: n, actions: r } = Lm(), { profile: i, session: a } = n, { messages: o, loading: s, busy: c, approvalPending: l, status: u } = t, d = /* @__PURE__ */ B(), f = Nn(Rm);
		return sr(() => {
			f && (f.value = d.value);
		}), ur(() => {
			f && f.value === d.value && (f.value = void 0);
		}), (e, n) => (W(), K(hy, {
			ref_key: "transcript",
			ref: d,
			profile: V(i),
			"session-id": V(a),
			"has-earlier": V(t).hasEarlier.value,
			"loading-earlier": V(t).loadingEarlier.value,
			"earlier-error": V(t).earlierError.value,
			onEarlier: V(r).loadEarlier,
			messages: V(o),
			draft: "",
			loading: V(s),
			progress: [],
			thinking: V(c),
			working: V(c) || V(l),
			"approval-pending": V(l),
			home: !V(a),
			"status-label": V(u),
			"branch-disabled": V(t).branchDisabled.value,
			"response-targets": V(t).responseTargets.value,
			onBranch: V(r).branch
		}, {
			request: kn(() => [qi(Ny)]),
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
}), Fy = /* @__PURE__ */ H({
	__name: "HomePage",
	setup(e) {
		return (e, t) => (W(), K(Py));
	}
}), Iy = /* @__PURE__ */ H({
	__name: "ChatPage",
	setup(e) {
		return (e, t) => (W(), K(Py));
	}
}), Ly = {
	"aria-label": "Inbox",
	class: "min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5"
}, Ry = { class: "mx-auto max-w-3xl" }, zy = { class: "mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm" }, By = { class: "flex items-center gap-2" }, Vy = { value: "profile" }, Hy = {
	key: 0,
	role: "alert",
	class: "mb-4 text-red-200"
}, Uy = {
	key: 1,
	role: "status",
	class: "text-[#b4b4b4]"
}, Wy = {
	key: 2,
	class: "text-[#b4b4b4]"
}, Gy = { class: "divide-y divide-[#363636]" }, Ky = ["data-session"], qy = ["disabled", "onClick"], Jy = { class: "min-w-0 truncate font-medium" }, Yy = { class: "line-clamp-1 break-words text-sm text-[#b4b4b4]" }, Xy = { class: "flex items-center gap-2 text-xs text-[#777]" }, Zy = ["datetime"], Qy = ["disabled"], $y = /* @__PURE__ */ H({
	__name: "InboxList",
	props: {
		profile: {},
		revision: {},
		scope: {},
		openItem: { type: Function }
	},
	emits: ["update:scope"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = X({
			get: () => n.scope,
			set: (e) => r("update:scope", e)
		}), a = /* @__PURE__ */ B([]), o = /* @__PURE__ */ B(null), s = /* @__PURE__ */ B(!1), c = /* @__PURE__ */ B(), l = /* @__PURE__ */ B(""), u;
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
		], () => void d(), { immediate: !0 }), ur(() => u?.abort()), (t, n) => (W(), G("section", Ly, [q("div", Ry, [
			q("div", zy, [q("label", By, [n[3] ||= J("View ", -1), An(q("select", {
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				"aria-label": "Inbox view",
				class: "rounded-lg bg-[#303030] px-2 py-1 text-sm"
			}, [n[2] ||= q("option", { value: "all" }, "All profiles", -1), q("option", Vy, "Profile: " + z(e.profile || "default"), 1)], 512), [[xo, i.value]])])]),
			l.value ? (W(), G("p", Hy, z(l.value), 1)) : Y("v-if", !0),
			s.value && !a.value.length ? (W(), G("p", Uy, "Loading inbox…")) : a.value.length ? Y("v-if", !0) : (W(), G("p", Wy, "No unread notifications.")),
			q("ol", Gy, [(W(!0), G(U, null, _r(a.value, (e) => (W(), G("li", {
				key: e.id,
				"data-session": e.session
			}, [q("button", {
				class: "grid w-full gap-1 rounded-lg px-2 py-2 text-left hover:bg-[#292929]",
				disabled: !!c.value,
				onClick: (t) => f(e)
			}, [
				q("p", Jy, z(e.title || "Untitled chat"), 1),
				q("p", Yy, z(e.preview), 1),
				q("div", Xy, [q("span", null, z(e.profile), 1), q("time", { datetime: (/* @__PURE__ */ new Date(e.occurred * 1e3)).toISOString() }, z((/* @__PURE__ */ new Date(e.occurred * 1e3)).toLocaleString()), 9, Zy)])
			], 8, qy)], 8, Ky))), 128))]),
			o.value ? (W(), G("button", {
				key: 3,
				class: "my-5 min-h-11 rounded-full border border-[#555] px-5",
				disabled: s.value,
				onClick: n[1] ||= (e) => d(!0)
			}, " Load More ", 8, Qy)) : Y("v-if", !0)
		])]));
	}
}), eb = /* @__PURE__ */ H({
	__name: "InboxPage",
	setup(e) {
		let { profile: t, inboxRevision: n, openInboxItem: r, refreshInbox: i } = ag(), a = kc(), o = Oc(), s = X({
			get: () => a.query.scope === "profile" ? "profile" : "all",
			set: (e) => {
				o.replace({ query: {
					...a.query,
					scope: e
				} });
			}
		});
		return (e, a) => (W(), K($y, {
			scope: s.value,
			"onUpdate:scope": a[0] ||= (e) => s.value = e,
			profile: V(t),
			revision: V(n),
			"open-item": V(r),
			onRefresh: V(i)
		}, null, 8, [
			"scope",
			"profile",
			"revision",
			"open-item",
			"onRefresh"
		]));
	}
}), tb = {
	class: "min-h-0 flex-1 overflow-y-auto px-5 py-6",
	"aria-label": "Artifacts"
}, nb = { class: "mx-auto max-w-[1100px]" }, rb = { class: "mb-5 flex items-center justify-between" }, ib = ["disabled"], ab = {
	key: 0,
	role: "status",
	class: "text-sm text-[#b4b4b4]"
}, ob = {
	key: 1,
	role: "alert",
	class: "mb-4 text-sm text-red-200"
}, sb = {
	key: 2,
	class: "text-sm text-[#b4b4b4]"
}, cb = { class: "grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-4 [&>.artifact-card]:my-0" }, lb = { class: "border-t border-[#424242] px-3 py-2 text-xs text-[#b4b4b4]" }, ub = {
	key: 0,
	class: "mb-1 block truncate"
}, db = { class: "flex min-w-0 items-center gap-3" }, fb = { class: "shrink-0" }, pb = ["title", "onClick"], mb = ["aria-label", "onClick"], hb = ["disabled"], gb = { key: 0 }, _b = { class: "mb-3 break-words" }, vb = { class: "flex justify-end gap-4" }, yb = ["disabled"], bb = ["disabled"], xb = /* @__PURE__ */ H({
	__name: "ArtifactBrowser",
	props: {
		profile: {},
		sessions: {},
		projects: {},
		project: {}
	},
	emits: ["openSession"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ B([]), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B(), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B();
		In(s, async (e) => {
			await _n(), e ? l.value?.showModal() : l.value?.close();
		});
		let u = /* @__PURE__ */ B(null), d;
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
		return In([() => n.profile, () => n.project?.id], () => f(), { immediate: !0 }), ur(() => d?.abort()), (t, n) => (W(), G("section", tb, [q("div", nb, [
			q("div", rb, [n[5] ||= q("h2", { class: "text-xl font-medium" }, "Artifacts", -1), q("button", {
				class: "text-sm underline",
				disabled: a.value,
				onClick: n[0] ||= (e) => f()
			}, "Refresh", 8, ib)]),
			a.value ? (W(), G("p", ab, "Loading artifacts…")) : Y("v-if", !0),
			o.value ? (W(), G("p", ob, z(o.value), 1)) : Y("v-if", !0),
			!a.value && !i.value.length ? (W(), G("p", sb, "No artifacts found.")) : Y("v-if", !0),
			q("div", cb, [(W(!0), G(U, null, _r(i.value, (t) => (W(), K(fv, {
				key: `${t.sessionId}:${t.path}`,
				file: t,
				profile: e.profile
			}, {
				footer: kn(() => [q("div", lb, [t.projectTitle ? (W(), G("span", ub, z(t.projectTitle), 1)) : Y("v-if", !0), q("div", db, [
					q("span", fb, z(t.direction === "uploaded" ? "Uploaded" : "Generated"), 1),
					q("button", {
						type: "button",
						class: "min-w-0 flex-1 truncate py-2 text-left underline",
						title: t.sessionTitle,
						onClick: (e) => r("openSession", t.sessionId)
					}, z(t.sessionTitle), 9, pb),
					/^(https?:|data:)|^\/api\/plugins\/chathermes\/artifact-images\//.test(t.path) ? Y("v-if", !0) : (W(), G("button", {
						key: 0,
						type: "button",
						class: "shrink-0 py-2 hover:text-white",
						"aria-label": `Delete ${t.name}`,
						onClick: (e) => s.value = t
					}, " Delete ", 8, mb))
				])])]),
				_: 2
			}, 1032, ["file", "profile"]))), 128))]),
			u.value ? (W(), G("button", {
				key: 3,
				type: "button",
				class: "my-6 rounded-full border border-[#555] px-5 py-2 text-sm",
				disabled: a.value,
				onClick: n[1] ||= (e) => f(!0)
			}, z(a.value ? "Loading…" : "Load More"), 9, hb)) : Y("v-if", !0),
			q("dialog", {
				ref_key: "confirmation",
				ref: l,
				class: "fixed m-auto w-[min(380px,94vw)] rounded-2xl bg-[#303030] p-5 text-white backdrop:bg-black/80",
				"aria-label": "Delete artifact",
				onCancel: n[3] ||= (e) => c.value && e.preventDefault(),
				onClose: n[4] ||= (e) => s.value = void 0
			}, [s.value ? (W(), G("div", gb, [
				q("h3", _b, "Delete " + z(s.value.name) + " from Hermes?", 1),
				n[6] ||= q("p", { class: "mb-5 text-sm text-[#b4b4b4]" }, " This removes the server file. References in conversation history remain. ", -1),
				q("div", vb, [q("button", {
					autofocus: "",
					disabled: c.value,
					onClick: n[2] ||= (e) => s.value = void 0
				}, "Cancel", 8, yb), q("button", {
					disabled: c.value,
					onClick: p
				}, z(c.value ? "Deleting…" : "Delete file"), 9, bb)])
			])) : Y("v-if", !0)], 544)
		])]));
	}
}), Sb = /* @__PURE__ */ H({
	__name: "ArtifactsPage",
	setup(e) {
		let { profile: t, projects: n, recentSession: r } = cg();
		return (e, i) => (W(), K(xb, {
			profile: V(t),
			projects: V(n),
			onOpenSession: V(r)
		}, null, 8, [
			"profile",
			"projects",
			"onOpenSession"
		]));
	}
}), Cb = {
	class: "projects-page page-content",
	"aria-label": "Projects"
}, wb = { class: "page-heading" }, Tb = ["disabled"], Eb = {
	key: 0,
	class: "project-muted"
}, Db = { class: "project-actions" }, Ob = ["disabled"], kb = ["disabled"], Ab = {
	key: 2,
	role: "alert",
	class: "project-error"
}, jb = {
	key: 3,
	role: "status",
	class: "project-muted"
}, Mb = {
	key: 4,
	class: "project-muted"
}, Nb = {
	class: "project-list",
	"aria-label": "Project list"
}, Pb = ["aria-label", "onClick"], Fb = /* @__PURE__ */ H({
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
		let n = e, r = t, i = X(() => n.projects.filter((e) => !e.isNoProject && !!e.archived === n.archived)), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(""), s = /* @__PURE__ */ B("");
		function c() {
			o.value.trim() && r("manage", "create", {
				name: o.value.trim(),
				...s.value.trim() ? { primary_path: s.value.trim() } : {}
			});
		}
		return (t, n) => (W(), G("section", Cb, [
			q("div", wb, [n[5] ||= q("h2", null, "Projects", -1), e.archived ? Y("v-if", !0) : (W(), G("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: n[0] ||= (e) => a.value = !a.value
			}, " New project ", 8, Tb))]),
			e.archived ? (W(), G("p", Eb, "Archived projects")) : Y("v-if", !0),
			a.value && !e.archived ? (W(), G("form", {
				key: 1,
				class: "project-form",
				onSubmit: Oo(c, ["prevent"])
			}, [
				q("label", null, [n[6] ||= J("Project name", -1), An(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					required: "",
					maxlength: "160",
					autofocus: ""
				}, null, 512), [[vo, o.value]])]),
				q("label", null, [n[7] ||= J("Folder (optional)", -1), An(q("input", {
					"onUpdate:modelValue": n[2] ||= (e) => s.value = e,
					placeholder: "/path/on/hermes/server"
				}, null, 512), [[vo, s.value]])]),
				q("div", Db, [q("button", {
					class: "project-button",
					disabled: e.busy || e.offline || !o.value.trim()
				}, " Create project", 8, Ob), q("button", {
					type: "button",
					class: "project-button",
					disabled: e.busy,
					onClick: n[3] ||= (e) => a.value = !1
				}, " Cancel ", 8, kb)])
			], 32)) : Y("v-if", !0),
			e.error ? (W(), G("p", Ab, [J(z(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[4] ||= (e) => r("retry")
			}, "Retry Projects")])) : Y("v-if", !0),
			e.loading ? (W(), G("p", jb, "Loading Projects…")) : i.value.length ? Y("v-if", !0) : (W(), G("p", Mb, z(e.archived ? "No archived projects." : "No projects yet."), 1)),
			q("nav", Nb, [(W(!0), G(U, null, _r(i.value, (e) => (W(), G("button", {
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
				q("span", null, [q("strong", null, z(e.label), 1), q("small", null, z(e.archived ? "Archived" : e.isAuto ? "Discovered workspace" : `${e.sessionCount} ${e.sessionCount === 1 ? "chat" : "chats"}`), 1)]),
				n[9] ||= q("span", { "aria-hidden": "true" }, "›", -1)
			], 8, Pb))), 128))])
		]));
	}
}), Ib = /* @__PURE__ */ H({
	__name: "ProjectsPage",
	setup(e) {
		let { projects: t, projectsLoading: n, projectsError: r, manageError: i, projectBusy: a, offline: o, chooseProject: s, loadProjects: c, manageProject: l } = mg(), u = kc(), d = X(() => u.query.archived === "1");
		return (e, u) => (W(), K(Fb, {
			projects: V(t),
			archived: d.value,
			loading: V(n),
			error: V(r) || V(i),
			busy: V(a),
			offline: V(o),
			onSelect: V(s),
			onRetry: V(c),
			onManage: V(l)
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
}), Lb = {
	class: "project-home min-h-0 flex-1 overflow-y-auto px-6 py-6 min-[701px]:px-10",
	"aria-label": "Selected Project"
}, Rb = { class: "project-home-content" }, zb = {
	key: 0,
	role: "status"
}, Bb = {
	key: 1,
	class: "mb-4 text-[#fecaca]",
	role: "alert"
}, Vb = {
	class: "mb-5 flex gap-5 text-sm",
	"aria-label": "Project view"
}, Hb = ["aria-pressed"], Ub = ["aria-pressed"], Wb = /* @__PURE__ */ H({
	__name: "ProjectLayout",
	setup(e) {
		let { selectedProject: t, projectLoading: n, projectError: r, loadProject: i, showProjects: a } = mg(), o = kc(), s = Oc();
		return (e, c) => (W(), G("section", Lb, [q("div", Rb, [
			q("button", {
				class: "project-back",
				onClick: c[0] ||= (e) => V(a)(!!V(t)?.archived)
			}, " ← Projects "),
			V(n) ? (W(), G("p", zb, "Loading Project…")) : Y("v-if", !0),
			V(r) ? (W(), G("p", Bb, [J(z(V(r)) + " ", 1), q("button", {
				class: "underline",
				onClick: c[1] ||= (...e) => V(i) && V(i)(...e)
			}, "Retry Project")])) : Y("v-if", !0),
			V(t) ? (W(), G(U, { key: 2 }, [q("nav", Vb, [q("button", {
				"aria-pressed": V(o).name === "project",
				onClick: c[2] ||= (e) => V(s).push({
					name: "project",
					params: V(o).params,
					query: V(o).query
				})
			}, " Sessions / Chat ", 8, Hb), q("button", {
				"aria-pressed": V(o).name === "project-artifacts",
				onClick: c[3] ||= (e) => V(s).push({
					name: "project-artifacts",
					params: V(o).params,
					query: V(o).query
				})
			}, " Artifacts ", 8, Ub)]), yr(e.$slots, "default")], 64)) : Y("v-if", !0)
		])]));
	}
}), Gb = {
	key: 0,
	class: "project-muted"
}, Kb = { class: "mb-4 break-all text-sm text-[#a3a3a3]" }, qb = {
	key: 1,
	class: "text-sm text-[#b4b4b4]"
}, Jb = {
	class: "project-chat-list",
	"aria-label": "Project chats"
}, Yb = ["aria-label", "onClick"], Xb = { class: "project-chat-title" }, Zb = {
	key: 0,
	class: "project-chat-preview"
}, Qb = /* @__PURE__ */ H({
	__name: "ProjectHomePage",
	setup(e) {
		let { selectedProject: t, visibleSessions: n, chooseSession: r, chooseProject: i } = mg();
		return (e, a) => (W(), K(Wb, null, {
			default: kn(() => [V(t) ? (W(), G(U, { key: 0 }, [
				V(t).archived ? (W(), G("p", Gb, "Archived project")) : Y("v-if", !0),
				q("p", Kb, z(V(ol)(V(t)) ? "Workspace: " + V(ol)(V(t)) : V(t).isNoProject ? "No project workspace" : "No workspace configured"), 1),
				V(n).length ? Y("v-if", !0) : (W(), G("p", qb, "No conversations yet.")),
				q("nav", Jb, [(W(!0), G(U, null, _r(V(n), (e) => (W(), G("button", {
					key: e.id,
					class: "project-chat-row",
					"aria-label": e.title || "Untitled session",
					onClick: (t) => V(r)(e.id)
				}, [q("span", Xb, z(e.title || "Untitled session"), 1), e.preview?.trim() ? (W(), G("span", Zb, z(e.preview), 1)) : Y("v-if", !0)], 8, Yb))), 128))]),
				q("button", {
					class: "project-back mt-5",
					onClick: a[0] ||= (e) => V(i)("")
				}, "Other chats")
			], 64)) : Y("v-if", !0)]),
			_: 1
		}));
	}
}), $b = /* @__PURE__ */ H({
	__name: "ProjectArtifactsPage",
	setup(e) {
		let { selectedProject: t, profile: n, visibleSessions: r, recentSession: i } = mg();
		return (e, a) => (W(), K(Wb, null, {
			default: kn(() => [V(t) ? (W(), K(xb, {
				key: 0,
				project: V(t),
				profile: V(n),
				sessions: V(r),
				onOpenSession: V(i)
			}, null, 8, [
				"project",
				"profile",
				"sessions",
				"onOpenSession"
			])) : Y("v-if", !0)]),
			_: 1
		}));
	}
}), ex = {
	key: 0,
	class: "project-settings"
}, tx = ["disabled"], nx = {
	key: 0,
	class: "project-error",
	role: "alert"
}, rx = {
	key: 1,
	class: "project-muted",
	role: "status"
}, ix = ["disabled"], ax = { class: "project-field-row" }, ox = ["disabled"], sx = {
	key: 2,
	class: "project-muted"
}, cx = { class: "project-folders" }, lx = { class: "folder-path" }, ux = { key: 0 }, dx = { key: 1 }, fx = { class: "project-actions" }, px = ["disabled", "onClick"], mx = [
	"disabled",
	"aria-label",
	"onClick"
], hx = ["disabled"], gx = { class: "project-checkbox" }, _x = ["disabled"], vx = { id: "project-confirm-text" }, yx = { class: "project-actions" }, bx = ["disabled"], xx = ["disabled"], Sx = /* @__PURE__ */ H({
	__name: "ProjectSettings",
	props: {
		project: {},
		busy: { type: Boolean },
		offline: { type: Boolean },
		error: {}
	},
	emits: ["manage"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ B(n.project.label), a = /* @__PURE__ */ B(n.project.description || ""), o = /* @__PURE__ */ B(n.project.icon || ""), s = /* @__PURE__ */ B(n.project.color || ""), c = /* @__PURE__ */ B(n.project.board_slug || ""), l = /* @__PURE__ */ B(""), u = /* @__PURE__ */ B(""), d = /* @__PURE__ */ B(!0), f = /* @__PURE__ */ B(), p = /* @__PURE__ */ B(), m = /* @__PURE__ */ B();
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
			}, await _n(), p.value?.focus();
		}
		function _() {
			f.value = void 0, m.value?.focus();
		}
		function v() {
			let e = f.value;
			e && h(e.action, e.fields);
		}
		return (t, n) => e.project.isAuto ? (W(), G("div", ex, [n[12] ||= q("p", { class: "project-muted" }, " Save this discovered workspace as a project to manage its name and folders. ", -1), q("button", {
			class: "project-button",
			disabled: e.busy || e.offline,
			onClick: n[0] ||= (t) => r("manage", "create", {
				name: e.project.label,
				primary_path: e.project.path || e.project.repos.find((e) => e.path)?.path || ""
			})
		}, " Save project ", 8, tx)])) : e.project.isNoProject ? Y("v-if", !0) : (W(), G("div", {
			key: 1,
			ref_key: "settings",
			ref: m,
			tabindex: "-1",
			class: "project-settings"
		}, [
			e.error ? (W(), G("p", nx, z(e.error), 1)) : Y("v-if", !0),
			e.busy ? (W(), G("p", rx, "Saving project…")) : Y("v-if", !0),
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
				q("label", null, [n[13] ||= J("Project name", -1), An(q("input", {
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					required: "",
					maxlength: "160"
				}, null, 512), [[vo, i.value]])]),
				q("label", null, [n[14] ||= J("Description", -1), An(q("textarea", {
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					maxlength: "4096",
					rows: "2"
				}, null, 512), [[vo, a.value]])]),
				q("div", ax, [q("label", null, [n[15] ||= J("Icon", -1), An(q("input", {
					"onUpdate:modelValue": n[3] ||= (e) => o.value = e,
					maxlength: "64"
				}, null, 512), [[vo, o.value]])]), q("label", null, [n[16] ||= J("Color", -1), An(q("input", {
					"onUpdate:modelValue": n[4] ||= (e) => s.value = e,
					maxlength: "64",
					placeholder: "#94c9a5"
				}, null, 512), [[vo, s.value]])])]),
				q("label", null, [n[17] ||= J("Board slug (optional)", -1), An(q("input", {
					"onUpdate:modelValue": n[5] ||= (e) => c.value = e,
					maxlength: "160"
				}, null, 512), [[vo, c.value]])]),
				q("button", {
					class: "project-button",
					disabled: !i.value.trim()
				}, "Save changes", 8, ox)
			], 8, ix)], 32),
			n[21] ||= q("h3", null, "Folders", -1),
			n[22] ||= q("p", { class: "project-muted" }, " The primary folder is used for new chats. Existing chats keep their workspace. ", -1),
			e.project.folders?.length ? Y("v-if", !0) : (W(), G("p", sx, "No folders configured.")),
			q("ul", cx, [(W(!0), G(U, null, _r(e.project.folders, (t) => (W(), G("li", { key: t.path }, [q("span", lx, [
				J(z(t.label || t.path), 1),
				t.label ? (W(), G("small", ux, z(t.path), 1)) : Y("v-if", !0),
				t.is_primary ? (W(), G("small", dx, "Primary folder")) : Y("v-if", !0)
			]), q("div", fx, [t.is_primary ? Y("v-if", !0) : (W(), G("button", {
				key: 0,
				class: "project-button",
				disabled: e.busy || e.offline,
				onClick: (e) => h("set_primary", { path: t.path })
			}, " Make primary", 8, px)), q("button", {
				class: "project-button",
				disabled: e.busy || e.offline,
				"aria-label": `Remove folder ${t.path}`,
				onClick: (e) => g("remove_folder", { path: t.path }, `Remove ${t.path} from this project? The folder and existing chats will be kept.`)
			}, " Remove ", 8, mx)])]))), 128))]),
			q("form", {
				class: "project-form",
				onSubmit: n[10] ||= Oo((e) => h("add_folder", {
					path: l.value.trim(),
					label: u.value.trim(),
					is_primary: d.value
				}), ["prevent"])
			}, [q("fieldset", { disabled: e.busy || e.offline }, [
				q("label", null, [n[18] ||= J("Folder path", -1), An(q("input", {
					"onUpdate:modelValue": n[7] ||= (e) => l.value = e,
					required: "",
					placeholder: "/path/on/hermes/server",
					maxlength: "4096"
				}, null, 512), [[vo, l.value]])]),
				q("label", null, [n[19] ||= J("Folder label (optional)", -1), An(q("input", {
					"onUpdate:modelValue": n[8] ||= (e) => u.value = e,
					maxlength: "160"
				}, null, 512), [[vo, u.value]])]),
				q("label", gx, [An(q("input", {
					"onUpdate:modelValue": n[9] ||= (e) => d.value = e,
					type: "checkbox"
				}, null, 512), [[yo, d.value]]), n[20] ||= J(" Use as primary folder", -1)]),
				q("button", {
					class: "project-button",
					disabled: !l.value.trim()
				}, "Add folder", 8, _x)
			], 8, hx)], 32),
			f.value ? (W(), G("div", {
				key: 3,
				class: "project-confirmation",
				role: "alertdialog",
				"aria-modal": "false",
				"aria-labelledby": "project-confirm-text",
				onKeydown: n[11] ||= Ao(Oo((t) => !e.busy && _(), ["prevent"]), ["esc"])
			}, [q("p", vx, z(f.value.text), 1), q("div", yx, [q("button", {
				ref_key: "cancelButton",
				ref: p,
				class: "project-button",
				disabled: e.busy,
				onClick: _
			}, " Cancel", 8, bx), q("button", {
				class: "project-button project-danger",
				disabled: e.busy || e.offline,
				onClick: v
			}, " Confirm removal ", 8, xx)])], 32)) : Y("v-if", !0)
		], 512));
	}
}), Cx = {
	class: "page-content project-editor",
	"aria-label": "Edit project"
}, wx = {
	key: 0,
	role: "status"
}, Tx = {
	key: 1,
	role: "alert"
}, Ex = /* @__PURE__ */ H({
	__name: "ProjectSettingsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, projectBusy: i, offline: a, manageError: o, manageProject: s, chooseProject: c, projectLoading: l, projectError: u, loadProject: d } = mg();
		return (e, f) => (W(), G("section", Cx, [
			q("button", {
				class: "project-back",
				onClick: f[0] ||= (e) => V(c)(V(n))
			}, " ← " + z(V(r)?.label || "Project"), 1),
			f[2] ||= q("h2", { class: "text-2xl font-semibold" }, "Edit project", -1),
			V(l) ? (W(), G("p", wx, "Loading Project…")) : Y("v-if", !0),
			V(u) ? (W(), G("p", Tx, [J(z(V(u)) + " ", 1), q("button", { onClick: f[1] ||= (...e) => V(d) && V(d)(...e) }, "Retry Project")])) : Y("v-if", !0),
			V(r) ? (W(), K(Sx, {
				key: JSON.stringify([V(t), V(r).id]),
				project: V(r),
				busy: V(i),
				offline: V(a),
				error: V(o),
				onManage: V(s)
			}, null, 8, [
				"project",
				"busy",
				"offline",
				"error",
				"onManage"
			])) : Y("v-if", !0)
		]));
	}
}), Dx = {
	key: 0,
	role: "status"
}, Ox = {
	key: 1,
	role: "alert",
	class: "project-error"
}, kx = ["disabled"], Ax = { key: 2 }, jx = { class: "project-muted" }, Mx = ["disabled"], Nx = {
	key: 3,
	role: "status",
	class: "project-muted"
}, Px = ["disabled"], Fx = /* @__PURE__ */ H({
	__name: "ProjectInstructions",
	props: {
		profile: {},
		projectId: {},
		offline: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ B(""), r = /* @__PURE__ */ B(""), i = /* @__PURE__ */ B(null), a = /* @__PURE__ */ B(!0), o = /* @__PURE__ */ B(!1), s = /* @__PURE__ */ B(""), c = /* @__PURE__ */ B(!1), l = /* @__PURE__ */ B(!1), u = new AbortController(), d = !0;
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
					d && (s.value = e instanceof Kc && e.status === 409 ? "Instructions changed or the workspace is unavailable. Your draft is kept. Copy it before reloading." : "Could not save instructions. Your draft is kept; try again.");
				} finally {
					d && (o.value = !1);
				}
			}
		}
		return sr(f), ur(() => {
			d = !1, u.abort();
		}), (t, i) => (W(), G("form", {
			class: "project-form instructions-form",
			onSubmit: Oo(p, ["prevent"])
		}, [
			i[3] ||= q("p", { class: "project-muted" }, "Custom instructions guide Hermes when it works in this project.", -1),
			a.value ? (W(), G("p", Dx, "Loading instructions…")) : Y("v-if", !0),
			s.value ? (W(), G("p", Ox, [J(z(s.value) + " ", 1), q("button", {
				type: "button",
				class: "underline",
				disabled: a.value || o.value || e.offline,
				onClick: f
			}, " Reload instructions ", 8, kx)])) : Y("v-if", !0),
			l.value ? (W(), G("label", Ax, [
				i[2] ||= J("Instructions ", -1),
				q("span", jx, z(r.value), 1),
				An(q("textarea", {
					"onUpdate:modelValue": i[0] ||= (e) => n.value = e,
					rows: "14",
					disabled: a.value || o.value,
					onInput: i[1] ||= (e) => c.value = !1
				}, null, 40, Mx), [[vo, n.value]])
			])) : Y("v-if", !0),
			c.value ? (W(), G("p", Nx, "Instructions saved.")) : Y("v-if", !0),
			q("button", {
				class: "project-button justify-self-start",
				disabled: !l.value || a.value || o.value || e.offline
			}, z(o.value ? "Saving…" : "Save instructions"), 9, Px)
		], 32));
	}
}), Ix = {
	class: "page-content project-editor",
	"aria-label": "Edit Instructions"
}, Lx = {
	key: 0,
	role: "status"
}, Rx = {
	key: 1,
	role: "alert"
}, zx = /* @__PURE__ */ H({
	__name: "ProjectInstructionsPage",
	setup(e) {
		let { profile: t, projectId: n, selectedProject: r, offline: i, chooseProject: a, projectLoading: o, projectError: s, loadProject: c } = mg();
		return (e, l) => (W(), G("section", Ix, [
			q("button", {
				class: "project-back",
				onClick: l[0] ||= (e) => V(a)(V(n))
			}, " ← " + z(V(r)?.label || "Project"), 1),
			l[2] ||= q("h2", { class: "text-2xl font-semibold" }, "Edit Instructions", -1),
			V(o) ? (W(), G("p", Lx, "Loading Project…")) : Y("v-if", !0),
			V(s) ? (W(), G("p", Rx, [J(z(V(s)) + " ", 1), q("button", { onClick: l[1] ||= (...e) => V(c) && V(c)(...e) }, "Retry Project")])) : Y("v-if", !0),
			V(r) ? (W(), K(Fx, {
				key: JSON.stringify([V(t), V(r).id]),
				profile: V(t),
				"project-id": V(r).id,
				offline: V(i)
			}, null, 8, [
				"profile",
				"project-id",
				"offline"
			])) : Y("v-if", !0)
		]));
	}
}), Bx = { class: "scheduled-heading" }, Vx = { class: "scheduled-heading-content" }, Hx = { class: "page-heading" }, Ux = {
	key: 0,
	class: "project-muted"
}, Wx = {
	key: 1,
	role: "status",
	class: "project-muted"
}, Gx = {
	key: 2,
	role: "alert",
	class: "project-error"
}, Kx = /* @__PURE__ */ H({
	__name: "ScheduledHeading",
	props: {
		title: {},
		subtitle: {},
		loading: { type: Boolean },
		error: {}
	},
	emits: ["retry"],
	setup(e) {
		return (t, n) => (W(), G("div", Bx, [q("div", Vx, [
			q("div", Hx, [q("h2", null, z(e.title || "Scheduled"), 1)]),
			yr(t.$slots, "default"),
			e.subtitle ? (W(), G("p", Ux, z(e.subtitle), 1)) : Y("v-if", !0),
			e.loading ? (W(), G("p", Wx, "Loading scheduled history…")) : Y("v-if", !0),
			e.error ? (W(), G("p", Gx, [J(z(e.error) + " ", 1), q("button", {
				class: "underline",
				onClick: n[0] ||= (e) => t.$emit("retry")
			}, "Retry")])) : Y("v-if", !0)
		])]));
	}
}), qx = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, Jx = { class: "scheduled-filter" }, Yx = { class: "scheduled-content" }, Xx = {
	key: 0,
	class: "project-muted"
}, Zx = {
	class: "scheduled-list",
	"aria-label": "Scheduled jobs"
}, Qx = ["onClick"], $x = /* @__PURE__ */ H({
	__name: "ScheduledListPage",
	setup(e) {
		let t = kc(), n = Oc(), r = /* @__PURE__ */ B([]), i = X({
			get: () => ["paused", "completed"].includes(String(t.query.status)) ? String(t.query.status) : "active",
			set: (e) => {
				n.replace({ query: {
					...t.query,
					status: e
				} });
			}
		}), a = X(() => r.value.filter((e) => vg(e) === i.value)), { loading: o, error: s, retry: c } = xg(async (e, t) => {
			r.value = [];
			let n = await Q.scheduled(t, e);
			if (!Array.isArray(n.jobs)) throw Error("Invalid jobs");
			e.aborted || (r.value = n.jobs);
		});
		return (e, r) => (W(), G("section", qx, [qi(Kx, {
			loading: V(o),
			error: V(s),
			onRetry: V(c)
		}, {
			default: kn(() => [q("label", Jx, [r[2] ||= J("Show ", -1), An(q("select", {
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
		]), q("div", Yx, [!V(o) && !V(s) && !a.value.length ? (W(), G("p", Xx, " No " + z(i.value) + " scheduled jobs. ", 1)) : Y("v-if", !0), q("nav", Zx, [(W(!0), G(U, null, _r(a.value, (e) => (W(), G("button", {
			key: e.id,
			class: "scheduled-job-row",
			onClick: (r) => V(n).push({
				name: "scheduled-job",
				params: { jobId: e.id },
				query: V(t).query
			})
		}, [q("span", null, [
			q("strong", null, z(e.name || e.id), 1),
			q("small", null, z(e.schedule_display || "Scheduled job"), 1),
			q("small", null, z(V(bg)(e.last_run_at)), 1)
		]), r[3] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, Qx))), 128))])])]));
	}
}), eS = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, tS = { class: "scheduled-content" }, nS = {
	key: 0,
	class: "project-muted"
}, rS = {
	class: "scheduled-list",
	"aria-label": "Job runs"
}, iS = ["onClick"], aS = ["disabled"], oS = /* @__PURE__ */ H({
	__name: "ScheduledJobPage",
	setup(e) {
		let t = kc(), n = Oc(), r = /* @__PURE__ */ B(), i = /* @__PURE__ */ B([]), a = /* @__PURE__ */ B(!1), o = /* @__PURE__ */ B(0), s = !1, { loading: c, error: l, retry: u } = xg(async (e, t, n) => {
			let c = s;
			if (s = !1, !c) {
				r.value = void 0, i.value = [], o.value = 0, a.value = !1;
				let s = await Sg(t, n, e);
				if (e.aborted) return;
				r.value = s;
			}
			let l = await Q.scheduledRuns(t, n, c ? o.value : 0, e);
			e.aborted || (i.value = c ? [...i.value, ...l.runs.filter((e) => !i.value.some((t) => t.id === e.id))] : l.runs, o.value = l.offset + l.runs.length, a.value = l.has_more);
		});
		function d() {
			s = !0, u();
		}
		return (e, o) => (W(), G("section", eS, [qi(Kx, {
			title: r.value?.name || r.value?.id,
			subtitle: "Run history · newest first",
			loading: V(c),
			error: V(l),
			onRetry: V(u)
		}, null, 8, [
			"title",
			"loading",
			"error",
			"onRetry"
		]), q("div", tS, [
			!V(c) && !V(l) && !i.value.length ? (W(), G("p", nS, "No runs yet.")) : Y("v-if", !0),
			q("nav", rS, [(W(!0), G(U, null, _r(i.value, (e) => (W(), G("button", {
				key: e.id,
				onClick: (r) => V(n).push({
					name: "scheduled-run",
					params: {
						jobId: V(t).params.jobId,
						runId: e.id
					},
					query: V(t).query
				})
			}, [q("span", null, [
				q("strong", null, z(V(yg)(e.started_at)), 1),
				q("small", null, z(e.title || "Job run"), 1),
				q("small", null, z(e.end_reason || (e.source === "cron_output" ? "Saved output" : e.ended_at ? "Finished" : "In progress")), 1)
			]), o[0] ||= q("span", { "aria-hidden": "true" }, "›", -1)], 8, iS))), 128))]),
			a.value ? (W(), G("button", {
				key: 1,
				class: "project-button",
				disabled: V(c),
				onClick: d
			}, " Load older runs ", 8, aS)) : Y("v-if", !0)
		])]));
	}
}), sS = {
	class: "scheduled-page min-h-0 flex flex-1 flex-col",
	"aria-label": "Scheduled"
}, cS = {
	key: 1,
	class: "scheduled-content"
}, lS = {
	key: 0,
	class: "project-muted"
}, uS = /* @__PURE__ */ H({
	__name: "ScheduledRunPage",
	setup(e) {
		let t = kc(), n = /* @__PURE__ */ B(), r = /* @__PURE__ */ B(), i = xg(async (e, t, a, o) => {
			n.value = void 0, r.value = void 0;
			let s = await Sg(t, a, e);
			if (e.aborted) return;
			n.value = s;
			let c = await Q.scheduledOutput(t, a, o, e);
			e.aborted || (r.value = c, i.sessionId.value = c.session_id);
		}), { loading: a, error: o, retry: s } = i, c = X(() => Cg(r.value));
		return (e, i) => (W(), G("section", sS, [qi(Kx, {
			title: n.value?.name || n.value?.id,
			subtitle: r.value ? V(yg)(r.value.started_at || 0) : void 0,
			loading: V(a),
			error: V(o),
			onRetry: V(s)
		}, null, 8, [
			"title",
			"subtitle",
			"loading",
			"error",
			"onRetry"
		]), c.value.length ? (W(), K(hy, {
			key: String(V(t).params.runId),
			"follow-initially": !1,
			messages: c.value,
			draft: "",
			loading: !1,
			progress: []
		}, null, 8, ["messages"])) : (W(), G("div", cS, [r.value ? (W(), G("p", lS, "No output was saved for this run.")) : Y("v-if", !0)]))]));
	}
}), dS = {
	class: "settings-page page-content",
	"aria-label": "Settings"
}, fS = { class: "settings-content" }, pS = { class: "settings-heading" }, mS = {
	class: "settings-group",
	"aria-labelledby": "settings-profile-heading"
}, hS = { class: "settings-row" }, gS = ["value"], _S = ["value"], vS = ["value"], yS = {
	class: "settings-group",
	"aria-labelledby": "settings-app-heading"
}, bS = { class: "settings-row settings-notifications" }, xS = { class: "wake-lock-setting" }, SS = { class: "mt-2 flex min-h-[44px] items-center gap-3 text-sm" }, CS = ["checked"], wS = {
	key: 0,
	class: "mt-1 text-sm"
}, TS = {
	class: "settings-group",
	"aria-labelledby": "settings-notifications-heading"
}, ES = { class: "settings-row settings-notifications" }, DS = {
	class: "push-setting",
	"aria-labelledby": "notifications-heading"
}, OS = {
	id: "notifications-heading",
	class: "text-sm font-medium text-white"
}, kS = ["disabled"], AS = ["disabled"], jS = {
	key: 1,
	class: "mt-1 text-sm text-[#dcae6e]",
	role: "status"
}, MS = {
	key: 2,
	class: "mt-1 text-sm"
}, NS = {
	key: 3,
	class: "mt-1 text-sm",
	role: "status"
}, PS = {
	key: 4,
	class: "mt-1 text-sm"
}, FS = {
	key: 5,
	class: "mt-1 text-sm"
}, IS = {
	key: 6,
	class: "mt-1 text-sm"
}, LS = /* @__PURE__ */ H({
	__name: "SettingsPanel",
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
		let n = t, r = /* @__PURE__ */ B();
		return sr(() => r.value?.focus()), (t, i) => (W(), G("section", dS, [q("div", fS, [
			q("div", pS, [q("h2", {
				ref_key: "heading",
				ref: r,
				tabindex: "-1",
				class: "text-2xl font-semibold"
			}, "Settings", 512), q("button", {
				class: "settings-close",
				"aria-label": "Close settings",
				onClick: i[0] ||= (e) => n("close")
			}, "×")]),
			i[11] ||= q("h3", {
				id: "settings-profile-heading",
				class: "settings-section-title"
			}, "Profile", -1),
			q("div", mS, [q("div", hS, [i[6] ||= Zi("<svg class=\"settings-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><circle cx=\"12\" cy=\"9\" r=\"3\"></circle><path d=\"M6 19c0-6 12-6 12 0\"></path></svg><label for=\"settings-profile\">Active profile</label>", 2), q("select", {
				id: "settings-profile",
				value: e.profile,
				onChange: i[1] ||= (e) => n("profile", e.target.value)
			}, [
				i[5] ||= q("option", { value: "" }, "Default profile", -1),
				e.profile && !e.profiles.some((t) => t.name === e.profile) ? (W(), G("option", {
					key: 0,
					value: e.profile
				}, z(e.profile), 9, _S)) : Y("v-if", !0),
				(W(!0), G(U, null, _r(e.profiles, (e) => (W(), G("option", {
					key: e.name,
					value: e.name
				}, z(e.name), 9, vS))), 128))
			], 40, gS)])]),
			i[12] ||= q("h3", {
				id: "settings-app-heading",
				class: "settings-section-title"
			}, "Global settings", -1),
			q("div", yS, [q("div", bS, [i[9] ||= q("svg", {
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
			}), q("path", { d: "M9 17h6" })], -1), q("div", xS, [
				i[8] ||= q("h3", {
					id: "wake-lock-heading",
					class: "text-sm font-medium text-white"
				}, "Keep Screen Awake", -1),
				q("label", SS, [q("input", {
					type: "checkbox",
					"aria-labelledby": "wake-lock-heading",
					checked: e.keepScreenAwake,
					onChange: i[2] ||= (e) => n("toggleWakeLock", e.target.checked)
				}, null, 40, CS), i[7] ||= J(" Prevent the display from sleeping while ChatHermes is visible. ", -1)]),
				e.wakeLockAvailable ? Y("v-if", !0) : (W(), G("p", wS, " Screen wake lock is unavailable in this browser. "))
			])])]),
			i[13] ||= q("h3", {
				id: "settings-notifications-heading",
				class: "settings-section-title"
			}, "Notifications", -1),
			q("div", TS, [q("div", ES, [i[10] ||= q("svg", {
				class: "settings-icon",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "1.5",
				"aria-hidden": "true"
			}, [q("path", { d: "M5 16h14l-2-3V9a5 5 0 0 0-10 0v4l-2 3Z" }), q("path", { d: "M10 19a2 2 0 0 0 4 0" })], -1), q("div", DS, [
				q("h3", OS, " Notifications for " + z(e.profile || "default"), 1),
				q("button", {
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.supported || !e.pushState.subscribed && !e.pushState.available,
					onClick: i[3] ||= (e) => n("togglePush")
				}, z(e.pushLoading ? "Loading…" : e.pushBusy ? "Updating…" : e.pushState.subscribed ? "Disable notifications" : "Enable notifications"), 9, kS),
				e.pushState.subscribed ? (W(), G("button", {
					key: 0,
					class: "mt-2 min-h-[44px] rounded-lg bg-[#303030] px-3 text-sm text-white disabled:opacity-55",
					disabled: e.pushBusy || e.pushLoading || !e.pushState.available,
					onClick: i[4] ||= (e) => n("testPush")
				}, " Send test ", 8, AS)) : Y("v-if", !0),
				e.pushState.error || e.pushMessage ? (W(), G("p", jS, z(e.pushMessage || e.pushState.error), 1)) : e.pushState.subscribed ? (W(), G("p", MS, " Notifications enabled for " + z(e.profile || "default") + " on this device. ", 1)) : e.pushLoading ? (W(), G("p", NS, " Loading profile notification status… ")) : e.pushState.supported ? e.pushState.permission === "denied" ? (W(), G("p", FS, " Allow notifications in browser settings to enable them. ")) : (W(), G("p", IS, " Notifications disabled for " + z(e.profile || "default") + " on this device. ", 1)) : (W(), G("p", PS, " Install ChatHermes on a secure HTTPS origin to enable notifications. "))
			])])])
		])]));
	}
}), RS = /* @__PURE__ */ H({
	__name: "SettingsPage",
	setup(e) {
		let { profile: t, profiles: n, pushState: r, pushBusy: i, pushLoading: a, pushMessage: o, wakeLock: s, chooseProfile: c, togglePush: l, testPush: u, closeSettings: d } = dg();
		return (e, f) => (W(), K(LS, {
			profile: V(t),
			profiles: V(n),
			"push-state": V(r),
			"push-busy": V(i),
			"push-loading": V(a),
			"push-message": V(o),
			"keep-screen-awake": V(s).enabled.value,
			"wake-lock-available": V(s).available.value,
			onProfile: V(c),
			onTogglePush: V(l),
			onTestPush: V(u),
			onToggleWakeLock: V(s).setEnabled,
			onClose: V(d)
		}, null, 8, [
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
}), zS = "chathermes";
function BS() {
	let e = [], t = !1, n = !1, r = () => ml(window.location.href) || "/", i = r(), a = () => window.history.state?.[zS], o = a()?.position ?? 0, s = a()?.state ?? {}, c = () => {
		let e = new URL(window.location.href);
		return e.pathname + e.search;
	}, l = (e, t, r) => {
		if (n || window.location.pathname !== "/chathermes") return;
		let a = { ...window.history.state };
		r || (typeof a.idx == "number" && a.idx++, typeof a.key == "string" && (a.key = Math.random().toString(36).slice(2, 10)), o++), s = {
			...t,
			position: o
		}, a[zS] = {
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
var VS = ["disabled"], HS = ["disabled"], US = ["disabled"], WS = ["disabled"], GS = ["disabled"], KS = /* @__PURE__ */ H({
	__name: "ProjectActions",
	setup(e) {
		let { selectedProject: t, profile: n, projectId: r, projectBusy: i, offline: a, manageProject: o, createSession: s, creating: c, projectConfirmation: l } = mg(), u = kc(), d = Oc();
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
		return (e, n) => V(t) && !V(t).isNoProject ? (W(), G(U, { key: 0 }, [
			V(t) && !V(t).isNoProject ? (W(), G("button", {
				key: 0,
				class: "rounded-lg px-3 py-2 text-left text-sm hover:bg-[#424242]",
				role: "menuitem",
				disabled: V(a) || V(c) || !V(t) || V(t).archived || !V(ol)(V(t)),
				onClick: n[0] ||= (e) => V(s)()
			}, " New Project Chat ", 8, VS)) : Y("v-if", !0),
			q("button", {
				role: "menuitem",
				onClick: n[1] ||= (e) => f("edit")
			}, "Edit project"),
			q("button", {
				role: "menuitem",
				disabled: V(a) || !V(ol)(V(t)),
				onClick: n[2] ||= (e) => f("instructions")
			}, " Edit Instructions ", 8, HS),
			V(t).isAuto ? Y("v-if", !0) : (W(), G(U, { key: 1 }, [V(t).archived ? (W(), G("button", {
				key: 0,
				role: "menuitem",
				disabled: V(i) || V(a),
				onClick: n[3] ||= (e) => V(o)("archive", {
					id: V(r),
					restore: !0
				})
			}, " Restore project ", 8, US)) : (W(), G("button", {
				key: 1,
				role: "menuitem",
				disabled: V(i) || V(a),
				onClick: n[4] ||= (e) => p("archive")
			}, " Archive project ", 8, WS)), q("button", {
				class: "project-danger",
				role: "menuitem",
				disabled: V(i) || V(a),
				onClick: n[5] ||= (e) => p("delete")
			}, " Delete project ", 8, GS)], 64))
		], 64)) : Y("v-if", !0);
	}
}), qS = ["aria-checked"], JS = ["aria-checked"], YS = /* @__PURE__ */ H({
	__name: "ProjectsActions",
	setup(e) {
		let t = kc(), n = X(() => t.query.archived === "1"), { showProjects: r } = mg();
		return (e, t) => (W(), G(U, null, [q("button", {
			role: "menuitemradio",
			"aria-checked": !n.value,
			onClick: t[0] ||= (e) => V(r)(!1)
		}, " Active projects", 8, qS), q("button", {
			role: "menuitemradio",
			"aria-checked": n.value,
			onClick: t[1] ||= (e) => V(r)(!0)
		}, " Archived projects ", 8, JS)], 64));
	}
}), XS = ["disabled"], ZS = ["disabled"], QS = /* @__PURE__ */ H({
	__name: "ScheduledActions",
	setup(e) {
		let { current: t, offline: n, creating: r, recentSession: i } = _g();
		return (e, a) => (W(), G(U, null, [q("button", {
			role: "menuitem",
			"data-test": "refresh-scheduled",
			disabled: !V(t) || V(t).loading.value,
			onClick: a[0] ||= (e) => V(t)?.retry()
		}, " Refresh", 8, XS), V(t)?.sessionId.value ? (W(), G("button", {
			key: 0,
			role: "menuitem",
			"data-test": "resume-scheduled-session",
			disabled: V(n) || V(r) || V(t).loading.value,
			onClick: a[1] ||= (e) => V(i)(V(t).sessionId.value)
		}, " Resume Session ", 8, ZS)) : Y("v-if", !0)], 64));
	}
});
//#endregion
//#region src/router/index.ts
function $S(e = BS(), t) {
	let n = Dc({
		history: e,
		routes: [
			{
				path: "/",
				name: "home",
				components: { default: Fy },
				meta: { chat: !0 }
			},
			{
				path: "/chat/:sessionId",
				name: "chat",
				components: {
					default: Iy,
					actions: KS,
					dialogs: y_
				},
				meta: { chat: !0 }
			},
			{
				path: "/inbox",
				name: "inbox",
				components: {
					default: eb,
					actions: p_
				},
				meta: { title: "Inbox" }
			},
			{
				path: "/artifacts",
				name: "artifacts",
				components: { default: Sb },
				meta: {
					title: "Artifacts",
					hideComposer: !0
				}
			},
			{
				path: "/projects",
				name: "projects",
				components: {
					default: Ib,
					actions: YS
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
					default: Qb,
					actions: KS,
					dialogs: y_
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
					default: $b,
					actions: KS,
					dialogs: y_
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
					default: Ex,
					actions: KS,
					dialogs: y_
				},
				meta: { section: "projects" }
			},
			{
				path: "/projects/:projectId/instructions",
				name: "project-instructions",
				components: {
					default: zx,
					actions: KS,
					dialogs: y_
				},
				meta: { section: "projects" }
			},
			{
				path: "/scheduled",
				name: "scheduled",
				components: {
					default: $x,
					actions: QS
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
					default: oS,
					actions: QS
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
					default: uS,
					actions: QS
				},
				meta: {
					title: "Scheduled",
					section: "scheduled"
				}
			},
			{
				path: "/settings",
				name: "settings",
				components: { default: RS },
				meta: {
					title: "Settings",
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
		let t = dl(e.query.profile);
		if (e.query.profile && typeof e.query.profile != "string" || t && !ul.test(t) || Object.entries(e.params).some(([e, t]) => e === "projectId" ? !ll(t) : typeof t != "string" || !cl.test(t)) || e.query.project && !ll(e.query.project) || [e.query.session].some((e) => e && (typeof e != "string" || !cl.test(e)))) return { name: "home" };
		if (e.name === "settings" && e.query.return_to && fl(e.query.return_to) !== e.query.return_to) return {
			name: "settings",
			query: {
				...e.query,
				return_to: "/"
			},
			replace: !0
		};
	});
	let r = t && ml(t);
	return r && e.replace(r), n;
}
//#endregion
//#region src/main.ts
function eC(e) {
	return Po(f_).use($S(void 0, e));
}
//#endregion
export { f_ as App, eC as createChatHermesApp };
