/* =================================================
   BLOOD GLOW NIGHT
   ПОЛНАЯ ВЕРСИЯ
================================================= */


/* =================================================
   ELEMENTS
================================================= */

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


/* =================================================
   ЗВУКИ
================================================= */

const phoneAudio =
    document.getElementById("phoneAudio");

const humAudio =
    document.getElementById("humAudio");

const flashAudio =
    document.getElementById("flashAudio");

const lichiAudio =
    document.getElementById("lichiAudio");

const pancakeAudio =
    document.getElementById("pancakeAudio");

const screamAudio =
    document.getElementById("screamAudio");

const ventAudio =
    document.getElementById("ventAudio");

const catAudio =
    document.getElementById("catAudio");

const nemkaAudio =
    document.getElementById("nemkaAudio");

const powerOffAudio =
    document.getElementById("powerOffAudio");

const backupAudio =
    document.getElementById("backupAudio");


/* =================================================
   ИГРА
================================================= */

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const pancake =
    document.getElementById("pancake");

const delta =
    document.getElementById("delta");

const flash =
    document.getElementById("flash");

const nemkaEyes =
    document.getElementById("nemkaEyes");

const status =
    document.getElementById("status");

const time =
    document.getElementById("time");

const nightDisplay =
    document.getElementById("night");


/* =================================================
   ШАХТА
================================================= */

const upperVentButton =
    document.getElementById(
        "upperVentButton"
    );

const upperVent =
    document.getElementById(
        "upperVent"
    );

const incineratorButton =
    document.getElementById(
        "incineratorButton"
    );


/* =================================================
   КАМЕРЫ
================================================= */

const cameraPanel =
    document.getElementById(
        "cameraPanel"
    );

const cameraImage =
    document.getElementById(
        "cameraImage"
    );

const cameraNumber =
    document.getElementById(
        "cameraNumber"
    );

const cameraLichi =
    document.getElementById(
        "cameraLichi"
    );

const cameraPancake =
    document.getElementById(
        "cameraPancake"
    );

const cameraNemkaEyes =
    document.getElementById(
        "cameraNemkaEyes"
    );


/* =================================================
   ЭНЕРГИЯ
================================================= */

const energyPanel =
    document.getElementById(
        "energyPanel"
    );

const energyTargetText =
    document.getElementById(
        "energyTargetText"
    );

const energyMessage =
    document.getElementById(
        "energyMessage"
    );

const lever =
    document.getElementById(
        "lever"
    );

const leverProgressBar =
    document.getElementById(
        "leverProgressBar"
    );


/* =================================================
   РЕЗЕРВ
================================================= */

const backupPanel =
    document.getElementById(
        "backupPanel"
    );

const backupMessage =
    document.getElementById(
        "backupMessage"
    );


/* =================================================
   GAME OVER
================================================= */

const gameOverScreen =
    document.getElementById(
        "gameOver"
    );

const winScreen =
    document.getElementById(
        "winScreen"
    );

const winText =
    document.getElementById(
        "winText"
    );

const nextNightButton =
    document.getElementById(
        "nextNight"
    );

const loseReason =
    document.getElementById(
        "loseReason"
    );


/* =================================================
   МЯУКАНЬЕ
================================================= */

const catMessage =
    document.getElementById(
        "catMessage"
    );

const catMeowButton =
    document.getElementById(
        "catMeowButton"
    );


/* =================================================
   SHOW / HIDE
================================================= */

function showElement(element, display = "flex") {

    if (!element)
        return;

    element.classList.remove("hidden");
    element.style.display = display;
}


function hideElement(element) {

    if (!element)
        return;

    element.classList.add("hidden");
    element.style.display = "none";
}


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
   GAME STATE
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

const NIGHT_REAL_TIME =
    5 * 60 * 1000;

const GAME_END_TIME =
    360;

let gameStartTimestamp = 0;
let lastGameMinute = -1;
let gameTimer = null;


/* =================================================
   ENERGY
================================================= */

let energyTarget = "camera";

let leverDragging = false;
let leverStartTime = 0;
let leverCompleted = false;

const LEVER_TIME = 3000;


/* =================================================
   ЭЛЕКТРИЧЕСТВО
================================================= */

let electricityOn = true;
let backupActive = false;

let backupExpected = 1;


