'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libIs_react_component = require('./lib/is_react_component');

var _libStringable = require('./lib/stringable');

var _unsafe = require('./unsafe');

var Td = (function (_React$Component) {
    _inherits(Td, _React$Component);

    function Td() {
        _classCallCheck(this, Td);

        _get(Object.getPrototypeOf(Td.prototype), 'constructor', this).apply(this, arguments);
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

            return _react2['default'].createElement('td', tdProps);
        }
    }]);

    return Td;
})(_react2['default'].Component);

exports.Td = Td;
;
