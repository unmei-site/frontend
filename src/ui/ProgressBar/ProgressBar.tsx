import React, {CSSProperties} from "react";
import './ProgressBar.sass';

const ProgressBar = ({ progress, color, alternative }: { progress: number, color: string, alternative?: boolean }) => {
    const rightSide: CSSProperties = progress <= 50 ? { display: "none" } : { transform: 'rotate(180deg)' };
    const borderColor: CSSProperties = { borderColor: color };

    return (
        <div className={alternative ? 'pie-wrapper progress style-2' : "pie-wrapper progress-75"}>
            <span className="label">{progress}<span className="percent">%</span></span>
            <div className="pie" style={progress <= 50 ? {} : { clip: 'rect(auto, auto, auto, auto)' }}>
                <div className="left-side half-circle" style={{...borderColor, transform: `rotate(${progress*3.6}deg)`}}/>
                <div className="right-side half-circle" style={{...borderColor, ...rightSide}}/>
            </div>
            {alternative && <div className="shadow"/>}
        </div>
    )
}

export default ProgressBar;
