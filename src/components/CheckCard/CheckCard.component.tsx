import { useState, useEffect, useMemo, FormEvent, ChangeEvent, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCalls, selectPlayers, selectCurrentGameID } from '../../store/game/gameSelectors';
import { removePlayer } from '../../store/game/gameSlice';
import Confetti from 'react-confetti';

import TOTAL_CARDS from '../../cards';
import Pattern from '../Pattern/Pattern.component';
import './CheckCard.styles.scss';
import { getPresetPatterns } from '../../utils/game.utils';
import { setGameIsWon } from '../../utils/backend.utils';

const initialPattern = getPresetPatterns().pattern

type CheckCardProps = {
    onGameOver: (number: number)=>void
}
function CheckCard({onGameOver}:CheckCardProps) {
    const dispatch = useDispatch()
    const callsList = useSelector(selectCalls)
    const players = useSelector(selectPlayers)
    const [cardNumber, setCardNumber] = useState(0)
    const [pattern, setPattern] = useState(initialPattern)
    const [checkedCard, setCheckedCard] = useState([] as (number | string)[][])
    const [isChecked, setIsChecked] = useState(false)
    const [hasWon, setHasWon] = useState(false)
    const gameID = useSelector(selectCurrentGameID)
    const bingoWinRef = useRef<HTMLDialogElement | null>(null)
    const bingoBlockRef = useRef<HTMLDialogElement | null>(null)

    const checkCardHandler = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(cardNumber < 1 || cardNumber > 1000) return
        const cardValues = TOTAL_CARDS[cardNumber - 1]
        const newPattern = [...pattern]
        for(let i = 0; i < cardValues.length; i++){
            for(let j=0; j < 5; j++){
                if(i === 2 && j ===2){
                    newPattern[i][j] = true
                }else{
                    newPattern[i][j] = callsList.includes(cardValues[i][j] as number)
                }
            }
        }
        setPattern(newPattern)
        setCheckedCard(cardValues)
        setIsChecked(true)
    }

    const cardNumberChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
        setCardNumber(Number(e.target.value))
        setIsChecked(false)
    }
    useEffect(()=>{
        if(!callsList.length){
            setCheckedCard([])
        }
    }, [callsList])
    useEffect(()=>{
        if(hasWon){
            window.setTimeout(()=>{
                setHasWon(false)
                onGameOver(cardNumber)
            }, 20000)
        }
    }, [hasWon])
    const setHasWonHandler = async()=>{
        try {
            await setGameIsWon(gameID, cardNumber)
            setHasWon(true)
            const voice = new Audio('http://localhost/DaBingoApplause.mp3')
            voice.play()
            // console.log('game won successfully.', response.data)
        } catch (error) {
            // console.log('failed to set game as won.')
        }
    }
    const blockPlayer = ()=>{
        dispatch(removePlayer(cardNumber))
    }
    const canCheckNumber = useMemo(()=>{
        return players.includes(cardNumber)
    }, [players, cardNumber])
    return (
        <div className='flex flex-col justify-center align-middle px-8 bg-neutral-focus rounded'>
            <form onSubmit={checkCardHandler} className='flex gap-6 mt-2'>
                <input type="number" className=' input rounded-sm w-28' value={cardNumber} onChange={cardNumberChangeHandler} />
                <button className='btn btn-primary rounded-sm' disabled={!canCheckNumber}>Check</button>
            </form>
            <div className='flex  flex-col mx-auto'>
                <Pattern pattern={pattern} hasHeader={false} checkedCard={checkedCard}/>
                <div className='flex justify-between'>
                    <button className='btn btn-success h-8 min-h-8 my-2 uppercase text-gray-800 rounded-sm'
                        onClick={()=>bingoWinRef.current?.showModal()}
                        disabled={!isChecked && !canCheckNumber}
                    >Bingo</button>
                    <button className='btn btn-error h-8 min-h-8 my-2 uppercase text-gray-800 rounded-sm' 
                        onClick={()=>bingoBlockRef.current?.showModal()} disabled={!isChecked && !canCheckNumber}>
                            Block
                    </button>
            </div>
                </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="bingo-win-modal" className="modal pb-24" ref={bingoWinRef}>
            <div className="modal-box ">
                <h3 className="font-bold text-lg">Confirm !!</h3>
                <p className="pt-4 pb-2">Are you sure the player below is the winner ? </p>
                <p className="pb-4">If you choose 'YES' the game will be Ended.</p>
                <div className="modal-action">
                <form method="dialog" className='flex justify-end gap-12 pr-4'>
                    {/* if there is a button in form, it will close the modal */}
                    <button onClick={setHasWonHandler} className="btn btn-success w-20">Yes</button>
                    <button className="btn btn-error w-20">NO</button>
                </form>
                </div>
            </div>
            </dialog>

            <dialog id="bingo-win-modal" className="modal pb-24" ref={bingoBlockRef}>
            <div className="modal-box ">
                <h3 className="font-bold text-lg">Confirm !!</h3>
                <p className="pt-4 pb-2">Are you sure you want to BLOCK the player? </p>
                <div className="modal-action">
                <form method="dialog" className='flex justify-end gap-12 pr-4'>
                    {/* if there is a button in form, it will close the modal */}
                    <button onClick={blockPlayer} className="btn btn-error w-20">Yes</button>
                    <button className="btn btn-success w-20">NO</button>
                </form>
                </div>
            </div>
            </dialog>
            {hasWon && <div>
                <Confetti numberOfPieces={600} />
                <p className=' bg-opacity-90 absolute top-1/3 left-1/4 text-9xl rounded mx-auto px-10 py-4 z-10 uppercase bingo-winner'>Bingo <span>#{cardNumber}</span></p>
            </div>}
        </div>
    )
}

export default CheckCard