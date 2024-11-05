// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams, useNavigate } from 'react-router-dom';

// // function FinancialPlanDetailByItem() {
// //     const { groupId, itemName } = useParams();
// //     const navigate = useNavigate();
// //     const [expenses, setExpenses] = useState([]);

// //     useEffect(() => {
// //         fetchExpensesByItemName();
// //     }, [groupId, itemName]);

// //     const fetchExpensesByItemName = async () => {
// //         try {
// //             const response = await axios.get(`/accountBook/${groupId}`);
// //             // `itemName`과 일치하는 지출 항목만 필터링
// //             const filteredExpenses = response.data.filter(expense => expense.itemName === itemName);
// //             setExpenses(filteredExpenses);
// //         } catch (error) {
// //             console.error(`${itemName} 지출 내역을 가져오는 중 오류 발생:`, error);
// //         }
// //     };

// //     return (
// //         <div className="container mt-5">
// //             <div className="text-center">
// //                 <h1 className="voyage-logo">{itemName} 내역</h1>
// //                 <button className="btn mt-3" onClick={() => navigate(-1)}>뒤로 가기</button>
// //             </div>

// //             <div className="mt-4">
// //                 {expenses.length > 0 ? (
// //                     <table className="table">
// //                         <thead>
// //                             <tr>
// //                                 <th>날짜</th>
// //                                 <th>금액</th>
// //                                 <th>사용자</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {expenses.map(expense => (
// //                                 <tr key={expense.expensesId}>
// //                                     <td>{new Date(expense.expensesDate).toLocaleString()}</td>
// //                                     <td>{parseFloat(expense.amount).toLocaleString()}원</td>
// //                                     <td>{expense.paidByUserId}</td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 ) : (
// //                     <p>{itemName} 내역이 없습니다.</p>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// // export default FinancialPlanDetailByItem;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// function FinancialPlanDetailByItem() {
//     const { groupId, itemName } = useParams();
//     const navigate = useNavigate();
//     const [expenses, setExpenses] = useState([]);
//     const [planAmount, setPlanAmount] = useState(''); // 금액
//     const [planItemName, setPlanItemName] = useState(''); // 항목 이름
//     const [isEditingMode, setIsEditingMode] = useState(false); // 수정 모드 상태
//     const queryParams = new URLSearchParams(location.search);
//     const financialPlanId = queryParams.get('financialPlanId');

//     useEffect(() => {
//         fetchExpensesByItemName();
//         fetchPlanDetails();
//     }, [groupId, itemName]);

//     // 특정 항목의 지출 내역을 가져옴
//     const fetchExpensesByItemName = async () => {
//         try {
//             const response = await axios.get(`/accountBook/${groupId}`);
//             const filteredExpenses = response.data.filter(expense => expense.itemName === itemName);
//             setExpenses(filteredExpenses);
//         } catch (error) {
//             console.error(`${itemName} 지출 내역을 가져오는 중 오류 발생:`, error);
//         }
//     };

//     // 항목의 금전 계획 세부 정보를 가져옴
//     const fetchPlanDetails = async () => {
//         try {
//             const response = await axios.get(`/financial-plan/${groupId}`);
//             const plan = response.data.find(p => p.itemName === itemName);
//             if (plan) {
//                 setPlanItemName(plan.itemName);
//                 setPlanAmount(plan.amount);
//             }
//         } catch (error) {
//             console.error('금전 계획 세부 정보를 가져오는 중 오류 발생:', error);
//         }
//     };

//     // 항목 이름과 금액 수정 함수
//     const handleUpdatePlan = async () => {
//         try {
//             const requestBody = {
//                 financialPlanId: expenses[0]?.financialPlanId, // 첫 번째 항목의 ID 사용
//                 itemName: planItemName,
//                 amount: parseFloat(planAmount)
//             };

//             const response = await axios.put(`/financial-plan/${groupId}`, requestBody);
//             console.log(`${planItemName} 항목 수정 완료:`, response.data);
//             alert('항목이 수정되었습니다.');
//             setIsEditingMode(false); // 수정 모드 종료
//             fetchPlanDetails(); // 수정 후 세부 정보 다시 불러오기
//         } catch (error) {
//             console.error('항목 수정 중 오류 발생:', error);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <div className="text-center">
//                 <h1 className="voyage-logo">{itemName} 내역</h1>
//                 <button className="btn mt-3" onClick={() => navigate(-1)}>뒤로 가기</button>
//             </div>

//             {/* 항목 이름 및 금액 표시 및 수정 섹션 */}
//             <div className="mt-4">
//                 <h2>항목 세부 정보</h2>
//                 {isEditingMode ? (
//                     <div>
//                         <label>항목 이름</label>
//                         <input
//                             type="text"
//                             value={planItemName}
//                             onChange={(e) => setPlanItemName(e.target.value)}
//                             placeholder="항목 이름 입력"
//                         />
//                         <label>금액</label>
//                         <input
//                             type="number"
//                             value={planAmount}
//                             onChange={(e) => setPlanAmount(e.target.value)}
//                             placeholder="금액 입력"
//                         />
//                         <button onClick={handleUpdatePlan}>저장</button>
//                         <button onClick={() => setIsEditingMode(false)}>취소</button>
//                     </div>
//                 ) : (
//                     <div>
//                         <p><strong>항목 이름:</strong> {planItemName}</p>
//                         <p><strong>금액:</strong> {parseFloat(planAmount).toLocaleString()}원</p>
//                         <button onClick={() => setIsEditingMode(true)}>항목 수정</button>
//                     </div>
//                 )}
//             </div>

