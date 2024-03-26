import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import axios from 'axios';
import { useState } from "react";

export default function Home() {
	const navigate = useNavigate();

	const createproject = () => {
		navigate("/createproject");
	}

    const [spin, setSpin] = useState(true);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token == null || username == null) {
            navigate('/login');
        } else {
            axios.get('http://127.0.0.1:5000/', {
                headers: {
                    'Authorization': token,
                    'username': username,
                }
            }).then((res) => {
                console.log(res.status);
                
                if (res.status == 200) {
                    
                    const projs = res.data.user_projects;
                    console.log(projs);
                    setProjects(projs);
                    setSpin(false);
                } else if (res.status == 201) {
                    
                    // AUTH ERROR
                    localStorage.clear();
                    navigate('/login');
                } else {
                    
                    alert('Error in the request!');
                }

            }).catch((err) => {
                console.log(err);
            });
        }
    }, []);

    const moveTo = (proj) => {
        navigate("/project", {state: {ProjectName:proj['project_name'], ProjectToken: proj['project_token'], prevData: proj['history']}});
    }

	return (
		<Cont>
            {
                spin ? 
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                :
                <Cont>
                    <Topbox>
                        <Box>
                            <ExistingProjects>
                                Existing Projects
                            </ExistingProjects>
                            <div data-bs-spy="scroll" data-bs-target="#navbar-example2" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" class="scrollspy-example bg-body-tertiary p-3 rounded-2" tabindex="0" style={{width: "100%", height: "90%", overflow: "auto"}} >

                                <div class="list-group">
                                    {
                                        projects.map((proj) => {
                                            return (
                                                <div style={{}} onClick={() => moveTo(proj)} class="list-group-item list-group-item-action">
                                                    {proj['project_name']}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Box>
                    </Topbox>
                    <Bottombox>
                        <Createproj onClick={createproject}>
                            Create Project
                        </Createproj>
                    </Bottombox>
                </Cont>
            }
		</Cont>
	)
}

const Cont = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
`;

const Topbox = styled.div`
    display: flex;
    justify-content: center;
    align-items: end;
    height: 80%;
    width: 60%;
`;

const Box = styled.div`
    height: 70%;
    width: 100%;
`;

const Bottombox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20%;
    width: 60%;
`;

const Createproj = styled.button.attrs({
    className: 'btn btn-primary',
    })``;

const ExistingProjects = styled.div`
    margin-left: 30px;
    font-size: 18px;
    font-weight: bold;
    height: 10%;
`