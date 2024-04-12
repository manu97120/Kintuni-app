'use client'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
// import dayjs from 'dayjs';

export function ClientComponent({children}: { children: React.ReactNode }){
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}
        </LocalizationProvider>
    );
}
export default function NatalChartForm(){
    return  (
        <>
        <DatePicker className='text-black bg-white' label="Date picker" />
                    <TimePicker className='text-black bg-white' label="Time picker" /></>
    );
}