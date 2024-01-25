import {memo} from 'react'
const BINGO = ['B', 'I', 'N', 'G', 'O']
type CardNumbersProps = {
    i: number,
    cardArray: (string | number)[][],
    className?: string
}
const CardNumbers = memo(({cardArray, className}: CardNumbersProps)=>{
    return (
    <div className={'flex text-sm text-black mx-auto' + className}>
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
    </div>
    )
  }
  )
export default CardNumbers