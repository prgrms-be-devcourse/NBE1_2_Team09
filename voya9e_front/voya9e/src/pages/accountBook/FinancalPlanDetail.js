// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// function FinancalPlanDetail() {
//     const { groupId, financialPlanId } = useParams();
//     const navigate = useNavigate();
//     const [itemName, setItemName] = useState('');
//     const [amount, setAmount] = useState('');

//     useEffect(() => {
//         fetchPlansAndSetDetail();
//     }, [financialPlanId]);

//     // 전체 금전 계획 조회 후 해당 항목 필터링
//     const fetchPlansAndSetDetail = async () => {
//         try {
//             const response = await axios.get(`/financial-plan/${groupId}`);
//             const plans = response.data;

//             // financialPlanId에 해당하는 항목만 선택
//             const selectedPlan = plans.find(plan => plan.financialPlanId === parseInt(financialPlanId));

//             if (selectedPlan) {
//                 setItemName(selectedPlan.itemName);
//                 setAmount(selectedPlan.amount);
//             } else {
//                 console.error('해당 항목을 찾을 수 없습니다.');
//             }
//         } catch (error) {
//             console.error('금전 계획 데이터를 가져오는 중 오류 발생:', error);
//         }
//     };

//     // 항목 수정
//     const updatePlan = async () => {
//         try {
//             await axios.put(`/financial-plan/${groupId}`, {
//                 financialPlanId,
//                 itemName,
//                 amount,
//             });
//             alert('항목이 수정되었습니다.');
//             navigate(`/financial-plan/${groupId}`);
//         } catch (error) {
//             console.error('항목 수정 중 오류 발생:', error);
//         }
//     };

//     // 항목 삭제
//     const deletePlan = async () => {
//         try {
//             await axios.delete(`/financial-plan/${groupId}`, { data: { financialPlanId } });
//             alert('항목이 삭제되었습니다.');
//             navigate(`/financial-plan/${groupId}`);
//         } catch (error) {
//             console.error('항목 삭제 중 오류 발생:', error);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h1>항목 상세 정보</h1>
//             <div className="mt-4">
//                 <label>항목 이름</label>
//                 <input
//                     type="text"
//                     className="form-control"
//                     value={itemName}
//                     onChange={(e) => setItemName(e.target.value)}
//                 />
//             </div>
//             <div className="mt-4">
//                 <label>금액</label>
//                 <input
//                     type="number"
//                     className="form-control"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                 />
//             </div>
//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={updatePlan}>수정</button>
//                 <button className="btn btn-danger" onClick={deletePlan}>삭제</button>
//             </div>
//         </div>
//     );
// }

// export default FinancalPlanDetail;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function FinancialPlanDetail() {
    const { eventId, financialPlanId } = useParams();
    const navigate = useNavigate();
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const [isEmergencyFund, setIsEmergencyFund] = useState(false); // 비상금 여부 체크

    useEffect(() => {
        fetchPlansAndSetDetail();
    }, [financialPlanId]);

    // 전체 금전 계획 조회 후 해당 항목 필터링
    const fetchPlansAndSetDetail = async () => {
        try {
            const response = await axios.get(`/financial-plan/${eventId}`);
            const plans = response.data;

            // financialPlanId에 해당하는 항목만 선택
            const selectedPlan = plans.find(plan => plan.financialPlanId === parseInt(financialPlanId));

            if (selectedPlan) {
                setItemName(selectedPlan.itemName);
                setAmount(selectedPlan.amount);

                // 비상금인지 여부 설정
                setIsEmergencyFund(selectedPlan.itemName === "비상금");
            } else {
                console.error('해당 항목을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('금전 계획 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 항목 수정
    const updatePlan = async () => {
        try {
            await axios.put(`/financial-plan/${eventId}`, {
                financialPlanId,
                itemName,
                amount,
            });
            alert('항목이 수정되었습니다.');
            navigate(`/financial-plan/${eventId}`);
        } catch (error) {
            console.error('항목 수정 중 오류 발생:', error);
        }
    };

    // 항목 삭제
    const deletePlan = async () => {
        try {
            await axios.delete(`/financial-plan/${eventId}`, { data: { financialPlanId } });
            alert('항목이 삭제되었습니다.');
            navigate(`/financial-plan/${eventId}`);
        } catch (error) {
            console.error('항목 삭제 중 오류 발생:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>항목 상세 정보</h1>
            <div className="mt-4">
                <label>항목 이름</label>
                <input
                    type="text"
                    className="form-control"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    disabled={isEmergencyFund} // 비상금일 경우 항목 이름 수정 불가
                />
            </div>
            <div className="mt-4">
                <label>금액</label>
                <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isEmergencyFund} // 비상금일 경우 금액 수정 불가
                />
            </div>
            {isEmergencyFund ? (
                <div className="alert alert-warning mt-4">
                    비상금 항목은 수정 또는 삭제할 수 없습니다.
                </div>
            ) : (
                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-primary" onClick={updatePlan}>수정</button>
                    <button className="btn btn-danger" onClick={deletePlan}>삭제</button>
                </div>
            )}
        </div>
    );
}

export default FinancialPlanDetail;