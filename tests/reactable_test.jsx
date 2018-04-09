var expect = chai.expect;
import Monitored from "./Monitored.jsx";

var ReactableTestUtils = {
    resetTestEnvironment:  function() {
        ReactDOM.unmountComponentAtNode($('div#test-node')[0]);
        $('div#test-node').remove();
    },

    // Expect the row specified to have the specified class
    expectRowClass: function(rowIndex, className) {
        var row = $($('#table tbody.reactable-data tr')[rowIndex]);
        expect(row).to.have.class(className);
    },

    // Expect the columns of a the data row specified to have the values in the array as their text values
    expectRowText: function(rowIndex, textArray) {
        var row = $($('#table tbody.reactable-data tr')[rowIndex]).find('td');

        expect(row.length).to.equal(textArray.length);

        for (var i = 0; i < row.length; i++) {
            expect($(row[i])).to.have.text(textArray[i]);
        }
    },

    testNode: function() {
        var testNode = $('<div>').attr('id', 'test-node');
        $('body').append(testNode);
        testNode.empty();
        return testNode[0];
    }
};

describe('Reactable', function() {
    describe("with null children", function(){
        before(function () {
            ReactDOM.render(
                <Reactable.Table className="table" id="table">
                    {null}
                    {null}
                    {null}
                </Reactable.Table>,
                ReactableTestUtils.testNode()
            );
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('renders the table', function() {
            expect($('table#table.table')).to.exist;
        });

    });

    describe('directly passing a data array', function() {
        before(function() {
            ReactDOM.render(
                <Reactable.Table className="table" id="table" data={[
                    { Name: 'Griffin Smith', Age: '18'},
                    { Age: '23', Name: 'Lee Salminen'},
                    { Age: '28', Position: 'Developer'},
                    { Name: 'Leonor Hyatt', Position: null}
                ]} />,
                ReactableTestUtils.testNode()
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

        it('handles null values', function() {
            ReactableTestUtils.expectRowText(3, ['Leonor Hyatt', '', '']);
        });
    });

    describe('adding <Tr>s to the <Table>', function() {
        before(function() {
            ReactDOM.render(
                <Reactable.Table className="table" id="table">
                    <Reactable.Tr data={{ Name: 'Griffin Smith', Age: '18'}}/>
                    <Reactable.Tr data={{ Age: '23', Name: 'Lee Salminen'}}/>
                    <Reactable.Tr data={{ Age: '28', Position: 'Developer'}}/>
                </Reactable.Table>,
                ReactableTestUtils.testNode()
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

    describe('adding a custom Component to the <Tr>', function(){
        context("that resolves to a <Td>", function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name">Griffin Smith</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Monitored component={Reactable.Td} column="Name">Lee Salminen</Monitored>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            it('renders the rows with the correct data', function() {
                ReactableTestUtils.expectRowText(0, ['Griffin Smith']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen']);
            });

            after(ReactableTestUtils.resetTestEnvironment);
        });
    });
    describe('adding <Td>s to the <Tr>s', function() {
        context('with only one <Td>', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name">Griffin Smith</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name">Lee Salminen</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name">Ian Zhang</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
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

                expect(headers).to.eql(['Name']);
            });

            it('renders the first row with the correct data', function() {
                ReactableTestUtils.expectRowText(0, ['Griffin Smith']);
            });

            it('renders the second row with the correct data', function() {
                ReactableTestUtils.expectRowText(1, ['Lee Salminen']);
            });

            it('renders the third row with the correct data', function() {
                ReactableTestUtils.expectRowText(2, ['Ian Zhang']);
            });
        });

        context('with multiple <Td>s', function () {
            context('with plain text', function() {
                before(function() {
                    ReactDOM.render(
                        <Reactable.Table className="table" id="table">
                            <Reactable.Tr>
                                <Reactable.Td column="Name">Griffin Smith</Reactable.Td>
                                <Reactable.Td column="Age">18</Reactable.Td>
                            </Reactable.Tr>
                            <Reactable.Tr>
                                <Reactable.Td column="Name">Lee Salminen</Reactable.Td>
                                <Reactable.Td column="Age">23</Reactable.Td>
                            </Reactable.Tr>
                            <Reactable.Tr>
                                <Reactable.Td column="Position">Developer</Reactable.Td>
                                <Reactable.Td column="Age">28</Reactable.Td>
                            </Reactable.Tr>
                        </Reactable.Table>,
                        ReactableTestUtils.testNode()
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
        });

        context('with React.DOM nodes inside', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name"><b>Griffin Smith</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>18</em></Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name"><b>Lee Salminen</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>23</em></Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Position"><b>Developer</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>28</em></Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
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

        context('with null <Td>s', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name"><b>Griffin Smith</b></Reactable.Td>
                            {null}
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name"><b>Lee Salminen</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>23</em></Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Position"><b>Developer</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>28</em></Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
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
                ReactableTestUtils.expectRowText(0, ['Griffin Smith', '', '']);
            });

            it('renders the second row with the correct data', function() {
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
            });

            it('renders the third row with the correct data', function() {
                ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
            });
        });

        context('with null <Tr>s', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name"><b>Griffin Smith</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>18</em></Reactable.Td>
                        </Reactable.Tr>
                        {null}
                        <Reactable.Tr>
                            <Reactable.Td column="Position"><b>Developer</b></Reactable.Td>
                            <Reactable.Td column="Age"><em>28</em></Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
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
                ReactableTestUtils.expectRowText(1, ['', '28', 'Developer']);
            });
        });

        context("when one of the <Th>s is null", function(){
            before(function () {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Thead>
                            <Reactable.Th>Test</Reactable.Th>
                            {null}
                        </Reactable.Thead>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the table', function() {
                expect($('table#table.table')).to.exist;
            });
        });
    });

    describe('Adding a <Tfoot>', function() {
        before(function() {
            ReactDOM.render(
                <Reactable.Table className="table" id="table" sortable={['Name']} filterable={['Name', 'Age']} filterClassName="new-class" >
                    <Reactable.Tr className="rowClass1" data={{ Name: 'Griffin Smith', Age: '18'}}/>
                    <Reactable.Tr className="rowClass2" data={{ Age: '23', Name: 'Lee Salminen'}}/>
                    <Reactable.Tr className="rowClass3" data={{ Age: '28', Position: 'Developer'}}/>

                    <Reactable.Tfoot id="tfoot">
                        <tr><td id="tfoot-stuff">Test</td></tr>
                    </Reactable.Tfoot>
                </Reactable.Table>,
                ReactableTestUtils.testNode()
            );
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('renders the table', function() {
            expect($('#table')).to.exist;
        });

        it('renders the regular data rows', function() {
            ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
            ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
            ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
        });

        it('renders the tfoot', function() {
            expect($('#tfoot')).to.exist;
        });

        it('renders the children of the tfoot', function() {
            expect($('#tfoot-stuff')).to.exist;
        });

        context('when sorting', function() {
            before(function() {
                ReactTestUtils.Simulate.click($('th')[0]);
            });

            it('leaves the tfoot alone', function() {
                expect($('table :last-child')).to.match('tfoot');
            });
        });

        context('when filtering', function() {
            before(function() {
                var $filter = $('.reactable-filter-input');

                $filter.val('griffin');
                ReactTestUtils.Simulate.keyUp($filter[0]);
            });

            it('adds the filterClassName to the filterer', function() {
                expect($('.reactable-filter-input').hasClass('new-class')).to.eq(true)
            });

            it('leaves the tfoot alone', function() {
                expect($('table :last-child')).to.match('tfoot');
            });
        });
    });

    describe('using rowSpan', function() {
        before(function() {
            this.component = ReactDOM.render(
                <Reactable.Table className="table" id="table"
                                 filterable={['Category', 'Position', 'Number', 'Salary']}
                                 sortable={["Salary", "Position", "Number"]}
                                 columns={['Category', 'Position', 'Number', 'Salary']}>
                    <Reactable.Tr>
                        <Reactable.Td column='Category' rowSpan="6">Engineer</Reactable.Td>
                        <Reactable.Td column='Position' rowSpan="3">Software</Reactable.Td>
                        <Reactable.Td column='Number'>1</Reactable.Td>
                        <Reactable.Td column='Salary'>$50,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Number'>3</Reactable.Td>
                        <Reactable.Td column='Salary'>$150,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Number'>2</Reactable.Td>
                        <Reactable.Td column='Salary'>$100,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Position' rowSpan="3">Mechanical</Reactable.Td>
                        <Reactable.Td column='Number'>1</Reactable.Td>
                        <Reactable.Td column='Salary'>$50,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Number'>2</Reactable.Td>
                        <Reactable.Td column='Salary'>$100,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Number'>3</Reactable.Td>
                        <Reactable.Td column='Salary'>$150,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Category'>Other</Reactable.Td>
                        <Reactable.Td column='Position'>Third Job</Reactable.Td>
                        <Reactable.Td column='Number'>1</Reactable.Td>
                        <Reactable.Td column='Salary'>$30,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Category' rowSpan="2">Finance</Reactable.Td>
                        <Reactable.Td column='Position'>Accountant</Reactable.Td>
                        <Reactable.Td column='Number'>2</Reactable.Td>
                        <Reactable.Td column='Salary'>$40,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Position'>Investor</Reactable.Td>
                        <Reactable.Td column='Number'>2</Reactable.Td>
                        <Reactable.Td column='Salary'>$45,000</Reactable.Td>
                    </Reactable.Tr>
                    <Reactable.Tr>
                        <Reactable.Td column='Category'>HR</Reactable.Td>
                        <Reactable.Td column='Position'>Benefits Manager</Reactable.Td>
                        <Reactable.Td column='Number'>3</Reactable.Td>
                        <Reactable.Td column='Salary'>$50,000</Reactable.Td>
                    </Reactable.Tr>
                </Reactable.Table>,
                ReactableTestUtils.testNode()
            );
        });

        after(ReactableTestUtils.resetTestEnvironment);

        describe('filtering with rowSpan props', function() {

            describe("on a cell that has the rowSpan", function(){
                it("should display all the rows the Td spans", function() {
                    this.component.filterBy("Software");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(1, ['3', '$150,000']);
                    ReactableTestUtils.expectRowText(2, ['2', '$100,000']);

                })
            });

            describe("to filter out only the Td with a rowSpan prop", function(){
                it("should transfer the data to the next visible row", function() {
                    this.component.filterBy("$1");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '3', '$150,000']);
                    ReactableTestUtils.expectRowText(1, ['2', '$100,000']);
                    ReactableTestUtils.expectRowText(2, ['Mechanical', '2', '$100,000']);
                    ReactableTestUtils.expectRowText(3, ['3', '$150,000']);
                });
            });

            describe("to filter out an entire rowSpan", function(){
                it("should still display the column with the larger rowSpan", function() {
                    this.component.filterBy("Mech");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Mechanical', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(1, ['2', '$100,000']);
                    ReactableTestUtils.expectRowText(2, ['3', '$150,000']);
                });
            });

            describe("to filter out the Td with a rowSpan prop and a row after the next available row", function(){
                it("should adjust the rowSpan property not to exceed past the original rowSpan definition", function() {

                    // this is the scenario where filtering by "$100,000" should give that row a rowSpan of 1 because $150,000 is also filtered out
                    this.component.filterBy("$100,000");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '2', '$100,000']);
                    ReactableTestUtils.expectRowText(1, ['Mechanical', '2', '$100,000']);
                });
            });

            describe("and filtering out a td with the rowSpan", function(){
                it("should still display the data in the rows not filtered out", function() {
                    this.component.filterBy("3");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '3', '$150,000']);
                    ReactableTestUtils.expectRowText(1, ['Mechanical', '3', '$150,000']);
                })
            });

            describe("and filtering to find the Td without a rowSpan", function(){
                it("should apply the filter", function() {
                    this.component.filterBy("Third Job");
                    ReactableTestUtils.expectRowText(0, ['Other', 'Third Job', '1', '$30,000']);
                })
            });

            describe("multiple times", function() {
                it("should not cause duplicate the Td with the rowSpan", function(){
                    // this test enforces that a different key be used on the Tr when a Td is cloned as it is no longer
                    //       a simple update
                    this.component.filterBy("$");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(1, [                        '3', '$150,000']);
                    ReactableTestUtils.expectRowText(2, [                        '2', '$100,000']);

                    ReactableTestUtils.expectRowText(3, [ 'Mechanical', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(4, [               '2', '$100,000']);
                    ReactableTestUtils.expectRowText(5, [               '3', '$150,000']);

                    this.component.filterBy("$5");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software',   '1', '$50,000']);
                    ReactableTestUtils.expectRowText(1, [            'Mechanical', '1', '$50,000']);

                    this.component.filterBy("$");
                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(1, [                        '3', '$150,000']);
                    ReactableTestUtils.expectRowText(2, [                        '2', '$100,000']);

                    ReactableTestUtils.expectRowText(3, [ 'Mechanical', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(4, [               '2', '$100,000']);
                    ReactableTestUtils.expectRowText(5, [               '3', '$150,000']);
                })
            })
        });
        describe('sorting with rowSpan props', function() {
            describe("on a column that doesn't have a rowSpan", function(){
                it("should sort the column within the smallest rowSpan", function() {
                    // i.e. if a cell has no rowSpan define but is part of a row that has a rowSpan of 2 and a rowSpan of 4,
                    //  the column must sort within a rowSpan of 2, the smallest rowSpan


                    var numberHeader = $('#table thead tr.reactable-column-header th')[2];
                    ReactTestUtils.Simulate.click(numberHeader);

                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(1, [                        '2', '$100,000']);
                    ReactableTestUtils.expectRowText(2, [                        '3', '$150,000']);

                    ReactableTestUtils.expectRowText(3, [ 'Mechanical', '1', '$50,000']);
                    ReactableTestUtils.expectRowText(4, [               '2', '$100,000']);
                    ReactableTestUtils.expectRowText(5, [               '3', '$150,000']);


                    // flip
                    ReactTestUtils.Simulate.click(numberHeader);

                    ReactableTestUtils.expectRowText(0, ['Engineer', 'Software', '3', '$150,000']);
                    ReactableTestUtils.expectRowText(1, [                        '2', '$100,000']);
                    ReactableTestUtils.expectRowText(2, [                        '1', '$50,000']);

                    ReactableTestUtils.expectRowText(3, [ 'Mechanical', '3', '$150,000']);
                    ReactableTestUtils.expectRowText(4, [               '2', '$100,000']);
                    ReactableTestUtils.expectRowText(5, [               '1', '$50,000']);



                });

                it("should move cells with rowSpan=1 (or no rowSpan) and sort them all at the bottom of the table", function() {
                    // i.e. if a cell has no rowSpan define but is part of a row that has a rowSpan of 2 and a rowSpan of 4,
                    //  the column must sort within a rowSpan of 2, the smallest rowSpan

                    var numberHeader = $('#table thead tr.reactable-column-header th')[2];
                    ReactTestUtils.Simulate.click(numberHeader);

                    ReactableTestUtils.expectRowText(6, [ 'Finance', 'Accountant', '2', '$40,000']);
                    ReactableTestUtils.expectRowText(7, [            'Investor', '2',  '$45,000']);
                    ReactableTestUtils.expectRowText(8, [ 'Other', 'Third Job', '1', '$30,000']);
                    ReactableTestUtils.expectRowText(9, [ 'HR', 'Benefits Manager', '3', '$50,000']);

                    // flip
                    ReactTestUtils.Simulate.click(numberHeader);

                    ReactableTestUtils.expectRowText(8, [ 'HR', 'Benefits Manager', '3', '$50,000']);
                    ReactableTestUtils.expectRowText(9, [ 'Other', 'Third Job', '1', '$30,000']);


                })
            });
        });
    });

    describe('using colSpan', function() {
        describe('basic colSpan', function () {
            before(function () {
                ReactDOM.render(
                    React.createElement(Reactable.Table, {className: "table", id: "table"},
                        React.createElement(Reactable.Tr, {data: {Name: 'Griffin Smith', Age: '18'}}),
                        React.createElement(Reactable.Tr, {data: {Age: '23', Name: 'Lee Salminen'}}),
                        React.createElement(Reactable.Tr, {data: {Age: '28', Position: 'Developer'}}),
                        React.createElement(Reactable.Tr, null,
                            React.createElement(Reactable.Td, {
                                column: "Name",
                                colSpan: "3"
                            }, "This summary spans 3 cols")
                        )
                    ),
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the table', function () {
                expect($('table#table.table')).to.exist;
            });

            it('renders the column headers in the table', function () {
                var headers = [];
                $('thead th').each(function () {
                    headers.push($(this).text());
                });

                expect(headers).to.eql(['Name', 'Age', 'Position']);
            });

            it('renders the first row with the correct data', function () {
                ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
            });

            it('renders the second row with the correct data', function () {
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
            });

            it('renders the third row with the correct data', function () {
                ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
            });

            it('renders the fourth row with the correct data', function () {
                ReactableTestUtils.expectRowText(3, ['This summary spans 3 cols']);
            });
        });

        describe('filtering with colSpan', function () {
            before(function () {
                this.component = ReactDOM.render(
                    React.createElement(Reactable.Table, {filterable: ['Name'], className: "table", id: "table"},
                        React.createElement(Reactable.Tr, {data: {Name: 'Griffin Smith', Age: '18'}}),
                        React.createElement(Reactable.Tr, {data: {Age: '23', Name: 'Lee Salminen'}}),
                        React.createElement(Reactable.Tr, {data: {Age: '28', Position: 'Developer'}}),
                        React.createElement(Reactable.Tr, null,
                            React.createElement(Reactable.Td, {
                                column: "Name",
                                colSpan: "3"
                            }, "This summary spans 3 cols")
                        )
                    ),
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            context('select colspan value', function () {
                before(function () {
                    this.component.filterBy('summary');
                });

                it('applies the filtering', function () {
                    ReactableTestUtils.expectRowText(0, ['This summary spans 3 cols']);
                });
            });

            context('select value from other row', function () {
                before(function () {
                    this.component.filterBy('Griffin');
                });

                it('applies the filtering', function () {
                    ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
                });
            });
        });
    });
    describe('passing through HTML props', function() {
        describe('adding <Tr>s with className to the <Table>', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr className="rowClass1" data={{ Name: 'Griffin Smith', Age: '18'}}/>
                        <Reactable.Tr className="rowClass2" data={{ Age: '23', Name: 'Lee Salminen'}}/>
                        <Reactable.Tr className="rowClass3" data={{ Age: '28', Position: 'Developer'}}/>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
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

            it('renders the first row with the correct class name', function() {
                ReactableTestUtils.expectRowClass(0, 'rowClass1');
            });

            it('renders the second row with the correct class name', function() {
                ReactableTestUtils.expectRowClass(1, 'rowClass2');
            });

            it('renders the third row with the correct class name', function() {
                ReactableTestUtils.expectRowClass(2, 'rowClass3');
            });
        });

        describe('adding <Td>s with classNames to the <Table>', function() {
            before(function () {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name" className="name-1">Griffin Smith</Reactable.Td>
                            <Reactable.Td column="Age">18</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name" className="name-2">Lee Salminen</Reactable.Td>
                            <Reactable.Td column="Age">23</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Position" className="position">Developer</Reactable.Td>
                            <Reactable.Td column="Age">28</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the first column with the correct class name', function() {
                expect($('td.name-1')).to.have.text('Griffin Smith');
            });

            it('renders the second column with the correct class name', function() {
                expect($('td.name-2')).to.have.text('Lee Salminen');
            });

            it('renders the third column with the correct class name', function() {
                expect($('td.position')).to.have.text('Developer');
            });
        });
    });

    describe('adding <Td> with style to the <Table>', function() {
        before(function () {
            var tdStyle = {width:"100px"};
            ReactDOM.render(
                <Reactable.Table className="table" id="table">
                    <Reactable.Tr>
                        <Reactable.Td column="Name" className="name-1" style={tdStyle}>Griffin Smith</Reactable.Td>
                        <Reactable.Td column="Age">18</Reactable.Td>
                    </Reactable.Tr>
                </Reactable.Table>,
                ReactableTestUtils.testNode()
            );
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('renders the first column with the width', function() {
            expect($('td.name-1')).to.have.attr('style').match(/width/);
        });
    });

    describe('specifying an array of columns', function() {
        describe('as strings', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { Name: 'Griffin Smith', Age: '18', HideThis: 'one'},
                        { Age: '23', Name: 'Lee Salminen', HideThis: 'two'},
                        { Age: '28', Position: 'Developer'},
                    ]} columns={['Name', 'Age']}/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('omits columns not in the list', function() {
                var columns = $('tr.reactable-column-header th');
                expect(columns.length).to.equal(2);
                expect($(columns[0])).to.have.text('Name');
                expect($(columns[1])).to.have.text('Age');
            });

            it('adds class name for each column base on its label', function() {
                var columns = $('tr.reactable-column-header th');
                expect($(columns[0])).to.have.class('reactable-th-name');
                expect($(columns[1])).to.have.class('reactable-th-age');
            });
        });

        describe('as objects', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { name: 'Griffin Smith', age: '18', HideThis: 'one'},
                        { age: '23', name: 'Lee Salminen', HideThis: 'two'},
                        { age: '28', Position: 'Developer'},
                    ]} columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'age', label: 'Age' }
                    ]}/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('omits columns not in the list', function() {
                var columns = $('tr.reactable-column-header th');
                expect(columns.length).to.equal(2);
            });

            it('allows changing the labels of the columns', function() {
                var columns = $('tr.reactable-column-header th');
                expect($(columns[0])).to.have.text('Name');
                expect($(columns[1])).to.have.text('Age');
            });

            it('adds class name for each column base on its key', function() {
                var columns = $('tr.reactable-column-header th');
                expect($(columns[0])).to.have.class('reactable-th-name');
                expect($(columns[1])).to.have.class('reactable-th-age');
            });
        });
    });

    describe('specifying columns using a <Thead>', function() {
        describe('and an element for the column title', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table id="table" data={[
                        { Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'},
                        { Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')},
                        { Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')},
                    ]}>
                        <Reactable.Thead>
                            <Reactable.Th column="Name" id="my-name">
                                <strong>name</strong>
                            </Reactable.Th>
                        </Reactable.Thead>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders only the columns in the Thead', function() {
                expect($('#table tbody tr:first td')).to.exist;
                expect($('#table thead tr:first th')).to.exist;
            });

            it('renders the contents of the Th', function() {
                expect($('#table>thead>tr>th>strong')).to.exist;
            });

            it('passes through the properties of the Th', function() {
                expect($('#table>thead>tr>th')).to.have.id('my-name')
            });

        });

        describe('and a string for the column title', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table id="table" data={[
                        { Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'},
                        { Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')},
                        { Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')},
                    ]}>
                        <Reactable.Thead>
                            <Reactable.Th column="Name" id="my-name">
                                name
                            </Reactable.Th>
                        </Reactable.Thead>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders only the columns in the Thead', function() {
                expect($('#table tbody tr:first td')).to.exist;
                expect($('#table thead tr:first th')).to.exist;
            });

            it('renders the contents of the Th', function() {
                expect($('#table>thead>tr>th')).to.exist;
            });

            it('passes through the properties of the Th', function() {
                expect($('#table>thead>tr>th')).to.have.id('my-name')
            });

        })
    });

    describe('table headers', function() {
        describe("with hideTableHeader prop on <Table>", function() {
            before(function () {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { Name: 'Griffin Smith', Age: '18'},
                        { Age: '23', Name: 'Lee Salminen'},
                        { Age: '28', Position: 'Developer'},
                        { Name: 'Leonor Hyatt', Position: null}
                    ]} hideTableHeader />,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);


            it('renders the table', function() {
                expect($('table#table.table')).to.exist;
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

            it('does not show a <Thead>', function() {
                expect($('#table thead')).not.to.exist;
            });
        });


    });

    describe('unsafe() strings', function() {
        context('in the <Table> directly', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'},
                        { Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')},
                        { Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')},
                    ]} sortable={['Name']}/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the HTML in the table cells', function() {
                var griffins_name = $('span#griffins-name');
                expect(griffins_name.length).to.equal(1);
                expect(griffins_name).to.have.text('Griffin Smith');

                var lees_name = $('span#lees-name');
                expect(lees_name.length).to.equal(1);
                expect(lees_name).to.have.text('Lee Salminen');

                var who_knows_job = $('span#who-knows-job');
                expect(who_knows_job.length).to.equal(1);
                expect(who_knows_job).to.have.text('Developer');
            });

            it('still allows sorting', function() {
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(nameHeader);

                ReactableTestUtils.expectRowText(0, ['28', 'Developer', '']);
                ReactableTestUtils.expectRowText(1, ['18', '', 'Griffin Smith']);
                ReactableTestUtils.expectRowText(2, ['23', '', 'Lee Salminen']);
            });
        });

        context('in column labels', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { Name: 'Griffin Smith', Age: '18'},
                        { Age: '23', Name: 'Lee Salminen'},
                        { Age: '28', Position: 'Developer'}
                    ]} columns={[
                        { key: 'Name', label: Reactable.unsafe('<strong>Name</strong>') },
                        { key: 'Age', label: Reactable.unsafe('<em>Age</em>') },
                        { key: 'Position', label: Reactable.unsafe('<small>Position</small>') }
                    ]} />,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the HTML in the column headers', function() {
                var headers = [];
                $('thead th').each(function() {
                    headers.push($(this).html());
                });

                expect(headers).to.eql([
                    '<strong>Name</strong>',
                    '<em>Age</em>',
                    '<small>Position</small>'
                ]);
            });
        });

        context('in the <Tr>s', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr data={{ Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'}} />
                        <Reactable.Tr data={{ Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}} />
                        <Reactable.Tr data={{ Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')}} />
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the HTML in the table cells', function() {
                var griffins_name = $('span#griffins-name');
                expect(griffins_name.length).to.equal(1);
                expect(griffins_name).to.have.text('Griffin Smith');

                var lees_name = $('span#lees-name');
                expect(lees_name.length).to.equal(1);
                expect(lees_name).to.have.text('Lee Salminen');

                var who_knows_job = $('span#who-knows-job');
                expect(who_knows_job.length).to.equal(1);
                expect(who_knows_job).to.have.text('Developer');
            });
        });

        context('in the <Td>s', function() {
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name">{Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>')}</Reactable.Td>
                            <Reactable.Td column="Age">18</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name">{Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}</Reactable.Td>
                            <Reactable.Td column="Age">23</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Position">{Reactable.unsafe('<span id="who-knows-job">Developer</span>')}</Reactable.Td>
                            <Reactable.Td column="Age">28</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders the HTML in the table cells', function() {
                var griffins_name = $('span#griffins-name');
                expect(griffins_name.length).to.equal(1);
                expect(griffins_name).to.have.text('Griffin Smith');

                var lees_name = $('span#lees-name');
                expect(lees_name.length).to.equal(1);
                expect(lees_name).to.have.text('Lee Salminen');

                var who_knows_job = $('span#who-knows-job');
                expect(who_knows_job.length).to.equal(1);
                expect(who_knows_job).to.have.text('Developer');
            });
        });
    });

    describe('pagination', function() {
        describe('specifying pageButtonLimit', function(){

            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} itemsPerPage={2} pageButtonLimit={8}/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('shows no more page buttons than the pageButtonLimit', function() {
                var pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
                expect(pageButtons.length).to.equal(8);
            });

        })
        describe('specifying itemsPerPage', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} itemsPerPage={4} previousPageLabel={'<<'} nextPageLabel={'>>'}/>,
                    ReactableTestUtils.testNode()
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

            it('does not show previous button', function(){
                var previousButton = $('#table tbody.reactable-pagination a.reactable-previous-page');
                expect(previousButton.length).to.equal(0);
            });

            it('shows next button', function(){
                var nextButton = $('#table tbody.reactable-pagination a.reactable-next-page');
                expect(nextButton.length).to.equal(1);
                expect(nextButton[0].text).to.equal('>>');
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

                it('shows previous button', function(){
                    var previousButton = $('#table tbody.reactable-pagination a.reactable-previous-page');
                    expect(previousButton.length).to.equal(1);
                    expect(previousButton[0].text).to.equal('<<');
                });
            });
        });

        describe('specifying more itemsPerPage than items', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                    ReactableTestUtils.testNode()
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

            it('does not show previous and next buttons', function(){
                var previousButton = $('#table tbody.reactable-pagination a.reactable-previous-page');
                var nextButton = $('#table tbody.reactable-pagination a.reactable-next-page');
                expect(previousButton.length + nextButton.length).to.equal(0);
            })

        });

        describe('not specifying itemsPerPage', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows', function(){
                expect($('#table tbody.reactable-data tr').length).to.equal(9);
            });
        });

        describe('specifying 0 itemsPerPage', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows', function(){
                expect($('#table tbody.reactable-data tr').length).to.equal(9);
            });
        });

        describe('onPageChange hook', () => {
            let currentPage
            const callback = page => {
                currentPage = page
            }
            before( () => {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18'},
                        {'Age': '23', 'Name': 'Test Person'},
                        {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                        {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                        {'Age': '23', 'Name': 'Lee Salminen'},
                        {'Age': '28', 'Position': 'Developer'},
                    ]} itemsPerPage={4} onPageChange={callback} />,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('emits the number of the currently selected page (zero based) when onPageChange event is triggered', () => {
                const page1 = $('#table tbody.reactable-pagination a.reactable-page-button')[0];
                const page2 = $('#table tbody.reactable-pagination a.reactable-page-button')[1];
                const page3 = $('#table tbody.reactable-pagination a.reactable-page-button')[2];
                ReactTestUtils.Simulate.click(page2);
                expect(currentPage).to.equal(1);
                ReactTestUtils.Simulate.click(page1);
                expect(currentPage).to.equal(0);
                ReactTestUtils.Simulate.click(page3);
                expect(currentPage).to.equal(2);
            });
        });

        describe('updating the currentPage via a prop passed to the table', function() {
            before(function() {

                class ParentComponent extends React.Component {
                    constructor(props) {
                        super(props);
                        this.state = {
                            currentPage: 4
                        }
                    }

                    render () {
                        return (
                            <Reactable.Table className="table" id="table" data={[
                                {'Name': 'Griffin Smith', 'Age': '18'},
                                {'Age': '23', 'Name': 'Lee Salminen'},
                                {'Age': '28', 'Position': 'Developer'},
                                {'Name': 'Griffin Smith', 'Age': '18'},
                                {'Age': '23', 'Name': 'Test Person'},
                                {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                                {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                                {'Age': '23', 'Name': 'Lee Salminen'},
                                {'Age': '28', 'Position': 'Developer'},
                            ]} itemsPerPage={2} currentPage={this.state.currentPage} />
                        );
                    }
                }

                this.component = ReactDOM.render(<ParentComponent/>, ReactableTestUtils.testNode());
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('allows setting the default currentPage', function() {
                let activePage = $('#table tbody.reactable-pagination ' +
                    'a.reactable-page-button.reactable-current-page');
                expect(activePage.length).to.equal(1);
                expect(activePage).to.have.text('5');
            });

            it('allows updating currentPage using props', function() {
                this.component.setState({currentPage: 2})
                let activePage = $('#table tbody.reactable-pagination ' +
                    'a.reactable-page-button.reactable-current-page')
                expect(activePage.length).to.equal(1);
                expect(activePage).to.have.text('3');
            });
        });
    });

    describe('sorting', function(){
        describe('no default sort', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows with no sort', function(){
                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
            });

            it('adds reactable-header-sortable to all headers', function(){
                var header = $('#table thead tr.reactable-column-header th')[0];
                expect($(header)).to.have.class('reactable-header-sortable');

                header = $('#table thead tr.reactable-column-header th')[1];
                expect($(header)).to.have.class('reactable-header-sortable');

                header = $('#table thead tr.reactable-column-header th')[2];
                expect($(header)).to.have.class('reactable-header-sortable');
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

            it('sorts by last name in ascending order by enter keydown', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.keyDown(nameHeader, {keyCode: 13});

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-asc');
            });

            it('does not sort on non-enter keydown', function(){
                var nameHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.keyDown(nameHeader, {keyCode: 10});

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(nameHeader)).to.have.class('reactable-header-sort-asc');
            });
        });

        describe('passing `true` to sortable', function() {
            var component;
            before(function() {
                this.render = () => {
                    ReactDOM.render(
                        <Reactable.Table className="table" id="table" data={[
                            { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                            { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                            { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                        ]}
                                         sortable={true} />,
                        ReactableTestUtils.testNode()
                    );
                };

                this.render();
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

            it('Keeps the same sort after rerendering', function(){
                expect(this.render).to.not.throw(Error);

                ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
            });
        });

        describe('default sort', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows sorted by default column age descending', function(){
                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);
            });
        });

        describe('sorting after updating columns and sortable props', () => {
            let parent;

            before(function () {
                class TestParent extends React.Component {
                    constructor(props) {
                        super(props);
                        this.state = {
                            data: [
                                {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                                {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                                {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                            ],
                            sortable: ['Name', 'Age', 'Position'],
                            defaultSort: 'Position'
                        };
                    }

                    render() {
                        return (
                            <Reactable.Table
                                className="table"
                                id="table"
                                data={this.state.data}
                                sortable={this.state.sortable}
                                defaultSort={this.state.defaultSort}
                            />
                        )
                    }
                }

                parent = ReactDOM.render(<TestParent />, ReactableTestUtils.testNode());
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('sorts on new column after receiving new props', function() {
                const newData = [
                    { Name: 'Lee Salminen', Age: '23', newColumn: 'Programmer'},
                    { Name: 'Griffin Smith', Age: '18', newColumn: 'Engineer'},
                    { Name: 'Ian Zhang', Age: '28', newColumn: 'Developer'}
                ]
                const newSortable = ['Name', 'Age', 'newColumn']
                const newDefaultSort = 'newColumn'
                parent.setState({data: newData, sortable: newSortable, defaultSort: newDefaultSort});
                var positionHeader = $('#table thead tr.reactable-column-header th')[2];
                ReactTestUtils.Simulate.click(positionHeader);

                ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(positionHeader)).to.have.class('reactable-header-sort-asc');
            });
        });

        describe('sort descending by default flag', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                                     defaultSort={{column: 'Age'}}
                                     defaultSortDescending/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('renders all rows sorted by default column age descending', function(){
                ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);
            });

            it('sorts by the age column in ascending order', function(){
                var positionHeader = $('#table thead tr.reactable-column-header th')[1];
                ReactTestUtils.Simulate.click(positionHeader);

                ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
                ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

                // Make sure the headers have the right classes
                expect($(positionHeader)).to.have.class('reactable-header-sort-asc');
            });
        });

        describe('default sort no direction specified', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                    ReactableTestUtils.testNode()
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
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                        { Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                        { Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
                    ]}
                                     sortable={[
                                         'Age',
                                         'Position'
                                     ]} />,
                    ReactableTestUtils.testNode()
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

            it("doesn't give non-sortable headers a role=button", function() {
                var nameHeader = $('#table thead tr.reactable-column-header th:first');
                expect($(nameHeader)).to.not.have.attr('role', 'button');
            })
        });

        [Reactable.Sort.Numeric, Reactable.Sort.NumericInteger].forEach(function(method) {
            describe('numeric sort', function(){
                before(function() {
                    ReactDOM.render(
                        <Reactable.Table className="table" id="table" data={[
                            { Count: '23'},
                            { Count: '18'},
                            { Count: '28'},
                            { Count: '1.23'},
                            { Count: 'a'},
                            { Count: 'z'},
                            { Count: '123'}
                        ]}
                                         columns={[{ key: 'Count', sortable: method }]} />,
                        ReactableTestUtils.testNode()
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
        });

        describe('numeric sort with Tr and Td specified', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table
                        className="table"
                        id="table"
                        columns={[{ key: 'Count', sortable: Reactable.Sort.Numeric }]}>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>23</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>18</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>28</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>1.23</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>a</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>z</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count'>123</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
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

        describe('numeric sort with Tr and Td specified and custom value', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table
                        className="table"
                        id="table"
                        columns={[{ key: 'Count', sortable: Reactable.Sort.Numeric }]}>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value={23}>twenty-three</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value={18}>eighteen</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value={28}>twenty-eight</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value={1.23}>one point two three</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value='a'>a</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value='z'>z</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='Count' value={123}>one hundred twenty-three</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns numerically', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['one point two three']);
                ReactableTestUtils.expectRowText(1, ['eighteen']);
                ReactableTestUtils.expectRowText(2, ['twenty-three']);
                ReactableTestUtils.expectRowText(3, ['twenty-eight']);
                ReactableTestUtils.expectRowText(4, ['one hundred twenty-three']);
                ReactableTestUtils.expectRowText(5, ['a']);
                ReactableTestUtils.expectRowText(6, ['z']);
            });
        });

        describe('currency sort', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
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
                                     columns={[{ key: 'Price', sortable: Reactable.Sort.Currency }]} />,
                    ReactableTestUtils.testNode()
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

        describe('yen sort', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { Price: '1.25'},
                        { Price: '¥1.01'},
                        { Price: '1'},
                        { Price: '¥10,000'},
                        { Price: '¥10,500'},
                        { Price: '¥10'},
                        { Price: 'a'},
                        { Price: 'z'},
                        { Price: '¥2'},
                        { Price: '¥.5'},
                        { Price: '¥0.60'},
                        { Price: '.1'},
                    ]}
                                     columns={[{ key: 'Price', sortable: Reactable.Sort.Currency }]} />,
                    ReactableTestUtils.testNode()
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns numerically. parsing out currency symbols', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['.1']);
                ReactableTestUtils.expectRowText(1, ['¥.5']);
                ReactableTestUtils.expectRowText(2, ['¥0.60']);
                ReactableTestUtils.expectRowText(3, ['1']);
                ReactableTestUtils.expectRowText(4, ['¥1.01']);
                ReactableTestUtils.expectRowText(5, ['1.25']);
                ReactableTestUtils.expectRowText(6, ['¥2']);
                ReactableTestUtils.expectRowText(7, ['¥10']);
                ReactableTestUtils.expectRowText(8, ['¥10,000']);
                ReactableTestUtils.expectRowText(9, ['¥10,500']);
                ReactableTestUtils.expectRowText(10, ['a']);
                ReactableTestUtils.expectRowText(11, ['z']);
            });
        });

        describe('date sort', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { 'Date': '1/1/2014 11:00 AM'},
                        { 'Date': '1/1/2013 11:00 AM'},
                        { 'Date': '1/1/2014 4:30 PM'},
                        { 'Date': '4/3/2013'},
                        { 'Date': 'a'},
                        { 'Date': 'z'},
                    ]}
                                     columns={[{ key: 'Date', sortable: Reactable.Sort.Date }]} />,
                    ReactableTestUtils.testNode()
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
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        { 'Name': 'Lee Salminen'},
                        { 'Name': 'Griffin Smith'},
                        { 'Name': 'Ian Zhang'},
                        { 'Name': 'lee Salminen'},
                        { 'Name': 'griffin smith'},
                        { 'Name': 'Ian zhang'},
                    ]}
                                     columns={[{ key: 'Name', sortable: Reactable.Sort.CaseInsensitive }]} />,
                    ReactableTestUtils.testNode()
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

        describe('custom sort with React Components', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        {'Rank': <span className="3">Third</span>},
                        {'Rank': <span className="1">First</span>},
                        {'Rank': <span className="2">Second</span>},
                    ]}
                                     columns={[{
                                         key: 'Rank', sortable: function (a, b) {
                                             // sort based on classname
                                             return a.props.className.localeCompare(b.props.className);
                                         }
                                     }]} />,
                    ReactableTestUtils.testNode()
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('sorts columns by value', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                ReactableTestUtils.expectRowText(0, ['First']);
                ReactableTestUtils.expectRowText(1, ['Second']);
                ReactableTestUtils.expectRowText(2, ['Third']);
            });
        });

        describe('sorts and calls onSort callback via props', function(){
            var sortColumn = null;

            var callback = function(sortObject){
                sortColumn = sortObject.column;
            }

            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        {'Rank': <span className="3">Third</span>},
                        {'Rank': <span className="1">First</span>},
                        {'Rank': <span className="2">Second</span>},
                    ]}
                                     columns={[{
                                         key: 'Rank', sortable: function (a, b) {
                                             // sort based on classname
                                             return a.props.className.localeCompare(b.props.className);
                                         }
                                     }]}
                                     onSort={ callback }/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(function() {
                ReactableTestUtils.resetTestEnvironment();
            });

            it('returns currentSort object to callback for utilization', function(){
                var sortHeader = $('#table thead tr.reactable-column-header th')[0];
                ReactTestUtils.Simulate.click(sortHeader);

                expect(sortColumn).to.equal('Rank');
            });
        });

    });

    describe('filtering', function() {
        describe('filtering with javascript objects for data', function(){
            var data = [{name:"Lee SomeoneElse", age:18},{name:"Lee Salminen", age:23},{name:"No Age", age:null}]
            var filterBy
            var onFilter = function (filter) {
                filterBy = filter
            }
            before(function () {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table"
                                     filterable={['Name', 'Age']}
                                     onFilter={onFilter}>
                        <Reactable.Tr>
                            <Reactable.Td column="Name" data={data[0].name}/>
                            <Reactable.Td column="Age" data={data[0].age}/>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name" data={data[1].name}/>
                            <Reactable.Td column="Age" data={data[1].age}/>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column="Name" data={data[2].name}/>
                            <Reactable.Td column="Age" data={data[2].age}/>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('filters case insensitive on specified columns', function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                $filter.val('lee');
                ReactTestUtils.Simulate.keyUp($filter[0]);

                ReactableTestUtils.expectRowText(0, ['Lee SomeoneElse', '18']);
                ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23']);
            });
            it('calls onFilter event handler', function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                var textToSearch = 'lee'

                $filter.val(textToSearch);
                ReactTestUtils.Simulate.keyUp($filter[0]);

                expect(filterBy).to.equal(textToSearch);
            });
        });

        describe('basic case-insensitive filtering', function(){
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table className="table" id="table"
                                     filterable={['State', 'Tag']}
                                     filterPlaceholder="Filter Results"
                                     columns={['State', 'Description', 'Tag']}>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New York</Reactable.Td>
                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                            <Reactable.Td column='Tag'>new</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Colorado</Reactable.Td>
                            <Reactable.Td column='Description'>
                                new description that shouldnt match filter
                            </Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Alaska</Reactable.Td>
                            <Reactable.Td column='Description'>bacon</Reactable.Td>
                            <Reactable.Td column='Tag'>renewed</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            context('from the filterer field', function() {
                it('filters case insensitive on specified columns', function() {
                    var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                    $filter.val('new');
                    ReactTestUtils.Simulate.keyUp($filter[0]);

                    ReactableTestUtils.expectRowText(0, ['New York', 'this is some text', 'new']);
                    ReactableTestUtils.expectRowText(1, ['New Mexico', 'lorem ipsum', 'old']);
                    ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'renewed']);
                });

                it('filter placeholder is set', function(){
                    var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                    expect($filter.attr("placeholder")).to.equal('Filter Results');
                })
            });

            context('from the function', function() {
                before(function() {
                    this.component.filterBy('york');
                });

                it('applies the filtering', function() {
                    ReactableTestUtils.expectRowText(0, ['New York', 'this is some text', 'new']);
                });

                it('updates the value of the filterer', function() {
                    var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                    expect($filter).to.have.value('york');
                });
            });

            context('from filterBy prop', function() {
                before(function() {
                    ReactableTestUtils.resetTestEnvironment();

                    class ParentComponent extends React.Component {
                        constructor(props) {
                            super(props);
                            this.state = {
                                customFilterText: 'new'
                            }
                        }

                        handleChange(event) {
                            this.setState({customFilterText: event.target.value});
                        }

                        render() {
                            return (
                                <div>
                                    <input type="text" ref="customFilterInput" id="customFilterInput" value={this.state.customFilterText} onChange={this.handleChange.bind(this)}/>
                                    <Reactable.Table className="table" id="table"
                                                     filterable={['State', 'Tag']}
                                                     filterPlaceholder="Filter Results"
                                                     filterBy={this.state.customFilterText}
                                                     columns={['State', 'Description', 'Tag']}>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>New York</Reactable.Td>
                                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                                            <Reactable.Td column='Tag'>new</Reactable.Td>
                                        </Reactable.Tr>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                                            <Reactable.Td column='Tag'>old</Reactable.Td>
                                        </Reactable.Tr>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>Colorado</Reactable.Td>
                                            <Reactable.Td column='Description'>
                                                new description that shouldnt match filter
                                            </Reactable.Td>
                                            <Reactable.Td column='Tag'>old</Reactable.Td>
                                        </Reactable.Tr>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>Alaska</Reactable.Td>
                                            <Reactable.Td column='Description'>bacon</Reactable.Td>
                                            <Reactable.Td column='Tag'>renewed</Reactable.Td>
                                        </Reactable.Tr>
                                    </Reactable.Table>
                                </div>
                            );
                        }
                    }

                    this.component = ReactDOM.render(<ParentComponent/>, ReactableTestUtils.testNode());
                });

                it('filters case insensitive on specified columns', function() {
                    ReactableTestUtils.expectRowText(0, ['New York', 'this is some text', 'new']);
                    ReactableTestUtils.expectRowText(1, ['New Mexico', 'lorem ipsum', 'old']);
                    ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'renewed']);
                    var $builtInFilter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                    expect($builtInFilter).to.have.value('new');

                    // Simulate changing input on parent component and re-rendering Reactable.Table with new props.
                    var node = this.component.refs.customFilterInput;
                    node.value = 'alaska';
                    ReactTestUtils.Simulate.change(customFilterInput);

                    ReactableTestUtils.expectRowText(0, ['Alaska', 'bacon', 'renewed']);
                    expect($builtInFilter).to.have.value('alaska');
                });
            });
        });

        context('filtering with prop and hiding filter input', function() {
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table className="table" id="table"
                                     filterable={['State', 'Tag']}
                                     filterPlaceholder="Filter Results"
                                     filterBy="new"
                                     hideFilterInput
                                     columns={['State', 'Description', 'Tag']}>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New York</Reactable.Td>
                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                            <Reactable.Td column='Tag'>new</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('does not render the filter input box', function() {
                expect($('#table thead tr.reactable-filterer input.reactable-filter-input').length).to.equal(0);
            });
        });

        context('filtering and pagination together', function(){
            before(function() {
                ReactDOM.render(
                    <Reactable.Table className="table" id="table" data={[
                        {'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
                        {'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
                        {'State': 'Colorado', 'Description': 'new description that shouldn\'t match filter',
                            'Tag': 'old'},
                        {'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
                    ]}
                                     filterable={['State', 'Tag']}
                                     columns={['State', 'Description', 'Tag']}
                                     itemsPerPage={2} />,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            afterEach(function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                $filter.val('');
                ReactTestUtils.Simulate.keyUp($filter[0]);
            });

            it('updates the pagination links', function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                $filter.val('colorado');
                ReactTestUtils.Simulate.keyUp($filter[0]);

                var pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
                expect(pageButtons.length).to.equal(1);
                expect($(pageButtons[0])).to.have.text('1');
            });

            it('updates the current page if necessary', function() {
                var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                var $pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');

                // Go to the last page
                ReactTestUtils.Simulate.click($pageButtons[1])

                // Then filter so that that page doesn't exist anymore
                $filter.val('colorado');
                ReactTestUtils.Simulate.keyUp($filter[0]);

                ReactableTestUtils.expectRowText(0, [
                    'Colorado',
                    "new description that shouldn't match filter",
                    'old'
                ]);
                var activePage = $('#table tbody.reactable-pagination ' +
                    'a.reactable-page-button.reactable-current-page');
                expect(activePage.length).to.equal(1);
                expect(activePage).to.have.text('1');
            });
        });

        context('with custom filter', function() {
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table className="table" id="table"
                                     filterable={[
                                         {
                                             column: 'Tag',
                                             filterFunction: function(contents, filter) {
                                                 // return true if tag contains 'x' and the filter
                                                 return (
                                                     typeof(contents) !== 'undefined' && typeof(filter) !== 'undefined' &&
                                                     contents.indexOf('x') > -1 && contents.indexOf(filter) > -1
                                                 );
                                             },
                                         },
                                         'State'
                                     ]}
                                     filterPlaceholder="Filter Results"
                                     columns={['State', 'Description', 'Tag']}>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New York</Reactable.Td>
                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                            <Reactable.Td column='Tag'>new</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                            <Reactable.Td column='Tag'>old x</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Colorado</Reactable.Td>
                            <Reactable.Td column='Description'>lol</Reactable.Td>
                            <Reactable.Td column='Tag'>renewed x</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Alaska</Reactable.Td>
                            <Reactable.Td column='Description'>bacon</Reactable.Td>
                            <Reactable.Td column='Tag'>new</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            context('from the filterer field', function() {
                it('filters case insensitive on specified columns', function() {
                    var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                    $filter.val('l');
                    ReactTestUtils.Simulate.keyUp($filter[0]);

                    ReactableTestUtils.expectRowText(0, ['New Mexico', 'lorem ipsum', 'old x']);
                    ReactableTestUtils.expectRowText(1, ['Colorado', 'lol', 'renewed x']);
                    ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'new']);
                });

                it('filter placeholder is set', function(){
                    var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                    expect($filter.attr("placeholder")).to.equal('Filter Results');
                })
            });

            context('from the function', function() {
                before(function() {
                    this.component.filterBy('l');
                });

                it('applies the filtering', function() {
                    ReactableTestUtils.expectRowText(0, ['New Mexico', 'lorem ipsum', 'old x']);
                    ReactableTestUtils.expectRowText(1, ['Colorado', 'lol', 'renewed x']);
                    ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'new']);
                });

                it('updates the value of the filterer', function() {
                    var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                    expect($filter).to.have.value('l');
                });
            });

            context('from filterBy prop', function() {
                before(function() {
                    ReactableTestUtils.resetTestEnvironment();

                    class ParentComponent extends React.Component {
                        constructor(props) {
                            super(props);
                            this.state = {customFilterText: 'l'};
                        }

                        handleChange(event) {
                            this.setState({customFilterText: event.target.value});
                        }

                        render() {
                            return (
                                <div>
                                    <input type="text" ref="customFilterInput" id="customFilterInput" value={this.state.customFilterText} onChange={this.handleChange.bind(this)}/>
                                    <Reactable.Table className="table" id="table"
                                                     filterable={[
                                                         {
                                                             column: 'Tag',
                                                             filterFunction: function(contents, filter) {
                                                                 // return true if tag contains 'x' and the filter
                                                                 return (
                                                                     typeof(contents) !== 'undefined' && typeof(filter) !== 'undefined' &&
                                                                     contents.indexOf('x') > -1 && contents.indexOf(filter) > -1
                                                                 );
                                                             },
                                                         },
                                                         'State'
                                                     ]}
                                                     filterPlaceholder="Filter Results"
                                                     filterBy={this.state.customFilterText}
                                                     columns={['State', 'Description', 'Tag']}>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>Alaska</Reactable.Td>
                                            <Reactable.Td column='Description'>bacon</Reactable.Td>
                                            <Reactable.Td column='Tag'>new</Reactable.Td>
                                        </Reactable.Tr>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>New York</Reactable.Td>
                                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                                            <Reactable.Td column='Tag'>new</Reactable.Td>
                                        </Reactable.Tr>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                                            <Reactable.Td column='Tag'>old x</Reactable.Td>
                                        </Reactable.Tr>
                                        <Reactable.Tr>
                                            <Reactable.Td column='State'>Colorado</Reactable.Td>
                                            <Reactable.Td column='Description'>lol</Reactable.Td>
                                            <Reactable.Td column='Tag'>renewed x</Reactable.Td>
                                        </Reactable.Tr>
                                    </Reactable.Table>
                                </div>
                            );
                        }
                    }

                    this.component = ReactDOM.render(<ParentComponent/>, ReactableTestUtils.testNode());
                });

                it('filters using the custom filter on specified columns', function() {
                    ReactableTestUtils.expectRowText(0, ['Alaska', 'bacon', 'new']);
                    ReactableTestUtils.expectRowText(1, ['New Mexico', 'lorem ipsum', 'old x']);
                    ReactableTestUtils.expectRowText(2, ['Colorado', 'lol', 'renewed x']);
                    var $builtInFilter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                    expect($builtInFilter).to.have.value('l');

                    // Simulate changing input on parent component and re-rendering Reactable.Table with new props.
                    var node = this.component.refs.customFilterInput;
                    node.value = 'exico';
                    ReactTestUtils.Simulate.change(customFilterInput);

                    ReactableTestUtils.expectRowText(0, ['New Mexico', 'lorem ipsum', 'old x']);
                    expect($builtInFilter).to.have.value('exico');
                });
            });
        });
    });

    describe('directly passing a data array with non-string data', function() {
        before(function() {
            ReactDOM.render(
                <Reactable.Table className="table" id="table" data={[
                    { Name: 'Griffin Smith', Age: 18},
                    { Age: 23, Name: { toString: function() { return 'Lee Salminen' } } },
                    { Age: 28.45, Position: 'Developer'}
                ]} />,
                ReactableTestUtils.testNode()
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
            ReactableTestUtils.expectRowText(2, ['', '28.45', 'Developer']);
        });
    });

    describe('multiple tables on a page', function() {
        before(function() {
            this.parentTestNode = ReactableTestUtils.testNode();
            this.testNode1 = $('<div>').attr('id', 'test-node-1');
            this.testNode2 = $('<div>').attr('id', 'test-node-2');

            ReactDOM.render(
                <Reactable.Table className="table" id="table1" data={[
                    { Name: 'Griffin Smith', Age: '18'},
                    { Age: '23', Name: 'Lee Salminen'},
                    { Age: '28', Position: 'Developer'}
                ]} />,
                this.testNode1[0]
            );

            ReactDOM.render(
                <Reactable.Table className="table" id="table2" data={[
                    { Moniker: 'Griffin Smith', Elderliness: '18'},
                    { Elderliness: '23', Moniker: 'Lee Salminen'},
                    { Elderliness: '28', Title: 'Developer'}
                ]} />,
                this.testNode2[0]
            );
        });

        after(function() {
            $(this.parentTestNode).empty().remove();
        });

        it('renders the column headers in the first table', function() {
            var headers = [];
            this.testNode1.find('thead th').each(function() {
                headers.push($(this).text());
            });

            expect(headers).to.eql(['Name', 'Age', 'Position']);
        });

        it('renders the column headers in the second table', function() {
            var headers = [];
            this.testNode2.find('thead th').each(function() {
                headers.push($(this).text());
            });

            expect(headers).to.eql(['Moniker', 'Elderliness', 'Title']);
        });
    });

    describe('handleClick callbacks', function(){
        before(function() {
            this.clicked = false

            ReactDOM.render(
                <Reactable.Table className="table" id="table">
                    <Reactable.Tr>
                        <Reactable.Td column="Name" handleClick={function() {
                            this.clicked = true;
                        }.bind(this)}>
                            <b>Griffin Smith</b>
                        </Reactable.Td>
                    </Reactable.Tr>
                </Reactable.Table>,
                ReactableTestUtils.testNode()
            );
            ReactTestUtils.Simulate.click($('td')[0])
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('calls the callbacks on click', function() {
            expect(this.clicked).to.eq(true);
        });
    });

    describe('onContextMenu callbacks on <Td> elements', function(){
        before(function() {
            this.rightClicked = false

            ReactDOM.render(
                <Reactable.Table className="table" id="table">
                    <Reactable.Tr>
                        <Reactable.Td column="Name" onContextMenu={function() {
                            this.rightClicked = true;
                        }.bind(this)}>
                            <b>Griffin Smith</b>
                        </Reactable.Td>
                    </Reactable.Tr>
                </Reactable.Table>,
                ReactableTestUtils.testNode()
            );
            ReactTestUtils.Simulate.contextMenu($('td')[0])
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('calls the callbacks on right click', function() {
            expect(this.rightClicked).to.eq(true);
        });

    });

    describe('table with no data', () => {
        context('when noDataText prop is null', () => {
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table data={[]} columns={['State', 'Description', 'Tag']}></Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('does not render the reactable-no-data element', () => {
                expect($('.reactable-no-data').length).to.eq(0);
            });
        });

        context('when initialized without <Tr>s', () => {
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table className="table" id="table" columns={['State', 'Description', 'Tag']} noDataText="No matching records found."/>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('shows the "no data" message', () => {
                var $text = $('.reactable-no-data').text();
                expect($text).to.eq('No matching records found.');
            });
        });

        context('when filtered without any matches', () => {
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table className="table" id="table"
                                     filterable={['State', 'Tag']}
                                     filterPlaceholder="Filter Results"
                                     filterBy='xxxxx'
                                     noDataText="No matching records found."
                                     columns={['State', 'Description', 'Tag']}>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New York</Reactable.Td>
                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                            <Reactable.Td column='Tag'>new</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Colorado</Reactable.Td>
                            <Reactable.Td column='Description'>
                                new description that shouldnt match filter
                            </Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Alaska</Reactable.Td>
                            <Reactable.Td column='Description'>bacon</Reactable.Td>
                            <Reactable.Td column='Tag'>renewed</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment)

            it('shows the "no data" message', () => {
                var text = $('.reactable-no-data').text();
                expect(text).to.eq('No matching records found.');
            });
        });
        context('when filtered without any matches', () => {
            before(function() {
                let noDataComponent = (columns) => {
                    return <tr><td colSpan={columns.length}>Showing custom NoData component.</td></tr>
                };

                this.component = ReactDOM.render(
                    <Reactable.Table className="table" id="table"
                                     filterable={['State', 'Tag']}
                                     filterPlaceholder="Filter Results"
                                     filterBy='xxxxx'
                                     noDataComponent={noDataComponent}
                                     noDataText="No matching records found."
                                     columns={['State', 'Description', 'Tag']}>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New York</Reactable.Td>
                            <Reactable.Td column='Description'>this is some text</Reactable.Td>
                            <Reactable.Td column='Tag'>new</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>New Mexico</Reactable.Td>
                            <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Colorado</Reactable.Td>
                            <Reactable.Td column='Description'>
                                new description that shouldnt match filter
                            </Reactable.Td>
                            <Reactable.Td column='Tag'>old</Reactable.Td>
                        </Reactable.Tr>
                        <Reactable.Tr>
                            <Reactable.Td column='State'>Alaska</Reactable.Td>
                            <Reactable.Td column='Description'>bacon</Reactable.Td>
                            <Reactable.Td column='Tag'>renewed</Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('shows the "no data" message from the component function', () => {
                var text = $('table > tbody > tr').text();
                expect(text).to.eq('Showing custom NoData component.');
            });
        });
        context('when initialized with an empty array for `data` prop', () => {
            before(function() {
                this.component = ReactDOM.render(
                    <Reactable.Table data={[]} className="table" id="table" columns={['State', 'Description', 'Tag']} noDataText="No matching records found."></Reactable.Table>,
                    ReactableTestUtils.testNode()
                );
            });

            after(ReactableTestUtils.resetTestEnvironment);

            it('shows the "no data" message', () => {
                var $text = $('.reactable-no-data').text();
                expect($text).to.eq('No matching records found.');
            });
        });
    })

    describe('receive props with no currentPage', () => {
        let parent;

        before(function () {
            //create a wrapper component so we can update its state and trigger componentWillReceiveProps in the table
            class TestParent extends React.Component {
                render() {
                    return (<Reactable.Table className="table" id="table" ref="table">
                        <Reactable.Tr>
                            <Reactable.Td column="Name">
                                <b>Griffin Smith</b>
                            </Reactable.Td>
                        </Reactable.Tr>
                    </Reactable.Table>);
                }
            }

            parent = ReactDOM.render(<TestParent/>, ReactableTestUtils.testNode());
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('keeps the same currentPage and does not set it to undefined', function() {
            const preUpdateCurrentPage  = parent.refs.table.state.currentPage;
            parent.setState({testState: "this state update will trigger componentWillReceiveProps in the Reactable.Table"});
            const postUpdateCurrentPage  = parent.refs.table.state.currentPage;
            expect(postUpdateCurrentPage).to.not.eq(undefined);
            expect(postUpdateCurrentPage).to.eq(preUpdateCurrentPage);
        });
    });
});