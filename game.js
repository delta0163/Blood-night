/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 1 + NIGHT 2
================================================= */


/* =================================================
   ЭЛЕМЕНТЫ
================================================= */

const mainMenu = document.getElementById("mainMenu");
const nightsMenu = document.getElementById("nightsMenu");
const settingsMenu = document.getElementById("settingsMenu");
const nightsList = document.getElementById("nightsList");

const game = document.getElementById("game");
const phoneScreen = document.getElementById("phoneScreen");

const phoneAudio = document.getElementById("phoneAudio");
const humAudio = document.getElementById("humAudio");
const flashAudio = document.getElementById("flashAudio");
const lichiAudio = document.getElementById("lichiAudio");
const pancakeAudio = document.getElementById("pancakeAudio");
const screamAudio = document.getElementById("screamAudio");
const ventAudio = document.getElementById("ventAudio");

const view = document.getElementById("view");

const lichi = document.getElementById("lichi");
const pancake = document.getElementById("pancake");

const flash = document.getElementById("flash");

const status = document.getElementById("status");
const time = document.getElementById("time");
const nightDisplay = document.getElementById("night");

const cameraPanel = document.getElementById("cameraPanel");
const cameraImage = document.getElementById("cameraImage");
const cameraNumber = document.getElementById("cameraNumber");

const cameraLichi = document.getElementById("cameraLichi");
const cameraPancake = document.getElementById("cameraPancake");

const energyPanel = document.getElementById("energyPanel");
const energyMessage = document.getElementById("energyMessage");
const energyTimer = document.getElementById("energyTimer");
const energyLever = document.getElementById("energyLever");

const gameOverScreen = document.getElementById("gameOver");
const winScreen = document.getElementById("winScreen");

const loseReason = document.getElementById("loseReason");
const winText = document.getElementById("winText");
const nextNightButton = document.getElementById("nextNight");


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
   ПАНКЕЙК
================================================= */

/*
   0 = далеко
   1 = начинает двигаться
   2 = возле окна
   3 = ломает окно
*/

let pancakePosition = 0;

let pancakeAttackActive = false;
let pancakeAttackTimer = null;

let energyTarget = null;
let energySwitching = false;
let energySwitchTimer = null;


/* =================================================
   ЛИЧИ
================================================= */

/*
   0 = далеко
   1 = приближается
   2 = левый коридор
   3 = возле офиса
   4 = атака
*/

let lichiPosition = 0;


/* =================================================
   ДВИЖЕНИЕ
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


const officeViews = {

    front:
        "images/office_front.png",

    left:
        "images/office_left.png",

    right:
        "images/office_right.png"

};


/* =================================================
   ПОЗИЦИИ НА КАМЕРАХ
================================================= */

const lichiCameraPositions = {

    1: "cam01",
    2: "cam01",
    3: "cam06",
    4: "cam06"

};


const pancakeCameraPositions = {

    1: "cam04",
    2: "cam05",
    3: "cam05"

};


/* =================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
================================================= */

/*
   Night 1 = 5 реальных минут
   Night 2 = 6 реальных минут
   Night 3 = 7 и т.д.
*/

function getNightDuration() {

    return 4 + selectedNight;

}


function getGameMinuteTime() {

    const realMinutes =
        getNightDuration();

    return (
        realMinutes * 60 * 1000
    ) / 360;

}


/* =================================================
   УПРАВЛЕНИЕ ЭКРАНАМИ
================================================= */

function showOnly(element) {

    [
        mainMenu,
        nightsMenu,
        settingsMenu,
        phoneScreen
    ].forEach(
        function(screen) {

            screen.classList.add(
                "hidden"
            );

        }
    );

    if (element) {

        element.classList.remove(
            "hidden"
        );

    }

}


/* =================================================
   МЕНЮ
================================================= */

document
.getElementById("startGameButton")
.addEventListener(
    "click",
    function() {

        selectedNight = 1;

        enterFullscreen();

        startSelectedNight();

    }
);


