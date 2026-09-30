/* ==================================================
   CONFIGURAÇÕES E ELEMENTOS DO SITE
   ================================================== */

// Chaves usadas para guardar os dados no localStorage.
const CHAVE_CURSOS = "educasim_cursos";
const CHAVE_INSCRICOES = "educasim_inscricoes";

// Elementos da navegação mobile.
const botaoMenu = document.getElementById("botaoMenu");
const menuPrincipal = document.getElementById("menuPrincipal");

// Elementos do cadastro e da listagem de cursos.
const formularioCadastroCurso = document.getElementById("formularioCadastroCurso");
const listaCursos = document.getElementById("listaCursos");
const imagemCurso = document.getElementById("imagemCurso");
const previaImagemCurso = document.getElementById("previaImagemCurso");

// Elementos de busca e filtro.
const buscaCurso = document.getElementById("buscaCurso");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroModalidade = document.getElementById("filtroModalidade");

// Elementos do formulário de inscrição.
const formularioInscricao = document.getElementById("formularioInscricao");
const areaInscricao = document.getElementById("area-inscricao");
const cursoSelecionado = document.getElementById("cursoSelecionado");
const cursoIdInscricao = document.getElementById("cursoIdInscricao");
const botaoCancelarInscricao = document.getElementById("botaoCancelarInscricao");

// Elementos da lista de inscrições e dos indicadores.
const listaInscricoes = document.getElementById("listaInscricoes");
const indicadorCursos = document.getElementById("indicadorCursos");
const indicadorVagas = document.getElementById("indicadorVagas");
const indicadorInscricoes = document.getElementById("indicadorInscricoes");
const indicadorCadastros = document.getElementById("indicadorCadastros");


/* ==================================================
   MENU MOBILE
   Abre e fecha a navegação no celular.
   ================================================== */

function fecharMenuMobile() {
    // Retira a classe que mostra o menu.
    menuPrincipal.classList.remove("aberto");

    // Retira a aparência de botão aberto.
    botaoMenu.classList.remove("aberto");

    // Atualiza a informação para leitores de tela.
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu de navegação");
}

function alternarMenuMobile() {
    // Verifica se o menu está aberto neste momento.
    const menuEstaAberto = menuPrincipal.classList.toggle("aberto");

    // Faz o ícone acompanhar o estado do menu.
    botaoMenu.classList.toggle("aberto", menuEstaAberto);

    // Atualiza os atributos de acessibilidade.
    botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));
    botaoMenu.setAttribute(
        "aria-label",
        menuEstaAberto
            ? "Fechar menu de navegação"
            : "Abrir menu de navegação"
    );
}

// Abre ou fecha o menu quando o botão é clicado.
botaoMenu.addEventListener("click", alternarMenuMobile);

// Fecha o menu depois que um link é escolhido.
menuPrincipal.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", fecharMenuMobile);
});

// Fecha o menu quando a pessoa pressiona a tecla Escape.
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        fecharMenuMobile();
    }
});


/* ==================================================
   NAVBAR DURANTE A ROLAGEM
   Adiciona a aparência compacta definida no CSS.
   ================================================== */

const barraNavegacao = document.querySelector(".barra-navegacao");

function atualizarNavbar() {
    if (window.scrollY > 30) {
        barraNavegacao.classList.add("rolou");
    } else {
        barraNavegacao.classList.remove("rolou");
    }
}

window.addEventListener("scroll", atualizarNavbar, { passive: true });
atualizarNavbar();


/* ==================================================
   FUNÇÕES DO LOCALSTORAGE
   Lê e grava os dados no navegador.
   ================================================== */

function lerLista(chave) {
    const texto = localStorage.getItem(chave);

    if (!texto) {
        return [];
    }

    try {
        const lista = JSON.parse(texto);
        return Array.isArray(lista) ? lista : [];
    } catch (erro) {
        // Se houver um dado inválido, o site continua funcionando.
        return [];
    }
}

function gravarLista(chave, lista) {
    try {
        localStorage.setItem(chave, JSON.stringify(lista));
        return true;
    } catch (erro) {
        // Imagens grandes podem ultrapassar o espaço do localStorage.
        alert(
            "Não foi possível salvar os dados. A imagem pode ser muito grande para o armazenamento deste navegador."
        );
        return false;
    }
}

