package com.luidsonl.fabricatio.enums;

import lombok.Getter;

@Getter
public enum MeasureUnitsType {
    
    MILLIGRAM("mg"),
    GRAM("g"),
    KILOGRAM("kg"),
    TON("t"),

    MILLILITER("ml"),
    LITER("l"),

    UNIT("un"),
    PIECE("pc"),
    BOX("bx"),
    PACK("pk"),
    DOZEN("dz");

    private final String symbol;

    MeasureUnitsType(String symbol) {
        this.symbol = symbol;
    }
}