"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { IMealInterface, IMealNutrients } from "@/models/interfaces/meal/Meal";

// Replace with your credentials
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
// Update scopes as needed. For inserting events use "https://www.googleapis.com/auth/calendar.events"
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

declare const gapi: any;
declare const google: any;

const GoogleCalendarSync: React.FC<{ meals: IMealInterface[]; mealPlanStart: string; mealPlanEnd: string; onDone?: () => void; }> = ({ meals, mealPlanStart, mealPlanEnd, onDone }) => {
    const { data: session } = useSession();
    const [gapiLoaded, setGapiLoaded] = useState(false);
    const [gisLoaded, setGisLoaded] = useState(false);
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Load gapi and gis scripts dynamically if needed
    useEffect(() => {
        const loadGapi = () => {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            script.onload = () => {
                gapi.load("client", async () => {
                    await gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: [DISCOVERY_DOC],
                    });
                    setGapiLoaded(true);
                });
            };
            document.body.appendChild(script);
        };

        const loadGis = () => {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
                const client = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: "", // callback will be set on auth click
                });
                setTokenClient(client);
                setGisLoaded(true);
            };
            document.body.appendChild(script);
        };

        if (!gapiLoaded) loadGapi();
        if (!gisLoaded) loadGis();
    }, [gapiLoaded, gisLoaded]);

    const handleAuthClick = () => {
        if (tokenClient) {
            tokenClient.callback = async (resp: any) => {
                if (resp.error) {
                    console.error(resp);
                    return;
                }
                setIsAuthorized(true);
                await insertMealEvents();
            };

            // Request one-time access prompt
            if (!gapi.client.getToken()) {
                tokenClient.requestAccessToken({ prompt: "consent" });
            } else {
                tokenClient.requestAccessToken({ prompt: "" });
            }
        }
    };

    const insertMealEvents = async () => {
        // Loop through the meal plan's meals (your meals array)
        // For each meal, create an event with title: meal.name - meal.mealTypeKey, 
        // start time: meal.timeScheduled, and a description formatted from meal.totalNutrients

        for (let meal of meals) {
            const event = {
                summary: `${meal.name} - ${meal.mealTypeKey.join(", ")}`,
                start: {
                    dateTime: meal.timeScheduled, // ensure ISO string format
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                    dateTime: new Date(new Date(meal.timeScheduled).getTime() + 60 * 60 * 1000).toISOString(), // assuming 1 hour duration
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                description: formatTotalNutrients(meal.nutrients),
            };

            try {
                const request = await gapi.client.calendar.events.insert({
                    calendarId: "primary",
                    resource: event,
                });
                console.log("Event created: ", request.result.htmlLink);
            } catch (err) {
                console.error("Error creating event", err);
            }
        }
        // Optionally call onDone callback
        if (onDone) onDone();
    };

    const formatTotalNutrients = (nutrients: IMealNutrients | undefined): string => {
        if (!nutrients) return "";
        // Format the nutrient data into a neat multiline string
        return Object.keys(nutrients)
            .map((key) => `${key}: ${nutrients[key].quantity.toFixed(1)} ${nutrients[key].unit}`)
            .join("\n");
    };

    return (
        <div className="">
            {isAuthorized ? (
                <p>Calendar synced!</p>
            ) : (
                <button
                    onClick={handleAuthClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Authorize &amp; Sync with Google Calendar
                </button>
            )}
        </div>
    );
};

export default GoogleCalendarSync;