
const API_CAMBIO = "https://open.er-api.com/v6/latest/BRL";
const API_MUNDO = "https://api.worldbank.org/v2";

let cotacoes = {};
let moedas = [];
let paginaAtual = 0;
const itensPorPagina = 20;

const paisesMoedas = [
  ["🇧🇷", "Brasil", "BRL"],
  ["🇺🇸", "Estados Unidos", "USD"],
  ["🇪🇺", "União Europeia", "EUR"],
  ["🇬🇧", "Reino Unido", "GBP"],
  ["🇯🇵", "Japão", "JPY"],
  ["🇨🇦", "Canadá", "CAD"],
  ["🇦🇺", "Austrália", "AUD"],
  ["🇨🇭", "Suíça", "CHF"],
  ["🇨🇳", "China", "CNY"],
  ["🇦🇷", "Argentina", "ARS"],
  ["🇨🇱", "Chile", "CLP"],
  ["🇵🇾", "Paraguai", "PYG"],
  ["🇺🇾", "Uruguai", "UYU"],
  ["🇲🇽", "México", "MXN"],
  ["🇨🇴", "Colômbia", "COP"],
  ["🇵🇪", "Peru", "PEN"],
  ["🇿🇦", "África do Sul", "ZAR"],
  ["🇮🇳", "Índia", "INR"],
  ["🇰🇷", "Coreia do Sul", "KRW"],
  ["🇷🇺", "Rússia", "RUB"],
  ["🇸🇪", "Suécia", "SEK"],
  ["🇳🇴", "Noruega", "NOK"],
  ["🇩🇰", "Dinamarca", "DKK"],
  ["🇳🇿", "Nova Zelândia", "NZD"],
  ["🇸🇬", "Singapura", "SGD"],
  ["🇭🇰", "Hong Kong", "HKD"],
  ["🇹🇷", "Turquia", "TRY"],
  ["🇹🇭", "Tailândia", "THB"],
  ["🇮🇱", "Israel", "ILS"],
  ["🇸🇦", "Arábia Saudita", "SAR"],
  ["🇦🇪", "Emirados Árabes", "AED"],
  ["🇵🇱", "Polônia", "PLN"],
  ["🇨🇿", "República Tcheca", "CZK"],
  ["🇭🇺", "Hungria", "HUF"],
  ["🇷🇴", "Romênia", "RON"],
  ["🇪🇬", "Egito", "EGP"],
  ["🇳🇬", "Nigéria", "NGN"],
  ["🇰🇪", "Quênia", "KES"],
  ["🇲🇦", "Marrocos", "MAD"],
  ["🇵🇭", "Filipinas", "PHP"],
  ["🇮🇩", "Indonésia", "IDR"],
  ["🇲🇾", "Malásia", "MYR"],
  ["🇻🇳", "Vietnã", "VND"],
  ["🇵🇰", "Paquistão", "PKR"],
  ["🇧🇩", "Bangladesh", "BDT"],
  ["🇸🇦", "Catar", "QAR"],
  ["🇰🇼", "Kuwait", "KWD"],
  ["🇧🇭", "Bahrein", "BHD"],
  ["🇴🇲", "Omã", "OMR"],
  ["🇮🇸", "Islândia", "ISK"]
];

