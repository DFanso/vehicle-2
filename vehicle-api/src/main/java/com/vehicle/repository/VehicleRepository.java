package com.vehicle.repository;

import com.vehicle.entity.FuelType;
import com.vehicle.entity.Vehicle;
import com.vehicle.entity.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:name IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:brand IS NULL OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:model IS NULL OR LOWER(v.model) LIKE LOWER(CONCAT('%', :model, '%'))) AND " +
           "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR v.price <= :maxPrice) AND " +
           "(:type IS NULL OR v.type = :type) AND " +
           "(:fuelType IS NULL OR v.fuelType = :fuelType)")
    Page<Vehicle> searchVehicles(
            @Param("name") String name,
            @Param("brand") String brand,
            @Param("model") String model,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("type") VehicleType type,
            @Param("fuelType") FuelType fuelType,
            Pageable pageable
    );
} 