var BeaconLocationManager = {};
//円と直線の交点
function calcCircleLineCrossPoint(a,b,c,x1,y1,r){
  var l = a*a+b*b;
  var k = a*x1+b*y1+c;
  var d = l*r*r-k*k;
  if(d>0){
    var ds = Math.sqrt(d);
    var apl = a/l;
    var bpl = b/l;
    var xc = x1-apl*k;
    var yc = y1-bpl*k;
    var xd = bpl*ds;
    var yd = apl*ds;
    return [
      {x:xc-xd,y:yc+yd},
      {x:xc+xd,y:yc-yd}
    ];
  }else if(d==0){
    return [{x:x1-a*k/l,y:y1-b*k/l}];
  }else{
    return [];
  }
}

//円と円の交点
function calcTwoCirclesCrossPoint(x1,y1,r1,x2,y2,r2){
  var a = x1-x2;
  var b = y1-y2;
  return calcCircleLineCrossPoint(a,b,0.5*((r1-r2)*(r1+r2)-a*(x1+x2)-b*(y1+y2)),x1,y1,r1);
}

// 交点１点以上の交点から１点選ぶ
function calcCandidatePoint(anotherCircle, results){
  var result = {};
  if(results.length == 2){
    length1 = Math.sqrt(Math.pow(anotherCircle.x - results[0].x, 2) + Math.pow(anotherCircle.y - results[0].y, 2));
    length2 = Math.sqrt(Math.pow(anotherCircle.x - results[1].x, 2) + Math.pow(anotherCircle.y - results[1].y, 2));
    result = (length2 > length1) ? results[0] : results[1];
  }
  return result;
}

// ３つの円(beacon)のうち、一番近い円を選ぶ
function getMostNearlyBeacon(circles){
  var mostNearlyBeacon = circles[0];
  if(mostNearlyBeacon.r > circles[1].r){
    mostNearlyBeacon = circles[1];
  }
  if(mostNearlyBeacon.r > circles[2].r){
    mostNearlyBeacon = circles[2];
  }
  return mostNearlyBeacon;
}

// ２点間の距離を計算
function calcDistance(pointA, pointB){
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

BeaconLocationManager.getCurrentPosition = function (circles){
  var candidatePoints = []
    var mostNearlyBeacon = getMostNearlyBeacon(circles);

  candidatePoints.push(calcCandidatePoint(circles[2], calcTwoCirclesCrossPoint(circles[0].x, circles[0].y, circles[0].r,
          circles[1].x, circles[1].y, circles[1].r)));
  candidatePoints.push(calcCandidatePoint(circles[1], calcTwoCirclesCrossPoint(circles[0].x, circles[0].y, circles[0].r,
          circles[2].x, circles[2].y, circles[2].r)));
  candidatePoints.push(calcCandidatePoint(circles[0], calcTwoCirclesCrossPoint(circles[1].x, circles[1].y, circles[1].r,
          circles[2].x, circles[2].y, circles[2].r)));
  //console.log('candidatePoints-----');
  //console.log(candidatePoints);

  if(candidatePoints.length == 3){
    var currentX = (candidatePoints[0].x + candidatePoints[1].x + candidatePoints[2].x) / 3.0;
    var currentY = (candidatePoints[0].y + candidatePoints[1].y + candidatePoints[2].y) / 3.0;
    return {x: currentX, y: currentY};
  }
  else{
    return {};
  }
  /*
  var points = [];
  candidatePoints.forEach(function(result){
    if(Object.keys(result).length !== 0){
      points.push({point: result, length: calcDistance(mostNearlyBeacon, result)});
    }
  });

  points.sort(function(a, b){
    return a.length -b.length;
  });
  
  if(points.length != 0){
    return points[0].point;
  } else {
    return {};
  }
  */
}

module.exports = BeaconLocationManager;
