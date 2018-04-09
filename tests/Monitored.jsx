class Monitored extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { component, ...props} = this.props;
        return React.createElement(component, props);
    }
}

Monitored.defaultProps = {
    component: Reactable.Td
};

export default Monitored;
