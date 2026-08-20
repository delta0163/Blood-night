/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 1 + NIGHT 2
================================================= */


/* =================================================
   ЭЛЕМЕНТЫ
================================================= */

const mainMenu = document.getElementById("mainMenu");
const nightsMenu = document.getElementById("nightsMenu");
const settingsMenu = document.getElementById("settingsMenu");
const nightsList = document.getElementById("nightsList");

const game = document.getElementById("game");
const phoneScreen = document.getElementById("phoneScreen");

const phoneAudio = document.getElementById("phoneAudio");
const humAudio = document.getElementById("humAudio");
const flashAudio = document.getElementById("flashAudio");
const lichiAudio = document.getElementById("lichiAudio");
const pancakeAudio = document.getElementById("pancakeAudio");
const screamAudio = document.getElementById("screamAudio");
const ventAudio = document.getElementById("ventAudio");

const view = document.getElementById("view");

const lichi = document.getElementById("lichi");
const pancake = document.getElementById("pancake");

const flash = document.getElementById("flash");

const status = document.getElementById("status");
const time = document.getElementById("time");
const nightDisplay = document.getElementById("night");

const cameraPanel = document.getElementById("cameraPanel");
const cameraImage = document.getElementById("cameraImage");
const cameraNumber = document.getElementById("cameraNumber");

const cameraLichi = document.getElementById("cameraLichi");
const cameraPancake = document.getElementById("cameraPancake");

const ventPanel = document.getElementById("ventPanel");
const ventStatus = document.getElementById("ventStatus");
const pancakeVent = document.getElementById("pancakeVent");

const gameOverScreen = document.getElementById("gameOver");
const winScreen = document.getElementById("winScreen");

const winText = document.getElementById("winText");
const nextNightButton = document.getElementById("nextNight");


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

let gameTimer = null;


/* =================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
================================================= */

/*
   NIGHT 1 = 5 реальных минут
   NIGHT 2 = 6 реальных минут
   NIGHT 3 = 7 реальных минут
   и т.д.

   Вся ночь = 360 игровых минут.
*/

function getNightDuration() {

    return 4 + selectedNight;

}


/*
   Сколько миллисекунд
   занимает 1 игровая минута.
*/

function getGameMinuteTime() {

    return (
        getNightDuration() * 60 * 1000
    ) / 360;

}


/* =================================================
   ПЕРСОНАЖИ
================================================= */

let lichiPosition = 0;
let pancakePosition = 0;


/*
   Личи:

   0 = далеко
   1 = подходит
   2 = левый коридор
   3 = у офиса
   4 = атака
*/


/*
   Панкейк:

   0 = отсутствует
   1 = вентиляция
   2 = близко
   3 = офис
*/


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

let ventDoors = {
    1: false,
    2: false,
    3: false
};


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
   ПОЗИЦИИ ЛИЧИ НА КАМЕРАХ
================================================= */

const lichiCameraPositions = {

    1: "cam01",
    2: "cam02",
    3: "cam06"

};


/* =================================================
   ПОЗИЦИИ ПАНКЕЙКА
================================================= */

const pancakeCameraPositions = {

    1: "cam04",
    2: "cam05",
    3: "cam07"

};


/* =================================================
   ОФИС
================================================= */

const officeViews = {

    front: "images/office_front.png",

    left: "images/office_left.png",

    right: "images/office_right.png"

};


/* =================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
================================================= */

function show(element) {

    element.classList.remove("hidden");

}


function hide(element) {

    element.classList.add("hidden");

}


/*
   Останавливаем звук без ошибок.
*/

function stopAudio(audio) {

    try {

        audio.pause();

        audio.currentTime = 0;

    } catch (e) {}

}


/* =================================================
   МЕНЮ
================================================= */

document
.getElementById("startGameButton")
.addEventListener("click", function () {

    selectedNight = 1;

    enterFullscreen();

    startSelectedNight();

});


document
.getElementById("nightsButton")
.addEventListener("click", function () {

    renderNights();

    hide(mainMenu);

    show(nightsMenu);

});


