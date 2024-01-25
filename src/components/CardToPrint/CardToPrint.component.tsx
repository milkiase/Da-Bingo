import { memo } from "react"
import Barcode from "react-barcode"
import { useSelector } from "react-redux"
import { selectGameID } from "../../store/setup/setupSelectors"
import { selectHouseName } from "../../store/auth/authSelectors"

const BINGO = ['B', 'I', 'N', 'G', 'O']
type CardToPrintProps = {
    cardArray: (string|number)[][],
    cardNumber: number
}

const CardToPrint = memo(({cardArray, cardNumber}: CardToPrintProps)=>{
    const gameID = useSelector(selectGameID)
    const houseName = useSelector(selectHouseName)
    return (
        <div className="hidden print:flex print:flex-col bg-white h-[100mm] w-[80mm] justify-center">
            <div className="flex justify-between items-center px-7 text-sm stroke-green-500 mt-auto">
                <span> <img src="https://i.imgur.com/5GcJpqs.png" alt="lucky bingo" className=" h-[9mm]"/></span>
                <div className=" flex flex-col items-end justify-center text-[12px] gap-0">
                    <span>No. {cardNumber}</span>
                    <span>{houseName}</span>
                </div>
            </div>
            <div className={'flex text-sm text-black mx-auto mb-0'}>
                {
                    cardArray.map((column, index)=>
                        <div className='flex flex-col text-lg font-bold' key={index}>
                            <span className={' border-slate-950 w-[13mm] h-[8mm] pt-1 border-b-2 font-normal text-center'}>{BINGO[index]}</span>
                            <span className= {` border-slate-950 ${(index > 0) && 'border-l-2'} border-b-2 pt-2 w-[13mm] h-[12mm] bg-[#EFEFEF] text-center ${!index ? 'border-l-2' : index===4 && 'border-r-2'}  -mr-1`} >{column[0]}</span>
                            <span className= {` border-slate-950 ${(index > 0) && 'border-l-2'} border-b-2 pt-2 w-[13mm] h-[12mm] bg-[#EFEFEF] text-center ${!index ? 'border-l-2' : index===4 && 'border-r-2'} `}>{column[1]}</span>
                            <span className= {` border-slate-950 ${(index > 0) && 'border-l-2'} border-b-2 pt-2 w-[13mm] h-[12mm] bg-[#EFEFEF] text-center ${!index ? 'border-l-2' : index===4 && 'border-r-2'}  ${(index===2) && ' text-2xs text-green-950'}`}>{index === 2 ? 'Free' : column[2]}</span>
                            <span className= {` border-slate-950 ${(index > 0) && 'border-l-2'} border-b-2 pt-2 w-[13mm] h-[12mm] bg-[#EFEFEF] text-center ${!index ? 'border-l-2' : index===4 && 'border-r-2'} `}>{column[3]}</span>
                            <span className= {` border-slate-950 ${(index > 0) && 'border-l-2'} border-b-2 pt-2 w-[13mm] h-[12mm] bg-[#EFEFEF] text-center ${!index ? 'border-l-2' : index===4 && 'border-r-2'} `}>{column[4]}</span>
                        </div>
                    )
                }
            </div>
            <div className=" flex  text-black items-center justify-center mt-1">
                {/* <span className=" z-10">{gameID}</span> */}
                {/* <div className=" -mt-3 z-0"> */}
                    <Barcode height={30} value={ gameID + '0000'.slice(0, 4 - cardNumber.toString().length) + cardNumber}/>
                {/* </div> */}
            </div>
        </div>
)
})

export default CardToPrint