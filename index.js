const { google } = require("googleapis");
const express = require("express");
require("dotenv").config();

const cors = require("cors");

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: SCOPES,
});

const app = express();
app.use(cors());

const port = 3005;

app.get("/getCalendarEvents", async (req, res) => {
  const getEvents = async (dateTimeStart, dateTimeEnd) => {
    try {
      const response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        timeMin: dateTimeStart,
        timeMax: dateTimeEnd,
      });

      const items = response.data.items;
      return items;
    } catch (error) {
      console.log(`Error at getEvents --> ${error}`);
      console.log(error.response.data);
      return [];
    }
  };

  const start = "2022-01-01T00:00:00.000Z";
  const end = "2025-06-25T00:00:00.000Z";

  try {
    const events = await getEvents(start, end);
    console.log("getAllEvents", events);
    res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

// const dateTimeForCalendar = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   let month = date.getMonth() + 1;
//   if (month < 10) {
//     month = `0${month}`;
//   }
//   let day = date.getDate();
//   if (day < 10) {
//     day = `0${day}`;
//   }
//   let hour = date.getHours();
//   if (hour < 10) {
//     hour = `0${hour}`;
//   }
//   let minute = date.getMinutes();
//   if (minute < 10) {
//     minute = `0${minute}`;
//   }

//   const newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
//   const event = new Date(newDateTime);

//   const startDate = event;
//   const endDate = new Date(
//     new Date(startDate).setHours(startDate.getHours() + 1)
//   );

//   return {
//     start: startDate.toISOString(),
//     end: endDate.toISOString(),
//   };
// };

// const insertEvent = async (event) => {
//   try {
//     const response = await calendar.events.insert({
//       auth: auth,
//       calendarId: calendarId,
//       resource: event,
//     });
//     if (response.status === 200 && response.statusText === "OK") {
//       return "Event Inserted successfully";
//     } else {
//       return "Failed to insert event";
//     }
//   } catch (error) {
//     console.log(`Error at insertEvent --> ${error}`);
//   }
// };

// const dateTime = dateTimeForCalendar();

// const newEvent = {
//   summary: "This is the tester server.",
//   description: "This is the description.",
//   start: {
//     dateTime: "2023-08-08T11:03:00.000Z",

//     // dateTime: dateTime.start,
//     timeZone: "Asia/Kolkata",
//   },
//   end: {
//     dateTime: "2023-08-08T12:03:00.000Z",

//     // dateTime: dateTime.end,
//     timeZone: "Asia/Kolkata",
//   },
// };

// console.log("newEvent", newEvent);

// const insertNewEvent = async (event) => {
//   try {
//     const res = await insertEvent(event);
//     console.log(res);
//   } catch (error) {
//     console.log(error);
//   }
// };

// insertNewEvent(newEvent);
