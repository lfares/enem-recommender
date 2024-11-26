import React from 'react';
import { useLocation } from 'react-router-dom';

const RecommendationsPage = () => {
    const location = useLocation();
    const subjectRecommendations = location.state.subjectRecommendations;
    const recommendationSummary = location.state.recommendationSummary;

    return (
        <div className="results-page">
            <div className="header">
                <h1 className="title">Recomendações de Estudo</h1>
                <img className="ai-logo" src="img/genAI-logo.png" alt="Generative AI Logo" />
            </div>
        
            <div className="summary-container">
                <p className="summary-text">{recommendationSummary}</p>
            </div>
        
            <div className="columns-container">
                {Object.keys(subjectRecommendations).map(subject => (
                <div className="subject-column" key={subject}>
                    <h2 className="subject-title">{subject}</h2>
                    <ul className="module-list">
                    {subjectRecommendations[subject].map((module, index) => (
                        <li className="module-item" key={index}>{module}</li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationsPage;