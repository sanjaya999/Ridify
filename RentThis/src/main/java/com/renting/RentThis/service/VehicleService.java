package com.renting.RentThis.service;

import com.renting.RentThis.dto.request.VehicleRequest;
import com.renting.RentThis.dto.response.VehicleResponse;
import com.renting.RentThis.entity.Booking;
import com.renting.RentThis.entity.User;
import com.renting.RentThis.entity.Vehicle;
import com.renting.RentThis.repository.BookingRespository;
import com.renting.RentThis.repository.UserRepository;
import com.renting.RentThis.repository.VehicleRepository;
import com.renting.RentThis.util.Geo;
import com.renting.RentThis.util.IntervalSchedulingService;
import com.renting.RentThis.util.ResponseMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.AbstractMap;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private BookingRespository bookingRespository;
    @Autowired
    private IntervalSchedulingService intervalSchedulingService;


    @PreAuthorize("hasRole('admin')") //not working ??
    public VehicleResponse addVehicle(VehicleRequest request, MultipartFile photo){

        Vehicle vehicle = new Vehicle();
        vehicle.setName(request.getName());
        vehicle.setModel(request.getModel());
        vehicle.setPlate_num(request.getPlateNum());
        vehicle.setType(request.getType());
        vehicle.setPrice(request.getPrice());
        vehicle.setStatus(request.getStatus());
        String photoUrl = fileStorageService.saveFile(photo);
            vehicle.setPhotoUrl(photoUrl);

        vehicle.setLatitude(request.getLatitude());
        vehicle.setLongitude(request.getLongitude());


        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));

        vehicle.setOwner(owner);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return VehicleResponse.builder()
                .id(savedVehicle.getId())
                .name(savedVehicle.getName())
                .model(savedVehicle.getModel())
                .type(savedVehicle.getType())
                .plateNum(savedVehicle.getPlate_num())
                .price(savedVehicle.getPrice())
                .photoUrl(savedVehicle.getPhotoUrl())
                .ownerName(ResponseMapper.toUserMap(savedVehicle.getOwner()))
                .latitude(savedVehicle.getLatitude())
                .longitude(savedVehicle.getLongitude())
                .build();


    }

    public List<VehicleResponse> getAllVehicle() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        List<VehicleResponse> responseList = vehicles.stream()
                .filter(vehicle -> !vehicle.isSuspended() && vehicle.is_listed())
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .photoUrl(vehicle.getPhotoUrl())
                        .price(vehicle.getPrice())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .latitude(vehicle.getLatitude())
                        .longitude(vehicle.getLongitude())
                        .build())
                .collect(Collectors.toList());

        return responseList;
    }

    public VehicleResponse getOneVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.isSuspended() || !vehicle.is_listed()) {
            throw new EntityNotFoundException("Vehicle not found with id: " + id);
        }
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .price(vehicle.getPrice())
                .plateNum(vehicle.getPlate_num())
                .photoUrl(vehicle.getPhotoUrl())
                .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                .build();

    }



    public List<VehicleResponse> getUserVehicles(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(user.getId());

        List<VehicleResponse> responseList = vehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .price(vehicle.getPrice())
                        .photoUrl(vehicle.getPhotoUrl())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .build())
                .collect(Collectors.toList());

        return responseList;
    }

    public List<VehicleResponse> loggedInUserVehicles(){

        String currentUserEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(()-> new RuntimeException("User not found with email "+ currentUserEmail));

        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(currentUser.getId());

        List<VehicleResponse> responseList = vehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .price(vehicle.getPrice())
                        .plateNum(vehicle.getPlate_num())
                        .photoUrl(vehicle.getPhotoUrl())
                        .isSuspended(vehicle.isSuspended())
                        .is_listed(vehicle.is_listed())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .build())
                .collect(Collectors.toList());

        return responseList;

    }

    public List<VehicleResponse> seearchVehicle(String searchTerm) {
        List<Vehicle> vehicles = vehicleRepository.findByNameIgnoringSpaces(searchTerm);

        return vehicles.stream()
                .filter(vehicle -> !vehicle.isSuspended())
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .price(vehicle.getPrice())
                        .photoUrl(vehicle.getPhotoUrl())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> getNearestVehicles(double userLat, double userLon) {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        System.out.println("=== DEBUGGING ===");
        System.out.println("User coords: " + userLat + ", " + userLon);
        System.out.println("Total vehicles: " + vehicles.size());

        // Check each vehicle without any filtering
        vehicles.forEach(v -> {
            double distance = Geo.haversine(userLat, userLon, v.getLatitude(), v.getLongitude());
            System.out.println("Vehicle: " + v.getName() +
                    " | DB coords: (" + v.getLatitude() + ", " + v.getLongitude() + ")" +
                    " | Distance: " + distance + " km" +
                    " | Zero coords: " + (v.getLatitude() == 0.0 && v.getLongitude() == 0.0));
        });

        return vehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .price(vehicle.getPrice())
                        .photoUrl(vehicle.getPhotoUrl())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .build())
                .collect(Collectors.toList());
    }

    @PreAuthorize("@userSecurity.isVehicleOwner(#vehicleId)")
    public VehicleResponse unList(Long vehicleId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        vehicle.set_listed(false);
        vehicleRepository.save(vehicle);

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .is_listed(vehicle.is_listed())
                .build();
    }


    @PreAuthorize("@userSecurity.isVehicleOwner(#vehicleId)")
    public VehicleResponse listVehicle(Long vehicleId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        vehicle.set_listed(true);
        vehicleRepository.save(vehicle);

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .plateNum(vehicle.getPlate_num())
                .price(vehicle.getPrice())
                .photoUrl(vehicle.getPhotoUrl())
                .isSuspended(vehicle.isSuspended())
                .is_listed(vehicle.is_listed())
                .build();
    }

    public List<VehicleResponse> getAvailableVehicles(double userLat, double userLon,
                                                      LocalDateTime requestedStart,
                                                      LocalDateTime requestedEnd) {

        List<Vehicle> allVehicles = vehicleRepository.findAll();

        List<Vehicle> activeVehicles = allVehicles.stream()
                .filter(v -> !v.isSuspended() && v.is_listed())
                .collect(Collectors.toList());

        // Get nearby vehicles
        List<Vehicle> nearbyVehicles = activeVehicles.stream()
                .filter(v -> !(v.getLatitude() == 0.0 && v.getLongitude() == 0.0))
                .map(vehicle -> {
                    double distance = Geo.haversine(userLat, userLon, vehicle.getLatitude(), vehicle.getLongitude());
                    return new AbstractMap.SimpleEntry<>(vehicle, distance);
                })
                .filter(entry -> entry.getValue() <= 10.0)
                .sorted(Comparator.comparingDouble(AbstractMap.SimpleEntry::getValue))
                .map(AbstractMap.SimpleEntry::getKey)
                .collect(Collectors.toList());


        List<Vehicle> availableVehicles = nearbyVehicles.stream()
                .filter(vehicle -> isVehicleAvailable(vehicle.getId(), requestedStart, requestedEnd))
                .collect(Collectors.toList());

        return availableVehicles.stream()
                .map(vehicle -> VehicleResponse.builder()
                        .id(vehicle.getId())
                        .name(vehicle.getName())
                        .model(vehicle.getModel())
                        .type(vehicle.getType())
                        .plateNum(vehicle.getPlate_num())
                        .price(vehicle.getPrice())
                        .photoUrl(vehicle.getPhotoUrl())
                        .ownerName(ResponseMapper.toUserMap(vehicle.getOwner()))
                        .latitude(vehicle.getLatitude())
                        .longitude(vehicle.getLongitude())
                        .isSuspended(vehicle.isSuspended())
                        .is_listed(vehicle.is_listed())
                        .build())
                .collect(Collectors.toList());
    }

    private boolean isVehicleAvailable(Long vehicleId, LocalDateTime requestedStart, LocalDateTime requestedEnd) {
        List<Booking> existingBookings = bookingRespository.findByVehicleId(vehicleId);

        List<IntervalSchedulingService.TimeSlot> overlappingSlots =
                intervalSchedulingService.findOverlappingSlots(existingBookings, requestedStart, requestedEnd);

        return overlappingSlots.isEmpty();
    }

}
