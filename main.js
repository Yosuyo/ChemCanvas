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
        switch(moveFlag){
            case 0:
                downFlag = 3;
                ring(downX,downY);
                return;
            case 1:
                downFlag = 1;
                downId = moveId;
                ring(atoms[downId][1],atoms[downId][2]);
                return;
            case 2:
                downFlag = 2;
                downId = moveId;
                return;
        }
    }
};
c4.onmousemove = function(move){
    console.log(moveFlag);
    moveX = move.offsetX;
    moveY = move.offsetY;
    var atom = atoms.find(function(nowAtom){
        return inRound(moveX,moveY,nowAtom[1],nowAtom[2]);
    });
    if(atom!==void 0){
        demiAngle = 1;
        if(moveFlag!=1||moveId!=atom[0]){
            clear(eff1);
            clear(eff2);
            moveFlag = 1;
            moveId = atom[0];
            atomMark(atom[0]);
            if(downFlag==1){
                if(downId!=moveId){
                    ring(atoms[downId][1],atoms[downId][2]);
                    demiBond(downId,moveId);
                }
            }else if(downFlag==3){
                ring(downX,downY);
                demiBond2(downX,downY,moveId);
            }
        }
        return;
    }
    if(downFlag==1){
        if(moveFlag==1){
            clear(eff1);
            clear(eff2);
        }
        moveFlag = 0;
        var ang = direction(moveX,moveY,atoms[downId][1],atoms[downId][2]);
        if(ang==demiAngle){
            return;
        }else{
            clear(eff2);
            clear(eff1);
            ring(atoms[downId][1],atoms[downId][2]);
            demiAngle = ang;
            radLine(atoms[downId][1],atoms[downId][2],demiAngle,0);
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
            radLine(downX,downY,demiAngle,0);
            return;
        }
    }
    var bond = bonds.find(function(nowBond){
        return inRound(moveX,moveY,nowBond[1],nowBond[2]);
    });
    if(bond!==void 0){
        if(moveFlag!=2||moveId!=bond[0]){
            clear(eff1);
            clear(eff2);
            moveFlag = 2;
            moveId = bond[0];
            bondMark(bond[0]);
        }
        return;
    }
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
                    radLine(atoms[downId][1],atoms[downId][2],demiAngle,1);
                    break;
                case 1:
                    if(downId!=moveId){
                        newBond(downId,moveId);
                    }
                    break;
                case 2:
                    break;
            }
            break;
        case 2:
            if(moveFlag==2){
                if(downId==moveId){
                    switch(bonds[downId][5]){
                        case 1:
                            var secondBond;
                            var sideBond = bonds.find(function(bond){
                                return searchSideBond(downId,bond[0]);
                            });
                            if(sideBond==void 0){
                                secondBond = doubleSide(bonds[downId][3],bonds[downId][4]);
                                drawBond(secondBond[0],secondBond[1],secondBond[2],secondBond[3]);
                                changeBond(downId,2);
                                console.log(secondBond);
                                console.log("二重結合");
                            }else{
                            }
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                    }
                    console.log("結合");
                    bondMark(moveId);
                }
            }
            break;
        case 3:
            switch(moveFlag){
                case 0:
                    radLine(downX,downY,demiAngle,2);
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
    bonds.push([q,x,y,a,b,1]);
}
function drawBond(ax,ay,bx,by){
    main.beginPath();
    main.lineWidth = 2;
    main.moveTo(ax,ay);
    main.lineTo(bx,by);
    main.stroke();
}
function changeBond(bondId,type){
    var oldBond = bonds[bondId];
    bonds[bondId] = [oldBond[0],oldBond[1],oldBond[2],oldBond[3],oldBond[4],type];
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
    eff1.fillStyle = "rgba(0,0,255,0.5)";
    eff1.arc(atoms[id][1],atoms[id][2],len/5,0,Math.PI*2,true);
    eff1.fill();
}
function bondMark(id){
    eff1.beginPath();
    eff1.fillStyle = "rgba(0,255,0,0.5)";
    eff1.arc(bonds[id][1],bonds[id][2],len/5,0,Math.PI*2,true);
    eff1.fill();
}
function ring(x,y){
    eff1.beginPath();
    eff1.strokeStyle = "rgba(0,0,255,0.5)";
    eff1.arc(x,y,len*3/10,0,Math.PI*2,true);
    eff1.stroke();
}
function inRound(nowX,nowY,targetX,targetY){
    if(Math.pow(targetX-nowX,2)+Math.pow(targetY-nowY,2)<=Math.pow(len/5,2)){
        return true;
    }else{
        return false;
    }
}
function getAngle(nowX,nowY,targetX,targetY){
    //返り値:0~2π
    if(nowY-targetY==0){
        if(nowX-targetX>=0){
            return Math.PI/2;
        }else{
            return 3*Math.PI/2;
        }
    }
    var angle = Math.atan((nowX-targetX)/-(nowY-targetY));
    if((nowY-targetY)>0){
        angle += Math.PI;
    }
    if(angle<=0){
        angle += Math.PI*2;
    }
    return angle;
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
    switch(bool){
        case 0:
            eff2.beginPath();
            eff2.lineWidth = 2;
            eff2.strokeStyle = "rgba(0,255,255,0.5)";
            eff2.moveTo(x,y);
            eff2.lineTo(newX,newY);
            eff2.stroke();
            break;
        case 1:
            var c = newAtom(newX,newY,12);
            newBond(downId,c);
            break;
        case 2:
            var a = newAtom(x,y,12);
            var b = newAtom(newX,newY,12);
            newBond(a,b);
            break;
    }
}
function doubleSide(a,b,c){
    //a-b-cの結合があり、a-bが2重結合となる
    var baAngle = getAngle(atoms[b][1],atoms[b][2],atoms[a][1],atoms[a][2]);
    var bx,by,ax,ay;
    if(c===void 0){
        bx = atoms[b][1]+len/6*Math.sin(baAngle-Math.PI/4);
        by = atoms[b][2]-len/6*Math.cos(baAngle-Math.PI/4);
        ax = atoms[a][1]+len/6*Math.sin(baAngle-3*Math.PI/4);
        ay = atoms[a][2]-len/6*Math.cos(baAngle-3*Math.PI/4);
    }else{
        var bcAngle = getAngle(atoms[b][1],atoms[b][2],atoms[c][1],atoms[c][2]);
        var angle = baAngle - bcAngle;
        if((-2*Math.PI<=angle&&angle<-Math.PI)||(0<=angle&&angle<Math.PI)){
            bx = atoms[b][1]+len/6*Math.sin(baAngle-Math.PI/4);
            by = atoms[b][2]-len/6*Math.cos(baAngle-Math.PI/4);
            ax = atoms[a][1]+len/6*Math.sin(baAngle-3*Math.PI/4);
            ay = atoms[a][2]-len/6*Math.cos(baAngle-3*Math.PI/4);
        }else{
            bx = atoms[b][1]+len/6*Math.sin(baAngle+Math.PI/4);
            by = atoms[b][2]-len/6*Math.cos(baAngle+Math.PI/4);
            ax = atoms[a][1]+len/6*Math.sin(baAngle+3*Math.PI/4);
            ay = atoms[a][2]-len/6*Math.cos(baAngle+3*Math.PI/4);
        }
    }
    return [bx,by,ax,ay];
}
function searchSideBond(downBondId,nowBondId){
    if(downBondId==nowBondId){
        return false;
    }else if(bonds[downBondId][3]==bonds[nowBondId][3]){
        return true;
    }else if(bonds[downBondId][3]==bonds[nowBondId][4]){
        return true;
    }else if(bonds[downBondId][4]==bonds[nowBondId][3]){
        return true;
    }else if(bonds[downBondId][4]==bonds[nowBondId][4]){
        return true;
    }else{
        return false;
    }
}