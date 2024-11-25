let password = ""; // Almacena la contraseña actual
const validPassword = "1234"; // Contraseña válida
const passwordField = document.getElementById("password");
const statusField = document.getElementById("status");
const deviceList = document.getElementById("device-list");
const connectBtn = document.getElementById("connect-btn");
const sendBtn = document.getElementById("send");

let focoEncendido = false;
let cerraduraAbierta = false;

// Detectar clics en los botones del teclado
document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-key");
    if (password.length < 8) { // Limita la longitud
      password += key;
      passwordField.value = password;
    }
  });
});

// Borrar la contraseña
document.getElementById("clear").addEventListener("click", () => {
  password = "";
  passwordField.value = "";
  statusField.textContent = "";
});

// Enviar la contraseña
sendBtn.addEventListener("click", async () => {
  if (!navigator.bluetooth) {
    statusField.textContent = "Bluetooth no es compatible con este navegador.";
    return;
  }

  try {
    // Conexión Bluetooth (ahora acepta cualquier dispositivo)
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true, // Acepta cualquier dispositivo
      optionalServices: [] // No especificamos UUIDs de servicios, por lo que cualquier servicio es válido
    });
    const server = await device.gatt.connect();
    
    // Puedes obtener información sobre el dispositivo si lo deseas
    const deviceName = device.name || "Desconocido";
    statusField.textContent = `Conectado a: ${deviceName}`;

    // Validar la contraseña
    if (password === validPassword) {
      // Si se valida la contraseña, puedes realizar alguna acción con el dispositivo
      const command = "OPEN_DOOR"; // Comando para abrir la puerta (esto es un ejemplo)
      // Si tienes alguna característica para enviar comandos, la puedes obtener aquí
      // await characteristic.writeValue(new TextEncoder().encode(command));
      statusField.textContent = "¡Puerta abierta!";
    } else {
      statusField.textContent = "Contraseña incorrecta.";
    }

    // Limpiar la contraseña
    password = "";
    passwordField.value = "";

    // Ocultar el botón de conectar después de enviar
    connectBtn.style.display = "none";
  } catch (error) {
    console.error(error);
    statusField.textContent = "Error al conectar con el dispositivo.";
  }
});

// Mostrar dispositivos Bluetooth disponibles al hacer clic en "Conectar"
connectBtn.addEventListener("click", async () => {
  if (!navigator.bluetooth) {
    statusField.textContent = "Bluetooth no es compatible con este navegador.";
    return;
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true, // Acepta cualquier dispositivo
    });

    // Mostrar el dispositivo encontrado
    const deviceElement = document.createElement("p");
    deviceElement.textContent = "Dispositivo encontrado: " + device.name;
    deviceList.appendChild(deviceElement);

    // Mostrar lista de dispositivos
    deviceList.style.display = "block";
  } catch (error) {
    console.error(error);
    statusField.textContent = "Error al buscar dispositivos Bluetooth.";
  }
});

// Controlar el foco
document.querySelectorAll(".control[data-control='0']").forEach((button) => {
  button.addEventListener("click", () => {
    focoEncendido = false;
    document.getElementById("foco-status").textContent = "Foco: Apagado";
  });
});

document.querySelectorAll(".control[data-control='1']").forEach((button) => {
  button.addEventListener("click", () => {
    focoEncendido = true;
    document.getElementById("foco-status").textContent = "Foco: Encendido";
  });
});

// Controlar la cerradura
document.querySelectorAll(".control[data-control='8']").forEach((button) => {
  button.addEventListener("click", () => {
    cerraduraAbierta = true;
    document.getElementById("cerradura-status").textContent = "Cerradura: Abierta";
  });
});

document.querySelectorAll(".control[data-control='9']").forEach((button) => {
  button.addEventListener("click", () => {
    cerraduraAbierta = false;
    document.getElementById("cerradura-status").textContent = "Cerradura: Cerrada";
  });
});
