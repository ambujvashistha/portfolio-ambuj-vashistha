import { useState, useEffect, useRef } from 'react'
import './TicTacToe.css'

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diagonals
]

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  if (!board.includes(null)) return { winner: 'Draw', line: [] }
  return null
}

function minimax(board, depth, isMaximizing, playerSymbol, cpuSymbol) {
  const result = checkWinner(board)
  if (result) {
    if (result.winner === cpuSymbol) return 10 - depth
    if (result.winner === playerSymbol) return depth - 10
    return 0
  }

  if (isMaximizing) {
    let bestScore = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = cpuSymbol
        let score = minimax(board, depth + 1, false, playerSymbol, cpuSymbol)
        board[i] = null
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = playerSymbol
        let score = minimax(board, depth + 1, true, playerSymbol, cpuSymbol)
        board[i] = null
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [playerSymbol, setPlayerSymbol] = useState(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [result, setResult] = useState(null)
  const [inView, setInView] = useState(false)
  
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.3 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (result || !playerSymbol || isPlayerTurn) return

    const cpuSymbol = playerSymbol === 'X' ? 'O' : 'X'
    
    // Slight delay for "thinking"
    const timer = setTimeout(() => {
      // Find best move
      let bestScore = -Infinity
      let bestMove = -1
      
      const newBoard = [...board]

      // Simple AI optimization for the first move to save stack space
      const emptyCount = newBoard.filter(c => c === null).length
      if (emptyCount === 9 || emptyCount === 8) {
         const cornersAndCenter = [0,2,4,6,8]
         const ev = cornersAndCenter.filter(i => newBoard[i] === null)
         bestMove = ev[Math.floor(Math.random() * ev.length)] || newBoard.findIndex(x => x === null)
      } else {
        for (let i = 0; i < 9; i++) {
          if (!newBoard[i]) {
            newBoard[i] = cpuSymbol
            let score = minimax(newBoard, 0, false, playerSymbol, cpuSymbol)
            newBoard[i] = null
            if (score > bestScore) {
              bestScore = score
              bestMove = i
            }
          }
        }
      }

      if (bestMove !== -1) {
        newBoard[bestMove] = cpuSymbol
        setBoard(newBoard)
        const res = checkWinner(newBoard)
        if (res) setResult(res)
        else setIsPlayerTurn(true)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [board, isPlayerTurn, playerSymbol, result])

  const handleClick = (index) => {
    if (!playerSymbol || board[index] || result || !isPlayerTurn) return

    const newBoard = [...board]
    newBoard[index] = playerSymbol
    setBoard(newBoard)
    
    const res = checkWinner(newBoard)
    if (res) setResult(res)
    else setIsPlayerTurn(false)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setResult(null)
    setPlayerSymbol(null)
    setIsPlayerTurn(true)
  }

  return (
    <div className={`ttt-container ${inView ? 'in-view' : ''}`} ref={containerRef}>
      <h3 className="ttt-title handwritten-line">
        Bored? Let's play.
      </h3>
      
      {!playerSymbol ? (
        <div className="ttt-chooser">
          <p className="handwritten-line" style={{fontSize: '1rem'}}>Pick your pencil:</p>
          <div className="ttt-chooser-btns">
            <button onClick={() => setPlayerSymbol('X')} className="ttt-btn handwritten-line">X</button>
            <button onClick={() => setPlayerSymbol('O')} className="ttt-btn handwritten-line">O</button>
          </div>
        </div>
      ) : (
        <div className="ttt-game">
          <div className="ttt-status handwritten-line">
            {result ? (
              result.winner === 'Draw' ? "It's a draw!" : 
              result.winner === playerSymbol ? "You win!" : "I win!"
            ) : (
              isPlayerTurn ? "Your turn" : "I'm thinking..."
            )}
          </div>
          
          <div className="ttt-board">
            <svg className="ttt-grid-svg" viewBox="0 0 300 300" preserveAspectRatio="none">
              {/* Vertical lines */}
              <path className="grid-line v-line-1" d="M100,5 Q105,150 95,295" />
              <path className="grid-line v-line-2" d="M200,10 Q195,150 205,290" />
              {/* Horizontal lines */}
              <path className="grid-line h-line-1" d="M5,100 Q150,105 295,95" />
              <path className="grid-line h-line-2" d="M10,200 Q150,195 290,205" />
            </svg>
            
            <div className="ttt-cells">
              {board.map((cell, idx) => (
                <div 
                  key={idx} 
                  className={`ttt-cell ${!cell && !result && isPlayerTurn ? 'ttt-cell-active' : ''}`}
                  onClick={() => handleClick(idx)}
                >
                  {cell && <span className="ttt-mark handwritten-line">{cell}</span>}
                </div>
              ))}
            </div>
            
            {result && result.winner !== 'Draw' && (
              <svg className="ttt-strike-svg" viewBox="0 0 300 300">
                <line 
                  className="strike-line"
                  x1={50 + (result.line[0] % 3) * 100} 
                  y1={50 + Math.floor(result.line[0] / 3) * 100} 
                  x2={50 + (result.line[2] % 3) * 100} 
                  y2={50 + Math.floor(result.line[2] / 3) * 100} 
                />
              </svg>
            )}
          </div>

          {result && (
            <button className="ttt-btn ttt-reset handwritten-line" onClick={resetGame}>
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
