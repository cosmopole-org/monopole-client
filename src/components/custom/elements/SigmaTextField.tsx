
import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

interface SigmaTabsProps {
    label?: string;
    defaultValue?: string,
    value?: string;
    onChange?: (event: any) => void;
    style?: any
}

const SigmaTextField = styled((props: SigmaTabsProps) => (
    <TextField
        {...props}
        style={{
            ...props.style,
            backgroundColor: '#fff',
            borderRadius: 16
        }}
        inputProps={{
            style: {
                borderRadius: 16
            }
        }}
    />
))({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderRadius: 16
        },
    },
});

export default SigmaTextField
