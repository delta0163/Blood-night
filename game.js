/* =========================================================
   BLOOD GLOW NIGHT
   ОСНОВНОЙ JAVASCRIPT
========================================================= */


/* =========================================================
   ЭЛЕМЕНТЫ
========================================================= */

const $ = id => document.getElementById(id);

const mainMenu = $("mainMenu");
const nightsMenu = $("nightsMenu");
const settingsMenu = $("settingsMenu");
const phoneScreen = $("phoneScreen");
const game = $("game");

const cameraPanel = $("cameraPanel");
const energyPanel = $("energyPanel");
const backupPanel = $("backupPanel");

const gameOver = $("gameOver");
const winScreen = $("winScreen");


/* =========================================================
   СОСТОЯНИЕ
========================================================= */

let currentNight = 1;

let unlockedNight =
    Number(localStorage.getItem("bgnUnlockedNight") || 1);

let gameRunning = false;
let gameOverState = false;

let currentView = "front";
let currentCamera = "cam01";

let gameTime = 0;

/*
    1 реальная минута =
    1 игровая минута.

    Ночь длится 6 игровых часов.
*/

const NIGHT_LENGTH = 6 * 60 * 1000;

let gameTimer = null;
let enemyTimer = null;

let powerTarget = "camera";
let powerOff = false;

let leverStart = null;
let leverInterval = null;

let selectedWires = [];

let upperVentOpen = false;


/* =========================================================
   АНИМАТРОНИКИ
========================================================= */

const enemies = {

    lichi: {
        active: false,
        position: 0,
        lastMove: 0
    },

    pancake: {
        active: false,
        position: 0,
        lastMove: 0
    },

    nemka: {
        active: false,
        location: "switch",
        lastMove: 0,
        distracted: false
    },

    delta: {
        active: false,
        location: "attic",
        lastMove: 0
    }
};


/* =========================================================
   НОЧИ
========================================================= */

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
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ],

    8: [
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ],

    9: [
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ],

    10: [
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ],

    11: [
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ],

    12: [
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ],

    13: [
        "lichi",
        "pancake",
        "nemka",
        "delta"
    ]

};


/* =========================================================
   КАМЕРЫ
========================================================= */

const cameras = {

    cam01: {
        name: "CAM 01",
        image: "images/cam01.png"
    },

    cam02: {
        name: "CAM 02",
        image: "images/cam02.png"
    },

    cam03: {
        name: "CAM 03",
        image: "images/cam03.png"
    },

    cam04: {
        name: "CAM 04",
        image: "images/cam04.png"
    },

    cam05: {
        name: "CAM 05",
        image: "images/cam05.png"
    },

    cam06: {
        name: "CAM 06",
        image: "images/cam06.png"
    },

    cam07: {
        name: "CAM 07",
        image: "images/cam07.png"
    }

};


/* =========================================================
   ПОКАЗ / СКРЫТИЕ
========================================================= */

function show(element) {

    if (element) {
        element.classList.remove("hidden");
    }

}


function hide(element) {

    if (element) {
        element.classList.add("hidden");
    }

}


function hideAllMenus() {

    hide(mainMenu);
    hide(nightsMenu);
    hide(settingsMenu);
    hide(phoneScreen);

}


/* =========================================================
   ГЛАВНОЕ МЕНЮ
========================================================= */

$("startGameButton").onclick = () => {

    startNight(unlockedNight);

};


$("nightsButton").onclick = () => {

    hide(mainMenu);

    show(nightsMenu);

    createNightButtons();

};


$("settingsButton").onclick = () => {

    hide(mainMenu);

    show(settingsMenu);

};


$("closeNights").onclick = () => {

    hide(nightsMenu);

    show(mainMenu);

};


$("closeSettings").onclick = () => {

    hide(settingsMenu);

    show(mainMenu);

};


/* =========================================================
   ВЫБОР НОЧИ
========================================================= */

