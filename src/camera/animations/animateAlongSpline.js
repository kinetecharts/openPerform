import TWEEN from 'tween'

var AnimateAlongSpline = function(scene, controls, object, sPos, tPos, lookAt, params) {
    this.scene = scene;
    this.controls = controls;
    this.object = object;
    this.sPos = sPos;
    this.tPos = tPos;

    this.lookAt = lookAt;

    this.arcHeight = params.arcHeight || 0.75;
    this.visible = params.visible || true;

    this.animateLine = params.animateLine || false;
    this.animationType = params.animationType || "linear";
    this.lineColor = params.lineColor || 0xFFFFFF;

    this.circle = null;

    this.easing = params.easing || TWEEN.Easing.Cubic.Out
    this.duration = params.duration || 3000;
    this.numPoints = (this.duration * 60 / 1000 + 60) * 2;
    this.focus = params.focus || null;
    this.delay = params.delay || 0;

    this.look = params.look || "forward";

    this.creatures = params.creatures || null;

    this.tweens = [];
};

AnimateAlongSpline.prototype.hide = function() {
    this.line.visible = false;
    this.object.visible = false;
    this.visible = false;
    if (this.animationType == "multi") {
        this.line2.visible = false;
        if (this.circle)
            this.circle.visible = false;
    }
}

AnimateAlongSpline.prototype.show = function() {
    this.line.visible = true;
    this.object.visible = true;
    this.visible = true;
    if (this.animationType == "multi") {
        this.line2.visible = true;
    }
}

AnimateAlongSpline.prototype.greatCircleFunction = function(P, Q)
{
    var angle = P.angleTo(Q);
    return function(t)
    {
        var X = new THREE.Vector3().addVectors(
            P.clone().multiplyScalar(Math.sin( (1 - t) * angle )), 
            Q.clone().multiplyScalar(Math.sin(      t  * angle )))
            .divideScalar( Math.sin(angle) );
        return X;
    };
}

AnimateAlongSpline.prototype.createSphereArc = function(P,Q)
{
    var sphereArc = new THREE.Curve();
    sphereArc.getPoint = this.greatCircleFunction(P,Q);
    return sphereArc;
}

AnimateAlongSpline.prototype.drawCurve = function(curve, color, numPoints, visible)
{
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = curve.getPoints(numPoints);
    // lineGeometry.computeLineDistances();
    var lineMaterial = new THREE.LineBasicMaterial();
    lineMaterial.color = (typeof(color) === "undefined") ? new THREE.Color(0xFF0000) : new THREE.Color(color);
    var line = new THREE.Spline( lineGeometry.vertices );

    // line.geometry.dynamic = true;
    // line.visible = visible;
    // line.frustumCulled = false;

    return line;
}

