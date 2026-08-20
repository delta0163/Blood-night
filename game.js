/* =========================================================
   BLOOD GLOW NIGHT
   NIGHT 1 + NIGHT 2

   1 ночь = 5 реальных минут
   2 ночь = 6 реальных минут
   Каждая следующая ночь +1 минута.

   Личи — первый противник.
   Панкейк появляется только со 2 ночи.

   Панкейк атакует переднее окно.
   Нужно нажать рычаг под столом,
   выбрать "ПЕРЕДНЕЕ ОКНО".

   Перенаправление занимает 2 секунды.
   На отражение атаки есть 10 секунд.
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

const nightsList = $("nightsList");

const startGameButton = $("startGameButton");
const nightsButton = $("nightsButton");
const settingsButton = $("settingsButton");

const closeNights = $("closeNights");
const closeSettings = $("closeSettings");

const fullscreenButton = $("fullscreenButton");
const resetProgress = $("resetProgress");

const skipPhoneButton = $("skipPhoneButton");

const phoneNight = $("phoneNight");
const nightDisplay = $("night");
const timeDisplay = $("time");
const status = $("status");

const view = $("view");

const lichi = $("lichi");
const pancake = $("pancake");
const flash = $("flash");

const leftButton = $("leftButton");
const frontButton = $("frontButton");
const rightButton = $("rightButton");

const cameraButton = $("cameraButton");
const flashButton = $("flashButton");

const cameraPanel = $("cameraPanel");
const closeCameraPanel = $("closeCameraPanel");

const cameraImage = $("cameraImage");
const cameraNumber = $("cameraNumber");

const cameraLichi = $("cameraLichi");
const cameraPancake = $("cameraPancake");

const electricLever = $("electricLever");

const electricPanel = $("electricPanel");
const closeElectricPanel = $("closeElectricPanel");

const electricWarning = $("electricWarning");
const electricTimer = $("electricTimer");
const electricStatus = $("electricStatus");

const gameOverScreen = $("gameOver");
const loseReason = $("loseReason");

const restartButton = $("restart");
const menuAfterLose = $("menuAfterLose");

const winScreen = $("winScreen");
const winText = $("winText");

const nextNightButton = $("nextNight");
const menuAfterWin = $("menuAfterWin");


/* =========================================================
   ЗВУКИ
========================================================= */

const phoneAudio = $("phoneAudio");
const humAudio = $("humAudio");
const flashAudio = $("flashAudio");
const lichiAudio = $("lichiAudio");
const pancakeAudio = $("pancakeAudio");
const screamAudio = $("screamAudio");


/* =========================================================
   ПРОГРЕСС
========================================================= */

let completedNight =
    Number(
        localStorage.getItem(
            "bloodGlowNightCompleted"
        )
    ) || 0;

let selectedNight = 1;


/* =========================================================
   СОСТОЯНИЕ
========================================================= */

let gameStarted = false;
let gameOver = false;
let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";
let currentCamera = "cam01";

let flashCooldown = false;

let gameTimer = null;

let electricTarget = "office";
let redirectInProgress = false;

let pancakeAttack = false;
let pancakeAttackTimer = null;

let pancakeAttackSeconds = 0;


/* =========================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
========================================================= */

function getNightDurationMinutes() {

    return 4 + selectedNight;

}


/*
   NIGHT 1 = 5 минут
   NIGHT 2 = 6 минут
   NIGHT 3 = 7 минут
   и т.д.
*/


function getGameMinuteInterval() {

    const realMinutes =
        getNightDurationMinutes();

    const totalMilliseconds =
        realMinutes * 60 * 1000;

    return totalMilliseconds / 360;

}


/* =========================================================
   ЭКРАНЫ
========================================================= */

