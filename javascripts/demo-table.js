$(function() {
  var demo_table = $('#demo-table');
  if (demo_table.length > 0) {
    React.renderComponent(
      Reactable.Table({
        data: data,
        itemsPerPage: 5,
        sortable: ['datetime', 'city', 'state', 'shape', 'duration', 'summary']
      }),
      demo_table[0]
    );
  }
});

