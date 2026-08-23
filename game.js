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
let leftDoorClosed = false;

let wireStep = 0;

let timer = null;
let mindTimer = null;

let elapsed = 0;
let mindLevel = 70;


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

    1:["lichi"],

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
   ЗВУКИ
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
   МЕНЮ
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
    leftDoorClosed = false;

    wireStep = 0;

    mindLevel = 70;

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


    $("rightDoor")
        .classList
        .remove("closed");

    $("leftDoor")
        .classList
        .remove("closed");


    $("doorStatus")
        .textContent =
        "ПРАВАЯ ДВЕРЬ: ОТКРЫТА";


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


    $("upperVentButton")
        .style
        .display = "none";


    $("lowerVentButton")
        .style
        .display = "none";


    $("incineratorButton")
        .style
        .display = "none";


    $("backWindow")
        .style
        .display = "none";


    $("windowElectricity")
        .style
        .display = "none";


    qa("#backupWires button")
        .forEach(
            x =>
            x.classList.remove(
                "wireSelected"
            )
        );


    updateEnergyUI();

    setView("front");

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

            if(!playing)
                return;


            elapsed =
                Math.floor(
                    (
                        Date.now() -
                        startTime
                    ) / 1000
                );


            updateClock();

            updateAI();


            if(elapsed >= 360){

                win();

            }

        },250);
}


