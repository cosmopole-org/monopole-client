import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

interface SigmaTabsProps {
    children?: React.ReactNode;
    value: string;
    onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const SigmaTabs = styled((props: SigmaTabsProps) => (
    <Tabs
        {...props}
        variant="fullWidth"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: blue[500],
    },
});

interface SigmaTabProps {
    icon: any,
    value: string
}

const SigmaTab = styled((props: SigmaTabProps) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#666',
    '&.Mui-selected': {
        color: blue[500],
    },
    '&.Mui-focusVisible': {
        backgroundColor: blue[500],
    },
}));

export {
    SigmaTabs,
    SigmaTab
}