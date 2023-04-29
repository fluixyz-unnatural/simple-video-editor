import { Provider } from "react-redux";
import { SimpleEditor } from "./components/simpleEditor/SimpleEditor";
import { simpleEditorStore } from "./models/simpleEditor/editor";

function App() {
  return (
    <Provider store={simpleEditorStore}>
      <SimpleEditor />
    </Provider>
  );
}

export default App;
