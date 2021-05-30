const daySeconds = 3600 * 24;
const tz_offset = 3600 * 4;

class TimeHelper{

    get daySeconds(){
        return daySeconds;
    }

    get tzOffset(){
        return tz_offset;
    }

    getDateKey(datetime){
        const date = datetime ? new Date(datetime * 1000) : new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
       
        let convdataTime = year * 10000 + month * 100 + day;

        return convdataTime;
    }

    today(){
        return this.roundToDay(this.now());
    }

    now(){
        return Math.floor(Date.now() / 1000);
    }

    roundToDay(time){
        return time - (time % daySeconds) + tz_offset;
    }

    todayDate(){
        return this.timestampToDate(this.now());
    }

    timestampToDate(unixtimestamp, includeTime){
        // Months array
        const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        // Convert timestamp to milliseconds
        const date = new Date(unixtimestamp*1000);
        const year = date.getFullYear();
        const month = months_arr[date.getMonth()];
        const day = "0" + date.getDate();
        const hours = "0" + date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
       
        let convdataTime = day.substr(-2) + ' ' + month + ' ' + year;
        if(includeTime)
            convdataTime += ' - ' + hours.substr(-2) + ':' + minutes.substr(-2);
            if(includeTime == 2){
                convdataTime += ':' + seconds.substr(-2);
            }

        return convdataTime;
    }

    addDay(time){
        return parseInt(time) + daySeconds;
    }
    
}

module.exports = new TimeHelper();