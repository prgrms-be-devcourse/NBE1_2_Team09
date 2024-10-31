package com.grepp.nbe1_2_team09.schedule.controller;

import com.grepp.nbe1_2_team09.schedule.controller.dto.DeletedData;
import com.grepp.nbe1_2_team09.schedule.controller.dto.SavedData;
import com.grepp.nbe1_2_team09.schedule.controller.dto.SelectedData;
import com.grepp.nbe1_2_team09.schedule.controller.dto.UpdatedData;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ScheduleController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/selectCell") // 클라이언트에서 /app/selectCell로 전송한 메시지 처리
    public void handleCellSelection(SelectedData selectedData) {

        messagingTemplate.convertAndSend("/topic/selectedCells", selectedData);
    }

    @MessageMapping("/deleteCell")
    public void handleCellDeleteCell(SelectedData selectedData) {
        messagingTemplate.convertAndSend("/topic/deletedCells", selectedData);
    }

    @MessageMapping("/deletedCell")
    public void handleCellDeleteCellId(DeletedData deletedData) {
        Long pinId = deletedData.pinId();
        messagingTemplate.convertAndSend("/topic/deletedCellsId", pinId);
    }
    @MessageMapping("/updatedCell")
    public void handleCellUpdateCell(UpdatedData updatedData) {
        messagingTemplate.convertAndSend("/topic/updatedCells", updatedData);
    }

    @MessageMapping("/savedCell")
    public void handleCellSavedCell(SavedData savedData) {
        messagingTemplate.convertAndSend("/topic/savedCells", savedData);
    }


}
