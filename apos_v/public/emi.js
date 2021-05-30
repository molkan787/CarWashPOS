if(typeof require == 'undefined'){
    window.require = () => null;
}

const electron = require("electron");

if(electron){
    global.app = electron.remote.app;
    global.imp = function (module){
        return electron.remote.require(module)
    }
    global.req = function (module){
        return require(module);
    }
}else{
    window.app = {};
    window.imp = function (module){
        return {}
    }
    window.req = function (module){
        return {}
    }
}