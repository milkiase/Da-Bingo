import {memo} from 'react'
const BINGO = ['B', 'I', 'N', 'G', 'O']
type CardNumbersProps = {
    i: number,
    cardArray: (string | number)[][]
}
const CardNumbers = memo(({cardArray}: CardNumbersProps)=>{
    return (
      <div className='flex text-sm text-black mx-auto'>
        {
            cardArray.map((column, index)=>
                <div className='flex flex-col' key={index}>
                    <span className=' border-collapse w-7  text-white font-bold p-1'>{BINGO[index]}</span>
                    <span className= {` border-white ${(index > 0) && 'border-l-2'} border-b-2 w-7 bg-[#EFEFEF] p-1 -mr-1`} >{column[0]}</span>
                    <span className= {` border-white ${(index > 0) && 'border-l-2'} border-b-2 w-7 bg-[#EFEFEF] p-1`}>{column[1]}</span>
                    <span className= {` border-white ${(index > 0) && 'border-l-2'} border-b-2 w-7 bg-[#EFEFEF] p-1 ${(index===2) && ' text-sm text-green-950 pl-0'}`}>{index === 2 ? 'Free' : column[2]}</span>
                    <span className= {` border-white ${(index > 0) && 'border-l-2'} border-b-2 w-7 bg-[#EFEFEF] p-1`}>{column[3]}</span>
                    <span className= {` border-white ${(index > 0) && 'border-l-2'} border-b-2 w-7 bg-[#EFEFEF] p-1`}>{column[4]}</span>
                </div>
            )
        }
                  {/* <div className='flex flex-col '>
                      <span className=' border-collapse w-7  text-white font-bold p-1'>B</span>
                      <span className=' border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1 -mr-1'>01</span>
                      <span className=' border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>02</span>
                      <span className=' border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>03</span>
                      <span className=' border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>04</span>
                      <span className=' border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>05</span>
                  </div>
                  <div className='flex flex-col'>
                      <span className=' w-7  text-white font-bold p-1'>I</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>16</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>17</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>18</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>19</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>20</span>
                  </div>
                  <div className='flex flex-col justify-center'>
                      <span className=' w-7  text-white font-bold p-1'>N</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>31</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>32</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1 pl-2 text-white'>X</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>34</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>35</span>
                  </div>
                  <div className='flex flex-col'>
                      <span className=' w-7  text-white font-bold p-1'>G</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>46</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>47</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>48</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>49</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>50</span>
                  </div>
                  <div className='flex flex-col'>
                      <span className=' w-7  text-white font-bold p-1'>O</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>61</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>62</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>63</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>64</span>
                      <span className='border-collapse border-l-2 border-b-2 w-7 bg-red-500 p-1'>65</span>
                  </div> */}
              </div>
    )
  }
  )
export default CardNumbers