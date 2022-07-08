import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://khang0.herokuapp.com/',
})
