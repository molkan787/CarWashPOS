class BarcodeScanner {

    private static pressed: boolean = false;
    private static chars: any[] = [];

    private static handler: Function;

    static init(){
        window.onkeypress = e => {
            // console.log("Char: " + e.key);
            if (e.charCode >= 48 && e.charCode <= 57) {
                this.chars.push(e.key);
            }
            
            if (this.pressed == false) {
                setTimeout(() => {
                    if (this.chars.length >= 10) {
                        const barcode = this.chars.join("");
                        console.log("Barcode Scanned: " + barcode);
                        if(this.handler)
                        this.handler(barcode);
                    }
                    this.chars = [];
                    this.pressed = false;
                },300);
            }
            
            this.pressed = true;
        }
    }

    static setHandler(handler: Function){
        this.handler = handler;
    }

    static simulate(barcode: string){
        console.log("Barcode Scanned (Simulated): " + barcode);
        this.handler(barcode);
    }

}
export default BarcodeScanner;

// @ts-ignore
window.BarcodeScanner = BarcodeScanner;

document.addEventListener("DOMContentLoaded", () => {
    BarcodeScanner.init();
});