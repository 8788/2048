/**
 * @fileOverview util.js
 * @authors @Bubblins(http://weibo.com/607768123)
 * @version 0.1.0
 */

;(function (window, document, undefined) {

    var Tween = {
        linear: function(t,b,c,d) {
            return c*t/d + b;
        },
        easeIn: function(t,b,c,d) {
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t/=d/2) < 1) {
                return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    };


    /**
     * Prevent console error in ie6
     */
    if (!window.console) {
        window.console = {
            log: function() {},
            error: function () {}
        };
    }

    /**
     * trim
     * \uFEFF\xa0\u3000\u00A0: Compatible with the low version of IE
     */
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xa0\u3000\u00A0]+|[\s\uFEFF\xa0\u3000\u00A0]+$/g, '');
        };
    }    


    var util = {
        /**
         * g description
         * @param  {Object} ele  dom element
         * @param  {String} attr attribute
         */
        getStyle: function (ele, attr) {
            return ele.currentStyle ? ele.currentStyle[attr] : getComputedStyle(ele, false)[attr];
        },

        /**
         * get elements by className
         * @param  {String} cls    className
         * @param  {Object} parent parent element
         */
        getByClass: function (cls, parent) {
            parent = parent || document;
            if (parent.getElementsByClassName) {
                return parent.getElementsByClassName(cls);
            }
            var reg = new RegExp('(^|\\s)' + cls + '($|\\s)', 'i');
            var res = [];
            var nodes = parent.getElementsByTagName('*');
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (reg.test(nodes[i].className)) {
                    res.push(nodes[i]);
                }
            }
            return res;
        },

        /**
         * bindEvent
         * @param {Object}     ele     dom element
         * @param {String}     type    event type
         * @param {Function} callback  callback
         */
        bindEvent: function (ele, type, callback) {
            if (ele.addEventListener) {
                ele.addEventListener(type, callback, false);
            } else if (ele.attachEvent) {
                ele.attachEvent('on' + type, function () {
                    callback.call(ele, event);
                });
            } else {
                ele['on'+type] = function (ev) {
                    var oEvent = ev || event;
                    callback(oEvent);
                };
            }
        },

        /**
         * hasClass
         * @param  {Object}    ele dom element
         * @param  {String}    cls className
         * @return {Boolean}     Boolean
         */
        hasClass: function (ele, cls) {
            if (ele.classList) {
                return ele.classList.contains(cls);
            } else {
                var reg = new RegExp('(^|\\s)' + cls + '($|\\s)', 'i');
                return reg.test(ele.className);
            }
        },

        /**
         * addClass
         * @param  {Object}    ele dom element
         * @param  {String}    cls className
         */
        addClass: function (ele, cls) {
            if (!util.hasClass(ele, cls)) {
                if (ele.classList) {
                    ele.classList.add(cls);
                } else {
                    ele.className = (ele.className.trim() + ' ' + cls).trim();
                }
            }
        },    

        /**
         * removeClass
         * @param  {Object}    ele dom element
         * @param  {String}    cls className
         */
        removeClass: function (ele, cls) {
            if (util.hasClass(ele, cls)) {
                if (ele.classList) {
                    ele.classList.remove(cls);
                } else {
                    var reg = new RegExp('(^|\\s+)'+ cls + '($|\\s+)', 'ig');
                    ele.className = ele.className.replace(reg, ' ').trim();
                }
            }
        },

        /**
         * toggleClass
         * @param  {Object}    ele dom element
         * @param  {String}    cls className
         */
        toggleClass: function (ele, cls) {
            if (util.hasClass(ele, cls)) {
                removeClass(ele, cls);
            } else {
                util.addClass(ele, cls);
            }
        },

        /**
         * animate
         * @param  {[type]} ele  dom element
         * @param  {[type]} json attr target
         * @param  {[type]} opts options
         */
        animate: function (ele, json, opts) {
            opts = opts || {};
            opts.duration = opts.duration || 400;
            opts.easing = opts.easing || 'linear';

            var start = + new Date();
            var begin = {};
            for (var attr in json) {
                if (attr === 'opacity') {
                    begin[attr] = Math.round(util.getStyle(ele, attr) * 100);
                } else {
                    begin[attr] = parseInt(util.getStyle(ele, attr), 10);
                }
            }

            clearInterval(ele.timer);
            ele.timer = setInterval(function () {
                var time = Math.min(+ new Date() - start, opts.duration);
                for (var attr in json) {
                    var value = Tween[opts.easing](time, begin[attr], parseInt(json[attr], 10) - begin[attr], opts.duration);
                    if (attr === 'opacity') {
                        ele.style.opacity = value/100;
                        ele.style.filter = 'alpha(opacity = ' + value + ')';
                    } else {
                        ele.style[attr] = value + 'px';
                    }
                }
                if (time >= opts.duration) {
                    clearInterval(ele.timer);
                    opts.complete && opts.complete();
                }
            }, 20);
        }

    };

    window.util = util;

})(window, document);