import {useState, FormEvent} from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUserInfo } from '../store/auth/authSlice';
import { loginUser } from '../utils/backend.utils'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loginHandler = async (e:FormEvent)=>{
        e.preventDefault()
        if(userName && password){
            const id = toast.loading('trying to login')
            try{
                const response = await loginUser(userName, password)
                // return console.log('loged in ', response)
                toast.update(id, {
                    render: 'Wow, Successfully logged in.',
                    type: 'success',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    // draggable: true,
                    // progress: undefined,
                    isLoading: false
                })
                dispatch(setToken(response.data.token))
                localStorage.setItem('access-token', response.data.token)
                const userInfo = {id: response.data.id, house: response.data.house, isAdmin:response.data.isAdmin, username: response.data.name, isSuperAdmin:response.data.isSuperAdmin}
                dispatch(setUserInfo(userInfo))
                navigate('/')
            }catch(error){
                toast.update(id, {
                    render: (error as Error).message,
                    type: 'error',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    // draggable: true,
                    // progress: undefined,
                    isLoading: false
                })
            }
        }else{
            toast('No User Name or Password', {
                type: 'warning'
            })
        }
    }
    return (
    <>
        <form className="flex flex-col  space-y-4 w-1/2 mx-auto mt-24 p-5 text-white bg-slate-700" onSubmit={loginHandler}>
                <div>
                    <label className="label">
                        <span className="text-white label-text">Username</span>
                    </label>
                    <input type="text" placeholder="Enter Username" className="w-full input input-bordered bg-slate-800" 
                        onChange={(e)=>{setUserName(e.target.value)}}/>
                </div>
                <div>
                    <label className="label">
                        <span className="text-white label-text">Password</span>
                    </label>
                    <input type="password" placeholder="Enter Password"
                        className="w-full input input-bordered bg-slate-800" 
                        onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                <div>
                    <button className="btn btn-block bg-green-500 hover:bg-green-600 text-black">LogIn</button>
                </div>
                {/* <span>Already have an account ?
                    <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Login</a></span> */}
        </form>
        <ToastContainer/>
    </>

  )
}

export default Login