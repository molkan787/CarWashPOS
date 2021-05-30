const md5 = require('md5');
const randomstring = require("randomstring");
const User = require('../models/User');
const UserToken = require('../models/UserToken');

module.exports = class Auth{

    static login(username, password){
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.query().findOne({username});
                if(user){
                    const hashed_password = md5(password);
                    if(user.password == hashed_password){
                        const passwords = (await this.getAllPasswords()).map(u => u.password);
                        Auth.genToken(user.id).then(token => {
                            resolve({token, user, passwords});
                        }).catch(error => {
                            reject(error);
                        });
                    }else{
                        resolve(false);
                    }
                }else{
                    resolve(false);
                }
                
            } catch (error) {
                reject(error);
            }
        });

    }

    static getAllPasswords(){
        return User.query().select('password');
    }

    static checkToken(token){
        return new Promise( async (resolve, reject) => {
            try {
                const userToken = await UserToken.query().findOne({token});
                if (userToken){
                    resolve(userToken.user_id);
                }else{
                    resolve(false);
                }
            } catch (error) {
                reject(error);
            }

        });
    }

    static genToken(userID){
        return new Promise(async (resolve, reject) => {
            const token = randomstring.generate(30);
            try {
                await UserToken.query().delete().where({user_id: userID});
                await UserToken.query().insert({
                    user_id: userID,
                    token,
                    is_active: 1,
                    date_added: 0
                });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    }

}
