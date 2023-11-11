import { FilterList, Search } from "@mui/icons-material"
import { statusbarHeight } from "../../sections/StatusBar"
import { IconButton, InputBase } from "@mui/material"
import { useRef, useState } from "react"

const SearchBar = (props: { containerRef: any, placeHolder: string, onSearch?: (text: string) => void }) => {
    const [searchText, setSearchText] = useState('')
    return (
        <div
            ref={props.containerRef}
            style={{
                width: 'calc(100% - 32px)',
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16 + statusbarHeight() + 8,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: 20,
                display: 'flex',
                zIndex: 0
            }}>
            <IconButton>
                <Search />
            </IconButton>
            <InputBase
                value={searchText}
                onChange={e => {
                    setSearchText(e.target.value)
                    props.onSearch && props.onSearch(e.target.value)
                }}
                placeholder={props.placeHolder}
                style={{ width: '100%', height: '100%' }}
                inputProps={{
                    style: {
                        height: '100%',
                        flex: 1,
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        verticalAlign: 'middle',
                        display: 'flex'
                    }
                }}
            />
            <IconButton>
                <FilterList />
            </IconButton>
        </div>
    )
}

export default SearchBar
