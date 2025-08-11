import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ResetPasswordModal from "../components/ResetPasswordModal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function ResetPassword() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

    // Extraer token y email de los query params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [modalErrorMessage, setModalErrorMessage] = useState("");
    const [successfulMessage, setSuccessfulMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const passwordInputRef = useRef(null);

    useEffect(() => {
        if (passwordInputRef.current) passwordInputRef.current.focus();
    }, []);

    const sendResetPasswordRequest = async () => {
        setErrorMessage("");
        setModalErrorMessage("");
        setSuccessfulMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}reset-password`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    token,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            if (!response.ok) {
                const statusMessage =
                    response.status === 400
                        ? "El token es inválido o ha expirado."
                        : response.status === 422
                            ? "Las contraseñas no cumplen los requisitos del servidor."
                            : response.status === 429
                                ? "Demasiadas solicitudes. Inténtalo de nuevo más tarde."
                                : "Hubo un error al procesar la solicitud.";
                setModalErrorMessage(statusMessage);
                setShowModal(true);
                return;
            }

            setSuccessfulMessage(
                "Contraseña cambiada correctamente.\nInicia sesión con tu nueva contraseña."
            );
            setShowModal(true);
        } catch (error) {
            setModalErrorMessage("No se pudo conectar con el servidor.");
            console.error("Error:", error);
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password || password.length < 8) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (password !== passwordConfirmation) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }
        if (!email || !token) {
            setErrorMessage("Faltan parámetros en la URL (email o token).");
            return;
        }
        sendResetPasswordRequest();
    };

    return (
        <>
            <Header />
            <main className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h2 className="text-center mb-4">Cambiar Contraseña</h2>

                        {errorMessage && (
                            <Alert variant="danger" className="alert-glass-danger mb-3 text-center">
                                {errorMessage}
                            </Alert>
                        )}

                        <form
                            className="d-flex flex-column align-items-center w-100"
                            onSubmit={handleSubmit}
                        >
                            <input
                                ref={passwordInputRef}
                                className="general-input mb-3 w-100"
                                placeholder="Nueva contraseña"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <input
                                className="general-input mb-3 w-100"
                                placeholder="Confirmar contraseña"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                className="btn general-btn w-100"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Cambiando...
                                    </>
                                ) : (
                                    "Cambiar contraseña"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />

            {showModal && (
                <ResetPasswordModal
                    closeModal={() => setShowModal(false)}
                    loading={loading}
                    errorMessage={modalErrorMessage}
                    successfulMessage={successfulMessage}
                />
            )}
        </>
    );
}