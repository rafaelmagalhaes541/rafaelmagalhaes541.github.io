document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    mostrarCarrinho();

    const filtro = document.querySelector("#filtrar");
    const ordenar = document.querySelector("#ordenar");
    const procurar = document.querySelector("#procurar");

    if (filtro) filtro.addEventListener("change", atualizarProdutos);
    if (ordenar) ordenar.addEventListener("change", atualizarProdutos);
    if (procurar) procurar.addEventListener("input", atualizarProdutos);
});

async function carregarProdutos() {
    try {
        const response = await fetch("https://deisishop.pythonanywhere.com/products");
        if (!response.ok) throw new Error("Falha ao carregar produtos");

        const produtos = await response.json();

        allProducts = produtos || [];

        atualizarProdutos();

        const secaoProdutos = document.querySelector("#produtos");
        secaoProdutos.innerHTML = "";

        produtos.forEach(produto => {
            const artigo = criarProduto(produto);
            secaoProdutos.appendChild(artigo);
        });

    } catch (error) {
        const secaoProdutos = document.querySelector("#produtos");
        secaoProdutos.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
    }
}

function atualizarProdutos() {
    const secaoProdutos = document.querySelector("#produtos");
    if (!secaoProdutos) return;

    let lista = JSON.parse(JSON.stringify(allProducts));

    // obter valores dos controlos (se existirem)
    const filtroEl = document.querySelector("#filtrar");
    const ordenarEl = document.querySelector("#ordenar");
    const procurarEl = document.querySelector("#procurar");

    const categoria = filtroEl.value;
    const termo = procurarEl.value.trim().toLowerCase();
    const ordem = ordenarEl.value;

    //Filtrar por categoria
    if (categoria) {
        lista = lista.filter(p => {
            // tenta várias propriedades possíveis para categoria
            const cat = (p.category || p.categoria || p.type || "").toString().toLowerCase();
            return cat === categoria.toString().toLowerCase();
        });
    }

    //Filtrar por termo de pesquisa (no título ou nome)
    if (termo) {
        lista = lista.filter(p => {
            const title = (p.title || p.name || "").toString().toLowerCase();
            return title.includes(termo);
        });
    }

    //Ordenar por preco
    if (ordem === "precoCrescente") {
        lista.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (ordem === "precoDecrescente") {
        lista.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    secaoProdutos.innerHTML = "";
    lista.forEach(produto => {
        const artigo = criarProduto(produto);
        secaoProdutos.appendChild(artigo);
    });

    // Se não houver produtos para mostrar, informa o utilizador
    if (lista.length === 0) {
        secaoProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
    }
}


function criarProduto(produto) {
    const artigo = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const preco = document.createElement("p");
    preco.textContent = `Preço: €${produto.price}`;

    const botao = document.createElement("button");
    botao.textContent = "Adicionar ao Carrinho";
    botao.addEventListener("click", () => adicionarAoCarrinho(produto));

    artigo.appendChild(titulo);
    artigo.appendChild(imagem);
    artigo.appendChild(descricao);
    artigo.appendChild(preco);
    artigo.appendChild(botao);

    return artigo;
}

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    carrinho.push(produto);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    mostrarCarrinho();
}

function mostrarCarrinho() {
    const idPreco = document.querySelector("#preco")
    const secCarrinho = document.querySelector("#carrinho");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    secCarrinho.innerHTML = "";

    carrinho.forEach((p, index) => {
        const item = document.createElement("article");

        const titulo = document.createElement("h3");
        titulo.textContent = p.title;

        const imagem = document.createElement("img");
        imagem.src = p.image;
        imagem.alt = p.title;

        const preco = document.createElement("p");
        preco.textContent = `Preço: €${p.price}`;

        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover do Carrinho";
        botaoRemover.addEventListener("click", () => removerDoCarrinho(index));

        item.append(titulo, imagem, preco, botaoRemover);
        secCarrinho.append(item);
    });

    idPreco.innerHTML = ""

    const total = carrinho.reduce((soma, p) => soma + p.price, 0);
    const totalEl = document.createElement("p");
    totalEl.textContent = `Total: €${total}`;
    idPreco.append(totalEl);
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    carrinho.splice(index, 1);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
}
