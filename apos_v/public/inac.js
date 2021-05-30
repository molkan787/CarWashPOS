const timeoutInMiliseconds = 60000 * 30;
let timeoutId = 0; 
  
function startTimer() {
    stopTimer();
    timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds)
}

function stopTimer(){
    if(timeoutId) clearTimeout(timeoutId);
}
  
function doInactive() {
    Inac.callHandlers();
}
 
function setupTimers () {
    document.addEventListener("mousemove", startTimer, false);
    document.addEventListener("mousedown", startTimer, false);
    document.addEventListener("keypress", startTimer, false);
    document.addEventListener("touchmove", startTimer, false);
}

window.addEventListener('load', setupTimers);

class Inac{

    static addHandler(handler){
        this.hanlders.push(handler);
    }

    static reset(){
        this.active = true;
        startTimer();
    }

    static stop(){
        this.active = false;
        stopTimer();
    }

    static callHandlers(){
        if(!this.active) return;
        this.active = false;
        for(let i = 0; i < this.hanlders.length; i++){
            this.hanlders[i]();
        }
    }
}

Inac.hanlders = [];
Inac.active = false;

if(typeof global == 'undefined'){
    window.Inac = Inac;
}else{
    global.Inac = Inac;
}