function showScreen(screen) {

    const screens = [
        mainMenu,
        nightsMenu,
        settingsMenu,
        phoneScreen
    ];

    screens.forEach(
        element => {

            element.classList.add(
                "hidden"
            );

        }
    );

    screen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   ПОЛНЫЙ ЭКРАН
========================================================= */

async function enterFullscreen() {

    try {

        if (!document.fullscreenElement) {

            await document.documentElement
                .requestFullscreen();

        }

    } catch (error) {

        console.log(
            "Fullscreen:",
            error
        );

    }

}


/* =========================================================
   МЕНЮ
========================================================= */

startGameButton.addEventListener(
    "click",
    () => {

        selectedNight = 1;

        enterFullscreen();

        startSelectedNight();

    }
);


nightsButton.addEventListener(
    "click",
    () => {

        renderNights();

        showScreen(
            nightsMenu
        );

    }
);


settingsButton.addEventListener(
    "click",
    () => {

        showScreen(
            settingsMenu
        );

    }
);


closeNights.addEventListener(
    "click",
    () => {

        showScreen(
            mainMenu
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        showScreen(
            mainMenu
        );

    }
);


/* =========================================================
   СПИСОК НОЧЕЙ
========================================================= */

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

            button.textContent =
                "🔒 NIGHT " + i;

            button.disabled =
                true;

            button.classList.add(
                "locked"
            );

        } else {

            button.textContent =
                "NIGHT " + i;

            button.addEventListener(
                "click",
                () => {

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


/* =========================================================
   НАСТРОЙКИ
========================================================= */

fullscreenButton.addEventListener(
    "click",
    enterFullscreen
);


resetProgress.addEventListener(
    "click",
    () => {

        const answer =
            confirm(
                "Сбросить весь прогресс?"
            );

        if (!answer)
            return;

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


/* =========================================================
   НАЧАЛО НОЧИ
========================================================= */

function startSelectedNight() {

    stopGameTimer();

    clearPancakeAttack();

    /*
       ВАЖНО:
       Сначала скрываем игру,
       потом очищаем состояние,
       затем показываем телефон.
    */

    game.classList.add("hidden");

    gameOverScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );

    electricPanel.classList.add(
        "hidden"
    );

    cameraPanel.classList.add(
        "hidden"
    );


    gameStarted = false;
    gameOver = false;
    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";
    currentCamera = "cam01";

    lichiPosition = 0;
    pancakePosition = 0;

    electricTarget = "office";

    redirectInProgress = false;

    pancakeAttack = false;


    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;

    phoneNight.textContent =
        "NIGHT " +
        selectedNight;

    timeDisplay.textContent =
        "12:00 AM";

    status.textContent =
        "ОФИС";


    view.style.backgroundImage =
        `url("images/office_front.png")`;


    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    electricLever.classList.remove(
        "visible"
    );


    /*
       Важно:
       даже если телефонный звук
       не загрузился, игра всё равно
       запускается через кнопку.
    */

    showScreen(
        phoneScreen
    );


    try {

        phoneAudio.currentTime = 0;

        const promise =
            phoneAudio.play();

        if (
            promise &&
            promise.catch
        ) {

            promise.catch(
                () => {}
            );

        }

    } catch (error) {}

}


/* =========================================================
   ПРОПУСК ЗВОНКА
========================================================= */

skipPhoneButton.addEventListener(
    "click",
    () => {

        try {

            phoneAudio.pause();
            phoneAudio.currentTime = 0;

        } catch (error) {}

        startNightAfterPhone();

    }
);


/*
   Если звук закончился,
   тоже начинаем игру.
*/

phoneAudio.addEventListener(
    "ended",
    () => {

        startNightAfterPhone();

    }
);


/* =========================================================
   ЗАПУСК ИГРЫ ПОСЛЕ ЗВОНКА
========================================================= */

function startNightAfterPhone() {

    if (gameStarted)
        return;

    gameStarted = true;

    showGame();

    updateEverything();

    startGameTimer();

    /*
       Звук фонового гула не должен
       блокировать запуск игры.
    */

    try {

        humAudio.currentTime = 0;

        const promise =
            humAudio.play();

        if (
            promise &&
            promise.catch
        ) {

            promise.catch(
                () => {}
            );

        }

    } catch (error) {}

}


/* =========================================================
   ПОКАЗ ИГРЫ
========================================================= */

function showGame() {

    mainMenu.classList.add(
        "hidden"
    );

    nightsMenu.classList.add(
        "hidden"
    );

    settingsMenu.classList.add(
        "hidden"
    );

    phoneScreen.classList.add(
        "hidden"
    );

    game.classList.remove(
        "hidden"
    );

}


/* =========================================================
   ТАЙМЕР
========================================================= */

function startGameTimer() {

    stopGameTimer();

    gameTimer =
        setInterval(
            () => {

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
            getGameMinuteInterval()
        );

}


function stopGameTimer() {

    if (!gameTimer)
        return;

    clearInterval(
        gameTimer
    );

    gameTimer = null;

}


/* =========================================================
   ЧАСЫ
========================================================= */

function updateClock() {

    const hour =
        Math.floor(
            gameMinutes / 60
        );

    const minute =
        gameMinutes % 60;


    if (gameMinutes >= 360) {

        timeDisplay.textContent =
            "6:00 AM";

        return;

    }


    const displayHour =
        hour === 0
            ? 12
            : hour;


    timeDisplay.textContent =
        displayHour +
        ":" +
        String(minute)
            .padStart(2, "0") +
        " AM";

}


/* =========================================================
   ПОЗИЦИИ
========================================================= */

let lichiPosition = 0;

/*
   0 = далеко
   1 = подходит
   2 = левый коридор
   3 = возле офиса
   4 = атака
*/


let pancakePosition = 0;

/*
   Только Night 2+.

   0 = далеко
   1 = камера
   2 = подходит
   3 = окно
*/


/* =========================================================
   ДВИЖЕНИЕ
========================================================= */

function moveCharacters() {

    /*
       ЛИЧИ

       На первой ночи медленнее.
       На второй — быстрее.
    */

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;


    if (
        gameMinutes >= 30 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

        }

    }


    /*
       ПАНКЕЙК

       Только со второй ночи.
    */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const pancakeSpeed =
            selectedNight === 2
                ? 45
                : 35;


        if (
            gameMinutes %
            pancakeSpeed === 0
        ) {

            if (
                pancakePosition < 3
            ) {

                pancakePosition++;

            }

        }

    }


    /*
       ПАНКЕЙК достиг окна.
    */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !pancakeAttack
    ) {

        startPancakeAttack();

    }


    /*
       ЛИЧИ атакует,
       если дошла до позиции 4.
    */

    if (
        lichiPosition >= 4
    ) {

        loseGame(
            "ЛИЧИ ДОБРАЛАСЬ ДО ОФИСА"
        );

    }

}


/* =========================================================
   ПОВОРОТЫ
========================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (
        ![
            "front",
            "left",
            "right"
        ].includes(direction)
    )
        return;


    currentView =
        direction;


    const images = {

        front:
            "images/office_front.png",

        left:
            "images/office_left.png",

        right:
            "images/office_right.png"

    };


    view.style.backgroundImage =
        `url("${images[direction]}")`;


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


    updateOfficeCharacters();

}


/* =========================================================
   КНОПКИ ПОВОРОТА
========================================================= */

leftButton.addEventListener(
    "click",
    () => {

        changeView("left");

    }
);


frontButton.addEventListener(
    "click",
    () => {

        changeView("front");

    }
);


rightButton.addEventListener(
    "click",
    () => {

        changeView("right");

    }
);


/* =========================================================
   ПЕРСОНАЖИ В ОФИСЕ
========================================================= */

function updateOfficeCharacters() {

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";


    /*
       РЫЧАГ
       Показывается только когда
       Панкейк атакует переднее окно.
    */

    if (
        pancakeAttack &&
        currentView === "front"
    ) {

        electricLever.classList.add(
            "visible"
        );

    } else {

        electricLever.classList.remove(
            "visible"
        );

    }


    /*
       ЛИЧИ
    */

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


    /*
       ПАНКЕЙК

       Только Night 2+.
    */

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
            pancakeAttack
                ? "300px"
                : "160px";

    }

}


/* =========================================================
   КАМЕРЫ
========================================================= */

cameraButton.addEventListener(
    "click",
    () => {

        if (!gameStarted)
            return;

        cameraPanel.classList.remove(
            "hidden"
        );

        showCamera(
            currentCamera
        );

    }
);


closeCameraPanel.addEventListener(
    "click",
    () => {

        cameraPanel.classList.add(
            "hidden"
        );

        updateEverything();

    }
);


/* =========================================================
   КАМЕРЫ CAM 01–07
========================================================= */

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


const cameraButtons =
    document.querySelectorAll(
        "#cameraMap [data-camera]"
    );


cameraButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                showCamera(
                    button.dataset.camera
                );

            }
        );

    }
);


