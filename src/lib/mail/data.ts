import type { Attachment, Contact, Email, EmailCategory, MailboxId, SentStatus } from "./types";

const BASE = new Date("2026-09-02T13:40:00-03:00").getTime();
const hoursAgo = (h: number) => new Date(BASE - h * 3600_000).toISOString();

const senders = [
  ["Mariana Duarte", "mariana.duarte@bocanoticias.com.br", "Boca Notícias"],
  ["Rafael Lemos", "rafael.lemos@redacaoboca.com.br", "Redação Boca"],
  ["Camila Prado", "camila.prado@agenciaorbita.com", "Agência Órbita"],
  ["Bruno Tavares", "bruno.tavares@nexuspay.com.br", "NexusPay"],
  ["Helena Rocha", "helena.rocha@vertexlab.io", "Vertex Lab"],
  ["Diego Nogueira", "diego.nogueira@grupomeridiano.com", "Grupo Meridiano"],
  ["Patrícia Alencar", "patricia@alencaradv.com.br", "Alencar Advogados"],
  ["Thiago Barros", "thiago.barros@cloudsulhost.com", "CloudSul Host"],
  ["Juliana Nakamura", "juliana.nakamura@datafolhaanalytics.com", "Data Analytics"],
  ["Marcos Vinícius", "marcos.v@fornecedorprime.com.br", "Fornecedor Prime"],
] as const;

const subjects = [
  ["Fechamento editorial da edição de setembro", "Segue o espelho atualizado com as matérias confirmadas para a capa."],
  ["Revisão do contrato de publicidade — Q4", "Anexei a minuta com as cláusulas de veiculação revisadas pelo jurídico."],
  ["Relatório de audiência da semana", "A audiência do portal cresceu 18% em relação à semana anterior."],
  ["Pauta especial: eleições municipais", "Precisamos definir a equipe de cobertura até sexta-feira."],
  ["Fatura NexusPay #2291 disponível", "Sua fatura referente ao mês de agosto já pode ser visualizada."],
  ["Convite: reunião de planejamento 2027", "Reservei a sala Atlântico para quinta às 10h. Confirma presença?"],
  ["Nova versão do painel de assinaturas", "Publicamos a build 4.2 com melhorias de performance no checkout."],
  ["Proposta comercial — pacote de mídia", "Segue proposta com três cenários de investimento mensal."],
  ["Alerta de armazenamento da conta", "Sua caixa está com 78% de uso. Considere arquivar mensagens antigas."],
  ["Feedback da entrevista com o prefeito", "Ótimo material. Sugeri alguns cortes no trecho sobre orçamento."],
  ["Aprovação de arte para newsletter", "As duas versões estão em anexo, preciso do ok até amanhã."],
  ["Renovação do domínio bocamail.com.br", "O domínio vence em 30 dias. Deseja renovar automaticamente?"],
  ["Resumo financeiro de agosto", "Receita publicitária fechou 12% acima da meta do trimestre."],
  ["Checklist de migração de servidor", "Listei os passos e janelas de manutenção sugeridas para o time."],
  ["Pedido de pauta — leitor", "Recebemos uma denúncia sobre obras paradas no centro da cidade."],
] as const;

const bodies = (subject: string, sender: string): string[] => [
  `Olá, tudo bem?`,
  `Estou entrando em contato sobre "${subject}". Reuni abaixo os pontos principais para que possamos avançar sem retrabalho e manter o cronograma combinado na última reunião.`,
  `Os prazos seguem confirmados e a equipe já está alinhada. Caso precise de algum ajuste de escopo, me avise até o fim do dia para que eu possa reorganizar as entregas.`,
  `Qualquer dúvida, fico à disposição.`,
  `Abraço,\n${sender}`,
];

