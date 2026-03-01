package com.luidsonl.fabricatio.repository;

import com.luidsonl.fabricatio.model.ProductRawMaterial;
import com.luidsonl.fabricatio.model.Product;
import com.luidsonl.fabricatio.model.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterial, Long> {
    List<ProductRawMaterial> findByProduct(Product product);

    List<ProductRawMaterial> findByRawMaterial(RawMaterial rawMaterial);
}
