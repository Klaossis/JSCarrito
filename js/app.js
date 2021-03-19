// Variables
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners(){
    // Muestra los cursos de localstorage cuando carga el documento
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    } )

    // Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener("click", eliminarCurso);

    //Vaciar todos los cursos
    vaciarCarrito.addEventListener("click",() =>{
        articulosCarrito = []; // Reseteamos el arreglo
        limpiarHTML(); // Limpiamos todo el html
    });
}


// Funciones
function agregarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains("agregar-carrito")){
        const cursoSelecionado = e.target.parentElement.parentElement;
        //console.log("Agregando al carrito");
        leerDatosCurso(cursoSelecionado);
    }

    // console.log("Presionando en cursos.");
    //console.log(e.target.classList); Se utiliza para saber si a lo que cliqueamos tiene una clase
    //y asi poder usar la exclusion con e.target.clasList.contains
}


// Eliminar un curso del carrito
function eliminarCurso(e){
    if(e.target.classList.contains("borrar-curso")){
        const cursoid = e.target.getAttribute("data-id");

        //Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoid)

        // console.log(articulosCarrito)
        carritoHTML(); // Volvemos a iterar sobre el carrito y mostrar su HTML
    }
}


// Lee el contenido del HTML al que le dimos click y extraer la informacion del curso
function leerDatosCurso(curso){

    //Crear un objeto con la informacion del curso selecionado.
    const infoCurso = {
        imagen: curso.querySelector(".imagen-curso").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    let existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe){
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad ++;
                return curso; // Rentorna el objeto actualizado
            }else{
                return curso; // Renorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos]; // Funciona sin esto, pero nose porque, no deberia.
    }else{
        //Agrega elementos al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    // console.log(articulosCarrito);
    carritoHTML();
}


// Muestra el Carrito de compras en el HTML
function carritoHTML(){

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>
            <img src="${imagen}" width="150">
        </td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${id}" > X </a>
        </td>
        `;
      
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row); 
    });

    // Agregar el carrito de compras al storage
    sincronizarStorage();

}

function sincronizarStorage(){
    localStorage.setItem( "carrito", JSON.stringify(articulosCarrito) );
}

// Elimina los cursos del tbody
function limpiarHTML(){
    // Forma lenta
    // contenedorCarrito.innerHTML = "";

    // Forma rapida
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
} 