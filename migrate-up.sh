#!/bin/bash
for filename in ./src/sequelize/migrations/*.ts;
do
    npx tsc -t es2018 -module CommonJS -outdir ./src/sequelize/compiled $filename
done
npx sequelize migrate