"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function pageHref(num) {
    return "#page-" + (num + 1);
}

var tr = {
    of: {
        nl: "van",
        fr: "de",
        de: "von",
        en: "of"
    }
};

var BtnPaginator = (function (_React$Component) {
    _inherits(BtnPaginator, _React$Component);

    function BtnPaginator(props) {
        _classCallCheck(this, BtnPaginator);

        _get(Object.getPrototypeOf(BtnPaginator.prototype), "constructor", this).call(this, props);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    _createClass(BtnPaginator, [{
        key: "handlePrevious",
        value: function handlePrevious(e) {
            e.preventDefault();
            this.props.onPageChange(this.props.currentPage - 1);
        }
    }, {
        key: "handleNext",
        value: function handleNext(e) {
            e.preventDefault();
            this.props.onPageChange(this.props.currentPage + 1);
        }
    }, {
        key: "renderPrevious",
        value: function renderPrevious() {
            return _react2["default"].createElement("button", { className: "reactable-previous-page " + (this.props.currentPage <= 0 ? "disabled" : null),
                href: pageHref(this.props.currentPage - 1),
                onClick: this.handlePrevious });
        }
    }, {
        key: "renderNext",
        value: function renderNext() {
            return _react2["default"].createElement("button", { className: "reactable-next-page " + (this.props.currentPage + 1 === this.props.numPages ? "disabled" : null),
                href: pageHref(this.props.currentPage + 1),
                onClick: this.handleNext });
        }
    }, {
        key: "calcRange",
        value: function calcRange() {
            var _props = this.props;
            var currentPage = _props.currentPage;
            var itemsNumber = _props.itemsNumber;
            var itemsPerPage = _props.itemsPerPage;

            var fromVal = currentPage === -1 ? 0 : currentPage * itemsPerPage + 1;
            var toValTmp = (currentPage + 1) * itemsPerPage;
            var toVal = toValTmp < itemsNumber ? toValTmp : itemsNumber;
            return fromVal + " - " + toVal;
        }
    }, {
        key: "renderCounter",
        value: function renderCounter() {
            var _props2 = this.props;
            var itemsNumber = _props2.itemsNumber;
            var locale = _props2.locale;

            return _react2["default"].createElement(
                "div",
                { className: "counter" },
                this.calcRange(),
                " ",
                tr.of[locale],
                " ",
                itemsNumber
            );
        }
    }, {
        key: "render",
        value: function render() {

            if (typeof this.props.currentPage === 'undefined') {
                throw new TypeError('Must pass a currentPage argument to Paginator');
            }
            return _react2["default"].createElement(
                "div",
                { className: "reactable-pagesSwitcher" },
                this.renderCounter(),
                _react2["default"].createElement(
                    "div",
                    { className: "reactable-pageBtns" },
                    this.renderPrevious(),
                    this.renderNext()
                )
            );
        }
    }]);

    return BtnPaginator;
})(_react2["default"].Component);

exports.BtnPaginator = BtnPaginator;
;
