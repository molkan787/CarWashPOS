export default class Utils {
    static round(value: number){
        return Math.round(value * 100) / 100;
    }

    static getCurrentTime(){
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        
        m = this.checkTime(m);
        h = this.checkTime(h);
        return h + ":" + m;
    }

    static checkTime(i: any) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
    }

    static timestampToDate(unixtimestamp: any, includeTime?: any, numMonths?: boolean){
        // Months array
        const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        // Convert timestamp to milliseconds
        const date = new Date(unixtimestamp*1000);
        const year = date.getFullYear();
        const month = numMonths ? ('0'+(date.getMonth() + 1)).substr(-2) : months_arr[date.getMonth()];
        const day = "0" + date.getDate();
        const hours = "0" + date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
       
        const sc = numMonths ? '-' : ' ';
        let convdataTime = day.substr(-2) + sc + month + sc + year;
        if(includeTime)
            convdataTime += ' - ' + hours.substr(-2) + ':' + minutes.substr(-2);
            if(includeTime == 2){
                convdataTime += ':' + seconds.substr(-2);
            }

        return convdataTime;
    }

    static dateToTimestamp(dateString: string){
        const str = dateString.replace(/-/g, '/');
        return (new Date(str)).getTime() / 1000;
    }

    static todaysDate(){
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        return yyyy + '/' + mm + '/' + dd;
    }

    static getFilenameExtension(filename: string){
        const parts = filename.split('.');
        return parts[parts.length - 1];
    }

}