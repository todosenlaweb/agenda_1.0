import Header from "../components/Header";
import Footer from "../components/Footer";
import React, {useEffect, useState} from "react";
import {getCookie} from "../utils/cookies";
import Filters from "../components/Filters";
import ArticleList from "../components/ArticleList";
import {calcularDistanciaKm} from "../utils/distance";
import useUserLocation from "../hooks/useUserLocation";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AdminDashboard (){

    const [profiles, setProfiles] = useState([]);
    const getDistance = calcularDistanciaKm;
    const { location, getLocation } = useUserLocation();

    useEffect(() => {
        const getProfiles = async ()=>{
            const token = getCookie("token");
            try {
                const response = await fetch(`${API_BASE_URL}all_people?token=${token}`);

                if (!response.ok) {
                    throw new Error('Token inválido');
                }

                const data = await response.json();
                setProfiles(data);

            } catch (error) {
                console.error('Error al verificar token:', error);
            }
        }

        getProfiles();
    }, [])

    const [filters, setFilters] = useState({
        name: "",
        zone: "",
        categories: [],
        distance: 0,
    });
    useEffect(()=>{
        if (filters.distance > 0 && !location)
            getLocation();
    }, [filters])

    function getFilteredArticles(array) {
        return array.filter((article) => {

            const matchesName =
                article.tags?.find(tag => tag.tipo === "nombre")?.valor.toLowerCase().includes(filters.name.toLowerCase());


            const matchesZone = filters.zone
                ? article.tags?.find(tag => tag.tipo === "nacionalidad")?.valor === filters.zone
                : true;

            let matchesCategories = false;

            if (filters.categories.length > 0) {
                if (article.tags.some(tag => tag.tipo === "categoria")) {

                    const categoryValue = article.tags.find(tag => tag.tipo === "categoria").valor;

                    for (let category of filters.categories) {

                        if (categoryValue && categoryValue === category) {
                            matchesCategories = true;
                            break;
                        }
                    }
                }
            } else if (article.media.length >= 0) matchesCategories = true;
            let near = false;
            if (filters.distance > 0 && location) {

                const coords = article.tags.find(tag => tag.tipo === "mapa");
                if (coords) {
                    const [latStr, lonStr] = coords.valor.split(',');
                    const distance = getDistance(location.lat, location.lon, latStr, lonStr);
                    near = distance >= filters.distance;

                }
            } else near = true;

            return matchesName && matchesZone && matchesCategories && near;
        });
    }

    let availableProfiles = [];
    let unAvailableProfiles = [];


    if (profiles.length > 0) {
        availableProfiles = getFilteredArticles(profiles.filter((article) => article.is_visible === true));
        unAvailableProfiles = getFilteredArticles(profiles.filter((article) => article.is_visible === false));
    }

    function getZones (){
        if (profiles){
            const zones = [];
            for (let article of profiles){
                const zone = article.tags?.find(tag => tag.tipo === "nacionalidad")?.valor;
                if (zone && !zones.includes(zone))
                    zones.push(zone)
            }
            return zones;
        }
    }

    return (<>
        <Header />
            <main>
                <Filters setFilters={setFilters} zones = {profiles? getZones() : ["Zona 1", "Zona 2", "Zona 3"]}/>
                <ArticleList quality="Disponibles" articles={availableProfiles} />
                <ArticleList quality="No Disponibles" articles={unAvailableProfiles} />
            </main>
        <Footer />
    </>)
}