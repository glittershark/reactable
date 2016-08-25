
export function determineRowSpan(row, colName) {

    var rowSpan = 1;

    if (typeof row !== 'undefined' && row != null) {
        var tdData = null;

        if (typeof row.props !== 'undefined' && row.props !== null && row.props.data !== null) {
            tdData = row.props.data;
        } else if (typeof row[colName] !== 'undefined') {
            tdData = row;
        }

        if (typeof tdData !== 'undefined' && tdData !== null) {
            let props = tdData[colName].props;
            if (typeof props !== 'undefined' && typeof props.rowSpan !== 'undefined') {
                rowSpan = parseInt(props.rowSpan);
            }
        }
    }

    return rowSpan;
}
