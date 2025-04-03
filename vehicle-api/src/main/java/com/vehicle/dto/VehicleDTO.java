package com.vehicle.dto;

import com.vehicle.entity.FuelType;
import com.vehicle.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;
    private String name;
    private String model;
    private String brand;
    private Integer year;
    private String color;
    private BigDecimal price;
    private Integer quantityAvailable;
    private String description;
    private String imageUrl;
    private VehicleType type;
    private FuelType fuelType;
} 