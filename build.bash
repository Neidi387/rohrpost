rm public/signaling/rooms/* -r;
yarn run build;
mkdir -p dist/signaling/rooms;
chown -R marco:www-data dist/;
chmod g+rwx dist/signaling/rooms;

#TODO: Copy to ./public (clean up ./public beforebevore) 