// script.js

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
