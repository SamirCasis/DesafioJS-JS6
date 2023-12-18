const btnConvertir = document.querySelector('#btnConvertir');
const inputMonto = document.querySelector('#inputMonto');
const resultado = document.querySelector('#resultado');
const monedaSelector = document.querySelector('#tipoDeMoneda');
const urlApi = 'https://mindicador.cl/api/';
const ctx = document.getElementById('myChart').getContext('2d');
let myLineChart;

const getData = async (moneda) => {
    const year = new Date().getFullYear();
    const endpoint = `${urlApi}${moneda}/${year}`;

    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Error al obtener datos de la API: ${res.status}`);
        return await res.json();
    } catch (error) {
        handleApiError(error);
        return null;
    }
};

btnConvertir.addEventListener('click', () => {
    const inputValue = inputMonto.value;
    const selectedCurrency = monedaSelector.value;
    convertir(inputValue, selectedCurrency);
});

const convertir = async (inputValue, selectedCurrency) => {
    try {
        const data = await getData(selectedCurrency.toLowerCase());
        if (data && data.serie) {
            const conversionRate = data.serie[0].valor;
            const result = inputValue / conversionRate;
            pintar(result);
        }
    } catch (error) {
        console.error('Error en convertir:', error);
    }
};

const pintar = (result) => {
    resultado.innerHTML = `Resultado: ${result.toFixed(2)}`;
};

monedaSelector.addEventListener('change', () => {
    const selectedCurrency = monedaSelector.value;
    renderGrafica(selectedCurrency);
});

const prepararConfiguracionParaLaGrafica = (datos) => {
    const tipoDeGrafica = 'line';
    const fechas = datos.serie.slice(-10).map(item => new Date(item.fecha).toLocaleDateString());
    const valores = datos.serie.slice(-10).map(item => item.valor);

    return {
        type: tipoDeGrafica,
        data: {
            labels: fechas,
            datasets: [{
                label: `Valor ${datos.codigo.toUpperCase()}`,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgb(0, 123, 255)',
                data: valores
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };
};

const renderGrafica = async (moneda) => {
    try {
        const data = await getData(moneda.toLowerCase());
        if (data && data.serie) {
            if (myLineChart) myLineChart.destroy();
            const config = prepararConfiguracionParaLaGrafica(data);
            myLineChart = new Chart(ctx, config);
        }
    } catch (error) {
        console.error('Error en renderGrafica:', error);
    }
};

window.onload = () => renderGrafica(monedaSelector.value);