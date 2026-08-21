/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 1 + NIGHT 2

   NIGHT 1 = 5 минут
   NIGHT 2 = 6 минут

   ЛИЧИ:
   - появляется первой
   - идёт быстрее на NIGHT 2

   ПАНКЕЙК:
   - только NIGHT 2+
   - ломает переднее окно
   - при атаке находится по центру

   ЭНЕРГИЯ:
   - КАМЕРА
   - ОКНО
   - переключение рычагом занимает 3 секунды
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

const ventAudio =
    document.getElementById("ventAudio");

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

const energyPanel =
    document.getElementById("energyPanel");

const energyTargetText =
    document.getElementById("energyTargetText");

const energyMessage =
    document.getElementById("energyMessage");

const lever =
    document.getElementById("lever");

const leverBase =
    document.getElementById("leverBase");

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


/* =================================================
   ПОКАЗ / СКРЫТИЕ

   Это исправляет проблему чёрного экрана.
================================================= */

function showElement(element, display = "flex") {

    if (!element)
        return;

    element.classList.remove("hidden");

    element.style.display =
        display;
}


function hideElement(element) {

    if (!element)
        return;

    element.classList.add("hidden");

    element.style.display =
        "none";
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
let leverStartY = 0;
let leverCompleted = false;

const LEVER_TIME = 3000;


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
   1 = начал путь
   2 = около окна
   3 = ломает окно
*/


let pancakeAttackTimer = null;


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


/* Личи */

const lichiCameraPositions = {

    1: "cam01",
    2: "cam02",
    3: "cam06",
    4: "cam06"

};


/* Панкейк */

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
   ДЛИТЕЛЬНОСТЬ НОЧИ
================================================= */

function getNightDurationMinutes() {

    /*
       Night 1 = 5 минут
       Night 2 = 6 минут
       Night 3 = 7 минут
    */

    return 4 + selectedNight;

}


/*
   360 игровых минут
   должны пройти за длительность ночи.
*/

function getGameMinuteTime() {

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

    clearTimeout(
        pancakeAttackTimer
    );

    /*
       ВАЖНО:
       Сначала скрываем всё,
       затем показываем нужный экран.
    */

    hideElement(mainMenu);
    hideElement(nightsMenu);
    hideElement(settingsMenu);

    hideElement(gameOverScreen);
    hideElement(winScreen);
    hideElement(cameraPanel);
    hideElement(energyPanel);

    showElement(
        phoneScreen,
        "flex"
    );

    hideElement(game);

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

    energyTarget =
        "camera";

    leverDragging =
        false;

    leverCompleted =
        false;

    leverProgressBar.style.width =
        "0%";

    lever.style.top =
        "20px";


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

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";


    energyTargetText.textContent =
        "КАМЕРА";

    energyMessage.textContent =
        "Энергия направлена на камеры.";


    /*
       Запускаем звонок.
    */

    try {

        phoneAudio.pause();

        phoneAudio.currentTime =
            0;

        const promise =
            phoneAudio.play();

        if (promise) {

            promise.catch(
                () => {}
            );

        }

    } catch (e) {}

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

        } catch (e) {}

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

    hideElement(phoneScreen);

    /*
       КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
       снимаем hidden и показываем game.
    */

    showElement(
        game,
        "block"
    );

    try {

        humAudio.currentTime =
            0;

        const promise =
            humAudio.play();

        if (promise) {

            promise.catch(
                () => {}
            );

        }

    } catch (e) {}

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
   ДВИЖЕНИЕ ПЕРСОНАЖЕЙ
================================================= */

function moveCharacters() {

    /*
       =========================
       ЛИЧИ
       =========================

       На второй ночи идёт быстрее.
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

            try {

                lichiAudio.currentTime =
                    0;

                lichiAudio.play()
                .catch(
                    () => {}
                );

            } catch (e) {}

        }

    }


    /*
       =========================
       ПАНКЕЙК
       =========================

       Только со второй ночи.
    */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const pancakeSpeed =
            selectedNight === 2
                ? 55
                : 45;

        if (
            gameMinutes %
            pancakeSpeed === 0
        ) {

            if (
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

                } catch (e) {}

            }

        }

    }


    /*
       =========================
       ЛИЧИ АТАКУЕТ
       =========================
    */

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
            1200
        );

    }


    /*
       =========================
       ПАНКЕЙК ЛОМАЕТ ОКНО
       =========================
    */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3
    ) {

        startPancakeAttack();

    }

}


/* =================================================
   ПАНКЕЙК АТАКУЕТ ОКНО
================================================= */

