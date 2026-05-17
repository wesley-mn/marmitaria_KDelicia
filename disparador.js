// ============================================================
//  Marmitaria K'Delícia — Sistema de Disparo WhatsApp
//  Backend Node.js — disparador.js
//
//  INSTALAÇÃO:
//    npm init -y
//    npm install express node-cron @supabase/supabase-js axios dotenv cors
//
//  RODAR:
//    node disparador.js
// ============================================================

require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Supabase ────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ── Configurações ────────────────────────────────────────────
const CONFIG = {
  // URL do seu site (aparece na mensagem enviada)
  SITE_URL: 'https://seu-site.com/carrinho.html',

  // Evolution API — configure no .env
  EVOLUTION_URL: process.env.EVOLUTION_URL,      // ex: http://localhost:8080
  EVOLUTION_APIKEY: process.env.EVOLUTION_APIKEY,   // chave da sua instância
  EVOLUTION_INSTANCE: process.env.EVOLUTION_INSTANCE, // nome da instância

  // Horário do disparo automático (todo dia às 10h, exceto domingo)
  CRON_HORARIO: '0 10 * * 1-6',
};

const DIAS_NOME = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// ============================================================
//  FUNÇÃO PRINCIPAL — Busca cardápio e dispara para todos
// ============================================================
async function executarDisparo() {
  console.log(`\n[${new Date().toLocaleString('pt-BR')}] 🚀 Iniciando disparo...`);

  try {
    // 1. Descobre o dia da semana atual (0=Dom ... 6=Sáb)
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const diaTexto = DIAS_NOME[diaSemana];

    if (diaSemana === 0) {
      console.log('Hoje é domingo — loja fechada. Disparo cancelado.');
      return { ok: false, motivo: 'domingo' };
    }

    // 2. Busca o cardápio do dia no Supabase
    const { data: cardapio, error: errCard } = await supabase
      .from('cardapio')
      .select('carnes')
      .eq('dia_semana', diaSemana)
      .eq('ativo', true)
      .single();

    if (errCard || !cardapio) {
      console.error('Cardápio não encontrado para hoje:', errCard?.message);
      return { ok: false, motivo: 'sem_cardapio' };
    }

    // 3. Busca todos os clientes ativos
    const { data: clientes, error: errCli } = await supabase
      .from('clientes')
      .select('id_cliente, nome, telefone')
      .eq('ativo', true);

    if (errCli || !clientes?.length) {
      console.error('Nenhum cliente encontrado:', errCli?.message);
      return { ok: false, motivo: 'sem_clientes' };
    }

    console.log(`📋 Cardápio de ${diaTexto}: ${cardapio.carnes.join(', ')}`);
    console.log(`👥 Enviando para ${clientes.length} cliente(s)...`);

    // 4. Monta a mensagem
    const carnesTopo = cardapio.carnes
      .map((c, i) => `  ${['🥩', '🍗', '🥘', '🍖'][i % 4]} ${c}`)
      .join('\n');

    const mensagem =
      `🍱 *Olá! Hoje é ${diaTexto} na K'Delícia!*

Confira as carnes disponíveis hoje:

${carnesTopo}

📦 Acompanhamentos: Arroz, Feijão, Macarrão, Batata Frita, Farofa e Salada!

👉 Faça seu pedido agora pelo site:
${CONFIG.SITE_URL}

Ou chame a gente aqui no WhatsApp mesmo! 😊
_K'Delícia — Feito com carinho para você ❤️_`;

    // 5. Dispara para cada cliente com delay de 2s entre cada envio
    const resultados = [];
    for (const cliente of clientes) {
      await delay(2000);

      const resultado = await enviarWhatsApp(cliente.telefone, mensagem);

      // Salva log no Supabase
      await supabase.from('log_disparos').insert({
        id_cliente: cliente.id_cliente,
        telefone: cliente.telefone,
        status: resultado.ok ? 'enviado' : 'erro',
        mensagem: mensagem,
        erro: resultado.erro || null,
      });

      const icone = resultado.ok ? '✅' : '❌';
      console.log(`  ${icone} ${cliente.nome} (${cliente.telefone})`);
      resultados.push({ cliente: cliente.nome, ...resultado });
    }

    const enviados = resultados.filter(r => r.ok).length;
    console.log(`\n✅ Disparo concluído: ${enviados}/${clientes.length} enviados.`);
    return { ok: true, enviados, total: clientes.length, resultados };

  } catch (err) {
    console.error('Erro inesperado no disparo:', err.message);
    return { ok: false, motivo: 'erro_interno', erro: err.message };
  }
}

