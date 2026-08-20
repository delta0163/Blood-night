/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 1 + NIGHT 2

   Камеры
   Личи
   Панкейк
   Электричество
   Перенаправление энергии
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

const powerPanel =
    document.getElementById("powerPanel");

const powerTarget =
    document.getElementById("powerTarget");

const powerArrow =
    document.getElementById("powerArrow");

const powerStatus =
    document.getElementById("powerStatus");

const gameOverScreen =
    document.getElementById("gameOver");

const loseReason =
    document.getElementById("loseReason");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");


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


/*
   cameras
   = энергия направлена на камеры

   window
   = энергия направлена на окно
*/

let powerTargetMode = "cameras";

let powerSwitching = false;


/* =================================================
   ПАНКЕЙК
=================================================

   0 = отсутствует
   1 = далеко
   2 = возле окна
   3 = начинает ломать окно
   4 = атака

================================================= */

let pancakePosition = 0;


/* =================================================
   ЛИЧИ
=================================================

   0 = далеко
   1 = CAM 01
   2 = CAM 02
   3 = левый коридор
   4 = рядом
   5 = атака

================================================= */

let lichiPosition = 0;


/* =================================================
   ТАЙМЕР
================================================= */

let gameTimer = null;


/* =================================================
   ТАЙМЕР ПАНКЕЙКА
================================================= */

let pancakeAttackTimer = null;


/* =================================================
   ИЗОБРАЖЕНИЯ КАМЕР
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
   КАМЕРЫ ЛИЧИ
================================================= */

const lichiCameraPositions = {

    1: "cam01",

    2: "cam02",

    3: "cam03",

    4: "cam06"

};


/* =================================================
   КАМЕРЫ ПАНКЕЙКА
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
   ДЛИТЕЛЬНОСТЬ НОЧИ
=================================================

   NIGHT 1 = 5 минут
   NIGHT 2 = 6 минут
   NIGHT 3 = 7 минут

================================================= */

function getNightDuration() {

    return 4 + selectedNight;

}


/* =================================================
   СКОРОСТЬ ИГРОВОЙ МИНУТЫ
================================================= */

