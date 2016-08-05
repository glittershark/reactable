"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterPropsFrom = filterPropsFrom;
var internalProps = {
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
