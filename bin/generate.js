//!генерация игрового поля, поиск элементов 
//поиск финиша
function getFinish() //куб
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
function getCubeByIndex(i,j) //куб
{
	//console.log(i,j);
	return map.cubes[i][j];
}

function getCubeByCoord(x,y)
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			var minx=map.cubes[i][j].x;
			var miny=map.cubes[i][j].y;
			var maxx=map.cubes[i][j].x+map.cubes[i][j].width;
			var maxy=map.cubes[i][j].y+map.cubes[i][j].height;
				
			if((minx<x) && (x<maxx)&& (miny<y)&& (y<maxy) )
			{
				//console.log("cube:",i,j);
				return map.cubes[i][j];
				break;
			}
		}
	}
}

//поиск клетки, на которой стоит игрок
function getCell(cube, x,y) //куб
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

//создание кубов //куб
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

//создание кубов
function createGameCubes() //лабиринт
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		map.cubes[i]=new Array(settings.countCubes);
		for(var j=0;j<settings.countCubes;j++)//строки
		{
			var wid=map.width/settings.countCubes;
			var hei=map.height/settings.countCubes;
			var x=map.x+wid*i;
			var y=map.y+hei*j;

			var color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
			//rand = min + Math.random() * (max + 1 - min);
			
			map.cubes[i][j]=new cube(wid,hei,x,y,i,j,color);
			
			var door=new Array(4);
			var value=0;
			for (var s=0; s<4; s++)
			{
				door[s]=Math.random() < 0.5;
				if (door[s]==true) value++;
			}
			if (value==0) door[2]=true;
			value=0;
			map.cubes[i][j].door=door;
			
			//var wallCol='#'+Math.random().toString(16).slice(2,8);
			var wallCol = '#';
			for (var k = 0; k < 6; k++) 
			{
				wallCol += Math.floor(Math.random() * 6);
			}
			
			map.cubes[i][j].wallColor=wallCol;
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
//создание дверей - сложный уровень
function createHardDoors()
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
				door[3]=Math.random() < 0.5; 
				count=0;
			}
			else if (i==0 && j>0 && j+1!=settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=false;
				door[2]=Math.random() < 0.5;
				door[3]=Math.random() < 0.5;
				count=0;
			}
			else if (i==0 && j+1==settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=false;
				door[2]=false;
				door[3]=Math.random() < 0.5;
				count=0;
			}
			else if (i>0 && i+1!=settings.countCubes && j==0)
			{
				door[0]=false;
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
				door[3]=Math.random() < 0.5;
				count=0;
			}
			else if (i>0 && i+1!=settings.countCubes && j>0 && j+1!=settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
				door[3]=Math.random() < 0.5;
				count=0;
				
			}
			else if (i>0 && i+1!=settings.countCubes && j+1==settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=false;
				door[3]=Math.random() < 0.5;
				count=0;
			}
			else if (i+1==settings.countCubes && j==0)
			{
				door[0]=false;
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
				door[3]=false;
				count=0;
			}
			else if (i+1==settings.countCubes && j>0 && j+1!=settings.countCubes)
			{
				door[0]=map.cubes[i][j-1].door[2];
				door[1]=map.cubes[i-1][j].door[3];
				door[2]=Math.random() < 0.5;
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

//создание стен //куб
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
//создание стен //куб
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

//создание стен //лабиринт
function createWalls()
{
	for(var i=0;i<settings.countCubes;i++)//столбцы
	{
		for(var j=0;j<settings.countCubes;j++)
		{
			//for (var s=0; s<4; s++)
			//	console.log(map.cubes[i][j].door[0],map.cubes[i][j].door[1],map.cubes[i][j].door[2],map.cubes[i][j].door[3]);
			for (var s=0; s<4; s++)
			{
				if (map.cubes[i][j].door[s]==true)
				{//дверь есть, делим ширину на 3 с округлением, задаем ширину стены=любая (или 2),
					switch (s)
					{
						case 0:
							//up - выбираем расположение стены сверху РАБОТАЕТ
							var wid=Math.round(map.cubes[i][j].width/3);
							var hei=map.cubes[i][j].wallSize;
							var x1=map.cubes[i][j].x;
							var y1=map.cubes[i][j].y;
							var x2=Math.round((map.cubes[i][j].x+map.cubes[i][j].width)-Math.round(map.cubes[i][j].width/3));
							var y2=map.cubes[i][j].y;
							map.cubes[i][j].wall.push(new wall(wid,hei,x1,y1,map.cubes[i][j].wallColor));
							map.cubes[i][j].wall.push(new wall(wid,hei,x2,y2,map.cubes[i][j].wallColor));
							break;
						case 1:
							//left - слева РАБОТАЕТ				
							var wid=map.cubes[i][j].wallSize;
							var hei=Math.round(map.cubes[i][j].height/3);
							var x1=map.cubes[i][j].x
							var y1=map.cubes[i][j].y
							var x2=map.cubes[i][j].x
							var y2=Math.round((map.cubes[i][j].y+map.cubes[i][j].height)-Math.round(map.cubes[i][j].height/3));
							map.cubes[i][j].wall.push(new wall(wid,hei,x1,y1,map.cubes[i][j].wallColor));
							map.cubes[i][j].wall.push(new wall(wid,hei,x2,y2,map.cubes[i][j].wallColor));
							break;
						case 2:
							//down - снизу РАБОТАЕТ
							var wid=Math.round(map.cubes[i][j].width/3);
							var hei=map.cubes[i][j].wallSize;
							var x1=map.cubes[i][j].x;
							var y1=Math.round(map.cubes[i][j].y+map.cubes[i][j].height)-map.cubes[i][j].wallSize;
							var x2=Math.round((map.cubes[i][j].x+map.cubes[i][j].width)-Math.round(map.cubes[i][j].width/3));
							var y2=Math.round(map.cubes[i][j].y+map.cubes[i][j].height)-map.cubes[i][j].wallSize;
							map.cubes[i][j].wall.push(new wall(wid,hei,x1,y1,map.cubes[i][j].wallColor));
							map.cubes[i][j].wall.push(new wall(wid,hei,x2,y2,map.cubes[i][j].wallColor));
							break;
						case 3:
							//right РАБОТАЕТ
							var wid=map.cubes[i][j].wallSize;
							var hei=Math.round(map.cubes[i][j].height/3);
							var x1=map.cubes[i][j].width+map.cubes[i][j].x-map.cubes[i][j].wallSize;
							var y1=map.cubes[i][j].y;
							var x2=map.cubes[i][j].width+map.cubes[i][j].x-map.cubes[i][j].wallSize;
							var y2=Math.round((map.cubes[i][j].y+map.cubes[i][j].height)-Math.round(map.cubes[i][j].height/3));
							map.cubes[i][j].wall.push(new wall(wid,hei,x1,y1,map.cubes[i][j].wallColor));
							map.cubes[i][j].wall.push(new wall(wid,hei,x2,y2,map.cubes[i][j].wallColor));
							break;
					}
				}
				else
				{//дверь отсутствует, просто рисуем сплошную стену
					switch (s)
					{
						case 0:
							//up РАБОТАЕТ
							var wid=map.cubes[i][j].width;
							var hei=map.cubes[i][j].wallSize;
							var x=map.cubes[i][j].x;
							var y=map.cubes[i][j].y;
							map.cubes[i][j].wall.push(new wall(wid,hei,x,y,map.cubes[i][j].wallColor));
							break;
						case 1:
							//left РАБОТАЕТ
							var wid=map.cubes[i][j].wallSize;
							var hei=map.cubes[i][j].height;
							var x=map.cubes[i][j].x
							var y=map.cubes[i][j].y
							map.cubes[i][j].wall.push(new wall(wid,hei,x,y,map.cubes[i][j].wallColor));
							break;
						case 2:
							//down РАБОТАЕТ
							var wid=map.cubes[i][j].width;
							var hei=map.cubes[i][j].wallSize;
							var x=map.cubes[i][j].x;
							var y=map.cubes[i][j].height+map.cubes[i][j].y-map.cubes[i][j].wallSize;
							map.cubes[i][j].wall.push(new wall(wid,hei,x,y,map.cubes[i][j].wallColor));
							break;
						case 3:
							//right РАБОТАЕТ
							var wid=map.cubes[i][j].wallSize;
							var hei=map.cubes[i][j].height;
							var x=map.cubes[i][j].width+map.cubes[i][j].x-map.cubes[i][j].wallSize;
							var y=map.cubes[i][j].y;
							map.cubes[i][j].wall.push(new wall(wid,hei,x,y,map.cubes[i][j].wallColor));
							break;
					}
				}
			}
		}
	}
}