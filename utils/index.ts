import { Platform } from "react-native";
import { AssistType, AuthDataType, VideoRawType, VideoType } from "./type-def";

const htmlLoremIpsum = `
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat de Service d'Assistance Routière</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
            text-decoration: underline;
        }
        .article {
            margin-bottom: 10px;
        }
        .signature {
            margin-top: 10px;
        }
        .signature div {
            display: inline-block;
            width: 45%;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Contrat d'Assistance</h1>

    <p><strong>Entre les soussignés :</strong></p>

    <p>
        L'Entreprise  <strong>Quick Fix Solution</strong>, ci-après dénommée "le Prestataire", ayant son siège social à Abidjan, représentée par <b>HAMAN Issa</b>, en qualité de Gérant,
    </p>
    
    <p>
        <strong>Et</strong>
    </p>

    <p>
        <strong>LIFA Habib</strong>, ci-après dénommé "le Client", domicilié à Abidjan,
    </p>

    <p><strong>Il a été convenu et arrêté ce qui suit :</strong></p>

    <div class="article">
        <h2>Article 1 : Objet du contrat</h2>
        <p>
            Le présent contrat a pour objet de définir les conditions et modalités selon lesquelles le Prestataire s'engage à fournir des services d'assistance routière au Client, en cas de panne de son véhicule, via l'application <b>Quick Fix Solution</b> développée par le Prestataire.
        </p>
    </div>

    <div class="article">
        <h2>Article 2 : Obligations du Prestataire</h2>
        <p>Le Prestataire s'engage à :</p>
        <ul>
            <li>Fournir une assistance routière rapide et efficace en cas de panne signalée par le Client via l'application.</li>
            <li>Mettre à disposition un réseau de dépanneurs qualifiés et certifiés.</li>
            <li>Assurer la disponibilité de l'application et du service 24 heures sur 24 et 7 jours sur 7.</li>
            <li>Informer le Client de l'arrivée du dépanneur et du délai estimé d'intervention.</li>
            <li>Respecter les normes de sécurité et de confidentialité des données personnelles du Client.</li>
        </ul>
    </div>

    <div class="article">
        <h2>Article 3 : Obligations du Client</h2>
        <p>Le Client s'engage à :</p>
        <ul>
            <li>Utiliser l'application conformément aux termes et conditions définis par le Prestataire.</li>
            <li>Signaler précisément la nature de la panne et la localisation de son véhicule via l'application.</li>
            <li>Fournir toutes les informations nécessaires pour permettre une intervention rapide et efficace.</li>
            <li>Payer les frais d'assistance selon les modalités définies par le Prestataire.</li>
            <li>Respecter les instructions données par le dépanneur lors de l'intervention.</li>
        </ul>
    </div>

    <div class="article">
        <h2>Article 4 : Tarification et modalités de paiement</h2>
        <ul>
            <li>Le service d'assistance routière est facturé selon les tarifs en vigueur au moment de l'intervention, disponibles sur l'application.</li>
            <li>Le paiement des services doit être effectué par le Client via l'application, selon les moyens de paiement acceptés par le Prestataire (carte bancaire, virement, etc.).</li>
            <li>En cas de litige sur le montant facturé, le Client peut contacter le service client du Prestataire dans un délai de 30 jours à compter de la date de l'intervention.</li>
        </ul>
    </div>

    <div class="article">
        <h2>Article 5 : Durée, résiliation et modification du contrat</h2>
        <ul>
            <li>Le présent contrat est conclu pour une durée indéterminée à compter de la date de signature.</li>
            <li>Le Client peut résilier le contrat à tout moment avec un préavis de 30 jours, en notifiant le Prestataire par écrit.</li>
            <li>Le Prestataire peut modifier les termes et conditions du contrat, sous réserve d'en informer le Client par écrit au moins 30 jours avant l'entrée en vigueur des modifications.</li>
            <li>En cas de manquement grave aux obligations contractuelles par l'une ou l'autre des parties, le contrat peut être résilié de plein droit, sans préavis ni indemnité.</li>
        </ul>
    </div>

    <p><strong>Fait à [Lieu], le [Date]</strong></p>

    <div class="signature">
        <div>
            <p><strong>Pour le Prestataire :</strong></p>
            <p>[Nom du représentant légal]</p>
            <p>[Titre du représentant légal]</p>
        </div>
        <div>
            <p><strong>Pour le Client :</strong></p>
            <p>[Nom du Client]</p>
        </div>
    </div>
</body>
</html>

    `


    const generateBoxShadowStyle = (
        xOffset: number,
        yOffset: number,
        shadowColorIos: string,
        shadowOpacity: number,
        shadowRadius: number,
        elevation: number,
        shadowColorAndroid: string,
      ) => {
        if (Platform.OS === 'ios') {
          return {
            shadowColor: shadowColorIos,
            shadowOffset: {width: xOffset, height: yOffset},
            shadowOpacity,
            shadowRadius,
          };
        } else if (Platform.OS === 'android') {
          return {
            elevation,
            shadowColor: shadowColorAndroid,
          };
        }
      };

export {
    htmlLoremIpsum,
    generateBoxShadowStyle
}

export default function version() {
    return '1.0.0'
}

export function accountNotCompleted(authData: AuthDataType): boolean {
    return authData?.phone == null || authData?.phone === undefined
}

export function _selectDays(lang: 'fr' | 'en'): any {
    const data = {
        fr: [
            {key: '1', value: 'Lundi',},
            {key: '2', value: 'Mardi',},
            {key: '3', value: 'Mercredi',},
            {key: '4', value: 'Jeudi',},
            {key: '5', value: 'Vendredi',},
            {key: '6', value: 'Samedi',},
        ],

        en: [
            {key: '1', value: 'Monday',},
            {key: '2', value: 'Tuesday',},
            {key: '3', value: 'Wednesday',},
            {key: '4', value: 'Thursday',},
            {key: '5', value: 'Friday',},
            {key: '6', value: 'Saturday',},
        ],
    }

    return data[lang]
}

export const icons = {
    play: require('../assets/images/videos/play.png'),
    logo: require('../assets/images/logo.png'),
    podometre: require('../assets/images/podometre.png'),
}