"use client"

import { Checkbox } from "@/registry/default/ui/checkbox"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { StoneButton, StoneLink } from "../components/brand"

const fields = [
  {
    name: "nome",
    label: "Nome completo",
    type: "text",
    autoComplete: "name",
    placeholder: "Como está no seu documento",
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    autoComplete: "email",
    inputMode: "email" as const,
    placeholder: "voce@suaempresa.com.br",
  },
  {
    name: "documento",
    label: "CNPJ ou CPF",
    type: "text",
    autoComplete: "off",
    inputMode: "numeric" as const,
    placeholder: "00.000.000/0001-00",
  },
  {
    name: "celular",
    label: "Celular",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel" as const,
    placeholder: "(11) 90000-0000",
  },
]

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="border-stone-green-200 bg-stone-green-50 grid gap-4 rounded-xl border p-6 text-center">
        <CheckCircle2
          aria-hidden
          className="text-stone-green-700 mx-auto size-10"
          strokeWidth={1.5}
        />
        <div>
          <h2 className="text-stone-ink text-lg font-semibold">Cadastro enviado</h2>
          <p className="text-stone-ink/70 mt-1.5 text-sm text-pretty">
            Esta é uma página conceitual, então a jornada termina aqui. Em produção, você cairia
            direto no painel com a coleta já agendada.
          </p>
        </div>
        <StoneLink href="/projects/stone-landing-page#simular" tone="outline">
          Voltar para a simulação
        </StoneLink>
      </div>
    )
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name} className="text-stone-ink">
              {field.label}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required
              autoComplete={field.autoComplete}
              inputMode={"inputMode" in field ? field.inputMode : undefined}
              placeholder={field.placeholder}
              className="h-11"
            />
          </div>
        ))}

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="senha" className="text-stone-ink">
            Senha
          </Label>
          <Input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            className="h-11"
          />
        </div>
      </div>

      <label className="text-stone-ink/70 flex items-start gap-2.5 text-sm">
        <Checkbox
          name="termos"
          required
          className="data-checked:bg-stone-green-500 data-checked:border-stone-green-500 data-checked:text-stone-ink mt-0.5"
        />
        <span>
          Li e aceito os{" "}
          <a href="#" className="text-stone-ink font-medium underline underline-offset-2">
            termos de uso
          </a>{" "}
          e o{" "}
          <a href="#" className="text-stone-ink font-medium underline underline-offset-2">
            aviso de privacidade
          </a>{" "}
          da Stone.
        </span>
      </label>

      <StoneButton type="submit" size="lg" className="w-full">
        Criar conta e confirmar entrega
        <ArrowRight aria-hidden className="size-4" />
      </StoneButton>

      <p className="text-stone-ink/65 text-center text-sm">
        Já tem conta Stone?{" "}
        <Link
          href="/projects/stone-landing-page"
          className="text-stone-ink focus-visible:ring-stone-green-600/40 rounded-sm font-semibold underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
        >
          Entrar
        </Link>
      </p>
    </form>
  )
}
