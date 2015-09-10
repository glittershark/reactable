(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './td', './lib/to_array', './lib/filter_props_from'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./td'), require('./lib/to_array'), require('./lib/filter_props_from'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.td, global.to_array, global.filter_props_from);
        global.tr = mod.exports;
    }
})(this, function (exports, _td, _libTo_array, _libFilter_props_from) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Tr = (function () {
        function Tr() {
            _classCallCheck(this, Tr);
        }

        _createClass(Tr, [{
            key: 'render',
            value: function render() {
                var children = (0, _libTo_array.toArray)(React.Children.children(this.props.children));

                if (this.props.data && this.props.columns && typeof this.props.columns.map === 'function') {
                    if (typeof children.concat === 'undefined') {
                        console.log(children);
                    }

                    children = children.concat(this.props.columns.map((function (column, i) {
                        if (this.props.data.hasOwnProperty(column.key)) {
                            var value = this.props.data[column.key];
                            var props = {};

                            if (typeof value !== 'undefined' && value !== null && value.__reactableMeta === true) {
                                props = value.props;
                                value = value.value;
                            }

                            return React.createElement(
                                _td.Td,
                                _extends({ column: column, key: column.key }, props),
                                value
                            );
                        } else {
                            return React.createElement(_td.Td, { column: column, key: column.key });
                        }
                    }).bind(this)));
                }

                // Manually transfer props
                var props = (0, _libFilter_props_from.filterPropsFrom)(this.props);

                return React.DOM.tr(props, children);
            }
        }]);

        return Tr;
    })();

    exports.Tr = Tr;
    ;

    Tr.childNode = _td.Td;
    Tr.dataType = 'object';
});
