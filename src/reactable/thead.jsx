import React from 'react';
import { Th } from './th';
import { Filterer } from './filterer';
import { filterPropsFrom } from './lib/filter_props_from';

import { BtnPaginator } from './btnPaginator';
import { FiltererInput } from './filterer';

export class Thead extends React.Component {
    static getColumns(component) {
        // Can't use React.Children.map since that doesn't return a proper array
        let columns = [];
        React.Children.forEach(component.props.children, th => {
            if (typeof th.props.children === 'string') {
                columns.push(th.props.children);
            } else if (typeof th.props.column === 'string') {
                columns.push({
                    key: th.props.column,
                    label: th.props.children,
                    props: filterPropsFrom(th.props)
                });
            } else {
                throw new TypeError(
                    '<th> must have either a "column" property or a string ' +
                        'child');
            }
        });

        return columns;
    }

    handleClickTh(column) {
        this.props.onSort(column.key);
    }

    render() {
        // Declare the list of Ths
        var Ths = [];
        for (var index = 0; index < this.props.columns.length; index++) {
            var column = this.props.columns[index];
            var thClass = `reactable-th-${column.key.replace(/\s+/g, '-').toLowerCase()}`;
            var sortClass = '';

            if (this.props.sortableColumns[column.key]) {
                sortClass += 'reactable-header-sortable ';
            }

            if (this.props.sort.column === column.key) {
                sortClass += 'reactable-header-sort';
                if (this.props.sort.direction === 1) {
                    sortClass += '-asc';
                }
                else {
                    sortClass += '-desc';
                }
            }

            if (sortClass.length > 0) {
              thClass += ` ${sortClass}`;
            }

            if (
                typeof(column.props) === 'object' &&
                typeof(column.props.className) === 'string'
            ) {
                thClass += ` ${column.props.className}`;
            }

            Ths.push(
                <Th {...column.props}
                    className={thClass}
                    key={index}
                    onClick={this.handleClickTh.bind(this, column)}
                    role="button"
                    tabIndex="0">
                    {column.label}
                </Th>
            );
        }

        // Manually transfer props
        var props = filterPropsFrom(this.props);
        return (
            <thead {...props}>
                {this.props.filtering === true ?
                    <Filterer
                        colSpan={this.props.columns.length}
                        onFilter={this.props.onFilter}
                        placeholder={this.props.filterPlaceholder}
                        value={this.props.currentFilter}
                    /> : null
                }
                {this.props.topPagination ?
                    <tr className="reactable-btnPagination">
                        <td colSpan={this.props.columns.length}>
                            <div className="reactable-topDesign">
                                {this.props.topPaginationElem.left}
                                <FiltererInput
                                    onFilter={this.props.onFilter}
                                    placeholder={this.props.filterPlaceholder}
                                    value={this.props.currentFilter}
                                />
                                <BtnPaginator
                                    locale={this.props.locale}
                                    itemsPerPage={this.props.itemsPerPage}
                                    itemsNumber={this.props.itemsNumber}
                                    numPages={this.props.numPages}
                                    currentPage={this.props.currentPage}
                                    onPageChange={this.props.onPageChange}
                                    key="paginator"
                                />
                                {this.props.topPaginationElem.right}
                            </div>
                        </td>
                    </tr> : null
                }
                <tr className="reactable-column-header">{Ths}</tr>
            </thead>
        );
    }
};