AnimateAlongSpline.prototype.start = function() {
    var scope = this;

    this.spline = this.createSphereArc(this.sPos,this.tPos);
    this.spline = this.drawCurve( this.spline, this.lineColor, this.numPoints, this.visible);
    this.scene.add(this.spline);

    var trim = 0.001;
    var gap = 0.0;


    if (this.animationType == "linear") {
        var idx = 0;
        var srcLook = this.controls.target.clone()
        var objTween = new TWEEN.Tween({
                percent: trim,
                lookX: srcLook.x,
                lookY: srcLook.y,
                lookZ: srcLook.z 
            })
            .to({
                percent: 0.999999,
                lookX: this.lookAt.x,
                lookY: this.lookAt.y,
                lookZ: this.lookAt.z
            }, this.duration)
            .onUpdate(function() {
				if(!scope.object){
					return;
				}


                var currentPoint = scope.spline.getPoint(this.percent);
                // var currentIdx = Math.floor(this.percent * 99);
                // if (idx < scope.numPoints - 2) { //safe guard array limit
                //     if (idx > 0)
                //         scope.line.geometry.vertices[idx].copy(scope.line.geometry.vertices[idx - 1]);
                //     idx++
                //     scope.line.geometry.vertices[idx].copy(currentPoint);
                //     idx++;
                // }
                // scope.line.geometry.verticesNeedUpdate = true;

                // switch (scope.look) {
                //     case "forward":
                //         // var look = new THREE.Vector3(this.lookX, this.lookY, this.lookZ);
                        var look = new THREE.Vector3(this.lookX, this.lookY, this.lookZ);
                        // console.log("look: ", look);
                        scope.controls.target.copy(look);
                //         break;

                //     case "camera":
                //         scope.object.lookAt(this.controls.object.position);
                //         scope.object.up.copy(this.controls.object.up);
                //         break;
                // }

                // currentPoint.x = currentPoint.x.toFixed(3);
                // currentPoint.y = currentPoint.y.toFixed(3);
                // currentPoint.z = currentPoint.z.toFixed(3);
                // console.log(currentPoint);
                scope.object.position.copy(currentPoint);
            })
            .easing(this.easing)
            .delay(this.delay)
            .onComplete(function() {
                scope._handleCallback(objTween);
            })
            .start();
        this.tweens.push[objTween];

    } else if (this.animationType == "multi") {
        var idx1 = 0;
        var srcTween = new TWEEN.Tween({
                percent: trim
            })
            .to({
                percent: 0.5 - gap / 2
            }, this.duration)
            .onUpdate(function() {
					if(!scope.object){
					return;
				}

                var currentPoint = scope.spline.getPointAt(this.percent);
                var currentidx1 = Math.floor(this.percent * 99);
                if (idx1 < scope.numPoints - 2) { //safe guard array limit
                    if (idx1 > 0)
                        scope.line.geometry.vertices[idx1].copy(scope.line.geometry.vertices[idx1 - 1]);
                    idx1++
                    scope.line.geometry.vertices[idx1].copy(currentPoint);
                    idx1++;
                }
                scope.line.geometry.verticesNeedUpdate = true;

                switch (scope.look) {
                    case "forward":
                        //hack to get extruded shape to rotate properly
                        var dir = scope.spline.getPointAt(this.percent).clone().sub(scope.spline.getPointAt(this.percent - .05).clone()).normalize();
                        var up = scope.line.up.clone();
                        var shift = up.cross(dir).normalize().multiplyScalar(-Math.abs(10));
                        scope.object.lookAt(scope.spline.getPointAt(this.percent).clone().add(shift));
                        break;

                    case "camera":
                        scope.object.lookAt(this.controls.object.position);
                        scope.object.up.copy(this.controls.object.up);
                        break;
                }
                scope.object.position.copy(scope.spline.getPointAt(0.5));
            })
            .easing(this.easing)
            .delay(this.delay)
            .onComplete(function() {
                scope.show();
                if (scope.creatures !== null) {
                    for (var i = 0; i < scope.creatures.length; i++) {
                        scope.creatures[i].circle("out", scope.lineColor);
                    }
                }
                scope._handleCallback(srcTween);

            })
            .start();
        this.tweens.push[srcTween];

        var idx2 = 0;
        var desTween = new TWEEN.Tween({
                percent: 1 - trim
            })
            .to({
                percent: 0.5 + gap / 2
            }, this.duration)
            .onUpdate(function() {
			 	if(!scope.object){
					return;
				}

                var currentPoint = scope.spline.getPointAt(this.percent);
                var currentidx2 = Math.floor(this.percent * 99);
                if (idx2 < scope.numPoints - 2) { //safe guard array limit
                    if (idx2 > 0)
                        scope.line2.geometry.vertices[idx2].copy(scope.line2.geometry.vertices[idx2 - 1]);
                    idx2++
                    scope.line2.geometry.vertices[idx2].copy(currentPoint);
                    idx2++;
                }
                scope.line2.geometry.verticesNeedUpdate = true;
            })
            .easing(this.easing)
            .delay(this.delay)
            .onComplete(function() {
                scope._handleCallback(desTween);
            })
            .start();
        this.tweens.push[desTween];
    }

	return this;
};

AnimateAlongSpline.prototype._handleCallback = function(tween) {
    if (this.tweens && this.tweens.length > 0) {
        for (var tempIndex in this.tweens) {
            this.tweens[tempIndex].stop();
        }
        this.tweens = [];
    }

    if (this.callback && (!this.tweens || this.tweens.length == 0)) {
        this.callback();
    }
};

AnimateAlongSpline.prototype.stop = function() {
    if (this.tweens && this.tweens.length > 0) {
        for (var tempIndex in this.tweens) {
            this.tweens[tempIndex].stop();
        }
        this.tweens = [];
    }
    this.destory();
};

AnimateAlongSpline.prototype.destory = function() {
    if (this.line) {
        this.scene.remove(this.line);
        this.line = null;
    }

    if (this.line2) {
        this.scene.remove(this.line2);
        this.line2 = null;
    }

    this.scene = null;
    this.controls = null;
    this.object = null;
    this.sPos = null;
    this.tPos = null;

};

AnimateAlongSpline.prototype.onComplete = function(callback) {
    this.callback = callback;
    return this;
};

AnimateAlongSpline.prototype.getSplineMidPoint = function(sourcePos, targetPos, scale) {
    // this.line.up.copy(this.midpoint05.sub(new THREE.Vector3(0,0,0)).normalize());
    var direct = targetPos.clone().sub(sourcePos);
    direct.y = 0;
    direct.normalize();
    var dist = sourcePos.distanceTo(targetPos);
    var center = sourcePos.clone().add(targetPos).divideScalar(2);

    var camUp = this.controls.object.up.clone();
    var projection = camUp.dot(direct);
    var normDir = camUp;
    normDir.sub(direct.multiplyScalar(projection)).normalize();
    return center.add(normDir.multiplyScalar(scale * dist));
};

export default AnimateAlongSpline