const attachmentPool: Attachment[][] = [
  [],
  [{ id: "a1", name: "proposta-comercial.pdf", size: "1,8 MB", type: "pdf" }],
  [
    { id: "a2", name: "relatorio-audiencia.xlsx", size: "642 KB", type: "sheet" },
    { id: "a3", name: "grafico-semanal.png", size: "310 KB", type: "image" },
  ],
  [{ id: "a4", name: "contrato-publicidade.docx", size: "94 KB", type: "doc" }],
  [{ id: "a5", name: "assets-newsletter.zip", size: "12,4 MB", type: "zip" }],
];

const categories: EmailCategory[] = ["principal", "principal", "promocoes", "social", "atualizacoes"];
const folders = ["Trabalho", "Clientes", "Importante", "Financeiro", "Projetos"];

const ME = { name: "Livio de Carvalho", email: "livio@bocamail.com.br" };

function make(
  id: string,
  mailbox: MailboxId,
  i: number,
  overrides: Partial<Email> = {},
): Email {
  const [name, email] = senders[i % senders.length];
  const [subject, preview] = subjects[i % subjects.length];
  return {
    id,
    mailbox,
    category: categories[i % categories.length],
    from: { name, email },
    to: [ME],
    cc: i % 4 === 0 ? [{ name: "Redação Boca", email: "redacao@bocamail.com.br" }] : undefined,
    subject,
    preview,
    body: bodies(subject, name),
    date: hoursAgo(i * 5 + 1),
    read: i % 3 !== 0,
    starred: false,
    important: i % 5 === 0,
    attachments: attachmentPool[i % attachmentPool.length],
    folder: i % 3 === 0 ? folders[i % folders.length] : undefined,
    ...overrides,
  };
}

const inbox: Email[] = Array.from({ length: 34 }, (_, i) =>
  make(`in-${i + 1}`, "inbox", i, { starred: i % 7 === 0 }),
);

const sentStatuses: SentStatus[] = ["entregue", "enviado", "entregue", "falha", "agendado"];
const sent: Email[] = Array.from({ length: 16 }, (_, i) => {
  const [name, email] = senders[(i + 3) % senders.length];
  const status = sentStatuses[i % sentStatuses.length];
  return make(`sent-${i + 1}`, "sent", i + 2, {
    from: ME,
    to: [{ name, email }],
    read: true,
    status,
    scheduledFor: status === "agendado" ? hoursAgo(-(i + 3) * 6) : undefined,
    date: hoursAgo(i * 9 + 2),
  });
});

const drafts: Email[] = Array.from({ length: 9 }, (_, i) => {
  const [name, email] = senders[(i + 5) % senders.length];
  return make(`draft-${i + 1}`, "drafts", i + 4, {
    from: ME,
    to: [{ name, email }],
    read: true,
    subject: i === 0 ? "(sem assunto)" : subjects[(i + 4) % subjects.length][0],
    preview: "Rascunho salvo automaticamente",
    date: hoursAgo(i * 11 + 3),
  });
});

const archived: Email[] = Array.from({ length: 12 }, (_, i) =>
  make(`arch-${i + 1}`, "archived", i + 1, { read: true, date: hoursAgo(i * 26 + 40) }),
);

const snoozed: Email[] = Array.from({ length: 6 }, (_, i) =>
  make(`snz-${i + 1}`, "snoozed", i + 6, {
    read: true,
    scheduledFor: hoursAgo(-(i + 1) * 20),
    date: hoursAgo(i * 30 + 60),
  }),
);

const spamSubjects = [
  ["Você foi selecionado para um prêmio de R$ 50.000", "Clique agora para resgatar antes que expire!!!"],
  ["Sua conta será bloqueada em 24 horas", "Confirme seus dados bancários imediatamente."],
  ["Investimento com 300% de retorno garantido", "Oportunidade exclusiva para poucos investidores."],
  ["Fatura em atraso — protesto em cartório", "Regularize agora pelo link abaixo."],
  ["Promoção relâmpago: iPhone por R$ 199", "Últimas 3 unidades disponíveis hoje."],
  ["Atualize sua senha corporativa", "Acesse o portal de recuperação em anexo."],
  ["Herança internacional não reclamada", "Sou advogado e preciso de sua colaboração urgente."],
  ["Certificado digital vencido", "Renove em 2 minutos com desconto especial."],
  ["Seu CPF foi consultado 4 vezes hoje", "Veja quem consultou seus dados agora."],
] as const;

