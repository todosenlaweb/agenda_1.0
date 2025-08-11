import React, {useEffect, useRef, useState} from "react";
import BaseModal from "./BaseModal";
import Spinner from "react-bootstrap/Spinner";

export default function SignUpModal({ closeModal }) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [registered, setRegistered] = useState(false);
    const nameInputRef = useRef(null);
    
    useEffect(() => {
        if (nameInputRef.current) nameInputRef.current.focus();
    }, [])

    const trySignUp = () => {
        setError("");
        setSuccess("");

        if (name.length < 3) {
            setError("El nombre debe ser mayor a 3 caracteres");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Ingresa un correo válido");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe contener al menos 6 caracteres");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        signUp();
    };

    const signUp = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        const requestBody = {
            name,
            email,
            password,
            password_confirmation: confirmPassword,
        };

        try {
            const response = await fetch(`${API_BASE_URL}register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const json = await response.json();

            setSuccess("Te has registrado correctamente.\nAhora puedes ingresar con tus credenciales.");
            setRegistered(true);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudo completar el registro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal closeModal={closeModal}>
            <h2 className="text-center mb-4">Registrarse</h2>

            {loading && (
                <div className="text-center mb-3">
                    <Spinner animation="border" />
                </div>
            )}

            {error && (
                <div className="alert-glass alert-glass-danger p-2 text-center mb-3">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert-glass alert-glass-success p-2 text-center mb-3" style={{ whiteSpace: "pre-line" }}>
                    {success}
                </div>
            )}

            {!registered && (
                <form className="d-flex flex-column align-items-center"
                      onSubmit={(e) => {
                          e.preventDefault();
                          trySignUp();
                      }}>
                    <input
                        ref={nameInputRef}
                        className="general-input mb-2"
                        placeholder="Nombre"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="general-input mb-2"
                        placeholder="Correo"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="general-input mb-2"
                        placeholder="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="general-input mb-2"
                        placeholder="Confirmar Contraseña"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        className="btn general-btn mt-2 w-100"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>
            )}
        </BaseModal>
    );
}
