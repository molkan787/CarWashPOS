const gmail = require('gmail-send');
const config = require('./config');
const Stats = require('../models/Stats');

const maxMinutes = 5;
const checkInterval = (maxMinutes - 2) * 60 * 1000;

class StatsNotifier{

    static init(){
        // this.send('<h1>Hello Test!</h1>')
        this.start();
        this.check();
    }

    static start(){
        this.reset();
        setInterval(() => this.check(), checkInterval);

        const d = new Date();
        this.check(d.getHours(), 1);
    }

    static reset(){
        this.prevStats = { cw: 0, pp: 0, rpp: 0, dt: 0 };
        this.sent = {};
        this.data = {};
    }

    static async check(_h, _m){
        const d = new Date();
        const h = _h || d.getHours();
        const m = _m || d.getMinutes();

        if(h == 0){
            this.reset();
            return;
        }
        
        const validTime = (m < maxMinutes) && (h >= 9 && h <= 20) && (!this.sent[h]);
        if(validTime){
            this.sent[h] = true;
            try {
                this.data[h] = await this.prepareData(h);
            } catch (error) {
                console.error(error);
            }
        }
    }

    static async prepareData(hour){
        const prev = this.prevStats;
        const curr = await Stats.getTodays();
        
        const cw = curr.cw - prev.cw;
        const pp = curr.pp - prev.pp;
        const rpp = curr.rpp - prev.rpp;
        const dt = curr.dt - prev.dt;

        const stats = { cw, pp, rpp, dt };
        const data = { stats, totalCW: curr.cw };
        // this.prepareHTML(data, hour); //
        return data;
    }

    static getHTMLViewWithData(additionalHTML){
        const d = new Date();
        const h = d.getHours();
        const data = this.data[h];
        if(!data) return false;
        return this.prepareHTML(data, h, additionalHTML);
    }

    static prepareHTML(data, hour, additionalHTML){
        // console.log(data);
        const st = data.stats;
        const html = `
            <style>
                table tr, table td{
                    text-align: center;
                }
            </style>
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title text-muted">APOS STATS</h5>
                    <h6 class="card-subtitle mb-2">Hour: ${(hour - 1) + 'h => ' + hour + 'h'}</h6>
                    <table border="1" class="table table-bordered" style="border-collapse: collapse;width: 100%;max-width: 400px;">
                        <thead>
                            <tr>
                                <th scope="col style="padding: 4px">CW</th>
                                <th scope="col style="padding: 4px">PP</th>
                                <th scope="col style="padding: 4px">RPP</th>
                                <th scope="col style="padding: 4px">DT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 4px">${st.cw}</td>
                                <td style="padding: 4px">${st.pp}</td>
                                <td style="padding: 4px">${st.rpp}</td>
                                <td style="padding: 4px">${st.dt}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h6>Total Car Wash: ${data.totalCW}</h6>
            
                </div>
            </div> ${additionalHTML || ''}
        `;
        // this.send(html);
        return html;
    }

    static send(htmlContent){
        console.log('CONTENT:', htmlContent);
        // gmail({
        //     user: config.email.user,
        //     pass: config.email.password,

        //     to: config.email.sendTo,
        //     subject: 'test subject',
        //     html: htmlContent,
        // });
        console.log('Email sent!')
    }



}
module.exports = StatsNotifier;
StatsNotifier.init();