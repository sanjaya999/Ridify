package com.renting.RentThis.service;

import com.renting.RentThis.entity.Booking;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;


@Service
public class IntervalSchedulingService {

    /**
     * Represents a time slot with start and end times
     */
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
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            return start.format(formatter) + " to " + end.format(formatter);
        }
    }

    /**
     * Check if a requested time slot overlaps with any existing bookings
     * @param existingBookings List of existing bookings
     * @param requestedStart Requested start time
     * @param requestedEnd Requested end time
     * @return List of overlapping time slots, empty if no overlaps
     */
    public List<TimeSlot> findOverlappingSlots(List<Booking> existingBookings,
                                               LocalDateTime requestedStart,
                                               LocalDateTime requestedEnd) {
        List<TimeSlot> overlaps = new ArrayList<>();

        for (Booking booking : existingBookings) {
            // Check if there's an overlap
            if (!(requestedEnd.isBefore(booking.getStartTime()) ||
                    requestedStart.isAfter(booking.getEndTime()))) {
                overlaps.add(new TimeSlot(booking.getStartTime(), booking.getEndTime()));
            }
        }

        return overlaps;
    }

    /**
     * Find available time slots within a requested time range
     * based on existing bookings
     * @param existingBookings List of existing bookings
     * @param requestedStart Requested start time
     * @param requestedEnd Requested end time
     * @return List of available time slots
     */
    public List<TimeSlot> findAvailableTimeSlots(List<Booking> existingBookings,
                                                 LocalDateTime requestedStart,
                                                 LocalDateTime requestedEnd) {
        // Sort bookings by start time
        List<Booking> sortedBookings = existingBookings.stream()
                .sorted((b1, b2) -> b1.getStartTime().compareTo(b2.getStartTime()))
                .toList();

        List<TimeSlot> availableSlots = new ArrayList<>();

        if (sortedBookings.isEmpty()) {
            // No bookings, entire requested time is available
            availableSlots.add(new TimeSlot(requestedStart, requestedEnd));
            return availableSlots;
        }

        // Check if there's time available before the first booking
        LocalDateTime currentTime = requestedStart;

        for (Booking booking : sortedBookings) {
            // If the booking starts after our current position, we have a free slot
            if (currentTime.isBefore(booking.getStartTime())) {
                availableSlots.add(new TimeSlot(currentTime, booking.getStartTime()));
            }

            // Move current time pointer to after this booking if needed
            if (currentTime.isBefore(booking.getEndTime())) {
                currentTime = booking.getEndTime();
            }
        }

        // Check if there's time available after the last booking
        if (currentTime.isBefore(requestedEnd)) {
            availableSlots.add(new TimeSlot(currentTime, requestedEnd));
        }

        return availableSlots;
    }

    /**
     * Format a list of time slots into a human-readable string
     * @param slots List of time slots
     * @return Formatted string of time slots
     */
    public String formatTimeSlots(List<TimeSlot> slots) {
        return slots.stream()
                .map(TimeSlot::toString)
                .collect(Collectors.joining(", "));
    }
}