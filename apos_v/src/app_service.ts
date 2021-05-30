export default class App{

    static quit(){
        console.log('Quiting app...');
        // @ts-ignore
        app.quit();
    }

    static restart(){
        console.log('Restarting app...');
        // @ts-ignore
        // const exec = imp('child_process').exec;
        // @ts-ignore
        app.relaunch();
        // exec(process.execPath);
        // @ts-ignore
        app.quit();
    }

}