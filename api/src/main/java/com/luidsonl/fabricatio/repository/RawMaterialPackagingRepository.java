package com.luidsonl.fabricatio.repository;

import com.luidsonl.fabricatio.model.RawMaterialPackaging;
import com.luidsonl.fabricatio.model.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RawMaterialPackagingRepository extends JpaRepository<RawMaterialPackaging, Long> {
    List<RawMaterialPackaging> findByRawMaterial(RawMaterial rawMaterial);

    List<RawMaterialPackaging> findByRawMaterialId(Long rawMaterialId);
}
