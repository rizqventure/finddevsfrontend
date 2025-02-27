import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './UserProfile.module.css';
import { Link } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import HirePopUp from '../../Components/HirePopUp/HirePopUp';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";
import ProjectCard from '../../Components/ProfileProjectCard/ProfileProjectCard';
import Loading from '../../Media/Loading.gif';
import Logo from '../../Media/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import Verification from '../../Media/Verification.png';

function UserProfile({ username, pathname }) {

    const [user, setUser] = useState({});
    const [isUser, setIsUser] = useState(false)
    const [color, setColor] = useState(null);
    const [hasWorked, setHasWorked] = useState(false);
    const [hasCreated, setHasCreated] = useState({});
    const [loading, setLoading] = useState(true);
    const [noUser, setNoUser] = useState(false);

    useEffect(() => {
        const usuario = jwt.decode(JSON.parse(localStorage.getItem('user')));
        if (!usuario) setNoUser(true);
        axios.get(`/users/${username}`)
            .then(res => {
                if (res.data === null) window.location.replace('/error');
                setUser(res.data);
                setColor(res.data.color);
                var userProjects = {};
                if (res.data.projects.find(project => project.userXprojects.isFounder === true)) userProjects.own = true;
                if (res.data.projects.find(project => project.userXprojects.isFounder === false)) userProjects.joined = true;
                setHasCreated(userProjects);
                if (usuario && usuario.username === res.data.username) setIsUser(true);
                if (pathname.search === "?verify" && usuario && usuario.username !== res.data.username) setHasWorked(true);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [])

    function validateSkill(skill) {
        if (hasWorked) {
            axios.post(`/skills/${username}/validate`, { skill: skill.label })
                .then(res => window.location.reload())
                .catch(err => console.log(err))
        }
    }

    const BlueOnGreenTooltip = withStyles({
        tooltip: {
            color: "white",
            backgroundColor: "#181a19",
            fontFamily: 'Nunito',
            fontSize: '12px'
        }
    })(Tooltip);

    return (
        <div>
            {loading ?
                <img alt="Suggestions GIF" id={style.loading} src={Loading} /> :
                <div>
                    <div id={style.cover} style={{ backgroundColor: color }}></div>
                    <div className='displayFlexColumn' id='alignItemsCenter'>
                        <div id={style.socialMediaDiv} style={{ color: color }}>
                            {isUser ? <Link className='link' to='/edit/user/me'><button style={{ background: color, color: user.brightness === 'bright' ? '#fff' : '#000' }} id={style.btn}>UPDATE PROFILE</button></Link> : noUser ? null : <HirePopUp applicantsNotifications={user.notifications} applicantUsername={user.username} color={color} />}
                            {user.gitHub && <a target='_blank' rel="noreferrer" href={user.gitHub} style={{ textDecoration: 'none', color: color }}><FontAwesomeIcon icon={faGithubSquare} /></a>}
                            {user.linkedIn && <a target='_blank' rel="noreferrer" href={user.linkedIn} style={{ textDecoration: 'none', color: color }}><FontAwesomeIcon icon={faLinkedin} /></a>}
                            {user.twitter && <a target='_blank' rel="noreferrer" href={user.twitter} style={{ textDecoration: 'none', color: color }}><FontAwesomeIcon icon={faTwitterSquare} /></a>}
                        </div>
                        <div style={{ border: `10px solid ${color}`, alignSelf: 'center', backgroundImage: `url(${user.profilePic})` }} id={style.profilePic}></div>
                        <div className='displayFlex' id="alignItemsCenter">
                            <h3 className='font800'><span style={{ color: color }}>@ </span>{user.username}</h3>
                            {user.isPremium ? <img src={Verification} id={style.verification} /> : null}
                        </div>
                        <span id={style.description}>{user.description}</span>
                        <div id={style.datadiv}>
                            {user.region && user.country ?
                                <span>{user.region && user.country && `📍 ${user.region}, ${user.country}`}</span> :
                                null
                            }
                            <div id={style.skillDiv}>
                                {user.skills && user.skills.map(skill =>
                                    hasWorked ?
                                        <BlueOnGreenTooltip key={skill.user_skills.id} title={skill.user_skills.isValidated ? 'Already validated!' : `Validate @${username}'s skill!`}>
                                            <div style={{ background: skill.strongColor, color: skill.softColor }} id={style.skillBtn} onClick={() => validateSkill(skill)}>
                                                <span>{hasWorked && !skill.user_skills.isValidated && <FontAwesomeIcon icon={faPlusCircle} />} {skill.user_skills.isValidated ? <FontAwesomeIcon icon={faCheckCircle} /> : null} {skill.label}</span>
                                            </div>
                                        </BlueOnGreenTooltip> :
                                        <div style={{ background: skill.strongColor, color: skill.softColor }} id={style.skillBtn} onClick={() => validateSkill(skill)}>
                                            <span>{hasWorked && !skill.user_skills.isValidated && <FontAwesomeIcon icon={faPlusCircle} />} {skill.user_skills.isValidated ? <FontAwesomeIcon icon={faCheckCircle} /> : null} {skill.label}</span>
                                        </div>
                                )}
                            </div>
                        </div>
                        {hasCreated.own && <div className={style.projectDiv}>
                            <h3 id={style.smallerTitles} className='font800'>Projects created</h3>
                            <div id={style.mainProjectDiv}>
                                {user.projects && user.projects.map(project => project.userXprojects.isFounder ? <ProjectCard key={project.id} isFounder={true} project={project} /> : null)}
                            </div>
                        </div>}
                        {hasCreated.joined && <div className={style.projectDiv}>
                            <h3 id={style.smallerTitles} className='font800'>Project joined</h3>
                            <div id={style.mainProjectDiv}>
                                {user.projects && user.projects.map(project => !project.userXprojects.isFounder ? <ProjectCard key={project.id} project={project} /> : null)}
                            </div>
                        </div>}
                        {user.projects.length === 0 &&
                            <div id={style.emptyDiv}>
                                <img src={Logo} id={style.empty} />
                                <h3 className='font200'>{isUser ? "You haven't joined or created any project." : "This developer hasn't joined or created any project."}</h3>
                            </div>}
                    </div>
                </div>}
        </div>
    )
}

export default UserProfile;