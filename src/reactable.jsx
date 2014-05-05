/** @jsx React.DOM */
Reactable = (function() {
    "use strict";

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

    if (!Array.isArray) {
        Array.isArray = function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        };
    }

    var Reactable = {};

    Reactable.Sort = {
        Numeric: function(a, b) {
            var valA = parseFloat(a.replace(',', ''));
            var valB = parseFloat(b.replace(',', ''));

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

            return Reactable.Sort.Numeric(a, b);
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
                return Reactable.Sort.Numeric(a, b);
            } 

            if (valA > valB) {
                return 1;
            }
            if (valB > valA) {
                return -1;
            }

            return 0;
        }
    };

    var ParseChildDataMixin = {
        parseChildData: function(expectedClass) {
            var data = [];

            // Transform any children back to a data array
            if (typeof(this.props.children) !== 'undefined') {
                React.Children.forEach(this.props.children, function(child) {
                    if (child.type.ConvenienceConstructor === this.type.ConvenienceConstructor.childNode) {
                        data.push(child.props.data);
                    }
                }.bind(this));
            }

            return data;
        }
    };

    var Td = Reactable.Td = React.createClass({
        render: function() {
            return this.transferPropsTo(
                <td>
                    {this.props.children}
                </td>
            );
        }
    });


    var Tr = Reactable.Tr = React.createClass({
        statics: {
            childNode: Td
        },
        mixins: [
            ParseChildDataMixin
        ],
        getDefaultProps: function() {
            var defaultProps = {
                childNode: Td,
                data: this.parseChildData(),
                columns: []
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
                    if (this.props.data.hasOwnProperty(column)) {
                        return <Td col={column} key={column}>{this.props.data[column]}</Td>;
                    } else {
                        return <Td col={column} key={column} />;
                    }
                }.bind(this)));
            }

            return this.transferPropsTo(
                <tr>{children}</tr>
            );
        }
    });

    var Thead = Reactable.Thead = React.createClass({
        getColumns: function() {
            return React.Children.map(this.props.children, function(th) {
                if (typeof th.props.children === 'string') {
                    return th.props.children;
                } else {
                    throw new TypeError('<th> must have a string child');
                }
            });
        },
        render: function() {
            return this.transferPropsTo(
                <thead>
                    <tr>
                        {this.props.columns.map(function(col, index) {
                            var sortClass = '';

                            if (this.props.sort.column === col) {
                                sortClass = 'reactable-header-sort';
                                if (this.props.sort.direction === 1) {
                                    sortClass += '-asc';
                                }
                                else {
                                    sortClass += '-desc';
                                }
                            }

                            return (
                                <th 
                                    className={sortClass}
                                    key={index}
                                    onClick={function(){ this.props.onSort(col) }.bind(this)}>{col}</th>
                            );
                        }.bind(this))}
                    </tr>
                </thead>
            );
        }
    });

    var Th = Reactable.Th = React.createClass({
        render: function() {
            return this.transferPropsTo(<th>{this.props.children}</th>);
        }
    });

    var Paginator = React.createClass({
        render: function() {
            if (typeof this.props.colSpan === 'undefined') {
                throw new TypeError('Must pass a colSpan argument to Paginator');
            }

            if (typeof this.props.numPages === 'undefined' || this.props.numPages === 0) {
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

    var Table = Reactable.Table = React.createClass({
        statics: {
            childNode: Tr
        },
        mixins: [
            ParseChildDataMixin
        ],
        getDefaultProps: function() {
            var defaultProps = {
                data: this.parseChildData(),
                columns: [],
                sortable: [],
                defaultSort: false,
                itemsPerPage: 0,
                _sortable: [],
            }

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

                defaultProps._sortable[columnName] = sortFunction;
            }

            return defaultProps;
        },
        getInitialState: function() {
            var initialState = {
                currentPage: 0,
                currentSort: {
                    column: null,
                    direction: 1
                }
            }

            // Set the state of the current sort to the default sort
            if (this.props.defaultSort !== false) {
                var column = this.props.defaultSort;
                var currentSort = {};

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

                initialState.currentSort = {
                    column: columnName,
                    direction: sortDirection
                };
            }

            return initialState;
        },
        componentWillMount: function(){
            this.sortByCurrentSort();
        },
        onPageChange: function(page) {
            this.setState({ currentPage: page });
        },
        sortByCurrentSort: function(){
            // Apply a sort function according to the current sort in the state.
            // This allows us to perform a default sort even on a non sortable column.
            var currentSort = this.state.currentSort;
            if (currentSort.column === null) {
                return;
            }

            this.props.data.sort(function(a, b){
                var keyA = a[currentSort.column];
                var keyB = b[currentSort.column];

                // Default sort
                if (this.props._sortable[currentSort.column] === 'default') {
                    // Reverse direction if we're doing a reverse sort
                    if (keyA < keyB) {
                        return -1 * currentSort.direction;
                    }
                    if (keyA > keyB) {
                        return 1 * currentSort.direction;
                    }

                    return 0;
                }
                else{
                    // Reverse columns if we're doing a reverse sort
                    if (currentSort.direction === 1) {
                        return this.props._sortable[currentSort.column](keyA, keyB);
                    } else {
                        return this.props._sortable[currentSort.column](keyB, keyA);
                    }
                }
            }.bind(this));
        },
        onSort: function(column){
            // Don't perform sort on unsortable columns
            if (typeof(this.props._sortable[column]) === 'undefined') {
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
            // Test if the caller passed in data
            var children = [];
            var columns;
            if (
                this.props.children &&
                this.props.children.length > 0 &&
                this.props.children[0].type.ConvenienceConstructor === Thead
            ) {
                columns = this.props.children[0].getColumns();
            } else {
                columns = this.props.columns || [];
            }

            // Build up table rows
            if (this.props.data && typeof this.props.data.map === 'function') {
                // Build up the columns array
                children = children.concat(this.props.data.map(function(data, i) {
                    // Update the columns array with the data's keys
                    for (var k in data) {
                        if (data.hasOwnProperty(k)) {
                            if (columns.indexOf(k) < 0) {
                                columns.push(k);
                            }
                        }
                    }
                    return <Tr columns={columns} data={data} key={i} />;
                }.bind(this)));
            }

            // Determine pagination properties and which columns to display
            var currentChildren;
            var itemsPerPage = 0;
            var pagination = false;

            if (this.props.itemsPerPage > 0) {
                itemsPerPage = this.props.itemsPerPage;
                pagination = true;
                currentChildren = children.slice(
                        this.state.currentPage * itemsPerPage,
                        (this.state.currentPage + 1) * itemsPerPage);
            } else {
                currentChildren = children;
            }

            return this.transferPropsTo(
                <table>
                    {columns && columns.length > 0 ?
                        <Thead
                            columns={columns}
                            sort={this.state.currentSort}
                            onSort={this.onSort} />
                        : ''
                    }
                    <tbody className="reactable-data">
                        {currentChildren}
                    </tbody>
                    {pagination === true ?
                        <Paginator
                            colSpan={columns.length}
                            numPages={Math.ceil(this.props.data.length / itemsPerPage)}
                            currentPage={this.state.currentPage}
                            onPageChange={this.onPageChange}/> : ''
                    }
                </table>
            );
        }
    });

    return Reactable;
}());

