import { FaTimesCircle } from "react-icons/fa";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarModal({ isOpen, onClose, appointments }) {
  if (!isOpen) return null;

  // Convert appointments to calendar events
  const calendarEvents = appointments.map(apt => {
    // Parse time to get hours and minutes (assuming "10:00 AM" format)
    const timeStr = apt.time;
    let hours = 0;
    let minutes = 0;
    
    if (timeStr) {
      const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        hours = parseInt(timeMatch[1]);
        minutes = parseInt(timeMatch[2]);
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
      }
    }
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    
    return {
      id: apt.id.toString(),
      title: `${apt.pet_name} - ${apt.service}`,
      start: `${apt.date}T${timeString}`,
      backgroundColor: apt.status === 'approved' ? '#10b981' : apt.status === 'pending' ? '#f59e0b' : '#ef4444',
      borderColor: apt.status === 'approved' ? '#10b981' : apt.status === 'pending' ? '#f59e0b' : '#ef4444',
      extendedProps: {
        petName: apt.pet_name,
        ownerName: apt.owner_name,
        service: apt.service,
        status: apt.status,
        time: apt.time
      }
    };
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Appointments Calendar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimesCircle className="text-2xl" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            height="auto"
            eventClick={(info) => {
              const props = info.event.extendedProps;
              alert(
                `Pet: ${props.petName}\n` +
                `Service: ${props.service}\n` +
                `Owner: ${props.ownerName}\n` +
                `Time: ${props.time}\n` +
                `Status: ${props.status}`
              );
            }}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </div>
      </div>
    </div>
  );
}