#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-explorer-228888-228902/frontend_recipe_app_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

