import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import NavMenu from "./components/NavMenu.jsx";
import DisplayPage from "./components/DisplayPage.jsx";
import Card from "./components/Card.jsx";
import Intro from "./components/Intro.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

//function to handle the main content of the app
function AppContent() {
    const location = useLocation();
    //check for home
    const isHomePage = location.pathname === "/" || location.pathname === "/home";

    return (
        <div>
            <NavMenu />
            {isHomePage && <Intro />}
            <Routes>
                {/* Redirect old default to home */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* home route with card */}
                <Route path="/home" element={<Card />} />

                {/* SCP subject route */}
                <Route path="/scp/:id" element={<DisplayPage />} />

                {/* Admin Panel route */}
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </div>
    );
}

//router component to wrap the main content to allow navigation
export default function App() {
    return (
        <div className="background">
            <Router>
                <AppContent />
            </Router>
        </div>
    );
}
