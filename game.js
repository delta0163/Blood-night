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

/* =========================
ЗВУКИ
========================= */

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

/* =========================
ИГРА
========================= */

const view =
document.getElementById("view");

const lichi =
document.getElementById("lichi");

const pancake =
document.getElementById("pancake");

const flash =
document.getElementById("flash");

const status =
document.getElementById("status");

const time =
document.getElementById("time");

const nightDisplay =
document.getElementById("night");

/* =========================
КАМЕРЫ
========================= */

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

/* =========================
ЭНЕРГИЯ
========================= */

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

/* =========================
GAME OVER
========================= */

const gameOverScreen =
document.getElementById("gameOver");

const winScreen =
document.getElementById("winScreen");

const winText =
document.getElementById("winText");

const nextNightButton =
document.getElementById("nextNight");

/* =========================
СКРИМЕР
========================= */

const jumpscare =
document.getElementById("jumpscare");

const jumpscareImage =
document.getElementById("jumpscareImage");

/* =========================
ПОКАЗ / СКРЫТИЕ
========================= */

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

/* =========================
ПРОГРЕСС
========================= */

let completedNight =
Number(
localStorage.getItem(
"bloodGlowNightCompleted"
)
) || 0;

let selectedNight = 1;

/* =========================
СОСТОЯНИЕ
========================= */

let gameStarted = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";

let currentCamera = "cam01";

let flashCooldown = false;

/* =========================
ЭНЕРГИЯ
========================= */

let energyTarget = "camera";

let leverDragging = false;

let leverStartTime = 0;

let leverCompleted = false;

const LEVER_TIME = 3000;

/* =========================
ПЕРСОНАЖИ
========================= */

let lichiPosition = 0;

let pancakePosition = 0;

let pancakeAttackTimer = null;

let lichiAttackTimer = null;

let jumpscareActive = false;

/* =========================
КАМЕРЫ
========================= */

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
ВРЕМЯ НОЧИ
========================= */

function getNightDurationMinutes() {

return 4 + selectedNight;

}

function getGameMinuteTime() {

return (
    getNightDurationMinutes()
    * 60
    * 1000
    / 360
);

}

let gameTimer = null;

/* =========================
МЕНЮ
========================= */

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

/* =========================
НАСТРОЙКИ
========================= */

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

/* =========================
FULLSCREEN
========================= */

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

} catch (error) {

    console.log(error);

}

}

document
.getElementById("fullscreenButton")
.addEventListener(
"click",
enterFullscreen
);

/* =========================
СБРОС
========================= */

document
.getElementById("resetProgress")
.addEventListener(
"click",
function () {

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

}

);

/* =========================
НАЧАЛО НОЧИ
========================= */

function startSelectedNight() {

stopGameTimer();

clearTimeout(
    pancakeAttackTimer
);

clearTimeout(
    lichiAttackTimer
);

pancakeAttackTimer = null;

lichiAttackTimer = null;

resetJumpscare();


hideElement(mainMenu);

hideElement(nightsMenu);

hideElement(settingsMenu);

hideElement(gameOverScreen);

hideElement(winScreen);

hideElement(cameraPanel);

hideElement(energyPanel);

hideElement(game);


showElement(
    phoneScreen,
    "flex"
);


gameStarted = false;

gameOver = false;

nightFinished = false;

gameMinutes = 0;

currentView = "front";

currentCamera = "cam01";

lichiPosition = 0;

pancakePosition = 0;

energyTarget = "camera";

leverDragging = false;

leverCompleted = false;

flashCooldown = false;


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

cameraLichi.style.display =
    "none";

cameraPancake.style.display =
    "none";


energyTargetText.textContent =
    "КАМЕРА";

energyMessage.textContent =
    "Энергия направлена на камеры.";


try {

    phoneAudio.pause();

    phoneAudio.currentTime = 0;

    const p =
        phoneAudio.play();

    if (p)
        p.catch(() => {});

} catch (e) {}

}

/* =========================
ПРОПУСК ЗВОНКА
========================= */

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

/* =========================
ПОСЛЕ ЗВОНКА
========================= */

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

/* =========================
ТАЙМЕР
========================= */

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

/* =========================
ЧАСЫ
========================= */

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

/* =========================
ДВИЖЕНИЕ
========================= */

