/** @jsx React.DOM */
var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

var ReactTestUtils = React.addons.TestUtils;
var expect = chai.expect;

describe('Reactable', function() {
    describe('directly passing a data array', function() {
        before(function() {
            ReactTestUtils.renderIntoDocument(
                Table( {className:"table", id:"table", data:[
                    {'Name': 'Griffin Smith', 'Age': '18'},
                    {'Age': '23', 'Name': 'Lee Salminen'},
                    {'Age': '28', 'Position': 'Developer'}
                ]} ),
                document.getElementById('test-div')
            );
        });

        it('renders the table', function() {
            expect($('table#table.table')).to.be.defined;
        });
    });
});
