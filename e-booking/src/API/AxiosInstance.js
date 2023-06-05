// axiosInstance.js
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'
import NetworkError from 'src/views/pages/page404/NetworkError'

//url outside of premisses
//http://206.81.29.111:8080/api/v1

//url on premisses

// http://192.168.122.1:8080/api/v1

//url home
//localhost:4000
// http://localhost:4000/api/v1

const instance = axios.create({
  baseURL: 'http://192.168.122.1:8080/api/v1',
})

let tokenPromise
const errorInterceptor = ({ config, error }) => {
  if (error) {
    return (
      <div>
        <NetworkError />
      </div>
    )
  }

  return config
}

axios.interceptors.request.use(errorInterceptor)
axios.interceptors.response.use(errorInterceptor)

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

function setToken(token) {
  localStorage.setItem('token', token)

  // Wait for the token to be set before resolving the promise
  tokenPromise = new Promise((resolve) => {
    resolve()
  })
}

function getTokenPromise() {
  return tokenPromise
}
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    try {
      if (!navigator.onLine) {
        toast.error('No Internet connection !!!! 🚫🚫🚫')
        return <NetworkError />
      }

      if (
        error.response &&
        (error.response.status === 403 || error.response.status === 401)
      ) {
        // Clear the token and state fields from local storage
        localStorage.removeItem('token')
        localStorage.removeItem('state')
      }
      return <NetworkError />
    } catch (e) {
      console.error('Error in response interceptor:', e)
    }

    return Promise.reject(error)
  },
)

export { instance, setToken, getTokenPromise }
