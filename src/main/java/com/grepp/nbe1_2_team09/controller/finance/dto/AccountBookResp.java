package com.grepp.nbe1_2_team09.controller.finance.dto;

import com.grepp.nbe1_2_team09.domain.entity.Expense;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountBookResp {

    private long expensesId;
    private LocalDateTime expensesDate;
    private String itemName;
    private BigDecimal amount;
    private String paidByUserId;

    public static Expense toEntity(AccountBookResp accountBookDTO){
        Expense expense = new Expense();

        expense.setExpenseId(accountBookDTO.getExpensesId());
        expense.setExpenseDate(accountBookDTO.getExpensesDate());
        expense.setItemName(accountBookDTO.getItemName());
        expense.setAmount(accountBookDTO.getAmount());
        expense.setPaidBy(accountBookDTO.getPaidByUserId());

        return expense;
    }

    public static AccountBookResp toDTO(Expense expense) {
        return AccountBookResp.builder()
                .expensesId(expense.getExpenseId())
                .expensesDate(expense.getExpenseDate())
                .itemName(expense.getItemName())
                .amount(expense.getAmount())
                .paidByUserId(expense.getPaidBy())
                .build();
    }
}
