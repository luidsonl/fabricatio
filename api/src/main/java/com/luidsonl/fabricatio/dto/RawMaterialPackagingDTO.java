package com.luidsonl.fabricatio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawMaterialPackagingDTO {
    private Long id;
    private String name;
    private Long rawMaterialId;
    private BigDecimal quantityInside;
    private Integer currentStock;
}
