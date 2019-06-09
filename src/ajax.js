export default (axios, uriRoot) => {

  async function get(url, config) {
    return await axios.get(`${uriRoot}${url}`, config)
  }

  async function post(url, data, config) {
    return await axios.post(`${uriRoot}${url}`, data, config)
  }

  return {
    get,
    post
  }

};
