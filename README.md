# Studio Ajuste Configurator

Prototype Next.js d'un module premium de préqualification pour mobilier sur mesure.

## Prérequis
- Node.js 20+ (recommandé via `nvm`)
- npm (installé avec Node.js)

## Démarrage rapide

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

---

## Dépannage

### 1) `zsh: command not found: npm`
Cela signifie que Node.js/npm n'est pas installé **ou** n'est pas dans le `PATH` de votre shell `zsh`.

#### Option A — Installer Node via nvm (recommandé)

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Recharger votre shell (zsh)
source ~/.zshrc

# Installer une version LTS de Node (inclut npm)
nvm install --lts
nvm use --lts

# Vérifier
node -v
npm -v
```

Si `npm` est toujours introuvable, ajoutez ceci dans `~/.zshrc` :

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

Puis relancez le terminal.

#### Option B — Installer Node sans nvm
Installez Node.js depuis votre gestionnaire système (Homebrew, apt, etc.), puis vérifiez :

```bash
node -v
npm -v
```

### 2) `npm install` retourne `403 Forbidden`
Ce problème vient généralement du proxy/registry réseau.

Vérifier la config npm :

```bash
npm config list
npm ping --registry=https://registry.npmjs.org
```

Si vous n'utilisez pas de proxy, nettoyez la config :

```bash
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy
npm config delete proxy
npm config delete https-proxy
npm config set registry https://registry.npmjs.org/
npm install
```

Si vous êtes en environnement d'entreprise, configurez le proxy/registry interne autorisé par votre DSI.

### 3) Accéder à l'interface
Une fois le serveur lancé :

```bash
npm run dev
```

- URL locale : `http://localhost:3000`
- Port alternatif :

```bash
npm run dev -- -p 3001
```

Puis ouvrir `http://localhost:3001`.
