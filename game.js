/* =========================================
   BLOOD GLOW NIGHT
   NIGHT 1 — ЛИЧИ
========================================= */


/* =========================
   ЭЛЕМЕНТЫ
========================= */

const mainMenu =
document.getElementById("mainMenu");

const game =
document.getElementById("game");

const startGameButton =
document.getElementById("startGameButton");

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

const view =
document.getElementById("view");

const lichi =
document.getElementById("lichi");

const status =
document.getElementById("status");

const time =
document.getElementById("time");

const flash =
document.getElementById("flash");

const gameOverScreen =
document.getElementById("gameOver");

const winScreen =
document.getElementById("winScreen");

const fullscreenButton =
document.getElementById("fullscreenButton");


/* =========================
   НАСТРОЙКИ ГРОМКОСТИ
========================= */

phoneAudio.volume = 1.0;

flashAudio.volume = 0.8;

lichiAudio.volume = 1.0;

humAudio.volume = 0.25;


/* =========================
   СОСТОЯНИЕ
========================= */

let gameStarted = false;

let currentView = "front";

let lichiPosition = 0;

let flashCooldown = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;


/* =========================
   ПОЗИЦИИ ЛИЧИ
========================= */

const LICHIPOSITIONS = {

    FAR: 0,

    MIDDLE: 1,

    NEAR: 2,

    DOOR: 3,

    ATTACK: 4

};


/* =========================
   КАМЕРЫ ОФИСА
========================= */

const officeViews = {

    front:
    "images/office_front.png",

    left:
    "images/office_left.png",

    right:
    "images/office_right.png"

};


/* =========================
   НАЧАТЬ ИГРУ
========================= */

startGameButton.addEventListener(
    "click",
    async function () {

        /*
           Переход в fullscreen
           происходит именно после
           нажатия игрока.
        */

        try {

            if (!document.fullscreenElement) {

                await document.documentElement
                    .requestFullscreen();

            }

        } catch (error) {

            console.log(
                "Fullscreen error:",
                error
            );

        }


        /*
           Меню убираем.
        */

        mainMenu.style.display =
            "none";


        /*
           Показываем телефон.
        */

        phoneScreen.style.display =
            "flex";


        /*
           Сбрасываем аудио.
        */

        phoneAudio.currentTime = 0;

        phoneAudio.volume = 1;


        /*
           Пытаемся сразу
           запустить звонок.
        */

        try {

            await phoneAudio.play();

        }

        catch (error) {

            console.log(
                "Браузер заблокировал звук:",
                error
            );

            showAudioButton();

        }

    }
);


/* =========================
   КНОПКА ДЛЯ ЗАПУСКА ЗВУКА
========================= */

function showAudioButton() {

    if (
        document.getElementById(
            "audioStartButton"
        )
    ) {

        return;

    }


    const button =
    document.createElement("button");


    button.id =
        "audioStartButton";


    button.textContent =
        "▶ ВКЛЮЧИТЬ ЗВОНОК";


    phoneScreen.appendChild(
        button
    );


    button.addEventListener(
        "click",
        async function () {

            try {

                await phoneAudio.play();

                button.remove();

            }

            catch (error) {

                console.log(error);

            }

        }
    );

}


/* =========================
   ПОСЛЕ ТЕЛЕФОНА
========================= */

phoneAudio.addEventListener(
    "ended",
    function () {

        startNight();

    }
);


/* =========================
   НАЧАЛО НОЧИ
========================= */

function startNight() {

    if (gameStarted)
        return;


    gameStarted = true;


    phoneScreen.style.display =
        "none";


    game.style.display =
        "block";


    gameMinutes = 0;


    lichiPosition =
        LICHIPOSITIONS.FAR;


    currentView =
        "front";


    gameOver =
        false;


    nightFinished =
        false;


    /*
       ЗАПУСК ПОСТОЯННОГО ГУЛА
    */

    humAudio.currentTime = 0;


    humAudio.play()
    .catch(
        function (error) {

            console.log(
                "Ошибка hum.mp3:",
                error
            );

        }
    );


    /*
       Начальный экран офиса.
    */

    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    time.textContent =
        "12:00 AM";


    status.textContent =
        "Офис. Ночь начинается.";


    updateLichiSprite();

}


/* =========================
   ПОВОРОТ КАМЕРЫ
========================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    currentView =
        direction;


    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;


    updateStatus();

    updateLichiSprite();

}


/* =========================
   СТАТУС
========================= */

function updateStatus() {

    if (currentView === "left") {

        if (
            lichiPosition >=
            LICHIPOSITIONS.ATTACK
        ) {

            status.textContent =
                "ЛИЧИ В ОФИСЕ! ВСПЫШКА!";

        }

        else if (
            lichiPosition >=
            LICHIPOSITIONS.DOOR
        ) {

            status.textContent =
                "Личи возле офиса!";

        }

        else if (
            lichiPosition >=
            LICHIPOSITIONS.NEAR
        ) {

            status.textContent =
                "Личи быстро приближается.";

        }

        else if (
            lichiPosition >=
            LICHIPOSITIONS.MIDDLE
        ) {

            status.textContent =
                "Личи идёт по коридору.";

        }

        else {

            status.textContent =
                "Личи далеко.";

        }

        return;

    }


    if (currentView === "right") {

        status.textContent =
            "Правый коридор пуст.";

        return;

    }


    status.textContent =
        "Офис.";

}


