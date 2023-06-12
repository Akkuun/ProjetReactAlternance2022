import './styleComponent/App.css';
import {Route, Routes} from "react-router-dom";
import PageUserData from "./component/pageUserData";
import PageDeviceData from "./component/pageDeviceData";
import RouterBreadcrumbs from "./component/menu/componentSlideMenu"
import PageHome from "./component/pages/pageHome";
import PageLocalisation from "./component/pages/pageLocalisation";
import PageStatistique from "./component/pageStatistique";

function App() {
    return (
        <div className="App">
            {/*Routes des routeurs avec element pour rediriger l'utilisateur, :cloud est le paramètre qui sera pris dans la redirection*/}
            <RouterBreadcrumbs/>
            <Routes>
                {<Route path="/" element={<PageHome/>}/>}

                <Route path="/wattsProd" element={<PageHome/>}/>
                <Route path="/wattsDev" element={<PageHome/>}/>
                <Route path="/GKP" element={<PageHome/>}/>
                <Route path="/FENIX" element={<PageHome/>}/>
                <Route path="/DELTACALOR" element={<PageHome/>}/>

                

                
                <Route path="/:cloud/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/:cloud/pageUserData" element={<PageUserData/>}/>
                
                <Route path="/:cloud/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/:cloud/pageUserData" element={<PageUserData/>}/>
                <Route path="/:cloud/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/:cloud/pageUserData" element={<PageUserData/>}/>
                <Route path="/:cloud/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/:cloud/pageUserData" element={<PageUserData/>}/>


                <Route path="/:cloud/pageLocalisation" element={<PageLocalisation/>}/>
                <Route path="/:cloud/pageLocalisation" element={<PageLocalisation/>}/>
                <Route path="/:cloud/pageLocalisation" element={<PageLocalisation/>}/>
                <Route path="/:cloud/pageLocalisation" element={<PageLocalisation/>}/>


                <Route path="/:cloud/pageStatistique" element={<PageStatistique/>}/>
            </Routes>
        </div>
    )
}

export default App;
