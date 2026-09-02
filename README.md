# Boca Mail: Your Inbox

Crie uma aplicação web completa, profissional e responsiva chamada BOCA MAIL, um cliente de e-mail SaaS com identidade Boca (azul profundo/elétrico, claro e escuro), usando React, TypeScript, Tailwind e Lucide. Esta é exclusivamente a fase visual: não configurar SMTP, IMAP, POP3, DNS, autenticação, banco ou envio/recebimento real. Use dados mockados realistas e mantenha a camada de dados preparada para API futura.

Implemente um produto navegável e consistente, não apenas dashboard: sidebar desktop e menu mobile com logo BOCA MAIL, botão + Escrever, Caixa de entrada, Favoritos, Adiados, Enviados, Rascunhos, Arquivados, Spam, Lixeira; pastas Trabalho, Clientes, Importante, Financeiro, Projetos com + Nova pasta; Contatos; Configurações; e área ADMINISTRAÇÃO com Dashboard, Usuários, Contas, Domínios, Armazenamento, Estatísticas e Logs. Inclua configurações e minha conta no rodapé.

Crie header com menu mobile, pesquisa com painel de busca avançada (remetente, destinatário, assunto, palavras, data, anexos, tamanho e pasta), ajuda, notificações, alternância de tema, avatar e menu. Faça Inbox com contador, toolbar de ações, abas Principal/Promoções/Social/Atualizações, seleção, estrelas e linhas de email completas. Disponibilize no mínimo 30 recebidos, 15 enviados, 8 rascunhos, 10 favoritos, 8 spam, 10 lixeira e 15 contatos mockados, permitindo busca, filtros, seleção, leitura e navegação visual.

Implemente visualização de e-mail com cabeçalho de remetente/destinatário, assunto, conteúdo, anexos e ações responder, encaminhar, favoritar, arquivar, excluir e menu de mais. Faça compositor modal/drawer responsivo com Para/CC/BCC, assunto, editor rico visual com barra de formatação, anexos em cards, enviar, salvar rascunho, agendar e descartar. Criar modal de agendamento incluindo opções rápidas e data/hora America/Sao_Paulo. Faça confirmação obrigatória antes de excluir, esvaziar lixo, bloquear remetente, excluir usuário ou conta. Adicione toasts demonstrativos.

Construa telas completas para Rascunhos, Enviados com estados Enviado/Entregue/Falha/Agendado, Favoritos, Arquivados, Spam com aviso e ações, Lixeira com esvaziar e confirmação, Contatos com novo contato e detalhe com histórico/info/notas. Crie Configurações com navegação interna: geral, conta, aparência, inbox, assinatura, notificações e filtros/regras, todos os controles visuais. Inclua Contas de e-mail com cards Boca Notícias e Redação e modal/interface de adicionar conta sem conexão real.

Área BOCA MAIL ADMIN: dashboard com métricas de usuários, contas, emails recebidos/enviados, armazenamento e gráficos; usuários em tabela com ações e formulário de criar conta; domínios e estados de DNS/SPF/DKIM/DMARC preparados; logs com filtros; telas de armazenamento e estatísticas úteis.

Inclua loading skeletons, estados vazios, erro com tentar novamente, offline e sucesso. Faça microinterações discretas, acessibilidade (aria labels, foco teclado, contraste, tamanhos clicáveis, tooltips), navegação de tela pequena onde sidebar vira menu e o compose se adapta. Organize em componentes reutilizáveis conforme apropriado. Priorize acabamento visual SaaS premium e UX, sem imagens externas desnecessárias. Rode e corrija a build antes de finalizar.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/18cec837-0ead-4c58-a223-b71abe849dec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
