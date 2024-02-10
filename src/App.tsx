import {lazy, Suspense, useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Setup from './routes/Setup';
import Login from './routes/Login';
import Admin from './routes/Admin';
import Game from './routes/Game';

import './App.css'
// import Navigation from './components/Navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectIsUserAdmin, selectIsUserSuperAdmin} from './store/auth/authSelectors';
import { selectRoom } from './store/room/roomSelectors';
import { RootActions } from './store/store';
import { fetchAllUsersAsync } from './store/admin/adminSlice';

// import { setSystemError } from './store/auth/authSlice';
// import axios from 'axios';
// import CardNumbers from './components/CardNumbers';
// import Dashboard from './routes/admin-routes/Dashboard/Dashboard.component';
// import Cashiers from './routes/admin-routes/Cashiers/Cashiers.component';
// import GamesDetails from './routes/admin-routes/GamesDetails/GamesDetails.component';
// import Houses from './routes/admin-routes/Houses/Houses.component';

const Houses = lazy(()=> import('./routes/admin-routes/Houses/Houses.component'))
const GamesDetails = lazy(()=> import('./routes/admin-routes/GamesDetails/GamesDetails.component'))
const Cashiers = lazy(()=> import('./routes/admin-routes/Cashiers/Cashiers.component'))
const Dashboard = lazy(()=> import('./routes/admin-routes/Dashboard/Dashboard.component'))
const Navigation = lazy(()=> import('./components/Navigation'))
const Rooms = lazy(()=> import('./routes/Rooms'))

// import cards from './cards'
// import Kartela from './components/Kartela';

// const KartelasToPrint: (number | string) [][][] = []
// for(let i=0; i< 1000; i++){
//   KartelasToPrint.push(cards[i])
// }

function App() {
  const dispatch:RootActions = useDispatch()
  // const error = useSelector(selectSystemError)
  const {pathname} = useLocation()
  const authToken = useSelector(selectToken)
  const isUserAdmin = useSelector(selectIsUserAdmin)
  const isUserSuperAdmin = useSelector(selectIsUserSuperAdmin)
  const hostedRoom = useSelector(selectRoom)
  // const [error, setError] = useState(true)
  useEffect(()=>{
    if(isUserAdmin){
      dispatch(fetchAllUsersAsync())
    }
    // const testLocalServer = async()=>{
    //   try {
    //     await axios.get('http://localhost/Amh%20B_Track%20(1).mp3')
    //     dispatch(setSystemError(false))
    //   } catch (error) {
    //     dispatch(setSystemError(true))
    //   }
    // }
    // if(error) testLocalServer()
  }, [])
  // if(error){
  //   return <div className=' h-full w-full flex justify-center pt-[40vh]'>
  //     <p>please run the local server first!!! <button className='link link-danger' onClick={()=>{dispatch(setSystemError(false))}}>Continue Anyway</button></p>
  //   </div>
  // }
  return (
      <div className="">
        <Suspense>
          { (!pathname.startsWith('/game/')) && <Navigation></Navigation>}
          {
            authToken ? <Routes>
            <Route path='/' element={<Rooms/>}></Route>
            <Route path='/setup' element={hostedRoom.roomID ? <Setup/> : <Rooms/>}></Route>
            <Route path='/login' element={authToken ? <Rooms/> : <Login/>}></Route>
            <Route path='/admin' element={<Admin/>}>
              <Route index element={<Dashboard/>}></Route>
              <Route path='cashiers' element={isUserAdmin ? <Cashiers/> : <Dashboard/>}></Route>
              <Route path='games' element={isUserAdmin ? <GamesDetails/> : <Dashboard/>}></Route>
              <Route path='houses' element={isUserSuperAdmin ? <Houses/> : <Dashboard/>}></Route>
            </Route>
            <Route path={`/game/:id`} element={<Game/>}></Route>
          </Routes> :
          <Routes>
            <Route path='*' element={<Login/>}></Route>
          </Routes>
          }
          
        </Suspense>
        <div className=' flex flex-col gap-0 justify-start print:flex print:flex-col print:gap-0 print:justify-start'>
        </div>
      </div>
      // <div className=' '>
      //     {KartelasToPrint.map((cardArray, index)=> <Kartela key={index} cardArray={cardArray} number={index + 1}></Kartela>)}
      // </div>
  )
}

export default App
