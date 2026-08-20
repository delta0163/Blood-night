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

let gameTimer = null;


/* =================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
=================================================

   NIGHT 1 = 5 минут
   NIGHT 2 = 6 минут
   NIGHT 3 = 7 минут
   NIGHT 4 = 8 минут

   и так далее.

   Внутри игры всегда 360 игровых минут:
   12 AM → 6 AM.

================================================= */

function getNightDuration() {

    return 4 + selectedNight;

}


/* =================================================
   СКОЛЬКО ДЛИТСЯ ОДНА ИГРОВАЯ МИНУТА
================================================= */

function getGameMinuteTime() {

    const realMinutes =
        getNightDuration();

    const totalRealSeconds =
        realMinutes * 60;

    return (
        totalRealSeconds * 1000 / 360
    );

}


/* =================================================
   ПОЗИЦИЯ ЛИЧИ
=================================================

   0 = далеко
   1 = приближается
   2 = левый коридор
   3 = дверь
   4 = атака

================================================= */

let lichiPosition = 0;


/* =================================================
   ПОЗИЦИЯ ПАНКЕЙКА
=================================================

   0 = нет
   1 = вентиляция
   2 = близко
   3 = офис

================================================= */

let pancakePosition = 0;


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
    2: "cam01",
    3: "cam06"

};


/* =================================================
   ПОЗИЦИИ ПАНКЕЙКА
   ТОЛЬКО NIGHT 2+
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

    front:
        "images/office_front.png",

    left:
        "images/office_left.png",

    right:
        "images/office_right.png"

};


/* =================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
================================================= */

function hideAllScreens() {

    mainMenu.classList.add("hidden");
    nightsMenu.classList.add("hidden");
    settingsMenu.classList.add("hidden");
    phoneScreen.classList.add("hidden");

}


function stopAllSounds() {

    [
        phoneAudio,
        humAudio,
        ventAudio
    ].forEach(function(audio) {

        audio.pause();

    });

}


/* =================================================
   МЕНЮ
================================================= */

document
.getElementById("startGameButton")
.addEventListener("click", function() {

    selectedNight = 1;

    enterFullscreen();

    startSelectedNight();

});


document
.getElementById("nightsButton")
.addEventListener("click", function() {

    renderNights();

    mainMenu.classList.add("hidden");

    nightsMenu.classList.remove("hidden");

});


