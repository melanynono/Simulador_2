
let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let clienteCredito = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

//Para recuperar o mostrar información usar los métodos de la clase utilitarios, puede agregar métodos adicionales en utilitarios

function ocultarSecciones() {
    document.getElementById("parametros").classList.remove("activa");
    document.getElementById("clientes").classList.remove("activa");
    document.getElementById("creditos").classList.remove("activa");
}

function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
    let tasa = recuperarFloat("tasaInteres");

    if (tasa >= 10 && tasa <= 20) {
        tasaInteres = tasa;
        mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasa + "%");
    } else {
        mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
    }
}

function guardarCliente() {
    let cedula = recuperaraTexto("cedula");
    let nombre = recuperaraTexto("nombre");
    let apellido = recuperaraTexto("apellido");
    let ingresos = recuperarFloat("ingresos");
    let egresos = recuperarFloat("egresos");

  if (clienteSeleccionado == null) {
    let cliente = {
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        ingresos: ingresos,
        egresos: egresos
    };

    clientes.push(cliente);
  } else {
        clienteSeleccionado.nombre = nombre;
        clienteSeleccionado.apellido = apellido;
        clienteSeleccionado.ingresos = ingresos;
        clienteSeleccionado.egresos = egresos;

        clienteSeleccionado = null;
    }

    pintarClientes();
    limpiar();
}

function pintarClientes() {
    let contenido = "";

    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i];

        contenido += "<tr>";
        contenido += "<td>" + cliente.cedula + "</td>";
        contenido += "<td>" + cliente.nombre + "</td>";
        contenido += "<td>" + cliente.apellido + "</td>";
        contenido += "<td>" + cliente.ingresos + "</td>";
        contenido += "<td>" + cliente.egresos + "</td>";
        contenido += "<td><button onclick=\"seleccionarCliente('" + cliente.cedula + "')\">Actualizar</button></td>";
        contenido += "</tr>";
    }

    document.getElementById("tablaClientes").innerHTML = contenido;
}

function buscarCliente(cedula) {
    for (let i = 0; i < clientes.length; i++) {
        if (clientes[i].cedula == cedula) {
            return clientes[i];
        }
    }

    return null;
}

function seleccionarCliente(cedula) {
    clienteSeleccionado = buscarCliente(cedula);

    mostrarTextoEnCaja("cedula", clienteSeleccionado.cedula);
    mostrarTextoEnCaja("nombre", clienteSeleccionado.nombre);
    mostrarTextoEnCaja("apellido", clienteSeleccionado.apellido);
    mostrarTextoEnCaja("ingresos", clienteSeleccionado.ingresos);
    mostrarTextoEnCaja("egresos", clienteSeleccionado.egresos);

}

function limpiar() {
    mostrarTextoEnCaja("cedula", "");
    mostrarTextoEnCaja("nombre", "");
    mostrarTextoEnCaja("apellido", "");
    mostrarTextoEnCaja("ingresos", "");
    mostrarTextoEnCaja("egresos", "");

}

function buscarClienteCredito() {
    let cedula = recuperaraTexto("buscarCedulaCredito");

    let cliente = buscarCliente(cedula);

    if (cliente != null) {
        clienteCredito = cliente;
        let contenido = "";

        contenido += "<h3>Datos del Cliente</h3>";
        contenido += "<p><strong>Cédula:</strong> " + cliente.cedula + "</p>";
        contenido += "<p><strong>Nombre:</strong> " + cliente.nombre + "</p>";
        contenido += "<p><strong>Apellido:</strong> " + cliente.apellido + "</p>";
        contenido += "<p><strong>Ingresos:</strong> " + cliente.ingresos + "</p>";
        contenido += "<p><strong>Egresos:</strong> " + cliente.egresos + "</p>";

        document.getElementById("datosClienteCredito").innerHTML = contenido;
    } else {
        clienteCredito = null;
        document.getElementById("datosClienteCredito").innerHTML =
            "<p>Cliente no encontrado.</p>";
    }
}

function calcularCredito() {

    if (clienteCredito == null) {
        document.getElementById("resultadoCredito").innerHTML =
            "Primero debe buscar un cliente.";
        return;
    }

    let monto = recuperarFloat("montoCredito");
    let plazo = recuperarInt("plazoCredito");

    let disponible = calcularDisponible(
        clienteCredito.ingresos,
        clienteCredito.egresos
    );

    let capacidadPago = calcularCapacidadPago(disponible);

    let interes = calcularInteresSimple(
        monto,
        tasaInteres,
        plazo
    );

    let totalPagar = calcularTotalPagar(
        monto,
        interes
    );

    let cuotaMensual = calcularCuotaMensual(
        totalPagar,
        plazo
    );

    let aprobado = aprobarCredito(
        capacidadPago,
        cuotaMensual
    );

    document.getElementById("resultadoCredito").innerHTML =
        "Capacidad de pago: " + capacidadPago + "<br>" +
        "Total a pagar: " + totalPagar + "<br>" +
        "Cuota mensual: " + cuotaMensual + "<br>" +
        "RESULTADO: " + (aprobado ? "APROBADO" : "RECHAZADO");
}