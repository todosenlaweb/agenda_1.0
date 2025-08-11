import {useEffect, useRef, useState} from "react";
import BaseModal from "./BaseModal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import {getCookie} from "../utils/cookies";
import {useNavigate} from "react-router-dom";

export default function SubscriptionModal({ closeModal, userId }) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [subscription, setSubscription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successfulMessage, setSuccessfulMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [canAdd, setCanAdd] = useState(true);
    const monthsInputRef = useRef(null);

    useEffect(() => {
        if (monthsInputRef.current) monthsInputRef.current.focus();
    }, [])

    async function handleSubmit() {
        setLoading(true);
        setCanAdd(false);
        setErrorMessage("");
        setSuccessfulMessage("");
        if (subscription === "") {
            setErrorMessage("Ingresa el tiempo de la suscripcion en meses");
            setLoading(false);
            return;
        }

        const body = {
            months: Number(subscription),
            token: getCookie("token"),
        };

        try {
            const response = await fetch(`${API_BASE_URL}subscriptions/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const json = await response.json();
            setSuccessfulMessage(`Suscripción agregada correctamente \nLa suscripcion caduca en ${json.subscription.expires_at.slice(0, 10)}`);
        } catch (error) {
            setErrorMessage("Error al agregar la suscripción");
        } finally {
            setLoading(false);
        }
    }

    return (
        <BaseModal closeModal={closeModal}>
            <h2 className="text-center mb-4">Agrega una suscripción a este usuario</h2>

            {loading && (
                <div className="text-center mb-3">
                    <Spinner animation="border" />
                </div>
            )}

            {errorMessage && (
                <Alert variant="danger" className="mb-3 alert-glass-danger">
                    {errorMessage}
                </Alert>
            )}

            {successfulMessage && (
                <Alert variant="success" className="mb-3 alert-glass-success pre-line text-center">
                    {successfulMessage}
                </Alert>
            )}

            {canAdd ? (<>
                <form className="w-50" onSubmit={handleSubmit}>
                    <input
                        ref={monthsInputRef}
                        className="general-input w-100 mb-3"
                        type="number"
                        placeholder="Ingresa los meses de la suscripción"
                        value={subscription}
                        onChange={(e) => setSubscription(e.target.value)}
                    />
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn general-btn" onClick={closeModal}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn general-btn"
                            disabled={loading}
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </>) : (<>
                <div className={"d-flex justify-content-center w-100"}>
                    <button type="button" className="btn general-btn" onClick={closeModal}>Cerrar</button>
                </div>
            </>)}
        </BaseModal>
    );
}
