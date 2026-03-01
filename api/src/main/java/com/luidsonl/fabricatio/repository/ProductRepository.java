package com.luidsonl.fabricatio.repository;

import com.luidsonl.fabricatio.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCurrentStockGreaterThan(java.math.BigDecimal stock);

    java.util.Optional<Product> findByCode(String code);
}
