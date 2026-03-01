package com.luidsonl.fabricatio.dto;

import com.luidsonl.fabricatio.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialPackagingTransactionDTO {
    private Long id;
    private Long packagingId;
    private String packagingName;
    private Integer quantity;
    private TransactionType type;
    private LocalDateTime transactionDate;
    private String note;
}
