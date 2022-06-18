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
	let time='';
	if (sec < 10) 
	{ 
        if (min < 10) 
		{
            if (hour < 10) 
                time ='Время: 0' + hour + ':0' + min + ':0' + sec;
			else 
                time ='Время: ' + hour + ':0' + min + ':0' + sec;
		}
		else 
		{
            if (hour < 10) 
                time = 'Время: 0' + hour + ':' + min + ':0' + sec;
			else 
                time = 'Время: ' + hour + ':' + min + ':0' + sec;
        }
    } 
	else 
	{
        if (min < 10) 
		{
            if (hour < 10) 
                time = 'Время: 0' + hour + ':0' + min + ':' + sec;
			else 
                time = 'Время: ' + hour + ':0' + min + ':' + sec;
        } 
		else 
		{
            if (hour < 10) 
                time = 'Время: 0' + hour + ':' + min + ':' + sec;
			else 
                time = 'Время: ' + hour + ':' + min + ':' + sec;
        }
    }
	document.getElementById(id).innerHTML = time;
	return time;
}

//открытие и закрытие карты
function toggleMap()
{
	if (gameStatus=="map")
	{
		if (gamemode == "cube")
		{
			//скрываем карту
			document.getElementById('maplist').style.display='none';
		}
		
		gameStatus="play";
	}
	if (eyes==undefined)
	{
		if (gamemode == "cube")
		{
			drawMap(getFinish());
		}
		else
		{
			drawLabirynth();
		}
		eyes=setTimeout(function(){eyes=undefined;}, settings.mapTime);
		gameStatus="map";
	}
}

//проверка столкновений (передаем клетку, на которой стоит игрок!)
function checkCubeCollision(cube)
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

//проверка столкновений
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
		if (cube.door[0]==true)
		{
			//если дверь в кубе имеется, проверяем две стены с возможностью пройти в проход
			if (y<cube.y+cube.wallSize && (x<Math.round(cube.width/3)+cube.x || w>Math.round(cube.width/3*2)+cube.x))
				return true;
			//если мы идем вверх, находясь в промежутке левых или правых дверей
			else if (y<Math.round(cube.height/3)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
		else
		//если двери нет, то проверяем целую стену
		{
			if (y<cube.y+cube.wallSize)
				return true;
			//если находимся в промежутке правых или левых дверей
			else if (y<Math.round(cube.height/3)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
	}
	else if (user.dx<0)
	{
		if (cube.door[1]==true)
		{
			//промежуток
			if (x<cube.x+cube.wallSize && (y<Math.round(cube.height/3)+cube.y || h>Math.round(cube.height/3*2)+cube.y))
				return true;
			else if (x<Math.round(cube.width/3)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
		else
		//целиком
		{
			if (x<cube.x+cube.wallSize)
				return true;
			else if (x<Math.round(cube.width/3)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
	}
	else if (user.dy>0)
	{
		if (cube.door[2]==true)
		{
			if (h>cube.y+cube.height-cube.wallSize && (x<Math.round(cube.width/3)+cube.x || w>Math.round(cube.width/3*2)+cube.x))
				return true;
			else if (h>Math.round(cube.height/3*2)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
		else
		//целиком
		{
			if (h>cube.y+cube.height-cube.wallSize)
				return true;
			else if (h>Math.round(cube.height/3*2)+cube.y &&(x<cube.x+cube.wallSize  ||  w>cube.x+cube.width-cube.wallSize))
				return true;
			else return false;
		}
	}
	else if (user.dx>0)
	{
		if (cube.door[3]==true)
		{
			//промежуток
			if (w>cube.x+cube.width-cube.wallSize && (y<Math.round(cube.height/3)+cube.y || h>Math.round(cube.height/3*2)+cube.y))
				return true;
			else if (w>Math.round(cube.width/3*2)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
		}
		else
		//целиком
		{
			if (w>cube.x+cube.width-cube.wallSize)
				return true;
			else if (w>Math.round(cube.width/3*2)+cube.x &&(y<cube.y+cube.wallSize  ||  h>cube.y+cube.height-cube.wallSize))
				return true;
			else return false;
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
	let cube;
	if (gamemode=="cube")
	{
		cube=getCubeByIndex(user.i,user.j);
	}
	else
	{
		cube=getCubeByCoord(user.centerx,user.centery);
	}
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
		
		if (gamemode =="cube")
		{
			//меняем расположение игрока, чтобы он сохранился в старом кубе
			user.i=tempi;
			user.j=tempj;
		}
		else
		{
			//меняем местами цвета стен
			var swapWallColor = cube.wallColor;
			cube.wallColor = newCube.wallColor;
			newCube.wallColor = swapWallColor;
			
			//меняем местами цвета кубов
			var swapColor = cube.color;
			cube.color = newCube.color;
			newCube.color = swapColor;
			
			//меняем кубы
			map.cubes[oldi][oldj]=cube;
			map.cubes[tempi][tempj]=newCube;
			
			//меняем расположение игрока, чтобы он сохранился в старом кубе
			var deltax=Math.round(user.x-map.cubes[oldi][oldj].x);
			var deltay=Math.round(user.y-map.cubes[oldi][oldj].y);
			
			user.x=Math.round(map.cubes[tempi][tempj].x+deltax);
			user.y=Math.round(map.cubes[tempi][tempj].y+deltay);
			user.centerx=user.width/2+user.x;
			user.centery=user.height/2+user.y;
		}
	}
}
//обработка функции нажатия на пробел - принудительное перемещение куба
function teleport()
{
	if (swapped==undefined)
	{
		//получаем текущий куб, в котором находится игрок
		let cube;
		if (gamemode=="cube")
		{
			cube=getCubeByIndex(user.i,user.j);
		}
		else
		{
			cube=getCubeByCoord(user.centerx,user.centery);
		}
		
		//рандомом ищем i,j rand = min + Math.random() * (max + 1 - min);
		var randi=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
		var randj=Math.round(1 - 0.5 + Math.random() * (settings.countCubes-2 + 1 - 1));
		
		//получаем будущий куб, в который будет перемещен игрок
		var newCube=map.cubes[randi][randj];
		
		if (gamemode=="cube")
		{
			//меняем расположение игрока, чтобы он сохранился в старом кубе
			user.i=randi;
			user.j=randj;
		}
		else
		{
			//меняем расположение игрока, чтобы он сохранился в старом кубе
			var deltax=Math.round(user.x-map.cubes[cube.i][cube.j].x);
			var deltay=Math.round(user.y-map.cubes[cube.i][cube.j].y);
				
			user.x=Math.round(map.cubes[randi][randj].x+deltax);
			user.y=Math.round(map.cubes[randi][randj].y+deltay);
			user.centerx=user.width/2+user.x;
			user.centery=user.height/2+user.y;
		}
		swapped=setTimeout(function(){swapped=undefined;}, settings.teleportTime);
	}
}
