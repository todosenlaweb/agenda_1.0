import React from "react";
import BaseModal from "./BaseModal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

export default function ForgotPasswordModal({
                                                closeModal,
                                                loading,
                                                errorMessage,
                                                successfulMessage,
                                            }) {
    return (
        <BaseModal closeModal={closeModal}>
            <h2 className="mb-4 text-center">Restablecer Contraseña</h2>

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
                <Alert
                    variant="success"
                    className="alert-glass-success mb-3 text-center"
                    style={{ whiteSpace: "pre-line" }}
                >
                    {successfulMessage}
                </Alert>
            )}

            {!loading && (errorMessage || successfulMessage) && (
                <div className="d-flex justify-content-center">
                    <button
                        className="btn general-btn"
                        onClick={closeModal}
                    >
                        Cerrar
                    </button>
                </div>
            )}
        </BaseModal>
    );
}