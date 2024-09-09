self.onmessage = (e) => {
  const pedido = e.data;
  const startTime = Date.now();

  const menu = {
    "Callback Burguer": [
      { tarefa: "Cortar ingredientes", duracao: 3000 },
      { tarefa: "Grelhar", duracao: 8000 },
      { tarefa: "Montar o prato", duracao: 2000 },
    ],
    "Null-Burguer": [
      { tarefa: "Cortar ingredientes", duracao: 4000 },
      { tarefa: "Grelhar", duracao: 7000 },
      { tarefa: "Montar o prato", duracao: 2000 },
    ],
    "Crispy Turing": [
      { tarefa: "Cortar ingredientes", duracao: 2000 },
      { tarefa: "Grelhar", duracao: 10000 },
      { tarefa: "Montar o prato", duracao: 1000 },
    ],
    "Mongo Melt": [
      { tarefa: "Cortar ingredientes", duracao: 1000 },
      { tarefa: "Grelhar", duracao: 3000 },
    ],
    Webwrap: [
      { tarefa: "Cortar ingredientes", duracao: 4000 },
      { tarefa: "Montar o prato", duracao: 2000 },
    ],
    "NPM Nuggets": [{ tarefa: "Fritar", duracao: 4000 }],
    "Float Juice": [
      { tarefa: "Cortar ingredientes", duracao: 4000 },
      { tarefa: "Preparar bebida", duracao: 3000 },
    ],
    "Array Apple": [
      { tarefa: "Cortar ingredientes", duracao: 4000 },
      { tarefa: "Preparar bebida", duracao: 3000 },
    ],
    "Async Berry": [
      { tarefa: "Cortar ingredientes", duracao: 2000 },
      { tarefa: "Preparar bebida", duracao: 2000 },
    ],
  };

  const tarefas = menu[pedido.item];
  executarTarefas(tarefas, () => {
    self.postMessage({ id: pedido.id, item: pedido.item, startTime });
  });
};

function executarTarefas(tarefas, callback) {
  let totalTime = 0;
  for (let tarefa of tarefas) {
    totalTime += tarefa.duracao;
    setTimeout(() => {
      console.log(
        `Tarefa ${tarefa.tarefa} concluída (${tarefa.duracao / 1000} segundos)`
      );
    }, totalTime);
  }
  setTimeout(callback, totalTime);
}
