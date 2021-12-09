const Player = function(name,sign){
    
    getSign = function(){
        return sign
    }
    getName = function(){
        return name
    }
    setName = function(newName){
        name = newName
    }

    return {getSign,getName,setName}

}

const AI = function (name,sign){
    const prototype = Player(name,sign)

    const _getPossibleStates = function(board){
        let possibleStates = [];
        possibleStates = [];
        for(let i=0; i<9; i++){
            if(!board[i]){
                possibleStates.push(i)
            }
        }

        return possibleStates;
        
    }

    let bestMoves = []

    const getRandomMove = function(){
        let possibleStates = _getPossibleStates(Gameboard.getBoardState())
        let randomNumber = Math.floor(Math.random() * possibleStates.length)
        return possibleStates[randomNumber]
    }

    const getBestMove = function(gameBoard,depth){
        
        let board = Object.assign({},gameBoard)
        let currentSign
        let previousSign
        if(depth % 2 === 0){
            currentSign = sign
            previousSign = nextSign(sign)
        }
        else{
            currentSign = nextSign(sign)
            previousSign = sign
        }

        result = winnerCheck(board,previousSign)
        if(result){
            let score
            if(result === sign){
                score = 100-depth
                //console.log(max)
            }
            if(result === nextSign(sign)){
                score = -100-depth
                //console.log(max)
            }
            if(result === "Draw"){
                score = 0;
            }
            return score
        }
        let scores = []
        let moves = []

        possibleStates = _getPossibleStates(board)
        possibleStates.forEach(state => {
           

            board[state] = currentSign
            scores.push(getBestMove(board,depth+1))
            
            moves.push(state)
            delete board[state]
        })
        if(depth === 0){
            console.log(scores)
            
            let max = Math.max(...scores)
            let indexes = []
            let newMoves = []
            for(let i=0; i<scores.length; i++){
                if(scores[i] === max){
                    indexes.push(i)
                }
            }
            
            for(let i=0; i<indexes.length; i++){
                newMoves.push(moves[indexes[i]])
            }
            
            [...bestMoves] = newMoves
            

        }
        if(depth%2 === 0){
            return Math.max(...scores)
        }
        else{
            return Math.min(...scores)
        }
    }

    const nextSign = function(sign){
        if(sign === "X") return "0"
        if(sign === "0") return "X"
    }

    const winnerCheck = function(boardState,sign){
        
        if((boardState[0] === boardState[1]) && (boardState[1] === boardState[2]) && (boardState[2] === sign) ||
        (boardState[3] === boardState[4]) && (boardState[4] === boardState[5]) && (boardState[5] === sign) ||
        (boardState[6] === boardState[7]) && (boardState[7] === boardState[8]) && (boardState[8] === sign) ||
        (boardState[0] === boardState[3]) && (boardState[3] === boardState[6]) && (boardState[6] === sign) ||
        (boardState[1] === boardState[4]) && (boardState[4] === boardState[7]) && (boardState[7] === sign) ||
        (boardState[2] === boardState[5]) && (boardState[5] === boardState[8]) && (boardState[8] === sign) ||
        (boardState[0] === boardState[4]) && (boardState[4] === boardState[8]) && (boardState[8] === sign) ||
        (boardState[2] === boardState[4]) && (boardState[4] === boardState[6]) && (boardState[6] === sign)) {
            return sign
        }

        if(Object.keys(boardState).length === 9){
            return "Draw"
        }
    }

    const getMove = function (board){
        getBestMove(board,0);
        console.log(bestMoves)
        if(bestMoves.length === 1){
            return bestMoves[0]
        }
        else{
            return bestMoves[Math.floor(Math.random()*bestMoves.length)]
        }
    }
    
    return Object.assign({}, prototype,{getRandomMove,getMove})
}

// const View = (function(){
      
// })()

