
'use client';

import { useState, useMemo } from 'react';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import type { SiteEvent } from '@/types';
import { useTranslation } from '@/hooks/use-translation';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

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
      <Card className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-4 md:border-r">
            <Calendar
              mode="single"
              selected={undefined}
              onMonthChange={setCurrentMonth}
              month={currentMonth}
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: 'bg-primary/20 text-primary-foreground rounded-full',
              }}
              className="w-full"
            />
          </div>
          <div className="p-4">
            <CardHeader className="p-2 pt-0">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Events in {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pr-0 space-y-4 max-h-64 overflow-y-auto">
              {eventsInCurrentMonth.length > 0 ? (
                eventsInCurrentMonth.map(event => (
                  <div key={event.date} className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md text-muted-foreground w-16">
                      <span className="text-sm font-bold uppercase">{format(parseISO(event.date), 'MMM')}</span>
                      <span className="text-2xl font-bold">{format(parseISO(event.date), 'dd')}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{event.name[language]}</p>
                      <p className="text-sm text-muted-foreground">{format(parseISO(event.date), 'EEEE')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">No events scheduled for this month.</p>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  );
}
