import config from '@/config';
// const ApiBase = 'https://apos-demo-backend.herokuapp.com';
const ApiBase = 'http://159.203.4.193';
let ApiBaseURI = '';
let ApiBaseURIDemo = '';
if (config.devMode) {
  ApiBaseURI = 'http://localhost:8081/';
  ApiBaseURIDemo = 'http://localhost:8081/';
}else{
  ApiBaseURI = ApiBase + '/';
  ApiBaseURIDemo = ApiBase + ':81/';
  
}

function _url(path: string) {
  if (config.demoMode) {
    return ApiBaseURIDemo + path;
  } else {
    return ApiBaseURI + path;
  }
}

export default _url;

// @ts-ignore
window._url = _url;
