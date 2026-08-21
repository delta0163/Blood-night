/* =================================================
   BLOOD GLOW NIGHT
   НОЧЬ 4:
   ПАНКЕЙК + ДЕЛЬТА + НЕМКА

   НОЧЬ 5:
   ЛИЧИ + ПАНКЕЙК + ДЕЛЬТА + ЛИЗКА + НЕМКА

   ШАРЛОТА — НЕТ
   КАШТАН — НЕТ
   МАЙНДФЛЕИЕР — НЕТ
================================================= */


/* =================================================
   ЭЛЕМЕНТЫ
================================================= */

const mainMenu =
    document.getElementById("mainMenu");

const nightsMenu =
    document.getElementById("nightsMenu");

const settingsMenu =
    document.getElementById("settingsMenu");

const nightsList =
    document.getElementById("nightsList");

const phoneScreen =
    document.getElementById("phoneScreen");

const game =
    document.getElementById("game");

const phoneAudio =
    document.getElementById("phoneAudio");

const humAudio =
    document.getElementById("humAudio");

const flashAudio =
    document.getElementById("flashAudio");

const lichiAudio =
    document.getElementById("lichiAudio");

const pancakeAudio =
    document.getElementById("pancakeAudio");

const screamAudio =
    document.getElementById("screamAudio");

const ventAudio =
    document.getElementById("ventAudio");

const catAudio =
    document.getElementById("catAudio");

const nemkaAudio =
    document.getElementById("nemkaAudio");

const powerOffAudio =
    document.getElementById("powerOffAudio");

const backupAudio =
    document.getElementById("backupAudio");

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const pancake =
    document.getElementById("pancake");

const flash =
    document.getElementById("flash");

const nemkaEyes =
    document.getElementById("nemkaEyes");

const cameraNemkaEyes =
    document.getElementById("cameraNemkaEyes");

const status =
    document.getElementById("status");

const time =
    document.getElementById("time");

const nightDisplay =
    document.getElementById("night");

const cameraPanel =
    document.getElementById("cameraPanel");

const cameraImage =
    document.getElementById("cameraImage");

const cameraNumber =
    document.getElementById("cameraNumber");

const cameraLichi =
    document.getElementById("cameraLichi");

const cameraPancake =
    document.getElementById("cameraPancake");

const energyPanel =
    document.getElementById("energyPanel");

const energyTargetText =
    document.getElementById("energyTargetText");

const energyMessage =
    document.getElementById("energyMessage");

const lever =
    document.getElementById("lever");

const leverProgressBar =
    document.getElementById("leverProgressBar");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");

const backupPanel =
    document.getElementById("backupPanel");

const backupMessage =
    document.getElementById("backupMessage");

const fencePanel =
    document.getElementById("fencePanel");

const fenceMessage =
    document.getElementById("fenceMessage");

const catMessage =
    document.getElementById("catMessage");

const loseReason =
    document.getElementById("loseReason");


/* =================================================
   ПОКАЗ / СКРЫТИЕ
================================================= */

function showElement(element, display = "flex") {

    if (!element)
        return;

    element.classList.remove("hidden");
    element.style.display = display;
}


function hideElement(element) {

    if (!element)
        return;

    element.classList.add("hidden");
    element.style.display = "none";
}


/* =================================================
   ПРОГРЕСС
================================================= */

let completedNight =
    Number(
        localStorage.getItem(
            "bloodGlowNightCompleted"
        )
    ) || 0;

let selectedNight = 1;


/* =================================================
   СОСТОЯНИЕ
================================================= */

let gameStarted = false;
let gameOver = false;
let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";
let currentCamera = "cam01";

let flashCooldown = false;


/* =================================================
   ЭНЕРГИЯ
================================================= */

let energyTarget = "camera";

let leverDragging = false;
let leverStartTime = 0;
let leverCompleted = false;

const LEVER_TIME = 3000;


/* =================================================
   НЕМКА
================================================= */

let nemkaActive = false;

let nemkaPosition = 0;

/*
0 = не активна
1 = движется к щитку
2 = у щитка
3 = после отключения идёт назад
4 = правый коридор
5 = у двери
*/

let electricityOn = true;
let backupActive = false;

let nemkaMeowCooldown = false;


/* =================================================
   ЛИЧИ
================================================= */

let lichiPosition = 0;


/*
0 = далеко
1 = путь
2 = коридор
3 = рядом
4 = атака
*/


/* =================================================
   ПАНКЕЙК
================================================= */

let pancakePosition = 0;


/*
0 = отсутствует
1 = вентиляция
2 = близко
3 = атака
*/


