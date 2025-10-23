document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos(produtos);
});

function carregarProdutos(produtos) {
    const secaoProdutos = document.querySelector("#produtos");

    produtos.forEach(produto => {

        const artigo = criarProduto(produto);

        secaoProdutos.appendChild(artigo);
    });
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

    // Inserir os elementos no <article>
    artigo.appendChild(titulo);
    artigo.appendChild(imagem);
    artigo.appendChild(descricao);
    artigo.appendChild(preco);

    return artigo;
}