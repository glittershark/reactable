"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterPropsFrom = filterPropsFrom;
var internalProps = {
    columns: true,
    sortable: true,
    filterable: true,
    sortBy: true,
    defaultSort: true,
    itemsPerPage: true,
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
