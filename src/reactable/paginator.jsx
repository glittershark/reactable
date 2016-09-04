import React from 'react';

function pageHref(num) {
    return `#page-${num + 1}`
}

export class Paginator extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.rowOptions) {
            this.rowOptions = this.props.rowOptions.split(',').map(option => {
                if (option === 'all') return 'all';
                return parseInt(option, 10);
            });
        }
    }

    handlePrevious(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage - 1)
    }

    handleNext(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage + 1);
    }

    handlePageButton(page, e) {
        e.preventDefault();
        this.props.onPageChange(page);
    }

    renderPrevious() {
        if(this.props.currentPage > 0) {
            return <a className='reactable-previous-page'
                      href={pageHref(this.props.currentPage - 1)}
                      onClick={this.handlePrevious.bind(this)}>
                        {this.props.previousPageLabel || 'Previous'}
                   </a>
        }
    }

    renderNext() {
        if(this.props.currentPage < this.props.numPages - 1) {
            return <a className='reactable-next-page'
                      href={pageHref(this.props.currentPage + 1)}
                      onClick={this.handleNext.bind(this)}>
                      {this.props.nextPageLabel || 'Next'}
                   </a>
        }
    }

    renderPageButton(className, pageNum) {

        return <a className={className}
                  key={pageNum}
                  href={pageHref(pageNum)}
                  onClick={this.handlePageButton.bind(this, pageNum)}>
                  {pageNum + 1}
              </a>
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

        let pageButtons = [];
        let pageButtonLimit = this.props.pageButtonLimit;
        let currentPage = this.props.currentPage;
        let numPages = this.props.numPages;
        let lowerHalf = Math.round( pageButtonLimit / 2 );
        let upperHalf = (pageButtonLimit - lowerHalf);

        for (let i = 0; i < this.props.numPages; i++) {
            let showPageButton = false;
            let pageNum = i;
            let className = "reactable-page-button";
            if (currentPage === i) {
                className += " reactable-current-page";
            }
            pageButtons.push( this.renderPageButton(className, pageNum));
        }

        if(currentPage - pageButtonLimit + lowerHalf > 0) {
            if(currentPage > numPages - lowerHalf) {
                pageButtons.splice(0, numPages - pageButtonLimit)
            } else {
                pageButtons.splice(0, currentPage - pageButtonLimit + lowerHalf);
            }
        }

        if((numPages - currentPage) > upperHalf) {
            pageButtons.splice(pageButtonLimit, pageButtons.length - pageButtonLimit);
        }

        return (
            <tbody className="reactable-pagination">
                <tr>
                    <td colSpan={this.props.colSpan}>
                        {this.rowOptions ?
                            <span className="row-selector">
                                <RowSelector
                                    options={this.rowOptions}
                                    selected={this.props.itemsPerPage}
                                    onItemsPerPageChange={this.props.onItemsPerPageChange} />
                                rows per page.
                            </span>
                            : null}
                        {numPages > 1 ?
                            <span className="pagination-buttons">
                                {this.renderPrevious()}
                                {pageButtons}
                                {this.renderNext()}
                            </span>
                            : null}
                    </td>
                </tr>
            </tbody>
        );
    }
};

function RowSelector(props) {
    let options = props.options.map((opt, i) => {
        if (opt === 'all') return <option key={i} value={Number.MAX_SAFE_INTEGER} selected={isSelected}>all</option>;
        let isSelected = opt === props.selected;
        return <option key={i} value={opt} selected={isSelected}>{opt}</option>;
    });

    return (
        <select onChange={e => props.onItemsPerPageChange(parseInt(e.target.value, 10))} >
            {options}
        </select>
    );
}
