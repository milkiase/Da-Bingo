import {useState, useEffect, useReducer, useRef, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { addCall, resetGame, setCalls, setGameBetAmount, setGamePatternType, setGamePercentage, setGameWinAmount, setID, setIsWon, setPlayers} from '../store/game/gameSlice';
import { selectCalls } from '../store/game/gameSelectors';
import { chime7} from '../assets/chimes';
import AmhCallVoices from '../assets/voices/Amh';
import TigCallVoices from '../assets/voices/Tig';


import { generateRandomNumbers, getColor, getLast5Calls, getLetter, TLastCall} from '../utils/game.utils';

import Pattern from '../components/Pattern/Pattern.component';
import BingoBoard from '../components/BingoBoard/BingoBoard.component';
import BallDisplay from '../components/BallDisplay/BallDisplay.component';
import { addGameScore, getGame, resetGameScores } from '../utils/backend.utils';
import CheckCard from '../components/CheckCard/CheckCard.component';
import { selectPattern } from '../store/setup/setupSelectors';
// import { selectPattern } from '../store/setup/setupSelectors';


const INITIAL_BALL_STATE = {
    color: 'gold',
    number: 0.0,
    letter: 'Bingo'
}
// let gamePlayInterval = setInterval(()=>{}, 5000)

const GAME_REDUCER_TYPES = {
    started: 'GAME_STARTED',
    paused: 'GAME_PAUSED',
    ended: 'GAME_ENDED',
}

const gameReducer = (_state: unknown, action: { type: unknown; })=>{
    switch(action.type){
        case GAME_REDUCER_TYPES.started:
            return {isStarted: true, isPaused: false, isEnded: false}
        case GAME_REDUCER_TYPES.paused:
            return {isStarted: false, isPaused: true, isEnded: false}
        case GAME_REDUCER_TYPES.ended:
            return {isStarted: false, isPaused: false, isEnded: true}
    }
}

const btnColor = {
    'Start Game': " bg-green-500 hover:bg-green-600",
    'Resume Game': " bg-yellow-500 hover:bg-yellow-600",
    'Pause Game': " bg-red-500 hover:bg-red-600",
}

// const intialPattern:boolean[][] = getPresetPatterns().pattern
const initialRandomNumbers = generateRandomNumbers()
let gamePlayInterval = setInterval(()=>{}, 3000)
function Game() {
    // const setupPattern = useSelector(selectPattern)
    const dispatch = useDispatch()
    const [language, setLanguage] = useState('Amh')
    const {id} = useParams()
    // const gamePatternType = useSelector(selectGamePattern)
    const gamePattern = useSelector(selectPattern)
    // const [gamePattern, setGamePattern] = useState(intialPattern)
    // useEffect(()=>{
    //     // setGamePattern(getPresetPatterns(gamePatternType).pattern)
    //     setGamePattern(JSON.parse(localStorage.getItem('pattern') as string))
    // },[gamePatternType])
    const [pageError, setPageError] = useState({loading: true, error: false})
    const callsList = useSelector(selectCalls)
    const [displayBallState, setDisplayBallState] = useState(INITIAL_BALL_STATE)
    const [last5Calls, setLast5Calls] = useState<TLastCall[]>([])
    const randomNumbersRef = useRef(initialRandomNumbers)
    const gameProgress = useRef(0)
    const resetRef = useRef<HTMLDialogElement | null>(null)
    const [toggleShuffle, setToggleShuffle] = useState(false)
    const [gameState, gameStateDispatcher] = useReducer(gameReducer, {isStarted: false, isPaused: false, isEnded: true})
    const [autoplaySpeed, setAutoplaySpeed] = useState(9)
    // const autoplaySpeed = useRef(0)
    const setDisplayBallStateHandler = (number:number)=>{
        const letter = getLetter(number)
        setDisplayBallState({letter, color: getColor(letter), number})
    }

    useEffect(()=>{
        setLast5Calls(getLast5Calls(callsList) as TLastCall[])
    }, [callsList])

    useEffect(()=>{
        const fetchGame = async (gameId:string)=>{
            try {
                const response = await getGame(gameId)
                //console.log(response.data)
                const {players, scores, isWon, _id, amount, pattern, winamount, percentage} = response.data
                //console.log({players, scores, isWon, _id, amount, pattern, winamount, percentage})
                //console.log(response)
                dispatch(setPlayers(players as number[]) )
                dispatch(setCalls(scores))
                setDisplayBallStateHandler(scores[scores.length - 1] || 0)
                setLast5Calls(getLast5Calls(scores) as TLastCall[])
                dispatch(setIsWon(isWon))
                dispatch(setID(_id))
                dispatch(setGameBetAmount(amount))
                dispatch(setGamePatternType(pattern))
                dispatch(setGameWinAmount(winamount))
                dispatch(setGamePercentage(percentage))
                const length:number = scores.length as number
                gameProgress.current = length
                if(0 < length && length < 74) gameStateDispatcher({type: GAME_REDUCER_TYPES.paused}) 
                else gameStateDispatcher({type: GAME_REDUCER_TYPES.ended})
                // randomNumbersRef.current = []
                for(let i = 0; i < scores.length; i++){
                    const randomIndex = randomNumbersRef.current.indexOf(scores[i])
                    if(randomIndex !== i) {
                        [randomNumbersRef.current[i], randomNumbersRef.current[randomIndex]] = [randomNumbersRef.current[randomIndex], randomNumbersRef.current[i]]
                    }
                }
                setPageError({loading: false, error: false})
            } catch (error) {
                //console.log(error)
                setPageError({loading: false, error: true})
            }
        }
        fetchGame((id as string))
    }, [])

    const say = (number:number)=>{
        let callVoice
        if(language === 'Amh' || number === 39){
            const prop = ('callVoice' + number )as (keyof typeof AmhCallVoices)
            callVoice = AmhCallVoices[prop]
        }else{
            const prop = ('callVoice' + number )as (keyof typeof TigCallVoices)
            callVoice = TigCallVoices[prop]
        }
        const voice = new Audio(callVoice)
        voice.play()
    }
    const chimeSound = useMemo(()=>{
        const sound = new Audio(chime7);
        return sound
    }, [])

    const pickNumber =async ()=>{
        const randomNumber = randomNumbersRef.current[gameProgress.current]
        try {
            await addGameScore(id as string, randomNumber)
            setDisplayBallStateHandler(randomNumber)
            dispatch(addCall(randomNumber))
            chimeSound.play()
            
            setTimeout(()=>{
                say(randomNumber)
            }, 500)
        } catch (error) {
            clearInterval(gamePlayInterval)
            //console.log('error trying to update the game', error)
        }
        // setDisplayBallStateHandler(randomNumber)
        // dispatch(addCall(randomNumber))
        // chimeSound.play()
        
        // setTimeout(()=>{
        //     say(randomNumber)
        // }, 500)
        
        gameProgress.current += 1
        if(gameProgress.current >= randomNumbersRef.current.length){
            clearInterval(gamePlayInterval)
            gameStateDispatcher({type: GAME_REDUCER_TYPES.ended})
        }
    }
    const resetGameHandler = async ()=>{
        dispatch(resetGame())
        clearInterval(gamePlayInterval)
        gameStateDispatcher({type: GAME_REDUCER_TYPES.ended})
        try {
            await resetGameScores(id as string)
        } catch (error) {
            //console.log('error trying to reset the game' + id, error)
        }
    }
    const startGame = ()=>{
        if(gameState?.isEnded){
            randomNumbersRef.current = generateRandomNumbers()
            resetGameHandler()
            gameProgress.current = 0
            // shuffleSound.play()
        }
        gameStateDispatcher({type: GAME_REDUCER_TYPES.started})
        // clearInterval(gamePlayInterval)
        gamePlayInterval = setInterval(()=>{
            pickNumber()
        },  autoplaySpeed * 1000)
    }
    const pauseGame = ()=>{
        clearInterval(gamePlayInterval)
        gameStateDispatcher({type: GAME_REDUCER_TYPES.paused})
    }
    
    const handleStartClick = ()=>{
        if(gameState?.isEnded || gameState?.isPaused){
            startGame()
        }else{
            pauseGame()
        }

    }

    const startPauseBtnValue = useMemo(()=>{
        if(gameState?.isEnded) return 'Start Game'
        if(gameState?.isPaused) return 'Resume Game'
        // if(gameState?.isStarted) return 'Pause Game'
        else return 'Pause Game'
    }, [gameState])

    const shuffleBoard = ()=>{
        setToggleShuffle(!toggleShuffle)
    }
    const showCheckBoard = useMemo(()=>{
        if(gameState?.isPaused || (gameState?.isEnded && callsList?.length === 75)) return true
        return false
    }, [gameState, callsList])
    
    const sliderChangeHandler = (value:number | number[])=>{
        //console.log(value)
        setAutoplaySpeed((value as number))
        // autoplaySpeed.current = value as number
    }

    if(pageError.error || pageError.loading) return <div className='w-full h-full flex pt-[40vh] justify-center align-middle '>
        <div className='flex text-center'>
            <span className="loading loading-ring loading-lg"></span>
            {pageError.error && <Link to={'/'} className='link self-center ml-4'>Go Back</Link>}
        </div>
    </div>
    return (
        <div className='ml-3 overflow-hidden'>
            <div className='flex justify-center'>
                
                <div className="">
                    
                    <div className="flex justify-between pb-0 mb-0 no-wrap justify-space-between white-text w-full ">
                        <div className="flex flex-col text-center mt-0">
                            <div className="callNumber notranslate"><span>{callsList.length}</span></div>
                            <div className="callNumber-text uppercase w-8">Total Calls</div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="callNumber notranslate"><span>{callsList[callsList.length - 2] || 0}</span></div>
                            <div className="callNumber-text uppercase w-8">Previous Call</div>
                        </div>
                    </div>
                    <Pattern  pattern={gamePattern}/>
                    
                </div>
                <div className='board-side'>
                    <BingoBoard toggleShuffle={toggleShuffle}></BingoBoard>
                </div>
            </div>
            <div className='flex justify-between'>
                <div className='flex flex-col gap-y-4  text-center ml-10 mt-10'>
                    <button className={'btn  text-white' + (btnColor[startPauseBtnValue])}onClick={handleStartClick}> {startPauseBtnValue} </button>
                    {/* <button disabled={gameState?.isStarted} className='btn btn-neutral mx-1 text-white' onClick={callNextNumber}>Call Next Number</button> */}
                    <button disabled={!gameState?.isPaused} className='btn mx-1' 
                        onClick={()=>resetRef.current?.showModal()}
                    >Reset Board</button>
                    <button disabled={!(gameState?.isEnded && callsList.length === 0)} className='btn btn-neutral mx-1 text-white' onClick={shuffleBoard}>Shuffle Board</button>
                    <select name="language" id="language" className='ml-1 mr-auto py-1 rounded bg-neutral' 
                        onChange={(e)=>{setLanguage(e.target.value)}} value={ language }
                        disabled={gameState?.isStarted}>
                        <option value="Amh">Amharic</option>
                        <option value="Tig">Tigrigna</option>
                    </select>
                    <div className=''>
                        <Slider onChange={sliderChangeHandler} min={3} max={15} disabled={gameState?.isStarted} value={autoplaySpeed}/> Speed
                    </div>
                </div>
                {showCheckBoard &&  <CheckCard onGameOver={resetGameHandler}></CheckCard>}
                <div className='flex flex-col mr-8 '>
                    {/* ----------- Current Ball Display ------------- */}
                    <div className=" -pb-24 game-controls">
                        <BallDisplay {...displayBallState}></BallDisplay>
                    </div>
                    <div className='game-controls w-60 min-w-60 self-center mt-4'>
                        <h6 className="text-center mb-2 mt-1">Last 5 Calls</h6>
                        <div className="previous-calls ">
                            {last5Calls.map(call => {
                                return (
                                <div key={call.number} className={call.color}><span>{call.letter}{call.number}</span></div>
                                )
                            })}
                        </div>
                    </div>
                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    {/* <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button> */}
                    <dialog id="my_modal_1" className="modal"  ref={resetRef}>
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Careful !!</h3>
                        <p className="py-4">Are you sure you want to reset all this Game's progress ?</p>
                        <div className="modal-action">
                        <form method="dialog" className='flex justify-end gap-12 pr-4'>
                            {/* if there is a button in form, it will close the modal */}
                            <button onClick={resetGameHandler} className="btn btn-error w-20">Yes</button>
                            <button className="btn btn-success w-20">Cancel</button>
                        </form>
                        </div>
                    </div>
                    </dialog>
                </div>

            </div>
        </div>
    )
}

export default Game;