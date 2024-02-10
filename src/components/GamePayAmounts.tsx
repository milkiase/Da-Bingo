import {useState, useEffect, ChangeEvent, useMemo} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectCards, selectBetAmount, selectWinAmount, selectIsRoomLoading, selectCardObjList } from '../store/setup/setupSelectors';
import {changeBetAmount, changeWinAmount, fetchRoomAsync} from '../store/setup/setupSlice';
import { selectIsUserAdmin, selectUserInfo } from '../store/auth/authSelectors';
import { RootActions } from '../store/store';
import { selectRoom } from '../store/room/roomSelectors';
import { selectAllUsers } from '../store/admin/adminSelectors';
import { getUserName } from '../utils/game.utils';
import { fetchAllUsersAsync } from '../store/admin/adminSlice';
// import { numberWithCommas } from '../utils/game.utils';


function GamePayAmounts() {
  const dispatch:RootActions = useDispatch()
  const cards = useSelector(selectCards)
  const betAmount = useSelector(selectBetAmount)
  const isUserAdmin = useSelector(selectIsUserAdmin)
  const room = useSelector(selectRoom)
  const isRoomLoading = useSelector(selectIsRoomLoading)
  const cardObjList = useSelector(selectCardObjList)
  const userInfo = useSelector(selectUserInfo)
  // const percentage = useSelector(selectPercentage)
  const winAmount = useSelector(selectWinAmount)
  const allUsers = useSelector(selectAllUsers)
  // const [goTo, setGoTo] = useState(1)
  const [showPayAmounts, setShowPayAmounts] = useState(true)
  const [showSellDetail, setShowSellDetail] = useState(false)

  const betAmountChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    const amount = Number(e.target.value)

    // if(amount < 1) amount = 1
    
    dispatch(changeBetAmount(amount))
  }

  const winAmountChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    let amount = Number(e.target.value)
    if(amount < 1) amount = 0
    
    dispatch(changeWinAmount(amount))
  }

  const sellDetail = useMemo(()=>{
    return cardObjList?.reduce((prevValue: {userid: string, quantity: number}[], currentCard)=>{
      if(prevValue.some((card)=>card.userid === currentCard.userid)){
        return prevValue.map(card => card.userid === currentCard.userid ? {...card, quantity: card.quantity + 1} : card)
      }else{
        return [...prevValue, {userid: currentCard.userid, quantity : 1}]
      }
    }, [])
  }, [cardObjList])
  // const percentageChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
  //   let amount = Number(e.target.value)
  //   if(amount < 1) amount = 0
  //   else if(amount > 100) amount = 100
  //   dispatch(changePercentage(amount))
  // }
  // const goToHandler = (event:FormEvent<HTMLFormElement>)=>{
  //     event.preventDefault()
      // const anchorlink = document.createElement('a')
      // anchorlink.href = `#${goTo}`
      // anchorlink.click()
  // }
  // useEffect(()=>{
  //     const newWinAmount = Math.floor(((betAmount * cards.length) * (100 - percentage) * 100))/10000
  //     dispatch(changeWinAmount(newWinAmount))
  // }, [percentage, betAmount, cards])
  const refreshHandler = ()=>{
    // console.log('refresh')
    dispatch(fetchRoomAsync(room.gameID))
  }
  
  const toggleSellDetail = ()=>{
    setShowSellDetail(!showSellDetail)
  }

  useEffect(()=>{
    if(allUsers.length === 0){
      dispatch(fetchAllUsersAsync())
    }
  }, [])

  return (
    <div className='flex flex-wrap justify-between w-full mx-auto pr-4  text-gray-100'>
          {/* <form onSubmit={goToHandler} className='pt-2  flex'> */}
            {/* <button className='btn  text-sm rounded-none min-h-6 h-6' onClick={goToHandler}>Go To:</button> */}
            {/* <input type="number"
              className=' w-16 outline-none px-1 h-fit'
              value={goTo} onChange={(e)=>{setGoTo(Number(e.target.value))}}/>
          </form> */}
          <div className='flex justify-between gap-2 '>
            {showPayAmounts && <div className='flex flex-wrap bg-slate-800 pr-4'>
              <button className='btn h-8 max-h-8 min-h-8 self-center btn-success w-24' 
                onClick={refreshHandler}> {isRoomLoading ? <span className='loading loading-spinner loading-sm '></span> : 'update'}</button>
              {isUserAdmin ? 
                <span className=' mx-4 flex flex-wrap text-end text-lg pt-[2px] mt-1 text-gray-400'>
                  <span className=' text-sm link  self-center hover:font-semibold mb-1 w-12 mr-2  text-white' onClick={toggleSellDetail}>
                    details
                  </span>
                  Tot. Players: 
                  <strong className="w-8 h-8 text-start pl-1 text-white "> 
                    {cards.length}
                  </strong> 
                </span>:

              <span className=' mx-4 flex flex-wrap text-end text-lg pt-[2px] mt-1 text-gray-400'>Cards You Sold: <strong className="w-8 h-8 text-start pl-1 text-white"> {cardObjList?.filter(card => card.userid === userInfo.id).length}</strong></span>}
              {/* <span className=' mx-4 flex flex-wrap pt-2 text-end text-lg'>Bet Amount: <strong className="w-8 h-8 text-end"> {betAmount}</strong></span>
              <span className=' mx-4 flex flex-wrap pt-2 text-end text-lg'>Win Amount: <strong className="w-8 h-8 text-end"> {winAmount}</strong></span> */}
              {/* <span className='m-1 flex flex-wrap'>
                <label htmlFor="percentage" className='pt-1'>Percentage: </label>
                <input id='percentage' className="input border-0 rounded-none w-32 ml-1 h-8 pt-0 bg-opacity-10" type="number" 
                  onChange={percentageChangeHandler} value={percentage} max={100} min={1}/>
              </span> */}
              {isUserAdmin && <>
                <span className='m-1 flex flex-wrap'>
                <label htmlFor="bet-amount" className='pt-1 text-gray-400'>Bet Amount: </label>
                <input id='bet-amount' type="number" className="input border-0 rounded-none w-32 ml-1 h-8 pt-0 bg-opacity-20 bg-slate-400 text-white"
                    onChange={betAmountChangeHandler} value={betAmount.toString()} min={1}/>
              </span>
              {/* //  <span className=' ml-3 flex flex-wrap pt-2 text-end'>Win Amount: <strong className="w-24 h-8 text-end"> {numberWithCommas(winAmount)} ETB</strong></span> */}
              <span className='m-1 mr-0 flex flex-wrap'>
                <label htmlFor="win-amount" className='pt-1 text-gray-400'>Win Amount: </label>
                <input id='win-amount' type="number" className="input border-0 rounded-none w-32 ml-1 h-8 pt-0 bg-opacity-20 bg-slate-400 text-white"
                    onChange={winAmountChangeHandler} value={winAmount.toString()} min={1}/>
              </span>
              </>}
            </div>}
            <div className="form-control ">
              <label className="cursor-pointer label">
                {/* <span className="label-text">Remember me</span>  */}
                <input type="checkbox" className="toggle toggle-accent" checked={showPayAmounts} onChange={()=>{setShowPayAmounts(!showPayAmounts)}}/>
              </label>
            </div>
          </div>
          {showSellDetail && 
    <div onClick={toggleSellDetail} className='w-full fixed z-50 h-[97vh] top-0 left-0 bg-black bg-opacity-70 overflow-auto text-white'>
    <div onClick={(e)=>e.stopPropagation()} className='cursor-default bg-slate-800 mt-16 mx-auto w-full md:w-8/12 border-2 border-green-500 
        rounded flex flex-col gap-2 py-8 px-8 justify-center ' >
            <div className='mx-auto text-2xl text-gray-300'>Cartelas Selling Status({cards.length})</div>
            <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Cashier</th>
        <th>Cartelas Sold</th>
        <th>Cash</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {/* <tr>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
      </tr> */}
      {sellDetail.map((card, index)=>{
        return ( <tr key={card.userid}>
          <th>{index + 1}</th>
          <td>{getUserName(card.userid, allUsers)}</td>
          <td>{card.quantity}</td>
          <td>{card.quantity * betAmount}</td>
        </tr>)
      })}
      
    </tbody>
  </table>
</div>
  </div>
</div>}
    </div>
  )
}

export default GamePayAmounts