function moveCharacters() {

/* ЛИЧИ */

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


/* ПАНКЕЙК */

if (
    selectedNight >= 2 &&
    gameMinutes >= 90
) {

    const pancakeSpeed =
        selectedNight === 2
            ? 55
            : 45;


    if (
        gameMinutes %
        pancakeSpeed === 0
    ) {

        if (
            pancakePosition < 3
        ) {

            pancakePosition++;

            playSound(
                pancakeAudio
            );

        }

    }

}


/* АТАКА ЛИЧИ */

if (
    lichiPosition >= 4 &&
    !lichiAttackTimer
) {

    lichiAttackTimer =
        setTimeout(
            function () {

                lichiAttackTimer =
                    null;

                if (
                    !gameOver &&
                    lichiPosition >= 4
                ) {

                    loseGame(
                        "lichi"
                    );

                }

            },
            1200
        );

}


/* АТАКА ПАНКЕЙКА */

if (
    selectedNight >= 2 &&
    pancakePosition >= 3
) {

    startPancakeAttack();

}

}

/* =========================
ПАНКЕЙК
========================= */

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


playSound(
    pancakeAudio
);


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

                loseGame(
                    "pancake"
                );

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

/* =========================
ПОВОРОТЫ
========================= */

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

/* =========================
ПЕРСОНАЖИ В ОФИСЕ
========================= */

function updateOfficeCharacters() {

lichi.style.display =
    "none";

pancake.style.display =
    "none";


/* ЛИЧИ */

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


/* ПАНКЕЙК АТАКУЕТ */

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


/* ПАНКЕЙК У ОКНА */

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

/* =========================
КАМЕРЫ
========================= */

document
.getElementById("cameraButton")
.addEventListener(
"click",
function () {

    if (!gameStarted)
        return;


    if (
        energyTarget !== "camera"
    ) {

        status.textContent =
            "ЭНЕРГИЯ НА ОКНЕ. КАМЕРА НЕ РАБОТАЕТ.";

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

    hideElement(
        cameraPanel
    );


    view.style.backgroundImage =
        `url("${officeViews[currentView]}")`;


    updateOfficeCharacters();

}

);

/* =========================
ПОКАЗ КАМЕРЫ
========================= */

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

/* =========================
КНОПКИ КАМЕР
========================= */

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
            ) {

                return;

            }


            showCamera(
                button.dataset.camera
            );

        }
    );

}

);

/* =========================
ПЕРСОНАЖИ НА КАМЕРАХ
========================= */

function updateCameraCharacters() {

cameraLichi.style.display =
    "none";

cameraPancake.style.display =
    "none";


if (
    energyTarget !== "camera"
) {

    return;

}


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

}

/* =========================
ВСПЫШКА
========================= */

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
        "ВСПЫШКА НЕ РАБОТАЕТ: ЭНЕРГИЯ НА ОКНЕ.";

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

        flash.style.opacity =
            "0";

    },
    120
);


playSound(
    flashAudio
);


setTimeout(
    function () {

        playSound(
            lichiAudio
        );

    },
    100
);


lichiPosition = 0;

lichi.style.display =
    "none";

cameraLichi.style.display =
    "none";


if (lichiAttackTimer) {

    clearTimeout(
        lichiAttackTimer
    );

    lichiAttackTimer =
        null;

}


status.textContent =
    "ВСПЫШКА! ЛИЧИ ОТСТУПИЛА.";


setTimeout(
    function () {

        flashCooldown =
            false;

    },
    1500
);

}

/* =========================
ЭНЕРГИЯ
========================= */