function getGameMinuteTime() {

    const realMinutes =
        getNightDuration();

    const totalMilliseconds =
        realMinutes * 60 * 1000;

    return (
        totalMilliseconds / 360
    );

}


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

        mainMenu.classList.add(
            "hidden"
        );

        nightsMenu.classList.remove(
            "hidden"
        );

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function () {

        nightsMenu.classList.add(
            "hidden"
        );

        mainMenu.classList.remove(
            "hidden"
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

        mainMenu.classList.add(
            "hidden"
        );

        settingsMenu.classList.remove(
            "hidden"
        );

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function () {

        settingsMenu.classList.add(
            "hidden"
        );

        mainMenu.classList.remove(
            "hidden"
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

        const result =
            confirm(
                "Сбросить весь прогресс?"
            );

        if (!result)
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


/* =================================================
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    stopGameTimer();

    stopPancakeAttackTimer();

    /*
       Очень важно:
       убираем старые экраны,
       чтобы вместо игры не оставался
       чёрный экран.
    */

    mainMenu.classList.add(
        "hidden"
    );

    nightsMenu.classList.add(
        "hidden"
    );

    settingsMenu.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );

    powerPanel.classList.add(
        "hidden"
    );

    cameraPanel.classList.add(
        "hidden"
    );


    phoneScreen.classList.remove(
        "hidden"
    );

    game.classList.add(
        "hidden"
    );


    /* состояние */

    gameStarted = false;

    gameOver = false;

    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";

    currentCamera = "cam01";

    lichiPosition = 0;

    pancakePosition = 0;

    flashCooldown = false;

    powerSwitching = false;

    powerTargetMode = "cameras";


    /* HUD */

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


    /* энергия */

    updatePowerUI();


    /* офис */

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


    /* звук */

    try {

        phoneAudio.currentTime = 0;

        phoneAudio.play()
        .catch(
            () => {}
        );

    } catch (error) {

        console.log(error);

    }

}


/* =================================================
   ПРОПУСТИТЬ ЗВОНОК
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function () {

        try {

            phoneAudio.pause();

            phoneAudio.currentTime =
                0;

        } catch (error) {}

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

    gameStarted = true;

    phoneScreen.classList.add(
        "hidden"
    );

    game.classList.remove(
        "hidden"
    );


    try {

        humAudio.currentTime = 0;

        humAudio.play()
        .catch(
            () => {}
        );

    } catch (error) {}


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
   ДВИЖЕНИЕ ПЕРСОНАЖЕЙ
================================================= */

function moveCharacters() {

    /* =================================================
       ЛИЧИ
    ================================================= */

    /*
       Первая ночь:
       каждые 45 игровых минут.

       Вторая ночь:
       каждые 30 игровых минут.
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
            lichiPosition < 5
        ) {

            lichiPosition++;

            try {

                lichiAudio.currentTime =
                    0;

                lichiAudio.play()
                .catch(
                    () => {}
                );

            } catch (error) {}

        }

    }


    /* =================================================
       ПАНКЕЙК
       ТОЛЬКО СО ВТОРОЙ НОЧИ
    ================================================= */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const pancakeSpeed = 45;

        if (
            gameMinutes % pancakeSpeed === 0 &&
            pancakePosition < 3
        ) {

            pancakePosition++;

            try {

                pancakeAudio.currentTime =
                    0;

                pancakeAudio.play()
                .catch(
                    () => {}
                );

            } catch (error) {}

        }

    }


    /* =================================================
       ПАНКЕЙК ДОШЁЛ ДО ОКНА
    ================================================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !pancakeAttackTimer
    ) {

        startPancakeAttack();

    }


    /* =================================================
       ЛИЧИ ДОШЛА ДО ОФИСА
    ================================================= */

    if (
        lichiPosition >= 5
    ) {

        setTimeout(
            function () {

                if (
                    lichiPosition >= 5 &&
                    !gameOver
                ) {

                    loseGame(
                        "Личи добралась до офиса."
                    );

                }

            },
            1200
        );

    }

}


/* =================================================
   ПАНКЕЙК — АТАКА ОКНА
================================================= */

function startPancakeAttack() {

    if (gameOver)
        return;

    if (pancakeAttackTimer)
        return;


    /*
       Сразу показываем Панкейка
       в центре переднего окна.
    */

    currentView = "front";

    view.style.backgroundImage =
        `url("${officeViews.front}")`;

    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    updateOfficeCharacters();


    /*
       Если энергия уже на окне,
       атака сразу отражается.
    */

    if (
        powerTargetMode === "window"
    ) {

        stopPancakeAttack();

        pancakePosition = 0;

        status.textContent =
            "ОКНО ЗАЩИЩЕНО ЭНЕРГИЕЙ!";

        updateOfficeCharacters();

        return;

    }


    /*
       10 секунд на переключение.
    */

    let secondsLeft = 10;

    powerStatus.textContent =
        "ПАНКЕЙК АТАКУЕТ: " +
        secondsLeft +
        " СЕК.";


    pancakeAttackTimer =
        setInterval(
            function () {

                if (gameOver) {

                    stopPancakeAttack();

                    return;

                }


                /*
                   Если игрок переключил энергию
                   на окно — Панкейк отступает.
                */

                if (
                    powerTargetMode === "window"
                ) {

                    stopPancakeAttack();

                    pancakePosition = 0;

                    status.textContent =
                        "ПАНКЕЙК ОТБРОШЕН ЭЛЕКТРИЧЕСТВОМ!";

                    updateOfficeCharacters();

                    return;

                }


                secondsLeft--;

                powerStatus.textContent =
                    "ПАНКЕЙК АТАКУЕТ: " +
                    secondsLeft +
                    " СЕК.";


                if (
                    secondsLeft <= 0
                ) {

                    stopPancakeAttack();

                    loseGame(
                        "Панкейк выломал переднее окно."
                    );

                }

            },
            1000
        );

}


/* =================================================
   ОСТАНОВИТЬ АТАКУ ПАНКЕЙКА
================================================= */

function stopPancakeAttack() {

    if (pancakeAttackTimer) {

        clearInterval(
            pancakeAttackTimer
        );

        pancakeAttackTimer = null;

    }

    powerStatus.textContent =
        powerTargetMode === "window"
            ? "ЭНЕРГИЯ НА ОКНЕ"
            : "ЭНЕРГИЯ НА КАМЕРАХ";

}


function stopAllPancakeSystems() {

    stopPancakeAttack();

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

        if (
            pancakePosition >= 3 &&
            selectedNight >= 2
        ) {

            status.textContent =
                "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";

        } else {

            status.textContent =
                "ОФИС";

        }

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


    /* =================================================
       ЛИЧИ
       ТОЛЬКО ЛЕВЫЙ КОРИДОР
    ================================================= */

    if (
        lichiPosition >= 3 &&
        currentView === "left"
    ) {

        lichi.style.display =
            "block";


        if (
            lichiPosition === 3
        ) {

            lichi.style.left =
                "75%";

            lichi.style.top =
                "50%";

            lichi.style.width =
                "120px";

        }

        else if (
            lichiPosition === 4
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
                "280px";

        }

    }


    /* =================================================
       ПАНКЕЙК
       ПОЯВЛЯЕТСЯ В ОФИСЕ ТОЛЬКО ПРИ АТАКЕ
    ================================================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        /*
           СТРОГО ПО ЦЕНТРУ
        */

        pancake.style.left =
            "50%";

        pancake.style.top =
            "50%";

        pancake.style.width =
            "300px";

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

        if (powerTargetMode !== "cameras") {

            status.textContent =
                "КАМЕРЫ ОБЕСТОЧЕНЫ";

            return;

        }


        cameraPanel.classList.remove(
            "hidden"
        );


        showCamera(
            currentCamera
        );

    }
);


