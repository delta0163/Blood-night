/* =================================================
   BLOOD GLOW NIGHT
================================================= */


/* =========================
   ЭЛЕМЕНТЫ
========================= */

const mainMenu =
document.getElementById("mainMenu");

const nightsMenu =
document.getElementById("nightsMenu");

const settingsMenu =
document.getElementById("settingsMenu");

const nightsList =
document.getElementById("nightsList");

const phoneScreen =
document.getElementById("phoneScreen");

const game =
document.getElementById("game");

const view =
document.getElementById("view");

const lichi =
document.getElementById("lichi");

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

const cameraTab =
document.getElementById("cameraTab");

const ventTab =
document.getElementById("ventTab");

const ventButton =
document.getElementById("ventButton");

const cameraImage =
document.getElementById("cameraImage");

const cameraName =
document.getElementById("cameraName");

const cameraLichiIndicator =
document.getElementById(
    "cameraLichiIndicator"
);

const gameOverScreen =
document.getElementById("gameOver");

const winScreen =
document.getElementById("winScreen");

const winText =
document.getElementById("winText");

const nextNightButton =
document.getElementById("nextNight");


/* =========================
   ЗВУКИ
========================= */

const phoneAudio =
document.getElementById(
    "phoneAudio"
);

const humAudio =
document.getElementById(
    "humAudio"
);

const flashAudio =
document.getElementById(
    "flashAudio"
);

const lichiAudio =
document.getElementById(
    "lichiAudio"
);

const lichiScreamer =
document.getElementById(
    "lichiScreamer"
);


/* =========================
   ПРОГРЕСС
========================= */

let completedNight =
Number(
    localStorage.getItem(
        "bloodGlowNightCompleted"
    )
) || 0;


/* =========================
   СОСТОЯНИЕ
========================= */

let selectedNight = 1;

let gameStarted = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";

let currentCamera = "cam01";

let cameraOpen = false;

let flashCooldown = false;


/* =========================
   ЛИЧИ
========================= */

let lichiPosition = 0;


/*
0 — далеко
1 — коридор
2 — возле офиса
3 — у офиса
4 — атака
*/


/* =========================
   ОФИС
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
   КАМЕРЫ
========================= */

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


/*
Личи находится
на этих камерах.
*/

const lichiCameraPositions = {

    1: "cam01",

    2: "cam01",

    3: "cam06"

};


/* =========================
   FULLSCREEN
========================= */

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

    catch(error) {

        console.log(error);

    }

}


/* =========================
   МЕНЮ
========================= */

document
.getElementById(
    "startGameButton"
)
.onclick = function() {

    selectedNight = 1;

    enterFullscreen();

    startSelectedNight();

};


document
.getElementById(
    "nightsButton"
)
.onclick = function() {

    renderNights();

    mainMenu.classList.add(
        "hidden"
    );

    nightsMenu.classList.remove(
        "hidden"
    );

};


document
.getElementById(
    "closeNights"
)
.onclick = function() {

    nightsMenu.classList.add(
        "hidden"
    );

    mainMenu.classList.remove(
        "hidden"
    );

};


/* =========================
   НАСТРОЙКИ
========================= */

document
.getElementById(
    "settingsButton"
)
.onclick = function() {

    mainMenu.classList.add(
        "hidden"
    );

    settingsMenu.classList.remove(
        "hidden"
    );

};


document
.getElementById(
    "closeSettings"
)
.onclick = function() {

    settingsMenu.classList.add(
        "hidden"
    );

    mainMenu.classList.remove(
        "hidden"
    );

};


document
.getElementById(
    "fullscreenButton"
)
.onclick =
enterFullscreen;


/* =========================
   СБРОС
========================= */

document
.getElementById(
    "resetProgress"
)
.onclick = function() {

    localStorage.removeItem(
        "bloodGlowNightCompleted"
    );

    completedNight = 0;

    renderNights();

    alert(
        "Прогресс сброшен."
    );

};


/* =========================
   НОЧИ
========================= */

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


        const unlocked =
        i === 1 ||
        i <= completedNight + 1;


        button.className =
        "nightButton";


        if (!unlocked) {

            button.textContent =
            "🔒 NIGHT " + i;

            button.disabled = true;

        }

        else {

            button.textContent =
            "NIGHT " + i;


            button.onclick =
            function() {

                selectedNight = i;

                startSelectedNight();

            };

        }


        nightsList.appendChild(
            button
        );

    }

}


