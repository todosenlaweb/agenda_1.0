import { useState} from "react";
import { useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import { getCookie } from "../utils/cookies";
import LogOutModal from "./LogOutModal";
import {useUser} from "../context/UserContext";

const Header = () => {
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const navigate = useNavigate();
    const handleArticleClick = (url) => {
    navigate(`/${url}/`, { state: { url } });
    };
    const [logInModal, setLogInModal] = useState(false);
    const toggleLogInModal = ()=> {    
        setLogInModal(!logInModal);
    }
    const [logOutModal, setLogOutModal] = useState(false);
    const toggleLogOutModal = ()=> {    
        setLogOutModal(!logOutModal);
    }
    const [signUpModal, setSignUpModal] = useState(false);
    const toggleSignUpModal = ()=> {    
        setSignUpModal(!signUpModal);
    }

    const { userRole } = useUser();
    
    return (
        <>
        {(logInModal && (<>
            <LoginModal closeModal={toggleLogInModal}/>
        </>))}
        {(signUpModal && (<>
            <SignUpModal closeModal={toggleSignUpModal}/>
        </>))}
        {(logOutModal && (<>
            <LogOutModal closeModal={toggleLogOutModal}/>
        </>))}

        <header className="py-2">
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <button 
                    className="navbar-brand fs-1 text-dark" 
                    style={{
                        border: "0px",
                        backgroundColor: "transparent",
                    }}
                    onClick={() => handleArticleClick("")}><img className="me-2 rounded-4" width={50} src="/image.jpg" alt="logo"></img></button>
                <div>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="nav-link fs-5" style={{color: "var(--text-color)"}} onClick={() => setShowOptionsMenu(!showOptionsMenu)}><i className="bi bi-three-dots-vertical me-2">
                                </i></button>
                                <div style={{display: "inline-block"}}>
                                {showOptionsMenu && (
                                    <div className="shadow-lg d-flex flex-column align-items-center"
                                        style={{
                                            translate: "-70%",
                                            position: "absolute",
                                            padding: "10px", 
                                            backgroundColor: "var(--panel-bg-color)",
                                        }}
                                    >
                                        <DarkMode></DarkMode>
                                        {getCookie("token") ? (<>
                                            <button className="btn general-btn mt-2 w-100" type="button" onClick={toggleLogOutModal}>
                                                Cerrar Sesión
                                            </button>
                                                {userRole === "Admin" ? (<>
                                                    <button className="btn general-btn mt-2 w-100" type="button" onClick={()=>{navigate("/admindashboard");}}>
                                                        Administrar Perfiles
                                                    </button>
                                                </>) : (<>
                                                    <button className="btn general-btn mt-2 w-100" type="button" onClick={()=>{navigate("/modeldashboard");}}>
                                                        Modificar Perfil
                                                    </button>
                                                </>)}

                                        </>) 
                                        : 
                                        (<>
                                            <button className="btn general-btn mt-2 w-100" type="button" onClick={toggleLogInModal}>
                                                Iniciar Sesión
                                            </button>
                                            <button className="btn general-btn mt-2 w-100" type="button" onClick={toggleSignUpModal}>
                                                Registrarse
                                            </button>
                                        </>)}
                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </header>
        </>
    );
};

export default Header;