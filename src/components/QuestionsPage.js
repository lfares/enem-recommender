import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
// import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';

const QuestionPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [year, setYear] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    // const navigate = useNavigate();

    const userId = 1;
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

                setYear(data.Items ? data.Items[0].Year : "2023");
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
            [questions[currentQuestionIndex].FriendlyQuestionId]: answer,
        }));
    };

    const sendResponsesToSQS = () => {
        const sqs = new AWS.SQS();

        const testId = `${subject}-${year}`;
        const body = {
            UserId: userId,
            TestId: testId,
            Responses: selectedAnswers,
            IsFinished: isFinished
        };

        const params = {
            QueueUrl: 'https://sqs.us-east-1.amazonaws.com/481665124130/ResponsesEvents',
            MessageBody: JSON.stringify(body)
        }

        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.error("Error sending message to ResponseEvents SQS", err);
            } else {
                console.log(`Message sent to ResponseEvents SQS with ID ${data.MessageId} and body ${data.MD5OfMessageBody}`);
            }
        });
    };

    const handleFinish = () => {
        setIsFinished(true);
        sendResponsesToSQS();
    }

    return (
        <div className='question-page'>
            {questions.length > 0 && (
                <QuestionCard 
                    question={questions[currentQuestionIndex]}
                    selectedAnswer={selectedAnswers[questions[currentQuestionIndex].FriendlyQuestionId]}
                    onAnswerSelect={handleAnswerSelect}
                />
            )}

            <div className='navigation-buttons'>
                <button onClick={handlePrevious}>Anterior</button>
                <button onClick={handleNext}>Próxima</button>
                <button className='finalize-button' onClick={handleFinish}>Finalizar</button>
            </div>
        </div>
    );
};

export default QuestionPage;