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


/* =================================================
   ЗВУКИ
================================================= */

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


/* =================================================
   ИГРОВЫЕ ЭЛЕМЕНТЫ
================================================= */

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


/* =================================================
   КАМЕРЫ
================================================= */

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


/* =================================================
   ПОД СТОЛОМ
================================================= */

const underTablePanel =
    document.getElementById("underTablePanel");

const underTableButton =
    document.getElementById("underTableButton");

const closeUnderTable =
    document.getElementById("closeUnderTable");

const leverButton =
    document.getElementById("leverButton");

const electricStatus =
    document.getElementById("electricStatus");


/* =================================================
   ЭЛЕКТРИЧЕСТВО
================================================= */

const electricPanel =
    document.getElementById("electricPanel");

const closeElectric =
    document.getElementById("closeElectric");

const redirectBar =
    document.getElementById("redirectBar");

const redirectStatus =
    document.getElementById("redirectStatus");

const electricChoices =
    document.querySelectorAll(
        ".electricChoice"
    );


/* =================================================
   GAME OVER / WIN
================================================= */

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


/* =================================================
   ЭЛЕКТРИЧЕСТВО
================================================= */

let electricityTarget = "office";

let redirecting = false;

let redirectTimer = null;


/*
   Время, до которого нужно
   успеть защитить окно.

   После начала атаки Панкейка
   есть 10 реальных секунд.
*/

let pancakeAttackActive = false;

let pancakeAttackTimer = null;

let pancakeAttackStartedAt = 0;


/* =================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
=================================================

   NIGHT 1 = 5 минут
   NIGHT 2 = 6 минут
   NIGHT 3 = 7 минут
   и т.д.

*/

function getNightDuration() {

    return 4 + selectedNight;

}


/*
   Вся ночь = 6 игровых часов.

   Например:

   Night 1:
   5 реальных минут
   = 300 секунд

   300 / 360
   = 0.833 сек на игровую минуту
*/

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
   ПОЗИЦИЯ ЛИЧИ
=================================================

   0 = далеко
   1 = камера
   2 = коридор
   3 = рядом
   4 = атака

================================================= */

let lichiPosition = 0;


/* =================================================
   ПОЗИЦИЯ ПАНКЕЙКА
=================================================

   0 = отсутствует
   1 = далеко
   2 = возле окна
   3 = начинает ломать окно

================================================= */

let pancakePosition = 0;


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
   ПОЗИЦИИ ЛИЧИ
================================================= */

const lichiCameraPositions = {

    1: "cam01",

    2: "cam02",

    3: "cam03",

    4: "cam03"

};


/* =================================================
   ПОЗИЦИИ ПАНКЕЙКА
================================================= */

const pancakeCameraPositions = {

    1: "cam04",

    2: "cam05",

    3: "cam06"

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
   НАЧАЛЬНОЕ МЕНЮ
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


/* =================================================
   МЕНЮ НОЧЕЙ
================================================= */

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

        if (!document.fullscreenElement) {

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

    stopAllGameSounds();

    clearPancakeAttack();

    clearRedirect();

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


    electricityTarget =
        "office";


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


    electricStatus.textContent =
        "ЭЛЕКТРИЧЕСТВО: НОРМА";


    redirectBar.style.width =
        "0%";


    redirectStatus.textContent =
        "СИСТЕМА ГОТОВА";


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

    underTablePanel.style.display =
        "none";

    electricPanel.style.display =
        "none";


    gameOverScreen.style.display =
        "none";

    winScreen.style.display =
        "none";


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

    gameStarted = true;

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


    /* =============================================
       ЛИЧИ
    ============================================= */

    /*
       На первой ночи Личи идёт быстрее.
    */

    const lichiSpeed =
        selectedNight === 1
            ? 35
            : 30;


    if (
        gameMinutes >= 60 &&
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
                    function () {}
                );

            } catch (e) {}

        }

    }


    /* =============================================
       ПАНКЕЙК
       ТОЛЬКО СО ВТОРОЙ НОЧИ
    ============================================= */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        /*
           Панкейк двигается к окну
           каждые 45 игровых минут.
        */

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


                try {

                    pancakeAudio.currentTime =
                        0;

                    pancakeAudio.play()
                    .catch(
                        function () {}
                    );

                } catch (e) {}

            }

        }

    }


    /* =============================================
       ЛИЧИ ДОШЛА
    ============================================= */

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
            1500
        );

    }


    /* =============================================
       ПАНКЕЙК ДОШЁЛ ДО ОКНА
    ============================================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !pancakeAttackActive
    ) {

        startPancakeAttack();

    }

}


/* =================================================
   ПАНКЕЙК — АТАКА ОКНА
================================================= */

