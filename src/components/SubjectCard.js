import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubjectCard = ({subject, year, isTestDone, correctAnswers, totalQuestions, onRestartTest, onRecommendation}) => {
    localStorage.setItem('exam', "ENEM");
    localStorage.setItem('year', year);
    localStorage.setItem('subject', subject);
    const navigate = useNavigate();

    return (
        <div className='subject-card'>
            <div className='subject-header'>{subject}</div>

            <div className='subject-main-container'>
                <div className='subject-results-info'>
                    <p>{isTestDone ? "Parabéns por completar essa prova!" : "Você ainda não fez essa prova!"}</p>
                    <p className='subject-results-number'>{correctAnswers}/{totalQuestions}</p>
                </div>

                <div className='subject-buttons-container'>
                    {isTestDone ? (
                        <>
                            <button className='subject-rec-button' onClick={() => onRecommendation(subject)}>Recomendações de estudo</button>
                            <button className='subject-review-button'>Revisar</button>
                            <button className='subject-restart-button' onClick={() => onRestartTest(subject)}>Refazer</button>
                        </>
                    ) : (
                        <button className='subject-start-button' onClick={() => navigate('/questions')}>Começar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubjectCard;