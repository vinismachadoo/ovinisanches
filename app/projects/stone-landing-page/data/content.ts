import { Boxes, Headset, Zap, type LucideIcon } from "lucide-react"

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const nav = {
  links: [
    { label: "Soluções", href: "#diferenciais" },
    { label: "Simular frete", href: "#simular" },
    { label: "Documentação", href: "#jornada" },
    { label: "Blog", href: "#blog" },
    { label: "Rastrear pacote", href: "#rastrear" },
  ],
  cta: "Quero entregar",
}

export const brands = [
  { name: "Magazine Luiza", domain: "magazineluiza.com.br" },
  { name: "Natura", domain: "natura.com.br" },
  { name: "Arezzo", domain: "arezzo.com.br" },
  { name: "Farm", domain: "farmrio.com.br" },
  { name: "Reserva", domain: "usereserva.com" },
  { name: "Havaianas", domain: "havaianas.com.br" },
  { name: "Centauro", domain: "centauro.com.br" },
  { name: "Renner", domain: "lojasrenner.com.br" },
  { name: "Amaro", domain: "amaro.com" },
  { name: "Osklen", domain: "osklen.com" },
  { name: "C&A", domain: "cea.com.br" },
  { name: "Netshoes", domain: "netshoes.com.br" },
]

export const journey = {
  title: "Da venda à entrega, em oito etapas",
  description:
    "Cada pedido percorre o mesmo fluxo na Stone Entrega — do checkout da sua loja até o pagamento do frete.",
  steps: [
    { id: "pedido", label: "Novo pedido no seu ecommerce" },
    { id: "faturado", label: "Pedido faturado" },
    { id: "aberto", label: "Pedido aberto na Stone Entrega" },
    { id: "etiqueta", label: "Etiqueta emitida" },
    { id: "separado", label: "Pacote separado para coleta" },
    { id: "coletado", label: "Pacote coletado ou postado na agência" },
    { id: "rota", label: "Pacote em rota com rastreio em tempo real" },
    { id: "entregue", label: "Pacote entregue e pagamento do frete" },
  ],
}

export const hero = {
  badge: "Entrega em até 4h nas regiões Sul e Sudeste",
  titleAccent: "Logística",
  titleRest: "pra quem empreende",
  description: "Você vende, a Stone entrega... em todo o Brasil.",
  primaryCta: "Simular frete",
  secondaryCta: "Falar com especialista",
  reassurance: ["Sem mensalidade", "Sem volume mínimo", "Sem burocracia"],
  backdrop: "/stone-entrega/hero-1.jpeg",
  backdropAlt: "Empreendedora sorrindo atrás do balcão da sua loja de bairro",
}

export const stats = {
  title: "Números que constroem confiança",
  description:
    "Malha nacional, prazo cumprido e gente no atendimento. São os números da operação que o empreendedor vê todo dia — sem asterisco, sem letra miúda.",
  items: [
    { value: "+5.500", label: "cidades atendidas" },
    { value: "98,7%", label: "entregas no prazo" },
    { value: "5s", label: "de espera no atendimento" },
    { value: "500", label: "empreendedores entregando" },
  ],
}

export const shipment = {
  code: "BR-48219",
  status: "Em rota",
  recipient: "Ana Ribeiro",
  destination: "Belo Horizonte, MG",
  eta: "Chega hoje, até 18h",
  steps: [
    {
      label: "Coleta realizada",
      place: "São Paulo, SP",
      time: "08:12",
      done: true,
    },
    { label: "Em trânsito", place: "CD Campinas", time: "11:47", done: true },
    {
      label: "Saiu para entrega",
      place: "Belo Horizonte, MG",
      time: "14:02",
      done: true,
    },
    {
      label: "Entregue",
      place: "Aguardando confirmação",
      time: "—",
      done: false,
    },
  ],
}

export type QuoteOption = {
  id: "turbo" | "sedex" | "pac" | "loggi"
  name: string
  carrier: string
  /** Rough transit time in hours — used to pick the “mais rápida” badge. */
  etaHours: number
  eta: string
  detail: string
  /** Base fare in BRL before the distance component is added. */
  basePrice: number
  perKm: number
  perks: string[]
}

export type PackageSize = "pequeno" | "medio" | "grande"

