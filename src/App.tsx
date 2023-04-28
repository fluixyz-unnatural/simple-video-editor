import { Preview } from "./components/preview/Preview";
import { Timeline } from "./components/timeline/Timeline";
import { Control } from "./components/control/Control";
import { Toolbar } from "./components/toolbar/Toolbar";
import { Provider } from "react-redux";
import { materialStore } from "./models/editor/editor";

function App() {
  return (
    <Provider store={materialStore}>
      <div className="editor">
        <Toolbar />
        <Preview />
        <Timeline />
        <Control />
      </div>
    </Provider>
  );
}

export default App;
