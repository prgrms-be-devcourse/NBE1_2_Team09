package com.grepp.nbe1_2_team09.schedule.controller;

import com.grepp.nbe1_2_team09.schedule.controller.dto.SavedData;
import com.grepp.nbe1_2_team09.schedule.controller.dto.SelectedData;
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

    @MessageMapping("/deleteCell") // 클라이언트에서 /app/selectCell로 전송한 메시지 처리
    public void handleCellDeleteCell(SelectedData selectedData) {
        messagingTemplate.convertAndSend("/topic/deletedCells", selectedData);
    }

    @MessageMapping("/savedCell") // 클라이언트에서 /app/selectCell로 전송한 메시지 처리
    public void handleCellSavedCell(SavedData savedData) {
        messagingTemplate.convertAndSend("/topic/savedCells", savedData);
    }

}