function lerCursos() {
    return lerLista(CHAVE_CURSOS);
}

function gravarCursos(cursos) {
    return gravarLista(CHAVE_CURSOS, cursos);
}

function lerInscricoes() {
    return lerLista(CHAVE_INSCRICOES);
}

function gravarInscricoes(inscricoes) {
    return gravarLista(CHAVE_INSCRICOES, inscricoes);
}


/* ==================================================
   FUNÇÕES AUXILIARES
   Reúnem tarefas usadas em várias partes do programa.
   ================================================== */

function criarId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

function formatarData(data) {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(new Date(data));
}

function criarTexto(texto) {
    const elemento = document.createElement("span");
    elemento.textContent = texto;
    return elemento;
}

function adicionarInformacao(cartao, nome, valor) {
    const paragrafo = document.createElement("p");
    const destaque = document.createElement("strong");

    destaque.textContent = nome + ": ";
    paragrafo.appendChild(destaque);
    paragrafo.appendChild(criarTexto(valor));
    cartao.appendChild(paragrafo);
}

function contarInscricoesDoCurso(cursoId) {
    return lerInscricoes().filter(function(inscricao) {
        return inscricao.cursoId === cursoId;
    }).length;
}

function calcularVagasDisponiveis(curso) {
    const vagasOcupadas = contarInscricoesDoCurso(curso.id);
    return Math.max(0, Number(curso.vagas) - vagasOcupadas);
}


/* ==================================================
   UPLOAD E PRÉVIA DA IMAGEM
   Lê a imagem escolhida antes do cadastro.
   ================================================== */

let imagemSelecionada = "";

function limparPreviaImagem() {
    previaImagemCurso.innerHTML = "";
    imagemSelecionada = "";
}

