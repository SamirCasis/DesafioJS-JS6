const btnConvertir = document.querySelector('#btnConvertir');
const inputMonto = document.querySelector('#inputMonto');
const resultado = document.querySelector('#resultado');
const monedaSelector = document.querySelector('#tipoDeMoneda');
const urlApi = 'https://mindicador.cl/api/';
const ctx = document.getElementById('myChart').getContext('2d');
let myLineChart;

const getData = async () => {
    const res = await fetch(urlApi);
    const data = await res.json();
    return data;
};

btnConvertir.addEventListener('click', () => {
    const inputValue = inputMonto.value;
    const selectedCurrency = monedaSelector.value;
    convertir(inputValue, selectedCurrency);
});

const convertir = async (inputValue, selectedCurrency) => {
    try {
        const data = await getData();
        const conversionRate = data[selectedCurrency.toLowerCase()].valor;
        const result = inputValue / conversionRate;
        pintar(result);
        await renderGrafica(selectedCurrency);
    } catch (error) {
        console.error(error);
    }
};

const pintar = (result) => {
    resultado.innerHTML = `Resultado: ${result.toFixed(2)}`;
};

monedaSelector.addEventListener('change', () => {
    const selectedCurrency = monedaSelector.value;
    renderGrafica(selectedCurrency);
});

const getAndCreateDataToChart = (data, selectedCurrency) => {
    const labels = [];
    const values = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const indicator in data) {
        const currencyData = data[indicator][selectedCurrency.toLowerCase()];
        if (currencyData) {
            const fecha = new Date(currencyData.fecha);
            if (fecha >= today) {
                labels.push(currencyData.fecha.split(' ')[0]);
                values.push(parseFloat(currencyData.valor.replace(',', '')));
            }
        }
    }

    return {
        labels,
        datasets: [
            {
                label: selectedCurrency,
                borderColor: 'rgb(255, 99, 132)',
                data: values,
            },
        ],
    };
};

const renderGrafica = async (selectedCurrency) => {
    try {
        const data = await getData();
        console.log('Data from API:', data);
        if (myLineChart) {
            myLineChart.destroy();
        }

        const config = {
            type: 'line',
            data: getAndCreateDataToChart(data, selectedCurrency),
        };

        const myChartCanvas = document.getElementById('myChart').getContext('2d');
        myLineChart = new Chart(myChartCanvas, config);
    } catch (error) {
        console.error(error);
    }
};

renderGrafica(monedaSelector.value);