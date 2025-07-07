export interface Appointment {
    id: string;
    date: string;
    time: string;
    doctor: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  }
  
  export interface CalendarEvent {
    title: string;
    start: string;
    end?: string;
    color?: string;
  }
  
  export interface CalendarProps {
    onConfirm: (date: string, time: string) => void;
    onCancel?: () => void;
  }