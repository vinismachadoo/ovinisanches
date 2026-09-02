import {
  Boxes,
  Headset,
  PackageCheck,
  Plug,
  Radar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const nav = {
  links: [
    { label: "Soluções", href: "#diferenciais" },
    { label: "Simular frete", href: "#simular" },
    { label: "Documentação", href: "#jornada" },
    { label: "Rastrear pacote", href: "#rastrear" },
    { label: "Blog", href: "#blog" },
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
  reassurance: ["Sem mensalidade", "Sem volume mínimo"],
  backdrop: "/stone-entrega/hero-1.jpeg",
  backdropAlt: "Empreendedora sorrindo atrás do balcão da sua loja de bairro",
  stats: [
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
  tags?: string[]
  /** Renders the card on the accent surface and gives it more visual weight. */
  featured?: boolean
  /** Lays the card out horizontally, for the full-width row of the bento grid. */
  wide?: boolean
  visual?: "chat" | "contract"
}

export const differentials = {
  title: "Um contato, um contrato, várias operações",
  description:
    "Você negocia uma vez com a Stone e passa a operar com uma malha inteira de transportadoras homologadas. Sem planilha paralela, sem cinco contratos, sem ficar no telefone atrás de quem perdeu o seu pacote.",
  items: [
    {
      icon: Headset,
      title: "Um contato",
      description:
        "Um time Stone responsável pela sua operação de ponta a ponta. Deu problema em qualquer trecho, você fala com a gente — nunca com a transportadora.",
      featured: true,
      visual: "chat",
    },
    {
      icon: PackageCheck,
      title: "Um contrato",
      description:
        "Uma assinatura destrava mais de 20 parceiros logísticos homologados, com preço negociado no volume de toda a base Stone.",
      tags: ["+20 parceiros", "Preço de escala", "Sem fidelidade"],
      visual: "contract",
    },
    {
      icon: Boxes,
      title: "Várias operações",
      description:
        "Todos os modais no mesmo painel, do envio unitário à carga fechada.",
      tags: ["Coleta", "Fracionado", "Lotação", "Last mile", "Reversa"],
    },
    {
      icon: Radar,
      title: "Rastreio em tempo real",
      description:
        "Você acompanha cada etapa e seu cliente recebe avisos automáticos por SMS e WhatsApp.",
    },
    {
      icon: ShieldCheck,
      title: "Seguro total de carga",
      description:
        "100% do valor da nota coberto em todos os envios, sem custo adicional.",
    },
    {
      icon: Plug,
      title: "Integra com a sua loja",
      description:
        "Shopify, Nuvemshop, Tray, Bling e API aberta. Conecta em minutos.",
      tags: ["Shopify", "Nuvemshop", "Tray", "Bling", "API aberta"],
      wide: true,
    },
  ] satisfies Differential[],
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

export const segments = {
  title: "Logística para todo tipo de negócio",
  description:
    "Cada operação tem uma dor diferente. A gente monta a malha, o modal e o prazo em cima do que o seu negócio realmente precisa.",
  items: [
    {
      id: "varejo",
      name: "Comércio e Varejo",
      headline: "Do balcão ao bairro inteiro",
      description:
        "Entrega no mesmo dia na sua região, reposição entre lojas e envio para todo o Brasil quando a venda vem do online.",
      bullets: [
        "Entrega same-day e next-day no raio urbano",
        "Transferência de estoque entre lojas",
        "Coleta programada no horário que você escolhe",
      ],
      stat: {
        value: "3x",
        label: "mais rápido que o envio tradicional no raio urbano",
      },
      photo: unsplash("1604074309324-72543c99d59c", 900, 1100),
      photoAlt: "Lojista organizando produtos em um pequeno comércio de bairro",
    },
    {
      id: "beleza",
      name: "Saúde e Beleza",
      headline: "Produto sensível chega inteiro",
      description:
        "Manuseio, embalagem e rotas pensados para itens frágeis, líquidos e com validade curta.",
      bullets: [
        "Embalagem e manuseio para itens frágeis",
        "Rotas com controle de temperatura",
        "Reversa simples para troca e recall",
      ],
      stat: {
        value: "0,4%",
        label: "de índice de avaria nos envios do segmento",
      },
      photo: unsplash("1653130029149-9109b115ab9a", 900, 1100),
      photoAlt: "Profissional de beleza sorrindo em seu salão",
    },
    {
      id: "moda",
      name: "Moda e Calçados",
      headline: "Troca fácil vende mais",
      description:
        "Grade completa saindo junto, etiqueta de devolução no pacote e reversa que não trava o seu caixa.",
      bullets: [
        "Logística reversa em um clique",
        "Etiqueta de devolução já dentro do pacote",
        "Fracionado para enviar a grade completa",
      ],
      stat: { value: "72h", label: "de ciclo médio para concluir uma troca" },
      photo: unsplash("1441984904996-e0b6ba687e04", 900, 1100),
      photoAlt: "Interior de uma boutique de roupas com araras organizadas",
    },
  ],
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
