Reactable [![Build Status](https://travis-ci.org/glittershark/reactable.svg?branch=master)](https://travis-ci.org/glittershark/reactable)
=========

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
[here](https://github.com/glittershark/reactable/blob/master/build/reactable.js).

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

### Pagination

You can also use pagination, by specifying a `pagination={true}` argument to the
`<Table>` component, and an optional `itemsPerPage` argument, which will default
to 20 if not specified.

Example:

```javascript
...

<Table className="table" data={[
    { Name: 'Griffin Smith', Age: '18' },
    { Age: '23',  Name: 'Lee Salminen' },
    { Age: '28', Position: 'Developer' },
    { Name: 'Griffin Smith', Age: '18' },
    { Age: '30',  Name: 'Test Person' },
    { Name: 'Another Test', Age: '26', Position: 'Developer' },
    { Name: 'Third Test', Age: '19', Position: 'Salesperson' },
    { Age: '23',  Name: 'End of this Page', Position: 'CEO' },
]} pagination={true} itemsPerPage={4} />
```