/* =========================================================
   ПОЗИЦИИ ЛИЧИ НА КАМЕРАХ
========================================================= */

const lichiCameraPositions = {

    0: null,

    1: "cam01",

    2: "cam02",

    3: "cam06",

    4: "cam06"

};


/* =========================================================
   ПОЗИЦИИ ПАНКЕЙКА
========================================================= */

const pancakeCameraPositions = {

    0: null,

    1: "cam04",

    2: "cam05",

    3: "cam07"

};


/* =========================================================
   ПОКАЗ КАМЕРЫ
========================================================= */

function showCamera(camera) {

    if (
        !cameraImages[camera]
    )
        return;


    currentCamera =
        camera;


    cameraImage.style.backgroundImage =
        `url("${cameraImages[camera]}")`;


    cameraNumber.textContent =
        camera.toUpperCase();


    updateCameraCharacters();

}


/* =========================================================
   ПЕРСОНАЖИ НА КАМЕРЕ
========================================================= */

function updateCameraCharacters() {

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";


    const lichiCam =
        lichiCameraPositions[
            lichiPosition
        ];


    if (
        lichiCam === currentCamera
    ) {

        cameraLichi.style.display =
            "block";

    }


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

        }

    }

}


/* =========================================================
   ВСПЫШКА
========================================================= */

