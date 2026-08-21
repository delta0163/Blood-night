
/* =========================================================
   BLOOD GLOW NIGHT
   ПОЛНАЯ ВЕРСИЯ

   ЛИЧИ
   ПАНКЕЙК
   НЕМКА
   ЭНЕРГИЯ
   ПРАВАЯ ДВЕРЬ
   АВАРИЯ СВЕТА
   МИНИ-ИГРА ПРОВОДОВ
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

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

const nemkaAudio =
    document.getElementById("nemkaAudio");

const meowAudio =
    document.getElementById("meowAudio");

const screamAudio =
    document.getElementById("screamAudio");

const wireAudio =
    document.getElementById("wireAudio");

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const pancake =
    document.getElementById("pancake");

const nemka =
    document.getElementById("nemka");

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

const cameraImage =
    document.getElementById("cameraImage");

const cameraNumber =
    document.getElementById("cameraNumber");

const cameraLichi =
    document.getElementById("cameraLichi");

const cameraPancake =
    document.getElementById("cameraPancake");

const cameraNemka =
    document.getElementById("cameraNemka");

const energyPanel =
    document.getElementById("energyPanel");

const energyTargetText =
    document.getElementById("energyTargetText");

const energyMessage =
    document.getElementById("energyMessage");

const lever =
    document.getElementById("lever");

const leverProgressBar =
    document.getElementById("leverProgressBar");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");

const wirePanel =
    document.getElementById("wirePanel");

const wireStatus =
    document.getElementById("wireStatus");

const meowButton =
    document.getElementById("meowButton");


/* =========================================================
   SHOW / HIDE
========================================================= */

function showElement(element, display = "flex") {

    if (!element) return;

    element.classList.remove("hidden");
    element.style.display = display;

}


function hideElement(element) {

    if (!element) return;

    element.classList.add("hidden");
    element.style.display = "none";

}


/* =========================================================
   PROGRESS
========================================================= */

let completedNight =
    Number(
        localStorage.getItem(
            "bloodGlowNightCompleted"
        )
    ) || 0;

let selectedNight = 1;


/* =========================================================
   GAME STATE
========================================================= */

let gameStarted = false;
let gameOver = false;
let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";
let currentCamera = "cam01";

let flashCooldown = false;


/* =========================================================
   ENERGY

   camera
   window
   rightDoor
========================================================= */

let energyTarget = "camera";

let leverDragging = false;
let leverStartTime = 0;

let leverCompleted = false;

const LEVER_TIME = 3000;


/* =========================================================
   LIGHT SYSTEM
========================================================= */

let lightsOff = false;
let wireRepairActive = false;


/* =========================================================
   ЛИЧИ
========================================================= */

let lichiPosition = 0;


/*
   0 = далеко
   1 = путь
   2 = левый коридор
   3 = близко
   4 = атака
*/


/* =========================================================
   ПАНКЕЙК
========================================================= */

let pancakePosition = 0;


/*
   0 = нет
   1 = путь
   2 = возле окна
   3 = ломает окно
*/

let pancakeAttackTimer = null;


/* =========================================================
   НЕМКА
========================================================= */

let nemkaActive = false;

let nemkaPosition = 0;

let nemkaLastMoveMinute = -1;


/*
   0 = ещё далеко
   1 = CAM 03
   2 = CAM 04
   3 = CAM 05
   4 = CAM 06
   5 = CAM 07

   После CAM 07 отключает свет.
*/


/* =========================================================
   КАМЕРЫ
========================================================= */

const cameraImages = {

    cam01: "images/cam01.png",
    cam02: "images/cam02.png",
    cam03: "images/cam03.png",
    cam04: "images/cam04.png",
    cam05: "images/cam05.png",
    cam06: "images/cam06.png",
    cam07: "images/cam07.png"

};


const lichiCameraPositions = {

    1: "cam01",
    2: "cam02",
    3: "cam06",
    4: "cam06"

};


const pancakeCameraPositions = {

    1: "cam04",
    2: "cam05"

};


const nemkaCameraPositions = {

    1: "cam03",
    2: "cam04",
    3: "cam05",
    4: "cam06",
    5: "cam07"

};


/* =========================================================
   ОФИС
========================================================= */

const officeViews = {

    front:
        "images/office_front.png",

    left:
        "images/office_left.png",

    right:
        "images/office_right.png"

};


/*
   Фон правой двери при включённой энергии.
*/

