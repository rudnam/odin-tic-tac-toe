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
                    return true;
                }
            }
        }
        return false;
    }
    return {getBoard,
            modifyBoard,
            checkBoard};
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
    const start = (Player1,Player2) => {
        if (!ongoing) {
            ongoing = true;
            P1 = Player1;
            P2 = Player2;
            turn = P1;
            gameStatus.innerText = `${turn.getName()}'s turn.`;
            for (let i=0; i < 9; i++) {
                cells[i].addEventListener('click', function() {
                    Game.move(cells[i].dataset.index);
                });
            }
        }
    }
    const move = index => {
        if (!gameBoard.getBoard()[index] && ongoing) {
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
        }
    }
    const getTurn = () => turn.getName();
    return {start,
            move,
            getTurn};
})();

function renderContent() {
    const board = gameBoard.getBoard();
    for (let i=0; i < 9; i++) {
        cells[i].innerText = board[i];
    }
}


// test
const test1 = Player('rudnam','🤣');
const test2 = Player('bot','🤬');
Game.start(test1, test2);