import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import QuestionPage from './components/QuestionsPage';
import ResultsPage from './components/ResultsPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/questions' element={<QuestionPage />} />
        <Route path='/results' element={<ResultsPage />} />
      </Routes>
    </Router>
  )
};

export default App;