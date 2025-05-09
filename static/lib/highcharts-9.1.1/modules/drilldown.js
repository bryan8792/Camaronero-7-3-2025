/*
 Highcharts JS v9.1.1 (2021-06-03)

 Highcharts Drilldown module

 Author: Torstein Honsi
 License: www.highcharts.com/license

*/
'use strict';
(function (c) {
    "object" === typeof module && module.exports ? (c["default"] = c, module.exports = c) : "function" === typeof define && define.amd ? define("highcharts/modules/drilldown", ["highcharts"], function (n) {
        c(n);
        c.Highcharts = n;
        return c
    }) : c("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (c) {
    function n(c, n, k, z) {
        c.hasOwnProperty(n) || (c[n] = z.apply(null, k))
    }

    c = c ? c._modules : {};
    n(c, "Extensions/Drilldown.js", [c["Core/Animation/AnimationUtilities.js"], c["Core/Axis/Axis.js"], c["Core/Chart/Chart.js"],
        c["Core/Color/Color.js"], c["Series/Column/ColumnSeries.js"], c["Core/FormatUtilities.js"], c["Core/Globals.js"], c["Core/DefaultOptions.js"], c["Core/Color/Palette.js"], c["Core/Series/Point.js"], c["Core/Series/Series.js"], c["Core/Series/SeriesRegistry.js"], c["Core/Renderer/SVG/SVGRenderer.js"], c["Core/Axis/Tick.js"], c["Core/Utilities.js"]], function (c, n, k, z, r, H, I, J, B, v, C, w, K, D, p) {
        var E = c.animObject, L = H.format, M = I.noop;
        c = J.defaultOptions;
        var m = p.addEvent, N = p.removeEvent, q = p.extend, x = p.fireEvent, t = p.merge,
            O = p.objectEach, u = p.pick, P = p.syncTimeout;
        w = w.seriesTypes.pie;
        var F = 1;
        q(c.lang, {drillUpText: "\u25c1 Back to {series.name}"});
        c.drilldown = {
            activeAxisLabelStyle: {
                cursor: "pointer",
                color: B.highlightColor100,
                fontWeight: "bold",
                textDecoration: "underline"
            },
            activeDataLabelStyle: {
                cursor: "pointer",
                color: B.highlightColor100,
                fontWeight: "bold",
                textDecoration: "underline"
            },
            animation: {duration: 500},
            drillUpButton: {position: {align: "right", x: -10, y: 10}}
        };
        K.prototype.Element.prototype.fadeIn = function (a) {
            this.attr({
                opacity: .1,
                visibility: "inherit"
            }).animate({opacity: u(this.newOpacity, 1)}, a || {duration: 250})
        };
        k.prototype.addSeriesAsDrilldown = function (a, b) {
            this.addSingleSeriesAsDrilldown(a, b);
            this.applyDrilldown()
        };
        k.prototype.addSingleSeriesAsDrilldown = function (a, b) {
            var d = a.series, g = d.xAxis, f = d.yAxis, e = [], c = [], h;
            var l = this.styledMode ? {colorIndex: u(a.colorIndex, d.colorIndex)} : {color: a.color || d.color};
            this.drilldownLevels || (this.drilldownLevels = []);
            var y = d.options._levelNumber || 0;
            (h = this.drilldownLevels[this.drilldownLevels.length -
            1]) && h.levelNumber !== y && (h = void 0);
            b = q(q({_ddSeriesId: F++}, l), b);
            var k = d.points.indexOf(a);
            d.chart.series.forEach(function (a) {
                a.xAxis !== g || a.isDrilling || (a.options._ddSeriesId = a.options._ddSeriesId || F++, a.options._colorIndex = a.userOptions._colorIndex, a.options._levelNumber = a.options._levelNumber || y, h ? (e = h.levelSeries, c = h.levelSeriesOptions) : (e.push(a), a.purgedOptions = t({
                    _ddSeriesId: a.options._ddSeriesId,
                    _levelNumber: a.options._levelNumber,
                    selected: a.options.selected
                }, a.userOptions), c.push(a.purgedOptions)))
            });
            a = q({
                levelNumber: y,
                seriesOptions: d.options,
                seriesPurgedOptions: d.purgedOptions,
                levelSeriesOptions: c,
                levelSeries: e,
                shapeArgs: a.shapeArgs,
                bBox: a.graphic ? a.graphic.getBBox() : {},
                color: a.isNull ? (new z(l.color)).setOpacity(0).get() : l.color,
                lowerSeriesOptions: b,
                pointOptions: d.options.data[k],
                pointIndex: k,
                oldExtremes: {xMin: g && g.userMin, xMax: g && g.userMax, yMin: f && f.userMin, yMax: f && f.userMax},
                resetZoomButton: this.resetZoomButton
            }, l);
            this.drilldownLevels.push(a);
            g && g.names && (g.names.length = 0);
            b = a.lowerSeries =
                this.addSeries(b, !1);
            b.options._levelNumber = y + 1;
            g && (g.oldPos = g.pos, g.userMin = g.userMax = null, f.userMin = f.userMax = null);
            d.type === b.type && (b.animate = b.animateDrilldown || M, b.options.animation = !0)
        };
        k.prototype.applyDrilldown = function () {
            var a = this.drilldownLevels;
            if (a && 0 < a.length) {
                var b = a[a.length - 1].levelNumber;
                this.drilldownLevels.forEach(function (a) {
                    a.levelNumber === b && a.levelSeries.forEach(function (a) {
                        a.options && a.options._levelNumber === b && a.remove(!1)
                    })
                })
            }
            this.resetZoomButton && (this.resetZoomButton.hide(),
                delete this.resetZoomButton);
            this.pointer.reset();
            this.redraw();
            this.showDrillUpButton();
            x(this, "afterDrilldown")
        };
        k.prototype.getDrilldownBackText = function () {
            var a = this.drilldownLevels;
            if (a && 0 < a.length) return a = a[a.length - 1], a.series = a.seriesOptions, L(this.options.lang.drillUpText, a)
        };
        k.prototype.showDrillUpButton = function () {
            var a = this, b = this.getDrilldownBackText(), d = a.options.drilldown.drillUpButton, g,
                f = "chart" === d.relativeTo || "spacingBox" === d.relativeTo ? null : "scrollablePlotBox";
            if (this.drillUpButton) this.drillUpButton.attr({text: b}).align();
            else {
                var e = (g = d.theme) && g.states;
                this.drillUpButton = this.renderer.button(b, null, null, function () {
                    a.drillUp()
                }, g, e && e.hover, e && e.select).addClass("highcharts-drillup-button").attr({
                    align: d.position.align,
                    zIndex: 7
                }).add().align(d.position, !1, f)
            }
        };
        k.prototype.drillUp = function () {
            if (this.drilldownLevels && 0 !== this.drilldownLevels.length) {
                for (var a = this, b = a.drilldownLevels, d = b[b.length - 1].levelNumber, g = b.length, f = a.series, e, c, h, l, k = function (b) {
                    f.forEach(function (a) {
                        a.options._ddSeriesId === b._ddSeriesId &&
                        (d = a)
                    });
                    var d = d || a.addSeries(b, !1);
                    d.type === h.type && d.animateDrillupTo && (d.animate = d.animateDrillupTo);
                    b === c.seriesPurgedOptions && (l = d)
                }; g--;) if (c = b[g], c.levelNumber === d) {
                    b.pop();
                    h = c.lowerSeries;
                    if (!h.chart) for (e = f.length; e--;) if (f[e].options.id === c.lowerSeriesOptions.id && f[e].options._levelNumber === d + 1) {
                        h = f[e];
                        break
                    }
                    h.xData = [];
                    c.levelSeriesOptions.forEach(k);
                    x(a, "drillup", {seriesOptions: c.seriesPurgedOptions || c.seriesOptions});
                    this.resetZoomButton && this.resetZoomButton.destroy();
                    l.type === h.type &&
                    (l.drilldownLevel = c, l.options.animation = a.options.drilldown.animation, h.animateDrillupFrom && h.chart && h.animateDrillupFrom(c));
                    l.options._levelNumber = d;
                    h.remove(!1);
                    l.xAxis && (e = c.oldExtremes, l.xAxis.setExtremes(e.xMin, e.xMax, !1), l.yAxis.setExtremes(e.yMin, e.yMax, !1));
                    c.resetZoomButton && (a.resetZoomButton = c.resetZoomButton, a.resetZoomButton.show())
                }
                this.redraw();
                0 === this.drilldownLevels.length ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({text: this.getDrilldownBackText()}).align();
                this.ddDupes.length = [];
                x(a, "drillupall")
            }
        };
        m(k, "afterInit", function () {
            var a = this;
            a.drilldown = {
                update: function (b, d) {
                    t(!0, a.options.drilldown, b);
                    u(d, !0) && a.redraw()
                }
            }
        });
        m(k, "afterShowResetZoom", function () {
            var a = this.resetZoomButton && this.resetZoomButton.getBBox(),
                b = this.options.drilldown && this.options.drilldown.drillUpButton;
            this.drillUpButton && a && b && b.position && b.position.x && this.drillUpButton.align({
                x: b.position.x - a.width - 10,
                y: b.position.y,
                align: b.position.align
            }, !1, b.relativeTo || "plotBox")
        });
        m(k,
            "render", function () {
                (this.xAxis || []).forEach(function (a) {
                    a.ddPoints = {};
                    a.series.forEach(function (b) {
                        var d, g = b.xData || [], f = b.points;
                        for (d = 0; d < g.length; d++) {
                            var e = b.options.data[d];
                            "number" !== typeof e && (e = b.pointClass.prototype.optionsToObject.call({series: b}, e), e.drilldown && (a.ddPoints[g[d]] || (a.ddPoints[g[d]] = []), e = d - (b.cropStart || 0), a.ddPoints[g[d]].push(f && 0 <= e && e < f.length ? f[e] : !0)))
                        }
                    });
                    O(a.ticks, D.prototype.drillable)
                })
            });
        r.prototype.animateDrillupTo = function (a) {
            if (!a) {
                var b = this, d = b.drilldownLevel;
                this.points.forEach(function (a) {
                    var b = a.dataLabel;
                    a.graphic && a.graphic.hide();
                    b && (b.hidden = "hidden" === b.attr("visibility"), b.hidden || (b.hide(), a.connector && a.connector.hide()))
                });
                P(function () {
                    if (b.points) {
                        var a = [];
                        b.data.forEach(function (b) {
                            a.push(b)
                        });
                        b.nodes && (a = a.concat(b.nodes));
                        a.forEach(function (a, b) {
                            b = b === (d && d.pointIndex) ? "show" : "fadeIn";
                            var g = "show" === b ? !0 : void 0, c = a.dataLabel;
                            if (a.graphic) a.graphic[b](g);
                            c && !c.hidden && (c.fadeIn(), a.connector && a.connector.fadeIn())
                        })
                    }
                }, Math.max(this.chart.options.drilldown.animation.duration -
                    50, 0));
                delete this.animate
            }
        };
        r.prototype.animateDrilldown = function (a) {
            var b = this, d = this.chart, c = d.drilldownLevels, f, e = E(d.options.drilldown.animation),
                k = this.xAxis, h = d.styledMode;
            a || (c.forEach(function (a) {
                b.options._ddSeriesId === a.lowerSeriesOptions._ddSeriesId && (f = a.shapeArgs, h || (f.fill = a.color))
            }), f.x += u(k.oldPos, k.pos) - k.pos, this.points.forEach(function (a) {
                var d = a.shapeArgs;
                h || (d.fill = a.color);
                a.graphic && a.graphic.attr(f).animate(q(a.shapeArgs, {fill: a.color || b.color}), e);
                a.dataLabel && a.dataLabel.fadeIn(e)
            }),
                delete this.animate)
        };
        r.prototype.animateDrillupFrom = function (a) {
            var b = E(this.chart.options.drilldown.animation), d = this.group, c = d !== this.chart.columnGroup,
                f = this;
            f.trackerGroups.forEach(function (a) {
                if (f[a]) f[a].on("mouseover")
            });
            c && delete this.group;
            this.points.forEach(function (g) {
                var e = g.graphic, h = a.shapeArgs, l = function () {
                    e.destroy();
                    d && c && (d = d.destroy())
                };
                e && h && (delete g.graphic, f.chart.styledMode || (h.fill = a.color), b.duration ? e.animate(h, t(b, {complete: l})) : (e.attr(h), l()))
            })
        };
        w && q(w.prototype, {
            animateDrillupTo: r.prototype.animateDrillupTo,
            animateDrillupFrom: r.prototype.animateDrillupFrom, animateDrilldown: function (a) {
                var b = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
                    d = this.chart.options.drilldown.animation;
                this.is("item") && (d.duration = 0);
                if (this.center) {
                    var c = b.shapeArgs, f = c.start, e = (c.end - f) / this.points.length, k = this.chart.styledMode;
                    a || (this.points.forEach(function (a, g) {
                        var h = a.shapeArgs;
                        k || (c.fill = b.color, h.fill = a.color);
                        if (a.graphic) a.graphic.attr(t(c, {
                            start: f + g * e,
                            end: f + (g + 1) * e
                        }))[d ? "animate" : "attr"](h, d)
                    }),
                        delete this.animate)
                }
            }
        });
        v.prototype.doDrilldown = function (a, b, d) {
            var c = this.series.chart, f = c.options.drilldown, e = (f.series || []).length;
            c.ddDupes || (c.ddDupes = []);
            for (; e-- && !k;) if (f.series[e].id === this.drilldown && -1 === c.ddDupes.indexOf(this.drilldown)) {
                var k = f.series[e];
                c.ddDupes.push(this.drilldown)
            }
            x(c, "drilldown", {
                point: this,
                seriesOptions: k,
                category: b,
                originalEvent: d,
                points: "undefined" !== typeof b && this.series.xAxis.getDDPoints(b).slice(0)
            }, function (b) {
                var d = b.point.series && b.point.series.chart, c =
                    b.seriesOptions;
                d && c && (a ? d.addSingleSeriesAsDrilldown(b.point, c) : d.addSeriesAsDrilldown(b.point, c))
            })
        };
        n.prototype.drilldownCategory = function (a, b) {
            this.getDDPoints(a).forEach(function (d) {
                d && d.series && d.series.visible && d.doDrilldown && d.doDrilldown(!0, a, b)
            });
            this.chart.applyDrilldown()
        };
        n.prototype.getDDPoints = function (a) {
            return this.ddPoints && this.ddPoints[a] || []
        };
        D.prototype.drillable = function () {
            var a = this.pos, b = this.label, d = this.axis, c = "xAxis" === d.coll && d.getDDPoints,
                f = c && d.getDDPoints(a), e = d.chart.styledMode;
            c && (b && f && f.length ? (b.drillable = !0, b.basicStyles || e || (b.basicStyles = t(b.styles)), b.addClass("highcharts-drilldown-axis-label"), b.removeOnDrillableClick && N(b.element, "click"), b.removeOnDrillableClick = m(b.element, "click", function (b) {
                b.preventDefault();
                d.drilldownCategory(a, b)
            }), e || b.css(d.chart.options.drilldown.activeAxisLabelStyle)) : b && b.drillable && b.removeOnDrillableClick && (e || (b.styles = {}, b.css(b.basicStyles)), b.removeOnDrillableClick(), b.removeClass("highcharts-drilldown-axis-label")))
        };
        m(v, "afterInit",
            function () {
                this.drilldown && !this.unbindDrilldownClick && (this.unbindDrilldownClick = m(this, "click", G));
                return this
            });
        m(v, "update", function (a) {
            a = a.options || {};
            a.drilldown && !this.unbindDrilldownClick ? this.unbindDrilldownClick = m(this, "click", G) : !a.drilldown && void 0 !== a.drilldown && this.unbindDrilldownClick && (this.unbindDrilldownClick = this.unbindDrilldownClick())
        });
        var G = function (a) {
            var b = this.series;
            b.xAxis && !1 === b.chart.options.drilldown.allowPointDrilldown ? b.xAxis.drilldownCategory(this.x, a) : this.doDrilldown(void 0,
                void 0, a)
        };
        m(C, "afterDrawDataLabels", function () {
            var a = this.chart.options.drilldown.activeDataLabelStyle, b = this.chart.renderer,
                c = this.chart.styledMode;
            this.points.forEach(function (d) {
                var f = d.options.dataLabels, e = u(d.dlOptions, f && f.style, {});
                d.drilldown && d.dataLabel && ("contrast" !== a.color || c || (e.color = b.getContrast(d.color || this.color)), f && f.color && (e.color = f.color), d.dataLabel.addClass("highcharts-drilldown-data-label"), c || d.dataLabel.css(a).css(e))
            }, this)
        });
        var A = function (a, b, d, c) {
            a[d ? "addClass" :
                "removeClass"]("highcharts-drilldown-point");
            c || a.css({cursor: b})
        };
        m(C, "afterDrawTracker", function () {
            var a = this.chart.styledMode;
            this.points.forEach(function (b) {
                b.drilldown && b.graphic && A(b.graphic, "pointer", !0, a)
            })
        });
        m(v, "afterSetState", function () {
            var a = this.series.chart.styledMode;
            this.drilldown && this.series.halo && "hover" === this.state ? A(this.series.halo, "pointer", !0, a) : this.series.halo && A(this.series.halo, "auto", !1, a)
        });
        m(k, "selection", function (a) {
            !0 === a.resetSelection && this.drillUpButton && (a = this.options.drilldown &&
                this.options.drilldown.drillUpButton) && a.position && this.drillUpButton.align({
                x: a.position.x,
                y: a.position.y,
                align: a.position.align
            }, !1, a.relativeTo || "plotBox")
        });
        m(k, "drillup", function () {
            this.resetZoomButton && (this.resetZoomButton = this.resetZoomButton.destroy())
        })
    });
    n(c, "masters/modules/drilldown.src.js", [], function () {
    })
});
//# sourceMappingURL=drilldown.js.map