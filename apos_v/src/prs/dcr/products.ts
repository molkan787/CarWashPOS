export default class Products{
    static mapByCategory(products: any, parsePrice: any){
        const result: any = {};

        for(let i = 0; i < products.length; i++){
            const prt = products[i];
            const catID = prt.category_id;
            if(!result[catID]) result[catID] = [];
            result[catID].push(prt);
            if(parsePrice){
                prt.price = prt.price / 100;
            }
        }

        return result;
    }

    static mapById(products: any, parsePrice: any){
        const result: any = {};

        for(let i = 0; i < products.length; i++){
            const prt = products[i];
            result[prt.id] = prt;
            if(parsePrice){
                prt.price = prt.price / 100;
            }
        }

        return result;
    }
}