source /root/git-prompt.sh

PATH=$PATH:/root/.composer/vendor/bin/

BGreen='\e[1;32m'       # Green
Yellow='\e[0;33m'       # Yellow
BCyan='\e[1;36m'        # Cyan
BYellow='\e[1;33m'      # Yellow
BGreen='\e[1;32m'       # Green
Color_Off='\e[0m'       # Text Reset
Blue='\e[1;34m'
LightRed='\e[91m'

alias fresh="/app/helpers/freshInstall.sh"
alias nuke="/app/helpers/freshInstall.sh"
alias mas="php artisan migrate-and-seed:all"
alias test="php artisan test"
alias check="~/check.sh"
alias pat="php artisan test"
alias comp-up="/usr/local/bin/php -d memory_limit=-1 /usr/local/bin/composer update"

alias cho="chown -R 1000:1000 /app && chown -R www-data:www-data /app/storage"


export PS1='\['$BGreen'\]\u''\['$LightRed'\] @ DOCKER:lean-startup-game: ''\['$BCyan'\]$PWD''\['$BYellow'\]$(__git_ps1 " (%s)")''\n\[\033[0;32m\]└─\[\033[0m\033[0;32m\] \$\[\033[0m\033[0;32m\] ▶\[\033[0m\] '

