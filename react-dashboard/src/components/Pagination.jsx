// This component handles pagination controls (prev/next buttons) for the team list (TeamList)
// It uses conditional disabling for buttons and onClick handlers to change page state

function Pagination({currentPage, totalPages, onPageChange}) {

    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;

    return(
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1 )}
                        disabled={isFirst}
                    >
                        Previous
                    </button>
                </li>
                <li className="page-item disabled">
                    <span className="page-link">Page {currentPage} of {totalPages}</span>
                </li>

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1 )}
                        disabled={isLast}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}
export default Pagination;