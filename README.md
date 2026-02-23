# IMOBI Holdings - Website

Website institucional da IMOBI Holdings, empresa de tecnologia americana que opera projetos de engenharia e P&D atraves de institutos brasileiros.

**Live:** [www.imobiallholdings.com](https://www.imobiallholdings.com)

## Estrutura

```
imobiall-website/
├── index.html              # Homepage
├── partners.html           # Sales Partners
├── territories.html        # Mapa de territorios (Leaflet.js)
├── thank-you.html          # Confirmacao de formulario
├── sitemap.xml
├── robots.txt
├── css/
│   ├── variables.css       # CSS custom properties (cores, fontes)
│   ├── base.css            # Reset, body, scrollbar
│   ├── layout.css          # Navbar, footer, containers
│   ├── components.css      # Buttons, cards, forms, modals
│   ├── sections.css        # Hero, services, why, territory, contact
│   ├── utilities.css       # Media queries, keyframes
│   ├── nova.css            # Chatbot NOVA
│   ├── partners.css        # Partners page (commission, benefits, steps, form)
│   └── territories.css     # Territories page (map, sidebar, legend)
├── js/
│   ├── main.js             # Scroll reveal, smooth scroll
│   ├── navbar.js           # Navbar scroll, mobile toggle
│   ├── modal.js            # Territory modals
│   ├── form.js             # Contact form, referral toggle
│   ├── nova.js             # Chatbot NOVA (Claude API)
│   ├── nova-partners.js    # Chatbot NOVA variante para partners
│   └── territories.js      # Mapa Leaflet, dados das cidades, filtros
└── assets (raiz)/
    ├── logo.png            # Logo principal
    ├── og-image.png        # Open Graph (1200x630)
    ├── hero-globe.webp     # Background hero
    ├── services-bg.webp    # Background services
    ├── about-bridge.webp   # Background why section
    ├── territory-map.webp  # Background territory
    └── favicon.*           # Favicons (ico, png)
```

## Stack

- HTML5 semantico
- CSS3 com custom properties (sem framework)
- JavaScript vanilla (sem dependencias)
- [Leaflet.js](https://leafletjs.com/) para mapa de territorios (CDN)
- Google Fonts (Inter + Syne)
- Google Analytics (G-YQ8ED4BHQN)

## Integracoes

| Servico | Uso |
|---------|-----|
| [IMOBI API](https://imobi-api.vercel.app) | Contact form (proposal), chatbot NOVA |
| [Web3Forms](https://web3forms.com) | Partner application form |
| [Leaflet + CartoDB](https://carto.com) | Mapa interativo de territorios |
| Google Analytics | Tracking de paginas e conversoes |

## Executar localmente

```bash
# Qualquer servidor HTTP estatico
python -m http.server 8080
# ou
npx serve .
```

Acesse: http://localhost:8080

## Territorios

- **46** cidades disponiveis
- **3** cidades claimed (Phoenix AZ, Atlanta GA, Dallas TX)
- Dados definidos no array `cities` em `js/territories.js`
- Contadores na `index.html` nos modais de available/claimed

## Deploy

Site estatico hospedado diretamente. Nao requer build.
Basta fazer upload dos arquivos para qualquer hosting (GitHub Pages, Vercel, Netlify, S3).
