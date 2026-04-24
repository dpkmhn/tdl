package com.example.oms.dto;

import java.math.BigDecimal;

public record OrderSummaryResponse(
        int totalOrders,
        int openOrders,
        int cancelledOrders,
        int filledOrders,
        BigDecimal notionalOpenValue
) {
}
