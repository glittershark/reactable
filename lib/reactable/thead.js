(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './th', './filterer', './lib/filter_props_from'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./th'), require('./filterer'), require('./lib/filter_props_from'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.th, global.filterer, global.filter_props_from);
        global.thead = mod.exports;
    }
})(this, function (exports, _th, _filterer, _libFilter_props_from) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Thead = (function () {
        function Thead() {
            _classCallCheck(this, Thead);
        }

        _createClass(Thead, [{
            key: 'getColumns',
            value: function getColumns() {
                return React.Children.map(this.props.children, function (th) {
                    if (typeof th.props.children === 'string') {
                        return th.props.children;
                    } else {
                        throw new TypeError('<th> must have a string child');
                    }
                });
            }
        }, {
            key: 'handleClickTh',
            value: function handleClickTh(column) {
                this.props.onSort(column.key);
            }
        }, {
            key: 'render',
            value: function render() {

                // Declare the list of Ths
                var Ths = [];
                for (var index = 0; index < this.props.columns.length; index++) {
                    var column = this.props.columns[index];
                    var thClass = 'reactable-th-' + column.key.replace(/\s+/g, '-').toLowerCase();
                    var sortClass = '';

                    if (this.props.sortableColumns[column.key]) {
                        sortClass += 'reactable-header-sortable ';
                    }

                    if (this.props.sort.column === column.key) {
                        sortClass += 'reactable-header-sort';
                        if (this.props.sort.direction === 1) {
                            sortClass += '-asc';
                        } else {
                            sortClass += '-desc';
                        }
                    }

                    if (sortClass.length > 0) {
                        thClass += ' ' + sortClass;
                    }

                    Ths.push(React.createElement(
                        _th.Th,
                        { className: thClass, key: index, onClick: this.handleClickTh.bind(this, column) },
                        column.label
                    ));
                }

                // Manually transfer props
                var props = (0, _libFilter_props_from.filterPropsFrom)(this.props);

                return React.createElement(
                    'thead',
                    props,
                    this.props.filtering === true ? React.createElement(_filterer.Filterer, {
                        colSpan: this.props.columns.length,
                        onFilter: this.props.onFilter,
                        placeholder: this.props.filterPlaceholder,
                        value: this.props.currentFilter
                    }) : null,
                    React.createElement(
                        'tr',
                        { className: 'reactable-column-header' },
                        Ths
                    )
                );
            }
        }]);

        return Thead;
    })();

    exports.Thead = Thead;
    ;
});