flashButton.addEventListener(
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
            "СНАЧАЛА ПОСМОТРИ В ЛЕВЫЙ КОРИДОР";

        return;

    }


    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "ЛИЧИ ЕЩЁ ДАЛЕКО";

        return;

    }


    flashCooldown =
        true;


    flash.style.opacity =
        "1";


    setTimeout(
        () => {

            flash.style.opacity =
                "0";

        },
        120
    );


    safePlay(
        flashAudio
    );


    setTimeout(
        () => {

            safePlay(
                lichiAudio
            );

        },
        100
    );


    lichiPosition =
        0;


    status.textContent =
        "ЛИЧИ ОТСТУПИЛА";


    updateEverything();


    setTimeout(
        () => {

            flashCooldown =
                false;

        },
        1500
    );

}


/* =========================================================
   РЫЧАГ ПОД СТОЛОМ
========================================================= */

electricLever.addEventListener(
    "click",
    () => {

        if (!gameStarted)
            return;

        if (gameOver)
            return;


        /*
           Открываем систему
           перенаправления.
        */

        electricPanel.classList.remove(
            "hidden"
        );


        updateElectricPanel();

    }
);


/* =========================================================
   ЗАКРЫТЬ ЭЛЕКТРИЧЕСТВО
========================================================= */

closeElectricPanel.addEventListener(
    "click",
    () => {

        if (
            redirectInProgress
        )
            return;


        electricPanel.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   КНОПКИ НАПРАВЛЕНИЯ
========================================================= */

document
.querySelectorAll(
    "#electricChoices [data-power]"
)
.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                redirectElectricity(
                    button.dataset.power
                );

            }
        );

    }
);


/* =========================================================
   ПЕРЕНАПРАВЛЕНИЕ
========================================================= */

