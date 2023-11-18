
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

interface SigmaTextFieldProps {
    label?: string;
    defaultValue?: string,
    value?: string;
    onChange?: (event: any) => void;
    style?: any
}

const SigmaTextField = styled((props: SigmaTextFieldProps) => (
    <TextField
        {...props}
        style={{
            ...props.style,
            borderRadius: 16
        }}
        inputProps={{
            style: {
                borderRadius: 16
            }
        }}
    />
))(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#666',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: 16
        },
    }
}))

export default SigmaTextField
