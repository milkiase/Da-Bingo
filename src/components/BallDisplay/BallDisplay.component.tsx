import { useEffect } from 'react';

import gsap from 'gsap';

import './BallDisplay.styles.scss'

/**
 * Returns a bingo ball display using the selected ball object
 *
 * @return  {JSX}  JSX element
 */
type BallDisplayType = {
    letter: string, 
    number: number,
    color: string
}

const BallDisplay = ({color, number, letter}:BallDisplayType) => {
    useEffect(()=>{
        gsap.from('.ball-display', {
            duration: 1, 
            scale: '2', 
            ease: 'sine.out'
        })
    }, [color, number, letter])

    useEffect(()=>{
        gsap.from('.ball-display', {
            duration: 1, 
            scale: '2', 
            // ease: 'bounce'
        })
        gsap.to('.ball-display', {
            duration: 1, 
            // y: '100', 
            // x: '0',
            scale: '1',
            ease: 'circ.out'
        })
    }, [])
    return(
        <div className={"ball-display " + color + " relative notranslate"}>
        <div className="content text-black">
            <div className="ball-content">
            <div className="ball-letter">{letter}</div>
            <div className="ball-number">{number}</div>
            </div>
        </div>
        </div>
    )
}

export default BallDisplay;