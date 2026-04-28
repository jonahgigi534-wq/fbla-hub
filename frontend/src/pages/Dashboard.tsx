import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useAuth } from '../App';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, leadRes] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard', { credentials: 'include' }),
          fetch('http://localhost:5000/api/leaderboard', { credentials: 'include' })
        ]);
        
        if (dashRes.ok && leadRes.ok) {
          setData(await dashRes.json());
          setLeaderboard(await leadRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-black/5 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-black/5 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-black/5 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-black/5 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      <header className="flex items-baseline justify-between mb-8">
        <div>
          <h1 className="text-navy font-serif text-5xl mb-2">{data?.user?.name}</h1>
          <p className="text-black/60">Welcome back to the FBLA Hub.</p>
        </div>
        <div className="text-right">
          <div className="text-navy font-serif text-6xl flex items-center justify-end gap-2">
            {data?.user?.total_points}
            <span className="text-gold text-4xl">★</span>
          </div>
          <div className="text-sm font-medium text-black/50 uppercase tracking-wide">Total Points</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6 border-t-2 border-cobalt">
          <div className="text-sm font-medium text-black/50 mb-1">Chapter Rank</div>
          <div className="text-navy font-serif text-4xl">#{data?.stats?.rank}</div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6 border-t-2 border-cobalt">
          <div className="text-sm font-medium text-black/50 mb-1">Events Attended</div>
          <div className="text-navy font-serif text-4xl">{data?.stats?.eventsAttended}</div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-6 border-t-2 border-cobalt">
          <div className="text-sm font-medium text-black/50 mb-1">Points This Month</div>
          <div className="text-navy font-serif text-4xl">+{data?.stats?.pointsThisMonth}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl text-navy mb-4">Points History</h2>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] border-b border-[rgba(10,46,127,0.1)]">
                  <th className="py-3 px-4 font-medium text-sm text-navy">Event</th>
                  <th className="py-3 px-4 font-medium text-sm text-navy">Date</th>
                  <th className="py-3 px-4 font-medium text-sm text-navy text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody>
                {data?.history?.map((h: any, i: number) => (
                  <tr key={h.id} className={`border-b border-[rgba(10,46,127,0.1)] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                    <td className="py-3 px-4 font-medium">{h.event_name}</td>
                    <td className="py-3 px-4 text-black/60 text-sm">{new Date(h.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 bg-gold/10 text-gold font-medium px-2 py-1 rounded-md text-sm">
                        +{h.points} <span className="text-xs">pts</span>
                      </span>
                    </td>
                  </tr>
                ))}
                {data?.history?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-black/50">No points history yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl text-navy mb-4">Leaderboard</h2>
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="space-y-4">
              {leaderboard.map((u: any, index: number) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold ${
                      index === 0 ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'
                    }`}>
                      {index === 0 ? <Trophy size={16} /> : index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-navy text-sm">{u.name}</div>
                    </div>
                  </div>
                  <div className="font-serif text-navy font-bold">{u.total_points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
