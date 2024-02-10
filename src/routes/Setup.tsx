import {ChangeEvent, useEffect, useState, useReducer, memo, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import Card from '../components/Card';
import GamePayAmounts from '../components/GamePayAmounts';
// import totalCards from '../cards';
import { useSelector, useDispatch } from 'react-redux';
import { startGameAPI } from '../utils/backend.utils';
import { selectBetAmount, selectCards, selectWinAmount, selectPatternType, selectPattern, selectGameID, selectPrintedCards, selectIsBuyingCard, selectCardBeingBought, selectErrorBuyingCartela } from '../store/setup/setupSelectors';
import { buyCardAsync, changePatternType, fetchRoomAsync, printCard, resetErrorBuyingCartela, resetSetupPage, setSetupPattern } from '../store/setup/setupSlice';
// import { selectCurrentGameID } from '../store/game/gameSelectors';
import ReactToPrint from 'react-to-print';

import { PatternTypes, getPresetPatterns, patternTypes } from '../utils/game.utils';
import Pattern from '../components/Pattern/Pattern.component';
import MessageDialog from '../components/MessageDialog';
import { resetGame, setGameBetAmount, setGamePatternType, setGameWinAmount, setID, setPlayers } from '../store/game/gameSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectIsUserAdmin, selectUserInfo } from '../store/auth/authSelectors';
import { HiPrinter } from 'react-icons/hi';
import CardToPrint from '../components/CardToPrint/CardToPrint.component';

import { RootActions } from '../store/store';
import { selectRoom } from '../store/room/roomSelectors';
import { fetchAllUsersAsync } from '../store/admin/adminSlice';
import { resetRoom } from '../store/room/roomSlice';
// import CardNumbers from '../components/CardNumbers';

const defaultPattern = getPresetPatterns().pattern
const pageStatusReducer = (_state: unknown, action: { type: unknown; })=>{
  switch(action.type){
    case 'success':
      return {success: true, error: false, loading: false}
    case 'loading':
      return {success: false, error: false, loading: true}
    case 'error':
      return {success: false, error: true, loading: false}
  }
}

const Setup = memo(()=>{
  const dispatch:RootActions = useDispatch()
  const navigate = useNavigate()
  const isUserAdmin = useSelector(selectIsUserAdmin)
  const cards = useSelector(selectCards)
  // const percentage = useSelector(selectPercentage)
  const betAmount = useSelector(selectBetAmount)
  const winAmount = useSelector(selectWinAmount)
  // const profit = useSelector(selectProfit)
  const setupPatternType = useSelector(selectPatternType)
  const setupPattern = useSelector(selectPattern)
  const [pattern, setPattern] = useState(defaultPattern)
  const [patternType, setPatternType] = useState(setupPatternType)
  const [showNewGameDialog, setShowNewGameDialog] = useState(false)
  // const lastGameID = useSelector(selectCurrentGameID)
  const [pageStatus, dispatchPageStatus] = useReducer(pageStatusReducer, {success: true, error: false, loading: false})
  const gameID = useSelector(selectGameID)
  const [modalType, setModalType] = useState('pattern')
  const [selectedCartelaNumber, setSelectedCartelaNumber] = useState<number | ''>(1)
  const selectedCartelas = useSelector(selectCards)
  const printedCartelas = useSelector(selectPrintedCards)
  const printRef = useRef<HTMLDivElement | null>(null)
  // const roomID = useSelector(selectRoomID)
  const room = useSelector(selectRoom)
  const [totalCards, setTotalCards] = useState<(number | string)[][][]>([])
  const isBuyingCard = useSelector(selectIsBuyingCard)
  const cardBeingBought = useSelector(selectCardBeingBought)
  const userInfo = useSelector(selectUserInfo)
  const errorBuyingCartela = useSelector(selectErrorBuyingCartela)
  useEffect(()=>{
    import((userInfo.username.toLowerCase() === 'lucky0006') ? '../cards_10_20' : '../cards').then((module)=>{
      setTotalCards(module.default)
    })
  }, [userInfo.username])

  useEffect(()=>{
    dispatch(fetchAllUsersAsync())
  }, [])

  useEffect(()=>{
    if(errorBuyingCartela.code === 304 && errorBuyingCartela.isActive){
      toast.error('This cartela is already sold')
      dispatch(resetErrorBuyingCartela())
    }else if(errorBuyingCartela.code === 404 && errorBuyingCartela.isActive){
      dispatch(resetErrorBuyingCartela())
      dispatch(resetRoom())
    }
  }, [errorBuyingCartela])


  const startGame = async ()=>{
      setShowNewGameDialog(false)
      if(cards.length && winAmount && betAmount){
      // navigate('/game/1')
      const toastID = toast.loading('Creating a new game.')
      try {
        dispatchPageStatus({type: 'loading'})
        // const response = await createGame(gameID, cards, percentage, betAmount, winAmount, profit, patternType)
        const response = await startGameAPI(room.roomID, winAmount, betAmount, patternType)
        // console.log(response.data)
        toast.update(toastID, {
            render: 'Game Created Successfuly.',
            type: 'success',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            isLoading: false
        })
        dispatchPageStatus({type: 'success'})
        const id = response.data.game.gameid
        // dispatch(setGameID(id.slice(id.length - 6)))
        dispatch(resetGame())
        dispatch(setGameBetAmount(betAmount))
        dispatch(setGamePatternType(patternType))
        dispatch(setGameWinAmount(winAmount))
        // dispatch(setGamePercentage(percentage))
        dispatch(resetSetupPage())
        dispatch(setID(gameID))
        dispatch(setPlayers(response.data.game.players.map((player: {numberselected: number}) => player.numberselected)))
        navigate('/game/' + id)

        // redirect('/game/' + id)
      } catch (error) {
        //console.log(error)
        dispatchPageStatus({type: 'error'})
        toast.update(toastID, {
            render: 'Ooops, network error. Please check your connection',
            type: 'error',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            isLoading: false
        })
      }
    }else{
      alert('You cannot create a game, some values are empty or zero.')
      setShowNewGameDialog(false)
    }

  }
  const patternChangeHandler = (e:ChangeEvent<HTMLSelectElement>)=>{
    setPatternType(e.target.value)
  }
  const [toggle, setToggle] = useState(false)
  const updatePatternHandler = (newPattern: boolean[][])=>{
      setPattern(newPattern)
  }

  // useEffect(()=>{
  //   const nanoid = customAlphabet('0123456789', 6)
  //   if(!gameID) dispatch(setGameID(nanoid()))
  // }, [])

  useEffect(()=>{
    const newPattern = getPresetPatterns(patternType).pattern
    setPattern(newPattern)
  }, [patternType])

  const saveGamePattern = ()=>{
    dispatch(setSetupPattern(pattern))
    dispatch(changePatternType(patternType))
    setToggle(false)
  }
  const cancelPattern = ()=>{
    setPattern(setupPattern)
    setPatternType(setupPatternType)
    setToggle(false)
  }
  const resetButtonHandler = ()=>{
    if(isUserAdmin) dispatch(resetSetupPage())
  }
  // const goToLastGame = ()=>{
  //   navigate('/game/' + lastGameID)
  // }
  
  const [cartelasPage, setCartelasPage] = useState(1)
  const nextCartelasPage = ()=>{
    // console.log('next attempt', cartelasPage)
    if(cartelasPage < (totalCards.length / 32)){
      setCartelasPage(cartelasPage + 1)
      // console.log('next', cartelasPage)
    }
  }

  const prevCartelasPage = ()=>{
    if(cartelasPage > 1){
      setCartelasPage(cartelasPage - 1)
    }
  }
  // console.log((cartelasPage-1) * 32, cartelasPage * 32)
  const changePatternHandler = ()=>{
    setToggle(true)
    setModalType('pattern')
  }
  const showCartelasSelector = ()=>{
    setToggle(true)
    setModalType('cartelas')
  }
  const changeSelectedCartelaNumber = (e: ChangeEvent<HTMLInputElement>)=>{
    if(isNaN(Number(e.target.value))) return
    setSelectedCartelaNumber(Number(e.target.value) || '')
  }
  const buySelectedCartela = ()=>{
    if(selectedCartelaNumber) dispatch(buyCardAsync({roomId: room.roomID, cardNumber: selectedCartelaNumber}))
    document.getElementById('cartela-input')?.focus()
  }

  const printSelectedCartela = ()=>{
    if(selectedCartelaNumber) dispatch(printCard(selectedCartelaNumber))
    document.getElementById('cartela-input')?.focus()
    // document.getElementById(`print-btn-${selectedCartelaNumber}`)?.click()
  }

  // const removeSelectedCartela = ()=>{
  //   if(selectedCartelaNumber) dispatch(removeCard(selectedCartelaNumber))
  //   document.getElementById('cartela-input')?.focus()
  // }

  useEffect(()=>{
    dispatch(fetchRoomAsync(room.gameID))
  }, [])

  return (
    <div className='px-2'>
        <div className='flex justify-between items-center px-4 py-1'>
          <button className='btn  rounded-none h-8 min-h-8 btn-success' onClick={showCartelasSelector}>Select Cartelas</button>
          <div><GamePayAmounts></GamePayAmounts></div>
        </div>
        <div className='flex flex-wrap overflow-auto max-h-[76vh] justify-center'>
          {totalCards.slice((cartelasPage-1) * 32, cartelasPage * 32).map((cardArray, i)=> <Card i={(i + 1) + (32 * (cartelasPage-1))} cardArray={cardArray} key={i}/>)}
          <div className="flex justify-center gap-4 items-center bg-gray-800 rounded-lg px-4 py-2">
            <button className="className='btn active:bg-green-800 bg-green-500 hover:bg-green-600 rounded text-white px-8 h-10 min-h-8" onClick={prevCartelasPage}>Prev</button>
            <span>{cartelasPage} / {Math.ceil(totalCards.length / 32)}</span>
            <button className="className='btn active:bg-green-800 bg-green-500 hover:bg-green-600 rounded text-white px-8 h-10 min-h-8" onClick={nextCartelasPage}>Next</button>
          </div>
        </div>
        <div className='flex gap-10 justify-around align-middle py-2 px-4'>
          {toggle && 
          <div onClick={cancelPattern} className='w-full fixed h-full top-0 left-0 bg-black bg-opacity-20 '>
            {modalType==='pattern'?<div onClick={(e)=>e.stopPropagation()} className='cursor-default bg-slate-800 mt-16 mx-auto w-80 border-2 border-green-500 
                  rounded flex flex-col gap-2 py-8 px-8 justify-center ' >
            <span className=' self-center mb-2'><Pattern pattern={pattern} canUpdatePattern={patternType === patternTypes.custom} updatePattern={updatePatternHandler}></Pattern></span>
            <div className=' self-center mb-4'>
              <label htmlFor='patternSelector' className=' self-center mr-3'>Pattern</label>
              <select onChange={patternChangeHandler} name="patternSelector" value={patternType}
                id="patternSelector" className=' h-10 self-center text-white outline-none rounded'>
                  {
                    Object.keys(patternTypes).map((patternTypeItem)=>(
                      <option  value={patternTypes[patternTypeItem as keyof PatternTypes]} key={patternTypeItem}>{patternTypes[patternTypeItem as keyof PatternTypes]}</option>
                    ))
                  }
              </select>
            </div>
            <div className=' flex justify-around mx-auto w-full'>
              <button onClick={saveGamePattern} className='text-white rounded-sm font-normal min-h-8 h-8 btn w-20 btn-success'> Save </button>
              <button onClick={cancelPattern} className='  text-white rounded-sm font-normal min-h-8 h-8 btn w-20 btn-error'>Cancel</button>
            </div>
          </div>: <div onClick={(e)=>e.stopPropagation()} className='cursor-default bg-slate-800 mt-16 mx-auto w-96 border-2 border-green-500 
                  rounded flex flex-col gap-2 py-4 px-8 justify-center ' >
            {/* <span className=' self-center mb-2'><Pattern pattern={pattern} canUpdatePattern={patternType === patternTypes.custom} updatePattern={updatePatternHandler}></Pattern></span> */}
            {(totalCards[(selectedCartelaNumber || 0)-1] || []).length > 0 ? <Card i={selectedCartelaNumber || -1} cardArray={totalCards[(selectedCartelaNumber || 0)-1] || []} showButton={false}/>
            :<div className='h-48 mb-3'>
            </div>}
            {/* <CardNumbers cardArray={totalCards[3] || []} i={3}></CardNumbers> */}
            <div className='flex flex-col self-center mb-4'>
              <label htmlFor='cartelaSelector' className=' self-center mr-3'>Insert Cartela Number</label>
              <input 
                disabled={isBuyingCard}
                id="cartela-input" className='text-white cursor-text px-2 py-1 text-center' autoFocus type="number" min={1} max={totalCards.length}
                value={selectedCartelaNumber} onChange={changeSelectedCartelaNumber}
              ></input>
            </div>
            <div className=' flex justify-around mx-auto w-full'>
              <button 
                  disabled={selectedCartelas.includes(selectedCartelaNumber || -1) || (totalCards[(selectedCartelaNumber || 0)-1] || []).length === 0 } 
                  onClick={buySelectedCartela} 
                  className='text-white rounded-sm font-normal min-h-8 h-8 btn w-24 btn-success'>
                    {cardBeingBought === selectedCartelaNumber? <span className='loading loading-spinner loading-sm '></span> : 'Buy'} 
              </button>
              {/* <button disabled={(printedCartelas.includes(selectedCartelaNumber || -1) || !selectedCartelas.includes(selectedCartelaNumber || -1)) || (totalCards[(selectedCartelaNumber || 0)-1] || []).length === 0 } onClick={printSelectedCartela} className='  text-white rounded-sm font-normal min-h-8 h-8 btn w-24 btn-primary flex flex-row'><HiPrinter className=" text-gray-900"/><span>Print</span></button> */} 
              <>
                <ReactToPrint trigger={()=><button disabled={(printedCartelas.includes(selectedCartelaNumber || -1) || !selectedCartelas.includes(selectedCartelaNumber || -1))} className='  text-white rounded-sm font-normal min-h-8 h-8 btn w-24 btn-primary flex flex-row'>
                  <HiPrinter className=" text-gray-900"/><span>Print</span></button>}
                    content={()=> printRef.current}
                    documentTitle={'card - ' + selectedCartelaNumber}
                    onAfterPrint={printSelectedCartela}
                    >
                </ReactToPrint>
                <div ref={printRef}>
                      <CardToPrint cardArray={totalCards[(selectedCartelaNumber || 0)-1] || []} cardNumber={selectedCartelaNumber || -1} />
                  </div>
              </>
              
              {/* <button disabled={(!selectedCartelas.includes(selectedCartelaNumber || -1) || (totalCards[(selectedCartelaNumber || 0)-1] || []).length === 0 ) || (totalCards[(selectedCartelaNumber || 0)-1] || []).length === 0 } 
                onClick={removeSelectedCartela} className='  text-white rounded-sm font-normal min-h-8 h-8 btn w-24 btn-error'>Remove</button> */}
            </div>
          </div>}
        </div>}
        {isUserAdmin && <>
          <div className='selt-center pt-2'>
            <button className='btn btn-error min-h-6 h-6 rounded-sm mr-8' disabled={!isUserAdmin} onClick={resetButtonHandler}>Reset</button>
            <button className='link' onClick={changePatternHandler}>change pattern</button>
            </div>
          
          <div>
          <button onClick={()=>{setShowNewGameDialog(true)}} type='button' className='btn bg-green-500 hover:bg-green-600 rounded text-white px-8 h-10 min-h-8'>
            Start The Game 
          </button>
          {/* {lastGameID &&<button className='link link-info ml-4' onClick={goToLastGame}>
            resume last game
          </button>}  */}
          </div>
          </>}
          { 
            showNewGameDialog && <MessageDialog title='Create A New Game' message='Are you sure you want to start the game?' accept={startGame} decline={()=>{setShowNewGameDialog(false)}}></MessageDialog>
          }
        </div> 
        {pageStatus?.loading && 
          <div className='absolute bg-black bg-opacity-20 top-0 left-0 w-full h-full flex justify-center align-middle'>
            {/* <div className='flex text-center -mt-[15vh]'>
                <span className="loading loading-dots loading-md"></span>
            </div> */}
          </div>
        }
        <ToastContainer/>
    </div>
  )
}
)
export default Setup