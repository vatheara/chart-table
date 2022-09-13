import './App.css';
import { useRef,useState ,cloneElement, useEffect} from 'react';
import {AdvancedRealTimeChart} from 'react-ts-tradingview-widgets';



const GenerateColumns = ({chart,index,removeChart}) => {

  const divRef = useRef(null);

  const toggleFullScreen = () => {
    divRef.current.classList.toggle('chart-full-screen');
  }

  const handleRemoveChart = () => {
    if(divRef.current.classList.contains('chart-full-screen')){
      divRef.current.classList.remove('chart-full-screen');
    }
    removeChart(index);
  }

  if(chart)
  return(
    <div className="col" ref={divRef}>
          {chart}
          <div className='group-btn'>
            <button className='full-screen-btn' onClick={toggleFullScreen}>❐</button>
            <button className='close-screen-btn' onClick={handleRemoveChart} >✕</button>
          </div>
    </div>
  )

  return(<div className="col"></div>);
};


const GenrateGrid = ({width, height, charts , removeChart}) => {
  let index = 0;
  // console.log('charts', charts);
  // console.log('index', index);
 

  let charts_per_screen = width*height;
  let screens = Math.ceil(charts.length/charts_per_screen);

 
  return(
    <>
      {
        Array.from(Array(screens)).map((_,i) => {
          return(<div key={i} className="main-screen">
           {
              Array.from(Array(height)).map((_, i) => {
                  return(
                    <div key={i} className="row">
                      {
                        Array.from(Array(width)).map((_, j) => {
                          return(
                            <GenerateColumns key={j} index={index} removeChart={removeChart} chart={charts[index++]}/>
                          )
                        })
                      }
                    </div>
                  )
              })
          }
          </div>)
          
        })
      }
    </>
  )
};


function App() {

  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(2);
  const [theme, setTheme] = useState('light');
  const [charts, setCharts] = useState([<AdvancedRealTimeChart copyrightStyles={{parent:{display:'none'}}} theme={theme} autosize/>,
                                        <AdvancedRealTimeChart copyrightStyles={{parent:{display:'none'}}} theme={theme} autosize/>,
                                        <AdvancedRealTimeChart copyrightStyles={{parent:{display:'none'}}} theme={theme} autosize/>,
                                        <AdvancedRealTimeChart copyrightStyles={{parent:{display:'none'}}} theme={theme} autosize/>]);


 const toggleTheme = () => {
    if(theme === 'light'){
      setTheme('dark');
      setCharts(charts.map(chart => {
        return cloneElement(chart, {theme:'dark'});
      }));
    }
    else{
      setTheme('light');
      setCharts(charts.map(chart => {
        return cloneElement(chart, {theme:'light'});
      }));
    }
 }

 const addChart = () => {
    setCharts([...charts,<AdvancedRealTimeChart copyrightStyles={{parent:{display:'none'}}} theme={theme} autosize/>]);
 };

 const removeChart = (index) => {
    charts.splice(index,1);
    setCharts([...charts]);
 }
useEffect(() => {
   window.onscroll = function() {handleSticky()};
 
   var header = document.getElementById("myHeader");
   var sticky = header.offsetTop;
   function handleSticky() {
     if (window.pageYOffset > sticky+20) {
       header.classList.add("sticky");
     } else {
       header.classList.remove("sticky");
     }
   }

},[])
 

 

  return (<>
            <div id="myHeader" className='top-bar' >
              <div className='label'>Width</div>
              <input type="number" min={1} max={10} value={width} onChange={(e) => setWidth(+e.target.value)}/>
              <div className='label'>Height</div>
              <input type="number" min={1} max={10} value={height} onChange={(e) => setHeight(+e.target.value)}/>
              <button onClick={toggleTheme} style={{marginLeft:'8px',marginRight:'8px'}}>{theme}</button>
              <button onClick={addChart}>add chart ({charts.length})</button>
            </div>
            <GenrateGrid width={width} height={height} removeChart={removeChart} charts={charts}/>
          </>
  );
}

export default App;
