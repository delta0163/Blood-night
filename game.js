/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 1 + NIGHT 2
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

const game =
    document.getElementById("game");

const phoneScreen =
    document.getElementById("phoneScreen");

const phoneAudio =
    document.getElementById("phoneAudio");

const flashAudio =
    document.getElementById("flashAudio");

const lichiAudio =
    document.getElementById("lichiAudio");

const humAudio =
    document.getElementById("humAudio");

const pancakeAudio =
    document.getElementById("pancakeAudio");

const screamAudio =
    document.getElementById("screamAudio");

const leverAudio =
    document.getElementById("leverAudio");

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const pancake =
    document.getElementById("pancake");

const flash =
    document.getElementById("flash");

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

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");

const leverButton =
    document.getElementById("leverButton");

const powerPanel =
    document.getElementById("powerPanel");

const powerStatus =
    document.getElementById("powerStatus");

const powerDescription =
    document.getElementById("powerDescription");

const powerProgressBar =
    document.getElementById("powerProgressBar");

const powerChoices =
    document.querySelectorAll(
        ".powerChoice"
    );

const loseReason =
    document.getElementById("loseReason");


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

let gameTimer = null;


/* =================================================
   ЭЛЕКТРИЧЕСТВО
================================================= */

let currentPower =
    "office";

let powerChanging =
    false;

let powerChangeTimer =
    null;

let pancakeAttackTimer =
    null;

let pancakeAttackActive =
    false;


/* =================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
=================================================

   NIGHT 1 = 5 минут
   NIGHT 2 = 6 минут
   NIGHT 3 = 7 минут

   Каждая следующая ночь
   длиннее на одну минуту.

   360 игровых минут =
   6 игровых часов.
================================================= */

function getNightDuration() {

    return 4 + selectedNight;

}


/* =================================================
   ВРЕМЯ ОДНОЙ ИГРОВОЙ МИНУТЫ
================================================= */

function getGameMinuteTime() {

    const realMinutes =
        getNightDuration();

    const totalSeconds =
        realMinutes * 60;

    return (
        totalSeconds * 1000 / 360
    );

}


/* =================================================
   ЛИЧИ
================================================= */

/*
   0 = далеко
   1 = начинает движение
   2 = коридор
   3 = рядом
   4 = атака
*/

let lichiPosition = 0;


/* =================================================
   ПАНКЕЙК
================================================= */

/*
   0 = отсутствует
   1 = появляется
   2 = подходит к окну
   3 = начинает ломать окно
*/

let pancakePosition = 0;


/* =================================================
   КАМЕРЫ
================================================= */

const cameraImages = {

    cam01:
        "images/cam01.png",

    cam02:
        "images/cam02.png",

    cam03:
        "images/cam03.png",

    cam04:
        "images/cam04.png",

    cam05:
        "images/cam05.png",

    cam06:
        "images/cam06.png",

    cam07:
        "images/cam07.png"

};


/* =================================================
   ЛИЧИ НА КАМЕРАХ
================================================= */

const lichiCameraPositions = {

    1: "cam01",

    2: "cam01",

    3: "cam06",

    4: "cam06"

};


/* =================================================
   ПАНКЕЙК НА КАМЕРАХ
================================================= */

const pancakeCameraPositions = {

    1: "cam04",

    2: "cam05",

    3: "cam07"

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

            mainMenu.style.display =
                "none";

            nightsMenu.style.display =
                "flex";

        }
    );


document
    .getElementById("closeNights")
    .addEventListener(
        "click",
        function () {

            nightsMenu.style.display =
                "none";

            mainMenu.style.display =
                "flex";

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
            document.createElement(
                "button"
            );

        button.className =
            "nightButton";

        const unlocked =
            i === 1 ||
            i <= completedNight + 1;

        if (!unlocked) {

            button.classList.add(
                "locked"
            );

            button.textContent =
                "🔒 NIGHT " + i;

            button.disabled =
                true;

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

        nightsList.appendChild(
            button
        );

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

            mainMenu.style.display =
                "none";

            settingsMenu.style.display =
                "flex";

        }
    );


document
    .getElementById("closeSettings")
    .addEventListener(
        "click",
        function () {

            settingsMenu.style.display =
                "none";

            mainMenu.style.display =
                "flex";

        }
    );


/* =================================================
   FULLSCREEN
================================================= */

async function enterFullscreen() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await document
                .documentElement
                .requestFullscreen();

        }

    } catch (error) {

        console.log(
            "Fullscreen:",
            error
        );

    }

}


