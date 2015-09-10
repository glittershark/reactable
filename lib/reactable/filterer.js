(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.filterer = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var FiltererInput = (function (_React$Component) {
        _inherits(FiltererInput, _React$Component);

        function FiltererInput() {
            _classCallCheck(this, FiltererInput);

            _get(Object.getPrototypeOf(FiltererInput.prototype), "constructor", this).apply(this, arguments);
        }

        _createClass(FiltererInput, [{
            key: "onChange",
            value: function onChange() {
                this.props.onFilter(React.findDOMNode(this).value);
            }
        }, {
            key: "render",
            value: function render() {
                return React.createElement("input", { type: "text",
                    className: "reactable-filter-input",
                    placeholder: this.props.placeholder,
                    value: this.props.value,
                    onKeyUp: this.onChange.bind(this),
                    onChange: this.onChange.bind(this) });
            }
        }]);

        return FiltererInput;
    })(React.Component);

    exports.FiltererInput = FiltererInput;
    ;

    var Filterer = (function (_React$Component2) {
        _inherits(Filterer, _React$Component2);

        function Filterer() {
            _classCallCheck(this, Filterer);

            _get(Object.getPrototypeOf(Filterer.prototype), "constructor", this).apply(this, arguments);
        }

        _createClass(Filterer, [{
            key: "render",
            value: function render() {
                if (typeof this.props.colSpan === 'undefined') {
                    throw new TypeError('Must pass a colSpan argument to Filterer');
                }

                return React.createElement(
                    "tr",
                    { className: "reactable-filterer" },
                    React.createElement(
                        "td",
                        { colSpan: this.props.colSpan },
                        React.createElement(FiltererInput, { onFilter: this.props.onFilter,
                            value: this.props.value,
                            placeholder: this.props.placeholder })
                    )
                );
            }
        }]);

        return Filterer;
    })(React.Component);

    exports.Filterer = Filterer;
    ;
});
