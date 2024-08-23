import { FilterList, Search } from "@mui/icons-material"
import { statusbarHeight } from "../../sections/StatusBar"
import { IconButton, InputBase, Paper } from "@mui/material"
import { useRef, useState } from "react"
import { themeColor } from "../../../App"

const SearchBar = (props: { containerRef: any, placeHolder: string, onSearch?: (text: string) => void, style?: any }) => {
    const [searchText, setSearchText] = useState('')
    return (
        <Paper
            elevation={0}
            ref={props.containerRef}
            style={{
                width: 'calc(100% - 32px)',
                height: 40,
                position: 'absolute',
                left: 16,
                top: 16 + statusbarHeight() + 8,
                backgroundColor: themeColor.get({ noproxy: true })[100],
                backdropFilter: 'blur(10px)',
                borderRadius: 20,
                display: 'flex',
                zIndex: 0,
                border: `1px solid ${themeColor.get({ noproxy: true })['plain']}`,
                ...props.style
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
        </Paper>
    )
}

export default SearchBar
