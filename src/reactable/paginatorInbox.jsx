import React from 'react';

function pageHref(num) {
    return `#page-${num + 1}`
}

export class PaginatorInbox extends React.Component {
    handlePrevious(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage - 1)
    }

    handleNext(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage + 1);
    }

    renderPrevious() {
        return <a className={`reactable-previous-page ${this.props.currentPage === 0 ? "disabled" : null}`}
                  href={pageHref(this.props.currentPage - 1)}
                  onClick={this.handlePrevious.bind(this)}>
               </a>
    }

    renderNext() {
        return <a className={`reactable-next-page ${this.props.currentPage + 1 === this.props.numPages ? "disabled" : null}`}
                  href={pageHref(this.props.currentPage + 1)}
                  onClick={this.handleNext.bind(this)}>
               </a>
    }

	calcRange() {
		const {currentPage, itemsNumber, itemsPerPage} = this.props
		const fromVal = currentPage * itemsPerPage + 1
		const toValTmp = ((currentPage + 1) * itemsPerPage)
		const toVal = toValTmp < itemsNumber ? toValTmp : itemsNumber
		return `${fromVal} - ${toVal}`
	}

	renderCounter() {
		const {itemsNumber} = this.props
		return <div className="counter">
			<span>{this.calcRange()}</span>
			<span> van </span>
			<span>{itemsNumber}</span>
		</div>
	}

    render() {
        if (typeof this.props.colSpan === 'undefined') {
            throw new TypeError('Must pass a colSpan argument to Paginator');
        }

        if (typeof this.props.numPages === 'undefined') {
            throw new TypeError('Must pass a non-zero numPages argument to Paginator');
        }

        if (typeof this.props.currentPage === 'undefined') {
            throw new TypeError('Must pass a currentPage argument to Paginator');
        }
        return (
			<div className="pagesSwitcher">
				{this.renderCounter()}
				<div className="pageBtns">
					{this.renderPrevious()}
					{this.renderNext()}
				</div>
			</div>
        );
    }
};
