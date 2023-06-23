import React from 'react';
import {useState,useEffect} from 'react';
import "./index.css";
import blueCandy from "./image/blue.png"
import greenCandy from "./image/green.png"
import orangeCandy from './image/orange.png'
import redCandy from './image/red.png'
import violetCandy from './image/violet.png'
import yellowCandy from './image/yellow.png'
import blank from './image/blank.png'
import ScoreBoard from './Component/Scoreboard';
import logo from './image/crush_logo.png'
const width=8
const CandyColors=[
  redCandy,
  blueCandy,
  greenCandy,
  yellowCandy,
  orangeCandy,
  violetCandy
]
const App = () =>{
   const [colorList,setcolorList]=useState([])
   const [startSquare,setstartSquare]=useState(null)
   const [endSquare,setendSquare]=useState(null)
   const [score,setScore]=useState(0)

   const checkForThreeColumn=()=>{
     for(let i=0;i<46;i++){
        const ThreeColor=[i,i+width,i+width*2]
        const startColor=colorList[i]
        const isBlank=colorList[i]===blank
        if(ThreeColor.every(colors=>colorList[colors]===startColor && !isBlank)){
           setScore((sco)=>sco+3)
            ThreeColor.forEach(color=>colorList[color]=blank)
            return true
        }
     }
   }

   const checkForThreeRow=()=>{
    for(let i=0;i<64;i++){
       const ThreeColor=[i,i+1,i+2]
       const startColor=colorList[i]
       const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]
       const isBlank=colorList[i]===blank
       if(notValid.includes(i))
            continue
       if(ThreeColor.every(colors=>colorList[colors]===startColor && !isBlank)){
        setScore((sco)=>sco+3)
           ThreeColor.forEach(color=>colorList[color]=blank)
           return true
       }
    }
  }

   const checkForFourColumn=()=>{
    for(let i=0;i<39;i++){
       const ThreeColor=[i,i+width,i+width*2,i+width*3]
       const startColor=colorList[i]
       const isBlank=colorList[i]===blank

       if(ThreeColor.every(colors=>colorList[colors]===startColor && !isBlank)){
        setScore((sco)=>sco+4)
           ThreeColor.forEach(color=>colorList[color]=blank)
           return true
       }
    }
  }
  const checkForFourRow=()=>{
        for(let i=0;i<64;i++){
            const rowColors=[i,i+1,i+2,i+3]
            const choseColor=colorList[i]
            const isBlank=colorList[i]===blank
            const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]
            if(notValid.includes(i))
                continue
            if(rowColors.every(color=>colorList[color]===choseColor && !isBlank)){
              rowColors.forEach(color=>colorList[color]=blank)
              setScore((sco)=>sco+4)
              return true
            }
        }
  }

  const changeEmptyColor=()=>{
    for(let i=0;i<64-width;i++){
        const firstRow=[0,1,2,3,4,5,6,7]
        const checkFirstRow=firstRow.includes(i)
        if(checkFirstRow && colorList[i]===blank){
            colorList[i]=CandyColors[Math.floor(Math.random() * CandyColors.length)]
        }

        if((colorList[i+width])===blank){
           colorList[i+width]=colorList[i]
           colorList[i]=blank
        }

    }
  }

   const Board = () =>{
     const randomArrangeColors=[]
          for(let i=0;i<width*width;i++){
              const randomNumber=Math.floor(Math.random() * CandyColors.length)
              const randomColor=CandyColors[randomNumber]
              randomArrangeColors.push(randomColor)
          }
          setcolorList(randomArrangeColors)
    }

    useEffect(()=>{
      const timer=setInterval(() => {
        checkForFourColumn()
        checkForFourRow()
        checkForThreeRow()
        checkForThreeColumn()
        changeEmptyColor()
        setcolorList([...colorList])
      }, 100);
      return ()=>clearInterval(timer)
    },[checkForFourColumn,checkForFourRow,checkForThreeColumn,checkForThreeRow,changeEmptyColor,colorList])

    useEffect(()=>{
      Board()
    },[])
   
    console.log(score)
    const dragStart=(e)=>{
      console.log(e.target)
      setstartSquare(e.target)
    }

    const dragDrop=(e)=>{
      console.log("dragDrop")
      console.log(e.target)
      setendSquare(e.target)
    }

    const dragEnd=()=>{
      console.log("drag end")
      const DragStart=parseInt(startSquare.getAttribute('data-id'))
      const DragEnd=parseInt(endSquare.getAttribute('data-id'))
      colorList[DragStart]=endSquare.getAttribute('src')
      colorList[DragEnd]=startSquare.getAttribute('src')
  

      const ValidMoves=[DragStart+1,DragStart-1,DragStart+width,DragStart-width]
      const ValidMove=ValidMoves.includes(dragEnd)
      const checkRowThree=checkForThreeRow()
      const checkRowFour=checkForFourRow()
      const checkColFour=checkForFourColumn()
      const checkColThree=checkForThreeColumn()

      if(DragStart && ValidMove && (checkRowThree || checkRowFour || checkColThree ||checkColFour)){
       
        setstartSquare(null)
        setendSquare(null)
      }
      else{
        colorList[DragStart]=startSquare.getAttribute('src')
        colorList[DragEnd]=endSquare.getAttribute('src')
        setcolorList([...colorList])
      }
    }
    
    return(
      <div className="app">
        <div className="chart">
           {colorList.map((candyColor,index)=>(
             <img
                key={index}
                src={candyColor}
                alt={candyColor}
                data-id={index}
                draggable={true}
                onDragStart={dragStart}
                onDragEnter={e=>{e.preventDefault()}}
                onDragLeave={e=>{e.preventDefault()}}
                onDragOver={e=>{e.preventDefault()}}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
              />

           ))}
        </div>
        <div >
          <div className="logo1">
          <img  src={logo} />
          </div>
         
          <h1 className="number">Score</h1>
        <ScoreBoard scores={score}></ScoreBoard>

        </div>
      </div>
    );
}
export default App;
