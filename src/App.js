import "./App.css";
import Home from "./Sections/Home/Home";
import AboutMe from "./Sections/AboutMe/AboutMe";
import ScreenHeader from "./Sections/ScreenHeader/ScreenHeader";
import ProjectList from "./Sections/Project/ProjectList/ProjectList";

function App() {
  return (
    <div className="App" id="Home">
      <ScreenHeader />
      <Home />
      <AboutMe />
      <br/>
      <div id="Projects"></div>
      <br/>
      <br/>
      <br/>
      <ProjectList/>
    </div>
  );
}

export default App;
