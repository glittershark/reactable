const internalProps = {
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

export function filterPropsFrom(baseProps) {
    baseProps = baseProps || {};
    var props = {};
    for (var key in baseProps) {
        if (!(key in internalProps)) {
            props[key] = baseProps[key];
        }
    }

    return props;
}