/* =========================
   НАЧАЛО НОЧИ
========================= */

function startSelectedNight() {

    mainMenu.classList.add(
        "hidden"
    );

    nightsMenu.classList.add(
        "hidden"
    );

    settingsMenu.classList.add(
        "hidden"
    );

    game.classList.add(
        "hidden"
    );

    phoneScreen.classList.remove(
        "hidden"
    );


    gameStarted = false;

    gameOver = false;

    nightFinished = false;

    cameraOpen = false;

    gameMinutes = 0;

    currentView = "front";

    currentCamera = "cam01";

    lichiPosition = 0;


    nightDisplay.textContent =
    "NIGHT " +
    selectedNight;


    time.textContent =
    "12:00 AM";


    view.style.backgroundImage =
    `url("${officeViews.front}")`;


    lichi.style.display =
    "none";


    cameraPanel.classList.add(
        "hidden"
    );

    cameraTab.classList.remove(
        "hidden"
    );

    ventTab.classList.add(
        "hidden"
    );


    gameOverScreen.classList.add(
        "hidden"
    );

    winScreen.classList.add(
        "hidden"
    );


    phoneAudio.currentTime = 0;

    phoneAudio.play()
    .catch(
        () => {}
    );

}


/* =========================
   ПРОПУСК ЗВОНКА
========================= */

document
.getElementById(
    "skipPhoneButton"
)
.onclick = function() {

    phoneAudio.pause();

    startGameAfterPhone();

};


phoneAudio.onended =
startGameAfterPhone;


/* =========================
   ИГРА ПОСЛЕ ЗВОНКА
========================= */

function startGameAfterPhone() {

    if(gameStarted)
    return;


    gameStarted = true;


    phoneScreen.classList.add(
        "hidden"
    );

    game.classList.remove(
        "hidden"
    );


    humAudio.currentTime = 0;

    humAudio.play()
    .catch(
        () => {}
    );


    updateEverything();

}


/* =========================
   ПОВОРОТЫ
========================= */

function changeView(direction) {

    if(!gameStarted)
    return;

    if(gameOver)
    return;

    if(cameraOpen)
    return;


    if(!officeViews[direction])
    return;


    currentView =
    direction;


    view.style.backgroundImage =
    `url("${officeViews[direction]}")`;


    lichi.style.display =
    "none";


    updateOfficeLichi();


    if(direction === "left") {

        status.textContent =
        "ЛЕВЫЙ КОРИДОР";

    }

    else if(direction === "right") {

        status.textContent =
        "ПРАВЫЙ КОРИДОР";

    }

    else {

        status.textContent =
        "ОФИС";

    }

}


document
.getElementById(
    "leftButton"
)
.onclick = () =>
changeView("left");


document
.getElementById(
    "frontButton"
)
.onclick = () =>
changeView("front");


document
.getElementById(
    "rightButton"
)
.onclick = () =>
changeView("right");


/* =========================
   ЛИЧИ В ОФИСЕ
========================= */

function updateOfficeLichi() {

    if(cameraOpen) {

        lichi.style.display =
        "none";

        return;

    }


    if(lichiPosition < 2) {

        lichi.style.display =
        "none";

        return;

    }


    if(currentView !== "left") {

        lichi.style.display =
        "none";

        return;

    }


    lichi.style.display =
    "block";


    lichi.style.position =
    "absolute";


    if(lichiPosition === 2) {

        lichi.style.left =
        "73%";

        lichi.style.top =
        "52%";

        lichi.style.width =
        "130px";

    }

    else {

        lichi.style.left =
        "55%";

        lichi.style.top =
        "50%";

        lichi.style.width =
        "220px";

    }


    lichi.style.transform =
    "translate(-50%, -50%)";

    lichi.style.zIndex = 10;

}


/* =========================
   ОТКРЫТЬ МОНИТОР
========================= */