function mostrarPreviaImagem(arquivo) {
    // Limpa a prévia anterior antes de mostrar a nova.
    limparPreviaImagem();

    if (!arquivo) {
        return;
    }

    // Confere se o arquivo escolhido é realmente uma imagem.
    if (!arquivo.type.startsWith("image/")) {
        alert("Escolha um arquivo de imagem válido.");
        imagemCurso.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.addEventListener("load", function() {
        imagemSelecionada = leitor.result;

        const imagem = document.createElement("img");
        imagem.src = imagemSelecionada;
        imagem.alt = "Prévia da imagem do curso";

        previaImagemCurso.appendChild(imagem);
    });

    leitor.addEventListener("error", function() {
        alert("Não foi possível ler esta imagem.");
        imagemCurso.value = "";
    });

    // Converte a imagem em texto para permitir o uso no localStorage.
    leitor.readAsDataURL(arquivo);
}

imagemCurso.addEventListener("change", function() {
    const arquivo = imagemCurso.files[0];
    mostrarPreviaImagem(arquivo);
});


/* ==================================================
   CARTÕES DE CURSO
   Cria o cartão visual de cada oportunidade cadastrada.
   ================================================== */

function criarCartaoCurso(curso) {
    const vagasDisponiveis = calcularVagasDisponiveis(curso);
    const cartao = document.createElement("article");

    cartao.className = "cartao-curso";

    if (vagasDisponiveis === 0) {
        cartao.classList.add("curso-esgotado");
    }

    // Mostra a imagem somente quando o curso possui uma imagem salva.
    if (curso.imagem) {
        const imagem = document.createElement("img");
        imagem.className = "imagem-cartao-curso";
        imagem.src = curso.imagem;
        imagem.alt = "Imagem do curso " + curso.titulo;
        cartao.appendChild(imagem);
    }

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;
    cartao.appendChild(titulo);

    adicionarInformacao(cartao, "Categoria", curso.categoria);
    adicionarInformacao(cartao, "Modalidade", curso.modalidade);
    adicionarInformacao(cartao, "Vagas disponíveis", vagasDisponiveis);
    adicionarInformacao(cartao, "Disponibilizado em", formatarData(curso.data));

    const botaoInscricao = document.createElement("button");
    botaoInscricao.type = "button";
    botaoInscricao.className = "botao-inscricao";
    botaoInscricao.dataset.id = curso.id;

    if (vagasDisponiveis === 0) {
        botaoInscricao.textContent = "Vagas esgotadas";
        botaoInscricao.disabled = true;
    } else {
        botaoInscricao.textContent = "Quero me inscrever";
    }

    cartao.appendChild(botaoInscricao);
    return cartao;
}


/* ==================================================
   LISTAGEM, BUSCA E FILTROS
   Exibe os cursos conforme a pesquisa do visitante.
   ================================================== */

function mostrarCursos() {
    const cursos = lerCursos();
    const textoBusca = buscaCurso.value.trim().toLowerCase();
    const categoriaEscolhida = filtroCategoria.value;
    const modalidadeEscolhida = filtroModalidade.value;

    const cursosFiltrados = cursos.filter(function(curso) {
        const combinaBusca = curso.titulo.toLowerCase().includes(textoBusca);
        const combinaCategoria = !categoriaEscolhida || curso.categoria === categoriaEscolhida;
        const combinaModalidade = !modalidadeEscolhida || curso.modalidade === modalidadeEscolhida;

        return combinaBusca && combinaCategoria && combinaModalidade;
    });

    listaCursos.innerHTML = "";

    if (cursosFiltrados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = cursos.length === 0
            ? "Nenhum curso disponível no momento."
            : "Nenhum curso encontrado com esses filtros.";
        listaCursos.appendChild(mensagem);
        atualizarIndicadores();
        return;
    }

    cursosFiltrados.forEach(function(curso) {
        listaCursos.appendChild(criarCartaoCurso(curso));
    });

    atualizarIndicadores();
}

buscaCurso.addEventListener("input", mostrarCursos);
filtroCategoria.addEventListener("change", mostrarCursos);
filtroModalidade.addEventListener("change", mostrarCursos);


/* ==================================================
   CADASTRO DE CURSOS
   Salva título, imagem, categoria, vagas e modalidade.
   ================================================== */

formularioCadastroCurso.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const titulo = document.getElementById("tituloCurso").value.trim();
    const categoria = document.getElementById("categoriaCurso").value;
    const vagas = Number(document.getElementById("vagasCurso").value);
    const modalidade = document.getElementById("modalidadeCurso").value;

    if (vagas < 1) {
        alert("A quantidade de vagas deve ser maior que zero.");
        return;
    }

    const novoCurso = {
        id: criarId(),
        titulo: titulo,
        categoria: categoria,
        vagas: vagas,
        modalidade: modalidade,
        imagem: imagemSelecionada,
        data: new Date().toISOString()
    };

    const cursos = lerCursos();
    cursos.unshift(novoCurso);

    if (!gravarCursos(cursos)) {
        return;
    }

    formularioCadastroCurso.reset();
    limparPreviaImagem();
    mostrarCursos();

    alert("Curso disponibilizado com sucesso!");
    document.getElementById("cursos").scrollIntoView({ behavior: "smooth" });
});


/* ==================================================
   FORMULÁRIO DE INSCRIÇÃO
   Abre a inscrição e controla as vagas disponíveis.
   ================================================== */

function abrirFormularioInscricao(idCurso) {
    const curso = lerCursos().find(function(item) {
        return item.id === idCurso;
    });

    if (!curso) {
        alert("Não foi possível encontrar este curso.");
        return;
    }

    const vagasDisponiveis = calcularVagasDisponiveis(curso);

    if (vagasDisponiveis === 0) {
        alert("As vagas deste curso já estão esgotadas.");
        mostrarCursos();
        return;
    }

    cursoIdInscricao.value = curso.id;
    cursoSelecionado.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;

    const informacoes = document.createElement("p");
    informacoes.textContent =
        curso.categoria + " • " + curso.modalidade + " • " +
        vagasDisponiveis + " vaga(s) disponível(is)";

    cursoSelecionado.appendChild(titulo);
    cursoSelecionado.appendChild(informacoes);

    areaInscricao.hidden = false;
    areaInscricao.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("nomeCompleto").focus();
}

listaCursos.addEventListener("click", function(evento) {
    if (evento.target.classList.contains("botao-inscricao")) {
        abrirFormularioInscricao(evento.target.dataset.id);
    }
});

function fecharFormularioInscricao() {
    areaInscricao.hidden = true;
    cursoSelecionado.innerHTML = "";
    cursoIdInscricao.value = "";
}

