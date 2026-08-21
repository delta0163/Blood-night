/* =================================================
   BLOOD GLOW NIGHT
   NIGHT 1-13

   ЛИЧИ
   ПАНКЕЙК
   НЕМКА
   ЭНЕРГИЯ: КАМЕРА / ОКНО / ПРАВАЯ ДВЕРЬ
================================================= */


/* ================= ЭЛЕМЕНТЫ ================= */

const mainMenu =
    document.getElementById("mainMenu");

const nightsMenu =
    document.getElementById("nightsMenu");

const settingsMenu =
    document.getElementById("settingsMenu");

const nightsList =
    document.getElementById("nightsList");

const game =
    document.getElementById("game");

const phoneScreen =
    document.getElementById("phoneScreen");

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

const catAudio =
    document.getElementById("catAudio");

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

const catButton =
    document.getElementById("catButton");


/* ================= ПРОГРЕСС ================= */

let completedNight =
    Number(
        localStorage.getItem(
            "bloodGlowNightCompleted"
        )
    ) || 0;

let selectedNight = 1;


/* ================= СОСТОЯНИЕ ================= */

let gameStarted = false;
let gameOver = false;
let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";
let currentCamera = "cam01";

let flashCooldown = false;


/* ================= ЭНЕРГИЯ ================= */

/*
   camera
   window
   rightDoor
*/

let energyTarget = "camera";

let leverDragging = false;
let leverStartTime = 0;
let leverCompleted = false;

const LEVER_TIME = 3000;


/* ================= ЛИЧИ ================= */

let lichiPosition = 0;


/*
   0 = далеко
   1 = путь
   2 = коридор
   3 = рядом
   4 = атака
*/


/* ================= ПАНКЕЙК ================= */

let pancakePosition = 0;

let pancakeAttackTimer = null;


/*
   0 = отсутствует
   1 = путь
   2 = возле окна
   3 = ломает окно
*/


/* ================= НЕМКА ================= */

let nemkaPosition = 0;

let nemkaTargetCamera = "cam01";

let nemkaMoveTimer = null;


/*
   0 = отсутствует
   1 = появилась
   2 = движется
   3 = возле щитка
   4 = отключила свет
*/


/* ================= КАМЕРЫ ================= */

const cameraImages = {

    cam01: "images/cam01.png",
    cam02: "images/cam02.png",
    cam03: "images/cam03.png",
    cam04: "images/cam04.png",
    cam05: "images/cam05.png",
    cam06: "images/cam06.png",
    cam07: "images/cam07.png"

};


/* ================= ПОЗИЦИИ ================= */

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


/* Немка может находиться
   в любой выбранной комнате */

const nemkaCameraPositions = {

    1: "cam02",
    2: "cam03",
    3: "cam04",
    4: "cam05",
    5: "cam06",
    6: "cam07"

};


/* ================= ОФИС ================= */

const officeViews = {

    front:
        "images/office_front.png",

    left:
        "images/office_left.png",

    right:
        "images/office_right.png"

};


/*
   Когда энергия идёт
   на правую дверь,
   фон меняется.
*/

const rightDoorClosed =
    "images/office_right_closed.png";


/* ================= ВРЕМЯ ================= */

function getNightDurationMinutes() {

    return 4 + selectedNight;

}


/*
   360 игровых минут
   проходят за длительность ночи.
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


/* ================= SHOW / HIDE ================= */

function showElement(
    element,
    display = "flex"
) {

    if (!element)
        return;

    element.classList.remove(
        "hidden"
    );

    element.style.display =
        display;

}


function hideElement(element) {

    if (!element)
        return;

    element.classList.add(
        "hidden"
    );

    element.style.display =
        "none";

}


/* ================= МЕНЮ ================= */

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
            nightsMenu
        );

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function () {

        hideElement(nightsMenu);

        showElement(mainMenu);

    }
);


/* ================= НОЧИ ================= */

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

        button.className =
            "nightButton";

        const unlocked =
            i === 1 ||
            i <= completedNight + 1;

        if (!unlocked) {

            button.classList.add(
                "locked"
            );

            button.textContent =
                "🔒 NIGHT " + i;

            button.disabled =
                true;

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

        nightsList.appendChild(
            button
        );

    }

}


/* ================= НАСТРОЙКИ ================= */

document
.getElementById("settingsButton")
.addEventListener(
    "click",
    function () {

        hideElement(mainMenu);

        showElement(
            settingsMenu
        );

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function () {

        hideElement(
            settingsMenu
        );

        showElement(
            mainMenu
        );

    }
);


/* ================= FULLSCREEN ================= */

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

    } catch (e) {

        console.log(e);

    }

}


