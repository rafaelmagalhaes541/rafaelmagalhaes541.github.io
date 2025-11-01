// Executa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    mostrarCarrinho();

    const filtro = document.querySelector("#filtrar");
    const ordenar = document.querySelector("#ordenar");
    const procurar = document.querySelector("#procurar");

    // adiciona event listeners aos controlos se existirem
    if (filtro) filtro.addEventListener("change", atualizarProdutos);
    if (ordenar) ordenar.addEventListener("change", atualizarProdutos);
    if (procurar) procurar.addEventListener("input", atualizarProdutos);
});


// Função que busca produtos da API e inicializa a lista
async function carregarProdutos() {
    try {
        const response = await fetch("https://deisishop.pythonanywhere.com/products");

        const produtos = await response.json();

        // guarda os produtos na variável allProducts
        allProducts = produtos || [];

        // atualiza a visualização aplicando filtros
        atualizarProdutos();

        // seleciona a secção de produtos e limpa antes de popular
        const secaoProdutos = document.querySelector("#produtos");
        secaoProdutos.innerHTML = "";

        // percorre cada produto e cria um artigo para o DOM
        produtos.forEach(produto => {
            const artigo = criarProduto(produto);
            secaoProdutos.appendChild(artigo);
        });

    } catch (error) {
        // se ocorrer erro ao carregar mostra mensagem de erro na secção de produtos
        const secaoProdutos = document.querySelector("#produtos");
        secaoProdutos.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
    }
}


// Função que aplica filtros, pesquisa e ordenação e renderiza os produtos
function atualizarProdutos() {
    const secaoProdutos = document.querySelector("#produtos");
    if (!secaoProdutos) return;

    // cria uma cópia dos produtos originais para poder filtrar sem alterar o original
    let lista = JSON.parse(JSON.stringify(allProducts));

    // obter valores dos controlos
    const filtroEl = document.querySelector("#filtrar");
    const ordenarEl = document.querySelector("#ordenar");
    const procurarEl = document.querySelector("#procurar");

    const categoria = filtroEl.value;
    const termo = procurarEl.value.trim().toLowerCase();
    const ordem = ordenarEl.value;

    // Filtrar por categoria
    if (categoria) {
        lista = lista.filter(p => {
            const cat = (p.category || p.categoria || p.type || "").toString().toLowerCase();
            return cat === categoria.toString().toLowerCase();
        });
    }

    // Filtrar por termo de pesquisa no título/nome
    if (termo) {
        lista = lista.filter(p => {
            const title = (p.title || p.name || "").toString().toLowerCase();
            return title.includes(termo);
        });
    }

    // Ordenar por preço (crescente ou decrescente)
    if (ordem === "precoCrescente") {
        lista.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (ordem === "precoDecrescente") {
        lista.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    // Limpa a secção e renderiza a lista resultante
    secaoProdutos.innerHTML = "";
    lista.forEach(produto => {
        const artigo = criarProduto(produto);
        secaoProdutos.appendChild(artigo);
    });

    // Se não houver produtos para mostrar informa o utilizador
    if (lista.length === 0) {
        secaoProdutos.innerHTML = "<p>Nenhum produto encontrado.</p>";
    }
}


// Cria e devolve um elemento article com os dados do produto
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
    // ao clicar adiciona o produto ao carrinho (localStorage)
    botao.addEventListener("click", () => adicionarAoCarrinho(produto));

    // monta a estrutura do artigo
    artigo.appendChild(titulo);
    artigo.appendChild(imagem);
    artigo.appendChild(descricao);
    artigo.appendChild(preco);
    artigo.appendChild(botao);

    return artigo;
}


// Adiciona um produto ao carrinho guardado no localStorage
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // adiciona o produto ao array
    carrinho.push(produto);

    // salva o carrinho atualizado no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // atualiza a visualização do carrinho
    mostrarCarrinho();
}


// Renderiza os itens que estão no carrinho
function mostrarCarrinho() {
    const secCarrinho = document.querySelector("#carrinho");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    // limpa o conteúdo atual do carrinho no DOM
    secCarrinho.innerHTML = "";

    // para cada produto no carrinho, cria um artigo com título, imagem, preço e botão remover
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
        // ao clicar remove o item pelo índice
        botaoRemover.addEventListener("click", () => removerDoCarrinho(index));

        // adiciona os elementos ao article
        item.append(titulo, imagem, preco, botaoRemover);
        secCarrinho.append(item);
    });

    // Depois de listar os itens mostra a caixa de compra
    mostrarCaixaCompra(carrinho);
}


// Remove um item do carrinho pelo índice e atualiza o localStorage
function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // remove um elemento do array
    carrinho.splice(index, 1);

    // atualiza o localStorage e a visualização
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    mostrarCarrinho();
}


// Mostra a caixa de compra com total, opção estudante, campo cupão e botão comprar
function mostrarCaixaCompra(carrinho) {
    const secaoCarrinho = document.querySelector("#carrinho");
    if (!secaoCarrinho) return;

    // remove caixa anterior se existir 
    const antiga = document.querySelector("#caixa-compra");
    if (antiga) antiga.remove();

    // se não houver produtos não cria a caixa
    if (carrinho.length === 0) return;

    // calcula o total do carrinho
    const total = carrinho.reduce((soma, p) => soma + p.price, 0);

    // cria a secção caixa de compra
    const caixa = document.createElement("section");
    caixa.id = "caixa-compra";

    // título com o total formatado
    const titulo = document.createElement("h3");
    titulo.textContent = `Total: €${total.toFixed(2)}`;
    caixa.appendChild(titulo);

    // checkbox estudante
    const labelEstudante = document.createElement("label");
    labelEstudante.textContent = "És estudante do DEISI?";
    const checkEstudante = document.createElement("input");
    checkEstudante.type = "checkbox";
    labelEstudante.prepend(checkEstudante);
    caixa.appendChild(labelEstudante);

    // campo do cupão
    const labelCupao = document.createElement("label");
    labelCupao.textContent = " Cupão:";
    const inputCupao = document.createElement("input");
    inputCupao.placeholder = "Insere o código";
    labelCupao.appendChild(inputCupao);
    caixa.appendChild(labelCupao);

    // botão de comprar
    const botao = document.createElement("button");
    botao.textContent = "Comprar";
    caixa.appendChild(botao);

    // parágrafo para mostrar mensagens de estado
    const msg = document.createElement("p");
    caixa.appendChild(msg);

    // monta os dados e envia para a API /buy/
    botao.addEventListener("click", async () => {
        msg.textContent = "A processar compra...";

        // lista de ids, estudante e cupão
        let products = carrinho.map(p => p.id);
        let student = checkEstudante.checked;
        let coupon = inputCupao.value;
        let dados = { products, student, coupon };

        const url = "https://deisishop.pythonanywhere.com/buy/";

        // trata a resposta
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
            .then(resposta => resposta.json())
            .then(data => {
                // mostra o resultado recebido da API 
                msg.style.color = "black";
                msg.textContent = `Valor final a pagar (com eventuais descontos): ${data.totalCost}€ | Referência: ${data.reference}`;
            })
            .catch(() => {
                // em caso de erro, informa o utilizador
                msg.style.color = "red";
                msg.textContent = "Erro ao efetuar compra!";
            });
    });

    // adiciona a caixa ao fim da secção do carrinho
    secaoCarrinho.appendChild(caixa);
}
