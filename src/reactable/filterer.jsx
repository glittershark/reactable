import React from 'react';

export class FiltererInput extends React.Component {
    render() {
        const {onFilter, onClean, filterCleanBtn, placeholder, value} = this.props
        return (
            <div className="reactable-filter-input-container">
                <input
                    className="reactable-filter-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={ev => onFilter(ev.target.value)}
                />
                {filterCleanBtn &&
                    <div onClick={() => onClean()} className="reactable-btn-clean">
                        &times;
                    </div>
                }
            </div>
        );
    }
};

export class Filterer extends React.Component {
    render() {
        if (typeof this.props.colSpan === 'undefined') {
            throw new TypeError('Must pass a colSpan argument to Filterer');
        }

        return (
            <tr className="reactable-filterer">
                <td colSpan={this.props.colSpan}>
                    <FiltererInput
                        filterCleanBtn={this.props.filterCleanBtn}
                        onClean={this.props.onClean}
                        onFilter={this.props.onFilter}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                </td>
            </tr>
        );
    }
};
