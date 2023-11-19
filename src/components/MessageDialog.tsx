type MessageDialogProps = {
    title ?: string,
    message: string,
    accept : ()=> void,
    decline : ()=> void
}
function MessageDialog({title, message, accept, decline}:MessageDialogProps) {
    return (
        <div className='absolute top-0 left-0 w-full h-full bg-opacity-25 bg-black'>
            <div className=' mx-auto mt-[20vh] rounded bg-slate-800 w-fit px-8 py-4'>
                {title && <h4 className=" my-2">{title}</h4>}
                <p className=" my-2">{message}</p>
                <div className=" flex justify-around mt-4">
                    <button className=" w-24 rounded btn btn-success" onClick={accept}>Yes</button>
                    <button className=" w-24 rounded btn btn-error" onClick={decline}>No</button>
                </div>
            </div>
        </div>
    )
}

export default MessageDialog