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

// Elementos de avisos, confirmação e edição de curso.
const avisos = document.getElementById("avisos");
const dialogoConfirmacao = document.getElementById("dialogoConfirmacao");
const tituloDialogo = document.getElementById("tituloDialogo");
const textoDialogo = document.getElementById("textoDialogo");
const botaoConfirmarExclusao = document.getElementById("botaoConfirmarExclusao");
const botaoCancelarExclusao = document.getElementById("botaoCancelarExclusao");
const cursoIdEdicao = document.getElementById("cursoIdEdicao");
const tituloFormularioCurso = document.getElementById("tituloFormularioCurso");
const botaoSalvarCurso = document.getElementById("botaoSalvarCurso");
const botaoCancelarEdicao = document.getElementById("botaoCancelarEdicao");


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
        mostrarAviso(
            "Não foi possível salvar os dados. A imagem pode ser muito grande para o armazenamento deste navegador.",
            "erro"
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
   AVISOS E CONFIRMAÇÃO
   Mensagens dentro da página e janela de confirmação.
   ================================================== */

function mostrarAviso(mensagem, tipo) {
    const tipoAviso = tipo || "sucesso";
    const aviso = document.createElement("div");
    aviso.className = "aviso aviso-" + tipoAviso;

    // O símbolo reforça o tipo do aviso, sem depender só da cor.
    const simbolo = document.createElement("span");
    simbolo.className = "aviso-simbolo";
    simbolo.setAttribute("aria-hidden", "true");
    simbolo.textContent = tipoAviso === "erro" ? "!" : (tipoAviso === "info" ? "i" : "✓");

    const texto = document.createElement("span");
    texto.className = "aviso-texto";
    texto.textContent = mensagem;

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "aviso-fechar";
    fechar.setAttribute("aria-label", "Fechar aviso");
    fechar.textContent = "×";
    fechar.addEventListener("click", function() {
        aviso.remove();
    });

    aviso.appendChild(simbolo);
    aviso.appendChild(texto);
    aviso.appendChild(fechar);
    avisos.appendChild(aviso);

    setTimeout(function() {
        aviso.remove();
    }, tipoAviso === "erro" ? 8000 : 5000);
}

function confirmarAcao(titulo, texto, rotuloConfirmar) {
    return new Promise(function(resolver) {
        tituloDialogo.textContent = titulo;
        textoDialogo.textContent = texto;
        botaoConfirmarExclusao.textContent = rotuloConfirmar;
        dialogoConfirmacao.returnValue = "";

        function aoFechar() {
            dialogoConfirmacao.removeEventListener("close", aoFechar);
            resolver(dialogoConfirmacao.returnValue === "sim");
        }

        dialogoConfirmacao.addEventListener("close", aoFechar);
        dialogoConfirmacao.showModal();
    });
}

botaoConfirmarExclusao.addEventListener("click", function() {
    dialogoConfirmacao.close("sim");
});

botaoCancelarExclusao.addEventListener("click", function() {
    dialogoConfirmacao.close("nao");
});


/* ==================================================
   UPLOAD E PRÉVIA DA IMAGEM
   Lê a imagem escolhida antes do cadastro.
   ================================================== */

let imagemSelecionada = "";

function exibirPrevia(origem) {
    previaImagemCurso.innerHTML = "";

    const imagem = document.createElement("img");
    imagem.src = origem;
    imagem.alt = "Prévia da imagem do curso";

    previaImagemCurso.appendChild(imagem);
}

function limparPreviaImagem() {
    previaImagemCurso.innerHTML = "";
    imagemSelecionada = "";
}

function mostrarPreviaImagem(arquivo) {
    limparPreviaImagem();

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        mostrarAviso("Escolha um arquivo de imagem válido.", "erro");
        imagemCurso.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.addEventListener("load", function() {
        imagemSelecionada = leitor.result;
        exibirPrevia(imagemSelecionada);
        mostrarAviso("Imagem selecionada com sucesso.");
    });

    leitor.addEventListener("error", function() {
        mostrarAviso("Não foi possível ler esta imagem.", "erro");
        imagemCurso.value = "";
    });

    // Converte a imagem em texto para permitir o uso no localStorage.
    leitor.readAsDataURL(arquivo);
}

imagemCurso.addEventListener("change", function() {
    mostrarPreviaImagem(imagemCurso.files[0]);
});


/* ==================================================
   CARTÕES DE CURSO
   Cria o cartão visual de cada oportunidade cadastrada.
   ================================================== */

function ehLinkSeguro(texto) {
    try {
        const endereco = new URL(texto);
        return endereco.protocol === "https:" || endereco.protocol === "http:";
    } catch (erro) {
        return false;
    }
}

function adicionarLocal(container, texto) {
    const paragrafo = document.createElement("p");
    const destaque = document.createElement("strong");

    destaque.textContent = "Local ou link das aulas: ";
    paragrafo.appendChild(destaque);

    if (texto && ehLinkSeguro(texto)) {
        const link = document.createElement("a");
        link.href = texto;
        link.textContent = texto;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        paragrafo.appendChild(link);
    } else {
        paragrafo.appendChild(criarTexto(texto || "Não informado"));
    }

    container.appendChild(paragrafo);
}

function criarBotaoAcao(texto, acao, curso, classe) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "botao-acao " + classe;
    botao.dataset.acao = acao;
    botao.dataset.id = curso.id;
    botao.textContent = texto;
    botao.setAttribute("aria-label", texto + " o curso " + curso.titulo);

    return botao;
}

