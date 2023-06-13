import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from "dayjs";
import {DateTimePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

import SendIcon from '@mui/icons-material/Send';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
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
                            placeholder="Choix wattsType…"
                        >
                            <Option value={"Bt"}>Bt</Option>
                            <Option value={"Cm"}>Cm</Option>
                            <Option value={"Ma"}>Ma</Option>
                            <Option value={"Rt"}>Rt</Option>
                            <Option value={"bo"}>bo</Option>
                            <Option value={"cf"}>cf</Option>
                            <Option value={"df"}>df</Option>
                            <Option value={"ec"}>ec</Option>
                        </Select>

                        <Select
                            disabled={false}
                            placeholder="Choix cloud…"
                        >
                            <Option value={"Deltacalor"}>Deltacalor</Option>
                            <Option value={"Dev"}>Dev</Option>
                            <Option value={"FENIX"}>FENIX</Option>
                            <Option value={"GKP"}>GKP</Option>
                            <Option value={"Prod"}>Prod</Option>
                        </Select>
                    <Button variant="contained" endIcon={<SendIcon /> } onClick={() => {
                        console.log()



                    }}>
                        Envoyer requête
                    </Button></div>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}