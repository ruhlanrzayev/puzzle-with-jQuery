$(() => {
    const game = $('#game');
    const select = $('#selectDif')
    const helpBtn = $('#helpBtn');
    const overlay = $('#overlay');
    const finishModal = $('#finishModal');
    const finishTime = $('#finishTime');
    const finishDifficulty = $('#finishDifficulty');
    const playAgain = $('#playAgain');

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;

    let helpCount = 0;
    const maxHelp = 3;
    let startTime;
    let cardSize;
    let rows, cols;

    function showBackStart(){
        game.css({
            width: `${GAME_WIDTH}px`,
            height: `${GAME_HEIGHT}px`,
            position: 'relative',
            boxShadow: '0 0 10px #333',
            font: 'bold 5em Helvetica',
            background: `rgba(255,255,255, .5) url('assets/wall.jpg')`,
            backgroundBlendMode: 'overlay'
        });

        setTimeout(() => {
            game.css({
                background: 'none',
                backgroundBlendMode: ''
            });
        }, 10000);
    }

    playAgain.css({
            padding: '10px 20px',
            backgroundColor: '#f39c12',
            color: '#FFF',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            fontSize: '1em'
        }).hover({
            function(){
                $(this).css({backgroundColor: '#c47d0c'})
            },
            function(){
                $(this).css({backgroundColor: '#f39c12'})
            }
        })

    finishModal.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        background: '#FFF',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        zIndex: 3000,
        display: 'none'
    })
    overlay.css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'none',
        zIndex: 2000
    })

    select.css({
        position: 'absolute',
        top: '10px',
        right: '100px',
        zIndex: 1000,
        padding: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '200ms ease',
        outline: 'none'
    }).hover(
        function () {
            $(this).css({ backgroundColor: '#c47d0c' });
        },
        function () {
            $(this).css({ backgroundColor: '#f39c12' });
        }
    );

    helpBtn.css({
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '200ms ease'
    }).hover(
        function () {
            $(this).css({ backgroundColor: '#c47d0c' });
        },
        function () {
            $(this).css({ backgroundColor: '#f39c12' });
        }
    );

    function rnd(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function checkCompletion() {
        let allAligned = true;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const id = `p${i}${j}`;
                const card = $(`#${id}`);
                const left = Math.round(parseInt(card.css('left')));
                const top = Math.round(parseInt(card.css('top')));
                const expectedLeft = j * cardSize;
                const expectedTop = i * cardSize;

                if (Math.abs(left - expectedLeft) > 5 || Math.abs(top - expectedTop) > 5) {
                    allAligned = false;
                    break;
                }
            }
            if (!allAligned) break;
        }

        if (allAligned) {
            endGame();
        }
    }

    function endGame() {
        let endTime = new Date().getTime();
        let duration = Math.floor((endTime - startTime) / 1000);
        let difficulty = select.val();

        overlay.show();
        finishModal.show();

        finishTime.text(`Time taken: ${duration} seconds`);
        finishDifficulty.text(`Difficulty: ${difficulty}`);
        // game.hide();
    }

    function startGame() {
        showBackStart();
        game.find('div[id^="p"]').remove(); 

        startTime = new Date().getTime();
        helpCount = 0;
        helpBtn.prop('disabled', false).css({ backgroundColor: '#f39c12', cursor: 'pointer' });

        overlay.hide();
        finishModal.hide();
        game.show();

        const difficulty = select.val();

        switch (difficulty) {
            case 'Beginner': cardSize = 200; break;
            case 'Intermediate': cardSize = 100; break;
            case 'Advanced': cardSize = 50; break;
            case 'Extreme': cardSize = 25; break;
        }

        rows = GAME_HEIGHT / cardSize;
        cols = GAME_WIDTH / cardSize;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const id = `p${i}${j}`;
                game.append(`<div id="${id}"></div>`);

                $(`#${id}`)
                    .css({
                        position: 'absolute',
                        width: `${cardSize}px`,
                        height: `${cardSize}px`,
                        left: rnd(GAME_WIDTH, $(window).width() - cardSize) + 'px',
                        top: rnd(0, GAME_HEIGHT) + 'px',
                        background: `url('assets/wall.jpg') -${cardSize * j}px -${cardSize * i}px`,
                        backgroundSize: `${cardSize * cols}px ${cardSize * rows}px`,
                        transform: `rotate(${rnd(-30, 30)}deg)`
                    })
                    .draggable({
                        snap: true,
                        start: function () {
                            $(this).css({ transform: 'rotate(0deg)' });
                        },
                        stop: function () {
                            $(this).css({
                                left: Math.round($(this).position().left / cardSize) * cardSize,
                                top: Math.round($(this).position().top / cardSize) * cardSize
                            });
                            checkCompletion();
                        }
                    });
            }
        }
    }

    helpBtn.on('click', () => {
        if (helpCount < maxHelp) {
            helpCount++;
            game.css({
                background: `rgba(255,255,255, .5) url('assets/wall.jpg')`,
                backgroundBlendMode: 'overlay'
            });

            setTimeout(() => {
                game.css({ background: 'none', backgroundBlendMode: '' });
            }, 5000);

            if (helpCount >= maxHelp) {
                helpBtn.prop('disabled', true).css({
                    backgroundColor: 'gray',
                    cursor: 'not-allowed'
                });
            }
        }
    });

    select.on('change', startGame);
    playAgain.on('click', startGame);

    startGame();
    showBackStart();
});