function createNightButtons() {

    const list = $("nightsList");

    list.innerHTML = "";

    for (let i = 1; i <= 13; i++) {

        const button = document.createElement("button");

        button.className = "nightButton";

        button.textContent =
            i <= unlockedNight
                ? `НОЧЬ ${i}`
                : `🔒 НОЧЬ ${i}`;

        if (i > unlockedNight) {

            button.classList.add("locked");

            button.disabled = true;

        }

        button.onclick = () => {

            startNight(i);

        };

        list.appendChild(button);

    }

}


/* =========================================================
   НАСТРОЙКИ
========================================================= */

$("resetProgress").onclick = () => {

    localStorage.removeItem("bgnUnlockedNight");

    unlockedNight = 1;

    alert("Прогресс сброшен.");

    createNightButtons();

};


$("fullscreenButton").onclick = async () => {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (e) {

        console.log(e);

    }

};


/* =========================================================
   НАЧАЛО НОЧИ
========================================================= */

function startNight(night) {

    currentNight = night;

    hideAllMenus();

    $("phoneNight").textContent =
        `NIGHT ${night}`;

    show(phoneScreen);

    stopAllSounds();

    try {

        $("phoneAudio").currentTime = 0;
        $("phoneAudio").play();

    } catch (e) {}

}


$("skipPhoneButton").onclick = () => {

    beginGame();

};


/* =========================================================
   ЗАПУСК ИГРЫ
========================================================= */

function beginGame() {

    hide(phoneScreen);

    show(game);

    hide(gameOver);
    hide(winScreen);

    gameRunning = true;
    gameOverState = false;

    gameTime = 0;

    currentView = "front";

    powerTarget = "camera";

    powerOff = false;

    selectedWires = [];

    upperVentOpen = false;

    resetEnemies();

    updateNightText();

    setOfficeBackground();

    updateTime();

    updateControls();

    startSounds();

    startGameLoops();

}


function resetEnemies() {

    enemies.lichi.active = false;
    enemies.lichi.position = 0;
    enemies.lichi.lastMove = 0;

    enemies.pancake.active = false;
    enemies.pancake.position = 0;
    enemies.pancake.lastMove = 0;

    enemies.nemka.active = false;
    enemies.nemka.location = "switch";
    enemies.nemka.lastMove = 0;
    enemies.nemka.distracted = false;

    enemies.delta.active = false;
    enemies.delta.location = "attic";
    enemies.delta.lastMove = 0;

    hide($("lichi"));
    hide($("pancake"));
    hide($("nemka"));
    hide($("delta"));

    $("nemkaEyes").classList.remove(
        "nemkaEyesActive"
    );

    $("cameraNemkaEyes").classList.remove(
        "nemkaEyesActive"
    );

}


/* =========================================================
   ЗАПУСК ЗВУКОВ
========================================================= */

function startSounds() {

    try {

        $("humAudio").volume = .35;

        $("humAudio").currentTime = 0;

        $("humAudio").play();

    } catch (e) {}

}


function stopAllSounds() {

    document
        .querySelectorAll("audio")
        .forEach(audio => {

            audio.pause();

            try {
                audio.currentTime = 0;
            } catch (e) {}

        });

}


/* =========================================================
   ИГРОВОЙ ЦИКЛ
========================================================= */

function startGameLoops() {

    clearInterval(gameTimer);
    clearInterval(enemyTimer);

    gameTimer = setInterval(() => {

        if (!gameRunning) return;

        gameTime += 1000;

        updateTime();

        updateEnemies();

        if (gameTime >= NIGHT_LENGTH) {

            winNight();

        }

    }, 1000);


    enemyTimer = setInterval(() => {

        if (!gameRunning) return;

        enemyActions();

    }, 4000);

}


/* =========================================================
   ВРЕМЯ
========================================================= */