const rightDoorEnergyView =
    "images/office_right_closed.png";


/* =========================================================
   ДЛИТЕЛЬНОСТЬ НОЧИ
========================================================= */

function getNightDurationMinutes() {

    return 4 + selectedNight;

}


/*
   ВАЖНО:

   Ночь всегда идёт
   от 12:00 до 6:00.

   360 игровых минут.
*/

function getGameMinuteTime() {

    return (
        getNightDurationMinutes()
        * 60
        * 1000
        / 360
    );

}


let gameTimer = null;


/* =========================================================
   MENU
========================================================= */

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
    function () {

        hideElement(nightsMenu);

        showElement(
            mainMenu,
            "flex"
        );

    }
);


/* =========================================================
   НОЧИ
========================================================= */

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


/* =========================================================
   SETTINGS
========================================================= */

document
.getElementById("settingsButton")
.addEventListener(
    "click",
    function () {

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
    function () {

        hideElement(settingsMenu);

        showElement(
            mainMenu,
            "flex"
        );

    }
);


/* =========================================================
   FULLSCREEN
========================================================= */

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

    } catch (e) {}

}


document
.getElementById("fullscreenButton")
.addEventListener(
    "click",
    enterFullscreen
);


/* =========================================================
   RESET
========================================================= */

document
.getElementById("resetProgress")
.addEventListener(
    "click",
    function () {

        if (
            !confirm(
                "Сбросить весь прогресс?"
            )
        ) return;

        completedNight = 0;

        localStorage.removeItem(
            "bloodGlowNightCompleted"
        );

        renderNights();

        alert("Прогресс сброшен.");

    }
);


/* =========================================================
   START NIGHT
========================================================= */

function startSelectedNight() {

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    pancakeAttackTimer = null;

    hideElement(mainMenu);
    hideElement(nightsMenu);
    hideElement(settingsMenu);

    hideElement(gameOverScreen);
    hideElement(winScreen);
    hideElement(cameraPanel);
    hideElement(energyPanel);
    hideElement(wirePanel);

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

    lichiPosition = 0;

    pancakePosition = 0;

    nemkaActive = false;
    nemkaPosition = 0;
    nemkaLastMoveMinute = -1;

    lightsOff = false;
    wireRepairActive = false;

    energyTarget = "camera";

    leverDragging = false;
    leverCompleted = false;

    leverProgressBar.style.width = "0%";
    lever.style.top = "20px";


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


    lichi.style.display = "none";
    pancake.style.display = "none";
    nemka.style.display = "none";

    cameraLichi.style.display = "none";
    cameraPancake.style.display = "none";
    cameraNemka.style.display = "none";


    updateEnergyUI();


    try {

        phoneAudio.pause();
        phoneAudio.currentTime = 0;

        const p = phoneAudio.play();

        if (p) p.catch(() => {});

    } catch (e) {}

}


/* =========================================================
   PHONE
========================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function () {

        try {

            phoneAudio.pause();
            phoneAudio.currentTime = 0;

        } catch (e) {}

        startNightAfterPhone();

    }
);


phoneAudio.addEventListener(
    "ended",
    function () {

        startNightAfterPhone();

    }
);


/* =========================================================
   AFTER PHONE
========================================================= */

function startNightAfterPhone() {

    if (gameStarted)
        return;

    gameStarted = true;

    hideElement(phoneScreen);

    showElement(game, "block");

    try {

        humAudio.currentTime = 0;

        const p = humAudio.play();

        if (p) p.catch(() => {});

    } catch (e) {}

    updateEverything();

    startGameTimer();

}


/* =========================================================
   TIMER
========================================================= */

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

                /*
                   Если свет выключен,
                   время продолжает идти,
                   но системы не работают.
                */

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

    if (gameTimer) {

        clearInterval(gameTimer);

        gameTimer = null;

    }

}


/* =========================================================
   CLOCK
========================================================= */

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


/* =========================================================
   CHARACTERS
========================================================= */

