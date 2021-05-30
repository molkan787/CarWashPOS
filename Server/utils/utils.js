const time = require('./time');

module.exports = class Utils{
    static price(value){
        const neg = value < 0;
        const val = neg ? -value : value;
        return (neg ? '- ' : '') + '$' + val.toFixed(2);
    }

    static price_m(value){
        return this.price(value / 100);
    }

    static removeTaxes(value, taxes){
        const totalTaxRate = taxes.gst + taxes.qst;
        return value / (totalTaxRate + 1);
    }

    static rndSlug(suffix){
        return time.now() + '-' + this.rndStr(8) + (suffix || '');
    }

    static rndStr(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    static sqlEscape (str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent,
                                      // and double/single quotes
            }
        });
    }
}