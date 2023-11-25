const BINGO = ['B', 'I', 'N', 'G', 'O']
type KartelaProps = {
    cardArray: (number | string)[][],
    number: number
}

function Kartela({cardArray, number}: KartelaProps) {
    return (
        <div className={' flex flex-col text-black mx-auto  w-[14.85cm] h-[21cm] justify-end  rounded print:flex print:flex-col print:text-black print:mx-auto print:w-120 print:h-[30vw] print:justify-end print: print:rounded print:pt-10'}>
            <p className="flex justify-around py-1 w-full text-center font-bold bg-green-500 text-red-600 stroke-slate-950 text-3xl print:flex print:justify-around print:py-1 print:w-full print:text-center print:font-bold print:bg-green-500 print:text-red-600 print:stroke-slate-950 print:text-3xl">
                <span>ኣቡጊዳ</span>
                <span>#{number}</span>
            </p>
            <div className="flex print:flex">
            {
                cardArray.map((column, index)=>
                    <div className='flex flex-col justify-center gap-0 bg-green-500 print:bg-green-500 font-bold text-4xl' key={index}>
                        <span className=' border-collapse text-center text-white font-bold pb-3 w-[72px] h-12'>{BINGO[index]}</span>
                        <span className= {` border-white print:border-white ${(index > 0) && 'border-l-2 print:border-l-2'} border-b-2 print:border-b-2 w-[2.97cm] print:w-[2.97cm] h-[4.2cm] print:h-[4.2] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`} >{column[0]}</span>
                        <span className= {` border-white print:border-white ${(index > 0) && 'border-l-2 print:border-l-2'} border-b-2 print:border-b-2 w-[2.97cm] print:w-[2.97cm] h-[4.2cm] print:h-[4.2] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`}>{column[1]}</span>
                        <span className= {` border-white print:border-white ${(index > 0) && 'border-l-2 print:border-l-2'} border-b-2 print:border-b-2 w-[2.97cm] print:w-[2.97cm] h-[4.2cm] print:h-[4.2] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1 ${(index===2) && '  text-green-950 print:text-green-950'}`}>{index === 2 ? 'Free' : column[2]}</span>
                        <span className= {` border-white print:border-white ${(index > 0) && 'border-l-2 print:border-l-2'} border-b-2 print:border-b-2 w-[2.97cm] print:w-[2.97cm] h-[4.2cm] print:h-[4.2] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`}>{column[3]}</span>
                        <span className= {` border-white print:border-white ${(index > 0) && 'border-l-2 print:border-l-2'} border-b-2 print:border-b-2 w-[2.97cm] print:w-[2.97cm] h-[4.2cm] print:h-[4.2] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`}>{column[4]}</span>
                    </div>
                )
            }
            </div>
        </div>
    )
}

export default Kartela