function moveCharacters() {

    /*
       =============================================
       ЛИЧИ
       =============================================
    */

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;

    if (
        gameMinutes >= 30 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (lichiPosition < 4) {

            lichiPosition++;

            playAudio(lichiAudio);

        }

    }


    /*
       =============================================
       ПАНКЕЙК
       =============================================
    */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const pancakeSpeed =
            selectedNight === 2
                ? 55
                : 45;

        if (
            gameMinutes % pancakeSpeed === 0
        ) {

            if (pancakePosition < 3) {

                pancakePosition++;

                playAudio(pancakeAudio);

            }

        }

    }


    /*
       =============================================
       НЕМКА
       NIGHT 3+
       =============================================
    */

    updateNemka();


    /*
       =============================================
       ЛИЧИ АТАКА
       =============================================
    */

    if (
        lichiPosition >= 4 &&
        !gameOver
    ) {

        setTimeout(
            function () {

                if (
                    lichiPosition >= 4 &&
                    !gameOver
                ) {

                    loseGame();

                }

            },
            1200
        );

    }


    /*
       =============================================
       ПАНКЕЙК АТАКА
       =============================================
    */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3
    ) {

        startPancakeAttack();

    }

}


/* =========================================================
   НЕМКА
========================================================= */

function updateNemka() {

    /*
       Только с третьей ночи.
    */

    if (selectedNight < 3)
        return;


    /*
       До 3:00 она НЕ активна.
    */

    if (gameMinutes < 180) {

        nemkaActive = false;

        return;

    }


    /*
       После 5:00 она больше
       не должна продвигаться.
    */

    if (gameMinutes > 300)
        return;


    nemkaActive = true;


    /*
       Каждые 15 игровых минут
       она двигается вперёд.

       Максимум CAM 07.
    */

    if (
        gameMinutes % 15 === 0 &&
        gameMinutes !== nemkaLastMoveMinute
    ) {

        nemkaLastMoveMinute =
            gameMinutes;

        if (
            nemkaPosition < 5
        ) {

            nemkaPosition++;

            playAudio(nemkaAudio);

        }


        /*
           CAM 07 достигнута.
        */

        if (
            nemkaPosition >= 5
        ) {

            turnLightsOff();

        }

    }

}


/* =========================================================
   НЕМКА ОТКЛЮЧАЕТ СВЕТ
========================================================= */

function turnLightsOff() {

    if (lightsOff)
        return;

    lightsOff = true;

    wireRepairActive = true;

    hideElement(cameraPanel);
    hideElement(energyPanel);

    status.textContent =
        "СВЕТ ОТКЛЮЧЕН! ПРОВЕРЬ ПРОВОДА!";

    try {

        humAudio.pause();

    } catch (e) {}

    /*
       Через короткое время
       открываем мини-игру.
    */

    setTimeout(
        function () {

            if (
                gameOver ||
                nightFinished
            )
                return;

            showWireGame();

        },
        700
    );

}


/* =========================================================
   ПРОВОДА
========================================================= */

let selectedWire = null;

let connectedWires = 0;


function showWireGame() {

    if (!lightsOff)
        return;

    if (gameOver)
        return;

    connectedWires = 0;
    selectedWire = null;

    document
    .querySelectorAll(".wire")
    .forEach(
        function (wire) {

            wire.classList.remove(
                "selected"
            );

            wire.classList.remove(
                "connected"
            );

        }
    );

    wireStatus.textContent =
        "Выберите провод слева.";

    showElement(
        wirePanel,
        "flex"
    );

}


document
.querySelectorAll(
    "#wireLeft .wire"
)
.forEach(
    function (wire) {

        wire.addEventListener(
            "click",
            function () {

                if (wire.classList.contains("connected"))
                    return;

                selectedWire = wire.dataset.wire;

                document
                .querySelectorAll(
                    "#wireLeft .wire"
                )
                .forEach(
                    function (w) {

                        w.classList.remove(
                            "selected"
                        );

                    }
                );

                wire.classList.add(
                    "selected"
                );

                wireStatus.textContent =
                    "Теперь выберите такой же провод справа.";

            }
        );

    }
);


document
.querySelectorAll(
    "#wireRight .wire"
)
.forEach(
    function (wire) {

        wire.addEventListener(
            "click",
            function () {

                if (!selectedWire)
                    return;

                if (
                    wire.dataset.wire ===
                    selectedWire
                ) {

                    wire.classList.add(
                        "connected"
                    );

                    const left =
                        document.querySelector(
                            "#wireLeft .wire.selected"
                        );

                    if (left) {

                        left.classList.remove(
                            "selected"
                        );

                        left.classList.add(
                            "connected"
                        );

                    }

                    connectedWires++;

                    selectedWire = null;

                    playAudio(wireAudio);

                    wireStatus.textContent =
                        "Соединение правильное.";

                    if (
                        connectedWires >= 4
                    ) {

                        repairPower();

                    }

                } else {

                    wireStatus.textContent =
                        "Неверный провод. Попробуйте снова.";

                    selectedWire = null;

                    document
                    .querySelectorAll(
                        "#wireLeft .wire"
                    )
                    .forEach(
                        function (w) {

                            w.classList.remove(
                                "selected"
                            );

                        }
                    );

                }

            }
        );

    }
);


