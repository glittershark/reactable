'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Paginator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function pageHref(num) {
    return '#page-' + (num + 1);
}

var Paginator = exports.Paginator = function (_React$Component) {
    _inherits(Paginator, _React$Component);

    function Paginator() {
        _classCallCheck(this, Paginator);

        return _possibleConstructorReturn(this, (Paginator.__proto__ || Object.getPrototypeOf(Paginator)).apply(this, arguments));
    }

    _createClass(Paginator, [{
        key: 'handlePrevious',
        value: function handlePrevious(e) {
            e.preventDefault();
            this.props.onPageChange(this.props.currentPage - 1);
        }
    }, {
        key: 'handleNext',
        value: function handleNext(e) {
            e.preventDefault();
            this.props.onPageChange(this.props.currentPage + 1);
        }
    }, {
        key: 'handlePageButton',
        value: function handlePageButton(page, e) {
            e.preventDefault();
            this.props.onPageChange(page);
        }
    }, {
        key: 'renderPrevious',
        value: function renderPrevious() {
            if (this.props.currentPage > 0) {
                return _react2.default.createElement(
                    'li',
                    { className: 'page-item' },
                    _react2.default.createElement(
                        'a',
                        { className: 'reactable-previous-page page-link',
                            href: pageHref(this.props.currentPage - 1),
                            onClick: this.handlePrevious.bind(this) },
                        this.props.previousPageLabel || 'Previous'
                    )
                );
            }
        }
    }, {
        key: 'renderNext',
        value: function renderNext() {
            if (this.props.currentPage < this.props.numPages - 1) {
                return _react2.default.createElement(
                    'li',
                    { className: 'page-item' },
                    _react2.default.createElement(
                        'a',
                        { className: 'reactable-next-page page-link',
                            href: pageHref(this.props.currentPage + 1),
                            onClick: this.handleNext.bind(this) },
                        this.props.nextPageLabel || 'Next'
                    )
                );
            }
        }
    }, {
        key: 'renderPageButton',
        value: function renderPageButton(className, pageNum) {
            var _className = className + " page-link";
            return _react2.default.createElement(
                'li',
                { key: pageNum, className: 'page-item' },
                _react2.default.createElement(
                    'a',
                    { className: _className,
                        href: pageHref(pageNum),
                        onClick: this.handlePageButton.bind(this, pageNum) },
                    pageNum + 1
                )
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

            return _react2.default.createElement(
                'tbody',
                { className: 'reactable-pagination' },
                _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'td',
                        { colSpan: this.props.colSpan },
                        _react2.default.createElement(
                            'ul',
                            { className: 'pagination' },
                            this.renderPrevious(),
                            pageButtons,
                            this.renderNext()
                        )
                    )
                )
            );
        }
    }]);

    return Paginator;
}(_react2.default.Component);

;