let pancakeAttackTimer = null;


/* =================================================
   ДЕЛЬТА
================================================= */

let deltaPosition = 0;


/*
0 = чердак
1 = верхняя вентиляция
2 = нижняя вентиляция
3 = у офиса
*/


let deltaVent = "upper";

let deltaAttackTimer = null;


/* =================================================
   ЛИЗКА
================================================= */

let lizkaActive = false;

let fencePowered = false;

let fenceSequence = [];

let fenceExpected = 1;


/* =================================================
   КАМЕРЫ
================================================= */

const cameraImages = {

    cam01: "images/cam01.png",
    cam02: "images/cam02.png",
    cam03: "images/cam03.png",
    cam04: "images/cam04.png",
    cam05: "images/cam05.png",
    cam06: "images/cam06.png",
    cam07: "images/cam07.png"

};


/* =================================================
   ПОЗИЦИИ
================================================= */

const lichiCameraPositions = {

    1: "cam01",
    2: "cam02",
    3: "cam06",
    4: "cam06"

};


const pancakeCameraPositions = {

    1: "cam04",
    2: "cam05",
    3: "cam05"

};


const nemkaCameraPositions = {

    1: "cam02",
    2: "cam04",
    3: "cam06",
    4: "cam07",
    5: "cam07"

};


/* =================================================
   ОФИС
================================================= */

const officeViews = {

    front:
        "images/office_front.png",

    left:
        "images/office_left.png",

    right:
        "images/office_right.png"

};


/* =================================================
   ДЛИТЕЛЬНОСТЬ
================================================= */

function getNightDurationMinutes() {

    /*
       Ночь 4 = 8 минут
       Ночь 5 = 9 минут
    */

    return 4 + selectedNight;

}


function getGameMinuteTime() {

    /*
       360 игровых минут
       проходят за всю ночь.

       Поэтому каждый тик =
       длительность / 360.
    */

    return (
        getNightDurationMinutes()
        * 60
        * 1000
        / 360
    );

}


let gameTimer = null;


/* =================================================
   МЕНЮ
================================================= */

document
.getElementById("startGameButton")
.addEventListener(
    "click",
    function () {

        selectedNight = 1;

        enterFullscreen();

        startSelectedNight();

    }
);


