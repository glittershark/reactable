import React from 'react';

function pageHref(num) {
    return `#page-${num + 1}`
}

const tr = {
    of: {
        nl: "van",
        fr: "de",
        de: "von",
        en: "of",
    }
}

export class BtnPaginator extends React.Component {
    constructor(props) {
        super(props);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }
    handlePrevious(e) {
        e.preventDefault();
        this.props.onPageChange(this.props.currentPage - 1)
    }

    handleNext(e) {
        e.preventDefault();
        this.props.onPageChange(this.props.currentPage + 1);
    }

    renderPrevious() {
        const {currentPage} = this.props
        const canPage = currentPage > 0
        return <button className={`reactable-previous-page ${canPage ? "" : "disabled"}`}
                  href={pageHref(this.props.currentPage - 1)}
                  onClick={canPage && this.handlePrevious}>
               </button>
    }

    renderNext() {
        const {currentPage, numPages} = this.props
        const canPage = (currentPage + 1) !== numPages
        return <button className={`reactable-next-page ${canPage ? "" : "disabled"}`}
                  href={pageHref(this.props.currentPage + 1)}
                  onClick={canPage && this.handleNext}>
               </button>
    }

	calcRange() {
		const {currentPage, itemsNumber, itemsPerPage} = this.props
		const fromVal = currentPage === -1 ? 0 : currentPage * itemsPerPage + 1
		const toValTmp = ((currentPage + 1) * itemsPerPage)
		const toVal = toValTmp < itemsNumber ? toValTmp : itemsNumber
		return `${fromVal} - ${toVal}`
	}

	renderCounter() {
		const {itemsNumber, locale} = this.props
		return <div className="counter">
			{this.calcRange()} {tr.of[locale]} {itemsNumber}
		</div>
	}

    render() {

        if (typeof this.props.currentPage === 'undefined') {
            throw new TypeError('Must pass a currentPage argument to Paginator');
        }
        return (
			<div className="reactable-pagesSwitcher">
				{this.renderCounter()}
				<div className="reactable-pageBtns">
					{this.renderPrevious()}
					{this.renderNext()}
				</div>
			</div>
        );
    }
};
