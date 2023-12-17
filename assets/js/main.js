const btnConvertir = document.querySelector('.btn');
const inputValor = document.querySelector('input');
const cambioP = document.querySelector('p');
const urlApi = 'https://mindicador.cl/api/';


btnConvertir.addEventListener = ('click', () => {
    const inputValue = inputValor.value;
    console.log(inputValue);
})

const convertir = () => {

}

const getData = async () => {
    const res = await fetch(urlApi)
    const data = await res.json()
    console.log(data);
}

const pintar = (data) => {
 cambioP.innerHTML += `
 <p> ${data.name} <p>`
}

const main = async () => {
const valores = object.entries(data).map((value)) => {
    if (typeof value [1]) !== 'string') {
        console.log(value[1].codigo)
    }
}
}

main()