const cardapioDiario = {
    0: [],
    1: ['Frango a Parmegiana', 'Bisteca a Milanesa', 'Bife a Cavalo'],
    2: ['Contra-Filé', 'Frango a Passarinho', 'Fígado Acebolado'],
    3: ['Strogonoff de Frango', 'Escondidinho de Carne', 'Linguiça Acebolada'],
    4: ['Frango Xadrez', 'Carne de Panela com Batata'],
    5: ['Feijoada', 'Frango KFC', 'Bisteca a Cavalo'],
    6: ['Feijoada', 'Frango a Parmegiana', 'Contra-Filé a Cavalo', 'Bisteca a Milanesa'],
};

const diasNome = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const produtos = [
    { id: 1, nome: 'Marmita Grande',     cat: 'Marmita',   desc: 'Escolha a carne do dia',  preco: 20.00  },
    { id: 2, nome: 'Marmita Pequena',    cat: 'Marmita',   desc: 'Escolha a carne do dia',  preco: 15.00  },
    { id: 3, nome: 'Marmita Fitness',    cat: 'Marmita',   desc: 'Pacote com 10 unidades',  preco: 169.90 },
    { id: 4, nome: 'Adicional 1 carne',  cat: 'Adicional', desc: 'Uma carne extra',          preco: 10.00  },
    { id: 5, nome: 'Adicional 2 carnes', cat: 'Adicional', desc: 'Duas carnes extras',       preco: 20.00  },
    { id: 6, nome: 'Adicional 3 carnes', cat: 'Adicional', desc: 'Três carnes extras',       preco: 30.00  },
    { id: 7, nome: 'Coca-Cola',          cat: 'Bebida',    desc: 'Lata 350ml',               preco: 18.00  },
    { id: 8, nome: 'Fanta',              cat: 'Bebida',    desc: 'Lata 350ml',               preco: 17.00  },
    { id: 9, nome: 'Guaraná Kuat',       cat: 'Bebida',    desc: 'Lata 350ml',               preco: 16.00  },
];

let carrinho = {};

function renderProdutos() {
    const diaSemana = new Date().getDay();
    const carnes = cardapioDiario[diaSemana];
    const el = document.getElementById('produtos');

    if (carnes.length === 0) {
        el.innerHTML = `
            <div class="fechado-aviso">
                <p>Hoje é domingo, estamos fechados!</p>
                <p>Voltamos na segunda-feira às 11:00.</p>
            </div>
        `;
        return;
    }

    const opcoesCarnes = carnes.map(c => `<option value="${c}">${c}</option>`).join('');
    const diaAtual = diasNome[diaSemana];

    el.innerHTML = produtos.map(p => {
        const seletorCarne = p.cat === 'Marmita' ? `
            <label class="label-carne">Carne de hoje (${diaAtual}):</label>
            <select class="select-carne" id="carne-${p.id}">
                ${opcoesCarnes}
            </select>
        ` : '';

        return `
            <div class="card-prod">
                <span class="cat-label">${p.cat}</span>
                <h3>${p.nome}</h3>
                <p>${p.desc}</p>
                ${seletorCarne}
                <strong>R$ ${p.preco.toFixed(2).replace('.', ',')}</strong>
                <button class="btn-add" onclick="addItem(${p.id})">+ Adicionar</button>
            </div>
        `;
    }).join('');
}

function addItem(id) {
    const selectEl = document.getElementById(`carne-${id}`);
    const carneSelecionada = selectEl ? selectEl.value : null;

    if (!carrinho[id]) {
        carrinho[id] = { qtd: 1, carne: carneSelecionada };
    } else {
        carrinho[id].qtd++;
    }

    renderCarrinho();
}

function removeItem(id) {
    if (carrinho[id].qtd > 1) carrinho[id].qtd--;
    else delete carrinho[id];
    renderCarrinho();
}

function renderCarrinho() {
    const keys     = Object.keys(carrinho);
    const badge    = document.getElementById('badge');
    const itensEl  = document.getElementById('carr-itens');
    const totalEl  = document.getElementById('carr-total');
    const formEl   = document.getElementById('form-pedido');
    const totalVal = document.getElementById('total-val');

    badge.textContent = keys.reduce((a, k) => a + carrinho[k].qtd, 0);

    if (keys.length === 0) {
        itensEl.innerHTML = '<p class="carr-vazio">Nenhum item adicionado</p>';
        totalEl.style.display = 'none';
        formEl.style.display  = 'none';
        return;
    }

    let total = 0;
    itensEl.innerHTML = keys.map(k => {
        const p   = produtos.find(x => x.id == k);
        const sub = p.preco * carrinho[k].qtd;
        total += sub;

        const infoExtra = carrinho[k].carne
            ? `<span class="ci-carne">${carrinho[k].carne}</span>`
            : '';

        return `
            <div class="carr-item">
                <div>
                    <span class="ci-nome">${p.nome}</span>
                    ${infoExtra}
                </div>
                <div class="ci-qtd">
                    <button onclick="removeItem(${k})">-</button>
                    <span>${carrinho[k].qtd}</span>
                    <button onclick="addItem(${k})">+</button>
                </div>
                <span class="ci-preco">R$ ${sub.toFixed(2).replace('.', ',')}</span>
            </div>`;
    }).join('');

    totalVal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    totalEl.style.display = 'flex';
    formEl.style.display  = 'block';
}

function finalizar() {
    const nome = document.getElementById('inp-nome').value.trim();
    const tel  = document.getElementById('inp-tel').value.trim();

    if (!nome || !tel) { alert('Preencha nome e telefone!'); return; }
    if (Object.keys(carrinho).length === 0) { alert('Carrinho vazio!'); return; }

    let msg   = `Olá! Gostaria de fazer um pedido:%0A%0A`;
    let total = 0;

    Object.keys(carrinho).forEach(k => {
        const p   = produtos.find(x => x.id == k);
        const sub = p.preco * carrinho[k].qtd;
        total += sub;

        const carneInfo = carrinho[k].carne ? ` (${carrinho[k].carne})` : '';
        msg += `- ${carrinho[k].qtd}x ${p.nome}${carneInfo}: R$ ${sub.toFixed(2).replace('.', ',')}%0A`;
    });

    msg += `%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}%0A`;
    msg += `Entrega: ${document.getElementById('inp-entrega').value}%0A`;
    msg += `Pagamento: ${document.getElementById('inp-pag').value}%0A`;
    msg += `Nome: ${nome} | Tel: ${tel}`;

    const endBox = document.getElementById('end-box');
    if (endBox.style.display !== 'none') {
        msg += `%0AEndereço: ${document.getElementById('inp-end').value}`;
    }

    document.getElementById('carr-box').style.display = 'none';
    document.getElementById('sucesso').style.display  = 'block';

    setTimeout(() => {
        window.open(`https://wa.me/554197340920?text=${msg}`, '_blank');
    }, 800);
}

function novoPedido() {
    carrinho = {};
    document.getElementById('carr-box').style.display = 'block';
    document.getElementById('sucesso').style.display  = 'none';
    renderCarrinho();
}

document.getElementById('inp-entrega').addEventListener('change', function () {
    document.getElementById('end-box').style.display =
        this.value === 'delivery' ? 'block' : 'none';
});

renderProdutos();
renderCarrinho();