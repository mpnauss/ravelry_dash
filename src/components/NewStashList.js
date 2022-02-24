import { getValue } from "@testing-library/user-event/dist/utils"
import React, { useState, useEffect} from "react"
import YarnShow from "./YarnShow"

const NewStashList = (props) => {

    const [stashList, setStashList] = useState([])
    const [fullStash, setFullStash] = useState([])
    const [weightYards, setWeightYards] = useState({})

    const url = window.location.hash
    const access_token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];

    const getStashList = async () => {
        try {
            const stashListResponse = await fetch('https://api.ravelry.com/stash/search.json?query=fringerella&stash-status=stash',
                {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + access_token
                    },
                    mode: 'cors'
                })
            if (!stashListResponse.ok) {
                const errorMessage = `${stashListResponse.status} (${stashListResponse.statusText})`
                const error = new Error(errorMessage)
                throw (error)
            }
            const stashData = await stashListResponse.json()
            setStashList(stashData.stashes)
        } catch (err) {
            console.error(`Error in fetch: ${err.message}`)
        }
    }

    useEffect(() => {
        getStashList()
    }, [])

    const getFullStashData = async (data) => {
        try {
            const reqs = data.map(stashItem => {
                const stashResponse = fetch(`https://api.ravelry.com/people/fringerella/stash/${stashItem.id}.json`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + access_token
                    },
                    mode: 'cors'
                })
                return stashResponse
            })
            const responses = await Promise.all(reqs)
            const fullStashArray = await Promise.all(responses.map(response => response.json()))
            
            const tempWeightObj = {}
            fullStashArray.forEach(item => {
                let stashedYards = item.stash.packs[0].total_yards
                let weightName = item.stash.yarn_weight_name
                Object.defineProperty(tempWeightObj, item.stash.yarn_weight_name, {value: stashedYards, writable: true })
                // setWeightYards({weightName: stashedYards, ...weightYards})
                // console.log(weightYards)
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