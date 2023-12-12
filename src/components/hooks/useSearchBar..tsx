import { useRef } from "react"
import { statusbarHeight } from "../sections/StatusBar"

const useSearchBar = (cachedTopBackup: { value: number, maxValue: number }) => {
    const searchContainerRef = useRef(null)
    const collapseCallback = (dy: number, v: boolean, collapsibleScrollTop: number) => {
        if (searchContainerRef.current !== null) {
            let searchContainer = searchContainerRef.current as HTMLElement
            let checkedTop = cachedTopBackup.value - dy
            if (checkedTop > (24 + statusbarHeight())) checkedTop = cachedTopBackup.maxValue
            else if (checkedTop < -52) checkedTop = -52
            cachedTopBackup.value = checkedTop
            searchContainer.style.top = `${checkedTop}px`
            searchContainer.style.zIndex = (v ? 0 : 1).toString()
        }
    }
    return {
        collapseCallback,
        searchContainerRef
    }
}

export default useSearchBar