document
.getElementById("fullscreenButton")
.addEventListener(
    "click",
    enterFullscreen
);


/* ================= RESET ================= */

document
.getElementById("resetProgress")
.addEventListener(
    "click",
    function () {

        if (
            !confirm(
                "Сбросить весь прогресс?"
            )
        )
            return;

        completedNight = 0;

        localStorage.removeItem(
            "bloodGlowNightCompleted"
        );

        renderNights();

    }
);


/* ================= НАЧАЛО НОЧИ ================= */

function startSelectedNight() {

    stopGameTimer();

    clearTimeout(
        pancakeAttackTimer
    );

    clearTimeout(
        nemkaMoveTimer
    );

    pancakeAttackTimer =
        null;

    nemkaMoveTimer =
        null;


    hideElement(mainMenu);
    hideElement(nightsMenu);
    hideElement(settingsMenu);

    hideElement(gameOverScreen);
    hideElement(winScreen);
    hideElement(cameraPanel);
    hideElement(energyPanel);

    showElement(
        phoneScreen
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

    /*
       Немка начинает только
       с третьей ночи.
    */

    nemkaPosition =
        selectedNight >= 3
            ? 1
            : 0;

    nemkaTargetCamera =
        "cam02";


    energyTarget =
        "camera";


    leverDragging = false;
    leverCompleted = false;

    leverProgressBar.style.width =
        "0%";

    lever.style.top =
        "20px";


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


    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    nemka.style.display =
        "none";


    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";

    cameraNemka.style.display =
        "none";


    updateEnergyUI();


    try {

        phoneAudio.currentTime = 0;

        const p =
            phoneAudio.play();

        if (p)
            p.catch(() => {});

    } catch (e) {}

}


/* ================= ПРОПУСК ЗВОНКА ================= */

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
    startNightAfterPhone
);


/* ================= ПОСЛЕ ЗВОНКА ================= */

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

        const p =
            humAudio.play();

        if (p)
            p.catch(() => {});

    } catch (e) {}


    updateEverything();

    startGameTimer();

}


/* ================= ТАЙМЕР ================= */

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

    if (gameTimer) {

        clearInterval(
            gameTimer
        );

        gameTimer = null;

    }

}


/* ================= ЧАСЫ ================= */

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


/* ================= ДВИЖЕНИЕ ================= */

function moveCharacters() {


    /* ---------- ЛИЧИ ---------- */

    const lichiSpeed =
        selectedNight === 1
            ? 45
            : 30;


    if (
        gameMinutes >= 30 &&
        gameMinutes % lichiSpeed === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

            playSound(
                lichiAudio
            );

        }

    }


    /* ---------- ПАНКЕЙК ---------- */

    if (
        selectedNight >= 2 &&
        gameMinutes >= 90
    ) {

        const speed =
            selectedNight === 2
                ? 55
                : 45;


        if (
            gameMinutes % speed === 0 &&
            pancakePosition < 3
        ) {

            pancakePosition++;

            playSound(
                pancakeAudio
            );

        }

    }


    /* ---------- НЕМКА ---------- */

    if (
        selectedNight >= 3
    ) {

        moveNemka();

    }


    /* ---------- ЛИЧИ АТАКА ---------- */

    if (
        lichiPosition >= 4
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


    /* ---------- ПАНКЕЙК ---------- */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3
    ) {

        startPancakeAttack();

    }

}


/* ================= НЕМКА ================= */

function moveNemka() {

    if (
        nemkaPosition <= 0
    )
        return;


    /*
       Немка постепенно
       перемещается по камерам.
    */

    if (
        gameMinutes >= 120 &&
        gameMinutes % 35 === 0
    ) {

        if (
            nemkaPosition < 4
        ) {

            nemkaPosition++;

        }


        /*
           После 4 она возле щитка.
        */

        if (
            nemkaPosition >= 4
        ) {

            nemkaPosition = 4;

            status.textContent =
                "НЕМКА ИДЁТ К ЭЛЕКТРОЩИТКУ!";

        }

    }


    /*
       Если она дошла до щитка,
       отключаем свет.
    */

    if (
        nemkaPosition >= 4
    ) {

        if (
            gameMinutes % 35 === 0
        ) {

            nemkaPosition = 5;

            status.textContent =
                "НЕМКА ОТКЛЮЧИЛА СВЕТ!";

            /*
               Немка не выключает
               саму игру.
            */

        }

    }

}


/* ================= ПАНКЕЙК АТАКА ================= */

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


/* ================= ПОВОРОТЫ ================= */

