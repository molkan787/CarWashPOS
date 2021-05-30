import MxHelper from './MxHelper';

export default class PredefinedOrder{

    private static context: any;

    static setup(context: any){
        this.context = context;
    }

    static regularWash(){
        // this.context.dispatch('setItemCountOne', '1');
        this.context.state.pos.pay_method = 'cash';
        // @ts-ignore
        // MxHelper.setPaidAmount('=');
    }

    static prepaidWash(){
        // this.context.dispatch('setItemCountOne', '1');
        this.context.state.pos.pay_method = 'prepaid';
        // @ts-ignore
        // MxHelper.setPaidAmount('=');
    }

}