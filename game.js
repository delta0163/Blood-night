/* =========================================
   BLOOD GLOW NIGHT
   NIGHT 1 DEMO
   ЛИЧИ
========================================= */


/* =========================================
   СОСТОЯНИЕ ИГРЫ
========================================= */

let currentView = "front";

let lichiPosition = 0;

let flashCooldown = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;


/*
   Личи:

   0 — стоит далеко в коридоре
   1 — начинает приближаться
   2 — середина коридора
   3 — возле офиса
   4 — входит в офис
*/


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
    document.getElementById(
        "fullscreenButton"
    );


/* =========================================
   КАРТИНКИ ОФИСА
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
   ПОВОРОТ
========================================= */

function changeView(direction) {

    if (gameOver)
        return;

    if (nightFinished)
        return;


    currentView = direction;


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
   СПРАЙТ ЛИЧИ
========================================= */

function updateLichiSprite() {

    /*
       Показываем Личи
       только когда игрок смотрит
       в левый коридор.
    */

    if (currentView !== "left") {

        lichi.style.display =
            "none";

        return;
    }


    /*
       Если она ещё слишком далеко,
       спрайт пока не показываем.
    */

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


    /*
       Позиции спрайта.
    */

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

    if (flashCooldown)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Вспышка работает только
       когда игрок смотрит влево.
    */

    if (currentView !== "left") {

        status.textContent =
            "Сначала посмотри в левый коридор.";

        return;
    }


    /*
       Личи должна быть достаточно близко.
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
       ВСПЫШКА
    ================================= */

    flash.style.opacity = "1";


    setTimeout(
        function() {

            flash.style.opacity = "0";

        },
        120
    );


    /*
       ОТБРАСЫВАЕМ ЛИЧИ НАЗАД
    */

    lichiPosition =
        LICHIPOSITIONS.FAR;


    status.textContent =
        "ВСПЫШКА! Личи отступила!";


    updateLichiSprite();


    /*
       Перезарядка
    */

    setTimeout(
        function() {

            flashCooldown = false;

        },
        1500
    );
}


/* =========================================
   ДВИЖЕНИЕ ЛИЧИ
========================================= */

function updateLichi() {

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Личи начинает двигаться
       после 1:00.
    */

    if (gameMinutes < 60)
        return;


    /*
       Каждые 20 игровых минут
       она делает шаг.

       Для демки:
       1 игровая секунда = 1 игровая минута.
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

        /*
           Если игрок смотрит влево,
           можно успеть её ослепить.
        */

        if (currentView !== "left") {

            status.textContent =
                "ЛИЧИ ВОШЛА В ОФИС!";


            setTimeout(
                function() {

                    if (
                        lichiPosition >=
                        LICHIPOSITIONS.ATTACK &&
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
       360 минут = 6:00 AM
    */

    if (gameMinutes >= 360) {

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

        displayHour = 12;

    } else {

        displayHour = hour;

    }


    time.textContent =
        displayHour +
        ":" +
        String(minute).padStart(
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


    gameOver = true;


    gameOverScreen.style.display =
        "flex";
}


/* =========================================
   ПОБЕДА
========================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished = true;


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
   ПОЛНЫЙ ЭКРАН
========================================= */

fullscreenButton.addEventListener(
    "click",
    function() {

        if (!document.fullscreenElement) {

            document.documentElement
                .requestFullscreen()
                .catch(
                    function(error) {

                        console.log(
                            "Fullscreen error:",
                            error
                        );

                    }
                );

        } else {

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
   ИГРОВОЙ ЦИКЛ
========================================= */

setInterval(
    function() {

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


/* =========================================
   ЗАПУСК
========================================= */

updateClock();

updateStatus();

updateLichiSprite();
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
    document.getElementById(
        "fullscreenButton"
    );


/* =========================================
   КАРТИНКИ ОФИСА
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
   ПОВОРОТ
========================================= */

function changeView(direction) {

    if (gameOver)
        return;

    if (nightFinished)
        return;


    currentView = direction;


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
   СПРАЙТ ЛИЧИ
========================================= */

function updateLichiSprite() {

    /*
       Показываем Личи
       только когда игрок смотрит
       в левый коридор.
    */

    if (currentView !== "left") {

        lichi.style.display =
            "none";

        return;
    }


    /*
       Если она ещё слишком далеко,
       спрайт пока не показываем.
    */

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


    /*
       Позиции спрайта.
    */

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

    if (flashCooldown)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Вспышка работает только
       когда игрок смотрит влево.
    */

    if (currentView !== "left") {

        status.textContent =
            "Сначала посмотри в левый коридор.";

        return;
    }


    /*
       Личи должна быть достаточно близко.
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
       ВСПЫШКА
    ================================= */

    flash.style.opacity = "1";


    setTimeout(
        function() {

            flash.style.opacity = "0";

        },
        120
    );


    /*
       ОТБРАСЫВАЕМ ЛИЧИ НАЗАД
    */

    lichiPosition =
        LICHIPOSITIONS.FAR;


    status.textContent =
        "ВСПЫШКА! Личи отступила!";


    updateLichiSprite();


    /*
       Перезарядка
    */

    setTimeout(
        function() {

            flashCooldown = false;

        },
        1500
    );
}


/* =========================================
   ДВИЖЕНИЕ ЛИЧИ
========================================= */

function updateLichi() {

    if (gameOver)
        return;

    if (nightFinished)
        return;


    /*
       Личи начинает двигаться
       после 1:00.
    */

    if (gameMinutes < 60)
        return;


    /*
       Каждые 20 игровых минут
       она делает шаг.

       Для демки:
       1 игровая секунда = 1 игровая минута.
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

        /*
           Если игрок смотрит влево,
           можно успеть её ослепить.
        */

        if (currentView !== "left") {

            status.textContent =
                "ЛИЧИ ВОШЛА В ОФИС!";


            setTimeout(
                function() {

                    if (
                        lichiPosition >=
                        LICHIPOSITIONS.ATTACK &&
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
       360 минут = 6:00 AM
    */

    if (gameMinutes >= 360) {

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

        displayHour = 12;

    } else {

        displayHour = hour;

    }


    time.textContent =
        displayHour +
        ":" +
        String(minute).padStart(
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


    gameOver = true;


    gameOverScreen.style.display =
        "flex";
}


/* =========================================
   ПОБЕДА
========================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished = true;


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
   ПОЛНЫЙ ЭКРАН
========================================= */

fullscreenButton.addEventListener(
    "click",
    function() {

        if (!document.fullscreenElement) {

            document.documentElement
                .requestFullscreen()
                .catch(
                    function(error) {

                        console.log(
                            "Fullscreen error:",
                            error
                        );

                    }
                );

        } else {

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
   ИГРОВОЙ ЦИКЛ
========================================= */

setInterval(
    function() {

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


/* =========================================
   ЗАПУСК
========================================= */

updateClock();

updateStatus();

updateLichiSprite();
