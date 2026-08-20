/* =================================================
   BLOOD GLOW NIGHT
   NIGHT SYSTEM + SAVE
   CAMERAS + VENTILATION + BARRIERS
================================================= */


/* =================================================
   СОХРАНЕНИЕ
================================================= */

/*
   Прогресс хранится в localStorage браузера.

   После закрытия сайта:
   пройденные ночи НЕ пропадут.

   Например:
   completedNight = 1
   означает, что первая ночь пройдена.
*/

let completedNight =
    Number(
        localStorage.getItem(
            "bloodGlowNightCompleted"
        )
    ) || 0;


/*
   Открытая ночь.
*/

let selectedNight = 1;


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

const startGameButton =
    document.getElementById("startGameButton");

const nightsButton =
    document.getElementById("nightsButton");

const settingsButton =
    document.getElementById("settingsButton");

const closeNights =
    document.getElementById("closeNights");

const closeSettings =
    document.getElementById("closeSettings");

const resetProgress =
    document.getElementById("resetProgress");

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

const ventMap =
    document.getElementById("ventMap");

const gameOverScreen =
    document.getElementById("gameOver");

const winScreen =
    document.getElementById("winScreen");

const winText =
    document.getElementById("winText");

const nextNightButton =
    document.getElementById("nextNight");

const barrierCounter =
    document.getElementById(
        "barrierCounter"
    );


/* =================================================
   АУДИО
================================================= */

phoneAudio.volume = 1.0;

flashAudio.volume = 0.8;

lichiAudio.volume = 1.0;

humAudio.volume = 0.25;


/* =================================================
   СОСТОЯНИЕ ИГРЫ
================================================= */

let gameStarted = false;

let gameOver = false;

let nightFinished = false;

let gameMinutes = 0;

let currentView = "front";

let flashCooldown = false;


/* =================================================
   ЛИЧИ
================================================= */

let lichiPosition = 0;

const LICHIPOSITIONS = {

    FAR: 0,

    MIDDLE: 1,

    NEAR: 2,

    DOOR: 3,

    ATTACK: 4

};


/* =================================================
   ВЕНТИЛЯЦИЯ
================================================= */

let pancakePosition = 0;

let deltaPosition = 0;

const MAX_BARRIERS = 2;

let barriersUsed = 0;


/* =================================================
   КАРТИНКИ КАМЕР
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
   ОТОБРАЖЕНИЕ НОЧЕЙ
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


        /*
           Первая ночь открыта
           всегда.

           Следующая открывается
           после прохождения
           предыдущей.
        */

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

            button.addEventListener(
                "click",
                function () {

                    selectedNight = i;

                    startSelectedNight();

                }
            );

        }


        nightsList.appendChild(
            button
        );

    }

}


/* =================================================
   МЕНЮ НОЧЕЙ
================================================= */

nightsButton.addEventListener(
    "click",
    function () {

        renderNights();

        mainMenu.style.display =
            "none";

        nightsMenu.style.display =
            "flex";

    }
);


closeNights.addEventListener(
    "click",
    function () {

        nightsMenu.style.display =
            "none";

        mainMenu.style.display =
            "block";

    }
);


/* =================================================
   НАСТРОЙКИ
================================================= */

settingsButton.addEventListener(
    "click",
    function () {

        mainMenu.style.display =
            "none";

        settingsMenu.style.display =
            "flex";

    }
);


closeSettings.addEventListener(
    "click",
    function () {

        settingsMenu.style.display =
            "none";

        mainMenu.style.display =
            "block";

    }
);


/* =================================================
   СБРОС ПРОГРЕССА
================================================= */

resetProgress.addEventListener(
    "click",
    function () {

        const answer =
            confirm(
                "Удалить весь прогресс?"
            );


        if (!answer)
            return;


        completedNight = 0;


        localStorage.removeItem(
            "bloodGlowNightCompleted"
        );


        alert(
            "Прогресс сброшен."
        );

    }
);


/* =================================================
   НАЧАТЬ ИГРУ
================================================= */

startGameButton.addEventListener(
    "click",
    async function () {

        selectedNight = 1;

        await enterFullscreen();

        startSelectedNight();

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
    async function () {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document
                    .documentElement
                    .requestFullscreen();

            }

            else {

                await document
                    .exitFullscreen();

            }

        }

        catch (error) {

            console.log(error);

        }

    }
);


/* =================================================
   НАЧАЛО ВЫБРАННОЙ НОЧИ
================================================= */

