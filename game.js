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

const powerPanel =
    document.getElementById("powerPanel");

const currentPower =
    document.getElementById("currentPower");

const powerTimer =
    document.getElementById("powerTimer");

const lever =
    document.getElementById("lever");

const switchLever =
    document.getElementById("switchLever");


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

let powerDirection = "camera";

let switchingPower = false;

let pancakeAttack = false;

let pancakeAttackTimer = null;


/* =================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
=================================================

   NIGHT 1 = 5 реальных минут
   NIGHT 2 = 6 реальных минут
   NIGHT 3 = 7 реальных минут

   360 игровых минут = вся ночь.
================================================= */

function getNightDuration() {

    return 4 + selectedNight;

}


function getGameMinuteTime() {

    const realMinutes =
        getNightDuration();

    const totalSeconds =
        realMinutes * 60;

    return (
        totalSeconds * 1000 / 360
    );

}


let gameTimer = null;


/* =================================================
   ЛИЧИ
================================================= */

let lichiPosition = 0;


/*
   0 = далеко
   1 = движение
   2 = левый коридор
   3 = рядом
   4 = атака
*/


/* =================================================
   ПАНКЕЙК
================================================= */

let pancakePosition = 0;


/*
   0 = отсутствует
   1 = вентиляция / путь
   2 = возле окна
   3 = начинает ломать окно
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

    2: "cam02",

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
   БЕЗОПАСНОЕ ВОСПРОИЗВЕДЕНИЕ ЗВУКА
================================================= */

function playSound(audio) {

    if (!audio)
        return;

    try {

        audio.currentTime = 0;

        const promise =
            audio.play();

        if (promise) {

            promise.catch(
                function () {}
            );

        }

    } catch (e) {}

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

        mainMenu.classList.add("hidden");

        nightsMenu.classList.remove("hidden");

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function () {

        nightsMenu.classList.add("hidden");

        mainMenu.classList.remove("hidden");

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

        mainMenu.classList.add("hidden");

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

        if (!document.fullscreenElement) {

            await document
                .documentElement
                .requestFullscreen();

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
        ) {

            return;

        }

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

    gameStarted = false;

    gameOver = false;

    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";

    currentCamera = "cam01";

    lichiPosition = 0;

    pancakePosition = 0;

    pancakeAttack = false;

    switchingPower = false;

    powerDirection = "camera";


    if (pancakeAttackTimer) {

        clearTimeout(
            pancakeAttackTimer
        );

        pancakeAttackTimer = null;

    }


    /* Энергия */

    updatePowerDisplay();


    /* Скрываем все экраны */

    mainMenu.classList.add("hidden");

    nightsMenu.classList.add("hidden");

    settingsMenu.classList.add("hidden");

    game.classList.add("hidden");


    /* Показываем звонок */

    phoneScreen.classList.remove(
        "hidden"
    );


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


    /* Вид */

    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    /* Персонажи */

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    pancake.classList.remove(
        "attack"
    );


    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";


    /* Панели */

    cameraPanel.classList.add(
        "hidden"
    );

    powerPanel.classList.add(
        "hidden"
    );


    /* Оверлеи */

    gameOverScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );


    /* Звонок */

    phoneAudio.pause();

    phoneAudio.currentTime = 0;

    playSound(phoneAudio);

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

    gameStarted = true;

    phoneScreen.classList.add(
        "hidden"
    );

    game.classList.remove(
        "hidden"
    );


    playSound(humAudio);

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
       Во второй ночи Личи
       двигается быстрее.
    */

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;


    if (
        gameMinutes >= 45 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

            playSound(lichiAudio);

        }

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const pancakeSpeed =
            selectedNight === 2
                ? 45
                : 40;


        if (
            gameMinutes %
            pancakeSpeed === 0
        ) {

            if (
                pancakePosition < 3
            ) {

                pancakePosition++;

                playSound(
                    pancakeAudio
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
                    !gameOver
                ) {

                    loseGame(
                        "Личи добралась до офиса."
                    );

                }

            },
            1000
        );

    }


    /* =========================
       ПАНКЕЙК НАЧИНАЕТ ЛОМАТЬ
       ПЕРЕДНЕЕ ОКНО
    ========================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !pancakeAttack &&
        !gameOver
    ) {

        startPancakeAttack();

    }

}


/* =================================================
   АТАКА ПАНКЕЙКА
================================================= */

function startPancakeAttack() {

    pancakeAttack = true;

    pancake.classList.add(
        "attack"
    );


    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    playSound(
        pancakeAudio
    );


    let secondsLeft = 10;

    powerTimer.textContent =
        "ПАНКЕЙК: " +
        secondsLeft +
        " сек.";


    pancakeAttackTimer =
        setInterval(
            function () {

                secondsLeft--;

                if (
                    secondsLeft > 0
                ) {

                    powerTimer.textContent =
                        "ПАНКЕЙК: " +
                        secondsLeft +
                        " сек.";

                }

                else {

                    clearInterval(
                        pancakeAttackTimer
                    );

                    pancakeAttackTimer =
                        null;


                    if (
                        powerDirection !==
                        "window"
                    ) {

                        loseGame(
                            "Панкейк выломал переднее окно."
                        );

                    }

                    else {

                        pancakeAttack =
                            false;

                        pancakePosition =
                            0;

                        pancake.classList.remove(
                            "attack"
                        );

                        powerTimer.textContent =
                            "ОКНО ЗАЩИЩЕНО";

                        status.textContent =
                            "ПАНКЕЙК ОТСТУПИЛ.";

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


    if (
        pancakeAttack &&
        direction === "front"
    ) {

        status.textContent =
            "ПАНКЕЙК ЛОМАЕТ ОКНО!";

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


    /* Личи */

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


    /* Панкейк */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 2 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";


        if (
            pancakeAttack
        ) {

            pancake.classList.add(
                "attack"
            );

        }

        else {

            pancake.classList.remove(
                "attack"
            );

            pancake.style.left =
                "78%";

            pancake.style.top =
                "55%";

            pancake.style.width =
                "150px";

        }

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


        if (
            powerDirection !==
            "camera"
        ) {

            status.textContent =
                "КАМЕРЫ ОТКЛЮЧЕНЫ. ЭНЕРГИЯ НАПРАВЛЕНА НА ОКНО.";

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
   ПОКАЗ КАМЕРЫ
================================================= */

function showCamera(camera) {

    if (
        powerDirection !==
        "camera"
    ) {

        status.textContent =
            "КАМЕРЫ НЕ РАБОТАЮТ.";

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
        powerDirection !==
        "camera"
    ) {

        return;

    }


    /* Личи */

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


    /* Панкейк */

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


    playSound(
        flashAudio
    );


    setTimeout(
        function () {

            playSound(
                lichiAudio
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
   ЭНЕРГИЯ
================================================= */

document
.getElementById("powerButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;


        powerPanel.classList.remove(
            "hidden"
        );


        updatePowerDisplay();

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
   РЫЧАГ
================================================= */

switchLever
.addEventListener(
    "click",
    function () {

        if (
            switchingPower
        ) {

            return;

        }


        lever.classList.toggle(
            "active"
        );


        status.textContent =
            "РЫЧАГ ПЕРЕКЛЮЧЕН. ВЫБЕРИ НАПРАВЛЕНИЕ.";

    }
);


/* =================================================
   ВЫБОР НАПРАВЛЕНИЯ
================================================= */

document
.querySelectorAll(
    ".powerChoice"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.power;


                switchPower(
                    target
                );

            }
        );

    }
);


/* =================================================
   ПЕРЕНАПРАВЛЕНИЕ
   2 СЕКУНДЫ
================================================= */

function switchPower(target) {

    if (
        switchingPower
    ) {

        return;

    }


    if (
        target === powerDirection
    ) {

        updatePowerDisplay();

        return;

    }


    switchingPower =
        true;


    powerTimer.textContent =
        "ПЕРЕКЛЮЧЕНИЕ... 2";


    switchLever.disabled =
        true;


    document
    .querySelectorAll(
        ".powerChoice"
    )
    .forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    let seconds =
        2;


    const timer =
        setInterval(
            function () {

                seconds--;


                if (
                    seconds > 0
                ) {

                    powerTimer.textContent =
                        "ПЕРЕКЛЮЧЕНИЕ... " +
                        seconds;

                }

                else {

                    clearInterval(
                        timer
                    );


                    powerDirection =
                        target;


                    switchingPower =
                        false;


                    switchLever.disabled =
                        false;


                    document
                    .querySelectorAll(
                        ".powerChoice"
                    )
                    .forEach(
                        function (button) {

                            button.disabled =
                                false;

                        }
                    );


                    updatePowerDisplay();


                    if (
                        target ===
                        "window"
                    ) {

                        cameraPanel.classList.add(
                            "hidden"
                        );


                        status.textContent =
                            "ЭНЕРГИЯ НАПРАВЛЕНА НА ПЕРЕДНЕЕ ОКНО.";


                        if (
                            pancakeAttack
                        ) {

                            pancakeAttack =
                                false;


                            pancakePosition =
                                0;


                            pancake.classList.remove(
                                "attack"
                            );


                            powerTimer.textContent =
                                "ОКНО ЗАЩИЩЕНО";

                        }

                    }

                    else {

                        status.textContent =
                            "ЭНЕРГИЯ НАПРАВЛЕНА НА КАМЕРЫ.";

                    }

                }

            },
            1000
        );

}


/* =================================================
   ОТОБРАЖЕНИЕ ЭНЕРГИИ
================================================= */

function updatePowerDisplay() {

    if (
        powerDirection ===
        "camera"
    ) {

        currentPower.textContent =
            "ЭНЕРГИЯ: КАМЕРЫ";

    }

    else {

        currentPower.textContent =
            "ЭНЕРГИЯ: ПЕРЕДНЕЕ ОКНО";

    }


    document
    .querySelectorAll(
        ".powerChoice"
    )
    .forEach(
        function (button) {

            if (
                button.dataset.power ===
                powerDirection
            ) {

                button.classList.add(
                    "active"
                );

            }

            else {

                button.classList.remove(
                    "active"
                );

            }

        }
    );


    if (
        !switchingPower
    ) {

        powerTimer.textContent =
            "ГОТОВО";

    }

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updatePowerDisplay();

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


    humAudio.pause();


    try {

        screamAudio.currentTime =
            0;

        screamAudio.play()
        .catch(
            function () {}
        );

    } catch (e) {}


    document
    .getElementById("loseReason")
    .textContent =
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

        nextNightButton.classList.add(
            "hidden"
        );

    }

    else {

        nextNightButton.classList.remove(
            "hidden"
        );

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
   МЕНЮ ПОСЛЕ ПОРАЖЕНИЯ
================================================= */

document
.getElementById("menuAfterLose")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

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
   НАЧАЛЬНОЕ СОСТОЯНИЕ
================================================= */

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


renderNights();
