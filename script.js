const GameBoard = (function() {
    const gameBoard = [];


    for(let i = 0; i<3;i++){
        gameBoard[i] = [];
        for(let j = 0; j<3;j++){
            gameBoard[i].push(cell())
        }
        
    }
    const getBoard = ()=>gameBoard;

    const boardDiv = ()=>{
        const div = document.querySelector(".gameboard");
        return div;
    }

    function cell() {
        let value = " ";
        const div = document.createElement("div");
        div.innerHTML = value;
        div.classList.add("cell");
        const getValue = ()=>value;
    
        const setValue = (symbol)=> {
            if(value==" "){
                value = symbol;
                div.innerHTML = value;
            }
        }
        const clearValue = ()=>{
            value = " ";
            div.innerHTML = value;
        }
        const getDiv = ()=>div;
    
        return {getValue,getDiv,setValue,clearValue};
    }
    
    return {getBoard,boardDiv};
});


function screenController(){
    let playable = true;
    let game = gameController();
    const gameB = GameBoard();
    const board = gameB.getBoard();
    const boardDiv = gameB.boardDiv();
    const start = document.querySelector(".submit");
    const reset = document.querySelector(".reset");
    const menuContainer = document.querySelector(".menu");
    const player1 = document.querySelector("#p-one");
    const player2 = document.querySelector("#p-two");
    const footer = document.querySelector('.footer');
    let playerArr = game.getPlayers()
    const resetGame = ()=>{
        boardDiv.innerHTML = "";
        boardDiv.classList.add("hidden");
        reset.classList.add("hidden");
        menuContainer.classList.remove('hidden');
        footer.textContent = "";
        screenController();

        
    }
    reset.addEventListener('click',resetGame);

    const menuControl = ()=>{
        menuContainer.classList.add("hidden");
        boardDiv.classList.remove("hidden");
        reset.classList.remove("hidden");
        game = gameController(player1.value,player2.value);
        
    }
    start.addEventListener('click',menuControl);

    const winHandeler = ()=>{
        
        if(checkForWin(board)>0){
            footer.textContent = game.getPlayers()[0].playerName + " WINS!!!!";
            playable = false;
        }
        else if(checkForWin(board)<0){
            footer.textContent = game.getPlayers()[1].playerName + " WINS!!!!";
            playable = false;
        }
        else if(!movesLeft(board)){
            footer.textContent = "It's A Draw!!!!";
            playable = false;

        }
    }
    const AIMove = ()=>{
        let move = bestMove(board);
        board[move.row][move.col].setValue("O");
    }
    const updateScreen = ()=>{
        for(let i = 0; i<3;i++){
            for(let j = 0 ; j<3;j++){
                board[i][j].getDiv().addEventListener('click', (e)=>{
                    if(!playable) return;
                    if(e.target.textContent != " ") return;
                    let activeSymbol = game.getSymbol();
                    board[i][j].setValue(activeSymbol);
        
                    if(playerArr[1].isAi==true) AIMove();
                    else game.switchActive();
                    winHandeler();
                    });
                boardDiv.appendChild(board[i][j].getDiv());
            }
        }
    }
    updateScreen();

}
function gameController(playerOneName= "player 1", playerTwoName = "player 2"){
    
    const player=[{
        playerName: playerOneName,
        symbol: "X",
        isAi: false,
        isMin:false,
    },{
        playerName: playerTwoName,
        symbol:"O",
        isAi: false,
        isMin: true,
    }];
    const aiToggle = document.querySelector(".AI-toggle");
    aiToggle.textContent = "Player vs Player";
    aiToggle.addEventListener('click',(e)=>{
        player[1].isAi=true;
        e.target.textContent = e.target.textContent == "Player vs Ai" ? "Player vs Player":"Player vs Ai";
    });

    let activePlayer = player[0];
    const getPlayers = ()=> player;
    const getActivePlayer = ()=> activePlayer;
    const getSymbol = ()=> activePlayer.symbol;

    const switchActive = ()=> activePlayer = activePlayer == player[0] ? player[1]:player[0];
    
    return {getActivePlayer,getPlayers,switchActive,getSymbol};
}

function checkForWin(board){
    let score = 0;
    let diagonal1 = [];
    let diagonal2 = [];
    
    for(let i = 0; i<3;i++){
        if(board[i].every((e) =>e.getValue()=="X")) return 10;
        if(board[i].every((e) =>e.getValue()=="O")) return -10;
    }

    for(let i =0; i<3;i++){
        let column = [];
        for(let j = 0; j<3;j++){
            column.push(board[j][i]);
        }
        if(column.every((e)=>e.getValue()=="X")) return 10;
        if(column.every((e)=>e.getValue()=="O")) return -10;
    }

    for(let i = 0; i<3;i++){
        diagonal1.push(board[i][i]);
        diagonal2.push(board[i][2-i]);
    }

    if(diagonal1.every((e)=>e.getValue()=="X") || diagonal2.every((e)=>e.getValue()=="X")) return 10;
    if(diagonal1.every((e)=>e.getValue()=="O") || diagonal2.every((e)=>e.getValue()=="O")) return -10;

    return 0;
}
function movesLeft(board){
    for(let i = 0; i<3;i++){
        for(let j =0;j<3;j++){
            if(board[i][j].getValue()==" ") return true;
        }
    }
    return false;
}
function minMax(board, isMax,depth){
    let score=checkForWin(board);

    if(score==10) return score - depth;
    if(score==-10) return score + depth;
    if(!movesLeft(board))return score;

    if(isMax){
        let best = -100;
        for(let i = 0;i<3;i++){
            for(let j = 0; j<3;j++){
                if(board[i][j].getValue()==" "){

                    board[i][j].setValue("X");
                    best = Math.max(best,minMax(board,!isMax,depth+1));
                    board[i][j].clearValue();
                }
            }
        }
        return best;
    }else{
        let best = 100;
        for(let i = 0; i<3;i++){
            for(let j =0; j<3; j++){
                if(board[i][j].getValue()==" "){

                    board[i][j].setValue("O");
                    best = Math.min(best,minMax(board,!isMax,depth+1));
                    board[i][j].clearValue();
                }
            }
        }
        return best;
    }
}
function bestMove(board){
    let move = {
        col: -1,
        row: -1,
        bestScore: -100,
    }

    for(let i = 0; i<3;i++){
        for(let j =0; j<3; j++){
            if(board[i][j].getValue()==" "){
                board[i][j].setValue("X");
                let score = minMax(board,false,0);
                console.log(score);
                board[i][j].clearValue();

                if(score>move.bestScore){
                    move.bestScore = score;
                    move.col= j;
                    move.row = i;
                }
            }
        }
    }
    return move;

}
screenController();