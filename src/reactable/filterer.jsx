import React from 'react';
import ReactDOM from 'react-dom';

export class FiltererInput extends React.Component {
    onChange() {
        this.props.onFilter(ReactDOM.findDOMNode(this).value);
    }

    render() {
      let value = this.props.value

      if (typeof(value) != 'string') {
        let col = Object.keys(this.props.value).toString()
        let val = Object.keys(this.props.value).map(key => this.props.value[key]).toString()
         value = col+': '+val
      }
        return (
            <input type="text"
                className="reactable-filter-input"
                placeholder={this.props.placeholder}
                value={value}
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

        return (
            <tr className="reactable-filterer">
                <td colSpan={this.props.colSpan}>
                    <FiltererInput onFilter={this.props.onFilter}
                        value={this.props.value}
                        placeholder={this.props.placeholder}/>
                </td>
            </tr>
        );
    }
};