function startSelectedNight() {

    nightsMenu.style.display =
        "none";

    settingsMenu.style.display =
        "none";

    mainMenu.style.display =
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


    lichiPosition =
        LICHIPOSITIONS.FAR;


    pancakePosition = 0;

    deltaPosition = 0;


    barriersUsed = 0;


    updateBarrierCounter();


    nightDisplay.textContent =
        "NIGHT " +
        selectedNight;


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    time.textContent =
        "12:00 AM";


    status.textContent =
        "Офис. Ночь начинается.";


    gameOverScreen.style.display =
        "none";


    winScreen.style.display =
        "none";


    /*
       Вентиляционные перегородки
       сбрасываются в начале ночи.
    */

    document
    .querySelectorAll(
        ".ventConnection.barrier"
    )
    .forEach(
        function (element) {

            element.classList
                .remove("barrier");

        }
    );


    /*
       Звонок.
    */

    phoneAudio.currentTime =
        0;


    phoneAudio.play()
    .catch(
        function () {

            showAudioButton();

        }
    );

}


/* =================================================
   КНОПКА ПРОПУСТИТЬ ЗВОНОК
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


/* =================================================
   КОНЕЦ ЗВОНКА
================================================= */

phoneAudio.addEventListener(
    "ended",
    function () {

        startNightAfterPhone();

    }
);


/* =================================================
   АУДИО-КНОПКА
================================================= */

function showAudioButton() {

    if (
        document.getElementById(
            "audioStartButton"
        )
    ) {

        return;

    }


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "audioStartButton";


    button.textContent =
        "▶ ВКЛЮЧИТЬ ЗВОНОК";


    button.className =
        "menuButton";


    phoneScreen
        .querySelector(".phoneBox")
        .appendChild(
            button
        );


    button.addEventListener(
        "click",
        async function () {

            try {

                await phoneAudio.play();

                button.remove();

            }

            catch (error) {

                console.log(error);

            }

        }
    );

}


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


    gameMinutes = 0;


    currentView =
        "front";


    view.style.backgroundImage =
        `url("${officeViews.front}")`;


    humAudio.currentTime =
        0;


    humAudio.play()
    .catch(
        function () {}
    );


    updateLichi();

    updateVentAnimatronics();

}


/* =================================================
   ПОВОРОТЫ
================================================= */

function changeView(
    direction
) {

    if (!gameStarted)
        return;

    if (gameOver)
        return;


    currentView =
        direction;


    view.style.backgroundImage =
        `url("${officeViews[direction]}")`;


    updateLichiStatus();

    updateLichi();

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
   КАМЕРЫ
================================================= */

document
.getElementById("cameraButton")
.addEventListener(
    "click",
    function () {

        cameraPanel.style.display =
            "block";

    }
);


document
.getElementById("closeCameraPanel")
.addEventListener(
    "click",
    function () {

        cameraPanel.style.display =
            "none";

    }
);


document
.querySelectorAll(
    "#cameraPanel [data-camera]"
)
.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const camera =
                    button.dataset.camera;


                view.style.backgroundImage =
                    `url("${cameraImages[camera]}")`;


                cameraPanel.style.display =
                    "none";


                status.textContent =
                    button.textContent;

            }
        );

    }
);


/* =================================================
   ВЕНТИЛЯЦИЯ
================================================= */

document
.getElementById("ventButton")
.addEventListener(
    "click",
    function () {

        ventMap.style.display =
            "block";

        updateVentAnimatronics();

    }
);


document
.getElementById("closeVentMap")
.addEventListener(
    "click",
    function () {

        ventMap.style.display =
            "none";

    }
);


/* =================================================
   ПЕРЕГОРОДКИ
================================================= */

document
.querySelectorAll(
    ".ventConnection"
)
.forEach(
    function (connection) {

        connection.addEventListener(
            "click",
            function () {

                toggleBarrier(
                    connection
                );

            }
        );

    }
);


function toggleBarrier(
    connection
) {

    /*
       Убрать перегородку.
    */

    if (
        connection.classList
        .contains("barrier")
    ) {

        connection.classList
            .remove("barrier");


        barriersUsed--;


        updateBarrierCounter();


        status.textContent =
            "Перегородка убрана.";


        return;

    }


    /*
       Лимит.
    */

    if (
        barriersUsed >=
        MAX_BARRIERS
    ) {

        status.textContent =
            "Доступно только 2 перегородки.";


        return;

    }


    /*
       Поставить.
    */

    connection.classList
        .add("barrier");


    barriersUsed++;


    updateBarrierCounter();


    status.textContent =
        "Перегородка установлена.";

}


/* =================================================
   СЧЁТЧИК
================================================= */

