
import * as RGL from 'react-grid-layout';
import Desktop from '../custom/components/Desktop';
import { useEffect, useRef } from 'react';

const useDesk = (show: boolean, editMode: boolean, saveLayouts: (layouts: ReactGridLayout.Layouts) => void, getLayouts: () => any) => {
    const desktopRef = useRef(new Desktop.DesktopData())
    desktopRef.current.fill(getLayouts())
    useEffect(() => {
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
