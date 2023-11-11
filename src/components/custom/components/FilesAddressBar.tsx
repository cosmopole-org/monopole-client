import { ArrowUpward, NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, IconButton, Link, Paper, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";

const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit">
        MUI
    </Link>,
    <Link underline="hover" key="2" color="inherit">
        Core
    </Link>,
    <Typography key="3" color="inherit">
        Breadcrumb
    </Typography>,
];

const FilesAddressBar = (props: { style?: any }) => {
    return (
        <Paper style={{ ...props.style, display: 'flex', backgroundColor: blue[50], borderRadius: 24 }}>
            <IconButton>
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
