import React, { useState, useEffect, useRef } from "react";
import BaseModal from "./BaseModal";
import { setCookie } from "../utils/cookies";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import {useNavigate} from "react-router-dom";

export default function LoginModal({ closeModal }) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successfulMessage, setSuccessfulMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const emailInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (emailInputRef.current) emailInputRef.current.focus();
    }, [])

    const logIn = async () => {
        setSuccessfulMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const statusMessage =
                    response.status === 401
                        ? "Correo o contraseña incorrectos"
                        : "Hubo un error al iniciar sesión";
                setErrorMessage(statusMessage);
                return;
            }

            const json = await response.json();
            setSuccessfulMessage("Has iniciado sesión correctamente.");
            setCookie("token", json.token);
            setLogged(true);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setErrorMessage("No se pudo conectar con el servidor.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal closeModal={closeModal}>
            <h2 className="mb-4 text-center">Iniciar Sesión</h2>

            {loading && (
                <div className="text-center mb-3">
                    <Spinner animation="border" />
                </div>
            )}

            {errorMessage && (
                <Alert variant="danger" className="alert-glass-danger mb-3 text-center">
                    {errorMessage}
                </Alert>
            )}

            {successfulMessage && (
                <Alert variant="success" className="alert-glass-success mb-3 text-center">
                    {successfulMessage}
                </Alert>
            )}

            {!logged && (
                <form
                    className="d-flex flex-column align-items-center w-75 px-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        logIn();
                    }}
                >
                    <input
                        ref={emailInputRef}
                        className="general-input mb-3 w-100"
                        placeholder="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="general-input mb-3 w-100"
                        placeholder="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p
                        onClick={()=>{navigate("/forgot-password")}}
                        className={"general-link mb-3"}
                    >
                        Olvide mi contraseña</p>
                    <button
                        className="btn general-btn w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Ingresando..." : "Entrar"}
                    </button>
                </form>
            )}
        </BaseModal>
    );
}
