import './Pattern.styles.scss';
const BINGO = ["B","I","N","G","O"]

type PatternProps = {
    pattern: boolean[][],
    hasHeader?: boolean,
    checkedCard?: (number | string)[][],
    canUpdatePattern?: boolean,
    updatePattern?: (pattern: boolean[][])=> void
}


function Pattern({ pattern,  hasHeader=true, checkedCard, canUpdatePattern=false, updatePattern}: PatternProps) {
    
    const updatePatternHandler = (columnIndex: number, rowIndex: number, currentCheckState: boolean) => {
        if(!canUpdatePattern) return
        const newPattern = [...pattern]
        newPattern[columnIndex][rowIndex] = !currentCheckState
        if(updatePattern) updatePattern(newPattern)
    }
    return (
        <div id="bingopattern" className="notranslate mt-3">
            {pattern.map((column, columnIndex) => {
                return (
                    <div key={columnIndex} className="row vertical-row text-center">
                        <div className={"col dark-bg white-text" + (!hasHeader && ' hidden')}><span>{BINGO[columnIndex]}</span></div>

                        {(column).map((cell, rowIndex) => {
                            return (
                                <div key={columnIndex + rowIndex} className={column[rowIndex] ? 'selected col' : 'col'}
                                    onClick={() => updatePatternHandler(columnIndex, rowIndex, cell)}
                                    >
                                    {columnIndex === 2 && rowIndex === 2 ? <span className="free-space">Free Space</span> : 
                                    <span>
                                        {
                                            checkedCard?.length ? checkedCard[columnIndex][rowIndex] : ' '
                                        }
                                    </span>}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Pattern