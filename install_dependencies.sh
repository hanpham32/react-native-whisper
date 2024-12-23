# install and run backend
cd server

if [! -d ".uv"]; then
  uv new
fi

# Install & sync dependencies from uv.lock
uv sync
