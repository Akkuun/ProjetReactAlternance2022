import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from "dayjs";
import {DateTimePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

import SendIcon from '@mui/icons-material/Send';
export default function TimePickingComponent() {
    const [value, setValue] = React.useState();
    const [value2, setValue2] = React.useState();

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                    <div style={{display:"flex", flexDirection:"row" ,borderColor:"green", borderStyle:"solid"}}>
                    <DateTimePicker
                        label="Début"
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                    <DateTimePicker
                        label="Fin"
                        value={value2}
                        onChange={(newValue) => setValue2(newValue)}
                    />
                        <Select
                            disabled={false}
                            placeholder="Choose one…"
                        >
                            <Option>titi</Option>
                            <Option>tata</Option>
                        </Select>

                    <Button variant="contained" endIcon={<SendIcon />}>
                        Envoyer requête
                    </Button></div>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}