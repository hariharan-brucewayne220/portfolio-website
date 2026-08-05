'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// A restrained "distributed system" backdrop: dim nodes drifting slowly in 3D,
// linked by faint lines when close. Monochrome teal on near-black, gentle
// mouse parallax, no interaction gimmicks.
const NODE_COUNT = 110
const LINK_DISTANCE = 34
const BOUNDS = { x: 120, y: 70, z: 50 }

export default function NetworkBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0a0e14, 90, 210)

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500)
    camera.position.z = 120

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    mount.appendChild(renderer.domElement)

    // Nodes
    const positions = new Float32Array(NODE_COUNT * 3)
    const velocities = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2 * BOUNDS.x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS.y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOUNDS.z
      velocities[i * 3] = (Math.random() - 0.5) * 0.045
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.045
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    const nodeGeometry = new THREE.BufferGeometry()
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x5eead4,
      size: 1.6,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial)
    scene.add(nodes)

    // Links (preallocated; trimmed with setDrawRange each frame)
    const maxLinks = (NODE_COUNT * (NODE_COUNT - 1)) / 2
    const linkPositions = new Float32Array(maxLinks * 6)
    const linkGeometry = new THREE.BufferGeometry()
    linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
    const linkMaterial = new THREE.LineBasicMaterial({
      color: 0x3b6f68,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
    const links = new THREE.LineSegments(linkGeometry, linkMaterial)
    scene.add(links)

    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    let hidden = false
    const onVisibility = () => {
      hidden = document.hidden
    }
    document.addEventListener('visibilitychange', onVisibility)

    const step = () => {
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let a = 0; a < 3; a++) {
          const idx = i * 3 + a
          positions[idx] += velocities[idx]
          const bound = a === 0 ? BOUNDS.x : a === 1 ? BOUNDS.y : BOUNDS.z
          if (positions[idx] > bound || positions[idx] < -bound) velocities[idx] *= -1
        }
      }
      nodeGeometry.attributes.position.needsUpdate = true

      let linkCount = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = positions[i * 3] - positions[j * 3]
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
          if (dx * dx + dy * dy + dz * dz < LINK_DISTANCE * LINK_DISTANCE) {
            const o = linkCount * 6
            linkPositions[o] = positions[i * 3]
            linkPositions[o + 1] = positions[i * 3 + 1]
            linkPositions[o + 2] = positions[i * 3 + 2]
            linkPositions[o + 3] = positions[j * 3]
            linkPositions[o + 4] = positions[j * 3 + 1]
            linkPositions[o + 5] = positions[j * 3 + 2]
            linkCount++
          }
        }
      }
      linkGeometry.setDrawRange(0, linkCount * 2)
      linkGeometry.attributes.position.needsUpdate = true

      // Gentle parallax toward the cursor
      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.02
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      scene.rotation.y += 0.0004
      renderer.render(scene, camera)
    }

    let frameId = 0
    let lastTime = 0
    const frameInterval = 1000 / 30
    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate)
      if (hidden || time - lastTime < frameInterval) return
      lastTime = time
      step()
    }

    if (reducedMotion) {
      step() // single static frame
    } else {
      frameId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      nodeGeometry.dispose()
      linkGeometry.dispose()
      nodeMaterial.dispose()
      linkMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  )
}