function updateTime() {

    const minutes =
        Math.floor(
            gameTime / 60000
        );

    const hour =
        Math.floor(minutes / 60);

    const minute =
        minutes % 60;

    let displayHour =
        hour === 0 ? 12 : hour;

    const text =
        `${displayHour}:${String(minute).padStart(2, "0")} AM`;

    $("time").textContent = text;

}


/* =========================================================
   HUD
========================================================= */

function updateNightText() {

    $("night").textContent =
        `NIGHT ${currentNight}`;

}


function setStatus(text) {

    $("status").textContent = text;

}


/* =========================================================
   ОФИС
========================================================= */

function setOfficeBackground() {

    let image =
        "images/office_front.png";

    if (currentView === "left") {

        image =
            "images/office_left.png";

    }

    if (currentView === "right") {

        image =
            "images/office_right.png";

    }

    $("view").style.backgroundImage =
        `url("${image}")`;

    updateCharacterPositions();

}


$("leftButton").onclick = () => {

    if (!gameRunning) return;

    currentView = "left";

    setOfficeBackground();

    setStatus("ЛЕВАЯ СТОРОНА");

};


$("frontButton").onclick = () => {

    if (!gameRunning) return;

    currentView = "front";

    setOfficeBackground();

    setStatus("ОФИС");

};


$("rightButton").onclick = () => {

    if (!gameRunning) return;

    currentView = "right";

    setOfficeBackground();

    setStatus("ПРАВАЯ СТОРОНА");

};


function updateControls() {

    setOfficeBackground();

}


/* =========================================================
   ПОЗИЦИИ ПЕРСОНАЖЕЙ
========================================================= */

function updateCharacterPositions() {

    hide($("lichi"));
    hide($("pancake"));
    hide($("nemka"));
    hide($("delta"));

    if (!gameRunning) return;


    /* ЛИЧИ */

    if (
        enemies.lichi.active &&
        enemies.lichi.position >= 3 &&
        currentView === "left"
    ) {

        $("lichi").style.left = "35%";
        $("lichi").style.top = "55%";

        show($("lichi"));

    }


    /* ПАНКЕЙК */

    if (
        enemies.pancake.active &&
        enemies.pancake.position >= 3 &&
        currentView === "front"
    ) {

        $("pancake").style.left = "50%";
        $("pancake").style.top = "55%";

        show($("pancake"));

    }


    /* НЕМКА */

    if (
        enemies.nemka.active &&
        enemies.nemka.location === "window" &&
        currentView === "right"
    ) {

        $("nemka").style.left = "70%";
        $("nemka").style.top = "55%";

        show($("nemka"));

    }


    /* ДЕЛЬТА */

    if (
        enemies.delta.active &&
        enemies.delta.location === "vent" &&
        upperVentOpen
    ) {

        $("delta").style.left = "50%";
        $("delta").style.top = "35%";

        show($("delta"));

    }

}


/* =========================================================
   ПЕРЕМЕЩЕНИЕ ВРАГОВ
========================================================= */

function updateEnemies() {

    const active =
        nightEnemies[currentNight] || [];

    if (active.includes("lichi")) {

        enemies.lichi.active = true;

    }

    if (active.includes("pancake")) {

        enemies.pancake.active = true;

    }

    if (active.includes("nemka")) {

        enemies.nemka.active = true;

    }

    if (
        active.includes("delta") &&
        gameTime >= 3 * 60000
    ) {

        enemies.delta.active = true;

    }

    updateCharacterPositions();

}


/* =========================================================
   ДЕЙСТВИЯ ВРАГОВ
========================================================= */

