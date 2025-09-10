/*import VirtualSelect from 'virtual-select'
import axios from 'axios'

function customVirtualSelect (eltId, url) {

    const performAjaxRequest = async () => {

        const selectElement = document.getElementById(eltId);
        const selectedValue = selectElement.value;

        try {
            const response = await axios.get(`${url}?text=${selectedValue}`);
            const data = response.data;
            // Utilisez les données reçues pour mettre à jour votre interface utilisateur ou effectuer d'autres actions
        } catch (error) {
            console.error('Erreur lors de la requête AJAX :', error);
        }
    };

    const select = new VirtualSelect({
        element: `#${eltId}`,
        onChange: performAjaxRequest
    });
}

export default customVirtualSelect*/