function redirectElectricity(target) {

    if (
        redirectInProgress
    )
        return;


    if (
        ![
            "window",
            "left",
            "right",
            "office"
        ].includes(target)
    )
        return;


    redirectInProgress =
        true;


    electricWarning.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ...";


    electricTimer.textContent =
        "2";


    let seconds =
        2;


    const interval =
        setInterval(
            () => {

                seconds--;

                electricTimer.textContent =
                    seconds;


                if (
                    seconds <= 0
                ) {

                    clearInterval(
                        interval
                    );


                    electricTarget =
                        target;


                    redirectInProgress =
                        false;


                    finishRedirect();

                }

            },
            1000
        );

}


/* =========================================================
   ЗАВЕРШЕНИЕ ПЕРЕНАПРАВЛЕНИЯ
========================================================= */

function finishRedirect() {

    electricWarning.textContent =
        "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА";


    electricTimer.textContent =
        "ГОТОВО";


    electricStatus.textContent =
        "ЭНЕРГИЯ: " +
        getPowerName(
            electricTarget
        );


    /*
       Если энергия направлена
       на переднее окно,
       Панкейк получает удар
       и атака отменяется.
    */

    if (
        pancakeAttack &&
        electricTarget === "window"
    ) {

        pancakeAttack =
            false;

        pancakePosition =
            0;


        clearPancakeAttack();


        safePlay(
            pancakeAudio
        );


        status.textContent =
            "ПАНКЕЙК ОТБРОШЕН ЭЛЕКТРИЧЕСТВОМ";


        electricLever.classList.remove(
            "visible"
        );


        updateEverything();


        setTimeout(
            () => {

                electricPanel.classList.add(
                    "hidden"
                );

            },
            800
        );


        return;

    }


    /*
       Если выбрано другое направление,
       окно остаётся без защиты.
    */

    if (
        pancakeAttack &&
        electricTarget !== "window"
    ) {

        status.textContent =
            "ОКНО НЕ ЗАЩИЩЕНО!";

    }

}


/* =========================================================
   НАЗВАНИЯ НАПРАВЛЕНИЙ
========================================================= */

function getPowerName(target) {

    const names = {

        window:
            "ПЕРЕДНЕЕ ОКНО",

        left:
            "ЛЕВЫЙ КОРИДОР",

        right:
            "ПРАВЫЙ КОРИДОР",

        office:
            "ОФИС"

    };


    return names[target] ||
        "ОФИС";

}


/* =========================================================
   ПАНКЕЙК — АТАКА ОКНА
========================================================= */

function startPancakeAttack() {

    if (pancakeAttack)
        return;


    pancakeAttack =
        true;


    pancakeAttackSeconds =
        10;


    safePlay(
        pancakeAudio
    );


    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    updateEverything();


    /*
       10 секунд на защиту.
    */

    pancakeAttackTimer =
        setInterval(
            () => {

                pancakeAttackSeconds--;


                status.textContent =
                    "ПАНКЕЙК АТАКУЕТ! " +
                    pancakeAttackSeconds +
                    " СЕК.";


                /*
                   Если энергия уже направлена
                   на окно — атака не сработает.
                */

                if (
                    electricTarget === "window"
                ) {

                    pancakeAttack =
                        false;

                    clearPancakeAttack();

                    pancakePosition =
                        0;

                    status.textContent =
                        "ПЕРЕДНЕЕ ОКНО ЗАЩИЩЕНО";


                    updateEverything();

                    return;

                }


                /*
                   10 секунд закончились.
                */

                if (
                    pancakeAttackSeconds <= 0
                ) {

                    clearPancakeAttack();

                    loseGame(
                        "ПАНКЕЙК ВЫЛОМАЛ ПЕРЕДНЕЕ ОКНО"
                    );

                }

            },
            1000
        );

}


/* =========================================================
   ОСТАНОВИТЬ ТАЙМЕР ПАНКЕЙКА
========================================================= */

