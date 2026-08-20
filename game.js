/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 2
   10 РЕАЛЬНЫХ МИНУТ НА ВСЮ НОЧЬ
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

const phoneNight =
    document.getElementById("phoneNight");

const phoneAudio =
    document.getElementById("phoneAudio");

const flashAudio =
    document.getElementById("flashAudio");

const lichiAudio =
    document.getElementById("lichiAudio");

const pancakeAudio =
    document.getElementById("pancakeAudio");

const screamAudio =
    document.getElementById("screamAudio");

const humAudio =
    document.getElementById("humAudio");

const ventAudio =
    document.getElementById("ventAudio");

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const pancake =
    document.getElementById("pancake");

const status =
    document.getElementById("status");

const time =
    document.getElementById("time");

const nightDisplay =
    document.getElementById("night");

const flash =
    document.getElementById("flash");

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

const ventPanel =
    document.getElementById("ventPanel");

const ventStatus =
    document.getElementById("ventStatus");

const pancakeVent =
    document.getElementById("pancakeVent");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");


/* =================================================
   СОХРАНЕНИЕ
================================================= */

let completedNight =
    Number(
        localStorage.getItem(
            "bloodGlowNightCompleted"
        )
    ) || 0;

let selectedNight = 2;


/* =================================================
   СОСТОЯНИЕ ИГРЫ
================================================= */

let gameStarted = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";

let currentCamera = "cam01";

let flashCooldown = false;


/* =================================================
   ВРЕМЯ
================================================= */

/*
   ВСЯ НОЧЬ:

   10 реальных минут
   = 600 секунд

   12:00 AM → 6:00 AM
   = 360 игровых минут

   600 / 360
   = 1.666... секунды

   на одну игровую минуту.
*/

const NIGHT_DURATION =
    10 * 60 * 1000;

const TOTAL_GAME_MINUTES =
    6 * 60;

const MINUTE_DURATION =
    NIGHT_DURATION /
    TOTAL_GAME_MINUTES;

let lastGameMinuteTime = 0;


/* =================================================
   ЛИЧИ
================================================= */

/*
    0 — далеко
    1 — коридор
    2 — рядом с офисом
    3 — дверь
    4 — атака
*/

let lichiPosition = 0;


/* =================================================
   ПАНКЕЙК
================================================= */

/*
    0 — далеко
    1 — вентиляция V1
    2 — развилка
    3 — вентиляция V3
    4 — возле офиса
    5 — атака
*/

let pancakePosition = 0;


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

let ventDoors = {

    1: false,
    2: false,
    3: false,
    4: false,
    5: false

};


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
        "images/cam07.png",

    cam08:
        "images/cam08.png"

};


/*
   Положение Личи
*/

const lichiCameraPositions = {

    1: "cam01",

    2: "cam01",

    3: "cam06",

    4: "cam06"

};


/*
   Положение Панкейка
*/

const pancakeCameraPositions = {

    1: "cam04",

    2: "cam05",

    3: "cam07",

    4: "cam08"

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

    }

    catch (error) {

        console.log(
            "Fullscreen error:",
            error
        );

    }

}


/* =================================================
   ГЛАВНОЕ МЕНЮ
================================================= */

document
.getElementById("startGameButton")
.addEventListener(
    "click",
    function () {

        selectedNight =
            completedNight >= 1
                ? Math.min(
                    completedNight + 1,
                    13
                )
                : 1;

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

        mainMenu
            .classList
            .add("hidden");

        nightsMenu
            .classList
            .remove("hidden");

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function () {

        nightsMenu
            .classList
            .add("hidden");

        mainMenu
            .classList
            .remove("hidden");

    }
);


/* =================================================
   НАСТРОЙКИ
================================================= */

document
.getElementById("settingsButton")
.addEventListener(
    "click",
    function () {

        mainMenu
            .classList
            .add("hidden");

        settingsMenu
            .classList
            .remove("hidden");

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function () {

        settingsMenu
            .classList
            .add("hidden");

        mainMenu
            .classList
            .remove("hidden");

    }
);


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

            button.textContent =
                "🔒 " + i;

            button.disabled =
                true;

        }

        else {

            button.textContent =
                "NIGHT " + i;

            button.addEventListener(
                "click",
                function () {

                    selectedNight =
                        i;

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
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    mainMenu
        .classList
        .add("hidden");

    nightsMenu
        .classList
        .add("hidden");

    settingsMenu
        .classList
        .add("hidden");


    phoneScreen
        .classList
        .remove("hidden");


    game
        .classList
        .add("hidden");


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


    ventDoors = {

        1: false,
        2: false,
        3: false,
        4: false,
        5: false

    };


    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;


    phoneNight.textContent =
        "NIGHT " +
        selectedNight;


    time.textContent =
        "12:00 AM";


    status.textContent =
        "Офис. Ночь начинается.";


    gameOverScreen
        .classList
        .add("hidden");

    winScreen
        .classList
        .add("hidden");

    cameraPanel
        .classList
        .add("hidden");

    ventPanel
        .classList
        .add("hidden");


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    lichi.style.display =
        "none";

    pancake.style.display =
        "none";


    stopAllSounds();


    phoneAudio.currentTime =
        0;

    phoneAudio.play()
        .catch(
            () => {}
        );

}


/* =================================================
   ПРОПУСК ЗВОНКА
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


    gameMinutes = 0;


    /*
       Запускаем точный
       игровой таймер.
    */

    lastGameMinuteTime =
        performance.now();


    phoneScreen
        .classList
        .add("hidden");


    game
        .classList
        .remove("hidden");


    humAudio.currentTime =
        0;

    humAudio.play()
        .catch(
            () => {}
        );


    updateEverything();

}


/* =================================================
   ОСТАНОВКА ЗВУКОВ
================================================= */

function stopAllSounds() {

    phoneAudio.pause();

    humAudio.pause();

    ventAudio.pause();

    flashAudio.pause();

    lichiAudio.pause();

    pancakeAudio.pause();

    screamAudio.pause();

}


/* =================================================
   ПОВОРОТ ОФИСА
================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    if (
        !officeViews[direction]
    ) {

        return;

    }


    currentView =
        direction;


    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;


    updateOfficeEnemies();


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
    () =>
        changeView("left")
);


document
.getElementById("frontButton")
.addEventListener(
    "click",
    () =>
        changeView("front")
);


document
.getElementById("rightButton")
.addEventListener(
    "click",
    () =>
        changeView("right")
);


/* =================================================
   ЛИЧИ В ОФИСЕ
================================================= */

function updateOfficeLichi() {

    if (
        lichiPosition < 2
    ) {

        lichi.style.display =
            "none";

        return;

    }


    if (
        currentView !== "left"
    ) {

        lichi.style.display =
            "none";

        return;

    }


    lichi.style.display =
        "block";


    lichi.style.transform =
        "translate(-50%, -50%)";


    if (
        lichiPosition === 2
    ) {

        lichi.style.left =
            "72%";

        lichi.style.top =
            "48%";

        lichi.style.width =
            "130px";

    }

    else if (
        lichiPosition === 3
    ) {

        lichi.style.left =
            "57%";

        lichi.style.top =
            "50%";

        lichi.style.width =
            "190px";

    }

    else {

        lichi.style.left =
            "50%";

        lichi.style.top =
            "52%";

        lichi.style.width =
            "280px";

    }

}


/* =================================================
   ПАНКЕЙК В ОФИСЕ
================================================= */

function updateOfficePancake() {

    pancake.style.display =
        "none";


    if (
        pancakePosition < 4
    ) {

        return;

    }


    if (
        currentView !== "front"
    ) {

        return;

    }


    pancake.style.display =
        "block";


    pancake.style.left =
        "50%";

    pancake.style.top =
        "50%";


    if (
        pancakePosition === 4
    ) {

        pancake.style.width =
            "140px";

    }

    else {

        pancake.style.width =
            "280px";

    }

}


/* =================================================
   ОБНОВЛЕНИЕ ВРАГОВ
================================================= */

function updateOfficeEnemies() {

    updateOfficeLichi();

    updateOfficePancake();

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

        cameraPanel
            .classList
            .remove("hidden");

        ventPanel
            .classList
            .add("hidden");

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

        cameraPanel
            .classList
            .add("hidden");

        view.style.backgroundImage =
            `url("${officeViews[currentView]}")`;

        updateOfficeEnemies();

        status.textContent =
            currentView === "left"
                ? "ЛЕВЫЙ КОРИДОР"
                : currentView === "right"
                    ? "ПРАВЫЙ КОРИДОР"
                    : "ОФИС";

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
        camera
            .toUpperCase();


    updateCameraEnemies();


    status.textContent =
        camera
            .toUpperCase();

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
   ЛИЧИ НА КАМЕРАХ
================================================= */

function updateCameraLichi() {

    cameraLichi.style.display =
        "none";


    const camera =
        lichiCameraPositions[
            lichiPosition
        ];


    if (
        camera === currentCamera
    ) {

        cameraLichi.style.display =
            "block";

    }

}


/* =================================================
   ПАНКЕЙК НА КАМЕРАХ
================================================= */

function updateCameraPancake() {

    cameraPancake.style.display =
        "none";


    const camera =
        pancakeCameraPositions[
            pancakePosition
        ];


    if (
        camera === currentCamera
    ) {

        cameraPancake.style.display =
            "block";

    }

}


/* =================================================
   ОБНОВЛЕНИЕ КАМЕР
================================================= */

function updateCameraEnemies() {

    updateCameraLichi();

    updateCameraPancake();

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


    flashAudio.currentTime =
        0;

    flashAudio.play()
        .catch(
            () => {}
        );


    if (
        lichiPosition >= 2
    ) {

        setTimeout(
            function () {

                lichiAudio.currentTime =
                    0;

                lichiAudio.play()
                    .catch(
                        () => {}
                    );

            },
            80
        );


        lichiPosition =
            0;


        lichi.style.display =
            "none";


        status.textContent =
            "ВСПЫШКА! Личи отступила.";

    }


    setTimeout(
        function () {

            flashCooldown =
                false;

        },
        1500
    );

}


/* =================================================
   ВЕНТИЛЯЦИЯ
================================================= */

document
.getElementById("ventButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;


        ventPanel
            .classList
            .remove("hidden");

        cameraPanel
            .classList
            .add("hidden");


        ventAudio.play()
            .catch(
                () => {}
            );


        updateVentMap();

    }
);


document
.getElementById("closeVentPanel")
.addEventListener(
    "click",
    function () {

        ventPanel
            .classList
            .add("hidden");

        ventAudio.pause();

    }
);


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

document
.querySelectorAll(
    ".ventDoor"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const door =
                    button.dataset.door;


                ventDoors[door] =
                    !ventDoors[door];


                updateVentMap();

            }
        );

    }
);


/* =================================================
   ОБНОВЛЕНИЕ ВЕНТИЛЯЦИИ
================================================= */

function updateVentMap() {

    document
        .querySelectorAll(
            ".ventDoor"
        )
        .forEach(
            function (button) {

                const door =
                    button.dataset.door;

                if (
                    ventDoors[door]
                ) {

                    button.textContent =
                        "ПЕРЕГОРОДКА " +
                        door +
                        " ЗАКРЫТА";

                }

                else {

                    button.textContent =
                        "ПЕРЕГОРОДКА " +
                        door +
                        " ОТКРЫТА";

                }

            }
        );


    pancakeVent.style.display =
        "none";


    /*
       Показываем Панкейка
       на его текущей позиции.
    */

    if (
        pancakePosition >= 1 &&
        pancakePosition <= 5
    ) {

        pancakeVent.style.display =
            "flex";


        if (
            pancakePosition === 1
        ) {

            pancakeVent.style.left =
                "10%";

            pancakeVent.style.top =
                "15%";

        }

        else if (
            pancakePosition === 2
        ) {

            pancakeVent.style.left =
                "45%";

            pancakeVent.style.top =
                "25%";

        }

        else if (
            pancakePosition === 3
        ) {

            pancakeVent.style.left =
                "70%";

            pancakeVent.style.top =
                "15%";

        }

        else if (
            pancakePosition === 4
        ) {

            pancakeVent.style.left =
                "42%";

            pancakeVent.style.top =
                "43%";

        }

        else {

            pancakeVent.style.left =
                "42%";

            pancakeVent.style.top =
                "65%";

        }

    }


    if (
        pancakePosition >= 4
    ) {

        ventStatus.textContent =
            "⚠ ПАНКЕЙК ПРИБЛИЖАЕТСЯ К ОФИСУ!";

    }

    else {

        ventStatus.textContent =
            "ВЕНТИЛЯЦИЯ НОРМАЛЬНА";

    }

}


/* =================================================
   ДВИЖЕНИЕ ЛИЧИ
================================================= */

