import { Provider } from "react-redux";
import { materialStore } from "../../models/editor/editor";
import { Control } from "./control/Control";
import { Preview } from "./preview/Preview";
import { Timeline } from "./timeline/Timeline";
import { Toolbar } from "./toolbar/Toolbar";

export function SuperEditor() {
  return (
    <Provider store={materialStore}>
      <img src="/icarus.jpg" width="100" />
      <div className="editor">
        <Toolbar />
        <Preview />
        <Timeline />
        <Control />
      </div>
    </Provider>
  );
}
