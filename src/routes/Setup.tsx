import {ChangeEvent, useEffect, useState, useReducer, memo} from 'react';
import {useNavigate} from 'react-router-dom';
import Card from '../components/Card';
import GamePayAmounts from '../components/GamePayAmounts';
import totalCards from '../cards';
import { useSelector, useDispatch } from 'react-redux';
import { createGame } from '../utils/backend.utils';
import { selectBetAmount, selectCards, selectPercentage, selectWinAmount, selectPatternType, selectProfit, selectPattern, selectGameID } from '../store/setup/setupSelectors';
import { changePatternType, resetSetupPage, setGameID, setSetupPattern } from '../store/setup/setupSlice';
import { selectCurrentGameID } from '../store/game/gameSelectors';

import { PatternTypes, getPresetPatterns, patternTypes } from '../utils/game.utils';
import Pattern from '../components/Pattern/Pattern.component';
import MessageDialog from '../components/MessageDialog';
import { resetGame, setGameBetAmount, setGamePatternType, setGamePercentage, setGameWinAmount, setID, setPlayers } from '../store/game/gameSlice';
import { customAlphabet } from 'nanoid';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectIsUserAdmin } from '../store/auth/authSelectors';

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
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isUserAdmin = useSelector(selectIsUserAdmin)
  const cards = useSelector(selectCards)
  const percentage = useSelector(selectPercentage)
  const betAmount = useSelector(selectBetAmount)
  const winAmount = useSelector(selectWinAmount)
  const profit = useSelector(selectProfit)
  const setupPatternType = useSelector(selectPatternType)
  const setupPattern = useSelector(selectPattern)
  const [pattern, setPattern] = useState(defaultPattern)
  const [patternType, setPatternType] = useState(setupPatternType)
  const [showNewGameDialog, setShowNewGameDialog] = useState(false)
  const lastGameID = useSelector(selectCurrentGameID)
  const [pageStatus, dispatchPageStatus] = useReducer(pageStatusReducer, {success: true, error: false, loading: false})
  const gameID = useSelector(selectGameID)
  
  const startGame = async ()=>{
      setShowNewGameDialog(false)
      if(percentage && cards.length && winAmount){
      // navigate('/game/1')
      const toastID = toast.loading('Creating a new game.')
      try {
        dispatchPageStatus({type: 'loading'})
        const response = await createGame(gameID, cards, percentage, betAmount, winAmount, profit, patternType)
        toast.update(toastID, {
            render: 'Game Created Successfuly.',
            type: 'success',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            isLoading: false
        })
        dispatchPageStatus({type: 'success'})
        const id = response.data.gameid
        dispatch(setGameID(gameID))
        dispatch(resetGame())
        dispatch(setGameBetAmount(betAmount))
        dispatch(setGamePatternType(patternType))
        dispatch(setGameWinAmount(winAmount))
        dispatch(setGamePercentage(percentage))
        dispatch(resetSetupPage())
        dispatch(setID(gameID))
        dispatch(setPlayers(cards))
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

  useEffect(()=>{
    const nanoid = customAlphabet('0123456789', 6)
    if(!gameID) dispatch(setGameID(nanoid()))
  }, [])

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
  const goToLastGame = ()=>{
    navigate('/game/' + lastGameID)
  }
  // if(pageStatus?.error) return <div className='w-full h-full flex pt-[40vh] justify-center align-middle '>
  //       <div className='flex text-center'>
  //           <span className="loading loading-ring loading-lg"></span>
  //           <a href='/' className='link self-center ml-4'>Refresh</a>
  //       </div>
  //       <ToastContainer/>

  //   </div>
  return (
    <div className='px-2'>
        <GamePayAmounts></GamePayAmounts>
        <div className='flex flex-wrap overflow-auto h-[76vh] justify-center'>
          {totalCards.slice(0, 1000).map((cardArray, i)=> <Card i={i + 1} cardArray={cardArray} key={i}/>)}
        </div>
        <div className='flex gap-10 justify-around align-middle py-2 px-4'>
          {toggle && 
          <div className='fixed bg-slate-800 top-[11vh] border-2 border-green-500 
                  rounded flex flex-col gap-2 py-8 px-8 justify-center' >
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
            <div className=' flex justify-between w-56'>
              <button onClick={saveGamePattern} className='text-white rounded-sm font-normal min-h-8 h-8 btn btn-success'> Save </button>
              <button onClick={cancelPattern} className='  text-white rounded-sm font-normal min-h-8 h-8 btn btn-error'>Cancel</button>
            </div>
          </div>}
          <div className='selt-center pt-2'>
            <button className='btn btn-error min-h-6 h-6 rounded-sm mr-8' disabled={!isUserAdmin} onClick={resetButtonHandler}>Reset</button>
            <button className='link' onClick={()=>{setToggle(true)}}>change pattern</button>
          </div>
          <div>
          <button onClick={()=>{setShowNewGameDialog(true)}} type='button' className='btn bg-green-500 hover:bg-green-600 rounded text-white px-8 h-10 min-h-8'>
            Create Game 
          </button>
          {lastGameID &&<button className='link link-info ml-4' onClick={goToLastGame}>
            resume last game
          </button>}
          </div>
          {
            showNewGameDialog && <MessageDialog title='Create A New Game' message='Are you sure you want to start a new game?' accept={startGame} decline={()=>{setShowNewGameDialog(false)}}></MessageDialog>
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