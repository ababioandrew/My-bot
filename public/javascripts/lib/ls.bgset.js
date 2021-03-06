!(function () {
    "use strict";
    if (window.addEventListener) {
        var a = /\s+/g,
            b = /\s*\|\s+|\s+\|\s*/g,
            c = /^(.+?)(?:\s+\[\s*(.+?)\s*\])?$/,
            d = { contain: 1, cover: 1 },
            e = function (a) {
                var b = lazySizes.gW(a, a.parentNode);
                return (!a._lazysizesWidth || b > a._lazysizesWidth) && (a._lazysizesWidth = b), a._lazysizesWidth;
            },
            f = function (a) {
                var b;
                return (b = (getComputedStyle(a) || { getPropertyValue: function () {} }).getPropertyValue("background-size")), !d[b] && d[a.style.backgroundSize] && (b = a.style.backgroundSize), b;
            },
            g = function (d, e, f) {
                var g = document.createElement("picture"),
                    h = e.getAttribute(lazySizesConfig.sizesAttr),
                    i = e.getAttribute("data-ratio"),
                    j = e.getAttribute("data-optimumx");
                e._lazybgset && e._lazybgset.parentNode == e && e.removeChild(e._lazybgset),
                    Object.defineProperty(f, "_lazybgset", { value: e, writable: !0 }),
                    Object.defineProperty(e, "_lazybgset", { value: g, writable: !0 }),
                    (d = d.replace(a, " ").split(b)),
                    (g.style.display = "none"),
                    (f.className = lazySizesConfig.lazyClass),
                    1 != d.length || h || (h = "auto"),
                    d.forEach(function (a) {
                        var b = document.createElement("source");
                        h && "auto" != h && b.setAttribute("sizes", h),
                            a.match(c) && (b.setAttribute(lazySizesConfig.srcsetAttr, RegExp.$1), RegExp.$2 && b.setAttribute("media", lazySizesConfig.customMedia[RegExp.$2] || RegExp.$2)),
                            g.appendChild(b);
                    }),
                    h && (f.setAttribute(lazySizesConfig.sizesAttr, h), e.removeAttribute(lazySizesConfig.sizesAttr), e.removeAttribute("sizes")),
                    j && f.setAttribute("data-optimumx", j),
                    i && f.setAttribute("data-ratio", i),
                    g.appendChild(f),
                    e.appendChild(g);
            },
            h = function (a) {
                if (a.target._lazybgset) {
                    var b = a.target,
                        c = b._lazybgset,
                        d = b.currentSrc || b.src;
                    d && (c.style.backgroundImage = "url(" + d + ")"), b._lazybgsetLoading && (lazySizes.fire(c, "_lazyloaded", {}, !1, !0), delete b._lazybgsetLoading);
                }
            };
        addEventListener("lazybeforeunveil", function (a) {
            var b, c, d;
            !a.defaultPrevented &&
                (b = a.target.getAttribute("data-bgset")) &&
                ((d = a.target),
                (c = document.createElement("img")),
                (c.alt = ""),
                (c._lazybgsetLoading = !0),
                (a.detail.firesLoad = !0),
                g(b, d, c),
                setTimeout(function () {
                    lazySizes.loader.unveil(c),
                        lazySizes.rAF(function () {
                            lazySizes.fire(c, "_lazyloaded", {}, !0, !0), c.complete && h({ target: c });
                        });
                }));
        }),
            document.addEventListener("load", h, !0),
            window.addEventListener(
                "lazybeforesizes",
                function (a) {
                    if (a.target._lazybgset && a.detail.dataAttr) {
                        var b = a.target._lazybgset,
                            c = f(b);
                        d[c] &&
                            ((a.target._lazysizesParentFit = c),
                            lazySizes.rAF(function () {
                                a.target.setAttribute("data-parent-fit", c), a.target._lazysizesParentFit && delete a.target._lazysizesParentFit;
                            }));
                    }
                },
                !0
            ),
            document.documentElement.addEventListener("lazybeforesizes", function (a) {
                !a.defaultPrevented && a.target._lazybgset && (a.detail.width = e(a.target._lazybgset));
            });
    }
})();
