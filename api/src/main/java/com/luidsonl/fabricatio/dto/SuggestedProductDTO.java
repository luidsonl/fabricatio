package com.luidsonl.fabricatio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuggestedProductDTO {
    private Long productId;
    private String productName;
    private BigDecimal quantityToProduce;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}
