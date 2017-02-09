import React from 'react';
import { Td } from './td';
import { toArray } from './lib/to_array';
import { filterPropsFrom } from './lib/filter_props_from';

export class Tr extends React.Component {
    render() {
        var children = toArray(React.Children.children(this.props.children));

        if (
            this.props.data &&
                this.props.columns &&
                    typeof this.props.columns.map === 'function'
        ) {
            if (typeof(children.concat) === 'undefined') { console.log(children); }

            var columnsFromProps = [];
            var columnsToSkip = 0;
            this.props.columns.forEach(function({ props = {}, ...column}, i) {
                var component = null;

                if (columnsToSkip <= 0) {

                    if (this.props.data.hasOwnProperty(column.key)) {
                        var value = this.props.data[column.key];

                        if (
                            typeof(value) !== 'undefined' &&
                            value !== null &&
                            value.__reactableMeta === true
                        ) {
                            props = value.props;
                            value = value.value;
                        }

                        var colSpan = props.colSpan || 1;

                        // we will use 1 column (ourself), no need to skip that
                        columnsToSkip = colSpan - 1;

                        component = <Td column={column} key={column.key} {...props}>{value}</Td>;
                    } else {
                        component = <Td column={column} key={column.key}/>;
                    }

                    if (component !== null) {
                        columnsFromProps.push(component)
                    }
                } else {
                    columnsToSkip--;
                }
            }.bind(this));

            children = children.concat(columnsFromProps);
        }

        // Manually transfer props
        var props = filterPropsFrom(this.props);

        return React.DOM.tr(props, children);
    }
};

Tr.childNode = Td;
Tr.dataType = 'object';

