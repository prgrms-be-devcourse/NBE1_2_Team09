// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams, useNavigate } from 'react-router-dom';

// // function OtherExpenses() {
// //     const { groupId } = useParams();
// //     const [otherExpenses, setOtherExpenses] = useState([]);
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         fetchOtherExpenses();
// //     }, [groupId]);

// //     const fetchOtherExpenses = async () => {
// //         try {
// //             const response = await axios.get(`/accountBook/${groupId}`);
// //             const expensesData = response.data;

// //             const planResponse = await axios.get(`/financial-plan/${groupId}`);
// //             const planItems = planResponse.data.map(plan => plan.itemName);

// //             // 계획에 없는 항목들만 필터링하여 저장
// //             const others = expensesData.filter(expense => !planItems.includes(expense.itemName));
// //             setOtherExpenses(others);
// //         } catch (error) {
// //             console.error('기타 항목 데이터를 가져오는 중 오류 발생:', error);
// //         }
// //     };

// //     return (
// //         <div className="container mt-5">
// //             <div className="text-center">
// //                 <h1 className="voyage-logo">기타 항목</h1>
// //                 <button className="btn mt-3" onClick={() => navigate(-1)}>뒤로 가기</button>
// //             </div>

// //             <div className="mt-4">
// //                 {otherExpenses.length > 0 ? (
// //                     <table className="table">
// //                         <thead>
// //                             <tr>
// //                                 <th>항목</th>
// //                                 <th>금액</th>
// //                                 <th>날짜</th>
// //                                 <th>사용자</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {otherExpenses.map(expense => (
// //                                 <tr key={expense.expensesId}>
// //                                     <td>{expense.itemName}</td>
// //                                     <td>{parseFloat(expense.amount).toLocaleString()}원</td>
// //                                     <td>{new Date(expense.expensesDate).toLocaleString()}</td>
// //                                     <td>{expense.paidByUserId}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 ) : (
// //                     <p>기타 항목이 없습니다.</p>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// // export default OtherExpenses;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// function OtherExpenses() {
//     const { groupId } = useParams();
//     const [otherExpenses, setOtherExpenses] = useState([]);
//     const [emergencyFundAmount, setEmergencyFundAmount] = useState(''); // 비상금 수정할 금액
//     const [financialPlanId, setFinancialPlanId] = useState(null); // 비상금의 financialPlanId
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchOtherExpenses();
//         fetchEmergencyFund();
//     }, [groupId]);

//     // 기타 항목 데이터 가져오기
//     const fetchOtherExpenses = async () => {
//         try {
//             const response = await axios.get(`/accountBook/${groupId}`);
//             const expensesData = response.data;

//             const planResponse = await axios.get(`/financial-plan/${groupId}`);
//             const planItems = planResponse.data.map(plan => plan.itemName);

//             // 계획에 없는 항목들만 필터링하여 저장
//             const others = expensesData.filter(expense => !planItems.includes(expense.itemName));
//             setOtherExpenses(others);
//         } catch (error) {
//             console.error('기타 항목 데이터를 가져오는 중 오류 발생:', error);
//         }
//     };

//     // 비상금 데이터 가져오기
//     const fetchEmergencyFund = async () => {
//         try {
//             const response = await axios.get(`/financial-plan/${groupId}`);
//             const emergencyFund = response.data.find(plan => plan.itemName === "비상금");
//             if (emergencyFund) {
//                 setEmergencyFundAmount(emergencyFund.amount);
//                 setFinancialPlanId(emergencyFund.financialPlanId);
//             }
//         } catch (error) {
//             console.error('비상금 데이터를 가져오는 중 오류 발생:', error);
//         }
//     };

//     // 비상금 금액 수정 요청
//     const handleEmergencyFundUpdate = async () => {
//         try {
//             const requestBody = {
//                 financialPlanId: financialPlanId,
//                 itemName: "비상금",
//                 amount: parseFloat(emergencyFundAmount)
//             };

//             const response = await axios.put(`/financial-plan/${groupId}`, requestBody);
//             console.log('비상금 수정 완료:', response.data);
//             alert('비상금 금액이 수정되었습니다.');
//         } catch (error) {
//             console.error('비상금 수정 중 오류 발생:', error);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <div className="text-center">
//                 <h1 className="voyage-logo">기타 항목</h1>
//                 <button className="btn mt-3" onClick={() => navigate(-1)}>뒤로 가기</button>
//             </div>

