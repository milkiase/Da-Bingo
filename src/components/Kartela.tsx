const BINGO = ['B', 'I', 'N', 'G', 'O']
type KartelaProps = {
    cardArray: (number | string)[][],
    number: number
}

function Kartela({cardArray, number}: KartelaProps) {
    return (
        <div className={' flex flex-col text-black mx-auto print:[mt-0.2cm] print:mb-[2cm] w-[15cm] h-[21.2cm] justify-end  rounded print:flex print:flex-col print:text-black print:mx-auto print:w-[15cm] print:h-[21.2cm] print:justify-start print:rounded print:text-6xl bg-green-500 print:bg-green-500 text-center print:text-center'}>
            <p className=" flex justify-between print:px-[1.202cm] py-1 w-full text-center font-bold bg-green-500 text-red-600 stroke-slate-950 text-6xl print:flex print:justify-between print:py-1 print:h-[2.4cm] print:w-full print:text-center print:font-bold print:bg-green-500 print:text-red-600 print:stroke-slate-950 print:text-7xl">
                <span className=" self-center text-gray-700 print:text-gray-700 print:text-7xl">Lucky</span>
                <span className=" self-center bg-white rounded-xl text-5xl font-bold align-middle h-[1.5cm] px-5 text-center print:bg-white print:rounded-xl print:text-5xl print:font-bold print:align-middle print:h-[1.5cm] print:px-5 print:text-center text-gray-700 print:text-gray-700 pt-1 print:pt-1"> {number}</span>
            </p>
            <div className="flex print:flex justify-center">
                {
                    cardArray.map((column, index)=>
                        <div className='flex flex-col justify-center gap-0 bg-green-500 print:bg-green-500 font-bold text-6xl' key={index}>
                            <span className=' text-center text-white font-bold pb-3 text-5xl w-[2.95cm] h-12 print:text-center print:text-white print:font-bold print:pb-3 print:w-[2.95cm] print:h-[1.7cm]'>{BINGO[index]}</span>
                            <span className= {` border-green-500 print:border-green-500 ${(index > 0) && 'border-l-4 print:border-l-4'} border-b-4 print:border-b-4 w-[2.95cm] print:rounded-xl print:w-[2.95cm] h-[3cm] print:h-[3cm] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`} >{column[0]}</span>
                            <span className= {` border-green-500 print:border-green-500 ${(index > 0) && 'border-l-4 print:border-l-4'} border-b-4 print:border-b-4 w-[2.95cm] print:rounded-xl print:w-[2.95cm] h-[3cm] print:h-[3cm] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`}>{column[1]}</span>
                            <span className= {` border-green-500 print:border-green-500 ${(index > 0) && 'border-l-4 print:border-l-4'} border-b-4 print:border-b-4 w-[2.95cm] print:rounded-xl print:w-[2.95cm] h-[3cm] print:h-[3cm] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1 ${(index===2) && '  text-gray-700 print:text-gray-700'}`}>{index === 2 ? <img src="src\assets\My_2D_Barcode.png" className=" -mt-[27px] h-[2.8cm] ml-[0.25cm]" height={'fit-content'}/> : column[2]}</span>
                            <span className= {` border-green-500 print:border-green-500 ${(index > 0) && 'border-l-4 print:border-l-4'} border-b-4 print:border-b-4 w-[2.95cm] print:rounded-xl print:w-[2.95cm] h-[3cm] print:h-[3cm] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`}>{column[3]}</span>
                            <span className= {` border-green-500 print:border-green-500 ${(index > 0) && 'border-l-4 print:border-l-4'} border-b-4 print:border-b-4 w-[2.95cm] print:rounded-xl print:w-[2.95cm] h-[3cm] print:h-[3cm] pt-7 print:pt-7 text-green-600 print:text-green-600 text-center print:text-center bg-[#EFEFEF] print:bg-[#EFEFEF] p-1 print:p-1`}>{column[4]}</span>
                        </div>
                    )
                }
            </div>
            {/* <div className=" h-[2.6cm] print:h-[2.6cm] py-[0.25cm] flex justify-between px-[0.5cm]"><span></span> <span className=" bg-white rounded-xl text-5xl font-bold align-middle h-[1.5cm] px-5 text-center print:bg-white print:rounded-xl print:text-5xl print:font-bold print:align-middle print:h-[1.5cm] print:px-5 print:text-center text-gray-700 print:text-gray-700 pt-1 print:pt-1"> {number}</span></div> */}
        </div>
    )
}

export default Kartela