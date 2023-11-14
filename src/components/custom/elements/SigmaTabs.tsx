import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

interface SigmaTabsProps {
    children?: ReactNode | Array<ReactNode>;
    value: string;
    onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const SigmaTabs = styled((props: SigmaTabsProps) => (
    <Tabs
        {...props}
        variant="fullWidth"
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
        backgroundColor: theme.palette.primary.main,
    },
}));

interface SigmaTabProps {
    icon: any,
    value: string
}

let SigmaTab = styled((props: SigmaTabProps) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#666',
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
    '&.Mui-focusVisible': {
        backgroundColor: theme.palette.primary.main,
    }
}))

export {
    SigmaTabs,
    SigmaTab
}
