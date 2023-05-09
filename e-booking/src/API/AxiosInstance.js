// axiosInstance.js
import axios from 'axios'
import Cookies from 'js-cookie'

//url outside of premisses
//http://206.81.29.111:8080/api/v1

//url on premisses

// http://192.168.122.1:8080/api/v1

const instance = axios.create({
  baseURL: 'http://192.168.122.1:8080/api/v1',
})

let tokenPromise

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log({ request: config })
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

//export { axiosInstance, setToken, getTokenPromise }

// instance.interceptors.request.use(
//   async (config) => {
//     //const accessToken= await axios.get('/')
//     console.log(config)
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (
      (error && error.response && error.response.status === 403) ||
      error.response.status === 401
    ) {
      // Clear the token and state fields from local storage
      localStorage.removeItem('token')
      localStorage.removeItem('state')
    }
    return Promise.reject(error)
  },
)

export { instance, setToken, getTokenPromise }