document
.getElementById("nightsButton")
.addEventListener(
    "click",
    function() {

        renderNights();

        showOnly(
            nightsMenu
        );

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function() {

        showOnly(
            mainMenu
        );

    }
);


/* =================================================
   НОЧИ
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
                function() {

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
    function() {

        showOnly(
            settingsMenu
        );

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function() {

        showOnly(
            mainMenu
        );

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

    } catch(error) {

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
    function() {

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
        energySwitchTimer
    );

    gameStarted = false;
    gameOver = false;
    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";
    currentCamera = "cam01";

    lichiPosition = 0;
    pancakePosition = 0;

    pancakeAttackActive = false;

    energyTarget = null;
    energySwitching = false;

    energyLever.classList.remove(
        "active"
    );

    energyMessage.textContent =
        "Выбери направление энергии.";

    energyTimer.textContent =
        "ЭНЕРГИЯ: 0%";

    view.style.backgroundImage =
        `url("${officeViews.front}")`;

    lichi.style.display = "none";
    pancake.style.display = "none";

    cameraLichi.style.display = "none";
    cameraPancake.style.display = "none";

    cameraPanel.classList.add(
        "hidden"
    );

    energyPanel.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );

    nightDisplay.textContent =
        "NIGHT " + selectedNight;

    document.getElementById(
        "phoneNight"
    ).textContent =
        "NIGHT " + selectedNight;

    time.textContent =
        "12:00 AM";

    status.textContent =
        "ОФИС";

    showOnly(
        phoneScreen
    );

    game.classList.add(
        "hidden"
    );

    phoneAudio.currentTime = 0;

    phoneAudio.play()
    .catch(
        function() {}
    );

}


/* =================================================
   ПРОПУСК ЗВОНКА
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function() {

        phoneAudio.pause();

        phoneAudio.currentTime = 0;

        startNightAfterPhone();

    }
);


phoneAudio.addEventListener(
    "ended",
    function() {

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

    [
        mainMenu,
        nightsMenu,
        settingsMenu,
        phoneScreen
    ].forEach(
        function(screen) {

            screen.classList.add(
                "hidden"
            );

        }
    );

    game.classList.remove(
        "hidden"
    );

    humAudio.currentTime = 0;

    humAudio.play()
    .catch(
        function() {}
    );

    updateEverything();

    startGameTimer();

}


/* =================================================
   ТАЙМЕР
================================================= */

function startGameTimer() {

    stopGameTimer();

    gameTimer =
        setInterval(
            function() {

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
       На второй ночи Личи
       движется быстрее.
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

            lichiAudio.currentTime = 0;

            lichiAudio.play()
            .catch(
                function() {}
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
            selectedNight === 2
                ? 50
                : 40;

        if (
            gameMinutes %
            pancakeSpeed === 0
        ) {

            if (
                pancakePosition < 3
            ) {

                pancakePosition++;

                pancakeAudio.currentTime = 0;

                pancakeAudio.play()
                .catch(
                    function() {}
                );

            }

        }

    }


    /* =========================
       ЛИЧИ АТАКА
    ========================= */

    if (
        lichiPosition >= 4
    ) {

        setTimeout(
            function() {

                if (
                    lichiPosition >= 4 &&
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


    /* =========================
       ПАНКЕЙК АТАКА
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
   ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО
================================================= */

function startPancakeAttack() {

    pancakeAttackActive = true;

    energyTarget = null;

    energyMessage.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";

    status.textContent =
        "ПАНКЕЙК АТАКУЕТ ОКНО!";

    pancake.style.display = "block";

    pancake.style.left = "50%";
    pancake.style.top = "45%";
    pancake.style.width = "300px";

    pancakeAudio.currentTime = 0;

    pancakeAudio.play()
    .catch(
        function() {}
    );


    /*
       10 секунд реального времени.
    */

    let remaining = 10;

    energyTimer.textContent =
        "ОКНО: " + remaining + " СЕК.";


    const countdown =
        setInterval(
            function() {

                if (
                    gameOver ||
                    !pancakeAttackActive
                ) {

                    clearInterval(
                        countdown
                    );

                    return;

                }

                remaining--;

                energyTimer.textContent =
                    "ОКНО: " +
                    remaining +
                    " СЕК.";

                if (
                    remaining <= 0
                ) {

                    clearInterval(
                        countdown
                    );

                    if (
                        pancakeAttackActive
                    ) {

                        loseGame(
                            "Панкейк успел выломать переднее окно."
                        );

                    }

                }

            },
            1000
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

    currentView = direction;

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
    function() {

        changeView("left");

    }
);


document
.getElementById("frontButton")
.addEventListener(
    "click",
    function() {

        changeView("front");

    }
);


document
.getElementById("rightButton")
.addEventListener(
    "click",
    function() {

        changeView("right");

    }
);


/* =================================================
   ПЕРСОНАЖИ
================================================= */

function updateOfficeCharacters() {

    lichi.style.display = "none";

    pancake.style.display = "none";


    /* ЛИЧИ */

    if (
        lichiPosition >= 2 &&
        currentView === "left"
    ) {

        lichi.style.display = "block";

        if (
            lichiPosition === 2
        ) {

            lichi.style.left = "75%";
            lichi.style.top = "50%";
            lichi.style.width = "130px";

        }

        else if (
            lichiPosition === 3
        ) {

            lichi.style.left = "58%";
            lichi.style.top = "50%";
            lichi.style.width = "190px";

        }

        else {

            lichi.style.left = "50%";
            lichi.style.top = "50%";
            lichi.style.width = "270px";

        }

    }


    /* ПАНКЕЙК */

    if (
        selectedNight >= 2 &&
        currentView === "front" &&
        pancakePosition >= 2
    ) {

        pancake.style.display = "block";

        pancake.style.left = "78%";
        pancake.style.top = "55%";

        pancake.style.width =
            pancakePosition >= 3
                ? "260px"
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
    function() {

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


document
.getElementById("closeCameraPanel")
.addEventListener(
    "click",
    function() {

        cameraPanel.classList.add(
            "hidden"
        );

        updateOfficeCharacters();

    }
);


/* =================================================
   ПОКАЗ КАМЕРЫ
================================================= */

function showCamera(camera) {

    if (!cameraImages[camera])
        return;

    currentCamera = camera;

    cameraImage.style.backgroundImage =
        `url("${cameraImages[camera]}")`;

    cameraNumber.textContent =
        camera.toUpperCase();

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
    function(button) {

        button.addEventListener(
            "click",
            function() {

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

    flashCooldown = true;

    flash.style.opacity = "1";

    setTimeout(
        function() {

            flash.style.opacity = "0";

        },
        120
    );

    flashAudio.currentTime = 0;

    flashAudio.play()
    .catch(
        function() {}
    );

    setTimeout(
        function() {

            lichiAudio.currentTime = 0;

            lichiAudio.play()
            .catch(
                function() {}
            );

        },
        100
    );

    lichiPosition = 0;

    lichi.style.display = "none";

    cameraLichi.style.display =
        "none";

    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


    setTimeout(
        function() {

            flashCooldown = false;

        },
        1500
    );

}


/* =================================================
   ЭНЕРГИЯ
================================================= */

document
.getElementById("energyButton")
.addEventListener(
    "click",
    function() {

        if (!gameStarted)
            return;

        if (gameOver)
            return;

        energyPanel.classList.remove(
            "hidden"
        );

        updateEnergyPanel();

    }
);


document
.getElementById("closeEnergyPanel")
.addEventListener(
    "click",
    function() {

        energyPanel.classList.add(
            "hidden"
        );

    }
);


/* =================================================
   РЫЧАГ
================================================= */

document
.getElementById("leverHandle")
.addEventListener(
    "click",
    function() {

        if (energySwitching)
            return;

        energyLever.classList.toggle(
            "active"
        );

        energyMessage.textContent =
            "Рычаг переключён. Выбери направление.";

    }
);


/* =================================================
   ВЫБОР НАПРАВЛЕНИЯ
================================================= */

document
.querySelectorAll(
    "#energyTargets button"
)
.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                redirectEnergy(
                    button.dataset.target
                );

            }
        );

    }
);


/* =================================================
   ПЕРЕНАПРАВЛЕНИЕ
================================================= */

function redirectEnergy(target) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (energySwitching)
        return;


    energyTarget = target;

    energySwitching = true;

    energyMessage.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ ЭНЕРГИИ...";

    energyTimer.textContent =
        "ЭНЕРГИЯ: 0%";


    let progress = 0;


    energySwitchTimer =
        setInterval(
            function() {

                progress += 10;

                energyTimer.textContent =
                    "ЭНЕРГИЯ: " +
                    progress +
                    "%";

                if (
                    progress >= 100
                ) {

                    clearInterval(
                        energySwitchTimer
                    );

                    energySwitchTimer =
                        null;

                    energySwitching =
                        false;

                    finishEnergyRedirect(
                        target
                    );

                }

            },
            200
        );

}


/* =================================================
   ЗАВЕРШЕНИЕ ПЕРЕКЛЮЧЕНИЯ
================================================= */

function finishEnergyRedirect(target) {

    energyTarget = target;

    energyMessage.textContent =
        "ЭНЕРГИЯ НАПРАВЛЕНА: " +
        target.toUpperCase();

    energyTimer.textContent =
        "ЭНЕРГИЯ: 100%";


    /*
       Если Панкейк атакует окно
       и энергия направлена туда,
       атака остановлена.
    */

    if (
        pancakeAttackActive &&
        target === "window"
    ) {

        pancakeAttackActive = false;

        pancakePosition = 0;

        pancake.style.display =
            "none";

        status.textContent =
            "ПАНКЕЙК ОТБРОШЕН ЭЛЕКТРИЧЕСТВОМ!";

        energyMessage.textContent =
            "ПЕРЕДНЕЕ ОКНО ЗАЩИЩЕНО.";

        energyTimer.textContent =
            "ЭНЕРГИЯ: 100%";

        pancakeAudio.pause();

    }

}


/* =================================================
   ПАНЕЛЬ ЭНЕРГИИ
================================================= */

function updateEnergyPanel() {

    if (
        pancakeAttackActive
    ) {

        energyMessage.textContent =
            "ПАНКЕЙК АТАКУЕТ! 10 СЕКУНД!";

    }

    else if (
        energySwitching
    ) {

        energyMessage.textContent =
            "ЭНЕРГИЯ ПЕРЕНАПРАВЛЯЕТСЯ...";

    }

    else {

        energyMessage.textContent =
            "Выбери направление энергии.";

    }

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateEnergyPanel();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame(reason) {

    if (gameOver)
        return;

    gameOver = true;

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    if (energySwitchTimer) {

        clearInterval(
            energySwitchTimer
        );

        energySwitchTimer = null;

    }

    humAudio.pause();

    ventAudio.pause();

    loseReason.textContent =
        reason || "Ты не успел.";

    try {

        screamAudio.currentTime = 0;

        screamAudio.play()
        .catch(
            function() {}
        );

    } catch(e) {}

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

    nightFinished = true;

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

    winScreen.classList.remove(
        "hidden"
    );

}


/* =================================================
   СЛЕДУЮЩАЯ НОЧЬ
================================================= */

nextNightButton.addEventListener(
    "click",
    function() {

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
    function() {

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
    function() {

        stopGameTimer();

        game.classList.add(
            "hidden"
        );

        gameOverScreen.classList.add(
            "hidden"
        );

        showOnly(
            mainMenu
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
    function() {

        stopGameTimer();

        game.classList.add(
            "hidden"
        );

        winScreen.classList.add(
            "hidden"
        );

        showOnly(
            mainMenu
        );

        renderNights();

    }
);


/* =================================================
   ЗАПУСК
================================================= */

renderNights();

showOnly(
    mainMenu
);

game.classList.add(
    "hidden"
);
