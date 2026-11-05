import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, RotateCcw } from "lucide-react";

const perguntas = [
  "Qual é a palavra-chave utilizada nesta oficina para identificar em qual etapa do projeto — ou de uma etapa específica do desenvolvimento — nos permite saber onde estamos?",
  "Como é chamado o procedimento de enviar uma alteração de código para o GitHub e solicitar sua revisão e aprovação antes de integrá-la à branch de produção (main/master)?",
  "Qual o nome da plataforma usada aqui na oficina para conectar com o banco de dados?",
  "Qual o nome da empresa oficial responsável pela criação e distribuição da ferramenta do Codex?",
  "Qual o nome da empresa oficial responsável pela criação e distribuição da ferramenta do Claude Code?"
];

export default function Questionario() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<string[]>(() => perguntas.map(() => ""));
  const [revisao, setRevisao] = useState(false);
  const respondidas = respostas.filter(r => r.trim()).length;

  function alterarResposta(valor: string) {
    setRespostas(atual => atual.map((r, i) => i === etapa ? valor : r));
  }
  function reiniciar() {
    setEtapa(0);
    setRespostas(perguntas.map(() => ""));
    setRevisao(false);
  }

  return <section className="wizard-card" aria-label="Questionário da oficina">
    <div className="wizard-topline">
      <span className="wizard-label"><ClipboardList size={16} /> QUESTIONÁRIO DA OFICINA</span>
      <span className="wizard-count">{revisao ? "Revisão final" : `Pergunta ${etapa + 1} de ${perguntas.length}`}</span>
    </div>
    <div className="wizard-progress" role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={perguntas.length} aria-valuenow={revisao ? perguntas.length : etapa + 1}>
      <span style={{ width: `${(revisao ? perguntas.length : etapa + 1) / perguntas.length * 100}%` }} />
    </div>
    {!revisao ? <>
      <div className="wizard-question">
        <span className="wizard-step-number">{String(etapa + 1).padStart(2, "0")}</span>
        <h2 id="wizard-pergunta">{perguntas[etapa]}</h2>
        <label htmlFor="wizard-resposta">Sua resposta</label>
        <textarea
          id="wizard-resposta"
          aria-labelledby="wizard-pergunta"
          placeholder="Escreva sua resposta aqui..."
          value={respostas[etapa]}
          onChange={e => alterarResposta(e.target.value)}
          rows={4}
          maxLength={1000}
        />
        <p className="wizard-hint">Respostas livres, sem alternativas. Você pode voltar e editar a qualquer momento.</p>
      </div>
      <div className="wizard-actions">
        <button type="button" className="wizard-secondary" onClick={() => setEtapa(n => Math.max(0, n - 1))} disabled={etapa === 0}><ArrowLeft size={17}/> Anterior</button>
        <button type="button" className="wizard-primary" disabled={!respostas[etapa].trim()} onClick={() => etapa === perguntas.length - 1 ? setRevisao(true) : setEtapa(n => n + 1)}>
          {etapa === perguntas.length - 1 ? "Revisar respostas" : "Próxima pergunta"} <ArrowRight size={17}/>
        </button>
      </div>
    </> : <>
      <div className="wizard-review-head">
        <CheckCircle2 size={30}/>
        <h2>Revise suas respostas</h2>
        <p>{respondidas} de {perguntas.length} perguntas respondidas. Nenhuma resposta foi enviada ou gravada no banco.</p>
      </div>
      <div className="wizard-review-list">
        {perguntas.map((pergunta, index) => <div className="wizard-review-item" key={index}>
          <span>PERGUNTA {String(index + 1).padStart(2, "0")}</span>
          <strong>{pergunta}</strong>
          <p>{respostas[index] || "Sem resposta"}</p>
          <button type="button" onClick={() => { setEtapa(index); setRevisao(false); }}>Editar resposta</button>
        </div>)}
      </div>
      <div className="wizard-actions">
        <button type="button" className="wizard-secondary" onClick={() => {setRevisao(false);setEtapa(perguntas.length - 1);}}><ArrowLeft size={17}/> Voltar</button>
        <button type="button" className="wizard-primary" onClick={reiniciar}><RotateCcw size={17}/> Reiniciar questionário</button>
      </div>
    </>}
    <div className="wizard-footnote">Atividade de aprendizagem • {respondidas}/{perguntas.length} respondidas • sem envio de dados</div>
  </section>;
}
