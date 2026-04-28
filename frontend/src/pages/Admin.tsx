import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Award points form
  const [selectedUserId, setSelectedUserId] = useState('');
  const [eventName, setEventName] = useState('');
  const [points, setPoints] = useState('');

  // Add member form
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'student' });

  // Add event form
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', points_value: '', description: '' });

  const fetchData = async () => {
    try {
      const [uRes, eRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/events`, { credentials: 'include' })
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (eRes.ok) setEvents(await eRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAwardPoints = async (e: React.FormEvent, directUserId?: number, directPoints?: number) => {
    e.preventDefault();
    const uid = directUserId || selectedUserId;
    const pts = directPoints || points;
    const name = eventName || 'Admin Adjustment';

    if (!uid || !pts) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/points/award`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, event_name: name, points: Number(pts) }),
        credentials: 'include'
      });

      if (res.ok) {
        const u = users.find(u => u.id === Number(uid));
        showToast(`✓ Points awarded to ${u?.name}`);
        if (!directUserId) {
          setSelectedUserId('');
          setEventName('');
          setPoints('');
        }
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
        credentials: 'include'
      });
      if (res.ok) {
        showToast('✓ Member added successfully');
        setNewMember({ name: '', email: '', password: '', role: 'student' });
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to add member');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        showToast('✓ User deleted');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        showToast('✓ Event deleted');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, points_value: Number(newEvent.points_value) }),
        credentials: 'include'
      });

      if (res.ok) {
        showToast('✓ Event added successfully');
        setNewEvent({ name: '', date: '', location: '', points_value: '', description: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-navy font-serif text-3xl">Loading Admin...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-up">
      <h1 className="text-navy font-serif text-5xl mb-8">Admin Panel</h1>

      <div className="bg-white rounded-xl shadow-card p-8 mb-8">
        <h2 className="font-serif text-3xl text-navy mb-6">Award Points</h2>
        <form onSubmit={handleAwardPoints} className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-navy mb-1">Student</label>
            <select
              required
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
            >
              <option value="" disabled>Select a student</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.total_points} pts)</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-navy mb-1">Event/Reason</label>
            <input
              required
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Workshop Bonus"
              className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-navy mb-1">Points</label>
            <input
              required
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="+0"
              className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
            />
          </div>
          <button
            type="submit"
            className="bg-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cobalt transition-colors"
          >
            Award Points
          </button>
        </form>
      </div>

      <div className="h-px w-full bg-[rgba(10,46,127,0.1)] my-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif text-3xl text-navy mb-6">All Members</h2>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[rgba(10,46,127,0.1)]">
                  <th className="py-3 px-4 font-medium text-sm text-navy">Name</th>
                  <th className="py-3 px-4 font-medium text-sm text-navy">Points</th>
                  <th className="py-3 px-4 font-medium text-sm text-navy text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any, i: number) => (
                  <tr key={u.id} className={`border-b border-[rgba(10,46,127,0.1)] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-black flex items-center gap-2">
                        {u.name}
                        {u.role === 'admin' && (
                          <span className="bg-gold text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">Admin</span>
                        )}
                      </div>
                      <div className="text-xs text-black/50">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 font-serif text-lg text-navy">
                      {u.role === 'admin' ? '-' : u.total_points}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      {u.role === 'student' && (
                        <button
                          onClick={(e) => handleAwardPoints(e, u.id, 10)}
                          className="text-xs font-medium text-blue bg-blue/10 px-2 py-1.5 rounded hover:bg-blue/20 transition-colors"
                        >
                          +10 pts
                        </button>
                      )}
                      <button onClick={() => handleDeleteUser(u.id)} className="text-[#dc2626] hover:bg-[#dc2626]/10 p-1.5 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-navy mb-6">Create Account</h2>
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Name</label>
                <input required type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Email</label>
                <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Password</label>
                <input required type="password" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Role</label>
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-white">
                  <option value="student">Student Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cobalt transition-colors flex items-center justify-center gap-2 mt-2">
                <Plus size={18} /> Add Account
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="h-px w-full bg-[rgba(10,46,127,0.1)] my-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-serif text-3xl text-navy mb-6">Manage Events</h2>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[rgba(10,46,127,0.1)]">
                  <th className="py-3 px-4 font-medium text-sm text-navy">Event</th>
                  <th className="py-3 px-4 font-medium text-sm text-navy">Points</th>
                  <th className="py-3 px-4 font-medium text-sm text-navy text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev: any, i: number) => (
                  <tr key={ev.id} className={`border-b border-[rgba(10,46,127,0.1)] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-black">{ev.name}</div>
                      <div className="text-xs text-black/50">{new Date(ev.date).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4 text-gold font-medium">+{ev.points_value}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDeleteEvent(ev.id)} className="text-[#dc2626] hover:bg-[#dc2626]/10 p-1.5 rounded transition-colors inline-block">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-navy mb-6">Add Upcoming Event</h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Event Name</label>
                <input required type="text" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-navy mb-1">Date</label>
                  <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-navy mb-1">Points</label>
                  <input required type="number" value={newEvent.points_value} onChange={e => setNewEvent({...newEvent, points_value: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Location</label>
                <input required type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Description</label>
                <textarea required rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue resize-none" />
              </div>
              <button type="submit" className="w-full bg-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cobalt transition-colors flex items-center justify-center gap-2">
                <Plus size={18} /> Add Event
              </button>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-green-500 shadow-card px-6 py-4 rounded-lg animate-fade-up z-50">
          <p className="font-medium text-navy">{toast}</p>
        </div>
      )}
    </div>
  );
}
