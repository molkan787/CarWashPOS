module.exports = class ResponseMaker{

    static fail(cause){
        return {
            status: 'FAIL',
            cause,
        }
    }

    static success(data){
        if(typeof data == 'object'){
            return {
                status: 'OK',
                ...data
            }
        }else{
            return {
                status: 'OK'
            }
        }
    }

}