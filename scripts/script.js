// script.js
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.status');
var clickDisabled = false;

const gameBoard = (() => {
    let board = ['','','',
                 '','','',
                 '','',''];
    let checks = [[0,1,2],[3,4,5],[6,7,8],
                  [0,3,6],[1,4,7],[2,5,8],
                  [0,4,8],[2,4,6]];
    const getBoard = () => board;
    const modifyBoard = (index, value) => {
        if (!board[index]) {
            board[index] = value;
        }
    }
    const checkBoard = () => {
        for (let i=0; i < checks.length; i++) {
            if (board[checks[i][0]] === board[checks[i][1]] && board[checks[i][1]] == board[checks[i][2]]) {
                if (board[checks[i][0]] !== '') {
                    cells[checks[i][0]].classList.add('highlight');
                    cells[checks[i][1]].classList.add('highlight');
                    cells[checks[i][2]].classList.add('highlight');
                    return true;
                }
            }
        }
        return false;
    }
    const clearBoard = () => {
        board = ['','','',
                 '','','',
                 '','',''];
    }
    return {getBoard,
            modifyBoard,
            checkBoard,
            clearBoard};
})();

const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {getName,
            getMark};
};

const Game = (() => {
    let ongoing = false;
    let P1 = null;
    let P2 = null;
    let turn = null;
    const setup = () => {
        if (P1 === null) {
            const player1 = Player(document.querySelector('#name').value,document.querySelector('#mark').value);
            P1 = player1;
            gameStatus.innerText = 'Input player 2 info.';
            document.querySelector('label[for=name]').innerText = 'Player 2 name:';
            document.querySelector('label[for=mark]').innerText = 'Player 2 mark:';
            document.querySelector('.ai').style.display = 'block';
            document.querySelector('.setup').reset();
            document.querySelector('#mark').value = '🤬';
        } else if (P2 === null) {
            const player2 = Player(document.querySelector('#name').value,document.querySelector('#mark').value);
            P2 = player2;
            document.querySelector('.setup').style.display = 'none';
            document.querySelector('.board').style.display = 'grid';
            Game.start(P1,P2);
        }
    }
    const start = (a,b) => {
        if (!ongoing) {
            gameBoard.clearBoard();
            renderContent();
            ongoing = true;
            P1 = a;
            P2 = b;
            turn = P1;
            gameStatus.innerText = `${turn.getName()}'s turn.`;
            for (let i=0; i < 9; i++) {
                if (cells[i].classList.contains('highlight')) {
                    cells[i].classList.remove('highlight');
                }
            }
        }
    }
    const move = index => {
        gameBoard.modifyBoard(index,turn.getMark());
        renderContent();
        if (gameBoard.checkBoard()) {
            gameStatus.innerText = `${turn.getName()} won!`;
            ongoing = false;
        } else if (!gameBoard.getBoard().includes('')) {
            gameStatus.innerText = "It's a tie!";
            ongoing = false;
        } else {
            turn = turn.getName() === P1.getName() ? P2 : P1;
            gameStatus.innerText = `${turn.getName()}'s turn.`;
        }
        if (!ongoing) {
            document.querySelector('.buttons').style.display = 'flex';
        }
    }
    const reset = () => {
        ongoing = false;
        P1 = null;
        P2 = null;
        turn = null;

    }
    const restart = () => Game.start(P1,P2);
    const getTurn = () => turn.getName();
    const isOngoing = () => ongoing;
    const getPInfo = () => P1 ? [P1.getName(), P1.getMark()] : null;
    return {getPInfo,
            setup,
            start,
            move,
            getTurn,
            isOngoing,
            restart,
            reset};
})();

function renderContent() {
    const board = gameBoard.getBoard();
    for (let i=0; i < 9; i++) {
        cells[i].innerText = board[i];
    }
}

for (let i=0; i < 9; i++) {
    cells[i].addEventListener('click', function() {
        if (!gameBoard.getBoard()[i] && Game.isOngoing() && !clickDisabled) {
            Game.move(cells[i].dataset.index);
            // bot
            if (document.querySelector('#bot').checked) {
                clickDisabled = true;
                setTimeout(function() {
                    clickDisabled = false;
                    bot.move();
                }, 300);
            }
        }
    });
}


document.querySelector('#start').addEventListener('click', function() {
    document.querySelector('.setup').style.display = 'flex';
    gameStatus.style.display = 'inline';
    document.querySelector('#start').style.display = 'none';
});

document.querySelector("#confirm").addEventListener('click', function() {
    if (Game.getPInfo()) {
        if (document.querySelector('#name').value == Game.getPInfo()[0]) {
            gameStatus.innerText = 'That name is already used.'
            return;
        }
        if (document.querySelector("#mark").value == Game.getPInfo()[1]) {
            gameStatus.innerText = 'That mark is already used.'
            return;
        }
    }
    if (document.querySelector("#name").value && document.querySelector("#mark").value) {
        Game.setup();
    } else {
        gameStatus.innerText = 'Fill in both fields.'
    }
});

document.querySelector('#restart').addEventListener('click', function() {
    Game.restart();
    document.querySelector('.buttons').style.display = 'none';
});

document.querySelector('#reset').addEventListener('click', function() {
    Game.reset();
    gameStatus.style.display = 'none';
    gameStatus.innerText = 'Input player 1 info.'
    document.querySelector('#start').style.display = 'block';
    document.querySelector('.buttons').style.display = 'none';
    document.querySelector('.board').style.display = 'none';
    document.querySelector('label[for=name]').innerText = 'Player 1 name:';
    document.querySelector('label[for=mark]').innerText = 'Player 1 mark:';
    document.querySelector('.ai').style.display = 'none';
    document.querySelector('.setup').reset();
    document.querySelector('#mark').value = '🤣';
    document.querySelector('#bot').checked = false;
})

// for bot
const bot = (() => {
    const move = () => {
        if (!gameBoard.getBoard().includes('') || !Game.isOngoing()) {
            return;
        }
        var index = Math.floor(Math.random() * 9);
        while (gameBoard.getBoard()[index]) {
            index = Math.floor(Math.random() * 9);
        }
        Game.move(index);
    }
    return {move};
})();