const nomesMoedas = {
  BRL: "Real brasileiro",
  USD: "Dólar americano",
  EUR: "Euro",
  GBP: "Libra esterlina",
  JPY: "Iene japonês",
  CAD: "Dólar canadense",
  AUD: "Dólar australiano",
  CHF: "Franco suíço",
  CNY: "Yuan chinês",
  ARS: "Peso argentino",
  CLP: "Peso chileno",
  PYG: "Guarani paraguaio",
  UYU: "Peso uruguaio",
  MXN: "Peso mexicano",
  COP: "Peso colombiano",
  PEN: "Sol peruano",
  ZAR: "Rand sul-africano",
  INR: "Rupia indiana",
  KRW: "Won sul-coreano",
  RUB: "Rublo russo",
  SEK: "Coroa sueca",
  NOK: "Coroa norueguesa",
  DKK: "Coroa dinamarquesa",
  NZD: "Dólar neozelandês",
  SGD: "Dólar de Singapura",
  HKD: "Dólar de Hong Kong",
  TRY: "Lira turca",
  THB: "Baht tailandês",
  ILS: "Shekel israelense",
  SAR: "Rial saudita",
  AED: "Dirham dos Emirados",
  PLN: "Zloty polonês",
  CZK: "Coroa tcheca",
  HUF: "Florim húngaro",
  RON: "Leu romeno",
  EGP: "Libra egípcia",
  NGN: "Naira nigeriana",
  KES: "Xelim queniano",
  MAD: "Dirham marroquino",
  PHP: "Peso filipino",
  IDR: "Rupia indonésia",
  MYR: "Ringgit malaio",
  VND: "Dong vietnamita",
  PKR: "Rupia paquistanesa",
  BDT: "Taka de Bangladesh",
  QAR: "Rial catariano",
  KWD: "Dinar kuwaitiano",
  BHD: "Dinar bareinita",
  OMR: "Rial omanense",
  ISK: "Coroa islandesa"
};

function dinheiro(valor, moeda = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: moeda
  }).format(valor);
}

async function carregarCambio() {
  const status = document.getElementById("status");

  try {
    status.textContent = "Atualizando cotações...";

    const resposta = await fetch(API_CAMBIO);
    if (!resposta.ok) throw new Error("Erro ao consultar câmbio.");

    const dados = await resposta.json();

    if (dados.result !== "success") {
      throw new Error("Fonte de câmbio indisponível.");
    }

    cotacoes = dados.rates;

    document.getElementById("dolar").textContent =
      dinheiro(1 / cotacoes.USD);

    document.getElementById("euro").textContent =
      dinheiro(1 / cotacoes.EUR);

    document.getElementById("libra").textContent =
      dinheiro(1 / cotacoes.GBP);

    document.getElementById("status").textContent =
      "Cotações atualizadas com sucesso";

    document.getElementById("updated").textContent =
      "Última atualização: " + new Date().toLocaleString("pt-BR");

    document.getElementById("variacaoDolar").textContent =
      "Referência: " + dados.time_last_update_utc;

    montarMoedas();
    preencherConversor();
    calcularCompra();
    montarGrafico();

  } catch (erro) {
    console.error(erro);
    status.textContent = "Não foi possível atualizar o câmbio.";
    document.getElementById("listaMoedas").innerHTML =
      '<tr><td colspan="3">Erro ao carregar. Tente novamente.</td></tr>';
  }
}

function montarMoedas() {
  moedas = paisesMoedas.map(([bandeira, pais, codigo]) => ({
    bandeira,
    pais,
    codigo,
    valor: cotacoes[codigo] ? 1 / cotacoes[codigo] : null
  })).filter(item => item.valor !== null);

  renderizarTabela();
}

function renderizarTabela() {
  const busca = document.getElementById("pesquisa")
    .value.toLowerCase();

  const filtradas = moedas.filter(item =>
    item.pais.toLowerCase().includes(busca) ||
    item.codigo.toLowerCase().includes(busca) ||
    nomesMoedas[item.codigo].toLowerCase().includes(busca)
  );

  const inicio = paginaAtual * itensPorPagina;
  const pagina = filtradas.slice(inicio, inicio + itensPorPagina);

  document.getElementById("listaMoedas").innerHTML =
    pagina.map(item => `
      <tr>
        <td>${item.bandeira} ${item.pais}</td>
        <td>${dinheiro(item.valor)}</td>
        <td>${item.codigo} — ${nomesMoedas[item.codigo]}</td>
      </tr>
    `).join("") || '<tr><td colspan="3">Nenhuma moeda encontrada.</td></tr>';

  document.getElementById("showing")?.remove();

  document.getElementById("country-count").textContent =
    moedas.length;

  const anterior = document.getElementById("prev");
  const proxima = document.getElementById("next");

  if (anterior) anterior.disabled = paginaAtual === 0;
  if (proxima) proxima.disabled = inicio + itensPorPagina >= filtradas.length;
}

