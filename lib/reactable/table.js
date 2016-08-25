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

var _libFilter_props_from = require('./lib/filter_props_from');

var _libExtract_data_from = require('./lib/extract_data_from');

var _libDetermine_row_span = require('./lib/determine_row_span');

var _libExtend = require('./lib/extend');

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
                _react2['default'].Children.forEach(props.children, (function (child) {
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

                    return _react2['default'].cloneElement(child, newProps);
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
                return _react2['default'].createElement(
                    'tr',
                    { className: 'reactable-no-data' },
                    _react2['default'].createElement(
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

                    return _react2['default'].createElement(_tr.Tr, _extends({ columns: columns, key: i, data: data }, props, { renderState: renderState }));
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
                tableHeader = _react2['default'].createElement(_thead.Thead, { columns: columns,
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
            return _react2['default'].createElement(
                'table',
                props,
                tableHeader,
                _react2['default'].createElement(
                    'tbody',
                    { className: 'reactable-data', key: 'tbody' },
                    currentChildren.length > 0 ? currentChildren : this.renderNoDataComponent(columns)
                ),
                pagination === true ? _react2['default'].createElement(_paginator.Paginator, { colSpan: columns.length,
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
})(_react2['default'].Component);

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
    sortBy: _react2['default'].PropTypes.bool,
    itemsPerPage: _react2['default'].PropTypes.number, // number of items to display per page
    filterable: _react2['default'].PropTypes.array, // columns to look at when applying the filter specified by filterBy
    filterBy: _react2['default'].PropTypes.string, // text to filter the results by (see filterable)
    hideFilterInput: _react2['default'].PropTypes.bool, // Whether the default input field for the search/filter should be hidden or not
    hideTableHeader: _react2['default'].PropTypes.bool, // Whether the table header should be hidden or not
    noDataText: _react2['default'].PropTypes.string, // Text to be displayed in the event there is no data to show
    noDataComponent: _react2['default'].PropTypes.func // function called to provide a component to display in the event there is no data to show (supercedes noDataText)
};
