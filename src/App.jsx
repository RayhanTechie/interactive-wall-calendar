import React, { useState, useEffect } from 'react';
import './App.css';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const monthImages = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1514516870924-70fc0acfa5ef?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?auto=format&fit=contain&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=contain&w=1200&q=80',
];

const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatDateKey = (date) => date.toDateString();

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [generalNotes, setGeneralNotes] = useState('');
  const [rangeNotes, setRangeNotes] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const savedNotes = localStorage.getItem('calendarGeneralNotes');
    const savedRangeNotes = localStorage.getItem('calendarRangeNotes');
    if (savedNotes) setGeneralNotes(savedNotes);
    if (savedRangeNotes) setRangeNotes(JSON.parse(savedRangeNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarGeneralNotes', generalNotes);
  }, [generalNotes]);

  useEffect(() => {
    localStorage.setItem('calendarRangeNotes', JSON.stringify(rangeNotes));
  }, [rangeNotes]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    while (days.length < 42) {
      const nextIndex = days.length - (startingDayOfWeek + daysInMonth) + 1;
      days.push({
        date: new Date(year, month + 1, nextIndex),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const setCalendarDate = (year, month) => {
    setCurrentDate(new Date(year, month, 1));
    setSelectedMonth(month);
    setSelectedYear(year);
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  const navigateMonth = (direction) => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
    setCalendarDate(nextDate.getFullYear(), nextDate.getMonth());
  };

  const handleMonthChange = (event) => {
    setCalendarDate(selectedYear, Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setCalendarDate(Number(event.target.value), selectedMonth);
  };

  const handleDateClick = (date) => {
    const key = formatDateKey(date);
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(key);
      setSelectedEnd(null);
      return;
    }

    if (new Date(key) < new Date(selectedStart)) {
      setSelectedStart(key);
      return;
    }

    setSelectedEnd(key);
  };

  const getDateStatus = (date) => {
    const key = formatDateKey(date);
    if (selectedStart === key && selectedEnd === key) return 'single';
    if (selectedStart === key) return 'start';
    if (selectedEnd === key) return 'end';
    if (selectedStart && selectedEnd) {
      const dateValue = new Date(key).getTime();
      const startValue = new Date(selectedStart).getTime();
      const endValue = new Date(selectedEnd).getTime();
      if (dateValue > startValue && dateValue < endValue) return 'in-range';
    }
    return '';
  };

  const isToday = (date) => formatDateKey(date) === formatDateKey(new Date());

  const days = getDaysInMonth(currentDate);
  const selectedLabel = selectedStart
    ? `${selectedStart}${selectedEnd ? ` — ${selectedEnd}` : ''}`
    : 'No range selected';

  const activeNoteKey = selectedStart ?? null;
  const activeNote = activeNoteKey ? rangeNotes[activeNoteKey] || '' : '';

  return (
    <div className="calendar-screen">
      <section className="calendar-card">
        <div className="calendar-topper">
          <div className="calendar-ring" />
          <div className="calendar-hook" />
        </div>

        <div className="calendar-hero">
          <div
            className="hero-photo"
            style={{
              backgroundImage: `url(${monthImages[selectedMonth]})`,
            }}
          />
          <div className="hero-tag">
            <span className="hero-subtitle">Adventure-ready planning</span>
            <h1>{monthNames[selectedMonth]}</h1>
            <p>{selectedYear}</p>
          </div>
        </div>

        <div className="calendar-body">
          <aside className="notes-panel">
            <div className="notes-header">
              <h3>Notes</h3>
              <span className="notes-meta">{selectedEnd ? 'Range mode' : selectedStart ? 'Single day' : 'General'}</span>
            </div>
            <p className="notes-help">Keep your ideas, reminders, and plans ready. Tap a date to begin selecting.</p>
            <div className="notes-lines">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="line" />
              ))}
            </div>
            <textarea
              className="general-notes"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Write month notes or ideas..."
            />
            <div className="quick-info">
              <div>
                <span>{selectedStart ? selectedLabel : 'No dates chosen'}</span>
              </div>
              <button type="button" onClick={() => { setSelectedStart(null); setSelectedEnd(null); }}>
                Clear selection
              </button>
            </div>
          </aside>

          <section className="calendar-panel">
            <div className="calendar-controls">
              <button type="button" onClick={() => navigateMonth(-1)}>&lt;</button>
              <div className="calendar-picker">
                <label>
                  <span>Month</span>
                  <select value={selectedMonth} onChange={handleMonthChange}>
                    {monthNames.map((name, index) => (
                      <option key={name} value={index}>{name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Year</span>
                  <select value={selectedYear} onChange={handleYearChange}>
                    {Array.from({ length: 9 }, (_, index) => selectedYear - 4 + index).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="button" onClick={() => navigateMonth(1)}>&gt;</button>
            </div>

            <div className="date-summary">
              <div>{selectedStart ? `${selectedStart}${selectedEnd ? ` → ${selectedEnd}` : ''}` : 'Tap any date to start.'}</div>
              <div>{selectedStart && selectedEnd ? `${(new Date(selectedEnd) - new Date(selectedStart)) / (1000 * 60 * 60 * 24) + 1} days selected` : ''}</div>
            </div>

            <div className="calendar-grid">
              {weekdayNames.map((day) => (
                <div key={day} className="day-header">{day}</div>
              ))}
              {days.map((day) => {
                const status = getDateStatus(day.date);
                const isWeekend = [0, 6].includes(day.date.getDay());
                return (
                  <button
                    key={day.date.toISOString()}
                    type="button"
                    className={`day ${day.isCurrentMonth ? 'current-month' : 'dimmed'} ${status} ${isWeekend ? 'weekend' : ''} ${isToday(day.date) ? 'today' : ''}`}
                    onClick={() => handleDateClick(day.date)}
                  >
                    <span>{day.date.getDate()}</span>
                    {rangeNotes[formatDateKey(day.date)] && <span className="note-dot">•</span>}
                  </button>
                );
              })}
            </div>

            <div className="range-notes-panel">
              <h4>Selected notes</h4>
              <p className="range-note-label">
                {selectedStart ? `Notes for ${selectedLabel}` : 'Select a start date to add attached notes.'}
              </p>
              <textarea
                value={activeNote}
                onChange={(e) => {
                  if (!activeNoteKey) return;
                  setRangeNotes({ ...rangeNotes, [activeNoteKey]: e.target.value });
                }}
                placeholder={selectedStart ? 'Add a note for this date or range start...' : 'No selection yet.'}
                disabled={!selectedStart}
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default App;