function enemyActions() {

    const active =
        nightEnemies[currentNight] || [];


    /* ЛИЧИ */

    if (active.includes("lichi")) {

        if (
            powerTarget === "camera"
        ) {

            enemies.lichi.position++;

            if (
                enemies.lichi.position > 5
            ) {

                enemies.lichi.position = 5;

            }

        }

        if (
            enemies.lichi.position >= 5 &&
            currentView === "left"
        ) {

            loseGame(
                "Личи добралась до офиса."
            );

            return;

        }

    }


    /* ПАНКЕЙК */

    if (active.includes("pancake")) {

        if (gameTime >= 2 * 60000) {

            enemies.pancake.active = true;

            enemies.pancake.position++;

            if (
                enemies.pancake.position > 5
            ) {

                enemies.pancake.position = 5;

            }

        }

        if (
            enemies.pancake.position >= 5 &&
            currentView === "front"
        ) {

            loseGame(
                "Панкейк проник через вентиляцию."
            );

            return;

        }

    }


    /* НЕМКА */

    if (active.includes("nemka")) {

        enemies.nemka.active = true;

        if (
            !enemies.nemka.distracted
        ) {

            if (
                gameTime >= 1 * 60000
            ) {

                enemies.nemka.location =
                    "switch";

            }

            if (
                gameTime >= 2 * 60000
            ) {

                enemies.nemka.location =
                    "window";

            }

        }

        if (
            enemies.nemka.location === "switch" &&
            !enemies.nemka.distracted
        ) {

            if (
                powerTarget === "camera"
            ) {

                disableMainPower();

            }

        }

        if (
            enemies.nemka.location === "window" &&
            currentView === "right"
        ) {

            $("nemkaEyes")
                .classList
                .add("nemkaEyesActive");

        } else {

            $("nemkaEyes")
                .classList
                .remove("nemkaEyesActive");

        }

    }


    /* ДЕЛЬТА */

    if (
        active.includes("delta") &&
        gameTime >= 3 * 60000
    ) {

        enemies.delta.active = true;

        enemies.delta.location = "vent";

        updateCharacterPositions();

    }

}


/* =========================================================
   КАМЕРЫ
========================================================= */

$("cameraButton").onclick = () => {

    if (!gameRunning) return;

    if (powerOff) {

        setStatus(
            "КАМЕРЫ НЕ РАБОТАЮТ"
        );

        return;

    }

    show(cameraPanel);

    selectCamera(currentCamera);

};


$("closeCameraPanel").onclick = () => {

    hide(cameraPanel);

};


function selectCamera(id) {

    if (!cameras[id]) return;

    currentCamera = id;

    const camera =
        cameras[id];

    $("cameraImage").style.backgroundImage =
        `url("${camera.image}")`;

    $("cameraNumber").textContent =
        camera.name;

    updateCameraCharacters();

}


document
    .querySelectorAll(
        "#cameraMap > button"
    )
    .forEach(button => {

        button.onclick = () => {

            selectCamera(
                button.dataset.camera
            );

        };

    });


function updateCameraCharacters() {

    hide($("cameraLichi"));
    hide($("cameraPancake"));

    $("cameraNemkaEyes")
        .classList
        .remove(
            "nemkaEyesActive"
        );


    if (
        enemies.lichi.active &&
        enemies.lichi.position >= 1 &&
        currentCamera === "cam02"
    ) {

        show($("cameraLichi"));

    }


    if (
        enemies.pancake.active &&
        enemies.pancake.position >= 1 &&
        currentCamera === "cam04"
    ) {

        show($("cameraPancake"));

    }


    if (
        enemies.nemka.active &&
        !enemies.nemka.distracted &&
        currentCamera === "cam03"
    ) {

        $("cameraNemkaEyes")
            .classList
            .add(
                "nemkaEyesActive"
            );

    }

}


/* =========================================================
   МЯУКАНЬЕ
========================================================= */

