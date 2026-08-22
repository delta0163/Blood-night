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


    /* Дельты ещё нет */

    if (
        deltaPosition === 0
    ) {

        status.textContent =
            "В ШАХТЕ НИКОГО НЕТ.";

        return;

    }


    /* Дельта только появилась */

    if (
        deltaPosition === 1
    ) {

        status.textContent =
            "ДЕЛЬТА ЕЩЁ СЛИШКОМ ДАЛЕКО!";

        return;

    }


    /* Дельта на половине пути */

    if (
        deltaPosition === 2
    ) {

        status.textContent =
            "ДЕЛЬТА ЕЩЁ НЕ ВЫЛЕЗЛА ПОЛНОСТЬЮ!";

        return;

    }


    /* =================================================
       DELTA POSITION 3
       МОЖНО СЖЕЧЬ
    ================================================= */

    if (
        deltaPosition === 3
    ) {

        deltaPosition = 0;

        /*
           Следующее появление
           через 60 игровых минут.
        */

        deltaNextMoveTime =
            gameMinutes + 60;


        playSound(
            backupAudio
        );


        status.textContent =
            "🔥 ДЕЛЬТА СГОРЕЛ И ОТСТУПИЛА!";


        updateDelta();

    }

}
