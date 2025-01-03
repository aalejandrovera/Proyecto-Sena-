
if(document.getElementById("tabla-productos")) {
    obtenerProductos();
}

function obtenerProductos() {
    fetch('http://localhost:8080/app/productos/getProductos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text()) // Leer la respuesta como texto
        .then(text => {
            try {
                // Intentar parsear el texto como JSON
                const result = JSON.parse(text);
                if (Array.isArray(result) && result.length > 0) {
                    setTimeout(() => {
                        llenarTablaProductos(result);
                    }, 2000);
                } else {
                    showAlertModal(result, 'danger', "Producto", true);
                }
            } catch (error) {
                showAlertModal(text, 'danger', "Producto", true);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            console.log('Error al obtener productos');
        });
}


function llenarTablaProductos(productos) {

    let texto = "";

    let odd = false;

    let tlpobj = null;

    productos.forEach((value) => {
        if (odd) { odd = false; clase_par = "par"; }
        else { odd = true; clase_par = "impar"; }

        texto += `<tr data-id="${value.id}">
            <td class="${clase_par}" contenteditable="true" data-cod_barras="">${value.cod_barras}</td>
            <td class="${clase_par}" contenteditable="true" data-nombre="">${value.nombre}</td>
            <td class="${clase_par}" data-unidad_medida="">
                <input list="unidades" name="unidades" id="unidades_input" placeholder="Unidad Medida" 
                    value="${value.unidad_medida}" onkeydown="evitarTeclas(this, event);" autocomplete="off" >
                <datalist id="unidades">
                  <option value="Unidades">
                  <option value="Kilos">
                  <option value="Gramos">
                  <option value="Litros">
                  <option value="Metros">
                  <option value="Centimetros">
                </datalist>
            </td>
            <td class="${clase_par}" contenteditable="true" data-precio="">${value.precio}</td>
            <td class="${clase_par}" data-fecha_vencimiento="">${value.fecha_vencimiento}</td>
            <td class="${clase_par}" data-imagen_url="">
                <input type="file" class="input-imagen" id="input-imagen-${value.id}" onchange="subirImagenMod(${value.id}, this.files[0]);" accept="image/png, image/jpeg, image/jpg, image/gif">
                <label class="btn-subir" for="input-imagen-${value.id}" data-tooltip="">
                    Subir imagen
                </label>
                <script> 
                    tlpobj = document.getElementById("input-imagen-${value.id}");
                    actualizarTooltip('${value.imagen_url}', tlpobj.nextElementSibling);
                </script>
                ${value.imagen_url ? `<img id="myImg" src="${value.imagen_url}" alt="" onclick="modal(this)">` : ""}
            </td>
            <td class='able-action-buttons ${clase_par}'>
                <button class='btn btn-warning btn-sm' title='Modificar' onclick='modificarProducto(${value.id})'>
                    <i class='bi bi-pencil-square'></i>
                </button>
                <button class='btn btn-danger btn-sm' title='Eliminar' onclick='eliminarProducto(${value.id})'>
                    <i class='bi bi-trash-fill'></i>
                </button>
            </td>
        </tr>`;
    });

    $("#tabla-productos tbody").html(texto);
}


function actualizarTooltip(input, label) {
    if (label) {
        label.dataset.tooltip = input;
    } else {
        label.dataset.tooltip = "Subir imagen";
    }
}
function modal(img) {

    var modal = document.getElementById("modalImage");
    var modalImg = document.getElementById("imagen-modal");
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }
}

function subirImagenMod(id, file){
    const formData  = new FormData();

    formData.append("imagen", file);

    fetch('http://localhost:8080/app/productos/subir-imagen/'+id, {
        method: 'POST',
        body:formData
    })
        .then(response => response.text())
        .then(result => {
            showAlertModal("Imagen modificada correctamente", 'success', "Productos", true);
            console.log(result);

            setTimeout(function() {
                loadContent('modulos/productos.html');

                // const backdrop = document.querySelector('.modal-backdrop');

            }, 2000); // 3000 milisegundos = 3 segundos
        })
        .catch(error =>
        {
            console.error('Error:', error);
            console.log('Error al modificar la imagen');
        });
}