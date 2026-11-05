import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Eye, RotateCcw, Delete } from "lucide-react";

const perguntas = [
  {
    texto: "Qual é a palavra-chave utilizada nesta oficina para identificar em qual etapa do projeto — ou de uma etapa específica do desenvolvimento — nos permite saber onde estamos?",
    resposta: "CHECKPOINTS"
  },
  {
    texto: "Como é chamado o procedimento de enviar uma alteração de código para o GitHub e solicitar sua revisão e aprovação antes de integrá-la à branch de produção (main/master)?",
    resposta: "PULLREQUEST"
  },
  {
    texto: "Qual o nome da plataforma usada aqui na oficina para conectar com o banco de dados?",
    resposta: "SUPABASE"
  },
  {
    texto: "Qual o nome da empresa oficial responsável pela criação e distribuição da ferramenta do Codex?",
    resposta: "OPENAI"
  },
  {
    texto: "Qual o nome da empresa oficial responsável pela criação e distribuição da ferramenta do Claude Code?",
    resposta: "ANTHROPIC"
  }
];

// Embaralhamento determinístico por pergunta: evita mudanças nas letras a cada clique.
function embaralhar(palavra: string, indice: number): string[] {
  const letras = palavra.split("");
  let seed = (indice + 1) * 7919;
  for (let i = letras.length - 1; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [letras[i], letras[j]] = [letras[j], letras[i]];
  }
  if (letras.join("") === palavra) letras.push(letras.shift()!);
  return letras;
}

const desafios = perguntas.map((pergunta, indice) => ({
  ...pergunta,
  letras: embaralhar(pergunta.resposta, indice)
}));

type Tentativa = { selecionadas: number[]; revelada: boolean };
const inicial = (): Tentativa[] => desafios.map(() => ({ selecionadas: [], revelada: false }));