/* =================================================
   НЕМКА
=================================================

   0 = не активна
   1 = идёт к электрощитку
   2 = почти дошла
   3 = отключила электричество
================================================= */

let nemkaActive = false;
let nemkaPosition = 0;

let nemkaMeowCooldown = false;
let nemkaTargetCamera = null;


/* =================================================
   ЛИЧИ
================================================= */

let lichiPosition = 0;


/* =================================================
   ПАНКЕЙК
================================================= */

let pancakePosition = 0;


/* =================================================
   ДЕЛЬТА
=================================================

   Дельта существует ТОЛЬКО с NIGHT 4.

   0 = отсутствует
   2 = находится в верхней шахте
================================================= */

let deltaPosition = 0;

let upperVentView = false;


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


const lichiCameraPositions = {

    1: "cam01",
    2: "cam02",
    3: "cam06",
    4: "cam06"

};


const pancakeCameraPositions = {

    1: "cam04",
    2: "cam05",
    3: "cam05"

};


/* НЕМКА ТЕПЕРЬ ОТОБРАЖАЕТСЯ НА КАМЕРАХ */

const nemkaCameraPositions = {

    1: "cam02",
    2: "cam04",
    3: "cam06"

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
   МЕНЮ
================================================= */

document
.getElementById("startGameButton")
.addEventListener(
    "click",
    function() {

        selectedNight = 1;

        enterFullscreen();

        startSelectedNight();

    }
);


document
.getElementById("nightsButton")
.addEventListener(
    "click",
    function() {

        renderNights();

        hideElement(mainMenu);

        showElement(
            nightsMenu,
            "flex"
        );

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function() {

        hideElement(nightsMenu);

        showElement(
            mainMenu,
            "flex"
        );

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
.addEventListener(
    "click",
    function() {

        hideElement(mainMenu);

        showElement(
            settingsMenu,
            "flex"
        );

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function() {

        hideElement(settingsMenu);

        showElement(
            mainMenu,
            "flex"
        );

    }
);


/* =================================================
   FULLSCREEN
================================================= */

async function enterFullscreen() {

    try {

        if (
            !document.fullscreenElement &&
            document.documentElement.requestFullscreen
        ) {

            await document
                .documentElement
                .requestFullscreen();

        }

    } catch(error) {

        console.log(error);

    }
}


document
.getElementById("fullscreenButton")
.addEventListener(
    "click",
    enterFullscreen
);


/* =================================================
   RESET
================================================= */

document
.getElementById("resetProgress")
.addEventListener(
    "click",
    function() {

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

    stopGameTimer();

    hideElement(mainMenu);
    hideElement(nightsMenu);
    hideElement(settingsMenu);

    hideElement(gameOverScreen);
    hideElement(winScreen);

    hideElement(cameraPanel);
    hideElement(energyPanel);
    hideElement(backupPanel);

    showElement(
        phoneScreen,
        "flex"
    );

    hideElement(game);

    gameStarted = false;
    gameOver = false;
    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";
    currentCamera = "cam01";

    energyTarget = "camera";

    electricityOn = true;
    backupActive = false;
    backupExpected = 1;

    /* НЕМКА */

    nemkaActive = false;
    nemkaPosition = 0;

    nemkaTargetCamera = null;

    nemkaMeowCooldown = false;


    /* ЛИЧИ */

    lichiPosition = 0;


    /* ПАНКЕЙК */

    pancakePosition = 0;


    /* ДЕЛЬТА */

    deltaPosition = 0;
    upperVentView = false;

    upperVent.classList.remove(
        "upperVentActive"
    );


    /* РЫЧАГ */

    leverDragging = false;
    leverCompleted = false;

    leverProgressBar.style.width =
        "0%";

    lever.style.top =
        "20px";


    /* ПЕРСОНАЖИ */

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    delta.style.display =
        "none";


    nemkaEyes.classList.remove(
        "nemkaEyesActive"
    );

    cameraNemkaEyes.classList.remove(
        "nemkaEyesActive"
    );


    /* HUD */

    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;

    document
    .getElementById("phoneNight")
    .textContent =
        "NIGHT " +
        selectedNight;

    time.textContent =
        "12:00 AM";

    status.textContent =
        "ОФИС";


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    energyTargetText.textContent =
        "КАМЕРЫ";

    energyMessage.textContent =
        "Энергия направлена на камеры.";

    catMessage.textContent =
        "Выберите камеру.";


    try {

        phoneAudio.pause();

        phoneAudio.currentTime = 0;

        phoneAudio
            .play()
            .catch(() => {});

    } catch(e) {}

}


/* =================================================
   ПРОПУСК ЗВОНКА
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function() {

        try {

            phoneAudio.pause();

            phoneAudio.currentTime = 0;

        } catch(e) {}

        startNightAfterPhone();

    }
);


phoneAudio.addEventListener(
    "ended",
    startNightAfterPhone
);


/* =================================================
   ПОСЛЕ ЗВОНКА
================================================= */

function startNightAfterPhone() {

    if (gameStarted)
        return;

    gameStarted = true;

    hideElement(phoneScreen);

    showElement(
        game,
        "block"
    );

    try {

        humAudio.currentTime = 0;

        humAudio
            .play()
            .catch(() => {});

    } catch(e) {}

    gameStartTimestamp =
        performance.now();

    lastGameMinute = -1;

    updateEverything();

    startGameTimer();
}


/* =================================================
   ТАЙМЕР
================================================= */

function startGameTimer() {

    stopGameTimer();

    gameStartTimestamp =
        performance.now();

    lastGameMinute = -1;

    gameTimer =
        setInterval(
            function() {

                if (!gameStarted)
                    return;

                if (gameOver)
                    return;

                if (nightFinished)
                    return;


                const elapsed =
                    performance.now() -
                    gameStartTimestamp;


                gameMinutes =
                    Math.floor(
                        (
                            elapsed /
                            NIGHT_REAL_TIME
                        ) *
                        GAME_END_TIME
                    );


                gameMinutes =
                    Math.min(
                        gameMinutes,
                        GAME_END_TIME
                    );


                if (
                    gameMinutes !==
                    lastGameMinute
                ) {

                    lastGameMinute =
                        gameMinutes;

                    updateClock();

                    updateCharactersByTime();

                    updateEverything();

                }


                if (
                    gameMinutes >=
                    GAME_END_TIME
                ) {

                    winGame();

                }

            },
            50
        );
}


function stopGameTimer() {

    if (
        gameTimer !== null
    ) {

        clearInterval(gameTimer);

        gameTimer = null;

    }
}


/* =================================================
   ВРЕМЯ
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
   МЕХАНИКИ ПО ВРЕМЕНИ
================================================= */

function updateCharactersByTime() {


    /* =================================================
       НЕМКА

       Начиная с NIGHT 3.

       Она НЕ телепортируется к щитку.
       Она медленно проходит стадии:
       1 → 2 → 3.

       На каждом шаге проходит некоторое время.
    ================================================= */

    if (
        selectedNight >= 3 &&
        electricityOn &&
        !nemkaActive &&
        gameMinutes >= 60
    ) {

        nemkaActive = true;

        nemkaPosition = 1;

        playSound(
            nemkaAudio
        );

        status.textContent =
            "НЕМКА ПОЯВИЛАСЬ. ОНА ИДЁТ К ЭЛЕКТРОЩИТКУ.";

    }


    /* НЕМКА ИДЁТ МЕДЛЕННО */

    if (
        nemkaActive &&
        electricityOn &&
        nemkaPosition === 1 &&
        gameMinutes >= 120
    ) {

        nemkaPosition = 2;

        playSound(
            nemkaAudio
        );

        status.textContent =
            "НЕМКА ПОДХОДИТ К ЭЛЕКТРОЩИТКУ.";

    }


    /*
       Ещё один медленный шаг.
       Никакого ускорения после этого.
    */

    if (
        nemkaActive &&
        electricityOn &&
        nemkaPosition === 2 &&
        gameMinutes >= 180
    ) {

        nemkaPosition = 3;

        playSound(
            nemkaAudio
        );

        status.textContent =
            "НЕМКА ДОБРАЛАСЬ ДО ЭЛЕКТРОЩИТКА!";

        turnOffElectricity();

    }


    /* =================================================
       ЛИЧИ
    ================================================= */

    if (
        selectedNight >= 1 &&
        gameMinutes >= 30
    ) {

        if (
            gameMinutes % 35 === 0 &&
            lichiPosition < 4
        ) {

            lichiPosition++;

            playSound(
                lichiAudio
            );

        }

    }


    /* =================================================
       ПАНКЕЙК
    ================================================= */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 120
    ) {

        if (
            gameMinutes % 35 === 0 &&
            pancakePosition < 3
        ) {

            pancakePosition++;

            playSound(
                pancakeAudio
            );

        }

    }


    /* =================================================
       ДЕЛЬТА

       ТОЛЬКО NIGHT 4+

       Она сразу находится в верхней шахте.
       В офисе её никогда нет.
    ================================================= */

    if (
        selectedNight >= 4 &&
        gameMinutes >= 120 &&
        deltaPosition === 0
    ) {

        deltaPosition = 2;

        playSound(
            ventAudio
        );

        status.textContent =
            "В ВЕРХНЕЙ ШАХТЕ ЧТО-ТО ДВИЖЕТСЯ...";

    }


    updateNemka();

    updateLichi();

    updatePancake();

    updateDelta();
}


/* =================================================
   НЕМКА
================================================= */

function updateNemka() {

    if (!nemkaActive) {

        nemkaEyes.classList.remove(
            "nemkaEyesActive"
        );

        cameraNemkaEyes.classList.remove(
            "nemkaEyesActive"
        );

        return;

    }


    /*
       Немку видно на камерах,
       пока она движется.
    */

    if (
        nemkaPosition >= 1 &&
        nemkaPosition <= 3
    ) {

        cameraNemkaEyes.classList.add(
            "nemkaEyesActive"
        );

    }


    /*
       Пока Немка дошла только до щитка,
       электричество ещё работает.
    */

    if (
        nemkaPosition === 2 &&
        electricityOn
    ) {

        status.textContent =
            "НЕМКА ИДЁТ К ЭЛЕКТРОЩИТКУ.";

        return;

    }


    /*
       После отключения света
       ждём головоломку.
    */

    if (
        !electricityOn &&
        !backupActive
    ) {

        status.textContent =
            "НЕМКА ОТКЛЮЧИЛА ЭЛЕКТРИЧЕСТВО. ЗАПУСТИТЕ РЕЗЕРВ.";

        return;

    }

}


/* =================================================
   ОТКЛЮЧЕНИЕ ЭЛЕКТРИЧЕСТВА
================================================= */

function turnOffElectricity() {

    if (!electricityOn)
        return;


    electricityOn = false;

    backupActive = false;

    backupExpected = 1;


    energyTarget = "camera";


    playSound(
        powerOffAudio
    );


    status.textContent =
        "НЕМКА ОТКЛЮЧИЛА ЭЛЕКТРИЧЕСТВО!";


    hideElement(
        cameraPanel
    );

    hideElement(
        energyPanel
    );


    backupButtons.forEach(
        function(button) {

            button.classList.remove(
                "wireSelected"
            );

        }
    );


    backupMessage.textContent =
        "Соедините провода в правильном порядке.";


    /*
       Резерв появляется сразу после отключения.
    */

    setTimeout(
        function() {

            if (
                !gameOver &&
                !backupActive
            ) {

                showElement(
                    backupPanel,
                    "flex"
                );

            }

        },
        400
    );
}


/* =================================================
   МЯУКАНЬЕ
================================================= */

catMeowButton
.addEventListener(
    "click",
    playCatMeow
);


function playCatMeow() {

    if (!gameStarted)
        return;


    if (!nemkaActive) {

        catMessage.textContent =
            "НЕМКА ЕЩЁ НЕ АКТИВНА.";

        return;

    }


    if (!electricityOn) {

        catMessage.textContent =
            "ЭЛЕКТРИЧЕСТВО ОТКЛЮЧЕНО.";

        return;

    }


    if (nemkaMeowCooldown)
        return;


    nemkaMeowCooldown = true;

    nemkaTargetCamera =
        currentCamera;


    playSound(
        catAudio
    );


    catMessage.textContent =
        "НЕМКА УСЛЫШАЛА CAM " +
        currentCamera.replace("cam", "") +
        "!";


    status.textContent =
        "НЕМКА ОТВЛЕКЛАСЬ НА МЯУКАНЬЕ.";


    /*
       Мяуканье НЕ телепортирует Немку.
       Оно только возвращает её на первую
       стадию движения.
    */

    if (
        nemkaPosition === 1 ||
        nemkaPosition === 2
    ) {

        nemkaPosition = 1;

    }


    setTimeout(
        function() {

            nemkaMeowCooldown = false;

        },
        1200
    );
}


/* =================================================
   РЕЗЕРВНАЯ СИСТЕМА
================================================= */

const backupButtons =
    document.querySelectorAll(
        "#backupWires button"
    );


backupButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (backupActive)
                    return;


                const wire =
                    Number(
                        button.dataset.wire
                    );


                if (
                    wire ===
                    backupExpected
                ) {

                    button.classList.add(
                        "wireSelected"
                    );

                    backupExpected++;

                    backupMessage.textContent =
                        "Правильно. Следующий провод.";


                    /*
                       Последний провод:
                       свет возвращается СРАЗУ.
                    */

                    if (
                        backupExpected > 4
                    ) {

                        activateBackup();

                    }

                } else {

                    backupExpected = 1;


                    backupButtons.forEach(
                        function(b) {

                            b.classList.remove(
                                "wireSelected"
                            );

                        }
                    );


                    backupMessage.textContent =
                        "Неверно. Начните заново.";

                }

            }
        );

    }
);


/* =================================================
   ВКЛЮЧЕНИЕ РЕЗЕРВА
================================================= */

function activateBackup() {

    backupActive = true;

    electricityOn = true;


    playSound(
        backupAudio
    );


    hideElement(
        backupPanel
    );


    /*
       Немка отступает,
       но не ускоряется.
    */

    nemkaPosition = 1;


    status.textContent =
        "РЕЗЕРВ ЗАПУЩЕН. ЭЛЕКТРИЧЕСТВО ВОССТАНОВЛЕНО.";


    backupButtons.forEach(
        function(button) {

            button.classList.remove(
                "wireSelected"
            );

        }
    );


    backupExpected = 1;


    updateEverything();
}


/* =================================================
   ЛИЧИ
================================================= */

function updateLichi() {

    lichi.style.display =
        "none";


    if (
        selectedNight < 1
    )
        return;


    if (
        lichiPosition < 2
    )
        return;


    if (
        currentView !== "left"
    )
        return;


    lichi.style.display =
        "block";


    lichi.style.left =
        lichiPosition === 2
            ? "75%"
            : lichiPosition === 3
                ? "58%"
                : "50%";


    lichi.style.top =
        "50%";


    lichi.style.width =
        lichiPosition === 2
            ? "130px"
            : lichiPosition === 3
                ? "190px"
                : "270px";
}


/* =================================================
   ПАНКЕЙК
================================================= */

function updatePancake() {

    pancake.style.display =
        "none";


    if (
        pancakePosition < 2
    )
        return;


    if (
        currentView !== "front"
    )
        return;


    pancake.style.display =
        "block";


    if (
        pancakePosition === 2
    ) {

        pancake.style.left =
            "75%";

        pancake.style.top =
            "55%";

        pancake.style.width =
            "180px";

    } else {

        pancake.style.left =
            "50%";

        pancake.style.top =
            "50%";

        pancake.style.width =
            "300px";

    }
}


/* =================================================
   ДЕЛЬТА
================================================= */

function updateDelta() {

    delta.style.display =
        "none";


    /*
       До NIGHT 4 Дельты НЕТ.
    */

    if (
        selectedNight < 4
    )
        return;


    /*
       Дельта находится только в шахте.
    */

    if (
        deltaPosition !== 2
    )
        return;


    /*
       Показываем её только когда
       открыта верхняя шахта.
    */

    if (
        !upperVentView
    )
        return;


    delta.style.display =
        "block";


    delta.style.left =
        "50%";

    delta.style.top =
        "55%";

    delta.style.width =
        "300px";
}


/* =================================================
   СЖИГАТЕЛЬ
================================================= */

incineratorButton
.addEventListener(
    "click",
    burnGarbage
);


function burnGarbage() {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    if (
        energyTarget !==
        "incinerator"
    ) {

        status.textContent =
            "СНАЧАЛА НАПРАВЬТЕ ЭНЕРГИЮ НА СЖИГАТЕЛЬ.";

        return;

    }


    if (
        selectedNight < 4
    ) {

        status.textContent =
            "СЖИГАТЕЛЬ ПОКА НЕ НУЖЕН.";

        return;

    }


    if (
        deltaPosition !== 2
    ) {

        status.textContent =
            "В ШАХТЕ НИКОГО НЕТ.";

        return;

    }


    deltaPosition = 0;

    upperVentView = false;


    upperVent.classList.remove(
        "upperVentActive"
    );


    playSound(
        backupAudio
    );


    status.textContent =
        "🔥 ДЕЛЬТА ОТСТУПИЛА.";


    updateDelta();
}


/* =================================================
   ВЕРХНЯЯ ШАХТА
================================================= */

upperVentButton
.addEventListener(
    "click",
    function() {

        if (!gameStarted)
            return;

        if (gameOver)
            return;


        if (
            currentView !==
            "front"
        )
            return;


        /*
           Шахта существует заранее.
           Кнопка появляется только с NIGHT 4.
        */

        upperVentView =
            !upperVentView;


        if (upperVentView) {

            upperVent.classList.add(
                "upperVentActive"
            );

            status.textContent =
                "ВЕРХНЯЯ ШАХТА";

        } else {

            upperVent.classList.remove(
                "upperVentActive"
            );

            status.textContent =
                "ОФИС";

        }


        updateDelta();

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


    if (!electricityOn) {

        status.textContent =
            "ЭЛЕКТРИЧЕСТВА НЕТ.";

        return;

    }


    if (
        energyTarget !==
        "camera"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ.";

        return;

    }


    if (
        currentView !==
        "left"
    ) {

        status.textContent =
            "ПОСМОТРИ В ЛЕВЫЙ КОРИДОР.";

        return;

    }


    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "ЛИЧИ ЕЩЁ ДАЛЕКО.";

        return;

    }


    if (flashCooldown)
        return;


    flashCooldown = true;


    flash.style.opacity = "1";


    setTimeout(
        function() {

            flash.style.opacity =
                "0";

        },
        120
    );


    playSound(
        flashAudio
    );


    lichiPosition = 0;

    lichi.style.display =
        "none";


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
   ПОВОРОТЫ
================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    currentView =
        direction;


    /*
       При повороте шахта закрывается.
    */

    upperVentView = false;

    upperVent.classList.remove(
        "upperVentActive"
    );


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
            energyTarget === "door"
                ? "ПРАВАЯ ДВЕРЬ ЗАКРЫТА"
                : "ПРАВЫЙ КОРИДОР";

    }

    else {

        status.textContent =
            "ОФИС";

    }


    updateOfficeCharacters();

    updateDelta();
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

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    /*
       Дельта здесь НИКОГДА не показывается.
    */

    delta.style.display =
        "none";

    updateLichi();

    updatePancake();

}


