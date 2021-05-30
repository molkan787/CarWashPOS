let c_ws;
let c_row = 1;
let c_col = 1;
let headStyle;
let headStyle2;
let priceStyle;
let percentStyle;
let centerAlignStyle;
let borderStyle;

module.exports = {

    headStyle() { return headStyle; },
    headStyle2() { return headStyle2; },
    priceStyle() { return priceStyle; },
    percentStyle() { return percentStyle; },
    centerAlignStyle() { return centerAlignStyle; },
    borderStyle() { return borderStyle; },

    setWS(ws) { // setWS, setRow, resetCol, _num, _str, _price, _price_m, _percent, _formula
        c_ws = ws;
    },
    setRow(row) {
        c_row = row;
    },
    resetCol() {
        c_col = 1;
    },
    _num(val) {
        c_ws.cell(c_row, c_col++).number(val);
    },
    _str(val) {
        c_ws.cell(c_row, c_col++).string(val);
    },
    _price(val) {
        c_ws.cell(c_row, c_col++).number(val).style(priceStyle);
    },
    _price_m(val) {
        c_ws.cell(c_row, c_col++).number(val / 100).style(priceStyle);
    },
    _percent(val) {
        c_ws.cell(c_row, c_col++).number(val).style(percentStyle);
    },

    _formula(val, style) {
        c_ws.cell(c_row, c_col++).formula(val).style(style);
    },

    initStyle(wb){
        headStyle = wb.createStyle({
            fill: {
                type: 'pattern',
                patternType: 'darkUp',
                fgColor: '000000',
                bgColor: '000000',
            },
            font: {
                color: 'ffffff',
                bold: true,
            },
            alignment: {
                horizontal: 'center',
                shrinkToFit: true,
                wrapText: true
            },
        });
        headStyle2 = wb.createStyle({
            fill: {
                type: 'pattern',
                patternType: 'darkUp',
                fgColor: '000000',
                bgColor: '000000',
            },
            font: {
                color: 'ffffff',
                bold: true,
            },
            alignment: {
                horizontal: 'left',
                shrinkToFit: true,
                wrapText: true
            },
        });
        centerAlignStyle = wb.createStyle({
            alignment: {
                horizontal: 'center',
            },
            font: {
                bold: true,
            },
        });
        priceStyle = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; -- ',
        });
        percentStyle = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '#%; -#%; -'
        });
        borderStyle = wb.createStyle({
            border: {
                left: {
                    style: 'thin',
                    color: '#000000'
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                bottom: {
                    style: 'thin',
                    color: '#000000'
                },
            },
        });
    }

}