let track = {
	//方向角转时针方向
	GetTimeHour: (direction) => {
	    var jiaodu = Math.floor(direction);
	    if (jiaodu >= 345 || jiaodu < 15){
	        return 0;
	    }else if (jiaodu >= 15 && jiaodu < 45){
	        return 1;
	    }else if (jiaodu >= 45 && jiaodu < 75){
	        return 2;
	    }else if (jiaodu >= 75 && jiaodu < 105){
	        return 3;
	    }else if (jiaodu >= 105 && jiaodu < 135){
	        return 4;
	    }else if (jiaodu >= 135 && jiaodu < 165){
	        return 5;
	    }else if (jiaodu >= 165 && jiaodu < 195){
	        return 6;
	    }else if (jiaodu >= 195 && jiaodu < 225){
	        return 7;
	    }else if (jiaodu >= 225 && jiaodu < 255){
	        return 8;
	    }else if (jiaodu >= 255 && jiaodu < 285){
	        return 9;
	    }else if (jiaodu >= 285 && jiaodu < 315){
	        return 10;
	    }else if (jiaodu >= 315 && jiaodu < 345){
	        return 11;
	    }
	}
}

export default track