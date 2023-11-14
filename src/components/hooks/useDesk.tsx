
import * as RGL from 'react-grid-layout';
import sampleApplet from '../../resources/code/sampleApplet';
import Desktop from 'sigma-desktop/dist/Desktop';
import { useEffect, useRef } from 'react';

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

const useDesk = (show: boolean, editMode: boolean) => {
    const desktopRef = useRef(new Desktop.DesktopData())
    useEffect(() => {
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
        desktopRef.current.fill(getLayouts(), getJsxContent())
        desktopRef.current.onLayoutChangeByUI((layouts: RGL.Layouts, updates: Array<any>) => {
            saveLayouts(layouts)
        })
        desktopRef.current.onLayoutChangeByCode((layouts: RGL.Layouts) => {
            saveLayouts(layouts)
        })
    }, [])
    return {
        desktop: desktopRef.current
    }
}

export default useDesk
