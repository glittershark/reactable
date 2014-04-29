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

    var Reactable = {};

    var ParseChildDataMixin = {
        parseChildData: function(expectedClass) {
            var data = [];

            // Transform any children back to a data array
            if (this.props.children !== undefined) {
                React.Children.forEach(this.props.children, function(child) {
                    if (child.type.ConvenienceConstructor === this.type.ConvenienceConstructor.childNode) {
                        data.push(child.props.data);
                    }
                }.bind(this));
            }

            return data;
        }
    };

    var Td = Reactable.Td = React.createClass({displayName: 'Td',
        render: function() {
            return this.transferPropsTo(
                React.DOM.td(null, 
                    this.props.children
                )
            );
        }
    });


    var Tr = Reactable.Tr = React.createClass({displayName: 'Tr',
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
                        return Td( {col:column, key:column}, this.props.data[column]);
                    } else {
                        return Td( {col:column, key:column} );
                    }
                }.bind(this)));
            }

            return this.transferPropsTo(
                React.DOM.tr(null, children)
            );
        }
    });

    var Thead = Reactable.Thead = React.createClass({displayName: 'Thead',
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
            return this.transferPropsTo(Th(null, this.props.children));
        }
    });

    var Th = Reactable.Th = React.createClass({displayName: 'Th',
        render: function() {
            return this.transferPropsTo(React.DOM.th(null, this.props.children));
        }
    });

    var Paginator = React.createClass({displayName: 'Paginator',
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
                    React.DOM.a( {className:className, key:i,
                       // create function to get around for-loop closure issue
                       onClick:(function(pageNum) {
                           return function() {
                               this.props.onPageChange(pageNum);
                           }.bind(this)
                       }.bind(this))(i)}, i + 1)
                );
            }

            return (
                React.DOM.tbody( {className:"reactable-pagination"}, 
                    React.DOM.tr(null, 
                        React.DOM.td( {colSpan:this.props.colSpan}, 
                            pageButtons
                        )
                    )
                )
            );
        }
    });

    var Table = Reactable.Table = React.createClass({displayName: 'Table',
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
                itemsPerPage: 0
            }

            return defaultProps;
        },
        getInitialState: function() {
            var initialState = {
                currentPage: 0,
            }

            return initialState;
        },
        onPageChange: function(page) {
            this.setState({ currentPage: page });
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
                    return Tr( {columns:columns, data:data, key:i} );
                }.bind(this)));
            }

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
                React.DOM.table(null, 
                    columns && columns.length > 0 ?
                        React.DOM.thead(null, 
                            React.DOM.tr(null, 
                                columns.map(function(col) {
                                    return (React.DOM.th( {key:col}, col));
                                }.bind(this))
                            )
                        ) : '',
                    
                    React.DOM.tbody( {className:"reactable-data"}, 
                        currentChildren
                    ),
                    pagination === true ?
                        Paginator(
                            {colSpan:columns.length,
                            numPages:Math.ceil(this.props.data.length / itemsPerPage),
                            currentPage:this.state.currentPage,
                            onPageChange:this.onPageChange}) : ''
                    
                )
            );
        }
    });

    return Reactable;
}());

