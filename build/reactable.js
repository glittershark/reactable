window.React["default"] = window.React;
window.ReactDOM["default"] = window.ReactDOM;
window.PropTypes["default"] = window.PropTypes;
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
        global.filter_props_from = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    exports.filterPropsFrom = filterPropsFrom;
    var internalProps = {
        hideTableHeader: true,
        column: true,
        columns: true,
        sortable: true,
        filterable: true,
        filtering: true,
        onFilter: true,
        filterPlaceholder: true,
        filterClassName: true,
        currentFilter: true,
        sort: true,
        sortBy: true,
        sortableColumns: true,
        onSort: true,
        defaultSort: true,
        defaultSortDescending: true,
        itemsPerPage: true,
        filterBy: true,
        hideFilterInput: true,
        noDataText: true,
        currentPage: true,
        onPageChange: true,
        previousPageLabel: true,
        nextPageLabel: true,
        pageButtonLimit: true,
        childNode: true,
        data: true,
        children: true
    };

    function filterPropsFrom(baseProps) {
        baseProps = baseProps || {};
        var props = {};
        for (var key in baseProps) {
            if (!(key in internalProps)) {
                props[key] = baseProps[key];
            }
        }

        return props;
    }
});

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
        global.to_array = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    exports.toArray = toArray;

    function toArray(obj) {
        var ret = [];
        for (var attr in obj) {
            ret[attr] = obj;
        }

        return ret;
    }
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.stringable = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    exports.stringable = stringable;

    function stringable(thing) {
        return thing !== null && typeof thing !== 'undefined' && typeof (thing.toString === 'function');
    }
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './stringable'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./stringable'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.stringable);
        global.extract_data_from = mod.exports;
    }
})(this, function (exports, _stringable) {
    'use strict';

    exports.extractDataFrom = extractDataFrom;

    function extractDataFrom(key, column) {
        var value;
        if (typeof key !== 'undefined' && key !== null && key.__reactableMeta === true) {
            value = key.data[column];
        } else {
            value = key[column];
        }

        if (typeof value !== 'undefined' && value !== null && value.__reactableMeta === true) {
            value = typeof value.props.value !== 'undefined' && value.props.value !== null ? value.props.value : value.value;
        }

        return (0, _stringable.stringable)(value) ? value : '';
    }
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.determine_row_span = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    exports.determineRowSpan = determineRowSpan;

    function determineRowSpan(row, colName) {

        var rowSpan = 1;

        if (typeof row !== 'undefined' && row != null) {
            var tdData = null;

            if (typeof row.props !== 'undefined' && row.props !== null && row.props.data !== null) {
                tdData = row.props.data;
            } else if (typeof row[colName] !== 'undefined') {
                tdData = row;
            }

            if (typeof tdData !== 'undefined' && tdData !== null) {
                var props = tdData[colName].props;
                if (typeof props !== 'undefined' && typeof props.rowSpan !== 'undefined') {
                    rowSpan = parseInt(props.rowSpan);
                }
            }
        }

        return rowSpan;
    }
});

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
        global.extend = mod.exports;
    }
})(this, function (exports) {
    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    "use strict";

    exports.extend = extend;

    function extend(defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }

    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.is_react_component = mod.exports;
    }
})(this, function (exports) {
    // this is a bit hacky - it'd be nice if React exposed an API for this
    'use strict';

    exports.isReactComponent = isReactComponent;

    function isReactComponent(thing) {
        return thing !== null && typeof thing === 'object' && typeof thing.props !== 'undefined';
    }
});

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
        global.unsafe = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    exports.unsafe = unsafe;
    exports.isUnsafe = isUnsafe;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Unsafe = (function () {
        function Unsafe(content) {
            _classCallCheck(this, Unsafe);

            this.content = content;
        }

        _createClass(Unsafe, [{
            key: "toString",
            value: function toString() {
                return this.content;
            }
        }]);

        return Unsafe;
    })();

    function unsafe(str) {
        return new Unsafe(str);
    }

    ;

    function isUnsafe(obj) {
        return obj instanceof Unsafe;
    }

    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', 'react-dom'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('react-dom'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.ReactDOM);
        global.filterer = mod.exports;
    }
})(this, function (exports, _react, _reactDom) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var FiltererInput = (function (_React$Component) {
        _inherits(FiltererInput, _React$Component);

        function FiltererInput() {
            _classCallCheck(this, FiltererInput);

            _get(Object.getPrototypeOf(FiltererInput.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(FiltererInput, [{
            key: 'onChange',
            value: function onChange() {
                this.props.onFilter(_reactDom['default'].findDOMNode(this).value);
            }
        }, {
            key: 'render',
            value: function render() {
                return _react['default'].createElement('input', { type: 'text',
                    className: this.props.className,
                    placeholder: this.props.placeholder,
                    value: this.props.value,
                    onKeyUp: this.onChange.bind(this),
                    onChange: this.onChange.bind(this) });
            }
        }]);

        return FiltererInput;
    })(_react['default'].Component);

    exports.FiltererInput = FiltererInput;
    ;

    var Filterer = (function (_React$Component2) {
        _inherits(Filterer, _React$Component2);

        function Filterer() {
            _classCallCheck(this, Filterer);

            _get(Object.getPrototypeOf(Filterer.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Filterer, [{
            key: 'render',
            value: function render() {
                if (typeof this.props.colSpan === 'undefined') {
                    throw new TypeError('Must pass a colSpan argument to Filterer');
                }

                return _react['default'].createElement(
                    'tr',
                    { className: 'reactable-filterer' },
                    _react['default'].createElement(
                        'td',
                        { colSpan: this.props.colSpan },
                        _react['default'].createElement(FiltererInput, { onFilter: this.props.onFilter,
                            value: this.props.value,
                            placeholder: this.props.placeholder,
                            className: this.props.className ? 'reactable-filter-input ' + this.props.className : 'reactable-filter-input' })
                    )
                );
            }
        }]);

        return Filterer;
    })(_react['default'].Component);

    exports.Filterer = Filterer;
    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.sort = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    var Sort = {
        Numeric: function Numeric(a, b) {
            var valA = parseFloat(a.toString().replace(/,/g, ''));
            var valB = parseFloat(b.toString().replace(/,/g, ''));

            // Sort non-numeric values alphabetically at the bottom of the list
            if (isNaN(valA) && isNaN(valB)) {
                valA = a;
                valB = b;
            } else {
                if (isNaN(valA)) {
                    return 1;
                }
                if (isNaN(valB)) {
                    return -1;
                }
            }

            if (valA < valB) {
                return -1;
            }
            if (valA > valB) {
                return 1;
            }

            return 0;
        },

        NumericInteger: function NumericInteger(a, b) {
            if (isNaN(a) || isNaN(b)) {
                return a > b ? 1 : -1;
            }

            return a - b;
        },

        Currency: function Currency(a, b) {
            // Parse out dollar signs, then do a regular numeric sort
            a = a.replace(/[^0-9\.\-\,]+/g, '');
            b = b.replace(/[^0-9\.\-\,]+/g, '');

            return exports.Sort.Numeric(a, b);
        },

        Date: (function (_Date) {
            function Date(_x, _x2) {
                return _Date.apply(this, arguments);
            }

            Date.toString = function () {
                return _Date.toString();
            };

            return Date;
        })(function (a, b) {
            // Note: this function tries to do a standard javascript string -> date conversion
            // If you need more control over the date string format, consider using a different
            // date library and writing your own function
            var valA = Date.parse(a);
            var valB = Date.parse(b);

            // Handle non-date values with numeric sort
            // Sort non-numeric values alphabetically at the bottom of the list
            if (isNaN(valA) || isNaN(valB)) {
                return exports.Sort.Numeric(a, b);
            }

            if (valA > valB) {
                return 1;
            }
            if (valB > valA) {
                return -1;
            }

            return 0;
        }),

        CaseInsensitive: function CaseInsensitive(a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        }
    };
    exports.Sort = Sort;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './lib/is_react_component', './lib/stringable', './unsafe', './lib/filter_props_from'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./lib/is_react_component'), require('./lib/stringable'), require('./unsafe'), require('./lib/filter_props_from'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.is_react_component, global.stringable, global.unsafe, global.filter_props_from);
        global.td = mod.exports;
    }
})(this, function (exports, _react, _libIs_react_component, _libStringable, _unsafe, _libFilter_props_from) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var Td = (function (_React$Component) {
        _inherits(Td, _React$Component);

        function Td() {
            _classCallCheck(this, Td);

            _get(Object.getPrototypeOf(Td.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Td, [{
            key: 'stringifyIfNotReactComponent',
            value: function stringifyIfNotReactComponent(object) {
                if (!(0, _libIs_react_component.isReactComponent)(object) && (0, _libStringable.stringable)(object) && typeof object !== 'undefined') {
                    return object.toString();
                }
                return null;
            }
        }, {
            key: 'render',
            value: function render() {
                // Attach any properties on the column to this Td object to allow things like custom event handlers
                var mergedProps = (0, _libFilter_props_from.filterPropsFrom)(this.props);
                if (typeof this.props.column === 'object') {
                    for (var key in this.props.column) {
                        if (key !== 'key' && key !== 'name') {
                            mergedProps[key] = this.props.column[key];
                        }
                    }
                }
                // handleClick aliases onClick event
                mergedProps.onClick = this.props.handleClick;

                // remove property to avoid unknown prop warning
                delete mergedProps.handleClick;

                var stringifiedChildProps;

                if (typeof this.props.data === 'undefined') {
                    stringifiedChildProps = this.stringifyIfNotReactComponent(this.props.children);
                }

                if ((0, _unsafe.isUnsafe)(this.props.children)) {
                    return _react['default'].createElement('td', _extends({}, mergedProps, {
                        dangerouslySetInnerHTML: { __html: this.props.children.toString() } }));
                } else {
                    return _react['default'].createElement(
                        'td',
                        mergedProps,
                        stringifiedChildProps || this.props.children
                    );
                }
            }
        }]);

        return Td;
    })(_react['default'].Component);

    exports.Td = Td;
    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './td', './lib/to_array', './lib/filter_props_from', './lib/extend'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./td'), require('./lib/to_array'), require('./lib/filter_props_from'), require('./lib/extend'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.td, global.to_array, global.filter_props_from, global.extend);
        global.tr = mod.exports;
    }
})(this, function (exports, _react, _td, _libTo_array, _libFilter_props_from, _libExtend) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

                var columnsToSkip = 0;
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

                    if (columnsToSkip > 0) {
                        columnsToSkip--;
                        continue;
                    }

                    if (this.props.data.hasOwnProperty(column.key)) {
                        var value = this.props.data[column.key];
                        var componentType = _td.Td;

                        if (typeof value !== 'undefined' && value !== null && value.__reactableMeta === true) {
                            // merge the props
                            props = (0, _libExtend.extend)(props, value.props);
                            componentType = value.component || componentType;
                            value = value.value;
                        }

                        var colSpan = props.colSpan || 1;

                        // we will use 1 column (ourself), no need to skip that
                        columnsToSkip = colSpan - 1;

                        props.column = column;
                        props.key = column.key;
                        props.children = value;
                        tds.push(_react['default'].createElement(componentType, props));
                    } else {
                        tds.push(_react['default'].createElement(_td.Td, { column: column, key: column.key }));
                    }
                }
                return tds;
            }
        }, {
            key: 'render',
            value: function render() {
                var children = (0, _libTo_array.toArray)(_react['default'].Children.children(this.props.children));

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

                return _react['default'].createElement("tr", props, children);
            }
        }]);

        return Tr;
    })(_react['default'].Component);

    exports.Tr = Tr;

    Tr.childNode = _td.Td;
    Tr.dataType = 'object';
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './unsafe', './lib/filter_props_from'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./unsafe'), require('./lib/filter_props_from'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.unsafe, global.filter_props_from);
        global.th = mod.exports;
    }
})(this, function (exports, _react, _unsafe, _libFilter_props_from) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var Th = (function (_React$Component) {
        _inherits(Th, _React$Component);

        function Th() {
            _classCallCheck(this, Th);

            _get(Object.getPrototypeOf(Th.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Th, [{
            key: 'render',
            value: function render() {
                var childProps = undefined;

                if ((0, _unsafe.isUnsafe)(this.props.children)) {
                    return _react['default'].createElement('th', _extends({}, (0, _libFilter_props_from.filterPropsFrom)(this.props), {
                        dangerouslySetInnerHTML: { __html: this.props.children.toString() } }));
                } else {
                    return _react['default'].createElement(
                        'th',
                        (0, _libFilter_props_from.filterPropsFrom)(this.props),
                        this.props.children
                    );
                }
            }
        }]);

        return Th;
    })(_react['default'].Component);

    exports.Th = Th;
    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './th', './filterer', './lib/filter_props_from'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./th'), require('./filterer'), require('./lib/filter_props_from'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.th, global.filterer, global.filter_props_from);
        global.thead = mod.exports;
    }
})(this, function (exports, _react, _th, _filterer, _libFilter_props_from) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var Thead = (function (_React$Component) {
        _inherits(Thead, _React$Component);

        function Thead() {
            _classCallCheck(this, Thead);

            _get(Object.getPrototypeOf(Thead.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Thead, [{
            key: 'handleClickTh',
            value: function handleClickTh(column) {
                this.props.onSort(column.key);
            }
        }, {
            key: 'handleKeyDownTh',
            value: function handleKeyDownTh(column, event) {
                if (event.keyCode === 13) {
                    this.props.onSort(column.key);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                // Declare the list of Ths
                var Ths = [];
                for (var index = 0; index < this.props.columns.length; index++) {
                    var column = this.props.columns[index];
                    var thClass = 'reactable-th-' + column.key.replace(/\s+/g, '-').toLowerCase();
                    var sortClass = '';
                    var thRole = null;

                    if (this.props.sortableColumns[column.key]) {
                        sortClass += 'reactable-header-sortable ';
                        thRole = 'button';
                    }

                    if (this.props.sort.column === column.key) {
                        sortClass += 'reactable-header-sort';
                        if (this.props.sort.direction === 1) {
                            sortClass += '-asc';
                        } else {
                            sortClass += '-desc';
                        }
                    }

                    if (sortClass.length > 0) {
                        thClass += ' ' + sortClass;
                    }

                    if (typeof column.props === 'object' && typeof column.props.className === 'string') {
                        thClass += ' ' + column.props.className;
                    }

                    Ths.push(_react['default'].createElement(
                        _th.Th,
                        _extends({}, column.props, {
                            className: thClass,
                            key: index,
                            onClick: this.handleClickTh.bind(this, column),
                            onKeyDown: this.handleKeyDownTh.bind(this, column),
                            role: thRole,
                            tabIndex: '0' }),
                        column.content || column.label
                    ));
                }

                // Manually transfer props
                var props = (0, _libFilter_props_from.filterPropsFrom)(this.props);

                return _react['default'].createElement(
                    'thead',
                    props,
                    this.props.filtering === true ? _react['default'].createElement(_filterer.Filterer, {
                        colSpan: this.props.columns.length,
                        onFilter: this.props.onFilter,
                        placeholder: this.props.filterPlaceholder,
                        value: this.props.currentFilter,
                        className: this.props.filterClassName
                    }) : null,
                    _react['default'].createElement(
                        'tr',
                        { className: 'reactable-column-header' },
                        Ths
                    )
                );
            }
        }], [{
            key: 'getColumns',
            value: function getColumns(component) {
                // Can't use React.Children.map since that doesn't return a proper array
                var columns = [];
                _react['default'].Children.forEach(component.props.children, function (th) {
                    var column = {};
                    if (!th) return;
                    if (typeof th.props !== 'undefined') {
                        column.props = (0, _libFilter_props_from.filterPropsFrom)(th.props);

                        // use the content as the label & key
                        if (typeof th.props.children !== 'undefined') {
                            column.label = th.props.label || th.props.children;
                            column.content = th.props.children || th.props.label;
                            column.key = column.label;
                        }

                        // the key in the column attribute supersedes the one defined previously
                        if (typeof th.props.column === 'string') {
                            column.key = th.props.column;

                            // in case we don't have a label yet
                            if (typeof column.label === 'undefined') {
                                column.label = column.key;
                            }
                        }
                    }

                    if (typeof column.key === 'undefined') {
                        throw new TypeError('<th> must have either a "column" property or a string ' + 'child');
                    } else {
                        columns.push(column);
                    }
                });

                return columns;
            }
        }]);

        return Thead;
    })(_react['default'].Component);

    exports.Thead = Thead;
    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React);
        global.tfoot = mod.exports;
    }
})(this, function (exports, _react) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var Tfoot = (function (_React$Component) {
        _inherits(Tfoot, _React$Component);

        function Tfoot() {
            _classCallCheck(this, Tfoot);

            _get(Object.getPrototypeOf(Tfoot.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Tfoot, [{
            key: 'render',
            value: function render() {
                return _react['default'].createElement('tfoot', this.props);
            }
        }]);

        return Tfoot;
    })(_react['default'].Component);

    exports.Tfoot = Tfoot;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React);
        global.paginator = mod.exports;
    }
})(this, function (exports, _react) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function pageHref(num) {
        return '#page-' + (num + 1);
    }

    var Paginator = (function (_React$Component) {
        _inherits(Paginator, _React$Component);

        function Paginator() {
            _classCallCheck(this, Paginator);

            _get(Object.getPrototypeOf(Paginator.prototype), 'constructor', this).apply(this, arguments);
        }

        _createClass(Paginator, [{
            key: 'handlePrevious',
            value: function handlePrevious(e) {
                e.preventDefault();
                this.props.onPageChange(this.props.currentPage - 1);
            }
        }, {
            key: 'handleNext',
            value: function handleNext(e) {
                e.preventDefault();
                this.props.onPageChange(this.props.currentPage + 1);
            }
        }, {
            key: 'handlePageButton',
            value: function handlePageButton(page, e) {
                e.preventDefault();
                this.props.onPageChange(page);
            }
        }, {
            key: 'renderPrevious',
            value: function renderPrevious() {
                if (this.props.currentPage > 0) {
                    return _react['default'].createElement(
                        'a',
                        { className: 'reactable-previous-page',
                            href: pageHref(this.props.currentPage - 1),
                            onClick: this.handlePrevious.bind(this) },
                        this.props.previousPageLabel || 'Previous'
                    );
                }
            }
        }, {
            key: 'renderNext',
            value: function renderNext() {
                if (this.props.currentPage < this.props.numPages - 1) {
                    return _react['default'].createElement(
                        'a',
                        { className: 'reactable-next-page',
                            href: pageHref(this.props.currentPage + 1),
                            onClick: this.handleNext.bind(this) },
                        this.props.nextPageLabel || 'Next'
                    );
                }
            }
        }, {
            key: 'renderPageButton',
            value: function renderPageButton(className, pageNum) {

                return _react['default'].createElement(
                    'a',
                    { className: className,
                        key: pageNum,
                        href: pageHref(pageNum),
                        onClick: this.handlePageButton.bind(this, pageNum) },
                    pageNum + 1
                );
            }
        }, {
            key: 'render',
            value: function render() {
                if (typeof this.props.colSpan === 'undefined') {
                    throw new TypeError('Must pass a colSpan argument to Paginator');
                }

                if (typeof this.props.numPages === 'undefined') {
                    throw new TypeError('Must pass a non-zero numPages argument to Paginator');
                }

                if (typeof this.props.currentPage === 'undefined') {
                    throw new TypeError('Must pass a currentPage argument to Paginator');
                }

                var pageButtons = [];
                var pageButtonLimit = this.props.pageButtonLimit;
                var currentPage = this.props.currentPage;
                var numPages = this.props.numPages;
                var lowerHalf = Math.round(pageButtonLimit / 2);
                var upperHalf = pageButtonLimit - lowerHalf;

                for (var i = 0; i < this.props.numPages; i++) {
                    var showPageButton = false;
                    var pageNum = i;
                    var className = "reactable-page-button";
                    if (currentPage === i) {
                        className += " reactable-current-page";
                    }
                    pageButtons.push(this.renderPageButton(className, pageNum));
                }

                if (currentPage - pageButtonLimit + lowerHalf > 0) {
                    if (currentPage > numPages - lowerHalf) {
                        pageButtons.splice(0, numPages - pageButtonLimit);
                    } else {
                        pageButtons.splice(0, currentPage - pageButtonLimit + lowerHalf);
                    }
                }

                if (numPages - currentPage > upperHalf) {
                    pageButtons.splice(pageButtonLimit, pageButtons.length - pageButtonLimit);
                }

                return _react['default'].createElement(
                    'tbody',
                    { className: 'reactable-pagination' },
                    _react['default'].createElement(
                        'tr',
                        null,
                        _react['default'].createElement(
                            'td',
                            { colSpan: this.props.colSpan },
                            this.renderPrevious(),
                            pageButtons,
                            this.renderNext()
                        )
                    )
                );
            }
        }]);

        return Paginator;
    })(_react['default'].Component);

    exports.Paginator = Paginator;
    ;
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './lib/filter_props_from', './lib/extract_data_from', './lib/determine_row_span', './lib/extend', './unsafe', './thead', './th', './tr', './tfoot', './paginator', 'prop-types'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./lib/filter_props_from'), require('./lib/extract_data_from'), require('./lib/determine_row_span'), require('./lib/extend'), require('./unsafe'), require('./thead'), require('./th'), require('./tr'), require('./tfoot'), require('./paginator'), require('prop-types'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.filter_props_from, global.extract_data_from, global.determine_row_span, global.extend, global.unsafe, global.thead, global.th, global.tr, global.tfoot, global.paginator, global.PropTypes);
        global.table = mod.exports;
    }
})(this, function (exports, _react, _libFilter_props_from, _libExtract_data_from, _libDetermine_row_span, _libExtend, _unsafe, _thead, _th, _tr, _tfoot, _paginator, _propTypes) {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var Table = (function (_React$Component) {
        _inherits(Table, _React$Component);

        function Table(props) {
            _classCallCheck(this, Table);

            _get(Object.getPrototypeOf(Table.prototype), 'constructor', this).call(this, props);

            this.state = {
                currentPage: this.props.currentPage ? this.props.currentPage : 0,
                currentSort: {
                    column: null,
                    direction: this.props.defaultSortDescending ? -1 : 1
                },
                filter: ''
            };

            // Set the state of the current sort to the default sort
            if (props.sortBy !== false || props.defaultSort !== false) {
                var sortingColumn = props.sortBy || props.defaultSort;
                this.state.currentSort = this.getCurrentSort(sortingColumn);
            }

            // used for generating a key for a <Tr> that will change <Td> counts -- avoids jitters in the update
            this.cloneIndex = 0;
            this.renderNoDataComponent = this.renderNoDataComponent.bind(this);
        }

        _createClass(Table, [{
            key: 'filterBy',
            value: function filterBy(filter) {
                this.setState({ filter: filter });
            }

            // Translate a user defined column array to hold column objects if strings are specified
            // (e.g. ['column1'] => [{key: 'column1', label: 'column1'}])
        }, {
            key: 'translateColumnsArray',
            value: function translateColumnsArray(columns) {
                return columns.map((function (column, i) {
                    if (typeof column === 'string') {
                        return {
                            key: column,
                            label: column
                        };
                    } else {
                        if (typeof column.sortable !== 'undefined') {
                            var sortFunction = column.sortable === true ? 'default' : column.sortable;
                            this._sortable[column.key] = sortFunction;
                        }

                        return column;
                    }
                }).bind(this));
            }
        }, {
            key: 'parseChildData',
            value: function parseChildData(props) {
                var data = [],
                    tfoot = undefined;

                // Transform any children back to a data array
                if (typeof props.children !== 'undefined') {
                    _react['default'].Children.forEach(props.children, (function (child) {
                        if (typeof child === 'undefined' || child === null) {
                            return;
                        }

                        switch (child.type) {
                            case _thead.Thead:
                                break;
                            case _tfoot.Tfoot:
                                if (typeof tfoot !== 'undefined') {
                                    console.warn('You can only have one <Tfoot>, but more than one was specified.' + 'Ignoring all but the last one');
                                }
                                tfoot = child;
                                break;
                            case _tr.Tr:
                                var childData = child.props.data || {};

                                _react['default'].Children.forEach(child.props.children, function (descendant) {
                                    // TODO
                                    /* if (descendant.type.ConvenienceConstructor === Td) { */
                                    if (typeof descendant !== 'object' || descendant == null) {
                                        return;
                                    } else if (typeof descendant.props.column !== 'undefined') {
                                        var value = undefined;

                                        if (typeof descendant.props.data !== 'undefined') {
                                            value = descendant.props.data;
                                        } else if (typeof descendant.props.children !== 'undefined') {
                                            value = descendant.props.children;
                                        } else {
                                            var warning = 'exports.Td specified without ' + 'a `data` property or children, ignoring';
                                            if (typeof descendant.props.column !== 'undefined') {
                                                warning += '. See definition for column \'' + descendant.props.column + '\'.';
                                            }
                                            console.warn(warning);
                                            return;
                                        }

                                        childData[descendant.props.column] = {
                                            value: value,
                                            component: descendant.type,
                                            props: (0, _libFilter_props_from.filterPropsFrom)(descendant.props),
                                            __reactableMeta: true
                                        };
                                    } else {
                                        console.warn('exports.Td specified without a ' + '`column` property, ignoring');
                                    }
                                });

                                data.push({
                                    data: childData,
                                    props: (0, _libFilter_props_from.filterPropsFrom)(child.props),
                                    __reactableMeta: true
                                });
                                break;

                            default:
                                console.warn('The only possible children of <Table> are <Thead>, <Tr>, ' + 'or one <Tfoot>.');
                        }
                    }).bind(this));
                }

                return { data: data, tfoot: tfoot };
            }
        }, {
            key: 'initialize',
            value: function initialize(props) {
                this.data = props.data || [];

                var _parseChildData = this.parseChildData(props);

                var data = _parseChildData.data;
                var tfoot = _parseChildData.tfoot;

                this.data = this.data.concat(data);
                this.tfoot = tfoot;

                this.initializeSorts(props);
                this.initializeFilters(props);
            }
        }, {
            key: 'initializeFilters',
            value: function initializeFilters(props) {
                this._filterable = {};
                // Transform filterable properties into a more friendly list
                for (var i in props.filterable) {
                    var column = props.filterable[i];
                    var columnName = undefined,
                        filterFunction = undefined;

                    if (column instanceof Object) {
                        if (typeof column.column !== 'undefined') {
                            columnName = column.column;
                        } else {
                            console.warn('Filterable column specified without column name');
                            continue;
                        }

                        if (typeof column.filterFunction === 'function') {
                            filterFunction = column.filterFunction;
                        } else {
                            filterFunction = 'default';
                        }
                    } else {
                        columnName = column;
                        filterFunction = 'default';
                    }

                    this._filterable[columnName] = filterFunction;
                }
            }
        }, {
            key: 'initializeSorts',
            value: function initializeSorts(props) {
                this._sortable = {};
                // Transform sortable properties into a more friendly list
                for (var i in props.sortable) {
                    var column = props.sortable[i];
                    var columnName = undefined,
                        sortFunction = undefined;

                    if (column instanceof Object) {
                        if (typeof column.column !== 'undefined') {
                            columnName = column.column;
                        } else {
                            console.warn('Sortable column specified without column name');
                            return;
                        }

                        if (typeof column.sortFunction === 'function') {
                            sortFunction = column.sortFunction;
                        } else {
                            sortFunction = 'default';
                        }
                    } else {
                        columnName = column;
                        sortFunction = 'default';
                    }

                    this._sortable[columnName] = sortFunction;
                }
            }
        }, {
            key: 'getCurrentSort',
            value: function getCurrentSort(column) {
                var columnName = undefined,
                    sortDirection = undefined;

                if (column instanceof Object) {
                    if (typeof column.column !== 'undefined') {
                        columnName = column.column;
                    } else {
                        console.warn('Default column specified without column name');
                        return;
                    }

                    if (typeof column.direction !== 'undefined') {
                        if (column.direction === 1 || column.direction === 'asc') {
                            sortDirection = 1;
                        } else if (column.direction === -1 || column.direction === 'desc') {
                            sortDirection = -1;
                        } else {
                            var defaultDirection = this.props.defaultSortDescending ? 'descending' : 'ascending';

                            console.warn('Invalid default sort specified. Defaulting to ' + defaultDirection);
                            sortDirection = this.props.defaultSortDescending ? -1 : 1;
                        }
                    } else {
                        sortDirection = this.props.defaultSortDescending ? -1 : 1;
                    }
                } else {
                    columnName = column;
                    sortDirection = this.props.defaultSortDescending ? -1 : 1;
                }

                return {
                    column: columnName,
                    direction: sortDirection
                };
            }
        }, {
            key: 'updateCurrentSort',
            value: function updateCurrentSort(sortBy) {
                if (sortBy !== false && sortBy.column !== this.state.currentSort.column && sortBy.direction !== this.state.currentSort.direction) {

                    this.setState({ currentSort: this.getCurrentSort(sortBy) });
                }
            }
        }, {
            key: 'updateCurrentPage',
            value: function updateCurrentPage(nextPage) {
                if (typeof nextPage !== 'undefined' && nextPage !== this.state.currentPage) {
                    this.setState({ currentPage: nextPage });
                }
            }
        }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
                this.initialize(this.props);
                this.sortByCurrentSort();
                this.filterBy(this.props.filterBy);
            }
        }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                this.initialize(nextProps);
                this.updateCurrentPage(nextProps.currentPage);
                this.updateCurrentSort(nextProps.sortBy);
                this.sortByCurrentSort();
                this.filterBy(nextProps.filterBy);
            }
        }, {
            key: 'applyFilter',
            value: function applyFilter(filter, children) {
                var _this = this;

                // Helper function to apply filter text to a list of table rows
                filter = filter.toLowerCase();

                /**
                 * We face two problems when trying to filter with rowSpan:
                 *  1) what happens when the row that specifies the <Td> with the row span is filtered out?
                 *       move the rowSpan definition to the next visible row and adjust the rowSpan value to exclude
                 *                 all the filtered out rows (e.g. if we have a rowSpan=5 and the 1st and 5th row are filtered
                 *                 out, the rowSpan property & value shifts to row 2 and rowSpan now becomes 3)
                 *
                 *  2) what happens when the row/cell that specifies the rowSpan matches the text:
                 *       immediately include all the subsequent rows the that the <Td> spans in the result list.
                 *
                 */

                var matchedChildren = {}; // row index => the matched data

                // houses the rowSpan definition for each row/columnName combo (e.g. [0]['Name'] provides the rowSpan definition
                //  for the item at row 0 in the 'Name' column
                var rowSpanReferences = {};

                // the current rowSpan definition for each column, columnName => rowSpan definition
                var currentRowSpanState = {};

                var _loop = function (i) {
                    var child = children[i];
                    var data = child.props.data;

                    // look at each column in this row and see if there are rowSpan properties
                    Object.keys(data).forEach(function (k) {
                        if (typeof k !== 'undefined' && typeof data[k] !== 'undefined') {
                            var state = currentRowSpanState[k];

                            // check if we've exhausted our specified number of rows for this column
                            if (typeof state !== 'undefined') {
                                var rowSpanEnd = state.startsAt + state.rowSpan - 1;
                                if (i >= rowSpanEnd) {
                                    delete currentRowSpanState[k];
                                }
                            }

                            var rowSpan = (0, _libDetermine_row_span.determineRowSpan)(child, k);
                            // we don't want to waste our time with single rows, only keep a state if we have >1
                            if (rowSpan > 1) {
                                state = {
                                    rowSpan: rowSpan,
                                    startsAt: i,
                                    component: child,
                                    columnName: k
                                };
                                currentRowSpanState[k] = state;

                                // store the reference to the rowSpanDefinition for all columns it's relevant to
                                var rowSpanEnd = i + rowSpan;
                                for (var idx = i; idx < rowSpanEnd && idx < children.length; idx++) {
                                    if (typeof rowSpanReferences[idx] === 'undefined') {
                                        rowSpanReferences[idx] = {};
                                    }
                                    rowSpanReferences[idx][k] = state;
                                }
                            }
                        }
                    });

                    // 2) look through all 'filterable' columns for this row and see if we can find the filterBy text
                    for (var filterColumn in _this._filterable) {
                        if (typeof data[filterColumn] !== 'undefined') {
                            // Default filter
                            if (typeof _this._filterable[filterColumn] === 'undefined' || _this._filterable[filterColumn] === 'default') {

                                if ((0, _libExtract_data_from.extractDataFrom)(data, filterColumn).toString().toLowerCase().indexOf(filter) > -1) {

                                    // upon a filter text match, we include the cell that matched and all the rows that
                                    //  the cell spans
                                    var rowSpan = (0, _libDetermine_row_span.determineRowSpan)(child, filterColumn);
                                    var rowSpanEnd = i + rowSpan;

                                    for (idx = i; idx < rowSpanEnd && idx < children.length; idx++) {
                                        otherChild = children[idx];

                                        matchedChildren[idx] = otherChild;

                                        // we no longer need to handle rowSpan for the other rows
                                        if (typeof rowSpanReferences[idx] !== 'undefined') {
                                            delete rowSpanReferences[idx][filterColumn];
                                        }
                                    }

                                    // we've rendered all the rows this cell spans, we no longer need to maintain state
                                    delete currentRowSpanState[filterColumn];

                                    break;
                                }
                            } else {
                                // Apply custom filter
                                if (_this._filterable[filterColumn]((0, _libExtract_data_from.extractDataFrom)(data, filterColumn).toString(), filter)) {
                                    matchedChildren[i] = child;
                                    break;
                                }
                            }
                        }
                    }
                };

                for (var i = 0; i < children.length; i++) {
                    var idx;
                    var otherChild;

                    _loop(i);
                }

                // Now that we know which results will be displayed, we can calculate a rowSpan that will encompass
                //  only the visible rows.
                // Iterate through the matched children and check if there are rowSpan modifications they need to make. Hint: we
                //  stored all row/col combos needing a modification in rowSpanReferences
                var resultingChildren = Object.keys(matchedChildren).map((function (rowIndex) {
                    var definitions = rowSpanReferences[rowIndex];
                    if (typeof definitions !== 'undefined') {

                        // the child we will clone and give a new <Td>
                        var child = matchedChildren[rowIndex];

                        // we'll be recreating this <Tr> with a rowSpan property carried over from the <Tr> with the rowSpan
                        var newData = (0, _libExtend.extend)({}, child.props.data);
                        var newProps = (0, _libExtend.extend)({}, child.props);
                        newProps.data = newData;

                        Object.keys(definitions).forEach(function (columnName) {
                            var definition = definitions[columnName];
                            // the tr with the rowSpan property
                            var tr = definition.component;

                            // this child was a part of a rowSpan
                            var rowSpanEnd = definition.startsAt + definition.rowSpan;
                            var remainingRowSpan = rowSpanEnd - rowIndex;

                            // if the rows that we're supposed to span did not match the filter text, we need to reduce the remainingRowSpan
                            for (var idx = rowIndex; idx < rowSpanEnd; idx++) {
                                if (typeof matchedChildren[idx] === 'undefined') {
                                    remainingRowSpan--;
                                }
                            }

                            // clone the data for the column to avoid altering the original props (e.g. don't want to change the rowSpan on original Td)
                            newProps.data[columnName] = (0, _libExtend.extend)({}, tr.props.data[columnName]);
                            newProps.data[columnName].props = (0, _libExtend.extend)({}, newProps.data[columnName].props);
                            newProps.data[columnName].props.rowSpan = remainingRowSpan;
                        });

                        // new key to avoid jitters, we want a brand new component
                        newProps.key = "cloned-" + _this.cloneIndex++;
                        newProps.renderState = child.props.renderState;

                        return _react['default'].cloneElement(child, newProps);
                    } else {
                        return matchedChildren[rowIndex];
                    }
                }).bind(this));

                return resultingChildren;
            }
        }, {
            key: 'sortByCurrentSort',
            value: function sortByCurrentSort() {
                var _this2 = this;

                // Apply a sort function according to the current sort in the state.
                // This allows us to perform a default sort even on a non sortable column.
                var currentSort = this.state.currentSort;

                if (currentSort.column === null) {
                    return;
                }

                // we'll be splitting each set of data into buckets, then sorting them. A 'set' is defined as rows sharing a
                //  <Td> with a rowSpan
                var singles = []; // rows without any rowSpans
                var buckets = {};
                var bucketIndex = 0;

                // helps us keep track of where we are in the last rowSpan we saw
                var currentRowSpan = null;

                for (var idx = 0; idx < this.data.length; idx++) {
                    var obj = this.data[idx];

                    // check if rowSpan is completed
                    if (currentRowSpan != null) {
                        var rowSpanEnd = currentRowSpan.startsAt + currentRowSpan.rowSpan;
                        if (rowSpanEnd <= idx) {
                            bucketIndex++;
                            currentRowSpan = null;
                        }
                    }

                    // make sure the bucket is defined
                    if (typeof buckets[bucketIndex] === 'undefined') {
                        buckets[bucketIndex] = [];
                    }

                    if (typeof obj.data !== 'undefined') {
                        // find the column with the next biggest rowSpan
                        var rowSpanOfSortColumn = (0, _libDetermine_row_span.determineRowSpan)(obj.data, currentSort.column);

                        if (rowSpanOfSortColumn !== 1) {
                            // not supported
                            console.warn("Cannot sort by column '" + currentSort.column + "', sorting by columns that have cells with rowSpan is currently not supported. See https://github.com/glittershark/reactable/issues/84");
                            return;
                        }

                        for (var col in obj.data) {

                            if (col === currentSort.column) {
                                // ignore the sort column
                                continue;
                            }

                            var rowSpanCurrentCol = (0, _libDetermine_row_span.determineRowSpan)(obj.data, col);

                            // if the rowSpan we found is less than the current debt but greater than the rowSpan of our column,
                            //      we will use that number
                            if (rowSpanCurrentCol > rowSpanOfSortColumn && (currentRowSpan == null || currentRowSpan.rowSpan > rowSpanCurrentCol)) {
                                currentRowSpan = {
                                    startsAt: idx,
                                    rowSpan: rowSpanCurrentCol
                                };
                            }
                        }
                    }

                    if (currentRowSpan == null) {
                        singles.push(obj);
                    } else {
                        buckets[bucketIndex].push(obj);
                    }
                }

                // run a sort on each bucket
                buckets = Object.keys(buckets).map(function (dataSet) {
                    return buckets[dataSet].sort(_this2.sortFunction.bind(_this2));
                });
                buckets.push(singles.sort(this.sortFunction.bind(this)));

                // flatten
                this.data = buckets.reduce(function (a, current) {
                    // look for row spans and put the definition of the <Td> on the top row after sort
                    if (current.length > 0) {
                        for (var idx = 0; idx < current.length; idx++) {
                            var obj = current[idx];

                            for (var col in obj.data) {
                                var rowSpan = (0, _libDetermine_row_span.determineRowSpan)(obj.data, col);
                                var currentPosition = idx % rowSpan;
                                var newRowSpanIdx = idx - currentPosition;

                                if (idx !== newRowSpanIdx) {
                                    // need to push the rowSpan property & values to the top row
                                    current[newRowSpanIdx].data[col] = (0, _libExtend.extend)({}, obj.data[col]);
                                    delete obj.data[col];
                                }
                            }
                        }
                    }
                    return a.concat(current);
                }, []);
            }
        }, {
            key: 'sortFunction',
            value: function sortFunction(a, b) {
                var currentSort = this.state.currentSort;

                var keyA = (0, _libExtract_data_from.extractDataFrom)(a, currentSort.column);
                keyA = (0, _unsafe.isUnsafe)(keyA) ? keyA.toString() : keyA || '';
                var keyB = (0, _libExtract_data_from.extractDataFrom)(b, currentSort.column);
                keyB = (0, _unsafe.isUnsafe)(keyB) ? keyB.toString() : keyB || '';

                // Default sort
                if (typeof this._sortable[currentSort.column] === 'undefined' || this._sortable[currentSort.column] === 'default') {

                    // Reverse direction if we're doing a reverse sort
                    if (keyA < keyB) {
                        return -1 * currentSort.direction;
                    }

                    if (keyA > keyB) {
                        return 1 * currentSort.direction;
                    }

                    return 0;
                } else {
                    // Reverse columns if we're doing a reverse sort
                    if (currentSort.direction === 1) {
                        return this._sortable[currentSort.column](keyA, keyB);
                    } else {
                        return this._sortable[currentSort.column](keyB, keyA);
                    }
                }
            }
        }, {
            key: 'onSort',
            value: function onSort(column) {
                // Don't perform sort on unsortable columns
                if (typeof this._sortable[column] === 'undefined') {
                    return;
                }

                var currentSort = this.state.currentSort;

                if (currentSort.column === column) {
                    currentSort.direction *= -1;
                } else {
                    currentSort.column = column;
                    currentSort.direction = this.props.defaultSortDescending ? -1 : 1;
                }

                // Set the current sort and pass it to the sort function
                this.setState({ currentSort: currentSort });
                this.sortByCurrentSort();

                if (typeof this.props.onSort === 'function') {
                    this.props.onSort(currentSort);
                }
            }
        }, {
            key: 'renderNoDataComponent',
            value: function renderNoDataComponent(columns) {
                var noDataFunc = this.props.noDataComponent;
                if (typeof noDataFunc === 'function') {
                    return noDataFunc(columns);
                } else if (this.props.noDataText) {
                    return _react['default'].createElement(
                        'tr',
                        { className: 'reactable-no-data' },
                        _react['default'].createElement(
                            'td',
                            { colSpan: columns.length },
                            this.props.noDataText
                        )
                    );
                } else {
                    return null;
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this3 = this;

                var children = [];
                var columns = undefined;
                var userColumnsSpecified = false;
                var showHeaders = typeof this.props.hideTableHeader === 'undefined';

                var firstChild = null;

                if (this.props.children) {
                    if (this.props.children.length > 0 && this.props.children[0] && this.props.children[0].type === _thead.Thead) {
                        firstChild = this.props.children[0];
                    } else if (this.props.children.type === _thead.Thead) {
                        firstChild = this.props.children;
                    }
                }

                if (firstChild !== null) {
                    columns = _thead.Thead.getColumns(firstChild);
                } else {
                    columns = this.props.columns || [];
                }

                if (columns.length > 0) {
                    userColumnsSpecified = true;
                    columns = this.translateColumnsArray(columns);
                }

                // Build up table rows
                if (this.data && typeof this.data.map === 'function') {
                    var renderState = {};
                    // Build up the columns array
                    children = children.concat(this.data.map((function (rawData, i) {
                        var data = rawData;
                        var props = {};
                        if (rawData.__reactableMeta === true) {
                            data = rawData.data;
                            props = rawData.props;
                        }

                        // Loop through the keys in each data row and build a td for it
                        for (var k in data) {
                            if (data.hasOwnProperty(k)) {
                                // Update the columns array with the data's keys if columns were not
                                // already specified
                                if (userColumnsSpecified === false) {
                                    (function () {
                                        var column = {
                                            key: k,
                                            label: k
                                        };

                                        // Only add a new column if it doesn't already exist in the columns array
                                        if (columns.find(function (element) {
                                            return element.key === column.key;
                                        }) === undefined) {
                                            columns.push(column);
                                        }
                                    })();
                                }
                            }
                        }

                        return _react['default'].createElement(_tr.Tr, _extends({ columns: columns, key: i, data: data }, props, { renderState: renderState }));
                    }).bind(this)));
                }

                if (this.props.sortable === true) {
                    for (var i = 0; i < columns.length; i++) {
                        this._sortable[columns[i].key] = 'default';
                    }
                }

                // Determine if we render the filter box
                var filtering = false;
                if (this.props.filterable && Array.isArray(this.props.filterable) && this.props.filterable.length > 0 && !this.props.hideFilterInput) {
                    filtering = true;
                }

                // Apply filters
                var filteredChildren = children;
                if (this.state.filter !== '') {
                    filteredChildren = this.applyFilter(this.state.filter, filteredChildren);
                }

                // Determine pagination properties and which columns to display
                var itemsPerPage = 0;
                var pagination = false;
                var numPages = undefined;
                var currentPage = this.state.currentPage;
                var pageButtonLimit = this.props.pageButtonLimit || 10;

                var currentChildren = filteredChildren;
                if (this.props.itemsPerPage > 0) {
                    itemsPerPage = this.props.itemsPerPage;
                    numPages = Math.ceil(filteredChildren.length / itemsPerPage);

                    if (currentPage > numPages - 1) {
                        currentPage = numPages - 1;
                    }

                    pagination = true;
                    currentChildren = filteredChildren.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
                }

                // Manually transfer props

                var _filterPropsFrom = (0, _libFilter_props_from.filterPropsFrom)(this.props);

                var noDataComponent = _filterPropsFrom.noDataComponent;

                var props = _objectWithoutProperties(_filterPropsFrom, ['noDataComponent']);

                var tableHeader = null;
                if (columns && columns.length > 0 && showHeaders) {
                    tableHeader = _react['default'].createElement(_thead.Thead, { columns: columns,
                        filtering: filtering,
                        onFilter: function (filter) {
                            _this3.setState({ filter: filter });
                            if (_this3.props.onFilter) {
                                _this3.props.onFilter(filter);
                            }
                        },
                        filterPlaceholder: this.props.filterPlaceholder,
                        filterClassName: this.props.filterClassName,
                        currentFilter: this.state.filter,
                        sort: this.state.currentSort,
                        sortableColumns: this._sortable,
                        onSort: this.onSort.bind(this),
                        key: 'thead' });
                }
                return _react['default'].createElement(
                    'table',
                    props,
                    tableHeader,
                    _react['default'].createElement(
                        'tbody',
                        { className: 'reactable-data', key: 'tbody' },
                        currentChildren.length > 0 ? currentChildren : this.renderNoDataComponent(columns)
                    ),
                    pagination === true ? _react['default'].createElement(_paginator.Paginator, { colSpan: columns.length,
                        pageButtonLimit: pageButtonLimit,
                        numPages: numPages,
                        currentPage: currentPage,
                        onPageChange: function (page) {
                            _this3.setState({ currentPage: page });
                            if (_this3.props.onPageChange) {
                                _this3.props.onPageChange(page);
                            }
                        },
                        previousPageLabel: this.props.previousPageLabel,
                        nextPageLabel: this.props.nextPageLabel,
                        key: 'paginator' }) : null,
                    this.tfoot
                );
            }
        }]);

        return Table;
    })(_react['default'].Component);

    exports.Table = Table;

    Table.defaultProps = {
        sortBy: false,
        defaultSort: false,
        defaultSortDescending: false,
        itemsPerPage: 0,
        filterBy: '',
        hideFilterInput: false
    };

    Table.propTypes = {
        sortBy: _propTypes['default'].bool,
        itemsPerPage: _propTypes['default'].number, // number of items to display per page
        filterable: _propTypes['default'].array, // columns to look at when applying the filter specified by filterBy
        filterBy: _propTypes['default'].string, // text to filter the results by (see filterable)
        hideFilterInput: _propTypes['default'].bool, // Whether the default input field for the search/filter should be hidden or not
        hideTableHeader: _propTypes['default'].bool, // Whether the table header should be hidden or not
        noDataText: _propTypes['default'].string, // Text to be displayed in the event there is no data to show
        noDataComponent: _propTypes['default'].func // function called to provide a component to display in the event there is no data to show (supercedes noDataText)
    };
});

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './reactable/table', './reactable/tr', './reactable/td', './reactable/th', './reactable/tfoot', './reactable/thead', './reactable/sort', './reactable/unsafe'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./reactable/table'), require('./reactable/tr'), require('./reactable/td'), require('./reactable/th'), require('./reactable/tfoot'), require('./reactable/thead'), require('./reactable/sort'), require('./reactable/unsafe'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.table, global.tr, global.td, global.th, global.tfoot, global.thead, global.sort, global.unsafe);
        global.reactable = mod.exports;
    }
})(this, function (exports, _react, _reactableTable, _reactableTr, _reactableTd, _reactableTh, _reactableTfoot, _reactableThead, _reactableSort, _reactableUnsafe) {
    'use strict';

    _react['default'].Children.children = function (children) {
        return _react['default'].Children.map(children, function (x) {
            return x;
        }) || [];
    };

    // Array.prototype.find polyfill - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function value(predicate) {
                if (this === null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;
                for (var i = 0; i < length; i++) {
                    if (i in list) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return value;
                        }
                    }
                }
                return undefined;
            }
        });
    }

    var Reactable = { Table: _reactableTable.Table, Tr: _reactableTr.Tr, Td: _reactableTd.Td, Th: _reactableTh.Th, Tfoot: _reactableTfoot.Tfoot, Thead: _reactableThead.Thead, Sort: _reactableSort.Sort, unsafe: _reactableUnsafe.unsafe };

    exports['default'] = Reactable;

    if (typeof window !== 'undefined') {
        window.Reactable = Reactable;
    }
});