document
.getElementById(
    "cameraButton"
)
.onclick = function() {

    if(!gameStarted)
    return;

    if(gameOver)
    return;


    cameraOpen = true;


    cameraPanel.classList.remove(
        "hidden"
    );


    cameraTab.classList.remove(
        "hidden"
    );

    ventTab.classList.add(
        "hidden"
    );


    showCamera(
        currentCamera
    );

};


/* =========================
   ЗАКРЫТЬ МОНИТОР
========================= */

document
.getElementById(
    "closeCameraPanel"
)
.onclick = function() {

    cameraOpen = false;


    cameraPanel.classList.add(
        "hidden"
    );


    cameraTab.classList.remove(
        "hidden"
    );

    ventTab.classList.add(
        "hidden"
    );


    view.style.backgroundImage =
    `url("${officeViews[currentView]}")`;


    updateOfficeLichi();


    if(currentView === "left") {

        status.textContent =
        "ЛЕВЫЙ КОРИДОР";

    }

    else if(currentView === "right") {

        status.textContent =
        "ПРАВЫЙ КОРИДОР";

    }

    else {

        status.textContent =
        "ОФИС";

    }

};


/* =========================
   ВЕНТИЛЯЦИЯ
========================= */

ventButton.onclick =
function() {

    cameraTab.classList.add(
        "hidden"
    );

    ventTab.classList.remove(
        "hidden"
    );

};


/* =========================
   КАМЕРЫ
========================= */

document
.querySelectorAll(
    ".cameraButton"
)
.forEach(
function(button) {

    button.onclick =
    function() {

        showCamera(
            button.dataset.camera
        );

    };

});


/* =========================
   ПОКАЗ КАМЕРЫ
========================= */

