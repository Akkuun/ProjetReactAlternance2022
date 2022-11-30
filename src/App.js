import './styleComponent/App.css';
import {Route, Router, Routes} from "react-router-dom";
import PageUserData from "./component/pageUserData";
import PageDeviceData from "./component/pageDeviceData";
import RouterBreadcrumbs from "./component/menu/componentSlideMenu"
import PageHome from "./component/pages/pageHome";


function App() {


    return (


        <div className="App">
            <RouterBreadcrumbs/>
            <Routes>
                {<Route path="/" element={<PageHome/>}/>}
                <Route path="/wattsProd" element={<PageHome/>} />
                <Route path="/wattsDev" element={<PageHome/>} />

                <Route path="/wattsProd/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/wattsProd/pageUserData" element={<PageUserData/>}/>

                <Route path="/wattsDev/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/wattsDev/pageUserData" element={<PageUserData/>}/>





            </Routes>

        </div>


    )
}

export default App;
