export default function LoadingOverlay() {
  return (
    <div className="h-[100vh] w-[100vw] fixed top-0 left-0 bg-black bg-opacity-20 z-[10000] flex justify-center items-center">
      <l-hourglass
        size="70"
        stroke-length="0.35"
        speed=" 1.0"
        // stroke='6.0'
        color="#1f69f3"
      ></l-hourglass>
    </div>
  );
}