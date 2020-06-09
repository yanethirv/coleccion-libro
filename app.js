//DEFINICIÓN DE LAS CLASES
class Libro {
  constructor(titulo, autor, isbn) {
    this.titulo = titulo,
      this.autor = autor,
      this.isbn = isbn
  }
}

class UI {
  static mostrarLibros() {
    const libros = Datos.traerLibros();
    libros.forEach((libro) => UI.agregarLibroLista(libro));
  }
  static agregarLibroLista(libro) {
    const lista = document.querySelector('#libro-list');

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    lista.appendChild(fila);
  }
  static eliminarLibro(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }
  static mostrarAlerta(mensaje, className) {
    const div = document.createElement('div'); //CREAMOS UN ELEMENTO TIPO DIV
    div.className = `alert alert-${className}`; //AGREGAMOS LA CLASE DANGER AL DIV
    div.appendChild(document.createTextNode(mensaje)); //AGREGAMOS EL MENSAJE AL NODO HIJO

    const container = document.querySelector('.container'); //SELECCIONAMOS EL ELEMENTO CON LA CLASE CONTAINER
    const form = document.querySelector('#libro-form'); //SELECCIONAMOS EL ELEMENTO CON EL ID libro-form
    container.insertBefore(div, form); //INSERTAMOS EN EL CONTAINER EL ELEMENTO DIV ANTES DEL ELEMENTO FORM

    setTimeout(() => document.querySelector('.alert').remove(), 3000);//REMOVEMOS EL DIV CON LA CLASE ALERT A LOS 3 SEGUNDOS
  }
  static limpiarCampos() {
    document.querySelector('#titulo').value = '';
    document.querySelector('#autor').value = '';
    document.querySelector('#isbn').value = '';
  }
}

class Datos {
  static traerLibros() {
    let libros;
    if (localStorage.getItem('libros') === null) {
      libros = [];
    } else {
      libros = JSON.parse(localStorage.getItem('libros'));
    }
    return libros;
  }
  static agregarLibro(libro) {
    const libros = Datos.traerLibros(); //LLAMAMOS A LA FUNCIÓN PARA OBTENER UN ARREGLO CON LOS LIBROS, SI NO EXISTEN ENVIA UN ARREGLO VACÍO
    libros.push(libro); //AGREGAMOS EL LIBRO AL ARREGLO DE LIBROS
    localStorage.setItem('libros', JSON.stringify(libros));
  }
  static removerLibro(isbn) {
    const libros = Datos.traerLibros();

    libros.forEach((libro, index) => {
      if (libro.isbn === isbn) {
        libros.splice(index, 1);
      }
    });
    localStorage.setItem('libros', JSON.stringify(libros));
  }
}

//CARGA DE LA PÁGINA
document.addEventListener('DOMContentLoaded', UI.mostrarLibros()); //CUANDO SE CARGA LA PÁGINA SE LLAMA AL METODO MOSTRA LIBROS

//CONTROLAR EL EVENTO SUBMIT
document.querySelector('#libro-form').addEventListener('submit', (e) => {
  e.preventDefault();

  //OBTENEMOS LOS VALORES DE LOS CAMPOS DEL FORMULARIO
  const titulo = document.querySelector('#titulo').value;
  const autor = document.querySelector('#autor').value;
  const isbn = document.querySelector('#isbn').value;

  //VALIDAMOS LOS CAMPOS
  if (titulo === '' || autor === '' || isbn === '') {
    UI.mostrarAlerta('Por favor ingresar todos los campos', 'danger');
  } else {
    const libro = new Libro(titulo, autor, isbn);
    Datos.agregarLibro(libro);
    UI.agregarLibroLista(libro);
    UI.mostrarAlerta('Libro agregado', 'success');
    UI.limpiarCampos();
  }
});

//MANEJO EVENTO CLICK PARA ELIMINAR UN LIBRO
document.querySelector('#libro-list').addEventListener('click', (e) => {
  UI.eliminarLibro(e.target);
  Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
  UI.mostrarAlerta('Libro Eliminado', 'success');
});
