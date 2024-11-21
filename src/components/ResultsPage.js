import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { useNavigate, useLocation } from 'react-router-dom';
import SubjectCard from './SubjectCard';

const ResultsPage = () => {
    const subjects = ["Ciências da Natureza", "Ciências Humanas", "Matemática", "Linguagens"];
    const [subjectResults, setSubjectResults] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const userId = 1;
    const year = location.state.year || 2023;
    const totalQuestions = 45;

    AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:ec26298d-3546-42fc-bc46-155f1b3cdeb6'
        })
    });
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const fetchResults = async () => {
        const results = {};
        for (const subject of subjects) {
            const params = {
                TableName: 'Responses-dev',
                KeyConditionExpression: 'UserId = :userId AND TestId = :testId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                    ':testId': `${subject}-${year}`
                }
            }

            try {
                const data = await dynamodb.query(params).promise();
                results[subject] = data.Items[0] || null;
                console.log(`Found following results from DDB: ${JSON.stringify(results[subject])} for params ${JSON.stringify(params)}`);
            } catch (err) {
                console.error(`Error fetching item from Responses DDB for UserId=${userId} and Subject=${subject}: `, err);
            }
        }

        setSubjectResults(results);
    };

    useEffect(() => {
        fetchResults();
    }, [year]);

    const handleRestartTest = (subject) => {
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'Responses-dev',
            Key: {
                UserId: userId,
                TestId: `${subject}-${year}`
            }
        };

        dynamodb.delete(params, (err, data) => {
            if (err) {
                console.error(`Error deleting item with UserId=${userId} and Subject=${subject} from Responses DDB: `, err);
            }
            console.log(`Restarting test for subject ${subject}.`);
            localStorage.setItem('exam', "ENEM");
            localStorage.setItem('year', year);
            localStorage.setItem('subject', subject);

            navigate('/questions');
        })
    };

    return (
        <div className='results-page'>
            <div className='subjects-container'>
                {subjects.map((subject) => {
                    const result = subjectResults[subject];
                    const isTestDone = result && result.WrongSelection;
                    const correctAnswers = isTestDone ? (totalQuestions - (result.WrongSelection ? result.WrongSelection.length : 0)) : 0;
                    return (
                        <SubjectCard
                            subject={subject}
                            year={year}
                            isTestDone={isTestDone}
                            correctAnswers={correctAnswers}
                            totalQuestions={totalQuestions}
                            onRestartTest={handleRestartTest}
                        />
                    );
                })}
            </div>
        </div>
    );

};

export default ResultsPage;