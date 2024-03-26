import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from 'styled-components';
import { useRef } from "react";
import axios from 'axios';

export default function Home() {
	const navigate = useNavigate();
    const location = useLocation();
    const ProjectName = location.state?.ProjectName;
    const ProjectToken = location.state?.ProjectToken;
    const prevData = location.state?.prevData;

    const [spin, setSpin] = useState("");
    const [data, setData] = useState([]);
    const [file, setFile] = useState();

    useEffect(() => {
        console.log(typeof prevData);
        if (typeof ProjectToken === 'undefined' || typeof ProjectName === 'undefined'  || typeof prevData === 'undefined' ) {
            navigate('/');
            return;
        }

        console.log(prevData);

        const newD = [];
        prevData.map((d) => {
            newD.push({
                "input": d.image,
                "result": d.label
            });
        });

        console.log(newD);
        setData(newD);

    }, []);

    const predict = async () => {
        setSpin(true);
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        const targetFile = document.getElementById('file').files[0];
        var formData = new FormData();
        formData.append("image", targetFile);

        await axios.post('http://127.0.0.1:5000/predict', formData,
            {
                headers: {
                    'Authorization': token,
                    'username': username,
                    'projectToken': ProjectToken,
                    'Content-Type': 'multipart/form-data',
                }
            }).then((res) => {
                console.log(res.status);
                console.log(res.data);
                const prediction = res.data.prediction;
                const filename = res.data.filename;
                setData([...data, {
                    "input": filename,
                    "result": prediction
                }]);
                
            }).catch((err) => {
                console.log(err);
            });
        
        setFile("");
        
        setSpin(false);
    }

    const inputFile = useRef(null) 

    const upload = () => {
        inputFile.current.click();
    }

    const fileChange = (e) => {
        const file = e.target.files[0];
        setFile(URL.createObjectURL(file));
    }

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
                                <div class="card" style={{width: "100%", height: "11rem", marginBottom:"30px"}}>
                                    <div class="card-body">
                                        <p class="card-text">
                                        <div class="input-group mb-3" style={{width:"100%"}}>
                                            <IMG src={"http://127.0.0.1:5000/" + d.input}/>
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
                    <input onChange={fileChange} type='file' id='file' ref={inputFile} accept="image/png, image/gif, image/jpeg" style={{display: 'none'}}/>
                    {
                        file ?
                        <div class="card" style={{width: "100%", height: "11rem", marginBottom:"30px"}}>
                            <div class="card-body">
                                <p class="card-text">
                                <div class="input-group mb-3" style={{width:"100%"}}>
                                    <IMG src={file} />
                                </div>
                                </p>
                                <button class="btn btn-primary" onClick={predict}>Predict</button>
                            </div>
                        </div>
                        :
                        <div class="card" style={{width: "100%", height: "5rem", marginBottom:"30px"}}>
                            <div class="card-body">
                                <p class="card-text">
                                <div class="input-group mb-3" style={{width:"100%"}}>
                                    <button class="btn btn-primary" onClick={upload}>Upload</button>
                                </div>
                                </p>
                            </div>
                        </div>
                    }
                    
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

const IMG = styled.img`
    width: 100px;
`