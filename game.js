/* =========================================
   BLOOD GLOW NIGHT
   NIGHT 1
========================================= */


/* =========================================
   ГЛАВНОЕ МЕНЮ
========================================= */

const mainMenu =
document.getElementById(
    "mainMenu"
);


const game =
document.getElementById(
    "game"
);


const startGameButton =
document.getElementById(
    "startGameButton"
);


const phoneScreen =
document.getElementById(
    "phoneScreen"
);


const answerPhone =
document.getElementById(
    "answerPhone"
);


/* =========================================
   АУДИО
========================================= */

const phoneAudio =
document.getElementById(
    "phoneAudio"
);


const flashAudio =
document.getElementById(
    "flashAudio"
);


const lichiAudio =
document.getElementById(
    "lichiAudio"
);


const humAudio =
document.getElementById(
    "humAudio"
);


/*
    Громкость постоянного гула.
    Можно изменить:

    0.10 = тихо
    0.25 = средне
    0.40 = громко
*/

humAudio.volume = 0.25;


/* =========================================
   СОСТОЯНИЕ ИГРЫ
========================================= */

let gameStarted = false;

let currentView = "front";

let lichiPosition = 0;

let flashCooldown = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;


/* =========================================
   ПОЗИЦИИ ЛИЧИ
========================================= */

const LICHIPOSITIONS = {

    FAR: 0,

    MIDDLE: 1,

    NEAR: 2,

    DOOR: 3,

    ATTACK: 4

};


/* =========================================
   ЭЛЕМЕНТЫ
========================================= */

const view =
document.getElementById(
    "view"
);


const lichi =
document.getElementById(
    "lichi"
);


const status =
document.getElementById(
    "status"
);


const time =
document.getElementById(
    "time"
);


const flash =
document.getElementById(
    "flash"
);


const gameOverScreen =
document.getElementById(
    "gameOver"
);


const winScreen =
document.getElementById(
    "winScreen"
);


const fullscreenButton =
document.getElementById(
    "fullscreenButton"
);


/* =========================================
   ОФИС
========================================= */

const officeViews = {

    front:
    "images/office_front.png",

    left:
    "images/office_left.png",

    right:
    "images/office_right.png"

};


/* =========================================
   НАЧАТЬ ИГРУ
========================================= */

startGameButton.addEventListener(
    "click",
    function() {

        mainMenu.style.display =
            "none";

        phoneScreen.style.display =
            "flex";

    }
);


/* =========================================
   ОТВЕТИТЬ НА ТЕЛЕФОН
========================================= */

answerPhone.addEventListener(
    "click",
    function() {

        answerPhone.disabled =
            true;


        phoneAudio.currentTime =
            0;


        phoneAudio.play()
        .then(
            function() {

                /*
                   Телефонный разговор
                   начался.
                */

            }
        )
        .catch(
            function() {

                /*
                   Если браузер
                   не смог воспроизвести
                   аудио — всё равно
                   начинаем ночь.
                */

                startNight();

            }
        );


        /*
           После окончания
           phone.mp3 начинается ночь.
        */

        phoneAudio.onended =
        function() {

            startNight();

        };

    }
);


/* =========================================
   НАЧАЛО НОЧИ
========================================= */

function startNight() {

    if (gameStarted)
        return;


    gameStarted = true;


    /*
       ЗАПУСК ПОСТОЯННОГО ГУЛА
    */

    humAudio.currentTime =
        0;


    humAudio.play()
    .catch(
        function() {

            /*
               Некоторые браузеры
               могут заблокировать звук.
               После нажатия игрока
               обычно разрешают его.
            */

        }
    );


    phoneScreen.style.display =
        "none";


    game.style.display =
        "block";


    gameMinutes = 0;


    lichiPosition =
        LICHIPOSITIONS.FAR;


    currentView =
        "front";


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    time.textContent =
        "12:00 AM";


    status.textContent =
        "Офис. Ночь начинается.";


    updateLichiSprite();

}


/* =========================================
   ПОВОРОТ
========================================= */

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


/* =========================================
   СТАТУС
========================================= */

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
                "Личи стоит в конце коридора.";

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


