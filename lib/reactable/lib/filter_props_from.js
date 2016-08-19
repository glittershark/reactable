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
    sortBy: true,
    defaultSort: true,
    itemsPerPage: true,
    childNode: true,
    data: true,
    children: true,
    topPagination: true,
    itemsNumber: true,
    numPages: true,
    currentPage: true,
    topPaginationElem: true,
    filtering: true,
    onFilter: true,
    filterCleanBtn: true,
    onClean: true,
    onPageChange: true,
    filterPlaceholder: true,
    currentFilter: true,
    sort: true,
    sortableColumns: true,
    onSort: true,
    locale: true
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
