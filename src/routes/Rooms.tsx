import { FormEvent, useEffect, useState } from 'react'
import { fetchRooms, hostGame } from '../utils/backend.utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setGameID, setRoomID } from '../store/setup/setupSlice'
import { setRoom } from '../store/room/roomSlice'
import { selectRoom } from '../store/room/roomSelectors'
import { selectGameID } from '../store/setup/setupSelectors'
import { customAlphabet } from 'nanoid'
import { selectCurrentGameID } from '../store/game/gameSelectors'

function Rooms() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const room = useSelector(selectRoom)
    const gameID = useSelector(selectGameID)
    const [betAmount, setBetAmount] = useState<number | null>(null)
    const [winAmount, setWinAmount] = useState<number | null>(null)
    const [showModal, setShowModal] = useState(false)
    const lastGameID = useSelector(selectCurrentGameID)
    const [pageStatus, setPageStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [isCreatingRoom, setIsCreatingRoom] = useState(false)
    useEffect(()=>{
        (async()=>{
            try {
                const res = await fetchRooms()
                console.log('fetch room response', res.data)
                if(res.data.length === 0){
                    return setPageStatus('success')
                }
                dispatch(setRoom(res.data[0]))
                dispatch(setGameID(res.data[0].game.gameid.slice(res.data[0].game.gameid.length - 6)))
                setPageStatus('success')
            } catch (error) {
                setPageStatus('error')
                // console.log((error as Error ).message)
            }
        })()
    }, [])

    useEffect(()=>{
        const nanoid = customAlphabet('0123456789', 6)
        if(!gameID) dispatch(setGameID(nanoid()))
    }, [])

    const handleCreateRoom = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(!winAmount || !betAmount) return
        try {
            const res = await hostGame(gameID)
            dispatch(setRoom(res.data))
            setPageStatus('success')
            // console.log('success host a new game', res.data)
        } catch (error) {
            // console.log('error trying to host a new game.')
        }
    }

    const handleCreateRoomClick = async()=>{
        try {
            setIsCreatingRoom(true)
            const res = await hostGame(gameID)
            // console.log('success host a new game', res.data)
            dispatch(setRoom(res.data))
            navigate('/setup')
            setIsCreatingRoom(false)
        } catch (error) {
            setIsCreatingRoom(false)
            console.log('error trying to host a new game.')
        }
    }
    
    const handleJoinRoom = ()=>{
        
        dispatch(setRoomID(room.roomID))
        navigate('/setup')
    }

    const toggleModal = ()=>{
        setShowModal(!showModal)
    }

    const goToLastGame = ()=>{
        navigate('/game/' + lastGameID)
    }

if(pageStatus === 'loading') return <div className='flex justify-center items-center h-[70vh]'>
    <span className='loading loading-spinner loading-lg'></span>
</div>
if(pageStatus === 'error') return <div className='flex justify-center items-center h-[70vh]'>
        <span className='text-red-500 text-2xl'>
            <a href="/" className='underline'>Try Again</a>..
        </span>
    </div>
return (
    // <!-- component -->
    <div className="flex-1 p-4 mt-12 flex justify-center items-center">
    <div className="bg-slate-800 w-full md:max-w-4xl rounded-lg shadow">
    <div className="h-12 flex justify-between items-center border-b border-slate-700 m-4">
    <div >
    <div className="text-xl font-bold text-gray-100">{room?.roomID}</div>
    <div className="text-sm font-base text-gray-300">Waiting for more players...</div>
    </div>
    {lastGameID &&<button className='link link-info ml-4' onClick={goToLastGame}>
            resume last game
        </button>}
    </div>
    <div className="px-6">
    {room?.roomID  ? <div className="flex justify-between items-center h-16 p-4 my-6  rounded-lg border border-slate-600 shadow-md">
        <div className="flex items-center">
        <img className="rounded-full h-12 w-12" src="https://static-cdn.jtvnw.net/jtv_user_pictures/27fdad08-a2c2-4e0b-8983-448c39519643-profile_image-70x70.png" alt="Logo" />
        <div className="ml-2">
        <div className="text-sm font-semibold text-gray-200">Hosted by: {room.postedBy?.name || ''}</div>
        <div className="text-sm font-light text-gray-300">Created On  {(room.postedBy?.dateCreated)?.split('T').join(' at ').split('.')[0]}</div>
        </div>
        </div>
        <div>
        <button
            onClick={handleJoinRoom}
            className=" btn w-32 text-white bg-green-500 hover:bg-green-600 active:bg-green-700 p-2 rounded-full shadow-md flex justify-center items-center">
            Join Room
        </button>
        </div>
    </div>
    :
    <div className="flex  justify-center items-center h-16 p-4   rounded-lg  shadow-inner">
        <div className="flex items-center  rounded cursor-pointer">
        
        <div className="ml-1 text-red-500 font-medium"> Game is not hosted yet!</div>
        </div>
    </div>}
    </div>
    {!room?.roomID && <div className="p-6 ">
        <button onClick={handleCreateRoomClick}
            disabled={isCreatingRoom}
            className="p-4 bg-green-400 hover:bg-green-500 w-full rounded-lg shadow text-xl font-medium uppercase text-white">
            {isCreatingRoom ? <span className='loading loading-spinner loading-md'></span> : 'Host New Game'}
            </button>
    </div>}
    </div>
    {showModal && 
    <div onClick={toggleModal} className='w-full fixed h-[97vh] top-0 left-0 bg-black bg-opacity-70 overflow-auto text-white'>
    <div onClick={(e)=>e.stopPropagation()} className='cursor-default bg-slate-800 mt-16 mx-auto w-10/12 border-2 border-green-500 
        rounded flex flex-col gap-2 py-8 px-8 justify-center ' >
            <div className='mx-auto text-4xl text-gray-300'>Hosting a New Game...</div>
    <form className="px-12 md:px-24" onSubmit={handleCreateRoom}>
      <div className="flex flex-col items-start text-lg mb-6 md:mb-8">
        <label htmlFor='win-amount'>ደራሽ:</label>
        <input id="win-amount" type='number' value={winAmount?.toString()} onChange={(e)=>setWinAmount(Number(e.target.value))}
         className="bg-slate-600 px-2 py-2 md:py-4 focus:outline-none w-full" placeholder="Enter Win Amount" />
      </div>
      <div className="flex flex-col items-start text-lg mb-6 md:mb-8">
        <label htmlFor='bet-amount'>መደብ:</label>
        <input type="number" id="bet-amount"  value={betAmount?.toString()} onChange={(e)=>setBetAmount(Number(e.target.value))}
            className="bg-slate-600 px-2 py-2 md:py-4 focus:outline-none w-full" placeholder="Enter Bet Amount" />
      </div>
      <button className="btn bg-gradient-to-b from-green-700 to-green-900 font-medium p-2 md:p-4 text-white uppercase w-full">Create</button>
    </form>
  </div>
</div>}
        </div>)

}

export default Rooms