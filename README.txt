# 🍱 Marmitaria K'Delícia — Site Institucional

> Site institucional desenvolvido com HTML5, CSS3 e JavaScript puro para a Marmitaria K'Delícia, com navegação entre múltiplas páginas, sistema de pedidos via WhatsApp, cardápio semanal e design responsivo para todos os dispositivos. Sem frameworks ou dependências externas: basta um navegador moderno.

---

## 📑 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura do Projeto](#-arquitetura-do-projeto)
3. [Páginas e Funcionalidades](#-páginas-e-funcionalidades)
4. [Sistema de Pedidos](#-sistema-de-pedidos)
5. [Regras de Negócio e Validações](#-regras-de-negócio-e-validações)
6. [Design e Estilização](#-design-e-estilização)
7. [Responsividade](#-responsividade)
8. [Como Executar](#-como-executar)
9. [Estrutura de Arquivos](#-estrutura-de-arquivos)

---

## 🔭 Visão Geral

O site centraliza as informações da **Marmitaria K'Delícia**, fundada em 2023 em Piraquara/PR, oferecendo ao cliente uma experiência completa: visualizar o cardápio semanal com preços, conhecer a história e os valores da marmitaria, e realizar pedidos diretamente pelo WhatsApp sem sair do navegador.

A identidade visual é construída em tons de vinho, dourado e creme, transmitindo a sofisticação e o acolhimento da marca. O rodapé compartilhado em todas as páginas centraliza horários de funcionamento, redes sociais, formas de pagamento e localização no Google Maps.

---

## 🏗️ Arquitetura do Projeto

```
projeto/
│
├── index.html          # Página inicial (hero + galeria + banner fitness)
├── cardapio.html       # Cardápio semanal + tabela de preços
├── sobre.html          # História, fotos e tabela Missão/Visão/Valores
├── carrinho.html       # Sistema de pedidos com envio via WhatsApp
│
├── css/
│   ├── default.css     # Estilos globais: header, footer, variáveis e responsividade base
│   ├── home.css        # Estilos exclusivos da página inicial
│   ├── cardapio.css    # Estilos dos cards e tabela de preços
│   ├── sobrenos.css    # Estilos da página Sobre nós
│   └── compras.css     # Estilos do carrinho e formulário de pedido
│
├── js/
│   └── compras.js      # Lógica do carrinho: produtos, quantidades e envio via WhatsApp
│
└── img/
    └── (imagens dos pratos, logo, ícones de pagamento e redes sociais)
```

### Responsabilidade de cada arquivo

| Arquivo | Responsabilidade |
|---------|-----------------|
| `index.html` | Apresenta a marmitaria com imagem hero, galeria circular de pratos e banner da marmita fitness |
| `cardapio.html` | Exibe os pratos disponíveis por dia da semana, marmitas especiais, bebidas e tabela de preços |
| `sobre.html` | Conta a história da K'Delícia, exibe slideshow de fotos do espaço e a tabela de Missão, Visão e Valores |
| `carrinho.html` | Permite ao cliente montar seu pedido, preencher dados e finalizar via WhatsApp |
| `default.css` | Define variáveis de cor, estilos do header fixo, estilos do rodapé e breakpoints globais de responsividade |
| `compras.js` | Gera os cards de produto dinamicamente, gerencia o estado do carrinho e monta a mensagem para o WhatsApp |

---

## 📋 Páginas e Funcionalidades

### 🏠 Início (`index.html`)

Página de boas-vindas com:

- **Hero** — imagem principal da marmita com texto de apresentação e slogan;
- **Galeria circular** — três fotos dos pratos em destaque com efeito hover de elevação;
- **Banner marmita fitness** — destaque visual para a linha de marmitas saudáveis.

---

### 🍽️ Cardápio (`cardapio.html`)

Exibe o cardápio completo organizado em cards visuais:

```
──────────────────────────────
🎉 Marmita Tradicional
   Arroz · Feijão · Macarrão · Batata frita · Farofa · Salada

📅 Segunda-Feira
   Frango a Parmegiana · Bisteca a Milanesa · Bife a Cavalo
──────────────────────────────
```

**Conteúdo dos cards:**
- Marmita Tradicional (acompanhamentos fixos)
- Cardápio por dia da semana (Segunda a Sábado)
- Marmita Fitness (consulta com nutricionista)
- Bebidas (Coca-Cola, Fanta, Guaraná, Sprite, Água)

**Tabela de Preços:**

| Marmitas | Adicionais de Carnes | Refrigerantes |
|----------|---------------------|---------------|
| Grande — R$ 20,00 | 1 carne — R$ 10,00 | Coca-Cola — R$ 18,00 |
| Pequena — R$ 15,00 | 2 carnes — R$ 20,00 | Fanta — R$ 17,00 |
| Fitness — 10 por R$ 169,90 | 3 carnes — R$ 30,00 | Guaraná — R$ 16,00 |

---

### 👩‍🍳 Sobre Nós (`sobre.html`)

- **História** — texto sobre a fundação em 2023 pela chef Mônica de Matos Nascimento, atuação em Piraquara/PR e planos de expansão;
- **Slideshow animado** — duas fotos do espaço físico com transição suave via CSS `@keyframes`;
- **Tabela Missão, Visão e Valores** — responsiva e adaptada para mobile com `data-label`.

---

### 🛒 Carrinho (`carrinho.html`)

Sistema completo de pedido em uma única página. Consulte a seção [Sistema de Pedidos](#-sistema-de-pedidos) para mais detalhes.

---

## 🛒 Sistema de Pedidos

O carrinho é gerado dinamicamente pelo arquivo `compras.js` e funciona inteiramente no navegador, sem back-end.

### Fluxo do pedido

```
Produtos exibidos → Cliente adiciona itens → Ajusta quantidades
      → Preenche dados pessoais → Finaliza via WhatsApp
```

### Etapas

1. **Grade de produtos** — cards gerados por JavaScript com nome, descrição, preço e botão "Adicionar";
2. **Carrinho lateral** — lista os itens adicionados com controles de quantidade (`+` / `–`) e preço parcial;
3. **Total** — calculado automaticamente e atualizado em tempo real;
4. **Formulário de dados:**
   - Nome completo
   - Telefone
   - Tipo de entrega: Retirada no local ou Delivery (com campo de endereço condicional)
   - Forma de pagamento: Pix, Cartão ou Dinheiro
5. **Finalização** — botão `FINALIZAR VIA WHATSAPP` monta uma mensagem estruturada e abre o WhatsApp do estabelecimento (`(41) 97340-920`) com todos os dados do pedido.

### Exemplo de mensagem gerada

```
Olá! Gostaria de fazer um pedido:

🛒 ITENS:
- 2x Marmita Grande — R$ 40,00
- 1x Coca-Cola — R$ 18,00

💰 Total: R$ 58,00

👤 Nome: João da Silva
📱 Telefone: (41) 99999-9999
🚗 Entrega: Delivery
📍 Endereço: Rua das Flores, 100 - Centro
💳 Pagamento: Pix
```

---

## ✅ Regras de Negócio e Validações

### Carrinho

| Regra | Detalhe |
|-------|---------|
| **Quantidade mínima** | Não é possível reduzir abaixo de 1; o botão `–` remove o item ao chegar em zero |
| **Campo endereço** | Só é exibido quando a entrega selecionada for **Delivery** |
| **Campos obrigatórios** | Nome, telefone e tipo de entrega são exigidos antes do envio |

### Cardápio

| Regra | Detalhe |
|-------|---------|
| **Marmita Fitness** | Não possui preço fixo exibido; o cliente é orientado a consultar a nutricionista e a equipe |
| **Conflito de imagem** | Cada card possui imagem circular com foto do prato correspondente ao dia |

---

## 🎨 Design e Estilização

### Paleta de cores

| Variável | Cor | Uso |
|----------|-----|-----|
| `--vinho` | `#6b1515` | Header, botões primários, destaques |
| `--vinho2` | `#7a2635` | Títulos dos cards, hover de elementos |
| `--dourado` | `#f1c875` | Acentos, links hover, detalhes do rodapé |
| `--fundo` | `#d9ad73` | Fundo principal das seções |
| `--creme` | `#f5e6d0` | Fundo de cards e elementos internos |
| `--texto` | `#321d14` | Texto corrido e descrições |

### Tipografia

| Fonte | Uso |
|-------|-----|
| `Lato` (900) | Títulos principais e itens do menu |
| `Oswald` | Títulos de seção e variações |
| `Cinzel` | Títulos da página de carrinho |
| `Georgia / Times New Roman` | Textos dos cards do cardápio e rodapé |
| `Playfair Display` | Itálico decorativo em páginas de conteúdo |

### Efeitos visuais

- **Glassmorphism** nos cards: `backdrop-filter: blur(10px)` com fundo semitransparente;
- **Hover de elevação**: `transform: translateY(-5px)` nos cards do cardápio;
- **Gradiente linear** nas seções de conteúdo: `#e2bb84 → #d6a86d`;
- **Slideshow CSS** na página Sobre nós com `@keyframes fadeMarmitaria`;
- **Header sticky** com `position: sticky; top: 0; z-index: 9999`.

---

## 📱 Responsividade

O site é totalmente responsivo com breakpoints definidos em `default.css` e nos CSS de cada página.

| Breakpoint | Comportamento |
|------------|--------------|
| `≥ 1600px` | Header e fontes escalam proporcionalmente com `clamp()` |
| `≤ 1180px` | Cards do cardápio passam de 3 para 2 colunas |
| `≤ 1024px` | Carrinho reduz a largura da coluna lateral |
| `≤ 900px` | Hero da home passa para layout de coluna única |
| `≤ 820px` | Cards do cardápio passam para 1 coluna com layout em grid de 2 colunas (foto + texto) |
| `≤ 780px` | Header empilha logo e menu verticalmente; carrinho passa para coluna única |
| `≤ 760px` | Rodapé reorganiza de 4 para 1 coluna |
| `≤ 600px` | Tabela MVV (Sobre nós) vira layout de bloco com `data-label` |
| `≤ 480px` | Ajustes finos de fonte, padding e tamanho dos elementos |

---

## ▶️ Como Executar

### 1. Clone ou baixe os arquivos do projeto

Certifique-se de manter a estrutura de pastas intacta (`css/`, `js/`, `img/`).

### 2. Abra o arquivo principal no navegador

```bash
# Basta abrir o arquivo diretamente:
index.html
```

Ou, para melhor compatibilidade com recursos locais, utilize uma extensão como **Live Server** (VS Code) ou qualquer servidor HTTP local:

```bash
# Com Python 3:
python -m http.server 8000
# Acesse: http://localhost:8000
```

> Nenhuma instalação adicional é necessária. O projeto não utiliza Node.js, npm, bundlers ou frameworks externos.

### 3. Pré-requisitos

| Requisito | Versão mínima | Observação |
|-----------|--------------|------------|
| Navegador | Qualquer moderno | Chrome, Firefox, Edge, Safari |
| Conexão com internet | Opcional | Necessária apenas para carregar as fontes do Google Fonts |

---

## 📁 Estrutura de Arquivos

```
marmitaria-kdelicia/
│
├── index.html              # Página inicial
├── cardapio.html           # Cardápio semanal e preços
├── sobre.html              # Sobre nós, história e MVV
├── carrinho.html           # Sistema de pedidos
│
├── css/
│   ├── default.css         # Estilos globais e componentes compartilhados
│   ├── home.css            # Layout e estilos da página inicial
│   ├── cardapio.css        # Cards, tabela e seção do cardápio
│   ├── sobrenos.css        # Slideshow, parágrafo e tabela MVV
│   └── compras.css         # Grid de produtos, carrinho e formulário
│
├── js/
│   └── compras.js          # Lógica completa do carrinho e integração WhatsApp
│
└── img/
    ├── logo.png            # Logo circular da K'Delícia
    ├── marmita.png         # Imagem hero da página inicial
    ├── marmita_fitness.png # Banner da linha fitness
    ├── tradicional.png     # Foto da marmita tradicional
    ├── parmegiana.png      # Foto do frango a parmegiana
    ├── contra_file.png     # Foto do contra-filé
    ├── strogonoff.png      # Foto do strogonoff
    ├── xadrez.png          # Foto do frango xadrez
    ├── bisteca.png         # Foto da bisteca
    ├── feijoada.png        # Foto da feijoada
    ├── fitness.png         # Foto da marmita fitness
    ├── bebidas.png         # Foto das bebidas
    ├── home1.png           # Galeria circular 1
    ├── home2.png           # Galeria circular 2
    ├── home3.png           # Galeria circular 3
    ├── restaurante1.png    # Foto do espaço (slideshow)
    ├── restaurante2.png    # Foto do espaço (slideshow)
    ├── instagram.jpeg      # Ícone do Instagram
    ├── whatsapp.jpeg       # Ícone do WhatsApp
    ├── visa.png            # Bandeira Visa
    ├── pix.png             # Logo do Pix
    └── mastercard.png      # Bandeira Mastercard
```

---

## 👥 Autores

Alexandre Zampronne Zaccaron Rocha  
Wesley Henrique de Matos Nascimento  
Vinicius Oliveira Prado  
Matheus Felipe Alves Ferreira  
Eduardo Oliveira da Silva

Desenvolvido como projeto acadêmico — 2026