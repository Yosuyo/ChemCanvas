var winWidth = 700; //キャンバス横幅
var winHeight = 600; //キャンバス縦幅
var len = 40; //結合長

var c1 = document.getElementById("canvas1");
var base = c1.getContext("2d");
var c2 = document.getElementById("canvas2");
var main = c2.getContext("2d");
var c3 = document.getElementById("canvas3");
var eff1 = c3.getContext("2d");
var c4 = document.getElementById("canvas4");
var eff2 = c4.getContext("2d");

var downX,downY,moveX,moveY,upX,upY;
var downFlag = 0;//0:デフォルト 1:原子 2:結合 3:空
var downId = 999;
var moveFlag = 0;//0:デフォルト 1:原子 2:結合
var moveId = 999;
var demiAngle = 1;

window.onload = function(){
    background();
    setButton();
};

c4.onmousedown = function(down){
    downX = down.offsetX;
    downY = down.offsetY;
    if(status==0){
        if(moveFlag==1){
            downFlag = 1;
            downId = moveId;
            ring(atoms[downId][1],atoms[downId][2]);
            return;
        }else if(moveFlag==2){
            downFlag = 2;
            downId = downFlag;
            return;
        }else{
            downFlag = 3;
            ring(downX,downY);
            return;
        }
    }
};
c4.onmousemove = function(move){
    moveX = move.offsetX;
    moveY = move.offsetY;
    atoms.forEach(function(atom){
        if(inRound(moveX,moveY,atom[1],atom[2])){
            if(moveFlag==1&&moveId!=atom[0]){
                clear(eff1);
                clear(eff2);
            }else if(moveFlag==2){
                clear(eff1);
                clear(eff2);
            }
            moveFlag = 1;
            moveId = atom[0];
            atomMark(atom[0]);
            if(downFlag==1){
                if(downId!=moveId){
                    demiBond(downId,moveId);
                }
            }else if(downFlag==3){
                ring(downX,downY);
                demiBond2(downX,downY,moveId);
            }
            return;
        }
    });
    if(downFlag==1){
        moveFlag = 0;
        var ang = direction(moveX,moveY,atoms[downId][1],atoms[downId][2]);
        if(ang==demiAngle){
            return;
        }else{
            clear(eff2);
            ring(atoms[downId][1],atoms[downId][2]);
            demiAngle = ang;
            radLine(atoms[downId][1],atoms[downId][2],demiAngle,false);
            return;
        }
    }else if(downFlag==3){
        moveFlag = 0;
        var aang = direction(moveX,moveY,downX,downY);
        if(aang==demiAngle){
            return;
        }else{
            clear(eff1);
            clear(eff2);
            ring(downX,downY);
            demiAngle = aang;
            radLine(downX,downY,demiAngle,false);
            return;
        }
    }
    bonds.forEach(function(bond){
        if(inRound(downX,downY,bond[1],bond[2])){
            if(moveFlag==1){
                clear(eff1);
            }else if(moveFlag==2&&moveId!=bond[0]){
                clear(eff1);
            }
            moveFlag = 2;
            moveId = bond[0];
            bondMark(bond[0]);
            return;
        }
    });
    clear(eff1);
    moveFlag = 0;
};
c4.onmouseup = function(up){
    clear(eff1);
    clear(eff2);
    upX = up.offsetX;
    upY = up.offsetY;
    switch(downFlag){
        case 0:
            break;
        case 1:
            switch(moveFlag){
                case 0:
                    radLine(atoms[downId][1],atoms[downId][2],demiAngle,true);
                    break;
                case 1:
                    newBond(downId,moveId);
                    break;
                case 2:
                    break;
            }
            break;
        case 2:
            if(moveFlag==2){
                if(downId==moveId){
                    //二重結合への変更
                }
            }
            break;
        case 3:
            switch(moveFlag){
                case 0:
                    radLine(downX,downY,demiAngle,true);
                    break;
                case 1:
                    var a = newAtom(downX,downY,12);
                    newBond(a,moveId);
                    break;
                case 2:
                    break;
            }
            break;
    }
    downFlag = 0;
    downId = 999;
    moveFlag = 0;
    moveId = 999;
    demiAngle = 1;
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
    var q = bonds.length;
    var x = (atoms[a][1]+atoms[b][1])/2;
    var y = (atoms[a][2]+atoms[b][2])/2;
    main.beginPath();
    main.lineWidth = 2;
    main.moveTo(atoms[a][1],atoms[a][2]);
    main.lineTo(atoms[b][1],atoms[b][2]);
    main.stroke();
    bonds.push(q,x,y,a,b,1);
}
function demiBond(a,b){
    eff2.beginPath();
    eff2.lineWidth = 2;
    eff2.strokeStyle = "rgba(0,255,255,0.5)";
    eff2.moveTo(atoms[a][1],atoms[a][2]);
    eff2.lineTo(atoms[b][1],atoms[b][2]);
    eff2.stroke();
}
function demiBond2(x,y,b){
    eff2.beginPath();
    eff2.lineWidth = 2;
    eff2.strokeStyle = "rgba(0,255,255,0.5)";
    eff2.moveTo(x,y);
    eff2.lineTo(atoms[b][1],atoms[b][2]);
    eff2.stroke();
}
function clear(layer){
    layer.clearRect(0,0,winWidth,winHeight);
}
function atomMark(id){
    eff1.beginPath();
    eff1.strokeStyle = "rgba(0,0,255,0.5)";
    eff1.arc(atoms[id][1],atoms[id][2],len/5,0,Math.PI*2,true);
    eff1.fill();
}
function bondMark(id){
    eff1.beginPath();
    eff1.strokeStyle = "rgba(0,255,0,0.5)";
    eff1.arc(atoms[id][1],atoms[id][2],len/5,0,Math.PI*2,true);
    eff1.fill();
}
function ring(x,y){
    eff1.beginPath();
    eff1.strokeStyle = "rgba(0,0,255,0.5)";
    eff1.arc(x,y,len*3/10,0,Math.PI*2,true);
    eff1.stroke();
}
function inRound(nowX,nowY,targetX,targetY){
    if(Math.pow(targetX-nowX,2)+Math.pow(targetY-nowY,2)<=Math.pow((len/5)*2)){
        return true;
    }else{
        return false;
    }
}
function direction(nowX,nowY,targetX,targetY){
    if(nowY-targetY==0){
        if(nowX-targetX>=0){
            return Math.PI/2;
        }else{
            return -Math.PI/2;
        }
    }
    var angle = Math.atan((nowX-targetX)/-(nowY-targetY));
    if((nowY-targetY)>0){
        angle += Math.PI;
    }
    if(-Math.PI*5/12<=angle&&angle<-Math.PI/4){
        angle = -Math.PI/3;
    }else if(-Math.PI/4<=angle&&angle<-Math.PI/12){
        angle = -Math.PI/6;
    }else if(-Math.PI/12<=angle&&angle<Math.PI/12){
        angle = 0;
    }else if(Math.PI/12<=angle&&angle<Math.PI/4){
        angle = Math.PI/6;
    }else if(Math.PI/4<=angle&&angle<Math.PI*5/12){
        angle = Math.PI/3;
    }else if(Math.PI*5/12<=angle&&angle<Math.PI*7/12){
        angle = Math.PI/2;
    }else if(Math.PI*7/12<=angle&&angle<Math.PI*3/4){
        angle = Math.PI*2/3;
    }else if(Math.PI*3/4<=angle&&angle<Math.PI*11/12){
        angle = Math.PI*5/6;
    }else if(Math.PI*11/12<=angle&&angle<Math.PI*13/12){
        angle = Math.PI;
    }else if(Math.PI*13/12<=angle&&angle<Math.PI*5/4){
        angle = Math.PI*7/6;
    }else if(Math.PI*5/4<=angle&&angle<Math.PI*17/12){
        angle = Math.PI*4/3;
    }else{
        angle = -Math.PI/2;
    }
    return angle;
}
function radLine(x,y,angle,bool){
    var newX = x+len*Math.sin(angle);
    var newY = y-len*Math.cos(angle);
    if(bool){
        var a = newAtom(x,y,12);
        var b = newAtom(newX,newY,12);
        newBond(a,b);
    }else{
        eff2.beginPath();
        eff2.lineWidth = 2;
        eff2.strokeStyle = "rgba(0,255,255,0.5)";
        eff2.moveTo(x,y);
        eff2.lineTo(newX,newY);
        eff2.stroke();
    }
}