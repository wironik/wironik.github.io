//!отрисовка в процессе игры, отрисовка куба, карты
//отслеживание перемещения, взаимодействие со стенами и сущностями, финишем и проигрышем
function refreshGame()
{
	//console.log("refresh");
	// получаем текущий куб, в котором находится игрок для получения информации
	let cube;
	if (gamemode=="cube")
	{
		cube=getCubeByIndex(user.i,user.j);
	}
	else
	{
		cube=getCubeByCoord(user.centerx,user.centery);
	}
	// Обновляем кадр только если значок движется
	if (user.dx != 0 || user.dy != 0) 
	{
		if (gamemode =="cube")
		{
			//Проверка столкновения со стенами
			if (checkCubeCollision(cube)==false) 
			{
				user.x += user.dx;
				user.y += user.dy;
				user.centerx+=user.dx;
				user.centery+=user.dy;
			}
		}
		else
		{
			if (checkCollision(cube)==false) 
			{
				user.x += user.dx;
				user.y += user.dy;
				user.centerx+=user.dx;
				user.centery+=user.dy;
			}
		}
	}
	//стираем холст
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//рисуем
	if (gamemode =="cube")
	{
		drawCube();
	}
	else if (gamemode=="blind")
	{
		drawBlind();
	}
	else
	{
		drawLabirynth();
	}
	
	if (cube.stat=="finish")
	{
		finishGame();
	}
	user.dx=0;
	user.dy=0;
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
	var cube=getCubeByIndex(user.i,user.j);
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

function drawLabirynth()
{
	//рисуем карту
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			//рисуем кубы
			ctx.fillStyle=map.cubes[i][j].color;
			ctx.fillRect(map.cubes[i][j].x, map.cubes[i][j].y,map.cubes[i][j].width,map.cubes[i][j].height);
			for (var s=0; s<map.cubes[i][j].wall.length; s++)
			{
				//рисуем стены
				ctx.fillStyle=map.cubes[i][j].wallColor;
				ctx.fillRect(map.cubes[i][j].wall[s].x,map.cubes[i][j].wall[s].y,map.cubes[i][j].wall[s].width,map.cubes[i][j].wall[s].height);
			}
			if (map.cubes[i][j].stat=="finish")
			{
				//рисуем отметку финиша
				var finishx=map.cubes[i][j].x+map.cubes[i][j].width/4;
				var finishy=map.cubes[i][j].y+map.cubes[i][j].height/4;
				var finishw=map.cubes[i][j].width/2;
				var finishh=map.cubes[i][j].height/2;
				ctx.fillStyle="#fff";
				ctx.fillRect(finishx,finishy, finishw, finishh);
				ctx.strokeRect(finishx,finishy, finishw, finishh);
			}
		}
	}
	//рисуем игрока
	ctx.fillStyle=user.color;
	ctx.fillRect(user.x,user.y, user.width, user.height);
	ctx.strokeRect(user.x,user.y, user.width, user.height);
}

function drawBlind()
{
	//стираем холст
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//рисуем
	//рисуем игрока
	ctx.fillStyle=user.color;
	ctx.fillRect(user.x,user.y, user.width, user.height);
	ctx.strokeRect(user.x,user.y, user.width, user.height);
	
	//рисуем карту
	for(var i=0;i<settings.countCubes;i++)
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			if (map.cubes[i][j].stat=="finish")
			{
				//рисуем отметку финиша
				var finishx=map.cubes[i][j].x+map.cubes[i][j].width/4;
				var finishy=map.cubes[i][j].y+map.cubes[i][j].height/4;
				var finishw=map.cubes[i][j].width/2;
				var finishh=map.cubes[i][j].height/2;
				ctx.fillStyle="#fff";
				ctx.fillRect(finishx,finishy, finishw, finishh);
				ctx.strokeRect(finishx,finishy, finishw, finishh);
			}
		}
	}
}