document
.getElementById("nightsButton")
.addEventListener(
    "click",
    function () {

        renderNights();

        hideElement(mainMenu);

        showElement(
            nightsMenu,
            "flex"
        );

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function () {

        hideElement(nightsMenu);

        showElement(
            mainMenu,
            "flex"
        );

    }
);


/* =================================================
   СПИСОК НОЧЕЙ
================================================= */

function renderNights() {

    nightsList.innerHTML = "";

    for (
        let i = 1;
        i <= 13;
        i++
    ) {

        const button =
            document.createElement("button");

        button.className =
            "nightButton";

        const unlocked =
            i === 1 ||
            i <= completedNight + 1;

        if (!unlocked) {

            button.classList.add("locked");

            button.textContent =
                "🔒 NIGHT " + i;

            button.disabled = true;

        } else {

            button.textContent =
                "NIGHT " + i;

            button.addEventListener(
                "click",
                function () {

                    selectedNight = i;

                    enterFullscreen();

                    startSelectedNight();

                }
            );

        }

        nightsList.appendChild(button);

    }

}


/* =================================================
   НАСТРОЙКИ
================================================= */

document
.getElementById("settingsButton")
.addEventListener(
    "click",
    function () {

        hideElement(mainMenu);

        showElement(
            settingsMenu,
            "flex"
        );

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function () {

        hideElement(settingsMenu);

        showElement(
            mainMenu,
            "flex"
        );

    }
);


/* =================================================
   FULLSCREEN
================================================= */

async function enterFullscreen() {

    try {

        if (
            !document.fullscreenElement &&
            document.documentElement.requestFullscreen
        ) {

            await document.documentElement.requestFullscreen();

        }

    } catch (error) {

        console.log(error);

    }

}


document
.getElementById("fullscreenButton")
.addEventListener(
    "click",
    enterFullscreen
);


/* =================================================
   СБРОС
================================================= */

document
.getElementById("resetProgress")
.addEventListener(
    "click",
    function () {

        completedNight = 0;

        localStorage.removeItem(
            "bloodGlowNightCompleted"
        );

        renderNights();

        alert("Прогресс сброшен.");

    }
);


/* =================================================
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    stopGameTimer();

    clearTimeout(pancakeAttackTimer);
    clearTimeout(deltaAttackTimer);

    pancakeAttackTimer = null;
    deltaAttackTimer = null;

    hideElement(mainMenu);
    hideElement(nightsMenu);
    hideElement(settingsMenu);

    hideElement(gameOverScreen);
    hideElement(winScreen);
    hideElement(cameraPanel);
    hideElement(energyPanel);
    hideElement(backupPanel);
    hideElement(fencePanel);

    showElement(phoneScreen, "flex");

    hideElement(game);

    gameStarted = false;
    gameOver = false;
    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";
    currentCamera = "cam01";

    energyTarget = "camera";

    electricityOn = true;
    backupActive = false;

    nemkaActive = false;
    nemkaPosition = 0;

    lichiPosition = 0;
    pancakePosition = 0;

    deltaPosition = 0;
    deltaVent = "upper";

    lizkaActive = false;
    fencePowered = false;
    fenceSequence = [];
    fenceExpected = 1;

    leverDragging = false;
    leverCompleted = false;

    leverProgressBar.style.width = "0%";
    lever.style.top = "20px";

    lichi.style.display = "none";
    pancake.style.display = "none";

    nemkaEyes.classList.remove(
        "nemkaEyesActive"
    );

    cameraNemkaEyes.classList.remove(
        "nemkaEyesActive"
    );

    nightDisplay.textContent =
        "NIGHT " + selectedNight;

    document
    .getElementById("phoneNight")
    .textContent =
        "NIGHT " + selectedNight;

    time.textContent =
        "12:00 AM";

    status.textContent =
        "ОФИС";

    view.style.backgroundImage =
        `url("${officeViews.front}")`;

    energyTargetText.textContent =
        "КАМЕРА";

    energyMessage.textContent =
        "Энергия направлена на камеры.";

    catMessage.textContent =
        "Выберите камеру и воспроизведите мяуканье.";

    try {

        phoneAudio.pause();
        phoneAudio.currentTime = 0;

        phoneAudio.play()
            .catch(() => {});

    } catch (e) {}

}


/* =================================================
   ПРОПУСК ЗВОНКА
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function () {

        try {

            phoneAudio.pause();
            phoneAudio.currentTime = 0;

        } catch (e) {}

        startNightAfterPhone();

    }
);


phoneAudio.addEventListener(
    "ended",
    startNightAfterPhone
);


/* =================================================
   ПОСЛЕ ЗВОНКА
================================================= */

function startNightAfterPhone() {

    if (gameStarted)
        return;

    gameStarted = true;

    hideElement(phoneScreen);

    showElement(game, "block");

    try {

        humAudio.currentTime = 0;

        humAudio.play()
            .catch(() => {});

    } catch (e) {}

    updateEverything();

    startGameTimer();

}


/* =================================================
   ТАЙМЕР
================================================= */

function startGameTimer() {

    stopGameTimer();

    /*
       Используем setInterval.
       Один тик = одна игровая минута.
    */

    gameTimer =
        setInterval(
            function () {

                if (!gameStarted)
                    return;

                if (gameOver)
                    return;

                if (nightFinished)
                    return;

                gameMinutes++;

                updateClock();

                updateCharactersByTime();

                updateEverything();

                if (
                    gameMinutes >= 360
                ) {

                    winGame();

                }

            },
            getGameMinuteTime()
        );

}


function stopGameTimer() {

    if (gameTimer !== null) {

        clearInterval(gameTimer);

        gameTimer = null;

    }

}


/* =================================================
   ВРЕМЯ
================================================= */

function updateClock() {

    if (gameMinutes >= 360) {

        time.textContent = "6:00 AM";

        return;

    }

    const hour =
        Math.floor(gameMinutes / 60);

    const minute =
        gameMinutes % 60;

    const displayHour =
        hour === 0
            ? 12
            : hour;

    time.textContent =
        displayHour +
        ":" +
        String(minute).padStart(2, "0") +
        " AM";

}


/* =================================================
   МЕХАНИКИ ПО ВРЕМЕНИ
================================================= */

function updateCharactersByTime() {

    /*
       ==========================
       НЕМКА
       ==========================
       Только 4 и 5 ночь.
    */

    if (
        selectedNight >= 4 &&
        gameMinutes >= 60 &&
        electricityOn
    ) {

        nemkaActive = true;

        /*
           Движение каждые 25 игровых минут.
        */

        if (
            gameMinutes % 25 === 0 &&
            nemkaPosition < 2
        ) {

            nemkaPosition++;

            playSound(nemkaAudio);

        }

    }


    /*
       После отключения света
       Немка идёт к правому коридору.
    */

    if (
        nemkaActive &&
        !electricityOn &&
        backupActive
    ) {

        if (
            gameMinutes % 20 === 0 &&
            nemkaPosition < 5
        ) {

            nemkaPosition++;

            playSound(nemkaAudio);

        }

    }


    /*
       ==========================
       ЛИЧИ
       ==========================
       Только 5 ночь.
    */

    if (
        selectedNight >= 5 &&
        gameMinutes >= 40
    ) {

        if (
            gameMinutes % 35 === 0 &&
            lichiPosition < 4
        ) {

            lichiPosition++;

            playSound(lichiAudio);

        }

    }


    /*
       ==========================
       ПАНКЕЙК
       ==========================
       Ночи 4 и 5.
    */

    if (
        selectedNight >= 4 &&
        gameMinutes >= 120
    ) {

        if (
            gameMinutes % 35 === 0 &&
            pancakePosition < 3
        ) {

            pancakePosition++;

            playSound(pancakeAudio);

        }

    }


    /*
       ==========================
       ДЕЛЬТА
       ==========================
       Ночи 4 и 5.
    */

    if (
        selectedNight >= 4 &&
        gameMinutes >= 120
    ) {

        if (
            gameMinutes % 45 === 0 &&
            deltaPosition < 3
        ) {

            deltaPosition++;

            playSound(ventAudio);

        }

    }


    /*
       ==========================
       ЛИЗКА
       ==========================
       Только 5 ночь.
    */

    if (
        selectedNight >= 5 &&
        gameMinutes >= 150
    ) {

        lizkaActive = true;

    }


    updateNemka();
    updatePancake();
    updateDelta();
    updateLizka();

}


/* =================================================
   НЕМКА
================================================= */

function updateNemka() {

    /*
       До 1:00 она полностью неактивна.
    */

    if (
        !nemkaActive
    ) {

        nemkaEyes.classList.remove(
            "nemkaEyesActive"
        );

        cameraNemkaEyes.classList.remove(
            "nemkaEyesActive"
        );

        return;

    }


    /*
       Глаза появляются на камере,
       когда Немка движется.
    */

    if (
        nemkaPosition >= 1 &&
        nemkaPosition < 3
    ) {

        cameraNemkaEyes.classList.add(
            "nemkaEyesActive"
        );

    } else {

        cameraNemkaEyes.classList.remove(
            "nemkaEyesActive"
        );

    }


    /*
       Если дошла до щитка.
    */

    if (
        nemkaPosition >= 2 &&
        electricityOn
    ) {

        status.textContent =
            "НЕМКА У ЭЛЕКТРОЩИТКА!";

        /*
           Отключаем электричество.
        */

        turnOffElectricity();

        return;

    }


    /*
       После резервной системы
       Немка идёт к правой двери.
    */

    if (
        !electricityOn &&
        backupActive &&
        nemkaPosition >= 3
    ) {

        status.textContent =
            "НЕМКА ИДЁТ К ПРАВОМУ КОРИДОРУ!";

    }


    /*
       Немка дошла до двери.
    */

    if (
        nemkaPosition >= 5
    ) {

        /*
           Энергия должна быть
           на правой двери.
        */

        if (
            energyTarget === "door"
        ) {

            status.textContent =
                "ПРАВАЯ ДВЕРЬ ЗАКРЫЛА НЕМКУ.";

            nemkaPosition = 0;

            nemkaActive = false;

        } else {

            loseGame(
                "Немка добралась до офиса."
            );

        }

    }

}


/* =================================================
   ОТКЛЮЧЕНИЕ ЭЛЕКТРИЧЕСТВА
================================================= */

function turnOffElectricity() {

    if (!electricityOn)
        return;

    electricityOn = false;

    energyTarget = "camera";

    playSound(powerOffAudio);

    status.textContent =
        "НЕМКА ОТКЛЮЧИЛА ЭЛЕКТРИЧЕСТВО!";

    hideElement(cameraPanel);
    hideElement(energyPanel);

    setTimeout(
        function () {

            if (
                !gameOver &&
                !backupActive
            ) {

                showElement(
                    backupPanel,
                    "flex"
                );

            }

        },
        1000
    );

}


/* =================================================
   МЯУКАНЬЕ
================================================= */

document
.getElementById("catMeowButton")
.addEventListener(
    "click",
    playCatMeow
);


function playCatMeow() {

    if (!gameStarted)
        return;

    /*
       В начале ночи мяуканье
       не действует.
    */

    if (
        !nemkaActive
    ) {

        catMessage.textContent =
            "НЕМКА ЕЩЁ НЕ АКТИВНА.";

        return;

    }

    if (!electricityOn) {

        catMessage.textContent =
            "ЭЛЕКТРИЧЕСТВО ОТКЛЮЧЕНО.";

        return;

    }

    if (nemkaMeowCooldown)
        return;

    nemkaMeowCooldown = true;

    playSound(catAudio);

    catMessage.textContent =
        "НЕМКА УСЛЫШАЛА МЯУКАНЬЕ!";

    /*
       Немка бежит к камере,
       на которой проиграли звук.
    */

    if (
        nemkaPosition > 0 &&
        nemkaPosition < 4
    ) {

        nemkaPosition = 1;

        status.textContent =
            "НЕМКА ОТВЛЕЧЕНА МЯУКАНЬЕМ!";

    }

    setTimeout(
        function () {

            nemkaMeowCooldown = false;

        },
        1000
    );

}


/* =================================================
   РЕЗЕРВНАЯ СИСТЕМА
================================================= */

const backupButtons =
    document.querySelectorAll(
        "#backupWires button"
    );

let backupSequence = [];
let backupExpected = 1;


backupButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (backupActive)
                    return;

                const wire =
                    Number(
                        button.dataset.wire
                    );

                if (
                    wire === backupExpected
                ) {

                    button.classList.add(
                        "wireSelected"
                    );

                    backupSequence.push(
                        wire
                    );

                    backupExpected++;

                    backupMessage.textContent =
                        "Правильно. Следующий провод.";

                    if (
                        backupExpected > 4
                    ) {

                        activateBackup();

                    }

                } else {

                    backupSequence = [];
                    backupExpected = 1;

                    backupButtons.forEach(
                        b =>
                            b.classList.remove(
                                "wireSelected"
                            )
                    );

                    backupMessage.textContent =
                        "Неверно. Начните заново.";

                }

            }
        );

    }
);


