export default class EFF{

    static openDevTools(){
        // @ts-ignore
        const currentWindow = electron.remote.getCurrentWindow()
        currentWindow.openDevTools()
    }

}