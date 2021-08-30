Для запуска в текущей директории выполнить команду `npm i`

Затем выполнить установку библиотек `bower i` на серевер возможно понадобиться выполнить `sudo bower i --allow-root`

Для запуска использовать команду `gulp`

Вывод файлов настраивается в файле gulpfile.js `out_path` 

Подключить svg sprite можно следующим образом

`<img src="/www/images/svg/sprite.svg#shopping-cart">`

или

`<svg class="img">
    <use xlink:href="/www/images/svg/sprite.svg#shopping-cart "></use>
</svg>`