function moveLichi() {

    /*
       Личи начинает двигаться
       после 1:00.
    */

    if (
        gameMinutes < 60
    ) {

        return;

    }


    /*
       Каждые 40 игровых минут
       новое положение.

       Это делает её
       не слишком быстрой.
    */

    if (
        gameMinutes % 40 === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

        }

        updateEverything();

    }


    /*
       Если Личи дошла
       до атаки.
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
            2500
        );

    }

}


/* =================================================
   ДВИЖЕНИЕ ПАНКЕЙКА
================================================= */

function movePancake() {

    /*
       Панкейк начинает
       активироваться с 2:00.
    */

    if (
        gameMinutes < 120
    ) {

        return;

    }


    /*
       Каждые 45 игровых минут
       двигается дальше.
    */

    if (
        gameMinutes % 45 === 0
    ) {

        if (
            pancakePosition < 5
        ) {

            /*
               Проверяем перегородки.

               Если соответствующая
               перегородка закрыта —
               Панкейк не проходит.
            */

            let blocked = false;


            if (
                pancakePosition === 1 &&
                ventDoors[1]
            ) {

                blocked = true;

            }

            if (
                pancakePosition === 2 &&
                ventDoors[2]
            ) {

                blocked = true;

            }

            if (
                pancakePosition === 3 &&
                ventDoors[3]
            ) {

                blocked = true;

            }

            if (
                pancakePosition === 4 &&
                ventDoors[4]
            ) {

                blocked = true;

            }


            if (!blocked) {

                pancakePosition++;

                pancakeAudio.currentTime =
                    0;

                pancakeAudio.play()
                    .catch(
                        () => {}
                    );

            }

            else {

                ventStatus.textContent =
                    "ПЕРЕГОРОДКА УДЕРЖИВАЕТ ПАНКЕЙКА!";

            }

        }


        updateEverything();

    }


    /*
       Если дошёл до атаки.
    */

    if (
        pancakePosition >= 5
    ) {

        setTimeout(
            function () {

                if (
                    pancakePosition >= 5 &&
                    !gameOver
                ) {

                    loseGame();

                }

            },
            3000
        );

    }

}


/* =================================================
   ЧАСЫ
================================================= */

function updateClock() {

    if (
        gameMinutes >=
        TOTAL_GAME_MINUTES
    ) {

        gameMinutes =
            TOTAL_GAME_MINUTES;

        time.textContent =
            "6:00 AM";

        winGame();

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
   ОБЩЕЕ ОБНОВЛЕНИЕ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeEnemies();

    updateCameraEnemies();

    updateVentMap();

}


/* =================================================
   ТОЧНЫЙ ТАЙМЕР
================================================= */

function gameTimerLoop() {

    if (
        !gameStarted ||
        gameOver ||
        nightFinished
    ) {

        requestAnimationFrame(
            gameTimerLoop
        );

        return;

    }


    const now =
        performance.now();


    const elapsed =
        now -
        lastGameMinuteTime;


    if (
        elapsed >=
        MINUTE_DURATION
    ) {

        const passed =
            Math.floor(
                elapsed /
                MINUTE_DURATION
            );


        gameMinutes +=
            passed;


        lastGameMinuteTime +=
            passed *
            MINUTE_DURATION;


        if (
            gameMinutes >
            TOTAL_GAME_MINUTES
        ) {

            gameMinutes =
                TOTAL_GAME_MINUTES;

        }


        moveLichi();

        movePancake();

        updateEverything();

    }


    requestAnimationFrame(
        gameTimerLoop
    );

}


requestAnimationFrame(
    gameTimerLoop
);


/* =================================================
   GAME OVER
================================================= */

function loseGame() {

    if (gameOver)
        return;


    gameOver =
        true;


    stopAllSounds();


    screamAudio.currentTime =
        0;

    screamAudio.play()
        .catch(
            () => {}
        );


    gameOverScreen
        .classList
        .remove("hidden");

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


    stopAllSounds();


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


    winScreen
        .classList
        .remove("hidden");

}


/* =================================================
   СЛЕДУЮЩАЯ НОЧЬ
================================================= */

nextNightButton
.addEventListener(
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
   ПЕРЕЗАПУСК
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

        stopAllSounds();

        game
            .classList
            .add("hidden");

        gameOverScreen
            .classList
            .add("hidden");

        mainMenu
            .classList
            .remove("hidden");

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

        stopAllSounds();

        game
            .classList
            .add("hidden");

        winScreen
            .classList
            .add("hidden");

        mainMenu
            .classList
            .remove("hidden");

        renderNights();

    }
);


/* =================================================
   СТАРТ
================================================= */

renderNights();
