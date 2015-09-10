(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.paginator = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var Paginator = (function () {
        function Paginator() {
            _classCallCheck(this, Paginator);
        }

        _createClass(Paginator, [{
            key: 'handlePrevious',
            value: function handlePrevious() {
                this.props.onPageChange(this.props.currentPage - 1);
            }
        }, {
            key: 'handleNext',
            value: function handleNext() {
                this.props.onPageChange(this.props.currentPage + 1);
            }
        }, {
            key: 'handlePageButton',
            value: function handlePageButton(page) {
                this.props.onPageChange(page);
            }
        }, {
            key: 'renderPrevious',
            value: function renderPrevious() {
                if (this.props.currentPage > 0) {
                    return React.createElement(
                        'a',
                        { className: 'reactable-previous-page', onClick: this.handlePrevious.bind(this) },
                        'Previous'
                    );
                }
            }
        }, {
            key: 'renderNext',
            value: function renderNext() {
                if (this.props.currentPage < this.props.numPages - 1) {
                    return React.createElement(
                        'a',
                        { className: 'reactable-next-page', onClick: this.handleNext.bind(this) },
                        'Next'
                    );
                }
            }
        }, {
            key: 'renderPageButton',
            value: function renderPageButton(className, pageNum) {
                return React.createElement(
                    'a',
                    { className: className, key: pageNum, onClick: this.handlePageButton.bind(this, pageNum) },
                    pageNum + 1
                );
            }
        }, {
            key: 'render',
            value: function render() {
                if (typeof this.props.colSpan === 'undefined') {
                    throw new TypeError('Must pass a colSpan argument to Paginator');
                }

                if (typeof this.props.numPages === 'undefined') {
                    throw new TypeError('Must pass a non-zero numPages argument to Paginator');
                }

                if (typeof this.props.currentPage === 'undefined') {
                    throw new TypeError('Must pass a currentPage argument to Paginator');
                }

                var pageButtons = [];
                var pageButtonLimit = this.props.pageButtonLimit;
                var currentPage = this.props.currentPage;
                var numPages = this.props.numPages;
                var lowerHalf = Math.round(pageButtonLimit / 2);
                var upperHalf = pageButtonLimit - lowerHalf;

                for (var i = 0; i < this.props.numPages; i++) {
                    var showPageButton = false;
                    var pageNum = i;
                    var className = "reactable-page-button";
                    if (currentPage === i) {
                        className += " reactable-current-page";
                    }
                    pageButtons.push(this.renderPageButton(className, pageNum));
                }

                if (currentPage - pageButtonLimit + lowerHalf > 0) {
                    if (currentPage > numPages - lowerHalf) {
                        pageButtons.splice(0, numPages - pageButtonLimit);
                    } else {
                        pageButtons.splice(0, currentPage - pageButtonLimit + lowerHalf);
                    }
                }

                if (numPages - currentPage > upperHalf) {
                    pageButtons.splice(pageButtonLimit, pageButtons.length - pageButtonLimit);
                }

                return React.createElement(
                    'tbody',
                    { className: 'reactable-pagination' },
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { colSpan: this.props.colSpan },
                            this.renderPrevious(),
                            pageButtons,
                            this.renderNext()
                        )
                    )
                );
            }
        }]);

        return Paginator;
    })();

    exports.Paginator = Paginator;
    ;
});
