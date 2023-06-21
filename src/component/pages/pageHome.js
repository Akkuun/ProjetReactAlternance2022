import React from "react"
import { Player } from '@lottiefiles/react-lottie-player';

const pageHome = ()=> {
    return (
<div style={{width: "78%"}}>
        <Player
          loop autoplay  src='https://assets7.lottiefiles.com/packages/lf20_0uwehwnd.json'
            className="player"
        />
    <div style={{fontFamily: "Georgia, serif",
        fontSize: "40px",
        letterSpacing: "0px",
        wordSpacing:" 0.2px",
        color:" #000000",
        fontWeight:" 700",
       textDecoration:" none",
        fontStyle: "normal",
        fontVariant: "normal",
        textTransform: "none"}}>
        EAGLE 3000
    </div>
</div>
    )
}
export default pageHome;