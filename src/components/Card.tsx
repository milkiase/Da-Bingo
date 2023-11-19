import {memo, useMemo} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { buyCard, removeCard } from '../store/setup/setupSlice';
import { selectCards } from '../store/setup/setupSelectors';
import CardNumbers from './CardNumbers';

type CardProps = {
    i: number,
    cardArray: (string | number)[][]
}
const  Card = memo(({i, cardArray}: CardProps) =>{
    const dispatch = useDispatch()
    const cards = useSelector(selectCards)
    const isCartBought = useMemo(()=>{
        return cards.includes(i)
    }, [cards, i])

    const handleClick = ()=>{
        dispatch(isCartBought ? removeCard(i) : buyCard(i))
    }
    return (
        <div id={`${i}`} className="card w-29 shadow-xl bg-green-500 m-2 border-2 text-white mx-auto" >
            <div className="card-body px-0 py-0 mx-auto">
            <CardNumbers cardArray={cardArray} i={i}/>
            </div>  
            <button 
                onClick={handleClick} className={
                    `btn mx-auto my-1 text-sm text-green-50 min-h-6 h-6 
                    ${ isCartBought &&' bg-red-600 hover:bg-red-700 border-none'}`} 
                >{isCartBought ? 'Remove' : 'Buy'} #{i}</button>
        </div>
    )
}
)
export default Card