/** @jsx React.DOM */
"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['react'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('react'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.React);
    }
}(this, function (React) {
    // Array.prototype.map polyfill - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Polyfill
    if (!Array.prototype.map) {
        Array.prototype.map = function(fun /*, thisArg */) {
            "use strict";
    
            if (this === void 0 || this === null) {
                throw new TypeError();
            }
    
            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") {
                throw new TypeError();
            }
    
            var res = new Array(len);
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                // NOTE: Absolute correctness would demand Object.defineProperty
                //       be used.  But this method is fairly new, and failure is
                //       possible only if Object.prototype or Array.prototype
                //       has a property |i| (very unlikely), so use a less-correct
                //       but more portable alternative.
                if (i in t) {
                    res[i] = fun.call(thisArg, t[i], i, t);
                }
            }
    
            return res;
        };
    }
    
    // Array.prototype.indexOf polyfill for IE8
    if (!Array.prototype.indexOf)
    {
          Array.prototype.indexOf = function(elt /*, from*/)
          {
                var len = this.length >>> 0;
    
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                     ? Math.ceil(from)
                     : Math.floor(from);
                if (from < 0) {
                    from += len;
                }
    
                for (; from < len; from++)
                {
                    if (from in this && this[from] === elt) {
                        return from;
                    }
                }
                return -1;
          };
    }
    
    // Array.prototype.find polyfill - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function(predicate) {
                if (this == null) {
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
    
    if (!Array.isArray) {
        Array.isArray = function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        };
    }
    
    function Unsafe(content) {
        this.content = content;
    }
    
    Unsafe.prototype.toString = function() {
        return this.content;
    }
    
    exports.unsafe = function(str) {
        return new Unsafe(str);
    }
    
    exports.Sort = {
        Numeric: function(a, b) {
            var valA = parseFloat(a.toString().replace(',', ''));
            var valB = parseFloat(b.toString().replace(',', ''));
    
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
    
        Currency: function(a, b) {
            // Parse out dollar signs, then do a regular numeric sort
            // TODO: handle non-American currency
    
            if (a[0] === '$') {
                a = a.substring(1);
            }
            if (b[0] === '$') {
                b = b.substring(1);
            }
    
            return exports.Sort.Numeric(a, b);
        },
    
        Date: function(a, b) {
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
        },
    
        CaseInsensitive: function(a, b) {
            var valA = a.toLowerCase();
            var valB = b.toLowerCase();
    
            if(valA > valB) {
                return 1;
            }
    
            if(valB > valA) {
                return -1;
            }
    
            return 0;
        },
    };
    
    var Td = exports.Td = React.createClass({
        handleClick: function(e){
            if (typeof this.props.handleClick !== 'undefined') {
                return this.props.handleClick(e, this);
            }
        },
        render: function() {
            var tdProps = {
                'data-column': this.props.column.key,
                className: this.props.className,
                onClick: this.handleClick
            }
    
            // Attach any properties on the column to this Td object to allow things like custom event handlers
            for (var key in this.props.column) {
                if (key !== 'key' && key !== 'name') {
                    tdProps[key] = this.props.column[key];
                }
            }
    
            var data = this.props.data;
            if (
                typeof(this.props.data) === 'undefined' &&
                typeof(this.props.children) === 'string'
            ) {
                data = this.props.children;
            }
    
            if (typeof(this.props.children) !== 'undefined') {
                if (this.props.children instanceof Unsafe) {
                    tdProps.dangerouslySetInnerHTML= { __html: this.props.children.toString() }
                } else {
                    tdProps.children = data;
                }
            }
    
            return React.DOM.td(tdProps);
        }
    });
    
    
    var Tr = exports.Tr = React.createClass({
        statics: {
            childNode: Td,
            dataType: 'object'
        },
        getDefaultProps: function() {
            var defaultProps = {
                childNode: Td,
                columns: [],
                data: {}
            }
    
            return defaultProps;
        },
        render: function() {
            var children = this.props.children || [];
    
            if (
                this.props.data &&
                this.props.columns &&
                typeof this.props.columns.map === 'function'
            ) {
                children = children.concat(this.props.columns.map(function(column, i) {
                    if (this.props.data.hasOwnProperty(column.key)) {
                        return <Td column={column} key={column.key}>{this.props.data[column.key]}</Td>;
                    } else {
                        return <Td column={column} key={column.key} />;
                    }
                }.bind(this)));
            }
    
            // Manually transfer props
            var props = filterPropsFrom(this.props);
    
            return React.DOM.tr(props, children)
        }
    });
    
    var Thead = exports.Thead = React.createClass({
        getColumns: function() {
            return React.Children.map(this.props.children, function(th) {
                if (typeof th.props.children === 'string') {
                    return th.props.children;
                } else {
                    throw new TypeError('<th> must have a string child');
                }
            });
        },
        handleClickTh: function (column) {
            this.props.onSort(column.key)
        },
        render: function() {
    
            // Declare the list of Ths
            var Ths = []
            for (var index = 0; index < this.props.columns.length; index++) {
                var column = this.props.columns[index];
                var sortClass = '';
    
                if (this.props.sort.column === column.key) {
                    sortClass = 'reactable-header-sort';
                    if (this.props.sort.direction === 1) {
                        sortClass += '-asc';
                    }
                    else {
                        sortClass += '-desc';
                    }
                }
    
                Ths.push(React.DOM.th({
                    className: sortClass,
                    key: index,
                    onClick: this.handleClickTh.bind(this, column)
                }, column.label))
            }
    
            // Manually transfer props
            var props = filterPropsFrom(this.props);
            
            return React.DOM.thead(props,
                (this.props.filtering === true ?
                    Filterer({
                        colSpan: this.props.columns.length,
                        onFilter: this.props.onFilter
                    }) 
                : ''),
                React.DOM.tr({className: "reactable-column-header"}, Ths)
            );
        }
    });
    
    var Th = exports.Th = React.createClass({
        render: function() {
            return this.transferPropsTo(<th>{this.props.children}</th>);
        }
    });
    
    var FiltererInput = React.createClass({
        render: function() {
            return (
                <input type="text" className="reactable-filter-input"
                    onKeyUp={function(){
                        this.props.onFilter(this.getDOMNode().value);
                    }.bind(this)} />
            );
        },
    });
    
    var Filterer = React.createClass({
        render: function() {
            if (typeof this.props.colSpan === 'undefined') {
                throw new TypeError('Must pass a colSpan argument to Filterer');
            }
    
            return (
                <tr className="reactable-filterer">
                    <td colSpan={this.props.colSpan}>
                        <FiltererInput onFilter={this.props.onFilter}/>
                    </td>
                </tr>
            );
        },
    });
    
    var Paginator = React.createClass({
        render: function() {
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
            for (var i = 0; i < this.props.numPages; i++) {
                var pageNum = i;
                var className = "reactable-page-button";
                if (this.props.currentPage === i) {
                    className += " reactable-current-page";
                }
    
                pageButtons.push(
                    <a className={className} key={i}
                       // create function to get around for-loop closure issue
                       onClick={(function(pageNum) {
                           return function() {
                               this.props.onPageChange(pageNum);
                           }.bind(this)
                       }.bind(this))(i)}>{i + 1}</a>
                );
            }
    
            return (
                <tbody className="reactable-pagination">
                    <tr>
                        <td colSpan={this.props.colSpan}>
                            {pageButtons}
                        </td>
                    </tr>
                </tbody>
            );
        }
    });
    
    var Table = exports.Table = React.createClass({
        // Translate a user defined column array to hold column objects if strings are specified
        // (e.g. ['column1'] => [{key: 'column1', label: 'column1'}])
        translateColumnsArray: function(columns) {
            return columns.map(function(column, i) {
                if (typeof(column) === 'string') {
                    return {
                        key:   column,
                        label: column
                    };
                } else {
                    if (typeof(column.sortable) !== 'undefined') {
                        var sortFunction = column.sortable === true ? 'default' : column.sortable;
                        this._sortable[column.key] = sortFunction;
                    }
    
                    return column;
                }
            }.bind(this));
        },
        parseChildData: function(props) {
            var data = [];
    
            // Transform any children back to a data array
            if (typeof(props.children) !== 'undefined') {
                React.Children.forEach(props.children, function(child) {
                    // TODO: figure out a new way to determine the type of a component
                    /*
                    if (child.type.ConvenienceConstructor !== Tr) {
                        return; // (continue)
                    }
                    */
    
                    var childData = child.props.data || {};
    
                    // Given our modification of Array.prototype, this is the
                    // best way to check if child.props.children is an array
                    if (
                        typeof(child.props.children) !== 'undefined' &&
                        typeof(child.props.children.map) === 'function'
                    ) {
    
                        var childChildren = child.props.children;
                        for (var i = 0; i < childChildren.length; i++) {
                            var descendant = childChildren[i];
                            // TODO
                            /* if (descendant.type.ConvenienceConstructor === Td) { */
                            if (true) {
                                if (typeof(descendant.props.column) !== 'undefined') {
                                    if (typeof(descendant.props.data) !== 'undefined') {
    
                                        childData[descendant.props.column] =
                                            descendant.props.data;
                                    } else if (
                                        typeof(descendant.props.children) !== 'undefined'
                                    ) {
                                        childData[descendant.props.column] =
                                            descendant.props.children;
                                    } else {
                                        console.warn('exports.Td specified without ' +
                                                'a `data` property or children, ' +
                                                'ignoring');
                                    }
                                } else {
                                    console.warn('exports.Td specified without a ' +
                                            '`column` property, ignoring');
                                }
                            }
                        }
                    }
    
                    data.push(childData);
                }.bind(this));
            }
    
            return data;
        },
        initialize: function(props) {
            this.data = props.data || [];
            this.data = this.data.concat(this.parseChildData(props));
            this.initializeSorts(props);
        },
        initializeSorts: function() {
            this._sortable = {};
            // Transform sortable properties into a more friendly list
            for (var i in this.props.sortable) {
                var column = this.props.sortable[i];
                var columnName, sortFunction;
    
                if (column instanceof Object) {
                    if (typeof(column.column) !== 'undefined') {
                        columnName = column.column;
                    } else {
                        console.warn('Sortable column specified without column name');
                        return;
                    }
    
                    if (typeof(column.sortFunction) !== 'undefined' && column.sortFunction instanceof Function) {
                        sortFunction = column.sortFunction;
                    } else {
                        sortFunction = 'default';
                    }
                } else {
                    columnName      = column;
                    sortFunction    = 'default';
                }
    
                this._sortable[columnName] = sortFunction;
            }
        },
        getDefaultProps: function() {
            var defaultProps = {
                columns: [],
                sortable: [],
                filterable: [],
                sortBy: false,
                defaultSort: false,
                itemsPerPage: 0,
            }
            return defaultProps;
        },
        getInitialState: function() {
            var initialState = {
                currentPage: 0,
                currentSort: {
                    column: null,
                    direction: 1,
                },
                filter: '',
            }
    
            // Set the state of the current sort to the default sort
            if (this.props.sortBy !== false || this.props.defaultSort !== false) {
                var sortingColumn = this.props.sortBy || this.props.defaultSort;
                initialState.currentSort = this.getCurrentSort(sortingColumn);
            }
            return initialState;
        },
        getCurrentSort: function(column) {
            if (column instanceof Object) {
                var columnName, sortDirection;
    
                if (typeof(column.column) !== 'undefined') {
                    columnName = column.column;
                } else {
                    console.warn('Default column specified without column name');
                    return;
                }
    
                if (typeof(column.direction) !== 'undefined') {
                    if (column.direction === 1 || column.direction === 'asc') {
                        sortDirection = 1;
                    } else if (column.direction === -1 || column.direction === 'desc') {
                        sortDirection = -1;
                    } else {
                        console.warn('Invalid default sort specified.  Defaulting to ascending');
                        sortDirection = 1;
                    }
                } else {
                    sortFunction = 1;
                }
            } else {
                columnName      = column;
                sortDirection   = 1;
            }
    
            return {
                column: columnName,
                direction: sortDirection
            };
        },
        updateCurrentSort: function(sortBy) {
            if (sortBy !== false &&
                sortBy.column !== this.state.currentSort.column &&
                sortBy.direction !== this.state.currentSort.direction) {
    
                this.setState({ currentSort: this.getCurrentSort(sortBy) });
            }
        },
        componentWillMount: function() {
            this.initialize(this.props);
            this.sortByCurrentSort();
        },
        componentWillReceiveProps: function(nextProps) {
            this.initialize(nextProps);
            this.updateCurrentSort(nextProps.sortBy);
            this.sortByCurrentSort();
        },
        onPageChange: function(page) {
            this.setState({ currentPage: page });
        },
        onFilter: function(filter) {
            this.setState({ filter: filter });
        },
        applyFilter: function(filter, children) {
            // Helper function to apply filter text to a list of table rows
            var filter = filter.toLowerCase();
            var matchedChildren = [];
    
            for (var i = 0; i < children.length; i++) {
                var data = children[i].props.data;
    
                for (var j = 0; j < this.props.filterable.length; j++) {
                    var filterColumn = this.props.filterable[j];
    
                    if (
                        typeof(data[filterColumn]) !== 'undefined' &&
                        data[filterColumn].toString().toLowerCase().indexOf(filter) > -1
                    ) {
                        matchedChildren.push(children[i]);
                        break;
                    }
                }
            }
    
            return matchedChildren;
        },
        sortByCurrentSort: function(){
            // Apply a sort function according to the current sort in the state.
            // This allows us to perform a default sort even on a non sortable column.
            var currentSort = this.state.currentSort;
    
            if (currentSort.column === null) {
                return;
            }
    
            this.data.sort(function(a, b){
                var keyA = a[currentSort.column];
                keyA = keyA ? keyA.toString() : '';
                var keyB = b[currentSort.column];
                keyB = keyB ? keyB.toString() : '';
    
                // Default sort
                if (this._sortable[currentSort.column] === 'default') {
    
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
            }.bind(this));
        },
        onSort: function(column) {
            // Don't perform sort on unsortable columns
            if (typeof(this._sortable[column]) === 'undefined') {
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
        },
        render: function() {
            var children = [];
            var columns;
            var userColumnsSpecified = false;
    
            if (
                this.props.children &&
                this.props.children.length > 0 &&
                this.props.children[0].type.ConvenienceConstructor === Thead
            ) {
                columns = this.props.children[0].getColumns();
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
                children = children.concat(this.data.map(function(data, i) {
                    // Loop through the keys in each data row and build a td for it
                    for (var k in data) {
                        if (data.hasOwnProperty(k)) {
                            // Update the columns array with the data's keys if columns were not
                            // already specified
                            if (userColumnsSpecified === false) {
                                var column = {
                                    key:   k,
                                    label: k
                                };
    
                                // Only add a new column if it doesn't already exist in the columns array
                                if (
                                    columns.find(function(element) {
                                        return element.key === column.key
                                    }) === undefined
                                ) {
                                    columns.push(column);
                                }
                            }
                        }
                    }
    
                    return (
                        <Tr columns={columns} key={i} data={data} />
                    );
                }.bind(this)));
            }
    
            if (this.props.sortable === true) {
                for (var i = 0; i < columns.length; i++) {
                    this._sortable[columns[i].key] = 'default';
                }
            }
    
            // Determine if we render the filter box
            var filtering = false;
            if (
                this.props.filterable &&
                Array.isArray(this.props.filterable) &&
                this.props.filterable.length > 0
            ) {
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
            var numPages;
            var currentPage = this.state.currentPage;
    
            var currentChildren = filteredChildren;
            if (this.props.itemsPerPage > 0) {
                itemsPerPage = this.props.itemsPerPage;
                numPages = Math.ceil(filteredChildren.length / itemsPerPage)
    
                if (currentPage > numPages - 1) {
                    currentPage = numPages - 1;
                }
    
                pagination = true;
                currentChildren = filteredChildren.slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                );
            }
    
            // Manually transfer props
            var props = filterPropsFrom(this.props);
    
            return React.DOM.table(props,
                (columns && columns.length > 0 ?
                    Thead({
                        columns: columns,
                        filtering: filtering,
                        onFilter: this.onFilter,
                        sort: this.state.currentSort,
                        onSort: this.onSort
                    })
                : null),
                React.DOM.tbody({className: "reactable-data"}, currentChildren),
                (pagination === true ?
                    Paginator({
                        colSpan: columns.length,
                        numPages: numPages,
                        currentPage: currentPage,
                        onPageChange: this.onPageChange
                    })
                : '')
            );
        }
    });
    
    function filterPropsFrom(baseProps) {
        baseProps = baseProps || {};
        var props = {};
        for (var key in baseProps) {
            if (!(key in internalProps)) {
                props[key] = baseProps[key];
            }
        }
        return props;
    };
    
    var internalProps = {
        columns: true,
        sortable: true,
        filterable: true,
        sortBy: true,
        defaultSort: true,
        itemsPerPage: true,
        childNode: true,
        data: true
    }

    return exports;
}));
