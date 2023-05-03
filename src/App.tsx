import { Provider } from "react-redux";
import { SimpleEditor } from "./components/simpleEditor/SimpleEditor";
import { simpleEditorStore } from "./models/simpleEditor/editor";
import { useDrag } from "./components/utils/useDrag";
import { useCallback, useState } from "react";

function App() {
  const [state, setState] = useState<any>({ x: 0, y: 1 });
  const callback = useCallback(
    (e: any) => {
      const ev = e as MouseEvent;
      setState((prev: any) => {
        return { x: prev.x + e.movementX, y: prev.y + e.movementY };
      });
    },
    [setState]
  );
  const { dragging, handlers } = useDrag(callback);
  return (
    <Provider store={simpleEditorStore}>
      <div
        className="relative"
        onMouseLeave={handlers.onMouseLeave}
        onMouseUp={handlers.onMouseUp}
        onMouseMove={handlers.onMouseMove}
      >
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
      </div>
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
