function passaPorAqui() {
    const titulo = document.querySelector('.Titulo')
    titulo.textContent = "Obrigada por teres passado por aqui ;)";
}

function naoEstaAqui() {
    const titulo = document.querySelector('.Titulo');
    titulo.textContent = "Passa por aqui!";
}

function mudaCor(cor) {
    const frase = document.querySelector('.frase')
    frase.style.color = cor;
}

let contador = 0;

function conta() {
    contador++;
    const texto = document.querySelector(".contador");
    texto.textContent = `Contador: ${contador}`;
}

function movimentoRato() {
    const seccao = document.querySelector("#interacaoRato");
    seccao.textContent = "O rato está a dançar!";
}