function changeView(direction) {

    if (!gameStarted || gameOver)
        return;


    currentView =
        direction;


    updateOfficeBackground();


    if (
        direction === "left"
    ) {

        status.textContent =
            "ЛЕВЫЙ КОРИДОР";

    }

    else if (
        direction === "right"
    ) {

        if (
            energyTarget === "rightDoor"
        ) {

            status.textContent =
                "ПРАВАЯ ДВЕРЬ ЗАКРЫТА";

        } else {

            status.textContent =
                "ПРАВАЯ СТОРОНА";

        }

    }

    else {

        status.textContent =
            "ОФИС";

    }


    updateOfficeCharacters();

}


function updateOfficeBackground() {

    /*
       Только правая сторона
       меняет изображение,
       когда энергия на двери.
    */

    if (
        currentView === "right" &&
        energyTarget === "rightDoor"
    ) {

        view.style.backgroundImage =
            `url("${rightDoorClosed}")`;

        return;

    }


    view.style.backgroundImage =
        `url("${officeViews[currentView]}")`;

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


/* ================= ПЕРСОНАЖИ В ОФИСЕ ================= */

function updateOfficeCharacters() {

    lichi.style.display =
        "none";

    pancake.style.display =
        "none";

    nemka.style.display =
        "none";


    /* ЛИЧИ */

    if (
        lichiPosition >= 2 &&
        currentView === "left"
    ) {

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


    /* ПАНКЕЙК */

    if (
        selectedNight >= 2 &&
        pancakePosition >= 3 &&
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

        return;

    }


    if (
        selectedNight >= 2 &&
        pancakePosition === 2 &&
        currentView === "front"
    ) {

        pancake.style.display =
            "block";

        pancake.style.left =
            "75%";

        pancake.style.top =
            "55%";

        pancake.style.width =
            "180px";

    }

}


/* ================= КАМЕРЫ ================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;


        /*
           Камеры отключены,
           если энергия не на камере.
        */

        if (
            energyTarget !== "camera"
        ) {

            status.textContent =
                "КАМЕРЫ ОТКЛЮЧЕНЫ: ЭНЕРГИЯ НЕ НА КАМЕРАХ.";

            return;

        }


        showElement(
            cameraPanel
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

        hideElement(
            cameraPanel
        );

        updateOfficeBackground();

        updateOfficeCharacters();

    }
);


/* ================= ПОКАЗ КАМЕРЫ ================= */

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


/* ================= КНОПКИ КАМЕР ================= */

document
.querySelectorAll(
    "#cameraMap [data-camera]"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

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


/* ================= НЕМКА: МЯУКАНЬЕ ================= */

catButton.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        if (
            energyTarget !== "camera"
        ) {

            status.textContent =
                "МЯУКАНЬЕ НЕ РАБОТАЕТ: КАМЕРЫ ОБЕСТОЧЕНЫ.";

            return;

        }


        if (
            selectedNight < 3
        ) {

            status.textContent =
                "ЭТА СИСТЕМА ЕЩЁ НЕ НУЖНА.";

            return;

        }


        /*
           Мяуканье происходит
           именно в выбранной камере.
        */

        nemkaTargetCamera =
            currentCamera;


        playSound(
            catAudio
        );


        /*
           Немка бежит
           к выбранной комнате.
        */

        nemkaPosition = 2;


        status.textContent =
            "МЯУКАНЬЕ В " +
            currentCamera.toUpperCase() +
            "! НЕМКА БЕЖИТ ТУДА.";


        updateCameraCharacters();

    }
);


/* ================= ПЕРСОНАЖИ КАМЕР ================= */

function updateCameraCharacters() {

    cameraLichi.style.display =
        "none";

    cameraPancake.style.display =
        "none";

    cameraNemka.style.display =
        "none";


    if (
        energyTarget !== "camera"
    )
        return;


    /* ЛИЧИ */

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


    /* ПАНКЕЙК */

    const pancakeCam =
        pancakeCameraPositions[
            pancakePosition
        ];

    if (
        selectedNight >= 2 &&
        pancakeCam === currentCamera
    ) {

        cameraPancake.style.display =
            "block";

    }


    /* НЕМКА */

    if (
        selectedNight >= 3 &&
        nemkaPosition > 0
    ) {

        if (
            currentCamera ===
            nemkaTargetCamera
        ) {

            cameraNemka.style.display =
                "block";

        }

    }

}


/* ================= ВСПЫШКА ================= */

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
        energyTarget !== "camera"
    ) {

        status.textContent =
            "ВСПЫШКА НЕ РАБОТАЕТ: ЭНЕРГИЯ НЕ НА КАМЕРАХ.";

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


    playSound(
        flashAudio
    );


    lichiPosition = 0;

    lichi.style.display =
        "none";

    cameraLichi.style.display =
        "none";


    status.textContent =
        "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


    setTimeout(
        function () {

            flashCooldown = false;

        },
        1500
    );

}


