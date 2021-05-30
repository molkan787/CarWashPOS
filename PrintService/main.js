const ipc = require('node-ipc');
const config = require('./config');
const printer = require('./printer');

ipc.config.id = config.ipcId;
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => {
    console.log('IPC Server started!');
    
    ipc.server.on('print', data => {
        console.log('Printing...');
        printer.print(data);
    });

    ipc.server.on('cashdrawer', data => {
        console.log('Opening cash drawer...');
        printer.openCashDrawer();
    });

});

ipc.server.start();