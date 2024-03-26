import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
	const navigate = useNavigate();

    const [proj, setProj] = useState('');
    const [spin, setSpin] = useState(false);

    const Handleproj = (e) => {
        e.preventDefault();
        setProj(e.target.value);
    }

	const project = (projectName) => {
        setSpin(true);

        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token == null || username == null || projectName.trim() == '') {
            navigate('/login');
        } else {
            axios.post('http://127.0.0.1:5000/create-project',
            {
                "project_name": projectName.trim(),
            }, 
            {
                headers: {
                    'Authorization': token,
                    'username': username,
                }
            }).then((res) => {
                console.log(res.status);
                
                if (res.status == 200) {
                    console.log(res.data);

                    if (res.data.message == 'Project created successfully!') {
                        
                        // SUCCESS
                        const projecttoken = res.data.project_token;
		                navigate("/project", {state: {ProjectName:projectName.trim(), ProjectToken: projecttoken, prevData: []}});                        
                    } else {
                    
                        // FAILURE AFTER AUTH SUCCESS
                        setSpin(false);
                        alert(res.data.message);
                        setProj('');                        
                    }
                } else if (res.status == 201) {
                    
                    // AUTH ERROR
                    setSpin(false);
                    localStorage.clear();
                    navigate('/login');        
                } else {

                    setSpin(false);
                    alert('Error in the request!');
                }

            }).catch((err) => {
                console.log(err);
            });
        }

        setSpin(false);
	}

	return (
		<Cont>
            {
                spin ? 
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                :
                <Box>
                    <div class="input-group mb-3" style={{width:"100%"}}>
                        <span class="input-group-text" id="inputGroup-sizing-default">Project Name</span>
                        <input type="text" value={proj} onChange={Handleproj} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    <button type="button" class="btn btn-primary" onClick={() => project(proj)}>Create Project</button>
                </Box>
            }
		</Cont>
	)
}

const Cont = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50vw;
    height: 30vh;
`;

const ProjectName = styled.div`
    width: 100%;
    height: 50%;
`;

const ModelName = styled.div`
    width: 100%;
    height: 50%;
`;
