FROM node:20-slim
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip git && pip3 install yt-dlp && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY . .
CMD ["node","index.js"]