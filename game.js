/* =========================================
   BLOOD GLOW NIGHT
   NIGHT 1 DEMO
   ЛИЧИ
========================================= */


/* =========================================
   СОСТОЯНИЕ
========================================= */

let currentView = "front";

let lichiPosition = 0;

let flashCooldown = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;


/*
   Позиции Личи:

   0 — конец коридора
   1 — середина коридора
   2 — возле входа
   3 — частично вошла в офис
   4 — почти в офисе
*/


const LICHIPOSITIONS = {

    FAR: 0,

    MIDDLE: 1,

    DOOR: 2,

    ENTERING: 3,

    ATTACK: 4

};


/* =========================================
   ЭЛЕМЕНТЫ
========================================= */

const view =
    document.getElementById("view");

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


/* =========================================
   КАРТИНКИ
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
                "ЛИЧИ УЖЕ В ОФИСЕ! ВСПЫШКА!";

        }

        else if (
            lichiPosition >=
            LICHIPOSITIONS.ENTERING
        ) {

            status.textContent =
                "Личи входит в офис.";

        }

        else if (
            lichiPosition >=
            LICHIPOSITIONS.DOOR
        ) {

            status.textContent =
                "Личи возле двери.";

        }

        else if (
            lichiPosition >=
            LICHIPOSITIONS.MIDDLE
        ) {

            status.textContent =
                "Личи приближается.";

        }

        else {

            status.textContent =
                "Личи в конце коридора.";
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
       Вспышка работает,
       только если игрок смотрит
       в левый коридор.
    */

    if (currentView !== "left") {

        status.textContent =
            "Здесь вспышка не нужна.";

        return;
    }


    /*
       Личи должна быть
       достаточно близко.
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


    /* Белая вспышка */

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
        "ВСПЫШКА! Личи отступила.";


    updateStatus();


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
       примерно с 1:00.
    */

    if (gameMinutes < 60)
        return;


    /*
       Каждые 20 игровых секунд
       Личи продвигается.
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


    /*
       Личи полностью вошла
       в офис.
    */

    if (
        lichiPosition >=
        LICHIPOSITIONS.ATTACK
    ) {

        /*
           Если игрок смотрит
           влево — даём небольшой
           шанс успеть использовать
           вспышку.

           Сама атака происходит
           через несколько секунд.
        */

        if (currentView !== "left") {

            status.textContent =
                "Личи вошла в офис!";


            setTimeout(
                function() {

                    if (
                        lichiPosition >=
                        LICHIPOSITIONS.ATTACK
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

    }

    else {

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
   ПОРАЖЕНИЕ
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
   КНОПКА ВЛЕВО
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
   КНОПКА ВПЕРЁД
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
   КНОПКА ВПРАВО
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
