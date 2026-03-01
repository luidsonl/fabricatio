package com.luidsonl.fabricatio.repository;

import com.luidsonl.fabricatio.model.RawMaterialPackagingTransaction;
import com.luidsonl.fabricatio.model.RawMaterialPackaging;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RawMaterialPackagingTransactionRepository
        extends JpaRepository<RawMaterialPackagingTransaction, Long> {
    List<RawMaterialPackagingTransaction> findByPackaging(RawMaterialPackaging packaging);
}
