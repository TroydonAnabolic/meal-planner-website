"use client";
import { changePassword } from "@/actions/auth-actions";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import SelectDropdown from "../../ui/inputs/select-dropdown";
import { updateLocationSettings } from "@/actions/client-actions";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment-timezone"; // Import moment-timezone
import { Session } from "next-auth";
import { IClientInterface } from "@/models/interfaces/client/client";

dayjs.extend(utc);
dayjs.extend(timezone);

type LocationSettingsProps = {
  clientData: IClientInterface; // Adjust the type according to your session object
};

const LocationSettings: React.FC<LocationSettingsProps> = ({ clientData }) => {
  const [formData, formAction, isPending] = useFormState(
    updateLocationSettings.bind(null, clientData),
    {
      errors: {},
      success: false,
    }
  );
  // Fetch available time zones
  const timeZones = moment.tz.names(); // Correct way to fetch all timezones
  // Default timezone (set from session if available, otherwise fallback)
  const defaultTz = clientData.ClientSettingsDto?.timezoneId || "UTC";
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(defaultTz);

  return (
    <div>
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Change Time Zone
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Update your timezone associated with your account
          </p>
        </div>

        <form action={formAction} className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="sm:col-span-3">
              <SelectDropdown
                label="Time Zone"
                options={timeZones} // Now correctly passing time zones
                selected={selectedTimeZone}
                onChange={setSelectedTimeZone}
                name="timezone"
                placeholder="Select your timezone"
              />
            </div>
          </div>

          {/* Show errors if any */}
          {formData?.errors && (
            <ul id="form-errors" className="text-red-700">
              {Object.keys(formData.errors).map((error) => (
                <li key={error}>{formData.errors![error]}</li>
              ))}
            </ul>
          )}
          {/* Show success message */}
          {formData?.success && (
            <div className="text-green-700">
              Time zone updated successfully!
            </div>
          )}

          <div className="mt-8 flex">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationSettings;
