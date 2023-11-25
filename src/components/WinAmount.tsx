import { numberWithCommas } from "../utils/game.utils"

type WinAmountProps = {
    winAmount: number
}
function WinAmount({winAmount}:WinAmountProps) {
  return (
    <div className=" flex justify-center bg-slate-800 w-[35vw] h-[20vh] mt-[10vh] rounded-sm">
      <p id="derash" className="self-center text-7xl">ደራሽ ፡ {numberWithCommas(winAmount)}</p>
    </div>
  )
}

export default WinAmount