function showCamera(camera) {

    if(!cameraImages[camera])
    return;


    currentCamera =
    camera;


    cameraImage.style.backgroundImage =
    `url("${cameraImages[camera]}")`;


    cameraImage.style.backgroundSize =
    "cover";


    cameraImage.style.backgroundPosition =
    "center";


    cameraName.textContent =
    camera.toUpperCase();


    document
    .querySelectorAll(
        ".cameraButton"
    )
    .forEach(
    function(button) {

        button.classList.remove(
            "active"
        );


        if(
            button.dataset.camera ===
            camera
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    updateCameraLichi();

}


/* =========================
   ЛИЧИ НА КАМЕРЕ
========================= */

function updateCameraLichi() {

    lichi.style.display =
    "none";


    const lichiCamera =
    lichiCameraPositions[
        lichiPosition
    ];


    if(
        lichiCamera ===
        currentCamera
    ) {

        /*
        Используем спрайт Личи
        поверх камеры.
        */

        lichi.style.display =
        "block";

        lichi.style.position =
        "fixed";

        lichi.style.left =
        "50%";

        lichi.style.top =
        "50%";

        lichi.style.width =
        "150px";

        lichi.style.transform =
        "translate(-50%, -50%)";

        lichi.style.zIndex =
        "600";


        cameraLichiIndicator.innerHTML =
        "ЛИЧИ: <span>ОБНАРУЖЕНА</span>";


        status.textContent =
        "⚠ ЛИЧИ ОБНАРУЖЕНА";

    }

    else {

        cameraLichiIndicator.innerHTML =
        "ЛИЧИ: <span>НЕ ОБНАРУЖЕНА</span>";

    }

}


/* =========================
   ВСПЫШКА
========================= */

document
.getElementById(
    "flashButton"
)
.onclick =
useFlash;


function useFlash() {

    if(!gameStarted)
    return;

    if(gameOver)
    return;

    if(cameraOpen)
    return;

    if(flashCooldown)
    return;


    if(currentView !== "left") {

        status.textContent =
        "ВСПЫШКА РАБОТАЕТ В ЛЕВОМ КОРИДОРЕ";

        return;

    }


    if(lichiPosition < 2) {

        status.textContent =
        "ЛИЧИ ЕЩЁ ДАЛЕКО";

        return;

    }


    flashCooldown = true;


    flash.style.opacity = "1";


    setTimeout(
    function() {

        flash.style.opacity =
        "0";

    },
    120
    );


    flashAudio.currentTime = 0;

    flashAudio.play()
    .catch(
        () => {}
    );


    lichiPosition = 0;


    lichi.style.display =
    "none";


    lichiAudio.currentTime = 0;

    lichiAudio.play()
    .catch(
        () => {}
    );


    status.textContent =
    "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА";


    setTimeout(
    function() {

        flashCooldown =
        false;

    },
    1200
    );

}


/* =========================
   ЧАСЫ
========================= */

function updateClock() {

    if(gameMinutes >= 360) {

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
    .padStart(2,"0") +
    " AM";

}


/* =========================
   ЛИЧИ ДВИЖЕТСЯ
========================= */

function moveLichi() {

    if(!gameStarted)
    return;

    if(gameOver)
    return;

    if(nightFinished)
    return;


    /*
    Личи начинает движение
    после 1:00.
    */

    if(gameMinutes < 60)
    return;


    /*
    Каждые 20 секунд.
    */

    if(
        gameMinutes % 20 === 0
    ) {

        if(
            lichiPosition < 4
        ) {

            lichiPosition++;

        }

    }


    updateEverything();


    if(
        lichiPosition >= 4
    ) {

        setTimeout(
        function() {

            if(
                lichiPosition >= 4 &&
                !gameOver
            ) {

                loseGame();

            }

        },
        1500
        );

    }

}


/* =========================
   ОБНОВЛЕНИЕ
========================= */

function updateEverything() {

    updateClock();


    if(cameraOpen) {

        /*
        На камере показываем
        Личи только если она
        находится здесь.
        */

        updateCameraLichi();

    }

    else {

        updateOfficeLichi();

    }

}


/* =========================
   GAME OVER
========================= */

function loseGame() {

    if(gameOver)
    return;


    gameOver = true;


    humAudio.pause();


    /*
    Скример.
    */

    lichiScreamer.currentTime =
    0;

    lichiScreamer.play()
    .catch(
        () => {}
    );


    /*
    Личи на весь экран.
    */

    lichi.style.display =
    "block";

    lichi.style.position =
    "fixed";

    lichi.style.left =
    "50%";

    lichi.style.top =
    "50%";

    lichi.style.width =
    "100vw";

    lichi.style.maxWidth =
    "100vw";

    lichi.style.transform =
    "translate(-50%, -50%)";

    lichi.style.zIndex =
    "9999";


    setTimeout(
    function() {

        gameOverScreen.classList.remove(
            "hidden"
        );

    },
    1800
    );

}


/* =========================
   RESTART
========================= */

document
.getElementById(
    "restart"
)
.onclick = function() {

    startSelectedNight();

};


/* =========================
   МЕНЮ ПОСЛЕ ПОРАЖЕНИЯ
========================= */

document
.getElementById(
    "menuAfterLose"
)
.onclick = function() {

    gameOverScreen.classList.add(
        "hidden"
    );

    game.classList.add(
        "hidden"
    );

    mainMenu.classList.remove(
        "hidden"
    );

};


/* =========================
   ПОБЕДА
========================= */

function winGame() {

    if(nightFinished)
    return;


    nightFinished = true;


    humAudio.pause();


    if(
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


    if(
        selectedNight >= 13
    ) {

        nextNightButton.style.display =
        "none";

    }

    else {

        nextNightButton.style.display =
        "block";

    }


    winScreen.classList.remove(
        "hidden"
    );

}


/* =========================
   СЛЕДУЮЩАЯ НОЧЬ
========================= */

nextNightButton.onclick =
function() {

    if(
        selectedNight < 13
    ) {

        selectedNight++;

        startSelectedNight();

    }

};


/* =========================
   МЕНЮ ПОСЛЕ ПОБЕДЫ
========================= */

document
.getElementById(
    "menuAfterWin"
)
.onclick = function() {

    winScreen.classList.add(
        "hidden"
    );

    game.classList.add(
        "hidden"
    );

    mainMenu.classList.remove(
        "hidden"
    );

    renderNights();

};


/* =========================
   ИГРОВОЙ ЦИКЛ
========================= */

setInterval(
function() {

    if(!gameStarted)
    return;

    if(gameOver)
    return;

    if(nightFinished)
    return;


    gameMinutes++;


    moveLichi();

},
1000
);


/* =========================
   ЗАПУСК
========================= */

renderNights();
