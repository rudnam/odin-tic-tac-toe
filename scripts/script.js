// script.js
const cells = document.querySelectorAll('.cell');

const gameBoard = (() => {
    let board = ['','','',
                 '','','',
                 '','',''];
    const getBoard = () => board;
    const modifyBoard = (index, value) => {
        board[index] = value;
    }
    return {getBoard,
            modifyBoard};
})();

const Player = (name, mark) => {
    const getName = () => name;
    const move = index => {
        gameBoard.modifyBoard(index,mark);
    }
    return {getName,
            move};
};

function renderContent() {
    const board = gameBoard.getBoard();
    for (let i=0; i < 9; i++) {
        cells[i].innerText = board[i] ? board[i] : '😂';
    }
}

renderContent();