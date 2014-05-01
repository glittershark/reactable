---
layout: default
title: Reactable
demo_table: true
---

Fast, flexible, and simple data tables in React.

This is a work in progress. Much of the API defined in this readme won't work
yet. If you like the look of this, feel free to star or watch the repository. If
you're ambitious or feel like getting your hands dirty, I welcome pull requests!
I promise I won't bite.

## Installation

**Using Bower:**

```
bower install [--save] reactable
```

Or, you can just download the raw file
[here](https://github.com/glittershark/reactable/raw/master/build/reactable.js).

## Usage

The simplest example:

```javascript
var Table = Reactable.Table;
React.renderComponent(
    <Table className="table" data={[
        { Name: 'Griffin Smith', Age: '18' },
        { Age: '23',  Name: 'Lee Salminen' },
        { Age: '28', Position: 'Developer' },
    ]} />,
    document.getElementById('table')
);
```

While pretty basic, this example demonstrates a couple things:
- Columns in the data array can be in any order, and you can omit any you like
- Regular React DOM attributes such as className will pass-through to the
  rendered `<table>`

### Further Customization

You can also manually build up your rows using `Reactable.Tr` nested in a table,
also using the `data` prop, but this time containing only one javascript object.
This approach can be freely combined with the `data` property on the `<Table>`,
and is useful if you want to specify per-row attributes such as classes, like so:

```javascript
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
    document.getElementById('table');
)
```

### Pagination

You can also use pagination, by just specifying an `itemsPerPage` argument to the
`<Table>` component. For example:

```javascript
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

You can specify which columns will sort by click by specifing the `sortable` argument
to the `<Table>` component.  This is an array of column names or column objects.

You can specify a custom sort function by defining a column object with structure:

```javascript

{column: 'Column Name', sortFunction: function(a, b){} }
```

You can also specify a default sort by passing in either a column name by itself, or an object
with a column and a `direction` paramenter of either `asc` or `desc`.
If no direction is specified, the default sort will be ascending.  Example:

```javascript

{column: 'Column Name', direction: 'asc' }
```

Combined example:

```javascript
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
