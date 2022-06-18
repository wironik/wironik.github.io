//============глобальные переменные:==============
//пауза - разработка

//элементы html документа
var canvas;
var ctx;

//события
var interval;
var gameStatus="start"
var keyStatus = {};

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
gameTexture.onload = function(){};

var mapTexture=new Image();
mapTexture.src='../textures/maplist.png';
mapTexture.onload = function(){};


//настройки
var settings =
{
	countCubes:9,
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

//============================================================================================================================

//!обработка нажатия клавиш
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ПОЧИНИТЬ УПРАВЛЕНИЕ
// Обработка нажатия кнопок
function processKey() 
{
	//блокируем нажатие клавиш по умолчанию (сами будем задавать нужное)
	if (gameStatus=="play")
	{
		let refreshed = false;
		
		if (keyStatus[32])//пробел
		{
			refreshed = true;
			teleport();
		}
		if (keyStatus[9])//tab
		{
			refreshed = true;
			toggleMap();
			keyStatus[9]=null;
		}
		if (keyStatus[27])//esc
		{
			menu();	
		}
		
		//мое
		if (keyStatus[120])//f9 финиш отладка
		{
			finishGame();
		}
		
		if (refreshed==true)
		{
			refreshGame();
		}
	}
	if (gameStatus=="map")
	{
		if (keyStatus[27] || keyStatus[9])//esc, tab
		{
			toggleMap();
		}
		keyStatus[9]=null;
		keyStatus[27]=null;
	}
	
	if (keyStatus[112])//f1
	{
		displayed('help');
	}
	//console.log('processKey');
}

function gameKey()
{
	if (gameStatus=="play")
	{
		if ((keyStatus[87] || keyStatus[38])&&(!keyStatus[83] || !keyStatus[40])) //вверх
		{
			user.dy = -1*user.speed;
		}
		if ((keyStatus[83] || keyStatus[40])&&(!keyStatus[87] || !keyStatus[38])) //вниз
		{
			user.dy = user.speed;
		}
		if (keyStatus[65] || keyStatus[37]) //влево
		{
			user.dx = -1*user.speed;
		}
		if (keyStatus[68] || keyStatus[39]) //вправо
		{
			user.dx = user.speed;
		}
		refreshGame();
	}
}

//!отрисовка в процессе игры, отрисовка куба, карты
//отслеживание перемещения, взаимодействие со стенами и сущностями, финишем и проигрышем
function refreshGame()
{
	//console.log("refresh");
	// получаем текущий куб, в котором находится игрок для получения информации
	var cube=getCube(user.i,user.j);
	// Обновляем кадр только если значок движется
	if (user.dx != 0 || user.dy != 0) 
	{
		//Проверка столкновения со стенами
		if (checkCollision(cube)==false) 
		{
			user.x += user.dx;
			user.y += user.dy;
			user.centerx+=user.dx;
			user.centery+=user.dy;
		}
	}
	user.dx=0;
	user.dy=0;
	//стираем холст
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//рисуем
	drawCube();
	if (cube.stat=="finish")
	{
		finishGame();
	}
}
//отрисовка карты TAB
function drawMap(cube)
{
	canvasMap = document.getElementById('maplist');
	ctxMap = canvasMap.getContext('2d');
	
	//задаем области рисования и обьекту карты размеры из настроек
	canvasMap.width=settings.canvasWidth;
	canvasMap.height=settings.canvasHeight;
	
	var cubei=cube.i;
	var cubej=cube.j;
	
	var useri=user.i;
	var userj=user.j;
	
	//фон
	ctxMap.drawImage(mapTexture, 0, 0, 1000, 1000, 0, 0, canvasMap.width, canvasMap.height);
		
	var w=Math.round(canvas.width/settings.countCubes);
	var h=Math.round(canvas.height/settings.countCubes);
		
	//игрок
	ctxMap.drawImage(mapTexture, 1000, 200, 200, 200, user.j*w,user.i*h,w,h);
		
	//крест
	ctxMap.drawImage(mapTexture, 1000, 0, 200, 200, cube.j*w,cube.i*h,w,h);
	
	//отображаем карту
	document.getElementById('maplist').style.display='block';
}
//отрисовка поля игры
function drawCube()
{
	var cube=getCube(user.i,user.j);
	for (var i=0; i<cube.cell.length; i++)
	{
		for (var j=0; j<cube.cell.length; j++)
		{
			//ctx.fillStyle=cube.cell[i][j].color;
			//ctx.fillRect(cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height);
			
			if (cube.cell[i][j].stat=="normal")
			{
				//ctx.strokeStyle="black";
				//ctx.strokeRect(cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height);
				ctx.drawImage(gameTexture, 200, 0, 200, 200, cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height)
			}
			else
			{
				ctx.drawImage(gameTexture, 0, 0, 200, 200, cube.cell[i][j].x,cube.cell[i][j].y,cube.cell[i][j].width,cube.cell[i][j].height)
			}
			//рисуем стены
		}
	}

	//рисуем игрока
	//ctx.fillStyle=user.color;
	//ctx.fillRect(user.x,user.y, user.width, user.height);
	//ctx.strokeRect(user.x,user.y, user.width, user.height);
	if (user.dx<0)
	{
		ctx.drawImage(gameTexture, 400, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else if (user.dx>0)
	{
		ctx.drawImage(gameTexture, 510, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else if (user.dy>0)
	{
		ctx.drawImage(gameTexture, 620, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else if (user.dy<0)
	{
		ctx.drawImage(gameTexture, 730, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
	else 
	{
		ctx.drawImage(gameTexture, 620, 0, 110,200 ,user.x,user.y, user.width, user.height)
	}
}

//!старт, финиш, пауза, проигрыш
//!!!!!!!!!!!!!!!!!!!!!!!!СДЕЛАТЬ ПАУЗУ, НАСТРОЙКИ, СТАТИСТИКУ
//старт - кнопка меню
function startCube()
{
	//берем данные из html содержимого
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	//задаем области рисования и обьекту карты размеры из настроек
	canvas.width=settings.canvasWidth;
	canvas.height=settings.canvasHeight;
	
	//задаем индексы расположения игрока
	user.i=Math.floor(settings.countCubes/2);
	user.j=Math.floor(settings.countCubes/2);
	
	timer = setInterval(updateTime, 1000);
	
	eyes=undefined;
	swapped=undefined;
	
	//создаем кубы
	createCubes(); 
	//создаем двери
	createDoors();
	//cоздаем стены
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			createWall();
		}
	}
	//задаем статус старотовому кубу
	map.cubes[user.i][user.j].stat="start";
	
	//рисуем карту
	drawCube();

	//привязка кнопок
	document.addEventListener('keydown', function(e){e.preventDefault(); keyStatus[e.keyCode || e.which] = true; processKey(); gameKey();},true);
	document.addEventListener('keyup', function(e){e.preventDefault(); keyStatus[e.keyCode || e.which] = false; },true);

	//активация кнопок
	//processKey();
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapInterval);
	
	//скрываем окно
	document.getElementById('menu').style.display='none';
	gameStatus="play";
	
	console.log("start");
}
//функция, необходимая для перемещения куба, в котором находится игрок и отрисовки изменения кадра
function swapGame()
{
	swap();
	refreshGame();
}
//функция, которая выполняется после прохождения лабиринта
function finishGame()
{
	document.getElementById('finish').style.display='flex';
	clearInterval(interval);
	clearInterval(timer);
	
	visualTime('finishTime');
	sec=0;
	min=0;
	hour=0;
	
	//document.removeEventListener('keydown', gameStrategy);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameStatus="finish";
}

//отображение окон меню
function displayed(id)
{
	if (document.getElementById(id).style.display=='flex')
	{
		document.getElementById(id).style.display='none';
		if (gameStatus=="start")
		document.getElementById('menu').style.display='flex';
		if (gameStatus=="finish")
		document.getElementById('finish').style.display='flex';
	}
	else
	{
		document.getElementById(id).style.display='flex';
		if (gameStatus=="start")
		document.getElementById('menu').style.display='none';
		if (gameStatus=="finish")
		document.getElementById('finish').style.display='none';
	}
}

//открытие главного меню
function menu()
{
	location.reload();
}

function statistic()
{
	
}

//!генерация игрового поля, поиск элементов 
//поиск финиша
function getFinish()
{
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			if (map.cubes[i][j].stat=="finish")
			{
				return map.cubes[i][j];
				break;
			}
		}
	}
}
//поиск куба, в котором находится игрок
function getCube(i,j)
{
	//console.log(i,j);
	return map.cubes[i][j];
}

//поиск клетки, на которой стоит игрок
function getCell(cube, x,y)
{
	for(var i=0;i<10;i++)//столбцы
	{
		for(var j=0;j<10;j++)
		{
			var minx=cube.cell[i][j].x;
			var miny=cube.cell[i][j].y;
			var maxx=cube.cell[i][j].x+cube.cell[i][j].width;
			var maxy=cube.cell[i][j].y+cube.cell[i][j].height;
				
			if((minx<=x) && (x<=maxx)&& (miny<=y)&& (y<=maxy) )
			{
				//console.log(i,j);
				return cube.cell[i][j];
				break;
			}
		}
	}
}


//создание кубов
function createCubes()
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		map.cubes[i]=new Array(settings.countCubes);
		for(var j=0;j<settings.countCubes;j++)//строки
		{
			var wid=settings.canvasWidth;
			var hei=settings.canvasWidth;
			var x=0;
			var y=0;

			var color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
			//rand = min + Math.random() * (max + 1 - min);
			
			map.cubes[i][j]=new cube(wid,hei,x,y,i,j,color);
			
			var cellCol = '#';
			for (var k = 0; k < 6; k++) 
			{
				cellCol += Math.floor(Math.random() * 6);
			}
			
			map.cubes[i][j].cellColor=cellCol;
			createCell(i,j);
		}
	}
	createFinishCube();
}

//поиск подходящего финишного куба и создание его
function createFinishCube()
{
	//создание финишного куба
	//задаем рандом индексы
	var randi=Math.round(0 - 0.5 + Math.random() * (settings.countCubes-1 + 1 - 0));
	var randj=Math.round(0 - 0.5 + Math.random() * (settings.countCubes-1 + 1 - 0));

	//считаем расстояние текущего расположения финиша с краями карты
	var elem=[];
	elem.push(randj-0);
	elem.push(randi-0);
	elem.push(settings.countCubes-1-randj);
	elem.push(settings.countCubes-1-randi);
	
	var min = Math.min.apply(null, elem);
	var index=0;
	for (var i=0; i<elem.length; i++)
	{
		if (elem[i]==min)
			index=i;
	}
	if (index==0)
	{
		while (randj>0)
			randj--;
	}
	else if (index==1)
	{
		while (randi>0)
			randi--;
	}
	else if (index==2)
	{
		while (randj<settings.countCubes-1)
			randj++
	}
	else if (index==3)
	{
		while (randi<settings.countCubes-1)
			randi++;
	}
	map.cubes[randi][randj].stat="finish";
}
//создание дверей - стандартный уровень
function createDoors()
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		for(var j=0;j<settings.countCubes;j++)//строки
		{
			var door=new Array(4);
			var count=0;
				
			if (i==0 && j==0)
			{
				door[0]=false;
				door[1]=false;
				door[2]=Math.random() < 0.5;
				if (door[2]==true) count++;
				door[3]=Math.random() < 0.5;
				if (door[2]==true) count++;
				if (count==0) door[2]=true;
				count=0;
			}
			else if (i==0 && j>0 && j+1!=settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=false;
				door[2]=Math.random() < 0.5;
				if (door[2]==true) count++;
				door[3]=Math.random() < 0.5;
				if (door[3]==true) count++;
				if (count==0) door[3]=true;
				count=0;
			}
			else if (i==0 && j+1==settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=false;
				door[2]=false;
				door[3]=Math.random() < 0.5;
				if (door[3]==true) count++;
				if (count==0) door[3]=true;
				count=0;
			}
			else if (i>0 && i+1!=settings.countCubes && j==0)
			{
				door[0]=false;
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
				if (door[2]==true) count++;
				door[3]=Math.random() < 0.5;
				if (door[3]==true) count++;
				if (count==0) door[3]=true;
				count=0;
			}
			else if (i>0 && i+1!=settings.countCubes && j>0 && j+1!=settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
				if (door[2]==true) count++;
				door[3]=Math.random() < 0.5;
				if (door[3]==true) count++;
				if (count==0) door[3]=true;
				count=0;
				
			}
			else if (i>0 && i+1!=settings.countCubes && j+1==settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				if (door[0]==true) count++;
				door[1]=map.cubes[i-1][j].door[3];
				if (door[1]==true) count++;
				door[2]=false;
				door[3]=Math.random() < 0.5;
				if (door[3]==true) count++;
				if (count<=1) door[3]=true;
				count=0;
			}
			else if (i+1==settings.countCubes && j==0)
			{
				door[0]=false;
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
				if (door[2]==true) count++;
				if (count==0) door[2]=true;
				door[3]=false;
				count=0;
			}
			else if (i+1==settings.countCubes && j>0 && j+1!=settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				if (door[0]==true) count++;
				door[1]=map.cubes[i-1][j].door[3];
				if (door[1]==true) count++;
				door[2]=Math.random() < 0.5;
				if (door[2]==true) count++;
				if (count<=1) door[2]=true;
				door[3]=false;
				count=0;
			}
			else if (i+1==settings.countCubes && j+1==settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=false;
				door[3]=false;
			}
			map.cubes[i][j].door=door;
		}
	}
}
//создание стен
function createCell(m,n)
{
	for(var i=0;i<10;i++)//столбцы
	{
		map.cubes[m][n].cell[i]=new Array(10);
		for(var j=0;j<10;j++)//строки
		{
			var wid=settings.cellWidth;
			var hei=settings.cellHeight;
			var x=map.x+wid*i;
			var y=map.y+hei*j;

			//var color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
			var color=map.cubes[m][n].color;
			
			map.cubes[m][n].cell[i][j]=new cell(wid,hei,x,y,color);
		}
	}
}
//создание стен
function createWall()
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			for (var s=0; s<4; s++)
			{
				if (map.cubes[i][j].door[s]==true)
				{
					//дверь есть
					switch (s)
					{
						case 0:
							//up - выбираем расположение стены сверху РАБОТАЕТ
							for (var jj=0; jj<4; jj++)
							{
								map.cubes[i][j].cell[0][jj].stat="wall";
								map.cubes[i][j].cell[0][jj].color=map.cubes[i][j].cellColor;
							}
							for (var jj=6; jj<10; jj++)
							{
								map.cubes[i][j].cell[0][jj].stat="wall";
								map.cubes[i][j].cell[0][jj].color=map.cubes[i][j].cellColor;
							}
							break;
						case 1:
							//left - слева РАБОТАЕТ				
							for (var ii=0; ii<4; ii++)
							{
								map.cubes[i][j].cell[ii][0].stat="wall";
								map.cubes[i][j].cell[ii][0].color=map.cubes[i][j].cellColor;
							}
							for (var ii=6; ii<10; ii++)
							{
								map.cubes[i][j].cell[ii][0].stat="wall";
								map.cubes[i][j].cell[ii][0].color=map.cubes[i][j].cellColor;
							}
							break;
						case 2:
							//down - снизу РАБОТАЕТ
							for (var jj=0; jj<4; jj++)
							{
								map.cubes[i][j].cell[9][jj].stat="wall";
								map.cubes[i][j].cell[9][jj].color=map.cubes[i][j].cellColor;
							}
							for (var jj=6; jj<10; jj++)
							{
								map.cubes[i][j].cell[9][jj].stat="wall";
								map.cubes[i][j].cell[9][jj].color=map.cubes[i][j].cellColor;
							}
							break;
						case 3:
							//right РАБОТАЕТ
							for (var ii=0; ii<4; ii++)
							{
								map.cubes[i][j].cell[ii][9].stat="wall";
								map.cubes[i][j].cell[ii][9].color=map.cubes[i][j].cellColor;
							}
							for (var ii=6; ii<10; ii++)
							{
								map.cubes[i][j].cell[ii][9].stat="wall";
								map.cubes[i][j].cell[ii][9].color=map.cubes[i][j].cellColor;
							}
							break;
					}
				}
				else
				{
					//дверь отсутствует, просто рисуем сплошную стену
					switch (s)
					{
						case 0:
							//up РАБОТАЕТ
							for (var jj=0; jj<10; jj++)
							{
								map.cubes[i][j].cell[0][jj].stat="wall";
								map.cubes[i][j].cell[0][jj].color=map.cubes[i][j].cellColor;
							}
							break;
						case 1:
							//left РАБОТАЕТ
							for (var ii=0; ii<10; ii++)
							{
								map.cubes[i][j].cell[ii][0].stat="wall";
								map.cubes[i][j].cell[ii][0].color=map.cubes[i][j].cellColor;
							}
							break;
						case 2:
							//down РАБОТАЕТ
							for (var jj=0; jj<10; jj++)
							{
								map.cubes[i][j].cell[9][jj].stat="wall";
								map.cubes[i][j].cell[9][jj].color=map.cubes[i][j].cellColor;
							}
							break;
						case 3:
							//right РАБОТАЕТ
							for (var ii=0; ii<10; ii++)
							{
								map.cubes[i][j].cell[ii][9].stat="wall";
								map.cubes[i][j].cell[ii][9].color=map.cubes[i][j].cellColor;
							}
							break;
					}
				}
			}
		}
	}
}

