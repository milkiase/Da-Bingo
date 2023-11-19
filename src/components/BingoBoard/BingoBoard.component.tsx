import { useEffect, useState, useMemo, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCalls } from '../../store/game/gameSelectors';

import { BoardType, generateBingoBoard, getRandomBingoNumber } from '../../utils/game.utils';
// import {shuffle} from '../../assets/chimes';
import './BingoBoard.styles.scss';
import { resetGame } from '../../store/game/gameSlice';

const initialBoard = generateBingoBoard()
const manualMode = true

type BingoBoardProps = {
  toggleShuffle: boolean
}

function BingoBoard({toggleShuffle}:BingoBoardProps) {
    const dispatch = useDispatch()
    const callsList = useSelector(selectCalls)
    const [board, setBoard] = useState(initialBoard)
    const [isLoaded, setIsLoaded] = useState(false)
    // const manualCall = (number:number)=>{
        //console.log(number)
    // }

    const shuffleSound = useMemo(()=>{
        const sound = new Audio('shuffle');
        return sound
    }, [])

    const shuffleBalls = useCallback(() => {
      
      let i = 0
      const shuffleInterval = setInterval(()=> {
        const n = Math.ceil(getRandomBingoNumber(20, 40))
        setTimeout(()=>{
          if(i === 0) shuffleSound.play()
          const tempCalls:number[] = []
          for(let j = 0; j< n; j++){
            let m:number = 0
            while(tempCalls.includes(m)){
              m = getRandomBingoNumber()
            }
            tempCalls.push(m)
          }
          setBoard(generateBingoBoard(tempCalls))
          i++
          if(i > 45){
            clearInterval(shuffleInterval)
            dispatch(resetGame())
          }
        }, 1500)
      }, 150)
      
      shuffleSound.pause()

    }, [shuffleSound])
    
    useEffect(()=>{
      setBoard(generateBingoBoard(callsList))
    }, [callsList])
    useEffect(()=>{
      if(isLoaded) shuffleBalls()
      else setIsLoaded(true)

    }, [toggleShuffle, shuffleBalls])
    
    return (
        <div id="board" className="">
        {Object.keys(board).map((letter, i) => {
          return(
            <div key={"board-row-" + letter} className="row no-wrap set-size text-center notranslate flex flex-col">
              <div className="col board-letter bg-white text-[#FF0000] red-text">{letter}</div>
              {
                board[letter as keyof BoardType].map((number) => {
                  return(
                    <div key={number.display + i}
                        className={number.active ?  "col ball active w-16" : 
                        number.called ?  "col ball called w-16" : "col ball w-16"}>
                          {manualMode ? <button>{number.number}</button> : number.number}
                    </div>
                  )
                })
              }
            </div>
          )
        })}
      </div>
    )
}

export default BingoBoard;