export const packageSizes: {
  id: PackageSize
  label: string
  hint: string
  multiplier: number
}[] = [
  {
    id: "pequeno",
    label: "Pequeno",
    hint: "Até 1 kg · caixa de sapato",
    multiplier: 1,
  },
  {
    id: "medio",
    label: "Médio",
    hint: "Até 5 kg · caixa de presente",
    multiplier: 1.35,
  },
  {
    id: "grande",
    label: "Grande",
    hint: "Até 15 kg · volume fracionado",
    multiplier: 1.85,
  },
]

export const simulator = {
  title: "Simule um envio agora, sem criar conta",
  description:
    "Coloque dois endereços e veja o leilão rodar de verdade: as transportadoras parceiras disputam o seu pacote e você escolhe entre velocidade e preço.",
  steps: [
    { id: "simulacao", name: "Simulação" },
    { id: "leilao", name: "Leilão" },
    { id: "entrega", name: "Criar entrega" },
  ],
  options: [
    {
      id: "turbo",
      name: "Turbo",
      carrier: "Malha urbana Stone",
      etaHours: 4,
      eta: "Até 4h",
      detail: "Coleta em até 40 min e entrega direta, sem passar por CD.",
      basePrice: 22.9,
      perKm: 1.45,
      perks: ["Coleta hoje", "Rastreio ao vivo", "Foto na entrega"],
    },
    {
      id: "loggi",
      name: "Loggi",
      carrier: "Loggi",
      etaHours: 24,
      eta: "1 dia útil",
      detail: "Rede urbana express com coleta programada na sua loja.",
      basePrice: 16.4,
      perKm: 0.78,
      perks: ["Coleta agendada", "App do motorista", "Seguro incluso"],
    },
    {
      id: "sedex",
      name: "SEDEX",
      carrier: "Correios",
      etaHours: 48,
      eta: "2 dias úteis",
      detail: "Prazo curto para vendas nacionais com a malha dos Correios.",
      basePrice: 14.9,
      perKm: 0.55,
      perks: ["+5.500 cidades", "Rastreio oficial", "Postagem coletada"],
    },
    {
      id: "pac",
      name: "PAC",
      carrier: "Correios",
      etaHours: 72,
      eta: "3 a 5 dias úteis",
      detail: "Melhor custo por pacote quando o prazo pode esperar.",
      basePrice: 9.9,
      perKm: 0.32,
      perks: ["+5.500 cidades", "Seguro incluso", "Postagem coletada"],
    },
  ] satisfies QuoteOption[],
  bids: [
    "Consultando 20 parceiros homologados",
    "Recebendo propostas de preço",
    "Comparando prazo e índice de avaria",
  ],
}

type Differential = {
  icon: LucideIcon
  title: string
  description: string
  bullets?: string[]
  tags?: string[]
  /** Renders the card on the accent surface and gives it more visual weight. */
  featured?: boolean
  /** Lays the card out horizontally, for the full-width row of the bento grid. */
  wide?: boolean
  visual?: "chat"
}

export const differentials = {
  title: "Praticidade, velocidade, flexibilidade",
  description:
    "A Stone assume a logística para você vender. Integra o que já está na sua loja, cobre o Brasil no prazo que o pedido pede e deixa um único contrato no lugar de uma planilha de transportadoras.",
  items: [
    {
      icon: Headset,
      title: "Praticidade",
      description:
        "Nós fazemos a logística por você, da coleta ao pós-venda. Um contrato só te dá adesão imediata a diversos OPLs, o cliente acompanha o pacote em tempo real e, se precisar de ajuda, o atendimento é Stone.",
      bullets: [
        "Contrato unificado, com adesão imediata a dezenas de operadores",
        "Rastreio em tempo real, com aviso automático para o seu cliente",
        "Atendimento Stone quando alguma etapa da rota precisa de gente",
      ],
      featured: true,
      visual: "chat",
    },
    {
      icon: Zap,
      title: "Velocidade",
      description:
        "Estamos integrados às plataformas que você já usa, então o onboarding acontece quase sozinho. Tarefa manual some do dia a dia e sobra tempo para o que melhora o resultado do negócio.",
      bullets: [
        "Onboarding automático a partir da sua loja",
        "Sem planilha paralela e sem retrabalho no faturamento",
        "Você foca em vender; a malha cuida de sair o pedido",
      ],
      tags: ["Shopify", "Nuvemshop", "VTEX", "Tray", "Bling", "API aberta"],
    },
    {
      icon: Boxes,
      title: "Flexibilidade",
      description:
        "Vários tipos de operação no mesmo painel, para você escolher o que o pedido pede. Turbo em até 4h, local no mesmo dia e nacional para todo o Brasil. Deixe na agência mais próxima ou combine uma coleta — e, se o envio pede cuidado extra, os Green Angels saem de carro ou moto.",
      bullets: [
        "Turbo em até 4h, same-day na região e nacional para todo o Brasil",
        "Deixe na agência mais próxima ou combine uma coleta",
        "Green Angels de carro e moto, o serviço premium da Stone",
      ],
      tags: [
        "Turbo 4h",
        "Same-day",
        "Nacional",
        "Agência",
        "Coleta",
        "Green Angels",
      ],
      wide: true,
    },
  ] satisfies Differential[],
}

