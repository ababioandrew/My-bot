/*!
 * SEC JavaScript Library
 * @version: 3.0.4
 */
!(function (o, S) {
    "use strict";
    var y,
        b,
        x = {},
        T = [],
        u = ["x-vf-trace-source", "x-vf-trace-source-version"],
        C = "3.0.4",
        k = "sec",
        D = "NA",
        U = "",
        t = null,
        L = "VF-BINS",
        O = "c7b152e2-4c0f-49aa-abe3-e657dc85e224",
        I = { page: "Page", uiControl: "UIControl", uiCustom: "UICustom" },
        P = { pageDomLoaded: "page-dom-loaded", pageLoaded: "page-loaded", pageView: "Page View", softNavigation: "soft-navigation" },
        A = { homeDoc: "not_fired", pageLoad: !0, pageDomLoad: !0, isSMAPIEnabled: !1, angularLocationChangeEnabled: !0 };
    (x.homeDocResponse = void 0),
        (o.internal = x),
        (o.setVerbose = !1),
        (o.Environment = {
            VF_PRE: "https://events-pre.sp.vodafone.com",
            VF_PROD: "https://events.sp.vodafone.com",
            GCP_TEST: "https://gcpsmapi-test.vodafone.com",
            GCP_PRE: "https://gcpsmapi-pre.vodafone.com",
            GCP_PROD: "https://gcpsmapi.vodafone.com",
        }),
        (x.debug = function () {
            if (o.setVerbose) {
                var e = Array.prototype.slice.call(arguments);
                console.log.apply(console, e);
            }
        }),
        (x.removeAllElements = function (e) {
            e.length = 0;
        }),
        (x.addElements = function (n, e) {
            e.forEach(function (e) {
                n.push(e);
            });
        }),
        (x.contains = function (e, n) {
            return 0 <= e.indexOf(n);
        }),
        (x.isUndefined = function (e) {
            return void 0 === e;
        }),
        (x.isValidEvent = function (e) {
            return !x.isUndefined(e) && !x.isUndefined(e.payload) && !x.isUndefined(e.payload.xVfEvents);
        }),
        (x.validateField = function (e) {
            return x.isUndefined(e) || null === e || ("string" == typeof e && e.trim() === U) ? D : e;
        }),
        (x.setDefault = function (e, n, t) {
            e && x.isUndefined(e[n]) && (e[n] = t);
        }),
        (x.setValue = function (e, n, t) {
            e && (e[n] = t);
        }),
        (x.forKeyValue = function (e, n) {
            if ("function" == typeof n) for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && n(t, e[t]);
        }),
        (x.merge = function (t, e) {
            x.forKeyValue(e, function (e, n) {
                x.setDefault(t, e, n);
            });
        }),
        (x.bytesFrom = function (e) {
            var n = [];
            if ("string" == typeof e) for (var t = 0; t < e.length; ++t) n.push(e.charCodeAt(t));
            return n;
        }),
        (x.setHeaders = function (t, e) {
            x.forKeyValue(e, function (e, n) {
                e && n && t.setRequestHeader(e, n);
            });
        }),
        (x.httpAsyncDefault = !0),
        (x.closingWindow = !1),
        (x.http = function (t) {
            var e;
            if (!x.isUndefined(t)) {
                if ((x.setDefault(t, "async", x.httpAsyncDefault), x.setDefault(t, "data", null), x.setDefault(t, "headers", {}), null !== t.data)) {
                    for (var n = JSON.parse(t.data), o = 0; o < n.length; o++)
                        for (var r = Object.keys(n[o]), i = 0; i < r.length; i++) {
                            0 === r[i].length && delete n[o][i];
                        }
                    (n = n.map(function (e) {
                        return e.xVfEvents;
                    })),
                        (e = JSON.stringify(n));
                }
                if (x.closingWindow && "sendBeacon" in navigator && "function" == typeof navigator.sendBeacon) {
                    var a = t.url + "?source=" + t.headers["x-vf-trace-source"] + "&sver=" + t.headers["x-vf-trace-source-version"];
                    return null === t.data ? navigator.sendBeacon(a, null) : (x.debug("sending beacon using " + e), navigator.sendBeacon(a, e));
                }
                var s = new XMLHttpRequest();
                return (
                    s.open(t.method, t.url, t.async),
                    u.forEach(function (e) {
                        var n = {};
                        (n[e] = t.headers[e]), x.setHeaders(s, n);
                    }),
                    t.async
                        ? (t.onSuccess &&
                              (s.onload = function () {
                                  t.onSuccess(s.responseText, s.status);
                              }),
                          t.onError &&
                              (s.onerror = function () {
                                  t.onError(s.responseText, s.status);
                              }),
                          null === t.data ? s.send(t.data) : (x.debug(e), s.send(e)),
                          null)
                        : (null === t.data ? s.send(t.data) : (x.debug("sending XHR using " + e), s.send(e)), { responseText: s.responseText, status: s.status })
                );
            }
            x.debug("http() called without parameters");
        }),
        (x.serializer = function (e) {
            if (-1 !== e.indexOf("json")) return JSON.stringify;
            throw new Error("cannot serialize data to " + e);
        }),
        (x.submitLink = function (o, r, i, a) {
            if (!o) throw new Error("link description missing, will not make http requests");
            if (!(o.type && o.method && o.href))
                return function () {
                    return null;
                };
            var s = x.serializer(o.type);
            return function (e) {
                var n = { "content-type": o.type },
                    t = s(e);
                "function" == typeof a && ((t = a(x.bytesFrom(t))), x.merge(n, { "content-encoding": "gzip" })),
                    x.merge(n, r),
                    x.debug(o.method + "ing " + t + " to " + o.href),
                    "function" == typeof i && i({ method: o.method, url: o.href, headers: n, data: t });
            };
        }),
        (x.getClientSettings = function (e, n) {
            if (x.isUndefined(e) || x.isUndefined(n)) throw new Error("link description/metadata missing, will not make http request to get client settings");
            var t = { Accept: e.type };
            x.merge(t, n);
            var o = x.http({ method: "GET", url: e.href, headers: t, async: !1 });
            if (200 <= o.status && o.status < 400) return JSON.parse(o.responseText);
            throw new Error("failed to GET client settings from " + e.href);
        }),
        (x.getHomeDoc = function (e, n, t) {
            var o = { Accept: "application/json" };
            (A.homeDoc = "fired"),
                x.merge(o, n),
                x.http({
                    method: "GET",
                    url: e,
                    headers: o,
                    onSuccess: function (e, n) {
                        if (!(200 <= n && n < 400)) throw ((A.homeDoc = "error"), (x.homeDocResponse = void 0), new Error("Home document received with status " + n));
                        if (((x.homeDocResponse = JSON.parse(e)), !x.submitEventsLink(x.homeDocResponse))) throw ((A.homeDoc = "error"), (x.homeDocResponse = void 0), new Error("Invalid response received"));
                        (A.homeDoc = "success"),
                            t &&
                                Array.isArray(t) &&
                                t.forEach(function (e) {
                                    e && "function" == typeof e && e();
                                });
                    },
                    onError: function () {
                        throw ((A.homeDoc = "error"), (x.homeDocResponse = void 0), new Error("failed to GET home document from " + e));
                    },
                });
        }),
        (x.submitEventsLink = function (e) {
            return e && e.links ? e.links["http://a42.vodafone.com/rels/sec/submit-events"] : null;
        }),
        (x.clientSettingsLink = function (e) {
            return e && e.links ? e.links["http://a42.vodafone.com/rels/sec/settings"] : null;
        }),
        (x.payloads = function (e) {
            if ("object" == typeof e)
                return e.map(function (e) {
                    if ("object" == typeof e) return e.payload;
                });
        }),
        (x.addEnteringPage = function () {
            var e = window.location.href,
                n = document.title + "-" + e;
            return /\d{10}\d?\d?\d?/.test(n) && (n = n.replace(/\d{9}\d?\d?\d?/g, "<PII-redacted>")), n;
        }),
        (x.addUserAgent = function () {
            return navigator.userAgent;
        }),
        (x.addNetworkBearer = function () {
            var e;
            if (!navigator.connection) return D;
            if ("slow-2g" === (e = navigator.connection.effectiveType)) e = "2g";
            else if (void 0 === e) return D;
            return e.toUpperCase();
        }),
        (x.addTraceSubjectRegion = function () {
            var e;
            return (
                (e = window.navigator.languages ? window.navigator.languages[0] : window.navigator.userLanguage || window.navigator.language),
                x.isUndefined(e) || null === e ? D : -1 === e.indexOf("-") ? e.toUpperCase() : e.split("-")[0].toUpperCase()
            );
        }),
        (x.addOSversion = function () {
            var e = D,
                n = navigator.userAgent,
                t = navigator.appVersion,
                o = [
                    { s: "Windows 10", r: /(Windows\s10.0|Windows\sNT\s10.0)/ },
                    { s: "Windows 8.1", r: /(Windows\s8.1|Windows\sNT\s6.3)/ },
                    { s: "Windows 8", r: /(Windows\s8|Windows\sNT\s6.2)/ },
                    { s: "Windows 7", r: /(Windows\s7|Windows\sNT\s6.1)/ },
                    { s: "Windows Vista", r: /Windows\sNT\s6.0/ },
                    { s: "Windows Server 2003", r: /Windows\sNT\s5.2/ },
                    { s: "Windows XP", r: /(Windows\sNT\s5.1|Windows\sXP)/ },
                    { s: "Windows 2000", r: /(Windows\sNT\s5.0|Windows\s2000)/ },
                    { s: "Windows ME", r: /(Win\s9x\s4.90|Windows\sME)/ },
                    { s: "Windows 98", r: /(Windows\s98|Win98)/ },
                    { s: "Windows 95", r: /(Windows\s95|Win95|Windows_95)/ },
                    { s: "Windows NT 4.0", r: /(Windows\sNT\s4.0|WinNT4.0|WinNT|Windows\sNT)/ },
                    { s: "Windows CE", r: /Windows\sCE/ },
                    { s: "Windows 3.11", r: /Win16/ },
                    { s: "Android", r: /Android/ },
                    { s: "Open BSD", r: /OpenBSD/ },
                    { s: "Sun OS", r: /SunOS/ },
                    { s: "Linux", r: /(Linux|X11)/ },
                    { s: "iOS", r: /(iPhone|iPad|iPod)/ },
                    { s: "Mac OS X", r: /Mac\sOS\sX/ },
                    { s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
                    { s: "QNX", r: /QNX/ },
                    { s: "UNIX", r: /UNIX/ },
                    { s: "BeOS", r: /BeOS/ },
                    { s: "OS/2", r: /OS\/2/ },
                    { s: "Search Bot", r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\sJeeves\/Teoma|ia_archiver)/ },
                ];
            for (var r in o) {
                var i = o[r];
                if (i.r.test(n)) {
                    e = i.s;
                    break;
                }
            }
            var a = D;
            switch ((/Windows/.test(e) && ((a = /Windows\s(.*)/.exec(e)[1]), (e = "Windows")), e)) {
                case "Mac OS X":
                    a = /Mac\sOS\sX\s(10[._\d]+)/.exec(n)[1];
                    break;
                case "Android":
                    a = /Android\s([._\d]+)/.exec(n)[1];
                    break;
                case "iOS":
                    a = (a = /OS\s(\d+)_(\d+)_?(\d+)?/.exec(t))[1] + "." + a[2] + "." + (0 | a[3]);
            }
            return { os: e, osVersion: a };
        }),
        (x.addLocale = function () {
            var e;
            return (e = window.navigator.languages ? window.navigator.languages[0] : window.navigator.userLanguage || window.navigator.language), x.isUndefined(e) || null === e ? D : e;
        }),
        (x.addEvents = function (e) {
            x.isUndefined(e) ||
                x.payloads(e).forEach(function (e) {
                    x.merge(e, { xVfEvents: T });
                });
        }),
        (x.addScreenMetric = function () {
            var e = D,
                n = screen.width,
                t = screen.height;
            return (n = n || U), (t = t || U), window.innerHeight >= window.innerWidth ? (e = "Portrait") : window.innerHeight < window.innerWidth && (e = "Landscape"), { width: n, height: t, rotation: e };
        }),
        (x.generateUUID = function () {
            var t = new Date().getTime();
            return (
                "undefined" != typeof performance && "function" == typeof performance.now && (t += performance.now()),
                "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                    var n = (t + 16 * Math.random()) % 16 | 0;
                    return (t = Math.floor(t / 16)), ("x" === e ? n : (3 & n) | 8).toString(16);
                })
            );
        }),
        (x.addUUID = function () {
            var i,
                a = "VF-UUID=";
            return (
                document.cookie.split(";").forEach(function (e) {
                    for (; " " === e.charAt(0); ) e = e.substring(1, e.length);
                    if (0 === e.indexOf(a)) {
                        var n = e.substring(a.length, e.length);
                        i = n;
                    } else {
                        var t,
                            o = x.generateUUID(),
                            r = new Date();
                        r.setTime(r.getTime() + 31536e7), (t = "; expires=" + r.toUTCString()), (document.cookie = "VF-UUID=" + o + t + "; path=/"), (i = o);
                    }
                }),
                i
            );
        }),
        (x.isCookieEnabled = function () {
            var e = !!navigator.cookieEnabled;
            return void 0 !== navigator.cookieEnabled || e || ((document.cookie = "testCookie"), (e = -1 !== document.cookie.indexOf("testCookie")), (document.cookie = "testCookie; expires=Thu, 01-Jan-1970 00:00:01 GMT")), e;
        }),
        (x.setCookie = function (e, n, t) {
            if (t === U) document.cookie = e + "=" + n + ";path=/";
            else {
                var o = new Date();
                o.setTime(o.getTime() + 60 * t * 1e3);
                var r = "expires=" + o.toUTCString();
                document.cookie = e + "=" + n + ";" + r + ";path=/";
            }
        }),
        (x.getCookie = function (e) {
            for (var n = e + "=", t = decodeURIComponent(document.cookie).split(";"), o = 0; o < t.length; o++) {
                for (var r = t[o]; " " === r.charAt(0); ) r = r.substring(1);
                if (0 === r.indexOf(n)) return r.substring(n.length, r.length);
            }
            return U;
        }),
        (x.getSessionId = function () {
            var e = "VF-SID";
            return x.isCookieEnabled() ? ((y = x.getCookie(e)) === U && (y = x.generateUUID()), x.setCookie(e, y, 30)) : (!x.isUndefined(y) && y !== U) || (y = x.generateUUID()), y;
        }),
        (x.removeSessionId = function () {
            x.setCookie("VF-SID", x.getSessionId(), 30);
        }),
        (x.getOptStatus = function () {
            var e = "VF-OPT";
            return x.getCookie(e) === U ? ((A.isSMAPIEnabled = !1), x.setCookie(e, "false", U)) : (A.isSMAPIEnabled = "true" === x.getCookie(e).toLowerCase()), A.isSMAPIEnabled;
        }),
        (x.setOptStatus = function (e) {
            (A.isSMAPIEnabled = e), x.setCookie("VF-OPT", A.isSMAPIEnabled, U);
        }),
        (x.throttle = function (t, o) {
            if (t && t.contains)
                return function (e, n) {
                    return t.contains(e) ? o : n();
                };
        }),
        (x.throttleFreeEventsFilter = function (o) {
            var r = x.throttle(o);
            return function (e) {
                var t = [];
                return (
                    Array.isArray(e) &&
                        e.forEach(function (e) {
                            var n = e.duplication;
                            n
                                ? r(n.key, function () {
                                      t.push(e), o.put(n.key, n.repeatSeconds);
                                  })
                                : t.push(e);
                        }),
                    t
                );
            };
        }),
        (x.TemporaryCache = function () {
            var t = {},
                n = [];
            (this.contains = function (e) {
                return !x.isUndefined(t[e]);
            }),
                (this.put = function (e, n) {
                    return e && "number" == typeof n && (t[e] = n), this;
                }),
                (this.advanceTime = function (o) {
                    if ("number" == typeof o) {
                        var r = {};
                        x.forKeyValue(t, function (e, n) {
                            var t = n - o;
                            0 < t && (r[e] = t);
                        }),
                            (t = r);
                    }
                }),
                (this.startClock = function () {
                    var e = this;
                    return (
                        n.push(
                            setInterval(function () {
                                e.advanceTime(1);
                            }, 1e3)
                        ),
                        this
                    );
                }),
                (this._ticksFor = function (e) {
                    return t[e];
                }),
                (this._clearIntervals = function () {
                    n.forEach(function (e) {
                        clearInterval(e);
                    });
                });
        }),
        (x.Cron = function (t, o) {
            var e = [],
                r = new Date();
            (this.delay = function () {
                r = new Date();
            }),
                e.push(
                    setInterval(function () {
                        var e = new Date(),
                            n = e.getTime() - r.getTime();
                        1e3 * o <= n && ((r = e), t());
                    }, 500)
                ),
                (this._clearIntervals = function () {
                    e.forEach(function (e) {
                        clearInterval(e);
                    });
                });
        }),
        (x.Buffer = function (n, t, e) {
            var o,
                r = [];
            (this.handler = function (e) {
                t = e;
            }),
                (this.flush = function () {
                    0 < r.length && ("function" == typeof t && (x.debug("calling onFullHandler on " + JSON.stringify(r)), t(r)), x.removeAllElements(r), o && o.delay(), x.debug("buffer flushed"));
                }),
                (this.filter = function () {
                    (r = r.filter(function (e) {
                        return x.contains([I.page, I.uiControl], e.xVfEvents["event-type"]);
                    })),
                        (this._elements = r);
                }),
                (this.add = function (e) {
                    Array.isArray(e) && (x.addElements(r, e), x.debug("Buffering " + e.length + " new element(s), buffer has " + r.length + " element(s)"), (this._elements = r)), r.length >= n && this.flush();
                }),
                (this.clear = function () {
                    x.removeAllElements(r), x.debug("buffer cleared");
                }),
                (this._elements = r),
                0 < n && e && (o = new x.Cron(this.flush, e));
        }),
        (x.redactPatterns = [{ keyword: "MASKEDMSISDN", pattern: /[0-9]{9}/g }]),
        (x.redact = function (e) {
            if (this.isUndefined(e)) return e;
            var n = "object" == typeof e ? JSON.stringify(e) : "string" == typeof e ? e : e && "function" == typeof e.toString ? e.toString() : void 0,
                t = n;
            return (
                x.redactPatterns.forEach(function (e) {
                    n = n.replace(e.pattern, e.keyword);
                }),
                n !== t ? n : e
            );
        }),
        (x.eventOccured = function (e, n, t) {
            var o = x.addScreenMetric(),
                r = new Date().getTime(),
                i = x.addEnteringPage(),
                a = x.generateUUID();
            /\d{10}\d?\d?\d?/.test(t) && (t = t.replace(/\d{9}\d?\d?\d?/g, "<PII-redacted>"));
            var s = {
                "event-type": x.validateField(e),
                "event-element": x.validateField(n),
                "page-name": i,
                "subpage-name": D,
                "event-description": x.validateField(t),
                "x-vf-trace-timestamp": r,
                "device-orientation": o.rotation,
                "x-vf-trace-transaction-id": a,
                "x-vf-trace-session-id": x.getSessionId(),
                "x-vf-net-type": D,
                "x-vf-net-band": D,
            };
            for (var c in b)
                if (!x.contains(u, c)) {
                    var d = {};
                    (d[c] = b[c]), x.merge(s, d);
                }
            return ((s["event-type"] === I.page && s["event-element"] === P.pageView) || s["event-type"] === I.page) && (s["event-description"] = x.redact(s["event-description"])), s;
        }),
        (x.msToSec = function (e) {
            if ("number" != typeof e) return t;
            var n = 0 <= e ? e / 1e3 : t;
            return n === t ? n : n % 1 == 0 ? n : Number(n.toFixed(3));
        }),
        (x.resourceTiming = function (e) {
            if (x.isUndefined(e)) return D;
            x.debug(e);
            var n = {};
            return (
                (n.url = e.name),
                (n.type = e.initiatorType),
                (n.start = x.msToSec(e.startTime)),
                (n.duration = x.msToSec(e.responseEnd - e.startTime)),
                (n.redirect = x.msToSec(e.redirectEnd - e.redirectStart)),
                (n.dns = x.msToSec(e.domainLookupEnd - e.domainLookupStart)),
                (n.tcp = x.msToSec(e.connectEnd - e.connectStart)),
                (n.ssl = x.msToSec(0 < e.secureConnectionStart ? e.connectEnd - e.secureConnectionStart : U)),
                (n.request = x.msToSec(e.responseStart - e.requestStart)),
                (n.response = x.msToSec(0 === e.responseStart ? U : e.responseEnd - e.responseStart)),
                (n.httpCode = U),
                n
            );
        }),
        (x.navigationTiming = function (e) {
            if (x.isUndefined(e)) return D;
            x.debug(e);
            var n = {};
            return (
                (n.url = window.location.href),
                (n.type = "navigation"),
                (n.start = 0),
                (n.httpCode = U),
                (n.duration = x.msToSec(e.loadEventEnd - e.navigationStart)),
                (n.redirect = x.msToSec(e.redirectEnd - e.redirectStart)),
                (n.dns = x.msToSec(e.domainLookupEnd - e.domainLookupStart)),
                (n.tcp = x.msToSec(e.connectEnd - e.connectStart)),
                (n.ssl = x.msToSec(0 === e.secureConnectionStart ? U : e.connectEnd - e.secureConnectionStart)),
                (n.request = x.msToSec(e.responseStart - e.requestStart)),
                (n.response = x.msToSec(e.responseEnd - e.responseStart)),
                (n.frontEnd = x.msToSec(e.loadEventEnd - e.domLoading)),
                (n.backEnd = x.msToSec(e.responseEnd - e.navigationStart)),
                (n.ttfb = x.msToSec(e.responseStart - e.navigationStart)),
                n
            );
        }),
        (x.handlePageDOMLoadEvent = function (e) {
            function n() {
                (A.pageDomLoad = !1),
                    setTimeout(function () {
                        x.pageDomLoadEventHandler(e);
                    }, 100);
            }
            if (S.addEventListener) {
                S.addEventListener("load", n, !0);
                var t = setInterval(function () {
                    "complete" === document.readyState && (clearInterval(t), A.pageDomLoad && n());
                }, 1e3);
            }
        }),
        (x.handlePageLoadEvent = function (e) {
            function n() {
                (A.pageLoad = !1),
                    setTimeout(function () {
                        x.pageLoadEventHandler(e);
                    }, 100);
            }
            if (S.addEventListener) {
                S.addEventListener("load", n, !0);
                var t = setInterval(function () {
                    "complete" === document.readyState && (clearInterval(t), A.pageLoad && n());
                }, 1e3);
            }
        }),
        (x.handlePageViewEvent = function (e, n) {
            if (x.isUndefined(performance) || null === performance) T = x.eventOccured(I.page, P.pageView, D);
            else {
                var t = [];
                n && performance.timing && t.push(x.navigationTiming(performance.timing));
                var o = performance.getEntriesByType("resource");
                0 < o.length &&
                    (o.forEach(function (e) {
                        t.push(x.resourceTiming(e));
                    }),
                    (T = x.eventOccured(I.page, P.pageView, t)),
                    performance.clearResourceTimings());
            }
            e.submitEvents([{ payload: {} }]);
        }),
        (x.handleDOMChanges = function (n) {
            function a(e) {
                x.clickEventHandler(e, this, n);
            }
            "function" == typeof MutationObserver &&
                (x.observer = new MutationObserver(function (e) {
                    e.forEach(function (e) {
                        for (var n = e.addedNodes, t = 0; t < n.length; t++) {
                            var o = n[t];
                            if (o instanceof Element)
                                for (
                                    var r = o.querySelectorAll("button, [onclick], [type='submit'], [type='button'], [type='reset'], [type='checkbox'], [type='radio'], [type='file'], [type='color'], select, a, img"), i = 0;
                                    i < r.length;
                                    i++
                                )
                                    S.addEventListener && r[i].addEventListener("click", a);
                        }
                    });
                }));
        }),
        (x.handleBrowserClose = function (e, n) {
            var t = x.createCloseHandler(e, n);
            S.addEventListener && (S.addEventListener("beforeunload", t), S.addEventListener("unload", t)), x.removeSessionId();
        }),
        (x.pageDomLoadEventHandler = function (e) {
            var n = (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart) / 1e3;
            (T = n < 0 ? x.eventOccured(I.page, P.pageDomLoaded, D) : x.eventOccured(I.page, P.pageDomLoaded, n + " " + k)), e.submitEvents([{ payload: {} }]);
        }),
        (x.pageLoadEventHandler = function (e) {
            var n = (window.performance.timing.loadEventEnd - window.performance.timing.navigationStart) / 1e3;
            (T = n < 0 ? x.eventOccured(I.page, P.pageLoaded, D) : x.eventOccured(I.page, P.pageLoaded, n + " " + k)), e.submitEvents([{ payload: {} }]);
        }),
        (x.clickEventHandler = function (e, n, t) {
            if (x.isUndefined(e) || x.isUndefined(n) || x.isUndefined(t)) throw new Error("event/element/eventSubmitter is undefined");
            var o,
                r = U;
            n.getAttribute("aria-label") && (r = n.getAttribute("aria-label"));
            var i = r || e.text,
                a = (n.value ? n.value : i) || n.innerText,
                s = n.type ? n.type : n.localName,
                c = n.tagName.toUpperCase(),
                d = c + " - " + s;
            switch (c) {
                case "INPUT":
                    o = "CHECKBOX" === s.toUpperCase() ? a + " - " + (n.checked ? "Checked" : "Unchecked") : a;
                    break;
                case "A":
                    o = a + " (URL: " + n.href + ")";
                    break;
                case "IMG":
                    o = a + n.src.split("/").pop();
                    break;
                default:
                    o = a;
            }
            (T = x.eventOccured(I.uiControl, d, "Click - " + this.redact(o))), t.submitEvents([{ payload: {} }]);
        }),
        (x.createCloseHandler = function (e, n) {
            var t;
            return function () {
                t || (!0 === n && x.handlePageViewEvent(e, !0), (t = !0), (T = x.eventOccured(I.page, D, "Unloaded")), (x.httpAsyncDefault = !1), (x.closingWindow = !0), e.submitEvents([{ payload: {} }]), e.flushBuffer());
            };
        }),
        (x.validateEnvironment = function (e) {
            var n = !1;
            if ("string" == typeof e)
                for (var t in o.Environment)
                    if (e === o.Environment[t]) {
                        n = !0;
                        break;
                    }
            return n;
        }),
        (x.logEvent = function (e, n) {
            setTimeout(function () {
                (T = x.eventOccured(n, P.softNavigation, D)), e.submitEvents([{ payload: {} }]);
            }, 100);
        }),
        (o.angularSPA = function (e, n) {
            function t() {
                (T = x.eventOccured(
                    I.page,
                    P.pageDomLoaded,
                    (function () {
                        var e = r - o;
                        return 0 <= e ? e / 1e3 + " " + k : D;
                    })()
                )),
                    n.submitEvents([{ payload: {} }]);
            }
            var o = 0,
                r = 0;
            e.$on("$locationChangeStart", function () {
                A.angularLocationChangeEnabled && (o = new Date().getTime());
            }),
                e.$on("$locationChangeSuccess", function () {
                    A.angularLocationChangeEnabled && ((r = new Date().getTime()), t());
                }),
                e.$on("$routeChangeStart", function () {
                    (o = new Date().getTime()), (A.angularLocationChangeEnabled = !1);
                }),
                e.$on("$routeChangeError", function () {
                    (r = new Date().getTime()), t(), (A.angularLocationChangeEnabled = !0);
                }),
                e.$on("$routeChangeSuccess", function () {
                    (r = new Date().getTime()), t(), (A.angularLocationChangeEnabled = !0);
                }),
                e.$on("$stateChangeStart", function () {
                    (o = new Date().getTime()), (A.angularLocationChangeEnabled = !1);
                }),
                e.$on("$stateChangeError", function () {
                    (r = new Date().getTime()), t(), (A.angularLocationChangeEnabled = !0);
                }),
                e.$on("$stateChangeSuccess", function () {
                    (r = new Date().getTime()), t(), (A.angularLocationChangeEnabled = !0);
                });
        }),
        (x.handleRouteChange = function (i, e) {
            function n() {
                window.addEventListener("popstate", function (e) {
                    x.logEvent(i, I.page);
                });
            }
            var o,
                a,
                s = window.document.createElement("a");
            A.pageLoad
                ? window.addEventListener("load", function () {
                      setTimeout(n, 100);
                  })
                : n(),
                "function" == typeof history.pushState &&
                    (history.pushState =
                        ((o = history.pushState),
                        function (e, n, t) {
                            return (s.href = t), (t = s.href), x.logEvent(i, I.page), o.apply(this, arguments);
                        })),
                e.replaceState &&
                    "function" == typeof history.replaceState &&
                    (history.replaceState =
                        ((a = history.replaceState),
                        function (e, n, t) {
                            var o = window.document.URL,
                                r = o;
                            return 3 <= arguments.length && null != t && ((s.href = t), (r = s.href)), r !== o && x.logEvent(i, I.page), a.apply(this, arguments);
                        }));
        }),
        (o.EventSubmitter = function (t, o, r) {
            if (x.isUndefined(t) || x.isUndefined(o)) throw new Error("homeDocUrl/metadata is undefined");
            if (!x.validateEnvironment(t)) throw new Error("homeDocUrl is invalid");
            if (x.isUndefined(o["x-vf-trace-source"]) || x.isUndefined(o["x-vf-trace-source-version"])) throw new Error("metadata must contain x-vf-trace-source and x-vf-trace-source-version property");
            x.isUndefined(r) && (r = {}),
                x.setDefault(r, "configureNetworkMonitoring", !1),
                x.setValue(r, "bufferSize", 10),
                x.getCookie(L) === U && (x.setCookie(L, O, U), (y = x.generateUUID()), x.setCookie("VF-SID", y, 30)),
                (A.isSMAPIEnabled = x.getOptStatus() !== U && x.getOptStatus()),
                x.setValue(o, "seclib-client-version", C),
                x.merge(o, { "x-vf-trace-platform": "JS" });
            var e = x.addOSversion();
            x.merge(o, { "x-vf-trace-os-version": e.osVersion }), x.merge(o, { "x-vf-trace-os-name": e.os });
            var n = x.addNetworkBearer();
            x.merge(o, { "x-vf-trace-network-bearer": n });
            var i = window.location.hostname;
            x.merge(o, { "x-vf-trace-application-name": i });
            var a = x.addTraceSubjectRegion();
            x.merge(o, { "x-vf-trace-subject-region": a });
            var s = x.addUUID();
            x.merge(o, { "x-vf-trace-subject-id": s });
            var c = x.addUserAgent();
            x.merge(o, { "x-vf-trace-user-agent": c }), x.merge(o, { "install-id": s });
            var d = x.addLocale();
            x.merge(o, { "x-vf-trace-mcc": U }), x.merge(o, { "x-vf-trace-mnc": U }), x.merge(o, { "x-vf-trace-locale": d });
            var u,
                f = x.addScreenMetric();
            x.merge(o, { "x-vf-trace-width": f.width }), x.merge(o, { "x-vf-trace-height": f.height }), (b = o);
            var l = new x.Buffer(r.bufferSize, u, r.bufferFlushSeconds);
            this._buffer = l;
            function g() {
                u = x.submitLink(x.submitEventsLink(x.homeDocResponse), o, x.http, r.gzipCompressor);
            }
            function v() {
                l.handler(u);
            }
            x.getHomeDoc(t, o, [g, v]),
                (this.getSettings = function () {
                    return x.getClientSettings(x.clientSettingsLink(x.homeDocResponse), o);
                }),
                (this.flushBuffer = function () {
                    l.flush();
                }),
                (this.clearBuffer = function () {
                    l.clear();
                }),
                (this._render = function () {
                    return JSON.stringify(
                        { serviceDocument: t, headers: o, configuration: r, payload: l._elements },
                        function (e, n) {
                            return "function" == typeof n ? "function() {...}" : n;
                        },
                        3
                    );
                });
            var p = new x.TemporaryCache().startClock();
            this._cache = p;
            var m = x.throttleFreeEventsFilter(p);
            (this.getSMAPIStatus = function () {
                return A.isSMAPIEnabled;
            }),
                (this.turnSMAPIOnOff = function (e) {
                    if ("boolean" == typeof e) return !0 !== e || A.isSMAPIEnabled || x.setOptStatus(e), void (!1 === e && A.isSMAPIEnabled && (x.setOptStatus(e), l.filter()));
                    throw new Error("status is invalid");
                });
            var h = this;
            (this.submitEvents = function (e) {
                var n = m(e);
                "error" === A.homeDoc && x.getHomeDoc(t, o, [g, v]), x.addEvents(n), x.debug(n), l.add(x.payloads(n));
            }),
                (this.logCustomEvent = function (n, e, t, o, r, i) {
                    if (A.isSMAPIEnabled) {
                        var a = function (e) {
                                return "string" == typeof n ? x.validateField(e) : D;
                            },
                            s = {
                                duplication: i,
                                payload: {
                                    xVfEvents: {
                                        "event-type": "UICustom",
                                        "event-element": a(n),
                                        "event-description": a(e),
                                        "page-name": a(t),
                                        "subpage-name": a(o),
                                        "x-vf-trace-timestamp": new Date().getTime(),
                                        "x-vf-trace-transaction-id": x.generateUUID(),
                                        "x-vf-trace-session-id": x.getSessionId(),
                                        "device-orientation": x.addScreenMetric().rotation,
                                        "x-vf-net-type": D,
                                        "x-vf-net-band": D,
                                    },
                                },
                            };
                        for (var c in r) s.payload.xVfEvents["x-vf-custom-" + x.validateField(c)] = r[c];
                        h.submitEvents([s]);
                    }
                });
            var w = {};
            if (
                ((this.startRouteTimer = function (e, n) {
                    return r && r.spa && x.debug("Auto soft-navigation is enabled. Please use either of the approach to capture soft-navigation"), (w[e] = { startTime: new Date().getTime(), description: n }), w[e];
                }),
                (this.stopRouteTimer = function (e) {
                    var n = new Date().getTime();
                    if (w[e]) {
                        console.log(w);
                        var t = w[e].startTime;
                        t && ((T = x.eventOccured(I.page, P.softNavigation + " (" + w[e].description + ")", (n - t) / 1e3 + " " + k)), h.submitEvents([{ payload: {} }]), delete w[e]);
                    } else x.debug("startRouteTimer is not invoked for id: " + e);
                }),
                x.handleBrowserClose(this, r.configureNetworkMonitoring),
                x.handlePageDOMLoadEvent(this),
                x.handlePageLoadEvent(this),
                r && r.spa && x.handleRouteChange(this, r.spa),
                null != document.body)
            ) {
                var E = document.body.querySelectorAll("button, [onclick], [type='submit'], [type='button'], [type='reset'], [type='checkbox'], [type='radio'], [type='file'], [type='color'], select, a, img");
                S.addEventListener &&
                    E.forEach(function (e) {
                        e.addEventListener("click", function (e) {
                            x.clickEventHandler(e, this, h);
                        });
                    });
            }
            x.handleDOMChanges(this), x.isUndefined(x.observer) || x.observer.observe(document || document.body, { childList: !0, subtree: !0 });
        });
})("undefined" == typeof exports ? (this.sec = {}) : exports, this);
