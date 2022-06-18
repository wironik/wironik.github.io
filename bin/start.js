//============глобальные переменные:==============
//пауза - разработка

//элементы html документа
var canvas;
var ctx;

//события
var interval;
var gameStatus="start" //куб
var keyStatus = {}; //куб
var gamemode;

//таймер
var timer;

var sec=0;
var min=0;
var hour=0;

//счетчики
var swapped;
var eyes;

//настройки
var settings =
{
	countCubes:9,
	gameTexturePath:"textures/game.png",
	mapTexturePath:"textures/maplist.png",
	canvasWidth:1000,
	canvasHeight:1000,
	cellWidth:100,
	cellHeight:100,
	wallSize: 3,
	swapInterval:60000,
	swapHardInterval:15000,
	teleportTime:10000,
	mapTime:10000
};

//текстуры //куб
var gameTexture=new Image();
gameTexture.src=settings.gameTexturePath;
gameTexture.onload = function(){};

var mapTexture=new Image();
mapTexture.src=settings.mapTexturePath;
mapTexture.onload = function(){};

//игрок куб
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
		this.wall=[];
		this.door=[];
		this.cell=[];
		
		this.wallSize=settings.wallSize;
		this.wallColor="black";
		this.cellSize=100;
		this.cellColor="black";
		this.stat="normal";
	}
}
//стены
class wall
{
	constructor(width,height,x,y,color)
	{
		this.width=width;
		this.height=height;
		this.x=x;
		this.y=y;
		this.color=color;
	}
}
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