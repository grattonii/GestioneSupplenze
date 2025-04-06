import {useState} from 'react';
import Navbar from "../components/Navbar2.jsx";
import AssenzeTabella from '../components/AssenzeTable.jsx';

function GestioneAssenze () {
    const [supplenze, setSupplenze] = useState([]);

    return (
        <>
            <Navbar />
            <h1 className="title">Richieste Assenze</h1>
            <h3 className="spiegazione">Gestisci le richieste di assenza dei docenti</h3>
            <AssenzeTabella rows={supplenze}/>
        </>
    );
};

export default GestioneAssenze;