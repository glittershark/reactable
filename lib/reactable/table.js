'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libFilter_props_from = require('./lib/filter_props_from');

var _libExtract_data_from = require('./lib/extract_data_from');

var _unsafe = require('./unsafe');

var _thead = require('./thead');

var _th = require('./th');

var _tr = require('./tr');

var _tfoot = require('./tfoot');

var _paginator = require('./paginator');

var Table = (function (_React$Component) {
    _inherits(Table, _React$Component);

    function Table(props) {
        _classCallCheck(this, Table);

        _get(Object.getPrototypeOf(Table.prototype), 'constructor', this).call(this, props);

        this.state = {
            currentPage: 0,
            currentSort: {
                column: null,
                direction: 1
            },
            filter: ''
        };

        // Set the state of the current sort to the default sort
        if (props.sortBy !== false || props.defaultSort !== false) {
            var sortingColumn = props.sortBy || props.defaultSort;
            this.state.currentSort = this.getCurrentSort(sortingColumn);
        }
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
                _react2['default'].Children.forEach(props.children, (function (child) {
                    if (typeof child === 'undefined' || child === null) {
                        return;
                    }

                    switch (child.type) {
                        case _tfoot.Tfoot:
                            if (typeof tfoot !== 'undefined') {
                                console.warn('You can only have one <Tfoot>, but more than one was specified.' + 'Ignoring all but the last one');
                            }
                            tfoot = child;
                            break;
                        case _tr.Tr:
                            var childData = child.props.data || {};

                            _react2['default'].Children.forEach(child.props.children, function (descendant) {
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
                                        console.warn('exports.Td specified without ' + 'a `data` property or children, ' + 'ignoring');
                                        return;
                                    }

                                    childData[descendant.props.column] = {
                                        value: value,
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
        }
    }, {
        key: 'initializeSorts',
        value: function initializeSorts() {
            this._sortable = {};
            // Transform sortable properties into a more friendly list
            for (var i in this.props.sortable) {
                var column = this.props.sortable[i];
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
                        console.warn('Invalid default sort specified.  Defaulting to ascending');
                        sortDirection = 1;
                    }
                } else {
                    sortDirection = 1;
                }
            } else {
                columnName = column;
                sortDirection = 1;
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
            this.updateCurrentSort(nextProps.sortBy);
            this.sortByCurrentSort();
            this.filterBy(nextProps.filterBy);
        }
    }, {
        key: 'applyFilter',
        value: function applyFilter(filter, children) {
            if (typeof filter === 'string') {
                // Helper function to apply filter text to a list of table rows
                filter = filter.toLowerCase();
                var matchedChildren = [];

                for (var i = 0; i < children.length; i++) {
                    var data = children[i].props.data;

                    for (var j = 0; j < this.props.filterable.length; j++) {
                        var filterColumn = this.props.filterable[j];

                        if (typeof data[filterColumn] !== 'undefined' && (0, _libExtract_data_from.extractDataFrom)(data, filterColumn).toString().toLowerCase().indexOf(filter) > -1) {
                            matchedChildren.push(children[i]);
                            break;
                        }
                    }
                }

                return matchedChildren;
            } else {
                var _ret = (function () {

                    var filterCount = Object.keys(filter).length;
                    var matchedChildren = [];

                    for (var filterColumn in filter) {
                        var val = filter[filterColumn].toLowerCase();
                        for (var i = 0; i < children.length; i++) {
                            var data = children[i].props.data;
                            if (typeof data[filterColumn] !== 'undefined' && (0, _libExtract_data_from.extractDataFrom)(data, filterColumn).toString().toLowerCase().indexOf(val) > -1) {
                                matchedChildren.push(children[i]);
                            }
                        }
                    }

                    if (filterCount > 1) {
                        var result = [];
                        return {
                            v: matchedChildren.map(function (children) {
                                var occurrences = matchedChildren.filter(function (value) {
                                    return value.key === children.key;
                                }).length;
                                if (occurrences == filterCount) {
                                    return children;
                                }
                            })
                        };
                    } else {
                        return {
                            v: matchedChildren
                        };
                    }
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }
    }, {
        key: 'onFilter',
        value: function onFilter(filters, enterKey) {
            var _this = this;

            var input = undefined;
            var filterObj = {};
            if (typeof filters === 'string' && filters.indexOf(':') != -1 && enterKey) {
                (function () {
                    input = filters.trim();
                    var col = undefined,
                        val = undefined;
                    var splitFilters = input.split(',');
                    splitFilters.forEach(function (f) {
                        var filter = f.split(':');

                        if (filter[0]) {
                            col = filter[0].trim();
                        }
                        if (filter[1]) {
                            val = filter[1].trim();
                        }
                        filterObj[col] = val;
                    });
                    _this.setState({ filter: filterObj });
                })();
            } else {
                this.setState({ filter: filters });
            }
        }
    }, {
        key: 'sortByCurrentSort',
        value: function sortByCurrentSort() {
            // Apply a sort function according to the current sort in the state.
            // This allows us to perform a default sort even on a non sortable column.
            var currentSort = this.state.currentSort;

            if (currentSort.column === null) {
                return;
            }

            this.data.sort((function (a, b) {
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
            }).bind(this));
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
                currentSort.direction = 1;
            }

            // Set the current sort and pass it to the sort function
            this.setState({ currentSort: currentSort });
            this.sortByCurrentSort();

            if (typeof this.props.onSort === 'function') {
                this.props.onSort(currentSort);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var children = [];
            var columns = undefined;
            var userColumnsSpecified = false;

            var firstChild = null;

            if (this.props.children && this.props.children.length > 0 && this.props.children[0].type === _thead.Thead) {
                firstChild = this.props.children[0];
            } else if (typeof this.props.children !== 'undefined' && this.props.children.type === _thead.Thead) {
                firstChild = this.props.children;
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

                    return _react2['default'].createElement(_tr.Tr, _extends({ columns: columns, key: i, data: data }, props));
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
            var props = (0, _libFilter_props_from.filterPropsFrom)(this.props);

            var noDataText = this.props.noDataText ? _react2['default'].createElement(
                'tr',
                { className: 'reactable-no-data' },
                _react2['default'].createElement(
                    'td',
                    { colSpan: columns.length },
                    this.props.noDataText
                )
            ) : null;

            return _react2['default'].createElement(
                'table',
                props,
                columns && columns.length > 0 ? _react2['default'].createElement(_thead.Thead, { columns: columns,
                    filtering: filtering,
                    onFilter: this.onFilter.bind(this),
                    filterPlaceholder: this.props.filterPlaceholder,
                    currentFilter: this.state.filter,
                    sort: this.state.currentSort,
                    sortableColumns: this._sortable,
                    onSort: this.onSort.bind(this),
                    key: 'thead' }) : null,
                _react2['default'].createElement(
                    'tbody',
                    { className: 'reactable-data', key: 'tbody' },
                    currentChildren.length > 0 ? currentChildren : noDataText
                ),
                pagination === true ? _react2['default'].createElement(_paginator.Paginator, { colSpan: columns.length,
                    pageButtonLimit: pageButtonLimit,
                    numPages: numPages,
                    currentPage: currentPage,
                    onPageChange: function (page) {
                        _this2.setState({ currentPage: page });
                    },
                    key: 'paginator' }) : null,
                this.tfoot
            );
        }
    }]);

    return Table;
})(_react2['default'].Component);

exports.Table = Table;

Table.defaultProps = {
    sortBy: false,
    defaultSort: false,
    itemsPerPage: 0,
    filterBy: '',
    hideFilterInput: false
};
