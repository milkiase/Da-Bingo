type BadgeProps = {
    title: string,
    quantity: number | string,
    color: string
}
function Badge({title, quantity, color='#4E73DF'}: BadgeProps) {
    return (
        <div className={` w-64 h-[100px] rounded-[8px] bg-gray-800 border-l-[4px] border-[${color}] 
            flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform 
            hover:scale-[103%] transition duration-300 ease-out my-2`}
            style = {{borderColor: color}}>
            <div>
                <h2 className={`text-[11px] leading-[17px] font-bold text-lg`} style = {{ color: color}}>{title}</h2>
                <h1 className='text-[20px] leading-[24px] font-bold text-white mt-[5px]'>{quantity}</h1>
            </div>
            {/* <FaRegCalendarMinus fontSize={28} color="" /> */}

        </div>
    )
}

export default Badge    