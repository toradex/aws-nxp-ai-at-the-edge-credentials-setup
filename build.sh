#!/bin/bash

for fname in $(ls docker-compose*.build.yml)
do
    # Build for all arch
    docker-compose -f $fname build
    # Push for all arch
    docker-compose -f $fname push
done