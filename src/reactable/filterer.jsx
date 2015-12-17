import React from 'react';
import ReactDOM from 'react-dom';

export class FiltererInput extends React.Component {

    onChange(e) {
      if ( e && e.keyCode && e.keyCode == 13 ) {
        this.props.onFilter(ReactDOM.findDOMNode(this).value, true)
      } else{
        this.props.onFilter(ReactDOM.findDOMNode(this).value, false)
      }
    }

    render() {
      let value = ''
      if (typeof(this.props.value) != 'string') {
        let should_slice = false
        for(let key in this.props.value) {
          if(key && this.props.value[key]) {
            should_slice = true
            value +=  ' ' + key + ': ' + this.props.value[key] + ','
          } else {
            value += key + ': '
          }
        }
        if (value.slice(-1) == ',') {
          value = value.slice(0, -1)
        }
        value = value.trimLeft()
      } else {
        value = this.props.value
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