function clearPancakeAttack() {

    if (
        pancakeAttackTimer
    ) {

        clearInterval(
            pancakeAttackTimer
        );

        pancakeAttackTimer =
            null;

    }

}


/* =========================================================
   ОБНОВИТЬ ЭЛЕКТРИЧЕСТВО
========================================================= */

function updateElectricPanel() {

    electricStatus.textContent =
        "ЭНЕРГИЯ: " +
        getPowerName(
            electricTarget
        );


    if (
        pancakeAttack
    ) {

        electricWarning.textContent =
            "ПАНКЕЙК АТАКУЕТ ОКНО!";

        electricTimer.textContent =
            pancakeAttackSeconds;

    } else {

        electricWarning.textContent =
            "ВЫБЕРИ КУДА НАПРАВИТЬ ЭНЕРГИЮ";

        electricTimer.textContent =
            "ГОТОВО";

    }

}


/* =========================================================
   ОБНОВИТЬ ВСЁ
========================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateElectricPanel();

}


/* =========================================================
   GAME OVER
========================================================= */

function loseGame(reason) {

    if (gameOver)
        return;


    gameOver =
        true;


    stopGameTimer();

    clearPancakeAttack();


    try {

        humAudio.pause();

    } catch (error) {}


    try {

        screamAudio.currentTime = 0;

        screamAudio.play()
            .catch(
                () => {}
            );

    } catch (error) {}


    loseReason.textContent =
        reason ||
        "ТЫ ПРОИГРАЛ";


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   ПОБЕДА
========================================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished =
        true;


    stopGameTimer();

    clearPancakeAttack();


    try {

        humAudio.pause();

    } catch (error) {}


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

        nextNightButton.classList.add(
            "hidden"
        );

    } else {

        nextNightButton.classList.remove(
            "hidden"
        );

    }


    winScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   СЛЕДУЮЩАЯ НОЧЬ
========================================================= */

nextNightButton.addEventListener(
    "click",
    () => {

        if (
            selectedNight < 13
        ) {

            selectedNight++;

            startSelectedNight();

        }

    }
);


/* =========================================================
   ПОВТОРИТЬ
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        startSelectedNight();

    }
);


/* =========================================================
   МЕНЮ ПОСЛЕ ПРОИГРЫША
========================================================= */

menuAfterLose.addEventListener(
    "click",
    () => {

        stopGameTimer();

        clearPancakeAttack();

        game.classList.add(
            "hidden"
        );

        gameOverScreen.classList.add(
            "hidden"
        );

        showScreen(
            mainMenu
        );

        renderNights();

    }
);


/* =========================================================
   МЕНЮ ПОСЛЕ ПОБЕДЫ
========================================================= */

menuAfterWin.addEventListener(
    "click",
    () => {

        stopGameTimer();

        clearPancakeAttack();

        game.classList.add(
            "hidden"
        );

        winScreen.classList.add(
            "hidden"
        );

        showScreen(
            mainMenu
        );

        renderNights();

    }
);


/* =========================================================
   БЕЗОПАСНОЕ ВОСПРОИЗВЕДЕНИЕ ЗВУКА
========================================================= */

function safePlay(audio) {

    if (!audio)
        return;


    try {

        audio.currentTime = 0;

        const promise =
            audio.play();


        if (
            promise &&
            promise.catch
        ) {

            promise.catch(
                () => {}
            );

        }

    } catch (error) {}

}


/* =========================================================
   ЗАПУСК
========================================================= */

renderNights();

showScreen(
    mainMenu
);

game.classList.add(
    "hidden"
);

gameOverScreen.classList.add(
    "hidden"
);

winScreen.classList.add(
    "hidden"
);

cameraPanel.classList.add(
    "hidden"
);

electricPanel.classList.add(
    "hidden"
);


/* =========================================================
   ЗАЩИТА ОТ СЛУЧАЙНОГО ОБНОВЛЕНИЯ
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopGameTimer();

        clearPancakeAttack();

    }
);
