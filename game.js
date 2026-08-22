const $ = id => document.getElementById(id);

const q = selector => document.querySelector(selector);

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


/*
    ПРОГРЕСС ПЕРСОНАЖЕЙ

    0   = далеко
    100 = дошёл до офиса
*/

let state = {
    nemka: 0,
    lichi: 0,
    pancake: 0,
    kyu: 0,
    kashatan: 0,
    charlotte: 0,
    delta: 0,
    lizka: 0,
    mindflayer: 0
};


/*
    НАСТРОЙКИ НОЧЕЙ

    Каждая следующая ночь включает
    всё больше персонажей.
*/

const nightEnemies = {

    1: ["lichi"],

    2: [
        "lichi",
        "pancake"
    ],

    3: [
        "lichi",
        "pancake",
        "nemka"
    ],

    4: [
        "pancake",
        "delta",
        "nemka"
    ],

    5: [
        "lichi",
        "delta",
        "lizka",
        "nemka"
    ],

    6: [
        "kyu",
        "lichi",
        "pancake",
        "nemka",
        "lizka"
    ],

    7: [
        "nemka",
        "lichi",
        "pancake",
        "kyu",
        "kashatan",
        "charlotte",
        "delta",
        "lizka"
    ],

    8: [
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

    9: [
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

    10: [
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

    11: [
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

    12: [
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

    13: [
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


function active(enemy) {

    return nightEnemies[night]?.includes(enemy);
}


/*
    ЗВУК
*/

function snd(id) {

    const audio = $(id);

    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {});
}


function stop(id) {

    const audio = $(id);

    if (!audio) return;

    audio.pause();

    audio.currentTime = 0;
}


/*
    ЭКРАНЫ
*/

function hideAll() {

    qa(".screen").forEach(x =>
        x.classList.add("hidden")
    );

    $("game").classList.add("hidden");
}


function menu() {

    playing = false;

    clearInterval(timer);

    clearInterval(mindTimer);

    stop("humAudio");

    hideAll();

    $("mainMenu").classList.remove("hidden");
}


function start(n) {

    night = Math.max(1, Math.min(13, n));

    hideAll();

    $("phoneScreen").classList.remove("hidden");

    $("phoneNight").textContent =
        "NIGHT " + night;

    snd("phoneAudio");
}


function begin() {

    stop("phoneAudio");

    hideAll();

    $("game").classList.remove("hidden");

    resetGame();

    playing = true;

    snd("humAudio");

    startClock();
}


/*
    СБРОС НОЧИ
*/

function resetGame() {

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

    state = {

        nemka: 0,

        lichi: 0,

        pancake: 0,

        kyu: 0,

        kashatan: 0,

        charlotte: 0,

        delta: 0,

        lizka: 0,

        mindflayer: 0
    };

    $("night").textContent =
        "NIGHT " + night;

    $("time").textContent =
        "12:00 AM";

    $("status").textContent =
        "ОФИС";

    $("rightDoor").classList.remove("closed");

    $("rightDoorButton").textContent =
        "ЗАКРЫТЬ";

    $("backupPanel").classList.add("hidden");

    $("cameraPanel").classList.add("hidden");

    $("energyPanel").classList.add("hidden");

    $("mindPanel").classList.add("hidden");

    $("gameOver").classList.add("hidden");

    $("winScreen").classList.add("hidden");

    $("upperVent").classList.remove("upperVentActive");

    $("rearWindow").style.display =
        "none";

    $("upperVentButton").style.display =
        "none";

    $("incineratorButton").style.display =
        "none";

    $("rearWindowButton").style.display =
        "none";

    qa("#backupWires button")
        .forEach(x =>
            x.classList.remove("wireSelected")
        );

    updateEnergyUI();

    renderAI();
}


/*
    ВРЕМЯ

    Ночь длится 6 игровых часов.

    1 игровая минута =
    1 реальная секунда.

    Поэтому:

    12:00 -> 1:00 = 60 секунд
    12:00 -> 6:00 = 360 секунд
*/

function startClock() {

    const startTime = Date.now();

    timer = setInterval(() => {

        if (!playing) return;

        elapsed =
            Math.floor(
                (Date.now() - startTime) / 1000
            );

        updateClock();

        updateAI();

        if (elapsed >= 360) {

            win();
        }

    }, 250);
}


function updateClock() {

    let totalMinutes = elapsed;

    let hour =
        Math.floor(totalMinutes / 60);

    let minute =
        totalMinutes % 60;

    let displayHour =
        hour === 0
            ? 12
            : hour;

    $("time").textContent =
        displayHour +
        ":" +
        String(minute).padStart(2, "0") +
        " AM";
}


/*
    АНИМАТРОНИКИ
*/

function updateAI() {

    if (!playing) return;


    /*
        НЕМКА

        Активируется с 1:00.
    */

    if (active("nemka") && elapsed >= 60) {

        state.nemka +=
            night >= 7
                ? 0.055
                : 0.045;

        /*
            Мяуканье может откатить её назад.
        */

        if (
            state.nemka >= 100 &&
            !backupDone
        ) {

            powerOff();

            state.nemka = 65;
        }

        /*
            После резервного питания
            идёт к правой двери.
        */

        if (
            backupDone &&
            state.nemka >= 100
        ) {

            if (
                view === "right" &&
                rightDoorClosed
            ) {

                state.nemka = 35;

                status(
                    "Немка отступила от закрытой двери."
                );

            } else {

                lose(
                    "Немка добралась до правой двери."
                );

                return;
            }
        }
    }


    /*
        ЛИЧИ

        Идёт по левому коридору.
    */

    if (active("lichi")) {

        state.lichi +=
            0.035;

        if (state.lichi >= 100) {

            if (view === "left") {

                lose(
                    "Личи добралась до офиса."
                );

                return;

            } else {

                state.lichi = 95;
            }
        }
    }


    /*
        ПАНКЕЙК

        После 2:00 идёт к вентиляции.
    */

    if (
        active("pancake") &&
        elapsed >= 120
    ) {

        state.pancake +=
            0.04;

        if (state.pancake >= 100) {

            /*
                Если игрок не меняет
                направление вентиляции,
                Панкейк проходит.
            */

            lose(
                "Панкейк пробрался через вентиляцию."
            );

            return;
        }
    }


    /*
        КЬЮ

        Правый коридор.
    */

    if (active("kyu")) {

        let speed =
            state.kyu > 70
                ? 0.075
                : 0.025;

        state.kyu += speed;

        if (state.kyu >= 100) {

            if (rightDoorClosed) {

                state.kyu = 25;

                status(
                    "Кью ударился о закрытую дверь."
                );

            } else {

                lose(
                    "Кью ворвался через правую дверь."
                );

                return;
            }
        }
    }


    /*
        КАШТАН

        Задний двор -> заднее окно.
    */

    if (active("kashatan")) {

        state.kashatan +=
            0.075;

        if (state.kashatan >= 100) {

            if (
                windowPowered() &&
                view === "rear"
            ) {

                state.kashatan = 25;

                status(
                    "Электрическое окно отпугнуло Каштана!"
                );

            } else {

                lose(
                    "Каштан добрался до заднего окна."
                );

                return;
            }
        }
    }


    /*
        ШАРЛОТА

        Идёт тем же путём,
        но быстрее Каштана.
    */

    if (active("charlotte")) {

        state.charlotte +=
            0.09;

        /*
            Сирена сбрасывает прогресс.
        */

        if (state.charlotte >= 100) {

            /*
                Шарлота блокирует окно
                на 20 секунд.
            */

            energyBlockedUntil =
                Date.now() + 20000;

            updateEnergyUI();

            state.charlotte = 30;

            status(
                "Шарлота заблокировала питание окна на 20 секунд!"
            );

            snd("sirenAudio");
        }
    }


    /*
        ДЕЛЬТА

        До 2:00 на чердаке.

        После 2:00 верхняя шахта.
    */

    if (
        active("delta") &&
        elapsed >= 120
    ) {

        state.delta +=
            0.045;

        if (state.delta >= 100) {

            if (incineratorPowered()) {

                state.delta = 20;

                snd("burnAudio");

                status(
                    "Дельта отпугнута мусоросжиганием."
                );

            } else {

                lose(
                    "Дельта пробралась через вентиляцию."
                );

                return;
            }
        }

        showVentControls();
    }


    /*
        ЛИЗКА

        Идёт к резервному питанию.
    */

    if (active("lizka")) {

        state.lizka +=
            0.035;

        if (state.lizka >= 100) {

            if (
                fencePowered()
            ) {

                state.lizka = 20;

                status(
                    "Электрозабор остановил Лизку."
                );

            } else {

                lose(
                    "Лизка добралась до резервного питания."
                );

                return;
            }
        }
    }


    /*
        МАЙНДФЛЕИЕР
    */

    if (active("mindflayer")) {

        state.mindflayer +=
            0.03;

        if (state.mindflayer >= 100) {

            openMindPanel();
        }
    }


    renderAI();
}


/*
    ОТОБРАЖЕНИЕ ПЕРСОНАЖЕЙ
*/

function renderAI() {

    /*
        Личи
    */

    if (
        view === "left" &&
        active("lichi") &&
        state.lichi > 50
    ) {

        $("lichi").style.display =
            "block";

        $("lichi").style.left =
            "45%";

        $("lichi").style.top =
            "55%";

    } else {

        $("lichi").style.display =
            "none";
    }


    /*
        Панкейк
    */

    if (
        view === "front" &&
        active("pancake") &&
        state.pancake > 50
    ) {

        $("pancake").style.display =
            "block";

        $("pancake").style.left =
            "50%";

        $("pancake").style.top =
            "65%";

    } else {

        $("pancake").style.display =
            "none";
    }


    /*
        Немка
    */

    if (
        view === "right" &&
        active("nemka") &&
        backupDone &&
        state.nemka > 60
    ) {

        $("nemka").style.display =
            "block";

        $("nemka").style.left =
            "78%";

        $("nemka").style.top =
            "50%";

    } else {

        $("nemka").style.display =
            "none";
    }


    /*
        Каштан
    */

    if (
        view === "rear" &&
        active("kashatan") &&
        state.kashatan > 40
    ) {

        $("kashatan").style.display =
            "block";

        $("kashatan").style.left =
            "50%";

        $("kashatan").style.top =
            "48%";

    } else {

        $("kashatan").style.display =
            "none";
    }


    /*
        Шарлота
    */

    if (
        view === "rear" &&
        active("charlotte") &&
        state.charlotte > 40
    ) {

        $("charlotte").style.display =
            "block";

        $("charlotte").style.left =
            "52%";

        $("charlotte").style.top =
            "45%";

    } else {

        $("charlotte").style.display =
            "none";
    }
}


/*
    СТАТУС
*/

function status(text) {

    $("status").textContent =
        text;
}


/*
    НЕМКА ОТКЛЮЧАЕТ ПИТАНИЕ
*/

function powerOff() {

    if (backupDone) return;

    backupDone = false;

    snd("powerOffAudio");

    $("backupPanel")
        .classList
        .remove("hidden");

    status(
        "ОСНОВНОЕ ПИТАНИЕ ОТКЛЮЧЕНО"
    );
}


/*
    ЭНЕРГИЯ
*/

function windowPowered() {

    return (
        energy === "window" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


function fencePowered() {

    return (
        energy === "fence" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


function incineratorPowered() {

    return (
        energy === "incinerator" &&
        Date.now() >= energyBlockedUntil &&
        !energyBusy
    );
}


/*
    МАЙНДФЛЕИЕР — МИНИ-ИГРА
*/

function openMindPanel() {

    if (
        !$("mindPanel")
            .classList
            .contains("hidden")
    ) {
        return;
    }

    $("mindPanel")
        .classList
        .remove("hidden");

    mindLevel = 70;

    updateMind();

    clearInterval(mindTimer);

    mindTimer =
        setInterval(() => {

            mindLevel -= 1.1;

            if (mindLevel <= 0) {

                mindLevel = 0;

                clearInterval(mindTimer);

                $("mindPanel")
                    .classList
                    .add("hidden");

                state.mindflayer = 15;

                status(
                    "Майндфлеиер полностью замедлен."
                );
            }

            updateMind();

        }, 500);
}


function updateMind() {

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


/*
    ВЕНТИЛЯЦИЯ
*/

function showVentControls() {

    if (
        !active("delta") ||
        elapsed < 120
    ) {
        return;
    }

    $("upperVentButton")
        .style
        .display =
        "block";

    $("incineratorButton")
        .style
        .display =
        "block";
}


/*
    ПОВОРОТЫ
*/

function setView(v) {

    view = v;

    if (v === "left") {

        status(
            "ЛЕВЫЙ КОРИДОР"
        );

    } else if (v === "right") {

        status(
            "ПРАВЫЙ КОРИДОР"
        );

    } else if (v === "rear") {

        status(
            "ЗАДНЕЕ ОКНО"
        );

    } else {

        status(
            "ОФИС"
        );
    }

    $("rearWindowButton")
        .style
        .display =
        v === "rear"
            ? "block"
            : "none";

    $("upperVentButton")
        .style
        .display =
        (
            v === "front" &&
            active("delta") &&
            elapsed >= 120
        )
            ? "block"
            : "none";

    renderAI();
}


/*
    ВСПЫШКА ЛИЧИ
*/

function flash() {

    snd("flashAudio");

    $("flash")
        .style
        .opacity = 1;

    setTimeout(() => {

        $("flash")
            .style
            .opacity = 0;

    }, 100);


    if (
        active("lichi") &&
        state.lichi > 30
    ) {

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


/*
    КАМЕРЫ
*/

function openCamera() {

    if (energy !== "camera") {

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


function updateCamera() {

    let button =
        q(
            `[data-camera="${camera}"]`
        );

    qa(
        "#cameraMap button[data-camera]"
    ).forEach(x =>
        x.classList.remove(
            "energyTargetActive"
        )
    );

    if (button) {

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


    /*
        Личи
    */

    $("cameraLichi")
        .style
        .display =
        active("lichi") &&
        camera === "cam02" &&
        state.lichi > 20
            ? "block"
            : "none";


    /*
        Панкейк
    */

    $("cameraPancake")
        .style
        .display =
        active("pancake") &&
        camera === "cam04" &&
        state.pancake > 15
            ? "block"
            : "none";


    /*
        Глаза Немки
    */

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


    /*
        Шарлота
    */

    $("cameraCharlotte")
        .style
        .display =
        active("charlotte") &&
        state.charlotte > 30
            ? "block"
            : "none";


    $("catMessage")
        .textContent =
        "Текущая камера: " +
        camera.toUpperCase();
}


/*
    МЯУКАНЬЕ
*/

function meow() {

    if (energy !== "camera") {

        status(
            "Камеры обесточены."
        );

        return;
    }

    snd("catAudio");

    if (
        active("nemka") &&
        state.nemka > 10 &&
        state.nemka < 90
    ) {

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

    } else {

        $("catMessage")
            .textContent =
            "Мяуканье воспроизведено.";
    }

    updateCamera();
}


/*
    СИРЕНА ШАРЛОТЫ
*/

function alarm() {

    if (energy !== "camera") {

        status(
            "Сирена не работает без энергии."
        );

        return;
    }

    snd("sirenAudio");

    if (
        active("charlotte") &&
        state.charlotte > 10 &&
        state.charlotte < 100
    ) {

        state.charlotte =
            Math.max(
                0,
                state.charlotte - 50
            );

        status(
            "СИРЕНА: Шарлота отвлечена!"
        );
    }
}


/*
    ВЕРХНЯЯ ШАХТА
*/

function upperVent() {

    if (elapsed < 120) {

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

    if (
        $("upperVent")
            .classList
            .contains("upperVentActive")
    ) {

        status(
            "ВЕРХНЯЯ ШАХТА"
        );

        showDelta(true);

    } else {

        status(
            "ОФИС"
        );

        showDelta(false);
    }
}


function showDelta(show) {

    $("delta")
        .style
        .display =
        show
            ? "block"
            : "none";

    if (show) {

        $("delta").style.left =
            "50%";

        $("delta").style.top =
            "45%";
    }
}


/*
    СЖИГАТЕЛЬ
*/

function burn() {

    if (!incineratorPowered()) {

        status(
            "Сначала направьте энергию на сжигатель."
        );

        return;
    }

    snd("burnAudio");

    if (active("delta")) {

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


/*
    ЗАДНЕЕ ОКНО
*/

function rear() {

    setView("rear");

    $("rearWindow")
        .style
        .display =
        "block";

    setTimeout(() => {

        $("rearWindow")
            .style
            .display =
            "none";

    }, 200);
}


/*
    ПРАВАЯ ДВЕРЬ
*/

function closeRight() {

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

    status(
        rightDoorClosed
            ? "ПРАВАЯ ДВЕРЬ ЗАКРЫТА"
            : "ПРАВАЯ ДВЕРЬ ОТКРЫТА"
    );
}


/*
    ЭНЕРГИЯ
*/

function selectEnergy(target) {

    if (
        Date.now() <
        energyBlockedUntil
    ) {

        status(
            "Питание окна временно заблокировано."
        );

        return;
    }

    energy = target;

    updateEnergyUI();
}


function updateEnergyUI() {

    const names = {

        camera:
            "КАМЕРЫ",

        window:
            "ОКНО",

        incinerator:
            "СЖИГАТЕЛЬ",

        fence:
            "ЭЛЕКТРОЗАБОР",

        door:
            "ПРАВАЯ ДВЕРЬ"
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
    ).forEach(button => {

        button.classList.toggle(
            "energyTargetActive",
            button.dataset.energy === energy
        );
    });
}


/*
    РЫЧАГ

    Перенаправление занимает
    ровно 2 секунды.
*/

function leverDown() {

    if (energyBusy) return;

    leverStart =
        Date.now();

    energyBusy = true;

    const loop =
        setInterval(() => {

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


            if (progress >= 100) {

                clearInterval(loop);

                energyBusy = false;

                $("leverProgressBar")
                    .style
                    .width = "0%";

                updateEnergyUI();

                status(
                    "Перенаправление завершено."
                );
            }

        }, 30);
}


/*
    РЕЗЕРВНОЕ ПИТАНИЕ
*/

function backupWire(number) {

    number =
        Number(number);

    if (
        number ===
        wireStep + 1
    ) {

        wireStep++;

        q(
            `[data-wire="${number}"]`
        )
            .classList
            .add("wireSelected");


        if (wireStep === 4) {

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

    } else {

        wireStep = 0;

        qa(
            "#backupWires button"
        ).forEach(x =>
            x.classList.remove(
                "wireSelected"
            )
        );

        $("backupMessage")
            .textContent =
            "Ошибка! Начните заново.";
    }
}


/*
    GAME OVER
*/

function lose(reason) {

    if (!playing) return;

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


/*
    ПОБЕДА
*/

function win() {

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


/*
    СПИСОК НОЧЕЙ
*/

function fillNights() {

    let unlocked =
        Number(
            localStorage.getItem(
                "bgnUnlocked"
            ) || 1
        );

    $("nightsList")
        .innerHTML = "";


    for (
        let i = 1;
        i <= 13;
        i++
    ) {

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


/*
    КНОПКИ МЕНЮ
*/

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


/*
    КАМЕРЫ
*/

$("cameraButton").onclick =
    openCamera;


$("closeCameraPanel").onclick =
    () =>
        $("cameraPanel")
            .classList
            .add("hidden");


/*
    ЭНЕРГИЯ
*/

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


/*
    МАЙНДФЛЕИЕР
*/

$("closeMindPanel").onclick =
    () =>
        $("mindPanel")
            .classList
            .add("hidden");


$("mindSlow").onclick =
    () => {

        mindLevel =
            Math.max(
                0,
                mindLevel - 15
            );

        updateMind();


        if (mindLevel === 0) {

            clearInterval(
                mindTimer
            );

            $("mindPanel")
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


/*
    ОСНОВНЫЕ КНОПКИ
*/

$("flashButton").onclick =
    flash;


$("leftButton").onclick =
    () =>
        setView("left");


$("frontButton").onclick =
    () =>
        setView("front");


$("rightButton").onclick =
    () =>
        setView("right");


$("rightDoorButton").onclick =
    closeRight;


$("rearWindowButton").onclick =
    rear;


$("upperVentButton").onclick =
    upperVent;


$("incineratorButton").onclick =
    burn;


/*
    МЯУКАНЬЕ
*/

$("catMeowButton").onclick =
    meow;


/*
    СИРЕНА
*/

$("cameraAlarm").onclick =
    alarm;


/*
    ВЫБОР КАМЕРЫ
*/

qa(
    "#cameraMap button[data-camera]"
).forEach(button => {

    button.onclick =
        () => {

            camera =
                button.dataset.camera;

            updateCamera();
        };
});


/*
    ВЫБОР ЭНЕРГИИ
*/

qa(
    "#energyTargets button"
).forEach(button => {

    button.onclick =
        () =>
            selectEnergy(
                button.dataset.energy
            );
});


/*
    ПРОВОДА
*/

qa(
    "#backupWires button"
).forEach(button => {

    button.onclick =
        () =>
            backupWire(
                button.dataset.wire
            );
});


/*
    РЫЧАГ
*/

$("lever")
    .addEventListener(
        "pointerdown",
        leverDown
    );


/*
    GAME OVER
*/

$("restart").onclick =
    () =>
        begin();


$("menuAfterLose").onclick =
    menu;


/*
    ПОБЕДА
*/

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


/*
    ПЕРВИЧНАЯ ИНИЦИАЛИЗАЦИЯ
*/

fillNights();

updateEnergyUI();
