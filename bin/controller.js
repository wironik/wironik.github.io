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
