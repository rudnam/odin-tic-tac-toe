// script.js
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.status');

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
                cells[i].addEventListener('click', function() {
                    if (!gameBoard.getBoard()[i] && ongoing) {
                        Game.move(cells[i].dataset.index);
                        // bot
                        if (document.querySelector('#bot').checked) {
                            bot.move();
                        }
                    }
                });
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
            document.querySelector('#restart').style.display = 'block';
        }
    }
    const restart = () => Game.start(P1,P2);
    const getTurn = () => turn.getName();
    const getOngoing = () => ongoing;
    return {setup,
            start,
            move,
            getTurn,
            getOngoing,
            restart};
})();

function renderContent() {
    const board = gameBoard.getBoard();
    for (let i=0; i < 9; i++) {
        cells[i].innerText = board[i];
    }
}

document.querySelector('#start').addEventListener('click', function() {
    document.querySelector('.setup').style.display = 'flex';
    gameStatus.style.display = 'inline';
    document.querySelector('#start').style.display = 'none';
});

document.querySelector("#confirm").addEventListener('click', function() {
    if (document.querySelector("#name").value && document.querySelector("#mark").value) {
        Game.setup();
    }
});

document.querySelector('#restart').addEventListener('click', function() {
    Game.restart();
    document.querySelector('#restart').style.display = 'none';
});

// for bot
const bot = (() => {
    const move = () => {
        if (!gameBoard.getBoard().includes('') || !Game.getOngoing()) {
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