export default class PredefinedFiltersSchema{

    static get dateRange(){
        return [
            {name: 'date_from', type: 'date', text: 'Date from'},
            {name: 'date_to', type: 'date', text: 'Date to'}
        ]
    }

    static get POLCards(){
        return [
            {name: 'barcode', type: 'text', text: 'Barcode'},
            ...this.dateRange
        ]
    }

    static get clients(){
        return [
            { name: 'phone', type: 'phone', text: 'Phone #' },
            ...this.dateRange,
            { name: 'pol_card', type: 'text', text: 'PP/LOY' },
        ];
    }

    static get orders(){
        return [
            {name: 'id', type: 'text', text: 'Order Id', ph: '# 00', small: true},
            ...this.dateRange,
            {
                name: 'pay_method',
                type: 'dropdown',
                text: 'Payment',
                options: [
                    {value: '', text: 'All'},
                    {value: 'cash', text: 'Cash'},
                    {value: 'prepaid', text: 'Prepaid Card'},
                    {value: 'loyalty', text: 'Loyalty Card'},
                    {value: 'card', text: 'Credit/Debit Card'},
                    {value: 'invoice_ari', text: 'Invoice / Ari'},
                    {value: 'other', text: 'Other / Free'},
                ]
            },
        ];
    }

}