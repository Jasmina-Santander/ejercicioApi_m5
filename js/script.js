const contenido = document.querySelector("#contenido"); // para imprimir las tarjetas
const favoritoContenido = document.querySelector("#favoritos"); // para imprimir los favoritos
const verFavoritos = document.getElementById("btn-favoritos"); // para ocultar o mostrar Boton Ver favoritos
const quitarTodos = document.getElementById("btn-quitar"); // para ocultar o mostrar Boton Quitar todos

verFavoritos.style.display = "none"; // para ocultar o mostrar Boton Ver favoritos
quitarTodos.style.display = "none"; // para ocultar o mostrar Boton Quitar todos

//Traer elementos
async function traer() {
    try {
            const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts");
            const data = await respuesta.json();
            tabla(data);
            arreglo = data;
    } catch (error) { console.log(error); }
}

const tabla = (data) => { 
    contenido.innerHTML = "";
    data.forEach(elemento => {
    if (elemento.id <= 20)
        contenido.innerHTML += 
            `<div class="col-12 col-sm-6 col-md-12 p-3">
                  <div class="card text-white bg-dark mb-3">
                      <h3 class="card__title p-3">${elemento.title}</h3>
                      <!--img class="card__img  px-5" src="${elemento.imagen}" alt="Celulares"-->  
                      <div class="card-body">
                          <p class="card__text">${elemento.body}</p>
                          <button type="button" class="btn btn-primary btn-sm " onclick ="favoritos('+',${elemento.id})">Agregar Favorito</button>
                          <button type="button" class=" btn btn-secondary btn-sm " data-toggle="modal" data-target="#exampleModal" onclick="cargarModal(${elemento.id})">Descripción</button>
                      </div>
                  </div>
            </div>`;
    });
};

const promise = new Promise(resolve => setTimeout(() => resolve("Información enviada"), 3000));
const mensajePromesa = async () => {
    const result = await promise;
    console.log(result);
};
mensajePromesa();

// Filtro de busqueda
let arreglo = [];
const buscarProducto = document.getElementById("buscar");

const buscar = () => {
    buscarProducto.value = buscarProducto.value.replace(/[0-9]/g, "");
    contenido.innerHTML = "";
    let filtrarProductos = arreglo.filter(producto => producto.title.toLowerCase().includes(buscarProducto.value.toLowerCase()));
    if (filtrarProductos.length != 0) { filtrarProductos.map(elemento => contenido.innerHTML += 
        `<div class="col-12 col-sm-6 col-md-12 p-3">
              <div class="card text-white bg-dark mb-3">
                  <h3 class="card__title p-3">${elemento.title}</h3>
                  <!--img class="card__img  px-5" src="${elemento.imagen}" alt="Celulares"-->
                  <div class="card-body">
                      <p class="card__text">${elemento.body}</p>
                      <button type="button" class=" btn btn-primary btn-sm" onclick ="favoritos('+',${elemento.id})">Agregar Favorito</button>
                      <button type="button" class=" btn btn-secondary btn-sm " data-toggle="modal" data-target="#exampleModal" onclick="cargarModal(${elemento.id})">Descripcion</button>
          
                  </div>
              </div>
          </div>`
      );
    } else {
          buscarProducto.value = "";
          setTimeout(() => { alert("Sin coincidencias, realice nueva busqueda..."); }, 1);
          setTimeout(() => { buscarProducto.value = ""; buscar(); }, 2500);
    }
};

//  Funcion agregar o quitar, uno o todos los Favoritos. Se puede agregar solo una vez cada card a Favoritos.
let favorito = [];
const favoritos = (param, id) => {
    favoritoContenido.innerHTML = "";
    if (param === "+") {
        let agregar = arreglo.find(elemento => elemento.id === id);
        if (favorito.find(elemento => elemento.id === id)) {} 
        else favorito.push(agregar);
    } else if (param === "-") {
        let quitar = favorito.findIndex(elemento => elemento.id === id);
        favorito.splice(quitar, 1);
    } else favorito = [];

    document.querySelector(".total-count").innerHTML = favorito.length;
    favorito.forEach(elemento => favoritoContenido.innerHTML += 
        `<div class="col-12 ">
            <div class="card m-3">
                <h3 class="card__title p-3">${elemento.title}</h3>
                <!--img class="card__img  px-5" src="${elemento.imagen}" alt="Celulares"-->
                <div class="card-body">
                    <p class="card__text">${elemento.body}</p>
                    <button class="card__btn btn-warning btn-sm" onclick ="favoritos('-',${elemento.id})" >Quitar de Favoritos</button>
                </div>
            </div>
        </div>`
    );
    if (favorito.length === 0) {
      verFavoritos.style.display = "none";
      quitarTodos.style.display = "none";
    } else {
      verFavoritos.style.display = "block";
      quitarTodos.style.display = "block";
    }
};

// Modal Content
const cargarModal = async (id) => {
    try {   const respuestaId = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const datos = await respuestaId.json();
            document.querySelector("#exampleModalLabel").innerHTML=datos.title;
            document.querySelector("#datosbody").innerHTML=datos.body;
        } 
    catch (error) { console.log(error); }
}

// Loading
document.getElementById("sectionProducts").style.display = "none";
chargeLoader.show();
setTimeout(() => {
  chargeLoader.hide();
  traer();
  document.getElementById("sectionProducts").style.display = "block";
}, 2000);