function startPancakeAttack() {

    if (pancakeAttackActive)
        return;

    if (gameOver)
        return;


    pancakeAttackActive =
        true;


    pancakeAttackStartedAt =
        Date.now();


    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    showPancakeWarning();


    try {

        pancakeAudio.currentTime =
            0;

        pancakeAudio.play()
        .catch(
            function () {}
        );

    } catch (e) {}


    /*
       10 реальных секунд.
    */

    pancakeAttackTimer =
        setTimeout(
            function () {

                if (
                    pancakeAttackActive &&
                    !gameOver
                ) {

                    loseGame(
                        "Панкейк выломал переднее окно."
                    );

                }

            },
            10000
        );

}


/* =================================================
   ПРЕДУПРЕЖДЕНИЕ
================================================= */

function showPancakeWarning() {

    let warning =
        document.getElementById(
            "pancakeWarning"
        );


    if (!warning) {

        warning =
            document.createElement(
                "div"
            );

        warning.id =
            "pancakeWarning";

        warning.textContent =
            "ПАНКЕЙК ЛОМАЕТ ОКНО!";

        game.appendChild(
            warning
        );

    }


    warning.style.display =
        "block";

}


/* =================================================
   УБРАТЬ АТАКУ
================================================= */

function clearPancakeAttack() {

    if (pancakeAttackTimer) {

        clearTimeout(
            pancakeAttackTimer
        );

        pancakeAttackTimer =
            null;

    }


    pancakeAttackActive =
        false;


    const warning =
        document.getElementById(
            "pancakeWarning"
        );


    if (warning) {

        warning.style.display =
            "none";

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

        if (
            pancakeAttackActive
        ) {

            status.textContent =
                "ПАНКЕЙК ЛОМАЕТ ОКНО!";

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


    /* =============================================
       ЛИЧИ
    ============================================= */

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


    /* =============================================
       ПАНКЕЙК
    ============================================= */

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
    function () {

        if (!gameStarted)
            return;

        if (gameOver)
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


    /* =============================================
       ЛИЧИ
    ============================================= */

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


    /* =============================================
       ПАНКЕЙК
    ============================================= */

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


    try {

        flashAudio.currentTime =
            0;

        flashAudio.play()
        .catch(
            function () {}
        );

    } catch (e) {}


    setTimeout(
        function () {

            try {

                lichiAudio.currentTime =
                    0;

                lichiAudio.play()
                .catch(
                    function () {}
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
   ПОД СТОЛОМ
================================================= */

underTableButton.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (gameOver)
            return;


        cameraPanel.style.display =
            "none";

        electricPanel.style.display =
            "none";


        underTablePanel.style.display =
            "flex";


        updateElectricStatus();

    }
);


/* =================================================
   ЗАКРЫТЬ ПОД СТОЛОМ
================================================= */

closeUnderTable.addEventListener(
    "click",
    function () {

        underTablePanel.style.display =
            "none";


        view.style.backgroundImage =
            `url("${officeViews[currentView]}")`;


        updateOfficeCharacters();

    }
);


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

        if (redirecting)
            return;


        electricPanel.style.display =
            "flex";


        redirectBar.style.width =
            "0%";


        redirectStatus.textContent =
            "СИСТЕМА ГОТОВА";


        updateElectricChoices();

    }
);


/* =================================================
   ВЫБОР НАПРАВЛЕНИЯ
================================================= */

electricChoices.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.target;


                startRedirect(
                    target
                );

            }
        );

    }
);


/* =================================================
   НАЧАТЬ ПЕРЕНАПРАВЛЕНИЕ
================================================= */

function startRedirect(target) {

    if (redirecting)
        return;


    if (gameOver)
        return;


    redirecting =
        true;


    electricChoices.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    redirectBar.style.width =
        "0%";


    redirectStatus.textContent =
        "ПЕРЕНАПРАВЛЕНИЕ...";


    const startTime =
        Date.now();


    const duration =
        2000;


    redirectTimer =
        setInterval(
            function () {

                const elapsed =
                    Date.now() -
                    startTime;


                const percent =
                    Math.min(
                        100,
                        (elapsed /
                        duration) * 100
                    );


                redirectBar.style.width =
                    percent + "%";


                if (
                    percent >= 100
                ) {

                    finishRedirect(
                        target
                    );

                }

            },
            30
        );

}


/* =================================================
   ЗАВЕРШЕНИЕ ПЕРЕНАПРАВЛЕНИЯ
================================================= */

