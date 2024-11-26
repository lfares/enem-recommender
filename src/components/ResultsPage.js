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

    useEffect( async () => {
        await fetchResults();
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

    const handleRecommendation = async (subject) => {
        const subjectRecommendations = await calculateRecommendations(subject);
        console.log(JSON.stringify(subjectRecommendations));

        localStorage.setItem('exam', "ENEM");
        localStorage.setItem('year', year);
        localStorage.setItem('subject', subject);

        console.log(`Recommendations: ${JSON.stringify(subjectRecommendations)}`);
        navigate('/recommendations', { state: { subjectRecommendations: subjectRecommendations, subjectSummary: "Dummy Summary"}});
    };

    const calculateRecommendations = async (subject) => {
        const responsesData = subjectResults[subject];

        const params = {
            TableName: 'MatchedMaterials-dev',
            Key: {
                TestId: `${subject}-${year}`
            }
        };
        const dynamodbData = await new Promise((resolve, reject) => {
            dynamodb.get(params, (err, data) => {
                if (err) {
                    reject(`Unable to fetch item for TestId=${subject}-${year}. Error: ${err}`);
                } else {
                    console.log(`Retrieved ${JSON.stringify(data.Item)} from MatchedMaterials`);
                    resolve(data.Item);
                }
            });
        });

        const modulesIds = {};
        for (const erroredQuestion of responsesData.WrongSelection) {
            console.log(`${erroredQuestion}`);
            const [moduleId1, moduleId2] = dynamodbData.TodaTeoriaModulesByQuestion[erroredQuestion];
            modulesIds[moduleId1] = (modulesIds[moduleId1] || 0) + 1;
            modulesIds[moduleId2] = (modulesIds[moduleId2] || 0) + 1;
        }
        console.log(`Module ids map for ${subject}: ${JSON.stringify(modulesIds)}`);

        const sortedModulesIds = Object.keys(modulesIds)
            .map(moduleId => ({ 
                module: Number(moduleId), 
                countErrored: modulesIds[moduleId],
                countGeneral: dynamodbData.TodaTeoriaModulesGeneral[moduleId]
            }))
            .sort((a, b) => {
                if (b.countErrored !== a.countErrored) {
                    return b.countErrored - a.countErrored;
                }
                // Break ties using countGeneral
                return b.countGeneral - a.countGeneral;
            })
            .map(item => item.module);
        console.log(`Sorted module ids for ${subject}: ${sortedModulesIds}`);

        return await retrieveModulesName(subject, sortedModulesIds);
    };

    const retrieveModulesName = async (subject, modulesIds) => {
        try {
            const subjectData = await fetch('todaTeoria/subjectByEnemComponent.json');
            const modulesData = await fetch('todaTeoria/modules.json');
    
            if (!subjectData.ok || !modulesData.ok) {
              throw new Error('Error loading JSON files');
            }
    
            const subjectByEnemComponent = await subjectData.json();
            const modules = await modulesData.json();

            const todaTeoriaSubjects = subjectByEnemComponent[subject];
            const modulesNamesBySubject = {};

            await todaTeoriaSubjects.map(todaTeoriaSubject => {
                if (modules[todaTeoriaSubject] && modules[todaTeoriaSubject].modules) {
                    const moduleNames = modules[todaTeoriaSubject].modules;
                    const filteredModuleNames = modulesIds
                        .map(moduleId => moduleNames[moduleId]) 
                        .filter(name => name); 

                    if (filteredModuleNames.length > 0) {
                        modulesNamesBySubject[todaTeoriaSubject] = filteredModuleNames;
                    }
                }
            });

            return modulesNamesBySubject;

        } catch (err) {
            console.error('Error loading data:', err);
        }
    }

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
                            onRecommendation={handleRecommendation}
                        />
                    );
                })}
            </div>
        </div>
    );

};

export default ResultsPage;