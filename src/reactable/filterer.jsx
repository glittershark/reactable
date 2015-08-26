export class FiltererInput extends React.Component {
    onChange() {
        this.props.onFilter(React.findDOMNode(this).value);
    }

    render() {
        return (
            <input type="text"
                className="reactable-filter-input"
                placeholder={this.props.placeholder}
                value={this.props.value}
                onKeyUp={this.onChange.bind(this)}
                onChange={this.onChange.bind(this)} />
        );
    }
};

export class Filterer extends React.Component {
    render() {
        if (typeof this.props.colSpan === 'undefined') {
            throw new TypeError('Must pass a colSpan argument to Filterer');
        }

        var filterLabel;
        if (this.props.filterLabel) {
            filterLabel = (<label>{this.props.filterLabel}</label>);
        }

        return (
            <tr className="reactable-filterer">
                <td colSpan={this.props.colSpan}>
                    {filterLabel}
                    <FiltererInput onFilter={this.props.onFilter}
                        value={this.props.value}
                        placeholder={this.props.placeholder}/>
                </td>
            </tr>
        );
    }
};

