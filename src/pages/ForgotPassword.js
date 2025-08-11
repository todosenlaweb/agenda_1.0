import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function ForgotPassword() {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [modalErrorMessage, setModalErrorMessage] = useState("");
    const [successfulMessage, setSuccessfulMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const emailInputRef = useRef(null);

    useEffect(() => {
        if (emailInputRef.current) emailInputRef.current.focus();
    }, []);

    const sendResetRequest = async () => {
        setErrorMessage("");
        setModalErrorMessage("");
        setSuccessfulMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}forgot-password`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const statusMessage =
                    response.status === 404
                        ? "El correo no está registrado."
                        : response.status === 429
                            ? "Demasiadas solicitudes. Inténtalo de nuevo más tarde."
                            : "Hubo un error al procesar la solicitud.";
                setModalErrorMessage(statusMessage);
                setShowModal(true);
                return;
            }

            setSuccessfulMessage(
                "Solicitud enviada correctamente.\nRevisa tu correo para restablecer tu contraseña."
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
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Ingresa un correo electrónico válido.");
            return;
        }
        sendResetRequest();
    };

    return (
        <>
            <Header />
            <main className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h2 className="text-center mb-4">Restablecer Contraseña</h2>

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
                                ref={emailInputRef}
                                className="general-input mb-3 w-100"
                                placeholder="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar solicitud"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />

            {showModal && (
                <ForgotPasswordModal
                    closeModal={() => setShowModal(false)}
                    loading={loading}
                    errorMessage={modalErrorMessage}
                    successfulMessage={successfulMessage}
                />
            )}
        </>
    );
}