import {action, autorun, makeAutoObservable, makeObservable, observable} from "mobx";
import settings from "../settings";

class JamBoardStore {
    constructor() {
        makeObservable(this);
        const socket = new WebSocket('ws://localhost:81');
        this.socket = socket;

        socket.onopen = e => {
            console.log('connected')
        }

        socket.onmessage = e => {
            const newSheets = JSON.parse(e.data)
            this.sheets = newSheets;
        }
    }

    @observable
    sheets: Sheet[] = [new Sheet(null), new Sheet(null), new Sheet(null)];

    socket: WebSocket;

    @action
    moveSheetTo(sheet: Sheet, x: number, y: number) {
        sheet.x = x;
        sheet.y = y;
        this.sendToServer()
    }

    @action
    deleteSheet(sheet: Sheet) {
        this.sheets = this.sheets.filter(s => s.id !== sheet.id);
        this.sendToServer()
    }

    @action
    createSheet(params: any) {
        this.sheets.push(new Sheet(params))
        this.sendToServer()
    }

    @action
    raiseSheet(sheet: Sheet) {
        console.log('raise')
        const ind = this.sheets.findIndex(s => s.id === sheet.id);
        this.sheets.push(this.sheets.splice(ind, 1)[0])
        this.sendToServer()
    }

    @action
    resizeSheet(sheet: Sheet, size: number) {
        sheet.size = Math.max(size, settings.minSheetSize);
        this.sendToServer()
    }

    @action
    changeSheetColor(sheet: Sheet, color: string) {
        sheet.color = color;
        this.sendToServer()
    }

    async sendToServer() {
        const sheets = this.sheets;
        this.socket.send(JSON.stringify(sheets));
    }
}

interface SheetInterface {
    x: number;
    y: number;
    size: number;
    text: string;
    color: string;
    id: number;
}

class Sheet implements SheetInterface {
    x;
    y;
    size;
    text;
    color;
    id;

    constructor(params: any) {
        this.x = params?.x || 0;
        this.y = params?.y || 0;
        this.size = params?.size || settings.baseSheetSize;
        this.text = params?.text || "No texttexttextte xttexttext texttexttexttext";
        this.color = params?.color || '#84ff84';
        this.id = Math.random();
        makeAutoObservable(this);
    }
}

const store = new JamBoardStore();
export default store;

