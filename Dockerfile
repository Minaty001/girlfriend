FROM nginx:alpine
COPY index.html style.css script.js xiaowei_avatar.jpg /usr/share/nginx/html/
EXPOSE 80
