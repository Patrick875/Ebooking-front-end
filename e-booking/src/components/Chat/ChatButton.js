// ChatButton.js
import React, { useState } from 'react'
import { RiMailLine, RiCloseLine } from 'react-icons/ri'
import { motion } from 'framer-motion'
import './ChatButton.css'
import Chat from './Chat'

// Chat component

const ChatButton = () => {
  const [showChatBox, setShowChatBox] = useState(false)

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox)
  }

  return (
    <div className="chat-button-wrapper">
      <motion.button
        className="chat-button"
        onClick={toggleChatBox}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {showChatBox ? <RiCloseLine /> : <RiMailLine />}
      </motion.button>
      {showChatBox && (
        <motion.div
          className="chat-box d-flex flex-column"
          style={{ background: 'linear-gradient(45deg,#cc2b5e, #753a88)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Chat />
          <div
            className="chat-box-close"
            onClick={toggleChatBox}
            title="Close Chat"
          >
            <RiCloseLine />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChatButton
