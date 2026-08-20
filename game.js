/* =================================================
   BLOOD GLOW NIGHT
   ПОЛНАЯ ВЕРСИЯ

   3 секунды = 1 игровая минута

   Личи
   Камеры
   Вентиляция
   Перегородки
   Развилки
   Звуки
   Сохранение ночей
================================================= */


/* =================================================
   МЕНЮ
================================================= */

const mainMenu =
    document.getElementById("mainMenu");

const nightsMenu =
    document.getElementById("nightsMenu");

const settingsMenu =
    document.getElementById("settingsMenu");

const nightsList =
    document.getElementById("nightsList");


/* =================================================
   ИГРА
================================================= */

const game =
    document.getElementById("game");

const phoneScreen =
    document.getElementById("phoneScreen");

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const status =
    document.getElementById("status");

const time =
    document.getElementById("time");

const nightDisplay =
    document.getElementById("night");


/* =================================================
   ПАНЕЛИ
================================================= */

const cameraPanel =
    document.getElementById("cameraPanel");

const cameraImage =
    document.getElementById("cameraImage");

const ventPanel =
    document.getElementById("ventPanel");

const ventImage =
    document.getElementById("ventImage");


/* =================================================
   ЭКРАНЫ
================================================= */

const flash =
    document.getElementById("flash");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");


/* =================================================
   ЗВУКИ
================================================= */

const phoneAudio =
    document.getElementById("phoneAudio");

const flashAudio =
    document.getElementById("flashAudio");

const lichiAudio =
    document.getElementById("lichiAudio");

const humAudio =
    document.getElementById("humAudio");

const ventAudio =
    document.getElementById("ventAudio");


/* =================================================
   СОХРАНЕНИЕ
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

let currentVent = "vent01";

let flashCooldown = false;


/* =================================================
   ЛИЧИ

   0 — далеко
   1 — первая позиция
   2 — коридор
   3 — рядом с офисом
   4 — дверь
   5 — атака
================================================= */

let lichiPosition = 0;


/* =================================================
   ВЕНТИЛЯЦИЯ

   0 — далеко
   1 — V1
   2 — V2
   3 — V3
   4 — офис
================================================= */

let ventPosition = 0;


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

let barriers = {

    1: false,

    2: false,

    3: false

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
        "images/cam07.png"

};


/* =================================================
   ВЕНТИЛЯЦИЯ
================================================= */

const ventImages = {

    vent01:
        "images/vent01.png",

    vent02:
        "images/vent02.png",

    vent03:
        "images/vent03.png",

    vent04:
        "images/vent04.png"

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
   ГДЕ ЛИЧИ НА КАМЕРАХ
================================================= */

const lichiCameraPositions = {

    1:
        "cam01",

    2:
        "cam02",

    3:
        "cam06",

    4:
        "cam06",

    5:
        "cam06"

};


/* =================================================
   ГДЕ ЛИЧИ В ВЕНТИЛЯЦИИ
================================================= */

const lichiVentPositions = {

    1:
        "vent01",

    2:
        "vent02",

    3:
        "vent03",

    4:
        "vent04"

};


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

    }

    catch (error) {

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


document
    .getElementById("fullscreenSetting")
    .addEventListener(
        "click",
        enterFullscreen
    );


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

            button.classList
                .add("locked");

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


    gameStarted =
        false;

    gameOver =
        false;

    nightFinished =
        false;


    gameMinutes =
        0;


    currentView =
        "front";


    currentCamera =
        "cam01";


    currentVent =
        "vent01";


    lichiPosition =
        0;


    ventPosition =
        0;


    barriers = {

        1: false,

        2: false,

        3: false

    };


    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;


    time.textContent =
        "12:00 AM";


    status.textContent =
        "ОФИС";


    gameOverScreen.style.display =
        "none";

    winScreen.style.display =
        "none";


    cameraPanel.style.display =
        "none";

    ventPanel.style.display =
        "none";


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    lichi.style.display =
        "none";


    humAudio.pause();

    ventAudio.pause();


    /*
       Телефонный звонок.
    */

    phoneAudio.currentTime =
        0;


    phoneAudio.play()
        .catch(
            function (error) {

                console.log(
                    "Телефон:",
                    error
                );

            }
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

    if (gameStarted) {

        return;

    }


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
            function (error) {

                console.log(
                    "Hum:",
                    error
                );

            }
        );


    updateEverything();

}


/* =================================================
   ПОВОРОТЫ
================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    if (!officeViews[direction]) {

        return;

    }


    currentView =
        direction;


    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;


    view.style.backgroundSize =
        "cover";

    view.style.backgroundPosition =
        "center";


    updateOfficeLichi();


    if (direction === "left") {

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
        () => changeView("left")
    );


document
    .getElementById("frontButton")
    .addEventListener(
        "click",
        () => changeView("front")
    );


document
    .getElementById("rightButton")
    .addEventListener(
        "click",
        () => changeView("right")
    );


/* =================================================
   ЛИЧИ В ОФИСЕ
================================================= */

