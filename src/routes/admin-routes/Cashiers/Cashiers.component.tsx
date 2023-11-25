import {useState, FormEvent, ChangeEvent, useEffect, useRef} from 'react'

import PasswordValidator from 'password-validator'

import { deleteUser, fetchCashiers, registerUser } from '../../../utils/backend.utils'
import { useDispatch, useSelector } from 'react-redux'
import { CashierType, addCashier, removeCashier, setCashiers } from '../../../store/admin/adminSlice'
import { selectCashiers } from '../../../store/admin/adminSelectors'
import MessageDialog from '../../../components/MessageDialog'

type NewUserType = {
  username: string,
  password1: string,
  password2: string,
  isAdmin: boolean
}

const initialNewUser:NewUserType = {
  username: '',
  password1: '',
  password2: '',
  isAdmin: false
}
const schema = new PasswordValidator()
schema.is().min(8)
schema.has().not().spaces()

function Cashiers() {
  const dispatch = useDispatch()
  const totalCashiers = useSelector(selectCashiers)
  const [newUser, setNewUser] = useState(initialNewUser)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const [deleteDetails, setDeleteDetails] = useState({showDeleteDialog: false, deleteID: '0'})
  useEffect(() => {
    const getCashiers = async ()=>{
      try {
        const resopnse = await fetchCashiers()
        dispatch(setCashiers(resopnse.data))
        // //console.log('cashiers', resopnse)
      } catch (error) {
        //console.log('error, trying to fetch cashiers.',error)
      }
    }
    getCashiers()
  }, [])

  const submitNewUserHandler = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(!schema.validate(newUser.password1)) return alert('invalid password')
    if(newUser.password1 !== newUser.password2) return alert('password did\'t match.')
    if(newUser.username && newUser.password1){
      try {
        const response = await registerUser(newUser.username, newUser.password1, newUser.isAdmin)
        // //console.log('user created successfuly!', response)
        dispatch(addCashier(response.data))
        setNewUser(initialNewUser)
        closeBtnRef.current?.click()
      } catch (error) {
        //console.log(error)
      }
    }
  } 

  const inputChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    const name = e.target.name
    const value = e.target.value
    if(name === 'isAdmin'){
        const value = e.target.checked
        setNewUser({...newUser, [name]: value})
        return
    }
    setNewUser({...newUser, [name]: value})
  }

  const deleteUserHandler = async ()=>{
    try {
      await deleteUser(deleteDetails.deleteID)
      // //console.log('user deleted successfuly!', response)
      dispatch(removeCashier(deleteDetails.deleteID))
    } catch (error) {
      //console.log('error, trying to delete user', error)
    }
  }
  const deleteUserPrompt = (id: string)=>{
    setDeleteDetails({showDeleteDialog: true, deleteID: id})
  }
  return (
    <div>
      {/* <h1 className='text-[28px] leading-[34px] font-normal self-center text-[#8d90a0] cursor-pointer'>Cashiers</h1> */}
      <div className="overflow-x-auto">
      {
        totalCashiers.length > 0 ? <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Date Joined</th>
            {/* <th>Edit</th> */}
            <th>Delete  </th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {/* <tr>
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td><button className=' link text-accent'>edit</button></td>
            <td><button className=' link text-error' onClick={()=>{deleteUserHandler('1')}}>delete</button></td>
          </tr> */}
          {
            totalCashiers.map((cashier:CashierType, index)=>{
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{cashier.name}</td>
                  <td>{cashier.dateCreated}</td>
                  {/* <td><input type="radio" checked={cashier.isAdmin} disabled/></td> */}
                  <td><button className=' link text-error' onClick={()=>{deleteUserPrompt(cashier.id)}}>delete</button></td>
                </tr>
              )
            }) 
          }
        </tbody>
      </table> : <div className='mx-auto w-full text-center text-4xl p-8'>There are no Cashiers Yet!</div>
      }
      
      <button className='btn btn-primary font-normal outline-none mt-2'
        onClick={()=>dialogRef.current?.showModal()}
      >Add Cashier</button>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button> */}
      <dialog id="add_cashier" className="modal h-[100vh]" ref={dialogRef}>
        <div className="modal-box py-0 w-full bg-slate-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <form method="dialog" className=' float-right inline-block'>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" ref={closeBtnRef}>✕</button>
          </form>
          <div className="p-1 space-y-4 md:space-y-6 sm:p-8 sm:py-2">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Register New Cashier
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={submitNewUserHandler}>
                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input onChange={inputChangeHandler} value={newUser.username} type="text" name="username" id="username" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 
                                    focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                  dark:focus:border-blue-500" placeholder="username here" required/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input onChange={inputChangeHandler} value={newUser.password1} type="password" name="password1" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                  </div>
                  <div>
                      <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input onChange={inputChangeHandler} value={newUser.password2} type="password" name="password2" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                  </div>
                  {/* <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input onChange={inputChangeHandler} checked={newUser.isAdmin} id="terms" aria-describedby="terms" type="checkbox" name='isAdmin' className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">Set the cashier as ADMIN</label>
                      </div>
                  </div> */}
                  <button type="submit" className="btn btn-primary outline-none w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create</button>
              </form>
          </div>
        </div>
      </dialog>
      {deleteDetails.showDeleteDialog && <MessageDialog title='Delete A Cashier' message='Are you sure you want to DELETE the cashier?' accept={deleteUserHandler} decline={()=>{setDeleteDetails({...deleteDetails, showDeleteDialog: false})}}></MessageDialog>}
    </div>
    </div>
  )
}

export default Cashiers