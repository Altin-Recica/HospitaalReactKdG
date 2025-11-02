import {PatientMedicatie} from "../model/Patient.ts";
import dayjs from 'dayjs';
import {Medicatie} from "../model/Medicatie.ts";

export const getUrgencyColor = (medications: (PatientMedicatie & Medicatie)[]) => {
    const now = dayjs();

    for (const med of medications) {
        const [hourStr, minuteStr, secondStr] = med.time.split(':');

        const medTime = dayjs().hour(Number(hourStr)).minute(Number(minuteStr)).second(Number(secondStr));
        const timeDiff = now.diff(medTime, 'minutes');

        if (timeDiff > 60) {
            return 'green';
        } else if (timeDiff > 0) {
            return 'orange';
        } else {
            return 'red';
        }
    }
};