import React from 'react'
import { Link } from 'react-router-dom'

function Pagination({ postsPerPage, totalPosts, paginate }) {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li
            className="page-item"
            key={number}
            onClick={() => paginate(number)}
          >
            <Link className="page-link" to="#">
              {number}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination
