/* =================================================
   BLOOD GLOW NIGHT
   СТАРАЯ ОСНОВА + ОБНОВЛЁННЫЕ КАМЕРЫ
================================================= */


/* =================================================
   ЭЛЕМЕНТЫ
================================================= */

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

const flashAudio =
    document.getElementById("flashAudio");

const lichiAudio =
    document.getElementById("lichiAudio");

const humAudio =
    document.getElementById("humAudio");

const view =
    document.getElementById("view");

const lichi =
    document.getElementById("lichi");

const status =
    document.getElementById("status");

const time =
    document.getElementById("time");

const nightDisplay =
    document.getElementById("night");

const flash =
    document.getElementById("flash");

const cameraPanel =
    document.getElementById("cameraPanel");

const cameraImage =
    document.getElementById("cameraImage");

const cameraName =
    document.getElementById("cameraName");

const cameraLichi =
    document.getElementById("cameraLichi");

const cameraContent =
    document.getElementById("cameraContent");

const ventContent =
    document.getElementById("ventContent");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");


/* =================================================
   СОХРАНЕНИЕ
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


/* =================================================
   ЛИЧИ
================================================= */

/*
    0 — далеко
    1 — коридор
    2 — рядом с офисом
    3 — дверь
    4 — атака
*/

let lichiPosition = 0;


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


/*
    Где находится Личи.
*/

const lichiCameraPositions = {

    1: "cam01",

    2: "cam01",

    3: "cam06",

    4: "cam06"

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

        mainMenu.style.display =
            "none";

        nightsMenu.style.display =
            "flex";

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function() {

        nightsMenu.style.display =
            "none";

        mainMenu.style.display =
            "flex";

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
                "🔒 " + i;

            button.disabled =
                true;

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


/* =================================================
   НАСТРОЙКИ
================================================= */

document
.getElementById("settingsButton")
.addEventListener(
    "click",
    function() {

        mainMenu.style.display =
            "none";

        settingsMenu.style.display =
            "flex";

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function() {

        settingsMenu.style.display =
            "none";

        mainMenu.style.display =
            "flex";

    }
);


/* =================================================
   СБРОС ПРОГРЕССА
================================================= */

document
.getElementById("resetProgress")
.addEventListener(
    "click",
    function() {

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

        alert(
            "Прогресс сброшен."
        );

    }
);


/* =================================================
   FULLSCREEN
================================================= */

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


document
.getElementById("fullscreenButton")
.addEventListener(
    "click",
    enterFullscreen
);


/* =================================================
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    mainMenu.style.display =
        "none";

    nightsMenu.style.display =
        "none";

    settingsMenu.style.display =
        "none";


    phoneScreen.style.display =
        "flex";

    game.style.display =
        "none";


    gameStarted = false;

    gameOver = false;

    nightFinished = false;

    gameMinutes = 0;

    currentView = "front";

    currentCamera = "cam01";

    lichiPosition = 0;

    flashCooldown = false;


    nightDisplay.textContent =
        "NIGHT " + selectedNight;

    time.textContent =
        "12:00 AM";

    status.textContent =
        "Офис. Ночь начинается.";


    gameOverScreen.style.display =
        "none";

    winScreen.style.display =
        "none";


    cameraPanel.style.display =
        "none";


    cameraContent.style.display =
        "flex";

    ventContent.style.display =
        "none";


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    lichi.style.display =
        "none";

    cameraLichi.style.display =
        "none";


    phoneAudio.currentTime = 0;

    phoneAudio.play()
    .catch(
        function() {}
    );

}


/* =================================================
   ПРОПУСТИТЬ ЗВОНОК
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function() {

        phoneAudio.pause();

        phoneAudio.currentTime = 0;

        startNightAfterPhone();

    }
);


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

    if (gameStarted)
        return;


    gameStarted = true;


    phoneScreen.style.display =
        "none";

    game.style.display =
        "block";


    humAudio.currentTime = 0;

    humAudio.play()
    .catch(
        function() {}
    );


    updateEverything();

}


/* =================================================
   ПОВОРОТ
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


    view.style.backgroundSize =
        "cover";

    view.style.backgroundPosition =
        "center";

    view.style.backgroundRepeat =
        "no-repeat";


    updateOfficeLichi();


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
   ЛИЧИ В ОФИСЕ
================================================= */

function updateOfficeLichi() {

    if (
        lichiPosition < 2
    ) {

        lichi.style.display =
            "none";

        return;

    }


    if (
        currentView !== "left"
    ) {

        lichi.style.display =
            "none";

        return;

    }


    lichi.style.display =
        "block";


    lichi.style.transform =
        "translate(-50%, -50%)";


    if (
        lichiPosition === 2
    ) {

        lichi.style.left = "72%";

        lichi.style.top = "48%";

        lichi.style.width = "130px";

    }

    else if (
        lichiPosition === 3
    ) {

        lichi.style.left = "57%";

        lichi.style.top = "50%";

        lichi.style.width = "190px";

    }

    else {

        lichi.style.left = "50%";

        lichi.style.top = "52%";

        lichi.style.width = "280px";

    }

}


/* =================================================
   ОТКРЫТЬ МОНИТОР
================================================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function() {

        if (!gameStarted)
            return;

        if (gameOver)
            return;


        cameraPanel.style.display =
            "block";


        cameraContent.style.display =
            "flex";

        ventContent.style.display =
            "none";


        showCamera(
            currentCamera
        );

    }
);


/* =================================================
   ЗАКРЫТЬ МОНИТОР
================================================= */

document
.getElementById("closeCameraPanel")
.addEventListener(
    "click",
    function() {

        cameraPanel.style.display =
            "none";


        view.style.backgroundImage =
            `url("${officeViews[currentView]}")`;


        updateOfficeLichi();

    }
);


/* =================================================
   ВКЛАДКА КАМЕР
================================================= */

document
.getElementById("cameraTabButton")
.addEventListener(
    "click",
    function() {

        cameraContent.style.display =
            "flex";

        ventContent.style.display =
            "none";

        showCamera(
            currentCamera
        );

    }
);


/* =================================================
   ВКЛАДКА ВЕНТИЛЯЦИИ
================================================= */

document
.getElementById("ventTabButton")
.addEventListener(
    "click",
    function() {

        cameraContent.style.display =
            "none";

        ventContent.style.display =
            "block";

        status.textContent =
            "КАРТА ВЕНТИЛЯЦИИ";

    }
);


/* =================================================
   ПОКАЗ КАМЕРЫ
================================================= */

function showCamera(camera) {

    if (!cameraImages[camera])
        return;


    currentCamera = camera;


    /*
       ГЛАВНОЕ:
       картинка устанавливается
       непосредственно в IMG.
    */

    cameraImage.src =
        cameraImages[camera];


    cameraImage.alt =
        camera.toUpperCase();


    cameraName.textContent =
        camera.toUpperCase();


    document
    .querySelectorAll(
        "#cameraList button"
    )
    .forEach(
        function(button) {

            button.classList.remove(
                "active"
            );

        }
    );


    const selected =
        document.querySelector(
            `#cameraList button[data-camera="${camera}"]`
        );


    if (selected) {

        selected.classList.add(
            "active"
        );


        selected.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });

    }


    updateCameraLichi();

}


/* =================================================
   КНОПКИ КАМЕР
================================================= */

document
.querySelectorAll(
    "#cameraList button[data-camera]"
)
.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                showCamera(
                    button.dataset.camera
                );

            }
        );

    }
);


/* =================================================
   ЛИЧИ НА КАМЕРЕ
================================================= */

function updateCameraLichi() {

    cameraLichi.style.display =
        "none";


    if (
        lichiPosition === 0
    ) {

        return;

    }


    const lichiCamera =
        lichiCameraPositions[
            lichiPosition
        ];


    if (
        lichiCamera !== currentCamera
    ) {

        return;

    }


    cameraLichi.style.display =
        "block";


    cameraLichi.style.width =
        lichiPosition >= 3
            ? "210px"
            : "170px";


    cameraLichi.animate(
        [
            {
                transform:
                    "translate(-50%, -50%) scale(1)"
            },

            {
                transform:
                    "translate(-50%, -50%) scale(1.06)"
            },

            {
                transform:
                    "translate(-50%, -50%) scale(1)"
            }

        ],
        {
            duration: 700,
            iterations: 1
        }
    );

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
            "Посмотри в левый коридор.";

        return;

    }


    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "Личи ещё далеко.";

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


    flashAudio.currentTime = 0;

    flashAudio.play()
    .catch(
        function() {}
    );


    setTimeout(
        function() {

            lichiAudio.currentTime = 0;

            lichiAudio.play()
            .catch(
                function() {}
            );

        },
        80
    );


    lichiPosition = 0;


    lichi.style.display =
        "none";

    cameraLichi.style.display =
        "none";


    status.textContent =
        "ВСПЫШКА! Личи отступила.";


    setTimeout(
        function() {

            flashCooldown = false;

        },
        1500
    );

}


