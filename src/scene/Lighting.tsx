export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.2}
        color="#bfeaff"
        castShadow
      />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.5}
        color="#9bffd0"
      />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#5fe3ff" />
    </>
  );
}