function criarDetalhesCurso(curso) {
    const conteudos = Array.isArray(curso.conteudos) ? curso.conteudos : [];
    const temDetalhes = conteudos.length > 0 || curso.duracao || curso.requisitos || curso.local;

    // Cursos cadastrados antes desta versão não têm esses campos.
    if (!temDetalhes) {
        return null;
    }

    const detalhes = document.createElement("details");
    detalhes.className = "detalhes-curso";

    const resumo = document.createElement("summary");
    resumo.textContent = "Ver detalhes do curso";
    detalhes.appendChild(resumo);

    if (conteudos.length > 0) {
        const subtitulo = document.createElement("h4");
        subtitulo.textContent = "Conteúdos aprendidos";
        detalhes.appendChild(subtitulo);

        const lista = document.createElement("ul");

        conteudos.forEach(function(conteudo) {
            const item = document.createElement("li");
            item.textContent = conteudo;
            lista.appendChild(item);
        });

        detalhes.appendChild(lista);
    }

    adicionarInformacao(detalhes, "Duração", curso.duracao || "Não informado");
    adicionarInformacao(detalhes, "Requisitos", curso.requisitos || "Não informado");
    adicionarLocal(detalhes, curso.local);

    return detalhes;
}

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

    if (curso.descricao) {
        const descricao = document.createElement("p");
        descricao.className = "descricao-curso";
        descricao.textContent = curso.descricao;
        cartao.appendChild(descricao);
    }

    adicionarInformacao(cartao, "Categoria", curso.categoria);
    adicionarInformacao(cartao, "Modalidade", curso.modalidade);
    adicionarInformacao(cartao, "Vagas disponíveis", vagasDisponiveis);
    adicionarInformacao(cartao, "Disponibilizado em", formatarData(curso.data));

    const detalhes = criarDetalhesCurso(curso);

    if (detalhes) {
        cartao.appendChild(detalhes);
    }

    const botaoInscricao = document.createElement("button");
    botaoInscricao.type = "button";
    botaoInscricao.className = "botao-inscricao";
    botaoInscricao.dataset.acao = "inscrever";
    botaoInscricao.dataset.id = curso.id;

    if (vagasDisponiveis === 0) {
        botaoInscricao.textContent = "Vagas esgotadas";
        botaoInscricao.disabled = true;
    } else {
        botaoInscricao.textContent = "Quero me inscrever";
    }

    cartao.appendChild(botaoInscricao);

    const acoes = document.createElement("div");
    acoes.className = "acoes-cartao";
    acoes.appendChild(criarBotaoAcao("Editar", "editar", curso, "botao-editar"));
    acoes.appendChild(criarBotaoAcao("Excluir", "excluir", curso, "botao-excluir"));
    cartao.appendChild(acoes);

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
   CADASTRO, EDIÇÃO E EXCLUSÃO DE CURSOS
   Salva, altera e remove os cursos do localStorage.
   ================================================== */

