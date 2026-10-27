import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");

    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });
  const [titulo, setTitulo] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [idEmEdicao, setIdEmEdicao] = useState(null);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);
  function adicionarTarefa(event) {
    event.preventDefault();

    if (titulo.trim() === "") {
      return;
    }

    const novaTarefa = {
      id: Date.now(),
      titulo: titulo,
    };

    setTarefas([...tarefas, novaTarefa]);
    setTitulo("");
  }
  function alternarConclusao(id) {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  }
  function excluirTarefa(id) {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  }

  function editarTarefa(id) {
    const tarefaSelecionada = tarefas.find((tarefa) => tarefa.id === id);

    if (tarefaSelecionada) {
      setTitulo(tarefaSelecionada.titulo);
      setIdEmEdicao(id);
    }
  }
  function salvarEdicao() {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === idEmEdicao ? { ...tarefa, titulo: titulo } : tarefa,
      ),
    );

    setTitulo("");
    setIdEmEdicao(null);
  }
  const totalTarefas = tarefas.length;

  const tarefasConcluidas = tarefas.filter((tarefa) => tarefa.concluida).length;

  const tarefasPendentes = totalTarefas - tarefasConcluidas;
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "pendentes") {
      return !tarefa.concluida;
    }

    if (filtro === "concluidas") {
      return tarefa.concluida;
    }

    return true;
  });

  return (
    <main className="container">
      <header className="cabecalho">
        <h1>Gerenciador de Tarefas</h1>
        <p>Organize suas tarefas e acompanhe seu progresso.</p>
      </header>

      <section className="formulario">
        <h2>Adicionar tarefa</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (idEmEdicao !== null) {
              salvarEdicao();
            } else {
              adicionarTarefa(event);
            }
          }}
        >
          <input
            type="text"
            placeholder="Digite o nome da tarefa..."
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
          />

          <button type="submit">
            {idEmEdicao !== null ? "Salvar edição" : "Adicionar"}
          </button>
        </form>
      </section>

      <section className="lista-tarefas">
        <h2>Minhas tarefas</h2>
        <div className="resumo-tarefas">
          <p>
            Total: <strong>{totalTarefas}</strong>
          </p>
          <p>
            Pendentes: <strong>{tarefasPendentes}</strong>
          </p>
          <p>
            Concluídas: <strong>{tarefasConcluidas}</strong>
          </p>
        </div>

        <div className="filtros">
          <button
            type="button"
            className={filtro === "todas" ? "filtro-ativo" : ""}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>

          <button
            type="button"
            className={filtro === "pendentes" ? "filtro-ativo" : ""}
            onClick={() => setFiltro("pendentes")}
          >
            Pendentes
          </button>

          <button
            type="button"
            className={filtro === "concluidas" ? "filtro-ativo" : ""}
            onClick={() => setFiltro("concluidas")}
          >
            Concluídas
          </button>
        </div>

        {tarefasFiltradas.length === 0 ? (
          <p className="mensagem-vazia">Nenhuma tarefa cadastrada ainda.</p>
        ) : (
          <ul>
            {tarefasFiltradas.map((tarefa) => (
              <li key={tarefa.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(tarefa.concluida)}
                    onChange={() => alternarConclusao(tarefa.id)}
                  />

                  <span className={tarefa.concluida ? "concluida" : ""}>
                    {tarefa.titulo}
                  </span>
                </label>
                <button
                  type="button"
                  className="botao-editar"
                  onClick={() => editarTarefa(tarefa.id)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="botao-excluir"
                  onClick={() => excluirTarefa(tarefa.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