/* =================================================
   КАМЕРЫ
================================================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function() {

        if (!gameStarted)
            return;


        if (!electricityOn) {

            status.textContent =
                "КАМЕРЫ НЕ РАБОТАЮТ: НЕТ ЭЛЕКТРИЧЕСТВА.";

            return;

        }


        if (
            energyTarget !==
            "camera"
        ) {

            status.textContent =
                "ЭНЕРГИЯ НЕ НАПРАВЛЕНА НА КАМЕРЫ.";

            return;

        }


        showElement(
            cameraPanel,
            "flex"
        );


        showCamera(
            currentCamera
        );

    }
);


document
.getElementById("closeCameraPanel")
.addEventListener(
    "click",
    function() {

        hideElement(
            cameraPanel
        );

        updateOfficeCharacters();

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
.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (
                    energyTarget !==
                    "camera"
                )
                    return;


                if (
                    !electricityOn
                )
                    return;


                showCamera(
                    button.dataset.camera
                );


                catMessage.textContent =
                    "Мяукнуть на " +
                    button.dataset.camera
                        .toUpperCase();

            }
        );

    }
);


/* =================================================
   ПЕРСОНАЖИ НА КАМЕРАХ
================================================= */

function updateCameraCharacters() {

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";


    cameraNemkaEyes.classList.remove(
        "nemkaEyesActive"
    );


    if (!electricityOn)
        return;


    if (
        energyTarget !==
        "camera"
    )
        return;


    if (
        lichiCameraPositions[
            lichiPosition
        ] === currentCamera
    ) {

        cameraLichi.style.display =
            "block";

    }


    if (
        pancakeCameraPositions[
            pancakePosition
        ] === currentCamera
    ) {

        cameraPancake.style.display =
            "block";

    }


    /*
       НЕМКА ВИДНА НА КАМЕРАХ,
       ПОКА ИДЁТ К ЩИТКУ.
    */

    if (
        nemkaActive &&
        nemkaPosition >= 1 &&
        nemkaPosition <= 2 &&
        nemkaCameraPositions[
            nemkaPosition
        ] === currentCamera
    ) {

        cameraNemkaEyes.classList.add(
            "nemkaEyesActive"
        );

    }

}