/* =========================================================
   РЕМОНТ ПИТАНИЯ
========================================================= */

function repairPower() {

    lightsOff = false;

    wireRepairActive = false;

    hideElement(wirePanel);

    status.textContent =
        "ПИТАНИЕ ВОССТАНОВЛЕНО.";

    /*
       Немка после отключения света
       отступает обратно.
    */

    nemkaPosition = 0;

    nemkaActive = true;

    nemkaLastMoveMinute =
        gameMinutes;

    try {

        humAudio.currentTime = 0;

        const p = humAudio.play();

        if (p) p.catch(() => {});

    } catch (e) {}

    updateEverything();

}


/* =========================================================
   ПАНКЕЙК
========================================================= */

function startPancakeAttack() {

    if (gameOver)
        return;

    if (pancakeAttackTimer)
        return;


    if (
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left =
            "50%";

        pancake.style.top =
            "50%";

        pancake.style.width =
            "300px";

    }


    status.textContent =
        "ПАНКЕЙК ЛОМАЕТ ПЕРЕДНЕЕ ОКНО!";


    playAudio(pancakeAudio);


    pancakeAttackTimer =
        setTimeout(
            function () {

                pancakeAttackTimer =
                    null;

                if (gameOver)
                    return;


                if (
                    energyTarget !== "window"
                ) {

                    loseGame();

                    return;

                }


                pancakePosition = 0;

                pancake.style.display =
                    "none";

                status.textContent =
                    "ПАНКЕЙК ОТБРОШЕН ЭНЕРГИЕЙ!";

            },
            10000
        );

}


/* =========================================================
   OFFICE VIEW
========================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;

    if (lightsOff)
        return;

    if (!officeViews[direction])
        return;


    currentView =
        direction;


    /*
       Если смотрим вправо и энергия
       направлена на дверь —
       используем закрытый фон.
    */

    if (
        direction === "right" &&
        energyTarget === "rightDoor"
    ) {

        view.style.backgroundImage =
            `url("${rightDoorEnergyView}")`;

        status.textContent =
            "ПРАВАЯ ДВЕРЬ ЗАКРЫТА";

    } else {

        view.style.backgroundImage =
            `url("${officeViews[direction]}")`;

        if (direction === "left") {

            status.textContent =
                "ЛЕВЫЙ КОРИДОР";

        } else if (direction === "right") {

            status.textContent =
                "ПРАВЫЙ КОРИДОР";

        } else {

            status.textContent =
                "ОФИС";

        }

    }


    updateOfficeCharacters();

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


/* =========================================================
   OFFICE CHARACTERS
========================================================= */

function updateOfficeCharacters() {

    lichi.style.display = "none";
    pancake.style.display = "none";
    nemka.style.display = "none";


    if (lightsOff)
        return;


    /*
       Личи.
    */

    if (
        lichiPosition >= 2 &&
        currentView === "left"
    ) {

        lichi.style.display =
            "block";

        if (lichiPosition === 2) {

            lichi.style.left = "75%";
            lichi.style.top = "50%";
            lichi.style.width = "130px";

        } else if (
            lichiPosition === 3
        ) {

            lichi.style.left = "58%";
            lichi.style.top = "50%";
            lichi.style.width = "190px";

        } else {

            lichi.style.left = "50%";
            lichi.style.top = "50%";
            lichi.style.width = "270px";

        }

    }


    /*
       Панкейк.
    */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left = "50%";
        pancake.style.top = "50%";
        pancake.style.width = "300px";

        return;

    }


    if (
        selectedNight >= 2 &&
        pancakePosition === 2 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left = "75%";
        pancake.style.top = "55%";
        pancake.style.width = "180px";

    }

}


/* =========================================================
   CAMERAS
========================================================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (lightsOff) {

            status.textContent =
                "СВЕТ ОТКЛЮЧЕН. КАМЕРЫ НЕ РАБОТАЮТ.";

            return;

        }


        if (
            energyTarget !== "camera"
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
    function () {

        hideElement(cameraPanel);

        view.style.backgroundImage =
            `url("${officeViews[currentView]}")`;

        updateOfficeCharacters();

    }
);


/* =========================================================
   SHOW CAMERA
========================================================= */

