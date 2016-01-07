import React from 'react';

export class FiltererInput extends React.Component {
    render() {
        const {onFilter, placeholder,value} = this.props
        return (
            <input
                className="reactable-filter-input"
                placeholder={placeholder}
                value={value}
                onChange={ev => onFilter(ev.target.value)}
            />
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
                        onFilter={this.props.onFilter}
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                    />
                </td>
            </tr>
        );
    }
};
