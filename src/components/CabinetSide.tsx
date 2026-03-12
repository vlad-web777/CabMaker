import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

interface CabinetSideProps {
  height: number
  depth: number
  thickness: number
  kickHeight: number
  kickDepth: number
}

const CabinetSide: React.FC<CabinetSideProps> = ({
  height,
  depth,
  thickness,
  kickHeight,
  kickDepth
}) => {

  const geometry = useMemo(() => {

    const shape = new THREE.Shape()

    shape.moveTo(kickDepth, 0)
    shape.lineTo(depth, 0)
    shape.lineTo(depth, height)
    shape.lineTo(0, height)
    shape.lineTo(0, kickHeight)
    shape.lineTo(kickDepth, kickHeight)
    shape.lineTo(kickDepth, 0)

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: false
    }

    return new THREE.ExtrudeGeometry(shape, extrudeSettings)

  }, [height, depth, thickness, kickHeight, kickDepth])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#d2b48c" />
    </mesh>
  )
}

const Scene: React.FC = () => {

  const [height, setHeight] = React.useState(34.5)
  const [depth, setDepth] = React.useState(24)
  const [thickness, setThickness] = React.useState(0.75)
  const [kickHeight, setKickHeight] = React.useState(4)
  const [kickDepth, setKickDepth] = React.useState(3)

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* 3D View */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [40, 40, 40], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[20,20,20]} />

          <CabinetSide
            height={height}
            depth={depth}
            thickness={thickness}
            kickHeight={kickHeight}
            kickDepth={kickDepth}
          />

          <OrbitControls />
        </Canvas>
      </div>

      {/* Controls */}
      <div style={{ width: 300, padding: 20, background: "#f0f0f0" }}>
        <h2>Cabinet Side Parameters</h2>

        <div>
          <label>Height (in)</label>
          <input
            type="number"
            step="0.1"
            value={height}
            onChange={(e)=>setHeight(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Depth (in)</label>
          <input
            type="number"
            step="0.1"
            value={depth}
            onChange={(e)=>setDepth(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Thickness (in)</label>
          <input
            type="number"
            step="0.01"
            value={thickness}
            onChange={(e)=>setThickness(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Kick Height (in)</label>
          <input
            type="number"
            step="0.1"
            value={kickHeight}
            onChange={(e)=>setKickHeight(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Kick Depth (in)</label>
          <input
            type="number"
            step="0.1"
            value={kickDepth}
            onChange={(e)=>setKickDepth(parseFloat(e.target.value))}
          />
        </div>

      </div>

    </div>
  )
}

export default Scene