export default (axios, uriRoot) => {

  const headers = {
  };

  async function get(url, config) {
    addHeaders(config);
    return await axios.get(`${uriRoot}${url}`, config)
  }

  async function post(url, data, config) {
    addHeaders(config);
    return await axios.post(`${uriRoot}${url}`, data, config)
  }

  function addHeaders(config = {}){
    config.headers = config.headers || {};
    config.headers['Access-Control-Allow-Origin'] =  uriRoot;
    config.headers['Content-Type'] = 'application/json';
  }

  return {
    get,
    post
  }

};
