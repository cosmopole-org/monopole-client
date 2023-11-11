
import * as RGL from 'react-grid-layout';
import sampleApplet from '../../resources/code/sampleApplet';
import Desktop from 'sigma-desktop/dist/Desktop';

const getJsxContent = () => {
    let jsxContent = localStorage.getItem('jsxContent')
    if (jsxContent !== null) {
        let res = JSON.parse(jsxContent)
        let prepared: { [id: string]: string } = {}
        Object.keys(res).forEach(k => {
            prepared[k] = sampleApplet
        })
        return prepared
    } else {
        return {}
    }
}

const saveJsxContent = (jsxContent: { [id: string]: string }) => {
    localStorage.setItem('jsxContent', JSON.stringify(jsxContent))
}

const getLayouts = () => {
    let gridStr = localStorage.getItem('grid')
    if (gridStr !== null) {
        return JSON.parse(gridStr)
    } else {
        return { lg: [], md: [], sm: [], xs: [], xxs: [] }
    }
}

const saveLayouts = (layouts: ReactGridLayout.Layouts) => {
    localStorage.setItem('grid', JSON.stringify(layouts))
}

let codes: { [id: string]: string } = getJsxContent()
const desktop = new Desktop.DesktopData()
desktop.fill(getLayouts(), getJsxContent())
desktop.onLayoutChangeByUI((layouts: RGL.Layouts, updates: Array<any>) => {
    saveLayouts(layouts)
})
desktop.onLayoutChangeByCode((layouts: RGL.Layouts) => {
    saveLayouts(layouts)
})

const useDesk = (show: boolean, editMode: boolean) => {
    const addWidget = () => {
        let id = Math.random().toString();
        codes[id] = sampleApplet;
        saveJsxContent(codes);
        desktop.addWidget({ id, jsxCode: sampleApplet, gridData: { w: 8, h: 6 } })
    }
    return {
        addWidget,
        desktop
    }
}

export default useDesk
