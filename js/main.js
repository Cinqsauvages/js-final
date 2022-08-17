//VARIABLES//
const cards = document.getElementById("cards");
const targeta = document.querySelector("#template").content

//v-modal//
const carritoModal = document.querySelector(".carrito-modal");
const prodModal = document.querySelector("#productos-modal");
const precioFinal = document.querySelector("#precio-final");

const templateModal = document.querySelector("#carrito").content;

const finalizarCompra = document.querySelector("#finalizar");
//guarda en una memoria temporal//
const fragmento = document.createDocumentFragment();


//carrito abrir-cerrar//
let carritoIcono = document.querySelector("#iconoCarrito");
console.log(carritoIcono)

//abrir MODAL con icono//
carritoIcono.addEventListener("click", () => {
    carritoModal.classList.contains("open") ? carritoModal.classList.remove("open") : carritoModal.classList.add("open");
});

//cerrar con X MODAL//
const cerrarModal = document.querySelector("#cerrar-modal");
console.log(cerrarModal);

cerrarModal.addEventListener("click", () => {
    carritoModal.classList.remove(".open");
});

//PRODUCTOS SELECCIONADOS//
let carrito = {};


//funciones-eventos//
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        crearCarrito();
    }
});

//recolectar datos desde el json//
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()

        datosCards(data);

    } catch (error) {
        console.log(error)
    }
}

//crear targetas//
const datosCards = (data) => {

    data.forEach(producto => {
        targeta.querySelector('h2').textContent = producto.nombre;
        targeta.querySelector('h3').textContent = producto.precio;
        targeta.querySelector('.imagen-producto').setAttribute('src', producto.imagen);

        //paso id al botton//
        targeta.querySelector(".btn").dataset.id = producto.id;

        const clone = targeta.cloneNode(true);
        fragmento.appendChild(clone)
    });
    cards.appendChild(fragmento)
}

cards.addEventListener('click', e => {
    
    agregarCarrito(e);
 
})

function agregarCarrito(e) {
    if (e.target.classList.contains('btn')) {
        setCarrito(e.target.parentElement)
        Toastify({

            text: "Producto Agregado",
    
            duration: 3000,
            style: {
                background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(121,9,96,1) 34%, rgba(4,131,181,1) 91%, rgba(0,212,255,1) 100%)",
            }
    
        }).showToast();
    }
    e.stopPropagation()
}

//recibe datos para el carrito//
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn").dataset.id,
        nombre: objeto.querySelector("h2").textContent,
        precio: objeto.querySelector("h3").textContent,
        imagen: objeto.querySelector('img').textContent,
        cantidad: 1
    }
    //para acceder al objeto se pregunta si existe esa propiedad//
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }
    //spead operator creo el index con el id//
    carrito[producto.id] = { ...producto };
    console.log(carrito);
    crearCarrito();
}


//crea carrito y manda datos al storage//
const crearCarrito = () => {
    prodModal.innerHTML = '';

    Object.values(carrito).forEach(producto => {
        templateModal.querySelector('h4').textContent = producto.nombre;
        templateModal.querySelector('span').textContent = producto.precio * producto.cantidad;
        templateModal.querySelector('h5').textContent = producto.cantidad;
        templateModal.querySelector(".btn-borrar").dataset.id = producto.id;

        const clone = templateModal.cloneNode(true)
        fragmento.appendChild(clone)
    })
    prodModal.appendChild(fragmento)
    localStorage.setItem('carrito', JSON.stringify(carrito));

    //sumar cantidades y Total//
    const nCantidades = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    console.log(nCantidades);
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    console.log(nPrecio)

    precioFinal.querySelector("span").textContent = nPrecio;
}

//eliminar productos btn-carrito//
prodModal.addEventListener("click", e => {
    let boton = e.target;
    if (boton.classList.contains("btn-borrar")) {
        const cantidadP = carrito[e.target.dataset.id];
        cantidadP.cantidad--;
        carrito[e.target.dataset.id] = { ...cantidadP };
        console.log(carrito[e.target.dataset.id]);
        if (cantidadP.cantidad == 0) {
            delete carrito[e.target.dataset.id];
        }
        crearCarrito();
    }
    e.stopPropagation();
})

//finalizar compra//
finalizarCompra.addEventListener('click',limpiezaTotal);

function limpiezaTotal() {
    localStorage.clear('');
    carrito = {};
    crearCarrito();

    alertify.alert('Tu compra ha sido finalizada. Muchas Gracias!');


}
