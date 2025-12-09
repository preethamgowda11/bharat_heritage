
'use client';

import { useState, useMemo } from 'react';
import { format, getMonth, getYear, parseISO, isToday } from 'date-fns';
import type { SiteEvent } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCalendarProps {
  events: SiteEvent[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const { language } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const eventDates = useMemo(() => events.map(e => parseISO(e.date)), [events]);

  const eventsInCurrentMonth = useMemo(() => {
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        return getMonth(eventDate) === getMonth(currentMonth) && getYear(eventDate) === getYear(currentMonth);
      })
      .sort((a, b) => parseISO(a.date).getDate() - parseISO(b.date).getDate());
  }, [events, currentMonth]);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-headline text-center mb-8">Festivals & Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={undefined}
                onMonthChange={setCurrentMonth}
                month={currentMonth}
                modifiers={{
                  event: eventDates,
                  today: new Date(),
                }}
                modifiersClassNames={{
                  event: 'bg-primary/20 text-primary-foreground font-bold',
                  today: 'bg-accent text-accent-foreground',
                }}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Events in {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {eventsInCurrentMonth.length > 0 ? (
                eventsInCurrentMonth.map(event => {
                  const eventDate = parseISO(event.date);
                  const isEventToday = isToday(eventDate);
                  return (
                    <div key={event.date} className={cn(
                      "flex items-center gap-4 p-3 rounded-lg transition-colors",
                      isEventToday ? "bg-accent/10 border-l-4 border-accent" : "hover:bg-muted/50"
                    )}>
                      <div className={cn(
                        "flex flex-col items-center justify-center rounded-md text-center w-16 h-16",
                        isEventToday ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <span className="text-sm font-bold uppercase">{format(eventDate, 'MMM')}</span>
                        <span className="text-3xl font-bold tracking-tighter">{format(eventDate, 'dd')}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground flex items-center gap-2">
                          {event.emoji && <span className="text-2xl">{event.emoji}</span>}
                          {event.name[language]}
                        </p>
                        <p className="text-sm text-muted-foreground">{format(eventDate, 'EEEE')}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-10 h-full">
                    <p className="text-lg text-muted-foreground">No events scheduled for this month.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