function startPancakeAttack() {

    if (gameOver)
        return;

    /*
       Не создаём несколько таймеров.
    */

    if (pancakeAttackTimer)
        return;


    /*
       Панкейк появляется
       ПО ЦЕНТРУ.
    */

    if (
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


    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    try {

        pancakeAudio.currentTime =
            0;

        pancakeAudio.play()
        .catch(
            () => {}
        );

    } catch (e) {}


    /*
       Нужно успеть перенаправить
       энергию на ОКНО.
    */

    pancakeAttackTimer =
        setTimeout(
            function () {

                pancakeAttackTimer =
                    null;

                if (
                    gameOver
                )
                    return;


                /*
                   Если энергия не на окне —
                   проигрыш.
                */

                if (
                    energyTarget !== "window"
                ) {

                    loseGame();

                    return;

                }


                /*
                   Если энергия уже на окне —
                   атака отбита.
                */

                pancakePosition =
                    0;

                pancake.style.display =
                    "none";

                status.textContent =
                    "ПАНКЕЙК ОТБРОШЕН ЭНЕРГИЕЙ!";

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


    /*
       Личи — левый коридор.
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
       Панкейк.
       Если он атакует окно —
       строго по центру.
    */

    if (
        selectedNight >= 2 &&
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

        return;

    }


    /*
       Панкейк возле окна.
    */

    if (
        selectedNight >= 2 &&
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

        /*
           Если энергия направлена
           на окно — камера отключена.
        */

        if (
            energyTarget !== "camera"
        ) {

            status.textContent =
                "ЭНЕРГИЯ НАПРАВЛЕНА НА ОКНО. КАМЕРА НЕ РАБОТАЕТ.";

            return;

        }

        showElement(
            cameraPanel,
            "flex"
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
    function () {

        hideElement(
            cameraPanel
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

                if (
                    energyTarget !== "camera"
                ) {

                    return;

                }

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
        energyTarget !== "camera"
    ) {

        return;

    }


    /*
       ЛИЧИ
    */

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


    /*
       ПАНКЕЙК
    */

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


    /*
       Энергия должна быть на камере.
    */

    if (
        energyTarget !== "camera"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ: ЭНЕРГИЯ НАПРАВЛЕНА НА ОКНО.";

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

    } catch (e) {}


    setTimeout(
        function () {

            try {

                lichiAudio.currentTime =
                    0;

                lichiAudio.play()
                .catch(
                    () => {}
                );

            } catch (e) {}

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

        hideElement(
            energyPanel
        );

        leverDragging =
            false;

        leverCompleted =
            false;

        leverProgressBar.style.width =
            "0%";

        lever.style.top =
            "20px";

    }
);


/* =================================================
   ЭНЕРГИЯ — UI
================================================= */

function updateEnergyUI() {

    if (
        energyTarget === "camera"
    ) {

        energyTargetText.textContent =
            "КАМЕРА";

        energyMessage.textContent =
            "Энергия направлена на камеры. Вспышка работает.";

    } else {

        energyTargetText.textContent =
            "ОКНО";

        energyMessage.textContent =
            "Энергия направлена на окно. Вспышка камеры отключена.";

    }

}


/* =================================================
   РЫЧАГ
   Тянуть вниз 3 секунды.
================================================= */

function startLeverDrag(event) {

    if (!gameStarted)
        return;

    if (leverCompleted)
        return;

    event.preventDefault();

    leverDragging =
        true;

    leverStartTime =
        performance.now();

    if (
        event.touches &&
        event.touches.length
    ) {

        leverStartY =
            event.touches[0].clientY;

    } else {

        leverStartY =
            event.clientY;

    }

    requestAnimationFrame(
        updateLever
    );

}


function getPointerY(event) {

    if (
        event.touches &&
        event.touches.length
    ) {

        return event.touches[0].clientY;

    }

    if (
        event.changedTouches &&
        event.changedTouches.length
    ) {

        return event.changedTouches[0].clientY;

    }

    return event.clientY;

}


function updateLever() {

    if (!leverDragging)
        return;

    const now =
        performance.now();

    const elapsed =
        now -
        leverStartTime;

    const progress =
        Math.min(
            elapsed /
            LEVER_TIME,
            1
        );

    /*
       Сам рычаг визуально
       движется вниз.
    */

    const maxTop =
        95;

    lever.style.top =
        (
            20 +
            maxTop * progress
        ) +
        "px";


    leverProgressBar.style.width =
        (
            progress * 100
        ) +
        "%";


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

    /*
       Если отпустил раньше 3 секунд —
       сбрасываем рычаг.
    */

    if (!leverCompleted) {

        leverDragging =
            false;

        leverProgressBar.style.width =
            "0%";

        lever.style.top =
            "20px";

        energyMessage.textContent =
            "Рычаг отпущен слишком рано. Нужно тянуть 3 секунды.";

    }

}


function completeLever() {

    if (leverCompleted)
        return;

    leverCompleted =
        true;

    leverDragging =
        false;


    /*
       Переключаем направление.
    */

    if (
        energyTarget === "camera"
    ) {

        energyTarget =
            "window";

    } else {

        energyTarget =
            "camera";

    }


    updateEnergyUI();


    /*
       Обновляем камеры.
    */

    updateCameraCharacters();


    if (
        energyTarget === "window"
    ) {

        hideElement(
            cameraPanel
        );

        status.textContent =
            "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА НА ОКНО.";

    } else {

        status.textContent =
            "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА НА КАМЕРУ.";

    }


    /*
       После переключения
       можно снова использовать рычаг.
    */

    setTimeout(
        function () {

            leverCompleted =
                false;

            leverProgressBar.style.width =
                "0%";

            lever.style.top =
                "20px";

        },
        500
    );

}


/* =================================================
   СОБЫТИЯ РЫЧАГА
================================================= */

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
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateEnergyUI();

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

    clearTimeout(
        pancakeAttackTimer
    );

    pancakeAttackTimer =
        null;


    try {

        humAudio.pause();

        ventAudio.pause();

        screamAudio.currentTime =
            0;

        screamAudio.play()
        .catch(
            () => {}
        );

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

    nightFinished =
        true;

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );


    try {

        humAudio.pause();

        ventAudio.pause();

    } catch (e) {}


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

        hideElement(game);

        hideElement(gameOverScreen);

        showElement(
            mainMenu,
            "flex"
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
hideElement(gameOverScreen);
hideElement(winScreen);

showElement(
    mainMenu,
    "flex"
);

renderNights();


/* =================================================
   ПЕРВОНАЧАЛЬНОЕ НАПРАВЛЕНИЕ
================================================= */

energyTarget =
    "camera";

updateEnergyUI();