$("catMeowButton").onclick = () => {

    if (!gameRunning) return;

    if (powerOff) {

        $("catMessage").textContent =
            "ЭЛЕКТРИЧЕСТВО ОТКЛЮЧЕНО.";

        return;

    }


    try {

        $("catAudio").currentTime = 0;
        $("catAudio").play();

    } catch (e) {}


    if (
        enemies.nemka.active &&
        !enemies.nemka.distracted
    ) {

        enemies.nemka.distracted = true;

        enemies.nemka.location =
            "away";

        $("catMessage").textContent =
            "НЕМКА ОТВЛЕЧЕНА!";

        setTimeout(() => {

            enemies.nemka.distracted = false;

            enemies.nemka.location =
                "switch";

            $("catMessage").textContent =
                "НЕМКА ВЕРНУЛАСЬ.";

        }, 12000);

    } else {

        $("catMessage").textContent =
            "МЯУКАНЬЕ ПРОИГРАНО.";

    }

};


/* =========================================================
   ВСПЫШКА
========================================================= */

$("flashButton").onclick = () => {

    if (!gameRunning) return;

    if (
        powerOff ||
        powerTarget !== "camera"
    ) {

        setStatus(
            "ВСПЫШКА НЕ РАБОТАЕТ"
        );

        return;

    }


    const flash =
        $("flash");

    flash.style.opacity = "1";

    setTimeout(() => {

        flash.style.opacity = "0";

    }, 100);


    try {

        $("flashAudio").currentTime = 0;
        $("flashAudio").play();

    } catch (e) {}


    /* ЛИЧИ БОИТСЯ ВСПЫШКИ */

    if (
        enemies.lichi.active &&
        enemies.lichi.position >= 3
    ) {

        enemies.lichi.position -= 2;

        if (
            enemies.lichi.position < 0
        ) {

            enemies.lichi.position = 0;

        }

        setStatus(
            "ЛИЧИ ОТСТУПИЛА"
        );

    }

};


/* =========================================================
   ВЕРХНЯЯ ШАХТА
========================================================= */

$("upperVentButton").onclick = () => {

    if (!gameRunning) return;

    upperVentOpen =
        !upperVentOpen;

    $("upperVent")
        .classList
        .toggle(
            "upperVentActive",
            upperVentOpen
        );

    updateCharacterPositions();

    if (upperVentOpen) {

        setStatus(
            "ВЕРХНЯЯ ШАХТА"
        );

    } else {

        setStatus(
            "ОФИС"
        );

    }

};


/* =========================================================
   СЖИГАТЕЛЬ
========================================================= */

$("incineratorButton").onclick = () => {

    if (!gameRunning) return;

    if (
        powerOff ||
        powerTarget !== "incinerator"
    ) {

        setStatus(
            "СЖИГАТЕЛЬ НЕ ПОЛУЧАЕТ ЭНЕРГИЮ"
        );

        return;

    }


    if (
        enemies.delta.active &&
        enemies.delta.location === "vent"
    ) {

        enemies.delta.location =
            "away";

        hide($("delta"));

        setStatus(
            "ДЕЛЬТА ОТСТУПИЛА!"
        );

        try {

            $("ventAudio").pause();

        } catch (e) {}

    } else {

        setStatus(
            "СЖИГАТЕЛЬ АКТИВИРОВАН"
        );

    }

};


/* =========================================================
   ЭНЕРГИЯ
========================================================= */

$("energyButton").onclick = () => {

    if (!gameRunning) return;

    show(energyPanel);

    updateEnergyUI();

};


$("closeEnergyPanel").onclick = () => {

    hide(energyPanel);

};


document
    .querySelectorAll(
        "#energyTargets button"
    )
    .forEach(button => {

        button.onclick = () => {

            powerTarget =
                button.dataset.energy;

            updateEnergyUI();

        };

    });


function updateEnergyUI() {

    const names = {

        camera: "КАМЕРЫ",

        window: "ОКНО",

        incinerator: "СЖИГАТЕЛЬ",

        door: "ПРАВАЯ ДВЕРЬ"

    };


    $("energyTargetText").textContent =
        names[powerTarget];


    document
        .querySelectorAll(
            "#energyTargets button"
        )
        .forEach(button => {

            button.classList.toggle(
                "energyTargetActive",
                button.dataset.energy === powerTarget
            );

        });


    $("energyMessage").textContent =
        `Энергия направлена на ${
            names[powerTarget].toLowerCase()
        }.`;

}


