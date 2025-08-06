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
            // --- CORRECTED Condition ---
            // Overlap exists if request starts BEFORE booking ends
            // AND request ends AFTER booking starts.
            if (requestedStart.isBefore(booking.getEndTime()) &&
                    requestedEnd.isAfter(booking.getStartTime())) {
                // Add the existing booking's timeslot to indicate what is conflicting
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
        // Sort bookings by start time
        List<Booking> sortedBookings = existingBookings.stream()
                .sorted((b1, b2) -> b1.getStartTime().compareTo(b2.getStartTime()))
                .toList(); // Or .collect(Collectors.toList()) if using older Java

        List<TimeSlot> availableSlots = new ArrayList<>();

        if (sortedBookings.isEmpty()) {
            // No bookings, check if the entire requested time meets the minimum duration
            if (Duration.between(requestedStart, requestedEnd).toMinutes() >= 30) {
                availableSlots.add(new TimeSlot(requestedStart, requestedEnd));
            }
            return availableSlots;
        }

        LocalDateTime currentTime = requestedStart;

        for (Booking booking : sortedBookings) {
            if (currentTime.isBefore(booking.getStartTime())) {
                // Potential slot found, add it for now (will be filtered later)
                availableSlots.add(new TimeSlot(currentTime, booking.getStartTime()));
            }
            if (currentTime.isBefore(booking.getEndTime())) {
                currentTime = booking.getEndTime();
            }
        }

        if (currentTime.isBefore(requestedEnd)) {
            // Potential slot found, add it for now (will be filtered later)
            availableSlots.add(new TimeSlot(currentTime, requestedEnd));
        }

        // Define the minimum duration required
        final long MINIMUM_DURATION_MINUTES = 30;

        // Filter the generated slots
        return availableSlots.stream()
                // 1. Ensure start is strictly before end (prevents zero-length slots)
                .filter(slot -> slot.getStart().isBefore(slot.getEnd()))
                // 2. Ensure the duration is at least the minimum required minutes
                .filter(slot -> Duration.between(slot.getStart(), slot.getEnd())
                        .toMinutes() >= MINIMUM_DURATION_MINUTES)
                .collect(Collectors.toList());
    }

    // formatTimeSlots remains the same...
    public String formatTimeSlots(List<TimeSlot> slots) {
        return slots.stream()
                .map(TimeSlot::toString)
                .collect(Collectors.joining(", "));
    }
}