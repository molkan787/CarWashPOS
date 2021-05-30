const pay_methods: any = {
    cash: 'Cash',
    prepaid: 'Prepaid Card',
    loyalty: 'Loyalty Card',
    invoice_ari: 'Invoice / Ari',
    card: 'Credit/Debit Card',
    other: 'Other / Free'
}
export default function paym(name: string){
    return pay_methods[name] || '';
}