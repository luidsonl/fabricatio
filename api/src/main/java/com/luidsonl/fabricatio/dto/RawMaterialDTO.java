package com.luidsonl.fabricatio.dto;

import com.luidsonl.fabricatio.enums.MeasureUnitsType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawMaterialDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private MeasureUnitsType unit;
    private boolean fractionable;
}
