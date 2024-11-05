import React, { useState, useEffect } from 'react';
//import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import NavBar from './components/NavBar';
import AddExpense from './pages/accountBook/AddExpense';
import ExpenseDetail from './pages/accountBook/ExpenseDetail';
import EditExpense from './pages/accountBook/EditExpense';
import AddReceiptExpense from './pages/accountBook/AddReceiptExpense';
import ExchangeRate from './pages/accountBook/ExchangeRate';
import Chat from './pages/chatBot/Chat';
import AccountBook from './pages/accountBook/AccountBook';
import GroupList from './pages/GroupList';
import CreateGroup from './pages/CreateGroup';
import GroupMembers from './pages/GroupMembers';
import InviteMember from './pages/InviteMember';
import Notification from './pages/Notification';
import CitySearch from './pages/Event/CitySearch';
import Schedular from './pages/Schedule/Schedular';
import ScheduleDetail from './pages/Schedule/ScheduleDetail';
import AutoSearchPage from './pages/Schedule/AutoCompleteSearch';
import RecommendedSearchPage from './pages/Schedule/RecommendationSearch';
import PlaceDetail from './pages/Schedule/PlaceDetail';
import Calendar from './pages/Event/Calendar';
import EventDetail from './pages/Event/EventDetail';
import { isAuthenticated } from './services/api';
import FinancialPlan from './pages/accountBook/FinancalPlan';
import AddFinancialPlan from './pages/accountBook/AddFinancalPlan';
import OtherExpenses from './pages/accountBook/OtherExpenses';
import FinancalPlanDetail from './pages/accountBook/FinancalPlanDetail';
import EmergencyFundInput from './pages/accountBook/EmergencyFundInput';
import FinancialPlanDetailByItem from './pages/accountBook/\bFinancialPlanDetailByItem';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setLoggedIn(authenticated);
    };
    checkAuth();
  }, []);

  return (
      <NotificationProvider>
        <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage setLoggedIn={setLoggedIn} />} />
          <Route path="/accountBook/:eventId" element={<AccountBook />} />
          <Route path="/accountBook/:eventId/addExpense" element={<AddExpense/>}/>
          <Route path="/expense/:eventId" element={<ExpenseDetail />} />
          <Route path="/accountBook/:eventId/edit" element={<EditExpense />} />
          <Route path="/accountBook/:eventId/receipt/add" element={<AddReceiptExpense />} />
          <Route path="/exchange-rate" element={<ExchangeRate />} />
          <Route path='/chat' element={<Chat />}/>
          <Route path="/groups" element={<GroupList />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/group/:groupId/members" element={<GroupMembers />} />
          <Route path="/invite-member/:groupId" element={<InviteMember />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/citysearch" element={<CitySearch />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/schedular/:eventId" element={<Schedular />} />
          <Route path="/scheduledetail" element={<ScheduleDetail />} />
          <Route path="/autosearch/:eventId" element={<AutoSearchPage />} />
          <Route path="/recommended/:eventId" element={<RecommendedSearchPage />} />
          <Route path="/places/:placeId" element={<PlaceDetail />} />
          <Route path="/eventdetail/:groupId" element={<EventDetail />} />
          <Route path='/financial-plan/:eventId' element={<FinancialPlan/>}/>
          <Route path="/financial-plan/:eventId/add" element={<AddFinancialPlan />} />
          <Route path="/financial-plan/:eventId/others" element={<OtherExpenses />} />
          <Route path="/financial-plan/:eventId/detail/:financialPlanId" element={<FinancalPlanDetail />} />
          <Route path="/emergency-fund-input/:eventId" element={<EmergencyFundInput />} />
          <Route path="/financial-plan/:eventId/expenses/:itemName" element={<FinancialPlanDetailByItem />} />
        </Routes>
      </NotificationProvider>
  );
};

export default App;