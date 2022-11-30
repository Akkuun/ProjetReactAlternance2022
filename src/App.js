import './styleComponent/App.css';
import {Route, Router, Routes} from "react-router-dom";
import DrawerSections from "./component/menu/componentSideMenu";
import PageUserData from "./component/pageUserData";
import PageDeviceData from "./component/pageDeviceData";
import RouterBreadcrumbs from "./component/menu/componentSlideMenuVariante"
import PageDeviceDataWattsProd from "./component/pageDeviceDataWattsProd";
import PageUserDataWattsProd from "./component/pageUserDataWattsProd";
import PageDeviceDataWattsDev from "./component/pageDeviceDataWattsDev";
import PageUserDataWattsDev from "./component/pageUserDataWattsDev";


function App() {


    return (


        <div className="App">
            {/*<DrawerSections/>*/}
            <RouterBreadcrumbs/>
            <Routes>
                <Route path="/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/pageUserData" element={<PageUserData/>}/>
                <Route path="/pageDeviceDataWattsProd" element={<PageDeviceDataWattsProd/>}/>
                <Route path="/pageUserDataWattsProd" element={<PageUserDataWattsProd/>}/>
                <Route path="/pageDeviceDataWattsDev" element={<PageDeviceDataWattsDev/>}/>
                <Route path="/pageUserDataWattsDev" element={<PageUserDataWattsDev/>}/>
            </Routes>

        </div>


    )
}

export default App;