/* =================================================
   ЭНЕРГИЯ
================================================= */

document
.getElementById("energyButton")
.addEventListener(
    "click",
    function() {

        if (!gameStarted)
            return;


        showElement(
            energyPanel,
            "flex"
        );


        updateEnergyUI();

    }
);


document
.getElementById("closeEnergyPanel")
.addEventListener(
    "click",
    function() {

        hideElement(
            energyPanel
        );


        leverDragging = false;

        leverCompleted = false;


        leverProgressBar.style.width =
            "0%";

        lever.style.top =
            "20px";

    }
);


/* =================================================
   ВЫБОР ЭНЕРГИИ
================================================= */

document
.querySelectorAll(
    "#energyTargets [data-energy]"
)
.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (!gameStarted)
                    return;


                energyTarget =
                    button.dataset.energy;


                updateEnergyUI();


                if (
                    energyTarget ===
                    "camera"
                ) {

                    status.textContent =
                        "ЭНЕРГИЯ НА КАМЕРАХ.";

                }

                else if (
                    energyTarget ===
                    "window"
                ) {

                    status.textContent =
                        "ЭНЕРГИЯ НА ОКНЕ.";

                }

                else if (
                    energyTarget ===
                    "incinerator"
                ) {

                    status.textContent =
                        "ЭНЕРГИЯ НА СЖИГАТЕЛЕ.";

                }

                else if (
                    energyTarget ===
                    "door"
                ) {

                    status.textContent =
                        "ЭНЕРГИЯ НА ПРАВОЙ ДВЕРИ.";

                }

            }
        );

    }
);


