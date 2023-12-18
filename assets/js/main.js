const btnConvertir = document.querySelector('#btnConvertir');
const inputMonto = document.querySelector('#inputMonto');
const resultado = document.querySelector('#resultado');
const monedaSelector = document.querySelector('#tipoDeMoneda');
const urlApi = 'https://mindicador.cl/api/';
const ctx = document.getElementById('myChart').getContext('2d');
let myLineChart;

const getData = async () => {
    try {
        const res = await fetch(urlApi);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
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
        const data = await getData();
        if (data) {
            const conversionRate = data[selectedCurrency.toLowerCase()].valor;
            const result = inputValue / conversionRate;
            pintar(result);
        } else {
            console.error("error al hacer fecth en data");
        }
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

const prepararConfiguracionParaLaGrafica = (monedas) => {
    const tipoDeGrafica = "line";
    const nombresDeLasMonedas = Object.keys(monedas);
    const titulo = "Monedas";
    const colorDeLinea = "red";
    const valores = Object.values(monedas).map((moneda) => {
        const valor = typeof moneda.valor === 'number' ? moneda.valor : null;
        return valor;
    });
    return {
        type: tipoDeGrafica,
        data: {
            labels: nombresDeLasMonedas,
            datasets: [{
                label: titulo,
                backgroundColor: colorDeLinea,
                data: valores
            }]
        }
    };
};

const renderGrafica = async () => {
    try {
        const data = await getData();
        console.log('Data from API:', data);
        if (myLineChart) {
            myLineChart.destroy();
        }
        const config = prepararConfiguracionParaLaGrafica(data);
        ctx.canvas.style.backgroundColor = "white";
        myLineChart = new Chart(ctx, config);
    } catch (error) {
        console.error(error);
    }
};

const main = async () => {
    try {
        const data = await getData();
        const valores = Object.entries(data).map((value) => {
            if (typeof value[1] !== 'string') {
                console.log(value[1].codigo);
            }
        });
    } catch (error) {
        console.error(error);
    }
};

main();
renderGrafica();