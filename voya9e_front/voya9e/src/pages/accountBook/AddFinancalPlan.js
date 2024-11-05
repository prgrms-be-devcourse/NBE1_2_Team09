// src/pages/accountBook/AddFinancialPlanPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AddFinancialPlan() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [plan, setPlan] = useState({
        itemName: '',
        amount: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`/financial-plan/${eventId}`, plan);
            navigate(`/financial-plan/${eventId}`); // 성공 시 금전 계획 페이지로 돌아감
        } catch (error) {
            console.error('금전 계획 추가 중 오류 발생:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">금전 계획 추가하기</h2>
            <div className="form-group">
                <label>계획 항목</label>
                <input
                    type="text"
                    name="itemName"
                    value={plan.itemName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="계획 항목을 입력해 주세요 (e.g., 식비, 교통비)"
                />
            </div>
            <div className="form-group mt-3">
                <label>계획 금액</label>
                <input
                    type="number"
                    name="amount"
                    value={plan.amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="계획 금액을 입력해 주세요"
                />
            </div>
            <button className="btn btn-primary mt-4" onClick={handleSubmit}>
                추가하기
            </button>
        </div>
    );
}

export default AddFinancialPlan;