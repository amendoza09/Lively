import React, { useEffect, useState } from 'react';

const EventPage = () => {
  const [eventsByCity, setEventsByCity] = useState({});
  const [approvedByCity, setApprovedByCity] = useState({});
  const [rejectedByCity, setRejectedByCity] = useState({});
  const [activeTab, setActiveTab] = useState("pending");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  const openEditModal = (event) => {
    setIsEditing(true);
    setEditedEvent({...event});
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchPendingEvents();
    fetchApprovedEvents();
    fetchRejectedEvents();
  }, []);

  const handleEditSubmit = async (editedEvent) => {
    const city = editedEvent.city;
    try {
      await fetch(`http://192.168.1.17:5500/edit-event/${city}/${editedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEvent),
      });
      fetchPendingEvents();
      fetchApprovedEvents();
      fetchRejectedEvents();
    } catch (e) {
      console.error("Error editing event:", e);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch("http://192.168.1.17:5500/pending-events");
      const data = await response.json();
      setEventsByCity(data); 
    } catch (error) {
      console.error("Error fetching pending events:", error);
    }   
  };

  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch("http://192.168.1.17:5500/approved-events");
      const data = await response.json();
      setApprovedByCity(data);
    } catch (error) {
      console.error("Error fetching approved events:", error);
    }
  };

  const fetchRejectedEvents = async () => {
    try {
      const response = await fetch("http://192.168.1.17:5500/rejected-events");
      const data = await response.json();
      setRejectedByCity(data);
    } catch (error) {
      console.error("Error fetching rejected events:", error);
    }
  };
  
  const approveEvent = async (event) => {
    const city = event.city;
    try{
      await fetch(`http://192.168.1.17:5500/event-data/${city}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({event})
      });
      fetchPendingEvents();
      fetchApprovedEvents();
    } catch(e) {
      console.error("Error approving event:", e);
    };
  };

  const rejectEvent = async (event) => {
    const city = event.city;
    try{
      await fetch(`http://192.168.1.17:5500/rejected-events/${city}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({event})
        }
      )
      fetchPendingEvents();
      fetchRejectedEvents();
    } catch(e) {
      console.error("Error rejecting event:", e);
    };
  };

  const formatDate = new Intl.DateTimeFormat("en-us", {
    weekday: "short",
    month: "short",
    day: "2-digit"
  });

  const EventRow =({ event, approveEvent, rejectEvent }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <>
        <tr key={event._id}>
          <td className="border p-2">{event.title}</td>
          <td className="border p-2">{new Date(event.date).toLocaleDateString()} {event.time}</td>
          <td className="border p-2">
            <button className="bg-green-500 text-white px-2 py-1 mr-2" onClick={() => approveEvent(event)}>
              Approve
            </button>
            <button className="bg-red-500 text-white px-2 py-1 mr-2" onClick={() => rejectEvent(event)}>
              Reject
            </button>
            <button className="bg-gray-500 text-white px-2 py-1" 
              onClick={(e) => { e.stopPropagation();
              setExpanded(!expanded)}}
            >
              {expanded ? "Hide" : " View Details"}
            </button>
          </td>                      
        </tr>

        {expanded && (
          <tr>
            <td colSpan={3} className="border p-4 bg-gray-100">
              <div>
                <p><span className="font-bold">Created at:</span> {formatDate.format(new Date(event.createdAt))}</p>
                <p><span className="font-bold">Type:</span> {event.type}</p>
                <p><span className="font-bold">Location:</span> {event.location}</p>
                <p><span className="font-bold">Description:</span> {event.description}</p>
                <p><span className="font-bold">External Link:</span> {event.link}</p>
                <p><span className="font-bold">Email:</span> {event.email}</p>
                <p><span className="font-bold">Phone:</span> {event.phone}</p>
                <p><span className="font-bold">Restrictions:</span> {event.restrictions}</p>
                {event.imgUrl && (
                  <img 
                    src={event.imgUrl}
                    alt="Event"
                    className="mt-2 max-w-xs"
                  />
                )}
                <button 
                  className="bg-blue-500 text-white px-2 py-1 mt-2"
                  onClick={() => openEditModal(event)}
                >
                  Edit
                </button>
                {isEditing && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center ">
                    <div className="bg-white p-6 rounded-lg w-1/2 h-85 overflow-y-auto items-center">
                      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
                      <div>
                        <label className="block mb-2">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={editedEvent.title}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Date</label>
                        <input
                          type="text"
                          name="date"
                          value={editedEvent.date}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Time</label>
                        <input
                          type="text"
                          name="time"
                          value={editedEvent.time}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={editedEvent.location}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Description</label>
                        <textarea
                          name="description"
                          value={editedEvent.description}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">External Link</label>
                        <input
                          type="text"
                          name="link"
                          value={editedEvent.link}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={editedEvent.phone}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Email</label>
                        <input
                          type="text"
                          name="email"
                          value={editedEvent.email}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <label className="block mb-2">Restrictions</label>
                        <input
                          type="text"
                          name="restrictions"
                          value={editedEvent.restrictions}
                          onChange={handleEditChange}
                          className="border p-2 w-full mb-4"
                        />
                        <div className="flex justify-end mt-4">
                          <button
                            className="bg-green-500 text-white px-4 py-2 mr-2"
                            onClick={() => handleEditSubmit(editedEvent)}
                          >
                            Save Changes
                          </button>
                          <button
                            className="bg-gray-500 text-white px-4 py-2"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            className={`px-4 py-2 ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Events ({Object.values(eventsByCity).reduce((acc, events) => acc + events.length, 0)})
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === "approved" ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Events ({Object.values(approvedByCity).reduce((acc, events) => acc + events.length, 0)})
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === "rejected" ? "bg-red-500 text-white" : "bg-gray-300"}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected Events ({Object.values(rejectedByCity).reduce((acc, events) => acc + events.length, 0)})
          </button>
        </div>
      </div>

      {activeTab === "pending" && (
        <>
          {Object.keys(eventsByCity).map((city) => (
            <div key={city} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">{city} ({eventsByCity[city].length} events)</summary>
                <table className="w-full border-collapse border border-gray-400 mt-2">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Event Name</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsByCity[city].map((event) => (
                      <EventRow 
                        key={event}
                        event={event}
                        approveEvent = {approveEvent}
                        rejectEvent = {rejectEvent}
                      />
                    ))}
                  </tbody>
                </table>
              </details>
            </div>
          ))}
        </>
      )}

      {/* Approved Events Tab */}
      {activeTab === "approved" && (
        <>
          {Object.keys(approvedByCity).map((city) => (
            <div key={city} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">{city} ({approvedByCity[city].length} approved)</summary>
                <ul className="list-disc pl-5">
                  {approvedByCity[city].map((event) => (
                    <li key={event._id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </>
      )}

      {/* Rejected Events tab */}
      {activeTab === "rejected" && (
        <>
          {Object.keys(rejectedByCity).map((city) => (
            <div key={city} className="mb-4">
              <details className="border rounded-md p-2">
                <summary className="cursor-pointer font-bold">{city} ({rejectedByCity[city].length} rejected)</summary>
                <ul className="list-disc pl-5">
                  {rejectedByCity[city].map((event) => (
                    <li key={event._id}>{event.title} - {new Date(event.date).toLocaleDateString()}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default EventPage;