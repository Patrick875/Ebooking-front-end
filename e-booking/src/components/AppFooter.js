import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const year = new Date().getFullYear()
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; {year} Olympic Hotel by SANTech</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

//<ChatButton />
// import ChatButton from './Chat/ChatButton'
