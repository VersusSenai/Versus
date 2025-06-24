// src/pages/Tournaments.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import ProfessionalBracket from '../components/Bracket';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formatDate = (iso) => new Date(iso).toLocaleString();

const Tag = ({ children }) => (
  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-3 py-1 rounded-full select-none">
    {children}
  </span>
);

export default function Tournaments() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInscriptions, setUserInscriptions] = useState({});
  const [eventMatchesMap, setEventMatchesMap] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [eventsResponse, inscriptionsResponse] = await Promise.all([
        api.get('/event'),
        api.get('/event/inscriptions/me'),
      ]);
      setEvents(eventsResponse.data);

      const userEventIds = new Set(inscriptionsResponse.data.map((i) => i.event.id));
      const inscriptionsMap = {};
      const matchesMap = {};

      for (const event of eventsResponse.data) {
        inscriptionsMap[event.id] = userEventIds.has(event.id);

        try {
          const matchResponse = await api.get(`/event/${event.id}/match`);
          matchesMap[event.id] = matchResponse.data.length > 0;
        } catch {
          matchesMap[event.id] = false;
        }
      }

      setUserInscriptions(inscriptionsMap);
      setEventMatchesMap(matchesMap);
    } catch (err) {
      alert('Failed to fetch events or inscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubscribe = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/inscribe`);
      alert('Subscribed successfully!');
      await fetchEvents();
      setDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Subscription failed');
    }
  };

  const handleUnsubscribe = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/unsubscribe`, {});
      alert('Unsubscribed successfully!');
      await fetchEvents();
      setDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Unsubscribe failed');
    }
  };

  const handleStartEvent = async (eventId) => {
    try {
      await api.post(`/event/${eventId}/start`);
      alert('Event started!');
      await fetchEvents();
      setDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Available Tournaments</h2>

      {loading ? (
        <p>Loading tournaments...</p>
      ) : events.length === 0 ? (
        <p>No tournaments found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const isInscribed = userInscriptions[event.id];
            const hasMatches = eventMatchesMap[event.id];

            return (
              <Dialog
                key={event.id}
                open={selectedEvent?.id === event.id && dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (open) setSelectedEvent(event);
                  else setSelectedEvent(null);
                }}
              >
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {event.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>Status:</strong>{' '}
                        {isInscribed ? (
                          <span className="text-green-600 font-semibold">Subscribed</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Not Subscribed</span>
                        )}
                      </p>
                      {hasMatches && (
                        <p className="mt-1 text-sm text-gray-500">Bracket available</p>
                      )}
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent
                  className="p-6"
                  style={{
                    width: 'fit-content',
                    maxWidth: '75vw',
                    maxHeight: '95vh',
                    overflow: 'visible',
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>{event.name}</DialogTitle>
                    <DialogDescription className="mb-4 block">
                      {event.description || 'No description available.'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag>Mode: {event.multiplayer ? 'Multiplayer' : 'Singleplayer'}</Tag>
                    <Tag>Start: {formatDate(event.startDate)}</Tag>
                    <Tag>End: {formatDate(event.endDate)}</Tag>
                    <Tag>Max Players: {event.maxPlayers}</Tag>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {isInscribed ? (
                      <Button variant="destructive" onClick={() => handleUnsubscribe(event.id)}>
                        Leave Event
                      </Button>
                    ) : (
                      <Button onClick={() => handleSubscribe(event.id)}>Join Event</Button>
                    )}

                    <Button variant="secondary" onClick={() => handleStartEvent(event.id)}>
                      Start Event
                    </Button>
                  </div>

                  {hasMatches ? (
                    <div
                      className="border rounded p-4 bg-white"
                      style={{ overflow: 'visible', minWidth: 1200 }}
                    >
                      <ProfessionalBracket eventId={event.id} multiplayer={event.multiplayer} />
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No bracket available yet.</p>
                  )}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
}
