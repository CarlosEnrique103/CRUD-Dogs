/** Buttons */
const btn_open_modal_header = document.getElementById('btn-modal-header');
const btn_open_modal_main = document.getElementById('btn-modal-main');
const btn_close_modal = document.getElementById('close-btn');
const btn_generate_img= document.querySelector('.btn-modal-generate');
const btn_accept = document.querySelector('input[type=submit]');
const btn_cancel = document.querySelector('input[type=reset]');

/** Input*/
const form= document.getElementById('form-dog');
const inputName =  document.getElementById('nombre');
const inputRace =  document.getElementById('raza');
const inputAbout =  document.getElementById('about');
const img_modal = document.querySelector('.img-modal')


/** Conteiner Article*/
const containterDogs = document.getElementById('dogs');

/** Modal Overlay */
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');


//Creación de card de objetos del localstorage
let dogs= JSON.parse(localStorage.getItem('dogs'));
if(dogs){
    dogs.forEach(dog=>{
        createCard(dog);
    })
}


//MODAL EVENTS
btn_open_modal_header.addEventListener('click', function(){
    openModal();

})
btn_open_modal_main.addEventListener('click', function(){
    openModal();

})

btn_close_modal.addEventListener('click', function(){
    closeModal();
});

btn_cancel.addEventListener('click', function(){
    closeModal();
});

overlay.addEventListener('click', function(){
    closeModal();
});

function closeModal() { 
    overlay.classList.remove('is-visible');
    modal.classList.remove('is-visible');
    img_modal.src='./src/assets/images/logo.png';
}

function openModal() {
    overlay.classList.add('is-visible');
    modal.classList.add('is-visible');
    generate_image(img_modal);
}

//Generar imagen en modal
function generate_image(img_modal){
    btn_generate_img.addEventListener('click', function(e){
        e.preventDefault();
        //LLamada da la api de DOG CEO
        btn_generate_img.innerHTML='Cargando...';
        fetch('https://dog.ceo/api/breeds/image/random')
        .then(response=>response.json())
        .then((img) => {
            img_modal.src = img.message; 
            setTimeout(function(){
                btn_generate_img.innerHTML= 'Generar Fotografía';
            },2000)
        }); 
    });

}
/** MANEJANDO EL LOCALSTORAGE */

//Añadir un perro al localStorage
function setDog(dog){
    if(dog.id > 1){
        let dogs = JSON.parse(localStorage.getItem('dogs'));
        dogs.push(dog);
        localStorage.setItem('dogs', JSON.stringify(dogs));
    }else{
        let dogs= [dog];
        localStorage.setItem('dogs', JSON.stringify(dogs));
    }
}

function deleteDog(id){
    let dogs = JSON.parse(localStorage.getItem('dogs'));
    dogs = dogs.filter(dog=>dog.id!==id);
    localStorage.setItem('dogs', JSON.stringify(dogs));
};

function updateDog(id){
        let dogs = JSON.parse(localStorage.getItem('dogs'));
        dogs.forEach(dog => {
            if(dog.id==id){
                dog.name=inputName.value;
                dog.race=inputRace.value;
                dog.about=inputAbout.value;
                dog.photo=img_modal.src;
            }
        })
        localStorage.setItem('dogs', JSON.stringify(dogs)); 
}

//Creacion de objeto
form.addEventListener('submit', function(e){
        e.preventDefault();
        let id= JSON.parse(localStorage.getItem('dogs')) ? JSON.parse(localStorage.getItem('dogs')).length+1: 1 ;
        let dog =
            {
                id,
                name:inputName.value,
                race: inputRace.value,
                about: inputAbout.value,
                photo: img_modal.src,
            }
        setDog(dog);
        createCard(dog);
        closeModal();
        this.reset();
});

//Intecambiar position de botones de apertura de modal
function btnSwitchModal(){
    if(containterDogs.children.length>0){
        btn_open_modal_header.style.display="block";
        btn_open_modal_main.style.display="none";  
    }else{
        btn_open_modal_header.style.display="none";
        btn_open_modal_main.style.display="block";
        btn_open_modal_main.style.margin= "100px auto";
    }
}    


/** Creación de Card */
function createCard(dog){
    let {
        id,
        name,
        race,
        about,
        photo
    } = dog;
    let card = document.createElement('article');
    card.classList.add('dog-card');
    card.innerHTML= `
    <div class="dc-content">
        <div class="dc-buttons">
          <span class="btn-delete-card"> 
            <i class="fa fa-trash" aria-hidden="true"></i>
        </span>
          <span class="btn-edit-card"> 
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </span>
        </div>
        <div class="dc-img" style="background-image: url(${photo})" >
        </div>
        <div class="dc-description">
            <h2>${name}</h2>
            <h3>${race}</h3>
            <p>
              ${about}
            </p>
        </div>                
    </div>
    <div class="dc-footer">
        <img src="./src/assets/images/footprint.png" alt="">
    </div>
    `;
    card.querySelector('.btn-edit-card').addEventListener('click',function(){
        openModal();
        inputName.value = name;
        inputRace.value = race; 
        inputAbout.value = about;
        img_modal.src = photo;
        btn_accept.addEventListener('click', function(e){
            e.preventDefault();
            updateDog(id);
            closeModal();
            location.reload();
        });
    })
    card.querySelector('.btn-delete-card').addEventListener('click',function(){
        deleteDog(id);
        containterDogs.removeChild(card);
        btnSwitchModal();
    })
    containterDogs.appendChild(card);
    btnSwitchModal();
}



  