//!таймер, телепорт, взаимодействие с картой, проверка столкновений игрока с сущностями и стенами
//счетчик времени
function updateTime() //ОК
{
    sec++;
    if (sec >= 60) 
	{ //задаем числовые параметры, меняющиеся по ходу работы программы
        min++;
        sec = sec - 60;
    }
    if (min >= 60) 
	{
        hour++;
        min = min - 60;
    }
    visualTime('time');
}
//отображение времени на любом из элементов html в формате hh:mm:ss
function visualTime(id) //ОК
{
	if (sec < 10) 
	{ 
        if (min < 10) 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML ='Время: 0' + hour + ':0' + min + ':0' + sec;
			else 
                document.getElementById(id).innerHTML ='Время: ' + hour + ':0' + min + ':0' + sec;
		}
		else 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML = 'Время: 0' + hour + ':' + min + ':0' + sec;
			else 
                document.getElementById(id).innerHTML = 'Время: ' + hour + ':' + min + ':0' + sec;
        }
    } 
	else 
	{
        if (min < 10) 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML = 'Время: 0' + hour + ':0' + min + ':' + sec;
			else 
                document.getElementById(id).innerHTML = 'Время: ' + hour + ':0' + min + ':' + sec;
        } 
		else 
		{
            if (hour < 10) 
                document.getElementById(id).innerHTML = 'Время: 0' + hour + ':' + min + ':' + sec;
			else 
                document.getElementById(id).innerHTML = 'Время: ' + hour + ':' + min + ':' + sec;
        }
    }
}