function updateOfficeLichi() {

    if (
        lichiPosition < 3
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


    if (
        lichiPosition === 3
    ) {

        lichi.style.left =
            "72%";

        lichi.style.top =
            "48%";

        lichi.style.width =
            "130px";

    }

    else if (
        lichiPosition === 4
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
   КАМЕРЫ — ОТКРЫТЬ
================================================= */

document
    .getElementById("cameraButton")
    .addEventListener(
        "click",
        function () {

            if (!gameStarted)
                return;

            cameraPanel.style.display =
                "block";


            ventPanel.style.display =
                "none";


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

            cameraPanel.style.display =
                "none";


            view.style.backgroundImage =
                `url("${officeViews[currentView]}")`;


            updateOfficeLichi();


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


    cameraImage.style.backgroundSize =
        "cover";


    cameraImage.style.backgroundPosition =
        "center";


    updateCameraLichi();


    status.textContent =
        camera.toUpperCase();

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

    const old =
        document.getElementById(
            "cameraLichi"
        );


    old.innerHTML = "";


    if (
        lichiPosition === 0 ||
        lichiPosition >= 5
    ) {

        return;

    }


    const correctCamera =
        lichiCameraPositions[
            lichiPosition
        ];


    if (
        correctCamera !==
        currentCamera
    ) {

        return;

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        "images/lichi.png";


    image.style.position =
        "absolute";


    image.style.width =
        "170px";


    image.style.left =
        "50%";


    image.style.top =
        "50%";


    image.style.transform =
        "translate(-50%, -50%)";


    image.style.filter =
        "contrast(1.2)";


    old.appendChild(
        image
    );


    status.textContent =
        "⚠ ЛИЧИ ОБНАРУЖЕНА";


    image.animate(
        [
            {
                opacity: .7
            },

            {
                opacity: 1
            },

            {
                opacity: .7
            }

        ],
        {
            duration: 600,

            iterations: 2
        }
    );

}


/* =================================================
   ВЕНТИЛЯЦИЯ — ОТКРЫТЬ
================================================= */

document
    .getElementById("ventButton")
    .addEventListener(
        "click",
        function () {

            if (!gameStarted)
                return;


            ventPanel.style.display =
                "block";


            cameraPanel.style.display =
                "none";


            showVent(
                currentVent
            );


            ventAudio.currentTime =
                0;


            ventAudio.play()
                .catch(
                    function () {}
                );

        }
    );


/* =================================================
   ЗАКРЫТЬ ВЕНТИЛЯЦИЮ
================================================= */

document
    .getElementById("closeVentPanel")
    .addEventListener(
        "click",
        function () {

            ventPanel.style.display =
                "none";


            ventAudio.pause();


            status.textContent =
                "ОФИС";

        }
    );


/* =================================================
   ПОКАЗ ВЕНТИЛЯЦИИ
================================================= */

function showVent(vent) {

    currentVent =
        vent;


    const image =
        ventImages[vent];


    if (!image)
        return;


    ventImage.style.backgroundImage =
        `url("${image}")`;


    ventImage.style.backgroundSize =
        "cover";


    ventImage.style.backgroundPosition =
        "center";


    updateVentLichi();


    status.textContent =
        vent.toUpperCase();

}


/* =================================================
   КАРТА ВЕНТИЛЯЦИИ
================================================= */

document
    .querySelectorAll(
        ".ventNode"
    )
    .forEach(
        function (node, index) {

            node.addEventListener(
                "click",
                function () {

                    if (
                        index === 0
                    ) {

                        showVent(
                            "vent01"
                        );

                    }

                    else if (
                        index === 1
                    ) {

                        showVent(
                            "vent02"
                        );

                    }

                    else if (
                        index === 2
                    ) {

                        showVent(
                            "vent03"
                        );

                    }

                    else {

                        showVent(
                            "vent04"
                        );

                    }

                }
            );

        }
    );


/* =================================================
   ЛИЧИ В ВЕНТИЛЯЦИИ
================================================= */

function updateVentLichi() {

    const old =
        document.getElementById(
            "ventLichi"
        );


    old.innerHTML = "";


    const correctVent =
        lichiVentPositions[
            ventPosition
        ];


    if (
        !correctVent ||
        correctVent !== currentVent
    ) {

        return;

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        "images/lichi.png";


    image.style.width =
        "150px";


    image.style.position =
        "absolute";


    image.style.left =
        "50%";


    image.style.top =
        "50%";


    image.style.transform =
        "translate(-50%, -50%)";


    old.appendChild(
        image
    );


    status.textContent =
        "⚠ ДВИЖЕНИЕ В ВЕНТИЛЯЦИИ";

}


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

document
    .querySelectorAll(
        ".barrier"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            button.dataset
                                .barrier
                        );


                    barriers[id] =
                        !barriers[id];


                    button.classList
                        .toggle(
                            "closed",
                            barriers[id]
                        );


                    const text =
                        button.querySelector(
                            "span"
                        );


                    if (
                        barriers[id]
                    ) {

                        text.textContent =
                            "ЗАКРЫТА";

                    }

                    else {

                        text.textContent =
                            "ОТКРЫТА";

                    }


                    status.textContent =
                        barriers[id]
                            ? "ПЕРЕГОРОДКА ЗАКРЫТА"
                            : "ПЕРЕГОРОДКА ОТКРЫТА";

                }
            );

        }
    );


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
            "ВСПЫШКА РАБОТАЕТ В ЛЕВОМ КОРИДОРЕ.";

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


    flashAudio.currentTime =
        0;


    flashAudio.play()
        .catch(
            function () {}
        );


    /*
       Крик Личи.
    */

    setTimeout(
        function () {

            lichiAudio.currentTime =
                0;

            lichiAudio.play()
                .catch(
                    function () {}
                );

        },
        80
    );


    /*
       Личи отбрасывается
       далеко назад.
    */

    lichiPosition =
        0;


    updateEverything();


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
   ВРЕМЯ

   3 секунды = 1 минута

   12:00 → 1:00
   = 60 игровых минут
   = 180 секунд
================================================= */

function updateClock() {

    if (
        gameMinutes >= 360
    ) {

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
   ДВИЖЕНИЕ ЛИЧИ
================================================= */

function moveLichi() {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Личи начинает
       двигаться с 1 AM.
    */

    if (
        gameMinutes < 60
    ) {

        return;

    }


    /*
       Каждые 10 игровых минут
       Личи пытается двигаться.

       Так как 3 секунды = минута,
       попытка происходит
       каждые 30 секунд.
    */

    if (
        gameMinutes % 10 !== 0
    ) {

        return;

    }


    /*
       Проверяем перегородки.

       Если путь закрыт,
       Личи задерживается.
    */

    if (
        lichiPosition === 1 &&
        barriers[1]
    ) {

        status.textContent =
            "ЛИЧИ ЗАДЕРЖАНА ПЕРЕГОРОДКОЙ 1.";

        return;

    }


    if (
        lichiPosition === 2 &&
        barriers[2]
    ) {

        status.textContent =
            "ЛИЧИ ЗАДЕРЖАНА ПЕРЕГОРОДКОЙ 2.";

        return;

    }


    if (
        lichiPosition === 3 &&
        barriers[3]
    ) {

        status.textContent =
            "ЛИЧИ ЗАДЕРЖАНА ПЕРЕГОРОДКОЙ 3.";

        return;

    }


    /*
       Переход Личи.
    */

    if (
        lichiPosition < 5
    ) {

        lichiPosition++;

    }


    /*
       После продвижения
       обновляем вентиляцию.
    */

    if (
        lichiPosition >= 1
    ) {

        ventPosition =
            Math.min(
                lichiPosition,
                4
            );

    }


    updateEverything();


    /*
       Положение 5 —
       атака.
    */

    if (
        lichiPosition >= 5
    ) {

        setTimeout(
            function () {

                if (
                    lichiPosition >= 5 &&
                    !gameOver
                ) {

                    loseGame();

                }

            },
            2000
        );

    }

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeLichi();

    updateCameraLichi();

    updateVentLichi();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame() {

    if (gameOver)
        return;


    gameOver =
        true;


    humAudio.pause();

    ventAudio.pause();


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


    humAudio.pause();

    ventAudio.pause();


    /*
       Сохраняем прогресс.
    */

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
   МЕНЮ ПОСЛЕ GAME OVER
================================================= */

document
    .getElementById("menuAfterLose")
    .addEventListener(
        "click",
        function () {

            game.style.display =
                "none";


            gameOverScreen.style.display =
                "none";


            mainMenu.style.display =
                "flex";


            humAudio.pause();

            ventAudio.pause();


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

            game.style.display =
                "none";


            winScreen.style.display =
                "none";


            mainMenu.style.display =
                "flex";


            humAudio.pause();

            ventAudio.pause();


            renderNights();

        }
    );


/* =================================================
   ИГРОВОЙ ТАЙМЕР

   3000 мс = 1 игровая минута
================================================= */

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


        /*
           Личи проверяет движение
           каждые 10 игровых минут.
        */

        moveLichi();


    },
    3000
);


/* =================================================
   СТАРТ
================================================= */

renderNights();
