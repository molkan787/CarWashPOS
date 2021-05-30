class Printer{

    static device: any;
    static printer: any;

    static setup(){
        // @ts-ignore
        const escpos = imp('escpos');
        const device  = new escpos.USB();
        const options = { encoding: "GB18030" };

        this.device = device;
        this.printer = new escpos.Printer(device, options);

    }

    static print(lines: any){
        // @ts-ignore
        if(window.printToConsole){
            console.clear();
            for(let line of lines){
                const lns = line.text.split("\n");
                for(let ln of lns){
                    console.log('%c' + ln, `font-size:${line.font.x * 12}px;text-align:center;`);
                }
            }
            return;
        }

        const p = this.printer;
        this.device.open(() => {
            p.font('a')
            .align('ct')
            .style('bu');

            for(let line of lines){
                p.size(line.font.x, line.font.y);
                const lns = line.text.split("\n");
                for(let ln of lns){
                    p.text(ln);
                }
            }
            
            p.cut();
            p.close();
        });
        
    }

    static openCashDrawer(){

        this.device.open(() => {
            console.log('Opening Cashdrawer...');
            this.printer.cashdraw(5);
            this.printer.cashdraw(2);
            this.printer.close();
        });

    }

}

// @ts-ignore
window.printer = Printer;
export default Printer;