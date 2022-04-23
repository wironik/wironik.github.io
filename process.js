//функция, задающая глобальным переменным параметры
function start()
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
	
	//скрываем окно
	document.getElementById('menu').style.display='none';
}
//счетчик времени
function updateTime()
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
function visualTime(id)
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
// Обработка нажатия кнопок
function processKey(e) 
{
	//console.log(e.keyCode);
	//блокируем нажатие клавиш по умолчанию (сами будем задавать нужное)
	e.preventDefault();
	user.dx = 0;
	user.dy = 0;
	if (e.keyCode == 87 || e.keyCode ==38) //вверх
		user.dy = -1*user.speed;
	if (e.keyCode == 83 || e.keyCode ==40) //вниз
		user.dy = user.speed;
	if (e.keyCode == 65 || e.keyCode ==37) //влево
		user.dx = -1*user.speed;
	if (e.keyCode == 68 || e.keyCode ==39) //вправо
		user.dx = user.speed;
	if (e.keyCode == 32)//пробел
		teleport();
	if (e.keyCode == 9)//tab
		openMap();
	if (e.keyCode == 112)//f1
		displayed('help');
	if (e.keyCode == 27)//esc
		menu();
	if (e.keyCode == 120)//f9 финиш отладка
		finishGame();
}

function mapKey(e)
{
	e.preventDefault();
	if (e.keyCode == 27)//esc
		closeMap();
	if (e.keyCode == 9)//tab
		closeMap();
}
//обработка функции нажатия на пробел - принудительное перемещение куба
function teleport()
{
	if (swapped==undefined)
	{
		teleportUser();
		swapped=setTimeout(function(){swapped=undefined;}, settings.teleportTime);
	}
}
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
//обработка функции нажатия на таб - показать всю карту на некоторое время, работает один раз
function openMap()
{
	if (eyes==undefined)
	{
		drawMap(getFinish());
		eyes=setTimeout(function(){eyes=undefined;}, settings.mapTime);
	}
}
function closeMap()
{
	//отвязка игровых кнопок
	document.removeEventListener('keydown', mapKey);
	
	//привязка нужных
	document.addEventListener('keydown', gameStrategy);
	
	//скрываем карту
	document.getElementById('maplist').style.display='none';
}
//отображение окна подсказки
function displayed(id)
{
	if (document.getElementById(id).style.display=='flex')
	{
		document.getElementById(id).style.display='none';
		if (gameStatus=="stop")
		document.getElementById('menu').style.display='flex';
		if (gameStatus=="finish")
		document.getElementById('finish').style.display='flex';
	}
	else
	{
		document.getElementById(id).style.display='flex';
		if (gameStatus=="stop")
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

//поиск куба, в котором находится игрок
function getCube(i,j)
{
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
				return cube.cell[i][j];
				break;
			}
		}
	}
}

//проверка столкновений (передаем клетку, на которой стоит игрок!)
function checkCollision(cube)
{	
	//!!! добавить изменение dx , чтобы примыкать к стене вплотную, если столкновение true
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
//функция, которая перемещает только игрока в новый куб
function teleportUser()
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
}