/* =================================================
   ENERGY UI
================================================= */

function updateEnergyUI() {

    const names = {

        camera:
            "КАМЕРЫ",

        window:
            "ОКНО",

        incinerator:
            "СЖИГАТЕЛЬ",

        door:
            "ПРАВАЯ ДВЕРЬ"

    };


    energyTargetText.textContent =
        names[
            energyTarget
        ] ||
        "КАМЕРЫ";


    document
    .querySelectorAll(
        "#energyTargets [data-energy]"
    )
    .forEach(
        function(button) {

            button.classList.toggle(
                "energyTargetActive",

                button.dataset.energy ===
                energyTarget
            );

        }
    );


    if (
        energyTarget ===
        "camera"
    ) {

        energyMessage.textContent =
            "Энергия на камерах. Вспышка доступна.";

    }

    else if (
        energyTarget ===
        "window"
    ) {

        energyMessage.textContent =
            "Энергия направлена на окно.";

    }

    else if (
        energyTarget ===
        "incinerator"
    ) {

        energyMessage.textContent =
            "Сжигатель мусора получает энергию.";

    }

    else if (
        energyTarget ===
        "door"
    ) {

        energyMessage.textContent =
            "Правая дверь получает энергию.";

    }

}


/* =================================================
   РЫЧАГ
================================================= */

