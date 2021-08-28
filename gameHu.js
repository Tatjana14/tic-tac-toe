const getCellsElements = () => {
    return Array.from(document.querySelectorAll('canvas'))
}


let DOM = {
    cells: getCellsElements(),
    boardSizeInput: document.getElementById('board-size-input'),
    toWinInput: document.getElementById('to-win-input'),
    submitBtn: document.getElementById('submit-button'),
    board: document.getElementById('game-container'),
    alert: document.getElementById('alert'),
    reset: document.getElementById('reset'),
}

let state = {
    currentPlayer: "x",
    winner: false,
    player: {
        x: [],
        o: [],
    },
    playerName: {
        x: "Blue",
        o: "Green",
    },
    boardSize: 4,
    toWin: 4,
};


function main() {
    DOM.cells.forEach(cell => {
        cell.addEventListener('click', insertToken)
    })

}

main();

function isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
}

function tileJSPosition(tile) {
    const splitTile = tile.split(" ");
    return {
        x: parseInt(
            splitTile[0].split("").slice(1, splitTile[0].split("").length).join("")
        ),
        y: parseInt(
            splitTile[1].split("").slice(1, splitTile[1].split("").length).join("")
        ),
    };
}

function addTokenToState(tileObj) {
    state.player[state.currentPlayer].push({
        position: tileObj,
        point: {
            x: 1,
            y: 1,
            topLeft: 1,
            topRight: 1,
        },
    })
}

function addPointsToToken(token) {
    winThroughXorY(token, "x");
    winThroughXorY(token, "y");
    winThroughDiagonalTopLeft(token);
    winThroughDiagonalTopRight(token);
}

function coordinateReverse(coordinate) {
    return coordinate === 'x' ? 'y' : 'x'
}

function mutatePointsForXorY(aTile, tileObj, coordinate) {
    aTile.point[coordinate]++
    tileObj.point[coordinate] = aTile.point[coordinate];
    state.player[state.currentPlayer].forEach((aTile) => {
        for (let i = 1; i < state.toWin; i++) {
            if (
                aTile.position[coordinateReverse(coordinate)] ===
                tileObj.position[coordinateReverse(coordinate)] &&
                (aTile.position[coordinate] === tileObj.position[coordinate] + i ||
                    aTile.position[coordinate] === tileObj.position[coordinate] - i)
            ) {
                aTile.point[coordinate] = tileObj.point[coordinate]
            }
        }
    })
}

function mutatePointsForTopLeft(aTile, tileObj, coordinate) {
    aTile.point[coordinate]++
    tileObj.point[coordinate] = aTile.point[coordinate];
    state.player[state.currentPlayer].forEach((aTile) => {
        for (let i = 1; i < state.toWin; i++) {
            if (
                (tileObj.position["x"] + i === aTile.position["x"] &&
                    tileObj.position["y"] + i === aTile.position["y"]) ||
                (tileObj.position["x"] - i === aTile.position["x"] &&
                    tileObj.position["y"] - i === aTile.position["y"])
            ) {
                aTile.point[coordinate] = tileObj.point[coordinate]
            }
        }
    })
}

function mutatePointsForTopRight(aTile, tileObj, coordinate) {
    aTile.point[coordinate]++
    tileObj.point[coordinate] = aTile.point[coordinate];
    state.player[state.currentPlayer].forEach((aTile) => {
        for (let i = 1; i < state.toWin; i++) {
            if (
                (tileObj.position["x"] + i === aTile.position["x"] &&
                    tileObj.position["y"] - i === aTile.position["y"]) ||
                (tileObj.position["x"] - i === aTile.position["x"] &&
                    tileObj.position["y"] + i === aTile.position["y"])
            ) {
                aTile.point[coordinate] = tileObj.point[coordinate]
            }
        }
    })
}

function checkWinner(point) {
    if (point >= state.toWin) {
        return true;
    }
    return false;
}


function winThroughXorY(tileObj, coordinate) {
    state.player[state.currentPlayer].forEach(aTile => {
        if (
            aTile.position[coordinateReverse(coordinate)] ===
            tileObj.position[coordinateReverse(coordinate)] &&
            (aTile.position[coordinate] === tileObj.position[coordinate] + 1 ||
                aTile.position[coordinate] === tileObj.position[coordinate] - 1)
        ) {
            mutatePointsForXorY(aTile, tileObj, coordinate);
            if (checkWinner(tileObj.point[coordinate])) declareWinner();
        }
    })
}

function winThroughDiagonalTopLeft(tileObj) {
    state.player[state.currentPlayer].forEach((aTile) => {
        if (
            (tileObj.position["x"] === aTile.position["x"] + 1
                && tileObj.position["y"] === aTile.position["y"] + 1) ||
            (tileObj.position["x"] === aTile.position["x"] - 1
                && tileObj.position["y"] === aTile.position["y"] - 1)
        ) {
            mutatePointsForTopLeft(aTile, tileObj, "topLeft");
            if (checkWinner(tileObj.point["topLeft"])) declareWinner();
        }
    });
}

