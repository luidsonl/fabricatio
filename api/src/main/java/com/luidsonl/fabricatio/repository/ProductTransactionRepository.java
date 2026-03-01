package com.luidsonl.fabricatio.repository;

import com.luidsonl.fabricatio.model.ProductTransaction;
import com.luidsonl.fabricatio.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductTransactionRepository extends JpaRepository<ProductTransaction, Long> {
    List<ProductTransaction> findByProduct(Product product);
}
