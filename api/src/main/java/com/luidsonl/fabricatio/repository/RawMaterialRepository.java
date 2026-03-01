package com.luidsonl.fabricatio.repository;

import com.luidsonl.fabricatio.model.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
    java.util.Optional<RawMaterial> findByCode(String code);
}