document
    .getElementById("fullscreenButton")
    .addEventListener(
        "click",
        enterFullscreen
    );


/* =================================================
   СБРОС ПРОГРЕССА
================================================= */

document
    .getElementById("resetProgress")
    .addEventListener(
        "click",
        function () {

            if (
                !confirm(
                    "Сбросить весь прогресс?"
                )
            ) return;

            completedNight = 0;

            localStorage.removeItem(
                "bloodGlowNightCompleted"
            );

            renderNights();

            alert(
                "Прогресс сброшен."
            );

        }
    );


/* =================================================
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    clearInterval(
        powerChangeTimer
    );

    mainMenu.style.display =
        "none";

    nightsMenu.style.display =
        "none";

    settingsMenu.style.display =
        "none";

    phoneScreen.style.display =
        "flex";

    game.style.display =
        "none";

    gameStarted = false;

    gameOver = false;

    nightFinished = false;

    gameMinutes = 0;

    currentView =
        "front";

    currentCamera =
        "cam01";

    lichiPosition =
        0;

    pancakePosition =
        0;

    currentPower =
        "office";

    powerChanging =
        false;

    pancakeAttackActive =
        false;

    flashCooldown =
        false;

    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;

    document
        .getElementById("phoneNight")
        .textContent =
        "NIGHT " +
        selectedNight;

    time.textContent =
        "12:00 AM";

    status.textContent =
        "ОФИС";

    loseReason.textContent =
        "ПАНКЕЙК ДОБРАЛСЯ ДО ОКНА.";

    view.style.backgroundImage =
        `url("${officeViews.front}")`;

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";

    cameraPanel.style.display =
        "none";

    powerPanel.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    winScreen.style.display =
        "none";

    powerStatus.textContent =
        "ЭЛЕКТРИЧЕСТВО: ОФИС";

    powerDescription.textContent =
        "Выберите, куда перенаправить электричество.";

    powerProgressBar.style.width =
        "0%";

    setPowerButtons(
        false
    );

    phoneAudio.currentTime =
        0;

    phoneAudio.play()
        .catch(
            function () {}
        );

}


/* =================================================
   ПРОПУСТИТЬ ЗВОНОК
================================================= */

document
    .getElementById("skipPhoneButton")
    .addEventListener(
        "click",
        function () {

            phoneAudio.pause();

            phoneAudio.currentTime =
                0;

            startNightAfterPhone();

        }
    );


phoneAudio.addEventListener(
    "ended",
    function () {

        startNightAfterPhone();

    }
);


/* =================================================
   ПОСЛЕ ЗВОНКА
================================================= */

function startNightAfterPhone() {

    if (gameStarted)
        return;

    gameStarted =
        true;

    phoneScreen.style.display =
        "none";

    game.style.display =
        "block";

    humAudio.currentTime =
        0;

    humAudio.play()
        .catch(
            function () {}
        );

    updateEverything();

    startGameTimer();

}


/* =================================================
   ИГРОВОЙ ТАЙМЕР
================================================= */

function startGameTimer() {

    stopGameTimer();

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

                moveCharacters();

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

    if (gameTimer) {

        clearInterval(
            gameTimer
        );

        gameTimer = null;

    }

}


/* =================================================
   ЧАСЫ
================================================= */

