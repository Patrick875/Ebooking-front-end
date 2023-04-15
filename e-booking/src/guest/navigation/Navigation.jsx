import React from 'react'
import olympicLogo from '../../assets/images/olympic_hotel_logo.png'
// import { BsFillPatchQuestionFill } from 'react-icons/bs'
import './navigation.scss'

function Navigation() {
  return (
    <div className="navigation">
      <div className="logo">
        <a href="/" rel="noreferrer">
          <img src={olympicLogo} alt="" />
        </a>
      </div>
      <div className="menu"></div>
      <div className="call__to__action">
        {/* <BsFillPatchQuestionFill className="helpIcon" />{' '} */}
      </div>
    </div>
  )
}

export default Navigation
