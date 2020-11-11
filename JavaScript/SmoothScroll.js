export class SmoothScroll {
    constructor(links, header){
        this._links = document.querySelector(links);
        this._linksLista = this.getArrayFromLinks();
        this._header = header;

        //Adiciona um evento de 'click' para cada link
        this._linksLista.forEach(link=>{
            link.addEventListener('click', this.smoothScroll.bind(this));
        });
    };

    getArrayFromLinks(){
        return Array.from(this._links.children);
    }
    
    //Método para navegadores que não possuam o "smooth" nativo
    scrollArtificial(endX, endY, duration){
        const startX = window.scrollX || window.pageXOffset;
        const startY = window.scrollY || window.pageYOffset;
        const distanceX = endX - startX;
        const distanceY = endY - startY;
        const startTime = new Date().getTime();
        
        duration = typeof duration !== 'undefined' ? duration : 400;
        
        // Easing function
        const easeInOutQuart = (time, from, distance, duration) => {
            if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
            return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
        };
        
        const timer = setInterval(() => {
            const time = new Date().getTime() - startTime;
            const newX = easeInOutQuart(time, startX, distanceX, duration);
            const newY = easeInOutQuart(time, startY, distanceY, duration);
            if (time >= duration) {
            clearInterval(timer);
            }
            window.scroll(newX, newY);
        }, 1000 / 60); // 60 fps
    };

    //Método para adicionar o "smooth" para navegadores (nativo ou não-nativo)
    scrollNativo(position){
        let userAgent = navigator.userAgent;
        let IE = userAgent.indexOf("MSIE");
        let Safari = userAgent.indexOf("Safari");
        if(IE > 0 || Safari > 0){
            this.scrollArtificial(0, position, 500);
        }
        else{
            window.scroll({
            top: position,
            behavior: "smooth"
            });  
        };
    };

    //Referencia os elementos pelo 'href', pega suas posições, subtrai suas posições do 'header' total e retorna para criar o 'smooth'
    smoothScroll(element){
        element.preventDefault();
        //Captura o elemento 'href' do elemento clicado
        function scrollTopHref(){
            const idLinks = element.target.getAttribute('href');
            return document.querySelector(idLinks).offsetTop;
        };
        const position = scrollTopHref(element.target) - this._header;
        this.scrollNativo(position);
    };
};

//Modelo de aplicação para o 'SmoothScroll'
const menu = '.menu'; //Colocar em uma string o seletor de onde seus links desejados no smooth scroll estão

//Modelo para descobrir e aplicar o tamanho total do seu 'header'
const header = document.querySelector('.header').offsetHeigth //Seletor do seu header no lugar de '.header'
const header2pedaco = document.querySelector('.header2pedaco').offsetHeigth //Seletor caso seu header possua outro pedaço como 'barra de scroll progress'
const headerTotal = header + header2pedaco //Caso queira calcular o tamanho total do seu header (caso haja algum pedaço a mais no header)


//O primeiro parâmentro você coloca sua constante onde está a string do seletor do seu 'menu', no segundo parâmetro você coloca a constante do seu 'header', e caso haja um cálculo feito no header você coloca o 'headerTotal' e prontinho :D
new SmoothScroll(menu, header);
