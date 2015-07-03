export class Paginator {
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

        var pageButtons = [];
        for (var i = 0; i < this.props.numPages; i++) {
            var pageNum = i;
            var className = "reactable-page-button";
            if (this.props.currentPage === i) {
                className += " reactable-current-page";
            }

            pageButtons.push(
                <a className={className} key={i}
                    // create function to get around for-loop closure issue
                    onClick={(function(pageNum) {
                        return function() {
                            this.props.onPageChange(pageNum);
                        }.bind(this);
                    }.bind(this))(i)}>{i + 1}</a>
            );
        }

        return (
            <tbody className="reactable-pagination">
                <tr>
                    <td colSpan={this.props.colSpan}>
                        {pageButtons}
                    </td>
                </tr>
            </tbody>
        );
    }
};

