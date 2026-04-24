package com.example.oms.dto;

import com.example.oms.model.OrderSide;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateOrderRequest(
        @NotBlank(message = "symbol is required")
        String symbol,
        @NotNull(message = "side is required")
        OrderSide side,
        @Min(value = 1, message = "quantity must be at least 1")
        int quantity,
        @NotNull(message = "price is required")
        @DecimalMin(value = "0.0001", message = "price must be positive")
        BigDecimal price
) {
}
