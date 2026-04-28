import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/events`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-48 bg-black/5 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const today = new Date();
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <h1 className="text-navy font-serif text-5xl mb-8">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const eventDate = new Date(event.date);
          const isSoon = (eventDate.getTime() - today.getTime()) < 14 * 24 * 60 * 60 * 1000 && eventDate >= today;
          
          return (
            <div key={event.id} className="bg-white rounded-xl shadow-card p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  {isSoon && (
                    <span className="bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Soon
                    </span>
                  )}
                </div>
                <div className="bg-gold/10 text-gold font-medium px-2 py-1 rounded-md text-sm whitespace-nowrap">
                  +{event.points_value} pts
                </div>
              </div>
              
              <h3 className="font-serif text-2xl text-navy mb-2 group-hover:text-blue transition-colors">{event.name}</h3>
              
              <p className="text-black/70 text-sm mb-4 flex-1">{event.description}</p>
              
              <div className="border-t border-[rgba(10,46,127,0.1)] pt-4 mt-auto">
                <div className="text-sm font-medium text-cobalt mb-1">
                  {eventDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-black/50">{event.location}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
