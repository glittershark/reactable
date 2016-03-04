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
        const {sort, sortableColumns, filtering, columns, onFilter, onClean, filterPlaceholder, currentFilter, topPagination, filterCleanBtn, locale, itemsPerPage, itemsNumber, numPages, currentPage, onPageChange, topPaginationElem} = this.props;

        // Declare the list of Ths
        var Ths = [];
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            var thClass = `reactable-th-${column.key.replace(/\s+/g, '-').toLowerCase()}`;
            var sortClass = '';

            if (sortableColumns[column.key]) {
                sortClass += 'reactable-header-sortable ';
            }

            if (sort.column === column.key) {
                sortClass += 'reactable-header-sort';
                if (sort.direction === 1) {
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
                {filtering === true ?
                    <Filterer
                        colSpan={columns.length}
                        onFilter={onFilter}
                        placeholder={filterPlaceholder}
                        value={currentFilter}
                    /> : null
                }
                {topPagination ?
                    <tr className="reactable-btnPagination">
                        <td colSpan={columns.length}>
                            <div className="reactable-topDesign">
                                <div className="reactable-leftElem">
                                    {topPaginationElem.left}
                                </div>
                                <div className="reactable-mainElem">
                                    <FiltererInput
                                        filterCleanBtn={filterCleanBtn}
                                        onClean={onClean}
                                        onFilter={onFilter}
                                        placeholder={filterPlaceholder}
                                        value={currentFilter}
                                    />
                                    <BtnPaginator
                                        locale={locale}
                                        itemsPerPage={itemsPerPage}
                                        itemsNumber={itemsNumber}
                                        numPages={numPages}
                                        currentPage={currentPage}
                                        onPageChange={onPageChange}
                                        key="paginator"
                                    />
                                </div>
                                <div className="reactable-rightElem">
                                    {topPaginationElem.right}
                                </div>
                            </div>
                        </td>
                    </tr> : null
                }
                <tr className="reactable-column-header">{Ths}</tr>
            </thead>
        );
    }
};