function activateBackup() {

    backupActive = true;

    playSound(backupAudio);

    hideElement(backupPanel);

    status.textContent =
        "РЕЗЕРВНАЯ СИСТЕМА ЗАПУЩЕНА.";

    /*
       Немка после этого
       направляется к правой двери.
    */

    if (
        nemkaPosition < 3
    ) {

        nemkaPosition = 3;

    }

}


/* =================================================
   ПАНКЕЙК
================================================= */

function updatePancake() {

    if (
        pancakePosition < 3
    )
        return;

    if (
        pancakeAttackTimer
    )
        return;

    /*
       Панкейк атакует переднее окно.
    */

    pancakeAttackTimer =
        setTimeout(
            function () {

                pancakeAttackTimer =
                    null;

                if (gameOver)
                    return;

                /*
                   Для этой ночи
                   достаточно сменить
                   перекрытие вентиляции.
                */

                if (
                    deltaVent === "lower"
                ) {

                    pancakePosition = 0;

                    pancake.style.display =
                        "none";

                    status.textContent =
                        "ПАНКЕЙК ОСТАНОВЛЕН ПЕРЕКРЫТИЕМ.";

                } else {

                    loseGame(
                        "Панкейк добрался до офиса."
                    );

                }

            },
            10000
        );

}


