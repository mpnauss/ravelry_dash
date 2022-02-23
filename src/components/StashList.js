import React, { useState, useEffect } from "react"
import YarnShow from "./YarnShow"
import FiberChart from "./FiberChart"

const StashList = (props) => {

    const [stashList, setStashList] = useState([])
    const [stashFull, setStashFull] = useState([])
    const [totalYards, setTotalYards] = useState(0)
    const [weightYards, setWeightYards] = useState([])
    const [colorYards, setColorYards] = useState([])
    const [fiberYards, setFiberYards] = useState([])

    //Get the URL from OAuth redirect and find the access token inside it
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

    class YarnAmount {
        constructor(name, amount) {
            this.name = name;
            this.amount = amount;
        }
    }

    const filterYarnAmounts = (name, amountStashed, array) => {
        if (!array.filter(yarnAmtObj => yarnAmtObj.name === name).length > 0) {
            let yarnAmtObj = new YarnAmount(name, amountStashed)
            array.push(yarnAmtObj)
        } else {
            let arrayPosition = array.indexOf(array.find(yarnAmtObj => yarnAmtObj.name === name))
            array[arrayPosition].amount += amountStashed
        }
    }

    const getFullStashData = (data) => {
        let tempWeightsArray = []
        let tempColorsArray = []
        //If you put this into an array in state you won't have an issue with it doubling on rerender
        let tempTotalYards = totalYards
        let tempFibersArray = []
        try {
            let fullStashData = []
            data.forEach(async (stashItem) => {
                const indStashResponse = await fetch(`https://api.ravelry.com/people/fringerella/stash/${stashItem.id}.json`, {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + access_token
                    },
                    mode: 'cors'
                })
                const indStashData = await indStashResponse.json()
                fullStashData.push(indStashData.stash)

                //TOTAL AMT
                const amountStashed = indStashData.stash.packs[0].total_yards
                tempTotalYards += amountStashed
                setTotalYards(tempTotalYards)

                // WEIGHT AMTS
                const weightName = indStashData.stash.yarn_weight_name
                filterYarnAmounts(weightName, amountStashed, tempWeightsArray)
                setWeightYards(tempWeightsArray)

                // COLOR AMTS
                const colorFamilyName = indStashData.stash.color_family_name
                filterYarnAmounts(colorFamilyName, amountStashed, tempColorsArray)
                setColorYards(tempColorsArray)

                // FIBERS
                if (indStashData.stash.yarn != undefined) {
                    const fibersArray = indStashData.stash.yarn.yarn_fibers
                    if (fibersArray.length === 1) {
                        filterYarnAmounts(fibersArray[0].fiber_type.name, amountStashed, tempFibersArray)
                        console.log(tempFibersArray)
                    } else {
                        let largestFiberPercentage = 0
                        let mainFiberType = ""
                        fibersArray.forEach(fiber => {
                            if (fiber.percentage > largestFiberPercentage) {
                                largestFiberPercentage = fiber.percentage
                                mainFiberType = fiber.fiber_type.name + " blend"
                            }
                        })
                        filterYarnAmounts(mainFiberType, amountStashed, tempFibersArray)
                    }
                }
                setFiberYards(tempFibersArray)

                if (!indStashResponse.ok) {
                    const errorMessage = `${indStashResponse.status} (${indStashResponse.statusText})`
                    const error = new Error(errorMessage)
                    throw (error)
                }
            })
            setStashFull(fullStashData)
        } catch (err) {
            console.error(`Error in fetch: ${err.message}`)
        }
    }

    useEffect(() => {
        getStashList()
    }, [])

    useEffect(() => {
        getFullStashData(stashList)
    }, [stashList])

    const fibersAmtMap = fiberYards.map((yarnObj, index) => {
        let perc = yarnObj.amount / totalYards
        return <FiberChart
            key={yarnObj.name}
            name={yarnObj.name}
            percentage={perc}
            amt={yarnObj.amount}
        />
    })

    const stashMap = stashList.map(stashItem => {
        return <YarnShow
            key={stashItem.id}
            id={stashItem.id}
            name={stashItem.name}
            link={stashItem.permalink}
            colorway={stashItem.colorway_name}
        />
    })

    return (<div>{fibersAmtMap}</div>)
}

export default StashList