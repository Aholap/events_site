import React, { useEffect, useState,  } from 'react';
import Page from './components/Page'
import './App.css';
import axios from 'axios';
import { GoogleMap, LoadScript} from '@react-google-maps/api'
import Mark from './components/MapMarker'

require('dotenv').config()

const App =() => {

  const [center, setCenter] = useState({
    lat: 60.192059,
    lng: 24.945831
  })
  
  const api_key = process.env.KEY
  const [siteData, setData] = useState(null)
  const [showData, setShowData] = useState(null)
  const [filterText, setFilterText] = useState("")

  

  var topButton = null
  var topButtonText = null
  var textFilter = null
  

  const updateValue = (val) => {
    setFilterText(val)
  }
  
  useEffect(() => {
    topButton = document.getElementById("toTop")
    topButtonText = document.getElementById("topButText")
    textFilter = document.getElementById("filter")

    if (textFilter){
      textFilter.addEventListener("input", updateValue(textFilter.value));
    
    }
    
    
  })
  


  const scrollToPageTop = () => {
    
    document.body.scrollTop = 550
    document.documentElement.scrollTop = 550
    
  }

  

  const showScrollButton = () => {
    if (topButton) {

      if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000){
        topButton.style.display = "inline-block"
        topButtonText.style.display = "block"
      }
      else
      {   
        topButton.style.display = "none"
        topButtonText.style.display = "none"
      }
    }


  }

  const highlightTopScroller = () => {
    
    if (topButton && topButtonText){
      topButton.style.borderRight =  "5px solid white"
      topButton.style.borderBottom =  "5px solid white"
      topButtonText.style.color = "white"
      topButton.style.opacity = 1
      topButtonText.style.opacity = 1

    }


  }

  const unHighlightScroller = () => {

    topButton.style.opacity = 0.8
    topButtonText.style.opacity = 0.8

  }



  


  window.onscroll = showScrollButton

  

  const get_api_data =async () => {
    const a = await axios.get('https://tranquil-brushlands-44401.herokuapp.com/events')
    
    return a.data

  }



  useEffect(() => {
    const a = get_api_data()
    .then((d) =>{
       setData(d.data)
       setShowData(d.data)
      })

    

    

  }, [])

  const filterResults = () => {
    setFilterText(textFilter.value)
    setShowData(siteData.filter(d => d.name.fi.toLowerCase().includes(textFilter.value.toLowerCase())))

  }
  

  

  if (showData === null){
 
    return (

    <div className="loader">
      Loading..


    </div>
  )
  

  }
  


  else{

    return(
      <div className='sub-bod'>

        <p className="topButText" id="topButText">
          Scroll to top
        </p>

        <button 
        id="toTop" className="topButton" 
        onClick = {() => scrollToPageTop()}  
        onMouseOver = {() => highlightTopScroller()} 
        onMouseLeave = {() => unHighlightScroller()} >
        </button>


        <h1 className='App-header'>
          Tapahtumat Helsingissä
        </h1>
        
        <LoadScript id="script-loader" googleMapsApiKey={api_key}>
        
        <GoogleMap
        id="circle-example"
        mapContainerStyle={{
          height : 400,
          width : window.width,
          position:'relative',
        }}
        zoom={9}
        center={center}>

        {siteData.map(d => 
          
            <Mark key={d.id} setC = {() => setCenter({lat: d.location.lat, lng: d.location.lon})} data = {d}></Mark>
        )}
        </GoogleMap>        
      </LoadScript>

      <form className="form"> 
 
          <label> Type to filter results

          </label>
          <input id="filter" className="label" type="text" value={filterText} onChange = {() => filterResults()}/>

          <h1></h1>

      </form>

        
        {
        showData.map(d => 
        <Page key={d.id} page={d}/>)}

        
      </div>
    )
  }
  
}
export default App
