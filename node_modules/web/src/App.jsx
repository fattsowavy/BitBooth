import { useState } from 'react'
import './index.css'
import SelectFrame from './SelectFrame'
import CameraInterface from './CameraInterface'
import EditScreen from './EditScreen'
import ResultScreen from './ResultScreen'
import usePhotoSession from './hooks/usePhotoSession'

function App() {
  const [currentScreen, setCurrentScreen] = useState('start')
  const photoSession = usePhotoSession()

  if (currentScreen === 'camera') {
    return (
      <CameraInterface
        session={photoSession.session}
        capturePhoto={photoSession.capturePhoto}
        capturedCount={photoSession.capturedCount}
        onBack={() => setCurrentScreen('select-frame')}
        onFinish={() => setCurrentScreen('edit')}
      />
    )
  }

  if (currentScreen === 'edit') {
    return (
      <EditScreen
        session={photoSession.session}
        addSticker={photoSession.addSticker}
        updateSticker={photoSession.updateSticker}
        removeSticker={photoSession.removeSticker}
        undoLastSticker={photoSession.undoLastSticker}
        retakePhoto={photoSession.retakePhoto}
        onBack={() => setCurrentScreen('camera')}
        onDone={() => setCurrentScreen('result')}
      />
    )
  }

  if (currentScreen === 'result') {
    return (
      <ResultScreen
        session={photoSession.session}
        onRestart={() => {
          photoSession.resetSession()
          setCurrentScreen('start')
        }}
      />
    )
  }

  if (currentScreen === 'select-frame') {
    return (
      <SelectFrame
        onBack={() => setCurrentScreen('start')}
        onSelect={(frameKey) => {
          photoSession.selectFrame(frameKey)
          setCurrentScreen('camera')
        }}
      />
    )
  }

  return (
    <>
      {/* CRT Visual Effects Layers */}
      <div className="crt-overlay"></div>
      <div className="crt-vignette"></div>

      {/* Main Arcade Cabinet Background */}
      <div className="fixed inset-0 bg-arcade-green flex flex-col items-center justify-between overflow-hidden">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pixel-grid-bg opacity-30"></div>
        <div className="absolute inset-0 pixel-stars opacity-10"></div>

        {/* Header / Status Bar */}
        <header className="w-full p-6 flex justify-between items-start z-10 font-retro text-[10px] md:text-xs text-primary/80">
          <div className="flex flex-col gap-2">
            <p className="animate-pulse">1P READY</p>
            <p className="text-white/60">HI-SCORE: 999999</p>
          </div>
          <div className="text-right">
            <p>LEVEL 01</p>
            <p className="text-arcade-neon">PHOTO MODE: ON</p>
          </div>
        </header>

        {/* Central Hero Section */}
        <main className="flex flex-col items-center justify-center flex-grow z-10 px-4 text-center">

          {/* Branding Section */}
          <div className="mb-12 relative">
            <h1 className="font-retro text-5xl md:text-7xl lg:text-8xl glitch-text leading-tight mb-4 tracking-tighter uppercase">
              Bit<br />Booth
            </h1>
            <p className="font-retro text-[10px] md:text-sm text-arcade-gold tracking-widest opacity-80 uppercase">
              Step into the 8-bit dimension
            </p>
          </div>

          {/* Primary Action */}
          <div className="relative group mt-8">
            <button
              onClick={() => setCurrentScreen('select-frame')}
              className="font-retro text-xl md:text-2xl bg-arcade-gold text-arcade-green px-8 py-6 pixel-border button-glow hover:bg-white transition-all transform hover:scale-105 active:scale-95 group"
            >
              INSERT COIN
            </button>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-retro text-[10px] text-white/40 animate-flicker w-full">
              PRESS START TO BEGIN
            </div>
          </div>

          {/* Visual Decoration: Floating Elements */}
          <div className="absolute top-1/4 left-10 md:left-20 animate-bounce duration-[3000ms]">
            <div className="w-12 h-12 bg-primary/20 pixel-border opacity-50 rotate-12"></div>
          </div>
          <div className="absolute bottom-1/4 right-10 md:right-20 animate-bounce duration-[4000ms]">
            <div className="w-8 h-8 bg-arcade-neon/20 pixel-border opacity-50 -rotate-12"></div>
          </div>
        </main>

        {/* Footer / Machine HUD */}
        <footer className="w-full bg-black/40 backdrop-blur-sm border-t-4 border-black p-4 z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 font-retro text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-white/80">SYSTEM: OPTIMAL</span>
              </div>
              <div className="text-primary">CREDIT: 00</div>
            </div>

            <div className="flex items-center gap-8 font-retro text-[10px] text-white/60">
              <a className="hover:text-arcade-neon transition-colors" href="#">GALLERY</a>
              <a className="hover:text-arcade-neon transition-colors" href="#">ABOUT</a>
              <a className="hover:text-arcade-neon transition-colors" href="#">TERMS</a>
            </div>

            {/* Help Toggle */}
            <div className="fixed bottom-6 right-6 group">
              <button className="bg-black text-white p-3 pixel-border hover:bg-primary transition-colors flex items-center justify-center">
                <span className="material-icons text-xl">help_outline</span>
              </button>

              {/* Tooltip Style Instruction */}
              <div className="absolute bottom-16 right-0 w-64 bg-black/90 p-4 pixel-border border-primary hidden group-hover:block transition-all">
                <h4 className="font-retro text-[10px] text-arcade-neon mb-3">HOW TO PLAY</h4>
                <ul className="font-display text-xs space-y-2 text-white/80 list-none text-left">
                  <li className="flex items-start gap-2"><span className="text-arcade-gold font-retro">1</span> Grant camera access</li>
                  <li className="flex items-start gap-2"><span className="text-arcade-gold font-retro">2</span> Strike your pose</li>
                  <li className="flex items-start gap-2"><span className="text-arcade-gold font-retro">3</span> Collect pixel export</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

        {/* Decorative Arcade Side Panels */}
        <div className="hidden lg:block fixed top-0 left-0 h-full w-12 bg-black/30 border-r border-white/5"></div>
        <div className="hidden lg:block fixed top-0 right-0 h-full w-12 bg-black/30 border-l border-white/5"></div>
      </div>
    </>
  )
}

export default App
