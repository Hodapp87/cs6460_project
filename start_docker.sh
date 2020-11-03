#!/bin/sh

#docker build -t cs6460 .
docker run \
       -v $PWD:/project \
       -p 8000:8000 \
       -it cs6460 $@