function preencherConversor() {
  const opcoes = Object.keys(cotacoes).sort().map(codigo =>
    `<option value="${codigo}">${codigo} - ${nomesMoedas[codigo] || codigo}</option>`
  ).join("");

  const de = document.getElementById("from");
  const para = document.getElementById("to");

  if (de && para) {
    de.innerHTML = '<option value="BRL">BRL - Real brasileiro</option>' + opcoes;
    para.innerHTML = opcoes;
    para.value = "USD";
  }

  const destino = document.getElementById("moedaDestino");
  if (destino) {
    destino.innerHTML = opcoes;
    destino.value = "USD";
  }
}

function calcularCompra() {
  const valor = Number(document.getElementById("valorReal").value);
  const moeda = document.getElementById("moedaDestino").value;

  if (!Number.isFinite(valor) || valor < 0 || !cotacoes[moeda]) return;

  const resultado = valor * cotacoes[moeda];

  document.getElementById("resultadoCompra").textContent =
    dinheiro(resultado, moeda);
}

function calcularConversor() {
  const valor = Number(document.getElementById("amount").value);
  const de = document.getElementById("from").value;
  const para = document.getElementById("to").value;

  if (!Number.isFinite(valor) || valor < 0) return;

  const resultado = valor / cotacoes[de] * cotacoes[para];

  document.getElementById("conversion").textContent =
    dinheiro(resultado, para);
}

async function carregarInflacao() {
  const ano = document.getElementById("anoInflacao").value;
  const corpo = document.getElementById("listaInflacao");

  corpo.innerHTML = '<tr><td colspan="3">Consultando Banco Mundial...</td></tr>';

  const codigos = [
    ["BRA", "Brasil"], ["USA", "Estados Unidos"],
    ["ARG", "Argentina"], ["CHL", "Chile"],
    ["PRY", "Paraguai"], ["URY", "Uruguai"],
    ["MEX", "México"], ["COL", "Colômbia"],
    ["PER", "Peru"], ["GBR", "Reino Unido"],
    ["DEU", "Alemanha"], ["FRA", "França"],
    ["JPN", "Japão"], ["CHN", "China"],
    ["IND", "Índia"], ["ZAF", "África do Sul"],
    ["TUR", "Turquia"], ["EGY", "Egito"]
  ];

  try {
    const resultados = await Promise.all(codigos.map(async ([codigo, nome]) => {
      const url = `${API_MUNDO}/country/${codigo}/indicator/FP.CPI.TOTL.ZG?date=${ano}&format=json`;
      const resposta = await fetch(url);
      const dados = await resposta.json();
      return {
        nome,
        valor: dados[1]?.[0]?.value
      };
    }));

    const busca = document.getElementById("pesquisaInflacao")
      .value.toLowerCase();

    const filtrados = resultados.filter(item =>
      item.nome.toLowerCase().includes(busca)
    );

    corpo.innerHTML = filtrados.map(item => {
      const valor = item.valor;

      let situacao = "Sem dados";
      let classe = "";

      if (valor !== null && valor !== undefined) {
        situacao = valor > 10 ? "Inflação elevada" :
          valor > 4 ? "Inflação moderada" : "Inflação baixa";
        classe = valor > 10 ? "alta" : valor > 4 ? "media" : "baixa";
      }

      return `
        <tr>
          <td>${item.nome}</td>
          <td>${valor == null ? "Sem dados" : valor.toFixed(2) + "%"}</td>
          <td><span class="situacao ${classe}">${situacao}</span></td>
        </tr>
      `;
    }).join("") || '<tr><td colspan="3">Nenhum país encontrado.</td></tr>';

  } catch (erro) {
    console.error(erro);
    corpo.innerHTML =
      '<tr><td colspan="3">Não foi possível carregar os indicadores.</td></tr>';
  }
}

