import React, { useEffect, useRef } from 'react';
import {
  useLocation
} from 'react-router-dom';
import * as THREE from "three";
import { gsap } from "gsap";

export const WebglBG = (props) => {

  const location = useLocation();

  const firstRef = useRef(0);
  const requestRef = useRef();
  const pathRef = useRef(1);

  const move1Ref = useRef(100);
  const move2Ref = useRef(100);
  const move3Ref = useRef(100);

  let scene;
  let camera;

  let renderer;

  let width = window.innerWidth;
  let height = window.innerHeight;

  let cubeGeometry;
  let cube;

  const onCanvasLoaded = (canvas) => {
    if (!canvas) {
      return;
    }
    if (firstRef.current === 0) {
      firstRef.current = 1;
      createBox();
    }
  };

  const onHomeEndHandler = () => {
    props.fromHomeNotice();
  };

  const onAboutEndHandler = () => {
    props.fromAboutNotice();
  };

  const createBox = () => {

    const canvas = document.getElementById('webgl-canvas');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, width / height, 1, 10000 );
    camera.position.set(0, 0, width / 2);

    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1.0);

    cubeGeometry = new THREE.BoxBufferGeometry(300, 300, 300, 10, 10, 10);

    const grow_cubeGeometry = new THREE.BoxBufferGeometry(600, 300, 300, 10, 10, 10);

    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xa0a0a0,
      wireframe: true,
      morphTargets: true
    });

    const pos = cubeGeometry.attributes.position;
    const grow_pos = grow_cubeGeometry.attributes.position;

    cubeGeometry.morphAttributes.position = [];

    cubeGeometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(pos, 3);
    cubeGeometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(pos, 3);

    let spherePositions = [];
    let v3 = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i).setLength((150 * Math.sqrt(3) + 150) * 0.5);
      spherePositions.push(v3.x, v3.y, v3.z);
    }

    const twistPositions = [];
    const direction = new THREE.Vector3( 1, 0, 0 );
    const vertex = new THREE.Vector3();

    for (let i = 0; i < grow_pos.count; i++) {
      const x = grow_pos.getX( i );
      const y = grow_pos.getY( i );
      const z = grow_pos.getZ( i );
      vertex.set(x, y, z);
      vertex.applyAxisAngle(direction, Math.PI * x / 2.1).toArray(twistPositions, twistPositions.length);
    }

    cubeGeometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(spherePositions, 3);

    cubeGeometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    cube.geometry.attributes.position.needsUpdate = true;

    window.addEventListener("resize", () => handleResize());

    tick();

  };

  function gotoTwist() {
    move3Ref.current = 0;
    let timelineBox = gsap.timeline({
      paused: false
    });
    timelineBox
      .to(cube.morphTargetInfluences, { "0":0, duration: 1, ease: "slow(0.7, 0.7, false)" })
      .to(cube.morphTargetInfluences, { "1":1, duration: 1, ease: "slow(0.7, 0.7, false)" },"-=1")
      .call(gotoTwistEnd);
  }

  function gotoTwistEnd() {
    move1Ref.current = 100;
    move2Ref.current = 100;
    move3Ref.current = 0;
    //console.log("ani3end");
    //onHomeEndHandler();
  }

  function gotoSphere() {
    move2Ref.current = 0;
    let timelineBox = gsap.timeline({
      paused: false
    });
    timelineBox
      .to(cube.morphTargetInfluences, { "0":1, duration: 1, ease: "slow(0.7, 0.7, false)" })
      .to(cube.morphTargetInfluences, { "1":0, duration: 1, ease: "slow(0.7, 0.7, false)" },"-=1")
      .call(gotoSphereEnd);
  }

  function gotoSphereEnd() {
    move1Ref.current = 100;
    move2Ref.current = 0;
    move3Ref.current = 100;
    //console.log("ani1end");
    //onHomeEndHandler();
  }

  function gotoTop() {
    move1Ref.current = 0;
    let timelineBox2 = gsap.timeline({
      paused: false
    });
    timelineBox2
      .to(cube.morphTargetInfluences, { "0":0, duration: 1, ease: "slow(0.7, 0.7, false)" })
      .to(cube.morphTargetInfluences, { "1":0, duration: 1, ease: "slow(0.7, 0.7, false)" },"-=1")
      .call(gotoTopEnd);
  }

  function gotoTopEnd() {
    move1Ref.current = 0;
    move2Ref.current = 100;
    move3Ref.current = 100;
    //console.log("ani2end");
    //onAboutEndHandler();
  }

  const handleResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.position.set(0, 0, width / 2);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  const tick = () => {
    cube.rotation.y = cube.rotation.y - 0.01;
    if (pathRef.current !== undefined) {
      if (pathRef.current === 3) {
        if (move3Ref.current > 0) {
          gotoTwist();
        }
      } else if (pathRef.current === 2) {
        if (move2Ref.current > 0) {
          gotoSphere();
        }
      } else {
        if (move1Ref.current > 0) {
          gotoTop();
        }
      }
    }
    renderer.render(scene, camera);
    requestRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (location.pathname === '/twist') {
      pathRef.current = 3;
    } else if (location.pathname === '/sphere') {
      pathRef.current = 2;
    } else {
      pathRef.current = 1;
    }
  }, [location.pathname]);

  return (
    <canvas id="webgl-canvas" ref={onCanvasLoaded} />
  );
};

export default WebglBG;