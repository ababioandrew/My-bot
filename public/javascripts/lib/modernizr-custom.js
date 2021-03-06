/*! modernizr 3.4.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-appearance-bloburls-cssanimations-csstransforms-csstransitions-filereader-history-opacity-touchevents-video-setclasses !*/
!(function (e, n, t) {
    function r(e, n) {
        return typeof e === n;
    }
    function o() {
        var e, n, t, o, i, s, a;
        for (var l in x)
            if (x.hasOwnProperty(l)) {
                if (((e = []), (n = x[l]), n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))) for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
                for (o = r(n.fn, "function") ? n.fn() : n.fn, i = 0; i < e.length; i++)
                    (s = e[i]),
                        (a = s.split(".")),
                        1 === a.length ? (Modernizr[a[0]] = o) : (!Modernizr[a[0]] || Modernizr[a[0]] instanceof Boolean || (Modernizr[a[0]] = new Boolean(Modernizr[a[0]])), (Modernizr[a[0]][a[1]] = o)),
                        C.push((o ? "" : "no-") + a.join("-"));
            }
    }
    function i(e) {
        var n = w.className,
            t = Modernizr._config.classPrefix || "";
        if ((b && (n = n.baseVal), Modernizr._config.enableJSClass)) {
            var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
            n = n.replace(r, "$1" + t + "js$2");
        }
        Modernizr._config.enableClasses && ((n += " " + t + e.join(" " + t)), b ? (w.className.baseVal = n) : (w.className = n));
    }
    function s() {
        return "function" != typeof n.createElement ? n.createElement(arguments[0]) : b ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments);
    }
    function a() {
        var e = n.body;
        return e || ((e = s(b ? "svg" : "body")), (e.fake = !0)), e;
    }
    function l(e, t, r, o) {
        var i,
            l,
            f,
            u,
            c = "modernizr",
            d = s("div"),
            p = a();
        if (parseInt(r, 10)) for (; r--; ) (f = s("div")), (f.id = o ? o[r] : c + (r + 1)), d.appendChild(f);
        return (
            (i = s("style")),
            (i.type = "text/css"),
            (i.id = "s" + c),
            (p.fake ? p : d).appendChild(i),
            p.appendChild(d),
            i.styleSheet ? (i.styleSheet.cssText = e) : i.appendChild(n.createTextNode(e)),
            (d.id = c),
            p.fake && ((p.style.background = ""), (p.style.overflow = "hidden"), (u = w.style.overflow), (w.style.overflow = "hidden"), w.appendChild(p)),
            (l = t(d, e)),
            p.fake ? (p.parentNode.removeChild(p), (w.style.overflow = u), w.offsetHeight) : d.parentNode.removeChild(d),
            !!l
        );
    }
    function f(e, n) {
        return !!~("" + e).indexOf(n);
    }
    function u(e) {
        return e
            .replace(/([a-z])-([a-z])/g, function (e, n, t) {
                return n + t.toUpperCase();
            })
            .replace(/^-/, "");
    }
    function c(e, n) {
        return function () {
            return e.apply(n, arguments);
        };
    }
    function d(e, n, t) {
        var o;
        for (var i in e) if (e[i] in n) return t === !1 ? e[i] : ((o = n[e[i]]), r(o, "function") ? c(o, t || n) : o);
        return !1;
    }
    function p(e) {
        return e
            .replace(/([A-Z])/g, function (e, n) {
                return "-" + n.toLowerCase();
            })
            .replace(/^ms-/, "-ms-");
    }
    function m(n, t, r) {
        var o;
        if ("getComputedStyle" in e) {
            o = getComputedStyle.call(e, n, t);
            var i = e.console;
            if (null !== o) r && (o = o.getPropertyValue(r));
            else if (i) {
                var s = i.error ? "error" : "log";
                i[s].call(i, "getComputedStyle returning null, its possible modernizr test results are inaccurate");
            }
        } else o = !t && n.currentStyle && n.currentStyle[r];
        return o;
    }
    function v(n, r) {
        var o = n.length;
        if ("CSS" in e && "supports" in e.CSS) {
            for (; o--; ) if (e.CSS.supports(p(n[o]), r)) return !0;
            return !1;
        }
        if ("CSSSupportsRule" in e) {
            for (var i = []; o--; ) i.push("(" + p(n[o]) + ":" + r + ")");
            return (
                (i = i.join(" or ")),
                l("@supports (" + i + ") { #modernizr { position: absolute; } }", function (e) {
                    return "absolute" == m(e, null, "position");
                })
            );
        }
        return t;
    }
    function y(e, n, o, i) {
        function a() {
            c && (delete j.style, delete j.modElem);
        }
        if (((i = r(i, "undefined") ? !1 : i), !r(o, "undefined"))) {
            var l = v(e, o);
            if (!r(l, "undefined")) return l;
        }
        for (var c, d, p, m, y, h = ["modernizr", "tspan", "samp"]; !j.style && h.length; ) (c = !0), (j.modElem = s(h.shift())), (j.style = j.modElem.style);
        for (p = e.length, d = 0; p > d; d++)
            if (((m = e[d]), (y = j.style[m]), f(m, "-") && (m = u(m)), j.style[m] !== t)) {
                if (i || r(o, "undefined")) return a(), "pfx" == n ? m : !0;
                try {
                    j.style[m] = o;
                } catch (g) {}
                if (j.style[m] != y) return a(), "pfx" == n ? m : !0;
            }
        return a(), !1;
    }
    function h(e, n, t, o, i) {
        var s = e.charAt(0).toUpperCase() + e.slice(1),
            a = (e + " " + E.join(s + " ") + s).split(" ");
        return r(n, "string") || r(n, "undefined") ? y(a, n, o, i) : ((a = (e + " " + O.join(s + " ") + s).split(" ")), d(a, n, t));
    }
    function g(e, n, r) {
        return h(e, t, t, n, r);
    }
    var C = [],
        x = [],
        T = {
            _version: "3.4.0",
            _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
            _q: [],
            on: function (e, n) {
                var t = this;
                setTimeout(function () {
                    n(t[e]);
                }, 0);
            },
            addTest: function (e, n, t) {
                x.push({ name: e, fn: n, options: t });
            },
            addAsyncTest: function (e) {
                x.push({ name: null, fn: e });
            },
        },
        Modernizr = function () {};
    (Modernizr.prototype = T),
        (Modernizr = new Modernizr()),
        Modernizr.addTest("history", function () {
            var n = navigator.userAgent;
            return (-1 === n.indexOf("Android 2.") && -1 === n.indexOf("Android 4.0")) || -1 === n.indexOf("Mobile Safari") || -1 !== n.indexOf("Chrome") || -1 !== n.indexOf("Windows Phone") || "file:" === location.protocol
                ? e.history && "pushState" in e.history
                : !1;
        }),
        Modernizr.addTest("filereader", !!(e.File && e.FileList && e.FileReader));
    var w = n.documentElement,
        b = "svg" === w.nodeName.toLowerCase(),
        S = T._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : ["", ""];
    (T._prefixes = S),
        Modernizr.addTest("video", function () {
            var e = s("video"),
                n = !1;
            try {
                (n = !!e.canPlayType),
                    n &&
                        ((n = new Boolean(n)),
                        (n.ogg = e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, "")),
                        (n.h264 = e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, "")),
                        (n.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")),
                        (n.vp9 = e.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, "")),
                        (n.hls = e.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/, "")));
            } catch (t) {}
            return n;
        }),
        Modernizr.addTest("opacity", function () {
            var e = s("a").style;
            return (e.cssText = S.join("opacity:.55;")), /^0.55$/.test(e.opacity);
        });
    var _ = (T.testStyles = l);
    Modernizr.addTest("touchevents", function () {
        var t;
        if ("ontouchstart" in e || (e.DocumentTouch && n instanceof DocumentTouch)) t = !0;
        else {
            var r = ["@media (", S.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
            _(r, function (e) {
                t = 9 === e.offsetTop;
            });
        }
        return t;
    });
    var P = "Moz O ms Webkit",
        E = T._config.usePrefixes ? P.split(" ") : [];
    T._cssomPrefixes = E;
    var O = T._config.usePrefixes ? P.toLowerCase().split(" ") : [];
    T._domPrefixes = O;
    var z = { elem: s("modernizr") };
    Modernizr._q.push(function () {
        delete z.elem;
    });
    var j = { style: z.elem.style };
    Modernizr._q.unshift(function () {
        delete j.style;
    }),
        (T.testAllProps = h),
        (T.testAllProps = g),
        Modernizr.addTest("cssanimations", g("animationName", "a", !0)),
        Modernizr.addTest("appearance", g("appearance")),
        Modernizr.addTest("csstransforms", function () {
            return -1 === navigator.userAgent.indexOf("Android 2.") && g("transform", "scale(1)", !0);
        }),
        Modernizr.addTest("csstransitions", g("transition", "all", !0));
    var L = function (n) {
        var r,
            o = S.length,
            i = e.CSSRule;
        if ("undefined" == typeof i) return t;
        if (!n) return !1;
        if (((n = n.replace(/^@/, "")), (r = n.replace(/-/g, "_").toUpperCase() + "_RULE"), r in i)) return "@" + n;
        for (var s = 0; o > s; s++) {
            var a = S[s],
                l = a.toUpperCase() + "_" + r;
            if (l in i) return "@-" + a.toLowerCase() + "-" + n;
        }
        return !1;
    };
    T.atRule = L;
    var A = (T.prefixed = function (e, n, t) {
            return 0 === e.indexOf("@") ? L(e) : (-1 != e.indexOf("-") && (e = u(e)), n ? h(e, n, t) : h(e, "pfx"));
        }),
        R = A("URL", e, !1);
    (R = R && e[R]), Modernizr.addTest("bloburls", R && "revokeObjectURL" in R && "createObjectURL" in R), o(), i(C), delete T.addTest, delete T.addAsyncTest;
    for (var N = 0; N < Modernizr._q.length; N++) Modernizr._q[N]();
    e.Modernizr = Modernizr;
})(window, document);
