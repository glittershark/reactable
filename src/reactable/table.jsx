import React from 'react';
import { filterPropsFrom } from './lib/filter_props_from';
import { extractDataFrom } from './lib/extract_data_from';
import { isUnsafe } from './unsafe';
import { Thead } from './thead';
import { Th } from './th';
import { Tr } from './tr';
import { Tfoot } from './tfoot';
import { Paginator } from './paginator';

export class Table extends React.Component {
    constructor(props) {
        super(props);

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
            let sortingColumn = props.sortBy || props.defaultSort;
            this.state.currentSort = this.getCurrentSort(sortingColumn);
        }
    }

    filterBy(filter) {
        this.setState({ filter: filter });
    }

    // Translate a user defined column array to hold column objects if strings are specified
    // (e.g. ['column1'] => [{key: 'column1', label: 'column1'}])
    translateColumnsArray(columns) {
        return columns.map(function(column, i) {
            if (typeof(column) === 'string') {
                return {
                    key:   column,
                    label: column
                };
            } else {
                if (typeof(column.sortable) !== 'undefined') {
                    let sortFunction = column.sortable === true ? 'default' : column.sortable;
                    this._sortable[column.key] = sortFunction;
                }

                return column;
            }
        }.bind(this));
    }

    parseChildData(props) {
        let data = [], tfoot;

        // Transform any children back to a data array
        if (typeof(props.children) !== 'undefined') {
            React.Children.forEach(props.children, function(child) {
                if (typeof(child) === 'undefined' || child === null) {
                    return;
                }

                switch (child.type) {
                    case Tfoot:
                        if (typeof(tfoot) !== 'undefined') {
                            console.warn ('You can only have one <Tfoot>, but more than one was specified.' +
                                          'Ignoring all but the last one');
                        }
                        tfoot = child;
                    break;
                    case Tr:
                        let childData = child.props.data || {};

                        React.Children.forEach(child.props.children, function(descendant) {
                            // TODO
                            /* if (descendant.type.ConvenienceConstructor === Td) { */
                            if (
                                typeof(descendant) !== 'object' ||
                                descendant == null
                            ) {
                                return;
                            } else if (typeof(descendant.props.column) !== 'undefined') {
                                let value;

                                if (typeof(descendant.props.data) !== 'undefined') {
                                    value = descendant.props.data;
                                } else if (typeof(descendant.props.children) !== 'undefined') {
                                    value = descendant.props.children;
                                } else {
                                    console.warn('exports.Td specified without ' +
                                                 'a `data` property or children, ' +
                                                 'ignoring');
                                    return;
                                }

                                childData[descendant.props.column] = {
                                    value: value,
                                    props: filterPropsFrom(descendant.props),
                                    __reactableMeta: true
                                };
                            } else {
                                console.warn('exports.Td specified without a ' +
                                             '`column` property, ignoring');
                            }
                        });

                        data.push({
                            data: childData,
                            props: filterPropsFrom(child.props),
                            __reactableMeta: true
                        });
                    break;
                }
            }.bind(this));
        }

        return { data, tfoot };
    }

    initialize(props) {
        this.data = props.data || [];
        let { data, tfoot } = this.parseChildData(props);

        this.data = this.data.concat(data);
        this.tfoot = tfoot;

        this.initializeSorts(props);
    }

    initializeSorts() {
        this._sortable = {};
        // Transform sortable properties into a more friendly list
        for (let i in this.props.sortable) {
            let column = this.props.sortable[i];
            let columnName, sortFunction;

            if (column instanceof Object) {
                if (typeof(column.column) !== 'undefined') {
                    columnName = column.column;
                } else {
                    console.warn('Sortable column specified without column name');
                    return;
                }

                if (typeof(column.sortFunction) === 'function') {
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
    }

    getCurrentSort(column) {
        let columnName, sortDirection;

        if (column instanceof Object) {
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
                sortDirection = 1;
            }
        } else {
            columnName      = column;
            sortDirection   = 1;
        }

        return {
            column: columnName,
            direction: sortDirection
        };
    }

    updateCurrentSort(sortBy) {
        if (sortBy !== false &&
            sortBy.column !== this.state.currentSort.column &&
                sortBy.direction !== this.state.currentSort.direction) {

            this.setState({ currentSort: this.getCurrentSort(sortBy) });
        }
    }

    componentWillMount() {
        this.initialize(this.props);
        this.sortByCurrentSort();
        this.filterBy(this.props.filterBy);
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
        this.updateCurrentSort(nextProps.sortBy);
        this.sortByCurrentSort();
        this.filterBy(nextProps.filterBy);
    }

    applyFilter(filter, children) {
      if(typeof(filter) === 'string'){
        // Helper function to apply filter text to a list of table rows
        filter = filter.toLowerCase();
        let matchedChildren = [];

        for (let i = 0; i < children.length; i++) {
            let data = children[i].props.data;

            for (let j = 0; j < this.props.filterable.length; j++) {
                let filterColumn = this.props.filterable[j];

                if (
                    typeof(data[filterColumn]) !== 'undefined' &&
                        extractDataFrom(data, filterColumn).toString().toLowerCase().indexOf(filter) > -1
                ) {
                    matchedChildren.push(children[i]);
                    break;
                }
            }
        }

        return matchedChildren;
    } else {
      let cols = Object.keys(filter)
      filter = cols.map(key => filter[key])
      filter = filter.toString().toLowerCase();

      let matchedChildren = [];
      let filterColumn = cols.toString()

      for (let i = 0; i < children.length; i++) {
          let data = children[i].props.data;

          if (
              typeof(data[filterColumn]) !== 'undefined' &&
                  extractDataFrom(data, filterColumn).toString().toLowerCase().indexOf(filter) > -1
          ) {
              matchedChildren.push(children[i]);
              break;
          }
      }

      return matchedChildren;
    }
  }

  onFilter(filter) {
      if( typeof(filter) === 'string' && filter.indexOf(':') != -1) {
        let filterObj = {}
        filter = filter.split(':')
        let col = filter[0].trim()
        let val = filter[1].trim()
        filterObj[col] = val
        filter = filterObj
      }

    this.setState({ filter: filter });
  }

    sortByCurrentSort() {
        // Apply a sort function according to the current sort in the state.
        // This allows us to perform a default sort even on a non sortable column.
        let currentSort = this.state.currentSort;

        if (currentSort.column === null) {
            return;
        }

        this.data.sort(function(a, b){
            let keyA = extractDataFrom(a, currentSort.column);
            keyA = isUnsafe(keyA) ? keyA.toString() : keyA || '';
            let keyB = extractDataFrom(b, currentSort.column);
            keyB = isUnsafe(keyB) ? keyB.toString() : keyB || '';

            // Default sort
            if (
                typeof(this._sortable[currentSort.column]) === 'undefined' ||
                    this._sortable[currentSort.column] === 'default'
            ) {

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
    }

    onSort(column) {
        // Don't perform sort on unsortable columns
        if (typeof(this._sortable[column]) === 'undefined') {
            return;
        }

        let currentSort = this.state.currentSort;

        if (currentSort.column === column) {
            currentSort.direction *= -1;
        } else {
            currentSort.column = column;
            currentSort.direction = 1;
        }

        // Set the current sort and pass it to the sort function
        this.setState({ currentSort: currentSort });
        this.sortByCurrentSort();

        if (typeof(this.props.onSort) === 'function') {
            this.props.onSort(currentSort);
        }
    }

    render() {
        let children = [];
        let columns;
        let userColumnsSpecified = false;

        let firstChild = null;

        if (
            this.props.children &&
            this.props.children.length > 0 &&
            this.props.children[0].type === Thead
        ) {
            firstChild = this.props.children[0]
        } else if (
            typeof this.props.children !== 'undefined' &&
            this.props.children.type === Thead
        ) {
            firstChild = this.props.children
        }

        if (firstChild !== null) {
            columns = Thead.getColumns(firstChild);
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
            children = children.concat(this.data.map(function(rawData, i) {
                let data = rawData;
                let props = {};
                if (rawData.__reactableMeta === true) {
                    data = rawData.data;
                    props = rawData.props;
                }

                // Loop through the keys in each data row and build a td for it
                for (let k in data) {
                    if (data.hasOwnProperty(k)) {
                        // Update the columns array with the data's keys if columns were not
                        // already specified
                        if (userColumnsSpecified === false) {
                            let column = {
                                key:   k,
                                label: k
                            };

                            // Only add a new column if it doesn't already exist in the columns array
                            if (
                                columns.find(function(element) {
                                return element.key === column.key;
                            }) === undefined
                            ) {
                                columns.push(column);
                            }
                        }
                    }
                }

                return (
                    <Tr columns={columns} key={i} data={data} {...props} />
                );
            }.bind(this)));
        }

        if (this.props.sortable === true) {
            for (let i = 0; i < columns.length; i++) {
                this._sortable[columns[i].key] = 'default';
            }
        }

        // Determine if we render the filter box
        let filtering = false;
        if (
            this.props.filterable &&
                Array.isArray(this.props.filterable) &&
                    this.props.filterable.length > 0 &&
                        !this.props.hideFilterInput
        ) {
            filtering = true;
        }

        // Apply filters
        let filteredChildren = children;
        if (this.state.filter !== '') {
            filteredChildren = this.applyFilter(this.state.filter, filteredChildren);
        }

        // Determine pagination properties and which columns to display
        let itemsPerPage = 0;
        let pagination = false;
        let numPages;
        let currentPage = this.state.currentPage;
        let pageButtonLimit = this.props.pageButtonLimit || 10;

        let currentChildren = filteredChildren;
        if (this.props.itemsPerPage > 0) {
            itemsPerPage = this.props.itemsPerPage;
            numPages = Math.ceil(filteredChildren.length / itemsPerPage);

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
        let props = filterPropsFrom(this.props);

        let noDataText = this.props.noDataText ? <tr className="reactable-no-data"><td colSpan={columns.length}>{this.props.noDataText}</td></tr> : null;

        return <table {...props}>
            {columns && columns.length > 0 ?
             <Thead columns={columns}
                 filtering={filtering}
                 onFilter={this.onFilter.bind(this)}
                 filterPlaceholder={this.props.filterPlaceholder}
                 currentFilter={this.state.filter}
                 sort={this.state.currentSort}
                 sortableColumns={this._sortable}
                 onSort={this.onSort.bind(this)}
                 key="thead"/>
             : null}
            <tbody className="reactable-data" key="tbody">
                {currentChildren.length > 0 ? currentChildren : noDataText}
            </tbody>
            {pagination === true ?
             <Paginator colSpan={columns.length}
                 pageButtonLimit={pageButtonLimit}
                 numPages={numPages}
                 currentPage={currentPage}
                 onPageChange={page => {
                     this.setState({ currentPage: page });
                 }}
                 key="paginator"/>
             : null}
            {this.tfoot}
        </table>;
    }
}

Table.defaultProps = {
    sortBy: false,
    defaultSort: false,
    itemsPerPage: 0,
    filterBy: '',
    hideFilterInput: false
};