//открытие и закрытие карты
function toggleMap()
{
	if (gameStatus=="map")
	{
		//скрываем карту
		document.getElementById('maplist').style.display='none';
	
		gameStatus="play";
		console.log("closemap");
		return;
	}
	if (eyes==undefined)
	{
		drawMap(getFinish());
		eyes=setTimeout(function(){eyes=undefined;}, settings.mapTime);
		
		gameStatus="map";
		console.log("openmap");
	}
}

//проверка столкновений (передаем клетку, на которой стоит игрок!)
function checkCollision(cube)
{	
	//предполагаемые координаты, если бы совершили шаг
	var x=user.x+user.dx;
	var y=user.y+user.dy;
	var w=x+user.width;
	var h=y+user.height;
	
	//здесь идет проверка со стенами
	//шаг вверх
	if (user.dy<0)
	{
		if (user.y<0)
		{
			user.i-=1;
			user.y=settings.canvasHeight-user.height;
			user.centery=settings.canvasHeight-user.height-Math.round(settings.userHeight/2);
		}
		else
		{
			//значения для верхнего левого и правого угла игрока
			var cellleft=getCell(cube, user.x, user.y);
			var cellright=getCell(cube, user.x+user.width, user.y);
			if (cellleft.stat=="wall" || cellright.stat=="wall")
				return true;
			else return false;
			cellleft=undefined;
			cellright=undefined;
		}
	}
	//шаг влево
	else if (user.dx<0)
	{
		if (user.x<0)
		{
			user.j-=1;
			user.x=settings.canvasWidth-user.width;
			user.centerx=settings.canvasHeight-user.height-Math.round(settings.userHeight/2);
		}
		else
		{
			//значения для левого верхнего и нижнего угла игрока
			var cellup=getCell(cube, user.x, user.y);
			var celldown=getCell(cube, user.x, user.y+user.height);
			if (cellup.stat=="wall" || celldown.stat=="wall")
				return true;
			else return false;
			cellup=undefined;
			celldown=undefined;
		}
	}
	//шаг вниз
	else if (user.dy>0)
	{
		if (user.y+user.height>settings.canvasHeight)
		{
			user.i+=1;
			user.y=0;
			user.centery=0+Math.round(settings.userHeight/2);
		}
		else
		{
			//значения для нижнего левого и правого угла игрока
			var cellleft=getCell(cube, user.x, user.y+user.height);
			var cellright=getCell(cube, user.x+user.width, user.y+user.height);
			if (cellleft.stat=="wall" || cellright.stat=="wall")
				return true;
			else return false;
			cellleft=undefined;
			cellright=undefined;
		}
	}
	//шаг вправо
	else if (user.dx>0)
	{
		if (user.x+user.width>settings.canvasWidth)
		{
			user.j+=1;
			user.x=0;
			user.centerx=0+Math.round(settings.userWidth/2);
			//console.log("coord: "+user.i, user.j);
		}
		else
		{
			//значения для правого верхнего и нижнего угла игрока
			var cellup=getCell(cube, user.x+user.width, user.y);
			var celldown=getCell(cube, user.x+user.width, user.y+user.height);
			if (cellup.stat=="wall" || celldown.stat=="wall")
				return true;
			else return false;
			cellup=undefined;
			celldown=undefined;
		}
	}
}
//функция смены местами кубов с одинаковыми дверями
function swap()
{	
	user.dx=0;
	user.dy=0;
	//функция сравнения содержимого двух одномерных массивов
	function compareArrays(a, b) 
	{
		if (a.length == b.length) 
		{
			for (var i = 0; i < a.length; i++) 
			{
				if (a[i] !== b[i]) 
				{
					return false;
				}
			}
			return true;
		}
		return false;
	}
	//получаем текущий куб, в котором находится игрок
	var cube=getCube(user.i,user.j);
	//рандомом ищем i,j rand = min + Math.random() * (max + 1 - min);
	var randi=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
	var randj=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
	
	//временные переменные, хранящие индексы искомого куба
	var tempi=randi;
	var tempj=randj;
		
	//проверяем совпадение массива дверей, если ок оставляем, если нет, ищем дальше, до тех пор, пока все кубы не проверим
	var newCube=map.cubes[randi][randj];
	
	//переменная ошибки
	var stop=0;
	
	//прокручиваем цикл до тех пор, пока не найдем подходящий куб
	while(compareArrays(cube.door, newCube.door)==false)
	{
		//прокрутка массива кубов без пограничных кубов и того, в котором находится игрок
		if (tempi+1>settings.countCubes-2)
		{
			if (tempj+1>settings.countCubes-2)
				tempj=1;
			else if (tempj+1==cube.j&&tempi==cube.i)
				tempj+=2;
			else
				tempj++;
			tempi=1;
		}
		else if (tempi+1==cube.i&&tempj==cube.j)
			tempi+=2;
		else
			tempi++;
		
		//получаем обьект куба с текущими временными индексами для дальнейшей проверки
		newCube=map.cubes[tempi][tempj];
		
		//если не нашли подходящий куб, то принудительно выходим из цикла
		if (tempi==randi&&tempj==randj)
		{
			break;
		}
		
		//на случай, если вдруг произошла бесконечная прокрутка
		stop++;
		if (stop>100)
		{
			break;
		}
	}
	
	//если нашли, то в массиве кубов меняем элементы местами
	if (compareArrays(cube.door, newCube.door)==true)
	{
		//сохраняем расположение старого куба
		var oldi=cube.i;
		var oldj=cube.j;
		
		//меняем кубы
		map.cubes[tempi][tempj]=cube;
		map.cubes[oldi][oldj]=newCube;
		
		//меняем расположение игрока, чтобы он сохранился в старом кубе
		user.i=tempi;
		user.j=tempj;
	}
}
//обработка функции нажатия на пробел - принудительное перемещение куба
function teleport()
{
	if (swapped==undefined)
	{
		//получаем текущий куб, в котором находится игрок
		var cube=getCube(user.i,user.j);
		
		//рандомом ищем i,j rand = min + Math.random() * (max + 1 - min);
		var randi=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
		var randj=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
		
		//получаем будущий куб, в который будет перемещен игрок
		var newCube=map.cubes[randi][randj];
		
		//меняем расположение игрока, чтобы он сохранился в старом кубе
		user.i=randi;
		user.j=randj;
		swapped=setTimeout(function(){swapped=undefined;}, settings.teleportTime);
	}
}