function buscarCurso(id) {
    return lerCursos().find(function(curso) {
        return curso.id === id;
    });
}

function sairModoEdicao() {
    cursoIdEdicao.value = "";
    formularioCadastroCurso.reset();
    limparPreviaImagem();

    tituloFormularioCurso.textContent = "Disponibilizar um curso";
    botaoSalvarCurso.textContent = "Disponibilizar curso";
    botaoCancelarEdicao.hidden = true;
}

function iniciarEdicaoCurso(id) {
    const curso = buscarCurso(id);

    if (!curso) {
        mostrarAviso("Não foi possível encontrar este curso.", "erro");
        return;
    }

    cursoIdEdicao.value = curso.id;
    document.getElementById("tituloCurso").value = curso.titulo;
    document.getElementById("categoriaCurso").value = curso.categoria;
    document.getElementById("vagasCurso").value = curso.vagas;
    document.getElementById("modalidadeCurso").value = curso.modalidade;
    document.getElementById("descricaoCurso").value = curso.descricao || "";
    document.getElementById("conteudosCurso").value = (curso.conteudos || []).join("\n");
    document.getElementById("duracaoCurso").value = curso.duracao || "";
    document.getElementById("requisitosCurso").value = curso.requisitos || "";
    document.getElementById("localCurso").value = curso.local || "";

    // Mantém a imagem atual, a menos que uma nova seja escolhida.
    imagemCurso.value = "";
    imagemSelecionada = curso.imagem || "";
    previaImagemCurso.innerHTML = "";

    if (imagemSelecionada) {
        exibirPrevia(imagemSelecionada);
    }

    tituloFormularioCurso.textContent = "Editar curso";
    botaoSalvarCurso.textContent = "Salvar alterações";
    botaoCancelarEdicao.hidden = false;

    document.getElementById("cadastro-curso").scrollIntoView({ behavior: "smooth" });
    document.getElementById("tituloCurso").focus({ preventScroll: true });
    mostrarAviso("Você está editando o curso. Salve ou cancele a edição.", "info");
}

async function excluirCurso(id) {
    const curso = buscarCurso(id);

    if (!curso) {
        mostrarAviso("Não foi possível encontrar este curso.", "erro");
        return;
    }

    const totalInscricoes = contarInscricoesDoCurso(id);
    const texto = totalInscricoes > 0
        ? "O curso \"" + curso.titulo + "\" tem " + totalInscricoes +
          " inscrição(ões) neste navegador, que também serão apagadas. Esta ação não pode ser desfeita."
        : "O curso \"" + curso.titulo + "\" será removido. Esta ação não pode ser desfeita.";

    const confirmou = await confirmarAcao(
        "Tem certeza de que deseja excluir este curso?",
        texto,
        "Sim, excluir"
    );

    if (!confirmou) {
        return;
    }

    // Anima a saída do cartão antes de remover o curso.
    const botaoExcluir = listaCursos.querySelector(
        'button[data-acao="excluir"][data-id="' + id + '"]'
    );
    const cartaoCurso = botaoExcluir ? botaoExcluir.closest(".cartao-curso") : null;

    if (cartaoCurso) {
        cartaoCurso.classList.add("saindo");
        await new Promise(function(resolver) {
            setTimeout(resolver, 350);
        });
    }

    const cursosRestantes = lerCursos().filter(function(item) {
        return item.id !== id;
    });

    if (!gravarCursos(cursosRestantes)) {
        return;
    }

    if (totalInscricoes > 0) {
        gravarInscricoes(lerInscricoes().filter(function(inscricao) {
            return inscricao.cursoId !== id;
        }));
    }

    // Fecha formulários que ainda usavam o curso excluído.
    if (cursoIdEdicao.value === id) {
        sairModoEdicao();
    }

    if (cursoIdInscricao.value === id) {
        formularioInscricao.reset();
        fecharFormularioInscricao();
    }

    mostrarCursos();
    mostrarInscricoes();
    mostrarAviso("Curso excluído com sucesso.");
}

