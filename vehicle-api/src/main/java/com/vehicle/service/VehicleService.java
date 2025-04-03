package com.vehicle.service;

import com.vehicle.dto.VehicleDTO;
import com.vehicle.entity.FuelType;
import com.vehicle.entity.Vehicle;
import com.vehicle.entity.VehicleType;
import com.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Page<VehicleDTO> getAllVehicles(
            String name,
            String brand,
            String model,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            VehicleType type,
            FuelType fuelType,
            Pageable pageable
    ) {
        return vehicleRepository.searchVehicles(
                name, brand, model, minPrice, maxPrice, type, fuelType, pageable
        ).map(this::mapToDTO);
    }

    public VehicleDTO getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    private VehicleDTO mapToDTO(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .name(vehicle.getName())
                .model(vehicle.getModel())
                .brand(vehicle.getBrand())
                .year(vehicle.getYear())
                .color(vehicle.getColor())
                .price(vehicle.getPrice())
                .quantityAvailable(vehicle.getQuantityAvailable())
                .description(vehicle.getDescription())
                .imageUrl(vehicle.getImageUrl())
                .type(vehicle.getType())
                .fuelType(vehicle.getFuelType())
                .build();
    }
} 