/* =================================================
   ДЕЛЬТА
================================================= */

function updateDelta() {

    if (
        deltaPosition < 2
    )
        return;

    /*
       Дельта видна возле вентиляции.
    */

    if (
        currentView === "front"
    ) {

        status.textContent =
            "ДЕЛЬТА В ВЕНТИЛЯЦИИ: " +
            deltaVent.toUpperCase();

    }


    if (
        deltaPosition >= 3
    ) {

        /*
           Если мусоросжигание
           не использовали — проигрыш.
        */

        if (
            deltaVent === "upper"
        ) {

            loseGame(
                "Дельта добралась через вентиляцию."
            );

        }

    }

}


/* =================================================
   ПЕРЕКЛЮЧЕНИЕ ВЕНТИЛЯЦИИ
================================================= */

function switchVentilation() {

    if (
        selectedNight < 4
    )
        return;

    if (
        !electricityOn
    ) {

        status.textContent =
            "ВЕНТИЛЯЦИЯ НЕ РАБОТАЕТ БЕЗ ЭЛЕКТРИЧЕСТВА.";

        return;

    }

    if (
        deltaVent === "upper"
    ) {

        deltaVent = "lower";

    } else {

        deltaVent = "upper";

    }

    status.textContent =
        "ПЕРЕКРЫТИЕ: " +
        deltaVent.toUpperCase();

}


/* =================================================
   КНОПКА ВЕНТИЛЯЦИИ
================================================= */

document
.getElementById("frontButton")
.addEventListener(
    "dblclick",
    switchVentilation
);


/* =================================================
   ЛИЗКА
================================================= */

