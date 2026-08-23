const $=id=>document.getElementById(id);
const qa=s=>Array.from(document.querySelectorAll(s));

let night=1;
let playing=false;
let view="front";
let camera="cam01";
let energy="camera";
let energyBusy=false;
let energyBlockedUntil=0;
let backupDone=false;
let rightDoorClosed=false;
let wireStep=0;
let elapsed=0;
let timer=null;
let mindTimer=null;
let leverTimer=null;
let leverHolding=false;
let mindLevel=70;

let state={
    nemka:0,
    lichi:0,
    pancake:0,
    kyu:0,
    kashatan:0,
    charlotte:0,
    delta:0,
    lizka:0,
    mindflayer:0
};

const nightEnemies={
1:["lichi"],
2:["lichi","pancake"],
3:["lichi","pancake","nemka"],
4:["pancake","delta","nemka"],
5:["lichi","delta","lizka","nemka"],
6:["kyu","lichi","pancake","nemka","lizka"],
7:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka"],
8:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka","mindflayer"],
9:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka","mindflayer"],
10:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka","mindflayer"],
11:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka","mindflayer"],
12:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka","mindflayer"],
13:["nemka","lichi","pancake","kyu","kashatan","charlotte","delta","lizka","mindflayer"]
};

function active(x){
    return nightEnemies[night]?.includes(x);
}

function snd(id){
    const a=$(id);
    if(!a)return;
    a.currentTime=0;
    a.play().catch(()=>{});
}

function stop(id){
    const a=$(id);
    if(!a)return;
    a.pause();
    a.currentTime=0;
}

function hideAll(){
    qa(".screen").forEach(x=>x.classList.add("hidden"));
    $("game").classList.add("hidden");
}

function menu(){
    playing=false;
    clearInterval(timer);
    clearInterval(mindTimer);
    clearInterval(leverTimer);
    stop("humAudio");
    hideAll();
    $("mainMenu").classList.remove("hidden");
}

function start(n){
    night=Math.max(1,Math.min(13,n));
    hideAll();
    $("phoneScreen").classList.remove("hidden");
    $("phoneNight").textContent="NIGHT "+night;
    snd("phoneAudio");
}

function begin(){
    stop("phoneAudio");
    hideAll();
    $("game").classList.remove("hidden");
    resetGame();
    playing=true;
    snd("humAudio");
    startClock();
}

function resetGame(){

    clearInterval(timer);
    clearInterval(mindTimer);
    clearInterval(leverTimer);

    elapsed=0;
    view="front";
    camera="cam01";
    energy="camera";
    energyBusy=false;
    energyBlockedUntil=0;
    backupDone=false;
    rightDoorClosed=false;
    wireStep=0;
    mindLevel=70;

    state={
        nemka:0,
        lichi:0,
        pancake:0,
        kyu:0,
        kashatan:0,
        charlotte:0,
        delta:0,
        lizka:0,
        mindflayer:0
    };

    $("night").textContent="NIGHT "+night;
    $("time").textContent="12:00 AM";
    $("status").textContent="ОФИС";

    $("officeImage").style.display="block";
    $("leftOffice").style.display="none";
    $("rightOffice").style.display="none";
    $("backWindow").style.display="none";
    $("windowElectricity").style.display="none";
    $("upperVent").classList.remove("upperVentActive");

    $("rightDoor").classList.remove("closed");
    $("rightDoorButton").textContent="🚪";
    $("doorStatus").textContent="ПРАВАЯ ДВЕРЬ: ОТКРЫТА";

    $("backupPanel").classList.add("hidden");
    $("cameraPanel").classList.add("hidden");
    $("energyPanel").classList.add("hidden");
    $("mindflayerPanel").classList.add("hidden");
    $("gameOver").classList.add("hidden");
    $("winScreen").classList.add("hidden");

    $("upperVentButton").style.display="none";
    $("incineratorButton").style.display="none";
    $("alarmButton").style.display="none";

    qa("#backupWires button").forEach(x=>x.classList.remove("wireSelected"));

    updateEnergyUI();
    renderAI();
}

function startClock(){

    const startTime=Date.now();

    timer=setInterval(()=>{

        if(!playing)return;

        elapsed=Math.floor((Date.now()-startTime)/1000);

        updateClock();
        updateAI();

        if(elapsed>=360){
            win();
        }

    },250);
}

function updateClock(){

    const hour=Math.floor(elapsed/60);
    const minute=elapsed%60;

    const displayHour=hour===0?12:hour;

    $("time").textContent=
        displayHour+":"+
        String(minute).padStart(2,"0")+
        " AM";
}

