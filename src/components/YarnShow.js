import React, {useState, useEffect} from "react"

const YarnShow = props => {

    let link = "http://www.ravelry.com/people/Fringerella/stash/" + props.link


        return (
            <div>
                <h3><a href={link}>{props.name}</a></h3>
                <span>{props.colorway}</span>
            </div>    
        )
    
}

export default YarnShow