/* =================================================
   ЧАСЫ
================================================= */

function updateClock() {

    if (
        gameMinutes >= 360
    ) {

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
            .padStart(2, "0") +
        " AM";

}


/* =================================================
   ДВИЖЕНИЕ ЛИЧИ
================================================= */

function moveLichi() {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    /*
       Личи начинает движение
       с 1:00.
    */

    if (
        gameMinutes < 60
    ) {

        return;

    }


    /*
       Каждые 20 секунд
       следующее положение.
    */

    if (
        gameMinutes % 20 === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

        }

    }


    updateEverything();


    if (
        lichiPosition >= 4
    ) {

        setTimeout(
            function() {

                if (
                    lichiPosition >= 4
                ) {

                    loseGame();

                }

            },
            2500
        );

    }

}


/* =================================================
   ОБНОВЛЕНИЕ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeLichi();

    updateCameraLichi();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame() {

    if (gameOver)
        return;


    gameOver = true;


    humAudio.pause();


    cameraPanel.style.display =
        "none";


    gameOverScreen.style.display =
        "flex";

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished = true;


    humAudio.pause();


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


    winScreen.style.display =
        "flex";

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
   ПЕРЕЗАПУСК
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
   GAME OVER → МЕНЮ
================================================= */

document
.getElementById("menuAfterLose")
.addEventListener(
    "click",
    function() {

        gameOverScreen.style.display =
            "none";

        game.style.display =
            "none";

        mainMenu.style.display =
            "flex";

    }
);


/* =================================================
   ПОБЕДА → МЕНЮ
================================================= */

document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function() {

        game.style.display =
            "none";

        winScreen.style.display =
            "none";

        mainMenu.style.display =
            "flex";

        renderNights();

    }
);


/* =================================================
   ИГРОВОЙ ЦИКЛ
================================================= */

setInterval(
    function() {

        if (!gameStarted)
            return;

        if (gameOver)
            return;

        if (nightFinished)
            return;


        gameMinutes++;


        moveLichi();

    },
    1000
);


/* =================================================
   СТАРТ
================================================= */

renderNights();
const lichiCameraPositions = {

    1: "cam01",

    2: "cam01",

    3: "cam06",

    4: "cam06"

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

        mainMenu.style.display =
            "none";

        nightsMenu.style.display =
            "flex";

    }
);


document
.getElementById("closeNights")
.addEventListener(
    "click",
    function () {

        nightsMenu.style.display =
            "none";

        mainMenu.style.display =
            "block";

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
            document.createElement(
                "button"
            );


        button.className =
            "nightButton";


        const unlocked =
            i === 1 ||
            i <= completedNight + 1;


        if (!unlocked) {

            button.classList
                .add("locked");

            button.textContent =
                "🔒 " + i;

            button.disabled =
                true;

        }

        else {

            button.textContent =
                "NIGHT " + i;

            button.onclick =
                function () {

                    selectedNight = i;

                    startSelectedNight();

                };

        }


        nightsList.appendChild(
            button
        );

    }

}


/* =================================================
   НАСТРОЙКИ
================================================= */

document
.getElementById("settingsButton")
.addEventListener(
    "click",
    function () {

        mainMenu.style.display =
            "none";

        settingsMenu.style.display =
            "flex";

    }
);


document
.getElementById("closeSettings")
.addEventListener(
    "click",
    function () {

        settingsMenu.style.display =
            "none";

        mainMenu.style.display =
            "block";

    }
);


/* =================================================
   СБРОС
================================================= */

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

        alert(
            "Прогресс сброшен."
        );

    }
);


/* =================================================
   FULLSCREEN
================================================= */

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

    catch (error) {

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
   НАЧАЛО НОЧИ
================================================= */

function startSelectedNight() {

    mainMenu.style.display =
        "none";

    nightsMenu.style.display =
        "none";

    settingsMenu.style.display =
        "none";


    phoneScreen.style.display =
        "flex";


    game.style.display =
        "none";


    gameStarted = false;

    gameOver = false;

    nightFinished = false;


    gameMinutes = 0;


    currentView =
        "front";


    currentCamera =
        "cam01";


    lichiPosition =
        0;


    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;


    time.textContent =
        "12:00 AM";


    status.textContent =
        "Офис. Ночь начинается.";


    gameOverScreen.style.display =
        "none";


    winScreen.style.display =
        "none";


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    lichi.style.display =
        "none";


    phoneAudio.currentTime =
        0;


    phoneAudio.play()
    .catch(
        function () {}
    );

}


/* =================================================
   ПРОПУСТИТЬ ЗВОНОК
================================================= */

document
.getElementById("skipPhoneButton")
.addEventListener(
    "click",
    function () {

        phoneAudio.pause();

        phoneAudio.currentTime =
            0;

        startNightAfterPhone();

    }
);


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


    phoneScreen.style.display =
        "none";


    game.style.display =
        "block";


    humAudio.currentTime =
        0;


    humAudio.play()
    .catch(
        function () {}
    );


    updateEverything();

}


/* =================================================
   ПРАВИЛЬНЫЙ ПОВОРОТ
================================================= */

function changeView(direction) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    if (
        !officeViews[direction]
    ) {

        console.log(
            "Изображение не найдено:",
            direction
        );

        return;

    }


    currentView =
        direction;


    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;


    view.style.backgroundSize =
        "cover";


    view.style.backgroundPosition =
        "center";


    view.style.backgroundRepeat =
        "no-repeat";


    /*
       Личи в офисе показывается
       только со 2 положения.
    */

    updateOfficeLichi();


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

}


document
.getElementById("leftButton")
.addEventListener(
    "click",
    function () {

        changeView("left");

    }
);


document
.getElementById("frontButton")
.addEventListener(
    "click",
    function () {

        changeView("front");

    }
);


document
.getElementById("rightButton")
.addEventListener(
    "click",
    function () {

        changeView("right");

    }
);


/* =================================================
   ЛИЧИ В ОФИСЕ
================================================= */

function updateOfficeLichi() {

    /*
       Личи появляется только
       начиная со второго положения.
    */

    if (
        lichiPosition < 2
    ) {

        lichi.style.display =
            "none";

        return;

    }


    /*
       Личи показывается
       рядом с офисом
       только на левом коридоре.
    */

    if (
        currentView !== "left"
    ) {

        lichi.style.display =
            "none";

        return;

    }


    lichi.style.display =
        "block";


    if (
        lichiPosition === 2
    ) {

        lichi.style.left =
            "72%";

        lichi.style.top =
            "48%";

        lichi.style.width =
            "130px";

    }

    else if (
        lichiPosition === 3
    ) {

        lichi.style.left =
            "57%";

        lichi.style.top =
            "50%";

        lichi.style.width =
            "190px";

    }

    else {

        lichi.style.left =
            "50%";

        lichi.style.top =
            "52%";

        lichi.style.width =
            "280px";

    }

}


/* =================================================
   КАМЕРЫ
================================================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function () {

        cameraPanel.style.display =
            "block";

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

        cameraPanel.style.display =
            "none";

        /*
           После закрытия камеры
           возвращаем офис.
        */

        view.style.backgroundImage =
            `url("${officeViews[currentView]}")`;

        updateOfficeLichi();

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


    if (!image) {

        console.log(
            "Камера не найдена:",
            camera
        );

        return;

    }


    /*
       Основной экран
       камеры.
    */

    view.style.backgroundImage =
        `url("${image}")`;


    view.style.backgroundSize =
        "cover";


    view.style.backgroundPosition =
        "center";


    view.style.backgroundRepeat =
        "no-repeat";


    /*
       Проверяем,
       есть ли Личи на этой камере.
    */

    updateCameraLichi();


    status.textContent =
        camera.toUpperCase();

}


/* =================================================
   КНОПКИ КАМЕР
================================================= */

document
.querySelectorAll(
    "#cameraPanel [data-camera]"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                showCamera(
                    button.dataset.camera
                );

            }
        );

    }
);


/* =================================================
   ЛИЧИ НА КАМЕРАХ
================================================= */

