import { getValue } from "@testing-library/user-event/dist/utils"
import React, { useState, useEffect} from "react"
import YarnShow from "./YarnShow"

const NewStashList = (props) => {

    const [stashList, setStashList] = useState([1, 2, 3, 4, 5])
    const [fullStash, setFullStash] = useState([])
    const [weightYards, setWeightYards] = useState({})


    const getFullStashData = async (data) => {
        try {
            const reqs = data.map(stashItem => {
                const stashResponse = fetch(`http://localhost:8000/stash/${stashItem}`, {
                    method: 'GET'
                })
                return stashResponse
            })
            const responses = await Promise.all(reqs)
            const fullStashArray = await Promise.all(responses.map(response => response.json()))
            
            const tempWeightObj = {}
            fullStashArray.forEach(item => {
                let stashedYards = item.amount_yards
                Object.defineProperty(tempWeightObj, item.weight_name, {value: stashedYards, writable: true })

            })
            console.log(tempWeightObj)
            setWeightYards(tempWeightObj)
            setFullStash(fullStashArray)
            
        } catch (err) {
            console.error(`Error in fetch: ${err.message}`)
        }
    }

    useEffect(() => {
        getFullStashData(stashList)
    }, [stashList])


    return <div>test</div>
}

export default NewStashList