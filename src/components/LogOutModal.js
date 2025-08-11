import { useState } from "react";
import BaseModal from "./BaseModal";
import { deleteCookie, getCookie } from "../utils/cookies";
import Spinner from "react-bootstrap/Spinner";

export default function LogOutModal({ closeModal }) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const logOut = async () => {
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: getCookie("token") }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const json = await response.json();

            deleteCookie("token");
            setSuccess("Sesión cerrada correctamente.");

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo cerrar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal closeModal={closeModal}>
            <h2 className="mb-4 text-center">Cerrar Sesión</h2>

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
                <div className="alert-glass alert-glass-success p-2 text-center mb-3">
                    {success}
                </div>
            )}

            {!success && (
                <>
                    <p className="text-center">¿Estás seguro de que quieres cerrar sesión?</p>
                    <button
                        className="btn general-btn w-50 mt-3"
                        onClick={logOut}
                        disabled={loading}
                    >
                        {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
                    </button>
                </>
            )}
        </BaseModal>
    );
}