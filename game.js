/* =========================================
   BLOOD GLOW NIGHT
   NIGHT 1
   ЛИЧИ
========================================= */


/* =========================================
   СОСТОЯНИЕ ИГРЫ
========================================= */

let currentView = "front";

let cameraOpen = false;

let currentCamera = 1;

let lichiPosition = 0;

let flashCooldown = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;


/*
    Для тестирования:

    1 секунда = 1 игровая минута.

    Позже изменим скорость.
*/


/* =========================================
   ЭЛЕМЕНТЫ
========================================= */

const view =
    document.getElementById("view");

const status =
    document.getElementById("status");

const time =
    document.getElementById("time");

const cameraScreen =
    document.getElementById("cameraScreen");

const cameraImage =
    document.getElementById("cameraImage");

const cameraTitle =
    document.getElementById("cameraTitle");

const flash =
    document.getElementById("flash");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");


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
   КАРТИНКИ КАМЕР
========================================= */

const cameraImages = {

    1:
        "images/camera_1.png",

    2:
        "images/camera_2.png",

    3:
        "images/camera_3.png",

    4:
        "images/camera_4.png",

    5:
        "images/camera_5.png",

    6:
        "images/camera_6.png",

    7:
        "images/camera_7.png"

};


/* =========================================
   ПОВОРОТ
========================================= */

function changeView(direction) {

    if (cameraOpen)
        return;

    if (gameOver)
        return;

    if (nightFinished)
        return;


    currentView = direction;


    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;


    updateViewStatus();
}


/* =========================================
   СТАТУС
========================================= */

function updateViewStatus() {

    if (currentView === "left") {

        if (lichiPosition >= 2) {

            status.textContent =
                "Личи находится в левом коридоре.";

        } else {

            status.textContent =
                "Левый коридор пуст.";
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
   КАМЕРЫ
========================================= */

function openCameras() {

    if (gameOver)
        return;

    if (nightFinished)
        return;


    cameraOpen = true;

    cameraScreen.style.display =
        "block";


    updateCamera();
}


function closeCameras() {

    cameraOpen = false;

    cameraScreen.style.display =
        "none";
}


function updateCamera() {

    cameraImage.src =
        cameraImages[currentCamera];


    if (
        currentCamera === 2 &&
        lichiPosition >= 1
    ) {

        cameraTitle.textContent =
            "CAM 2 — ЛИЧИ";

    } else {

        cameraTitle.textContent =
            "CAM " +
            currentCamera;
    }
}


/* =========================================
   ВСПЫШКА
========================================= */

function useFlash() {

    if (flashCooldown)
        return;

    if (cameraOpen)
        return;

    if (gameOver)
        return;


    /*
       В этой версии вспышка
       работает только при
       взгляде влево.
    */

    if (
        currentView !== "left" ||
        lichiPosition < 2
    ) {

        status.textContent =
            "Вспышка ничего не обнаружила.";

        return;
    }


    flashCooldown = true;


    /* Эффект */

    flash.style.opacity = "1";


    setTimeout(function() {

        flash.style.opacity = "0";

    }, 100);


    /*
       Отбрасываем Личи.
    */

    lichiPosition = 0;


    status.textContent =
        "Личи отпугнута вспышкой.";


    updateViewStatus();


    /*
       Перезарядка вспышки.
    */

    setTimeout(function() {

        flashCooldown = false;

    }, 1500);
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
       Личи активируется
       после 1:00.
    */

    if (gameMinutes < 60)
        return;


    /*
       Каждые 30 секунд
       она двигается дальше.
    */

    if (gameMinutes % 30 === 0) {

        if (lichiPosition < 4) {

            lichiPosition++;
        }
    }


    updateLichiStatus();


    /*
       Дошла до офиса.
    */

    if (lichiPosition >= 4) {

        loseGame();
    }
}


/* =========================================
   СТАТУС ЛИЧИ
========================================= */

function updateLichiStatus() {

    if (lichiPosition === 0) {

        status.textContent =
            "Личи ещё далеко.";

    }


    else if (lichiPosition === 1) {

        status.textContent =
            "Личи начала движение.";

    }


    else if (lichiPosition === 2) {

        status.textContent =
            "Личи в левом коридоре.";

    }


    else if (lichiPosition === 3) {

        status.textContent =
            "Личи возле офиса.";
    }
}


/* =========================================
   ИГРОВЫЕ ЧАСЫ
========================================= */

function updateClock() {

    if (gameMinutes >= 360) {

        winGame();

        return;
    }


    const hour =
        Math.floor(gameMinutes / 60);


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
        String(minute).padStart(2, "0") +
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
   КНОПКИ ПОВОРОТА
========================================= */

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


/* =========================================
   КАМЕРЫ
========================================= */

document
    .getElementById("cameraButton")
    .addEventListener(
        "click",
        function() {

            openCameras();

        }
    );


document
    .getElementById("closeCamera")
    .addEventListener(
        "click",
        function() {

            closeCameras();

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
   КАМЕРЫ — КНОПКИ
========================================= */

document
    .querySelectorAll(".camButton")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const camera =
                    button.dataset.camera;


                if (!camera)
                    return;


                currentCamera =
                    Number(camera);


                updateCamera();

            }
        );

    });


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

updateLichiStatus();
