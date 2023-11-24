import { ArrowUpward, NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, IconButton, Link, Paper, Typography } from "@mui/material";
import { themeColor } from "../../../App";

const FilesAddressBar = (props: { style?: any, path: any, onNavigate: (index: number) => void }) => {
    const breadcrumbs = !props.path ? [] : props.path.map((unit: { title: string, folderId: string }, index: number) => {
        if (index < props.path.length - 1) {
            return (
                <Link underline="hover" key={index} color="inherit" onClick={() => props.onNavigate(index)} component={'button'}>
                    {unit.title}
                </Link>
            )
        } else {
            return (
                <Typography key={index} color="inherit">
                    {unit.title}
                </Typography>
            )
        }
    })
    return (
        <Paper style={{ ...props.style, display: 'flex', backgroundColor: themeColor.get({ noproxy: true })[50], borderRadius: 24 }}>
            <IconButton onClick={() => ((breadcrumbs.length > 1) && (props.onNavigate(breadcrumbs.length - 2)))}>
                <ArrowUpward />
            </IconButton>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                style={{ width: '100%', paddingLeft: 4, paddingTop: 8, paddingBottom: 8 }}
            >
                {breadcrumbs}
            </Breadcrumbs>
        </Paper>
    )
}

export default FilesAddressBar