/* =========================
   ЛИЧИ
========================= */

function updateLichiSprite() {

    if (currentView !== "left") {

        lichi.style.display =
            "none";

        return;

    }


    if (
        lichiPosition <=
        LICHIPOSITIONS.FAR
    ) {

        lichi.style.display =
            "none";

        return;

    }


    lichi.style.display =
        "block";


    const positions = {

        1: {

            left: "80%",

            top: "44%",

            width: "90px"

        },

        2: {

            left: "68%",

            top: "47%",

            width: "130px"

        },

        3: {

            left: "54%",

            top: "50%",

            width: "180px"

        },

        4: {

            left: "43%",

            top: "52%",

            width: "260px"

        }

    };


    const position =
        positions[lichiPosition];


    if (!position)
        return;


    lichi.style.left =
        position.left;

    lichi.style.top =
        position.top;

    lichi.style.width =
        position.width;

}


/* =========================
   ВСПЫШКА
========================= */

function useFlash() {

    if (!gameStarted)
        return;

    if (flashCooldown)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Вспышка работает
       только при просмотре
       левого коридора.
    */

    if (currentView !== "left") {

        status.textContent =
            "Посмотри в левый коридор.";

        return;

    }


    /*
       Личи ещё далеко.
    */

    if (
        lichiPosition <
        LICHIPOSITIONS.DOOR
    ) {

        status.textContent =
            "Личи ещё слишком далеко.";

        return;

    }


    flashCooldown = true;


    /*
       Белая вспышка.
    */

    flash.style.opacity =
        "1";


    setTimeout(
        function () {

            flash.style.opacity =
                "0";

        },
        120
    );


    /*
       Звук вспышки.
    */

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
       обратно в начало.
    */

    lichiPosition =
        LICHIPOSITIONS.FAR;


    status.textContent =
        "ВСПЫШКА! Личи отступила!";


    updateLichiSprite();


    /*
       Перезарядка вспышки.
    */

    setTimeout(
        function () {

            flashCooldown =
                false;

        },
        1500
    );

}


/* =========================
   ДВИЖЕНИЕ ЛИЧИ
========================= */

function updateLichi() {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Личи начинает двигаться
       после 1:00 AM.
    */

    if (gameMinutes < 60)
        return;


    /*
       Каждые 20 секунд
       она приближается.
    */

    if (
        gameMinutes % 20 === 0
    ) {

        if (
            lichiPosition <
            LICHIPOSITIONS.ATTACK
        ) {

            lichiPosition++;

        }

    }


    updateStatus();

    updateLichiSprite();


    /*
       Если Личи дошла
       до офиса.
    */

    if (
        lichiPosition >=
        LICHIPOSITIONS.ATTACK
    ) {

        /*
           Если игрок смотрит
           в левый коридор,
           ему даётся возможность
           использовать вспышку.
        */

        if (
            currentView !== "left"
        ) {

            status.textContent =
                "ЛИЧИ ВОШЛА В ОФИС!";


            setTimeout(
                function () {

                    if (
                        lichiPosition >=
                        LICHIPOSITIONS.ATTACK
                        &&
                        currentView !== "left"
                    ) {

                        loseGame();

                    }

                },
                2500
            );

        }

    }

}


/* =========================
   ЧАСЫ
========================= */

function updateClock() {

    /*
       1 настоящая секунда =
       1 игровая минута.

       12:00 -> 6:00
       = 6 минут реального времени.
    */

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


    let displayHour;


    if (hour === 0) {

        displayHour =
            12;

    }

    else {

        displayHour =
            hour;

    }


    time.textContent =
        displayHour +
        ":" +
        String(minute)
        .padStart(
            2,
            "0"
        ) +
        " AM";

}


/* =========================
   GAME OVER
========================= */

function loseGame() {

    if (gameOver)
        return;


    gameOver =
        true;


    /*
       Останавливаем гул.
    */

    humAudio.pause();


    gameOverScreen.style.display =
        "flex";

}


/* =========================
   ПОБЕДА
========================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished =
        true;


    humAudio.pause();


    winScreen.style.display =
        "flex";

}


/* =========================
   КНОПКИ ПОВОРОТА
========================= */

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


/* =========================
   ВСПЫШКА
========================= */

document
.getElementById("flashButton")
.addEventListener(
    "click",
    function () {

        useFlash();

    }
);


/* =========================
   FULLSCREEN
========================= */

fullscreenButton.addEventListener(
    "click",
    async function () {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document.documentElement
                    .requestFullscreen();

            }

            else {

                await document
                    .exitFullscreen();

            }

        }

        catch (error) {

            console.log(
                error
            );

        }

    }
);


/* =========================
   ПЕРЕЗАПУСК
========================= */

document
.getElementById("restart")
.addEventListener(
    "click",
    function () {

        location.reload();

    }
);


/* =========================
   В МЕНЮ
========================= */

document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function () {

        location.reload();

    }
);


/* =========================
   ИГРОВОЙ ЦИКЛ
========================= */

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


        updateLichi();


    },
    1000
);