function updateAI(){

    if(!playing)return;

    if(active("nemka")&&elapsed>=60){

        state.nemka+=(night>=7?.055:.045);

        if(state.nemka>=100&&!backupDone){
            powerOff();
            state.nemka=65;
        }

        if(backupDone&&state.nemka>=100){

            if(rightDoorClosed&&energy==="door"){
                state.nemka=30;
                status("Немка остановлена электрической дверью.");
            }else{
                lose("Немка добралась до правой двери.");
                return;
            }
        }
    }

    if(active("lichi")){

        state.lichi+=.035;

        if(state.lichi>=100){

            if(view==="left"){
                lose("Личи добралась до офиса.");
                return;
            }

            state.lichi=95;
        }
    }

    if(active("pancake")&&elapsed>=120){

        state.pancake+=.04;

        if(state.pancake>=100){

            if(energy==="vent"){
                state.pancake=25;
                status("Вентиляция остановила Панкейка.");
            }else{
                lose("Панкейк пробрался через вентиляцию.");
                return;
            }
        }
    }

    if(active("kyu")){

        state.kyu+=state.kyu>70?.075:.025;

        if(state.kyu>=100){

            if(rightDoorClosed&&energy==="door"){
                state.kyu=20;
                status("Кью остановлен электрической дверью.");
            }else{
                lose("Кью ворвался через правую дверь.");
                return;
            }
        }
    }

    if(active("kashatan")){

        state.kashatan+=.075;

        if(state.kashatan>=100){

            if(
                energy==="window"&&
                Date.now()>=energyBlockedUntil
            ){
                state.kashatan=20;
                status("Электричество отбросило Каштана.");
            }else{
                lose("Каштан добрался до заднего окна.");
                return;
            }
        }
    }

    if(active("charlotte")){

        state.charlotte+=.09;

        if(state.charlotte>=100){

            energyBlockedUntil=Date.now()+20000;
            state.charlotte=20;

            status("Шарлота заблокировала питание окна на 20 секунд!");
            snd("charlotteAudio");
        }
    }

    if(active("delta")&&elapsed>=120){

        state.delta+=.045;

        if(state.delta>=100){

            if(
                energy==="incinerator"&&
                Date.now()>=energyBlockedUntil
            ){
                state.delta=15;
                status("Дельта отпугнута сжигателем.");
                snd("incineratorAudio");
            }else{
                lose("Дельта пробралась через верхнюю вентиляцию.");
                return;
            }
        }

        $("upperVentButton").style.display=
            view==="front"?"block":"none";

        $("incineratorButton").style.display="block";
    }

    if(active("lizka")){

        state.lizka+=.035;

        if(state.lizka>=100){

            if(energy==="fence"){
                state.lizka=20;
                status("Электрозабор остановил Лизку.");
            }else{
                lose("Лизка добралась до резервного питания.");
                return;
            }
        }
    }

    if(active("mindflayer")){

        state.mindflayer+=.03;

        if(state.mindflayer>=100){
            openMindPanel();
        }
    }

    renderAI();
    updateCamera();
    updateEnergyUI();
}

function renderAI(){

    $("lichi").style.display=
        view==="left"&&active("lichi")&&state.lichi>45
        ?"block":"none";

    $("pancake").style.display="none";

    $("kyu").style.display=
        view==="right"&&active("kyu")&&state.kyu>45
        ?"block":"none";

    $("nemka").style.display=
        view==="right"&&active("nemka")&&backupDone&&state.nemka>55
        ?"block":"none";

    $("kashatan").style.display=
        view==="rear"&&active("kashatan")&&state.kashatan>35
        ?"block":"none";

    $("charlotte").style.display=
        view==="rear"&&active("charlotte")&&state.charlotte>30
        ?"block":"none";

    $("lizka").style.display="none";
    $("mindflayer").style.display="none";

    $("lichi").style.left="45%";
    $("lichi").style.top="55%";

    $("kyu").style.left="75%";
    $("kyu").style.top="52%";

    $("nemka").style.left="78%";
    $("nemka").style.top="50%";

    $("kashatan").style.left="50%";
    $("kashatan").style.top="48%";

    $("charlotte").style.left="52%";
    $("charlotte").style.top="45%";

    $("pancake").style.display="none";
}

function setView(v){

    view=v;

    $("officeImage").style.display=v==="front"?"block":"none";
    $("leftOffice").style.display=v==="left"?"block":"none";
    $("rightOffice").style.display=v==="right"?"block":"none";
    $("backWindow").style.display=v==="rear"?"block":"none";

    $("status").textContent=
        v==="left"?"ЛЕВЫЙ КОРИДОР":
        v==="right"?"ПРАВЫЙ КОРИДОР":
        v==="rear"?"ЗАДНЕЕ ОКНО":
        "ОФИС";

    $("upperVentButton").style.display=
        v==="front"&&active("delta")&&elapsed>=120
        ?"block":"none";

    renderAI();
}