document
.getElementById("closeNights")
.addEventListener("click", function() {

    nightsMenu.classList.add("hidden");

    mainMenu.classList.remove("hidden");

});


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
                function() {

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
.addEventListener("click", function() {

    mainMenu.classList.add("hidden");

    settingsMenu.classList.remove("hidden");

});


document
.getElementById("closeSettings")
.addEventListener("click", function() {

    settingsMenu.classList.add("hidden");

    mainMenu.classList.remove("hidden");

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
            "Fullscreen недоступен:",
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
.addEventListener("click", function() {

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

    stopAllSounds();

    hideAllScreens();

    game.classList.add("hidden");

    gameOverScreen.classList.add("hidden");
    winScreen.classList.add("hidden");

    cameraPanel.classList.add("hidden");
    ventPanel.classList.add("hidden");

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


    /* HUD */

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


    /* ОФИС */

    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    /* ПЕРСОНАЖИ */

    lichi.style.display = "none";
    pancake.style.display = "none";

    cameraLichi.style.display = "none";
    cameraPancake.style.display = "none";

    pancakeVent.style.display = "none";


    /* ВЕНТИЛЯЦИЯ */

    ventStatus.textContent =
        "ВЕНТИЛЯЦИЯ НОРМАЛЬНА";

    updateVentilation();


    /* КАМЕРА */

    showCamera("cam01");


    /* ПОКАЗЫВАЕМ ЗВОНОК */

    phoneScreen.classList.remove("hidden");


    /* ЗАПУСКАЕМ ЗВОНОК */

    try {

        phoneAudio.currentTime = 0;

        phoneAudio.play()
            .catch(function() {});

    } catch (error) {

        console.log(error);

    }

}


/* =================================================
   ПРОПУСТИТЬ ЗВОНОК
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener("click", function() {

    try {

        phoneAudio.pause();

        phoneAudio.currentTime = 0;

    } catch (error) {}

    startNightAfterPhone();

});


/* =================================================
   ЕСЛИ ЗВОНОК ЗАКОНЧИЛСЯ
================================================= */

phoneAudio.addEventListener(
    "ended",
    function() {

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

    gameStarted = true;

    phoneScreen.classList.add("hidden");

    game.classList.remove("hidden");

    cameraPanel.classList.add("hidden");
    ventPanel.classList.add("hidden");

    gameOverScreen.classList.add("hidden");
    winScreen.classList.add("hidden");


    /* ФОНОВЫЙ ЗВУК */

    try {

        humAudio.currentTime = 0;

        humAudio.play()
            .catch(function() {});

    } catch (error) {}


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
            function() {

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

        clearInterval(gameTimer);

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

    /* =========================
       ЛИЧИ
    ========================= */

    /*
       Ночная 1:
       шаг примерно каждые 45 секунд.

       Ночная 2:
       шаг каждые 30 секунд.

       Поэтому во вторую ночь
       Личи заметно быстрее.
    */

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;


    if (
        gameMinutes >= 45 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

            try {

                lichiAudio.currentTime = 0;

                lichiAudio.play()
                    .catch(function(){});

            } catch (error) {}

        }

    }


    /* =========================
       ПАНКЕЙК
       ТОЛЬКО NIGHT 2+
    ========================= */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 120
    ) {

        const pancakeSpeed =
            selectedNight === 2
                ? 50
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

                    pancakeAudio.currentTime = 0;

                    pancakeAudio.play()
                        .catch(function(){});

                } catch (error) {}

            }

        }

    }


    /* =========================
       ЛИЧИ АТАКУЕТ
    ========================= */

    if (
        lichiPosition >= 4
    ) {

        if (
            currentView === "left"
        ) {

            status.textContent =
                "ЛИЧИ СОВСЕМ БЛИЗКО!";

        } else {

            loseGame();

        }

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        !ventDoors[3]
    ) {

        loseGame();

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


    updateOfficeCharacters();

}


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


/* =================================================
   ПЕРСОНАЖИ В ОФИСЕ
================================================= */

function updateOfficeCharacters() {

    lichi.style.display = "none";
    pancake.style.display = "none";


    /* =========================
       ЛИЧИ
    ========================= */

    if (
        lichiPosition >= 2 &&
        currentView === "left"
    ) {

        lichi.style.display = "block";


        if (
            lichiPosition === 2
        ) {

            lichi.style.left = "75%";
            lichi.style.top = "50%";
            lichi.style.width = "130px";

        }

        else if (
            lichiPosition === 3
        ) {

            lichi.style.left = "58%";
            lichi.style.top = "50%";
            lichi.style.width = "190px";

        }

        else {

            lichi.style.left = "50%";
            lichi.style.top = "50%";
            lichi.style.width = "270px";

        }

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 2 &&
        currentView === "front"
    ) {

        pancake.style.display = "block";

        pancake.style.left = "78%";
        pancake.style.top = "55%";

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
.addEventListener("click", function() {

    if (!gameStarted)
        return;

    cameraPanel.classList.remove("hidden");

    ventPanel.classList.add("hidden");

    showCamera(currentCamera);

});


document
.getElementById("closeCameraPanel")
.addEventListener("click", function() {

    cameraPanel.classList.add("hidden");

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


    currentCamera =
        camera;


    cameraImage.style.backgroundImage =
        `url("${cameraImages[camera]}")`;


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
.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

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

    cameraLichi.style.display = "none";
    cameraPancake.style.display = "none";


    /* =========================
       ЛИЧИ
    ========================= */

    const lichiCam =
        lichiCameraPositions[
            lichiPosition
        ];


    if (
        lichiCam === currentCamera &&
        lichiPosition > 0
    ) {

        cameraLichi.style.display =
            "block";

        status.textContent =
            "ЛИЧИ ОБНАРУЖЕНА";

    }


    /* =========================
       ПАНКЕЙК
    ========================= */

    if (
        selectedNight >= 2
    ) {

        const pancakeCam =
            pancakeCameraPositions[
                pancakePosition
            ];


        if (
            pancakeCam === currentCamera &&
            pancakePosition > 0
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
        function() {

            flash.style.opacity = "0";

        },
        120
    );


    try {

        flashAudio.currentTime = 0;

        flashAudio.play()
            .catch(function(){});

    } catch (error) {}


    setTimeout(
        function() {

            try {

                lichiAudio.currentTime = 0;

                lichiAudio.play()
                    .catch(function(){});

            } catch (error) {}

        },
        100
    );


    lichiPosition = 0;

    lichi.style.display = "none";

    cameraLichi.style.display = "none";


    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


    setTimeout(
        function() {

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
.addEventListener("click", function() {

    if (!gameStarted)
        return;


    ventPanel.classList.remove("hidden");

    cameraPanel.classList.add("hidden");


    updateVentilation();


    try {

        ventAudio.currentTime = 0;

        ventAudio.play()
            .catch(function(){});

    } catch (error) {}

});


document
.getElementById("closeVentPanel")
.addEventListener("click", function() {

    ventPanel.classList.add("hidden");

    try {

        ventAudio.pause();

    } catch (error) {}

});


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

document
.querySelectorAll(".ventDoor")
.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const door =
                Number(button.dataset.door);


            ventDoors[door] =
                !ventDoors[door];


            updateVentilation();

        }
    );

});


/* =================================================
   ОБНОВЛЕНИЕ ВЕНТИЛЯЦИИ
================================================= */

function updateVentilation() {

    document
    .querySelectorAll(".ventDoor")
    .forEach(function(button) {

        const door =
            Number(button.dataset.door);


        if (
            ventDoors[door]
        ) {

            button.classList.add("closed");

            button.textContent =
                "ЗАКРЫТО";

        } else {

            button.classList.remove("closed");

            button.textContent =
                "ПЕРЕГОРОДКА";

        }

    });


    /* ПАНКЕЙК */

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


    /* СТАТУС */

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
   ОБНОВИТЬ ВСЁ
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

    gameStarted = false;


    stopGameTimer();


    try {

        humAudio.pause();
        ventAudio.pause();

    } catch (error) {}


    try {

        screamAudio.currentTime = 0;

        screamAudio.play()
            .catch(function(){});

    } catch (error) {}


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished = true;

    gameStarted = false;


    stopGameTimer();


    try {

        humAudio.pause();
        ventAudio.pause();

    } catch (error) {}


    if (
        selectedNight > completedNight
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


    winScreen.classList.remove(
        "hidden"
    );

}


/* =================================================
   СЛЕДУЮЩАЯ НОЧЬ
================================================= */

nextNightButton.addEventListener(
    "click",
    function() {

        if (
            selectedNight < 13
        ) {

            selectedNight++;

            startSelectedNight();

        }

    }
);


/* =================================================
   ПОВТОР
================================================= */

document
.getElementById("restart")
.addEventListener(
    "click",
    function() {

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
    function() {

        stopGameTimer();

        stopAllSounds();

        game.classList.add("hidden");

        gameOverScreen.classList.add(
            "hidden"
        );

        mainMenu.classList.remove(
            "hidden"
        );

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
    function() {

        stopGameTimer();

        stopAllSounds();

        game.classList.add("hidden");

        winScreen.classList.add(
            "hidden"
        );

        mainMenu.classList.remove(
            "hidden"
        );

        renderNights();

    }
);


/* =================================================
   ЗАПУСК
================================================= */

renderNights();

mainMenu.classList.remove("hidden");

nightsMenu.classList.add("hidden");

settingsMenu.classList.add("hidden");

phoneScreen.classList.add("hidden");

game.classList.add("hidden");

gameOverScreen.classList.add("hidden");

winScreen.classList.add("hidden");
