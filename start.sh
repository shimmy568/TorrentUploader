docker build -t torrent-uploader .
docker run -p -d 8080:3000 torrent-uploader