function flash(){

    snd("flashAudio");

    $("flash").style.opacity="1";

    setTimeout(()=>{
        $("flash").style.opacity="0";
    },100);

    if(active("lichi")&&state.lichi>20){
        state.lichi=Math.max(0,state.lichi-55);
        status("Вспышка отпугнула Личи!");
    }

    if(active("kashatan")&&state.kashatan>20){
        state.kashatan=Math.max(0,state.kashatan-20);
    }

    if(active("mindflayer")&&state.mindflayer>30){
        state.mindflayer=Math.max(0,state.mindflayer-10);
    }
}

function openCamera(){

    if(energy!=="camera"){
        status("Камеры не получают питание!");
        return;
    }

    $("cameraPanel").classList.remove("hidden");
    updateCamera();
}

function updateCamera(){

    if(!$("cameraPanel"))return;

    $("cameraNumber").textContent=camera.toUpperCase();

    $("cameraImage").style.backgroundImage=
        `url("images/${camera}.png")`;

    qa("#cameraMap button[data-camera]").forEach(b=>{
        b.classList.toggle(
            "energyTargetActive",
            b.dataset.camera===camera
        );
    });

    $("cameraLichi").style.display=
        active("lichi")&&camera==="cam02"&&state.lichi>15
        ?"block":"none";

    $("cameraPancake").style.display=
        active("pancake")&&camera==="cam04"&&state.pancake>10
        ?"block":"none";

    $("cameraKyu").style.display=
        active("kyu")&&camera==="cam05"&&state.kyu>15
        ?"block":"none";

    $("cameraKashatan").style.display=
        active("kashatan")&&camera==="cam06"&&state.kashatan>15
        ?"block":"none";

    $("cameraCharlotte").style.display=
        active("charlotte")&&state.charlotte>15
        ?"block":"none";

    $("cameraLizka").style.display=
        active("lizka")&&camera==="cam07"&&state.lizka>15
        ?"block":"none";

    $("cameraNemka").style.display="none";

    const eyeCamera=
        "cam0"+Math.max(
            1,
            Math.min(7,Math.ceil(state.nemka/12))
        );

    $("cameraNemkaEyes").classList.toggle(
        "nemkaEyesActive",
        active("nemka")&&
        state.nemka>30&&
        camera===eyeCamera
    );

    $("catMessage").textContent=
        "Текущая камера: "+camera.toUpperCase();
}

function meow(){

    if(energy!=="camera"){
        status("Камеры обесточены.");
        return;
    }

    snd("catAudio");

    if(active("nemka")&&state.nemka>5){

        state.nemka=Math.max(0,state.nemka-35);

        status("Немка отвлечена мяуканьем!");

        $("catMessage").textContent=
            "НЕМКА ОТВЛЕЧЕНА!";
    }else{
        $("catMessage").textContent=
            "Мяуканье воспроизведено.";
    }

    updateCamera();
}

function alarm(){

    if(energy!=="camera"){
        status("Сирена не работает без энергии.");
        return;
    }

    snd("alarmAudio");

    if(active("charlotte")&&state.charlotte>5){

        state.charlotte=Math.max(0,state.charlotte-55);

        status("СИРЕНА ОТВЛЕКЛА ШАРЛОТУ!");

        $("alarmMessage").textContent=
            "Шарлота отвлечена!";
    }else{
        $("alarmMessage").textContent=
            "Сигнализация активирована.";
    }
}

function upperVent(){

    if(elapsed<120){
        status("Верхняя шахта откроется в 2:00.");
        return;
    }

    $("upperVent").classList.toggle("upperVentActive");

    if($("upperVent").classList.contains("upperVentActive")){
        status("ВЕРХНЯЯ ШАХТА");
        $("delta").style.display=
            active("delta")&&state.delta>15
            ?"block":"none";
    }else{
        status("ОФИС");
        $("delta").style.display="none";
    }
}

function burn(){

    if(energy!=="incinerator"){
        status("Сначала направьте энергию на сжигатель.");
        return;
    }

    snd("incineratorAudio");

    if(active("delta")){
        state.delta=Math.max(0,state.delta-65);
        status("Мусор сожжён. Дельта отступает.");
    }
}

