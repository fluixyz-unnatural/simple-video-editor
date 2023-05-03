import { Provider } from "react-redux";
import { SimpleEditor } from "./components/simpleEditor/SimpleEditor";
import { simpleEditorStore } from "./models/simpleEditor/editor";

function App() {
  return (
    <Provider store={simpleEditorStore}>
      <SimpleEditor />
      {/* <div
          onMouseDown={handlers.onMouseDown}
          className="absolute h-6 w-6 bg-red-600"
          style={{
            top: state.y,
            left: state.x,
            border: dragging ? "solid" : "none",
          }}
        ></div> */}
      <div className="p-4 text-right text-slate-500">
        created by
        <a href="https://twitter.com/higara333" target="_blank">
          @higara333
        </a>
      </div>
    </Provider>
  );
}

export default App;
