export default class BRI{

    static focus(ref: string){
        const el = document.getElementById('br-input-' + ref);
        if(el){
            el.focus();
        }
    }

}