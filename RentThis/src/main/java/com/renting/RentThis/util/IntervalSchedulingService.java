package com.renting.RentThis.util;

import com.renting.RentThis.entity.Booking;
import org.springframework.stereotype.Service;

import java.time.Duration; // <-- Import Duration
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class IntervalSchedulingService {

    public static class TimeSlot {
        private final LocalDateTime start;
        private final LocalDateTime end;


        public TimeSlot(LocalDateTime start, LocalDateTime end) {
            this.start = start;
            this.end = end;
        }

        public LocalDateTime getStart() {
            return start;
        }

        public LocalDateTime getEnd() {
            return end;
        }

        @Override
        public String toString() {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return start.format(formatter) + " to " + end.format(formatter);
        }
    }

    public List<TimeSlot> findOverlappingSlots(List<Booking> existingBookings,
                                               LocalDateTime requestedStart,
                                               LocalDateTime requestedEnd) {
        List<TimeSlot> overlaps = new ArrayList<>();
        for (Booking booking : existingBookings) {

            if (requestedStart.isBefore(booking.getEndTime()) &&
                    requestedEnd.isAfter(booking.getStartTime())) {
                overlaps.add(new TimeSlot(booking.getStartTime(), booking.getEndTime()));
            }
        }
        return overlaps;
    }



    /**
     * Find available time slots within a requested time range
     * based on existing bookings, ensuring a minimum duration.
     * @param existingBookings List of existing bookings
     * @param requestedStart Requested start time
     * @param requestedEnd Requested end time
     * @return List of available time slots (at least 30 minutes long)
     */
    public List<TimeSlot> findAvailableTimeSlots(List<Booking> existingBookings,
                                                 LocalDateTime requestedStart,
                                                 LocalDateTime requestedEnd) {
        List<Booking> sortedBookings = existingBookings.stream()
                .sorted((b1, b2) -> b1.getStartTime().compareTo(b2.getStartTime()))
                .toList();

        List<TimeSlot> availableSlots = new ArrayList<>();

        if (sortedBookings.isEmpty()) {
            if (Duration.between(requestedStart, requestedEnd).toMinutes() >= 30) {
                availableSlots.add(new TimeSlot(requestedStart, requestedEnd));
            }
            return availableSlots;
        }

        LocalDateTime currentTime = requestedStart;

        for (Booking booking : sortedBookings) {
            if (currentTime.isBefore(booking.getStartTime())) {
                availableSlots.add(new TimeSlot(currentTime, booking.getStartTime()));
            }
            if (currentTime.isBefore(booking.getEndTime())) {
                currentTime = booking.getEndTime();
            }
        }

        if (currentTime.isBefore(requestedEnd)) {
            availableSlots.add(new TimeSlot(currentTime, requestedEnd));
        }

        final long MINIMUM_DURATION_MINUTES = 30;

        return availableSlots.stream()
                .filter(slot -> slot.getStart().isBefore(slot.getEnd()))
                .filter(slot -> Duration.between(slot.getStart(), slot.getEnd())
                        .toMinutes() >= MINIMUM_DURATION_MINUTES)
                .collect(Collectors.toList());
    }

    public String formatTimeSlots(List<TimeSlot> slots) {
        return slots.stream()
                .map(TimeSlot::toString)
                .collect(Collectors.joining(", "));
    }
}