export default class ModalDialog{
    public open: boolean = false;
    public type: number = 1;
    public text: string = '';
    public ref: string = '';

    private callback: any;

    public show(text: string, type?: number, ref?: string){
        this.text = text;
        this.type = type || 1;
        this.ref = ref || '';
        this.open = true;

        return new Promise((resolve, reject) => {
            this.callback = resolve;
        });
    }

    public answer(answer: string){
        if(this.callback){
            const callback = this.callback;
            this.callback = null;
            callback(answer);
        }
    }
}