export default function Questionario() {
  const [etapa, setEtapa] = useState(0);
  const [tentativas, setTentativas] = useState<Tentativa[]>(inicial);
  const [concluido, setConcluido] = useState(false);

  const desafio = desafios[etapa];
  const atual = tentativas[etapa];
  const respostaMontada = atual.selecionadas.map(i => desafio.letras[i]).join("");
  const acertou = respostaMontada === desafio.resposta;
  const progresso = tentativas.filter(t => t.revelada).length;

  function atualizar(selecionadas: number[]) {
    setTentativas(anteriores => anteriores.map((t, i) => i === etapa ? { ...t, selecionadas } : t));
  }

  function escolherLetra(indice: number) {
    if (atual.revelada || atual.selecionadas.includes(indice)) return;
    atualizar([...atual.selecionadas, indice]);
  }

  function retirarLetra(posicao: number) {
    if (atual.revelada) return;
    atualizar(atual.selecionadas.filter((_, i) => i !== posicao));
  }

  function revelar() {
    setTentativas(anteriores => anteriores.map((t, i) => i === etapa ? { ...t, revelada: true } : t));
  }

  function proximo() {
    if (!atual.revelada) return;
    if (etapa === desafios.length - 1) setConcluido(true);
    else setEtapa(i => i + 1);
  }

  function reiniciar() {
    setEtapa(0);
    setTentativas(inicial());
    setConcluido(false);
  }

  return <section className="wizard-card anagram-wizard" aria-label="Questionário em anagrama da oficina">
    <div className="wizard-topline">
      <span className="wizard-label"><ClipboardList size={16}/> DESAFIO DE ANAGRAMAS</span>
      <span className="wizard-count">{concluido ? "Concluído" : `Pergunta ${etapa + 1} de ${desafios.length}`}</span>
    </div>
    <div className="wizard-progress" role="progressbar" aria-label="Etapas reveladas" aria-valuemin={0} aria-valuemax={desafios.length} aria-valuenow={progresso}>
      <span style={{ width: `${progresso / desafios.length * 100}%` }}/>
    </div>

    {!concluido ? <>
      <div className="wizard-question">
        <span className="wizard-step-number">{String(etapa + 1).padStart(2, "0")}</span>
        <h2 id="wizard-pergunta">{desafio.texto}</h2>
        <div className="anagram-heading"><strong>Monte a palavra, letra por letra</strong><span>{respostaMontada.length} / {desafio.resposta.length} letras</span></div>
        <div className="anagram-slots" aria-label="Sua resposta formada">
          {desafio.resposta.split("").map((_, posicao) => (
            <button
              type="button"
              key={posicao}
              className={`anagram-slot ${atual.revelada ? "is-revealed" : ""} ${atual.selecionadas[posicao] !== undefined ? "is-filled" : ""}`}
              aria-label={`Posição ${posicao + 1}: ${atual.revelada ? desafio.resposta[posicao] : atual.selecionadas[posicao] !== undefined ? desafio.letras[atual.selecionadas[posicao]] : "vazia"}`}
              title={atual.revelada ? "Resposta revelada" : "Clique para remover esta letra"}
              onClick={() => retirarLetra(posicao)}
              disabled={atual.revelada || atual.selecionadas[posicao] === undefined}
            >
              {atual.revelada ? desafio.resposta[posicao] : atual.selecionadas[posicao] !== undefined ? desafio.letras[atual.selecionadas[posicao]] : ""}
            </button>
          ))}
        </div>
        <p className="wizard-hint">Selecione as letras abaixo na ordem correta. Toque numa letra preenchida para removê-la.</p>
        <div className="anagram-tiles" aria-label="Letras embaralhadas disponíveis">
          {desafio.letras.map((letra, indice) => (
            <button type="button" key={indice} className="anagram-tile"
              disabled={atual.revelada || atual.selecionadas.includes(indice) || atual.selecionadas.length === desafio.resposta.length}
              onClick={() => escolherLetra(indice)} aria-label={`Selecionar letra ${letra}`}>{letra}</button>
          ))}
        </div>
        {!atual.revelada && <div className="anagram-tools">
          <button type="button" onClick={() => atualizar(atual.selecionadas.slice(0, -1))} disabled={!atual.selecionadas.length}><Delete size={16}/> Apagar última</button>
          <button type="button" onClick={() => atualizar([])} disabled={!atual.selecionadas.length}><RotateCcw size={16}/> Limpar</button>
        </div>}
        {atual.revelada && <div className="anagram-reveal" role="status">
          <CheckCircle2 size={23}/>
          <div>
            <strong>Resposta: {desafio.resposta}</strong>
            <p>{acertou ? "Você montou a palavra corretamente!" : "Resposta revelada. Agora você pode avançar para a próxima pergunta."}</p>
          </div>
        </div>}
      </div>
      <div className="wizard-actions">
        <button type="button" className="wizard-secondary" disabled={etapa === 0}
          onClick={() => setEtapa(i => Math.max(0, i - 1))}><ArrowLeft size={17}/> Anterior</button>
        {!atual.revelada ?
          <button type="button" className="wizard-primary" onClick={revelar}><Eye size={17}/> Exibir resposta</button> :
          <button type="button" className="wizard-primary" onClick={proximo}>
            {etapa === desafios.length - 1 ? "Concluir atividade" : "Próxima pergunta"} <ArrowRight size={17}/>
          </button>}
      </div>
    </> : <>
      <div className="wizard-review-head">
        <CheckCircle2 size={32}/>
        <h2>Desafio concluído!</h2>
        <p>Você percorreu os cinco anagramas da oficina. Confira as respostas abaixo.</p>
      </div>
      <div className="wizard-review-list">
        {desafios.map((item, i) => <div className="wizard-review-item" key={item.resposta}>
          <span>PERGUNTA {String(i + 1).padStart(2, "0")}</span>
          <strong>{item.texto}</strong>
          <p className="anagram-answer">{item.resposta}</p>
        </div>)}
      </div>
      <div className="wizard-actions">
        <button className="wizard-secondary" type="button" onClick={() => { setConcluido(false); setEtapa(desafios.length - 1); }}><ArrowLeft size={17}/> Voltar</button>
        <button className="wizard-primary" type="button" onClick={reiniciar}><RotateCcw size={17}/> Jogar novamente</button>
      </div>
    </>}
    <div className="wizard-footnote">Oficina Conexão • {progresso} de {desafios.length} respostas reveladas • atividade sem banco de dados</div>
  </section>;
}
