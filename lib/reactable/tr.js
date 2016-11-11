'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _td = require('./td');

var _libTo_array = require('./lib/to_array');

var _libFilter_props_from = require('./lib/filter_props_from');

var _libExtend = require('./lib/extend');

var Tr = (function (_React$Component) {
    _inherits(Tr, _React$Component);

    function Tr() {
        _classCallCheck(this, Tr);

        _get(Object.getPrototypeOf(Tr.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Tr, [{
        key: 'isRowSpanSkip',

        /**
         * Determines whether a row should skip the creation of a <Td> based on the rowSpan prop
         * @param state the state of the column
         * @param data the data
         * @param k the column key
         * @returns {boolean}
         */
        value: function isRowSpanSkip(state, data, k) {
            var rowSpanSkip = false;

            // if we have already noted this <Td> has a row span, we will use the stored state to make
            //  a determination whether we render or skip
            if (typeof state.rowSpanDebt !== 'undefined' && state.rowSpanDebt > 0) {
                //anything greater than 0, we skip render and decrement
                rowSpanSkip = true;
                state.rowSpanDebt--;
            }

            if (typeof data[k] !== 'undefined' && data[k] != null) {
                var props = data[k].props;

                // check if this column will be spanning multiple rows
                if (typeof props !== 'undefined' && typeof props.rowSpan !== 'undefined') {
                    if (isNaN(props.rowSpan)) {
                        console.warn("rowSpan for column " + k + " is not a valid integer: " + props.rowSpan);
                        return false;
                    }

                    if (!rowSpanSkip) {
                        // restart the rowSpanCount for this column: subtract 1 as all rows will have rowSpan of at least 1
                        state.rowSpanDebt = props.rowSpan - 1;
                    }
                }
            }
            return rowSpanSkip;
        }

        /**
         * Build all <Td> elements to be displayed in this <Tr>
         * @returns {Array}
         */
    }, {
        key: 'buildRows',
        value: function buildRows(renderState) {
            var columns = this.props.columns;
            var tds = [];

            // iterate through all columns and create a <Td> for each one
            for (var idx = 0; idx < columns.length; idx++) {
                var _columns$idx = columns[idx];
                var _columns$idx$props = _columns$idx.props;
                var props = _columns$idx$props === undefined ? {} : _columns$idx$props;

                var column = _objectWithoutProperties(_columns$idx, ['props']);

                var state = renderState[column.key];
                if (typeof state === 'undefined') {
                    state = {};
                    renderState[column.key] = state;
                }

                var skip = this.isRowSpanSkip(state, this.props.data, column.key);
                if (skip) {
                    continue; // skip render of <Td>
                }

                if (this.props.data.hasOwnProperty(column.key)) {
                    var value = this.props.data[column.key];

                    if (typeof value !== 'undefined' && value !== null && value.__reactableMeta === true) {
                        // merge the props
                        props = (0, _libExtend.extend)(props, value.props);
                        value = value.value;
                    }

                    tds.push(_react2['default'].createElement(
                        _td.Td,
                        _extends({ column: column, key: column.key }, props),
                        value
                    ));
                } else {
                    tds.push(_react2['default'].createElement(_td.Td, { column: column, key: column.key }));
                }
            }
            return tds;
        }
    }, {
        key: 'render',
        value: function render() {
            var children = (0, _libTo_array.toArray)(_react2['default'].Children.children(this.props.children));

            // Manually transfer props

            var _filterPropsFrom = (0, _libFilter_props_from.filterPropsFrom)(this.props);

            var renderState = _filterPropsFrom.renderState;

            var props = _objectWithoutProperties(_filterPropsFrom, ['renderState']);

            if (this.props.data && this.props.columns && typeof this.props.columns.map === 'function') {
                if (typeof children.concat === 'undefined') {
                    console.log(children);
                }
                var trs = this.buildRows.call(this, renderState);
                children = children.concat(trs);
            }

            return _react2['default'].DOM.tr(props, children);
        }
    }]);

    return Tr;
})(_react2['default'].Component);

exports.Tr = Tr;

Tr.childNode = _td.Td;
Tr.dataType = 'object';
