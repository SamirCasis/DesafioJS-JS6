const btnConvertir = document.getElementById('btnConvertir');
const inputMonto = document.getElementById('inputAmount');
const resultElement = document.getElementById('result');
const currencySelector = document.getElementById('tipodemoneda');
const urlApi = 'https://mindicador.cl/api/';


const ctx = document.getElementById('myChart').getContext('2d');
let myLineChart;

const actualizarChart = (chartData) => {
    if (myLineChart) {
        myLineChart.destroy();
    }

    myLineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
    });
};

btnConvertir.addEventListener('click', () => {
    const inputValue = inputMonto.value;
    const selectedCurrency = currenrcySelecto.value;
    convertir(inputValue, selectedCurrency);
});

const convertir = async (inputValue, selectedCurrency) => {
    try {
        const data = await getData();
        const conversionRate = data[selectedCurrency.toLowerCase()].valor;
        const result = inputValue / conversionRate;
        pintar(result);


        actualizarChart({
            labels: Utils.days({ count: 10 }),
            datasets: [{
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, result],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }],
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

const getData = async () => {
    const res = await fetch(urlApi);
    const data = await res.json();
    return data;
};

const main = async () => {
    try {
        const data = await getData();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

const pintar = (result) => {
    resultElement.textContent = `Resultado: ${result.toFixed(2)}`;
};

main();