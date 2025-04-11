export function render(root: HTMLElement) {
    root.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-black">
        <canvas id="pong" class="border border-white"></canvas>
      </div>
    `
  
    const canvas = document.getElementById('pong') as HTMLCanvasElement
    canvas.width = 800
    canvas.height = 600
    const ctx = canvas.getContext('2d')!
  
    // Simple Pong loop stub
    ctx.fillStyle = 'white'
    ctx.fillRect(390, 290, 20, 20)
  
    // TODO: game logic, input, networking
  }
  