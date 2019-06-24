var winWidth = 700;
var winHeight = 600;

var c1 = document.getElementById("canvas1");
var base = c1.getContext("2d");
var c2 = document.getElementById("canvas2");
var main = c2.getContext("2d");
var c3 = document.getElementById("canvas3");
var eff1 = c3.getContext("2d");
var c4 = document.getElementById("canvas3");
var eff2 = c4.getContext("2d");

var downX,downY,upX,upY;
var downFlag = 0;//0:デフォルト 1:原子 2:結合 3:空
var moveFlag = 0;
var upFlag = 0;

window.onload = function(){
    background();
    setButton();
};

c4.onmousedown = function(down){
    downX = down.offsetX;
    downY = down.offsetY;
    if(status == 0){
        atoms.forEach(function(arrey){
            //ここに円判定
        });

    }
};
c4.onmouseup = function(up){
    upX = up.offsetX;
    upY = up.offsetY;
    switch(downFlag){
        case 0:
            break;
        case 1:
            var first = newAtom(downX,downY,12);
            var second = newAtom(downX+20*Math.sqrt(3),downY-20,12);
            newBond(first,second);
            break;
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
    var q = atoms.length;
    atoms.push([q,x,y,num]);
    return q;
}
function newBond(a,b){
    var q = bond.length;
    var x = (atoms[a][1]+atoms[b][1])/2;
    var y = (atoms[a][2]+atoms[b][2])/2;
    main.beginPath();
    main.lineWidth = 2;
    main.moveTo(atoms[a][1],atoms[a][2]);
    main.lineTo(atoms[b][1],atoms[b][2]);
    main.stroke();
    bond.push(q,x,y,a,b,1);
}
function clear(layer){
    layer.clearRect(0,0,winWidth,winHeight);
}
function atomMark(id){
    eff1.beginPath();
    eff1.strokeStyle = "rgba(0,0,100,0.5)";
    eff1.arc(atoms[id][1],atoms[id][2],8,0,Math.PI*2,true);
    eff1.fill();
}
function ring(x,y){
    eff1.beginPath();
    eff1.strokeStyle = "rgba(0,0,100,0.5)";
    eff1.arc(x,y,12,0,Math.PI*2,true);
    eff1.stroke();
}