function updateClock() {

    if (
        gameMinutes >= 360
    ) {

        time.textContent =
            "6:00 AM";

        return;

    }

    const hour =
        Math.floor(
            gameMinutes / 60
        );

    const minute =
        gameMinutes % 60;

    const displayHour =
        hour === 0
            ? 12
            : hour;

    time.textContent =
        displayHour +
        ":" +
        String(minute)
            .padStart(2, "0") +
        " AM";

}


/* =================================================
   ДВИЖЕНИЕ
================================================= */

function moveCharacters() {

    /* =========================
       ЛИЧИ
    ========================= */

    /*
       Личи начинает раньше.

       С каждой ночью
       она становится быстрее.
    */

    const lichiSpeed =
        Math.max(
            20,
            45 -
            (
                selectedNight - 1
            ) * 4
        );

    if (
        gameMinutes >= 45 &&
        gameMinutes %
            lichiSpeed === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

            lichiAudio.currentTime =
                0;

            lichiAudio.play()
                .catch(
                    function () {}
                );

        }

    }


    /* =========================
       ПАНКЕЙК
       ТОЛЬКО NIGHT 2+
    ========================= */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 120
    ) {

        const pancakeSpeed =
            Math.max(
                30,
                60 -
                (
                    selectedNight - 2
                ) * 5
            );

        if (
            gameMinutes %
                pancakeSpeed === 0
        ) {

            if (
                pancakePosition < 3
            ) {

                pancakePosition++;

                pancakeAudio.currentTime =
                    0;

                pancakeAudio.play()
                    .catch(
                        function () {}
                    );

            }

        }

    }


    /* =========================
       ЛИЧИ АТАКУЕТ
    ========================= */

    if (
        lichiPosition >= 4
    ) {

        setTimeout(
            function () {

                if (
                    lichiPosition >= 4 &&
                    !gameOver &&
                    !nightFinished
                ) {

                    loseGame(
                        "ЛИЧИ ДОБРАЛАСЬ ДО ОФИСА."
                    );

                }

            },
            1500
        );

    }


    /* =========================
       ПАНКЕЙК У ОКНА
    ========================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !pancakeAttackActive
    ) {

        startPancakeAttack();

    }

}


/* =================================================
   ПОВОРОТЫ
================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (!officeViews[direction])
        return;

    currentView =
        direction;

    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;

    updateOfficeCharacters();

    if (
        direction === "left"
    ) {

        status.textContent =
            "ЛЕВЫЙ КОРИДОР";

    }

    else if (
        direction === "right"
    ) {

        status.textContent =
            "ПРАВЫЙ КОРИДОР";

    }

    else {

        status.textContent =
            "ОФИС";

    }

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

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";


    /* =========================
       ЛИЧИ
    ========================= */

    if (
        lichiPosition >= 2 &&
        currentView === "left"
    ) {

        lichi.style.display =
            "block";

        if (
            lichiPosition === 2
        ) {

            lichi.style.left =
                "75%";

            lichi.style.top =
                "50%";

            lichi.style.width =
                "130px";

        }

        else if (
            lichiPosition === 3
        ) {

            lichi.style.left =
                "58%";

            lichi.style.top =
                "50%";

            lichi.style.width =
                "190px";

        }

        else {

            lichi.style.left =
                "50%";

            lichi.style.top =
                "50%";

            lichi.style.width =
                "270px";

        }

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 2 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left =
            "78%";

        pancake.style.top =
            "55%";

        pancake.style.width =
            pancakePosition >= 3
                ? "240px"
                : "150px";

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

            cameraPanel.style.display =
                "flex";

            showCamera(
                currentCamera
            );

        }
    );


document
    .getElementById("closeCameraPanel")
    .addEventListener(
        "click",
        function () {

            cameraPanel.style.display =
                "none";

            view.style.backgroundImage =
                `url("${officeViews[currentView]}")`;

            updateOfficeCharacters();

        }
    );


/* =================================================
   ПОКАЗ КАМЕРЫ
================================================= */