function showCamera(camera) {

    if (lightsOff)
        return;

    currentCamera = camera;

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


/* =========================================================
   CAMERA BUTTONS
========================================================= */

document
.querySelectorAll(
    "#cameraMap [data-camera]"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                if (lightsOff)
                    return;

                if (
                    energyTarget !== "camera"
                )
                    return;

                showCamera(
                    button.dataset.camera
                );

            }
        );

    }
);


/* =========================================================
   CAMERA CHARACTERS
========================================================= */

function updateCameraCharacters() {

    cameraLichi.style.display = "none";
    cameraPancake.style.display = "none";
    cameraNemka.style.display = "none";


    if (lightsOff)
        return;

    if (
        energyTarget !== "camera"
    )
        return;


    /*
       Личи.
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

    }


    /*
       Панкейк.
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

        }

    }


    /*
       Немка.
    */

    if (
        selectedNight >= 3 &&
        nemkaActive
    ) {

        const nemkaCam =
            nemkaCameraPositions[
                nemkaPosition
            ];

        if (
            nemkaCam === currentCamera
        ) {

            cameraNemka.style.display =
                "block";

        }

    }

}


/* =========================================================
   МЯУКАНЬЕ
========================================================= */

meowButton.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (gameOver)
            return;

        if (lightsOff) {

            status.textContent =
                "СВЕТ ОТКЛЮЧЕН. МЯУКАНЬЕ НЕ РАБОТАЕТ.";

            return;

        }


        /*
           До 3:00 Немка не активна.
        */

        if (
            selectedNight < 3 ||
            !nemkaActive ||
            gameMinutes < 180
        ) {

            status.textContent =
                "МЯУКАНЬЕ ПОКА НЕ РАБОТАЕТ.";

            return;

        }


        /*
           Мяукаем в выбранную
           камеру.
        */

        playAudio(meowAudio);


        const nemkaCam =
            nemkaCameraPositions[
                nemkaPosition
            ];


        if (
            nemkaCam === currentCamera
        ) {

            /*
               Немка услышала кота.
            */

            status.textContent =
                "МЯУКАНЬЕ! НЕМКА ПОБЕЖАЛА НА ЗВУК!";

            playAudio(nemkaAudio);

            nemkaPosition = 0;

            nemkaLastMoveMinute =
                gameMinutes;

            updateCameraCharacters();

        } else {

            status.textContent =
                "МЯУКАНЬЕ ПРОЗВУЧАЛО В CAM " +
                currentCamera
                .replace("cam", "");

        }

    }
);


/* =========================================================
   FLASH
========================================================= */

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

    if (lightsOff) {

        status.textContent =
            "СВЕТ ОТКЛЮЧЕН. ВСПЫШКА НЕ РАБОТАЕТ.";

        return;

    }

    if (flashCooldown)
        return;

    if (
        energyTarget !== "camera"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ: ЭНЕРГИЯ НЕ НА КАМЕРЕ.";

        return;

    }

    if (
        currentView !== "left"
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


    flashCooldown = true;

    flash.style.opacity = "1";

    setTimeout(
        function () {

            flash.style.opacity = "0";

        },
        120
    );


    playAudio(flashAudio);


    lichiPosition = 0;

    lichi.style.display = "none";

    cameraLichi.style.display = "none";


    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


    setTimeout(
        function () {

            flashCooldown = false;

        },
        1500
    );

}


/* =========================================================
   ENERGY PANEL
========================================================= */

document
.getElementById("energyButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (lightsOff) {

            status.textContent =
                "СВЕТ ОТКЛЮЧЕН. ЭНЕРГИЯ НЕ РАБОТАЕТ.";

            return;

        }

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
    function () {

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


/* =========================================================
   ENERGY UI
========================================================= */

function updateEnergyUI() {

    if (
        energyTarget === "camera"
    ) {

        energyTargetText.textContent =
            "КАМЕРА";

        energyMessage.textContent =
            "Камеры и вспышка работают.";

    }

    else if (
        energyTarget === "window"
    ) {

        energyTargetText.textContent =
            "ОКНО";

        energyMessage.textContent =
            "Защита переднего окна работает.";

    }

    else {

        energyTargetText.textContent =
            "ПРАВАЯ ДВЕРЬ";

        energyMessage.textContent =
            "Правая дверь закрыта.";

    }

}


/* =========================================================
   ENERGY LEVER
========================================================= */

function startLeverDrag(event) {

    if (!gameStarted)
        return;

    if (lightsOff)
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
            elapsed / LEVER_TIME,
            1
        );


    const maxTop = 95;

    lever.style.top =
        (
            20 +
            maxTop * progress
        ) + "px";


    leverProgressBar.style.width =
        (
            progress * 100
        ) + "%";


    if (progress >= 1) {

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
            "Нужно тянуть рычаг 3 секунды.";

    }

}


