//ensures html file is rendered before js file using addEventListener
document.addEventListener('DOMContentLoaded', () => {
    //search for div class called grid in html file using querySelector
    const grid = document.querySelector('.grid')
    //ten squares by ten squares 
    let width = 10
    //create an empty array squares
    let squares = []
    //set the number of bombs 
    let bombAmount = 20
    let isGameOver = false 
    let flags = 0

    // setLevel()

    // function setLevel() {
    //     level = document.getElementById('level').value
    //     switch(level) {
    //         case "easy": 
    //             level = {
    //                 width = 10
    //                 bombAmount = 20
    //             }
    //             createBoard()
    //             break;
    
    //         case "medium":
    //             level = {
    //                 width = 15
    //                 bombAmount = 70
    //             }
    //             createBoard()
    //             break;
            
    //             case "medium":
    //                 level = {
    //                     width = 20
    //                     bombAmount = 160
    //                 }
    //                 createBoard()
    //                 break;
                    
    //             default:
    //                 createBoard()
    //                 break;
    //     }
    // }
    
    //create Board
    function createBoard() {
        //get shuffled game array with random bombs
        //create array with bombAmount number of bombs 
        const bombsArray = Array(bombAmount).fill('bomb')
        //create an empty array with the remaining squares
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        //concantetate bombsArray and emptyArray to get a full array of ten by ten squares
        const gameArray = emptyArray.concat(bombsArray)
        //shuffle the array for each round of the game
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)


        for (let i = 0; i < width * width; i++) {
            //create a div for each sqaure using createElement
            const square = document.createElement('div')
            //give each sqaure a unique id using setAttribute
            square.setAttribute('id', i)
            //give each square a class name ???
            square.classList.add(shuffledArray[i])
            //passing each square as a parameter into the grid using appendChild
            grid.appendChild(square)
            //passing each sqaure as a parameter into sqaures array using push
            squares.push(square)

            //normal click
            square.addEventListener('click', function(e) {
                click(square)
            })

            //cntrl and left click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        for(let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = ( i % width === width - 1)
            
            if (squares[i].classList.contains('valid')) {
                //check west
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
                //check north east
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
                //check north
                if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
                //check north west
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
                //check east
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
                //check south west
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
                //check south east
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
                //check south
                if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
                squares[i].setAttribute('data', total)
                console.log(squares[i])
                
            }
        }
    }
    
    createBoard()
    
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

    document.querySelector('.restart').addEventListener('click',
    function(){
      window.location.reload();
      return false;
   }
);
})