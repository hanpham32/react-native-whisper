# react-native-whisper

A React Native application powered by Flask on the backend, exposing endpoints through ngrok, and using OpenAI Whisper for speech-to-text processing.

Note: Whisper usage costs $0.006 per minute (rounded to the nearest second).

Important: Make sure your OpenAI API key is properly set in your environment variables.

## Tech Specs

- **Frontend**: [React Native](https://reactnative.dev/)
- **Backend**: [Flask](https://flask.palletsprojects.com/)
- **API Gateway**: [ngrok](https://ngrok.com/)
- **AI Model**: [OpenAI Whisper](https://openai.com/blog/whisper/) (`$0.006 / minute`, billed per second)

## Local Development Setup

### Prerequisites

1. **uv / Node.js / Yarn / Bun**
   - You can install [uv](https://docs.astral.sh/uv/), [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) to manage JS dependencies.
2. **Python 3.13.0+**
   - Required for dependencies.
3. **Flask**
   - Installed via `pip` or a virtual environment.
4. **ngrok**
   - Installable on most platforms; instructions included below.
5. **OpenAI API Key**

### Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### Flask server setup

```bash
cd server
# - initialize virtual environment
uv venv

# - activate virtual environment
source .venv/bin/activate # on linux and mac

# - install dependencies
uv sync

# start server
flask run --port 8000
```

### ngrok gateway setup

```bash
# - install ngrok
# On Linux
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update \
  && sudo apt install ngrok

# On MacOS
brew install ngrok

# - start ngrok on the same port as server
ngrok http 8000
```

### React Native application setup

```bash
bun install  # install dependencies
bun run start  # start application
```
