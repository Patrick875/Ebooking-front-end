import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function ConnectionCheck() {
  const [isOnline, setOnline] = useState(true)

  useEffect(() => {
    // Set the initial online status
    setOnline(navigator.onLine)

    // Add event listeners to update the online status
    window.addEventListener('online', () => {
      toast.promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (navigator.onLine) {
              resolve()
            } else {
              reject()
            }
          }, 2000)
        }),
        {
          loading: 'Connecting...',
          success: 'Connected',
          error: 'Unable to connect',
        },
      )
      setOnline(true)
    })

    window.addEventListener('offline', () => {
      setOnline(false)
    })

    return () => {
      // Remove the event listeners on unmount
      window.removeEventListener('online', () => {})
      window.removeEventListener('offline', () => {})
    }
  }, [])

  return null
}

export default ConnectionCheck