function startLeverDrag(event) {

    if (!gameStarted)
        return;


    if (leverCompleted)
        return;


    event.preventDefault();


    leverDragging = true;

    leverStartTime =
        performance.now();


    requestAnimationFrame(
        updateLever
    );
}


function updateLever() {

    if (!leverDragging)
        return;


    const elapsed =
        performance.now() -
        leverStartTime;


    const progress =
        Math.min(
            elapsed /
            LEVER_TIME,
            1
        );


    const maxTop = 95;


    lever.style.top =
        (
            20 +
            maxTop *
            progress
        ) +
        "px";


    leverProgressBar.style.width =
        (
            progress *
            100
        ) +
        "%";


    if (
        progress >= 1
    ) {

        completeLever();

        return;

    }


    requestAnimationFrame(
        updateLever
    );
}


function stopLeverDrag() {

    if (!leverDragging)
        return;


    if (!leverCompleted) {

        leverDragging = false;

        leverProgressBar.style.width =
            "0%";

        lever.style.top =
            "20px";

        energyMessage.textContent =
            "Нужно тянуть рычаг все 3 секунды.";

    }
}


function completeLever() {

    if (leverCompleted)
        return;


    leverCompleted = true;

    leverDragging = false;


    updateEnergyUI();

    updateCameraCharacters();


    if (
        energyTarget ===
        "camera"
    ) {

        status.textContent =
            "ЭНЕРГИЯ НА КАМЕРАХ.";

    }

    else if (
        energyTarget ===
        "window"
    ) {

        status.textContent =
            "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА НА ОКНО.";

    }

    else if (
        energyTarget ===
        "incinerator"
    ) {

        status.textContent =
            "ЭНЕРГИЯ ПОДАНА НА СЖИГАТЕЛЬ.";

    }

    else if (
        energyTarget ===
        "door"
    ) {

        hideElement(cameraPanel);

        status.textContent =
            "ЭНЕРГИЯ НА ПРАВОЙ ДВЕРИ. ДВЕРЬ ЗАКРЫТА.";

    }


    setTimeout(
        function() {

            leverCompleted = false;

            leverProgressBar.style.width =
                "0%";

            lever.style.top =
                "20px";

        },
        500
    );
}


