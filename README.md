Sistema de Pedidos com Web Workers

Este é um sistema de gerenciamento de pedidos de alimentos e bebidas utilizando Web Workers.
O sistema permite adicionar, processar e cancelar pedidos.

obs: (O tempo medio ainda nao funciona)

Funcionalidades

Adição de Pedidos: Adicione itens de um menu, com prioridade (alta ou normal), para serem processados.

Processamento Paralelo: Utiliza 4 Web Workers que processam os pedidos simultaneamente.

Cancelamento de Pedidos: Pedidos em espera podem ser cancelados antes de serem processados.

Visualização do Status de Pedidos: Mostra pedidos separados em três colunas: Em Espera, Fazendo, e Completados.

Estrutura do Projeto

index.html: Interface gráfica e formulário para adicionar pedidos.

style.css: Estilos de layout e aparência da página.

main.js: Lógica principal do sistema, gerenciando pedidos e workers.

worker.js: Código executado pelos Web Workers para processar os pedidos.

COMO USAR

Na página, selecione um item do menu e defina a prioridade. Clique em Adicionar Pedido para enviar o pedido ao sistema.

Os pedidos em espera, sendo processados, e completados são exibidos nas colunas correspondentes.

Cancelar Pedidos:
Pedidos que estão "Em Espera" podem ser cancelados clicando no botão "Cancelar" ao lado do pedido.
Tempo Médio:

Explicação Técnica
O projeto utiliza 4 Web Workers para processar pedidos de forma paralela. Cada worker pode realizar qualquer tarefa associada aos itens do menu, como cortar ingredientes, grelhar hambúrgueres ou preparar bebidas.

Gerenciamento de Pedidos: Os pedidos são divididos em três categorias:
Em Espera: Pedidos que ainda não foram processados.
Fazendo: Pedidos que estão sendo processados por um Web Worker.
Completados: Pedidos que já foram processados e finalizados.
Cancelamento de Pedidos: Pedidos que estão "Em Espera" podem ser cancelados antes de serem processados. Uma vez cancelado, o pedido não será mais enviado a um Web Worker.
