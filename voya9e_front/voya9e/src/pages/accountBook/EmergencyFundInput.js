// src/pages/accountBook/EmergencyFundInput.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EmergencyFundInput() {
    const { eventId } = useParams();
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async () => {
        if (!amount || isNaN(amount)) {
            alert("유효한 숫자를 입력하세요.");
            return;
        }

        setIsSubmitting(true); // 요청 시작 시 제출 상태를 활성화

        try {
            await axios.post(`/financial-plan/${eventId}`, { itemName: "비상금", amount: parseFloat(amount) });
            alert("요청이 성공적으로 완료되었습니다.");
            window.close(); // 요청 완료 후 팝업 창 닫기
        } catch (error) {
            console.error("비상금 추가 중 오류 발생:", error);
            alert("요청 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false); // 요청 완료 후 제출 상태 해제
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>비상금 금액을 입력하세요</h2>
            <input 
                type="text" 
                value={amount} 
                onChange={handleAmountChange} 
                placeholder="금액 입력" 
                disabled={isSubmitting} 
            />
            <div style={{ marginTop: "10px" }}>
                <button onClick={handleSubmit} disabled={isSubmitting}>확인</button>
                <button onClick={() => window.close()} disabled={isSubmitting}>취소</button>
            </div>
            {isSubmitting && <p>데이터 전송 중...</p>}
        </div>
    );
}

export default EmergencyFundInput;