function completeLever() {

    if (leverCompleted)
        return;

    leverCompleted = true;

    leverDragging = false;


    /*
       Три направления.
    */

    if (
        energyTarget === "camera"
    ) {

        energyTarget = "window";

    }

    else if (
        energyTarget === "window"
    ) {

        energyTarget = "rightDoor";

    }

    else {

        energyTarget = "camera";

    }


    updateEnergyUI();

    updateCameraCharacters();


    /*
       Если энергия ушла с камеры —
       камера закрывается.
    */

    if (
        energyTarget !== "camera"
    ) {

        hideElement(cameraPanel);

    }


    /*
       Если включили правую дверь,
       сразу меняем фон, если игрок смотрит вправо.
    */

    if (
        currentView === "right"
    ) {

        if (
            energyTarget === "rightDoor"
        ) {

            view.style.backgroundImage =
                `url("${rightDoorEnergyView}")`;

            status.textContent =
                "ПРАВАЯ ДВЕРЬ ЗАКРЫТА";

        } else {

            view.style.backgroundImage =
                `url("${officeViews.right}")`;

            status.textContent =
                "ПРАВЫЙ КОРИДОР";

        }

    }


    setTimeout(
        function () {

            leverCompleted = false;

            leverProgressBar.style.width =
                "0%";

            lever.style.top =
                "20px";

        },
        500
    );

}


/* =========================================================
   LEVER EVENTS
========================================================= */

lever.addEventListener(
    "mousedown",
    startLeverDrag
);

document.addEventListener(
    "mouseup",
    stopLeverDrag
);


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


/* =========================================================
   AUDIO
========================================================= */

function playAudio(audio) {

    if (!audio)
        return;

    try {

        audio.currentTime = 0;

        const promise =
            audio.play();

        if (promise)
            promise.catch(
                () => {}
            );

    } catch (e) {}

}


/* =========================================================
   UPDATE
========================================================= */

function updateEverything() {

    updateClock();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateEnergyUI();

}


/* =========================================================
   GAME OVER
========================================================= */

function loseGame() {

    if (gameOver)
        return;

    gameOver = true;

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    pancakeAttackTimer = null;

    try {

        humAudio.pause();

    } catch (e) {}


    playAudio(screamAudio);

    showElement(
        gameOverScreen,
        "flex"
    );

}


/* =========================================================
   WIN
========================================================= */

function winGame() {

    if (nightFinished)
        return;

    nightFinished = true;

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );


    try {

        humAudio.pause();

    } catch (e) {}


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


    showElement(
        winScreen,
        "flex"
    );

}


/* =========================================================
   NEXT NIGHT
========================================================= */

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


/* =========================================================
   RESTART
========================================================= */

document
.getElementById("restart")
.addEventListener(
    "click",
    function () {

        startSelectedNight();

    }
);


/* =========================================================
   MENU AFTER LOSE
========================================================= */

document
.getElementById("menuAfterLose")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

        hideElement(game);

        hideElement(gameOverScreen);

        showElement(
            mainMenu,
            "flex"
        );

        renderNights();

    }
);


/* =========================================================
   MENU AFTER WIN
========================================================= */

document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

        hideElement(game);

        hideElement(winScreen);

        showElement(
            mainMenu,
            "flex"
        );

        renderNights();

    }
);


/* =========================================================
   INITIAL STATE
========================================================= */

hideElement(nightsMenu);
hideElement(settingsMenu);
hideElement(phoneScreen);
hideElement(game);
hideElement(cameraPanel);
hideElement(energyPanel);
hideElement(wirePanel);
hideElement(gameOverScreen);
hideElement(winScreen);

showElement(
    mainMenu,
    "flex"
);

renderNights();

energyTarget = "camera";

updateEnergyUI();
