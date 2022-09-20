// script.js
const cells = document.querySelectorAll('.cell');

const gameBoard = (() => {
    let board = ['','','',
                 '','','',
                 '','',''];
    const getBoard = () => board;
    const modifyBoard = (index, value) => {
        if (!board[index]) {
            board[index] = value;
        }
    }
    return {getBoard,
            modifyBoard};
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
            for (let i=0; i < 9; i++) {
                cells[i].addEventListener('click', function() {
                    Game.move(cells[i].dataset.index);
                });
            }
        }
    }
    const move = index => {
        if (!gameBoard.getBoard()[index]) {
            gameBoard.modifyBoard(index,turn.getMark());
            renderContent();
            turn = turn.getName() === P1.getName() ? P2 : P1;
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