function updateLizka() {

    if (!lizkaActive)
        return;

    if (fencePowered)
        return;

    status.textContent =
        "ЛИЗКА НАПРАВЛЯЕТСЯ К РЕЗЕРВУ.";

}


/* =================================================
   ОТКРЫТИЕ МИНИ-ИГРЫ ЗАБОРА
================================================= */

document
.getElementById("energyButton")
.addEventListener(
    "dblclick",
    function () {

        if (
            selectedNight >= 5 &&
            lizkaActive
        ) {

            showElement(
                fencePanel,
                "flex"
            );

        }

    }
);


/* =================================================
   ПРОВОДА ЛИЗКИ
================================================= */

document
.querySelectorAll(
    "#fenceWires button"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (fencePowered)
                    return;

                const value =
                    Number(
                        button.dataset.fence
                    );

                if (
                    value === fenceExpected
                ) {

                    button.classList.add(
                        "wireSelected"
                    );

                    fenceExpected++;

                    fenceMessage.textContent =
                        "Соединение правильное.";

                    if (
                        fenceExpected > 4
                    ) {

                        fencePowered = true;

                        hideElement(
                            fencePanel
                        );

                        status.textContent =
                            "ЭЛЕКТРИЧЕСКИЙ ЗАБОР ВКЛЮЧЁН!";

                    }

                } else {

                    fenceExpected = 1;

                    document
                    .querySelectorAll(
                        "#fenceWires button"
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                "wireSelected"
                            )
                    );

                    fenceMessage.textContent =
                        "Ошибка соединения. Начните заново.";

                }

            }
        );

    }
);


/* =================================================
   ЛИЧИ
================================================= */

function updateLichi() {

    lichi.style.display = "none";

    if (
        selectedNight < 5
    )
        return;

    if (
        lichiPosition < 2
    )
        return;

    if (
        currentView !== "left"
    )
        return;

    lichi.style.display =
        "block";

    lichi.style.left =
        lichiPosition === 2
            ? "75%"
            : lichiPosition === 3
                ? "58%"
                : "50%";

    lichi.style.top = "50%";

    lichi.style.width =
        lichiPosition === 2
            ? "130px"
            : lichiPosition === 3
                ? "190px"
                : "270px";

}


/* =================================================
   ВСПЫШКА
================================================= */

document
.getElementById("flashButton")
.addEventListener(
    "click",
    useFlash
);


function useFlash() {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (!electricityOn) {

        status.textContent =
            "ЭЛЕКТРИЧЕСТВА НЕТ.";

        return;

    }

    if (
        energyTarget !== "camera"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ.";

        return;

    }

    if (
        currentView !== "left"
    ) {

        status.textContent =
            "ПОСМОТРИ В ЛЕВЫЙ КОРИДОР.";

        return;

    }

    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "ЛИЧИ ЕЩЁ ДАЛЕКО.";

        return;

    }

    if (flashCooldown)
        return;

    flashCooldown = true;

    flash.style.opacity = "1";

    setTimeout(
        function () {

            flash.style.opacity = "0";

        },
        120
    );

    playSound(flashAudio);

    lichiPosition = 0;

    lichi.style.display =
        "none";

    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";

    setTimeout(
        function () {

            flashCooldown = false;

        },
        1500
    );

}


/* =================================================
   ПОВОРОТЫ
================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    currentView = direction;

    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;

    if (direction === "left") {

        status.textContent =
            "ЛЕВЫЙ КОРИДОР";

    }

    else if (direction === "right") {

        status.textContent =
            energyTarget === "door"
                ? "ПРАВАЯ ДВЕРЬ ЗАКРЫТА"
                : "ПРАВЫЙ КОРИДОР";

    }

    else {

        status.textContent =
            "ОФИС";

    }

    updateOfficeCharacters();

}


document
.getElementById("leftButton")
.addEventListener(
    "click",
    function () {

        changeView("left");

    }
);


document
.getElementById("frontButton")
.addEventListener(
    "click",
    function () {

        changeView("front");

    }
);


document
.getElementById("rightButton")
.addEventListener(
    "click",
    function () {

        changeView("right");

    }
);


/* =================================================
   ПЕРСОНАЖИ В ОФИСЕ
================================================= */

function updateOfficeCharacters() {

    lichi.style.display = "none";
    pancake.style.display = "none";

    updateLichi();

    /*
       Панкейк по центру
       во время атаки.
    */

    if (
        pancakePosition >= 3 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left =
            "50%";

        pancake.style.top =
            "50%";

        pancake.style.width =
            "300px";

    }


    /*
       Панкейк возле окна.
    */

    else if (
        pancakePosition === 2 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left =
            "75%";

        pancake.style.top =
            "55%";

        pancake.style.width =
            "180px";

    }

}