function winThroughDiagonalTopRight(tileObj) {
    state.player[state.currentPlayer].forEach((aTile) => {
        if (
            (tileObj.position["x"] === aTile.position["x"] + 1
                && tileObj.position["y"] === aTile.position["y"] - 1) ||
            (tileObj.position["x"] === aTile.position["x"] - 1
                && tileObj.position["y"] === aTile.position["y"] + 1)
        ) {
            mutatePointsForTopRight(aTile, tileObj, "topRight");
            if (checkWinner(tileObj.point["topRight"])) declareWinner();
        }
    });
}


/*
function mutatePoints(aTile, tileObj, coordinate) {
    aTile.point[coordinate] = 1
    tileObj.point[coordinate] = 1
}

function checkWinner(coordinate) {
    let result = state.player[state.currentPlayer].reduce((sum, curr) => sum + curr.point[coordinate], 0)
    return result >= state.toWin
}
*/

function declareWinner() {
    DOM.alert.innerText = `Игра окончена, победил ${state.currentPlayer} !`
    state.winner = true
    gamePlayOff()
}

function tileNotEmptyWarning() {
    DOM.alert.innerText = 'Эта ячейка не пустая'
}

function checkDraw() {
    return state.player.x.length + state.player.o.length === DOM.cells.length
}

function declareDraw() {
    DOM.alert.innerText = `Это ничья`;
    gamePlayOff()
}

function switchPlayer(currentPlayer) {
    return state.currentPlayer = currentPlayer === 'x' ? 'o' : 'x'
}

function gamePlayOff() {
    DOM.cells.forEach((cell) => {
        cell.removeEventListener("click", insertToken);
    });
}

function newGame() {
    document.location.reload()
}

function insertToken(event) {
    const tile = event.target;
    let cell = document.getElementById(tile.id);
    if (isCanvasBlank(cell)) {
        DOM.alert.innerText = ''
        let ctx = cell.getContext("2d");
        if (state.currentPlayer === "x") {
            ctx.beginPath();
            ctx.lineWidth = 10
            ctx.moveTo(15, 15);
            ctx.lineTo(85, 85);
            ctx.moveTo(85, 15);
            ctx.lineTo(15, 85);
            ctx.strokeStyle = "#7e1ea6";
            ctx.stroke();
            ctx.closePath();
        } else if (state.currentPlayer === "o") {
            ctx.beginPath();
            ctx.lineWidth = 10
            ctx.arc(50, 50, 35, 0, 2 * Math.PI, false);
            ctx.strokeStyle = "#8b096a";
            ctx.stroke();
            ctx.closePath();
        }
        const tileObj = tileJSPosition(tile.id);
        addTokenToState(tileObj);
        addPointsToToken(
            state.player[state.currentPlayer][
            state.player[state.currentPlayer].length - 1
                ]
        );
        if (checkDraw() & !state.winner) declareDraw();
        switchPlayer(state.currentPlayer);
    } else {
        tileNotEmptyWarning();
    }
}

function settings() {
    gamePlayOff()
    const boardSizeNum = +DOM.boardSizeInput.value
    if (!isNaN(boardSizeNum) && DOM.boardSizeInput.value.trim() !== '') {
        state.boardSize = boardSizeNum
        DOM.board.innerHTML = ''
        for (let i = 0; i < boardSizeNum; i++) {
            const boardRow = document.createElement('div');
            boardRow.classList = "row x" + (i + 1);
            for (let i1 = 0; i1 < boardSizeNum; i1++) {
                const boardCell = document.createElement("canvas");
                boardCell.id = "x" + (i + 1) + " " + "y" + (i1 + 1);
                boardCell.width = "100"
                boardCell.height = "100"
                boardRow.insertAdjacentElement("beforeend", boardCell);
            }
            DOM.board.insertAdjacentElement("beforeend", boardRow);
        }
    }
    const toWinNum = +DOM.toWinInput.value
    if (!isNaN(toWinNum) && DOM.toWinInput.value.trim() !== '') {
        state.toWin = toWinNum
    }
    state.winner = false
    state.currentPlayer = "x"
    DOM.cells = getCellsElements();
    DOM.boardSizeInput.value = ''
    DOM.toWinInput.value = ''
    DOM.submitBtn.disabled = 'true'
    DOM.alert.innerText = ''
    state.player = {
        x: [],
        o: [],
    }
    main()
}

DOM.boardSizeInput.addEventListener('change', () => DOM.submitBtn.removeAttribute('disabled'))

DOM.reset.addEventListener('click', () => newGame())
DOM.submitBtn.addEventListener('click', () => settings())