/* =================================================
   ЗАКРЫТЬ КАМЕРЫ
================================================= */

document
.getElementById("closeCameraPanel")
.addEventListener(
    "click",
    function () {

        cameraPanel.classList.add(
            "hidden"
        );

        view.style.backgroundImage =
            `url("${officeViews[currentView]}")`;

        updateOfficeCharacters();

    }
);


/* =================================================
   ПОКАЗАТЬ КАМЕРУ
================================================= */

function showCamera(camera) {

    if (
        powerTargetMode !== "cameras"
    ) {

        status.textContent =
            "КАМЕРЫ ОБЕСТОЧЕНЫ";

        return;

    }


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


    document
        .querySelectorAll(
            "#cameraMap button"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


    const activeButton =
        document.querySelector(
            `#cameraMap button[data-camera="${camera}"]`
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }


    updateCameraCharacters();

}


/* =================================================
   ВЫБОР КАМЕР
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


    if (
        powerTargetMode !== "cameras"
    ) {

        return;

    }


    /* =================================================
       ЛИЧИ
    ================================================= */

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


    /* =================================================
       ПАНКЕЙК
    ================================================= */

    if (
        selectedNight >= 2
    ) {

        const pancakeCam =
            pancakeCameraPositions[
                pancakePosition
            ];


        /*
           ВАЖНО:
           Пока Панкейк на камере,
           он НЕ показывается в офисе.
        */

        if (
            pancakeCam === currentCamera &&
            pancakePosition < 3
        ) {

            cameraPancake.style.display =
                "block";

            status.textContent =
                "ПАНКЕЙК ОБНАРУЖЕН";

        }

    }

}


/* =================================================
   ВСПЫШКА КАМЕРЫ
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


    /*
       ВСПЫШКА РАБОТАЕТ ТОЛЬКО
       КОГДА ЭНЕРГИЯ НА КАМЕРАХ.
    */

    if (
        powerTargetMode !== "cameras"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ — ЭНЕРГИЯ НА ОКНЕ.";

        return;

    }


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
        lichiPosition < 3
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


    try {

        flashAudio.currentTime =
            0;

        flashAudio.play()
        .catch(
            () => {}
        );

    } catch (error) {}


    setTimeout(
        function () {

            try {

                lichiAudio.currentTime =
                    0;

                lichiAudio.play()
                .catch(
                    () => {}
                );

            } catch (error) {}

        },
        100
    );


    /*
       Вспышка отбрасывает Личи.
    */

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
   РЫЧАГ ЭНЕРГИИ
================================================= */

document
.getElementById("leverButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (gameOver)
            return;

        powerPanel.classList.remove(
            "hidden"
        );

        updatePowerUI();

    }
);


/* =================================================
   ЗАКРЫТЬ ПАНЕЛЬ ЭНЕРГИИ
================================================= */

document
.getElementById("closePowerPanel")
.addEventListener(
    "click",
    function () {

        powerPanel.classList.add(
            "hidden"
        );

    }
);