/* =================================================
   КАМЕРЫ
================================================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (!electricityOn) {

            status.textContent =
                "КАМЕРЫ НЕ РАБОТАЮТ: НЕТ ЭЛЕКТРИЧЕСТВА.";

            return;

        }

        if (
            energyTarget !== "camera"
        ) {

            status.textContent =
                "ЭНЕРГИЯ НЕ НАПРАВЛЕНА НА КАМЕРЫ.";

            return;

        }

        showElement(
            cameraPanel,
            "flex"
        );

        showCamera(currentCamera);

    }
);


document
.getElementById("closeCameraPanel")
.addEventListener(
    "click",
    function () {

        hideElement(cameraPanel);

        updateOfficeCharacters();

    }
);


/* =================================================
   ПОКАЗ КАМЕРЫ
================================================= */

function showCamera(camera) {

    currentCamera = camera;

    const image =
        cameraImages[camera];

    if (!image)
        return;

    cameraImage.style.backgroundImage =
        `url("${image}")`;

    cameraNumber.textContent =
        camera.toUpperCase();

    updateCameraCharacters();

}


/* =================================================
   КНОПКИ КАМЕР
================================================= */

document
.querySelectorAll(
    "#cameraMap [data-camera]"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (
                    energyTarget !== "camera"
                )
                    return;

                if (
                    !electricityOn
                )
                    return;

                showCamera(
                    button.dataset.camera
                );

            }
        );

    }
);


/* =================================================
   ПЕРСОНАЖИ НА КАМЕРАХ
================================================= */

function updateCameraCharacters() {

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";

    cameraNemkaEyes.classList.remove(
        "cameraNemkaEyes"
    );


    if (
        !electricityOn
    )
        return;


    if (
        energyTarget !== "camera"
    )
        return;


    /*
       ЛИЧИ
    */

    if (
        lichiCameraPositions[
            lichiPosition
        ] === currentCamera
    ) {

        cameraLichi.style.display =
            "block";

    }


    /*
       ПАНКЕЙК
    */

    if (
        pancakeCameraPositions[
            pancakePosition
        ] === currentCamera
    ) {

        cameraPancake.style.display =
            "block";

    }


    /*
       НЕМКА
    */

    if (
        nemkaActive &&
        nemkaCameraPositions[
            nemkaPosition
        ] === currentCamera
    ) {

        cameraNemkaEyes.classList.add(
            "nemkaEyesActive"
        );

    }

}


/* =================================================
   ЭНЕРГИЯ
================================================= */

document
.getElementById("energyButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        showElement(
            energyPanel,
            "flex"
        );

        updateEnergyUI();

    }
);


document
.getElementById("closeEnergyPanel")
.addEventListener(
    "click",
    function () {

        hideElement(energyPanel);

        leverDragging = false;
        leverCompleted = false;

        leverProgressBar.style.width =
            "0%";

        lever.style.top =
            "20px";

    }
);


/* =================================================
   ЭНЕРГИЯ UI
================================================= */

function updateEnergyUI() {

    if (
        energyTarget === "camera"
    ) {

        energyTargetText.textContent =
            "КАМЕРА";

        energyMessage.textContent =
            "Энергия на камерах. Вспышка доступна.";

    }

    else if (
        energyTarget === "door"
    ) {

        energyTargetText.textContent =
            "ПРАВАЯ ДВЕРЬ";

        energyMessage.textContent =
            "Правая дверь закрыта.";

    }

}


/* =================================================
   РЫЧАГ
================================================= */

function startLeverDrag(event) {

    if (!gameStarted)
        return;

    if (leverCompleted)
        return;

    event.preventDefault();

    leverDragging = true;

    leverStartTime =
        performance.now();

    requestAnimationFrame(
        updateLever
    );

}


function updateLever() {

    if (!leverDragging)
        return;

    const elapsed =
        performance.now() -
        leverStartTime;

    const progress =
        Math.min(
            elapsed / LEVER_TIME,
            1
        );

    const maxTop = 95;

    lever.style.top =
        (
            20 +
            maxTop * progress
        ) + "px";

    leverProgressBar.style.width =
        (
            progress * 100
        ) + "%";


    if (
        progress >= 1
    ) {

        completeLever();

        return;

    }

    requestAnimationFrame(
        updateLever
    );

}