const spam: Email[] = spamSubjects.map(([subject, preview], i) =>
  make(`spam-${i + 1}`, "spam", i, {
    subject,
    preview,
    from: { name: "Promo Alerta", email: `contato${i + 1}@ofertas-imperdiveis-br.net` },
    read: false,
    attachments: [],
    body: [preview, "Este é um exemplo de mensagem classificada como spam pelo BOCA MAIL."],
    date: hoursAgo(i * 7 + 2),
  }),
);

const trash: Email[] = Array.from({ length: 11 }, (_, i) =>
  make(`trash-${i + 1}`, "trash", i + 2, { read: true, date: hoursAgo(i * 19 + 12) }),
);

export const seedEmails: Email[] = [
  ...inbox,
  ...sent,
  ...drafts,
  ...archived,
  ...snoozed,
  ...spam,
  ...trash,
];

export const seedContacts: Contact[] = [
  ["Mariana Duarte", "mariana.duarte@bocanoticias.com.br", "Boca Notícias", "Editora-chefe", ["Equipe", "Editorial"]],
  ["Rafael Lemos", "rafael.lemos@redacaoboca.com.br", "Redação Boca", "Repórter sênior", ["Equipe"]],
  ["Camila Prado", "camila.prado@agenciaorbita.com", "Agência Órbita", "Diretora de contas", ["Cliente"]],
  ["Bruno Tavares", "bruno.tavares@nexuspay.com.br", "NexusPay", "Gerente financeiro", ["Financeiro"]],
  ["Helena Rocha", "helena.rocha@vertexlab.io", "Vertex Lab", "Product Manager", ["Parceiro"]],
  ["Diego Nogueira", "diego.nogueira@grupomeridiano.com", "Grupo Meridiano", "Diretor comercial", ["Cliente"]],
  ["Patrícia Alencar", "patricia@alencaradv.com.br", "Alencar Advogados", "Advogada", ["Jurídico"]],
  ["Thiago Barros", "thiago.barros@cloudsulhost.com", "CloudSul Host", "Suporte técnico", ["Fornecedor"]],
  ["Juliana Nakamura", "juliana.nakamura@datafolhaanalytics.com", "Data Analytics", "Analista de dados", ["Parceiro"]],
  ["Marcos Vinícius", "marcos.v@fornecedorprime.com.br", "Fornecedor Prime", "Representante", ["Fornecedor"]],
  ["Ana Beatriz Souza", "ana.souza@bocanoticias.com.br", "Boca Notícias", "Social media", ["Equipe"]],
  ["Fernando Klein", "fernando.klein@midiaplus.com.br", "Mídia Plus", "Planejamento", ["Cliente"]],
  ["Larissa Campos", "larissa.campos@editorahorizonte.com", "Editora Horizonte", "Coordenadora", ["Parceiro"]],
  ["Otávio Meireles", "otavio.meireles@bocamail.com.br", "BOCA MAIL", "Infraestrutura", ["Equipe", "TI"]],
  ["Sofia Andrade", "sofia.andrade@estudiovertical.com", "Estúdio Vertical", "Designer", ["Fornecedor"]],
  ["Ricardo Peixoto", "ricardo.peixoto@bancoatlas.com.br", "Banco Atlas", "Gerente de conta", ["Financeiro"]],
].map(([name, email, company, role, tags], i) => ({
  id: `c-${i + 1}`,
  name: name as string,
  email: email as string,
  phone: `+55 11 9${8000 + i * 137}-${1000 + i * 411}`.slice(0, 19),
  company: company as string,
  role: role as string,
  tags: tags as string[],
  favorite: i % 4 === 0,
  notes:
    i % 3 === 0
      ? "Prefere contato por e-mail no período da manhã. Responde rápido a propostas objetivas."
      : "Sem observações registradas.",
  lastContact: hoursAgo(i * 14 + 3),
}));

