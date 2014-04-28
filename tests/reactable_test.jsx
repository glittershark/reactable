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
                <Table className="table" id="table" data={[
                    { Name: 'Griffin Smith', Age: '18'},
                    { Age: '23', Name: 'Lee Salminen'},
                    { Age: '28', Position: 'Developer'}
                ]} />,
                $('body')[0]
            );
        });

        after(function() {
            React.unmountComponentAtNode($('body')[0]);
            $('body').empty();
        });

        it('renders the table', function() {
            expect($('table#table.table')).to.exist;
        });

        it('renders the column headers in the table', function() {
            var headers = [];
            $('thead th').each(function() {
                headers.push($(this).text());
            });

            expect(headers).to.eql([ 'Name', 'Age', 'Position']);
        });

        it('renders the first row with the correct data', function() {
            var firstRow = $('#table tbody tr')[0];
            var tds = $(firstRow).find('td');

            expect($(tds[0])).to.have.text('Griffin Smith');
            expect($(tds[1])).to.have.text('18');
            expect($(tds[2])).to.have.text('');
        });

        it('renders the second row with the correct data', function() {
            var secondRow = $('#table tbody tr')[1];
            var tds = $(secondRow).find('td');

            expect($(tds[0])).to.have.text('Lee Salminen');
            expect($(tds[1])).to.have.text('23');
            expect($(tds[2])).to.have.text('');
        });

        it('renders the third row with the correct data', function() {
            var thirdRow = $('#table tbody tr')[2];
            var tds = $(thirdRow).find('td');

            expect($(tds[0])).to.have.text('');
            expect($(tds[1])).to.have.text('28');
            expect($(tds[2])).to.have.text('Developer');
        });
    });

    describe('adding <Tr>s to the <Table>', function() {
        before(function() {
            React.renderComponent(
                <Table className="table" id="table">
                    <Tr data={{ Name: 'Griffin Smith', Age: '18'}}/>
                    <Tr data={{ Age: '23', Name: 'Lee Salminen'}}/>
                    <Tr data={{ Age: '28', Position: 'Developer'}}/>
                </Table>,
                $('body')[0]
            );
        });

        after(function() {
            React.unmountComponentAtNode($('body')[0]);
            $('body').empty();
        });

        it('renders the table', function() {
            expect($('table#table.table')).to.exist;
        });

        it('renders the column headers in the table', function() {
            var headers = [];
            $('thead th').each(function() {
                headers.push($(this).text());
            });

            expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
        });

        it('renders the first row with the correct data', function() {
            var firstRow = $('#table tbody tr')[0];
            var tds = $(firstRow).find('td');

            expect($(tds[0])).to.have.text('Griffin Smith');
            expect($(tds[1])).to.have.text('18');
            expect($(tds[2])).to.have.text('');
        });

        it('renders the second row with the correct data', function() {
            var secondRow = $('#table tbody tr')[1];
            var tds = $(secondRow).find('td');

            expect($(tds[0])).to.have.text('Lee Salminen');
            expect($(tds[1])).to.have.text('23');
            expect($(tds[2])).to.have.text('');
        });

        it('renders the third row with the correct data', function() {
            var thirdRow = $('#table tbody tr')[2];
            var tds = $(thirdRow).find('td');

            expect($(tds[0])).to.have.text('');
            expect($(tds[1])).to.have.text('28');
            expect($(tds[2])).to.have.text('Developer');
        });
    });

    describe('pagination', function() {
        describe('specifying itemsPerPage', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} itemsPerPage={4} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
                $('body').empty();
            });

            it('provides buttons for each page', function() {
                var pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
                expect(pageButtons.length).to.equal(3);
                expect($(pageButtons[0])).to.have.text('1')
                expect($(pageButtons[1])).to.have.text('2')
                expect($(pageButtons[2])).to.have.text('3')
            });

            it('displays only the first n rows', function() {
                expect($('#table tbody.reactable-data tr').length).to.equal(4);
            });

            describe('clicking page buttons', function() {
                it('loads the next n rows', function() {
                    var page2 = $('#table tbody.reactable-pagination a.reactable-page-button')[1];
                    ReactTestUtils.Simulate.click(page2);

                    var rows = $('#table tbody.reactable-data tr');
                    expect($($(rows[0]).find('td')[0])).to.have.text('Test Person');
                    expect($($(rows[1]).find('td')[0])).to.have.text('Ian Zhang');
                    expect($($(rows[2]).find('td')[0])).to.have.text('Griffin Smith');
                    expect($($(rows[3]).find('td')[0])).to.have.text('Lee Salminen');
                });

                it('can go back to the original page', function() {
                    var page1 = $('#table tbody.reactable-pagination a.reactable-page-button')[0];
                    ReactTestUtils.Simulate.click(page1);

                    var rows = $('#table tbody.reactable-data tr');
                    expect($($(rows[0]).find('td')[0])).to.have.text('Griffin Smith');
                    expect($($(rows[1]).find('td')[0])).to.have.text('Lee Salminen');
                    expect($($(rows[2]).find('td')[0])).to.have.text('');
                    expect($($(rows[3]).find('td')[0])).to.have.text('Griffin Smith');
                });
            });
        });

        describe('specifying more itemsPerPage than items', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} itemsPerPage={20} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
                $('body').empty();
            });

            it('renders all rows', function(){
                expect($('#table tbody.reactable-data tr').length).to.equal(9);
            });

            it('provides buttons for 1 page', function() {
                var pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
                expect(pageButtons.length).to.equal(1);
                expect($(pageButtons[0])).to.have.text('1')
            });
        });

        describe('not specifying itemsPerPage', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
                $('body').empty();
            });

            it('renders all rows', function(){
                expect($('#table tbody.reactable-data tr').length).to.equal(9);
            });
        });

        describe('specifying 0 itemsPerPage', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} itemsPerPage={0} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                React.unmountComponentAtNode(document.getElementsByTagName('body')[0]);
                $('body').empty();
            });

            it('renders all rows', function(){
                expect($('#table tbody.reactable-data tr').length).to.equal(9);
            });
        });
    });
});
