const $ = id => document.getElementById(id);

const q = selector =>
    document.querySelector(selector);

const qa = selector =>
    Array.from(document.querySelectorAll(selector));


let night = 1;

let playing = false;

let view = "front";

let camera = "cam01";

let energy = "camera";

let energyBusy = false;

let energyBlockedUntil = 0;

let backupDone = false;

let rightDoorClosed = false;

let wireStep = 0;

let leverStart = 0;

let timer = null;

let mindTimer = null;

let elapsed = 0;

let mindLevel = 70;

let flashBusy = false;

const FLASH_COOLDOWN = 3000;


/* =========================
   СОСТОЯНИЕ ВРАГОВ
========================= */

let state = {

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


/* =========================
   НОЧИ
========================= */

const nightEnemies = {

    1:[
        "lichi"
    ],

    2:[
        "lichi",
        "pancake"
    ],

    3:[
        "lichi",
        "pancake",
        "nemka"
    ],

    4:[
        "pancake",
        "delta",
        "nemka"
    ],

    5:[
        "lichi",
        "delta",
        "lizka",
        "nemka"
    ],

    6:[
        "kyu",
        "lichi",
        "pancake",
        "nemka",
        "lizka"
    ],

    7:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka"
    ],

    8:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka",
        "mindflayer"
    ],

    9:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka",
        "mindflayer"
    ],

    10:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka",
        "mindflayer"
    ],

    11:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka",
        "mindflayer"
    ],

    12:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka",
        "mindflayer"
    ],

    13:[
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka",
        "mindflayer"
    ]
};


function active(enemy){

    return nightEnemies[night]?.includes(enemy);
}


/* =========================
   ЗВУК
========================= */

function snd(id){

    const audio = $(id);

    if(!audio) return;

    audio.currentTime = 0;

    audio.play().catch(()=>{});
}


function stop(id){

    const audio = $(id);

    if(!audio) return;

    audio.pause();

    audio.currentTime = 0;
}


/* =========================
   ЭКРАНЫ
========================= */

function hideAll(){

    qa(".screen").forEach(
        x => x.classList.add("hidden")
    );

    $("game").classList.add("hidden");
}


function menu(){

    playing = false;

    clearInterval(timer);

    clearInterval(mindTimer);

    stop("humAudio");

    hideAll();

    $("mainMenu")
        .classList
        .remove("hidden");
}


function start(n){

    night =
        Math.max(
            1,
            Math.min(13,n)
        );

    hideAll();

    $("phoneScreen")
        .classList
        .remove("hidden");

    $("phoneNight")
        .textContent =
        "NIGHT " + night;

    snd("phoneAudio");
}


function begin(){

    stop("phoneAudio");

    hideAll();

    $("game")
        .classList
        .remove("hidden");

    resetGame();

    playing = true;

    snd("humAudio");

    startClock();
}


/* =========================
   СБРОС
========================= */

