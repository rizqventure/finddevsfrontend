import React, { useState } from 'react';
import style from './ApplicantsPopUp.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function ChangeRole({ userData, setChangeRole, projectName }) {

    const [role, setRole] = useState (userData.userXprojects.role)

    function changeRole () {
        const data = userData.userXprojects;
        if (role === '') return;
        axios.put (`/projects/${userData.userXprojects.userId}/${userData.userXprojects.projectId}/role`, { role,  userXprojects: data })
            .then (res => window.location.reload ())
            .catch (err => console.log (err))
    }

    return (
        <div id={style.memberForm}>
            <button id={style.closeBtn} onClick={() => setChangeRole(false)}><FontAwesomeIcon icon={faChevronLeft} /></button>
            <h1 className='font200'>Change <span className='font800'>{userData.username}'s</span> role at <span className='font800'>{projectName}</span></h1>
            <div id={style.changeInputDiv}>
                <input value={role} onChange={(e) => setRole (e.target.value)} id={style.changeInput}></input>
                <button id={style.accept} onClick={ changeRole }><FontAwesomeIcon icon={faCheckCircle} /></button>
            </div>
        </div>
    )
}

export default ChangeRole;