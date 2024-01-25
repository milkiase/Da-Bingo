import {useState, useEffect, useRef} from 'react';
import Badge from '../../../components/Badge';

import { useDispatch, useSelector } from 'react-redux';
import { GameType, Value, setDateRange, setSelectedRange} from '../../../store/admin/adminSlice';
import { selectDateRange, selectSelectedRange } from '../../../store/admin/adminSelectors';

// import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css'; // theme css file

// import {DateRange} from 'react-date-range';
import DateRangePickerComponent from '../../../components/DatePicker';

import { fetchCustomAnalytics } from '../../../utils/backend.utils';
import Dropdown from '../../../components/Dropdown';
// import AreaChart from '../../../components/AreaChart';
// import VerticalBarChart from '../../../components/VerticalBarChart';
// import { PieChart } from '../../../components/PieChart';
import { getEarning, numberWithCommas } from '../../../utils/game.utils';
import { selectIsUserAdmin, selectIsUserSuperAdmin } from '../../../store/auth/authSelectors';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dateRangeOptions = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Year', 'Custom']

// const defualtLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
// const defualtDatas = [200, 203, 188, 190, 230, 280, 270]

const calculateEarnings = (games: GameType[])=>{
    let newEarnings = 0
    // const filteredGames = games.filter(game => game.isWon)
    for(let i = 0; i<games.length; i++){
        newEarnings += getEarning(games[i])
    }
    // console.log('calculating earnings', earnings)
    return newEarnings
}
function Dashboard() {
    // const [selectedRange, setSelectedRange] = useState('Today')
    const dispatch = useDispatch()
    const dateRange = useSelector(selectDateRange)
    const selectedRange = useSelector(selectSelectedRange)
    const [earnings, setEarnings] = useState(0)
    const [games, setGames] = useState(0)
    const [cashiers, setCashiers] = useState(0)
    const isUserAdmin = useSelector(selectIsUserAdmin)
    const isUserSuperAdmin = useSelector(selectIsUserSuperAdmin)
    const firstLoad = useRef(true)
    const getAnalytics = async (inputDateRange: Value )=>{
        if(firstLoad.current) {
            firstLoad.current = false
            return
        }
        const toastID = toast.loading('fetching...')
        try {
            const response = await fetchCustomAnalytics(inputDateRange)
            toast.done(toastID)
            // console.log('analytics fetched successfully,', response.data)
            setEarnings(calculateEarnings(response.data.game))
            setGames(response.data.game.length)
            setCashiers(response.data.user)
            
        } catch (error) {
            //console.log('error, trying to fetch analytics', error)
            toast.update(toastID, {
                render: 'Opps, Error Encountered.',
                type: 'error',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                isLoading: false
            })
        }
    }

    useEffect(()=>{

        if(selectedRange !== 'Custom'){
            const fromDate = new Date()
            fromDate.setUTCHours(0, 0, 0, 0);
            const toDate = new Date()
            toDate.setUTCHours(23, 59, 59, 999);
            switch (selectedRange) {
                case 'Yesterday':
                    fromDate.setDate(fromDate.getDate() - 1)
                    toDate.setDate(toDate.getDate() - 1)
                    break;
                case 'This Week':
                    fromDate.setDate(fromDate.getDate() - 6)
                    break;
                case 'This Month':
                    fromDate.setDate(fromDate.getDate() - 29)
                    break
                case 'This Year':
                    fromDate.setDate(fromDate.getDate() - 364)
                    break
                default:
                    break;
            }
            dispatch(setDateRange([fromDate, toDate]))
            // getAnalytics([fromDate, toDate])
        }
    }, [selectedRange])

    useEffect(()=>{
        const fromDate = new Date()
        fromDate.setUTCHours(0, 0, 0, 0);
        const toDate = new Date()
        toDate.setUTCHours(23, 59, 59, 999);
        // toDate.setDate(toDate.getDate()-1)
        // console.log([fromDate, toDate])
        // getAnalytics([fromDate, toDate])
        // if(isUserAdmin || isUserSuperAdmin) getAnalytics([fromDate, toDate])
        // else getAnalytics([fromDate, toDate])
    }, [])

    useEffect(()=>{
        if(selectedRange !== 'Custom') getAnalytics(dateRange)
    }, [dateRange])

    const changeDateRange = (newDateRange:Value)=>{
        dispatch(setDateRange(newDateRange))
    }
    const fetchAnalytics = ()=>{
        getAnalytics(dateRange)
        // console.log('fetch')
    }
    return (
        <div className=''>
            
            <div className='flex flex-wrap justify-evenly'>
                <Badge title='Earnings' quantity={numberWithCommas(Number(earnings.toFixed(2))) + ' birr'} color='#1CC88A'></Badge>
                <Badge title='Games' quantity={games} color='#4E73DF' ></Badge>
                {isUserAdmin && <Badge title='Cashiers' quantity={cashiers} color='#36B9CC' ></Badge>}
                {isUserSuperAdmin && <Badge title='Houses' quantity={cashiers} color='#36B9CC' ></Badge>}
            </div>
            {(isUserAdmin || isUserSuperAdmin) && 
            <div className="flex justify-end align-middle gap-2 mr-4 mt-6">
                {selectedRange === 'Custom' && 
                    <div className='flex self-center'>
                        <button className='btn rounded-sm min-h-6 h-8' onClick={fetchAnalytics}>Fetch</button>
                        <span className=" self-center justify-self-center bg-slate-800">
                            <DateRangePickerComponent value={dateRange} onChange={changeDateRange}/>
                        </span>
                    </div>}
                <Dropdown title={selectedRange} values={dateRangeOptions} onItemSelect={(range)=>{dispatch(setSelectedRange(range))}}></Dropdown>
            </div>}
            {/* <div className='flex max-lg:flex-wrap gap-5 w-full h-[50vh] '>
                <div className=' h-full w-1/2'>
                    <AreaChart labels={defualtLabels} values={defualtDatas}></AreaChart>
                </div>
                <div className='h-full w-1/2'>
                    <VerticalBarChart labels={defualtLabels} values={defualtDatas}></VerticalBarChart>
                    <PieChart/>
                </div>
            </div> */}
            <ToastContainer/>
        </div>
    )
}

export default Dashboard