function resetGame(){

    clearInterval(timer);

    clearInterval(mindTimer);

    elapsed = 0;

    view = "front";

    camera = "cam01";

    energy = "camera";

    energyBusy = false;

    energyBlockedUntil = 0;

    backupDone = false;

    rightDoorClosed = false;

    wireStep = 0;

    mindLevel = 70;

    flashBusy = false;

    state = {

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

    $("night").textContent =
        "NIGHT " + night;

    $("time").textContent =
        "12:00 AM";

    $("status").textContent =
        "ОФИС";

    $("rightDoor")
        .classList
        .remove("closed");

    $("rightDoorButton")
        .textContent =
        "ЗАКРЫТЬ";

    $("backupPanel")
        .classList
        .add("hidden");

    $("cameraPanel")
        .classList
        .add("hidden");

    $("energyPanel")
        .classList
        .add("hidden");

    $("mindflayerPanel")
        .classList
        .add("hidden");

    $("gameOver")
        .classList
        .add("hidden");

    $("winScreen")
        .classList
        .add("hidden");

    $("upperVent")
        .classList
        .remove("upperVentActive");

    $("lowerVent")
        .style
        .display = "none";

    $("backWindow")
        .style
        .display = "none";

    $("leftOffice")
        .style
        .display = "none";

    $("rightOffice")
        .style
        .display = "none";

    $("windowElectricity")
        .style
        .display = "none";

    $("upperVentButton")
        .style
        .display = "none";

    $("lowerVentButton")
        .style
        .display = "none";

    $("incineratorButton")
        .style
        .display = "none";

    $("rearWindowButton")
        .style
        .display = "none";

    qa("#backupWires button")
        .forEach(
            x =>
                x.classList
                .remove("wireSelected")
        );

    updateEnergyUI();

    updateClock();

    updateView();

    renderAI();
}


/* =========================
   ВРЕМЯ
========================= */

function startClock(){

    const startTime =
        Date.now();

    timer =
        setInterval(()=>{

            if(!playing) return;

            elapsed =
                Math.floor(
                    (Date.now()-startTime)/1000
                );

            updateClock();

            updateAI();

            if(elapsed >= 360){

                win();
            }

        },250);
}


function updateClock(){

    let totalMinutes =
        elapsed;

    let hour =
        Math.floor(
            totalMinutes/60
        );

    let minute =
        totalMinutes%60;

    let displayHour =
        hour === 0
            ? 12
            : hour;

    $("time").textContent =
        displayHour +
        ":" +
        String(minute)
        .padStart(2,"0") +
        " AM";
}


/* =========================
   ИИ
========================= */

function updateAI(){

    if(!playing) return;


    /* НЕМКА */

    if(
        active("nemka") &&
        elapsed >= 60
    ){

        state.nemka +=
            night >= 7
                ? .055
                : .045;

        if(
            state.nemka >= 100 &&
            !backupDone
        ){

            powerOff();

            state.nemka = 65;
        }

        if(
            backupDone &&
            state.nemka >= 100
        ){

            if(
                view === "right" &&
                rightDoorClosed &&
                energy === "door"
            ){

                state.nemka = 35;

                status(
                    "Немка отступила от двери."
                );

            }else{

                lose(
                    "Немка добралась до офиса."
                );

                return;
            }
        }
    }


    /* ЛИЧИ */

    if(active("lichi")){

        state.lichi += .035;

        if(state.lichi >= 100){

            if(view === "left"){

                lose(
                    "Личи добралась до офиса."
                );

                return;

            }else{

                state.lichi = 95;
            }
        }
    }


    /* ПАНКЕЙК */

    if(
        active("pancake") &&
        elapsed >= 120
    ){

        state.pancake += .04;

        if(state.pancake >= 100){

            if(
                view === "front" &&
                lowerVentOpen
            ){

                state.pancake = 35;

                status(
                    "Панкейк был остановлен в вентиляции."
                );

            }else{

                lose(
                    "Панкейк пробрался через вентиляцию."
                );

                return;
            }
        }
    }


    /* КЬЮ */

    if(active("kyu")){

        state.kyu +=
            state.kyu > 70
                ? .075
                : .025;

        if(state.kyu >= 100){

            if(
                rightDoorClosed &&
                energy === "door"
            ){

                state.kyu = 25;

                status(
                    "Кью ударился о электрическую дверь."
                );

            }else{

                lose(
                    "Кью ворвался через правую дверь."
                );

                return;
            }
        }
    }


    /* КАШТАН */

    if(active("kashatan")){

        state.kashatan += .075;

        if(state.kashatan >= 100){

            if(
                windowPowered()
            ){

                state.kashatan = 20;

                status(
                    "Электричество отбросило Каштана!"
                );

            }else{

                lose(
                    "Каштан добрался до заднего окна."
                );

                return;
            }
        }
    }


    /* ШАРЛОТА */

    if(active("charlotte")){

        state.charlotte += .09;

        if(state.charlotte >= 100){

            energyBlockedUntil =
                Date.now()+20000;

            state.charlotte = 30;

            snd("charlotteAudio");

            status(
                "Шарлота отключила питание окна на 20 секунд!"
            );
        }
    }


    /* ДЕЛЬТА */

    if(
        active("delta") &&
        elapsed >= 120
    ){

        state.delta += .045;

        if(state.delta >= 100){

            if(incineratorPowered()){

                state.delta = 20;

                snd("incineratorAudio");

                status(
                    "Дельта отпугнута сжигателем."
                );

            }else{

                lose(
                    "Дельта пробралась через вентиляцию."
                );

                return;
            }
        }
    }


    /* ЛИЗКА */

    if(active("lizka")){

        state.lizka += .035;

        if(state.lizka >= 100){

            if(fencePowered()){

                state.lizka = 20;

                status(
                    "Электрозабор остановил Лизку."
                );

            }else{

                lose(
                    "Лизка добралась до резервного питания."
                );

                return;
            }
        }
    }


    /* МАЙНДФЛЕИЕР */

    if(active("mindflayer")){

        state.mindflayer += .03;

        if(state.mindflayer >= 100){

            openMindPanel();
        }
    }


    renderAI();
}


/* =========================
   ОТОБРАЖЕНИЕ ВРАГОВ
========================= */

function renderAI(){

    hideEnemy("lichi");
    hideEnemy("pancake");
    hideEnemy("nemka");
    hideEnemy("delta");
    hideEnemy("kyu");
    hideEnemy("kashatan");
    hideEnemy("charlotte");
    hideEnemy("lizka");
    hideEnemy("mindflayer");


    /* ЛИЧИ */

    if(
        view === "left" &&
        active("lichi") &&
        state.lichi > 35
    ){

        showEnemy(
            "lichi",
            "45%",
            "55%"
        );
    }


    /* ПАНКЕЙК */

    if(
        view === "front" &&
        active("pancake") &&
        state.pancake > 85
    ){

        /*
            Панкейк теперь показывается
            только в нижней вентиляции,
            а не в центре экрана.
        */

        if(lowerVentOpen){

            $("lowerVentPancake")
                .style
                .display = "block";
        }
    }


    /* НЕМКА */

    if(
        view === "right" &&
        active("nemka") &&
        backupDone &&
        state.nemka > 60
    ){

        showEnemy(
            "nemka",
            "78%",
            "50%"
        );
    }


    /* КЬЮ */

    if(
        view === "right" &&
        active("kyu") &&
        state.kyu > 55
    ){

        showEnemy(
            "kyu",
            "70%",
            "55%"
        );
    }


    /* КАШТАН */

    if(
        view === "rear" &&
        active("kashatan") &&
        state.kashatan > 40
    ){

        showEnemy(
            "kashatan",
            "50%",
            "48%"
        );
    }


    /* ШАРЛОТА */

    if(
        view === "rear" &&
        active("charlotte") &&
        state.charlotte > 40
    ){

        showEnemy(
            "charlotte",
            "55%",
            "45%"
        );
    }


    /* ДЕЛЬТА */

    if(
        upperVentOpen &&
        active("delta") &&
        state.delta > 20
    ){

        $("upperVentDelta")
            .style
            .display = "block";
    }else{

        $("upperVentDelta")
            .style
            .display = "none";
    }


    /* ЛИЗКА */

    if(
        active("lizka") &&
        view === "rear" &&
        state.lizka > 60
    ){

        showEnemy(
            "lizka",
            "35%",
            "55%"
        );
    }
}


function hideEnemy(id){

    const el = $(id);

    if(el)
        el.style.display = "none";
}


function showEnemy(
    id,
    left,
    top
){

    const el = $(id);

    if(!el) return;

    el.style.display = "block";

    el.style.left = left;

    el.style.top = top;
}


/* =========================
   СТАТУС
========================= */

function status(text){

    $("status")
        .textContent = text;
}


/* =========================
   НЕМКА
========================= */

function powerOff(){

    if(backupDone) return;

    snd("powerOffAudio");

    $("backupPanel")
        .classList
        .remove("hidden");

    status(
        "НЕМКА ОТКЛЮЧИЛА ОСНОВНОЕ ПИТАНИЕ!"
    );
}


/* =========================
   ЭНЕРГИЯ
========================= */

function windowPowered(){

    return (
        energy === "window" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


function fencePowered(){

    return (
        energy === "fence" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


function incineratorPowered(){

    return (
        energy === "incinerator" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


function doorPowered(){

    return (
        energy === "door" &&
        !energyBusy
    );
}


/* =========================
   ВСПЫШКА
========================= */

function flash(){

    if(!playing) return;

    if(flashBusy){

        status(
            "ВСПЫШКА ПЕРЕЗАРЯЖАЕТСЯ."
        );

        return;
    }

    if(energy !== "camera"){

        status(
            "Вспышка не работает: камеры без питания."
        );

        return;
    }

    flashBusy = true;

    const button =
        $("flashButton");

    button.classList.add(
        "cooldown"
    );

    snd("flashAudio");

    $("flash").style.opacity = "1";

    setTimeout(()=>{

        $("flash").style.opacity = "0";

    },120);


    /*
        ЛИЧИ
    */

    if(
        active("lichi") &&
        state.lichi > 20
    ){

        state.lichi =
            Math.max(
                0,
                state.lichi - 50
            );

        status(
            "ВСПЫШКА ОТПУГНУЛА ЛИЧИ!"
        );
    }


    /*
        КЬЮ
        Вспышка немного отбрасывает его.
    */

    if(
        active("kyu") &&
        state.kyu > 30
    ){

        state.kyu =
            Math.max(
                0,
                state.kyu - 20
            );

        status(
            "Вспышка замедлила Кью."
        );
    }


    /*
        КАШТАН
    */

    if(
        active("kashatan") &&
        state.kashatan > 35 &&
        view === "rear"
    ){

        state.kashatan =
            Math.max(
                0,
                state.kashatan - 25
            );

        status(
            "Вспышка ослепила Каштана."
        );
    }


    /*
        ШАРЛОТА
    */

    if(
        active("charlotte") &&
        state.charlotte > 35 &&
        view === "rear"
    ){

        state.charlotte =
            Math.max(
                0,
                state.charlotte - 20
            );

        status(
            "Вспышка задержала Шарлоту."
        );
    }


    /*
        ЛИЗКА
    */

    if(
        active("lizka") &&
        state.lizka > 40
    ){

        state.lizka =
            Math.max(
                0,
                state.lizka - 15
            );

        status(
            "Вспышка задержала Лизку."
        );
    }


    /*
        НЕМКА
    */

    if(
        active("nemka") &&
        state.nemka > 35 &&
        !backupDone
    ){

        state.nemka =
            Math.max(
                0,
                state.nemka - 15
            );

        status(
            "Вспышка задержала Немку."
        );
    }


    renderAI();

    setTimeout(()=>{

        flashBusy = false;

        button.classList.remove(
            "cooldown"
        );

    },FLASH_COOLDOWN);
}


/* =========================
   КАМЕРЫ
========================= */

function openCamera(){

    if(energy !== "camera"){

        status(
            "Камеры не получают питание!"
        );

        return;
    }

    $("cameraPanel")
        .classList
        .remove("hidden");

    updateCamera();
}


function updateCamera(){

    $("cameraNumber")
        .textContent =
        camera.toUpperCase();

    qa(
        "#cameraMap button[data-camera]"
    ).forEach(
        x =>
            x.classList.toggle(
                "energyTargetActive",
                x.dataset.camera === camera
            )
    );


    $("cameraImage")
        .style
        .backgroundImage =
        `url("images/${camera}.png")`;


    $("cameraLichi")
        .style
        .display =
        active("lichi") &&
        camera === "cam02" &&
        state.lichi > 15
            ? "block"
            : "none";


    $("cameraPancake")
        .style
        .display =
        active("pancake") &&
        camera === "cam04" &&
        state.pancake > 15
            ? "block"
            : "none";


    $("cameraKyu")
        .style
        .display =
        active("kyu") &&
        camera === "cam05" &&
        state.kyu > 20
            ? "block"
            : "none";


    $("cameraKashatan")
        .style
        .display =
        active("kashatan") &&
        camera === "cam06" &&
        state.kashatan > 20
            ? "block"
            : "none";


    $("cameraCharlotte")
        .style
        .display =
        active("charlotte") &&
        state.charlotte > 20
            ? "block"
            : "none";


    $("cameraLizka")
        .style
        .display =
        active("lizka") &&
        camera === "cam07" &&
        state.lizka > 20
            ? "block"
            : "none";


    $("cameraNemka")
        .style
        .display =
        active("nemka") &&
        state.nemka > 20
            ? "block"
            : "none";


    let eyeCamera =
        "cam0" +
        Math.max(
            1,
            Math.min(
                7,
                Math.ceil(
                    state.nemka / 12
                )
            )
        );

    $("cameraNemkaEyes")
        .classList
        .toggle(
            "nemkaEyesActive",
            active("nemka") &&
            state.nemka > 35 &&
            camera === eyeCamera
        );


    $("catMessage")
        .textContent =
        "Текущая камера: " +
        camera.toUpperCase();
}


/* =========================
   МЯУКАНЬЕ
========================= */

function meow(){

    if(energy !== "camera"){

        status(
            "Камеры обесточены."
        );

        return;
    }

    snd("catAudio");

    if(
        active("nemka") &&
        state.nemka > 10 &&
        state.nemka < 95
    ){

        state.nemka =
            Math.max(
                0,
                state.nemka - 30
            );

        $("catMessage")
            .textContent =
            "НЕМКА ОТВЛЕЧЕНА!";

        status(
            "Немка пошла на мяуканье."
        );

    }else{

        $("catMessage")
            .textContent =
            "Мяуканье воспроизведено.";
    }

    updateCamera();
    renderAI();
}


/* =========================
   СИРЕНА
========================= */

function alarm(){

    if(energy !== "camera"){

        status(
            "Сирена не работает без энергии."
        );

        return;
    }

    snd("alarmAudio");

    if(
        active("charlotte") &&
        state.charlotte > 10
    ){

        state.charlotte =
            Math.max(
                0,
                state.charlotte - 55
            );

        $("alarmMessage")
            .textContent =
            "Шарлота отвлечена!";

        status(
            "СИРЕНА ОТВЛЕКЛА ШАРЛОТУ!"
        );

    }else{

        $("alarmMessage")
            .textContent =
            "Сирена активирована.";
    }

    renderAI();
}


/* =========================
   ВЕНТИЛЯЦИЯ
========================= */

let upperVentOpen = false;

let lowerVentOpen = false;


function upperVent(){

    if(
        !active("delta") ||
        elapsed < 120
    ){

        status(
            "Верхняя шахта пока недоступна."
        );

        return;
    }

    upperVentOpen =
        !upperVentOpen;

    $("upperVent")
        .classList
        .toggle(
            "upperVentActive",
            upperVentOpen
        );

    if(upperVentOpen){

        status(
            "ВЕРХНЯЯ ШАХТА"
        );

    }else{

        status(
            "ОФИС"
        );
    }

    renderAI();
}


function lowerVent(){

    if(
        !active("pancake") ||
        elapsed < 120
    ){

        status(
            "Нижняя вентиляция не активна."
        );

        return;
    }

    lowerVentOpen =
        !lowerVentOpen;

    $("lowerVent")
        .style
        .display =
        lowerVentOpen
            ? "block"
            : "none";

    if(lowerVentOpen){

        $("lowerVentPancake")
            .style
            .display =
            state.pancake > 25
                ? "block"
                : "none";

        status(
            "ВЫ ОТКРЫЛИ ВЕНТИЛЯЦИЮ."
        );

    }else{

        status(
            "ВЕНТИЛЯЦИЯ ЗАКРЫТА."
        );
    }

    renderAI();
}


/* =========================
   СЖИГАТЕЛЬ
========================= */

function burn(){

    if(!incineratorPowered()){

        status(
            "Сначала направьте энергию на сжигатель."
        );

        return;
    }

    snd("incineratorAudio");

    if(active("delta")){

        state.delta =
            Math.max(
                0,
                state.delta - 70
            );

        status(
            "Дельта отпугнута огнём!"
        );
    }
}


/* =========================
   ЗАДНЕЕ ОКНО
========================= */

function rear(){

    setView("rear");

    $("backWindow")
        .style
        .display = "block";

    setTimeout(()=>{

        if(view !== "rear"){

            $("backWindow")
                .style
                .display = "none";
        }

    },200);
}


/* =========================
   ПРАВАЯ ДВЕРЬ
========================= */

function closeRight(){

    /*
        Дверь можно закрыть
        только если энергия направлена
        на правую дверь.
    */

    if(!doorPowered()){

        status(
            "Дверь не получает электричество!"
        );

        return;
    }

    rightDoorClosed =
        !rightDoorClosed;

    $("rightDoor")
        .classList
        .toggle(
            "closed",
            rightDoorClosed
        );

    $("rightDoorButton")
        .textContent =
        rightDoorClosed
            ? "ОТКРЫТЬ"
            : "ЗАКРЫТЬ";

    $("doorStatus")
        .textContent =
        rightDoorClosed
            ? "ПРАВАЯ ДВЕРЬ: ЗАКРЫТА"
            : "ПРАВАЯ ДВЕРЬ: ОТКРЫТА";

    status(
        rightDoorClosed
            ? "ПРАВАЯ ДВЕРЬ ЗАКРЫТА"
            : "ПРАВАЯ ДВЕРЬ ОТКРЫТА"
    );
}


/* =========================
   ПОВОРОТЫ
========================= */

function setView(v){

    view = v;

    $("officeImage")
        .style
        .display =
        v === "front"
            ? "block"
            : "none";

    $("leftOffice")
        .style
        .display =
        v === "left"
            ? "block"
            : "none";

    $("rightOffice")
        .style
        .display =
        v === "right"
            ? "block"
            : "none";

    $("backWindow")
        .style
        .display =
        v === "rear"
            ? "block"
            : "none";


    if(v === "left"){

        status(
            "ЛЕВЫЙ КОРИДОР"
        );

    }else if(v === "right"){

        status(
            "ПРАВЫЙ КОРИДОР"
        );

    }else if(v === "rear"){

        status(
            "ЗАДНЕЕ ОКНО"
        );

    }else{

        status(
            "ОФИС"
        );
    }


    $("rearWindowButton")
        .style
        .display =
        v === "rear" &&
        active("kashatan")
            ? "block"
            : "none";


    $("upperVentButton")
        .style
        .display =
        v === "front" &&
        active("delta") &&
        elapsed >= 120
            ? "block"
            : "none";


    $("lowerVentButton")
        .style
        .display =
        v === "front" &&
        active("pancake") &&
        elapsed >= 120
            ? "block"
            : "none";


    $("incineratorButton")
        .style
        .display =
        v === "front" &&
        active("delta") &&
        elapsed >= 120
            ? "block"
            : "none";


    updateEnergyUI();

    renderAI();
}


/* =========================
   ЭНЕРГИЯ
========================= */

function selectEnergy(target){

    if(
        Date.now() <
        energyBlockedUntil
    ){

        status(
            "Питание временно заблокировано."
        );

        return;
    }

    /*
        ВАЖНО:
        выбор цели НЕ переносит энергию.
        Только устанавливает выбранную цель
        для последующего рычага.
    */

    selectedEnergyTarget = target;

    updateEnergyUI();

    status(
        "Выбрано: " +
        energyName(target) +
        ". Потяните рычаг 2 секунды."
    );
}


let selectedEnergyTarget = "camera";


function energyName(target){

    const names = {

        camera:"КАМЕРЫ",

        window:"ЗАДНЕЕ ОКНО",

        incinerator:"СЖИГАТЕЛЬ",

        door:"ПРАВАЯ ДВЕРЬ",

        fence:"ЭЛЕКТРОЗАБОР",

        vent:"ВЕНТИЛЯЦИЯ"
    };

    return names[target] || target;
}


function updateEnergyUI(){

    $("energyTargetText")
        .textContent =
        energyName(energy);


    $("energyMessage")
        .textContent =
        "Сейчас энергия направлена на " +
        energyName(energy).toLowerCase() +
        ".";


    qa(
        "#energyTargets button"
    ).forEach(button=>{

        button.classList.toggle(
            "energyTargetActive",
            button.dataset.energy ===
            selectedEnergyTarget
        );
    });


    $("powerStatus")
        .textContent =
        "⚡ ПИТАНИЕ: " +
        energyName(energy);
}


/* =========================
   РЫЧАГ
========================= */

function leverDown(){

    if(energyBusy) return;

    if(
        selectedEnergyTarget === energy
    ){

        status(
            "Энергия уже направлена сюда."
        );

        return;
    }

    if(
        Date.now() <
        energyBlockedUntil
    ){

        status(
            "Перенаправление временно заблокировано."
        );

        return;
    }

    leverStart =
        Date.now();

    energyBusy = true;

    const loop =
        setInterval(()=>{

            if(!energyBusy){

                clearInterval(loop);

                return;
            }

            let progress =
                Math.min(
                    100,
                    (
                        Date.now() -
                        leverStart
                    ) / 20
                );

            $("leverProgressBar")
                .style
                .width =
                progress + "%";


            if(progress >= 100){

                clearInterval(loop);

                energy =
                    selectedEnergyTarget;

                energyBusy = false;

                $("leverProgressBar")
                    .style
                    .width = "0%";

                updateEnergyUI();

                status(
                    "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА НА " +
                    energyName(energy)
                );
            }

        },30);
}


/* =========================
   РЕЗЕРВНЫЕ ПРОВОДА
========================= */

function backupWire(number){

    number =
        Number(number);

    if(
        number ===
        wireStep + 1
    ){

        wireStep++;

        q(
            `[data-wire="${number}"]`
        )
        .classList
        .add("wireSelected");


        if(wireStep === 4){

            backupDone = true;

            $("backupPanel")
                .classList
                .add("hidden");

            state.nemka = 65;

            snd("backupAudio");

            status(
                "РЕЗЕРВНАЯ СИСТЕМА ЗАПУЩЕНА!"
            );
        }

    }else{

        wireStep = 0;

        qa(
            "#backupWires button"
        ).forEach(
            x =>
                x.classList
                .remove("wireSelected")
        );

        $("backupMessage")
            .textContent =
            "Ошибка! Начните заново.";
    }
}


/* =========================
   МАЙНДФЛЕИЕР
========================= */

function openMindPanel(){

    if(
        !$("mindflayerPanel")
        .classList
        .contains("hidden")
    ){

        return;
    }

    $("mindflayerPanel")
        .classList
        .remove("hidden");

    mindLevel = 70;

    updateMind();

    clearInterval(mindTimer);

    snd("mindflayerAudio");

    mindTimer =
        setInterval(()=>{

            mindLevel -= .8;

            if(mindLevel <= 0){

                mindLevel = 0;

                clearInterval(
                    mindTimer
                );

                $("mindflayerPanel")
                    .classList
                    .add("hidden");

                state.mindflayer = 15;

                status(
                    "Майндфлеиер полностью замедлен."
                );
            }

            updateMind();

        },500);
}


function updateMind(){

    $("mindflayerBarFill")
        .style
        .width =
        mindLevel + "%";


    $("mindflayerMessage")
        .textContent =
        "СКОРОСТЬ: " +
        Math.round(mindLevel) +
        "%";
}


/* =========================
   GAME OVER
========================= */

function lose(reason){

    if(!playing) return;

    playing = false;

    clearInterval(timer);

    clearInterval(mindTimer);

    stop("humAudio");

    $("loseReason")
        .textContent =
        reason;

    $("gameOver")
        .classList
        .remove("hidden");
}


/* =========================
   ПОБЕДА
========================= */

function win(){

    if(!playing) return;

    playing = false;

    clearInterval(timer);

    clearInterval(mindTimer);

    stop("humAudio");

    let unlocked =
        Math.min(
            13,
            night + 1
        );

    localStorage.setItem(
        "bgnUnlocked",
        unlocked
    );

    $("winText")
        .textContent =
        "NIGHT " +
        night +
        " COMPLETE";

    $("nextNight")
        .style
        .display =
        night < 13
            ? "block"
            : "none";

    $("winScreen")
        .classList
        .remove("hidden");
}


/* =========================
   НОЧИ
========================= */

function fillNights(){

    let unlocked =
        Number(
            localStorage.getItem(
                "bgnUnlocked"
            ) || 1
        );

    $("nightsList")
        .innerHTML = "";


    for(
        let i=1;
        i<=13;
        i++
    ){

        let button =
            document.createElement(
                "button"
            );

        button.className =
            "nightButton" +
            (
                i > unlocked
                    ? " locked"
                    : ""
            );

        button.textContent =
            "NIGHT " + i;

        button.disabled =
            i > unlocked;

        button.onclick =
            () => start(i);

        $("nightsList")
            .appendChild(button);
    }
}


/* =========================
   МЕНЮ
========================= */

$("startGameButton").onclick =
    () =>
        start(
            Number(
                localStorage.getItem(
                    "bgnUnlocked"
                ) || 1
            )
        );


$("nightsButton").onclick =
    () => {

        fillNights();

        hideAll();

        $("nightsMenu")
            .classList
            .remove("hidden");
    };


$("closeNights").onclick =
    menu;


$("settingsButton").onclick =
    () => {

        hideAll();

        $("settingsMenu")
            .classList
            .remove("hidden");
    };


$("closeSettings").onclick =
    menu;


$("skipPhoneButton").onclick =
    begin;


$("fullscreenButton").onclick =
    () => {

        document
            .documentElement
            .requestFullscreen?.();
    };


$("resetProgress").onclick =
    () => {

        localStorage.removeItem(
            "bgnUnlocked"
        );

        fillNights();

        alert(
            "Прогресс сброшен."
        );
    };


/* =========================
   КАМЕРЫ
========================= */

$("cameraButton").onclick =
    openCamera;


$("closeCameraPanel").onclick =
    () =>
        $("cameraPanel")
        .classList
        .add("hidden");


/* =========================
   ЭНЕРГИЯ
========================= */

$("energyButton").onclick =
    () => {

        updateEnergyUI();

        $("energyPanel")
            .classList
            .remove("hidden");
    };


$("closeEnergyPanel").onclick =
    () =>
        $("energyPanel")
        .classList
        .add("hidden");


/* =========================
   ВСПЫШКА
========================= */

$("flashButton").onclick =
    flash;


/* =========================
   ПОВОРОТЫ
========================= */

$("leftButton").onclick =
    () =>
        setView("left");


$("frontButton").onclick =
    () =>
        setView("front");


$("rightButton").onclick =
    () =>
        setView("right");


/* =========================
   ДВЕРЬ
========================= */

$("rightDoorButton").onclick =
    closeRight;


/*
   Левая кнопка специально
   ничего не закрывает.
*/

$("leftDoorButton").onclick =
    () =>
        status(
            "ЛЕВАЯ ДВЕРЬ ОТКРЫТА."
        );


/* =========================
   ШАХТЫ
========================= */

$("upperVentButton").onclick =
    upperVent;


$("lowerVentButton").onclick =
    lowerVent;


$("incineratorButton").onclick =
    burn;


$("rearWindowButton").onclick =
    rear;


/* =========================
   МЯУКАНЬЕ
========================= */

$("catMeowButton").onclick =
    meow;


/* =========================
   СИРЕНА
========================= */

$("cameraAlarmButton").onclick =
    alarm;


/* =========================
   КАМЕРЫ
========================= */

qa(
    "#cameraMap button[data-camera]"
).forEach(button=>{

    button.onclick =
        () => {

            camera =
                button.dataset.camera;

            updateCamera();
        };
});


/* =========================
   ЭНЕРГИЯ
========================= */

qa(
    "#energyTargets button"
).forEach(button=>{

    button.onclick =
        () =>
            selectEnergy(
                button.dataset.energy
            );
});


/* =========================
   ПРОВОДА
========================= */

qa(
    "#backupWires button"
).forEach(button=>{

    button.onclick =
        () =>
            backupWire(
                button.dataset.wire
            );
});


/* =========================
   РЫЧАГ
========================= */

$("lever")
    .addEventListener(
        "pointerdown",
        leverDown
    );


/* =========================
   МАЙНДФЛЕИЕР
========================= */

$("slowMindflayer").onclick =
    () => {

        mindLevel =
            Math.max(
                0,
                mindLevel - 18
            );

        updateMind();

        if(mindLevel <= 0){

            clearInterval(
                mindTimer
            );

            $("mindflayerPanel")
                .classList
                .add("hidden");

            state.mindflayer = 10;

            status(
                "Майндфлеиер остановлен!"
            );
        }
    };


$("fastMindflayer").onclick =
    () => {

        mindLevel =
            Math.min(
                100,
                mindLevel + 15
            );

        updateMind();
    };


/* =========================
   GAME OVER
========================= */

$("restart").onclick =
    () =>
        begin();


$("menuAfterLose").onclick =
    menu;


/* =========================
   ПОБЕДА
========================= */

$("nextNight").onclick =
    () =>
        start(
            Math.min(
                13,
                night + 1
            )
        );


$("menuAfterWin").onclick =
    menu;


/* =========================
   ИНИЦИАЛИЗАЦИЯ
========================= */

fillNights();

updateEnergyUI();

updateClock();

setView("front");