/* ПК */

lever.addEventListener(
    "mousedown",
    startLeverDrag
);

document.addEventListener(
    "mouseup",
    stopLeverDrag
);


/* ТЕЛЕФОН */

lever.addEventListener(
    "touchstart",
    startLeverDrag,
    {
        passive: false
    }
);

document.addEventListener(
    "touchend",
    stopLeverDrag
);


/* =================================================
   ОБНОВЛЕНИЕ
================================================= */

function updateEverything() {

    updateClock();

    updateNemka();

    updateLichi();

    updatePancake();

    updateDelta();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateEnergyUI();


    /*
       Верхняя шахта существует заранее,
       но кнопка появляется только NIGHT 4.
    */

    if (
        gameStarted &&
        selectedNight >= 4 &&
        currentView === "front"
    ) {

        upperVentButton.style.display =
            "block";

    } else {

        upperVentButton.style.display =
            "none";

    }


    /*
       Сжигатель.
    */

    if (
        gameStarted &&
        selectedNight >= 4 &&
        currentView === "front"
    ) {

        incineratorButton.style.display =
            "block";

    } else {

        incineratorButton.style.display =
            "none";

    }

}


/* =================================================
   ЗВУК
================================================= */

function playSound(audio) {

    if (!audio)
        return;


    try {

        audio.pause();

        audio.currentTime = 0;

        audio
            .play()
            .catch(() => {});

    } catch(e) {}
}