//             {/* 지출 내역 테이블 */}
//             <div className="mt-4">
//                 {expenses.length > 0 ? (
//                     <table className="table">
//                         <thead>
//                             <tr>
//                                 <th>날짜</th>
//                                 <th>금액</th>
//                                 <th>사용자</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {expenses.map(expense => (
//                                 <tr key={expense.expensesId}>
//                                     <td>{new Date(expense.expensesDate).toLocaleString()}</td>
//                                     <td>{parseFloat(expense.amount).toLocaleString()}원</td>
//                                     <td>{expense.paidByUserId}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p>{itemName} 내역이 없습니다.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default FinancialPlanDetailByItem;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function FinancialPlanDetailByItem() {
    const { eventId, itemName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const financialPlanId = queryParams.get('financialPlanId');
    
    const [expenses, setExpenses] = useState([]);
    const [planAmount, setPlanAmount] = useState(''); // 금액
    const [planItemName, setPlanItemName] = useState(''); // 항목 이름
    const [isEditingMode, setIsEditingMode] = useState(false); // 수정 모드 상태

    useEffect(() => {
        fetchExpensesByItemName();
        fetchPlanDetails();
    }, [eventId, itemName]);

    // 특정 항목의 지출 내역을 가져옴
    const fetchExpensesByItemName = async () => {
        try {
            const response = await axios.get(`/accountBook/${eventId}`);
            const filteredExpenses = response.data.filter(expense => expense.itemName === itemName);
            setExpenses(filteredExpenses);
        } catch (error) {
            console.error(`${itemName} 지출 내역을 가져오는 중 오류 발생:`, error);
        }
    };

    // 항목의 금전 계획 세부 정보를 가져옴
    const fetchPlanDetails = async () => {
        try {
            const response = await axios.get(`/financial-plan/${eventId}`);
            const plan = response.data.find(p => p.financialPlanId === parseInt(financialPlanId));
            if (plan) {
                setPlanItemName(plan.itemName);
                setPlanAmount(plan.amount);
            }
        } catch (error) {
            console.error('금전 계획 세부 정보를 가져오는 중 오류 발생:', error);
        }
    };

    // 항목 이름과 금액 수정 함수
    const handleUpdatePlan = async () => {
        try {
            const requestBody = {
                financialPlanId: financialPlanId, // URL에서 받은 financialPlanId 사용
                itemName: planItemName,
                amount: parseFloat(planAmount)
            };

            const response = await axios.put(`/financial-plan/${eventId}`, requestBody);
            console.log(`${planItemName} 항목 수정 완료:`, response.data);
            alert('항목이 수정되었습니다.');
            setIsEditingMode(false); // 수정 모드 종료
            fetchPlanDetails(); // 수정 후 세부 정보 다시 불러오기
        } catch (error) {
            console.error('항목 수정 중 오류 발생:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1 className="voyage-logo">{itemName} 내역</h1>
                <button className="btn mt-3" onClick={() => navigate(-1)}>뒤로 가기</button>
            </div>

            {/* 항목 이름 및 금액 표시 및 수정 섹션 */}
            <div className="mt-4">
                <h2>항목 세부 정보</h2>
                {isEditingMode ? (
                    <div>
                        <label>항목 이름</label>
                        <input
                            type="text"
                            value={planItemName}
                            onChange={(e) => setPlanItemName(e.target.value)}
                            placeholder="항목 이름 입력"
                        />
                        <label>금액</label>
                        <input
                            type="number"
                            value={planAmount}
                            onChange={(e) => setPlanAmount(e.target.value)}
                            placeholder="금액 입력"
                        />
                        <button onClick={handleUpdatePlan}>저장</button>
                        <button onClick={() => setIsEditingMode(false)}>취소</button>
                    </div>
                ) : (
                    <div>
                        <p><strong>항목 이름:</strong> {planItemName}</p>
                        <p><strong>금액:</strong> {parseFloat(planAmount).toLocaleString()}원</p>
                        <button onClick={() => setIsEditingMode(true)}>항목 수정</button>
                    </div>
                )}
            </div>

            {/* 지출 내역 테이블 */}
            <div className="mt-4">
                {expenses.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>금액</th>
                                <th>사용자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.expensesId}>
                                    <td>{new Date(expense.expensesDate).toLocaleString()}</td>
                                    <td>{parseFloat(expense.amount).toLocaleString()}원</td>
                                    <td>{expense.paidByUserId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>{itemName} 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default FinancialPlanDetailByItem;