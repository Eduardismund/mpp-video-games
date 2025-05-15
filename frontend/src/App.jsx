import SidePanel from "./SidePanel.jsx";
import HomePage from "./HomePage.jsx";
import Header from "./Header.jsx";
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import AddVideoGamePage from "./AddVideoGamePage.jsx";
import ListVideoGamesPage from "./ListVideoGamesPage.jsx";
import UpdateVideoGamePage from "./UpdateVideoGamePage.jsx";
import DeleteVideoGamePage from "./DeleteVideoGamePage.jsx";
import {SearchVideoGameForUpdatePage} from "./SearchVideoGameForUpdatePage.jsx";
import {SearchVideoGameForDeletePage} from "./SearchVideoGameForDeletePage.jsx";
import {ToastProvider} from "./ToastContext.jsx";
import VideoGameStatisticsChart from "./VideoGameStatisticsChart.jsx";
import React from "react";
import LoginPage from "./LoginPage.jsx";
import UserMonitorPage from "./UserMonitorPage.jsx";
import ActiveUserSessionsPage from "./ActiveUserSessionsPage.jsx";


function App() {

  return (
    <>
      <Router>
        <Header/>
        <SidePanel/>
        <div className="charts">
          <VideoGameStatisticsChart/>
        </div>
        <div className="scene">
          <div className="scene-container">
            <ToastProvider>
              <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/monitor-users" element={<UserMonitorPage/>}/>
                <Route path="/active-user-sessions" element={<ActiveUserSessionsPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/add-video-game" element={<AddVideoGamePage/>}/>
                <Route path="/update-video-game" element={<SearchVideoGameForUpdatePage/>}/>
                <Route path="/update-video-game/:id" element={<UpdateVideoGamePage/>}/>
                <Route path="/delete-video-game/:id" element={<DeleteVideoGamePage/>}/>
                <Route path="/delete-video-game" element={<SearchVideoGameForDeletePage/>}/>
                <Route path="/list-video-games" element={<ListVideoGamesPage/>}/>
                <Route path="/list-video-games/:page" element={<ListVideoGamesPage/>}/>
              </Routes>
            </ToastProvider>
          </div>
        </div>
      </Router>
    </>
  )
}

export default App