function updateCameraLichi() {

    /*
       Сначала убираем
       офисный спрайт.
    */

    lichi.style.display =
        "none";


    /*
       Если Личи ещё далеко,
       на камерах её нет.
    */

    if (
        lichiPosition === 0
    ) {

        return;

    }


    const cameraForLichi =
        lichiCameraPositions[
            lichiPosition
        ];


    /*
       Личи находится
       не на этой камере.
    */

    if (
        cameraForLichi !==
        currentCamera
    ) {

        return;

    }


    /*
       Показываем спрайт.
    */

    lichi.style.display =
        "block";


    lichi.style.width =
        "150px";


    lichi.style.left =
        "50%";


    lichi.style.top =
        "50%";


    lichi.style.transform =
        "translate(-50%, -50%)";


    status.textContent =
        "⚠ ЛИЧИ ОБНАРУЖЕНА";


    /*
       Небольшое движение
       спрайта.
    */

    lichi.animate(
        [
            {
                transform:
                    "translate(-50%, -50%) scale(1)"
            },

            {
                transform:
                    "translate(-50%, -50%) scale(1.06)"
            },

            {
                transform:
                    "translate(-50%, -50%) scale(1)"
            }
        ],
        {
            duration: 700,
            iterations: 1
        }
    );

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


    /*
       Вспышка используется
       только в левом коридоре.
    */

    if (
        currentView !== "left"
    ) {

        status.textContent =
            "Посмотри в левый коридор.";

        return;

    }


    /*
       До второго положения
       вспышка ничего
       не делает.
    */

    if (
        lichiPosition < 2
    ) {

        status.textContent =
            "Личи ещё далеко.";

        return;

    }


    flashCooldown =
        true;


    flash.style.opacity =
        "1";


    setTimeout(
        function () {

            flash.style.opacity =
                "0";

        },
        120
    );


    flashAudio.currentTime =
        0;


    flashAudio.play()
    .catch(
        function () {}
    );


    setTimeout(
        function () {

            lichiAudio.currentTime =
                0;

            lichiAudio.play()
            .catch(
                function () {}
            );

        },
        80
    );


    /*
       Личи отбрасывается
       обратно в начало.
    */

    lichiPosition =
        0;


    lichi.style.display =
        "none";


    status.textContent =
        "ВСПЫШКА! Личи отступила.";


    setTimeout(
        function () {

            flashCooldown =
                false;

        },
        1500
    );

}


/* =================================================
   ЧАСЫ
================================================= */

function updateClock() {

    if (
        gameMinutes >= 360
    ) {

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
            .padStart(2, "0") +
        " AM";

}


/* =================================================
   ДВИЖЕНИЕ ЛИЧИ
================================================= */

function moveLichi() {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    /*
       Личи начинает двигаться
       с 1:00.
    */

    if (
        gameMinutes < 60
    ) {

        return;

    }


    /*
       Каждые 20 секунд
       она переходит
       в следующее положение.
    */

    if (
        gameMinutes % 20 === 0
    ) {

        if (
            lichiPosition < 4
        ) {

            lichiPosition++;

        }

    }


    updateEverything();


    /*
       Если дошла до атаки,
       игрок проигрывает.
    */

    if (
        lichiPosition >= 4
    ) {

        setTimeout(
            function () {

                if (
                    lichiPosition >= 4
                ) {

                    loseGame();

                }

            },
            2500
        );

    }

}


/* =================================================
   ОБНОВИТЬ ВСЁ
================================================= */

function updateEverything() {

    updateClock();

    updateOfficeLichi();

    updateCameraLichi();

}


/* =================================================
   GAME OVER
================================================= */

function loseGame() {

    if (gameOver)
        return;


    gameOver =
        true;


    humAudio.pause();


    gameOverScreen.style.display =
        "flex";

}


/* =================================================
   ПОБЕДА
================================================= */

function winGame() {

    if (nightFinished)
        return;


    nightFinished =
        true;


    humAudio.pause();


    /*
       Сохраняем пройденную ночь.
    */

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


    winScreen.style.display =
        "flex";

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
   ПЕРЕЗАПУСК
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
   В МЕНЮ
================================================= */

document
.getElementById("menuAfterWin")
.addEventListener(
    "click",
    function () {

        game.style.display =
            "none";

        winScreen.style.display =
            "none";

        mainMenu.style.display =
            "block";

        renderNights();

    }
);


/* =================================================
   ИГРОВОЙ ЦИКЛ
================================================= */

setInterval(
    function () {

        if (!gameStarted)
            return;

        if (gameOver)
            return;

        if (nightFinished)
            return;


        gameMinutes++;


        moveLichi();

    },
    1000
);


/* =================================================
   СТАРТ
================================================= */

renderNights();