/* =========================================================
   РЫЧАГ
========================================================= */

function startLever() {

    if (!gameRunning) return;

    if (leverStart !== null) return;

    leverStart =
        Date.now();


    leverInterval =
        setInterval(() => {

            const elapsed =
                Date.now() - leverStart;

            const percent =
                Math.min(
                    100,
                    elapsed / 3000 * 100
                );

            $("leverProgressBar")
                .style
                .width =
                percent + "%";


            if (percent >= 100) {

                finishLever();

            }

        }, 50);

}


function finishLever() {

    clearInterval(
        leverInterval
    );

    leverInterval = null;

    leverStart = null;

    $("leverProgressBar")
        .style
        .width = "0%";


    setTimeout(() => {

        hide(energyPanel);

        setStatus(
            "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА"
        );

    }, 200);

}


function cancelLever() {

    if (leverStart === null) return;

    clearInterval(
        leverInterval
    );

    leverInterval = null;

    leverStart = null;

    $("leverProgressBar")
        .style
        .width = "0%";

}


$("lever").addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        startLever();

    }
);


$("lever").addEventListener(
    "pointerup",
    event => {

        event.preventDefault();

        if (
            leverStart !== null &&
            Date.now() - leverStart < 3000
        ) {

            cancelLever();

        }

    }
);


$("lever").addEventListener(
    "pointercancel",
    cancelLever
);


$("lever").addEventListener(
    "pointerleave",
    event => {

        if (
            event.buttons === 0
        ) {

            return;

        }

    }
);


/* =========================================================
   ОТКЛЮЧЕНИЕ ПИТАНИЯ
========================================================= */

function disableMainPower() {

    if (powerOff) return;

    powerOff = true;

    setStatus(
        "ОСНОВНОЕ ПИТАНИЕ ОТКЛЮЧЕНО!"
    );


    try {

        $("powerOffAudio").currentTime = 0;

        $("powerOffAudio").play();

    } catch (e) {}


    show(backupPanel);

    setTimeout(() => {

        hide(backupPanel);

    }, 2000);

}


/* =========================================================
   РЕЗЕРВНОЕ ПИТАНИЕ
========================================================= */

document
    .querySelectorAll(
        "#backupWires button"
    )
    .forEach(button => {

        button.onclick = () => {

            const wire =
                Number(button.dataset.wire);

            selectWire(wire);

        };

    });


function selectWire(wire) {

    if (
        selectedWires.includes(wire)
    ) {

        return;

    }


    const correctOrder =
        selectedWires.length + 1;


    if (wire !== correctOrder) {

        selectedWires = [];

        document
            .querySelectorAll(
                "#backupWires button"
            )
            .forEach(button => {

                button.classList.remove(
                    "wireSelected"
                );

            });


        $("backupMessage").textContent =
            "ОШИБКА! НАЧНИТЕ ЗАНОВО.";

        return;

    }


    selectedWires.push(wire);


    const button =
        document.querySelector(
            `[data-wire="${wire}"]`
        );

    button.classList.add(
        "wireSelected"
    );


    $("backupMessage").textContent =
        `ПОДКЛЮЧЕНО: ${selectedWires.length}/4`;


    if (
        selectedWires.length === 4
    ) {

        restorePower();

    }

}


function restorePower() {

    powerOff = false;

    selectedWires = [];

    $("backupMessage").textContent =
        "РЕЗЕРВНОЕ ПИТАНИЕ ВОССТАНОВЛЕНО!";

    try {

        $("backupAudio").currentTime = 0;

        $("backupAudio").play();

    } catch (e) {}


    document
        .querySelectorAll(
            "#backupWires button"
        )
        .forEach(button => {

            button.classList.remove(
                "wireSelected"
            );

        });


    setTimeout(() => {

        hide(backupPanel);

        setStatus(
            "РЕЗЕРВНОЕ ПИТАНИЕ АКТИВНО"
        );

    }, 1200);

}


