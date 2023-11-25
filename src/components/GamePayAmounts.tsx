import {useState, useEffect, ChangeEvent, FormEvent} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectCards, selectBetAmount, selectPercentage, selectWinAmount } from '../store/setup/setupSelectors';
import {changeBetAmount, changePercentage, changeWinAmount} from '../store/setup/setupSlice';
import { numberWithCommas } from '../utils/game.utils';

function GamePayAmounts() {
  const dispatch = useDispatch()
  const cards = useSelector(selectCards)
  const betAmount = useSelector(selectBetAmount)
  const percentage = useSelector(selectPercentage)
  const winAmount = useSelector(selectWinAmount)
  const [goTo, setGoTo] = useState(1)
  const [showPayAmounts, setShowPayAmounts] = useState(false)

  const betAmountChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    let amount = Number(e.target.value)
    if(amount < 1) amount = 1
    
    dispatch(changeBetAmount(amount))
  }
  const percentageChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    let amount = Number(e.target.value)
    if(amount < 1) amount = 1
    else if(amount > 100) amount = 100
    dispatch(changePercentage(amount))
  }
  const goToHandler = (event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault()
      const anchorlink = document.createElement('a')
      anchorlink.href = `#${goTo}`
      anchorlink.click()
  }
  useEffect(()=>{
      const newWinAmount = Math.floor(((betAmount * cards.length) * (100 - percentage) * 100))/10000
      dispatch(changeWinAmount(newWinAmount))
  }, [percentage, betAmount, cards])
  return (
    <div className='flex flex-wrap justify-between w-full mx-auto pr-4'>
          <form onSubmit={goToHandler} className='pt-2  flex'>
            <button className='btn  text-sm rounded-none min-h-6 h-6'>Go To:</button>
            <input type="number"
              className=' w-16 outline-none px-1 h-fit'
              value={goTo} onChange={(e)=>{setGoTo(Number(e.target.value))}}/>
          </form>
          <div className='flex justify-between gap-9'>
            {showPayAmounts && <div className='flex flex-wrap'>
              <span className='m-1 flex flex-wrap'>
                <label htmlFor="percentage" className='pt-1'>Percentage: </label>
                <input id='percentage' className="input border-0 rounded-none w-32 h-8 pt-0 bg-opacity-10" type="number" 
                  onChange={percentageChangeHandler} value={percentage} max={100} min={1}/>
              </span>
              <span className='m-1 flex flex-wrap'>
                <label htmlFor="bet-amount" className='pt-1'>Bet Amount: </label>
                <input id='bet-amount' type="number" className="input border-0 rounded-none w-32 h-8 pt-0 bg-opacity-10"
                    onChange={betAmountChangeHandler} value={betAmount} min={1}/>
              </span>
              <span className=' ml-3 flex flex-wrap pt-2 text-end'>Win Amount: <strong className="w-24 h-8 text-end"> {numberWithCommas(winAmount)} ETB</strong></span>
            </div>}
            <div className="form-control ">
              <label className="cursor-pointer label">
                {/* <span className="label-text">Remember me</span>  */}
                <input type="checkbox" className="toggle toggle-accent" checked={showPayAmounts} onChange={()=>{setShowPayAmounts(!showPayAmounts)}}/>
              </label>
            </div>
          </div>
    </div>
  )
}

export default GamePayAmounts