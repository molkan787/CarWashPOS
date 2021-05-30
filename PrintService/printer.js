const escpos = require('escpos');
const device  = new escpos.USB();
const options = { encoding: "GB18030" };
const printer = new escpos.Printer(device, options);

let ready = false;
device.open(function(){
    ready = true;
});

module.exports = class Printer{

    static print(string){
        if(!ready) return;

        const lines = string.split("\n");
        printer
        .font('a')
        .align('ct')
        .style('bu')
        .size(1, 1);

        for (let i = 0; i < lines.length; i++) {
            printer.text(lines[i]);
        }
        
        printer.cut();
        
    }

    static openCashDrawer(){
        printer.cashdraw(27);
    }

}