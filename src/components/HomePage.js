import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [exam, setExam] = useState('ENEM');
    const [year, setYear] = useState('2023');
    const [subject, setSubject] = useState('Ciências da Natureza');
    const navigate = useNavigate();

    const handleStart = () => {
        localStorage.setItem('exam', exam);
        localStorage.setItem('year', year);
        localStorage.setItem('subject', subject);

        navigate('/questions');
    };

    return (
        <div className="home-page">
            <div className="container">
                <h1>Bem vindo ao <span>Enem Recommender</span></h1>
                <div className="selection-group">
                    <label>Escolha o simulado que deseja fazer: </label>
                    <select value={exam} onChange={(e) => setExam(e.target.value)}>
                        <option value="ENEM">ENEM</option>
                    </select>
                </div>

                <div className="selection-group">
                    <label>Escolha o ano da prova: </label>
                    <select value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="2023">2023</option>
                    </select>
                </div>

                <div className="selection-group">
                    <label>Escolha a matéria: </label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option value="Ciências da Natureza">Ciências da Natureza</option>
                        <option value="Ciências Humanas">Ciências Humanas</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Linguagens">Linguagens</option>
                    </select>
                </div>

                <button onClick={handleStart}>Começar</button>
            </div>
        </div>
    );
};

export default HomePage;