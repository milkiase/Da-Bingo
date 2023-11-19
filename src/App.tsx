import {lazy, Suspense} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Setup from './routes/Setup';
import Login from './routes/Login';
import Admin from './routes/Admin';
import Game from './routes/Game';

import './App.css'
// import Navigation from './components/Navigation';
import { useSelector } from 'react-redux';
import { selectToken, selectIsUserAdmin, selectIsUserSuperAdmin } from './store/auth/authSelectors';
// import Dashboard from './routes/admin-routes/Dashboard/Dashboard.component';
// import Cashiers from './routes/admin-routes/Cashiers/Cashiers.component';
// import GamesDetails from './routes/admin-routes/GamesDetails/GamesDetails.component';
// import Houses from './routes/admin-routes/Houses/Houses.component';

const Houses = lazy(()=> import('./routes/admin-routes/Houses/Houses.component'))
const GamesDetails = lazy(()=> import('./routes/admin-routes/GamesDetails/GamesDetails.component'))
const Cashiers = lazy(()=> import('./routes/admin-routes/Cashiers/Cashiers.component'))
const Dashboard = lazy(()=> import('./routes/admin-routes/Dashboard/Dashboard.component'))
const Navigation = lazy(()=> import('./components/Navigation'))



function App() {
  const {pathname} = useLocation()
  const authToken = useSelector(selectToken)
  const isUserAdmin = useSelector(selectIsUserAdmin)
  const isUserSuperAdmin = useSelector(selectIsUserSuperAdmin)
  return (
      <Suspense>
        { (!pathname.startsWith('/game/')) && <Navigation></Navigation>}
        {
          authToken ? <Routes>
          <Route path='/' element={<Setup/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
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

  )
}

export default App
