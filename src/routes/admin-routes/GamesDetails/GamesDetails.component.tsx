import { useEffect } from 'react';
import { getEarning, numberWithCommas } from '../../../utils/game.utils'
import { fetchGames } from '../../../utils/backend.utils';
import { useDispatch, useSelector } from 'react-redux';
import { setGames } from '../../../store/admin/adminSlice';
import { selectGames } from '../../../store/admin/adminSelectors';
import { toast } from 'react-toastify';
const arr:number[] = []
for(let count = 0; count < 100; count++){
    arr.push(count)
}
function GamesDetails() {
    const dispatch = useDispatch()
    const gamesDetails = useSelector(selectGames)
    useEffect(()=>{
        const toastID = toast.loading('fetching games')
        const getGames = async ()=>{
            try {
                const response = await fetchGames()
                toast.done(toastID)
                // console.log(response.data)
                dispatch(setGames(response.data))
            } catch (error) {
                //console.log('Error, trying to fetch games details.', error)
                toast.update(toastID, {
                    render: 'Ooops, Error Has Encountered.',
                    type: 'error',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    isLoading: false
                })
            }
        }
        getGames()
    }, [])
    return (
            <div className='flex flex-col h-full'>
                <div className='h-[78vh] overflow-auto'>
                    <table className="table table-sm table-pin-rows">
                        {/* head */}
                        <thead>
                        <tr className=' '>
                            <th></th>
                            <th>Pattern</th>
                            <th>Players</th>
                            <th>Bet Amount</th>
                            <th>Percentage</th>
                            <th>Is Won</th>
                            <th>Win Amount</th>
                            <th>Earning</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            gamesDetails.map((game, index)=>{
                            return (
                                <tr key={index} className=' hover'>
                                    <td>{index + 1}</td>
                                    <td>{game.pattern}</td>
                                    <td>{game.players.length}</td>
                                    <td>{game.amount}</td>
                                    <td>{game.percentage}</td>
                                    <td>{game.isWon ? 'Yes': 'NO'}</td>
                                    <td>{numberWithCommas(Number(game.winamount.toFixed(2)))}</td>
                                    <td>{numberWithCommas(Number(getEarning(game).toFixed(2)))}</td>
                                </tr>
                            )
                            }) 
                        }
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-grow  justify-around align-middle'>
                    <h1 className='text-[28px] leading-[34px] font-normal self-center text-[#8d90a0] cursor-pointer'>Total Games: {gamesDetails.length}</h1>
                    {/* <h1 className='text-[28px] leading-[34px] font-normal self-center text-[#8d90a0] cursor-pointer'>Total Earnings: {numberWithCommas(20000)}</h1> */}
                    
                </div>
            </div>
    )
}

export default GamesDetails