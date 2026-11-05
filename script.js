
const API = "https://fipe.parallelum.com.br/api/v2";

const tipo = document.getElementById("tipo");
const marca = document.getElementById("marca");
const modelo = document.getElementById("modelo");
const ano = document.getElementById("ano");
const consultar = document.getElementById("consultar");
const resultado = document.getElementById("resultado");
const mensagem = document.getElementById("mensagem");

async function buscarDados(url) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error("Não foi possível consultar os dados.");
    }

    return await resposta.json();
}

function limparSelect(elemento, texto) {
    elemento.innerHTML = `<option value="">${texto}</option>`;
}

function resetarCampos() {
    limparSelect(modelo, "Selecione um modelo");
    limparSelect(ano, "Selecione o ano");

    modelo.disabled = true;
    ano.disabled = true;
    consultar.disabled = true;

    resultado.hidden = true;
}

function exibirMensagem(texto) {
    mensagem.textContent = texto;
}

async function carregarMarcas() {
    resetarCampos();
    limparSelect(marca, "Carregando marcas...");
    exibirMensagem("Carregando marcas...");

    try {
        const dados = await buscarDados(
            `${API}/${tipo.value}/brands`
        );

        limparSelect(marca, "Selecione uma marca");

        dados.forEach(item => {
            const opcao = document.createElement("option");
            opcao.value = item.code;
            opcao.textContent = item.name;
            marca.appendChild(opcao);
        });

        exibirMensagem("");

    } catch (erro) {
        limparSelect(marca, "Erro ao carregar marcas");
        exibirMensagem(erro.message);
    }
}

async function carregarModelos() {
    resetarCampos();

    if (!marca.value) return;

    limparSelect(modelo, "Carregando modelos...");
    exibirMensagem("Carregando modelos...");

    try {
        const dados = await buscarDados(
            `${API}/${tipo.value}/brands/${marca.value}/models`
        );

        limparSelect(modelo, "Selecione um modelo");

        const lista = dados.models || dados;

        lista.forEach(item => {
            const opcao = document.createElement("option");
            opcao.value = item.code;
            opcao.textContent = item.name;
            modelo.appendChild(opcao);
        });

        modelo.disabled = false;
        exibirMensagem("");

    } catch (erro) {
        limparSelect(modelo, "Erro ao carregar modelos");
        exibirMensagem(erro.message);
    }
}

async function carregarAnos() {
    limparSelect(ano, "Carregando anos...");
    ano.disabled = true;
    consultar.disabled = true;
    resultado.hidden = true;

    if (!modelo.value) return;

    exibirMensagem("Carregando anos disponíveis...");

    try {
        const dados = await buscarDados(
            `${API}/${tipo.value}/brands/${marca.value}/models/${modelo.value}/years`
        );

        limparSelect(ano, "Selecione o ano");

        dados.forEach(item => {
            const opcao = document.createElement("option");
            opcao.value = item.code;
            opcao.textContent = item.name;
            ano.appendChild(opcao);
        });

        ano.disabled = false;
        exibirMensagem("");

    } catch (erro) {
        limparSelect(ano, "Erro ao carregar anos");
        exibirMensagem(erro.message);
    }
}

async function consultarPreco() {
    if (!ano.value) return;

    consultar.disabled = true;
    consultar.textContent = "Consultando...";
    exibirMensagem("");

    try {
        const dados = await buscarDados(
            `${API}/${tipo.value}/brands/${marca.value}/models/${modelo.value}/years/${ano.value}`
        );

        document.getElementById("preco").textContent = dados.price;
        document.getElementById("resultadoMarca").textContent = dados.brand;
        document.getElementById("resultadoModelo").textContent = dados.model;
        document.getElementById("resultadoAno").textContent = dados.modelYear;
        document.getElementById("resultadoCombustivel").textContent = dados.fuel;
        document.getElementById("codigoFipe").textContent = dados.codeFipe;
        document.getElementById("referencia").textContent = dados.referenceMonth;

        resultado.hidden = false;

    } catch (erro) {
        exibirMensagem("Erro ao consultar o preço. Tente novamente.");
        console.error(erro);

    } finally {
        consultar.disabled = false;
        consultar.textContent = "Consultar preço";
    }
}

tipo.addEventListener("change", carregarMarcas);
marca.addEventListener("change", carregarModelos);
modelo.addEventListener("change", carregarAnos);
ano.addEventListener("change", () => {
    consultar.disabled = !ano.value;
});
consultar.addEventListener("click", consultarPreco);

// Iniciar sistema
carregarMarcas();
