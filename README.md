Reactable [![Build Status](https://travis-ci.org/glittershark/reactable.svg?branch=master)](https://travis-ci.org/glittershark/reactable)
=========

Fast, flexible, and simple data tables in React.

Reactable allows you to display tabular data client-side, and provides sorting,
filtering, and pagination over that data. It uses the power of [React.js][react]
to do all this very, very quickly, and provides an API that makes simple things
easy, while trying to get out of your way as much as possible if you want to do
something complicated or unconventional.

[react]: http://facebook.github.io/react/

This project is currently alpha-stage, which means the API may or may not be
unstable and there might be hidden bugs lurking around any corner. I'll try to
tag any releases with breaking changes, however, and the more people who use
this the faster we can get to 1.0!

**Note:** Version [0.9.8][0.9.8] is the last version that supports React 0.11 -
as of version 0.10.0 Reactable will only continue to support React
0.12 and higher.

[0.9.8]: https://github.com/glittershark/reactable/tree/0.9.8

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Further Customization](#further-customization)
  - [Even More Customization](#even-more-customization)
  - [Manually specifying columns](#manually-specifying-columns)
  - [Preventing escaping of HTML](#preventing-escaping-of-html)
  - [Pagination](#pagination)
  - [Sorting](#sorting)
  - [Filtering](#filtering)


## Installation

**Using Bower:**

```
bower install [--save] reactable
```

Or, you can just download the raw file
[here](https://github.com/glittershark/reactable/raw/master/build/reactable.js).

That file can be used either as an AMD module, as a CommonJS module in Node, or,
if neither are supported, will register the Reactable object as a property of
the `window` object.

Keep in mind that Reactable depends on the latest version of React (0.12),
**with addons**. That can be downloaded [here][download]

[download]: http://facebook.github.io/react/downloads.html

## Usage

The simplest example:

```jsx
var Table = Reactable.Table;
React.renderComponent(
    <Table className="table" data={[
        { Name: 'Griffin Smith', Age: 18 },
        { Age: 23,  Name: 'Lee Salminen' },
        { Age: 28, Position: 'Developer' },
    ]} />,
    document.getElementById('table')
);
```

While pretty basic, this example demonstrates a couple things:
- Columns in the data array can be in any order, and you can omit any you like
- Regular React DOM attributes such as className will pass-through to the
  rendered `<table>`
- Data values can be any type with a `toString()` method

### Further Customization

You can also manually build up your rows using `Reactable.Tr` nested in a table,
also using the `data` prop, but this time containing only one javascript object.
This approach can be freely combined with the `data` property on the `<Table>`,
and is useful if you want to specify per-row attributes such as classes, like so:

```jsx
var Table = Reactable.Table,
    Tr = Reactable.Tr;

React.renderComponent(
    <Table className="table" data={[
        { name: 'Row one', content: 'These are regular data rows' },
        { name: 'Row two', content: 'They work like above' },
    ]} >
        <Tr className="special-row"
            data={{ name: 'Other Row' , content: 'This is a different row' }} />
    </Table>,
    document.getElementById('table')
);
```

### Even More Customization

If you want to customize the rendering of individual columns, you can go a level
deeper by embedding a `Reactable.Td` inside your `Reactable.Tr`. These have the
required `column` property, and an optional `value` property if you want to
customize the data that's used for sorting and filtering - if the latter isn't
specified, the data used will default to the `Td`'s children.

Example:

```jsx
var Table = Reactable.Table,
    Tr = Reactable.Tr,
    Td = Reactable.Td;

React.renderComponent(
    <Table className="table" id="table">
        <Tr>
            <Td column="Name" data="Griffin Smith">
                <b>Griffin Smith</b>
            </Td>
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
    document.getElementById('table')
);
```

### Manually specifying columns

To override the automatic grabbing of the column list from the attributes of the
passed `data` objects, you can pass a `columns` property to the `<Table>`
component. This can be either:

- An array of strings, in which case only the given properties will be included
  as columns in the rendered table.
- An array of objects, each of which must have a `key` and `label` property. The
  `key` property is the attribute of the row object from which to retrieve
  value, and the `label` is the text to render in the column header row.

### Preventing escaping of HTML

If you don't want to go all the way down the JSX rabbit hole to render
individual cells as HTML, and you know your source data is safe, you can wrap
strings in `Reactable.unsafe` to prevent their content from being escaped, like
so:

```jsx
var Table = Reactable.Table,
    unsafe = Reactable.unsafe;

React.renderComponent(
    <Table className="table" id="table" data={[
        {
            'Name': unsafe('<b>Griffin Smith</b>'),
            'Github': unsafe('<a href="https://github.com/glittershark"><img src="https://d2k1ftgv7pobq7.cloudfront.net/images/services/8cab38550d1f23032facde191031d024/github.png"></a>')
        },
        {
            'Name': unsafe('<b>Ian Zhang</b>'),
            'Github': unsafe('<a href="https://github.com/lofiinterstate"><img src="https://d2k1ftgv7pobq7.cloudfront.net/images/services/8cab38550d1f23032facde191031d024/github.png"></a>')
        },
    ]}/>,
    document.getElementById('table')
);
```

You can also pass in `unsafe` strings as column labels or in a `<Reactable.Th>`

### Pagination

You can also use pagination, by just specifying an `itemsPerPage` argument to the
`<Table>` component. For example:

```jsx
<Table className="table" data={[
    { Name: 'Griffin Smith', Age: '18' },
    { Age: '23',  Name: 'Lee Salminen' },
    { Age: '28', Position: 'Developer' },
    { Name: 'Griffin Smith', Age: '18' },
    { Age: '30',  Name: 'Test Person' },
    { Name: 'Another Test', Age: '26', Position: 'Developer' },
    { Name: 'Third Test', Age: '19', Position: 'Salesperson' },
    { Age: '23',  Name: 'End of this Page', Position: 'CEO' },
]} itemsPerPage={4} />
```

### Sorting

To enable sorting on all columns, just specify `sortable={true}` on the
`<Table>` component. For further customization, ie disabling sort or using a
custom sort function on a per-column basis, you can pass an array to `sortable`,
which contains either string column names or column objects.

We've pre-built some sort functions for you.

- `CaseInsensitive` will sort strings alphabetically regardless of
  capitalization (e.g. Joe Smith === joe smith)
- `Date` will sort dates using JavaScript's native Date parser (e.g. 4/20/2014
  12:05 PM)
- `Currency` will sort USD format (e.g. $1,000.00)
- `Numeric` will parse integer-like strings as integers (e.g. "1")
- `NumericInteger` will parse integer strings (use `Numeric` if you might have floats)

To specify a custom sort function, use the following structure for the column
object:

```jsx

{column: 'Column Name', sortFunction: function(a, b){} }
```

You can also specify a default sort by passing in either a column name by
itself, or an object with a column and a `direction` paramenter of either `asc`
or `desc`.  If no direction is specified, the default sort will be ascending.
Example:

```jsx

{column: 'Column Name', direction: 'asc' }
```

Combined example:

```jsx
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
defaultSort={{column: 'Age', direction: 'desc'}}/>
```
### Filtering

You can do simple case-insensitive filtering by specifying a filterable property
on the table.  This property should contain a list of columns which the filter
is performed on.  If the filterable property is provided, then an input box with
class reactable-filter-input will be prepended to the thead of the table.

Example:

```jsx
<Table className="table" id="table" data={[
    {'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
    {'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
    {'State': 'Colorado', 'Description': 'new description that shouldn\'t match filter', 'Tag': 'old'},
    {'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
]} filterable={['State', 'Tag']} />
```

There is also a `filterBy()` function on the component itself which takes a 
single string and applies that as the filtered value. It can be used like so:

```jsx
var table = React.renderComponent(
  <Table className="table" id="table" data={[
      {'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
      {'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
      {'State': 'Colorado', 'Description': 'new description that shouldn\'t match filter', 'Tag': 'old'},
      {'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
  ]} filterable={['State', 'Tag']} />,
  document.getElementById('table')
);

table.filterBy('new');
```

This can be useful if you want to roll your own filtering input field outside of
Reactable.

### Customizing Pagination

The paginationRenderer prop accepts a react component to customize the pagination view.   The component will be passed an array of links in this.props.children.

Example:

```jsx
var ReactableBootstrapPagination = React.createClass({
  render: function() {
    return (
      <nav>
        <ul className="pagination">
          {React.Children.map(this.props.children, function(child, i) {
            var className = child.props.className.indexOf('reactable-current-page') >=0 ? 'active' : '';
            return <li key={i} className={className}>{child}</li>;
          })}
        </ul>
      </nav>
    );
  }
});

return <Table paginationRenderer={ReactableBootstrapPagination} ...
```