/* =================================================
   ПЕРЕКЛЮЧИТЬ НА КАМЕРЫ
================================================= */

document
.getElementById("switchToCameras")
.addEventListener(
    "click",
    function () {

        switchPower(
            "cameras"
        );

    }
);


/* =================================================
   ПЕРЕКЛЮЧИТЬ НА ОКНО
================================================= */

document
.getElementById("switchToWindow")
.addEventListener(
    "click",
    function () {

        switchPower(
            "window"
        );

    }
);


/* =================================================
   ПЕРЕКЛЮЧЕНИЕ ЭНЕРГИИ
================================================= */

function switchPower(target) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (powerSwitching)
        return;


    if (
        target === powerTargetMode
    ) {

        status.textContent =
            target === "window"
                ? "ЭНЕРГИЯ УЖЕ НА ОКНЕ."
                : "ЭНЕРГИЯ УЖЕ НА КАМЕРАХ.";

        return;

    }


    powerSwitching =
        true;


    powerStatus.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ ЭНЕРГИИ...";


    powerArrow.textContent =
        "⟳";


    status.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ ЭНЕРГИИ — 2 СЕК.";


    /*
       Камеры сразу считаются
       отключёнными во время
       переключения.
    */

    cameraPanel.classList.add(
        "hidden"
    );


    setTimeout(
        function () {

            powerTargetMode =
                target;

            powerSwitching =
                false;


            updatePowerUI();


            if (
                target === "window"
            ) {

                status.textContent =
                    "ЭНЕРГИЯ → ОКНО";

                /*
                   Если Панкейк атаковал,
                   электричество его отбрасывает.
                */

                if (
                    pancakePosition >= 3
                ) {

                    pancakePosition =
                        0;

                    stopPancakeAttack();

                    status.textContent =
                        "ЭЛЕКТРИЧЕСТВО ОТБРОСИЛО ПАНКЕЙКА!";

                    updateOfficeCharacters();

                }

            } else {

                status.textContent =
                    "ЭНЕРГИЯ → КАМЕРЫ";

            }


        },
        2000
    );

}


/* =================================================
   ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ЭНЕРГИИ
================================================= */

function updatePowerUI() {

    if (
        powerTargetMode === "window"
    ) {

        powerTarget.textContent =
            "ОКНО";

        powerArrow.textContent =
            "→";

        powerStatus.textContent =
            "ЭНЕРГИЯ НА ОКНЕ";

        powerStatus.classList.add(
            "window"
        );

    } else {

        powerTarget.textContent =
            "КАМЕРЫ";

        powerArrow.textContent =
            "→";

        powerStatus.textContent =
            "ЭНЕРГИЯ НА КАМЕРАХ";

        powerStatus.classList.remove(
            "window"
        );

    }

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updatePowerUI();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame(reason) {

    if (gameOver)
        return;


    gameOver =
        true;


    stopGameTimer();

    stopPancakeAttack();


    try {

        humAudio.pause();

    } catch (error) {}


    try {

        screamAudio.currentTime =
            0;

        screamAudio.play()
        .catch(
            () => {}
        );

    } catch (error) {}


    loseReason.textContent =
        reason ||
        "Ты проиграл.";


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished =
        true;


    stopGameTimer();

    stopPancakeAttack();


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

        nextNightButton.style.display =
            "none";

    } else {

        nextNightButton.style.display =
            "block";

    }


    winScreen.classList.remove(
        "hidden"
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

        stopPancakeAttack();


        game.classList.add(
            "hidden"
        );

        gameOverScreen.classList.add(
            "hidden"
        );


        mainMenu.classList.remove(
            "hidden"
        );


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

        stopPancakeAttack();


        game.classList.add(
            "hidden"
        );

        winScreen.classList.add(
            "hidden"
        );


        mainMenu.classList.remove(
            "hidden"
        );


        renderNights();

    }
);


/* =================================================
   ЗАПУСК
================================================= */

renderNights();

mainMenu.classList.remove(
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

game.classList.add(
    "hidden"
);

cameraPanel.classList.add(
    "hidden"
);

powerPanel.classList.add(
    "hidden"
);

gameOverScreen.classList.add(
    "hidden"
);

winScreen.classList.add(
    "hidden"
);