function showCamera(camera) {

    currentCamera =
        camera;

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


    /* =========================
       ЛИЧИ
    ========================= */

    const lichiCam =
        lichiCameraPositions[
            lichiPosition
        ];

    if (
        lichiCam === currentCamera
    ) {

        cameraLichi.style.display =
            "block";

        status.textContent =
            "ЛИЧИ ОБНАРУЖЕНА";

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2
    ) {

        const pancakeCam =
            pancakeCameraPositions[
                pancakePosition
            ];

        if (
            pancakeCam === currentCamera
        ) {

            cameraPancake.style.display =
                "block";

            status.textContent =
                "ПАНКЕЙК ОБНАРУЖЕН";

        }

    }

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

    if (flashCooldown)
        return;

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

    flashCooldown =
        true;

    flash.style.opacity =
        "1";

    setTimeout(
        function () {

            flash.style.opacity =
                "0";

        },
        120
    );


    flashAudio.currentTime =
        0;

    flashAudio.play()
        .catch(
            function () {}
        );


    setTimeout(
        function () {

            lichiAudio.currentTime =
                0;

            lichiAudio.play()
                .catch(
                    function () {}
                );

        },
        100
    );


    lichiPosition =
        0;

    lichi.style.display =
        "none";

    cameraLichi.style.display =
        "none";

    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


    setTimeout(
        function () {

            flashCooldown =
                false;

        },
        1500
    );

}


/* =================================================
   РЫЧАГ
================================================= */

leverButton.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (gameOver)
            return;

        openPowerPanel();

    }
);


/* =================================================
   ОТКРЫТЬ ПАНЕЛЬ
================================================= */

function openPowerPanel() {

    powerPanel.style.display =
        "flex";

    updatePowerPanel();

}


/* =================================================
   ЗАКРЫТЬ ПАНЕЛЬ
================================================= */

document
    .getElementById("closePowerPanel")
    .addEventListener(
        "click",
        function () {

            if (powerChanging)
                return;

            powerPanel.style.display =
                "none";

        }
    );


/* =================================================
   СОСТОЯНИЕ ЭЛЕКТРИЧЕСТВА
================================================= */

function updatePowerPanel() {

    let text =
        "ЭЛЕКТРИЧЕСТВО: ";

    if (
        currentPower === "window"
    ) {

        text +=
            "ПЕРЕДНЕЕ ОКНО";

    }

    else if (
        currentPower === "cameras"
    ) {

        text +=
            "КАМЕРЫ";

    }

    else {

        text +=
            "ОФИС";

    }

    powerStatus.textContent =
        text;

}


/* =================================================
   КНОПКИ ЭЛЕКТРИЧЕСТВА
================================================= */

powerChoices.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.power;

                redirectPower(
                    target
                );

            }
        );

    }
);


/* =================================================
   ПЕРЕНАПРАВЛЕНИЕ
   РОВНО 2 СЕКУНДЫ
================================================= */

function redirectPower(target) {

    if (powerChanging)
        return;

    if (target === currentPower) {

        powerDescription.textContent =
            "Электричество уже направлено сюда.";

        return;

    }

    powerChanging =
        true;

    setPowerButtons(
        true
    );

    powerDescription.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ... 2 СЕКУНДЫ";

    powerProgressBar.style.width =
        "0%";


    leverAudio.currentTime =
        0;

    leverAudio.play()
        .catch(
            function () {}
        );


    const start =
        Date.now();

    const duration =
        2000;


    powerChangeTimer =
        setInterval(
            function () {

                const elapsed =
                    Date.now() -
                    start;

                const percent =
                    Math.min(
                        100,
                        elapsed /
                        duration *
                        100
                    );

                powerProgressBar.style.width =
                    percent + "%";


                if (
                    elapsed >= duration
                ) {

                    clearInterval(
                        powerChangeTimer
                    );

                    powerChangeTimer =
                        null;

                    finishPowerRedirect(
                        target
                    );

                }

            },
            40
        );

}


/* =================================================
   ЗАВЕРШЕНИЕ ПЕРЕНАПРАВЛЕНИЯ
================================================= */