// ============================================================
//  ENVIO VIA EVOLUTION API
// ============================================================
async function enviarWhatsApp(telefone, mensagem) {
  try {
    const url = `${CONFIG.EVOLUTION_URL}/message/sendText/${CONFIG.EVOLUTION_INSTANCE}`;

    const { data } = await axios.post(url, {
      number: telefone,
      text: mensagem,
      delay: 1200,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.EVOLUTION_APIKEY,
      },
    });

    return { ok: true, data };
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return { ok: false, erro: msg };
  }
}

// ============================================================
//  AGENDAMENTO AUTOMÁTICO (todo dia às 10h, seg a sáb)
// ============================================================
cron.schedule(CONFIG.CRON_HORARIO, () => {
  console.log('⏰ Cron disparado automaticamente!');
  executarDisparo();
}, { timezone: 'America/Sao_Paulo' });

// ============================================================
//  ROTAS DA API (usadas pelo painel admin)
// ============================================================

// — Disparo manual imediato
app.post('/api/disparar', async (req, res) => {
  const resultado = await executarDisparo();
  res.json(resultado);
});

// — Listar clientes
app.get('/api/clientes', async (req, res) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// — Adicionar cliente
app.post('/api/clientes', async (req, res) => {
  const { nome, telefone } = req.body;
  if (!nome || !telefone) return res.status(400).json({ error: 'nome e telefone obrigatórios' });

  // Limpa telefone: remove tudo que não é número
  const tel = telefone.replace(/\D/g, '');
  const telFormatado = tel.startsWith('55') ? tel : '55' + tel;

  const { data, error } = await supabase
    .from('clientes')
    .insert({ nome, telefone: telFormatado })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// — Ativar/desativar cliente
app.patch('/api/clientes/:id', async (req, res) => {
  const { ativo } = req.body;
  const { data, error } = await supabase
    .from('clientes')
    .update({ ativo })
    .eq('id_cliente', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// — Remover cliente
app.delete('/api/clientes/:id', async (req, res) => {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id_cliente', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// — Listar cardápio
app.get('/api/cardapio', async (req, res) => {
  const { data, error } = await supabase
    .from('cardapio')
    .select('*')
    .order('dia_semana');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// — Salvar/atualizar cardápio de um dia
app.put('/api/cardapio/:dia', async (req, res) => {
  const dia = parseInt(req.params.dia);
  const carnes = req.body.carnes; // array de strings

  if (!Array.isArray(carnes) || carnes.length === 0)
    return res.status(400).json({ error: 'carnes deve ser um array não vazio' });

  // Upsert: atualiza se existir, insere se não existir
  const { data, error } = await supabase
    .from('cardapio')
    .upsert({ dia_semana: dia, carnes, ativo: true, atualizado_em: new Date() },
      { onConflict: 'dia_semana' })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// — Log dos disparos
app.get('/api/logs', async (req, res) => {
  const { data, error } = await supabase
    .from('log_disparos')
    .select('*, clientes(nome)')
    .order('disparado_em', { ascending: false })
    .limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Helpers ──────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🍱 K'Delícia — Servidor rodando na porta ${PORT}`);
  console.log(`📅 Disparo automático configurado: ${CONFIG.CRON_HORARIO} (Brasília)`);
  console.log(`🌐 Painel: http://localhost:${PORT}\n`);
});