document
.getElementById("closeNights")
.addEventListener("click", function () {

    hide(nightsMenu);

    show(mainMenu);

});


/* =================================================
   СПИСОК НОЧЕЙ
================================================= */

function renderNights() {

    nightsList.innerHTML = "";

    for (let i = 1; i <= 13; i++) {

        const button =
            document.createElement("button");

        button.className =
            "nightButton";

        const unlocked =
            i === 1 ||
            i <= completedNight + 1;

        if (!unlocked) {

            button.classList.add("locked");

            button.textContent =
                "🔒 NIGHT " + i;

            button.disabled = true;

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

        nightsList.appendChild(button);

    }

}


/* =================================================
   НАСТРОЙКИ
================================================= */

document
.getElementById("settingsButton")
.addEventListener("click", function () {

    hide(mainMenu);

    show(settingsMenu);

});


document
.getElementById("closeSettings")
.addEventListener("click", function () {

    hide(settingsMenu);

    show(mainMenu);

});


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
.addEventListener("click", function () {

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

});


/* =================================================
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    stopGameTimer();

    /*
       СНАЧАЛА закрываем все старые экраны.
       Это исправляет чёрный экран.
    */

    hide(mainMenu);
    hide(nightsMenu);
    hide(settingsMenu);
    hide(game);

    hide(cameraPanel);
    hide(ventPanel);

    hide(gameOverScreen);
    hide(winScreen);

    /*
       Показываем телефон.
    */

    show(phoneScreen);

    gameStarted = false;
    gameOver = false;
    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";
    currentCamera = "cam01";

    lichiPosition = 0;
    pancakePosition = 0;

    flashCooldown = false;

    ventDoors = {
        1: false,
        2: false,
        3: false
    };

    nightDisplay.textContent =
        "NIGHT " + selectedNight;

    document
        .getElementById("phoneNight")
        .textContent =
        "NIGHT " + selectedNight;

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

    pancakeVent.style.display =
        "none";

    updateVentilation();

    stopAudio(humAudio);
    stopAudio(ventAudio);

    /*
       Телефонный звонок.
    */

    try {

        phoneAudio.currentTime = 0;

        const playPromise =
            phoneAudio.play();

        if (
            playPromise &&
            playPromise.catch
        ) {

            playPromise.catch(
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
.addEventListener("click", function () {

    stopAudio(phoneAudio);

    startNightAfterPhone();

});


/* =================================================
   ЗВОНОК ЗАКОНЧИЛСЯ
================================================= */

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

    hide(phoneScreen);

    show(game);

    /*
       Фон и офис гарантированно устанавливаются.
    */

    view.style.backgroundImage =
        `url("${officeViews.front}")`;

    status.textContent =
        "ОФИС";

    try {

        humAudio.currentTime = 0;

        const promise =
            humAudio.play();

        if (
            promise &&
            promise.catch
        ) {

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

    if (gameTimer !== null) {

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

    if (gameMinutes >= 360) {

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
       ЛИЧИ

       На второй ночи она движется
       быстрее.
    */

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;

    if (
        gameMinutes >= 45 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (lichiPosition < 4) {

            lichiPosition++;

            /*
               Звук движения Личи.
            */

            try {

                lichiAudio.currentTime = 0;

                lichiAudio.play()
                    .catch(() => {});

            } catch (e) {}

        }

    }


    /*
       ПАНКЕЙК ТОЛЬКО СО ВТОРОЙ НОЧИ.
    */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const pancakeSpeed =
            selectedNight === 2
                ? 60
                : 50;

        if (
            gameMinutes %
            pancakeSpeed === 0
        ) {

            if (
                pancakePosition < 3
            ) {

                pancakePosition++;

                try {

                    pancakeAudio.currentTime = 0;

                    pancakeAudio.play()
                        .catch(() => {});

                } catch (e) {}

            }

        }

    }


    /*
       ЛИЧИ АТАКУЕТ.
    */

    if (
        lichiPosition >= 4
    ) {

        if (
            currentView === "left"
        ) {

            status.textContent =
                "ЛИЧИ У ОФИСА! ВСПЫШКА!";

        } else {

            status.textContent =
                "ОПАСНОСТЬ СЛЕВА";

        }

        /*
           Даём немного времени
           использовать вспышку.
        */

        if (
            !window.lichiAttackTimer
        ) {

            window.lichiAttackTimer =
                setTimeout(
                    function () {

                        window.lichiAttackTimer =
                            null;

                        if (
                            lichiPosition >= 4 &&
                            !gameOver
                        ) {

                            loseGame();

                        }

                    },
                    10000
                );

        }

    }


    /*
       ПАНКЕЙК ДОШЁЛ ДО ОФИСА.
    */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !ventDoors[3]
    ) {

        if (
            !window.pancakeAttackTimer
        ) {

            window.pancakeAttackTimer =
                setTimeout(
                    function () {

                        window.pancakeAttackTimer =
                            null;

                        if (
                            pancakePosition >= 3 &&
                            !ventDoors[3] &&
                            !gameOver
                        ) {

                            loseGame();

                        }

                    },
                    8000
                );

        }

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

    currentView = direction;

    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;

    updateOfficeCharacters();

    if (direction === "left") {

        status.textContent =
            "ЛЕВЫЙ КОРИДОР";

    }

    else if (direction === "right") {

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
   ПЕРСОНАЖИ В ОФИСЕ
================================================= */

function updateOfficeCharacters() {

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";


    /*
       ЛИЧИ В ЛЕВОМ КОРИДОРЕ
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
       ПАНКЕЙК В ОФИСЕ
       ТОЛЬКО NIGHT 2+
    */

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
                ? "240px"
                : "150px";

    }

}


/* =================================================
   КАМЕРЫ
================================================= */

document
.getElementById("cameraButton")
.addEventListener("click", function () {

    if (!gameStarted)
        return;

    show(cameraPanel);

    showCamera(currentCamera);

});


document
.getElementById("closeCameraPanel")
.addEventListener("click", function () {

    hide(cameraPanel);

    view.style.backgroundImage =
        `url("${officeViews[currentView]}")`;

    updateOfficeCharacters();

});


/* =================================================
   ПОКАЗ КАМЕРЫ
================================================= */

function showCamera(camera) {

    if (!cameraImages[camera])
        return;

    currentCamera = camera;

    cameraImage.style.backgroundImage =
        `url("${cameraImages[camera]}")`;

    cameraNumber.textContent =
        camera.toUpperCase();

    /*
       Подсветка выбранной камеры.
    */

    document
    .querySelectorAll(
        "#cameraMap [data-camera]"
    )
    .forEach(function (button) {

        button.classList.toggle(
            "active",
            button.dataset.camera === camera
        );

    });

    updateCameraCharacters();

}


/* =================================================
   КНОПКИ CAM 01–07
================================================= */

document
.querySelectorAll(
    "#cameraMap [data-camera]"
)
.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            showCamera(
                button.dataset.camera
            );

        }
    );

});


/* =================================================
   ПЕРСОНАЖИ НА КАМЕРАХ
================================================= */

function updateCameraCharacters() {

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";


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

        status.textContent =
            "ЛИЧИ ОБНАРУЖЕНА";

    }


    /*
       ПАНКЕЙК
       Только Night 2+
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
            "ПОСМОТРИ В ЛЕВЫЙ КОРИДОР";

        return;

    }

    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "ЛИЧИ ЕЩЁ ДАЛЕКО";

        return;

    }

    flashCooldown = true;

    flash.style.opacity = "1";

    setTimeout(
        function () {

            flash.style.opacity = "0";

        },
        120
    );


    try {

        flashAudio.currentTime = 0;

        flashAudio.play()
            .catch(() => {});

    } catch (e) {}


    setTimeout(
        function () {

            try {

                lichiAudio.currentTime = 0;

                lichiAudio.play()
                    .catch(() => {});

            } catch (e) {}

        },
        100
    );


    /*
       Вспышка отбрасывает Личи.
    */

    lichiPosition = 0;

    lichi.style.display =
        "none";

    cameraLichi.style.display =
        "none";

    if (
        window.lichiAttackTimer
    ) {

        clearTimeout(
            window.lichiAttackTimer
        );

        window.lichiAttackTimer =
            null;

    }

    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


    setTimeout(
        function () {

            flashCooldown = false;

        },
        1500
    );

}


/* =================================================
   ВЕНТИЛЯЦИЯ
================================================= */

document
.getElementById("ventButton")
.addEventListener("click", function () {

    if (!gameStarted)
        return;

    show(ventPanel);

    updateVentilation();

    try {

        ventAudio.currentTime = 0;

        ventAudio.play()
            .catch(() => {});

    } catch (e) {}

});


document
.getElementById("closeVentPanel")
.addEventListener("click", function () {

    hide(ventPanel);

    stopAudio(ventAudio);

});


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

document
.querySelectorAll(".ventDoor")
.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const door =
                button.dataset.door;

            ventDoors[door] =
                !ventDoors[door];

            updateVentilation();

        }
    );

});


