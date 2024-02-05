import {memo, useMemo, useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { buyCard, printCard, removeCard } from '../store/setup/setupSlice';
import { selectCards, selectPrintedCards } from '../store/setup/setupSelectors';
import { HiPrinter } from 'react-icons/hi';
import CardNumbers from './CardNumbers';
import ReactToPrint from 'react-to-print';
import CardToPrint from './CardToPrint/CardToPrint.component';
import { selectIsUserAdmin } from '../store/auth/authSelectors';
type CardProps = {
    i: number,
    cardArray: (string | number)[][],
    showButton?: boolean,
}
const Card = memo(({i, cardArray, showButton=true}: CardProps) =>{
    const dispatch = useDispatch()
    const cards = useSelector(selectCards)
    const printedCards = useSelector(selectPrintedCards)
    const isUserAdmin = useSelector(selectIsUserAdmin)
    const printRef = useRef<HTMLDivElement | null>(null)
    // const [isPrinted, setIsPrinted] = useState(false)
    const isCartBought = useMemo(()=>{
        return cards.includes(i)
    }, [cards, i])

    const handleClick = ()=>{
        // if(isPrinted) return
        dispatch(isCartBought ? removeCard(i) : buyCard(i))
        // setIsPrinted(false)
    }
    const handlePrintCard = ()=>{
        dispatch(printCard(i))
    }
    const isCardPrinted = useMemo(()=>{
        return printedCards?.includes(i)
        // return false
    }, [printedCards])
    return (
        <div id={`${i}`} className="card w-29 shadow-xl bg-green-500 m-2 border-2 text-white mx-auto" >
            <div className="card-body px-0 py-0 mx-auto">
                <CardNumbers cardArray={cardArray} i={i} />
            </div>  
            <div className='flex justify-around'>
                {showButton ? <button 
                    disabled={ isCardPrinted &&  !isUserAdmin}
                    onClick={handleClick} className={
                        `btn  my-1 text-sm text-green-50 min-h-6 h-6 w-24 disabled:text-gray-300
                        ${ isCartBought &&' bg-red-600 hover:bg-red-700 border-none'}`} 
                    >{isCartBought ? 'Rem' : 'Buy'} {i}</button> : <div className='h-2'></div>} 
                {(isCartBought && !isCardPrinted && showButton) &&  
                    <ReactToPrint trigger={()=><button id={`print-btn-${i}`}><HiPrinter className=" text-gray-900"/></button>}
                        content={()=> printRef.current}
                        documentTitle={'card - ' + i}
                        onAfterPrint={handlePrintCard}
                        >
                    </ReactToPrint>
                }
                <div ref={printRef}>
                    <CardToPrint cardArray={cardArray} cardNumber={i} />
                </div>
            </div>
        </div>
    )
}
)
export default Card