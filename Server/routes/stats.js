const errors = require('restify-errors');
const security = require('../security');
const resMaker = require('../utils/response');
const StatsNotifier = require('../bots/statsNotifier');
const auth = require('../auth/auth');

module.exports = async (req, res, next) => {
    let loggedIn = false;
    let loginFailed = false;
    if(req.method == 'POST'){
        if(req.body.logout == 'true'){
            res.clearCookie('token');
        }else{
            const {username, password} = req.body;
            const data = await auth.login(username, password);
            if(data.token){
                loggedIn = true;
                res.setCookie('token', data.token);
            }else{
                loginFailed = true;
            }
        }
    }else{
        const token = req.cookies['token'] || '---';
        const userId = await auth.checkToken(token);
        if(userId) {
            loggedIn = true;
        }
    }

    if(!loggedIn){
        respondWithHTML(getLoginForm(loginFailed), res, next);
        return;
    }


    let body = StatsNotifier.getHTMLViewWithData(`
    <form method="POST">
        <input type="hidden" name="logout" value="true"/>
        <button type="submit" class="btn btn-primary" style="margin-top: 20px">Logout</button>
    </form>
    `);
    if(!body) {
        body = '<div class="alert alert-warning" role="alert">Stats are not ready yet.</div>';
    }
    respondWithHTML(body, res, next);
}

function respondWithHTML(body, res, next){
    const html = `
    <html>
        <head>
        <meta name="viewport" content= "width=device-width, initial-scale=1.0"> 
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <style>body { padding: 15px; }</style>
        </head>
        <body>${body}</body>
    </html>
    `;
    res.writeHead(200, {
        'Content-Length': Buffer.byteLength(html),
        'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
    next()
}

function getLoginForm(loginFailed){
    const msg = loginFailed ? `
        <div class="alert alert-danger" role="alert">Username & Password does not match.</div>
    ` : '';
    return `
        <h5 class="card-title text-muted">APOS STATS</h5>
        <form method="POST">${msg}
            <div class="form-group">
                <label for="exampleInputEmail1">Username</label>
                <input name="username" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Username">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input name="password" type="password" class="form-control" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    `;
}