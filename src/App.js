import './styleComponent/App.css';
import {Route, Router, Routes} from "react-router-dom";
import DrawerSections from "./component/menu/componentSideMenu";
import PageUserData from "./component/pageUserData";
import PageDeviceData from "./component/pageDeviceData";


function App() {


    return (


        <div className="App">
            <DrawerSections/>
            <Routes>
                <Route path="/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/pageUserData" element={<PageUserData/>}/>
            </Routes>

        </div>


    )
}

export default App;