const Gameboard = (function(){
    const board = document.querySelector(".board")
    const gameResult = document.querySelector(".game-result")
    const startGameBtn = document.getElementById("start-game")
    const player1Input = document.getElementById("player1")
    const player2Input = document.getElementById("player2")
    const player1Name = document.querySelector(".player1-name")
    const player2Name = document.querySelector(".player2-name")
    const gameStatus = document.querySelector(".play-game")
    const player1HumanBtn = document.getElementById('player-1-human')
    const player2HumanBtn = document.getElementById('player-2-human')
    const player1ComputerBtn = document.getElementById('player-1-computer')
    const player2ComputerBtn = document.getElementById('player-2-computer')
    let boardState = {}

    const Players = []
    let currentPlayer = 0


    const _renderBoard = function(){
        board.innerHTML = ''
        for(let i=0; i<9; i++){
            const cell = document.createElement('div')
            cell.classList.add("cell")
            cell.setAttribute("data-cell",i)
            cell.textContent = boardState[i]
            board.appendChild(cell)
        }
    }

    const round = function(){
        
        if(Players[currentPlayer].getRandomMove){
            let move = Players[currentPlayer].getMove(boardState)
            aiMove(move)
        }
        else{
            return
        }
        _renderBoard()
        let result = winnerCheck();
            if(result){
                gameResultRender(result)
                lockGameBoard();
            }
            else{
                changePlayer()
                _renderGameStatus()
                round()
            }
        
    }

    const addMark = function(event){
        if(event.target.classList[0] === "cell"){
            let cellNumber = event.target.getAttribute("data-cell")
            if(!boardState[cellNumber]){
                boardState[cellNumber] = Players[currentPlayer].getSign()
                _renderBoard()
                let result = winnerCheck();
                if(result){
                    gameResultRender(result)
                    lockGameBoard();
                }
                else{
                    changePlayer()
                    _renderGameStatus()
                    round()
                }
            }
        }
    }

    const winnerCheck = function(){
        let sign = Players[currentPlayer].getSign()
        if((boardState[0] === boardState[1]) && (boardState[1] === boardState[2]) && (boardState[2] === sign) ||
        (boardState[3] === boardState[4]) && (boardState[4] === boardState[5]) && (boardState[5] === sign) ||
        (boardState[6] === boardState[7]) && (boardState[7] === boardState[8]) && (boardState[8] === sign) ||
        (boardState[0] === boardState[3]) && (boardState[3] === boardState[6]) && (boardState[6] === sign) ||
        (boardState[1] === boardState[4]) && (boardState[4] === boardState[7]) && (boardState[7] === sign) ||
        (boardState[2] === boardState[5]) && (boardState[5] === boardState[8]) && (boardState[8] === sign) ||
        (boardState[0] === boardState[4]) && (boardState[4] === boardState[8]) && (boardState[8] === sign) ||
        (boardState[2] === boardState[4]) && (boardState[4] === boardState[6]) && (boardState[6] === sign)) {
            return sign
        }

        if(Object.keys(boardState).length === 9){
            return "Draw"
        }
    }

    const changePlayer = function(){
        currentPlayer = (currentPlayer === 0) ? 1 : 0
    }

    const gameResultRender = function(result){
        let template = ''
        if(result === "X" || result === "0"){
            template = `The winner is ${Players[currentPlayer].getName()}`
        }
        else{
            template = "Draw"
        }
        gameResult.textContent = template
        
    }

    const lockGameBoard = function(){
        board.removeEventListener('click',addMark)
    }

    const init = function(){
        boardState = {}            
        currentPlayer = 0;         
        gameResult.textContent = ''     
        checkPlayerOrAI();
        player1Name.textContent = Players[0].getName()
        player2Name.textContent = Players[1].getName()
        _renderGameStatus() 
        player1Input.style.display = "none"
        player2Input.style.display = "none"
        player1HumanBtn.style.display = "none"
        player2HumanBtn.style.display = "none"
        player1ComputerBtn.style.display = "none"
        player2ComputerBtn.style.display = "none"
        _renderBoard()
        board.addEventListener('click',addMark)
        round()      

    }

    const checkPlayerOrAI = function(){
        let Player1
        let Player2
        if(player1HumanBtn.disabled){
            Player1 = Player(player1Input.value || "Player 1", "X")
        }
        else{
            Player1 = AI(player1Input.value || "Player 1", "X")
        }
        if(player2HumanBtn.disabled){
            Player2 = Player(player2Input.value || "Player 2", "0")
        }
        else{
            Player2 = AI(player2Input.value || "Player 2", "0")
        }
        Players.push(Player1,Player2)
    }

    const _renderGameStatus = function(){
        gameStatus.textContent = `${Players[currentPlayer].getName()} - ${Players[currentPlayer].getSign()}. Your turn!`
    }

    const getBoardState = function(){
        return boardState
    }

    const aiMove = function(move){
        //let move = Players[currentPlayer].getRandomMove()
        boardState[move] = Players[currentPlayer].getSign()
        
    }

    
    _renderBoard()

    //event Listeners
    startGameBtn.addEventListener('click',init)

    player1HumanBtn.addEventListener('click', () => {
        player1HumanBtn.disabled = true
        player1ComputerBtn.disabled = false
    })

    player2HumanBtn.addEventListener('click', () => {
        player2HumanBtn.disabled = true
        player2ComputerBtn.disabled = false
    })

    player1ComputerBtn.addEventListener('click', () => {
        player1HumanBtn.disabled = false
        player1ComputerBtn.disabled = true
    })

    player2ComputerBtn.addEventListener('click', () => {
        player2HumanBtn.disabled = false
        player2ComputerBtn.disabled = true
    })


    return {getBoardState}

    
})()

x = AI("Ruslan", "X")