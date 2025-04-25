
domains=(hackathon21.ru www.hackathon21.ru)
email="stognievilya@gmail.com"

mkdir -p ./certbot/conf
mkdir -p ./certbot/www

echo "### Остановка и удаление существующих контейнеров..."
docker-compose down

staging=1 

if [ -d "$data_path/conf/live/$domains" ]; then
  read -p "Существующие сертификаты найдены. Продолжить и перезаписать существующие сертификаты? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

domain=${domains[0]}
path="/etc/letsencrypt/live/$domain"

echo "### Проверка доступности домена..."
host_ip=$(dig +short $domain)
if [ -z "$host_ip" ]; then
  echo "ВНИМАНИЕ: Не удалось разрешить домен $domain. Убедитесь, что DNS настроен правильно."
  your_ip=$(curl -s https://ipinfo.io/ip || wget -qO- https://ipinfo.io/ip)
  echo "Ваш IP-адрес: $your_ip"
  echo "DNS должен указывать на этот IP-адрес."
  read -p "Продолжить в любом случае? (y/N) " continue_anyway
  if [ "$continue_anyway" != "Y" ] && [ "$continue_anyway" != "y" ]; then
    exit
  fi
fi

echo "### Создание временного сертификата для получения запросов HTTPS ..."
docker-compose run --rm --entrypoint "mkdir -p $path" certbot

docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Запуск nginx ..."
docker-compose up -d nginx
sleep 5

echo "### Создание тестового файла challenge..."
echo "Hello from Certbot test" > ./certbot/www/test-file.txt
echo "Права доступа к тестовому файлу:"
ls -la ./certbot/www/test-file.txt

echo "### Проверка работоспособности nginx и пути challenge..."
echo "Проверяем обычный HTTP запрос..."
curl -v http://$domain

echo "Проверяем путь challenge..."
curl -v http://$domain/.well-known/acme-challenge/test-file.txt

echo "### Проверка конфигурации nginx..."
docker-compose exec nginx nginx -T

if [ $? -ne 0 ] || [ -z "$(curl -s http://$domain/.well-known/acme-challenge/test-file.txt)" ]; then
  echo "ВНИМАНИЕ: Не удалось получить доступ к пути проверки или конфигурация nginx некорректна."
  echo "1. Домен $domain должен указывать на ваш сервер (текущий IP: $(curl -s https://ipinfo.io/ip))"
  echo "2. Порт 80 должен быть доступен и не заблокирован файерволом"
  echo "3. Nginx должен быть запущен и правильно настроен"
  echo "4. Конфигурация nginx должна правильно направлять запросы /.well-known/acme-challenge/ на /var/www/certbot"
  
  echo "Проверяем, запущен ли nginx..."
  docker-compose ps nginx
  
  read -p "Продолжить попытку получения сертификата? (y/N) " continue_anyway
  if [ "$continue_anyway" != "Y" ] && [ "$continue_anyway" != "y" ]; then
    exit
  fi
fi

echo "### Запрос фактического сертификата Let's Encrypt ..."
if [ $staging -eq 1 ]; then
  docker-compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      -d $domain \
      --email $email \
      --agree-tos \
      --no-eff-email \
      --staging \
      --force-renewal \
      --debug-challenges \
      --verbose" certbot
else
  docker-compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      -d $domain \
      --email $email \
      --agree-tos \
      --no-eff-email \
      --force-renewal \
      --debug-challenges \
      --verbose" certbot
fi

echo "### Перезапуск nginx ..."
docker-compose exec nginx nginx -s reload