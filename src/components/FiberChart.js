import React from "react"

const FiberChart = props => {

    let percent = props.percentage * 100

        return (
            <div>
                <span>{props.amt} yards of {props.name}: {props.percentage*100}%</span>
            </div>    
        )
    
}

export default FiberChart