/** @jsx React.DOM */
var Table = Reactable.Table,
    Thead = Reactable.Thead,
    Th = Reactable.Th,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

var ReactTestUtils = React.addons.TestUtils;
var expect = chai.expect;

var ReactableTestUtils = {
    resetTestEnvironment:  function() {
        React.unmountComponentAtNode($('body')[0]);
        $('body').empty();
    },
    // Expect the columns of a the data row specified to have the values in the array as their text values
    expectRowText: function(rowIndex, textArray) {
        var row = $($('#table tbody.reactable-data tr')[rowIndex]).find('td');

        expect(row.length).to.equal(textArray.length);

        for (var i = 0; i < row.length; i++) {
            expect($(row[i])).to.have.text(textArray[i]);
        }
    }
};

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

        after(ReactableTestUtils.resetTestEnvironment);

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
            ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
        });

        it('renders the second row with the correct data', function() {
            ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
        });

        it('renders the third row with the correct data', function() {
            ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
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

        after(ReactableTestUtils.resetTestEnvironment);

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
            ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
        });

        it('renders the second row with the correct data', function() {
            ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
        });

        it('renders the third row with the correct data', function() {
            ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
        });
    });

    describe('adding <Td>s to the <Tr>s', function() {
        before(function() {
            window.tr_test = true;
            React.renderComponent(
                <Table className="table" id="table">
                    <Tr>
                        <Td column="Name">Griffin Smith</Td>
                        <Td column="Age">18</Td>
                    </Tr>
                    <Tr>
                        <Td column="Name">Lee Salminen</Td>
                        <Td column="Age">23</Td>
                    </Tr>
                    <Tr>
                        <Td column="Position">Developer</Td>
                        <Td column="Age">28</Td>
                    </Tr>
                </Table>,
                $('body')[0]
            );
            window.tr_test = false;
        });

        after(ReactableTestUtils.resetTestEnvironment);

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
            ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
        });

        it('renders the second row with the correct data', function() {
            ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
        });

        it('renders the third row with the correct data', function() {
            ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
        });
    })

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

            after(ReactableTestUtils.resetTestEnvironment);

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

            it('specifies a class on the currently active page', function() {
                var activePage = $('#table tbody.reactable-pagination a.reactable-page-button.reactable-current-page');
                expect(activePage.length).to.equal(1);
                expect(activePage).to.have.text('1');
            });

            describe('clicking page buttons', function() {
                beforeEach(function() {
                    var page2 = $('#table tbody.reactable-pagination a.reactable-page-button')[1];
                    ReactTestUtils.Simulate.click(page2);
                });

                it('loads the next n rows', function() {
                    var rows = $('#table tbody.reactable-data tr');
                    expect($($(rows[0]).find('td')[0])).to.have.text('Test Person');
                    expect($($(rows[1]).find('td')[0])).to.have.text('Ian Zhang');
                    expect($($(rows[2]).find('td')[0])).to.have.text('Griffin Smith');
                    expect($($(rows[3]).find('td')[0])).to.have.text('Lee Salminen');
                });

                it('puts an active class on the new active page', function() {
                    var activePage = $('#table tbody.reactable-pagination a.reactable-page-button.reactable-current-page');
                    expect(activePage.length).to.equal(1);
                    expect(activePage).to.have.text('2');
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

            after(ReactableTestUtils.resetTestEnvironment);

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

            after(ReactableTestUtils.resetTestEnvironment);

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

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows', function(){
                expect($('#table tbody.reactable-data tr').length).to.equal(9);
            });
        });
    });

    describe('sorting', function(){
        describe('no default sort', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                        { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                        { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                    ]}
                    sortable={[
                        {
                            column: 'Name',
                            sortFunction: function(a, b){
                                // Sort by last name
                                var nameA = a.split(' ');
                                var nameB = b.split(' ');

                                return nameA[1].localeCompare(nameB[1]);
                            }
                        },
                        'Age',
                        'Position'
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows with no sort', function(){
                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
            });

            it('sorts by text in ascending order', function(){
                var positionHeader = $('#table thead tr.reactable-column-header th')[2];
                ReactTestUtils.Simulate.click(positionHeader);

                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

                // Make sure the headers have the right classes
                expect($(positionHeader)).to.have.class('reactable-header-sort-asc');
            });

            it('sorts by text in descending order', function(){
                var positionHeader = $('#table thead tr.reactable-column-header th')[2];
                ReactTestUtils.Simulate.click(positionHeader);

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(positionHeader)).to.have.class('reactable-header-sort-desc');
            });

            it('sorts by last name in ascending order', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-asc');
            });

            it('sorts by last name in descending order', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-desc');
            });
        });

        describe('passing `true` to sortable', function() {
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                        { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                        { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                    ]}
                    sortable={true} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('sorts by the first column in ascending order', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(1, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-asc');
            });

            it('sorts by the first column in descending order', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-desc');
            });

            it('sorts by the second column in ascending order', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[1];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-asc');
            });

            it('sorts by the second column in descending order', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[1];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-desc');
            });


            it('sorts by the third column in ascending order', function(){
                var positionHeader = $('#table thead tr.reactable-column-header th')[2];
                ReactTestUtils.Simulate.click(positionHeader);

                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

                // Make sure the headers have the right classes
                expect($(positionHeader)).to.have.class('reactable-header-sort-asc');
            });

            it('sorts by the third column in descending order', function(){
                var positionHeader = $('#table thead tr.reactable-column-header th')[2];
                ReactTestUtils.Simulate.click(positionHeader);

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(positionHeader)).to.have.class('reactable-header-sort-desc');
            });
        });

        describe('default sort', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                        { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                        { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                    ]}
                    sortable={[
                        {
                            column: 'Name',
                            sortFunction: function(a, b){
                                // Sort by last name
                                var nameA = a.split(' ');
                                var nameB = b.split(' ');

                                return nameA[1].localeCompare(nameB[1]);
                            }
                        },
                        'Age',
                        'Position'
                    ]}
                    defaultSort={{column: 'Age', direction: 'desc'}}/>,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows sorted by default column age descending', function(){
                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);
            });
        });

        describe('default sort no direction specified', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                        { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                        { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                    ]}
                    sortable={[
                        {
                            column: 'Name',
                            sortFunction: function(a, b){
                                // Sort by last name
                                var nameA = a.split(' ');
                                var nameB = b.split(' ');

                                return nameA[1].localeCompare(nameB[1]);
                            }
                        },
                        'Age',
                        'Position'
                    ]}
                    defaultSort={'Age'}/>,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows sorted by default column age ascending', function(){
                ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
            });
        });


        describe('unsortable column', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                        { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                        { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                    ]}
                    sortable={[
                        'Age',
                        'Position'
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('leaves columns unsorted', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
            });
        });

        describe('numeric sort', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Count: '23'},
                        { Count: '18'},
                        { Count: '28'},
                        { Count: '1.23'},
                        { Count: 'a'},
                        { Count: 'z'},
                        { Count: '123'}
                    ]}
                    sortable={[
                        {
                            column:         'Count',
                            sortFunction:   Reactable.Sort.Numeric
                        }
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns numerically', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['1.23']);
                ReactableTestUtils.expectRowText(1, ['18']);
                ReactableTestUtils.expectRowText(2, ['23']);
                ReactableTestUtils.expectRowText(3, ['28']);
                ReactableTestUtils.expectRowText(4, ['123']);
                ReactableTestUtils.expectRowText(5, ['a']);
                ReactableTestUtils.expectRowText(6, ['z']);
            });
        });

        describe('currency sort', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { Price: '1.25'},
                        { Price: '$1.01'},
                        { Price: '1'},
                        { Price: '$10,000'},
                        { Price: '$10,500'},
                        { Price: '$10'},
                        { Price: 'a'},
                        { Price: 'z'},
                        { Price: '$2'},
                        { Price: '$.5'},
                        { Price: '$0.60'},
                        { Price: '.1'},
                    ]}
                    sortable={[
                        {
                            column:         'Price',
                            sortFunction:   Reactable.Sort.Currency
                        }
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns numerically. parsing out currency symbols', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['.1']);
                ReactableTestUtils.expectRowText(1, ['$.5']);
                ReactableTestUtils.expectRowText(2, ['$0.60']);
                ReactableTestUtils.expectRowText(3, ['1']);
                ReactableTestUtils.expectRowText(4, ['$1.01']);
                ReactableTestUtils.expectRowText(5, ['1.25']);
                ReactableTestUtils.expectRowText(6, ['$2']);
                ReactableTestUtils.expectRowText(7, ['$10']);
                ReactableTestUtils.expectRowText(8, ['$10,000']);
                ReactableTestUtils.expectRowText(9, ['$10,500']);
                ReactableTestUtils.expectRowText(10, ['a']);
                ReactableTestUtils.expectRowText(11, ['z']);
            });
        });

        describe('date sort', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { 'Date': '1/1/2014 11:00 AM'},
                        { 'Date': '1/1/2013 11:00 AM'},
                        { 'Date': '1/1/2014 4:30 PM'},
                        { 'Date': '4/3/2013'},
                        { 'Date': 'a'},
                        { 'Date': 'z'},
                    ]}
                    sortable={[
                        {
                            column:         'Date',
                            sortFunction:   Reactable.Sort.Date
                        }
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns by date', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['1/1/2013 11:00 AM']);
                ReactableTestUtils.expectRowText(1, ['4/3/2013']);
                ReactableTestUtils.expectRowText(2, ['1/1/2014 11:00 AM']);
                ReactableTestUtils.expectRowText(3, ['1/1/2014 4:30 PM']);
                ReactableTestUtils.expectRowText(4, ['a']);
                ReactableTestUtils.expectRowText(5, ['z']);
            });
        });

        describe('case insensitive sorting', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        { 'Name': 'Lee Salminen'},
                        { 'Name': 'Griffin Smith'},
                        { 'Name': 'Ian Zhang'},
                        { 'Name': 'lee Salminen'},
                        { 'Name': 'griffin smith'},
                        { 'Name': 'Ian zhang'},
                    ]}
                    sortable={[
                        {
                            column:         'Name',
                            sortFunction:   Reactable.Sort.CaseInsensitive
                        }
                    ]} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns by value - case insensitive', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['Griffin Smith']);
                ReactableTestUtils.expectRowText(1, ['griffin smith']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang']);
                ReactableTestUtils.expectRowText(3, ['Ian zhang']);
                ReactableTestUtils.expectRowText(4, ['Lee Salminen']);
                ReactableTestUtils.expectRowText(5, ['lee Salminen']);
            });
        });
    });

    describe('filtering', function() {
        describe('basic case-insensitive filtering', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        {'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
                        {'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
                        {'State': 'Colorado', 'Description': 'new description that shouldn\'t match filter', 'Tag': 'old'},
                        {'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
                    ]} filterable={['State', 'Tag']} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('filters case insensitive on specified columns', function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                $filter.val('new');
                React.addons.TestUtils.Simulate.keyUp($filter[0]);

                var rows = $('#table tbody.reactable-data tr');
                expect($($(rows[0]).find('td')[0])).to.have.text('New York');
                expect($($(rows[1]).find('td')[0])).to.have.text('New Mexico');
                expect($($(rows[2]).find('td')[0])).to.have.text('Alaska');
            });
        });

        describe('filtering and pagination together', function(){
            before(function() {
                React.renderComponent(
                    <Table className="table" id="table" data={[
                        {'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
                        {'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
                        {'State': 'Colorado', 'Description': 'new description that shouldn\'t match filter', 'Tag': 'old'},
                        {'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
                    ]} filterable={['State', 'Tag']} itemsPerPage={2} />,
                    document.getElementsByTagName('body')[0]
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('updates the pagination links', function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                $filter.val('colorado');
                React.addons.TestUtils.Simulate.keyUp($filter[0]);

                var pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
                expect(pageButtons.length).to.equal(1);
                expect($(pageButtons[0])).to.have.text('1');
            });
        });
    });
});
