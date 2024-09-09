const workers = [];
for (let i = 0; i < 4; i++) {
  workers.push(new Worker("worker.js"));
}

let pedidos = [];
let orderId = 1;
let grelhaDisponivel = 4;
let corteDisponivel = 7;
let bebidasDisponiveis = 1;

function enviarPedido(pedido) {
  pedido.id = orderId++;
  pedido.status = "esperando";
  pedido.startTime = Date.now();
  pedido.tempoEstimado = calcularTempoEstimado(pedido.item);
  pedido.isCancelado = false;
  pedidos.push(pedido);
  arrumarPedidos();
  dadosNaTela();
}

function arrumarPedidos() {
  const workersDisponiveis = workers
    .filter((worker) => worker.isIdle)
    .sort((a, b) => a.timeSpent - b.timeSpent);
  workersDisponiveis.forEach((worker) => {
    let pedido = pedidos.find(
      (p) =>
        p.status === "esperando" &&
        p.prioridade === "alta" &&
        !p.isCancelado &&
        verificaRecursos(p)
    );
    if (!pedido) {
      pedido = pedidos.find(
        (p) =>
          p.status === "esperando" &&
          p.prioridade === "normal" &&
          !p.isCancelado &&
          verificaRecursos(p)
      );
    }
    if (pedido) {
      pedido.status = "processando";
      worker.isIdle = false;
      worker.currentTask = pedido.id;
      worker.postMessage(pedido);

      atualizarRecursos(pedido, "subtrair");
      atualizarWorkersNaTela();
    }
  });
}

function verificaRecursos(pedido) {
  if (pedido.item.includes("Burguer")) {
    if (grelhaDisponivel > 0 && corteDisponivel > 0) {
      return true;
    }
  } else if (pedido.item.includes("Juice")) {
    if (bebidasDisponiveis > 0 && corteDisponivel > 0) {
      return true;
    }
  } else if (corteDisponivel > 0) {
    return true;
  }
  return false;
}

function atualizarRecursos(pedido, acao) {
  if (pedido.item.includes("Burguer")) {
    grelhaDisponivel += acao === "subtrair" ? -1 : 1;
  }
  if (
    pedido.item.includes("Burguer") ||
    pedido.item.includes("Juice") ||
    pedido.item.includes("Wrap")
  ) {
    corteDisponivel += acao === "subtrair" ? -1 : 1;
  }
  if (pedido.item.includes("Juice")) {
    bebidasDisponiveis += acao === "subtrair" ? -1 : 1;
  }
}

function dadosNaTela() {
  const pedidosEspera = document.getElementById("pedidosEspera");
  const pedidosFazendo = document.getElementById("pedidosFazendo");
  const pedidosCompletados = document.getElementById("pedidosCompletados");
  const tempoMedioDisplay = document.getElementById("tempoMedio");

  pedidosEspera.innerHTML = "";
  pedidosFazendo.innerHTML = "";
  pedidosCompletados.innerHTML = "";

  pedidos.forEach((pedido) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Pedido:</strong> ${pedido.item} <br>
      <strong>Prioridade:</strong> ${pedido.prioridade} <br>
      <strong>Status:</strong> <span class="pedido-status">${
        pedido.status
      }</span> <br>
      <strong>Tempo para terminar:</strong> ${
        pedido.tempoEstimado / 1000
      } segundos
    `;

    if (pedido.status === "esperando") {
      const cancelarBtn = document.createElement("button");
      cancelarBtn.innerText = "Cancelar";
      cancelarBtn.addEventListener("click", () => cancelarPedido(pedido.id));
      li.appendChild(cancelarBtn);
      pedidosEspera.appendChild(li);
    } else if (pedido.status === "processando") {
      pedidosFazendo.appendChild(li);
    } else if (pedido.status === "completo") {
      pedidosCompletados.appendChild(li);
    }
  });

  const tempoMedio = calcularTempoMedio();
  tempoMedioDisplay.innerText = `${(tempoMedio / 1000).toFixed(2)} segundos`;
}

function atualizarWorkersNaTela() {
  const workersStatus = document.getElementById("workersStatus");
  workersStatus.innerHTML = "";

  workers.forEach((worker, index) => {
    const li = document.createElement("li");
    if (worker.isIdle) {
      li.innerHTML = `Worker ${index + 1}: Parado`;
    } else {
      const pedido = pedidos.find((p) => p.id === worker.currentTask);
      li.innerHTML = `Worker ${index + 1}: Processando Pedido ${
        worker.currentTask
      } `;
    }
    workersStatus.appendChild(li);
  });
}

function cancelarPedido(id) {
  const pedido = pedidos.find((p) => p.id === id);
  if (pedido && pedido.status === "esperando") {
    pedido.isCancelado = true;
    pedido.status = "Cancelado";
    console.log(`Pedido ${id} foi cancelado.`);
    dadosNaTela();
  }
}

function calcularTempoMedio() {
  const pedidosValidos = pedidos.filter((p) => !p.isCancelado);
  if (pedidosValidos.length === 0) return 0;

  const tempoTotal = pedidosValidos.reduce(
    (total, pedido) => total + pedido.tempoEstimado,
    0
  );
  return tempoTotal / pedidosValidos.length;
}

function calcularTempoEstimado(item) {
  const menu = {
    "Callback Burguer": 3000 + 8000 + 2000,
    "Null-Burguer": 4000 + 7000 + 2000,
    "Crispy Turing": 2000 + 10000 + 1000,
    "Mongo Melt": 1000 + 3000,
    Webwrap: 4000 + 2000,
    "NPM Nuggets": 4000,
    "Float Juice": 4000 + 3000,
    "Array Apple": 4000 + 3000,
    "Async Berry": 2000 + 2000,
  };

  return menu[item];
}

document.getElementById("adicionarPedido").addEventListener("click", () => {
  const item = document.getElementById("item").value;
  const prioridade = document.getElementById("prioridade").value;
  enviarPedido({ item, prioridade });
});

workers.forEach((worker) => {
  worker.isIdle = true;
  worker.timeSpent = 0;

  worker.onmessage = (e) => {
    const { id, startTime, progress } = e.data;
    const pedido = pedidos.find((p) => p.id === id);

    if (progress) {
      worker.currentTaskProgress = progress;
      atualizarWorkersNaTela();
      return;
    }

    pedido.status = "completo";
    pedido.endTime = Date.now();
    pedido.duration = (pedido.endTime - startTime) / 1000;
    console.log(
      `Pedido ${id} (${pedido.item}) finalizado em ${pedido.duration} segundos.`
    );

    worker.timeSpent += pedido.duration;
    worker.currentTask = null;

    atualizarRecursos(pedido, "adicionar");

    worker.isIdle = true;
    arrumarPedidos();
    dadosNaTela();
    atualizarWorkersNaTela();
  };
});
