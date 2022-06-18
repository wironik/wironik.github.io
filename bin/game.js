//!старт, финиш, пауза, проигрыш
function start()
{
	let score = localStorage.getItem('score');
	score++;
	localStorage.setItem('score', score);
	//берем данные из html содержимого
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	timer = setInterval(updateTime, 1000);
	
	eyes=undefined;
	swapped=undefined;
	
	//привязка кнопок
	document.addEventListener('keydown', function(e){e.preventDefault(); keyStatus[e.keyCode || e.which] = true; processKey(); gameKey();},true);
	document.addEventListener('keyup', function(e){e.preventDefault(); keyStatus[e.keyCode || e.which] = false; },true);
	
	//скрываем окно
	document.getElementById('select').style.display='none';
	gameStatus="play";
}
function setSettings()
{
	//получаем размеры игрока, карты и холста
	user.width=Math.round(settings.canvasWidth/settings.countCubes/6);
	user.height=Math.round(settings.canvasHeight/settings.countCubes/6);
	
	//задаем области рисования и обьекту карты размеры из настроек
	map.width=settings.canvasWidth;
	map.height=settings.canvasHeight;
	canvas.width=settings.canvasWidth;
	canvas.height=settings.canvasHeight;
	
	//задаем пользователю расположение в центральном кубе
	user.x=Math.round(map.width/2)-Math.round(user.width/2);
	user.centerx=user.width/2+user.x;
	user.y=Math.round(map.height/2)-Math.round(user.height/2);
	user.centery=user.height/2+user.y;
}
//старт - кнопка меню
function startGame()
{
	start();
	//задаем области рисования и обьекту карты размеры из настроек
	canvas.width=settings.canvasWidth;
	canvas.height=settings.canvasHeight;
	
	//задаем индексы расположения игрока
	user.i=Math.floor(settings.countCubes/2);
	user.j=Math.floor(settings.countCubes/2);
	
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
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapInterval);
	gamemode = "cube";
}
//полная темнота
function startHardGame()
{
	start();
	setSettings();
	//создаем кубы
	createGameCubes();
	//создаем двери
	createDoors();
	//создаем стены
	createWalls();
	//рисуем карту
	drawBlind();
	//refreshHardGame();
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapInterval);
	gamemode = "blind";
}
function startLabitynth()
{
	start();
	setSettings();
	//создаем кубы
	createGameCubes();
	//создаем двери
	createDoors();
	//создаем стены
	createWalls();
	//рисуем карту
	drawLabirynth();
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapHardInterval);
	gamemode = "labirynth";
}
//лабиринт - кнопка меню
function startHardLabitynth()
{
	start();
	setSettings();
	//создаем кубы
	createGameCubes();
	//создаем двери
	createHardDoors();
	//создаем стены
	createWalls();
	//рисуем карту
	drawLabirynth();
	
	//задаем интервал для обработки события перемещения через заданное время в настройках
	interval = setInterval(swapGame,settings.swapInterval);
	gamemode = "hard";
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
	
	let time = visualTime('finishTime');
	
	let score = localStorage.getItem('score');
	let s = localStorage.getItem('second');
	let m = localStorage.getItem('minute');
	let h = localStorage.getItem('hour');
	let tex = localStorage.getItem('time');
	
	let win = localStorage.getItem('win'); //win
	let rate = localStorage.getItem('rate'); //kpd (win/all)
	
	if (h<=hour)
	{
		if (m<=min)
		{
			if (s<=sec)
			{
				localStorage.setItem('second', sec);
				localStorage.setItem('minute', min);
				localStorage.setItem('hour', hour);
				localStorage.setItem('gamemode', gamemode);
			}
		}
	}
	win++;
	rate = Math.round((win/score)*100);
	localStorage.setItem('score',score);
	localStorage.setItem('time', time);
	localStorage.setItem('rate', rate);
	localStorage.setItem('win', win);
	
	
	
	sec=0;
	min=0;
	hour=0;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	gameStatus="finish";
	gamemode = "";
}
//отображение окон меню
function displayed(id)
{
	if (document.getElementById(id).style.display=='flex')
	{
		document.getElementById(id).style.display='none';
		if (gameStatus=="start")
		{
			document.getElementById('menu').style.display='flex';
			//document.getElementById('select').style.display='flex';
		}
		if (gameStatus=="finish")
		document.getElementById('finish').style.display='flex';
	}
	else
	{
		document.getElementById(id).style.display='flex';
		if (gameStatus=="start")
		{
			document.getElementById('menu').style.display='none';
			//document.getElementById('select').style.display='none';
		}
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
	displayed('statistic');
	let staticText = document.getElementById('statisticText');
	let score = localStorage.getItem('score'); //all
	let win = localStorage.getItem('win'); //win
	let rate = localStorage.getItem('rate'); //kpd (win/all)
	let tex = localStorage.getItem('time');
	let mode = localStorage.getItem('gamemode');
	if (tex==null)
	{
		staticText.innerHTML +='Всего сыграно: ' + score;
		staticText.innerHTML += ' Победы: ' + win;
		staticText.innerHTML += ' КПД: ' + rate + '%';
		
		staticText.innerHTML += ' Режим игры: ' + mode;
		staticText.innerHTML += ' Лучшее время: ' + tex;
	}
	else
	{
		staticText.innerHTML +='Всего сыграно: ' + score;
		staticText.innerHTML += ' Победы: ' + win;
		staticText.innerHTML += ' КПД: '  + rate + '%';
		
		staticText.innerHTML += ' Режим игры: ' + mode;
		staticText.innerHTML += ' Лучшее ' + tex;
	}
	
	
}

//function 
