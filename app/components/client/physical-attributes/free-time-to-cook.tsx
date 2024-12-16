// FreeTimeToCookComponent.tsx
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

type FreeTimeToCookProps = {
  freeTime: string;
  onChange: (time: string | null) => void;
};

const FreeTimeToCookComponent: React.FC<FreeTimeToCookProps> = ({
  freeTime,
  onChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="sm:col-span-3">
        <label
          htmlFor="freeTimeToCook"
          className="block text-sm font-medium text-gray-800"
        >
          Free Time to Cook (minutes)
        </label>

        <TimePicker
          value={freeTime ? dayjs(freeTime, "mm:ss") : null}
          onChange={(value) => onChange(value ? value.format("mm:ss") : null)}
          views={["minutes", "seconds"]}
          format="mm:ss"
          className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
        />
      </div>
    </LocalizationProvider>
  );
};

export default FreeTimeToCookComponent;
