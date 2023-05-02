import React, { useState } from 'react'

const Pagination = ({ data, RenderComponent, pageLimit, dataLimit }) => {
  const [pages] = useState(Math.ceil(data.length / dataLimit))
  const [currentPage, setCurrentPage] = useState(1)

  const goToNextPage = () => {
    setCurrentPage((page) => page + 1)
  }

  const goToPreviousPage = () => {
    setCurrentPage((page) => page - 1)
  }

  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent)
    setCurrentPage(pageNumber)
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit
    const endIndex = startIndex + dataLimit
    return data.slice(startIndex, endIndex)
  }

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit
    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1)
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const isLoggedInRender = () => {
    if (isLoggedIn) {
      return (
        <>
          <button onClick={handleLogout}>Logout</button>
          <RenderComponent data={getPaginatedData()} />
        </>
      )
    } else {
      return (
        <>
          <button onClick={handleLogin}>Login</button>
        </>
      )
    }
  }

  return (
    <>
      {isLoggedInRender()}
      <div className="pagination">
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
        >
          prev
        </button>

        {getPaginationGroup().map((item, index) => (
          <button
            key={index}
            onClick={changePage}
            className={`paginationItem ${
              currentPage === item ? 'active' : null
            }`}
          >
            <span>{item}</span>
          </button>
        ))}

        <button
          onClick={goToNextPage}
          className={`next ${currentPage === pages ? 'disabled' : ''}`}
        >
          next
        </button>
      </div>
    </>
  )
}

export default Pagination




import React from 'react';
import Pagination from './Pagination';

const ExampleComponent = () => {
  const data = [...]; // your data goes here
  const RenderComponent = ({ data }) => {
    return (
      <div>
        {data.map((item) => (
          <p key={item.id}>{item.text}</p>
        ))}
      </div>
    );
  };
  return (
    <div>
      <Pagination data={data} RenderComponent={RenderComponent} pageLimit={5} dataLimit={10} />
    </div>
  );
};

export default