//             {/* 비상금 수정 섹션 */}
//             <div className="mt-4">
//                 <h2>비상금 금액 수정</h2>
//                 <input
//                     type="number"
//                     value={emergencyFundAmount}
//                     onChange={(e) => setEmergencyFundAmount(e.target.value)}
//                     placeholder="비상금 금액 입력"
//                 />
//                 <button onClick={handleEmergencyFundUpdate}>수정</button>
//             </div>

//             {/* 기타 항목 테이블 */}
//             <div className="mt-4">
//                 {otherExpenses.length > 0 ? (
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>항목</th>
//                                 <th>금액</th>
//                                 <th>날짜</th>
//                                 <th>사용자</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {otherExpenses.map(expense => (
//                                 <tr key={expense.expensesId}>
//                                     <td>{expense.itemName}</td>
//                                     <td>{parseFloat(expense.amount).toLocaleString()}원</td>
//                                     <td>{new Date(expense.expensesDate).toLocaleString()}</td>
//                                     <td>{expense.paidByUserId}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p>기타 항목이 없습니다.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default OtherExpenses;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function OtherExpenses() {
    const { eventId } = useParams();
    const [otherExpenses, setOtherExpenses] = useState([]);
    const [emergencyFundAmount, setEmergencyFundAmount] = useState(''); // 비상금 금액
    const [financialPlanId, setFinancialPlanId] = useState(null); // 비상금의 financialPlanId
    const [isEditingMode, setIsEditingMode] = useState(false); // 수정 모드 상태
    const navigate = useNavigate();

    useEffect(() => {
        fetchOtherExpenses();
        fetchEmergencyFund();
    }, [eventId]);

    const fetchOtherExpenses = async () => {
        try {
            const response = await axios.get(`/accountBook/${eventId}`);
            const expensesData = response.data;

            const planResponse = await axios.get(`/financial-plan/${eventId}`);
            const planItems = planResponse.data.map(plan => plan.itemName);

            const others = expensesData.filter(expense => !planItems.includes(expense.itemName));
            setOtherExpenses(others);
        } catch (error) {
            console.error('기타 항목 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const fetchEmergencyFund = async () => {
        try {
            const response = await axios.get(`/financial-plan/${eventId}`);
            const emergencyFund = response.data.find(plan => plan.itemName === "비상금");
            if (emergencyFund) {
                setEmergencyFundAmount(emergencyFund.amount);
                setFinancialPlanId(emergencyFund.financialPlanId);
            }
        } catch (error) {
            console.error('비상금 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const handleEmergencyFundUpdate = async () => {
        try {
            const requestBody = {
                financialPlanId: financialPlanId,
                itemName: "비상금",
                amount: parseFloat(emergencyFundAmount)
            };

            const response = await axios.put(`/financial-plan/${eventId}`, requestBody);
            console.log('비상금 수정 완료:', response.data);
            alert('비상금 금액이 수정되었습니다.');
            setIsEditingMode(false); // 수정 모드 종료
        } catch (error) {
            console.error('비상금 수정 중 오류 발생:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1 className="voyage-logo">기타 항목</h1>
                <button className="btn mt-3" onClick={() => navigate(-1)}>뒤로 가기</button>
            </div>

            {/* 비상금 수정 섹션 */}
            <div className="mt-4">
                <h2>비상금 금액</h2>
                {isEditingMode ? (
                    <div>
                        <input
                            type="number"
                            value={emergencyFundAmount}
                            onChange={(e) => setEmergencyFundAmount(e.target.value)}
                            placeholder="비상금 금액 입력"
                        />
                        <button onClick={handleEmergencyFundUpdate}>저장</button>
                        <button onClick={() => setIsEditingMode(false)}>취소</button>
                    </div>
                ) : (
                    <div>
                        <p>{parseFloat(emergencyFundAmount).toLocaleString()}원</p>
                        <button onClick={() => setIsEditingMode(true)}>금액 수정</button>
                    </div>
                )}
            </div>

            {/* 기타 항목 테이블 */}
            <div className="mt-4">
                {otherExpenses.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>항목</th>
                                <th>금액</th>
                                <th>날짜</th>
                                <th>사용자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherExpenses.map(expense => (
                                <tr key={expense.expensesId}>
                                    <td>{expense.itemName}</td>
                                    <td>{parseFloat(expense.amount).toLocaleString()}원</td>
                                    <td>{new Date(expense.expensesDate).toLocaleString()}</td>
                                    <td>{expense.paidByUserId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>기타 항목이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default OtherExpenses;