botaoCancelarInscricao.addEventListener("click", function() {
    formularioInscricao.reset();
    fecharFormularioInscricao();
});

formularioInscricao.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const idCurso = cursoIdInscricao.value;
    const cursos = lerCursos();
    const curso = cursos.find(function(item) {
        return item.id === idCurso;
    });

    if (!curso) {
        alert("Curso não encontrado.");
        return;
    }

    if (calcularVagasDisponiveis(curso) === 0) {
        alert("As vagas deste curso acabaram.");
        fecharFormularioInscricao();
        mostrarCursos();
        return;
    }

    const email = document.getElementById("emailInscricao").value.trim().toLowerCase();
    const inscricoes = lerInscricoes();

    const inscricaoDuplicada = inscricoes.some(function(inscricao) {
        return inscricao.cursoId === idCurso && inscricao.email === email;
    });

    if (inscricaoDuplicada) {
        alert("Este e-mail já possui uma inscrição neste curso.");
        return;
    }

    const novaInscricao = {
        id: criarId(),
        cursoId: idCurso,
        cursoTitulo: curso.titulo,
        nome: document.getElementById("nomeCompleto").value.trim(),
        dataNascimento: document.getElementById("dataNascimento").value,
        email: email,
        telefone: document.getElementById("telefoneInscricao").value.trim(),
        cidade: document.getElementById("cidadeInscricao").value.trim(),
        escolaridade: document.getElementById("escolaridadeInscricao").value,
        data: new Date().toISOString()
    };

    inscricoes.unshift(novaInscricao);

    if (!gravarInscricoes(inscricoes)) {
        return;
    }

    formularioInscricao.reset();
    fecharFormularioInscricao();
    mostrarCursos();
    mostrarInscricoes();

    alert("Inscrição realizada com sucesso!");
    document.getElementById("minhas-inscricoes").scrollIntoView({ behavior: "smooth" });
});


/* ==================================================
   LISTA DE INSCRIÇÕES
   Mostra as inscrições guardadas neste navegador.
   ================================================== */

function mostrarInscricoes() {
    const inscricoes = lerInscricoes();
    listaInscricoes.innerHTML = "";

    if (inscricoes.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.className = "mensagem-vazia";
        mensagem.textContent = "Nenhuma inscrição realizada ainda.";
        listaInscricoes.appendChild(mensagem);
        atualizarIndicadores();
        return;
    }

    inscricoes.forEach(function(inscricao) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-inscricao";

        const titulo = document.createElement("h3");
        titulo.textContent = inscricao.cursoTitulo;
        cartao.appendChild(titulo);

        adicionarInformacao(cartao, "Nome", inscricao.nome);
        adicionarInformacao(cartao, "E-mail", inscricao.email);
        adicionarInformacao(cartao, "Cidade", inscricao.cidade);
        adicionarInformacao(cartao, "Inscrição realizada em", formatarData(inscricao.data));

        listaInscricoes.appendChild(cartao);
    });

    atualizarIndicadores();
}


/* ==================================================
   INDICADORES
   Calcula números usando apenas os dados cadastrados.
   ================================================== */

function atualizarIndicadores() {
    const cursos = lerCursos();
    const inscricoes = lerInscricoes();

    const totalVagas = cursos.reduce(function(total, curso) {
        return total + calcularVagasDisponiveis(curso);
    }, 0);

    const agora = new Date();
    const oitoSemanas = 8 * 7 * 24 * 60 * 60 * 1000;
    const dataInicial = new Date(agora.getTime() - oitoSemanas);

    const cursosNasOitoSemanas = cursos.filter(function(curso) {
        const dataCurso = new Date(curso.data);
        return dataCurso >= dataInicial && dataCurso <= agora;
    });

    indicadorCursos.textContent = cursos.length;
    indicadorVagas.textContent = totalVagas;
    indicadorInscricoes.textContent = inscricoes.length;
    indicadorCadastros.textContent = cursosNasOitoSemanas.length;
}


/* ==================================================
   INICIALIZAÇÃO
   Carrega cursos, inscrições e indicadores ao abrir a página.
   ================================================== */

mostrarCursos();
mostrarInscricoes();
atualizarIndicadores();
