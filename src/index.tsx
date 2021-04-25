import ReactDOM from 'react-dom'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Entity, Facet, useAnimationFrame, useECS, useQuery, useSystem } from '@react-ecs/core'
import { Vector3 } from 'three'
import { ThreeView } from '@react-ecs/three'
import { Torus } from '@react-three/drei'

import './index.css'

class Spin extends Facet<Spin> {
  amount? = new Vector3(0, 1, 0)
}

const SpinSystem = () => {
  const query = useQuery((e) => e.hasAll(ThreeView, Spin))

  return useSystem((dt) => {
    query.loop([ThreeView, Spin], (e, [view, spin]) => {
      const rot = view.object3d.rotation
      rot.x += spin.amount.x * dt
      rot.y += spin.amount.y * dt
      rot.z += spin.amount.z * dt
    })
  })
}

const CoolSim = () => {
  const ECS = useECS()
  useAnimationFrame(ECS.update)

  return (
    <Canvas>
      <ECS.Provider>
        <SpinSystem />
        <Entity>
          <Spin />
          <ThreeView>
            <Torus />
          </ThreeView>
        </Entity>
      </ECS.Provider>
    </Canvas>
  )
}

ReactDOM.render(<CoolSim />, document.getElementById('root'))