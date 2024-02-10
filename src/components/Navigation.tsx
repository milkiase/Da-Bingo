import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, selectUserInfo} from '../store/auth/authSelectors';
import { logOut } from '../store/auth/authSlice';
// import { resetSetupPage } from '../store/setup/setupSlice';
import { resetAdminState } from '../store/admin/adminSlice';
import { resetRoom } from '../store/room/roomSlice';

function Navigation() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const authToken = useSelector(selectToken)
    // const isUserAdmin = useSelector(selectIsUserAdmin)
    const {username} = useSelector(selectUserInfo)
    const location = useLocation()
    const handleLogout = ()=>{
        dispatch(logOut())
        // dispatch(resetSetupPage())
        dispatch(resetRoom())
        dispatch(resetAdminState())
        navigate('/login')
    }
    return (
        <>
            <div className="navbar bg-slate-800 min-h-12 h-[10vh]">
            <div className="navbar-start">
                <Link  to={'/'} className="navbar-start btn btn-ghost normal-case w-fit light:bg-slate-800" id='logo'>
                    <img src='https://i.imgur.com/1B8elZ1.png' alt="Lucky Bingo" className=' h-[9vh]'/>
                </Link>
            
            </div>
            <div className="navbar-center flex">
            {   authToken && 
                <ul className="menu menu-horizontal px-1">
                    <li><Link className={'mx-1' + (location.pathname === '/' && ' active')} to={'/'}>Room</Link></li>
                    <li><Link className={'mx-1' + (location.pathname === '/setup' && ' active')} to={'/setup'}>Setup</Link></li>
                    <li><Link className={'mx-1' + (location.pathname === '/admin' && ' active')} to={'/admin'}>Options</Link></li>
                    {/* {isUserAdmin && <li><Link className='mx-1' to={'/admin'}>Admin</Link> </li>}
                    <li><Link className='mx-1' to={'/game/3'}>Game</Link> </li> */}
                </ul>
            }
            </div>
            <div className="navbar-end">

            {authToken && <div className="dropdown dropdown-end mr-5 flex">
                <span className=' mr-2 self-center welcome'> {username}</span>
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </label>
                <ul tabIndex={0} className=" px-1 menu menu-sm dropdown-content mt-14 p-2 shadow bg-slate-700 rounded-box w-52 z-30">
                    {/* <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                    </li> */}
                    {/* <li><a>Options</a></li> */}
                    {/* <li><Link className='' to={'/admin'}>Options</Link> </li> */}
                    <hr className='ml-3 mr-12 border-slate-600' />
                    <li onClick={handleLogout}><a>Logout</a></li>
                </ul>
                </div>}
            </div>
        </div>
        </>
    )
}

export default Navigation