export const seedFolders = [
  { slug: "trabalho", name: "Trabalho", count: 18 },
  { slug: "clientes", name: "Clientes", count: 12 },
  { slug: "importante", name: "Importante", count: 7 },
  { slug: "financeiro", name: "Financeiro", count: 9 },
  { slug: "projetos", name: "Projetos", count: 5 },
];

export const mailAccounts = [
  {
    id: "acc-1",
    name: "Boca Notícias",
    email: "redacao@bocanoticias.com.br",
    provider: "BOCA MAIL",
    primary: true,
    usedGb: 6.4,
    quotaGb: 15,
    status: "ativa" as const,
  },
  {
    id: "acc-2",
    name: "Redação",
    email: "redacao@redacaoboca.com.br",
    provider: "BOCA MAIL",
    primary: false,
    usedGb: 2.1,
    quotaGb: 10,
    status: "ativa" as const,
  },
];

export const adminUsers = Array.from({ length: 12 }, (_, i) => {
  const c = seedContacts[i];
  return {
    id: `u-${i + 1}`,
    name: c.name,
    email: c.email,
    role: i === 0 ? "Administrador" : i % 4 === 0 ? "Gestor" : "Usuário",
    status: i % 6 === 5 ? "suspenso" : i % 5 === 4 ? "pendente" : "ativo",
    usedGb: Number((1 + i * 0.83).toFixed(1)),
    quotaGb: i % 3 === 0 ? 25 : 15,
    lastAccess: hoursAgo(i * 6 + 1),
  };
});

export const adminDomains = [
  { id: "d1", domain: "bocamail.com.br", accounts: 42, mx: "ok", spf: "ok", dkim: "ok", dmarc: "ok", expires: "2027-04-18" },
  { id: "d2", domain: "bocanoticias.com.br", accounts: 28, mx: "ok", spf: "ok", dkim: "pendente", dmarc: "aviso", expires: "2026-11-30" },
  { id: "d3", domain: "redacaoboca.com.br", accounts: 11, mx: "ok", spf: "aviso", dkim: "pendente", dmarc: "erro", expires: "2026-12-09" },
  { id: "d4", domain: "bocaprojetos.com", accounts: 4, mx: "pendente", spf: "pendente", dkim: "pendente", dmarc: "pendente", expires: "2027-01-22" },
] as const;

export const adminLogs = Array.from({ length: 24 }, (_, i) => {
  const levels = ["info", "aviso", "erro", "info", "info"] as const;
  const actions = [
    "Login realizado",
    "Senha alterada",
    "Conta criada",
    "Tentativa de login bloqueada",
    "Regra de filtro atualizada",
    "Domínio verificado",
    "Falha ao entregar mensagem",
    "Backup concluído",
  ];
  return {
    id: `log-${i + 1}`,
    level: levels[i % levels.length],
    action: actions[i % actions.length],
    actor: seedContacts[i % seedContacts.length].email,
    ip: `189.${20 + i}.${100 + i}.${3 + i}`,
    date: hoursAgo(i * 2 + 1),
  };
});

export const adminTraffic = Array.from({ length: 14 }, (_, i) => ({
  dia: `${String(20 + (i % 12)).padStart(2, "0")}/08`,
  recebidos: 820 + Math.round(Math.sin(i) * 180) + i * 22,
  enviados: 410 + Math.round(Math.cos(i) * 120) + i * 11,
}));

export const adminStorageBreakdown = [
  { nome: "Anexos", valor: 428 },
  { nome: "Mensagens", valor: 261 },
  { nome: "Arquivados", valor: 154 },
  { nome: "Lixeira", valor: 62 },
];

export const ME_USER = ME;
