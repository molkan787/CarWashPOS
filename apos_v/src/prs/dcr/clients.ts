export default class Clients {

    static prepareData(items: any[]){
        for(let i = 0; i < items.length; i++){
            const item = items[i];
            item.key = item.value = item.id;
            item.text = item.first_name + ' ' + item.last_name;
        }
        return items;
    }

}