/* =========================================
   ЛИЧИ
========================================= */

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


/* =========================================
   ВСПЫШКА
========================================= */

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
       только в левом коридоре.
    */

    if (currentView !== "left") {

        status.textContent =
            "Сначала посмотри в левый коридор.";

        return;

    }


    /*
       Если Личи далеко,
       вспышка её не отбрасывает.
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


    /* =================================
       ВСПЫШКА ЭКРАНА
    ================================= */

    flash.style.opacity =
        "1";


    setTimeout(
        function() {

            flash.style.opacity =
                "0";

        },
        120
    );


    /* =================================
       ЗВУК ВСПЫШКИ
    ================================= */

    flashAudio.currentTime =
        0;


    flashAudio.play()
    .catch(
        function() {}
    );


    /* =================================
       КРИК ЛИЧИ
    ================================= */

    setTimeout(
        function() {

            lichiAudio.currentTime =
                0;


            lichiAudio.play()
            .catch(
                function() {}
            );

        },
        80
    );


    /* =================================
       ОТБРАСЫВАЕМ ЛИЧИ
    ================================= */

    lichiPosition =
        LICHIPOSITIONS.FAR;


    status.textContent =
        "ВСПЫШКА! Личи отступила!";


    updateLichiSprite();


    /* =================================
       ПЕРЕЗАРЯДКА
    ================================= */

    setTimeout(
        function() {

            flashCooldown =
                false;

        },
        1500
    );

}


/* =========================================
   ДВИЖЕНИЕ ЛИЧИ
========================================= */

function updateLichi() {

    if (!gameStarted)
        return;


    if (gameOver)
        return;


    if (nightFinished)
        return;


    /*
       Личи начинает движение
       с 1:00 AM.
    */

    if (gameMinutes < 60)
        return;


    /*
       Каждые 20 игровых минут
       Личи делает шаг.
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
       Личи достигла офиса.
    */

    if (
        lichiPosition >=
        LICHIPOSITIONS.ATTACK
    ) {


        if (
            currentView !== "left"
        ) {

            status.textContent =
                "ЛИЧИ ВОШЛА В ОФИС!";


            setTimeout(
                function() {

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


/* =========================================
   ЧАСЫ
========================================= */

function updateClock() {

    /*
       360 минут =
       6 часов.
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


/* =========================================
   GAME OVER
========================================= */

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


/* =========================================
   ПОБЕДА
========================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished =
        true;


    /*
       Останавливаем гул
       после окончания ночи.
    */

    humAudio.pause();


    winScreen.style.display =
        "flex";

}


/* =========================================
   ПОВОРОТ ВЛЕВО
========================================= */

document
.getElementById("leftButton")
.addEventListener(
    "click",
    function() {

        changeView("left");

    }
);


/* =========================================
   ПОВОРОТ ВПЕРЁД
========================================= */

document
.getElementById("frontButton")
.addEventListener(
    "click",
    function() {

        changeView("front");

    }
);


/* =========================================
   ПОВОРОТ ВПРАВО
========================================= */

document
.getElementById("rightButton")
.addEventListener(
    "click",
    function() {

        changeView("right");

    }
);


/* =========================================
   ВСПЫШКА
========================================= */

document
.getElementById("flashButton")
.addEventListener(
    "click",
    function() {

        useFlash();

    }
);


/* =========================================
   FULLSCREEN
========================================= */

fullscreenButton.addEventListener(
    "click",
    function() {

        if (
            !document.fullscreenElement
        ) {

            document.documentElement
            .requestFullscreen()
            .catch(
                function() {}
            );

        }

        else {

            document.exitFullscreen();

        }

    }
);


/* =========================================
   ПЕРЕЗАПУСК
========================================= */

document
.getElementById("restart")
.addEventListener(
    "click",
    function() {

        location.reload();

    }
);


/* =========================================
   В МЕНЮ
========================================= */

document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function() {

        location.reload();

    }
);


/* =========================================
   ИГРОВОЙ ЦИКЛ
========================================= */

/*
   Сейчас 1 секунда = 1 игровая минута.
   Поэтому демо-ночь длится 6 минут.
*/

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


        updateLichi();


    },
    1000
);
