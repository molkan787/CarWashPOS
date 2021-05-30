import ModalDialog from './ModalDialog';

export default class MessageResponse{
    _prevent: boolean = false;
    _loading: boolean = false;

    reset(){
        this._prevent = false;
        this._loading = false;
    }

    public answer!: boolean;
    public dialog!: ModalDialog;

    public prevent(){
        this._prevent = true;
    }
    public loading(){
        this._prevent = true;
        this._loading = true;
    }

    public hide(){

    }

}