export const integrations = {
  titleLines: ["Conectamos a sua operação", "de ponta a ponta"],
  items: [
    { name: "VTEX", domain: "vtex.com" },
    { name: "Shopify", domain: "shopify.com" },
    { name: "Nuvemshop", domain: "nuvemshop.com.br" },
    { name: "Tray", domain: "tray.com.br" },
    { name: "Linx", domain: "linx.com.br" },
    { name: "Yampi", domain: "yampi.com.br" },
    { name: "WBuy", domain: "wbuy.com.br" },
    { name: "Bling", domain: "bling.com.br" },
    { name: "Plugg.to", domain: "plugg.to" },
    { name: "Baselinker", domain: "baselinker.com" },
    { name: "Intelipost", domain: "intelipost.com.br" },
    { name: "Abbiamo Log", domain: "abbiamolog.com" },
    { name: "Claude", domain: "claude.ai" },
  ],
}

export const support = {
  title: "Atendimento Stone na sua operação",
  description:
    "Sem musiquinha de espera, sem robô em loop, sem protocolo esquecido. Gente de verdade resolvendo o seu problema enquanto o pacote ainda está em rota.",
  highlight: {
    value: "5",
    unit: "s",
    label: "é o tempo de espera por atendimento",
  },
  stats: [
    { value: "9.0", label: "no Reclame Aqui, com selo RA1000" },
    { value: "24/7", label: "atendimento humano, todo dia" },
    { value: "1", label: "consultor dedicado à sua conta" },
  ],
  conversation: [
    {
      from: "you" as const,
      text: "Oi! O pedido BR-48219 não saiu para entrega hoje.",
    },
    {
      from: "stone" as const,
      text: "Achei aqui. Reagendei a rota e o motorista sai às 14h. Já avisei sua cliente por SMS.",
    },
    { from: "you" as const, text: "Perfeito, obrigado!" },
  ],
}

type Segment = {
  id: string
  name: string
  kicker: string
  headline: string
  description: string
  /** `highlight` renders as the accented metric that opens the sentence. */
  bullets: { highlight?: string; text: string }[]
  caseHref: string
  photo: string
  photoAlt: string
}

export const segments = {
  title: "Logística para todo tipo de negócio",
  description:
    "Cada operação tem uma dor diferente. A gente monta a malha, o modal e o prazo em cima do que o seu negócio realmente precisa.",
  caseCta: "Ler o case",
  items: [
    {
      id: "varejo",
      name: "Comércio e Varejo",
      kicker: "Case de impacto",
      headline: "Como a Oficina 31 entregou o bairro inteiro no mesmo dia",
      description:
        "Uma rede de quatro lojas medindo prazo, reposição e recompra na malha urbana.",
      bullets: [
        {
          highlight: "3x",
          text: "mais rápido que o envio tradicional no raio urbano",
        },
        { text: "Transferência de estoque entre as quatro lojas" },
        { text: "Coleta programada no horário escolhido pelo lojista" },
      ],
      caseHref: "#cadastro",
      photo: unsplash("1604074309324-72543c99d59c", 900, 1100),
      photoAlt: "Lojista organizando produtos em um pequeno comércio de bairro",
    },
    {
      id: "beleza",
      name: "Saúde e Beleza",
      kicker: "Case de impacto",
      headline: "Como a Beleza Pura zerou a avaria em produto sensível",
      description:
        "Itens frágeis, líquidos e de validade curta saindo com manuseio e rota dedicados.",
      bullets: [
        {
          highlight: "0,4%",
          text: "de índice de avaria nos envios do segmento",
        },
        { text: "Rotas com controle de temperatura" },
        { text: "Reversa simples para troca e recall" },
      ],
      caseHref: "#cadastro",
      photo: unsplash("1653130029149-9109b115ab9a", 900, 1100),
      photoAlt: "Profissional de beleza sorrindo em seu salão",
    },
    {
      id: "moda",
      name: "Moda e Calçados",
      kicker: "Case de impacto",
      headline: "Como a Passo Firme fez a troca deixar de travar o caixa",
      description:
        "Grade completa saindo junta e uma reversa que fecha antes do cliente desistir.",
      bullets: [
        {
          highlight: "72h",
          text: "de ciclo médio para concluir uma troca, com reversa em um clique",
        },
        { text: "Etiqueta de devolução já dentro do pacote" },
        { text: "Fracionado para enviar a grade completa" },
      ],
      caseHref: "#cadastro",
      photo: unsplash("1441984904996-e0b6ba687e04", 900, 1100),
      photoAlt: "Interior de uma boutique de roupas com araras organizadas",
    },
  ] satisfies Segment[],
}

export const join = {
  count: "500",
  title: "empreendedores que confiam na Stone",
  description:
    "Abrir sua conta leva alguns minutos e não tem custo. Você só paga quando o pacote for entregue.",
  primaryCta: "Criar minha conta",
  secondaryCta: "Falar com especialista",
  avatars: [
    unsplash("1573496527892-904f897eb744", 96, 96),
    unsplash("1474176857210-7287d38d27c6", 96, 96),
    unsplash("1484863137850-59afcfe05386", 96, 96),
    unsplash("1589386417686-0d34b5903d23", 96, 96),
    unsplash("1623366302587-b38b1ddaefd9", 96, 96),
  ],
  testimonials: [
    {
      quote:
        "Antes eu falava com quatro transportadoras diferentes e nenhuma assumia o problema. Hoje é uma conversa só, e ela sempre termina resolvida.",
      author: "Marina Duarte",
      role: "Fundadora da Rosa Norte, moda feminina",
      avatar: unsplash("1573496527892-904f897eb744", 96, 96),
    },
    {
      quote:
        "Integrei a Shopify em uma tarde. No dia seguinte já tinha coleta agendada e o cliente recebendo SMS a cada etapa.",
      author: "Rafael Mota",
      role: "CEO da Oficina 31, comércio e varejo",
      avatar: unsplash("1474176857210-7287d38d27c6", 96, 96),
    },
    {
      quote:
        "O Turbo salvou minha Black Friday. Pedidos da capital saíram em até 4h e a taxa de cancelamento despencou.",
      author: "Camila Freitas",
      role: "Diretora da Beleza Pura, saúde e beleza",
      avatar: unsplash("1484863137850-59afcfe05386", 96, 96),
    },
    {
      quote:
        "A reversa que antes travava meu caixa agora fecha em 72h. Isso mudou o jeito que a gente vende calçado online.",
      author: "Thiago Nunes",
      role: "Sócio da Passo Firme, moda e calçados",
      avatar: unsplash("1589386417686-0d34b5903d23", 96, 96),
    },
  ],
}

export const footer = {
  description:
    "Logística para quem empreende. Um serviço Stone para tirar o pacote do seu estoque e colocar na mão do seu cliente.",
  columns: [
    {
      title: "Stone Entrega",
      links: [
        "Como funciona",
        "Modais e prazos",
        "Integrações",
        "Preços",
        "Rastrear pedido",
      ],
    },
    {
      title: "Atendimento",
      links: [
        "Central de ajuda",
        "Falar com especialista",
        "WhatsApp",
        "Ouvidoria",
      ],
    },
    {
      title: "Institucional",
      links: [
        "Sobre a Stone",
        "Aviso de privacidade",
        "Termos de uso",
        "Política de cookies",
      ],
    },
    {
      title: "Desenvolvedores",
      links: ["Documentação", "Referência da API", "Webhooks", "Status"],
    },
  ],
  legal:
    "Página conceitual criada como estudo de redesign. Não possui vínculo oficial com a Stone Instituição de Pagamento S.A.",
}