function finishPowerRedirect(target) {

    currentPower =
        target;

    powerChanging =
        false;

    setPowerButtons(
        false
    );

    powerProgressBar.style.width =
        "100%";

    powerDescription.textContent =
        "ЭЛЕКТРИЧЕСТВО УСПЕШНО ПЕРЕНАПРАВЛЕНО.";

    updatePowerPanel();

    checkPancakeDefense();

}


/* =================================================
   КНОПКИ
================================================= */

function setPowerButtons(disabled) {

    powerChoices.forEach(
        function (button) {

            button.disabled =
                disabled;

        }
    );

}


/* =================================================
   ПАНКЕЙК АТАКУЕТ ОКНО
================================================= */

function startPancakeAttack() {

    if (
        pancakeAttackActive
    )
        return;

    pancakeAttackActive =
        true;

    pancakePosition =
        3;

    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";

    pancakeAudio.currentTime =
        0;

    pancakeAudio.play()
        .catch(
            function () {}
        );


    /*
       У игрока ровно 10 секунд.
    */

    pancakeAttackTimer =
        setTimeout(
            function () {

                if (
                    pancakeAttackActive &&
                    !gameOver &&
                    !nightFinished
                ) {

                    if (
                        currentPower !==
                        "window"
                    ) {

                        loseGame(
                            "ПАНКЕЙК УСПЕЛ ВЫЛОМАТЬ ПЕРЕДНЕЕ ОКНО."
                        );

                    }

                }

            },
            10000
        );

}


/* =================================================
   ПРОВЕРКА ЗАЩИТЫ ОКНА
================================================= */

function checkPancakeDefense() {

    if (
        !pancakeAttackActive
    )
        return;

    if (
        currentPower === "window"
    ) {

        clearTimeout(
            pancakeAttackTimer
        );

        pancakeAttackTimer =
            null;

        pancakeAttackActive =
            false;

        pancakePosition =
            0;

        pancake.style.display =
            "none";

        status.textContent =
            "ОКНО ЗАЩИЩЕНО! ПАНКЕЙК ОТСТУПИЛ.";

        pancakeAudio.pause();

    }

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updatePowerPanel();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame(reason) {

    if (gameOver)
        return;

    gameOver =
        true;

    gameStarted =
        false;

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    clearInterval(
        powerChangeTimer
    );

    powerChanging =
        false;

    humAudio.pause();

    phoneAudio.pause();

    try {

        screamAudio.currentTime =
            0;

        screamAudio.play()
            .catch(
                function () {}
            );

    } catch (e) {}


    loseReason.textContent =
        reason ||
        "ТЫ ПРОИГРАЛ.";

    powerPanel.style.display =
        "none";

    cameraPanel.style.display =
        "none";

    gameOverScreen.style.display =
        "flex";

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;

    nightFinished =
        true;

    gameStarted =
        false;

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    clearInterval(
        powerChangeTimer
    );

    humAudio.pause();

    if (
        selectedNight >
        completedNight
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

    winScreen.style.display =
        "flex";

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
   ПОВТОРИТЬ
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
   МЕНЮ ПОСЛЕ ПОРАЖЕНИЯ
================================================= */

document
    .getElementById("menuAfterLose")
    .addEventListener(
        "click",
        function () {

            stopGameTimer();

            game.style.display =
                "none";

            gameOverScreen.style.display =
                "none";

            mainMenu.style.display =
                "flex";

            renderNights();

        }
    );


/* =================================================
   МЕНЮ ПОСЛЕ ПОБЕДЫ
================================================= */

document
    .getElementById("menuAfterWin")
    .addEventListener(
        "click",
        function () {

            stopGameTimer();

            game.style.display =
                "none";

            winScreen.style.display =
                "none";

            mainMenu.style.display =
                "flex";

            renderNights();

        }
    );


/* =================================================
   ЗАПУСК
================================================= */

renderNights();

mainMenu.style.display =
    "flex";

nightsMenu.style.display =
    "none";

settingsMenu.style.display =
    "none";

phoneScreen.style.display =
    "none";

game.style.display =
    "none";
