import React, { useState } from 'react'

const Pagination = ({ totalPosts, paginate, postsPerPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  console.log('pages', totalPages)
  const [currentPage, setCurrentPage] = useState(1)

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber)
    paginate(pageNumber)
    // Call a function or perform an action to update the data based on the selected page number
    // For example: updateData(pageNumber);
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const dots = <span className="dots btn btn-sm btn-white">...</span>

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <span
            key={i}
            className={
              i === currentPage
                ? 'active  btn btn-sm btn-white'
                : 'btn btn-sm btn-white'
            }
            onClick={() => handleClick(i)}
          >
            {i}
          </span>,
        )
      }
    } else {
      const firstPage = (
        <span
          key={1}
          className={1 === currentPage ? 'active  btn btn-sm btn-white' : ''}
          onClick={() => handleClick(1)}
        >
          1
        </span>
      )
      const lastPage = (
        <span
          key={totalPages}
          className={
            totalPages === currentPage
              ? 'active  btn btn-sm btn-white'
              : 'btn btn-sm btn-white'
          }
          onClick={() => handleClick(totalPages)}
        >
          {totalPages}
        </span>
      )

      if (currentPage <= 6) {
        for (let i = 1; i <= 7; i++) {
          pageNumbers.push(
            <span
              key={i}
              className={
                i === currentPage
                  ? 'active  btn btn-sm btn-white'
                  : 'btn btn-sm btn-white'
              }
              onClick={() => handleClick(i)}
            >
              {i}
            </span>,
          )
        }
        pageNumbers.push(dots, lastPage)
      } else if (currentPage > 6 && currentPage < totalPages - 5) {
        pageNumbers.push(firstPage, dots)

        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(
            <span
              key={i}
              className={
                i === currentPage
                  ? 'active  btn btn-sm btn-white'
                  : 'btn btn-sm btn-white'
              }
              onClick={() => handleClick(i)}
            >
              {i}
            </span>,
          )
        }

        pageNumbers.push(dots, lastPage)
      } else {
        pageNumbers.push(firstPage, dots)

        for (let i = totalPages - 6; i <= totalPages; i++) {
          pageNumbers.push(
            <span
              key={i}
              className={
                i === currentPage
                  ? 'active  btn btn-sm btn-white'
                  : '  btn btn-sm btn-white'
              }
              onClick={() => handleClick(i)}
            >
              {i}
            </span>,
          )
        }
      }
    }

    return pageNumbers
  }

  return (
    <div className="col d-flex justify-content-center">
      <div className="d-flex gap-2">{renderPageNumbers()}</div>
    </div>
  )
}

export default Pagination
