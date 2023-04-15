import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          SANTech
        </a>
        <span className="ms-1">&copy; 2023 Olympic Hotel</span>
      </div>
      <div className="ms-auto">
        <span className="me-1"> Created by </span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          SANTech &amp;
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
