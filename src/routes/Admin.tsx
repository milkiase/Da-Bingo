import { Outlet, Link, useLocation} from 'react-router-dom';
import { HiChartPie, HiUsers, HiViewBoards, HiHome} from 'react-icons/hi';

import { useSelector } from 'react-redux';
import { selectIsUserAdmin, selectIsUserSuperAdmin } from '../store/auth/authSelectors';
function Admin() {
  const isUserAdmin = useSelector(selectIsUserAdmin)
  const isUserSuperAdmin = useSelector(selectIsUserSuperAdmin)
  const location = useLocation()
  return (
    <div className='flex flex-col h-[90vh]'>
      
      <div className='flex w-full h-full flex-grow'>
        <div className='flex flex-col gap-4 w-16 md:w-24 lg:w-1/5 bg-slate-800'>
          
          <Link className={`btn btn-accent ${(location.pathname !== '/admin') && 'bg-transparent'}  border-none w-full rounded-sm flex  lg:justify-start`} to={'/admin'}><HiChartPie/> <span className=' hidden lg:inline'>Dashboard</span> </Link>
          {isUserAdmin && <Link className={`btn btn-accent ${(location.pathname !== '/admin/cashiers') && 'bg-transparent'} border-none w-full rounded-sm flex  lg:justify-start `} to={'/admin/cashiers'}><HiUsers/> <span className=' hidden lg:inline'>Cashiers</span> </Link>}
          {isUserAdmin && <Link className={`btn btn-accent ${(location.pathname !== '/admin/games') && 'bg-transparent'} border-none w-full rounded-sm flex  lg:justify-start `} to={'/admin/games'}><HiViewBoards/> <span className=' hidden lg:inline'>Games</span> </Link>}
          { isUserSuperAdmin && <Link className={`btn btn-accent ${(location.pathname !== '/admin/houses') && 'bg-transparent'} border-none w-full rounded-sm flex  lg:justify-start `} to={'/admin/houses'}><HiHome/> <span className=' hidden lg:inline'>Houses</span> </Link>}
        </div>
        <div className="mx-auto w-full px-4 pt-2">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}

export default Admin