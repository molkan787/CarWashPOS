// @ts-ignore
const edm = imp("electron-download-manager");
import _url from '@/prs/api';

export default class Downloader{

    static download(url: any){
        return new Promise((resolve, reject) => {
            const dl = (typeof url == 'string') ? url : this.getDownloadUrl(url.filename, url.signature, url.returnFilename);
            edm.download({
                url: dl,
            }, (error: any, info: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(true);
            });
        });
    }

    static getDownloadUrl(filename: string, signature: string, returnFilename: string){
        return _url(`download/${filename}/${signature}/${returnFilename}`);
    }

}