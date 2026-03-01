package com.luidsonl.fabricatio.service;

import com.luidsonl.fabricatio.dto.RawMaterialPackagingTransactionDTO;
import com.luidsonl.fabricatio.exception.ResourceNotFoundException;
import com.luidsonl.fabricatio.model.RawMaterialPackaging;
import com.luidsonl.fabricatio.model.RawMaterialPackagingTransaction;
import com.luidsonl.fabricatio.repository.RawMaterialPackagingRepository;
import com.luidsonl.fabricatio.repository.RawMaterialPackagingTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RawMaterialPackagingTransactionService {

    private final RawMaterialPackagingTransactionRepository transactionRepository;
    private final RawMaterialPackagingRepository packagingRepository;

    public List<RawMaterialPackagingTransactionDTO> findAll() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RawMaterialPackagingTransactionDTO> findByPackaging(Long packagingId) {
        RawMaterialPackaging packaging = packagingRepository.findById(packagingId)
                .orElseThrow(() -> new ResourceNotFoundException("Packaging not found with id: " + packagingId));
        return transactionRepository.findByPackaging(packaging).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RawMaterialPackagingTransactionDTO save(RawMaterialPackagingTransactionDTO dto) {
        RawMaterialPackaging packaging = packagingRepository.findById(dto.getPackagingId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Packaging not found with id: " + dto.getPackagingId()));

        RawMaterialPackagingTransaction transaction = new RawMaterialPackagingTransaction();
        transaction.setPackaging(packaging);
        transaction.setQuantity(dto.getQuantity());
        transaction.setType(dto.getType());
        transaction.setNote(dto.getNote());

        updateStock(packaging, transaction);

        RawMaterialPackagingTransaction saved = transactionRepository.save(transaction);
        packagingRepository.save(packaging);

        return convertToDTO(saved);
    }

    private void updateStock(RawMaterialPackaging packaging, RawMaterialPackagingTransaction transaction) {
        switch (transaction.getType()) {
            case INVENTORY_IN:
                packaging.setCurrentStock(packaging.getCurrentStock() + transaction.getQuantity());
                break;
            case INVENTORY_OUT:
                packaging.setCurrentStock(packaging.getCurrentStock() - transaction.getQuantity());
                break;
            case ADJUSTMENT:
                packaging.setCurrentStock(packaging.getCurrentStock() + transaction.getQuantity());
                break;
        }
    }

    private RawMaterialPackagingTransactionDTO convertToDTO(RawMaterialPackagingTransaction entity) {
        return RawMaterialPackagingTransactionDTO.builder()
                .id(entity.getId())
                .packagingId(entity.getPackaging().getId())
                .packagingName(entity.getPackaging().getName())
                .quantity(entity.getQuantity())
                .type(entity.getType())
                .transactionDate(entity.getTransactionDate())
                .note(entity.getNote())
                .build();
    }
}
