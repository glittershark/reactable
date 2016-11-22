import React from 'react';

function pageHref(num) {
    return `#page-${num + 1}`
}

export class Paginator extends React.Component {
    handleFirst(e) {
        e.preventDefault()
        this.props.onPageChange(1);
    }

    handlePrevious(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage - 1)
    }

    handleNext(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.currentPage + 1);
    }

    handleLast(e) {
        e.preventDefault()
        this.props.onPageChange(this.props.numPages - 1);
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

    renderEllipsis(className) {

        return <span className={className}> ... </span>
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
        let lastPage = numPages - 1;
        // total number of visible buttons
        // 2 * limit + 2 * Ellipsis + 1 currentPage + 2 First/Last
        let buttonsNumber = 2 * pageButtonLimit + 2 + 1 + 2;

        for (let i = 0; i < this.props.numPages; i++) {
            let showPageButton = false;
            let className = "reactable-page-button";
            if (currentPage === i) {
                className += " reactable-current-page";
            }

            // always render first and last page button
            if ( i == 0 || i == lastPage ) {
                pageButtons.push( this.renderPageButton(className, i));
                continue;
            }

            // always render number of buttons around active
            if ( i >= (currentPage - pageButtonLimit) && i <= (currentPage + pageButtonLimit) ) {
                pageButtons.push( this.renderPageButton(className, i));
                continue;
            }

            // complicated stuff :)
            // just keeps equal number of visible buttons for every possible case
            // 4 = first + last + 1 ellipsis + currentPage
            // 2 = first/last + ellipsis
            if (this.props.keepButtonsNumber) {
                if ( currentPage < buttonsNumber - 4 && i < buttonsNumber - 2
                  || currentPage > lastPage - (buttonsNumber - 4) && i > (lastPage - (buttonsNumber - 2)) ) {
                    pageButtons.push( this.renderPageButton(className, i));
                    continue;
                }
            }

            // at this point render ellipsis instead of second button 
            // and button second from the end
            if ( i == 1 || i == (lastPage - 1) ) {
                pageButtons.push( this.renderEllipsis(className) );
                continue;
            }
        }

        return (
            <tbody className="reactable-pagination">
                <tr>
                    <td colSpan={this.props.colSpan}>
                      {this.renderPrevious()}
                      {pageButtons}
                      {this.renderNext()}
                    </td>
                </tr>
            </tbody>
        );
    }
};