async function carregarEconomia() {
  const pais = document.getElementById("country-select")?.value || "BRA";
  const status = document.getElementById("economy-status");

  if (!status) return;

  status.textContent = "Consultando Banco Mundial...";

  const indicadores = [
    ["FP.CPI.TOTL.ZG", "inflation", "Inflação anual"],
    ["PA.NUS.PPP", "ppp", "Paridade do poder de compra"],
    ["NY.GDP.PCAP.PP.CD", "gdp-ppp", "PIB per capita (PPC)"]
  ];

  try {
    const respostas = await Promise.all(indicadores.map(async ([codigo]) => {
      const url = `${API_MUNDO}/country/${pais}/indicator/${codigo}?date=2018:2025&format=json&per_page=100`;
      const resposta = await fetch(url);
      return resposta.json();
    }));

    indicadores.forEach(([codigo, id, nome], index) => {
      const registro = respostas[index]?.[1]?.find(item => item.value !== null);
      const elemento = document.getElementById(id);
      const ano = document.getElementById(
        id === "inflation" ? "inflation-year" :
        id === "ppp" ? "ppp-year" : "gdp-year"
      );

      if (registro) {
        const valor = Number(registro.value);
        elemento.textContent = id === "inflation"
          ? valor.toFixed(2) + "%"
          : new Intl.NumberFormat("pt-BR", {
              maximumFractionDigits: 2
            }).format(valor);

        ano.textContent = "Ano de referência: " + registro.date;
      } else {
        elemento.textContent = "Sem dados";
        ano.textContent = "Não disponível na fonte";
      }
    });

    status.textContent = "Indicadores carregados. Os anos podem variar por indicador.";

  } catch (erro) {
    console.error(erro);
    status.textContent = "Erro ao consultar indicadores econômicos.";
  }
}

function montarGrafico() {
  const canvas = document.getElementById("currency-chart");
  if (!canvas || !window.Chart) return;

  const principais = ["USD", "EUR", "GBP", "JPY", "ARS", "CLP", "PYG", "CHF"];
  const itens = principais.filter(codigo => cotacoes[codigo]);

  if (window.graficoMoedas) window.graficoMoedas.destroy();

  window.graficoMoedas = new Chart(canvas, {
    type: "bar",
    data: {
      labels: itens,
      datasets: [{
        label: "Valor de uma unidade em reais",
        data: itens.map(codigo => 1 / cotacoes[codigo]),
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#dce6f2" } }
      },
      scales: {
        x: { ticks: { color: "#91a2b7" }, grid: { color: "#263a50" } },
        y: { ticks: { color: "#91a2b7" }, grid: { color: "#263a50" } }
      }
    }
  });
}

document.getElementById("pesquisa").addEventListener("input", () => {
  paginaAtual = 0;
  renderizarTabela();
});

document.getElementById("pesquisaInflacao").addEventListener("input", carregarInflacao);
document.getElementById("anoInflacao").addEventListener("change", carregarInflacao);
document.getElementById("atualizar").addEventListener("click", carregarCambio);
document.getElementById("calcular").addEventListener("click", calcularCompra);
document.getElementById("moedaDestino").addEventListener("change", calcularCompra);
document.getElementById("valorReal").addEventListener("input", calcularCompra);

document.getElementById("prev").addEventListener("click", () => {
  if (paginaAtual > 0) paginaAtual--;
  renderizarTabela();
});

document.getElementById("next").addEventListener("click", () => {
  paginaAtual++;
  renderizarTabela();
});

document.getElementById("swap")?.addEventListener("click", () => {
  const de = document.getElementById("from");
  const para = document.getElementById("to");
  const temporario = de.value;
  de.value = para.value;
  para.value = temporario;
  calcularConversor();
});

["amount", "from", "to"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", calcularConversor);
  document.getElementById(id)?.addEventListener("change", calcularConversor);
});

document.getElementById("load-economy")?.addEventListener("click", carregarEconomia);
document.getElementById("country-select")?.addEventListener("change", carregarEconomia);

carregarCambio();
carregarInflacao();
carregarEconomia();
