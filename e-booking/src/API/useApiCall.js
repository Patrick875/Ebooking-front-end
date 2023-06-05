import { useState } from 'react'

const useApiCall = (axiosInstance) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const makeApiCall = async (method, url, data = null, config = {}) => {
    try {
      setLoading(true)
      const response = await axiosInstance[method](url, data, config)
      setData(response.data)
      setError(null)
    } catch (error) {
      setData(null)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, data, error, makeApiCall }
}

export default useApiCall
