import React from 'react'
function Button(btnText, classes) {
  return (
    <div>
      <button className={{ ...classes }}> {btnText} </button>
    </div>
  )
}

export default Button
