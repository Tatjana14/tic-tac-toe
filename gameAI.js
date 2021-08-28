const alert = document.getElementById('alert')
const reset = document.getElementById('reset')


let boardSize = 3;
let board = getBoardArr(boardSize)
let winner = getWinnCombinations()
let huPlayer = "X"
let otherPlayer = "O";
let currentPlayer = huPlayer
let cells = getCellsElements()
let round = 0
let numberMoves = boardSize * boardSize


function getCellsElements() {
    return Array.from(document.querySelectorAll('canvas'))
}

function main() {
    cells.forEach(cell => {
        cell.addEventListener('click', cellClick)
    })
}

main();

function getBoardArr(boardSize) {
    let sizeArray = boardSize * boardSize
    let newArr = new Array(sizeArray)
    for (let i = 0; i < sizeArray; i++) {
        newArr[i] = i
    }
    return newArr
}

function getWinnCombinations() {
    let hCombinations = getHorCombinations()
    let vCombinations = getVertCombinations()
    let tLCombinations = getTopLeftCombinations()
    let tRCombinations = getTopRightCombinations()
    return [...hCombinations, ...vCombinations, [...tLCombinations], [...tRCombinations]]
}

function getHorCombinations() {
    let copyArray = [...board]
    let newArray = []
    let firstSliceInd = 0
    let secondSliceInd = boardSize
    for (let i = 0; i < boardSize; i++) {
        newArray[i] = copyArray.slice(firstSliceInd, secondSliceInd)
        firstSliceInd = secondSliceInd
        secondSliceInd = secondSliceInd + boardSize

    }
    console.log(newArray)
    return newArray
}

function getVertCombinations() {
    let newArray = []
    for (let i = 0; i < boardSize; i++) {
        newArray[i] = getItems(i)
    }
    console.log(newArray)
    return newArray
}

function getItems(index) {
    let step = 0
    let newArray = []
    for (let j = 0; j < boardSize; j++) {
        newArray[j] = index + step
        step = step + boardSize
    }
    return newArray
}

function getTopLeftCombinations() {
    let increment = boardSize + 1
    let newArray = []
    for (let i = 0; i < board.length; i += increment) {
        newArray.push(i)
    }

    console.log(newArray)
    return newArray
}

function getTopRightCombinations() {
    let increment = boardSize - 1
    let newArray = []
    for (let i = increment; i < board.length - 1; i += increment) {
        newArray.push(i)
    }
    console.log(newArray)
    return newArray
}

function winning(board, player) {
    for (let i = 0; i < winner.length; i++) {
        if ((board[winner[i][0]] === player) && (board[winner[i][1]] === player) && (board[winner[i][2]] === player)) {
            return true
        }
    }
}

function getAlert(str) {
    alert.innerText = str
}

function avail(reBoard) {
    return reBoard.filter(s => s !== huPlayer && s !== otherPlayer);
}

function minimax(reBoard, player) {
    let array = avail(reBoard);
    if (winning(reBoard, huPlayer)) {
        return {
            score: -10
        };
    } else if (winning(reBoard, otherPlayer)) {
        return {
            score: 10
        };
    } else if (array.length === 0) {
        return {
            score: 0
        };
    }

    let moves = [];
    for (let i = 0; i < array.length; i++) {
        let move = {};
        move.index = reBoard[array[i]];
        reBoard[array[i]] = player;

        if (player === otherPlayer) {
            let g = minimax(reBoard, huPlayer);
            move.score = g.score;
        } else {
            let g = minimax(reBoard, otherPlayer);
            move.score = g.score;
        }
        reBoard[array[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === otherPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function switchPlayer(curr) {
    return currentPlayer = curr === huPlayer ? otherPlayer : huPlayer
}

function gamePlayOff() {
    cells.forEach((cell) => {
        cell.removeEventListener("click", cellClick);
    });
}

function cellClick(event) {
    let numID = event.target.id

    if (board[numID] !== huPlayer && board[numID] !== otherPlayer) {
        let cell = document.getElementById(numID);
        let ctx = cell.getContext("2d");
        round++
        board[numID] = huPlayer
        ctx.beginPath();
        ctx.lineWidth = 10
        ctx.moveTo(30, 30);
        ctx.lineTo(120, 120);
        ctx.moveTo(120, 30);
        ctx.lineTo(30, 120);
        ctx.strokeStyle = "#7e1ea6";
        ctx.stroke();
        ctx.closePath();

        if (winning(board, huPlayer)) {
            gamePlayOff()
            getAlert("Победа за тобой!")

        } else if (round === numberMoves) {
            gamePlayOff()
            getAlert("Ничья!")

        } else {
            switchPlayer(currentPlayer);
            round++
            let index = minimax(board, otherPlayer).index;
            board[index] = otherPlayer
            let cell = document.getElementById(index);
            let ctx = cell.getContext("2d");
            ctx.beginPath();
            ctx.lineWidth = 10
            ctx.arc(75, 75, 40, 0, 2 * Math.PI, false);
            ctx.strokeStyle = "#8b096a";
            ctx.stroke();
            ctx.closePath();
            if (winning(board, otherPlayer)) {
                gamePlayOff()
                getAlert("Тебя обыграл бот!")
            }
        }
    }
}

reset.addEventListener('click', () => document.location.reload())