const xl = require('excel4node');
module.exports = class XlBuilder{

    static get HEADINPUT_ALLINONE(){
        return 100;
    }
    static get HEADINPUT_TEXTONLY(){
        return 101;
    }

    constructor(worksheetName, options){
        this.fontStyle = {font: {size: 12}};
        this.workbook = new xl.Workbook({
            defaultFont: {
                size: 12
            },
            author: options && options.author || ''
        });
        this.styles = XlBuilder.initStyles(this.workbook);
        if(worksheetName) this.createWorksheet(worksheetName, options);
        this.c_row = 1;
        this.c_col = 1;
    }

    get fontSize(){
        return this.fontStyle.font.size;
    }
    set fontSize(size){
        this.fontStyle = {font: {size: parseInt(size)}};
    }

    writeFile(filename){
        return new Promise((resolve, reject) => {
            this.workbook.write(filename, err => {
                if(err){
                    reject(err);
                }else{
                    resolve(filename);
                }
            });
        });
    }

    createWorksheet(name, options){
        const { header } = (options || {})
        this.ws = this.workbook.addWorksheet(name, {
            headerFooter: {
                'evenHeader': header || '',
                'firstHeader': header || '',
                'oddHeader': header || '',
                'alignWithMargins': true,
                'differentFirst': true,
                'differentOddEven': true,
                'scaleWithDoc': true
            },
            printOptions: {
                printGridLines: true,
            },
            pageSetup: {
                orientation: 'landscape'
            },
            margins: {
                'bottom': 0.7519685, // Inches
                'footer': 0.2992126,
                'header': 0.2992126,
                'left': 0.18, // Narrow 0.2519685
                'right': 0.18,
                'top': 0.7519685
            },
        });
        this.c_row = 1;
        this.c_col = 1;
    }

    setWS(ws){
        this.ws = ws;
    }
    setRow(row){
        this.c_row = row;
    }
    nextRow(){
        this.c_row++;
        this.resetCol();
    }
    resetCol(){
        this.c_col = 1;
    }
    nextCol(){
        this.c_col++;
    }

    head(data, mode, aligns){
        if(typeof mode == 'undefined') mode = XlBuilder.HEADINPUT_ALLINONE;
        const inc = mode == XlBuilder.HEADINPUT_ALLINONE ? 2 : 1;
        for(let i = 0; i < data.length; i += inc){
            if(mode == XlBuilder.HEADINPUT_ALLINONE){
                this.ws.column(this.c_col).setWidth(data[i + 1] * 4.5);   
            }
            const style = aligns[i / inc] == 'right' ? this.styles.headRightAlign : this.styles.head;
            this.str(data[i]).style(style).style(this.fontStyle);
        }
        this.nextRow();
    }

    addItems(items, cells, options){
        const { defaultValue, sums, formaters } = (options || {});
        const l = items.length;
        const start = this.c_row;
        const end = start + l - 1;
        for(let i = 0; i < l; i++){
            const t = items[i];
            for(let c of cells){
                const f = formaters && formaters[c.p];
                const d = t[c.p];
                const fd = (d && f) ? f(d) : d;
                this[c.f](fd || defaultValue);
            }
            this.nextRow();
        }
        if(sums){
            for(let sum of sums){
                const startCell = xl.getExcelCellRef(start, sum.col);
                const endCell = xl.getExcelCellRef( end, sum.col);
                this.ws.cell(end + 3, sum.col).formula(`SUM(${startCell}:${endCell})`)
                .style(this.styles[sum.style]);
                if(sum.prefix){
                    this.ws.cell(end + 3, sum.col - 1).string(sum.prefix)
                    .style(this.styles[sum.style]);
                }
            }
        }
    }

    style(name){
        return this.ws.cell(this.c_row, this.c_col).style(this.styles[name]);
    }
    background(color){
        const style = this.workbook.createStyle({
            fill: {
                type: 'pattern',
                fgColor: color,
                bgColor: color,
            }
        });
        return this.ws.cell(this.c_row, this.c_col).style(style);
    }

    formula(val, style){
        return this.ws.cell(this.c_row, this.c_col++).formula(val).style(this.styles[style || 'price']).style(this.fontStyle);
    }
    num(val){
        return this.ws.cell(this.c_row, this.c_col++).number(val).style(this.fontStyle);
    }
    str(val){
        return this.ws.cell(this.c_row, this.c_col++).string(val).style(this.fontStyle);
    }
    price(val){
        return this.ws.cell(this.c_row, this.c_col++).number(parseFloat(val)).style(this.styles.price).style(this.fontStyle);
    }
    price_m(val){
        return this.ws.cell(this.c_row, this.c_col++).number(parseFloat(val) / 100).style(this.styles.price).style(this.fontStyle);
    }
    percent(val){
        return this.ws.cell(this.c_row, this.c_col++).number(val).style(this.styles.percent).style(this.fontStyle);
    }
    strArr(val){
        let str = '';
        for(let i = 0; i < val.length; i++){
            if(str) str += "\n";
            str += '- ' + val[i];
        }
        return this.ws.cell(this.c_row, this.c_col++).string(str).style(this.fontStyle);
    }

    static initStyles(wb){
        const o = {};
        o.head = wb.createStyle({
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
                vertical: 'center',
                shrinkToFit: true, 
                wrapText: true
            },
            border: XlBuilder.genBorder('#ffffff'),
        });
        o.head2 = wb.createStyle({
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
        o.headRightAlign = wb.createStyle({
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
                horizontal: 'right',
                shrinkToFit: true, 
                wrapText: true
            },
        });
        o.headLeftAlign = wb.createStyle({
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
        o.border = wb.createStyle({
            border: XlBuilder.genBorder('#000000'),
        });
        o.centerAlign = wb.createStyle({
            alignment: {
                horizontal: 'center',
            },
            font: {
                bold: true,
            },
        });
        o.rightAlign = wb.createStyle({
            alignment: {
                horizontal: 'right',
            }
        });
        o.priceBold = wb.createStyle({
            font: {
                bold: true,
            },
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; -- ',
        });
        o.price = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '$#,##0.00; - $#,##.00; -- ',
        });
        o.pricePositiveSign = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '+ $#,##0.00; - $#,##.00; -- ',
        });
        o.percent = wb.createStyle({
            alignment: {
                horizontal: 'right',
            },
            numberFormat: '#%; -#%; -',
        });
        return o;
    }

    static genBorder(color){
        return {
            left: {
                style: 'thin',
                color
            },
            right: {
                style: 'thin',
                color
            },
            top: {
                style: 'thin',
                color
            },
            bottom: {
                style: 'thin',
                color
            },
        }
    }

}

