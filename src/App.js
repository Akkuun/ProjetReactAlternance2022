import './styleComponent/App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import PageUserData from "./component/pageUserData";
import PageDeviceData from "./component/pageDeviceData";
import RouterBreadcrumbs from "./component/menu/componentSlideMenu"
import PageHome from "./component/pages/pageHome";
import PageStatistics from "./component/PageStatistics";
import PageLogin from "./component/pageLogin";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import IconButton from "@mui/material/IconButton";

function HomeIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}
function App() {
    let navigate = useNavigate();
    
    return (
        <div className="App">
            {/*Routes des routeurs avec element pour rediriger l'utilisateur, :cloud est le paramètre qui sera pris dans la redirection*/}
            <RouterBreadcrumbs/>
    
            <IconButton onClick={e => navigate("/:cloud/login")}>
                <HomeIcon color="primary"/>
            </IconButton>
            <br/>
            <br/>
    
            <Routes>
                {<Route path="/" element={<PageHome/>}/>}
                <Route path="/wattsProd" element={<PageHome/>}/>
                <Route path="/wattsDev" element={<PageHome/>}/>
                
                <Route path="/stats" element={<PageStatistics/>}/>
                
                <Route path="/:cloud/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/:cloud/pageUserData" element={<PageUserData/>}/>
                <Route path="/:cloud/login" element={<PageLogin/>}/>
                
                <Route path="/:cloud/pageDeviceData" element={<PageDeviceData/>}/>
                <Route path="/:cloud/pageUserData" element={<PageUserData/>}/>
            </Routes>


        </div>
    )
}

export default App;
