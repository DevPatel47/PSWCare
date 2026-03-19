import { useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function AvailabilityCalendarPage() {
  const [slots, setSlots] = useState([]);
  const [entry, setEntry] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  });

  const addSlot = () => {
    setSlots((prev) => [...prev, { ...entry, id: Date.now() }]);
  };

  return (
    <section className="space-y-6">
      <Card>
        <h1>Availability Calendar</h1>
        <p className="mt-2 text-sm text-slate-600">
          Set weekly availability slots for new booking requests.
        </p>
      </Card>

      <Card>
        <h3>Add Slot</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            className="ui-input"
            value={entry.day}
            onChange={(event) =>
              setEntry((prev) => ({ ...prev, day: event.target.value }))
            }
          >
            {weekdays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <input
            className="ui-input"
            type="time"
            value={entry.startTime}
            onChange={(event) =>
              setEntry((prev) => ({ ...prev, startTime: event.target.value }))
            }
          />
          <input
            className="ui-input"
            type="time"
            value={entry.endTime}
            onChange={(event) =>
              setEntry((prev) => ({ ...prev, endTime: event.target.value }))
            }
          />
          <Button onClick={addSlot}>Add Availability</Button>
        </div>
      </Card>

      <Card>
        <h3>Weekly View</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {weekdays.map((day) => {
            const daySlots = slots.filter((slot) => slot.day === day);
            return (
              <div key={day} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-saas-text">{day}</p>
                <div className="mt-2 space-y-1">
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-slate-500">No slots</p>
                  ) : null}
                  {daySlots.map((slot) => (
                    <p key={slot.id} className="text-xs text-slate-600">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}

export default AvailabilityCalendarPage;
