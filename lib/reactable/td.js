(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './lib/is_react_component', './lib/stringable', './unsafe'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./lib/is_react_component'), require('./lib/stringable'), require('./unsafe'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.is_react_component, global.stringable, global.unsafe);
        global.td = mod.exports;
    }
})(this, function (exports, _libIs_react_component, _libStringable, _unsafe) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Td = (function () {
        function Td() {
            _classCallCheck(this, Td);
        }

        _createClass(Td, [{
            key: 'handleClick',
            value: function handleClick(e) {
                if (typeof this.props.handleClick === 'function') {
                    return this.props.handleClick(e, this);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var tdProps = {
                    className: this.props.className,
                    onClick: this.handleClick.bind(this)
                };

                // Attach any properties on the column to this Td object to allow things like custom event handlers
                if (typeof this.props.column === 'object') {
                    for (var key in this.props.column) {
                        if (key !== 'key' && key !== 'name') {
                            tdProps[key] = this.props.column[key];
                        }
                    }
                }

                var data = this.props.data;

                if (typeof this.props.children !== 'undefined') {
                    if ((0, _libIs_react_component.isReactComponent)(this.props.children)) {
                        data = this.props.children;
                    } else if (typeof this.props.data === 'undefined' && (0, _libStringable.stringable)(this.props.children)) {
                        data = this.props.children.toString();
                    }

                    if ((0, _unsafe.isUnsafe)(this.props.children)) {
                        tdProps.dangerouslySetInnerHTML = { __html: this.props.children.toString() };
                    } else {
                        tdProps.children = data;
                    }
                }

                return React.createElement('td', tdProps);
            }
        }]);

        return Td;
    })();

    exports.Td = Td;
    ;
});
