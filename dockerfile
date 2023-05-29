# Используйте node в качестве базового образа
FROM node

# Создайте рабочую директорию внутри контейнера
WORKDIR /server

# Скопируйте в нее файлы package.json и package-lock.json
COPY package*.json ./

# Установите зависимости npm
RUN npm install

# Скопируйте в контейнер файлы приложения из вашего репозитория
COPY . .

# Откройте порт 3000
EXPOSE 5000

CMD ["npm", "start"]