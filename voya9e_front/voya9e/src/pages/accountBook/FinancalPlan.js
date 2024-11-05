// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useParams, useNavigate } from 'react-router-dom';

// // function FinancialPlan() {
// //     const { groupId } = useParams();
// //     const navigate = useNavigate();
// //     const [plans, setPlans] = useState([]);
// //     const [expenses, setExpenses] = useState([]);
// //     const [totalAmount, setTotalAmount] = useState(0);
// //     const [usedAmounts, setUsedAmounts] = useState({});
// //     const [otherExpensesTotal, setOtherExpensesTotal] = useState(0);

// //     // 사용 금액 및 남은 금액 계산
// //     useEffect(() => {
// //         fetchPlans();
// //         fetchExpenses();
// //     }, []); // 컴포넌트가 처음 로드될 때

// //     useEffect(() => {
// //         calculateUsedAndRemainingAmount();
// //     }, [plans, expenses]); // plans와 expenses가 변경될 때마다 재계산

// //     const fetchPlans = async () => {
// //         try {
// //             const response = await axios.get(`/financial-plan/${groupId}`);
// //             const fetchedPlans = response.data;

// //             const emergencyFund = fetchedPlans.find(plan => plan.itemName === "비상금");

// //             if (!emergencyFund) {
// //                 openEmergencyFundPopup();  // 비상금 팝업 창 열기
// //             } else {
// //                 setPlans(fetchedPlans);
// //             }
// //         } catch (error) {
// //             console.error('금전 계획 데이터를 가져오는 중 오류 발생:', error);
// //         }
// //     };

// //     const openEmergencyFundPopup = () => {
// //         const popup = window.open(
// //             `/emergency-fund-input?groupId=${groupId}`,
// //             '비상금 설정',
// //             'width=400,height=300'
// //         );

// //         const timer = setInterval(() => {
// //             if (popup && popup.closed) {
// //                 clearInterval(timer);
// //                 fetchPlans();  // 팝업 창이 닫힌 후 계획 새로고침
// //             }
// //         }, 500);
// //     };

// //     const fetchExpenses = async () => {
// //         try {
// //             const response = await axios.get(`/accountBook/${groupId}`);
// //             setExpenses(response.data);
// //         } catch (error) {
// //             console.error('지출 내역을 가져오는 중 오류 발생:', error);
// //         }
// //     };

// //     useEffect(() => {
// //         calculateUsedAndRemainingAmount();
// //     }, [plans, expenses]);

// //     const calculateUsedAndRemainingAmount = () => {
// //         const usedAmountsTemp = {};
// //         let emergencyFundUsed = 0;
    
// //         // 모든 지출 항목을 순회하며 처리
// //         expenses.forEach((expense) => {
// //             const plan = plans.find((p) => p.itemName === expense.itemName);
// //             if (plan && plan.itemName !== "비상금") {
// //                 // 비상금 외에 지정된 계획 항목에 속하는 경우
// //                 if (!usedAmountsTemp[expense.itemName]) {
// //                     usedAmountsTemp[expense.itemName] = 0;
// //                 }
// //                 usedAmountsTemp[expense.itemName] += parseFloat(expense.amount) || 0;
// //             } else {
// //                 // 비상금 하위에 포함될 항목 (지정되지 않은 모든 항목)
// //                 emergencyFundUsed += parseFloat(expense.amount) || 0;
// //             }
// //         });
    
// //         // 비상금 사용 금액과 기타 사용 금액을 저장
// //         usedAmountsTemp["비상금"] = emergencyFundUsed;
// //         setUsedAmounts(usedAmountsTemp);
    
// //         // 총 계획 금액 계산 (비상금 포함)
// //         const emergencyFund = plans.find((plan) => plan.itemName === "비상금");
// //         const totalPlanned = (emergencyFund ? parseFloat(emergencyFund.amount) : 0)
// //                               + plans.reduce((acc, plan) => acc + (plan.itemName !== "비상금" ? parseFloat(plan.amount || 0) : 0), 0);
    
// //         // 총 사용 금액 계산 (비상금 포함)
// //         const totalUsed = Object.values(usedAmountsTemp).reduce((acc, amount) => acc + amount, 0);
    
// //         // 남은 금액 계산
// //         setTotalAmount(totalPlanned - totalUsed);
// //     };

// //     return (
// //         <div className="container mt-5">
// //             <div className="text-center">
// //                 <h1 className="voyage-logo">voyage</h1>
// //             </div>

// //             <div className="text-center mt-4">
// //                 <h2 className="remaining-amount">남은 금액: {totalAmount.toLocaleString()}원</h2>
// //             </div>

// //             <div className="d-flex justify-content-center mt-4">
// //                 <button className="btn" onClick={() => navigate(`/accountBook/${groupId}`)}>가계부 가기</button>
// //                 <button className="btn" onClick={() => navigate(`/financial-plan/${groupId}/add`)}>추가하기 +</button>
// //             </div>

// //             <div className="plan-list mt-4">
// //                 <table className="table">
// //                     <thead>
// //                         <tr>
// //                             <th>항목</th>
// //                             <th>계획</th>
// //                             <th>사용한 금액</th>
// //                             <th>남은 금액</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {plans.map((plan) => (
// //                             <tr key={plan.financialPlanId}>
// //                                 <td onClick={() => plan.itemName === "비상금" ? navigate(`/financial-plan/${groupId}/others`) : navigate(`/financial-plan/${groupId}/detail/${plan.financialPlanId}`)} style={{ color: 'blue', cursor: 'pointer' }}>
// //                                     {plan.itemName}
// //                                 </td>
// //                                 <td>{parseFloat(plan.amount).toLocaleString()}원</td>
// //                                 <td>{(usedAmounts[plan.itemName] || 0).toLocaleString()}원</td>
// //                                 <td>{(parseFloat(plan.amount) - (usedAmounts[plan.itemName] || 0)).toLocaleString()}원</td>
// //                             </tr>
// //                         ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // }

// // export default FinancialPlan;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function FinancialPlan() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [usedAmounts, setUsedAmounts] = useState({});
    const [otherExpensesTotal, setOtherExpensesTotal] = useState(0);

    // 총 합계 계산 변수들
    const [totalPlannedAmount, setTotalPlannedAmount] = useState(0);
    const [totalUsedAmount, setTotalUsedAmount] = useState(0);
    const [totalRemainingAmount, setTotalRemainingAmount] = useState(0);

    useEffect(() => {
        fetchPlans();
        fetchExpenses();
    }, []); // 컴포넌트가 처음 로드될 때

    useEffect(() => {
        calculateUsedAndRemainingAmount();
    }, [plans, expenses]); // plans와 expenses가 변경될 때마다 재계산

    const fetchPlans = async () => {
        try {
            const response = await axios.get(`/financial-plan/${eventId}`);
            const fetchedPlans = response.data;

            const emergencyFund = fetchedPlans.find(plan => plan.itemName === "비상금");

            if (!emergencyFund) {
                openEmergencyFundPopup();  // 비상금 팝업 창 열기
            } else {
                setPlans(fetchedPlans);
            }
        } catch (error) {
            console.error('금전 계획 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    const openEmergencyFundPopup = () => {
        const popup = window.open(
            `/emergency-fund-input/${eventId}`,
            '비상금 설정',
            'width=400,height=300'
        );

        const timer = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(timer);
                fetchPlans();  // 팝업 창이 닫힌 후 계획 새로고침
            }
        }, 500);
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`/accountBook/${eventId}`);
            setExpenses(response.data);
        } catch (error) {
            console.error('지출 내역을 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        calculateUsedAndRemainingAmount();
    }, [plans, expenses]);

    const calculateUsedAndRemainingAmount = () => {
        const usedAmountsTemp = {};
        let otherExpensesTotalTemp = 0;

        expenses.forEach((expense) => {
            const plan = plans.find((p) => p.itemName === expense.itemName);
            if (plan) {
                if (!usedAmountsTemp[expense.itemName]) {
                    usedAmountsTemp[expense.itemName] = 0;
                }
                usedAmountsTemp[expense.itemName] += parseFloat(expense.amount) || 0;
            } else {
                // 비상금 하위로 포함되지 않은 항목을 기타 항목으로 처리
                if (!usedAmountsTemp["비상금"]) {
                    usedAmountsTemp["비상금"] = 0;
                }
                usedAmountsTemp["비상금"] += parseFloat(expense.amount) || 0;
                otherExpensesTotalTemp += parseFloat(expense.amount) || 0;
            }
        });

        setUsedAmounts(usedAmountsTemp);
        setOtherExpensesTotal(otherExpensesTotalTemp);

        const emergencyFund = plans.find((plan) => plan.itemName === "비상금");
        const totalPlanned = (emergencyFund ? parseFloat(emergencyFund.amount) : 0) 
                              + plans.reduce((acc, plan) => acc + (plan.itemName !== "비상금" ? parseFloat(plan.amount || 0) : 0), 0);
        const totalUsed = Object.values(usedAmountsTemp).reduce((acc, amount) => acc + amount, 0);
        const remainingAmount = totalPlanned - totalUsed;

        setTotalAmount(remainingAmount);
        setTotalPlannedAmount(totalPlanned);
        setTotalUsedAmount(totalUsed);
        setTotalRemainingAmount(remainingAmount);
    };

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1 className="voyage-logo">voyage</h1>
            </div>

            <div className="text-center mt-4">
                <h2 className="remaining-amount">남은 금액: {totalAmount.toLocaleString()}원</h2>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button className="btn" onClick={() => navigate(`/accountBook/${eventId}`)}>가계부 가기</button>
                <button className="btn" onClick={() => navigate(`/financial-plan/${eventId}/add`)}>추가하기 +</button>
            </div>

            <div className="plan-list mt-4">
                <table className="table">
                    <thead>
                        <tr>
                            <th>항목</th>
                            <th>계획</th>
                            <th>사용한 금액</th>
                            <th>남은 금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map((plan) => (
                            <tr key={plan.financialPlanId}>
                                {/* <td onClick={() => plan.itemName === "비상금" ? navigate(`/financial-plan/${groupId}/others`) : navigate(`/financial-plan/${groupId}/detail/${plan.financialPlanId}`)} style={{ color: 'blue', cursor: 'pointer' }}>
                                    {plan.itemName}
                                </td> */}
                                <td
                                    onClick={() =>
                                        plan.itemName === "비상금" 
                                            ? navigate(`/financial-plan/${eventId}/others`)
                                            : navigate(`/financial-plan/${eventId}/expenses/${plan.itemName}?financialPlanId=${plan.financialPlanId}`)
                                    }
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                >
                                    {plan.itemName}
                                </td>
                                <td>{parseFloat(plan.amount).toLocaleString()}원</td>
                                <td>{(usedAmounts[plan.itemName] || 0).toLocaleString()}원</td>
                                <td>{(parseFloat(plan.amount) - (usedAmounts[plan.itemName] || 0)).toLocaleString()}원</td>
                            </tr>
                        ))}
                        {/* 총합 행 추가 */}
                        <tr style={{ fontWeight: 'bold' }}>
                            <td>총합</td>
                            <td>{totalPlannedAmount.toLocaleString()}원</td>
                            <td>{totalUsedAmount.toLocaleString()}원</td>
                            <td>{totalRemainingAmount.toLocaleString()}원</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FinancialPlan;