/* =================================================
   ВЕНТИЛЯЦИЯ
================================================= */

function updateVentilation() {

    document
    .querySelectorAll(".ventDoor")
    .forEach(function (button) {

        const door =
            button.dataset.door;

        if (
            ventDoors[door]
        ) {

            button.classList.add(
                "closed"
            );

            button.textContent =
                "ЗАКРЫТО";

        } else {

            button.classList.remove(
                "closed"
            );

            button.textContent =
                "ПЕРЕГОРОДКА";

        }

    });


    /*
       ПАНКЕЙК появляется
       в вентиляции только со второй ночи.
    */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 1
    ) {

        pancakeVent.style.display =
            "block";

        pancakeVent.textContent =
            "ПАНКЕЙК В ВЕНТИЛЯЦИИ";

    } else {

        pancakeVent.style.display =
            "none";

    }


    if (
        ventDoors[1] ||
        ventDoors[2] ||
        ventDoors[3]
    ) {

        ventStatus.textContent =
            "ПЕРЕГОРОДКИ АКТИВНЫ";

    } else {

        ventStatus.textContent =
            "ВЕНТИЛЯЦИЯ НОРМАЛЬНА";

    }

}


/* =================================================
   ОБНОВЛЕНИЕ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateVentilation();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame() {

    if (gameOver)
        return;

    gameOver = true;

    stopGameTimer();

    stopAudio(humAudio);
    stopAudio(ventAudio);

    try {

        screamAudio.currentTime = 0;

        screamAudio.play()
            .catch(() => {});

    } catch (e) {}

    show(gameOverScreen);

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;

    nightFinished = true;

    stopGameTimer();

    stopAudio(humAudio);
    stopAudio(ventAudio);

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

    show(winScreen);

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

        stopAudio(humAudio);
        stopAudio(ventAudio);
        stopAudio(phoneAudio);

        hide(game);

        hide(gameOverScreen);

        show(mainMenu);

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

        stopAudio(humAudio);
        stopAudio(ventAudio);
        stopAudio(phoneAudio);

        hide(game);

        hide(winScreen);

        show(mainMenu);

        renderNights();

    }
);


/* =================================================
   ЗАПУСК СТРАНИЦЫ
================================================= */

renderNights();

show(mainMenu);

hide(nightsMenu);
hide(settingsMenu);
hide(phoneScreen);
hide(game);
hide(cameraPanel);
hide(ventPanel);
hide(gameOverScreen);
hide(winScreen);


/* =================================================
   ЗАЩИТА ОТ ЗАВИСШЕГО ТАЙМЕРА
================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        stopGameTimer();

        stopAudio(humAudio);
        stopAudio(ventAudio);
        stopAudio(phoneAudio);

    }
);
