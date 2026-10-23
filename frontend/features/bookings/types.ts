export type BookingAttendee = {
  bookingId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type Booking = {
  id: string;
  roomId: string;
  createdById: string;
  description: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    email: string;
    name: string;
  };
  attendees: BookingAttendee[];
};
