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

const cameraPowerMessage =
    document.getElementById("cameraPowerMessage");

const underTablePanel =
    document.getElementById("underTablePanel");

const powerStatus =
    document.getElementById("powerStatus");

const powerTransferStatus =
    document.getElementById(
        "powerTransferStatus"
    );

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");

const leverHandle =
    document.getElementById("leverHandle");


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

let powerTarget = "camera";

let powerTransferring = false;

let pancakeAttackTimer = null;

let phoneFallbackTimer = null;


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
   ТАЙМЕР
================================================= */

let gameTimer = null;


/* =================================================
   ЛИЧИ
================================================= */

let lichiPosition = 0;

/*
   0 = далеко
   1 = путь
   2 = левый коридор
   3 = рядом
   4 = атака
*/


/* =================================================
   ПАНКЕЙК
================================================= */

let pancakePosition = 0;

/*
   0 = далеко
   1 = камера
   2 = камера перед атакой
   3 = атакует окно
*/


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
   ПОЗИЦИИ ЛИЧИ НА КАМЕРАХ
================================================= */

const lichiCameraPositions = {

    1: "cam01",
    2: "cam03",
    3: "cam06"

};


/* =================================================
   ПОЗИЦИИ ПАНКЕЙКА
================================================= */

const pancakeCameraPositions = {

    1: "cam04",
    2: "cam05"

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
   СБРОС
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

    clearTimeout(
        phoneFallbackTimer
    );

    /*
       ВАЖНО:
       Сначала показываем игру,
       чтобы больше не было
       полностью чёрного экрана.
    */

    mainMenu.style.display =
        "none";

    nightsMenu.style.display =
        "none";

    settingsMenu.style.display =
        "none";

    game.style.display =
        "block";

    phoneScreen.style.display =
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

    powerTarget =
        "camera";

    powerTransferring =
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


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    pancake.classList.remove(
        "attackPosition"
    );


    cameraPanel.style.display =
        "none";

    underTablePanel.style.display =
        "none";


    gameOverScreen.style.display =
        "none";

    winScreen.style.display =
        "none";


    updatePowerUI();


    /*
       Запускаем игру сразу.
    */

    startNightAfterPhone();


    /*
       Телефонный звонок идёт
       поверх игры, но НЕ блокирует её.
    */

    phoneScreen.style.display =
        "flex";


    phoneAudio.currentTime =
        0;

    phoneAudio.play()
    .catch(
        function () {}
    );


    /*
       Если mp3 отсутствует
       или не запустился —
       через 3 секунды игра
       всё равно продолжается.
    */

    phoneFallbackTimer =
        setTimeout(
            function () {

                phoneScreen.style.display =
                    "none";

            },
            3000
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

        clearTimeout(
            phoneFallbackTimer
        );

        phoneScreen.style.display =
            "none";

    }
);


phoneAudio.addEventListener(
    "ended",
    function () {

        phoneScreen.style.display =
            "none";

    }
);


/* =================================================
   ПОСЛЕ ЗВОНКА
================================================= */

function startNightAfterPhone() {

    if (gameStarted)
        return;

    gameStarted = true;

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

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;


    if (
        gameMinutes >= 60 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

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
            50;


        if (
            gameMinutes %
            pancakeSpeed === 0
        ) {

            if (
                pancakePosition < 3
            ) {

                pancakePosition++;

                if (
                    pancakePosition === 3
                ) {

                    startPancakeAttack();

                }

            }

        }

    }


    /* =========================
       ЛИЧИ
    ========================= */

    if (
        lichiPosition >= 4
    ) {

        setTimeout(
            function () {

                if (
                    lichiPosition >= 4 &&
                    !gameOver
                ) {

                    loseGame();

                }

            },
            1000
        );

    }

}


/* =================================================
   ПАНКЕЙК — АТАКА ОКНА
================================================= */

