import React from 'react';
import { filterPropsFrom } from './lib/filter_props_from';
import { extractDataFrom } from './lib/extract_data_from';
import { determineRowSpan } from './lib/determine_row_span';
import { extend } from './lib/extend';
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
            currentPage: this.props.currentPage ? this.props.currentPage : 0,
            currentSort: {
                column: null,
                direction: this.props.defaultSortDescending ? -1 : 1
            },
            filter: ''
        };

        // Set the state of the current sort to the default sort
        if (props.sortBy !== false || props.defaultSort !== false) {
            let sortingColumn = props.sortBy || props.defaultSort;
            this.state.currentSort = this.getCurrentSort(sortingColumn);
        }


        // used for generating a key for a <Tr> that will change <Td> counts -- avoids jitters in the update
        this.cloneIndex = 0;
        this.renderNoDataComponent = this.renderNoDataComponent.bind(this);
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
                    case Thead:
                    break;
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
                                    var warning = 'exports.Td specified without ' +
                                        'a `data` property or children, ignoring';
                                    if (typeof (descendant.props.column) !== 'undefined') {
                                        warning += `. See definition for column '${descendant.props.column}'.`;
                                    }
                                    console.warn(warning);
                                    return;
                                }

                                childData[descendant.props.column] = {
                                    value: value,
                                    component: descendant.type,
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

                    default:
                        console.warn ('The only possible children of <Table> are <Thead>, <Tr>, ' +
                                      'or one <Tfoot>.');
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
        this.initializeFilters(props);
    }

    initializeFilters(props) {
        this._filterable = {};
        // Transform filterable properties into a more friendly list
        for (let i in props.filterable) {
            let column = props.filterable[i];
            let columnName, filterFunction;

            if (column instanceof Object) {
                if (typeof(column.column) !== 'undefined') {
                    columnName = column.column;
                } else {
                    console.warn('Filterable column specified without column name');
                    continue;
                }

                if (typeof(column.filterFunction) === 'function') {
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

    initializeSorts(props) {
        this._sortable = {};
        // Transform sortable properties into a more friendly list
        for (let i in props.sortable) {
            let column = props.sortable[i];
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
                    let defaultDirection = this.props.defaultSortDescending ? 'descending' : 'ascending';

                    console.warn('Invalid default sort specified. Defaulting to ' + defaultDirection );
                    sortDirection = this.props.defaultSortDescending ? -1 : 1;
                }
            } else {
                sortDirection = this.props.defaultSortDescending ? -1 : 1;
            }
        } else {
            columnName      = column;
            sortDirection   = this.props.defaultSortDescending ? -1 : 1;
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

    updateCurrentPage(nextPage) {
        if (typeof(nextPage) !== 'undefined' && nextPage !== this.state.currentPage) {
            this.setState({ currentPage: nextPage});
        }
    }

    componentWillMount() {
        this.initialize(this.props);
        this.sortByCurrentSort();
        this.filterBy(this.props.filterBy);
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
        this.updateCurrentPage(nextProps.currentPage);
        this.updateCurrentSort(nextProps.sortBy);
        this.sortByCurrentSort();
        this.filterBy(nextProps.filterBy);
    }

    applyFilter(filter, children) {
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


        let matchedChildren = {}; // row index => the matched data

        // houses the rowSpan definition for each row/columnName combo (e.g. [0]['Name'] provides the rowSpan definition
        //  for the item at row 0 in the 'Name' column
        var rowSpanReferences  = {};

        // the current rowSpan definition for each column, columnName => rowSpan definition
        var currentRowSpanState = {};

        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let data = child.props.data;

            // look at each column in this row and see if there are rowSpan properties
            Object.keys(data).forEach(k => {
                if (typeof k !== 'undefined' && typeof data[k] !== 'undefined') {
                    var state = currentRowSpanState[k];

                    // check if we've exhausted our specified number of rows for this column
                    if (typeof state !== 'undefined') {
                        let rowSpanEnd = state.startsAt + state.rowSpan - 1;
                        if (i >= rowSpanEnd) {
                            delete currentRowSpanState[k];
                        }
                    }

                    let rowSpan = determineRowSpan(child, k);
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
                        let rowSpanEnd = i + rowSpan;
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
            for (let filterColumn in this._filterable) {
                if (typeof(data[filterColumn]) !== 'undefined') {
                    // Default filter
                    if (typeof(this._filterable[filterColumn]) === 'undefined' || this._filterable[filterColumn]=== 'default') {

                        if (extractDataFrom(data, filterColumn).toString().toLowerCase().indexOf(filter) > -1) {

                            // upon a filter text match, we include the cell that matched and all the rows that
                            //  the cell spans
                            let rowSpan = determineRowSpan(child, filterColumn);
                            let rowSpanEnd = i + rowSpan;

                            for (var idx = i; idx < rowSpanEnd && idx < children.length; idx++) {
                                var otherChild = children[idx];
                                matchedChildren[idx] = otherChild;

                                // we no longer need to handle rowSpan for the other rows
                                if (typeof rowSpanReferences[idx] !== 'undefined') {
                                    delete rowSpanReferences[idx][filterColumn]
                                }
                            }

                            // we've rendered all the rows this cell spans, we no longer need to maintain state
                            delete currentRowSpanState[filterColumn];

                            break;
                        }

                    } else {
                        // Apply custom filter
                        if (this._filterable[filterColumn](extractDataFrom(data, filterColumn).toString(), filter)) {
                            matchedChildren[i] = child;
                            break;
                        }
                    }
                }

            }

        }


        // Now that we know which results will be displayed, we can calculate a rowSpan that will encompass
        //  only the visible rows.
        // Iterate through the matched children and check if there are rowSpan modifications they need to make. Hint: we
        //  stored all row/col combos needing a modification in rowSpanReferences
        var resultingChildren = Object.keys(matchedChildren).map((rowIndex => {
            let definitions = rowSpanReferences[rowIndex];
            if (typeof definitions !== 'undefined') {

                // the child we will clone and give a new <Td>
                let child = matchedChildren[rowIndex];

                // we'll be recreating this <Tr> with a rowSpan property carried over from the <Tr> with the rowSpan
                var newData = extend({}, child.props.data);
                var newProps = extend({}, child.props);
                newProps.data = newData;

                Object.keys(definitions).forEach(columnName => {
                    let definition = definitions[columnName];
                    // the tr with the rowSpan property
                    let tr = definition.component;

                    // this child was a part of a rowSpan
                    let rowSpanEnd = definition.startsAt + definition.rowSpan;
                    var remainingRowSpan = rowSpanEnd - rowIndex;

                    // if the rows that we're supposed to span did not match the filter text, we need to reduce the remainingRowSpan
                    for (var idx = rowIndex; idx < rowSpanEnd; idx++) {
                        if (typeof matchedChildren[idx] === 'undefined') {
                            remainingRowSpan--;
                        }
                    }

                    // clone the data for the column to avoid altering the original props (e.g. don't want to change the rowSpan on original Td)
                    newProps.data[columnName] = extend({}, tr.props.data[columnName]);
                    newProps.data[columnName].props = extend({}, newProps.data[columnName].props);
                    newProps.data[columnName].props.rowSpan = remainingRowSpan;

                });

                // new key to avoid jitters, we want a brand new component
                newProps.key = "cloned-"+(this.cloneIndex++);
                newProps.renderState = child.props.renderState;

                return React.cloneElement(child, newProps);

            } else {
                return matchedChildren[rowIndex];
            }
        }).bind(this));

        return resultingChildren;
    }

    sortByCurrentSort() {
        // Apply a sort function according to the current sort in the state.
        // This allows us to perform a default sort even on a non sortable column.
        let currentSort = this.state.currentSort;

        if (currentSort.column === null) {
            return;
        }


        // we'll be splitting each set of data into buckets, then sorting them. A 'set' is defined as rows sharing a
        //  <Td> with a rowSpan
        var singles = []; // rows without any rowSpans
        var buckets = {
        };
        var bucketIndex = 0;

        // helps us keep track of where we are in the last rowSpan we saw
        var currentRowSpan = null;

        for (var idx = 0; idx < this.data.length; idx++) {
            let obj = this.data[idx];

            // check if rowSpan is completed
            if (currentRowSpan != null) {
                let rowSpanEnd = currentRowSpan.startsAt + currentRowSpan.rowSpan;
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
                let rowSpanOfSortColumn = determineRowSpan(obj.data, currentSort.column);

                if (rowSpanOfSortColumn !== 1) {
                    // not supported
                    console.warn("Cannot sort by column '"+currentSort.column+"', sorting by columns that have cells with rowSpan is currently not supported. See https://github.com/glittershark/reactable/issues/84");
                    return;
                }

                for (var col in obj.data) {

                    if (col === currentSort.column) {
                        // ignore the sort column
                        continue;
                    }

                    let rowSpanCurrentCol = determineRowSpan(obj.data, col);

                    // if the rowSpan we found is less than the current debt but greater than the rowSpan of our column,
                    //      we will use that number
                    if (rowSpanCurrentCol > rowSpanOfSortColumn && (currentRowSpan == null || currentRowSpan.rowSpan > rowSpanCurrentCol)) {
                        currentRowSpan = {
                            startsAt: idx,
                            rowSpan: rowSpanCurrentCol
                        }
                    }
                }

            }


            if (currentRowSpan == null) {
                singles.push(obj)
            } else {
                buckets[bucketIndex].push(obj);
            }
        }

        // run a sort on each bucket
        buckets = Object.keys(buckets).map(dataSet => {
            return buckets[dataSet].sort(this.sortFunction.bind(this));
        });
        buckets.push(singles.sort(this.sortFunction.bind(this)));

        // flatten
        this.data = buckets.reduce((a,current) => {
            // look for row spans and put the definition of the <Td> on the top row after sort
            if (current.length > 0) {
                for (var idx = 0; idx < current.length; idx++) {
                    let obj = current[idx];

                    for (var col in obj.data) {
                        let rowSpan = determineRowSpan(obj.data, col);
                        let currentPosition = idx % rowSpan;
                        let newRowSpanIdx = idx - currentPosition;

                        if (idx !== newRowSpanIdx) {
                            // need to push the rowSpan property & values to the top row
                            current[newRowSpanIdx].data[col] = extend({}, obj.data[col]);
                            delete obj.data[col];
                        }
                    }
                }
            }
            return a.concat(current);
        }, []);

    }

    sortFunction(a, b) {
        let currentSort = this.state.currentSort;

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
            currentSort.direction = this.props.defaultSortDescending ? -1 : 1;
        }

        // Set the current sort and pass it to the sort function
        this.setState({ currentSort: currentSort });
        this.sortByCurrentSort();

        if (typeof(this.props.onSort) === 'function') {
            this.props.onSort(currentSort);
        }
    }

    renderNoDataComponent(columns) {
        let noDataFunc = this.props.noDataComponent;
        if (typeof noDataFunc === 'function') {
            return noDataFunc(columns);
        } else if (this.props.noDataText) {
            return <tr className="reactable-no-data"><td colSpan={columns.length}>{this.props.noDataText}</td></tr>;
        } else {
            return null;
        }
    }

    render() {
        let children = [];
        let columns;
        let userColumnsSpecified = false;
        let showHeaders = typeof this.props.hideTableHeader === 'undefined';

        let firstChild = null;


        if (this.props.children) {
            if (
                this.props.children.length > 0 &&
                this.props.children[0] &&
                this.props.children[0].type === Thead
            ) {
                firstChild = this.props.children[0]
            } else if (
                this.props.children.type === Thead
            ) {
                firstChild = this.props.children
            }
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
            var renderState = {};
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
                    <Tr columns={columns} key={i} data={data} {...props} renderState={renderState}/>
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
        let { noDataComponent, ...props } = filterPropsFrom(this.props);

        var tableHeader = null;
        if (columns && columns.length > 0 && showHeaders) {
            tableHeader = (
                <Thead columns={columns}
                       filtering={filtering}
                       onFilter={filter => {
                     this.setState({ filter: filter });
                     if (this.props.onFilter) {
                        this.props.onFilter(filter)
                     }
                 }}
                       filterPlaceholder={this.props.filterPlaceholder}
                       filterClassName={this.props.filterClassName}
                       currentFilter={this.state.filter}
                       sort={this.state.currentSort}
                       sortableColumns={this._sortable}
                       onSort={this.onSort.bind(this)}
                       key="thead"/>
            )
        }
        return <table {...props}>
            {tableHeader}
            <tbody className="reactable-data" key="tbody">
                {currentChildren.length > 0 ? currentChildren : this.renderNoDataComponent(columns)}
            </tbody>
            {pagination === true ?
             <Paginator colSpan={columns.length}
                 pageButtonLimit={pageButtonLimit}
                 numPages={numPages}
                 currentPage={currentPage}
                 onPageChange={page => {
                     this.setState({ currentPage: page });
                     if (this.props.onPageChange) {
                        this.props.onPageChange(page)
                     }
                 }}
                 previousPageLabel={this.props.previousPageLabel}
                 nextPageLabel={this.props.nextPageLabel}
                 key="paginator"/>
             : null}
            {this.tfoot}
        </table>;
    }
}

Table.defaultProps = {
    sortBy: false,
    defaultSort: false,
    defaultSortDescending: false,
    itemsPerPage: 0,
    filterBy: '',
    hideFilterInput: false
};

Table.propTypes = {
    sortBy: React.PropTypes.bool,
    itemsPerPage: React.PropTypes.number,               // number of items to display per page
    filterable: React.PropTypes.array,                  // columns to look at when applying the filter specified by filterBy
    filterBy: React.PropTypes.string,                   // text to filter the results by (see filterable)
    hideFilterInput: React.PropTypes.bool,              // Whether the default input field for the search/filter should be hidden or not
    hideTableHeader: React.PropTypes.bool,              // Whether the table header should be hidden or not
    noDataText: React.PropTypes.string,                 // Text to be displayed in the event there is no data to show
    noDataComponent: React.PropTypes.func               // function called to provide a component to display in the event there is no data to show (supercedes noDataText)
};