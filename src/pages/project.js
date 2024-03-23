import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

export default function Home() {
	const navigate = useNavigate();

	const project = () => {
		navigate("/project");
	}

    const [input, setInput] = useState("");
    const [spin, setSpin] = useState("");
    const [data, setData] = useState([]);

    const predict = async (input) => {
        setSpin(true);
        console.log(input);
        const response = await fetch(
            "https://api-inference.huggingface.co/models/medicalai/ClinicalBERT",
            {
                headers: { 
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify( {
                    "inputs": input,
                    parameters: {
                        "return_full_text": false,
                    }
                }),
                
            }
        );

        const result = await response.json();
        console.log(result);
        
        setInput("");
        
        setData([...data, {
            "inputs": input,
            "result": result
        }]);
        
        setSpin(false);
    }

    const handleInput = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    }

    // const data = [
    //     {
    //         "inputs": "Question1: Which of the following is an example of monosomy?",
    //         "result": "return_full_text"
    //     },
    //     {
    //         "inputs": "Question2: Which of the following is an example of monosomy?",
    //         "result": "return_full_text"
    //     },
    //     {
    //         "inputs": "Question3: Which of the following is an example of monosomy?",
    //         "result": "return_full_text"
    //     },
    // ];

	return (
        <FullscreenCont>
            {
                spin ? 
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
               :
                <Cont>
                    {
                        data.map((d) => {
                            return (
                                <div class="card" style={{width: "100%", height: "9rem", marginBottom:"30px"}}>
                                    <div class="card-body">
                                        <p class="card-text">
                                        <div class="input-group mb-3" style={{width:"100%"}}>
                                            <span class="input-group-text" id="inputGroup-sizing-default">Input</span>
                                            <input type="text" class="form-control" aria-label="Sizing example input" disabled="disabled" value={d.inputs} aria-describedby="inputGroup-sizing-default"/>
                                        </div>
                                        </p>
                                        <div class="input-group mb-3" style={{width:"100%"}}>
                                            <span class="input-group-text" id="inputGroup-sizing-default">Result</span>
                                            <input type="text" class="form-control" aria-label="Sizing example input" disabled="disabled" value={d.result} aria-describedby="inputGroup-sizing-default"/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div class="card" style={{width: "100%", height: "9rem", marginBottom:"30px"}}>
                        <div class="card-body">
                            <p class="card-text">
                            <div class="input-group mb-3" style={{width:"100%"}}>
                                <span class="input-group-text" id="inputGroup-sizing-default">Input</span>
                                <input type="text" class="form-control" aria-label="Sizing example input" value={input} onChange={handleInput} aria-describedby="inputGroup-sizing-default"/>
                            </div>
                            </p>
                            <a href="#" class="btn btn-primary" onClick={() => predict(input)}>Predict</a>
                        </div>
                    </div>
                </Cont>
            }
        </FullscreenCont>
	)
}

const FullscreenCont = styled.div`
    display: flex;
    width: 100vw;
    min-height: 100vh;
    padding: 30px;
    justify-content: center;
    align-items: center;
`;

const Cont = styled.div`
    display: flex;
    width: 100vw;
    min-height: 100vh;
    padding: 30px;
    flex-direction: column;
`;