var c1 = document.getElementById("canvas1");
var base = c1.getContext("2d");
var c2 = document.getElementById("canvas2");
var main = c2.getContext("2d");
var c3 = document.getElementById("canvas3");
var surf = c3.getContext("2d");

window.onload = function(){
    background();
    setButton();
};

c3.onclick = function(click){
    var clickX = click.offsetX;
    var clickY = click.offsetY;
    if(status == 0){
        if(ture){
            newAtom(clickX,clickY,12);

        }
    }
};

function background(){
    base.fillStyle = "rgb(255,255,255)";
    base.fillRect(60,30,610,540);
}
function setButton(){
    base.fillStyle = "rgb(0,100,50)";
    base.fillRect(0,50,50,50);
    base.fillStyle = "rgb(100,0,50)";
    base.fillRect(0,110,50,50);
    base.fillStyle = "rgb(0,50,100)";
    base.fillRect(0,170,50,50);
}
function newAtom(x,y,num){
    var q = atom.length;
    atom.push([q,x,y,num]);
}
function newBond(a,b){
    var q = bond.length;
    var x = (atom[a][1]+atom[b][1])/2;
    var y = (atom[a][2]+atom[b][2])/2;
    bond.push(q,x,y,a,b,1);
}
function defaultSet(){
    var a = 1;
}

