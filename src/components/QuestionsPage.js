import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
// import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';

const QuestionPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    // const navigate = useNavigate();

    const subject = localStorage.getItem('subject');
    console.log(`Starting to process Questions for subject ${subject}`);

    useEffect(() => {
        AWS.config.update({
            region: 'us-east-1',
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:ec26298d-3546-42fc-bc46-155f1b3cdeb6'
            })
        })

        const dynamodb = new AWS.DynamoDB.DocumentClient();

        const fetchQuestions = async () => {
            const params = {
                TableName: 'QuestionsEnem-dev',
                IndexName: 'Subject',
                KeyConditionExpression: 'Subject = :subject',
                ExpressionAttributeValues: {
                    ':subject': subject,
                },
            };

            try {
                const data = await dynamodb.query(params).promise();
                console.log('DynamoDB questions:', data.Items);

                const sortedQuestions = data.Items.sort((a, b) => a.Id - b.Id);

                setQuestions(sortedQuestions);
            } catch (err) {
                console.error("Error fetching questions: ", err);
            }
        };

        fetchQuestions();
    }, [subject]);

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questions[currentQuestionIndex].Id]: answer,
        }));
    };

    return (
        <div className='question-page'>
            {questions.length > 0 && (
                <QuestionCard 
                    question={questions[currentQuestionIndex]}
                    selectedAnswer={selectedAnswers[questions[currentQuestionIndex].Id]}
                    onAnswerSelect={handleAnswerSelect}
                />
            )}

            <div className='navigation-buttons'>
                <button onClick={handlePrevious}>Anterior</button>
                <button onClick={handleNext}>Próxima</button>
            </div>
        </div>
    );
};

export default QuestionPage;