# Passeandonafoto360® — redesign do site

Redesign de uma presença digital originalmente publicada no Canva, transformada em
um site estático personalizado para a marca Passeandonafoto360®.

## Antes e depois

| Antes | Depois |
| --- | --- |
| [Site original no Canva](https://passeandonafoto360.my.canva.site/) | [Site reformulado na Vercel](https://passeandonafoto360.vercel.app/) |

Esta cópia também está disponível em [GitHub Pages](https://cloudstrife-coder.github.io/projetos/passeandonafoto360/).

O objetivo foi modernizar a experiência sem perder a identidade visual, a logo,
as imagens e as informações da marca. A nova versão organiza o conteúdo em uma
narrativa visual, adapta-se a telas pequenas e mantém a navegação acessível.

## O que foi feito

- Hero com destaque para a marca, composição visual em camadas e parallax.
- Seções de parcerias, serviços, conteúdo para redes sociais e atendimento.
- Galeria de trabalhos com faixa horizontal guiada pelo scroll em telas maiores
  e rolagem nativa em telas menores ou com movimento reduzido.
- Depoimentos, contato, links para Instagram e acesso ao WhatsApp.
- Minutas de Política de Privacidade, Termos de Uso, Política de Cookies e Política
  de Troca, Cancelamento e Reembolso, com links no rodapé.
- Atendimento e negociação pelo WhatsApp, conforme informado pelo responsável.
  Dados da empresa e procedimentos comerciais ainda precisam de confirmação;
  os documentos legais permanecem pendentes de validação e revisão jurídica.
- Animações de entrada, contadores, navegação responsiva e respeito à preferência
  por movimento reduzido.
- SEO básico, dados estruturados, sitemap e regras para robôs.
- Imagens e logo locais em `assets/img/`, sem depender do servidor de mídia do Canva.

## Tecnologias

HTML semântico, CSS e JavaScript nativo com módulos ES. Não há frameworks,
dependências de npm nem etapa de build. As fontes Space Grotesk e DM Sans são
carregadas do Google Fonts.

## Executar localmente

Abra `index.html` com a extensão Live Server do VS Code. Para testar, navegue pela
página, redimensione a janela e confira também a galeria com a opção de movimento
reduzido ativada no sistema operacional.

## Como o parallax funciona

Elementos com `data-parallax` recebem um movimento suave relacionado à posição da
rolagem nativa. O JavaScript calcula o deslocamento e aplica uma transformação CSS;
ele não substitui nem bloqueia o scroll do navegador.

O atributo `data-speed` controla a intensidade. Por exemplo:

```html
<div data-parallax data-speed="-0.2" data-axis="y"></div>
```

Valores negativos movem o elemento no sentido contrário ao scroll; positivos
acompanham o sentido. `data-axis="x"` usa o eixo horizontal. `data-scale`,
`data-rotate` e `data-fade` habilitam variações sutis de escala, rotação e
opacidade. Em telas menores, o movimento é reduzido; a preferência de movimento
reduzido desativa os efeitos.

## Conteúdo da marca

- Telefone: **(41) 98405-7628**.
- WhatsApp: **(41) 98405-7628**.
- E-mail: **passeandonafoto@gmail.com**.
- Instagram: **[@dronemaker360](https://www.instagram.com/dronemaker360/)**.

## Itens que ainda precisam de confirmação

- Endereço comercial e área efetiva de atendimento. Matinhos aparece nos
  depoimentos, mas não foi confirmado como endereço ou área de atendimento.
- Dados do controlador, coleta e uso de dados, cookies, retenção e canal de
  privacidade na Política de Privacidade.
- Condições comerciais, prazos, cancelamento e horários de suporte.
- Telefone e WhatsApp mantidos no mesmo número para atendimento direto: 7628.

As páginas legais exibem avisos de conteúdo pendente e precisam ser revisadas
antes de serem apresentadas como documentos finais.

## Publicação

O site está publicado em <https://passeandonafoto360.vercel.app/>. O domínio
original do Canva continua ativo separadamente; alterações neste projeto não
modificam aquele site.
