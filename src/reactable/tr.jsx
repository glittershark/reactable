import React from 'react';
import { Td } from './td';
import { toArray } from './lib/to_array';
import { filterPropsFrom } from './lib/filter_props_from';
import { extend } from './lib/extend';

export class Tr extends React.Component {

    /**
     * Determines whether a row should skip the creation of a <Td> based on the rowSpan prop
     * @param state the state of the column
     * @param data the data
     * @param k the column key
     * @returns {boolean}
     */
    isRowSpanSkip(state, data, k) {
        var rowSpanSkip = false;

        // if we have already noted this <Td> has a row span, we will use the stored state to make
        //  a determination whether we render or skip
        if (typeof state.rowSpanDebt !== 'undefined' && state.rowSpanDebt > 0) {
            //anything greater than 0, we skip render and decrement
            rowSpanSkip = true;
            state.rowSpanDebt--;
        }

        if (typeof data[k] !== 'undefined' && data[k] != null) {
            let props = data[k].props;

            // check if this column will be spanning multiple rows
            if (typeof props !== 'undefined' && typeof props.rowSpan !== 'undefined') {
                if (isNaN(props.rowSpan)) {
                    console.warn("rowSpan for column " + k + " is not a valid integer: " + props.rowSpan);
                    return false;
                }

                if (!rowSpanSkip) {
                    // restart the rowSpanCount for this column: subtract 1 as all rows will have rowSpan of at least 1
                    state.rowSpanDebt = props.rowSpan - 1;
                }
            }
        }
        return rowSpanSkip;
    }

    /**
     * Build all <Td> elements to be displayed in this <Tr>
     * @returns {Array}
     */
    buildRows(renderState) {
        let columns = this.props.columns;
        var tds = [];

        // iterate through all columns and create a <Td> for each one
        for (var idx = 0; idx < columns.length; idx++) {
            var { props = {}, ...column } = columns[idx];

            var state = renderState[column.key];
            if (typeof state === 'undefined') {
                state = {};
                renderState[column.key] = state;
            }

            let skip = this.isRowSpanSkip(state, this.props.data, column.key);
            if (skip) {
                continue; // skip render of <Td>
            }

            if (this.props.data.hasOwnProperty(column.key)) {
                var value = this.props.data[column.key];

                if (
                    typeof(value) !== 'undefined' &&
                    value !== null &&
                    value.__reactableMeta === true
                ) {
                    // merge the props
                    props = extend(props, value.props);
                    value = value.value;
                }

                tds.push(
                    <Td column={column} key={column.key} {...props}>{value}</Td>
                );
            } else {
                tds.push(
                    <Td column={column} key={column.key} />
                );
            }
        }
        return tds;
    }

    render() {
        var children = toArray(React.Children.children(this.props.children));

        // Manually transfer props
        var { renderState, ...props } = filterPropsFrom(this.props);

        if (
            this.props.data &&
                this.props.columns &&
                    typeof this.props.columns.map === 'function'
        ) {
            if (typeof(children.concat) === 'undefined') { console.log(children); }
            let trs = this.buildRows.call(this, renderState);
            children = children.concat(trs);
        }


        return React.DOM.tr(props, children);
    }
}

Tr.childNode = Td;
Tr.dataType = 'object';