/* ================= ЭНЕРГИЯ ================= */

document
.getElementById("energyButton")
.addEventListener(
    "click",
    function () {

        if (!gameStarted)
            return;

        showElement(
            energyPanel
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


/* ================= ЭНЕРГИЯ UI ================= */

function updateEnergyUI() {

    if (
        energyTarget === "camera"
    ) {

        energyTargetText.textContent =
            "КАМЕРА";

        energyMessage.textContent =
            "Энергия на камерах. Вспышка и камеры работают.";

    }

    else if (
        energyTarget === "window"
    ) {

        energyTargetText.textContent =
            "ОКНО";

        energyMessage.textContent =
            "Энергия на переднем окне. Камеры и вспышка отключены.";

    }

    else {

        energyTargetText.textContent =
            "ПРАВАЯ ДВЕРЬ";

        energyMessage.textContent =
            "Энергия на правой двери. Правая дверь закрыта.";

    }


    updateOfficeBackground();

    updateCameraCharacters();

}


/* ================= РЫЧАГ ================= */

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
            maxTop * progress
        ) +
        "px";


    leverProgressBar.style.width =
        (
            progress * 100
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
            "Нужно тянуть рычаг полные 3 секунды.";

    }

}


function completeLever() {

    if (leverCompleted)
        return;


    leverCompleted = true;
    leverDragging = false;


    /*
       Круг:

       КАМЕРА
          ↓
       ОКНО
          ↓
       ПРАВАЯ ДВЕРЬ
          ↓
       КАМЕРА
    */

    if (
        energyTarget === "camera"
    ) {

        energyTarget =
            "window";

    }

    else if (
        energyTarget === "window"
    ) {

        energyTarget =
            "rightDoor";

    }

    else {

        energyTarget =
            "camera";

    }


    updateEnergyUI();


    if (
        energyTarget === "window"
    ) {

        hideElement(
            cameraPanel
        );

        status.textContent =
            "ЭНЕРГИЯ НА ПЕРЕДНЕМ ОКНЕ.";

    }

    else if (
        energyTarget === "rightDoor"
    ) {

        hideElement(
            cameraPanel
        );

        status.textContent =
            "ЭНЕРГИЯ НА ПРАВОЙ ДВЕРИ. ДВЕРЬ ЗАКРЫТА.";

    }

    else {

        status.textContent =
            "ЭНЕРГИЯ ВЕРНУЛАСЬ НА КАМЕРЫ.";

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


/* ================= СОБЫТИЯ РЫЧАГА ================= */

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


/* ================= ОБНОВЛЕНИЕ ================= */

function updateEverything() {

    updateClock();

    updateOfficeBackground();

    updateOfficeCharacters();

    updateCameraCharacters();

    updateEnergyUI();

}


/* ================= GAME OVER ================= */

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

        screamAudio.currentTime = 0;

        screamAudio
        .play()
        .catch(() => {});

    } catch (e) {}


    showElement(
        gameOverScreen
    );

}


/* ================= ПОБЕДА ================= */

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

    }

    else {

        nextNightButton.style.display =
            "block";

    }


    showElement(
        winScreen
    );

}


/* ================= СЛЕДУЮЩАЯ НОЧЬ ================= */

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


/* ================= ПОВТОР ================= */

document
.getElementById("restart")
.addEventListener(
    "click",
    function () {

        startSelectedNight();

    }
);


/* ================= МЕНЮ ПОСЛЕ ПОРАЖЕНИЯ ================= */

document
.getElementById("menuAfterLose")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

        hideElement(game);
        hideElement(gameOverScreen);

        showElement(mainMenu);

        renderNights();

    }
);


/* ================= МЕНЮ ПОСЛЕ ПОБЕДЫ ================= */

document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function () {

        stopGameTimer();

        hideElement(game);
        hideElement(winScreen);

        showElement(mainMenu);

        renderNights();

    }
);


/* ================= ЗВУК ================= */

function playSound(audio) {

    if (!audio)
        return;


    try {

        audio.currentTime = 0;

        const p =
            audio.play();

        if (p)
            p.catch(() => {});

    } catch (e) {}

}


/* ================= НАЧАЛЬНОЕ СОСТОЯНИЕ ================= */

hideElement(nightsMenu);
hideElement(settingsMenu);
hideElement(phoneScreen);
hideElement(game);
hideElement(cameraPanel);
hideElement(energyPanel);
hideElement(gameOverScreen);
hideElement(winScreen);

showElement(
    mainMenu
);

renderNights();

energyTarget =
    "camera";

updateEnergyUI();