function closeRight(){

    /*
        Правая дверь может закрываться
        ТОЛЬКО если энергия направлена
        на дверь.
    */

    if(energy!=="door"){
        status("Дверь не получает электричество!");
        return;
    }

    rightDoorClosed=!rightDoorClosed;

    $("rightDoor").classList.toggle(
        "closed",
        rightDoorClosed
    );

    $("rightDoorButton").textContent=
        rightDoorClosed
        ?"🔓 ОТКРЫТЬ"
        :"🚪 ЗАКРЫТЬ";

    $("doorStatus").textContent=
        rightDoorClosed
        ?"ПРАВАЯ ДВЕРЬ: ЗАКРЫТА"
        :"ПРАВАЯ ДВЕРЬ: ОТКРЫТА";
}

function selectEnergy(target){

    if(energyBusy){
        status("Подождите окончания перенаправления.");
        return;
    }

    if(Date.now()<energyBlockedUntil&&target==="window"){
        status("Питание окна временно заблокировано!");
        return;
    }

    /*
        Выбор цели сам по себе
        НЕ меняет энергию.
        Энергия переносится только рычагом.
    */

    pendingEnergy=target;

    status(
        "Цель выбрана. Потяните рычаг 2 секунды."
    );
}

let pendingEnergy="camera";

function updateEnergyUI(){

    const names={
        camera:"КАМЕРЫ",
        window:"ЗАДНЕЕ ОКНО",
        incinerator:"СЖИГАТЕЛЬ",
        door:"ПРАВАЯ ДВЕРЬ",
        fence:"ЭЛЕКТРОЗАБОР",
        vent:"ВЕНТИЛЯЦИЯ"
    };

    $("energyTargetText").textContent=
        names[energy];

    $("energyMessage").textContent=
        "Энергия направлена на "+
        names[energy].toLowerCase()+".";

    qa("#energyTargets button").forEach(b=>{
        b.classList.toggle(
            "energyTargetActive",
            b.dataset.energy===pendingEnergy
        );
    });

    $("powerStatus").textContent=
        "⚡ ПИТАНИЕ: "+
        (energyBusy?"ПЕРЕНОС...":names[energy]);
}

function startLever(){

    if(energyBusy)return;

    leverHolding=true;

    const start=Date.now();

    clearInterval(leverTimer);

    leverTimer=setInterval(()=>{

        if(!leverHolding){
            clearInterval(leverTimer);
            $("leverProgressBar").style.width="0%";
            return;
        }

        const progress=
            Math.min(100,(Date.now()-start)/20);

        $("leverProgressBar").style.width=
            progress+"%";

        if(progress>=100){

            clearInterval(leverTimer);

            leverHolding=false;

            energyBusy=true;

            const target=pendingEnergy;

            setTimeout(()=>{

                energy=target;
                energyBusy=false;

                $("leverProgressBar").style.width="0%";

                updateEnergyUI();

                status(
                    "Энергия перенаправлена: "+
                    target.toUpperCase()
                );

            },2000);
        }

    },30);
}

function stopLever(){
    if(!energyBusy){
        leverHolding=false;
    }
}

function powerOff(){

    if(backupDone)return;

    snd("powerOffAudio");

    $("backupPanel").classList.remove("hidden");

    status("ОСНОВНОЕ ПИТАНИЕ ОТКЛЮЧЕНО");
}

function backupWire(number){

    number=Number(number);

    if(number===wireStep+1){

        wireStep++;

        qa("#backupWires button").forEach(b=>{
            if(Number(b.dataset.wire)<=wireStep){
                b.classList.add("wireSelected");
            }
        });

        if(wireStep===4){

            backupDone=true;

            $("backupPanel").classList.add("hidden");

            state.nemka=65;

            snd("backupAudio");

            status("Резервная система запущена!");
        }

    }else{

        wireStep=0;

        qa("#backupWires button")
            .forEach(b=>b.classList.remove("wireSelected"));

        $("backupMessage").textContent=
            "ОШИБКА! НАЧНИТЕ ЗАНОВО.";
    }
}

function openMindPanel(){

    if(!$("mindflayerPanel").classList.contains("hidden")){
        return;
    }

    $("mindflayerPanel").classList.remove("hidden");

    mindLevel=70;

    updateMind();

    clearInterval(mindTimer);

    mindTimer=setInterval(()=>{

        mindLevel-=.8;

        if(mindLevel<=0){

            mindLevel=0;

            clearInterval(mindTimer);

            $("mindflayerPanel").classList.add("hidden");

            state.mindflayer=10;

            status("Майндфлеиер полностью замедлен.");

        }

        updateMind();

    },500);
}