/* =================================================
   GAME OVER
================================================= */

function loseGame(
    reason = "Ты проиграл."
) {

    if (gameOver)
        return;


    gameOver = true;

    stopGameTimer();


    loseReason.textContent =
        reason;


    try {

        humAudio.pause();

        ventAudio.pause();

        playSound(
            screamAudio
        );

    } catch(e) {}


    showElement(
        gameOverScreen,
        "flex"
    );
}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished = true;

    stopGameTimer();


    try {

        humAudio.pause();

        ventAudio.pause();

    } catch(e) {}


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


    showElement(
        winScreen,
        "flex"
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
   МЕНЮ ПОСЛЕ ПРОИГРЫША
================================================= */

document
.getElementById("menuAfterLose")
.addEventListener(
    "click",
    function() {

        stopGameTimer();

        hideElement(game);

        hideElement(
            gameOverScreen
        );

        showElement(
            mainMenu,
            "flex"
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

        hideElement(game);

        hideElement(
            winScreen
        );

        showElement(
            mainMenu,
            "flex"
        );

        renderNights();

    }
);


/* =================================================
   НАЧАЛЬНОЕ СОСТОЯНИЕ
================================================= */

hideElement(nightsMenu);
hideElement(settingsMenu);
hideElement(phoneScreen);
hideElement(game);
hideElement(cameraPanel);
hideElement(energyPanel);
hideElement(backupPanel);
hideElement(gameOverScreen);
hideElement(winScreen);


showElement(
    mainMenu,
    "flex"
);


renderNights();


energyTarget =
    "camera";


updateEnergyUI();
