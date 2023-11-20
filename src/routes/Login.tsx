import {useState, FormEvent} from 'react';
import { useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, setUserInfo } from '../store/auth/authSlice';
import { loginUser } from '../utils/backend.utils'

function Login() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loginHandler = async (e:FormEvent)=>{
        e.preventDefault()
        // <audio src="http://api.soundcloud.com/tracks/148976759/stream?client_id=201b55a1a16e7c0a122d112590b32e4a" preload="auto"></audio>
        // const audioElement = document.createElement('audio')
        // audioElement.setAttribute('src', 'http://api.soundcloud.com/tracks/148976759/stream?client_id=201b55a1a16e7c0a122d112590b32e4a')
        // audioElement.setAttribute('preload', 'auto')
        // audioElement.play()
        if(userName && password){
            try{
                const response = await loginUser(userName, password)
                dispatch(setToken(response.data.token))
                localStorage.setItem('access-token', response.data.token)
                const userInfo = {id: response.data.id, isAdmin:response.data.isAdmin, username: response.data.name, isSuperAdmin:response.data.isSuperAdmin}
                //console.log(userInfo)
                //console.log(response.data)
                dispatch(setUserInfo(userInfo))
                navigate('/')
            }catch(error){
                //console.log((error as Error).message)
            }
        }else{
            alert('No User Name or Password')
        }
    }
    return (
    <form className="flex flex-col  space-y-4 w-1/2 mx-auto mt-24 p-5 text-white bg-green-500" onSubmit={loginHandler}>
                <div>
                    <label className="label">
                        <span className="text-white label-text">Username</span>
                    </label>
                    <input type="text" placeholder="Enter Username" className="w-full input input-bordered" 
                        onChange={(e)=>{setUserName(e.target.value)}}/>
                </div>
                <div>
                    <label className="label">
                        <span className="text-white label-text">Password</span>
                    </label>
                    <input type="password" placeholder="Enter Password"
                        className="w-full input input-bordered" 
                        onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                <div>
                    <button className="btn btn-block bg-green-200 hover:bg-green-300 text-black">LogIn</button>
                </div>
                {/* <span>Already have an account ?
                    <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">Login</a></span> */}
            </form>
  )
}

export default Login