function updateClock(){

    let hour =
        Math.floor(
            elapsed / 60
        );

    let minute =
        elapsed % 60;


    let displayHour =
        hour === 0
            ? 12
            : hour;


    $("time")
        .textContent =
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

    if(!playing)
        return;


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
                rightDoorClosed &&
                energy === "door"
            ){

                state.nemka = 30;

                status(
                    "Немка отступила от двери."
                );

            }else{

                lose(
                    "Немка добралась до правой двери."
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
                energy === "vent"
            ){

                state.pancake = 25;

                status(
                    "Вентиляция остановила Панкейка."
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

        let speed =
            state.kyu > 70
                ? .075
                : .025;

        state.kyu += speed;


        if(state.kyu >= 100){

            if(
                rightDoorClosed &&
                energy === "door"
            ){

                state.kyu = 20;

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
                    "Электрическое окно отпугнуло Каштана!"
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
                Date.now() + 20000;

            state.charlotte = 30;

            status(
                "Шарлота заблокировала питание окна на 20 секунд!"
            );

            snd("charlotteAudio");
        }
    }


    /* ДЕЛЬТА */

    if(
        active("delta") &&
        elapsed >= 120
    ){

        state.delta += .045;


        if(state.delta >= 100){

            if(
                incineratorPowered()
            ){

                state.delta = 20;

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

        showVentControls();
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
   ВРАГИ
========================= */

function renderAI(){

    hideEnemy("lichi");
    hideEnemy("pancake");
    hideEnemy("nemka");
    hideEnemy("kyu");
    hideEnemy("kashatan");
    hideEnemy("charlotte");
    hideEnemy("lizka");
    hideEnemy("mindflayer");


    /* ЛИЧИ */

    if(
        view === "left" &&
        active("lichi") &&
        state.lichi > 50
    ){

        showEnemy(
            "lichi",
            "45%",
            "55%"
        );
    }


    /* ПАНКЕЙК — ТОЛЬКО В ВЕНТИЛЯЦИИ */

    if(
        active("pancake") &&
        elapsed >= 120 &&
        state.pancake > 20
    ){

        $("lowerVent")
            .style
            .display = "block";

        $("lowerVentPancake")
            .style
            .display = "block";

    }else{

        $("lowerVent")
            .style
            .display = "none";
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
        state.kyu > 45
    ){

        showEnemy(
            "kyu",
            "62%",
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
            "52%",
            "45%"
        );
    }


    /* ЛИЗКА */

    if(
        view === "front" &&
        active("lizka") &&
        state.lizka > 60
    ){

        showEnemy(
            "lizka",
            "25%",
            "45%"
        );
    }


    /* МАЙНДФЛЕИЕР */

    if(
        view === "rear" &&
        active("mindflayer") &&
        state.mindflayer > 60
    ){

        showEnemy(
            "mindflayer",
            "50%",
            "50%"
        );
    }


    /* ДЕЛЬТА В ВЕРХНЕЙ ШАХТЕ */

    if(
        view === "front" &&
        active("delta") &&
        elapsed >= 120 &&
        state.delta > 35
    ){

        $("upperVentButton")
            .style
            .display = "block";
    }
}


function showEnemy(id,left,top){

    const enemy = $(id);

    enemy.style.display =
        "block";

    enemy.style.left = left;
    enemy.style.top = top;
}


function hideEnemy(id){

    const enemy = $(id);

    if(enemy)
        enemy.style.display =
            "none";
}


/* =========================
   СТАТУС
========================= */

function status(text){

    $("status")
        .textContent = text;
}


/* =========================
   ПИТАНИЕ
========================= */

function powerOff(){

    if(backupDone)
        return;


    snd("powerOffAudio");


    $("backupPanel")
        .classList
        .remove("hidden");


    status(
        "ОСНОВНОЕ ПИТАНИЕ ОТКЛЮЧЕНО"
    );
}


/* =========================
   ЭНЕРГИЯ
========================= */

function windowPowered(){

    return(
        energy === "window" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


function fencePowered(){

    return(
        energy === "fence" &&
        !energyBusy
    );
}


function incineratorPowered(){

    return(
        energy === "incinerator" &&
        !energyBusy
    );
}


/* =========================
   ЭНЕРГИЯ ДВЕРИ
========================= */

function doorPowered(){

    return(
        energy === "door" &&
        !energyBusy
    );
}


/* =========================
   МАЙНДФЛЕИЕР
========================= */

function openMindPanel(){

    if(
        !$("mindflayerPanel")
            .classList
            .contains("hidden")
    )
        return;


    $("mindflayerPanel")
        .classList
        .remove("hidden");


    mindLevel = 70;

    updateMind();


    clearInterval(mindTimer);


    mindTimer =
        setInterval(()=>{

            mindLevel -= 1.1;


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

    $("mindBarFill")
        .style
        .width =
        mindLevel + "%";


    $("mindMessage")
        .textContent =
        "Скорость: " +
        (
            mindLevel > 55
                ? "высокая"
                : mindLevel > 25
                    ? "средняя"
                    : "низкая"
        );
}


/* =========================
   ВЕНТИЛЯЦИЯ
========================= */

function showVentControls(){

    if(
        !active("delta") ||
        elapsed < 120
    )
        return;


    $("upperVentButton")
        .style
        .display = "block";


    $("incineratorButton")
        .style
        .display = "block";
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

        status("ОФИС");
    }


    renderAI();

    updateWindowElectricity();
}


/* =========================
   ВСПЫШКА
========================= */

function flash(){

    snd("flashAudio");


    $("flash")
        .style
        .opacity = 1;


    setTimeout(()=>{

        $("flash")
            .style
            .opacity = 0;

    },100);


    if(
        active("lichi") &&
        state.lichi > 30
    ){

        state.lichi =
            Math.max(
                0,
                state.lichi - 50
            );


        status(
            "Личи отпугнута вспышкой."
        );
    }
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

    const button =
        q(
            `[data-camera="${camera}"]`
        );


    qa(
        "#cameraMap button[data-camera]"
    ).forEach(
        x =>
        x.classList.remove(
            "energyTargetActive"
        )
    );


    if(button){

        button.classList.add(
            "energyTargetActive"
        );
    }


    $("cameraNumber")
        .textContent =
        camera.toUpperCase();


    $("cameraImage")
        .style
        .backgroundImage =
        `url("images/${camera}.png")`;


    showCameraEnemy(
        "cameraLichi",
        active("lichi") &&
        camera === "cam02" &&
        state.lichi > 20
    );


    showCameraEnemy(
        "cameraPancake",
        active("pancake") &&
        camera === "cam04" &&
        state.pancake > 15
    );


    showCameraEnemy(
        "cameraKyu",
        active("kyu") &&
        camera === "cam03" &&
        state.kyu > 20
    );


    showCameraEnemy(
        "cameraKashatan",
        active("kashatan") &&
        camera === "cam05" &&
        state.kashatan > 20
    );


    showCameraEnemy(
        "cameraCharlotte",
        active("charlotte") &&
        camera === "cam06" &&
        state.charlotte > 20
    );


    showCameraEnemy(
        "cameraLizka",
        active("lizka") &&
        camera === "cam07" &&
        state.lizka > 20
    );


    showCameraEnemy(
        "cameraNemka",
        active("nemka") &&
        camera === "cam01" &&
        state.nemka > 35
    );


    showCameraEnemy(
        "cameraDelta",
        active("delta") &&
        camera === "cam07" &&
        elapsed >= 120 &&
        state.delta > 20
    );


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


function showCameraEnemy(id,show){

    $(id).style.display =
        show
            ? "block"
            : "none";
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
        state.nemka < 90
    ){

        state.nemka =
            Math.max(
                0,
                state.nemka - 30
            );


        $("catMessage")
            .textContent =
            "Немка отвлечена мяуканьем!";


        status(
            "Немка отвлечена."
        );

    }else{

        $("catMessage")
            .textContent =
            "Мяуканье воспроизведено.";
    }


    updateCamera();
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
        state.charlotte > 10 &&
        state.charlotte < 100
    ){

        state.charlotte =
            Math.max(
                0,
                state.charlotte - 50
            );


        $("alarmMessage")
            .textContent =
            "Шарлота отвлечена!";


        status(
            "СИРЕНА: Шарлота отвлечена!"
        );
    }
}


/* =========================
   ВЕРХНЯЯ ШАХТА
========================= */

function upperVent(){

    if(elapsed < 120){

        status(
            "Верхняя шахта пока закрыта."
        );

        return;
    }


    $("upperVent")
        .classList
        .toggle(
            "upperVentActive"
        );


    if(
        $("upperVent")
            .classList
            .contains(
                "upperVentActive"
            )
    ){

        status(
            "ВЕРХНЯЯ ШАХТА"
        );

    }else{

        status("ОФИС");
    }
}


/* =========================
   НИЖНЯЯ ВЕНТИЛЯЦИЯ
========================= */

function lowerVent(){

    if(
        active("pancake") &&
        state.pancake > 20
    ){

        if(energy === "vent"){

            state.pancake =
                Math.max(
                    0,
                    state.pancake - 60
                );

            status(
                "Вентиляция остановила Панкейка."
            );

        }else{

            status(
                "Для блокировки вентиляции нужна энергия."
            );
        }
    }
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
                state.delta - 65
            );
    }


    status(
        "Мусор сожжён. Дельта отступает."
    );
}


/* =========================
   ПРАВАЯ ДВЕРЬ
========================= */

function closeRight(){

    /*
       ГЛАВНОЕ ИЗМЕНЕНИЕ:

       дверь вообще не закрывается,
       если энергия не направлена
       на дверь.
    */

    if(!doorPowered()){

        status(
            "НЕТ ЭНЕРГИИ ДЛЯ ПРАВОЙ ДВЕРИ!"
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
   ЛЕВАЯ ДВЕРЬ
========================= */

function closeLeft(){

    if(energy !== "door"){

        status(
            "НЕТ ЭНЕРГИИ ДЛЯ ДВЕРИ!"
        );

        return;
    }


    leftDoorClosed =
        !leftDoorClosed;


    $("leftDoor")
        .classList
        .toggle(
            "closed",
            leftDoorClosed
        );
}


/* =========================
   ЭНЕРГИЯ
========================= */

function selectEnergy(target){

    if(
        target === "window" &&
        Date.now() < energyBlockedUntil
    ){

        status(
            "ПИТАНИЕ ОКНА ЗАБЛОКИРОВАНО!"
        );

        return;
    }


    energy = target;

    updateEnergyUI();

    updateWindowElectricity();


    if(target === "door"){

        status(
            "ЭНЕРГИЯ НАПРАВЛЕНА НА ДВЕРЬ."
        );
    }
}


function updateEnergyUI(){

    const names = {

        camera:"КАМЕРЫ",

        window:"ЗАДНЕЕ ОКНО",

        incinerator:"СЖИГАТЕЛЬ",

        door:"ПРАВАЯ ДВЕРЬ",

        fence:"ЭЛЕКТРОЗАБОР",

        vent:"ВЕНТИЛЯЦИЯ"
    };


    $("energyTargetText")
        .textContent =
        names[energy];


    $("energyMessage")
        .textContent =
        "Энергия направлена на " +
        names[energy].toLowerCase() +
        ".";


    qa(
        "#energyTargets button"
    ).forEach(button=>{

        button.classList.toggle(
            "energyTargetActive",
            button.dataset.energy === energy
        );

    });


    $("powerStatus")
        .textContent =
        "⚡ ЭНЕРГИЯ: " +
        names[energy];
}


function updateWindowElectricity(){

    $("windowElectricity")
        .style
        .display =
        energy === "window" &&
        view === "rear" &&
        Date.now() >= energyBlockedUntil
            ? "block"
            : "none";
}


/* =========================
   РЫЧАГ
========================= */

function leverDown(){

    if(energyBusy)
        return;


    leverStart =
        Date.now();

    energyBusy = true;


    const loop =
        setInterval(()=>{

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

                energyBusy = false;


                $("leverProgressBar")
                    .style
                    .width =
                    "0%";


                updateEnergyUI();

                updateWindowElectricity();


                status(
                    "Перенаправление завершено."
                );
            }

        },30);
}


/* =========================
   РЕЗЕРВ
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
                "Резервная система запущена!"
            );
        }


    }else{

        wireStep = 0;


        qa(
            "#backupWires button"
        ).forEach(
            x =>
            x.classList.remove(
                "wireSelected"
            )
        );


        $("backupMessage")
            .textContent =
            "Ошибка! Начните заново.";
    }
}


/* =========================
   GAME OVER
========================= */

function lose(reason){

    if(!playing)
        return;


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

    if(!playing)
        return;


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


$("catMeowButton").onclick =
    meow;


$("cameraAlarmButton").onclick =
    alarm;


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
   РЫЧАГ
========================= */

$("lever")
    .addEventListener(
        "pointerdown",
        leverDown
    );


/* =========================
   ДВЕРИ
========================= */

$("rightDoorButton").onclick =
    closeRight;


$("leftDoorButton").onclick =
    closeLeft;


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
   ВСПЫШКА
========================= */

$("flashButton").onclick =
    flash;


/* =========================
   ШАХТЫ
========================= */

$("upperVentButton").onclick =
    upperVent;


$("lowerVentButton").onclick =
    lowerVent;


$("incineratorButton").onclick =
    burn;


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
   МАЙНДФЛЕИЕР
========================= */

$("mindSlow").onclick =
    () => {

        mindLevel =
            Math.max(
                0,
                mindLevel - 15
            );


        updateMind();


        if(mindLevel === 0){

            clearInterval(
                mindTimer
            );


            $("mindflayerPanel")
                .classList
                .add("hidden");


            state.mindflayer = 10;


            status(
                "Майндфлеиер полностью замедлен."
            );
        }
    };


$("mindFast").onclick =
    () => {

        mindLevel =
            Math.min(
                100,
                mindLevel + 20
            );


        updateMind();
    };


/* =========================
   GAME OVER
========================= */

$("restart").onclick =
    begin;


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
   INIT
========================= */

fillNights();

updateEnergyUI();

setView("front");
