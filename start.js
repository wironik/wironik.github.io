//============глобальные переменные:==============
//пауза - разработка
//меню сделать управление клавиатурой - частично
//зашел в комнату и куб с выходом переместиться может - потом (на диплом)

//!!!переместился - куб выделил в который попал

//элементы html документа
var canvas;
var ctx;

//события
var interval;
var gameStatus="stop"

//таймер
var timer;

var sec=0;
var min=0;
var hour=0;

//счетчики
var swapped;
var eyes;

//текстуры
var gameTexture=new Image();
gameTexture.src='../textures/game.png';
gameTexture.onload = function() 
{
	console.log('ok1');
};

var mapTexture=new Image();
mapTexture.src='../textures/maplist.png';
mapTexture.onload = function() 
{
	console.log('ok1');
};


//настройки
var settings =
{
	countCubes:19,
	
	canvasWidth:1000,
	canvasHeight:1000,
	cellWidth:100,
	cellHeight:100,
	
	swapInterval:60000,
	teleportTime:10000,
	mapTime:10000
};
//игрок
var user=
{
	width:70,
	height:100,
	dx:0, //смещение по х
	x:500,
	centerx:535,
	dy:0, //смещение по у
	y:500,
	centery:550,
	speed:10,
	
	i:0,
	j:0,
	color:"red"
}
//карта
var map=
{
	width:1000,
	height:1000,
	x:0,
	y:0,
	color:"#ffffff",
	cubes:[]
}
//кубы
class cube
{
	constructor(width,height,x,y,i,j,color)
	{
		this.width=width;
		this.height=height;
		this.x=x;
		this.y=y;
		this.i=i;
		this.j=j;
		this.color=color;
		
		this.door=[];
		this.cell=[];
		
		this.cellSize=100;
		this.cellColor="black";
		this.stat="normal";
	}
}
//стены
class cell
{
	constructor(width,height,x,y,color)
	{
		this.width=width;
		this.height=height;
		this.x=x;
		this.y=y;
		this.color=color;
		this.stat="normal";
	}
}