function updateBarrierCounter() {

    barrierCounter.textContent =
        "ПЕРЕГОРОДКИ: " +
        (
            MAX_BARRIERS -
            barriersUsed
        ) +
        "/" +
        MAX_BARRIERS;

}


/* =================================================
   ПОЗИЦИИ ВЕНТИЛЯЦИИ
================================================= */

function updateVentAnimatronics() {

    const pancakePositions = [

        {
            left: "50%",
            top: "15%"
        },

        {
            left: "25%",
            top: "35%"
        },

        {
            left: "50%",
            top: "55%"
        },

        {
            left: "50%",
            top: "73%"
        },

        {
            left: "50%",
            top: "91%"
        }

    ];


    const deltaPositions = [

        {
            left: "50%",
            top: "15%"
        },

        {
            left: "75%",
            top: "35%"
        },

        {
            left: "50%",
            top: "55%"
        },

        {
            left: "50%",
            top: "73%"
        },

        {
            left: "50%",
            top: "91%"
        }

    ];


    const pancake =
        pancakePositions[
            pancakePosition
        ];


    const delta =
        deltaPositions[
            deltaPosition
        ];


    const pancakeMarker =
        document.getElementById(
            "pancakeMarker"
        );


    const deltaMarker =
        document.getElementById(
            "deltaMarker"
        );


    pancakeMarker.style.left =
        pancake.left;


    pancakeMarker.style.top =
        pancake.top;


    deltaMarker.style.left =
        delta.left;


    deltaMarker.style.top =
        delta.top;

}


/* =================================================
   ЛИЧИ
================================================= */

function updateLichi() {

    if (
        currentView !== "left"
    ) {

        lichi.style.display =
            "none";

        return;

    }


    if (
        lichiPosition ===
        LICHIPOSITIONS.FAR
    ) {

        lichi.style.display =
            "none";

        return;

    }


    lichi.style.display =
        "block";


    const positions = {

        1: {
            left: "80%",
            top: "44%",
            width: "90px"
        },

        2: {
            left: "68%",
            top: "47%",
            width: "130px"
        },

        3: {
            left: "54%",
            top: "50%",
            width: "180px"
        },

        4: {
            left: "43%",
            top: "52%",
            width: "260px"
        }

    };


    const position =
        positions[
            lichiPosition
        ];


    lichi.style.left =
        position.left;


    lichi.style.top =
        position.top;


    lichi.style.width =
        position.width;

}


/* =================================================
   СТАТУС ЛИЧИ
================================================= */

function updateLichiStatus() {

    if (
        currentView !== "left"
    ) {

        status.textContent =
            "Офис.";

        return;

    }


    if (
        lichiPosition ===
        LICHIPOSITIONS.FAR
    ) {

        status.textContent =
            "Коридор пуст.";

    }

    else if (
        lichiPosition ===
        LICHIPOSITIONS.MIDDLE
    ) {

        status.textContent =
            "Личи в коридоре.";

    }

    else if (
        lichiPosition ===
        LICHIPOSITIONS.NEAR
    ) {

        status.textContent =
            "Личи приближается.";

    }

    else if (
        lichiPosition ===
        LICHIPOSITIONS.DOOR
    ) {

        status.textContent =
            "Личи возле офиса!";

    }

    else {

        status.textContent =
            "ЛИЧИ ПЕРЕД ОФИСОМ!";

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
            "Посмотри в левый коридор.";

        return;

    }


    if (
        lichiPosition <
        LICHIPOSITIONS.DOOR
    ) {

        status.textContent =
            "Личи ещё слишком далеко.";

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


    lichiPosition =
        LICHIPOSITIONS.FAR;


    status.textContent =
        "ВСПЫШКА! Личи отступила.";


    updateLichi();


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

    /*
       360 игровых минут
       = 6 AM.
    */

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
            .padStart(
                2,
                "0"
            ) +
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
       Личи активируется
       с 1:00.
    */

    if (
        gameMinutes < 60
    ) {

        return;

    }


    /*
       Каждые 20 минут
       двигается дальше.
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


    updateLichiStatus();

    updateLichi();


    /*
       Если Личи дошла
       до офиса и игрок
       не использовал вспышку.
    */

    if (
        lichiPosition >=
        LICHIPOSITIONS.ATTACK
    ) {

        setTimeout(
            function () {

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
       Сохраняем только если
       эта ночь самая новая.
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


    /*
       Если пройдена ночь 13 —
       следующей ночи нет.
    */

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


        updateClock();


        moveLichi();

    },
    1000
);


/* =================================================
   ПЕРВИЧНАЯ ЗАГРУЗКА
================================================= */

renderNights();
