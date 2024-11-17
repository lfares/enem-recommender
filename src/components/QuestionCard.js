import React from 'react';

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect}) => {
    return (
        <div className='question-card'>
            <div className='question-header'>
                <span className='question-id'>{question.FriendlyQuestionId} - </span>
                <span>{question.Text}</span>
            </div>

            {question.ImagesPath && <img src={question.ImagesPath} alt="Question Image" />}

            <div className='question-statement'>{question.Statement}</div>

            <div className='alternatives'>
                {Object.entries(question.Alternatives).map(([key, value]) => (
                    <label key={key} className='alternative-option'>
                        <input
                            type='radio'
                            name='answer'
                            value={key}
                            checked={selectedAnswer == key}
                            onChange={() => onAnswerSelect(key)}
                        />
                        {value}
                    </label>
                ))}
            </div>

            <button className='finalize-button'>Finalizar</button>
        </div>
    )
};

export default QuestionCard;