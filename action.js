let sliderIndex = 1;
let dataList = [];
let userList = [];
let bigData = [];
let currentIndexPage = 1;
let rowPerPage = 5;

async function FetchData(){
    const response = await  fetch('https://jsonplaceholder.typicode.com/albums/1/photos')
    const data = await response.json();
    dataList = data.slice(0, 10);
    bigData = data;
    console.log(dataList);
    const responseUser = await fetch('https://jsonplaceholder.typicode.com/users')
    const dataUser = await responseUser.json();
    userList = dataUser;
    console.log(userList);
}

function SelectedImg (index){
    ShowSlider( sliderIndex += index);
}

function CurrentImg (index){
    ShowSlider( sliderIndex = index);
    let i;
    let numberDot = document.getElementsByClassName('dot');
    if(index > dataList.length){
        sliderIndex = 1;
    }
    if(index < 1) {
        sliderIndex = dataList.length;
    }
    
    for ( i = 0; i < numberDot.length; i++) {
        numberDot[i].className = numberDot[i].className.replace(" active-dot", "");
    }
    
    document.getElementById("imgCurrent").src = dataList[sliderIndex - 1].url;
    if(dataList.length > 0){
        numberDot[sliderIndex - 1].className += " active-dot";
    }
}

function ShowSlider (index){
    let i;
    let numberDot = document.getElementsByClassName('dot');
    let numberThumnail = document.getElementsByClassName('thumnail-item');
    let currentUser = document.getElementById('photographer-name');
    let currentLink = document.getElementById('link-descript');
    let currentLocation = document.getElementById('location-name');
    if(index > dataList.length){
        sliderIndex = 1;
    }
    if(index < 1) {
        sliderIndex = dataList.length;
    }
    
    for ( i = 0; i < numberDot.length; i++) {
        numberDot[i].className = numberDot[i].className.replace(" active-dot", "");
    }
    for ( i = 0; i < numberThumnail.length; i++){
        numberThumnail[i].className = numberThumnail[i].className.replace(" active-thumnail-item", "");
    }
    let concatAddress = userList[sliderIndex - 1].address.street;
    // concatAddress +=  userList[sliderIndex-1].address.city;

    currentUser.innerHTML = userList[sliderIndex - 1].name;
    currentLocation.innerHTML = concatAddress.concat(" street, " ,userList[sliderIndex-1].address.city, " city");
    currentLink.href = userList[sliderIndex - 1].website;
    
    document.getElementById("imgCurrent").src = dataList[sliderIndex - 1].url;
    numberDot[sliderIndex - 1].className += " active-dot";
    numberThumnail[sliderIndex -1].className += " active-thumnail-item";
}

function CreateDot(num){
    let containerDot = document.getElementById('container-dot');
    for (let index = 0; index < num; index++) {
        let childDot = document.createElement('span');
        childDot.className = ('dot');
        containerDot.appendChild(childDot);
    }
    let numberDot = document.getElementsByClassName('dot'); 
    for (let index = 0; index < numberDot.length; index++) {
        numberDot[index].addEventListener('click', function() { CurrentImg(index + 1)});
    }
}

function CreateThumnails(num){
    let containerThumnail = document.getElementById('container-thumnail');
    for (let index = 0; index < num; index++) {
        let childThumnail = document.createElement('img');
        childThumnail.className = ('thumnail-item');
        childThumnail.src = dataList[index].thumbnailUrl;
        containerThumnail.appendChild(childThumnail);
    }
    let numberThumnail = document.getElementsByClassName('thumnail-item'); 
    for (let index = 0; index < numberThumnail.length; index++) {
        numberThumnail[index].addEventListener('click', function() { CurrentImg(index + 1)});
    }
}

function ShowCurrentPage(index){
    currentIndexPage = parseInt(index);
    RefreshPagi();
}

function HandlerNext (){
    let sumPage = Math.ceil(bigData.length/ rowPerPage);
    currentIndexPage ++;
    if(currentIndexPage > sumPage){
        currentIndexPage = 1
    }
    RefreshPagi()
}

function HandlerPrev (){
    let sumPage = Math.ceil(bigData.length/ rowPerPage);
    currentIndexPage --;
    if(currentIndexPage < 1){
        currentIndexPage = sumPage
    }
    RefreshPagi()
}

//reset active pagination
function RefreshPagi(){
    HandlerBarFuc();
    let numberPagi = document.getElementsByClassName("pagi-item");
    for (let i = 0; i < numberPagi.length; i++) {
        numberPagi[i].className = numberPagi[i].className.replace(" active-pagi-item", "");
    }
    for (let x = 0; x < numberPagi.length; x++) {
        if(x == (currentIndexPage - 1)){
            numberPagi[x].className += (" active-pagi-item");
        }
    }
}

function ChangeRowsPerPage(){
    let selectedItem = document.getElementById('rowsPerPage');
    rowPerPage = selectedItem.value;
    HandlerBarFuc();
    CreatePagination(); 
}

function CreatePagination (){
    //pagination
    let sourcePagi = document.getElementById('container-pagination');
    sourcePagi.innerHTML = '';
    let prevBtn = document.createElement('div');
    prevBtn.className = "pagi-item-prev";
    prevBtn.innerHTML = "Prev";
    prevBtn.addEventListener('click', function(){
        HandlerPrev();
    })
    sourcePagi.appendChild(prevBtn);
    let sumPage = Math.ceil(bigData.length/ rowPerPage);
    console.log(sumPage);
    for (let index = 0; index < sumPage; index++) {
        let currentBtn = document.createElement('div');
        currentBtn.className = "pagi-item";
        if(index == 0){
            currentBtn.className += " active-pagi-item";
        }
        currentBtn.innerHTML = index + 1;
        sourcePagi.appendChild(currentBtn);
    }
    let numberPagi = document.getElementsByClassName('pagi-item'); 
    for (let index = 0; index < numberPagi.length; index++) {
        numberPagi[index].addEventListener('click', function() { ShowCurrentPage(index + 1)});
    }
    
    let nextBtn = document.createElement("div");
    nextBtn.className = "pagi-item-next";
    nextBtn.innerHTML = "Next";
    nextBtn.addEventListener('click', function(){
        HandlerNext();
    })
    sourcePagi.appendChild(nextBtn);
}

function HanlerPagiSlider(arr, item_per_page, current_page){
    return arr.slice((current_page - 1)*item_per_page, current_page * item_per_page);
}

function HandlerBarFuc(){
    let source = document.getElementById('small-template').innerHTML;
    let template = Handlebars.compile(source);
    let render = template({big_data: HanlerPagiSlider(bigData, rowPerPage, currentIndexPage)});
    $("#container-table").html(render);
    
}

async function InitCall(){
    await FetchData();
    CreateDot(dataList.length);
    CreateThumnails(dataList.length);
    ShowSlider(sliderIndex);
    HandlerBarFuc();
    CreatePagination();  
}

InitCall();