function updateMind(){

    $("mindBarFill").style.width=
        mindLevel+"%";

    $("mindMessage").textContent=
        "СКОРОСТЬ: "+
        Math.round(mindLevel)+"%";
}

function lose(reason){

    if(!playing)return;

    playing=false;

    clearInterval(timer);
    clearInterval(mindTimer);
    clearInterval(leverTimer);

    stop("humAudio");

    $("loseReason").textContent=reason;
    $("gameOver").classList.remove("hidden");
}

function win(){

    if(!playing)return;

    playing=false;

    clearInterval(timer);
    clearInterval(mindTimer);
    clearInterval(leverTimer);

    stop("humAudio");

    const unlocked=Math.min(13,night+1);

    localStorage.setItem(
        "bgnUnlocked",
        unlocked
    );

    $("winText").textContent=
        "NIGHT "+night+" COMPLETE";

    $("nextNight").style.display=
        night<13?"block":"none";

    $("winScreen").classList.remove("hidden");
}

function fillNights(){

    const unlocked=Number(
        localStorage.getItem("bgnUnlocked")||1
    );

    $("nightsList").innerHTML="";

    for(let i=1;i<=13;i++){

        const b=document.createElement("button");

        b.className=
            "nightButton"+
            (i>unlocked?" locked":"");

        b.textContent=
            "NIGHT "+i;

        b.disabled=i>unlocked;

        b.onclick=()=>start(i);

        $("nightsList").appendChild(b);
    }
}

$("startGameButton").onclick=()=>{
    start(Number(localStorage.getItem("bgnUnlocked")||1));
};

$("nightsButton").onclick=()=>{
    fillNights();
    hideAll();
    $("nightsMenu").classList.remove("hidden");
};

$("closeNights").onclick=menu;

$("settingsButton").onclick=()=>{
    hideAll();
    $("settingsMenu").classList.remove("hidden");
};

$("closeSettings").onclick=menu;

$("skipPhoneButton").onclick=begin;

$("fullscreenButton").onclick=()=>{
    document.documentElement.requestFullscreen?.();
};

$("resetProgress").onclick=()=>{
    localStorage.removeItem("bgnUnlocked");
    fillNights();
    alert("Прогресс сброшен.");
};

$("cameraButton").onclick=openCamera;

$("closeCameraPanel").onclick=()=>{
    $("cameraPanel").classList.add("hidden");
};

$("energyButton").onclick=()=>{
    updateEnergyUI();
    $("energyPanel").classList.remove("hidden");
};

$("closeEnergyPanel").onclick=()=>{
    $("energyPanel").classList.add("hidden");
};

$("closeMindPanel").onclick=()=>{
    $("mindflayerPanel").classList.add("hidden");
};

$("mindSlow").onclick=()=>{
    mindLevel=Math.max(0,mindLevel-15);
    updateMind();

    if(mindLevel===0){
        clearInterval(mindTimer);
        $("mindflayerPanel").classList.add("hidden");
        state.mindflayer=10;
        status("Майндфлеиер полностью замедлен.");
    }
};

$("mindFast").onclick=()=>{
    mindLevel=Math.min(100,mindLevel+20);
    updateMind();
};

$("flashButton").onclick=flash;

$("leftButton").onclick=()=>{
    setView("left");
};

$("frontButton").onclick=()=>{
    setView("front");
};

$("rightButton").onclick=()=>{
    setView("right");
};

$("rightDoorButton").onclick=closeRight;

$("upperVentButton").onclick=upperVent;

$("incineratorButton").onclick=burn;

$("catMeowButton").onclick=meow;

$("cameraAlarmButton").onclick=alarm;

qa("#cameraMap button[data-camera]").forEach(b=>{
    b.onclick=()=>{
        camera=b.dataset.camera;
        updateCamera();
    };
});

qa("#energyTargets button").forEach(b=>{
    b.onclick=()=>{
        selectEnergy(b.dataset.energy);
    };
});

qa("#backupWires button").forEach(b=>{
    b.onclick=()=>{
        backupWire(b.dataset.wire);
    };
});

$("lever").addEventListener("pointerdown",e=>{
    e.preventDefault();
    $("lever").setPointerCapture?.(e.pointerId);
    startLever();
});

$("lever").addEventListener("pointerup",stopLever);
$("lever").addEventListener("pointercancel",stopLever);
$("lever").addEventListener("pointerleave",e=>{
    if(e.buttons===0)stopLever();
});

$("restart").onclick=begin;

$("menuAfterLose").onclick=menu;

$("nextNight").onclick=()=>{
    start(Math.min(13,night+1));
};

$("menuAfterWin").onclick=menu;

fillNights();
updateEnergyUI();
