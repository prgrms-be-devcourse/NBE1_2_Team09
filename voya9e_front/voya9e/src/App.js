import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

const App = () => {
  return (
    <>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/accountBook/:groupId" element={<AccountBook />} />
        <Route path="/accountBook/:groupId/addExpense" element={<AddExpense/>}/>
        <Route path="/expense/:groupId" element={<ExpenseDetail />} />
        <Route path="/accountBook/:groupId/edit" element={<EditExpense />} />
        <Route path="/accountBook/:groupId/receipt/add" element={<AddReceiptExpense />} />
        <Route path="/exchange-rate" element={<ExchangeRate />} />
        <Route path='/chat' element={<Chat />}/>
        <Route path="/groups" element={<GroupList />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/group/:groupId/members" element={<GroupMembers />} />
        <Route path="/invite-member/:groupId" element={<InviteMember />} />
        <Route path="/notifications" element={<Notification />} />
      </Routes>
    </>
  );
};

export default App;