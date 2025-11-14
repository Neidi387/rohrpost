rm public/signaling/rooms/* -r;
rm public/logs/backend/* -r;
rm public/logs/frontend/* -r;
yarn run build;
mkdir -p dist/signaling/rooms;
chown -R marco:www-data dist/;
chmod g+rwx dist/signaling/rooms;

#Romove Logging
rm dist/log_backend.php;
rm dist/log_frontend.php;

#TODO: Copy to ./public (clean up ./public beforebevore) 