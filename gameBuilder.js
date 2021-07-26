
//add Flag with right click
function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = '🚩'
            flags++
            checkForWin()
        } else {
            square.classList.remove('flag')
            square.innerHTML = ''
            flags -- 
        }
    }
}

//click on square actions
function click(square) {
    let currentId = square.id 
    //gameover then break
    if (isGameOver) return
    //square is already checked or flagged then break
    if (square.classList.contains('checked') || square.classList.contains('flag')) return
    if (square.classList.contains('bomb')) {
        gameOver(square)
    } else {
        let total = square.getAttribute('data')
        if (total != 0) {
            square.classList.add('checked')
            square.innerHTML = total
            //break the cycle
            return
        }
        checkSquare(square, currentId)
    }
    square.classList.add('checked')
}

function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)
    //happen a tiny bit after click using in-built method setTimeout()
    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 10) {
            const newId = squares[parseInt(currentId - width)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 11 && !isLeftEdge) {
            const newId = squares[parseInt(currentId - 1 - width)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > 98 && !isRightEdge) {
            const newId = squares[parseInt(currentId + 1)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = squares[parseInt(currentId - 1 + width)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 88 && !isRightEdge) {
            const newId = squares[parseInt(currentId + 1 + width)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < 89) {
            const newId = squares[parseInt(currentId + width)].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
    }, 10)
}

//game over
function gameOver(square) {
    console.log('BOOM! GAME OVER!')
    isGameOver = true

    //show ALL the bombs
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '💣'
        }
    })
}

//check for win
function checkForWin() {
    let matches = 0
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            matches++
        }
        if (matches === bombAmount) {
            console.log('You Win!')
            isGameOver = true
        }
    }
}