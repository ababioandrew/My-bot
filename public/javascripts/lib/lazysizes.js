/*! lazysizes - v2.0.0 */
!(function (a, b) {
    var c = b(a, a.document);
    (a.lazySizes = c), "object" == typeof module && module.exports && (module.exports = c);
})(window, function (a, b) {
    "use strict";
    if (b.getElementsByClassName) {
        var c,
            d = b.documentElement,
            e = a.Date,
            f = a.HTMLPictureElement,
            g = "addEventListener",
            h = "getAttribute",
            i = a[g],
            j = a.setTimeout,
            k = a.requestAnimationFrame || j,
            l = a.requestIdleCallback,
            m = /^picture$/i,
            n = ["load", "error", "lazyincluded", "_lazyloaded"],
            o = {},
            p = Array.prototype.forEach,
            q = function (a, b) {
                return o[b] || (o[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), o[b].test(a[h]("class") || "") && o[b];
            },
            r = function (a, b) {
                q(a, b) || a.setAttribute("class", (a[h]("class") || "").trim() + " " + b);
            },
            s = function (a, b) {
                var c;
                (c = q(a, b)) && a.setAttribute("class", (a[h]("class") || "").replace(c, " "));
            },
            t = function (a, b, c) {
                var d = c ? g : "removeEventListener";
                c && t(a, b),
                    n.forEach(function (c) {
                        a[d](c, b);
                    });
            },
            u = function (a, c, d, e, f) {
                var g = b.createEvent("CustomEvent");
                return g.initCustomEvent(c, !e, !f, d || {}), a.dispatchEvent(g), g;
            },
            v = function (b, d) {
                var e;
                !f && (e = a.picturefill || c.pf) ? e({ reevaluate: !0, elements: [b] }) : d && d.src && (b.src = d.src);
            },
            w = function (a, b) {
                return (getComputedStyle(a, null) || {})[b];
            },
            x = function (a, b, d) {
                for (d = d || a.offsetWidth; d < c.minSize && b && !a._lazysizesWidth; ) (d = b.offsetWidth), (b = b.parentNode);
                return d;
            },
            y = (function () {
                var a,
                    c,
                    d = [],
                    e = function () {
                        var b;
                        for (a = !0, c = !1; d.length; ) (b = d.shift()), b[0].apply(b[1], b[2]);
                        a = !1;
                    };
                return function (f) {
                    a ? f.apply(this, arguments) : (d.push([f, this, arguments]), c || ((c = !0), (b.hidden ? j : k)(e)));
                };
            })(),
            z = function (a, b) {
                return b
                    ? function () {
                          y(a);
                      }
                    : function () {
                          var b = this,
                              c = arguments;
                          y(function () {
                              a.apply(b, c);
                          });
                      };
            },
            A = function (a) {
                var b,
                    c = 0,
                    d = 125,
                    f = 999,
                    g = f,
                    h = function () {
                        (b = !1), (c = e.now()), a();
                    },
                    i = l
                        ? function () {
                              l(h, { timeout: g }), g !== f && (g = f);
                          }
                        : z(function () {
                              j(h);
                          }, !0);
                return function (a) {
                    var f;
                    (a = a === !0) && (g = 66), b || ((b = !0), (f = d - (e.now() - c)), 0 > f && (f = 0), a || (9 > f && l) ? i() : j(i, f));
                };
            },
            B = function (a) {
                var b,
                    c,
                    d = 99,
                    f = function () {
                        (b = null), a();
                    },
                    g = function () {
                        var a = e.now() - c;
                        d > a ? j(g, d - a) : (l || f)(f);
                    };
                return function () {
                    (c = e.now()), b || (b = j(g, d));
                };
            },
            C = (function () {
                var f,
                    k,
                    l,
                    n,
                    o,
                    x,
                    C,
                    E,
                    F,
                    G,
                    H,
                    I,
                    J,
                    K,
                    L,
                    M = /^img$/i,
                    N = /^iframe$/i,
                    O = "onscroll" in a && !/glebot/.test(navigator.userAgent),
                    P = 0,
                    Q = 0,
                    R = 0,
                    S = 0,
                    T = function (a) {
                        R--, a && a.target && t(a.target, T), (!a || 0 > R || !a.target) && (R = 0);
                    },
                    U = function (a, c) {
                        var e,
                            f = a,
                            g = "hidden" == w(b.body, "visibility") || "hidden" != w(a, "visibility");
                        for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != d; )
                            (g = (w(f, "opacity") || 1) > 0), g && "visible" != w(f, "overflow") && ((e = f.getBoundingClientRect()), (g = H > e.left && G < e.right && I > e.top - 1 && F < e.bottom + 1));
                        return g;
                    },
                    V = function () {
                        var a, b, e, g, i, j, m, n, p;
                        if ((o = c.loadMode) && 8 > R && (a = f.length)) {
                            (b = 0),
                                S++,
                                null == K && ("expand" in c || (c.expand = d.clientHeight > 500 ? 500 : 400), (J = c.expand), (K = J * c.expFactor)),
                                K > Q && 1 > R && S > 3 && o > 2 ? ((Q = K), (S = 0)) : (Q = o > 1 && S > 2 && 6 > R ? J : P);
                            for (; a > b; b++)
                                if (f[b] && !f[b]._lazyRace)
                                    if (O)
                                        if (
                                            (((n = f[b][h]("data-expand")) && (j = 1 * n)) || (j = Q),
                                            p !== j && ((C = innerWidth + j * L), (E = innerHeight + j), (m = -1 * j), (p = j)),
                                            (e = f[b].getBoundingClientRect()),
                                            (I = e.bottom) >= m && (F = e.top) <= E && (H = e.right) >= m * L && (G = e.left) <= C && (I || H || G || F) && ((l && 3 > R && !n && (3 > o || 4 > S)) || U(f[b], j)))
                                        ) {
                                            if ((ba(f[b]), (i = !0), R > 9)) break;
                                        } else !i && l && !g && 4 > R && 4 > S && o > 2 && (k[0] || c.preloadAfterLoad) && (k[0] || (!n && (I || H || G || F || "auto" != f[b][h](c.sizesAttr)))) && (g = k[0] || f[b]);
                                    else ba(f[b]);
                            g && !i && ba(g);
                        }
                    },
                    W = A(V),
                    X = function (a) {
                        r(a.target, c.loadedClass), s(a.target, c.loadingClass), t(a.target, Z);
                    },
                    Y = z(X),
                    Z = function (a) {
                        Y({ target: a.target });
                    },
                    $ = function (a, b) {
                        try {
                            a.contentWindow.location.replace(b);
                        } catch (c) {
                            a.src = b;
                        }
                    },
                    _ = function (a) {
                        var b,
                            d,
                            e = a[h](c.srcsetAttr);
                        (b = c.customMedia[a[h]("data-media") || a[h]("media")]) && a.setAttribute("media", b), e && a.setAttribute("srcset", e), b && ((d = a.parentNode), d.insertBefore(a.cloneNode(), a), d.removeChild(a));
                    },
                    aa = z(function (a, b, d, e, f) {
                        var g, i, k, l, o, q;
                        (o = u(a, "lazybeforeunveil", b)).defaultPrevented ||
                            (e && (d ? r(a, c.autosizesClass) : a.setAttribute("sizes", e)),
                            (i = a[h](c.srcsetAttr)),
                            (g = a[h](c.srcAttr)),
                            f && ((k = a.parentNode), (l = k && m.test(k.nodeName || ""))),
                            (q = b.firesLoad || ("src" in a && (i || g || l))),
                            (o = { target: a }),
                            q && (t(a, T, !0), clearTimeout(n), (n = j(T, 2500)), r(a, c.loadingClass), t(a, Z, !0)),
                            l && p.call(k.getElementsByTagName("source"), _),
                            i ? a.setAttribute("srcset", i) : g && !l && (N.test(a.nodeName) ? $(a, g) : (a.src = g)),
                            (i || l) && v(a, { src: g })),
                            y(function () {
                                a._lazyRace && delete a._lazyRace, s(a, c.lazyClass), (!q || a.complete) && (q ? T(o) : R--, X(o));
                            });
                    }),
                    ba = function (a) {
                        var b,
                            d = M.test(a.nodeName),
                            e = d && (a[h](c.sizesAttr) || a[h]("sizes")),
                            f = "auto" == e;
                        ((!f && l) || !d || (!a.src && !a.srcset) || a.complete || q(a, c.errorClass)) && ((b = u(a, "lazyunveilread").detail), f && D.updateElem(a, !0, a.offsetWidth), (a._lazyRace = !0), R++, aa(a, b, f, e, d));
                    },
                    ca = function () {
                        if (!l) {
                            if (e.now() - x < 999) return void j(ca, 999);
                            var a = B(function () {
                                (c.loadMode = 3), W();
                            });
                            (l = !0),
                                (c.loadMode = 3),
                                W(),
                                i(
                                    "scroll",
                                    function () {
                                        3 == c.loadMode && (c.loadMode = 2), a();
                                    },
                                    !0
                                );
                        }
                    };
                return {
                    _: function () {
                        (x = e.now()),
                            (f = b.getElementsByClassName(c.lazyClass)),
                            (k = b.getElementsByClassName(c.lazyClass + " " + c.preloadClass)),
                            (L = c.hFac),
                            i("scroll", W, !0),
                            i("resize", W, !0),
                            a.MutationObserver ? new MutationObserver(W).observe(d, { childList: !0, subtree: !0, attributes: !0 }) : (d[g]("DOMNodeInserted", W, !0), d[g]("DOMAttrModified", W, !0), setInterval(W, 999)),
                            i("hashchange", W, !0),
                            ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (a) {
                                b[g](a, W, !0);
                            }),
                            /d$|^c/.test(b.readyState) ? ca() : (i("load", ca), b[g]("DOMContentLoaded", W), j(ca, 2e4)),
                            W(f.length > 0);
                    },
                    checkElems: W,
                    unveil: ba,
                };
            })(),
            D = (function () {
                var a,
                    d = z(function (a, b, c, d) {
                        var e, f, g;
                        if (((a._lazysizesWidth = d), (d += "px"), a.setAttribute("sizes", d), m.test(b.nodeName || ""))) for (e = b.getElementsByTagName("source"), f = 0, g = e.length; g > f; f++) e[f].setAttribute("sizes", d);
                        c.detail.dataAttr || v(a, c.detail);
                    }),
                    e = function (a, b, c) {
                        var e,
                            f = a.parentNode;
                        f && ((c = x(a, f, c)), (e = u(a, "lazybeforesizes", { width: c, dataAttr: !!b })), e.defaultPrevented || ((c = e.detail.width), c && c !== a._lazysizesWidth && d(a, f, e, c)));
                    },
                    f = function () {
                        var b,
                            c = a.length;
                        if (c) for (b = 0; c > b; b++) e(a[b]);
                    },
                    g = B(f);
                return {
                    _: function () {
                        (a = b.getElementsByClassName(c.autosizesClass)), i("resize", g);
                    },
                    checkElems: g,
                    updateElem: e,
                };
            })(),
            E = function () {
                E.i || ((E.i = !0), D._(), C._());
            };
        return (
            (function () {
                var b,
                    d = {
                        lazyClass: "lazyload",
                        loadedClass: "lazyloaded",
                        loadingClass: "lazyloading",
                        preloadClass: "lazypreload",
                        errorClass: "lazyerror",
                        autosizesClass: "lazyautosizes",
                        srcAttr: "data-src",
                        srcsetAttr: "data-srcset",
                        sizesAttr: "data-sizes",
                        minSize: 40,
                        customMedia: {},
                        init: !0,
                        expFactor: 1.5,
                        hFac: 0.8,
                        loadMode: 2,
                    };
                c = a.lazySizesConfig || a.lazysizesConfig || {};
                for (b in d) b in c || (c[b] = d[b]);
                (a.lazySizesConfig = c),
                    j(function () {
                        c.init && E();
                    });
            })(),
            { cfg: c, autoSizer: D, loader: C, init: E, uP: v, aC: r, rC: s, hC: q, fire: u, gW: x, rAF: y }
        );
    }
});
