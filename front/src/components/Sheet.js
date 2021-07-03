import {observer} from 'mobx-react-lite';
import store from '../state/store';
import s from './sheet.module.scss';
import Paint from './paint.svg';
import settings from "../settings";

const Sheet = observer(({sheet}) => {
  const styles = {
    position: "absolute",
    top: sheet.y,
    left: sheet.x,
    backgroundColor: sheet.color,
    width: sheet.size,
    height: sheet.size,
  }
  const fontSize = (sheet.size / settings.baseSheetSize) + 'rem';
  return (
    <div className={s.sheet}
         style={styles}
         data-sheet
         tabIndex={0}
         onMouseDown={handleMouseDown}
         onDragStart={handleDragStart}
    >
      <header className={s.header} data-header>
        <div className={s.delete} onClick={handleDelete} data-delete>×</div>
        <label className={s.changeColor} data-color>
          <img src={Paint} alt="" width={30} height={30}/>
          <input type="color"
                 className={s.inputColor}
                 value={sheet.color}
                 onChange={(e) => store.setSheetColor(sheet, e.target.value)}
          />
        </label>
      </header>
      <textarea value={sheet.text}
                onInput={(e) => store.setSheetText(sheet, e.target.value)}
                className={s.textarea}
                style={{fontSize}}
      />
      <div className={s.resize} data-resize/>
    </div>
  );

  function handleMouseDown(e) {
    let isResizing = false;
    if (e.target.dataset.delete) return;
    if (!e.target.dataset.resize && !e.target.dataset.header) return;
    if (e.target.dataset.resize) isResizing = true;
    store.raiseSheet(sheet)
    var coords = {top: sheet.y, left: sheet.x};
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;
    var startingX = e.pageX;
    var startingSize = sheet.size;


    function moveAt(e) {
      store.moveSheetTo(sheet, e.pageX - shiftX, e.pageY - shiftY);
    }

    function resize(e) {
      store.resizeSheet(sheet, (startingSize + e.pageX - startingX));
    }

    document.onmousemove = function (e) {
      isResizing ? resize(e) : moveAt(e);
    };

    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    }

  }

  function handleDragStart() {
    return false;
  }

  function handleDelete(e) {
    store.deleteSheet(sheet)
  }
});

export default Sheet;
