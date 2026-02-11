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
      <div className="fixed inset-0 bg-arcade-green flex flex-col items-center justify-between overflow-hidden h-screen w-screen">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pixel-grid-bg opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 pixel-stars opacity-10 pointer-events-none"></div>

        {/* Header / Status Bar */}
        <header className="w-full p-4 md:p-6 flex justify-between items-start z-10 font-retro text-[8px] md:text-xs text-primary/80 shrink-0">
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="animate-pulse">1P READY</p>
            <p className="text-white/60">HI-SCORE: 999999</p>
          </div>
          <div className="text-right">
            <p>LEVEL 01</p>
            <p className="text-arcade-neon">PHOTO MODE: ON</p>
          </div>
        </header>

        {/* Central Hero Section */}
        <main className="flex flex-col items-center justify-center flex-grow z-10 px-4 text-center w-full max-w-4xl mx-auto overflow-hidden">
          <div className="flex flex-col items-center scale-90 md:scale-100 transition-transform origin-center">
            {/* Branding Section */}
            <div className="mb-6 md:mb-10 relative">
              <h1 className="font-retro text-[clamp(2.5rem,10vw,4.5rem)] md:text-6xl lg:text-7xl glitch-text leading-tight mb-2 md:mb-4 tracking-tighter uppercase">
                Bit<br className="md:hidden" />Booth
              </h1>
              <p className="font-retro text-[8px] md:text-sm text-arcade-gold tracking-widest opacity-80 uppercase px-4">
                Step into the 8-bit dimension
              </p>
            </div>

            {/* Primary Action */}
            <div className="relative group mt-4 md:mt-8 w-full max-w-xs md:max-w-none hover:scale-105 transition-transform duration-300">
              <button
                onClick={() => setCurrentScreen('select-frame')}
                className="w-full md:w-auto font-retro text-lg md:text-2xl bg-arcade-gold text-arcade-green px-8 py-4 md:px-10 md:py-6 pixel-border button-glow hover:bg-white transition-all transform active:scale-95 group relative overflow-hidden"
              >
                <span className="relative z-10">INSERT COIN</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 font-retro text-[8px] md:text-[10px] text-white/40 animate-flicker w-full whitespace-nowrap">
                PRESS START TO BEGIN
              </div>
            </div>
          </div>

          {/* Visual Decoration: Floating Elements - Hide on mobile to reduce clutter */}
          <div className="hidden md:block absolute top-1/4 left-10 md:left-20 animate-bounce duration-[3000ms]">
            <div className="w-12 h-12 bg-primary/20 pixel-border opacity-50 rotate-12"></div>
          </div>
          <div className="hidden md:block absolute bottom-1/4 right-10 md:right-20 animate-bounce duration-[4000ms]">
            <div className="w-8 h-8 bg-arcade-neon/20 pixel-border opacity-50 -rotate-12"></div>
          </div>
        </main>

        {/* Footer / Machine HUD */}
        <footer className="w-full bg-black/40 backdrop-blur-sm border-t-4 border-black p-3 md:p-4 z-10 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <div className="flex items-center gap-4 md:gap-6 font-retro text-[8px] md:text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-white/80">SYSTEM: OPTIMAL</span>
              </div>
              <div className="text-primary">CREDIT: 00</div>
            </div>

            <div className="flex items-center gap-4 md:gap-8 font-retro text-[8px] md:text-[10px] text-white/60">
              <a
                className="hover:text-arcade-neon transition-colors underline decoration-dotted underline-offset-4"
                href="https://github.com/fattsowavy"
                target="_blank"
                rel="noopener noreferrer"
              >
                MADE BY FATTSOWAVY
              </a>
            </div>

            {/* Help Toggle */}
            <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 group z-50">
              <button className="bg-black text-white p-2 md:p-3 pixel-border hover:bg-primary transition-colors flex items-center justify-center">
                <span className="material-icons text-lg md:text-xl">help_outline</span>
              </button>

              {/* Tooltip Style Instruction */}
              <div className="absolute bottom-12 md:bottom-16 right-0 w-56 md:w-64 bg-black/90 p-3 md:p-4 pixel-border border-primary hidden group-hover:block transition-all">
                <h4 className="font-retro text-[8px] md:text-[10px] text-arcade-neon mb-2 md:mb-3">HOW TO PLAY</h4>
                <ul className="font-display text-[10px] md:text-xs space-y-1 md:space-y-2 text-white/80 list-none text-left">
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