function stopLeverDrag() {

    if (!leverDragging)
        return;

    if (!leverCompleted) {

        leverDragging = false;

        leverProgressBar.style.width =
            "0%";

        lever.style.top =
            "20px";

        energyMessage.textContent =
            "Нужно тянуть рычаг все 3 секунды.";

    }

}


function completeLever() {

    if (leverCompleted)
        return;

    leverCompleted = true;
    leverDragging = false;


    /*
       Камера -> правая дверь
       Правая дверь -> камера
    */

    if (
        energyTarget === "camera"
    ) {

        energyTarget = "door";

    } else {

        energyTarget = "camera";

    }


    updateEnergyUI();

    updateCameraCharacters();

    if (
        energyTarget === "door"
    ) {

        hideElement(cameraPanel);

        status.textContent =
            "ЭНЕРГИЯ НА ПРАВОЙ ДВЕРИ. ДВЕРЬ ЗАКРЫТА.";

    } else {

        status.textContent =
            "ЭНЕРГИЯ СНОВА НА КАМЕРАХ.";

    }


    setTimeout(
        function () {

            leverCompleted = false;

            leverProgressBar.style.width =
                "0%";

            lever.style.top =
                "20px";

        },
        500
    );

}


lever.addEventListener(
    "mousedown",
    startLeverDrag
);

document.addEventListener(
    "mouseup",
    stopLeverDrag
);


lever.addEventListener(
    "touchstart",
    startLeverDrag,
    {
        passive: false
    }
);

document.addEventListener(
    "touchend",
    stopLeverDrag
);


/* =================================================
   ОБНОВЛЕНИЕ
================================================= */

function updateEverything() {

    updateClock();

    updateNemka();

    updateLichi();

    updatePancake();

    updateDelta();

    updateLizka();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateEnergyUI();

}


/* =================================================
   ЗВУК
================================================= */

function playSound(audio) {

    if (!audio)
        return;

    try {

        audio.pause();

        audio.currentTime = 0;

        audio.play()
            .catch(() => {});

    } catch (e) {}

}


/* =================================================
   GAME OVER
================================================= */

function loseGame(reason = "Ты проиграл.") {

    if (gameOver)
        return;

    gameOver = true;

    stopGameTimer();

    clearTimeout(pancakeAttackTimer);
    clearTimeout(deltaAttackTimer);

    pancakeAttackTimer = null;
    deltaAttackTimer = null;

    loseReason.textContent =
        reason;

    try {

        humAudio.pause();
        ventAudio.pause();

        playSound(screamAudio);

    } catch (e) {}

    showElement(
        gameOverScreen,
        "flex"
    );

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;

    nightFinished = true;

    stopGameTimer();

    clearTimeout(pancakeAttackTimer);
    clearTimeout(deltaAttackTimer);

    try {

        humAudio.pause();
        ventAudio.pause();

    } catch (e) {}


    if (
        selectedNight > completedNight
    ) {

        completedNight =
            selectedNight;

        localStorage.setItem(
            "bloodGlowNightCompleted",
            completedNight
        );

    }


    winText.textContent =
        "NIGHT " +
        selectedNight +
        " COMPLETE";


    if (
        selectedNight >= 13
    ) {

        nextNightButton.style.display =
            "none";

    } else {

        nextNightButton.style.display =
            "block";

    }


    showElement(
        winScreen,
        "flex"
    );

}


/* =================================================
   СЛЕДУЮЩАЯ НОЧЬ
================================================= */

nextNightButton.addEventListener(
    "click",
    function () {

        if (
            selectedNight < 13
        ) {

            selectedNight++;

            startSelectedNight();

        }

    }
);


/* =================================================
   ПОВТОР
================================================= */

document
.getElementById("restart")
.addEventListener(
    "click",
    function () {

        startSelectedNight();

    }
);


/* =================================================
   МЕНЮ
================================================= */

document
.getElementById("menuAfterLose")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

        hideElement(game);
        hideElement(gameOverScreen);

        showElement(
            mainMenu,
            "flex"
        );

        renderNights();

    }
);


document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

        hideElement(game);
        hideElement(winScreen);

        showElement(
            mainMenu,
            "flex"
        );

        renderNights();

    }
);


/* =================================================
   НАЧАЛЬНОЕ СОСТОЯНИЕ
================================================= */

hideElement(nightsMenu);
hideElement(settingsMenu);
hideElement(phoneScreen);
hideElement(game);
hideElement(cameraPanel);
hideElement(energyPanel);
hideElement(backupPanel);
hideElement(fencePanel);
hideElement(gameOverScreen);
hideElement(winScreen);

showElement(
    mainMenu,
    "flex"
);

renderNights();

energyTarget = "camera";

updateEnergyUI();
