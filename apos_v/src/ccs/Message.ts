import MessageResponse from './MessageResponse';

export default class Message{

    private static component: any;

    static info(text: string, title?: string): Promise<MessageResponse>{
        return this.component.show({
            title: title || 'Information',
            text,
            type: 1
        });
    }

    static ask(text: string, title?: string): Promise<MessageResponse>{
        return this.component.show({
            title: title || 'Confirmation',
            text,
            type: 2
        });
    }

    // ---------------------------

    static register(component: any){
        this.component = component;
    }

}