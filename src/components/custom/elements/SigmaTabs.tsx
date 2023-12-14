import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

interface SigmaTabsProps {
    children?: ReactNode | Array<ReactNode>;
    value: string;
    variant?: any,
    onChange: (event: React.SyntheticEvent, newValue: string) => void;
    style?: any,
    centered?: boolean
}

const SigmaTabs = styled((props: SigmaTabsProps) => (
    <Tabs
        {...props}
        variant={props.variant ? props.variant : "fullWidth"}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))(({ theme }) => ({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: theme.palette.action.active,
    },
    '& button': {
        minWidth: 0
    }
}));

interface SigmaTabProps {
    icon?: any,
    value: string,
    label?: any
}

let SigmaTab = styled((props: SigmaTabProps) => (
    <Tab disableRipple {...props} label={props.label} icon={props.icon} />
))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
}))

export {
    SigmaTabs,
    SigmaTab
}