/* =========================================================
   GAME OVER
========================================================= */

function loseGame(reason) {

    if (
        !gameRunning ||
        gameOverState
    ) {

        return;

    }


    gameRunning = false;

    gameOverState = true;

    clearInterval(gameTimer);
    clearInterval(enemyTimer);

    cancelLever();

    hide(cameraPanel);
    hide(energyPanel);
    hide(backupPanel);

    $("loseReason").textContent =
        reason;


    show(gameOver);


    try {

        $("screamAudio").currentTime = 0;

        $("screamAudio").play();

    } catch (e) {}

}


/* =========================================================
   ПОВТОР
========================================================= */

$("restart").onclick = () => {

    beginGame();

};


/* =========================================================
   МЕНЮ ПОСЛЕ ПРОИГРЫША
========================================================= */

$("menuAfterLose").onclick = () => {

    returnToMenu();

};


/* =========================================================
   ПОБЕДА
========================================================= */

function winNight() {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(gameTimer);
    clearInterval(enemyTimer);

    cancelLever();

    hide(cameraPanel);
    hide(energyPanel);
    hide(backupPanel);

    $("winText").textContent =
        `NIGHT ${currentNight} COMPLETE`;

    /*
        Открываем следующую ночь.
    */

    if (
        currentNight >= unlockedNight &&
        currentNight < 13
    ) {

        unlockedNight =
            currentNight + 1;

        localStorage.setItem(
            "bgnUnlockedNight",
            unlockedNight
        );

    }


    if (currentNight >= 13) {

        $("nextNight").textContent =
            "ИГРА ПРОЙДЕНА";

        $("nextNight").onclick =
            returnToMenu;

    } else {

        $("nextNight").textContent =
            `NIGHT ${currentNight + 1}`;

        $("nextNight").onclick =
            () => {

                startNight(
                    currentNight + 1
                );

            };

    }


    show(winScreen);

}


/* =========================================================
   МЕНЮ
========================================================= */

$("menuAfterWin").onclick = () => {

    returnToMenu();

};


function returnToMenu() {

    gameRunning = false;

    clearInterval(gameTimer);
    clearInterval(enemyTimer);

    cancelLever();

    stopAllSounds();

    hide(gameOver);
    hide(winScreen);

    hide(cameraPanel);
    hide(energyPanel);
    hide(backupPanel);

    hide(game);

    show(mainMenu);

}


/* =========================================================
   КЛАВИАТУРА
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (!gameRunning) return;


        if (event.key === "ArrowLeft") {

            $("leftButton").click();

        }


        if (event.key === "ArrowRight") {

            $("rightButton").click();

        }


        if (event.key === "ArrowUp") {

            $("upperVentButton").click();

        }


        if (
            event.key.toLowerCase() === "c"
        ) {

            $("cameraButton").click();

        }


        if (
            event.key.toLowerCase() === "f"
        ) {

            $("flashButton").click();

        }


        if (
            event.key.toLowerCase() === "e"
        ) {

            $("energyButton").click();

        }

    }
);


/* =========================================================
   ПЕРИОДИЧЕСКОЕ ОБНОВЛЕНИЕ КАМЕР
========================================================= */

setInterval(() => {

    if (!gameRunning) return;

    if (
        !cameraPanel.classList.contains(
            "hidden"
        )
    ) {

        updateCameraCharacters();

    }

}, 300);


/* =========================================================
   НАЧАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ
========================================================= */

hide(nightsMenu);
hide(settingsMenu);
hide(phoneScreen);
hide(game);
hide(cameraPanel);
hide(energyPanel);
hide(backupPanel);
hide(gameOver);
hide(winScreen);

createNightButtons();

console.log(
    "BLOOD GLOW NIGHT загружен."
);