function finishRedirect(target) {

    clearRedirect();


    electricityTarget =
        target;


    electricChoices.forEach(
        function (button) {

            button.disabled =
                false;

        }
    );


    redirectBar.style.width =
        "100%";


    redirectStatus.textContent =
        "ЭЛЕКТРИЧЕСТВО ПЕРЕНАПРАВЛЕНО";


    updateElectricStatus();


    /*
       Если Панкейк уже ломал окно,
       правильное направление
       спасает игрока.
    */

    if (
        pancakeAttackActive &&
        target === "window"
    ) {

        stopPancakeAttack();

    }

}


/* =================================================
   ОСТАНОВИТЬ ПЕРЕНАПРАВЛЕНИЕ
================================================= */

function clearRedirect() {

    if (redirectTimer) {

        clearInterval(
            redirectTimer
        );

        redirectTimer =
            null;

    }


    redirecting =
        false;

}


/* =================================================
   ОБНОВИТЬ СТАТУС ЭЛЕКТРИЧЕСТВА
================================================= */

function updateElectricStatus() {

    if (
        electricityTarget ===
        "window"
    ) {

        electricStatus.textContent =
            "ЭЛЕКТРИЧЕСТВО: ПЕРЕДНЕЕ ОКНО";

    }

    else if (
        electricityTarget ===
        "left"
    ) {

        electricStatus.textContent =
            "ЭЛЕКТРИЧЕСТВО: ЛЕВЫЙ КОРИДОР";

    }

    else if (
        electricityTarget ===
        "right"
    ) {

        electricStatus.textContent =
            "ЭЛЕКТРИЧЕСТВО: ПРАВЫЙ КОРИДОР";

    }

    else {

        electricStatus.textContent =
            "ЭЛЕКТРИЧЕСТВО: НОРМА";

    }

}


/* =================================================
   КНОПКА ЗАКРЫТИЯ ЭЛЕКТРИЧЕСТВА
================================================= */

closeElectric.addEventListener(
    "click",
    function () {

        if (redirecting)
            return;


        electricPanel.style.display =
            "none";


        underTablePanel.style.display =
            "flex";


        updateElectricStatus();

    }
);


/* =================================================
   ПАНКЕЙК ПОЛУЧИЛ ЭЛЕКТРИЧЕСТВО
================================================= */

function stopPancakeAttack() {

    if (!pancakeAttackActive)
        return;


    if (pancakeAttackTimer) {

        clearTimeout(
            pancakeAttackTimer
        );

        pancakeAttackTimer =
            null;

    }


    pancakeAttackActive =
        false;


    pancakePosition =
        0;


    const warning =
        document.getElementById(
            "pancakeWarning"
        );


    if (warning) {

        warning.style.display =
            "none";

    }


    pancake.style.display =
        "none";


    try {

        pancakeAudio.pause();

    } catch (e) {}


    status.textContent =
        "ПАНКЕЙК ОТСТУПИЛ ОТ ОКНА.";


    setTimeout(
        function () {

            if (
                !gameOver
            ) {

                status.textContent =
                    currentView === "front"
                        ? "ОФИС"
                        : currentView === "left"
                            ? "ЛЕВЫЙ КОРИДОР"
                            : "ПРАВЫЙ КОРИДОР";

            }

        },
        2000
    );

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateElectricStatus();

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

    clearPancakeAttack();

    clearRedirect();

    stopAllGameSounds();


    loseReason.textContent =
        reason ||
        "Ты проиграл.";


    try {

        screamAudio.currentTime =
            0;

        screamAudio.play()
        .catch(
            function () {}
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

    clearPancakeAttack();

    clearRedirect();

    stopAllGameSounds();


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

    }

    else {

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

        clearPancakeAttack();

        clearRedirect();

        stopAllGameSounds();


        game.style.display =
            "none";


        gameOverScreen.style.display =
            "none";


        phoneScreen.style.display =
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

        clearPancakeAttack();

        clearRedirect();

        stopAllGameSounds();


        game.style.display =
            "none";


        winScreen.style.display =
            "none";


        phoneScreen.style.display =
            "none";


        mainMenu.style.display =
            "flex";


        renderNights();

    }
);


/* =================================================
   ОСТАНОВИТЬ ЗВУКИ
================================================= */

function stopAllGameSounds() {

    try {

        humAudio.pause();

    } catch (e) {}


    try {

        ventAudio.pause();

    } catch (e) {}


    try {

        pancakeAudio.pause();

    } catch (e) {}

}


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
