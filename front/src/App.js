import {observer} from "mobx-react-lite";
import store from "./state/store";
import Sheet from "./components/Sheet";
import settings from "./settings";

const App = observer(() => {
  return (
    <div onMouseDown={handleMouseDown} data-app className="w-100 h-100">
      {store.sheets.map(sheet => <Sheet sheet={sheet} key={sheet.id}/>)}
    </div>
  );

  function handleMouseDown(e) {
    if (e.target.dataset.app) {
      store.createSheet({
        x: e.clientX - settings.baseSheetSize / 2,
        y: e.clientY - settings.baseSheetSize / 2
      })
    }
  }
})

export default App;
