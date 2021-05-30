import barcodeScanner from '@/drivers/barcodeScanner';

export default class MxHelper{
    
    private static customValueModal: any;
    private static barcodeHandlers: Function[] = [];

    static getCustomValue(params: any){
        return this.callHandler(this.customValueModal, params);
    }

    public static addBarcodeHandler(handler: Function){
        barcodeScanner.setHandler((barcode: string) => {
            this.callBarcodeHandlers(barcode);
        });
        this.barcodeHandlers.push(handler);
    }

    // -------------------------------------------------------

    private static callBarcodeHandlers(barcode: string){
        for(let i = 0; i < this.barcodeHandlers.length; i++){
            this.barcodeHandlers[i](barcode);
        }
    }

    private static callHandler(component: any, params: any){
        return new Promise((resolve, reject) => {
            component.resolve = resolve;
            component.reject = reject;
            component.handle(params);
        });
    }

    // Components registration
    static registerComponent(name: string, component: any){
        switch (name) {
            case 'CustomValueModal':
                this.customValueModal = component;
                break;
        
            default:
                break;
        }
    }

    static registerFunction(name: string, handler: any){
        if(typeof handler == 'function'){
            // @ts-ignore
            this[name] = handler;
        }else{
            // @ts-ignore
            this[name] = payload => {
                handler.handle(payload);
            };
        }
    }

}
