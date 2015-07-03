import { isUnsafe } from './unsafe';
import { filterPropsFrom } from './lib/filter_props_from';

export class Th {
    render() {
        let childProps;

        if (isUnsafe(this.props.children)) {
            return <th {...filterPropsFrom(this.props)}
                dangerouslySetInnerHTML={{__html: this.props.children.toString()}}/>
        } else {
            return <th {...filterPropsFrom(this.props)}>
                {this.props.children}
            </th>;
        }
    }
};

