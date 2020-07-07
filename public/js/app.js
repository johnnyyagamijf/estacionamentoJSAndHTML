
var timer = getElementById('timer');

var dateInit = new Date();
setInterval(() => {
    timer.innerHTML = new Date().toLocaleTimeString();
}, 1000);

document.addEventListener('DOMContentLoaded', function(){
    onloadCars();
});

function onloadCars() {
    var cars = getValuesToLocalStorage('pation');
    getElementById('carros-patio').innerHTML = '';

    if (cars.length > 0) {
        for (let i = 0; i < cars.length; i++) {
            addCar(cars[i])
        }
    }
}

function getDateTime() {
    return dateInit.toLocaleTimeString();
}

var btn = getElementById('btn-form');
btn.addEventListener('click', function (event) {
    event.preventDefault();
    var car = getElementById('car');
    var plate = getElementById('plate');

    if (!car.value || !plate.value) {
        showMessage('Os campos nome do veículo e placa são obrigatórios', false)
        return;
    }
    var date = getDateTime();

    var newCar = {
        car: car.value,
        plate: plate.value,
        initDate: new Date(),
        dateEnd: null,
        value: 0
    }

    var cars = getValuesToLocalStorage('pation');
    cars.push(newCar);

    // saves to storage
    setValuesToLocalStorage(cars);

    // adiciona o carro na tabela
    addCar(newCar);

    showMessage('Veículo cadastrado com sucesso!', true)

    // limpa os inputs
    car.value = '';
    plate.value = ''

    // faz o reload da lista
    onloadCars();
});

function showMessage(text, isSucess){
    var message = getElementById('message');

    message.innerHTML = setMessage(text, isSucess);

    var eventMessage = setTimeout(
        function () {
            message.innerHTML = '';
            clearInterval(eventMessage);
        }, 2000);  
}

function setMessage(text, isSucess){
    const alertType = (isSucess) ? 'alert alert-success' : 'alert alert-danger';
    return '<div class="' + alertType +'" role="alert">' +
    text +
    '</div>';
}
function addCar(data) {
    
    var cards = getElementById('carros-patio');

    const viewData = setValuesCar(data);

    cards.innerHTML += '<tr>' +
        '<td>' + data.car + '</td>' +
        '<td>' + data.plate + '</td>' +
        '<td>' +  new Date(data.initDate).toLocaleTimeString()  + '</td>' +
        '<td>' + viewData.dateEnd + '</td>' +
        '<td class="td-valor">' + viewData.value + '</td>' +
        '<td><button class="btn btn-danger" onclick="removeCar(\'' + data.plate + '\')" id="trash">Remover</button></td>' +
        '<td><button class="btn btn-success" ' + viewData.disable + 
        ' onclick="finallyTimer(\'' + data.plate + '\')" id="' + data.plate + '">' + viewData.text +'</button></td>' +
        '</tr>';
}

function finallyTimer(plate) {

    var cars = getValuesToLocalStorage('pation');

    cars.forEach(function (item) {
        if (item.plate === plate) {
            return item.dateEnd = new Date(), item.value = calcValue(calcMinutes(item.initDate, new Date()));
        }
    });

    setValuesToLocalStorage(cars);
    onloadCars();
}

function calcValue(minutes){
    const valueHour =  2.00;
    return (Math.ceil(minutes / 15) * valueHour);
}

function calcMinutes(initDate, endDate) {
    return moment(new Date().toLocaleString(), 
    "DD/MM/YYYY hh:mm")
    .diff(moment(new Date(initDate)
    .toLocaleString(), 
    "DD/MM/YYYY hh:mm"), 
    'minutes');
}

function getElementById(id){
    return document.getElementById(id)
  }

function removeCar(plate) {
    const cars = getValuesToLocalStorage('pation');
    cars.splice(
        cars.indexOf(
            cars.find(
                x => x.plate.toLowerCase() === plate.toLowerCase())), 1)

    setValuesToLocalStorage(cars);
    onloadCars();
}

function setValuesCar(data){
    let viewData = { disable :  '', dateEnd : 'Em aberto', value : '-', text :  'Finalizar'}

    if (data.dateEnd)
     {
        viewData.disable = 'disabled="false"', viewData.dateEnd = new Date(data.dateEnd).toLocaleTimeString(), viewData.text = 'Finalizado';  
     }
     
     viewData.value =  (data.value > 0) ?  data.value + ',00' : '-'

    return viewData
}

function setValuesToLocalStorage(cars){
    localStorage.setItem('pation', JSON.stringify(cars));
}

function getValuesToLocalStorage(name){
    return JSON.parse(localStorage.getItem(name))  || [];
}