function startPancakeAttack() {

    if (
        selectedNight < 2
    )
        return;

    clearTimeout(
        pancakeAttackTimer
    );


    pancake.classList.add(
        "attackPosition"
    );


    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    try {

        pancakeAudio.currentTime = 0;

        pancakeAudio.play()
        .catch(
            () => {}
        );

    } catch (e) {}


    /*
       Игроку даётся 10 секунд.
    */

    pancakeAttackTimer =
        setTimeout(
            function () {

                if (
                    pancakePosition === 3 &&
                    !gameOver
                ) {

                    if (
                        powerTarget !== "window"
                    ) {

                        loseGame();

                    }

                }

            },
            10000
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
            pancakePosition === 3
                ? "ПАНКЕЙК У ПЕРЕДНЕГО ОКНА"
                : "ОФИС";

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
       ЛИЧИ — ЛЕВЫЙ КОРИДОР
    ========================= */

    if (
        lichiPosition >= 2 &&
        lichiPosition < 4 &&
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

        else {

            lichi.style.left =
                "58%";

            lichi.style.top =
                "50%";

            lichi.style.width =
                "190px";

        }

    }


    /* =========================
       ПАНКЕЙК
    =========================

       ВАЖНО:
       На офисном экране он
       появляется ТОЛЬКО во время
       атаки окна.
    */

    if (
        selectedNight >= 2 &&
        pancakePosition === 3 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.classList.add(
            "attackPosition"
        );

    }

    else {

        pancake.classList.remove(
            "attackPosition"
        );

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

        /*
           Если энергия направлена
           на окно — камеры не работают.
        */

        if (
            powerTarget !== "camera"
        ) {

            status.textContent =
                "КАМЕРЫ ОТКЛЮЧЕНЫ — ЭНЕРГИЯ НА ОКНЕ";

            return;

        }


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

    if (
        powerTarget !== "camera"
    ) {

        cameraPowerMessage.textContent =
            "КАМЕРЫ ОТКЛЮЧЕНЫ";

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

            button.classList.toggle(
                "active",
                button.dataset.camera ===
                camera
            );

        }
    );


    cameraPowerMessage.textContent =
        "КАМЕРЫ РАБОТАЮТ";


    updateCameraCharacters();

}


/* =================================================
   КНОПКИ CAM 01–07
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
                    powerTarget !== "camera"
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


    if (
        powerTarget !== "camera"
    )
        return;


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

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2 &&
        pancakePosition < 3
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


    /*
       Вспышка — это именно
       вспышка камеры.
    */

    if (
        powerTarget !== "camera"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ — ЭНЕРГИЯ НА ОКНЕ";

        return;

    }


    if (
        currentView !== "left"
    ) {

        status.textContent =
            "Посмотри в левый коридор.";

        return;

    }


    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "Личи ещё далеко.";

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
        () => {}
    );


    setTimeout(
        function () {

            lichiAudio.currentTime =
                0;

            lichiAudio.play()
            .catch(
                () => {}
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
   ПАНЕЛЬ ПОД СТОЛОМ
================================================= */

document
.getElementById("powerButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        underTablePanel.style.display =
            "flex";

        updatePowerUI();

    }
);


document
.getElementById("closePowerPanel")
.addEventListener(
    "click",
    function () {

        underTablePanel.style.display =
            "none";

    }
);


/* =================================================
   НАПРАВИТЬ ЭНЕРГИЮ
================================================= */

document
.getElementById("powerCameraButton")
.addEventListener(
    "click",
    function () {

        transferPower(
            "camera"
        );

    }
);


document
.getElementById("powerWindowButton")
.addEventListener(
    "click",
    function () {

        transferPower(
            "window"
        );

    }
);


/* =================================================
   ПЕРЕКЛЮЧЕНИЕ ЭНЕРГИИ
================================================= */

function transferPower(target) {

    if (
        powerTransferring
    )
        return;


    if (
        target === powerTarget
    ) {

        powerTransferStatus.textContent =
            target === "camera"
                ? "ЭНЕРГИЯ УЖЕ НАПРАВЛЕНА НА КАМЕРЫ."
                : "ЭНЕРГИЯ УЖЕ НАПРАВЛЕНА НА ОКНО.";

        return;

    }


    powerTransferring =
        true;


    powerTransferStatus.textContent =
        "ПЕРЕКЛЮЧЕНИЕ ЭНЕРГИИ... 2 СЕК.";


    status.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ ЭНЕРГИИ";


    /*
       Рычаг двигается.
    */

    leverHandle.style.transform =
        target === "window"
            ? "rotate(25deg)"
            : "rotate(-25deg)";


    /*
       Ровно 2 секунды.
    */

    setTimeout(
        function () {

            powerTarget =
                target;

            powerTransferring =
                false;


            updatePowerUI();


            if (
                target === "window"
            ) {

                status.textContent =
                    "ЭНЕРГИЯ НАПРАВЛЕНА НА ОКНО";

            } else {

                status.textContent =
                    "ЭНЕРГИЯ НАПРАВЛЕНА НА КАМЕРЫ";

            }


            updateEverything();

        },
        2000
    );

}


/* =================================================
   ОБНОВЛЕНИЕ ЭНЕРГИИ
================================================= */

function updatePowerUI() {

    if (
        powerTarget === "camera"
    ) {

        powerStatus.textContent =
            "ЭНЕРГИЯ: КАМЕРЫ";

        powerTransferStatus.textContent =
            "ЭНЕРГИЯ НАПРАВЛЕНА НА КАМЕРЫ";

        cameraPowerMessage.textContent =
            "КАМЕРЫ РАБОТАЮТ";

        document
        .getElementById(
            "powerCameraButton"
        )
        .disabled =
            true;

        document
        .getElementById(
            "powerWindowButton"
        )
        .disabled =
            false;

        leverHandle.style.transform =
            "rotate(-25deg)";

    } else {

        powerStatus.textContent =
            "ЭНЕРГИЯ: ОКНО";

        powerTransferStatus.textContent =
            "ЭНЕРГИЯ НАПРАВЛЕНА НА ОКНО";

        cameraPowerMessage.textContent =
            "КАМЕРЫ ОТКЛЮЧЕНЫ";

        document
        .getElementById(
            "powerCameraButton"
        )
        .disabled =
            false;

        document
        .getElementById(
            "powerWindowButton"
        )
        .disabled =
            true;

        leverHandle.style.transform =
            "rotate(25deg)";

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

function loseGame() {

    if (gameOver)
        return;


    gameOver =
        true;


    stopGameTimer();


    humAudio.pause();


    try {

        screamAudio.currentTime =
            0;

        screamAudio.play()
        .catch(
            () => {}
        );

    } catch (e) {}


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


    stopGameTimer();


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
