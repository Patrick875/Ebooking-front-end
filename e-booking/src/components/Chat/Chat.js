import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

import './Chat.css' // import the CSS file
import { CFormInput, CFormLabel } from '@coreui/react'
import { RiAttachment2, RiSendPlaneFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'

const Chat = () => {
  const userName = useSelector(
    (state) => state.auth.user.firstName + ' ' + state.auth.user.lastName,
  )
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  useEffect(() => {
    const newSocket = io('http://localhost:4000') // Replace with your socket.io server endpoint
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      // Emit 'newUser' event to server to get online users
      socket.emit('newUser', { userName, socketID: socket.id })

      // Listen for 'newUserResponse' event from server to get online users
      socket.on('newUserResponse', (onlineUsers) => {
        setOnlineUsers(onlineUsers)
        console.log('dfafd', onlineUsers)
      })

      // Listen for incoming messages
      socket.on('message', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage])
      })
    }
  }, [socket])

  const handleInputChange = (e) => {
    setMessageInput(e.target.value)
  }

  const handleUserClick = (user) => {
    // Set the selected user's data in the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        text: `Started chat with ${user.userName}`,
        self: true,
      },
    ])

    // Emit 'newUser' event to server with selected user's data
    socket.emit('newUser', {
      userName: user.userName,
      socketID: user.socketID,
    })
  }

  const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
      const newMessage = {
        id: Date.now(),
        text: messageInput,
        self: true,
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      socket.emit('message', newMessage)
      setMessageInput('')
    }
  }

  const handleNewUserMessage = (newMessage) => {
    // Emit 'message' event to server
    socket.emit('message', { text: newMessage })
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]

    // Check if the selected file is an image
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onloadend = () => {
        // Emit 'image' event to server with image data, filename, and text message
        socket.emit('image', {
          dataUrl: reader.result,
          fileName: file.name,
          text: messageInput, // Add the text message to the image data
        })
      }

      reader.readAsDataURL(file)
    } else {
      // Display an error message or take appropriate action for invalid file type
      console.error('Invalid file type. Please select an image file.')
    }
  }

  return (
    <>
      <div
        className=" col flex-grow-0  align-items-start "
        style={{ background: 'rgba(0,0,0,0.4)' }}
      >
        <p className="fs-4 text-white text-center text-capitalize align-content-center">
          {userName}
        </p>
      </div>

      <div className="mx-2 col  flex-grow-1" style={{ overflowY: 'auto' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.self ? 'self' : 'other'}`}
          >
            {message.text && <span>{message.text}</span>}
            {message.dataUrl && (
              <img
                src={message.dataUrl}
                alt={message.fileName}
                className="chat-image"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mx-2 col flex-grow-0">
        <div className="d-flex gap-1 ">
          <div className="col-8">
            <CFormInput
              size="sm"
              type="text"
              placeholder="message..."
              value={messageInput}
              onChange={handleInputChange}
            />
          </div>
          <div className=" col d-flex">
            <div className="col">
              <CFormLabel htmlFor="fileInput" className="btn-sm btn btn-danger">
                {' '}
                <RiAttachment2 className="text-white " />{' '}
              </CFormLabel>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
                className="col-2"
              />
            </div>
            <div className="col">
              <button
                onClick={handleSendMessage}
                className=" btn btn-sm btn-info"
              >
                <RiSendPlaneFill className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat
