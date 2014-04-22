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
            React.renderComponent(
                Table( {className:"table", id:"table", data:[
                    {'Name': 'Griffin Smith', 'Age': '18'},
                    {'Age': '23', 'Name': 'Lee Salminen'},
                    {'Age': '28', 'Position': 'Developer'}
                ]} ),
                document.getElementsByTagName('body')[0]
            );
        });

        it('renders the table', function() {
            expect($('table#table.table')).to.exist;
        });

        it('renders the column headers in the table', function() {
            var headers = [];
            $('th').each(function() {
                headers.push($(this).text());
            });

            expect(headers).to.eql(['Name', 'Age', 'Position']);
        });

        it('renders the first row with the correct data', function() {
            var firstRow = $('#table tr')[1];
            var tds = $(firstRow).find('td');

            expect($(tds[0])).to.have.text('Griffin Smith');
            expect($(tds[1])).to.have.text('18');
            expect($(tds[2])).to.have.text('');
        });

        it('renders the second row with the correct data', function() {
            var secondRow = $('#table tr')[2];
            var tds = $(secondRow).find('td');

            expect($(tds[0])).to.have.text('Lee Salminen');
            expect($(tds[1])).to.have.text('23');
            expect($(tds[2])).to.have.text('');
        });

        it('renders the third row with the correct data', function() {
            var thirdRow = $('#table tr')[3];
            var tds = $(thirdRow).find('td');

            expect($(tds[0])).to.have.text('');
            expect($(tds[1])).to.have.text('28');
            expect($(tds[2])).to.have.text('Developer');
        });
    });
});
