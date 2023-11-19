import {useState, FormEvent, ChangeEvent, useEffect, useRef} from 'react'

import PasswordValidator from 'password-validator'

import { createHouse, deleteHouse, fetchHouses, updateHouse } from '../../../utils/backend.utils';
import { useDispatch, useSelector } from 'react-redux';
import { HouseType, addHouse, removeHouse, setHouseActiveState, setHouses } from '../../../store/admin/adminSlice';
import { selectHouses } from '../../../store/admin/adminSelectors';
import MessageDialog from '../../../components/MessageDialog';

type NewHouseType = {
  name: string,
  city: string,
  detail: string,
  username: string,
  password1: string,
  password2: string,
}

const initialNewHouse:NewHouseType = {
  name: '',
  city: '',
  detail: '',
  username: '',
  password1: '',
  password2: ''
}
const schema = new PasswordValidator()
schema.is().min(8)
schema.has().not().spaces()

function Houses() {
  const dispatch = useDispatch()
  const totalHouses = useSelector(selectHouses)
  const [newHouse, setNewHouse] = useState(initialNewHouse)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const [deleteDetails, setDeleteDetails] = useState({showDeleteDialog: false, deleteID: '0'})

  useEffect(() => {
    const getHouses = async ()=>{
      try {
        const resopnse = await fetchHouses()
        dispatch(setHouses(resopnse.data))
        // //console.log('cashiers', resopnse)
      } catch (error) {
        //console.log('error, trying to fetch houses.',error)
      }
    }
    getHouses()
  }, [])
  
  useEffect(()=>{
    
  }, [])

  const submitNewHouseHandler = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    if(!schema.validate(newHouse.password1)) return alert('invalid password')
    if(newHouse.password1 !== newHouse.password2) return alert('password did\'t match.')
    if(newHouse.username && newHouse.password1 && newHouse.city && newHouse.detail && newHouse.name){
      try {
        const response = await createHouse(newHouse.name, newHouse.city, newHouse.detail, newHouse.username, newHouse.password1)
        // //console.log('house created successfuly!', response)
        dispatch(addHouse(response.data))
        setNewHouse(initialNewHouse)
        closeBtnRef.current?.click()
      } catch (error) {
        //console.log('error trying to create a house.', error)
      }
    }
  } 

  const inputChangeHandler = (e:ChangeEvent<HTMLInputElement>)=>{
    const name = e.target.name
    const value = e.target.value
    setNewHouse({...newHouse, [name]: value})
  }

  const deleteHouseHandler = async ()=>{
    try {
      await deleteHouse(deleteDetails.deleteID)
      // //console.log('user deleted successfuly!', response)
      dispatch(removeHouse(deleteDetails.deleteID))
      setDeleteDetails({...deleteDetails, showDeleteDialog: false})
    } catch (error) {
      //console.log('error, trying to delete house', error)
    }
  }

  const banHouseHandler = async (id:string, isActive:boolean)=>{
    try {
      const house = (totalHouses.find((house)=> house._id === id) as HouseType)
      await updateHouse(id, house.name, house.city, house.detail, isActive)
      //console.log('user banned successfuly!', response)
      dispatch(setHouseActiveState({id, isActive}))
    } catch (error) {
      //console.log('error, trying to bas a house', error)
    }
  }

  const deleteHousePrompt = (id: string)=>{
    setDeleteDetails({showDeleteDialog: true, deleteID: id})
  }
  return (
    <div>
      {/* <h1 className='text-[28px] leading-[34px] font-normal self-center text-[#8d90a0] cursor-pointer'>Cashiers</h1> */}
      <div className="overflow-x-auto">
      {
        totalHouses.length > 0 ? <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>City</th>
            <th>Is Active</th>
            <th>details</th>
            <th>Deactivate</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {
            totalHouses.map((house:HouseType, index)=>{
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{house.name}</td>
                  <td>{house.city}</td>
                  <td className='pl-8 checked:bg-green-800'><input type="radio" checked={house.isActive} readOnly/></td>
                  <td>{house.detail}</td>
                  <td><button className={' link' + (house.isActive ? ' text-warning' : ' text-success')} onClick={()=>{banHouseHandler(house._id, !house.isActive)}}>{house.isActive ? 'ban house' : 'Activate'}</button></td>
                  <td><button className=' link text-error' onClick={()=>{deleteHousePrompt(house._id)}}>delete</button></td>
                </tr>
              )
            }) 
          }
        </tbody>
      </table> : <div className='mx-auto w-full text-center text-4xl p-8'>There are no Houses Yet!</div>
      }
      
      <button className='btn btn-primary rounded-sm font-normal outline-none mt-2'
        onClick={()=>dialogRef.current?.showModal()}
      >Add House</button>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button> */}
      <dialog id="add_cashier" className="modal h-[100vh] w-full" ref={dialogRef}>
        <div className="modal-box py-0 rounded shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <form method="dialog" className=' float-right inline-block'>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" ref={closeBtnRef}>✕</button>
          </form>
          <div className="p-1 space-y-4 md:space-y-6 sm:p-8 sm:py-2 ">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create New House
              </h1>
              <form className=" flex flex-col space-y-4 md:space-y-6 " onSubmit={submitNewHouseHandler}>
                  <div className='flex gap-6'>
                    <div className=' flex flex-col gap-4'>
                      <div>
                          <label htmlFor="housename" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                          <input onChange={inputChangeHandler} value={newHouse.name} type="text" name="name" id="housename" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 
                                        focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                      dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                      dark:focus:border-blue-500" placeholder="house name here" required/>
                      </div>
                      <div>
                          <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                          <input onChange={inputChangeHandler} value={newHouse.city} type="text" name="city" id="city" placeholder="city here" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                      </div>
                      <div>
                          <label htmlFor="details" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Detail</label>
                          <input onChange={inputChangeHandler} value={newHouse.detail} type="text-area" name="detail" id="detail" placeholder="details here" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                      </div>
                    </div>
                    <div className=' flex flex-col gap-4'>
                      <div>
                          <label htmlFor="admin-username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin's Username</label>
                          <input onChange={inputChangeHandler} value={newHouse.username} type="text" name="username" id="admin-username" placeholder="username here" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                      </div>
                      <div>
                          <label htmlFor="admin-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin's Password</label>
                          <input onChange={inputChangeHandler} value={newHouse.password1} type="password" name="password1" id="admin-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                      </div>
                      <div>
                          <label htmlFor="confirm-admin-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Admin's Password</label>
                          <input onChange={inputChangeHandler} value={newHouse.password2} type="password" name="password2" id="confirm-admin-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                      </div>
                      
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary outline-none w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create</button>
              </form>
          </div>
        </div>
      </dialog>
    </div>
    {deleteDetails.showDeleteDialog && <MessageDialog title='Delete A House' message='Are you sure you want to DELETE the house?' accept={deleteHouseHandler} decline={()=>{setDeleteDetails({...deleteDetails, showDeleteDialog: false})}}></MessageDialog>}
    </div>
  )
}

export default Houses