document
.getElementById("energyButton")
.addEventListener(
"click",
function () {

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

/* =========================
UI ЭНЕРГИИ
========================= */

function updateEnergyUI() {

if (
    energyTarget === "camera"
) {

    energyTargetText.textContent =
        "КАМЕРА";

    energyMessage.textContent =
        "Энергия направлена на камеры. Вспышка работает.";

}

else {

    energyTargetText.textContent =
        "ОКНО";

    energyMessage.textContent =
        "Энергия направлена на окно. Камеры и вспышка отключены.";

}

}

/* =========================
РЫЧАГ
========================= */

function startLeverDrag(event) {

if (!gameStarted)
    return;

if (gameOver)
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
        "Рычаг отпущен слишком рано. Тяни его 3 секунды.";

}

}

function completeLever() {

if (leverCompleted)
    return;


leverCompleted = true;

leverDragging = false;


if (
    energyTarget === "camera"
) {

    energyTarget =
        "window";

}

else {

    energyTarget =
        "camera";

}


updateEnergyUI();

updateCameraCharacters();


if (
    energyTarget === "window"
) {

    hideElement(
        cameraPanel
    );

    status.textContent =
        "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА НА ОКНО.";

}

else {

    status.textContent =
        "ЭНЕРГИЯ ПЕРЕНАПРАВЛЕНА НА КАМЕРУ.";

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

/* =========================
РЫЧАГ — МЫШЬ
========================= */

lever.addEventListener(
"mousedown",
startLeverDrag
);

document.addEventListener(
"mouseup",
stopLeverDrag
);

/* =========================
РЫЧАГ — ТАЧ
========================= */

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

/* =========================
ЗВУК
========================= */

function playSound(audio) {

if (!audio)
    return;


try {

    audio.pause();

    audio.currentTime = 0;

    const promise =
        audio.play();

    if (promise) {

        promise.catch(
            function () {}
        );

    }

} catch (e) {}

}

/* =========================
СКРИМЕР
========================= */

function playJumpscare(type) {

if (jumpscareActive)
    return;


jumpscareActive = true;


if (
    type === "pancake"
) {

    jumpscareImage.src =
        "images/pancake.png";

}

else {

    jumpscareImage.src =
        "images/lichi.png";

}


showElement(
    jumpscare,
    "flex"
);


/*
   Перезапуск анимации.
*/

jumpscareImage.style.animation =
    "none";

void jumpscareImage.offsetWidth;

jumpscareImage.style.animation =
    "jumpscareZoom .35s ease-out forwards, jumpscareShake .08s linear infinite";


/*
   Крик.
*/

playSound(
    screamAudio
);


/*
   После скримера
   показываем Game Over.
*/

setTimeout(
    function () {

        hideElement(
            jumpscare
        );

        jumpscareActive = false;

        showElement(
            gameOverScreen,
            "flex"
        );

    },
    1200
);

}

/* =========================
СБРОС СКРИМЕРА
========================= */

function resetJumpscare() {

jumpscareActive = false;

hideElement(
    jumpscare
);

jumpscareImage.src = "";

}

/* =========================
GAME OVER
========================= */

function loseGame(reason) {

if (gameOver)
    return;


gameOver = true;


stopGameTimer();


clearTimeout(
    pancakeAttackTimer
);

clearTimeout(
    lichiAttackTimer
);


pancakeAttackTimer = null;

lichiAttackTimer = null;


try {

    humAudio.pause();

    ventAudio.pause();

} catch (e) {}


if (
    reason === "lichi"
) {

    playJumpscare(
        "lichi"
    );

    return;

}


if (
    reason === "pancake"
) {

    playJumpscare(
        "pancake"
    );

    return;

}


playSound(
    screamAudio
);


showElement(
    gameOverScreen,
    "flex"
);

}

/* =========================
ПОБЕДА
========================= */

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

    ventAudio.pause();

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
    winScreen,
    "flex"
);

}

/* =========================
СЛЕДУЮЩАЯ НОЧЬ
========================= */

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

/* =========================
ПОВТОР
========================= */

document
.getElementById("restart")
.addEventListener(
"click",
function () {

    startSelectedNight();

}

);

/* =========================
МЕНЮ ПОСЛЕ ПОРАЖЕНИЯ
========================= */

document
.getElementById("menuAfterLose")
.addEventListener(
"click",
function () {

    stopGameTimer();

    hideElement(game);

    hideElement(gameOverScreen);

    resetJumpscare();

    showElement(
        mainMenu,
        "flex"
    );

    renderNights();

}

);

/* =========================
МЕНЮ ПОСЛЕ ПОБЕДЫ
========================= */

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

/* =========================
НАЧАЛЬНОЕ СОСТОЯНИЕ
========================= */

hideElement(nightsMenu);

hideElement(settingsMenu);

hideElement(phoneScreen);

hideElement(game);

hideElement(cameraPanel);

hideElement(energyPanel);

hideElement(gameOverScreen);

hideElement(winScreen);

hideElement(jumpscare);

showElement(
mainMenu,
"flex"
);

renderNights();

energyTarget =
"camera";

updateEnergyUI();
