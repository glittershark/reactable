(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './unsafe', './lib/filter_props_from'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./unsafe'), require('./lib/filter_props_from'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.unsafe, global.filter_props_from);
        global.th = mod.exports;
    }
})(this, function (exports, _unsafe, _libFilter_props_from) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Th = (function () {
        function Th() {
            _classCallCheck(this, Th);
        }

        _createClass(Th, [{
            key: 'render',
            value: function render() {
                var childProps = undefined;

                if ((0, _unsafe.isUnsafe)(this.props.children)) {
                    return React.createElement('th', _extends({}, (0, _libFilter_props_from.filterPropsFrom)(this.props), {
                        dangerouslySetInnerHTML: { __html: this.props.children.toString() } }));
                } else {
                    return React.createElement(
                        'th',
                        (0, _libFilter_props_from.filterPropsFrom)(this.props),
                        this.props.children
                    );
                }
            }
        }]);

        return Th;
    })();

    exports.Th = Th;
    ;
});
