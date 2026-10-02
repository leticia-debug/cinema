// Preços solicitados nas regras de negócio
const PRECOS = {
    inteira: 16.00,
    meia: 12.00
};

// Configurações estruturais exigidas da sala
const FILAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
const CADEIRAS_POR_FILA = 20; // Resultando em 18 * 20 = 360 cadeiras

// Simulação de cadeiras já compradas (Amarelas) distribuídas pela sala
const poltronasCompradas = ['A05', 'A06', 'B12', 'D20', 'H07', 'H08', 'M15', 'R10'];

// Captura de elementos de controle de tela e fluxo
const telaFilme = document.getElementById('tela-filme');
const telaMapa = document.getElementById('tela-mapa');
const infoSessaoTopo = document.getElementById('infoSessaoTopo');
const mapaAssentos = document.getElementById('mapaAssentos');

const qtdIngressosEl = document.getElementById('listaAssentosTexto');
const valorTotalEl = document.getElementById('valorTotal');
const btnConfirmar = document.getElementById('btnConfirmar');
const tipoIngressoSelect = document.getElementById('tipoIngresso');

// Lógica para expandir a barra de datas da abertura
const btnExpandirData = document.getElementById('btnExpandirData');
const listaDatas = document.getElementById('listaDatas');
btnExpandirData.addEventListener('click', () => {
    listaDatas.classList.toggle('aberto');
});

// Navegação: Muda para a página de assentos ao selecionar a sessão
function irParaMapa(sala, horario) {
    infoSessaoTopo.textContent = `Filme: Verity • ${sala} • Horário: ${horario}`;
    telaFilme.classList.add('oculto');
    telaMapa.classList.remove('oculto');
}

// Navegação: Retorna para os horários
document.getElementById('btnVoltar').addEventListener('click', () => {
    telaMapa.classList.add('oculto');
    telaFilme.classList.remove('oculto');
});

// Criação dinâmica da matriz com as 360 poltronas organizadas por letras e ícones
function construirSala() {
    mapaAssentos.innerHTML = ''; // Limpa antes de gerar
    
    FILAS.forEach(letra => {
        for (let num = 1; num <= CADEIRAS_POR_FILA; num++) {
            const numeroFormatado = num < 10 ? `0${num}` : num;
            const idPoltrona = `${letra}${numeroFormatado}`;
            
            const assento = document.createElement('div');
            assento.classList.add('assento');
            assento.dataset.id = idPoltrona;
            
            // Texto básico do assento (ex: A01, B12...)
            assento.textContent = idPoltrona;

            // --- APLICAÇÃO DE REGRAS ESPECIAIS DE ACORDO COM A FILA/NÚMERO ---
            
            // 1. Cadeiras Namoradeiras nas últimas fileiras Q e R (recebem símbolo de Coração ❤️)
            if (letra === 'Q' || letra === 'R') {
                assento.classList.add('namoradeira');
                assento.textContent = `❤️ ${idPoltrona}`;
            }
            // 2. Deficientes (Fila A - poltronas 01 e 02 recebem ♿)
            else if (letra === 'A' && (num === 1 || num === 2)) {
                assento.classList.add('pcd');
                assento.textContent = `♿ ${idPoltrona}`;
            }
            // 3. Obesos (Fila B - poltronas 01 e 02 recebem símbolo)
            else if (letra === 'B' && (num === 1 || num === 2)) {
                assento.classList.add('obeso');
                assento.textContent = `🐘 ${idPoltrona}`;
            }

            // Regra de Compras Prévias: Se estiver na lista, pinta de amarelo e bloqueia
            if (poltronasCompradas.includes(idPoltrona)) {
                assento.classList.add('ocupado');
            } else {
                // Adiciona o gatilho humano de escolha apenas nas disponíveis
                assento.addEventListener('click', () => alternarSelecao(assento));
            }

            mapaAssentos.appendChild(assento);
        }
    });
}

// Lógica de cálculo financeiro e alteração de cor de poltronas
function alternarSelecao(assento) {
    assento.classList.toggle('selecionado');
    atualizarResumo();
}

// Ouve mudanças no campo de tipo de ingresso (Inteira / Meia) para recalcular na hora
tipoIngressoSelect.addEventListener('change', atualizarResumo);

function atualizarResumo() {
    const selecionados = document.querySelectorAll('.assento.selecionado');
    const totalSelecionados = selecionados.length;
    
    // Identifica quais IDs foram marcados na hora
    const listaIds = Array.from(selecionados).map(a => a.dataset.id);
    
    // Coleta a taxa base do select (Meia ou Inteira)
    const tipoAtual = tipoIngressoSelect.value;
    const valorUnitario = PRECOS[tipoAtual];
    const valorFinal = totalSelecionados * valorUnitario;

    // Atualiza elementos do painel
    qtdIngressosEl.textContent = totalSelecionados > 0 ? listaIds.join(', ') : '-';
    valorTotalEl.textContent = valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Liga ou desliga o botão de confirmação
    btnConfirmar.disabled = totalSelecionados === 0;
}

// Alerta de fechamento final exibindo o ingresso simulado
btnConfirmar.addEventListener('click', () => {
    const selecionados = Array.from(document.querySelectorAll('.assento.selecionado')).map(a => a.dataset.id);
    const tipo = tipoIngressoSelect.value === 'meia' ? 'Meia-Entrada' : 'Inteira';
    
    alert(`🎟️ INGRESSO DIGITAL CINEFLIX 🎟️\n\nFilme: Verity\nAssentos: ${selecionados.join(', ')}\nTipo: ${tipo}\n\nSua reserva foi gerada com sucesso! Apresente o QR Code no cinema.`);
});

// Executa a montagem inicial da sala de cinema em segundo plano
construirSala();
