import React from 'react';
import { BtnPaginator } from './btnPaginator';

function pageHref(num) {
    return `#page-${num + 1}`
}

export class Paginator extends React.Component {
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
        const previousBtn = {
            nl: "Vorige",
            fr: "Précédente",
            en: "Previous",
        }
        const {locale} = this.props
        if(this.props.currentPage > 0) {
            return <a className='reactable-previous-page'
                      href={pageHref(this.props.currentPage - 1)}
                      onClick={this.handlePrevious.bind(this)}>
                      {previousBtn[locale] || previousBtn.en}
                   </a>
        }
    }

    renderNext() {
        const nextBtn = {
            nl: "Volgende",
            fr: "Suivante",
            en: "Next",
        }
        const {locale} = this.props
        if(this.props.currentPage < this.props.numPages - 1) {
            return <a className='reactable-next-page'
                      href={pageHref(this.props.currentPage + 1)}
                      onClick={this.handleNext.bind(this)}>
                      {nextBtn[locale] || nextBtn.en}
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
        const {locale, bottomPaginationElem, onPageChange, itemsNumber, itemsPerPage, bottomPagination, pageButtonLimit, currentPage, numPages} = this.props;
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
                {bottomPagination ?
                    <tr className="reactable-btnPagination">
                        <td colSpan={this.props.colSpan}>
                            <div className="reactable-bottomDesign">
                                <div className="reactable-leftElem">
                                    {bottomPaginationElem.left}
                                </div>
                                <div className="reactable-mainElem">
                                    <BtnPaginator
                                        locale={locale}
                                        itemsPerPage={itemsPerPage}
                                        itemsNumber={itemsNumber}
                                        numPages={numPages}
                                        currentPage={currentPage}
                                        onPageChange={onPageChange}
                                        key="paginator"
                                    />
                                </div>
                                <div className="reactable-rightElem">
                                    {bottomPaginationElem.right}
                                </div>
                            </div>
                        </td>
                    </tr> :
                    <tr>
                        <td colSpan={this.props.colSpan}>
                            {this.renderPrevious()}
                            {pageButtons}
                            {this.renderNext()}
                        </td>
                    </tr>
                }
            </tbody>
        );
    }
};