botaoCancelarEdicao.addEventListener("click", function() {
    sairModoEdicao();
    mostrarAviso("Edição cancelada.", "info");
});

formularioCadastroCurso.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const idEdicao = cursoIdEdicao.value;

    const dados = {
        titulo: document.getElementById("tituloCurso").value.trim(),
        categoria: document.getElementById("categoriaCurso").value,
        vagas: Number(document.getElementById("vagasCurso").value),
        modalidade: document.getElementById("modalidadeCurso").value,
        descricao: document.getElementById("descricaoCurso").value.trim(),
        conteudos: document.getElementById("conteudosCurso").value
            .split("\n")
            .map(function(linha) { return linha.trim(); })
            .filter(function(linha) { return linha !== ""; }),
        duracao: document.getElementById("duracaoCurso").value.trim(),
        requisitos: document.getElementById("requisitosCurso").value.trim(),
        local: document.getElementById("localCurso").value.trim(),
        imagem: imagemSelecionada
    };

    if (dados.vagas < 1) {
        mostrarAviso("A quantidade de vagas deve ser maior que zero.", "erro");
        return;
    }

    const cursos = lerCursos();

    if (idEdicao) {
        const posicao = cursos.findIndex(function(curso) {
            return curso.id === idEdicao;
        });

        if (posicao === -1) {
            mostrarAviso("Este curso não existe mais.", "erro");
            sairModoEdicao();
            mostrarCursos();
            return;
        }

        // O total de vagas não pode ficar menor que as inscrições já feitas.
        const inscritos = contarInscricoesDoCurso(idEdicao);

        if (dados.vagas < inscritos) {
            mostrarAviso(
                "Este curso já tem " + inscritos + " inscrição(ões). O total de vagas não pode ser menor que isso.",
                "erro"
            );
            return;
        }

        cursos[posicao] = Object.assign({}, cursos[posicao], dados);

        if (!gravarCursos(cursos)) {
            return;
        }

        // Mantém o nome do curso atualizado nas inscrições já feitas.
        const inscricoes = lerInscricoes();

        inscricoes.forEach(function(inscricao) {
            if (inscricao.cursoId === idEdicao) {
                inscricao.cursoTitulo = dados.titulo;
            }
        });

        gravarInscricoes(inscricoes);
        sairModoEdicao();
        mostrarCursos();
        mostrarInscricoes();
        mostrarAviso("Curso atualizado com sucesso.");
    } else {
        cursos.unshift(Object.assign({
            id: criarId(),
            data: new Date().toISOString()
        }, dados));

        if (!gravarCursos(cursos)) {
            return;
        }

        sairModoEdicao();
        mostrarCursos();
        mostrarAviso("Curso cadastrado com sucesso.");
    }

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
        mostrarAviso("Não foi possível encontrar este curso.", "erro");
        return;
    }

    const vagasDisponiveis = calcularVagasDisponiveis(curso);

    if (vagasDisponiveis === 0) {
        mostrarAviso("As vagas deste curso já estão esgotadas.", "erro");
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
    const botao = evento.target.closest("button[data-acao]");

    if (!botao || botao.disabled) {
        return;
    }

    const id = botao.dataset.id;
    const acao = botao.dataset.acao;

    if (acao === "inscrever") {
        abrirFormularioInscricao(id);
    } else if (acao === "editar") {
        iniciarEdicaoCurso(id);
    } else if (acao === "excluir") {
        excluirCurso(id);
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
        mostrarAviso("Curso não encontrado.", "erro");
        return;
    }

    if (calcularVagasDisponiveis(curso) === 0) {
        mostrarAviso("As vagas deste curso acabaram.", "erro");
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
        mostrarAviso("Este e-mail já está inscrito neste curso.", "erro");
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

    mostrarAviso("Inscrição realizada com sucesso!", "sucesso");
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